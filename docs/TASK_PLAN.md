# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave 15 Addiction Loop Slice setup: refresh checkpoint and launch first-stage worker pipeline.

## Scope

- Prepare Wave15 first-stage prompts and pipeline.
- Refresh `TASK_HANDOFF`, `TASK_PLAN`, and `SPRINT_BOARD` to Wave15.
- First implementation stage will run `SkillTreeSpend` and `CombatRecipe` in parallel where file ownership is acceptable.
- Do not manually implement gameplay in this setup step.

## Current Result

- Added Wave15 prompts for handoff, skill-tree spend, combat recipe, loop smoke, QA, and second-stage proposal work.
- Added `scripts/wave15_addiction_loop_pipeline.json`.
- Added `scripts/wave15_second_stage_proposals_pipeline.json`.
- Current checkpoint now points to Wave15 Addiction Loop Slice.

## Validation

- Pending after this refresh: `git diff --check`.

## Risks

- `SkillTreeSpend` and `CombatRecipe` can run together only because combat recipe is instructed to avoid `data.js` and treat `state.js` as read-mostly/minimal bridge.
- NPC memory, event follow-ups, and alt route implementation are deferred because they would contend for `data.js/state.js`.

## Next Step

Commit/push this checkpoint refresh, then start `scripts/wave15_remaining_after_handoff_pipeline.json`.
