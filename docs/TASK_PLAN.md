# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 10：Core Loop + Combat Tree 多 CLI。Manager 正在合并实现分支；Starter、Combat、Reward UI 已合入并验证，当前处理 Time Dosage merge。

## Scope

- 已合并：`feat/starter-wild-kit-v3`、`feat/combat-combo-autoplan-v1`、`feat/reward-ui-juice`。
- 当前合并：`feat/time-dosage-prototype`。
- 待合并：`docs/skill-tree-alt-routes-masterplan`。
- QA 必须等所有实现分支合并、验证并 push 后再启动。

## Plan

- [x] Starter Wild Kit 已合并，`check:full`、`test:playtest`、`diff check` 通过。
- [x] Combat Combo Autoplan 已合并，`check:full`、Day 5 sim、`diff check` 通过。
- [x] Reward UI Juice 已合并，`check:full`、`diff check` 通过。
- [x] Time Dosage merge 中的 `docs/TASK_PLAN.md` 冲突已按 Manager checkpoint 解决。
- [ ] Time Dosage 合并后跑 `check:full`、`test:playtest`、`diff check`。
- [ ] 合并 Skill Tree / Alt Routes masterplan 并跑 `diff check`。
- [ ] 推送 integrated staging。
- [ ] 从最新 staging 启动 QA worker。
- [ ] 合并 QA 报告并 push。

## Validation

- Starter：通过。
- Combat：通过。
- Reward UI：通过。
- Time Dosage：待跑。
- Skill Tree Docs：待跑。
- Final QA：待跑。

## Result

进行中。

## Risks

- Time Dosage 与 Reward UI 同时改 UI，必须用浏览器 smoke/playtest 确认最终结果。
- Time Dosage 原型值需要后续 playtest 微调，不能直接当最终经济平衡。
- QA 不能提前跑，否则会审到旧版本。

## Next Step

完成 Time Dosage merge commit 并运行验证。
