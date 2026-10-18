import fs from 'node:fs';
import {COPY,LANGUAGE_LABELS,SUPPORTED} from './locales.mjs';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const segments={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
// Runtime and first response share the same authored dictionary. This is also
// used by the canonical scoped route generator; no second translated shell.
export function renderPuppyHavenRoute(locale,source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8')){
 if(!SUPPORTED.includes(locale))throw new Error(`Unsupported Puppy Haven locale: ${locale}`);
 const c=COPY[locale],alt=`${c.title} · ${[0,1,3].map(i=>c.breedNames[i]).join(' / ')} · ${c.puppy}`;
 let html=source.replace(/\s*<script\s+data-wp-locale-route[^>]*>[\s\S]*?<\/script>/g,'')
  .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g,'')
  .replace(/<head>\s*/,'<head>\n ')
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
  .replace(/(<div id="dogRail"[^>]*aria-label=")[^"]*/,`$1${escape(c.dogs.replace('{n}','2'))}`)
  .replace(/(src|href)="(?!\/|https?:|#)(style\.css|game\.mjs|assets\/[^"\s]+)"/g,'$1="/games/puppy-haven/$2"');
 return html;
}
