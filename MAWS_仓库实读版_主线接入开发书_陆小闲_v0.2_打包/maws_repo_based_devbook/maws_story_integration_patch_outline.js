// maws_story_integration_patch_outline.js
// 这是接入规格片段，不是可直接整段替换的最终代码。

export const MAW_RULES = {
  belief: { name: '祖传信念', icon: '祖', desc: '陆小闲对“茂家拳天下第一”的相信程度。' },
  misread: { name: '误判值', icon: '误', desc: '把偶然胜利理解成神功的程度。' },
  fatherMemory: { name: '父亲记忆', icon: '父', desc: '陆小闲为什么还能站起来。' },
  reforge: { name: '茂拳完成度', icon: '茂', desc: '把真实训练写回茂家拳谱的进度。' }
};

export const MAW_FORMS = {
  openMountain: { name: '茂家开山拳', oldSkill: 'mystic', coreSkill: 'straight', module: 'boxing', oldNote: '一拳开山，气吞山河。', newNote: '先别开山，先把手收回来护脸。' },
  ironBody: { name: '茂家铁布衫', oldSkill: 'guard', coreSkill: 'guard', module: 'body', oldNote: '刀枪不入，气沉丹田。', newNote: '至少别被人一推就坐进共享单车篮子里。' },
  sealThroat: { name: '茂家封喉手', oldSkill: 'palm', coreSkill: 'palm', module: 'traditional', oldNote: '一指封喉，敌胆俱裂。', newNote: '不要封喉。真的。你要学的是距离、落点和时机。' },
  windStep: { name: '茂家穿云步', oldSkill: 'dodge', coreSkill: 'dodge', module: 'street', oldNote: '身如穿云，敌不见影。', newNote: '脚先走，脑子别留在原地。' },
  groundRoot: { name: '茂家落地生根', oldSkill: 'sprawl', coreSkill: 'sprawl', module: 'grappling', oldNote: '落地如山，万法不侵。', newNote: '不会防摔，地面会替你讲课。' }
};

export function createDefaultMaw() {
  return {
    chapter: 'illusion',
    belief: 75,
    misread: 0,
    fatherMemory: 0,
    reforge: 0,
    truthRevealed: false,
    firstWindDone: false,
    diaryRead: false,
    forms: Object.fromEntries(Object.keys(MAW_FORMS).map((id) => [id, { reforge: 0, unlockedNote: false }])),
    modules: { boxing: 0, body: 0, traditional: 0, grappling: 0, street: 0 },
    objectives: {}
  };
}

export const STORY_MAIN_EVENTS_PATCH = {
  1: { title: '给父亲上香', loc: 'home', npc: 'father', kind: 'diary', desc: '你给父亲牌位上香。墙上挂着祖训：习武之人，绝不争强好胜。你点点头，然后准备去争一口气。' },
  2: { title: '地铁见义勇为', loc: 'street', kind: 'choice', desc: '你以为是茂家拳起效，其实对方主要是被你的吨位和嗓门镇住了。' },
  3: { title: '便利店货架事件', loc: 'store', npc: 'xiaoman', kind: 'choice', desc: '你一掌拍在货架上，三包薯片受到了震慑伤害。' },
  5: { title: '公园第一次验货', loc: 'park', enemy: 'E01', kind: 'battle', desc: '低风险切磋。你想证明茂家拳，对方只是想练刺拳距离。' },
  8: { title: '一阵风', loc: 'boxing', enemy: 'E10', kind: 'battle', script: 'first_wind', desc: '你违背父亲遗训，第一次去证明茂家拳。现实没有配合演出。' },
  9: { title: '父亲日记', loc: 'home', npc: 'father', kind: 'diary', script: 'father_diary', desc: '旧箱子里有一本日记。它没有绝招，但有父亲没有说出口的真话。' },
  12: { title: '阿豹刷到你了', loc: 'park', enemy: 'E11', npc: 'abao', kind: 'battle', desc: '阿豹信短视频，你信祖传。你们都需要一场不那么体面的验货。' },
  18: { title: '便利店门口的三个人', loc: 'store', npc: 'xiaoman', enemy: 'E07', kind: 'choiceBattle', desc: '这不是擂台。保护人、降温、撤离和硬拼，都是选择。' },
  24: { title: 'MMA开放垫子', loc: 'mma', enemy: 'E06', kind: 'battle', desc: '地板今天免费授课。不会防摔的话，它讲得很细。' },
  29: { title: '烧烤摊夜谈', loc: 'street', kind: 'nightTalk', desc: '终战前一晚，你可以和一个人吃烧烤，也可以一个人把十串羊肉献给焦虑。' },
  30: { title: '真东西测试', loc: 'boxing', enemy: 'E18', kind: 'objectiveBattle', objectives: ['surviveWindow1', 'guardHeavy', 'landStraight', 'recoverFromHit', 'useReforgedSkill', 'keepCalm'], desc: '你不用证明茂家拳天下第一。你只要证明自己不再是一阵风。' }
};
