# WAVE11_COMBAT_PLAN_MODE

你是 AGENT_C_COMBAT_FEEL。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：给战斗加入“自动策略 + 玩家组合”的下一步雏形，但不改战斗大公式。

## 允许修改

- maws_src/simulation/combat.js
- maws_src/simulation/state.js
- docs/workers/combat_plan_mode.md
- docs/agent_reports/AGENT_C_COMBAT_PLAN_MODE.md

## 禁止修改

- maws_src/content/data.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/
- package.json
- INITIAL_SKILLS
- 经济曲线

## 任务

1. 保持本窗口行动队列 1-2 张为默认节奏。
2. 加轻量 plan mode 数据：
   - manual
   - safe
   - pressure
   - exit
3. 如果玩家没有选队列，可以按 plan mode 给出默认建议队列：
   - safe: guard -> wild_swing 或 guard -> retreat
   - pressure: push_away -> wild_swing
   - exit: talkdown -> retreat
4. 不要全自动打完整场，只自动填“本窗口建议队列”。
5. combo bonus 保持小幅，不堆大数字。
6. 日志要清楚说明触发了哪个 plan/combo。
7. 为未来技能树预留 combo slot / plan slot 字段，但本轮不实现树。

## 验证

npm run check:full
node maws_src/tools/sim_day5_park_check.mjs
git diff --check

## 输出

- docs/workers/combat_plan_mode.md
- docs/agent_reports/AGENT_C_COMBAT_PLAN_MODE.md
