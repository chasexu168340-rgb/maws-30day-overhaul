# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

执行 `AGENT_B_SKILL_UNLOCKS_FIXUP`：补齐 `SKILL_UNLOCKS` 覆盖，并把 `model.skillUnlocks` 定为按 `skillId` 索引的对象。

## Scope

- 在 `data.js` 新增 `SKILL_UNLOCKS`。
- 在 `state.js` 输出对象形态的 `model.skillUnlocks`。
- 行动结算后识别本次新学会技能，并追加 `学会：技能 / 来源：地点 · 行动`。
- 初始技能标记 `initial: true`。
- 暂无真实训练来源的技能标记 `planned: true`，不假装可学。
- 更新 `docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md`。
- 不改 UI、combat、经济曲线、存档 key/version 或资源目录。

## Relevant Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md`

## Plan

- [x] 从 `feat/codex-harness-delta` 创建 `feat/skill-unlocks-data`。
- [x] 新增 `SKILL_UNLOCKS` 数据。
- [x] `state.js` import `SKILL_UNLOCKS` 并输出 `skillUnlocks` render model。
- [x] 普通行动和训练小游戏结算追加本次新学会技能提示。
- [x] 运行 build 和自定义解锁 smoke。
- [x] 运行 Playwright smoke 和 diff check。
- [x] 提交并 push `feat/skill-unlocks-data`。
- [x] 补齐全部当前技能的 `SKILL_UNLOCKS` 覆盖。
- [x] 将 `model.skillUnlocks` 固定为对象形态。
- [x] 运行 fixup build 和 Node smoke。
- [x] 运行 fixup Playwright smoke 和 diff check。
- [ ] 提交并 push fixup。

## Validation

- [x] `npm run build`：通过。
- [x] 自定义 Node smoke：通过，沙包连击解锁刺拳/直拳并输出 `skillUnlocks`。
- [x] `npm run test:smoke`：通过，4 个 Chromium 用例。
- [x] `git diff --check`：通过；仅有 Git CRLF 工作区提示。
- [x] Fixup `npm run build`：通过。
- [x] Fixup Node smoke：通过，验证 `dodge`、`mystic.initial`、`advance.planned` 和沙包首次学会刺拳提示。
- [x] Fixup `npm run test:smoke`：通过；新 worktree 先运行了 `npm ci` 安装本地 Playwright 依赖。
- [x] Fixup `git diff --check`：通过；仅有 Git CRLF 工作区提示。

## Result

- 已实现数据驱动技能来源和结算提示；fixup 已补全当前技能覆盖，并把 `model.skillUnlocks` 固定为对象形态。

## Risks

- `feat/skill-unlocks-data` 基于 `feat/codex-harness-delta` 创建；如果 harness 分支先合并到 staging，后续可直接重放/PR 本分支。
- 自定义 Node smoke 第一次命令因 PowerShell 反引号转义失败，已改用字符串拼接后通过。
- `advance`、`lowkick`、`frontkick`、`sidecontrol`、`dirtyescape` 仍是 planned；后续系统/战斗组需要补真实训练来源后再取消 planned。
- 新 worktree 初次运行 `npm run test:smoke` 时缺少本地 `node_modules/.bin/playwright`，执行 `npm ci` 后已通过。

## Next Step

完成 fixup smoke / diff check 后推送 `feat/skill-unlocks-data`。下一步交给 `AGENT_E_UI_PRESENTATION` 让技能页读取 `model.skillUnlocks[skillId]`。
