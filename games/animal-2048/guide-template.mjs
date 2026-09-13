// Content only. Shared game-page-info/frame CSS remains the sole guide skin.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function forestGuide(copy) {
  const text = key => {
    if (typeof copy?.[key] !== 'string' || !copy[key].trim()) throw new Error(`Missing Forest guide copy: ${key}`);
    return escape(copy[key]);
  };
  const field = (tag,key) => `<${tag} data-i18n="${key}">${text(key)}</${tag}>`;
  return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-guide-complete="true" data-runtime-localize="off" aria-label="${text('guideLabel')}" data-i18n-aria="guideLabel">
    <div class="game-info-hero"><div class="game-info-title">${field('h2','fullTitle')}${field('p','guideIntro')}</div></div>
    <div class="game-info-sections">
      <div class="game-info-section">${field('h3','guideHowTitle')}<ol>${field('li','tutorial1')}${field('li','tutorial2')}${field('li','guideHow5')}</ol>${field('p','tutorial3')}</div>
      <div class="game-info-section">${field('h3','guideMissionsTitle')}${field('p','rule3')}${field('p','guideCheckpoint')}</div>
      <div class="game-info-section">${field('h3','infiniteMode')}${field('p','faq5a')}</div>
      <div class="game-info-section">${field('h3','guideFaqTitle')}<dl><div>${field('dt','faq1q')}${field('dd','faq1a')}</div><div>${field('dt','faq3q')}${field('dd','faq3a')}</div></dl></div>
      <div class="game-info-section">${field('h3','guideSaveTitle')}${field('p','guideSave')}</div>
    </div>
  </section>`;
}
export function replaceForestGuide(html,copy) {
  const pattern=/<section\b[^>]*class="game-page-info game-page-info-static"[^>]*>[\s\S]*?<\/section>/;
  if (!pattern.test(html)) throw new Error('Forest guide slot missing');
  return html.replace(pattern,()=>forestGuide(copy));
}
