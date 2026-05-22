# AGENT_B_EVENT_FEEDBACK_LOOP

## Summary

已把普通行动和事件 resolve 的已有结算信息包装成轻量 RPG 结果反馈。

## Files Changed

- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/TASK_PLAN.md`
- `docs/workers/event_feedback_loop.md`
- `docs/agent_reports/AGENT_B_EVENT_FEEDBACK_LOOP.md`

## Behavior

- 普通行动完成后显示 `结果` modal。
- modal 显示一句话摘要、代价、获得、风险、折叠结算明细和最新日志。
- 后续按钮包括 `继续行动`、`查看日志`；有可用推荐地点时追加出行入口。
- `eventNotebook` 的普通 action resolve 使用同一反馈；shop resolve 打开商店并给反馈。
- 已有 battle/dialogue/training 专用 modal 不重复弹出 result feedback。

## Validation

- `npm run check:full`：通过，build/asset check/Chromium smoke 4 项通过。
- `git diff --check`：通过。

## Notes

未修改事件数据、战斗公式、经济曲线、资产或存档结构。
