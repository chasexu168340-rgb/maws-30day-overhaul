import { test, expect } from '@playwright/test';

const url = process.env.MAWS_URL || 'http://127.0.0.1:8137/maws_30day_overhaul_v3.html';

test('phaser ui and simulation smoke', async ({ page }) => {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(url);
  await page.waitForFunction(() => window.MAWS_GAME && document.querySelectorAll('canvas').length > 0, null, { timeout: 10000 });
  expect(await page.locator('canvas').count()).toBeGreaterThan(0);
  const result = await page.evaluate(() => {
    const store = window.MAWS_STORE;
    store.dispatch({ type: 'newGame', origin: 'worker' });
    ['profile', 'skills', 'bag', 'shop', 'npc', 'log', 'check', 'map'].forEach((tab) => store.dispatch({ type: 'setTab', tab }));
    store.state.loc = 'worksite';
    store.dispatch({ type: 'doAction', actionId: 'brick_labor' });
    const fitAfterWork = store.state.player.fitXp;
    const settlementTitle = store.state.ui.modal && store.state.ui.modal.title;
    store.dispatch({ type: 'closeModal' });
    store.dispatch({ type: 'startBattle', enemyId: 'E01' });
    store.dispatch({ type: 'selectSkill', skillId: 'jab' });
    store.dispatch({ type: 'confirmBattle' });
    const steps = store.state.combat.steps || [];
    return {
      version: store.state.version,
      fitAfterWork,
      settlementTitle,
      steps: steps.length,
      enemySteps: steps.filter((step) => step.actor === 'enemy').length,
      scrollWidth: document.body.scrollWidth,
      innerWidth: window.innerWidth
    };
  });
  expect(result.version).toBe('4.1-phaser-ui');
  expect(result.fitAfterWork).toBeGreaterThanOrEqual(8);
  expect(result.settlementTitle).toContain('搬砖');
  expect(result.steps).toBeGreaterThanOrEqual(2);
  expect(result.enemySteps).toBeGreaterThanOrEqual(1);
  expect(result.scrollWidth).toBeLessThanOrEqual(result.innerWidth + 1);
  expect(errors).toEqual([]);
  await page.screenshot({ path: `${process.env.TEMP || '.'}/maws_phaser_battle.png`, fullPage: false });
});

test('responsive canvas no horizontal overflow', async ({ page }) => {
  const sizes = [[1365, 768], [900, 700], [390, 844]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.waitForFunction(() => window.MAWS_GAME && document.querySelectorAll('canvas').length > 0, null, { timeout: 10000 });
    await page.evaluate(() => window.MAWS_STORE.dispatch({ type: 'newGame', origin: 'worker' }));
    const metrics = await page.evaluate(() => ({ sw: document.body.scrollWidth, iw: window.innerWidth, canvas: document.querySelectorAll('canvas').length }));
    expect(metrics.canvas).toBeGreaterThan(0);
    expect(metrics.sw).toBeLessThanOrEqual(metrics.iw + 1);
  }
});
