# WAVE7_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。本轮只做 QA 汇总，不改业务代码。

## 允许修改

- docs/workers/qa_wave7.md
- docs/agent_reports/QA_WAVE7_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/SPRINT_BOARD.md
- docs/TASK_PLAN.md

## 任务

审阅：
- feat/day1-day7-playtest-harness
- feat/day5-combat-sim-tool
- docs/day1-day7-playtest-rubric

检查：
是否越界改运行代码；是否改 INITIAL_SKILLS；是否送 jab/advance；是否改战斗公式或经济曲线；新增测试是否稳定；check:full 是否通过；test:playtest 是否通过；node maws_src/tools/sim_day5_park_check.mjs 是否通过。

## 验证

npm run check:full
git diff --check

如果测试脚本已合入 staging，则额外运行：
npm run test:playtest
node maws_src/tools/sim_day5_park_check.mjs

## 输出

docs/workers/qa_wave7.md
docs/agent_reports/QA_WAVE7_REVIEW.md
