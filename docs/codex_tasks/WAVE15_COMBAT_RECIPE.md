# WAVE15_COMBAT_RECIPE

你是 AGENT_C_COMBAT_FEEL，负责 Combat Recipe Slice。

目标：把 Wave14 的 plan mode 从“模式按钮”推进成“战术配方”，让玩家更快形成直觉。

## 必读
- AGENTS.md
- docs/TASK_HANDOFF.md
- docs/FILE_MAP.md
- docs/VALIDATION.md
- maws_src/simulation/combat.js
- maws_src/simulation/state.js 只读，除非确实已有 API 无法承载配方

## 允许修改
- maws_src/simulation/combat.js
- docs/workers/combat_recipe_v1.md
- docs/agent_reports/AGENT_C_COMBAT_RECIPE_V1.md

## 条件允许修改
- maws_src/simulation/state.js 只允许在现有 `setCombatPlan` / combat render model 无法读取配方时做极小桥接。

## 禁止修改
- maws_src/content/data.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/economy.js
- maws_src/simulation/events.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务
1. 定义轻量战术配方：
   - `safe`: `guard -> wild_swing`，适合不熟悉敌人。
   - `pressure`: `push_away -> wild_swing`，适合打没练过的人。
   - `exit`: `talkdown -> retreat`，适合街头风险。
   - `probe`: `retreat -> wild_swing` 或 `guard -> push_away`，适合观察敌人。
2. 没有手动队列时，plan mode 给本窗口建议队列。
3. 每个配方必须有“人话反馈”，例如：
   - “你用推搡抢到一拍。”
   - “对方脚下乱了。”
   - “你没有赢拳，但赢了出口。”
4. 让技能树 perk 可以被战斗读取。如果 skill-tree worker 已输出 perk 字段，就做小幅命中/风险/日志影响。
5. 不大改战斗公式，不做完整自动战斗，不让 plan mode 连续自动打完整场。
6. E01 仍然是验货基准，不削弱成菜鸡。

## 验证
npm run check:full
node maws_src/tools/sim_day5_park_check.mjs
git diff --check

## 输出
docs/workers/combat_recipe_v1.md
docs/agent_reports/AGENT_C_COMBAT_RECIPE_V1.md

## 提交
完成后提交本分支，commit message:
`feat: add combat recipe slice`

不要 push；Manager pipeline 会统一 push/merge。
