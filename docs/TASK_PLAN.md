# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

实现核心六项训练小游戏模板，并让小游戏完成情况自动映射不同训练收益档位。

## Scope

- 覆盖 `bag`、`sprawl_drill`、`sanda_combo_drill`、`karate_kihon_drill`、`tkd_kick_line`、`gym_basic`。
- 保留现有 `poor / solid / sharp` 三档收益倍率和原始 `gain` 数据。
- 不改战斗公式、经济曲线、敌人数据、存档 key/version 或资产结构。
- 不把未覆盖训练项强行接入小游戏。

## Relevant Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/TASK_PLAN.md`

## Plan

- [x] 为核心六项补充 `combo/read/pacing` 数据驱动小游戏回合。
- [x] 扩展训练 modal 状态，记录回合、得分、反馈和历史。
- [x] 新增训练选项推进逻辑，按得分自动映射 `sharp >= 80%`、`solid >= 50%`、其余 `poor`。
- [x] 保留旧 `finishTraining` 直接结算入口，避免既有测试脚本失效。
- [x] 更新 DOM 训练弹窗和移动端样式。
- [x] 跑 build、状态 smoke 和真实浏览器 smoke。

## Validation

- [x] `npm run build`：通过，检查 20 个 JS/MJS 文件，并验证 93 个 manifest entries。
- [x] Node 状态 smoke：通过。六项训练均能打开并结算；关闭弹窗不扣资源；完成后体力、金钱、时间只扣一次。
- [x] 收益差异：通过。沙包训练 poor/solid/sharp 后 `jab.p` 分别为 24/26/28。
- [x] 浏览器 smoke：通过。Chrome + 临时 HTTP 服务打开页面，六项训练用真实按钮点击推进并结算到“超额完成”。
- [x] 浏览器响应式：通过。1365x768、900x700、390x844 下训练弹窗 `scrollWidth` 均等于视口宽；按钮高度 43px，手机宽按钮 278px。
- [x] 浏览器错误检查：通过。console error 0，page error 0，HTTP 4xx/5xx 0。

## Result

核心六项训练已从“一键选档”改成短回合小游戏：每轮选择会给即时反馈，最后根据总分自动进入勉强、稳定或超额完成，并沿用原收益倍率结算。

生成浏览器截图：

- `output/playwright/training-modal-mobile.png`

## Risks

- 当前小游戏是短回合选择模板，不含实时倒计时；这是本轮为稳定验证和避免测试抖动做的取舍。
- 选项分数暂存在数据配置里，玩家界面不直接显示分数；后续需要靠文案和反馈继续调手感。
- 工作区在本轮开始前已有大量未提交改动，本轮只做训练小游戏相关增量，没有回退既有改动。

## Next Step

建议下一轮只做一件事：把武馆 `pressure_test` / `push_train` 接入同一套 `read` 或 `combo` 模板，或对本轮六项做一次玩家文本反馈打磨。若中断，新窗口先读取 `AGENTS.md`、`docs/FILE_MAP.md`、`docs/TASK_PLAN.md`。
