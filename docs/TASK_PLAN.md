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
- Third pass committed and pushed as `fda68fc`.
- Current pass makes reward chips honor structured kind/priority/icon data: time and cost no longer read as generic positive gains.
- Equipped skill cards now open their details by default so useful skill data is visible without turning every card into a wall.

## Validation

- Passed:
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`
  - `npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line`
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Risks

- This is a bounded SkillOpt optimization series, not a claim that the whole game is fully optimized.
- Generated moodboard files under `outputs/` are local creative artifacts and are intentionally not part of the code commit.
- The next likely pass should target NPC memory follow-up or combat recipe fallback readability, using the same audit -> patch -> gate loop.

## Next Step

Run full validation for the current reward-chip pass, then commit and push it on `codex/skillopt-optimization-pass`.
