# Wave 11 Flow Smoke

## Scope

- Added `maws_src/tests/wave11_flow.spec.js`.
- Targeted smoke only; no runtime game code, data, styles, package scripts, or assets were changed.
- Checks avoid long exact-copy assertions and focus on visible UI structure, sizing, and flow affordances.

## Covered Checks

- Combat view keeps the highlighted current action window to one or two queue slots/cards.
- Action result modal surfaces visible `.maws-reward-chip` reward feedback.
- Small result content keeps the always-visible modal body compact and moves detail behind `details`.
- Duration/time investment modal opens at `390x844` and has no horizontal overflow.
- Skills page exposes useful status/scan information outside `details`.

## Validation

Passed:

- `npm run build`
- `npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line`
- `git diff --check`

## Result

- Build checked 24 JavaScript files and verified 95 manifest entries.
- Targeted Wave 11 Chromium smoke passed: 4/4 tests.
- Diff whitespace check passed.
