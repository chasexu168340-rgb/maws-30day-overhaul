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

# Agent 05 - Early Combat Feel Proposal

## 任务类型

战斗手感提案。默认先写 proposal，避免和核心 Agent 冲突。

## Allowed Files

- `docs/content_proposals/early_combat_feel.md`
- `docs/agent_reports/AGENT_05_EARLY_COMBAT.md`
- `docs/TASK_PLAN.md`

## 目标

在初始技能减少后，让 Day 1-Day 8 的战斗仍然好玩。

## 输出要求

写 `docs/content_proposals/early_combat_feel.md`，包含：

1. 只会 `mystic / guard / retreat / talkdown` 时，玩家怎么打。
2. Day 5 公园验货如何避免变成无聊防守。
3. Day 8 一阵风如何保留一个可操作窗口。
4. 低技能状态下敌人难度建议。
5. 战斗日志文案：
   - 看见拳。
   - 没躲开。
   - 有一点进步。
6. 战后复盘如何解锁 `jab` 或推进 `开山拳新注`。
7. 不改公式，仅给行为和文案建议。

## 禁止

- 不要直接改 `combat.js`。
- 不要直接改 `state.js`。
- 不要调数值。

## 验收

- proposal 文件完整。
- 写 `.codex/DONE.md`。
