# Skill Tree And Alternate Routes Masterplan

Status: masterplan only. This document does not authorize runtime code changes by itself.

## Design Goals

- Add a route-driven progression layer where training, relationships, media leverage, evidence, and retreat planning can all move the player toward the Day 30 goal.
- Make skill trees unlock actions, combo routes, branches, and tactical options, not only numeric bonuses.
- Preserve a Punch Club style tradeoff loop: body training improves performance but consumes time, money, health, mood, and relationship bandwidth.
- Support BG3 / Da Xia Li Zhi Zhuan style alternate solutions: players can win through rules, people, publicity, equipment, negotiation, withdrawal, or evidence, but every shortcut has a cost.
- Keep current combat and economy formulas out of this plan until an implementation batch explicitly scopes them.

## Progression Resources

| Resource | Primary Sources | Secondary Sources | Primary Uses | Route Cost |
|---|---|---|---|---|
| Insight Points | First-time wins, post-fight reflection, story discoveries, mentor lessons | Losing with high focus, investigating rival habits, reading old notes | Unlock tree nodes, branch choices, combo extensions | Scarce; spending wide delays deep mastery |
| Skill XP | Repeated practice of a style, sparring, live combat usage, training minigames | Watching footage, drills with a partner | Tier gates, active skill mastery, combo consistency | Overtraining risks fatigue and injury |
| Relation Unlock | Helping NPCs, social scenes, faction trust, promises kept | Gifts, public support, mutual rivals | Social/Media tree gates, Traditional mentor gates, rule-lawyer options | Can create obligations and route locks |
| Father Memory | Family scenes, old equipment, flashbacks after key losses, restoring reputation | Visiting legacy locations, honoring promises | Traditional Reforge gates, moral route pivots, Day 30 non-combat endings | Some memories conflict with dirty tactics |
| Street Cred | Surviving ambushes, protecting locals, winning unsanctioned scenes | Taking blame, refusing to quit, risky public stands | Street Survival gates, intimidation, evacuation support | Raises police/rival attention |
| Media Heat | Viral clips, interviews, controversies, staged moments | Sponsorships, leaked evidence, public rival callouts | Social/Media nodes, sponsor gear, rule pressure | Higher scandal risk and hostile crowds |
| Gear Tokens | Sponsor deals, tournament awards, favors, pawn/trade loops | Salvage, old family gear restoration | Equipment route options, defensive compensation | Gear can be banned, stolen, or exposed |
| Evidence | Investigation, recordings, witnesses, medical reports, contracts | Relation scenes, risky infiltration | Rule victory, opponent disqualification, negotiation leverage | Gathering it costs time and can provoke retaliation |

## Global Tree Rules

- A node has: Tier, unlock cost, prerequisite, active skill, passive perk, and combo node.
- Active skills add new verbs: stance change, counter, clinch, feint, retreat, expose, callout, or negotiate.
- Passive perks tune consistency, recovery, risk control, relationship leverage, or route access.
- Combo nodes unlock follow-up decisions or chained actions, similar to Nioh stance and follow-up unlocks.
- Each tree has at least one route tax: injury risk, reputation loss, training time, relationship debt, public scandal, legal attention, or moral conflict.
- Cross-tree nodes can share prerequisites, but no route should become a free universal best path.

## Tree 1: Boxing Foundation

Theme: disciplined fundamentals, ring control, and reliable damage. Best for players who train hard and accept predictable tradeoffs.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Guard And Jab | 1 Insight, 20 Boxing XP | None | Snap Jab: fast opener that checks distance | +5% guard recovery after light attacks | Jab > Step Out |
| 1 | Body Line Basics | 1 Insight, 25 Boxing XP | Guard And Jab | Body Jab: lowers opponent stamina pressure | Body shots generate slightly more focus | Jab > Body Jab |
| 1 | Rope Discipline | 1 Insight, 1 Skill XP level | Guard And Jab | Cover On Ropes: reduce burst damage for one exchange | Less panic loss when cornered | Cover > Pivot Escape |
| 2 | Counter Cross | 2 Insight, 60 Boxing XP | Guard And Jab, one sparring win | Counter Cross after a blocked straight | +4% counter timing window | Block > Cross |
| 2 | Hook Entry | 2 Insight, 70 Boxing XP | Body Line Basics | Lead Hook: punishes lateral movement | Better damage when opponent is tired | Body Jab > Lead Hook |
| 2 | Ring Cut | 2 Insight, 1 Relation Unlock from coach | Rope Discipline | Cut Off: denies one retreat or spacing action | Opponent escape actions cost more stamina | Jab > Cut Off > Cross |
| 3 | Championship Rhythm | 3 Insight, 140 Boxing XP, 1 Father Memory | Counter Cross, Hook Entry | Rhythm Break: force a timing reset after a combo | Lower fatigue from repeated boxing combos | Jab > Cross > Hook |
| 3 | Knockdown Setup | 3 Insight, 160 Boxing XP | Hook Entry, Ring Cut | Liver Shot: high stamina damage, risky if whiffed | Better finish chance against exhausted opponents | Body Jab > Liver Shot > Hook |
| 3 | Corner Verdict | 4 Insight, 180 Boxing XP, coach trust | Ring Cut | Corner Flurry: pressure sequence that can win rounds on points | Judges value clean boxing pressure more | Cut Off > Flurry > Step Out |

Route cost: Boxing demands steady training time and recovery. It is reliable, but deep investment can leave less room for investigation, relationships, or media leverage.

## Tree 2: Traditional Reforge

Theme: rebuilding family martial legacy into practical combat. It uses Father Memory and mentor trust to turn old forms into modern branches.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Old Frame, New Guard | 1 Insight, 1 Father Memory | Find or remember a family lesson | Rooted Guard: resist pushback and intimidation | Lower morale loss after being pressured | Rooted Guard > Short Palm |
| 1 | Crane Step | 1 Insight, 25 Traditional XP | Old Frame, New Guard | Crane Step: angled evade against straight attacks | Slight evasion boost after a calm action | Evade > Crane Step |
| 1 | Bridge Hand | 1 Insight, mentor intro | Old Frame, New Guard | Bridge: touch-and-read entry before close exchange | Better read chance against aggressive foes | Bridge > Palm |
| 2 | Reforged Palm | 2 Insight, 60 Traditional XP, 1 Father Memory | Bridge Hand | Short Palm: close-range interrupt | Less stamina cost for close counters | Bridge > Short Palm |
| 2 | Sweep Memory | 2 Insight, 75 Traditional XP | Crane Step | Low Sweep: punish overcommitted kicks or rushes | Opponent balance recovers slower | Crane Step > Low Sweep |
| 2 | Lineage Oath | 2 Insight, 2 Father Memory, mentor trust | Old Frame, New Guard | Oath Focus: regain focus when choosing honorable action | Reputation loss reduced for clean fights | Guard > Oath Focus > Counter |
| 3 | Form Into Fight | 3 Insight, 140 Traditional XP | Reforged Palm, Sweep Memory | Form Burst: convert a successful read into a three-hit route | First combo after a read costs less stamina | Bridge > Palm > Sweep |
| 3 | Father's Counter | 4 Insight, 3 Father Memory | Lineage Oath, Reforged Palm | Memory Counter: high-value counter after taking damage | Once per fight, recover focus after a near-loss | Hit Taken > Root > Counter |
| 3 | Legacy Reclaimed | 4 Insight, mentor trust, restored family item | Form Into Fight | Reclaim: public challenge move that boosts morale and pressure | Unlocks legacy ending checks | Oath Focus > Form Burst > Reclaim |

Route cost: Traditional Reforge is powerful for narrative and morale paths, but dirty tactics and viral humiliation can lock or weaken some mentor and Father Memory nodes.

## Tree 3: Grappling / MMA

Theme: clinch, takedown, ground control, and mixed rules awareness. Strong when the player accepts bruising, rule risk, and positional complexity.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Clinch Entry | 1 Insight, 25 Grappling XP | None | Collar Tie: enter clinch after close contact | Better resistance to shove and rush | Jab Check > Collar Tie |
| 1 | Sprawl Habit | 1 Insight, 20 Conditioning XP | Clinch Entry or first takedown loss | Sprawl: defend a takedown attempt | Reduced damage from failed takedown defense | Sprawl > Reset |
| 1 | Grip Fight | 1 Insight, partner relation | Clinch Entry | Hand Fight: deny opponent setup | Opponent clinch skills cost more stamina | Hand Fight > Knee Tap |
| 2 | Knee Tap | 2 Insight, 70 Grappling XP | Grip Fight | Knee Tap: low-risk takedown from clinch | Slight control gain after successful tie-up | Collar Tie > Knee Tap |
| 2 | Wall Ride | 2 Insight, 65 Grappling XP | Sprawl Habit | Wall Ride: stand up or reverse near boundary | Less stamina loss while pinned | Sprawl > Wall Ride |
| 2 | Ground Pressure | 2 Insight, 90 Grappling XP | Knee Tap | Heavy Top: drain opponent stamina while controlling | Opponent escape rolls are less effective | Knee Tap > Heavy Top |
| 3 | Submission Threat | 3 Insight, 150 Grappling XP | Ground Pressure | Arm Triangle Threat: force defend-or-tap choice | More judge value for control sequences | Heavy Top > Threat |
| 3 | Dirty Break Warning | 3 Insight, Street Cred 2 | Wall Ride, Clinch Entry | Frame Break: rough clinch exit, may draw warning | Better survival in illegal scrambles | Wall Ride > Frame Break > Cross |
| 3 | MMA Chain | 4 Insight, 180 Grappling XP, partner loyalty | Knee Tap, Ground Pressure | Chain Wrestle: retry with altered angle after failed takedown | Failed takedowns lose less focus | Collar Tie > Knee Tap > Chain |

Route cost: Grappling causes visible wear, consumes recovery, and can trigger rule conflicts in boxing-focused matches. Some venues or opponents may ban ground work.

## Tree 4: Street Survival

Theme: unequal fights, escape, improvised defense, intimidation, and protecting objectives. It is not clean sport dominance.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Exit Sense | 1 Insight, survive one bad event | None | Scan Exit: reveal retreat, cover, or witness option | Lower panic in ambush scenes | Scan > Step Back |
| 1 | Improvised Guard | 1 Insight, 1 Street Cred | Exit Sense | Use Cover: reduce damage from group pressure | Better defense while carrying injury | Cover > Shove |
| 1 | Hard Shove | 1 Insight, 20 Street XP | Exit Sense | Shove: create space, low damage | Escape actions cost less stamina | Shove > Run |
| 2 | Witness Play | 2 Insight, Evidence 1 | Exit Sense | Call Witness: reduce enemy escalation, create evidence | Higher chance of post-event legal leverage | Scan > Call Witness |
| 2 | Low Line Kick | 2 Insight, 60 Street XP | Hard Shove | Low Kick: slow pursuit or rush | Better escape chance after leg damage | Shove > Low Kick > Run |
| 2 | Pain Compliance | 2 Insight, Street Cred 2 | Improvised Guard | Wrist Turn: disable one weapon or grab attempt | Less injury from dirty contact | Cover > Wrist Turn |
| 3 | Evacuation Plan | 3 Insight, Relation Unlock from ally | Witness Play, Exit Sense | Evacuate: protect self or NPC and end scene early | Retreated scenes lose less reputation | Call Witness > Evacuate |
| 3 | Ambush Reversal | 3 Insight, 140 Street XP | Low Line Kick, Pain Compliance | Reversal: turn an ambush opener into counter position | First dirty hit each scene has reduced injury | Cover > Wrist Turn > Reversal |
| 3 | Street Verdict | 4 Insight, Street Cred 4, Evidence 2 | Witness Play | Public Exposure: convert attack into legal/social pressure | Unlocks evidence-based Day 30 checks | Call Witness > Record > Expose |

Route cost: Street Survival keeps the player alive but builds heat. Police attention, rival escalation, and public reputation damage can block clean sport opportunities.

## Tree 5: Conditioning

Theme: body engine, injury control, stamina, and schedule discipline. It supports every route but cannot replace tactical choices alone.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Breath Clock | 1 Insight, 20 Conditioning XP | None | Reset Breath: spend a turn to recover stamina and focus | Lower fatigue from basic training | Guard > Reset Breath |
| 1 | Roadwork Base | 1 Insight, 25 Conditioning XP | None | Pace Push: increase stamina recovery for a short window | Better daily stamina cap | Reset > Pace Push |
| 1 | Joint Care | 1 Insight, clinic or coach relation | None | Brace: reduce injury chance on next exchange | Lower injury severity from training | Brace > Continue |
| 2 | Sprint Burst | 2 Insight, 60 Conditioning XP | Roadwork Base | Burst Step: close or exit distance quickly | Better initiative after rest day | Pace Push > Burst Step |
| 2 | Iron Neck | 2 Insight, 70 Conditioning XP | Joint Care | Tuck Chin: reduce stun from head shots | Lower knockout risk when tired | Guard > Tuck Chin |
| 2 | Recovery Discipline | 2 Insight, 1 Relation Unlock | Breath Clock, Joint Care | Active Recovery: convert rest day into minor XP retention | Faster injury recovery | Brace > Active Recovery |
| 3 | Late Round Engine | 3 Insight, 150 Conditioning XP | Sprint Burst, Breath Clock | Second Wind: restore stamina once after threshold | Better performance in final round/day checks | Reset Breath > Second Wind |
| 3 | Damage Budget | 3 Insight, 140 Conditioning XP | Iron Neck, Recovery Discipline | Absorb And Answer: take reduced hit and open counter | Injury penalties decay faster | Tuck Chin > Answer |
| 3 | Camp Discipline | 4 Insight, 200 Conditioning XP, coach trust | Late Round Engine | Camp Mode: commit days to high-output training block | Training plans produce less mood loss | Active Recovery > Camp Mode |

Route cost: Conditioning is time hungry. Chasing the perfect body can starve relationship, evidence, and route preparation before Day 30.

## Tree 6: Social / Media Dark Route

Theme: influence, rule pressure, audience capture, sponsorships, negotiation, and reputation warfare. This is the main non-training route, but it creates debt and backlash.

| Tier | Node | Unlock Cost | Prerequisite | Active Skill | Passive Perk | Combo Node |
|---|---|---:|---|---|---|---|
| 1 | Camera Sense | 1 Insight, Media Heat 1 | First public scene or phone access | Clip Moment: turn a clean action into media heat | Slightly higher sponsor interest | Clean Hit > Clip |
| 1 | Favor Ledger | 1 Insight, Relation Unlock 1 | Help or bargain with an NPC | Call Favor: request small schedule, gear, or info help | Relation gains are more visible in UI | Talk > Call Favor |
| 1 | Rule Reading | 1 Insight, Evidence 1 | Read tournament or contract clue | Cite Rule: block one unfair condition | Lower cost to file complaints | Evidence > Cite Rule |
| 2 | Sponsored Gear | 2 Insight, Media Heat 2, Gear Token 1 | Camera Sense | Equip Sponsor Kit: temporary stat or safety edge | Better gear durability or discount | Clip > Sponsor > Equip |
| 2 | Negotiated Match | 2 Insight, Relation Unlock 2 | Favor Ledger, Rule Reading | Negotiate Terms: alter venue, rules, or opponent prep | Less reputation loss for avoiding bad fights | Call Favor > Negotiate |
| 2 | Evidence Drop | 2 Insight, Evidence 2, Media Heat 2 | Rule Reading | Leak Evidence: force rival response or penalty | Witnesses are more likely to cooperate | Cite Rule > Leak |
| 3 | Crowd Capture | 3 Insight, Media Heat 4 | Camera Sense, Sponsored Gear | Crowd Swing: audience pressure affects morale and judging | Better comeback morale in public fights | Clip > Crowd Swing |
| 3 | Contract Trap | 4 Insight, Evidence 3, Relation Unlock 3 | Negotiated Match, Evidence Drop | Trap Clause: win by exposing invalid fight condition | Unlocks non-combat Day 30 resolution | Negotiate > Trap Clause |
| 3 | Scandal Engine | 4 Insight, Media Heat 5, Street Cred or sponsor debt | Evidence Drop | Scandal Push: massive pressure, can destroy relations | Higher chance rivals self-sabotage | Leak > Scandal Push > Exit |

Route cost: Social/Media can solve problems without peak combat stats, but it increases scandal risk, sponsor obligations, public hate, and mentor/family disapproval. Dirty media tactics may lock Traditional Reforge nodes.

## Alternate Route Families

| Route | Core Tools | Win Condition | Required Prep | Cost |
|---|---|---|---|---|
| Rule Route | Rule Reading, Cite Rule, Trap Clause, Evidence | Opponent disqualified or match terms corrected | Evidence 3, relation with official or witness | Public may call it cowardice; some rivals retaliate |
| Relationship Route | Favor Ledger, Negotiated Match, mentor trust, ally evacuation | Allies change schedule, reveal weakness, or prevent ambush | Relation Unlock 3-4, promises kept | Debt scenes; failing promises can close future help |
| Media Route | Camera Sense, Crowd Capture, Evidence Drop, Scandal Engine | Public pressure forces sponsor, judge, or rival concession | Media Heat 4-5, clips, timing | Backlash, scandal, sponsor control |
| Gear Route | Sponsored Gear, restored family item, Gear Tokens | Equipment offsets stat gap or creates tactical counter | Gear Tokens 2-4, sponsor or legacy unlock | Gear may be banned, damaged, stolen, or shameful |
| Negotiation Route | Negotiate Terms, Call Favor, Trap Clause | Avoid impossible fight, change venue/rules, split rival camp | Relations, evidence, leverage | Reputation hit; not all opponents negotiate |
| Retreat Route | Exit Sense, Evacuate, Witness Play | Survive and preserve Day 30 eligibility instead of winning every scene | Street Survival nodes, ally planning | Lost rewards and possible morale damage |
| Evidence Route | Witness Play, Public Exposure, Evidence Drop | Expose corruption or rigging as the objective | Evidence 3-5, safe witness chain | Time sink, retaliation, legal attention |

## Training, Body, And Skill Growth

- Training sessions generate Skill XP for the trained discipline and Conditioning XP based on intensity.
- High intensity raises fatigue and injury risk; low intensity is safe but may miss Tier deadlines.
- Body state should influence tactical access: exhausted characters can still use rule, retreat, and social actions, but deep combo routes become less reliable.
- Skill XP reflects practice quality, not only time spent. Sparring and live use should grant larger but riskier gains.
- Rest days are not dead days if the player has Recovery Discipline, relation scenes, investigation leads, or media planning.
- Overtraining can temporarily lock active skills, worsen Day 30 readiness, or force a medical/social alternative route.

## Nioh Style Combo And Branch Principles

- A Tier 1 node unlocks a basic verb.
- A Tier 2 node adds a branch after a specific condition: block, evade, clinch, read, witness, or favor.
- A Tier 3 node turns a route into a decisive chain or ending check.
- Combo nodes should be conditional, not automatic. Example: Jab > Cross > Hook needs stamina and spacing; Cite Rule > Leak needs evidence and public context.
- Cross-style combos are allowed only when they create a readable identity:
  - Boxing + Conditioning: Guard > Reset Breath > Counter Cross.
  - Traditional + Street: Rooted Guard > Wrist Turn > Public Exposure.
  - Grappling + Social: Clinch evidence of illegal move > Cite Rule.
  - Boxing + Media: Clean Hit > Clip Moment > Crowd Swing.

## Day 30 Goal Support

Day 30 should evaluate readiness across multiple victory tracks instead of only raw combat power.

| Day 30 Track | Minimum Path | Possible Result |
|---|---|---|
| Fight Win | At least one combat tree Tier 3 plus sufficient body readiness | Win the final fight directly |
| Points / Judgment | Boxing or Traditional pressure plus Crowd Capture or clean reputation | Win through judges, audience, or public legitimacy |
| Rule Victory | Rule Reading, Evidence Drop, Trap Clause, Evidence 3+ | Opponent is disqualified or forced into fair terms |
| Exposure Victory | Street Verdict or Scandal Engine with verified evidence | Rival network collapses before or during Day 30 |
| Legacy Victory | Traditional Reforge Tier 3 plus Father Memory route | Restore family name even if the fight is not a pure KO |
| Survival Victory | Street Survival Tier 3 plus ally evacuation plan | Save target, survive, and deny rival objective |
| Negotiated Victory | Favor Ledger, Negotiated Match, Relation Unlock 4 | Final confrontation changes into settlement, rematch, or public concession |

Non-training routes must still require preparation. A player can skip heavy training, but cannot skip decisions, obligations, evidence, timing, and consequences.

## Implementation Notes For Future Batches

- Store tree definitions as data, not hardcoded UI branches.
- Keep unlock checks separate from combat math.
- Add route state flags conservatively; avoid save version changes until an implementation plan scopes migration.
- Start with data-only definitions and a debug unlock view before connecting full UI.
- Do not balance numeric costs in this document as final values. Treat costs as design seeds for implementation tuning.
