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

async function setBoxingBasicsState(page, overrides = {}) {
  await page.evaluate((options) => {
    const store = window.MAWS_STORE;
    const {
      day = 9,
      time = 540,
      loc = 'home',
      tab = 'skills',
      money = 1000,
      sp = 100,
      learnedSkills = []
    } = options || {};
    store.state.day = day;
    store.state.time = time;
    store.state.loc = loc;
    store.state.player.money = money;
    store.state.player.sp = sp;
    store.state.player.insightPoints = 4;
    store.state.skillState = { ...(store.state.skillState || {}) };
    store.state.unlocked = { ...(store.state.unlocked || {}) };
    delete store.state.skillState.jab;
    delete store.state.unlocked.jab;
    delete store.state.skillState.straight;
    delete store.state.unlocked.straight;
    const learnedSkillDefaults = {
      jab: { p: 18, use: 0, retrain: 0, zhus: [] },
      straight: { p: 16, use: 0, retrain: 0, zhus: [] }
    };
    learnedSkills.forEach((skillId) => {
      store.state.skillState[skillId] = { ...(learnedSkillDefaults[skillId] || { p: 12, use: 0, retrain: 0, zhus: [] }) };
      store.state.unlocked[skillId] = 1;
    });
    store.state.ui = {
      ...store.state.ui,
      tab,
      modal: null,
      toast: null,
      selectedTravel: null,
      cityMapOpen: false,
      interactionMenu: null
    };
    store.emit();
  }, overrides);
}

function boxingJabTreeNode(page) {
  return page.locator('.maws-tree-node').filter({
    has: page.locator('header strong', { hasText: /^刺拳入门\/强化$/ })
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

test('boxing basics jab node guides Day9 players to the boxing gym', async ({ page }) => {
  const errors = await loadGame(page);

  await setBoxingBasicsState(page, { day: 9, time: 540, loc: 'home', tab: 'skills' });

  const jabNode = boxingJabTreeNode(page);
  await expect(jabNode).toBeVisible();
  await expect(jabNode).toContainText('沙包连击（刺拳入门）');
  await expect(jabNode).toContainText('去拳馆');

  const travelCta = jabNode.locator('button[data-action="openTravel"][data-loc="boxing"]');
  await expect(travelCta).toBeVisible();
  await travelCta.click();

  const travelModal = page.locator('.maws-modal');
  await expect(travelModal).toContainText('拳馆');
  await expect(travelModal.locator('button[data-action="travel"]').first()).toBeVisible();

  expect(errors).toEqual([]);
});

test('boxing gym features jab bag drill and starts training feedback', async ({ page }) => {
  const errors = await loadGame(page);

  await setBoxingBasicsState(page, { day: 9, time: 540, loc: 'boxing', tab: 'map' });

  const primaryActions = page.locator('.maws-actions-primary');
  await expect(primaryActions).toContainText('沙包连击（刺拳入门）');
  const bagButton = primaryActions.locator('button[data-action="doAction"][data-id="bag"]');
  await expect(bagButton).toBeVisible();
  await bagButton.click();

  const modal = page.locator('.maws-modal');
  await expect(modal).toContainText('沙包连击（刺拳入门）');
  await expect(modal).toContainText('投入选择');
  await modal.locator('button[data-action="chooseDuration"][data-id="bag"]').nth(1).click();
  await expect(modal).toContainText('三轮沙包连击');
  await modal.locator('button[data-action="answerTraining"]').first().click();
  await expect(modal.locator('.maws-training-feedback')).toBeVisible();
  for (let i = 0; i < 2; i += 1) {
    await modal.locator('button[data-action="answerTraining"]').first().click();
  }
  await expect(modal).toContainText('沙包连击（刺拳入门）');
  await expect(modal).toContainText('学会 刺拳');
  await expect(modal).not.toContainText('学会 直拳');

  expect(errors).toEqual([]);
});

test('boxing gym labels bag drill as straight entry after jab is learned', async ({ page }) => {
  const errors = await loadGame(page);

  await setBoxingBasicsState(page, { day: 9, time: 540, loc: 'boxing', tab: 'map', learnedSkills: ['jab'] });

  const primaryActions = page.locator('.maws-actions-primary');
  await expect(primaryActions).toContainText('沙包连击（直拳入门）');
  await expect(primaryActions).not.toContainText('沙包连击（刺拳入门）');
  const bagButton = primaryActions.locator('button[data-action="doAction"][data-id="bag"]');
  await expect(bagButton).toBeVisible();
  await bagButton.click();

  const modal = page.locator('.maws-modal');
  await expect(modal).toContainText('沙包连击（直拳入门）');
  await expect(modal).not.toContainText('沙包连击（刺拳入门）');
  await modal.locator('button[data-action="chooseDuration"][data-id="bag"]').nth(1).click();
  for (let i = 0; i < 3; i += 1) {
    await modal.locator('button[data-action="answerTraining"]').first().click();
  }

  await expect(modal).toContainText('沙包连击（直拳入门）');
  await expect(modal).toContainText('学会 直拳');
  await expect(modal).not.toContainText('沙包连击（刺拳入门）');
  await expect(modal).not.toContainText('学会 刺拳');

  expect(errors).toEqual([]);
});

test('boxing basics jab node points to straight training after jab is learned', async ({ page }) => {
  const errors = await loadGame(page);

  await setBoxingBasicsState(page, { day: 9, time: 540, loc: 'boxing', tab: 'skills', learnedSkills: ['jab'] });

  const jabNode = boxingJabTreeNode(page);
  await expect(jabNode).toBeVisible();
  await expect(jabNode).toContainText('刺拳已掌握');
  await expect(jabNode).toContainText('下一步');
  await expect(jabNode).toContainText('直拳');
  await expect(jabNode.locator('button.maws-tree-guide-cta')).toContainText('开始沙包连击（直拳入门）');
  await expect(jabNode).not.toContainText('开始沙包连击（刺拳入门）');

  expect(errors).toEqual([]);
});

test('boxing basics jab guide explains locked and closed gym states', async ({ page }) => {
  const errors = await loadGame(page);

  await setBoxingBasicsState(page, { day: 8, time: 540, loc: 'home', tab: 'skills' });
  let jabNode = boxingJabTreeNode(page);
  await expect(jabNode).toContainText('Day 9 开放');
  await expect(jabNode.locator('button.maws-tree-guide-cta')).toBeDisabled();

  await setBoxingBasicsState(page, { day: 9, time: 480, loc: 'home', tab: 'skills' });
  jabNode = boxingJabTreeNode(page);
  await expect(jabNode).toContainText('拳馆当前未营业');
  await expect(jabNode.locator('button.maws-tree-guide-cta')).toBeDisabled();

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

test('core affordance fixes expose NPC travel, shop cost, insight, and risk guidance', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 9;
    store.state.time = 600;
    store.state.loc = 'home';
    store.state.player.money = 1000;
    store.state.player.insightPoints = 4;
    store.state.ui = { ...store.state.ui, tab: 'npc', modal: null, toast: null, cityMapOpen: false };
    store.emit();
  });

  const coachCard = page.locator('.maws-item').filter({ hasText: '梁教练' });
  await expect(coachCard).toContainText('对应地点');
  await expect(coachCard.locator('button[data-action="openTravel"][data-loc="boxing"]')).toBeVisible();
  await coachCard.locator('button[data-action="openTravel"][data-loc="boxing"]').click();
  const travelModal = page.locator('.maws-modal');
  await expect(travelModal).toContainText('拳馆');
  await expect(travelModal.locator('button[data-action="travel"]').first()).toBeVisible();

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.ui = { ...store.state.ui, tab: 'shop', modal: null, toast: null, cityMapOpen: false };
    store.emit();
  });
  const riceCard = page.locator('.maws-item').filter({ hasText: '便利店饭团' });
  await expect(riceCard).toContainText(/购买耗时\s*10分钟/);
  await expect(riceCard).toContainText('推进行动节奏');
  await riceCard.locator('button[data-action="buyItem"]').click();
  const purchaseModal = page.locator('.maws-modal.result-feedback');
  await expect(purchaseModal).toBeVisible();
  await expect(purchaseModal).toContainText('购买补给');
  await expect(purchaseModal).toContainText(/耗时\s*10分钟|推进行动节奏/);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.player.insightPoints = 4;
    store.state.ui = { ...store.state.ui, tab: 'profile', modal: null, toast: null, cityMapOpen: false };
    store.emit();
  });
  const profilePanel = page.locator('.maws-panel').filter({ hasText: '资源注释' });
  await expect(profilePanel).not.toContainText('热度怎么理解');
  await expect(profilePanel.locator('.maws-stat.resource.risk-guide')).toHaveCount(0);
  const heatResourceCards = profilePanel.locator('.maws-stat.resource').filter({ hasText: '热度' });
  await expect(heatResourceCards).toHaveCount(1);
  await expect(heatResourceCards).toContainText('长期累计的暴露压力');
  await expect(heatResourceCards).toContainText('不是单次行动风险');
  await expect(heatResourceCards).toContainText('言语降温');
  const insightResource = page.locator('.maws-stat.resource').filter({ hasText: '洞察点' });
  await expect(insightResource).toContainText('4');
  await openSpendableSkillTree(page, 4);
  await expect(page.locator('.maws-skill-tree-slice')).toContainText(/洞察点\s+4/);

  expect(errors).toEqual([]);
});

test('heat gain updates the HUD heat chip and result copy immediately after an action', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.loc = 'home';
    store.state.time = 600;
    store.state.player.heat = 0;
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 1, npcActionGates: {}, microActions: {} };
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, toast: null, cityMapOpen: false };
    store.emit();
  });

  const heatChip = page.locator('.maws-resource-row .maws-chip.risk').filter({ hasText: '热度' });
  const heatTooltip = page.locator('#maws-hud-heat-tooltip');
  const tooltipIntersection = async () => heatTooltip.evaluate((node) => new Promise((resolve) => {
    const fallback = window.setTimeout(() => {
      const rect = node.getBoundingClientRect();
      resolve({ ratio: 0, width: 0, height: 0, boundsWidth: rect.width, boundsHeight: rect.height });
    }, 250);
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(fallback);
      observer.disconnect();
      resolve({
        ratio: entry.intersectionRatio,
        width: entry.intersectionRect.width,
        height: entry.intersectionRect.height,
        boundsWidth: entry.boundingClientRect.width,
        boundsHeight: entry.boundingClientRect.height
      });
    });
    observer.observe(node);
  }));
  const expectTooltipInViewport = (box) => {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  };
  await expect(heatChip).toContainText(/热度\s*0/);
  await expect(heatChip.locator('b')).toHaveText('热度');
  expect(await heatChip.getAttribute('title')).toBeNull();
  await expect(heatChip).toHaveAttribute('aria-label', /高风险行动可能提高热度/);
  await expect(heatChip).toHaveAttribute('aria-describedby', 'maws-hud-heat-tooltip');
  await expect(heatChip).toHaveAttribute('tabindex', '0');
  await expect(heatTooltip).toContainText('热度：长期暴露压力');
  await expect(heatTooltip).not.toBeVisible();
  await expect(heatTooltip).toHaveCSS('position', 'fixed');
  await expect(heatTooltip).toHaveCSS('pointer-events', 'none');
  const overlayPlacement = await heatTooltip.evaluate((node) => ({
    parentTag: node.parentElement?.tagName,
    insideChip: Boolean(node.closest('.maws-chip')),
    insideResourceRow: Boolean(node.closest('.maws-resource-row')),
    insideHud: Boolean(node.closest('.maws-hud'))
  }));
  expect(overlayPlacement).toEqual({
    parentTag: 'BODY',
    insideChip: false,
    insideResourceRow: false,
    insideHud: false
  });
  const heatBox = await heatChip.boundingBox();
  expect(heatBox).not.toBeNull();
  await page.mouse.move(heatBox.x + 6, heatBox.y + heatBox.height / 2);
  await expect(heatTooltip).toBeVisible();
  const firstTooltipBox = await heatTooltip.boundingBox();
  expect(firstTooltipBox).not.toBeNull();
  expect(firstTooltipBox.width).toBeGreaterThan(180);
  expect(firstTooltipBox.height).toBeGreaterThan(30);
  expectTooltipInViewport(firstTooltipBox);
  const firstVisibleArea = await tooltipIntersection();
  expect(firstVisibleArea.ratio).toBeGreaterThan(0.95);
  expect(firstVisibleArea.width).toBeGreaterThan(firstTooltipBox.width - 2);
  expect(firstVisibleArea.height).toBeGreaterThan(firstTooltipBox.height - 2);
  await page.mouse.move(heatBox.x + heatBox.width - 6, heatBox.y + heatBox.height / 2);
  await expect(heatTooltip).toBeVisible();
  const secondTooltipBox = await heatTooltip.boundingBox();
  expect(secondTooltipBox).not.toBeNull();
  expectTooltipInViewport(secondTooltipBox);
  expect(Math.abs(secondTooltipBox.x - firstTooltipBox.x) + Math.abs(secondTooltipBox.y - firstTooltipBox.y)).toBeGreaterThan(4);
  await page.mouse.move(4, 4);
  await expect(heatTooltip).not.toBeVisible();
  await heatChip.focus();
  await expect(heatTooltip).toBeVisible();
  const focusTooltipBox = await heatTooltip.boundingBox();
  expect(focusTooltipBox).not.toBeNull();
  expectTooltipInViewport(focusTooltipBox);

  const shortVideoAction = page.locator('.maws-action').filter({ hasText: '刷短视频' });
  await expect(shortVideoAction).toContainText('行动风险');
  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'doAction', actionId: 'scroll_short_video' }));
  await expect(heatChip).toContainText(/热度\s*1/);
  const resultModal = page.locator('.maws-modal');
  const heatRewardChip = resultModal.locator('.maws-reward-chip').filter({ hasText: '热度' });
  await expect(heatRewardChip).toContainText('+1');
  await expect(resultModal).toContainText(/热度\s*\+1/);
  await expect(resultModal).not.toContainText(/风险\/热度\s*\+1/);
  await expect(resultModal).not.toContainText(/风险\s*\+1/);
  expect(await page.evaluate(() => window.MAWS_STORE.state.player.heat)).toBe(1);

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

test('unavailable combat distance explains how to change distance', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
    store.state.combat.distance = 'ground';
    store.emit();
  });
  const combatUi = page.locator('.maws-combat-ui');
  await expect(combatUi).toBeVisible();
  await expect(combatUi).toContainText('改变距离');
  await expect(combatUi).toContainText(/前压|后撤|脱身/);

  expect(errors).toEqual([]);
});

test('unavailable combat distance exposes a clickable fallback when no learned movement action is legal', async ({ page }) => {
  const errors = await loadGame(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
    store.state.equipSkills = ['straight', 'grip'];
    store.state.skillState.straight = { p: 16, use: 0, retrain: 0, zhus: [] };
    store.state.skillState.grip = { p: 16, use: 0, retrain: 0, zhus: [] };
    store.state.combat.distance = 'far';
    store.state.combat.selected = [];
    store.state.combat.playerQueue = [];
    store.emit();
  });

  const combatUi = page.locator('.maws-combat-ui');
  await expect(combatUi).toBeVisible();
  const adjust = combatUi.locator('button[data-action="adjustCombatDistance"]');
  await expect(adjust).toBeVisible();
  await expect(adjust).toContainText('调整距离');
  await adjust.click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.distance)).toBe('mid');
  await expect(combatUi).toContainText('中距');

  expect(errors).toEqual([]);
});

test('random event confirmation produces visible result feedback', async ({ page }) => {
  const errors = await loadGame(page);

  const card = await page.evaluate(async () => {
    const store = window.MAWS_STORE;
    store.state.day = 1;
    store.state.time = 600;
    store.state.loc = 'home';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, toast: null, cityMapOpen: false };
    store.emit();
    const { buildOpportunities } = await import('/maws_src/simulation/events.js');
    const cards = buildOpportunities(store.state);
    const chosen = cards.find((item) => item.loc === store.state.loc && !item.enemy && !item.action && !item.npc)
      || cards.find((item) => !item.enemy && !item.action && !item.npc)
      || cards.find((item) => item.loc === store.state.loc && !item.enemy && !item.action)
      || cards.find((item) => !item.enemy && !item.action);
    if (chosen?.loc) store.state.loc = chosen.loc;
    store.emit();
    return chosen ? { id: chosen.id, title: chosen.title, loc: chosen.loc } : null;
  });
  expect(card, 'expected a non-combat random event opportunity').not.toBeNull();

  await page.evaluate((id) => window.MAWS_STORE.dispatch({ type: 'takeOpportunity', id }), card.id);
  const eventNotebook = page.locator('.maws-modal.event-notebook');
  await expect(eventNotebook).toBeVisible();
  await expect(eventNotebook).toContainText(/事件风险：?(低|中|高|剧情|终局)/);
  await expect(eventNotebook).not.toContainText(/风险\s*[+＋]\s*\d/);
  await page.locator('button[data-action="resolveEventNotebook"]').first().click();
  await expect(page.locator('.maws-modal')).toBeVisible();

  const feedback = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    return {
      modalType: store.state.ui.modal?.type || '',
      modalText: document.querySelector('.maws-modal')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      latestLog: store.state.log?.[0]?.text || '',
      latestEvent: store.state.eventLog?.[0]?.text || ''
    };
  });
  expect(feedback.modalType || feedback.latestLog || feedback.latestEvent).toBeTruthy();
  expect(`${feedback.modalText} ${feedback.latestLog} ${feedback.latestEvent}`).toMatch(/结果|完成|处理|商店|已记录|继续刷新|记下/);
  expect(feedback.modalText).not.toMatch(/风险\s*[+＋]\s*\d/);

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
