# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Wave15 known issue triage.

## Current Baseline

- Current branch: `docs/wave15-known-issues`.
- User reported 10 unresolved Wave15 issues for backlog triage.
- This task is docs-only and must not modify code, package files, assets, `maws_src/`, save data, gameplay values, or build outputs.

## Goal

Record the 10 reported Wave15 issues as a severity-classified QA backlog and define a narrow next code PR scope.

## Wave15 Known Issue Backlog

### P0/P1: Core Affordance And Data Consistency

- W15-KI-01: "Go to matching location" is not implemented.
- W15-KI-02: Store purchases do not disclose that buying one item costs 10 stamina.
- W15-KI-03: Risk is not explained in-game, including what it is, its negative effects, and how to remove or reduce it.
- W15-KI-04: Action results show Insight gained, but the resource annotation does not show received Insight while the skill-tree slice does show current Insight; resource display should sync.
- W15-KI-09: The game says the current distance is unavailable, but gives no interaction for changing distance.
- W15-KI-10: Random event confirmation has no visible result or state feedback after confirm.

### P2: Explanation And Inspection UX

- W15-KI-05A: After clicking view/inspect, only a small brief popup appears and no detailed information is available.

### Design: Growth Systems And Page Structure

- W15-KI-05B: After the Day 9 gym opens, Boxing Basics does not show the expected boxing gym jab training option; treat this as Boxing Basics depth/design work.
- W15-KI-06: The skills page is too crowded; consider tabs by school/style.
- W15-KI-07: Several boards/modules have no state change or interaction after reaching 100% completion.
- W15-KI-08: Individual skills have no state change or interaction after reaching 100% proficiency.

## Next Recommended Work

1. Open the next code PR for only the P0/P1 core affordance gaps:
   - Go to matching location.
   - Store 10-stamina purchase cost disclosure.
   - Risk explanation, negative impact, and removal/reduction guidance.
   - Insight resource display synchronization.
   - Distance-changing entry point when current distance is unavailable.
   - Random event confirm feedback.
2. Keep skill-page tabs, 100% completion rewards/interactions, and Boxing Basics deepening out of that PR.
3. Triage P2 and Design items after the core affordance PR lands and is verified.

## Validation

- This triage update is docs-only and does not require `npm run build`.
- For the next code PR, run `npm run build`, focused browser/manual QA, and any relevant smoke checks.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`

## Do Not Do

- Do not implement code during this docs-only triage task.
- Do not change gameplay values, save key/version, package files, assets, or `maws_src/`.
- Do not mix skill-page tabs, 100% completion rewards/interactions, or Boxing Basics deepening into the next core-affordance PR.
- Do not treat historical stubs as the current task source.
