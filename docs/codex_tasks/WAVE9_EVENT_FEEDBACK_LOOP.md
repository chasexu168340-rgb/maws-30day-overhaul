# WAVE9_EVENT_FEEDBACK_LOOP

你是 AGENT_B_GAMEPLAY_SYSTEMS + AGENT_E_UI_PRESENTATION。

本轮目标：事件点击后必须给玩家即时反馈和下一步选择，而不是像后台 action 消失。

## 允许修改

- maws_src/simulation/state.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/event_feedback_loop.md
- docs/agent_reports/AGENT_B_EVENT_FEEDBACK_LOOP.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- maws_src/assets/manifest.js
- assets/
- package.json
- INITIAL_SKILLS
- 战斗公式
- 经济曲线大改

## 任务

1. 为普通行动/事件处理结果增加轻量 result feedback modal。
2. 反馈结构建议：
   - 标题：结果
   - 一句话结果摘要
   - 获得/代价摘要
   - 后续按钮：继续行动 / 查看日志 / 去推荐地点，视现有数据可用性决定
3. 不要重写事件系统。
4. 不要新增剧情引擎。
5. 只把已有 settlement lines、gain/cost、log 转成更像游戏反馈的 UI。
6. 对 `eventNotebook` 的 resolve 后也应有反馈，而不是直接消失。
7. 如果某些 action 已经有专用 modal，不要重复弹两次。

## 验证

npm run check:full
git diff --check

## 输出

- docs/workers/event_feedback_loop.md
- docs/agent_reports/AGENT_B_EVENT_FEEDBACK_LOOP.md

## Skill Guidance

- Game Design: every meaningful click needs feedback, consequence, and a clear next step.
- UI/UX: make gains, costs, and follow-up actions visible immediately; keep detailed logs folded.
- Game UI Frontend: result feedback should feel like an RPG event result, not a backend action receipt.

## Completion Rules

Before final response:

1. Run the validation commands above.
2. `git diff --check`.
3. Commit only allowed files with message: `feat: add event feedback loop`.
4. Do not push; Manager will push and merge after all implementation workers finish.
