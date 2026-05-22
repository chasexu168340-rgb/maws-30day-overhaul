# Day 1-7 Scene Content

## Task

Agent: `AGENT_D_NARRATIVE_CONTENT`

Scope: rewrite Day 1-7 mainline content into a friendlier structure: short scene summary, current hook/dialogue, and longer detail in foldable `eventNotebook`.

## Files Changed

- `maws_src/content/data.js`
- `docs/workers/day1_7_scene_content.md`
- `docs/agent_reports/AGENT_D_DAY1_7_SCENE_CONTENT.md`

## Content Pass

- Day 1: incense scene now centers on father, the misread lesson, and the first small bend from restraint into proof.
- Day 2: metro scene now frames the moment as containment, not a ring fight.
- Day 3: convenience store scene now emphasizes the false victory and Xiaoman seeing through it.
- Day 4: worksite scene now uses one emotional point: being seen feels exciting, but the wrist pain makes it real.
- Day 5: park sparring now states that the goal is verification, not KO.
- Day 6: old-town night walk now brings in a trace of the father while keeping the gameplay focus on reading exits and not shadows.
- Day 7: mirror scene now lands on self-check: wanting to protect people and wanting to prove yourself are still tangled.

## Data Shape

Each Day 1-7 `MAIN_EVENTS` entry now has:

- `shortDesc`: one-line summary for compact UI.
- `sceneSummary`: readable scene context.
- `hook`: today's current goal or choice pressure.
- Existing `desc`, `dialogue`, `eventNotebook`, `choices`, and `maw` fields remain compatible with current runtime.

No Day 8/9 content was changed.

## Reward Pass

Rewards were kept light. A few early gains that were too generous for short narrative choices were reduced, especially fame/relation/judgment/calm spikes.

## Validation

- `npm run build`: passed.
- `npm run test:smoke`: passed, 4 Chromium smoke tests.
- `git diff --check -- maws_src/content/data.js`: passed for this task's tracked runtime file.
- `git diff --check`: failed on pre-existing/non-task diffs in `maws_src/simulation/events.js` and `maws_src/simulation/state.js`; those files are outside this task's allowed edit scope and were not modified by this worker.

## Notes

Project rules normally ask to update `docs/TASK_PLAN.md`, but the user allowed modifications only to the three files above, so this worker output records the checkpoint instead.
