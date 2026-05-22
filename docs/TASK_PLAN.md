# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 12：Visual Slice Strike。

## Scope

- 本轮目标是让核心画面先立起来：地图/战斗舞台、角色/NPC 站位、背景裁剪、结构化收益、点击反馈、底栏遮挡、小/大弹窗密度。
- 本轮不继续 skill tree implementation。
- 不改战斗公式、经济曲线、敌人数据、主线剧情、存档 key/version 或资产目录结构。
- UI 只允许一个大实现 owner：`feat/visual-stage-hud-strike`。

## Branch Plan

1. `feat/structured-reward-deltas`
2. `feat/visual-stage-hud-strike`
3. `test/wave12-visual-smoke`
4. `docs/wave12-art-direction-shotlist`
5. `qa/wave12-visual-review`

## Current Plan

- [x] 解压并核对 Wave 12 任务包内容。
- [x] 恢复 Wave 12 checkpoint 文件。
- [x] 将原始 launcher 改为 staged pipeline，避免 QA 提前跑。
- [ ] 提交并推送 Wave 12 staged pipeline 修正。
- [ ] 启动 `scripts/run_wave12_visual_strike_workers.ps1`。
- [ ] 按固定顺序合并：structured reward -> visual UI -> smoke -> shotlist -> QA。
- [ ] 合并后必须人工看截图，不只看 `check:full`。

## Validation

- Prompt/script 提交前：`git diff --check`、PowerShell/JSON 解析检查。
- Worker 分支验证以各自 prompt 为准。
- 最终验收：`npm run check:full`、`npm run test:playtest`、`npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`、人工截图检查。

## Risks

- 如果先合 UI，UI 会继续从长句里猜收益；必须先合 `feat/structured-reward-deltas`。
- 如果多个 worker 修改 `ui.js/ui.css`，会再次产生冲突；本轮只允许视觉大实现分支碰 UI。
- 如果只看自动测试，可能漏掉高分辨率观感、贴纸感、底栏遮挡和弹窗密度问题。

## Next Step

提交 staged pipeline 修正后运行 Wave 12 多 CLI worker。
