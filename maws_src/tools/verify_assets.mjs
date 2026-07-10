import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { ASSET_MANIFEST, PIXEL_ART_CONTRACT, assetPath, flattenManifest } from '../assets/manifest.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const requiredGroups = ['backgrounds', 'characters', 'sprites', 'portraits', 'items', 'icons', 'skillCards', 'ui', 'vfx'];
const requireFinalDay1To9 = process.argv.includes('--require-final-day1-9') || process.env.MAWS_REQUIRE_FINAL_DAY1_9 === '1';
const day1To9FinalKeys = [
  'bg.city.map.day',
  'bg.city.map.night',
  'bg.metro_station.day',
  'bg.metro_station.night',
  'bg.home.day',
  'bg.home.night',
  'bg.store.day',
  'bg.store.night',
  'bg.store.rain',
  'bg.worksite.day',
  'bg.worksite.night',
  'bg.worksite.dusk',
  'bg.park.day',
  'bg.park.night',
  'bg.boxing.day',
  'bg.boxing.night',
  'bg.street.day',
  'bg.street.night',
  'fighter.player',
  'fighter.enemy.untrained',
  'fighter.enemy.beginner',
  'fighter.enemy.silent',
  'scene.npc.fatty',
  'scene.npc.father_memory',
  'scene.npc.xiaoman',
  'scene.npc.worker',
  'scene.npc.coach',
  'anim.fighter.player',
  'anim.fighter.enemy.untrained',
  'anim.fighter.enemy.beginner',
  'anim.fighter.enemy.silent',
  'portrait.player',
  'portrait.father',
  'portrait.fatty',
  'portrait.xiaoman',
  'portrait.worker',
  'portrait.coach',
  'combat.normal',
  'combat.heavy',
  'combat.guard',
  'combat.miss',
  'combat.break',
  'combat.recipe',
  'combat.utility',
  'vfx.scene.click',
  'icon.money',
  'icon.fame',
  'icon.auth',
  'icon.heat',
  'icon.fitXp',
  'icon.hp',
  'icon.sp',
  'icon.posture',
  'icon.nav.map',
  'icon.nav.profile',
  'icon.nav.skills',
  'icon.nav.bag',
  'icon.nav.shop',
  'icon.nav.npc',
  'icon.nav.log',
  'icon.nav.check',
  'item.rice',
  'item.drink',
  'item.band',
  'item.gloves',
  'item.shoes',
  'item.mouth',
  'item.notebook',
  'item.training_kit',
  'item.egg',
  'item.greens',
  'item.noodles',
  'item.home_meal',
  'item.ice_pack',
  'item.pain_gel',
  'skill.wild_swing',
  'skill.push_away',
  'skill.mystic',
  'skill.guard',
  'skill.retreat',
  'skill.talkdown',
  'skill.jab',
  'skill.straight',
  'skill.advance',
  'skill.dodge',
  'skill.lowkick',
  'skill.takedown',
  'skill.sprawl',
  'skill.palm',
  'skill.dirtyescape',
  'skill.recipe.guard_counter',
  'ui.frame.panel',
  'ui.frame.dialogue',
  'ui.frame.tooltip',
  'ui.button.dark',
  'ui.button.active',
  'ui.button.disabled',
  'ui.focus.bracket',
  'ui.bar.frame',
  'ui.choice.cursor',
  'ui.tab.dark',
  'ui.tab.active',
  'ui.note.paper'
];
const legacyKeys = [
  'bg.home.night',
  'bg.store.rain',
  'bg.worksite.dusk',
  'bg.park.day',
  'bg.boxing.night',
  'bg.wuguan.day',
  'bg.mma.night',
  'bg.street.night',
  'fighter.player',
  'fighter.enemy.boxer',
  'fighter.enemy.grappler',
  'fighter.enemy.weapon',
  'fighter.enemy.boss',
  'anim.fighter.player',
  'anim.fighter.enemy.boxer',
  'anim.fighter.enemy.grappler',
  'anim.fighter.enemy.weapon',
  'anim.fighter.enemy.boss',
  'portrait.player',
  'portrait.fatty',
  'portrait.coach',
  'portrait.master',
  'portrait.xiaoman',
  'portrait.chen',
  'portrait.enemy.boxer',
  'portrait.enemy.grappler',
  'portrait.enemy.weapon'
];

const errors = [];
const rows = flattenManifest();
const keys = new Set(rows.map((row) => row.key));

function readPng(file, decode = false) {
  const data = fs.readFileSync(file);
  if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  let offset = 8;
  const idat = [];
  const info = { width: 0, height: 0, bitDepth: 0, colorType: 0, paletteColors: 0, pixels: null };
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString('ascii');
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === 'IHDR') {
      info.width = chunk.readUInt32BE(0);
      info.height = chunk.readUInt32BE(4);
      info.bitDepth = chunk[8];
      info.colorType = chunk[9];
    } else if (type === 'PLTE') {
      info.paletteColors = chunk.length / 3;
    } else if (type === 'IDAT' && decode) {
      idat.push(chunk);
    } else if (type === 'IEND') {
      break;
    }
  }
  if (!decode) return info;
  if (info.bitDepth !== 8 || info.colorType !== 6) return info;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const stride = info.width * bpp;
  const pixels = Buffer.alloc(stride * info.height);
  let src = 0;
  for (let y = 0; y < info.height; y += 1) {
    const filter = raw[src];
    src += 1;
    const rowStart = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bpp ? pixels[rowStart + x - bpp] : 0;
      const up = y > 0 ? pixels[rowStart - stride + x] : 0;
      const upLeft = y > 0 && x >= bpp ? pixels[rowStart - stride + x - bpp] : 0;
      let value = raw[src + x];
      if (filter === 1) value = (value + left) & 255;
      else if (filter === 2) value = (value + up) & 255;
      else if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value = (value + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      } else if (filter !== 0) {
        throw new Error(`unsupported PNG filter ${filter} in ${file}`);
      }
      pixels[rowStart + x] = value;
    }
    src += stride;
  }
  info.pixels = pixels;
  return info;
}

function alphaAt(png, x, y) {
  if (!png?.pixels) return 255;
  return png.pixels[(y * png.width + x) * 4 + 3];
}

function assertSpritesheet(group, key, value, full, src) {
  if (value.type !== 'spritesheet') return;
  if (!Number.isFinite(value.frameWidth) || !Number.isFinite(value.frameHeight)) {
    errors.push(`${group}.${key} missing spritesheet frameWidth/frameHeight`);
    return;
  }
  const png = readPng(full, true);
  if (!png) {
    errors.push(`${group}.${key} is not a PNG: ${src}`);
    return;
  }
  if (value.width && png.width !== value.width) errors.push(`${group}.${key} width mismatch: ${png.width} != ${value.width}`);
  if (value.height && png.height !== value.height) errors.push(`${group}.${key} height mismatch: ${png.height} != ${value.height}`);
  if (png.width % value.frameWidth !== 0 || png.height % value.frameHeight !== 0) {
    errors.push(`${group}.${key} dimensions are not divisible by frame size`);
    return;
  }
  const frames = (png.width / value.frameWidth) * (png.height / value.frameHeight);
  const maxFrame = Math.max(...Object.values(value.animations || {}).map((anim) => Number(anim.end ?? 0)), 0);
  if (frames <= maxFrame) errors.push(`${group}.${key} has ${frames} frames but animation needs ${maxFrame + 1}`);
  if (png.colorType !== 6 || !png.pixels) {
    errors.push(`${group}.${key} must be RGBA PNG for transparent spritesheet checks`);
    return;
  }
  const corners = [
    alphaAt(png, 0, 0),
    alphaAt(png, png.width - 1, 0),
    alphaAt(png, 0, png.height - 1),
    alphaAt(png, png.width - 1, png.height - 1)
  ];
  if (corners.some((alpha) => alpha > 12)) errors.push(`${group}.${key} has non-transparent sheet corners`);
  let opaque = 0;
  let edgeOpaque = 0;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const alpha = alphaAt(png, x, y);
      if (alpha > 24) {
        opaque += 1;
        if (x < 2 || y < 2 || x >= png.width - 2 || y >= png.height - 2) edgeOpaque += 1;
      }
    }
  }
  if (opaque < frames * 64) errors.push(`${group}.${key} appears visually empty`);
  if (edgeOpaque > Math.max(24, Math.floor(opaque * 0.004))) errors.push(`${group}.${key} has possible edge background residue`);
  if (value.status === 'final' && src.startsWith('assets/pixel_v2/')) {
    const size = fs.statSync(full).size;
    if (size > 500 * 1024) errors.push(`${group}.${key} final combat spritesheet exceeds 500KB budget: ${size} bytes`);
    const frameBottom = (frame) => {
      const frameX = (frame % (png.width / value.frameWidth)) * value.frameWidth;
      const frameY = Math.floor(frame / (png.width / value.frameWidth)) * value.frameHeight;
      for (let y = value.frameHeight - 1; y >= 0; y -= 1) {
        for (let x = 0; x < value.frameWidth; x += 1) {
          if (alphaAt(png, frameX + x, frameY + y) > 24) return y;
        }
      }
      return -1;
    };
    Object.entries(value.animations || {}).forEach(([name, animation]) => {
      if (['hurt', 'vfx'].includes(name)) return;
      const bottoms = [];
      for (let frame = Number(animation.start || 0); frame <= Number(animation.end || 0); frame += 1) {
        const bottom = frameBottom(frame);
        if (bottom >= 0) bottoms.push(bottom);
      }
      if (bottoms.length > 1 && Math.max(...bottoms) - Math.min(...bottoms) > 8) {
        errors.push(`${group}.${key} ${name} frames have inconsistent foot baselines: ${bottoms.join(',')}`);
      }
    });
  }
}

function assertPixelContract(group, key, value, src) {
  if (!value.pixelArt) errors.push(`${group}.${key} must declare pixelArt: true`);
  const logical = value.logicalSize;
  if (!logical || !Number.isFinite(logical.width) || logical.width <= 0 || !Number.isFinite(logical.height) || logical.height <= 0) {
    errors.push(`${group}.${key} missing positive logicalSize`);
  }
  if (!value.palette) errors.push(`${group}.${key} missing palette`);
  if (!value.bundle || typeof value.bundle !== 'string') errors.push(`${group}.${key} missing bundle`);
  if (!value.artVersion || typeof value.artVersion !== 'string') errors.push(`${group}.${key} missing artVersion`);
  if (!PIXEL_ART_CONTRACT.statusValues.includes(value.status)) errors.push(`${group}.${key} has invalid status: ${value.status}`);
  if (value.status === 'final' && !src.startsWith('assets/pixel_v2/')) {
    errors.push(`${group}.${key} is final but not versioned under assets/pixel_v2: ${src}`);
  }
}

function assertFinalPixelV2Image(group, key, value, full, src, stat) {
  if (value.status !== 'final' || !src.startsWith('assets/pixel_v2/')) return;
  const transparentSpecs = {
    vfx: { width: 64, height: 64, budget: 64 * 1024, label: 'VFX' },
    icons: { width: 32, height: 32, budget: 32 * 1024, label: 'icon' },
    items: { width: 64, height: 64, budget: 80 * 1024, label: 'item' },
    skillCards: { width: 192, height: 128, budget: 120 * 1024, label: 'skill card' }
  };
  const transparentSpec = group === 'ui'
    ? { width: value.width, height: value.height, budget: 64 * 1024, label: 'UI texture', allowOpaqueCorners: true }
    : transparentSpecs[group];
  if (group !== 'backgrounds' && !transparentSpec) return;

  const png = readPng(full, Boolean(transparentSpec));
  if (!png) return;
  if (transparentSpec) {
    if (png.width !== transparentSpec.width || png.height !== transparentSpec.height) {
      errors.push(`${group}.${key} final ${transparentSpec.label} must be ${transparentSpec.width}x${transparentSpec.height}, got ${png.width}x${png.height}`);
    }
    if (png.colorType !== 6 || !png.pixels) {
      errors.push(`${group}.${key} final ${transparentSpec.label} must be an RGBA PNG`);
      return;
    }
    const corners = [
      alphaAt(png, 0, 0),
      alphaAt(png, png.width - 1, 0),
      alphaAt(png, 0, png.height - 1),
      alphaAt(png, png.width - 1, png.height - 1)
    ];
    if (!transparentSpec.allowOpaqueCorners && corners.some((alpha) => alpha > 12)) {
      errors.push(`${group}.${key} final ${transparentSpec.label} must have transparent corners`);
    }
    if (stat.size > transparentSpec.budget) errors.push(`${group}.${key} final ${transparentSpec.label} exceeds ${Math.round(transparentSpec.budget / 1024)}KB budget: ${stat.size} bytes`);
    return;
  }
  if (png.width !== 480 || png.height !== 270) {
    errors.push(`${group}.${key} final background must be 480x270, got ${png.width}x${png.height}`);
  }
  if (png.colorType !== 3 || png.paletteColors < 1 || png.paletteColors > 32) {
    errors.push(`${group}.${key} final background must be indexed PNG with 1-32 colors`);
  }
  if (stat.size > 180 * 1024) {
    errors.push(`${group}.${key} final background exceeds 180KB budget: ${stat.size} bytes`);
  }
}

for (const group of requiredGroups) {
  if (!ASSET_MANIFEST[group]) errors.push(`missing group: ${group}`);
}

for (const key of legacyKeys) {
  if (!keys.has(key) || !assetPath(key)) errors.push(`missing legacy key: ${key}`);
}

for (const group of requiredGroups) {
  const entries = ASSET_MANIFEST[group] || {};
  for (const [key, value] of Object.entries(entries)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${group}.${key} is not an object entry`);
      continue;
    }
    const src = value.src || value.path;
    if (!src) {
      errors.push(`${group}.${key} missing src/path`);
      continue;
    }
    if (src.includes('://') || src.startsWith('//')) {
      errors.push(`${group}.${key} uses remote path: ${src}`);
      continue;
    }
    const full = path.resolve(root, src);
    const allowedAssetRoots = [
      path.join(root, 'assets', 'generated'),
      path.join(root, 'assets', 'imagegen_pixel'),
      path.join(root, 'assets', 'imagegen_shenzhen_sun'),
      path.join(root, 'assets', 'imagegen_city_map'),
      path.join(root, 'assets', 'pixel_v2')
    ];
    if (!allowedAssetRoots.some((assetRoot) => full.startsWith(assetRoot))) {
      errors.push(`${group}.${key} points outside allowed asset roots: ${src}`);
      continue;
    }
    if (!fs.existsSync(full)) {
      errors.push(`${group}.${key} missing file: ${src}`);
      continue;
    }
    const stat = fs.statSync(full);
    if (stat.size <= 0) errors.push(`${group}.${key} is empty: ${src}`);
    if (src.endsWith('.png')) {
      const png = readPng(full, false);
      if (!png) errors.push(`${group}.${key} is not a PNG: ${src}`);
      else if (png.width <= 0 || png.height <= 0) errors.push(`${group}.${key} has invalid PNG dimensions: ${src}`);
    }
    assertPixelContract(group, key, value, src);
    assertFinalPixelV2Image(group, key, value, full, src, stat);
    assertSpritesheet(group, key, value, full, src);
  }
}

if (requireFinalDay1To9) {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]));
  day1To9FinalKeys.forEach((key) => {
    const row = rowsByKey.get(key);
    if (!row) {
      errors.push(`Day1-9 final art key missing: ${key}`);
      return;
    }
    if (row.entry.status !== 'final') errors.push(`Day1-9 art is not final: ${key} (${row.entry.status})`);
    if (!row.path.startsWith('assets/pixel_v2/')) errors.push(`Day1-9 final art is outside assets/pixel_v2: ${key}`);
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`verified ${rows.length} manifest entries across ${requiredGroups.length} required groups`);
