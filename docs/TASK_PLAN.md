# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

HUD follow-cursor tooltip clipping fix for the left-top resource bar heat chip on branch `feat/hud-follow-cursor-tooltip`.

## Scope

- Upgrade only the HUD `热度` chip tooltip from a fixed-position custom tooltip to a cursor-following floating tooltip.
- Preserve heat/risk terminology and all existing `行动风险`, `事件风险`, and `热度 +1` behavior.
- Allowed files: `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, `maws_src/tests/wave15_addiction_loop.spec.js`, `docs/TASK_PLAN.md`.
- Do not modify state/data/package/lock/assets/save key/version/gameplay values/event weights/economy curves/combat logic.

## Current Result

- `热度` HUD chip keeps `aria-label`, `aria-describedby="maws-hud-heat-tooltip"`, and `tabindex="0"`.
- Native `title` was removed from the HUD heat chip to avoid overlapping browser tooltip UI.
- `#maws-hud-heat-tooltip` is now created by `initMawsDomUI()` under `document.body`, not inside `.maws-chip`, `.maws-resource-row`, or `.maws-hud`.
- Pointer hover/move updates the body-level fixed tooltip near the cursor and hides on pointer leave.
- Keyboard focus positions the tooltip near the heat chip and shows it without requiring mouse coordinates.
- Tooltip position is clamped to the viewport, keeps `pointer-events: none`, and uses a z-index above HUD/panels.
- Playwright now verifies body overlay placement, full visible intersection area, viewport bounds, cursor-follow movement, and focus visibility.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed: 11/11.
- `npm run test:smoke` passed: 4/4.

## Risks

- Manual visual Browser smoke was not run in this turn; Playwright browser validation covered the HUD tooltip and responsive smoke.
- No changes were made to `maws_src/simulation/state.js`, `maws_src/content/data.js`, package files, assets, save key/version, risk values, event weights, economy curves, or combat logic.

## Next Step

Optional manual QA: open the local game and hover/focus the HUD `热度` chip on desktop, tablet, and mobile widths to visually confirm the body-level overlay is not clipped.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
