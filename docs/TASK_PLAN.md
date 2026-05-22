# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave 15 core addiction slice: merge `TREE-SPEND-001` and `COMBAT-RECIPE-001`.

## Scope

- Skill tree spend branch adds Insight costs, prerequisites, purchase state, old-save defaults, and purchase feedback.
- Combat recipe branch adds plan-mode recipes, human-readable combat feedback, and combat perk consumption.
- Manager resolves the expected overlap in `maws_src/simulation/state.js`.
- Do not change UI, assets, package scripts, starter skills, save key/version, or broad combat balance.

## Current Result

- `feat/skill-tree-spend-v1` merged and passed `npm run check:full`, `npm run test:playtest`, and `git diff --check`.
- `feat/combat-recipe-v1` merge produced conflicts in this file and `maws_src/simulation/state.js`.
- Conflict resolution keeps skill-tree spend state plus combat recipe perk bridge and plan feedback.

## Validation

- Pending after conflict resolution:
  - `npm run check:full`
  - `node maws_src/tools/sim_day5_park_check.mjs`
  - `git diff --check`

## Risks

- This is a focused bridge between spendable nodes and combat recipes; it is not a full skill-tree economy or full automatic combat rewrite.
- `GameDesigner_CombatAnalysis/` remains untracked and unrelated.

## Next Step

Resolve conflicts, commit `merge: Wave15-CombatRecipe`, push staging, then continue Wave15 smoke and QA.
