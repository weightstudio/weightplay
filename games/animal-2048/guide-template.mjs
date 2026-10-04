// Content only. Shared game-page-info/frame CSS remains the sole guide skin.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function forestGuide(copy, related = []) {
  const text = key => {
    if (typeof copy?.[key] !== 'string' || !copy[key].trim()) throw new Error(`Missing Forest guide copy: ${key}`);
    return escape(copy[key]);
  };
  const field = (tag,key) => `<${tag} data-i18n="${key}">${text(key)}</${tag}>`;
  if (!Array.isArray(copy?.tags) || copy.tags.length !== 3 || !Array.isArray(copy?.faqs) || copy.faqs.length !== 6) {
    throw new Error('Incomplete Forest Text Growth 1.4.0 copy');
  }
  if (related.length !== 2 || related.some(game => !game?.id || !game?.name || !game?.href || !game?.description)) {
    throw new Error('Incomplete Forest related-game copy');
  }
  const tags = `<div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${copy.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div>`;
  const faqs = copy.faqs.map(([question, answer]) => `<div><dt>${escape(question)}</dt><dd>${escape(answer)}</dd></div>`).join('');
  const relatedCards = related.map(game => `<a class="game-info-related-card" href="${escape(game.href)}" data-related-game="${escape(game.id)}"><strong>${escape(game.name)}</strong><span>${escape(game.description)}</span></a>`).join('');
  return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-guide-complete="true" data-runtime-localize="off" aria-label="${text('guideLabel')}" data-i18n-aria="guideLabel">
    <div class="game-info-hero"><div class="game-info-title">${field('h2','fullTitle')}${field('p','guideIntro')}</div></div>
    ${tags}
    <div class="game-info-sections">
      <div class="game-info-section"><h3>${text('overviewTitle')}</h3><p>${text('overview')}</p></div>
      <div class="game-info-section"><h3>${text('strategyTitle')}</h3><p>${text('strategy')}</p></div>
      <div class="game-info-section"><h3>${text('progressionTitle')}</h3><p>${text('progression')}</p></div>
      <div class="game-info-section"><h3>${text('repeatTitle')}</h3><p>${text('repeat')}</p></div>
      <div class="game-info-section"><h3>${text('faqTitle')}</h3><dl>${faqs}</dl></div>
      <div class="game-info-section">${field('h3','guideSaveTitle')}${field('p','guideSave')}</div>
      <div class="game-info-section game-info-related-section"><h3>${text('relatedTitle')}</h3><p>${text('relatedIntro')}</p><div class="game-info-related-cards">${relatedCards}</div></div>
    </div>
  </section>`;
}
export function replaceForestGuide(html,copy,related=[]) {
  const pattern=/<section\b[^>]*class="game-page-info game-page-info-static"[^>]*>[\s\S]*?<\/section>/;
  if (!pattern.test(html)) throw new Error('Forest guide slot missing');
  return html.replace(pattern,()=>forestGuide(copy,related));
}
