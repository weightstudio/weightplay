var x=Object.defineProperty;var l=(t,s)=>x(t,"name",{value:s,configurable:!0});import c from"node:fs";import d from"node:path";import P from"node:vm";import{fileURLToPath as b}from"node:url";import{titles as v,descriptions as $,word as O,routes as o}from"./locales.mjs?wp-media=85138c1bb958755e";const a="galevault-atlas",j="games/"+a,w=b(new URL("../../",import.meta.url)),y={window:{}};for(const t of["game-title-registry","lobby-data"])P.runInNewContext(c.readFileSync(d.join(w,"src",t+".js"),"utf8"),y);const q=y.window.WONDER_LOBBY.games,B=y.window.WEIGHTPLAY_GAME_TITLES,f=q.find(t=>t.id===a),T=f?.status==="playable"&&!f.internalTrial&&!f.internalOnly,p=l(t=>String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),"esc");export function renderEntry(t,{canonical:s=!1}={}){if(!Object.hasOwn(o,t))throw Error("GALEVAULT_LOCALE_UNKNOWN");const e=l(i=>p(O(t,i)),"t"),n=p(v[t]),m=p($[t]),g=o[t],u="https://weightplay.com/"+g+"/games/"+a+"/",h="/games/"+a+"/art/cover.webp?wp-media=85138c1bb958755e",k=Object.entries(o).map(([i,r])=>'<link rel="alternate" hreflang="'+i+'" href="https://weightplay.com/'+r+"/games/"+a+'/">').join(`
`),L=s?'<script data-wp-locale-route>if(/^https?:$/.test(location.protocol)&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){try{const byLocale='+JSON.stringify(o)+';const p=new URLSearchParams(location.search);const l=p.get("lang")||localStorage.getItem("weightPlayLocale")||localStorage.getItem("weightplayLocale")||localStorage.getItem("wp-locale")||"en";if(Object.hasOwn(byLocale,l)&&l!=="en"){location.replace("/"+byLocale[l]+"/games/'+a+'/"+location.search+location.hash)}else{location.replace("/en/games/'+a+'/"+location.search+location.hash)}}catch{location.replace("/en/games/'+a+'/"+location.search+location.hash)}}<\/script>':"",S=["moonlit-atrium","cloudhold-voyager","reedway-transit"].map(i=>q.find(r=>r.id===i&&r.status==="playable"&&!r.internalOnly&&!r.internalTrial)).filter(Boolean).map(i=>'<a data-related-id="'+i.id+'" href="/'+g+"/games/"+i.id+'/">'+p(B[i.id]?.[t]??i.title[t])+"</a>").join("");return`<!doctype html>
<html lang="${t}" dir="${t==="ar"?"rtl":"ltr"}" class="wp-frame-main-flow" data-wp-official-name data-wp-entry-renderer="localize.mjs?wp-media=85138c1bb958755e#renderEntry" data-wp-publication-locale-completion data-wp-shared-interface="7">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${n} | WeightPlay</title>
${L}
<base href="/games/${a}/">
<meta name="description" content="${m}"><meta name="robots" content="${T?"index,follow":"noindex,nofollow"}">
<link rel="canonical" href="${u}">
${k}
<link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/${a}/">
<meta property="og:type" content="website"><meta property="og:site_name" content="WeightPlay"><meta property="og:url" content="${u}"><meta property="og:title" content="${n}"><meta property="og:description" content="${m}"><meta property="og:image" content="https://weightplay.com${h}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"VideoGame",name:v[t],description:$[t],url:u,inLanguage:t,gamePlatform:"Web browser",genre:"Strategy",image:"https://weightplay.com"+h}).replaceAll("<","\\u003c")}<\/script>
<script src="/src/game-layout-config.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/weightplay-audio.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/site-config.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/i18n.js?wp-media=85138c1bb958755e"><\/script>${t==="ja"?'<script src="/src/i18n-ja.js?v=20260719-ja1&wp-media=85138c1bb958755e"><\/script>':""}<script src="/src/game-title-registry.js?wp-media=85138c1bb958755e" data-wp-game-title-registry><\/script>
<script src="/src/wallet.js?wp-media=85138c1bb958755e"><\/script><script src="/src/analytics.js?wp-media=85138c1bb958755e"><\/script>
<link rel="stylesheet" href="/src/stage-selector-standard.css?wp-media=85138c1bb958755e" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-screen-frame.css?wp-media=85138c1bb958755e" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-play-ui.css?wp-media=85138c1bb958755e" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-ui-theme.css?wp-media=85138c1bb958755e" data-wp-entry-required>
<link rel="stylesheet" href="/games/${a}/game.css?v=gameplay-v2&wp-media=85138c1bb958755e" data-wp-entry-required>
</head>
<body ${T?"data-galevault-public":""} class="wp-frame-main-active" data-wp-game-owned-guide data-wp-play-ui="1" data-game-id="${a}" data-wp-game-id="${a}" data-audience="general" data-has-stage="true" data-wp-game-version="v2" data-game-version="v2" data-wp-interface-version="0">
<div id="gameFrame" data-wp-frame-root hidden>
 <div id="mainGroup" class="wp-frame-main-flow">
  <section id="mainScreen" data-wp-frame-scene="main">
   <header id="mainHeader"><a href="/${g}/" data-wp-frame-action="secondary" data-wp-return="main" aria-label="WeightPlay">← W</a><h1 id="gameTitle" data-wp-frame-title data-wp-game-title data-runtime-localize="off">${n}</h1></header>
   <section id="mainHero" data-wp-frame-content="main">
    <img id="cover" data-wp-frame-poster src="${h}" alt="${n}" width="720" height="720" fetchpriority="high">
    <div data-wp-frame-copy><p id="description" data-wp-frame-summary>${m}</p><p id="mainProgress" data-wp-frame-progress></p><button type="button" id="startBtn" data-wp-frame-action="primary" data-wp-main-start disabled>${e("start")}</button></div>
   </section>
  </section>
  <section id="guideContent" class="game-page-info game-page-info-static" data-wp-game-guide data-wp-preserve-static-guide data-wp-entry-guide aria-labelledby="guideTitle">
   <h2 id="guideTitle">${e("guide")}</h2>
   <div class="archive-guide-grid">${["goal","how","controls","finish"].map(i=>"<article><h3>"+e(i+"Label")+"</h3><p>"+e(i+"Copy")+"</p></article>").join("")}</div>
   <div class="archive-faq"><details><summary>${e("faqRoute")}</summary><p>${e("faqRouteText")}</p></details><details><summary>${e("faqPhase")}</summary><p>${e("faqPhaseText")}</p></details><details><summary>${e("faqLook")}</summary><p>${e("faqLookText")}</p></details></div>
   <section class="archive-related" aria-label="${e("related")}"><h3>${e("related")}</h3>${S}</section>
  </section>
 </div>
 <section id="stageScreen" class="stage-canvas" data-wp-standard-stage-screen data-wp-stage-art="/assets/lobby-block-atmosphere.svg" hidden>
  <header id="stageHeader"><button id="stageBack" type="button" data-wp-return="stage" data-wp-frame-action="secondary" aria-label="${e("back")}">←</button><strong data-wp-frame-title hidden></strong></header>
  <div id="stageWorkspace"><div id="stagePanel"><div id="stagePage"><div id="stageRail"></div></div></div><section id="collectionPanel" hidden></section></div>
  <nav id="stageTabs" data-wp-frame-stage-nav><button id="stagesTab" data-wp-frame-action="secondary" data-wp-frame-stage-slot="stages">${e("stages")}</button><button id="collectionTab" data-wp-frame-action="secondary" data-wp-frame-stage-slot="shop">${e("collection")}</button></nav>
 </section>
 <section id="battleScreen" class="battle-canvas" data-wp-logical-battle-canvas data-wp-battle-canvas-root data-wp-canvas-max-width="920" data-wp-battle-min-width="390" data-wp-battle-min-height="670" data-wp-battle-landscape-width="760" data-wp-battle-landscape-height="390" hidden>
  <header id="battleHeader"><button id="battleBack" type="button" data-wp-return="battle" data-wp-frame-action="secondary" aria-label="${e("back")}">←</button><strong data-wp-frame-title hidden></strong></header>
  <main id="battleLive">
   <section id="arena"><div id="tileControls" dir="ltr"></div><div id="skyCue"></div></section>
   <section id="routeDeck" aria-label="${e("door")}">
    <div id="routeChoices" dir="ltr"></div>
    <div id="draftPanel" role="group" aria-labelledby="draftTitle" hidden>
     <h2 id="draftTitle">${e("choose")}</h2><div id="draftCards" dir="ltr"></div>
     <button type="button" id="draftCancel" data-wp-frame-action="secondary">${e("cancel")}</button>
    </div>
   </section>
   <div id="message" role="status" aria-live="polite"></div>
   <section id="toolDock" data-wp-frame-logical-actions="battle">
    <button id="undoBtn" data-wp-frame-action="secondary">${e("undo")}</button><button id="waitBtn" data-wp-frame-action="secondary">${e("wait")}</button><button id="holdBtn" data-wp-frame-action="secondary">${e("hold")}</button><button id="helpBtn" data-wp-frame-action="secondary">${e("help")}</button>
   </section>
  </main>
  <section id="resultPanel" class="archive-overlay" data-wp-battle-substate="result" role="dialog" aria-labelledby="resultTitle" aria-modal="true" hidden>
   <div class="archive-dialog" data-wp-result-card><h2 id="resultTitle"></h2><p id="resultText"></p><p id="resultNotice" role="status"></p><div class="result-actions"><button id="resultMap" data-wp-frame-action="secondary">${e("stages")}</button><button id="resultNext" data-wp-frame-action="primary">${e("next")}</button><button id="resultRetry" data-wp-frame-action="secondary">${e("replay")}</button></div></div>
  </section>
 </section>
 <section id="dialog" class="archive-overlay" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" hidden><div class="archive-dialog"><h2 id="dialogTitle"></h2><p id="dialogBody"></p><div id="dialogActions"></div></div></section>
 <div id="windStat"><label for="windMeter">${e("wind")}</label><meter id="windMeter" min="0" max="6" value="6"></meter><span id="windValue">6 / 6</span></div>
 <div id="pageStat" role="group"></div>
</div>
<script src="/src/edge-guard.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/stage-rail-i9.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/game-play-ui.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/battle-canvas-standard.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script src="/src/game-screen-frame.js?wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script defer src="/src/game-entry-loader.js?v=20261026-audience-back-v1&wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
<script type="module" src="/games/${a}/game.mjs?v=gameplay-v2&wp-media=85138c1bb958755e" data-wp-entry-required><\/script>
</body>
</html>
`}if(l(renderEntry,"renderEntry"),process.argv[1]&&d.resolve(process.argv[1])===b(import.meta.url)){c.writeFileSync(d.join(w,j,"index.html"),renderEntry("en",{canonical:!0}));for(const[t,s]of Object.entries(o)){const e=d.join(w,s,j);c.mkdirSync(e,{recursive:!0}),c.writeFileSync(d.join(e,"index.html"),renderEntry(t))}}
