# WAVE14_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。本轮只做 QA，不改业务代码。

## 允许修改
- docs/workers/qa_wave14.md
- docs/agent_reports/QA_WAVE14_REVIEW.md

## 禁止修改
- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务
审阅：chore/wave14-current-context、feat/npc-real-actions-day1-7、feat/skill-tree-system-slice-v1、feat/ui-tree-plan-time-slice、test/wave14-loop-smoke。

检查：TASK_HANDOFF 是否已更新到 Wave14；NPC 菜单是否至少有部分真实行动；技能树是否是小切片；没有开局送 jab/advance；战斗 plan mode 控件可见；时间弹窗不挤、不溢出；check:full / test:playtest / wave14_loop 是否通过。

## 验证
npm run check:full
npm run test:playtest
npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line
git diff --check

## 输出
docs/workers/qa_wave14.md
docs/agent_reports/QA_WAVE14_REVIEW.md

## 提交
完成后提交本分支，commit message:
`docs: add wave14 qa review`

不要 push；Manager pipeline 会统一 push/merge。
