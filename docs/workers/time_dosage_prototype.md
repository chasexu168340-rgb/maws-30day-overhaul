# Time Dosage Prototype

## Current Task

Wave 10 `AGENT_B_GAMEPLAY_SYSTEMS + AGENT_E_UI_PRESENTATION`：让训练、工作、观察类行动可选择投入时长，并加入低收益的发呆/放空微行动。

## Implemented

- 新增 30/60/90/120 分钟投入档位：短练、标准、深练、硬练。
- 训练、工作、观察类 `simple` 行动点击后先弹出投入选择框，再进入原行动或训练小游戏。
- 收益按档位 multiplier 缩放，体力、现金成本和疲劳按单独倍率缩放；硬练有小伤和额外疲劳风险。
- 新增 `发呆放空`、`站边放空`、`绕场短走` 微行动，恢复少量 calm/士气/疲劳，不给核心资源爆发收益。
- 发呆类行动有概率触发父亲记忆、日记自省、朋友消息，并给少量叙事/关系/冷静收益。
- 技能来源详情默认展开，避免测试和玩家看不到来源摘要。
- 修复地图推荐栏覆盖主线按钮的点击命中问题。

## Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/time_dosage_prototype.md`
- `docs/agent_reports/AGENT_B_TIME_DOSAGE_PROTOTYPE.md`

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。

## Risk

- 档位倍率是原型值，后续如要精调应在真实 playtest 后微调 `TIME_DOSAGE_OPTIONS`，不要改存档版本。
