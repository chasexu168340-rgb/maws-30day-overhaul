# Agent 01 Report

## 做了什么

- 新增 `LOC_UNLOCKS` 地点开放规则。
- 新增 `INITIAL_SKILLS` 初始技能列表。
- 新开局初始技能从 9 个缩减为 4 个：`mystic`、`guard`、`retreat`、`talkdown`。
- 新开局默认装备改为：`mystic`、`guard`、`retreat`、`talkdown`、空、空。
- 在 `buildRenderModel()` 和城市地图 marker 中输出 `locked`、`lockReason`、`unlockHint`。
- 地图直接出行会拦截未开放地点并显示原因。
- 主线出行保留 `allowLocked` 临时通行，避免 Day 2 / Day 8 等旧主线被地点锁软锁。
- 机会卡跳转到未开放地点时会被拦截并提示原因。

## 改了哪些文件

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`
- `.codex/DONE.md`

## 没做什么

- 未新增完整 `metro_station` 地点内容，只预留了 `LOC_UNLOCKS.metro_station` 规则。
- 未改战斗公式、经济曲线、敌人数据、训练收益、存档 key/version 或资产结构。
- 未做 UI 精修，锁定状态的视觉表现交给 Agent 02。

## 运行了什么验证

```powershell
npm run build
```

```powershell
node --input-type=module -e "<state smoke>"
```

## 验证结果

- `npm run build` 通过：检查 20 个 JS/MJS 文件，并验证 93 个 manifest entries。
- 新开局只解锁 4 个技能。
- 新开局装备槽为 `mystic / guard / retreat / talkdown / null / null`。
- Day 1 render model 中只有 `home`、`store` 未锁定。
- Day 1 `openTravel park` 和直接 `travel park` 均被拦截。
- Day 2 主线仍可打开带 `allowLocked` 的 travel modal，避免旧主线地点锁软锁。
- 旧存档中的 `jab` 解锁和装备不会在 `migrateSave()` 中被删除。

## 风险

- Day 1 当前实际可开放地点只有 `home` / `store`，因为 `metro_station` 还没有数据实体；后续 Agent 03 接入地铁站内容后会自动进入默认开放规则。
- UI 目前只收到锁定字段，具体展示样式尚未接入。
- 主线 `allowLocked` 是兼容旧主线地点的保底方案，后续地铁站事件链接入后可以减少这种临时通行。

## 需要 Integrator 注意的冲突点

- `maws_src/content/data.js` 新增了 `LOC_UNLOCKS` / `INITIAL_SKILLS` 导出，后续内容 Agent 接地铁站或技能解锁时应复用它们。
- `maws_src/simulation/state.js` 新增并导出了 `isLocationUnlocked()` / `locationLockReason()` / `locationUnlockHint()`，后续事件和 UI 逻辑应优先使用这些 helper。
