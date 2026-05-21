# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Agent 02：地点锁和技能来源 UI 表现。

## Scope

- 地图和城市总览显示地点锁定状态、原因和开放提示。
- 锁定地点按钮只 toast，不打开 travel modal。
- 技能页对未学会技能显示来源地点和推荐行动。
- 不改数据、状态、战斗、经济、存档或资产。

## Relevant Files

- `docs/TASK_PLAN.md`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/agent_reports/AGENT_02_UI_LOCKS.md`
- `.codex/DONE.md`

## Plan

- [x] 更新城市 marker 的锁定状态和 toast。
- [x] 新增地图地点开放列表。
- [x] 更新技能页未学会技能来源展示。
- [x] 补充锁定/休息中/未学会样式。
- [x] 运行 build 和 diff check。
- [x] 尝试浏览器 smoke，并记录阻塞原因。

## Validation

- [x] `npm run build`：通过，检查 20 个 JavaScript / MJS 文件，并验证 93 个 manifest entries。
- [x] `git diff --check`：通过。
- [ ] 390x844 浏览器 smoke：未完成。当前缺少 `@playwright/test` 和 Playwright Chromium headless shell。

## Result

地点锁 UI 已接入：地图地点列表和城市 marker 都能显示暂未开放原因；技能页能显示未学会技能的来源提示。

## Risks

- 浏览器 smoke 需要先安装 Playwright 浏览器依赖。
- 技能来源目前是 UI 静态映射，后续应改为数据驱动。

## Next Step

下一步由 Integrator 合并 `feat/reforge-ui-locks` 并补真实浏览器 smoke。
