# Wave 12 Visual QA Worker Report

## Scope

- Reviewed merged local HEAD `9104aeb` on `qa/wave12-visual-review`.
- Target branches present in local history: `feat/structured-reward-deltas`, `feat/visual-stage-hud-strike`, `test/wave12-visual-smoke`, `docs/wave12-art-direction-shotlist`.
- `git fetch --all --prune` failed with `Recv failure: Connection was reset`; review continued against existing local `origin/*` refs.

## Findings

1. **P1 - Result reward chips still duplicate and can show long text.**
   - `maws_src/dom/ui.js:154` collects `modal.rewardDeltas`, `modal.summary`, `modal.settlementLines`, and `modal.lines` into the same chip list.
   - Runtime check after the first home action showed duplicate chips such as two `学会 刺拳` entries plus a long `学会 刺拳 / 来源 拳馆 · 沙包连击` chip.
   - This weakens the Wave 12 goal that event/action rewards display compact structured numbers instead of repeated long settlement text.

2. **P2 - Combat visual test does not guard the "not only two cards" requirement.**
   - `maws_src/tests/wave12_visual.spec.js:216` only checks combat card grid height, and `:217` only checks queue slot count.
   - Runtime DOM check showed `windowCardCount: 2`; four more combat cards existed in the tactics drawer but were not visible in the viewport.
   - This means the requested visual condition "cards are smaller but not only two" is not enforced by the new spec and is visually borderline in the generated screenshot.

3. **P3 - Tool/pipeline files changed outside the four worker branch scopes.**
   - `scripts/Invoke-MawsMultiCliPipeline.ps1`, `scripts/run_wave12_visual_strike_workers.ps1`, and `scripts/wave12_visual_strike_pipeline.json` are changed in the integrated Wave 12 range.
   - These appear to be manager/pipeline commits rather than the four reviewed worker commits, but they are outside the allowed modification lists for the user-named branches.

## Checklist

- Out-of-scope runtime files: mostly contained, but pipeline scripts changed outside worker branch scopes.
- `INITIAL_SKILLS`: not changed in the reviewed Wave 12 runtime diff.
- Combat formulas: `maws_src/simulation/combat.js` not changed.
- Combat cards: smaller, but current visible combat window still shows only two cards.
- Combat stage: visibly larger; fighters occupy a large central stage.
- Map characters: larger and grounded; desktop DOM measured player character at about `260x551`.
- Red/yellow/gray backplates: reduced in map/combat stage area, but yellow/red UI language still dominates key panels.
- Structured reward numbers: present, but duplicated with long skill-unlock text in result modals.
- NPC click feedback: click burst path exists for scene characters; persistent `.maws-click-hit` can be lost immediately on toast rerender for inspectable characters.
- Local action遮挡: desktop/mobile CTA checks passed and screenshots show nav not covering the primary action.

## Validation

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`: passed.
- `git diff --check`: passed.

## Artifacts

- `test-results/wave12/desktop-map-modal.png`
- `test-results/wave12/desktop-combat.png`
- `test-results/wave12/mobile-main-cta.png`
