# AGENT_F_WAVE14_LOOP_TESTS

## Summary

Added `maws_src/tests/wave14_loop.spec.js` with focused Wave 14 loop smoke coverage for NPC interaction, NPC reward chips, skill tree slice visibility, combat plan mode controls, and mobile time-investment modal overflow.

## Files Changed

- `maws_src/tests/wave14_loop.spec.js`
- `docs/workers/wave14_loop_smoke.md`
- `docs/agent_reports/AGENT_F_WAVE14_LOOP_TESTS.md`

## Validation

- Pass: `npm run build`
- Pass: `npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risk

- This worker only adds smoke coverage.
- Combat plan mode pointer clicks were not used because the existing page layer intercepts Playwright pointer events in that combat view; the smoke invokes the button click handler and verifies the runtime state update for each plan mode.
