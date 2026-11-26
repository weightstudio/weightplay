import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { copies, routeLanguages } from './copy.mjs?wp-media=a4d649c8383eff35';

const origin = 'https://weightplay.com';
const id = 'gust-rig';
const cover = '/games/gust-rig/assets/cover.webp?wp-media=a4d649c8383eff35';
const escaping = value => String(value).replace(/[&<>"]/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
const slugs = Object.fromEntries(Object.entries(routeLanguages).map(([key, value]) => [value, key]));
const path = slug => '/' + slug + '/games/' + id + '/';
const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');

function buildInfo(locale) {
  const copy = copies[locale];
  if (!copy) throw new Error('Incomplete Gust Rig locale: ' + locale);
  const scope = { window: {} };
  for (const name of ['lobby-data.js?wp-media=a4d649c8383eff35', 'game-title-registry.js?wp-media=a4d649c8383eff35']) {
    runInNewContext(read('../../src/' + name), scope, { timeout: 3500 });
  }
  const { WONDER_LOBBY: lobby, WEIGHTPLAY_GAME_TITLES: titles } = scope.window;
  const entry = lobby.games.find(game => game.id === id);
  if (!entry) throw new Error('Gust Rig catalog identity is missing');
  const slug = slugs[locale];
  const name = titles[id][locale];
  const genre = entry.type[locale];
  const description = entry.description[locale];
  const title = name + ' – ' + genre + ' | WeightPlay';
  const publicGame = entry.status === 'playable' && !entry.internalOnly && !entry.internalTrial;
  const faq = [[copy.q1, copy.a1], [copy.q2, copy.a2]];
  return { locale, copy, name, genre, entry, title, slug, description, publicGame, faq, lobby, titles };
}

function guide(info) {
  const { copy, faq, lobby, locale, slug, titles } = info;
  const source = [['goal', 'summary'], ['how', 'instruction'], ['controls', 'formulas'],
    ['finishing', 'scoring'], ['eventTitle', 'eventLead', 'eventFact', 'eventFiction']];
  const sections = source.map(([heading, ...words]) =>
    '<article class="game-info-section"><h3>' + escaping(copy[heading]) + '</h3>' +
    words.map(word => '<p' + (heading === 'goal' ? ' data-wp-intro-faq-source' : '') + '>' +
      escaping(copy[word]) + '</p>').join('') + '</article>');
  const questions = '<article class="game-info-section"><h3>' + escaping(copy.faq) + '</h3><dl>' +
    faq.map(([q, a]) => '<dt>' + escaping(q) + '</dt><dd>' + escaping(a) + '</dd>').join('') + '</dl></article>';
  const cards = ['clockwork-boxes', 'glowtide-parade', 'flying-tram'].flatMap(key => {
    const game = lobby.games.find(item => item.id === key);
    if (game?.status !== 'playable' || !game?.art?.background || game.internalOnly) return [];
    return '<a class="game-info-related-card" data-game-id="' + key + '" data-wp-related-id="' + key +
      '" href="/' + slug + '/games/' + key + '/"><span class="game-info-related-poster"><img width="96" height="96" ' +
      'loading="lazy" src="/' + escaping(game.art.background) + '" alt=""></span><span>' +
      escaping(titles[key]?.[locale] || game.title?.[locale] || game.title?.en) + '</span></a>';
  }).join('');
  return '<h2 id="guideTitle">' + escaping(copy.guide) + '</h2>' + sections.join('') + questions +
    '<section class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>' +
    escaping(copy.related) + '</h3><div class="game-info-related-cards">' + cards + '</div></section>';
}

function meta(info) {
  const { name, genre, title, description, slug, locale, publicGame, faq, entry } = info;
  const url = origin + path(slug);
  const image = origin + cover;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'VideoGame', name, genre, description, url, image, inLanguage: locale, isAccessibleForFree: true,
      gamePlatform: 'Web browser', publisher: { '@type': 'Organization', name: 'WeightPlay', url: origin } },
    { '@type': 'FAQPage', inLanguage: locale, mainEntity: faq.map(([question, answer]) =>
      ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }
  ] };
  const social = { type: 'website', site_name: 'WeightPlay', title, description, image, url };
  if (publicGame && entry.previewVideo) {
    social.video = origin + '/' + entry.previewVideo;
    social['video:type'] = 'video/webm';
  }
  return [
    '<title data-runtime-localize="off">' + escaping(title) + '</title>',
    '<meta name="robots" content="' + (publicGame ? 'index,follow' : 'noindex,nofollow,noarchive') + '">',
    '<meta name="description" content="' + escaping(description) + '">',
    '<link rel="canonical" href="' + url + '">',
    ...Object.entries(routeLanguages).map(([key, language]) =>
      '<link rel="alternate" hreflang="' + language + '" href="' + origin + path(key) + '">'),
    '<link rel="alternate" hreflang="x-default" href="' + origin + path('en') + '">',
    ...Object.entries(social).map(([key, value]) => '<meta property="og:' + key + '" content="' + escaping(value) + '">'),
    ...Object.entries({ card: 'summary_large_image', title, description, image }).map(([key, value]) =>
      '<meta name="twitter:' + key + '" content="' + escaping(value) + '">'),
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>'
  ].join('\n');
}

export function renderEntry(locale) {
  const info = buildInfo(locale);
  return read('./index.html')
    .replace(/(<html lang=")[^"]+" dir="[^"]+"/, '$1' + locale + '" dir="' + (locale === 'ar' ? 'rtl' : 'ltr') + '"')
    .replace(/<head(?: [^>]*)?>/, '<head data-wp-search-copy="2.0" data-wp-search-locale="' + locale +
      '" data-wp-search-title="' + escaping(info.title) + '" data-wp-search-name="' + escaping(info.name) + '">')
    .replace(/<!-- gust-meta:start -->[\s\S]*?<!-- gust-meta:end -->/, '<!-- gust-meta:start -->\n' + meta(info) + '\n<!-- gust-meta:end -->')
    .replace(/ data-(?:wp-)?internal-only="[^"]*"/g, '')
    .replace(/<body /, info.publicGame ? '<body ' : '<body data-wp-internal-only="true" data-internal-only="1" ')
    .replace(/(id="mainReturn" href=")[^"]+"/, '$1/' + info.slug + '/' + (info.publicGame ? '' : '?preview=1') + '"')
    .replace(/(data-word="([A-Za-z0-9]+)"[^>]*>)[^<]*(?=<)/g, (_, open, key) => open + escaping(info.copy[key]))
    .replace(/(data-aria="([A-Za-z0-9]+)")(?: aria-label="[^"]*")?/g,
      (_, open, key) => open + ' aria-label="' + escaping(info.copy[key]) + '"')
    .replace(/<!-- gust-guide:start -->[\s\S]*?<!-- gust-guide:end -->/, '<!-- gust-guide:start -->\n' + guide(info) + '\n<!-- gust-guide:end -->');
}
