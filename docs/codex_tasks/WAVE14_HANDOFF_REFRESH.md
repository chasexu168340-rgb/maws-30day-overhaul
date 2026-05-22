# WAVE14_HANDOFF_REFRESH

你是 AGENT_A_PRODUCER_INTEGRATOR。本轮只刷新当前 checkpoint，不改游戏运行代码。

## 允许修改
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md
- docs/SPRINT_BOARD.md
- docs/workers/wave14_handoff_refresh.md
- docs/agent_reports/AGENT_A_WAVE14_HANDOFF_REFRESH.md

## 禁止修改
- maws_src/
- assets/
- package.json

## 任务
1. 把 TASK_HANDOFF 从 Wave 12 更新到 Wave 14。
2. 明确当前 staging 已有：Wave 13 first-look QA passed、NPC compact interaction menu、reward deltas compact、Day 5 combat HUD command/action count 4-6 queue 1-2、no skill tree runtime implementation yet。
3. 下一轮目标写成：Playable Loop Slice。
4. SPRINT_BOARD 更新 Ready Tasks：NPC-ACT-001、TREE-001、UI-PLAN-001、QA-014。
5. 强调 QA 必须最后跑。

## 验证
git diff --check

## 输出
docs/workers/wave14_handoff_refresh.md
docs/agent_reports/AGENT_A_WAVE14_HANDOFF_REFRESH.md

## 提交
完成后提交本分支，commit message:
`docs: refresh wave14 playable loop handoff`

不要 push；Manager pipeline 会统一 push/merge。
