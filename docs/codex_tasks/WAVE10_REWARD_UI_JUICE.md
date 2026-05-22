# WAVE10_REWARD_UI_JUICE

你是 AGENT_E_UI_PRESENTATION。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：玩家获得收益时要爽。收益数字、资源变化、技能学习、关系变化都要像游戏反馈，而不是沉在结算列表里。

## 允许修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/reward_ui_juice.md
- docs/agent_reports/AGENT_E_REWARD_UI_JUICE.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- assets/
- package.json

## 任务

1. 增加收益视觉层：
   - 资源 +数字 chips，例如 现金 +20、冷静 +2、误判 +3。
   - skill learned 要突出。
   - relationship gain 要突出。
2. 小事件用小结果框，不要所有事件都用大 modal。
3. result-feedback modal 默认只显示：
   - 一句话结果
   - 3-5 个收益 chips
   - 继续/下一步按钮
   详细结算折叠。
4. 普通 toast 不够，用轻量 gain burst 或 reward stack。
5. 不改状态层；尽量从现有 modal.lines / settlementLines / summaryChips 中解析展示。

## 验证

npm run check:full
git diff --check

## 输出

docs/workers/reward_ui_juice.md
docs/agent_reports/AGENT_E_REWARD_UI_JUICE.md
