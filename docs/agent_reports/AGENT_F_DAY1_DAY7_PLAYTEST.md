# AGENT_F_DAY1_DAY7_PLAYTEST

## Result

- Added `npm run test:playtest`.
- Added `maws_src/tests/day1_day7_playtest.spec.js`.
- Covered Day 1 new game, metro entry, skill source rendering, Day 5/E01 main event entry, and 390x844 overflow checks.

## Files Changed

- `package.json`
- `maws_src/tests/day1_day7_playtest.spec.js`
- `docs/workers/day1_day7_playtest_harness.md`
- `docs/agent_reports/AGENT_F_DAY1_DAY7_PLAYTEST.md`

## Validation

- `npm run build`: pass.
- `npm run test:smoke`: pass.
- `npm run test:playtest`: pass.
- `git diff --check`: pass.

## Risk

- The playtest intentionally avoids long exact text matches. It relies on stable action selectors, render-model state, and short partial labels only where useful.
