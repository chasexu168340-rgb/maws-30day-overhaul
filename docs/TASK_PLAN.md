# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Replace the text-heavy first-look interface with a quiet pixel ledger that keeps the scene visible and exposes one immediate decision at a time.

## Scope

- Changed DOM presentation, responsive CSS, and browser paths only.
- Preserved action dispatch, rewards, combat formulas, economy, story data, and save contracts.
- Kept full local actions, opportunities, locations, logs, and skill details reachable through explicit disclosure.

## Current Result

- Quiet Ledger V3 shows one scene, one compact daily seal, and one complete immediate action; secondary tasks stay in the closed `册` drawer.
- When a main event owns the immediate action, all local actions remain reachable inside the drawer instead of being dropped from both surfaces.
- HUD resources are now icon-first readings; desktop navigation is a 60px icon rail and mobile navigation is a bottom icon ledger with hidden text labels.
- Desktop/mobile action controls use a stable seal/title/arrow hierarchy and keep the scene characters unobstructed.
- Action rows expose at most two short facts; descriptions, costs, gains, opportunities, and location prose are opt-in.
- Skill routes and both log groups are closed by default. Only three next-learnable skills appear before the future catalogue.
- Equipped skills now use large pixel thumbnails with small labels and 44px remove targets instead of six text-heavy pills.
- Event notebook choices remain a three-choice real fixture with time/resource consequences and structured result rewards.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (156 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (72 tests).
- Quiet Ledger desktop/tablet/mobile, skill ledger, bag, shop, dialogue, event, and combat screenshots passed visual/runtime contracts.
- `git diff --check`: passed.

## Risks

- Historical CSS overrides still exist before the isolated V3 layer; deleting superseded rules remains a later cleanup task, not part of this visual pass.
- The generated E02 push-hands standee and motion strip are still local/unwired work; they are not claimed as runtime-final in this checkpoint.
- `outputs/` remains local screenshot evidence and must not be committed.

## Next Step

1. Run an in-browser human pass on the V3 `册` drawer and secondary pages, then tighten only labels that still wrap badly.
2. Wire and validate the existing E02 push-hands assets as a separate combat-presentation commit.
3. Continue replacing high-frequency enemy fallbacks without changing combat formulas.
