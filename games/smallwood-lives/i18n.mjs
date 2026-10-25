import en from './locales/en.mjs';
import hant from './locales/zh-Hant.mjs';
import hans from './locales/zh-Hans.mjs';
import ja from './locales/ja.mjs';
import ko from './locales/ko.mjs';
import es from './locales/es.mjs';
import pt from './locales/pt-BR.mjs';
import fr from './locales/fr.mjs';
import de from './locales/de.mjs';
import it from './locales/it.mjs';
import ru from './locales/ru.mjs';
import hi from './locales/hi.mjs';
import ar from './locales/ar.mjs';
import {LOCALES,ROUTES} from './content.mjs';
export const UI_KEYS='start continue stages collection chapter season wish optional actions choice confirm cancel endSeason remaining requirements noChange forecast relationships memories result saved saveLife next retry return leaveQuestion replaceQuestion replace empty room place remove locked completed ordinary wishDone promise due fulfilled missed rescheduled declined on off buy owned price cosmetics needClear chooseSlot needRoom close help pause continueRun otherTab saveFailed saveCorrupt unavailable lockUnavailable contextLost contextRestored graphicsError notEnough shopError kept stageLocked seed newLife resume swapRun tutorial freeExit confirmMiss confirmUnused loading settings remote local legacyProgress history resultIntro echo finishedWork guide related copyright objects viewAll practice saveDuplicate selected'.split(' ');
export const ACTION_KEYS='explore craft rest company fulfil reschedule bookStudy farPath lunch repairTools walkTogether legacyWork give makeTogether keep choosePerson decline promiseOne promiseBoth repairSelf repairFriend repairHelp leave learnCraft learnNature listen move stay shelter supplies mentorCraft mentorNature allocateA join ownTime buildSelf buildTogether delegate blueprint letter visit later rememberBirth rememberHome rememberChoice workshop garden trail'.split(' ');
export const FAMILY_KEYS='gift invite promise repair learn move weather mentor allocate boundary build contact memory legacy'.split(' ');
export const RAW={en,'zh-Hant':hant,'zh-Hans':hans,ja,ko,es,'pt-BR':pt,fr,de,it,ru,hi,ar};
export const CATALOGS=Object.fromEntries(LOCALES.map(locale=>{
 const raw=RAW[locale],copy={...raw};
 if(raw.ui.split('|').length!==UI_KEYS.length||raw.actions.split('|').length!==ACTION_KEYS.length)throw Error('Locale schema: '+locale);
 UI_KEYS.forEach((key,i)=>copy[key]=raw.ui.split('|')[i]);
 copy.cosmeticItems=raw.cosmetics;
 copy.action=Object.fromEntries(ACTION_KEYS.map((key,i)=>[key,raw.actions.split('|')[i]]));copy.action.allocateB=copy.action.allocateA;
 copy.event=Object.fromEntries(FAMILY_KEYS.map((key,i)=>[key,raw.events[i]]));
 for(const field of ['stats','ages','arcs','species','weather','daily','chapters','wishes','items'])copy[field]=raw[field].split('|');
 for(const field of ['chapters','wishes','items'])if(copy[field].length!==30)throw Error('Chapter copy: '+locale+'/'+field);
 return [locale,copy];
}));
export const normalizeLocale=value=>LOCALES.find(x=>x.toLowerCase()===String(value).toLowerCase())||LOCALES[ROUTES.indexOf(String(value).toLowerCase())]||'en';
export const format=(text,args={})=>String(text).replace(/\{(\w+)\}/g,(_,key)=>args[key]??'');
export const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderGuide(locale='en'){
 const l=normalizeLocale(locale),c=CATALOGS[l],g=RAW[l].guide,route=ROUTES[LOCALES.indexOf(l)];
 return `<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-guide-renderer="i18n.mjs#renderGuide" data-wp-guide-locale="${l}" aria-label="${escape(c.guide)}">
 <div class="game-info-hero"><div class="game-info-title"><h2>${escape(c.title)}</h2><p>${escape(g.intro)}</p></div></div>
 <div class="game-info-sections"><article class="game-info-section"><h3>${escape(g.head)}</h3><ol>${g.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol></article>
 <article class="game-info-section"><h3>${escape(c.actions)}</h3><p>${escape(g.rules)}</p></article>
 <article class="game-info-section"><h3>${escape(c.collection)}</h3><p>${escape(g.collection)}</p></article>
 <article class="game-info-section"><h3>${escape(c.stages)}</h3><ol>${[0,5,10,15,20,25].map(i=>`<li>${escape(c.arcs[i/5])} — ${escape(c.wishes[i])}</li>`).join('')}</ol></article>
 <article class="game-info-section"><h3>${escape(c.help)}</h3><dl>${g.faq.map(([q,a])=>`<dt>${escape(q)}</dt><dd>${escape(a)}</dd>`).join('')}</dl></article></div>
 <div class="game-info-related-section" data-wp-guide-related-interface="9"><h3>${escape(g.related)}</h3><div class="game-info-related-grid">${['animal-peach-oath','animal-carnival-claw'].map(id=>`<a class="game-info-related-card" href="/${route}/games/${id}/" data-game-id="${id}"><span class="game-info-related-poster"><img loading="lazy" src="/games/${id}/assets/cover.webp" alt=""></span><strong>${id}</strong></a>`).join('')}</div></div></section>`;
}
// Scoped finalization after the canonical route generator: only game-owned
// copy markers are changed; shared controls and related-card records retain
// their canonical generator ownership. No browser/runtime is imported here.
export function localizeShell(html,locale='en'){
 const l=normalizeLocale(locale),c=CATALOGS[l];
 let out=html.replace(/<body\b([^>]*)>/,(_,attrs)=>`<body${attrs.replace(/\sdata-audience="[^"]*"|\sdata-wp-game-age-tags="[^"]*"/g,'')} data-audience="general" data-wp-game-age-tags="13,family">`);
 out=out.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-copy="([^"]+)"[^>]*>)[^<]*(<\/\2>)/gi,(_,open,tag,key,close)=>{if(typeof c[key]!=='string')throw Error('Missing shell copy '+key);return open+escape(c[key])+close;});
 out=out.replace(/<[^>]+\bdata-copy-aria="[^"]+"[^>]*>/g,tag=>{const key=tag.match(/data-copy-aria="([^"]+)"/)[1];if(typeof c[key]!=='string')throw Error('Missing aria '+key);return tag.replace(/\saria-label="[^"]*"/g,'').replace(/>$/,` aria-label="${escape(c[key])}">`);});
 out=out.replace(/(<img\b[^>]*\bid="mainPoster"[^>]*\balt=")[^"]*(")/,`$1${escape(c.title)}$2`);
 out=out.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\n?/g,'');
 out=out.replace(/\s*<script\s+data-wp-locale-route[^>]*>[\s\S]*?<\/script>/g,'');
 const schema={'@context':'https://schema.org','@graph':[{'@type':'VideoGame',name:c.title,description:c.intro,inLanguage:l,genre:['Simulation','Strategy'],gamePlatform:'Web browser',author:{'@type':'Organization',name:'WeightPlay'},image:'https://weightplay.com/games/smallwood-lives/assets/cover.webp'},{'@type':'FAQPage',mainEntity:RAW[l].guide.faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}]};
 out=out.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>\n</head>`);
 return out;
}
