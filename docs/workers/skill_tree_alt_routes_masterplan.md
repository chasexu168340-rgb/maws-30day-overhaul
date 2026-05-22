# Worker Masterplan: Skill Tree And Alternate Routes

Status: planning output for future implementation. No runtime code was changed for this task.

## Scope

Create a data-driven progression design that supports six trees:

- Boxing Foundation
- Traditional Reforge
- Grappling / MMA
- Street Survival
- Conditioning
- Social / Media dark route

Primary design source: `docs/design/SKILL_TREE_AND_ALT_ROUTES.md`.

## Execution Constraints

- Do not change combat formulas, economy curves, save version, asset structure, or entry HTML without a dedicated implementation task.
- Keep Phaser, DOM UI, data, and simulation boundaries intact.
- Treat all costs in the design as draft values until a balancing pass.
- Non-training routes must remain earned routes with time, relation, evidence, scandal, or reputation costs.

## Proposed Future Work Packages

### Package 1: Data Shape Only

Goal: add skill tree definitions without changing gameplay.

Suggested files for a future worker:

- `maws_src/content/data.js` or a new data module if project style supports it.
- A small simulation helper only if unlock checks cannot remain data-only.

Deliverables:

- Tree ids, node ids, tiers, costs, prerequisites, active skill names, passive perk names, combo node names.
- Route tags: combat, social, evidence, retreat, gear, legacy, media.
- No UI, no save migration, no balance tuning.

Validation:

- `npm run build`
- Data shape smoke in existing dev tooling if available.

### Package 2: Read-Only UI Prototype

Goal: show the tree and route state without allowing persistent unlocks.

Suggested files:

- DOM UI files only.
- Existing CSS only.

Deliverables:

- Tree list and node details.
- Requirement display for Insight, Skill XP, Relation Unlock, Father Memory, Evidence, Media Heat, Gear Tokens, Street Cred.
- Locked, available, and preview states.

Validation:

- `npm run build`
- Browser smoke on desktop, tablet, and mobile for overflow and button hit areas.

### Package 3: Unlock Simulation

Goal: allow unlocks in a controlled, save-safe way.

Suggested files:

- Simulation state helpers.
- Data unlock checker.
- DOM event handlers.

Deliverables:

- Unlock transaction that checks costs and prerequisites.
- Clear failure reasons.
- No combat formula changes.
- Save migration only if explicitly approved.

Validation:

- `npm run build`
- Manual smoke: unlock Tier 1, fail locked Tier 2, spend resource, reload if save support is scoped.

### Package 4: Training And Resource Gain Hooks

Goal: connect existing training and narrative moments to resources.

Suggested files:

- Training simulation.
- Narrative event data.
- Minimal UI feedback.

Deliverables:

- Training grants Skill XP and Conditioning XP.
- Mentor/family scenes grant Relation Unlock or Father Memory.
- Investigation and witness scenes grant Evidence.
- Media scenes grant Media Heat with backlash risk.

Validation:

- `npm run build`
- Manual smoke: train, rest, relationship scene, evidence scene.

### Package 5: Day 30 Route Checks

Goal: let Day 30 evaluate non-combat preparation.

Suggested files:

- Day progression / final evaluation module.
- Narrative result data.
- UI result display.

Deliverables:

- Fight win track.
- Points / judgment track.
- Rule victory track.
- Exposure victory track.
- Legacy victory track.
- Survival victory track.
- Negotiated victory track.

Validation:

- `npm run build`
- Manual smoke for at least one combat route and one non-combat route.

## Acceptance Criteria

- Each tree has at least three tiers.
- Each node has active skill, passive perk, combo node, unlock cost, and prerequisite.
- Alternate routes are not free wins; each has a cost or risk.
- Training affects body and skill growth.
- Skill unlocks add actions, branches, or combo routes, not only numeric bonuses.
- Day 30 can be reached through combat and non-combat preparation.

## Risks

- Scope creep into full combat rebalance.
- Save compatibility if persistent unlock state is added too early.
- UI overload on mobile because six trees have many nodes.
- Social/Media route becoming optimal if scandal costs are not enforced.
- Traditional Reforge identity weakening if dirty route choices have no narrative consequence.

## Recommended Next Step

Start with Package 1 as a data-only task. It is the smallest reversible step and gives later UI, training, and Day 30 work a stable contract.
