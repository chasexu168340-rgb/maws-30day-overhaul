# WAVE14_NPC_REAL_ACTIONS

你是 AGENT_D_NARRATIVE_CONTENT + AGENT_B_GAMEPLAY_SYSTEMS。

目标：把 Wave13 NPC 菜单里的部分 toast-backed 反馈，替换成真实小行动。

## 允许修改
- maws_src/content/data.js
- maws_src/simulation/state.js
- docs/workers/npc_real_actions_day1_7.md
- docs/agent_reports/AGENT_D_NPC_REAL_ACTIONS_DAY1_7.md

## 禁止修改
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务
1. 为 Day 1-7 常见场景 NPC 增加真实轻行动：刘胖子一起复盘/问今日建议，父亲上香/自省，小满补给提醒/夜班短聊，梁教练一句纠错/拳馆建议。
2. 行动必须使用现有 ACTIONS / gain / flags / dialogue 机制。
3. 点击后要产生结构化 rewardDeltas 能识别的数值变化：calm +1、jud +1、rel_fatty +1、fatherMemory +1、fatigue -少量等。
4. 每个行动消耗 10-30 分钟，不允许无限刷。
5. 同日同 NPC 同类行动应有 flag 或 daily gate。
6. 不加长文本，不做大主线。

## 验证
npm run check:full
npm run test:playtest
git diff --check

## 输出
docs/workers/npc_real_actions_day1_7.md
docs/agent_reports/AGENT_D_NPC_REAL_ACTIONS_DAY1_7.md

## 提交
完成后提交本分支，commit message:
`feat: add day 1-7 npc real actions`

不要 push；Manager pipeline 会统一 push/merge。
