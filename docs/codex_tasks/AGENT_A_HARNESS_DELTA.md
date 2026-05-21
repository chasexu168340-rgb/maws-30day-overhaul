# AGENT_A_HARNESS_DELTA

## Role

你是 Producer/Integrator。任务是修 Codex 长跑接力系统，避免旧 Batch 历史污染后续系统任务。

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`（如果尚不存在，按本 prompt 创建）
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

## Scope

必须做：

- 新建 `docs/TASK_HANDOFF.md`
- 新建 `docs/EXECUTION_CONTRACT.md`
- 新建 `docs/VALIDATION.md`
- 新建 `docs/SPRINT_BOARD.md`
- 将旧 `CURRENT_TASK` / `CURRENT_STATUS` / `CURRENT_TEST_REPORT` / `CHANGELOG` 归档到 `docs/archive/legacy_batches/`
- 原路径保留短 stub，说明这些是历史，不是当前任务
- 更新 `docs/FILE_MAP.md`，让 QA 和 worker 默认读 `TASK_HANDOFF` / `TASK_PLAN` / `VALIDATION`
- 对 `AGENTS.md` 做最小补丁：`TASK_HANDOFF` 是新窗口恢复首选，`CURRENT_*` 不作为当前任务
- `package.json` 只补 `check` / `check:full` alias，不新增依赖

## Forbidden

不要修改：

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/assets/manifest.js`
- `assets/`

## Validation

运行：

```powershell
npm run build
npm run test:smoke
git diff --check
```

## Report

更新 `docs/TASK_PLAN.md`，写明：

- 实际改动
- 验证结果
- 风险
- 下一步读取 `docs/codex_tasks/AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS.md`
