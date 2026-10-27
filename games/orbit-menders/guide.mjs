import { getPublicationCopy } from './publication-copy.mjs';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

// Pure renderer for the shared source-owned Guide contract. No DOM, timers,
// storage, game boot, English fallback or gameplay-state mutation.
export function renderGuide(locale) {
  const c = getPublicationCopy(locale);
  const section = (heading, body, level = 3) => `<div class="game-info-section"><h${level}>${escape(heading)}</h${level}><p>${escape(body)}</p></div>`;
  const faq = c.faqs.map(([question, answer]) => `<dt>${escape(question)}</dt><dd>${escape(answer)}</dd>`).join('');
  return `<section id="guide" class="game-page-info game-page-info-static" lang="${escape(locale)}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}" data-runtime-localize="off" data-wp-guide-locale="${escape(locale)}" data-wp-guide-locales="./publication-copy.mjs#publicationCopy" data-wp-guide-renderer="./guide.mjs#renderGuide" aria-label="${escape(c.guideAria)}">${section(c.introTitle, c.intro, 2)}${section(c.controlsTitle, c.controls)}${section(c.saveTitle, c.save)}<div class="game-info-section"><h3>${escape(c.faqTitle)}</h3><dl>${faq}</dl></div></section>`;
}
