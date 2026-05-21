# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Wave 2 局部整合：地点锁 UI + 地铁站数据。

## Scope

- 合并 Agent 02：地点锁展示、锁定地点 toast、技能来源提示。
- 合并 Agent 03：`metro_station` 地点、坐标、行动和 Day 2 主线地点迁移。
- 不合并 Agent 04 / 05 / 06，因为自动 worker 未产出可用报告或提交。
- 不改战斗公式、经济曲线、存档 key/version 或资产结构。

## Relevant Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/content/data.js`
- `docs/agent_reports/AGENT_02_UI_LOCKS.md`
- `docs/agent_reports/AGENT_03_METRO_CONTENT.md`
- `docs/TASK_PLAN.md`
- `.codex/DONE.md`

## Plan

- [x] 合并 `feat/reforge-ui-locks`。
- [x] 合并后运行 `npm run build`。
- [x] 合并 `feat/reforge-metro-content`。
- [x] 解决 `.codex/DONE.md` 与 `docs/TASK_PLAN.md` 的文档冲突。
- [x] 合并后运行 `npm run build`。

## Validation

- [x] Agent 02 分支内 `npm run build`：通过。
- [x] Agent 03 分支内 `npm run build`：通过。
- [x] Agent 03 分支内 Node 数据 smoke：通过。`metro_station` 存在、Day 1 不锁定、4 个行动存在、Day 2 主线迁移成功。
- [x] Staging 合并 Agent 02 后 `npm run build`：通过。
- [x] Staging 合并 Agent 03 后 `npm run build`：通过。
- [ ] 390x844 浏览器 smoke：未完成。当前缺少 `@playwright/test` 和 Playwright Chromium headless shell。

## Result

地点锁 UI 已接入：地图地点列表和城市 marker 能显示暂未开放原因，锁定地点点击只 toast。技能页能显示未学会技能来源提示。

地铁站已进入运行数据：Day 1 默认开放，包含观察人流、刷短视频、站台步法和听线索四个行动；Day 2 “地铁见义勇为”已迁移到 `metro_station`。

## Risks

- 浏览器 smoke 需要先安装 Playwright 浏览器依赖。
- 技能来源目前是 UI 静态映射，后续 Agent 04 若接入正式 `SKILL_UNLOCKS`，应改为数据驱动。
- 地铁站暂未新增专属背景或资产，当前依赖现有 fallback 表现。
- Agent 04 / 05 / 06 自动 worker 未产出，本轮没有合并它们。

## Next Step

下一步先做真实浏览器 smoke；如果通过，再考虑重新启动或手动执行 Agent 04 / 05 proposal 与 Agent 06 QA。
