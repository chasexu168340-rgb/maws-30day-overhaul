# Wave 10 QA Review

Role: `AGENT_F_TECH_QA_TOOLS`
Date: 2026-05-22
Worktree: `qa/wave10-review`
Baseline reviewed: `staging/reforge-unlocks-v1` at `5a8e21b`

## Scope

Reviewed merged branches:

- `feat/starter-wild-kit-v3`
- `feat/reward-ui-juice`
- `feat/combat-combo-autoplan-v1`
- `feat/time-dosage-prototype`
- `docs/skill-tree-alt-routes-masterplan`

QA-only. No runtime source, asset, package, handoff, or task-plan files were modified.

## Verdict

Not ready to enter skill tree implementation without one blocking fix.

The formal `jab` / `advance` starter regression did not happen, progression remains mostly gradual, reward UI and time dosage pass the requested validation gates, and combo changes are lightweight. However, the new starter wild skills are not registered in `maws_src/simulation/combat.js`, so the early wild-kit promise is currently broken in actual combat.

## Blocking Finding

### P1 - Starter wild combat skills are equipped but unknown to the combat resolver

Evidence:

- `maws_src/content/data.js:156` sets starter skills to `wild_swing`, `push_away`, `mystic`, `guard`, `retreat`, `talkdown`.
- `maws_src/simulation/state.js:60` equips the same starter set.
- `maws_src/content/data.js:187` and `maws_src/content/data.js:188` define `wild_swing` and `push_away` in content data.
- `maws_src/simulation/combat.js:32` starts the combat resolver's local `SKILLS` table at `jab`; it does not include `wild_swing` or `push_away`.
- `maws_src/simulation/combat.js:176` previews unknown combat ids as invalid.
- `maws_src/simulation/combat.js:580` then assumes `SKILLS[id]` exists and immediately reads `skill.sp`.

Targeted runtime check:

```text
previewPlayerAction(..., "wild_swing") => valid: false, reason: "未知技能"
previewPlayerAction(..., "push_away") => valid: false, reason: "未知技能"
```

Impact:

- The first visible starter kit contains two promised wild tools that cannot be used as real combat actions.
- `push_away -> wild_swing` combo exists in `COMBO_RULES`, but is inert because both ids are missing from combat `SKILLS`.
- Existing smoke/playtest does not catch this because it does not select these starter wild actions.

Recommended fix before next implementation round:

- Add `wild_swing` and `push_away` to `maws_src/simulation/combat.js` combat `SKILLS`, aligned with content data and intentionally weak/rough.
- Add a playtest assertion that a Day 1 combat can select and resolve at least one of the starter wild actions without unknown-skill preview or runtime failure.

## Checklist

1. Formal `jab` / `advance` starter gift: PASS. `INITIAL_SKILLS` and `STARTER_EQUIP_SKILLS` no longer include them.
2. Gradual unlocks: PASS. `jab` remains boxing/bag sourced; `advance` remains planned and not gifted.
3. Early wild fun: FAIL. Data/UI promise exists, but `wild_swing` and `push_away` are unknown to combat resolution.
4. Reward feedback: PASS. Settlement and battle modals now surface reward chips and stack feedback.
5. Time dosage and fatigue cost: PASS WITH TUNING RISK. Duration options scale time/SP/cost/gains, fatigue scales harder, and hard options add injury risk.
6. Combo formula safety: PASS. Combo adds small hit/risk/refund bonuses and logs, without broad formula replacement.
7. Existing smoke/playtest: PASS. Requested validation commands passed.
8. Ready for skill tree implementation: HOLD. Fix starter wild combat registration and add coverage first.

## Validation Results

```text
npm run check:full
PASS - build ok, assets verified, Chromium smoke 4 passed

npm run test:playtest
PASS - 2 passed

node maws_src/tools/sim_day5_park_check.mjs
PASS - worker/fan/student origins all result=pass reason=park_check_pass

git diff --check
PASS - no whitespace errors
```

## Risk Notes

- Time dosage prototype is mechanically sound but still prototype balance; long-duration gains and fatigue/injury rates need later playtest tuning.
- Skill tree masterplan is suitable as a design input, and correctly says future implementation should keep unlock checks separate from combat math and avoid save migration until scoped.
- Current tests prove existing flows survived, not that the new starter wild combat loop works.

## Next Step

Create a small fix branch before skill tree implementation:

1. Register `wild_swing` and `push_away` in combat `SKILLS`.
2. Add Day 1 playtest coverage for selecting/resolving a starter wild action.
3. Re-run `npm run check:full`, `npm run test:playtest`, `node maws_src/tools/sim_day5_park_check.mjs`, and `git diff --check`.
