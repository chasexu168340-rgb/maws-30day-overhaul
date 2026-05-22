# WAVE13_FIRST_LOOK_SMOKE_TESTS

你是 AGENT_F_TECH_QA_TOOLS，负责 Wave 13 first-look visual smoke。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。本分支必须在 UI 与 NPC 分支合并后运行。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\testing-automation\SKILL.md`、`C:\Users\Administrator\.codex\skills\playwright\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`。

## 允许修改

- `maws_src/tests/wave13_first_look.spec.js`
- `docs/workers/wave13_first_look_smoke.md`
- `docs/agent_reports/AGENT_F_WAVE13_FIRST_LOOK_SMOKE.md`

## 禁止修改

- `maws_src/dom/`
- `maws_src/simulation/`
- `maws_src/content/`
- `assets/`
- `package.json`

## 目标

自动检查五个 first-look 画面底线：

1. 出租屋主界面能打开，无横向溢出，主 CTA 不被底栏遮挡。
2. 点击 NPC/角色后出现 interaction menu 或明确反馈。
3. 普通事件收益反馈显示 compact reward chips，不重复长句。
4. 时间投入弹窗在 390x844 不溢出且按钮可点。
5. Day 5 战斗 HUD 显示 4-6 个小指令/行动卡，队列槽仍为 1-2，`confirmBattle` 可点击。

## 验证

- `npm run build`
- `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## 输出

- `docs/workers/wave13_first_look_smoke.md`
- `docs/agent_reports/AGENT_F_WAVE13_FIRST_LOOK_SMOKE.md`
- 截图输出到 `test-results/wave13/`。
- 提交并推送当前分支。
