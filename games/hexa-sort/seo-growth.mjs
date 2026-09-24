import { COPY, RELATED, ROUTES, SOURCE_URL, COMPARABLE_NAME, VERSION } from './seo-growth-data.mjs';

const alias = { 'zh-tw':'zh-Hant', 'zh-cn':'zh-Hans', 'pt-br':'pt-BR' };
const fallbackTitle = { 'animal-color-springs':'Color Springs', 'animal-color-link':'Color Link Garden' };
const normalize = value => COPY[value] ? value : (alias[String(value || '').toLowerCase()] || 'en');
const activeLocale = () => normalize(document.documentElement.lang || 'en');
const titleFor = (id, locale) => window.WEIGHTPLAY_GAME_TITLES?.[id]?.[locale] || window.WEIGHTPLAY_GAME_TITLES?.[id]?.en || fallbackTitle[id] || id;
const routeFor = locale => ROUTES[locale] || 'en';

function text(tag, value, className='') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}

function ensureTags(guide, copy) {
  let wrap = guide.querySelector('[data-hexa-growth-tags]');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.dataset.hexaGrowthTags = VERSION;
    wrap.className = 'game-info-tags';
    const heading = guide.querySelector('h2');
    heading?.insertAdjacentElement('afterend', wrap);
  }
  wrap.replaceChildren(...copy.tags.map(tag => text('span', tag)));
}

function ensureRelated(guide, locale, copy) {
  let section = guide.querySelector('[data-hexa-growth-related]');
  if (!section) {
    section = document.createElement('div');
    section.dataset.hexaGrowthRelated = VERSION;
    section.className = 'game-info-section';
    guide.append(section);
  }
  section.replaceChildren();
  section.append(text('h3', copy.relatedTitle), text('p', copy.relatedIntro));
  const cards = document.createElement('div');
  cards.className = 'game-info-related';
  for (const item of RELATED) {
    const a = document.createElement('a');
    a.className = 'game-info-related-card';
    a.dataset.wpRelatedId = item.id;
    a.href = `/${routeFor(locale)}/games/${item.id}/`;
    const img = document.createElement('img');
    img.src = item.image; img.alt = ''; img.width = 320; img.height = 320; img.loading = 'lazy'; img.decoding = 'async';
    const span = document.createElement('span'); span.className = 'game-info-related-copy';
    span.append(text('strong', titleFor(item.id, locale)), text('span', copy.related[item.id]));
    a.append(img, span); cards.append(a);
  }
  section.append(cards);
}

function ensureComparison(guide, locale, copy) {
  let section = guide.querySelector('[data-wp-market-comparison]');
  if (!section) {
    section = document.createElement('article');
    section.className = 'game-info-section';
    guide.append(section);
  }
  section.dataset.wpMarketComparison = VERSION;
  section.dataset.comparisonLocale = locale;
  section.dataset.runtimeLocalize = 'off';
  section.replaceChildren();
  section.append(text('h3', copy.comparisonTitle));
  const tags = document.createElement('div'); tags.className = 'game-info-tags'; tags.append(text('span', COMPARABLE_NAME));
  section.append(tags, text('p', copy.comparison), text('p', copy.disclaimer));
  const p = document.createElement('p');
  const a = document.createElement('a'); a.href = SOURCE_URL; a.rel = 'nofollow noopener noreferrer'; a.target = '_blank'; a.textContent = copy.source;
  p.append(a); section.append(p);
}

function syncShell(copy) {
  document.querySelector('#guide')?.setAttribute('aria-label', copy.shell.guideAria);
  document.querySelector('.lobby-return')?.setAttribute('aria-label', copy.shell.back);
  const label = document.querySelector('.locale-control .sr-only'); if (label) label.textContent = copy.shell.language;
  document.querySelector('#localeSelect')?.setAttribute('aria-label', copy.shell.language);
  document.querySelector('.stage-tabs')?.setAttribute('aria-label', copy.shell.stageNav);
  document.querySelector('#hexBoard')?.setAttribute('aria-label', copy.shell.board);
  document.querySelector('#stackTray')?.setAttribute('aria-label', copy.shell.tray);
}

export function applyHexaGrowth(locale = activeLocale()) {
  locale = normalize(locale);
  const copy = COPY[locale] || COPY.en;
  const guide = document.querySelector('#guide');
  if (!guide) return;
  guide.dataset.wpGuideComplete = 'true';
  guide.dataset.wpGuideDepth = 'true';
  ensureTags(guide, copy);
  ensureRelated(guide, locale, copy);
  ensureComparison(guide, locale, copy);
  syncShell(copy);
}

const apply = () => applyHexaGrowth(activeLocale());
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once:true }); else apply();
window.addEventListener('wonder:locale-change', apply);
