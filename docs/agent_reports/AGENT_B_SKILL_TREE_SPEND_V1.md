# AGENT_B_SKILL_TREE_SPEND_V1

## Result

Implemented the state/data slice for spending Insight on the first six skill-tree nodes.

## Changed

- `maws_src/content/data.js`
  - Added purchase gates, readable reward text, and structured effects to the six target nodes.
- `maws_src/simulation/state.js`
  - Added skill-tree normalization for old saves.
  - Added purchase validation and settlement/rewardDeltas.
  - Added `player.skillTreePerks` / `skillTree.perks` output.
  - Added a light state-side combat bridge through existing `effects.risk`.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- Direct state check for `purchaseSkillTreeNode` and old-save normalization: passed.
- `git diff --check`: passed.

## Risk

- The state action is complete, but the current DOM button still dispatches `toast` because UI files were forbidden. UI wiring should use `node.purchaseAction` / `purchaseSkillTreeNode`.
- Per-skill hit bonuses are represented as structured perks and small mastery bumps. Combat-specific hit formula wiring is left to the combat/UI integration worker to avoid changing `combat.js`.
