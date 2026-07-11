import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
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

async function loadGame(page, viewport = { width: 900, height: 700 }) {
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

test('Day 1 new game, metro entry, skill sources, and Day 5 E01 entry stay playable', async ({ page }) => {
  const errors = await loadGame(page);

  const dayOne = await page.evaluate(() => {
    const state = window.MAWS_STORE.state;
    return {
      day: state.day,
      loc: state.loc,
      starterSkills: Object.keys(state.unlocked).filter((id) => state.unlocked[id]).sort(),
      equipped: state.equipSkills
    };
  });
  expect(dayOne).toMatchObject({
    day: 1,
    loc: 'home'
  });
  expect(dayOne.starterSkills).toEqual(['guard', 'mystic', 'push_away', 'retreat', 'talkdown', 'wild_swing']);
  expect(dayOne.starterSkills).not.toContain('jab');
  expect(dayOne.starterSkills).not.toContain('advance');
  expect(dayOne.equipped).toEqual(['wild_swing', 'push_away', 'mystic', 'guard', 'retreat', 'talkdown']);
  await expect(page.locator('.maws-scene-agenda').filter({ hasText: /父亲/ })).toBeVisible();

  await page.locator('button[data-action="openCityMap"]').first().click();
  await expect(page.locator('button.maws-city-marker[data-loc="metro_station"]:not(.locked)')).toBeVisible();
  await page.locator('button.maws-city-marker[data-loc="metro_station"]').click();
  await expect(page.locator('button[data-action="travel"][data-loc="metro_station"]').first()).toBeVisible();
  await page.locator('button[data-action="travel"][data-loc="metro_station"]').first().click();
  await page.locator('button[data-action="closeModal"]').click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.loc)).toBe('metro_station');
  await page.locator('.maws-command-drawer > summary').click();
  await page.locator('.maws-drawer-section').first().locator('summary').first().click();
  await expect(page.locator('button[data-action="doAction"][data-id^="metro_"]').first()).toBeVisible();
  await expectNoHorizontalOverflow(page, 'metro entry');

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  expect(await page.locator('.maws-skill-unlock.initial').count()).toBeGreaterThan(0);
  expect(await page.locator('.maws-skill-unlock.planned').count()).toBeGreaterThan(0);
  expect(await page.locator('.maws-skill-unlock.locked').count()).toBeGreaterThan(0);
  expect(await page.locator('.maws-skill-unlock').filter({ hasText: /来源/ }).count()).toBeGreaterThan(0);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 420;
    store.state.loc = 'park';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, selectedTravel: null, cityMapOpen: false };
    delete store.state.flags.main_5;
    store.emit();
  });
  await expect(page.locator('button[data-action="startMainEvent"]').first()).toBeVisible();
  await page.locator('button[data-action="startMainEvent"]').first().evaluate((button) => button.click());
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  const dayFiveCombat = await page.evaluate(() => ({
    day: window.MAWS_STORE.state.day,
    enemyId: window.MAWS_STORE.state.combat?.enemyId,
    main: Boolean(window.MAWS_STORE.state.combat?.main),
    objectiveSet: window.MAWS_STORE.state.combat?.objectiveSet || '',
    ruleSet: window.MAWS_STORE.state.combat?.ruleSet?.id || ''
  }));
  expect(dayFiveCombat).toEqual({
    day: 5,
    enemyId: 'E01',
    main: true,
    objectiveSet: 'park_check',
    ruleSet: 'park_check'
  });
  await expect(page.locator('.maws-fight-rule')).toContainText('公园验货');
  const starterWildPreview = await page.evaluate(async () => {
    const { previewPlayerAction } = await import('/maws_src/simulation/combat.js');
    const state = window.MAWS_STORE.state;
    const combatInput = {
      ...state.combat,
      day: state.day,
      player: state.player,
      skillState: state.skillState,
      styles: state.styles,
      equipSkills: state.equipSkills
    };
    return ['push_away', 'wild_swing'].map((id) => {
      const preview = previewPlayerAction(combatInput, id);
      return { id, valid: preview.valid, reason: preview.reason, name: preview.name };
    });
  });
  expect(starterWildPreview).toEqual([
    { id: 'push_away', valid: true, reason: '', name: '推搡' },
    { id: 'wild_swing', valid: true, reason: '', name: '野路挥拳' }
  ]);
  await page.evaluate(() => {
    window.MAWS_STORE.state.combat.objectivePassCount = 99;
    window.MAWS_STORE.emit();
  });
  const pushCard = page.locator('.maws-skill.combat-card').filter({ hasText: /推搡/ }).first();
  const wildCard = page.locator('.maws-skill.combat-card').filter({ hasText: /野路挥拳/ }).first();
  await expect(pushCard.locator('button[data-action="selectSkill"]')).toBeEnabled();
  await expect(wildCard.locator('button[data-action="selectSkill"]')).toBeEnabled();
  await pushCard.locator('button[data-action="selectSkill"]').click();
  await wildCard.locator('button[data-action="selectSkill"]').click();
  await page.locator('button[data-action="confirmBattle"]').click();
  const starterWildResolved = await page.evaluate(() => ({
    activeCombat: Boolean(window.MAWS_STORE.state.combat),
    windowCount: window.MAWS_STORE.state.combat?.windowCount || 0,
    log: window.MAWS_STORE.state.combat?.log?.join('\n') || ''
  }));
  expect(starterWildResolved.activeCombat).toBe(true);
  expect(starterWildResolved.windowCount).toBeGreaterThanOrEqual(1);
  expect(starterWildResolved.log).toMatch(/推搡|野路挥拳|推开后立刻挥击/);

  expect(errors).toEqual([]);
});

test('home cooking and recovery items create one-use combat preparation', async ({ page }) => {
  const errors = await loadGame(page);

  const prepared = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.inventory.egg = 1;
    store.state.inventory.greens = 1;
    store.state.inventory.noodles = 1;
    store.state.inventory.ice_pack = 1;
    store.state.player.sp = 40;
    store.state.player.posture = 50;
    store.dispatch({ type: 'doAction', actionId: 'cook_egg_noodles' });
    const crafted = store.state.inventory.home_meal || 0;
    store.state.ui.modal = null;
    store.dispatch({ type: 'useItem', itemId: 'home_meal' });
    store.state.ui.modal = null;
    store.dispatch({ type: 'useItem', itemId: 'ice_pack' });
    return {
      crafted,
      ingredients: {
        egg: store.state.inventory.egg || 0,
        greens: store.state.inventory.greens || 0,
        noodles: store.state.inventory.noodles || 0
      },
      prep: store.state.player.combatPrep
    };
  });

  expect(prepared.crafted).toBe(1);
  expect(prepared.ingredients).toEqual({ egg: 0, greens: 0, noodles: 0 });
  expect(prepared.prep.meal.label).toBe('热饭打底');
  expect(prepared.prep.recovery.label).toBe('关节冷敷');

  const battle = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
    return {
      sp: store.state.player.sp,
      posture: store.state.player.posture,
      prepConsumed: Object.keys(store.state.player.combatPrep || {}).length === 0,
      combatPrep: store.state.combat?.prep,
      log: store.state.combat?.log || []
    };
  });

  expect(battle.sp).toBeGreaterThanOrEqual(82);
  expect(battle.posture).toBeGreaterThanOrEqual(58);
  expect(battle.prepConsumed).toBe(true);
  expect(battle.combatPrep.meal.label).toBe('热饭打底');
  expect(battle.combatPrep.recovery.label).toBe('关节冷敷');
  expect(battle.log.join('\n')).toContain('备战准备');
  expect(errors).toEqual([]);
});

test('combat rules make retreat breathing and empty-queue recovery explicit', async ({ page }) => {
  const errors = await loadGame(page);
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 420;
    store.state.loc = 'park';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 5 };
    store.state.ui = { ...store.state.ui, tab: 'map', modal: null, selectedTravel: null, cityMapOpen: false };
    delete store.state.flags.main_5;
    store.emit();
  });
  await page.locator('button[data-action="startMainEvent"]').first().evaluate((button) => button.click());
  await expect(page.locator('.maws-combat-ui')).toBeVisible();

  const retreat = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.combat.objectivePassCount = 99;
    store.state.combat.distance = 'mid';
    store.state.player.sp = 36;
    store.state.player.posture = 36;
    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'retreat' });
    store.dispatch({ type: 'confirmBattle' });
    const step = (store.state.combat?.steps || []).find((item) => item.actor === 'player' && item.action?.id === 'retreat');
    return { result: step?.result, log: step?.log || [], ruleSet: store.state.combat?.ruleSet?.id };
  });
  expect(retreat.ruleSet).toBe('park_check');
  expect(retreat.result?.distance).toBe('far');
  expect(retreat.result?.recoveredSp).toBe(4);
  expect(retreat.result?.recoveredPosture).toBe(4);
  expect(retreat.log.join('\n')).toContain('呼吸终于赶上了脚步');

  const rest = await page.evaluate(async () => {
    const store = window.MAWS_STORE;
    const { resolveCombatExchange } = await import('/maws_src/simulation/combat.js');
    const input = {
      ...structuredClone(store.state.combat),
      day: store.state.day,
      player: { ...structuredClone(store.state.player), sp: 30, posture: 30 },
      skillState: structuredClone(store.state.skillState),
      styles: structuredClone(store.state.styles),
      equipSkills: [...store.state.equipSkills],
      selected: [],
      playerQueue: []
    };
    const result = resolveCombatExchange(input, [], () => 0.5);
    const steps = result.steps || [];
    const player = steps.find((item) => item.actor === 'player' && item.action?.id === 'rest');
    const recovery = steps.find((item) => item.actor === 'system' && item.action?.id === 'recover');
    return { player: player?.result, recovery: recovery?.result, log: recovery?.log || [] };
  });
  expect(rest.player?.pendingRecovery).toBe(true);
  expect(rest.recovery?.playerRecover).toBeGreaterThanOrEqual(20);
  expect(rest.recovery?.postureRecover).toBe(8);
  expect(rest.log.join('\n')).toContain('喘息结算');
  expect(errors).toEqual([]);
});

test('390x844 skills and map do not overflow horizontally', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);

  await expectNoHorizontalOverflow(page, 'mobile map');
  await page.locator('button[data-action="openCityMap"]').first().click();
  await expect(page.locator('.maws-city-map')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'mobile city map');

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  await expect(page.locator('.maws-skill').first()).toBeVisible();
  expect(await page.locator('.maws-skill-unlock').count()).toBeGreaterThan(0);
  await expectNoHorizontalOverflow(page, 'mobile skills');

  expect(errors).toEqual([]);
});
