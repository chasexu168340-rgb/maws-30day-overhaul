# TASK_HANDOFF

> New-window recovery checkpoint. Keep this file focused on the current wave, allowed scope, validation gates, and next runnable work.

## Current Task

Day 1-Day 9 retro-pixel vertical slice: produce and integrate the first reviewed `pixel_v2` art batch without changing existing runtime asset keys.

## Current Staging Baseline

- Wave 15 QA merged.
- Skill-tree spend state exists with Insight costs, prerequisites, purchased state, and small runtime effects.
- Combat recipes exist for tactical plan modes.
- Wave15 smoke covers skill-tree spend, recipe controls, recipe feedback, and mobile overflow.

## Goal

Use the Microsoft SkillOpt pattern as a production workflow: run a current-state rollout/audit, select bounded high-impact patches, validate them behind gates, and keep only changes that improve the player-facing loop.

The player-facing target remains: the player clicks something, the game responds clearly, the character changes, and the next action or fight feels different.

## Current Pass

1. Pixel runtime and manifest metadata contracts are active.
2. Tactical recipes, Day 8 measurement, and Day 9 diary-to-training handoff are implemented and pushed.
3. `docs/design/PIXEL_V2_STYLE_BIBLE.md` is the canonical art source for palette, proportions, environment staging, dimensions, and final-art review.
4. Combat fighters now use bottom anchors/contact shadows, and Phaser consumes the structured hit-stop, shake, palette-flash, and pixel-VFX metadata without warnings.
5. Combat HUD presentation is square, hard-edged, and more compact on mobile; Day 8 desktop/mobile screenshots were reviewed.
6. Generate images only in the current Codex session; do not use CLI workers for image content.
7. `bg.park.day` is now a reviewed 480x270/32-color/45KB `pixel_v2` final asset and passes Day 8 desktop/mobile runtime screenshots.
8. `anim.fighter.player` is now a final 16-frame `pixel_v2` strip with real idle/attack/hurt/guard playback; browser tests read the live Phaser frame index and capture an attack-frame screenshot.
9. Day 8 now uses an independent final E10 standee/strip; browser tests prove both player and E10 attack ranges play in real combat and capture both mid-action screenshots.
10. Guard FX targeting/tinting is corrected and concise Chinese combat cues replace English debug-style labels.
11. Day 5 E01 now uses an independent final beginner-boxer standee/strip; browser tests prove its attack frames and cover desktop/mobile Day 5 screenshots.
12. E00 now uses an independent final untrained-target standee/strip; browser tests prove its attack frames and cover desktop/mobile Day 3 optional combat screenshots.
13. Lu now has final 96x144 scene standee and 96x96 portrait assets that match the approved combat sprite; the old green-fringed standee and hoodie portrait are no longer live.
14. The asset preparation tool supports chroma-key portrait cleanup.
15. Liu Pangzi now has final 96x144 scene standee and 96x96 portrait assets; Day 1 desktop/mobile confirms a coherent Lu/Liu pixel scale.
16. Scene fallback styling now checks manifest status, so final NPC art is not incorrectly rendered as a placeholder.
17. Xiaoman now has final 96x144 scene standee and 96x96 portrait assets; Day 3 store desktop/mobile screenshots verify final-scale rendering.
18. The worksite worker now has final 96x144 standee and 96x96 portrait assets; Day 4 scene/dialogue desktop/mobile screenshots verify both.
19. Dialogue lookup prefers dedicated portraits, and the Day 4 worker line now carries an explicit `npc: worker` identity.
20. Coach Liang now has final 96x144 scene standee and 96x96 portrait assets; Day 9 boxing desktop/mobile screenshots verify final-scale mitt silhouettes.
21. Father memory now has final 96x144 scene and 96x96 portrait assets; Day 1 dialogue resolves Lu/father identities correctly and the three-character desktop stage stays clear of the right action rail.
22. `bg.home.day` is now a final 480x270/32-color/41KB `pixel_v2` background with an open cast lane and Day 1 story anchors; final background verification now enforces dimensions, indexed palette size, and the 180KB budget.
23. The Pixel V2 scene shell removes the red player backplate and blurred-glass panels, uses hard contact shadows, caps immediate recommendations at two, and keeps compact lower-corner rails on desktop with 44px mobile action targets.
24. Day 2-Day 4 now use final metro/store/worksite `pixel_v2` daytime backgrounds; strict visual coverage includes Day 2 metro and existing Day 3/4 desktop/mobile screenshots.
25. All 16 Day 1-Day 9 location background variants now use reviewed 480x270/32-color `pixel_v2` art, including geometry-matched night/rain/dusk variants and old-street day/night; only city-map day/night remains legacy.
26. City-map day/night now use final 480x270/32-color `pixel_v2` route maps; the sheet preserves 16:9 marker geometry, uses compact hard UI, hides locked mobile clutter, and passes the strict final-art verifier.
27. Karate Master 2 is a principle-only reference for work/training/fight cadence, attack-height reads, guard/back-step defense, counter timing, distance recovery, injury, and rules; no packaged content is copied.
28. Boot/title now uses the final night city map as a full-screen stage; dialogue/result/duration/event/diary shells use solid square Pixel V2 panels, readable current-line typography, and 44px actions on desktop/mobile.
29. Final 64x64 Pixel V2 hit/heavy/guard/miss/break/recipe/utility VFX are live; scene-character clicks use a dedicated contact texture, and strict verification enforces their size, alpha corners, and budget.
30. Combat targets now read high/mid/low, distance text states its tactical use, and enemy reads distinguish standing guard, back-step defense, and counter windows without changing formulas.
31. Profile, skills, bag, shop, and log now use one final Pixel V2 ledger language, hide raw data identifiers, retain useful information before details, and pass desktop/mobile screenshots with 44px mobile actions.
32. Core resource/navigation icons, Day 1-9 inventory objects, six starter moves, and the first formal/route skills now use final Pixel V2 art; strict verification enforces their exact dimensions, alpha corners, and budgets.
33. The asset preparation tool supports chroma-key cleanup plus nearest-neighbor contain fitting and insets for icons/items/skill cards without distorting action silhouettes.
34. Phaser Boot now preloads only the explicit 89.5KB street/home set; current location and combat textures load on demand behind a pixel loading plate, with failed keys shown instead of blank fighters.
35. Browser coverage proves Day 1 first look stays under 3MB and Day 5/Day 8 combat increments stay around 290KB under the 1.2MB gate.
36. The Day 1-Day 9 Pixel V2 vertical slice has passed strict assets, runtime, playtest, responsive, visual, animation, and network gates. Day 10-Day 30 art remains explicitly deferred legacy/fallback work.
37. Keep generation review images and screenshots in local `outputs/`; commit only approved runtime assets.
38. E06 now uses a final 28-frame Pixel V2 grappling strip and matching standee with entry, shot, takedown/control, sprawl, hurt, and escape rows.
39. Grappling contact runs on a readable 380ms approach while ordinary strikes remain 260ms; impact audio/VFX follow the actual contact point.
40. `slice_combat_motion_atlas.ps1` accepts optional per-frame target heights so standing and ground poses can share one 96x144 contract without shrinking the whole fighter.
41. The player combat strip now has 36 frames: the original 28 plus takedown fall frames 28-31 and technical recovery frames 32-35.
42. Successful takedowns coordinate attacker approach, defender fall, lateral ground travel, impact timing, and a later player `escape -> recover` animation.
43. E07 now uses a final 28-frame, 128x144 Pixel V2 weapon strip and matching standee; the wider frame preserves the wooden-baton silhouette.
44. E07 actor-specific semantics cover threat advance, swing/smash, miss recovery, hurt, and guarded disengage without changing boxing actions that share `straight`.
45. Weapon contact is presented at 340ms and has desktop/mobile plus mid-strike browser evidence.
46. E18 now uses a final 36-frame, 128x144 Pixel V2 hybrid strip and matching standee with distinct boxing, front-kick, clinch, takedown, sprawl, hurt, and escape rows.
47. E18 front-kick contact is presented at 300ms and grappling contact remains 380ms; browser tests cover both contact approaches plus desktop/mobile combat.
48. The generic E05 boxer and broader post-Day9 enemy set remain on legacy/fallback motion contracts.
49. The main DOM interface now uses a focused scene-first shell: compact HUD, five persistent destinations, one system menu, at most two immediate scene commands, and one optional action drawer.
50. Action rows expose only an icon, name, and short cost/reward line by default; management ledgers use 60px Pixel V2 art and compact text, while full descriptions remain opt-in.
51. Responsive/browser contracts now enforce five primary tabs, no more than two visible scene commands, hidden-until-open utility navigation, 44px mobile controls, bitmap panel frames, and modal-over-navigation layering.

## Deferred Larger Work

- Day 10-Day 30 art and content coverage.
- Full skill-tree economy.
- Broad enemy or combat formula rewrites.
- Three.js or framework migration.

## Read First

1. `AGENTS.md`
2. `docs/TASK_HANDOFF.md`
3. `docs/FILE_MAP.md`
4. `docs/TASK_PLAN.md`
5. `docs/VALIDATION.md`
6. current worker prompt or optimization report if present

## Validation

- Asset gate:
  - `node maws_src/tools/verify_assets.mjs`
- Runtime gates:
  - `npm run check:full`
  - `npm run test:playtest`
  - `npm run test:day1-9`
  - `git diff --check`

## Do Not Do

- Do not implement full 30 days, full skill tree, more UI panels, broad enemy rewrites, or save key/version changes during this bounded pass.
- Do not give `jab` / `advance` as new starter skills.
- Do not mark legacy or fallback art as `final`; final art must be reviewed and live under `assets/pixel_v2/`.
- Do not extract, trace, or copy Bruisers assets, code, text, audio, or exact layouts.
- Do not let multiple workers edit the same UI files concurrently.
- Do not start CLI workers unless the user explicitly asks for workers.
- If CLI workers are explicitly requested, use `gpt-5.5` with high reasoning by default and keep QA after implementation branches are pushed or merged.
- Do not ask CLI workers to generate images; image generation belongs in the current Codex session only.
