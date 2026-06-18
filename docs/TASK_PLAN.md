# TASK_PLAN

> Current task sheet. Keep only this task, result, validation, risks, and next step.

## Current Task

SkillOpt-style optimization pass for the current playable slice.

## Scope

- Apply the SkillOpt loop to MAWS production work: rollout/audit, reflect, select a bounded high-impact patch, validate behind gates, and checkpoint.
- Use the current moodboard direction as a product constraint: grounded city RPG, compact HUD, reward burst, readable combat feedback, low debug noise.
- This pass does not rewrite the architecture, save key/version, asset structure, starter skills, broad combat balance, or economy curve.

## Current Result

- Baseline `npm run check:full` passed before edits.
- Identified a high-impact loop break: skill-tree nodes were spendable in state but the player-facing UI button still used `toast`.
- Fixed skill-tree node UI so available nodes render a real `purchaseSkillTreeNode` action.
- Strengthened `wave15_addiction_loop.spec.js` so purchase is verified through the visible UI button instead of direct `store.dispatch()`.
- Hid the self-check/debug tab from normal navigation unless `?debug=1` is present.
- Collapsed the combat tactics drawer by default so the battle stage and command bar stay dominant.
- Follow-up pass connected the existing early `视频复盘` action to the tested skill-tree spend loop: tests now earn Insight through UI before buying.
- Skill-tree copy now names the source of Insight: review, training, and mainline progress.
- Third pass surfaces purchased skill-tree effects in the next combat feedback panel, not only in the hidden combat math.
- Third pass committed and pushed as `fda68fc`.
- Current pass makes reward chips honor structured kind/priority/icon data: time and cost no longer read as generic positive gains.
- Equipped skill cards now open their details by default so useful skill data is visible without turning every card into a wall.
- Reward-chip pass committed and pushed as `e2a619e`.
- Current pass adds a bounded NPC memory follow-up: 小满/刘胖子 can reference the Day 3 convenience-store choices and Day 5 park check in the scene interaction menu.
- Scene NPC menus now keep a remembered follow-up visible within the compact 3-button cap when a memory exists.
- Current pass removes debug-style battle recipe copy from the player-facing combat log.
- Auto-filled combat plans now log a readable tactical sentence, for example `战术配方：压迫自动补入【推搡 -> 野路挥拳】...`, instead of leaking `PLAN触发` / `comboSlot` / `planSlot`.
- Wave15 combat recipe smoke now asserts the tactical line is visible and debug slot fields stay out of player feedback.
- Current pass connects the early `视频复盘` action to concrete follow-up choices: players can jump directly to the skill tree or ask 刘胖子 to review again from the result modal.
- Result settlement modals now render bounded `followUps` as real actions, instead of storing them as unused metadata.
- Wave15 smoke now asserts the video-review result exposes both next-step buttons.
- Current pass turns 刘胖子二段复盘 into a real follow-up loop: `视频复盘 -> 找刘胖子再看一遍 -> 去点技能树`.
- `fatty_review_together` now resolves with reward chips and keeps a skill-tree next step visible, so the second-step button is not a dead end.
- Wave15 smoke now covers the full chained follow-up path.
- Current pass surfaces purchased skill-tree combat perks before the player acts: reinforced combat cards now show compact notes like `技能树 · 命中 +2%`.
- The first purchased Street Wild node is now visible on the next `野路挥拳` combat action card, tightening the `I bought it -> next fight feels different` loop.
- Wave15 smoke now asserts the visible combat-card perk note, not just post-exchange feedback.
- Current pass makes 刘胖子二段复盘 consume existing NPC memory: if the player has the Day 3 convenience-store mistake flag, the result modal now surfaces his specific follow-up line instead of generic completion copy.
- Memory-aware review writes a `reviewed_<memoryKey>` flag, so follow-up review is a real state transition rather than a prettier toast.
- Compact settlement modals now prefer `modal.lead` over generic "completed" text, while still showing reward chips.
- Wave15 smoke now asserts the remembered Day 3 line, reward chips, skill-tree next step, and persisted memory-review flag.
- Current pass makes reviewed memories surface later in scene interaction: after 刘胖子 reviews the Day 3 store mistake, 小满's store menu reacts to the reviewed memory instead of replaying only the original incident line.
- Reviewed Day 3 memory now has higher NPC memory priority for 刘胖子 and 小满, creating a small `event -> review -> later banter` chain.
- Wave15 smoke now asserts the post-review 小满 scene menu line.
- Current pass adds a bounded low-risk early fun target: `E00 嘴硬路人`, a fully untrained, external-bluster opponent for starter wild skills.
- Park now features `嘴硬路人试手` as the primary local action before the E01 check, with tiny rewards and a daily gate so it does not become a grind loop.
- The existing E01 `开放验货局` remains intact as the trained baseline; this pass does not weaken E01 or change combat formulas.
- Wave15 smoke now walks the visible park action -> event notebook confirmation -> E00 battle path.
- Current pass adds E00-specific battle-result feedback: wins explain that wild skills can handle untrained people, while retreat/review explains that low risk still needs review.
- Ordinary battle surrender no longer resolves as a win just because the player HP is higher than the enemy HP.
- Battle-result modals now prefer `modal.lead`, so enemy-specific lessons appear in the first visible line instead of being buried in details.
- Wave15 smoke now verifies E00 result feedback and the persisted `e00_wild_tryout_review` flag.
- Current pass makes E00 win-side memory visible in NPC banter: after `e00_wild_tryout_win`, 刘胖子 can joke that beating a mouthy passer is not a boxing-gym diploma.
- E00 win memory now has high priority in `npcMemory()`, so it is not buried behind older Day 3 / Day 5 memories.
- Wave15 smoke now asserts the post-E00 Fatty scene menu banter.
- Current pass adds compact E00 follow-up opportunity cards: review outcomes recommend `视频复盘`, while win outcomes recommend moving from the mouthy passer to the E01 park check.
- Opportunity rules now support small flag gates (`flag` / `notFlag`) so result-specific follow-ups can be data-driven without UI text parsing.
- Wave15 smoke now asserts both E00 follow-up recommendations from the visible recommendation cards.
- Current validation pass tightens the E00 win follow-up smoke to use a real unlocked Day 3 park state, click the E01 recommendation, confirm the event notebook, and assert the battle resolves into `E01`.
- This keeps the test on the player path instead of a partial card-visibility check.
- Current combat-feel pass rewrites combo/recipe feedback from label-style `COMBO！` copy into body-language feedback such as `连段反馈：你先用推搡抢到一拍空间...`.
- Wave15 combat smoke now asserts pressure-plan feedback mentions the physical read (`抢到一拍` / `脚下乱了`) and blocks the old `COMBO！` label from returning.
- Current E01 loop pass makes Day 5 park-check results persist as explicit `park_check_pass/review` flags.
- War-room style post-review now marks `reviewed_park_check_*`, keeps `去点技能树` visible, and lets 刘胖子 surface a reviewed park-check memory ahead of older E00 banter.
- Wave15 smoke now walks Day 5 mainline -> E01 objective pass -> 技术复盘 -> Fatty memory.
- Current growth-path pass adds a post-review opportunity card: after Day 5/E01 park-check review, `公园验货之后，把刺拳来源记住` points the player toward `Day 9 / 拳馆 · 沙包连击 / 刺拳`.
- The card is a route prompt only: it does not open boxing early, does not alter starter skills, and does not change combat formulas.
- Wave15 smoke now verifies Day 5 mainline -> E01 objective pass -> 技术复盘 -> jab-source recommendation -> event notebook -> Fatty memory.
- Current event-memory pass makes dialog opportunity confirmations capable of writing scoped flags and structured reward deltas.
- The post-E01 jab-source card now persists `park_check_jab_source_seen` and shows a visible `刺拳路线` reward chip after the player confirms it.
- Wave15 smoke now verifies the full route: E01 review -> jab-source notebook -> confirmation result -> persisted route flag -> Fatty memory.
- Current de-duplication pass prevents the confirmed jab-source route from repeating on later early days.
- The `park_check_jab_source` opportunity now respects `notFlag: park_check_jab_source_seen`, so the card is a one-time route memory instead of a repeated nag.
- Wave15 smoke now verifies that Day 6 recommendations no longer include `park_check_jab_source` after the player confirms the route.
- Current Day9 route pass turns the remembered jab source into a real `拳馆开放了，去把沙包连击做掉` recommendation once Day 9 boxing is available.
- The Day9 route recommendation enters the existing `bag` minigame instead of staying a reminder card.
- Completing the bag minigame now persists `boxing_bag_first_done`, so the Day9 route card stops after the player turns the note into training.
- Worker workflow checkpoint updated: future CLI workers are opt-in only, default to `gpt-5.5` + high reasoning, and must not generate images.

## Validation

- Passed:
  - `npx playwright test maws_src/tests/wave15_addiction_loop.spec.js --browser=chromium --reporter=line`
  - `npx playwright test maws_src/tests/wave14_loop.spec.js --browser=chromium --reporter=line`
  - `npx playwright test maws_src/tests/wave11_flow.spec.js --browser=chromium --reporter=line`
  - `npm run check:full`
  - `npm run test:playtest`
  - `git diff --check`

## Risks

- This is a bounded SkillOpt optimization series, not a claim that the whole game is fully optimized.
- Generated moodboard files under `outputs/` are local creative artifacts and are intentionally not part of the code commit.
- The next likely pass should target one small event follow-up choice or combat-feedback feel patch, using the same audit -> patch -> gate loop.

## Next Step

Commit and push the Day9 jab-route-to-bag-training pass on `codex/skillopt-optimization-pass`.
