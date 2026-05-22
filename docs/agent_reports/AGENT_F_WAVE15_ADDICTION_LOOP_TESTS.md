# AGENT_F Wave15 Addiction Loop Tests

## Summary

Added `maws_src/tests/wave15_addiction_loop.spec.js` for Wave15 addiction-loop smoke coverage.

## Files

- `maws_src/tests/wave15_addiction_loop.spec.js`
- `docs/workers/wave15_addiction_loop_smoke.md`
- `docs/agent_reports/AGENT_F_WAVE15_ADDICTION_LOOP_TESTS.md`

## Validation

- Passed:
  - `npm run build`
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` - 5 passed
  - `git diff --check`

## Risk

- Purchase is driven through the existing store action, not a visible purchase button, because this worker is constrained to tests and reports only.
