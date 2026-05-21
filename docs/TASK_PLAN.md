# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

接入 `MAWS_Broad_Agent_Skill_Routing_v0.5`，把一次性 Agent 任务升级成长期制作部门路由。

## Scope

- 从 `MAWS_Broad_Agent_Skill_Routing_v0.5.zip` 复制新版 Agent profiles 和 prompt。
- 新增 `docs/SKILL_ROUTING.md`，记录 Agent 与 skill 的推荐映射。
- 新增 `docs/NEXT_WAVE_PLAN.md`，记录 Wave 3 推荐顺序。
- 保留旧 `AGENT_00` 到 `AGENT_07` prompt，不在本轮删除或重写旧流程。
- 不启动 QA / 系统 / UI / 战斗等执行型 Agent。
- 不改运行代码、玩法数值、经济曲线、存档 key/version 或资产结构。

## Relevant Files

- `docs/codex_agent_profiles/`
- `docs/codex_tasks/AGENT_A_PRODUCER_INTEGRATOR.md`
- `docs/codex_tasks/AGENT_B_GAMEPLAY_SYSTEMS.md`
- `docs/codex_tasks/AGENT_C_COMBAT_FEEL.md`
- `docs/codex_tasks/AGENT_D_NARRATIVE_CONTENT.md`
- `docs/codex_tasks/AGENT_E_UI_PRESENTATION.md`
- `docs/codex_tasks/AGENT_F_TECH_QA_TOOLS.md`
- `docs/codex_tasks/AGENT_G_ASSET_WORLD.md`
- `docs/SKILL_ROUTING.md`
- `docs/NEXT_WAVE_PLAN.md`
- `MAWS_Broad_Agent_Skill_Routing_v0.5.zip`

## Plan

- [x] 解压并检查 v0.5 路由包结构。
- [x] 复制新版 profiles、prompts、skill routing 和 next wave plan。
- [x] 保留旧 prompt，避免破坏当前自动执行器兼容性。
- [x] 更新本任务 checkpoint。
- [x] 执行文档级校验。
- [x] 提交并推送到 GitHub。

## Validation

- [x] `git status --short --branch`
- [x] `git diff --check`
- [x] `npm run build`
- [x] `git push`

## Result

已接入 v0.5 大类 Agent 路由包。GitHub 上同时保留旧一次性 Agent prompt 和新长期制作部门 prompt，下一轮可优先由 `AGENT_F_TECH_QA_TOOLS` 处理真实浏览器 smoke，再进入 `SKILL_UNLOCKS` 数据驱动改造。路由包提交为 `9b35568`。

## Risks

- `.agents/skills/` 还没有接入真实 skill 仓库；新版 prompt 会要求缺失 skill 时记录 missing skill 并继续。
- 新版 prompt 目前是路由与任务约束，不代表对应功能已经实现。
- QA 执行型任务尚未启动，Playwright 真实浏览器 smoke 仍未完成。

## Next Step

推送后优先开新分支 `feat/qa-playwright-smoke`，让 `AGENT_F_TECH_QA_TOOLS` 修复并跑通真实浏览器 smoke。
