# WAVE8_DAY1_7_SCENE_CONTENT

你是 AGENT_D_NARRATIVE_CONTENT。

目标：把 Day 1-7 的主线内容改成“场景摘要 + 当前台词 + 折叠详情”友好结构，让主线存在感更强。

## 本轮写作依据

- 已由 Manager 读取本机顶级 skills：`storytelling`、`game-design`、`ui-ux-design`。
- 执行时直接采用这些原则，不要另行加载插件或外部 skill，避免 CLI warn。
- Storytelling：少即是多；行动代替说明；对话有潜台词；每场只打一件事。
- Game Design：玩家要知道今天的目标、选择代价和反馈，不要被资料墙教育。
- UI/UX：默认短句和当前钩子，长背景进入可展开详情。

## 允许修改

- maws_src/content/data.js
- docs/workers/day1_7_scene_content.md
- docs/agent_reports/AGENT_D_DAY1_7_SCENE_CONTENT.md

## 禁止修改

- maws_src/simulation/state.js
- maws_src/simulation/events.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- assets/
- INITIAL_SKILLS

## 任务

1. 只处理 Day 1-7。
2. 每天 MAIN_EVENTS 增加或整理：
   - shortDesc / sceneSummary / hook 等短摘要字段，字段名尽量复用现有结构；没有就只优化 desc/dialogue。
   - dialogue 不要一次给信息墙。
   - 每天只保留一个核心情绪点。
3. Day 1：上香，父亲与误读。
4. Day 2：地铁，不是擂台，是收场。
5. Day 3：便利店，误判胜利。
6. Day 4：工棚，被看见的兴奋和手腕真实疼。
7. Day 5：公园验货，目标不是 KO。
8. Day 6：旧城区夜行，父亲痕迹。
9. Day 7：镜子自省。
10. 不接 Day 8/9。
11. 奖励轻量，不大幅送属性。

## 验证

npm run build
npm run test:smoke
git diff --check

## 输出

docs/workers/day1_7_scene_content.md
docs/agent_reports/AGENT_D_DAY1_7_SCENE_CONTENT.md
