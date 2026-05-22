import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 900, height: 700 },
  { name: 'desktop', width: 1365, height: 768 }
];

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

async function loadGame(page, viewport) {
  const errors = collectRuntimeErrors(page);
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
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

test('location locks and metro station work in the real browser', async ({ page }) => {
  const errors = await loadGame(page, { width: 900, height: 700 });

  await page.locator('button[data-action="openCityMap"]').first().click();
  await expect(page.locator('button.maws-city-marker[data-loc="metro_station"]')).toBeVisible();
  expect(await page.locator('button.maws-city-marker.locked[data-text]').count()).toBeGreaterThan(0);

  const dayOneModel = await page.evaluate(() => {
    const state = window.MAWS_STORE.state;
    const unlocked = Object.keys(state.unlocked).filter((id) => state.unlocked[id]);
    return {
      day: state.day,
      loc: state.loc,
      unlocked,
      starterSlots: state.equipSkills
    };
  });
  expect(dayOneModel.day).toBe(1);
  expect(dayOneModel.loc).toBe('home');
  expect(dayOneModel.unlocked.sort()).toEqual(['guard', 'mystic', 'push_away', 'retreat', 'talkdown', 'wild_swing'].sort());
  expect(dayOneModel.unlocked).not.toContain('jab');
  expect(dayOneModel.unlocked).not.toContain('advance');
  expect(dayOneModel.starterSlots).toEqual(['wild_swing', 'push_away', 'mystic', 'guard', 'retreat', 'talkdown']);

  const lockedPark = page.locator('button.maws-city-marker.locked[data-text]').first();
  await lockedPark.click();
  await expect(page.locator('.maws-toast')).toBeVisible();
  expect(await page.evaluate(() => window.MAWS_STORE.state.ui.modal)).toBeNull();

  await page.locator('button.maws-city-marker[data-loc="metro_station"]').click();
  await expect(page.locator('button[data-action="travel"][data-loc="metro_station"]').first()).toBeVisible();
  await page.locator('button[data-action="travel"][data-loc="metro_station"]').first().click();
  await page.locator('button[data-action="closeModal"]').click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.loc)).toBe('metro_station');

  await expect(page.locator('button[data-action="doAction"][data-id="metro_observe"]')).toBeVisible();
  await page.locator('button[data-action="doAction"][data-id="metro_observe"]').click();
  await expect(page.locator('button[data-action="closeModal"]')).toBeVisible();

  await expectNoHorizontalOverflow(page, 'metro flow');
  expect(errors).toEqual([]);
});

for (const viewport of VIEWPORTS) {
  test(`responsive smoke at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const errors = await loadGame(page, viewport);

    await expectNoHorizontalOverflow(page, `${viewport.name} map`);

    await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
    await expect(page.locator('.maws-skill').first()).toBeVisible();
    await expectNoHorizontalOverflow(page, `${viewport.name} skills`);

    await page.evaluate(() => {
      window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' });
    });
    await expect(page.locator('.maws-combat-ui')).toBeVisible();
    await expectNoHorizontalOverflow(page, `${viewport.name} combat`);

    const state = await page.evaluate(() => ({
      combatActive: Boolean(window.MAWS_STORE.state.combat),
      loc: window.MAWS_STORE.state.loc,
      canvasCount: document.querySelectorAll('canvas').length
    }));
    expect(state.combatActive).toBe(true);
    expect(state.loc).toBe('home');
    expect(state.canvasCount).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}
