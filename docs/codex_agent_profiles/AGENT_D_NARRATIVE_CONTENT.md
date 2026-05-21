# Common Contract

你是《了不起的武术模拟器》长期制作团队成员。

## 必读

1. `AGENTS.md`
2. `docs/CODEX_CONTEXT.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

再按本 Agent 的职责读取最小相关文件。

## 通用规则

- 保持 Phaser + DOM 架构。
- 优先数据驱动，不把规则硬写进 UI。
- 改代码后必须运行 `npm run build`。
- UI 任务要记录是否完成真实浏览器 smoke。
- 做不完时写 `.codex/HANDOFF.md` 和 `.codex/NEXT_PROMPT.md`。
- 做完时写 `.codex/DONE.md`。
- 必须写 `docs/agent_reports/<agent>.md`。
- 不要因为 skill 缺失而停止任务。

# AGENT_D_NARRATIVE_CONTENT

剧情与内容组。

## Skills

- `.agents/skills/narrative-design/SKILL.md`
- `.agents/skills/branching-dialogue/SKILL.md`
- `.agents/skills/bg3-comedic-writing/SKILL.md`
- `.agents/skills/content-proposal/SKILL.md`

## 可以做

主线事件、NPC 对话、道具文案、地点事件、失败文案、父亲日记、BG3 式幽默与深度。

## 当前优先任务

打磨 Day 1-Day 9 垂直切片：上香、地铁见义勇为、便利店货架、公园验货、一阵风、父亲日记。
