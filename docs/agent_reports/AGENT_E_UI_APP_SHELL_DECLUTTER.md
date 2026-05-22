# AGENT_E_UI_APP_SHELL_DECLUTTER

## Summary

完成 WAVE8_UI_APP_SHELL_DECLUTTER。主地图、技能页和弹窗已改为默认露出决策信息，长描述、来源、数值、收益风险和结算明细收进原生 `details/summary`。

## Implementation

- Map shell: 今日看板 + 场景舞台 + 推荐行动 + 当前地点关键行动默认可见。
- Progressive disclosure: 地点列表、更多地点行动、地点详情、技能详情、弹窗细账折叠。
- Modal shell: story/dialogue/diary/event/travel/training/common result 共用 `renderModalShell` 结构。
- Battle result: 默认显示结果摘要、你学到了什么、复盘按钮；结算明细折叠。
- Training: 选择卡改为主按钮，成本/收益折叠。

## Validation

- `npm run check:full`: passed
- `git diff --check`: passed

## Notes

- 未修改 `data.js`、`state.js`、`events.js`、`combat.js`、资产或 `package.json`。
- 不新增 UI 状态机；折叠展开由浏览器原生 `details` 管理。
