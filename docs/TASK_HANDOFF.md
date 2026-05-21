# TASK_HANDOFF

> 新窗口恢复首选 checkpoint。只记录当前任务、允许范围、验证门槛和下一步。

## Current Order

1. `AGENT_A_HARNESS_DELTA`：先修 Codex 长跑接力系统，清理旧 Batch 上下文污染。
2. `AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS`：再做 `SKILL_UNLOCKS` 数据驱动。
3. 后续再并行拆给 UI、Combat、Narrative、Asset。

## Current Branch Plan

- 当前基线：`staging/reforge-unlocks-v1`
- 当前分支：`feat/codex-harness-delta`
- 下一分支：`feat/skill-unlocks-data`

## Current State

- 真实浏览器 QA 门槛已接入：`npm run build`、`npm run test:smoke`。
- 地点锁、地铁站、初始技能缩减、大类 Agent 路由已接入。
- 旧 `docs/CURRENT_*` 和旧 `docs/CHANGELOG.md` 已归档为历史资料，不再作为当前任务入口。

## Read First

新窗口继续当前路线时按顺序读取：

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/EXECUTION_CONTRACT.md`
4. `docs/SPRINT_BOARD.md`
5. `docs/FILE_MAP.md`
6. `docs/VALIDATION.md`
7. `docs/TASK_PLAN.md`

## Do Not Resume

不要从旧 Batch、旧 `CURRENT_TASK.md`、旧 `CURRENT_STATUS.md`、旧 `CURRENT_TEST_REPORT.md` 或旧 `CHANGELOG.md` 恢复任务。这些文件只保留 stub，真实历史在 `docs/archive/legacy_batches/`。

## Next After Harness

执行 `docs/codex_tasks/AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS.md`：

- 只改 `maws_src/content/data.js`、`maws_src/simulation/state.js` 和指定 checkpoint/report 文件。
- 不改 UI、战斗公式、经济曲线、存档 key/version、资源目录。
- 目标是让已存在的行动收益通过 `SKILL_UNLOCKS` 提供来源、条件、解锁文案、render model 和结算提示。
