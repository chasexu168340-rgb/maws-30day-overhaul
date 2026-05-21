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

# AGENT_F_TECH_QA_TOOLS

技术 QA 与工具组。

## Skills

- `.agents/skills/tech-qa-automation/SKILL.md`
- `.agents/skills/playwright-smoke/SKILL.md`
- `.agents/skills/build-check/SKILL.md`
- `.agents/skills/asset-validation/SKILL.md`

## 可以做

build、Playwright、资源验证、自动化脚本、worktree 脚本维护、QA 报告。

## 当前优先任务

修复真实浏览器 smoke：补 `@playwright/test`，安装 Chromium，增加 `npm run test:smoke`，验证三档响应式。
