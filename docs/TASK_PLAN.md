# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

SkillOpt-style optimization pass for the current playable slice.

## Scope

- Apply the SkillOpt loop to MAWS production work: rollout/audit, reflect, select a bounded high-impact patch, validate behind gates, and checkpoint.
- Use the current moodboard direction as a product constraint: grounded city RPG, compact HUD, reward burst, readable combat feedback, low debug noise.
- This pass does not rewrite the architecture, save key/version, asset structure, starter skills, broad combat balance, or economy curve.

## Current Result

- Baseline `npm run check:full` passed before edits.
- Identified a high-impact loop break: skill-tree nodes were spendable in state but the player-facing UI button still used `toast`.
- Fixed skill-tree node UI so available nodes render a real `purchaseSkillTreeNode` action.
- Strengthened `wave15_addiction_loop.spec.js` so purchase is verified through the visible UI button instead of direct `store.dispatch()`.
- Hid the self-check/debug tab from normal navigation unless `?debug=1` is present.
- Collapsed the combat tactics drawer by default so the battle stage and command bar stay dominant.
- Follow-up pass connected the existing early `视频复盘` action to the tested skill-tree spend loop: tests now earn Insight through UI before buying.
- Skill-tree copy now names the source of Insight: review, training, and mainline progress.
- Third pass surfaces purchased skill-tree effects in the next combat feedback panel, not only in the hidden combat math.
- Targeted Wave15 Playwright gate passed after the follow-up and third pass.

## Validation

- Passed:
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Risks

- This is the first bounded SkillOpt optimization patch, not a claim that the whole game is fully optimized.
- The next likely pass should target combat feel/readability or NPC memory follow-up, using the same audit -> patch -> gate loop.

## Next Step

Commit and push the third pass on `codex/skillopt-optimization-pass`. Next SkillOpt loop should target event/NPC follow-up memory or reward burst visibility.
