import { ACTIONS, LOCS, SKILLS } from '../content/data.js';
import { assetPath } from '../assets/manifest.js';
import { buildRenderModel } from '../simulation/state.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[ch]));
const round = (value) => Math.round(Number(value || 0));
const pct = (value) => `${Math.round(Number(value || 0) * 100)}%`;
const joined = (parts) => parts.filter(Boolean).join('');
const shortDist = (value) => String(value || '')
  .split('/')
  .filter(Boolean)
  .map((part) => ({ far: '远', mid: '中', close: '近', ground: '地' }[part] || part))
  .join('/');

const targetText = (value) => ({ head: '头', body: '身', leg: '腿' }[value] || value || '身');

function summaryChips(parts = [], className = '') {
  return parts.length
    ? `<div class="maws-summary-chips ${className}">${parts.map((part) => `<span>${esc(part)}</span>`).join('')}</div>`
    : '';
}

function effectChips(eff = {}) {
  const labels = {
    strikeDmg: '拳类伤害',
    kickDmg: '踢击伤害',
    dodge: '闪避',
    headRes: '头部保护',
    risk: '风险',
    auth: '真实性',
    jud: '判断',
    spd: '速度',
    str: '力量',
    end: '耐力',
    bal: '平衡',
    tou: '抗打',
    tec: '技巧'
  };
  return summaryChips(Object.entries(eff || {}).map(([key, value]) => `${labels[key] || key} ${Number(value) > 0 ? '+' : ''}${value}`), 'gain');
}

function btn(label, action, params = {}, className = '') {
  const disabled = className.split(/\s+/).includes('disabled');
  const attrs = Object.entries({ action, ...params })
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `data-${key}="${esc(value)}"`)
    .join(' ');
  return `<button type="button" class="${className}" ${attrs}${disabled ? ' disabled' : ''}>${label}</button>`;
}

function assetIcon(key, fallback = '', className = 'maws-asset-icon') {
  const src = key ? assetPath(key) : null;
  if (!src) return fallback ? `<i class="maws-fallback-icon">${esc(fallback)}</i>` : '';
  return `<img class="${className}" src="${esc(src)}" alt="" loading="lazy" decoding="async" />`;
}

function renderSceneCharacter(character) {
  const src = character.assetKey ? assetPath(character.assetKey) : null;
  const placeholderClass = character.assetKey?.startsWith('scene.npc.') ? 'placeholder-npc' : '';
  const loadAttrs = character.side === 'player' ? 'loading="eager" fetchpriority="high"' : 'loading="eager"';
  const art = src
    ? `<img src="${esc(src)}" alt="" ${loadAttrs} decoding="async" />`
    : `<span class="maws-scene-token">${esc(character.icon || character.name?.slice(0, 1) || '?')}</span>`;
  return `
    <figure class="maws-scene-character ${esc(character.side || 'npc')} ${esc(character.kind || 'portrait')} ${placeholderClass}">
      ${art}
      <figcaption><b>${esc(character.name)}</b><span>${esc(character.role)}</span></figcaption>
    </figure>
  `;
}

function renderCityMarker(marker) {
  const label = `${marker.icon || ''} ${marker.name || ''}`.trim();
  const status = marker.active ? '当前位置' : marker.closed ? '未开放' : '前往';
  const action = marker.active ? 'noop' : marker.closed ? 'toast' : 'openTravel';
  const params = marker.closed ? { text: `${marker.name}现在不开放` } : { loc: marker.id };
  const attrs = Object.entries({ action, ...params })
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `data-${key}="${esc(value)}"`)
    .join(' ');
  return `
    <button type="button" class="maws-city-marker ${marker.active ? 'active' : ''} ${marker.closed ? 'disabled' : ''}" style="--x:${Number(marker.x) || 50}%;--y:${Number(marker.y) || 50}%" aria-label="${esc(`${label} ${status} ${marker.openText || ''}`)}" ${attrs}>
      <span class="maws-city-marker-icon">${esc(marker.icon || marker.name?.slice(0, 1) || '?')}</span><b>${esc(marker.name || '')}</b><small>${esc(status)}</small>
      <span class="maws-city-marker-tip" aria-hidden="true"><strong>${esc(marker.name || '')}</strong><em>${esc(status)} · ${esc(marker.openText || '')}</em><i>${marker.active ? '你现在就在这里' : marker.closed ? '当前时段不能前往' : '点击选择出行方式'}</i></span>
    </button>
  `;
}

function resourceIconKey(label) {
  return {
    现金: 'icon.money',
    体力: 'icon.sp',
    健康: 'icon.hp',
    士气: 'icon.heat',
    真实性: 'icon.auth',
    名声: 'icon.fame',
    热度: 'icon.heat',
    体能沉淀: 'icon.fitXp',
    架势: 'icon.posture'
  }[label] || null;
}

function meter(label, value, max, iconKey = null) {
  const current = Number(value || 0);
  const limit = Math.max(1, Number(max || 1));
  const width = Math.max(0, Math.min(100, (current / limit) * 100));
  return `<div class="maws-meter"><span>${assetIcon(iconKey || resourceIconKey(label), '', 'maws-meter-icon')}${esc(label)}</span><b>${round(current)}/${round(limit)}</b><i style="width:${width}%"></i></div>`;
}

function renderBoot(model) {
  const origins = Object.entries(model.origins || {}).map(([id, origin], index) => `
    <article class="maws-origin">
      <strong>${esc(origin.icon)} ${esc(origin.name)}</strong>
      <p>${esc(origin.desc)}</p>
      <small>${esc(origin.trait)}</small>
      ${btn(index === 0 ? '从这里开局' : '选择开局', 'newGame', { origin: id }, 'primary')}
    </article>
  `).join('');
  return `
    <section class="maws-title">
      <div class="maws-title-copy">
        <p>30天，把能不能打这件事说清楚</p>
        <h1>了不起的武术模拟器</h1>
      </div>
      <div class="maws-origin-grid">${origins}</div>
      <div class="maws-title-actions">${btn('读取存档', 'loadGame', {}, 'ghost')}</div>
    </section>
  `;
}

function renderHud(model) {
  const resources = (model.resources || []).map(([label, value, icon]) => `
    <span class="maws-chip">${assetIcon(resourceIconKey(label), icon)}<b>${esc(label)}</b>${esc(value)}</span>
  `).join('');
  return `
    <header class="maws-hud">
      <div><strong>${esc(model.dayText)}</strong><span>${esc(model.phase)}</span></div>
      <div class="maws-resource-row">${resources}</div>
    </header>
  `;
}

function renderNav(model) {
  const tabs = (model.tabs || []).map((tab) => {
    const action = tab.id === 'map' ? 'openCityMap' : 'setTab';
    const params = tab.id === 'map' ? {} : { tab: tab.id };
    return btn(
      `<span>${assetIcon(tab.assetKey, tab.icon)}</span>${esc(tab.label)}`,
      action,
      params,
      `maws-tab ${model.tab === tab.id ? 'active' : ''}`
    );
  }).join('');
  return `
    <nav class="maws-nav">
      <div>${tabs}</div>
      <aside>${btn('睡觉', 'doAction', { id: 'sleep' }, 'dark')}${btn('保存', 'saveGame', {}, 'dark')}</aside>
    </nav>
  `;
}

function renderMap(model) {
  const locs = (model.locs || []).map((loc) => btn(
    `<b>${esc(loc.icon)} ${esc(loc.name)}</b><small>${loc.active ? '当前位置' : loc.closed ? '未开放' : '前往'}</small>`,
    loc.active ? 'noop' : loc.closed ? 'toast' : 'openTravel',
    loc.closed ? { text: `${loc.name}现在不开放` } : { loc: loc.id },
    `maws-loc ${loc.active ? 'active' : ''} ${loc.closed ? 'disabled' : ''}`
  )).join('');
  const actions = (model.actions || []).map((action) => `
    <article class="maws-action ${action.disabled ? 'disabled' : ''}">
      <div><strong>${esc(action.icon)} ${esc(action.name)}</strong><p>${esc(action.desc)}</p></div>
      ${summaryChips(action.summary?.cost || [], 'cost')}
      ${summaryChips(action.summary?.gain || [], 'gain')}
      ${action.summary?.risk ? `<small class="maws-risk-note">${esc(action.summary.risk)}</small>` : ''}
      ${btn(action.type === 'battle' ? '开打' : '行动', 'doAction', { id: action.id }, action.disabled ? 'disabled' : 'primary')}
    </article>
  `).join('');
  const taskBoard = renderTaskBoard(model);
  const scene = model.locationScene || {};
  const bg = assetPath(scene.backgroundKey);
  const bgUrl = bg ? `/${bg}` : '';
  const characters = (scene.characters || []).map(renderSceneCharacter).join('');
  const cityMap = model.cityMap || {};
  const cityBg = assetPath(cityMap.backgroundKey);
  const cityBgUrl = cityBg ? `/${cityBg}` : '';
  const cityMarkers = (cityMap.markers || []).map(renderCityMarker).join('');
  const cityOverlay = model.cityMapOpen ? `
    <div class="maws-city-overlay">
      <section class="maws-city-sheet">
        <div class="maws-city-sheet-head"><b>城市总览</b><span>${esc(scene.timeText || '')}</span>${btn('关闭', 'closeCityMap', {}, 'tiny')}</div>
        <div class="maws-city-map" ${cityBgUrl ? `style="--city-map-bg:url('${esc(cityBgUrl)}')"` : ''}>
          <div class="maws-city-map-shade"></div>
          <div class="maws-city-map-title"><b>城市动线</b><span>${esc(scene.timeText || '')}</span></div>
          <div class="maws-city-markers">${cityMarkers}</div>
        </div>
      </section>
    </div>
  ` : '';
  return `
    <section class="maws-map-shell">
      <section class="maws-location">
        <aside class="maws-loc-rail">
          <div class="maws-rail-title"><b>城市动线</b><span>${esc(scene.timeText || '')}</span>${btn('查看城市地图', 'openCityMap', {}, 'tiny maws-map-open')}</div>
          <div class="maws-locs">${locs}</div>
        </aside>
        <div class="maws-scene" ${bgUrl ? `style="--scene-bg:url('${esc(bgUrl)}')"` : ''}>
          <div class="maws-scene-shade"></div>
          <div class="maws-scene-info">
            <span>${esc(scene.timeText || '')} · ${esc(scene.openText || '')}</span>
            <h2>${esc(model.loc?.name)}</h2>
            <p>${esc(model.loc?.desc)}</p>
          </div>
          <div class="maws-scene-cast">${characters}</div>
        </div>
        <aside class="maws-action-rail">
          <div class="maws-rail-title"><b>现场能做</b><span>${esc((model.actions || []).length)}项</span></div>
          ${taskBoard}
          <div class="maws-actions">${actions}</div>
        </aside>
      </section>
      ${cityOverlay}
    </section>
  `;
}

function renderTaskBoard(model) {
  const main = model.mainEvent;
  const mainCard = main ? `
    <article class="maws-task-card main">
      <header><b>今日主线</b><span>${esc(main.locName)}${main.enemyName ? ` · ${esc(main.enemyName)}` : ''}</span></header>
      <strong>${esc(main.title)}</strong>
      <p>${esc(main.desc)}</p>
      ${btn(main.currentLoc ? '处理主线' : `前往${esc(main.locName)}`, 'startMainEvent', {}, 'primary')}
    </article>
  ` : `
    <article class="maws-task-card done">
      <header><b>今日主线</b><span>已收口</span></header>
      <p>没有新的主线节点。把训练、恢复和装备补上，别空耗一天。</p>
    </article>
  `;
  const todos = (model.opportunities || []).slice(0, 3).map((card) => `
    <article class="maws-task-card">
      <header><b>${esc(card.title)}</b><span>${esc(LOCS[card.loc]?.name || card.loc || '当前')}</span></header>
      <p>${esc(card.desc)}</p>
      <small>${esc(card.reason || '')}</small>
      ${btn(card.loc === model.loc?.id || !card.loc ? '处理待办' : `前往${esc(LOCS[card.loc]?.name || card.loc)}`, 'takeOpportunity', { id: card.id }, 'ghost')}
    </article>
  `).join('');
  return `<section class="maws-task-board">${mainCard}<div class="maws-task-list">${todos}</div></section>`;
}

function renderProfile(model) {
  const stats = Object.entries(model.statRules || {}).map(([key, rule]) => `
    <article class="maws-stat"><strong>${esc(rule.icon)} ${esc(rule.name)}</strong><b>${esc(model.player?.stats?.[key])}</b><p>${esc(rule.desc)}</p><small>${esc(rule.formula || '')}</small></article>
  `).join('');
  const styles = Object.entries(model.styleRules || {}).map(([key, rule]) => `
    <span class="maws-chip"><i>${esc(rule.icon)}</i><b>${esc(rule.name)}</b>${round(model.styles?.[key])}</span>
  `).join('');
  const resourceValue = {
    money: model.player?.money,
    fame: model.player?.fame,
    auth: model.player?.auth,
    heat: model.player?.heat,
    fitXp: `Lv${model.player?.fit?.level || 0} ${model.player?.fit?.progress || 0}/20`
  };
  const resources = Object.entries(model.resourceRules || {}).map(([key, rule]) => `
    <article class="maws-stat resource"><strong>${esc(rule.icon)} ${esc(rule.name)}</strong><b>${esc(resourceValue[key] ?? 0)}</b><p>${esc(rule.desc)}</p></article>
  `).join('');
  return `
    <section class="maws-panel">
      <div class="maws-panel-title"><h2>${esc(model.player?.name)}</h2><p>${esc(model.player?.origin?.name)} · ${esc(model.player?.trait)}</p></div>
      <div class="maws-vitals">${meter('健康', model.player?.hp, model.player?.hpMax)}${meter('体力', model.player?.sp, model.player?.spMax)}${meter('架势', model.player?.posture, model.player?.postureMax)}</div>
      <div class="maws-resource-row">${styles}</div>
      <div class="maws-stat-grid">${stats}</div>
      <div class="maws-panel-title small"><h2>资源注释</h2><p>这些不是装饰数字，它们会影响机会、风险、恢复和结局稳定性。</p></div>
      <div class="maws-stat-grid compact">${resources}</div>
    </section>
  `;
}

function renderSkillCard(skill, inCombat = false) {
  const preview = skill.preview || {};
  const disabled = inCombat && preview.unavailableReason;
  const damage = inCombat ? preview.damageText : skill.dmg;
  const posture = inCombat ? preview.postureText : skill.post;
  const hit = inCombat ? `${preview.hit || Math.round((skill.hit || 0) * 100)}%` : pct(skill.hit);
  const risk = inCombat ? `${preview.risk || Math.round((skill.risk || 0) * 100)}%` : pct(skill.risk);
  const dist = shortDist(inCombat ? preview.dist : (skill.dist || []).join('/'));
  const action = inCombat ? (disabled ? 'toast' : 'selectSkill') : (skill.equipped ? 'toast' : 'equipSkill');
  const params = inCombat
    ? (disabled ? { text: preview.unavailableReason } : { id: skill.id })
    : (skill.equipped ? { text: '已经装备' } : { id: skill.id });
  if (inCombat) {
    const cost = `${esc(skill.sp || 0)}/${esc(skill.ap || 1)}`;
    const no = String(skill.displayNo || 1).padStart(2, '0');
    const cardAttrs = Object.entries({ action, ...params })
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `data-${key}="${esc(value)}"`)
      .join(' ');
    return `
      <article class="maws-skill combat-card type-${esc(skill.style || 'neutral')} ${skill.selected ? 'active' : ''} ${disabled ? 'disabled' : ''}" ${cardAttrs} tabindex="0">
        <span class="maws-combat-card-no">${esc(no)}</span>
        <header><strong>${esc(skill.name)}</strong><small>${skill.selected ? '已入队' : disabled ? '不可用' : esc(skill.type)}</small></header>
        <dl class="maws-combat-key">
          <div><dt>效果</dt><dd>${esc(damage)} / 架${esc(posture)}</dd></div>
          <div><dt>命</dt><dd>${esc(hit)}</dd></div>
          <div><dt>体/AP</dt><dd>${cost}</dd></div>
        </dl>
        <div class="maws-skill-detail" role="tooltip">
          <p>${esc(skill.desc)}</p>
          <dl>
            <div><dt>架势</dt><dd>${esc(posture)}</dd></div>
            <div><dt>风险</dt><dd>${esc(risk)}</dd></div>
            <div><dt>距离</dt><dd>${esc(dist)}</dd></div>
          </dl>
          <span>${esc(preview.unavailableReason || skill.unavailableReason || `熟练度 ${round(skill.state?.p)}%`)}</span>
        </div>
        <footer>${btn(skill.selected ? '再加一次' : '加入', action, params, disabled ? 'disabled' : 'primary')}</footer>
      </article>
    `;
  }
  return `
    <article class="maws-skill ${skill.equipped || skill.selected ? 'active' : ''} ${disabled ? 'disabled' : ''}">
      ${assetIcon(skill.assetKey, '', 'maws-skill-art')}
      <header><strong>${assetIcon(skill.assetKey, skill.icon)} ${esc(skill.name)}</strong><small>${skill.equipped ? '已装备' : esc(skill.type)}</small></header>
      <p>${esc(skill.desc)}</p>
      <dl>
        <div><dt>伤害</dt><dd>${esc(damage)}</dd></div>
        <div><dt>架势</dt><dd>${esc(posture)}</dd></div>
        <div><dt>命中</dt><dd>${esc(hit)}</dd></div>
        <div><dt>体力</dt><dd>${esc(skill.sp)}</dd></div>
        <div><dt>风险</dt><dd>${esc(risk)}</dd></div>
        <div><dt>距离</dt><dd>${esc(dist)}</dd></div>
      </dl>
      <footer>
        <span>${esc(preview.unavailableReason || skill.unavailableReason || `熟练度 ${round(skill.state?.p)}%`)}</span>
        ${btn(inCombat ? '加入队列' : '装备', action, params, disabled ? 'disabled' : 'primary')}
      </footer>
    </article>
  `;
}

function renderSkills(model) {
  const slots = (model.equipSkills || []).map((slot) => `
    <span class="maws-slot">${slot.skill ? `${esc(slot.skill.icon)} ${esc(slot.skill.name)} ${btn('卸下', 'unequipSkill', { index: slot.index }, 'tiny')}` : '空槽'}</span>
  `).join('');
  return `
    <section class="maws-panel">
      <div class="maws-panel-title"><h2>技能卡</h2><p>伤害、架势、命中、体力、风险、距离和描述都来自当前模型。</p></div>
      <div class="maws-slots">${slots}</div>
      <div class="maws-card-grid">${(model.skills || []).map((skill) => renderSkillCard(skill)).join('')}</div>
    </section>
  `;
}

function renderBag(model) {
  const slots = (model.equipmentSlots || []).map((slot) => `
    <article class="maws-equip-slot ${slot.item ? 'filled' : ''}">
      <header><b>${esc(slot.name)}</b><span>${esc(slot.item?.cat || slot.empty)}</span></header>
      <strong>${slot.item ? `${assetIcon(slot.item.assetKey, slot.item.icon)} ${esc(slot.item.name)}` : '空槽'}</strong>
      <p>${slot.item ? esc(slot.item.desc) : `还没有装备${esc(slot.empty)}。`}</p>
      ${summaryChips(slot.effects || [], 'gain')}
      ${slot.item ? btn('卸下', 'unequipItem', { slot: slot.id }, 'tiny') : ''}
    </article>
  `).join('');
  const items = (model.inventory || []).map((entry) => `
    <article class="maws-item">
      <strong>${assetIcon(entry.item?.assetKey, entry.item?.icon)} ${esc(entry.item?.name)} x${esc(entry.count)}</strong>
      <p>${esc(entry.item?.desc)}</p>
      ${entry.item?.eff ? effectChips(entry.item.eff) : ''}
      ${btn(entry.item?.type === 'equipment' ? '装备' : '使用', 'useItem', { id: entry.id }, 'primary')}
    </article>
  `).join('') || '<p class="maws-empty">背包里没什么能派上用场的东西。</p>';
  return `
    <section class="maws-panel">
      <div class="maws-panel-title"><h2>装备与背包</h2><p>装备效果会进入属性和战斗结算；空槽先留给后续装备扩展。</p></div>
      <div class="maws-equipment-grid">${slots}</div>
      <div class="maws-panel-title small"><h2>背包物品</h2><p>补给会消耗，装备会挂到对应槽位。</p></div>
      <div class="maws-card-grid">${items}</div>
    </section>
  `;
}

function renderShop(model) {
  const items = (model.shopItems || []).map((item) => `
    <article class="maws-item"><strong>${assetIcon(item.assetKey, item.icon)} ${esc(item.name)}</strong><p>${esc(item.desc)}</p><small>￥${esc(item.price)} · 已有 ${esc(item.owned)}</small>${btn('购买', 'buyItem', { id: item.id }, item.price > model.player.money ? 'disabled' : 'primary')}</article>
  `).join('');
  return `<section class="maws-panel"><div class="maws-panel-title"><h2>商店</h2><p>先补短板，别乱买玄学。</p></div><div class="maws-card-grid">${items}</div></section>`;
}

function npcActionId(model, npcId) {
  return (ACTIONS[model.loc?.id] || []).find((action) => action.type === 'dialog' && action.npc === npcId)?.id || '';
}

function renderNpc(model) {
  const npcs = (model.npcs || []).map((npc) => {
    const actionId = npcActionId(model, npc.id);
    return `<article class="maws-item"><strong>${esc(npc.icon)} ${esc(npc.name)}</strong><p>关系 ${esc(npc.relation)}</p>${btn(actionId ? '聊几句' : '去对应地点', actionId ? 'doAction' : 'toast', actionId ? { id: actionId } : { text: '去对应地点更容易聊到重点' }, actionId ? 'primary' : 'ghost')}</article>`;
  }).join('');
  return `<section class="maws-panel"><div class="maws-panel-title"><h2>NPC</h2><p>关系对话仍走现有行动系统。</p></div><div class="maws-card-grid compact">${npcs}</div></section>`;
}

function renderLog(model) {
  const logs = (model.log || []).map((entry) => `<li><b>第${esc(entry.day)}天 ${esc(entry.time)}</b><span>${esc(entry.text)}</span></li>`).join('');
  const events = (model.eventLog || []).map((entry) => `<li><b>${esc(entry.type)}</b><span>${esc(entry.enemy || entry.text || entry.result)}</span></li>`).join('');
  return `<section class="maws-panel"><div class="maws-panel-title"><h2>日志</h2><p>行动、战斗和复盘记录。</p></div><div class="maws-log-cols"><ol>${logs}</ol><ol>${events}</ol></div></section>`;
}

function renderCheck(model) {
  const tests = [['E01', '基础拳击'], ['E06', 'MMA抱摔'], ['E07', '武器威胁'], ['E18', '终局陈见锋']];
  return `<section class="maws-panel"><div class="maws-panel-title"><h2>自检</h2><p>关键战斗入口直接走 store.dispatch。</p></div><div class="maws-check-row">${tests.map(([id, name]) => btn(`${id}<span>${esc(name)}</span>`, 'startBattle', { id }, 'primary')).join('')}</div><p class="maws-note">战斗记忆：总战斗 ${esc(model.combatMemory?.fights || 0)} / 胜 ${esc(model.combatMemory?.wins || 0)} / 风险胜利 ${esc(model.combatMemory?.riskWins || 0)}</p></section>`;
}

function renderMain(model) {
  if (model.tab === 'profile') return renderProfile(model);
  if (model.tab === 'skills') return renderSkills(model);
  if (model.tab === 'bag') return renderBag(model);
  if (model.tab === 'shop') return renderShop(model);
  if (model.tab === 'npc') return renderNpc(model);
  if (model.tab === 'log') return renderLog(model);
  if (model.tab === 'check') return renderCheck(model);
  return renderMap(model);
}

function renderCombat(model) {
  const combat = model.combat || {};
  const phaseLabel = combat.phase === 'auto' ? '自动交换中' : '暂停调整';
  const queueIds = combat.playerQueue?.length ? combat.playerQueue : combat.selected || [];
  const queue = queueIds.map((id) => SKILLS[id]?.name || id).join(' -> ') || '未选择，默认抱架';
  const targetControls = ['head', 'body', 'leg'].map((target) => btn(
    targetText(target),
    'setTarget',
    { target },
    `maws-target-option ${combat.target === target ? 'active' : ''}`
  )).join('');
  const cards = (model.equipSkills || []).filter((slot) => slot.skill).map((slot, index) => renderSkillCard({
    id: slot.id,
    ...slot.skill,
    displayNo: index + 1,
    state: slot.state,
    preview: slot.preview,
    selected: slot.selected,
    desc: slot.skill.desc
  }, true)).join('');
  const logs = (combat.log || []).slice(0, 6).map((line) => `<li>${esc(line)}</li>`).join('');
  const lastWindow = combat.lastWindow
    ? `上个窗口 ${esc(combat.lastWindow.duration)}秒 · ${esc(combat.lastWindow.stepCount || 0)}个动作`
    : '选卡后进入 8-12 秒自动交换';
  return `
    <section class="maws-combat-ui">
      <div class="maws-combat-top">
        <div>${meter(model.player?.name || '你', model.player?.hp, model.player?.hpMax)}${meter('体力', model.player?.sp, model.player?.spMax)}${meter('架势', model.player?.posture, model.player?.postureMax)}</div>
        <strong>第 ${esc(combat.round)} 回合 · ${esc(combat.enemy?.name)} · ${esc(shortDist(combat.distance))}</strong>
        <div>${meter(combat.enemy?.name || '对手', combat.enemy?.hp, combat.enemy?.hpMax)}${meter('体力', combat.enemy?.sp, combat.enemy?.spMax)}${meter('架势', combat.enemy?.posture, combat.enemy?.postureMax)}</div>
      </div>
      <aside class="maws-combat-log"><ol>${logs}</ol></aside>
      <details class="maws-combat-log-toggle"><summary>战斗记录</summary><ol>${logs}</ol></details>
      <div class="maws-combat-dock">
        <div class="maws-combat-planner">
          <div class="maws-combat-phase"><b>${esc(phaseLabel)}</b><span>战斗钟 ${esc(combat.clock || 0)}秒 · 窗口 ${esc(combat.windowCount || 0)}</span><small>${lastWindow}</small></div>
          <div class="maws-target-control" role="group" aria-label="攻击目标">${targetControls}</div>
          <div class="maws-queue">队列：${esc(queue)} ${btn('清空', 'clearSkills', {}, 'tiny')}</div>
        </div>
        <div class="maws-card-grid combat">${cards}</div>
        <div class="maws-combat-actions">${btn(combat.phase === 'auto' ? '结算中' : '执行窗口', 'confirmBattle', {}, combat.phase === 'auto' ? 'disabled' : 'primary')}${btn('认输', 'surrender', {}, 'dark')}</div>
      </div>
    </section>
  `;
}

function renderSettlementLine(line) {
  if (!line || typeof line !== 'object') return `<li class="maws-settle-line">${esc(line)}</li>`;
  const tone = ['good', 'bad', 'neutral'].includes(line.tone) ? line.tone : 'neutral';
  const group = String(line.group || 'misc').replace(/[^a-z0-9_-]/gi, '');
  const delta = Number(line.delta || 0);
  return `<li class="maws-settle-line ${tone} group-${esc(group)}"><span>${esc(line.label || line.key || '变化')}</span><b>${esc(line.text || `${delta > 0 ? '+' : ''}${delta}`)}</b></li>`;
}

function renderModalBody(body) {
  return String(body || '')
    .split('\n')
    .filter(Boolean)
    .map((line) => `<p>${esc(line)}</p>`)
    .join('');
}

function renderModal(model) {
  const modal = model.modal;
  if (!modal) return '';
  if (modal.type === 'travel') {
    const to = model.selectedTravel;
    const loc = LOCS[to];
    const options = (model.travelOptions || []).map((opt) => `
      <article class="maws-item"><strong>${esc(opt.icon)} ${esc(opt.name)}</strong><p>${esc(opt.desc)}</p><small>${esc(opt.quote.time)}分钟 · ￥${esc(opt.quote.money)} · 体力-${esc(opt.quote.sp)} · 体能+${esc(opt.quote.fitXp)}</small>${btn('出发', 'travel', { loc: to, mode: opt.id }, 'primary')}</article>
    `).join('');
    return `<div class="maws-modal"><section><h2>去 ${esc(loc?.name || '')}</h2><div class="maws-card-grid compact">${options}</div>${btn('取消', 'closeModal', {}, 'dark')}</section></div>`;
  }
  if (modal.type === 'trainingMini') {
    const choices = (modal.choices || []).map((choice) => `
      <article class="maws-training-choice">
        <strong>${esc(choice.label)}</strong>
        <p>${esc(choice.text)}</p>
        ${btn('按这个节奏完成', 'finishTraining', { grade: choice.grade }, choice.grade === 'solid' ? 'primary' : 'ghost')}
      </article>
    `).join('');
    return `
      <div class="maws-modal training">
        <section>
          <h2>${esc(modal.title || '训练')}</h2>
          <div class="maws-modal-body">
            <p>${esc(modal.prompt || '')}</p>
            ${summaryChips(modal.summary?.cost || [], 'cost')}
            ${summaryChips(modal.summary?.gain || [], 'gain')}
          </div>
          <div class="maws-card-grid compact">${choices}</div>
          <div class="maws-modal-actions">${btn('先不练', 'closeModal', {}, 'dark')}</div>
        </section>
      </div>
    `;
  }
  const lines = (modal.lines || []).map(renderSettlementLine).join('');
  const review = modal.type === 'battleResult'
    ? `<div class="maws-modal-actions">${btn('技术复盘', 'postReview', { kind: 'tech' }, 'primary')}${btn('冷静复盘', 'postReview', { kind: 'calm' }, 'ghost')}${btn('情报复盘', 'postReview', { kind: 'intel' }, 'dark')}</div>`
    : `<div class="maws-modal-actions">${btn('知道了', 'closeModal', {}, 'primary')}</div>`;
  return `<div class="maws-modal"><section><h2>${esc(modal.title || '提示')}</h2><div class="maws-modal-body">${renderModalBody(modal.body)}</div><ol class="maws-settle-list">${lines}</ol>${review}</section></div>`;
}

function render(model) {
  if (model.boot) return renderBoot(model);
  const body = model.combat
    ? renderCombat(model)
    : joined([renderHud(model), renderNav(model), `<main class="maws-main">${renderMain(model)}</main>`]);
  return joined([body, renderModal(model), model.toast ? `<div class="maws-toast">${esc(model.toast)}</div>` : '']);
}

function dispatchFromDataset(store, dataset) {
  const action = dataset.action;
  if (!action || action === 'noop') return;
  if (action === 'newGame') store.dispatch({ type: 'newGame', origin: dataset.origin });
  else if (action === 'loadGame') store.dispatch({ type: 'loadGame' });
  else if (action === 'setTab') store.dispatch({ type: 'setTab', tab: dataset.tab });
  else if (action === 'doAction') store.dispatch({ type: 'doAction', actionId: dataset.id });
  else if (action === 'startMainEvent') store.dispatch({ type: 'startMainEvent' });
  else if (action === 'takeOpportunity') store.dispatch({ type: 'takeOpportunity', id: dataset.id });
  else if (action === 'finishTraining') store.dispatch({ type: 'finishTraining', grade: dataset.grade });
  else if (action === 'saveGame') store.dispatch({ type: 'saveGame' });
  else if (action === 'openCityMap') store.dispatch({ type: 'openCityMap' });
  else if (action === 'closeCityMap') store.dispatch({ type: 'closeCityMap' });
  else if (action === 'toggleCityMap') store.dispatch({ type: 'toggleCityMap' });
  else if (action === 'openTravel') store.dispatch({ type: 'openTravel', loc: dataset.loc });
  else if (action === 'travel') store.dispatch({ type: 'travel', loc: dataset.loc, mode: dataset.mode });
  else if (action === 'closeModal') store.dispatch({ type: 'closeModal' });
  else if (action === 'toast') store.dispatch({ type: 'toast', text: dataset.text || null });
  else if (action === 'startBattle') store.dispatch({ type: 'startBattle', enemyId: dataset.id });
  else if (action === 'selectSkill') store.dispatch({ type: 'selectSkill', skillId: dataset.id });
  else if (action === 'clearSkills') store.dispatch({ type: 'clearSkills' });
  else if (action === 'setTarget') store.dispatch({ type: 'setTarget', target: dataset.target });
  else if (action === 'confirmBattle') store.dispatch({ type: 'confirmBattle' });
  else if (action === 'surrender') store.dispatch({ type: 'surrender' });
  else if (action === 'postReview') store.dispatch({ type: 'postReview', kind: dataset.kind });
  else if (action === 'buyItem') store.dispatch({ type: 'buyItem', itemId: dataset.id });
  else if (action === 'useItem') store.dispatch({ type: 'useItem', itemId: dataset.id });
  else if (action === 'unequipItem') store.dispatch({ type: 'unequipItem', slot: dataset.slot });
  else if (action === 'equipSkill') store.dispatch({ type: 'equipSkill', skillId: dataset.id });
  else if (action === 'unequipSkill') store.dispatch({ type: 'unequipSkill', index: Number(dataset.index) });
}

function emitClickFx(root, event, target) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const fx = document.createElement('span');
  fx.className = `maws-click-burst ${target.classList.contains('maws-city-marker') ? 'marker' : ''}`;
  fx.style.left = `${event.clientX}px`;
  fx.style.top = `${event.clientY}px`;
  for (let i = 0; i < 6; i += 1) {
    const spark = document.createElement('i');
    spark.style.setProperty('--i', i);
    fx.appendChild(spark);
  }
  document.body.appendChild(fx);
  target.classList.add('maws-click-hit');
  window.setTimeout(() => target.classList.remove('maws-click-hit'), 220);
  window.setTimeout(() => fx.remove(), 720);
}

export function initMawsDomUI(store, root) {
  if (!root) return;
  let toastTimer = null;
  const paint = () => {
    const model = buildRenderModel(store.state);
    root.className = model.combat ? 'maws-ui combat' : 'maws-ui';
    root.innerHTML = render(model);
    if (toastTimer) clearTimeout(toastTimer);
    if (model.toast) {
      toastTimer = setTimeout(() => {
        if (store.state?.ui?.toast === model.toast) store.dispatch({ type: 'toast', text: null });
      }, 1800);
    }
  };
  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target || !root.contains(target)) return;
    event.preventDefault();
    if (target.disabled) return;
    emitClickFx(root, event, target);
    dispatchFromDataset(store, target.dataset);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target.closest('[data-action]');
    if (!target || !root.contains(target) || target.tagName === 'BUTTON') return;
    event.preventDefault();
    target.click();
  });
  store.subscribe(paint);
  paint();
}
