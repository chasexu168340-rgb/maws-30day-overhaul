# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13：Time Activity Feel Pass（AGENT_B_GAMEPLAY_SYSTEMS）。

## Goal

让 30/60/90/120 分钟投入成为“安排一段时间”的玩法，不继续膨胀倍率；微行动保持恢复、消息、自省或轻量线索定位，不成为刷资源最优路线。

## Current Result

- [x] 调整 `TIME_DOSAGE_OPTIONS`：短练低消耗、标准稳、深练有机会成本、硬练高疲劳/高小伤风险。
- [x] `state.js` 记录 `daily.timeCommitted` 和 `daily.schedulePressure`，深练/硬练结算会提示错过机会。
- [x] 微行动加入当日限刷：重复或过量后只保留恢复/自省价值。
- [x] `events.js` 读取日程压力，压低硬战机会并把机会卡收窄到 1 张。
- [x] 输出 worker 报告和 agent report。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。

## Risks

- 未修改 UI、combat、assets、package、存档 key/version。
- 未大改经济曲线；深练/硬练仍需后续 playtest 观察实际选择率。

## Next Step

后续建议人工 playtest Day 9 后拳馆训练：连续深练/硬练后机会卡是否自然转向恢复、对话或补给。
