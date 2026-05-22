# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 13 NPC Click Interaction Menu：点击场景人物后出现 compact interaction menu，而不是只有 toast。

## Current Result

- 已改 `maws_src/simulation/state.js`：新增临时 `ui.interactionMenu` 状态，并从当前场景角色 + 当前地点行动生成菜单模型。
- 已改 `maws_src/dom/ui.js`：场景角色点击改为打开菜单；菜单展示姓名、身份、反馈文案和 1-3 个行动。
- 已改 `maws_src/dom/ui.css`：新增 compact menu 样式；手机端保留 NPC 可见可点，避免横向溢出。
- 已写入 `docs/workers/npc_click_interaction_menu.md` 和 `docs/agent_reports/AGENT_B_NPC_CLICK_INTERACTION_MENU.md`。

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: targeted Chromium smoke clicking Liu Fatty at `1536x864` and `390x844`：菜单出现、3 个动作、无 runtime error、无横向溢出。
- Pass: `git diff --check`

## Risks

- 本轮不改 `data.js`、战斗公式、经济曲线、事件系统、资产、入口 HTML、存档 key/version。
- 没有现成可执行行动的 NPC 先使用 toast-backed 反馈按钮；后续可以通过正常 `ACTIONS` 数据接入真实行动。

## Next Step

提交并推送 `feat/npc-click-interaction-menu`。
