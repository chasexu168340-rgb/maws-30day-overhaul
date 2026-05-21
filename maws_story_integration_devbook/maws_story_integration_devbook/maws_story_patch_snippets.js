// maws_story_patch_snippets.js
// 这些片段用于开发参照，不建议整段直接覆盖现有文件。

export const MAW_RULES = {
  belief: { name: '祖传信念', icon: '祖', desc: '主角对“茂家拳天下第一”的相信程度。前期给士气，后期必须被真实性重写。' },
  misread: { name: '误判值', icon: '误', desc: '把偶然胜利理解成神功的程度。前期让人上头，Day 8 会变成现实冲击。' },
  fatherMemory: { name: '父亲记忆', icon: '父', desc: '不是战斗力，而是你为什么还能站起来。影响日记、新注、夜谈和终战冷静。' },
  reforge: { name: '茂拳完成度', icon: '茂', desc: '把拳击、传统拆解、地面、防守和街头判断写回茂家拳谱的进度。' }
};

export const MAW_FORMS = {
  openMountain: {
    name: '茂家开山拳',
    oldSkill: 'mystic',
    coreSkill: 'straight',
    module: 'boxing',
    oldNote: '一拳开山，气吞山河。',
    newNote: '先别开山，先把手收回来护脸。'
  },
  ironBody: {
    name: '茂家铁布衫',
    oldSkill: 'guard',
    coreSkill: 'guard',
    module: 'body',
    oldNote: '刀枪不入，气沉丹田。',
    newNote: '至少别被人一推就坐进共享单车篮子里。'
  },
  sealThroat: {
    name: '茂家封喉手',
    oldSkill: 'palm',
    coreSkill: 'palm',
    module: 'traditional',
    oldNote: '一指封喉，敌胆俱裂。',
    newNote: '不要封喉。真的。你要学的是距离、落点和时机。'
  }
};

export function createDefaultMaw(forms = MAW_FORMS) {
  return {
    chapter: 'illusion',
    belief: 75,
    misread: 0,
    fatherMemory: 0,
    reforge: 0,
    truthRevealed: false,
    firstWindDone: false,
    diaryRead: false,
    forms: Object.fromEntries(Object.keys(forms).map((id) => [id, { reforge: 0, unlockedNote: false }])),
    modules: { boxing: 0, body: 0, traditional: 0, grappling: 0, street: 0 },
    objectives: {}
  };
}

export function updateMawProgress(state) {
  const p = state.player || {};
  const stats = p.stats || {};
  const skillP = (id) => Number(state.skillState?.[id]?.p || 0);
  const relation = (id) => Number(state.relations?.[id] || 0);
  const styles = state.styles || {};
  const memory = state.combatMemory || {};
  const fitLevel = Math.floor(Number(p.fitXp || 0) / 20);

  const modules = {
    boxing: clamp(skillP('jab') * 0.25 + skillP('straight') * 0.35 + Number(styles.boxing || 0) * 0.3 + relation('coach') * 2, 0, 100),
    body: clamp((Number(stats.tou || 40) - 40) * 1.2 + (Number(stats.bal || 40) - 40) * 1.2 + fitLevel * 4 + skillP('guard') * 0.25 + skillP('dodge') * 0.15, 0, 100),
    traditional: clamp(skillP('palm') * 0.25 + skillP('offbalance') * 0.25 + Number(styles.traditional || 0) * 0.25 + Number(p.auth || 0) * 0.15 + relation('master') * 2, 0, 100),
    grappling: clamp(skillP('sprawl') * 0.3 + skillP('escape') * 0.25 + skillP('grip') * 0.15 + Number(styles.mma || 0) * 0.25, 0, 100),
    street: clamp(skillP('talkdown') * 0.25 + skillP('dirtyescape') * 0.25 + (Number(stats.jud || 35) - 35) * 1.1 + Number(styles.street || 0) * 0.25 + Number(memory.riskWins || 0) * 8, 0, 100)
  };

  state.maw.modules = modules;
  state.maw.reforge = Math.round(modules.boxing * 0.3 + modules.body * 0.2 + modules.traditional * 0.2 + modules.grappling * 0.2 + modules.street * 0.1);
}

function clamp(value, min, max) {
  const n = Number.isFinite(Number(value)) ? Number(value) : 0;
  return Math.max(min, Math.min(max, n));
}
