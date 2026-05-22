# QA Wave 12 Visual Review

Status: **changes requested before treating Wave 12 visual QA as complete**.

## Findings

### P1 - Reward chips still repeat settlement text and show long skill-unlock copy

`maws_src/dom/ui.js:154` aggregates `modal.rewardDeltas`, legacy gains, `settlementLines`, and `lines` into the same chip source. In a runtime check after the first home action, the result modal rendered duplicate chips for the same reward and a long chip reading like `学会 刺拳 / 来源 拳馆 · 沙包连击`.

This misses the structured reward goal: chips should be compact deltas such as `判断 +1`, `冷静 +3`, `学会 刺拳`, while long source/detail text belongs in details.

### P2 - The Wave 12 visual smoke does not enforce "combat cards are not only two"

`maws_src/tests/wave12_visual.spec.js:216` checks only grid height, and `:217` checks only queue slot existence. The runtime DOM had only two visible `.maws-combat-window-cards .maws-skill.combat-card` entries; four additional cards existed in the tactics drawer but were not visible in the viewport.

The implementation does make cards smaller and the combat stage larger, but the exact requested risk, "not just two cards", can still regress without the test failing.

### P3 - Pipeline/tooling files changed outside the named worker scopes

The integrated Wave 12 range includes changes under `scripts/`, including `scripts/Invoke-MawsMultiCliPipeline.ps1` and the new Wave 12 pipeline launcher/spec. These look like manager setup commits rather than the four reviewed worker commits, but they are outside the explicit allowed file lists for the task branches.

## Checks

- `INITIAL_SKILLS`: unchanged in the reviewed runtime diff.
- Combat formula: `maws_src/simulation/combat.js` unchanged.
- Battle cards: smaller, but current visible window is still only two cards.
- Battle stage: clearly larger in screenshot.
- Map characters: clearly larger and grounded.
- Red/yellow/gray backplates: reduced around the stage, but still prominent in panels.
- Structured event/action gains: present, but duplicated and polluted by long text.
- NPC click feedback: click burst support exists; inspectable character hit state can disappear on immediate toast rerender.
- Local action遮挡: desktop and mobile checks pass.

## Validation

- `npm run check:full` passed.
- `npm run test:playtest` passed.
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line` passed.
- `git diff --check` passed.

Note: `git fetch --all --prune` failed with `Recv failure: Connection was reset`; this review used the local `origin/*` refs already present in the QA worktree.

## Manager Follow-up

Status after follow-up: **ready for producer visual review**.

- P1 addressed: UI reward chips now prefer `modal.rewardDeltas` / structured rewards and no longer mix `settlementLines` or dialogue `lines` into the same chip pass when structured deltas exist. Inline reward modals also suppress the duplicate floating reward stack.
- P2 addressed: the combat HUD now shows up to 4 visible compact action cards while keeping the queue limit at 1-2 actions. `wave12_visual.spec.js` now asserts more than 2 visible combat cards.
- Added a visual smoke assertion that action reward chips are compact, deduped, and do not contain long source/detail prose.
- P3 accepted as manager setup scope: the script changes were pipeline fixes, not worker branch implementation changes.

Validation after follow-up:

- `npm run check:full`: passed.
- `npm run test:playtest`: passed.
- `npx playwright test maws_src/tests/wave12_visual.spec.js --browser=chromium --reporter=line`: passed.
- `git diff --check`: passed.
