# AGENT_B_SKILL_UNLOCKS_DATA_AFTER_HARNESS

## Role

你是 Systems Agent。必须在 Harness Delta 完成后执行本任务。

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/EXECUTION_CONTRACT.md`
4. `docs/SPRINT_BOARD.md`
5. `docs/FILE_MAP.md`
6. `docs/VALIDATION.md`
7. `docs/TASK_PLAN.md`

## Allowed Files

只允许修改：

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md`
- `.codex/DONE.md`

## Forbidden

不要修改：

- UI 布局
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/simulation/combat.js`
- 战斗公式
- 经济曲线
- 存档 key/version
- 大段剧情
- 新美术资源
- 旧存档已有技能

## Goal

当前 `applyGain()` 已经处理 `gain.skill` 和 `gain.skill2`，能解锁技能、增加熟练度、推进流派点。不要重写技能学习系统。

本任务只补数据驱动学习来源：

- 在 `data.js` 新增 `SKILL_UNLOCKS`
- 在 `state.js` import `SKILL_UNLOCKS`
- `buildRenderModel()` 输出 `skillUnlocks`
- 行动结算后识别本次新学会的技能
- 结算 lines 追加类似 `学会：刺拳 / 来源：拳馆 · 沙包连击`

## Data Direction

优先覆盖已有天然技能收益的行动：

- `bag`：`jab` / `straight`
- `pressure_test`：`palm` / `offbalance`
- `sprawl_drill`：`sprawl` / `escape`
- 散打、空手道、跆拳道训练中的对应技能

每条记录至少包含：

- 技能 id
- 来源地点
- 来源行动
- 开放条件
- 解锁文案
- 面向 UI 的来源摘要

## Validation

运行：

```powershell
npm run build
npm run test:smoke
git diff --check
```

## Report

更新 `docs/TASK_PLAN.md`、`docs/agent_reports/AGENT_B_GAMEPLAY_SYSTEMS.md`、`.codex/DONE.md`，写明验证结果和风险。
