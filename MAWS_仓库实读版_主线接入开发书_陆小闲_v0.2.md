# 《了不起的武术模拟器：一阵风》仓库实读版主线接入开发书

版本：v0.2 repo-based  
主角：陆小闲  
目标仓库：`chasexu168340-rgb/maws-30day-overhaul`  
当前入口：`maws_30day_overhaul_v3.html`  
当前源码：`maws_src/`  
当前资源：`assets/`  

---

## 0. 这份开发书基于哪些已读事实

这份文档不是空仓设想，而是按当前仓库已经存在的运行结构写的接入书。当前项目已经有入口 HTML、模块化源码、运行时资源 manifest、Phaser 表现层、DOM 文字交互层、状态层、战斗层、机会事件层、训练小游戏、装备栏、城市出行、主线卡、待办卡、战斗卡和存档迁移。

当前 README 明确项目是“30 天武术实用性原型”，且当前版本采用 Phaser + DOM 架构：Phaser 负责背景、角色 sprite、动画、伤害数字和战斗特效；DOM 负责主线/待办、装备栏、训练小游戏、战斗 HUD、技能卡、队列、日志和弹窗。入口是 `maws_30day_overhaul_v3.html`，源码目录是 `maws_src/`，运行时资源目录是 `assets/`。

AGENTS.md 明确要求：不要急着重写，先理解现有结构；长任务要分 Batch；优先使用现有数据结构和调用链；UI 改动必须注意手机端、横向溢出、文字遮挡和按钮可点击性。它也列出了当前架构：`data.js`、`state.js`、`combat.js`、`ui.js/ui.css`、`phaser/scenes/`、`assets/manifest.js`、`tools/verify_assets.mjs`。

CURRENT_STATUS 显示项目已经经过多轮升级：从单文件原型演进到 Phaser + DOM 分层，加入 P5 风格 UI、城市地点舞台、日夜背景、人物 standee、城市地图 overlay、战斗 UI 压缩、装备槽、训练小游戏、短窗口半即时战斗、体能沉淀、机会卡和响应式验证。

CURRENT_TASK 显示历史任务已经明确：保持入口 `maws_30day_overhaul_v3.html`，源代码放在 `maws_src/`；战斗已经从单纯回合改为逐招交换；DOM 文字层负责 HUD、导航、主面板、技能卡、弹窗和 toast；Phaser 只负责背景、人物和战斗表现。

因此，本开发书的接入原则是：不重写架构，不另起新工程，不删除现有系统；把“陆小闲、茂家拳、一阵风、父亲日记、百家入茂、真东西测试”接入现有 `data -> state -> events -> combat -> renderModel -> DOM/Phaser` 链路。

---

## 1. 当前项目结构总结

### 1.1 入口层

`maws_30day_overhaul_v3.html` 是唯一入口。它加载：

- `maws_src/dom/ui.css`
- `vendor/phaser-4.1.0.min.js`
- `maws_src/main.js`

页面里有两个核心根节点：

- `#game-root`：Phaser canvas 所在区域。
- `#maws-ui-root`：DOM UI overlay 所在区域。

这意味着后续主线 UI 不应该写进 Phaser scene 里做文本排版，而应该继续走 DOM UI；Phaser 只负责关键背景、角色、战斗命中特效、镜头震动、白闪和受击表现。

### 1.2 启动层

`maws_src/main.js` 做了三件事：

1. 创建 `GameStore`。
2. 把 `GameStore` 暴露到 `window.MAWS_STORE`。
3. 初始化 DOM UI，并启动 Phaser `BootScene` 与 `ShellScene`。

这说明所有剧情、事件、战斗和 UI 状态都应优先通过 `store.dispatch()` 推进，而不是在 UI 里直接改 DOM 或绕过状态层。

### 1.3 数据层

`maws_src/content/data.js` 当前承载：

- `SAVE_KEY` 与 `GAME_VERSION`
- 顶部 tab：地图、人物、技能、物品、商城、关系、日志、自检
- 8 项基础属性：力量、耐力、速度、反应、技巧、抗打、平衡、判断
- 资源规则：现金、名声、真实性、热度、体能沉淀
- 流派规则：拳击实用、MMA 防摔、传统拆解、街头判断
- 出身：进城打工人、短视频信徒、体育生旁听
- 地点：出租屋、便利店、工地临工点、公园、拳馆、武馆、MMA 馆、社区健身房、理疗店、旧城区
- 出行方式：散步、跑步、共享单车、公交、地铁、打车
- 技能：刺拳、直拳、防守抱架、侧步闪避、前压、后撤、低扫、前踢、抓把、抱摔、防摔、侧压控制、地面脱身、夺路撤离、言语降温、掌根短击、破平衡、混元一气掌
- 物品：饭团、运动饮料、绷带、拳套、训练鞋、护齿、训练笔记本
- 敌人：E01-E09 与 E18 陈见锋
- 行动：各地点训练、打工、对话、商店、战斗入口
- NPC：刘胖子、梁教练、周青山、小满、陈见锋
- 主线节点：Day 1、5、12、18、24、30

主线接入最主要会改 `data.js`，但不应该把复杂逻辑塞进这里。它只负责定义“有什么”。

### 1.4 状态层

`maws_src/simulation/state.js` 当前负责：

- `createNewState()`：创建新档，玩家名已经是“陆小闲”。
- `migrateSave()`：旧存档兼容。
- `fitBonus()` 与 `derivedStats()`：体能沉淀和装备加成。
- `recalcVitals()`：生命、体力、架势上限。
- `advanceTime()`、`sleep()`、`travelQuote()`：日历、睡觉、出行。
- `learnSkill()`：技能熟练度和流派点。
- `startTrainingMini()` / `finishTrainingMini()`：训练小游戏。
- `startBattle()`、`mergeCombatResult()`、`finishBattle()`：战斗生命周期。
- `GameStore.dispatch()`：所有 UI 行为的统一入口。
- `buildRenderModel()`：把 state 转成 DOM UI 和 Phaser 可消费的模型。

主线接入最关键的不是新增页面，而是扩展 `createNewState()`、`migrateSave()`、`startMainEvent()`、`finishBattle()`、`postReview()` 和 `buildRenderModel()`。

### 1.5 事件层

`maws_src/simulation/events.js` 当前通过 `EVENT_RULES` 生成机会卡。机会卡权重受热度、名声、真实性、疲劳、伤病、战斗次数、胜负、风险处理、战斗记忆影响。

这正好适合把“误判期、破碎期、百家入茂期、终战压力期”的机会卡塞进去。不要新增随机系统，直接扩展 `EVENT_RULES` 的 `when` 与 `weights`。

### 1.6 战斗层

`maws_src/simulation/combat.js` 当前有独立的：

- `COMBAT_TUNING`
- 本地 `SKILLS`
- 本地 `ENEMY_TEMPLATES`
- `ENEMY_AI_RULES`
- `previewPlayerAction()`
- `chooseEnemyResponse()`
- `resolveCombatExchange()`
- 拳击、教练、摔柔、武器、Boss 等 AI response 函数

这里有一个非常重要的风险：`data.js` 和 `combat.js` 都有技能和敌人定义。新增 E10/E11 或改技能名时，必须同步两个地方，或者单独开一个 Batch 做战斗层引用数据层的轻量统一。MVP 期间建议同步两处，避免大重构。

### 1.7 DOM UI 层

`maws_src/dom/ui.js` 当前负责：

- 启动画面 `renderBoot()`
- HUD `renderHud()`
- 底部导航 `renderNav()`
- 地图和地点舞台 `renderMap()`
- 今日主线和待办 `renderTaskBoard()`
- 人物页 `renderProfile()`
- 技能卡 `renderSkills()` / `renderSkillCard()`
- 背包与装备 `renderBag()`
- 商店、NPC、日志、自检
- 战斗 UI `renderCombat()`
- 出行、训练小游戏、结算、战斗结果 modal `renderModal()`
- `dispatchFromDataset()` 把按钮转换为 `store.dispatch()`

主线 UI 需要接在这套 DOM 层里，新增 `renderPunchbook()`、`renderStoryModal()`、`renderDeadline()`、`renderCombatObjectives()`，而不是把剧情文字丢进 Phaser。

### 1.8 资源层

`maws_src/assets/manifest.js` 当前已经有：

- 城市总览日/夜图：`bg.city.map.day/night`
- 10 个地点日/夜背景
- 主角、敌人、NPC standee
- player/boxer/grappler/weapon/boss 五套 fighter sprite strip
- 头像、物品、导航图标、技能卡、UI panel、VFX
- `flattenManifest()` 和 `assetPath()`

主线新增资源建议只加最小集：父亲头像/旧拳谱/旧护腕/烧烤摊夜景；没有资源时先用 token 或现有背景 fallback。

---

## 2. 新版主线定位

### 2.1 一句话

陆小闲从小被父亲用“茂家拳天下第一”的善意谎言养大，靠体型、运气和几次误判胜利相信自己是传统武术天才；在真正对抗中被“一阵风”打醒后，他发现茂家拳原本是假的，却决定从自己这一代开始，把它练成真的。

### 2.2 主题

不是“传武打假”，也不是“现代搏击碾压传统”，而是：

> 神功是假的，陪伴是真的；祖传是假的，不服输是真的；从今天开始，茂家拳可以是真的。

### 2.3 Demo 名称

`了不起的武术模拟器：一阵风`

### 2.4 玩家体验目标

玩家在 30 天内经历：

1. 我看起来很强。
2. 我也以为我很强。
3. 原来我是最弱的。
4. 原来父亲不是骗子，是笨拙地爱我。
5. 假的东西，如果有人认真练，也可以从此刻开始变成真的。
6. 我不必天下第一，我只要不再是一阵风。

---

## 3. 30 天主线重排

当前 `MAIN_EVENTS` 是 1/5/12/18/24/30 六个节点。建议改为 11 个节点，但仍保持每日最多一个主线事件，不破坏现有 `startMainEvent()` 结构。

| Day | 标题 | 地点 | 类型 | 接入目的 |
|---:|---|---|---|---|
| 1 | 给父亲上香 | home | story/dialog | 建立陆小闲、父亲、祖训、茂家拳 |
| 2 | 地铁见义勇为 | street | choice | 第一次误判胜利，增加误判值 |
| 3 | 便利店货架事件 | store | choice | 强人设喜剧，陆小闲以为自己“内力外放” |
| 5 | 公园第一次验货 | park | battle | 低风险切磋，继续误判或者获得早期实战认知 |
| 8 | 一阵风 | boxing | scripted battle | 真正现实打脸，剧情性失败 |
| 9 | 父亲日记 | home | diary | 真相反转，进入百家入茂 |
| 12 | 阿豹刷到你了 | park/street | battle/dialog | 短视频信徒作为陆小闲镜像 |
| 18 | 便利店门口的三个人 | store | choiceBattle | 检验风险判断，非战斗解也成立 |
| 24 | MMA 开放垫子 | mma | battle | 检验防摔和地面求生 |
| 29 | 烧烤摊夜谈 | street/store | nightTalk | 终战前情绪收束 |
| 30 | 真东西测试 | boxing | objectiveBattle | 目标制终战，不以 KO 为唯一胜利 |

---

## 4. 新增状态模型

在 `state.js` 的 `createNewState()` 中新增根字段 `maw`。不要塞进 `player`，因为它不是普通属性，而是主线、拳谱和结局系统。

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
  forms: {
    openMountain: { reforge: 0, unlockedNote: false },
    ironBody: { reforge: 0, unlockedNote: false },
    sealThroat: { reforge: 0, unlockedNote: false },
    windStep: { reforge: 0, unlockedNote: false },
    groundRoot: { reforge: 0, unlockedNote: false }
  },
  modules: {
    boxing: 0,
    body: 0,
    traditional: 0,
    grappling: 0,
    street: 0
  },
  objectives: {}
}
```

字段说明：

| 字段 | 说明 | UI 位置 |
|---|---|---|
| `belief` | 祖传信念，前期给士气，Day 8 后被打碎 | 人物页/拳谱页 |
| `misread` | 误判值，前期靠“假胜利”上涨 | 结算/日志隐藏或半隐藏 |
| `fatherMemory` | 父亲记忆，影响日记、夜谈和终战冷静 | 拳谱页/剧情弹窗 |
| `reforge` | 茂拳完成度，由五个模块综合计算 | HUD 小标签/拳谱页 |
| `forms` | 五个茂家拳旧解到新注的进度 | 拳谱页 |
| `modules` | 拳击、身体、传统、地面、街头五大吸收模块 | 拳谱页 |
| `objectives` | 终战目标制记录 | 战斗 UI |

### 4.1 migrateSave 补丁

`migrateSave()` 需要补齐 `maw`，否则旧存档会坏。

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
s.maw.modules = {
  boxing: 0,
  body: 0,
  traditional: 0,
  grappling: 0,
  street: 0,
  ...(s.maw.modules || {})
};
s.maw.objectives ||= {};
```

---

## 5. 数据层接入规格

### 5.1 新增 `MAW_RULES`

放在 `RESOURCE_RULES` 附近。

```js
export const MAW_RULES = {
  belief: { name: '祖传信念', icon: '祖', desc: '陆小闲对“茂家拳天下第一”的相信程度。前期给士气，后期必须被真实性重写。' },
  misread: { name: '误判值', icon: '误', desc: '把偶然胜利理解成神功的程度。前期让人上头，Day 8 会变成现实冲击。' },
  fatherMemory: { name: '父亲记忆', icon: '父', desc: '不是战斗力，而是陆小闲为什么还能站起来。影响日记、新注、夜谈和终战冷静。' },
  reforge: { name: '茂拳完成度', icon: '茂', desc: '把拳击、传统拆解、地面、防守和街头判断写回茂家拳谱的进度。' }
};
```

### 5.2 新增 `MAW_FORMS`

```js
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
  },
  windStep: {
    name: '茂家穿云步',
    oldSkill: 'dodge',
    coreSkill: 'dodge',
    module: 'street',
    oldNote: '身如穿云，敌不见影。',
    newNote: '脚先走，脑子别留在原地。'
  },
  groundRoot: {
    name: '茂家落地生根',
    oldSkill: 'sprawl',
    coreSkill: 'sprawl',
    module: 'grappling',
    oldNote: '落地如山，万法不侵。',
    newNote: '不会防摔，地面会替你讲课。'
  }
};
```

### 5.3 新增 NPC

当前 NPC 有刘胖子、梁教练、周青山、小满、陈见锋。新增：

```js
father: { name: '父亲', icon: '父', hidden: true },
abao: { name: '阿豹', icon: '豹' },
oldman: { name: '推手大爷', icon: '推' }
```

`father.hidden` 表示不进入普通关系页，只进入日记/拳谱系统。

### 5.4 新增敌人

`E10` 用于 Day 8 剧情战；`E11` 用于阿豹。

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
  reward: { money: 0, fame: 0 },
  script: 'first_wind'
}
```

```js
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
  reward: { money: 80, fame: 40 }
}
```

注意：由于 `combat.js` 内部也有 `ENEMY_TEMPLATES`，这两个敌人必须同步加入 combat 层，或者先复用 E01/E04 的模板并通过 `data.js` 控制 UI 文案。

---

## 6. 数值设计

### 6.1 误判值

获得来源：

| 来源 | 增量 |
|---|---:|
| Day 2 地铁见义勇为成功 | +12 |
| Day 3 便利店威慑成功 | +8 |
| 打赢低风险但未复盘 | +4 |
| 买直播间玄学装备 | +6 |
| 评论区嘴硬 | +5 |

影响：

- Day 8 惨败文案更刺痛。
- Day 8 前误判越高，真实性越容易下降。
- Day 9 后一部分转化为父亲记忆。

建议转换：

```js
const converted = Math.round(state.maw.misread * 0.35);
state.maw.fatherMemory += converted;
state.maw.misread = 0;
```

### 6.2 父亲记忆

获得来源：

| 来源 | 增量 |
|---|---:|
| 给父亲上香 | +3 |
| 父亲日记 | +25 |
| 父亲旧护腕 | +2/关键剧情 |
| Day 29 独自烧烤 | +8 |
| 终战前真诚选择 | +5 |

作用：

- 终战冷静检定加成。
- 解锁拳谱新注文案。
- 失败结尾更温柔。
- 让“父亲不是骗子，是笨拙地爱我”的主题落地。

### 6.3 茂拳完成度

茂拳完成度不直接刷，而是根据五大模块计算：

```js
reforge = Math.round(
  modules.boxing * 0.30 +
  modules.body * 0.20 +
  modules.traditional * 0.20 +
  modules.grappling * 0.20 +
  modules.street * 0.10
);
```

模块来源：

| 模块 | 来源 |
|---|---|
| boxing | jab、straight、boxing style、梁教练关系 |
| body | tou、bal、fitXp、guard、dodge |
| traditional | palm、offbalance、traditional style、auth、周青山关系 |
| grappling | sprawl、escape、grip、takedown、mma style |
| street | talkdown、dirtyescape、jud、street style、riskWins |

---

## 7. 战斗接入方案

### 7.1 Day 8：一阵风

不要做纯 cutscene。玩家应当能操作一个自动窗口，但剧情结果固定。

接入点：

1. `MAIN_EVENTS[8]` 添加 `script: 'first_wind'`。
2. `startBattle()` 读取主线 script 并写入 `state.combat.script`。
3. `confirmBattle` 执行一次 `resolveCombatExchange()`。
4. `mergeCombatResult()` 后，如果 `script === 'first_wind' && windowCount >= 1`，调用 `finishBattle(state, 'first_wind')`。
5. `finishBattle()` 对 `first_wind` 走专用结算，不给普通胜负奖励。

文案按玩家选择变化：

| 玩家行为 | 反馈 |
|---|---|
| 选 guard | 你护住了一点，但没护住自尊。 |
| 选 dodge | 你想闪，脚慢了半拍。 |
| 选 straight | 你刚准备证明，证明已经结束。 |
| 选 mystic | 混元还没来得及一气，世界已经白了。 |
| 选 talkdown | 对手点点头，然后用拳解释了交流边界。 |

主弹窗：

```text
一阵风

你看见他的肩膀动了一下。
然后世界安静了。

爸，我只感觉到了一阵风。
```

结果更新：

```js
state.maw.firstWindDone = true;
state.maw.chapter = 'broken';
state.maw.belief = Math.max(10, state.maw.belief - 55);
state.maw.fatherMemory += Math.round(state.maw.misread * 0.35);
state.maw.misread = 0;
state.flags.needFatherDiary = true;
```

### 7.2 Day 30：目标制终战

终战不是 KO 检测，而是目标检测。

目标：

| ID | 文案 | 判定 |
|---|---|---|
| surviveWindow1 | 撑过第一轮 | 完成第一个自动窗口且没结束 |
| guardHeavy | 有效防住一次重击 | 敌方重击时 guard/dodge/sprawl 生效 |
| landStraight | 打出一次有效直拳 | straight 命中 |
| recoverFromHit | 挨打后继续执行动作 | 受击后下一窗口仍有有效行动 |
| useReforgedSkill | 使用一次重铸招式 | 使用重铸进度达标技能 |
| keepCalm | 没有士气崩溃 | 结束时 calm/morale 达标 |

结算：

| 完成数 | 结果 |
|---:|---|
| 0-1 | 失败，但获得清楚复盘 |
| 2 | 输了，但不是一阵风 |
| 3-4 | 通过真东西测试 |
| 5-6 | 茂家拳第一次配得上自己的名字 |

---

## 8. UI 接入方案

### 8.1 HUD

新增一枚 deadline chip，不要让资源条过载。

```text
挑战夜 还有 18 天
```

建议 `buildRenderModel()` 输出：

```js
deadline: {
  day: 30,
  left: Math.max(0, 30 - state.day),
  label: '真东西测试'
}
```

### 8.2 地图任务板

当前 `renderTaskBoard()` 已有今日主线和待办，直接增强文案与标签即可。新增主线类型显示：

- `story`
- `choice`
- `diary`
- `scriptedBattle`
- `objectiveBattle`
- `nightTalk`

Day 8 主线卡示例：

```text
今日主线：一阵风
地点：拳馆
你要去证明茂家拳。系统建议：这不是一个好主意。
```

### 8.3 人物页新增茂家拳谱

在 `renderProfile()` 的标题和三条 vitals 之后插入 `renderPunchbook(model)`。

拳谱卡：

```text
茂家开山拳
旧解：一拳开山，气吞山河。
新注：先别开山，先把手收回来护脸。
进度：42%
来源：拳击实用 / 直拳 / 梁教练
```

Day 9 前：只显示旧解。  
Day 9 后：显示“旧解存疑”。  
重铸达标后：显示“新注”。

### 8.4 战斗 UI 新增目标清单

在 `renderCombat()` 的 `maws-combat-planner` 里加入：

```html
<section class="maws-combat-objectives">
  <b>真东西测试</b>
  <span class="done">撑过第一轮</span>
  <span>有效防住一次重击</span>
  <span>打出一次有效直拳</span>
</section>
```

移动端必须折叠成横向 chip，不要撑高底部 dock。

### 8.5 Story Modal

在 `renderModal()` 中增加以下类型：

- `storyChoice`
- `diary`
- `firstWind`
- `nightTalk`
- `objectiveResult`

不要用普通 settlement modal 承载父亲日记。父亲日记需要独立样式，少按钮、长文本、可滚动。

---

## 9. 技能接入方案

### 9.1 不新增大量技能

MVP 不建议新增十几个“茂家拳技能”。直接复用现有技能，并在 UI 上给它们套一层“拳谱旧解/新注”。

| 茂家拳旧名 | 对应现有技能 | 重铸来源 |
|---|---|---|
| 茂家开山拳 | straight | 拳馆直拳/回防 |
| 茂家铁布衫 | guard | 抱架/身体控制 |
| 茂家封喉手 | palm/offbalance | 传统拆解/距离时机 |
| 茂家穿云步 | dodge/retreat | 步法/街头撤离 |
| 茂家落地生根 | sprawl/escape | 防摔/地面脱身 |

### 9.2 重铸后的轻量战斗效果

| 重铸项 | 条件 | 效果 |
|---|---|---|
| 开山拳新注 | openMountain >= 60 | straight 命中 +3%，终战可触发 landStraight |
| 铁布衫新注 | ironBody >= 60 | guard 减伤 +5%，架势恢复 +3 |
| 封喉手新注 | sealThroat >= 60 | palm 风险 -3%，offbalance 架势伤害 +3 |
| 穿云步新注 | windStep >= 60 | dodge/retreat 成功后距离变化更稳 |
| 落地生根新注 | groundRoot >= 60 | 首次被抱摔时获得额外防摔检定 |

---

## 10. 装备接入方案

新增装备不要只做数值，要服务主题。

| 物品 | 类型 | 槽位 | 作用 |
|---|---|---|---|
| 父亲旧护腕 | 情感装备 | accessory | calm +2，父亲记忆触发 |
| 祖传拳谱 | 剧情物品 | none | 开启拳谱 UI，不可出售 |
| 直播间秘传护腕 | 玄学装备 | accessory | morale +8，misread +6，auth -2 |
| 正规缠手 | 正规装备 | hand | strikeDmg +0.04，risk -0.02 |
| 基础护膝 | 正规装备 | body | bal +1，伤病风险降低 |
| 便利店冰袋 | 补给 | none | fatigue -8，hp +6 |

文案示例：

```text
父亲旧护腕
弹性已经不太行了，但你每次戴上，都能想起他教你站直的样子。
效果：冷静 +2，父亲记忆触发率提高。
```

```text
直播间秘传护腕
主播说这是开过光的。
快递说这是义乌发的。
效果：士气 +8，误判 +6，真实性 -2。
```

---

## 11. NPC 接入方案

### 11.1 陆父

不进入普通 NPC 页。出现在 Day 1、Day 9、拳谱页、Day 29 独处夜谈和最终结尾。

功能：情感锚点。

核心文案：

```text
爸不是不教你绝招。
爸是真的不会。

但你第一次愿意出门跑步，是因为你相信它。
你第一次没有低着头走过校门，也是因为你相信它。
```

### 11.2 刘胖子

功能：朋友、吐槽、流量线入口。

```text
你这个气势，确实像高手。
就是高手一般不会把便利店货架拍得道歉。
```

### 11.3 小满

功能：便利店生活锚点、非暴力处理。

```text
你真要帮我，就别把门口打成决赛现场。
监控开着呢，警察也不是观众席。
```

### 11.4 梁教练

功能：拳击基础、毒舌现实检验。

```text
你这不叫拳，叫用肩膀发表意见。
先把手收回来。脸不是公共资源。
```

### 11.5 周青山

功能：传统拆解，不是骗子，也不神化。

```text
招名可以留，神话先放一边。
落到压力里还剩下的，才叫东西。
```

### 11.6 推手大爷

功能：身体控制、平衡、幽默。

```text
你这不叫下盘稳。
你这是上半身迷路了，下半身不敢报警。
```

### 11.7 阿豹

功能：短视频信徒，陆小闲镜像。

```text
你信祖传，我信算法。
咱俩谁也别笑谁。
```

### 11.8 陈见锋

功能：最终真实检验者，不是反派。

```text
你这拳乱七八糟。
但有几下，不是骗人的。
```

---

## 12. 事件接入方案

### 12.1 前期误判事件

放在 `EVENT_RULES`，并限定 `maw.chapter === 'illusion'` 或 day <= 7。

示例：

```js
{
  id: 'subway_misread_win',
  title: '地铁口有人退了一步',
  loc: 'street',
  desc: '你摆出茂家拳起手式。对方退了。你认为这是内力，对方主要是怕你嗓门太大。',
  kind: 'storyChoice',
  base: 60,
  effects: { misread: 8, morale: 4, heat: 1 },
  when: { chapter: 'illusion' }
}
```

### 12.2 破碎后训练事件

限定 `maw.chapter === 'reforge'`。

```js
{
  id: 'father_note_corner',
  title: '拳谱夹层里还有一页纸',
  loc: 'home',
  desc: '父亲写下你第一次跑完一圈的日子。那页纸没有招式，但很重。',
  kind: 'diarySmall',
  base: 45,
  effects: { fatherMemory: 4, calm: 3 },
  when: { chapter: 'reforge' }
}
```

### 12.3 高热度挑战事件

当前事件层已经支持 `minHeat`。继续使用。

```js
{
  id: 'abao_called_out',
  title: '阿豹公开点了你的名',
  loc: 'park',
  enemy: 'E11',
  kind: 'battle',
  base: 45,
  when: { minHeat: 14 },
  weights: { heat: 2.4, fame: 1.0, fatigue: -1.0, injuries: -3.0 }
}
```

---

## 13. 文案规则

### 13.1 旁白语气

方向：像损友，也像评书先生；可以笑，但不能羞辱陆小闲。

好句式：

```text
你摆出茂家拳起手式。
从远处看，确实有一代宗师的气势。
从近处看，像一个准备搬冰箱的人。
```

```text
你的上半身同意了这个动作。
你的脚没有收到通知。
```

```text
你看见了对方的拳。
这是巨大的进步。
你没有躲开。
这是现实。
```

### 13.2 父亲线尺度

父亲相关不要一直玩梗。可以轻轻一刺，但必须沉下来。

```text
父亲不是没教你绝招。
他是真的不会。

但他记得你第一次主动出门跑步的日子。
```

### 13.3 传统武术表达

不要写成“传武全是假”。要写成：

```text
传统不是不能用，是不能只剩名字。
```

---

## 14. 开发 Batch 计划

### Batch 0：写 checkpoint 和故事接入计划

改动：

- 新增 `docs/STORY_INTEGRATION_PLAN.md`
- 更新 `docs/CURRENT_TASK.md`
- 更新 `docs/CURRENT_STATUS.md`

不做：

- 不改运行代码。

验收：

- 文档存在。
- 下一窗口能按 checkpoint 接着做。

### Batch 1：data.js 主线数据接入

改动：

- 新增 `MAW_RULES`
- 新增 `MAW_FORMS`
- 扩展 `NPCS`
- 扩展 `ITEMS`
- 扩展 `ENEMIES`
- 重排 `MAIN_EVENTS`

同时注意：E10/E11 需要在 `combat.js` 里同步，或者本 Batch 只先做数据层并在下一 Batch 接 combat。

验收：

- `node --check maws_src/content/data.js`
- 页面 import 不报错。

### Batch 2：state.js 加 maw 状态与迁移

改动：

- `createNewState()` 新增 `maw`
- `migrateSave()` 补齐 `maw`
- 新增 `updateMawProgress(state)`
- `buildRenderModel()` 输出 `maw`、`deadline`、`punchbook`
- `gainParts()` 支持新增字段

验收：

- 新开局有 `state.maw`
- 旧存档迁移不坏
- `model.maw` 可被 UI 读取

### Batch 3：拳谱 UI

改动：

- `ui.js` 新增 `renderPunchbook(model)`
- 插入 `renderProfile()`
- `ui.css` 增加拳谱卡样式
- 移动端折叠或横向滚动

验收：

- 人物页可见拳谱
- Day 9 前后显示不同
- 390x844 无横向溢出

### Batch 4：Day 8 一阵风与 Day 9 父亲日记

改动：

- `startBattle()` 支持 `script`
- `confirmBattle` 识别 `first_wind`
- `finishBattle('first_wind')` 专用弹窗
- `renderModal()` 增加 `firstWind` 和 `diary`
- 新增 `acceptFatherTruth` action

验收：

- Day 8 一窗口后专用失败
- Day 9 日记可读
- 读完进入百家入茂

### Batch 5：机会卡改造

改动：

- `events.js` 增加误判期、破碎期、重铸期、高热度、父亲记忆事件
- `factorsFor()` 增加 `maw` 相关 factor
- `passesRule()` 支持 `when.chapter`、`when.afterDiary` 等

验收：

- Day 1-7 多刷误判/上头事件
- Day 10 后多刷训练/复盘事件
- 热度高时挑战变多
- 疲劳高时恢复提醒变多

### Batch 6：终战目标制

改动：

- `combat.js` 给 step 打目标标签
- `state.js` 在 `mergeCombatResult()` 更新 objective
- `ui.js` 在 `renderCombat()` 显示 checklist
- `finishBattle()` 根据目标数判定结局

验收：

- Day 30 不 KO 也能通过
- 目标完成可见
- 结算文案分层

### Batch 7：装备和资源调味

改动：

- 新增父亲旧护腕、祖传拳谱、直播间秘传护腕、正规缠手、基础护膝、冰袋
- `effectSummary()` 支持新增 key
- `applyGain()` 或使用物品逻辑支持 `maw` 字段

验收：

- 装备可买/可装备/可卸下
- 玄学装备提高士气但降低真实性
- 父亲旧护腕不进入普通商店，通过剧情获得

### Batch 8：完整 smoke 与文案统一

验证：

- 新开局、保存、读档
- Day 1、Day 8、Day 9、Day 30
- 地图、人物、技能、背包、商店、NPC、日志、自检
- E01/E06/E07/E10/E11/E18
- 1365x768、900x700、390x844 无横向溢出
- `node --check` 全部 JS
- `node maws_src/tools/verify_assets.mjs`

---

## 15. QA 清单

### 数据

- 新档 `state.player.name === '陆小闲'`
- 新档 `state.maw` 存在
- 旧档 migrate 后 `state.maw` 存在
- `MAIN_EVENTS[8]` 有 `script: 'first_wind'`
- `MAIN_EVENTS[9]` 有 `script: 'father_diary'`
- `MAIN_EVENTS[30]` 有 objectives

### UI

- HUD 显示距真东西测试剩余天数
- 人物页显示茂家拳谱
- Day 9 前不显示新注
- Day 9 后显示旧解存疑
- 战斗页目标 checklist 移动端不遮挡确认按钮
- 父亲日记弹窗移动端可滚动

### 战斗

- E01 正常
- E06 抱摔正常
- E07 武器威胁正常
- E10 一阵风一窗口后强制结算
- E11 阿豹正常
- E18 目标制终战正常

### 叙事

- Day 1 能建立父亲和祖训
- Day 2/3 能体现误判胜利
- Day 8 好笑但有痛感
- Day 9 父亲线不油、不乱开玩笑
- Day 29 温暖
- Day 30 不要求天下第一，只证明不是一阵风

---

## 16. 最终效果标准

接入完成后，这个 Demo 应当让玩家在 30 天内清楚经历：

1. 陆小闲为什么会相信自己很强。
2. 陆小闲为什么会被现实打醒。
3. 父亲为什么编出茂家拳。
4. 茂家拳为什么可以从假变真。
5. 玩家为什么要训练、复盘、社交、恢复，而不是只刷战斗。
6. Day 30 不是打赢天下第一，而是让“茂家拳第一次不是零”。

最终结尾建议：

```text
你没有证明茂家拳天下第一。
但你证明了，它终于不是零。

茂家拳谱第一页新注：
本门拳法，祖传部分存疑。
但今日起，有人开始认真练。
```
