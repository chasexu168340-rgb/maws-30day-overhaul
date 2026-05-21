# Day 8 / Day 9 Content Proposal: First Wind And Father's Diary

> Proposal only. This document describes narrative intent and system-facing fields, rewards, flags, and settlement copy. It is not final runtime code.

## Goals

- Day 8 should let failure feel diagnostic, not humiliating.
- Day 8 should teach the player that "一阵风" is not about being weak, but about meeting a measuring tool: 这不是菜，是尺子。
- Day 9 should give the player a humorous pause through the father's diary, reducing tension without breaking the main tone.
- Both days should be easy to wire into existing content/data/event systems later.

## Day 8: 一阵风

### Narrative Function

Day 8 introduces an opponent or training incident that feels impossible at first contact. The player may lose, stumble, or fail to respond in time, but the text frames the result as measurement:

- The player is not mocked.
- The player learns what is currently missing: footwork timing, guard recovery, breath rhythm, or reading an opening.
- The world becomes larger and more precise.
- The loss creates direction for training instead of shame.

Core sentence to preserve in spirit:

> 这不是菜，是尺子。它不是来证明你不行，是来量出你现在离哪里还差一点。

### Event Shape

Suggested event id:

- `day8_first_wind`

Suggested title:

- `一阵风`

Suggested trigger:

- Day index is 8.
- Player has entered the daily settlement or a morning/afternoon event slot.
- Event has not already resolved.

Suggested player-facing setup:

```text
你听见衣角轻轻一响。
不是敌意，也不像挑衅。对方只是站在那里，像把风借给了肩膀。
下一瞬，你才发现自己已经慢了半拍。
```

### Outcome Copy

#### If Player Performs Poorly

Use a calm diagnostic tone:

```text
你没接住。
准确地说，你接住的是结果，不是动作。
对方没有笑你，只把手收回袖中，说："能看见慢在哪里，就已经不是白挨。"
```

Settlement line:

```text
一阵风掠过，你被量出了一段距离。今天输掉的不是脸面，是误差。
```

#### If Player Performs Adequately

```text
你退得有点狼狈，但没有乱。
对方的袖口擦过你的肩，你终于在第二次风声里听见了第一步。
```

Settlement line:

```text
你没有追上风，但开始知道风从哪里起。
```

#### If Player Performs Well

```text
你没有抓住那阵风，却让它绕了半步。
对方停了一下，像是重新估了估你的站法。
```

Settlement line:

```text
风没有留下来，但你留下了一次正确的判断。
```

### Tone Guardrails

- Avoid lines like "你太菜了", "完全不配", "毫无天赋", "被打成笑话".
- Avoid NPC laughter unless it is warm and specific, never directed at player incompetence.
- Failure should name a trainable gap, not a personal defect.
- Let the mentor/opponent be precise rather than cruel.

### System Integration Suggestions

Suggested content fields:

```js
{
  id: "day8_first_wind",
  day: 8,
  type: "narrative_checkpoint",
  title: "一阵风",
  tone: "diagnostic_loss",
  tags: ["mainline", "measurement", "non_humiliating_failure"],
  triggerFlagAbsent: "story.day8FirstWindResolved",
  setFlags: ["story.day8FirstWindResolved", "story.firstWindMeasured"],
  outcomeBandField: "performanceBand",
  rewardProfile: "insight_not_power",
  settlementTextKey: "day8_first_wind_settlement"
}
```

Suggested flags:

- `story.day8FirstWindResolved`: prevents replay.
- `story.firstWindMeasured`: unlocks later references to the player understanding "尺子".
- `story.firstWindKeptComposure`: optional if performance is adequate or good.
- `story.firstWindReadTheStep`: optional if performance is good.

Suggested rewards:

- Small insight reward, not a big power spike.
- Prefer one of:
  - minor skill progress toward movement/reading/guard recovery,
  - a small morale/stability recovery after settlement,
  - unlock of a training hint or training source text.

Suggested reward payload:

```js
{
  insight: 1,
  morale: 1,
  skillProgress: [{ skillId: "footwork_reading", amount: 1 }],
  unlockHints: ["first_wind_measurement"]
}
```

Suggested settlement text keys:

- `day8_first_wind_settlement_poor`
- `day8_first_wind_settlement_ok`
- `day8_first_wind_settlement_good`

## Day 9: 父亲日记

### Narrative Function

Day 9 should pause the pressure after Day 8. The father's diary adds warmth and humor without turning the story into parody. The joke should come from a parent trying to sound serious while recording mundane details.

The diary should:

- Let the player breathe.
- Make the family voice specific and affectionate.
- Quietly reframe Day 8's loss as normal growth.
- Give a small practical nudge for the next day.

### Event Shape

Suggested event id:

- `day9_fathers_diary`

Suggested title:

- `父亲日记`

Suggested trigger:

- Day index is 9.
- `story.day8FirstWindResolved` is true.
- Event has not already resolved.

Suggested setup:

```text
你在旧箱底翻到一本本子，封面写着"重要记录"。
翻开第一页，第一行是：今日练功，甚有心得。第二行是：鞋底开胶，甚不体面。
```

### Diary Excerpts

Use short entries rather than a long monologue:

```text
初八，风大。
孩子被人一晃，站在原地想了很久。
我本想安慰，想了想，先把锅盖扶正。高手可以慢慢当，饭不能慢慢熟。
```

```text
又记：所谓挫败，若能指出方向，便不是坏事。
但若挫败发生在饭前，则全家脾气都会更差。以后重要谈话宜安排在饭后。
```

```text
附：今日发现孩子皱眉时很像我年轻时。此事不可告知本人，容易骄傲。
```

### Player-Facing Resolution

```text
你合上日记，忽然觉得昨天那阵风没有那么冷。
父亲写得很认真，也很不可靠。
但有一点是真的：被量出来以后，人就知道该往哪里长。
```

Settlement line:

```text
父亲的日记把昨天的风压低了一点。你没有被安慰得很庄重，但确实轻松了一些。
```

### Tone Guardrails

- Humor should pause tension, not erase stakes.
- The father can be clumsy, practical, and warm; he should not become a pure comic relief prop.
- Avoid explaining the joke in UI text.
- Keep diary entries short enough for settlement or event panels.

### System Integration Suggestions

Suggested content fields:

```js
{
  id: "day9_fathers_diary",
  day: 9,
  type: "narrative_checkpoint",
  title: "父亲日记",
  tone: "warm_humor_pause",
  tags: ["mainline", "family", "diary", "recovery"],
  requireFlags: ["story.day8FirstWindResolved"],
  triggerFlagAbsent: "story.day9FathersDiaryRead",
  setFlags: ["story.day9FathersDiaryRead", "story.fatherDiaryHumorPause"],
  rewardProfile: "morale_and_reflection",
  settlementTextKey: "day9_fathers_diary_settlement"
}
```

Suggested flags:

- `story.day9FathersDiaryRead`: prevents replay.
- `story.fatherDiaryHumorPause`: enables later callbacks to the father's diary.
- `story.firstWindReframed`: marks that Day 8 has been emotionally reframed.

Suggested rewards:

- Small morale/stress recovery.
- Optional insight or focus reward.
- Optional unlock of a diary codex entry, if the project has a journal/archive surface.

Suggested reward payload:

```js
{
  morale: 2,
  stress: -1,
  insight: 1,
  codexUnlocks: ["father_diary_day9"]
}
```

Suggested settlement text keys:

- `day9_fathers_diary_settlement`
- `day9_fathers_diary_codex_unlock`

## Implementation Notes For Future Coding

- Put adjustable event copy, reward payloads, tags, and settlement keys in content data, not UI files.
- State should only check day/flags and apply rewards/flags.
- UI should render title, body, choices, rewards, and settlement text from data.
- Avoid hard-coding Day 8 or Day 9 copy inside Phaser scenes or DOM components.
- If outcome bands are unavailable, Day 8 can use one default non-humiliating result and still satisfy the narrative goal.

## Acceptance Checklist

- Day 8 failure text does not shame the player.
- Day 8 clearly communicates "this is a measuring tool".
- Day 9 creates a humorous pause through the father's diary.
- Proposal includes fields, rewards, flags, and settlement text guidance.
- No runtime code is included.
