import {
  ACTIONS,
  DOW,
  ENEMIES,
  GAME_VERSION,
  ITEMS,
  LOC_POS,
  LOCS,
  MAIN_EVENTS,
  NPCS,
  ORIGINS,
  RESOURCE_RULES,
  SAVE_KEY,
  SKILLS,
  STAT_KEYS,
  STAT_RULES,
  STYLE_RULES,
  TABS,
  TRAVEL_TUNING
} from '../content/data.js';
import { applyGain, settlementLines } from './economy.js';
import { buildOpportunities } from './events.js';
import { previewPlayerAction, resolveCombatExchange } from './combat.js';

export const clone = (value) => JSON.parse(JSON.stringify(value));
export const clamp = (value, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));

const EQUIPMENT_SLOTS = [
  { id: 'hand', name: '手部', empty: '拳套/缠手' },
  { id: 'foot', name: '脚部', empty: '鞋/护踝' },
  { id: 'body', name: '身体', empty: '护具/训练服' },
  { id: 'head', name: '头部', empty: '护齿/头部保护' },
  { id: 'accessory', name: '辅助', empty: '笔记/工具' }
];

const TRAINING_GRADES = {
  poor: { label: '勉强完成', multiplier: 0.7, note: '动作散了，收益打折，疲劳照收。' },
  solid: { label: '稳定完成', multiplier: 1, note: '节奏稳住了，按计划结算。' },
  sharp: { label: '超额完成', multiplier: 1.2, note: '关键细节抓住了，收益上浮。' }
};

export function fmtTime(totalMinutes) {
  const m = Math.floor(totalMinutes % 1440);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function phaseText(time) {
  if (time < 360) return '深夜';
  if (time < 720) return '上午';
  if (time < 1020) return '下午';
  if (time < 1320) return '夜晚';
  return '深夜';
}

export function dayStage(day) {
  if (day <= 7) return '幻想期';
  if (day <= 14) return '验货期';
  if (day <= 21) return '改造期';
  if (day <= 27) return '实战压力期';
  return '最终测试期';
}

export function fitBonus(player) {
  const fitXp = Math.max(0, Number(player?.fitXp || 0));
  const level = Math.floor(fitXp / 20);
  const bonus = { end: 0, spd: 0, bal: 0 };
  for (let i = 1; i <= level; i += 1) {
    bonus[['spd', 'end', 'bal'][(i - 1) % 3]] += 1;
  }
  return { level, progress: fitXp % 20, next: 20 - (fitXp % 20), bonus };
}

export function derivedStats(state) {
  const st = { ...(state.player?.stats || {}) };
  const bonus = fitBonus(state.player).bonus;
  Object.entries(bonus).forEach(([key, value]) => {
    st[key] = (st[key] || 0) + value;
  });
  Object.values(state.equipment || {}).forEach((id) => {
    const item = ITEMS[id];
    if (!item?.eff) return;
    Object.entries(item.eff).forEach(([key, value]) => {
      if (st[key] != null) st[key] += value;
    });
  });
  return st;
}

export function recalcVitals(state) {
  const st = derivedStats(state);
  const p = state.player;
  p.hpMax = clamp(80 + (st.tou || 0) * 0.9 + (st.end || 0) * 0.35, 70, 180);
  p.spMax = clamp(70 + (st.end || 0) - (p.fatigue || 0) * 0.25, 60, 190);
  p.postureMax = clamp(45 + (st.bal || 0) * 0.75 + (st.tec || 0) * 0.25, 50, 150);
  p.hp = clamp(p.hp ?? p.hpMax, 1, p.hpMax);
  p.sp = clamp(p.sp ?? p.spMax, 0, p.spMax);
  p.posture = clamp(p.posture ?? p.postureMax, 0, p.postureMax);
}

export function createNewState(origin = 'worker') {
  const o = ORIGINS[origin] || ORIGINS.worker;
  const state = {
    version: GAME_VERSION,
    origin,
    day: 1,
    time: 420,
    loc: 'home',
    seed: 123456,
    flags: {},
    daily: { talked: {}, actions: 0, mainDone: false, sideSeed: 1 },
    ui: { tab: 'map', toast: '第1天，先把能打中人的东西练出来。', modal: null, selectedTravel: null, cityMapOpen: false },
    player: {
      name: '陆小闲',
      stats: { ...o.stats },
      hp: 110,
      sp: 100,
      posture: 80,
      hpMax: 110,
      spMax: 100,
      postureMax: 80,
      morale: origin === 'fan' ? 78 : 64,
      calm: 58,
      fatigue: 10,
      fitXp: 0,
      money: o.money,
      fame: 0,
      face: 45,
      auth: 58,
      heat: 0,
      injuries: [],
      trait: o.trait
    },
    styles: { boxing: 0, mma: 0, traditional: 0, street: 0 },
    relations: { fatty: 5, coach: 0, master: 0, xiaoman: 0, chen: 0 },
    inventory: { rice: 1, drink: 1 },
    equipment: { hand: null, foot: null, body: null, head: null, accessory: null },
    ownedZhus: [],
    log: [],
    eventLog: [],
    combatMemory: { fights: 0, wins: 0, losses: 0, riskWins: 0, lastEnemy: null, lastResult: null, lastTags: [], enemyNotes: {}, styleWins: {}, recent: [] },
    unlocked: { jab: 1, straight: 1, guard: 1, dodge: 1, advance: 1, retreat: 1, dirtyescape: 1, talkdown: 1, mystic: 1 },
    equipSkills: ['jab', 'straight', 'guard', 'dodge', 'advance', 'retreat'],
    skillState: {}
  };
  Object.keys(SKILLS).forEach((id) => {
    if (state.unlocked[id]) state.skillState[id] = { p: id === 'mystic' ? 5 : 18, use: 0, retrain: 0, zhus: [] };
  });
  recalcVitals(state);
  addLog(state, '第1天，你决定用30天搞清楚：什么是能用的武术。');
  return state;
}

export function migrateSave(input) {
  if (!input || typeof input !== 'object') return null;
  const s = clone(input);
  s.version = GAME_VERSION;
  s.flags ||= {};
  s.daily ||= { talked: {}, actions: 0, mainDone: false, sideSeed: s.day || 1 };
  s.daily.talked ||= {};
  s.ui ||= { tab: s.tab || 'map', toast: null, modal: null, selectedTravel: null, cityMapOpen: false };
  s.ui.cityMapOpen = Boolean(s.ui.cityMapOpen);
  s.player ||= {};
  s.player.fitXp ||= 0;
  s.player.face ||= 45;
  s.player.injuries = Array.isArray(s.player.injuries) ? s.player.injuries : [];
  s.player.stats ||= clone(ORIGINS.worker.stats);
  STAT_KEYS.forEach((key) => { if (s.player.stats[key] == null) s.player.stats[key] = ORIGINS.worker.stats[key]; });
  s.styles = { boxing: 0, mma: 0, traditional: 0, street: 0, ...(s.styles || {}) };
  s.relations = { fatty: 0, coach: 0, master: 0, xiaoman: 0, chen: 0, ...(s.relations || {}) };
  s.inventory ||= {};
  s.equipment = { hand: null, foot: null, body: null, head: null, accessory: null, ...(s.equipment || {}) };
  s.ownedZhus ||= [];
  s.log ||= [];
  s.eventLog ||= [];
  s.unlocked ||= {};
  s.equipSkills ||= ['jab', 'straight', 'guard', 'dodge', 'advance', 'retreat'];
  while (s.equipSkills.length < 6) s.equipSkills.push(null);
  s.skillState ||= {};
  Object.keys(s.unlocked).forEach((id) => {
    if (s.unlocked[id] && !s.skillState[id]) s.skillState[id] = { p: 10, use: 0, retrain: 0, zhus: [] };
  });
  s.combatMemory = {
    fights: 0, wins: 0, losses: 0, riskWins: 0, lastEnemy: null, lastResult: null, lastTags: [], enemyNotes: {}, styleWins: {}, recent: [],
    ...(s.combatMemory || {})
  };
  s.combatMemory.enemyNotes ||= {};
  s.combatMemory.styleWins ||= {};
  s.combatMemory.recent ||= [];
  recalcVitals(s);
  return s;
}

export function addLog(state, text) {
  state.log ||= [];
  state.log.unshift({ day: state.day, time: state.time, text });
  state.log = state.log.slice(0, 100);
}

export function snapshotState(state) {
  return clone({ player: state.player, styles: state.styles, relations: state.relations });
}

function findAction(state, actionId) {
  return (ACTIONS[state.loc] || []).find((a) => a.id === actionId) || null;
}

function actionSpCost(action) {
  return action.type === 'battle' ? Math.min(action.sp || 0, 6) : (action.sp || 0);
}

function gainParts(gain = {}) {
  const parts = [];
  const labels = {
    money: '现金',
    fame: '名声',
    auth: '真实性',
    heat: '热度',
    fitXp: '体能沉淀',
    fatigue: '疲劳',
    hp: '生命',
    sp: '体力',
    morale: '士气',
    calm: '冷静',
    str: '力量',
    end: '耐力',
    spd: '速度',
    rea: '反应',
    tec: '技巧',
    tou: '抗打',
    bal: '平衡',
    jud: '判断',
    boxing: '拳击实用',
    mma: 'MMA防摔',
    traditional: '传统拆解',
    street: '街头判断'
  };
  Object.entries(gain || {}).forEach(([key, value]) => {
    if (key === 'skill' || key === 'skill2' || key === 'xp' || key === 'xp2') return;
    if (key.startsWith('rel_')) {
      parts.push(`${key.slice(4)}关系 ${Number(value) > 0 ? '+' : ''}${value}`);
      return;
    }
    if (labels[key]) parts.push(`${labels[key]} ${Number(value) > 0 ? '+' : ''}${value}`);
  });
  if (gain.skill) parts.push(`${SKILLS[gain.skill]?.name || gain.skill}熟练 +${gain.xp || 5}`);
  if (gain.skill2) parts.push(`${SKILLS[gain.skill2]?.name || gain.skill2}熟练 +${gain.xp2 || 4}`);
  return parts;
}

function actionSummary(action) {
  if (!action) return { cost: [], gain: [], risk: '' };
  const cost = [];
  if (action.time) cost.push(`${action.time}分钟`);
  if (actionSpCost(action)) cost.push(`体力-${actionSpCost(action)}`);
  if (action.cost) cost.push(`￥${action.cost}`);
  const gain = action.type === 'battle'
    ? [`对手：${ENEMIES[action.enemy]?.name || action.enemy}`, `胜利奖励：￥${ENEMIES[action.enemy]?.reward?.money || 0} / 名声+${ENEMIES[action.enemy]?.reward?.fame || 0}`]
    : gainParts(action.gain);
  const risk = action.type === 'battle'
    ? `战斗风险 ${action.risk || ENEMIES[action.enemy]?.risk || '中'}`
    : action.risk ? `事件风险 ${action.risk}` : '';
  return { cost, gain, risk };
}

function effectSummary(eff = {}) {
  const labels = {
    strikeDmg: '拳类伤害',
    kickDmg: '踢击伤害',
    dodge: '闪避',
    headRes: '头部保护',
    risk: '风险',
    auth: '真实性',
    jud: '判断',
    spd: '速度',
    str: '力量',
    end: '耐力',
    bal: '平衡',
    tou: '抗打',
    tec: '技巧'
  };
  return Object.entries(eff || {}).map(([key, value]) => `${labels[key] || key} ${Number(value) > 0 ? '+' : ''}${value}`);
}

function scaledGain(gain = {}, multiplier = 1) {
  const out = {};
  Object.entries(gain || {}).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      out[key] = value;
      return;
    }
    if (key === 'fatigue' && value > 0) out[key] = Math.max(1, Math.round(value * (multiplier > 1 ? 1.05 : 1)));
    else out[key] = Math.round(value * multiplier);
  });
  return out;
}

function advanceTime(state, minutes) {
  state.time += minutes;
  state.daily.actions += 1;
  if (state.time >= 1500) sleep(state, true);
}

function sleep(state, forced = false) {
  const p = state.player;
  p.fatigue = clamp(p.fatigue - (forced ? 18 : 34), 0, 100);
  p.hp = clamp(p.hp + 34, 1, p.hpMax);
  p.sp = clamp(p.spMax - p.fatigue * 0.25, 0, p.spMax);
  p.posture = p.postureMax;
  p.calm = clamp(p.calm + 8, 0, 100);
  p.morale = clamp(p.morale + (forced ? -3 : 3), 0, 100);
  p.injuries.forEach((injury) => { injury.turn -= 1; });
  p.injuries = p.injuries.filter((injury) => injury.turn > 0);
  state.day += 1;
  state.time = 420;
  state.loc = 'home';
  state.daily = { talked: {}, actions: 0, mainDone: false, sideSeed: state.day };
  addLog(state, `进入第${state.day}天。${forced ? '熬夜导致恢复变差。' : '睡了一觉，状态恢复。'}`);
}

function travelLevel(state, toId) {
  const a = LOC_POS[state.loc] || [0, 0];
  const b = LOC_POS[toId] || [0, 0];
  const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  return d <= 2 ? 0 : d <= 5 ? 1 : 2;
}

function travelQuote(state, toId, modeId) {
  const mode = TRAVEL_TUNING[modeId];
  const level = travelLevel(state, toId);
  return {
    modeId,
    level,
    time: mode.time[level],
    money: mode.money[level],
    sp: mode.sp[level],
    fitXp: mode.fitXp[level],
    fatigue: mode.fatigue[level]
  };
}

function inOpen(state, locId) {
  const loc = LOCS[locId];
  if (!loc) return false;
  const [start, end] = loc.open;
  return state.time >= start && state.time <= end;
}

function learnSkill(state, id, xp = 5) {
  if (!SKILLS[id]) return;
  const skill = state.skillState[id] || { p: 0, use: 0, retrain: 0, zhus: [] };
  const tech = derivedStats(state).tec || 50;
  const mult = 1 + (skill.retrain || 0) * 0.3 + clamp((tech - 50) * 0.003, 0, 0.16);
  skill.p = clamp((skill.p || 0) + xp * mult, 0, 100);
  state.skillState[id] = skill;
  state.unlocked[id] = 1;
  const style = SKILLS[id].style;
  if (style) state.styles[style] = clamp((state.styles[style] || 0) + xp * 0.5, 0, 100);
}

function equipItem(state, id) {
  const item = ITEMS[id];
  if (!item?.slot) return '这个物品不能装备';
  state.equipment[item.slot] = id;
  return `已装备 ${item.name}`;
}

function useItem(state, id) {
  const item = ITEMS[id];
  if (!item || !state.inventory[id]) return '没有这个物品';
  if (item.type === 'equipment') return equipItem(state, id);
  const before = snapshotState(state);
  applyGain(state, item.gain || {});
  state.inventory[id] -= 1;
  if (state.inventory[id] <= 0) delete state.inventory[id];
  return { title: `${item.name} 使用结算`, lines: settlementLines(before, snapshotState(state)) };
}

function unequipItem(state, slot) {
  if (!Object.prototype.hasOwnProperty.call(state.equipment || {}, slot)) return '没有这个装备槽';
  const id = state.equipment[slot];
  if (!id) return '这个槽位本来就是空的';
  state.equipment[slot] = null;
  return `已卸下 ${ITEMS[id]?.name || id}`;
}

function startTrainingMini(state, action) {
  state.ui.modal = {
    type: 'trainingMini',
    actionId: action.id,
    title: action.name,
    template: action.minigame?.template || 'rhythm',
    prompt: action.minigame?.prompt || action.desc,
    summary: actionSummary(action),
    choices: action.minigame?.template === 'judgement'
      ? [
        { grade: 'poor', label: '硬顶下一组', text: '不看呼吸，继续加量。' },
        { grade: 'solid', label: '按计划轮换', text: '保持动作质量，稳稳做完。' },
        { grade: 'sharp', label: '降速保质量', text: '减少摆动，最后一组做干净。' }
      ]
      : [
        { grade: 'poor', label: '抢节奏猛砸', text: '声音很响，动作散。' },
        { grade: 'solid', label: '跟节拍完成', text: '出拳、回收、步伐都在线。' },
        { grade: 'sharp', label: '节拍里加变奏', text: '轻重分明，回收也快。' }
      ]
  };
}

function finishTrainingMini(state, gradeId) {
  const modal = state.ui.modal;
  const action = Object.values(ACTIONS).flat().find((item) => item.id === modal?.actionId);
  const grade = TRAINING_GRADES[gradeId] || TRAINING_GRADES.solid;
  if (!action) {
    state.ui.toast = '训练项目不存在';
    state.ui.modal = null;
    return;
  }
  if (actionSpCost(action) > state.player.sp) {
    state.ui.toast = '体力不足';
    state.ui.modal = null;
    return;
  }
  if (action.cost && action.cost > state.player.money) {
    state.ui.toast = '钱不够';
    state.ui.modal = null;
    return;
  }
  const before = snapshotState(state);
  state.player.sp -= actionSpCost(action);
  if (action.cost) state.player.money -= action.cost;
  advanceTime(state, action.time || 30);
  applyGain(state, scaledGain(action.gain || {}, grade.multiplier));
  addLog(state, `完成训练小游戏：${action.name} · ${grade.label}`);
  state.ui.modal = {
    type: 'settlement',
    title: `${action.name} · ${grade.label}`,
    body: grade.note,
    lines: settlementLines(before, snapshotState(state))
  };
}

function startBattle(state, enemyId, main = false) {
  const def = ENEMIES[enemyId] || ENEMIES.E01;
  const dailySpBefore = state.player.sp;
  const battleSp = clamp(Math.max(state.player.sp, Math.round(state.player.spMax * 0.72)), 30, state.player.spMax);
  state.player.sp = battleSp;
  state.ui.modal = null;
  state.ui.selectedTravel = null;
  state.ui.cityMapOpen = false;
  state.ui.toast = null;
  const scale = 1 + Math.max(0, state.day - 1) * 0.014;
  state.combat = {
    enemyId,
    main,
    dailySpBefore,
    round: 1,
    exchange: 1,
    distance: def.preferredRange === 'far' ? 'far' : 'mid',
    ground: 'none',
    target: 'body',
    phase: 'planning',
    clock: 0,
    playerQueue: [],
    enemyCooldown: 0,
    eventSeq: 0,
    windowCount: 0,
    selected: [],
    log: [
      `遭遇 ${def.name}。对手标签：${def.tags.join(' / ')}。`,
      `战斗体力独立结算：日常体力 ${Math.round(dailySpBefore)}，开打体力 ${Math.round(battleSp)}。`
    ],
    history: [],
    steps: [],
    playerBuff: { def: 0, dodge: 0, anti: 0, nextHit: 0, counter: 0 },
    enemy: {
      ...clone(def),
      hpMax: Math.round(def.hp * scale),
      hp: Math.round(def.hp * scale),
      spMax: Math.round(def.sp * scale),
      sp: Math.round(def.sp * scale),
      postureMax: Math.round(def.posture * scale),
      posture: Math.round(def.posture * scale)
    },
    ended: false
  };
}

function equipmentEffects(state) {
  const effects = {};
  Object.values(state.equipment || {}).forEach((id) => {
    const item = ITEMS[id];
    if (!item?.eff) return;
    Object.entries(item.eff).forEach(([key, value]) => {
      effects[key] = (effects[key] || 0) + value;
    });
  });
  return effects;
}

function toCombatInput(state) {
  return {
    ...clone(state.combat),
    day: state.day,
    player: clone(state.player),
    skillState: clone(state.skillState),
    styles: clone(state.styles),
    equipSkills: [...(state.equipSkills || [])],
    effects: equipmentEffects(state)
  };
}

function mergeCombatResult(state, previousCombat, nextCombat) {
  const baseSeq = Number(previousCombat.eventSeq || 0);
  const sequencedSteps = (nextCombat.steps || previousCombat.steps || []).map((step, index) => ({
    ...step,
    id: step.id || `evt_${baseSeq + index + 1}`,
    eventSeq: baseSeq + index + 1
  }));
  state.player.hp = nextCombat.player.hp;
  state.player.sp = nextCombat.player.sp;
  state.player.posture = nextCombat.player.posture;
  state.player.calm = nextCombat.player.calm ?? state.player.calm;
  state.player.morale = nextCombat.player.morale ?? state.player.morale;
  state.player.injuries = nextCombat.player.injuries || state.player.injuries;
  state.skillState = nextCombat.skillState || state.skillState;
  state.styles = nextCombat.styles || state.styles;
  state.combat = {
    ...previousCombat,
    ...nextCombat,
    enemyId: previousCombat.enemyId,
    main: previousCombat.main,
    dailySpBefore: previousCombat.dailySpBefore,
    enemy: {
      ...nextCombat.enemy,
      reward: previousCombat.enemy.reward,
      tags: previousCombat.enemy.tags,
      risk: previousCombat.enemy.risk,
      icon: previousCombat.enemy.icon
    },
    selected: [],
    playerQueue: [],
    phase: 'planning',
    clock: Number(previousCombat.clock || 0) + 10,
    enemyCooldown: 0,
    eventSeq: baseSeq + sequencedSteps.length,
    windowCount: Number(previousCombat.windowCount || 0) + 1,
    lastWindow: {
      duration: 10,
      actions: previousCombat.playerQueue?.length ? previousCombat.playerQueue : previousCombat.selected || [],
      stepCount: sequencedSteps.length
    },
    steps: sequencedSteps
  };
}

function recordCombatOutcome(state, win, reason = 'normal') {
  const combat = state.combat;
  const e = combat.enemy;
  const cm = state.combatMemory;
  cm.fights += 1;
  if (win) cm.wins += 1;
  else cm.losses += 1;
  if (reason === 'riskwin') cm.riskWins += 1;
  cm.lastEnemy = combat.enemyId;
  cm.lastResult = reason === 'riskwin' ? 'riskwin' : win ? 'win' : 'loss';
  cm.lastTags = e.tags || [];
  cm.enemyNotes[combat.enemyId] = { day: state.day, result: cm.lastResult, rounds: combat.round, ai: e.ai, hpLeft: Math.round(e.hp), playerHp: Math.round(state.player.hp) };
  cm.recent.unshift({ day: state.day, enemy: e.name, result: cm.lastResult, rounds: combat.round });
  cm.recent = cm.recent.slice(0, 6);
  state.eventLog.unshift({ day: state.day, time: state.time, type: 'combat', enemy: e.name, result: cm.lastResult });
  state.eventLog = state.eventLog.slice(0, 30);
}

function finishBattle(state, reason = 'normal') {
  const combat = state.combat;
  const win = reason === 'riskwin' || combat.enemy.hp <= 0 || (state.player.hp > 0 && state.player.hp >= combat.enemy.hp);
  const reward = combat.enemy.reward || {};
  const before = snapshotState(state);
  recordCombatOutcome(state, win, reason);
  if (win) {
    state.player.money += reward.money || 0;
    state.player.fame += reward.fame || 0;
    state.player.morale = clamp(state.player.morale + 6, 0, 100);
    addLog(state, `战斗结束：战胜 ${combat.enemy.name}，名声 +${reward.fame || 0}，现金 +${reward.money || 0}`);
  } else {
    state.player.morale = clamp(state.player.morale - 6, 0, 100);
    state.player.calm = clamp(state.player.calm + 3, 0, 100);
    addLog(state, `战斗结束：输给 ${combat.enemy.name}，但获得复盘材料。`);
  }
  const targetSp = Math.round(state.player.spMax * (reason === 'surrender' ? 0.66 : 0.58));
  state.player.sp = clamp(Math.max(combat.dailySpBefore || 0, targetSp), 0, state.player.spMax);
  state.ui.modal = {
    type: 'battleResult',
    title: reason === 'riskwin' ? '风险胜利' : win ? '胜利' : '失败/撤离',
    body: [
      `对手：${combat.enemy.name}`,
      win ? `收益：现金 +${reward.money || 0} / 名声 +${reward.fame || 0}` : '失败也能复盘，别只看输赢。',
      `日常体力已恢复到 ${Math.round(state.player.sp)}/${Math.round(state.player.spMax)}。`
    ].join('\n'),
    lines: settlementLines(before, snapshotState(state)),
    win,
    reason
  };
  state.combat = null;
  state.ui.tab = 'map';
}

export class GameStore {
  constructor() {
    this.state = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    recalcVitals(this.state);
    for (const listener of this.listeners) listener(this.state);
  }

  dispatch(action) {
    if (action.type === 'newGame') {
      this.state = createNewState(action.origin || 'worker');
      this.emit();
      return;
    }
    if (action.type === 'loadGame') {
      const raw = localStorage.getItem(SAVE_KEY);
      this.state = raw ? migrateSave(JSON.parse(raw)) : createNewState('worker');
      this.state.ui.toast = raw ? '读档完成' : '没有旧存档，已开新档';
      this.emit();
      return;
    }
    if (!this.state) this.state = createNewState('worker');
    const s = this.state;

    if (action.type === 'saveGame') {
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
      s.ui.toast = '已保存';
    } else if (action.type === 'setTab') {
      s.ui.tab = action.tab;
      s.ui.modal = null;
      s.ui.cityMapOpen = false;
    } else if (action.type === 'openCityMap') {
      s.ui.tab = 'map';
      s.ui.modal = null;
      s.ui.selectedTravel = null;
      s.ui.cityMapOpen = true;
    } else if (action.type === 'toggleCityMap') {
      s.ui.tab = 'map';
      s.ui.modal = null;
      s.ui.selectedTravel = null;
      s.ui.cityMapOpen = !s.ui.cityMapOpen;
    } else if (action.type === 'closeCityMap') {
      s.ui.cityMapOpen = false;
    } else if (action.type === 'toast') {
      s.ui.toast = action.text;
    } else if (action.type === 'closeModal') {
      s.ui.modal = null;
      s.ui.selectedTravel = null;
    } else if (action.type === 'openTravel') {
      s.ui.selectedTravel = action.loc;
      s.ui.modal = { type: 'travel', loc: action.loc };
      s.ui.cityMapOpen = false;
    } else if (action.type === 'travel') {
      const q = travelQuote(s, action.loc, action.mode);
      if (q.money > s.player.money) s.ui.toast = '钱不够';
      else if (q.sp > s.player.sp) s.ui.toast = '体力不足';
      else {
        const before = snapshotState(s);
        s.player.money -= q.money;
        s.player.sp = clamp(s.player.sp - q.sp, 0, s.player.spMax);
        applyGain(s, { fatigue: q.fatigue, fitXp: q.fitXp });
        s.loc = action.loc;
        advanceTime(s, q.time);
        addLog(s, `乘${TRAVEL_TUNING[action.mode].name}到 ${LOCS[action.loc].name}`);
        s.ui.modal = { type: 'settlement', title: '出行结算', lines: settlementLines(before, snapshotState(s)), body: `到达 ${LOCS[action.loc].name} · ${TRAVEL_TUNING[action.mode].name} · ${q.time}分钟` };
        s.ui.selectedTravel = null;
        s.ui.cityMapOpen = false;
      }
    } else if (action.type === 'doAction') {
      const a = findAction(s, action.actionId);
      if (!a) s.ui.toast = '行动不存在';
      else if (actionSpCost(a) > s.player.sp) s.ui.toast = '体力不足';
      else if (a.cost && a.cost > s.player.money) s.ui.toast = '钱不够';
      else if (a.type === 'sleep') sleep(s);
      else if (a.type === 'shop') s.ui.tab = 'shop';
      else if (a.minigame) startTrainingMini(s, a);
      else {
        const before = snapshotState(s);
        s.player.sp -= actionSpCost(a);
        if (a.cost) s.player.money -= a.cost;
        advanceTime(s, a.time || 30);
        if (a.type === 'battle') startBattle(s, a.enemy);
        else if (a.type === 'dialog') {
          s.relations[a.npc] = (s.relations[a.npc] || 0) + 1;
          s.player.calm = clamp(s.player.calm + 2, 0, 100);
          s.ui.modal = { type: 'dialog', npc: a.npc, title: NPCS[a.npc]?.name || '对话', body: npcLine(a.npc), lines: settlementLines(before, snapshotState(s)) };
          addLog(s, `${NPCS[a.npc]?.name || '有人'}给了你一段建议。`);
        } else {
          applyGain(s, a.gain || {});
          addLog(s, `完成行动：${a.name}`);
          s.ui.modal = { type: 'settlement', title: `${a.name} 结算`, lines: settlementLines(before, snapshotState(s)) };
        }
      }
    } else if (action.type === 'startMainEvent') {
      const main = MAIN_EVENTS[s.day];
      if (!main || s.flags[`main_${s.day}`]) s.ui.toast = '今天没有新的主线节点';
      else if (main.loc && main.loc !== s.loc) {
        s.ui.selectedTravel = main.loc;
        s.ui.modal = { type: 'travel', loc: main.loc };
        s.ui.cityMapOpen = false;
      } else {
        s.flags[`main_${s.day}`] = true;
        s.daily.mainDone = true;
        if (main.enemy) startBattle(s, main.enemy, true);
        else {
          if (main.npc) s.relations[main.npc] = (s.relations[main.npc] || 0) + 1;
          s.ui.modal = { type: 'dialog', npc: main.npc, title: main.title, body: main.desc, lines: [] };
          addLog(s, `完成主线：${main.title}`);
        }
      }
    } else if (action.type === 'takeOpportunity') {
      const card = buildOpportunities(s).find((item) => item.id === action.id);
      if (!card) s.ui.toast = '这个待办已经过期';
      else if (card.loc && card.loc !== s.loc) {
        s.ui.selectedTravel = card.loc;
        s.ui.modal = { type: 'travel', loc: card.loc };
        s.ui.cityMapOpen = false;
      } else if (card.enemy) startBattle(s, card.enemy);
      else if (card.shop) s.ui.tab = 'shop';
      else if (card.action) this.dispatch({ type: 'doAction', actionId: card.action });
      else {
        if (card.npc) s.relations[card.npc] = (s.relations[card.npc] || 0) + 1;
        s.ui.modal = { type: 'dialog', npc: card.npc, title: card.title, body: card.desc, lines: [] };
        addLog(s, `处理待办：${card.title}`);
      }
    } else if (action.type === 'finishTraining') {
      finishTrainingMini(s, action.grade);
    } else if (action.type === 'startBattle') {
      startBattle(s, action.enemyId);
    } else if (action.type === 'selectSkill') {
      const c = s.combat;
      const skill = SKILLS[action.skillId];
      if (c && skill && c.phase !== 'auto' && (c.selected || []).length < 3) {
        c.selected.push(action.skillId);
        c.playerQueue = [...c.selected];
      }
    } else if (action.type === 'clearSkills') {
      if (s.combat && s.combat.phase !== 'auto') {
        s.combat.selected = [];
        s.combat.playerQueue = [];
      }
    } else if (action.type === 'cycleTarget') {
      const c = s.combat;
      if (c) c.target = c.target === 'head' ? 'body' : c.target === 'body' ? 'leg' : 'head';
    } else if (action.type === 'setTarget') {
      const c = s.combat;
      if (c && ['head', 'body', 'leg'].includes(action.target)) c.target = action.target;
    } else if (action.type === 'confirmBattle') {
      const c = s.combat;
      if (c) {
        const previousCombat = clone(c);
        previousCombat.phase = 'auto';
        previousCombat.playerQueue = c.selected?.length ? [...c.selected] : ['guard'];
        const result = resolveCombatExchange(toCombatInput({ ...s, combat: previousCombat }), previousCombat.playerQueue);
        result.combatState.steps = result.steps;
        mergeCombatResult(s, previousCombat, result.combatState);
        const stepLogs = result.steps.flatMap((step) => Array.isArray(step.log) ? step.log : step.log ? [step.log] : []);
        if (s.combat) s.combat.log = [`自动窗口 ${s.combat.windowCount} 结束，重新调整。`, ...stepLogs, ...(s.combat.log || [])].slice(0, 12);
        if (result.finished) finishBattle(s, s.combat.finishReason || 'normal');
      }
    } else if (action.type === 'surrender') {
      if (s.combat) finishBattle(s, 'surrender');
    } else if (action.type === 'postReview') {
      const before = snapshotState(s);
      if (action.kind === 'tech') { learnSkill(s, 'jab', 4); learnSkill(s, 'guard', 4); }
      if (action.kind === 'calm') { s.player.calm = clamp(s.player.calm + 12, 0, 100); s.player.posture = s.player.postureMax; }
      if (action.kind === 'intel') { s.player.stats.jud += 1; s.player.auth = clamp(s.player.auth + 3, 0, 100); s.player.heat += 1; }
      s.ui.modal = { type: 'settlement', title: '战后复盘结算', lines: settlementLines(before, snapshotState(s)) };
    } else if (action.type === 'buyItem') {
      const item = ITEMS[action.itemId];
      if (!item || s.player.money < item.price) s.ui.toast = '钱不够';
      else {
        s.player.money -= item.price;
        s.inventory[action.itemId] = (s.inventory[action.itemId] || 0) + 1;
        advanceTime(s, 10);
        s.ui.toast = `买到 ${item.name}`;
      }
    } else if (action.type === 'useItem') {
      const result = useItem(s, action.itemId);
      if (typeof result === 'string') s.ui.toast = result;
      else s.ui.modal = { type: 'settlement', ...result };
    } else if (action.type === 'unequipItem') {
      s.ui.toast = unequipItem(s, action.slot);
    } else if (action.type === 'equipSkill') {
      if (!s.skillState[action.skillId]) s.ui.toast = '还没学会';
      else if (s.equipSkills.includes(action.skillId)) s.ui.toast = '已经装备';
      else {
        const idx = s.equipSkills.findIndex((id) => !id);
        if (idx < 0) s.ui.toast = '技能槽已满';
        else s.equipSkills[idx] = action.skillId;
      }
    } else if (action.type === 'unequipSkill') {
      s.equipSkills[action.index] = null;
    }
    this.emit();
  }
}

function npcLine(npc) {
  const lines = {
    fatty: '别把名声当命。先看清对手是谁，再决定接不接。',
    coach: '你现在最大的问题不是不会打，是打完停在原地。手要回来，人也要能动。',
    master: '传统不是不能用，是不能只剩名字。放到压力里，剩下的才叫技术。',
    xiaoman: '真遇到麻烦，能走就走，别为了面子。',
    chen: '第30天来拳馆。我只看你在压力下做什么。'
  };
  return lines[npc] || '先把今天的事做扎实。';
}

const LOCATION_BACKGROUND_KEYS = {
  home: { day: 'bg.home.day', night: 'bg.home.night' },
  store: { day: 'bg.store.day', night: 'bg.store.night' },
  worksite: { day: 'bg.worksite.day', night: 'bg.worksite.night' },
  park: { day: 'bg.park.day', night: 'bg.park.night' },
  boxing: { day: 'bg.boxing.day', night: 'bg.boxing.night' },
  wuguan: { day: 'bg.wuguan.day', night: 'bg.wuguan.night' },
  mma: { day: 'bg.mma.day', night: 'bg.mma.night' },
  gym: { day: 'bg.gym.day', night: 'bg.gym.night' },
  physio: { day: 'bg.physio.day', night: 'bg.physio.night' },
  street: { day: 'bg.street.day', night: 'bg.street.night' }
};

const CITY_MAP_BACKGROUND_KEYS = {
  day: 'bg.city.map.day',
  night: 'bg.city.map.night'
};

const CITY_MAP_MARKERS = {
  home: { x: 13, y: 74 },
  park: { x: 21, y: 38 },
  store: { x: 31, y: 66 },
  worksite: { x: 47, y: 27 },
  boxing: { x: 45, y: 73 },
  wuguan: { x: 63, y: 54 },
  mma: { x: 61, y: 87 },
  gym: { x: 86, y: 69 },
  physio: { x: 78, y: 91 },
  street: { x: 84, y: 34 }
};

const SCENE_CAST_BY_LOC = {
  home: [{ id: 'fatty', name: '刘胖子', role: '凑热闹的熟人', kind: 'token', icon: '胖' }],
  store: [{ id: 'xiaoman', name: '小满', role: '便利店值班', kind: 'token', icon: '满' }],
  worksite: [{ id: 'worker', name: '工友老周', role: '等活的临工', kind: 'token', icon: '工' }],
  park: [{ id: 'rookie', name: '拳击新人', role: '低风险验货', assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '拳' }],
  boxing: [{ id: 'coach', name: '梁教练', role: '盯动作回收', kind: 'token', icon: '梁' }],
  wuguan: [{ id: 'master', name: '周青山', role: '拆招看架子', kind: 'token', icon: '周' }],
  mma: [{ id: 'grappler', name: 'MMA体验学员', role: '等开放垫子', assetKey: 'fighter.enemy.grappler', kind: 'standee', icon: '摔' }],
  gym: [{ id: 'gymcoach', name: '值班教练', role: '看循环训练', kind: 'token', icon: '体' }],
  physio: [{ id: 'physio', name: '理疗师', role: '处理疲劳小伤', kind: 'token', icon: '疗' }],
  street: [{ id: 'weapon', name: '木棍小混混', role: '街口试探', assetKey: 'fighter.enemy.weapon', kind: 'standee', icon: '棍' }]
};

const ENEMY_SCENE_ASSETS = {
  E01: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '拳' },
  E02: { assetKey: 'portrait.enemy.grappler', kind: 'portrait', icon: '掌' },
  E03: { assetKey: 'portrait.enemy.weapon', kind: 'portrait', icon: '玄' },
  E05: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '练' },
  E06: { assetKey: 'fighter.enemy.grappler', kind: 'standee', icon: '摔' },
  E07: { assetKey: 'fighter.enemy.weapon', kind: 'standee', icon: '棍' },
  E18: { assetKey: 'fighter.enemy.boss', kind: 'standee', icon: '陈' }
};

const NPC_SCENE_ASSETS = {
  fatty: { assetKey: 'scene.npc.fatty', kind: 'standee' },
  xiaoman: { assetKey: 'scene.npc.xiaoman', kind: 'standee' },
  worker: { assetKey: 'scene.npc.worker', kind: 'standee' },
  coach: { assetKey: 'scene.npc.coach', kind: 'standee' },
  master: { assetKey: 'scene.npc.master', kind: 'standee' },
  gymcoach: { assetKey: 'scene.npc.gymcoach', kind: 'standee' },
  physio: { assetKey: 'scene.npc.physio', kind: 'standee' },
  chen: { assetKey: 'scene.npc.chen', kind: 'standee' }
};

function timeOfDayKey(time) {
  const phase = phaseText(time);
  return phase === '夜晚' || phase === '深夜' ? 'night' : 'day';
}

function locationBackgroundKey(locId, timeOfDay) {
  return LOCATION_BACKGROUND_KEYS[locId]?.[timeOfDay] || LOCATION_BACKGROUND_KEYS[locId]?.day || 'bg.home.day';
}

function cityMapModel(state, timeOfDay) {
  return {
    backgroundKey: CITY_MAP_BACKGROUND_KEYS[timeOfDay] || CITY_MAP_BACKGROUND_KEYS.day,
    timeOfDay,
    markers: Object.entries(LOCS).map(([id, loc]) => ({
      id,
      ...loc,
      ...(CITY_MAP_MARKERS[id] || { x: 50, y: 50 }),
      active: id === state.loc,
      closed: id !== 'home' && id !== 'store' && !inOpen(state, id),
      openText: `${fmtTime((loc.open || [0])[0])}-${fmtTime((loc.open || [1440, 1440])[1])}`
    }))
  };
}

function sceneCharacters(state, mainEvent) {
  const p = state.player;
  const cast = [{
    id: 'player',
    name: p.name,
    role: '今天的主角',
    assetKey: 'fighter.player',
    kind: 'standee',
    side: 'player',
    icon: '我'
  }];
  const seen = new Set(['player']);
  const pushCast = (entry) => {
    if (!entry || seen.has(entry.id)) return;
    seen.add(entry.id);
    cast.push({ side: 'npc', ...entry, ...(NPC_SCENE_ASSETS[entry.id] || {}) });
  };
  (SCENE_CAST_BY_LOC[state.loc] || []).forEach(pushCast);
  if (mainEvent?.loc === state.loc) {
    if (mainEvent.npc && NPCS[mainEvent.npc]) {
      const npc = NPCS[mainEvent.npc];
      pushCast({
        id: mainEvent.npc,
        name: npc.name,
        role: mainEvent.title,
        kind: 'token',
        icon: npc.icon
      });
    }
    if (mainEvent.enemy && ENEMIES[mainEvent.enemy]) {
      const enemy = ENEMIES[mainEvent.enemy];
      pushCast({
        id: mainEvent.enemy,
        name: enemy.name,
        role: mainEvent.title,
        ...(ENEMY_SCENE_ASSETS[mainEvent.enemy] || { kind: 'token', icon: enemy.icon })
      });
    }
  }
  return cast.slice(0, 3);
}

export function buildRenderModel(state) {
  if (!state) return { boot: true, origins: ORIGINS };
  const p = state.player;
  const stats = derivedStats(state);
  const fit = fitBonus(p);
  const mainEvent = MAIN_EVENTS[state.day] && !state.flags[`main_${state.day}`] ? MAIN_EVENTS[state.day] : null;
  const opportunities = buildOpportunities(state);
  const timeOfDay = timeOfDayKey(state.time);
  const backgroundKey = locationBackgroundKey(state.loc, timeOfDay);
  const combatInput = state.combat ? toCombatInput(state) : null;
  const selectedCount = state.combat?.selected?.length || 0;
  const skillPreview = (id) => {
    if (!id || !combatInput) return null;
    const preview = previewPlayerAction(combatInput, id);
    const queueReason = selectedCount >= 3 && !(state.combat.selected || []).includes(id) ? '本回合队列已满' : '';
    return {
      ...preview,
      damageText: preview.max > 0 ? `${preview.min}-${preview.max}` : '0',
      postureText: preview.posture > 0 ? String(preview.posture) : '0',
      unavailableReason: queueReason || preview.reason || ''
    };
  };
  const actions = (ACTIONS[state.loc] || []).map((action) => ({
    ...action,
    disabled: actionSpCost(action) > p.sp || (action.cost && action.cost > p.money),
    spCost: actionSpCost(action),
    summary: actionSummary(action)
  }));
  const equipmentSlots = EQUIPMENT_SLOTS.map((slot) => {
    const itemId = state.equipment?.[slot.id] || null;
    const item = itemId ? ITEMS[itemId] : null;
    return {
      ...slot,
      itemId,
      item,
      effects: item ? effectSummary(item.eff) : []
    };
  });
  const decoratedMainEvent = mainEvent ? {
    ...mainEvent,
    locName: LOCS[mainEvent.loc]?.name || mainEvent.loc,
    enemyName: ENEMIES[mainEvent.enemy]?.name || '',
    npcName: NPCS[mainEvent.npc]?.name || '',
    currentLoc: mainEvent.loc === state.loc,
    done: Boolean(state.flags[`main_${state.day}`])
  } : null;
  return {
    version: GAME_VERSION,
    tabs: TABS,
    tab: state.ui.tab || 'map',
    modal: state.ui.modal,
    cityMapOpen: Boolean(state.ui.cityMapOpen),
    toast: state.ui.toast,
    day: state.day,
    dayText: `第${state.day}天 周${DOW[(state.day - 1) % 7]} ${fmtTime(state.time)}`,
    phase: `${dayStage(state.day)} · ${phaseText(state.time)} · ${LOCS[state.loc]?.name || ''}`,
    loc: { id: state.loc, ...(LOCS[state.loc] || {}) },
    locs: Object.entries(LOCS).map(([id, loc]) => ({ id, ...loc, active: id === state.loc, closed: id !== 'home' && id !== 'store' && !inOpen(state, id) })),
    timeOfDay,
    cityMap: cityMapModel(state, timeOfDay),
    locationScene: {
      locId: state.loc,
      backgroundKey,
      timeOfDay,
      timeText: timeOfDay === 'night' ? '夜景' : '日间',
      openText: `${fmtTime((LOCS[state.loc]?.open || [0])[0])}-${fmtTime((LOCS[state.loc]?.open || [1440, 1440])[1])}`,
      characters: sceneCharacters(state, mainEvent)
    },
    resources: [
      ['现金', p.money, '￥'],
      ['体力', `${Math.round(p.sp)}/${Math.round(p.spMax)}`, '⚡'],
      ['健康', `${Math.round(p.hp)}/${Math.round(p.hpMax)}`, '♥'],
      ['士气', Math.round(p.morale), '火'],
      ['真实性', Math.round(p.auth), '真'],
      ['名声', Math.round(p.fame), '星'],
      ['热度', Math.round(p.heat), '热'],
      ['体能沉淀', `Lv${fit.level} ${fit.progress}/20`, '体']
    ],
    player: { ...p, stats, fit, origin: ORIGINS[state.origin], injuries: p.injuries || [] },
    styles: state.styles,
    statRules: STAT_RULES,
    resourceRules: RESOURCE_RULES,
    styleRules: STYLE_RULES,
    skills: Object.entries(SKILLS).map(([id, skill]) => ({
      id,
      ...skill,
      state: state.skillState[id],
      equipped: state.equipSkills.includes(id),
      preview: skillPreview(id),
      unavailableReason: !state.skillState[id] ? '未学会' : ''
    })),
    equipSkills: state.equipSkills.map((id, index) => ({
      id,
      index,
      skill: id ? SKILLS[id] : null,
      state: id ? state.skillState[id] : null,
      preview: skillPreview(id),
      selected: id ? (state.combat?.selected || []).includes(id) : false
    })),
    inventory: Object.entries(state.inventory || {}).filter(([, count]) => count > 0).map(([id, count]) => ({ id, count, item: ITEMS[id] })),
    equipmentSlots,
    shopItems: Object.entries(ITEMS).map(([id, item]) => ({ id, ...item, owned: state.inventory[id] || 0 })),
    npcs: Object.entries(NPCS).map(([id, npc]) => ({ id, ...npc, relation: state.relations[id] || 0 })),
    actions,
    opportunities,
    mainEvent: decoratedMainEvent,
    combat: state.combat,
    log: state.log || [],
    eventLog: state.eventLog || [],
    combatMemory: state.combatMemory,
    selectedTravel: state.ui.selectedTravel,
    travelOptions: state.ui.selectedTravel ? Object.entries(TRAVEL_TUNING).map(([modeId, mode]) => ({ id: modeId, ...mode, quote: travelQuote(state, state.ui.selectedTravel, modeId) })) : []
  };
}
