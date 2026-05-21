# HARD STARTUP BUDGET

启动时以当前用户任务为最高优先级；不要自动恢复旧 Batch、旧计划或旧 checkpoint，除非用户明确要求“继续上次任务”。

新窗口恢复当前任务时优先读取 `docs/TASK_HANDOFF.md`。`docs/CURRENT_TASK.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md` 只作为历史 stub，不作为当前任务入口。

开工前只允许读取当前任务必需文件：默认 `AGENTS.md`、`docs/TASK_HANDOFF.md`、`docs/FILE_MAP.md`、`docs/TASK_PLAN.md`；需要项目背景时再读 `docs/CODEX_CONTEXT.md`。

修改前工具预算：最多 4 条命令、最多 1 次搜索；搜索必须限制在项目根目录内，并避开依赖、构建产物、生成图和大日志。

默认只允许使用 `planning-with-files`；不要在启动阶段触发多 skill 调度，不要为普通任务加载额外 skill。

Playwright 只允许在实现完成后作为最终浏览器 smoke 使用；初始规划、文件定位和任务恢复阶段不启用 Playwright。

不要反复用 `Get-Content -Skip` 分块读取同一个文件；需要读文件时优先一次性读取必要范围，文件过长就收敛任务或先写 checkpoint。

`docs/TASK_PLAN.md` 只保留当前任务单、当前结果、风险和下一步，不作为历史报告；新任务开始时替换旧内容，不追加旧 Batch 记录。

# 项目协作规则

你是这个 Phaser + DOM Web 游戏项目的长期开发协作 Agent。默认目标是用最小、可验证的改动推进《了不起的武术模拟器》。

## 默认项目地址

- 默认运行项目根目录：`E:\TH比赛照片`
- 如果从外部 checkpoint 工作区恢复任务，先切回 `E:\TH比赛照片` 再读取项目文件。
- 不要使用旧记录里的乱码路径或手写推测路径；需要生成脚本路径时优先使用 `process.cwd()` / `Path.cwd()`。

## 最高优先级

- 不要重构项目。
- 不要顺手改玩法、数值、资产结构或存档结构。
- 不要全仓库扫描。
- 不要默认启动 subagent。
- 不要在写代码前长篇讨论。
- 不要把 fallback、临时图、占位资源说成最终资产。

## 1. 默认低上下文工作流

每个非简单任务默认使用 `.agents/skills/planning-with-files/SKILL.md` 的工作流。

非简单任务包括：

- 会修改 2 个以上文件。
- 涉及 Phaser 场景。
- 涉及 DOM UI。
- 涉及大地图。
- 涉及战斗、训练、事件、物品、技能、资产接入。
- 涉及存档、状态推进、核心循环。
- 涉及 build error 或 runtime error。
- 用户明确要求“系统性改”“大改”“重做”“完整实现”。

简单任务包括：

- 改一处文案。
- 改一个样式小问题。
- 改一个数据值。
- 修一个明显 typo。
- 只查看文件不改代码。

简单任务可以直接定位相关文件，不需要完整 Batch 0。

## 2. 开工读取顺序

非简单任务开工先读，且只读：

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

如果当前任务涉及验证、QA、worker 交接或新窗口恢复，再读：

- `docs/EXECUTION_CONTRACT.md`
- `docs/VALIDATION.md`
- `docs/SPRINT_BOARD.md`

不要把 `docs/CURRENT_TASK.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md` 当成当前任务。

如果这些文件缺失：

- 不要全仓库搜索。
- 只在最终回复中说明缺失。
- 除非用户明确要求，不要为了补文件而扩大任务范围。

读完后根据 `docs/FILE_MAP.md` 选择最小相关文件集，再读代码。

## 3. 修改前工具预算

修改前必须遵守：

- 规划输出最多 12 行。
- 搜索命令最多 3 次。
- 修改前最多查看 3-8 个相关源码/数据文件。
- 不要读取旧报告、长日志、生成图、依赖目录。
- 不要搜索项目根目录之外的路径。
- 如果 `rg` 被系统拒绝执行，静默改用 PowerShell 原生命令，不要反复解释。

修改前必须简短声明：

- 任务类型。
- 相关文件。
- 避免文件/目录。
- 本轮计划。
- 验证命令。

如果发现任务范围比用户说的大，先收敛，不要擅自扩展。

## 4. 默认避免读取

除非任务明确需要，不要默认读取或扫描：

- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `.vite/`
- `test-results/`
- `assets/imagegen*/`
- 生成图片文件夹。
- 大日志。
- 视频。
- 安装包。
- 压缩包。
- 源照片/参考素材目录。
- package lock 文件，除非依赖变更。

## 5. 项目真实架构

当前项目是 DOM + Phaser 混合架构，不要擅自改成纯 Phaser 或纯 DOM。

- 入口：`maws_30day_overhaul_v3.html`
- 运行源码：`maws_src/`
- 数据：`maws_src/content/data.js`
- 状态：`maws_src/simulation/state.js`
- 战斗：`maws_src/simulation/combat.js`
- DOM UI：`maws_src/dom/ui.js`
- DOM 样式：`maws_src/dom/ui.css`
- Phaser 场景：`maws_src/phaser/scenes/`
- 资产 manifest：`maws_src/assets/manifest.js`
- 资产验证：`maws_src/tools/verify_assets.mjs`

架构边界：

- DOM UI 继续负责当前已有管理界面、底部栏、面板、信息密集 UI。
- Phaser 场景负责地图、动画、战斗演出、训练小游戏、视觉表现。
- `maws_src/content/data.js` 放可调内容。
- `maws_src/simulation/` 放核心规则。
- 不要把战斗公式、经济曲线、训练奖励、事件结果硬编码进 UI 文件或 Phaser 场景。

## 6. 项目边界

禁止默认修改：

- 战斗公式。
- 经济曲线。
- 敌人数据。
- 训练收益。
- 主线剧情。
- 存档 key / version。
- 资产目录结构。
- 入口 HTML 结构。

除非用户明确要求，或者当前 bug 必须修改它们。

不要因为一个 bug 推翻系统。

不要删除已有功能，除非用户明确要求，或能证明它是坏代码并写明原因。

UI 改动必须检查：

- 桌面端横向溢出。
- 平板端横向溢出。
- 手机端文字遮挡。
- 按钮可点击性。
- 底部导航是否仍然可见。
- 信息密度是否保留。

## 7. Subagent 策略

默认不启动 subagent。

只有用户明确要求以下内容时，才允许启动：

- subagent。
- 多 Agent 评审。
- 并行评审。
- agent team discussion。
- 让几个 AI 开会。

如果启动 subagent：

- 最多 3 个。
- 先只做评审，不直接改代码。
- 每个 subagent 输出最多 20 行。
- 主 Codex 汇总后再决定是否实现。
- 不要让多个 subagent 同时修改同一批文件。

## 8. Batch 策略

普通任务不要 Batch 0。

只有满足以下情况之一，才使用 Batch：

- 用户明确要求长任务。
- 预计修改超过 8 个文件。
- 同时涉及 3 个以上主要系统。
- 涉及 UI + 系统 + 数据 + 资产的联动大改。
- 需要迁移架构或整理大型遗留代码。

Batch 规则：

1. Batch 0 只做扫描、计划、checkpoint，不改业务代码。
2. 每个 Batch 必须有明确目标和验证方式。
3. 每完成一个 Batch，更新 `docs/TASK_PLAN.md`。
4. 上下文接近上限时，立即停止扩展任务，先写 checkpoint。

## 9. 修改后必须做

代码或数据变更后：

1. 更新 `docs/TASK_PLAN.md`。
2. 记录实际改动、修改文件、验证结果、风险和下一步建议。
3. 根据任务类型运行验证命令。

不要让 `docs/TASK_PLAN.md` 无限增长。每次只保留当前任务、最近一次结果、风险和下一步。旧历史不要长篇追加。

## 10. 默认验证

纯文档 / AGENTS / prompt 修改：

- 可以不运行 build。
- 最终说明：未改运行代码，跳过 `npm run build`。

代码 / 数据 / UI 修改必须运行：

```powershell
npm run build
```

资产 manifest / 图片路径修改优先运行：

```powershell
node maws_src/tools/verify_assets.mjs
npm run build
```

如果实际项目脚本不同，先查看 `package.json` scripts，不要猜。

Web 或 UI 任务需要浏览器 smoke，至少覆盖：

- 页面能打开。
- 无 JS runtime error。
- 核心按钮可点击。
- 状态能推进。
- 存档不坏。
- 桌面 / 平板 / 手机无横向溢出。

如果不能实际打开浏览器，必须说明未完成浏览器 smoke，只完成 build 或静态检查。

## 11. 搜索规则

优先使用 `rg`。

如果 `rg` 报 Access denied 或被系统拒绝执行：

- 不要反复解释。
- 静默改用 PowerShell fallback。
- 搜索必须限制在项目根目录。
- 排除依赖、构建产物、生成图和大日志。

PowerShell fallback 示例：

```powershell
Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch 'node_modules|dist|build|\.git|\.vite|test-results|assets/imagegen' }

Get-ChildItem -Recurse -File -Include *.js,*.mjs,*.css,*.html,*.json,*.md -ErrorAction SilentlyContinue |
  Select-String -Pattern "关键词"
```

## 12. 最终回复格式

最终回复必须简洁：

- 完成了什么。
- 修改了哪些文件。
- 如何测试。
- 测试结果。
- 未完成 / 风险。
- 下一步建议。
- 如果上下文中断，下一窗口应该读取哪些 checkpoint 文件。
