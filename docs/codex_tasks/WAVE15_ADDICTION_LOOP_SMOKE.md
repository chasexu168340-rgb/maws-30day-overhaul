# WAVE15_ADDICTION_LOOP_SMOKE

你是 AGENT_F_TECH_QA_TOOLS，负责自动化体验 smoke。

本轮只加测试，不改业务代码。

## 允许修改
- maws_src/tests/wave15_addiction_loop.spec.js
- docs/workers/wave15_addiction_loop_smoke.md
- docs/agent_reports/AGENT_F_WAVE15_ADDICTION_LOOP_TESTS.md

## 禁止修改
- package.json
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/

## 任务
新增 Playwright spec，覆盖 Wave15 第一段：
1. 技能页存在可购买节点或明确的 Insight 点数/购买状态。
2. 节点购买后出现短 reward chips / clear feedback。
3. 已购买节点在刷新 render 后保持 unlocked。
4. 战斗 plan mode 可见，并至少包含 `safe / pressure / exit / probe` 中的三个。
5. 进入 Day 5 战斗后，战术配方/日志反馈出现人话句子，不只是“触发 combo”。
6. 移动端 390x844 不横向溢出。

## 验证
npm run build
npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line
git diff --check

## 输出
docs/workers/wave15_addiction_loop_smoke.md
docs/agent_reports/AGENT_F_WAVE15_ADDICTION_LOOP_TESTS.md

## 提交
完成后提交本分支，commit message:
`test: add wave15 addiction loop smoke`

不要 push；Manager pipeline 会统一 push/merge。
