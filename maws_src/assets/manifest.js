export const PIXEL_ART_CONTRACT = Object.freeze({
  baseResolution: Object.freeze({ width: 480, height: 270 }),
  palette: 'maws-urban-32',
  artVersion: 'legacy-v1',
  statusValues: Object.freeze(['final', 'fallback', 'legacy'])
});

const logicalSizeFor = (src, type) => {
  if (type === 'spritesheet' || src.includes('/sprites/')) return { width: 96, height: 144, unit: 'frame' };
  if (src.includes('/backgrounds/') || src.includes('/imagegen_city_map/')) return { width: 480, height: 270, unit: 'scene' };
  if (src.includes('/characters_clean/')) return { width: 96, height: 144, unit: 'standee' };
  if (src.includes('/portraits/')) return { width: 96, height: 96, unit: 'portrait' };
  if (src.includes('/skillCards/')) return { width: 192, height: 128, unit: 'card' };
  if (src.includes('/items/')) return { width: 64, height: 64, unit: 'icon' };
  if (src.includes('/icons/')) return { width: 32, height: 32, unit: 'icon' };
  if (src.includes('/vfx/')) return { width: 64, height: 64, unit: 'effect' };
  if (src.includes('/ui/')) return { width: 128, height: 64, unit: 'ui' };
  return { width: 32, height: 32, unit: 'pixel' };
};

const bundleFor = (src, tags = []) => {
  const locations = ['home', 'metro_station', 'store', 'worksite', 'park', 'boxing', 'wuguan', 'mma', 'gym', 'physio', 'street'];
  const location = locations.find((id) => tags.includes(id));
  if (location) return `location:${location}`;
  if (src.includes('/imagegen_city_map/') || tags.includes('city-map')) return 'core:city';
  if (tags.includes('player') || tags.includes('nav') || tags.includes('resource') || src.includes('/ui/')) return 'core';
  if (tags.includes('enemy') || tags.includes('combat') || src.includes('/sprites/') || src.includes('/vfx/')) return 'combat:shared';
  if (src.includes('/portraits/')) return 'dialogue';
  if (src.includes('/skillCards/')) return 'skills';
  if (src.includes('/items/')) return 'inventory';
  return 'core';
};

const entry = (src, meta = {}) => {
  const {
    w,
    h,
    type,
    transparent,
    anchor,
    pixelArt,
    logicalSize,
    palette,
    bundle,
    artVersion,
    status,
    tags = [],
    ...rest
  } = meta;
  const resolvedPixelArt = Boolean(pixelArt);
  return {
    src,
    path: src,
    type: type || 'image',
    kind: src.endsWith('.svg') ? 'svg' : 'image',
    width: w ?? rest.width,
    height: h ?? rest.height,
    transparent: Boolean(transparent),
    anchor: anchor || null,
    pixelArt: resolvedPixelArt,
    logicalSize: logicalSize || logicalSizeFor(src, type),
    palette: palette || (resolvedPixelArt ? PIXEL_ART_CONTRACT.palette : null),
    bundle: bundle || bundleFor(src, tags),
    artVersion: artVersion || (src.includes('/pixel_v2/') ? 'pixel-v2' : PIXEL_ART_CONTRACT.artVersion),
    status: status || (src.includes('/pixel_v2/') ? 'final' : tags.includes('fallback') ? 'fallback' : 'legacy'),
    tags,
    ...rest
  };
};

const shenzhenDay = (file, tags = []) => entry(`assets/imagegen_shenzhen_sun/backgrounds/${file}`, {
  w: 1672,
  h: 941,
  pixelArt: true,
  tags: [...tags, 'day', 'shenzhen', 'pixel']
});

const cityMap = (file, tags = []) => entry(`assets/imagegen_city_map/${file}`, {
  w: 1672,
  h: 941,
  pixelArt: true,
  tags: [...tags, 'city-map', 'imagegen']
});

const pixelBackground = (file, tags = []) => entry(`assets/imagegen_pixel/backgrounds/${file}`, {
  pixelArt: true,
  tags: [...tags, 'pixel']
});

const pixelV2Background = (file, tags = []) => entry(`assets/pixel_v2/backgrounds/${file}`, {
  w: 480,
  h: 270,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  tags: [...tags, 'pixel-v2', 'pixel']
});

const cleanCharacter = (file, tags = []) => entry(`assets/imagegen_pixel/characters_clean/${file}`, {
  w: 512,
  h: 768,
  transparent: true,
  anchor: { x: 0.5, y: 1 },
  pixelArt: true,
  tags: [...tags, 'cleaned', 'pixel']
});

const pixelV2Character = (file, tags = []) => entry(`assets/pixel_v2/characters/${file}`, {
  w: 96,
  h: 144,
  transparent: true,
  anchor: { x: 0.5, y: 1 },
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  tags: [...tags, 'pixel-v2', 'pixel']
});

const pixelV2Portrait = (file, tags = []) => entry(`assets/pixel_v2/portraits/${file}`, {
  w: 96,
  h: 96,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  tags: [...tags, 'portrait', 'pixel-v2', 'pixel']
});

const pixelV2Vfx = (file, tags = []) => entry(`assets/pixel_v2/vfx/${file}`, {
  w: 64,
  h: 64,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  bundle: tags.includes('scene') ? 'core' : 'combat:shared',
  tags: [...tags, 'vfx', 'pixel-v2', 'pixel']
});

const pixelV2Icon = (file, tags = []) => entry(`assets/pixel_v2/icons/${file}`, {
  w: 32,
  h: 32,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  bundle: 'core',
  tags: [...tags, 'icon', 'pixel-v2', 'pixel']
});

const pixelV2Item = (file, tags = []) => entry(`assets/pixel_v2/items/${file}`, {
  w: 64,
  h: 64,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  bundle: 'inventory',
  tags: [...tags, 'item', 'pixel-v2', 'pixel']
});

const pixelV2SkillCard = (file, tags = []) => entry(`assets/pixel_v2/skillCards/${file}`, {
  w: 192,
  h: 128,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  bundle: 'skills',
  tags: [...tags, 'skill-card', 'pixel-v2', 'pixel']
});

const pixelV2Ui = (file, width, height, tags = []) => entry(`assets/pixel_v2/ui/${file}`, {
  w: width,
  h: height,
  transparent: true,
  pixelArt: true,
  artVersion: 'pixel-v2',
  status: 'final',
  bundle: 'core',
  tags: [...tags, 'ui-texture', 'pixel-v2', 'pixel']
});

const fighterSprite = (file, sourceKey, tags = []) => entry(`assets/imagegen_pixel/sprites/${file}`, {
  type: 'spritesheet',
  kind: 'spritesheet',
  w: 3072,
  h: 288,
  frameWidth: 192,
  frameHeight: 288,
  transparent: true,
  anchor: { x: 0.5, y: 1 },
  pixelArt: true,
  sourceKey,
  replaceable: true,
  animations: {
    idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
    attack: { start: 4, end: 8, frameRate: 14, repeat: 0 },
    hurt: { start: 9, end: 12, frameRate: 12, repeat: 0 },
    vfx: { start: 13, end: 15, frameRate: 13, repeat: 0 }
  },
  tags: [...tags, 'combat', 'sprite-strip', 'replaceable-base', 'pixel']
});

const pixelV2FighterSprite = (file, sourceKey, tags = [], displayScale = 1, extraAnimations = {}, frameWidth = 96) => {
  const frameCount = Math.max(16, ...Object.values(extraAnimations).map((animation) => Number(animation?.end || 0) + 1));
  return entry(`assets/pixel_v2/sprites/${file}`, {
  type: 'spritesheet',
  kind: 'spritesheet',
  w: frameWidth * frameCount,
  h: 144,
  frameWidth,
  frameHeight: 144,
  displayScale,
  transparent: true,
  anchor: { x: 0.5, y: 1 },
  pixelArt: true,
  sourceKey,
  logicalSize: { width: frameWidth, height: 144, unit: 'frame' },
  artVersion: 'pixel-v2',
  status: 'final',
  animations: {
    idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
    attack: { start: 4, end: 7, frameRate: 8, repeat: 0 },
    hurt: { start: 8, end: 11, frameRate: 8, repeat: 0 },
    vfx: { start: 12, end: 15, frameRate: 7, repeat: 0 },
    ...extraAnimations
  },
  tags: [...tags, 'combat', 'sprite-strip', 'pixel-v2', 'pixel']
});
};

const FULL_MOTION_28 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 7, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  heavy: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  guard: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  hurt: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  vfx: { start: 12, end: 15, frameRate: 7, repeat: 0 }
});

const GRAPPLER_MOTION_28 = Object.freeze({
  ...FULL_MOTION_28,
  entry: { start: 4, end: 7, frameRate: 6, repeat: 0 },
  shot: { start: 8, end: 11, frameRate: 6, repeat: 0 },
  takedown: { start: 12, end: 15, frameRate: 6, repeat: 0 },
  control: { start: 12, end: 15, frameRate: 6, repeat: 0 },
  sprawl: { start: 16, end: 19, frameRate: 6, repeat: 0 },
  escape: { start: 24, end: 27, frameRate: 6, repeat: 0 }
});

const PLAYER_MOTION_36 = Object.freeze({
  ...FULL_MOTION_28,
  fall: { start: 28, end: 31, frameRate: 6, repeat: 0 },
  grounded: { start: 31, end: 31, frameRate: 1, repeat: -1 },
  recover: { start: 32, end: 35, frameRate: 6, repeat: 0 }
});

const WEAPON_MOTION_28 = Object.freeze({
  ...FULL_MOTION_28,
  threat: { start: 4, end: 7, frameRate: 6, repeat: 0 },
  swing: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  smash: { start: 12, end: 15, frameRate: 6, repeat: 0 },
  recover: { start: 16, end: 19, frameRate: 6, repeat: 0 },
  disengage: { start: 24, end: 27, frameRate: 6, repeat: 0 }
});

const BOSS_MOTION_36 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 6, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  boxing: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  frontkick: { start: 12, end: 15, frameRate: 6, repeat: 0 },
  vfx: { start: 12, end: 15, frameRate: 6, repeat: 0 },
  entry: { start: 16, end: 19, frameRate: 6, repeat: 0 },
  clinch: { start: 16, end: 19, frameRate: 6, repeat: 0 },
  heavy: { start: 20, end: 23, frameRate: 6, repeat: 0 },
  takedown: { start: 20, end: 23, frameRate: 6, repeat: 0 },
  guard: { start: 0, end: 3, frameRate: 5, repeat: 0 },
  sprawl: { start: 24, end: 27, frameRate: 6, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 6, repeat: 0 },
  retreat: { start: 32, end: 35, frameRate: 6, repeat: 0 },
  escape: { start: 32, end: 35, frameRate: 6, repeat: 0 }
});

const BOXER_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 7, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  jab: { start: 8, end: 11, frameRate: 9, repeat: 0 },
  straight: { start: 12, end: 15, frameRate: 8, repeat: 0 },
  heavy: { start: 12, end: 15, frameRate: 8, repeat: 0 },
  lowkick: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  vfx: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  guard: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  dodge: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 7, repeat: 0 }
});

const SANDA_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 7, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  boxing: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  roundkick: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  heavy: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  frontkick: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  vfx: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  sprawl: { start: 20, end: 23, frameRate: 6, repeat: 0 },
  guard: { start: 0, end: 3, frameRate: 5, repeat: 0 },
  dodge: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 7, repeat: 0 }
});

const KARATE_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 7, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  reversepunch: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  heavy: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  frontkick: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  vfx: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  guard: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  recover: { start: 20, end: 23, frameRate: 6, repeat: 0 },
  dodge: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 7, repeat: 0 }
});

const TAEKWONDO_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 6, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 8, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  roundhouse: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  backkick: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  heavy: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  frontkick: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  vfx: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  recover: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  guard: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  dodge: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 7, repeat: 0 }
});

const DIRTYMIX_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  guard: { start: 0, end: 3, frameRate: 5, repeat: 0 },
  advance: { start: 4, end: 7, frameRate: 7, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  overhand: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  straight: { start: 8, end: 11, frameRate: 7, repeat: 0 },
  lowkick: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  vfx: { start: 12, end: 15, frameRate: 7, repeat: 0 },
  grip: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  entry: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  takedown: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  heavy: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  disengage: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  escape: { start: 24, end: 27, frameRate: 7, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 7, repeat: 0 }
});

const PUSHHANDS_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  guard: { start: 0, end: 3, frameRate: 5, repeat: 0 },
  advance: { start: 4, end: 7, frameRate: 8, repeat: 0 },
  grip: { start: 8, end: 11, frameRate: 9, repeat: 0 },
  entry: { start: 8, end: 11, frameRate: 9, repeat: 0 },
  offbalance: { start: 12, end: 15, frameRate: 9, repeat: 0 },
  redirect: { start: 12, end: 15, frameRate: 9, repeat: 0 },
  palm: { start: 16, end: 19, frameRate: 10, repeat: 0 },
  attack: { start: 16, end: 19, frameRate: 10, repeat: 0 },
  heavy: { start: 16, end: 19, frameRate: 10, repeat: 0 },
  yield: { start: 20, end: 23, frameRate: 8, repeat: 0 },
  disengage: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  escape: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 8, repeat: 0 }
});

const STRONGMAN_MOTION_32 = Object.freeze({
  idle: { start: 0, end: 3, frameRate: 5, repeat: -1 },
  advance: { start: 4, end: 7, frameRate: 8, repeat: 0 },
  attack: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  straight: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  heavy: { start: 8, end: 11, frameRate: 8, repeat: 0 },
  lowkick: { start: 12, end: 15, frameRate: 8, repeat: 0 },
  guard: { start: 16, end: 19, frameRate: 7, repeat: 0 },
  fatigue: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  recover: { start: 20, end: 23, frameRate: 7, repeat: 0 },
  retreat: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  disengage: { start: 24, end: 27, frameRate: 8, repeat: 0 },
  hurt: { start: 28, end: 31, frameRate: 8, repeat: 0 }
});

export const ASSET_MANIFEST = {
  backgrounds: {
    'bg.city.map.day': pixelV2Background('bg_city_map_day.png', ['day', 'shenzhen', 'city-map']),
    'bg.city.map.night': pixelV2Background('bg_city_map_night.png', ['night', 'shenzhen', 'city-map']),
    'bg.metro_station.day': pixelV2Background('bg_metro_station_day.png', ['metro_station', 'day']),
    'bg.metro_station.night': pixelV2Background('bg_metro_station_night.png', ['metro_station', 'night']),
    'bg.home.day': pixelV2Background('bg_home_day.png', ['home', 'day']),
    'bg.home.night': pixelV2Background('bg_home_night.png', ['home', 'night']),
    'bg.store.day': pixelV2Background('bg_store_day.png', ['store', 'day']),
    'bg.store.night': pixelV2Background('bg_store_rain.png', ['store', 'night', 'rain']),
    'bg.store.rain': pixelV2Background('bg_store_rain.png', ['store', 'rain']),
    'bg.worksite.day': pixelV2Background('bg_worksite_day.png', ['worksite', 'day']),
    'bg.worksite.night': pixelV2Background('bg_worksite_dusk.png', ['worksite', 'night', 'dusk']),
    'bg.worksite.dusk': pixelV2Background('bg_worksite_dusk.png', ['worksite', 'dusk']),
    'bg.park.day': pixelV2Background('bg_park_day.png', ['park', 'day']),
    'bg.park.night': pixelV2Background('bg_park_night.png', ['park', 'night']),
    'bg.boxing.day': pixelV2Background('bg_boxing_day.png', ['boxing', 'day']),
    'bg.boxing.night': pixelV2Background('bg_boxing_night.png', ['boxing', 'night']),
    'bg.sanda_gym.day': pixelV2Background('bg_sanda_gym_day.png', ['sanda_gym', 'day']),
    'bg.sanda_gym.night': pixelV2Background('bg_sanda_gym_night.png', ['sanda_gym', 'night']),
    'bg.karate_dojo.day': pixelV2Background('bg_karate_dojo_day.png', ['karate_dojo', 'day']),
    'bg.karate_dojo.night': pixelV2Background('bg_karate_dojo_night.png', ['karate_dojo', 'night']),
    'bg.taekwondo_club.day': pixelV2Background('bg_taekwondo_club_day.png', ['taekwondo_club', 'day']),
    'bg.taekwondo_club.night': pixelV2Background('bg_taekwondo_club_night.png', ['taekwondo_club', 'night']),
    'bg.wuguan.day': shenzhenDay('bg_wuguan_sun.png', ['wuguan']),
    'bg.wuguan.night': pixelBackground('bg_wuguan_day.png', ['wuguan', 'night', 'fallback']),
    'bg.mma.day': shenzhenDay('bg_mma_sun.png', ['mma']),
    'bg.mma.night': pixelBackground('bg_mma_night.png', ['mma', 'night']),
    'bg.gym.day': shenzhenDay('bg_gym_sun.png', ['gym']),
    'bg.gym.night': pixelBackground('bg_gym_day.png', ['gym', 'night', 'fallback']),
    'bg.physio.day': shenzhenDay('bg_physio_sun.png', ['physio']),
    'bg.physio.night': pixelBackground('bg_physio_evening.png', ['physio', 'night', 'evening']),
    'bg.physio.evening': pixelBackground('bg_physio_evening.png', ['physio', 'evening']),
    'bg.street.day': pixelV2Background('bg_street_day.png', ['street', 'day']),
    'bg.street.night': pixelV2Background('bg_street_night.png', ['street', 'night'])
  },
  characters: {
    'fighter.player': pixelV2Character('fighter_player.png', ['player', 'standing', 'scene']),
    'fighter.enemy.boxer': pixelV2Character('fighter_enemy_boxer.png', ['enemy', 'boxing', 'sparring', 'e05']),
    'fighter.enemy.sanda': pixelV2Character('fighter_enemy_sanda.png', ['enemy', 'sanda', 'e08', 'e19']),
    'fighter.enemy.karate': pixelV2Character('fighter_enemy_karate.png', ['enemy', 'karate', 'e20']),
    'fighter.enemy.taekwondo': pixelV2Character('fighter_enemy_taekwondo.png', ['enemy', 'taekwondo', 'e21']),
    'fighter.enemy.dirtymix': pixelV2Character('fighter_enemy_dirtymix.png', ['enemy', 'dirtymix', 'underground', 'e09']),
    'fighter.enemy.pushhands': pixelV2Character('fighter_enemy_pushhands.png', ['enemy', 'pushhands', 'park', 'e02']),
    'fighter.enemy.strongman': pixelV2Character('fighter_enemy_strongman.png', ['enemy', 'strongman', 'brawler', 'e04']),
    'fighter.enemy.untrained': pixelV2Character('fighter_enemy_untrained.png', ['enemy', 'untrained', 'day3', 'e00']),
    'fighter.enemy.beginner': pixelV2Character('fighter_enemy_beginner.png', ['enemy', 'boxing', 'beginner', 'day5']),
    'fighter.enemy.silent': pixelV2Character('fighter_enemy_silent.png', ['enemy', 'boxing', 'silent', 'day8']),
    'fighter.enemy.grappler': pixelV2Character('fighter_enemy_grappler.png', ['enemy', 'grappling', 'e06']),
    'fighter.enemy.weapon': pixelV2Character('fighter_enemy_weapon.png', ['enemy', 'weapon', 'e07']),
    'fighter.enemy.boss': pixelV2Character('fighter_enemy_boss.png', ['enemy', 'boss', 'e18']),
    'scene.npc.fatty': pixelV2Character('scene_npc_fatty.png', ['scene', 'npc', 'fatty', 'home', 'day1']),
    'scene.npc.father_memory': pixelV2Character('scene_npc_father_memory.png', ['scene', 'npc', 'father', 'memory', 'home', 'day1', 'day9']),
    'scene.npc.xiaoman': pixelV2Character('scene_npc_xiaoman.png', ['scene', 'npc', 'xiaoman', 'store', 'day3']),
    'scene.npc.worker': pixelV2Character('scene_npc_worker.png', ['scene', 'npc', 'worker', 'worksite', 'day4']),
    'scene.npc.coach': pixelV2Character('scene_npc_coach.png', ['scene', 'npc', 'coach', 'boxing', 'day9']),
    'scene.npc.master': cleanCharacter('scene_npc_master.png', ['scene', 'npc', 'master', 'wuguan']),
    'scene.npc.gymcoach': cleanCharacter('scene_npc_gymcoach.png', ['scene', 'npc', 'gym', 'coach']),
    'scene.npc.physio': cleanCharacter('scene_npc_physio.png', ['scene', 'npc', 'physio']),
    'scene.npc.chen': cleanCharacter('scene_npc_chen.png', ['scene', 'npc', 'chen', 'boss'])
  },
  sprites: {
    'anim.fighter.player': pixelV2FighterSprite('anim_fighter_player_v3.png', 'fighter.player', ['player', 'full-motion', 'ground-reaction'], 1.28, PLAYER_MOTION_36),
    'anim.fighter.enemy.boxer': pixelV2FighterSprite('anim_fighter_enemy_boxer_v3.png', 'fighter.enemy.boxer', ['enemy', 'boxing', 'sparring', 'e05', 'full-motion'], 1.2, BOXER_MOTION_32),
    'anim.fighter.enemy.sanda': pixelV2FighterSprite('anim_fighter_enemy_sanda_v3.png', 'fighter.enemy.sanda', ['enemy', 'sanda', 'e08', 'e19', 'full-motion'], 1.18, SANDA_MOTION_32),
    'anim.fighter.enemy.karate': pixelV2FighterSprite('anim_fighter_enemy_karate_v3.png', 'fighter.enemy.karate', ['enemy', 'karate', 'e20', 'full-motion'], 1.16, KARATE_MOTION_32),
    'anim.fighter.enemy.taekwondo': pixelV2FighterSprite('anim_fighter_enemy_taekwondo_v3.png', 'fighter.enemy.taekwondo', ['enemy', 'taekwondo', 'e21', 'full-motion', 'long-range'], 0.9, TAEKWONDO_MOTION_32),
    'anim.fighter.enemy.dirtymix': pixelV2FighterSprite('anim_fighter_enemy_dirtymix_v3.png', 'fighter.enemy.dirtymix', ['enemy', 'dirtymix', 'underground', 'e09', 'full-motion', 'hybrid'], 0.92, DIRTYMIX_MOTION_32),
    'anim.fighter.enemy.pushhands': pixelV2FighterSprite('anim_fighter_enemy_pushhands_v3.png', 'fighter.enemy.pushhands', ['enemy', 'pushhands', 'park', 'e02', 'full-motion', 'control'], 1.12, PUSHHANDS_MOTION_32),
    'anim.fighter.enemy.strongman': {
      ...pixelV2FighterSprite('anim_fighter_enemy_strongman_v3.png', 'fighter.enemy.strongman', ['enemy', 'strongman', 'brawler', 'e04', 'full-motion', 'fatigue-read'], 1.22, STRONGMAN_MOTION_32),
      contactScale: 0.10
    },
    'anim.fighter.enemy.untrained': pixelV2FighterSprite('anim_fighter_enemy_untrained_v3.png', 'fighter.enemy.untrained', ['enemy', 'untrained', 'day3', 'e00', 'full-motion'], 1.1, FULL_MOTION_28),
    'anim.fighter.enemy.beginner': pixelV2FighterSprite('anim_fighter_enemy_beginner_v3.png', 'fighter.enemy.beginner', ['enemy', 'boxing', 'beginner', 'day5', 'full-motion'], 1, FULL_MOTION_28),
    'anim.fighter.enemy.silent': pixelV2FighterSprite('anim_fighter_enemy_silent_v3.png', 'fighter.enemy.silent', ['enemy', 'boxing', 'silent', 'day8', 'full-motion'], 0.98, FULL_MOTION_28),
    'anim.fighter.enemy.grappler': pixelV2FighterSprite('anim_fighter_enemy_grappler_v3.png', 'fighter.enemy.grappler', ['enemy', 'grappling', 'e06', 'full-motion'], 1, GRAPPLER_MOTION_28),
    'anim.fighter.enemy.weapon': pixelV2FighterSprite('anim_fighter_enemy_weapon_v3.png', 'fighter.enemy.weapon', ['enemy', 'weapon', 'e07', 'full-motion'], 1, WEAPON_MOTION_28, 128),
    'anim.fighter.enemy.boss': pixelV2FighterSprite('anim_fighter_enemy_boss_v3.png', 'fighter.enemy.boss', ['enemy', 'boss', 'e18', 'full-motion', 'hybrid'], 1, BOSS_MOTION_36, 128)
  },
  portraits: {
    'portrait.player': pixelV2Portrait('portrait_player.png', ['player']),
    'portrait.father': pixelV2Portrait('portrait_father.png', ['npc', 'father', 'memory', 'home', 'day1', 'day9']),
    'portrait.fatty': pixelV2Portrait('portrait_fatty.png', ['npc', 'fatty', 'home', 'day1']),
    'portrait.coach': pixelV2Portrait('portrait_coach.png', ['npc', 'coach', 'boxing', 'day9']),
    'portrait.master': entry('assets/imagegen_pixel/portraits/portrait_master.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'master', 'pixel'] }),
    'portrait.xiaoman': pixelV2Portrait('portrait_xiaoman.png', ['npc', 'xiaoman', 'store', 'day3']),
    'portrait.worker': pixelV2Portrait('portrait_worker.png', ['npc', 'worker', 'worksite', 'day4']),
    'portrait.chen': entry('assets/imagegen_pixel/portraits/portrait_chen.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'boss', 'pixel'] }),
    'portrait.enemy.boxer': entry('assets/imagegen_pixel/portraits/portrait_enemy_boxer.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'boxing', 'pixel'] }),
    'portrait.enemy.grappler': entry('assets/imagegen_pixel/portraits/portrait_enemy_grappler.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'grappling', 'pixel'] }),
    'portrait.enemy.weapon': entry('assets/imagegen_pixel/portraits/portrait_enemy_weapon.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'weapon', 'pixel'] })
  },
  items: {
    'item.rice': pixelV2Item('item_rice.png', ['food', 'store', 'day1-9']),
    'item.drink': pixelV2Item('item_drink.png', ['drink', 'store', 'day1-9']),
    'item.band': pixelV2Item('item_band.png', ['medicine', 'store', 'day1-9']),
    'item.gloves': pixelV2Item('item_gloves.png', ['equipment', 'hand', 'boxing', 'day1-9']),
    'item.shoes': pixelV2Item('item_shoes.png', ['equipment', 'foot', 'day1-9']),
    'item.mouth': pixelV2Item('item_mouth.png', ['equipment', 'head', 'boxing', 'day1-9']),
    'item.notebook': pixelV2Item('item_notebook.png', ['equipment', 'accessory', 'father', 'day1-9']),
    'item.training_kit': pixelV2Item('item_training_kit.png', ['training', 'recovery', 'day1-9']),
    'item.egg': pixelV2Item('item_egg.png', ['ingredient', 'food', 'day1-9']),
    'item.greens': pixelV2Item('item_greens.png', ['ingredient', 'food', 'day1-9']),
    'item.noodles': pixelV2Item('item_noodles.png', ['ingredient', 'food', 'day1-9']),
    'item.home_meal': pixelV2Item('item_home_meal.png', ['prepared-meal', 'combat-prep', 'day1-9']),
    'item.ice_pack': pixelV2Item('item_ice_pack.png', ['medicine', 'recovery', 'combat-prep', 'day1-9']),
    'item.pain_gel': pixelV2Item('item_pain_gel.png', ['medicine', 'recovery', 'day1-9'])
  },
  icons: {
    'icon.money': pixelV2Icon('icon_money.png', ['resource', 'money']),
    'icon.fame': pixelV2Icon('icon_fame.png', ['resource', 'fame']),
    'icon.auth': pixelV2Icon('icon_auth.png', ['resource', 'authenticity']),
    'icon.heat': pixelV2Icon('icon_heat.png', ['resource', 'risk']),
    'icon.fitXp': pixelV2Icon('icon_fitxp.png', ['resource', 'conditioning']),
    'icon.hp': pixelV2Icon('icon_hp.png', ['combat', 'resource', 'health']),
    'icon.sp': pixelV2Icon('icon_sp.png', ['combat', 'resource', 'stamina']),
    'icon.posture': pixelV2Icon('icon_posture.png', ['combat', 'resource', 'posture']),
    'icon.nav.map': pixelV2Icon('icon_nav_map.png', ['nav', 'map']),
    'icon.nav.profile': pixelV2Icon('icon_nav_profile.png', ['nav', 'profile']),
    'icon.nav.skills': pixelV2Icon('icon_nav_skills.png', ['nav', 'skills']),
    'icon.nav.bag': pixelV2Icon('icon_nav_bag.png', ['nav', 'bag']),
    'icon.nav.shop': pixelV2Icon('icon_nav_shop.png', ['nav', 'shop']),
    'icon.nav.npc': pixelV2Icon('icon_nav_npc.png', ['nav', 'npc']),
    'icon.nav.log': pixelV2Icon('icon_nav_log.png', ['nav', 'log']),
    'icon.nav.check': pixelV2Icon('icon_nav_check.png', ['nav', 'check'])
  },
  skillCards: {
    'skill.wild_swing': pixelV2SkillCard('skill_wild_swing.png', ['street', 'strike', 'starter']),
    'skill.push_away': pixelV2SkillCard('skill_push_away.png', ['street', 'utility', 'starter']),
    'skill.mystic': pixelV2SkillCard('skill_mystic.png', ['traditional', 'strike', 'starter']),
    'skill.guard': pixelV2SkillCard('skill_guard.png', ['defense', 'starter']),
    'skill.retreat': pixelV2SkillCard('skill_retreat.png', ['street', 'footwork', 'starter']),
    'skill.talkdown': pixelV2SkillCard('skill_talkdown.png', ['street', 'deescalation', 'starter']),
    'skill.jab': pixelV2SkillCard('skill_jab.png', ['boxing', 'strike', 'day9']),
    'skill.straight': pixelV2SkillCard('skill_straight.png', ['boxing', 'strike', 'day9']),
    'skill.advance': pixelV2SkillCard('skill_advance.png', ['footwork', 'planned']),
    'skill.dodge': pixelV2SkillCard('skill_dodge.png', ['footwork', 'home']),
    'skill.lowkick': pixelV2SkillCard('skill_lowkick.png', ['mma', 'kick']),
    'skill.takedown': pixelV2SkillCard('skill_takedown.png', ['mma', 'grapple']),
    'skill.sprawl': pixelV2SkillCard('skill_sprawl.png', ['mma', 'defense']),
    'skill.palm': pixelV2SkillCard('skill_palm.png', ['traditional', 'strike']),
    'skill.dirtyescape': pixelV2SkillCard('skill_dirtyescape.png', ['street', 'escape']),
    'skill.recipe.guard_counter': pixelV2SkillCard('skill_guard_counter.png', ['recipe', 'guard-counter'])
  },
  ui: {
    'ui.frame.panel': pixelV2Ui('ui_frame_panel.png', 64, 64, ['frame', 'panel']),
    'ui.frame.dialogue': pixelV2Ui('ui_frame_dialogue.png', 64, 64, ['frame', 'dialogue']),
    'ui.frame.tooltip': pixelV2Ui('ui_frame_tooltip.png', 64, 64, ['frame', 'tooltip']),
    'ui.button.dark': pixelV2Ui('ui_button_dark.png', 96, 32, ['button', 'neutral']),
    'ui.button.active': pixelV2Ui('ui_button_active.png', 96, 32, ['button', 'active']),
    'ui.button.disabled': pixelV2Ui('ui_button_disabled.png', 96, 32, ['button', 'disabled']),
    'ui.focus.bracket': pixelV2Ui('ui_focus_bracket.png', 64, 64, ['focus', 'selection']),
    'ui.bar.frame': pixelV2Ui('ui_bar_frame.png', 96, 24, ['bar', 'meter']),
    'ui.choice.cursor': pixelV2Ui('ui_choice_cursor.png', 32, 32, ['choice', 'cursor']),
    'ui.tab.dark': pixelV2Ui('ui_tab_dark.png', 64, 32, ['tab', 'neutral']),
    'ui.tab.active': pixelV2Ui('ui_tab_active.png', 64, 32, ['tab', 'active']),
    'ui.note.paper': pixelV2Ui('ui_note_paper.png', 64, 64, ['note', 'paper']),
    'ui.panel.black': pixelV2Ui('ui_frame_panel.png', 64, 64, ['panel', 'compat']),
    'ui.button.red': pixelV2Ui('ui_button_active.png', 96, 32, ['button', 'active', 'compat']),
    'ui.badge.warning': pixelV2Ui('ui_choice_cursor.png', 32, 32, ['badge', 'warning', 'compat']),
    'ui.progress.bar': pixelV2Ui('ui_bar_frame.png', 96, 24, ['bar', 'progress', 'compat'])
  },
  vfx: {
    'combat.normal': pixelV2Vfx('vfx_combat_normal.png', ['combat', 'hit', 'normal']),
    'combat.heavy': pixelV2Vfx('vfx_combat_heavy.png', ['combat', 'hit', 'heavy']),
    'combat.guard': pixelV2Vfx('vfx_combat_guard.png', ['combat', 'guard']),
    'combat.miss': pixelV2Vfx('vfx_combat_miss.png', ['combat', 'miss']),
    'combat.break': pixelV2Vfx('vfx_combat_break.png', ['combat', 'break']),
    'combat.recipe': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe']),
    'combat.utility': pixelV2Vfx('vfx_combat_utility.png', ['combat', 'utility', 'footwork']),
    'combat.recipe.wild_pressure': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe', 'wild-pressure']),
    'combat.recipe.guard_counter': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe', 'guard-counter']),
    'combat.recipe.cool_exit': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe', 'cool-exit']),
    'combat.recipe.pull_and_tag': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe', 'pull-and-tag']),
    'combat.recipe.boxing_one_two': pixelV2Vfx('vfx_combat_recipe.png', ['combat', 'recipe', 'boxing-one-two']),
    'vfx.scene.click': pixelV2Vfx('vfx_scene_click.png', ['scene', 'interaction', 'click']),
    'vfx.hit.spark': pixelV2Vfx('vfx_combat_normal.png', ['combat', 'hit', 'compat']),
    'vfx.guard.flash': pixelV2Vfx('vfx_combat_guard.png', ['combat', 'guard', 'compat']),
    'vfx.impact.ring': pixelV2Vfx('vfx_combat_break.png', ['combat', 'impact', 'compat']),
    'vfx.sweat.drop': entry('assets/imagegen_pixel/vfx/vfx_sweat_drop.png', { w: 256, h: 256, pixelArt: true, tags: ['training', 'pixel'] })
  },
  fighters: {
    'fighter.player': 'assets/imagegen_pixel/characters_clean/fighter_player.png',
    'fighter.enemy.boxer': 'assets/imagegen_pixel/characters_clean/fighter_enemy_boxer.png',
    'fighter.enemy.grappler': 'assets/imagegen_pixel/characters_clean/fighter_enemy_grappler.png',
    'fighter.enemy.weapon': 'assets/imagegen_pixel/characters_clean/fighter_enemy_weapon.png',
    'fighter.enemy.boss': 'assets/imagegen_pixel/characters_clean/fighter_enemy_boss.png'
  }
};

export const LEGACY_ASSET_ALIASES = {
  fighters: {
    'fighter.player': 'characters',
    'fighter.enemy.boxer': 'characters',
    'fighter.enemy.grappler': 'characters',
    'fighter.enemy.weapon': 'characters',
    'fighter.enemy.boss': 'characters'
  }
};

function entryPath(value) {
  if (typeof value === 'string') return value;
  return value?.src || value?.path || null;
}

export function flattenManifest(manifest = ASSET_MANIFEST) {
  const seen = new Set();
  const rows = [];
  Object.entries(manifest).forEach(([group, entries]) => {
    Object.entries(entries).forEach(([key, value]) => {
      const path = entryPath(value);
      if (!path || seen.has(key)) return;
      seen.add(key);
      rows.push({ group, key, path, entry: value });
    });
  });
  return rows;
}

export function manifestEntriesForBundle(bundle, manifest = ASSET_MANIFEST) {
  return flattenManifest(manifest).filter(({ entry: asset }) => asset.bundle === bundle);
}

export function assetEntry(key) {
  for (const entries of Object.values(ASSET_MANIFEST)) {
    if (entries[key]) return entries[key];
  }
  return null;
}

export function assetPath(key) {
  return entryPath(assetEntry(key));
}
