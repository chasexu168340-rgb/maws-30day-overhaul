# Day 1-Day 7 Manual Playtest Rubric

## Purpose

Use this 20-30 minute manual playtest to judge whether the first week communicates the player fantasy, city pressure, comedy tone, skill guidance, and non-KO combat progress clearly enough for a new player.

## Setup

- Start from a clean save.
- Do not read source code or debug state while scoring.
- Play at normal speed unless a scene blocks progress.
- Record one score from 1-5 for each rubric dimension after the run.
- If a blocker prevents reaching Day 7, score all reached sections and write the blocker under notes.

## Timebox

| Segment | Target Time | What To Do |
| --- | ---: | --- |
| Start and Day 1 | 4 min | Read opening, identify 陆小闲, complete the first guided choices. |
| Day 2 | 4 min | Visit or trigger the subway/commute beat and check city pressure. |
| Day 3 | 5 min | Play the convenience store beat and evaluate humor tone. |
| Skills Page | 4 min | Open skills, inspect locked/available skills, answer where to learn next. |
| Day 4-Day 5 | 7 min | Progress to 验货, fight or resolve it, check non-KO progress feedback. |
| Day 6-Day 7 | 4 min | Continue normal actions, watch whether early-week goals still make sense. |
| Scoring Notes | 2 min | Fill scores, evidence, and top three fixes. |

## Required Pass Questions

Answer these in plain language before assigning final scores.

1. Day 1: Who is 陆小闲, what is his immediate problem, and why should the player care?
2. Day 2: Does the subway feel like a pressured city commute rather than a neutral menu transition?
3. Day 3: Is the convenience store scene funny without feeling greasy, mean, or self-satisfied?
4. Skills page: Can a player tell where to learn or unlock the next useful skill?
5. Day 5 验货: If the player does not KO the opponent, do they still see clear progress, partial success, or a reason to retry?

## Scoring Scale

| Score | Meaning |
| ---: | --- |
| 1 | Fails the goal or actively misleads the player. |
| 2 | Partially present, but unclear, tedious, or easy to miss. |
| 3 | Understandable baseline; works but lacks confidence or punch. |
| 4 | Clear and effective with only small rough edges. |
| 5 | Strong, memorable, and ready to keep as a reference target. |

## Rubric Dimensions

Score each dimension from 1-5. Use evidence from Day 1-Day 7, not intended design.

| Dimension | 1 Point | 3 Points | 5 Points | Evidence To Capture |
| --- | --- | --- | --- | --- |
| 清楚下一步 | Player is lost or clicks randomly. | Main route is mostly clear, with occasional uncertainty. | Player always knows the next useful action and why. | Moment where next step was clearest or most confusing. |
| 不坐牢 | Flow feels blocked, repetitive, or punitive. | Some friction exists but the run keeps moving. | Failures and costs feel brisk, readable, and recoverable. | Any dead time, forced repeat, or unclear lock. |
| 现实可信 | Events feel arbitrary or gamey. | Setup is plausible but thin. | City, job, money, commute, and small conflicts feel grounded. | One believable detail and one unbelievable detail. |
| 娱乐性 | Text and beats feel flat or annoying. | Some jokes or situations land. | The week has memorable rhythm, contrast, and replayable comedy. | Best laugh, smile, or dullest beat. |
| 陆小闲人格 | Protagonist feels generic or inconsistent. | Basic personality is visible. | Player can describe his attitude, limits, and charm after Day 1. | Three words describing 陆小闲. |
| 失败也想继续 | Failure feels like wasted time. | Failure teaches something, but motivation varies. | Losing still creates progress, information, or a good story. | First failure and whether tester wanted to retry. |
| UI 信息可读性 | Text, buttons, or feedback are hard to parse. | Important info is readable with some scanning cost. | Goals, rewards, status, and choices are readable at a glance. | Any clutter, truncation, or missing feedback. |
| 战斗理解度 | Player cannot tell what happened or why. | Basic attack/result loop is understandable. | Player understands damage, progress, danger, and what improved. | Day 5 combat/result explanation in tester's own words. |

## Day-Specific Checks

### Day 1: 陆小闲 Identity

- Can the tester name 陆小闲 without checking a log?
- Can they describe whether he is desperate, cocky, practical, unlucky, kind, or something else?
- Does the game make his first-week goal concrete?
- Failure signal: tester says "I am just some guy" or cannot separate him from generic player avatar.

### Day 2: Subway City Pressure

- Look for crowding, timing pressure, money pressure, work fatigue, awkward public behavior, or city indifference.
- Confirm the subway beat changes emotional texture from Day 1.
- Failure signal: subway reads only as a travel button, loading label, or neutral map location.

### Day 3: Convenience Store Comedy

- The scene should be funny through situation, contrast, embarrassment, customer logic, or 陆小闲 reaction.
- It should not rely on leering, cheap cruelty, or joke text that feels like the game winking too hard.
- Failure signal: tester laughs at the scene for the wrong reason, feels secondhand embarrassment without payoff, or calls it oily.

### Skills Page: Where To Learn

- Open the skills page before and after one action that might unlock or progress a skill.
- For each visible locked or planned skill, ask: "Where would I go next to learn this?"
- Failure signal: tester sees skill names but cannot connect them to place, activity, condition, or progress source.

### Day 5: 验货 Without KO

- During or after 验货, intentionally accept a messy result if it happens naturally; do not restart for a perfect win.
- Check whether partial damage, endurance, money, reputation, knowledge, or narrative feedback makes the attempt feel useful.
- Failure signal: non-KO outcome reads as pure failure with no learning, no progress, and no reason to continue.

## Score Sheet

| Dimension | Score 1-5 | Evidence |
| --- | ---: | --- |
| 清楚下一步 |  |  |
| 不坐牢 |  |  |
| 现实可信 |  |  |
| 娱乐性 |  |  |
| 陆小闲人格 |  |  |
| 失败也想继续 |  |  |
| UI 信息可读性 |  |  |
| 战斗理解度 |  |  |

## Verdict

- Ship-ready if every dimension is 4+ and no required pass question fails.
- Needs targeted fixes if one or two dimensions score 3 and required questions are answerable.
- Needs another content/system pass if any dimension scores 1-2 or Day 5 non-KO progress is unclear.

## Notes Template

- Tester:
- Date:
- Browser/resolution:
- Run length:
- Reached day:
- Top three fixes:
- Blocking bugs:
- Strongest moment:
- Weakest moment:
