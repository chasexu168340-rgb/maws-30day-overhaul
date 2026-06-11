# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Second-round polish fixes on `polish/risk-heat-terminology`.

## Scope

- Remove duplicated heat guidance card from the resource annotation page.
- Add a visible HUD heat-chip tooltip for the left/top resource bar.
- Keep real long-term heat resource deltas displayed as `热度 +1/-1`.
- Keep action/event danger wording as `行动风险` / `事件风险`.
- Do not change risk values, event weights, economy curves, combat logic, save key/version, package files, lock files, assets, skill pagination, or 100% completion rewards.

## Current Result

- `maws_src/dom/ui.js`: removed the standalone `! 热度怎么理解` pseudo resource card; the original heat resource card is now titled `热度（长期暴露压力）` and carries the explanatory resource description.
- `maws_src/dom/ui.js` and `maws_src/dom/ui.css`: HUD heat chip now keeps `title`/`aria-label` and includes a minimal visible hover/focus tooltip at `#maws-hud-heat-tooltip`.
- `maws_src/simulation/state.js` and `maws_src/dom/ui.js`: added label fallbacks so long-term `heat` or legacy `risk` resource deltas render as `热度`, including result lead text and reward chips.
- `maws_src/tests/wave15_addiction_loop.spec.js`: updated focused Playwright coverage for single heat resource card, visible HUD tooltip, `热度 +1` result feedback, and preserved `行动风险` / `事件风险` wording.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed: 11/11.

## Risks

- HUD heat chip still uses the existing `.risk` CSS class for visual danger styling only; player-facing copy remains `热度`.
- The fix is terminology/rendering only; no gameplay values, weights, packages, assets, combat, or save identifiers were changed.

## Next Step

Run `npm run build` and `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
