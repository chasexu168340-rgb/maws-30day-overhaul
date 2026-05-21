# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

执行 `AGENT_E_UI_PRESENTATION`：技能页读取 `model.skillUnlocks[skillId]`，让未学会、planned、initial 技能显示清楚来源和状态。

## Scope

- 只改 `maws_src/dom/ui.js`、`maws_src/dom/ui.css`、`docs/TASK_PLAN.md`、`docs/agent_reports/AGENT_E_UI_PRESENTATION.md`。
- 删除或绕过 UI 层静态技能来源映射。
- 技能卡读取 `model.skillUnlocks[skillId]`。
- 未学会技能显示来源、开放条件和状态。
- planned 技能显示暂未接入真实训练来源。
- initial 技能显示开局已会。
- 不改 `data.js`、`state.js`、`combat.js`、`economy.js`、`manifest.js` 或资产。

## Plan

- [x] 从 `staging/reforge-unlocks-v1` 创建 `feat/ui-skill-unlocks-display`。
- [x] 定位技能页渲染和 `skillUnlocks` render model 字段。
- [x] 将技能页来源展示改为 `model.skillUnlocks[skillId]` 驱动。
- [x] 补技能来源信息块样式和手机端换行约束。
- [x] 更新 UI agent 报告。
- [x] 运行 `npm run check:full`。
- [x] 运行 `git diff --check`。

## Validation

- [x] `npm run check:full`：通过；build、资产验证、4 个 Chromium smoke 用例通过，覆盖 390x844 / 900x700 / 1365x768 的技能页横向溢出检查。
- [x] `git diff --check`：通过；仅有 Git CRLF 工作区提示。

## Result

- 技能页已改为读取 `model.skillUnlocks[skillId]`。
- 未学会技能显示来源、开放条件和 locked/available 状态。
- planned 技能显示暂未接入真实训练来源，并提示后续由系统/战斗组补真实来源。
- initial 技能显示开局已会。

## Risks

- planned 技能仍依赖当前 `SKILL_UNLOCKS` 数据的 planned 标记；本轮只负责如实展示，不补真实训练来源。
- 本轮不做单独截图报告；已通过现有 Playwright responsive smoke。

## Next Step

验证通过后，可继续拆给 Asset Worker 接地铁站 runtime 背景映射，或等 UI/Day 1-3 接上后再做早期战斗手感。
