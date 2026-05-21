# Skill Routing

## 推荐安装位置

```text
E:\TH比赛照片\.agents\skills\
```

## 推荐命令

```powershell
cd E:\TH比赛照片
git submodule add https://github.com/chasexu168340-rgb/codex-skills .agents/skills
git commit -m "chore: add codex skills submodule"
```

如果不使用 submodule：

```powershell
git clone https://github.com/chasexu168340-rgb/codex-skills E:\codex-skills
robocopy E:\codex-skills E:\TH比赛照片\.agents\skills /E
```

## Agent 与 Skill 映射

| Agent | 大类 | 主 Skill | 辅助 Skill |
|---|---|---|---|
| AGENT_A_PRODUCER_INTEGRATOR | 制作统筹/合并/取舍 | game-production-director | planning-with-files, git-integration, qa-gate |
| AGENT_B_GAMEPLAY_SYSTEMS | 数值/成长/地点锁/技能解锁 | game-systems-design | balance-design, data-driven-js, save-migration |
| AGENT_C_COMBAT_FEEL | 战斗读招/敌人 AI/手感 | combat-game-feel | combat-ai, phaser-vfx, player-feedback |
| AGENT_D_NARRATIVE_CONTENT | 主线/NPC/事件/文案 | narrative-design | branching-dialogue, bg3-comedic-writing, content-proposal |
| AGENT_E_UI_PRESENTATION | DOM UI/P5 风格/响应式 | ui-ux-presentation | p5-ui-style, responsive-web, dom-interaction |
| AGENT_F_TECH_QA_TOOLS | build/Playwright/脚本/QA | tech-qa-automation | playwright-smoke, build-check, asset-validation |
| AGENT_G_ASSET_WORLD | 资源/manifest/场景/美术接入 | asset-world-pipeline | phaser-assets, manifest-validation, art-direction |

## 通用 Skill 读取规则

每个 Agent prompt 都应包含：

```text
先尝试读取下列 skill：
- .agents/skills/<skill-name>/SKILL.md

如果不存在，不要停工。
在报告里记录 missing skill，然后按本 prompt 继续执行。
```
