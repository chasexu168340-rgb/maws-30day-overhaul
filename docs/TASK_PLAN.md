# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 10 `WAVE10_TIME_DOSAGE_PROTOTYPE`：训练/工作/观察行动增加投入时长选择，加入发呆/放空微行动，并保持分钟制兼容。

## Scope

- 只改允许文件：`data.js`、`state.js`、`ui.js`、`ui.css` 和本 worker/report 文档。
- 不改 `combat.js`、`manifest.js`、`assets/`、`INITIAL_SKILLS`、存档 key/version。

## Plan

- [x] 添加 30/60/90/120 分钟投入档位数据。
- [x] 在状态层按档位缩放收益、体力、现金、疲劳和硬练风险。
- [x] 在 DOM UI 上为可调行动增加投入选择框。
- [x] 增加发呆/放空微行动和少量叙事触发。
- [x] 修复相关 UI 可见性与点击命中问题。
- [x] 跑完最终验证并记录结果。

## Validation

- `npm run check:full`
- `npm run test:playtest`
- `git diff --check`

## Result

代码已实现；`npm run check:full`、`npm run test:playtest`、`git diff --check` 均通过。

## Risks

- 档位倍率为原型值，后续需要真实 playtest 后微调。
- 硬练小伤风险当前为轻量实现，不改变存档结构。

## Next Step

提交并推送当前分支。
