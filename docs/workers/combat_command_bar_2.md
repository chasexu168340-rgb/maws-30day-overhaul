# Combat Command Bar 2.0 Worker

## Scope

- Worker: `AGENT_C_COMBAT_FEEL + AGENT_E_UI_PRESENTATION`
- Branch: `feat/combat-command-bar-2`
- Files changed: `maws_src/dom/ui.js`, `maws_src/dom/ui.css`

## Implementation

- 主指令区从窗口动作卡改为小型 `指令栏`，上限 6 个技能指令。
- 当装备技能不足 4 个时，补足抱架、清队、攻身、读招小指令按钮，避免 Day 5 只看到 2 张大卡。
- 左下保留目标/部位按钮和 1-2 招队列槽；选中技能仍通过 `selectSkill` 进入队列区。
- 右下加入复盘日志与执行区，`confirmBattle` 保持为明确主按钮。
- 技能长描述和完整数值继续走 hover/focus 详情层，已选卡不再常驻展开详情。

## 1536x864 Day 5 View

- 截图文件：`test-results/wave12/desktop-combat.png`。
- 观感：战斗舞台和两名角色是第一视觉层，背景没有被底部 HUD 压扁。
- 底部指令栏显示 6 个小指令卡，选中/加入仍进入左下 1-2 招队列槽。
- 左下目标/部位和队列区可读；右下复盘日志和 `执行 1-2 招` 主按钮都在视口内。
- 日志使用暗色细滚动条，不再出现白色页面滚动条截断。

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Notes

- 未修改战斗公式、内容数据、资产 manifest、存档结构或入口 HTML。
