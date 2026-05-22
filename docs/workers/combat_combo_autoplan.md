# Combat Combo Autoplan

## Scope

- Worker: `AGENT_C_COMBAT_FEEL`
- Branch/worktree: current independent worker worktree
- Files changed:
  - `maws_src/simulation/combat.js`
  - `docs/workers/combat_combo_autoplan.md`
  - `docs/agent_reports/AGENT_C_COMBAT_COMBO_AUTOPLAN.md`

## Implementation

- Added lightweight internal `COMBO_RULES` for:
  - `jab -> straight` 1-2 rhythm.
  - future `push_away -> wild_swing` rhythm if starter wild skills land in another branch.
  - `guard -> strike` counter bonus.
  - `retreat -> strike` pull-and-tag bonus.
  - `talkdown -> retreat` cool-exit bonus.
- Combo bonuses are current-window only:
  - small hit chance increase.
  - small miss-risk reduction.
  - small stamina refund.
  - extra combat log line and COMBO fx marker.
- Added exported `suggestCombatQueue(combat)` helper.
  - Uses current `equipSkills`, distance, stamina, and weapon danger.
  - Returns a safe two-action suggestion.
  - Does not force actions for the player.
- When the player rests with no queue, combat logs a safe default suggestion for the next queue.

## Validation

- `npm run check:full`: passed.
- `git diff --check`: passed.

## Notes

- No UI, data, state, assets, save key/version, or base damage formula changes.
- The future `wild_swing/push_away` rule is inert until those skill ids exist.
