# WAVE5_ASSET_METRO_RUNTIME

你是 AGENT_G_ASSET_WORLD。

本轮只做地铁站 runtime 背景映射。

## 必读

1. AGENTS.md
2. docs/TASK_HANDOFF.md
3. docs/VALIDATION.md
4. docs/agent_reports/AGENT_G_ASSET_WORLD.md
5. maws_src/simulation/state.js
6. maws_src/phaser/scenes/ShellScene.js

## 目标

把 metro_station 运行时背景接到已有 manifest fallback key：

- metro_station day -> bg.metro_station.day
- metro_station night -> bg.metro_station.night

## 允许修改

- maws_src/simulation/state.js
- maws_src/phaser/scenes/ShellScene.js
- docs/workers/asset_metro_runtime.md
- docs/agent_reports/AGENT_G_ASSET_WORLD.md

## 禁止修改

- maws_src/content/data.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- maws_src/assets/manifest.js
- assets/
- docs/TASK_HANDOFF.md
- docs/SPRINT_BOARD.md
- docs/TASK_PLAN.md

## 具体要求

1. 检查 DOM 场景背景使用的 helper，例如 locationBackgroundKey 或同等函数。
2. 检查 Phaser ShellScene 的 BG_BY_LOC。
3. 给 metro_station 接入 day/night fallback key。
4. 不新增图片，不改 manifest，不改资产。
5. 报告里明确说明这仍然是 fallback，不是最终地铁站美术。

## 验证

运行：

```powershell
npm run build
node maws_src/tools/verify_assets.mjs
git diff --check
```

如果可以，也运行：

```powershell
npm run test:smoke
```

## 输出

写：

docs/workers/asset_metro_runtime.md

格式：

Worker:
Branch:
Task:
Changed files:
Validation:
Risks:
Ready for merge:
Next:
