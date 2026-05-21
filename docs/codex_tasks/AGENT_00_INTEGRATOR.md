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

# Agent 00 - Integrator

## 任务

你是整合负责人。你的任务不是从零设计，而是把其他 Agent 的结果安全合并到 staging。

## Allowed Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/events.js`
- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/assets/manifest.js`
- `docs/TASK_PLAN.md`
- `docs/agent_reports/**`
- `docs/content_proposals/**`

## 目标

1. 阅读 `docs/agent_reports/` 与 `docs/content_proposals/`。
2. 只整合已经通过 build 或明确为 proposal 的内容。
3. 优先整合顺序：
   - 地点锁和初始技能缩减。
   - UI 锁点展示。
   - 地铁站内容。
   - 技能解锁链。
   - 早期战斗手感。
4. 每整合一块就运行 `npm run build`。
5. 最后写 `docs/agent_reports/AGENT_00_INTEGRATOR.md`。

## 禁止

- 不要重做系统。
- 不要改无关数值。
- 不要无脑接受所有 proposal。
- 不要在 build 失败时继续叠更多修改。
