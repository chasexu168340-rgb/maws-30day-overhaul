# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 12：Visual Slice Strike。

## Result

- 已按 staged pipeline 完成并合并：`feat/structured-reward-deltas` -> `feat/visual-stage-hud-strike` -> `test/wave12-visual-smoke` -> `docs/wave12-art-direction-shotlist` -> `qa/wave12-visual-review`。
- QA 在实现分支全部合并并推送后才启动，避免了提前审老版本。
- Manager follow-up 已修复 QA P1/P2：
  - reward chips 结构化优先，不再把 `settlementLines` / 长对话句重复解析成 chip。
  - 弹窗内已有 hero chips 时不再额外叠一层 reward stack。
  - 战斗 HUD 可见 4 张小行动卡，队列仍限制本窗口 1-2 招。
  - Wave 12 visual smoke 增加结构化 reward chip 去重/短文本断言，以及可见战斗卡数量断言。
- 已推送 `staging/reforge-unlocks-v1`。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`：通过。
- `git diff --check`：通过。
- 人工查看截图：
  - `test-results/wave12/desktop-combat.png`
  - `test-results/wave12/desktop-map-modal.png`
  - `test-results/wave12/mobile-main-cta.png`

## Risks

- `GameDesigner_CombatAnalysis/` 仍是未跟踪目录，本轮未触碰。
- QA 报告保留了原始 findings；本文件记录 manager follow-up 已修复 P1/P2。P3 是 manager/pipeline setup scope，不属于 worker 越界。
- 视觉截图已明显改善，但高分辨率最终美术质量仍需后续人工 playtest 继续看第一眼观感。

## Next Step

人工进 `maws_30day_overhaul_v3.html` 看 Wave 12 最终画面；如果 5 个视觉硬门槛通过，再开下一轮，不要直接跳技能树 implementation。
