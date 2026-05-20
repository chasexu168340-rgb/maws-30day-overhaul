const FACTOR_LABELS = Object.freeze({
  heat: '热度',
  fame: '名声',
  lowFame: '低名声',
  auth: '真实性',
  lowAuth: '低真实性',
  fatigue: '疲劳',
  lowFatigue: '体力余裕',
  injuries: '伤病',
  fights: '战斗次数',
  wins: '胜场',
  losses: '败场',
  riskWins: '风险处理',
  combatMemory: '战斗记忆'
});

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

function playerOf(state = {}) {
  return state.player && typeof state.player === 'object' ? state.player : state;
}

function combatMemoryOf(state = {}, player = {}) {
  return state.combatMemory || player.combatMemory || {};
}

export const EVENT_RULES = deepFreeze([
  {
    id: 'coach_correction',
    title: '梁教练暂停你的玄学发挥',
    loc: 'boxing',
    desc: '他看了你上一场录像，准确指出一个让你沉默的问题。适合把挨打经验翻译成稳定训练。',
    npc: 'coach',
    kind: 'dialog',
    base: 46,
    tags: ['录像复盘', '技术补课'],
    weights: { combatMemory: 2.4, losses: 5, lowAuth: 0.7, fatigue: -0.5 }
  },
  {
    id: 'park_light_spar',
    title: '公园有人约一局不嘴硬的',
    loc: 'park',
    desc: '低风险验货，适合测试新装备和基础技能；疲劳太高就别硬接，身体不是一次性道具。',
    enemy: 'E01',
    kind: 'battle',
    base: 42,
    tags: ['低风险', '实战验货'],
    weights: { fame: 1.2, heat: 0.9, lowFatigue: 1.1, injuries: -3.5 }
  },
  {
    id: 'online_discount',
    title: '网购页面开始对你眨眼',
    loc: 'home',
    desc: '训练工具在打折，但刷太久会长疲劳，也容易被直播间迷货带偏。便宜不等于有用，主播的嗓门也不等于科学。',
    shop: true,
    kind: 'shop',
    base: 36,
    tags: ['补给', '装备诱惑'],
    weights: { lowAuth: 1.6, heat: 0.6, fatigue: 0.4, lowFame: 0.5 }
  },
  {
    id: 'store_rumor',
    title: '刘胖子捡到一条旧城闲话',
    loc: 'store',
    desc: '聊天能获得旧城线索，也可能让热度继续往上拱。消息像便宜饮料，解渴，也可能上头。',
    npc: 'fatty',
    kind: 'dialog',
    base: 34,
    tags: ['旧城线索', '热度发酵'],
    weights: { heat: 1.4, fame: 0.8, riskWins: 2.5, combatMemory: 0.8 }
  },
  {
    id: 'xiaoman_customer',
    title: '小满被麻烦客人缠上',
    loc: 'store',
    desc: '可以降温、保护或找监控，不一定要打。热度越高越容易被卷进来，别把便利店门口打成决赛现场。',
    npc: 'xiaoman',
    kind: 'dialog',
    base: 34,
    tags: ['降温处理', '便利店风波'],
    weights: { heat: 1.2, riskWins: 4, fatigue: -0.4, injuries: 0.8 }
  },
  {
    id: 'wuguan_observe',
    title: '武馆今天允许旁观真东西',
    loc: 'wuguan',
    desc: '看传统动作压力测试，把好看的东西拆成能重复的细节。招式可以有来历，落地必须有证据。',
    npc: 'master',
    kind: 'dialog',
    base: 35,
    tags: ['传统拆解', '真实性校准'],
    weights: { auth: 1.1, lowAuth: 0.8, fame: 0.5, fatigue: -0.2 }
  },
  {
    id: 'mma_open_mat',
    title: 'MMA垫子空出一块地板',
    loc: 'mma',
    desc: '晚间开放垫子，适合练防摔、抱摔和地面脱身。地板很公平，它对每个人都一样硬。',
    enemy: 'E06',
    kind: 'battle',
    base: 35,
    tags: ['防摔', '地面求生'],
    weights: { fame: 0.9, fights: 1.2, lowFatigue: 0.9, injuries: -2.5 }
  },
  {
    id: 'oldtown_video_clue',
    title: '旧城区刷出一条可疑视频',
    loc: 'street',
    desc: '可能找到流量大师学徒的破绽。热度越高，线索越多，风险也越近，像一群不请自来的观众。',
    enemy: 'E03',
    kind: 'battle',
    base: 32,
    tags: ['旧城线索', '流量破绽'],
    weights: { heat: 2, fame: 0.8, lowAuth: 1.1, fatigue: -0.6, injuries: -1.4 }
  },
  {
    id: 'heat_challenger',
    title: '热度把挑战者钓上来了',
    loc: 'park',
    desc: '网上有人约轻切，名声机会变多，但别让疲劳拖垮身体。观众爱看加赛，膝盖不爱。',
    enemy: 'E04',
    kind: 'battle',
    base: 44,
    tags: ['热度上桌', '挑战邀约'],
    when: { minHeat: 16 },
    weights: { heat: 2.4, fame: 1.0, fatigue: -1.0, injuries: -3.0 }
  },
  {
    id: 'oldtown_called_out',
    title: '旧城有人公开点你的名',
    loc: 'street',
    desc: '热度太高，旧城那边开始拿你当话题。风险高，收益也高，像一张没有小字条款的危险合同。',
    enemy: 'E09',
    kind: 'battle',
    base: 50,
    tags: ['高风险', '旧城点名'],
    when: { minHeat: 30 },
    weights: { heat: 3.0, fame: 1.5, combatMemory: 1.2, fatigue: -0.8, injuries: -2.0 }
  },
  {
    id: 'last_fight_review',
    title: '上一战录像开始公开处刑',
    loc: 'home',
    desc: '针对上一位对手的问题做一次短复盘。镜头不会安慰你，但会告诉你下一场该读哪里。',
    npc: 'coach',
    kind: 'dialog',
    base: 58,
    tags: ['录像复盘', '战斗记忆'],
    when: { requiresLastEnemy: true },
    weights: { combatMemory: 3.2, losses: 4.5, auth: 0.5, fatigue: 0.2 }
  },
  {
    id: 'risk_handled_spread',
    title: '你没硬拼这事传开了',
    loc: 'store',
    desc: '你没有把冲突打成硬拼，小满和刘胖子会给出新的线索。有时候最像高手的操作，是让事情没升级。',
    npc: 'xiaoman',
    kind: 'dialog',
    base: 56,
    tags: ['风险处理', '关系线索'],
    when: { minRiskWins: 1 },
    weights: { riskWins: 8, fame: 0.8, heat: 0.6, combatMemory: 1.5 }
  },
  {
    id: 'physio_warning',
    title: '身体向你递交投诉书',
    loc: 'physio',
    desc: '疲劳和伤病已经影响训练质量。今天不处理，明天身体会用更贵的方式提醒你。',
    kind: 'recovery',
    base: 18,
    tags: ['恢复', '伤病预警'],
    weights: { fatigue: 5, injuries: 8, combatMemory: 0.5, heat: -0.3 }
  },
  {
    id: 'worksite_day_labor_lead',
    title: '工地日结正在招能喘气的人',
    loc: 'store',
    desc: '刘胖子转来一条日结活：不体面，但现金和体能沉淀都是真的。砖不会问梦想，只问你搬不搬。',
    action: 'worksite_day_labor',
    kind: 'work',
    base: 30,
    tags: ['日结赚钱', '体能沉淀'],
    weights: { lowFame: 1.2, lowFatigue: 0.8, injuries: -4, heat: -0.2 }
  }
]);

function injuryLoad(injuries) {
  if (!Array.isArray(injuries) || !injuries.length) return 0;
  const turnLoad = injuries.reduce((sum, injury) => sum + clamp(injury?.turn || 0, 0, 10), 0) / 6;
  return injuries.length + turnLoad;
}

function factorsFor(state = {}) {
  const player = playerOf(state);
  const memory = combatMemoryOf(state, player);
  const heat = clamp(player.heat, 0, 100);
  const fame = clamp(player.fame, 0, 400);
  const auth = clamp(player.auth, 0, 100);
  const fatigue = clamp(player.fatigue, 0, 100);
  const injuries = injuryLoad(player.injuries);
  const fights = clamp(memory.fights, 0, 99);
  const wins = clamp(memory.wins, 0, 99);
  const losses = clamp(memory.losses, 0, 99);
  const riskWins = clamp(memory.riskWins, 0, 99);
  const recentCount = Array.isArray(memory.recent) ? memory.recent.length : 0;
  const remembered = fights + riskWins * 2 + (memory.lastEnemy ? 2 : 0) + recentCount * 0.5;

  return {
    player,
    memory,
    heat: heat / 10,
    fame: fame / 40,
    lowFame: clamp((160 - fame) / 40, 0, 4),
    auth: auth / 20,
    lowAuth: (100 - auth) / 20,
    fatigue: fatigue / 20,
    lowFatigue: (100 - fatigue) / 20,
    injuries,
    fights,
    wins,
    losses,
    riskWins,
    combatMemory: clamp(remembered, 0, 20)
  };
}

function passesRule(rule, factors) {
  const when = rule.when || {};
  const player = factors.player || {};
  const memory = factors.memory || {};
  const heat = number(player.heat);
  const fame = number(player.fame);
  const fatigue = number(player.fatigue);

  if (when.minHeat != null && heat < when.minHeat) return false;
  if (when.maxHeat != null && heat > when.maxHeat) return false;
  if (when.minFame != null && fame < when.minFame) return false;
  if (when.maxFame != null && fame > when.maxFame) return false;
  if (when.minFatigue != null && fatigue < when.minFatigue) return false;
  if (when.maxFatigue != null && fatigue > when.maxFatigue) return false;
  if (when.minInjuries != null && factors.injuries < when.minInjuries) return false;
  if (when.requiresLastEnemy && !memory.lastEnemy) return false;
  if (when.minRiskWins != null && number(memory.riskWins) < when.minRiskWins) return false;
  if (when.lastResult && memory.lastResult !== when.lastResult) return false;
  return true;
}

function hashText(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableJitter(rule, state = {}, factors) {
  const seed = state.seed ?? state.daily?.sideSeed ?? 0;
  const key = `${state.day || 0}:${seed}:${rule.id}:${factors.memory?.fights || 0}:${factors.player?.heat || 0}`;
  return (hashText(key) % 100) / 100;
}

function scoreRule(rule, factors, state) {
  const breakdown = {};
  let score = number(rule.base, 0);
  Object.entries(rule.weights || {}).forEach(([key, weight]) => {
    const contribution = number(factors[key]) * number(weight);
    if (!contribution) return;
    breakdown[key] = Number(contribution.toFixed(2));
    score += contribution;
  });
  if (state.loc && state.loc === rule.loc) {
    breakdown.currentLoc = 3;
    score += 3;
  }
  score += stableJitter(rule, state, factors);
  return { score: Number(score.toFixed(2)), breakdown };
}

function reasonFromBreakdown(breakdown) {
  const entries = Object.entries(breakdown)
    .filter(([key]) => key !== 'currentLoc')
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3)
    .map(([key, value]) => `${FACTOR_LABELS[key] || key}${value > 0 ? '+' : ''}${value}`);
  if (breakdown.currentLoc) entries.unshift('当前位置+3');
  return entries.join(' / ');
}

function publicCard(rule, score, breakdown) {
  const { base, weights, when, ...card } = rule;
  return {
    ...card,
    score,
    weightBreakdown: breakdown,
    reason: reasonFromBreakdown(breakdown)
  };
}

export function buildOpportunities(state = {}) {
  const factors = factorsFor(state);
  const count = Math.max(1, Math.floor(number(state.opportunityCount, 3)));
  return EVENT_RULES
    .filter((rule) => passesRule(rule, factors))
    .map((rule) => {
      const { score, breakdown } = scoreRule(rule, factors, state);
      return publicCard(rule, score, breakdown);
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, count);
}
