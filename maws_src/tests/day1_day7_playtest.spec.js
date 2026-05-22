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
      equipped: state.equipSkills.slice(0, 4)
    };
  });
  expect(dayOne).toMatchObject({
    day: 1,
    loc: 'home'
  });
  expect(dayOne.starterSkills).toEqual(['guard', 'mystic', 'retreat', 'talkdown']);
  expect(dayOne.equipped).toEqual(['mystic', 'guard', 'retreat', 'talkdown']);
  await expect(page.locator('.maws-task-card.main').filter({ hasText: /父亲/ })).toBeVisible();

  await page.locator('button[data-action="openCityMap"]').first().click();
  await expect(page.locator('button.maws-city-marker[data-loc="metro_station"]:not(.locked)')).toBeVisible();
  await page.locator('button.maws-city-marker[data-loc="metro_station"]').click();
  await expect(page.locator('button[data-action="travel"][data-loc="metro_station"]').first()).toBeVisible();
  await page.locator('button[data-action="travel"][data-loc="metro_station"]').first().click();
  await page.locator('button[data-action="closeModal"]').click();
  expect(await page.evaluate(() => window.MAWS_STORE.state.loc)).toBe('metro_station');
  await expect(page.locator('button[data-action="doAction"][data-id^="metro_"]').first()).toBeVisible();
  await expectNoHorizontalOverflow(page, 'metro entry');

  await page.locator('button[data-action="setTab"][data-tab="skills"]').click();
  await expect(page.locator('.maws-skill-unlock').first()).toBeVisible();
  expect(await page.locator('.maws-skill-unlock.initial').count()).toBeGreaterThan(0);
  expect(await page.locator('.maws-skill-unlock.planned').count()).toBeGreaterThan(0);
  expect(await page.locator('.maws-skill-unlock.locked').count()).toBeGreaterThan(0);
  await expect(page.locator('.maws-skill-unlock').filter({ hasText: /来源/ }).first()).toBeVisible();

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
  await page.locator('button[data-action="startMainEvent"]').first().click();
  await expect(page.locator('.maws-combat-ui')).toBeVisible();
  const dayFiveCombat = await page.evaluate(() => ({
    day: window.MAWS_STORE.state.day,
    enemyId: window.MAWS_STORE.state.combat?.enemyId,
    main: Boolean(window.MAWS_STORE.state.combat?.main),
    objectiveSet: window.MAWS_STORE.state.combat?.objectiveSet || ''
  }));
  expect(dayFiveCombat).toEqual({
    day: 5,
    enemyId: 'E01',
    main: true,
    objectiveSet: 'park_check'
  });

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
  await expect(page.locator('.maws-skill-unlock').first()).toBeVisible();
  await expectNoHorizontalOverflow(page, 'mobile skills');

  expect(errors).toEqual([]);
});
