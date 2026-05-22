# Day 1-Day 7 Playtest Harness

## Scope

- Added a dedicated Playwright smoke for the early experience path.
- Reused the same local static server, console/page error collection, and horizontal overflow check pattern as `maws_src/tests/phaser-smoke.spec.js`.
- Kept assertions short and selector/state based so normal copy edits should not break the harness.

## Coverage

- New game starts on Day 1 at `home`.
- Day 1 starter skills remain `mystic`, `guard`, `retreat`, and `talkdown`.
- `metro_station` is visible, enterable from the city map, and exposes metro actions after travel.
- Skills tab renders source information from `model.skillUnlocks`.
- Day 5 main event enters an `E01` combat with `park_check` objectives.
- 390x844 map, city map overlay, and skills page have no horizontal overflow.

## Command

```powershell
npm run test:playtest
```

## Notes

- This harness does not change gameplay, data, UI, assets, combat formulas, or economy curves.
- The Day 5 check prepares state through the public store and clicks the existing main event entry.
