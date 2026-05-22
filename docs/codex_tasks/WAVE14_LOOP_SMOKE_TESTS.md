# WAVE14_LOOP_SMOKE_TESTS

你是 AGENT_F_TECH_QA_TOOLS。本轮只加 smoke，不改业务代码。

## 允许修改
- maws_src/tests/wave14_loop.spec.js
- docs/workers/wave14_loop_smoke.md
- docs/agent_reports/AGENT_F_WAVE14_LOOP_TESTS.md

## 禁止修改
- package.json
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/

## 任务
新增 Playwright spec，直接用 npx 运行，覆盖：
1. 点击刘胖子菜单后有真实行动按钮。
2. 执行一个 NPC 小行动后出现短 reward chips，不是长句。
3. 技能页显示技能树切片。
4. 战斗页 plan mode 控件可见并可点击。
5. 时间投入弹窗移动端不横向溢出。

## 验证
npm run build
npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line
git diff --check

## 输出
docs/workers/wave14_loop_smoke.md
docs/agent_reports/AGENT_F_WAVE14_LOOP_TESTS.md

## 提交
完成后提交本分支，commit message:
`test: add wave14 loop smoke`

不要 push；Manager pipeline 会统一 push/merge。
