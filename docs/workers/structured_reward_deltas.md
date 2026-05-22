# Structured Reward Deltas

## Goal

Stop modal reward chips from parsing long narrative strings. State now emits structured `rewardDeltas` next to existing `lines`, `summary`, `gain`, and `cost` fields.

## Shape

```js
{ key, label, value, delta, kind, icon, tone, priority, source }
```

Supported `kind` values used by the state layer include `money`, `sp`, `hp`, `calm`, `morale`, `relation`, `skill`, `maw`, `risk`, `item`, and `time`.

## Coverage

- Normal action settlement and event-notebook action resolution.
- Event-notebook shop and dialogue resolution.
- Training minigame settlement.
- Travel settlement.
- Battle result and post-battle review settlement.
- Item use settlement.

`lead` is kept to one short result sentence. Existing `lines` and `summary` remain available for older UI paths.
