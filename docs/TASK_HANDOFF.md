# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Post #47 planning / Wave15 follow-up planning.

## Current Baseline

- Current branch: `docs/post-hud-tooltip-plan`.
- PR #47 `feat: add follow cursor heat tooltip` has been completed and merged.
- This task is docs-only and must not modify code, package files, assets, `maws_src/`, save data, gameplay values, or build outputs.

## Goal

Close out #47 documentation and define the next small Wave15 follow-up options.

## #47 Completed And Merged

- Upgraded the HUD `热度` tooltip from a basic/fixed tooltip to a cursor-following floating tooltip.
- Moved the tooltip overlay under `document.body` so it is no longer clipped by the HUD/resource container.
- Preserved `aria-label`, `aria-describedby`, and `tabindex` for accessibility.
- Preserved keyboard focus support.
- Added viewport clamping so the tooltip stays visible on screen.
- Confirmed manual playtest: tooltip appears on hover, follows cursor, is fully visible, is not clipped by the HUD, and stays within viewport.
- Did not change state/data logic, risk values, event weights, economy curves, combat logic, package files, assets, or save key/version.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed: 11/11.
- `npm run test:smoke` passed: 4/4.
- Manual playtest completed and passed.

## Follow-up Candidates

- `P1-COMBAT-GROUND-DISTANCE-QA`: test whether distance adjustment can get stuck in MMA / ground-state combat.
- Full Day1-Day7 manual QA pass.
- Skill pagination, 100% completion feedback, and Boxing Basics deepening are paused; do not mix them into the next small PR.

## Next Recommended Work

1. Prefer `P1-COMBAT-GROUND-DISTANCE-QA` or a Full Day1-Day7 manual QA pass.
2. Keep the next PR narrow.
3. Do not jump directly into a large growth-system redesign.

## Validation

- This closeout update is docs-only and does not require rerunning build or browser tests.
- Run `git diff --check -- docs/TASK_PLAN.md docs/TASK_HANDOFF.md`.
- For the next code/UI PR, run `npm run build`, relevant focused Playwright checks, `npm run test:smoke`, and manual QA for the touched flow.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

## Do Not Do

- Do not implement code during this docs-only closeout task.
- Do not change gameplay values, save key/version, package files, assets, or `maws_src/`.
- Do not mix skill pagination, 100% completion feedback, or Boxing Basics deepening into the next small PR.
- Do not treat historical stubs as the current task source.
