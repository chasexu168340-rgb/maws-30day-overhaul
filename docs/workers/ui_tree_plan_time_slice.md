# UI Tree Plan Time Slice

## Scope

- Worker: `AGENT_E_UI_PRESENTATION`
- Runtime files: `maws_src/dom/ui.js`, `maws_src/dom/ui.css`
- No changes to data logic, state logic, combat formulas, assets, package scripts, or save keys/version.

## Result

- Skills tab now shows a compact skill tree slice fed by `model.skillTree`.
- The slice groups nodes under Street Wild, Boxing Basics, and Traditional Reforge.
- Node cards show status, cost, skill id, locked/future reasons, and a toast-only detail button.
- Combat HUD now exposes `manual`, `safe`, `pressure`, and `exit` plan mode controls and dispatches existing `setCombatPlan`.
- Duration-choice modal now defaults to time, stamina, reward multiplier, and one risk line; longer notes, cost, and previews are folded.
- NPC interaction menu now emphasizes real primary actions and softens feedback-only options.
- The first duration-based local action is visually promoted to the main action slot, preserving the previous first action in the folded list.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave13_first_look.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`

## Risk

- Skill tree remains presentation-only because spending/purchase behavior was outside this worker.
