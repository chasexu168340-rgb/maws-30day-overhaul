# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

整理本地 agent 工作区，并把可供 ChatGPT/GitHub 审核的开发记录同步到远端。

## Scope

- 保留根目录 `maws-agent-*` 作为本地完整 worktree，不直接提交进 Git。
- 新增 `docs/agent_workspaces/`，归档每个 agent 的分支、提交、报告和 checkpoint。
- 强制纳入两个任务打包 zip，方便远端审核执行器和开发书原始资料。
- 更新 `.gitignore`，避免后续误提交完整 worktree 副本、日志、生成图和测试输出。
- 不改运行代码、战斗公式、经济曲线、存档 key/version 或资产结构。

## Relevant Files

- `.gitignore`
- `docs/TASK_PLAN.md`
- `docs/agent_workspaces/`
- `MAWS_Codex_Autorun_Orchestrator_v0.4.zip`
- `MAWS_重铸优化_多Agent工作开发书_v0.3_打包.zip`

## Plan

- [x] 检查当前分支和未提交范围。
- [x] 修复移入项目根目录后的 agent worktree 指针。
- [x] 建立 `docs/agent_workspaces/` 审核归档。
- [x] 让根目录完整 `maws-agent-*` 只保留本地，不进入 Git。
- [x] 更新本任务 checkpoint。
- [ ] 提交并推送到 GitHub。

## Validation

- [x] `git worktree list`：agent worktree 已指向项目根目录下的新位置。
- [x] `git status --ignored`：根目录完整 `maws-agent-*` 已被忽略，`docs/agent_workspaces/` 可跟踪。
- [x] `git diff --check`
- [x] `npm run build`
- [ ] `git push`

## Result

上一轮游戏运行代码已经在 `staging/reforge-unlocks-v1` 合并并推送。本轮只整理审核资料：完整 agent 工作区留在本机，远端提交轻量、可读、可审核的 agent 记录归档和任务资料包。

## Risks

- 根目录完整 `maws-agent-*` 没有进入 GitHub；如需查看完整工作区，只能在本机看。
- 两个 zip 是被 `.gitignore` 默认忽略的资料包，本轮会显式 `git add -f`，后续不要把其他大包默认加入。
- 浏览器 smoke 仍需安装 Playwright 浏览器依赖后再跑。

## Next Step

本轮推送完成后，把 GitHub 分支 `staging/reforge-unlocks-v1` 发给 ChatGPT 审核。下一轮优先做真实浏览器 smoke，再处理 Agent 04/05/06 的 proposal 和 QA。
