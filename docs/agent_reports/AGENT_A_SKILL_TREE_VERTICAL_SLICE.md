# AGENT_A Skill Tree Vertical Slice Report

## Result

已产出下一轮可直接实现的技能树首个切片方案。范围限定为 3 棵首批树、1 条邪道入口路线、4 类资源/门槛、下一轮实现文件和测试清单。

## Outputs

- `docs/design/SKILL_TREE_VERTICAL_SLICE.md`
- `docs/workers/skill_tree_vertical_slice.md`
- `docs/agent_reports/AGENT_A_SKILL_TREE_VERTICAL_SLICE.md`

## Included Design Requirements

- 资源：insight point、skill xp、relation gate、father memory gate。
- 首批树：Street Wild、Boxing Basics、Traditional Reforge。
- 每棵树 4 个节点，控制在 3-5 个节点范围内。
- 覆盖战斗行动槽/队列槽升级节点、combo node、passive node、替换野路子为正式技能的节点。
- 邪道路线首批节点：流量剪辑、规则谈判、证据留存、撤离胜利。
- 明确下一轮实现文件和测试项。

## Integration Notes For Next Round

- 优先数据驱动：节点定义在 content/data 层，state/combat/ui 读取同一份定义。
- UI 首轮建议用分组列表，不做复杂连线和图标资产。
- 技能效果首轮只接入最小 hook：槽位、combo unlock、action replacement、passive modifier。
- 邪道路线作为可选节点组，不默认改变玩家路线。

## Validation

- 本轮未改运行代码，按任务要求只需执行 `git diff --check`。
- 未运行 `npm run build`，因为没有修改 `maws_src/`、`assets/` 或 package 文件。

## Risk

- 下一轮实现如果现有 state 没有 relation/father memory 字段，需要先做轻量兼容默认值。
- Replacement 节点需要确认现有 action id 命名，避免 UI 显示名和 combat id 混用。
