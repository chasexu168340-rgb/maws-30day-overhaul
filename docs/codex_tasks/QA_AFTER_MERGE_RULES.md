# QA_AFTER_MERGE_RULES

QA workers must run after Manager has merged and pushed all implementation branches.

## Required Flow

1. Implementation workers run in parallel.
2. Manager waits for all implementation workers to exit.
3. Manager pushes each clean implementation branch.
4. Manager merges implementation branches into `origin/staging/reforge-unlocks-v1` in the planned order.
5. Manager runs validation after each merge and pushes staging.
6. Only then does QA start from latest `origin/staging/reforge-unlocks-v1`.
7. QA writes report docs only.
8. Manager merges QA report and pushes staging.

## QA Worker Rules

- Do not review unmerged implementation branches as final state.
- Do not modify `maws_src/`, `assets/`, `package.json`, or runtime code.
- Start from latest integrated staging.
- Report whether the final staging result is ready, not whether an isolated worker branch looked ready.
- If a bug is found, write it as a finding and recommend a repair branch; do not patch business code in QA.

## Window Rules

- Implementation windows should be launched without `-NoExit` and without `-Hold`.
- QA window should also be launched without `-NoExit` and without `-Hold`.
- Completed worker windows close automatically.
- Manager remains the only long-lived orchestration process.
