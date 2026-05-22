# QA Wave 10 Review

## Executive Verdict

Wave 10 should not proceed directly into skill tree implementation yet. The requested validation suite passes, and most design goals are intact, but the starter wild kit has a blocking integration gap: `wild_swing` and `push_away` are starter/equipped skills in content/state, yet they are missing from the combat resolver's local skill table.

## Reviewed Branches

- `feat/starter-wild-kit-v3`
- `feat/reward-ui-juice`
- `feat/combat-combo-autoplan-v1`
- `feat/time-dosage-prototype`
- `docs/skill-tree-alt-routes-masterplan`

Current reviewed HEAD: `5a8e21b` (`merge: skill tree alt routes masterplan`)

## Findings

### P1 - Starter wild skills do not resolve in combat

`wild_swing` and `push_away` are present in `maws_src/content/data.js` and are part of the starting kit/equipment, but `maws_src/simulation/combat.js` does not define them in its local `SKILLS` table. Combat preview reports both as `未知技能`, and actual resolution has a null-reference risk because `resolvePlayerAction` reads `skill.sp` without a missing-skill guard.

This blocks the requirement that early players have usable wild-route satisfaction. It also makes the new `push_away -> wild_swing` combo rule ineffective.

## Gate Review

| Gate | Result | Notes |
|---|---|---|
| No formal jab/advance starter gift | PASS | `INITIAL_SKILLS` and `STARTER_EQUIP_SKILLS` exclude both. |
| Gradual unlock maintained | PASS | `jab` remains tied to boxing bag; `advance` remains planned. |
| Early wild-route fun | FAIL | Promised starter skills are not valid combat skills. |
| Reward feedback is juicier | PASS | Reward chips and stack feedback appear in result modals. |
| Time dosage has diminishing/fatigue cost | PASS | Options scale time/resources/gain, fatigue scales harder, injury risk exists on hard effort. |
| Combo is lightweight | PASS | Small hit/risk/refund bonuses; no broad formula rewrite. |
| Existing smoke/playtest intact | PASS | All requested commands passed. |
| Ready for skill tree implementation | HOLD | Fix P1 and add coverage first. |

## Validation

```text
npm run check:full
PASS

npm run test:playtest
PASS

node maws_src/tools/sim_day5_park_check.mjs
PASS

git diff --check
PASS
```

## Recommendation

Before the next skill tree implementation batch, add `wild_swing` and `push_away` to combat `SKILLS` and extend Day 1/Day 5 playtest coverage to select and resolve a starter wild action. After that fix, the masterplan is a reasonable input for the next implementation round.

## Manager Follow-Up

Resolved after QA in `fix: register starter wild combat skills`:

- Added `wild_swing` and `push_away` to the combat resolver's local `SKILLS` table.
- Extended Day 1-Day 7 playtest coverage so starter wild skills must preview as valid, enter the combat queue, and resolve a real combat window.
- Re-ran `npm run check:full`, `npm run test:playtest`, `node maws_src/tools/sim_day5_park_check.mjs`, and `git diff --check`; all passed.
