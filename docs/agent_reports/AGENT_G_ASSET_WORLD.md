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

`metro_station` runtime mapping is now wired to the existing fallback keys:

- day: `bg.metro_station.day`
- night: `bg.metro_station.night`

This is still a fallback bridge that reuses existing manifest entries. It is not final metro station art.

## Runtime Mapping Validation

- `npm run build`: passed in manager validation.
- `node maws_src/tools/verify_assets.mjs`: passed, 95 manifest entries.
- `npm run test:smoke`: passed after linking the worktree to the main repository `node_modules` for local validation; 4 Chromium smoke tests passed.
- `git diff --check`: passed; Git only printed CRLF working-copy warnings during earlier checks.
