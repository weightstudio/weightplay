import {TEXT} from './locales.mjs';
import {RELATED} from './related.mjs';
export const SEGMENTS={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
export const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderStaticGuide(locale){const t=TEXT[locale];if(!t)throw Error('GUIDE_LOCALE_REQUIRED');const e=escape;
 return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-renderer="guide.mjs#renderStaticGuide" data-wp-guide-locale="${locale}" aria-label="${e(t.guideLabel)}">
<div id="gameGuideTitle" class="game-info-hero" data-wp-content-slot="guide-title"><h2>${e(t.guideLabel)}</h2><p>${e(t.summary)}</p><div class="game-info-tags">${t.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div></div>
<div id="gameGuideFacts" class="game-info-facts" data-wp-content-slot="guide-facts">${[[t.puzzles,'30'],[t.scenes,'6'],[t.undo,t.free],[t.controls,'']].map(([label,value])=>`<div class="game-info-fact"><strong>${e(value||label)}</strong>${value?e(label):''}</div>`).join('')}</div>
<div id="gameGuideSections" class="game-info-sections" data-wp-content-slot="guide-sections">${t.guide.map((p,i)=>`<section class="game-info-section"><h3>${e(t.guideTitles[i])}</h3><p>${e(p)}</p></section>`).join('')}</div>
<div id="gameGuideFaq" data-wp-content-slot="guide-faq"><section class="game-info-faq"><h3>${e(t.help)}</h3>${t.faqQuestions.map((q,i)=>`<details><summary>${e(q)}</summary><p>${e(t.faqAnswers[i])}</p></details>`).join('')}</section></div>
<div id="gameGuideRelated" class="game-info-related-section" data-wp-content-slot="guide-related"><h3>${e(t.relatedLabel)}</h3><div class="game-info-related">${RELATED.map(r=>`<a class="game-info-related-card" data-game-id="${r.id}" href="/${SEGMENTS[locale]}/games/${r.id}/"><span class="game-info-related-poster"><img src="${r.poster}" width="160" height="160" loading="lazy" alt="${e(r.titles[locale])}"></span><span class="game-info-related-copy"><strong>${e(r.titles[locale])}</strong></span></a>`).join('')}</div></div></section>`;
}
export function renderGuide(t,locale){document.getElementById('gameGuide').outerHTML=renderStaticGuide(locale);}
