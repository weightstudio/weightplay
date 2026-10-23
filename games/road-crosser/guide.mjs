import { EXTRA } from './copy.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderRoadCrosserGuide(locale, copy) {
  const extra = EXTRA[locale] || EXTRA.en;
  const section = (title, body) => `<article class="game-info-section"><h3>${escape(title)}</h3>${body}</article>`;
  const p = value => `<p>${escape(value)}</p>`;
  return `<section class="game-page-info game-page-info-static" data-wp-game-guide aria-labelledby="roadGuideTitle"><div class="game-info-title"><span class="game-info-kicker">${escape(copy.guideLabel)}</span><h2 id="roadGuideTitle">${escape(copy.guideTitle)}</h2>${p(copy.mainIntro)}</div><div class="game-info-sections">${section(copy.controlsTitle, `<ol>${[copy.how1,copy.how2,copy.how3,extra.footprints].map(v=>`<li>${escape(v)}</li>`).join('')}</ol>`)}${section(copy.growthTitle,p(copy.growth)+`<ol>${extra.routes.map(v=>`<li>${escape(v)}</li>`).join('')}</ol>`+p(extra.river)+p(extra.signalStop))}${section(extra.mastery,p(extra.masteryBody)+p(extra.scoreRules))}${section(extra.camp,p(extra.auroraBody)+p(extra.buyQuestion))}${section(extra.campTitle,p(extra.saveInfo))}</div></section>`;
}
