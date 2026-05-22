# WAVE12_QA_VISUAL_REVIEW

你是 AGENT_F_TECH_QA_TOOLS。本轮只做 QA，不改业务代码。

允许修改：docs/workers/qa_wave12_visual.md、docs/agent_reports/QA_WAVE12_VISUAL_REVIEW.md。

任务：审阅 feat/structured-reward-deltas、feat/visual-stage-hud-strike、test/wave12-visual-smoke、docs/wave12-art-direction-shotlist。

检查：是否越界改文件；是否没有改 INITIAL_SKILLS；是否没有改战斗公式；战斗卡牌是否变小但不是只剩两张；战斗舞台是否明显变大；地图角色是否更大更贴地；红黄灰背板是否明显减少；事件收益是否显示结构化数字；点击 NPC 是否有视觉反馈；本地点行动是否不再被遮挡；check:full/test:playtest/wave12_visual.spec 是否通过。

验证：npm run check:full；npm run test:playtest；npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line；git diff --check。
