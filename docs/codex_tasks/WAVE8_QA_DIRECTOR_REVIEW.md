# WAVE8_QA_DIRECTOR_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。

本轮只做 QA，不改业务代码。

## 本轮 QA 依据

- 已由 Manager 读取本机顶级 skills：`ui-ux-design`、`game-design`、`system-designer`、`storytelling`。
- 执行时直接采用这些原则，不要另行加载插件或外部 skill，避免 CLI warn。
- QA 不只看测试是否绿，也要看默认 UI 是否减少资料墙、director 字段是否轻量可选、文案是否从信息展示转为场景选择。

## 允许修改

- docs/workers/qa_wave8_director.md
- docs/agent_reports/QA_WAVE8_DIRECTOR_REVIEW.md

## 禁止修改

- maws_src/
- assets/
- package.json
- docs/TASK_HANDOFF.md
- docs/TASK_PLAN.md

## 任务

审阅：
- feat/ui-app-shell-declutter
- feat/daily-director-loop
- feat/day1-7-scene-content-pass
- test/director-loop-smoke

检查：
1. 是否越界改文件。
2. 是否删除功能。
3. 是否让主界面信息减少。
4. 是否限制推荐行动数量。
5. 是否保留 4 技能开局。
6. 是否没有改战斗公式。
7. 是否没有大改经济曲线。
8. check:full 是否通过。
9. director_loop.spec 是否通过。

## 验证

npm run check:full
git diff --check

如果测试分支已合入，额外运行：
npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line

## 输出

docs/workers/qa_wave8_director.md
docs/agent_reports/QA_WAVE8_DIRECTOR_REVIEW.md
