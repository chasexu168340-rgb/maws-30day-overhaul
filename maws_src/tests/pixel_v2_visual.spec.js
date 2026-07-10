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
  'skillCards:skill.wild_swing',
  'skillCards:skill.push_away',
  'skillCards:skill.mystic',
  'skillCards:skill.guard',
  'skillCards:skill.retreat',
  'skillCards:skill.talkdown',
  'skillCards:skill.jab',
  'skillCards:skill.straight',
  'skillCards:skill.dodge'
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
  await expect(page.locator('.maws-combat-read')).toContainText('防守读法');
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
      { id: 'bag', selector: '.maws-bag-ledger', label: '装备架与背包' },
      { id: 'shop', selector: '.maws-shop-board', label: '今天买什么' },
      { id: 'log', selector: '.maws-logbook', label: '行动与记忆' }
    ];

    for (const tab of tabs) {
      await page.locator(`button[data-action="setTab"][data-tab="${tab.id}"]`).click();
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
    const sceneShell = await page.evaluate(() => {
      const player = document.querySelector('.maws-scene-character.player');
      const scene = document.querySelector('.maws-scene');
      const hud = document.querySelector('.maws-hud.maws-hud-compact');
      const nav = document.querySelector('.maws-nav');
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
        recommendationCount: document.querySelectorAll('.maws-recommend-card').length
      };
    });
    expect(sceneShell.afterDisplay, 'player must not render a spotlight/backplate pseudo-element').toBe('none');
    expect(sceneShell.contactBackgroundImage, 'player contact shadow should be hard-edged, not a radial gradient').toBe('none');
    expect(sceneShell.contactWidth, 'contact shadow should stay under the feet').toBeLessThan(sceneShell.playerWidth * 0.7);
    expect(sceneShell.hudBackdrop, 'HUD should not use blurred glass').toBe('none');
    expect(sceneShell.navBackdrop, 'navigation should not use blurred glass').toBe('none');
    expect(sceneShell.recommendationCount, 'scene shell should show at most two immediate recommendations').toBeLessThanOrEqual(2);
    expect(sceneShell.sceneHeight, 'scene should remain the dominant first-look surface').toBeGreaterThan(viewport.height * 0.45);
    if (viewport.name === 'desktop') {
      const fatherBox = await box(page, '.maws-scene-character:has(img[src*="scene_npc_father_memory.png"])');
      expect(fatherBox.right, 'Day 1 father should stay left of the desktop action rail').toBeLessThanOrEqual(viewport.width - 280);
    } else {
      const mainAction = await box(page, '.maws-action-rail-main .maws-actions-primary button[data-action="doAction"]');
      expect(mainAction.height, 'mobile local action should keep a 44px touch target').toBeGreaterThanOrEqual(44);
    }
    await expectScreenshotHasPixels(page, `day1-${viewport.name}.png`, `Day 1 ${viewport.name}`);

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
        shellRadius: getComputedStyle(shell).borderRadius,
        lineFont: Number.parseFloat(getComputedStyle(line).fontSize),
        portraitWidth: portrait.getBoundingClientRect().width,
        actionHeight: advance.getBoundingClientRect().height
      };
    });
    expect(dialogueStyle.modalBackdrop, 'dialogue should not use blurred glass').toBe('none');
    expect(dialogueStyle.shellBackgroundImage, 'dialogue should use a solid pixel panel').toBe('none');
    expect(dialogueStyle.shellRadius, 'dialogue should use square pixel corners').toBe('0px');
    expect(dialogueStyle.lineFont, 'current dialogue line should be immediately readable').toBeGreaterThanOrEqual(18);
    expect(dialogueStyle.portraitWidth, 'speaker portrait should remain visually present').toBeGreaterThanOrEqual(76);
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
      return {
        aspect: mapRect.width / mapRect.height,
        sheetHeight: sheetRect.height,
        expectedSheetHeight: mapRect.height + headRect.height,
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
    expect(geometry.sheetHeight, 'city-map sheet should not retain an empty legacy min-height').toBeLessThanOrEqual(geometry.expectedSheetHeight + 8);
    expect(geometry.overlayZ, 'city-map modal should cover the persistent HUD').toBeGreaterThan(geometry.hudZ);
    expect(geometry.hudVisibility, 'city-map modal should suppress the persistent HUD').toBe('hidden');
    expect(geometry.visibleMarkers, 'city map should expose reachable nodes').toBeGreaterThanOrEqual(3);
    if (viewport.name === 'mobile') {
      expect(geometry.visibleMarkers, 'mobile map should hide locked-node clutter').toBeLessThanOrEqual(5);
    }
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
