# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Post #45 planning / Wave15 follow-up planning after merge of `polish: clarify risk and heat terminology`.

## Scope

- Docs-only closeout for merged PR #45.
- Record #45 as completed and merged.
- Set the current checkpoint to planning for small Wave15 follow-up work.
- Do not modify code, package files, lock files, assets, `maws_src/`, gameplay values, event weights, economy curves, combat logic, save key/version, skill pagination, or 100% completion rewards.

## Current Result

- PR #45 `polish: clarify risk and heat terminology` has been completed and merged.
- #45 removed the duplicated heat explanation card from the resource annotation page.
- #45 added the baseline HUD heat tooltip.
- #45 kept long-term resource changes displayed as `热度 +1/-1`.
- #45 kept action danger as `行动风险` and event danger as `事件风险`.
- #45 did not change numeric values, event weights, economy curves, combat logic, package files, assets, or save key/version.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed.
- `npm run test:smoke` passed.
- Manual playtest completed.

## Follow-up Candidates

- `P2-HUD-FOLLOW-CURSOR-TOOLTIP`: upgrade the HUD heat explanation to a cursor-following floating tooltip.
- `P1-COMBAT-GROUND-DISTANCE-QA`: test whether distance adjustment can get stuck in MMA / ground-state combat.
- Full Day1-Day7 manual QA pass.
- Skill pagination, 100% completion feedback, and Boxing Basics deepening remain paused; do not mix them into the next small PR.

## Risks

- Follow-up work should stay small. Avoid expanding directly into a large growth-system redesign.
- Combat distance QA may reveal a gameplay bug, but this checkpoint does not authorize formula, balance, or save-format changes.

## Next Step

Recommended next work: choose either a narrow QA pass or `P2-HUD-FOLLOW-CURSOR-TOOLTIP`. Do not jump straight into a large growth-system change.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
