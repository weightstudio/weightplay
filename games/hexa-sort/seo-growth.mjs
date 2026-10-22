import { COPY, RELATED, ROUTES, VERSION } from './seo-growth-data.mjs';

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
  // The locale route ships its own localized tag row for first-response SEO.
  // Reuse that same row during runtime locale changes instead of appending a
  // second row beside it.
  let wrap = guide.querySelector('.game-info-tags[data-wp-gameplay-tags], [data-hexa-growth-tags]');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.dataset.wpGameplayTags = VERSION;
    wrap.className = 'game-info-tags';
    const heading = guide.querySelector('h2');
    heading?.insertAdjacentElement('afterend', wrap);
  }
  wrap.dataset.wpGameplayTags = VERSION;
  wrap.dataset.runtimeLocalize = 'off';
  wrap.replaceChildren(...copy.tags.map(tag => text('span', tag)));
}

function ensureRelated(guide, locale, copy) {
  let section = guide.querySelector('[data-hexa-growth-related]');
  const sections = guide.querySelector('.game-info-sections') || guide;
  if (!section) {
    section = document.createElement('div');
    sections.append(section);
  }
  section.dataset.hexaGrowthRelated = VERSION;
  section.dataset.runtimeLocalize = 'off';
  section.classList.add('game-info-section', 'game-info-related-section');
  section.replaceChildren();
  section.append(text('h3', copy.relatedTitle), text('p', copy.relatedIntro));
  const cards = document.createElement('div');
  cards.className = 'game-info-related';
  for (const item of RELATED) {
    const a = document.createElement('a');
    a.className = 'game-info-related-card';
    a.dataset.gameId = item.id;
    a.href = `/${routeFor(locale)}/games/${item.id}/`;
    const img = document.createElement('img');
    img.src = item.image; img.dataset.finalSrc = '/assets/weightplay-logo.png';
    img.alt = titleFor(item.id, locale); img.width = 320; img.height = 320; img.loading = 'lazy'; img.decoding = 'async';
    const poster = document.createElement('span'); poster.className = 'game-info-related-poster';
    poster.append(img);
    const span = document.createElement('span'); span.className = 'game-info-related-copy';
    const title = text('strong', titleFor(item.id, locale)); title.dataset.runtimeLocalize = 'off';
    span.append(title, text('span', copy.related[item.id]));
    a.append(poster, span); cards.append(a);
  }
  section.append(cards);
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
  syncShell(copy);
}

const apply = () => applyHexaGrowth(activeLocale());
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once:true }); else apply();
window.addEventListener('wonder:locale-change', apply);
