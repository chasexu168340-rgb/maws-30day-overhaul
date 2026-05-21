# QA_PARALLEL_REVIEW

## Scope

Parallel review for:

- `feat/codex-harness-delta`
- `feat/skill-unlocks-data`
- Follow-up branch readiness from the current parallel wave

## Harness Delta

Status: pass and already merged into `staging/reforge-unlocks-v1`.

Evidence:

- Harness checkpoint was fixed with `docs: mark harness delta pushed`.
- `staging/reforge-unlocks-v1` merged harness with `--no-ff`.
- Manager ran `npm run check:full`: passed.
- Manager ran `git diff --check`: passed.
- Staging push succeeded at merge head `6dc2faa`.

QA notes:

- `TASK_HANDOFF.md` is now the current recovery entry.
- `CURRENT_*` and `CHANGELOG.md` are historical stubs.
- `EXECUTION_CONTRACT.md` and `VALIDATION.md` provide the right default constraints for later workers.

## Skill Unlocks

Status: pass for review after fixup. Not merged into staging in this QA branch.

Evidence:

- Latest pushed branch head: `d9d327f`.
- `SKILL_UNLOCKS` now covers all current skills:
  - Initial: `mystic`, `guard`, `retreat`, `talkdown`
  - Real action sources: `dodge`, `jab`, `straight`, `palm`, `offbalance`, `grip`, `takedown`, `sprawl`, `escape`, `sanda_whip_kick`, `sanda_catch_throw`, `karate_reverse_punch`, `karate_front_kick`, `tkd_roundhouse`, `tkd_back_kick`
  - Planned: `advance`, `lowkick`, `frontkick`, `sidecontrol`, `dirtyescape`
- `model.skillUnlocks` is now keyed by `skillId`.
- Existing first-learn settlement line behavior is preserved.

Validation recorded from the Systems worktree:

- `npm run build`: passed.
- Fixup Node smoke: passed.
- `npm run test:smoke`: passed after `npm ci` installed local worktree dependencies.
- `git diff --check`: passed; only Git CRLF working-copy warnings.

QA notes:

- The remaining planned skills are intentionally not learnable yet. That is correct because no real training source exists for them.
- UI should consume `model.skillUnlocks[skillId]`, not array `.find()`.

## Parallel Branches

- `content/day1-day9-proposal`: pushed at `206a7f3`; docs-only proposal, `git diff --check` passed, build skipped appropriately.
- `asset/metro-visual-bridge`: pushed at `fcaf4bc`; manifest fallback keys added, `verify_assets`, build, and diff check passed. No entity files under `assets/` were modified.

## Merge Recommendation

Recommended order:

1. `feat/skill-unlocks-data`
2. `asset/metro-visual-bridge`
3. `content/day1-day9-proposal`
4. `qa/parallel-review`

Do not start UI until `feat/skill-unlocks-data` is merged or explicitly chosen as the UI base. The next implementation step should be `AGENT_E_UI_PRESENTATION` reading `model.skillUnlocks[skillId]`.

## Validation

- `git diff --check`: passed for this QA report branch.
