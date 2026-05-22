# WAVE13_QA_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。只做最终 QA，不改业务代码。

重要：当前 shell 所在目录就是 QA worktree。Manager 会在所有实现/测试/shotlist 分支合并并推送后才启动你。不要切回 `E:\TH比赛照片` 修改文件。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\code-review\SKILL.md`、`C:\Users\Administrator\.codex\skills\testing-automation\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`。

## 允许修改

- `docs/workers/qa_wave13_first_look.md`
- `docs/agent_reports/QA_WAVE13_FIRST_LOOK_REVIEW.md`

## 禁止修改

- `maws_src/`
- `assets/`
- `package.json`
- `docs/TASK_HANDOFF.md`
- `docs/SPRINT_BOARD.md`

## 检查内容

1. 是否没有进入技能树 implementation。
2. 是否没有改 INITIAL_SKILLS。
3. 是否没有改战斗公式。
4. Reward deltas 是否结构化、短文本、无重复长句。
5. 出租屋主界面是否像游戏场景而不是开发面板。
6. NPC 点击是否出现可操作菜单或明确反馈。
7. 时间投入弹窗是否可读、可点、移动端不溢出。
8. Day 5 战斗 HUD 是否舞台优先，4-6 小指令可见，队列 1-2。
9. `check:full`、`test:playtest`、Wave 13 smoke、`git diff --check` 是否通过。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## 输出

- `docs/workers/qa_wave13_first_look.md`
- `docs/agent_reports/QA_WAVE13_FIRST_LOOK_REVIEW.md`
- 最后给出：Ready for producer visual review: yes/no。
