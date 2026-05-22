# SPRINT_BOARD

> Current sprint board. Keep only the active Wave 14 handoff state and next ready tasks.

## Current Target

Wave 14: Playable Loop Slice.

## Staging Baseline

- Wave 13 first-look QA passed.
- NPC compact interaction menu is staged.
- Reward deltas are compact and structured.
- Day 5 combat HUD target: 4-6 command/action count, queue length 1-2.
- No skill tree runtime implementation yet.

## Ready Tasks

1. `NPC-ACT-001`
   - Wire compact NPC menu choices to existing safe local actions where current data already supports it.
   - Preserve compact menu behavior and avoid broad data or economy changes.
2. `TREE-001`
   - Implement the first runtime skill tree slice.
   - Do not change save key/version unless explicitly authorized by a later prompt.
3. `UI-PLAN-001`
   - Produce the Playable Loop Slice UI plan around the existing DOM + Phaser boundary.
   - Serialize ownership of shared UI files.
4. `QA-014`
   - Run final Wave 14 QA only after implementation work is complete and integrated.
   - QA must be last; do not test stale base state as the final result.

## Blocked / Notes

- Do not start QA before implementation branches are ready in the review base.
- Do not claim skill tree runtime completion before `TREE-001` lands and passes validation.
- Keep worker scopes small; avoid concurrent edits to the same UI files.
