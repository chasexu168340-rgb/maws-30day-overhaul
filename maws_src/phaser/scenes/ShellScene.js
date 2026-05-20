import { ACTIONS, ITEMS, LOCS, ORIGINS, SKILLS, TABS, TRAVEL_TUNING } from '../../content/data.js';
import { ASSET_MANIFEST } from '../../assets/manifest.js';
import { buildRenderModel, fmtTime } from '../../simulation/state.js';
import { bar, button, clear, label, polyPanel, smallTag, UI, wrapLines } from '../ui/p5ui.js';

const PhaserScene = globalThis.Phaser?.Scene || class {};

const BG_BY_LOC = {
  home: 'bg.home.day',
  store: 'bg.store.day',
  worksite: 'bg.worksite.day',
  park: 'bg.park.day',
  boxing: 'bg.boxing.day',
  wuguan: 'bg.wuguan.day',
  mma: 'bg.mma.day',
  gym: 'bg.gym.day',
  physio: 'bg.physio.day',
  street: 'bg.street.day'
};

const FIGHTER_BY_ENEMY = {
  E01: 'fighter.enemy.boxer',
  E05: 'fighter.enemy.boxer',
  E06: 'fighter.enemy.grappler',
  E07: 'fighter.enemy.weapon',
  E18: 'fighter.enemy.boss'
};

const ANIM_BY_FIGHTER = {
  'fighter.player': 'anim.fighter.player',
  'fighter.enemy.boxer': 'anim.fighter.enemy.boxer',
  'fighter.enemy.grappler': 'anim.fighter.enemy.grappler',
  'fighter.enemy.weapon': 'anim.fighter.enemy.weapon',
  'fighter.enemy.boss': 'anim.fighter.enemy.boss'
};

function distText(value) {
  return { far: '远距', mid: '中距', close: '近身', ground: '地面' }[value] || value;
}

function groundText(value) {
  return { none: '站立', ground_neutral: '地面中立', player_top: '我方上位', player_bottom: '我方下位' }[value] || value;
}

export class ShellScene extends PhaserScene {
  constructor() {
    super('ShellScene');
    this.store = null;
    this.root = null;
    this.model = null;
    this.scroll = {};
    this.lastRenderedStepCount = 0;
    this.lastRenderedStepHash = '';
  }

  init(data) {
    this.store = data.store;
  }

  create() {
    this.root = this.add.container(0, 0);
    this.store.subscribe(() => this.render());
    this.input.keyboard.on('keydown-ESC', () => this.store.dispatch({ type: 'closeModal' }));
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.model?.combat) this.store.dispatch({ type: 'confirmBattle' });
    });
    this.input.keyboard.on('keydown', (event) => {
      const n = Number(event.key);
      if (this.model?.combat && n >= 1 && n <= 9) {
        const item = this.model.equipSkills[n - 1];
        if (item?.id) this.store.dispatch({ type: 'selectSkill', skillId: item.id });
      }
    });
    this.input.on('wheel', (_pointer, _objects, _dx, dy) => {
      const key = this.model?.combat ? 'combat' : this.model?.tab || 'map';
      this.scroll[key] = Math.max(0, (this.scroll[key] || 0) + dy * 0.45);
      this.render();
    });
    this.scale.on('resize', () => this.render());
    this.render();
  }

  render() {
    clear(this.root);
    this.model = buildRenderModel(this.store.state);
    if (this.model.boot) this.renderTitle();
    else if (this.model.combat) this.renderCombat();
    else {
      this.resetCombatFxCursor();
      this.renderShell();
    }
  }

  size() {
    return { w: this.scale.width || 1365, h: this.scale.height || 768 };
  }

  track(item) {
    if (!item) return item;
    if (Array.isArray(item)) {
      item.forEach((child) => this.track(child));
      return item;
    }
    if (item.scene && typeof item.once === 'function') {
      this.root.add(item);
      return item;
    }
    if (typeof item === 'object') Object.values(item).forEach((child) => this.track(child));
    return item;
  }

  renderTitle() {
    const { w } = this.size();
    this.drawBackground('bg.street.night');
    const shade = this.add.graphics().setDepth(2);
    shade.fillStyle(0x000000, w < 620 ? 0.18 : 0.08).fillRect(0, 0, ...Object.values(this.size()));
    this.root.add(shade);
  }

  drawBackground(key) {
    const { w, h } = this.size();
    const img = this.add.image(w / 2, h / 2, key).setDepth(0);
    const scale = Math.max(w / img.width, h / img.height);
    img.setScale(scale);
    this.root.add(img);
    const shade = this.add.graphics().setDepth(1);
    shade.fillStyle(0x000000, 0.22).fillRect(0, 0, w, h);
    this.root.add(shade);
  }

  renderShell() {
    this.drawBackground(this.model.locationScene?.backgroundKey || BG_BY_LOC[this.model.loc.id] || 'bg.home.day');
  }

  renderHud() {
    const { w } = this.size();
    if (w < 620) {
      this.track(polyPanel(this, 12, 10, w - 24, 54, UI.black, UI.white, 30, 18));
      this.track(label(this, 34, 20, this.model.dayText, { size: 24, color: '#ffffff', depth: 40 }));
      this.track(label(this, 36, 48, this.model.phase, { size: 12, color: '#ffd84a', depth: 40 }));
      const gap = 6;
      const boxW = (w - 24 - gap * 3) / 4;
      this.model.resources.forEach(([name, value, icon], i) => {
        const x = 12 + (i % 4) * (boxW + gap);
        const y = 76 + Math.floor(i / 4) * 34;
        this.track(polyPanel(this, x, y, boxW, 28, UI.black, i % 2 ? UI.red : UI.white, 31, 8));
        this.track(label(this, x + 8, y + 4, `${icon} ${value}`, { size: name === '体能沉淀' ? 10 : 12, color: '#ffffff', depth: 40, strokeThickness: 3 }));
      });
      return;
    }
    this.track(polyPanel(this, 20, 18, Math.min(470, w * 0.45), 86, UI.black, UI.white, 30, 34));
    this.track(label(this, 56, 34, this.model.dayText, { size: w < 600 ? 20 : 32, color: '#ffffff', depth: 40 }));
    this.track(label(this, 58, 76, this.model.phase, { size: 14, color: '#ffd84a', depth: 40 }));
    const cols = w < 760 ? 2 : 4;
    const boxW = w < 760 ? 132 : 146;
    const startX = Math.max(20, w - cols * (boxW + 8) - 20);
    this.model.resources.forEach(([name, value, icon], i) => {
      const x = startX + (i % cols) * (boxW + 8);
      const y = 18 + Math.floor(i / cols) * 38;
      this.track(polyPanel(this, x, y, boxW, 32, UI.black, i % 2 ? UI.red : UI.white, 31, 10));
      this.track(label(this, x + 12, y + 6, `${icon} ${name}`, { size: 12, color: '#d8d2c3', depth: 40, stroke: false }));
      this.track(label(this, x + boxW - 12, y + 4, String(value), { size: 15, color: '#ffffff', depth: 40, originX: 1, strokeThickness: 3 }));
    });
  }

  renderNav() {
    const { w, h } = this.size();
    if (w < 620) {
      const entries = [
        ...TABS.map((tab) => ({ ...tab, kind: 'tab' })),
        { id: 'sleep', icon: '眠', label: '睡觉', kind: 'sleep' },
        { id: 'save', icon: '存', label: '保存', kind: 'save' }
      ];
      const cols = 5;
      const gap = 6;
      const bw = (w - 24 - gap * (cols - 1)) / cols;
      const bh = 42;
      const startY = h - 104;
      entries.forEach((entry, i) => {
        const x = 12 + (i % cols) * (bw + gap);
        const y = startY + Math.floor(i / cols) * (bh + 8);
        const active = entry.kind === 'tab' && this.model.tab === entry.id;
        const dark = entry.kind !== 'tab';
        const cb = () => {
          if (entry.kind === 'sleep') this.store.dispatch({ type: 'doAction', actionId: 'sleep' });
          else if (entry.kind === 'save') this.store.dispatch({ type: 'saveGame' });
          else this.store.dispatch({ type: 'setTab', tab: entry.id });
        };
        this.track(button(this, x, y, bw, bh, entry.icon, cb, { active, dark, size: 18, depth: 50, skew: 10 }));
      });
      return;
    }
    const available = w < 620 ? TABS.slice(0, 6) : TABS;
    const gap = 8;
    const bw = Math.min(138, (w - 40 - gap * (available.length + 1)) / (available.length + 2));
    let x = 24;
    available.forEach((tab) => {
      this.track(button(this, x, h - 70, bw, 54, `${tab.icon} ${tab.label}`, () => this.store.dispatch({ type: 'setTab', tab: tab.id }), { active: this.model.tab === tab.id, size: 16, depth: 50 }));
      x += bw + gap;
    });
    this.track(button(this, w - 178, h - 70, 72, 54, '睡觉', () => this.store.dispatch({ type: 'doAction', actionId: 'sleep' }), { dark: true, size: 15, depth: 50 }));
    this.track(button(this, w - 96, h - 70, 72, 54, '保存', () => this.store.dispatch({ type: 'saveGame' }), { dark: true, size: 15, depth: 50 }));
  }

  panelTitle(x, y, title, sub = '') {
    const titleW = Math.min(360, this.size().w - x - 16);
    this.track(polyPanel(this, x, y, titleW, 62, UI.black, UI.white, 10, 24));
    this.track(label(this, x + 28, y + 12, title, { size: 27, color: '#ffffff', depth: 20 }));
    if (sub) this.track(label(this, x + 30, y + 43, sub, { size: 13, color: '#ffd84a', wrap: titleW - 54, depth: 20 }));
  }

  renderMap(x, y, w, h) {
    this.panelTitle(x, y, this.model.loc.name, this.model.loc.desc);
    if (w < 620) {
      const gap = 12;
      const leftW = Math.floor((w - gap) * 0.48);
      const rightW = w - leftW - gap;
      const panelY = y + 78;
      const panelH = h - 86;
      this.track(polyPanel(this, x, panelY, leftW, panelH, UI.black, UI.white, 8, 14));
      this.track(label(this, x + 18, panelY + 18, '地点移动', { size: 20, color: '#ffd84a', depth: 20 }));
      this.model.locs.forEach((loc, i) => {
        const ly = panelY + 54 + i * 40;
        if (ly > panelY + panelH - 42) return;
        this.track(button(this, x + 14, ly, leftW - 28, 34, loc.name, () => {
          if (loc.active) return;
          if (loc.closed) this.store.dispatch({ type: 'toast', text: `${loc.name}现在不开放` });
          else this.store.dispatch({ type: 'openTravel', loc: loc.id });
        }, { active: loc.active, dark: loc.closed, size: 13, depth: 18, skew: 9 }));
      });

      const rx = x + leftW + gap;
      this.track(polyPanel(this, rx, panelY, rightW, panelH, UI.black, UI.white, 8, 14));
      this.track(label(this, rx + 18, panelY + 18, '今日行动', { size: 20, color: '#ffd84a', depth: 20 }));
      this.model.actions.slice(0, 6).forEach((action, i) => {
        const ay = panelY + 54 + i * 58;
        if (ay > panelY + panelH - 56) return;
        const actionTitle = action.name.length > 5 ? action.name.slice(0, 5) : action.name;
        this.track(button(this, rx + 14, ay, rightW - 28, 48, actionTitle, () => {
          this.store.dispatch({ type: 'doAction', actionId: action.id });
        }, { active: i === 0, dark: action.disabled, size: 13, depth: 18, skew: 9 }));
        this.track(label(this, rx + 24, ay + 30, `体力-${action.spCost}${action.cost ? ` ￥${action.cost}` : ''}`, { size: 10, color: '#d8d2c3', depth: 28, stroke: false }));
      });
      if (this.model.opportunities?.length) {
        this.track(label(this, rx + 16, panelY + panelH - 42, wrapLines(`机会：${this.model.opportunities.map((o) => o.title).join(' / ')}`, 15), { size: 11, color: '#4bd7ff', wrap: rightW - 30, depth: 28 }));
      }
      return;
    }
    const leftW = Math.min(520, w * 0.42);
    const cardH = 72;
    this.track(polyPanel(this, x, y + 86, leftW, h - 100, UI.black, UI.white, 8, 18));
    this.track(label(this, x + 28, y + 104, '地点移动', { size: 21, color: '#ffd84a', depth: 20 }));
    this.model.locs.forEach((loc, i) => {
      const lx = x + 26 + (i % 2) * ((leftW - 70) / 2);
      const ly = y + 144 + Math.floor(i / 2) * cardH;
      const locW = (leftW - 86) / 2;
      const locLabel = locW < 150 ? loc.name : `${loc.icon} ${loc.name}`;
      this.track(button(this, lx, ly, locW, 58, locLabel, () => {
        if (loc.active) return;
        if (loc.closed) this.store.dispatch({ type: 'toast', text: `${loc.name}现在不开放` });
        else this.store.dispatch({ type: 'openTravel', loc: loc.id });
      }, { active: loc.active, dark: loc.closed, size: 16, depth: 18 }));
    });

    const rx = x + leftW + 28;
    const rw = w - leftW - 28;
    this.track(polyPanel(this, rx, y + 86, rw, h - 100, UI.black, UI.white, 8, 18));
    this.track(label(this, rx + 28, y + 104, '今日行动', { size: 21, color: '#ffd84a', depth: 20 }));
    this.model.actions.slice(0, 6).forEach((action, i) => {
      const ay = y + 142 + i * 78;
      this.track(button(this, rx + 24, ay, rw - 48, 66, `${action.icon} ${action.name}`, () => {
        this.store.dispatch({ type: 'doAction', actionId: action.id });
      }, { active: i === 0, dark: action.disabled, size: 17, depth: 18 }));
      this.track(label(this, rx + rw - 68, ay + 18, `体力-${action.spCost}${action.cost ? ` ￥${action.cost}` : ''}`, { size: 13, color: '#ffd84a', depth: 28, originX: 1 }));
      this.track(label(this, rx + 42, ay + 42, wrapLines(action.desc, Math.max(18, Math.floor((rw - 110) / 15))), { size: 12, color: '#d8d2c3', depth: 28, stroke: false }));
    });
    if (this.model.opportunities?.length) {
      this.track(label(this, rx + 28, y + h - 78, `机会：${this.model.opportunities.map((o) => o.title).join(' / ')}`, { size: 14, color: '#4bd7ff', wrap: rw - 56, depth: 28 }));
    }
  }

  renderProfile(x, y, w, h) {
    this.panelTitle(x, y, '人物属性', '所有显示出来的数值都接入实际作用');
    const cols = w < 700 ? 2 : 4;
    const cw = (w - 30 - (cols - 1) * 12) / cols;
    const startY = y + 95 - (this.scroll.profile || 0);
    Object.entries(this.model.statRules).forEach(([key, rule], i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = startY + Math.floor(i / cols) * 122;
      this.statCard(sx, sy, cw, 108, `${rule.icon} ${rule.name}`, Math.round(this.model.player.stats[key]), rule.formula);
    });
    const y2 = startY + Math.ceil(Object.keys(this.model.statRules).length / cols) * 122 + 26;
    this.track(label(this, x + 20, y2, '资源压力', { size: 22, color: '#ffd84a', depth: 20 }));
    this.model.resources.slice(0, 8).forEach(([name, value, icon], i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = y2 + 42 + Math.floor(i / cols) * 92;
      this.statCard(sx, sy, cw, 80, `${icon} ${name}`, value, name === '体能沉淀' ? `速度+${this.model.player.fit.bonus.spd} 耐力+${this.model.player.fit.bonus.end} 平衡+${this.model.player.fit.bonus.bal}` : '');
    });
  }

  statCard(x, y, w, h, title, value, sub) {
    this.track(polyPanel(this, x, y, w, h, UI.panel, UI.white, 10, 12));
    this.track(label(this, x + 16, y + 12, title, { size: 16, color: '#ffd84a', depth: 20 }));
    this.track(label(this, x + 18, y + 38, String(value), { size: 27, color: '#ffffff', depth: 20 }));
    if (sub) this.track(label(this, x + 16, y + h - 28, wrapLines(sub, Math.max(10, Math.floor((w - 28) / 13))), { size: 11, color: '#b6aa91', depth: 20, stroke: false }));
  }

  renderSkills(x, y, w, h) {
    this.panelTitle(x, y, '技能配置', '技能卡显示命中、风险和当前熟练度');
    const cols = w < 760 ? 2 : 3;
    const cw = (w - 30 - (cols - 1) * 12) / cols;
    const list = this.model.skills;
    const offset = this.scroll.skills || 0;
    list.forEach((skill, i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = y + 92 + Math.floor(i / cols) * 138 - offset;
      if (sy < y + 70 || sy > y + h) return;
      this.track(button(this, sx, sy, cw, 122, `${skill.icon} ${skill.name}${skill.equipped ? '  已装备' : ''}`, () => this.store.dispatch({ type: 'equipSkill', skillId: skill.id }), { active: skill.equipped, size: 17, depth: 10 }));
      this.track(label(this, sx + 18, sy + 42, `${skill.desc}\n熟练度 ${Math.round(skill.state?.p || 0)}% · AP${skill.ap || skill.tp || 1} · 体力-${skill.sp} · 风险${Math.round(skill.risk * 100)}%`, { size: 12, color: '#d8d2c3', wrap: cw - 34, depth: 25, stroke: false }));
    });
  }

  renderBag(x, y, w, h) {
    this.panelTitle(x, y, '背包装备', '补给和装备都走同一套资源系统');
    const cols = w < 680 ? 2 : 4;
    const cw = (w - 30 - (cols - 1) * 12) / cols;
    this.model.inventory.forEach((entry, i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = y + 95 + Math.floor(i / cols) * 118;
      this.track(button(this, sx, sy, cw, 100, `${entry.item.icon} ${entry.item.name} x${entry.count}`, () => this.store.dispatch({ type: 'useItem', itemId: entry.id }), { size: 16, depth: 10 }));
      this.track(label(this, sx + 16, sy + 42, wrapLines(entry.item.desc, Math.floor((cw - 30) / 13)), { size: 12, color: '#d8d2c3', depth: 25, stroke: false }));
    });
  }

  renderShop(x, y, w, h) {
    this.panelTitle(x, y, '网络商城', '先补短板，别乱买玄学');
    const cols = w < 680 ? 2 : 4;
    const cw = (w - 30 - (cols - 1) * 12) / cols;
    const offset = this.scroll.shop || 0;
    this.model.shopItems.forEach((item, i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = y + 95 + Math.floor(i / cols) * 126 - offset;
      if (sy < y + 70 || sy > y + h) return;
      this.track(button(this, sx, sy, cw, 108, `${item.icon} ${item.name}\n￥${item.price}`, () => this.store.dispatch({ type: 'buyItem', itemId: item.id }), { size: 16, depth: 10 }));
      this.track(label(this, sx + 16, sy + 58, wrapLines(item.desc, Math.floor((cw - 30) / 13)), { size: 12, color: '#d8d2c3', depth: 25, stroke: false }));
    });
  }

  renderNpc(x, y, w, h) {
    this.panelTitle(x, y, '关系对话', '建议每天有限，不能无限刷');
    const cols = w < 760 ? 2 : 5;
    const cw = (w - 30 - (cols - 1) * 12) / cols;
    this.model.npcs.forEach((npc, i) => {
      const sx = x + 15 + (i % cols) * (cw + 12);
      const sy = y + 98 + Math.floor(i / cols) * 172;
      const portraitKey = `portrait.${npc.id}`;
      const img = this.add.image(sx + cw / 2, sy + 54, portraitKey).setDisplaySize(86, 86).setDepth(14);
      this.track(img);
      this.track(button(this, sx, sy, cw, 152, `${npc.icon} ${npc.name}\n关系 ${npc.relation}`, () => {
        const action = Object.values(ACTIONS).flat().find((a) => a.type === 'dialog' && a.npc === npc.id);
        if (action && ACTIONS[this.model.loc.id]?.includes(action)) this.store.dispatch({ type: 'doAction', actionId: action.id });
        else this.store.dispatch({ type: 'toast', text: '去对应地点更容易聊到重点' });
      }, { size: 15, depth: 10 }));
    });
  }

  renderLog(x, y, w, h) {
    this.panelTitle(x, y, '日志复盘', '看自己怎么赢，也看自己怎么输');
    const offset = this.scroll.log || 0;
    this.track(polyPanel(this, x, y + 90, w, h - 105, UI.black, UI.white, 8, 16));
    this.model.log.forEach((entry, i) => {
      const ly = y + 118 + i * 44 - offset;
      if (ly < y + 100 || ly > y + h - 20) return;
      this.track(label(this, x + 28, ly, `D${entry.day} ${fmtTime(entry.time)}  ${entry.text}`, { size: 15, color: i < 2 ? '#ffd84a' : '#f6f0df', wrap: w - 60, depth: 20 }));
    });
  }

  renderCheck(x, y, w, h) {
    this.panelTitle(x, y, '验收自检', '关键入口直接测试');
    const tests = [['E01', '基础拳击'], ['E06', 'MMA抱摔'], ['E07', '武器威胁'], ['E18', '终局陈见锋']];
    tests.forEach(([id, name], i) => this.track(button(this, x + 30 + i * 190, y + 120, 170, 78, `${id}\n${name}`, () => this.store.dispatch({ type: 'startBattle', enemyId: id }), { active: i === 0, depth: 10 })));
    this.track(label(this, x + 34, y + 230, `战斗记忆：总战斗 ${this.model.combatMemory.fights || 0} / 胜 ${this.model.combatMemory.wins || 0} / 风险胜利 ${this.model.combatMemory.riskWins || 0}`, { size: 20, color: '#ffd84a', depth: 20 }));
  }

  renderCombat() {
    const { w, h } = this.size();
    const c = this.model.combat;
    const bg = c.enemyId === 'E07' ? 'bg.store.rain' : c.enemyId === 'E06' ? 'bg.mma.night' : c.enemyId === 'E18' ? 'bg.boxing.night' : 'bg.park.day';
    this.drawBackground(bg);
    const mobile = w < 620;
    const fighters = this.renderCombatFighters(c, w, h, mobile);
    this.playNewCombatFx(c, fighters, mobile);
  }

  renderCombatFighters(c, w, h, mobile) {
    const fighterW = mobile ? (h < 760 ? 112 : 128) : 220;
    const fighterH = mobile ? (h < 760 ? 172 : 198) : 320;
    const py = h * (mobile ? 0.43 : 0.56);
    const enemyKey = FIGHTER_BY_ENEMY[c.enemyId] || 'fighter.enemy.boxer';
    const player = this.createCombatFighter(w * 0.34, py, 'fighter.player', ANIM_BY_FIGHTER['fighter.player'], fighterW, fighterH, false);
    const enemy = this.createCombatFighter(w * 0.66, py, enemyKey, ANIM_BY_FIGHTER[enemyKey], fighterW, fighterH, true);
    return {
      player: { ...player, x: w * 0.34, y: py, hitX: w * 0.34, hitY: py - fighterH * 0.28 },
      enemy: { ...enemy, x: w * 0.66, y: py, hitX: w * 0.66, hitY: py - fighterH * 0.28 }
    };
  }

  createCombatFighter(x, y, imageKey, animKey, w, h, flipX) {
    if (animKey && this.hasTexture(animKey)) {
      this.ensureFighterAnimations(animKey);
      const sprite = this.add.sprite(x, y, animKey, 0).setDisplaySize(w, h).setDepth(18).setFlipX(flipX);
      this.track(sprite);
      this.playFighterAnim({ sprite, animKey }, 'idle', false);
      return { sprite, animKey, imageKey, isAnimated: true };
    }
    const sprite = this.add.image(x, y, imageKey).setDisplaySize(w, h).setDepth(18).setFlipX(flipX);
    this.track(sprite);
    return { sprite, animKey: null, imageKey, isAnimated: false };
  }

  hasTexture(key) {
    return Boolean(key && (!this.textures?.exists || this.textures.exists(key)));
  }

  ensureFighterAnimations(animKey) {
    const entry = ASSET_MANIFEST.sprites?.[animKey];
    if (!entry?.animations || !this.anims) return;
    Object.entries(entry.animations).forEach(([name, config]) => {
      const key = `${animKey}.${name}`;
      if (this.anims.exists?.(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(animKey, { start: config.start, end: config.end }),
        frameRate: config.frameRate,
        repeat: config.repeat
      });
    });
  }

  playFighterAnim(actor, name, restart = true) {
    const sprite = actor?.sprite;
    if (!actor?.animKey || !sprite?.active || !sprite.scene || typeof sprite.play !== 'function') return;
    const key = `${actor.animKey}.${name}`;
    if (!this.anims?.exists?.(key)) return;
    sprite.play(key, restart);
    if (name !== 'idle' && sprite.once) {
      sprite.once('animationcomplete', () => this.playFighterAnim(actor, 'idle', true));
    }
  }

  resetCombatFxCursor() {
    this.lastRenderedStepCount = 0;
    this.lastRenderedStepHash = '';
  }

  playNewCombatFx(c, fighters, mobile) {
    const steps = Array.isArray(c.steps) ? c.steps : [];
    if (!steps.length) {
      this.resetCombatFxCursor();
      return;
    }

    const hash = this.combatStepsHash(steps);
    if (steps.length === this.lastRenderedStepCount && hash === this.lastRenderedStepHash) return;

    const from = steps.length > this.lastRenderedStepCount && this.lastRenderedStepHash
      ? this.lastRenderedStepCount
      : Math.max(0, steps.length - (mobile ? 4 : 6));
    const pending = steps.slice(from);
    this.lastRenderedStepCount = steps.length;
    this.lastRenderedStepHash = hash;

    pending.forEach((step, index) => this.playCombatStepFx(step, fighters, index, mobile));
  }

  combatStepsHash(steps) {
    return steps.map((step) => {
      const fx = Array.isArray(step.fx) ? step.fx : step.fx ? [step.fx] : [];
      return [
        step.actor,
        step.action?.id,
        step.result?.hit,
        step.result?.damage,
        step.result?.guarded,
        step.result?.takedown,
        fx.map((item) => [item.type, item.actor, item.damage || item.dmg || 0, item.label, item.icon, item.damageKind].join(':')).join('|')
      ].join('/');
    }).join('||');
  }

  playCombatStepFx(step, fighters, index, mobile) {
    const fxList = Array.isArray(step.fx) ? step.fx : step.fx ? [step.fx] : [];
    const actionActor = fighters[step.actor];
    if (actionActor && step.action?.type !== 'system') this.playFighterAnim(actionActor, this.actionAnimName(step), true);
    if (!fxList.length) return;
    fxList.forEach((fx, fxIndex) => {
      const actorSide = fx.fromSide || fx.actor || step.actor || 'player';
      const targetSide = fx.toSide || (actorSide === 'player' ? 'enemy' : 'player');
      const actor = fighters[actorSide] || fighters.player;
      const target = fighters[targetSide] || fighters.enemy;
      const delay = index * 135 + fxIndex * 70;
      if (fx.type === 'hit' || fx.type === 'break') {
        this.delayedFighterAnim(actor, 'attack', delay);
        this.delayedFighterAnim(target, 'hurt', delay + 90);
        this.delayedFighterAnim(actor, 'vfx', delay + 110);
        this.animateAttack(actor, target, delay, fx);
      }
      if (fx.type === 'miss' || fx.type === 'guard') {
        this.delayedFighterAnim(actor, fx.type === 'guard' ? 'vfx' : 'attack', delay);
        this.animateStep(actor, target, delay, fx);
      }
      if ((fx.damage || fx.dmg) > 0) this.floatCombatText(target.hitX, target.hitY, `-${fx.damage || fx.dmg}`, '#ff1745', mobile ? 32 : 42, delay + 120);
      const cue = this.fxCueText(fx);
      if (cue) this.floatCombatText(target.hitX, target.hitY - (mobile ? 42 : 58), cue.text, cue.color, cue.size, delay + 80);
      if (fx.type === 'hit' || fx.type === 'break') this.shakeTarget(target.sprite, delay, fx);
    });
  }

  actionAnimName(step) {
    const type = step.action?.type;
    const id = step.action?.id || '';
    if (type === 'strike' || type === 'grapple' || ['jab', 'straight', 'lowkick', 'takedown', 'palm', 'sidecontrol'].includes(id)) return 'attack';
    if (['guard', 'dodge', 'sprawl', 'advance', 'retreat', 'escape', 'dirtyescape', 'rest'].includes(id)) return 'vfx';
    return 'idle';
  }

  delayedFighterAnim(actor, name, delay) {
    if (!actor?.isAnimated) return;
    this.time.delayedCall(delay, () => {
      if (!actor.sprite?.active || !actor.sprite.scene) return;
      this.playFighterAnim(actor, name, true);
    });
  }

  animateAttack(actor, target, delay, fx) {
    const dir = target.x > actor.x ? 1 : -1;
    this.tweens.add({
      targets: actor.sprite,
      x: actor.x + dir * 34,
      y: actor.y - 8,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeOut',
      delay
    });
    if (fx.critical || fx.damageKind === 'heavy' || fx.type === 'break') this.shakeCamera(delay + 70, 0.0045, 90);
  }

  animateStep(actor, target, delay, fx) {
    if (fx.type === 'miss') {
      const dir = target.x > actor.x ? -1 : 1;
      this.tweens.add({ targets: target.sprite, x: target.x + dir * 22, duration: 70, yoyo: true, ease: 'Sine.easeOut', delay });
      return;
    }
    this.tweens.add({ targets: actor.sprite, scaleX: actor.sprite.scaleX * 1.04, scaleY: actor.sprite.scaleY * 1.04, duration: 80, yoyo: true, ease: 'Sine.easeOut', delay });
  }

  shakeTarget(sprite, delay, fx) {
    const strength = fx.critical || fx.damageKind === 'heavy' || fx.type === 'break' ? 12 : 7;
    this.tweens.add({
      targets: sprite,
      x: { from: sprite.x - strength, to: sprite.x + strength },
      duration: 38,
      repeat: 3,
      yoyo: true,
      ease: 'Sine.easeInOut',
      delay
    });
  }

  shakeCamera(delay, intensity, duration) {
    this.time.delayedCall(delay, () => {
      const cam = this.cameras?.main;
      if (cam?.shake) cam.shake(duration, intensity);
    });
  }

  fxCueText(fx) {
    const icon = String(fx.icon || '').toUpperCase();
    const label = String(fx.label || '');
    if (icon === 'MISS' || fx.type === 'miss') return { text: 'MISS', color: '#d8d2c3', size: 28 };
    if (icon === 'GUARD' || fx.blocked || fx.damageKind === 'blocked') return { text: 'GUARD', color: '#4bd7ff', size: 26 };
    if (icon === 'HEAVY' || fx.damageKind === 'heavy' || fx.critical) return { text: 'HEAVY', color: '#ffd84a', size: 30 };
    if (icon === 'DOWN' || /TAKEDOWN/i.test(label)) return { text: 'TAKEDOWN', color: '#ff1745', size: 30 };
    if (icon === 'BREAK' || icon === '!' || fx.type === 'break' || /眩|BREAK/i.test(label)) return { text: '眩晕', color: '#ff6b35', size: 28 };
    return null;
  }

  floatCombatText(x, y, text, color, size, delay = 0) {
    const t = this.add.text(x, y, text, {
      fontFamily: 'sans-serif',
      fontSize: `${size}px`,
      fontStyle: 'bold',
      color,
      stroke: '#050506',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(130).setAlpha(0);
    this.track(t);
    this.tweens.add({
      targets: t,
      y: y - 58,
      alpha: { from: 1, to: 0 },
      scale: { from: 0.9, to: 1.12 },
      duration: 820,
      ease: 'Quad.easeOut',
      delay,
      onStart: () => t.setAlpha(1),
      onComplete: () => t.destroy()
    });
  }

  fighterHud(x, y, w, name, unit) {
    this.track(polyPanel(this, x, y, w, 116, UI.black, UI.white, 45, 22));
    this.track(label(this, x + 22, y + 12, name, { size: 18, color: '#ffffff', depth: 55 }));
    this.track(bar(this, x + 22, y + 44, w - 44, 16, unit.hp, unit.hpMax, UI.red, `生命 ${Math.round(unit.hp)}/${Math.round(unit.hpMax)}`, 56));
    this.track(bar(this, x + 22, y + 68, w - 44, 16, unit.sp, unit.spMax, UI.yellow, `体力 ${Math.round(unit.sp)}/${Math.round(unit.spMax)}`, 56));
    this.track(bar(this, x + 22, y + 92, w - 44, 14, unit.posture, unit.postureMax, UI.blue, `架势 ${Math.round(unit.posture)}/${Math.round(unit.postureMax)}`, 56));
  }

  renderModal() {
    const { w, h } = this.size();
    const shade = this.add.graphics().setDepth(180);
    shade.fillStyle(0x000000, 0.72).fillRect(0, 0, w, h);
    this.track(shade);
    const m = this.model.modal;
    if (m.type === 'travel') return this.renderTravelModal(w, h);
    const mw = Math.min(720, w - 50);
    const mh = Math.min(420, h - 80);
    const x = (w - mw) / 2;
    const y = (h - mh) / 2;
    this.track(polyPanel(this, x, y, mw, mh, UI.black, UI.white, 181, 24));
    this.track(label(this, x + 34, y + 28, m.title || '结算', { size: 30, color: '#ffffff', depth: 190 }));
    if (m.body) this.track(label(this, x + 34, y + 76, wrapLines(m.body, 34), { size: 17, color: '#f6f0df', wrap: mw - 70, depth: 190 }));
    (m.lines || []).slice(0, 8).forEach((line, i) => {
      const text = typeof line === 'string' ? line : line.text;
      this.track(label(this, x + 40, y + 148 + i * 28, text, { size: 16, color: line.tone === 'bad' ? '#ff1745' : '#58ff95', depth: 190 }));
    });
    if (m.type === 'battleResult') {
      this.track(button(this, x + 34, y + mh - 74, 150, 48, '技术复盘', () => this.store.dispatch({ type: 'postReview', kind: 'tech' }), { active: true, depth: 190 }));
      this.track(button(this, x + 198, y + mh - 74, 150, 48, '冷静复盘', () => this.store.dispatch({ type: 'postReview', kind: 'calm' }), { depth: 190 }));
      this.track(button(this, x + 362, y + mh - 74, 150, 48, '情报复盘', () => this.store.dispatch({ type: 'postReview', kind: 'intel' }), { dark: true, depth: 190 }));
    } else {
      this.track(button(this, x + mw - 152, y + mh - 70, 120, 46, '知道了', () => this.store.dispatch({ type: 'closeModal' }), { active: true, depth: 190 }));
    }
  }

  renderTravelModal(w, h) {
    const to = this.model.selectedTravel;
    const mw = Math.min(860, w - 40);
    const x = (w - mw) / 2;
    const y = Math.max(50, h * 0.14);
    const cols = w < 620 ? 2 : 3;
    const cardGap = 14;
    const cardW = (mw - 68 - cardGap * (cols - 1)) / cols;
    const rowH = w < 620 ? 104 : 130;
    const rows = Math.ceil(this.model.travelOptions.length / cols);
    const modalH = Math.min(h - y - 24, 126 + rows * rowH + 74);
    this.track(polyPanel(this, x, y, mw, modalH, UI.black, UI.white, 181, 24));
    this.track(label(this, x + 34, y + 28, `去 ${LOCS[to]?.name || ''}`, { size: 30, color: '#ffffff', depth: 190 }));
    this.model.travelOptions.forEach((opt, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const bx = x + 34 + col * (cardW + cardGap);
      const by = y + 88 + row * rowH;
      this.track(button(this, bx, by, cardW, w < 620 ? 86 : 108, `${opt.icon} ${opt.name}\n${opt.quote.time}分钟 ￥${opt.quote.money}`, () => this.store.dispatch({ type: 'travel', loc: to, mode: opt.id }), { active: i === 0, size: w < 620 ? 13 : 16, depth: 190 }));
      this.track(label(this, bx + 12, by + (w < 620 ? 54 : 58), `体力-${opt.quote.sp} 体能+${opt.quote.fitXp}`, { size: w < 620 ? 10 : 12, color: '#d8d2c3', depth: 205, stroke: false }));
    });
    this.track(button(this, x + mw - 152, y + modalH - 70, 120, 46, '取消', () => this.store.dispatch({ type: 'closeModal' }), { dark: true, depth: 190 }));
  }

  renderToast(text) {
    const { w, h } = this.size();
    const y = w < 620 ? h - 174 : 110;
    this.track(polyPanel(this, w / 2 - 190, y, 380, 48, UI.paper, UI.red, 220, 12));
    this.track(label(this, w / 2, y + 13, text, { size: 17, color: '#050506', depth: 230, originX: 0.5, stroke: false }));
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      if (this.store.state?.ui?.toast === text) {
        this.store.state.ui.toast = null;
        this.render();
      }
    }, 1600);
  }
}
