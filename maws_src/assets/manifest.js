const entry = (src, meta = {}) => {
  const { w, h, type, transparent, anchor, pixelArt, ...rest } = meta;
  return {
    src,
    path: src,
    type: type || 'image',
    kind: src.endsWith('.svg') ? 'svg' : 'image',
    width: w ?? rest.width,
    height: h ?? rest.height,
    transparent: Boolean(transparent),
    anchor: anchor || null,
    pixelArt: Boolean(pixelArt),
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
  tags: [...tags, 'city-map', 'imagegen']
});

const pixelBackground = (file, tags = []) => entry(`assets/imagegen_pixel/backgrounds/${file}`, {
  pixelArt: true,
  tags: [...tags, 'pixel']
});

const cleanCharacter = (file, tags = []) => entry(`assets/imagegen_pixel/characters_clean/${file}`, {
  w: 512,
  h: 768,
  transparent: true,
  anchor: { x: 0.5, y: 1 },
  pixelArt: true,
  tags: [...tags, 'cleaned', 'pixel']
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

export const ASSET_MANIFEST = {
  backgrounds: {
    'bg.city.map.day': cityMap('bg_city_map_day.png', ['day', 'shenzhen']),
    'bg.city.map.night': cityMap('bg_city_map_night.png', ['night', 'shenzhen']),
    'bg.metro_station.day': cityMap('bg_city_map_day.png', ['metro_station', 'day', 'fallback', 'city-map']),
    'bg.metro_station.night': cityMap('bg_city_map_night.png', ['metro_station', 'night', 'fallback', 'city-map']),
    'bg.home.day': shenzhenDay('bg_home_sun.png', ['home']),
    'bg.home.night': pixelBackground('bg_home_night.png', ['home', 'night']),
    'bg.store.day': shenzhenDay('bg_store_sun.png', ['store']),
    'bg.store.night': pixelBackground('bg_store_rain.png', ['store', 'night', 'rain']),
    'bg.store.rain': pixelBackground('bg_store_rain.png', ['store', 'rain']),
    'bg.worksite.day': shenzhenDay('bg_worksite_sun.png', ['worksite']),
    'bg.worksite.night': pixelBackground('bg_worksite_dusk.png', ['worksite', 'night', 'dusk']),
    'bg.worksite.dusk': pixelBackground('bg_worksite_dusk.png', ['worksite', 'dusk']),
    'bg.park.day': shenzhenDay('bg_park_sun.png', ['park']),
    'bg.park.night': pixelBackground('bg_park_day.png', ['park', 'night', 'fallback']),
    'bg.boxing.day': shenzhenDay('bg_boxing_sun.png', ['boxing']),
    'bg.boxing.night': pixelBackground('bg_boxing_night.png', ['boxing', 'night']),
    'bg.wuguan.day': shenzhenDay('bg_wuguan_sun.png', ['wuguan']),
    'bg.wuguan.night': pixelBackground('bg_wuguan_day.png', ['wuguan', 'night', 'fallback']),
    'bg.mma.day': shenzhenDay('bg_mma_sun.png', ['mma']),
    'bg.mma.night': pixelBackground('bg_mma_night.png', ['mma', 'night']),
    'bg.gym.day': shenzhenDay('bg_gym_sun.png', ['gym']),
    'bg.gym.night': pixelBackground('bg_gym_day.png', ['gym', 'night', 'fallback']),
    'bg.physio.day': shenzhenDay('bg_physio_sun.png', ['physio']),
    'bg.physio.night': pixelBackground('bg_physio_evening.png', ['physio', 'night', 'evening']),
    'bg.physio.evening': pixelBackground('bg_physio_evening.png', ['physio', 'evening']),
    'bg.street.day': shenzhenDay('bg_street_sun.png', ['street']),
    'bg.street.night': pixelBackground('bg_street_night.png', ['street', 'night'])
  },
  characters: {
    'fighter.player': cleanCharacter('fighter_player.png', ['player', 'standing']),
    'fighter.enemy.boxer': cleanCharacter('fighter_enemy_boxer.png', ['enemy', 'boxing']),
    'fighter.enemy.grappler': cleanCharacter('fighter_enemy_grappler.png', ['enemy', 'grappling']),
    'fighter.enemy.weapon': cleanCharacter('fighter_enemy_weapon.png', ['enemy', 'weapon']),
    'fighter.enemy.boss': cleanCharacter('fighter_enemy_boss.png', ['enemy', 'boss']),
    'scene.npc.fatty': cleanCharacter('scene_npc_fatty.png', ['scene', 'npc', 'fatty', 'home']),
    'scene.npc.xiaoman': cleanCharacter('scene_npc_xiaoman.png', ['scene', 'npc', 'xiaoman', 'store']),
    'scene.npc.worker': cleanCharacter('scene_npc_worker.png', ['scene', 'npc', 'worker', 'worksite']),
    'scene.npc.coach': cleanCharacter('scene_npc_coach.png', ['scene', 'npc', 'coach', 'boxing']),
    'scene.npc.master': cleanCharacter('scene_npc_master.png', ['scene', 'npc', 'master', 'wuguan']),
    'scene.npc.gymcoach': cleanCharacter('scene_npc_gymcoach.png', ['scene', 'npc', 'gym', 'coach']),
    'scene.npc.physio': cleanCharacter('scene_npc_physio.png', ['scene', 'npc', 'physio']),
    'scene.npc.chen': cleanCharacter('scene_npc_chen.png', ['scene', 'npc', 'chen', 'boss'])
  },
  sprites: {
    'anim.fighter.player': fighterSprite('anim_fighter_player.png', 'fighter.player', ['player']),
    'anim.fighter.enemy.boxer': fighterSprite('anim_fighter_enemy_boxer.png', 'fighter.enemy.boxer', ['enemy', 'boxing']),
    'anim.fighter.enemy.grappler': fighterSprite('anim_fighter_enemy_grappler.png', 'fighter.enemy.grappler', ['enemy', 'grappling']),
    'anim.fighter.enemy.weapon': fighterSprite('anim_fighter_enemy_weapon.png', 'fighter.enemy.weapon', ['enemy', 'weapon']),
    'anim.fighter.enemy.boss': fighterSprite('anim_fighter_enemy_boss.png', 'fighter.enemy.boss', ['enemy', 'boss'])
  },
  portraits: {
    'portrait.player': entry('assets/imagegen_pixel/portraits/portrait_player.png', { w: 512, h: 512, pixelArt: true, tags: ['player', 'pixel'] }),
    'portrait.fatty': entry('assets/imagegen_pixel/portraits/portrait_fatty.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'pixel'] }),
    'portrait.coach': entry('assets/imagegen_pixel/portraits/portrait_coach.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'coach', 'pixel'] }),
    'portrait.master': entry('assets/imagegen_pixel/portraits/portrait_master.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'master', 'pixel'] }),
    'portrait.xiaoman': entry('assets/imagegen_pixel/portraits/portrait_xiaoman.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'store', 'pixel'] }),
    'portrait.chen': entry('assets/imagegen_pixel/portraits/portrait_chen.png', { w: 512, h: 512, pixelArt: true, tags: ['npc', 'boss', 'pixel'] }),
    'portrait.enemy.boxer': entry('assets/imagegen_pixel/portraits/portrait_enemy_boxer.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'boxing', 'pixel'] }),
    'portrait.enemy.grappler': entry('assets/imagegen_pixel/portraits/portrait_enemy_grappler.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'grappling', 'pixel'] }),
    'portrait.enemy.weapon': entry('assets/imagegen_pixel/portraits/portrait_enemy_weapon.png', { w: 512, h: 512, pixelArt: true, tags: ['enemy', 'weapon', 'pixel'] })
  },
  items: {
    'item.rice': entry('assets/imagegen_pixel/items/item_rice.png', { w: 256, h: 256, pixelArt: true, tags: ['food', 'pixel'] }),
    'item.drink': entry('assets/imagegen_pixel/items/item_drink.png', { w: 256, h: 256, pixelArt: true, tags: ['drink', 'pixel'] }),
    'item.band': entry('assets/imagegen_pixel/items/item_band.png', { w: 256, h: 256, pixelArt: true, tags: ['medicine', 'pixel'] }),
    'item.gloves': entry('assets/imagegen_pixel/items/item_gloves.png', { w: 256, h: 256, pixelArt: true, tags: ['equipment', 'hand', 'pixel'] }),
    'item.shoes': entry('assets/imagegen_pixel/items/item_shoes.png', { w: 256, h: 256, pixelArt: true, tags: ['equipment', 'foot', 'pixel'] }),
    'item.mouth': entry('assets/imagegen_pixel/items/item_mouth.png', { w: 256, h: 256, pixelArt: true, tags: ['equipment', 'head', 'pixel'] }),
    'item.notebook': entry('assets/imagegen_pixel/items/item_notebook.png', { w: 256, h: 256, pixelArt: true, tags: ['equipment', 'accessory', 'pixel'] })
  },
  icons: {
    'icon.money': entry('assets/imagegen_pixel/icons/icon_money.png', { w: 128, h: 128, pixelArt: true, tags: ['resource', 'pixel'] }),
    'icon.fame': entry('assets/imagegen_pixel/icons/icon_fame.png', { w: 128, h: 128, pixelArt: true, tags: ['resource', 'pixel'] }),
    'icon.auth': entry('assets/imagegen_pixel/icons/icon_auth.png', { w: 128, h: 128, pixelArt: true, tags: ['resource', 'pixel'] }),
    'icon.heat': entry('assets/imagegen_pixel/icons/icon_heat.png', { w: 128, h: 128, pixelArt: true, tags: ['resource', 'pixel'] }),
    'icon.fitXp': entry('assets/imagegen_pixel/icons/icon_fitxp.png', { w: 128, h: 128, pixelArt: true, tags: ['resource', 'pixel'] }),
    'icon.hp': entry('assets/imagegen_pixel/icons/icon_hp.png', { w: 128, h: 128, pixelArt: true, tags: ['combat', 'resource', 'pixel'] }),
    'icon.sp': entry('assets/imagegen_pixel/icons/icon_sp.png', { w: 128, h: 128, pixelArt: true, tags: ['combat', 'resource', 'pixel'] }),
    'icon.posture': entry('assets/imagegen_pixel/icons/icon_posture.png', { w: 128, h: 128, pixelArt: true, tags: ['combat', 'resource', 'pixel'] }),
    'icon.nav.map': entry('assets/imagegen_pixel/icons/icon_nav_map.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.profile': entry('assets/imagegen_pixel/icons/icon_nav_profile.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.skills': entry('assets/imagegen_pixel/icons/icon_nav_skills.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.bag': entry('assets/imagegen_pixel/icons/icon_nav_bag.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.shop': entry('assets/imagegen_pixel/icons/icon_nav_shop.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.npc': entry('assets/imagegen_pixel/icons/icon_nav_npc.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.log': entry('assets/imagegen_pixel/icons/icon_nav_log.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] }),
    'icon.nav.check': entry('assets/imagegen_pixel/icons/icon_nav_check.png', { w: 128, h: 128, pixelArt: true, tags: ['nav', 'pixel'] })
  },
  skillCards: {
    'skill.jab': entry('assets/imagegen_pixel/skillCards/skill_jab.png', { w: 384, h: 256, pixelArt: true, tags: ['boxing', 'strike', 'pixel'] }),
    'skill.straight': entry('assets/imagegen_pixel/skillCards/skill_straight.png', { w: 384, h: 256, pixelArt: true, tags: ['boxing', 'strike', 'pixel'] }),
    'skill.guard': entry('assets/imagegen_pixel/skillCards/skill_guard.png', { w: 384, h: 256, pixelArt: true, tags: ['defense', 'pixel'] }),
    'skill.dodge': entry('assets/imagegen_pixel/skillCards/skill_dodge.png', { w: 384, h: 256, pixelArt: true, tags: ['footwork', 'pixel'] }),
    'skill.lowkick': entry('assets/imagegen_pixel/skillCards/skill_lowkick.png', { w: 384, h: 256, pixelArt: true, tags: ['mma', 'kick', 'pixel'] }),
    'skill.takedown': entry('assets/imagegen_pixel/skillCards/skill_takedown.png', { w: 384, h: 256, pixelArt: true, tags: ['mma', 'grapple', 'pixel'] }),
    'skill.sprawl': entry('assets/imagegen_pixel/skillCards/skill_sprawl.png', { w: 384, h: 256, pixelArt: true, tags: ['mma', 'defense', 'pixel'] }),
    'skill.palm': entry('assets/imagegen_pixel/skillCards/skill_palm.png', { w: 384, h: 256, pixelArt: true, tags: ['traditional', 'strike', 'pixel'] }),
    'skill.dirtyescape': entry('assets/imagegen_pixel/skillCards/skill_dirtyescape.png', { w: 384, h: 256, pixelArt: true, tags: ['street', 'escape', 'pixel'] })
  },
  ui: {
    'ui.panel.black': entry('assets/imagegen_pixel/ui/ui_panel_black.png', { w: 512, h: 256, pixelArt: true, tags: ['panel', 'pixel'] }),
    'ui.button.red': entry('assets/imagegen_pixel/ui/ui_button_red.png', { w: 384, h: 128, pixelArt: true, tags: ['button', 'pixel'] }),
    'ui.button.dark': entry('assets/imagegen_pixel/ui/ui_button_dark.png', { w: 384, h: 128, pixelArt: true, tags: ['button', 'pixel'] }),
    'ui.badge.warning': entry('assets/imagegen_pixel/ui/ui_badge_warning.png', { w: 192, h: 192, pixelArt: true, tags: ['badge', 'pixel'] }),
    'ui.progress.bar': entry('assets/imagegen_pixel/ui/ui_progress_bar.png', { w: 512, h: 96, pixelArt: true, tags: ['bar', 'pixel'] })
  },
  vfx: {
    'vfx.hit.spark': entry('assets/imagegen_pixel/vfx/vfx_hit_spark.png', { w: 256, h: 256, pixelArt: true, tags: ['combat', 'hit', 'pixel'] }),
    'vfx.guard.flash': entry('assets/imagegen_pixel/vfx/vfx_guard_flash.png', { w: 256, h: 256, pixelArt: true, tags: ['combat', 'guard', 'pixel'] }),
    'vfx.impact.ring': entry('assets/imagegen_pixel/vfx/vfx_impact_ring.png', { w: 256, h: 256, pixelArt: true, tags: ['combat', 'impact', 'pixel'] }),
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

export function assetPath(key) {
  for (const entries of Object.values(ASSET_MANIFEST)) {
    const path = entryPath(entries[key]);
    if (path) return path;
  }
  return null;
}
