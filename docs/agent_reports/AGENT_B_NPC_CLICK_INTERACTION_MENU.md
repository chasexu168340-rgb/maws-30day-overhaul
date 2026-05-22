# AGENT_B_NPC_CLICK_INTERACTION_MENU

## Result

Implemented NPC click interaction menu for scene characters.

## Files Changed

- `maws_src/simulation/state.js`
- `maws_src/dom/ui.js`
- `maws_src/dom/ui.css`
- `docs/workers/npc_click_interaction_menu.md`
- `docs/agent_reports/AGENT_B_NPC_CLICK_INTERACTION_MENU.md`

## Gameplay/System Notes

- Added transient `ui.interactionMenu` state.
- Built menu contents from current scene cast plus current location actions.
- Reused existing `doAction` for executable actions and `toast` for lightweight feedback.
- Did not touch `data.js`, `combat.js`, `economy.js`, `events.js`, assets, manifest, package scripts, save key, or save version.

## UI Notes

- Menu is compact and scene-local: name, role, feedback line, 1-3 actions, and a close control.
- Buttons keep 44px minimum touch height.
- Narrow phone CSS keeps NPCs visible and tappable instead of hiding all non-player characters.
- Menu is constrained to viewport width to avoid horizontal overflow.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`
- Pass: targeted Chromium smoke for Liu Fatty menu at desktop and mobile widths.

## Remaining Risk

- Some NPC menu options are intentionally feedback-only until content data defines a real action for that NPC at that location.
