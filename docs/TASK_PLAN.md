# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 9：Scene Presentation 多 CLI。Manager 正在手动续接合并实现分支，QA 必须等 staging 集成并 push 后启动。

## Scope

- 合并并验证：`feat/scene-stage-scale`、`feat/dialogue-box-rebuild`、`feat/event-feedback-loop`、`docs/visual-direction-scene-ui`。
- 延后启动并合并：`qa/wave9-scene-review`。
- 不新增本轮需求外的游戏内容、敌人、技能、Day 8/9 或经济/战斗改动。

## Plan

- [x] Scene Stage 已合并并通过 `npm run check:full` / `git diff --check`。
- [x] Dialogue Box 已合并并通过 `npm run check:full` / `git diff --check`。
- [x] Event Feedback 已开始合并，`docs/TASK_PLAN.md` 冲突已按 Manager checkpoint 解决。
- [ ] Event Feedback 合并后跑验证。
- [ ] Visual Direction 合并后跑 `git diff --check`。
- [ ] Push integrated staging。
- [ ] 从最新 staging 启动 QA worker。
- [ ] 合并 QA 报告并 push。

## Validation

- Scene Stage：通过。
- Dialogue Box：通过。
- Event Feedback：待跑。
- Visual Direction：待跑。
- Final QA：待跑。

## Result

进行中。

## Risks

- A/B/C 都改 UI，必须靠集成后浏览器验证确认最终效果。
- 本轮发现 worker 可能受 `AGENTS.md` 默认根目录影响写回主仓库，后续 prompt 要明确 stay in current worktree。
- QA 不能提前跑，必须等 staging 集成并 push。

## Next Step

完成 Event Feedback merge commit，继续验证和合并 Visual Direction。
