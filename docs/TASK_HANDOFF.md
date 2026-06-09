# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Wave15 post-merge QA planning.

## Current Baseline

- Wave15 first-stage work is integrated on the current post-merge baseline.
- PR #40 `fix: resolve wave15 ui blockers` has been merged.
- PR #41 `fix: resolve surrender battle result` has been merged.
- The old `P0-BATTLE-SURRENDER-RESULT` task is complete and should not be treated as the active task.

## Verified State

- `npm run build`: passed.
- `npm run test:smoke`: passed.
- `wave15_addiction_loop` Playwright test: passed.
- Manual playtest: passed.

## Goal

Confirm the merged Wave15 baseline with a full manual QA pass before opening new feature work.

## Next Recommended Work

1. Full Wave15 manual QA pass.
2. Continue Day 1-Day 7 playtest and record concrete issues.
3. Review special story battle surrender side effects only if QA finds progression or result inconsistencies.
4. Investigate recommended action variety reduction only after QA confirms the pattern.
5. Apply combat UI polish only if manual QA identifies specific readability or clickability problems.

## Candidate Backlog

- Review special story battle surrender side effects.
- Investigate recommended action variety reduction.
- Combat UI polish if needed.
- Continue Day 1-Day 7 playtest.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

## Validation

- QA planning docs-only updates do not require `npm run build`.
- Next QA worker should run the project's current browser/manual QA gates against the merged baseline.
- For code/data/UI fixes discovered by QA, run `npm run build`, relevant smoke or Playwright checks, and `git diff --check`.

## Do Not Do

- Do not start new feature implementation before the full Wave15 manual QA pass.
- Do not change gameplay values, save key/version, package files, assets, or `maws_src/` during docs-only planning.
- Do not treat historical stubs as the current task source.
