# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

Day 1-9 retro-pixel vertical slice: finish the reviewed Pixel V2 combat-feedback batch, then replace the remaining generic non-scene UI surfaces and close the desktop/mobile visual gate.

## Scope

- Art generation happens in the current Codex session; CLI workers do not generate images.
- Use `assets/pixel_v2/` and preserve existing manifest keys.
- Keep legacy/fallback assets available for rollback and never relabel them as final.
- Reference Bruisers only for preparation, distance, and consequence principles; copy no assets or implementation.
- Preserve starter skills, economy, save key/version, and global combat formulas.
- Keep screenshots and generation review artifacts under `outputs/` untracked.

## Current Result

- Runtime pixel rendering and manifest metadata contracts are already active.
- Tactical recipes, recipe FX metadata, Day 8 measurement, and Day 9 diary-to-training handoff are implemented and pushed.
- Added `docs/design/PIXEL_V2_STYLE_BIBLE.md` with the canonical palette, character anchors, environment direction, sizes, Day 1-9 asset list, generation order, and rejection gate.
- Combat fighters now use a bottom-center anchor, share a viewport-safe ground line, and render hard-edged contact shadows; the mobile floating-character regression is removed.
- `ShellScene` now consumes `impactTier`, `vfxKey`, `hitstopMs`, `shake`, and `paletteFlash` for hit, guard, break, and recipe feedback without changing combat formulas.
- The combat HUD now uses square pixel borders, hard shadows, restrained semantic colors, a smaller mobile command dock, and compact command cards.
- Phaser 4 tint handling uses the current `setTint + TintModes.FILL` API, so the new feedback produces no deprecation warning.
- `bg.park.day` is the first reviewed runtime replacement under `assets/pixel_v2/`: exact 480x270, 32-color indexed PNG, 45KB, clear two-fighter staging lanes, and no baked characters.
- `bg.home.day` now uses a reviewed 480x270, 32-color indexed `pixel_v2` rental-room background at 41KB, with an open three-character floor lane, father-memory shelf, training notes, and no baked people.
- `bg.metro_station.day`, `bg.store.day`, and `bg.worksite.day` now use reviewed 480x270/32-color `pixel_v2` backgrounds at roughly 41KB, 40KB, and 49KB.
- Day 2-4 environment anchors are explicit in the live art: metro screen doors and exit direction, convenience-store CCTV/counter/shelf edge, and worksite scaffold/materials with a clear labor lane.
- `bg.home.night`, `bg.metro_station.night`, `bg.store.night/rain`, `bg.worksite.night/dusk`, `bg.park.night`, and `bg.boxing.day/night` now use reviewed geometry-matched `pixel_v2` variants.
- `bg.street.day/night` now provides the Day 6 old-neighborhood route with a readable safe-road exit; daytime and night preserve identical shutters, alley, CCTV, and foot plane.
- All 16 Day 1-9 location background variants now decode in the browser from `assets/pixel_v2/`; only the separate city-map day/night art remains legacy.
- `bg.city.map.day/night` now use reviewed 480x270/32-color `pixel_v2` route maps at roughly 71KB, with four readable districts, a central metro line, quiet DOM-marker pads, and matching daytime/night geometry.
- The city-map sheet now preserves the authored 16:9 marker plane, removes the old red/yellow banner and glass treatment, hides locked-node clutter on mobile, keeps reachable markers at 44px, and retains toast/nav compatibility.
- The boot screen now uses the final night city map as a full-screen pixel stage, presents the product name without a tilted card, and keeps three compact origin choices with 44px actions; mobile uses a horizontal snap strip instead of stacking a wall of cards.
- Dialogue, result, duration, event, and diary modal shells now share square hard borders, solid charcoal panels, no blurred glass/soft gradients, and 44px actions.
- Dialogue presentation gives the current 96x96 portrait a 128px desktop stage (76px mobile), keeps the current line at 22px/18px, and folds history/settlement below the active exchange.
- The strict `--require-final-day1-9` asset verifier now passes: every listed Day 1-9 background, scene identity, portrait, and combat strip resolves to reviewed `assets/pixel_v2/` art.
- Karate Master 2 is now documented as a principle-only reference for work/training/fight cadence, attack-height reads, guard/back-step distinction, counter windows, distance recovery, injury, and rules; no packaged game content is reused.
- Final `pixel_v2` backgrounds now fail asset verification unless they are exact 480x270 indexed PNGs with at most 32 palette entries and stay within the 180KB budget.
- The map scene shell now uses hard pixel borders and solid panels without blurred glass, removes the red player spotlight/backplate, and replaces soft radial character glows with compact hard contact shadows.
- The scene info block now shows one current hook instead of repeating location/recommendation rows; immediate recommendations are capped at two while secondary actions remain folded.
- Desktop left/right rails are compact lower-corner overlays instead of full-height information walls; mobile keeps the scene first and moves the objective/action rails into document flow.
- Mobile navigation and primary local actions now retain 44px touch targets; the final visual gate asserts scene dominance, hard contact shadows, no glass blur, and no more than two immediate recommendations.
- `anim.fighter.player` is now a reviewed `pixel_v2` 16-frame strip: exact 1536x144, 96x144 frames, transparent, 92KB, shared scale, centered silhouettes, and a fixed two-pixel foot baseline.
- The player strip supplies real idle `0-3`, wild-swing attack `4-7`, hurt `8-11`, and guard/utility `12-15` animations; Phaser uses a manifest display scale without stretching individual frame content.
- Asset preparation now supports 4x4 generated action masters, small grid remainder trimming, 32-bit ARGB chroma cleanup, global silhouette normalization, and row-major repacking.
- `pixel_v2_visual.spec.js` reads the live Phaser frame index and proves a real `wild_swing` enters attack frames; it also saves `outputs/pixel_v2_visual/player-attack-desktop.png` at the observed attack frame.
- Day 8 now uses independent `fighter.enemy.silent` and `anim.fighter.enemy.silent` keys instead of falling back to E01's legacy boxer.
- E10's reviewed assets are exact 96x144 standee / 1536x144 strip, transparent, 8KB / 123KB, with live idle, compact straight, hurt, and guard playback.
- Pixel V2 tests also wait for E10 attack frames and save `outputs/pixel_v2_visual/silent-boxer-attack-desktop.png` at the observed punch frame.
- Day 5 E01 now uses independent final `fighter.enemy.beginner` and `anim.fighter.enemy.beginner` assets instead of the shared legacy boxer.
- E01's reviewed gray-shirt/red-glove set is exact 96x144 / 1536x144, with idle, jab/straight, hurt, and guard rows; the strip stays under the 500KB fighter budget.
- Pixel V2 tests prove E01 attack-frame playback and cover Day 5 desktop/mobile combat geometry and screenshots.
- E00 now uses independent final `fighter.enemy.untrained` and `anim.fighter.enemy.untrained` assets: rust jacket, bare hands, poor guard, unstable shove/swing, hurt, and retreat rows.
- E00's reviewed standee/strip are exact 96x144 / 1536x144 and 7KB / 112KB; its silhouette and stance visibly separate an untrained target from E01.
- Pixel V2 tests prove E00 attack-frame playback and cover the optional Day 3 fun target on desktop/mobile.
- `fighter.player` now uses a reviewed 96x144 `pixel_v2` scene standee that matches the combat sprite's black outfit and olive hand wraps; the legacy green-fringed 512x768 standee is no longer live.
- `portrait.player` now uses a reviewed 96x96 transparent portrait with the same face, hair, shirt, and wraps; the old hoodie portrait is no longer live.
- The deterministic asset tool now supports chroma-key cleanup for portraits as well as standees and combat strips.
- `scene.npc.fatty` now uses a reviewed 96x144 standee with the canonical brick-red overshirt, phone, round silhouette, and grounded sandals.
- `portrait.fatty` now uses a reviewed 96x96 portrait with the same face, phone, pendant, and asymmetrical grin; the previous placeholder portrait is no longer live.
- Day 1 desktop/mobile screenshots confirm Lu and Liu Pangzi now share one pixel density and silhouette language.
- Scene-character fallback styling now reads manifest status: final `scene.npc.*` art keeps full scale/opacity, while unfinished legacy/fallback NPCs retain placeholder treatment.
- `scene.npc.xiaoman` now uses a reviewed 96x144 standee with the canonical high bun, red-piped store uniform, hand-on-hip pose, scanner, and grounded shoes.
- `portrait.xiaoman` now uses a matching reviewed 96x96 portrait; the previous placeholder face is no longer live.
- Day 3 store desktop/mobile screenshots confirm Xiaoman is visible at final scale without horizontal overflow.
- `scene.npc.worker` now uses a reviewed 96x144 construction-worker standee with final-scale hard hat, safety vest, gloves, pouch, and grounded boots.
- Added final `portrait.worker` and corrected Day 4's first dialogue line to identify the worker explicitly, so the new portrait is consumed instead of inheriting Liu Pangzi's identity.
- Dialogue asset lookup now prefers dedicated portraits before falling back to scene standees, making the player/Liu/Xiaoman/worker portrait replacements visible in the actual dialogue UI.
- Day 4 worksite and dialogue screenshots cover desktop/mobile standee scale, portrait use, and horizontal overflow.
- `scene.npc.coach` now uses a reviewed 96x144 Liang standee with precise coaching stance, raised/low focus mitts, tracksuit stripe, whistle, and grounded shoes.
- `portrait.coach` now uses a matching reviewed 96x96 portrait; the prior placeholder face is no longer live.
- Day 9 boxing desktop/mobile screenshots verify the coach at final scale with intact mitt silhouettes and no overflow.
- `scene.npc.father_memory` now uses a reviewed 96x144 standee with gray temples, an indigo work jacket, a restrained notebook pose, and the same two-pixel ground baseline as the live cast.
- `portrait.father` now uses a matching reviewed 96x96 portrait; Day 1 dialogue resolves Lu and his father independently instead of inheriting the scene NPC identity.
- Narrator lines no longer inherit the active scene NPC portrait, and Day 1 desktop/mobile screenshots cover the three-character stage plus the father dialogue page.
- The desktop three-character cast layout reserves the right action rail and keeps all three silhouettes visible without horizontal overflow.
- Guard FX now targets the actual guarding actor, normal guard/hit feedback no longer hides the whole sprite behind a white silhouette, and combat cues use concise Chinese labels.
- All seven combat impact classes now resolve to final 64x64 RGBA `pixel_v2` textures: normal hit, heavy hit, guard, miss, posture break, recipe completion, and utility/footwork.
- Tactical recipe aliases resolve to the reviewed recipe-completion texture, and NPC scene clicks use a dedicated Pixel V2 contact marker instead of generic CSS-only particles.
- The asset verifier now enforces final VFX dimensions, RGBA transparency, transparent corners, and a 64KB per-texture budget; strict Day 1-9 verification includes the complete feedback set.
- Combat target controls now read as high/mid/low, distance labels explain their tactical role, and enemy tells distinguish standing guard, back-step defense, and the next counter window without changing formulas.
- No legacy/fallback asset has been relabeled as final; every other unfinished key remains explicitly legacy/fallback.

## Validation

- Passed after the combat presentation batch:
  - `npm run check:full` (build, asset verification, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - `git diff --check`
- Re-ran `node maws_src/tools/verify_assets.mjs` and `npm run test:day1-9` after switching `bg.park.day`; both passed.
- Passed after the player animation integration:
  - `npm run check:full` (build, verifier, 6 Chromium smoke tests)
  - Pixel V2 candidate visual gate (6 passed, including live frame playback)
- Passed after the independent E10 integration:
  - `npm run check:full` (97 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (7 passed, including player and E10 live attack frames)
- Passed after the independent E01 integration:
  - `npm run check:full` (99 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (10 passed, including E01 live attack frames and Day 5 desktop/mobile screenshots)
  - `git diff --check`
- Passed after the independent E00 integration:
  - `npm run check:full` (101 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (13 passed, including E00 live attack frames and Day 3 E00 desktop/mobile screenshots)
  - `git diff --check`
- Passed after the Lu scene identity replacement:
  - `npm run check:full` (101 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (13 passed, including Day 1 desktop/mobile standee and portrait decode)
  - `git diff --check`
- Passed after the Liu Pangzi scene identity replacement:
  - `npm run check:full` (101 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (13 passed, including Day 1 desktop/mobile Lu/Liu standees and both portrait decodes)
  - `git diff --check`
- Passed after the manifest-driven scene fallback fix:
  - `npm run check:full` (6 Chromium smoke tests)
  - Pixel V2 candidate visual gate (13 passed; final Liu standee is asserted not to use `placeholder-npc`)
  - `git diff --check`
- Passed after the Xiaoman scene identity replacement:
  - `npm run check:full` (6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (15 passed, including Day 3 store desktop/mobile screenshots and final-scale assertion)
  - `git diff --check`
- Passed after the worksite worker identity replacement:
  - `npm run check:full` (102 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (17 passed, including Day 4 scene/dialogue desktop/mobile screenshots and `portrait.worker` visibility)
  - `git diff --check`
- Passed after the Coach Liang identity replacement:
  - `npm run check:full` (102 manifest entries, 6 Chromium smoke tests)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (19 passed, including Day 9 boxing desktop/mobile screenshots and final-scale assertion)
  - `git diff --check`
- Passed after the father-memory identity replacement:
  - `npm run check:full` (104 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 candidate visual gate (19 passed, including Day 1 father standee/portrait, dialogue identity, desktop/mobile geometry, and screenshots)
  - `git diff --check`
- Passed after the Day 1 home-background replacement:
  - `npm run check:full` (104 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 strict visual gate (19 passed, including Day 1 desktop/mobile runtime screenshots)
  - `git diff --check`
- Passed after the Pixel V2 scene-shell replacement:
  - `npm run check:full` (6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Director + Wave 12 + Pixel V2 combined gate (26 passed)
  - Pixel V2 strict visual gate (19 passed with scene-shell assertions)
  - `git diff --check`
- Passed after the Day 2-Day 4 environment replacement:
  - `npm run check:full` (104 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 strict visual gate (21 passed, including Day 2 metro and Day 3/4 desktop/mobile runtime screenshots)
  - `git diff --check`
- Passed after the remaining Day 1-Day 9 location-background replacement:
  - `npm run check:full` (104 manifest entries, 6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 strict visual gate (22 passed, including browser decode for all 16 location variants and Day 9 boxing screenshots)
  - `git diff --check`
- Passed after the Pixel V2 city-map replacement:
  - `node maws_src/tools/verify_assets.mjs --require-final-day1-9`
  - `npm run check:full` (6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - Pixel V2 city-map desktop/mobile contract (2 passed; 16:9 plane, no empty min-height, HUD suppressed, mobile clutter capped)
  - Pixel V2 strict visual gate (24 passed after the final map/HUD/toast compatibility adjustment)
  - `git diff --check`
- Passed after the boot/modal/dialogue replacement:
  - `npm run check:full` (6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 strict visual gate (26 passed, including boot and dialogue contracts on desktop/mobile)
  - `git diff --check`
- Passed after the Pixel V2 combat-feedback replacement:
  - `node maws_src/tools/verify_assets.mjs --require-final-day1-9` (117 manifest entries)
  - `npm run check:full` (6 Chromium smoke tests)
  - `npm run test:playtest` (2 passed)
  - `npm run test:day1-9` (4 passed)
  - Pixel V2 strict visual gate (27 passed, including live VFX and NPC click feedback)
  - `git diff --check`
- Reviewed updated screenshots: `outputs/day8-combat-desktop.png` and `outputs/day8-combat-mobile.png`.

## Risks

- Current VFX textures remain legacy and will be replaced after the first background/standee batch.
- Non-scene profile/skills/bag/shop/log panels still include older generic card styling and need a later focused pass after combat VFX.
- Image generation may require cleanup/downsampling before an output is suitable for a runtime key.
- The final release gate still needs final-art desktop/mobile shots for Day 1, 2, and 3; Day 5 coverage is now active.

## Next Step

1. Replace the remaining profile/skills/bag/shop/log web-card styling with one restrained Pixel V2 panel language.
2. Add desktop/mobile screenshot contracts for those five surfaces and verify that useful information stays visible before details.
3. Re-run strict assets, full/playtest/Day1-9/visual browser gates, review screenshots, commit, and push the UI batch.
