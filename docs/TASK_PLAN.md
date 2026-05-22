# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 11：Flow + Combat + UI 收敛多 CLI 集成收尾。

## Scope

- 已合并并验证：`feat/combat-plan-mode-v1`、`feat/time-activity-pass-v1`、`feat/ui-readable-reward-pass`、`test/wave11-flow-smoke`、`docs/skill-tree-vertical-slice-v1`。
- 已在所有分支合并推送后运行 QA：`qa/wave11-review`。
- 本轮没有改初始正式技能赠送，没有把 `jab` / `advance` 放回开局。

## Plan

- [x] Wave 11 prompts/scripts 提交并推送。
- [x] 5 个实现/测试/文档 worker 完成并推送。
- [x] Combat Plan、Time Activity、UI Readable Reward、Flow Smoke、Skill Tree Slice 按顺序合并。
- [x] Flow Smoke 首次发现技能 details 默认关闭，已按验收补丁恢复技能 details 默认展开。
- [x] 合并后运行 `check:full`、`test:playtest`、Day 5 sim、Wave 11 flow smoke、`diff check`。
- [x] QA 在最新 staging 后启动并提交报告。
- [x] QA 报告已合回 staging。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `node maws_src/tools/sim_day5_park_check.mjs`：通过。
- `npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line`：通过，4/4。
- `git diff --check`：通过。

## Result

Wave 11 集成完成。战斗主视图收敛到当前 1-2 招窗口，奖励反馈更直接，小弹窗更紧凑，关键行动/技能信息默认可见，Time Activity 增加粗粒度反刷压力，技能树第一片实现方案已写入文档。

## Risks

- Combat plan mode 当前是 state/combat foundation，还没有 DOM 可选控件。
- Time Activity repeat pressure 仍是粗粒度 bucket，后续可以按地点/技能细化。
- 技能树 vertical slice 仍是文档，不是运行代码。

## Next Step

人工进游戏检查战斗面板、奖励弹窗、时间投入弹窗和技能页；通过后再开下一轮 skill tree implementation 或 plan-mode UI 控件切片。
