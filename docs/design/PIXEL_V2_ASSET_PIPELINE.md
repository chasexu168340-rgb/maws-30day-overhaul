# Pixel V2 Asset Pipeline

`scripts/prepare_pixel_v2_assets.ps1` is a deterministic Windows preparation gate for reviewed `pixel_v2` PNG inputs. It does not generate art and does not edit manifests.

## Defaults

- Default output root: `assets/pixel_v2`.
- Output layout matches the runtime manifest: `backgrounds/`, `characters/`, `sprites/`, `portraits/`, `skillCards/`, `items/`, `icons/`, and `vfx/`.
- Resize mode: nearest-neighbor only.
- Existing outputs are rejected unless `-Force` is passed.
- Source and output resolving to the same path is always rejected.
- Validation or smoke runs should pass an `outputs/temp/...` output root so runtime assets are not changed.

## Asset Types

| Type | Default size |
| --- | --- |
| `background` | `480x270` |
| `standee` | `96x144` |
| `combat-strip` | `1536x144`, 16 frames of `96x144` |
| `portrait` | `96x96` |
| `skill-card` | `192x128` |
| `item` | `64x64` |
| `icon` | `32x32` |
| `vfx` / `custom` | requires `-Width` and `-Height` |

## Examples

Prepare a reviewed standee candidate into a temp output:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/prepare_pixel_v2_assets.ps1 `
  -Source outputs/temp/lu_candidate.png `
  -Type standee `
  -OutputRoot outputs/temp/pixel_v2_smoke `
  -ChromaKey -ChromaColor '#00FF00' -ChromaTolerance 12
```

Validate a combat strip without writing output:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/prepare_pixel_v2_assets.ps1 `
  -Source outputs/temp/lu_combat_strip.png `
  -Type combat-strip `
  -ValidateOnly
```

Repack a reviewed 4x4 action master into the runtime 16-frame horizontal strip:

```powershell
pwsh -ExecutionPolicy Bypass -File scripts/prepare_pixel_v2_assets.ps1 `
  -Source outputs/temp/lu_action_master_4x4.png `
  -Type combat-strip `
  -GridColumns 4 -GridRows 4 `
  -TrimGridRemainder `
  -ChromaKey -ChromaColor '#20F015' -ChromaTolerance 70 `
  -OutputName anim_fighter_player.png
```

Frame order is row-major. The tool uses one global content scale, centers each opaque silhouette, and locks every frame to the same two-pixel bottom safety line. Pass `-PreserveCellFraming` only when a reviewed master already has exact per-frame camera framing.

The MAWS 16-frame contract is idle `0-3`, attack `4-7`, hurt `8-11`, and guard/utility `12-15`.

## Report

The script emits JSON with source and output dimensions, alpha pixel counts, file sizes, chroma-key cleanup counts, exact target-size status, and combat-strip frame metadata. For standees, it also reports whether the output has a fully transparent 1px safety border.
