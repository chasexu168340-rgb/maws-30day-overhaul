# NPC Click Interaction Menu

## Scope

- Branch: `feat/npc-click-interaction-menu`
- Worker: `AGENT_B_GAMEPLAY_SYSTEMS + AGENT_E_UI_PRESENTATION`
- Goal: clicking a scene character opens a compact interaction menu instead of immediately resolving to a toast/action.

## Changed

- `maws_src/simulation/state.js`
  - Added `ui.interactionMenu` as transient UI state.
  - Added scene interaction menu model generation from current scene cast and current location actions.
  - Reuses existing `doAction` and `toast` dispatch paths; no new event engine, combat formula, economy curve, save version, data, or asset changes.
- `maws_src/dom/ui.js`
  - Scene characters now dispatch `openInteractionMenu`.
  - Added compact menu rendering with name, role, feedback copy, and up to three action buttons.
- `maws_src/dom/ui.css`
  - Added scene-local compact menu styling.
  - Restored NPC visibility on narrow phones so scene characters remain tappable.

## Behavior

- Liu Fatty shows `刘胖子`, feedback text `他冲你比了个别瞎练的手势。`, and three compact actions: `聊几句`, `一起复盘`, `问问今天建议`.
- NPCs with current location dialogue/battle actions use existing `doAction`.
- Characters without executable actions still provide feedback through menu copy and toast-backed compact buttons.
- The menu is positioned inside the scene, above the bottom nav and away from the right-side main action rail on desktop.

## Validation

- Pass: `npm run check:full`
- Pass: `npm run test:playtest`
- Pass: `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`
- Pass: `git diff --check`
- Pass: targeted Chromium smoke at `1536x864` and `390x844` clicking Liu Fatty:
  - menu visible
  - name present
  - fallback feedback present
  - 3 menu actions
  - no runtime errors
  - no horizontal overflow

## Risks

- Menu action labels are derived from existing current-location actions and small toast-backed NPC advice entries, so some menu buttons are feedback-only when no executable action exists.
- No data entries were added; future content can replace toast-backed options with real actions by adding normal `ACTIONS` entries.
