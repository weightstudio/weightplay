import {BUNDLES} from './locales.js';
import {PAGE,SEGMENTS} from './page-copy.mjs';
import {RELATED} from './related.mjs';
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const faqFor=locale=>{const t=BUNDLES[locale],c=PAGE[locale];return [[t.faq[0],t.faq[1]],[t.faq[2],t.faq[3]],[c.cliffQuestion,t.mechanisms[1]],[c.windQuestion,t.mechanisms[2]+' '+t.kitInfo[3]],[c.saveQuestion,c.save]];};
export function renderStaticGuide(locale){
 const t=BUNDLES[locale],c=PAGE[locale];if(!t||!c)throw Error(`Missing guide locale ${locale}`);
 const p=text=>`<p>${escape(text)}</p>`,list=items=>`<ul>${items.map(text=>`<li>${escape(text)}</li>`).join('')}</ul>`;
 const sections=[p(t.guide[0]),p(t.guide[1])+p(c.example),p(t.guide[2])+list(t.mechanisms.map((rule,i)=>`${t.regionNames[i]}: ${rule}`))+list(t.kitInfo),p(t.guide[3])+p(t.auroraInfo)];
 return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-renderer="guide.mjs#renderStaticGuide" data-runtime-localize="off" aria-label="${escape(c.headings[1])}">
 <div class="game-info-hero" data-wp-content-slot="guide-title"><h2>${escape(c.title)}</h2><p>${escape(t.summary)}</p></div>
 <div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${c.tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div>
 <div id="guideFacts" class="game-info-facts" data-wp-content-slot="guide-facts">${['30 · '+t.stages,'6 · '+t.camp,'90 · '+t.seals].map(fact=>`<span>${escape(fact)}</span>`).join('')}</div>
 <div id="guideSections" class="game-info-sections" data-wp-content-slot="guide-sections">${sections.map((body,i)=>`<div class="game-info-section" data-guide-field="${['goal','howToPlay','controlsAndRules','finishingAndFeedback'][i]}"><h3>${escape(c.headings[i])}</h3>${body}</div>`).join('')}<div class="game-info-section"><h3>${escape(c.designTitle)}</h3>${p(c.design)}</div><div class="game-info-section"><h3>${escape(c.saveTitle)}</h3>${p(c.save)}</div></div>
 <div id="guideFaq" class="game-info-section" data-wp-content-slot="guide-faq"><h3>${escape(c.faqTitle)}</h3><dl>${faqFor(locale).map(([q,a])=>`<div><dt>${escape(q)}</dt><dd>${escape(a)}</dd></div>`).join('')}</dl></div>
 <div id="guideRelated" class="game-info-related-section" data-wp-content-slot="guide-related"><h3>${escape(c.related)}</h3><div class="game-info-related">${RELATED.map(game=>{if(!game.title[locale])throw Error(`Missing related title ${game.id}/${locale}`);return `<a href="/${SEGMENTS[locale]}/games/${game.id}/"><img src="${escape(game.poster)}" alt="" width="120" height="120" loading="lazy"><span>${escape(game.title[locale])}</span></a>`;}).join('')}</div></div></section>`;
}
