# TASK_PLAN

> 当前任务单。只保留本轮完整回归的目标、结果、风险和下一步。

## Current Task

合并 `feat/qa-playwright-smoke` 到 `staging/reforge-unlocks-v1`，把真实浏览器 smoke 纳入主重铸分支。

## Scope

- 从远端同步 `staging/reforge-unlocks-v1`。
- `--no-ff` 合并 `origin/feat/qa-playwright-smoke`。
- 验证 `npm run build`。
- 验证 `npm run test:smoke`。
- 验证 `git diff --check`。
- 更新当前 checkpoint。
- 不启动 `AGENT_B_GAMEPLAY_SYSTEMS`。
- 不改 data.js / state.js / ui.js / combat.js。

## Relevant Files

- `package.json`
- `package-lock.json`
- `maws_src/tests/phaser-smoke.spec.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_F_TECH_QA_TOOLS.md`
- `.codex/DONE.md`

## Plan

- [x] 切回 staging 并 fast-forward 到远端最新。
- [x] 合并 `origin/feat/qa-playwright-smoke`。
- [x] 运行 build。
- [x] 运行真实浏览器 smoke。
- [x] 运行 diff check。
- [x] 更新 checkpoint。
- [x] 推送 staging 到 GitHub。

## Validation

- [x] `npm run build`：通过。
- [x] `npm run test:smoke`：通过，4 个 Chromium 用例。
- [x] `git diff --check HEAD~1..HEAD`：通过。
- [x] `git push`

## Result

QA 分支已合并到 staging。真实浏览器 smoke 现在覆盖地点锁、地铁站 travel/action、技能页、战斗页，以及 390x844 / 900x700 / 1365x768 三档横向溢出检查。合并提交为 `615c8c1`。

## Risks

- Playwright 浏览器缓存仍是本机环境依赖，不进入 Git。
- 这轮只建立 QA 门槛，没有做 `SKILL_UNLOCKS`、早期战斗手感或地铁站视觉闭环。
- `AGENT_B_GAMEPLAY_SYSTEMS` 运行前需要明确边界：只做 `SKILL_UNLOCKS` 数据和解锁逻辑，不改 UI 布局、不改战斗公式、不写大段剧情。

## Next Step

推送 staging 后，下一轮开 `feat/skill-unlocks-data`，先让系统组实现 `SKILL_UNLOCKS` 数据驱动；UI 读取 `SKILL_UNLOCKS` 留给后续 `AGENT_E_UI_PRESENTATION`。
