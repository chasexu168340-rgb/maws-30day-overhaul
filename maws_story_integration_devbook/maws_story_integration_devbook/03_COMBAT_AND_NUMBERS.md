# 03 战斗、数值与重铸规则

## 1. 战斗设计目标

当前战斗已经是“选卡队列 + 自动窗口 + 敌人逐招回应”的结构。主线接入时不要重写战斗，只新增两类特殊规则：

1. Day 8：剧情性失败，但仍让玩家操作一个窗口。
2. Day 30：目标制验收，不要求 KO。

## 2. Day 8 一阵风规则

### 触发

`MAIN_EVENTS[8].script === 'first_wind'`

### 开战

`startBattle()` 写入：

```js
state.combat.script = 'first_wind';
state.combat.forcedResultAfterWindow = 1;
state.combat.windSeen = false;
```

### 战斗窗口

玩家仍可选择技能，但第一窗口结束后强制进入结果。

建议规则：

- 玩家选 `guard`：文案显示“你护住了一点，但没护住自尊。”
- 玩家选 `dodge`：显示“你想闪，脚慢了半拍。”
- 玩家选 `straight/mystic`：显示“你刚准备证明，证明已经结束。”
- 玩家选 `talkdown`：显示“对手点点头，然后用拳解释了交流的边界。”

### 结果

```js
finishBattle(state, 'first_wind')
```

效果：

```js
state.maw.firstWindDone = true;
state.maw.chapter = 'broken';
state.maw.belief = Math.max(10, state.maw.belief - 55);
state.maw.fatherMemory += Math.round(state.maw.misread * 0.35);
state.maw.misread = 0;
state.player.morale = clamp(state.player.morale - 18, 0, 100);
state.player.calm = clamp(state.player.calm + 4, 0, 100);
state.flags.needFatherDiary = true;
```

不建议给重伤，因为 Day 9 要读日记，不能让玩家被数值惩罚打断叙事节奏。

## 3. Day 30 目标制终战

### 目标定义

```js
const FINAL_OBJECTIVES = {
  surviveWindow1: {
    label: '撑过第一轮',
    desc: '不是一阵风。',
    check: ({ combat }) => combat.windowCount >= 1 && !combat.ended
  },
  guardHeavy: {
    label: '有效防住一次重击',
    desc: '脸不是公共资源。',
    checkStep: (step) => step.tags?.includes('guardedHeavy')
  },
  landStraight: {
    label: '打出一次有效直拳',
    desc: '开山拳第一次像拳。',
    checkStep: (step) => step.actor === 'player' && step.skill === 'straight' && step.hit
  },
  recoverFromHit: {
    label: '挨打后继续执行动作',
    desc: '身体散了，脑子没散。',
    checkWindow: ...
  },
  useReforgedSkill: {
    label: '使用重铸招式',
    desc: '旧名字，新东西。',
    checkStep: (step, state) => isReforgedSkill(step.skill, state.maw)
  },
  keepCalm: {
    label: '没有士气崩溃',
    desc: '输了也别把自己丢了。',
    checkEnd: ({ player }) => player.calm >= 40 && player.morale >= 25
  }
};
```

### 评价

```js
const completed = Object.values(state.maw.objectives.final || {}).filter(Boolean).length;

if (completed >= 5) grade = 'clean_pass';
else if (completed >= 3) grade = 'pass';
else if (completed >= 2) grade = 'loss_with_growth';
else grade = 'loss';
```

## 4. 重铸模块公式

### 拳击模块

来源：

- `skillState.jab.p`
- `skillState.straight.p`
- `styles.boxing`
- 关系 `coach`

公式：

```js
modules.boxing = clamp(
  skillP('jab') * 0.25 +
  skillP('straight') * 0.35 +
  styles.boxing * 0.3 +
  relation('coach') * 2,
  0, 100
);
```

### 身体模块

来源：

- 抗打 `tou`
- 平衡 `bal`
- 体能沉淀 `fitXp`
- `guard/dodge` 熟练度

```js
modules.body = clamp(
  (stats.tou - 40) * 1.2 +
  (stats.bal - 40) * 1.2 +
  fit.level * 4 +
  skillP('guard') * 0.25 +
  skillP('dodge') * 0.15,
  0, 100
);
```

### 传统拆解模块

来源：

- `palm/offbalance/mystic`
- `styles.traditional`
- 周青山关系
- 真实性

```js
modules.traditional = clamp(
  skillP('palm') * 0.25 +
  skillP('offbalance') * 0.25 +
  styles.traditional * 0.25 +
  player.auth * 0.15 +
  relation('master') * 2,
  0, 100
);
```

### 地面模块

来源：

- `sprawl/escape/grip/takedown`
- `styles.mma`

```js
modules.grappling = clamp(
  skillP('sprawl') * 0.3 +
  skillP('escape') * 0.25 +
  skillP('grip') * 0.15 +
  styles.mma * 0.25,
  0, 100
);
```

### 街头判断模块

来源：

- `talkdown/dirtyescape`
- `jud`
- `styles.street`
- 风险胜利 `riskWins`

```js
modules.street = clamp(
  skillP('talkdown') * 0.25 +
  skillP('dirtyescape') * 0.25 +
  (stats.jud - 35) * 1.1 +
  styles.street * 0.25 +
  combatMemory.riskWins * 8,
  0, 100
);
```

### 总完成度

```js
reforge = Math.round(
  modules.boxing * 0.3 +
  modules.body * 0.2 +
  modules.traditional * 0.2 +
  modules.grappling * 0.2 +
  modules.street * 0.1
);
```

## 5. 拳谱重铸对技能的影响

MVP 不要新增很多战斗技能。建议复用现有技能，只在 UI 和小幅战斗修正上体现“重铸”。

### 茂家开山拳 -> straight

条件：

- `forms.openMountain.reforge >= 60`

效果：

- `straight` 命中 +3%
- 重复惩罚略降
- Day 30 命中后触发 `landStraight`

### 茂家铁布衫 -> guard

条件：

- `forms.ironBody.reforge >= 60`

效果：

- guard 减伤 +5%
- 架势恢复 +3
- Day 30 可触发 `guardHeavy`

### 茂家封喉手 -> palm/offbalance

条件：

- `forms.sealThroat.reforge >= 60`

效果：

- palm 风险 -3%
- offbalance 架势伤害 +3
- 但不允许文案鼓励真实攻击咽喉，必须写成“距离与时机”。

### 茂家穿云步 -> dodge/retreat

条件：

- `forms.windStep.reforge >= 60`

效果：

- dodge 成功后距离调整更稳定。
- retreat 在街头战里更容易触发风险胜利。

### 茂家落地生根 -> sprawl/escape

条件：

- `forms.groundRoot.reforge >= 60`

效果：

- 第一次被抱摔时获得一次额外防摔检定。
- 地面脱身成功后冷静 +2。

## 6. 装备数值

```js
father_wrap: {
  name: '父亲旧护腕',
  type: 'equipment',
  slot: 'accessory',
  price: 0,
  story: true,
  eff: { calm: 2, fatherMemoryProc: 1 }
}

fake_wrap: {
  name: '直播间秘传护腕',
  type: 'equipment',
  slot: 'accessory',
  price: 99,
  eff: { morale: 8, misread: 6, auth: -2, risk: 0.02 }
}

wraps: {
  name: '正规缠手',
  type: 'equipment',
  slot: 'hand',
  price: 120,
  eff: { strikeDmg: 0.04, risk: -0.02 }
}

knee: {
  name: '基础护膝',
  type: 'equipment',
  slot: 'body',
  price: 180,
  eff: { bal: 1, injuryRisk: -0.04 }
}
```

需要在 `effectSummary()` 和 `applyGain()` 中支持新增效果名，否则 UI 会显示原始 key。
