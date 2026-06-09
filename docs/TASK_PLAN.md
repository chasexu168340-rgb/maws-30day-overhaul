# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave15 second manual QA focused fixes on `fix/wave15-core-affordance-gaps`.

## Scope

- Fix only remaining manual QA failures: risk explanation clarity, risk/heat HUD synchronization, and actionable distance adjustment when current distance is unusable.
- Do not touch already-passed NPC travel, shop cost disclosure, or insight display unless required to prevent regression.
- Do not implement skill pagination, 100% completion rewards, Boxing Basics deepening, random-event logic expansion, package changes, assets, save key/version, economy curves, or event weights.

## Current Result

- Risk/heat guidance is now clearer in action/event risk text and in a stable profile resource card explaining what risk means, negative effects, and existing mitigation routes.
- `gain.risk` is normalized to `gain.heat`, and HUD/profile heat display reads `player.heat` with `player.risk` fallback; real heat changes now update the HUD immediately.
- Event danger chips now display as `事件风险 低/中/高` instead of fake resource deltas like `风险 +1`, so only real heat changes imply HUD movement.
- Combat distance UI now promotes an existing legal movement card when distance is unusable; if none is legal, it shows a clickable `调整距离` fallback that adjusts one step toward a usable distance without unlocking planned skills.
- Focused regression coverage was expanded in `maws_src/tests/wave15_addiction_loop.spec.js` for HUD heat sync and the fallback distance action.

## Verified State

- `npm run build`: passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`: passed, 11 tests.
- `npm run test:smoke`: passed, 4 tests.

## Risks

- The fallback distance button is intentionally narrow: it appears only when a distance-unavailable card exists and no learned/equipped movement action is currently legal.
- It adjusts combat distance directly as a temporary affordance, not as a full new movement/initiative system.
- Random event logic was not expanded; only the misleading event-risk chip wording was changed.

## Next Step

Manual QA the three remaining items: profile/action/event risk copy, immediate HUD risk change after a heat action, and the combat `调整距离` fallback.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
