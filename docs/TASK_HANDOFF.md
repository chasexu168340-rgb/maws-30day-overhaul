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

1. Use SkillOpt-style rollout/audit evidence from the current worktree and rendered screenshots.
2. Pick one high-impact player-facing issue instead of broad speculative redesign.
3. Completed first-scene polish: Day 1 rental-room mobile HUD, toast, scene info, character click feedback, and bottom nav no longer fight for the same vertical space.
4. Completed ordinary reward-feedback polish: result reward chips now render as a compact centered payoff burst instead of a wide empty information box.
5. Strengthened Wave13 first-look tests around mobile nav geometry, toast placement, reachable CTA, NPC click feedback, compact reward chips, reward-burst geometry, time modal fit, and Day 5 combat HUD.
6. Keep screenshots in local `outputs/` or `test-results/` only; do not commit generated audit artifacts.

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
  - `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- Full gate before merge:
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Do Not Do

- Do not implement full 30 days, full skill tree, Day 8/9, more UI panels, broad enemy rewrites, or save key/version changes during this bounded pass.
- Do not give `jab` / `advance` as new starter skills.
- Do not let multiple workers edit the same UI files concurrently.
- Do not start CLI workers unless the user explicitly asks for workers.
- If CLI workers are explicitly requested, use `gpt-5.5` with high reasoning by default and keep QA after implementation branches are pushed or merged.
- Do not ask CLI workers to generate images; image generation belongs in the current Codex session only.
