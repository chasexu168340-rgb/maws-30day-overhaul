import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1365, height: 768 };

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

async function loadGame(page, viewport = DESKTOP_VIEWPORT) {
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

async function visibleBox(page, selector) {
  return page.locator(selector).first().evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
}

test('combat planner keeps the current action window to one or two slots', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await expect(page.locator('.maws-combat-planner')).toBeVisible();

  const slotCount = await page.locator('.maws-queue-slot').count();
  expect(slotCount, 'combat should expose a focused 1-2 slot queue').toBeGreaterThanOrEqual(1);
  expect(slotCount, 'combat should not expose a long queue').toBeLessThanOrEqual(2);

  const joinButtons = page.locator('.maws-skill.combat-card:not(.disabled) footer button[data-action="selectSkill"]');
  await expect(joinButtons.first()).toBeVisible();
  await joinButtons.nth(0).click();
  if (await joinButtons.nth(1).count()) {
    await joinButtons.nth(1).click();
  }

  const filledSlots = await page.locator('.maws-queue-slot.filled').count();
  const activeCards = await page.locator('.maws-skill.combat-card.active').count();
  expect(filledSlots, 'only the current combat window should be highlighted').toBeGreaterThanOrEqual(1);
  expect(filledSlots, 'only the current combat window should be highlighted').toBeLessThanOrEqual(2);
  expect(activeCards, 'selected combat cards should stay capped to the current window').toBeLessThanOrEqual(2);
  await expect(page.locator('button[data-action="confirmBattle"]')).toBeVisible();

  expect(errors).toEqual([]);
});

test('action reward modal uses visible reward chips without turning small results into a wall', async ({ page }) => {
  const errors = await loadGame(page);

  const durationAction = page.locator('.maws-action').filter({ has: page.locator('.maws-duration-tag') }).first();
  await expect(durationAction).toBeVisible();
  await durationAction.locator('button[data-action="doAction"]').click();
  await expect(page.locator('.maws-modal.duration')).toBeVisible();

  await page.locator('button[data-action="chooseDuration"][data-duration="standard"]').click();
  await expect(page.locator('.maws-modal.result-compact')).toBeVisible();

  const rewardChips = page.locator('.maws-modal .maws-reward-chips.hero .maws-reward-chip');
  expect(await rewardChips.count(), 'reward chips should be surfaced in the result modal').toBeGreaterThan(0);
  await expect(rewardChips.first()).toBeVisible();

  const compactStats = await page.locator('.maws-modal section').first().evaluate((section) => {
    const visibleDirectTextBlocks = Array.from(section.querySelectorAll('p, li, .maws-result-summary > div, .maws-settle-line'))
      .filter((node) => !node.closest('details') && node.getBoundingClientRect().height > 0);
    return {
      textBlocks: visibleDirectTextBlocks.length,
      textLength: section.textContent.trim().length,
      detailsCount: section.querySelectorAll('details').length
    };
  });
  expect(compactStats.detailsCount, 'details should hold deep result information').toBeGreaterThanOrEqual(1);
  expect(compactStats.textBlocks, 'small result should keep the always-visible body compact').toBeLessThanOrEqual(5);
  expect(compactStats.textLength, 'small result should not render as a giant always-open report').toBeLessThan(1800);

  expect(errors).toEqual([]);
});

test('time investment modal opens and fits at 390x844', async ({ page }) => {
  const errors = await loadGame(page, MOBILE_VIEWPORT);

  const durationAction = page.locator('.maws-action').filter({ has: page.locator('.maws-duration-tag') }).first();
  await expect(durationAction).toBeVisible();
  await durationAction.locator('button[data-action="doAction"]').click();
  await expect(page.locator('.maws-modal.duration')).toBeVisible();
  await expect(page.locator('.maws-duration-choice')).toHaveCount(4);

  const box = await visibleBox(page, '.maws-modal.duration section');
  expect(box.left, 'duration modal should stay inside mobile viewport').toBeGreaterThanOrEqual(0);
  expect(box.right, 'duration modal should stay inside mobile viewport').toBeLessThanOrEqual(box.viewportWidth + 1);
  expect(box.width, 'duration modal should have a real mobile layout').toBeGreaterThan(280);
  expect(box.height, 'duration modal should not exceed mobile viewport height').toBeLessThanOrEqual(box.viewportHeight);
  await expectNoHorizontalOverflow(page, '390x844 duration modal');

  expect(errors).toEqual([]);
});

test('skills page keeps useful information visible outside details', async ({ page }) => {
  const errors = await loadGame(page, MOBILE_VIEWPORT);

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  await expect(page.locator('.maws-skill').first()).toBeVisible();

  const visibleSkillInfo = await page.locator('.maws-skill').first().evaluate((card) => {
    const outsideDetailsText = Array.from(card.querySelectorAll('header, .maws-skill-brief, footer'))
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join(' ');
    const detail = card.querySelector('details');
    const summary = detail?.querySelector('summary')?.textContent.trim() || '';
    return {
      outsideLength: outsideDetailsText.length,
      hasStatus: /熟练度|已装备|可装备|未学会|待解锁/.test(outsideDetailsText),
      hasSummary: summary.length > 0,
      detailOpen: Boolean(detail?.open)
    };
  });

  expect(visibleSkillInfo.outsideLength, 'skill cards should expose scan info before details').toBeGreaterThan(12);
  expect(visibleSkillInfo.hasStatus, 'skill cards should show status outside details').toBe(true);
  expect(visibleSkillInfo.hasSummary, 'skill cards may still provide expandable detail').toBe(true);
  expect(visibleSkillInfo.detailOpen, 'details should not hide all useful skill data by default').toBe(true);
  await expectNoHorizontalOverflow(page, '390x844 skills page');

  expect(errors).toEqual([]);
});
