var k=Object.freeze,I=Object.defineProperty;var n=(t,e)=>I(t,"name",{value:e,configurable:!0});var j=(t,e)=>k(I(t,"raw",{value:k(e||t.slice())}));var q;import w from"node:fs";import $ from"node:vm";import{titles as O,descriptions as K,routes as h,word as E,types as S,guide as Q,guideExtras as X}from"./locales.mjs?wp-media=6fdcc04e8b81c8c8";const d="emberglaze-kiln",A="games/"+d,ee=new Set(process.argv.slice(2)),i=n(t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),"esc"),te=String.raw(q||(q=j([`<!doctype html>
<html lang="{{LANG}}" dir="{{DIR}}" class="wp-frame-main-flow" data-wp-official-name data-wp-shared-interface="7">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{{TITLE}} | WeightPlay</title>
{{ROUTE_BRIDGE}}
<base href="/games/emberglaze-kiln/">
<meta name="description" content="{{DESCRIPTION}}"><meta name="robots" content="{{ROBOTS}}">
{{METADATA}}
<script src="/src/game-layout-config.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script>
<script src="/src/site-config.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script>
<script src="/src/i18n.js?wp-media=6fdcc04e8b81c8c8"><\/script>{{LOCALE_DICTIONARY}}<script src="/src/game-title-registry.js?wp-media=6fdcc04e8b81c8c8" data-wp-game-title-registry><\/script>
<script src="/src/weightplay-audio.js?wp-media=6fdcc04e8b81c8c8"><\/script><script src="/src/wallet.js?wp-media=6fdcc04e8b81c8c8"><\/script><script src="/src/analytics.js?wp-media=6fdcc04e8b81c8c8"><\/script>
<link rel="stylesheet" href="/src/stage-selector-standard.css?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-screen-frame.css?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-play-ui.css?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required>
<link rel="stylesheet" href="/src/game-ui-theme.css?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required>
<link rel="stylesheet" href="/games/emberglaze-kiln/game.css?v=gameplay-v2&wp-media=6fdcc04e8b81c8c8" data-wp-entry-required>
</head>
<body {{PUBLIC}} class="wp-frame-main-active" data-wp-play-ui="1" data-game-id="emberglaze-kiln" data-wp-game-id="emberglaze-kiln" data-audience="general" data-has-stage="true" data-wp-game-version="v2" data-game-version="v2" data-wp-interface-version="0" data-wp-interface-candidate="9" data-screen="main" data-wp-game-owned-guide="true" data-runtime-localize="off" data-tutorial-owner="action-guide" data-tutorial-auto-show="false">
<div id="gameFrame" data-wp-frame-root hidden>
 <div id="mainGroup" class="wp-frame-main-flow">
  <section id="mainScreen" data-wp-frame-scene="main">
   <header id="mainHeader"><a href="/" data-wp-frame-action="secondary" data-wp-return="main" aria-label="WeightPlay">← W</a><h1 id="gameTitle" data-wp-frame-title data-wp-game-title data-runtime-localize="off">{{TITLE}}</h1></header>
   <section id="mainHero" data-wp-frame-content="main">
    <img id="cover" data-wp-frame-poster src="/games/emberglaze-kiln/art/cover.webp?wp-media=6fdcc04e8b81c8c8" alt="{{TITLE}}" width="720" height="720" fetchpriority="high">
    <div data-wp-frame-copy><p id="description" data-wp-frame-summary>{{DESCRIPTION}}</p><button type="button" id="startBtn" data-wp-frame-action="primary" data-wp-main-start disabled>{{START}}</button></div>
   </section>
  </section>
  <section id="guideContent" class="kiln-guide game-page-info game-page-info-static" data-wp-game-guide data-wp-preserve-static-guide data-wp-entry-guide aria-labelledby="guideTitle">{{GUIDE}}</section>
 </div>
 <section id="stageScreen" class="stage-canvas" data-wp-standard-stage-screen data-wp-stage-art="/assets/lobby-block-atmosphere.svg" hidden>
  <header id="stageHeader"><button id="stageBack" type="button" data-wp-return="stage" data-wp-frame-action="secondary">←</button><strong data-wp-frame-title hidden></strong></header>
  <div id="stageWorkspace"><div id="stagePanel"><div id="stagePage"><div id="stageRail"></div></div></div><section id="workshopPanel" class="kiln-management" hidden></section></div>
  <nav id="stageTabs" data-wp-frame-stage-nav><button id="craftTab" data-wp-frame-action="secondary" data-wp-frame-stage-slot="team"></button><button id="stagesTab" data-wp-frame-action="secondary" data-wp-frame-stage-slot="stages"></button><button id="galleryTab" data-wp-frame-action="secondary" data-wp-frame-stage-slot="equipment"></button></nav>
 </section>
 <section id="battleScreen" class="battle-canvas" data-wp-logical-battle-canvas data-wp-battle-canvas-root data-wp-canvas-max-width="920" data-wp-battle-min-width="390" data-wp-battle-min-height="680" data-wp-battle-landscape-width="840" data-wp-battle-landscape-height="390" hidden>
  <header id="battleHeader"><button id="battleBack" data-wp-return="battle" data-wp-frame-action="secondary">←</button><strong data-wp-frame-title hidden></strong></header>
  <main id="battleLive">
   <section id="arena"><div id="orders"></div><div id="boardDescription" class="sr-only" aria-live="polite"></div><div id="ovenCue" aria-hidden="true"></div></section>
   <section id="bench" data-wp-frame-logical-actions="battle">
    <div id="guidance" role="status"></div>
    <div id="mineralDock" dir="ltr"></div>
    <div id="toolDock" dir="ltr"></div>
    <div id="shelfDock" dir="ltr"></div>
    <div id="actionDock"><button id="helpBtn" data-wp-frame-action="secondary">?</button><button id="fireBtn" data-wp-frame-action="primary"></button></div>
   </section>
  </main>
  <section id="resultPanel" data-wp-battle-substate="result" role="dialog" aria-labelledby="resultTitle" aria-modal="true" hidden>
   <div class="kiln-dialog"><h2 id="resultTitle"></h2><p id="resultText"></p><p id="resultNotice" role="status"></p><div class="modal-actions"><button id="resultMap" data-wp-frame-action="secondary"></button><button id="resultRetry" data-wp-frame-action="secondary"></button><button id="resultNext" data-wp-frame-action="primary"></button></div></div>
  </section>
 </section>
 <section id="dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" hidden><div class="kiln-dialog"><h2 id="dialogTitle"></h2><p id="dialogBody"></p><div id="dialogActions" class="modal-actions"></div></div></section>
 <div id="heatStat" class="kiln-stat"><label id="heatLabel" for="heatMeter"></label><meter id="heatMeter" value="3" min="0" max="6"></meter><b id="heatValue"></b></div>
 <div id="fuelStat" class="kiln-stat"></div>
</div>
<script src="/src/stage-rail-i9.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script><script src="/src/game-play-ui.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script>
<script src="/src/battle-canvas-standard.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script><script src="/src/game-screen-frame.js?wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script>
<script type="module" src="/games/emberglaze-kiln/game.mjs?v=gameplay-v2&wp-media=6fdcc04e8b81c8c8" data-wp-entry-required><\/script>
</body>
</html>
`]))),p="https://weightplay.com",L=p+"/"+A+"/art/cover.webp?wp-media=6fdcc04e8b81c8c8",y={window:{}};for(const t of["game-title-registry","lobby-data"])$.runInNewContext(w.readFileSync("src/"+t+".js","utf8"),y);const f=y.window.WONDER_LOBBY.games,ae=y.window.WEIGHTPLAY_GAME_TITLES,m=f.find(t=>t.id===d),b=m?.status==="playable"&&!m.internalOnly&&!m.internalTrial&&!m.previewOnly,ie=Object.entries(h).map(([t,e])=>'<link rel="alternate" hreflang="'+e+'" href="'+p+"/"+t+"/games/"+d+'/">').join(`
`)+`
<link rel="alternate" hreflang="x-default" href="`+p+"/en/games/"+d+'/">';function R(t,e,{legacy:P=!1}={}){const s=n(a=>E(e,a),"t"),l=O[e],g=K[e],u=p+"/"+t+"/games/"+d+"/",[c,v]=Q[e].map(a=>a.split("|")),o=n((a,r)=>'<article class="game-info-section"><h3>'+i(a)+"</h3><p>"+i(r)+"</p></article>","section"),x=["rivetide-works","reedway-transit","animal-moon-market"].filter(a=>f.some(r=>r.id===a&&r.status==="playable"&&!r.internalOnly&&!r.internalTrial)),[B,N,z,C,_,G,W,M]=X[e].split("|"),U=x.map(a=>{const r=f.find(Z=>Z.id===a),T=ae[a]?.[e]??r.title?.[e];if(!T)throw Error("Missing localized Related name "+a+" "+e);return'<a data-related-id="'+a+'" href="/'+t+"/games/"+a+'/">'+i(T)+"</a>"}),F=[[B,N],[z,C],[_,G],[c[5],v[4]]].map(([a,r])=>"<dt>"+i(a)+"</dt><dd>"+i(r)+"</dd>").join(""),H='<h2 id="guideTitle">'+i(l)+'</h2><div class="facts"><div>'+i(S[e])+"</div><div>"+i(E(e,"stages")+" · 60")+"</div><div>"+i(W)+"</div><div>"+i(M)+'</div></div><div class="game-info-sections">'+c.slice(0,4).map((a,r)=>o(a,v[r])).join("")+o(s("heat"),s("east")+" · "+s("south"))+o(s("supply"),s("recycle"))+o(s("craft"),[s("rinse"),s("stoke"),s("insulate")].join(" · "))+o(s("gallery"),s("permanent"))+'<article class="game-info-section"><h3>'+i(c[4])+"</h3><dl>"+F+'</dl></article><article class="game-info-section"><h3>'+i(c[6])+'</h3><div id="gameGuideRelated">'+U.join(" · ")+'</div></article></div><button id="guideReplay" data-wp-frame-action="secondary">'+i(s("replay"))+"</button>",Y={"@context":"https://schema.org","@type":"VideoGame",name:l,...e!=="en"?{alternateName:O.en}:{},description:g,url:u,image:L,inLanguage:e,isAccessibleForFree:!0,operatingSystem:"Web browser",gamePlatform:"Web browser",genre:S[e],publisher:{"@type":"Organization",name:"WeightStudio"}},J='<link rel="canonical" href="'+u+`">
`+ie+`
<meta property="og:type" content="website"><meta property="og:site_name" content="WeightPlay"><meta property="og:url" content="`+u+'"><meta property="og:image" content="'+L+'"><meta property="og:title" content="'+i(l)+'"><meta property="og:description" content="'+i(g)+'"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">'+JSON.stringify(Y).replaceAll("<","\\u003c")+"<\/script>",V={ROUTE_BRIDGE:P&&b?'<script data-wp-locale-route>if(/^https?:$/.test(location.protocol)&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){try{const byLocale='+JSON.stringify(Object.fromEntries(Object.entries(h).map(([a,r])=>[r,a])))+';const saved=localStorage.getItem("weightPlayLocale")||localStorage.getItem("weightplayLocale")||localStorage.getItem("wp-locale")||"en";const target="/"+(byLocale[saved]||"en")+"/games/emberglaze-kiln/";location.replace(target+location.search+location.hash)}catch{location.replace("/en/games/emberglaze-kiln/")}}<\/script>':"",LOCALE_DICTIONARY:e==="ja"?'<script src="/src/i18n-ja.js?v=20260719-ja1&wp-media=6fdcc04e8b81c8c8"><\/script>':"",ROBOTS:b?"index,follow":"noindex,nofollow",PUBLIC:b?"data-kiln-public":"",LANG:e,DIR:e==="ar"?"rtl":"ltr",TITLE:i(l),DESCRIPTION:i(g),START:i(s("start")),GUIDE:H,METADATA:J};return te.replace(/\{\{([A-Z_]+)\}\}/g,(a,r)=>V[r])}n(R,"entry");const D=n((t,e)=>{w.mkdirSync(t.slice(0,t.lastIndexOf("/")),{recursive:!0}),w.writeFileSync(t,e)},"write");if(D(A+"/index.html",R("en","en",{legacy:!0})),!ee.has("--root-only"))for(const[t,e]of Object.entries(h))D(t+"/games/"+d+"/index.html",R(t,e));
