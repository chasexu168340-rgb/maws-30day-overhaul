# WAVE10_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

重要：当前 shell 所在目录就是你的独立 QA worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 写 QA 报告并提交本分支。QA 由 Manager 在实现分支全部合并并推送后启动，不要审旧版本。

本轮只做 QA，不改业务代码。

## 允许修改

- docs/workers/qa_wave10.md
- docs/agent_reports/QA_WAVE10_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

审阅：
- feat/starter-wild-kit-v3
- feat/reward-ui-juice
- feat/combat-combo-autoplan-v1
- feat/time-dosage-prototype
- docs/skill-tree-alt-routes-masterplan

检查：
1. 是否改了正式 jab/advance 开局赠送。
2. 是否仍保持渐进解锁。
3. 是否让前期玩家有可用的野路子爽感。
4. 收益反馈是否更爽。
5. 时间投入是否有递减和疲劳成本。
6. 战斗 combo 是否只做轻量 bonus，没有改坏公式。
7. 是否没有破坏现有 smoke/playtest。
8. 是否适合进入下一轮 skill tree implementation。

## 验证

npm run check:full
npm run test:playtest
node maws_src/tools/sim_day5_park_check.mjs
git diff --check

## 输出

docs/workers/qa_wave10.md
docs/agent_reports/QA_WAVE10_REVIEW.md
