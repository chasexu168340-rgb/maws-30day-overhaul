# TASK_HANDOFF

> 新窗口恢复首选 checkpoint。只记录当前任务、允许范围、验证门槛和下一步。

## Current Task

Wave 12：Visual Slice Strike。

## Goal

让进游戏第一眼像一个可玩的游戏切片：知道看哪里，点击有反馈，战斗画面不被 UI 吃掉，收益反馈是清晰数字。

## Scope

- 战斗舞台变大，卡牌变小，但不是只剩两张牌。
- 主角/NPC 变大、贴地、融入背景，去掉诡异背板。
- 背景裁剪和焦点重做，高分辨率下不糊、不怪。
- 事件收益改成结构化数字弹出，不重复长句。
- 点击 NPC/人物有明显视觉反馈。
- 本地点行动不能被底栏遮挡。
- 小事件用小弹窗，大事件才用大弹窗。

## Branch Plan

1. `feat/structured-reward-deltas`
2. `feat/visual-stage-hud-strike`
3. `test/wave12-visual-smoke`
4. `docs/wave12-art-direction-shotlist`
5. `qa/wave12-visual-review`

## Merge Order

必须按以下顺序合并：

1. structured reward deltas
2. visual stage/hud strike
3. visual smoke tests
4. art direction shotlist
5. QA visual review

不要先合 UI；UI 需要读取结构化收益。

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/codex_tasks/` 下当前 worker prompt

## Validation

- 不只看 `check:full`，必须人工看截图。
- 最终至少运行：`npm run check:full`、`npm run test:playtest`、`npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`、`git diff --check`。

## Hard Fail

- 战斗卡牌还占掉半个屏幕。
- 角色还是小、浮、贴纸感强。
- 事件收益还是长句黄块。
- NPC 点击只有 toast。
- 行动按钮被底栏遮住。
- 高分辨率看起来像调试面板。

## Do Not Do

- 不继续 skill tree implementation。
- 不改战斗公式、经济曲线、敌人数据、主线剧情、存档 key/version 或资产结构。
- 不让多个 worker 同时修改 `maws_src/dom/ui.js` / `maws_src/dom/ui.css`。
