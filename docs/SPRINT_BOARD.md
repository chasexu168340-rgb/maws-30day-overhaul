# SPRINT_BOARD

> 当前重铸接续看板。只保留下一批任务，不记录旧 Batch 历史。

## In Progress

- 待启动：`AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS`

## Next

1. `AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS`
   - 新增 `SKILL_UNLOCKS` 数据。
   - `state.js` 输出 `model.skillUnlocks`。
   - 行动结算识别本次新学会技能，并追加结算提示。
2. `AGENT_E_UI_PRESENTATION`
   - 技能页来源读取 `model.skillUnlocks`。
3. `AGENT_C_COMBAT_FEEL`
   - 四技能开局战斗手感。
4. `AGENT_D_NARRATIVE_CONTENT`
   - Day 1-Day 9 垂直切片文案。
5. `AGENT_G_ASSET_WORLD`
   - 地铁站视觉闭环。

## Done

- `AGENT_A_HARNESS_DELTA`：清理接力系统、归档旧 CURRENT_*、补验证合同和 handoff。
- Playwright 真实浏览器 smoke 已接入。
- 地点锁已接入。
- 地铁站已接入。
- 初始技能已缩减。
- 大类 Agent 路由已接入。

## Blocked / Notes

- 不要在 Harness Delta 前启动 `SKILL_UNLOCKS`，避免旧 Batch 历史污染系统任务。
- 不要同时开 5 个 worker；先完成 Harness Delta 和 Skill Unlocks 数据化。
