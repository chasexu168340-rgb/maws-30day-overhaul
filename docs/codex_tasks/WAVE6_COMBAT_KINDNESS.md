# WAVE6_COMBAT_KINDNESS

你是 AGENT_C_COMBAT_FEEL。

本轮目标：让 Day 5 公园验货在 4 技能开局下不坐牢，但不送 jab/advance，不改 INITIAL_SKILLS。

## 必读

- AGENTS.md
- docs/TASK_HANDOFF.md
- docs/VALIDATION.md
- maws_src/simulation/combat.js
- maws_src/simulation/state.js
- maws_src/content/data.js 只读

## 允许修改

- maws_src/simulation/combat.js
- maws_src/simulation/state.js
- docs/workers/combat_kindness.md
- docs/agent_reports/AGENT_C_COMBAT_FEEL.md

## 禁止修改

- maws_src/content/data.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/assets/manifest.js
- assets/
- INITIAL_SKILLS
- 经济曲线
- 存档 key/version

## 任务

1. 给 Day 5 / E01 公园验货增加 objective-style 轻验货逻辑。
2. 不要求 KO。玩家完成以下任意 2 项即可视为“验货通过”：
   - 撑过第一个窗口。
   - 成功使用 guard 降低一次压力。
   - 成功 retreat 拉开一次距离。
   - 没有士气崩盘。
3. 失败也给复盘价值，结算提示“去拳馆学刺拳”。
4. E01 不削弱成菜鸡。
5. 不改全局战斗公式，只做 Day 5 / E01 的轻量目标判定和结算文案。

## 验证

```powershell
npm run check:full
git diff --check
```

## 输出

- docs/workers/combat_kindness.md
- docs/agent_reports/AGENT_C_COMBAT_FEEL.md
