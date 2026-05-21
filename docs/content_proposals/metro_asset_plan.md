# Metro Asset Plan

> 资产计划。当前只接 fallback manifest key，不新增实体图片，不代表最终地铁站资产完成。

## Current Finding

- `metro_station` 已在地点数据里存在。
- 当前 `LOCATION_BACKGROUND_KEYS` 里还没有 `metro_station` 映射，本窗口不改 `state.js`。
- `ASSET_MANIFEST` 现在新增：
  - `bg.metro_station.day`
  - `bg.metro_station.night`
- 两个 key 暂时复用 city map day/night 图，tag 标记 `fallback` 和 `city-map`，不是最终地铁站背景。

## Minimal Visual Bridge

- 短期：后续 runtime 接入时可把 `metro_station.day/night` 指到 `bg.metro_station.day/night`，先避免无明确资产 key。
- 中期：地铁站 scene cast 可使用 token 方案，不需要马上生成站务员/乘客立绘。
- 长期：正式资产应替换 fallback，不应继续使用城市地图当地点背景。

## Proposed Marker

- 当前 `LOC_POS.metro_station` 已在数据层存在，建议城市图 marker 继续放在中西部换乘感强的位置。
- 如果后续改 `CITY_MAP_MARKERS`，建议坐标约 `x: 34-38, y: 50-58`，让它和便利店、公园、拳馆之间形成早期通勤三角。

## Scene Cast Suggestion

- `station_staff`：站务员，token 即可，负责秩序和现实边界。
- `commuter`：通勤乘客，token 即可，制造拥挤和误会。
- `phone_witness`：举手机围观的人，token 即可，用于热度/舆论反馈。

## Final Asset Requirements

- 日景地铁站背景：闸机、站台导向牌、人流压迫感、深圳城市质感。
- 夜景地铁站背景：冷色灯管、末班车感、地面反光。
- 规格沿用现有背景基准：1672x941。
- 风格沿用当前 pixel/imagegen 背景，不要突然变成写实照片。
- 需要可读空间：左/右侧保留角色站位，中间留信息 UI 遮挡安全区。
