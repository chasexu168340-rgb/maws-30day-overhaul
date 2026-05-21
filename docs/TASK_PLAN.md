# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

执行 `AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS`：在 Harness Delta 后补 `SKILL_UNLOCKS` 数据驱动和行动结算解锁提示。

## Scope

- 在 `data.js` 新增 `SKILL_UNLOCKS`。
- 在 `state.js` 输出 `model.skillUnlocks`。
- 行动结算后识别本次新学会技能，并追加 `学会：技能 / 来源：地点 · 行动`。
- 更新 `docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md` 和 `.codex/DONE.md`。
- 不改 UI、combat、经济曲线、存档 key/version 或资源目录。

## Relevant Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md`
- `.codex/DONE.md`

## Plan

- [x] 从 `feat/codex-harness-delta` 创建 `feat/skill-unlocks-data`。
- [x] 新增 `SKILL_UNLOCKS` 数据。
- [x] `state.js` import `SKILL_UNLOCKS` 并输出 `skillUnlocks` render model。
- [x] 普通行动和训练小游戏结算追加本次新学会技能提示。
- [x] 运行 build 和自定义解锁 smoke。
- [x] 运行 Playwright smoke 和 diff check。
- [x] 提交并 push `feat/skill-unlocks-data`。

## Validation

- [x] `npm run build`：通过。
- [x] 自定义 Node smoke：通过，沙包连击解锁刺拳/直拳并输出 `skillUnlocks`。
- [x] `npm run test:smoke`：通过，4 个 Chromium 用例。
- [x] `git diff --check`：通过；仅有 Git CRLF 工作区提示。

## Result

- 已实现数据驱动技能来源和结算提示，并完成 build、Node smoke、Playwright smoke、diff check。

## Risks

- `feat/skill-unlocks-data` 基于 `feat/codex-harness-delta` 创建；如果 harness 分支先合并到 staging，后续可直接重放/PR 本分支。
- 自定义 Node smoke 第一次命令因 PowerShell 反引号转义失败，已改用字符串拼接后通过。

## Next Step

`feat/skill-unlocks-data` 已准备推送给 GitHub 审阅。下一步交给 `AGENT_E_UI_PRESENTATION` 让技能页读取 `model.skillUnlocks`。
