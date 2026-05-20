# Visual UI And Asset Master Plan

## Goal

把当前原型从“UI 面板盖在背景图上”改成“地点场景是主画面，UI 服务于场景”的版本。重点解决：

- 城市缺少人气：每个地点要有主角和在场 NPC/对手入镜，背景里也要有普通市民、学员、店员、工人、围观者等生活痕迹。
- UI 压住画面：每个地点中间必须留出清晰的背景图空间，信息和操作尽量放到顶部、底部和左右边缘。
- 昼夜不一致：地点资产需要成组生成日间/夜晚版本，构图、机位、主要物件、人物活动逻辑保持一致。
- 大地图不足：后续需要一张城市大地图作为地图页主视觉，并能承载地点标记、昼夜氛围和路线关系。

## Hard Boundaries

- 不改战斗公式、敌人配置、经济曲线、行动收益、主线剧情、存档 key。
- 不直接复制、裁切、嵌入用户参考图。参考图只作为 UI 构图、氛围和资产规格参考。
- 不一次性重写所有页面。先做地图/地点页闭环，再扩展到关系、日志、商店、人物等页面。
- 不引入远程 CDN 或大型依赖。继续使用本地 Phaser + DOM/CSS。

## Visual Direction

- 类型：现代深圳感城市武术模拟器，硬派漫画/P5 风格 UI，偏现实但带游戏化切边。
- 城市气质：暖、有生活感、不是空城。路边店、工地、健身房、拳馆、武馆、旧城区都要有人在做事。
- UI 材质：黑底、红色撕裂切边、金色强调、少量蓝/绿资源色；按钮像实体贴片，不像 SaaS 卡片。
- 场景机位：地点页优先横向宽画幅，中间保留人物站位和可读背景；UI 从边缘贴入。
- 文字：中文自然、短句、可读，不堆说明文。

## Target Screen Types

### 1. City Map Screen

用途：显示整座城市和可去地点。

布局：
- 背景为大地图全屏图。
- 顶部：日期、时间、阶段、核心资源条。
- 底部：主导航和睡觉/保存。
- 地点标记直接放在地图上，使用漫画标签和小图标。
- 不再用大列表遮住地图。

需要资产：
- `bg_city_map_day.png`
- `bg_city_map_night.png`
- 地点标签图标或可由 DOM/CSS 生成的贴片。

后续增强：
- 不同时间段色调变化：上午、下午、夜晚、深夜。
- 地点状态：开放、关闭、当前地点、主线事件、风险事件。

### 2. Location Scene Screen

用途：玩家进入某个地点后的日常行动选择。

布局：
- 中间 60-70% 视口保留给地点背景和入镜角色。
- 左上或左侧小面板：地点名、短描述、当前状态。
- 右侧：本地点可执行行动列表。
- 底部：导航保持，但不遮挡主要人物脚下位置。
- Toast/提示居中上方，短暂停留。

入镜规则：
- 主角必须入镜，默认站在画面左中或左下三分之一。
- 当前地点相关 NPC 入镜：
  - 出租屋：房东阿姨/刘胖子按事件或关系显示。
  - 便利店：店长/小满/顾客。
  - 工地：工头/工友。
  - 公园：拳击新人/大爷/围观者。
  - 拳馆：梁教练/陪练。
  - 武馆：周青山/弟子。
  - MMA馆：前辈/学员。
  - 健身房：普通会员/教练。
  - 理疗店：理疗师/候诊者。
  - 旧城区：线人/混混/路人。

### 3. Event / Choice Screen

用途：地点事件、NPC 对话、机会卡、行动分支。

布局：
- 场景图仍为主体，主角和 NPC 在画面中对峙或交谈。
- 左下：短叙事文本和主角心理。
- 右侧：选择列表，每个选择展示成本与预览收益。
- 不使用全屏纯面板，避免失去现场感。

### 4. Combat Screen

用途：战斗表现。

布局参考现有战斗图方向：
- 背景占主屏，双方角色站在中间。
- 顶部左右显示双方状态条。
- 底部技能卡，不遮住角色上半身。
- 右侧日志为半透明窄栏。

本计划暂不改战斗数值，只在后续统一 UI 外观和背景昼夜。

## Asset Generation Plan

### Batch A: Big City Map

目标：先生成可用的大地图主视觉，支撑地图页改版。

资产清单：
- `assets/imagegen_city_map/bg_city_map_day.png`
- `assets/imagegen_city_map/bg_city_map_night.png`

规格：
- 推荐 3840x2160 或 2048x1152 横图。
- 同一俯视/高位斜俯视机位。
- 深圳感海湾城市：高楼、城中村、工地、商业街、公园、拳馆/武馆/MMA馆、旧城区、出租屋区域。
- 留出地点标记空间：不要让关键地标全挤在边缘。
- 日夜版本构图一致，夜间保留霓虹和道路灯流，日间保留阳光和生活活动。

验收：
- 地点标记放上去后不互相遮挡。
- 16:9 桌面和 390px 手机裁切后仍能看出城市结构。
- 不出现乱文字、错误中文招牌、明显 AI 融合错误。

### Batch B: Location Day/Night Background Pairs

目标：为 10 个地点补齐昼夜一致背景。

资产清单：
- `bg_home_day.png` / `bg_home_night.png`
- `bg_store_day.png` / `bg_store_night.png`
- `bg_worksite_day.png` / `bg_worksite_night.png`
- `bg_park_day.png` / `bg_park_night.png`
- `bg_boxing_day.png` / `bg_boxing_night.png`
- `bg_wuguan_day.png` / `bg_wuguan_night.png`
- `bg_mma_day.png` / `bg_mma_night.png`
- `bg_gym_day.png` / `bg_gym_night.png`
- `bg_physio_day.png` / `bg_physio_night.png`
- `bg_street_day.png` / `bg_street_night.png`

规格：
- 推荐 2048x1152 横图。
- 每对昼夜图保持同一机位、同一主要物件、同一可站位地面区域。
- 背景要有人气，但不要把主角/NPC画死在背景里；普通路人可以在远景或边缘。
- 中间留出主角和 NPC 的叠加空间。

验收：
- 每个地点一眼能分辨功能，不靠文字解释。
- 日夜切换不跳机位。
- 主角/NPC叠上去后脚下位置合理。

### Batch C: Scene Character Overlays

目标：补足地点页入镜人物，不再只靠头像。

资产清单：
- 主角日常站姿：`scene_player_idle.png`
- 主角坐姿/听讲/对话：后续可选。
- NPC 半身或全身透明图：
  - `scene_npc_landlady.png`
  - `scene_npc_store_owner.png`
  - `scene_npc_xiaoman.png`
  - `scene_npc_coach.png`
  - `scene_npc_master.png`
  - `scene_npc_mma_senior.png`
  - `scene_npc_worker.png`
  - `scene_npc_oldman.png`
  - `scene_npc_physio.png`
  - `scene_npc_informant.png`

规格：
- PNG 透明底。
- 统一像素/漫画写实风格，和背景光向一致。
- 人物高度分层：主角约画面高 45-55%，NPC 35-50%，远景群众更小。

### Batch D: UI Chrome Assets

目标：把参考图里的黑红漫画边框系统资产化，减少纯 CSS 硬拼。

资产清单：
- `ui_frame_top_red.png`
- `ui_frame_bottom_red.png`
- `ui_panel_dark_red_edge.png`
- `ui_button_gold.png`
- `ui_button_red_active.png`
- `ui_chip_resource.png`
- `ui_marker_location.png`

规格：
- 可以先由 CSS 实现，资产化放后续。
- 必须支持九宫格或可重复拉伸，避免不同分辨率变形。

## Implementation Phases

### Phase 1: Current Asset Wiring And Layout Prototype

目标：不等新资产，先用现有日间背景和旧夜景 fallback 做可玩 UI 闭环。

要做：
- `manifest.js` 增加明确 `day/night` 地点背景 key。
- `buildRenderModel()` 增加当前 `timeOfDay`、`locationScene`、`sceneCharacters` 字段。
- `dom/ui.js` 地图页改为场景舞台 + 右侧行动栏 + 左侧地点栏。
- `dom/ui.css` 改出顶部 HUD、底部导航、红黑漫画边框和中央留白。

验证：
- 地图/地点页打开后，背景至少 60% 面积可见。
- 主角和 NPC/对手入镜。
- 主要 tab 仍可进入。
- 三档宽度无横向溢出。

### Phase 2: Big City Map Asset

目标：生成并接入城市大地图。

要做：
- 生成日/夜大地图。
- 加入 `bg.city.map.day/night` manifest key。
- 地图 tab 使用大地图视图和地点漫画标记，不再用地点列表作为主体。

验证：
- 地点标记可点。
- 日夜大地图切换正常。
- 手机端地图可读，可滚动或缩放但不横向破版。

### Phase 3: Location Background Day/Night Pairs

目标：补齐每个地点的昼夜图，替换临时 fallback。

要做：
- 分 2-3 批生成地点背景，不一次生成太多。
- 每批只接入 3-4 个地点，完成截图验收后继续。
- manifest 保留旧 fallback。

验证：
- 每个地点日夜截图。
- 角色脚下位置和 UI 不冲突。

### Phase 4: Character Overlay Pack

目标：让地点页的人物入镜更自然。

要做：
- 生成主角日常透明立绘和 NPC 透明立绘。
- 建立 `SCENE_CAST_BY_LOC` 或等价数据映射。
- 地点页按当前地点、事件、关系显示 1-3 个角色。

验证：
- 出租屋、便利店、拳馆、武馆、MMA馆、公园、旧城区至少各有一名合理 NPC。
- 移动端不遮挡行动按钮。

### Phase 5: Wider UI Page Pass

目标：将新 UI 语言扩展到人物、技能、物品、商城、关系、日志、自检。

顺序建议：
- 人物页：参考现有角色大图 + 属性表布局。
- 技能页：参考技能卡组和战斗预览。
- 商城/物品：参考商品格子 + 右侧详情。
- 关系页：参考 NPC 卡片 + 右侧关系详情。
- 日志页：参考纸张/日程板。

验证：
- 每个 tab 至少一张桌面截图和一张移动端截图。
- 文字不遮挡、按钮可点、状态能推进。

## Acceptance Criteria

- 地图和地点页截图第一眼能看到场景，而不是只看到 UI 面板。
- 每个地点至少有主角入镜；关键地点有一个相关 NPC 或对手入镜。
- 昼夜背景 key 明确，后续替换资产不需要改 UI 代码。
- 大地图资产清单明确，生成后可以直接接入。
- 现有保存、读档、战斗入口、行动结算不回退。

## Next Batch Recommendation

下一批建议做 `Phase 1`：用现有资产完成地图/地点页布局闭环和昼夜 key 接入。不要先追求最终美术，因为没有 UI 承载结构时，继续生成图会反复返工。
