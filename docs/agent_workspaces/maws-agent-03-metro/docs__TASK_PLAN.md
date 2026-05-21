# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Agent 03：实现地铁站地点数据。

## Scope

- 只在 `data.js` 接入地铁站，不改 `state.js`。
- 新增 `LOCS.metro_station`、`LOC_POS.metro_station`、`ACTIONS.metro_station`。
- 至少 4 个地铁站行动。
- 将 Day 2 主线地点迁移到 `metro_station`。
- 不改 UI、combat、economy、存档 key/version 或资产。

## Relevant Files

- `docs/TASK_PLAN.md`
- `maws_src/content/data.js`
- `docs/agent_reports/AGENT_03_METRO_CONTENT.md`
- `.codex/DONE.md`

## Plan

- [x] 新增 `LOCS.metro_station`。
- [x] 新增 `LOC_POS.metro_station`。
- [x] 新增 `ACTIONS.metro_station` 四个行动。
- [x] 将 Day 2 主线 loc 改为 `metro_station`。
- [x] 运行 build、数据 smoke 和 diff check。

## Validation

- [x] `npm run build`：通过，检查 20 个 JavaScript / MJS 文件，并验证 93 个 manifest entries。
- [x] Node 数据 smoke：通过。`metro_station` 存在、Day 1 不锁定、4 个行动存在、Day 2 主线迁移成功。
- [x] `git diff --check`：通过。

## Result

地铁站已作为 Day 1 默认开放地点进入运行数据。Day 2 “地铁见义勇为”现在挂到 `metro_station`。地铁站包含观察人流、刷短视频、站台步法和听线索四个行动。

## Risks

- 地铁站暂未新增专属背景或资产，当前依赖现有 fallback 表现。
- 没有新增 `misread` gain 字段，避免改 economy。
- 地铁站视觉和锁点说明仍需 Agent 02 接 UI。

## Next Step

下一步由 Integrator 收集报告并合并 `feat/reforge-metro-content`。合并后运行 `npm run build`，并检查 Day 1 地图中 `metro_station` 未锁定。
