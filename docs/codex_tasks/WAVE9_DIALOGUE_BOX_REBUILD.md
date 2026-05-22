# WAVE9_DIALOGUE_BOX_REBUILD

你是 AGENT_E_UI_PRESENTATION。

本轮目标：把对话框、主线选择弹窗、事件弹窗从“系统资料框”改成“RPG 场景对话框”。

## 允许修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/dialogue_box_rebuild.md
- docs/agent_reports/AGENT_E_DIALOGUE_BOX_REBUILD.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/events.js
- maws_src/simulation/combat.js
- maws_src/assets/manifest.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务

1. 重做 `renderDialogueModal`：
   - 左侧/上方是说话人头像或半身像。
   - 右侧/下方只显示当前台词。
   - 下一句/选择按钮突出。
   - 历史、收益、结算放入 details。
2. 重做 `renderStoryChoiceModal`：
   - 默认只显示标题、一句场景摘要、选择卡。
   - 长说明和收益预览折叠。
3. 重做普通 result modal：
   - 默认显示结果摘要和主要按钮。
   - settlement lines 折叠为“查看详细结算”。
4. FatherDiary 可以保持沉浸，但不要像系统列表。
5. 不增加复杂状态机，优先使用现有 modal 数据和 HTML/CSS。
6. 风格目标：像 RPG 对话框，不像后台弹窗。

## 验证

npm run check:full
git diff --check

## 输出

- docs/workers/dialogue_box_rebuild.md
- docs/agent_reports/AGENT_E_DIALOGUE_BOX_REBUILD.md

## Skill Guidance

- Game UI Frontend: the modal should feel like part of the scene, not a generic dashboard panel.
- UI/UX: current line, current speaker, and current choices are primary; history, gains, costs, and long text are progressive disclosure.
- Storytelling: less is more; dialogue should carry subtext and should not dump exposition by default.

## Completion Rules

Before final response:

1. Run the validation commands above.
2. `git diff --check`.
3. Commit only allowed files with message: `feat: rebuild dialogue box presentation`.
4. Do not push; Manager will push and merge after all implementation workers finish.
