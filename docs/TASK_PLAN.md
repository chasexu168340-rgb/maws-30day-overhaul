# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13：First-Look Vertical Slice Polish。

## Goal

让 Day 1-Day 5 前 20 分钟的 5 个核心画面像一个能玩的城市武术 RPG：

1. 出租屋主界面。
2. 点击 NPC/角色。
3. 普通事件收益反馈。
4. 时间投入弹窗。
5. Day 5 战斗 HUD。

## Current Plan

- [x] 将 Wave 13 文件化为 worker prompts。
- [x] 将 pipeline 扩展为 staged worker flow，避免同文件冲突和 QA 提前跑。
- [x] 按写集收敛执行顺序：Reward -> Time/Shotlist -> Visual Stage -> Combat Command -> NPC Click -> Smoke -> QA。
- [ ] 提交并推送 Wave 13 prompts/scripts。
- [ ] 启动 `scripts/run_wave13_first_look_workers.ps1`。
- [ ] Pipeline 完成后人工看 `test-results/wave13/` 和现有 visual 截图。

## Validation

- Prompt/script 提交前：PowerShell parse、JSON parse、`git diff --check`。
- Pipeline 内：每阶段按 spec 运行 `check:full`、`test:playtest`、Wave 12/Wave 13 visual smoke。
- 最终：QA 最后运行，且只在所有实现分支合并并推送后启动。

## Risks

- `Reward Delta Contract v2` 与 `Time Activity Feel Pass` 都会碰 `state.js/economy.js/events.js`，所以本轮没有强行并行这两个 worker。
- `Visual Stage`、`Combat Command Bar`、`NPC Click` 都会碰 UI，已强制串行。
- 本轮仍不进入技能树 implementation。
- `GameDesigner_CombatAnalysis/` 是未跟踪目录，本轮不触碰。

## Next Step

提交并推送 Wave 13 staged pipeline，然后启动 worker。
