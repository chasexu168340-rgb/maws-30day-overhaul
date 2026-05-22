# WAVE7_PLAYTEST_HARNESS

你是 AGENT_F_TECH_QA_TOOLS。任务是把 Day 1-Day 7 早期体验做成自动化 playtest smoke。

## 允许修改

- package.json
- maws_src/tests/day1_day7_playtest.spec.js
- docs/workers/day1_day7_playtest_harness.md
- docs/agent_reports/AGENT_F_DAY1_DAY7_PLAYTEST.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/assets/manifest.js
- assets/
- INITIAL_SKILLS
- 战斗公式
- 经济曲线

## 任务

1. 复用 maws_src/tests/phaser-smoke.spec.js 的启动服务器、console error 捕获和 overflow 检查方式。
2. 新增 npm run test:playtest，执行 maws_src/tests/day1_day7_playtest.spec.js。
3. 覆盖：新开局 Day1、地铁站进入、技能页来源信息、Day5/E01 相关入口、390x844 技能页和地图不横向溢出。
4. 测试要抗文案微调，不要用过长 exact match。

## 验证

npm run build
npm run test:smoke
npm run test:playtest
git diff --check

## 输出

docs/workers/day1_day7_playtest_harness.md
docs/agent_reports/AGENT_F_DAY1_DAY7_PLAYTEST.md
