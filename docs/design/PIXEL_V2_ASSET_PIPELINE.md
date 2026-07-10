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

## Report

The script emits JSON with source and output dimensions, alpha pixel counts, file sizes, chroma-key cleanup counts, exact target-size status, and combat-strip frame metadata. For standees, it also reports whether the output has a fully transparent 1px safety border.
