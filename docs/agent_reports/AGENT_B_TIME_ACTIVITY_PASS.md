# AGENT_B_TIME_ACTIVITY_PASS

## Summary

完成 Time Activity 节奏调整：投入选项从线性倍率改为带疲劳和风险的选择，微行动补齐为低收益低时间反馈，机会卡推荐收敛，并加入连续同类训练压力。

## Implementation Notes

- `TIME_DOSAGE_OPTIONS`：短练提高到 0.68 收益倍率并降低体力/疲劳/成本；深练降到 1.22 收益但提高疲劳；硬练降到 1.32 收益并提高体力、疲劳和小伤风险。
- 新增出租屋微行动：`read_notes`、`scroll_short_video`、`message_friend`、`simple_stretch`，并调低 `idle_blank`、公园短走、地铁放空的收益。
- `state.js` 新增 `trainingRepeatKind` 和 `applyTrainingRepeatPressure`，连续同类训练第二次正收益约 85%，第三次及以后约 70%，并额外增加疲劳。
- `events.js` 将机会卡推荐默认上限管到 2，当天行动达到 3 次后只推荐 1 张。
- `dailyDirectorModel` 每天可做事提示扩到 4 个，但主线未完成时会在自由行动过多后重新强调主线锚点。

## Validation

- Passed: `npm run check:full`
- Passed: `npm run test:playtest`
- Passed: `git diff --check`

## Follow-up

- 集成后建议重点 playtest：Day 1-3 出租屋微行动是否显得有反馈但不刷资源；Day 9 后拳馆连续深练/硬练是否会自然引导恢复或换地点。
