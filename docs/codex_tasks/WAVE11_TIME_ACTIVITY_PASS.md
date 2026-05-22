# WAVE11_TIME_ACTIVITY_PASS

你是 AGENT_B_GAMEPLAY_SYSTEMS。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：把 Time Dosage 从“倍率原型”调成“玩家想在地点里多待一会”的节奏系统。

## 允许修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/economy.js
- maws_src/simulation/events.js
- docs/workers/time_activity_pass.md
- docs/agent_reports/AGENT_B_TIME_ACTIVITY_PASS.md

## 禁止修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- assets/
- package.json
- INITIAL_SKILLS
- 存档 key/version

## 任务

1. 调整投入选项：
   - 30m 短练：更适合塞日程，不要感觉亏。
   - 60m 标准：默认稳定。
   - 90m 深练：有效但疲劳明显。
   - 120m 硬练：不应该常用，要有清楚风险。
2. 增加或调优“微行动”：
   - 发呆/放空
   - 看笔记
   - 刷短视频
   - 给朋友发消息/打电话
   - 简单拉伸
3. 微行动要消耗少量时间，给少量反馈，不能成为最优刷资源。
4. 每天可做事变多，但主线锚点不被稀释。
5. 事件机会卡不要无限刷，用冷却和推荐上限管住。
6. 如果连续做同类训练，收益递减或疲劳上升。

## 验证

npm run check:full
npm run test:playtest
git diff --check

## 输出

- docs/workers/time_activity_pass.md
- docs/agent_reports/AGENT_B_TIME_ACTIVITY_PASS.md
