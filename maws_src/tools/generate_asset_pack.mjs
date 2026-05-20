import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const outDir = path.join(root, 'assets', 'generated');
fs.mkdirSync(outDir, { recursive: true });

function save(name, svg) {
  fs.writeFileSync(path.join(outDir, name), svg.trimStart(), 'utf8');
}

function frame(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="drop"><feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#050505" flood-opacity=".9"/></filter>
    <pattern id="grain" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 8 L24 2 M0 22 L24 15" stroke="#fff" stroke-opacity=".06" stroke-width="2"/></pattern>
  </defs>
  ${body}
  <rect width="${width}" height="${height}" fill="url(#grain)" opacity=".7"/>
</svg>`;
}

function itemCard(title, accent, glyph) {
  return frame(256, 256, `<rect width="256" height="256" fill="#111217"/>
  <path d="M0 0 L256 0 L220 40 L0 70 Z" fill="#050505"/><path d="M0 256 L60 205 L256 230 L256 256 Z" fill="#050505"/>
  <g filter="url(#drop)"><rect x="44" y="46" width="168" height="164" rx="16" fill="#1d2027" stroke="#050505" stroke-width="10"/>
  <circle cx="128" cy="125" r="54" fill="${accent}" stroke="#050505" stroke-width="9"/>
  <text x="128" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="900" fill="#050505">${glyph}</text>
  <path d="M64 199 L190 181" stroke="${accent}" stroke-width="9"/></g>
  <title>${title}</title>`);
}

function icon(title, accent, glyph) {
  return frame(128, 128, `<rect width="128" height="128" fill="#101014"/>
  <g filter="url(#drop)"><polygon points="18,24 90,10 114,72 62,116 10,88" fill="${accent}" stroke="#050505" stroke-width="8"/>
  <text x="64" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="900" fill="#050505">${glyph}</text></g>
  <title>${title}</title>`);
}

function skill(title, accent, shape) {
  const motif = {
    fist: '<path d="M86 146 L142 92 L194 122 L162 190 L96 192 Z" fill="#f1d1a2" stroke="#050505" stroke-width="12"/><rect x="178" y="98" width="112" height="54" rx="24" fill="#f1d1a2" stroke="#050505" stroke-width="12"/>',
    guard: '<path d="M98 188 C96 82 288 70 290 188 C238 154 154 154 98 188 Z" fill="#d6d6d6" stroke="#050505" stroke-width="12"/>',
    foot: '<path d="M92 166 C150 142 214 146 302 174 L290 214 C204 206 136 208 82 194 Z" fill="#f1d1a2" stroke="#050505" stroke-width="12"/>',
    grapple: '<path d="M92 134 C150 70 258 70 312 136 M118 170 C170 220 244 220 292 170" fill="none" stroke="#f1d1a2" stroke-width="28" stroke-linecap="round"/>'
  }[shape] || '<circle cx="192" cy="132" r="64" fill="#f1d1a2" stroke="#050505" stroke-width="12"/>';
  return frame(384, 256, `<rect width="384" height="256" fill="#111217"/>
  <path d="M0 0 L384 0 L336 54 L0 92 Z" fill="#050505"/><path d="M0 256 L88 200 L384 218 L384 256 Z" fill="#050505"/>
  <g filter="url(#drop)">${motif}<path d="M42 54 L340 32" stroke="${accent}" stroke-width="10"/><path d="M52 218 L306 186" stroke="${accent}" stroke-width="8"/></g>
  <title>${title}</title>`);
}

function uiAsset(title, accent, variant) {
  if (variant === 'badge') {
    return frame(192, 192, `<rect width="192" height="192" fill="#101014"/><g filter="url(#drop)"><path d="M96 12 L120 68 L180 74 L136 116 L150 176 L96 144 L42 176 L56 116 L12 74 L72 68 Z" fill="${accent}" stroke="#050505" stroke-width="9"/></g><title>${title}</title>`);
  }
  if (variant === 'bar') {
    return frame(512, 96, `<rect width="512" height="96" fill="#101014"/><rect x="24" y="28" width="464" height="40" rx="8" fill="#050505"/><rect x="34" y="38" width="298" height="20" rx="4" fill="${accent}"/><path d="M34 74 L478 74" stroke="#fff" stroke-opacity=".32" stroke-width="4"/><title>${title}</title>`);
  }
  const w = variant === 'panel' ? 512 : 384;
  const h = variant === 'panel' ? 256 : 128;
  return frame(w, h, `<rect width="${w}" height="${h}" fill="#101014"/><g filter="url(#drop)"><path d="M20 18 L${w - 20} 18 L${w - 48} ${h - 18} L48 ${h - 18} Z" fill="${variant === 'dark' ? '#17191f' : '#1e1113'}" stroke="${accent}" stroke-width="8"/><path d="M42 44 L${w - 74} 28" stroke="#fff" stroke-opacity=".22" stroke-width="5"/></g><title>${title}</title>`);
}

function vfx(title, accent, variant) {
  const body = variant === 'ring'
    ? '<circle cx="128" cy="128" r="72" fill="none" stroke="#fff" stroke-width="16"/><circle cx="128" cy="128" r="42" fill="none" stroke="#050505" stroke-width="12"/>'
    : variant === 'drop'
      ? '<path d="M128 32 C170 92 196 132 180 174 C164 216 92 218 76 174 C62 134 86 92 128 32 Z" fill="#4bd7ff" stroke="#050505" stroke-width="10"/>'
      : '<path d="M128 18 L150 100 L234 82 L166 134 L218 214 L132 166 L70 238 L92 150 L18 124 L102 100 Z" fill="#fff" stroke="#050505" stroke-width="10"/>';
  return frame(256, 256, `<rect width="256" height="256" fill="none"/><g filter="url(#drop)" opacity=".95">${body}<circle cx="128" cy="128" r="92" fill="${accent}" opacity=".18"/></g><title>${title}</title>`);
}

[
  ['item_rice.svg', 'rice pack', '#ffd84a', 'R'],
  ['item_drink.svg', 'sports drink', '#4bd7ff', 'D'],
  ['item_band.svg', 'elastic bandage', '#fff1d0', '+'],
  ['item_gloves.svg', 'starter gloves', '#ff1745', 'G'],
  ['item_shoes.svg', 'training shoes', '#58ff95', 'S'],
  ['item_mouth.svg', 'mouth guard', '#f2f2e5', 'M'],
  ['item_notebook.svg', 'training notebook', '#ff9d29', 'N']
].forEach(([file, title, accent, glyph]) => save(file, itemCard(title, accent, glyph)));

[
  ['icon_money.svg', 'money', '#ffd84a', '$'],
  ['icon_fame.svg', 'fame', '#f2f2e5', '*'],
  ['icon_auth.svg', 'authenticity', '#4bd7ff', 'A'],
  ['icon_heat.svg', 'heat', '#ff1745', '!'],
  ['icon_fitxp.svg', 'conditioning', '#58ff95', '+'],
  ['icon_hp.svg', 'health', '#ff1745', '+'],
  ['icon_sp.svg', 'stamina', '#ffd84a', 'S'],
  ['icon_posture.svg', 'posture', '#4bd7ff', 'P'],
  ['icon_nav_map.svg', 'map tab', '#ff1745', 'M'],
  ['icon_nav_profile.svg', 'profile tab', '#ffd84a', 'H'],
  ['icon_nav_skills.svg', 'skills tab', '#ff1745', 'K'],
  ['icon_nav_bag.svg', 'bag tab', '#4bd7ff', 'B'],
  ['icon_nav_shop.svg', 'shop tab', '#ffd84a', '$'],
  ['icon_nav_npc.svg', 'npc tab', '#58ff95', 'N'],
  ['icon_nav_log.svg', 'log tab', '#f2f2e5', 'L'],
  ['icon_nav_check.svg', 'check tab', '#ff9d29', 'C']
].forEach(([file, title, accent, glyph]) => save(file, icon(title, accent, glyph)));

[
  ['skill_jab.svg', 'jab', '#ff1745', 'fist'],
  ['skill_straight.svg', 'straight', '#ff1745', 'fist'],
  ['skill_guard.svg', 'guard', '#4bd7ff', 'guard'],
  ['skill_dodge.svg', 'dodge', '#58ff95', 'foot'],
  ['skill_lowkick.svg', 'low kick', '#ffd84a', 'foot'],
  ['skill_takedown.svg', 'takedown', '#ff9d29', 'grapple'],
  ['skill_sprawl.svg', 'sprawl', '#4bd7ff', 'grapple'],
  ['skill_palm.svg', 'palm strike', '#f2f2e5', 'fist'],
  ['skill_dirtyescape.svg', 'street escape', '#ff1745', 'foot']
].forEach(([file, title, accent, shape]) => save(file, skill(title, accent, shape)));

save('ui_panel_black.svg', uiAsset('black panel', '#ffffff', 'panel'));
save('ui_button_red.svg', uiAsset('red button', '#ff1745', 'button'));
save('ui_button_dark.svg', uiAsset('dark button', '#4bd7ff', 'dark'));
save('ui_badge_warning.svg', uiAsset('warning badge', '#ffd84a', 'badge'));
save('ui_progress_bar.svg', uiAsset('progress bar', '#ff1745', 'bar'));

save('vfx_hit_spark.svg', vfx('hit spark', '#ff1745', 'spark'));
save('vfx_guard_flash.svg', vfx('guard flash', '#4bd7ff', 'spark'));
save('vfx_impact_ring.svg', vfx('impact ring', '#ffd84a', 'ring'));
save('vfx_sweat_drop.svg', vfx('sweat drop', '#4bd7ff', 'drop'));

console.log(`generated first asset pack in ${outDir}`);
