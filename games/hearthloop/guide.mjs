import { COPY, TITLES, escapeHTML } from './copy.mjs';
export function renderGuide(locale='en') {
  const c=COPY[locale];if(!c)throw new Error('HEARTHLOOP_LOCALE_MISSING:'+locale);
  return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-preserve-static-guide data-wp-guide-renderer="guide.mjs#renderGuide" aria-label="${escapeHTML(TITLES[locale])}"><h2 data-runtime-localize="off">${escapeHTML(TITLES[locale])}</h2><div class="game-info-sections">${c.guide.map((p,i)=>`<article class="game-info-section"><h3>${escapeHTML(c.guideHeadings[i])}</h3><p>${escapeHTML(p)}</p></article>`).join('')}<article class="game-info-section game-info-faq"><h3>${escapeHTML(c.guideHeadings[6])}</h3><dl>${c.faq.map(([q,a])=>`<dt>${escapeHTML(q)}</dt><dd>${escapeHTML(a)}</dd>`).join('')}</dl></article></div></section>`;
}
