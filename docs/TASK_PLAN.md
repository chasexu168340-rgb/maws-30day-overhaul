# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 10：Core Loop + Combat Tree 多 CLI 集成收尾。

## Scope

- 已合并并验证：`feat/starter-wild-kit-v3`、`feat/combat-combo-autoplan-v1`、`feat/reward-ui-juice`、`feat/time-dosage-prototype`、`docs/skill-tree-alt-routes-masterplan`。
- 已在所有实现分支合并推送后运行 QA：`qa/wave10-review`。
- 已处理 QA P1：`wild_swing` / `push_away` 注册到 combat skill table，并补 playtest 覆盖。

## Plan

- [x] Wave 10 prompts/scripts 提交并推送。
- [x] 5 个实现 worker 完成并推送。
- [x] Starter、Combat、Reward UI、Time Dosage、Skill Tree Docs 按顺序合并。
- [x] Time Dosage 的 `docs/TASK_PLAN.md` 冲突已手动解决。
- [x] 合并后运行 `check:full`、`test:playtest`、Day 5 sim、`diff check`。
- [x] QA 在最新 staging 后启动并提交报告。
- [x] QA P1 已由 Manager hotfix 修复并重新验证。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `node maws_src/tools/sim_day5_park_check.mjs`：通过。
- `git diff --check`：通过。

## Result

Wave 10 集成完成。开局 6 个野路子/旧招方案已接入；奖励反馈、combo/autoplan、时间投入原型和技能树/邪道路线 masterplan 已落地。QA 发现的 starter wild combat registration 漏口已修。

## Risks

- Time Dosage 仍是原型倍率，需要后续 playtest 微调疲劳、收益和硬练小伤概率。
- Reward UI 与 Time Dosage 合并后通过 smoke/playtest，但仍建议人工看一遍移动端结果弹窗密度。
- Skill Tree / Alt Routes 当前是 masterplan，尚未进入运行代码。

## Next Step

人工进游戏检查 Day 1 新开局、Day 5 E01、奖励弹窗和时间投入弹窗；下一轮再开 skill tree implementation 或 Time Dosage/Reward UI polish。
