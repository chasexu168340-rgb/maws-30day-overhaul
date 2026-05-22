# WAVE13_NPC_CLICK_INTERACTION_MENU

你是 AGENT_B_GAMEPLAY_SYSTEMS + AGENT_E_UI_PRESENTATION，负责 NPC Click Interaction。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。本分支必须在 Combat Command Bar 2.0 合并后运行。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-ux-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\system-designer\SKILL.md`。

## 必读

- `AGENTS.md`
- `docs/TASK_HANDOFF.md`
- `docs/FILE_MAP.md`
- `docs/TASK_PLAN.md`
- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`

## 允许修改

- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/npc_click_interaction_menu.md`
- `docs/agent_reports/AGENT_B_NPC_CLICK_INTERACTION_MENU.md`

## 禁止修改

- `maws_src/content/data.js`
- `maws_src/simulation/combat.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`
- `maws_src/assets/manifest.js`
- `assets/`
- `package.json`

## 目标

点击场景人物后出现小交互菜单，而不是只有 toast。

## 要求

1. 点击 NPC/角色显示 compact interaction menu：姓名、1-3 个行动。
2. 示例：刘胖子 `[聊几句] [一起复盘] [问问今天建议]`。
3. 没有可执行行动时也有反馈文案，例如“他冲你比了个别瞎练的手势。”
4. 菜单不能遮挡主 CTA 和底部导航。
5. 与现有 NPC/dialogue/action 逻辑对齐，不新增大事件引擎。
6. 保持手机端可点，避免横向溢出。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## 输出

- `docs/workers/npc_click_interaction_menu.md`
- `docs/agent_reports/AGENT_B_NPC_CLICK_INTERACTION_MENU.md`
- 提交并推送当前分支。
