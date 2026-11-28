import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { descriptions, routes, titles, types, words } from './copy.mjs?wp-media=ad19a5c18bce29d5';

const id = 'bloomlight-patrol';
const origin = 'https://weightplay.com';
const root = new URL('../../', import.meta.url);
const sandbox = { window: {} };
for (const file of ['lobby-data.js?wp-media=ad19a5c18bce29d5', 'game-title-registry.js?wp-media=ad19a5c18bce29d5']) {
  vm.runInNewContext(readFileSync(new URL('src/' + file, root), 'utf8'), sandbox);
}
const lobby = sandbox.window.WONDER_LOBBY.games;
const record = lobby.find(game => game.id === id);
const registry = sandbox.window.WEIGHTPLAY_GAME_TITLES;
const live = record?.status === 'playable' && !record.internalOnly && !record.internalTrial;
const cover = origin + '/' + record.art.background.replace(/^\//, '');
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
})[char]);
const urlAt = locale => origin + '/' + routes[locale] + '/games/' + id + '/';

function faq(locale) {
  const text = words[locale];
  return [[text.goal,text.seat], [text.rules,text.helpRule], [text.finish,text.finishText]];
}
function metadata(locale, title) {
  const name = titles[locale];
  const description = descriptions[locale];
  const url = urlAt(locale);
  const faqEntries = faq(locale).map(([question, answer]) => ({
    '@type':'Question', name:question, acceptedAnswer:{'@type':'Answer',text:answer},
  }));
  const schema = { '@context':'https://schema.org','@graph':[
    {'@type':'VideoGame',name,url,description,image:cover,inLanguage:locale,genre:types[locale],
      gamePlatform:'Web browser',isAccessibleForFree:true,publisher:{'@type':'Organization',name:'WeightStudio',url:origin}},
    {'@type':'FAQPage',inLanguage:locale,mainEntity:faqEntries},
  ]};
  const openGraph = { 'site_name':'WeightPlay', title, description, url, image:cover, type:'website' };
  if (live && record.previewVideo) {
    openGraph.video = new URL(record.previewVideo,origin + '/').href;
    openGraph['video:type'] = 'video/webm';
  }
  return [
    '<title data-runtime-localize="off">'+escape(title)+'</title>',
    '<meta name="description" content="'+escape(description)+'">',
    '<meta name="robots" content="'+(live?'index,follow':'noindex,nofollow,noarchive')+'">',
    '<link rel="canonical" href="'+url+'">',
    ...Object.keys(routes).map(key=>'<link rel="alternate" hreflang="'+key+'" href="'+urlAt(key)+'">'),
    '<link rel="alternate" hreflang="x-default" href="'+urlAt('en')+'">',
    ...Object.entries(openGraph).map(([key,value])=>'<meta property="og:'+key+'" content="'+escape(value)+'">'),
    ...Object.entries({card:'summary_large_image',title,description,image:cover})
      .map(([key,value])=>'<meta name="twitter:'+key+'" content="'+escape(value)+'">'),
    '<script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>',
  ].join('\n');
}

function guide(locale) {
  const text = words[locale];
  const cards = ['winglight-survey','animal-dawn-shutters','moss-trail-patrol'].flatMap(gameId=>{
    const candidate = lobby.find(game=>game.id===gameId&&game.status==='playable');
    const art = candidate?.art?.background;
    const name = registry[gameId]?.[locale];
    if (!art || !name) return [];
    return ['<a class="game-info-related-card" data-wp-related-id="'+gameId+'" href="/'+routes[locale]+'/games/'+gameId+'/">'
      +'<span class="game-info-related-poster"><img src="/'+escape(art.replace(/^\//,''))+'" alt="" loading="lazy" width="96" height="96"></span>'
      +'<span class="game-info-related-copy"><strong>'+escape(name)+'</strong></span></a>'];
  }).join('');
  const entries = faq(locale).map(([q,a])=>'<dt>'+escape(q)+'</dt><dd>'+escape(a)+'</dd>').join('');
  return '<section class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>'+escape(text.related)
    +'</h3><div class="game-info-related-cards">'+cards+'</div></section>'
    +'<article class="game-info-section game-info-faq"><h3>'+escape(text.questions)+'</h3><dl>'+entries+'</dl></article>';
}
export function renderEntry(locale) {
  const title = titles[locale] + ' – ' + types[locale] + ' | WeightPlay';
  if (!words[locale] || registry[id]?.[locale] !== titles[locale]) throw new Error('Missing or mismatched '+id+' locale '+locale);
  const text = words[locale];
  const html = readFileSync(new URL('./index.html',import.meta.url),'utf8');
  return html
    .replace(/\s*<link\s+rel=["'](?:canonical|alternate)["'][^>]*>/gi, '')
    .replace(/\s*<script\b[^>]*\bdata-wp-locale-route(?:\s|>)[\s\S]*?<\/script>/gi, '')
    .replace(/\s*<p\b[^>]*\bdata-wp-game-access="2\.0"[^>]*>[^<]*<\/p>/gi, '')
    .replace(/\s*<article\b(?=[^>]*\bdata-wp-intro-faq(?:\s|=|>))[^>]*>[\s\S]*?<\/article>/gi, '')
    .replace(/<html lang="[^"]+" dir="[^"]+"/,'<html lang="'+locale+'" dir="'+(locale==='ar'?'rtl':'ltr')+'"')
    .replace(/<head(?: [^>]*)?>/,'<head data-wp-search-copy="2.0" data-wp-search-locale="'+locale
      +'" data-wp-search-title="'+escape(title)+'" data-wp-search-name="'+escape(titles[locale])+'">')
    .replace(/<!-- bloom-meta:start -->[\s\S]*?<!-- bloom-meta:end -->/,
      ()=> '<!-- bloom-meta:start -->\n'+metadata(locale,title)+'\n<!-- bloom-meta:end -->')
    .replace(/<!-- bloom-guide:start -->[\s\S]*?<!-- bloom-guide:end -->/,
      ()=> '<!-- bloom-guide:start -->\n'+guide(locale)+'\n<!-- bloom-guide:end -->')
    .replace(/(<h1 id="gameTitle"[^>]*>)[^<]*/,(_,start)=>start+escape(titles[locale]))
    .replace(/(<p id="description"[^>]*>)[^<]*/,(_,start)=>start+escape(descriptions[locale]))
    .replace(/(id="mainReturn" href=")[^"]*/,(_,start)=>start+'/'+routes[locale]+'/'+(live?'':'?preview=1'))
    .replace(/(id="cover"[^>]* alt=")[^"]*/,(_,start)=>start+escape(titles[locale]))
    .replace(/(data-word="([^"]+)"[^>]*>)[^<]*(?=<)/g,(_,start,key)=>start+escape(text[key]))
    .replace(/(data-aria-word="([^"]+)" aria-label=")[^"]*/g,(_,start,key)=>start+escape(text[key]))
    .replace(live?/ data-(?:wp-)?internal-only="[^"]*"/g:/$^/g,'');
}
export function renderGuide(locale) {
  const html = renderEntry(locale);
  const start = html.indexOf('<section id="guideContent"');
  const end = html.indexOf('</section>',html.indexOf('<!-- bloom-guide:end -->'));
  return html.slice(start,end+'</section>'.length);
}
