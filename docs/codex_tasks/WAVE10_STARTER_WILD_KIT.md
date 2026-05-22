# WAVE10_STARTER_WILD_KIT

你是 AGENT_B_GAMEPLAY_SYSTEMS + AGENT_C_COMBAT_FEEL。

重要：当前 shell 所在目录就是你的独立 worker worktree。不要切回 `E:\TH比赛照片` 修改文件，不要读取或恢复其他 worktree 的 checkpoint；只在当前 worktree 完成、提交并推送本分支。

目标：前期玩家不要像废物，但也不要开局送正式 jab/advance。改成 6 个“野路子/茂家野生技能”，让玩家能打赢完全没练过的人，同时保留从野路子进化到真东西的成长线。

## 允许修改

- maws_src/content/data.js
- maws_src/simulation/state.js
- maws_src/tests/phaser-smoke.spec.js
- maws_src/tests/day1_day7_playtest.spec.js
- docs/workers/starter_wild_kit.md
- docs/agent_reports/AGENT_B_STARTER_WILD_KIT.md

## 禁止修改

- maws_src/simulation/combat.js
- maws_src/dom/ui.js
- maws_src/dom/ui.css
- maws_src/simulation/events.js
- assets/
- 经济曲线
- 存档 key/version

## 设计要求

1. 不采用旧的 6 正式技能开局，不送 `jab` 和 `advance`。
2. 采用“6 个野/旧招开局”：
   - wild_swing / 野路挥拳
   - push_away / 推搡
   - maw_kaishan 或 mystic 的野生版本
   - maw_tiebu 或 guard 的野生版本
   - retreat 或 back_off
   - talkdown 或 shout_down
3. 如果不想新增大量技能，可用现有 `mystic/guard/retreat/talkdown` 加 2 个新技能 `wild_swing/push_away`。
4. 更新 INITIAL_SKILLS 和 equipSkills。
5. SKILL_UNLOCKS 里正式技能仍然通过训练学会：jab、straight、palm 等不能开局白送。
6. 新野技能要能打赢“完全没练过的人”，但打 E01 仍然只能 objective 通过，不是碾压。
7. 旧存档已有技能不强删。
8. 更新测试断言。

## 验证

npm run check:full
npm run test:playtest
git diff --check

## 输出

docs/workers/starter_wild_kit.md
docs/agent_reports/AGENT_B_STARTER_WILD_KIT.md
