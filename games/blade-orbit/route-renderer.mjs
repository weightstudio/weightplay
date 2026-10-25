import fs from 'node:fs';
import {TEXT,LOCALES,ROUTES,LANGUAGE_LABELS,guideSections} from './locales.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderBladeOrbitRoute(locale,source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8')){
 if(!LOCALES.includes(locale))throw Error('Unsupported Blade Orbit locale');
 const c=TEXT[locale],url=`https://weightplay.com/${ROUTES[locale]}/games/blade-orbit/`,image='https://weightplay.com/games/blade-orbit/assets/poster.webp';
 const version=source.match(/<meta name="weightplay-game-version" content="(v[1-9]\d*)">/)?.[1];if(!version)throw Error('Missing product version');
 let html=source.replace(/<html\b[^>]*>/,`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}" data-wp-official-name>`)
  .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(c.title)} | WeightPlay</title>`)
  .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(c.summary)}">`)
  .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g,'')
  .replace(/\s*<meta\b[^>]*data-blade-meta[^>]*>/g,'')
  .replace(/\s*<script id="blade-schema"[^>]*>[\s\S]*?<\/script>/g,'');
 html=html.replace(/(<([a-z0-9-]+)\b[^>]*data-copy="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,(_,open,tag,key,close)=>{if(!c[key])throw Error('Missing '+key);return open+esc(c[key])+close;});
 for(const [id,key]of [['mainReturn','backLobby'],['stageBackBtn','backMain'],['battleBackBtn','pause'],['helpBtn','help']])html=html.replace(new RegExp('(<(?:a|button) id="'+id+'"[^>]*aria-label=")[^"]*'),(_,open)=>open+esc(c[key]));
 html=html.replace(/(<img class="main-poster[^>]*alt=")[^"]*/,(_,open)=>open+esc(c.posterAlt));
 html=html.replace(/(<p id="mainProgress"[^>]*>)[\s\S]*?<\/p>/,(_,open)=>open+esc(c.stage)+' 1 / 30</p>');
 // Match through the following sibling: the facts/guide contain nested divs.
 html=html.replace(/<div class="game-info-facts" id="guideFacts">[\s\S]*?(?=<div class="game-info-sections" id="guideSections">)/,`<div class="game-info-facts" id="guideFacts">${[[30,c.factsEncounters],[6,c.factsGuardians],[3,c.factsElements],['45–90',c.factsSeconds]].map(([n,label])=>`<div><strong>${n}</strong><span>${esc(label)}</span></div>`).join('')}</div>`);
 html=html.replace(/(<div class="game-info-sections" id="guideSections">)[\s\S]*?(?=<div id="gameGuideFaq">)/,`<div class="game-info-sections" id="guideSections">${guideSections(locale).map(s=>`<section class="game-info-section"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></section>`).join('')}</div>`);
 html=html.replace(/<div id="gameGuideFaq">[\s\S]*?(?=<div id="gameGuideRelated">)/,`<div id="gameGuideFaq"><details><summary>${esc(c.faqTitle)}</summary><p>${esc(c.faqAnswer)}</p></details></div>`);
 html=html.replace(/<select id="localeSelect"[^>]*>[\s\S]*?<\/select>/,`<select id="localeSelect" aria-label="${esc(LANGUAGE_LABELS[LOCALES.indexOf(locale)])}">${LOCALES.map((l,i)=>`<option value="${l}"${l===locale?' selected':''}>${esc(LANGUAGE_LABELS[i])}</option>`).join('')}</select>`);
 const schema={'@context':'https://schema.org','@type':'VideoGame',name:c.title,description:c.summary,url,image,inLanguage:locale,applicationCategory:'Game',genre:['Action','Survival'],operatingSystem:'Web browser',isAccessibleForFree:true,softwareVersion:version,publisher:{'@type':'Organization',name:'WeightPlay'}};
 const metadata=`<link rel="canonical" href="${url}">\n${LOCALES.map(l=>`<link rel="alternate" hreflang="${l}" href="https://weightplay.com/${ROUTES[l]}/games/blade-orbit/">`).join('\n')}\n<link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/blade-orbit/">\n<meta data-blade-meta property="og:title" content="${esc(c.title)}"><meta data-blade-meta property="og:description" content="${esc(c.summary)}"><meta data-blade-meta property="og:url" content="${url}"><meta data-blade-meta property="og:image" content="${image}"><meta data-blade-meta name="twitter:card" content="summary_large_image"><script id="blade-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
 return html.replace('</head>',metadata+'\n</head>');
}
