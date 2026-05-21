# Skill Router

这个文件用于让 Codex 和协作 Agent 自动选择合适的 skill。开工时不需要用户记 skill 名；Agent 先按任务类型匹配本表，再声明本轮使用的 skill。

## 使用规则

- 用户点名的 skill 优先。
- 未点名时，按任务目标选择最多 4 个核心 skill，常规任务优先控制在 2-3 个。
- 如果任务跨多个类型，先选直接影响交付质量的 skill，再选验证 skill。
- 每轮修改前说明本轮使用哪些 skill，以及不使用哪些容易误触发的 skill。
- 每个 Batch 的 checkpoint 记录实际使用的 skill。
- 本项目当前是 Phaser + DOM，不默认使用 Godot 系列 skill。

## 路由表

| 任务类型 | 默认 skill | 备注 |
| --- | --- | --- |
| 战斗循环、半即时、敌人行为、技能手感 | `game-design-core`, `combat-design`, `game-studio:phaser-2d-game`, `game-studio:game-playtest` | 先判断核心循环和可读性，再改 Phaser/DOM 接口，最后做战斗回归。 |
| UI、HUD、菜单、响应式、遮挡问题 | `game-studio:game-ui-frontend`, `frontend`, `ui-design`, `playwright` | UI 以 DOM 为主；必须注意手机端横向溢出、文字遮挡和按钮可点。 |
| 精灵图、角色动画、VFX、资产接入 | `imagegen`, `game-studio:sprite-pipeline`, `ai-game-art-generation`, `art-consistency` | 如任务更偏特效，把 `art-consistency` 替换为 `vfx-realtime`。 |
| 数值、训练收益、成长曲线、经济循环 | `game-design-core`, `progression-systems`, `consistency-checker`, `testing-automation` | 不直接改数值；先说明目标体验、影响面和验证方式。 |
| 主线、事件、NPC 文案、世界观 | `storytelling`, `narrative-design`, `worldbuilding`, `technical-writer` | 文案要自然、有反馈感，并且不能脱离机制。 |
| QA、截图、浏览器 smoke、回归测试 | `game-studio:game-playtest`, `playwright`, `test-strategist` | Web demo 至少验证页面打开、无 runtime error、核心按钮可点、状态能推进。 |
| GitHub 协作、分支、提交、PR | `github:github`, `github:yeet`, `technical-writer` | 提交前先看 `git status`，不要把无关未追踪文件混进提交。 |
| 文档、协作规则、checkpoint | `technical-writer`, `consistency-checker` | 文档要短、可执行、放在仓库里，避免和现有 checkpoint 冲突。 |

## 排除规则

- 不默认使用 `godot-*`、`gdscript-*`、`csharp-godot`、`scene-organization`、`resource-pattern` 等 Godot skill。
- 不因为装了某个 skill 就扩大任务范围；skill 只用于指导当前任务。
- 单轮不要堆超过 4 个核心 skill，避免建议互相冲突。
- 如果 skill 建议和 `AGENTS.md` 冲突，以 `AGENTS.md` 和用户当前要求为准。

## 声明模板

开工更新可使用下面格式：

> 本轮使用 `skill-a`、`skill-b`，因为任务涉及 X 和 Y；不使用 `skill-c`，因为当前项目不是对应技术栈。本轮只做 A，不做 B。

checkpoint 记录可使用下面格式：

> 本轮实际使用 skill：`skill-a`、`skill-b`。未使用 Godot skill，因为项目当前为 Phaser + DOM。
