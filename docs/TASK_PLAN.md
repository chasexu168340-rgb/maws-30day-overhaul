# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Publish the quiet-ledger UI rebuild together with the reviewed E20 karate route presentation as one validated visual release.

## Scope

- Preserved game rules, enemy stats, economy, story, and save contracts.
- Changed DOM UI structure/styles, E20 visual routing, focused browser contracts, and checkpoints.
- Kept all actions and destinations reachable while removing secondary prose from the default scene.

## Current Result

- The first-look scene now keeps only date/time, four core resources, location, today's intent, up to two desktop decisions, and one mobile decision visible.
- Desktop navigation is a compact right-side icon ledger; mobile navigation remains a 44px bottom bar.
- The bottom decision dock has one clear primary path plus an opt-in task ledger instead of multiple competing panels.
- The task ledger shows four local actions first; remaining actions, city opportunities, location index, and location prose stay progressively disclosed.
- Navigation icons are larger than their labels, active tabs and primary actions retain Pixel V2 bitmap skins, and no new vector/web-card language was introduced.
- Mobile character staging was repaired so Lu, Liu Pangzi, and father memory remain visible above the decision dock; NPC menus no longer sit behind the dock.
- Short toast feedback no longer covers an open task ledger.
- Mobile non-scene ledgers use border-box sizing and remain within the viewport.
- E20 now uses a final 32-frame, 96x144 Pixel V2 karate strip and matching standee rather than the generic boxer fallback.
- E20 motion semantics distinguish straight-line entry, reverse punch, front kick, guard, disciplined recovery, dodge/back-step, and hurt recovery.
- Karate reverse-punch/front-kick contact reads at 300/310ms and schedules an explicit recovery pose after hit or miss without changing combat formulas.
- `karate_dojo` now uses final 480x270, 32-color day/night stages with the same floor geometry and clean urban-community-dojo identity.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed (150 manifest entries).
- `npm run check:full`: passed (build + 6 Chromium smoke tests).
- `npm run test:playtest`: passed (4 tests).
- `npm run test:day1-9`: passed (4 tests).
- Full `pixel_v2_visual.spec.js`: passed (58 tests).
- Reviewed screenshots at 390x844, 900x700, 1365x768, and 1536x864, including the closed scene, NPC menu, and task ledger.
- `git diff --check`: passed.

## Risks

- `ui.css` still contains historical override layers. This pass uses a final, narrowly scoped quiet-shell layer; deleting old layers safely should be a separate refactor with screenshot parity gates.
- Detailed skill, inventory, and profile ledgers remain intentionally dense after the player opens them, but no longer compete with the default scene.
- The karate front kick uses a compact four-frame authored row; a future animation pass can add stronger anticipation and landing frames without changing the action contract.
- Dedicated gi movement, foot slide, glove contact, and kiai audio remain missing.

## Next Step

1. Continue with E21's long-range taekwondo movement, chambered kicks, and matching day/night club stage.
2. Follow with E09's dirty mixed-fight presentation and then audit remaining post-Day9 fallbacks.
3. Keep CSS debt cleanup separate and screenshot-gated so visual parity is not lost during deletion.
