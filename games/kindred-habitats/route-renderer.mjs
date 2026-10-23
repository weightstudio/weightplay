import fs from 'node:fs';
import {LOCALES, TITLES, STRINGS} from './locales.js';

// This source is deliberately independent of generated index.html files.
const template = fs.readFileSync(new URL('./page-template.html', import.meta.url), 'utf8');
const segments = Object.freeze({en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'});
const socialLocales = Object.freeze({en:'en_US','zh-Hant':'zh_TW','zh-Hans':'zh_CN',ja:'ja_JP',ko:'ko_KR',es:'es_ES','pt-BR':'pt_BR',fr:'fr_FR',de:'de_DE',it:'it_IT',ru:'ru_RU',hi:'hi_IN',ar:'ar_SA'});
const origin = 'https://weightplay.com';
const image = `${origin}/games/kindred-habitats/art/poster.webp`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const urlFor = locale => `${origin}/${segments[locale]}/games/kindred-habitats/`;

function replaceSlot(html, id, content) {
 const expression = new RegExp(`(<div\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(<\\/div>)`);
 if (!expression.test(html)) throw new Error(`Kindred Habitats template slot missing: ${id}`);
 return html.replace(expression, (_all, open, close) => `${open}${content}${close}`);
}

/** Return one fully localized planned/internal route; performs no writes. */
export function renderKindredHabitatsRoute(locale) {
 if (!LOCALES.includes(locale)) throw new Error(`Unsupported Kindred Habitats locale: ${locale}`);
 const c = STRINGS[locale], title = TITLES[locale], url = urlFor(locale);
 const description = c.guideGoal;
 let html = template
   .replace('href="/index.html?preview=1"', `href="/${segments[locale]}/index.html?preview=1"`)
   .replace(/<html\b[^>]*>/, `<html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}" data-wp-official-name>`)
   .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)} | WeightPlay</title>`)
   .replace(/<meta\b[^>]*name="description"[^>]*>/, `<meta name="description" content="${escape(description)}">`)
   .replace(/<meta\b[^>]*name="robots"[^>]*>/, '<meta name="robots" content="noindex,nofollow,noarchive">')
   .replace(/<meta\b[^>]*name="weightplay-seo-geo-version"[^>]*>/, '<meta name="weightplay-seo-geo-version" content="1.4.0">')
   .replace(/\s*<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g, '')
   .replace(/(<([a-z0-9-]+)\b[^>]*(?:data-official-title|data-wp-game-title)[^>]*>)[\s\S]*?(<\/\2>)/g,
     (_all, open, _tag, close) => `${open}${escape(title)}${close}`)
   .replace(/(<([a-z0-9-]+)\b[^>]*data-copy="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,
     (_all, open, _tag, key, close) => {
       if (typeof c[key] !== 'string') throw new Error(`Missing static Kindred Habitats text ${locale}:${key}`);
       const owned = open.includes('data-runtime-localize=') ? open : open.replace(/>$/, ' data-runtime-localize="off">');
       return `${owned}${escape(c[key])}${close}`;
     })
   .replace(/(<img\b[^>]*src="\/games\/kindred-habitats\/art\/poster\.webp"[^>]*alt=")[^"]*/, (_all, prefix) => `${prefix}${escape(title)}`)
   .replace(/(<(?:a|button)\b[^>]*id="(?:mainReturn|battleBackBtn)"[^>]*aria-label=")[^"]*/g, (_all, prefix) => `${prefix}${escape(c.back)}`)
   .replace(/(<div\b[^>]*id="world"[^>]*aria-label=")[^"]*/, (_all, prefix) => `${prefix}${escape(c.habitat)}`)
   .replace(/(<nav\b[^>]*id="tabs"[^>]*aria-label=")[^"]*/, (_all, prefix) => `${prefix}${escape(title)}`)
   .replace(/(<section\b[^>]*id="gameGuide"[^>]*)(>)/, (_all, open, close) => `${open} aria-label="${escape(c.guideTitle)}"${close}`)
   .replace(/(<b\b[^>]*id="supplies")/, `$1 title="${escape(c.supplies)}"`)
   .replace(/(<b\b[^>]*id="crystals")/, `$1 title="${escape(c.crystals)}"`)
   .replace(/(<b\b[^>]*id="collectionCount")/, `$1 title="${escape(c.collected)}"`)
   .replace(/(<div\b[^>]*id="mainProgress"[^>]*>)[\s\S]*?(<\/div>)/,
     (_all, open, close) => `${open}${escape(c.collected)} 0 / 36 · ${escape(c.adults)} 0${close}`);

 const facts = [['species','36'],['habitat','6'],['adults','0'],['progress','0 / 36']]
   .map(([key,value]) => `<div class="game-info-fact"><strong>${value}</strong><span data-runtime-localize="off">${escape(c[key])}</span></div>`).join('');
 const sections = ['guideHow','guideRules','guideFeedback'].map(key =>
   `<section class="game-info-section"><h2 data-runtime-localize="off">${escape(c[`${key}Title`])}</h2><p data-runtime-localize="off">${escape(c[key])}</p></section>`).join('');
 html = html.replace('<section id="gameGuide"', '<!-- adsense-static-guide:start -->\n<section id="gameGuide"');
 html = html.replace('<div id="gameGuideRelated" data-wp-content-slot="guide-related"></div></section>', '<div id="gameGuideRelated" data-wp-content-slot="guide-related"></div></section>\n<!-- adsense-static-guide:end -->');
 html = replaceSlot(html, 'gameGuideFacts', facts);
 html = replaceSlot(html, 'gameGuideSections', sections);

 const tags = [
   ['property','og:site_name','WeightPlay'],['property','og:type','website'],
   ['property','og:title',title],['property','og:description',description],
   ['property','og:url',url],['property','og:image',image],['property','og:image:alt',title],
   ['property','og:locale',socialLocales[locale]],
   ['name','twitter:card','summary_large_image'],['name','twitter:title',title],
   ['name','twitter:description',description],['name','twitter:image',image],['name','twitter:image:alt',title]
 ].map(([attr,key,value]) => `<meta ${attr}="${key}" content="${escape(value)}">`);
 const alternates = LOCALES.map(key => `<link rel="alternate" hreflang="${key}" href="${urlFor(key)}">`);
 alternates.push(`<link rel="alternate" hreflang="x-default" href="${urlFor('en')}">`);
 const schema = {
   '@context':'https://schema.org','@type':'VideoGame',name:title,description,url,image,
   inLanguage:locale,applicationCategory:'Game',operatingSystem:'Web browser',
   genre:[c.collection,c.care],isAccessibleForFree:true,softwareVersion:template.match(/name="weightplay-game-version" content="(\d+)"/)[1],
   publisher:{'@type':'Organization',name:'WeightPlay',url:origin},
   gamePlatform:'Web browser',numberOfPlayers:{'@type':'QuantitativeValue',minValue:1,maxValue:1},
   offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}
 };
 const metadata = [
   `<link rel="canonical" href="${url}">`, ...tags, ...alternates,
   `<script id="kindred-habitats-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`
 ].join('\n');
 html = html.replace('</head>', `${metadata}\n</head>`);
 // Refuse accidental release promotion or broken translation before generation.
 if (!html.includes('content="noindex,nofollow,noarchive"') || !html.includes('name="weightplay-seo-geo-version" content="1.4.0"')) throw new Error('Kindred Habitats planned route metadata changed');
 if (/\{(?:species|food|feature|phase|level|remaining|count)\}/.test(html)) throw new Error(`Unresolved static parameters: ${locale}`);
 return html;
}
