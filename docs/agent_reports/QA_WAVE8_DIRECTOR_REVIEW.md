# QA Wave 8 Director Review

## Scope

Final QA for Wave 8 Director Rebuild after these branches were merged into `staging/reforge-unlocks-v1`:

- `feat/daily-director-loop`
- `feat/day1-7-scene-content-pass`
- `feat/ui-app-shell-declutter`
- `test/director-loop-smoke`

## Result

Ready to merge: yes.

Wave 8 now has a director-layer loop in place: the model exposes daily focus data, opportunity cards are capped and cooled down, Day 1-7 content has shorter scene-facing hooks, the DOM shell defaults to less information, and a dedicated Playwright spec covers the new director surface.

## Validation

- `npm run check:full`: passed on final staging after all product/test branches were merged.
- `npx playwright test maws_src/tests/director_loop.spec.js --browser=chromium --reporter=line`: passed, 3/3.
- `git diff --check`: passed.

## Boundary Check

- Daily Director: limited to `maws_src/simulation/state.js` and `maws_src/simulation/events.js`, plus reports.
- Scene Content Pass: limited to `maws_src/content/data.js`, plus reports.
- UI App Shell: limited to `maws_src/dom/ui.js` and `maws_src/dom/ui.css`, plus reports.
- Director Loop Tests: added `maws_src/tests/director_loop.spec.js`, plus reports.
- QA: docs only.

No Wave 8 branch changed `INITIAL_SKILLS`, granted `jab`/`advance`, edited combat formulas, changed economy curves, modified assets/manifest, or implemented Day 8/9 runtime content.

## Notes

The director loop spec failed when run on its isolated test branch before the UI shell merge because the old skills surface did not expose the required disclosure affordance. After merging the UI shell branch, the same spec passed.

## Risks

- The new shell is validated by smoke and responsive assertions, but still needs a human pass for pacing, information density, and first-10-minute clarity.
- The director model is intentionally light. It improves surfacing and opportunity pacing, but it is not yet a full Persona-style calendar system.

## Next

Run a focused playtest on Day 1-Day 7 with the new shell before implementing Day 8/9 runtime scenes.
