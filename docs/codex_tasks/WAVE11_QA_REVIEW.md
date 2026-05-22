# WAVE11_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

重要：当前 shell 所在目录就是你的独立 QA worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 写 QA 报告并提交本分支。QA 由 Manager 在实现/测试/文档分支全部合并并推送后启动，不要审旧版本。

本轮只做 QA，不改业务代码。

## 允许修改

- docs/workers/qa_wave11.md
- docs/agent_reports/QA_WAVE11_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

审阅：
- feat/ui-readable-reward-pass
- feat/combat-plan-mode-v1
- feat/time-activity-pass-v1
- docs/skill-tree-vertical-slice-v1
- test/wave11-flow-smoke

重点：
1. 战斗主视图是否只突出 1-2 张行动卡/队列槽。
2. 是否没有送正式 jab/advance。
3. 收益反馈是否更爽、更直接。
4. 小弹窗是否更紧凑。
5. 信息是否没有被折叠到看不见。
6. Time Dosage 是否没有变成无脑刷。
7. check:full/test:playtest/Day5 sim 是否过。
8. wave11_flow.spec 是否过。

## 验证

npm run check:full
npm run test:playtest
node maws_src/tools/sim_day5_park_check.mjs
git diff --check

如果测试分支已合入，额外运行：
npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line

## 输出

- docs/workers/qa_wave11.md
- docs/agent_reports/QA_WAVE11_REVIEW.md
