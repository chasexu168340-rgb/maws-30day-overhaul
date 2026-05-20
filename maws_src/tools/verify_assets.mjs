import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { ASSET_MANIFEST, assetPath, flattenManifest } from '../assets/manifest.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const requiredGroups = ['backgrounds', 'characters', 'sprites', 'portraits', 'items', 'icons', 'skillCards', 'ui', 'vfx'];
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
  const info = { width: 0, height: 0, bitDepth: 0, colorType: 0, pixels: null };
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
      path.join(root, 'assets', 'imagegen_city_map')
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
    assertSpritesheet(group, key, value, full, src);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`verified ${rows.length} manifest entries across ${requiredGroups.length} required groups`);
