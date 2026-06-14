> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Post Boxing Basics affordance planning / Wave15 follow-up planning on branch `docs/post-boxing-basics-affordance-plan`.

## Scope

- Docs-only closeout after PR `fix: clarify boxing basics training entry` was merged.
- Only update `docs/TASK_PLAN.md` and `docs/TASK_HANDOFF.md`.
- Do not modify `maws_src/`, package files, assets, build outputs, save key/version, combat formulas, economy curves, event weights, skill pagination, or 100% completion rewards.
- Do not commit from this task.

## Current Result

- PR `fix: clarify boxing basics training entry` is recorded as merged.
- Original 10-item issue #5, Boxing Basics / jab training entry and guidance unclear after the boxing gym opens, is resolved.
- The merged PR improved the Boxing Basics / jab node CTA, Day9 boxing gym guidance from the skill page, and boxing gym bag affordance.
- The bag display name now follows current Boxing Basics skill state:
  - no `jab`: `沙包连击（刺拳入门）`
  - has `jab` but no `straight`: `沙包连击（直拳入门）`
  - has both: `沙包连击（拳击基础）`
- The misleading state where the UI said jab intro but the actual reward was straight has been fixed.
- No package files, assets, save key/version, combat formulas, economy curves, event weights, skill pagination, or 100% completion rewards were changed by that PR.

## Original 10-Item Issue Status

- #5 Boxing Basics / jab training entry unclear: resolved by merged PR `fix: clarify boxing basics training entry`.
- #6 Skill page pagination: paused.
- #7 Section 100% completion feedback: paused.
- #8 Individual skill 100% completion feedback: paused.
- #9 Distance unavailable: basic fallback is already done, but MMA / ground-state distance still needs QA.
- #10 Random event confirmation appears to have no change: needs another QA pass to confirm.

## Modified Files

- `docs/TASK_PLAN.md`
- `docs/TASK_HANDOFF.md`

## Verified State

- `npm run build` passed.
- `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line` passed.
- `npm run test:smoke` passed.
- `git diff --check` passed.
- Manual playtest passed.

## Risks

- This task records already-merged PR state only; it does not re-run the full code validation suite.
- Remaining Wave15 candidates should stay narrow and QA-driven before any larger skill pagination or 100% reward system work.

## Next Step

Prefer #10 random event confirmation feedback QA or #9 MMA / ground-state distance QA next. Do not jump directly into skill pagination or 100% completion reward systems.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
