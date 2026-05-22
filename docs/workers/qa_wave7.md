# QA Wave7 Worker Summary

## Scope

Reviewed and validated Wave 7 after the three product branches were committed and merged into `staging/reforge-unlocks-v1`.

Reviewed branches:

- `feat/day1-day7-playtest-harness`
- `feat/day5-combat-sim-tool`
- `docs/day1-day7-playtest-rubric`

This QA branch only writes this report and `docs/agent_reports/QA_WAVE7_REVIEW.md`.

## Merge State

- `feat/day1-day7-playtest-harness` merged as `155615e`.
- `feat/day5-combat-sim-tool` merged as `62cecd3`.
- `docs/day1-day7-playtest-rubric` merged as `aa16db6`.

## Boundary Review

- Playtest harness changed only `package.json`, `maws_src/tests/day1_day7_playtest.spec.js`, and worker/report docs.
- Combat sim changed only `maws_src/tools/sim_day5_park_check.mjs` and worker/report docs.
- Rubric branch changed only `docs/playtest/`, worker docs, and agent report docs.
- `INITIAL_SKILLS` remains the four-skill opening: `mystic`, `guard`, `retreat`, `talkdown`.
- No `jab` or `advance` grant was added.
- No combat formula, economy curve, data content, UI, assets, manifest, or save version changes were made by Wave 7 product branches.

## Validation

Final validation on the QA checkout after syncing with merged staging:

```powershell
npm run check:full
npm run test:playtest
node maws_src/tools/sim_day5_park_check.mjs
git diff --check
```

Results:

- `npm run build`: passed.
- Asset verification: passed, 95 manifest entries across 9 required groups.
- `npm run test:smoke`: passed, 4 Chromium tests.
- `npm run test:playtest`: passed, 2 Chromium tests.
- `node maws_src/tools/sim_day5_park_check.mjs`: passed for `worker`, `fan`, and `student`.
- `git diff --check`: passed.

Day 5 sim output:

```text
origin=worker | windowCount=1 | objective=4/4 | result=pass | reason=park_check_pass
origin=fan | windowCount=1 | objective=4/4 | result=pass | reason=park_check_pass
origin=student | windowCount=1 | objective=4/4 | result=pass | reason=park_check_pass
```

## Verdict

Wave 7 is ready to keep merged on staging.

## Remaining Risks

- Automated Playwright and Node simulations prove stability and target objective behavior, not full player feel.
- The manual rubric has been added but not yet filled by a human playtest run.
- Day 5 still needs a manual feel pass before opening `feat/early-combat-playtest-pass`.

## Recommended Next Step

Run one 20-30 minute clean-save manual Day 1-Day 7 playtest using `docs/playtest/day1_day7_playtest_rubric.md`, then open `feat/early-combat-playtest-pass` only for targeted small fixes.
