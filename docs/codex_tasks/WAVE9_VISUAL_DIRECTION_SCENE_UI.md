# WAVE9_VISUAL_DIRECTION_SCENE_UI

你是 AGENT_A_PRODUCER_INTEGRATOR + AGENT_E_UI_PRESENTATION。

本轮只写视觉规范，不改运行代码。

## 允许修改

- docs/ui/VISUAL_DIRECTION_SCENE_UI.md
- docs/workers/visual_direction_scene_ui.md
- docs/agent_reports/AGENT_A_VISUAL_DIRECTION_SCENE_UI.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

写 MAWS 场景 UI 视觉规范，必须包含：

1. 场景舞台规范：
   - 主角/NPC 比例。
   - 脚底接触阴影。
   - 轮廓光。
   - 禁止大面积红黄灰背板。
2. 对话框规范：
   - 当前台词优先。
   - 说话人清楚。
   - 历史和收益折叠。
3. 事件反馈规范：
   - 点击事件后必须有结果反馈。
   - 收益/代价必须即时可见。
   - 后续选择必须明确。
4. P5 / BG3 / DOS2 取舍：
   - P5：强视觉层级和主线压迫。
   - BG3：选择后果和失败也有内容。
   - DOS2：场景点击和角色交互。
5. 移动端规范：
   - 不挤多个角色。
   - 弹窗优先当前内容。
   - 长文必须折叠。

## 验证

git diff --check

## 输出

- docs/ui/VISUAL_DIRECTION_SCENE_UI.md
- docs/workers/visual_direction_scene_ui.md
- docs/agent_reports/AGENT_A_VISUAL_DIRECTION_SCENE_UI.md

## Skill Guidance

- Game UI Frontend: scene UI must protect the playfield and avoid generic app-dashboard composition.
- UI/UX: use color semantically; red means danger/mainline pressure, gold means key reward/mainline emphasis, gray means secondary detail.
- Game Design: the spec should reinforce the core loop and player feeling, not add system breadth.
- Storytelling: dialogue and event presentation should privilege the current beat over exposition.

## Completion Rules

Before final response:

1. Run the validation command above.
2. `git diff --check`.
3. Commit only allowed files with message: `docs: add scene ui visual direction`.
4. Do not push; Manager will push and merge after all implementation workers finish.
