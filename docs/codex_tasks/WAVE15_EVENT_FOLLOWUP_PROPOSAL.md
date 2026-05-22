# WAVE15_EVENT_FOLLOWUP_PROPOSAL

你是 AGENT_B_GAMEPLAY_SYSTEMS + AGENT_D_NARRATIVE_CONTENT。

本轮只写第二段 proposal，不改运行代码。

## 允许修改
- docs/content_proposals/wave15_event_followup.md
- docs/workers/wave15_event_followup_proposal.md
- docs/agent_reports/AGENT_D_WAVE15_EVENT_FOLLOWUP_PROPOSAL.md

## 禁止修改
- maws_src/
- assets/
- package.json

## 任务
设计“事件二段跟进”的最小实现方案。

示例：复盘录像事件：
- 认真记下来：判断 +1，冷静 +1
- 剪成短视频：热度 +5，真实性 -1
- 发给刘胖子：关系 +1，获得吐槽

输出必须包含字段建议、rewardDeltas、daily gate、防刷规则、UI 反馈方式、测试建议。

## 验证
git diff --check

## 提交
完成后提交本分支，commit message:
`docs: propose wave15 event followups`
