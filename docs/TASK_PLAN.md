# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

建立多 CLI 两阶段编排：实现 worker 全部完成并合入 staging 后，才启动 QA；QA 完成后再自动交回 Manager 合并报告。完成的 worker 窗口自动关闭。

## Scope

- 新增通用编排脚本：`scripts/Invoke-MawsMultiCliPipeline.ps1`。
- 新增 spec 模板：`scripts/wave_pipeline.example.json`。
- 新增 QA 延后规则：`docs/codex_tasks/QA_AFTER_MERGE_RULES.md`。
- 更新本 checkpoint。
- 不改游戏代码、数据、UI、战斗、经济、资产或存档。

## Plan

- [x] 保留实现 worker 并行。
- [x] QA 从实现同批窗口中移除，改为 Manager 合并/推送 staging 之后启动。
- [x] worker 启动不使用 `-NoExit` / `-Hold`，完成后自动关闭窗口。
- [x] Manager 等待 worker 退出、保留自动关闭窗口日志、推送 clean 分支、按顺序合并并验证。
- [x] QA 完成后 Manager 自动提交/推送 QA docs，合并 QA 分支并推送 staging。
- [x] 验证脚本语法与 diff。

## Validation

- [x] PowerShell scriptblock parse：通过。
- [x] `scripts/wave_pipeline.example.json` JSON parse：通过。
- [x] `git diff --check`：通过。

## Result

- 新增通用两阶段多 CLI pipeline。
- 实现 worker 先并行；Manager 等全部完成后合并、验证、推送 staging。
- QA worker 延后启动，只看最终集成 staging；QA 完成后 Manager 自动合并 QA 报告。
- worker 不再用 `-NoExit` / `-Hold`，完成后窗口自动关闭，日志写到 wave `_logs`。

## Risks

- 实现 worker 必须提交干净；脚本只会自动 push clean implementation 分支，不会替它们乱提交业务代码。
- worker 输出日志保存在当前 wave 的 `_logs` 目录，便于窗口自动关闭后排查。
- QA 如果留下非 docs 报告改动，脚本会拒绝自动提交。

## Next Step

验证通过后提交并推送；后续每个 Wave 用 `scripts/wave_pipeline.example.json` 复制出自己的 pipeline spec。
