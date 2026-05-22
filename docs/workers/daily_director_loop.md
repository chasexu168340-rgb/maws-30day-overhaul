# Daily Director Loop

## Goal

Make each day feel directed without adding a heavy scheduler or save migration.

## Runtime Changes

- `buildRenderModel` now emits optional `dayPeriod`, `todayFocus`, and `dailyDirector`.
- The render model keeps minute-based time internally, but exposes morning/afternoon/evening/night style periods and remaining free-action feel.
- `dailyDirector` includes the mainline anchor, recommended card count, remaining action hint, soft combat guidance for Day 1-7, and home-idle reminder copy.
- Opportunity cards are capped at 3 by default.
- Opportunity cards now carry `cooldownKey`; same-category cards are deduped and cards resolved today are filtered for the rest of the day.
- Consecutive sleep-at-home days add an optional `daily.idleSleepStreak`, used only to surface gentle phone/fatty/neighbor reminders.
- After Day 5, if `jab` is missing, `拳馆 · 沙包连击` gets an explicit priority boost.

## Boundaries

- No save version change.
- No data, UI, combat, economy, asset, or package changes.
- New fields are optional; old UI can ignore them safely.

## Validation

- `npm run check:full`: passed
- `git diff --check`: passed
