/** First-response renderer shared by the canonical and all thirteen localized entries. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/game-title-registry.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(here,'locales.js'),'utf8'),context);
export const COPY=context.window.TIDEGLASS_LOCALES;
const titles=context.window.WEIGHTPLAY_GAME_TITLES;
const extra={
  en:['Related games','Plan piece placement to clear full lines.','Practice matching numbers.'],
  'zh-Hant':['相關遊戲','規劃方塊位置，消除完整橫列與直行。','練習數字配對。'],
  'zh-Hans':['相关游戏','规划方块位置，消除完整横行与直列。','练习数字配对。'],
  ja:['関連ゲーム','ブロックを配置して横列と縦列をそろえよう。','数字を組み合わせる練習。'],
  ko:['관련 게임','블록을 배치해 가로줄과 세로줄을 완성하세요.','숫자를 짝짓는 연습.'],
  es:['Juegos relacionados','Coloca piezas con cuidado para completar líneas.','Practica emparejar números.'],
  'pt-BR':['Jogos relacionados','Planeje as peças para completar linhas.','Pratique formar pares de números.'],
  fr:['Jeux associés','Placez les pièces pour compléter des lignes.','Exercez-vous à associer des nombres.'],
  de:['Ähnliche Spiele','Plane deine Platzierung, um vollständige Reihen zu räumen.','Übe passende Zahlenpaare.'],
  it:['Giochi correlati','Pianifica le forme per completare linee.','Esercitati ad abbinare i numeri.'],
  ru:['Похожие игры','Планируйте фигуры, чтобы собирать полные линии.','Подбирайте пары чисел.'],
  hi:['संबंधित खेल','टुकड़ों की जगह चुनें और पूरी पंक्तियाँ मिटाएँ।','संख्याओं के जोड़े बनाने का अभ्यास करें।'],
  ar:['ألعاب ذات صلة','خطّط لمواضع القطع لإكمال الصفوف والأعمدة.','تدرّب على مطابقة الأرقام.']
};
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset='/games/animal-tideglass/assets/animal-tideglass-cover-v2.png';
const ogLocales=['en_US','zh_TW','zh_CN','ja_JP','ko_KR','es_ES','pt_BR','fr_FR','de_DE','it_IT','ru_RU','hi_IN','ar_AR'];
const canonicalFor=locale=>'https://weightplay.com/'+COPY[locale].segment+'/games/animal-tideglass/';
const format=(value,vars)=>Object.entries(vars).reduce((out,[key,val])=>out.replaceAll('{'+key+'}',String(val)),value);
export function renderPage(locale='en',legacy=false){
  const c=COPY[locale];if(!c)throw Error('Unsupported Tideglass locale: '+locale);
  if(c.title!==titles['animal-tideglass'][locale])throw Error('Tideglass official-name drift: '+locale);
  const canonical=canonicalFor(locale),title=c.title,description=c.guide[0];
  const seo={
    '@context':'https://schema.org','@graph':[
      {'@type':'VideoGame','@id':canonical+'#game',name:title,url:canonical,image:'https://weightplay.com'+asset,description,inLanguage:locale,genre:c.tags,gamePlatform:'Web browser',operatingSystem:'Any',isAccessibleForFree:true,publisher:{'@type':'Organization',name:'WeightPlay',url:'https://weightplay.com/'},numberOfPlayers:{'@type':'QuantitativeValue',value:1}},
      {'@type':'FAQPage','@id':canonical+'#faq',inLanguage:locale,mainEntity:c.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
    ]
  };
  const alternates=COPY.__localeKeys.map(key=>`<link rel="alternate" hreflang="${key}" href="${canonicalFor(key)}">`).join('\n');
  const related=['block-blast','animal-number-match'].map((id,i)=>`<a class="game-info-related-card" data-game-id="${id}" href="/${c.segment}/games/${id}/"><span class="game-info-related-poster"><img src="/assets/weightplay-logo.png" data-final-src="/assets/weightplay-logo.png" alt="${escape(titles[id][locale])} game poster" width="320" height="320" loading="lazy" decoding="async"></span><span class="game-info-related-copy"><strong data-runtime-localize="off">${escape(titles[id][locale])}</strong><span>${escape(extra[locale][i+1])}</span></span></a>`).join('\n');
  const guide=[['about',1],['how',2],['rules',3],['tips',4],['save',5]].map(([heading,index])=>`<section class="game-info-section"><h3>${escape(c[heading])}</h3><p>${escape(c.guide[index])}</p></section>`).join('\n');
  const scripts=['/src/game-layout-config.js?v=20260919-banner1','/src/weightplay-audio.js?v=1.0.0','/src/i18n.js?v=20260721-locale13-1','/src/game-title-registry.js?v=20260908-approved-game-names1','/games/animal-tideglass/locales.js?v=tideglass-v4','/games/animal-tideglass/rules.js?v=tideglass-v4','/games/animal-tideglass/motion.js?v=tideglass-v4','/games/animal-tideglass/stage-config.js?v=20261020-tideglass-i9-stage-config1','/src/stage-rail-i9.js?v=20261017-shared-stage-rail1','/src/game-play-ui.js?v=20261017-shared-play-ui1','/src/game-screen-frame.js?v=20261019-interface9-settings-locale-adoption-v1','/src/battle-canvas-standard.js?v=20260925-stage-v7','/src/interface7-poster-registry.js?v=20261020-tideglass-i9-related1','/src/game-page-info.js?v=20261014-guide-related-i9-v1','/src/game-official-name.js?v=20260908-approved-game-names1','/games/animal-tideglass/game.js?v=20261020-tideglass-v4-i9-1'].map(src=>`<script defer src="${src}"></script>`).join('\n');
  const redirect=legacy?`<script>/* Canonical unprefixed entry: retain only the documented preview flag. */(()=>{if(location.pathname.startsWith('/games/')&&!/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname)){const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};let locale='en';try{locale=localStorage.getItem('weightPlayLocale')||localStorage.getItem('weightplayLocale')||localStorage.getItem('wp-locale')||localStorage.getItem('weightplay-tideglass-locale')||'en';}catch{}const segment=routes[locale]||Object.values(routes).find(value=>value===locale)||'en';const preview=new URLSearchParams(location.search).get('preview')==='1'?'?preview=1':'';location.replace('/'+segment+'/games/animal-tideglass/'+preview);}})();</script>`:'';
  return `<!doctype html>
<html lang="${locale}" dir="${c.direction}" data-wp-official-name data-wp-shared-interface="7">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escape(title)} | WeightPlay</title>
<meta name="description" content="${escape(description)}"><meta name="robots" content="noindex,nofollow,noarchive">
<meta name="weightplay-audience" content="general"><meta name="weightplay-game-version" content="v4"><meta name="weightplay-interface-version" content="9">
<meta name="weightplay-text-version" content="1.3.0"><link rel="canonical" href="${canonical}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${canonicalFor('en')}">
<meta property="og:site_name" content="WeightPlay"><meta property="og:type" content="website"><meta property="og:locale" content="${ogLocales[COPY.__localeKeys.indexOf(locale)]}">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://weightplay.com${asset}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="https://weightplay.com${asset}">
<script type="application/ld+json">${JSON.stringify(seo).replace(/</g,'\\u003c')}</script>
${redirect}
<link rel="stylesheet" href="/src/game-page-info.css?v=20261019-guide-no-legacy-stage-css-v1"><link rel="stylesheet" href="/games/animal-tideglass/style.css?v=20261020-tideglass-v4-i9-1"><link rel="stylesheet" href="/src/game-screen-frame.css?v=20261019-interface9-settings-locale-adoption-v1"><link rel="stylesheet" href="/src/game-play-ui.css?v=20261017-shared-play-ui1"><link rel="stylesheet" href="/src/battle-canvas-standard.css?v=20260925-stage-v7"><link rel="stylesheet" href="/src/interface9-shared-screens.css?v=20261017-interface9-guide-theme1">
${scripts}
<script>window.addEventListener('load',()=>{if(!window.TIDEGLASS_TEST)document.getElementById('loadError').hidden=false;},{once:true});</script>
</head>
<body class="has-game-page-info" data-audience="general" data-wp-game-age-tags="9,family" data-wp-game-id="animal-tideglass" data-wp-game-version="v4" data-wp-interface-version="9" data-wp-game-owned-guide="true" data-screen="main">
<main id="app" data-wp-frame-root data-wp-play-ui="1">
<section id="mainView" data-screen="main" aria-labelledby="mainTitle">
<header id="mainHeader"><a href="/${c.segment}/" data-wp-return="main" aria-label="WeightPlay">←</a><strong id="mainTitle" data-wp-frame-title data-wp-game-title data-runtime-localize="off">${escape(title)}</strong></header>
<div id="mainContent"><img id="poster" data-wp-frame-poster src="${asset}" alt="${escape(title)}" width="1254" height="1254" fetchpriority="high">
<div data-wp-frame-copy><p data-wp-frame-summary>${escape(description)}</p><p id="mainProgress" data-wp-frame-progress>${escape(format(c.progress,{count:0,total:30}))}</p><button type="button" id="startBtn" data-wp-frame-action="primary" disabled>${escape(c.start)}</button></div></div>
</section></main>
<select id="localeSelect" hidden aria-hidden="true" tabindex="-1">${COPY.__localeKeys.map(key=>`<option value="${key}"${key===locale?' selected':''}>${escape(COPY[key].languageName)}</option>`).join('')}</select>
<p id="loadError" role="alert" hidden>${escape(c.loadError)}</p>
<noscript><p>${escape(c.guide[0])}</p></noscript>
<section id="gameGuide" class="game-page-info game-page-info-static tg-guide" data-wp-game-guide data-wp-guide-complete="true" data-wp-text-version="1.3.0" data-runtime-localize="off" aria-labelledby="guideTitle">
<div class="game-info-hero"><div class="game-info-title"><h2 id="guideTitle" data-wp-game-title>${escape(title)}</h2><p>${escape(description)}</p></div></div><div class="game-info-tags">${c.tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div>
<div class="game-info-sections">
${guide}
<section id="faq" class="game-info-section"><h3>${escape(c.faqTitle)}</h3><dl>${c.faq.map(([q,a])=>`<div><dt>${escape(q)}</dt><dd>${escape(a)}</dd></div>`).join('')}</dl></section>
<section class="game-info-section game-info-related-section" data-wp-guide-related-interface="9"><h3>${escape(extra[locale][0])}</h3><div class="game-info-related">${related}</div></section>
</div>
</section>
</body></html>\n`;
}
export function writePages(){
  fs.writeFileSync(path.join(here,'index.html'),renderPage('en',true));
  for(const key of COPY.__localeKeys){const dir=path.join(root,COPY[key].segment,'games/animal-tideglass');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),renderPage(key));}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))writePages();
