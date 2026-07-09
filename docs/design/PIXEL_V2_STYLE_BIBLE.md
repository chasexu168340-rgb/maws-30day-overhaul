# MAWS Pixel V2 Style Bible

## Production Goal

Build a coherent Day 1-Day 9 urban martial-arts slice on a 480x270 logical canvas. The image must read as a game scene before any DOM panel appears: clear ground plane, strong character silhouettes, one focal action, and enough negative space for dialogue and combat HUD overlays.

`pixel-v2` is a production contract, not a filter applied to legacy art. Assets are only `final` after they pass visual review, runtime loading, mobile/desktop framing, and the asset verifier.

## Reference Boundary

Bruisers is a design reference for preparation, distance, and consequences carrying into the next fight. Do not extract, trace, reproduce, or imitate its code, assets, text, characters, audio, or exact layouts. MAWS keeps its own Chinese-city setting, tactical queue combat, and black/red/gold visual identity.

## Visual Grammar

- Native scene grid: 480x270 pixels. Scale only by integer multiples where the viewport permits.
- Pixel edges are hard. No antialiasing, bloom, bokeh, soft gradients, photographic texture, or painterly brushwork.
- Use clusters rather than isolated noisy pixels. Dither only to describe material or atmosphere.
- One dominant light direction per scene. Cast shadows and contact shadows must agree.
- Characters occupy the same perspective plane as the environment. Feet land in the lower 30-40% scene band.
- Backgrounds contain no baked-in foreground people. Leave readable staging lanes for two standees.
- Silhouettes must remain identifiable at 1x logical size and in a 32px-tall thumbnail.
- UI uses square pixel corners, integer shadows, and restrained accents. Red signals danger/pressure, gold signals earned progress, cyan signals timing/read information, gray signals secondary detail.

## Master Palette

| Role | Color | Use |
| --- | --- | --- |
| Ink | `#0A0A0D` | deepest outline, HUD foundation |
| Charcoal | `#18191F` | interior shadow, secondary panels |
| Paper | `#F3E2B9` | warm light, readable highlight |
| Signal red | `#D92F3A` | danger, pressure, mainline urgency |
| Earned gold | `#F2C94C` | unlocks, rewards, decisive focus |
| Read cyan | `#45C7D9` | tells, counters, timing feedback |
| Concrete | `#7C858C` | neutral city structure |
| Jade | `#417A65` | home/park supporting color |
| Night blue | `#24334A` | night atmosphere without navy dominance |

Individual scenes may add up to eight supporting colors. Keep the full visible frame under roughly 32 purposeful colors.

## Character Identity Anchors

### Lu Xiaoxian

- Chinese man, early twenties, slim and under-trained rather than frail.
- Slightly messy short black hair; expressive brows; eager posture that outruns his fundamentals.
- Plain black T-shirt, dark track pants, worn black-and-white sneakers, muted green hand-wrap accent.
- Idle silhouette: chin a little high, shoulders loose, weight too far forward.
- Combat improvement must appear through stance and timing, not sudden bodybuilder mass.

### Liu Pangzi

- Stocky friend with a practical overshirt and phone/camera motif.
- Relaxed stance, one shoulder lower, observant rather than clownish.
- Silhouette must read through broad torso, raised phone, and compact legs.

### Xiaoman

- Convenience-store clerk in a practical uniform and apron.
- Alert eyes and contained reactions; grounded reality anchor, not an exaggerated anime mascot.
- Clear apron block and tied-back hair distinguish her at small scale.

### Coach Liang

- Lean older boxing coach, economical posture, towel or whistle as a small identifier.
- Hands naturally return to guard. No oversized muscles or fantasy-master costume.

### Father Memory

- Warm, desaturated presence with ordinary clothing and restrained posture.
- Memory scenes feel intimate, not supernatural or horror-coded.

### Early Opponents

- E00: untrained, loud confidence, open chin, unstable stance. Visually beatable without looking disposable.
- E01: six-month boxing beginner, compact guard and reliable feet. Clearly more trained than Lu, not elite.
- E10: lean experienced boxer, minimal motion and calm centerline. A measuring stick, not a monster.

## Environment Direction

| Scene | Emotional job | Focal anchors | Staging requirement |
| --- | --- | --- | --- |
| City map | readable daily pressure | transit line, home/store/park nodes | no decorative clutter over routes |
| Rental room | identity and father memory | incense shelf, cramped bed, training notes | open floor lane for Lu and Liu |
| Metro | social pressure and controlled exit | carriage doors, route strip, handrails | one clear confrontation lane |
| Convenience store | comic reality check | shelf edge, counter, CCTV | Xiaoman readable behind/near counter |
| Worksite | physical cost | scaffold, material stacks, harsh light | grounded open strip for worker beat |
| Park | low-risk test and measurement | court markings, trees, bench | two-fighter lane with visible foot plane |
| Boxing gym | earned fundamentals | heavy bag, ring ropes, timer | bag route and coach lane remain clear |
| Old street | retreat awareness | storefront shutters, alley exit, streetlamp | exit direction must read instantly |

Day and night variants share geometry. Lighting, signs, windows, and palette may change; doors, floor horizon, and interaction anchors must not drift.

## Asset Contract

| Type | Logical size | Alpha | Runtime notes |
| --- | --- | --- | --- |
| Background / map | 480x270 | no | exact aspect ratio, no baked characters |
| Scene standee | 96x144 | yes | feet at `(48, 143)`, 1px transparent safety border |
| Combat frame | 96x144 | yes | same anchor and body scale across frames |
| Combat strip | 1536x144 | yes | 16 horizontal frames at 96x144 |
| Portrait | 96x96 | yes | face readable at 48x48 display |
| Skill card art | 192x128 | optional | art only; no baked text |
| Item | 64x64 | yes | centered, 2px safety border |
| Icon | 32x32 | yes | one symbol, no letters |
| VFX | 32/48/64 square | yes | short hard-edged sequences |

## Day 1-Day 9 Final Set

### Backgrounds

- City map day/night.
- Rental room day/night.
- Metro day/night.
- Convenience store day/night.
- Worksite day/dusk.
- Park day/night.
- Boxing gym day/night.
- Old street day/night.

### Characters And Portraits

- Lu Xiaoxian, Liu Pangzi, Xiaoman, worker, Coach Liang, Father memory.
- E00, E01, E10.
- Each named speaking character receives one 96x96 portrait.

### Combat And Feedback

- Lu, E00, E01, and E10 combat strips.
- Hit, heavy hit, guard, miss, posture break, recipe complete, and click-contact VFX.
- Combat strips may ship after approved standees, but no asset is marked `final` while its runtime key still points to legacy art.

## Generation And Review Order

1. Generate one art-direction keyframe with Lu and E10 in a park measurement scene. It is a reference image, not runtime art.
2. Approve palette, pixel density, proportions, ground contact, and lighting.
3. Generate the rental room and Lu reference sheet from the approved direction.
4. Produce Day 1-3 environments and characters, then Day 4-6, then Day 7-9.
5. Remove backgrounds from standees, downsample with nearest-neighbor rules, and inspect at 1x.
6. Add files under `assets/pixel_v2/`, update existing manifest keys, and mark only reviewed files `final`.
7. Run runtime screenshots at 390x844, 900x700, 1365x768, and 1536x864.

## Rejection Checklist

Reject an asset when any item is true:

- Anti-aliased or blurred edges remain at 1x.
- Character proportions drift from the reference sheet.
- Feet float, sink, or disagree with the scene horizon.
- Lighting direction conflicts with the background.
- Background includes baked-in people or blocks the interaction lane.
- The palette reads as a single dark-blue, purple, beige, or red mass.
- Important silhouette detail disappears at normal runtime scale.
- File exceeds its performance budget without a measured reason.
- The asset is presented as `final` before runtime and visual verification.
