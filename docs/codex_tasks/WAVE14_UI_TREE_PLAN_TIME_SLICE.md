# WAVE14_UI_TREE_PLAN_TIME_SLICE

你是 AGENT_E_UI_PRESENTATION。

目标：把 Wave14 新系统变成玩家能看见、能点的切片。

## 允许修改
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/ui_tree_plan_time_slice.md
- docs/agent_reports/AGENT_E_UI_TREE_PLAN_TIME_SLICE.md

## 禁止修改
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- assets/
- package.json

## 任务
1. 技能页增加“技能树切片”区域：Street Wild / Boxing Basics / Traditional Reforge，compact node cards，locked/future 清楚标记。
2. 战斗 UI 增加 plan mode 控件：manual / safe / pressure / exit，点击走已有 setCombatPlan。
3. 时间投入弹窗舒适化：390x844 四选项不挤；每个选项默认只显示时间、体力、收益倍率、风险一句；长说明折叠。
4. NPC menu 如果有真实行动，主按钮更醒目；feedback-only 按钮更像建议，不像正式行动。
5. 不改数据逻辑。

## 验证
npm run check:full
npm run test:playtest
npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line
git diff --check

## 输出
docs/workers/ui_tree_plan_time_slice.md
docs/agent_reports/AGENT_E_UI_TREE_PLAN_TIME_SLICE.md

## 提交
完成后提交本分支，commit message:
`feat: add ui tree plan time slice`

不要 push；Manager pipeline 会统一 push/merge。
