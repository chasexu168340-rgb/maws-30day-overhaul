import {
  ACTIONS,
  DOW,
  ENEMIES,
  FATHER_DIARY,
  GAME_VERSION,
  ITEMS,
  LOC_POS,
  LOC_UNLOCKS,
  LOCS,
  INITIAL_SKILLS,
  IDLE_EVENTS,
  MAW_FORMS,
  MAW_RULES,
  MAIN_EVENTS,
  NPC_DIALOGUES,
  NPCS,
  ORIGINS,
  RESOURCE_RULES,
  SAVE_KEY,
  SKILLS,
  SKILL_UNLOCKS,
  STAT_KEYS,
  STAT_RULES,
  STYLE_RULES,
  TABS,
  TIME_DOSAGE_OPTIONS,
  TRAVEL_TUNING
} from '../content/data.js';
import { applyGain, settlementLines } from './economy.js';
import { buildOpportunities } from './events.js';
import { chooseEnemyResponse, previewPlayerAction, resolveCombatExchange, suggestCombatQueue } from './combat.js';

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

const TRAINING_TEMPLATE_LABELS = {
  combo: '连段',
  read: '判断',
  pacing: '配速',
  rhythm: '节奏',
  judgement: '判断'
};

const COMBAT_QUEUE_LIMIT = 2;
const COMBAT_PLAN_MODES = Object.freeze([
  { id: 'manual', label: '手动', desc: '玩家自己排本窗口动作。' },
  { id: 'safe', label: '稳守', desc: '优先抱架，再找一次反击或拉开。' },
  { id: 'pressure', label: '压迫', desc: '先推开抢空间，再接一记野路挥拳。' },
  { id: 'exit', label: '脱离', desc: '先降温，再后撤离开冲突。' }
]);
const DEFAULT_COMBAT_PLAN_MODE = 'manual';
const STARTER_EQUIP_SKILLS = ['wild_swing', 'push_away', 'mystic', 'guard', 'retreat', 'talkdown'];

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

function dayPeriod(time) {
  if (time < 720) return { id: 'morning', label: '上午', actionWindow: 1 };
  if (time < 1020) return { id: 'afternoon', label: '下午', actionWindow: 2 };
  if (time < 1320) return { id: 'evening', label: '傍晚/夜晚', actionWindow: 3 };
  return { id: 'night', label: '深夜', actionWindow: 4 };
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

function baseStyles(existing = {}) {
  return {
    ...Object.fromEntries(Object.keys(STYLE_RULES).map((id) => [id, 0])),
    ...(existing || {})
  };
}

function baseRelations(existing = {}, fatty = 0) {
  return {
    ...Object.fromEntries(Object.keys(NPCS).map((id) => [id, 0])),
    fatty,
    ...(existing || {})
  };
}

const MAW_MODULE_KEYS = ['boxing', 'body', 'traditional', 'grappling', 'street'];

const MAW_MODULE_LABELS = {
  boxing: '拳击落点',
  body: '身体底子',
  traditional: '传统拆解',
  grappling: '地面防摔',
  street: '街头判断'
};

const MAW_MODULE_GUIDE = {
  boxing: {
    desc: '直拳、刺拳、抱架和拳距回收。先能打中，再谈打重。',
    action: 'bag',
    loc: 'boxing',
    skills: ['jab', 'straight', 'guard']
  },
  body: {
    desc: '耐力、抗打、核心和平衡。身体有余量，技术才不会一紧张就散。',
    action: 'gym_basic',
    loc: 'gym',
    skills: ['guard', 'dodge']
  },
  traditional: {
    desc: '把旧拳谱拆成短击、重心和节奏破坏，不再靠招名赢。',
    action: 'pressure_test',
    loc: 'wuguan',
    skills: ['palm', 'offbalance']
  },
  grappling: {
    desc: '防摔、脱身和重新站起。会打拳，也要知道被抱住以后怎么办。',
    action: 'sprawl_drill',
    loc: 'mma',
    skills: ['sprawl', 'escape']
  },
  street: {
    desc: '撤离、降温、出口和风险判断。现实里不是每场都该打到底。',
    action: 'oldtown_watch',
    loc: 'street',
    skills: ['talkdown', 'dirtyescape', 'retreat']
  }
};

const FINAL_OBJECTIVES = {
  surviveWindow1: {
    label: '撑过第一波压迫',
    short: '第一波',
    desc: '至少完成一个自动交换窗口，血量没有被打穿。'
  },
  guardHeavy: {
    label: '护住一次重压',
    short: '护重压',
    desc: '面对高危险读板时，用抱架、防摔、侧步或后撤把伤害压下来。'
  },
  landStraight: {
    label: '直线打断推进',
    short: '直线',
    desc: '用直拳、逆突或刺拳在中线命中一次。'
  },
  recoverFromHit: {
    label: '被击中后恢复',
    short: '恢复',
    desc: '吃到伤害后仍能活过窗口，并把体力或架势拉回一点。'
  },
  useReforgedSkill: {
    label: '用一次重铸技能',
    short: '重铸',
    desc: '使用已经写回茂家拳谱的模块动作，而不是只靠旧招名。'
  },
  keepCalm: {
    label: '不被热度带走',
    short: '冷静',
    desc: '终战里保持基本冷静，不把胜负变成情绪失控。'
  }
};

const PARK_CHECK_OBJECTIVE_IDS = ['parkSurviveWindow1', 'parkGuardPressure', 'parkRetreatSpace', 'parkNoMoraleCollapse'];

const PARK_CHECK_OBJECTIVES = {
  parkSurviveWindow1: {
    label: '撑过第一个窗口',
    short: '第一窗',
    desc: '至少完成一个交换窗口，没有被第一波拳距压垮。'
  },
  parkGuardPressure: {
    label: '抱架降压一次',
    short: '抱架',
    desc: '用防守抱架接住一次拳距压力，把伤害或风险压下来。'
  },
  parkRetreatSpace: {
    label: '后撤拉开距离',
    short: '后撤',
    desc: '成功后撤一次，把不舒服的距离重新拉开。'
  },
  parkNoMoraleCollapse: {
    label: '士气没有崩盘',
    short: '士气',
    desc: '第一波之后心气还在，没有把验货打成情绪崩盘。'
  }
};

const COMBAT_OBJECTIVES = {
  ...FINAL_OBJECTIVES,
  ...PARK_CHECK_OBJECTIVES
};

const REFORGED_SKILLS = new Set([
  'jab',
  'straight',
  'guard',
  'palm',
  'offbalance',
  'sprawl',
  'escape',
  'dirtyescape',
  'talkdown',
  'sanda_whip_kick',
  'sanda_catch_throw',
  'karate_reverse_punch',
  'karate_front_kick',
  'tkd_roundhouse',
  'tkd_back_kick'
]);

function bounded(value, fallback = 0, min = 0, max = 100) {
  return clamp(value == null ? fallback : value, min, max);
}

function createDefaultMaw(existing = {}) {
  const source = existing && typeof existing === 'object' ? existing : {};
  const modules = Object.fromEntries(MAW_MODULE_KEYS.map((id) => [id, bounded(source.modules?.[id], 0)]));
  const forms = Object.fromEntries(Object.entries(MAW_FORMS).map(([id]) => {
    const old = source.forms?.[id] || {};
    const reforge = bounded(old.reforge ?? old.progress, 0);
    return [id, {
      reforge,
      unlockedNote: Boolean(old.unlockedNote || old.revealed || false)
    }];
  }));
  return {
    chapter: source.chapter || 'illusion',
    belief: bounded(source.belief, 75),
    misread: bounded(source.misread, 0),
    fatherMemory: bounded(source.fatherMemory, 0),
    reforge: bounded(source.reforge, 0),
    truthRevealed: Boolean(source.truthRevealed),
    firstWindDone: Boolean(source.firstWindDone),
    diaryRead: Boolean(source.diaryRead),
    forms,
    modules,
    objectives: { ...(source.objectives || {}) }
  };
}

function applyMawPatch(state, patch = {}) {
  if (!patch || typeof patch !== 'object') return;
  state.maw = createDefaultMaw(state.maw);
  Object.entries(patch).forEach(([key, value]) => {
    if (['belief', 'misread', 'fatherMemory', 'reforge'].includes(key)) {
      state.maw[key] = bounded((state.maw[key] || 0) + Number(value || 0), state.maw[key] || 0);
    } else if (key === 'chapter' && value) {
      state.maw.chapter = String(value);
    } else if (['truthRevealed', 'firstWindDone', 'diaryRead'].includes(key)) {
      state.maw[key] = Boolean(value);
    }
  });
}

function convertMisreadToFatherMemory(state) {
  state.maw = createDefaultMaw(state.maw);
  const converted = Math.round((state.maw.misread || 0) * 0.35);
  state.maw.fatherMemory = bounded((state.maw.fatherMemory || 0) + converted, 0);
  state.maw.misread = 0;
  return converted;
}

function applyMainlineMawEffects(state, main) {
  if (!main) return;
  applyMawPatch(state, main.maw || {});
  if (main.script === 'first_wind') {
    convertMisreadToFatherMemory(state);
    state.maw.chapter = 'broken';
    state.maw.firstWindDone = true;
    state.maw.belief = bounded(state.maw.belief - 55, 10, 10);
    state.player.auth = clamp((state.player.auth || 0) - 8, 0, 100);
    state.flags.needFatherDiary = true;
  }
  if (main.script === 'father_diary') {
    convertMisreadToFatherMemory(state);
    state.maw.chapter = 'reforge';
    state.maw.truthRevealed = true;
    state.maw.diaryRead = true;
    state.maw.fatherMemory = bounded((state.maw.fatherMemory || 0) + 25, 0);
    state.maw.belief = bounded((state.maw.belief || 0) + 5, 0);
    state.flags.needFatherDiary = false;
    state.flags.fatherDiaryRead = true;
  }
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
    styles: baseStyles(),
    relations: baseRelations({}, 5),
    inventory: { rice: 1, drink: 1 },
    equipment: { hand: null, foot: null, body: null, head: null, accessory: null },
    ownedZhus: [],
    log: [],
    eventLog: [],
    combatMemory: { fights: 0, wins: 0, losses: 0, riskWins: 0, lastEnemy: null, lastResult: null, lastTags: [], enemyNotes: {}, styleWins: {}, recent: [] },
    maw: createDefaultMaw(),
    unlocked: Object.fromEntries(INITIAL_SKILLS.filter((id) => SKILLS[id]).map((id) => [id, 1])),
    equipSkills: [...STARTER_EQUIP_SKILLS],
    skillState: {}
  };
  Object.keys(SKILLS).forEach((id) => {
    if (state.unlocked[id]) state.skillState[id] = { p: id === 'mystic' ? 5 : 16, use: 0, retrain: 0, zhus: [] };
  });
  updateMawProgress(state);
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
  s.styles = baseStyles(s.styles);
  s.relations = baseRelations(s.relations, 0);
  s.inventory ||= {};
  s.equipment = { hand: null, foot: null, body: null, head: null, accessory: null, ...(s.equipment || {}) };
  s.ownedZhus ||= [];
  s.log ||= [];
  s.eventLog ||= [];
  s.unlocked ||= {};
  s.equipSkills ||= [...STARTER_EQUIP_SKILLS];
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
  s.maw = createDefaultMaw(s.maw);
  updateMawProgress(s);
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

function timeDosageEligible(action) {
  if (!action || action.noDurationOptions) return false;
  if (action.type !== 'simple') return false;
  const text = `${action.id || ''} ${action.name || ''} ${action.desc || ''}`;
  if (action.minigame) return true;
  if (/(练|训练|观察|围观|复盘|步法|沙包|靶|拳|摔|打工|收银|搬|运料|杂工|贴海报|拉伸|短工)/.test(text)) return true;
  const gain = action.gain || {};
  return Boolean(gain.skill || gain.skill2 || gain.fitXp || gain.money || gain.jud || gain.str || gain.end || gain.spd || gain.bal || gain.tou);
}

function dosageOption(id) {
  return TIME_DOSAGE_OPTIONS[id] || TIME_DOSAGE_OPTIONS.standard;
}

function actionDosageOptions(action) {
  if (!timeDosageEligible(action)) return [];
  return Object.entries(TIME_DOSAGE_OPTIONS).map(([id, option]) => {
    const sp = Math.round(actionSpCost(action) * Number(option.spMultiplier || 1));
    const cost = Math.round(Number(action.cost || 0) * Number(option.costMultiplier || 1));
    return {
      id,
      ...option,
      sp,
      cost,
      gainPreview: gainParts(scaledGain(action.gain || {}, Number(option.multiplier || 1), option)),
      riskText: option.injuryRisk ? `小伤风险 ${Math.round(option.injuryRisk * 100)}%` : ''
    };
  });
}

function scaleNumericGain(key, value, multiplier, option = {}) {
  if (key === 'fatigue' && value > 0) return Math.max(1, Math.round(value * Number(option.fatigueMultiplier || multiplier)));
  if (key === 'fatigue' && value < 0) return Math.round(value * Math.min(1, Number(option.multiplier || multiplier)));
  if (key === 'sp' && value > 0) return Math.round(value * Math.min(1.15, Number(option.multiplier || multiplier)));
  return Math.round(value * multiplier);
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
    ...Object.fromEntries(Object.entries(STYLE_RULES).map(([id, rule]) => [id, rule.name]))
  };
  Object.entries(gain || {}).forEach(([key, value]) => {
    if (key === 'skill' || key === 'skill2' || key === 'xp' || key === 'xp2') return;
    if (key.startsWith('rel_')) {
      const relId = key.slice(4);
      parts.push(`${NPCS[relId]?.name || relId}关系 ${Number(value) > 0 ? '+' : ''}${value}`);
      return;
    }
    if (labels[key]) parts.push(`${labels[key]} ${Number(value) > 0 ? '+' : ''}${value}`);
  });
  if (gain.skill) parts.push(`${SKILLS[gain.skill]?.name || gain.skill}熟练 +${gain.xp || 5}`);
  if (gain.skill2) parts.push(`${SKILLS[gain.skill2]?.name || gain.skill2}熟练 +${gain.xp2 || 4}`);
  return parts;
}

function actionSummary(action, dosage = null) {
  if (!action) return { cost: [], gain: [], risk: '' };
  const option = typeof dosage === 'string' ? dosageOption(dosage) : dosage;
  const cost = [];
  const spCost = option ? Math.round(actionSpCost(action) * Number(option.spMultiplier || 1)) : actionSpCost(action);
  const moneyCost = option ? Math.round(Number(action.cost || 0) * Number(option.costMultiplier || 1)) : Number(action.cost || 0);
  const timeCost = option ? option.minutes : action.time;
  cost.push(timeCost ? `耗时 ${timeCost}分钟` : '耗时 即时');
  cost.push(spCost ? `体力 -${spCost}` : '体力 0');
  cost.push(moneyCost ? `现金 -￥${moneyCost}` : '现金 0');
  const gainSource = option ? scaledGain(action.gain || {}, Number(option.multiplier || 1), option) : action.gain;
  const gain = action.type === 'battle'
    ? [`对手：${ENEMIES[action.enemy]?.name || action.enemy}`, `胜利奖励：￥${ENEMIES[action.enemy]?.reward?.money || 0} / 名声+${ENEMIES[action.enemy]?.reward?.fame || 0}`]
    : gainParts(gainSource);
  if (!gain.length) gain.push(action.type === 'dialog' ? '收益：关系/线索' : '收益：状态推进');
  const risk = option?.injuryRisk
    ? `风险 疲劳/小伤 ${Math.round(option.injuryRisk * 100)}%`
    : action.type === 'battle'
    ? `风险 战斗 ${action.risk || ENEMIES[action.enemy]?.risk || '中'}`
    : action.risk ? `风险 事件 ${action.risk}` : '风险 低';
  return { cost, gain, risk };
}

function actionSourceLabel(locId, actionId, fallbackAction = null) {
  const locName = LOCS[locId]?.name || locId || LOCS.home.name;
  const action = (ACTIONS[locId] || []).find((item) => item.id === actionId) || fallbackAction;
  return `${locName} · ${action?.name || actionId || '行动'}`;
}

function skillUnlocksModel(state) {
  return Object.fromEntries(Object.entries(SKILL_UNLOCKS).map(([id, unlock]) => {
    const skillId = unlock.skillId || id;
    const locId = unlock.locationId;
    const action = (ACTIONS[locId] || []).find((item) => item.id === unlock.actionId) || null;
    const locked = locId ? !isLocationUnlocked(state, locId) : false;
    const closed = locId && locId !== 'home' && locId !== 'store' ? !inOpen(state, locId) : false;
    return [skillId, {
      id,
      skillId,
      source: unlock.source || (unlock.initial ? 'initial' : 'action'),
      initial: Boolean(unlock.initial),
      planned: Boolean(unlock.planned),
      skillName: SKILLS[skillId]?.name || skillId,
      skillIcon: SKILLS[skillId]?.icon || '',
      locationId: locId,
      locationName: LOCS[locId]?.name || locId || '',
      actionId: unlock.actionId,
      actionName: action?.name || unlock.actionId,
      openCondition: unlock.openCondition,
      unlockText: unlock.unlockText,
      sourceSummary: unlock.sourceSummary || actionSourceLabel(locId, unlock.actionId, action),
      learned: Boolean(state.skillState?.[skillId]),
      locked,
      lockReason: locked ? locationLockReason(state, locId) : '',
      availableHere: Boolean(locId && state.loc === locId && !locked && !closed)
    }];
  }));
}

function skillIdsFromGain(gain = {}) {
  return [...new Set([gain.skill, gain.skill2].filter(Boolean))];
}

function skillUnlockSettlementLines(beforeSkillState = {}, state, action, gain = action?.gain || {}) {
  return skillIdsFromGain(gain)
    .filter((id) => !beforeSkillState[id] && state.skillState?.[id])
    .map((id) => {
      const unlock = SKILL_UNLOCKS[id] || {};
      const source = unlock.sourceSummary || actionSourceLabel(unlock.locationId || state.loc, unlock.actionId || action?.id, action);
      return {
        group: 'skills',
        key: id,
        label: '学会',
        delta: 1,
        tone: 'good',
        text: `学会：${SKILLS[id]?.name || id} / 来源：${source}`
      };
    });
}

function applyStoryFlags(state, flags = {}) {
  if (Array.isArray(flags)) {
    flags.forEach((flag) => {
      if (flag) state.flags[flag] = true;
    });
    return;
  }
  Object.entries(flags || {}).forEach(([key, value]) => {
    state.flags[key] = value === undefined ? true : value;
  });
}

function fatherDiaryModal(state, lines = []) {
  return {
    type: 'fatherDiary',
    title: FATHER_DIARY.title,
    body: FATHER_DIARY.subtitle,
    entries: FATHER_DIARY.entries,
    closing: FATHER_DIARY.closing,
    read: Boolean(state.maw?.diaryRead),
    lines
  };
}

function npcIdBySpeaker(speaker) {
  if (!speaker) return '';
  return Object.entries(NPCS).find(([, npc]) => npc.name === speaker || npc.icon === speaker)?.[0] || '';
}

function dialogueAssetFor(npcId) {
  return NPC_SCENE_ASSETS[npcId]?.assetKey || ({
    fatty: 'portrait.fatty',
    coach: 'portrait.coach',
    master: 'portrait.master',
    xiaoman: 'portrait.xiaoman',
    chen: 'portrait.chen'
  }[npcId] || '');
}

function normalizeDialogueLine(entry, fallback = {}) {
  const raw = typeof entry === 'string' ? { text: entry } : (entry || {});
  const npcId = raw.npc || fallback.npc || npcIdBySpeaker(raw.speaker);
  const npc = NPCS[npcId] || {};
  return {
    speaker: raw.speaker || npc.name || fallback.speaker || fallback.title || '对话',
    role: raw.role || fallback.role || '',
    icon: raw.icon || npc.icon || fallback.icon || '',
    assetKey: raw.assetKey || dialogueAssetFor(npcId),
    text: raw.text || raw.body || ''
  };
}

function bodyToDialogueLines(body, fallback = {}) {
  return String(body || '')
    .split('\n')
    .filter(Boolean)
    .map((text) => normalizeDialogueLine({ text }, fallback));
}

function storyChoiceItems(main) {
  return (main.choices || []).map((choice, index) => ({
    id: choice.id || `choice_${index + 1}`,
    label: choice.label || choice.title || `选择${index + 1}`,
    text: choice.text || choice.desc || '',
    hint: choice.hint || '',
    danger: choice.enemy ? `战斗：${ENEMIES[choice.enemy]?.name || choice.enemy}` : '',
    gainPreview: gainParts(choice.gain || {}),
    locName: choice.loc ? LOCS[choice.loc]?.name || choice.loc : '',
    enemyName: choice.enemy ? ENEMIES[choice.enemy]?.name || choice.enemy : ''
  }));
}

function dialogueModal({ title, npc, body = '', lines = null, choices = [], settlementLines = [], onComplete = null, actionLabel = '知道了' }) {
  const fallback = {
    title,
    npc,
    speaker: NPCS[npc]?.name || title,
    icon: NPCS[npc]?.icon || ''
  };
  const dialogueLines = (Array.isArray(lines) && lines.length ? lines.map((line) => normalizeDialogueLine(line, fallback)) : bodyToDialogueLines(body, fallback))
    .filter((line) => line.text);
  return {
    type: 'dialogue',
    title,
    npc,
    body,
    lines: dialogueLines.length ? dialogueLines : [normalizeDialogueLine({ text: body || title || '...' }, fallback)],
    index: 0,
    choices,
    settlementLines,
    onComplete,
    actionLabel
  };
}

function storyChoiceModal(state, main) {
  return dialogueModal({
    title: main.title,
    npc: main.npc,
    body: main.desc,
    lines: main.dialogue || [{ speaker: main.title, text: main.desc }],
    choices: storyChoiceItems(main)
  });
}

function npcDialogueModal(npcId, settlement = []) {
  const npc = NPCS[npcId] || {};
  return dialogueModal({
    title: npc.name || '对话',
    npc: npcId,
    body: npcLine(npcId),
    lines: NPC_DIALOGUES[npcId],
    settlementLines: settlement,
    actionLabel: '记下'
  });
}

function actionById(actionId) {
  return Object.values(ACTIONS).flat().find((item) => item.id === actionId) || null;
}

function textList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function notebookData(item = {}) {
  return item.notebook || item.scene || item.eventNotebook || {};
}

function riskText(item = {}) {
  const raw = item.riskLabel ?? item.risk ?? ENEMIES[item.enemy]?.risk ?? (item.enemy ? '中' : '低');
  return `风险 ${raw}`;
}

function eventKind(item = {}, action = null) {
  if (item.enemy || action?.type === 'battle') return 'battle';
  if (item.shop || action?.type === 'shop') return 'shop';
  if (item.npc || action?.type === 'dialog') return 'dialogue';
  if (item.action || action) return 'action';
  return item.kind || 'event';
}

function eventActionLabel(kind) {
  return {
    battle: '进场处理',
    shop: '去处理',
    dialogue: '坐下来听',
    action: '照这个线索办'
  }[kind] || '处理这件事';
}

function eventActionText(kind, title = '') {
  return {
    battle: '先把距离、出口和对方手里的东西看清楚，再决定怎么接这一局。',
    shop: '把需要的东西补齐，不把冲动消费当成训练计划。',
    dialogue: '先听对方把话说完，真正有用的信息通常藏在停顿里。',
    action: '按现场情况把事情做完，别让它只变成一行结算数字。'
  }[kind] || `把${title || '这件事'}处理到有结果为止。`;
}

function generatedEventBeats(state, item = {}, kind = 'event', locName = '当前地点') {
  const title = item.title || item.name || '这件事';
  const desc = item.desc || '';
  const beats = [
    `你到了${locName}，先确认人、出口和距离。`,
    desc,
    kind === 'battle'
      ? '对面不是一行敌人数据，先读姿态、手上东西和能不能撤。'
      : kind === 'dialogue'
        ? '你把话头放慢，等对方露出真正想说的那一段。'
        : kind === 'shop'
          ? '你把价格、用处和今天的训练计划对了一遍。'
          : `你决定把“${title}”当成一件真实发生的事处理完。`
  ];
  return beats.filter(Boolean);
}

function eventNotebookModal(state, item = {}, options = {}) {
  const action = options.actionId ? actionById(options.actionId) : (item.action ? actionById(item.action) : null);
  const note = notebookData(item);
  const kind = eventKind(item, action);
  const locId = item.loc || action?.loc || state.loc;
  const locName = LOCS[locId]?.name || locId || '当前地点';
  const title = item.title || item.name || action?.name || '现场事件';
  const beats = textList(note.beats || item.beats);
  const summary = action ? actionSummary(action) : {
    cost: [],
    gain: [
      item.enemy ? `可能进入战斗：${ENEMIES[item.enemy]?.name || item.enemy}` : '',
      item.reason || '',
      ...(item.tags || [])
    ].filter(Boolean),
    risk: riskText(item)
  };
  return {
    type: 'eventNotebook',
    source: options.source || 'event',
    id: item.id || action?.id || '',
    actionId: options.actionId || item.action || action?.id || '',
    title,
    kicker: options.source === 'opportunity' ? '待办现场' : '行动现场',
    locId,
    locName,
    risk: riskText(item.enemy || item.risk || item.riskLabel ? item : action || {}),
    reason: item.reason || note.reason || '',
    body: note.entry || note.body || item.desc || action?.desc || '',
    beats: beats.length ? beats : generatedEventBeats(state, item.desc ? item : action || item, kind, locName),
    summary,
    result: note.result || note.outcome || '',
    card: options.source === 'opportunity' ? item : null,
    choices: [{
      id: 'resolve',
      label: note.actionLabel || eventActionLabel(kind),
      text: note.actionText || eventActionText(kind, title),
      kind
    }]
  };
}

function shouldOpenActionNotebook(action = {}) {
  if (!action || action.minigame || action.type === 'sleep' || action.type === 'shop') return false;
  return action.type === 'battle' || action.type === 'dialog' || Boolean(action.risk);
}

function completeDialogue(state) {
  const modal = state.ui.modal;
  if (!modal || modal.type !== 'dialogue') {
    state.ui.modal = null;
    return;
  }
  if (modal.onComplete?.type === 'fatherDiary') {
    state.ui.modal = fatherDiaryModal(state, modal.onComplete.lines || modal.settlementLines || []);
    return;
  }
  state.ui.modal = null;
}

function resolveStoryChoice(state, choiceId) {
  const main = MAIN_EVENTS[state.day];
  const choice = main?.choices?.find((item, index) => (item.id || `choice_${index + 1}`) === choiceId);
  if (!main?.choices?.length || !choice || state.flags[`main_${state.day}`]) {
    state.ui.toast = '这个主线选择已经过期';
    state.ui.modal = null;
    return;
  }
  const before = snapshotState(state);
  if (choice.gain) applyGain(state, choice.gain);
  applyStoryFlags(state, choice.flags || {});
  applyMainlineMawEffects(state, {
    ...main,
    script: choice.script || main.script,
    maw: { ...(main.maw || {}), ...(choice.maw || {}) }
  });
  if (choice.loc && LOCS[choice.loc]) state.loc = choice.loc;
  state.flags[`main_${state.day}`] = true;
  state.daily.mainDone = true;
  addLog(state, choice.log || `主线选择：${choice.label || main.title}`);
  const enemyId = choice.enemy || null;
  if (enemyId) {
    startBattle(state, enemyId, true, { script: choice.script || main.script, objectives: choice.objectives || main.objectives });
    return;
  }
  state.ui.modal = dialogueModal({
    title: choice.resultTitle || choice.label || main.title,
    npc: choice.npc || main.npc,
    body: choice.result || choice.text || main.desc,
    lines: choice.dialogue || [{ speaker: '陆小闲', text: choice.result || choice.text || main.desc }],
    settlementLines: settlementLines(before, snapshotState(state)),
    actionLabel: '收住'
  });
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

function scaledGain(gain = {}, multiplier = 1, option = {}) {
  const out = {};
  Object.entries(gain || {}).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      out[key] = value;
      return;
    }
    out[key] = scaleNumericGain(key, value, multiplier, option);
  });
  return out;
}

function advanceTime(state, minutes) {
  state.time += minutes;
  state.daily.actions += 1;
  if (state.time >= 1500) sleep(state, true);
}

function actionRoll(state, salt = 0) {
  const seed = (Number(state.seed || 1) + state.day * 977 + state.time * 37 + Number(state.daily?.actions || 0) * 101 + salt) >>> 0;
  return ((seed * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function addMinorInjury(state, label = '硬练拉伤') {
  state.player.injuries ||= [];
  state.player.injuries.push({ name: label, turn: 2, desc: '硬顶强度留下的小伤，睡眠和理疗能慢慢压下去。' });
}

function maybeIdleEvent(state) {
  if (!IDLE_EVENTS.length) return null;
  if (actionRoll(state, 17) > 0.35) return null;
  const event = IDLE_EVENTS[Math.floor(actionRoll(state, 31) * IDLE_EVENTS.length)] || IDLE_EVENTS[0];
  if (event.gain) applyGain(state, event.gain);
  if (event.maw) applyMawPatch(state, event.maw);
  return event;
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
  const sleptIdle = state.loc === 'home' && Number(state.daily?.actions || 0) <= 0;
  state.day += 1;
  state.time = 420;
  state.loc = 'home';
  state.daily = {
    talked: {},
    actions: 0,
    mainDone: false,
    sideSeed: state.day,
    idleSleepStreak: sleptIdle ? Number(state.daily?.idleSleepStreak || 0) + 1 : 0
  };
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

function mawReforgeScore(state) {
  const forms = Object.values(state.maw?.forms || {});
  if (!forms.length) return 0;
  return forms.reduce((sum, form) => sum + Number(form?.reforge || 0), 0) / forms.length;
}

export function isLocationUnlocked(state, locId) {
  if (!LOCS[locId]) return false;
  const rule = LOC_UNLOCKS[locId];
  if (!rule) return true;
  if (rule.default) return true;
  if (rule.flag && state.flags?.[rule.flag]) return true;
  if (rule.day && Number(state.day || 1) >= rule.day) return true;
  if (rule.minReforge && mawReforgeScore(state) >= rule.minReforge) return true;
  return false;
}

export function locationUnlockHint(locId) {
  const rule = LOC_UNLOCKS[locId];
  if (!rule) return '';
  if (rule.hint) return rule.hint;
  if (rule.day) return `Day ${rule.day} 开放。`;
  if (rule.minReforge) return `茂拳重铸 ${rule.minReforge}% 后开放。`;
  return '';
}

export function locationLockReason(state, locId) {
  if (!LOCS[locId]) return '地点尚未接入。';
  if (isLocationUnlocked(state, locId)) return '';
  const rule = LOC_UNLOCKS[locId] || {};
  return rule.reason || locationUnlockHint(locId) || '线索还不成熟。';
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

export function updateMawProgress(state) {
  if (!state || typeof state !== 'object') return null;
  state.maw = createDefaultMaw(state.maw);
  const p = state.player || {};
  const stats = p.stats || {};
  const skillP = (id) => Number(state.skillState?.[id]?.p || 0);
  const relation = (id) => Number(state.relations?.[id] || 0);
  const style = (id) => Number(state.styles?.[id] || 0);
  const fitLevel = Math.floor(Math.max(0, Number(p.fitXp || 0)) / 20);
  const memory = state.combatMemory || {};

  const modules = {
    boxing: clamp(skillP('jab') * 0.25 + skillP('straight') * 0.35 + style('boxing') * 0.25 + style('sanda') * 0.15 + relation('coach') * 2 + relation('coach_luo') * 1.5, 0, 100),
    body: clamp((Number(stats.tou || 40) - 40) * 1.0 + (Number(stats.bal || 40) - 40) * 0.8 + fitLevel * 4 + skillP('guard') * 0.25 + skillP('dodge') * 0.15 + style('karate') * 0.1 + style('taekwondo') * 0.1, 0, 100),
    traditional: clamp(skillP('palm') * 0.25 + skillP('offbalance') * 0.25 + style('traditional') * 0.25 + style('karate') * 0.15 + Number(p.auth || 0) * 0.15 + relation('master') * 2 + relation('oldman') * 1.5, 0, 100),
    grappling: clamp(skillP('sprawl') * 0.3 + skillP('escape') * 0.25 + skillP('grip') * 0.15 + skillP('takedown') * 0.15 + style('mma') * 0.25 + style('sanda') * 0.2, 0, 100),
    street: clamp(skillP('talkdown') * 0.25 + skillP('dirtyescape') * 0.25 + (Number(stats.jud || 35) - 35) * 1.1 + style('street') * 0.25 + style('taekwondo') * 0.15 + Number(memory.riskWins || 0) * 8, 0, 100)
  };

  state.maw.modules = modules;
  state.maw.reforge = Math.round(
    modules.boxing * 0.30 +
    modules.body * 0.20 +
    modules.traditional * 0.20 +
    modules.grappling * 0.20 +
    modules.street * 0.10
  );
  Object.entries(MAW_FORMS).forEach(([id, form]) => {
    const formState = state.maw.forms[id] || { reforge: 0, unlockedNote: false };
    const moduleValue = modules[form.module] || 0;
    const skillValue = skillP(form.skill);
    const formProgress = Math.round(clamp(moduleValue * 0.7 + skillValue * 0.3, 0, 100));
    state.maw.forms[id] = {
      ...formState,
      reforge: formProgress,
      unlockedNote: Boolean(formState.unlockedNote || state.maw.truthRevealed || formProgress >= 70)
    };
  });
  return state.maw;
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

function eventSettlementBody(action, context = null) {
  const note = notebookData(action);
  if (context?.result) return context.result;
  if (note.result || note.outcome) return note.result || note.outcome;
  if (context?.type === 'eventNotebook') {
    return `你把${context.title || action?.name || '这件事'}处理到有结果。真正留下来的不只是数值变化，还有你刚才怎么判断、怎么动手、怎么收尾。`;
  }
  return '';
}

function settlementText(line) {
  if (!line || typeof line !== 'object') return String(line || '');
  return line.text || [line.label, line.delta ? `${Number(line.delta) > 0 ? '+' : ''}${line.delta}` : ''].filter(Boolean).join(' ');
}

function resultLead(title = '行动', body = '', lines = []) {
  const firstBodyLine = textList(body)[0];
  if (firstBodyLine) return firstBodyLine;
  const firstChange = lines.map(settlementText).find(Boolean);
  if (firstChange) return `${title}完成了，最明显的变化是：${firstChange}`;
  return `${title}已经处理完，可以决定下一步。`;
}

function resultActions(state, recommendLoc = '') {
  const actions = [
    { label: '继续行动', action: 'closeModal', className: 'primary' },
    { label: '查看日志', action: 'setTab', params: { tab: 'log' }, className: 'ghost' }
  ];
  if (recommendLoc && LOCS[recommendLoc] && recommendLoc !== state.loc && isLocationUnlocked(state, recommendLoc)) {
    actions.push({
      label: `去${LOCS[recommendLoc].name}`,
      action: 'openTravel',
      params: { loc: recommendLoc },
      className: 'dark'
    });
  }
  return actions;
}

function resultFeedbackModal(state, { title = '行动', body = '', lines = [], summary = null, logText = '', recommendLoc = '' } = {}) {
  return {
    type: 'settlement',
    title: '结果',
    kicker: title,
    body,
    lead: resultLead(title, body, lines),
    cost: summary?.cost || [],
    gain: summary?.gain || [],
    risk: summary?.risk || '',
    lines,
    logText: logText || state.log?.[0]?.text || '',
    actions: resultActions(state, recommendLoc)
  };
}

function actionResultModal(state, action, lines, options = {}) {
  const context = options.eventContext || {};
  const dosage = options.dosage ? dosageOption(options.dosage) : null;
  const dosageLine = dosage ? `投入：${dosage.name}。${dosage.note}` : '';
  return resultFeedbackModal(state, {
    title: context.title || action?.name || '行动',
    body: [dosageLine, eventSettlementBody(action, context)].filter(Boolean).join('\n'),
    lines,
    summary: actionSummary(action, dosage),
    logText: state.log?.[0]?.text || '',
    recommendLoc: context.locId || action?.loc || ''
  });
}

function executeAction(state, action, options = {}) {
  const allowNotebook = options.allowNotebook !== false;
  if (!action) {
    state.ui.toast = '行动不存在';
    return;
  }
  const dosageId = options.dosageId || null;
  const dosage = dosageId ? dosageOption(dosageId) : null;
  const spCost = dosage ? Math.round(actionSpCost(action) * Number(dosage.spMultiplier || 1)) : actionSpCost(action);
  const moneyCost = dosage ? Math.round(Number(action.cost || 0) * Number(dosage.costMultiplier || 1)) : Number(action.cost || 0);
  if (allowNotebook && !dosageId && actionDosageOptions(action).length) {
    state.ui.modal = { type: 'durationChoice', actionId: action.id, title: action.name, desc: action.desc, options: actionDosageOptions(action), summary: actionSummary(action) };
    return;
  }
  if (spCost > state.player.sp) {
    state.ui.toast = '体力不足';
    return;
  }
  if (moneyCost > state.player.money) {
    state.ui.toast = '钱不够';
    return;
  }
  if (allowNotebook && shouldOpenActionNotebook(action)) {
    state.ui.modal = eventNotebookModal(state, action, { source: 'action', actionId: action.id });
    return;
  }
  if (action.type === 'sleep') {
    sleep(state);
    return;
  }
  if (action.type === 'shop') {
    state.ui.tab = 'shop';
    return;
  }
  if (action.minigame) {
    startTrainingMini(state, action, dosageId);
    return;
  }

  const before = snapshotState(state);
  state.player.sp -= spCost;
  if (moneyCost) state.player.money -= moneyCost;
  advanceTime(state, dosage ? dosage.minutes : (action.time || 30));
  if (action.type === 'battle') {
    addLog(state, `进入事件：${options.eventContext?.title || action.name}`);
    startBattle(state, action.enemy);
  } else if (action.type === 'dialog') {
    state.relations[action.npc] = (state.relations[action.npc] || 0) + 1;
    state.player.calm = clamp(state.player.calm + 2, 0, 100);
    state.ui.modal = npcDialogueModal(action.npc, settlementLines(before, snapshotState(state)));
    addLog(state, `${NPCS[action.npc]?.name || '有人'}给了你一段建议。`);
  } else {
    const beforeSkillState = clone(state.skillState || {});
    const gain = dosage ? scaledGain(action.gain || {}, Number(dosage.multiplier || 1), dosage) : (action.gain || {});
    applyGain(state, gain);
    const idleEvent = action.type === 'idle' ? maybeIdleEvent(state) : null;
    if (dosage?.injuryRisk && actionRoll(state, 59) < dosage.injuryRisk) {
      addMinorInjury(state);
      state.player.fatigue = clamp((state.player.fatigue || 0) + 4, 0, 100);
    }
    const lines = settlementLines(before, snapshotState(state)).concat(skillUnlockSettlementLines(beforeSkillState, state, action));
    addLog(state, `完成行动：${action.name}${dosage ? ` · ${dosage.name}` : ''}`);
    const idleBody = idleEvent ? `${idleEvent.title}：${idleEvent.text}` : '';
    state.ui.modal = actionResultModal(state, action, lines, { ...options, dosage: dosageId, eventContext: { ...(options.eventContext || {}), result: [options.eventContext?.result, idleBody].filter(Boolean).join('\n') } });
  }
}

function markOpportunityCooldown(state, card = {}) {
  const key = card.cooldownKey || card.id;
  if (!key) return;
  state.daily ||= { talked: {}, actions: 0, mainDone: false, sideSeed: state.day || 1 };
  state.daily.opportunityCooldowns ||= {};
  state.daily.opportunityCooldowns[key] = true;
}

function resolveEventNotebook(state) {
  const modal = state.ui.modal;
  if (!modal || modal.type !== 'eventNotebook') {
    state.ui.modal = null;
    return;
  }

  if (modal.source === 'action') {
    const action = findAction(state, modal.actionId) || actionById(modal.actionId);
    executeAction(state, action, { allowNotebook: false, eventContext: modal });
    return;
  }

  const card = buildOpportunities(state).find((item) => item.id === modal.id) || modal.card;
  if (!card) {
    state.ui.toast = '这个待办已经过期';
    state.ui.modal = null;
    return;
  }

  if (card.enemy) {
    markOpportunityCooldown(state, card);
    addLog(state, `进入事件：${card.title}`);
    startBattle(state, card.enemy);
  } else if (card.shop) {
    markOpportunityCooldown(state, card);
    state.ui.tab = 'shop';
    addLog(state, `处理待办：${card.title}`);
    state.ui.modal = resultFeedbackModal(state, {
      title: card.title || '待办',
      body: card.result || '你把这件待办处理到可以继续采购和整理装备。',
      lines: [],
      summary: { cost: [], gain: ['商店已打开'], risk: riskText(card) },
      logText: state.log?.[0]?.text || ''
    });
  } else if (card.action) {
    markOpportunityCooldown(state, card);
    const action = findAction(state, card.action) || actionById(card.action);
    executeAction(state, action, { allowNotebook: false, eventContext: modal });
  } else {
    markOpportunityCooldown(state, card);
    if (card.npc) state.relations[card.npc] = (state.relations[card.npc] || 0) + 1;
    state.ui.modal = dialogueModal({
      title: card.title,
      npc: card.npc,
      body: card.desc,
      lines: card.dialogue || [{ speaker: card.title, text: card.desc }],
      actionLabel: '记下'
    });
    addLog(state, `处理待办：${card.title}`);
  }
}

function fallbackTrainingRounds(action) {
  if (action.minigame?.template === 'pacing' || action.minigame?.template === 'judgement') {
    return [
      {
        cue: '身体还能继续，但动作质量开始变窄。',
        options: [
          { id: 'pace_clean', label: '降速保质量', text: '先把动作做干净。', score: 2, feedback: '训练留在可控区间，收益更扎实。' },
          { id: 'pace_plan', label: '按计划完成', text: '节奏稳定，不额外加码。', score: 1, feedback: '这一组稳住了，刺激按计划结算。' },
          { id: 'pace_force', label: '硬顶加量', text: '不管呼吸，先冲完再说。', score: 0, feedback: '强度上去了，动作质量也掉下来了。' }
        ]
      }
    ];
  }
  return [
    {
      cue: action.minigame?.prompt || action.desc || '训练开始。',
      options: [
        { id: 'combo_clean', label: '稳住动作链', text: '先让起手、发力和回收连起来。', score: 2, feedback: '动作链完整，能带进实战。' },
        { id: 'combo_plan', label: '按节奏完成', text: '不抢拍，也不额外变招。', score: 1, feedback: '稳定完成，训练收益按计划落账。' },
        { id: 'combo_force', label: '抢节奏猛做', text: '声音和速度都有，细节不太在。', score: 0, feedback: '动静很大，训练质量一般。' }
      ]
    }
  ];
}

function normalizeTrainingRounds(action) {
  const raw = Array.isArray(action.minigame?.rounds) && action.minigame.rounds.length
    ? action.minigame.rounds
    : fallbackTrainingRounds(action);
  return raw.map((round, roundIndex) => ({
    cue: round.cue || `第 ${roundIndex + 1} 轮`,
    options: (Array.isArray(round.options) ? round.options : []).map((option, optionIndex) => ({
      id: option.id || `round_${roundIndex}_option_${optionIndex}`,
      label: option.label || '稳妥处理',
      text: option.text || '',
      score: clamp(Number(option.score), 0, 2),
      feedback: option.feedback || option.text || ''
    }))
  })).filter((round) => round.options.length);
}

function trainingMaxScore(rounds) {
  return rounds.reduce((sum, round) => {
    const best = Math.max(...(round.options || []).map((option) => Number(option.score) || 0), 0);
    return sum + best;
  }, 0);
}

function trainingGradeFromScore(score, maxScore) {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (ratio >= 0.8) return 'sharp';
  if (ratio >= 0.5) return 'solid';
  return 'poor';
}

function trainingResultBody(grade, result = {}) {
  if (!result.maxScore) return grade.note;
  const scoreText = `表现 ${result.score}/${result.maxScore}`;
  return [grade.note, scoreText, result.finalFeedback].filter(Boolean).join('。');
}

function startTrainingMini(state, action, dosageId = null) {
  const template = action.minigame?.template || 'combo';
  const rounds = normalizeTrainingRounds(action);
  const maxScore = trainingMaxScore(rounds);
  const dosage = dosageId ? dosageOption(dosageId) : null;
  state.ui.modal = {
    type: 'trainingMini',
    actionId: action.id,
    dosageId,
    title: action.name,
    template,
    templateLabel: TRAINING_TEMPLATE_LABELS[template] || '训练',
    prompt: [dosage ? `${dosage.name}：${dosage.note}` : '', action.minigame?.prompt || action.desc].filter(Boolean).join('\n'),
    summary: actionSummary(action, dosage),
    rounds,
    roundIndex: 0,
    score: 0,
    maxScore,
    feedback: null,
    history: []
  };
}

function answerTrainingMini(state, optionId) {
  const modal = state.ui.modal;
  if (!modal || modal.type !== 'trainingMini') {
    state.ui.toast = '训练已经结束';
    return;
  }
  const rounds = Array.isArray(modal.rounds) ? modal.rounds : [];
  const roundIndex = Math.floor(clamp(modal.roundIndex || 0, 0, Math.max(0, rounds.length - 1)));
  const round = rounds[roundIndex];
  const option = (round?.options || []).find((item) => item.id === optionId);
  if (!round || !option) {
    state.ui.toast = '训练选项不存在';
    return;
  }

  const score = clamp(Number(option.score), 0, 2);
  const nextScore = (Number(modal.score) || 0) + score;
  const feedback = { label: option.label, text: option.feedback || option.text || '', score };
  const history = [
    ...(Array.isArray(modal.history) ? modal.history : []),
    { cue: round.cue, label: option.label, score, feedback: feedback.text }
  ];

  if (roundIndex >= rounds.length - 1) {
    const gradeId = trainingGradeFromScore(nextScore, modal.maxScore || trainingMaxScore(rounds));
    finishTrainingMini(state, gradeId, {
      score: nextScore,
      maxScore: modal.maxScore || trainingMaxScore(rounds),
      finalFeedback: feedback.text,
      history
    });
    return;
  }

  state.ui.modal = {
    ...modal,
    roundIndex: roundIndex + 1,
    score: nextScore,
    feedback,
    history
  };
}

function finishTrainingMini(state, gradeId, result = {}) {
  const modal = state.ui.modal;
  const action = Object.values(ACTIONS).flat().find((item) => item.id === modal?.actionId);
  const grade = TRAINING_GRADES[gradeId] || TRAINING_GRADES.solid;
  if (!action) {
    state.ui.toast = '训练项目不存在';
    state.ui.modal = null;
    return;
  }
  const dosage = modal?.dosageId ? dosageOption(modal.dosageId) : null;
  const spCost = dosage ? Math.round(actionSpCost(action) * Number(dosage.spMultiplier || 1)) : actionSpCost(action);
  const moneyCost = dosage ? Math.round(Number(action.cost || 0) * Number(dosage.costMultiplier || 1)) : Number(action.cost || 0);
  if (spCost > state.player.sp) {
    state.ui.toast = '体力不足';
    state.ui.modal = null;
    return;
  }
  if (moneyCost > state.player.money) {
    state.ui.toast = '钱不够';
    state.ui.modal = null;
    return;
  }
  const before = snapshotState(state);
  const beforeSkillState = clone(state.skillState || {});
  const durationMultiplier = dosage ? Number(dosage.multiplier || 1) : 1;
  const gain = scaledGain(action.gain || {}, grade.multiplier * durationMultiplier, dosage || {});
  state.player.sp -= spCost;
  if (moneyCost) state.player.money -= moneyCost;
  advanceTime(state, dosage ? dosage.minutes : (action.time || 30));
  applyGain(state, gain);
  if (dosage?.injuryRisk && actionRoll(state, 71) < dosage.injuryRisk) {
    addMinorInjury(state);
    state.player.fatigue = clamp((state.player.fatigue || 0) + 4, 0, 100);
  }
  const lines = settlementLines(before, snapshotState(state)).concat(skillUnlockSettlementLines(beforeSkillState, state, action, gain));
  addLog(state, `完成训练小游戏：${action.name} · ${grade.label}${dosage ? ` · ${dosage.name}` : ''}`);
  state.ui.modal = {
    type: 'settlement',
    title: `${action.name} · ${grade.label}`,
    body: [dosage ? `投入：${dosage.name}。${dosage.note}` : '', trainingResultBody(grade, result)].filter(Boolean).join('\n'),
    lines
  };
}

function startBattle(state, enemyId, main = false, meta = {}) {
  const def = ENEMIES[enemyId] || ENEMIES.E01;
  const dailySpBefore = state.player.sp;
  const battleSp = clamp(Math.max(state.player.sp, Math.round(state.player.spMax * 0.72)), 30, state.player.spMax);
  const objectives = Array.isArray(meta.objectives) ? [...meta.objectives] : (main && state.day === 5 && enemyId === 'E01' ? [...PARK_CHECK_OBJECTIVE_IDS] : []);
  state.player.sp = battleSp;
  state.ui.modal = null;
  state.ui.selectedTravel = null;
  state.ui.cityMapOpen = false;
  state.ui.toast = null;
  const scale = 1 + Math.max(0, state.day - 1) * 0.014;
  state.combat = {
    enemyId,
    main,
    script: meta.script || def.script || null,
    objectiveSet: main && state.day === 5 && enemyId === 'E01' ? 'park_check' : (objectives.length ? 'final' : null),
    objectivePassCount: main && state.day === 5 && enemyId === 'E01' ? 2 : null,
    objectives,
    objectiveProgress: Object.fromEntries(objectives.map((id) => [id, Boolean(state.maw?.objectives?.[id])])),
    objectiveNotes: [],
    dailySpBefore,
    round: 1,
    exchange: 1,
    distance: def.preferredRange === 'far' ? 'far' : 'mid',
    ground: 'none',
    target: 'body',
    phase: 'planning',
    clock: 0,
    playerQueue: [],
    planMode: DEFAULT_COMBAT_PLAN_MODE,
    planSlot: null,
    comboSlot: null,
    lastPlanFill: null,
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
  const windowActions = previousCombat.playerQueue?.length ? previousCombat.playerQueue : previousCombat.selected || [];
  const windowDuration = estimateCombatWindowDuration(windowActions, sequencedSteps, previousCombat.enemyTell);
  const windowPressure = combatPressureLabel(sequencedSteps);
  const counterFeedback = combatCounterFeedback(windowActions, previousCombat.enemyTell);
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
    lastPlanFill: previousCombat.lastPlanFill || null,
    phase: 'planning',
    clock: Number(previousCombat.clock || 0) + windowDuration,
    enemyCooldown: windowPressure.level,
    eventSeq: baseSeq + sequencedSteps.length,
    windowCount: Number(previousCombat.windowCount || 0) + 1,
    lastWindow: {
      duration: windowDuration,
      actions: windowActions,
      stepCount: sequencedSteps.length,
      pressure: windowPressure.label,
      feedback: counterFeedback
    },
    steps: sequencedSteps
  };
  updateCombatObjectives(state, previousCombat, state.combat, sequencedSteps);
}

function combatCounterFeedback(actions = [], tell = null) {
  if (!tell) return null;
  const counters = counterSkillsForPlan(tell);
  const matched = actions.filter((id) => counters.includes(id));
  const activeActions = actions.filter((id) => id && id !== 'guard');
  if (matched.length) {
    const names = matched.map((id) => SKILLS[id]?.name || id).join('、');
    return { tone: 'good', text: `反制到位：${names} 对上「${tell.label}」，这一拍风险被压住了。` };
  }
  if (!activeActions.length) {
    return { tone: 'neutral', text: `你选择抱架观察，先把「${tell.label}」看清楚。` };
  }
  if (tell.danger === '高') {
    return { tone: 'bad', text: `读板没接上：「${tell.label}」还是高危窗口，下一拍别硬吃。` };
  }
  return { tone: 'neutral', text: `读板未完全对上：「${tell.label}」，注意${tell.recovery || '距离和回收'}。` };
}

function estimateCombatWindowDuration(actions = [], steps = [], tell = null) {
  const actionCount = Math.max(1, actions.length || 1);
  const stepCount = Math.max(actionCount, steps.length || actionCount);
  const danger = tell?.danger === '高' ? 1 : tell?.danger === '中' ? 0.5 : 0;
  return clamp(Math.round(7 + actionCount * 1.05 + (stepCount - actionCount) * 0.45 + danger), 8, 12);
}

function combatPressureLabel(steps = []) {
  const hits = steps.filter((step) => step.result?.damage > 0 || step.result?.takedown || step.result?.guarded).length;
  const breaks = steps.filter((step) => (Array.isArray(step.fx) ? step.fx : step.fx ? [step.fx] : []).some((fx) => fx.type === 'break')).length;
  if (breaks > 0 || hits >= 4) return { level: 2, label: '高压交换' };
  if (hits >= 2) return { level: 1, label: '中压交换' };
  return { level: 0, label: '试探交换' };
}

function isObjectiveBattle(combat) {
  return Array.isArray(combat?.objectives) && combat.objectives.length > 0;
}

function stepActionId(step) {
  return step?.action?.id || step?.action || '';
}

function stepDamage(step) {
  return Number(step?.result?.damage || 0);
}

function updateCombatObjectives(state, previousCombat, combat, steps = []) {
  if (!isObjectiveBattle(combat)) return;
  combat.objectiveProgress ||= {};
  combat.objectiveNotes ||= [];
  const mark = (id, note) => {
    if (!combat.objectives.includes(id) || combat.objectiveProgress[id]) return;
    combat.objectiveProgress[id] = true;
    combat.objectiveNotes.unshift(note);
    state.maw = createDefaultMaw(state.maw);
    state.maw.objectives[id] = true;
  };
  const playerSteps = steps.filter((step) => step.actor === 'player');
  const enemySteps = steps.filter((step) => step.actor === 'enemy');
  const playerActions = playerSteps.map(stepActionId);
  const enemyDamage = enemySteps.reduce((sum, step) => sum + stepDamage(step), 0);
  const highDanger = previousCombat?.enemyTell?.danger === '高' || enemySteps.some((step) => step.result?.response?.danger === '高');
  const counteredByGuard = counterSkillsForPlan(previousCombat?.enemyTell).includes('guard');
  const protectedActions = ['guard', 'sprawl', 'dodge', 'retreat', 'dirtyescape'];
  const straightActions = ['straight', 'karate_reverse_punch', 'jab'];

  if (combat.objectiveSet === 'park_check') {
    if (Number(combat.windowCount || 0) >= 1 && state.player.hp > 0) {
      mark('parkSurviveWindow1', '你撑过了公园验货的第一个窗口。');
    }
    if (playerActions.includes('guard') && (counteredByGuard || enemySteps.some((step) => step.result?.guarded))) {
      mark('parkGuardPressure', '你用抱架把拳距压力压下来了一次。');
    }
    if (playerSteps.some((step) => stepActionId(step) === 'retreat' && step.result?.ok && step.result?.distance)) {
      mark('parkRetreatSpace', '你后撤拉开了距离，没有在不舒服的位置硬拼。');
    }
    if (Number(combat.windowCount || 0) >= 1 && Number(state.player.morale || 0) >= 35 && state.player.hp > 0) {
      mark('parkNoMoraleCollapse', '你没有被第一波交换打到士气崩盘。');
    }
    combat.objectiveNotes = combat.objectiveNotes.slice(0, 5);
    return;
  }

  if (Number(combat.windowCount || 0) >= 1 && state.player.hp > 0) {
    mark('surviveWindow1', '你撑过了终战第一波压迫。');
  }
  if ((highDanger || enemyDamage > 0) && playerActions.some((id) => protectedActions.includes(id))) {
    mark('guardHeavy', '你在高压里护住了一次关键交换。');
  }
  if (playerSteps.some((step) => straightActions.includes(stepActionId(step)) && step.result?.hit && stepDamage(step) > 0)) {
    mark('landStraight', '你用直线动作打断了对方节奏。');
  }
  if (enemyDamage > 0 && state.player.hp > 0 && state.player.sp > 0) {
    mark('recoverFromHit', '你被击中后没有崩，呼吸和体力拉回来了。');
  }
  if (playerSteps.some((step) => {
    const id = stepActionId(step);
    const style = SKILLS[id]?.style;
    return REFORGED_SKILLS.has(id) && (Number(state.maw?.reforge || 0) >= 25 || Number(state.styles?.[style] || 0) >= 18);
  })) {
    mark('useReforgedSkill', '你把现实训练写回了茂家拳里。');
  }
  if (Number(state.player.calm || 0) >= 45 && Number(state.player.heat || 0) <= 80) {
    mark('keepCalm', '你没有被热度和怒气带走。');
  }
  combat.objectiveNotes = combat.objectiveNotes.slice(0, 5);
}

function finalObjectiveList(combat) {
  if (!isObjectiveBattle(combat)) return [];
  return combat.objectives.map((id) => ({
    id,
    ...(COMBAT_OBJECTIVES[id] || { label: id, short: id, desc: '' }),
    done: Boolean(combat.objectiveProgress?.[id])
  }));
}

function finalObjectiveTier(count) {
  if (count >= 5) {
    return {
      key: 'great',
      title: '大胜：茂家拳有了骨头',
      body: '你没有把旧拳谱吹成神话，而是把拳距、身体、传统拆解、贴身和判断拼成了能站住的东西。'
    };
  }
  if (count >= 3) {
    return {
      key: 'pass',
      title: '小胜：还不够好，但已经不是假的',
      body: '你还有短板，但这一次不是靠误判撑场。能用的部分已经被练出来了。'
    };
  }
  if (count >= 2) {
    return {
      key: 'stand',
      title: '惜败：你站住了，只是还没赢',
      body: '比分不好看，可你至少知道自己缺什么。输在差距，不再输在幻想。'
    };
  }
  return {
    key: 'collapse',
    title: '崩盘：训练结构还缺一块',
    body: '这一场没有否定你，但它很诚实地指出：只靠热血和旧招名，还撑不起第30天。'
  };
}

function finishFirstWindBattle(state, reason = 'first_wind') {
  const combat = state.combat;
  state.maw = createDefaultMaw(state.maw);
  const before = snapshotState(state);
  recordCombatOutcome(state, false, 'first_wind');
  state.maw.chapter = 'broken';
  state.maw.firstWindDone = true;
  state.flags.needFatherDiary = true;
  state.flags[`main_${state.day}`] = true;
  state.daily.mainDone = true;
  const targetSp = Math.round(state.player.spMax * 0.66);
  state.player.sp = clamp(Math.max(combat.dailySpBefore || 0, targetSp), 0, state.player.spMax);
  addLog(state, '一阵风之后，你知道旧招名接不住真实拳距。第9天，该回家翻开父亲日记。');
  state.ui.modal = {
    type: 'battleResult',
    title: '一阵风之后',
    body: [
      '沉默拳击手没有陪你演一招成名。第一个窗口结束时，你已经明白：问题不在输赢，而在你一直把误判当成神功。',
      '误判被清账，祖传信念被打碎一角。父亲留下的东西，可能不在招名里。',
      `日常体力已恢复到 ${Math.round(state.player.sp)}/${Math.round(state.player.spMax)}。`
    ].join('\n'),
    lines: settlementLines(before, snapshotState(state)),
    win: false,
    reason
  };
  state.combat = null;
  state.ui.tab = 'map';
}

function finishObjectiveBattle(state, reason = 'normal') {
  const combat = state.combat;
  state.maw = createDefaultMaw(state.maw);
  const objectives = finalObjectiveList(combat);
  const completed = objectives.filter((item) => item.done).length;
  const tier = finalObjectiveTier(completed);
  const before = snapshotState(state);
  const win = completed >= 3 || combat.enemy.hp <= 0 || reason === 'riskwin';
  recordCombatOutcome(state, win, tier.key);
  state.maw.finalResult = {
    tier: tier.key,
    completed,
    total: objectives.length,
    day: state.day,
    reason
  };
  state.player.morale = clamp(state.player.morale + (completed >= 3 ? 7 : completed >= 2 ? 2 : -5), 0, 100);
  state.player.calm = clamp(state.player.calm + (completed >= 2 ? 4 : -4), 0, 100);
  const targetSp = Math.round(state.player.spMax * 0.58);
  state.player.sp = clamp(Math.max(combat.dailySpBefore || 0, targetSp), 0, state.player.spMax);
  addLog(state, `第30天目标战：${tier.title}（${completed}/${objectives.length}）。`);
  state.ui.modal = {
    type: 'battleResult',
    title: tier.title,
    body: [
      tier.body,
      `目标完成：${completed}/${objectives.length}`,
      `日常体力已恢复到 ${Math.round(state.player.sp)}/${Math.round(state.player.spMax)}。`
    ].join('\n'),
    objectiveLines: objectives.map((item) => ({
      label: item.label,
      desc: item.desc,
      done: item.done,
      status: item.done ? '完成' : '未完成'
    })),
    lines: settlementLines(before, snapshotState(state)),
    win,
    reason: tier.key,
    tier: tier.key
  };
  state.combat = null;
  state.ui.tab = 'map';
}

function finishParkCheckBattle(state, reason = 'normal') {
  const combat = state.combat;
  const objectives = finalObjectiveList(combat);
  const completed = objectives.filter((item) => item.done).length;
  const required = Number(combat.objectivePassCount || 2);
  const win = reason === 'objective_pass' || reason === 'riskwin' || combat.enemy.hp <= 0 || completed >= required;
  const before = snapshotState(state);
  recordCombatOutcome(state, win, win ? 'park_check_pass' : 'park_check_review');
  state.flags[`main_${state.day}`] = true;
  state.daily.mainDone = true;
  state.player.morale = clamp(state.player.morale + (win ? 4 : -2), 0, 100);
  state.player.calm = clamp(state.player.calm + 3, 0, 100);
  const targetSp = Math.round(state.player.spMax * 0.64);
  state.player.sp = clamp(Math.max(combat.dailySpBefore || 0, targetSp), 0, state.player.spMax);
  addLog(state, win
    ? `公园验货通过：完成 ${completed}/${objectives.length} 个轻目标。`
    : `公园验货未通过：完成 ${completed}/${objectives.length} 个轻目标，复盘后去拳馆学刺拳。`);
  state.ui.modal = {
    type: 'battleResult',
    title: win ? '验货通过' : '验货未通过',
    body: [
      `目标完成：${completed}/${objectives.length}，通过要求：${required} 项。`,
      win
        ? '这不是 KO 证明，只是说明你在第一波拳距里能做出具体选择。'
        : '失败也有复盘价值：别急着追重招，去拳馆学刺拳，先把拳距和回收补上。',
      `日常体力已恢复到 ${Math.round(state.player.sp)}/${Math.round(state.player.spMax)}。`
    ].join('\n'),
    objectiveLines: objectives.map((item) => ({
      label: item.label,
      desc: item.desc,
      done: item.done,
      status: item.done ? '完成' : '未完成'
    })),
    lines: settlementLines(before, snapshotState(state)),
    win,
    reason: win ? 'park_check_pass' : 'park_check_review',
    tier: win ? 'pass' : 'review'
  };
  state.combat = null;
  state.ui.tab = 'map';
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
  if (combat?.main && combat.script === 'first_wind') {
    finishFirstWindBattle(state, reason);
    return;
  }
  if (combat?.objectiveSet === 'park_check') {
    finishParkCheckBattle(state, reason);
    return;
  }
  if (isObjectiveBattle(combat)) {
    finishObjectiveBattle(state, reason);
    return;
  }
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
    if (this.state) updateMawProgress(this.state);
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
      updateMawProgress(s);
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
    } else if (action.type === 'advanceDialogue') {
      if (s.ui.modal?.type === 'dialogue') {
        const maxIndex = Math.max(0, (s.ui.modal.lines || []).length - 1);
        s.ui.modal.index = clamp((s.ui.modal.index || 0) + 1, 0, maxIndex);
      }
    } else if (action.type === 'completeDialogue') {
      completeDialogue(s);
    } else if (action.type === 'openTravel') {
      if (!isLocationUnlocked(s, action.loc)) {
        s.ui.toast = locationLockReason(s, action.loc);
        s.ui.cityMapOpen = false;
      } else {
        s.ui.selectedTravel = action.loc;
        s.ui.modal = { type: 'travel', loc: action.loc };
        s.ui.cityMapOpen = false;
      }
    } else if (action.type === 'travel') {
      const allowLocked = Boolean(s.ui.modal?.allowLocked && s.ui.modal?.loc === action.loc);
      const q = travelQuote(s, action.loc, action.mode);
      if (!allowLocked && !isLocationUnlocked(s, action.loc)) s.ui.toast = locationLockReason(s, action.loc);
      else if (q.money > s.player.money) s.ui.toast = '钱不够';
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
      executeAction(s, a);
    } else if (action.type === 'chooseDuration') {
      const a = findAction(s, action.actionId);
      executeAction(s, a, { dosageId: action.durationId });
    } else if (action.type === 'startMainEvent') {
      const main = MAIN_EVENTS[s.day];
      if (!main || s.flags[`main_${s.day}`]) s.ui.toast = '今天没有新的主线节点';
      else if (main.loc && main.loc !== s.loc) {
        s.ui.selectedTravel = main.loc;
        s.ui.modal = { type: 'travel', loc: main.loc, allowLocked: true };
        s.ui.cityMapOpen = false;
      } else {
        if (main.choices?.length) {
          s.ui.modal = storyChoiceModal(s, main);
        } else if (main.enemy) {
          applyMainlineMawEffects(s, main);
          s.flags[`main_${s.day}`] = true;
          s.daily.mainDone = true;
          startBattle(s, main.enemy, true, { script: main.script, objectives: main.objectives });
        } else {
          const before = snapshotState(s);
          if (main.gain) applyGain(s, main.gain);
          applyMainlineMawEffects(s, main);
          s.flags[`main_${s.day}`] = true;
          s.daily.mainDone = true;
          if (main.npc) s.relations[main.npc] = (s.relations[main.npc] || 0) + 1;
          const lines = settlementLines(before, snapshotState(s));
          s.ui.modal = main.script === 'father_diary'
            ? dialogueModal({
              title: main.title,
              npc: main.npc,
              body: main.desc,
              lines: FATHER_DIARY.dialogue || main.dialogue,
              settlementLines: lines,
              onComplete: { type: 'fatherDiary', lines },
              actionLabel: '翻开日记'
            })
            : dialogueModal({
              title: main.title,
              npc: main.npc,
              body: main.desc,
              lines: main.dialogue || [{ speaker: main.title, text: main.desc }],
              settlementLines: lines,
              actionLabel: '继续'
            });
          addLog(s, `完成主线：${main.title}`);
        }
      }
    } else if (action.type === 'resolveStoryChoice') {
      resolveStoryChoice(s, action.choiceId);
    } else if (action.type === 'takeOpportunity') {
      const card = buildOpportunities(s).find((item) => item.id === action.id);
      if (!card) s.ui.toast = '这个待办已经过期';
      else if (card.loc && !isLocationUnlocked(s, card.loc)) {
        s.ui.toast = locationLockReason(s, card.loc);
        s.ui.cityMapOpen = false;
      }
      else if (card.loc && card.loc !== s.loc) {
        s.ui.selectedTravel = card.loc;
        s.ui.modal = { type: 'travel', loc: card.loc };
        s.ui.cityMapOpen = false;
      } else s.ui.modal = eventNotebookModal(s, card, { source: 'opportunity' });
    } else if (action.type === 'resolveEventNotebook') {
      resolveEventNotebook(s);
    } else if (action.type === 'answerTraining') {
      answerTrainingMini(s, action.optionId);
    } else if (action.type === 'finishTraining') {
      finishTrainingMini(s, action.grade);
    } else if (action.type === 'startBattle') {
      startBattle(s, action.enemyId);
    } else if (action.type === 'openFatherDiary') {
      s.ui.modal = fatherDiaryModal(s);
    } else if (action.type === 'selectSkill') {
      const c = s.combat;
      const skill = SKILLS[action.skillId];
      if (c && skill && c.phase !== 'auto' && (c.selected || []).length < COMBAT_QUEUE_LIMIT) {
        c.selected.push(action.skillId);
        c.playerQueue = [...c.selected];
      } else if (c && skill && c.phase !== 'auto') {
        s.ui.toast = `每回合最多 ${COMBAT_QUEUE_LIMIT} 张动作卡`;
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
    } else if (action.type === 'setCombatPlan') {
      const c = s.combat;
      if (c && c.phase !== 'auto' && combatPlanMode(action.planMode).id === action.planMode) {
        c.planMode = action.planMode;
        c.lastPlanFill = null;
      }
    } else if (action.type === 'confirmBattle') {
      const c = s.combat;
      if (c && c.phase !== 'auto') {
        const previousCombat = clone(c);
        const playerPickedQueue = c.selected?.length ? [...c.selected] : [];
        const planMode = combatPlanMode(previousCombat.planMode);
        const suggestion = playerPickedQueue.length || planMode.id === 'manual' ? null : suggestCombatQueue(toCombatInput({ ...s, combat: previousCombat }));
        const planFill = !playerPickedQueue.length && suggestion?.queue?.length ? {
          mode: planMode.id,
          label: planMode.label,
          queue: [...suggestion.queue],
          reason: suggestion.reason,
          source: suggestion.source,
          planSlot: previousCombat.planSlot || null,
          comboSlot: previousCombat.comboSlot || null
        } : null;
        previousCombat.playerQueue = playerPickedQueue.length ? playerPickedQueue : (planFill?.queue?.length ? [...planFill.queue] : ['guard']);
        previousCombat.lastPlanFill = planFill;
        const plannedCombat = { ...c, playerQueue: previousCombat.playerQueue, selected: c.selected?.length ? [...c.selected] : [] };
        const plannedState = { ...s, combat: plannedCombat };
        previousCombat.enemyTell = combatPlanningRead(plannedState, toCombatInput(plannedState));
        previousCombat.phase = 'auto';
        const result = resolveCombatExchange(toCombatInput({ ...s, combat: previousCombat }), previousCombat.playerQueue);
        result.combatState.steps = result.steps;
        mergeCombatResult(s, previousCombat, result.combatState);
        const stepLogs = result.steps.flatMap((step) => Array.isArray(step.log) ? step.log : step.log ? [step.log] : []);
        const feedbackLine = s.combat?.lastWindow?.feedback?.text || '';
        const planLine = planFill ? `PLAN触发：${planFill.label}（${planFill.mode}）自动填入本窗口建议队列：${planQueueNames(planFill.queue)}。comboSlot=${planFill.comboSlot || 'empty'}，planSlot=${planFill.planSlot || 'empty'}。` : '';
        if (s.combat) s.combat.log = [`自动窗口 ${s.combat.windowCount}（${s.combat.lastWindow?.duration || 10}秒，${s.combat.lastWindow?.pressure || '交换'}）结束，重新调整。`, planLine, feedbackLine, ...stepLogs, ...(s.combat.log || [])].filter(Boolean).slice(0, 12);
        if (s.combat?.main && s.combat.script === 'first_wind' && Number(s.combat.windowCount || 0) >= 1) {
          finishBattle(s, 'first_wind');
        } else if (s.combat?.objectiveSet === 'park_check' && finalObjectiveList(s.combat).filter((item) => item.done).length >= Number(s.combat.objectivePassCount || 2)) {
          finishBattle(s, 'objective_pass');
        } else if (result.finished && s.combat) {
          finishBattle(s, s.combat.finishReason || 'normal');
        }
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
    chen: '第30天来拳馆。我只看你在压力下做什么。',
    coach_luo: '散打不是散着打。拳腿摔要连成一句话，中间断了，对面就会替你补标点。',
    senpai_yan: '规矩不是摆样子。你能在规矩里收住动作，出了规矩才不容易乱。',
    coach_min: '腿法的重点不是抬多高，是踢完还能站在哪。距离错了，漂亮没用。',
    father: '真要保护人，就去学真东西。输了不丢人，乱欺负人才丢人。',
    abao: '我刷到你了。你说祖传，我说秘传，今天看看谁先露馅。',
    oldman: '推手不是把人推出去，是先把自己站明白。'
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
  sanda_gym: { day: 'bg.mma.day', night: 'bg.mma.night' },
  karate_dojo: { day: 'bg.wuguan.day', night: 'bg.wuguan.night' },
  taekwondo_club: { day: 'bg.gym.day', night: 'bg.gym.night' },
  gym: { day: 'bg.gym.day', night: 'bg.gym.night' },
  physio: { day: 'bg.physio.day', night: 'bg.physio.night' },
  metro_station: { day: 'bg.metro_station.day', night: 'bg.metro_station.night' },
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
  sanda_gym: { x: 57, y: 70 },
  karate_dojo: { x: 71, y: 58 },
  taekwondo_club: { x: 73, y: 76 },
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
  sanda_gym: [{ id: 'coach_luo', name: '罗教练', role: '看拳腿摔衔接', kind: 'token', icon: '罗' }],
  karate_dojo: [{ id: 'senpai_yan', name: '严前辈', role: '带组手线', kind: 'token', icon: '严' }],
  taekwondo_club: [{ id: 'coach_min', name: '闵教练', role: '测腿法距离', kind: 'token', icon: '闵' }],
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
  E10: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '风' },
  E11: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '豹' },
  E19: { assetKey: 'fighter.enemy.grappler', kind: 'standee', icon: '散' },
  E20: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '空' },
  E21: { assetKey: 'fighter.enemy.boxer', kind: 'standee', icon: '跆' },
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

function locationOpenText(loc) {
  return `${fmtTime((loc?.open || [0])[0])}-${fmtTime((loc?.open || [1440, 1440])[1])}`;
}

function cityMapModel(state, timeOfDay) {
  const mainEvent = MAIN_EVENTS[state.day] && !state.flags[`main_${state.day}`] ? MAIN_EVENTS[state.day] : null;
  return {
    backgroundKey: CITY_MAP_BACKGROUND_KEYS[timeOfDay] || CITY_MAP_BACKGROUND_KEYS.day,
    timeOfDay,
    markers: Object.entries(LOCS).map(([id, loc]) => {
      const locked = !isLocationUnlocked(state, id);
      return {
        id,
        ...loc,
        ...(CITY_MAP_MARKERS[id] || { x: 50, y: 50 }),
        active: id === state.loc,
        locked,
        lockReason: locationLockReason(state, id),
        unlockHint: locationUnlockHint(id),
        closed: locked || (id !== 'home' && id !== 'store' && !inOpen(state, id)),
        mainHere: mainEvent?.loc === id,
        actionCount: (ACTIONS[id] || []).length,
        openText: locationOpenText(loc)
      };
    })
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

function seededCombatRng(state, combat, queue) {
  let seed = Number(state.seed || 1)
    + Number(combat?.eventSeq || 0) * 97
    + Number(combat?.windowCount || 0) * 193
    + queue.join('').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  seed = Math.abs(Math.floor(seed)) || 1;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function recoveryHint(plan) {
  if (!plan) return '';
  if (plan.danger === '高') return '出手后有明显回收空档';
  if (plan.intent === 'counter') return '别把重招一次打满';
  if (plan.intent === 'clinch') return '防摔或拉开能抢回主动';
  if (plan.intent === 'weapon') return '撤离和降温比硬拼更稳';
  if (plan.intent === 'disengage') return '低扫或前压能追到节奏';
  return '试探后会重新进入中性';
}

function counterSkillsForPlan(plan) {
  if (Array.isArray(plan?.counterSkills) && plan.counterSkills.length) return plan.counterSkills;
  if (plan?.intent === 'clinch') return ['push_away', 'sprawl', 'frontkick', 'karate_front_kick', 'retreat', 'sanda_catch_throw'];
  if (plan?.intent === 'pressure') return ['guard', 'push_away', 'jab', 'frontkick', 'karate_front_kick', 'tkd_roundhouse', 'retreat'];
  if (plan?.intent === 'counter') return ['wild_swing', 'jab', 'dodge', 'guard', 'sanda_whip_kick'];
  if (plan?.intent === 'weapon') return ['dirtyescape', 'talkdown', 'retreat', 'guard'];
  if (plan?.intent === 'ground') return ['escape', 'sidecontrol', 'sprawl'];
  if (plan?.intent === 'disengage') return ['advance', 'lowkick', 'sanda_whip_kick'];
  return ['guard', 'wild_swing', 'push_away'];
}

function combatPlanMode(id) {
  return COMBAT_PLAN_MODES.find((mode) => mode.id === id) || COMBAT_PLAN_MODES[0];
}

function planQueueNames(queue = []) {
  return queue.map((id) => SKILLS[id]?.name || id).join(' -> ');
}

function queueAdvice(queue, plan) {
  const counters = counterSkillsForPlan(plan);
  const chosenCounters = queue.filter((id) => counters.includes(id));
  const repeated = queue.length >= 2 && queue.every((id) => id === queue[0]);
  const heavyCount = queue.filter((id) => ['straight', 'mystic', 'takedown', 'karate_reverse_punch', 'tkd_back_kick', 'sanda_catch_throw'].includes(id)).length;
  const names = counters.slice(0, 3).map((id) => SKILLS[id]?.name || id).join(' / ');
  const tips = [];
  if (!queue.length) tips.push(`先用 ${names} 这类稳动作读一拍。`);
  if (chosenCounters.length) tips.push(`当前队列有 ${chosenCounters.map((id) => SKILLS[id]?.name || id).join('、')}，能对上这次读板。`);
  else tips.push(`建议补一张：${names}。`);
  if (repeated) tips.push('队列动作太重复，陈见锋这种对手会直接读回收。');
  if (heavyCount >= 2) tips.push('重招连续使用会放大回收空档，先用试探动作垫一下。');
  if (plan?.danger === '高' && !chosenCounters.length) tips.push('危险等级高，别硬拼完整连段。');
  return {
    counterSkills: counters,
    fit: chosenCounters.length ? '对上读板' : '还缺反制',
    fitTone: chosenCounters.length ? 'good' : plan?.danger === '高' ? 'bad' : 'neutral',
    tips: tips.slice(0, 4)
  };
}

function combatPlanningRead(state, combatInput) {
  const combat = state.combat;
  if (!combat || !combatInput || combat.phase === 'auto') return null;
  const queue = combat.selected?.length ? [...combat.selected] : [];
  const planMode = combatPlanMode(combat.planMode);
  const suggestion = queue.length || planMode.id === 'manual' ? null : suggestCombatQueue(combatInput);
  const assumedQueue = queue.length ? queue : (suggestion?.queue?.length ? suggestion.queue : ['guard']);
  const nextAction = assumedQueue[0];
  const rng = seededCombatRng(state, combat, assumedQueue);
  const plan = chooseEnemyResponse({
    combatState: combatInput,
    playerAction: nextAction,
    selectedActions: assumedQueue,
    steps: combat.steps || []
  }, rng);
  const advice = queueAdvice(queue, plan);
  return {
    ...plan,
    planMode: planMode.id,
    planLabel: planMode.label,
    suggestedQueue: suggestion?.queue || [],
    suggestedQueueNames: suggestion?.queue?.length ? planQueueNames(suggestion.queue) : '',
    suggestedQueueReason: suggestion?.reason || '',
    skillName: SKILLS[plan.skill]?.name || plan.skill,
    nextAction,
    nextActionName: SKILLS[nextAction]?.name || nextAction,
    queueCount: queue.length,
    windowDuration: estimateCombatWindowDuration(assumedQueue, [], plan),
    recovery: recoveryHint(plan),
    counterSkillNames: advice.counterSkills.slice(0, 4).map((id) => SKILLS[id]?.name || id),
    queueFit: advice.fit,
    queueFitTone: advice.fitTone,
    tips: advice.tips,
    failure: plan.failure || (plan.danger === '高' ? '如果你无视读板，最可能吃到反击或被拖进不利距离。' : '如果选择不对，会丢体力、架势或距离。')
  };
}

function mawRenderModel(state) {
  const maw = createDefaultMaw(state.maw);
  const revealed = Boolean(maw.truthRevealed || maw.diaryRead || maw.chapter === 'reforge');
  const forms = Object.entries(MAW_FORMS).map(([id, form]) => {
    const progress = maw.forms[id] || { reforge: 0, unlockedNote: false };
    const formRevealed = Boolean(revealed || progress.unlockedNote);
    const status = !formRevealed ? 'locked' : progress.reforge >= 70 ? 'reforged' : 'revealed';
    return {
      id,
      ...form,
      ...progress,
      status,
      statusText: status === 'locked' ? '旧解未拆' : status === 'reforged' ? '新注成形' : '疑注待练',
      moduleName: MAW_MODULE_LABELS[form.module] || form.module,
      note: !formRevealed ? form.old : progress.reforge >= 70 ? form.newNote : form.doubt,
      nextText: !formRevealed
        ? '读完父亲日记后再拆这一页。'
        : progress.reforge >= 70
          ? '这一页已经能写进新拳谱。'
          : `${MAW_MODULE_GUIDE[form.module]?.desc || '继续把训练压力测出来。'}`
    };
  });
  return {
    ...maw,
    revealed,
    diary: FATHER_DIARY,
    diaryAvailable: Boolean(maw.diaryRead || maw.truthRevealed || maw.chapter === 'reforge'),
    chapterText: {
      illusion: '幻想期',
      broken: '打醒后',
      reforge: '重铸期'
    }[maw.chapter] || maw.chapter,
    rules: MAW_RULES,
    moduleList: MAW_MODULE_KEYS.map((id) => ({
      id,
      name: MAW_MODULE_LABELS[id] || id,
      value: Math.round(maw.modules?.[id] || 0),
      desc: MAW_MODULE_GUIDE[id]?.desc || '',
      status: !revealed ? 'locked' : (maw.modules?.[id] || 0) >= 70 ? 'solid' : (maw.modules?.[id] || 0) >= 35 ? 'building' : 'thin',
      next: MAW_MODULE_GUIDE[id] ? {
        actionId: MAW_MODULE_GUIDE[id].action,
        actionName: ACTIONS[MAW_MODULE_GUIDE[id].loc]?.find((action) => action.id === MAW_MODULE_GUIDE[id].action)?.name || '',
        locId: MAW_MODULE_GUIDE[id].loc,
        locName: LOCS[MAW_MODULE_GUIDE[id].loc]?.name || '',
        skills: MAW_MODULE_GUIDE[id].skills.map((skillId) => SKILLS[skillId]?.name || skillId)
      } : null
    })),
    forms
  };
}

function todayFocusModel(state, mainEvent) {
  if (mainEvent) {
    const locName = LOCS[mainEvent.loc]?.name || mainEvent.loc || '当前地点';
    return {
      id: mainEvent.id || `main_${state.day}`,
      title: mainEvent.title,
      loc: mainEvent.loc,
      locName,
      done: Boolean(state.daily?.mainDone || state.flags?.[`main_${state.day}`]),
      soft: state.day <= 7,
      text: state.day <= 7
        ? `今日主线锚点：${mainEvent.title}。先到${locName}看清楚，不强制把今天变成战斗。`
        : `今日主线锚点：${mainEvent.title}。优先处理，再安排自由行动。`
    };
  }
  const missingJab = state.day >= 6 && !state.skillState?.jab && !state.unlocked?.jab;
  return {
    id: missingJab ? 'jab_bag_hint' : 'daily_baseline',
    title: missingJab ? '拳馆 · 沙包连击' : '把今天做成一个闭环',
    loc: missingJab ? 'boxing' : state.loc,
    locName: missingJab ? LOCS.boxing?.name || '拳馆' : LOCS[state.loc]?.name || '',
    done: false,
    soft: true,
    text: missingJab
      ? '今日主线锚点：先补刺拳距离感。去拳馆做沙包连击比继续找架更实际。'
      : '今日主线锚点：选一个训练、恢复或复盘目标，完成后再决定要不要加码。'
  };
}

function dailyDirectorModel(state, mainEvent, opportunities = []) {
  const period = dayPeriod(state.time);
  const actionsDone = clamp(state.daily?.actions, 0, 99);
  const baselineSlots = state.time < 1320 ? 3 : 1;
  const remainingActions = clamp(Math.min(baselineSlots - actionsDone, 3), 0, 3);
  const focus = todayFocusModel(state, mainEvent);
  const idleSleepStreak = Number(state.daily?.idleSleepStreak || 0);
  const freeActionHint = remainingActions <= 0
    ? '今天的自由行动感已经很满了，适合收尾、恢复或睡觉。'
    : idleSleepStreak > 0
      ? '先做一个很小的出门动作：复盘、补给、观察都可以，不需要立刻战斗。'
      : `还适合安排 ${remainingActions} 个自由行动；优先从当前推荐里挑，不要无限刷地图。`;
  return {
    period,
    todayFocus: focus,
    mainline: focus,
    recommendedCount: Math.min(opportunities.length, 3),
    remainingActions,
    softCombatDays: state.day <= 7,
    freeActionHint,
    homeIdleReminder: idleSleepStreak > 0 || (state.loc === 'home' && actionsDone <= 0)
      ? '如果今天只想休息也可以；先让手机、刘胖子或邻居给一个轻提醒。'
      : ''
  };
}

export function buildRenderModel(state) {
  if (!state) return { boot: true, origins: ORIGINS };
  const p = state.player;
  const stats = derivedStats(state);
  const fit = fitBonus(p);
  const mainEvent = MAIN_EVENTS[state.day] && !state.flags[`main_${state.day}`] ? MAIN_EVENTS[state.day] : null;
  const opportunities = buildOpportunities(state);
  const dailyDirector = dailyDirectorModel(state, mainEvent, opportunities);
  const timeOfDay = timeOfDayKey(state.time);
  const backgroundKey = locationBackgroundKey(state.loc, timeOfDay);
  const combatInput = state.combat ? toCombatInput(state) : null;
  const selectedCount = state.combat?.selected?.length || 0;
  const skillPreview = (id) => {
    if (!id || !combatInput) return null;
    const preview = previewPlayerAction(combatInput, id);
    const queueReason = selectedCount >= COMBAT_QUEUE_LIMIT ? '本回合队列已满' : '';
    return {
      ...preview,
      damageText: preview.max > 0 ? `${preview.min}-${preview.max}` : '0',
      postureText: preview.posture > 0 ? String(preview.posture) : '0',
      unavailableReason: queueReason || preview.reason || ''
    };
  };
  const actions = (ACTIONS[state.loc] || []).map((action) => {
    const durationOptions = actionDosageOptions(action);
    const cheapestSp = durationOptions.length ? Math.min(...durationOptions.map((option) => option.sp)) : actionSpCost(action);
    const cheapestCost = durationOptions.length ? Math.min(...durationOptions.map((option) => option.cost)) : Number(action.cost || 0);
    return {
      ...action,
      disabled: cheapestSp > p.sp || cheapestCost > p.money,
      spCost: actionSpCost(action),
      durationOptions,
      summary: actionSummary(action)
    };
  });
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
    dayPeriod: dailyDirector.period,
    todayFocus: dailyDirector.todayFocus,
    dailyDirector,
    phase: `${dayStage(state.day)} · ${phaseText(state.time)} · ${LOCS[state.loc]?.name || ''}`,
    loc: { id: state.loc, ...(LOCS[state.loc] || {}) },
    locs: Object.entries(LOCS).map(([id, loc]) => {
      const locked = !isLocationUnlocked(state, id);
      return {
        id,
        ...loc,
        active: id === state.loc,
        locked,
        lockReason: locationLockReason(state, id),
        unlockHint: locationUnlockHint(id),
        closed: locked || (id !== 'home' && id !== 'store' && !inOpen(state, id)),
        mainHere: decoratedMainEvent?.loc === id,
        actionCount: (ACTIONS[id] || []).length,
        openText: locationOpenText(loc)
      };
    }),
    timeOfDay,
    cityMap: cityMapModel(state, timeOfDay),
    locationScene: {
      locId: state.loc,
      backgroundKey,
      timeOfDay,
      timeText: timeOfDay === 'night' ? '夜景' : '日间',
      openText: locationOpenText(LOCS[state.loc]),
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
    styleList: Object.entries(STYLE_RULES).map(([id, rule]) => ({
      id,
      ...rule,
      value: Math.round(state.styles?.[id] || 0)
    })),
    maw: mawRenderModel(state),
    statRules: STAT_RULES,
    resourceRules: RESOURCE_RULES,
    styleRules: STYLE_RULES,
    skillUnlocks: skillUnlocksModel(state),
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
    npcs: Object.entries(NPCS).filter(([, npc]) => !npc.hidden).map(([id, npc]) => ({ id, ...npc, relation: state.relations[id] || 0 })),
    actions,
    opportunities,
    mainEvent: decoratedMainEvent,
    combat: state.combat ? {
      ...state.combat,
      queueLimit: COMBAT_QUEUE_LIMIT,
      planModes: COMBAT_PLAN_MODES,
      planMode: combatPlanMode(state.combat.planMode).id,
      planLabel: combatPlanMode(state.combat.planMode).label,
      planSlot: state.combat.planSlot || null,
      comboSlot: state.combat.comboSlot || null,
      enemyTell: combatPlanningRead(state, combatInput),
      objectiveList: finalObjectiveList(state.combat)
    } : null,
    log: state.log || [],
    eventLog: state.eventLog || [],
    combatMemory: state.combatMemory,
    selectedTravel: state.ui.selectedTravel,
    travelOptions: state.ui.selectedTravel ? Object.entries(TRAVEL_TUNING).map(([modeId, mode]) => ({ id: modeId, ...mode, quote: travelQuote(state, state.ui.selectedTravel, modeId) })) : []
  };
}
