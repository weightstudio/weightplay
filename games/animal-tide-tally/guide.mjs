// One static Guide renderer, imported by the existing localized-route generator.
import fs from 'node:fs';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
const root = new URL('../../', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('./guide-copy.json', import.meta.url), 'utf8'));
const context = {window:{}};
for (const path of ['games/animal-tide-tally/locales.js','src/game-title-registry.js','src/lobby-data.js','src/interface7-poster-registry.js']) {
  vm.runInNewContext(fs.readFileSync(new URL(path, root), 'utf8'), context, {filename:path,timeout:1000});
}
const catalog=context.window.ANIMAL_TIDE_TALLY_LOCALES;
const titles=context.window.WEIGHTPLAY_GAME_TITLES;
const games=context.window.WONDER_LOBBY.games;
const posters=context.window.WEIGHTPLAY_INTERFACE7_POSTERS || {};
export const segments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const relatedIds=['animal-nest-weigh','animal-constellation-keeper'];
function guide(locale) {
  const d=data[locale],c=catalog[locale];
  if(!d||!c)throw Error('TIDE_LOCALE_REQUIRED:'+locale);
  const section=(index,content)=>`<article class="game-info-section"><h3>${esc(d.headings[index])}</h3>${content}</article>`;
  const para=value=>`<p>${esc(value)}</p>`;
  const related=relatedIds.map((id,index)=>{
    const game=games.find(g=>g.id===id);
    if(!game||game.status!=='playable'||game.internalOnly)throw Error('TIDE_RELATED_NOT_PUBLIC:'+id);
    const title=titles[id]?.[locale]||game.title?.[locale];
    if(!title)throw Error('TIDE_RELATED_TITLE_REQUIRED:'+id+':'+locale);
    // The route generator rebuilds each locale tree in catalog order, so a
    // related page may not exist on disk yet while this Guide is rendered.
    // The playable catalog entry is the publication boundary for these links.
    const image=posters[id]||'/'+game.art.background.replace(/^\//,'');
    return `<a class="game-info-related-card" href="/${segments[locale]}/games/${id}/"><img src="${esc(image)}" alt="" loading="lazy" width="240" height="240"><span class="game-info-related-copy"><strong>${esc(title)}</strong><span>${esc(d.related[index])}</span></span></a>`;
  }).join('');
  const faq=d.faq.map(([q,a])=>`<div><dt>${esc(q)}</dt><dd>${esc(a)}</dd></div>`).join('');
  const body=[section(0,para(d.overview)),section(1,`<ol>${d.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${para(c.guide)}`),section(2,para(d.progression)),section(3,para(d.tips)),section(4,para(d.design)),section(5,para(d.player)),section(6,`<dl>${faq}</dl>`),section(7,`<div class="game-info-related">${related}</div>`)].join('');
  return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-complete="true" data-tide-guide-version="1.3.0" data-runtime-localize="off" aria-label="${esc(c.title)}"><div class="game-info-hero"><div class="game-info-title"><h2 data-wp-game-title data-runtime-localize="off">${esc(c.title)}</h2>${para(c.summary)}</div><div class="game-info-facts"><div class="game-info-fact"><span>${esc(d.headings[1])}</span><div class="game-info-tags">${d.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><div class="game-info-fact"><span>${esc(d.headings[5])}</span><strong>${esc(c.watchHint)}</strong></div></div></div><div class="game-info-sections">${body}</div></section>`;
}
function replaceGuide(html,replacement) {
  const start=html.search(/<section\b[^>]*\bid=["']gameGuide["']/i);
  if(start<0)throw Error('TIDE_GUIDE_SLOT_REQUIRED');
  const tags=/<\/?section\b[^>]*>/gi;tags.lastIndex=start;let depth=0,match;
  while((match=tags.exec(html))){depth+=match[0][1]==='/'?-1:1;if(!depth)return html.slice(0,start)+replacement+html.slice(tags.lastIndex);}
  throw Error('TIDE_GUIDE_UNCLOSED');
}
export function applyTideGuide(html, locale) {
  if(!segments[locale])throw Error('TIDE_ROUTE_LOCALE_REQUIRED');
  const c=catalog[locale],d=data[locale];
  html=replaceGuide(html,guide(locale));
  html=html.replace(/<script\b[^>]*data-tide-faq[^>]*>[\s\S]*?<\/script>\n?/gi,'');
  const json=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',inLanguage:locale,mainEntity:d.faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}).replaceAll('<','\\u003c');
  html=html.replace('</head>',`<script type="application/ld+json" data-tide-faq>${json}</script>\n</head>`);
  html=html.replace(/(<html\b[^>]*)(>)/i,(_,attrs,end)=>attrs.replace(/\sdir=["'][^"']*["']/i,'')+` dir="${locale==='ar'?'rtl':'ltr'}"`+end);
  // Localize existing source text before first paint, not through a fallback overlay.
  html=html.replace(/<([a-z][\w-]*)\b([^>]*\bdata-i18n=["']([^"']+)["'][^>]*)>([^<]*)<\/\1>/gi,(all,tag,attrs,key)=>{
    if(attrs.includes('data-wp-game-title'))return `<${tag}${attrs}>${esc(c.title)}</${tag}>`;
    if(c[key]===undefined)throw Error('TIDE_INITIAL_COPY_REQUIRED:'+locale+':'+key);
    return `<${tag}${attrs}>${esc(c[key])}</${tag}>`;
  });
  html=html.replace(/(<p\b[^>]*class=["'][^"']*main-summary[^"']*["'][^>]*>)[\s\S]*?(<\/p>)/i,`$1${esc(c.summary)}$2`);
  html=html.replace(/(<p\b[^>]*\bid=["']mainProgress["'][^>]*>)[\s\S]*?(<\/p>)/i,`$1${esc(c.progress.replace('{count}','0').replace('{total}','30'))}$2`);
  html=html.replace(/<button\b[^>]*\bid=["']mapBtn["'][^>]*>[\s\S]*?<\/button>/i,'');
  html=html.replace(/<span\b[^>]*class=["']cover-badge["'][^>]*>[\s\S]*?<\/span>/i,'');
  html=html.replace(/<p\b[^>]*data-i18n=["']world["'][^>]*>[\s\S]*?<\/p>/i,'');
  html=html.replace(/<h1\b(?![^>]*wp-shell-main-title)[^>]*data-i18n=["']title["'][^>]*>[\s\S]*?<\/h1>/i,'');
  html=html.replace(/<strong\b([^>]*class=["'][^"']*wp-shell-main-title[^"']*["'][^>]*)>([\s\S]*?)<\/strong>/i,'<h1 $1>$2</h1>');
  html=html.replace(/<style\b[^>]*data-wp-name-layout[^>]*>[\s\S]*?<\/style>/gi,'');
  html=html.replace(/(<option\b[^>]*value=["']pt-BR["'][^>]*>)[^<]*(<\/option>)/i,'$1Português$2');
  html=html.replace(/(<(?:a|button)\b[^>]*data-wp-return=["'][^"']+["'][^>]*\baria-label=["'])[^"']*(["'])/gi,`$1${esc(c.back)}$2`);
  html=html.replace(/(<(?:select|button)\b[^>]*\bid=["']localeSelect["'][^>]*\baria-label=["'])[^"']*(["'])/gi,`$1${esc(c.language)}$2`);
  html=html.replace(/(<button\b[^>]*\bid=["']battleSoundBtn["'][^>]*\baria-label=["'])[^"']*(["'])/gi,`$1${esc(c.sound)}$2`);
  html=html.replace(/(<button\b[^>]*\bid=["']closeSettings["'][^>]*\baria-label=["'])[^"']*(["'])/gi,`$1${esc(c.close)}$2`);
  html=html.replace(/(<(?:nav|div)\b[^>]*(?:class=["']stage-tabs["']|id=["'](?:stageChoices|answerGrid)["'])[^>]*\baria-label=["'])[^"']*(["'])/gi,`$1${esc(c.stages)}$2`);
  html=html.replace(/(name=["']weightplay-game-version["']\s+content=["'])v\d+/i,'$1v8').replace(/data-wp-game-version=["']v\d+["']/g,'data-wp-game-version="v8"');
  html=html.replace(/(name=["']weightplay-interface-version["']\s+content=["'])\d+/i,(_,prefix)=>prefix+'7').replace(/data-wp-interface-version=["']\d+["']/g,'data-wp-interface-version="7"');
  html=html.replace(/((?:style\.css|game\.js|locales\.js)\?v=)[^"']+/g,(_,prefix)=>prefix+'20260923-tide-v8');
  html=html.replace(/(<div\b[^>]*\bid=["']app["'])([^>]*>)/i,(_,a,b)=>a+b.replace(/\sdata-wp-frame-root(?:=["'][^"']*["'])?/g,'').replace('>',' data-wp-frame-root>'));
  html=html.replace(/<div\b([^>]*\bdata-wp-standard-stage-screen[^>]*)>/i,(_,attrs)=>{
    attrs=attrs.replace(/\sdata-wp-stage-art=["'][^"']*["']/g,'').replace(/\sstyle=["'][\s\S]*?["'](?=\s|$)/g,'');
    return `<div${attrs} data-wp-stage-art="/assets/interface7-redrawn/animal-tide-tally.webp" style="--wp-stage-art:url('/assets/interface7-redrawn/animal-tide-tally.webp')">`;
  });
  if(!html.includes('game-screen-frame.css?v=20260923-tide-v8')){
    html=html.replace(/(<script\b[^>]*src=["'][^"']*shared-interface-bootstrap\.js[^>]*>)/i,'<link rel="stylesheet" href="/src/game-screen-frame.css?v=20260923-tide-v8">\n$1');
  }
  // Structured genres describe this game in the route locale. Keep SEO identity intact.
  html=html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(all,a,raw,b)=>{
    let object;try{object=JSON.parse(raw);}catch{return all;}
    if(object['@type']==='VideoGame')object.genre=d.tags;
    return a+JSON.stringify(object).replaceAll('<','\\u003c')+b;
  });
  return html.replace(/[ \t]+$/gm,'');
}
export {data as guideCopy,catalog as runtimeCopy};

// The same renderer can check or refresh only the 14 owned entries on a sparse
// checkout. The platform generator imports applyTideGuide; no duplicate copy.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const write = process.argv.includes('--write');
  let changed = 0;
  for (const [locale, segment] of [['en',''], ...Object.entries(segments)]) {
    const path = new URL(`${segment ? segment + '/' : ''}games/animal-tide-tally/index.html`, root);
    const before = fs.readFileSync(path, 'utf8');
    const after = applyTideGuide(before, locale);
    if (after !== applyTideGuide(after, locale)) throw Error('TIDE_RENDER_NOT_IDEMPOTENT:'+locale);
    if (before !== after) { changed++; if (write) fs.writeFileSync(path, after); }
  }
  console.log(JSON.stringify({entries:14,changed,mode:write?'write':'check'}));
  if (!write && changed) process.exitCode = 1;
}
