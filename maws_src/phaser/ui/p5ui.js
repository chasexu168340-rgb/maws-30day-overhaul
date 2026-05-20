export const UI = {
  black: 0x050506,
  panel: 0x101014,
  panel2: 0x181820,
  paper: 0xfff1d0,
  white: 0xf6f0df,
  muted: 0xb6aa91,
  red: 0xff1745,
  redDark: 0x9b001e,
  yellow: 0xffd84a,
  blue: 0x4bd7ff,
  green: 0x58ff95
};

export function clear(container) {
  container.removeAll(true);
}

export function polyPanel(scene, x, y, w, h, color = UI.panel, stroke = UI.white, depth = 1, skew = 22) {
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(color, 0.94);
  g.lineStyle(4, UI.black, 1);
  g.beginPath();
  g.moveTo(x + skew, y);
  g.lineTo(x + w, y);
  g.lineTo(x + w - skew, y + h);
  g.lineTo(x, y + h);
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.lineStyle(2, stroke, 1);
  g.beginPath();
  g.moveTo(x + skew + 7, y + 7);
  g.lineTo(x + w - 8, y + 7);
  g.lineTo(x + w - skew - 7, y + h - 7);
  g.lineTo(x + 8, y + h - 7);
  g.closePath();
  g.strokePath();
  g.lineStyle(5, UI.red, 1);
  g.lineBetween(x + 18, y + h - 5, x + w - skew - 18, y + h - 5);
  return g;
}

export function label(scene, x, y, text, opts = {}) {
  return scene.add.text(x, y, text, {
    fontFamily: '"Microsoft YaHei", "PingFang SC", Arial',
    fontSize: opts.size || 18,
    color: opts.color || '#f6f0df',
    fontStyle: opts.bold === false ? 'normal' : 'bold',
    lineSpacing: opts.lineSpacing ?? 4,
    wordWrap: opts.wrap ? { width: opts.wrap, useAdvancedWrap: true } : undefined,
    align: opts.align || 'left',
    stroke: opts.stroke === false ? undefined : '#000000',
    strokeThickness: opts.stroke === false ? 0 : (opts.strokeThickness ?? 4)
  }).setDepth(opts.depth || 5).setOrigin(opts.originX || 0, opts.originY || 0);
}

export function smallTag(scene, x, y, text, color = UI.paper, depth = 6) {
  const w = Math.max(54, text.length * 13 + 16);
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(color, 1).lineStyle(3, UI.black, 1).fillRect(x, y, w, 24).strokeRect(x, y, w, 24);
  const t = label(scene, x + 8, y + 2, text, { size: 13, color: color === UI.red ? '#fff' : '#050506', stroke: false, depth: depth + 1 });
  return { g, t, w, h: 24 };
}

export function button(scene, x, y, w, h, text, cb, opts = {}) {
  const color = opts.active ? UI.red : opts.dark ? UI.black : UI.panel;
  const stroke = opts.active ? UI.yellow : UI.white;
  const depth = opts.depth || 20;
  const g = polyPanel(scene, x, y, w, h, color, stroke, depth, opts.skew ?? 16);
  const hit = scene.add.zone(x, y, w, h).setOrigin(0).setDepth(depth + 5).setInteractive({ useHandCursor: true });
  hit.on('pointerdown', () => cb?.());
  hit.on('pointerover', () => g.setAlpha(1));
  hit.on('pointerout', () => g.setAlpha(0.94));
  const t = label(scene, x + 18, y + Math.max(8, h * 0.5 - 13), text, {
    size: opts.size || 18,
    color: opts.active ? '#ffffff' : '#f6f0df',
    wrap: Math.max(80, w - 32),
    depth: depth + 6
  });
  return { g, hit, t };
}

export function bar(scene, x, y, w, h, value, max, color = UI.red, labelText = '', depth = 10) {
  const pct = Math.max(0, Math.min(1, (Number(value) || 0) / Math.max(1, Number(max) || 1)));
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(UI.black, 0.9).lineStyle(3, UI.black, 1).fillRect(x, y, w, h).strokeRect(x, y, w, h);
  g.fillStyle(color, 1).fillRect(x + 3, y + 3, Math.max(0, (w - 6) * pct), h - 6);
  if (labelText) label(scene, x + 7, y - 2, labelText, { size: 13, color: '#fff', depth: depth + 1 });
  return g;
}

export function addTo(container, items) {
  items.flat().filter(Boolean).forEach((item) => {
    if (item.g || item.t || item.hit) addTo(container, Object.values(item));
    else if (item.scene) container.add(item);
  });
}

export function wrapLines(text, max = 26) {
  const chunks = [];
  let line = '';
  for (const ch of String(text || '')) {
    line += ch;
    if (line.length >= max || ch === '\n') {
      chunks.push(line.trim());
      line = '';
    }
  }
  if (line) chunks.push(line);
  return chunks.join('\n');
}
