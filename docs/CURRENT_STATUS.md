# CURRENT STATUS

## 2026-05-19 Batch 0

已扫描事实：
- 工作区当前只有 `.git`，没有项目级 README 或状态文件。
- 目标 demo 位于 `E:\TH比赛照片\maws_30day_overhaul_v3.html`。
- 文件是 UTF-8；PowerShell 默认读取会显示乱码，后续必须显式 UTF-8 读写。
- 现有架构是单文件 HTML，CSS、数据表、渲染函数、战斗状态机集中在一个文件内。
- 当前战斗可运行，但舞台主要是 emoji 对位，视觉反馈主要靠日志。
- 当前 390px 手机视口下页面实际宽度约 1040px，会横向溢出。
- 初期 E01 实测一轮刺拳互换：玩家对敌约 21 伤害，敌反击约 23 伤害，数值偏快。

执行状态：
- Batch 0 已完成。
- Batch 1 已完成：追加硬派漫画 UI 覆盖层，移除实际移动端最小宽度限制，新增手机/平板响应式规则。
- Batch 2 已完成：新增 `COMBAT_TUNING`、敌人画像、战斗特效队列、CSS 人物舞台、AI 读板增强、伤害重调和战斗记忆。
- Batch 3 已完成：浏览器 smoke 覆盖新开局、技能、商店、NPC、训练小游戏、E01/E06/E07/E18 战斗入口、保存和旧存档迁移。
- Batch 4 已完成：响应式复测 1365x768、900x700、390x844 均无横向溢出；补充 data favicon，控制台无 error。
- Batch 5 已完成：战斗进入 `combatMode` 专用 UI，隐藏通用顶部/左右/底部导航；伤害数字、连击和状态图标直接挂到敌我人物节点；新增喘息过回合、回合体力保底恢复、认输、格挡削血和格挡体能消耗。
- Batch 6 已完成：接入本地 Phaser 4.1.0 vendor；战斗舞台新增 Phaser canvas，保留 DOM fallback；`queueFx()` 扩展表现字段并驱动 Phaser 命中/格挡/MISS/抱摔/眩晕/连击动画；战斗技能卡新增预估伤害、架势、命中、体力、风险、距离和效果说明。
- Batch 7 已完成：新增 `gym` 社区健身房地点；新增基础循环训练、跑台间歇、核心稳定、拉伸放松四个行动；`gym_basic` 小游戏接入现有 miniGame modal；行动卡可显示基础属性收益。
- Batch 8 已完成：移除技能页“练习”入口，技能卡显示当前属性下的伤害/架势/命中/体力/风险/距离和推荐训练地点；地图移动改为 6 种交通方式出行弹窗；新增 `fitXp` 体能点和出行体能沉淀；接入中央结算反馈，覆盖简单行动、小游戏训练、NPC 对话/事件、战斗结果和战后复盘；接通 `ECONOMY_PATCH` 重调商品价格、行动成本/收益和战斗奖励；战斗体力与日常体力分层，低日常体力进战斗会获得独立战斗体力，战后切回并恢复大部分日常体力；追加 P5 斜切弹窗/结算外壳并延长战斗文字停留。

风险：
- 目标 HTML 多处函数和 CSS 是长行，修改时必须控制批次并做语法检查。
- 直接改原文件，需要避免编码损坏。
- 已完成浏览器自动化检查；美术效果仍属于 CSS 原型资产，不是最终手绘/序列帧素材。
- 伤害数字和状态图标是 DOM/CSS 浮层，后续如果接入正式人物立绘或帧动画，需要重新校准锚点。
- Phaser 当前使用程序化剪影和图形特效，后续替换 sprite sheet 时需要重映射人物锚点和受击动画。
- 健身房当前只做基础体能和一个互动训练；没有会员卡、私教 NPC、器械资产或长期训练计划。
- Batch 8 已通过自动化 smoke；仍需人工体验确认 P5 风格强度是否符合用户口味，以及经济重调后的 30 天游玩曲线是否需要继续微调。

## 2026-05-20 Batch 9

执行状态：
- Batch 9 已完成：新增 `STAT_RULES`、`RESOURCE_RULES`、`STYLE_RULES`，8 项基础属性、资源压力、技能熟练度和流派点均有说明和实际公式承接。
- 新增 `profile` 人物属性页，展示基础属性、战斗状态、资源压力、装备技能实际收益和流派倾向；属性卡支持 hover/focus/点击展开说明。
- 左侧状态栏已收口为头像、出身、简要状态、体能沉淀、装备技能、流派和伤病入口，不再占用空间展示完整属性表。
- `fitXp` 改为“体能沉淀”，按 20 点形成等级，派生到速度、耐力、平衡，并在出行结算和人物属性页可见。
- `face` 保留为旧存档兼容字段，但不再作为可见资源展示；顶部和结算不再显示面子。
- 速度、判断、抗打、热度、装备 `dodge/risk/headRes`、流派点和技能熟练度已接入命中、节奏、反制、伤害、防伤、事件机会或派生显示。

风险：
- 当前属性重塑仍是数值公式层微调，未做完整 30 天游玩曲线人工体验。
- `face` 仍留在旧存档对象中，仅隐藏显示；后续如做社交系统可再决定是否彻底迁移。
- 体能沉淀使用派生加成，不再直接写入基础属性；旧存档中已经获得的基础属性不会回滚。

## 2026-05-20 Batch 10 continuation

执行状态：
- 已按 `planning-with-files` 建立本窗口工作文件：`task_plan.md`、`findings.md`、`progress.md`。
- 已确认运行源位于 `E:\TH比赛照片`，入口仍是 `maws_30day_overhaul_v3.html`，主逻辑位于 `maws_src`。
- `ShellScene` 仍是当前全局 Phaser UI 主场景；`MapScene`、`BattleScene`、`MenuScene`、`ModalScene` 仍为占位，本轮未继续拆 Scene。
- 已修复手机端和 900px 宽度下 HUD、地图地点按钮、行动卡、底部导航、出行弹窗和战斗技能卡的主要遮挡。
- 已修复逐招 AI 缺口：玩家因距离/地面位置选错动作时，敌人仍会根据局势立即回应；未知技能、未学会和体力不足仍不额外惩罚。
- 资产 worker 已覆盖 8 个 generated SVG：旧城区日景氛围、出租屋夜晚、工地黄昏、拳馆夜训、MMA馆、玩家、拳击新人、持械混混。

风险：
- `ShellScene` 当前承担所有 UI，后续如果继续扩展大量动画/滚动面板，再拆 Scene 会更稳；本轮为了收敛没有大拆。
- 生成资产仍是 SVG 风格资产，不是完整序列帧或最终商业级手绘。
- `bg.street.night` 现有 key 被用于旧城区日景氛围，未新增 `bg.street.day`，因为本轮不改 manifest 结构。
- 移动端 toast 是临时覆盖层，测试截图中会短暂盖住部分底部内容，但不会造成横向溢出或阻断操作。

## 2026-05-20 Batch 11

执行状态：
- 已进入执行阶段，按用户确认的方案实施：DOM 文字层 + Phaser 表现层、P5 硬派写实主 UI、精致像素技能卡。
- 本轮使用多 agent 分工：资产包/manifest、DOM UI、Phaser 战斗表现分别处理，主线程负责 checkpoint、集成和最终验证。
- 真实源码目录 `E:\TH比赛照片` 不是 Git 仓库；本轮必须依赖 checkpoint 文件和最终文件清单恢复上下文。

风险：
- 全量资产包需求很大，本轮优先做首批可加载、可验证、可替换的项目资产闭环；后续可继续提高单张美术精度。
- DOM overlay 和 Phaser canvas 的点击层级需要重点验证，避免 DOM 吃掉不该吃的点击或 Phaser 长文本残留。
- 技能卡说明恢复必须基于现有 `SKILLS` 字段和 combat preview，不改技能数值。

## 2026-05-20 Batch 11.2

执行状态：
- Batch 11.2 已完成：`E:\TH比赛照片\maws_src\assets\manifest.js` 的 65 个 flattened manifest 条目全部使用 `assets/imagegen_pixel` PNG 主路径。
- 旧 SVG 资源仍保留在 `assets/generated`，并作为 fallback 元数据挂在对应 manifest entry 上。
- DOM overlay、Phaser BootScene、战斗 VFX、保存 key `maws_overhaul_save` 和版本 `4.1-phaser-ui` 未改变。
- 静态验证、manifest 验证、浏览器 smoke、四场关键战斗和三档截图验证均通过。
- 本地静态服务已在 `http://127.0.0.1:8137/maws_30day_overhaul_v3.html` 可访问。

风险：
- 当前像素资源是首批可替换资产，不是最终商业级精修包。
- 移动端战斗技能卡内容较密，当前通过滚动解决；后续如果继续加字段，需要优先做折叠或分页。
- `ShellScene` 仍保留旧 Phaser UI 渲染函数，但正常流程已经由 DOM overlay 接管；本轮没有做清理，以避免扩大范围。

## 2026-05-20 Batch 11.3

执行状态：
- 已恢复用户中断前要求：地点背景缺少城市人气，需要主角和在场 NPC 入镜；UI 需要大改，为每个地点在中间留出背景图空间；需要昼夜图并保持一致性。
- 已确认 `test-results/batch11_3_*` 截图来自一次未写 checkpoint 的尝试：日间深圳风背景已写入 manifest，但 UI 仍大面积遮挡背景，地点内没有角色/NPC 入镜。
- 已确认本轮只处理地点视觉、昼夜背景入口和 DOM 地图页布局，不调整玩法数值。
- 已按用户要求先输出大计划：`docs/VISUAL_UI_ASSET_PLAN.md`，覆盖 UI 大改、地点昼夜图、主角/NPC 入镜、UI chrome，以及后续城市大地图资产生成。
- 代码实现暂停在规划阶段，下一批再从计划的 `Phase 1` 开始。

风险：
- 现有日间背景和夜间 fallback 并非同一批完整昼夜资产，当前先通过 manifest 结构和 UI 入口形成可替换闭环。
- 主角/NPC 入镜先复用现有透明角色与头像资产，能满足可见反馈，但不是最终逐地点定制立绘。

## 2026-05-20 Batch 11.4

执行状态：
- Batch 11.4 已完成。当前地点页已经从列表主导改成中间场景主导：左侧地点栏、中央背景舞台、右侧行动栏。
- Manifest 现在有明确的日/夜地点背景 key。`flattenManifest()` 共 78 条运行时资源，来源只剩 `assets/imagegen_shenzhen_sun` 和 `assets/imagegen_pixel`。
- 旧 `assets/generated` SVG fallback 和被拒绝的真实感 `assets/imagegen` 包已从运行时引用中移除，并已删除对应旧资产目录。
- 主角和敌人 full-body PNG 已做黑底透明化处理，可作为场景立绘叠到背景上。
- 存档 key 仍为 `maws_overhaul_save`，版本仍为 `4.1-phaser-ui`，本轮没有改战斗、经济、敌人或主线数据。

风险：
- 部分 NPC 还没有最终透明全身立绘，当前用小型姓名 token 入镜，属于可验证占位，不是最终美术。
- 日夜背景仍是现有素材组合，不是每个地点同批次成对精修；后续需要补齐一致风格的夜景和城市大地图。
- `E:\TH比赛照片\新建文件夹` 未删除，因为它更像用户源照片/参考材料；如要清理，需要用户明确确认。

## 2026-05-20 Batch 11.5

执行状态：
- Batch 11.5 已完成。home/store/worksite/boxing/wuguan/gym/physio 等地点不再显示 NPC token，占位已升级为透明 PNG standee。
- Manifest 当前共 86 条运行时资源；新增 8 个 `scene.npc.*` key。
- 浏览器检查 10 个地点均为 0 个 `.maws-scene-token`，场景人物图片均正常加载。
- 本轮没有改玩法数值、战斗、经济、敌人定义或存档逻辑。

风险：
- 新增立绘是本地程序化像素 standee，主要用于替代 token、验证布局和人物入镜；还不是最终手绘精修资产。
- 移动端能显示主角和 NPC，但人物细节会比较小；后续精修立绘时需要继续做手机截图验收。
## 2026-05-20 Batch 11.6

执行状态：
- Batch 11.6 已完成。当前项目新增正式 imagegen 城市总览图日/夜两张，并已接入地图页。
- 新资产位置：`E:\TH比赛照片\assets\imagegen_city_map\bg_city_map_day.png`、`E:\TH比赛照片\assets\imagegen_city_map\bg_city_map_night.png`。
- Manifest 当前为 88 条运行时资源；新增 `bg.city.map.day` 和 `bg.city.map.night`。
- 地图页现在上方显示城市总览，下方保留当前地点场景、地点栏和行动栏。
- 地点标记点击仍走原有 `openTravel` / travel modal 流程；没有改出行成本和距离。
- 存档 key 仍为 `maws_overhaul_save`，版本仍为 `4.1-phaser-ui`。

风险：
- 这两张图是 imagegen 输出的精致城市图，更接近“精修游戏背景/地图资产”，但不是严格低分辨率 pixel tileset。
- 当前只完成大地图资产，不代表所有地点日夜背景、NPC 立绘、UI chrome 都已经最终化。
- 城市标记坐标是视觉坐标，后续如果替换大地图构图，需要同步微调坐标。

## 2026-05-20 Batch 12

执行状态：
- Batch 12 已启动，按用户指定范围执行：地图折叠、战斗 UI 减遮挡、结算对象渲染修复、角色透明边清理、地图 hover/focus 和轻量出行数据调整。
- Batch 11.7 地点背景生成在接入前被暂停；对应 imagegen 输出未进入运行时 manifest。
- 目标源码仍是 `E:\TH比赛照片`，checkpoint 仍以本目录 `docs/CURRENT_*` 为准。
- Batch 12 已完成。地图页默认不再常驻城市大地图，城市总览现在是按需 overlay；战斗命令区已压低，结算对象渲染已修复，cleaned 角色 PNG 已接入 manifest。

本轮涉及文件：
- `E:\TH比赛照片\maws_src\dom\ui.js`
- `E:\TH比赛照片\maws_src\dom\ui.css`
- `E:\TH比赛照片\maws_src\simulation\state.js`
- `E:\TH比赛照片\maws_src\content\data.js`
- `E:\TH比赛照片\maws_src\assets\manifest.js`
- `E:\TH比赛照片\maws_src\tools\verify_assets.mjs`
- `E:\TH比赛照片\assets\imagegen_pixel\characters_clean\*.png`

风险：
- 角色清边是后处理修复，不是最终重绘；如果原图本身比例或造型不理想，本轮只保证边缘和锚点更稳。
- 出行调数只覆盖地图距离和交通方式成本/耗时，未做完整 30 天经济曲线复测。
- 移动端战斗技能卡仍然信息密度高，当前通过低矮 dock、横向滚动和 hover/focus/选中详情浮层解决；后续如果继续加战斗字段，应继续折叠而不是加高 dock。
- 本轮没有接入 Batch 11.7 的地点背景生成图，也没有删除用户源照片/参考素材。

## 2026-05-20 Batch 13

执行状态：
- Batch 13 已完成。当前 UI 已参考 `maws_fusion_enhanced_demo.html` 调整为更强的红黑金斜切漫画风格，但仍保持现有 DOM + Phaser 分层架构。
- 已新增全局点击/tap 特效：按钮、tab、城市 marker、技能卡等 `[data-action]` 控件都会出现短暂红金爆点，并带目标 hit 状态。
- 主角图片加载已从 lazy 改为 eager，主角加 `fetchpriority="high"`；桌面端首次进入不再只看到姓名牌/背板。
- 主角 cleaned PNG 已再次后处理：边缘透明、轻微提亮、红/米色描边，让黑衣角色在暗场景里更清楚。
- 低质量 `scene.npc.*` standee 仍不是最终资产，本轮只做缩放/降权/标签框优化，保留后续替换接口。
- 存档 key 仍为 `maws_overhaul_save`，版本仍为 `4.1-phaser-ui`；战斗、经济、敌人、出行调参本轮未改。

本轮涉及文件：
- `E:\TH比赛照片\maws_src\dom\ui.js`
- `E:\TH比赛照片\maws_src\dom\ui.css`
- `E:\TH比赛照片\assets\imagegen_pixel\characters_clean\fighter_player.png`
- `C:\Users\Administrator\Documents\New project 3\task_plan.md`
- `C:\Users\Administrator\Documents\New project 3\progress.md`
- `C:\Users\Administrator\Documents\New project 3\findings.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_TASK.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_STATUS.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_TEST_REPORT.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CHANGELOG.md`

风险：
- 主角是现有生成图的后处理增强，不是最终重绘；造型层面的“干净/统一”还需要后续专门角色资产批次。
- NPC standee 还保留 placeholder 质感，本轮没有重画全部 NPC。
- 这轮是 UI 观感和交互反馈修补，没有做完整 30 天玩法曲线复测。

## 2026-05-20 Batch 14 Final

执行状态：
- Batch 14 已收口。当前战斗 UI 已完成更干净的 P5 风格压缩：底部技能区更薄、详情浮层不再挤占布局，手机端确认按钮不会被顶出屏幕。
- 已确认数值/技能/事件文案改写已经在 `content/data.js` 和 `simulation/events.js` 中落地，整体更自然、更有反馈感，但没有改公式。
- 已确认主角 runtime standee 已替换；8 个场景 NPC standee 也处于透明 512x768 PNG 可用状态。
- 本轮继续修复了两个 QA 问题：手机底部导航重叠/层级问题、手机战斗选技能后详情卡把确认按钮挤出视口的问题。
- 存档 key 仍为 `maws_overhaul_save`，版本仍为 `4.1-phaser-ui`；战斗公式、敌人、经济、出行调参和核心结构未改。

本轮涉及文件：
- `E:\TH比赛照片\maws_src\dom\ui.css`
- `C:\Users\Administrator\Documents\New project 3\task_plan.md`
- `C:\Users\Administrator\Documents\New project 3\progress.md`
- `C:\Users\Administrator\Documents\New project 3\findings.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_STATUS.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_TEST_REPORT.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CHANGELOG.md`
- `E:\TH比赛照片\docs\CURRENT_STATUS.md`
- `E:\TH比赛照片\docs\CURRENT_TEST_REPORT.md`
- `E:\TH比赛照片\docs\CHANGELOG.md`

风险：
- 角色和 NPC standee 仍是单姿态资产，不是最终动画 sprite sheet。
- 本轮 smoke 覆盖关键交互和战斗回归，没有做完整 30 天经济曲线长跑。
- Playwright 验证依赖系统 Chrome；本机 bundled Chromium 仍不可用。

## 2026-05-20 Batch 15 Final

执行状态：
- Batch 15 已完成。当前版本已经有最小可玩闭环：地图主线/待办、行动预期收益、装备槽、训练小游戏、DOM 战斗 HUD/技能卡、目标选择和短窗口半即时战斗。
- 训练小游戏接入 `bag` 和 `gym_basic`，结算按评分给原行动收益的 70%/100%/120%，时间/SP/现金只结算一次。
- 背包页暴露 hand/foot/body/head/accessory 5 个装备槽，支持装备、替换和卸下，装备效果进入既有属性/战斗结算。
- 战斗 `confirmBattle` 现在执行一个自动窗口，写入 `clock/windowCount/lastWindow/eventSeq`，窗口结束回到 `planning`，玩家可重新选卡和目标。
- Phaser 只负责背景、角色 sprite、动画播放、hit text 和 VFX；复杂战斗 UI 走 DOM。
- Manifest 新增 `sprites` 分组和 `anim.fighter.*` keys；BootScene 支持 spritesheet preload；ShellScene 优先使用 `anim.*`，缺失时回落到旧 standee。
- 新增 5 张 replaceable animation strip PNG：player、boxer、grappler、weapon、boss。
- 存档 key 仍为 `maws_overhaul_save`，没有删除旧 standee/skill card，没有改存档 key/version。

本轮涉及文件：
- `E:\TH比赛照片\maws_src\content\data.js`
- `E:\TH比赛照片\maws_src\simulation\state.js`
- `E:\TH比赛照片\maws_src\dom\ui.js`
- `E:\TH比赛照片\maws_src\dom\ui.css`
- `E:\TH比赛照片\maws_src\assets\manifest.js`
- `E:\TH比赛照片\maws_src\phaser\scenes\BootScene.js`
- `E:\TH比赛照片\maws_src\phaser\scenes\ShellScene.js`
- `E:\TH比赛照片\maws_src\tools\verify_assets.mjs`
- `E:\TH比赛照片\assets\imagegen_pixel\sprites\*.png`
- `C:\Users\Administrator\Documents\New project 3\task_plan.md`
- `C:\Users\Administrator\Documents\New project 3\progress.md`
- `C:\Users\Administrator\Documents\New project 3\findings.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_TASK.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_STATUS.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CURRENT_TEST_REPORT.md`
- `C:\Users\Administrator\Documents\New project 3\docs\CHANGELOG.md`
- `E:\TH比赛照片\docs\CURRENT_TASK.md`
- `E:\TH比赛照片\docs\CURRENT_STATUS.md`
- `E:\TH比赛照片\docs\CURRENT_TEST_REPORT.md`
- `E:\TH比赛照片\docs\CHANGELOG.md`

风险：
- 本轮 sprite strips 是程序化 replaceable base，不是最终 imagegen/手绘逐帧美术；适合作为接口和运行验证，不应当当成最终动画资产。
- 只覆盖核心 4 敌和 9 个常用技能对应的基础动作映射；其余敌人与技能仍需后续批次补。
- 训练小游戏是 modal 原型，还不是有实时判定/音画节奏的最终小游戏。
- 没有做完整 30 天经济曲线长跑。
