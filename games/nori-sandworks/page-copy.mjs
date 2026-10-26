/* Metadata shares the complete facts in the visible locale-owned guide. */
import {TEXT} from './locales.mjs';
import {SEGMENTS,renderStaticGuide,escape} from './guide.mjs';
export function schema(locale='en',gameVersion='v1'){const t=TEXT[locale];return {'@context':'https://schema.org','@graph':[
 {'@type':'VideoGame',softwareVersion:gameVersion,name:t.title,url:`https://weightplay.com/${SEGMENTS[locale]}/games/nori-sandworks/`,image:'https://weightplay.com/games/nori-sandworks/assets/og.webp',description:t.summary,inLanguage:locale,genre:t.tags,isAccessibleForFree:true,operatingSystem:'Web browser',applicationCategory:'Game',publisher:{'@type':'Organization',name:'WeightPlay',url:'https://weightplay.com/'}},
 {'@type':'FAQPage',mainEntity:t.faqQuestions.map((name,i)=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text:t.faqAnswers[i]}}))}
 ]};}
export function renderEntry(source,locale){const t=TEXT[locale],e=escape;if(!t)throw Error('PAGE_LOCALE_REQUIRED');
 const gameVersion=source.match(/name="weightplay-game-version" content="([^"]+)"/)[1];
 let s=source.replace(/<html\b[^>]*>/i,`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}" data-wp-interface-version="9">`);
 s=s.replace(/<body\b[^>]*>/i,tag=>tag.replace(/\sdata-wp-game-owned-guide(?:="[^"]*")?/g,'').replace(/>$/,' data-wp-game-owned-guide="true">'));
 s=s.replace(/<script\b[^>]*src="[^"]*i18n-ja\.js[^\"]*"[^>]*><\/script>/gi,'');
 if(locale==='ja')s=s.replace(/(<script\b[^>]*src="[^"]*\/i18n\.js"[^>]*>)/i,'<script src="/src/i18n-ja.js?v=20260719-ja1"></script>$1');
 s=s.replace(/<title>[^<]*<\/title>/i,`<title>${e(t.title)} | WeightPlay</title>`);
 s=s.replace(/(<(?:strong|h1)\b[^>]*\bdata-wp-game-title[^>]*>)[^<]*/gi,'$1'+e(t.title));
 for(const [id,value]of Object.entries({summary:t.summary,startBtn:t.start,undoBtn:t.undo,rotateBtn:t.rotate,switchBtn:t.gates}))s=s.replace(new RegExp(`(<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>)[^<]*`),'$1'+e(value));
 const aria={mainReturn:t.back,stageBack:t.back,battleBack:t.back,playfield:t.boardLabel,helpBtn:t.help};
 for(const [id,value]of Object.entries(aria))s=s.replace(new RegExp(`<([a-z]+)\\b(?=[^>]*\\bid="${id}")[^>]*>`),tag=>tag.replace(/\saria-label="[^"]*"/g,'').replace(/>$/,` aria-label="${e(value)}">`));
 s=s.replace(/<img\b(?=[^>]*\bid="poster")[^>]*>/i,tag=>tag.replace(/\balt="[^"]*"/,`alt="${e(t.posterAlt)}"`));
 s=s.replace(/<meta\b(?=[^>]*(?:name|property)="(?:description|og:description|twitter:description)")[^>]*>/gi,tag=>tag.replace(/content="[^"]*"/,`content="${e(t.summary)}"`));
 s=s.replace(/<meta\b(?=[^>]*(?:name|property)="(?:og:title|twitter:title)")[^>]*>/gi,tag=>tag.replace(/content="[^"]*"/,`content="${e(t.title)} | WeightPlay"`));
 s=s.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,'');
 s=s.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/gi,'');
 s=s.replace(/<script\b[^>]*src="[^"]*(?:game-runtime-localizer(?:-loader)?\.js|runtime-locales\/)[^"]*"[^>]*><\/script>/gi,'');
 s=s.replace(/<script\b[^>]*data-wp-nori-locale[^>]*>[\s\S]*?<\/script>/gi,'');
 s=s.replace(/<script\b[^>]*data-wp-locale-route[^>]*>[\s\S]*?<\/script>/gi,'');
 s=s.replace(/<meta\b(?=[^>]*(?:name|property)="(?:og:url|og:type|og:image:width|og:image:height|twitter:card|twitter:image)")[^>]*>/gi,'');
 s=s.replace(/<meta\b(?=[^>]*name="(?:twitter:title|twitter:description)")[^>]*>/gi,'');
 const url=`https://weightplay.com/${SEGMENTS[locale]}/games/nori-sandworks/`;
 s=s.replace(/<head>/i,`<head>\n<meta name="twitter:title" content="${e(t.title)} | WeightPlay"><meta name="twitter:description" content="${e(t.summary)}">\n<script data-wp-nori-locale>window.__WEIGHTPLAY_ROUTE_LOCALE__=${JSON.stringify(locale)};try{localStorage.setItem('wp-locale',${JSON.stringify(locale)});localStorage.setItem('weightPlayLocale',${JSON.stringify(locale)});}catch{}</script>`);
 s=s.replace(/<\/head>/i,`<meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image:width" content="1254"><meta property="og:image:height" content="1254"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://weightplay.com/games/nori-sandworks/assets/og.webp">\n<link rel="canonical" href="${url}">\n${Object.entries(SEGMENTS).map(([lang,seg])=>`<link rel="alternate" hreflang="${lang}" href="https://weightplay.com/${seg}/games/nori-sandworks/">`).join('\n')}\n<link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/nori-sandworks/">\n<script type="application/ld+json">${JSON.stringify(schema(locale,gameVersion))}</script>\n</head>`);
 // Replacing metadata must not accumulate blank head lines on every generation.
 s=s.replace(/<head>([\s\S]*?)<\/head>/i,(_,head)=>'<head>'+head.replace(/\n(?:[ \t]*\n)+/g,'\n')+'</head>');
 return s;
}
// Game-owned native shell completion after the canonical scoped route generator.
// This new game's English noindex entry has no historical route to preserve.
if(typeof process!=='undefined'&&process.argv[1]?.endsWith('/nori-sandworks/page-copy.mjs')&&process.argv.includes('--write')){
 const fs=await import('node:fs');const {extractAuthoredGuide,guideContentLoss}=await import('../../scripts/lib/authored-guide-preservation.mjs');
 const canonical=new URL('./index.html',import.meta.url);let source=fs.readFileSync(canonical,'utf8');
 if(!source.includes('noindex,nofollow'))throw Error('PLANNED_SOURCE_REQUIRED');
 source=source.replace(extractAuthoredGuide(source),renderStaticGuide('en'));fs.writeFileSync(canonical,source);
 for(const [locale,segment]of Object.entries(SEGMENTS)){const file=new URL(`../../${segment}/games/nori-sandworks/index.html`,import.meta.url);let html=renderEntry(source,locale);html=html.replace(extractAuthoredGuide(html),renderStaticGuide(locale));if(guideContentLoss(source,html).lost)throw Error('GUIDE_CONTENT_LOSS');fs.mkdirSync(new URL('.',file),{recursive:true});fs.writeFileSync(file,html);}
 console.log(JSON.stringify({nativeEntries:13,gameId:'nori-sandworks',indexable:false}));
}
