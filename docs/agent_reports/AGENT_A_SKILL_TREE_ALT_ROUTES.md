# Agent A Report: Skill Tree And Alternate Routes Masterplan

Role coverage: Producer / Integrator, Gameplay Systems, Narrative Content.

## Completed

- Created the master design document for the skill tree and alternate route system.
- Created the future worker execution plan.
- Recorded this agent report for handoff.

## Files Produced

- `docs/design/SKILL_TREE_AND_ALT_ROUTES.md`
- `docs/workers/skill_tree_alt_routes_masterplan.md`
- `docs/agent_reports/AGENT_A_SKILL_TREE_ALT_ROUTES.md`

## Design Coverage

- Boxing Foundation tree with three tiers and concrete active, passive, combo, cost, and prerequisite rows.
- Traditional Reforge tree tied to Father Memory, mentor trust, and legacy route checks.
- Grappling / MMA tree focused on clinch, takedown, wall, and ground branches.
- Street Survival tree focused on retreat, witness use, ambush survival, and exposure.
- Conditioning tree for body engine, recovery, injury control, and camp discipline.
- Social / Media dark route for rules, relations, gear, negotiation, evidence, crowd pressure, and scandal.

## Systems Coverage

- Defined progression resources: Insight Points, Skill XP, Relation Unlock, Father Memory, Street Cred, Media Heat, Gear Tokens, and Evidence.
- Included Punch Club style training pressure: body growth, fatigue, injury, time cost, and opportunity cost.
- Included Nioh style unlock logic: active verbs, conditional branches, combo nodes, and Tier 3 decisive routes.
- Included alternate solution families inspired by BG3 and Da Xia Li Zhi Zhuan: rule, relationship, media, gear, negotiation, retreat, and evidence routes.
- Included Day 30 tracks that support combat and non-combat completion.

## Integration Guidance

- Keep the first implementation batch data-only.
- Do not change combat math, economy curves, save version, or asset structure until specifically scoped.
- Put unlock definitions in content data or a dedicated data module.
- Keep unlock checks separate from combat resolution.
- Add persistent unlocks only after save compatibility is planned.

## Validation

Required validation for this document-only task:

```powershell
git diff --check
```

Build validation is not required because this task does not modify runtime code.

## Open Risks

- Six trees may overload the existing UI if displayed without filtering or compact states.
- Social/Media and Evidence routes need visible costs to avoid becoming free bypasses.
- Traditional Reforge should react to dishonorable route choices, or Father Memory loses narrative force.
- Day 30 route checks need careful messaging so non-combat victory feels earned rather than skipped.

## Handoff

Next worker should read:

- `docs/design/SKILL_TREE_AND_ALT_ROUTES.md`
- `docs/workers/skill_tree_alt_routes_masterplan.md`
- `docs/agent_reports/AGENT_A_SKILL_TREE_ALT_ROUTES.md`

Recommended next task: implement Package 1 from the worker masterplan as data-only definitions.
