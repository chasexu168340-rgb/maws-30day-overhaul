# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

接入 MAWS Codex 自动执行器 v0.4，并验证准备步骤。

## Scope

- 解压 `MAWS_Codex_Autorun_Orchestrator_v0.4.zip`。
- 将执行器 `scripts/` 复制到项目根目录。
- 将执行器 `prompts/*.md` 复制到 `docs/codex_tasks/`。
- 修复脚本默认中文路径在 Windows PowerShell 下乱码的问题。
- 运行 prepare baseline build。
- 不改游戏运行代码，不建 worktree，不启动 wave。

## Relevant Files

- `docs/TASK_PLAN.md`
- `scripts/*.ps1`
- `docs/codex_tasks/*.md`
- `MAWS_Codex_Autorun_Orchestrator_v0.4/`
- `MAWS_Codex_Autorun_Orchestrator_v0.4.zip`

## Plan

- [x] 读取执行器 README / COMMANDS / 关键脚本 / Agent 01 prompt。
- [x] 解压执行器 ZIP。
- [x] 复制 `scripts/` 到项目根目录。
- [x] 复制 `prompts/*.md` 到 `docs/codex_tasks/`。
- [x] 运行 `00_prepare_autorun.ps1` 并发现默认中文路径乱码。
- [x] 将脚本默认 `RepoRoot` / `PromptSource` 改为从 `$PSScriptRoot` 推导。
- [x] 将 `scripts/*.ps1` 的中文输出/错误提示改为 ASCII，避免 Windows PowerShell 按 ANSI 读取 UTF-8 脚本时解析失败。
- [x] 重新运行 `00_prepare_autorun.ps1` 验证通过。

## Validation

- [x] `powershell -ExecutionPolicy Bypass -File .\scripts\00_prepare_autorun.ps1`：通过。
- [x] prepare 内部 `npm run build`：通过，检查 20 个 JavaScript / MJS 文件，并验证 93 个 manifest entries。
- [x] `Get-Command codex`：可找到 `E:\codex\codex.ps1`。
- [x] `rg -n "[^\x00-\x7F]" scripts`：无命中，脚本内容已 ASCII-safe。

## Result

自动执行器已接入项目目录：`scripts/` 和 `docs/codex_tasks/` 已就位。直接运行 prepare 命令现在可用，不再依赖脚本文件中的硬编码中文路径；脚本输出也已改成 ASCII，避免 Windows PowerShell 解析 UTF-8 中文字符串失败。

## Risks

- 当前分支是 `codex/update-project-state`，工作区已有 `docs/TASK_PLAN.md` 修改和多个未跟踪目录。
- `10_create_worktrees.ps1` 会切到 `main`、pull、创建并 push `staging/reforge-unlocks-v1`；在当前脏工作区下不应直接运行。
- `20_launch_wave1_core.ps1` 会打开新的 PowerShell 窗口运行 Codex worker；应等 worktree 准备好后再启动。
- 执行器解压目录和两个开发书包目录是否纳入版本控制，需要提交前确认。

## Next Step

下一步先整理 Git 状态：提交或暂存当前 `docs/`、`scripts/`、`docs/codex_tasks/` 改动，并决定是否忽略/提交任务包目录。工作区干净后运行 `scripts\10_create_worktrees.ps1`，再启动 Wave 1。若中断，新窗口先读取 `AGENTS.md`、`docs/FILE_MAP.md`、`docs/TASK_PLAN.md`、`docs/agent_reports/00_current_audit.md`。
