# Time Activity Pass

## Task

Wave 11 `AGENT_B_GAMEPLAY_SYSTEMS`：把 Time Dosage 从倍率原型调成“玩家愿意在地点里多待一会”的节奏系统。

## Changes

- 调整 30m/60m/90m/120m 投入：短练更划算，标准稳定，深练有效但疲劳明显，硬练收益递减且小伤风险更高。
- 在出租屋补齐微行动：发呆放空、看训练笔记、刷短视频、给朋友发消息、简单拉伸。
- 下调微行动和 idle 随机反馈收益，保留少量情绪/冷静/关系反馈，避免成为最优资源刷法。
- 增加连续同类训练压力：连续做同类训练会降低正向收益，并额外增加疲劳；穿插微行动、恢复、战斗或其他行动会打断连续计数。
- 机会卡默认推荐上限从 3 收敛到 2；当天行动较多后只保留 1 张推荐，避免无限刷待办稀释主线锚点。
- 每日自由行动提示从 3 个扩到 4 个，但如果主线锚点未完成且当天已做 2 个行动，会优先提示处理主线。

## Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`
- `docs/workers/time_activity_pass.md`
- `docs/agent_reports/AGENT_B_TIME_ACTIVITY_PASS.md`

## Validation

- Passed: `npm run check:full`
- Passed: `npm run test:playtest`
- Passed: `git diff --check`

## Risks

- 连续训练递减按“训练类型”粗分，可能需要后续 playtest 再细分拳馆、体能、判断类训练的阈值。
- 微行动不改 UI，仅复用现有行动渲染；如果 UI 对行动数量有隐藏布局限制，需要集成分支做浏览器 smoke。
