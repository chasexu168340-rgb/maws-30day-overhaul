# WAVE7_DAY5_COMBAT_SIM

你是 AGENT_C_COMBAT_FEEL 的数据辅助 worker。

本轮只新增 Day 5 / E01 objective-style 验货的模拟工具，不改游戏逻辑。

## 允许修改

- maws_src/tools/sim_day5_park_check.mjs
- docs/workers/day5_combat_sim.md
- docs/agent_reports/AGENT_C_DAY5_COMBAT_SIM.md

## 禁止修改

- package.json
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/assets/manifest.js
- assets/
- INITIAL_SKILLS
- 任何战斗数值或公式

## 任务

1. 新增 maws_src/tools/sim_day5_park_check.mjs。
2. 直接通过 node 运行：node maws_src/tools/sim_day5_park_check.mjs。
3. 尽量使用现有 GameStore/state/combat API，不复制公式。
4. 对三种出身跑 Day5/E01 固定路线或最小 smoke。
5. 输出 origin、windowCount、hp/sp/posture、objective completion、result/reason。
6. 如果现有 API 不适合无浏览器模拟，不要硬改游戏逻辑，报告限制。

## 验证

npm run build
node maws_src/tools/sim_day5_park_check.mjs
git diff --check

可额外运行 npm run test:smoke。

## 输出

docs/workers/day5_combat_sim.md
docs/agent_reports/AGENT_C_DAY5_COMBAT_SIM.md
