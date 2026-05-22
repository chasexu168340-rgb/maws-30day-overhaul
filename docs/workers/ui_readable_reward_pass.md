# UI Readable Reward Pass

## Task

WAVE11_UI_READABLE_REWARD_PASS / AGENT_E_UI_PRESENTATION

目标：减少 UI 折叠带来的信息遮蔽，让战斗只突出本窗口 1-2 张行动卡，并把行动收益用更醒目的数字 chips 表现出来。

## Changed

- 战斗面板拆成“本窗口行动卡”和“更多动作 / 战术抽屉”，默认只突出最多 2 张当前窗口卡。
- 队列显示改为“本窗口动作队列 0/2”，保留 `queueLimit` 的未来扩展显示。
- 行动卡默认展示时间/体力钱/主要收益摘要，长描述和完整数值才进入 details。
- 技能卡默认展示用途、熟练度/来源摘要，完整描述和数值默认折叠。
- 结果和对话结算收益继续使用 hero reward chips，并放宽事件/结算 chips 间距。
- 对话弹窗改为居中偏下的 compact RPG 样式，当前台词优先，历史与结算仍可折叠。

## Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/ui_readable_reward_pass.md`
- `docs/agent_reports/AGENT_E_UI_READABLE_REWARD_PASS.md`

## Validation

- `npm run check:full`: passed
- `npm run test:playtest`: passed
- `git diff --check`: passed

## Risk

- 仅改 DOM 渲染和 CSS，不修改玩法、数值、存档、资产或状态结构。
- 浏览器布局仍需覆盖桌面、平板、手机，重点看战斗 dock 和对话底部弹窗是否遮挡底部导航。
