import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const outDir = path.join(root, 'assets', 'generated');
fs.mkdirSync(outDir, { recursive: true });

function save(name, svg) {
  fs.writeFileSync(path.join(outDir, name), svg, 'utf8');
}

function bg(name, palette, props = {}) {
  const { sky, ground, accent, secondary, mood } = palette;
  const gymLines = Array.from({ length: 9 }, (_, i) => `<path d="M${i * 180 - 160} 760 L${i * 180 + 340} 430" stroke="#ffffff" stroke-opacity=".08" stroke-width="4"/>`).join('');
  const buildings = Array.from({ length: 13 }, (_, i) => {
    const x = i * 150 - 60;
    const h = 130 + (i % 4) * 42;
    const w = 110 + (i % 3) * 25;
    return `<rect x="${x}" y="${330 - h}" width="${w}" height="${h}" fill="#151820" stroke="#050505" stroke-width="8"/>
      <g opacity=".32">${Array.from({ length: 4 }, (__, j) => `<rect x="${x + 18 + j * 22}" y="${350 - h}" width="12" height="${Math.max(18, h - 55)}" fill="${secondary}"/>`).join('')}</g>`;
  }).join('');
  const propsSvg = props.type === 'worksite'
    ? `<polygon points="280,720 470,360 620,720" fill="#151515" stroke="#050505" stroke-width="10"/><rect x="765" y="345" width="310" height="225" fill="#231a14" stroke="#050505" stroke-width="10"/><circle cx="1040" cy="650" r="52" fill="${accent}" opacity=".8"/>`
    : props.type === 'park'
      ? `<g opacity=".95">${Array.from({ length: 9 }, (_, i) => `<circle cx="${170 + i * 150}" cy="${310 + (i % 2) * 35}" r="${95 + (i % 3) * 18}" fill="${secondary}" stroke="#050505" stroke-width="8"/>`).join('')}</g><rect x="0" y="540" width="1600" height="95" fill="#33411f" opacity=".8"/>`
      : props.type === 'dojo'
        ? `<rect x="235" y="170" width="1130" height="410" fill="#251914" stroke="#050505" stroke-width="12"/><g opacity=".22">${Array.from({ length: 7 }, (_, i) => `<rect x="${320 + i * 140}" y="210" width="85" height="230" fill="#ead6a8" stroke="#050505" stroke-width="5"/>`).join('')}</g>`
        : `<rect x="210" y="235" width="1180" height="390" fill="#1b1515" stroke="#050505" stroke-width="12"/><rect x="360" y="310" width="240" height="190" fill="${secondary}" opacity=".36"/><rect x="990" y="315" width="260" height="190" fill="${secondary}" opacity=".28"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${sky}" offset="0"/><stop stop-color="#060609" offset="1"/></linearGradient>
      <radialGradient id="flare" cx=".52" cy=".35" r=".58"><stop stop-color="${accent}" stop-opacity=".28" offset="0"/><stop stop-color="${accent}" stop-opacity="0" offset=".72"/></radialGradient>
      <pattern id="grain" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 13 L32 3 M0 28 L32 18" stroke="#fff" stroke-opacity=".045" stroke-width="2"/></pattern>
    </defs>
    <rect width="1600" height="900" fill="url(#sky)"/><rect width="1600" height="900" fill="url(#flare)"/>
    <g opacity="${props.type === 'park' ? '.55' : '.8'}">${buildings}</g>
    ${propsSvg}
    <rect y="600" width="1600" height="300" fill="${ground}"/>
    <g>${gymLines}</g>
    <path d="M0 812 C310 720 530 862 800 780 C1130 680 1290 820 1600 750 L1600 900 L0 900 Z" fill="#050506" opacity=".48"/>
    <g opacity=".82"><polygon points="0,0 450,0 390,78 0,115" fill="#050506"/><polygon points="1600,0 1180,0 1255,105 1600,135" fill="#050506"/><polygon points="0,900 360,785 450,900" fill="#050506"/><polygon points="1600,900 1220,790 1140,900" fill="#050506"/></g>
    <rect width="1600" height="900" fill="url(#grain)"/><rect width="1600" height="900" fill="none" stroke="#050505" stroke-width="20"/>
    <path d="M32 120 L385 78" stroke="${accent}" stroke-width="8"/><path d="M1210 110 L1568 145" stroke="${accent}" stroke-width="8"/>
    <title>${mood}</title>
  </svg>`;
}

function person(name, body, accent, role = 'fighter') {
  const weapon = role === 'weapon' ? '<rect x="316" y="185" width="18" height="170" rx="8" fill="#d5d5d5" stroke="#050505" stroke-width="8" transform="rotate(28 325 270)"/>' : '';
  const coat = role === 'coach' || role === 'master' ? '#202020' : body;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="768" viewBox="0 0 512 768">
    <defs><filter id="shadow"><feDropShadow dx="14" dy="18" stdDeviation="0" flood-color="#050505" flood-opacity=".95"/></filter></defs>
    <g filter="url(#shadow)">
      <ellipse cx="258" cy="716" rx="158" ry="28" fill="#050505" opacity=".38"/>
      <path d="M210 330 L302 330 L338 530 L294 704 L244 704 L210 535 Z" fill="${coat}" stroke="#050505" stroke-width="14"/>
      <path d="M222 184 C228 120 292 105 323 142 C352 176 338 242 302 260 C260 282 216 243 222 184 Z" fill="#d7a477" stroke="#050505" stroke-width="13"/>
      <path d="M215 160 C246 98 333 105 360 168 C315 145 276 170 230 196 Z" fill="#1a1110" stroke="#050505" stroke-width="10"/>
      <path d="M209 342 L119 430 L90 392 L170 305 Z" fill="${body}" stroke="#050505" stroke-width="13"/>
      <path d="M310 342 L408 415 L378 460 L290 388 Z" fill="${body}" stroke="#050505" stroke-width="13"/>
      <circle cx="91" cy="392" r="32" fill="${accent}" stroke="#050505" stroke-width="11"/>
      <circle cx="383" cy="452" r="32" fill="${accent}" stroke="#050505" stroke-width="11"/>
      <path d="M228 526 L196 708 L145 708 L165 525 Z" fill="#161616" stroke="#050505" stroke-width="13"/>
      <path d="M304 526 L362 708 L308 708 L267 532 Z" fill="#161616" stroke="#050505" stroke-width="13"/>
      <rect x="168" y="692" width="80" height="38" fill="${accent}" stroke="#050505" stroke-width="10"/>
      <rect x="298" y="692" width="82" height="38" fill="${accent}" stroke="#050505" stroke-width="10"/>
      ${weapon}
      <path d="M187 322 L335 322 L315 372 L207 372 Z" fill="${accent}" opacity=".88" stroke="#050505" stroke-width="9"/>
    </g>
  </svg>`;
}

function portrait(name, body, accent, role = 'fighter') {
  const prop = role === 'weapon' ? '<rect x="354" y="110" width="22" height="230" fill="#cfcfcf" stroke="#050505" stroke-width="10" transform="rotate(28 365 220)"/>' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#101014"/>
    <path d="M0 0 L512 0 L440 70 L0 120 Z" fill="#050505"/><path d="M0 512 L120 410 L512 460 L512 512 Z" fill="#050505"/>
    <g filter="url(#s)"><path d="M178 470 L205 290 L320 290 L356 470 Z" fill="${body}" stroke="#050505" stroke-width="14"/>
    <circle cx="258" cy="178" r="94" fill="#d7a477" stroke="#050505" stroke-width="14"/>
    <path d="M165 147 C196 62 330 56 365 151 C300 120 248 132 175 190 Z" fill="#18100f" stroke="#050505" stroke-width="10"/>
    <circle cx="151" cy="331" r="48" fill="${accent}" stroke="#050505" stroke-width="12"/><circle cx="373" cy="331" r="48" fill="${accent}" stroke="#050505" stroke-width="12"/>
    ${prop}</g>
    <path d="M28 72 L206 48" stroke="${accent}" stroke-width="8"/><path d="M304 458 L486 430" stroke="${accent}" stroke-width="8"/>
    <defs><filter id="s"><feDropShadow dx="10" dy="14" stdDeviation="0" flood-color="#050505"/></filter></defs>
  </svg>`;
}

const palettes = {
  home: { sky: '#07111f', ground: '#141014', accent: '#ff1745', secondary: '#4bd7ff', mood: 'rented room night' },
  store: { sky: '#071823', ground: '#111417', accent: '#ff1745', secondary: '#4bd7ff', mood: 'rainy store night' },
  worksite: { sky: '#3a1b14', ground: '#21140e', accent: '#ff9d29', secondary: '#ffd84a', mood: 'worksite dusk' },
  park: { sky: '#326083', ground: '#20341d', accent: '#ff1745', secondary: '#58ff95', mood: 'park day' },
  boxing: { sky: '#091425', ground: '#171010', accent: '#ff1745', secondary: '#ffd84a', mood: 'boxing gym night' },
  wuguan: { sky: '#432917', ground: '#1a120d', accent: '#ff1745', secondary: '#ffd84a', mood: 'traditional dojo' },
  mma: { sky: '#0a1720', ground: '#111315', accent: '#4bd7ff', secondary: '#ff1745', mood: 'mma cage night' },
  street: { sky: '#050b14', ground: '#09090c', accent: '#ff1745', secondary: '#4bd7ff', mood: 'old town night' }
};

save('bg_home_night.svg', bg('home', palettes.home));
save('bg_store_rain.svg', bg('store', palettes.store));
save('bg_worksite_dusk.svg', bg('worksite', palettes.worksite, { type: 'worksite' }));
save('bg_park_day.svg', bg('park', palettes.park, { type: 'park' }));
save('bg_boxing_night.svg', bg('boxing', palettes.boxing));
save('bg_wuguan_day.svg', bg('wuguan', palettes.wuguan, { type: 'dojo' }));
save('bg_mma_night.svg', bg('mma', palettes.mma));
save('bg_street_night.svg', bg('street', palettes.street));

save('fighter_player.svg', person('player', '#15151b', '#ff1745'));
save('fighter_enemy_boxer.svg', person('boxer', '#f2f2e5', '#4bd7ff'));
save('fighter_enemy_grappler.svg', person('grappler', '#232323', '#ffd84a'));
save('fighter_enemy_weapon.svg', person('weapon', '#171717', '#ff1745', 'weapon'));
save('fighter_enemy_boss.svg', person('boss', '#111111', '#ffffff'));

[
  ['portrait_player.svg', '#15151b', '#ff1745', 'fighter'],
  ['portrait_fatty.svg', '#9b1b25', '#fff1d0', 'fighter'],
  ['portrait_coach.svg', '#202020', '#ff9d29', 'coach'],
  ['portrait_master.svg', '#202020', '#ffd84a', 'master'],
  ['portrait_xiaoman.svg', '#2f4058', '#4bd7ff', 'fighter'],
  ['portrait_chen.svg', '#111111', '#ffffff', 'fighter'],
  ['portrait_enemy_boxer.svg', '#f2f2e5', '#4bd7ff', 'fighter'],
  ['portrait_enemy_grappler.svg', '#232323', '#ffd84a', 'fighter'],
  ['portrait_enemy_weapon.svg', '#171717', '#ff1745', 'weapon']
].forEach(([file, body, accent, role]) => save(file, portrait(file, body, accent, role)));

console.log(`generated assets in ${outDir}`);
