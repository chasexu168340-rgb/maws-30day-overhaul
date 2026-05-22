> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

`WAVE14_UI_TREE_PLAN_TIME_SLICE`: expose the Wave 14 skill tree, combat plan mode, time-investment modal, and NPC interaction affordances in the DOM UI.

## Scope

- Allowed: `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, `docs/workers/ui_tree_plan_time_slice.md`, `docs/agent_reports/AGENT_E_UI_TREE_PLAN_TIME_SLICE.md`.
- Forbidden: data logic, state logic, combat formulas, assets, package scripts, save keys/version.

## Current Result

- Added a compact Skill Tree Slice area on the Skills tab for Street Wild, Boxing Basics, and Traditional Reforge.
- Added combat plan mode controls for `manual`, `safe`, `pressure`, and `exit` using existing `setCombatPlan`.
- Reduced duration-choice cards to time, stamina, reward multiplier, and one risk line, with long details folded.
- Tuned NPC interaction menu affordance so real actions read as primary and feedback-only options read as suggestions.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risks

- Skill tree nodes are presentation-only; no purchase behavior is added in this worker.
- First duration action is visually promoted into the main action slot so the time-investment modal is reachable without opening the folded action list.

## Next Step

Commit `feat: add ui tree plan time slice`.
