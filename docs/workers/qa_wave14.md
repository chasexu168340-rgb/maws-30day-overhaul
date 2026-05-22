# Wave 14 QA Review

## Worker

`AGENT_F_TECH_QA_TOOLS`

## Scope

- Reviewed integrated branch baseline: `qa/wave14-review` at `579394a`.
- Reviewed branches in current commit chain:
  - `chore/wave14-current-context`
  - `feat/npc-real-actions-day1-7`
  - `feat/skill-tree-system-slice-v1`
  - `feat/ui-tree-plan-time-slice`
  - `test/wave14-loop-smoke`
- Modified only QA docs:
  - `docs/workers/qa_wave14.md`
  - `docs/agent_reports/QA_WAVE14_REVIEW.md`

## Findings

- No blocking QA findings.
- `docs/TASK_HANDOFF.md` is updated to Wave 14: Playable Loop Slice.
- NPC menu has real executable actions for early NPCs, including Liu Pangzi, father memory, Xiaoman, and Liang Coach. The Wave 14 smoke verifies Liu Pangzi real action buttons and execution.
- Skill tree is a small runtime/render-model slice. It exposes three route groups and node statuses, but does not add purchase behavior or combat effects.
- New-game starter skills do not include `jab` or `advance`. `INITIAL_SKILLS` and `STARTER_EQUIP_SKILLS` contain only the existing starter kit; `jab` is sourced from boxing/review progression and `advance` remains planned.
- Combat plan mode controls are visible for `manual`, `safe`, `pressure`, and `exit`, and update `state.combat.planMode`.
- Time-investment modal is covered at 390x844 and stays inside the mobile viewport with four duration choices.

## Evidence

- `maws_src/content/data.js`: NPC real action entries, `INITIAL_SKILLS`, `SKILL_TREE_NODES`.
- `maws_src/simulation/state.js`: daily NPC action gates, `skillTreeModel`, combat plan reducer, render model.
- `maws_src/dom/ui.js`: skill tree slice, plan buttons, compact duration modal.
- `maws_src/dom/ui.css`: responsive skill tree and duration modal layout.
- `maws_src/tests/wave14_loop.spec.js`: Wave 14 smoke coverage for NPC real actions, reward chips, skill tree, combat plan mode, and mobile duration modal overflow.

## Validation

- Pass: `npm run check:full`
  - Build passed.
  - Asset verification passed: 95 manifest entries across 9 required groups.
  - `maws_src/tests/phaser-smoke.spec.js`: 4 passed.
- Pass: `npm run test:playtest`
  - `maws_src/tests/day1_day7_playtest.spec.js`: 2 passed.
- Pass: `npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line`
  - 5 passed.
- Pass: `git diff --check`

## Risks

- Skill tree is intentionally read-only/presentation-first in this wave; spending behavior and combat effects are not implemented.
- The Wave 14 plan mode smoke invokes DOM button click handlers for plan mode changes because pointer events in the combat view can be intercepted by the existing page layer.

## Next Step

- Manager can merge/push this QA docs branch if the read-only skill tree limitation is acceptable for Wave 14.
