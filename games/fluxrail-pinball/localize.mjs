import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { ROUTES, word } from './locales.mjs?wp-media=f8225020af9edaee';

const ID = 'fluxrail-pinball';
const ORIGIN = 'https://weightplay.com';
const BASE = '/games/' + ID + '/';
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function replaceBlock(html, key, value) {
  const start = '<!-- ' + ID + '-' + key + ':start -->';
  const end = '<!-- ' + ID + '-' + key + ':end -->';
  const a = html.indexOf(start), b = html.indexOf(end);
  if (a < 0 || b < a) throw new Error('Missing entry slot: ' + key);
  return html.slice(0, a + start.length) + '\n' + value + '\n' + html.slice(b);
}

function catalog() {
  const context = { window:{} };
  for (const file of ['lobby-data.js?wp-media=f8225020af9edaee','game-title-registry.js?wp-media=f8225020af9edaee']) {
    vm.runInNewContext(readFileSync(new URL('../../src/' + file, import.meta.url), 'utf8'), context, { timeout:3000 });
  }
  return { games:context.window.WONDER_LOBBY.games, titles:context.window.WEIGHTPLAY_GAME_TITLES };
}

export function renderEntry(locale) {
  const { games, titles } = catalog();
  const game = games.find(item => item.id === ID);
  const segment = ROUTES[locale];
  const name = titles[ID]?.[locale];
  if (!game || !segment || !name) throw new Error('Invalid Fluxrail Pinball locale: ' + locale);
  const t = key => word(locale, key);
  const url = ORIGIN + '/' + segment + BASE;
  const title = name + ' – ' + t('type') + ' | WeightPlay';
  const image = ORIGIN + BASE + 'art/cover.webp?wp-media=f8225020af9edaee';
  const published = game.status === 'playable' && !game.internalOnly && !game.internalTrial;
  const questions = [1,2,3].map(i => ({ question:t('faq'+i), answer:t('ans'+i) }));
  const schema = { '@context':'https://schema.org', '@graph':[
    { '@type':'VideoGame', name, url, image, description:t('description'), inLanguage:locale, genre:t('type'),
      gamePlatform:'Web browser', applicationCategory:'GameApplication', operatingSystem:'Web browser',
      isAccessibleForFree:true, publisher:{ '@type':'Organization', name:'WeightPlay', url:ORIGIN } },
    { '@type':'FAQPage', inLanguage:locale, mainEntity:questions.map(({question,answer}) => ({
      '@type':'Question', name:question, acceptedAnswer:{ '@type':'Answer', text:answer },
    })) },
  ] };
  const social = { type:'website', site_name:'WeightPlay', url, title, description:t('description'), image };
  const meta = [
    '<title data-runtime-localize="off">' + escape(title) + '</title>',
    '<meta name="description" content="' + escape(t('description')) + '">',
    '<meta name="robots" content="' + (published ? 'index,follow' : 'noindex,nofollow,noarchive') + '">',
    '<link rel="canonical" href="' + url + '">',
    ...[...Object.entries(ROUTES), ['x-default','en']].map(([lang, path]) =>
      '<link rel="alternate" hreflang="' + lang + '" href="' + ORIGIN + '/' + path + BASE + '">'),
    ...Object.entries(social).map(([property, value]) =>
      '<meta property="og:' + property + '" content="' + escape(value) + '">'),
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + escape(title) + '">',
    '<meta name="twitter:description" content="' + escape(t('description')) + '">',
    '<meta name="twitter:image" content="' + image + '">',
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<','\\u003c') + '</script>',
  ].join('\n');
  const headings = ['guideGoal','guideHow','guideRules','guideFinish'];
  const guide = ['goal','how','rules','finish'].map((key, index) =>
    '<article class="game-info-section"><h3>' + escape(t(headings[index])) + '</h3><p'
    + (index === 0 ? ' data-wp-intro-faq-source' : '') + '>' + escape(t(key)) + '</p></article>').join('');
  const faq = questions.map(({question,answer}) =>
    '<details><summary>' + escape(question) + '</summary><p>' + escape(answer) + '</p></details>').join('');
  const cards = (game.relatedGameRules?.gameIds ?? []).flatMap(id => {
    const entry = games.find(other => other.id === id && other.status === 'playable' && !other.internalOnly && !other.internalTrial);
    const label = titles[id]?.[locale];
    if (!entry?.art?.background || !label) return [];
    return ['<a class="game-info-related-card" data-game-id="' + id + '" data-wp-related-id="' + id
      + '" href="/' + segment + '/games/' + id + '/"><img src="/' + escape(entry.art.background.replace(/^\//,''))
      + '" width="96" height="96" alt="" loading="lazy"><span data-runtime-localize="off">' + escape(label) + '</span></a>'];
  }).join('');
  const related = cards ? '<section class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>'
    + escape(t('related')) + '</h3><div class="game-info-related-grid">' + cards + '</div></section>' : '';
  let html = readFileSync(new URL('index.html',import.meta.url),'utf8')
    .replace(/<link\b[^>]*\brel=["'](?:canonical|alternate)["'][^>]*>/gi,'')
    .replace(/<script\b[^>]*\bdata-wp-locale-route(?=[\s=>])[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<article\b[^>]*\bdata-wp-intro-faq(?=[\s=>])[^>]*>[\s\S]*?<\/article>/gi,'')
    .replace(/<p\b[^>]*\bdata-wp-game-access(?=[\s=>])[^>]*>[\s\S]*?<\/p>/gi,'')
    .replace(/<html lang="[^"]+" dir="[^"]+"/, '<html lang="' + locale + '" dir="' + (locale === 'ar' ? 'rtl' : 'ltr') + '"')
    .replace(/<head[^>]*>/, '<head data-wp-search-copy="2.0" data-wp-search-locale="' + locale
      + '" data-wp-search-title="' + escape(title) + '" data-wp-search-name="' + escape(name) + '">')
    .replace(/ data-(?:wp-)?internal-only="true"/g,'')
    .replace(/<body /, published ? '<body ' : '<body data-wp-internal-only="true" data-internal-only="true" ')
    .replace(/(id="mainReturn" href=")[^"]*"/, (_, open) => open + '/' + segment + '/' + (published ? '' : '?preview=1') + '"')
    .replace(/(id="cover"[^>]* alt=")[^"]*"/, (_, open) => open + escape(name) + '"');
  const labels = {
    gameTitle:name, description:t('description'), startBtn:t('start'), guideTitle:t('guide'), typeTag:t('type'),
    mechanic:t('mechanic'), stagesTab:t('stages'), workshopTab:t('shop'), stockLabel:t('balls'),
    powerLabel:t('charge'), leftText:t('leftPaddle'), rightText:t('rightPaddle'), fluxText:t('flux'),
    saveText:t('shield'), helpBtn:t('help'), resultMap:t('stages'), resultNext:t('next'),
    resultRetry:t('retry'), saveAgain:t('saveAgain'), lessonReplay:t('replay'), objective:t('objective'),
    laneL:t('L'), laneC:t('C'), laneR:t('R'),
  };
  for (const [id,value] of Object.entries(labels)) {
    html = html.replace(new RegExp('(<[a-z0-9]+[^>]* id="' + id + '"[^>]*>)[^<]*(</[a-z0-9]+>)','i'),
      (_, open, close) => open + escape(value) + close);
  }
  html = replaceBlock(html,'meta',meta);
  html = replaceBlock(html,'guide',guide);
  html = replaceBlock(html,'faq',faq);
  return replaceBlock(html,'related',related);
}

export function renderGuide(locale) {
  return renderEntry(locale).match(/<section id="guideContent"[\s\S]+?<!-- fluxrail-pinball-related:end -->[\s\S]*?<\/section>/)?.[0] ?? '';
}
