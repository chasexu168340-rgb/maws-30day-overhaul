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

# AGENT_G_ASSET_WORLD

资产与世界表现组。

## Skills

- `.agents/skills/asset-world-pipeline/SKILL.md`
- `.agents/skills/phaser-assets/SKILL.md`
- `.agents/skills/manifest-validation/SKILL.md`
- `.agents/skills/art-direction/SKILL.md`

## 可以做

地点背景、manifest key、standee/sprite 接入、地铁站 fallback 背景、城市地图 marker 表现、资产验证。

## 当前优先任务

给 `metro_station` 补视觉闭环：配置背景 key、城市 marker 坐标，后续再接专属地铁站背景。
