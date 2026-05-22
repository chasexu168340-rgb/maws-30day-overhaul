# wave14_handoff_refresh

## Worker

`AGENT_A_PRODUCER_INTEGRATOR`

## Objective

Refresh the active checkpoint files from Wave 12/Wave 13 wording to Wave 14 Playable Loop Slice, without changing game runtime code.

## Allowed Files

- `docs/TASK_HANDOFF.md`
- `docs/TASK_PLAN.md`
- `docs/SPRINT_BOARD.md`
- `docs/workers/wave14_handoff_refresh.md`
- `docs/agent_reports/AGENT_A_WAVE14_HANDOFF_REFRESH.md`

## Result

- `TASK_HANDOFF` now names Wave 14: Playable Loop Slice as the current task.
- Staging baseline now explicitly records:
  - Wave 13 first-look QA passed.
  - NPC compact interaction menu is staged.
  - Reward deltas are compact and structured.
  - Day 5 combat HUD target is 4-6 commands/actions with queue length 1-2.
  - No skill tree runtime implementation exists yet.
- `SPRINT_BOARD` Ready Tasks now lists `NPC-ACT-001`, `TREE-001`, `UI-PLAN-001`, and `QA-014`.
- QA ordering is explicit: QA must run last after implementation branches are ready in the review base.

## Validation

- Pass: `git diff --check`
- Skipped: build/browser checks because no runtime code changed.

## Notes

- No changes were made to `maws_src/`, `assets/`, or `package.json`.
