# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave15 post-merge QA planning on `docs/wave15-post-merge-plan`.

## Scope

- Update project handoff docs after the Wave15 blocker fixes landed.
- Record merged work, known validation, remaining risks, and next candidate tasks.
- Do not modify code, package files, assets, save data, gameplay values, or build outputs.

## Current Result

- PR #40 `fix: resolve wave15 ui blockers` has been merged.
- PR #41 `fix: resolve surrender battle result` has been merged.
- The previous `P0-BATTLE-SURRENDER-RESULT` task is no longer active.
- Current project status is Wave15 post-merge QA planning.

## Verified State

- `npm run build`: passed.
- `npm run test:smoke`: passed.
- `wave15_addiction_loop` Playwright test: passed.
- Manual playtest: passed.

## Next Candidate Tasks

- Full Wave15 manual QA pass.
- Review special story battle surrender side effects.
- Investigate recommended action variety reduction.
- Combat UI polish if needed.
- Continue Day 1-Day 7 playtest.

## Risks

- Special story battle surrender side effects still need a focused review before changing behavior.
- Recommended action variety may have narrowed after recent loop changes; confirm through manual QA before tuning.
- Combat UI polish should stay conditional on QA findings, not become a new feature pass by default.

## Next Step

Run a complete Wave15 manual QA pass first. Do not start new features until the merged Wave15 baseline has been checked end to end.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
