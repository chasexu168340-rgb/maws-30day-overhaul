# AGENT_C_COMBAT_PLAN_MODE

## Summary

Implemented a lightweight combat plan mode foundation without changing combat damage, hit, enemy scaling, economy, assets, DOM, or data tables.

## Files Changed

- `maws_src/simulation/combat.js`
- `maws_src/simulation/state.js`
- `docs/workers/combat_plan_mode.md`
- `docs/agent_reports/AGENT_C_COMBAT_PLAN_MODE.md`

## Implementation Notes

- Added `manual`, `safe`, `pressure`, and `exit` plan modes.
- `suggestCombatQueue` now checks plan mode first and returns at most two usable equipped actions.
- Empty combat confirmation fills only the current window queue; selected player actions always win.
- Added reserved `planSlot` and `comboSlot` fields to active combat state and render model.
- Added plan-trigger log text with plan id/label, queue, and reserved slot values.
- Left combo bonuses small and reused the existing combo rule path.

## Validation

Passed:

- `npm run check:full`
  - `npm run build` passed.
  - Chromium smoke passed: 4/4 tests.
- `node maws_src/tools/sim_day5_park_check.mjs`
  - `worker`, `fan`, and `student` origins all passed park check.
- `git diff --check`
  - No whitespace errors.

## Risks

- No DOM controls were added in this worker, so changing plan mode requires future UI or dispatch wiring.
- Existing manual empty-confirm `guard` fallback remains available to preserve current behavior.
