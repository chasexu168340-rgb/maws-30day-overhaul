# Wave 9 Scene QA

## Scope

- Role: `AGENT_F_TECH_QA_TOOLS`
- Branch reviewed: `staging/reforge-unlocks-v1`
- Remote state: `HEAD` aligned with `origin/staging/reforge-unlocks-v1` after `git fetch origin --prune`
- Reviewed integrated merge commits:
  - `be93322 merge: scene stage scale`
  - `14e2242 merge: dialogue box rebuild`
  - `b598fa8 merge: event feedback loop`
  - `b68cf3a merge: visual direction scene ui`

## File Boundary Review

- `feat/scene-stage-scale`: changed `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, worker/report docs.
- `feat/dialogue-box-rebuild`: changed `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, worker/report docs.
- `feat/event-feedback-loop`: changed `maws_src/dom/ui.js`, `maws_src/dom/ui.css`, `maws_src/simulation/state.js`, worker/report docs, and `docs/TASK_PLAN.md`.
- `docs/visual-direction-scene-ui`: docs only.
- Finding: `feat/event-feedback-loop` touched `docs/TASK_PLAN.md`. I did not modify it because QA was explicitly forbidden to change `docs/TASK_PLAN.md`.
- No `assets/` paths changed in `origin/main...HEAD`.
- No `maws_src/assets/manifest.js` paths changed in `origin/main...HEAD`.
- No `maws_src/simulation/combat.js` diff in `origin/main...HEAD`.
- `maws_src/content/data.js` has no diff in `origin/main...HEAD`; `INITIAL_SKILLS` remains `['mystic', 'guard', 'retreat', 'talkdown']`.

## Functional Review

- Character scale: improved on desktop. Desktop sample at 1365x768 showed player image about 340px high and NPC standee about 260px high, with both anchored in the scene layer.
- Mobile character handling: 390x844 shows the player and hides supporting NPCs rather than squeezing multiple characters into unreadable space.
- Backplates: the old hard red/yellow/gray character backplate treatment is no longer the dominant scene presentation; current scene styling uses contact shadow/rim light and muted stage treatment.
- Scene click feedback: scene character figures have `data-action` and keyboard focus. In the 390x844 sample, clicking the player produced a visible toast: `陆小闲现在没有可执行行动`.
- RPG dialogue: mainline quick check opened a `dialogue` modal with `.maws-dialogue-box` rendered.
- Event result feedback: dispatching the visible home action path for `shadow` produced a `settlement` modal with `.maws-result-summary`.
- 390x844 overflow: map and skills pages both reported `scrollWidth === innerWidth`.

## Validation

- `npm run check:full`: passed.
  - Build checked 23 JavaScript files.
  - Asset verification passed: 95 manifest entries across 9 required groups.
  - Playwright smoke passed: 4/4.
  - Includes responsive smoke at 390x844, 900x700, 1365x768.
- `git diff --check`: passed.
- Manual browser quick check: passed for map page, mainline dialogue, event feedback, and skills page.

## Risks

- `docs/TASK_PLAN.md` in staging still contains pre-QA merge checklist state and was modified by `feat/event-feedback-loop`; Manager should decide whether to accept or clean it in a separate allowed branch.
- Scene NPC click routing is intentionally limited to existing location actions. Characters without matching actions still give toast feedback, not a dedicated dialogue branch.
- Mobile hides supporting scene characters at narrow width; this matches the visual direction but means the 390x844 check cannot visually confirm multi-NPC proportions.

## Verdict

Ready with one documentation-scope warning: the integrated runtime changes pass validation and browser QA, but the `docs/TASK_PLAN.md` touch should be acknowledged by Manager before final merge.
