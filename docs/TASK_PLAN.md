> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 9 Event Feedback Loop：事件/普通行动点击后给即时结果反馈和下一步选择。

## Scope

- 允许修改：`maws_src/simulation/state.js`、`maws_src/dom/ui.js`、`maws_src/dom/ui.css`、本轮 worker/report 文档。
- 禁止修改：数据、战斗公式、事件系统、资产、依赖配置和存档结构。

## Plan

- [x] 复用现有 `settlement` / `eventNotebook` / log 结构，不重写事件系统。
- [x] 给普通行动结算生成 RPG 风格结果反馈：一句话摘要、获得/代价、日志和后续按钮。
- [x] 给 `eventNotebook` 的 shop resolve 补结果反馈，action resolve 走同一结果反馈。
- [x] 保持 battle/dialogue/training 等已有专用 modal 不重复叠弹。
- [x] 运行 `npm run check:full`。
- [x] 运行 `git diff --check`。
- [x] 提交允许文件。

## Validation

- `npm run check:full`：通过，build/asset check/Chromium smoke 4 项通过。
- `git diff --check`：通过。

## Result

- 普通行动完成后显示 `结果` modal，并把已有 settlement lines、action summary 和最新 log 转成可读反馈。
- 反馈 modal 提供 `继续行动` 和 `查看日志`，有可用推荐地点时可追加出行入口。
- `eventNotebook` action resolve 不再像后台 action 一样只消失；shop resolve 会打开商店并显示结果反馈。

## Risks

- 未改数据和事件生成逻辑，推荐地点只在现有 modal 数据能提供 location id 且已解锁时出现。
- 真实浏览器 smoke 未在本任务要求内；本轮按指定命令验证。

## Next Step

等待 Manager push/merge；如需新窗口恢复，读取 `docs/TASK_HANDOFF.md`、`docs/TASK_PLAN.md`、`docs/workers/event_feedback_loop.md`。
