# WAVE6_CONTENT_DAY4_7

你是 AGENT_D_NARRATIVE_CONTENT。

本轮只接 Day 4、Day 6、Day 7 主线事件。

## 必读

- AGENTS.md
- docs/TASK_HANDOFF.md
- docs/VALIDATION.md
- docs/content_proposals/day1_day9_vertical_slice.md
- maws_src/content/data.js

## 允许修改

- maws_src/content/data.js
- docs/workers/content_day4_7.md
- docs/agent_reports/AGENT_D_NARRATIVE_CONTENT.md

## 禁止修改

- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/
- INITIAL_SKILLS

## 任务

1. Day 4：工棚里的第一拳。
2. Day 6：旧城区夜行。
3. Day 7：镜子里的人。
4. 只用现有 MAIN_EVENTS 字段。
5. 不新增事件引擎。
6. 不接 Day 8/9。
7. 奖励轻量，偏 misread / fatherMemory / calm / jud，不大幅送属性。

## 验证

```powershell
npm run build
npm run test:smoke
git diff --check
```

## 输出

- docs/workers/content_day4_7.md
- docs/agent_reports/AGENT_D_NARRATIVE_CONTENT.md
