# Combat Recipe V1

## Scope

- Worker: `AGENT_C_COMBAT_FEEL`
- Slice: `COMBAT-RECIPE-001`
- Runtime files changed: `maws_src/simulation/combat.js`, `maws_src/simulation/state.js`
- Explicitly not changed: `data.js`, DOM UI/CSS, economy/events, assets, package scripts, `INITIAL_SKILLS`, enemy stats.

## Implementation

- Added lightweight tactical recipes for plan mode:
  - `safe`: `guard -> wild_swing`
  - `pressure`: `push_away -> wild_swing`
  - `exit`: `talkdown -> retreat`
  - `probe`: `retreat -> wild_swing` or `guard -> push_away`
- Empty manual queue behavior remains window-scoped:
  - manual plan still falls back to existing guard behavior.
  - non-manual plan fills only the current confirm window with up to two actions.
  - selected player actions still override plan suggestions.
- Added human recipe feedback in combat logs and plan-fill logs.
- Added a small skill-tree perk bridge:
  - `state.js` exports unlocked node effects into `combatPerks`.
  - `combat.js` reads small `hit`, `risk`, `defense`, and `log` perk fields.
  - Existing Wave14 node ids have conservative default hooks so Wave15 spend can have visible combat feel after merge.

## Balance Notes

- No enemy templates or E01 values changed.
- No combat damage scale, enemy scale, round limit, queue length, or save key changed.
- Perk hooks are intentionally small and skill-scoped.

## Validation

- `npm run check:full`: pass.
- `node maws_src/tools/sim_day5_park_check.mjs`: pass, all origins completed 4/4 park-check objectives.
- `git diff --check`: pass.
