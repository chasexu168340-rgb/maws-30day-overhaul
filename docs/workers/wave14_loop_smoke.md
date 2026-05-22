# Wave 14 Loop Smoke

## Scope

- Worker: `AGENT_F_TECH_QA_TOOLS`
- Task: add focused Playwright smoke coverage for the Wave 14 playable loop.
- Modified files: `maws_src/tests/wave14_loop.spec.js`, `docs/workers/wave14_loop_smoke.md`, `docs/agent_reports/AGENT_F_WAVE14_LOOP_TESTS.md`
- Business code, data, styles, assets, package scripts: not modified.

## Coverage

1. Click Liu Pangzi in the scene and verify his compact NPC menu exposes real action buttons.
2. Execute one small NPC action and verify reward chips are compact, deduplicated, and not prose sentences.
3. Open the Skills tab and verify the skill tree slice and tree nodes are visible.
4. Start combat and verify all plan mode controls are visible, clickable, and update combat state.
5. Open the time-investment modal on a mobile viewport and verify it has no horizontal overflow.

## Validation

- Pass: `npm run build`
- Pass: `npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Notes

- The spec starts the same local static server pattern used by existing Playwright smokes.
- The test drives existing UI and store actions only; it does not alter runtime state outside each browser test setup.
- Combat plan mode buttons were verified by invoking each button's click handler and asserting `state.combat.planMode` updates to `manual`, `safe`, `pressure`, and `exit`.
