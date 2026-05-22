# AGENT_B_TIME_ACTIVITY_FEEL_PASS

## Summary

完成 Time Activity Feel Pass。时间投入现在会影响当天机会余裕：短练用于碎片时间，标准练稳定，深练有更明确收益但挤占机会，硬练有高疲劳/小伤/机会成本，不再是常规最优解。

## Files Changed

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/events.js`
- `docs/workers/time_activity_feel_pass.md`
- `docs/agent_reports/AGENT_B_TIME_ACTIVITY_FEEL_PASS.md`
- `docs/TASK_PLAN.md`

## Notes

- 没有继续放大收益倍率；深练和硬练倍率下调，同时通过 `opportunityPressure` 表达机会成本。
- 微行动保留低压反馈，但加入当日限刷，避免看笔记/刷视频/打电话成为资源最优路线。
- 机会系统会读取 `daily.schedulePressure` 和 `daily.timeCommitted`，减少推荐数量并压低硬战排序。

## Validation

- Passed: `npm run check:full`
- Passed: `npm run test:playtest`
- Passed: `git diff --check`

## Follow-up

建议后续人工 playtest Day 9 后拳馆连续深练/硬练，以及 Day 1-3 出租屋微行动，确认玩家能感到“安排时间”而不是只看倍率。
