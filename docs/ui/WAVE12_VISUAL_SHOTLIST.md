# Wave12 Visual Acceptance Shotlist

## Purpose

This shotlist defines screenshot-based visual acceptance for Wave12. It is documentation-only and does not authorize runtime code, data, asset, save, balance, or package changes.

Every screenshot is judged as a game screen, not as a component inventory. The reviewer should answer: where does the eye land first, does the screen feel playable rather than like a debug panel, is information repeated, do characters sit inside the scene, and is the next action obvious.

## Global Pass Rules

- First read: the stage, active character, current event, and primary action are readable within 3 seconds.
- Game feel: the screen presents a scene with characters, depth, and action feedback; it must not read as a gray admin dashboard.
- Information economy: the same reward, state, or instruction is not repeated in multiple equal-weight panels.
- Character integration: characters have scale, contact shadow, lighting, and placement that make them belong to the background.
- CTA clarity: the next click is specific, visible, and not hidden by bottom navigation, dense cards, or modal chrome.
- Reward chips: chips use compact deltas such as `体力 -8`, `声望 +2`, `获得 残页`; they are not full-sentence summaries.
- Panel discipline: cards and panels may frame decisions, but they must not cover more than one third of the stage.

## Hard Fail Conditions

Any item below fails the screenshot without further debate:

- Large red, yellow, or gray backing panels cover the characters or become the dominant scene surface.
- Cards or panels obscure more than one third of the playable stage.
- A reward chip is a long sentence instead of a compact number, item, or status delta.
- NPC click feedback is only a toast, with no visible scene, dialogue, state, or CTA change.
- An important action is covered by the bottom bar or pushed below the reachable mobile viewport.

## Shot 1: Map Page, 1536x864

Capture the normal map page after the game has loaded and at least one location or NPC is available to interact with.

Acceptance questions:

- First eye target: does attention land on the current map area, protagonist/NPC cluster, or active opportunity rather than on resource chrome?
- Game vs debug: does the map look like a playable place with depth, not a table of buttons and logs?
- Repetition: are location labels, status summaries, and rewards shown once with clear hierarchy, not duplicated in sidebars and chips?
- Character fit: do visible characters have grounding shadows, correct scale, and lighting that matches the background?
- CTA: is the primary map action clear, such as entering, talking, training, investigating, or advancing time?

Pass bar:

- The stage remains the largest visual region.
- UI panels support route choice and status scanning without flattening the scene.
- Bottom navigation is visible but does not compete with or cover the active action.

## Shot 2: Battle Page, 1536x864

Capture an active combat or combat preview state with player and enemy visible.

Acceptance questions:

- First eye target: does attention land on the fighters and current combat decision, not on stacked logs?
- Game vs debug: does the battle read as a staged confrontation with impact, spacing, and danger, not a simulator console?
- Repetition: are HP, intent, rewards, and action labels not repeated in multiple equally loud areas?
- Character fit: are fighters anchored to the battlefield with contact shadows, readable silhouettes, and no card covering their bodies?
- CTA: is the next combat action clear and reachable, including attack, defend, skill, plan, continue, or retreat?

Pass bar:

- Combatants and their relationship occupy the visual center.
- Battle log and detail panels are secondary and collapsible or visually quiet.
- Danger color is semantic and targeted; it does not become a red screen-sized plate.

## Shot 3: Small Event Result

Capture a minor event after choosing an option and receiving the result.

Acceptance questions:

- First eye target: does the result sentence or changed scene state appear before explanation and history?
- Game vs debug: does the result feel like something happened in-world rather than a form submission response?
- Repetition: is the result not restated in the title, body, toast, chip, and log with equal emphasis?
- Character fit: if a character is involved, do they react through pose, highlight, line, or local state rather than staying inert?
- CTA: is the next step explicit, such as continue, leave, ask again, accept, refuse, or inspect?

Pass bar:

- At least one visible consequence appears in the main view.
- Main reward or cost is compact and immediate.
- Full detail can exist, but it must not displace the current beat.

## Shot 4: NPC Click Feedback

Capture the screen immediately after clicking an NPC on the map or scene.

Acceptance questions:

- First eye target: does attention move to the clicked NPC or their response?
- Game vs debug: does the click open or update an in-scene interaction, not just append a generic notice?
- Repetition: is the NPC name, role, and available action not repeated in multiple panels?
- Character fit: is the clicked NPC visually selected through rim light, nameplate, stance, dialogue, or local marker that belongs to the scene?
- CTA: is the next interaction clear, such as talk, challenge, trade, help, ignore, or close?

Pass bar:

- Toast-only feedback fails.
- The selected NPC state remains visible after the initial click.
- The player can tell what changed without reading a hidden log.

## Shot 5: Skill Page

Capture the skill page or skill selection screen with at least one available or previewable skill.

Acceptance questions:

- First eye target: does attention land on the current build choice or unlock path, not on decorative card mass?
- Game vs debug: does the page feel like a martial progression screen with character consequence, not a raw data grid?
- Repetition: are skill name, cost, requirement, and effect each shown in one primary place?
- Character fit: if character art or class identity appears, does it support the skill fantasy rather than float as unrelated sticker art?
- CTA: is the available action clear, such as learn, preview, equip, replace, or return?

Pass bar:

- Locked, available, selected, and learned states are visually distinct.
- Requirements and costs are readable before commitment.
- Dense information is grouped, but the primary choice remains dominant.

## Shot 6: Time Investment Modal

Capture the modal where the player commits time to training, work, travel, recovery, or another activity.

Acceptance questions:

- First eye target: does attention land on the activity, time amount, and expected delta?
- Game vs debug: does the modal feel like committing to an in-world activity, not editing a numeric config row?
- Repetition: is time cost not repeated in header, body, chip, footer, and button unless each has a distinct role?
- Character fit: if the stage remains visible behind the modal, are characters dimmed but not erased by a large flat plate?
- CTA: is the commit action specific, such as train 2 hours, rest 1 hour, start patrol, or cancel?

Pass bar:

- The modal is focused and does not swallow the whole stage on desktop.
- The primary cost and expected outcome are visible before clicking.
- Cancel and confirm are both reachable and visually distinct.

## Shot 7: Mobile, 390x844

Capture the same core flow on a 390x844 viewport. Prefer a state with a scene, character, result or choice, and bottom navigation visible.

Acceptance questions:

- First eye target: does the current scene beat remain first, not the bottom bar or a full-screen wall of cards?
- Game vs debug: does the mobile layout still feel like a playable scene instead of a compressed desktop dashboard?
- Repetition: are long descriptions, histories, and reward details folded so the same idea is not stacked repeatedly?
- Character fit: are characters large enough to read, grounded, and not clipped by panels or viewport edges?
- CTA: is the important action above the bottom bar, large enough to tap, and not hidden after scrolling?

Pass bar:

- No horizontal overflow.
- The bottom navigation remains visible or has a clear safe replacement.
- Primary tap targets remain reachable and visually distinct.
- Long text is shortened, paged, or folded without losing the current choice.

## Review Method

1. Capture the seven shots listed above.
2. For each shot, write one line for first eye target, one line for game feel, one line for repetition, one line for character integration, and one line for CTA clarity.
3. Mark any hard fail immediately.
4. If no hard fail exists, mark pass only when all acceptance questions are answered positively enough for a player to act without developer context.

## Expected Output For QA

For each screenshot, QA should report:

- `PASS` or `FAIL`.
- The first visual target.
- Any hard fail condition observed.
- One highest-priority fix if failing.
- Whether desktop/tablet/mobile risks remain.
