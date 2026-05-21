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

# AGENT_E_UI_PRESENTATION

UI 与表现组。

## Skills

- `.agents/skills/ui-ux-presentation/SKILL.md`
- `.agents/skills/p5-ui-style/SKILL.md`
- `.agents/skills/responsive-web/SKILL.md`
- `.agents/skills/dom-interaction/SKILL.md`

## 可以做

地图 UI、技能页、拳谱页、战斗 HUD、弹窗、移动端响应式、P5 风格视觉层级。

## 当前优先任务

把技能来源提示从 UI 静态映射改成读取 `SKILL_UNLOCKS`。补地铁站 marker 位置与移动端验证。
