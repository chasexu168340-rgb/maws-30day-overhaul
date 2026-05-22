# Director Loop Tests

## Scope

- Added Playwright coverage for the default director surface.
- Covered visible mainline summary, capped recommendations, skill disclosure affordance, and 390x844 horizontal overflow.
- Kept the change limited to tests and worker reports; no gameplay, UI, data, CSS, package, or asset files were edited.

## Validation

```powershell
npm run build                                            # passed
npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line
                                                         # failed: skills disclosure affordance missing
git diff --check                                         # failed: pre-existing whitespace in forbidden business files
git diff --check -- maws_src/tests/director_loop.spec.js docs/workers/director_loop_tests.md docs/agent_reports/AGENT_F_DIRECTOR_LOOP_TESTS.md
                                                         # passed
```

## Notes

- Assertions avoid long exact copy checks and use DOM structure, counts, visibility, and overflow metrics.
- The disclosure test accepts native `details/summary` or `.maws-disclosure` on the skills surface or its modal.
- Current result: mainline summary, recommendation cap, and 390x844 overflow checks pass; the skills disclosure check fails because the current UI does not expose the required collapsible affordance.
- Full `git diff --check` reports unrelated trailing whitespace in `maws_src/simulation/events.js` and `maws_src/simulation/state.js`, which are outside this worker's allowed edit scope.
