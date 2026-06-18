# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

SkillOpt-style ordinary action reward-feedback polish for the current playable slice.

## Scope

- Continue the audit -> patch -> validate loop from the first playable scene into ordinary action/event result feedback.
- Improve reward/result readability without changing systems, combat formulas, economy, starter skills, save keys, asset structure, or broad UI architecture.
- No CLI workers are running for this pass.
- Future CLI workers must use `gpt-5.5` with high reasoning by default.
- CLI workers must not generate images, sprite sheets, moodboards, or visual assets; image generation belongs in the current Codex session only.

## Current Result

- Audited an ordinary Day 1 duration-action result modal with a rendered screenshot.
- Found the highest-impact issue: reward chips existed, but the reward area still read like a wide empty information box instead of a compact payoff burst.
- Kept existing reward data and settlement behavior intact; no economy, combat, story, save, or asset changes.
- `renderRewardChips()` now emits a cleaner list/listitem structure with a reward-count CSS variable for layout control.
- `.maws-reward-chips.hero` now lays out as a centered compact reward burst: five chips can fit in one desktop row, and low-count rewards shrink instead of leaving a giant empty box.
- Strengthened `wave13_first_look.spec.js` to wait for the reward-pop animation, assert reward-list semantics, constrain reward-burst height, and verify each reward chip surfaces a clear value.

## Validation

- Passed:
  - `npx playwright test maws_src/tests/wave13_first_look.spec.js --grep "ordinary action reward" --browser=chromium --reporter=line`
  - `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Risks

- The worker guard only applies to the unified pipeline script. Manually launched CLI windows still need the same model/image-generation instruction in their prompt or launcher.
- This is a reward feedback polish pass, not a full modal redesign or new VFX/audio payoff system.
- Generated screenshots under `outputs/` are local audit artifacts and must remain uncommitted.

## Next Step

Commit and push the ordinary action reward-feedback polish on `codex/skillopt-optimization-pass`.
