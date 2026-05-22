import { GameStore, buildRenderModel } from '../simulation/state.js';

const ORIGINS = ['worker', 'fan', 'student'];
const ROUTE = ['guard', 'retreat'];

function createRng(seedText) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    return ((seed ^= seed >>> 16) >>> 0) / 4294967296;
  };
}

function withSeededRandom(seedText, fn) {
  const originalRandom = Math.random;
  Math.random = createRng(seedText);
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

function round(value) {
  return Math.round(Number(value || 0));
}

function vitals(player = {}) {
  return {
    hp: `${round(player.hp)}/${round(player.hpMax)}`,
    sp: `${round(player.sp)}/${round(player.spMax)}`,
    posture: `${round(player.posture)}/${round(player.postureMax)}`
  };
}

function objectiveSummary(model, modal) {
  const lines = model.combat?.objectiveList || modal?.objectiveLines || [];
  const completed = lines.filter((item) => item.done).length;
  return {
    completed,
    total: lines.length,
    lines: lines.map((item) => ({
      id: item.id || item.label,
      label: item.label,
      done: Boolean(item.done)
    }))
  };
}

function prepareDay5Park(store, origin) {
  store.dispatch({ type: 'newGame', origin });
  store.state.day = 5;
  store.state.time = 480;
  store.state.loc = 'park';
  store.state.daily.mainDone = false;
  delete store.state.flags.main_5;
}

function runOrigin(origin) {
  return withSeededRandom(`day5-park-check:${origin}`, () => {
    const store = new GameStore();
    prepareDay5Park(store, origin);
    store.dispatch({ type: 'startMainEvent' });

    if (!store.state.combat) {
      return {
        origin,
        windowCount: 0,
        vitals: vitals(store.state.player),
        objective: objectiveSummary(buildRenderModel(store.state), store.state.ui.modal),
        result: 'blocked',
        reason: store.state.ui.toast || store.state.ui.modal?.type || 'combat_not_started'
      };
    }

    for (const skillId of ROUTE) store.dispatch({ type: 'selectSkill', skillId });
    store.dispatch({ type: 'confirmBattle' });

    const model = buildRenderModel(store.state);
    const modal = store.state.ui.modal;
    const objective = objectiveSummary(model, modal);
    const finished = !store.state.combat;
    const result = finished
      ? (modal?.win ? 'pass' : 'review')
      : 'in_progress';
    const reason = modal?.reason || store.state.combat?.finishReason || (finished ? 'finished' : 'window_complete');

    return {
      origin,
      windowCount: store.state.combat?.windowCount || 1,
      vitals: vitals(store.state.player),
      objective,
      result,
      reason
    };
  });
}

const results = ORIGINS.map(runOrigin);

for (const item of results) {
  const done = item.objective.lines
    .filter((line) => line.done)
    .map((line) => line.label || line.id)
    .join('、') || 'none';
  console.log([
    `origin=${item.origin}`,
    `windowCount=${item.windowCount}`,
    `hp=${item.vitals.hp}`,
    `sp=${item.vitals.sp}`,
    `posture=${item.vitals.posture}`,
    `objective=${item.objective.completed}/${item.objective.total}`,
    `done=${done}`,
    `result=${item.result}`,
    `reason=${item.reason}`
  ].join(' | '));
}

if (results.some((item) => item.result === 'blocked' || item.objective.total === 0)) {
  process.exitCode = 1;
}
