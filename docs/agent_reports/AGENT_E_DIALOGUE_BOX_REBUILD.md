# AGENT_E_DIALOGUE_BOX_REBUILD

## Task

Wave 9 dialogue box presentation rebuild.

## Scope

- Modified:
  - `maws_src/dom/ui.js`
  - `maws_src/dom/ui.css`
  - `docs/workers/dialogue_box_rebuild.md`
  - `docs/agent_reports/AGENT_E_DIALOGUE_BOX_REBUILD.md`
- Not modified:
  - `maws_src/content/data.js`
  - `maws_src/simulation/state.js`
  - `maws_src/simulation/events.js`
  - `maws_src/simulation/combat.js`
  - `maws_src/assets/manifest.js`
  - `assets/`
  - `package.json`
  - `INITIAL_SKILLS`

## Changes

- Rebuilt dialogue modal markup around a scene stage: speaker portrait/nameplate plus one current line.
- Moved dialogue history, settlement lines, gains, and long text into progressive disclosure.
- Reworked story choice and event modals so the first read is title, one scene summary, and choice cards.
- Reworked common result and battle result modals so summary and primary buttons come before folded settlement details.
- Added responsive CSS for desktop and mobile dialogue layouts without changing modal state or gameplay data.

## Validation

- `npm run check:full`: passed. Build, asset verification, and 4 Chromium smoke tests passed.
- `git diff --check`: passed.

## Notes

- This is presentation-only. It does not change story content, rewards, combat, save data, or asset paths.
