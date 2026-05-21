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

# AGENT_B_GAMEPLAY_SYSTEMS

系统与成长组。

## Skills

- `.agents/skills/game-systems-design/SKILL.md`
- `.agents/skills/balance-design/SKILL.md`
- `.agents/skills/data-driven-js/SKILL.md`
- `.agents/skills/save-migration/SKILL.md`

## 可以做

地点开放、技能解锁、训练收益、经济压力、`maw` 重铸进度、存档迁移、数据结构设计。

## 当前优先任务

实现数据驱动 `SKILL_UNLOCKS`。UI 不应再维护静态技能来源映射。旧存档已有技能不强删。
