# AGENT_C_COMBAT_COMMAND_BAR_2

## Summary

Combat Command Bar 2.0 implemented in the DOM combat HUD.

## Changes

- `maws_src/dom/ui.js`
  - 主指令显示提升到 4-6 个小指令入口。
  - 队列仍限制为 `queueLimit` 的 1-2 招。
  - 新增右下复盘日志/执行区，保留 `confirmBattle`。
- `maws_src/dom/ui.css`
  - 底部 HUD 高度压到约 19vh，战斗舞台保持主视觉。
  - 小指令卡固定高度，避免两张大卡占满底栏。
  - 日志滚动条改为暗色细滚动条，避免白色滚动条截断观感。
  - 技能详情只在 hover/focus 出现。

## 1536x864 Day 5 Combat Read

- Screenshot: `test-results/wave12/desktop-combat.png`.
- Read: stage is dominant, with characters/background clearly prioritized above the bottom HUD.
- Command bar shows 6 compact command cards instead of 2 large cards.
- Lower-left target/queue and lower-right review/confirm areas are visible and contained.
- `confirmBattle` remains a large primary button in the right-bottom execution block.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risk

- 未改战斗公式和状态推进；已用 Wave 12 visual 测试覆盖既有 CSS 层叠契约。
