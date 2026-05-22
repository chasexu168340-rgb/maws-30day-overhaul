# WAVE6_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

本轮只做 QA，不改业务代码。

## 允许修改

- docs/workers/qa_wave6.md
- docs/agent_reports/QA_WAVE6_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/SPRINT_BOARD.md
- docs/TASK_PLAN.md

## 任务

审阅：

- feat/early-combat-kindness
- feat/day4-7-events
- feat/early-opportunity-pressure
- content/day8-day9-polish

检查：

1. 是否越界改文件。
2. 是否改了 INITIAL_SKILLS。
3. 是否送了 jab/advance。
4. 是否改了战斗公式。
5. 是否把 Day 8/9 接进运行代码。
6. build/smoke/diff 是否通过。
7. 是否存在玩家早期坐牢风险。

## 验证

```powershell
npm run check:full
git diff --check
```

## 输出

- docs/workers/qa_wave6.md
- docs/agent_reports/QA_WAVE6_REVIEW.md
