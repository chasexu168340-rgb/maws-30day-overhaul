# 01 数据模型与补丁规格

## 1. 新增常量

建议在 `maws_src/content/data.js` 中新增：

```js
export const MAW_RULES = {
  belief: {
    name: '祖传信念',
    icon: '祖',
    desc: '主角对“茂家拳天下第一”的相信程度。前期给士气，后期必须被真实性重写。'
  },
  misread: {
    name: '误判值',
    icon: '误',
    desc: '把偶然胜利理解成神功的程度。前期让人上头，Day 8 会变成现实冲击。'
  },
  fatherMemory: {
    name: '父亲记忆',
    icon: '父',
    desc: '不是战斗力，而是你为什么还能站起来。影响日记、新注、夜谈和终战冷静。'
  },
  reforge: {
    name: '茂拳完成度',
    icon: '茂',
    desc: '把拳击、传统拆解、地面、防守和街头判断写回茂家拳谱的进度。'
  }
};
```

## 2. 新增拳谱结构

```js
export const MAW_FORMS = {
  openMountain: {
    name: '茂家开山拳',
    oldSkill: 'mystic',
    coreSkill: 'straight',
    module: 'boxing',
    oldNote: '一拳开山，气吞山河。',
    newNote: '先别开山，先把手收回来护脸。',
    req: { skill: 'straight', mastery: 45, style: 'boxing', styleValue: 25 }
  },
  ironBody: {
    name: '茂家铁布衫',
    oldSkill: 'guard',
    coreSkill: 'guard',
    module: 'body',
    oldNote: '刀枪不入，气沉丹田。',
    newNote: '至少别被人一推就坐进共享单车篮子里。',
    req: { stats: { tou: 52, bal: 52 }, skill: 'guard', mastery: 35 }
  },
  sealThroat: {
    name: '茂家封喉手',
    oldSkill: 'palm',
    coreSkill: 'palm',
    module: 'traditional',
    oldNote: '一指封喉，敌胆俱裂。',
    newNote: '不要封喉。真的。你要学的是距离、落点和时机。',
    req: { skill: 'palm', mastery: 35, style: 'traditional', styleValue: 25 }
  },
  windStep: {
    name: '茂家穿云步',
    oldSkill: 'dodge',
    coreSkill: 'dodge',
    module: 'street',
    oldNote: '身如穿云，敌不见影。',
    newNote: '脚先走，脑子别留在原地。',
    req: { skill: 'dodge', mastery: 35, stats: { spd: 50, jud: 50 } }
  },
  groundRoot: {
    name: '茂家落地生根',
    oldSkill: 'sprawl',
    coreSkill: 'sprawl',
    module: 'grappling',
    oldNote: '落地如山，万法不侵。',
    newNote: '不会防摔，地面会替你讲课。',
    req: { skill: 'sprawl', mastery: 35, style: 'mma', styleValue: 25 }
  }
};
```

## 3. `createNewState()` 新增字段

```js
maw: {
  chapter: 'illusion',
  belief: 75,
  misread: 0,
  fatherMemory: 0,
  reforge: 0,
  truthRevealed: false,
  firstWindDone: false,
  diaryRead: false,
  forms: Object.fromEntries(Object.keys(MAW_FORMS).map((id) => [
    id,
    { reforge: 0, unlockedNote: false }
  ])),
  modules: { boxing: 0, body: 0, traditional: 0, grappling: 0, street: 0 },
  objectives: {}
}
```

## 4. `migrateSave()` 补字段

```js
s.maw ||= {};
s.maw.chapter ||= s.day >= 9 ? 'reforge' : 'illusion';
s.maw.belief ??= 65;
s.maw.misread ??= 0;
s.maw.fatherMemory ??= 0;
s.maw.reforge ??= 0;
s.maw.truthRevealed = Boolean(s.maw.truthRevealed);
s.maw.firstWindDone = Boolean(s.maw.firstWindDone);
s.maw.diaryRead = Boolean(s.maw.diaryRead);
s.maw.forms ||= {};
Object.keys(MAW_FORMS).forEach((id) => {
  s.maw.forms[id] ||= { reforge: 0, unlockedNote: false };
});
s.maw.modules = { boxing: 0, body: 0, traditional: 0, grappling: 0, street: 0, ...(s.maw.modules || {}) };
s.maw.objectives ||= {};
```

## 5. 主线事件替换建议

```js
export const MAIN_EVENTS = {
  1: {
    title: '给父亲上香',
    loc: 'home',
    npc: 'father',
    kind: 'diary',
    desc: '你给父亲牌位上香。墙上挂着祖训：习武之人，绝不争强好胜。你点点头，然后准备去争一口气。'
  },
  2: {
    title: '地铁见义勇为',
    loc: 'street',
    kind: 'choice',
    desc: '你在地铁口遇到一场小冲突。你以为是茂家拳起效，其实对方主要是被你的吨位和嗓门镇住了。'
  },
  3: {
    title: '便利店货架事件',
    loc: 'store',
    npc: 'xiaoman',
    kind: 'choice',
    desc: '你一掌拍在货架上，三包薯片受到了震慑伤害。小满看着你，决定先不评价。'
  },
  5: {
    title: '公园第一次验货',
    loc: 'park',
    enemy: 'E01',
    kind: 'battle',
    desc: '低风险切磋。你想证明茂家拳，对方只是想练刺拳距离。'
  },
  8: {
    title: '一阵风',
    loc: 'boxing',
    enemy: 'E10',
    kind: 'battle',
    script: 'first_wind',
    desc: '你违背父亲遗训，第一次去证明茂家拳。现实没有配合演出。'
  },
  9: {
    title: '父亲日记',
    loc: 'home',
    npc: 'father',
    kind: 'diary',
    script: 'father_diary',
    desc: '旧箱子里有一本日记。它没有绝招，但有父亲没有说出口的真话。'
  },
  12: {
    title: '阿豹刷到你了',
    loc: 'park',
    enemy: 'E11',
    npc: 'abao',
    kind: 'battle',
    desc: '阿豹信短视频，你信祖传。你们都需要一场不那么体面的验货。'
  },
  18: {
    title: '便利店门口的三个人',
    loc: 'store',
    npc: 'xiaoman',
    enemy: 'E07',
    kind: 'choiceBattle',
    desc: '这不是擂台。保护人、降温、撤离和硬拼，都是选择。'
  },
  24: {
    title: 'MMA开放垫子',
    loc: 'mma',
    enemy: 'E06',
    kind: 'battle',
    desc: '地板今天免费授课。不会防摔的话，它讲得很细。'
  },
  29: {
    title: '烧烤摊夜谈',
    loc: 'street',
    kind: 'nightTalk',
    desc: '终战前一晚，你可以和一个人吃烧烤，也可以一个人把十串羊肉献给焦虑。'
  },
  30: {
    title: '真东西测试',
    loc: 'boxing',
    enemy: 'E18',
    kind: 'objectiveBattle',
    objectives: ['surviveWindow1', 'guardHeavy', 'landStraight', 'recoverFromHit', 'useReforgedSkill', 'keepCalm'],
    desc: '你不用证明茂家拳天下第一。你只要证明自己不再是一阵风。'
  }
};
```

## 6. 新增 NPC

```js
export const NPCS = {
  ...NPCS,
  father: { name: '父亲', icon: '父', hidden: true },
  abao: { name: '阿豹', icon: '豹' },
  oldman: { name: '推手大爷', icon: '推' }
};
```

说明：`father.hidden` 表示不进入普通 NPC 关系页，而进入拳谱/日记系统。UI 渲染 NPC 时应过滤 hidden。

## 7. 新增敌人

```js
E10: {
  name: '沉默拳击手',
  icon: '风',
  risk: '剧情',
  tags: ['真实拳距', '一阵风', '不配合演出'],
  hp: 100,
  sp: 100,
  posture: 90,
  morale: 70,
  calm: 85,
  stats: { str: 50, end: 55, spd: 62, tec: 62, tou: 52, bal: 55, rea: 64, jud: 60 },
  skills: ['jab', 'straight', 'guard', 'retreat'],
  ai: 'boxer',
  preferredRange: 'mid',
  aiProfile: { patience: 80, pressure: 35, grapple: 0, counter: 50, dirty: 0 },
  reward: { money: 0, fame: 0 },
  script: 'first_wind'
},
E11: {
  name: '短视频挑战者阿豹',
  icon: '豹',
  risk: '中',
  tags: ['短视频信徒', '自信过量', '基础半桶水'],
  hp: 96,
  sp: 92,
  posture: 75,
  morale: 90,
  calm: 42,
  stats: { str: 45, end: 47, spd: 48, tec: 43, tou: 43, bal: 43, rea: 45, jud: 34 },
  skills: ['straight', 'advance', 'mystic', 'retreat', 'talkdown'],
  ai: 'brawler',
  preferredRange: 'mid',
  aiProfile: { patience: 20, pressure: 70, grapple: 4, counter: 8, dirty: 10 },
  reward: { money: 80, fame: 40 }
}
```

注意：`combat.js` 内部也要同步添加 E10/E11，否则 UI 数据和战斗引擎会脱节。
