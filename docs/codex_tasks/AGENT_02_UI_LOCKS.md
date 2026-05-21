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

# Agent 02 - UI Locks And Skill Source Display

## 任务类型

UI 任务。建议在 Agent 01 合并后执行。

## Allowed Files

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/AGENT_02_UI_LOCKS.md`

## 目标

让玩家清楚看到：哪些地点暂未开放、为什么未开放、技能从哪里学。

## 具体要求

1. 地图地点卡显示：
   - 已开放。
   - 暂未开放。
   - 开放条件，例如“第 9 天后开放”或“完成父亲日记后开放”。
2. 暂未开放地点按钮不可点击，点击只 toast，不弹出 travel。
3. 技能页对未学会技能显示：
   - 未学会。
   - 来源地点。
   - 推荐行动。
4. 已学会技能显示熟练度和已装备状态。
5. 手机端不能横向溢出。
6. 不要改战斗公式、数据值、存档。

## 验收

- `npm run build` 通过。
- 390x844 不横向溢出。
- 写 `docs/agent_reports/AGENT_02_UI_LOCKS.md`。
- 写 `.codex/DONE.md`。
