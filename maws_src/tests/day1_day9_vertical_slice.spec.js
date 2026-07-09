import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
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
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
};

let server;
let baseURL;

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath === '/' ? ENTRY : urlPath);
  const target = path.resolve(ROOT, `.${decoded}`);
  const relative = path.relative(ROOT, target);
  return relative.startsWith('..') || path.isAbsolute(relative) ? null : target;
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
      if (!info.isFile()) throw new Error('Not a file');
      res.writeHead(200, { 'content-type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream' });
      createReadStream(target).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseURL = `http://127.0.0.1:${server.address().port}${ENTRY}`;
  await mkdir(path.join(ROOT, 'outputs'), { recursive: true });
});

test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

async function loadGame(page, viewport = DESKTOP) {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize(viewport);
  await page.goto(baseURL);
  await page.waitForFunction(() => window.MAWS_GAME && window.MAWS_STORE && document.querySelector('canvas'));
  await page.evaluate(() => {
    localStorage.clear();
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'day1-day9-vertical-slice' });
  });
  return errors;
}

async function startDay8(page, loadout = ['guard_counter', 'cool_exit']) {
  await page.evaluate((recipeLoadout) => {
    const store = window.MAWS_STORE;
    store.state.day = 8;
    store.state.time = 600;
    store.state.loc = 'boxing';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 8, npcActionGates: {} };
    delete store.state.flags.main_8;
    store.state.player.combatRecipeLoadout = recipeLoadout;
    store.emit();
    store.dispatch({ type: 'startMainEvent' });
  }, loadout);
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
}

async function expectNoHorizontalOverflow(page, label) {
  const size = await page.evaluate(() => ({
    viewport: innerWidth,
    scroll: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)
  }));
  expect(size.scroll, `${label} horizontal overflow`).toBeLessThanOrEqual(size.viewport + 1);
}

test('Day 8 runs three measurement windows and can complete all three objectives', async ({ page }) => {
  const errors = await loadGame(page);
  await startDay8(page);

  const start = await page.evaluate(() => ({
    objectiveSet: window.MAWS_STORE.state.combat.objectiveSet,
    objectives: window.MAWS_STORE.state.combat.objectives,
    mainAlreadyDone: Boolean(window.MAWS_STORE.state.flags.main_8)
  }));
  expect(start.objectiveSet).toBe('first_wind');
  expect(start.objectives).toEqual(['firstWindReadTell', 'firstWindProtect', 'firstWindRecipe']);
  expect(start.mainAlreadyDone, 'Day 8 effects must land after the measurement, not at battle start').toBe(false);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(ROOT, 'outputs', 'day8-combat-desktop.png') });

  await page.locator('button[data-action="queueCombatRecipe"][data-id="guard_counter"]').click();
  await page.locator('button[data-action="confirmBattle"]').first().click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.windowCount)).toBe(1);

  await page.evaluate(() => {
    window.MAWS_STORE.state.combat.distance = 'mid';
    window.MAWS_STORE.emit();
  });
  await page.locator('button[data-action="queueCombatRecipe"][data-id="cool_exit"]').click();
  await page.locator('button[data-action="confirmBattle"]').first().click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.combat?.windowCount)).toBe(2);

  await page.evaluate(() => {
    window.MAWS_STORE.state.combat.distance = 'mid';
    window.MAWS_STORE.emit();
  });
  await page.locator('button[data-action="queueCombatRecipe"][data-id="guard_counter"]').click();
  await page.locator('button[data-action="confirmBattle"]').first().click();
  await expect(page.locator('.maws-modal')).toContainText('一阵风');

  const result = await page.evaluate(() => ({
    modal: window.MAWS_STORE.state.ui.modal,
    result: window.MAWS_STORE.state.maw.firstWindResult,
    memory: window.MAWS_STORE.state.combatMemory,
    mainDone: Boolean(window.MAWS_STORE.state.flags.main_8)
  }));
  expect(result.result).toMatchObject({ tier: 'reassessed', completed: 3, total: 3 });
  expect(result.modal.title).toContain('让对方重新估量');
  expect(result.modal.objectiveLines.every((item) => item.done)).toBe(true);
  expect(result.memory.losses, 'measurement fights should not count as ordinary losses').toBe(0);
  expect(result.memory.lastResult).toBe('measure_reassessed');
  expect(result.mainDone).toBe(true);
  expect(errors).toEqual([]);
});

test('Day 8 maps one, two, and three objectives to distinct non-humiliating results', async ({ page }) => {
  const errors = await loadGame(page);
  const cases = [
    { count: 1, tier: 'measured', title: '被量出差距' },
    { count: 2, tier: 'steady', title: '稳住了' },
    { count: 3, tier: 'reassessed', title: '让对方重新估量' }
  ];

  for (const item of cases) {
    await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'day8-tier-check' }));
    await startDay8(page);
    const result = await page.evaluate(({ count }) => {
      const store = window.MAWS_STORE;
      store.state.combat.objectives.forEach((id, index) => {
        store.state.combat.objectiveProgress[id] = index < count;
      });
      store.dispatch({ type: 'surrender' });
      return {
        tier: store.state.ui.modal.tier,
        title: store.state.ui.modal.title,
        body: store.state.ui.modal.body
      };
    }, item);
    expect(result.tier).toBe(item.tier);
    expect(result.title).toContain(item.title);
    expect(result.body).not.toMatch(/废物|菜鸡|丢人|羞辱/);
  }
  expect(errors).toEqual([]);
});

test('Day 9 diary pages route into bag training and unlock the boxing recipe source', async ({ page }) => {
  const errors = await loadGame(page);
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 9;
    store.state.time = 480;
    store.state.loc = 'home';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 9, npcActionGates: {} };
    store.emit();
    store.dispatch({ type: 'startMainEvent' });
  });

  await page.locator('button[data-action="advanceDialogue"]').click();
  await page.locator('button[data-action="advanceDialogue"]').click();
  await page.locator('button[data-action="completeDialogue"]').click();
  await expect(page.locator('.maws-diary-current')).toContainText('给小闲');
  await expect(page.locator('.maws-modal.diary details')).not.toHaveAttribute('open', '');

  await page.locator('button[data-action="turnFatherDiaryPage"][data-delta="1"]').click();
  await page.locator('button[data-action="turnFatherDiaryPage"][data-delta="1"]').click();
  await expect(page.locator('.maws-diary-current')).toContainText('没说出口的话');
  const routeButton = page.locator('button[data-action="openDiaryTrainingRoute"]');
  await expect(routeButton).toContainText('去拳馆练刺拳');
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(ROOT, 'outputs', 'day9-diary-desktop.png') });
  await page.setViewportSize(MOBILE);
  await expectNoHorizontalOverflow(page, 'Day 9 mobile diary');
  await page.screenshot({ path: path.join(ROOT, 'outputs', 'day9-diary-mobile.png') });
  await page.setViewportSize(DESKTOP);
  await routeButton.click();

  expect(await page.evaluate(() => window.MAWS_STORE.state.ui.selectedTravel)).toBe('boxing');
  await page.locator('button[data-action="travel"]').first().click();
  const travelResultClose = page.locator('.maws-modal button[data-action="closeModal"]');
  if (await travelResultClose.count()) await travelResultClose.first().click();
  await expect(page.locator('button[data-action="doAction"][data-id="bag"]')).toBeVisible();
  await page.locator('button[data-action="doAction"][data-id="bag"]').click();
  const standard = page.locator('button[data-action="chooseDuration"][data-duration="standard"]');
  if (await standard.count()) await standard.click();

  for (let round = 0; round < 3; round += 1) {
    await page.locator('button[data-action="answerTraining"]').first().click();
  }
  await expect(page.locator('.maws-modal')).toContainText('刺拳');
  const unlock = await page.evaluate(async () => {
    const { buildRenderModel } = await import('/maws_src/simulation/state.js');
    const store = window.MAWS_STORE;
    const model = buildRenderModel(store.state);
    return {
      jab: Boolean(store.state.unlocked.jab),
      straight: Boolean(store.state.unlocked.straight),
      recipe: model.combatRecipes.find((item) => item.id === 'boxing_one_two')
    };
  });
  expect(unlock.jab).toBe(true);
  expect(unlock.straight).toBe(true);
  expect(unlock.recipe.unlocked).toBe(true);
  expect(errors).toEqual([]);
});

test('390x844 Day 8 stage renders pixels and the combat HUD stays within the viewport', async ({ page }) => {
  const errors = await loadGame(page, MOBILE);
  await startDay8(page);
  await page.waitForTimeout(1800);
  await expectNoHorizontalOverflow(page, 'Day 8 mobile combat');

  const screenshot = await page.screenshot({ path: path.join(ROOT, 'outputs', 'day8-combat-mobile.png') });
  const canvasRead = await page.evaluate(async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const sample = context.getImageData(32, 150, Math.min(326, image.width - 32), Math.min(400, image.height - 150));
    const pixels = sample.data;
    let colored = 0;
    for (let index = 0; index < pixels.length; index += 160) {
      if (pixels[index] + pixels[index + 1] + pixels[index + 2] > 40 && pixels[index + 3] > 0) colored += 1;
    }
    return { supported: Boolean(context), colored };
  }, `data:image/png;base64,${screenshot.toString('base64')}`);
  expect(canvasRead.supported).toBe(true);
  expect(canvasRead.colored, 'mobile battle canvas should not be blank after the Phaser first frame').toBeGreaterThan(100);
  expect(errors).toEqual([]);
});
