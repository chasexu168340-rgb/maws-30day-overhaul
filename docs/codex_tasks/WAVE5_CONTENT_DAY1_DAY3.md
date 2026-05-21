# WAVE5_CONTENT_DAY1_DAY3

你是 AGENT_D_NARRATIVE_CONTENT + 轻量 Content Implementer。

本轮只接 Day 1-Day 3 的早期主线事件，不做 Day 5/8/9，不做完整 30 天。

## 必读

1. AGENTS.md
2. docs/TASK_HANDOFF.md
3. docs/VALIDATION.md
4. docs/content_proposals/day1_day9_vertical_slice.md
5. maws_src/content/data.js

## 目标

把 Day 1-Day 3 做成玩家早期能感知的三段：

- Day 1：出租屋上香，建立父亲、茂家拳、陆小闲的误读
- Day 2：地铁站见义勇为，强调不是擂台，优先控制和收场
- Day 3：便利店货架事件，制造误判胜利和小满关系

## 允许修改

- maws_src/content/data.js
- docs/workers/content_day1_day3.md
- docs/agent_reports/AGENT_D_NARRATIVE_CONTENT.md

## 禁止修改

- maws_src/simulation/state.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- maws_src/assets/manifest.js
- assets/
- docs/TASK_HANDOFF.md
- docs/SPRINT_BOARD.md
- docs/TASK_PLAN.md

## 具体要求

1. 只使用现有 MAIN_EVENTS / dialogue / choice / maw / gain / flags 字段。
2. 不新增新事件引擎。
3. 不新增战斗。
4. 不把 Day 2/Day 3 写成硬战斗。
5. 文案要好笑但不油。父亲相关轻一点，不要玩过头。
6. 每天主线要给明确系统收益，但不能大幅送属性。
7. Day 1 不给新技能。
8. Day 2 可给 jud/calm/auth 或 maw.misread 的轻量变化。
9. Day 3 可给 xiaoman 关系、heat 或 maw.misread 的轻量变化。

## 参考调性

Day 1：
香灰很轻，但陆小闲觉得自己背了很重的东西。

Day 2：
地铁不是擂台，赢不是把人打倒，是别让事情升级。

Day 3：
货架没倒，面子倒得很整齐。

## 验证

运行：

```powershell
npm run build
npm run test:smoke
git diff --check
```

## 输出

写：

docs/workers/content_day1_day3.md

格式：

Worker:
Branch:
Task:
Changed files:
Validation:
Risks:
Ready for merge:
Next:
