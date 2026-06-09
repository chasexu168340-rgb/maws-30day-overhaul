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
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'wave15-addiction-loop-smoke' });
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

async function openSpendableSkillTree(page, points = 3) {
  await page.evaluate((amount) => {
    const store = window.MAWS_STORE;
    store.state.player.insightPoints = amount;
    store.state.ui = { ...store.state.ui, tab: 'skills', modal: null, cityMapOpen: false };
    store.emit();
  }, points);
  await expect(page.locator('.maws-skill-tree-slice')).toBeVisible();
}

async function firstPurchasableNode(page) {
  return page.evaluate(async () => {
    const { buildRenderModel } = await import('/maws_src/simulation/state.js');
    const model = buildRenderModel(window.MAWS_STORE.state);
    const nodes = model.skillTree.trees.flatMap((tree) => tree.nodes.map((node) => ({ tree: tree.name, ...node })));
    const node = nodes.find((item) => item.canPurchase && item.cost <= model.skillTree.points);
    return node ? {
      id: node.id,
      label: node.label,
      tree: node.tree,
      cost: node.cost,
      points: model.skillTree.points,
      status: node.status,
      canPurchase: node.canPurchase
    } : null;
  });
}

test('skills page exposes spendable tree status and insight points', async ({ page }) => {
  const errors = await loadGame(page);

  await openSpendableSkillTree(page);

  const treeSlice = page.locator('.maws-skill-tree-slice');
  await expect(treeSlice).toContainText('技能树切片');
  await expect(treeSlice).toContainText(/洞察点\s+3/);
  expect(await treeSlice.locator('.maws-tree-node.status-available').count(), 'skill tree should expose purchasable nodes').toBeGreaterThanOrEqual(1);
  expect(await firstPurchasableNode(page), 'render model should mark a node as canPurchase').toMatchObject({
    status: 'available',
    canPurchase: true
  });

  await expectNoHorizontalOverflow(page, 'desktop skill tree spend status');
  expect(errors).toEqual([]);
});

test('purchasing a tree node gives compact reward feedback and survives rerender', async ({ page }) => {
  const errors = await loadGame(page);

  await openSpendableSkillTree(page);
  const node = await firstPurchasableNode(page);
  expect(node, 'expected one spendable skill-tree node').not.toBeNull();

  const result = await page.evaluate((nodeId) => {
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'purchaseSkillTreeNode', nodeId });
    store.emit();
    const owned = Boolean(store.state.skillTree?.unlocked?.[nodeId]);
    return {
      owned,
      points: store.state.player.insightPoints,
      modalType: store.state.ui.modal?.type,
      modalTitle: store.state.ui.modal?.title
    };
  }, node.id);

  expect(result).toMatchObject({
    owned: true,
    modalType: 'settlement',
    modalTitle: '技能树点亮'
  });
  expect(result.points, 'purchase should spend insight points').toBeLessThan(node.points);

  const modal = page.locator('.maws-modal.result-compact');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('技能树点亮');
  const chips = await modal.locator('.maws-reward-chip').evaluateAll((items) => (
    items.map((item) => item.textContent.replace(/\s+/g, ' ').trim())
  ));
  expect(chips.length, 'skill-tree purchase should show reward chips').toBeGreaterThan(0);
  expect(chips.length, 'skill-tree purchase chips should stay compact').toBeLessThanOrEqual(5);
  expect(new Set(chips).size, 'skill-tree purchase chips should not duplicate').toBe(chips.length);
  chips.forEach((chip) => {
    expect(chip.length, 'reward chip text should stay short').toBeLessThanOrEqual(36);
    expect(chip, 'reward chip should not be prose').not.toMatch(/来源|开放条件|后续|重复|。|，/);
  });

  await page.locator('button[data-action="closeModal"]').click();
  await page.evaluate(() => window.MAWS_STORE.emit());
  const ownedNode = page.locator('.maws-tree-node.status-owned').filter({ hasText: node.label });
  await expect(ownedNode, 'purchased node should stay owned after rerender').toBeVisible();
  await expect(ownedNode).toContainText('已点亮');

  expect(errors).toEqual([]);
});

test('combat plan mode exposes at least three tactical recipe modes', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const planControl = page.locator('.maws-plan-mode-control');
  await expect(planControl).toBeVisible();
  const recipeModes = ['safe', 'pressure', 'exit', 'probe'];
  const visibleModes = [];
  for (const mode of recipeModes) {
    const button = planControl.locator(`button[data-action="setCombatPlan"][data-mode="${mode}"]`);
    if (await button.count()) {
      await expect(button, `${mode} plan mode should be visible`).toBeVisible();
      await expect(button, `${mode} plan mode should be enabled`).toBeEnabled();
      visibleModes.push(mode);
    }
  }

  expect(visibleModes.length, 'combat should expose at least three recipe plan modes').toBeGreaterThanOrEqual(3);
  await planControl.locator(`button[data-action="setCombatPlan"][data-mode="${visibleModes[0]}"]`).evaluate((button) => button.click());
  expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.planMode)).toBe(visibleModes[0]);

  await expectNoHorizontalOverflow(page, 'desktop combat plan recipes');
  expect(errors).toEqual([]);
});

test('battle surrender resolves as retreat without victory rewards or win memory', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const result = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const combat = store.state.combat;
    const before = {
      money: store.state.player.money,
      fame: store.state.player.fame,
      wins: store.state.combatMemory.wins,
      losses: store.state.combatMemory.losses,
      playerHp: store.state.player.hp,
      enemyHp: combat?.enemy?.hp || 0,
      reward: { ...(combat?.enemy?.reward || {}) }
    };
    store.dispatch({ type: 'surrender' });
    const modal = store.state.ui.modal || {};
    return {
      before,
      after: {
        money: store.state.player.money,
        fame: store.state.player.fame,
        wins: store.state.combatMemory.wins,
        losses: store.state.combatMemory.losses,
        lastResult: store.state.combatMemory.lastResult
      },
      combatActive: Boolean(store.state.combat),
      modal: {
        type: modal.type,
        title: modal.title || '',
        body: modal.body || '',
        lead: modal.lead || '',
        win: modal.win,
        reason: modal.reason
      },
      latestLog: store.state.log?.[0]?.text || '',
      latestEvent: store.state.eventLog?.[0] || null
    };
  });

  expect(result.before.playerHp, 'fixture should cover the old HP-based false-win path').toBeGreaterThanOrEqual(result.before.enemyHp);
  expect(result.combatActive, 'surrender should close active combat').toBe(false);
  expect(result.modal).toMatchObject({
    type: 'battleResult',
    win: false,
    reason: 'surrender'
  });
  const modalText = [result.modal.title, result.modal.body, result.modal.lead].join('\n');
  expect(modalText).toMatch(/认输|撤退|撤出|失败/);
  expect(modalText).not.toMatch(/胜利|战胜/);
  expect(result.after.money, 'surrender should not pay enemy money reward').toBe(result.before.money);
  expect(result.after.fame, 'surrender should not pay enemy fame reward').toBe(result.before.fame);
  expect(result.after.wins, 'surrender should not increment combat wins').toBe(result.before.wins);
  expect(result.after.losses, 'surrender should increment combat losses').toBe(result.before.losses + 1);
  expect(result.after.lastResult).toBe('loss');
  expect(result.latestLog).toMatch(/认输|撤退|撤出|失败/);
  expect(result.latestLog).not.toMatch(/胜利|战胜/);
  expect(result.latestEvent?.result).toBe('loss');
  await expect(page.locator('.maws-modal.result-compact')).toContainText(/认输|撤退|撤出|失败/);

  expect(errors).toEqual([]);
});

test('Day 5 combat recipe produces readable tactical feedback', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 420;
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const modeButton = page.locator('button[data-action="setCombatPlan"][data-mode="pressure"]');
  if (await modeButton.count()) await modeButton.evaluate((button) => button.click());
  await page.locator('button[data-action="confirmBattle"]').first().evaluate((button) => button.click());

  const feedback = await page.evaluate(() => {
    const combat = window.MAWS_STORE.state.combat;
    return {
      planMode: combat?.planMode,
      sideLog: Array.from(document.querySelectorAll('.maws-combat-side-log li')).map((node) => node.textContent.trim()),
      stateLog: combat?.log || [],
      panelText: document.querySelector('.maws-combat-feedback')?.textContent?.replace(/\s+/g, ' ').trim() || ''
    };
  });
  const text = [...feedback.sideLog, ...feedback.stateLog, feedback.panelText].filter(Boolean).join('\n');
  const readableLines = text.split('\n').filter((line) => (
    line.length >= 8
    && /战术|计划|窗口|距离|节奏|抱架|压|稳|读|观察|后撤|推开|对方|先|再/.test(line)
    && !/^触发\s*combo$/i.test(line.trim())
  ));

  expect(feedback.planMode, 'recipe plan mode should be active').not.toBe('manual');
  expect(readableLines.length, 'Day 5 recipe feedback should contain readable tactical sentences').toBeGreaterThan(0);
  expect(text.trim(), 'combat feedback should not be only a combo placeholder').not.toBe('触发 combo');

  expect(errors).toEqual([]);
});

test('390x844 addiction-loop surfaces do not overflow horizontally', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  await expectNoHorizontalOverflow(page, 'mobile map start');
  await openSpendableSkillTree(page);
  await expectNoHorizontalOverflow(page, 'mobile skill tree spend');

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'mobile combat recipe');

  expect(errors).toEqual([]);
});
