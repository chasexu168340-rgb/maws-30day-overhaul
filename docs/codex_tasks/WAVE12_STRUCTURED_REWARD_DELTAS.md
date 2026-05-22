# WAVE12_STRUCTURED_REWARD_DELTAS

你是 AGENT_B_GAMEPLAY_SYSTEMS。本轮目标：停止让 UI 从长句废话里解析收益，状态层给 modal 输出结构化 rewardDeltas。

允许修改：maws_src/simulation/state.js、maws_src/simulation/economy.js、maws_src/simulation/events.js、docs/workers/structured_reward_deltas.md、docs/agent_reports/AGENT_B_STRUCTURED_REWARD_DELTAS.md。

禁止修改：ui.js、ui.css、data.js、combat.js、assets、package.json、INITIAL_SKILLS、战斗公式。

任务：
1. 行动结算、eventNotebook resolve、训练结算、时间投入结果输出 rewardDeltas。
2. 结构建议：{ key, label, value, delta, kind, icon, tone, priority, source }。
3. kind 包括 money/sp/hp/calm/morale/relation/skill/maw/risk/item/time。
4. lead 只保留一句结果，不要把长句塞进 reward chip。
5. rewardDeltas 只放“现金 +20 / 冷静 +2 / 小满关系 +1 / 学会 野路挥拳 / 时间 -30m”。
6. 保留旧 lines/summary 兼容。
7. 可提供 followUps，最多 2 个，不新建剧情引擎。

验证：npm run check:full；npm run test:playtest；git diff --check。
