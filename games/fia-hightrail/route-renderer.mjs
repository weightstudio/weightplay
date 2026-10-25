import fs from 'node:fs';
import {BUNDLES} from './locales.js';
import {PAGE,SEGMENTS} from './page-copy.mjs';
import {renderStaticGuide,escape,faqFor} from './guide.mjs';
export function renderHightrailRoute(locale){
 const t=BUNDLES[locale],c=PAGE[locale];if(!t||!c)throw Error(`Missing locale ${locale}`);
 const source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const canonical=`https://weightplay.com/${SEGMENTS[locale]}/games/fia-hightrail/`,image='https://weightplay.com/games/fia-hightrail/assets/og.webp';
 let html=source.replace(/<html\b[^>]*>/,`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}" data-wp-interface-version="9">`)
 .replace(/\s*<base\b[^>]*>/g,'').replace('<head>','<head>\n <base href="/games/fia-hightrail/">')
 .replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(c.title)} | WeightPlay</title>`)
 .replace(/\s*<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'')
 .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g,'')
 .replace(/\s*<script id="fia-schema"[^>]*>[\s\S]*?<\/script>/g,'')
 .replace(/(<(?:h1|h2|strong)\b[^>]*data-wp-game-title[^>]*>)[\s\S]*?(<\/[^>]+>)/g,`$1${escape(c.title)}$2`)
 .replace(/(<p id="summary"[^>]*>)[\s\S]*?<\/p>/,`$1${escape(t.summary)}</p>`)
 .replace(/(<p id="progress"[^>]*>)[\s\S]*?<\/p>/,`$1${escape(t.route)} 1 / 30</p>`)
 .replace(/(<button id="startBtn"[^>]*>)[\s\S]*?<\/button>/,`$1${escape(t.start)}</button>`)
 .replace(/(<img id="poster"[^>]*alt=")[^"]*/g,`$1${escape(c.alt)}`)
 .replace(/(<(?:a|button) id="(?:mainReturn|stageBack|battleBack)"[^>]*aria-label=")[^"]*/g,`$1${escape(t.back)}`)
 .replace(/(<canvas id="mountain"[^>]*aria-label=")[^"]*/g,`$1${escape(c.scene)}`)
 .replace(/(<div id="holds"[^>]*aria-label=")[^"]*/g,`$1${escape(c.holds)}`)
 .replace(/(<button id="(helpBtn|pinBtn|anchorBtn)"[^>]*>)[\s\S]*?<\/button>/g,(_,open,id)=>open+escape(t[{helpBtn:'help',pinBtn:'pin',anchorBtn:'anchor'}[id]])+'</button>')
 .replace(/<!-- FIA GUIDE START -->[\s\S]*?<!-- FIA GUIDE END -->/,`<!-- FIA GUIDE START -->\n${renderStaticGuide(locale)}\n<!-- FIA GUIDE END -->`);
 const tags=[['name','description',t.summary],['property','og:site_name','WeightPlay'],['property','og:type','website'],['property','og:title',c.title],['property','og:description',t.summary],['property','og:url',canonical],['property','og:image',image],['name','twitter:card','summary_large_image'],['name','twitter:title',c.title],['name','twitter:description',t.summary],['name','twitter:image',image]].map(([attr,key,value])=>`<meta ${attr}="${key}" content="${escape(value)}">`).join('\n');
 const alternates=Object.entries(SEGMENTS).map(([lang,segment])=>`<link rel="alternate" hreflang="${lang}" href="https://weightplay.com/${segment}/games/fia-hightrail/">`).join('\n');
 const schema={'@context':'https://schema.org','@graph':[{'@type':'VideoGame',name:c.title,description:t.summary,url:canonical,image,inLanguage:locale,applicationCategory:'Game',genre:c.type,keywords:c.tags.join(', '),operatingSystem:'Web browser',isAccessibleForFree:true,softwareVersion:'1',publisher:{'@type':'Organization',name:'WeightPlay'}},{'@type':'FAQPage',inLanguage:locale,mainEntity:faqFor(locale).map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]};
 return html.replace('</head>',`${tags}\n<link rel="canonical" href="${canonical}">\n${alternates}\n<link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/fia-hightrail/">\n<script id="fia-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n</head>`);
}
