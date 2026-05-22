# WAVE11_FLOW_SMOKE_TESTS

你是 AGENT_F_TECH_QA_TOOLS。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

本轮只加 targeted smoke，不改业务代码。

## 允许修改

- maws_src/tests/wave11_flow.spec.js
- docs/workers/wave11_flow_smoke.md
- docs/agent_reports/AGENT_F_WAVE11_FLOW_TESTS.md

## 禁止修改

- package.json
- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- assets/

## 任务

1. 新增 Playwright spec，可用 npx 直接跑。
2. 检查：
   - 战斗界面主视图只突出 1-2 个当前行动/队列槽。
   - 奖励弹窗有可见 reward chips。
   - 小事件/小结果不是超大信息墙。
   - 时间投入弹窗可打开且 390x844 不溢出。
   - 技能页有用信息没有完全缩进 details。
3. 不依赖长文案 exact match。

## 验证

npm run build
npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line
git diff --check

## 输出

- docs/workers/wave11_flow_smoke.md
- docs/agent_reports/AGENT_F_WAVE11_FLOW_TESTS.md
