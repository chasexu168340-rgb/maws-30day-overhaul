# WAVE13_TIME_ACTIVITY_FEEL_PASS

你是 AGENT_B_GAMEPLAY_SYSTEMS，负责 Time Activity Feel Pass。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\system-designer\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`。

## 必读

- `AGENTS.md`
- `docs/TASK_HANDOFF.md`
- `docs/FILE_MAP.md`
- `docs/TASK_PLAN.md`
- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`

## 允许修改

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`
- `docs/workers/time_activity_feel_pass.md`
- `docs/agent_reports/AGENT_B_TIME_ACTIVITY_FEEL_PASS.md`

## 禁止修改

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/simulation/combat.js`
- `maws_src/assets/manifest.js`
- `assets/`
- `package.json`
- `INITIAL_SKILLS`
- 存档 key/version

## 目标

让 30/60/90/120 分钟投入成为“安排一段时间”的玩法，不是倍率表。

## 要求

1. 短练不亏：低收益、低疲劳，适合补碎片时间。
2. 标准稳：默认推荐，不惩罚玩家。
3. 深练有诱惑：收益更明显，但疲劳/错过机会更清楚。
4. 硬练危险：不是常规最优解，必须有清晰风险。
5. 发呆/看笔记/刷短视频/打电话/拉伸是微行动：恢复、消息、自省或轻量线索，不刷资源最优。
6. 不继续膨胀倍率，不大改经济曲线。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `git diff --check`

## 输出

- `docs/workers/time_activity_feel_pass.md`
- `docs/agent_reports/AGENT_B_TIME_ACTIVITY_FEEL_PASS.md`
- 提交并推送当前分支。
