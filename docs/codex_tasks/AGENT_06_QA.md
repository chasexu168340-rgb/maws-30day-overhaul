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

# Agent 06 - QA Regression

## 任务类型

QA 任务。可以在其他 Agent 完成后执行。

## Allowed Files

- `docs/agent_reports/AGENT_06_QA.md`
- `docs/TASK_PLAN.md`

## 目标

验证重铸优化没有破坏现有闭环。

## 验证清单

1. `npm run build`
2. 新开局。
3. 初始技能数量。
4. 地点锁定状态。
5. 出租屋、便利店、地铁站可用。
6. 未开放地点不可出行。
7. Day 3 或手动状态下公园开放。
8. 保存/读档。
9. E01/E06/E07/E18 自检入口，如果 debug tab 仍可用。
10. 390x844 / 900x700 / 1365x768 不横向溢出。

## 输出

写 `docs/agent_reports/AGENT_06_QA.md`：

- 通过项。
- 失败项。
- 截图路径。
- 建议修复优先级。
- 是否允许合并。

若发现错误，不要修代码，除非是文档 typo。
