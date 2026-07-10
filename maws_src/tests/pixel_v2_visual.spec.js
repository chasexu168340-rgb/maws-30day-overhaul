import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { ASSET_MANIFEST } from '../assets/manifest.js';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const SCREENSHOT_DIR = path.join(ROOT, 'outputs', 'pixel_v2_visual');
const DESKTOP = { name: 'desktop', width: 1365, height: 768 };
const MOBILE = { name: 'mobile', width: 390, height: 844 };
const VIEWPORTS = [DESKTOP, MOBILE];
const IS_CANDIDATE = process.env.PIXEL_V2_VISUAL_MODE === 'candidate';
const ALLOW_LEGACY = process.env.PIXEL_V2_ALLOW_LEGACY === '1';

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const REQUIRED_PIXEL_V2_SAMPLE_KEYS = [
  'backgrounds:bg.home.day',
  'backgrounds:bg.park.day',
  'characters:fighter.player',
  'characters:scene.npc.father_memory',
  'characters:fighter.enemy.untrained',
  'characters:fighter.enemy.beginner',
  'characters:fighter.enemy.silent',
  'sprites:anim.fighter.player',
  'sprites:anim.fighter.enemy.untrained',
  'sprites:anim.fighter.enemy.beginner',
  'sprites:anim.fighter.enemy.silent',
  'portraits:portrait.player',
  'portraits:portrait.father',
  'portraits:portrait.fatty',
  'portraits:portrait.xiaoman',
  'portraits:portrait.worker',
  'portraits:portrait.coach'
];

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
      baseURL = `http://127.0.0.1:${server.address().port}${ENTRY}`;
      resolve();
    });
  });
});

test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

function collectConsoleViolations(page) {
  const violations = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'warning' && /\]GL Driver Message .*ReadPixels/.test(text)) return;
    if (msg.type() === 'warning' && /CONTEXT_LOST_WEBGL: loseContext: context lost/i.test(text)) return;
    if (['warning', 'error'].includes(msg.type())) violations.push(`${msg.type()}: ${text}`);
  });
  page.on('pageerror', (error) => violations.push(`pageerror: ${error.message}`));
  return violations;
}

async function loadGame(page, viewport) {
  const violations = collectConsoleViolations(page);
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(baseURL);
  await page.waitForFunction(
    () => window.MAWS_GAME && window.MAWS_STORE && document.querySelectorAll('canvas').length > 0,
    null,
    { timeout: 15000 }
  );
  await page.evaluate(() => {
    localStorage.clear();
    window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'pixel-v2-visual' });
  });
  await page.locator('#maws-ui-root').waitFor({ state: 'attached' });
  return violations;
}

async function startDay8(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 8;
    store.state.time = 600;
    store.state.loc = 'boxing';
    store.state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: 8, npcActionGates: {} };
    store.state.player.combatRecipeLoadout = ['guard_counter', 'cool_exit'];
    delete store.state.flags.main_8;
    store.emit();
    store.dispatch({ type: 'startMainEvent' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startDay5(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 5;
    store.state.time = 960;
    store.state.loc = 'park';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startDay3FunTarget(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 3;
    store.state.time = 960;
    store.state.loc = 'park';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E00' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function showDay3Store(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 3;
    store.state.time = 600;
    store.state.loc = 'store';
    store.emit();
  });
  await expect(page.locator('.maws-scene')).toBeVisible();
  await page.waitForTimeout(500);
}

async function showDay4Worksite(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 4;
    store.state.time = 600;
    store.state.loc = 'worksite';
    delete store.state.flags.main_4;
    store.emit();
  });
  await expect(page.locator('.maws-scene')).toBeVisible();
  await page.waitForTimeout(500);
}

async function showDay9Boxing(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 9;
    store.state.time = 600;
    store.state.loc = 'boxing';
    store.emit();
  });
  await expect(page.locator('.maws-scene')).toBeVisible();
  await page.waitForTimeout(500);
}

async function expectNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    body: document.body.scrollWidth,
    doc: document.documentElement.scrollWidth
  }));
  expect(Math.max(metrics.body, metrics.doc), `${label} horizontal overflow`).toBeLessThanOrEqual(metrics.viewport + 1);
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

async function expectVisibleImagesDecode(page, label) {
  const result = await page.evaluate(async () => {
    const images = Array.from(document.images).filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(image).visibility !== 'hidden';
    });
    const decoded = [];
    const failed = [];
    for (const image of images) {
      try {
        if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) await image.decode();
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          decoded.push(image.currentSrc || image.src);
        } else {
          failed.push(image.currentSrc || image.src || image.alt || 'unknown image');
        }
      } catch {
        failed.push(image.currentSrc || image.src || image.alt || 'unknown image');
      }
    }
    return { count: images.length, decoded: decoded.length, failed };
  });
  expect(result.count, `${label} should expose image elements for the visual pass`).toBeGreaterThan(0);
  expect(result.failed, `${label} visible images should decode`).toEqual([]);
  expect(result.decoded, `${label} visible image decode count`).toBe(result.count);
}

function pathsForManifestKeys(keys) {
  const byId = new Map(manifestRows().map((row) => [row.id, row.path]));
  return keys.map((key) => ({ key, path: byId.get(key) || '' }));
}

async function expectManifestImagesDecode(page, keys, label) {
  const assets = pathsForManifestKeys(keys);
  expect(assets.filter((asset) => asset.path), `${label} manifest sample paths`).toHaveLength(keys.length);
  const result = await page.evaluate(async (items) => {
    const decoded = [];
    const failed = [];
    for (const item of items) {
      try {
        const image = new Image();
        image.src = `/${item.path}`;
        await image.decode();
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          decoded.push({ key: item.key, width: image.naturalWidth, height: image.naturalHeight });
        } else {
          failed.push(`${item.key}: zero natural size`);
        }
      } catch {
        failed.push(`${item.key}: ${item.path}`);
      }
    }
    return { decoded, failed };
  }, assets);
  expect(result.failed, `${label} manifest images should decode`).toEqual([]);
  expect(result.decoded, `${label} manifest image decode count`).toHaveLength(keys.length);
}

async function expectScreenshotHasPixels(page, outputName, label) {
  const outputPath = path.join(SCREENSHOT_DIR, outputName);
  const screenshot = await page.screenshot({ path: outputPath, fullPage: true });
  const read = await page.evaluate(async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const sample = context.getImageData(0, 0, image.width, image.height).data;
    let colored = 0;
    for (let index = 0; index < sample.length; index += 200) {
      if (sample[index + 3] > 0 && sample[index] + sample[index + 1] + sample[index + 2] > 35) colored += 1;
    }
    return { width: image.width, height: image.height, colored };
  }, `data:image/png;base64,${screenshot.toString('base64')}`);
  expect(read.width, `${label} screenshot width`).toBeGreaterThan(100);
  expect(read.height, `${label} screenshot height`).toBeGreaterThan(100);
  expect(read.colored, `${label} screenshot should not be blank`).toBeGreaterThan(100);
}

async function expectCombatGeometry(page, viewport) {
  const canvas = await box(page, 'canvas');
  const dock = await box(page, '.maws-combat-dock');
  const cards = await box(page, '.maws-combat-window-cards');
  const actions = await box(page, '.maws-combat-actions');
  const confirm = await box(page, '.maws-combat-actions button[data-action="confirmBattle"]');

  expect(canvas.width, `${viewport.name} combat stage canvas width`).toBeGreaterThan(100);
  expect(canvas.height, `${viewport.name} combat stage canvas height`).toBeGreaterThan(100);
  expect(canvas.left, `${viewport.name} canvas should stay in viewport`).toBeGreaterThanOrEqual(0);
  expect(canvas.right, `${viewport.name} canvas should stay in viewport`).toBeLessThanOrEqual(canvas.viewportWidth + 1);
  expect(canvas.top, `${viewport.name} canvas should stay in viewport`).toBeGreaterThanOrEqual(0);
  expect(canvas.bottom, `${viewport.name} canvas should stay in viewport`).toBeLessThanOrEqual(canvas.viewportHeight + 1);

  expect(dock.left, `${viewport.name} command dock should stay in viewport`).toBeGreaterThanOrEqual(0);
  expect(dock.right, `${viewport.name} command dock should stay in viewport`).toBeLessThanOrEqual(dock.viewportWidth + 1);
  expect(dock.bottom, `${viewport.name} command dock should stay in viewport`).toBeLessThanOrEqual(dock.viewportHeight + 1);
  expect(dock.height, `${viewport.name} command dock should leave the stage readable`).toBeLessThanOrEqual(viewport.height * (viewport.name === 'mobile' ? 0.36 : 0.34));
  expect(cards.width, `${viewport.name} command cards should have readable width`).toBeGreaterThan(120);
  expect(cards.height, `${viewport.name} command cards should stay compact`).toBeLessThanOrEqual(dock.height + 1);
  expect(actions.width, `${viewport.name} combat actions should retain hit area`).toBeGreaterThan(72);
  expect(confirm.height, `${viewport.name} confirm action should be thumb/cursor reachable`).toBeGreaterThanOrEqual(viewport.name === 'mobile' ? 32 : 38);
}

function manifestRows() {
  return Object.entries(ASSET_MANIFEST).flatMap(([group, entries]) => Object.entries(entries).map(([key, entry]) => ({
    id: `${group}:${key}`,
    group,
    key,
    path: typeof entry === 'string' ? entry : entry?.src || entry?.path || '',
    status: typeof entry === 'object' ? entry.status : null,
    artVersion: typeof entry === 'object' ? entry.artVersion : null
  })));
}

test('manifest final assets use assets/pixel_v2 and strict mode requires sampled pixel_v2 coverage', () => {
  const rows = manifestRows();
  const finalOutsidePixelV2 = rows.filter((row) => row.status === 'final' && !row.path.includes('assets/pixel_v2/'));
  expect(finalOutsidePixelV2, 'assets marked final must live under assets/pixel_v2').toEqual([]);

  const sampledLegacy = rows
    .filter((row) => REQUIRED_PIXEL_V2_SAMPLE_KEYS.includes(row.id))
    .filter((row) => row.artVersion !== 'pixel-v2' || row.status !== 'final' || !row.path.includes('assets/pixel_v2/'));

  if (IS_CANDIDATE && ALLOW_LEGACY) {
    test.info().annotations.push({
      type: 'pixel-v2-candidate',
      description: `legacy tolerated for ${sampledLegacy.map((row) => row.id).join(', ')}`
    });
    return;
  }

  expect(sampledLegacy, [
    'Strict Pixel V2 visual gate requires sampled Day 1/Day 8 runtime assets to be final pixel_v2 files.',
    'For candidate review only, run with PIXEL_V2_VISUAL_MODE=candidate and PIXEL_V2_ALLOW_LEGACY=1.'
  ].join(' ')).toEqual([]);
});

test('pixel_v2 player strip advances through real attack frames in Phaser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay8(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2FrameNames = [];
    window.__pixelV2FrameTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      if (sprite?.frame?.name !== undefined) window.__pixelV2FrameNames.push(Number(sprite.frame.name));
    }, 32);

    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'wild_swing' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(
    () => (window.__pixelV2FrameNames || []).some((frame) => frame >= 4 && frame <= 7),
    null,
    { timeout: 3000 }
  );
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'player-attack-desktop.png'), fullPage: true });
  await page.waitForTimeout(850);

  const playback = await page.evaluate(() => {
    clearInterval(window.__pixelV2FrameTimer);
    const store = window.MAWS_STORE;
    return {
      frameNames: window.__pixelV2FrameNames || [],
      steps: (store.state.combat?.steps || []).map((step) => ({
        actor: step.actor,
        id: step.action?.id || null,
        type: step.action?.type || null
      }))
    };
  });
  const samples = playback.frameNames;

  expect(samples.length, 'Phaser should expose player animation frame samples').toBeGreaterThan(6);
  expect(new Set(samples).size, 'player sprite should advance beyond a static frame').toBeGreaterThan(2);
  expect(samples.some((frame) => frame >= 4 && frame <= 7), `player sprite should enter the pixel_v2 attack range; sampled ${samples.join(',')}; steps ${JSON.stringify(playback.steps)}`).toBe(true);
  expect(violations, 'player animation should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 untrained target strip advances through real attack frames in Phaser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay3FunTarget(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2UntrainedFrameNames = [];
    window.__pixelV2UntrainedFrameTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.untrained');
      if (sprite?.frame?.name !== undefined) window.__pixelV2UntrainedFrameNames.push(Number(sprite.frame.name));
    }, 32);

    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'guard' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(
    () => (window.__pixelV2UntrainedFrameNames || []).some((frame) => frame >= 4 && frame <= 7),
    null,
    { timeout: 3000 }
  );
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'untrained-target-attack-desktop.png'), fullPage: true });
  await page.waitForTimeout(850);

  const samples = await page.evaluate(() => {
    clearInterval(window.__pixelV2UntrainedFrameTimer);
    return window.__pixelV2UntrainedFrameNames || [];
  });

  expect(samples.length, 'Phaser should expose untrained-target animation frame samples').toBeGreaterThan(6);
  expect(new Set(samples).size, 'untrained-target sprite should advance beyond a static frame').toBeGreaterThan(2);
  expect(samples.some((frame) => frame >= 4 && frame <= 7), `untrained target should enter attack frames; sampled ${samples.join(',')}`).toBe(true);
  expect(violations, 'untrained-target animation should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 beginner boxer strip advances through real attack frames in Phaser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay5(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2BeginnerFrameNames = [];
    window.__pixelV2BeginnerFrameTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.beginner');
      if (sprite?.frame?.name !== undefined) window.__pixelV2BeginnerFrameNames.push(Number(sprite.frame.name));
    }, 32);

    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'guard' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(
    () => (window.__pixelV2BeginnerFrameNames || []).some((frame) => frame >= 4 && frame <= 7),
    null,
    { timeout: 3000 }
  );
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'beginner-boxer-attack-desktop.png'), fullPage: true });
  await page.waitForTimeout(850);

  const samples = await page.evaluate(() => {
    clearInterval(window.__pixelV2BeginnerFrameTimer);
    return window.__pixelV2BeginnerFrameNames || [];
  });

  expect(samples.length, 'Phaser should expose beginner-boxer animation frame samples').toBeGreaterThan(6);
  expect(new Set(samples).size, 'beginner-boxer sprite should advance beyond a static frame').toBeGreaterThan(2);
  expect(samples.some((frame) => frame >= 4 && frame <= 7), `beginner boxer should enter attack frames; sampled ${samples.join(',')}`).toBe(true);
  expect(violations, 'beginner-boxer animation should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 silent boxer strip advances through real attack frames in Phaser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay8(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2EnemyFrameNames = [];
    window.__pixelV2EnemyFrameTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.silent');
      if (sprite?.frame?.name !== undefined) window.__pixelV2EnemyFrameNames.push(Number(sprite.frame.name));
    }, 32);

    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'guard' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(
    () => (window.__pixelV2EnemyFrameNames || []).some((frame) => frame >= 4 && frame <= 7),
    null,
    { timeout: 3000 }
  );
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'silent-boxer-attack-desktop.png'), fullPage: true });
  await page.waitForTimeout(850);

  const samples = await page.evaluate(() => {
    clearInterval(window.__pixelV2EnemyFrameTimer);
    return window.__pixelV2EnemyFrameNames || [];
  });

  expect(samples.length, 'Phaser should expose silent-boxer animation frame samples').toBeGreaterThan(6);
  expect(new Set(samples).size, 'silent-boxer sprite should advance beyond a static frame').toBeGreaterThan(2);
  expect(samples.some((frame) => frame >= 4 && frame <= 7), `silent boxer should enter attack frames; sampled ${samples.join(',')}`).toBe(true);
  expect(violations, 'silent-boxer animation should not emit warnings/errors').toEqual([]);
});

for (const viewport of VIEWPORTS) {
  test(`Day 1 ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await expect(page.locator('.maws-scene')).toBeVisible();
    await expect(page.locator('.maws-scene-character img').first()).toBeVisible();
    await expect(page.locator('.maws-scene-character:has(img[src*="scene_npc_fatty.png"])')).not.toHaveClass(/placeholder-npc/);
    await expect(page.locator('.maws-scene-character:has(img[src*="scene_npc_father_memory.png"])')).not.toHaveClass(/placeholder-npc/);
    await expectVisibleImagesDecode(page, `Day 1 ${viewport.name}`);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.home.day',
      'characters:fighter.player',
      'characters:scene.npc.fatty',
      'characters:scene.npc.father_memory',
      'portraits:portrait.player',
      'portraits:portrait.father',
      'portraits:portrait.fatty'
    ], `Day 1 ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 1 ${viewport.name}`);
    if (viewport.name === 'desktop') {
      const fatherBox = await box(page, '.maws-scene-character:has(img[src*="scene_npc_father_memory.png"])');
      expect(fatherBox.right, 'Day 1 father should stay left of the desktop action rail').toBeLessThanOrEqual(viewport.width - 280);
    }
    await expectScreenshotHasPixels(page, `day1-${viewport.name}.png`, `Day 1 ${viewport.name}`);

    await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startMainEvent' }));
    await expect(page.locator('.maws-dialogue-portrait-img[src*="portrait_player.png"]')).toBeVisible();
    await page.locator('button[data-action="advanceDialogue"]').click();
    await expect(page.locator('.maws-dialogue-portrait-img[src*="portrait_father.png"]')).toBeVisible();
    await expectNoHorizontalOverflow(page, `Day 1 father dialogue ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day1-father-dialogue-${viewport.name}.png`, `Day 1 father dialogue ${viewport.name}`);
    expect(violations, `Day 1 ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 8 ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startDay8(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.park.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.silent'
    ], `Day 8 ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 8 ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    await expectScreenshotHasPixels(page, `day8-${viewport.name}.png`, `Day 8 ${viewport.name}`);
    expect(violations, `Day 8 ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 3 store ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await showDay3Store(page);
    const xiaoman = page.locator('.maws-scene-character:has(img[src*="scene_npc_xiaoman.png"])');
    await expect(xiaoman).toBeVisible();
    await expect(xiaoman).not.toHaveClass(/placeholder-npc/);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.store.day',
      'characters:scene.npc.xiaoman',
      'portraits:portrait.xiaoman'
    ], `Day 3 store ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 3 store ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day3-store-${viewport.name}.png`, `Day 3 store ${viewport.name}`);
    expect(violations, `Day 3 store ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 4 worksite ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await showDay4Worksite(page);
    const worker = page.locator('.maws-scene-character:has(img[src*="scene_npc_worker.png"])');
    await expect(worker).toBeVisible();
    await expect(worker).not.toHaveClass(/placeholder-npc/);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.worksite.day',
      'characters:scene.npc.worker',
      'portraits:portrait.worker'
    ], `Day 4 worksite ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 4 worksite ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day4-worksite-${viewport.name}.png`, `Day 4 worksite ${viewport.name}`);

    await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startMainEvent' }));
    await expect(page.locator('.maws-dialogue-portrait-img[src*="portrait_worker.png"]')).toBeVisible();
    await expectNoHorizontalOverflow(page, `Day 4 dialogue ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day4-dialogue-${viewport.name}.png`, `Day 4 dialogue ${viewport.name}`);
    expect(violations, `Day 4 worksite ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 9 boxing ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await showDay9Boxing(page);
    const coach = page.locator('.maws-scene-character:has(img[src*="scene_npc_coach.png"])');
    await expect(coach).toBeVisible();
    await expect(coach).not.toHaveClass(/placeholder-npc/);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.boxing.day',
      'characters:scene.npc.coach',
      'portraits:portrait.coach'
    ], `Day 9 boxing ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 9 boxing ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day9-boxing-${viewport.name}.png`, `Day 9 boxing ${viewport.name}`);
    expect(violations, `Day 9 boxing ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 5 ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startDay5(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.park.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.beginner'
    ], `Day 5 ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 5 ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    await expectScreenshotHasPixels(page, `day5-${viewport.name}.png`, `Day 5 ${viewport.name}`);
    expect(violations, `Day 5 ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`Day 3 E00 ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startDay3FunTarget(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.park.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.untrained'
    ], `Day 3 E00 ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 3 E00 ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    await expectScreenshotHasPixels(page, `day3-e00-${viewport.name}.png`, `Day 3 E00 ${viewport.name}`);
    expect(violations, `Day 3 E00 ${viewport.name} console warnings/errors`).toEqual([]);
  });
}
