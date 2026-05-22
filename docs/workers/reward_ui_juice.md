# Reward UI Juice

## Task

AGENT_E_UI_PRESENTATION / `WAVE10_REWARD_UI_JUICE`.

目标：玩家获得收益时，资源变化、技能学习、关系变化要以游戏反馈呈现，而不是只沉在结算明细里。

## Changed Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/reward_ui_juice.md`
- `docs/agent_reports/AGENT_E_REWARD_UI_JUICE.md`

## Result

- 增加 UI 层收益解析：从 `modal.gain`、`modal.summary.gain`、`modal.summaryChips`、`modal.settlementLines`、`modal.lines` 提取 3-5 个收益 chips。
- 资源变化以 chips 展示，例如 `现金 +20`、`冷静 +2`、`误判 +3`。
- 技能学习识别为 `NEW` chip，关系/好感/信任识别为 `LINK` chip。
- `settlement` / `result-feedback` 首屏收敛为一句话结果、收益 chips、继续/下一步按钮。
- 详细成本、日志、结算列表移入折叠区。
- 增加轻量 reward stack，modal 出现时在侧边弹出本次主要收益。
- 小型 settlement 结果使用 `result-compact` 窄结果框，不再默认占大 modal 宽度。

## Validation

- `npm run check:full`：通过。
- `git diff --check`：通过。

## Risk

- 奖励 chips 来自现有文案和结算行解析，不改状态层；如果未来结算文案格式变化，可能只显示详细结算，不显示对应 chip。
- 未改 `data.js`、`state.js`、`combat.js`、`events.js`、`assets/`、`package.json`。

## Next

- Manager 集成后建议在真实玩法中检查训练、事件、战斗复盘各自产出的结算文本是否都能提取到最关键的 3-5 个 chips。
