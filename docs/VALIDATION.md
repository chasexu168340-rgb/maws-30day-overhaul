# VALIDATION

> 当前项目验证入口。不要猜脚本名，优先看这里和 `package.json`。

## Commands

```powershell
npm run build
npm run test:smoke
npm run check
npm run check:full
git diff --check
```

## Meaning

- `npm run build`：静态构建检查，入口是 `maws_src/tools/build_check.mjs`。
- `npm run test:smoke`：Playwright Chromium smoke，入口是 `maws_src/tests/phaser-smoke.spec.js`。
- `npm run check`：`npm run build` 的短别名。
- `npm run check:full`：build + browser smoke。
- `git diff --check`：提交前检查空白错误。

## Browser Smoke Minimum

当前 smoke 至少覆盖：

- 页面能打开且无 JS runtime error。
- 关键页面可进入：地点、技能、战斗相关页面。
- 核心按钮可点击，状态能推进。
- 桌面、平板、手机宽度没有明显横向溢出。

## When To Skip

- 纯文档任务可以跳过浏览器 smoke，但如果改了 `package.json`、验证脚本或任务要求 smoke，则必须运行。
- 跳过任何验证都要在 `docs/TASK_PLAN.md` 和最终回复中说明原因。
