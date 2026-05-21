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

# Agent 04 - Skill Unlock Chain Proposal

## 任务类型

内容与系统提案任务。默认先写 proposal，不直接改核心源码。

## Allowed Files

- `docs/content_proposals/skill_unlock_chain.md`
- `docs/agent_reports/AGENT_04_SKILL_UNLOCKS.md`
- `docs/TASK_PLAN.md`

## 目标

设计“技能逐步解锁链”，让陆小闲从少技能开局逐步成长。

## 输出要求

写 `docs/content_proposals/skill_unlock_chain.md`，包含：

1. 每个技能的解锁来源：
   - `dodge`
   - `jab`
   - `straight`
   - `palm`
   - `offbalance`
   - `sprawl`
   - `escape`
   - `dirtyescape`
   - `sanda_whip_kick`
   - `sanda_catch_throw`
   - `karate_reverse_punch`
   - `karate_front_kick`
   - `tkd_roundhouse`
   - `tkd_back_kick`
2. 每个解锁对应地点、行动、NPC 或主线条件。
3. 解锁弹窗文案。
4. 与 `MAW_FORMS` 和 `maw.modules` 的对应关系。
5. 旧存档迁移规则：旧存档不强删，新开局严格锁。
6. 技能页未学会状态展示建议。

## 禁止

- 不要直接改 `data.js`。
- 不要直接改 `state.js`。
- 不要改战斗公式。

## 验收

- proposal 文件完整。
- 写 `.codex/DONE.md`。
