# WAVE10_TIME_DOSAGE_PROTOTYPE

你是 AGENT_B_GAMEPLAY_SYSTEMS + AGENT_E_UI_PRESENTATION。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：让玩家可以选择在一个地方待多久、训练投入多少时间。更多时间可获得更多收益，但有疲劳、递减和错过成本。

## 允许修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/economy.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/time_dosage_prototype.md
- docs/agent_reports/AGENT_B_TIME_DOSAGE_PROTOTYPE.md

## 禁止修改

- maws_src/simulation/combat.js
- maws_src/assets/manifest.js
- assets/
- INITIAL_SKILLS
- 存档 key/version

## 任务

1. 为训练/工作/观察类行动增加投入选项：
   - 短练 30m：低收益低疲劳
   - 标准 60m：默认收益
   - 深练 90m：高收益高疲劳
   - 硬练 120m：收益递减，伤病/疲劳风险
2. 允许“发呆/放空”消耗时间：
   - 恢复 calm/士气少量
   - 有概率触发父亲记忆/日记自省/朋友消息
   - 不应成为刷资源最优解
3. UI 上 action 点击后，如果有 duration options，先弹出小选择框。
4. 训练收益按 multiplier 缩放，但不要大改经济曲线。
5. 每天可做事的感觉要变多：增加微行动和短行动，而不是无限刷。
6. 注意和现有分钟制兼容。

## 验证

npm run check:full
npm run test:playtest
git diff --check

## 输出

docs/workers/time_dosage_prototype.md
docs/agent_reports/AGENT_B_TIME_DOSAGE_PROTOTYPE.md
