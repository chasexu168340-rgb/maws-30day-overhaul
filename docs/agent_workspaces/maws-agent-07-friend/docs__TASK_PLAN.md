# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Wave 2 启动准备：合并 Agent 01，并将 Agent 03 改为地铁站实现型任务。

## Scope

- 合并 `feat/reforge-core-unlocks` 到 staging。
- 验证合并后的 build 与 diff check。
- 推送 `staging/reforge-unlocks-v1`。
- 将 Wave 2 worktree 重置到最新 staging。
- 修改 Agent 03 prompt：从 proposal-only 改为只改 `data.js` 的地铁站实现任务。
- 暂不启动 Wave 2 之前的全自动合并。

## Relevant Files

- `docs/TASK_PLAN.md`
- `docs/codex_tasks/AGENT_03_METRO_CONTENT.md`
- `docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`
- `maws_src/content/data.js`
- `maws_src/simulation/state.js`

## Plan

- [x] 合并 `feat/reforge-core-unlocks`。
- [x] 合并后运行 `npm run build`。
- [x] 合并后运行 `git diff --check HEAD~1..HEAD`。
- [x] 推送 `origin/staging/reforge-unlocks-v1`。
- [x] 重置 Wave 2 worktree 到最新 staging，并逐个 build。
- [x] 修改 Agent 03 prompt 为地铁站实现型任务。

## Validation

- [x] `npm run build`：通过，检查 20 个 JavaScript / MJS 文件，并验证 93 个 manifest entries。
- [x] `git diff --check HEAD~1..HEAD`：通过。
- [x] Wave 2 六个 worktree 重置后各自 `npm run build`：全部通过。

## Result

Agent 01 已合并进 staging 并推送。Wave 2 worktree 已同步到合并后的地基。Agent 03 prompt 已改为实现 `metro_station` 地点，允许只修改 `maws_src/content/data.js`、`docs/TASK_PLAN.md` 和 Agent 03 报告。

## Risks

- `metro_station` 还没进运行数据，需由 Agent 03 落地。
- Agent 02 / 03 启动后要重点检查是否都基于最新 staging。
- Agent 04 / 05 仍建议 proposal-only，避免再次抢 `data.js` / `state.js`。

## Next Step

下一步启动 Wave 2：`powershell -ExecutionPolicy Bypass -File .\scripts\30_launch_wave2_parallel.ps1`。Wave 2 完成后先运行 `scripts\40_collect_reports.ps1` 收报告，不要立即全合并。
