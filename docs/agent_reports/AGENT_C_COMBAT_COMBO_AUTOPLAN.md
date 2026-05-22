# AGENT_C_COMBAT_COMBO_AUTOPLAN

## Result

Implemented combat combo feel and an automatic combat strategy helper inside `combat.js`.

## Changed

- Added `COMBO_RULES` with 1-2, guard counter, retreat strike, talkdown retreat, and future wild starter rhythm.
- Applied combo effects only inside the current selected action window.
- Added combo log/fx output through existing combat step surfaces.
- Added `suggestCombatQueue(combat)` and default rest-time strategy logging without forcing player actions.

## Constraints Kept

- Did not modify `maws_src/content/data.js`.
- Did not modify `maws_src/simulation/state.js`.
- Did not modify DOM UI/CSS, assets, initial skills, economy, save key, or save version.
- Did not copy or rewrite the base damage formula.

## Validation

- `npm run check:full`: passed.
- `git diff --check`: passed.

## Risk

- The future `push_away -> wild_swing` combo is intentionally dormant until another worker adds those skills.
- Rest-time strategy advice appears in combat logs only; no UI affordance was added.
