# TASK_PLAN

> 当前任务单。只保留本轮目标、结果、风险和下一步。

## Current Task

Wave 10 worker: `AGENT_B_GAMEPLAY_SYSTEMS + AGENT_C_COMBAT_FEEL` starter wild kit.

## Scope

- Replace the Day 1 starter package with six wild/old skills.
- Do not grant formal `jab` or `advance` on new game.
- Keep formal skill progression behind existing training unlocks.
- Update browser/playtest assertions and worker reports.

## Plan

- [x] Add `wild_swing` and `push_away` as starter wild skills.
- [x] Update `INITIAL_SKILLS`, new-game `equipSkills`, and migration fallback.
- [x] Keep old saves from losing existing skills.
- [x] Update smoke/playtest starter assertions.
- [x] Write worker/report checkpoint files.
- [x] Run final validation commands.

## Validation

- `npm run check:full`
- `npm run test:playtest`
- `git diff --check`

## Result

Implemented and validated.

## Risks

- No combat formula changes; early fight feel is tuned only through data values and existing advice counters.
- E01 remains Day 5 objective battle coverage, not a KO/balance proof.

## Next Step

Commit and push this worker branch.
