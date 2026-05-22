# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Wave 14: Playable Loop Slice.

## Current Staging Baseline

- Wave 13 first-look QA passed.
- NPC compact interaction menu is staged: clicking scene people opens a compact menu instead of only showing a toast.
- Reward deltas are compact and structured.
- Day 5 combat HUD command/action count target is 4-6, with queue length 1-2.
- No skill tree runtime implementation exists yet.

## Goal

Make the next slice feel playable from entry through local action, NPC interaction, reward feedback, and Day 5 combat planning without expanding the game architecture.

## Ready Tasks

1. `NPC-ACT-001`: connect compact NPC menu actions to real, safe local actions where data already supports it.
2. `TREE-001`: add the first runtime skill tree slice without changing save key/version or broad progression rules.
3. `UI-PLAN-001`: tighten the Playable Loop Slice UI plan around current DOM + Phaser ownership boundaries.
4. `QA-014`: final Wave 14 QA after implementation branches are complete and integrated.

## Worker Order

1. Implement small gameplay/UI/data slices first.
2. Keep overlapping UI ownership serialized.
3. Run QA last, after implementation branches are complete and available in the review base.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/EXECUTION_CONTRACT.md`
6. `docs/VALIDATION.md`
7. `docs/SPRINT_BOARD.md`

## Validation

- Documentation-only refresh: `git diff --check`.
- Code/data/UI follow-up workers must use the project validation contract.
- QA must run last; do not start QA against stale base state.

## Do Not Do

- Do not modify `maws_src/`, `assets/`, `package.json`, combat formulas, economy curves, enemy data, main story scope, save key/version, or asset structure unless a later worker prompt explicitly allows it.
- Do not claim the skill tree is implemented at runtime until `TREE-001` lands and is verified.
- Do not let multiple workers edit the same UI files concurrently.
