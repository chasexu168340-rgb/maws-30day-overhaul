# AGENT_C_COMBAT_RECIPE_V1

## Result

Implemented Combat Recipe V1 for Wave15.

## Changed Files

- `maws_src/simulation/combat.js`
- `maws_src/simulation/state.js`
- `docs/workers/combat_recipe_v1.md`
- `docs/agent_reports/AGENT_C_COMBAT_RECIPE_V1.md`

## What Changed

- Turned plan mode into readable tactical recipes with short human feedback.
- Added `probe` plan mode.
- Kept plan automation limited to the current empty-queue combat window.
- Added combat-readable skill-tree perk hooks for small hit/risk/defense/log effects.

## Guardrails

- Did not modify E01, enemy data, damage scales, economy, events, assets, DOM UI/CSS, save keys, or `INITIAL_SKILLS`.
- Did not add full auto combat.

## Validation

- `npm run check:full`: pass.
- `node maws_src/tools/sim_day5_park_check.mjs`: pass, all origins completed 4/4 park-check objectives.
- `git diff --check`: pass.

## Risks

- Skill-tree spend branch may define explicit perk field names differently; current bridge supports `combatPerk`, `combatEffect`, `combatEffects`, and `perk`.
