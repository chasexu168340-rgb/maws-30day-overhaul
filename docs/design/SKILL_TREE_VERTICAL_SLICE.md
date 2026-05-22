# Skill Tree Vertical Slice

## Goal

下一轮只实现技能树首个可玩切片：玩家通过训练、战斗和剧情关系获得少量资源，解锁 3 棵首批树与 1 条邪道路线的入口节点。范围限定为数据驱动、可显示、可购买、可在战斗/训练中读到效果，不做完整大树、不改存档结构以外的必要字段。

## Resources And Gates

| Resource / Gate | 用途 | 首轮来源 | 实现要求 |
| --- | --- | --- | --- |
| insight point | 通用技能点，用于购买核心节点 | 每日结算、关键事件、父亲回忆节点奖励 | 存在于 player progression，UI 显示当前值 |
| skill xp | 树内经验，用于解锁该树节点 | 训练对应动作、战斗使用对应技能 | 按 tree id 记录，节点可配置 xp 门槛 |
| relation gate | 关系门槛，用于限制师承/拳馆/街头节点 | 现有 relation 或新增轻量 relationState 映射 | 节点配置 `relationGate: { target, min }` |
| father memory gate | 父亲回忆门槛，用于传统重铸线 | 剧情/回忆事件推进 | 节点配置 `fatherMemoryGate: minLevel` |

首轮资源数值只需支持整数。失败原因必须能被 UI 展示为短文案，例如“需要拳馆关系 2”“需要父亲回忆 1”。

## Tree Scope

### Street Wild

定位：早期野路子、生存、临场拼凑。首轮保留强可用性，但提供被正式技能替换的出口。

| Node Id | 类型 | 成本 / 门槛 | 效果 | 备注 |
| --- | --- | --- | --- | --- |
| `street_wild_entry` | passive | 1 insight point | 野路子行动命中后获得少量 skill xp | 初始可买 |
| `street_dirty_chain` | combo node | 1 insight point, Street Wild xp 20 | `野路子快打 -> 绊步` 形成 2 段 combo | 首个 combo 展示节点 |
| `street_queue_slot` | 战斗队列槽升级 | 2 insight point, Street Wild xp 35 | 战斗行动队列槽 +1 | 全局只允许首轮生效 1 次 |
| `street_exit_to_boxing` | 替换节点 | Boxing Basics xp 25, relation gate: boxing_gym >= 1 | 将默认 `wild_swing` 替换为 `boxing_jab` | 体现从野路子转正式 |

### Boxing Basics

定位：规范拳击基础，提供稳定行动、槽位、正式替换路线。

| Node Id | 类型 | 成本 / 门槛 | 效果 | 备注 |
| --- | --- | --- | --- | --- |
| `boxing_guard` | passive | 1 insight point, relation gate: boxing_gym >= 1 | 防守行动后下一次受击伤害小幅下降 | 不改公式时可先接入状态 modifier |
| `boxing_jab_cross` | combo node | 1 insight point, Boxing Basics xp 20 | `刺拳 -> 直拳` combo，成功后追加稳定值收益 | 首轮核心正式 combo |
| `boxing_action_slot` | 战斗行动槽升级 | 2 insight point, Boxing Basics xp 40 | 可装备战斗行动槽 +1 | 与队列槽分开显示 |
| `boxing_replace_wild_swing` | 替换节点 | 1 insight point, Boxing Basics xp 30 | `wild_swing` 被 `boxing_jab` 替换，保留原按钮位置 | 可与 Street Wild 出口共享 unlock flag |

### Traditional Reforge

定位：父亲记忆触发的传统武术重铸，不做玄学大树，只做一条可验证链。

| Node Id | 类型 | 成本 / 门槛 | 效果 | 备注 |
| --- | --- | --- | --- | --- |
| `reforge_memory_stance` | passive | father memory gate >= 1 | 训练传统动作时额外获得 Traditional Reforge xp | 首个父亲回忆门槛 |
| `reforge_root_step` | combo node | 1 insight point, Traditional Reforge xp 20 | `定步 -> 短打` combo | 需要父亲回忆 1 |
| `reforge_breath_slot` | 战斗队列槽升级 | 2 insight point, father memory gate >= 2 | 首回合行动队列预览 +1 | 若实现复杂，可降级为队列槽 +1 |
| `reforge_replace_street` | 替换节点 | Traditional Reforge xp 35, father memory gate >= 2 | 将 `street_trip` 替换为 `root_step` | 传统线替代野路子 |

## Evil Route First Nodes

邪道路线首轮只作为同一技能树系统的另一组节点，不做独立系统。

| Node Id | 名称 | 类型 | 成本 / 门槛 | 效果 |
| --- | --- | --- | --- | --- |
| `dark_clip_traffic` | 流量剪辑 | passive | 1 insight point | 赛后获得少量曝光或关系事件权重 |
| `dark_rule_talk` | 规则谈判 | passive | relation gate: organizer >= 1 | 战斗前有一次规则倾斜选项 |
| `dark_keep_evidence` | 证据留存 | passive | 1 insight point | 邪道事件失败时降低惩罚或保留反制标记 |
| `dark_extract_win` | 撤离胜利 | combo / outcome node | dark route xp 25 | 达成指定优势时可选择提前结算为小胜 |

邪道节点不得默认强制玩家进入邪道。UI 需要明确标识这是路线选择，且首轮只接入事件/战斗结果的轻量 hook。

## Data Shape Proposal

```js
{
  id: "boxing_jab_cross",
  treeId: "boxing_basics",
  name: "刺拳接直拳",
  kind: "combo",
  cost: { insight: 1, skillXp: { boxing_basics: 20 } },
  gates: {
    relation: [{ target: "boxing_gym", min: 1 }],
    fatherMemory: 0
  },
  effects: [
    { type: "unlock_combo", comboId: "jab_cross" }
  ],
  replaces: null
}
```

首轮实现时建议把技能树定义放在 `maws_src/content/data.js` 或同目录新数据导出中，由 state/combat/ui 读取。不要把节点效果硬编码进 DOM UI。

## Next Implementation Files

| File | 下一轮改动 |
| --- | --- |
| `maws_src/content/data.js` | 增加 3 棵树 + 邪道节点的数据定义、combo/replacement/effect ids |
| `maws_src/simulation/state.js` | 增加 skill progression 默认状态、购买节点、资源扣除、gate 检查 |
| `maws_src/simulation/combat.js` | 读取行动槽/队列槽、combo unlock、replacement unlock |
| `maws_src/dom/ui.js` | 增加技能树面板、节点状态、购买按钮、失败原因 |
| `maws_src/dom/ui.css` | 技能树网格/列表、gate 状态、移动端布局 |
| `maws_src/phaser/scenes/` | 如已有战斗演出读取 action id，只做最小展示同步 |

## Tests For Next Round

1. `npm run build`
2. 单元/脚本级检查：新建或扩展技能购买测试，覆盖 insight 不足、skill xp 不足、relation gate、father memory gate。
3. 浏览器 smoke：打开页面，进入技能树面板，购买可买节点，确认资源扣除和节点状态更新。
4. 战斗 smoke：购买行动槽/队列槽后进入战斗，确认槽位数量变化。
5. Combo smoke：购买 `boxing_jab_cross` 后使用对应行动，确认 combo 标记或收益触发。
6. Replacement smoke：购买正式技能替换节点后，确认 `wild_swing` 不再作为默认行动出现或已映射为 `boxing_jab`。
7. 响应式检查：桌面、平板、手机技能树无横向溢出，底部导航可见。

## Non Goals

- 不设计完整百节点大树。
- 不调整战斗公式、经济曲线、敌人数据或训练收益。
- 不接入新图片资产。
- 不做复杂动画、技能图标系统或长线存档迁移。
