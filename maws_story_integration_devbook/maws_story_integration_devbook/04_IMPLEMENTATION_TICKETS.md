# 04 Implementation Tickets

## Batch 0：扫描与 checkpoint

涉及文件：

- `README.md`
- `AGENTS.md`
- `docs/CURRENT_TASK.md`
- `docs/CURRENT_STATUS.md`
- `docs/CURRENT_TEST_REPORT.md`
- `docs/CHANGELOG.md`

任务：

1. 确认当前源码分支。
2. 新建 `docs/STORY_INTEGRATION_PLAN.md`，写入本开发书摘要。
3. 不改任何运行代码。

验收：

- checkpoint 更新。
- 没有运行时变更。

---

## Batch 1：数据层主线接入

涉及文件：

- `maws_src/content/data.js`

任务：

1. 新增 `MAW_RULES`。
2. 新增 `MAW_FORMS`。
3. 扩展 `NPCS`：father / abao / oldman。
4. 新增 `E10` 一阵风对手，`E11` 阿豹。
5. 替换 `MAIN_EVENTS`。
6. 新增必要物品：父亲旧护腕、直播间秘传护腕、正规缠手、基础护膝。

不做：

- 不改 UI。
- 不改 combat 公式。
- 不改存档 key。

验收：

- `node --check maws_src/content/data.js`
- 页面能 import 成功。

---

## Batch 2：状态与迁移

涉及文件：

- `maws_src/simulation/state.js`
- 可能涉及 `maws_src/simulation/economy.js`

任务：

1. `createNewState()` 新增 `maw`。
2. `migrateSave()` 补齐 `maw`。
3. `gainParts()` 增加：
   - 祖传信念
   - 误判值
   - 父亲记忆
   - 茂拳完成度
4. 新增 `updateMawProgress(state)`。
5. 在训练、复盘、战斗结算后调用 `updateMawProgress()`。
6. `buildRenderModel()` 输出：
   - `maw`
   - `deadline`
   - `chapterTitle`
   - `punchbook`

验收：

- 新开局 `store.state.maw` 存在。
- 旧存档迁移不报错。
- 人物页数据模型可读到 `model.maw`。

---

## Batch 3：拳谱 UI

涉及文件：

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`

任务：

1. 新增 `renderPunchbook(model)`。
2. 插入到 `renderProfile()`。
3. Day 9 前隐藏新注，Day 9 后显示“旧解存疑”。
4. 进度条显示五个拳谱条目。
5. 移动端压缩成横向卡或折叠卡。

验收：

- 1365x768 不遮挡。
- 900x700 不横溢。
- 390x844 可滚动且无横向溢出。
- 技能页和战斗页不受影响。

---

## Batch 4：一阵风与父亲日记

涉及文件：

- `maws_src/simulation/state.js`
- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`

任务：

1. `MAIN_EVENTS[8].script` 进入 `state.combat.script`。
2. `confirmBattle` 后识别 `first_wind`，一窗口后强制结算。
3. `finishBattle('first_wind')` 专用弹窗。
4. Day 9 `script: 'father_diary'` 专用日记弹窗。
5. 日记最后按钮触发 `acceptFatherTruth` action。
6. `acceptFatherTruth` 更新 `maw.chapter = 'reforge'`。

验收：

- Day 8 不会普通胜负结算。
- Day 8 后不会卡 combat。
- Day 9 日记能进入、关闭、推进。
- 旧存档跳过 Day 8 也不报错。

---

## Batch 5：机会卡改造

涉及文件：

- `maws_src/simulation/events.js`

任务：

1. 增加误判期机会卡：
   - 评论区开喷
   - 直播间秘传护腕
   - 公园大爷一句话
2. 增加重铸期机会卡：
   - 梁教练复盘
   - 周青山拆招
   - MMA 地板免费授课
   - 父亲日记边角
3. 增加高热度风险机会：
   - 阿豹点名
   - 旧城公开叫阵
4. 增加恢复机会：
   - 身体递交投诉书
5. 调整权重，使机会卡随阶段明显变化。

验收：

- Day 1-7 常见误判/上头事件。
- Day 10 后常见训练/复盘事件。
- 热度高时挑战变多。
- 疲劳高时理疗提醒变多。

---

## Batch 6：终战目标制

涉及文件：

- `maws_src/simulation/combat.js`
- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`

任务：

1. `startBattle()` 支持 `objectives`。
2. 战斗 step 可写入 objective tags。
3. `mergeCombatResult()` 更新目标状态。
4. `renderCombat()` 显示目标 checklist。
5. `finishBattle()` 根据目标数给结果文案。
6. 终战结果写日志和 eventLog。

验收：

- Day 30 不 KO 也能通过。
- 完成目标会显示勾选。
- 0/2/3/5 个目标分别有不同结算文案。

---

## Batch 7：装备与商店

涉及文件：

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`

任务：

1. 新增装备。
2. `effectSummary()` 支持新效果字段。
3. 玄学装备购买后增加误判或降低真实性。
4. 父亲旧护腕不在普通商店出售，应通过 Day 9 日记获得。
5. 商店可按类别显示正规装备/补给/玄学诱惑。

验收：

- 装备槽正常。
- 新装备效果可见。
- 玄学装备不直接破坏战斗平衡。

---

## Batch 8：文案统一与 QA

涉及文件：

- `data.js`
- `events.js`
- `ui.js`
- `docs/*`

任务：

1. 统一文案风格。
2. 不让父亲日记过度搞笑。
3. 确认所有弹窗有明确按钮。
4. 更新 checkpoint。
5. 跑 smoke。

验收：

- 主线可从 Day 1 跑到 Day 30。
- 桌面/平板/手机无横向溢出。
- E01/E06/E07/E10/E11/E18 可启动。
- 新旧存档可读取。
