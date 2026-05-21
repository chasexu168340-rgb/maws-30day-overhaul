# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

Wave 3A：补真实浏览器 Playwright smoke，并推送 QA 分支给 GitHub/ChatGPT 审阅。

## Scope

- 从 `staging/reforge-unlocks-v1` 新建 `feat/qa-playwright-smoke`。
- 尝试运行 `AGENT_F_TECH_QA_TOOLS`。
- 补 `@playwright/test` 和 Chromium 浏览器缓存。
- 新增 `npm run test:smoke`。
- 覆盖 390x844、900x700、1365x768 三档真实浏览器 smoke。
- 验证地点锁 UI、地铁站 Day 1 可见可进入可行动、技能页和战斗页无横向溢出。
- 不改玩法数据、技能解锁、战斗公式、经济曲线、存档 key/version 或资产结构。

## Relevant Files

- `package.json`
- `package-lock.json`
- `maws_src/tests/phaser-smoke.spec.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_F_TECH_QA_TOOLS.md`
- `.codex/DONE.md`

## Plan

- [x] 同步 staging 并创建 QA 分支。
- [x] 尝试运行 `codex exec < docs\codex_tasks\AGENT_F_TECH_QA_TOOLS.md`。
- [x] 在外部 Agent 因本机 CLI 认证失败后，由当前 Codex 手动完成同一任务。
- [x] 安装 Playwright 测试依赖和 Chromium。
- [x] 改造 smoke spec。
- [x] 运行 build 和 smoke。
- [x] 执行最终 diff/status 检查。
- [ ] 提交并推送到 GitHub。

## Validation

- [x] `npx playwright install chromium`
- [x] `npm run build`
- [x] `npm run test:smoke`
- [x] `git diff --check`
- [x] `git status --short`
- [ ] `git push -u origin feat/qa-playwright-smoke`

## Result

`npm run test:smoke` 已能启动真实 Chromium，并通过 4 个用例：地点锁与地铁站流程 1 个，390x844、900x700、1365x768 响应式 smoke 各 1 个。测试覆盖地图锁点、地铁站 travel/action、技能页和战斗页横向溢出。

## Risks

- 外部 `codex exec` 没有成功，原因是本机 Codex CLI API key 无效；本分支改动由当前 Codex 手动完成。
- Playwright 浏览器缓存安装在本机用户目录，不进入 Git。
- 这轮只建立 QA 门槛，不处理 `SKILL_UNLOCKS`、早期战斗手感或地铁站视觉闭环。

## Next Step

推送后让 ChatGPT 审阅 `feat/qa-playwright-smoke`。通过后再开 `AGENT_B_GAMEPLAY_SYSTEMS` 做 `SKILL_UNLOCKS` 数据驱动。
