# EXECUTION_CONTRACT

> 所有新窗口、worker 和 QA 默认遵守本合同。任务 prompt 可以进一步收窄范围，但不能擅自扩大范围。

## Recovery Contract

- 当前任务入口是 `docs/TASK_HANDOFF.md` 和 `docs/TASK_PLAN.md`。
- `docs/CURRENT_TASK.md`、`docs/CURRENT_STATUS.md`、`docs/CURRENT_TEST_REPORT.md`、`docs/CHANGELOG.md` 是历史 stub，不是当前任务。
- 需要历史证据时才读取 `docs/archive/legacy_batches/`，不要启动阶段默认读取。

## Work Contract

- 默认最小改动，先读 `docs/FILE_MAP.md` 再选最小相关源码。
- 修改前明确本轮做什么、不做什么、计划查看/修改哪些文件、如何验证。
- 不要默认全仓库扫描，不要读取 `node_modules/`、`dist/`、`build/`、`.git/`、`.vite/`、`test-results/`、生成图片目录或大日志。
- 不要默认启动 subagent；只有用户明确要求时才启动。

## Code Boundary

除非当前任务明确允许，不要修改：

- `maws_src/simulation/combat.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `maws_src/assets/manifest.js`
- `assets/`
- 存档 key/version
- 战斗公式、经济曲线、敌人数据、主线剧情

## Validation Contract

- 文档/流程任务：至少运行 `git diff --check`；如修改 `package.json` 或任务要求，运行 `npm run build` 和 `npm run test:smoke`。
- 代码/数据/UI 任务：运行 `npm run build`。
- 涉及浏览器行为、UI 或 smoke 门槛：运行 `npm run test:smoke`。
- 失败必须记录在 `docs/TASK_PLAN.md`，不能说成通过。
