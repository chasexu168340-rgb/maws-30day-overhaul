# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 9：Scene Presentation 多 CLI。修正两阶段 pipeline 的可见窗口和自动关闭等待问题，然后由 Manager 手动续接合并。

## Scope

- 修复 `scripts/Invoke-MawsMultiCliPipeline.ps1`。
- 更新本 checkpoint。
- 不改游戏代码、数据、UI、战斗、经济、资产或存档。

## Plan

- [x] Wave 9 prompts/spec/wrapper 已提交并推送。
- [x] Wave 9 pipeline 已启动，A-D worker 启动成功，QA 未提前启动。
- [x] `scene-stage`、`dialogue-box`、`visual-direction` 已在各自分支提交。
- [x] `event-feedback` 误提交到主 staging，已 cherry-pick 到 `feat/event-feedback-loop` 并清理主仓库。
- [x] 修复 `visibleWorkers=true` 时窗口空白：可见窗口不再重定向 stdout/stderr。
- [x] 修复 worker 自动关闭后 `Wait-Process -Id` 找不到 PID：改用 process object `WaitForExit()`。
- [ ] 推送 pipeline 修复。
- [ ] Manager 手动推送/合并 A-D，再延后启动 QA。

## Validation

- 待跑：PowerShell scriptblock parse。
- 待跑：`git diff --check`。

## Result

当前 Wave 9 实现 worker 产物已就绪或已归位；接下来不重跑实现 worker，改由 Manager 手动执行合并链。

## Risks

- A/B/C 都碰 UI 文件，合并顺序必须保持 A -> B -> C。
- 本轮发现 AGENTS 默认根目录会诱导 worker 写回主仓库，后续 prompt 需要明确 stay in current worktree。
- QA 必须等 staging 集成并 push 后才跑。

## Next Step

推送 pipeline 修复；随后 Manager 手动合并 A-D，再启动 QA。
