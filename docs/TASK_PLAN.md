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

- Added a guarded prompt wrapper to `scripts/Invoke-MawsMultiCliPipeline.ps1`.
- Any worker launched through the unified pipeline now receives an explicit runtime contract before its task prompt:
  - required model/reasoning: pipeline model + reasoning, normally `gpt-5.5` / `high`;
  - no CLI image generation;
  - image-generation needs are handed back to the main Codex session;
  - generated screenshots/audit captures stay local unless explicitly requested.

## Validation

- Passed:
  - PowerShell parser check for `scripts/Invoke-MawsMultiCliPipeline.ps1`
  - `git diff --check`

## Risks

- The worker guard only applies to the unified pipeline script. Manually launched CLI windows still need the same model/image-generation instruction in their prompt or launcher.
- This checkpoint does not yet include the ordinary action reward-feedback UI patch.
- Generated screenshots under `outputs/` are local audit artifacts and must remain uncommitted.

## Next Step

Audit one ordinary action/event result modal, patch the smallest reward-feedback readability issue, validate, then commit and push on `codex/skillopt-optimization-pass`.
