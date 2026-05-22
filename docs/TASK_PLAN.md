# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13：First-Look Vertical Slice Polish。

## Current Result

- Wave 13 staged pipeline 已创建并推送。
- 已完成并合入 staging：
  - `feat/reward-delta-contract-v2`
  - `feat/time-activity-feel-pass`
  - `docs/wave13-first-look-shotlist`
- 已完成但尚未合入 staging：
  - `feat/visual-stage-hard-pass`
- 已将通用 CLI worker 启动器和 repo pipeline 默认改为 `gpt-5.5` + `high`。

## Validation

- CLI launcher PowerShell parse：通过。
- Repo pipeline PowerShell parse：通过。
- Pipeline JSON parse/model check：通过。
- `git diff --check`：通过。

## Risks

- 本轮 pipeline 曾被用户手动中断；不要从头重跑已完成阶段，否则可能重置已完成 worker worktree。
- 后续应先合 `feat/visual-stage-hard-pass`，再启动 Combat Command、NPC Click、First-Look Smoke、QA。
- `GameDesigner_CombatAnalysis/` 是未跟踪目录，本轮不触碰。
- 本轮仍不进入技能树 implementation。

## Next Step

提交并推送 `gpt-5.5` + `high` worker 默认配置；之后继续收口 Wave 13 剩余阶段。
