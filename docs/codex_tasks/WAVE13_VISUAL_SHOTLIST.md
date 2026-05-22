# WAVE13_VISUAL_SHOTLIST

你是 AGENT_A_ART_DIRECTION，负责 Wave 13 first-look shotlist。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\ui-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`、`C:\Users\Administrator\.codex\skills\technical-writer\SKILL.md`。

## 允许修改

- `docs/ui/WAVE13_FIRST_LOOK_SHOTLIST.md`
- `docs/workers/wave13_visual_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE13_VISUAL_SHOTLIST.md`

## 禁止修改

- `maws_src/`
- `assets/`
- `package.json`

## 目标

写一份能指导人工验收的 shotlist，覆盖五个画面：

1. 出租屋主界面
2. 点击 NPC/角色
3. 普通事件收益反馈
4. 时间投入弹窗
5. Day 5 战斗 HUD

每个画面写：通过标准、不通过标准、截图角度、手机/桌面注意点。

## 验证

- `git diff --check`

## 输出

- `docs/ui/WAVE13_FIRST_LOOK_SHOTLIST.md`
- `docs/workers/wave13_visual_shotlist.md`
- `docs/agent_reports/AGENT_A_WAVE13_VISUAL_SHOTLIST.md`
- 提交并推送当前分支。
