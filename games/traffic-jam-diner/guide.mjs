import {GAME_COPY} from './copy.mjs';
import {REBUILD_COPY} from './rebuild-copy.mjs';
import {FAQ_COPY} from './faq-copy.mjs';
import {OPTIMIZATION_COPY} from './optimization-copy.mjs';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function renderGuide(locale){
 const copy=GAME_COPY[locale]||GAME_COPY.en,extra=REBUILD_COPY[locale]||REBUILD_COPY.en,t=key=>escape(copy[key]);
 const facts=[['goalLabel','goal'],['puzzleLabel','puzzle'],['difficultyLabel','difficulty'],['timeLabel','time']];
 const sections=[['guideHowTitle','helpSteps'],['guideRulesTitle','guideRules'],['topicTitle','topic'],['saveTitle','save']];
 const faqCopy=FAQ_COPY[locale]||FAQ_COPY.en,faqBlock='<div class="game-info-section"><h3>'+escape(faqCopy.title)+'</h3><dl>'+faqCopy.items.map(([question,answer])=>'<div><dt>'+escape(question)+'</dt><dd>'+escape(answer)+'</dd></div>').join('')+'</dl></div>';
 return `<section class="game-page-info game-page-info-static" data-runtime-localize="off" data-wp-preserve-static-guide data-wp-guide-related-state="empty" data-wp-guide-renderer="guide.mjs#renderGuide" aria-label="${t('title')}">
 <div class="game-info-hero"><div class="game-info-title"><span class="game-info-kicker">WeightPlay</span><h2 data-wp-game-title>${t('title')}</h2><p>${t('guideSummary')}</p></div><div class="game-info-tags"><span>${t('tagLane')}</span><span>${t('tagOrder')}</span><span>${t('tagCampaign')}</span></div><div class="game-info-facts">${facts.map(([label,value])=>`<div class="game-info-fact"><span>${t(label)}</span><strong>${t(value)}</strong></div>`).join('')}</div></div>
 <div class="game-info-sections">${sections.map(([heading,key])=>`<div class="game-info-section"><h3>${t(heading)}</h3><p>${escape(extra[key]||copy[key])}${key==='guideRules'?' '+escape(OPTIMIZATION_COPY[locale].helpOptimization):''}</p></div>`).join('')}${faqBlock}</div></section>`;
}
