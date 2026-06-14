# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Post Boxing Basics affordance planning / Wave15 follow-up planning.

## Current Baseline

- Current branch: `docs/post-boxing-basics-affordance-plan`.
- PR `fix: clarify boxing basics training entry` has been merged.
- This task is docs-only and must not modify code, package files, assets, `maws_src/`, save data, gameplay values, or build outputs.
- Do not commit from this task.

## Goal

Close out the merged Boxing Basics affordance PR in planning docs and define the next small Wave15 follow-up options.

## Merged PR Result

- Skill page Boxing Basics / `jab` node now has a clearer CTA.
- After the Day9 boxing gym unlock, the player can be guided from the skill page to the boxing gym.
- At the boxing gym, the `bag` / bag-combo action is more obvious.
- The `bag` display name now follows current Boxing Basics skill state:
  - no `jab`: `沙包连击（刺拳入门）`
  - has `jab` but no `straight`: `沙包连击（直拳入门）`
  - has both: `沙包连击（拳击基础）`
- The misleading state where the UI showed jab intro but the actual reward was straight has been fixed.
- The PR did not change package files, assets, save key/version, combat formulas, economy curves, event weights, skill pagination, or 100% completion rewards.

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed.
- `npm run test:smoke` passed.
- `git diff --check` passed.
- Manual playtest passed.

## Original 10-Item Issue Status

- #5 Boxing Basics / jab training entry unclear after boxing gym opens: resolved by merged PR `fix: clarify boxing basics training entry`.
- #6 Skill page pagination: paused.
- #7 Section 100% completion feedback: paused.
- #8 Individual skill 100% completion feedback: paused.
- #9 Distance unavailable: basic fallback is already done, but MMA / ground-state distance still needs QA.
- #10 Random event confirmation appears to have no change: needs another QA pass to confirm.

## Follow-up Candidates

- #10 random event confirmation feedback QA.
- #9 MMA / ground-state distance QA.
- #6 skill page pagination, paused.
- #7 section 100% completion feedback, paused.
- #8 individual skill 100% completion feedback, paused.

## Next Recommended Work

1. Prefer #10 random event confirmation feedback QA or #9 MMA / ground-state distance QA.
2. Keep the next PR narrow and QA-driven.
3. Do not jump directly into skill pagination or 100% completion reward systems.

## Validation For This Docs Task

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
- Do not mix skill pagination or 100% completion feedback into the next small PR.
- Do not treat historical stubs as the current task source.
