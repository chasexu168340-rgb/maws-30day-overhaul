# Events Pressure Worker Notes

## Scope

- Role: `AGENT_B_GAMEPLAY_SYSTEMS` events/opportunity-card lane.
- Changed only early opportunity-card pressure and anti-idle nudges.
- Did not modify data values, combat rules, state shape, UI, CSS, assets, or economy curves.

## Implemented

- Added Day 1-7 low-pressure opportunity cards:
  - `early_video_review`: 复盘录像
  - `early_boxing_visit`: 去拳馆看看，先不急着上台
  - `early_metro_observe`: 地铁站观察
  - `early_store_supply_xiaoman`: 便利店补给/小满提醒
- Added home-idle anti-slacking reminders:
  - `home_idle_fatty_ping`: 刘胖子提醒
  - `home_idle_phone_plan`: 手机日程提醒
  - `home_idle_neighbor_noise`: 邻居提醒
- Added `boxing_bag_combo_hint` after Day 5 when the player lost or still lacks `jab`.
- Added scoring support for `minDay`, `maxDay`, `missingSkill`, `requiresHomeIdle`, and simple `any` branches.
- Added early-day/home-idle contextual weighting so early non-battle cards rise and battle cards are deprioritized when the player is still at home before taking actions.

## Notes

- `homeIdle` is inferred from `state.loc === 'home'` and `daily.actions <= 0`; no persistent new state was added.
- The “拳馆 · 沙包连击” card is a reminder at home, not a forced boxing travel or battle, because boxing location unlock timing lives in data and was out of scope.

## Validation

- `npm run build`: passed.
- `npm run test:smoke`: blocked because `playwright` is not available on PATH in this workspace.
- `git diff --check`: passed.
