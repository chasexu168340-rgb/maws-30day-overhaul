# AGENT_F_TECH_QA_TOOLS

## Summary

Added real-browser Playwright smoke coverage for the current reforge staging branch.

## Changes

- Added `@playwright/test` as a dev dependency.
- Added `npm run test:smoke`.
- Reworked `maws_src/tests/phaser-smoke.spec.js` to start a local static server and run Chromium checks at `390x844`, `900x700`, and `1365x768`.
- Covered Day 1 location lock UI, metro station visibility/travel/action flow, skills page overflow, and combat page overflow.

## Validation

- `npx playwright install chromium`: passed.
- `npm run build`: passed.
- `npm run test:smoke`: passed, 4 Chromium tests.
- `git diff --check`: passed.

## Notes

External `codex exec < docs\codex_tasks\AGENT_F_TECH_QA_TOOLS.md` could not complete because the local Codex CLI reported an invalid API key. The same task was completed manually in this branch.
