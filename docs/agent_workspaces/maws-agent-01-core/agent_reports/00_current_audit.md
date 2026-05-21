# Agent 00 Report

## 做了什么

- 按重铸优化计划 Phase 0 做当前版本审计。
- 确认 baseline build 可通过。
- 导出当前新档默认地点、技能、装备技能和主线节点现状。
- 记录本轮进入 Phase 1 前必须注意的差距。

## 改了哪些文件

- `docs/agent_reports/00_current_audit.md`
- `docs/TASK_PLAN.md`

## 没做什么

- 未修改运行代码。
- 未创建 Git worktree。
- 未启动多 Agent。
- 未改玩法数值、战斗公式、经济曲线、敌人数据、存档 key/version 或资产结构。

## 当前分支和工作区

- 当前分支：`codex/update-project-state...origin/codex/update-project-state`
- 未跟踪目录：`MAWS_重铸优化_多Agent工作开发书_v0.3_打包/`

## 当前可用地点列表

当前 `LOCS` / render model 中有 13 个地点，暂无 `metro_station`：

- `home`：出租屋
- `store`：便利店
- `worksite`：工地临工点
- `park`：公园
- `boxing`：拳馆
- `wuguan`：武馆
- `mma`：MMA馆
- `sanda_gym`：散打馆
- `karate_dojo`：空手道道场
- `taekwondo_club`：跆拳道社
- `gym`：社区健身房
- `physio`：理疗店
- `street`：旧城区

当前 render model 的地点项只有 `active` 等基础字段，未输出 `locked / lockReason`。

## 当前新档技能状态

新档 Day 1 默认位置：`home`。

当前默认解锁 9 个技能：

- `jab`
- `straight`
- `guard`
- `dodge`
- `advance`
- `retreat`
- `dirtyescape`
- `talkdown`
- `mystic`

当前默认装备：

- `jab`
- `straight`
- `guard`
- `dodge`
- `advance`
- `retreat`

当前技能总表有 24 个技能；未解锁技能包括低扫、前踢、抓把、抱摔、防摔、侧压控制、地面脱身、掌根短击、破平衡，以及散打、空手道、跆拳道扩展技能。

## 当前主线节点列表

- Day 1：给父亲上香，`home`
- Day 2：地铁见义勇为，当前挂在 `street`
- Day 3：便利店货架事件，`store`
- Day 5：公园第一次验货，`park`
- Day 8：一阵风，`boxing`
- Day 9：父亲日记，`home`
- Day 12：阿豹刷到你了，`park`
- Day 18：便利店门口的三个人，`store`
- Day 20：散打馆的三段连击，`sanda_gym`
- Day 21：道场里的第一拳，`karate_dojo`
- Day 22：跆拳道社的距离课，`taekwondo_club`
- Day 24：MMA开放垫子，`mma`
- Day 29：烧烤摊夜谈，`street`
- Day 30：真东西测试，`boxing`

## 运行了什么验证

```powershell
npm run build
```

## 验证结果

- 通过。
- build 检查 20 个 JavaScript / MJS 文件。
- asset check 验证 93 个 manifest entries across 9 required groups。

## 风险

- `metro_station` 尚不存在，Phase 1 新增地点时要同时处理地图位置和行动入口。
- 当前新档初始技能明显多于重铸计划建议的 4 个，Phase 1 修改时必须保护旧存档，不要在 `migrateSave()` 中删旧玩家技能。
- 当前没有地点锁 render model，UI Phase 2 需要等核心锁定字段稳定后再做。
- Day 2 “地铁见义勇为”当前 loc 是 `street`，接入地铁站时要避免主线被地点锁挡住。

## 需要 Integrator 注意的冲突点

- `maws_src/content/data.js` 和 `maws_src/simulation/state.js` 是 Phase 1 的核心冲突文件，应由一个核心任务串行修改。
- UI 分支不应提前改 `data.js` / `state.js`。
- 内容 proposal 可以先落到 `docs/content_proposals/`，等核心锁定结构合并后再接代码。
