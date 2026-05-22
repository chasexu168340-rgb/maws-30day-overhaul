# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

修复 Wave 8 合并后“UI 看起来没变化”的问题：让 Director Rebuild 在地图首屏有明显视觉差异，而不是继续像旧三栏信息墙。

## Scope

- 只改 DOM UI：`maws_src/dom/ui.js`、`maws_src/dom/ui.css`。
- 同步更新本 checkpoint。
- 不改数据、事件、战斗、经济、资产、存档 key/version。

## Plan

- [x] 验证 staging 已在 Wave 8 merge 头。
- [x] 用真实浏览器确认 Wave 8 类名已加载，但视觉仍像旧布局。
- [x] 将地图页调整为场景全屏 + 今日主线浮层 + 推荐/当前行动浮层。
- [x] 将行动和推荐的长说明放入折叠详情。
- [x] 运行验证并截图确认。

## Validation

- [x] `npm run check:full`：通过；build、资产验证、4 个 Chromium smoke 通过。
- [x] `npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line`：通过，3/3。
- [x] `git diff --check`：通过。
- [x] Playwright 截图：`test-results/wave8b-ui-desktop.png`、`test-results/wave8b-ui-mobile.png`。

## Result

- 地图页默认视觉改为场景优先，今日主线和推荐行动成为左右浮层。
- 推荐行动和当前地点行动的长说明、触发原因、成本收益进入折叠详情。
- 桌面 1365x768 下浮层不再占用三栏布局；手机 390x844 下回到纵向流且无横向溢出。

## Risks

- 本轮是视觉层强制降噪，不改变 Director 数据模型。
- 仍需人工 playtest 判断左右浮层的信息量是否还要继续压缩。

## Next Step

提交并推送到 `staging/reforge-unlocks-v1`；下一轮做人工 Day 1-Day 7 体验判断。
