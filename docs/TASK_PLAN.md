# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 10：Core Loop + Combat Tree 多 CLI。目标是复制任务包、使用 staged pipeline 启动实现 worker，并确保 QA 只在实现分支合并推送后运行。

## Scope

- 添加 Wave 10 worker prompts 与启动脚本。
- 使用现有 `Invoke-MawsMultiCliPipeline.ps1`：实现 worker 先并行，Manager 合并验证后再启动 QA。
- 本轮 Manager 不直接改 `maws_src/` 玩法代码；实现由 worker 分支完成。

## Plan

- [x] 解压并检查 Wave 10 任务包。
- [x] 复制 `docs/codex_tasks/WAVE10_*.md`。
- [x] 替换原始 launcher，避免 QA 提前跑和每窗口 `npm ci`。
- [x] 添加 `scripts/wave10_coreloop_pipeline.json`。
- [ ] 提交并推送 Wave 10 prompts/scripts。
- [ ] 启动 `scripts/run_wave10_coreloop_workers.ps1`。
- [ ] 等实现 worker 完成后按 pipeline 合并、验证、推送，再启动 QA。

## Validation

- `git diff --check`。
- PowerShell 脚本解析检查。
- Pipeline 运行时由每个 merge step 执行对应验证。

## Result

进行中。

## Risks

- Wave 10 明确会有冲突，pipeline 会在冲突处停下，Manager 需要手动解决后继续。
- `feat/starter-wild-kit-v3` 和 `feat/time-dosage-prototype` 都可能碰 `data.js/state.js`。
- `feat/reward-ui-juice` 和 `feat/time-dosage-prototype` 都可能碰 UI。
- QA 必须等 staging 集成并 push 后运行，不能提前审旧版本。

## Next Step

提交并推送 Wave 10 任务包，然后启动多 CLI worker。
