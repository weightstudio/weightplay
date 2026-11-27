var x=Object.defineProperty;var c=(t,o)=>x(t,"name",{value:o,configurable:!0});import d from"node:fs";import s from"node:path";import P from"node:vm";import{fileURLToPath as v}from"node:url";import{titles as $,descriptions as j,word as O,routes as n}from"./locales.mjs?wp-media=fa9b405e44d52d00";const a="galevault-atlas",y="games/"+a,p=v(new URL("../../",import.meta.url)),f={window:{}};for(const t of["game-title-registry","lobby-data"])P.runInNewContext(d.readFileSync(s.join(p,"src",t+".js"),"utf8"),f);const q=f.window.WONDER_LOBBY.games,B=f.window.WEIGHTPLAY_GAME_TITLES,b=q.find(t=>t.id===a),T=b?.status==="playable"&&!b.internalTrial&&!b.internalOnly,m=c(t=>String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),"esc");export function renderEntry(t,{canonical:o=!1}={}){if(!Object.hasOwn(n,t))throw Error("GALEVAULT_LOCALE_UNKNOWN");const e=c(i=>m(O(t,i)),"t"),l=m($[t]),g=m(j[t]),u=n[t],h="https://weightplay.com/"+u+"/games/"+a+"/",w="/games/"+a+"/art/cover.webp?wp-media=fa9b405e44d52d00",k=Object.entries(n).map(([i,r])=>'<link rel="alternate" hreflang="'+i+'" href="https://weightplay.com/'+r+"/games/"+a+'/">').join(`
`),L=o?'<script data-wp-locale-route>if(/^https?:$/.test(location.protocol)&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){try{const byLocale='+JSON.stringify(n)+';const p=new URLSearchParams(location.search);const l=p.get("lang")||localStorage.getItem("weightPlayLocale")||localStorage.getItem("weightplayLocale")||localStorage.getItem("wp-locale")||"en";if(Object.hasOwn(byLocale,l)&&l!=="en"){location.replace("/"+byLocale[l]+"/games/'+a+'/"+location.search+location.hash)}else{location.replace("/en/games/'+a+'/"+location.search+location.hash)}}catch{location.replace("/en/games/'+a+'/"+location.search+location.hash)}}<\/script>':"",S=["moonlit-atrium","cloudhold-voyager","reedway-transit"].map(i=>q.find(r=>r.id===i&&r.status==="playable"&&!r.internalOnly&&!r.internalTrial)).filter(Boolean).map(i=>'<a data-related-id="'+i.id+'" href="/'+u+"/games/"+i.id+'/">'+m(B[i.id]?.[t]??i.title[t])+"</a>").join("");return`<!doctype html>
<html lang="${t}" dir="${t==="ar"?"rtl":"ltr"}" class="wp-frame-main-flow" data-wp-official-name data-wp-entry-renderer="localize.mjs?wp-media=fa9b405e44d52d00#renderEntry" data-wp-publication-locale-completion data-wp-shared-interface="7">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${l} | WeightPlay</title>
${L}
<base href="/games/${a}/">
<meta name="description" content="${g}"><meta name="robots" content="${T?"index,follow":"noindex,nofollow"}">
<link rel="canonical" href="${h}">
${k}
<link rel="alternate" hreflang="x-default" href="https://weightplay.com/en/games/${a}/">
<meta property="og:type" content="website"><meta property="og:site_name" content="WeightPlay"><meta property="og:url" content="${h}"><meta property="og:title" content="${l}"><meta property="og:description" content="${g}"><meta property="og:image" content="https://weightplay.com${w}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"VideoGame",name:$[t],description:j[t],url:h,inLanguage:t,gamePlatform:"Web browser",genre:"Strategy",image:"https://weightplay.com"+w}).replaceAll("<","\\u003c")}<\/script>
<script src="/src/game-layout-config.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/weightplay-audio.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/site-config.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/i18n.js?wp-media=fa9b405e44d52d00"><\/script>${t==="ja"?'<script src="/src/i18n-ja.js?v=20260719-ja1&wp-media=fa9b405e44d52d00"><\/script>':""}<script src="/src/game-title-registry.js?wp-media=fa9b405e44d52d00" data-wp-game-title-registry><\/script>
<script src="/src/wallet.js?wp-media=fa9b405e44d52d00"><\/script><script src="/src/analytics.js?wp-media=fa9b405e44d52d00"><\/script>
<link rel="stylesheet" href="/src/stage-selector-standard.css?wp-media=fa9b405e44d52d00" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-screen-frame.css?wp-media=fa9b405e44d52d00" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-play-ui.css?wp-media=fa9b405e44d52d00" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-ui-theme.css?wp-media=fa9b405e44d52d00" data-wp-entry-required>
<link rel="stylesheet" href="/games/${a}/game.css?v=gameplay-v2&wp-media=fa9b405e44d52d00" data-wp-entry-required>
</head>
<body ${T?"data-galevault-public":""} class="wp-frame-main-active" data-wp-game-owned-guide data-wp-play-ui="1" data-game-id="${a}" data-wp-game-id="${a}" data-audience="general" data-has-stage="true" data-wp-game-version="v2" data-game-version="v2" data-wp-interface-version="0">
<div id="gameFrame" data-wp-frame-root hidden>
 <div id="mainGroup" class="wp-frame-main-flow">
  <section id="mainScreen" data-wp-frame-scene="main">
   <header id="mainHeader"><a href="/${u}/" data-wp-frame-action="secondary" data-wp-return="main" aria-label="WeightPlay">← W</a><h1 id="gameTitle" data-wp-frame-title data-wp-game-title data-runtime-localize="off">${l}</h1></header>
   <section id="mainHero" data-wp-frame-content="main">
    <img id="cover" data-wp-frame-poster src="${w}" alt="${l}" width="720" height="720" fetchpriority="high">
    <div data-wp-frame-copy><p id="description" data-wp-frame-summary>${g}</p><p id="mainProgress" data-wp-frame-progress></p><button type="button" id="startBtn" data-wp-frame-action="primary" data-wp-main-start disabled>${e("start")}</button></div>
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
<script src="/src/edge-guard.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/stage-rail-i9.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/game-play-ui.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/battle-canvas-standard.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script src="/src/game-screen-frame.js?wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script defer src="/src/game-entry-loader.js?v=20261026-audience-back-v1&wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
<script type="module" src="/games/${a}/game.mjs?v=gameplay-v2&wp-media=fa9b405e44d52d00" data-wp-entry-required><\/script>
</body>
</html>
`}if(c(renderEntry,"renderEntry"),process.argv[1]&&s.resolve(process.argv[1])===v(import.meta.url)){if(/data-wp-interface-version="10"/.test(d.readFileSync(s.join(p,y,"index.html"),"utf8")))throw Error("I10 entries must not be overwritten by the legacy localization template");d.writeFileSync(s.join(p,y,"index.html"),renderEntry("en",{canonical:!0}));for(const[t,o]of Object.entries(n)){const e=s.join(p,o,y);d.mkdirSync(e,{recursive:!0}),d.writeFileSync(s.join(e,"index.html"),renderEntry(t))}}
