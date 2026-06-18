# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

SkillOpt-style optimization pass for the current MAWS playable slice.

## Current Staging Baseline

- Wave 15 QA merged.
- Skill-tree spend state exists with Insight costs, prerequisites, purchased state, and small runtime effects.
- Combat recipes exist for tactical plan modes.
- Wave15 smoke covers skill-tree spend, recipe controls, recipe feedback, and mobile overflow.

## Goal

Use the Microsoft SkillOpt pattern as a production workflow: run a current-state rollout/audit, select bounded high-impact patches, validate them behind gates, and keep only changes that improve the player-facing loop.

The player-facing target remains: the player clicks something, the game responds clearly, the character changes, and the next action or fight feels different.

## Current Pass

1. Identify real gaps between render model capability and player-facing UI.
2. Fix the highest-impact gap with minimal architecture movement.
3. Strengthen tests so they validate the player path instead of bypassing UI.
4. Update checkpoint and validation evidence.
5. Current follow-up verifies the natural path: early `视频复盘` earns Insight through UI, then the player buys a skill-tree node through UI.

## Deferred Larger Work

- Full 30-day implementation.
- Full skill-tree economy.
- Day 8/9 emotional beat implementation.
- Broad enemy or combat formula rewrites.
- New asset pipeline work.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/VALIDATION.md`
6. current worker prompt or optimization report if present

## Validation

- Targeted optimization check:
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`
- Full gate before merge:
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Do Not Do

- Do not implement full 30 days, full skill tree, Day 8/9, more UI panels, broad enemy rewrites, or save key/version changes during this bounded pass.
- Do not give `jab` / `advance` as new starter skills.
- Do not let multiple workers edit the same UI files concurrently.
