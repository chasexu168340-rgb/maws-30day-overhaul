# AGENT_E_UI_PRESENTATION

## Task

Wave 4 UI skill unlock display.

## Scope

- Branch: `feat/ui-skill-unlocks-display`
- Modified:
  - `maws_src/dom/ui.js`
  - `maws_src/dom/ui.css`
  - `docs/TASK_PLAN.md`
  - `docs/agent_reports/AGENT_E_UI_PRESENTATION.md`
- Not modified:
  - `maws_src/content/data.js`
  - `maws_src/simulation/state.js`
  - `maws_src/simulation/combat.js`
  - `maws_src/simulation/economy.js`
  - `maws_src/assets/manifest.js`
  - `assets/`

## Changes

- Removed the UI-only static skill source hint map.
- `renderSkills` now passes `model.skillUnlocks?.[skill.id]` into each non-combat skill card.
- Skill cards now render source, open condition, and state from the render model.
- planned skills explicitly say they do not have a real training source yet.
- initial skills show as already known from the start.
- Added wrapping styles for the unlock info block so long Chinese source text does not force horizontal overflow.

## Validation

- `npm run check:full`: passed. Build, asset verification, and 4 Chromium smoke tests passed, including skills-tab horizontal overflow checks at 390x844 / 900x700 / 1365x768.
- `git diff --check`: passed. Git reported only CRLF working-copy warnings.

## Notes

- This report only covers UI presentation. It does not add or correct any unlock data.
