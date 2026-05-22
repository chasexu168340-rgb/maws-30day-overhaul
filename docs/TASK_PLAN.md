# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

`TREE-001`: add the first runtime skill tree slice.

## Scope

- Modify skill tree data/state and worker reports only.
- Preserve DOM UI, combat formulas, assets, package scripts, save key/version, enemy data, economy curves, and major story scope.

## Current Result

- Added first-slice `SKILL_TREE_NODES` for Street Wild, Boxing Basics, and Traditional Reforge.
- Added required starter nodes for `wild_swing`, `push_away`, `jab`, `mystic`, `guard`, plus a locked/future queue-slot node.
- Added `player.insightPoints` with old-save default `0`.
- Added light insight gain from review/training/mainline completion.
- Added `skillTree` to `buildRenderModel` for the next UI branch.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `git diff --check`

## Risks

- Skill nodes do not yet apply combat effects or spending behavior; this is intentional for the system slice.
- The queue-slot node is data-only and marked future/locked.

## Next Step

Commit with `feat: add skill tree system slice`.
