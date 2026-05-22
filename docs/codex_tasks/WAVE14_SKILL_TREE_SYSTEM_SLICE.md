# WAVE14_SKILL_TREE_SYSTEM_SLICE

你是 AGENT_B_GAMEPLAY_SYSTEMS。

目标：实装技能树第一片系统，只做最小可玩切片，不做完整大树。

## 允许修改
- maws_src/content/data.js
- maws_src/simulation/state.js
- docs/workers/skill_tree_system_slice.md
- docs/agent_reports/AGENT_B_SKILL_TREE_SYSTEM_SLICE.md

## 禁止修改
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- assets/
- package.json
- 存档 key/version

## 任务
1. 新增数据结构 SKILL_TREE_NODES 或等价结构。
2. 首批只做三棵树：Street Wild、Boxing Basics、Traditional Reforge。
3. 每棵树 3 个节点左右。
4. 必须包含：wild_swing mastery/passive node、push_away utility node、boxing jab unlock/boost node、traditional mystic/guard rewrite node、future queue slot node 只标 locked/future。
5. 增加 player.skillPoints 或 insightPoints，旧存档安全默认 0。
6. 通过训练、复盘、主线轻量获得 insight。
7. buildRenderModel 输出 skillTree。
8. 不做 UI，UI 下一分支读取。

## 验证
npm run check:full
npm run test:playtest
git diff --check

## 输出
docs/workers/skill_tree_system_slice.md
docs/agent_reports/AGENT_B_SKILL_TREE_SYSTEM_SLICE.md

## 提交
完成后提交本分支，commit message:
`feat: add skill tree system slice`

不要 push；Manager pipeline 会统一 push/merge。
