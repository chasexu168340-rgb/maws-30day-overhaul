import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const SCREENSHOT_DIR = path.join(ROOT, 'test-results', 'wave13');
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
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'wave13-first-look' });
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

async function expectClickableAboveBottomNav(page, locator, label) {
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
  const nav = await visibleBox(page, '.maws-nav');
  expect(target.width, `${label} should retain a touch target`).toBeGreaterThan(32);
  expect(target.height, `${label} should retain a touch target`).toBeGreaterThan(32);
  expect(target.left, `${label} should stay inside viewport`).toBeGreaterThanOrEqual(0);
  expect(target.right, `${label} should stay inside viewport`).toBeLessThanOrEqual(target.viewportWidth + 1);
  expect(target.top, `${label} should be reachable`).toBeGreaterThanOrEqual(0);
  expect(target.bottom, `${label} should stay above bottom nav`).toBeLessThanOrEqual(nav.top + 1);
}

test('rental home first look opens with reachable main CTA and no horizontal overflow', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  await expect(page.locator('.maws-scene')).toBeVisible();
  await expect(page.locator('.maws-scene-character').first()).toBeVisible();
  const mainCta = page.locator('.maws-action-rail-main .maws-actions-primary button[data-action="doAction"]').first();
  await expect(mainCta).toBeVisible();
  await expectClickableAboveBottomNav(page, mainCta, 'rental home main CTA');

  const firstLook = await page.evaluate(() => {
    const state = window.MAWS_STORE.state;
    return {
      day: state.day,
      loc: state.loc,
      tab: state.ui?.tab,
      canvasCount: document.querySelectorAll('canvas').length
    };
  });
  expect(firstLook).toMatchObject({ day: 1, loc: 'home', tab: 'map' });
  expect(firstLook.canvasCount, 'Phaser canvas should be mounted').toBeGreaterThan(0);

  await expectNoHorizontalOverflow(page, '390x844 rental home');
  await screenshot(page, '01-rental-home.png');
  expect(errors).toEqual([]);
});

test('clicking a scene character opens interaction menu or clear feedback', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  const character = page.locator('.maws-scene-character.actionable:not(.player)').first();
  await expect(character).toBeVisible();
  await character.click();

  const feedback = await page.locator('.maws-npc-menu, .maws-toast, .maws-click-burst.character').evaluateAll((nodes) => nodes.map((node) => ({
    className: node.className,
    text: node.textContent.replace(/\s+/g, ' ').trim(),
    visible: Boolean(node.getBoundingClientRect().width && node.getBoundingClientRect().height)
  })));
  expect(feedback.filter((item) => item.visible).length, 'NPC click should expose a menu or visible feedback').toBeGreaterThan(0);

  const menu = page.locator('.maws-npc-menu');
  if (await menu.count()) {
    await expect(menu.first()).toBeVisible();
    expect(await page.locator('.maws-npc-menu-action').count(), 'interaction menu should expose compact actions').toBeGreaterThan(0);
  }

  await expectNoHorizontalOverflow(page, 'desktop NPC click');
  await screenshot(page, '02-npc-interaction.png');
  expect(errors).toEqual([]);
});

test('ordinary action reward feedback uses compact non-duplicated chips', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  const durationAction = page.locator('.maws-action').filter({ has: page.locator('.maws-duration-tag') }).first();
  await expect(durationAction).toBeVisible();
  await durationAction.locator('button[data-action="doAction"]').click();
  await expect(page.locator('.maws-modal.duration')).toBeVisible();
  await page.locator('button[data-action="chooseDuration"][data-duration="standard"]').click();
  await expect(page.locator('.maws-modal.result-compact')).toBeVisible();

  const chips = await page.locator('.maws-modal .maws-reward-chip').evaluateAll((nodes) => nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim()));
  expect(chips.length, 'result should show reward chips').toBeGreaterThan(0);
  expect(chips.length, 'result should keep reward chips compact').toBeLessThanOrEqual(5);
  expect(new Set(chips).size, 'reward chips should not repeat the same sentence').toBe(chips.length);
  chips.forEach((chip) => {
    expect(chip.length, 'reward chip text should stay compact').toBeLessThanOrEqual(36);
    expect(chip, 'reward chip should not include source/detail prose').not.toMatch(/来源|开放条件|后续|重复|沙包连击|\/|。/);
  });

  const visibleTextStats = await page.locator('.maws-modal.result-compact section').first().evaluate((section) => {
    const directBlocks = Array.from(section.querySelectorAll('p, li, .maws-result-summary > div, .maws-settle-line'))
      .filter((node) => !node.closest('details') && node.getBoundingClientRect().height > 0);
    return {
      directBlocks: directBlocks.length,
      textLength: section.textContent.trim().length
    };
  });
  expect(visibleTextStats.directBlocks, 'compact result should avoid repeated long prose blocks').toBeLessThanOrEqual(5);
  expect(visibleTextStats.textLength, 'compact result should not become a wall of text').toBeLessThan(1800);

  await screenshot(page, '03-compact-reward-chips.png');
  expect(errors).toEqual([]);
});

test('390x844 time investment modal fits and its duration buttons are clickable', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  const durationAction = page.locator('.maws-action').filter({ has: page.locator('.maws-duration-tag') }).first();
  await expect(durationAction).toBeVisible();
  await durationAction.locator('button[data-action="doAction"]').click();
  await expect(page.locator('.maws-modal.duration')).toBeVisible();
  await expect(page.locator('.maws-duration-choice')).toHaveCount(4);

  const modalBox = await visibleBox(page, '.maws-modal.duration section');
  expect(modalBox.left, 'duration modal should stay inside mobile viewport').toBeGreaterThanOrEqual(0);
  expect(modalBox.right, 'duration modal should stay inside mobile viewport').toBeLessThanOrEqual(modalBox.viewportWidth + 1);
  expect(modalBox.height, 'duration modal should not exceed mobile viewport height').toBeLessThanOrEqual(modalBox.viewportHeight);

  const buttons = page.locator('.maws-duration-choice button[data-action="chooseDuration"]');
  await expect(buttons.first()).toBeEnabled();
  await expect(buttons.last()).toBeEnabled();
  await expectNoHorizontalOverflow(page, '390x844 duration modal');
  await screenshot(page, '04-time-investment-modal.png');

  await page.locator('button[data-action="chooseDuration"][data-duration="standard"]').click();
  await expect(page.locator('.maws-modal.result-compact')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Day 5 combat HUD exposes 4-6 compact command/action cards, a 1-2 slot queue, and clickable confirm', async ({ page }) => {
  const errors = await loadGame(page, DESKTOP);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 420;
    store.state.loc = 'park';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, selectedTravel: null, cityMapOpen: false, interactionMenu: null };
    delete store.state.flags.main_5;
    store.emit();
  });
  await expect(page.locator('button[data-action="startMainEvent"]').first()).toBeVisible();
  await page.locator('button[data-action="startMainEvent"]').first().evaluate((button) => button.click());
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.evaluate(() => {
    window.MAWS_STORE.state.combat.objectivePassCount = 99;
    window.MAWS_STORE.emit();
  });

  const commandCards = page.locator('.maws-combat-window-cards .maws-card-grid.combat.focus > .maws-skill.combat-card, .maws-combat-window-cards .maws-card-grid.combat.focus > .maws-combat-command-chip');
  await expect(commandCards.first()).toBeVisible();
  const commandCount = await commandCards.count();
  expect(commandCount, 'combat HUD should show 4-6 compact command/action cards').toBeGreaterThanOrEqual(4);
  expect(commandCount, 'combat HUD should show 4-6 compact command/action cards').toBeLessThanOrEqual(6);

  const queueCount = await page.locator('.maws-queue-slot').count();
  expect(queueCount, 'combat queue should keep one or two slots').toBeGreaterThanOrEqual(1);
  expect(queueCount, 'combat queue should keep one or two slots').toBeLessThanOrEqual(2);

  const selectableCards = page.locator('.maws-skill.combat-card:not(.disabled) button[data-action="selectSkill"]');
  await expect(selectableCards.first()).toBeVisible();
  await expect(selectableCards.first()).toBeEnabled();
  await selectableCards.first().click();
  if (await selectableCards.nth(1).count()) {
    await expect(selectableCards.nth(1)).toBeEnabled();
    await selectableCards.nth(1).click();
  }

  const confirm = page.locator('.maws-combat-actions button[data-action="confirmBattle"]');
  await expect(confirm).toBeVisible();
  await expect(confirm).toBeEnabled();
  await screenshot(page, '05-day5-combat-hud.png');
  await confirm.click();
  await page.waitForFunction(() => (window.MAWS_STORE.state.combat?.windowCount || 0) >= 1);
  expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.windowCount || 0), 'confirmBattle should advance combat').toBeGreaterThanOrEqual(1);

  await expectNoHorizontalOverflow(page, 'Day 5 combat HUD');
  expect(errors).toEqual([]);
});
