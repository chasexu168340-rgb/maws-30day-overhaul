# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

把 `maws_30day_overhaul_v3` 变成正确的进入游戏端口入口，避免玩家双击 HTML 后被 `file://` 模块/CORS 拦截。

## Scope

- 新增本地静态 server：`scripts/serve_maws.mjs`。
- 新增双击入口：`maws_30day_overhaul_v3.cmd`。
- 在 `package.json` 增加 `serve:game`。
- 不改游戏逻辑、UI、数据、战斗、经济、资产或存档。

## Plan

- [x] 确认 HTML 直接打开会被 `type="module"` 的 `file://` CORS 拦截。
- [x] 固定本地入口端口为 `5174`。
- [x] 入口自动打开 `http://127.0.0.1:5174/maws_30day_overhaul_v3.html`。
- [x] 如果 5174 已经是 MAWS server，则直接打开；如果被其他 app 占用，则明确报错。
- [x] 验证 server 启动和游戏初始化。

## Validation

- [x] `node --check scripts/serve_maws.mjs`：通过。
- [x] `npm run build`：通过。
- [x] `node scripts/serve_maws.mjs --port 5174`：已启动本地 MAWS server。
- [x] 浏览器验证 `MAWS_GAME` / `MAWS_STORE` 初始化：通过，HTTP 200，canvas 1 个，无 console error。
- [x] `git diff --check`：通过。

## Result

- 新增 `maws_30day_overhaul_v3.cmd`，双击即可启动 5174 端口并进入游戏。
- 新增 `npm run serve:game`，用于命令行启动同一个入口。
- `5174` 端口现在返回的是 MAWS 页面，不是 5173 的 Phaser demo。

## Risks

- 需要本机已安装 Node.js；当前环境已有 Node。
- 直接双击 `.html` 仍不适合作为入口，应双击 `.cmd` 或运行 `npm run serve:game`。

## Next Step

提交并推送。
