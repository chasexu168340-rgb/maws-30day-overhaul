# qa_wave9_scene

Role: AGENT_F_TECH_QA_TOOLS

Branch reviewed: `qa/wave9-scene-review`

Integrated target reviewed: `origin/staging/reforge-unlocks-v1` at `b68cf3a` (`merge: visual direction scene ui`)

## Merge Gate

- Confirmed latest local QA branch is already up to date with `origin/staging/reforge-unlocks-v1`.
- Confirmed staging contains:
  - `origin/feat/scene-stage-scale`
  - `origin/feat/dialogue-box-rebuild`
  - `origin/feat/event-feedback-loop`
  - `origin/docs/visual-direction-scene-ui`
- Reviewed final integrated staging, not isolated worker branches.

## Scope Check

- Integrated Wave 9 diff from `114240b..HEAD` changes:
  - `maws_src/dom/ui.css`
  - `maws_src/dom/ui.js`
  - `maws_src/simulation/state.js`
  - Wave 9 worker/report/docs files
  - `docs/TASK_PLAN.md` from Manager integration
- No `assets/` file diff.
- No `maws_src/assets/manifest.js` diff.
- No `maws_src/content/data.js` diff, so `INITIAL_SKILLS` was not changed in this wave.
- No `maws_src/simulation/combat.js` diff, so combat formulas were not changed in this wave.

## Browser QA

Manual smoke used Chromium through Playwright against the integrated staging worktree.

- Map page opens with no browser console/page errors.
- Scene character is keyboard/click targetable. Clicking a character without a current action gives toast feedback: `陆小闲现在没有可执行行动`.
- Mainline dialogue opens as a larger RPG-style dialogue box with speaker portrait/nameplate and current line focus.
- Event/action resolve feedback opens as `.maws-modal.result-feedback`.
- Skills page opens and remains usable.
- 390x844 map check: `innerWidth=390`, `bodyScrollWidth=390`, `docScrollWidth=390`.

Screenshots captured under ignored test output:

- `test-results/wave9-scene-qa/desktop-map.png`
- `test-results/wave9-scene-qa/desktop-main-dialogue.png`
- `test-results/wave9-scene-qa/desktop-event-result.png`
- `test-results/wave9-scene-qa/desktop-skills.png`
- `test-results/wave9-scene-qa/mobile-map-390x844.png`

## Checklist Result

1. 越界改文件: no critical runtime boundary violation found. Final wave runtime changes are limited to `ui.js`, `ui.css`, and `state.js`; docs were also added/updated.
2. 新增或删除资产: no.
3. 改 INITIAL_SKILLS: no.
4. 改战斗公式: no.
5. 人物比例明显改善: yes. Characters read as scene figures instead of tiny tokens.
6. 去掉突兀红黄灰背板: partial. Gray slab feeling is improved, but the final UI still strongly depends on red/yellow/black panel styling.
7. NPC 或场景角色可点击或给反馈: yes. Scene character click gives toast or related action.
8. 对话框更像 RPG 对话框: yes.
9. 事件 resolve 后有结果反馈: yes. Result feedback modal appears after `metro_observe`.
10. 390x844 不横向溢出: yes in automated and manual checks.
11. `npm run check:full` 通过: yes.

## Validation

- `npm run check:full`: passed.
  - build passed.
  - asset verification passed: 95 manifest entries.
  - Chromium smoke passed: 4 tests.
- `git diff --check`: passed.

## Findings

- Medium: The requested removal of abrupt red/yellow/gray backing is only partially achieved. The result no longer looks like plain gray placeholder blocks, but the final presentation still has very aggressive red/yellow panel strips in HUD, action cards, dialogue accents, and result modals. Recommend a follow-up visual polish branch if the target is a less posterized scene UI.
- Low: The event result modal is functional, but the desktop screenshot shows dense gain/cost chips packed into a horizontal summary band. It passed overflow checks, but readability could use a later polish pass.

## Recommendation

Staging is technically ready for Manager review and merge of this QA report. Follow-up visual polish is recommended before calling the red/yellow backing issue fully resolved.
