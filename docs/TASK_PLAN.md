# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Post #47 planning / Wave15 follow-up planning.

## Scope

- Record that PR #47 `feat: add follow cursor heat tooltip` has been completed and merged.
- Close out the HUD heat follow-cursor tooltip work.
- Define next Wave15 follow-up candidates without starting new implementation.
- Documentation-only update.
- Do not modify code, package files, assets, save key/version, gameplay values, event weights, economy curves, combat logic, skill pagination, or 100% completion rewards.

## Current Result

- PR #47 `feat: add follow cursor heat tooltip` completed and merged.
- HUD `热度` tooltip was upgraded from a basic/fixed tooltip to a cursor-following floating tooltip.
- Tooltip is mounted under `document.body`, avoiding clipping by the HUD/resource container.
- Tooltip supports hover, cursor movement, keyboard focus, viewport clamping, and remains fully visible.
- `aria-label`, `aria-describedby`, and `tabindex` support were preserved.
- Follow-cursor tooltip manual playtest passed: tooltip appears, follows cursor, is not clipped by HUD, and stays within viewport.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed: 11/11.
- `npm run test:smoke` passed: 4/4.
- Manual playtest passed for HUD heat tooltip visibility, cursor-follow movement, clipping, and viewport behavior.

## Follow-up Candidates

- `P1-COMBAT-GROUND-DISTANCE-QA`: test whether distance adjustment can get stuck in MMA / ground-state combat.
- Full Day1-Day7 manual QA pass.
- Skill pagination, 100% completion feedback, and Boxing Basics deepening are paused; do not mix them into the next small PR.

## Risks

- The follow-cursor tooltip task is complete; do not continue tweaking tooltip behavior unless a new regression is found.
- The next work should stay narrow. Avoid jumping directly into a large growth-system redesign.

## Next Step

Prefer one of:

1. `P1-COMBAT-GROUND-DISTANCE-QA`
2. Full Day1-Day7 manual QA pass

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
