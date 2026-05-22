# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave15 `COMBAT-RECIPE-001`: turn combat plan mode into tactical recipes with readable feedback and a light skill-tree perk bridge.

## Scope

- Modify `maws_src/simulation/combat.js`.
- Modify `maws_src/simulation/state.js` only for plan-mode/perk bridge.
- Add worker/report docs for this slice.
- Do not modify data values, DOM UI/CSS, economy/events, assets, package scripts, save keys, or `INITIAL_SKILLS`.

## Current Result

- Added `safe`, `pressure`, `exit`, and `probe` recipe metadata with window-scoped queue suggestions.
- Added human feedback for recipe plan fills and recipe actions.
- Added combat-readable perk hooks for small hit/risk/defense/log effects from unlocked skill-tree nodes.
- E01 and core combat tuning remain unchanged.

## Validation

- `npm run check:full`: pass.
- `node maws_src/tools/sim_day5_park_check.mjs`: pass, all origins completed 4/4 park-check objectives.
- `git diff --check`: pass.

## Risks

- The parallel skill-tree spend branch may choose different explicit perk field names; current bridge supports common shapes and has default hooks for existing node ids.

## Next Step

Commit with `feat: add combat recipe slice`; Manager pipeline handles push/merge.
