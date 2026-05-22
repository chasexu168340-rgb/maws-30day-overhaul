import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const DESKTOP = { width: 1365, height: 768 };
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

async function loadGame(page, viewport = DESKTOP) {
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
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'wave14-loop-smoke' });
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

async function visibleBox(locator) {
  return locator.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });
}

test('fatty scene menu exposes real NPC action buttons', async ({ page }) => {
  const errors = await loadGame(page);

  const fatty = page.locator('.maws-scene-character.actionable').filter({ hasText: '刘胖子' }).first();
  await expect(fatty).toBeVisible();
  await fatty.click();

  const menu = page.locator('.maws-npc-menu.has-real-action');
  await expect(menu).toBeVisible();
  await expect(menu).toContainText('刘胖子');

  const realActions = menu.locator('button.maws-npc-menu-action.real-action[data-action="doAction"]');
  expect(await realActions.count(), 'fatty menu should expose executable actions').toBeGreaterThanOrEqual(1);
  await expect(realActions.first()).toBeEnabled();

  const actionIds = await realActions.evaluateAll((buttons) => buttons.map((button) => button.dataset.id));
  expect(actionIds, 'fatty menu real actions should be backed by action ids').toContain('fatty_review_together');
  expect(errors).toEqual([]);
});

test('one small NPC action returns compact reward chips', async ({ page }) => {
  const errors = await loadGame(page);

  await page.locator('.maws-scene-character.actionable').filter({ hasText: '刘胖子' }).first().click();
  const action = page.locator('.maws-npc-menu button[data-action="doAction"][data-id="fatty_review_together"]');
  await expect(action).toBeVisible();
  await action.click();

  await expect(page.locator('.maws-modal.result-compact')).toBeVisible();
  const chips = await page.locator('.maws-modal.result-compact .maws-reward-chip').evaluateAll((nodes) => (
    nodes.map((node) => node.textContent.replace(/\s+/g, ' ').trim())
  ));
  expect(chips.length, 'NPC action should show reward chips').toBeGreaterThan(0);
  expect(chips.length, 'NPC action reward chips should stay short').toBeLessThanOrEqual(5);
  expect(new Set(chips).size, 'NPC action reward chips should not duplicate').toBe(chips.length);
  chips.forEach((chip) => {
    expect(chip.length, 'reward chip text should stay compact').toBeLessThanOrEqual(36);
    expect(chip, 'reward chip should not be a long prose sentence').not.toMatch(/来源|开放条件|后续|重复|。|，/);
  });

  expect(errors).toEqual([]);
});

test('skills tab displays the Wave 14 skill tree slice', async ({ page }) => {
  const errors = await loadGame(page);

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  const treeSlice = page.locator('.maws-skill-tree-slice');
  await expect(treeSlice).toBeVisible();
  await expect(treeSlice).toContainText('技能树切片');

  expect(await treeSlice.locator('.maws-skill-tree').count(), 'skill tree slice should show three route columns').toBeGreaterThanOrEqual(3);
  expect(await treeSlice.locator('.maws-tree-node').count(), 'skill tree slice should expose nodes').toBeGreaterThanOrEqual(3);
  await expect(treeSlice.locator('.maws-tree-node button').first()).toBeEnabled();

  await expectNoHorizontalOverflow(page, 'skills tree slice');
  expect(errors).toEqual([]);
});

test('combat plan mode controls are visible and clickable', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const planControl = page.locator('.maws-plan-mode-control');
  await expect(planControl).toBeVisible();

  for (const mode of ['manual', 'safe', 'pressure', 'exit']) {
    const button = planControl.locator(`button[data-action="setCombatPlan"][data-mode="${mode}"]`);
    await expect(button, `${mode} plan mode should be visible`).toBeVisible();
    await expect(button, `${mode} plan mode should be enabled`).toBeEnabled();
    await button.evaluate((node) => node.click());
    await expect(button, `${mode} plan mode should become active`).toHaveClass(/active/);
    expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.planMode), `${mode} plan mode should update state`).toBe(mode);
  }

  await expectNoHorizontalOverflow(page, 'combat plan mode');
  expect(errors).toEqual([]);
});

test('mobile time investment modal does not overflow horizontally', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  const durationAction = page.locator('.maws-action').filter({ has: page.locator('.maws-duration-tag') }).first();
  await expect(durationAction).toBeVisible();
  await durationAction.locator('button[data-action="doAction"]').click();

  const modal = page.locator('.maws-modal.duration section').first();
  await expect(modal).toBeVisible();
  await expect(page.locator('.maws-duration-choice')).toHaveCount(4);

  const modalBox = await visibleBox(modal);
  expect(modalBox.left, 'duration modal should stay inside mobile viewport').toBeGreaterThanOrEqual(0);
  expect(modalBox.right, 'duration modal should stay inside mobile viewport').toBeLessThanOrEqual(modalBox.viewportWidth + 1);

  const choiceBoxes = await page.locator('.maws-duration-choice').evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: rect.width, viewportWidth: window.innerWidth };
  }));
  choiceBoxes.forEach((box, index) => {
    expect(box.width, `duration choice ${index + 1} should retain width`).toBeGreaterThan(0);
    expect(box.left, `duration choice ${index + 1} should stay inside mobile viewport`).toBeGreaterThanOrEqual(0);
    expect(box.right, `duration choice ${index + 1} should stay inside mobile viewport`).toBeLessThanOrEqual(box.viewportWidth + 1);
  });

  const standard = page.locator('button[data-action="chooseDuration"][data-duration="standard"]');
  await expect(standard).toBeEnabled();
  await standard.click();
  await expect(page.locator('.maws-modal.result-compact')).toBeVisible();

  await expectNoHorizontalOverflow(page, 'mobile duration modal');
  expect(errors).toEqual([]);
});
