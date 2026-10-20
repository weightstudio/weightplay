import fs from 'node:fs';
import {COPY,LANGUAGE_LABELS,SUPPORTED} from './locales.mjs';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const segments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
function publicMetadata(html,locale,c){
 if(/<meta name="robots" content="[^"]*noindex/.test(html))return html;
 const url=`https://weightplay.com/${segments[locale]}/games/puppy-haven/`,image='https://weightplay.com/games/puppy-haven/assets/cover-block-v1.webp';
 html=html.replace(/\s*<meta\b[^>]*data-puppy-public-meta[^>]*>/g,'').replace(/\s*<script id="puppy-public-schema"[^>]*>[\s\S]*?<\/script>/g,'');
 const tags=[['property','og:site_name','WeightPlay'],['property','og:type','website'],['property','og:title',c.title],['property','og:description',c.summary],['property','og:url',url],['property','og:image',image],['name','twitter:card','summary_large_image'],['name','twitter:title',c.title],['name','twitter:description',c.summary],['name','twitter:image',image]].map(([attr,key,value])=>` <meta data-puppy-public-meta ${attr}="${key}" content="${escape(value)}">`);
 const alternate=SUPPORTED.map(key=>` <link rel="alternate" hreflang="${key}" href="https://weightplay.com/${segments[key]}/games/puppy-haven/">`).concat(' <link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/puppy-haven/">');
 const game={'@context':'https://schema.org','@type':'VideoGame',name:c.title,description:c.summary,url,image,inLanguage:locale,applicationCategory:'Game',genre:['Simulation','Strategy'],operatingSystem:'Web browser',isAccessibleForFree:true,softwareVersion:'v10',publisher:{'@type':'Organization',name:'WeightPlay'},offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}};
 return html.replace('</head>',`${tags.join('\n')}\n${alternate.join('\n')}\n <script id="puppy-public-schema" type="application/ld+json">${JSON.stringify(game).replace(/</g,'\\u003c')}</script>\n</head>`);
}
// Runtime and first response share the same authored dictionary. This is also
// used by the canonical scoped route generator; no second translated shell.
export function renderPuppyHavenRoute(locale,source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8')){
 if(!SUPPORTED.includes(locale))throw new Error(`Unsupported Puppy Haven locale: ${locale}`);
 const c=COPY[locale],alt=`${c.title} · ${[0,1,3].map(i=>c.breedNames[i]).join(' / ')} · ${c.puppy}`;
 let html=source.replace(/\s*<script\s+data-wp-locale-route[^>]*>[\s\S]*?<\/script>/g,'')
  .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g,'')
  .replace(/\s*<base\b[^>]*>/g,'')
  .replace(/\s*<script\s+src="\/src\/i18n-ja\.js[^"\s]*"><\/script>/g,'')
  .replace(/<head>\s*/,'<head>\n ')
  .replace('<head>','<head>\n <base href="/games/puppy-haven/">')
  .replace(/<html\b[^>]*>/,`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}" data-wp-official-name>`)
  .replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(c.title)} | WeightPlay</title>`)
  .replace(/\s*<meta name="description"[^>]*>/g,'')
  .replace('</title>',`</title>\n <meta name="description" content="${escape(c.summary)}">\n <link rel="canonical" href="https://weightplay.com/${segments[locale]}/games/puppy-haven/">`)
  .replace(/(<([a-z0-9-]+)\b[^>]*data-copy="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,(_all,open,_tag,key,close)=>{
   if(typeof c[key]!=='string')throw new Error(`Missing static copy ${locale}:${key}`);
   return open.replace(/ data-runtime-localize="off"/g,'').replace(/>$/,' data-runtime-localize="off">')+escape(c[key])+close;
  })
  .replace(/<h1>[\s\S]*?<\/h1>/,`<h1 data-runtime-localize="off">${escape(c.title)}</h1>`)
  .replace(/(<section id="comingSoon"[\s\S]*?<p>)[\s\S]*?(<\/p>)/,`$1${escape(c.preview.split(' · ')[0])}$2`)
  .replace(/(<img\b[^>]*src="[^"]*cover-block-v1.webp"[^>]*alt=")[^"]*/g,`$1${escape(alt)}`)
  .replace(/(<select id="localeSelect" aria-label=")[^"]*/,`$1${escape(LANGUAGE_LABELS[locale])}`)
  .replace(/(<button id="closePanel" aria-label=")[^"]*/,`$1${escape(c.close)}`)
  .replace(/<button\b[^>]*data-label="([^"]+)"[^>]*>/g,(tag,key)=>tag.replace(/aria-label="[^"]*"/,`aria-label="${escape(c[key])}"`))
  .replace(/(<div id="dogRail"[^>]*aria-label=")[^"]*/,`$1${escape(c.dogs.replace('{n}','2'))}`)
  .replace(/(src|href)="(?!\/|https?:|#)(style\.css|game\.mjs|assets\/[^"\s]+)"/g,'$1="/games/puppy-haven/$2"');
 const faq=`<div class="game-info-faq"><h3 data-copy="faqTitle" data-runtime-localize="off">${escape(c.faqTitle)}</h3><dl><div><dt data-copy="faqPuppy" data-runtime-localize="off">${escape(c.faqPuppy)}</dt><dd data-copy="puppyBattle" data-runtime-localize="off">${escape(c.puppyBattle)}</dd></div><div><dt data-copy="faqBreeds" data-runtime-localize="off">${escape(c.faqBreeds)}</dt><dd data-copy="cultivateGuide" data-runtime-localize="off">${escape(c.cultivateGuide)}</dd></div></dl></div>`;
 html=html.replace(/<div class="game-info-faq">[\s\S]*?<\/dl><\/div>|<div class="game-info-faq"><\/div>/,faq);
 if(locale==='ja')html=html.replace(/\s*<script src="\/src\/i18n\.js">/,'\n <script src="/src/i18n-ja.js?v=20260719-ja1"></script>\n <script src="/src/i18n.js">');
 return publicMetadata(html,locale,c);
}
