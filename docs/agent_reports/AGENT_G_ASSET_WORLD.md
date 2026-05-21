# AGENT_G_ASSET_WORLD

## Status

Implemented minimal metro visual bridge fallback on `asset/metro-visual-bridge`.

## Changes

- Added manifest fallback keys:
  - `bg.metro_station.day`
  - `bg.metro_station.night`
- Added `docs/content_proposals/metro_asset_plan.md`.

## Boundaries

- Did not modify `data.js`.
- Did not modify `state.js`.
- Did not modify UI or combat.
- Did not add or modify files under `assets/`.
- Fallback keys reuse existing city map images and are not final metro station art.

## Validation

- `node maws_src/tools/verify_assets.mjs`: passed, 95 manifest entries.
- `npm run build`: passed.
- `git diff --check`: passed; only Git CRLF working-copy warning.

## Runtime Note

`metro_station` still needs a later scoped runtime mapping in `LOCATION_BACKGROUND_KEYS` to use `bg.metro_station.day/night`. This branch intentionally does not touch `state.js`.
