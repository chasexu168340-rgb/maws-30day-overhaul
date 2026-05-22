# WAVE12_VISUAL_SMOKE_TESTS

你是 AGENT_F_TECH_QA_TOOLS。本轮只加视觉几何 smoke，不改业务代码。

允许修改：maws_src/tests/wave12_visual.spec.js、docs/workers/wave12_visual_smoke.md、docs/agent_reports/AGENT_F_WAVE12_VISUAL_TESTS.md。

禁止修改：package.json、data.js、state.js、combat.js、ui.js、ui.css、assets。

任务：新增 Playwright spec，可用 npx 直接跑。桌面 1536x864 检查地图页无横向溢出、scene character 不过小、本地点行动不被 nav 遮挡、modal 不超过视口并可滚动。战斗页检查 combat card grid 高度低于视口 28%、队列槽存在、日志不被 body 级白滚动条截断。手机 390x844 检查不横向溢出且主 CTA 可见。截图输出到 test-results/wave12/。

验证：npm run build；npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line；git diff --check。
