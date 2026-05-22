# WAVE12_VISUAL_STAGE_HUD_STRIKE

你是 AGENT_E_UI_PRESENTATION + AGENT_G_ASSET_WORLD。本轮是唯一 UI 大实现 worker。目标是让主界面、战斗 HUD、人物站位、弹窗密度像一个高分辨率游戏界面。

允许修改：maws_src/dom/ui.js、maws_src/dom/ui.css、docs/workers/visual_stage_hud_strike.md、docs/agent_reports/AGENT_E_VISUAL_STAGE_HUD_STRIKE.md。

禁止修改：data.js、state.js、events.js、combat.js、manifest.js、assets、package.json、INITIAL_SKILLS。

必须解决：
1. 战斗 HUD：不是减少到 2 张牌，而是卡牌缩小、舞台放大。中央角色和背景必须占主视觉；底部卡牌不能压掉角色脚下。当前 1-2 个队列槽独立突出，全部技能作为较小手牌/更多动作区。
2. 卡牌默认只显示名称、AP/体力、命中、效果一句。详细数值 hover/details，不撑高卡片。左侧日志不能被白滚动条截断。
3. 主界面舞台：主角/NPC 放大且脚底贴地；去掉红黄灰大背板和红色探照灯；使用柔和描边、投影、接触阴影；背景裁剪以场景中心为视觉焦点。
4. 当前地点行动区域不能被底栏遮挡；右侧推荐/行动栏压缩但保留重点信息。
5. 对话/小事件：小内容用 compact modal。小事件结果直接显示 rewardDeltas 数字，不重复长句。
6. 点击 NPC/角色必须有可见反馈：highlight、pulse、小气泡或小型角色菜单，不是只有 toast。
7. 有用信息默认可见：行动卡默认显示耗时、体力/钱、主要收益；技能卡默认显示用途、熟练度/来源一句。details 只放长描述、完整数值、完整结算。

验证：npm run check:full；npm run test:playtest；git diff --check。

报告必须说明：1536x864 地图页、1536x864 战斗页、390x844、小事件结果的人工观感是否通过。
