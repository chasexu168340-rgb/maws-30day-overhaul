# WAVE8_DIRECTOR_LOOP_TESTS

你是 AGENT_F_TECH_QA_TOOLS。

本轮只加测试，不改业务代码。

## 本轮测试依据

- 已由 Manager 读取本机顶级 skills：`ui-ux-design`、`game-design`。
- 执行时直接采用这些原则，不要另行加载插件或外部 skill，避免 CLI warn。
- 测试关注玩家默认看到什么、下一步是否明确、推荐是否受限、折叠详情是否存在、移动端是否不溢出。

## 允许修改

- maws_src/tests/director_loop.spec.js
- docs/workers/director_loop_tests.md
- docs/agent_reports/AGENT_F_DIRECTOR_LOOP_TESTS.md

## 禁止修改

- package.json
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/events.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/

## 任务

1. 参考现有 Playwright 测试。
2. 新增 director_loop.spec.js，可用 npx playwright test 直接运行。
3. 检查：
   - 主界面存在今日主线摘要。
   - 推荐行动不超过 3 个。
   - 技能页或弹窗存在 details/summary 或 maws-disclosure。
   - 390x844 无横向溢出。
4. 测试不要依赖长文案 exact match。

## 验证

npm run build
npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line
git diff --check

## 输出

docs/workers/director_loop_tests.md
docs/agent_reports/AGENT_F_DIRECTOR_LOOP_TESTS.md
