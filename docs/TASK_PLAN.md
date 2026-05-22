# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13 Combat Command Bar 2.0：把 Day 5 战斗 HUD 从大卡牌桌改成战斗指令栏。

## Current Result

- 已改 `maws_src/dom/ui.js`：主指令区最多展示 6 个小指令卡；少于 4 个技能时补足抱架、清队、攻身、读招小指令按钮。
- 已改 `maws_src/dom/ui.js`：右下加入复盘日志和执行区，保留 `confirmBattle` 按钮；左下保留目标/部位和 1-2 招队列槽。
- 已改 `maws_src/dom/ui.css`：压低底部 HUD 高度，技能详情只在 hover/focus 打开，不因已选技能常驻撑大主栏。
- 已写入 `docs/workers/combat_command_bar_2.md` 和 `docs/agent_reports/AGENT_C_COMBAT_COMMAND_BAR_2.md`。
- 1536x864 Day 5 战斗截图观感：舞台/角色占主视觉，底部 6 个小指令入口；左下目标/队列、右下复盘/执行均在视口内。

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risks

- 本轮不改战斗公式、数据、资产、存档结构和入口 HTML。
- 视觉目标以 `test-results/wave12/desktop-combat.png` 的 1536x864 Day 5 战斗截图为准；截图由最终 Wave 12 visual 测试生成。

## Next Step

提交并推送 `feat/combat-command-bar-2`。
