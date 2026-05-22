# Dialogue Box Rebuild

## Task

WAVE9_DIALOGUE_BOX_REBUILD / AGENT_E_UI_PRESENTATION

把对话框、主线选择弹窗、事件弹窗和普通结果弹窗从资料框改成更像 RPG 场景内的对话表现。

## Changed

- `renderDialogueModal` 改为头像/半身像区域 + 当前台词框，只默认展示当前说话人和当前台词。
- 对话历史、收益和结算明细改入 `details`，放在主操作之后。
- `renderStoryChoiceModal` 默认只展示标题、场景摘要和选择卡，长说明与收益风险折叠。
- `renderEventNotebookModal` 使用同一套场景标题和摘要表现，现场细节与收益风险继续折叠。
- 普通结果弹窗默认展示结果摘要和主要按钮，详细结算折叠为“查看详细结算”。
- FatherDiary 保留沉浸式纸页感，默认不再像系统列表标题。

## Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/dialogue_box_rebuild.md`
- `docs/agent_reports/AGENT_E_DIALOGUE_BOX_REBUILD.md`

## Validation

- `npm run check:full`: passed
- `git diff --check`: passed

## Risk

- 未新增状态机或数据字段，表现完全依赖现有 modal 数据。
- 头像资源仍沿用 `line.assetKey`；没有 asset 的说话人会显示首字 fallback。
