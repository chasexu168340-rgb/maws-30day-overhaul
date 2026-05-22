# Worker Brief: Skill Tree Vertical Slice

## Scope

下一轮实现首个技能树可玩切片，不做全量系统。目标是让玩家能看见节点、满足/不满足 gate、购买节点，并让至少一部分效果进入训练或战斗。

## Required Resources

- insight point：通用购买资源。
- skill xp：按树记录的经验，例如 `street_wild`、`boxing_basics`、`traditional_reforge`、`dark_route`。
- relation gate：节点可要求关系对象达到等级。
- father memory gate：传统重铸线的剧情/回忆门槛。

## Required Trees And Nodes

### Street Wild

- `street_wild_entry`：passive，野路子行动命中后获得少量 skill xp。
- `street_dirty_chain`：combo node，解锁 `野路子快打 -> 绊步`。
- `street_queue_slot`：战斗行动队列槽 +1。
- `street_exit_to_boxing`：满足拳馆关系后，将野路子行动替换为正式拳击行动。

### Boxing Basics

- `boxing_guard`：passive，防守后获得轻量防御 modifier。
- `boxing_jab_cross`：combo node，解锁 `刺拳 -> 直拳`。
- `boxing_action_slot`：战斗行动槽 +1。
- `boxing_replace_wild_swing`：将 `wild_swing` 替换为 `boxing_jab`。

### Traditional Reforge

- `reforge_memory_stance`：father memory gate >= 1，被动提高传统训练 xp。
- `reforge_root_step`：combo node，解锁 `定步 -> 短打`。
- `reforge_breath_slot`：队列/预览槽升级，father memory gate >= 2。
- `reforge_replace_street`：将 `street_trip` 替换为 `root_step`。

### Evil Route

- `dark_clip_traffic`：流量剪辑，被动影响曝光或事件权重。
- `dark_rule_talk`：规则谈判，关系 gate 后给战前规则选项。
- `dark_keep_evidence`：证据留存，失败时降低惩罚或获得反制标记。
- `dark_extract_win`：撤离胜利，达成优势时提前结算为小胜。

## Suggested Implementation Order

1. 在数据层定义 tree/node/effect/replacement id。
2. 在 state 层增加 progression、资源、gate 检查、购买函数。
3. 在 DOM UI 增加技能树面板，优先做列表/分组，不做复杂画线。
4. 在 combat/training 读取已解锁 effects：槽位、combo、replacement、passive modifier。
5. 做浏览器 smoke，确认购买、战斗入口和移动端布局。

## Files For Next Round

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- 视现有结构可能补充战斗 Phaser scene 的 action id 展示，但不要改资产目录。

## Acceptance Tests

- `npm run build` 通过。
- insight point 不足时不能购买，并显示原因。
- skill xp 不足时不能购买，并显示对应树 xp 门槛。
- relation gate 和 father memory gate 均能阻止购买。
- 购买行动槽/队列槽节点后，战斗配置读取到新增槽位。
- 购买 combo node 后，战斗中对应行动序列可触发 combo。
- 购买 replacement node 后，野路子行动被正式技能替换。
- 技能树 UI 在桌面、平板、手机无横向溢出。

## Guardrails

- 不改战斗公式，只接入清晰的 unlock/effect hook。
- 不改经济曲线、敌人数据、训练收益基线。
- 不改资产结构和入口 HTML。
- 不把技能效果硬编码进 UI。
- 不把邪道路线做成默认强制路线。
