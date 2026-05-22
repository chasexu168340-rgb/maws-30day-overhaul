# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13：Reward Delta Contract v2（AGENT_B_GAMEPLAY_SYSTEMS）。

## Goal

让行动、事件、训练、出行、战斗结算继续兼容现有 UI，同时输出字段完整、可被后续 UI 直接读取的结构化 `rewardDeltas`。

## Current Result

- [x] 将 `rewardDeltas` 统一规范化为 `key/label/value/delta/kind/icon/tone/priority/source`。
- [x] 将收益类型收敛到契约集合：`gain`、`cost`、`relation`、`skill`、`risk`、`time`、`item`、`money`。
- [x] 技能解锁 delta 保持短标签：`学会 <技能名>`，不把来源/条件塞进 chip 字段。
- [x] 事件 notebook 增加结构化风险 delta；物品使用增加结构化 item delta。
- [x] 行动、训练、出行、战斗继续从结算差值生成结构化 cost/time/reward deltas。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。

## Risks

- 未修改 DOM UI，本轮只保证结构化字段可用；展示样式仍由后续 UI worker 接入。
- 未修改经济曲线、剧情内容、战斗公式、数据表和存档 key/version。

## Next Step

后续 UI worker 可直接读取 `modal.rewardDeltas` 和 `eventNotebook.rewardDeltas`，避免从长文案解析收益。
