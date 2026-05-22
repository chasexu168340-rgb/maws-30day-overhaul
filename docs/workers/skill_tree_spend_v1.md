# Skill Tree Spend V1

## Scope

- Worker: AGENT_B_GAMEPLAY_SYSTEMS / Progression Slice.
- Files changed: `maws_src/content/data.js`, `maws_src/simulation/state.js`.
- Explicitly avoided: `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, `maws_src/simulation/combat.js`, `maws_src/simulation/events.js`, assets, save key/version, starter skill constants.

## Implemented Slice

- Added spendable metadata and structured effects for six nodes:
  - `street_wild_swing_mastery`
  - `street_push_away_space`
  - `boxing_jab_unlock_boost`
  - `boxing_guard_recovery`
  - `traditional_mystic_rewrite`
  - `traditional_guard_rewrite`
- Added state-side purchase action aliases:
  - `purchaseSkillTreeNode`
  - `buySkillTreeNode`
  - `unlockSkillTreeNode`
- Added old-save normalization for `skillTree.unlocked`, `skillTree.purchased`, `skillTree.perks`, and `player.skillTreePerks`.
- Kept `SAVE_KEY`, `GAME_VERSION`, `INITIAL_SKILLS`, and `STARTER_EQUIP_SKILLS` unchanged.

## Gameplay Effect Contract

- Purchases spend `player.insightPoints`.
- Purchases create settlement feedback with `rewardDeltas`.
- Purchases expose structured perks through `state.skillTree.perks`, `player.skillTreePerks`, render model node fields, and `toCombatInput().skillTree`.
- Current state bridge applies small risk changes through existing combat `effects.risk` when the active queue matches:
  - `push_away -> retreat`
  - `guard -> next action`
  - `mystic` action
- Existing combat formulas are not changed.

## Known UI Handoff

`maws_src/dom/ui.js` currently renders skill-tree buttons as `toast` only and this worker was forbidden from editing UI. The model now exposes `canPurchase` and `purchaseAction`; UI worker can wire available nodes to `purchaseSkillTreeNode` without touching progression rules.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- Direct state check for purchase + old-save normalization: passed.
- `git diff --check`: passed.
