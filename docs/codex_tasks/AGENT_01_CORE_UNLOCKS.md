# Common Codex Worker Contract

你是《了不起的武术模拟器》重铸优化任务的一个 Codex worker。

## 必读文件

只读这些启动文件：

1. `AGENTS.md`
2. `docs/CODEX_CONTEXT.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

然后按本任务的 Allowed Files 读取最小源码集。

## 全局规则

- 不要问用户问题。
- 不要扩大任务。
- 不要重构架构。
- 不要修改未列入 Allowed Files 的文件。
- 不要改存档 key/version，除非任务明确要求。
- 不要删除已有功能。
- 改完必须运行 `npm run build`。
- 必须写报告：`docs/agent_reports/<AGENT_NAME>.md`。
- 做不完时，必须写 `.codex/NEXT_PROMPT.md` 和 `.codex/HANDOFF.md`，不要硬撑。
- 做完时，必须写 `.codex/DONE.md`。
- 每次停止前必须让工作区处于可理解状态。

## 上下文耗尽处理

当你感觉任务过长、文件太多、或上下文接近不稳定时：

1. 停止继续大改。
2. 写 `.codex/HANDOFF.md`，说明：
   - 已读文件。
   - 已改文件。
   - 已完成内容。
   - 未完成内容。
   - 下一步具体命令。
3. 写 `.codex/NEXT_PROMPT.md`，内容是下一轮 Codex 应继续执行的完整指令。
4. 不写 `.codex/DONE.md`。

外层脚本会用 `.codex/NEXT_PROMPT.md` 启动新的 Codex 进程。

# Agent 01 - Core Unlock Foundation

## 任务类型

核心基础任务。先跑，其他 Agent 等你完成后再开始。

## Allowed Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`

## 目标

实现“前期地点不全开放 + 初始技能缩减”的基础设施。

## 具体要求

1. 新增地点开放规则，建议命名 `LOC_UNLOCKS` 或等价结构。
2. Day 1 只开放：
   - `home`
   - `store`
   - `metro_station` 若数据已存在；若不存在，先不要完整实现地铁内容，只预留锁点逻辑。
3. 逐步开放：
   - Day 3 `park`
   - Day 4 `worksite`
   - Day 9 `boxing` / `physio`
   - Day 10 `gym`
   - Day 13 `wuguan`
   - Day 16 `mma`
   - Day 18 `street`
   - Day 20 `sanda_gym`
   - Day 22 `karate_dojo`
   - Day 24 `taekwondo_club`
4. `buildRenderModel()` 输出地点锁定原因和开放提示。
5. 新开局初始技能缩减为：
   - `mystic`
   - `guard`
   - `retreat`
   - `talkdown`
6. `equipSkills` 改成：
   - `['mystic', 'guard', 'retreat', 'talkdown', null, null]`
7. `jab / straight / dodge / palm / offbalance / sprawl / escape / dirtyescape / sanda_* / karate_* / tkd_*` 不应开局解锁。
8. 旧存档迁移不能坏。旧存档已有技能不要强删，只给新开局生效。
9. 行动卡如果需要未解锁技能，应显示为不可用或仍允许训练但先解锁，不要报错。

## 验收

- `npm run build` 通过。
- 新开局只有 4 个技能。
- 地图中未开放地点不能直接前往。
- 旧存档仍能读。
- 写 `docs/agent_reports/AGENT_01_CORE_UNLOCKS.md`。
- 写 `.codex/DONE.md`。
