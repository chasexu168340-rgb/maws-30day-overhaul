# SPRINT_BOARD

> Current sprint board. Keep only active Wave 15 work and next ready tasks.

## Current Target

Wave 15: Addiction Loop Slice.

## Baseline

- Wave 14 QA passed.
- NPC menu has early real actions.
- Skill tree is visible but not spendable.
- Combat plan mode is visible/clickable but needs recipe-level feedback.
- Wave14 smoke is present and passing.

## Ready Tasks

1. `TREE-SPEND-001`
   - Branch: `feat/skill-tree-spend-v1`
   - Files: `maws_src/content/data.js`, `maws_src/simulation/state.js`
   - Goal: six spendable nodes with cost, prereq, unlocked state, and a real small effect.
2. `COMBAT-RECIPE-001`
   - Branch: `feat/combat-recipe-v1`
   - Files: `maws_src/simulation/combat.js`, with `state.js` bridge only if unavoidable.
   - Goal: safe / pressure / exit / probe tactical recipes with human-readable feedback.
3. `LOOP-SMOKE-015`
   - Branch: `test/wave15-addiction-loop-smoke`
   - Files: `maws_src/tests/wave15_addiction_loop.spec.js`
   - Goal: verify spendable node, feedback, recipe controls, and mobile overflow.
4. `QA-015`
   - Branch: `qa/wave15-review`
   - Goal: final QA after all first-stage implementation and tests are integrated.

## Deferred

- NPC memory banter implementation.
- Event follow-up implementation.
- Alt route media/rules implementation.

These should start as docs-only proposals or run after first-stage QA because they compete for `data.js/state.js`.

## Notes

- QA runs last.
- Do not change starter skills to include `jab` or `advance`.
- Do not change save key/version.
