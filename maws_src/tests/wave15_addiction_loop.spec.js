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

async function earnInsightThroughReview(page) {
  const before = await page.evaluate(() => Number(window.MAWS_STORE.state.player.insightPoints || 0));
  const reviewButton = page.locator('button[data-action="doAction"][data-id="review"]').first();
  await expect(reviewButton, 'home review action should be visible as an early Insight source').toBeVisible();
  await reviewButton.click();
  const durationChoice = page.locator('button[data-action="chooseDuration"][data-id="review"][data-duration="standard"]');
  if (await durationChoice.count()) {
    await expect(durationChoice).toBeVisible();
    await durationChoice.click();
  }
  await expect(page.locator('.maws-modal')).toContainText('洞察点');
  await expect(page.locator('.maws-modal button[data-action="setTab"][data-tab="skills"]'), 'video review should offer a direct skill-tree next step').toContainText('去点技能树');
  await expect(page.locator('.maws-modal button[data-action="doAction"][data-id="fatty_review_together"]'), 'video review should offer a follow-up review with Fatty').toContainText('找刘胖子');
  const after = await page.evaluate(() => Number(window.MAWS_STORE.state.player.insightPoints || 0));
  expect(after, 'video review should naturally grant Insight before skill-tree purchase').toBeGreaterThan(before);
  await page.locator('button[data-action="closeModal"]').click();
  return after;
}

async function openSpendableSkillTree(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.ui = { ...store.state.ui, tab: 'skills', modal: null, cityMapOpen: false };
    store.emit();
  });
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

  const points = await earnInsightThroughReview(page);
  await openSpendableSkillTree(page);

  const treeSlice = page.locator('.maws-skill-tree-slice');
  await expect(treeSlice).toContainText('技能树切片');
  await expect(treeSlice).toContainText(new RegExp(`洞察点\\s+${points}`));
  await expect(treeSlice).toContainText('复盘、训练和主线');
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

  await earnInsightThroughReview(page);
  await openSpendableSkillTree(page);
  const node = await firstPurchasableNode(page);
  expect(node, 'expected one spendable skill-tree node').not.toBeNull();

  const purchaseButton = page.locator(`button[data-action="purchaseSkillTreeNode"][data-id="${node.id}"]`);
  await expect(purchaseButton, 'spendable skill-tree node should be purchasable through UI').toBeVisible();
  await expect(purchaseButton).toContainText('点亮');
  await purchaseButton.click();

  const result = await page.evaluate((nodeId) => {
    const store = window.MAWS_STORE;
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

test('video review follow-up can chain into Fatty review and back to skill tree', async ({ page }) => {
  const errors = await loadGame(page);
  await page.evaluate(() => {
    window.MAWS_STORE.state.flags.day3_store_show_form = true;
    window.MAWS_STORE.emit();
  });

  const reviewButton = page.locator('button[data-action="doAction"][data-id="review"]').first();
  await expect(reviewButton).toBeVisible();
  await reviewButton.click();
  const durationChoice = page.locator('button[data-action="chooseDuration"][data-id="review"][data-duration="standard"]');
  if (await durationChoice.count()) await durationChoice.click();

  const fattyFollowUp = page.locator('.maws-modal button[data-action="doAction"][data-id="fatty_review_together"]');
  await expect(fattyFollowUp, 'video review should offer Fatty as a second-step review').toBeVisible();
  await fattyFollowUp.click();

  const modal = page.locator('.maws-modal.result-compact');
  await expect(modal, 'Fatty follow-up should resolve as a compact result modal').toBeVisible();
  await expect(modal).toContainText('一起复盘');
  await expect(modal, 'Fatty review should remember the prior convenience-store mistake').toContainText('祖传架势不像镇场');
  await expect(modal.locator('.maws-reward-chip').first(), 'Fatty follow-up should still show reward chips').toBeVisible();
  await expect(modal.locator('button[data-action="setTab"][data-tab="skills"]'), 'Fatty review should keep the growth path visible').toContainText('去点技能树');
  expect(await page.evaluate(() => Boolean(window.MAWS_STORE.state.flags.reviewed_day3_store_show_form)), 'Fatty review should persist that this memory was reviewed').toBe(true);

  await page.locator('button[data-action="closeModal"]').click();
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.loc = 'store';
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, cityMapOpen: false, interactionMenu: { characterId: 'xiaoman' } };
    store.emit();
  });
  const xiaomanMenu = page.locator('.maws-npc-menu').filter({ hasText: '小满' });
  await expect(xiaomanMenu, 'reviewed memory should surface later in Xiaoman scene interaction').toContainText('刘胖子复盘都复盘到货架了');

  expect(errors).toEqual([]);
});

test('park exposes a low-risk E00 fun target before the E01 check', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.loc = 'park';
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, cityMapOpen: false, interactionMenu: null };
    store.emit();
  });

  const primaryActionArea = page.locator('.maws-actions-primary');
  const e00Action = primaryActionArea.locator('button[data-action="doAction"][data-id="mouthy_passer_tryout"]');
  await expect(e00Action, 'park should expose a low-risk target for starter wild skills').toBeVisible();
  await expect(e00Action.locator('xpath=ancestor::article[1]')).toContainText('嘴硬路人试手');
  await expect(e00Action.locator('xpath=ancestor::article[1]')).toContainText('低风险试手');
  await e00Action.click();
  await expect(page.locator('.maws-modal')).toContainText('嘴硬路人试手');
  await page.locator('.maws-modal button[data-action="resolveEventNotebook"][data-id="resolve"]').click();

  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await expect(page.locator('.maws-combat-ui')).toContainText('嘴硬路人');
  const combatState = await page.evaluate(() => ({
    enemyId: window.MAWS_STORE.state.combat?.enemyId,
    tags: window.MAWS_STORE.state.combat?.enemy?.tags || [],
    dailyGate: Boolean(window.MAWS_STORE.state.daily?.npcActionGates?.mouthy_passer_tryout)
  }));
  expect(combatState).toMatchObject({
    enemyId: 'E00',
    dailyGate: true
  });
  expect(combatState.tags).toContain('完全没练过');
  await page.locator('.maws-combat-ui button[data-action="surrender"]').evaluate((button) => button.click());
  const result = page.locator('.maws-modal').filter({ hasText: '嘴硬路人' });
  await expect(result, 'E00 outcome should explain the low-risk lesson').toContainText('低风险不等于不用复盘');
  await expect(result).toContainText('先把能收回来的动作练稳');
  expect(await page.evaluate(() => Boolean(window.MAWS_STORE.state.flags.e00_wild_tryout_review)), 'E00 review outcome should persist a flag').toBe(true);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.flags.e00_wild_tryout_win = true;
    store.state.loc = 'home';
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, cityMapOpen: false, interactionMenu: { characterId: 'fatty' } };
    store.emit();
  });
  const fattyMenu = page.locator('.maws-npc-menu').filter({ hasText: '刘胖子' });
  await expect(fattyMenu, 'E00 win should surface as later Fatty banter').toContainText('打赢嘴硬路人');
  await expect(fattyMenu).toContainText('别把这当拳馆毕业证');

  expect(errors).toEqual([]);
});

test('combat plan mode exposes at least three tactical recipe modes', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const planControl = page.locator('.maws-plan-mode-control');
  await expect(planControl).toBeVisible();
  const tacticsDrawer = page.locator('.maws-tactics-drawer');
  if (await tacticsDrawer.count()) {
    await expect(tacticsDrawer.locator('summary')).toBeVisible();
    expect(await tacticsDrawer.evaluate((node) => node.hasAttribute('open')), 'tactics drawer should start collapsed so combat stage stays dominant').toBe(false);
  }
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

test('Day 5 combat recipe produces readable tactical feedback', async ({ page }) => {
  const errors = await loadGame(page);

  await earnInsightThroughReview(page);
  await openSpendableSkillTree(page);
  const node = await firstPurchasableNode(page);
  expect(node, 'expected one spendable skill-tree node before combat').not.toBeNull();
  await page.locator(`button[data-action="purchaseSkillTreeNode"][data-id="${node.id}"]`).click();
  await expect(page.locator('.maws-modal.result-compact')).toContainText('技能树点亮');
  await page.locator('button[data-action="closeModal"]').click();

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 420;
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  const wildSwingCard = page.locator('.maws-skill.combat-card').filter({ hasText: '野路挥拳' }).first();
  await expect(wildSwingCard, 'purchased skill-tree node should be visible on the next combat action card').toContainText('技能树');
  await expect(wildSwingCard, 'wild swing mastery should expose the concrete combat preview bonus').toContainText(/命中\s*\+2%/);

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
  expect(text, 'auto-filled combat recipe should explain the tactical plan in player-facing language').toMatch(/战术配方.+自动补入/);
  expect(text, 'combat recipe feedback should name the pressure recipe actions').toMatch(/推搡.+野路挥拳/);
  expect(text, 'combat feedback should not leak internal plan slot debug fields').not.toMatch(/comboSlot|planSlot|PLAN触发/);
  expect(text.trim(), 'combat feedback should not be only a combo placeholder').not.toBe('触发 combo');
  expect(text, 'purchased skill-tree node should surface in the next combat feedback').toContain('技能树反馈');

  expect(errors).toEqual([]);
});

test('390x844 addiction-loop surfaces do not overflow horizontally', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  await expectNoHorizontalOverflow(page, 'mobile map start');
  await earnInsightThroughReview(page);
  await openSpendableSkillTree(page);
  await expectNoHorizontalOverflow(page, 'mobile skill tree spend');

  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startBattle', enemyId: 'E01' }));
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'mobile combat recipe');

  expect(errors).toEqual([]);
});
