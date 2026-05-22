# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave 15 `TREE-SPEND-001`: make the first six skill-tree nodes spendable from state/data.

## Scope

- Implement Insight point cost, prerequisite checks, purchase state, old-save defaults, and settlement/rewardDeltas.
- Touch only `maws_src/content/data.js`, `maws_src/simulation/state.js`, and this task/report documentation.
- Do not modify DOM UI, combat formulas, events, assets, package scripts, save key/version, or starter skill constants.

## Current Result

- Added spendable metadata and structured effects for the six requested nodes.
- Added state action aliases `purchaseSkillTreeNode`, `buySkillTreeNode`, and `unlockSkillTreeNode`.
- Added `skillTree.unlocked`, `skillTree.purchased`, `skillTree.perks`, and `player.skillTreePerks` normalization for old saves.
- Added settlement modal/rewardDeltas on purchase and light combat bridge via existing `effects.risk`.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- Direct state check for `purchaseSkillTreeNode` and old-save normalization: passed.
- `git diff --check`: passed.

## Risks

- UI buttons still dispatch `toast` because `maws_src/dom/ui.js` is forbidden in this worker. The render model exposes `canPurchase` and `purchaseAction` for a UI worker to wire.
- Per-skill hit boosts are currently expressed as structured perks plus small mastery gains; full hit-formula consumption belongs to the combat worker because `combat.js` is forbidden.

## Next Step

Commit with `feat: add skill tree spend slice`; next UI worker should wire available skill-tree nodes to `purchaseSkillTreeNode`.
