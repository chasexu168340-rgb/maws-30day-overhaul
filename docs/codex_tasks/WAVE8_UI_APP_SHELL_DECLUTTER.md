# WAVE8_UI_APP_SHELL_DECLUTTER

你是 AGENT_E_UI_PRESENTATION。

目标：把主界面从“信息墙”改成“导演式 HUD + 场景舞台 + 折叠详情”。

## 本轮设计依据

- 已由 Manager 读取本机顶级 skills：`ui-ux-design`、`game-design`、`system-designer`、`storytelling`。
- 执行时直接采用这些原则，不要另行加载插件或外部 skill，避免 CLI warn。
- UI/UX：一致性、状态可见、即时反馈、简约、progressive disclosure。
- Game Design：先验证核心循环是否好玩；减少功能堆叠；让玩家知道目标、做选择并得到反馈。
- System Design：保持单体内小改动；字段可选；不新增大系统；数据模型驱动 UI。
- Storytelling：少即是多；行动代替说明；对话有潜台词；长背景默认折叠。

## 允许修改

- maws_src/dom/ui.js
- maws_src/dom/ui.css
- docs/workers/ui_app_shell_declutter.md
- docs/agent_reports/AGENT_E_UI_APP_SHELL_DECLUTTER.md

## 禁止修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/events.js
- maws_src/simulation/combat.js
- assets/
- package.json
- INITIAL_SKILLS

## 任务

1. 主地图页默认只显示：
   - 今日主线摘要
   - 当前地点舞台
   - 推荐行动最多 2-3 个
   - 当前地点最关键行动
2. 地点列表、全部行动、长描述进入 details 折叠。
3. 技能页：
   - 已学技能默认只显示名称、熟练度、装备状态。
   - 来源/数值详情进入 details。
   - 未学技能显示一行来源摘要，详情折叠。
4. 弹窗：
   - 统一 modal shell。
   - 默认显示标题、一句摘要、当前要做的选择。
   - beats、summary、settlement lines、详细收益风险进入 details。
5. 训练弹窗突出选择，成本/收益折叠。
6. 战斗结果默认显示结果 + “你学到了什么” + 复盘按钮，结算明细折叠。
7. 使用原生 details/summary，避免新增复杂状态机。

## 验证

npm run check:full
git diff --check

## 输出

docs/workers/ui_app_shell_declutter.md
docs/agent_reports/AGENT_E_UI_APP_SHELL_DECLUTTER.md
