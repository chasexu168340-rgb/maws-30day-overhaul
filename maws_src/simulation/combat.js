const COMBAT_TUNING = Object.freeze({
  version: "4.0-hard-comic",
  enemyScalePerDay: 0.009,
  playerDmgScale: 0.58,
  enemyDmgScale: 0.52,
  skillMasteryDmg: 0.045,
  postureDmgScale: 0.72,
  postureBreakBonus: 0.16,
  fatigueHitPenalty: 0.04,
  repeatPenalty: 0.045,
  guardDef: 0.42,
  dodgeDef: 0.24,
  sprawlAnti: 0.28,
  counterBonus: 0.08,
  lowSpRecover: 16,
  turnSpRecover: 10,
  restSpRecover: 24,
  enemyTurnSpRecover: 7,
  minChipDmg: 3,
  blockSpDrain: 4,
  roundLimit: 12
});

const SKILLS = Object.freeze({
  jab: { name: "刺拳探路", type: "strike", dist: ["mid"], dmg: 10, post: 10, sp: 7, tp: 1, hit: 0.82, risk: 0.10, style: "boxing" },
  straight: { name: "直拳重击", type: "strike", dist: ["mid"], dmg: 20, post: 14, sp: 14, tp: 2, hit: 0.68, risk: 0.22, style: "boxing" },
  guard: { name: "防守抱架", type: "defense", dist: ["mid", "close"], dmg: 0, post: 0, sp: 6, tp: 1, hit: 1, risk: 0.02, style: "boxing" },
  dodge: { name: "侧步闪避", type: "footwork", dist: ["far", "mid", "close"], dmg: 0, post: 0, sp: 9, tp: 1, hit: 1, risk: 0.08, style: "boxing" },
  lowkick: { name: "低扫抽根", type: "kick", dist: ["mid"], dmg: 12, post: 18, sp: 12, tp: 2, hit: 0.66, risk: 0.18, style: "mma" },
  frontkick: { name: "前踢拒门", type: "kick", dist: ["far", "mid"], dmg: 13, post: 13, sp: 11, tp: 2, hit: 0.64, risk: 0.16, style: "mma" },
  advance: { name: "前压入身", type: "footwork", dist: ["far", "mid"], dmg: 0, post: 0, sp: 5, tp: 1, hit: 1, risk: 0.12, style: "mma" },
  retreat: { name: "后撤拉开", type: "footwork", dist: ["mid", "close", "ground"], dmg: 0, post: 0, sp: 5, tp: 1, hit: 1, risk: 0.08, style: "street" },
  grip: { name: "抓把控腕", type: "grapple", dist: ["close"], dmg: 4, post: 16, sp: 10, tp: 1, hit: 0.72, risk: 0.12, style: "mma" },
  takedown: { name: "抱摔切入", type: "grapple", dist: ["close"], dmg: 16, post: 22, sp: 18, tp: 2, hit: 0.58, risk: 0.25, style: "mma" },
  sprawl: { name: "防摔下压", type: "defense", dist: ["mid", "close"], dmg: 0, post: 8, sp: 10, tp: 1, hit: 1, risk: 0.05, style: "mma" },
  sidecontrol: { name: "侧压控制", type: "ground", dist: ["ground"], dmg: 9, post: 18, sp: 12, tp: 2, hit: 0.72, risk: 0.10, style: "mma" },
  escape: { name: "地面脱身", type: "ground", dist: ["ground"], dmg: 0, post: 0, sp: 13, tp: 2, hit: 0.70, risk: 0.12, style: "mma" },
  dirtyescape: { name: "夺路就跑", type: "dirty", dist: ["far", "mid", "close"], dmg: 0, post: 0, sp: 10, tp: 1, hit: 0.76, risk: 0.10, style: "street" },
  talkdown: { name: "言语降温", type: "dirty", dist: ["far", "mid", "close"], dmg: 0, post: 0, sp: 4, tp: 1, hit: 0.58, risk: 0.05, style: "street" },
  palm: { name: "掌根短击", type: "strike", dist: ["close"], dmg: 16, post: 20, sp: 13, tp: 2, hit: 0.66, risk: 0.18, style: "traditional" },
  offbalance: { name: "破平衡", type: "grapple", dist: ["close"], dmg: 5, post: 24, sp: 12, tp: 2, hit: 0.65, risk: 0.16, style: "traditional" },
  mystic: { name: "混元一气掌", type: "mystic", dist: ["far", "mid"], dmg: 8, post: 6, sp: 24, tp: 3, hit: 0.36, risk: 0.34, style: "traditional" }
});

const ENEMY_TEMPLATES = Object.freeze({
  E01: { id: "E01", name: "半年拳击新人", hp: 92, sp: 88, posture: 72, morale: 68, calm: 58, preferredRange: "mid", stats: { str: 42, end: 48, spd: 56, tec: 52, tou: 45, bal: 48, rea: 50, jud: 42 }, skills: ["jab", "straight", "guard", "retreat"], ai: "boxer" },
  E02: { id: "E02", name: "公园推手大爷", hp: 82, sp: 94, posture: 86, morale: 60, calm: 72, preferredRange: "close", stats: { str: 38, end: 55, spd: 34, tec: 54, tou: 45, bal: 70, rea: 42, jud: 62 }, skills: ["advance", "grip", "offbalance", "palm", "guard"], ai: "pushhand" },
  E03: { id: "E03", name: "流量大师学徒", hp: 76, sp: 78, posture: 62, morale: 88, calm: 48, preferredRange: "mid", stats: { str: 35, end: 38, spd: 42, tec: 40, tou: 35, bal: 38, rea: 39, jud: 45 }, skills: ["mystic", "palm", "talkdown", "retreat"], ai: "mystic" },
  E04: { id: "E04", name: "健身硬汉挑战者", hp: 118, sp: 82, posture: 78, morale: 78, calm: 38, preferredRange: "close", stats: { str: 64, end: 46, spd: 38, tec: 32, tou: 58, bal: 42, rea: 36, jud: 32 }, skills: ["straight", "lowkick", "advance", "guard"], ai: "brawler" },
  E05: { id: "E05", name: "拳馆陪练", hp: 110, sp: 105, posture: 88, morale: 68, calm: 72, preferredRange: "mid", stats: { str: 50, end: 58, spd: 52, tec: 60, tou: 54, bal: 55, rea: 57, jud: 58 }, skills: ["jab", "straight", "guard", "dodge", "lowkick"], ai: "coach" },
  E06: { id: "E06", name: "MMA体验学员", hp: 112, sp: 112, posture: 86, morale: 68, calm: 63, preferredRange: "close", stats: { str: 52, end: 62, spd: 50, tec: 58, tou: 52, bal: 60, rea: 55, jud: 52 }, skills: ["advance", "grip", "takedown", "sprawl", "sidecontrol", "escape", "jab"], ai: "grappler" },
  E07: { id: "E07", name: "木棍小混混", hp: 90, sp: 82, posture: 70, morale: 80, calm: 58, preferredRange: "far", stats: { str: 45, end: 42, spd: 46, tec: 28, tou: 42, bal: 40, rea: 43, jud: 30 }, skills: ["advance", "dirtyescape", "talkdown", "straight"], ai: "weapon", weapon: true },
  E08: { id: "E08", name: "散打大学生", hp: 130, sp: 125, posture: 96, morale: 72, calm: 76, preferredRange: "mid", stats: { str: 58, end: 64, spd: 60, tec: 66, tou: 58, bal: 62, rea: 63, jud: 60 }, skills: ["jab", "straight", "lowkick", "frontkick", "sprawl", "dodge"], ai: "sanda" },
  E09: { id: "E09", name: "地下赛试探者", hp: 138, sp: 118, posture: 92, morale: 82, calm: 62, preferredRange: "close", stats: { str: 62, end: 60, spd: 57, tec: 58, tou: 62, bal: 58, rea: 56, jud: 50 }, skills: ["straight", "advance", "grip", "takedown", "dirtyescape", "lowkick"], ai: "dirtymix" },
  E18: { id: "E18", name: "陈见锋", hp: 165, sp: 150, posture: 120, morale: 82, calm: 86, preferredRange: "mid", stats: { str: 68, end: 75, spd: 66, tec: 78, tou: 70, bal: 75, rea: 72, jud: 80 }, skills: ["jab", "straight", "frontkick", "sprawl", "advance", "grip", "takedown", "guard", "escape"], ai: "boss" }
});

export const ENEMY_AI_RULES = Object.freeze({
  E01: {
    name: "半年拳击新人",
    profile: "boxer",
    preferredRange: "mid",
    reads: ["重复出拳", "重招回收", "近身压力"],
    responses: ["guard", "jab", "retreat", "straight"]
  },
  E05: {
    name: "拳馆陪练",
    profile: "coach",
    preferredRange: "mid",
    reads: ["重招回收", "连续同类动作", "防守等待", "架势低位"],
    responses: ["straight", "guard", "jab", "lowkick", "dodge"]
  },
  E06: {
    name: "MMA体验学员",
    profile: "grappler",
    preferredRange: "close",
    reads: ["近身", "前压", "防摔", "地面上下位"],
    responses: ["advance", "grip", "takedown", "sidecontrol", "escape", "jab"]
  },
  E07: {
    name: "木棍小混混",
    profile: "weapon",
    preferredRange: "far",
    reads: ["撤离", "降温", "拉开距离", "近身硬拼"],
    responses: ["advance", "straight", "guard", "retreat"],
    weapon: true
  },
  E18: {
    name: "陈见锋",
    profile: "boss",
    preferredRange: "mid",
    reads: ["高级读板", "重复动作", "重招回收", "拳摔转换", "地面态势", "防守诱导"],
    responses: ["jab", "frontkick", "straight", "guard", "sprawl", "grip", "takedown", "escape"]
  },
  default: {
    name: "通用对手",
    profile: "generic",
    preferredRange: "mid",
    reads: ["距离", "架势", "体力"],
    responses: ["jab", "guard", "advance", "retreat"]
  }
});

export function previewPlayerAction(state, skillId) {
  const combatState = normalizeCombatState(state);
  const id = actionId(skillId);
  const skill = SKILLS[id];

  if (!skill) {
    return {
      skillId: id,
      valid: false,
      reason: "未知技能",
      min: 0,
      max: 0,
      posture: 0,
      hit: 0,
      risk: 0,
      sp: 0,
      tp: 0,
      dist: ""
    };
  }

  const reason = invalidPlayerActionReason(combatState, id);
  const base = calcPlayerBaseDamage(combatState, id);
  let min = 0;
  let max = 0;
  if (base > 0) {
    min = Math.round(base * COMBAT_TUNING.playerDmgScale * 0.9);
    max = Math.round(base * COMBAT_TUNING.playerDmgScale * 1.12);
    if (combatState.currentEnemyResponse?.intent === "guard") {
      min = Math.max(COMBAT_TUNING.minChipDmg, Math.round(min * 0.45));
      max = Math.max(COMBAT_TUNING.minChipDmg, Math.round(max * 0.45));
    }
  }

  return {
    skillId: id,
    name: skill.name,
    type: skill.type,
    valid: !reason,
    reason,
    min,
    max,
    posture: calcPlayerPostureDamage(combatState, id),
    hit: Math.round(playerHitChance(combatState, id) * 100),
    risk: Math.round(skillRisk(combatState, skill) * 100),
    sp: skill.sp,
    tp: skill.tp,
    dist: skill.dist.join("/"),
    target: combatState.target,
    distance: combatState.distance,
    ground: combatState.ground
  };
}

export function chooseEnemyResponse(context, rng = Math.random) {
  const rawState = context?.combatState || context?.state || context || {};
  const combatState = normalizeCombatState(rawState);
  const enemy = combatState.enemy;
  const rule = ENEMY_AI_RULES[enemy.id] || ENEMY_AI_RULES.default;
  const playerActionId = actionId(context?.playerAction || context?.action || context?.skillId);
  const playerSkill = SKILLS[playerActionId] || null;
  const facts = readContext(combatState, playerActionId, playerSkill);

  if (facts.enemyPostureRatio < 0.34) {
    return response(enemy, rule, "抱架回稳", "guard", "guard", "对手架势被打散，先收肘回稳。", "低", "低扫/前压/抓把", "low_posture");
  }

  if (facts.enemySpRatio < 0.28) {
    return response(enemy, rule, "喘气回气", "guard", "guard", "对手呼吸变重，想用抱架拖一拍。", "低", "压制/低扫/抓把", "low_sp");
  }

  if (combatState.distance === "ground") {
    return groundResponse(enemy, rule, combatState, facts, rng);
  }

  if (enemy.id === "E01" || enemy.ai === "boxer") {
    return boxerResponse(enemy, rule, combatState, facts, rng);
  }

  if (enemy.id === "E05" || enemy.ai === "coach") {
    return coachResponse(enemy, rule, combatState, facts, rng);
  }

  if (enemy.id === "E06" || enemy.ai === "grappler") {
    return grapplerResponse(enemy, rule, combatState, facts, rng);
  }

  if (enemy.id === "E07" || enemy.ai === "weapon" || enemy.weapon) {
    return weaponResponse(enemy, rule, combatState, facts, rng);
  }

  if (enemy.id === "E18" || enemy.ai === "boss") {
    return bossResponse(enemy, rule, combatState, facts, rng);
  }

  return genericResponse(enemy, rule, combatState, facts, rng);
}

export function resolveCombatExchange(state, selectedActions, rng = Math.random) {
  const combatState = normalizeCombatState(state);
  const actions = normalizeActions(selectedActions);
  const steps = [];
  const resting = actions.length === 0;

  resetCombo(combatState);

  if (resting) {
    const restStep = resolveRest(combatState);
    pushStep(combatState, steps, restStep);
    if (!isTerminal(combatState)) {
      const enemyResponse = chooseEnemyResponse({ combatState, playerAction: "rest", steps }, rng);
      const enemyStep = resolveEnemyAction(combatState, enemyResponse, rng);
      pushStep(combatState, steps, enemyStep);
    }
  } else {
    for (let i = 0; i < actions.length; i += 1) {
      if (isTerminal(combatState)) break;

      const id = actions[i];
      const reason = invalidPlayerActionReason(combatState, id);
      if (reason) {
        pushStep(combatState, steps, invalidStep(id, reason));
        if (shouldEnemyRespondToInvalid(reason) && !isTerminal(combatState)) {
          const enemyResponse = chooseEnemyResponse({
            combatState,
            playerAction: id,
            actionIndex: i,
            selectedActions: actions,
            invalidReason: reason,
            steps
          }, rng);
          const enemyStep = resolveEnemyAction(combatState, enemyResponse, rng);
          pushStep(combatState, steps, enemyStep);
          combatState.lastEnemyResponse = enemyResponse;
          clearImmediateDefense(combatState);
        }
        continue;
      }

      const enemyResponse = chooseEnemyResponse({
        combatState,
        playerAction: id,
        actionIndex: i,
        selectedActions: actions,
        steps
      }, rng);
      combatState.currentEnemyResponse = enemyResponse;

      const playerStep = resolvePlayerAction(combatState, id, rng);
      pushStep(combatState, steps, playerStep);

      if (isTerminal(combatState)) break;

      const enemyStep = resolveEnemyAction(combatState, enemyResponse, rng);
      pushStep(combatState, steps, enemyStep);
      combatState.lastEnemyResponse = enemyResponse;
      clearImmediateDefense(combatState);
    }
  }

  applyEndOfExchangeRecovery(combatState, resting, steps);
  finishExchange(combatState, resting ? ["rest"] : actions);

  return {
    steps,
    combatState: publicCombatState(combatState),
    finished: Boolean(combatState.finished)
  };
}

function boxerResponse(enemy, rule, combatState, facts, rng) {
  if (facts.repeated || facts.heavy) {
    return response(enemy, rule, "防守反击", "counter", "guard", "对手看出你重复出手，等你回收慢的空档。", "中", "刺拳探路/低扫/别贪连段", "boxing_read");
  }
  if (combatState.distance === "close") {
    return response(enemy, rule, "拉开拳距", "disengage", "retreat", "对手不想在近身乱缠，先退回拳距。", "低", "前压/低扫/抓把", "keep_range");
  }
  if (combatState.distance === "far") {
    return response(enemy, rule, "重新入距", "pressure", "advance", "对手小步靠近，想回到刺拳距离。", "中", "前踢/后撤", "enter_range");
  }
  if (facts.playerDefensive && rng() < 0.45) {
    return response(enemy, rule, "基础直拳", "probe", "straight", "你刚稳住架势，对手用直拳验你的抱架。", "中", "侧步/刺拳", "test_guard");
  }
  return response(enemy, rule, "保距刺拳", "probe", "jab", "对手肩膀微动，想用刺拳维持中距离。", "中", "抱架/侧步/前压", "range_jab");
}

function coachResponse(enemy, rule, combatState, facts, rng) {
  if (facts.heavy || facts.repeated) {
    return response(enemy, rule, "抓回收", "counter", "straight", "陪练等你重招后的回收空档。", "高", "试探/抱架/侧步", "coach_counter");
  }
  if (facts.playerDefensive && rng() < 0.55) {
    return response(enemy, rule, "低扫打节奏", "probe", "lowkick", "你在等反击，陪练改扫前腿。", "中", "后撤/前踢", "lowkick_tempo");
  }
  if (combatState.distance === "close") {
    return response(enemy, rule, "换步脱离", "disengage", "dodge", "陪练不和你硬缠，先换步离线。", "低", "低扫/前压", "angle_out");
  }
  if (rng() < 0.42) {
    return response(enemy, rule, "防守反击", "counter", "guard", "陪练等你出拳后的回收空档。", "中", "试探/低扫", "coach_guard");
  }
  return response(enemy, rule, "稳定组合", "probe", "straight", "陪练用基础组合验你的架势。", "中", "抱架/侧步", "basic_combo");
}

function grapplerResponse(enemy, rule, combatState, facts) {
  if (facts.playerAntiGrapple) {
    return response(enemy, rule, "拳摔假动作", "probe", "jab", "你已经沉髋防摔，对手先用拳把你架势抬起来。", "中", "保持距离/刺拳", "sprawl_answer");
  }
  if (combatState.distance === "close" || facts.playerPressing || facts.playerGrappling) {
    return response(enemy, rule, "抱摔切入", "clinch", "takedown", "对手低头压肩，准备抱摔。", "高", "防摔/前踢/后撤", "takedown_entry");
  }
  if (combatState.distance === "far" || combatState.distance === "mid") {
    return response(enemy, rule, "压进缠斗", "clinch", "advance", "对手不想和你拉拳距，准备贴身。", "中", "前踢/刺拳", "close_distance");
  }
  return response(enemy, rule, "抓把找腿", "clinch", "grip", "对手先抢手腕，再找抱摔角度。", "中", "防摔/后撤", "grip_entry");
}

function weaponResponse(enemy, rule, combatState, facts, rng) {
  if (facts.playerDeescalating && enemy.morale < 42) {
    return response(enemy, rule, "犹豫后撤", "disengage", "retreat", "对手被你拖住情绪，脚步开始后退。", "低", "继续降温/撤离", "deescalated");
  }
  if (facts.playerKeptAway) {
    return response(enemy, rule, "逼近恐吓", "pressure", "advance", "你在拉开距离，对手边骂边追。", "中", "降温/继续后撤", "chase");
  }
  if (combatState.distance === "far" && rng() < 0.65) {
    return response(enemy, rule, "举棍逼近", "pressure", "advance", "对手把手里的东西抬起来，先压你的空间。", "中", "后撤/前踢/降温", "weapon_advance");
  }
  return response(enemy, rule, "武器威胁", "weapon", "straight", "对手手里东西抬起来了，命中可能造成新伤。", "高", "撤离/降温/保持距离", "weapon_swing");
}

function bossResponse(enemy, rule, combatState, facts, rng) {
  if (facts.repeated) {
    return response(enemy, rule, "读板反制", "counter", facts.playerGrappling ? "sprawl" : "straight", "陈见锋看穿你的重复节奏，直接堵线路。", "高", "换招/假动作/先稳架", "boss_read_repeat");
  }
  if (facts.heavy) {
    return response(enemy, rule, "冷静截击", "counter", "frontkick", "他看见你急着出重招，准备用前踢截住。", "高", "先试探/侧步", "boss_heavy_read");
  }
  if (combatState.distance === "close") {
    if (facts.playerAntiGrapple) {
      return response(enemy, rule, "拳法拆防摔", "probe", "straight", "你沉髋等抱摔，他先用拳逼你抬头。", "中", "抱架/侧步", "anti_sprawl_boxing");
    }
    return response(enemy, rule, "拳摔转换", "clinch", "grip", "陈见锋用拳逼你护头，再抢手腕。", "高", "防摔/沉架", "clinch_chain");
  }
  if (facts.playerDefensive && rng() < 0.55) {
    return response(enemy, rule, "低线打断", "probe", "frontkick", "你等他进攻，他改用前踢停住你的节奏。", "中", "侧步/低扫", "stop_rhythm");
  }
  if (rng() < 0.5) {
    return response(enemy, rule, "稳定刺拳", "probe", "jab", "他不急，只用刺拳压你的节奏。", "中", "侧步/前压", "boss_jab");
  }
  return response(enemy, rule, "前踢拒门", "counter", "frontkick", "他不让你轻易进身。", "中", "观察/低扫", "boss_frontkick");
}

function groundResponse(enemy, rule, combatState) {
  if (combatState.ground === "player_top") {
    return response(enemy, rule, "地面脱身", "ground", "escape", "对手被压住，先找空间转身。", "中", "侧压/稳住上位", "bottom_escape");
  }
  if (combatState.ground === "player_bottom") {
    return response(enemy, rule, "地面压制", "ground", "sidecontrol", "对手想巩固上位，消耗你体力。", "高", "地面脱身", "top_control");
  }
  return response(enemy, rule, "地面抢位", "ground", enemy.ai === "grappler" || enemy.ai === "boss" ? "sidecontrol" : "escape", "双方在地面找位置。", "中", "脱身/侧压", "ground_scramble");
}

function genericResponse(enemy, rule, combatState, facts, rng) {
  if (facts.heavy && rng() < 0.55) {
    return response(enemy, rule, "防守反击", "counter", "guard", "对手等你回收慢的空档。", "中", "刺拳/侧步", "generic_counter");
  }
  if (combatState.distance === "far") {
    return response(enemy, rule, "压进", "pressure", "advance", "对手试着缩短距离。", "中", "前踢/后撤", "generic_advance");
  }
  return response(enemy, rule, "试探", "probe", "jab", "对手先用基础动作试探。", "低", "抱架/观察", "generic_probe");
}

function resolveRest(combatState) {
  combatState.playerBuff = { def: 0.18, dodge: 0, anti: 0, nextHit: 0, counter: 0 };
  const fx = [makeFx(combatState, "guard", "player", 0, "喘息", "rest", { icon: "SP" })];
  return {
    actor: "player",
    action: { id: "rest", name: "喘息/过回合", type: "rest" },
    result: { ok: true, resting: true, defense: combatState.playerBuff.def },
    log: ["你选择喘息，稳住呼吸并恢复体能。"],
    fx
  };
}

function resolvePlayerAction(combatState, id, rng) {
  const skill = SKILLS[id];
  const player = combatState.player;
  const enemy = combatState.enemy;
  const stats = derivedStats(combatState);
  const fx = [];
  const log = [];

  player.sp = clamp(player.sp - skill.sp, 0, player.spMax);
  learnFromUse(combatState, id, skill);

  if (id === "guard") {
    combatState.playerBuff.def = COMBAT_TUNING.guardDef + styleBonus(combatState, "boxing", 0.0008);
    fx.push(makeFx(combatState, "guard", "player", 0, "抱架", id));
    log.push("你收紧【防守抱架】，下一次受伤明显降低。");
    return step("player", id, { ok: true, defense: combatState.playerBuff.def, spCost: skill.sp }, log, fx);
  }

  if (id === "dodge") {
    combatState.playerBuff.dodge = COMBAT_TUNING.dodgeDef + Math.max(0, stats.spd - 50) * 0.003 + effect(combatState, "dodge");
    combatState.playerBuff.counter = (combatState.playerBuff.counter || 0) + 0.04;
    fx.push(makeFx(combatState, "guard", "player", 0, "侧步", id));
    log.push("你侧步离线，降低被命中率，并给下一击制造角度。");
    return step("player", id, { ok: true, dodge: combatState.playerBuff.dodge, spCost: skill.sp }, log, fx);
  }

  if (id === "sprawl") {
    combatState.playerBuff.anti = COMBAT_TUNING.sprawlAnti + Math.max(0, stats.bal - 50) * 0.003 + styleBonus(combatState, "mma", 0.0012);
    combatState.playerBuff.def = 0.16;
    fx.push(makeFx(combatState, "guard", "player", 0, "防摔", id));
    log.push("你沉髋下压，专门防对手抱摔切入。");
    return step("player", id, { ok: true, antiGrapple: combatState.playerBuff.anti, spCost: skill.sp }, log, fx);
  }

  if (id === "advance") {
    combatState.distance = combatState.distance === "far" ? "mid" : "close";
    combatState.playerBuff.nextHit = (combatState.playerBuff.nextHit || 0) + 0.04 + Math.max(0, stats.spd - 50) * 0.001;
    fx.push(makeFx(combatState, "guard", "player", 0, "前压", id));
    log.push(`你前压入身，距离变为【${distText(combatState.distance)}】。`);
    return step("player", id, { ok: true, distance: combatState.distance, nextHit: combatState.playerBuff.nextHit, spCost: skill.sp }, log, fx);
  }

  if (id === "retreat" || id === "dirtyescape") {
    if (combatState.distance === "ground") {
      combatState.distance = "close";
      combatState.ground = "none";
    } else {
      combatState.distance = combatState.distance === "close" ? "mid" : "far";
    }
    fx.push(makeFx(combatState, "guard", "player", 0, id === "dirtyescape" ? "撤离" : "后撤", id));
    log.push(id === "dirtyescape" ? "你选择夺路撤离，风险降低。" : `你后撤拉开，距离变为【${distText(combatState.distance)}】。`);

    if (id === "dirtyescape" && enemy.weapon) {
      const exitChance = clamp(0.58 + (stats.spd - 50) * 0.003 + (stats.jud - 50) * 0.003 + styleBonus(combatState, "street", 0.0015), 0.35, 0.90);
      if (rng() < exitChance) {
        combatState.finished = true;
        combatState.ended = true;
        combatState.winner = "player";
        combatState.finishReason = "riskwin";
        log.push("风险胜利：你没有把街头冲突变成硬拼。");
      }
    }

    return step("player", id, { ok: true, distance: combatState.distance, ground: combatState.ground, riskWin: combatState.finishReason === "riskwin", spCost: skill.sp }, log, fx);
  }

  if (id === "talkdown") {
    const ok = rng() < clamp(playerHitChance(combatState, id) + (stats.jud - 50) * 0.002 + styleBonus(combatState, "street", 0.0012), 0.08, 0.90);
    enemy.morale = clamp(enemy.morale - (ok ? 18 : 6), 0, 100);
    fx.push(makeFx(combatState, "guard", "player", 0, ok ? "降温" : "拖住", id));
    log.push(ok ? "你言语降温成功，对手敌意明显下降。" : "你尝试降温，但对手只是犹豫了一下。");
    return step("player", id, { ok: true, success: ok, enemyMorale: enemy.morale, spCost: skill.sp }, log, fx);
  }

  if (id === "escape") {
    const ok = rng() < clamp(playerHitChance(combatState, id) + (combatState.ground === "player_bottom" ? 0 : 0.1) + (stats.bal - 50) * 0.002 + styleBonus(combatState, "mma", 0.001), 0.08, 0.92);
    if (ok) {
      combatState.distance = "close";
      combatState.ground = "none";
      fx.push(makeFx(combatState, "guard", "player", 0, "脱身", id));
      log.push("你地面脱身成功，回到近身站立。");
    } else {
      fx.push(makeFx(combatState, "miss", "player", 0, "脱身失败", id));
      log.push("你尝试脱身失败，仍在地面压力中。");
    }
    return step("player", id, { ok: true, success: ok, distance: combatState.distance, ground: combatState.ground, spCost: skill.sp }, log, fx);
  }

  const hit = rng() < playerHitChance(combatState, id);
  if (!hit) {
    player.posture = clamp(player.posture - Math.round(skillRisk(combatState, skill) * 16), 0, player.postureMax);
    fx.push(makeFx(combatState, "miss", "player", 0, "MISS", id));
    log.push(`你使用【${skill.name}】落空，暴露破绽。`);
    return step("player", id, { ok: true, hit: false, spCost: skill.sp, playerPosture: player.posture }, log, fx);
  }

  let damage = calcPlayerDamage(combatState, id, rng);
  if (combatState.target === "head") damage = Math.round(damage * 1.10);
  if (combatState.target === "leg") {
    damage = Math.round(damage * 0.86);
    enemy.posture = clamp(enemy.posture - 8 - Math.floor(Math.max(0, stats.spd - 50) / 12), 0, enemy.postureMax);
  }

  const guarded = combatState.currentEnemyResponse?.intent === "guard";
  if (guarded) {
    damage = Math.max(COMBAT_TUNING.minChipDmg, Math.round(damage * 0.45));
    enemy.sp = clamp(enemy.sp - COMBAT_TUNING.blockSpDrain, 0, enemy.spMax);
  }

  enemy.hp = clamp(enemy.hp - damage, 0, enemy.hpMax);
  const postureDamage = calcPlayerPostureDamage(combatState, id);
  enemy.posture = clamp(enemy.posture - postureDamage, 0, enemy.postureMax);
  enemy.morale = clamp(enemy.morale - 3, 0, 100);

  log.push(guarded
    ? `你使用【${skill.name}】被对手防下，但仍有 ${damage} 点削血，架势-${postureDamage}，对手体力-${COMBAT_TUNING.blockSpDrain}。`
    : `你使用【${skill.name}】命中${targetText(combatState.target)}，造成 ${damage} 伤害，架势-${postureDamage}。`);
  fx.push(makeFx(combatState, "hit", "player", damage, guarded ? "格挡削血" : damage >= 24 ? "重击" : targetText(combatState.target), id));

  applyPlayerHitSpecials(combatState, id, log, fx, rng);
  if (enemy.posture <= 0) {
    enemy.posture = Math.round(enemy.postureMax * 0.42);
    enemy.calm = clamp(enemy.calm - 8, 0, 100);
    log.push("BREAK！对手架势崩坏，下回合更容易被打中。");
    fx.push(makeFx(combatState, "break", "player", 0, "眩晕", id, { icon: "!" }));
  }

  if (enemy.hp <= 0) {
    combatState.finished = true;
    combatState.ended = true;
    combatState.winner = "player";
    combatState.finishReason = "ko";
  }

  consumeOffensiveBuff(combatState, id);

  return step("player", id, {
    ok: true,
    hit: true,
    damage,
    postureDamage,
    guarded,
    target: combatState.target,
    distance: combatState.distance,
    ground: combatState.ground,
    enemyHp: enemy.hp,
    enemyPosture: enemy.posture,
    spCost: skill.sp
  }, log, fx);
}

function resolveEnemyAction(combatState, plan, rng) {
  const player = combatState.player;
  const enemy = combatState.enemy;
  const skill = SKILLS[plan.skill] || SKILLS.jab;
  const stats = derivedStats(combatState);
  const fx = [];
  const log = [];

  combatState.currentEnemyResponse = plan;

  if (skill.sp > enemy.sp) {
    enemy.sp = clamp(enemy.sp + COMBAT_TUNING.lowSpRecover, 0, enemy.spMax);
    fx.push(makeFx(combatState, "guard", "enemy", 0, "回气", plan.skill, { icon: "SP" }));
    log.push(`${enemy.name} 体力不足，选择回气。`);
    return step("enemy", plan.skill, { ok: true, intent: "recover", recovered: COMBAT_TUNING.lowSpRecover, enemySp: enemy.sp, response: plan }, log, fx);
  }

  enemy.sp = clamp(enemy.sp - (skill.sp || 6), 0, enemy.spMax);

  if (plan.skill === "guard") {
    enemy.posture = clamp(enemy.posture + 16, 0, enemy.postureMax);
    fx.push(makeFx(combatState, "guard", "enemy", 0, "回稳", plan.skill));
    log.push(`${enemy.name} 收紧抱架，恢复架势。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, enemyPosture: enemy.posture, spCost: skill.sp }, log, fx);
  }

  if (plan.skill === "sprawl") {
    enemy.posture = clamp(enemy.posture + 8, 0, enemy.postureMax);
    fx.push(makeFx(combatState, "guard", "enemy", 0, "防摔", plan.skill));
    log.push(`${enemy.name} 沉髋下压，先堵住你的抱摔线路。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, antiGrapple: true, enemyPosture: enemy.posture, spCost: skill.sp }, log, fx);
  }

  if (plan.skill === "escape") {
    const successChance = clamp(0.58 + (enemy.stats.bal - 50) * 0.003 + (enemy.stats.tec - 50) * 0.002, 0.25, 0.88);
    const ok = combatState.distance !== "ground" || rng() < successChance;
    if (ok) {
      combatState.distance = "close";
      combatState.ground = "none";
      fx.push(makeFx(combatState, "guard", "enemy", 0, "脱身", plan.skill));
      log.push(`${enemy.name} 地面脱身，重新回到近身站立。`);
    } else {
      fx.push(makeFx(combatState, "miss", "enemy", 0, "脱身失败", plan.skill));
      log.push(`${enemy.name} 尝试脱身失败，仍被压在地面。`);
    }
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, success: ok, successChance: Math.round(successChance * 100), distance: combatState.distance, ground: combatState.ground, spCost: skill.sp }, log, fx);
  }

  if (plan.skill === "advance") {
    combatState.distance = combatState.distance === "far" ? "mid" : "close";
    fx.push(makeFx(combatState, "guard", "enemy", 0, "压进", plan.skill));
    log.push(`${enemy.name} 主动压进，距离变为【${distText(combatState.distance)}】。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, distance: combatState.distance, spCost: skill.sp }, log, fx);
  }

  if (plan.skill === "retreat" || plan.skill === "dodge") {
    combatState.distance = combatState.distance === "close" ? "mid" : "far";
    fx.push(makeFx(combatState, "guard", "enemy", 0, plan.skill === "dodge" ? "换步" : "后撤", plan.skill));
    log.push(`${enemy.name} ${plan.skill === "dodge" ? "换步离线" : "后撤调整"}，重新拉开拳距。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, distance: combatState.distance, spCost: skill.sp }, log, fx);
  }

  if (combatState.playerBuff.dodge && rng() < combatState.playerBuff.dodge) {
    fx.push(makeFx(combatState, "guard", "player", 0, "闪开", plan.skill));
    log.push(`你侧步成功，避开 ${enemy.name} 的【${skill.name}】。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, hit: false, dodged: true, spCost: skill.sp }, log, fx);
  }

  const hitChance = enemyHitChance(combatState, skill, plan);
  if (rng() > hitChance) {
    fx.push(makeFx(combatState, "miss", "enemy", 0, "MISS", plan.skill));
    player.calm = clamp(player.calm + 2, 0, 100);
    log.push(`${enemy.name} 的【${skill.name}】被你化解/落空。`);
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, hit: false, hitChance: Math.round(hitChance * 100), spCost: skill.sp }, log, fx);
  }

  if (plan.skill === "takedown" || (plan.intent === "clinch" && skill.type === "grapple")) {
    const anti = (combatState.playerBuff.anti || 0) + (combatState.skillState.sprawl ? 0.12 : 0) + (combatState.equipSkills.includes("sprawl") ? 0.08 : 0) + Math.max(0, stats.bal - 50) * 0.003 + styleBonus(combatState, "mma", 0.001);
    const successChance = clamp(0.42 + (enemy.stats.bal - 50) * 0.004 - anti, 0.08, 0.82);
    const ok = rng() < successChance;
    if (ok) {
      combatState.distance = "ground";
      combatState.ground = "player_bottom";
      player.posture = clamp(player.posture - 20, 0, player.postureMax);
      fx.push(makeFx(combatState, "break", "enemy", 0, "TAKEDOWN", plan.skill, { icon: "DOWN" }));
      log.push(`${enemy.name} 抱摔成功！你进入地面下位。`);
    } else {
      fx.push(makeFx(combatState, "guard", "player", 0, "顶住", plan.skill));
      log.push(`你顶住了 ${enemy.name} 的抱摔，没有被带倒。`);
    }
    return step("enemy", plan.skill, { ok: true, intent: plan.intent, response: plan, hit: true, takedown: ok, successChance: Math.round(successChance * 100), distance: combatState.distance, ground: combatState.ground, spCost: skill.sp }, log, fx);
  }

  const guarded = Boolean(combatState.playerBuff.def);
  let damage = calcEnemyDamage(combatState, skill, plan, rng);
  if (guarded) {
    damage = Math.max(COMBAT_TUNING.minChipDmg, Math.round(damage * 0.72));
    player.sp = clamp(player.sp - COMBAT_TUNING.blockSpDrain, 0, player.spMax);
  }

  player.hp = clamp(player.hp - damage, 0, player.hpMax);
  const postureDamage = Math.round((skill.post || 0) * COMBAT_TUNING.postureDmgScale);
  player.posture = clamp(player.posture - postureDamage, 0, player.postureMax);
  player.morale = clamp(player.morale - 2, 0, 100);

  log.push(guarded
    ? `${enemy.name} 的【${skill.name}】被你抱架防下，但仍有 ${damage} 点削血，架势-${postureDamage}，你体力-${COMBAT_TUNING.blockSpDrain}。`
    : `${enemy.name} 使用【${skill.name}】反击，造成 ${damage} 伤害，架势-${postureDamage}。`);
  fx.push(makeFx(combatState, "hit", "enemy", damage, guarded ? "格挡削血" : damage >= 24 ? "重击" : targetText("body"), plan.skill));

  if (enemy.weapon && rng() < injuryChance(combatState, 0.15)) {
    player.injuries = Array.isArray(player.injuries) ? player.injuries : [];
    player.injuries.push({ name: "新伤：擦伤/扭伤", turn: 3 });
    player.hpMax = Math.max(1, player.hpMax - 6);
    player.hp = clamp(player.hp, 0, player.hpMax);
    log.push("武器威胁造成新伤，生命上限临时下降。");
  }

  if (player.posture <= 0) {
    player.posture = Math.round(player.postureMax * 0.40);
    player.calm = clamp(player.calm - 10, 0, 100);
    log.push("你的架势崩坏！下一回合要先稳住。");
    fx.push(makeFx(combatState, "break", "enemy", 0, "眩晕", plan.skill, { icon: "!" }));
  }

  if (player.hp <= 0) {
    combatState.finished = true;
    combatState.ended = true;
    combatState.winner = "enemy";
    combatState.finishReason = "ko";
  }

  return step("enemy", plan.skill, {
    ok: true,
    intent: plan.intent,
    response: plan,
    hit: true,
    damage,
    postureDamage,
    guarded,
    playerHp: player.hp,
    playerPosture: player.posture,
    hitChance: Math.round(hitChance * 100),
    spCost: skill.sp
  }, log, fx);
}

function applyPlayerHitSpecials(combatState, id, log, fx, rng) {
  const enemy = combatState.enemy;
  const stats = derivedStats(combatState);

  if (id === "frontkick" && ["pressure", "clinch"].includes(combatState.currentEnemyResponse?.intent)) {
    combatState.distance = "far";
    log.push("前踢把对手顶回远距，前压/抱摔被截住。");
  }

  if (id === "lowkick") {
    const drain = 5 + Math.floor(Math.max(0, stats.spd - 50) / 14);
    enemy.sp = clamp(enemy.sp - drain, 0, enemy.spMax);
    log.push("低扫打断前腿，对手体力被拖慢。");
  }

  if (id === "grip") {
    combatState.playerBuff.nextHit = (combatState.playerBuff.nextHit || 0) + 0.10 + (stats.str - 50) * 0.001 + styleBonus(combatState, "mma", 0.001);
    log.push("抓把成功：下一次抱摔/近身命中提高。");
  }

  if (id === "takedown") {
    const chance = clamp(0.46 + (stats.str - 50) * 0.003 + (stats.bal - 50) * 0.004 + styleBonus(combatState, "mma", 0.0015) + (combatState.playerBuff.nextHit || 0), 0.18, 0.82);
    if (rng() < chance) {
      combatState.distance = "ground";
      combatState.ground = "player_top";
      enemy.posture = clamp(enemy.posture - 16, 0, enemy.postureMax);
      fx.push(makeFx(combatState, "break", "player", 0, "TAKEDOWN", id, { icon: "DOWN" }));
      log.push("TAKEDOWN！你抱摔成功，进入地面上位。");
    } else {
      combatState.distance = "ground";
      combatState.ground = "ground_neutral";
      log.push("抱摔没有完全成功，双方进入地面缠斗。");
    }
  }

  if (id === "sidecontrol") {
    const drain = 14 + Math.floor((combatState.styles.mma || 0) / 18);
    enemy.sp = clamp(enemy.sp - drain, 0, enemy.spMax);
    log.push("CONTROL！侧压控制消耗了对手体力。");
  }
}

function applyEndOfExchangeRecovery(combatState, resting, steps) {
  if (!combatState.player || !combatState.enemy) return;
  const stats = derivedStats(combatState);
  const playerRecover = COMBAT_TUNING.turnSpRecover + (resting ? COMBAT_TUNING.restSpRecover : 0) + Math.floor(Math.max(0, stats.end - 50) / 8);
  combatState.player.sp = clamp(combatState.player.sp + playerRecover, 0, combatState.player.spMax);
  combatState.enemy.sp = clamp(combatState.enemy.sp + COMBAT_TUNING.enemyTurnSpRecover, 0, combatState.enemy.spMax);
  combatState.player.posture = clamp(combatState.player.posture + (resting ? 8 : 4), 0, combatState.player.postureMax);
  combatState.enemy.posture = clamp(combatState.enemy.posture + 3, 0, combatState.enemy.postureMax);

  const log = resting ? `喘息恢复 ${playerRecover} 体力。` : `回合间隙恢复 ${playerRecover} 体力。`;
  const recoveryStep = {
    actor: "system",
    action: { id: "recover", name: "回合恢复", type: "system" },
    result: { playerSp: combatState.player.sp, enemySp: combatState.enemy.sp, playerRecover, enemyRecover: COMBAT_TUNING.enemyTurnSpRecover },
    log: [log],
    fx: []
  };
  pushStep(combatState, steps, recoveryStep);
}

function finishExchange(combatState, actions) {
  combatState.history = Array.isArray(combatState.history) ? combatState.history : [];
  combatState.history.push({
    round: combatState.round,
    player: actions,
    enemy: combatState.lastEnemyResponse?.skill || combatState.currentEnemyResponse?.skill || null,
    distance: combatState.distance,
    ground: combatState.ground
  });
  combatState.history = combatState.history.slice(-10);
  combatState.lastPlayerActions = actions;
  combatState.round += 1;
  combatState.currentEnemyResponse = null;

  if (!combatState.finished && combatState.round > COMBAT_TUNING.roundLimit) {
    combatState.finished = true;
    combatState.ended = true;
    combatState.finishReason = "round_limit";
    combatState.winner = combatState.enemy.hp <= 0 || combatState.player.hp > combatState.enemy.hp ? "player" : "enemy";
  }
}

function invalidStep(id, reason) {
  return {
    actor: "player",
    action: actionDescriptor(id),
    result: { ok: false, reason },
    log: [`【${SKILLS[id]?.name || id}】无法执行：${reason}。`],
    fx: []
  };
}

function invalidPlayerActionReason(combatState, id) {
  const skill = SKILLS[id];
  if (!skill) return "未知技能";
  if (combatState.hasExplicitSkillState && !combatState.skillState[id]) return "未学会";
  if (combatState.player.sp < skill.sp) return "体力不足";
  if (!skill.dist.includes(combatState.distance)) return `当前距离不能用，需要${skill.dist.join("/")}`;
  if (id === "sidecontrol" && combatState.ground !== "player_top") return "需要地面上位";
  if (id === "escape" && combatState.distance === "ground" && combatState.ground === "player_top") return "上位无需脱身";
  return "";
}

function shouldEnemyRespondToInvalid(reason) {
  return /^当前距离不能用/.test(reason) || reason === "需要地面上位" || reason === "上位无需脱身";
}

function playerHitChance(combatState, id) {
  const skill = SKILLS[id];
  const stats = derivedStats(combatState);
  const mastery = skillMastery(combatState, id);
  const speedHit = ["kick", "footwork", "dirty", "ground"].includes(skill.type) ? 0.0022 : 0.0008;
  const repeatPenalty = COMBAT_TUNING.repeatPenalty * (1 - clamp((stats.jud - 50) * 0.006, 0, 0.35));
  let hit = skill.hit
    + (stats.tec - 50) * 0.004
    + (stats.rea - 50) * 0.002
    + (stats.spd - 50) * speedHit
    + mastery * 0.0015
    + (combatState.playerBuff.nextHit || 0)
    + (combatState.playerBuff.counter || 0);

  const responsePlan = combatState.currentEnemyResponse;
  if (responsePlan?.intent === "guard" && skill.dmg > 0) hit -= 0.08;
  if (responsePlan?.intent === "pressure" && ["jab", "frontkick", "lowkick"].includes(id)) hit += COMBAT_TUNING.counterBonus;
  if (responsePlan?.intent === "clinch" && ["sprawl", "frontkick", "retreat"].includes(id)) hit += COMBAT_TUNING.counterBonus;
  if (responsePlan) hit += scoreSingleCounter(id, responsePlan);
  if (combatState.lastPlayerActions?.slice(-2).every((action) => action === id)) hit -= repeatPenalty;
  if (combatState.target === "head") hit -= 0.08;
  if (combatState.target === "leg") hit -= 0.04;
  if (combatState.player.fatigue > 65) hit -= COMBAT_TUNING.fatigueHitPenalty;
  return clamp(hit, 0.08, 0.95);
}

function enemyHitChance(combatState, skill, plan) {
  const enemy = combatState.enemy;
  const stats = derivedStats(combatState);
  let hit = skill.hit
    + (enemy.stats.tec - 50) * 0.0025
    + (enemy.stats.rea - 50) * 0.0018
    - (stats.rea - 50) * 0.002
    - (stats.spd - 50) * 0.0015
    - (combatState.playerBuff.def || 0) * 0.22
    - (combatState.playerBuff.dodge || 0) * 0.28
    - (combatState.playerBuff.counter || 0) * 0.5;
  if (plan.intent === "weapon") hit += 0.04;
  if (plan.intent === "clinch") hit -= combatState.playerBuff.anti || 0;
  if (combatState.player.fatigue > 60) hit += 0.05;
  return clamp(hit, 0.08, 0.88);
}

function calcPlayerBaseDamage(combatState, id) {
  const skill = SKILLS[id];
  const stats = derivedStats(combatState);
  const mastery = skillMastery(combatState, id);
  let base = skill.dmg + stats.str * 0.08 + stats.tec * 0.055 + mastery * COMBAT_TUNING.skillMasteryDmg;
  if (skill.type === "strike") base *= 1 + effect(combatState, "strikeDmg") + styleBonus(combatState, "boxing", 0.001);
  if (skill.type === "kick" || skill.type === "footwork") base *= 1 + effect(combatState, "kickDmg") + Math.max(0, stats.spd - 50) * 0.001;
  if (skill.style === "traditional") base *= 1 + styleBonus(combatState, "traditional", 0.0009);
  if (combatState.currentEnemyResponse?.intent === "pressure" && ["jab", "frontkick", "lowkick"].includes(id)) base *= 1.08;
  if (combatState.enemy.posture < combatState.enemy.postureMax * 0.45) base *= 1 + COMBAT_TUNING.postureBreakBonus;
  if (skill.dmg <= 0) base = 0;
  return Math.max(0, base);
}

function calcPlayerDamage(combatState, id, rng) {
  return Math.max(0, Math.round(calcPlayerBaseDamage(combatState, id) * COMBAT_TUNING.playerDmgScale * (0.9 + rng() * 0.22)));
}

function calcPlayerPostureDamage(combatState, id) {
  const skill = SKILLS[id];
  const stats = derivedStats(combatState);
  return Math.round((skill.post || 0) * COMBAT_TUNING.postureDmgScale + skillMastery(combatState, id) * 0.04 + (stats.jud > 55 ? 1 : 0));
}

function calcEnemyDamage(combatState, skill, plan, rng) {
  const enemy = combatState.enemy;
  const stats = derivedStats(combatState);
  let base = skill.dmg + enemy.stats.str * 0.075 + enemy.stats.tec * 0.045;
  if (plan.intent === "weapon") base *= 1.18;
  if (plan.intent === "counter") base *= 1.10;
  if (combatState.player.posture < combatState.player.postureMax * 0.45) base *= 1.12;
  base *= 1 - (combatState.playerBuff.def || 0);
  base *= 1 - clamp((stats.tou - 50) * 0.0018 + effect(combatState, "headRes") * 0.20, 0, 0.18);
  return Math.max(0, Math.round(base * COMBAT_TUNING.enemyDmgScale * (0.9 + rng() * 0.22)));
}

function readContext(combatState, playerActionId, playerSkill) {
  const recent = [...(combatState.lastPlayerActions || []), playerActionId].filter(Boolean);
  const repeated = recent.length >= 3 && recent.slice(-3).every((action) => action === recent[recent.length - 1]);
  const heavy = ["straight", "mystic", "takedown", "sidecontrol"].includes(playerActionId);
  const playerDefensive = ["guard", "dodge", "sprawl"].includes(playerActionId);
  const playerKeptAway = ["retreat", "dirtyescape"].includes(playerActionId);
  const playerDeescalating = playerActionId === "talkdown";
  const playerPressing = ["advance", "grip", "takedown", "palm", "offbalance"].includes(playerActionId);
  const playerGrappling = playerSkill ? ["grapple", "ground"].includes(playerSkill.type) : false;
  const playerAntiGrapple = ["sprawl", "frontkick", "retreat"].includes(playerActionId);
  return {
    repeated,
    heavy,
    playerDefensive,
    playerKeptAway,
    playerDeescalating,
    playerPressing,
    playerGrappling,
    playerAntiGrapple,
    enemyPostureRatio: ratio(combatState.enemy.posture, combatState.enemy.postureMax),
    enemySpRatio: ratio(combatState.enemy.sp, combatState.enemy.spMax),
    playerHpRatio: ratio(combatState.player.hp, combatState.player.hpMax)
  };
}

function normalizeCombatState(input) {
  const source = clonePlain(input || {});
  const enemyId = source.enemyId || source.enemy?.id || source.enemy?.enemyId || "E01";
  const template = ENEMY_TEMPLATES[enemyId] || ENEMY_TEMPLATES.E01;
  const enemyRaw = source.enemy || {};
  const enemyFromTemplate = !source.enemy;
  const scaledTemplate = enemyFromTemplate ? scaleEnemy(template, source.day) : template;
  const enemy = normalizeEnemy({ ...scaledTemplate, ...enemyRaw, id: enemyId });
  const player = normalizePlayer(source.player || {});
  const skillState = clonePlain(source.skillState || player.skillState || {});

  return {
    version: COMBAT_TUNING.version,
    round: Math.max(1, Math.floor(number(source.round, 1))),
    distance: source.distance || (template.preferredRange === "far" ? "far" : "mid"),
    ground: source.ground || "none",
    target: source.target || "body",
    player,
    enemy,
    skillState,
    hasExplicitSkillState: Boolean(source.skillState || player.skillState),
    styles: { boxing: 0, mma: 0, traditional: 0, street: 0, ...(source.styles || player.styles || {}) },
    equipSkills: Array.isArray(source.equipSkills) ? [...source.equipSkills] : [],
    effects: { ...(source.effects || source.equipmentEffects || {}) },
    playerBuff: { def: 0, dodge: 0, anti: 0, nextHit: 0, counter: 0, ...(source.playerBuff || {}) },
    history: Array.isArray(source.history) ? clonePlain(source.history) : [],
    lastPlayerActions: Array.isArray(source.lastPlayerActions) ? [...source.lastPlayerActions] : [],
    lastEnemyResponse: source.lastEnemyResponse || source.enemyPlan || null,
    currentEnemyResponse: source.currentEnemyResponse || null,
    log: Array.isArray(source.log) ? [...source.log] : [],
    finished: Boolean(source.finished || source.ended),
    ended: Boolean(source.ended || source.finished),
    finishReason: source.finishReason || null,
    winner: source.winner || null
  };
}

function normalizePlayer(raw) {
  const stats = {
    str: 48,
    end: 54,
    spd: 46,
    rea: 45,
    tec: 38,
    tou: 52,
    bal: 46,
    jud: 48,
    ...(raw.stats || {})
  };
  const hpMax = number(raw.hpMax, 110);
  const spMax = number(raw.spMax, 100);
  const postureMax = number(raw.postureMax, 80);
  return {
    ...raw,
    name: raw.name || "陆小闲",
    stats,
    hpMax,
    hp: clamp(number(raw.hp, hpMax), 0, hpMax),
    spMax,
    sp: clamp(number(raw.sp, spMax), 0, spMax),
    postureMax,
    posture: clamp(number(raw.posture, postureMax), 0, postureMax),
    morale: clamp(number(raw.morale, 68), 0, 100),
    calm: clamp(number(raw.calm, 55), 0, 100),
    fatigue: clamp(number(raw.fatigue, 0), 0, 100),
    heat: number(raw.heat, 0),
    fitXp: number(raw.fitXp, 0),
    injuries: Array.isArray(raw.injuries) ? clonePlain(raw.injuries) : []
  };
}

function normalizeEnemy(raw) {
  const hpMax = number(raw.hpMax, raw.hp || 92);
  const spMax = number(raw.spMax, raw.sp || 88);
  const postureMax = number(raw.postureMax, raw.posture || 72);
  return {
    ...raw,
    id: raw.id || raw.enemyId || "E01",
    name: raw.name || "对手",
    ai: raw.ai || ENEMY_AI_RULES[raw.id]?.profile || "generic",
    preferredRange: raw.preferredRange || ENEMY_AI_RULES[raw.id]?.preferredRange || "mid",
    stats: { str: 45, end: 45, spd: 45, tec: 45, tou: 45, bal: 45, rea: 45, jud: 45, ...(raw.stats || {}) },
    hpMax,
    hp: clamp(number(raw.hp, hpMax), 0, hpMax),
    spMax,
    sp: clamp(number(raw.sp, spMax), 0, spMax),
    postureMax,
    posture: clamp(number(raw.posture, postureMax), 0, postureMax),
    morale: clamp(number(raw.morale, 60), 0, 100),
    calm: clamp(number(raw.calm, 55), 0, 100),
    skills: Array.isArray(raw.skills) ? [...raw.skills] : ["jab", "guard"]
  };
}

function scaleEnemy(template, day) {
  const scale = 1 + Math.max(0, number(day, 1) - 1) * COMBAT_TUNING.enemyScalePerDay;
  return {
    ...template,
    hp: Math.round(template.hp * scale),
    sp: Math.round(template.sp * scale),
    posture: Math.round(template.posture * scale)
  };
}

function publicCombatState(combatState) {
  const out = clonePlain(combatState);
  delete out.hasExplicitSkillState;
  delete out._comboActor;
  delete out._comboCount;
  return out;
}

function derivedStats(combatState) {
  const base = { ...(combatState.player.stats || {}) };
  const fit = fitBonus(combatState.player.fitXp || 0);
  for (const [key, value] of Object.entries(fit)) {
    base[key] = (base[key] || 0) + value;
  }
  return base;
}

function fitBonus(fitXp) {
  const level = Math.floor(number(fitXp, 0) / 20);
  const bonus = { end: 0, spd: 0, bal: 0 };
  for (let i = 1; i <= level; i += 1) {
    bonus.spd += 1;
    if (i % 2 === 0) bonus.end += 1;
    if (i % 3 === 0) bonus.bal += 1;
  }
  return bonus;
}

function skillMastery(combatState, id) {
  return number(combatState.skillState?.[id]?.p, 0);
}

function skillRisk(combatState, skill) {
  return clamp((skill.risk || 0) + effect(combatState, "risk") - styleBonus(combatState, skill.style || "", 0.0008), 0, 0.45);
}

function styleBonus(combatState, key, scale = 0.001) {
  if (!key) return 0;
  return number(combatState.styles?.[key], 0) * scale;
}

function effect(combatState, key) {
  return number(combatState.effects?.[key], 0);
}

function learnFromUse(combatState, id, skill) {
  if (combatState.skillState[id]) {
    combatState.skillState[id] = { ...combatState.skillState[id], p: clamp(number(combatState.skillState[id].p, 0) + 2.2, 0, 100), use: number(combatState.skillState[id].use, 0) + 1 };
  }
  if (skill.style) {
    combatState.styles[skill.style] = clamp(number(combatState.styles[skill.style], 0) + 1.1, 0, 100);
  }
}

function scoreSingleCounter(id, plan) {
  if (!plan) return 0;
  if (plan.intent === "pressure" && ["guard", "dodge", "jab", "frontkick"].includes(id)) return 0.08;
  if (plan.intent === "clinch" && ["sprawl", "frontkick", "retreat", "offbalance"].includes(id)) return 0.10;
  if (plan.intent === "weapon" && ["dirtyescape", "talkdown", "retreat"].includes(id)) return 0.12;
  if (plan.intent === "counter" && id === "jab") return 0.06;
  if (plan.intent === "ground" && id === "escape") return 0.10;
  return 0;
}

function injuryChance(combatState, base) {
  const stats = derivedStats(combatState);
  const heat = Math.max(0, combatState.player.heat || 0);
  const cut = clamp((stats.tou - 50) * 0.003 + effect(combatState, "headRes") * 0.10, 0, 0.22);
  return clamp(base + heat * 0.002 - cut, 0.03, 0.35);
}

function consumeOffensiveBuff(combatState, id) {
  if (SKILLS[id]?.dmg > 0) {
    combatState.playerBuff.nextHit = 0;
    combatState.playerBuff.counter = Math.max(0, (combatState.playerBuff.counter || 0) - 0.04);
  }
}

function clearImmediateDefense(combatState) {
  combatState.playerBuff.def = 0;
  combatState.playerBuff.dodge = 0;
  combatState.playerBuff.anti = 0;
}

function pushStep(combatState, steps, nextStep) {
  steps.push(nextStep);
  combatState.log.push(...nextStep.log);
  combatState.log = combatState.log.slice(-80);
}

function step(actor, id, result, log, fx) {
  return {
    actor,
    action: actionDescriptor(id),
    result,
    log,
    fx
  };
}

function actionDescriptor(id) {
  const skill = SKILLS[id];
  return {
    id,
    name: skill?.name || id,
    type: skill?.type || id
  };
}

function response(enemy, rule, label, intent, skill, tell, danger, counter, reason) {
  return {
    enemyId: enemy.id,
    profile: rule.profile,
    label,
    intent,
    skill,
    tell,
    danger,
    counter,
    reason
  };
}

function makeFx(combatState, type, actor, damage, label, skillId, extra = {}) {
  let combo = 0;
  if (type === "hit" && damage > 0) {
    if (combatState._comboActor === actor) {
      combatState._comboCount = (combatState._comboCount || 0) + 1;
    } else {
      combatState._comboActor = actor;
      combatState._comboCount = 1;
    }
    combo = combatState._comboCount;
  } else if (type === "miss") {
    combatState._comboActor = null;
    combatState._comboCount = 0;
  }

  const blocked = /削|格挡|抱架|防下/.test(label || "");
  const critical = damage >= 24 || type === "break";
  return {
    type,
    actor,
    who: actor,
    fromSide: actor,
    toSide: actor === "player" ? "enemy" : "player",
    damage,
    dmg: damage,
    label,
    target: combatState.target,
    combo,
    comboIndex: combo,
    skillId,
    damageKind: type === "break" ? "break" : blocked ? "blocked" : critical ? "heavy" : type,
    blocked,
    critical,
    icon: extra.icon || fxIcon(type, label, damage)
  };
}

function fxIcon(type, label, damage) {
  if (type === "break") return /TAKEDOWN|抱摔/.test(label || "") ? "DOWN" : "BREAK";
  if (type === "guard") return "GUARD";
  if (type === "miss") return "MISS";
  if (damage >= 24) return "HEAVY";
  return "HIT";
}

function resetCombo(combatState) {
  combatState._comboActor = null;
  combatState._comboCount = 0;
}

function normalizeActions(selectedActions) {
  if (!Array.isArray(selectedActions)) return selectedActions ? [actionId(selectedActions)] : [];
  return selectedActions.map(actionId).filter(Boolean);
}

function actionId(action) {
  if (!action) return "";
  if (typeof action === "string") return action;
  return action.id || action.skillId || action.action || "";
}

function isTerminal(combatState) {
  return Boolean(combatState.finished || combatState.ended || combatState.player.hp <= 0 || combatState.enemy.hp <= 0);
}

function distText(distance) {
  return { far: "远距", mid: "中距", close: "近身", ground: "地面" }[distance] || distance;
}

function targetText(target) {
  return { head: "头部", body: "躯干", leg: "腿部" }[target] || target;
}

function ratio(value, max, fallback = 1) {
  const denominator = number(max, 0);
  if (denominator <= 0) return fallback;
  return clamp(number(value, denominator) / denominator, 0, 1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clonePlain(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

export default {
  ENEMY_AI_RULES,
  resolveCombatExchange,
  chooseEnemyResponse,
  previewPlayerAction
};
