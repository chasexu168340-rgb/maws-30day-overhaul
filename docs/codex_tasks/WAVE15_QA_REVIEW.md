# WAVE15_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

本轮只做 QA，不改业务代码。

## 允许修改
- docs/workers/qa_wave15.md
- docs/agent_reports/QA_WAVE15_REVIEW.md

## 禁止修改
- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务
审阅：
- `chore/wave15-current-context`
- `feat/skill-tree-spend-v1`
- `feat/combat-recipe-v1`
- `test/wave15-addiction-loop-smoke`

检查：
1. 技能树是否能购买小切片节点。
2. 节点是否有点数成本/前置/已解锁状态。
3. 节点是否对战斗或训练产生真实小效果。
4. 没有开局送 `jab/advance`。
5. 战斗 recipe 是否有人话反馈。
6. E01 是否仍是验货基准，没有被削成菜鸡。
7. 是否没有改存档 key/version、资产结构、经济大曲线。
8. Wave15 smoke 是否通过。

## 验证
npm run check:full
npm run test:playtest
npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line
git diff --check

## 输出
docs/workers/qa_wave15.md
docs/agent_reports/QA_WAVE15_REVIEW.md

## 提交
完成后提交本分支，commit message:
`docs: add wave15 qa review`

不要 push；Manager pipeline 会统一 push/merge。
