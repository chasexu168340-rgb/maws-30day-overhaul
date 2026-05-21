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

# Agent 07 - Remote Friend Content Task

## 任务类型

远程朋友安全协作任务。只写内容，不改运行代码。

## Allowed Files

- `docs/content_proposals/friend_content_pack.md`
- `docs/agent_reports/AGENT_07_CONTENT_ONLY_FRIEND.md`

## 目标

让远程朋友可以帮忙写内容，而不会破坏代码。

## 输出要求

写 `docs/content_proposals/friend_content_pack.md`，包含：

1. 地铁站事件 3 个。
2. 便利店早期事件 3 个。
3. 公园误判胜利事件 3 个。
4. 技能解锁弹窗 8 条。
5. 道具文案 8 条。
6. 梁教练、刘胖子、小满、周青山各 5 句台词。
7. 文案风格：诙谐、有梗、有深度，不油腻。

## 禁止

- 不要改 `maws_src/`。
- 不要改 `package.json`。
- 不要改 assets。
