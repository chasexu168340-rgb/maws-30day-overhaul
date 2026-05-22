# WAVE11_SKILL_TREE_VERTICAL_SLICE

你是 AGENT_A_PRODUCER_INTEGRATOR + AGENT_B_GAMEPLAY_SYSTEMS。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

本轮只写技能树首个可实现切片方案，不改代码。

## 允许修改

- docs/design/SKILL_TREE_VERTICAL_SLICE.md
- docs/workers/skill_tree_vertical_slice.md
- docs/agent_reports/AGENT_A_SKILL_TREE_VERTICAL_SLICE.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

写一个“下一轮可直接实现”的技能树切片，不要全量大树。

必须包含：

1. 资源：
   - insight point
   - skill xp
   - relation gate
   - father memory gate
2. 首批树：
   - Street Wild
   - Boxing Basics
   - Traditional Reforge
3. 每棵树 3-5 个节点即可。
4. 至少包含：
   - 战斗行动槽/队列槽升级节点
   - combo node
   - passive node
   - 替换野路子为正式技能的节点
5. 邪道路线首批节点：
   - 流量剪辑
   - 规则谈判
   - 证据留存
   - 撤离胜利
6. 明确下一轮实现文件和测试。

## 验证

git diff --check

## 输出

- docs/design/SKILL_TREE_VERTICAL_SLICE.md
- docs/workers/skill_tree_vertical_slice.md
- docs/agent_reports/AGENT_A_SKILL_TREE_VERTICAL_SLICE.md
