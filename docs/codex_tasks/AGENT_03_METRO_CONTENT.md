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

# Agent 03 - Metro Station Implementation

## 任务类型

地铁站内容实现任务。只改 `data.js`，不碰 `state.js` / UI / 战斗，避免和 Agent 01 / 02 / 04 冲突。

## Allowed Files

- `maws_src/content/data.js`
- `docs/agent_reports/AGENT_03_METRO_CONTENT.md`
- `docs/TASK_PLAN.md`

## 目标

实现 `metro_station` 地点，不只写 proposal。Agent 01 已经接入地点锁基础，`LOC_UNLOCKS.metro_station` 已预留为默认开放。

## 具体要求

1. 新增 `LOCS.metro_station`。
2. 新增 `LOC_POS.metro_station`。
3. 新增 `ACTIONS.metro_station`，至少 4 个行动：
   - `metro_observe`
   - `metro_short_video`
   - `metro_shadow_step`
   - `metro_line_rumor`
4. 行动收益只使用已有 gain 字段，避免改 `economy.js`。
5. 需要文案自然、有城市感，不要翻译腔，不要油腻网感。
6. 可以把 Day 2 主线 loc 从 `street` 迁移到 `metro_station`，但只限 `data.js` 内已有主线数据。
7. 不新增图片、manifest 或资产结构。

## 禁止

- 不改 `state.js`。
- 不改 `ui.js` / `ui.css`。
- 不改 `combat.js`。
- 不改 `economy.js`。
- 不改存档 key/version。
- 不新增资产文件。

## 验收

- `npm run build` 通过。
- 新档 render model 里能看到 `metro_station` 且 Day 1 不锁定。
- `ACTIONS.metro_station` 至少 4 个行动。
- 写 `docs/agent_reports/AGENT_03_METRO_CONTENT.md`。
- 写 `.codex/DONE.md`。
