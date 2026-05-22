# Visual Stage Hard Pass

## Owner

AGENT_E_UI_PRESENTATION

## Scope

- Changed only `maws_src/dom/ui.js` and `maws_src/dom/ui.css`.
- Did not modify content, simulation, combat, assets, or package scripts.

## Result

- Rental-room main screen now uses the scene as the dominant first read.
- Scene info is compact and explicitly shows current mainline, current place, and recommended action.
- Characters are larger, grounded at the floor line, with contact shadows and subtle outline/drop-shadow treatment.
- HUD, nav, today rail, and action rail were reduced to translucent overlays so red/yellow/black hierarchy remains but does not dominate the background.
- Mobile bottom nav was constrained to a 56px strip and no longer blocks tab taps or the main CTA after scroll.

## Manual Visual Check

- 1536x864 rental room: scene fills the viewport, characters sit on the room floor with stronger contact shadows, and side panels no longer make the first view feel like a debug dashboard.
- 390x844 main screen: rental-room background and player character are visible in the first viewport; HUD is smaller; mainline/place/recommendation are readable. The Phaser yellow day prompt is still visible and belongs to the scene layer outside this worker's allowed files.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`: passed.
- `git diff --check`: passed.

## Screenshots

- `test-results/wave13-visual-stage-hard-pass/desktop-1536x864-rental.png`
- `test-results/wave13-visual-stage-hard-pass/mobile-390x844-main.png`

## Risk

- Combat command bar interaction structure was not changed.
- The remaining large yellow Phaser day prompt is not DOM UI and was left unchanged per allowed-file constraints.
