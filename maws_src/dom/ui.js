import { ACTIONS, ENEMIES, LOCS, SKILLS } from '../content/data.js';
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

function skillUnlockSource(unlock) {
  if (!unlock) return '';
  if (unlock.sourceSummary) return unlock.sourceSummary;
  return [unlock.locationName, unlock.actionName].filter(Boolean).join(' · ');
}

function skillUnlockState(unlock, learned) {
  if (!unlock) return learned ? '已学会' : '来源未记录';
  if (unlock.initial) return 'initial · 开局已会';
  if (unlock.planned) return 'planned · 暂未接入真实训练来源';
  if (learned || unlock.learned) return '已学会';
  if (unlock.availableHere) return 'available · 当前位置可尝试';
  return `locked · ${unlock.lockReason || '按开放条件完成训练'}`;
}

function skillUnlockTitle(skill, unlock, learned) {
  if (unlock?.initial) {
    const source = skillUnlockSource(unlock).replace(/^开局已会\s*·\s*/, '');
    return `开局已会：${source || '家传旧招 / 基础生存技能'}`;
  }
  if (unlock?.planned) return `未学会：${skill.name}`;
  if (!learned) return `未学会：${skill.name}`;
  return `已学会：${skill.name}`;
}

function skillUnlockToast(skill, unlock, learned) {
  if (learned) return `熟练度 ${round(skill.state?.p)}%`;
  if (!unlock) return '来源：继续推进地点和主线';
  if (unlock.planned) return '暂未接入真实训练来源，后续由系统/战斗组补真实来源';
  if (unlock.initial) return skillUnlockTitle(skill, unlock, learned);
  return [
    `来源：${skillUnlockSource(unlock) || '继续推进地点和主线'}`,
    unlock.openCondition ? `开放条件：${unlock.openCondition}` : '',
    `状态：${skillUnlockState(unlock, learned)}`
  ].filter(Boolean).join(' / ');
}

function renderSkillUnlock(skill, unlock, learned) {
  if (!unlock && learned) return '';
  const title = skillUnlockTitle(skill, unlock, learned);
  const source = unlock?.planned ? '暂未接入真实训练来源' : (skillUnlockSource(unlock) || '继续推进地点和主线');
  const condition = unlock?.planned
    ? '后续由系统/战斗组补真实来源'
    : (unlock?.openCondition || (unlock?.initial ? '开局自带。' : '继续推进地点和主线。'));
  const state = skillUnlockState(unlock, learned);
  const classes = [
    'maws-skill-unlock',
    unlock?.initial ? 'initial' : '',
    unlock?.planned ? 'planned' : '',
    !learned && !unlock?.planned && !unlock?.initial ? 'locked' : ''
  ].filter(Boolean).join(' ');
  return `
    <div class="${classes}">
      <strong>${esc(learned ? title : source)}</strong>
      <dl>
        <div><dt>来源</dt><dd>${esc(source)}</dd></div>
        <div><dt>开放条件</dt><dd>${esc(condition)}</dd></div>
        <div><dt>状态</dt><dd>${esc(state)}</dd></div>
      </dl>
    </div>
  `;
}

function summaryChips(parts = [], className = '') {
  return parts.length
    ? `<div class="maws-summary-chips ${className}">${parts.map((part) => `<span>${esc(part)}</span>`).join('')}</div>`
    : '';
}

function shortSummaryText(parts = [], fallback = '') {
  return String((parts || []).find(Boolean) || fallback || '').trim();
}

function actionVisibleSummary(action = {}) {
  const bits = [
    Array.isArray(action.durationOptions) && action.durationOptions.length ? '时间可调' : (action.minutes ? `${action.minutes}分钟` : ''),
    shortSummaryText(action.summary?.cost || [], ''),
    shortSummaryText(action.summary?.gain || [], action.type === 'battle' ? '推进战斗与复盘' : '')
  ].filter(Boolean);
  return bits.slice(0, 3);
}

const rewardLabelAliases = {
  money: '现金',
  cash: '现金',
  calm: '冷静',
  misread: '误判',
  relation: '关系',
  relationship: '关系',
  skill: '技能'
};

function rewardChipKind(label = '', text = '', group = '') {
  const raw = `${label} ${text} ${group}`;
  if (/技能|学会|习得|掌握|招式|心法/.test(raw)) return 'skill';
  if (/关系|好感|信任|师徒|人情|结交/.test(raw)) return 'relation';
  if (/误判|热度|风险|伤|代价/.test(raw)) return 'risk';
  return 'gain';
}

function rewardChipFromText(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const normalized = raw.replace(/[：:]/g, ' ').replace(/\s+/g, ' ');
  const match = normalized.match(/^(.*?)([+＋-－]\s*\d+(?:\.\d+)?%?)\s*$/);
  const learned = normalized.match(/(?:学会|习得|掌握|解锁)\s*(?:了|：|:)?\s*(.+)$/);
  if (learned) {
    return { label: '学会', value: learned[1].trim(), text: raw, kind: 'skill' };
  }
  if (match) {
    const label = match[1].trim().replace(/[，,。.]$/, '') || '收益';
    const valueText = match[2].replace(/[＋－]/g, (ch) => (ch === '＋' ? '+' : '-')).replace(/\s+/g, '');
    return { label, value: valueText, text: raw, kind: rewardChipKind(label, valueText) };
  }
  if (/技能|关系|好感|信任|收益|获得|增加|提升|学会|习得|掌握/.test(normalized)) {
    const kind = rewardChipKind(normalized, normalized);
    const label = kind === 'skill' ? '技能' : kind === 'relation' ? '关系' : '收益';
    return { label, value: normalized.replace(/^(获得|增加|提升)\s*/, ''), text: raw, kind };
  }
  return null;
}

function rewardChipFromLine(line) {
  if (!line || typeof line !== 'object') return rewardChipFromText(line);
  const label = rewardLabelAliases[line.key] || line.label || line.key || line.group || '收益';
  const delta = Number(line.delta || 0);
  const text = line.text || (delta ? `${delta > 0 ? '+' : ''}${delta}` : '');
  const parsed = rewardChipFromText(`${label} ${text}`);
  return parsed ? { ...parsed, kind: rewardChipKind(label, text, line.group) } : null;
}

function collectRewardChips(modal = {}, limit = 5) {
  const items = [
    ...(modal.gain || []),
    ...(modal.summary?.gain || []),
    ...(modal.summaryChips || []),
    ...(modal.settlementLines || []),
    ...(modal.lines || [])
  ];
  const chips = [];
  const seen = new Set();
  items.forEach((item) => {
    const chip = rewardChipFromLine(item);
    if (!chip) return;
    const key = `${chip.kind}|${chip.label}|${chip.value}`;
    if (seen.has(key)) return;
    seen.add(key);
    chips.push(chip);
  });
  return chips
    .sort((a, b) => {
      const weight = { skill: 0, relation: 1, gain: 2, risk: 3 };
      return (weight[a.kind] ?? 4) - (weight[b.kind] ?? 4);
    })
    .slice(0, limit);
}

function renderRewardChips(chips = [], className = '') {
  if (!chips.length) return '';
  return `
    <div class="maws-reward-chips ${className}">
      ${chips.map((chip) => `
        <span class="maws-reward-chip ${esc(chip.kind)}">
          <i>${chip.kind === 'skill' ? 'NEW' : chip.kind === 'relation' ? 'LINK' : chip.kind === 'risk' ? '!' : '+'}</i>
          <b>${esc(chip.label)}</b>
          <strong>${esc(chip.value)}</strong>
        </span>
      `).join('')}
    </div>
  `;
}

function renderRewardStack(modal) {
  const chips = collectRewardChips(modal, 4);
  if (!chips.length) return '';
  return `<aside class="maws-reward-stack" aria-hidden="true">${renderRewardChips(chips, 'stack')}</aside>`;
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

function sceneCharacterInteraction(character, actions = []) {
  const relatedAction = actions.find((action) => (
    (character.id && action.npc === character.id) ||
    (character.id && action.enemy === character.id)
  ));
  const action = relatedAction && !relatedAction.disabled
    ? { action: 'doAction', id: relatedAction.id }
    : { action: 'toast', text: relatedAction?.disabledReason || relatedAction?.lockReason || `${character.name || '这个人'}现在没有可执行行动` };
  const label = relatedAction
    ? `${character.name || '角色'}：${relatedAction.name || '行动'}`
    : `${character.name || '角色'}：${character.role || '场景角色'}`;
  const attrs = Object.entries(action)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `data-${key}="${esc(value)}"`)
    .join(' ');
  return { attrs, label };
}

function renderSceneCharacter(character, actions = []) {
  const src = character.assetKey ? assetPath(character.assetKey) : null;
  const placeholderClass = character.assetKey?.startsWith('scene.npc.') ? 'placeholder-npc' : '';
  const loadAttrs = character.side === 'player' ? 'loading="eager" fetchpriority="high"' : 'loading="eager"';
  const interaction = sceneCharacterInteraction(character, actions);
  const art = src
    ? `<img src="${esc(src)}" alt="" ${loadAttrs} decoding="async" />`
    : `<span class="maws-scene-token">${esc(character.icon || character.name?.slice(0, 1) || '?')}</span>`;
  return `
    <figure class="maws-scene-character ${esc(character.side || 'npc')} ${esc(character.kind || 'portrait')} ${placeholderClass}" role="button" tabindex="0" aria-label="${esc(interaction.label)}" ${interaction.attrs}>
      ${art}
      <figcaption><b>${esc(character.name)}</b><span>${esc(character.role)}</span></figcaption>
    </figure>
  `;
}

function renderCityMarker(marker) {
  const label = `${marker.icon || ''} ${marker.name || ''}`.trim();
  const status = marker.active ? '当前位置' : marker.locked ? '暂未开放' : marker.closed ? '休息中' : '前往';
  const action = marker.active ? 'noop' : (marker.locked || marker.closed) ? 'toast' : 'openTravel';
  const params = (marker.locked || marker.closed) ? { text: marker.lockReason || `${marker.name}现在不开放` } : { loc: marker.id };
  const statusClass = marker.locked ? 'locked' : marker.closed ? 'disabled' : '';
  const tip = marker.locked ? (marker.lockReason || marker.unlockHint || '线索还不成熟') : marker.closed ? '当前时段不能前往' : '点击选择出行方式';
  const attrs = Object.entries({ action, ...params })
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `data-${key}="${esc(value)}"`)
    .join(' ');
  return `
    <button type="button" class="maws-city-marker ${marker.active ? 'active' : ''} ${statusClass}" style="--x:${Number(marker.x) || 50}%;--y:${Number(marker.y) || 50}%" aria-label="${esc(`${label} ${status} ${marker.openText || ''}`)}" ${attrs}>
      <span class="maws-city-marker-icon">${esc(marker.icon || marker.name?.slice(0, 1) || '?')}</span><b>${esc(marker.name || '')}</b><small>${esc(status)}</small>
      <span class="maws-city-marker-tip" aria-hidden="true"><strong>${esc(marker.name || '')}</strong><em>${esc(status)} · ${esc(marker.unlockHint || marker.openText || '')}</em><i>${esc(marker.active ? '你现在就在这里' : tip)}</i></span>
    </button>
  `;
}

function renderLocationCard(loc) {
  const status = loc.active ? '当前位置' : loc.locked ? '暂未开放' : loc.closed ? '休息中' : '已开放';
  const action = loc.active ? 'noop' : (loc.locked || loc.closed) ? 'toast' : 'openTravel';
  const params = (loc.locked || loc.closed) ? { text: loc.lockReason || `${loc.name}现在不开放` } : { loc: loc.id };
  const detail = loc.locked ? (loc.lockReason || loc.unlockHint) : loc.closed ? `开放 ${loc.openText || ''}` : (loc.unlockHint || loc.openText || '');
  const attrs = Object.entries({ action, ...params })
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `data-${key}="${esc(value)}"`)
    .join(' ');
  return `
    <button type="button" class="maws-loc ${loc.active ? 'active' : ''} ${loc.locked ? 'locked' : ''} ${loc.closed && !loc.locked ? 'closed' : ''} ${loc.mainHere ? 'main-here' : ''}" ${attrs}>
      <b>${esc(loc.icon || '')} ${esc(loc.name || '')}</b>
      <span><em>${esc(status)}</em><small>${esc(detail || '')}</small></span>
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

function renderHudChip([label, value, icon]) {
  const displayLabel = label === '热度' ? '风险' : label;
  const className = label === '热度' ? 'maws-chip risk' : 'maws-chip';
  return `<span class="${className}">${assetIcon(resourceIconKey(label), icon)}<b>${esc(displayLabel)}</b>${esc(value)}</span>`;
}

function primaryHudResources(resources = []) {
  const primary = new Set(['现金', '体力', '健康', '热度']);
  return resources.filter(([label]) => primary.has(label));
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
  const resources = primaryHudResources(model.resources || []).map(renderHudChip).join('');
  return `
    <header class="maws-hud maws-hud-compact">
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

function compactReason(reason = '') {
  return String(reason || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' / ');
}

function opportunityRiskText(card = {}) {
  const tags = Array.isArray(card.tags) ? card.tags : [];
  if (card.enemy) return `战斗 ${card.riskLabel || card.risk || ENEMIES[card.enemy]?.risk || '中'}`;
  const taggedRisk = tags.find((tag) => /风险|热度|伤病|风波|诱惑/.test(tag));
  if (taggedRisk) return taggedRisk;
  if (card.shop) return '支出/疲劳';
  if (card.kind === 'dialog') return '社交低风险';
  return card.risk || '普通';
}

function opportunityButtonLabel(card = {}, currentLoc = '') {
  const locName = LOCS[card.loc]?.name || card.loc || '当前地点';
  if (card.loc && card.loc !== currentLoc) return `前往${esc(locName)}`;
  if (card.enemy) return '开打';
  if (card.shop) return '去看看';
  return '处理';
}

function renderActionCard(action) {
  const hasDuration = Array.isArray(action.durationOptions) && action.durationOptions.length > 0;
  const visibleSummary = actionVisibleSummary(action);
  const details = `
    <p>${esc(action.desc)}</p>
    ${summaryChips(action.summary?.cost || [], 'cost')}
    ${summaryChips(action.summary?.gain || [], 'gain')}
    ${hasDuration ? summaryChips(['可选 30/60/90/120 分钟投入'], 'time') : ''}
    ${action.summary?.risk ? `<small class="maws-risk-note">${esc(action.summary.risk)}</small>` : ''}
  `;
  return `
    <article class="maws-action ${action.disabled ? 'disabled' : ''}">
      <div class="maws-action-core">
        <strong>${esc(action.icon)} ${esc(action.name)}</strong>
        ${hasDuration ? '<small class="maws-duration-tag">可调时长</small>' : ''}
        ${visibleSummary.length ? `<div class="maws-action-visible-summary">${visibleSummary.map((part) => `<span>${esc(part)}</span>`).join('')}</div>` : ''}
        <details class="maws-fold maws-action-detail">
          <summary>长描述 / 完整数值</summary>
          ${details}
        </details>
      </div>
      ${btn(action.type === 'battle' ? '开打' : '行动', 'doAction', { id: action.id }, action.disabled ? 'disabled' : 'primary')}
    </article>
  `;
}

function renderOpportunityCard(card, currentLoc) {
  const locName = LOCS[card.loc]?.name || card.loc || '当前地点';
  const reason = compactReason(card.reason);
  const buttonClass = card.loc && card.loc !== currentLoc ? 'ghost' : 'primary';
  return `
    <article class="maws-task-card maws-recommend-card">
      <header><b>${esc(card.title)}</b><span>${esc(locName)}</span></header>
      <p>${esc(locName)} · ${esc(opportunityRiskText(card))}</p>
      <details class="maws-fold maws-choice-fold maws-recommend-detail">
        <summary>为什么推荐</summary>
        <small>${reason ? `触发：${esc(reason)}` : '当前节奏适合这件事。'}</small>
      </details>
      ${btn(opportunityButtonLabel(card, currentLoc), 'takeOpportunity', { id: card.id }, buttonClass)}
    </article>
  `;
}

function renderTodayBoard(model) {
  const main = model.mainEvent;
  const injuries = model.player?.injuries?.length
    ? `伤病 ${model.player.injuries.length}`
    : '身体可用';
  const mainCard = main ? `
    <article class="maws-task-card main maws-director-card">
      <header><b>今日主线</b><span>${esc(main.locName)}${main.enemyName ? ` · ${esc(main.enemyName)}` : ''}</span></header>
      <strong>${esc(main.title)}</strong>
      <p>${esc(main.desc)}</p>
      ${btn(main.currentLoc ? '处理主线' : `前往${esc(main.locName)}`, 'startMainEvent', {}, 'primary')}
    </article>
  ` : `
    <article class="maws-task-card done maws-director-card">
      <header><b>今日主线</b><span>已收口</span></header>
      <p>没有新的主线节点。把训练、恢复和装备补上，别空耗一天。</p>
    </article>
  `;
  return `
    <section class="maws-today-stack">
      ${mainCard}
      <details class="maws-fold maws-today-status">
        <summary>今天状态 <span>${esc(model.loc?.name || '')}</span></summary>
        <div class="maws-card-meta"><span>${esc(model.dayText)}</span><span>${esc(model.locationScene?.timeText || '')}</span><span>${esc(model.locationScene?.openText || '')}</span><span>${esc(injuries)}</span></div>
      </details>
    </section>
  `;
}

function renderRecommendations(model) {
  const cards = (model.opportunities || []).slice(0, 3);
  if (!cards.length) {
    return `
      <section class="maws-recommend-board">
        <article class="maws-task-card done"><header><b>推荐行动</b><span>暂无</span></header><p>当前没有明显事件冒头，先把训练、恢复或装备补齐。</p></article>
      </section>
    `;
  }
  return `<section class="maws-recommend-board">${cards.map((card) => renderOpportunityCard(card, model.loc?.id)).join('')}</section>`;
}

function renderMap(model) {
  const currentActions = model.actions || [];
  const primaryAction = currentActions[0] ? renderActionCard(currentActions[0]) : '';
  const secondaryActions = currentActions.slice(1).map(renderActionCard).join('');
  const recommendations = renderRecommendations(model);
  const todayBoard = renderTodayBoard(model);
  const scene = model.locationScene || {};
  const bg = assetPath(scene.backgroundKey);
  const bgUrl = bg ? `/${bg}` : '';
  const characters = (scene.characters || []).map((character) => renderSceneCharacter(character, currentActions)).join('');
  const cityMap = model.cityMap || {};
  const cityBg = assetPath(cityMap.backgroundKey);
  const cityBgUrl = cityBg ? `/${cityBg}` : '';
  const cityMarkers = (cityMap.markers || []).map(renderCityMarker).join('');
  const locCards = (model.locs || []).map(renderLocationCard).join('');
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
        <aside class="maws-today-rail">
          <div class="maws-rail-title"><b>今日看板</b>${btn('城市地图', 'openCityMap', {}, 'tiny maws-map-open')}</div>
          ${todayBoard}
          <details class="maws-fold maws-loc-fold">
            <summary>地点列表 <span>${esc((model.locs || []).filter((loc) => !loc.locked).length)}处可去</span></summary>
            <div class="maws-locs">${locCards}</div>
          </details>
        </aside>
        <div class="maws-scene" ${bgUrl ? `style="--scene-bg:url('${esc(bgUrl)}')"` : ''}>
          <div class="maws-scene-shade"></div>
          <div class="maws-scene-info">
            <span>${esc(scene.timeText || '')} · ${esc(scene.openText || '')}</span>
            <h2>${esc(model.loc?.name)}</h2>
            <details class="maws-scene-desc">
              <summary>地点详情</summary>
              <p>${esc(model.loc?.desc)}</p>
            </details>
          </div>
          <div class="maws-scene-cast">${characters}</div>
        </div>
        <aside class="maws-action-rail maws-action-rail-main">
          <div class="maws-rail-title"><b>推荐行动</b><span>${esc((model.opportunities || []).length)}条</span></div>
          ${recommendations}
          <div class="maws-rail-title maws-current-actions-title"><b>当前地点关键行动</b><span>${esc(currentActions.length)}项</span></div>
          <div class="maws-actions maws-actions-primary">${primaryAction || '<p class="maws-empty">当前地点没有可执行行动。</p>'}</div>
          ${secondaryActions ? `
            <details class="maws-fold maws-action-fold">
              <summary>更多地点行动 <span>${esc(currentActions.length - 1)}项</span></summary>
              <div class="maws-actions">${secondaryActions}</div>
            </details>
          ` : ''}
        </aside>
      </section>
      ${cityOverlay}
    </section>
  `;
}

function renderMawPanel(model) {
  const maw = model.maw || {};
  const rule = maw.rules || {};
  const metrics = ['belief', 'misread', 'fatherMemory', 'reforge'].map((key) => `
    <article class="maws-maw-metric tone-${esc(key)}">
      <strong>${esc(rule[key]?.icon || '')} ${esc(rule[key]?.name || key)}</strong>
      <b>${esc(round(maw[key]))}</b>
      <p>${esc(rule[key]?.desc || '')}</p>
    </article>
  `).join('');
  const diary = maw.diaryAvailable ? `
    <article class="maws-diary-card">
      <header><strong>${esc(maw.diary?.title || '父亲日记')}</strong><span>已读</span></header>
      <p>${esc(maw.diary?.closing || '父亲留下的不是神功，是把真东西练出来。')}</p>
      ${btn('重读日记', 'openFatherDiary', {}, 'ghost')}
    </article>
  ` : '';
  const modules = (maw.moduleList || []).map((module) => `
    <article class="maws-reforge-card status-${esc(module.status)}">
      <header><strong>${esc(module.name)}</strong><b>${esc(module.value)}%</b></header>
      <div class="maws-reforge-bar"><i style="width:${Math.max(0, Math.min(100, Number(module.value || 0)))}%"></i></div>
      <p>${esc(module.desc)}</p>
      ${maw.revealed && module.next ? `<small>下一步：${esc(module.next.locName)} · ${esc(module.next.actionName)} / ${esc((module.next.skills || []).join('、'))}</small>` : '<small>父亲日记读完后，这里会变成训练清单。</small>'}
    </article>
  `).join('');
  const forms = (maw.forms || []).map((form) => `
    <article class="maws-form-card status-${esc(form.status)}">
      <header><strong>${esc(form.name)}</strong><span>${esc(form.statusText)} · ${esc(form.reforge || 0)}%</span></header>
      <small class="maws-form-status">${esc(form.moduleName)}</small>
      <p>${esc(form.note || '')}</p>
      <small class="maws-form-next">${esc(form.nextText || '')}</small>
    </article>
  `).join('');
  return `
    <section class="maws-reforge-panel ${maw.revealed ? 'revealed' : 'locked'}">
      <div class="maws-panel-title small"><h2>茂家拳重铸</h2><p>${esc(maw.chapterText || '')} · ${maw.revealed ? '把现实训练写回旧拳谱。' : 'Day 9 前先记录信念和误判，不把它当战力。'}</p></div>
      <div class="maws-maw-metrics">${metrics}</div>
      ${diary}
      <div class="maws-reforge-grid">${modules}</div>
      <div class="maws-form-grid">${forms}</div>
    </section>
  `;
}

function renderProfile(model) {
  const stats = Object.entries(model.statRules || {}).map(([key, rule]) => `
    <article class="maws-stat"><strong>${esc(rule.icon)} ${esc(rule.name)}</strong><b>${esc(model.player?.stats?.[key])}</b><p>${esc(rule.desc)}</p><small>${esc(rule.formula || '')}</small></article>
  `).join('');
  const styles = (model.styleList || []).map((style) => `
    <article class="maws-style-card">
      <strong><i>${esc(style.icon)}</i>${esc(style.name)}</strong>
      <b>${esc(style.value)}</b>
      <p>${esc(style.desc)}</p>
    </article>
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
      ${renderMawPanel(model)}
      <div class="maws-style-grid">${styles}</div>
      <div class="maws-stat-grid">${stats}</div>
      <div class="maws-panel-title small"><h2>资源注释</h2><p>这些不是装饰数字，它们会影响机会、风险、恢复和结局稳定性。</p></div>
      <div class="maws-stat-grid compact">${resources}</div>
    </section>
  `;
}

function renderSkillCard(skill, inCombat = false, unlock = null) {
  const preview = skill.preview || {};
  const disabled = inCombat && preview.unavailableReason;
  const learned = Boolean(skill.state);
  const sourceText = skillUnlockToast(skill, unlock, learned);
  const damage = inCombat ? preview.damageText : skill.dmg;
  const posture = inCombat ? preview.postureText : skill.post;
  const hit = inCombat ? `${preview.hit || Math.round((skill.hit || 0) * 100)}%` : pct(skill.hit);
  const risk = inCombat ? `${preview.risk || Math.round((skill.risk || 0) * 100)}%` : pct(skill.risk);
  const dist = shortDist(inCombat ? preview.dist : (skill.dist || []).join('/'));
  const action = inCombat ? (disabled ? 'toast' : 'selectSkill') : (!learned ? 'toast' : skill.equipped ? 'toast' : 'equipSkill');
  const params = inCombat
    ? (disabled ? { text: preview.unavailableReason } : { id: skill.id })
    : (!learned ? { text: sourceText } : skill.equipped ? { text: '已经装备' } : { id: skill.id });
  const useLine = inCombat
    ? `${esc(skill.type || '招式')} · ${esc(dist)} · ${esc(preview.unavailableReason || skill.unavailableReason || `熟练度 ${round(skill.state?.p)}%`)}`
    : `${esc(skill.desc || '用于战斗与训练判断。')}`;
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
        <p class="maws-combat-card-use">${useLine}</p>
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
    <article class="maws-skill ${skill.equipped || skill.selected ? 'active' : ''} ${!learned ? 'locked' : ''} ${disabled ? 'disabled' : ''}">
      ${assetIcon(skill.assetKey, '', 'maws-skill-art')}
      <header><strong>${assetIcon(skill.assetKey, skill.icon)} ${esc(skill.name)}</strong><small>${!learned ? '未学会' : skill.equipped ? '已装备' : esc(skill.type)}</small></header>
      <p class="maws-skill-use">${useLine}</p>
      <div class="maws-skill-brief">
        <span>${esc(learned ? `熟练度 ${round(skill.state?.p)}%` : sourceText)}</span>
        <span>${esc(learned ? (skill.equipped ? '已装备' : '可装备') : '待解锁')}</span>
      </div>
      <details class="maws-fold maws-skill-fold">
        <summary>${learned ? '长描述 / 完整数值' : '解锁详情 / 完整数值'}</summary>
        <p>${esc(skill.desc)}</p>
        ${renderSkillUnlock(skill, unlock, learned)}
        <dl>
          <div><dt>伤害</dt><dd>${esc(damage)}</dd></div>
          <div><dt>架势</dt><dd>${esc(posture)}</dd></div>
          <div><dt>命中</dt><dd>${esc(hit)}</dd></div>
          <div><dt>体力</dt><dd>${esc(skill.sp)}</dd></div>
          <div><dt>风险</dt><dd>${esc(risk)}</dd></div>
          <div><dt>距离</dt><dd>${esc(dist)}</dd></div>
        </dl>
      </details>
      <footer>
        <span>${esc(!learned ? sourceText : preview.unavailableReason || skill.unavailableReason || `熟练度 ${round(skill.state?.p)}%`)}</span>
        ${btn(inCombat ? '加入队列' : learned ? '装备' : '未学会', action, params, (!learned || disabled) ? 'disabled' : 'primary')}
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
      <div class="maws-card-grid">${(model.skills || []).map((skill) => renderSkillCard(skill, false, model.skillUnlocks?.[skill.id])).join('')}</div>
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
  const queueLimit = combat.queueLimit || 2;
  const queueIds = combat.playerQueue?.length ? combat.playerQueue : combat.selected || [];
  const queue = queueIds.map((id) => SKILLS[id]?.name || id).join(' -> ') || '未选择，默认抱架';
  const queueSlots = Array.from({ length: queueLimit }, (_, index) => {
    const id = queueIds[index];
    return `<span class="maws-queue-slot ${id ? 'filled' : ''}"><i>${index + 1}</i>${esc(id ? SKILLS[id]?.name || id : '待选')}</span>`;
  }).join('');
  const tell = combat.enemyTell || null;
  const tellDangerClass = tell?.danger === '高' ? 'high' : tell?.danger === '中' ? 'mid' : 'low';
  const tellTips = (tell?.tips || []).map((tip) => `<li>${esc(tip)}</li>`).join('');
  const counterHints = tell?.counterSkillNames?.length
    ? `<div class="maws-counter-hints"><span>推荐反制</span><strong>${tell.counterSkillNames.map((name) => esc(name)).join(' / ')}</strong></div>`
    : '';
  const enemyRead = tell ? `
    <div class="maws-combat-read danger-${tellDangerClass}">
      <b>敌人意图：${esc(tell.label)} <em>${esc(tell.danger || '低')}</em></b>
      <span>${esc(tell.tell || '')}</span>
      <small>预判 ${esc(tell.skillName || tell.skill || '行动')} · ${esc(tell.queueFit || '')} · ${esc(tell.recovery || '')}</small>
      ${counterHints}
      <p>${esc(tell.failure || '')}</p>
      <ol>${tellTips}</ol>
    </div>` : '';
  const objectives = (combat.objectiveList || []).length ? `
    <div class="maws-objective-strip">
      <b>终战目标</b>
      <div>
        ${(combat.objectiveList || []).map((objective) => `
          <span class="${objective.done ? 'done' : ''}" title="${esc(objective.desc || '')}"><i>${objective.done ? '✓' : '·'}</i> ${esc(objective.short || objective.label)}</span>
        `).join('')}
      </div>
    </div>
  ` : '';
  const targetControls = ['head', 'body', 'leg'].map((target) => btn(
    targetText(target),
    'setTarget',
    { target },
    `maws-target-option ${combat.target === target ? 'active' : ''}`
  )).join('');
  const equippedCards = (model.equipSkills || []).filter((slot) => slot.skill).map((slot, index) => ({
    id: slot.id,
    ...slot.skill,
    displayNo: index + 1,
    state: slot.state,
    preview: slot.preview,
    selected: slot.selected,
    desc: slot.skill.desc
  }));
  const selectedCards = equippedCards.filter((skill) => skill.selected);
  const standbyCards = equippedCards.filter((skill) => !skill.selected);
  const windowCards = [...selectedCards, ...standbyCards].slice(0, Math.max(1, Math.min(queueLimit, 2)));
  const windowIds = new Set(windowCards.map((skill) => skill.id));
  const drawerCards = equippedCards.filter((skill) => !windowIds.has(skill.id));
  const windowCardHtml = windowCards.map((skill) => renderSkillCard(skill, true)).join('');
  const drawerCardHtml = drawerCards.map((skill) => renderSkillCard(skill, true)).join('');
  const logs = (combat.log || []).slice(0, 6).map((line) => `<li>${esc(line)}</li>`).join('');
  const feedback = combat.lastWindow?.feedback;
  const feedbackPanel = `
    <aside class="maws-combat-feedback tone-${esc(feedback?.tone || 'neutral')}">
      <b>窗口反馈</b>
      <span>${esc(feedback?.text || '先读意图，再放 1-2 张动作卡。')}</span>
    </aside>`;
  const lastWindow = combat.lastWindow
    ? `上个窗口 ${esc(combat.lastWindow.duration)}秒 · ${esc(combat.lastWindow.stepCount || 0)}个动作 · ${esc(combat.lastWindow.pressure || '交换')}`
    : '';
  const currentWindow = tell
    ? `当前约 ${esc(tell.windowDuration)}秒 · ${tell.queueCount ? `${esc(tell.queueCount)}招入列` : '默认抱架观察'}`
    : '选卡后进入 8-12 秒自动交换';
  const phaseNote = [lastWindow, currentWindow].filter(Boolean).join(' / ');
  return `
    <section class="maws-combat-ui">
      <div class="maws-combat-top">
        <div>${meter(model.player?.name || '你', model.player?.hp, model.player?.hpMax)}${meter('体力', model.player?.sp, model.player?.spMax)}${meter('架势', model.player?.posture, model.player?.postureMax)}</div>
        <strong>第 ${esc(combat.round)} 回合 · ${esc(combat.enemy?.name)} · ${esc(shortDist(combat.distance))}</strong>
        <div>${meter(combat.enemy?.name || '对手', combat.enemy?.hp, combat.enemy?.hpMax)}${meter('体力', combat.enemy?.sp, combat.enemy?.spMax)}${meter('架势', combat.enemy?.posture, combat.enemy?.postureMax)}</div>
      </div>
      ${feedbackPanel}
      <details class="maws-combat-log-toggle"><summary>详细战斗记录</summary><ol>${logs}</ol></details>
      <div class="maws-combat-dock">
        <div class="maws-combat-planner">
          <div class="maws-combat-phase"><b>${esc(phaseLabel)}</b><span>战斗钟 ${esc(combat.clock || 0)}秒 · 窗口 ${esc(combat.windowCount || 0)} · 本窗口 ${esc(queueIds.length)}/${esc(queueLimit)} 槽</span><small>${phaseNote}</small></div>
          ${objectives}
          ${enemyRead}
          <div class="maws-target-control" role="group" aria-label="攻击目标">${targetControls}</div>
          <div class="maws-combat-queue" style="--queue-limit:${esc(queueLimit)}"><b>本窗口动作队列 <em>${esc(queueIds.length)}/${esc(queueLimit)}</em></b><div class="maws-queue-slots">${queueSlots}</div><small>${esc(queue)}</small>${btn('清空', 'clearSkills', {}, 'tiny')}</div>
        </div>
        <div class="maws-combat-window-cards">
          <b>本窗口行动卡</b>
          <div class="maws-card-grid combat focus">${windowCardHtml || '<p class="maws-empty">先装备技能，再选择本窗口动作。</p>'}</div>
        </div>
        <details class="maws-fold maws-tactics-drawer">
          <summary>更多动作 / 战术抽屉 <span>${esc(drawerCards.length)}张</span></summary>
          <div class="maws-card-grid combat">${drawerCardHtml || '<p class="maws-empty">没有更多可用动作。</p>'}</div>
        </details>
        <div class="maws-combat-actions">${btn(combat.phase === 'auto' ? '结算中' : '执行 1-2 招', 'confirmBattle', {}, combat.phase === 'auto' ? 'disabled' : 'primary')}${btn('认输', 'surrender', {}, 'dark')}</div>
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

function renderObjectiveResultLine(item) {
  if (!item || typeof item !== 'object') return `<li>${esc(item)}</li>`;
  return `
    <li class="${item.done ? 'done' : 'miss'}">
      <b>${item.done ? '✓' : '·'} ${esc(item.label || '')}<em>${esc(item.status || '')}</em></b>
      <span>${esc(item.desc || '')}</span>
    </li>
  `;
}

function renderModalBody(body) {
  return String(body || '')
    .split('\n')
    .filter(Boolean)
    .map((line) => `<p>${esc(line)}</p>`)
    .join('');
}

function modalBodyLines(body) {
  return String(body || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function renderModalShell(modal, inner, className = '') {
  const classes = ['maws-modal', className].filter(Boolean).join(' ');
  return `<div class="${classes}">${renderRewardStack(modal)}<section class="maws-modal-shell">${inner}</section></div>`;
}

function renderModalAction(action) {
  if (!action || !action.action) return '';
  return btn(action.label || '继续', action.action, action.params || {}, action.className || 'ghost');
}

function renderStoryChoiceModal(modal) {
  const bodyLines = modalBodyLines(modal.body);
  const lead = bodyLines[0] || '现在要做一个选择。';
  const moreBody = bodyLines.slice(1).map((line) => `<p>${esc(line)}</p>`).join('');
  const choices = (modal.choices || []).map((choice) => {
    const meta = [
      ...(choice.gainPreview || []),
      choice.danger,
      choice.locName ? `地点：${choice.locName}` : ''
    ].filter(Boolean);
    return `
      <article class="maws-story-choice">
        <strong>${esc(choice.label)}</strong>
        <p>${esc(choice.text)}</p>
        ${choice.hint || meta.length ? `
          <details class="maws-fold maws-choice-fold">
            <summary>收益 / 风险</summary>
            ${choice.hint ? `<small>${esc(choice.hint)}</small>` : ''}
            ${summaryChips(meta, choice.enemyName ? 'cost' : 'gain')}
          </details>
        ` : ''}
        ${btn('选择', 'resolveStoryChoice', { id: choice.id }, choice.enemyName ? 'primary' : 'ghost')}
      </article>
    `;
  }).join('');
  return renderModalShell(modal, `
    <header class="maws-rpg-title">
      <small>主线选择</small>
      <h2>${esc(modal.title || '主线选择')}</h2>
    </header>
    <p class="maws-scene-summary">${esc(lead)}</p>
    <div class="maws-choice-grid">${choices}</div>
    ${moreBody ? `<details class="maws-fold maws-modal-fold"><summary>背景详情</summary><div class="maws-modal-body">${moreBody}</div></details>` : ''}
  `, 'story');
}

function renderDialogueModal(modal) {
  const lines = Array.isArray(modal.lines) && modal.lines.length
    ? modal.lines
    : [{ speaker: modal.title || '对话', text: modal.body || '' }];
  const index = Math.max(0, Math.min(Number(modal.index || 0), lines.length - 1));
  const line = lines[index] || lines[0] || {};
  const isLast = index >= lines.length - 1;
  const choices = isLast ? (modal.choices || []) : [];
  const choiceCards = choices.map((choice) => {
    const meta = [
      ...(choice.gainPreview || []),
      choice.danger,
      choice.locName ? `地点：${choice.locName}` : ''
    ].filter(Boolean);
    return `
      <article class="maws-dialogue-choice">
        <strong>${esc(choice.label)}</strong>
        <p>${esc(choice.text)}</p>
        ${choice.hint || meta.length ? `
          <details class="maws-fold maws-choice-fold">
            <summary>收益 / 风险</summary>
            ${choice.hint ? `<small>${esc(choice.hint)}</small>` : ''}
            ${summaryChips(meta, choice.enemyName ? 'cost' : 'gain')}
          </details>
        ` : ''}
        ${btn('选这条路', 'resolveStoryChoice', { id: choice.id }, choice.enemyName ? 'primary' : 'ghost')}
      </article>
    `;
  }).join('');
  const settlement = isLast && !choices.length
    ? (modal.settlementLines || []).map(renderSettlementLine).join('')
    : '';
  const rewardChips = isLast && !choices.length ? collectRewardChips(modal, 4) : [];
  const history = lines.slice(0, index).map((prev) => `
    <li><b>${esc(prev.speaker || modal.title || '对话')}</b><span>${esc(prev.text || '')}</span></li>
  `).join('');
  const portrait = line.assetKey
    ? assetIcon(line.assetKey, line.icon || line.speaker?.slice(0, 1), 'maws-dialogue-portrait-img')
    : `<i class="maws-dialogue-portrait-fallback">${esc(line.icon || line.speaker?.slice(0, 1) || '?')}</i>`;
  const action = !isLast
    ? btn('下一句', 'advanceDialogue', {}, 'primary')
    : choices.length
      ? ''
      : btn(modal.actionLabel || '知道了', 'completeDialogue', {}, 'primary');
  return renderModalShell(modal, `
    <div class="maws-dialogue-stage">
      <div class="maws-dialogue-portrait">
        ${portrait}
        <strong>${esc(line.speaker || modal.title || '对话')}</strong>
        ${line.role ? `<em>${esc(line.role)}</em>` : ''}
      </div>
      <div class="maws-dialogue-box">
        <header class="maws-dialogue-nameplate">
          <span>${esc(line.speaker || modal.title || '对话')}</span>
          <b>${esc(`${index + 1}/${lines.length}`)}</b>
        </header>
        <p>${esc(line.text || modal.body || '')}</p>
      </div>
    </div>
    ${choiceCards ? `<div class="maws-dialogue-choices">${choiceCards}</div>` : ''}
    ${renderRewardChips(rewardChips, 'hero dialogue-gain')}
    ${action ? `<div class="maws-modal-actions">${action}</div>` : ''}
    ${history ? `<details class="maws-fold maws-modal-fold maws-dialogue-history"><summary>回看对话</summary><ol>${history}</ol></details>` : ''}
    ${settlement ? `<details class="maws-fold maws-modal-fold"><summary>查看收益 / 结算</summary><ol class="maws-settle-list">${settlement}</ol></details>` : ''}
  `, 'dialogue');
}

function renderFatherDiaryModal(modal) {
  const entries = (modal.entries || []).map((entry) => `
    <article class="maws-diary-entry">
      <strong>${esc(entry.date || '')}</strong>
      <p>${esc(entry.text || '')}</p>
    </article>
  `).join('');
  const lines = (modal.lines || []).map(renderSettlementLine).join('');
  const lead = modalBodyLines(modal.body)[0] || modal.closing || '旧纸页里只留下能立刻用上的线索。';
  return renderModalShell(modal, `
    <header class="maws-rpg-title">
      <small>旧纸页</small>
      <h2>${esc(modal.title || '父亲日记')}</h2>
    </header>
    <p class="maws-diary-lead">${esc(lead)}</p>
    <details class="maws-fold maws-modal-fold">
      <summary>日记全文</summary>
      <div class="maws-modal-body">${renderModalBody(modal.body)}</div>
      <div class="maws-diary-pages">${entries}</div>
      ${modal.closing ? `<p class="maws-diary-closing">${esc(modal.closing)}</p>` : ''}
      ${lines ? `<ol class="maws-settle-list">${lines}</ol>` : ''}
    </details>
    <div class="maws-modal-actions">${btn('合上日记', 'closeModal', {}, 'primary')}</div>
  `, 'diary');
}

function renderEventNotebookModal(modal) {
  const beats = (modal.beats || []).map((line, index) => `
    <li><b>${esc(String(index + 1).padStart(2, '0'))}</b><span>${esc(line)}</span></li>
  `).join('');
  const choices = (modal.choices || []).map((choice) => `
    <article class="maws-event-choice">
      <strong>${esc(choice.label || '处理这件事')}</strong>
      <p>${esc(choice.text || '')}</p>
      ${btn('确认', 'resolveEventNotebook', { id: choice.id || 'resolve' }, choice.kind === 'battle' ? 'primary' : 'ghost')}
    </article>
  `).join('');
  const meta = [
    modal.locName ? `地点：${modal.locName}` : '',
    modal.risk || '',
    modal.reason ? `触发：${modal.reason}` : ''
  ].filter(Boolean);
  const lead = modalBodyLines(modal.body)[0] || '现场已经有动静，先决定怎么处理。';
  return renderModalShell(modal, `
    <header class="maws-event-head maws-rpg-title">
      <small>${esc(modal.kicker || '事件笔记')}</small>
      <h2>${esc(modal.title || '现场事件')}</h2>
    </header>
    <p class="maws-scene-summary">${esc(lead)}</p>
    <div class="maws-choice-grid event">${choices}</div>
    <details class="maws-fold maws-modal-fold">
      <summary>现场细节 / 收益风险</summary>
      ${summaryChips(meta, 'cost')}
      <div class="maws-modal-body">${renderModalBody(modal.body)}</div>
      <ol class="maws-event-beats">${beats}</ol>
      <div class="maws-event-summary">
        ${summaryChips(modal.summary?.cost || [], 'cost')}
        ${summaryChips(modal.summary?.gain || [], 'gain')}
        ${modal.summary?.risk ? `<small>${esc(modal.summary.risk)}</small>` : ''}
      </div>
    </details>
    <div class="maws-modal-actions">${btn('先不处理', 'closeModal', {}, 'dark')}</div>
  `, 'event-notebook');
}

function renderDurationChoiceModal(modal) {
  const options = (modal.options || []).map((option) => {
    const meta = [
      `${option.minutes || 0}分钟`,
      `体力-${option.sp || 0}`,
      option.cost ? `现金-￥${option.cost}` : '现金0',
      `收益x${Number(option.multiplier || 1).toFixed(2)}`,
      option.riskText || ''
    ].filter(Boolean);
    return `
      <article class="maws-duration-choice ${esc(option.id || '')}">
        <strong>${esc(option.name || '标准 60m')}</strong>
        <p>${esc(option.note || '')}</p>
        ${summaryChips(meta, option.id === 'hard' ? 'cost' : 'gain')}
        ${summaryChips(option.gainPreview || [], 'gain')}
        ${btn('选择', 'chooseDuration', { id: modal.actionId, duration: option.id }, option.id === 'standard' ? 'primary' : 'ghost')}
      </article>
    `;
  }).join('');
  return renderModalShell(modal, `
    <header class="maws-rpg-title">
      <small>投入选择</small>
      <h2>${esc(modal.title || '行动')}</h2>
    </header>
    <p class="maws-modal-lead">${esc(modal.desc || '选择这次投入多久。')}</p>
    <div class="maws-duration-grid">${options}</div>
    <div class="maws-modal-actions">${btn('取消', 'closeModal', {}, 'dark')}</div>
  `, 'duration');
}

function renderModal(model) {
  const modal = model.modal;
  if (!modal) return '';
  if (modal.type === 'storyChoice') return renderStoryChoiceModal(modal);
  if (modal.type === 'dialogue') return renderDialogueModal(modal);
  if (modal.type === 'fatherDiary') return renderFatherDiaryModal(modal);
  if (modal.type === 'eventNotebook') return renderEventNotebookModal(modal);
  if (modal.type === 'durationChoice') return renderDurationChoiceModal(modal);
  if (modal.type === 'travel') {
    const to = model.selectedTravel;
    const loc = LOCS[to];
    const options = (model.travelOptions || []).map((opt) => `
      <article class="maws-item"><strong>${esc(opt.icon)} ${esc(opt.name)}</strong><p>${esc(opt.desc)}</p><details class="maws-fold maws-choice-fold"><summary>路程成本</summary><small>${esc(opt.quote.time)}分钟 · ￥${esc(opt.quote.money)} · 体力-${esc(opt.quote.sp)} · 体能+${esc(opt.quote.fitXp)}</small></details>${btn('出发', 'travel', { loc: to, mode: opt.id }, 'primary')}</article>
    `).join('');
    return renderModalShell(modal, `<h2>去 ${esc(loc?.name || '')}</h2><p class="maws-modal-lead">选一种过去的方式。</p><div class="maws-card-grid compact">${options}</div><div class="maws-modal-actions">${btn('取消', 'closeModal', {}, 'dark')}</div>`);
  }
  if (modal.type === 'trainingMini') {
    const rounds = Array.isArray(modal.rounds) ? modal.rounds : [];
    const roundIndex = Math.max(0, Math.min(Number(modal.roundIndex) || 0, Math.max(0, rounds.length - 1)));
    const round = rounds[roundIndex] || {};
    const historyCount = Array.isArray(modal.history) ? modal.history.length : 0;
    const scoreRatio = historyCount > 0 ? (Number(modal.score) || 0) / Math.max(1, historyCount * 2) : 0;
    const trend = historyCount <= 0 ? '未出手' : scoreRatio >= 0.8 ? '超额' : scoreRatio >= 0.5 ? '稳定' : '吃力';
    const progress = rounds.length ? Math.round((roundIndex / rounds.length) * 100) : 0;
    const choices = (round.options || []).map((choice) => `
      <article class="maws-training-choice">
        <strong>${esc(choice.label)}</strong>
        <p>${esc(choice.text)}</p>
        ${btn('选择这个处理', 'answerTraining', { id: choice.id }, 'primary')}
      </article>
    `).join('');
    return renderModalShell(modal, `
      <h2>${esc(modal.title || '训练')}</h2>
      <p class="maws-modal-lead">${esc(modal.prompt || round.cue || '按当前身体反馈做选择。')}</p>
      <div class="maws-training-status">
        <span>${esc(modal.templateLabel || '训练')}</span>
        <span>第 ${esc(roundIndex + 1)} / ${esc(Math.max(1, rounds.length))} 轮</span>
        <span>倾向：${esc(trend)}</span>
      </div>
      <div class="maws-training-meter"><i style="width:${esc(progress)}%"></i></div>
      ${modal.feedback ? `<div class="maws-training-feedback"><b>上一拍</b><span>${esc(modal.feedback.text || '')}</span></div>` : ''}
      <div class="maws-training-cue">${esc(round.cue || '按当前身体反馈做选择。')}</div>
      <div class="maws-training-choices">${choices}</div>
      <details class="maws-fold maws-modal-fold">
        <summary>成本 / 收益</summary>
        ${summaryChips(modal.summary?.cost || [], 'cost')}
        ${summaryChips(modal.summary?.gain || [], 'gain')}
      </details>
      <div class="maws-modal-actions">${btn('先不练', 'closeModal', {}, 'dark')}</div>
    `, 'training');
  }
  const lines = (modal.lines || []).map(renderSettlementLine).join('');
  const objectiveLines = (modal.objectiveLines || []).length
    ? `<ol class="maws-final-objectives">${modal.objectiveLines.map(renderObjectiveResultLine).join('')}</ol>`
    : '';
  const bodyLines = modalBodyLines(modal.body);
  const lead = bodyLines[0] || (modal.type === 'battleResult' ? '这场打完了。' : '需要确认一下。');
  const restBody = bodyLines.slice(1).map((line) => `<p>${esc(line)}</p>`).join('');
  const review = modal.type === 'battleResult'
    ? `<div class="maws-modal-actions">${btn('技术复盘', 'postReview', { kind: 'tech' }, 'primary')}${btn('冷静复盘', 'postReview', { kind: 'calm' }, 'ghost')}${btn('情报复盘', 'postReview', { kind: 'intel' }, 'dark')}</div>`
    : `<div class="maws-modal-actions">${btn('知道了', 'closeModal', {}, 'primary')}</div>`;
  if (modal.type === 'battleResult') {
    const rewardChips = collectRewardChips(modal, 5);
    return renderModalShell(modal, `
      <header class="maws-rpg-title">
        <small>结果</small>
        <h2>${esc(modal.title || '战斗结果')}</h2>
      </header>
      <p class="maws-scene-summary">${esc(lead)}</p>
      ${renderRewardChips(rewardChips, 'hero')}
      ${objectiveLines ? `<div class="maws-battle-learned"><b>你学到了什么</b>${objectiveLines}</div>` : '<div class="maws-battle-learned"><b>你学到了什么</b><p>复盘会把这场的判断写进下一步行动。</p></div>'}
      ${review}
      <details class="maws-fold maws-modal-fold">
        <summary>查看详细结算</summary>
        ${restBody ? `<div class="maws-modal-body">${restBody}</div>` : ''}
        ${lines ? `<ol class="maws-settle-list">${lines}</ol>` : ''}
      </details>
    `);
  }
  if (modal.type === 'settlement') {
    const resultActions = (modal.actions?.length ? modal.actions : [{ label: '继续行动', action: 'closeModal', className: 'primary' }])
      .map(renderModalAction)
      .join('');
    const cost = summaryChips(modal.cost || [], 'cost');
    const rewardChips = collectRewardChips(modal, 5);
    const gain = summaryChips(modal.gain || [], 'gain');
    const hasSummary = (modal.cost || []).length || (modal.gain || []).length || modal.risk;
    return renderModalShell(modal, `
      <small class="maws-result-kicker">${esc(modal.kicker || modal.title || '行动')}</small>
      <h2>${esc(modal.title || '结果')}</h2>
      <p class="maws-modal-lead">${esc(modal.lead || lead)}</p>
      ${renderRewardChips(rewardChips, 'hero')}
      <div class="maws-modal-actions">${resultActions}</div>
      <details class="maws-fold maws-modal-fold">
        <summary>详细结算</summary>
        ${hasSummary ? `
          <div class="maws-result-summary">
            <div><b>代价</b>${cost || '<small>没有额外代价</small>'}</div>
            <div><b>获得</b>${gain || '<small>状态已推进</small>'}</div>
            ${modal.risk ? `<small>${esc(modal.risk)}</small>` : ''}
          </div>
        ` : ''}
        ${restBody ? `<div class="maws-modal-body">${restBody}</div>` : ''}
        ${objectiveLines}
        ${lines ? `<ol class="maws-settle-list">${lines}</ol>` : ''}
        ${modal.logText ? `<p class="maws-result-log">${esc(modal.logText)}</p>` : ''}
      </details>
    `, 'result-feedback result-compact');
  }
  const rewardChips = collectRewardChips(modal, 5);
  return renderModalShell(modal, `
    <header class="maws-rpg-title">
      <small>结果</small>
      <h2>${esc(modal.title || '提示')}</h2>
    </header>
    <p class="maws-scene-summary">${esc(lead)}</p>
    ${renderRewardChips(rewardChips, 'hero')}
    ${review}
    <details class="maws-fold maws-modal-fold">
      <summary>查看详细结算</summary>
      ${restBody ? `<div class="maws-modal-body">${restBody}</div>` : ''}
      ${objectiveLines}
      ${lines ? `<ol class="maws-settle-list">${lines}</ol>` : ''}
    </details>
  `);
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
  else if (action === 'chooseDuration') store.dispatch({ type: 'chooseDuration', actionId: dataset.id, durationId: dataset.duration });
  else if (action === 'startMainEvent') store.dispatch({ type: 'startMainEvent' });
  else if (action === 'resolveStoryChoice') store.dispatch({ type: 'resolveStoryChoice', choiceId: dataset.id });
  else if (action === 'advanceDialogue') store.dispatch({ type: 'advanceDialogue' });
  else if (action === 'completeDialogue') store.dispatch({ type: 'completeDialogue' });
  else if (action === 'takeOpportunity') store.dispatch({ type: 'takeOpportunity', id: dataset.id });
  else if (action === 'resolveEventNotebook') store.dispatch({ type: 'resolveEventNotebook', choiceId: dataset.id });
  else if (action === 'answerTraining') store.dispatch({ type: 'answerTraining', optionId: dataset.id });
  else if (action === 'finishTraining') store.dispatch({ type: 'finishTraining', grade: dataset.grade });
  else if (action === 'openFatherDiary') store.dispatch({ type: 'openFatherDiary' });
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
