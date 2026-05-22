# WAVE15_NPC_MEMORY_BANTER_PROPOSAL

你是 AGENT_D_NARRATIVE_CONTENT。

本轮只写第二段 proposal，不改运行代码。

## 允许修改
- docs/content_proposals/wave15_npc_memory_banter.md
- docs/workers/wave15_npc_memory_banter_proposal.md
- docs/agent_reports/AGENT_D_WAVE15_NPC_MEMORY_BANTER_PROPOSAL.md

## 禁止修改
- maws_src/
- assets/
- package.json

## 任务
设计 4 个 NPC 记忆点的最小实现方案：
1. 玩家用 `mystic` 打空。
2. 玩家靠 `wild_swing` 赢了菜鸡。
3. Day 5 没 KO 但 objective 通过。
4. 便利店尴尬事件。

每个记忆点给刘胖子/小满/梁教练至少一句后续吐槽。文案要接地气、有画面感，不要油腻网感。

输出时包含字段建议、flag 命名、触发时机、UI 呈现方式、验证建议。

## 验证
git diff --check

## 提交
完成后提交本分支，commit message:
`docs: propose wave15 npc memory banter`
