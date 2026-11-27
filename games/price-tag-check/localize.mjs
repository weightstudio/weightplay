import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { copies, routeLanguages } from './copy.mjs?wp-media=f2e6f208e6c2c8f1';
import { guideSections, toolNotes } from './guide.mjs?wp-media=f2e6f208e6c2c8f1';

const site = 'https://weightplay.com';
const game = 'price-tag-check';
const cover = '/games/price-tag-check/assets/cover.webp?wp-media=f2e6f208e6c2c8f1';
const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const route = (locale, id = game) => '/' + locale + '/games/' + id + '/';

function guide(copy, notes, slug, available) {
  const [goal, how, rules, finishing, win] = guideSections[routeLanguages[slug]];
  const section = (title, content) => '<article class="game-info-section"><h3>' +
    escape(title) + '</h3>' + content + '</article>';
  const paragraph = (value, attributes = '') => '<p' + attributes + '>' + escape(value) + '</p>';
  const faq = '<dl>' + [1, 2].map(i => '<dt>' + escape(notes['q' + i]) + '</dt><dd>' +
    escape(notes['a' + i]) + '</dd>').join('') + '</dl>';
  const games = ['parcel-pact', 'animal-acorn-auction', 'folio-relay'].map(id => available.find(entry =>
    entry.id === id && entry.status === 'playable' && !entry.internalOnly)).filter(Boolean);
  const cards = games.map(entry => '<a class="game-info-related-card" data-wp-related-id="' + entry.id +
    '" href="' + route(slug, entry.id) + '"><span class="game-info-related-poster"><img width="96" height="96" loading="lazy" src="/' +
    escape(entry.art.background) + '" alt=""></span><span>' +
    escape(entry.title?.[routeLanguages[slug]] || entry.title?.en) + '</span></a>').join('');
  return '<h2 id="guideTitle">' + escape(copy.guide) + '</h2>' +
    section(goal, paragraph(copy.summary, ' data-wp-intro-faq-source')) +
    section(how, paragraph(notes.play)) +
    section(rules, paragraph(notes.either)) +
    section(finishing, paragraph(win)) +
    section(notes.news, paragraph(notes.event) + paragraph(notes.fiction)) +
    '<article class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>' +
    escape(notes.related) + '</h3><div class="game-info-related-cards">' + cards + '</div></article>' +
    section(copy.help, faq);
}

export function renderEntry(locale) {
  const slug = Object.entries(routeLanguages).find(([, lang]) => lang === locale)?.[0];
  if (!slug || !Object.hasOwn(copies, locale)) throw new Error('Unknown Price Tag Check locale: ' + locale);
  const context = { window: {} };
  runInNewContext(read('../../src/lobby-data.js?wp-media=f2e6f208e6c2c8f1'), context, { timeout: 3500 });
  const available = context.window.WONDER_LOBBY.games;
  const card = available.find(entry => entry.id === game);
  const copy = copies[locale];
  const notes = toolNotes[locale];
  const genre = card.type[locale];
  const title = copy.title + ' – ' + genre + ' | WeightPlay';
  const publicGame = card.status === 'playable' && !card.internalOnly && !card.internalTrial;
  const canonical = site + route(slug);
  const image = site + cover;
  const graph = [
    { '@type': 'VideoGame', name: copy.title, genre, description: copy.summary, url: canonical, image,
      inLanguage: locale, isAccessibleForFree: true, gamePlatform: 'Web browser',
      publisher: { '@type': 'Organization', name: 'WeightPlay', url: site } },
    { '@type': 'FAQPage', inLanguage: locale, mainEntity: [1, 2].map(i => ({
      '@type': 'Question', name: notes['q' + i], acceptedAnswer: { '@type': 'Answer', text: notes['a' + i] }
    })) }
  ];
  const social = { title, description: copy.summary, image, url: canonical, type: 'website', site_name: 'WeightPlay' };
  if (publicGame && card.previewVideo) {
    social.video = site + '/' + card.previewVideo;
    social['video:type'] = 'video/webm';
  }
  const meta = [
    '<title data-runtime-localize="off">' + escape(title) + '</title>',
    '<meta name="robots" content="' + (publicGame ? 'index,follow' : 'noindex,nofollow,noarchive') + '">',
    '<meta name="description" content="' + escape(copy.summary) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    ...Object.entries(routeLanguages).map(([key, language]) =>
      '<link rel="alternate" hreflang="' + language + '" href="' + site + route(key) + '">'),
    '<link rel="alternate" hreflang="x-default" href="' + site + route('en') + '">',
    ...Object.entries(social).map(([key, value]) => '<meta property="og:' + key + '" content="' + escape(value) + '">'),
    ...Object.entries({ card: 'summary_large_image', title, description: copy.summary, image }).map(([key, value]) =>
      '<meta name="twitter:' + key + '" content="' + escape(value) + '">'),
    '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c') + '</script>'
  ].join('\n');
  return read('./index.html')
    .replace(/^[ \t]*<link\b[^>]*\brel="(?:canonical|alternate)"[^>]*>\s*/gm, '')
    .replace(/<script\b[^>]*data-wp-locale-route[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/(<html lang=")[^"]+" dir="[^"]+"/, '$1' + locale + '" dir="' + (locale === 'ar' ? 'rtl' : 'ltr') + '"')
    .replace(/<head(?: [^>]*)?>/, '<head data-wp-search-copy="2.0" data-wp-search-locale="' + locale +
      '" data-wp-search-title="' + escape(title) + '" data-wp-search-name="' + escape(copy.title) + '">')
    .replace(/<!-- price-meta:start -->[\s\S]*?<!-- price-meta:end -->/, '<!-- price-meta:start -->\n' + meta + '\n<!-- price-meta:end -->')
    .replace(/ data-(?:wp-)?internal-only="[^"]*"/g, '')
    .replace(/<body /, publicGame ? '<body ' : '<body data-wp-internal-only="true" data-internal-only="1" ')
    .replace(/(id="mainReturn" href=")[^"]+"/, '$1/' + slug + '/' + (publicGame ? '' : '?preview=1') + '"')
    .replace(/(data-word="([A-Za-z0-9]+)"[^>]*>)[^<]*(?=<)/g, (_, opening, key) => opening + escape(copy[key]))
    .replace(/(data-aria="([A-Za-z0-9]+)")(?: aria-label="[^"]*")?/g,
      (_, opening, key) => opening + ' aria-label="' + escape(copy[key]) + '"')
    .replace(/<!-- price-guide:start -->[\s\S]*?<!-- price-guide:end -->/,
      '<!-- price-guide:start -->\n' + guide(copy, notes, slug, available) + '\n<!-- price-guide:end -->');
}
