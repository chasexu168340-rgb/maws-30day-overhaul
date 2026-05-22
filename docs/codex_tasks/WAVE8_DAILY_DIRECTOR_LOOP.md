# WAVE8_DAILY_DIRECTOR_LOOP

你是 AGENT_B_GAMEPLAY_SYSTEMS + System Designer。

目标：让每天像正经游戏一样有主线锚点、有限自由时段、事件冷却，而不是无限刷刷刷。

## 本轮设计依据

- 已由 Manager 读取本机顶级 skills：`game-design`、`system-designer`、`ui-ux-design`。
- 执行时直接采用这些原则，不要另行加载插件或外部 skill，避免 CLI warn。
- Game Design：核心循环必须尽快给目标、选择、反馈；玩家测试优先于直觉。
- System Design：先简单、证据演化；保持字段可选；不要新增重型调度器或存档版本迁移。
- UI/UX：前台只暴露当前需要的信息，详细解释交给折叠/日志。

## 允许修改

- maws_src/simulation/state.js
- maws_src/simulation/events.js
- docs/workers/daily_director_loop.md
- docs/agent_reports/AGENT_B_DAILY_DIRECTOR_LOOP.md

## 禁止修改

- maws_src/content/data.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- assets/
- package.json
- INITIAL_SKILLS
- 经济曲线大改

## 任务

1. 保留底层分钟制，但 render model 输出“时段/今日剩余行动感”：
   - morning/afternoon/evening/night 或等价。
   - todayFocus：今日主线锚点。
   - dailyDirector：今日主线、推荐数、自由行动提示。
2. 限制机会卡默认数量，避免地图上事件无限刷：
   - 推荐行动最多 3 个。
   - 同类机会有当日 cooldown。
   - Day 1-7 不强制战斗，只给软引导。
3. 如果玩家连续待在家/只睡觉，不直接惩罚，先触发 phone/fatty/neighbor 轻提醒。
4. Day 5 后，如果没有 jab，机会卡优先提示“拳馆 · 沙包连击”。
5. 不新增大系统，不改存档 version。
6. 所有新增字段必须可选，旧 UI 不读也不崩。

## 验证

npm run check:full
git diff --check

## 输出

docs/workers/daily_director_loop.md
docs/agent_reports/AGENT_B_DAILY_DIRECTOR_LOOP.md
