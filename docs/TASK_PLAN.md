# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

解决 `feat/ui-skill-unlocks-display` 的 GitHub merge conflict：将 `origin/main` 合入当前 UI 分支，保留技能页读取 `model.skillUnlocks[skillId]` 的实现和当前任务 checkpoint。

## Scope

- 只解决合并冲突，不新增 UI 功能。
- 保留 `maws_src/dom/ui.js` 的 `model.skillUnlocks[skillId]` 驱动展示。
- 保留 `maws_src/dom/ui.css` 的技能来源信息块和响应式换行样式。
- 保留 `docs/agent_reports/AGENT_E_UI_PRESENTATION.md`。
- 冲突文件：`docs/TASK_PLAN.md`。
- 不改 `data.js`、`state.js`、`combat.js`、`economy.js`、`manifest.js` 或资产。

## Plan

- [x] 确认当前分支为 `feat/ui-skill-unlocks-display`。
- [x] 拉取远端；常规 fetch 两次网络 reset 后，改用 `git -c http.version=HTTP/1.1 fetch origin` 成功。
- [x] 确认本地 `origin/staging/reforge-unlocks-v1` 已是当前分支祖先，冲突目标来自更新后的 `origin/main`。
- [x] 合入 `origin/main`。
- [x] 解决 `docs/TASK_PLAN.md` 冲突，保留当前 UI 任务状态。
- [x] 运行 `npm run check:full`。
- [x] 运行 `git diff --check`。
- [x] 提交并 push 更新。

## Validation

- [x] `npm run check:full`：通过；build、资产验证、4 个 Chromium smoke 用例通过。
- [x] `git diff --check`：通过。

## Result

- 技能页实现保持不变：读取 `model.skillUnlocks[skillId]`，展示未学会、planned、initial 的来源和状态。
- 已合入 `origin/main` 并解决 `docs/TASK_PLAN.md` 冲突。
- 验证通过，已推送到 `origin/feat/ui-skill-unlocks-display`，等待审阅/合并。

## Risks

- `GameDesigner_CombatAnalysis/` 是本轮外既有未跟踪目录，继续不纳入提交。
- planned 技能仍依赖当前 `SKILL_UNLOCKS` 数据的 planned 标记；本轮只负责如实展示，不补真实训练来源。

## Next Step

合并到 `staging/reforge-unlocks-v1` 后，下一轮开 `feat/metro-runtime-background`，只接地铁站 runtime 背景映射。
