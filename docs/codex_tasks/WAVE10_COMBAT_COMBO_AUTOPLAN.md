# WAVE10_COMBAT_COMBO_AUTOPLAN

你是 AGENT_C_COMBAT_FEEL。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：给战斗加入“队列连段爽感”和“自动战斗策略雏形”，不大改公式。

## 允许修改

- maws_src/simulation/combat.js
- docs/workers/combat_combo_autoplan.md
- docs/agent_reports/AGENT_C_COMBAT_COMBO_AUTOPLAN.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/
- INITIAL_SKILLS
- 经济曲线
- 存档 key/version

## 任务

1. 在 combat.js 内部加入轻量 COMBO_RULES：
   - wild_swing/push_away 或 jab/straight 的 1-2 节奏。
   - guard -> strike 的防反 bonus。
   - retreat -> strike 的拉开再点 bonus。
   - talkdown -> retreat 的撤离/降温 bonus。
2. Combo bonus 只影响当前窗口：
   - 命中 +小量
   - 风险 -小量
   - 体力返还小量
   - 额外日志/FX
3. 不新增 UI，先通过 combat steps/log 显示“连段触发”。
4. 自动战斗策略雏形：
   - 如果 combat 没有玩家队列，可按 selected/equipSkills 推一个安全默认队列。
   - 或增加内部 helper `suggestCombatQueue(combat)`，先只用于报告/日志，不强制替玩家玩。
5. 不复制公式，不改基础伤害公式。

## 验证

npm run check:full
git diff --check

## 输出

docs/workers/combat_combo_autoplan.md
docs/agent_reports/AGENT_C_COMBAT_COMBO_AUTOPLAN.md
