# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Rebuild the live UI around a restrained, scene-first martial ledger so the player sees decisions instead of a wall of text.

## Scope

- Changed DOM presentation and focused first-look tests only.
- Kept combat formulas, economy, story content, state/save contracts, and asset keys unchanged.
- Preserved all existing actions and secondary information behind progressive disclosure.

## Current Result

- Day 1 mobile first look now gives most of the viewport to the pixel scene and cast.
- The HUD uses a single compact icon/value row on mobile instead of repeated resource labels.
- The scene command rail exposes at most two decisions plus one `更多` drawer; locations, opportunities, long descriptions, and full values remain available inside it.
- Location and daily-mainline copy is no longer repeated across the scene and command rail.
- Mobile navigation is icon-first while preserving accessible button text.
- Combat keeps the stage dominant and defaults to intent, distance, target, queue, compact commands, and execute.
- Full combat rules, window coaching, and the seven-line recap are closed by default.
- Combat command art is at least 52px wide and retains the Pixel V2 bitmap chrome.
- Reward and duration modals remain compact and retain structured reward chips.

## Validation

- `npm run check:full`: passed (build, 142 assets, 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`: passed (5 tests).
- Full `pixel_v2_visual.spec.js`: passed (35 tests).
- Final targeted Day 1 mobile visual contract: passed.
- Desktop/mobile screenshots were reviewed for scene share, command density, command-art size, and overflow.
- `git diff --check`: passed.

## Risks

- The CSS still contains historical wave overrides; this pass intentionally adds a final bounded layer instead of restructuring the stylesheet.
- Secondary ledger pages remain information-rich when expanded, by design.
- Final tactile polish still needs menu open/close motion and controller focus transitions; this pass does not add new animation systems.

## Next Step

1. Human-play Day 1-Day 5 and note any decision that still requires reading more than one short line before acting.
2. Apply the same compact hierarchy to the skill-tree purchase flow without hiding prerequisites or costs.
3. Resume the first grappling-specific motion contract only after the new combat HUD is accepted in hand play.
