# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

先执行 `AGENT_A_HARNESS_DELTA`，清理旧 Batch 上下文污染源，再执行 `AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS`。

## Scope

- 新增 `TASK_HANDOFF` / `EXECUTION_CONTRACT` / `VALIDATION` / `SPRINT_BOARD`。
- 归档旧 `CURRENT_*` / `CHANGELOG`，原路径保留历史 stub。
- 更新 `AGENTS.md`、`FILE_MAP.md`、`NEXT_WAVE_PLAN.md`、`package.json`。
- 新增 Harness Delta 和 Skill Unlocks After Harness 任务 prompt。
- 不改运行代码、UI、战斗公式、经济曲线、存档 key/version 或资源目录。

## Relevant Files

- `AGENTS.md`
- `package.json`
- `docs/TASK_HANDOFF.md`
- `docs/EXECUTION_CONTRACT.md`
- `docs/VALIDATION.md`
- `docs/SPRINT_BOARD.md`
- `docs/FILE_MAP.md`
- `docs/TASK_PLAN.md`
- `docs/NEXT_WAVE_PLAN.md`
- `docs/codex_tasks/AGENT_A_HARNESS_DELTA.md`
- `docs/codex_tasks/AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS.md`

## Plan

- [x] 确认 staging 与 `origin/staging/reforge-unlocks-v1` 一致。
- [x] 创建 `feat/codex-harness-delta`。
- [x] 归档旧 `CURRENT_*` / `CHANGELOG`。
- [x] 新增 handoff / contract / validation / board。
- [x] 补 `check` / `check:full` alias。
- [x] 运行 build、smoke、diff check。
- [ ] 提交并 push Harness Delta。
- [ ] 创建 `feat/skill-unlocks-data` 并执行 `SKILL_UNLOCKS` 数据化。

## Validation

- [x] `npm run build`：通过。
- [x] `npm run test:smoke`：通过，4 个 Chromium 用例。
- [x] `git diff --check`：通过；仅有 Git CRLF 工作区提示。

## Result

- Harness Delta 已完成本地验证：新增当前 handoff、执行合同、验证入口、sprint board；旧 `CURRENT_*` / `CHANGELOG` 已归档并替换为历史 stub；`package.json` 已补 `check` / `check:full` alias。

## Risks

- `planning-with-files` 的 catchup 脚本因系统 Python 不可用失败；本轮已改用项目内 `docs/TASK_PLAN.md` 作为 checkpoint。
- `git pull --ff-only` 出现连接重置；此前 `git fetch origin` 成功，且本地 HEAD 与 `origin/staging/reforge-unlocks-v1` 计数为 `0 0`。

## Next Step

Harness Delta push 后，从 `staging/reforge-unlocks-v1` 或合并后的 harness 分支继续开 `feat/skill-unlocks-data`，执行 `docs/codex_tasks/AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS.md`。
