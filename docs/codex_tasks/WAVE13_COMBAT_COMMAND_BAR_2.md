# WAVE13_COMBAT_COMMAND_BAR_2

你是 AGENT_C_COMBAT_FEEL + AGENT_E_UI_PRESENTATION，负责 Combat Command Bar 2.0。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。本分支必须在 Visual Stage Hard Pass 合并后运行。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\combat-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-ux-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`。

## 必读

- `AGENTS.md`
- `docs/TASK_HANDOFF.md`
- `docs/FILE_MAP.md`
- `docs/TASK_PLAN.md`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`

## 允许修改

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/combat_command_bar_2.md`
- `docs/agent_reports/AGENT_C_COMBAT_COMMAND_BAR_2.md`

## 禁止修改

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/combat.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`
- `maws_src/assets/manifest.js`
- `assets/`
- `package.json`
- 战斗公式

## 目标

Day 5 战斗 HUD 像战斗指令栏，不像大卡牌桌。

## 要求

1. 显示 4-6 个小指令按钮或小卡；不是只显示 2 张大卡。
2. 队列槽仍然是 1-2 招；选中的招进入队列区。
3. 技能详情进入 hover/details/详情面板，不撑大主指令栏。
4. 战斗舞台至少占屏幕 60%，角色/背景优先。
5. 左下目标/部位，右下日志/复盘或等价布局；不要让日志白滚动条截断。
6. 保持按钮可点击，特别是 `confirmBattle`。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## 输出

- `docs/workers/combat_command_bar_2.md`
- `docs/agent_reports/AGENT_C_COMBAT_COMMAND_BAR_2.md`
- 报告说明 1536x864 Day 5 战斗截图观感。
- 提交并推送当前分支。
