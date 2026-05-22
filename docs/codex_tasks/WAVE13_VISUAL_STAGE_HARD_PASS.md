# WAVE13_VISUAL_STAGE_HARD_PASS

你是 AGENT_E_UI_PRESENTATION，本轮唯一 Visual Stage UI owner。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-ux-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\frontend\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`。

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
- `docs/workers/visual_stage_hard_pass.md`
- `docs/agent_reports/AGENT_E_VISUAL_STAGE_HARD_PASS.md`

## 禁止修改

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/events.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/combat.js`
- `maws_src/assets/manifest.js`
- `assets/`
- `package.json`

## 目标

出租屋主界面第一眼像游戏场景，不像开发面板。

## 要求

1. 角色/NPC 更大、贴地，有接触阴影和轻描边，减少贴纸感。
2. 背景裁剪和焦点合理，高分辨率下舞台占比更高。
3. 主界面信息栏更小、更精，当前主线、当前地点、推荐行动清楚。
4. 底部/侧边栏不遮住行动按钮。
5. 红黄黑大色块降到可接受，保留 P5 式强层级但不压场景。
6. 不改战斗 command bar 的交互结构，那是下一 UI stage。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## 输出

- `docs/workers/visual_stage_hard_pass.md`
- `docs/agent_reports/AGENT_E_VISUAL_STAGE_HARD_PASS.md`
- 报告说明 1536x864 出租屋、390x844 主界面人工观感。
- 提交并推送当前分支。
