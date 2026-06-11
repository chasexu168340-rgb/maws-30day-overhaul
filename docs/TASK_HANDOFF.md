# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Post #45 planning / Wave15 follow-up planning.

## Current Baseline

- Current branch: `docs/post-risk-heat-polish-plan`.
- PR #45 `polish: clarify risk and heat terminology` has been completed and merged.
- This task is docs-only and must not modify code, package files, assets, `maws_src/`, save data, gameplay values, or build outputs.

## Goal

Close out #45 documentation and define the next small Wave15 follow-up options.

## #45 Completed And Merged

- Removed the duplicated heat explanation card from the resource annotation page.
- Added the baseline HUD heat tooltip.
- Kept long-term resource changes displayed as `热度 +1/-1`.
- Kept action danger wording as `行动风险`.
- Kept event danger wording as `事件风险`.
- Did not change numeric values, event weights, economy curves, combat logic, package files, assets, or save key/version.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed.
- `npm run test:smoke` passed.
- Manual playtest completed.

## Follow-up Candidates

- `P2-HUD-FOLLOW-CURSOR-TOOLTIP`: upgrade the HUD heat explanation to a cursor-following floating tooltip.
- `P1-COMBAT-GROUND-DISTANCE-QA`: test whether distance adjustment can get stuck in MMA / ground-state combat.
- Full Day1-Day7 manual QA pass.
- Skill pagination, 100% completion feedback, and Boxing Basics deepening are paused; do not mix them into the next small PR.

## Next Recommended Work

1. Prefer a narrow QA task or `P2-HUD-FOLLOW-CURSOR-TOOLTIP`.
2. If choosing QA first, start with `P1-COMBAT-GROUND-DISTANCE-QA` or a Full Day1-Day7 manual QA pass.
3. Do not jump directly into a large growth-system redesign.

## Validation

- This closeout update is docs-only and does not require rerunning build or browser tests.
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
