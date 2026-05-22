# AGENT_F_TECH_QA_TOOLS - Director Loop Tests

## Completed

- Added `maws_src/tests/director_loop.spec.js`.
- Added checks for first-screen mainline summary visibility.
- Added recommendation count guard of 1 to 3 visible cards.
- Added skill page/modal disclosure affordance check using `details summary` or `.maws-disclosure`.
- Added 390x844 mobile horizontal overflow coverage for the director and skills surfaces.

## Files Changed

- `maws_src/tests/director_loop.spec.js`
- `docs/workers/director_loop_tests.md`
- `docs/agent_reports/AGENT_F_DIRECTOR_LOOP_TESTS.md`

## Validation

- Passed: `npm run build`
- Failed: `npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line`
  - 2 passed.
  - 1 failed: `skills surface or its modal exposes a collapsible details affordance`.
  - Failure reason: current skills UI/modal does not expose `details/summary` or `.maws-disclosure`.
- Failed: `git diff --check`
  - Failure reason: unrelated trailing whitespace exists in `maws_src/simulation/events.js` and `maws_src/simulation/state.js`, both outside this worker's allowed edit scope.
- Passed: `git diff --check -- maws_src/tests/director_loop.spec.js docs/workers/director_loop_tests.md docs/agent_reports/AGENT_F_DIRECTOR_LOOP_TESTS.md`

## Risk

- The new test intentionally codifies the product requirement that skills or the skill modal expose a collapsible disclosure affordance. If the current UI lacks that affordance, this spec will fail until the UI worker implements it.
- Full diff whitespace validation remains blocked by unrelated business-file whitespace that this worker did not change.
