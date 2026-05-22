# WAVE15_SKILL_TREE_SPEND

你是 AGENT_B_GAMEPLAY_SYSTEMS，负责 Progression Slice。

目标：让 Wave14 的技能树从“只能看”变成“能点一个小切片”，并让下一场战斗或训练产生可感知变化。

## 必读
- AGENTS.md
- docs/TASK_HANDOFF.md
- docs/FILE_MAP.md
- docs/VALIDATION.md
- maws_src/content/data.js
- maws_src/simulation/state.js

## 允许修改
- maws_src/content/data.js
- maws_src/simulation/state.js
- docs/workers/skill_tree_spend_v1.md
- docs/agent_reports/AGENT_B_SKILL_TREE_SPEND_V1.md

## 禁止修改
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/combat.js
- maws_src/simulation/events.js
- assets/
- package.json
- 存档 key/version
- INITIAL_SKILLS
- STARTER_EQUIP_SKILLS

## 任务
1. 增加 Insight 点数消耗和节点购买。
2. 支持节点前置、已解锁状态、不可购买原因。
3. 保持旧存档安全：没有字段时默认空数组/0，不改 save key/version。
4. 首批只做 6 个可购买节点：
   - Street Wild: 野路挥拳掌握：`wild_swing` 命中小幅提升。
   - Street Wild: 推搡抢距：`push_away -> retreat` 风险下降。
   - Boxing Basics: 刺拳入门：完成拳馆训练后可点，`jab` 初始熟练度/可用性小幅提升。
   - Boxing Basics: 抱架回收：`guard` 后下一招风险下降。
   - Traditional Reforge: 旧招拆解：`mystic` 风险降低一点，但仍不稳定。
   - Traditional Reforge: 铁布衫改写：`guard` 获得“呼吸稳定”反馈。
5. 不大改战斗公式。只输出小型结构化效果供 combat worker 或现有战斗读取，例如 `player.skillTreePerks` / `model.skillTree`.
6. 节点购买要产生结构化 rewardDeltas 或清晰 settlement feedback。
7. 不做完整技能树，不做完整 UI 重构。

## 设计约束
- Progress must feel earned, not gifted.
- 每个节点都必须有前置或点数成本。
- 节点效果必须可读、可验证、不会让 E01 变菜鸡。
- 不送正式 `jab/advance` 开局。

## 验证
npm run check:full
npm run test:playtest
git diff --check

## 输出
docs/workers/skill_tree_spend_v1.md
docs/agent_reports/AGENT_B_SKILL_TREE_SPEND_V1.md

## 提交
完成后提交本分支，commit message:
`feat: add skill tree spend slice`

不要 push；Manager pipeline 会统一 push/merge。
