# CURRENT TASK

## 2026-05-19 Batch 0

目标：直接升级 `E:\TH比赛照片\maws_30day_overhaul_v3.html` 的 Web demo。

本轮要做：
- 保持单文件原生 HTML/CSS/JS 架构。
- 全局升级硬派漫画风格 UI 和响应式布局。
- 强化战斗舞台、打击数字、人物反馈、敌人 AI、战斗数值、事件联动和存档兼容。
- 更新本目录 checkpoint，方便中断后继续。

本轮不做：
- 不拆成多文件项目。
- 不引入大型依赖。
- 不改变 30 天主线题材和核心角色。
- 不生成 v4 副本，按用户要求直接改原文件。

主要验证：
- Node 语法解析。
- 浏览器 smoke。
- 战斗自检 E01 / E06 / E07 / E18。
- 1365x768、900x700、390x844 响应式检查。
- v3 旧存档字段迁移和 v4 保存读取。

## 2026-05-19 Batch 5

目标：按用户反馈继续优化战斗内体验。

本轮要做：
- 伤害数字必须直接显示在敌我人物立绘上。
- 增加重击、抱摔、眩晕、格挡、MISS、连击等战斗浮层。
- 解决低体力时无法推进回合的问题，加入喘息过回合和认输。
- 格挡/防下的招式保留最低削血和体能消耗，未命中仍然不造成伤害。
- 战斗中隐藏通用 UI，改成专门的战斗画面。

本轮不做：
- 不拆分单文件。
- 不引入新依赖。
- 不重做全部数值和事件线。

主要验证：
- Node 语法解析。
- Playwright 验证低体力过回合、人物浮层、格挡削血、认输。
- 桌面、平板、手机战斗视口无横向溢出。

## 2026-05-20 Batch 6

目标：按用户要求把战斗舞台表现层接入本地 Phaser，并让技能伤害/效果更直观。

本轮要做：
- 从本地 Phaser 4.1.0 复制 vendor 脚本到 `E:\TH比赛照片\vendor`。
- 保留现有战斗规则、数值、AI、存档结构，只替换战斗舞台表现层。
- Phaser 负责人物剪影、命中闪光、位移、震动、伤害数字、连击、格挡、MISS、抱摔和眩晕表现。
- DOM 继续负责血条、技能卡、按钮、日志和读板文字。
- 技能卡展示预估伤害、架势、命中、体力、风险、距离和特殊效果。
- Phaser 加载失败时保留 DOM/CSS fallback。

本轮不做：
- 不重做主线、敌人 AI、存档 key 或完整数值体系。
- 不引入远端 CDN。
- 不接入正式手绘素材。

主要验证：
- Node 语法解析。
- Phaser vendor 资源 200。
- E01 连击、格挡削血、E06 抱摔、fallback、三档响应式。

## 2026-05-20 Batch 7

目标：新增“社区健身房”作为基础体能训练地点，并加入一个基础循环训练小游戏。

本轮要做：
- 新增地图地点 `gym`，开放时间 09:00-22:00。
- 新增健身房行动：基础循环训练、跑台间歇、核心稳定、拉伸放松。
- 扩展 miniGame 系统支持 `gym_basic`，覆盖深蹲、卧推、划船、硬拉、平板、跑台配速等基础项目。
- 扩展行动卡收益预览，显示力量、耐力、速度、抗打、平衡等基础属性收益。
- 更新 patch notes 和 checkpoint。

本轮不做：
- 不做会员系统、私教 NPC、器械购买或长期训练计划。
- 不直接刷战斗技能熟练度，避免抢拳馆、MMA馆、武馆定位。
- 不改战斗规则、敌人 AI、Phaser 舞台或主线结构。

主要验证：
- Node 语法解析。
- 浏览器 smoke：地图出现健身房，可移动，行动卡可渲染。
- 健身房小游戏正确/错误输入可推进，结算属性、疲劳、金钱、时间和日志。
- 保存读取后仍能停留在健身房。
- 桌面、平板、手机三档无横向溢出。

## 2026-05-20 Batch 8

目标：提升交互反馈、经济/交通策略、体力分层和 P5 风格 UI 外壳。

本轮要做：
- 移除技能页“练习”按钮，避免直接在技能栏无限刷熟练度。
- 技能页展示当前属性下的伤害、架势、命中、体力、风险、距离和推荐训练地点。
- 新增中央结算反馈，行动/训练/事件/复盘/战斗后显示获得和失去。
- 地图移动改为出行选择弹窗，加入散步、跑步、共享单车、公交、地铁、打车。
- 新增体能点 `fitXp`，体力型出行可积累并带来小幅基础成长。
- 深度重调行动收益、训练成本、恢复成本、战斗奖励和商品价格。
- 战斗体力与大地图日常体力分层，战后恢复大部分日常体力。
- 追加 P5 风格斜切 UI 外壳，优化战斗文字清晰度和停留时间。

本轮不做：
- 不拆分单文件项目。
- 不使用参考图作为直接素材。
- 不新增大型依赖。
- 不改 30 天主线和核心战斗伤害公式。

主要验证：
- Node 语法解析。
- 技能页无练习按钮且有伤害预览。
- 出行弹窗 6 种交通方式可结算并限制资源不足。
- 训练/事件/复盘/战斗均有中央结算反馈。
- 低日常体力进入战斗可正常出招，战后日常体力不会被打空。
- 三档响应式与战斗 Phaser 特效无错误。

完成状态：
- Batch 8 已完成并通过自动化 smoke。
- 下一轮如果继续，优先从 30 天游玩曲线、经济压力和 P5 风格观感微调入手，不要重新拆架构。

## 2026-05-20 Batch 9

目标：重塑人物属性、资源和技能熟练度的可见作用，避免属性点臃肿但无反馈。

本轮要做：
- 保留 8 项基础属性，但每项都接入明确公式和说明。
- 新增“人物属性”独立窗口，左侧状态栏不再展示完整属性网格。
- 鼠标悬停、键盘聚焦或手机点击属性卡时显示该属性影响。
- `fitXp` 改为“体能沉淀”，在属性页展示等级、进度和速度/耐力/平衡派生加成。
- `face` 保留为旧存档兼容字段，但不再作为玩家可见资源展示。
- 让热度、速度、判断、抗打、装备 `dodge/risk/headRes`、流派点和技能熟练度都有实际战斗或事件影响。

本轮不做：
- 不删 8 项基础属性。
- 不新增天赋树、转职、会员系统或新大玩法。
- 不重做主线、敌人结构、Phaser 舞台或核心战斗表现层。

主要验证：
- Node 语法解析。
- 浏览器 smoke：新开局、人物属性页、属性说明、左侧面板收口、体能沉淀。
- 数值 smoke：速度、判断、抗打、体能沉淀对预览或派生值有影响。
- 战斗回归 E01 / E06 / E07 / E18。
- 1365x768、900x700、390x844 响应式检查。
- Chrome 截图检查人物属性页和 Phaser 战斗舞台。

完成状态：
- Batch 9 已完成并通过 Node、Chrome 自动化 smoke、响应式和截图检查。
- 下一轮如果继续，优先做 30 天游玩曲线实测或人工体验调味，不要重新拆属性结构。

## 2026-05-20 Batch 10-13

目标：按用户新要求将当前原型迁移为模块化 Phaser UI，重塑战斗敌人 AI、P5 风格视觉资产、体能/经济/事件系统。

本轮要做：
- 保留入口 `E:\TH比赛照片\maws_30day_overhaul_v3.html`，将逻辑拆到 `E:\TH比赛照片\maws_src\`。
- 使用本地 Phaser vendor，不新增远程 CDN。
- 新增全局 Phaser UI：地图、人物、技能、背包、商店、关系、日志、自检、战斗均由 Phaser Scene 渲染。
- 战斗改为逐招交换：玩家每个行动后，敌人根据 AI 性格、距离、体力、架势、受击结果立即回应。
- 新增原创 P5 风格 generated asset manifest，生成背景和角色/头像资产，不直接使用参考图。
- 让 `fitXp` 进入通用收益流程；便利店搬货、工地临工和健身房训练均能获得体能沉淀。
- 新增 `BALANCE_V2` 与 `EVENT_RULES`，统一资源压力与机会卡加权。

本轮不做：
- 不使用远程资源或 CDN。
- 不直接复刻/嵌入用户参考图。
- 不删除旧存档 key；必须兼容 `maws_overhaul_save`。

主要验证：
- Node module import/语法检查。
- 旧存档迁移到 `4.1-phaser-ui`。
- 新开局、地图、人物属性、技能、背包、商店、NPC、日志、自检可进入。
- E01 / E06 / E07 / E18 战斗可进入，并验证敌人逐招回应。
- 搬货、工地、健身房能增加体能沉淀。
- 1365x768、900x700、390x844 截图检查无横向溢出，战斗伤害数字不被 HUD 遮挡。

## 2026-05-20 Batch 10 continuation

目标：在已拆出的 Phaser 版本上恢复中断任务，先修当前可验证缺口，不继续扩大架构范围。

本轮要做：
- 读取现有 checkpoint 和 `E:\TH比赛照片\maws_src\` 当前实现，确认真实中断点。
- 继续使用 Phaser 全局 UI，不回退到单文件 DOM 版本。
- 修复手机/平板 Phaser HUD、地图、底部导航和战斗技能卡的明显遮挡。
- 修复 E07 远距下玩家选错距离动作时敌人没有逐招回应的问题。
- 接收并验证一小批原创 P5 风格 generated SVG 资产。
- 更新 checkpoint 文件，保证下一窗口能从文件恢复。

本轮不做：
- 不重拆 Scene 架构，不强行把 `ShellScene` 继续拆成多个 Scene。
- 不改数值、经济曲线、主线剧情或敌人配置。
- 不新增远程 CDN 或大型依赖。
- 不继续扩大到 portrait 全量重绘。

主要验证：
- Node 语法/import 检查。
- 资产 manifest 文件存在、无内嵌中文/文本标签、旧存档迁移到 `4.1-phaser-ui`。
- 新开局后地图、人物、技能、背包、商店、关系、日志、自检均可进入。
- 搬货、工地、健身房行动均能增加体能沉淀。
- E01 / E06 / E07 / E18 均能启动并产生敌方逐招回应。
- 1365x768、900x700、390x844 地图和战斗截图无横向溢出。

## 2026-05-20 Batch 11

目标：按最新计划修复 Phaser UI 低清、文字重叠、技能说明缺失和战斗站桩问题，并接入首批全量美术资产包。

本轮要做：
- 继续以 `E:\TH比赛照片\maws_30day_overhaul_v3.html` 为入口，源码仍在 `E:\TH比赛照片\maws_src\`。
- 主 UI 走 P5 硬派写实，技能卡走精致像素卡牌并融合 P5 红黑白切边。
- 增加 DOM 文字层，HUD、导航、主面板、技能卡、弹窗和 toast 使用 DOM/CSS 呈现，Phaser 只负责背景、人物和战斗表现。
- 扩展资产 manifest，保留旧 SVG key 兼容，并新增 backgrounds/characters/portraits/items/icons/skillCards/ui/vfx 分组。
- 接入首批项目内可加载资产，覆盖背景、人物、技能卡、资源/道具/导航图标和战斗 VFX。
- 恢复并增强技能卡说明，移动端也显示伤害、架势、命中、体力、风险、距离、效果说明和不可用原因。
- 重做战斗表现入口，让新增 `combat.steps[*].fx` 播放位移、抖动、伤害数字、MISS/GUARD/HEAVY/TAKEDOWN/眩晕和镜头震动。

本轮不做：
- 不改战斗公式、敌人配置、30 天主线、经济曲线或存档 key。
- 不删除旧 manifest key 或旧 SVG fallback。
- 不直接复刻参考图。
- 不引入远程资源、大型依赖或 CDN。

主要验证：
- Node 语法检查。
- Manifest 文件存在和可加载检查。
- 浏览器 smoke：页面能打开、无 JS runtime error、主要 tab 可进入、保存/读档不坏。
- E01/E06/E07/E18 战斗可进入，一轮后有 enemy step 和可见即时反馈。
- 1365x768、900x700、390x844 地图、技能页和战斗页无横向溢出、无核心文字遮挡。

## 2026-05-20 Batch 11.2

目标：收尾 Batch 11 的像素 PNG 资产接入，让 manifest 主路径真正使用项目内 raster 像素资源，并完成浏览器验证。

本轮做了：
- 读取根目录日志、`docs/CURRENT_*`、`task_plan.md`、`findings.md`、`progress.md` 和目标项目当前源码。
- 确认 `E:\TH比赛照片\assets\imagegen_pixel` 已有完整 PNG 资产包。
- 仅修改 `E:\TH比赛照片\maws_src\assets\manifest.js`，把 backgrounds/characters/portraits/items/icons/skillCards/ui/vfx 的主路径切到 PNG。
- 保留旧 `assets/generated/*.svg` fallback 元数据，不删除旧资源。
- 验证 Phaser BootScene 能加载 65 个 PNG manifest 资源。

本轮不做：
- 不改战斗公式、敌人配置、经济曲线、主线剧情或存档 key。
- 不重构 DOM UI 或 Phaser Scene 架构。
- 不生成新玩法，不删除旧 SVG fallback。

主要验证：
- 16 个 `maws_src` JS 文件 `node --check`。
- `maws_src/tools/verify_assets.mjs`。
- 浏览器 smoke：页面启动、无 JS runtime error、无资源失败、主要 tab 可进入、保存/读档可用。
- E01/E06/E07/E18 战斗一轮后均有 enemy step 和 FX step。
- 1365x768 地图、900x700 技能页、390x844 战斗页截图无横向溢出。

## 2026-05-20 Batch 11.3

目标：从中断处继续地点视觉与 UI 改版，让地点页保留中间背景画面空间，并让主角和在场 NPC/对手入镜。

本轮先做计划：
- 已根据用户要求先整理总计划，不继续实现代码。
- 总计划文件：`docs/VISUAL_UI_ASSET_PLAN.md`。

后续实现要做：
- 为地点背景增加昼/夜选择入口，日间优先使用 `assets/imagegen_shenzhen_sun`，夜间使用现有夜景/旧像素 fallback。
- 地图/地点页 DOM UI 改为边缘信息栏 + 中央场景舞台，减少大面板遮挡背景。
- 在地点舞台叠加主角和当前地点相关 NPC/对手，先复用现有透明角色/头像资产，不直接嵌入参考图。
- 顶部资源条和底部导航参考新 UI 的黑红金漫画语言，但不重做所有页面。

本轮不做：
- 不改战斗公式、敌人配置、经济曲线、主线剧情和存档 key。
- 不把用户参考图直接裁切或接入项目资产。
- 不一次性重写所有 tab 页面。

主要验证：
- `node --check` 覆盖修改 JS。
- `maws_src/tools/verify_assets.mjs`。
- 浏览器 smoke：地图页可打开、主要 tab 可进、地点切换可用、昼夜背景 key 可解析。
- 截图验证桌面地图、夜间/日间地点、移动端地图无横向溢出，中央背景和角色可见。

## 2026-05-20 Batch 11.4

目标：执行 `docs/VISUAL_UI_ASSET_PLAN.md` Phase 1，让地点页以中间场景画面为主，并清理不再被运行时引用的旧资产。

本轮做了：
- Manifest 增加 home/store/worksite/park/boxing/wuguan/mma/gym/physio/street 的 day/night 背景 key，并移除旧 `assets/generated` fallback 引用。
- `buildRenderModel()` 输出当前昼夜、地点场景、背景 key、开放状态和场景角色。
- DOM 地图页改为左侧地点栏 + 中央场景舞台 + 右侧行动栏；中央舞台显示当前地点背景、主角和相关 NPC/对手。
- Phaser 背景读取 `locationScene.backgroundKey`，与 DOM 场景昼夜背景保持一致。
- 清理运行时不再引用的旧生成资产，保留疑似用户源素材。

本轮不做：
- 不改战斗公式、敌人配置、经济曲线、主线剧情、存档 key 或迁移逻辑。
- 不删除未经确认的用户源照片/参考素材。
- 不一次性重做所有页面或生成最终全套 NPC 立绘。

主要验证：
- `node --check` 覆盖 `maws_src` 16 个 JS 文件。
- `maws_src/tools/verify_assets.mjs` 验证 78 个 manifest 条目。
- Browser smoke 覆盖页面打开、主要 tab、地点切换、保存/读档、手机夜间街区、E01 战斗一回合。
- 1365x768、900x700、390x844 截图检查无横向溢出，中央背景和角色可见。

## 2026-05-20 Batch 11.5

目标：继续地点页视觉闭环，把 Batch 11.4 中的 NPC token 占位替换成项目内透明像素 standee。

本轮做了：
- 新增 8 张 512x768 透明 PNG 立绘：刘胖子、小满、工友、拳馆教练、武馆师傅、健身房教练、理疗师、陈见锋。
- Manifest 新增 `scene.npc.*` 稳定 key，后续换正式美术不需要改 UI 代码。
- `buildRenderModel()` 的场景人物映射接入 `NPC_SCENE_ASSETS`，已有地点人物和主线 NPC 若有资源会自动从 token 升级为 standee。
- 保持地点页布局、战斗、经济、敌人、存档 key 不变。

本轮不做：
- 不改战斗公式、敌人数据、经济曲线、主线剧情、存档 key 或迁移逻辑。
- 不删除用户源照片/参考素材。
- 不把这批程序化像素立绘伪装成最终精修美术。

主要验证：
- `node --check` 覆盖 `maws_src` 16 个 JS 文件。
- `maws_src/tools/verify_assets.mjs` 验证 86 个 manifest 条目。
- 浏览器 smoke 覆盖 10 个地点场景、主要 tab、900x700、390x844 和 E01 战斗回归。
## 2026-05-20 Batch 11.6

目标：按用户要求用 built-in `imagegen` 生成正式城市总览美术资产，并把它们最小接入当前地图页。

本轮做了：
- 生成并保存 `assets/imagegen_city_map/bg_city_map_day.png` 与 `assets/imagegen_city_map/bg_city_map_night.png`。
- 新增 `bg.city.map.day` / `bg.city.map.night` manifest key。
- `buildRenderModel()` 新增 `cityMap` 字段，按昼夜返回城市总览背景和地点标记。
- 地图页新增城市总览层，地点标记可点击打开原有出行弹窗；移动端标记改为图标模式避免文字重叠。
- `verify_assets.mjs` 允许 `assets/imagegen_city_map` 作为项目资产根。

本轮不做：
- 不重做全部地点日夜背景。
- 不重做 NPC/主角/敌人最终立绘。
- 不改战斗公式、敌人数据、经济数值、地点出行距离、存档 key 或迁移逻辑。

主要验证：
- `node --check` 覆盖 `maws_src` JS 文件。
- `maws_src/tools/verify_assets.mjs` 验证 88 条 manifest。
- Chrome smoke：城市图日夜加载、10 个地点标记、桌面标记打开出行弹窗、主 tab、保存、E01 一回合。
- 1365x768、900x700 夜景、390x844 截图均无横向溢出，地点标记重叠检测为 0。

## 2026-05-20 Batch 12

目标：在现有 Phaser + DOM/CSS 架构上做小范围可验证改动，解决大地图常驻、战斗底部 UI 遮挡、结算显示 `[object Object]`、角色透明边毛躁、地图点位太挤和缺少 hover/focus 反馈的问题。

本轮要做：
- 地图页默认只显示当前地点场景、地点列表和行动栏；城市大地图改为 overlay，由底部地图入口或地点页“查看城市地图”打开。
- 城市地图 overlay 使用现有 `bg.city.map.day/night`，标记坐标保持更松散的深圳式分区，并增加 hover/focus/tap 状态提示。
- 战斗底部 `.maws-combat-dock` 改为低矮命令条：默认只显示技能名、伤害、命中、体力/AP 等关键字段，详细说明放到 hover/focus/选中浮层。
- 移动端战斗 UI 压缩顶部状态条，底部技能带横向滑动；战斗日志在移动端收起为按钮/浮层。
- `renderModal()` 正确渲染结构化结算行，避免页面出现 `[object Object]`。
- 轻量调整 `LOC_POS` 和 `TRAVEL_TUNING`，只让城市跨区移动成本/耗时更像现实，不改 30 天经济大平衡。
- 非破坏式清理现有角色 PNG 到 `assets/imagegen_pixel/characters_clean`，manifest 指向 cleaned 版本，原图保留。

本轮不做：
- 不改战斗伤害公式、敌人属性、技能数值、主线剧情、存档 key 或存档版本。
- 不重新生成整套角色或地点素材。
- 不删除用户源照片/参考素材。
- 不做全页面 UI 重写。

主要验证：
- `node --check` 覆盖 `maws_src` 全部 JS；运行 `maws_src/tools/verify_assets.mjs`。
- 浏览器 smoke：页面无 console/page error，`map/profile/skills/bag/shop/npc/log/check` 可进入，保存/读档仍为 `maws_overhaul_save` 和 `4.1-phaser-ui`。
- 地图：默认无常驻 `.maws-city-map`；点击打开 overlay；关闭、切 tab、进入 E01 战斗后 overlay 消失；三档 marker 不重叠。
- 战斗：E01/E06/E07/E18 可进入，一回合后仍有 enemy step 和 FX；底部 dock 不遮住角色主体，移动端无横向破版。
- 结算：强制打赢 E01 后显示现金/名声/体力/复盘项，页面文本不包含 `[object Object]`。
- 截图：1365x768、900x700、390x844 覆盖地图 overlay、地点页、战斗页、战斗结算页。

完成状态：
- Batch 12 已完成并通过验证。
- 地图页默认回到当前地点场景，城市大地图改为按需 overlay；底部地图入口和地点页“查看城市地图”都可打开。
- 城市 overlay 10 个地点标记在 1365x768、900x700、390x844 下均不重叠；关闭、切 tab、打开出行弹窗和进入战斗都会收起 overlay。
- 战斗底部命令区已压缩为低矮技能条，移动端顶部状态条压缩，战斗日志移动端收起；技能卡本体和按钮都可加入队列。
- `renderModal()` 已正确渲染结构化结算行，强制 E01 胜利结算不再出现 `[object Object]`。
- `LOC_POS` 与 `TRAVEL_TUNING` 已做轻量现实化调整，但没有改战斗伤害公式、敌人属性、技能数值、主线、存档 key 或存档版本。
- 13 张 cleaned 角色 PNG 已进入 `assets/imagegen_pixel/characters_clean` 并由 manifest 使用，原图保留。

## 2026-05-20 Batch 13

目标：按用户反馈参考 `maws_fusion_enhanced_demo.html` 的 UI 语言，让当前版本更接近红黑金漫画式界面；补上点击特效；继续处理主角抠图/可见性；尽量减少 placeholder 资产的违和感。

本轮做了：
- 对现有 DOM/CSS 做小范围视觉升级：HUD、底部导航、地点栏、行动栏、城市地图 overlay、modal、按钮、场景角色框架都改成红黑金斜切纸片、厚黑投影和更强的视觉层级。
- 新增全局点击/tap 爆点反馈：所有 `[data-action]` 点击都会出现短暂的红金方形/火花特效，城市 marker 也走同一套反馈。
- 主角场景图改为 eager 加载并加 `fetchpriority="high"`，避免首次进入时只出现姓名牌/背光、人物本体晚加载。
- 重新处理 `assets/imagegen_pixel/characters_clean/fighter_player.png`：去残边、轻微提亮、加薄红/米色漫画描边，使黑衣角色在出租屋暗部和战斗场景里都更清楚。
- 对 placeholder-quality NPC standee 做视觉降权：缩小、降低存在感、保留清晰标签，避免它们抢掉主角和场景画面。

本轮不做：
- 不改战斗公式、敌人数据、经济数值、出行调参、存档 key/version。
- 不重画完整 NPC/地点背景资产包。
- 不直接复制或嵌入参考 HTML 的资源。

主要验证：
- `maws_src` 16 个 JS 文件 `node --check`。
- `maws_src/tools/verify_assets.mjs` 验证 88 条 manifest entries。
- 主角 PNG 结构检查：512x768、画布边缘透明、可见像素存在。
- Chrome smoke：开局、保存、人物 tab、城市 overlay、城市 marker 点击特效、出行 modal、E01 公园战斗推进、1365x768/900x700/390x844 响应式无横向溢出。

完成状态：
- Batch 13 已完成并通过验证。
- 最新可视检查截图在 `E:\TH比赛照片\test-results\batch13_smoke_location_1365x768.png`、`batch13_smoke_city_1365x768.png`、`batch13_smoke_combat_1365x768.png`、`batch13_smoke_location_900x700.png`、`batch13_smoke_location_390x844.png`。

## 2026-05-20 Batch 14

目标：继续用户要求的战斗 UI、文案和角色 standee 收尾，但严格不碰战斗公式、敌人、经济、出行调参、存档 key/version 和核心架构。

本轮做了：
- 确认 Batch 14 已有改动：战斗 UI 已做更干净的 P5 风格压缩，数值/技能/事件文案已重写，主角和场景 NPC standee 已替换到透明 512x768 PNG。
- 修复手机底部导航重叠和层级问题。
- 修复手机战斗选中技能后详情面板进入流内布局、把确认按钮挤出视口的问题。
- 更新 checkpoint：`task_plan.md`、`progress.md`、`findings.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md`，并同步目标项目 `E:\TH比赛照片\docs`。

本轮不做：
- 不改战斗公式、敌人属性、经济曲线、出行调参、存档 key/version。
- 不重画完整 NPC/地点背景资产包。
- 不做 30 天经济曲线长跑。

主要验证：
- 19 个 JS/MJS 文件 `node --check`。
- `maws_src/tools/verify_assets.mjs` 验证 88 条 manifest entries。
- 9 张 runtime standee PNG 结构检查：512x768、透明画布边缘、可见像素存在。
- Chrome smoke：1365x768、900x700、390x844；开局、tab、保存、城市 overlay、E01 战斗选技能确认、E01/E06/E07/E18 直接战斗回归。

完成状态：
- Batch 14 已完成并通过验证。
- 手机端选技能后确认按钮保持在视口内：`bottom=826` / `innerHeight=844`，无横向溢出。
- 最新截图在 `E:\TH比赛照片\test-results\batch14_final_location_desktop.png`、`batch14_final_combat_desktop.png`、`batch14_final_location_tablet.png`、`batch14_final_combat_tablet.png`、`batch14_final_location_mobile.png`、`batch14_final_combat_mobile.png`。

## 2026-05-20 Batch 15

目标：实现“可玩闭环”第一批，不做全量终局重构。保留 Phaser 做背景、角色、动画和特效，复杂 UI 改为 DOM。战斗改成短窗口半即时制：选卡后双方自动打一小段，然后暂停给玩家重新调整。

本轮做了：
- 地图页加入今日主线和今日待办，复用 `MAIN_EVENTS` 和 `buildOpportunities()`。
- 背包页加入 5 个装备槽，支持装备、替换、卸下和效果摘要。
- 训练小游戏先做 2 个模板：节奏点击类、判断选择类；接入 `gym_basic` 和 `bag`。
- 行动卡显示预计消耗和预计收益。
- 战斗 DOM UI 重做：P5 风格技能卡、目标选择、队列、自动窗口状态、战斗日志。
- 战斗逻辑改为短窗口半即时制基础版，保留旧存档兼容。
- 新增 spritesheet manifest 和首批动画资产底座：player、enemy_boxer、enemy_grappler、enemy_weapon、enemy_boss 和基础 VFX。

本轮不做：
- 不改 `maws_overhaul_save` key。
- 不删除旧 standee 和旧 skill card。
- 不一次性覆盖全敌人/全技能最终动画。
- 不做完整 30 天经济曲线重平衡。

主要验证：
- `node --check` 覆盖 `maws_src` JS/MJS。
- `node maws_src/tools/verify_assets.mjs` 支持 image 和 spritesheet manifest。
- PNG/spritesheet 结构检查。
- Chrome 三档 smoke：1365x768、900x700、390x844。
- 主线、待办、装备/卸装、训练小游戏、E01/E06/E07/E18 半即时战斗、认输/结算/复盘、保存读档。

完成状态：
- Batch 15 已完成并通过验证。
- 主线/待办、装备栏、训练小游戏、DOM 战斗 UI、短窗口半即时制、spritesheet manifest 和首批动画底座已经落地。
- 最新截图在 `E:\TH比赛照片\test-results\batch15-desktop-map.png`、`batch15-desktop-combat.png`、`batch15-tablet-map.png`、`batch15-tablet-combat.png`、`batch15-mobile-map.png`、`batch15-mobile-combat.png`。

下一批建议：
- 把程序化 replaceable sprite strips 替换为正式 imagegen/手绘逐帧资产，保持现有 `anim.*` key 和 frame metadata。
- 继续补全其余训练小游戏、其余敌人和技能动画，不要扩大到经济曲线重平衡，除非单独开批次。

## 2026-05-20 Batch 16

目标：按用户要求，用 `game-design-core` 审计当前战斗循环，并用 `combat-design` 做一轮最小半即时战斗体验重构。范围限定在战斗选择反馈、自动窗口可读性和 DOM 呈现，不扩展到全量动画资产、敌人数值、经济或存档结构。

本轮做：
- 审计 Batch 15 的短窗口战斗循环，确认核心问题不是公式缺口，而是玩家在确认前缺少“对手接下来要干什么”的读板信息，导致选择卡牌更像盲按。
- 在规划态加入敌方意图读板：预判动作、危险等级、文字 telegraph、建议反制和恢复/惩罚提示。
- 自动窗口改为按队列长度、实际 steps 和敌方危险度估算 8-12 秒节奏，并写入 `lastWindow.duration`。
- 自动窗口补充压力标签：试探交换、中压交换、高压交换，用于日志和 HUD 反馈。
- DOM 战斗 UI 加入读板模块和当前窗口预计时长提示。

本轮不做：
- 不改战斗伤害公式、命中公式、敌人 HP/属性、经济曲线、装备数值、存档 key/version。
- 不做完整 frame-data、hitbox/hurtbox、i-frame 或实时插卡系统。
- 不新增或替换角色动画资产。

主要验证：
- `node --check` 覆盖 `maws_src` 全部 JS/MJS。
- `node maws_src/tools/verify_assets.mjs`。
- 1365x768 和 390x844 浏览器 smoke：读板显示、选卡更新读板、确认后自动窗口推进并回到 planning。
- E01/E06/E07/E18 战斗回归：均能进入、执行窗口、写入时长/压力、回到 planning。

完成状态：
- Batch 16 已完成并通过验证。
- 当前半即时战斗已经具备“读板 -> 选卡 -> 自动窗口 -> 复盘调整”的最小闭环。
- 最新截图在 `E:\TH比赛照片\test-results\batch16_combat_read_1365x768.png`、`E:\TH比赛照片\test-results\batch16_combat_read_390x844.png`。

## 2026-05-20 Batch 17

目标：建立项目级 Skill Router，让 Codex 和协作 Agent 不需要用户记住所有 skill 名，也能按任务类型自动选择最合适的 2-4 个 skill。

本轮使用 skill：
- `technical-writer`：把路由规则写成短、可执行、能长期维护的项目文档。
- `consistency-checker`：检查 `AGENTS.md`、`docs/SKILL_ROUTER.md` 和 checkpoint 之间规则一致。

本轮做：
- 在 `AGENTS.md` 新增“技能自动路由”开工流程。
- 新增 `docs/SKILL_ROUTER.md`，按战斗、UI、资产、数值、文案、QA、GitHub、文档等任务类型建立路由表。
- 明确本项目是 Phaser + DOM，不默认启用 Godot 系列 skill。
- checkpoint 记录 Batch 17 的实际使用 skill 和验证结果。

本轮不做：
- 不改游戏代码、玩法、数值、资产 manifest、存档 key/version。
- 不安装新依赖，不做全局 Codex 配置覆盖。
- 不默认启用 Godot skill。

主要验证：
- 文档检查：确认 `AGENTS.md` 能指导 Agent 开工前读取并应用 `docs/SKILL_ROUTER.md`。
- 路由检查：用 6 个模拟任务验证可选出正确 skill。
- Git 检查：`git diff --check`。

完成状态：
- Batch 17 已完成并通过文档级验证。
- 后续窗口应先读取 `AGENTS.md`、checkpoint 和 `docs/SKILL_ROUTER.md`，再自动声明本轮 skill。

## 2026-05-21 Batch 19

目标：把 30 天 demo 从线性主线扩成最小可选叙事闭环，并新增散打、空手道、跆拳道三条现实武术支线的第一可玩切片。

本轮使用 skill：
- `planning-with-files`：续接中断任务，文件化计划、发现、进度和下一窗口恢复路径。
- `storytelling`：约束主线选择和 NPC 文案，让中文反馈自然、不油。
- `combat-design`：为新增武术技能、敌人读板和战斗反馈保持可读性。
- `game-studio:game-ui-frontend`：处理 story-choice modal、地点/流派扩展后的 UI 密度和移动端不溢出。
- `game-studio:game-playtest`：跑真实浏览器 smoke 和截图检查。

本轮做：
- 新增三条支线的数据闭环：流派、地点、NPC、训练行动、技能、敌人、机会卡和主线日程。
- 新增 day 1/day 18 主线选择弹窗，选择提交后再完成当天主线。
- 补齐 `combat.js`、`economy.js` 对新技能/敌人/流派的运行时映射。
- 地图按钮展示主线位置、开放时间和行动数量；人物页以网格显示扩展流派。
- 更新 Batch 19 checkpoint、测试报告和 changelog。

本轮不做：
- 不改存档 key/version。
- 不新增专属场馆美术资产。
- 不重构 Phaser Scene。
- 不做完整 30 天长线平衡。

主要验证：
- `node --check`：`data.js`、`state.js`、`ui.js`。
- `npm run build`。
- Node story-choice smoke。
- `git diff --check`。
- Chrome 浏览器 smoke：主线选择、新地点、训练解锁、技能装备、E19 战斗入口、移动端 modal 不溢出。

完成状态：
- Batch 19 已完成并通过验证。
- 最新截图在 `E:\TH比赛照片\test-results\batch19-story-choice-desktop.png`、`batch19-sanda-combat-desktop.png`、`batch19-story-choice-mobile.png`。

## 2026-05-21 Batch 20

目标：继续 `docs/TASK_PLAN.md` 的 Batch 20，把 MAW 主线数据、状态迁移、战斗模板和事件因子补成最小可验证骨架。

本轮使用 skill：
- `planning-with-files`：恢复任务日志并更新 checkpoint。
- `storytelling`：约束父亲、一阵风、阿豹和百家入茂节点文案。
- `consistency-checker`：检查 `data.js` / `state.js` / `combat.js` / `events.js` 同步。

本轮做了：
- `data.js`：补父亲、阿豹、推手大爷；新增 E10/E11；补 Day 2/3/8/9/12/29，保留 Day 1 的 Batch 19 路线选择。
- `state.js`：新增 `state.maw`、旧档迁移、`updateMawProgress()`、Day 8/9 主线脚本效果和 render model 暴露。
- `combat.js`：同步 E10/E11 运行时模板，给阿豹补最小专用回应。
- `events.js`：补 MAW factor 和 `when` 条件支持。
- 更新 `docs/TASK_PLAN.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md`。

本轮不做：
- 不改 UI 布局、Phaser Scene、资产 manifest、经济曲线、战斗公式、存档 key/version。
- 不做 Day 8 一窗口强制剧情失败专用结算。
- 不做 Day 30 目标制终战完整结算。
- 不做拳谱 UI 呈现。

完成状态：
- Batch 20 已完成并通过静态检查、`npm run build`、`git diff --check` 和专项 Node MAW smoke。

## 2026-05-21 Batch 21-23

目标：执行 Batch 21-23，把 Batch 20 的 MAW 骨架做成可见、可打、可结局的最小闭环。

本轮做了：
- 人物页新增茂家拳重铸面板，Day 9 前弱显示，Day 9 后显示 5 个模块、下一建议和拳谱条目。
- 战斗读板新增反制技能、失败原因、队列建议和更明确的危险提示。
- Day 30 最终战新增 6 个目标，并按完成数分为大胜、小胜、惜败、崩盘。

本轮不做：
- 不改存档 key/version。
- 不改战斗伤害/命中公式、敌人属性、经济曲线或资产 manifest。
- 不重构 Phaser Scene。
- 不实现 Batch 20 风险项里的 Day 8 强制剧情失败。

完成状态：
- Batch 21-23 已完成并通过 build、Node smoke、浏览器 smoke 和 diff whitespace 检查。
