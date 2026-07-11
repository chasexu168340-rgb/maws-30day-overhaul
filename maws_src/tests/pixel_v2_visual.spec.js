import { test, expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { ASSET_MANIFEST } from '../assets/manifest.js';
import { BOOT_ASSET_KEYS } from '../phaser/scenes/BootScene.js';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const SCREENSHOT_DIR = path.join(ROOT, 'outputs', 'pixel_v2_visual');
const DESKTOP = { name: 'desktop', width: 1365, height: 768 };
const MOBILE = { name: 'mobile', width: 390, height: 844 };
const VIEWPORTS = [DESKTOP, MOBILE];
const UI_SHELL_VIEWPORTS = [
  { name: 'tablet', width: 900, height: 700 },
  { name: 'wide', width: 1536, height: 864 }
];
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
  'backgrounds:bg.city.map.day',
  'backgrounds:bg.city.map.night',
  'backgrounds:bg.home.day',
  'backgrounds:bg.home.night',
  'backgrounds:bg.metro_station.day',
  'backgrounds:bg.metro_station.night',
  'backgrounds:bg.store.day',
  'backgrounds:bg.store.night',
  'backgrounds:bg.store.rain',
  'backgrounds:bg.worksite.day',
  'backgrounds:bg.worksite.night',
  'backgrounds:bg.worksite.dusk',
  'backgrounds:bg.park.day',
  'backgrounds:bg.park.night',
  'backgrounds:bg.boxing.day',
  'backgrounds:bg.boxing.night',
  'backgrounds:bg.sanda_gym.day',
  'backgrounds:bg.sanda_gym.night',
  'backgrounds:bg.karate_dojo.day',
  'backgrounds:bg.karate_dojo.night',
  'backgrounds:bg.taekwondo_club.day',
  'backgrounds:bg.taekwondo_club.night',
  'backgrounds:bg.street.day',
  'backgrounds:bg.street.night',
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
  'portraits:portrait.coach',
  'vfx:combat.normal',
  'vfx:combat.heavy',
  'vfx:combat.guard',
  'vfx:combat.miss',
  'vfx:combat.break',
  'vfx:combat.recipe',
  'vfx:combat.utility',
  'vfx:vfx.scene.click',
  'icons:icon.money',
  'icons:icon.hp',
  'icons:icon.sp',
  'icons:icon.posture',
  'icons:icon.nav.map',
  'icons:icon.nav.profile',
  'icons:icon.nav.skills',
  'icons:icon.nav.bag',
  'icons:icon.nav.shop',
  'icons:icon.nav.npc',
  'icons:icon.nav.log',
  'items:item.rice',
  'items:item.drink',
  'items:item.band',
  'items:item.gloves',
  'items:item.shoes',
  'items:item.mouth',
  'items:item.notebook',
  'items:item.egg',
  'items:item.greens',
  'items:item.noodles',
  'items:item.home_meal',
  'items:item.ice_pack',
  'items:item.pain_gel',
  'skillCards:skill.wild_swing',
  'skillCards:skill.push_away',
  'skillCards:skill.mystic',
  'skillCards:skill.guard',
  'skillCards:skill.retreat',
  'skillCards:skill.talkdown',
  'skillCards:skill.jab',
  'skillCards:skill.straight',
  'skillCards:skill.dodge',
  'ui:ui.frame.panel',
  'ui:ui.frame.dialogue',
  'ui:ui.frame.tooltip',
  'ui:ui.button.dark',
  'ui:ui.button.active',
  'ui:ui.button.disabled',
  'ui:ui.focus.bracket',
  'ui:ui.bar.frame',
  'ui:ui.choice.cursor',
  'ui:ui.tab.dark',
  'ui:ui.tab.active',
  'ui:ui.note.paper'
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

async function startE05(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 12;
    store.state.time = 960;
    store.state.loc = 'boxing';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E05' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startSanda(page, enemyId = 'E19') {
  await page.evaluate((id) => {
    const store = window.MAWS_STORE;
    store.state.day = 20;
    store.state.time = 960;
    store.state.loc = 'sanda_gym';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: id });
  }, enemyId);
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startKarate(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 22;
    store.state.time = 960;
    store.state.loc = 'karate_dojo';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E20' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startTaekwondo(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 24;
    store.state.time = 960;
    store.state.loc = 'taekwondo_club';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E21' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startDirtyMix(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 18;
    store.state.time = 1140;
    store.state.loc = 'street';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E09' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startE06(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 10;
    store.state.time = 960;
    store.state.loc = 'mma';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E06' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startE07(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 18;
    store.state.time = 1140;
    store.state.loc = 'store';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E07' });
  });
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  await page.waitForTimeout(900);
}

async function startE18(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 30;
    store.state.time = 1140;
    store.state.loc = 'boxing';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E18' });
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

async function showDay2Metro(page) {
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.day = 2;
    store.state.time = 600;
    store.state.loc = 'metro_station';
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

async function requestAssetBytes(requestPaths = []) {
  let bytes = 0;
  for (const requestPath of [...new Set(requestPaths)]) {
    const clean = decodeURIComponent(requestPath).replace(/^\/+/, '');
    if (!clean.startsWith('assets/')) continue;
    bytes += (await stat(path.join(ROOT, clean))).size;
  }
  return bytes;
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

test('Day 1-9 pixel_v2 background variants decode in the browser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await expectManifestImagesDecode(page, [
    'backgrounds:bg.home.day',
    'backgrounds:bg.home.night',
    'backgrounds:bg.metro_station.day',
    'backgrounds:bg.metro_station.night',
    'backgrounds:bg.store.day',
    'backgrounds:bg.store.night',
    'backgrounds:bg.store.rain',
    'backgrounds:bg.worksite.day',
    'backgrounds:bg.worksite.night',
    'backgrounds:bg.worksite.dusk',
    'backgrounds:bg.park.day',
    'backgrounds:bg.park.night',
    'backgrounds:bg.boxing.day',
    'backgrounds:bg.boxing.night',
    'backgrounds:bg.sanda_gym.day',
    'backgrounds:bg.sanda_gym.night',
    'backgrounds:bg.karate_dojo.day',
    'backgrounds:bg.karate_dojo.night',
    'backgrounds:bg.taekwondo_club.day',
    'backgrounds:bg.taekwondo_club.night',
    'backgrounds:bg.street.day',
    'backgrounds:bg.street.night'
  ], 'Day 1-9 pixel_v2 backgrounds');
  expect(violations, 'background decode should not emit warnings/errors').toEqual([]);
});

test('Pixel V2 combat and scene feedback textures decode and appear at runtime', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await expectManifestImagesDecode(page, [
    'vfx:combat.normal',
    'vfx:combat.heavy',
    'vfx:combat.guard',
    'vfx:combat.miss',
    'vfx:combat.break',
    'vfx:combat.recipe',
    'vfx:combat.utility',
    'vfx:vfx.scene.click'
  ], 'Pixel V2 feedback textures');

  const character = page.locator('.maws-scene-character.actionable').first();
  await expect(character).toBeVisible();
  await character.click({ position: { x: 38, y: 54 } });
  const clickFx = page.locator('.maws-click-burst.character.pixel-v2 img');
  await expect(clickFx).toBeVisible();
  await expect(clickFx).toHaveAttribute('src', /vfx_scene_click\.png/);

  await startDay8(page);
  await expect(page.locator('.maws-target-control')).toContainText('高位');
  await expect(page.locator('.maws-target-control')).toContainText('中位');
  await expect(page.locator('.maws-target-control')).toContainText('低位');
  await expect(page.locator('.maws-combat-read')).toContainText('读招详情');
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    window.__pixelV2LiveVfx = [];
    const original = scene.spawnPixelCombatVfx.bind(scene);
    scene.spawnPixelCombatVfx = (key, ...args) => {
      window.__pixelV2LiveVfx.push(key);
      return original(key, ...args);
    };
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'wild_swing' });
    store.dispatch({ type: 'confirmBattle' });
  });
  await page.waitForFunction(() => (window.__pixelV2LiveVfx || []).length > 0, null, { timeout: 3000 });
  const liveKeys = await page.evaluate(() => window.__pixelV2LiveVfx || []);
  expect(liveKeys.some((key) => /^combat\.(normal|heavy|guard|miss|break|recipe|utility)$/.test(key)), `live VFX keys: ${liveKeys.join(', ')}`).toBe(true);
  await expectScreenshotHasPixels(page, 'combat-vfx-readability-desktop.png', 'combat VFX readability');
  expect(violations, 'Pixel V2 feedback should not emit warnings/errors').toEqual([]);
});

test('Pixel V2 core icons, inventory, and early skill art decode and render', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  const compactAssets = [
    'icons:icon.money', 'icons:icon.fame', 'icons:icon.auth', 'icons:icon.heat',
    'icons:icon.fitXp', 'icons:icon.hp', 'icons:icon.sp', 'icons:icon.posture',
    'icons:icon.nav.map', 'icons:icon.nav.profile', 'icons:icon.nav.skills', 'icons:icon.nav.bag',
    'icons:icon.nav.shop', 'icons:icon.nav.npc', 'icons:icon.nav.log', 'icons:icon.nav.check',
    'items:item.rice', 'items:item.drink', 'items:item.band', 'items:item.gloves',
    'items:item.shoes', 'items:item.mouth', 'items:item.notebook', 'items:item.training_kit',
    'skillCards:skill.wild_swing', 'skillCards:skill.push_away', 'skillCards:skill.mystic',
    'skillCards:skill.guard', 'skillCards:skill.retreat', 'skillCards:skill.talkdown',
    'skillCards:skill.jab', 'skillCards:skill.straight', 'skillCards:skill.advance',
    'skillCards:skill.dodge', 'skillCards:skill.lowkick', 'skillCards:skill.takedown',
    'skillCards:skill.sprawl', 'skillCards:skill.palm', 'skillCards:skill.dirtyescape',
    'skillCards:skill.recipe.guard_counter'
  ];
  await expectManifestImagesDecode(page, compactAssets, 'Pixel V2 compact assets');

  const navSources = await page.locator('.maws-nav img').evaluateAll((images) => images.map((image) => image.getAttribute('src') || ''));
  expect(navSources.length, 'navigation should render icon images').toBeGreaterThanOrEqual(7);
  expect(navSources.every((src) => src.includes('assets/pixel_v2/icons/')), `navigation sources: ${navSources.join(', ')}`).toBe(true);

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  const starterArt = page.locator('.maws-move-library .maws-skill-art[src*="assets/pixel_v2/skillCards/"]');
  await expect(starterArt.first()).toBeVisible();
  expect(await starterArt.count(), 'skill library should consume reviewed Pixel V2 card art').toBeGreaterThanOrEqual(9);

  await page.locator('button[data-action="setTab"][data-tab="bag"]').click();
  const itemSources = await page.locator('.maws-bag-ledger img[src*="assets/pixel_v2/items/"]').count();
  expect(itemSources, 'inventory should consume reviewed Pixel V2 item art').toBeGreaterThanOrEqual(1);
  expect(violations, 'compact art integration should not emit warnings/errors').toEqual([]);
});

test('Boot and Day 1-9 combat loads stay inside image budgets without blank fighters', async ({ page }) => {
  const requested = [];
  page.on('requestfinished', (request) => {
    const pathname = new URL(request.url()).pathname;
    if (/^\/assets\/.+\.(png|jpe?g|webp)$/i.test(pathname)) requested.push(pathname);
  });
  const violations = await loadGame(page, DESKTOP);
  await page.waitForTimeout(350);

  const bootRows = manifestRows().filter((row) => BOOT_ASSET_KEYS.includes(row.key));
  expect(bootRows.map((row) => row.key).sort(), 'Boot must only preload its explicit core keys').toEqual([...BOOT_ASSET_KEYS].sort());
  const firstLookBytes = await requestAssetBytes(requested);
  expect(firstLookBytes, `Day 1 first-look image bytes: ${firstLookBytes}`).toBeLessThanOrEqual(3 * 1024 * 1024);

  await page.locator('button[data-action="openCityMap"]').first().click();
  await expect(page.locator('.maws-city-map')).toBeVisible();
  await expect(page.locator('.maws-city-map')).toHaveCSS('background-image', /bg_city_map_day\.png/);
  await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'closeCityMap' }));

  const beforeDay5 = new Set(requested);
  await startDay5(page);
  await page.waitForFunction(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const keys = scene?.root?.list?.filter((item) => item?.texture?.key).map((item) => item.texture.key) || [];
    return keys.includes('anim.fighter.player') && keys.includes('anim.fighter.enemy.beginner');
  }, null, { timeout: 5000 });
  const day5Delta = requested.filter((item) => !beforeDay5.has(item));
  const day5Bytes = await requestAssetBytes(day5Delta);
  expect(day5Bytes, `Day 5 combat incremental image bytes: ${day5Bytes}`).toBeLessThanOrEqual(1.2 * 1024 * 1024);

  const beforeDay8 = new Set(requested);
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.state.combat = null;
    store.state.modal = null;
    store.state.day = 8;
    store.state.loc = 'boxing';
    store.emit();
    store.dispatch({ type: 'startBattle', enemyId: 'E10' });
  });
  await page.waitForFunction(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const keys = scene?.root?.list?.filter((item) => item?.texture?.key).map((item) => item.texture.key) || [];
    return keys.includes('anim.fighter.player') && keys.includes('anim.fighter.enemy.silent');
  }, null, { timeout: 5000 });
  const day8Delta = requested.filter((item) => !beforeDay8.has(item));
  const day8Bytes = await requestAssetBytes(day8Delta);
  expect(day8Bytes, `Day 8 combat incremental image bytes: ${day8Bytes}`).toBeLessThanOrEqual(1.2 * 1024 * 1024);
  expect(violations, 'lazy image loading should not emit warnings/errors').toEqual([]);
});

for (const viewport of UI_SHELL_VIEWPORTS) {
  test(`quiet ledger ${viewport.name} responsive contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await expect(page.locator('.maws-quiet-shell')).toBeVisible();
    await expectNoHorizontalOverflow(page, `quiet ledger ${viewport.name}`);
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector('.maws-nav').getBoundingClientRect();
      const rail = document.querySelector('.maws-action-rail-main').getBoundingClientRect();
      const visibleCommands = [...document.querySelectorAll('.maws-scene-command-button')]
        .filter((node) => node.getBoundingClientRect().height > 0);
      return {
        navWidth: nav.width,
        navHeight: nav.height,
        railBottom: rail.bottom,
        visibleCommands: visibleCommands.length,
        drawerOpen: document.querySelector('.maws-command-drawer').open
      };
    });
    expect(geometry.navHeight, 'tablet/wide navigation should remain a side ledger').toBeGreaterThan(geometry.navWidth * 3);
    expect(geometry.railBottom, 'decision dock must stay inside the viewport').toBeLessThanOrEqual(viewport.height);
    expect(geometry.visibleCommands, 'only the immediate decisions should remain visible').toBeLessThanOrEqual(2);
    expect(geometry.drawerOpen, 'task depth should remain opt-in').toBe(false);
    await expectScreenshotHasPixels(page, `day1-quiet-ledger-${viewport.name}.png`, `Day 1 quiet ledger ${viewport.name}`);
    expect(violations, `quiet ledger ${viewport.name} console warnings/errors`).toEqual([]);
  });
}

test('quiet ledger V2 keeps skill depth behind a readable index', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await expect(page.locator('#maws-ui-root')).toHaveClass(/maws-ui-v2/);
  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  const skillbook = page.locator('.maws-skillbook-page');
  await expect(skillbook).toBeVisible();
  await expect(skillbook.locator('.maws-move-future')).not.toHaveAttribute('open', '');
  const hierarchy = await skillbook.evaluate((surface) => {
    const visibleEntries = [...surface.querySelectorAll('.maws-move-library .maws-index-entry')]
      .filter((node) => node.getBoundingClientRect().height > 0);
    const firstArt = surface.querySelector('.maws-move-current .maws-index-art');
    const firstTitle = surface.querySelector('.maws-move-current .maws-index-summary strong');
    return {
      visibleEntries: visibleEntries.length,
      currentEntries: surface.querySelectorAll('.maws-move-current .maws-index-entry').length,
      artSize: firstArt?.getBoundingClientRect().width || 0,
      titleFont: Number.parseFloat(getComputedStyle(firstTitle).fontSize || '0')
    };
  });
  expect(hierarchy.currentEntries, 'learned moves should remain directly reachable').toBeGreaterThanOrEqual(4);
  expect(hierarchy.visibleEntries, 'the skill ledger should not expose the full move catalogue at once').toBeLessThanOrEqual(12);
  expect(hierarchy.artSize, 'move art should lead the row hierarchy').toBeGreaterThanOrEqual(55);
  expect(hierarchy.titleFont, 'move titles should stay subordinate to icons').toBeLessThanOrEqual(12);
  await expectNoHorizontalOverflow(page, 'quiet ledger V2 skills');
  await expectScreenshotHasPixels(page, 'quiet-ledger-v2-skills-desktop.png', 'quiet ledger V2 skills desktop');
  expect(violations, 'quiet ledger V2 skills console warnings/errors').toEqual([]);
});

for (const viewport of VIEWPORTS) {
  test(`Pixel V2 boot ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = collectConsoleViolations(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(baseURL);
    await page.waitForFunction(
      () => window.MAWS_GAME && window.MAWS_STORE && document.querySelectorAll('canvas').length > 0,
      null,
      { timeout: 15000 }
    );
    await expect(page.locator('.maws-title')).toBeVisible();
    await expect(page.locator('.maws-origin').first()).toBeVisible();
    await expectManifestImagesDecode(page, ['backgrounds:bg.city.map.night'], `boot ${viewport.name}`);
    const bootStyle = await page.locator('.maws-title').evaluate((node) => ({
      backgroundImage: getComputedStyle(node).backgroundImage,
      originCount: node.querySelectorAll('.maws-origin').length,
      firstButtonHeight: node.querySelector('.maws-origin button')?.getBoundingClientRect().height || 0
    }));
    expect(bootStyle.backgroundImage, 'boot should use the final pixel city art').toContain('bg_city_map_night.png');
    expect(bootStyle.originCount, 'boot should expose origin choices').toBeGreaterThanOrEqual(1);
    expect(bootStyle.firstButtonHeight, 'origin choice should keep a 44px hit target').toBeGreaterThanOrEqual(44);
    await expectNoHorizontalOverflow(page, `boot ${viewport.name}`);
    await expectScreenshotHasPixels(page, `boot-${viewport.name}.png`, `boot ${viewport.name}`);
    expect(violations, `boot ${viewport.name} console warnings/errors`).toEqual([]);
  });
}

for (const viewport of VIEWPORTS) {
  test(`Pixel V2 non-scene ledger ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    const tabs = [
      { id: 'profile', selector: '.maws-profile-ledger', label: '人物状态册' },
      { id: 'skills', selector: '.maws-skillbook-page', label: '招式簿' },
      { id: 'bag', selector: '.maws-bag-ledger', label: '行囊' },
      { id: 'shop', selector: '.maws-shop-board', label: '补给' },
      { id: 'npc', selector: '.maws-npc-ledger', label: '人物' },
      { id: 'log', selector: '.maws-logbook', label: '记忆' }
    ];

    for (const tab of tabs) {
      const tabButton = page.locator(`button[data-action="setTab"][data-tab="${tab.id}"]`);
      if (!await tabButton.isVisible()) {
        await page.locator('.maws-system-menu > summary').click();
      }
      await tabButton.click();
      const surface = page.locator(tab.selector);
      await expect(surface).toBeVisible();
      await expect(surface).toContainText(tab.label);
      const rect = await box(page, tab.selector);
      expect(rect.left, `${viewport.name} ${tab.id} ledger left edge`).toBeGreaterThanOrEqual(0);
      expect(rect.right, `${viewport.name} ${tab.id} ledger right edge`).toBeLessThanOrEqual(rect.viewportWidth + 1);
      if (viewport.name === 'mobile') {
        const shortTargets = await surface.locator('button:visible').evaluateAll((buttons) => buttons
          .map((button) => ({ text: button.textContent?.trim() || '', height: button.getBoundingClientRect().height }))
          .filter((button) => button.height < 43.5));
        expect(shortTargets, `${tab.id} visible actions should retain 44px mobile targets`).toEqual([]);
      }
      if (tab.id === 'bag' || tab.id === 'shop') {
        const itemHierarchy = await surface.locator('.maws-item').first().evaluate((card) => {
          const visual = card.querySelector('.maws-index-art');
          const title = card.querySelector('.maws-index-summary strong');
          return {
            visualWidth: visual?.getBoundingClientRect().width || 0,
            visualHeight: visual?.getBoundingClientRect().height || 0,
            titleFont: Number.parseFloat(getComputedStyle(title).fontSize || '0')
          };
        });
        expect(itemHierarchy.visualWidth, `${tab.id} item art should be a primary visual`).toBeGreaterThanOrEqual(55);
        expect(itemHierarchy.visualHeight, `${tab.id} item art should keep a square pixel frame`).toBeGreaterThanOrEqual(55);
        expect(itemHierarchy.titleFont, `${tab.id} item title should not overpower its art`).toBeLessThanOrEqual(12);
      }
      await expectNoHorizontalOverflow(page, `${viewport.name} ${tab.id} ledger`);
      await expectScreenshotHasPixels(page, `ledger-${tab.id}-${viewport.name}.png`, `${tab.id} ${viewport.name} ledger`);
    }
    expect(violations, `non-scene ledger ${viewport.name} warnings/errors`).toEqual([]);
  });
}

test('pixel_v2 player strip advances through real attack frames in Phaser', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay8(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2FrameNames = [];
    window.__pixelV2XPositions = [];
    const initialScene = game.scene.getScene('ShellScene');
    const initialPlayer = initialScene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const initialEnemy = initialScene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.silent');
    window.__pixelV2SideLayout = {
      playerX: initialPlayer?.x || 0,
      enemyX: initialEnemy?.x || 0,
      playerFlipX: Boolean(initialPlayer?.flipX),
      enemyFlipX: Boolean(initialEnemy?.flipX)
    };
    window.__pixelV2FrameTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      if (sprite?.frame?.name !== undefined) {
        window.__pixelV2FrameNames.push(Number(sprite.frame.name));
        window.__pixelV2XPositions.push(Number(sprite.x || 0));
      }
    }, 32);

    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'wild_swing' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(
    () => (window.__pixelV2FrameNames || []).some((frame) => frame >= 8 && frame <= 15),
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
      xPositions: window.__pixelV2XPositions || [],
      sideLayout: window.__pixelV2SideLayout || {},
      wildSemantic: window.MAWS_GAME.scene.getScene('ShellScene').actionAnimName({ action: { id: 'wild_swing', type: 'strike' } }),
      steps: (store.state.combat?.steps || []).map((step) => ({
        actor: step.actor,
        id: step.action?.id || null,
        type: step.action?.type || null
      }))
    };
  });
  const samples = playback.frameNames;
  const xRange = playback.xPositions.length ? Math.max(...playback.xPositions) - Math.min(...playback.xPositions) : 0;

  expect(samples.length, 'Phaser should expose player animation frame samples').toBeGreaterThan(6);
  expect(new Set(samples).size, 'player sprite should advance beyond a static frame').toBeGreaterThan(2);
  expect(playback.wildSemantic, 'wild swing should map to the dedicated heavy semantic').toBe('heavy');
  expect(samples.some((frame) => frame >= 8 && frame <= 15), `player should enter an authored attack range; sampled ${samples.join(',')}; steps ${JSON.stringify(playback.steps)}`).toBe(true);
  expect(playback.sideLayout.playerX, 'player should begin on the right side').toBeGreaterThan(playback.sideLayout.enemyX);
  expect(playback.sideLayout.playerFlipX, 'right-side player should face left').toBe(true);
  expect(playback.sideLayout.enemyFlipX, 'left-side enemy should face right').toBe(false);
  expect(xRange, 'player attack should travel toward the opponent instead of animating in place').toBeGreaterThan(70);
  expect(violations, 'player animation should not emit warnings/errors').toEqual([]);
});

test('combat distance changes the real Phaser fighter spacing', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay8(page);
  const spacing = await page.evaluate(async () => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    const read = () => {
      const scene = game.scene.getScene('ShellScene');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.silent');
      return { playerX: player?.x || 0, enemyX: enemy?.x || 0, gap: Math.abs((player?.x || 0) - (enemy?.x || 0)) };
    };
    store.state.combat.distance = 'far';
    store.emit();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const far = read();
    store.state.combat.distance = 'close';
    store.emit();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const close = read();
    return { far, close };
  });
  expect(spacing.far.playerX).toBeGreaterThan(spacing.far.enemyX);
  expect(spacing.close.playerX).toBeGreaterThan(spacing.close.enemyX);
  expect(spacing.far.gap, 'far range should visibly separate the fighters').toBeGreaterThan(spacing.close.gap + 180);
  expect(violations, 'distance layout should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 player uses distinct guard and retreat motion ranges', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay5(page);

  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    const game = window.MAWS_GAME;
    window.__pixelV2DefenseFrames = [];
    window.__pixelV2DefenseX = [];
    window.__pixelV2RetreatStart = 0;
    window.__pixelV2DefenseTimer = setInterval(() => {
      const scene = game.scene.getScene('ShellScene');
      const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      if (sprite?.frame?.name !== undefined) {
        window.__pixelV2DefenseFrames.push(Number(sprite.frame.name));
        window.__pixelV2DefenseX.push(Number(sprite.x || 0));
      }
    }, 24);
    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'guard' });
    store.dispatch({ type: 'confirmBattle' });
  });

  await page.waitForFunction(() => (window.__pixelV2DefenseFrames || []).some((frame) => frame >= 16 && frame <= 19), null, { timeout: 3000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'player-guard-desktop.png'), fullPage: true });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const store = window.MAWS_STORE;
    window.__pixelV2RetreatStart = (window.__pixelV2DefenseX || []).length;
    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'retreat' });
    store.dispatch({ type: 'confirmBattle' });
  });
  await page.waitForFunction(() => (window.__pixelV2DefenseFrames || []).some((frame) => frame >= 24 && frame <= 27), null, { timeout: 3000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'player-retreat-desktop.png'), fullPage: true });

  const playback = await page.evaluate(() => {
    clearInterval(window.__pixelV2DefenseTimer);
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    return {
      frames: window.__pixelV2DefenseFrames || [],
      retreatX: (window.__pixelV2DefenseX || []).slice(window.__pixelV2RetreatStart || 0),
      scaleX: Math.abs(sprite?.scaleX || 0),
      scaleY: Math.abs(sprite?.scaleY || 0)
    };
  });

  expect(playback.frames.some((frame) => frame >= 16 && frame <= 19), `guard frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 24 && frame <= 27), `retreat frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(Math.max(...playback.retreatX) - Math.min(...playback.retreatX), 'retreat should move the player into the new distance instead of animating in place').toBeGreaterThan(24);
  expect(Math.abs(playback.scaleX - playback.scaleY), 'pixel fighters should use uniform scale without width distortion').toBeLessThan(0.001);
  expect(violations, 'semantic player animations should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 advance uses dedicated footwork frames instead of the attack strip', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay5(page);
  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const sprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite, animKey: 'anim.fighter.player', isAnimated: true };
    const semantic = scene.actionAnimName({ action: { id: 'advance', type: 'utility' } });
    const frames = [];
    const timer = setInterval(() => {
      if (sprite?.frame?.name !== undefined) frames.push(Number(sprite.frame.name));
    }, 24);
    scene.playFighterAnim(actor, semantic, true);
    await new Promise((resolve) => setTimeout(resolve, 720));
    clearInterval(timer);
    return { semantic, frames };
  });
  expect(playback.semantic).toBe('advance');
  expect(playback.frames.some((frame) => frame >= 4 && frame <= 7), `advance frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(new Set(playback.frames).size).toBeGreaterThan(2);
  expect(violations, 'advance animation should not emit warnings/errors').toEqual([]);
});

test('combat sound cues are scheduled on contact rather than button press', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDay5(page);
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    scene.combatSfxHistory = [];
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'clearSkills' });
    store.dispatch({ type: 'selectSkill', skillId: 'guard' });
    store.dispatch({ type: 'confirmBattle' });
  });
  await page.waitForFunction(() => {
    const history = window.MAWS_GAME.scene.getScene('ShellScene')?.combatSfxHistory || [];
    return history.some((event) => event.triggered);
  }, null, { timeout: 3500 });
  const history = await page.evaluate(() => window.MAWS_GAME.scene.getScene('ShellScene')?.combatSfxHistory || []);
  expect(history.length, 'combat exchange should schedule at least one sound cue').toBeGreaterThan(0);
  expect(history.some((event) => ['hit', 'heavy', 'break', 'guard', 'miss'].includes(event.cue))).toBe(true);
  history.forEach((event) => {
    expect(event.delay, `${event.cue} should wait for its visual contact frame`).toBeGreaterThanOrEqual(160);
  });
  expect(violations, 'combat sound scheduling should not emit warnings/errors').toEqual([]);
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
    () => (window.__pixelV2UntrainedFrameNames || []).some((frame) => frame >= 8 && frame <= 15),
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
  expect(samples.some((frame) => frame >= 8 && frame <= 15), `untrained target should enter its dedicated sloppy attack frames; sampled ${samples.join(',')}`).toBe(true);
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
    () => (window.__pixelV2BeginnerFrameNames || []).some((frame) => frame >= 8 && frame <= 11),
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
  expect(samples.some((frame) => frame >= 8 && frame <= 11), `beginner boxer should enter the dedicated straight-attack frames; sampled ${samples.join(',')}`).toBe(true);
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
    () => (window.__pixelV2EnemyFrameNames || []).some((frame) => frame >= 8 && frame <= 15),
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
  expect(samples.some((frame) => frame >= 8 && frame <= 15), `silent boxer should enter an authored straight/heavy range; sampled ${samples.join(',')}`).toBe(true);
  expect(violations, 'silent-boxer animation should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E05 sparring partner uses distinct boxing, kick, guard, dodge, and hurt rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE05(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.boxer');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.boxer', isAnimated: true };
    const frames = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) frames.push(Number(enemy.frame.name));
    }, 24);
    const play = async (name) => {
      scene.playFighterAnim(actor, name, true, false);
      await new Promise((resolve) => setTimeout(resolve, 520));
    };
    for (const name of ['advance', 'jab', 'straight', 'lowkick', 'guard', 'dodge', 'hurt']) await play(name);
    clearInterval(timer);
    return {
      frames,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: ['jab', 'straight', 'lowkick', 'guard', 'dodge'].map((id) => scene.fighterActionAnimName({ action: { id, type: id === 'guard' || id === 'dodge' ? 'defense' : 'strike' } }, actor)),
      timings: ['jab', 'straight', 'lowkick'].map((id) => scene.combatContactMs({ action: { id, type: 'strike' } }))
    };
  });

  expect(playback.enemyX, 'E05 should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'E05 source art should face screen-right').toBe(false);
  expect(playback.frameWidth).toBe(96);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual(['jab', 'straight', 'lowkick', 'guard', 'dodge']);
  expect(playback.timings).toEqual([240, 280, 310]);
  for (const [start, end, label] of [[4, 7, 'advance'], [8, 11, 'jab'], [12, 15, 'straight'], [16, 19, 'low kick'], [20, 23, 'guard'], [24, 27, 'dodge'], [28, 31, 'hurt']]) {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `${label} row should play; sampled ${playback.frames.join(',')}`).toBe(true);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e05-sparring-motion-desktop.png'), fullPage: true });
  expect(violations, 'E05 sparring motion should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E08 and E19 sanda fighter uses distinct boxing, kick, sprawl, dodge, and hurt rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startSanda(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.sanda');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.sanda', isAnimated: true };
    const frames = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) frames.push(Number(enemy.frame.name));
    }, 24);
    const play = async (name) => {
      scene.playFighterAnim(actor, name, true, false);
      await new Promise((resolve) => setTimeout(resolve, 520));
    };
    for (const name of ['advance', 'boxing', 'roundkick', 'frontkick', 'sprawl', 'dodge', 'hurt']) await play(name);
    clearInterval(timer);
    const semanticIds = ['jab', 'sanda_whip_kick', 'frontkick', 'sanda_catch_throw', 'dodge'];
    return {
      frames,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: semanticIds.map((id) => scene.fighterActionAnimName({ action: { id, type: id === 'sanda_catch_throw' ? 'grapple' : 'strike' } }, actor)),
      timings: semanticIds.slice(0, 4).map((id) => scene.combatContactMs({ action: { id, type: id === 'sanda_catch_throw' ? 'grapple' : 'strike' } }))
    };
  });

  expect(playback.enemyX, 'sanda fighter should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'sanda source art should face screen-right').toBe(false);
  expect(playback.frameWidth).toBe(96);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual(['boxing', 'roundkick', 'frontkick', 'sprawl', 'dodge']);
  expect(playback.timings).toEqual([240, 320, 310, 380]);
  for (const [start, end, label] of [[4, 7, 'advance'], [8, 11, 'boxing'], [12, 15, 'round kick'], [16, 19, 'front kick'], [20, 23, 'sprawl'], [24, 27, 'dodge'], [28, 31, 'hurt']]) {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `${label} row should play; sampled ${playback.frames.join(',')}`).toBe(true);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sanda-motion-desktop.png'), fullPage: true });
  expect(violations, 'sanda motion should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E20 karate fighter uses reverse punch, front kick, guard, recovery, dodge, and hurt rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startKarate(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.karate');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.karate', isAnimated: true };
    const frames = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) frames.push(Number(enemy.frame.name));
    }, 24);
    const play = async (name) => {
      scene.playFighterAnim(actor, name, true, false);
      await new Promise((resolve) => setTimeout(resolve, 540));
    };
    for (const name of ['advance', 'reversepunch', 'frontkick', 'guard', 'recover', 'dodge', 'hurt']) await play(name);
    clearInterval(timer);
    const semanticIds = ['karate_reverse_punch', 'karate_front_kick', 'guard', 'dodge'];
    return {
      frames,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: semanticIds.map((id) => scene.fighterActionAnimName({ action: { id, type: id === 'guard' || id === 'dodge' ? 'defense' : 'strike' } }, actor)),
      timings: semanticIds.slice(0, 2).map((id) => scene.combatContactMs({ action: { id, type: 'strike' } }))
    };
  });

  expect(playback.enemyX, 'karate fighter should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'karate source art should face screen-right').toBe(false);
  expect(playback.frameWidth).toBe(96);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual(['reversepunch', 'frontkick', 'guard', 'dodge']);
  expect(playback.timings).toEqual([300, 310]);
  for (const [start, end, label] of [[4, 7, 'advance'], [8, 11, 'reverse punch'], [12, 15, 'front kick'], [16, 19, 'guard'], [20, 23, 'recovery'], [24, 27, 'dodge'], [28, 31, 'hurt']]) {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `${label} row should play; sampled ${playback.frames.join(',')}`).toBe(true);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'karate-motion-desktop.png'), fullPage: true });
  expect(violations, 'karate motion should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E21 taekwondo fighter uses roundhouse, back kick, front kick, landing, dodge, and hurt rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startTaekwondo(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.taekwondo');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.taekwondo', isAnimated: true };
    const frames = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) frames.push(Number(enemy.frame.name));
    }, 24);
    const play = async (name) => {
      scene.playFighterAnim(actor, name, true, false);
      await new Promise((resolve) => setTimeout(resolve, 620));
    };
    for (const name of ['advance', 'roundhouse', 'backkick', 'frontkick', 'recover', 'dodge', 'hurt']) await play(name);
    clearInterval(timer);
    const semanticIds = ['tkd_roundhouse', 'tkd_back_kick', 'frontkick', 'guard', 'dodge'];
    return {
      frames,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: semanticIds.map((id) => scene.fighterActionAnimName({ action: { id, type: ['guard', 'dodge'].includes(id) ? 'defense' : 'kick' } }, actor)),
      timings: semanticIds.slice(0, 3).map((id) => scene.combatContactMs({ action: { id, type: 'kick' } }))
    };
  });

  expect(playback.enemyX, 'taekwondo fighter should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'taekwondo source art should face screen-right').toBe(false);
  expect(playback.frameWidth).toBe(96);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual(['roundhouse', 'backkick', 'frontkick', 'recover', 'dodge']);
  expect(playback.timings).toEqual([330, 360, 310]);
  for (const [start, end, label] of [[4, 7, 'advance'], [8, 11, 'roundhouse'], [12, 15, 'back kick'], [16, 19, 'front kick'], [20, 23, 'landing recovery'], [24, 27, 'dodge'], [28, 31, 'hurt']]) {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `${label} row should play; sampled ${playback.frames.join(',')}`).toBe(true);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'taekwondo-motion-desktop.png'), fullPage: true });
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.taekwondo');
    scene.playFighterAnim({ sprite: enemy, animKey: 'anim.fighter.enemy.taekwondo', isAnimated: true }, 'backkick', true, false);
  });
  await page.waitForFunction(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.taekwondo');
    const frame = Number(enemy?.frame?.name || 0);
    return frame === 14;
  }, null, { timeout: 2500 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'taekwondo-backkick-motion-desktop.png'), fullPage: true });
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.taekwondo');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const startX = Number(enemy?.x || 0);
    const actor = {
      sprite: enemy,
      animKey: 'anim.fighter.enemy.taekwondo',
      isAnimated: true,
      x: startX,
      y: Number(enemy?.y || 0),
      maxAdvance: 280,
      displayWidth: Number(enemy?.displayWidth || 96)
    };
    const target = {
      sprite: player,
      x: Number(player?.x || 0),
      y: Number(player?.y || 0),
      displayWidth: Number(player?.displayWidth || 96)
    };
    window.__taekwondoApproach = { startX, enemy };
    scene.playFighterAnim(actor, 'backkick', true, false);
    scene.animateAttack(actor, target, 0, { contactMs: 360, hitstopMs: 80, shake: 0.2 });
  });
  await page.waitForFunction(() => {
    const state = window.__taekwondoApproach;
    return Number(state?.enemy?.frame?.name || 0) === 14 && Number(state?.enemy?.x || 0) - Number(state?.startX || 0) > 30;
  }, null, { timeout: 2500 });
  await page.evaluate(() => window.__taekwondoApproach?.enemy?.anims?.pause());
  const approach = await page.evaluate(() => ({
    startX: Number(window.__taekwondoApproach?.startX || 0),
    approachX: Number(window.__taekwondoApproach?.enemy?.x || 0)
  }));
  expect(approach.approachX - approach.startX, 'taekwondo back kick should travel toward real contact distance').toBeGreaterThan(30);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'taekwondo-backkick-contact-desktop.png'), fullPage: true });
  expect(violations, 'taekwondo motion should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E09 dirty-mix fighter uses pressure, overhand, low kick, grip, takedown, escape, and hurt rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startDirtyMix(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.dirtymix');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.dirtymix', isAnimated: true };
    const frames = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) frames.push(Number(enemy.frame.name));
    }, 24);
    const play = async (name) => {
      scene.playFighterAnim(actor, name, true, false);
      await new Promise((resolve) => setTimeout(resolve, 620));
    };
    for (const name of ['advance', 'overhand', 'lowkick', 'grip', 'takedown', 'disengage', 'hurt']) await play(name);
    clearInterval(timer);
    const semanticActions = [
      { id: 'straight', type: 'strike' },
      { id: 'lowkick', type: 'kick' },
      { id: 'grip', type: 'grapple' },
      { id: 'takedown', type: 'grapple' },
      { id: 'dirtyescape', type: 'dirty' }
    ];
    return {
      frames,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: semanticActions.map((action) => scene.fighterActionAnimName({ action }, actor)),
      timings: semanticActions.slice(0, 4).map((action) => scene.combatContactMs({ action }))
    };
  });

  expect(playback.enemyX, 'dirty-mix fighter should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'dirty-mix source art should face screen-right').toBe(false);
  expect(playback.frameWidth).toBe(96);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual(['overhand', 'lowkick', 'grip', 'takedown', 'disengage']);
  expect(playback.timings).toEqual([300, 320, 380, 380]);
  for (const [start, end, label] of [[4, 7, 'pressure advance'], [8, 11, 'overhand'], [12, 15, 'low kick'], [16, 19, 'grip'], [20, 23, 'takedown'], [24, 27, 'dirty escape'], [28, 31, 'hurt']]) {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `${label} row should play; sampled ${playback.frames.join(',')}`).toBe(true);
  }

  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.dirtymix');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const startX = Number(enemy?.x || 0);
    const actor = { sprite: enemy, animKey: 'anim.fighter.enemy.dirtymix', isAnimated: true, x: startX, y: Number(enemy?.y || 0), maxAdvance: 260, displayWidth: Number(enemy?.displayWidth || 96) };
    const target = { sprite: player, x: Number(player?.x || 0), y: Number(player?.y || 0), displayWidth: Number(player?.displayWidth || 96) };
    window.__dirtyMixApproach = { startX, enemy };
    scene.playFighterAnim(actor, 'overhand', true, false);
    scene.animateAttack(actor, target, 0, { contactMs: 300, hitstopMs: 80, shake: 0.2 });
  });
  await page.waitForFunction(() => {
    const state = window.__dirtyMixApproach;
    return Number(state?.enemy?.frame?.name || 0) === 10 && Number(state?.enemy?.x || 0) - Number(state?.startX || 0) > 30;
  }, null, { timeout: 2500 });
  await page.evaluate(() => window.__dirtyMixApproach?.enemy?.anims?.pause());
  const approach = await page.evaluate(() => ({ startX: Number(window.__dirtyMixApproach?.startX || 0), approachX: Number(window.__dirtyMixApproach?.enemy?.x || 0) }));
  expect(approach.approachX - approach.startX, 'dirty overhand should travel toward real contact distance').toBeGreaterThan(30);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dirtymix-overhand-contact-desktop.png'), fullPage: true });
  expect(violations, 'dirty-mix motion should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E06 grappler uses authored entry, takedown, sprawl, and escape motion', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE06(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.grappler');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = {
      sprite: enemy,
      animKey: 'anim.fighter.enemy.grappler',
      isAnimated: true,
      x: enemy?.x || 0,
      y: enemy?.y || 0,
      maxAdvance: 260,
      displayWidth: enemy?.displayWidth || 96
    };
    const target = {
      sprite: player,
      x: player?.x || 0,
      y: player?.y || 0,
      displayWidth: player?.displayWidth || 96
    };
    const frames = [];
    const xPositions = [];
    const timer = setInterval(() => {
      if (enemy?.frame?.name !== undefined) {
        frames.push(Number(enemy.frame.name));
        xPositions.push(Number(enemy.x || 0));
      }
    }, 24);
    const play = async (name, wait = 760) => {
      scene.playFighterAnim(actor, name, true);
      await new Promise((resolve) => setTimeout(resolve, wait));
    };
    await play('entry');
    scene.playFighterAnim(actor, 'takedown', true);
    scene.animateAttack(actor, target, 0, { contactMs: 380, hitstopMs: 80, shake: 0 });
    await new Promise((resolve) => setTimeout(resolve, 980));
    await play('sprawl');
    await play('escape');
    clearInterval(timer);
    return {
      frames,
      xPositions,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      enemyFlipX: Boolean(enemy?.flipX),
      playerFlipX: Boolean(player?.flipX),
      contactMs: scene.combatContactMs({ action: { id: 'takedown', type: 'grapple' } }),
      strikeContactMs: scene.combatContactMs({ action: { id: 'jab', type: 'strike' } }),
      semantics: {
        grip: scene.actionAnimName({ action: { id: 'grip', type: 'grapple' } }),
        takedown: scene.actionAnimName({ action: { id: 'takedown', type: 'grapple' } }),
        sprawl: scene.actionAnimName({ action: { id: 'sprawl', type: 'defense' } }),
        escape: scene.actionAnimName({ action: { id: 'escape', type: 'ground' } })
      }
    };
  });

  expect(playback.enemyX, 'E06 should stand on the left').toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'left-side E06 source art should face screen-right').toBe(false);
  expect(playback.playerFlipX, 'right-side player should face screen-left').toBe(true);
  expect(playback.semantics).toEqual({ grip: 'entry', takedown: 'takedown', sprawl: 'sprawl', escape: 'escape' });
  expect(playback.contactMs, 'grappling contact should be slower and readable').toBe(380);
  expect(playback.contactMs).toBeGreaterThan(playback.strikeContactMs);
  expect(playback.frames.some((frame) => frame >= 4 && frame <= 7), `entry frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 12 && frame <= 15), `takedown frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 16 && frame <= 19), `sprawl frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 24 && frame <= 27), `escape frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(Math.max(...playback.xPositions) - Math.min(...playback.xPositions), 'E06 should travel into contact instead of grappling in place').toBeGreaterThan(70);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e06-grappler-motion-desktop.png'), fullPage: true });
  expect(violations, 'E06 grappler motion should not emit warnings/errors').toEqual([]);
});

test('successful E06 takedown drives paired player fall and technical recovery', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE06(page);

  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemySprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.grappler');
    const playerSprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = {
      sprite: enemySprite,
      animKey: 'anim.fighter.enemy.grappler',
      isAnimated: true,
      x: enemySprite?.x || 0,
      y: enemySprite?.y || 0,
      maxAdvance: 260,
      displayWidth: enemySprite?.displayWidth || 96
    };
    const target = {
      sprite: playerSprite,
      animKey: 'anim.fighter.player',
      isAnimated: true,
      x: playerSprite?.x || 0,
      y: playerSprite?.y || 0,
      maxAdvance: 260,
      displayWidth: playerSprite?.displayWidth || 96
    };
    window.__pairedTakedown = { frames: [], x: [], actor, target };
    window.__pairedTakedownTimer = setInterval(() => {
      if (playerSprite?.frame?.name !== undefined) {
        window.__pairedTakedown.frames.push(Number(playerSprite.frame.name));
        window.__pairedTakedown.x.push(Number(playerSprite.x || 0));
      }
    }, 24);
    scene.playCombatStepFx({
      actor: 'enemy',
      action: { id: 'takedown', type: 'grapple' },
      result: { hit: true, takedown: true },
      fx: [{
        type: 'break',
        actor: 'enemy',
        fromSide: 'enemy',
        toSide: 'player',
        skillId: 'takedown',
        label: 'TAKEDOWN',
        hitstopMs: 90,
        shake: 0.3,
        vfxKey: 'vfx.break'
      }]
    }, { enemy: actor, player: target }, 0, false);
  });

  await page.waitForFunction(() => (window.__pairedTakedown?.frames || []).some((frame) => frame >= 28 && frame <= 31), null, { timeout: 3000 });
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e06-paired-takedown-contact.png'), fullPage: true });
  await page.waitForTimeout(820);
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    scene.playFighterAnim(window.__pairedTakedown.target, 'recover', true);
  });
  await page.waitForFunction(() => (window.__pairedTakedown?.frames || []).some((frame) => frame >= 32 && frame <= 35), null, { timeout: 3000 });
  await page.waitForTimeout(360);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e06-player-technical-recovery.png'), fullPage: true });

  const playback = await page.evaluate(() => {
    clearInterval(window.__pairedTakedownTimer);
    const record = window.__pairedTakedown || { frames: [], x: [] };
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    return {
      frames: record.frames,
      x: record.x,
      fallExists: scene.anims.exists('anim.fighter.player.fall'),
      groundedExists: scene.anims.exists('anim.fighter.player.grounded'),
      recoverExists: scene.anims.exists('anim.fighter.player.recover'),
      escapeSemantic: scene.fighterActionAnimName({ action: { id: 'escape', type: 'ground' } }, record.target)
    };
  });

  expect(playback.fallExists).toBe(true);
  expect(playback.groundedExists).toBe(true);
  expect(playback.recoverExists).toBe(true);
  expect(playback.escapeSemantic).toBe('recover');
  expect(playback.frames.some((frame) => frame >= 28 && frame <= 31), `player fall frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 32 && frame <= 35), `player recovery frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(Math.max(...playback.x) - Math.min(...playback.x), 'takedown should move the defender across the ground').toBeGreaterThan(40);
  expect(violations, 'paired takedown presentation should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E07 weapon threat uses readable weapon lines and miss recovery', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE07(page);

  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemySprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.weapon');
    const playerSprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = {
      sprite: enemySprite,
      animKey: 'anim.fighter.enemy.weapon',
      isAnimated: true,
      x: enemySprite?.x || 0,
      y: enemySprite?.y || 0,
      maxAdvance: 280,
      displayWidth: enemySprite?.displayWidth || 128
    };
    const target = {
      sprite: playerSprite,
      animKey: 'anim.fighter.player',
      isAnimated: true,
      x: playerSprite?.x || 0,
      y: playerSprite?.y || 0,
      maxAdvance: 260,
      displayWidth: playerSprite?.displayWidth || 96
    };
    const frames = [];
    const xPositions = [];
    const timer = setInterval(() => {
      if (enemySprite?.frame?.name !== undefined) {
        frames.push(Number(enemySprite.frame.name));
        xPositions.push(Number(enemySprite.x || 0));
      }
    }, 24);
    scene.playFighterAnim(actor, 'threat', true);
    await new Promise((resolve) => setTimeout(resolve, 760));
    const missStep = {
      actor: 'enemy',
      action: { id: 'straight', type: 'strike' },
      result: { hit: false, response: { intent: 'weapon' } },
      fx: [{
        type: 'miss',
        actor: 'enemy',
        fromSide: 'enemy',
        toSide: 'player',
        skillId: 'straight',
        label: 'MISS',
        hitstopMs: 0,
        shake: 0
      }]
    };
    scene.playCombatStepFx(missStep, { enemy: actor, player: target }, 0, false);
    await new Promise((resolve) => setTimeout(resolve, 1180));
    scene.playFighterAnim(actor, 'disengage', true);
    await new Promise((resolve) => setTimeout(resolve, 760));
    clearInterval(timer);
    return {
      frames,
      xPositions,
      enemyX: enemySprite?.x || 0,
      playerX: playerSprite?.x || 0,
      enemyFlipX: Boolean(enemySprite?.flipX),
      frameWidth: enemySprite?.frame?.width || 0,
      frameHeight: enemySprite?.frame?.height || 0,
      contactMs: scene.combatContactMs(missStep, missStep.fx[0]),
      semantics: {
        advance: scene.fighterActionAnimName({ action: { id: 'advance', type: 'footwork' } }, actor),
        strike: scene.fighterActionAnimName(missStep, actor),
        retreat: scene.fighterActionAnimName({ action: { id: 'retreat', type: 'footwork' } }, actor)
      }
    };
  });

  expect(playback.enemyX).toBeLessThan(playback.playerX);
  expect(playback.enemyFlipX, 'left-side E07 should face screen-right').toBe(false);
  expect(playback.frameWidth, 'weapon frames need extra horizontal room').toBe(128);
  expect(playback.frameHeight).toBe(144);
  expect(playback.contactMs, 'weapon contact should remain readable').toBe(340);
  expect(playback.semantics).toEqual({ advance: 'threat', strike: 'smash', retreat: 'disengage' });
  expect(playback.frames.some((frame) => frame >= 4 && frame <= 7), `weapon threat frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 12 && frame <= 15), `weapon strike frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 16 && frame <= 19), `weapon miss recovery frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(playback.frames.some((frame) => frame >= 24 && frame <= 27), `weapon disengage frames should play; sampled ${playback.frames.join(',')}`).toBe(true);
  expect(Math.max(...playback.xPositions) - Math.min(...playback.xPositions), 'weapon attack should travel without swinging in place').toBeGreaterThan(60);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e07-weapon-motion-desktop.png'), fullPage: true });
  expect(violations, 'E07 weapon motion should not emit warnings/errors').toEqual([]);
});

test('E07 weapon strike remains readable at the contact approach frame', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE07(page);
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemySprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.weapon');
    const playerSprite = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = {
      sprite: enemySprite,
      animKey: 'anim.fighter.enemy.weapon',
      isAnimated: true,
      x: enemySprite?.x || 0,
      y: enemySprite?.y || 0,
      maxAdvance: 280,
      displayWidth: enemySprite?.displayWidth || 128
    };
    const target = {
      sprite: playerSprite,
      x: playerSprite?.x || 0,
      y: playerSprite?.y || 0,
      displayWidth: playerSprite?.displayWidth || 96
    };
    window.__weaponStrikeX = [];
    window.__weaponStrikeFrames = [];
    window.__weaponStrikeTimer = setInterval(() => {
      window.__weaponStrikeX.push(Number(enemySprite?.x || 0));
      window.__weaponStrikeFrames.push(Number(enemySprite?.frame?.name || 0));
    }, 20);
    scene.playFighterAnim(actor, 'smash', true);
    scene.animateAttack(actor, target, 0, { contactMs: 340, hitstopMs: 90, shake: 0.25 });
  });
  await page.waitForFunction(() => (window.__weaponStrikeFrames || []).some((frame) => frame >= 12 && frame <= 15), null, { timeout: 2500 });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e07-weapon-strike-contact.png'), fullPage: true });
  const motion = await page.evaluate(() => {
    clearInterval(window.__weaponStrikeTimer);
    return { frames: window.__weaponStrikeFrames || [], x: window.__weaponStrikeX || [] };
  });
  expect(motion.frames.some((frame) => frame >= 12 && frame <= 15)).toBe(true);
  expect(Math.max(...motion.x) - Math.min(...motion.x)).toBeGreaterThan(45);
  expect(violations, 'E07 strike contact frame should not emit warnings/errors').toEqual([]);
});

test('pixel_v2 E18 boss uses distinct boxing, kick, clinch, takedown, sprawl, hurt, and escape rows', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE18(page);
  const playback = await page.evaluate(async () => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.boss');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    const actor = {
      sprite: enemy,
      animKey: 'anim.fighter.enemy.boss',
      isAnimated: true,
      x: enemy?.x || 0,
      y: enemy?.y || 0,
      maxAdvance: 280,
      displayWidth: enemy?.displayWidth || 128
    };
    const target = {
      sprite: player,
      x: player?.x || 0,
      y: player?.y || 0,
      displayWidth: player?.displayWidth || 96
    };
    const frames = [];
    const xPositions = [];
    const timer = setInterval(() => {
      frames.push(Number(enemy?.frame?.name || 0));
      xPositions.push(Number(enemy?.x || 0));
    }, 24);
    const play = async (name, wait = 720) => {
      scene.playFighterAnim(actor, name, true);
      await new Promise((resolve) => setTimeout(resolve, wait));
    };
    await play('advance');
    await play('boxing');
    await play('frontkick');
    await play('clinch');
    scene.playFighterAnim(actor, 'takedown', true);
    scene.animateAttack(actor, target, 0, { contactMs: 380, hitstopMs: 80, shake: 0.2 });
    await new Promise((resolve) => setTimeout(resolve, 960));
    await play('sprawl');
    await play('hurt');
    await play('escape');
    clearInterval(timer);
    const semantic = (id, type) => scene.fighterActionAnimName({ action: { id, type } }, actor);
    return {
      frames,
      xPositions,
      enemyX: enemy?.x || 0,
      playerX: player?.x || 0,
      flipX: Boolean(enemy?.flipX),
      frameWidth: enemy?.frame?.width || 0,
      frameHeight: enemy?.frame?.height || 0,
      semantics: {
        jab: semantic('jab', 'strike'),
        frontkick: semantic('frontkick', 'kick'),
        grip: semantic('grip', 'grapple'),
        takedown: semantic('takedown', 'grapple'),
        sprawl: semantic('sprawl', 'defense'),
        guard: semantic('guard', 'defense'),
        escape: semantic('escape', 'ground')
      },
      frontkickMs: scene.combatContactMs({ action: { id: 'frontkick', type: 'kick' } }),
      takedownMs: scene.combatContactMs({ action: { id: 'takedown', type: 'grapple' } })
    };
  });

  expect(playback.enemyX).toBeLessThan(playback.playerX);
  expect(playback.flipX).toBe(false);
  expect(playback.frameWidth).toBe(128);
  expect(playback.frameHeight).toBe(144);
  expect(playback.semantics).toEqual({
    jab: 'boxing',
    frontkick: 'frontkick',
    grip: 'clinch',
    takedown: 'takedown',
    sprawl: 'sprawl',
    guard: 'guard',
    escape: 'escape'
  });
  expect(playback.frontkickMs).toBe(300);
  expect(playback.takedownMs).toBe(380);
  [[4, 7], [8, 11], [12, 15], [16, 19], [20, 23], [24, 27], [28, 31], [32, 35]].forEach(([start, end]) => {
    expect(playback.frames.some((frame) => frame >= start && frame <= end), `E18 should play frames ${start}-${end}; sampled ${playback.frames.join(',')}`).toBe(true);
  });
  expect(Math.max(...playback.xPositions) - Math.min(...playback.xPositions)).toBeGreaterThan(60);
  expect(violations, 'E18 hybrid motion should not emit warnings/errors').toEqual([]);
});

test('E18 front kick and takedown read as different contact approaches', async ({ page }) => {
  const violations = await loadGame(page, DESKTOP);
  await startE18(page);
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.boss');
    const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
    window.__bossActor = { sprite: enemy, animKey: 'anim.fighter.enemy.boss', isAnimated: true, x: enemy.x, y: enemy.y, maxAdvance: 280, displayWidth: enemy.displayWidth || 128 };
    window.__bossTarget = { sprite: player, x: player.x, y: player.y, displayWidth: player.displayWidth || 96 };
    scene.playFighterAnim(window.__bossActor, 'frontkick', true);
    scene.animateAttack(window.__bossActor, window.__bossTarget, 0, { contactMs: 300, hitstopMs: 70, shake: 0.2 });
  });
  await page.waitForFunction(() => {
    const sprite = window.__bossActor?.sprite;
    return Number(sprite?.frame?.name || 0) >= 12 && Number(sprite?.frame?.name || 0) <= 15;
  }, null, { timeout: 2500 });
  await page.waitForTimeout(220);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e18-frontkick-contact.png'), fullPage: true });
  await page.waitForTimeout(720);
  await page.evaluate(() => {
    const scene = window.MAWS_GAME.scene.getScene('ShellScene');
    scene.playFighterAnim(window.__bossActor, 'takedown', true);
    scene.animateAttack(window.__bossActor, window.__bossTarget, 0, { contactMs: 380, hitstopMs: 80, shake: 0.2 });
  });
  await page.waitForFunction(() => {
    const sprite = window.__bossActor?.sprite;
    return Number(sprite?.frame?.name || 0) >= 20 && Number(sprite?.frame?.name || 0) <= 23;
  }, null, { timeout: 2500 });
  await page.waitForTimeout(160);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'e18-takedown-contact.png'), fullPage: true });
  expect(violations, 'E18 contact screenshots should not emit warnings/errors').toEqual([]);
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
    const sceneShell = await page.evaluate(() => {
      const player = document.querySelector('.maws-scene-character.player');
      const scene = document.querySelector('.maws-scene');
      const hud = document.querySelector('.maws-hud.maws-hud-compact');
      const nav = document.querySelector('.maws-nav');
      const panel = document.querySelector('.maws-action-rail');
      const activeTab = document.querySelector('.maws-nav .maws-tab.active');
      const navIcon = activeTab?.querySelector('.maws-asset-icon');
      const mainAction = document.querySelector('.maws-action-rail-main button.primary');
      const quietShell = document.querySelector('.maws-quiet-shell');
      const drawer = document.querySelector('.maws-command-drawer');
      const visibleCommands = [...document.querySelectorAll('.maws-scene-command-button')]
        .filter((node) => node.getBoundingClientRect().height > 0);
      const before = getComputedStyle(player, '::before');
      const after = getComputedStyle(player, '::after');
      return {
        playerWidth: player.getBoundingClientRect().width,
        contactWidth: Number.parseFloat(before.width),
        contactBackgroundImage: before.backgroundImage,
        afterDisplay: after.display,
        sceneHeight: scene.getBoundingClientRect().height,
        hudBackdrop: getComputedStyle(hud).backdropFilter,
        navBackdrop: getComputedStyle(nav).backdropFilter,
        panelBorderImage: getComputedStyle(panel).borderImageSource,
        tabBorderImage: getComputedStyle(activeTab).borderImageSource,
        tabFont: Number.parseFloat(getComputedStyle(activeTab).fontSize),
        navIconWidth: navIcon?.getBoundingClientRect().width || 0,
        mainActionBorderImage: getComputedStyle(mainAction).borderImageSource,
        mainActionClipPath: getComputedStyle(mainAction).clipPath,
        recommendationCount: document.querySelectorAll('.maws-recommend-card').length,
        quietShell: Boolean(quietShell),
        drawerOpen: Boolean(drawer?.open),
        visibleCommandCount: visibleCommands.length,
        navWidth: nav.getBoundingClientRect().width,
        navHeight: nav.getBoundingClientRect().height
      };
    });
    expect(sceneShell.afterDisplay, 'player must not render a spotlight/backplate pseudo-element').toBe('none');
    expect(sceneShell.contactBackgroundImage, 'player contact shadow should be hard-edged, not a radial gradient').toBe('none');
    expect(sceneShell.contactWidth, 'contact shadow should stay under the feet').toBeLessThan(sceneShell.playerWidth * 0.7);
    expect(sceneShell.hudBackdrop, 'HUD should not use blurred glass').toBe('none');
    expect(sceneShell.navBackdrop, 'navigation should not use blurred glass').toBe('none');
    expect(sceneShell.panelBorderImage, 'action rail should use the bitmap panel frame').toContain('ui_frame_panel.png');
    expect(sceneShell.tabBorderImage, 'active navigation should use the bitmap tab plate').toContain('ui_tab_active.png');
    expect(sceneShell.mainActionBorderImage, 'primary actions should use the bitmap active button').toContain('ui_button_active.png');
    expect(sceneShell.mainActionClipPath, 'buttons should not use vector-like clipped polygons').toBe('none');
    expect(sceneShell.navIconWidth, 'navigation icons should remain larger than their labels').toBeGreaterThanOrEqual(28);
    expect(sceneShell.tabFont, 'navigation labels should stay subordinate to their icons').toBeLessThanOrEqual(10);
    expect(sceneShell.recommendationCount, 'scene shell should show at most two immediate recommendations').toBeLessThanOrEqual(2);
    expect(sceneShell.quietShell, 'map page should use the quiet ledger shell').toBe(true);
    expect(sceneShell.drawerOpen, 'secondary tasks should be closed by default').toBe(false);
    expect(sceneShell.visibleCommandCount, 'only immediate decisions should remain visible').toBeLessThanOrEqual(viewport.name === 'mobile' ? 1 : 2);
    expect(sceneShell.sceneHeight, 'scene should remain the dominant first-look surface').toBeGreaterThan(viewport.height * 0.45);
    if (viewport.name === 'desktop') {
      expect(sceneShell.navHeight, 'desktop navigation should become a compact side ledger').toBeGreaterThan(sceneShell.navWidth * 3);
      const fatherBox = await box(page, '.maws-scene-character:has(img[src*="scene_npc_father_memory.png"])');
      expect(fatherBox.right, 'Day 1 father should stay left of the desktop action rail').toBeLessThanOrEqual(viewport.width - 280);
    } else {
      const mainAction = await box(page, '.maws-action-rail-main .maws-scene-command-button:visible');
      expect(mainAction.height, 'mobile local action should keep a 44px touch target').toBeGreaterThanOrEqual(44);
      const playerBox = await box(page, '.maws-scene-character.player');
      const actionRailBox = await box(page, '.maws-action-rail-main');
      expect(playerBox.height, 'mobile stage should keep the player visible').toBeGreaterThan(120);
      expect(playerBox.bottom, 'mobile player should stay above the decision dock').toBeLessThan(actionRailBox.top + 8);
    }
    await expectScreenshotHasPixels(page, `day1-${viewport.name}.png`, `Day 1 ${viewport.name}`);

    await page.locator('.maws-command-drawer > summary').click();
    await expect(page.locator('.maws-command-drawer-body')).toBeVisible();
    await expect(page.locator('.maws-drawer-section').nth(1)).not.toHaveAttribute('open', '');
    await expectScreenshotHasPixels(page, `day1-task-ledger-${viewport.name}.png`, `Day 1 task ledger ${viewport.name}`);
    await page.locator('.maws-command-drawer > summary').click();

    await page.locator('.maws-scene-character:has(img[src*="scene_npc_fatty.png"])').click();
    await expect(page.locator('.maws-npc-menu')).toBeVisible();
    const npcMenuStyle = await page.locator('.maws-npc-menu').evaluate((node) => ({
      borderImage: getComputedStyle(node).borderImageSource,
      backdrop: getComputedStyle(node).backdropFilter,
      radius: getComputedStyle(node).borderRadius
    }));
    expect(npcMenuStyle.borderImage, 'NPC interaction should use the bitmap panel frame').toContain('ui_frame_panel.png');
    expect(npcMenuStyle.backdrop, 'NPC interaction should not use blurred web glass').toBe('none');
    expect(npcMenuStyle.radius, 'NPC interaction should keep hard pixel corners').toBe('0px');
    await expectScreenshotHasPixels(page, `day1-npc-menu-${viewport.name}.png`, `Day 1 NPC menu ${viewport.name}`);
    await page.locator('button[data-action="closeInteractionMenu"]').click();

    await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'startMainEvent' }));
    await expect(page.locator('.maws-dialogue-portrait-img[src*="portrait_player.png"]')).toBeVisible();
    const dialogueStyle = await page.evaluate(() => {
      const modal = document.querySelector('.maws-modal.dialogue');
      const shell = document.querySelector('.maws-modal.dialogue .maws-modal-shell');
      const line = document.querySelector('.maws-dialogue-box > p');
      const portrait = document.querySelector('.maws-dialogue-portrait-img');
      const advance = document.querySelector('button[data-action="advanceDialogue"]');
      return {
        modalBackdrop: getComputedStyle(modal).backdropFilter,
        shellBackgroundImage: getComputedStyle(shell).backgroundImage,
        shellBorderImage: getComputedStyle(shell).borderImageSource,
        dialogueBorderImage: getComputedStyle(line.closest('.maws-dialogue-box')).borderImageSource,
        shellRadius: getComputedStyle(shell).borderRadius,
        lineFont: Number.parseFloat(getComputedStyle(line).fontSize),
        portraitWidth: portrait.getBoundingClientRect().width,
        actionHeight: advance.getBoundingClientRect().height
      };
    });
    expect(dialogueStyle.modalBackdrop, 'dialogue should not use blurred glass').toBe('none');
    expect(dialogueStyle.shellBackgroundImage, 'dialogue should use a solid pixel panel').toBe('none');
    expect(dialogueStyle.shellBorderImage, 'dialogue shell should use the bitmap dialogue frame').toContain('ui_frame_dialogue.png');
    expect(dialogueStyle.dialogueBorderImage, 'current line should use the bitmap dialogue frame').toContain('ui_frame_dialogue.png');
    expect(dialogueStyle.shellRadius, 'dialogue should use square pixel corners').toBe('0px');
    expect(dialogueStyle.lineFont, 'dialogue should remain readable after reducing oversized type').toBeGreaterThanOrEqual(15);
    expect(dialogueStyle.lineFont, 'dialogue should not dominate the scene with oversized type').toBeLessThanOrEqual(18);
    expect(dialogueStyle.portraitWidth, 'speaker portrait should remain visually present').toBeGreaterThanOrEqual(viewport.name === 'mobile' ? 70 : 90);
    expect(dialogueStyle.actionHeight, 'dialogue advance should keep a 44px hit target').toBeGreaterThanOrEqual(44);
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

  test(`Day 2 metro ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await showDay2Metro(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.metro_station.day'
    ], `Day 2 metro ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `Day 2 metro ${viewport.name}`);
    await expectScreenshotHasPixels(page, `day2-metro-${viewport.name}.png`, `Day 2 metro ${viewport.name}`);
    expect(violations, `Day 2 metro ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`city map ${viewport.name} visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await page.locator('button[data-action="openCityMap"]').first().click();
    await expect(page.locator('.maws-city-overlay')).toBeVisible();
    await expect(page.locator('.maws-city-marker').first()).toBeVisible();
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.city.map.day',
      'backgrounds:bg.city.map.night'
    ], `city map ${viewport.name}`);
    const geometry = await page.evaluate(() => {
      const overlay = document.querySelector('.maws-city-overlay');
      const sheet = document.querySelector('.maws-city-sheet');
      const head = document.querySelector('.maws-city-sheet-head');
      const map = document.querySelector('.maws-city-map');
      const hud = document.querySelector('.maws-hud');
      const mapRect = map.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const headRect = head.getBoundingClientRect();
      const sheetStyle = getComputedStyle(sheet);
      const sheetBorderY = Number.parseFloat(sheetStyle.borderTopWidth) + Number.parseFloat(sheetStyle.borderBottomWidth);
      return {
        aspect: mapRect.width / mapRect.height,
        sheetHeight: sheetRect.height,
        expectedSheetHeight: mapRect.height + headRect.height,
        sheetBorderY,
        overlayZ: Number.parseInt(getComputedStyle(overlay).zIndex, 10),
        hudZ: Number.parseInt(getComputedStyle(hud).zIndex, 10),
        hudVisibility: getComputedStyle(hud).visibility,
        visibleMarkers: Array.from(document.querySelectorAll('.maws-city-marker')).filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length
      };
    });
    expect(geometry.aspect, 'city-map image and marker plane should keep the authored 16:9 geometry').toBeGreaterThan(1.76);
    expect(geometry.aspect, 'city-map image and marker plane should keep the authored 16:9 geometry').toBeLessThan(1.79);
    expect(geometry.sheetHeight, 'city-map sheet should not retain an empty legacy min-height').toBeLessThanOrEqual(geometry.expectedSheetHeight + geometry.sheetBorderY + 8);
    expect(geometry.overlayZ, 'city-map modal should cover the persistent HUD').toBeGreaterThan(geometry.hudZ);
    expect(geometry.hudVisibility, 'city-map modal should suppress the persistent HUD').toBe('hidden');
    expect(geometry.visibleMarkers, 'city map should expose reachable nodes').toBeGreaterThanOrEqual(3);
    if (viewport.name === 'mobile') {
      expect(geometry.visibleMarkers, 'mobile map should hide locked-node clutter').toBeLessThanOrEqual(5);
    }
    const firstMarker = page.locator('.maws-city-marker:not(.locked):not(.disabled)').first();
    await firstMarker.hover();
    const markerTip = firstMarker.locator('.maws-city-marker-tip');
    const markerTipStyle = await markerTip.evaluate((node) => ({
      borderImage: getComputedStyle(node).borderImageSource,
      radius: getComputedStyle(node).borderRadius
    }));
    expect(markerTipStyle.borderImage, 'city marker tooltip should use the bitmap tooltip frame').toContain('ui_frame_tooltip.png');
    expect(markerTipStyle.radius, 'city marker tooltip should use hard pixel corners').toBe('0px');
    await expectNoHorizontalOverflow(page, `city map ${viewport.name}`);
    await expectScreenshotHasPixels(page, `city-map-${viewport.name}.png`, `city map ${viewport.name}`);
    expect(violations, `city map ${viewport.name} console warnings/errors`).toEqual([]);
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
    const commandArt = await page.locator('.maws-skill.combat-card .maws-combat-card-art').first().evaluate((image) => ({
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
      rendering: getComputedStyle(image).imageRendering
    }));
    expect(commandArt.width, 'combat command art should fill the instruction face').toBeGreaterThanOrEqual(50);
    expect(commandArt.height, 'combat command art should remain readable in the compact dock').toBeGreaterThanOrEqual(36);
    expect(commandArt.rendering, 'combat command art should use hard pixel scaling').toMatch(/pixelated|crisp-edges/);
    await expectScreenshotHasPixels(page, `day5-${viewport.name}.png`, `Day 5 ${viewport.name}`);
    expect(violations, `Day 5 ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E05 sparring ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startE05(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.boxing.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.boxer'
    ], `E05 sparring ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E05 sparring ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.boxer');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return { enemyX: enemy?.x || 0, playerX: player?.x || 0, enemyFlipX: Boolean(enemy?.flipX) };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    await expectScreenshotHasPixels(page, `e05-sparring-${viewport.name}.png`, `E05 sparring ${viewport.name}`);
    expect(violations, `E05 sparring ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E19 sanda ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startSanda(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.sanda_gym.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.sanda'
    ], `E19 sanda ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E19 sanda ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.sanda');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return { enemyX: enemy?.x || 0, playerX: player?.x || 0, enemyFlipX: Boolean(enemy?.flipX) };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    await expectScreenshotHasPixels(page, `e19-sanda-${viewport.name}.png`, `E19 sanda ${viewport.name}`);
    expect(violations, `E19 sanda ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E20 karate ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startKarate(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.karate_dojo.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.karate'
    ], `E20 karate ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E20 karate ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.karate');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return { enemyX: enemy?.x || 0, playerX: player?.x || 0, enemyFlipX: Boolean(enemy?.flipX) };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    await expectScreenshotHasPixels(page, `e20-karate-${viewport.name}.png`, `E20 karate ${viewport.name}`);
    expect(violations, `E20 karate ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E21 taekwondo ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startTaekwondo(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.taekwondo_club.day',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.taekwondo'
    ], `E21 taekwondo ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E21 taekwondo ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.taekwondo');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return { enemyX: enemy?.x || 0, playerX: player?.x || 0, enemyFlipX: Boolean(enemy?.flipX) };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    await expectScreenshotHasPixels(page, `e21-taekwondo-${viewport.name}.png`, `E21 taekwondo ${viewport.name}`);
    expect(violations, `E21 taekwondo ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E09 dirty-mix ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startDirtyMix(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.street.night',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.dirtymix'
    ], `E09 dirty-mix ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E09 dirty-mix ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.dirtymix');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return { enemyX: enemy?.x || 0, playerX: player?.x || 0, enemyFlipX: Boolean(enemy?.flipX) };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    await expectScreenshotHasPixels(page, `e09-dirtymix-${viewport.name}.png`, `E09 dirty-mix ${viewport.name}`);
    expect(violations, `E09 dirty-mix ${viewport.name} console warnings/errors`).toEqual([]);
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

  test(`E06 grappler ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startE06(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.mma.night',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.grappler'
    ], `E06 grappler ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E06 grappler ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const sides = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.grappler');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return {
        enemyX: enemy?.x || 0,
        playerX: player?.x || 0,
        enemyFlipX: Boolean(enemy?.flipX),
        enemyFrameWidth: enemy?.frame?.width || 0,
        enemyFrameHeight: enemy?.frame?.height || 0
      };
    });
    expect(sides.enemyX).toBeLessThan(sides.playerX);
    expect(sides.enemyFlipX).toBe(false);
    expect(sides.enemyFrameWidth).toBe(96);
    expect(sides.enemyFrameHeight).toBe(144);
    await expectScreenshotHasPixels(page, `e06-grappler-${viewport.name}.png`, `E06 grappler ${viewport.name}`);
    expect(violations, `E06 grappler ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E07 weapon ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startE07(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.store.rain',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.weapon'
    ], `E07 weapon ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E07 weapon ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const weapon = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.weapon');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return {
        enemyX: enemy?.x || 0,
        playerX: player?.x || 0,
        flipX: Boolean(enemy?.flipX),
        frameWidth: enemy?.frame?.width || 0,
        frameHeight: enemy?.frame?.height || 0
      };
    });
    expect(weapon.enemyX).toBeLessThan(weapon.playerX);
    expect(weapon.flipX).toBe(false);
    expect(weapon.frameWidth).toBe(128);
    expect(weapon.frameHeight).toBe(144);
    await expectScreenshotHasPixels(page, `e07-weapon-${viewport.name}.png`, `E07 weapon ${viewport.name}`);
    expect(violations, `E07 weapon ${viewport.name} console warnings/errors`).toEqual([]);
  });

  test(`E18 boss ${viewport.name} combat visual/runtime contract`, async ({ page }) => {
    const violations = await loadGame(page, viewport);
    await startE18(page);
    await expectManifestImagesDecode(page, [
      'backgrounds:bg.boxing.night',
      'sprites:anim.fighter.player',
      'sprites:anim.fighter.enemy.boss'
    ], `E18 boss ${viewport.name}`);
    await expectNoHorizontalOverflow(page, `E18 boss ${viewport.name}`);
    await expectCombatGeometry(page, viewport);
    const boss = await page.evaluate(() => {
      const scene = window.MAWS_GAME.scene.getScene('ShellScene');
      const enemy = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.enemy.boss');
      const player = scene?.root?.list?.find((item) => item?.texture?.key === 'anim.fighter.player');
      return {
        enemyX: enemy?.x || 0,
        playerX: player?.x || 0,
        flipX: Boolean(enemy?.flipX),
        frameWidth: enemy?.frame?.width || 0,
        frameHeight: enemy?.frame?.height || 0
      };
    });
    expect(boss.enemyX).toBeLessThan(boss.playerX);
    expect(boss.flipX).toBe(false);
    expect(boss.frameWidth).toBe(128);
    expect(boss.frameHeight).toBe(144);
    await expectScreenshotHasPixels(page, `e18-boss-${viewport.name}.png`, `E18 boss ${viewport.name}`);
    expect(violations, `E18 boss ${viewport.name} console warnings/errors`).toEqual([]);
  });
}
