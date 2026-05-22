# WAVE9_QA_SCENE_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

本轮只做 QA，不改业务代码。

## 允许修改

- docs/workers/qa_wave9_scene.md
- docs/agent_reports/QA_WAVE9_SCENE_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

重要：你只能在 Manager 已经合并并推送所有实现分支到 `origin/staging/reforge-unlocks-v1` 之后运行。不要把未合并实现分支当作最终结果。

审阅：

- feat/scene-stage-scale
- feat/dialogue-box-rebuild
- feat/event-feedback-loop
- docs/visual-direction-scene-ui

检查：

1. 是否越界改文件。
2. 是否新增或删除资产。
3. 是否改了 INITIAL_SKILLS。
4. 是否改了战斗公式。
5. 人物比例是否明显改善。
6. 是否去掉突兀红黄灰背板。
7. NPC 或场景角色是否能点击或给反馈。
8. 对话框是否更像 RPG 对话框。
9. 事件 resolve 后是否有结果反馈。
10. 390x844 下不横向溢出。
11. npm run check:full 是否通过。

## 验证

npm run check:full
git diff --check

如果可行，人工打开浏览器快速看：
- 地图页
- 一次主线对话
- 一次事件反馈
- 技能页

## 输出

- docs/workers/qa_wave9_scene.md
- docs/agent_reports/QA_WAVE9_SCENE_REVIEW.md

## QA After Merge Rules

Read `docs/codex_tasks/QA_AFTER_MERGE_RULES.md` first if present.

Review the integrated staging result, not old base and not isolated worker branches.

## Completion Rules

Before final response:

1. Run the validation commands above.
2. `git diff --check`.
3. Commit only allowed QA report files with message: `docs: add wave9 scene qa review`.
4. Do not push; Manager will push and merge the QA report after QA exits.
