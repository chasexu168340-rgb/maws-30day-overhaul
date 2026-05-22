# WAVE10_SKILL_TREE_ALT_ROUTES_MASTERPLAN

你是 AGENT_A_PRODUCER_INTEGRATOR + AGENT_B_GAMEPLAY_SYSTEMS + AGENT_D_NARRATIVE_CONTENT。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

本轮只写 masterplan，不改运行代码。

## 允许修改

- docs/design/SKILL_TREE_AND_ALT_ROUTES.md
- docs/workers/skill_tree_alt_routes_masterplan.md
- docs/agent_reports/AGENT_A_SKILL_TREE_ALT_ROUTES.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

写一份可执行设计方案，包含：

1. 技能树系统：
   - Boxing 基础树
   - Traditional Reforge 树
   - Grappling/MMA 树
   - Street Survival 树
   - Conditioning 树
   - Social/Media 邪道树
2. 每个树至少列：
   - 3 个 Tier
   - active skill
   - passive perk
   - combo node
   - unlock cost
   - prerequisite
3. 成长资源：
   - insight points / skill XP / relation unlock / father memory 等如何获得
4. Punch Club 风格：
   - 训练影响身体和技能成长
   - 不同路线有代价
5. 仁王风格：
   - 技能点解锁连段和派生，不只是数值加成
6. BG3/大侠立志传式邪道路线：
   - 不练功也能靠规则、关系、流量、装备、谈判、撤离和证据达成目标
   - 每条邪道路线有代价，不是免费通关
7. Day 30 目标制如何支持非练功路线。

## 验证

git diff --check

## 输出

docs/design/SKILL_TREE_AND_ALT_ROUTES.md
docs/workers/skill_tree_alt_routes_masterplan.md
docs/agent_reports/AGENT_A_SKILL_TREE_ALT_ROUTES.md
