# Wave 11 QA Review

Role: `AGENT_F_TECH_QA_TOOLS`
Date: 2026-05-22
Worktree: `qa/wave11-review`
Reviewed HEAD: `65934b4` (`merge: skill tree vertical slice v1`)

## Scope

Reviewed merged branches:

- `feat/ui-readable-reward-pass`
- `feat/combat-plan-mode-v1`
- `feat/time-activity-pass-v1`
- `docs/skill-tree-vertical-slice-v1`
- `test/wave11-flow-smoke`

QA-only. No runtime source, assets, package files, handoff, or task-plan files were modified.

## Verdict

Wave 11 is QA pass.

The merged build keeps combat focused on the current 1-2 action window, does not restore formal `jab` / `advance` as starter gifts, makes reward feedback more visible, keeps small result modals compact, preserves scan-critical skill/action information outside hidden folds, and gives Time Dosage enough fatigue/risk/repeat pressure to avoid becoming a simple optimal grind loop.

## Checklist

| Gate | Result | Evidence |
|---|---|---|
| Combat main view highlights only 1-2 action cards / queue slots | PASS | `renderCombat()` caps highlighted cards to `Math.min(queueLimit, 2)` and queue limit remains `2`; Wave11 flow smoke verifies slot/card cap. |
| No formal `jab` / `advance` starter gift | PASS | New worker origin starts with `wild_swing`, `push_away`, `guard`, `retreat`, `talkdown`, `mystic`; `hasJab=false`, `hasAdvance=false`. |
| Reward feedback is more direct | PASS | Result/battle modals surface hero reward chips before detailed settlement folds. |
| Small popups are more compact | PASS | Result modals keep lead/chips/actions visible and move deep settlement into `details`; Wave11 smoke checks compact text/body shape. |
| Useful information is not hidden out of sight | PASS | Action and skill cards expose scan summaries/status outside expandable sections; smoke checks skills page visible info. |
| Time Dosage is not mindless grinding | PASS | 90m/120m options have lower marginal gain, higher SP/fatigue/cost, hard effort injury risk, and repeated training reduces positive gains to about 85% then 70%. |
| `check:full`, `test:playtest`, Day5 sim | PASS | All requested commands passed. |
| `wave11_flow.spec` | PASS | Chromium 4/4 passed. |

## Notes

- `combat-plan-mode-v1` is a foundation pass: plan modes exist in state/combat suggestion logic and only fill an empty queue outside manual mode. There is no player-facing plan-mode control in this slice, matching the worker's documented scope.
- Skill tree vertical slice is documentation-only and did not change runtime systems.
- `postReview` can still teach `jab` after battle review, but startup and default equipment do not gift formal `jab` or `advance`.

## Validation Results

```text
npm run check:full
PASS - build ok, assets verified, Chromium smoke 4 passed

npm run test:playtest
PASS - 2 passed

node maws_src/tools/sim_day5_park_check.mjs
PASS - worker/fan/student all result=pass reason=park_check_pass

git diff --check
PASS - no whitespace errors

npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line
PASS - 4 passed
```

## Risk Notes

- The new Time Activity pressure uses broad training-kind buckets. It is acceptable for this pass, but later balance work may want per-location/per-skill tuning.
- Combat plan mode is not yet directly selectable through the DOM UI. Treat it as a state/combat foundation until a future UI slice wires controls.

## Next Step

Proceed with the next implementation round. If that round exposes plan mode controls or implements the skill tree slice, add targeted smoke for those new user-facing controls.
