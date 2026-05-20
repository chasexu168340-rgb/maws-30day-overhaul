# CURRENT TEST REPORT

## 2026-05-19 Baseline

已完成基线验证：
- Node 抽取 `<script>` 并 `new Function()`：通过。
- 浏览器打开本地静态服务：页面可启动。
- 控制台：仅发现 `favicon.ico` 404，不影响 demo。
- 新开局：可进入地图，主线对话可推进。
- 自检进入 E01 战斗：可选技能并结算一回合。
- 手机 390x844：页面横向溢出，`body.scrollWidth` 约 1040。

待完成改后验证：
- 静态语法。
- 新开局、读档、保存、地图、技能、商店、NPC、训练小游戏。
- E01 / E06 / E07 / E18 战斗。
- 桌面、平板、手机响应式。
- v3 旧存档迁移和 v4 存档读取。

## 2026-05-19 Mid-run

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 73050 chars。

## 2026-05-19 Final

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 73914 chars。
- 浏览器控制台：`playwright-cli console error` 返回 `Errors: 0, Warnings: 0`。
- 网络请求：目标 HTML 返回 200；已用 `data:,` favicon 消除原先的 favicon 404。
- 新开局：`newPlayer('worker')` 后 `day=1`，地图页可渲染。
- 技能页：可渲染，技能槽数量为 6。
- 商店页：可渲染网络商城。
- NPC 对话：教练对话 modal 可打开。
- 训练小游戏：沙包连击 modal 可打开。
- E01 战斗：刺拳 + 直拳一回合后进入第 2 回合；敌方 HP 约 66/92，玩家 HP 约 102/146，战斗历史写入 1 条。
- E06/E07/E18：均可启动战斗；E07 保留武器威胁标记。
- 保存：`maws_overhaul_save` 写入 `version=4.0-hard-comic`，包含 `combatMemory`。
- 旧存档迁移：模拟 v3 缺字段对象可迁移到 `4.0-hard-comic`；技能槽 6 个、装备槽 5 个、`combatMemory` 存在。
- 响应式：
  - 1365x768：`body.scrollWidth=1365`，无横向溢出。
  - 900x700：`body.scrollWidth=900`，无横向溢出，战斗卡 `overflow-x:auto`。
  - 390x844：`body.scrollWidth=390`，无横向溢出，战斗卡 `overflow-x:auto`。

## 2026-05-19 Batch 5

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 76541 chars。
- 低体力推进：玩家体力设为 0 后点击确认，自动喘息进入第 2 回合，历史记录为 `rest`，体力恢复到约 34。
- 战斗专用 UI：`#game` 进入 `combatMode`；`#top`、左侧状态栏、右侧机会栏均为 `display:none`。
- 直接人物反馈：强制两段命中后，敌方 `#ef` 内出现 `-10`、`-14` 伤害数字，玩家 `#pf` 内出现 `2 HIT` 连击标识。
- 状态图标：敌方人物节点出现命中部位/压进图标；格挡测试出现 `格挡削血` 和回稳图标。
- 格挡削血：对手防守时刺拳仍造成最低削血，日志包含 `削血`，未命中逻辑不造成伤害。
- 认输：`surrenderCombat()` 打开战斗结果 modal，结果文本包含 `认输`，战斗标记为 ended。
- 控制台：Playwright console error 为 0。
- 响应式战斗视口：
  - 1365x768：`body.scrollWidth=1365`，舞台高度约 330，通用 UI 隐藏。
  - 900x700：`body.scrollWidth=900`，技能卡横向滚动。
  - 390x844：`body.scrollWidth=390`，技能卡横向滚动，舞台高度约 320。

## 2026-05-20 Batch 6

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 87557 chars。
- 资源验证：`/vendor/phaser-4.1.0.min.js` 返回 200，浏览器内 `window.Phaser.VERSION=4.1.0`。
- Phaser 舞台：E01 战斗启动后 `#phaserCombatStage canvas` 数量为 1，`#combatStage` 带 `phaserReady`，DOM fallback 为 `display:none`。
- 技能卡：战斗卡均显示 `.skillStats`；刺拳示例展示伤害、架势、命中、体力、风险、距离和效果说明。
- 连击 smoke：强制刺拳+直拳命中后，敌方 HP 降到约 68，DOM 兜底浮层出现 `-10`、`-14` 和 `2 HIT`，Phaser canvas 同步播放命中表现。
- 格挡削血：敌方防守时日志包含 `削血`，状态浮层出现 `格挡削血` 和回稳。
- 抱摔场景：E06 强制敌方抱摔后进入 `player_bottom`，检测到 `TAKEDOWN`/眩晕类状态反馈。
- Fallback：拦截 Phaser vendor 后页面仍可进入战斗；`phaserPresent=false`、fallback 可见、提示 `Phaser 舞台未加载，已切回 DOM 战斗表现。`
- 控制台：正常资源加载时 Playwright console error 为 0。
- 响应式：
  - 1365x768：`body.scrollWidth=1365`，Phaser canvas 存在。
  - 900x700：`body.scrollWidth=900`，技能卡横向滚动。
  - 390x844：`body.scrollWidth=390`，舞台高度约 320，技能卡横向滚动。

## 2026-05-20 Batch 7

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 89549 chars。
- 地图：新开局后可看到“社区健身房”；09:00 可移动进入，08:20 显示关闭并 toast `社区健身房现在不开放`。
- 健身房行动：四个行动卡正常渲染；跑台/核心/拉伸显示时间、体力、费用和基础属性/疲劳收益。
- 低资源禁用：体力 5、现金 0 时四个健身房行动均禁用，点击后 toast `体力不足`。
- `gym_basic` 小游戏：8 个提示可用正确输入推进；完成后现金 360->335，体力 100->80，时间 09:20->10:30，力量 48->49，耐力 54->55，平衡 46->47，速度 46->47，疲劳 10->22，日志写入训练结果。
- 保存读取：健身房保存后刷新读档，`S.loc='gym'`，场景标题为“社区健身房”，四个行动卡仍正常渲染。
- 响应式：
  - 1365x768：`body.scrollWidth=1365`，小游戏 modal 宽 880，按钮四列。
  - 900x700：`body.scrollWidth=900`，小游戏 modal 宽 810，按钮四列。
  - 390x844：`body.scrollWidth=390`，小游戏 modal 宽 351，按钮两列。
- 控制台：Playwright console error 为 0。

## 2026-05-20 Batch 8

- Node 抽取 `<script>` 并 `new Function()`：通过，脚本长度 99974 chars。
- 资源验证：`/maws_30day_overhaul_v3.html` 返回 200，`/vendor/phaser-4.1.0.min.js` 返回 200，浏览器内 `window.Phaser.VERSION=4.1.0`。
- 技能页：新开局进入技能配置后，页面不再出现“练习”；技能卡显示“当前伤害”、命中/体力/风险/距离和“推荐训练”。
- 出行弹窗：从 home 到 park 可打开“出行选择”，6 种方式包含散步和打车；选择散步后到达 park，显示“出行结算”，`fitXp` 从 0 增加到 2。
- 简单行动结算：home 的“视频复盘”执行后显示“视频复盘 结算”，体力保持不被无意义扣除。
- 小游戏训练结算：`gym_basic` 以 96 分完成后显示“基础循环训练 结算”和得分；力量、耐力等基础属性按训练结果增长。
- NPC 对话结算：刘胖子首次“认真听取”后显示“刘胖子 对话结算”，关系从 5 增至 7。
- 低日常体力战斗：将日常体力设为 3 后进入 E01，开打体力提升到 86，`invalidSkillReason('jab')` 为空，Phaser canvas 数量为 1，日志记录“战斗体力独立结算”。
- 战斗结果和复盘结算：强制 E01 胜利后显示战斗结果和“战斗体力已切回日常体力”；选择冷静复盘后显示“战后复盘结算”。
- 响应式：
  - 1365x768：地图/出行弹窗 `body.scrollWidth=1365`，无横向溢出；战斗页 `body.scrollWidth=1365`，Phaser canvas 存在。
  - 900x700：地图/出行弹窗 `body.scrollWidth=900`，无横向溢出；战斗页 `body.scrollWidth=900`，技能卡横向滚动。
  - 390x844：地图/出行弹窗 `body.scrollWidth=390`，无横向溢出；战斗页 `body.scrollWidth=390`，技能卡横向滚动。
- 控制台：Playwright console error 为 0。

## 2026-05-20 Batch 9

- Node 抽取 inline `<script>` 并 `new Function()`：通过，脚本长度 109550 chars。
- 资源验证：目标 HTML 返回 200，Phaser vendor 返回 200。
- 浏览器 smoke：Chrome channel Playwright 2 tests passed。
- 人物属性页：新开局后 `profile` 页可渲染，包含“人物属性”“体能沉淀”“力量”“判断”；属性卡点击后 `.open` 生效，说明浮层可见。
- 左侧收口：`#leftStatus .attrGrid` 数量为 0，完整属性表不再占用左侧。
- 数值 smoke：速度提高会提高 `lowkick` 预览命中；判断提高不会降低刺拳架势预览；抗打提高会提高生命上限；跑步出行后 `fitXp` 升级并给速度派生加成。
- 战斗回归：E01 / E06 / E07 / E18 均可启动，`#combatStage` 可见，`#phaserCombatStage canvas` 数量为 1。
- 响应式：1365x768、900x700、390x844 的人物属性页 `body.scrollWidth` 均不超过视口宽。
- 截图 QA：已生成临时截图 `maws_batch9_profile.png` 和 `maws_batch9_combat.png`，确认人物属性页和 Phaser 战斗舞台非空。
- Playwright 环境备注：默认 Chromium 未安装、Edge 启动 EACCES；本次使用系统 Chrome channel 完成自动化。

## 2026-05-20 Batch 10 continuation

- Node 语法检查：`ShellScene.js`、`combat.js`、`state.js` 通过 `node --check`。
- Module import / manifest / migration：9 个核心模块可 import；`ASSET_MANIFEST` 22 个 key 均有文件；generated SVG 未发现 `<text>` 标签或 CJK 中文字符；模拟旧存档迁移到 `4.1-phaser-ui`，保留 `face`，技能槽补齐到 6。
- 资产验证：资产 worker 对 8 个 SVG 做过 XML、浏览器解码和 Phaser `load.image` 检查；主线 smoke 也确认 Phaser 可启动并加载画面。
- 浏览器综合 smoke：Chrome channel 通过，控制台 error 为 0；`map/profile/skills/bag/shop/npc/log/check` 均可进入。
- 体能沉淀 smoke：便利店“搬货硬练”后 `fitXp=6`；工地“搬砖杂工”后 `fitXp=16`；健身房“跑台间歇”后 `fitXp=24`。
- 战斗逐招 smoke：E01 / E06 / E07 / E18 均可启动；每个对手在一次玩家行动后都有至少 1 个 enemy step；E06 可进入地面下位；E07 远距选错刺拳后也会产生敌方压进回应。
- 响应式截图：1365x768、900x700、390x844 的地图和战斗页 `body.scrollWidth` 均不超过 `window.innerWidth`，无横向溢出。
- 截图文件：`E:\TH比赛照片\test-results\batch10_final_map_390x844.png`、`batch10_final_battle_390x844.png`、`batch10_final_map_900x700.png`、`batch10_final_desktop.png` 等。

环境备注：
- 系统 `python` 不在 PATH，本轮使用 bundled Python。
- 普通 `require('playwright')` 在 bundled pnpm 布局下找不到 `playwright-core`，本轮使用 bundled pnpm 包路径加载 Playwright。
- inline Node 脚本不能硬编码中文路径，否则会出现 `TH????`；本轮改用 `process.cwd()`。

## 2026-05-20 Batch 11

待验证：
- `node --check` 覆盖新增/修改 JS。
- Manifest 校验所有 key 文件存在。
- 浏览器 smoke 覆盖 DOM overlay、主要 tab、保存/读档、控制台 error。
- E01/E06/E07/E18 战斗一轮后产生 enemy step，且页面出现伤害数字或 VFX。
- 1365x768、900x700、390x844 截图检查地图、技能页、战斗页。

## 2026-05-20 Batch 11.2

- JS 语法检查：`maws_src` 下 16 个 JS 文件全部通过 `node --check`。
- Manifest 校验：`maws_src/tools/verify_assets.mjs` 通过，8 个 required groups 存在，65 个条目文件存在且 PNG 头有效。
- Manifest 主路径统计：`flattenManifest()` 返回 65 条，PNG=65，SVG=0。
- 浏览器资源加载：Phaser texture cache 命中 65/65 manifest entries。
- 浏览器 smoke：Chrome channel 打开本地页面成功；console error 0；failed asset request 0。
- 主要 tab：`map/profile/skills/bag/shop/npc/log/check` 均可进入。
- 体能沉淀：便利店搬货后 `fitXp=6`，工地搬砖后 `fitXp=16`，健身房跑台后 `fitXp=24`。
- 存档：保存版本为 `4.1-phaser-ui`，读档后现金字段恢复，save key 仍为 `maws_overhaul_save`。
- 战斗：E01/E06/E07/E18 每场一轮后都产生 1 个 enemy step；FX steps 分别为 2/2/1/2。
- 响应式截图：
  - `E:\TH比赛照片\test-results\batch11_2_map_1365x768.png`，`scrollWidth=1365`。
  - `E:\TH比赛照片\test-results\batch11_2_skills_900x700.png`，`scrollWidth=900`。
  - `E:\TH比赛照片\test-results\batch11_2_battle_390x844.png`，`scrollWidth=390`。
- 视觉 sanity check：三张截图均非空，DOM PNG 图标/技能卡显示正常，无明显文字遮挡或横向溢出。

环境备注：
- 直接 require bundled `node_modules/playwright` 仍会报 `Cannot find module 'playwright-core'`；本轮继续使用 bundled pnpm package path 加载 Playwright。

## 2026-05-20 Batch 11.3

规划阶段：
- 已创建 `docs/VISUAL_UI_ASSET_PLAN.md`，本批不做代码实现和浏览器测试。

下一批待验证：
- `node --check`：`maws_src/assets/manifest.js`、`maws_src/dom/ui.js`、`maws_src/dom/ui.css` 不适用但需截图验证、`maws_src/simulation/state.js` 如修改则检查。
- `maws_src/tools/verify_assets.mjs`。
- 浏览器 smoke：新开局进入地图，地点页中央背景可见，主角和地点相关 NPC/对手入镜。
- 日间/夜间：同一地点能根据时间切换 day/night asset key 或 fallback。
- 1365x768、900x700、390x844 无横向溢出，顶部资源条和底部导航不遮挡主要场景。

## 2026-05-20 Batch 11.4

- JS 语法检查：`maws_src` 下 16 个 JS 文件全部通过 `node --check`。
- Manifest 校验：`maws_src/tools/verify_assets.mjs` 通过，验证 78 个 manifest 条目和 8 个 required groups。
- Manifest 路径统计：`flattenManifest()` 返回 78 条；10 条来自 `assets/imagegen_shenzhen_sun`，68 条来自 `assets/imagegen_pixel`；运行时代码不再引用 `assets/generated` 或 `assets/imagegen`。
- 浏览器 smoke：Chrome channel 打开本地页面成功，console error 0，page error 0，failed request 0，bad HTTP response 0。
- 地图页：1365x768 下 `scrollWidth=1365`，中央场景宽度约 62% 主区域，背景加载 `bg_home_sun.png`，可见主角和地点 NPC token。
- 主要 tab：`profile/skills/bag/shop/npc/log/check/map` 均可进入。
- 地点切换/存档：home 步行到 store 成功；保存版本 `4.1-phaser-ui`，读档后仍在 `store`。
- 响应式：900x700 下 `scrollWidth=900`；390x844 夜间 street 下 `scrollWidth=390`，主内容底部未压到底部导航，夜景背景 `bg_street_night.png` 可见。
- 战斗回归：从自检进入 E01，选择刺拳并确认后产生 3 条战斗 step、1 条 enemy step、2 条 FX step，无横向溢出。
- 截图输出：
  - `E:\TH比赛照片\test-results\batch11_4_map_1365x768.png`
  - `E:\TH比赛照片\test-results\batch11_4_map_900x700.png`
  - `E:\TH比赛照片\test-results\batch11_4_map_390x844.png`
  - `E:\TH比赛照片\test-results\batch11_4_combat_1365x768.png`

环境备注：
- 系统 `python` 不在 PATH，仍需用 bundled Python。
- `sharp` 在当前环境不可用，本轮使用 bundled `pngjs` 完成黑底透明化。
- Playwright 仍需从 bundled pnpm package path 加载，不能直接 `require('playwright')`。

## 2026-05-20 Batch 11.5

- NPC PNG 校验：8 张 `scene_npc_*.png` 均为 512x768，存在透明像素和非透明像素。
- Contact sheet：`E:\TH比赛照片\test-results\batch11_5_scene_npc_contact.png`。
- JS 语法检查：`maws_src` 下 16 个 JS 文件全部通过 `node --check`。
- Manifest 校验：`maws_src/tools/verify_assets.mjs` 通过，验证 86 个 manifest 条目。
- Render model：home/store/worksite/boxing/wuguan/gym/physio/park/mma/street 均输出 player + standee，0 token。
- 浏览器 smoke：Chrome channel 打开页面成功，console error 0，page error 0，failed request 0，bad HTTP response 0。
- 主要 tab：`profile/skills/bag/shop/npc/log/check/map` 均可进入。
- 地点场景：10 个地点 `tokenCount=0`，`brokenImageCount=0`，NPC standee 自然尺寸均为 512x768。
- 响应式：900x700 `scrollWidth=900`；390x844 `scrollWidth=390`，主内容底部未压到底部导航。
- 战斗回归：E01 选择刺拳并确认后产生 3 条战斗 step、1 条 enemy step、2 条 FX step。
- 截图输出：
  - `E:\TH比赛照片\test-results\batch11_5_boxing_1365x768.png`
  - `E:\TH比赛照片\test-results\batch11_5_wuguan_900x700.png`
  - `E:\TH比赛照片\test-results\batch11_5_store_390x844.png`
  - `E:\TH比赛照片\test-results\batch11_5_combat_1365x768.png`

环境备注：
- 直接 `require('pngjs')` 在工作区 CWD 下失败，改用 bundled node_modules 绝对路径。
- inline Node 不能硬编码中文路径，否则会变成 `TH????`；本轮从 `E:\TH比赛照片` 运行并使用 `process.cwd()`。
## 2026-05-20 Batch 11.6

- Imagegen 资产：生成并复制到项目内的两张 PNG 均为 1672x941，文件存在且 PNG header 有效。
- JS 语法检查：`maws_src` 全部 JS 文件 `node --check` 通过。
- Manifest 校验：`maws_src/tools/verify_assets.mjs` 通过，验证 88 条 manifest entries。
- Render model：`cityMap.backgroundKey` 在 07:00 返回 `bg.city.map.day`，在 22:01 返回 `bg.city.map.night`；地点标记数量为 10。
- Browser smoke：Chrome 打开 `http://127.0.0.1:8137/maws_30day_overhaul_v3.html` 成功，console error 0，page error 0，failed request 0。
- 主 tab：`profile/skills/bag/shop/npc/log/check/map` 均可进入。
- 城市地图：1365x768 加载 `bg_city_map_day.png`；900x700 夜景加载 `bg_city_map_night.png`；390x844 加载日景图。
- 地点标记：三档视口均渲染 10 个 `.maws-city-marker`；桌面端点击可用标记后打开出行 modal。
- 响应式：1365x768、900x700、390x844 的 `body.scrollWidth` 分别等于视口宽度；三档 marker-overlap 检测均为 0。
- 存档：保存后 `maws_overhaul_save.version` 仍为 `4.1-phaser-ui`。
- 战斗回归：E01 一回合后 `steps=3`、`enemySteps=1`、`fxSteps=2`。
- 截图输出：
  - `E:\TH比赛照片\test-results\batch11_6_city_map_desktop_1365x768.png`
  - `E:\TH比赛照片\test-results\batch11_6_city_map_desktop_travel_modal_1365x768.png`
  - `E:\TH比赛照片\test-results\batch11_6_city_map_tablet-night_900x700.png`
  - `E:\TH比赛照片\test-results\batch11_6_city_map_mobile_390x844.png`

## 2026-05-20 Batch 12

已完成验证：
- `maws_src` 全部 JS 文件 `node --check`：通过。
- `maws_src/tools/verify_assets.mjs`：通过，验证 88 条 manifest entries。
- PNG 清边检查：13 张 cleaned 角色 PNG 均为 512x768 RGBA；均有透明像素和可见像素；角落透明；扫描边缘黑/绿/品红残边计数均为 0。
- Browser smoke：Chrome 打开 `http://127.0.0.1:8137/maws_30day_overhaul_v3.html` 成功；console error 0，page error 0，failed request 0。
- 地图：默认地点页 `.maws-city-map` 数量为 0；打开 overlay 后 10 个 marker 可见；关闭、切 tab、打开出行弹窗、进入 E01 战斗后 overlay 均会收起。
- Marker 重叠：1365x768、900x700、390x844 三档 marker-overlap 均为 0；三档 `body.scrollWidth` 均等于视口宽度。
- 战斗 UI：E01 战斗页 dock 高度分别为 199.67/768、175/700、253.19/844，比例约 26.0%、25.0%、30.0%，符合桌面/移动端限制；三档无横向溢出。
- 结算：强制胜利 E01 后 modal type 为 `battleResult`，渲染 4 条结构化结算行；页面文本不包含 `[object Object]`。
- 存档：保存仍写入 `maws_overhaul_save`，版本仍为 `4.1-phaser-ui`，读档恢复现金字段。
- 战斗回归：E01/E06/E07/E18 均可进入；一回合后分别产生 3 steps、1 enemy step，FX step 为 2/2/1/2。
- 截图输出：
  - `E:\TH比赛照片\test-results\batch12_location_1365x768.png`
  - `E:\TH比赛照片\test-results\batch12_location_900x700.png`
  - `E:\TH比赛照片\test-results\batch12_location_390x844.png`
  - `E:\TH比赛照片\test-results\batch12_city_overlay_1365x768.png`
  - `E:\TH比赛照片\test-results\batch12_city_overlay_900x700.png`
  - `E:\TH比赛照片\test-results\batch12_city_overlay_390x844.png`
  - `E:\TH比赛照片\test-results\batch12_battle_1365x768.png`
  - `E:\TH比赛照片\test-results\batch12_battle_900x700.png`
  - `E:\TH比赛照片\test-results\batch12_battle_390x844.png`
  - `E:\TH比赛照片\test-results\batch12_battle_result_1365x768.png`
  - `E:\TH比赛照片\test-results\batch12_battle_result_900x700.png`
  - `E:\TH比赛照片\test-results\batch12_battle_result_390x844.png`

验证中发现并已修复：
- Inline Node 脚本里的中文正则在 stdin 中损坏为 `??`，已改为检查 `modal.type`。
- 出行 modal 的取消按钮被底部 nav 截获点击，已通过提高 `.maws-modal` 层级修复。
- 战斗技能按钮在 DOM 重绘时对 Playwright 不稳定，已让技能卡本体也携带同一 action，点击卡片或按钮都可加入队列。

## 2026-05-20 Batch 13

已完成验证：
- `maws_src` 全部 16 个 JS 文件 `node --check`：通过。
- `maws_src/tools/verify_assets.mjs`：通过，验证 88 条 manifest entries。
- 主角 PNG 检查：`assets/imagegen_pixel/characters_clean/fighter_player.png` 为 512x768；可见像素 91,435；画布边缘 alpha 计数 0；低 alpha 像素 1。
- 本地页面：`http://127.0.0.1:8137/maws_30day_overhaul_v3.html` 返回 200。
- Chrome browser smoke：console/page error 0，failed request 0。
- 存档：点击保存后 `maws_overhaul_save.version` 为 `4.1-phaser-ui`。
- 点击特效：城市 marker 点击后 `.maws-click-burst` 数量为 4，且打开出行 modal。
- 主要交互：新开局、保存、人物 tab、城市地图 overlay、城市 marker、出行到公园、E01 公园战斗、选择刺拳并确认均可推进。
- 战斗回归：E01 进入第 2 回合，combat steps=3，enemySteps=1，版本仍为 `4.1-phaser-ui`。
- 响应式：1365x768、900x700、390x844 的 `scrollWidth` 均等于视口宽度，无横向溢出；主角图片在平板/手机均可见。

截图输出：
- `E:\TH比赛照片\test-results\batch13_smoke_location_1365x768.png`
- `E:\TH比赛照片\test-results\batch13_smoke_city_1365x768.png`
- `E:\TH比赛照片\test-results\batch13_smoke_combat_1365x768.png`
- `E:\TH比赛照片\test-results\batch13_smoke_location_900x700.png`
- `E:\TH比赛照片\test-results\batch13_smoke_location_390x844.png`

环境备注：
- 直接使用 Playwright bundled Chromium 时本机缺少对应浏览器；Edge 从 Node spawn 返回 EACCES。本轮改用系统 Chrome executable 搭配 bundled pnpm Playwright package path 完成浏览器验证。
- 直接 `require('pngjs')` 在目标项目 CWD 下不可用；PNG 检查和后处理继续使用 bundled node_modules 的绝对路径。

## 2026-05-20 Batch 14 Final

已完成验证：
- `node --check` over all `maws_src` JS/MJS files：通过，共 19 个文件。
- `node maws_src/tools/verify_assets.mjs`：通过，验证 88 条 manifest entries。
- PNG 结构检查：`fighter_player.png` 加 8 张 `scene_npc_*.png` 均为 512x768 透明 PNG，有可见像素，画布边缘 opaque 像素为 0。
- 本地页面：`http://127.0.0.1:8137/maws_30day_overhaul_v3.html` 返回 200。
- Chrome browser smoke：1365x768、900x700、390x844 三档通过；console/page error 0，HTTP 4xx/5xx 0，非取消型 request failure 0。
- 主要交互：新开局、`profile/skills/bag/shop/npc/log/check` tab、保存、城市地图 overlay、E01 战斗入口、选择技能、确认行动均可用。
- 存档：点击保存后 `maws_overhaul_save.version` 为 `4.1-phaser-ui`。
- 手机战斗回归：选中技能后 `.maws-skill-detail` computed position 为 `fixed`；确认按钮 `bottom=826`，视口高度 `844`；`scrollWidth=390`，无横向溢出。
- 战斗回归：E01/E06/E07/E18 均可进入；一回合后均为 `steps=3`、`enemySteps=1`。

截图输出：
- `E:\TH比赛照片\test-results\batch14_final_location_desktop.png`
- `E:\TH比赛照片\test-results\batch14_final_combat_desktop.png`
- `E:\TH比赛照片\test-results\batch14_final_location_tablet.png`
- `E:\TH比赛照片\test-results\batch14_final_combat_tablet.png`
- `E:\TH比赛照片\test-results\batch14_final_location_mobile.png`
- `E:\TH比赛照片\test-results\batch14_final_combat_mobile.png`

环境备注：
- `rg.exe` 在 checkpoint workspace 仍然 Access denied，本轮继续用 PowerShell `Get-ChildItem` / `Select-String`。
- 直接 `require('playwright')` 不可靠；本轮继续用 bundled pnpm Playwright package path 加载，并指定系统 Chrome executable。

## 2026-05-20 Batch 15 Final

静态验证：
- `Get-ChildItem -Path "E:\TH比赛照片\maws_src" -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }`：通过。
- `node E:\TH比赛照片\maws_src\tools\verify_assets.mjs`：通过，结果 `verified 93 manifest entries across 9 required groups`。
- CSS 结构检查：通过，`open=437 close=437`。

Spritesheet 验证：
- `verify_assets.mjs` 现在覆盖 `sprites` 分组，检查 PNG 头、尺寸、frameWidth/frameHeight 整除、动画帧范围、透明四角、非空像素和边缘残底。
- `anim_fighter_player.png`、`anim_fighter_enemy_boxer.png`、`anim_fighter_enemy_grappler.png`、`anim_fighter_enemy_weapon.png`、`anim_fighter_enemy_boss.png` 均通过。

浏览器 smoke：
- 使用 installed Chrome + bundled Playwright，目标 URL：`http://127.0.0.1:8137/maws_30day_overhaul_v3.html`。
- 1365x768、900x700、390x844 三档均通过。
- 覆盖：新开局、城市 overlay 打开/关闭、主线按钮、待办按钮、装备/卸装、`bag` 训练小游戏、`gym_basic` 训练小游戏、保存/读档、E01/E06/E07/E18 短窗口战斗、目标选择、选卡、执行窗口、认输、战斗结果 modal。
- 三档结果均无 console error、无 pageerror、无 HTTP 4xx/5xx、无横向溢出。

战斗与动画回归：
- E01/E06/E07/E18 均能进入战斗，选择目标头部和技能后执行自动窗口；窗口结束后 `phase === "planning"` 且 `windowCount >= 1`。
- 战斗结束/认输后没有保留 combat 状态，战斗结果 modal 正常出现。
- 纹理检查通过：E01 使用 `anim.fighter.enemy.boxer`，E06 使用 `anim.fighter.enemy.grappler`，E07 使用 `anim.fighter.enemy.weapon`，E18 使用 `anim.fighter.enemy.boss`，三档都使用 `anim.fighter.player`。

截图输出：
- `E:\TH比赛照片\test-results\batch15-desktop-map.png`
- `E:\TH比赛照片\test-results\batch15-desktop-combat.png`
- `E:\TH比赛照片\test-results\batch15-tablet-map.png`
- `E:\TH比赛照片\test-results\batch15-tablet-combat.png`
- `E:\TH比赛照片\test-results\batch15-mobile-map.png`
- `E:\TH比赛照片\test-results\batch15-mobile-combat.png`

测试中发现并已修复：
- 行动栏任务板双列在窄栏内覆盖主线按钮。
- 900px 战斗行动按钮被媒体查询挤到视口外。
- 390px 战斗行动按钮被技能卡单列堆叠挤到视口外。
- 训练 modal 层级被底部 nav 覆盖。
- 战斗结束后延迟动画回调对已销毁 sprite 调 `play()`。

未覆盖：
- 没有做完整 30 天经济曲线长跑。
- 没有人工逐帧美术质量验收；当前动画 strips 仅作为 replaceable runtime base。
