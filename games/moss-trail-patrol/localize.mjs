import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { routes, words } from './copy.mjs?wp-media=2f0d4cb4d54499ee';

const id = 'moss-trail-patrol';
const origin = 'https://weightplay.com';
const cover = origin + '/games/moss-trail-patrol/assets/cover.webp?wp-media=2f0d4cb4d54499ee';
const entry = new URL('./index.html', import.meta.url);
const relatives = ['outpost-tactics', 'magnetwheel-guard', 'ridgewatch-keep'];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const route = slug => `${origin}/${slug}/games/${id}/`;

function catalog() {
  const sandbox = { window: {} };
  for (const name of ['src/lobby-data.js?wp-media=2f0d4cb4d54499ee', 'src/game-title-registry.js?wp-media=2f0d4cb4d54499ee']) {
    vm.runInNewContext(readFileSync(new URL('../../' + name, import.meta.url), 'utf8'), sandbox, { filename: name });
  }
  return sandbox.window;
}

export function renderEntry(locale) {
  const slug = routes[locale];
  const copy = words[locale];
  const { WEIGHTPLAY_GAME_TITLES: titles, WONDER_LOBBY: { games } } = catalog();
  const row = games.find(game => game.id === id);
  if (!slug || !copy || !row || !titles[id]?.[locale]) throw new Error('Missing Moss Trail Patrol locale ' + locale);
  const name = titles[id][locale];
  const description = row.description[locale];
  const title = `${name} – ${row.type[locale]} | WeightPlay`;
  const url = route(slug);
  const live = row.status === 'playable' && !row.internalOnly && !row.internalTrial;
  const faqs = [[copy.q1, copy.a1], [copy.q2, copy.a2]];
  const video = live && row.previewVideo ? new URL(row.previewVideo, origin + '/').href : null;
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'VideoGame', name, url, description, inLanguage: locale, image: cover, genre: row.type[locale],
      gamePlatform: 'Web browser', operatingSystem: 'Any', isAccessibleForFree: true,
      publisher: { '@type': 'Organization', name: 'WeightStudio', url: origin } },
    { '@type': 'FAQPage', inLanguage: locale, mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
  ] };
  const meta = [
    `<title data-runtime-localize="off">${escape(title)}</title>`,
    `<meta name="robots" content="${live ? 'index,follow' : 'noindex,nofollow,noarchive'}">`,
    `<meta name="description" content="${escape(description)}">`,
    `<link rel="canonical" href="${url}">`,
    ...Object.entries(routes).map(([lang, path]) => `<link rel="alternate" hreflang="${lang}" href="${route(path)}">`),
    `<link rel="alternate" hreflang="x-default" href="${route('en')}">`,
    ...Object.entries({ type: 'website', site_name: 'WeightPlay', title, description, url, image: cover,
      ...(video ? { video, 'video:type': 'video/webm' } : {}) }).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}">`),
    ...Object.entries({ card: 'summary_large_image', title, description, image: cover }).map(([key, value]) => `<meta name="twitter:${key}" content="${escape(value)}">`),
    `<script type="application/ld+json">${JSON.stringify(graph).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n');
  const cards = relatives.flatMap(gameId => {
    const game = games.find(candidate => candidate.id === gameId && candidate.status === 'playable');
    const poster = game?.art?.background;
    const label = titles[gameId]?.[locale];
    if (!poster || !label) return [];
    return `<a class="game-info-related-card" data-game-id="${gameId}" data-wp-related-id="${gameId}" href="/${slug}/games/${gameId}/"><span class="game-info-related-poster"><img src="/${escape(poster.replace(/^\//, ''))}" alt="" width="96" height="96" loading="lazy"></span><span class="game-info-related-copy"><strong data-runtime-localize="off">${escape(label)}</strong></span></a>`;
  });
  const related = cards.length ? `<section class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>${escape(copy.related)}</h3><div class="game-info-related-cards">${cards.join('')}</div></section>` : '';
  const faq = `<article class="game-info-section game-info-faq"><h3>${escape(copy.faq)}</h3><dl>${faqs.map(([q, a]) => `<dt>${escape(q)}</dt><dd>${escape(a)}</dd>`).join('')}</dl></article>`;
  return readFileSync(entry, 'utf8')
    .replace(/\s*<script\b[^>]*\bdata-wp-locale-route(?=[\s=>])[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/^[\t ]*<link\s+rel=["'](?:canonical|alternate)["'][^>]*>[\t ]*\n?/gim, '')
    .replace(/\s*<p\b[^>]*\bdata-wp-game-access="2\.0"[^>]*>[^<]*<\/p>/gi, '')
    .replace(/\s*<article\b(?=[^>]*\bdata-wp-intro-faq(?:\s|>|=))[^>]*>[\s\S]*?<\/article>/gi, '')
    .replace(/<html lang="[^"]+" dir="[^"]+"/, `<html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`)
    .replace(/<head(?: [^>]*)?>/, `<head data-wp-search-copy="2.0" data-wp-search-locale="${locale}" data-wp-search-title="${escape(title)}" data-wp-search-name="${escape(name)}">`)
    .replace(/<!-- moss-meta:start -->[\s\S]*?<!-- moss-meta:end -->/, `<!-- moss-meta:start -->\n${meta}\n<!-- moss-meta:end -->`)
    .replace(/<!-- moss-guide:start -->[\s\S]*?<!-- moss-guide:end -->/, `<!-- moss-guide:start -->\n${related}\n${faq}\n<!-- moss-guide:end -->`)
    .replace(/ data-(?:wp-)?internal-only="[^"]*"/g, '')
    .replace(/<body /, live ? '<body ' : '<body data-wp-internal-only="true" data-internal-only="1" ')
    .replace(/(id="mainReturn" href=")[^"]*"/, (_all, before) => before + '/' + slug + '/' + (live ? '' : '?preview=1') + '"')
    .replace(/(id="cover"[^>]* alt=")[^"]*"/, (_all, before) => before + escape(name) + '"')
    .replace(/(<h1 id="gameTitle"[^>]*>)[^<]*/, (_all, before) => before + escape(name))
    .replace(/(data-word="([A-Za-z0-9]+)"[^>]*>)[^<]*(?=<)/g, (_all, before, key) => before + escape(copy[key]))
    .replace(/(data-aria-word="([^"]+)" aria-label=")[^"]*"/g, (_all, before, key) => before + escape(copy[key]) + '"')
    .replace(/((?:href|src)=")\.\//g, '$1/games/moss-trail-patrol/');
}

export function renderGuide(locale) {
  const html = renderEntry(locale);
  const start = html.indexOf('<section id="guideContent"');
  const end = html.indexOf('</section>', html.indexOf('<!-- moss-guide:end -->'));
  if (start < 0 || end < start) throw new Error('Missing Moss Trail Patrol guide');
  return html.slice(start, end + '</section>'.length);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const locale of process.argv.length > 2 ? process.argv.slice(2) : Object.keys(routes)) {
    const location = new URL('../../' + routes[locale] + '/games/' + id + '/', import.meta.url);
    const output = renderEntry(locale);
    mkdirSync(location, { recursive: true });
    writeFileSync(new URL('index.html', location), output);
  }
}
