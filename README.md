# 了不起的武术模拟器

30 天武术实用性原型。当前版本是 Phaser + DOM 架构：

- Phaser 负责背景、角色 sprite、动画、伤害数字和战斗特效。
- DOM 负责主线/待办、装备栏、训练小游戏、战斗 HUD、技能卡、队列、日志和弹窗。
- 入口文件：`maws_30day_overhaul_v3.html`
- 源码目录：`maws_src/`
- 运行时资源目录：`assets/`
- 项目 checkpoint：`docs/CURRENT_TASK.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md`

## 本地运行

在项目根目录启动静态服务器：

```powershell
npx http-server . -p 8137
```

然后打开：

```text
http://127.0.0.1:8137/maws_30day_overhaul_v3.html
```

如果不用 `http-server`，也可以用任意能服务静态文件的本地服务器。不要直接双击 HTML 作为最终验证方式，浏览器对 module 和资源加载会有差异。

## 验证

```powershell
Get-ChildItem -Path ".\maws_src" -Recurse -Include *.js,*.mjs | ForEach-Object { node --check $_.FullName }
node .\maws_src\tools\verify_assets.mjs
```

浏览器 smoke 至少覆盖：

- 新开局、保存、读档
- 城市 overlay、今日主线、今日待办
- 装备、卸装
- `bag` 和 `gym_basic` 训练小游戏
- E01/E06/E07/E18 短窗口战斗、目标选择、认输、结算
- 1365x768、900x700、390x844 无横向溢出

## 协作规则

- 开始任务前先读 `AGENTS.md` 和 `docs/CURRENT_*`。
- 长任务必须分 Batch，并在完成后更新 checkpoint。
- 不要提交 `test-results/`、源照片、安装包、视频或中间抠图产物。
- 新功能优先走现有数据结构和 DOM/Phaser 分层，不要重写架构。
- 分支建议：`codex/<short-task-name>`。

## 资产说明

当前 `assets/imagegen_pixel/sprites/anim_*.png` 是可替换动画底座，不是最终逐帧美术。后续替换时保持 manifest 中的 `anim.fighter.*` key、帧尺寸和动画 metadata，代码无需大改。
