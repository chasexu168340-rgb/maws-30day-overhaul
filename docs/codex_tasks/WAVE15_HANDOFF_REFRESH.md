# WAVE15_HANDOFF_REFRESH

你是 AGENT_A_PRODUCER_INTEGRATOR。

本轮只刷新当前 checkpoint，不改游戏运行代码。

## 允许修改
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md
- docs/SPRINT_BOARD.md
- docs/workers/wave15_handoff_refresh.md
- docs/agent_reports/AGENT_A_WAVE15_HANDOFF_REFRESH.md

## 禁止修改
- maws_src/
- assets/
- package.json

## 目标
把当前目标从 Wave14 Playable Loop Slice 更新为 Wave15 Addiction Loop Slice。

## 必须记录
1. 当前 staging 已有：
   - Wave14 QA passed。
   - NPC 菜单已有部分真实小行动。
   - 技能树已有展示/读取切片，但还不能购买。
   - 战斗 plan mode 已可见可点。
   - wave14_loop smoke 已覆盖 NPC 行动、reward chips、技能树、plan mode、移动端时间弹窗。
2. Wave15 第一段目标：
   - 技能树从“看”变成“点”。
   - 战斗 plan mode 变成战术配方并给人话反馈。
   - 第一段 QA 后再决定是否进入 NPC 记忆 / 事件二段 / 邪道路线实现。
3. Ready Tasks：
   - TREE-SPEND-001
   - COMBAT-RECIPE-001
   - LOOP-SMOKE-015
   - QA-015
4. QA 必须最后跑。

## 验证
git diff --check

## 输出
docs/workers/wave15_handoff_refresh.md
docs/agent_reports/AGENT_A_WAVE15_HANDOFF_REFRESH.md

## 提交
完成后提交本分支，commit message:
`docs: refresh wave15 addiction loop handoff`

不要 push；Manager pipeline 会统一 push/merge。
