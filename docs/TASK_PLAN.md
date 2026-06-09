# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Wave15 known issue triage on `docs/wave15-known-issues`.

## Scope

- Docs-only triage of 10 user-reported unresolved Wave15 issues into the next QA backlog.
- Only modify `docs/TASK_PLAN.md` and `docs/TASK_HANDOFF.md`.
- Do not modify code, package files, assets, `maws_src/`, save data, gameplay values, or build outputs.

## Current Result

- Current task is now Wave15 known issue triage.
- The 10 reported issues are recorded below as backlog for the next QA/code phase.
- Source issue 5 is split into an inspection UX gap and a Boxing Basics design/depth item so the next code PR can stay focused.

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

## Next Code PR Recommendation

The next code PR should fix only the core affordance gaps:

- Go to matching location.
- Store 10-stamina purchase cost disclosure.
- Risk explanation, negative impact, and removal/reduction guidance.
- Insight resource display synchronization.
- Distance-changing entry point when current distance is unavailable.
- Random event confirm feedback.

Do not mix skill-page tabs, 100% completion rewards/interactions, or Boxing Basics deepening into the same PR.

## Verified State

- Docs-only update.
- `npm run build`: skipped because no runtime code, data, assets, or package files were changed.

## Risks

- Some backlog items may need code investigation before exact file ownership is known.
- Design items should remain separate from the next core-affordance PR to avoid scope creep.
- Completion and Boxing Basics depth work may require design decisions before implementation.

## Next Step

Open the next code PR for the P0/P1 core affordance gaps only, then run build plus focused browser/manual QA.

If continuing in a new window, read `docs/TASK_HANDOFF.md`, `docs/FILE_MAP.md`, and this `docs/TASK_PLAN.md`.
