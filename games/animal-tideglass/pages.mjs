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
  en:['Related games','Practice remembering positions.','Practice matching numbers.'],
  'zh-Hant':['相關遊戲','練習記住牌的位置。','練習數字配對。'],
  'zh-Hans':['相关游戏','练习记住牌的位置。','练习数字配对。'],
  ja:['関連ゲーム','カードの位置を覚える練習。','数字を組み合わせる練習。'],
  ko:['관련 게임','카드 위치를 기억하는 연습.','숫자를 짝짓는 연습.'],
  es:['Juegos relacionados','Practica recordar posiciones.','Practica emparejar números.'],
  'pt-BR':['Jogos relacionados','Pratique lembrar posições.','Pratique formar pares de números.'],
  fr:['Jeux associés','Entraînez votre mémoire des positions.','Exercez-vous à associer des nombres.'],
  de:['Ähnliche Spiele','Übe, dir Positionen zu merken.','Übe passende Zahlenpaare.'],
  it:['Giochi correlati','Esercitati a ricordare le posizioni.','Esercitati ad abbinare i numeri.'],
  ru:['Похожие игры','Тренируйтесь запоминать позиции.','Подбирайте пары чисел.'],
  hi:['संबंधित खेल','जगहें याद रखने का अभ्यास करें।','संख्याओं के जोड़े बनाने का अभ्यास करें।'],
  ar:['ألعاب ذات صلة','تدرّب على تذكّر المواقع.','تدرّب على مطابقة الأرقام.']
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
  const related=['star-memory','animal-number-match'].map((id,i)=>`<p><a href="/${c.segment}/games/${id}/" data-runtime-localize="off">${escape(titles[id][locale])}</a> — ${escape(extra[locale][i+1])}</p>`).join('\n');
  const guide=[['about',1],['how',2],['rules',3],['tips',4],['save',5]].map(([heading,index])=>`<section class="game-info-section"><h3>${escape(c[heading])}</h3><p>${escape(c.guide[index])}</p></section>`).join('\n');
  const scripts=['/src/game-layout-config.js?v=20260919-banner1','/src/weightplay-audio.js?v=1.0.0','/src/game-title-registry.js?v=20260908-approved-game-names1','/games/animal-tideglass/locales.js?v=tideglass-v4','/games/animal-tideglass/rules.js?v=tideglass-v4','/games/animal-tideglass/motion.js?v=tideglass-v4','/src/game-screen-frame.js?v=20260925-main-progress-40-v3','/src/stage-virtualization-standard.js?v=20260922-v6','/games/animal-tideglass/game.js?v=tideglass-v4','/src/stage-selector-standard.js?v=20260925-stage-v7','/src/battle-canvas-standard.js?v=20260925-stage-v7','/src/game-official-name.js?v=20260908-approved-game-names1'].map(src=>`<script defer src="${src}"></script>`).join('\n');
  const redirect=legacy?`<script>/* Canonical unprefixed entry only: preserve query, hash and explicit locale. */(()=>{if(location.pathname.startsWith('/games/')&&!/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname)){const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};let locale=new URLSearchParams(location.search).get('locale');try{locale=locale||localStorage.getItem('weightPlayLocale')||localStorage.getItem('weightplayLocale')||localStorage.getItem('wp-locale')||localStorage.getItem('weightplay-tideglass-locale');}catch{}const segment=routes[locale]||Object.values(routes).find(value=>value===locale)||'en';location.replace('/'+segment+'/games/animal-tideglass/'+location.search+location.hash);}})();</script>`:'';
  return `<!doctype html>
<html lang="${locale}" dir="${c.direction}" data-wp-official-name data-wp-shared-interface="7">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escape(title)} | WeightPlay</title>
<meta name="description" content="${escape(description)}"><meta name="robots" content="noindex,nofollow,noarchive">
<meta name="weightplay-audience" content="general"><meta name="weightplay-game-version" content="v4"><meta name="weightplay-interface-version" content="7">
<meta name="weightplay-text-version" content="1.3.0"><link rel="canonical" href="${canonical}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${canonicalFor('en')}">
<meta property="og:site_name" content="WeightPlay"><meta property="og:type" content="website"><meta property="og:locale" content="${ogLocales[COPY.__localeKeys.indexOf(locale)]}">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://weightplay.com${asset}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="https://weightplay.com${asset}">
<script type="application/ld+json">${JSON.stringify(seo).replace(/</g,'\\u003c')}</script>
${redirect}
<link rel="stylesheet" href="/src/game-page-info.css?v=20260919-guide1"><link rel="stylesheet" href="/src/stage-selector-standard.css?v=20260925-stage-v7"><link rel="stylesheet" href="/src/battle-canvas-standard.css?v=20260925-stage-v7"><link rel="stylesheet" href="/src/game-screen-frame.css?v=20260925-main-progress-40-v3"><link rel="stylesheet" href="/games/animal-tideglass/style.css?v=tideglass-v4">
${scripts}
<script>window.addEventListener('load',()=>{if(!window.TIDEGLASS_TEST)document.getElementById('loadError').hidden=false;},{once:true});</script>
</head>
<body data-wp-game-id="animal-tideglass" data-screen="main">
<main id="app" data-wp-frame-root>
<section id="mainView" data-screen="main" aria-labelledby="mainTitle">
<header id="mainHeader"><a href="/${c.segment}/" data-wp-return="main" aria-label="WeightPlay">←</a><strong id="mainTitle" data-wp-frame-title data-wp-game-title data-runtime-localize="off">${escape(title)}</strong></header>
<div id="mainContent"><img id="poster" data-wp-frame-poster src="${asset}" alt="${escape(title)}" width="1254" height="1254" fetchpriority="high">
<div data-wp-frame-copy><p data-wp-frame-summary>${escape(description)}</p><p id="mainProgress" data-wp-frame-progress>${escape(format(c.progress,{count:0,total:30}))}</p><button type="button" id="startBtn" data-wp-frame-action="primary" disabled>${escape(c.start)}</button></div></div>
</section></main>
<select id="localeSelect" hidden aria-hidden="true" tabindex="-1">${COPY.__localeKeys.map(key=>`<option value="${key}"${key===locale?' selected':''}>${escape(COPY[key].languageName)}</option>`).join('')}</select>
<p id="loadError" role="alert" hidden>${escape(c.loadError)}</p>
<noscript><p>${escape(c.guide[0])}</p></noscript>
<section id="gameGuide" class="game-page-info tg-guide" data-wp-game-guide data-wp-guide-complete="true" data-wp-text-version="1.3.0" data-runtime-localize="off" aria-labelledby="guideTitle">
<h1 id="guideTitle" class="game-info-title" data-wp-game-title>${escape(title)}</h1><p>${escape(description)}</p><div class="game-info-tags">${c.tags.map(tag=>`<span>${escape(tag)}</span>`).join('')}</div>
${guide}
<section id="faq" class="game-info-section"><h3>${escape(c.faqTitle)}</h3><dl>${c.faq.map(([q,a])=>`<div><dt>${escape(q)}</dt><dd>${escape(a)}</dd></div>`).join('')}</dl></section>
<section class="game-info-section"><h3>${escape(extra[locale][0])}</h3>${related}</section>
</section>
</body></html>\n`;
}
export function writePages(){
  fs.writeFileSync(path.join(here,'index.html'),renderPage('en',true));
  for(const key of COPY.__localeKeys){const dir=path.join(root,COPY[key].segment,'games/animal-tideglass');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),renderPage(key));}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))writePages();
