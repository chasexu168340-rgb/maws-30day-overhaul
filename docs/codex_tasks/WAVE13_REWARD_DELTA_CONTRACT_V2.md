# WAVE13_REWARD_DELTA_CONTRACT_V2

你是 AGENT_B_GAMEPLAY_SYSTEMS，负责 Reward Delta Contract v2。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件；只在当前 worktree 完成、提交并推送本分支。

本地 skill：开工前读取这些文件，存在则读，不存在则跳过：`C:\Users\Administrator\.codex\skills\planning-with-files\SKILL.md`、`C:\Users\Administrator\.codex\skills\system-designer\SKILL.md`、`C:\Users\Administrator\.codex\skills\game-design\SKILL.md`。

## 必读

- `AGENTS.md`
- `docs/TASK_HANDOFF.md`
- `docs/FILE_MAP.md`
- `docs/TASK_PLAN.md`
- `maws_src/simulation/state.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`

## 允许修改

- `maws_src/simulation/state.js`
- `maws_src/simulation/economy.js`
- `maws_src/simulation/events.js`
- `docs/workers/reward_delta_contract_v2.md`
- `docs/agent_reports/AGENT_B_REWARD_DELTA_CONTRACT_V2.md`

## 禁止修改

- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/content/data.js`
- `maws_src/simulation/combat.js`
- `maws_src/assets/manifest.js`
- `assets/`
- `package.json`
- `INITIAL_SKILLS`
- 存档 key/version

## 目标

让所有行动、事件、训练、出行、战斗结算尽量输出结构化 `rewardDeltas`，UI 后续只读结构化字段，不再从长文案猜收益。

目标结构：

```js
{
  key: 'calm',
  label: '冷静',
  delta: 2,
  kind: 'gain',
  icon: '静',
  tone: 'good',
  priority: 20,
  source: 'action'
}
```

## 要求

1. 保持现有 `rewardDeltas` 向后兼容，补齐缺失字段，不改 UI。
2. `kind` 至少区分：`gain`、`cost`、`relation`、`skill`、`risk`、`time`、`item`、`money`。
3. 技能解锁 delta 只给短标签，例如 `学会 刺拳`，不要把来源/开放条件塞进 chip 字段。
4. 时间和体力消耗应是结构化 cost/time，而不是长句。
5. 不改战斗公式、不改经济曲线、不改剧情内容。

## 验证

- `npm run check:full`
- `npm run test:playtest`
- `git diff --check`

## 输出

- `docs/workers/reward_delta_contract_v2.md`
- `docs/agent_reports/AGENT_B_REWARD_DELTA_CONTRACT_V2.md`
- 提交并推送当前分支。
