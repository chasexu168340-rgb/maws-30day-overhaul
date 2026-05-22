import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const SCREENSHOT_DIR = path.join(ROOT, 'test-results', 'wave12');
const DESKTOP = { width: 1536, height: 864 };
const MOBILE = { width: 390, height: 844 };

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
  await mkdir(SCREENSHOT_DIR, { recursive: true });

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

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name), fullPage: true });
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

async function box(page, selector) {
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

async function expectReachableAboveNav(page, locator, label) {
  await locator.scrollIntoViewIfNeeded();
  const target = await locator.evaluate((node) => {
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
  const nav = await box(page, '.maws-nav');
  expect(target.width, `${label} should have clickable width`).toBeGreaterThan(32);
  expect(target.height, `${label} should have clickable height`).toBeGreaterThan(32);
  expect(target.left, `${label} should stay in the viewport`).toBeGreaterThanOrEqual(0);
  expect(target.right, `${label} should stay in the viewport`).toBeLessThanOrEqual(target.viewportWidth + 1);
  expect(target.top, `${label} should be reachable in the viewport`).toBeGreaterThanOrEqual(0);
  expect(target.bottom, `${label} should be reachable in the viewport`).toBeLessThanOrEqual(target.viewportHeight + 1);
  expect(target.bottom, `${label} should not be covered by bottom nav`).toBeLessThanOrEqual(nav.top + 1);
}

test('desktop map visual geometry stays inside the viewport', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  await expect(page.locator('.maws-scene')).toBeVisible();
  await expect(page.locator('.maws-scene-character').first()).toBeVisible();
  const mainAction = page.locator('.maws-action-rail-main .maws-actions-primary button[data-action="doAction"]').first();
  await expect(mainAction).toBeVisible();

  const sceneCharacter = await box(page, '.maws-scene-character');
  expect(sceneCharacter.width, 'scene character should not collapse on desktop').toBeGreaterThanOrEqual(72);
  expect(sceneCharacter.height, 'scene character should not collapse on desktop').toBeGreaterThanOrEqual(96);

  await expectReachableAboveNav(page, mainAction, 'desktop local action');

  await mainAction.click();
  await expect(page.locator('.maws-modal section').first()).toBeVisible();
  const modal = await page.locator('.maws-modal section').first().evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const style = window.getComputedStyle(node);
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      overflowY: style.overflowY,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
  expect(modal.left, 'modal should stay within desktop viewport').toBeGreaterThanOrEqual(0);
  expect(modal.right, 'modal should stay within desktop viewport').toBeLessThanOrEqual(modal.viewportWidth + 1);
  expect(modal.top, 'modal should stay within desktop viewport').toBeGreaterThanOrEqual(0);
  expect(modal.bottom, 'modal should stay within desktop viewport').toBeLessThanOrEqual(modal.viewportHeight + 1);
  expect(modal.height, 'modal should not exceed desktop viewport height').toBeLessThanOrEqual(modal.viewportHeight);
  expect(['auto', 'scroll', 'overlay'], 'modal should own vertical scrolling').toContain(modal.overflowY);

  await expectNoHorizontalOverflow(page, 'desktop map and modal');
  await screenshot(page, 'desktop-map-modal.png');
  expect(errors).toEqual([]);
});

test('structured reward chips stay compact after an action result', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  await page.locator('.maws-action-rail-main button[data-action="doAction"]').first().click();
  await expect(page.locator('.maws-modal.duration')).toBeVisible();
  await page.locator('.maws-duration-choice.standard button[data-action="chooseDuration"]').click();
  await expect(page.locator('.maws-reward-chip').first()).toBeVisible();

  const chips = await page.locator('.maws-reward-chip').evaluateAll((nodes) => nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()));
  expect(chips.length, 'action result should expose reward chips').toBeGreaterThan(0);
  expect(new Set(chips).size, 'reward chips should not duplicate the same delta').toBe(chips.length);
  chips.forEach((chip) => {
    expect(chip, 'reward chip should not include long source/detail prose').not.toMatch(/来源|开放条件|沙包连击|\/|后续/);
  });
  expect(errors).toEqual([]);
});

test('desktop combat visual geometry keeps cards, queue, and log contained', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await expect(page.locator('.maws-combat-window-cards')).toBeVisible();
  await expect(page.locator('.maws-queue-slot').first()).toBeVisible();
  await expect(page.locator('.maws-combat-log-toggle')).toBeVisible();

  const cardGrid = await box(page, '.maws-combat-window-cards');
  expect(cardGrid.height, 'combat card grid should stay below 28% of viewport height').toBeLessThanOrEqual(DESKTOP.height * 0.28);
  expect(await page.locator('.maws-queue-slot').count(), 'combat queue slots should exist').toBeGreaterThan(0);
  const visibleCombatCardCount = await page.locator('.maws-combat-ui .maws-skill.combat-card').evaluateAll((cards) => cards.filter((card) => {
    const rect = card.getBoundingClientRect();
    const style = window.getComputedStyle(card);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }).length);
  expect(visibleCombatCardCount, 'combat HUD should show the focused 1-2 cards plus visible tactical options').toBeGreaterThan(2);

  const logAndPage = await page.locator('.maws-combat-log-toggle').evaluate((log) => {
    const rect = log.getBoundingClientRect();
    const bodyOverflow = window.getComputedStyle(document.body).overflowY;
    const docOverflow = window.getComputedStyle(document.documentElement).overflowY;
    return {
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      bodyOverflow,
      docOverflow,
      bodyScrollHeight: document.body.scrollHeight,
      docScrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });
  expect(logAndPage.top, 'combat log should start inside the viewport').toBeGreaterThanOrEqual(0);
  expect(logAndPage.bottom, 'combat log should not be cut off by page-level scrolling').toBeLessThanOrEqual(logAndPage.viewportHeight + 1);
  expect(Math.max(logAndPage.bodyScrollHeight, logAndPage.docScrollHeight), 'combat should not create a body-level white scrollbar').toBeLessThanOrEqual(logAndPage.viewportHeight + 1);
  expect([logAndPage.bodyOverflow, logAndPage.docOverflow], 'page should not rely on body-level vertical scrolling for combat log').not.toContain('scroll');

  await expectNoHorizontalOverflow(page, 'desktop combat');
  await screenshot(page, 'desktop-combat.png');
  expect(errors).toEqual([]);
});

test('mobile map keeps the main CTA visible without horizontal overflow', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  const mainCta = page.locator('.maws-action-rail-main .maws-actions-primary button[data-action="doAction"]').first();
  await expect(mainCta).toBeVisible();
  await expectReachableAboveNav(page, mainCta, 'mobile main CTA');

  await expectNoHorizontalOverflow(page, 'mobile map');
  await screenshot(page, 'mobile-main-cta.png');
  expect(errors).toEqual([]);
});
