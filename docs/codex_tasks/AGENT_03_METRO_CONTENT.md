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

# Agent 03 - Metro Station Content Proposal

## 任务类型

内容提案任务。默认不要直接改核心源码，避免和 Agent 01 / 04 冲突。

## Allowed Files

- `docs/content_proposals/metro_station.md`
- `docs/agent_reports/AGENT_03_METRO_CONTENT.md`
- `docs/TASK_PLAN.md`

## 目标

设计“地铁站”作为可进入早期地点的内容提案。

## 输出要求

写 `docs/content_proposals/metro_station.md`，包含：

1. `LOCS.metro_station` 数据草案。
2. `LOC_POS.metro_station` 坐标建议。
3. `ACTIONS.metro_station` 三到五个行动：
   - 观察通勤人流。
   - 刷短视频打假。
   - 站台步法小练。
   - Day 2 误判胜利事件入口。
4. 与 `maw.misread`、`heat`、`jud`、`street` 的收益关系。
5. 主线 Day 2 如何迁移到地铁站。
6. 文案风格：好笑，但不要太油。
7. 资源需求：能先复用城市/街区背景，不强制新图。

## 禁止

- 不要直接改 `data.js`。
- 不要直接改 `state.js`。
- 不要新增资产文件。

## 验收

- proposal 文件完整。
- `npm run build` 可跳过，因为未改运行代码；但最终报告要写明。
- 写 `.codex/DONE.md`。
