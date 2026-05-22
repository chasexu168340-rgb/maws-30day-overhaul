# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 11：Flow + Combat + UI 收敛多 CLI。目标是复制任务包、使用 staged pipeline 启动实现/测试/文档 worker，并确保 QA 只在全部分支合并推送后运行。

## Scope

- 添加 Wave 11 worker prompts 与启动脚本。
- 使用现有 `Invoke-MawsMultiCliPipeline.ps1`：实现/测试/文档 worker 先并行，Manager 合并验证后再启动 QA。
- 本轮 Manager 不直接改 `maws_src/` 运行代码；实现由 worker 分支完成。

## Plan

- [x] 解压并检查 Wave 11 任务包。
- [x] 复制 `docs/codex_tasks/WAVE11_*.md`。
- [x] 替换原始 launcher，避免 QA 提前跑和每窗口 `npm ci`。
- [x] 添加 `scripts/wave11_flow_pipeline.json`。
- [ ] 提交并推送 Wave 11 prompts/scripts。
- [ ] 启动 `scripts/run_wave11_flow_workers.ps1`。
- [ ] 等实现 worker 完成后按 pipeline 合并、验证、推送，再启动 QA。

## Validation

- `git diff --check`。
- PowerShell 脚本解析检查。
- Pipeline 运行时由每个 merge step 执行对应验证。

## Result

进行中。

## Risks

- `feat/ui-readable-reward-pass` 会改 UI，可能与 flow smoke 断言互相校准。
- `feat/combat-plan-mode-v1` 与现有 combo/autoplan 逻辑相邻，必须保留 1-2 招窗口节奏。
- `feat/time-activity-pass-v1` 不能把 Time Dosage 变成刷资源最优解。
- QA 必须等 staging 集成并 push 后运行，不能提前审旧版本。

## Next Step

提交并推送 Wave 11 任务包，然后启动多 CLI worker。
