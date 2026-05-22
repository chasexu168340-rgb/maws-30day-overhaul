# AGENT_E_REWARD_UI_JUICE

## Summary

完成收益反馈 UI 增强，限定在允许文件内实现。

## Implementation

- `maws_src/dom/ui.js`
  - 新增 reward chip 解析与渲染函数。
  - 从现有 `modal.lines`、`settlementLines`、`summaryChips`、`gain` 中提取收益展示，不改状态层。
  - `settlement` modal 默认显示结果一句话、3-5 个收益 chips、继续按钮。
  - 详细结算、成本、日志保留在折叠区。
  - 战斗结果和普通结果也会展示可解析收益 chips。
  - modal 外层增加轻量 reward stack。
- `maws_src/dom/ui.css`
  - 增加 reward chips、skill learned、relationship gain、risk/resource chip 样式。
  - 增加 reward stack 入场动画和 reduced-motion 降级。
  - 增加 `result-compact` 小结果框响应式样式。

## Validation

- `npm run check:full`
  - build 通过。
  - assets verify 通过。
  - Chromium smoke 4/4 通过。
- `git diff --check`
  - 通过。

## Notes

- 没有修改状态、数据、战斗、事件、资产或 package scripts。
- `docs/TASK_PLAN.md` 未更新，因为本 worker prompt 明确限制允许修改文件，且本轮输出要求为 worker/report 文档。
