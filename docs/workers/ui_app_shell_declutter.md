# UI App Shell Declutter

## Task

WAVE8_UI_APP_SHELL_DECLUTTER / AGENT_E_UI_PRESENTATION

把主界面从信息墙改成导演式 HUD、场景舞台、折叠详情，使用原生 `details/summary`，不新增复杂状态机。

## Changed

- 主地图页默认保留今日看板、地点舞台、最多 3 条推荐行动和 1 个当前地点关键行动。
- 地点列表、更多地点行动、地点长描述改入 `details`。
- 技能卡默认只展示名称、熟练度或来源摘要、装备/解锁状态；描述、来源、数值细节折叠。
- story/dialogue/diary/event/travel/training/common/battleResult 弹窗统一走 modal shell。
- 训练弹窗优先展示选择，成本收益折叠。
- 战斗结果默认展示结果摘要、你学到了什么、复盘按钮，结算明细折叠。

## Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/ui_app_shell_declutter.md`
- `docs/agent_reports/AGENT_E_UI_APP_SHELL_DECLUTTER.md`

## Validation

- `npm run check:full`: passed
- `git diff --check`: passed

## Risk

- “当前地点关键行动”目前取 `model.actions[0]`，没有新增排序系统；如后续需要更精确，可由 render model 提供 `primaryActionId`。
- “更多地点行动”不重复渲染首要行动按钮，避免 Playwright strict locator 和重复点击目标。
