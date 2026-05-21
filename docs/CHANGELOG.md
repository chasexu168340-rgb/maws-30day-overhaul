# CHANGELOG

## 2026-05-19

### Batch 0
- 新增任务 checkpoint 文件。
- 记录目标、范围、基线测试结果和当前风险。

### Batch 1
- 为目标 HTML 追加硬派漫画 UI 覆盖层。
- 新增桌面、平板、手机响应式布局规则。
- 战斗卡牌在小屏改为横向滚动，主布局取消强制 1040px 宽度。

### Batch 2
- 新增集中式 `COMBAT_TUNING`、`ENEMY_META`、`ACTION_RISK`。
- 新增 CSS 分层人物、速度线、冲击帧、伤害数字和命中部位提示。
- 强化敌人 AI 读板，加入体力/架势阈值、玩家重复动作与上回合行为反制。
- 重调玩家和敌人伤害公式，降低初期换血速度。
- 新增 `combatMemory`、战斗历史和事件记录，用于后续机会/NPC联动。

### Batch 3
- 扩展浏览器 smoke，覆盖新开局、技能、商店、NPC、训练小游戏、保存、迁移和关键战斗入口。
- 验证 E01 一回合伤害降速，战斗历史和 AI 读板可继续推进。
- 验证 E06、E07、E18 可进入对应战斗，E07 保留武器威胁。

### Batch 4
- 修复 favicon 404，保持页面无额外网络依赖。
- 复测桌面、平板、手机三档视口，确认页面实际滚动宽度等于视口宽度。
- 更新最终测试报告和状态 checkpoint。

### Batch 5
- 新增战斗专用 `combatMode`，战斗时隐藏通用顶部、左侧、右侧和底部导航。
- 伤害数字改为直接挂载到敌我人物节点，增加连击 `HIT` 标识。
- 增加重击、格挡、MISS、抱摔、眩晕等人物状态浮层。
- 新增喘息/过回合、回合体力保底恢复和认输。
- 格挡/防下的招式会造成最低削血和体能消耗；未命中仍不造成伤害。
- 延长人物浮层停留时间，便于玩家看清反馈。

### Batch 6
- 新增本地 Phaser vendor：`vendor/phaser-4.1.0.min.js`。
- 战斗舞台接入 Phaser canvas，绘制程序化人物、场地、命中闪光、伤害数字、连击字卡和镜头震动。
- `queueFx()` 扩展表现字段，继续作为战斗表现唯一入口，同时驱动 DOM fallback 和 Phaser 特效。
- 保留 Phaser 加载失败 fallback，不阻塞原战斗玩法。
- 战斗技能卡新增预估伤害、架势伤害、命中率、体力、风险、距离和明确效果说明。

### Batch 7
- 新增地图地点“社区健身房”，开放时间 09:00-22:00。
- 新增基础循环训练、跑台间歇、核心稳定、拉伸放松四个健身房行动。
- 新增 `gym_basic` 基础循环训练小游戏，覆盖深蹲、卧推、划船、硬拉、平板、跑台配速等提示。
- 行动卡收益预览扩展为可显示基础属性、生命、体力、冷静、士气等收益。
- 健身房训练只提升基础体能，不直接刷战斗技能熟练度。

### Batch 8
- 移除技能页“练习”按钮，避免在技能栏直接无限刷熟练度。
- 技能卡新增当前属性下的伤害、架势、命中、体力、风险、距离和推荐训练地点。
- 地图移动改为 6 种交通方式出行弹窗：散步、跑步、共享单车、公交、地铁、打车。
- 新增 `fitXp` 体能点，体力型出行可积累并在阈值后带来小幅基础属性成长。
- 接入中央结算反馈，覆盖简单行动、训练小游戏、NPC 对话/事件、战斗结果和战后复盘。
- 接通 `ECONOMY_PATCH`，统一重调商品价格、训练成本/收益、恢复成本和战斗奖励。
- 战斗体力与大地图日常体力分层：低日常体力进战斗可正常出招，战后切回并恢复大部分日常体力。
- 追加 P5 风格斜切出行/结算外壳，延长战斗伤害数字、状态和连击文字停留。

### Batch 9
- 新增 `STAT_RULES`、`RESOURCE_RULES`、`STYLE_RULES`，集中说明基础属性、资源和流派点的实际作用。
- 新增“人物属性”独立页，展示基础属性、战斗状态、资源压力、装备技能收益和流派倾向。
- 左侧状态栏收口，不再展示完整属性表；属性卡支持 hover/focus/点击查看说明。
- `fitXp` 改为“体能沉淀”，通过等级派生速度、耐力、平衡，并在出行结算和属性页显示。
- 隐藏旧 `face` 可见资源显示，保留字段兼容旧存档。
- 将速度、判断、抗打、热度、装备 `dodge/risk/headRes`、技能熟练度和流派点接入战斗/事件/资源公式。
- 补充人物属性入口到自检页和 patch notes。

### Batch 10 continuation
- 建立本窗口 `task_plan.md`、`findings.md`、`progress.md`，记录恢复状态、错误和验证结果。
- 优化 Phaser 全局 UI 的手机/平板布局：HUD 资源格、底部图标导航、地图地点按钮、行动卡和出行弹窗减少遮挡。
- 新增手机战斗布局：顶部标题翼板、瘦身双方血条、3x2 技能卡和分离的确认/认输按钮。
- 修复逐招 AI 缺口：因距离或地面位置不匹配导致的无效玩家动作也会触发敌人回应，E07 远距武器压力不再站桩。
- 接入一批原创 P5 风格 generated SVG 资产：旧城区、出租屋、工地、拳馆、MMA馆、玩家、拳击新人、持械混混。
- 完成 module/import、manifest、旧存档迁移、综合浏览器 smoke、E01/E06/E07/E18 战斗和三档响应式截图验证。

### Batch 11
- 开始执行全量美术包与 DOM UI/战斗表现修复计划。
- 锁定分层：DOM 负责中文文字、按钮、技能卡和弹窗，Phaser 负责背景、人物和战斗 VFX。
- 锁定视觉：主 UI 为 P5 硬派写实，技能卡为精致像素卡牌并融合 P5 红黑白切边。
- Batch 11.2 收尾像素 PNG 资产接入：`ASSET_MANIFEST` 的 65 个 flattened 条目全部改为 `assets/imagegen_pixel` PNG 主路径，旧 SVG 保留为 fallback 元数据。
- 完成 16 个 JS 文件语法检查、manifest 校验、浏览器 smoke、保存/读档、E01/E06/E07/E18 战斗回归和三档截图验证。
- Batch 11.3 开始恢复地点视觉/UI 中断任务：目标是中间保留地点背景画面，加入主角和在场 NPC/对手入镜，并补昼夜背景入口。
- 新增 `docs/VISUAL_UI_ASSET_PLAN.md`，先把 UI 大改、昼夜地点资产、角色入镜、UI chrome 和后续大地图美术资产生成计划文件化。

### Batch 11.4
- 为地点背景补齐显式 day/night manifest key，并移除旧 `assets/generated` fallback 引用。
- `buildRenderModel()` 新增 `timeOfDay`、`locationScene` 和场景角色数据，供 DOM/Phaser 共用。
- 地图页改为左侧地点栏、中央场景舞台、右侧行动栏，减少列表面板对背景图的遮挡。
- Phaser 背景改为优先读取 `locationScene.backgroundKey`，跟随地点和昼夜切换。
- 清理旧资产：删除未引用的 `assets/generated`、`assets/imagegen` 和根目录 loose imagegen 导出 PNG；保留疑似用户源素材。
- 对 full-body fighter PNG 做黑底透明化，支持主角/对手入镜。
- 完成 JS 语法检查、manifest 校验、浏览器 smoke、响应式截图和 E01 战斗回归验证。

### Batch 11.5
- 新增 8 张地点页 NPC 透明像素 standee：刘胖子、小满、工友、拳馆教练、武馆师傅、健身房教练、理疗师、陈见锋。
- Manifest 新增 `scene.npc.*` 资源 key，并保持可替换的稳定路径。
- `state.js` 新增 `NPC_SCENE_ASSETS`，让地点页已有 NPC 映射自动使用 standee 替代 token。
- 完成 PNG 透明度/尺寸校验、JS 语法检查、manifest 校验、浏览器 smoke、三档截图和 E01 战斗回归。
### Batch 11.6
- 用 built-in imagegen 生成正式城市总览日/夜 PNG：`assets/imagegen_city_map/bg_city_map_day.png`、`assets/imagegen_city_map/bg_city_map_night.png`。
- Manifest 新增 `bg.city.map.day` 与 `bg.city.map.night`，并把 `assets/imagegen_city_map` 加入资产校验白名单。
- `buildRenderModel()` 新增 `cityMap`，按昼夜输出城市总览背景和 10 个地点标记。
- 地图页新增城市总览层，标记点击沿用原有出行弹窗；移动端使用紧凑图标标记避免重叠。
- 完成 JS 语法、manifest、浏览器 smoke、主 tab、存档、E01 战斗和三档响应式截图验证。

### Batch 12
- 启动地图折叠、战斗 UI 减遮挡、结算对象渲染修复、角色透明边清理和轻量出行数据调整。
- Batch 11.7 地点背景生成已暂停且未接入运行时；本批不继续生成地点背景。
- 地图页默认不再常驻城市大地图；城市总览改为 overlay，由底部地图入口或地点页“查看城市地图”打开。
- 城市总览 overlay 保留 `bg.city.map.day/night`，10 个地点 marker 支持 hover/focus/tap 提示，并在三档视口下无重叠。
- 战斗底部命令区改为低矮技能条，默认只显示伤害、命中、体力/AP 等关键字段；详细说明折叠到 hover/focus/选中浮层。
- 移动端战斗顶部状态条压缩，战斗日志收为按钮/浮层，技能卡横向滚动以减少遮挡。
- `renderModal()` 改为结构化渲染 settlement lines，战斗/出行/行动结算不再把对象显示成 `[object Object]`。
- `LOC_POS` 和 `TRAVEL_TUNING` 做轻量现实化调整，让跨区出行耗时、成本和体力消耗更像城市移动。
- 角色 PNG 非破坏式清边到 `assets/imagegen_pixel/characters_clean`，manifest 指向 cleaned 版本，原始角色图保留。
- 修复两个 QA 发现的交互问题：modal 层级低于底部 nav、战斗技能按钮在重绘时点击不稳。
- 完成 JS 语法检查、manifest 校验、13 张 cleaned PNG 边缘检查、三档浏览器 smoke、E01/E06/E07/E18 战斗回归和 12 张 Batch 12 截图验证。

### Batch 13
- 参考 `maws_fusion_enhanced_demo.html` 做 UI 观感补强：HUD、按钮、底部导航、地点栏、行动栏、城市 overlay、modal 和场景框架改为红黑金斜切漫画纸片风格。
- 新增全局点击/tap 反馈：所有 `[data-action]` 控件触发短暂红金爆点和 hit 状态，城市 marker 也有同样反馈。
- 场景人物图片改为 eager 加载，主角加 `fetchpriority="high"`，避免首次进入时人物本体晚于姓名牌/背板显示。
- 对 `assets/imagegen_pixel/characters_clean/fighter_player.png` 做二次后处理：去残边、轻微提亮、加薄红/米色漫画描边，让黑衣主角在暗场景中更可读。
- 对 placeholder-quality NPC standee 做视觉降权和标签框优化，保留后续替换路径，不把它们包装成最终角色资产。
- 完成 16 个 JS 文件语法检查、88 条 manifest 校验、主角 PNG 结构检查、桌面/平板/手机 Chrome smoke、存档版本检查、城市 marker 点击特效和 E01 战斗回归。

### Batch 14
- 替换 runtime character standee：`fighter_player.png` 和 8 张 `scene_npc_*.png` 均保持透明 512x768 PNG 输出。
- 完成更干净的 P5 风格战斗 UI pass：更薄的命令区、紧凑手机技能卡、固定定位技能详情、确认/认输按钮不再被挤出视口。
- 将属性、资源、流派、技能、物品、行动和事件文案改成更自然的中文反馈，但不改公式和数据形状。
- 修复两个手机 QA 回归：底部导航重叠/层级问题、技能详情流内展开导致确认按钮出屏。
- 保持 manifest key、玩法数据、经济、战斗公式、敌人、存档 key 和存档版本不变。
- 完成 JS 语法、manifest、PNG 结构、桌面/平板/手机 Chrome smoke、保存、城市 overlay 和 E01/E06/E07/E18 战斗回归验证。

### Batch 15
- 新增第一批可玩闭环引导：DOM 今日主线/今日待办任务板，复用 `MAIN_EVENTS` 和 `buildOpportunities()`。
- 行动卡新增明确消耗/收益 chips：时间、体力、现金、属性、技能 XP、关系、风险和战斗奖励预览。
- 背包页新增 5 个装备槽，接通装备、替换、卸下和效果摘要，不改存档 key。
- 新增两个训练小游戏 modal 模板并接入 `bag` 与 `gym_basic`；评分按原行动收益的 70%/100%/120% 结算，避免重复扣时间/SP/现金。
- 战斗 DOM UI 重做为 P5 风格卡牌：大编号、目标 segmented control、队列、自动窗口状态、紧凑行动按钮和日志。
- `confirmBattle` 改为短窗口半即时制：排队卡牌自动结算一段窗口，然后回到 `planning` 供玩家调整。
- Manifest 新增 spritesheet 支持和首批 `anim.fighter.*` replaceable sprite strips：player、boxer、grappler、weapon、boss。
- BootScene 支持 spritesheet preload；ShellScene 优先使用 `anim.*` sprite 并加入生命周期安全的动画播放。
- `verify_assets.mjs` 扩展为校验 spritesheet 尺寸、帧范围、透明四角、非空像素和边缘残底。
- 修复 Batch 15 QA 中发现的问题：任务板覆盖、modal/nav 层级、平板/手机战斗按钮出屏、战斗结束后的延迟动画回调。
- 完成 JS/MJS 语法、CSS 结构、spritesheet manifest、三端 Chrome smoke、保存读档、主线/待办/装备/训练和 E01/E06/E07/E18 战斗回归验证。
- 已知限制：本批 sprite strips 是程序化 replaceable base，不是最终 imagegen/手绘逐帧动画资产。

### Batch 16
- 使用 `game-design-core` 审计当前短窗口战斗循环：保留 Batch 15 的“规划 -> 自动窗口 -> 再规划”方向，补足选择前信息不足的问题。
- 使用 `combat-design` 做最小半即时体验重构：规划态新增敌方读板，包含预判动作、危险等级、telegraph、建议反制和恢复/惩罚提示。
- 自动窗口新增动态节奏估算，按玩家队列、实际交换 steps 和敌方危险度记录 8-12 秒 `lastWindow.duration`。
- 自动窗口新增压力标签：`试探交换`、`中压交换`、`高压交换`，用于 HUD 和战斗日志反馈。
- DOM 战斗 UI 新增读板模块和预计窗口时长提示，选卡后会随当前队列更新。
- 保持战斗伤害/命中公式、敌人属性、经济、装备数值、存档 key/version 不变。
- 完成 JS/MJS 语法、CSS 结构、manifest、桌面/手机 Chrome smoke 和 E01/E06/E07/E18 战斗回归验证。

### Batch 17
- 新增项目级 `docs/SKILL_ROUTER.md`，让 Codex/协作 Agent 按任务类型自动选择 2-4 个核心 skill。
- `AGENTS.md` 新增“技能自动路由”开工流程：读取 router、声明使用 skill、记录到 checkpoint。
- 路由表覆盖战斗、UI、资产、数值、文案、QA、GitHub、文档/checkpoint 8 类常见任务。
- 明确本项目是 Phaser + DOM，不默认启用 Godot 系列 skill。
- 本批只改文档和 checkpoint，不改游戏代码、玩法、数值、资产 manifest、存档 key/version。

### Batch 19
- 使用 `planning-with-files` 续接中断任务，并用 data/events、combat/economy、UI/state 三个子 Agent 分工推进。
- 新增散打、空手道、跆拳道三条首个可玩切片：`sanda`、`karate`、`taekwondo` 流派，三个地点，三名 NPC，六个技能，三个敌人和训练行动。
- 新增 day 1 和 day 18 的 story-choice 主线选择，选择提交后才写入 `main_${day}` 和 `daily.mainDone`。
- 新增 `resolveStoryChoice` 状态分支和 `storyChoice` modal，支持选择收益、关系、flags 和进入战斗。
- `buildRenderModel()` 新增 `styleList`、地点 `openText/actionCount/mainHere`，地图按钮和人物页能展示扩展流派/地点密度。
- `combat.js` 补齐 6 个新技能、E19/E20/E21 模板、AI response、风格伤害加成和新招式特殊效果。
- `economy.js` 补齐三种新流派、技能学习映射和结算标签。
- 完成 `node --check`、`npm run build`、Node story-choice smoke、`git diff --check` 和 Chrome 浏览器 smoke。
- 已知限制：本批不新增专属场馆美术，不做完整 30 天长线平衡。

### Batch 20
- 新增/补齐 MAW 主线骨架：`MAW_FORMS` 的落地根模块归入 `grappling`，主线节点覆盖 Day 1/2/3/5/8/9/12/18/20/21/22/24/29/30。
- 新增父亲、阿豹、推手大爷 NPC；父亲标记为隐藏 NPC，不进入普通关系列表。
- 新增 E10“一阵风”沉默拳击手和 E11“短视频挑战者阿豹”，并同步到 `combat.js` 运行时模板。
- `state.js` 新增 `state.maw`、旧档迁移、`updateMawProgress()`、主线 MAW 脚本效果和 render model 暴露。
- Day 8 触发 E10 时进入 `broken` 阶段并把 `misread` 清零/转入父亲记忆；Day 9 父亲日记进入 `reforge` 阶段。
- `events.js` 新增 MAW 机会卡因子和 `when` 条件支持，后续可按 `maw.chapter`、误判、父亲记忆和茂拳完成度筛选事件。
- 保持 UI 布局、Phaser Scene、资产 manifest、经济曲线、战斗公式、存档 key 和存档版本不变。
- 完成 `node --check`、`npm run build`、`git diff --check`、专项 Node MAW smoke 和 390x844 浏览器 smoke。
- 已知限制：Day 8 专用剧情失败结算、Day 30 目标制终战结算和拳谱 UI 呈现仍留给后续批次。
## 2026-05-21 Batch 21-23

- Added visible MAW reforge progress to the profile UI, including five module scores, next suggested actions, and form notes.
- Enhanced combat read-board output with counter hints, failure explanations, queue-fit feedback, and compact mobile-safe rendering.
- Added Day 30 objective battle tracking and tiered final results based on objective completion.
- Kept save key/version, economy tuning, asset manifest, and Phaser scene structure unchanged.
