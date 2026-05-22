# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Wave 15: Addiction Loop Slice.

## Current Staging Baseline

- Wave 14 QA passed.
- NPC compact interaction menu has partial real actions for the early slice.
- Reward chips are compact and structured.
- Skill tree exists as a runtime/render-model/UI slice, but nodes are not spendable yet.
- Combat plan mode is visible and clickable.
- `wave14_loop` smoke covers NPC real actions, reward chips, skill tree display, plan mode, and mobile time-investment overflow.

## Goal

Create the first true addiction loop: the player spends Insight, unlocks a small skill-tree node, sees a real combat/training change, uses a readable combat recipe, and wants to try another day.

## Wave 15 First Stage

1. `TREE-SPEND-001`: make six skill-tree nodes spendable with costs, prerequisites, unlocked state, and one real small effect.
2. `COMBAT-RECIPE-001`: turn plan mode into readable tactical recipes with human combat feedback.
3. `LOOP-SMOKE-015`: verify skill spend, recipe controls, recipe feedback, and mobile overflow.
4. `QA-015`: final QA after implementation branches are complete and integrated.

## Deferred Second Stage

- NPC memory banter.
- Event follow-up choices.
- Alt route media/rules slice.

These should not run in parallel with first-stage `data.js/state.js` work unless implemented as docs-only proposals.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/VALIDATION.md`
6. current worker prompt under `docs/codex_tasks/`

## Validation

- Code/data workers: `npm run check:full`, relevant targeted command, `git diff --check`.
- Wave15 smoke: `npm run build`, `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`, `git diff --check`.
- QA must run last; do not start QA against stale base state.

## Do Not Do

- Do not implement full 30 days, full skill tree, Day 8/9, more UI panels, broad enemy rewrites, or save key/version changes.
- Do not give `jab` / `advance` as new starter skills.
- Do not let multiple workers edit the same UI files concurrently.
