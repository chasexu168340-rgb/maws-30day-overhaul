import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

let server;
let baseURL;

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath === '/' ? ENTRY : urlPath);
  const target = path.resolve(ROOT, `.${decoded}`);
  const relative = path.relative(ROOT, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return target;
}

test.beforeAll(async () => {
  if (process.env.MAWS_URL) {
    baseURL = process.env.MAWS_URL;
    return;
  }

  server = createServer(async (req, res) => {
    const target = safePath(new URL(req.url || '/', 'http://127.0.0.1').pathname);
    if (!target) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const info = await stat(target);
      if (!info.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'content-type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream' });
      createReadStream(target).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseURL = `http://127.0.0.1:${port}${ENTRY}`;
      resolve();
    });
  });
});

test.afterAll(async () => {
  if (!server) return;
  await new Promise((resolve) => server.close(resolve));
});

function collectRuntimeErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function loadGame(page, viewport = { width: 900, height: 700 }) {
  const errors = collectRuntimeErrors(page);
  await page.setViewportSize(viewport);
  await page.goto(baseURL);
  await page.waitForFunction(
    () => window.MAWS_GAME && window.MAWS_STORE && document.querySelectorAll('canvas').length > 0,
    null,
    { timeout: 15000 }
  );
  await page.evaluate(() => {
    localStorage.clear();
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'worker' });
  });
  await page.locator('#maws-ui-root').waitFor({ state: 'attached' });
  return errors;
}

async function expectNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
    docScrollWidth: document.documentElement.scrollWidth
  }));
  const scrollWidth = Math.max(metrics.bodyScrollWidth, metrics.docScrollWidth);
  expect(scrollWidth, `${label} horizontal overflow`).toBeLessThanOrEqual(metrics.innerWidth + 1);
}

test('default director surface shows mainline summary and capped recommendations', async ({ page }) => {
  const errors = await loadGame(page);

  const mainlineSummary = page.locator('article').filter({ hasText: /今日主线/ }).first();
  await expect(mainlineSummary).toBeVisible();

  const mainlineTextLength = await mainlineSummary.evaluate((node) => node.textContent.trim().length);
  expect(mainlineTextLength, 'mainline summary should have visible content').toBeGreaterThan(8);

  const recommendationCount = await page.locator('.maws-recommend-card').count();
  expect(recommendationCount, 'director recommendations should exist').toBeGreaterThan(0);
  expect(recommendationCount, 'director recommendations should stay capped').toBeLessThanOrEqual(3);

  await expect(page.locator('.maws-recommend-card button').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('skills surface or its modal exposes a collapsible details affordance', async ({ page }) => {
  const errors = await loadGame(page);

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  await expect(page.locator('.maws-skill').first()).toBeVisible();

  const hasDisclosureOnSkills = await page.evaluate(() => Boolean(
    document.querySelector('.maws-skill details summary, .maws-skill .maws-disclosure')
  ));

  if (!hasDisclosureOnSkills) {
    const enabledSkillButton = page.locator('.maws-skill button:not([disabled])').first();
    if (await enabledSkillButton.count()) {
      await enabledSkillButton.click();
    }
  }

  const hasDisclosure = await page.waitForFunction(() => Boolean(
    document.querySelector(
      '.maws-skill details summary, .maws-skill .maws-disclosure, .maws-modal details summary, .maws-modal .maws-disclosure'
    )
  ), null, { timeout: 2000 }).then(() => true, () => false);

  expect(hasDisclosure, 'skills page or skill modal should expose details/summary or maws-disclosure').toBe(true);
  expect(errors).toEqual([]);
});

test('mobile director surface does not overflow at 390x844', async ({ page }) => {
  const errors = await loadGame(page, MOBILE_VIEWPORT);

  await expect(page.locator('article').filter({ hasText: /今日主线/ }).first()).toBeVisible();
  await expect(page.locator('.maws-recommend-card').first()).toBeVisible();
  await expectNoHorizontalOverflow(page, '390x844 director surface');

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  await expect(page.locator('.maws-skill').first()).toBeVisible();
  await expectNoHorizontalOverflow(page, '390x844 skills surface');

  expect(errors).toEqual([]);
});
