# Event Feedback Loop Worker Handoff

## Task

为普通行动和事件处理结果增加轻量即时反馈，让点击后的结果不再像后台 action 消失。

## Implemented

- `maws_src/simulation/state.js`
  - 新增 result feedback modal 生成 helpers。
  - 普通非专用行动完成后生成 `结果` modal。
  - 复用 action summary、settlement lines、最新 log 作为代价/获得/明细。
  - `eventNotebook` 的 action resolve 走同一反馈；shop resolve 打开商店并显示反馈。
- `maws_src/dom/ui.js`
  - 对 `settlement` modal 增加结果式渲染：标题、摘要、代价/获得、后续按钮、折叠明细/日志。
- `maws_src/dom/ui.css`
  - 增加结果反馈样式和窄屏单列布局。

## Not Changed

- 未改 `data.js`、`events.js`、`combat.js`、资产、package 配置。
- 未新增剧情引擎或重写事件系统。
- battle/dialogue/training 专用 modal 保持原流程，避免重复弹窗。

## Validation

- `npm run check:full`：通过，build/asset check/Chromium smoke 4 项通过。
- `git diff --check`：通过。

## Risk

推荐地点按钮只在现有状态提供可用 location id 且地点已解锁时出现；本轮没有扩展事件数据结构。
