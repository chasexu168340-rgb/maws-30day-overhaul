# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave 15 manual QA round 6 focused UI blocker fixes on `fix/wave15-ui-blockers`.

## Scope

- Fix bottom navigation / dock overlap with map scene character labels.
- Fix combat "current window action queue" so it no longer sticks to the bottom of the left combat planner and covers intent/log information.
- Prefer CSS-only changes in `maws_src/dom/ui.css`.
- Do not change package files, assets, save key/version, combat formulas, enemy data, economy, skill tree logic, or surrender result logic.
- Do not revisit already-passed dark card text readability rules unless this task regresses them.

## Current Result

- Updated `maws_src/dom/ui.css` only for runtime UI.
- Bottom navigation clearance now uses a larger `--maws-bottom-nav-clearance` for `.maws-main`, so scene content stops above the fixed nav with a safe gap.
- Normal scene character labels get extra scene-cast bottom clearance plus a small upward label offset; interaction-menu-specific label lifting remains separate.
- `.maws-combat-queue` is forced back into normal document flow with `position: static`, `bottom: auto`, and no elevated z-index, while keeping capped height and internal vertical scrolling.
- No JS, combat logic, data, package files, save keys, or assets were changed.

## Validation

- `npm run build`: passed.
- `git diff --check`: passed with CRLF warnings only for existing working-copy line-ending normalization.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`: passed, 5 Chromium tests.
- In-app Browser plugin was unavailable (`iab` browser not available), so final UI smoke used local Playwright.
- Targeted Playwright geometry smoke passed at 1365x768, 900x700, and 390x844: scene labels clear the bottom nav, queue computed style is `position: static` and `bottom: auto`, planner/side panels scroll internally, and map/combat horizontal overflow is 0.

## Risks

- This remains CSS-only and layered after prior Wave 15 overrides, so manual QA should still recheck against the original failing state.
- Increasing `.maws-main` bottom clearance reduces vertical content space slightly, especially on small screens, but preserves bottom nav visibility and clickability.

## Next Step

- Run build and UI smoke.
- If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
