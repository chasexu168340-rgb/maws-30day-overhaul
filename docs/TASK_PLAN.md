# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

WAVE12_VISUAL_STAGE_HUD_STRIKE：主界面、战斗 HUD、人物站位、弹窗密度视觉实现。

## Result

- 已修改 `maws_src/dom/ui.js`、`maws_src/dom/ui.css`。
- 地图舞台放大角色/NPC，增加接触阴影、柔和描边、角色 hover/click 气泡反馈。
- 战斗 HUD 改为舞台优先：底部 dock 限高，1-2 个窗口行动卡突出，更多动作进入抽屉，卡牌默认只保留名称、效果、命中、体/AP。
- 行动/技能默认显示关键耗时、体力/现金、收益、熟练度/来源，长描述和完整数值折叠。
- 小事件/结算优先使用结构化 `rewardDeltas` 数字 chip，长句进入 details。
- 已新增报告：`docs/workers/visual_stage_hud_strike.md`、`docs/agent_reports/AGENT_E_VISUAL_STAGE_HUD_STRIKE.md`。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。
- 人工截图：`test-results/wave12-visual-strike/` 下 1536x864 地图、1536x864 战斗、390x844、小事件结果均已查看。

## Risks

- 为避免 Phaser canvas 抢 DOM 控件点击，CSS 将 `#game-root` 指针事件关闭；当前交互都由 DOM UI 承接，后续若新增 Phaser canvas 直接点击玩法，需要重新分层。
- 390x844 信息密度较高，但无横向溢出，底部导航可见。

## Next Step

提交并推送当前 worker 分支；合并前按 Wave 12 顺序等待 structured reward 分支在前。
