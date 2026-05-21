# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Agent 01：地点锁定与初始技能缩减基础设施。

## Scope

- 新增地点开放规则。
- 新开局只保留 4 个初始技能。
- 地图 render model 输出锁定原因和开放提示。
- 地图直接出行拦截未开放地点。
- 旧存档保留已有技能，不强删。
- 不新增完整地铁站内容，不做 UI 精修。

## Relevant Files

- `docs/TASK_PLAN.md`
- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`
- `.codex/DONE.md`

## Plan

- [x] 在 `data.js` 新增 `LOC_UNLOCKS` 和 `INITIAL_SKILLS`。
- [x] 在 `state.js` 新增地点锁 helper。
- [x] 修改 `createNewState()` 初始技能和装备槽。
- [x] 在 `buildRenderModel()` / `cityMapModel()` 输出锁定字段。
- [x] 在 `openTravel` / `travel` / `takeOpportunity` 中拦截未开放地点。
- [x] 给 `startMainEvent` 保留 `allowLocked` 主线临时通行。
- [x] 运行 build 和最小状态 smoke。

## Validation

- [x] `npm run build`：通过，检查 20 个 JavaScript / MJS 文件，并验证 93 个 manifest entries。
- [x] Node 状态 smoke：通过。新档 4 技能、Day 1 仅 `home/store` 未锁定、锁定地点出行被拦截、主线 travel 保留 override、旧存档技能保留。

## Result

地点锁基础已接入。新开局现在只解锁 `mystic / guard / retreat / talkdown`，并只装备这 4 个技能。Day 1 地图 render model 中只有 `home/store` 未锁定；后续地点按 day 逐步开放。旧存档已有技能不会被迁移逻辑删除。

## Risks

- `metro_station` 规则已预留，但地点数据尚未接入；当前 Day 1 实际只有 `home/store` 可见未锁定。
- UI 还没有专门展示锁定原因，Agent 02 需要基于 `locked / lockReason / unlockHint` 接入表现。
- Day 2 / Day 8 旧主线地点和本轮锁定节奏不完全一致，当前用主线 `allowLocked` 避免软锁。

## Next Step

下一步由 Integrator 检查并合并 `feat/reforge-core-unlocks`，然后启动 Wave 2。若中断，新窗口先读取 `AGENTS.md`、`docs/FILE_MAP.md`、`docs/TASK_PLAN.md`、`docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`。
