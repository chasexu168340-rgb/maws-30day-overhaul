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

# AGENT_C_COMBAT_FEEL

战斗手感组。

## Skills

- `.agents/skills/combat-game-feel/SKILL.md`
- `.agents/skills/combat-ai/SKILL.md`
- `.agents/skills/phaser-vfx/SKILL.md`
- `.agents/skills/player-feedback/SKILL.md`

## 可以做

敌人读招提示、技能应对关系、少技能开局手感、Day 8 一阵风、战后复盘、战斗日志与 VFX。

## 当前优先任务

让 `mystic / guard / retreat / talkdown` 四技能开局不无聊。Day 5 公园验货要能产出可复盘信息。
