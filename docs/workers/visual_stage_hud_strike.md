# Visual Stage HUD Strike Worker Report

## Scope

- Worker：AGENT_E_UI_PRESENTATION + AGENT_G_ASSET_WORLD。
- 修改范围：`maws_src/dom/ui.js`、`maws_src/dom/ui.css`。
- 禁止范围未修改：data/state/events/combat/manifest/assets/package/INITIAL_SKILLS。

## Implemented

- 战斗 HUD：底部 dock 限高并可滚动，舞台保持主视觉；1-2 个本窗口行动卡突出，更多动作收进战术抽屉。
- 战斗卡：默认只显示名称、效果、命中、体/AP，详细描述和风险保留在 hover/detail 层；按钮保持可见和自动化可点击。
- 地图舞台：角色/NPC 放大贴地，去除硬背板感，增加柔和描边、投影、接触阴影和角色互动气泡。
- 行动/推荐栏：右侧栏压缩并避开底部导航；当前地点行动保留重点信息，更多行动折叠。
- 弹窗/收益：结算优先读取 `rewardDeltas` / rewards 数字 chip，小事件用 compact result；长句和完整结算放入 details。
- 点击反馈：NPC/角色 hover、focus、click 都有高亮和小气泡，不只依赖 toast。

## Validation

- `npm run check:full`：通过。
- `npm run test:playtest`：通过。
- `git diff --check`：通过。

## Manual Visual Pass

- 1536x864 地图页：通过。主角和 NPC 足够大，脚底贴地，右侧栏不压底栏。
- 1536x864 战斗页：通过。中央角色和背景占主视觉，底部卡牌没有压住脚下；队列卡突出，更多动作在抽屉。
- 390x844：通过。底部导航可见，无横向溢出；信息密度偏高但可操作。
- 小事件结果：通过。compact 弹窗直接显示关系/现金/体力数字 chip，长结算收进 details。

## Risk

- `#game-root` pointer events 关闭，以保证 DOM HUD 不被 Phaser canvas 截获；若后续要直接点击 Phaser canvas，需要拆分 canvas 交互层。
