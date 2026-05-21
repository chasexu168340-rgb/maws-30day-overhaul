const STAT_KEYS = Object.freeze(['str', 'end', 'spd', 'rea', 'tec', 'tou', 'bal', 'jud']);
const STYLE_KEYS = Object.freeze(['boxing', 'mma', 'traditional', 'street', 'sanda', 'karate', 'taekwondo']);
const SKILL_STYLE = Object.freeze({
  jab: 'boxing',
  straight: 'boxing',
  guard: 'boxing',
  dodge: 'boxing',
  lowkick: 'mma',
  frontkick: 'mma',
  advance: 'mma',
  retreat: 'street',
  grip: 'mma',
  takedown: 'mma',
  sprawl: 'mma',
  sidecontrol: 'mma',
  escape: 'mma',
  dirtyescape: 'street',
  talkdown: 'street',
  palm: 'traditional',
  offbalance: 'traditional',
  mystic: 'traditional',
  sanda_whip_kick: 'sanda',
  sanda_catch_throw: 'sanda',
  karate_reverse_punch: 'karate',
  karate_front_kick: 'karate',
  tkd_roundhouse: 'taekwondo',
  tkd_back_kick: 'taekwondo'
});

const STAT_LABELS = Object.freeze({
  str: '力量',
  end: '耐力',
  spd: '速度',
  rea: '反应',
  tec: '技巧',
  tou: '抗打',
  bal: '平衡',
  jud: '判断'
});

const STYLE_LABELS = Object.freeze({
  boxing: '拳击实用',
  mma: 'MMA防摔',
  traditional: '传统拆解',
  street: '街头判断',
  sanda: '散打转换',
  karate: '空手道直线',
  taekwondo: '跆拳道腿法'
});

const PLAYER_LINE_RULES = Object.freeze([
  ['现金', 'money', true],
  ['生命', 'hp', true],
  ['体力', 'sp', true],
  ['疲劳', 'fatigue', false],
  ['冷静', 'calm', true],
  ['士气', 'morale', true],
  ['名声', 'fame', true],
  ['真实性', 'auth', true],
  ['热度', 'heat', false],
  ['体能沉淀', 'fitXp', true]
]);

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function clamp(value, min, max) {
  const n = Number.isFinite(Number(value)) ? Number(value) : 0;
  return Math.max(min, Math.min(max, n));
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function playerOf(state) {
  if (!state || typeof state !== 'object') {
    throw new TypeError('applyGain(state, gain) needs a state object or player object.');
  }
  return state.player && typeof state.player === 'object' ? state.player : state;
}

function rootOf(state) {
  return state && state.player ? state : null;
}

function ensureStateShape(state) {
  const root = rootOf(state);
  const player = playerOf(state);
  player.stats = player.stats || {};
  player.injuries = Array.isArray(player.injuries) ? player.injuries : [];
  if (player.fitXp == null) player.fitXp = 0;
  if (root) {
    root.styles = root.styles || {};
    root.relations = root.relations || {};
    root.skillState = root.skillState || {};
    root.unlocked = root.unlocked || {};
    STYLE_KEYS.forEach((key) => {
      if (root.styles[key] == null) root.styles[key] = 0;
    });
  }
  STAT_KEYS.forEach((key) => {
    if (player.stats[key] == null) player.stats[key] = 0;
  });
  return { root, player };
}

function fitBonusFromXp(fitXp = 0) {
  const level = Math.floor(Math.max(0, number(fitXp)) / BALANCE_V2.fitXp.levelSize);
  const bonus = { end: 0, spd: 0, bal: 0 };
  for (let i = 1; i <= level; i += 1) {
    const key = BALANCE_V2.fitXp.bonusCycle[(i - 1) % BALANCE_V2.fitXp.bonusCycle.length];
    bonus[key] += 1;
  }
  return {
    level,
    bonus,
    progress: Math.max(0, number(fitXp)) % BALANCE_V2.fitXp.levelSize,
    next: BALANCE_V2.fitXp.levelSize - (Math.max(0, number(fitXp)) % BALANCE_V2.fitXp.levelSize)
  };
}

function derivedStats(state) {
  const player = playerOf(state);
  const stats = { ...(player.stats || {}) };
  const fit = fitBonusFromXp(player.fitXp || 0).bonus;
  Object.entries(fit).forEach(([key, value]) => {
    stats[key] = number(stats[key]) + value;
  });
  return stats;
}

function fatigueGain(state, value) {
  if (!value || value <= 0) return value;
  const stats = derivedStats(state);
  const reduction = clamp((number(stats.end, 50) - 50) * 0.004, 0, 0.18);
  return Math.max(1, Math.round(value * (1 - reduction)));
}

function recalcVitals(state) {
  const player = playerOf(state);
  if (!player.stats) return;
  const stats = derivedStats(state);
  const extraSpMax = number(player.extraSpMax || player.spMaxBonus || 0);
  player.hpMax = clamp(80 + number(stats.tou) * 0.9 + number(stats.end) * 0.35 + extraSpMax, 70, 180);
  player.spMax = clamp(70 + number(stats.end) * 1.0 + extraSpMax - number(player.fatigue) * 0.25, 60, 190);
  player.postureMax = clamp(45 + number(stats.bal) * 0.75 + number(stats.tec) * 0.25, 50, 150);
  if (player.hp != null) player.hp = clamp(player.hp, 1, player.hpMax);
  if (player.sp != null) player.sp = clamp(player.sp, 0, player.spMax);
  if (player.posture != null) player.posture = clamp(player.posture, 0, player.postureMax);
}

function learnSkill(state, id, xp = 5) {
  if (!id) return;
  const root = rootOf(state);
  if (!root) return;
  root.skillState = root.skillState || {};
  root.unlocked = root.unlocked || {};
  root.styles = root.styles || {};
  const skill = root.skillState[id] || { p: 0, use: 0, retrain: 0, zhus: [] };
  const tech = number(derivedStats(state).tec, 50);
  const multiplier = 1 + number(skill.retrain) * 0.3 + clamp((tech - 50) * 0.003, 0, 0.16);
  skill.p = clamp(number(skill.p) + number(xp, 5) * multiplier, 0, 100);
  root.skillState[id] = skill;
  root.unlocked[id] = 1;
  const style = SKILL_STYLE[id];
  if (style) root.styles[style] = clamp(number(root.styles[style]) + number(xp, 5) * 0.5, 0, 100);
}

export const GYM_FITNESS_PATCH = deepFreeze({
  gym_basic: {
    cost: 25,
    sp: 20,
    time: 70,
    gain: { str: 1, end: 1, bal: 1, fitXp: 6, fatigue: 12 }
  },
  treadmill: {
    cost: 15,
    sp: 16,
    time: 50,
    gain: { end: 1, spd: 1, fitXp: 5, fatigue: 10 }
  },
  core_balance: {
    cost: 15,
    sp: 12,
    time: 45,
    gain: { bal: 1, tou: 1, fitXp: 3, fatigue: 8 }
  },
  mobility: {
    cost: 10,
    sp: 0,
    time: 35,
    gain: { fatigue: -10, calm: 4, fitXp: 1 }
  }
});

export const WORKSITE_ACTIONS = deepFreeze([
  {
    id: 'worksite_day_labor',
    name: '工地临工',
    icon: '🧱',
    time: 110,
    sp: 26,
    desc: '日结体力活，钱来得快，疲劳也实打实。适合缺现金时顶一班。',
    type: 'simple',
    gain: { money: 150, str: 1, end: 1, fitXp: 5, fatigue: 22 }
  },
  {
    id: 'worksite_material_carry',
    name: '装卸材料',
    icon: '📦',
    time: 90,
    sp: 24,
    desc: '搬砂浆、水泥和板材，力量成长明显，但第二天容易沉。',
    type: 'simple',
    gain: { money: 105, str: 1, fitXp: 4, fatigue: 18 }
  },
  {
    id: 'worksite_cleanup',
    name: '收工清场',
    icon: '🧹',
    time: 65,
    sp: 14,
    desc: '清杂物、走楼梯、来回搬小件，收益温和，身体活动量稳定。',
    type: 'simple',
    gain: { money: 65, end: 1, fitXp: 2, fatigue: 9 }
  }
]);

export const BALANCE_V2 = deepFreeze({
  version: 'balance-v2-economy-fitness-events',
  fitXp: {
    name: '体能沉淀',
    levelSize: 20,
    bonusCycle: ['spd', 'end', 'bal'],
    desc: '长期体能积累，每20点形成1级派生加成，按速度、耐力、平衡循环提升。'
  },
  items: {
    rice: 22,
    drink: 16,
    band: 45,
    gloves: 220,
    wrap: 110,
    shoes: 260,
    mouth: 160,
    shirt: 210,
    rope: 130,
    notebook: 90,
    tripod: 140,
    powder: 96,
    bracelet: 240,
    ebook: 70
  },
  rewards: {
    E01: { money: 60, fame: 20 },
    E02: { money: 45, fame: 24 },
    E03: { money: 65, fame: 38 },
    E04: { money: 90, fame: 42 },
    E05: { money: 105, fame: 48 },
    E06: { money: 120, fame: 62 },
    E07: { money: 35, fame: 72 },
    E08: { money: 185, fame: 98 },
    E09: { money: 260, fame: 125 },
    E18: { money: 360, fame: 240 }
  },
  actions: {
    cashier: { time: 120, sp: 18, gain: { money: 125, fatigue: 10, rel_xiaoman: 1 } },
    carry: { time: 80, sp: 24, gain: { money: 70, str: 1, end: 1, fitXp: 3, fatigue: 14 } },
    poster: { time: 55, sp: 8, gain: { fame: 14, rel_coach: 1, money: 20 } },
    review: { time: 45, sp: 0, gain: { jud: 1, calm: 4, skill: 'jab', xp: 4 } },
    online: { time: 35, sp: 3, gain: { auth: 2, heat: 1 } },
    bag: { cost: 18, sp: 22, time: 75 },
    coach_drill: { cost: 35, sp: 18, time: 80 },
    heavybag: { cost: 22, sp: 26, time: 70, gain: { skill: 'straight', xp: 9, str: 1, fatigue: 16 } },
    sprawl_drill: { cost: 28, sp: 20, time: 70 },
    ground_escape: { cost: 34, sp: 24, time: 80 },
    clinch_lab: { cost: 35, sp: 22, time: 80 },
    pressure_test: { cost: 24, sp: 20, time: 80 },
    push_train: { cost: 18, sp: 19, time: 70 },
    ...GYM_FITNESS_PATCH,
    massage: { cost: 75 },
    ice: { cost: 28 },
    breath: { cost: 12 },
    night_work: { time: 100, sp: 22, gain: { money: 155, fatigue: 24, heat: 1 } },
    investigate: { time: 70, sp: 10, gain: { auth: 4, heat: 2, fame: 10 } },
    ...Object.fromEntries(WORKSITE_ACTIONS.map((action) => [action.id, action]))
  },
  travel: {
    walk: { time: [18, 32, 48], money: [0, 0, 0], sp: [4, 7, 10], fitXp: [2, 3, 5], fatigue: [0, 0, 1] },
    run: { time: [12, 21, 32], money: [0, 0, 0], sp: [10, 14, 18], fitXp: [5, 7, 9], fatigue: [1, 2, 3] },
    bike: { time: [10, 18, 28], money: [4, 6, 8], sp: [4, 6, 8], fitXp: [2, 3, 4], fatigue: [0, 1, 1] },
    bus: { time: [14, 24, 34], money: [6, 8, 10], sp: [1, 1, 2], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
    metro: { time: [16, 18, 24], money: [8, 10, 14], sp: [1, 1, 1], fitXp: [0, 0, 0], fatigue: [0, 0, 0] },
    taxi: { time: [8, 12, 18], money: [22, 32, 45], sp: [0, 0, 0], fitXp: [0, 0, 0], fatigue: [0, 0, 0] }
  }
});

export function applyGain(state, gain = {}) {
  const { root, player } = ensureStateShape(state);
  if (!gain || typeof gain !== 'object') return state;

  if (gain.money) player.money = number(player.money) + number(gain.money);
  if (gain.fame) player.fame = number(player.fame) + number(gain.fame);
  if (gain.face) player.face = number(player.face) + number(gain.face);
  if (gain.auth) player.auth = clamp(number(player.auth) + number(gain.auth), 0, 100);
  if (gain.heat) player.heat = number(player.heat) + number(gain.heat);
  if (gain.fitXp) player.fitXp = Math.max(0, number(player.fitXp) + number(gain.fitXp));
  if (gain.fatigue) player.fatigue = clamp(number(player.fatigue) + fatigueGain(state, number(gain.fatigue)), 0, 100);
  if (gain.hp) player.hp = clamp(number(player.hp) + number(gain.hp), 1, number(player.hpMax, 110));
  if (gain.sp) player.sp = clamp(number(player.sp) + number(gain.sp), 0, number(player.spMax, 100));
  if (gain.morale) player.morale = clamp(number(player.morale) + number(gain.morale), 0, 100);
  if (gain.calm) player.calm = clamp(number(player.calm) + number(gain.calm), 0, 100);

  STAT_KEYS.forEach((key) => {
    if (gain[key]) player.stats[key] = number(player.stats[key]) + number(gain[key]);
  });

  if (root) {
    STYLE_KEYS.forEach((key) => {
      if (gain[key]) root.styles[key] = clamp(number(root.styles[key]) + number(gain[key]), 0, 100);
    });

    Object.entries(gain).forEach(([key, value]) => {
      if (!key.startsWith('rel_')) return;
      const relationId = key.slice(4);
      root.relations[relationId] = number(root.relations[relationId]) + number(value);
    });

    if (gain.skill) learnSkill(state, gain.skill, gain.xp || 5);
    if (gain.skill2) learnSkill(state, gain.skill2, gain.xp2 || 4);
  }

  if (gain.injury) {
    player.injuries.forEach((injury) => {
      injury.turn = Math.max(0, number(injury.turn) + number(gain.injury));
    });
    player.injuries = player.injuries.filter((injury) => number(injury.turn) > 0);
  }

  recalcVitals(state);
  return state;
}

function unwrapSnapshot(input) {
  if (!input || typeof input !== 'object') return { player: {}, styles: {}, relations: {} };
  if (input.player) {
    return {
      player: input.player || {},
      styles: input.styles || {},
      relations: input.relations || {}
    };
  }
  return { player: input, styles: {}, relations: {} };
}

function deltaLine(label, key, beforeValue, afterValue, goodHigh = true, group = 'player') {
  const delta = Math.round(number(afterValue) - number(beforeValue));
  if (!delta) return null;
  const good = goodHigh ? delta > 0 : delta < 0;
  return {
    group,
    key,
    label,
    delta,
    tone: good ? 'good' : 'bad',
    text: `${label} ${delta > 0 ? '+' : ''}${delta}`
  };
}

export function settlementLines(before, after) {
  const b = unwrapSnapshot(before);
  const a = unwrapSnapshot(after);
  const lines = [];

  PLAYER_LINE_RULES.forEach(([label, key, goodHigh]) => {
    const line = deltaLine(label, key, b.player[key], a.player[key], goodHigh, 'player');
    if (line) lines.push(line);
  });

  STAT_KEYS.forEach((key) => {
    const line = deltaLine(STAT_LABELS[key], key, b.player.stats?.[key], a.player.stats?.[key], true, 'stats');
    if (line) lines.push(line);
  });

  STYLE_KEYS.forEach((key) => {
    const line = deltaLine(STYLE_LABELS[key], key, b.styles?.[key], a.styles?.[key], true, 'styles');
    if (line) lines.push(line);
  });

  const relationKeys = new Set([...Object.keys(b.relations || {}), ...Object.keys(a.relations || {})]);
  relationKeys.forEach((key) => {
    const line = deltaLine(`${key}关系`, key, b.relations?.[key], a.relations?.[key], true, 'relations');
    if (line) lines.push(line);
  });

  return lines;
}
