# WAVE5_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

本轮只做 QA 审阅，不改业务代码。

## 必读

1. AGENTS.md
2. docs/TASK_HANDOFF.md
3. docs/VALIDATION.md
4. docs/workers/asset_metro_runtime.md 如果存在
5. docs/workers/content_day1_day3.md 如果存在

## 目标

审阅 Wave 5 的两个实现分支：

- feat/metro-runtime-background
- feat/day1-day3-events

## 允许修改

- docs/workers/qa_wave5.md
- docs/agent_reports/QA_WAVE5_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/SPRINT_BOARD.md
- docs/TASK_PLAN.md

## 检查内容

1. 两个分支是否越界改文件。
2. metro_station 背景是否接到 runtime。
3. Day 1-Day 3 是否只改 data.js。
4. 是否没有引入 Day 8/9。
5. 是否没有改 INITIAL_SKILLS。
6. 是否没有改战斗公式。
7. build 是否过。
8. smoke 是否过。
9. diff check 是否过。

## 验证

在可行范围内运行：

```powershell
npm run check:full
git diff --check
```

## 输出

写：

docs/workers/qa_wave5.md
docs/agent_reports/QA_WAVE5_REVIEW.md

最后给出：

Ready to merge:
- yes/no for feat/metro-runtime-background
- yes/no for feat/day1-day3-events

Recommended merge order:
