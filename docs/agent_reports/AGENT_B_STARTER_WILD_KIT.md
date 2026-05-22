# AGENT_B_STARTER_WILD_KIT

## Result

Implemented the starter wild kit. New players now start with six wild/old tools instead of formal `jab`/`advance` style fundamentals.

## Changed Files

- `maws_src/content/data.js`
- `maws_src/simulation/state.js`
- `maws_src/tests/phaser-smoke.spec.js`
- `maws_src/tests/day1_day7_playtest.spec.js`
- `docs/workers/starter_wild_kit.md`
- `docs/agent_reports/AGENT_B_STARTER_WILD_KIT.md`

## Design Notes

- `wild_swing` gives the player an imperfect but real strike for untrained opponents.
- `push_away` gives the player a cheap distance/reset tool without granting formal footwork.
- Existing `mystic`, `guard`, `retreat`, and `talkdown` remain starter tools but their unlock source text now frames them as wild/old versions.
- Formal skill progression remains intact: `jab`, `straight`, `palm`, and later system skills still require training sources.
- Old saves are not cleaned or stripped; migration only fills a missing equipment array with the new starter default.

## Validation

- `npm run check:full`: pass.
- `npm run test:playtest`: pass.
- `git diff --check`: pass.

## Risks

- No combat formula changes were made, so balance is tuned only through skill data and existing combat handling.
- E01 remains an objective battle entry in Day 5 playtest; this worker did not attempt to convert it into a KO check.
