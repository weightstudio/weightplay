(() => {
  "use strict";
  const locales=window.ANIMAL_SILHOUETTE_SCOUT_LOCALES||{};
  const routeLocaleMap={en:"en","zh-tw":"zh-Hant","zh-hant":"zh-Hant","zh-cn":"zh-Hans","zh-hans":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const rounds=[
    {nameKey:"name1",clueKey:"clue1",target:"fox",options:["fox","rabbit","badger"],emoji:{fox:"🦊",rabbit:"🐇",badger:"🦡"}},
    {nameKey:"name2",clueKey:"clue2",target:"owl",options:["owl","finch","duck"],emoji:{owl:"🦉",finch:"🐦",duck:"🦆"}},
    {nameKey:"name3",clueKey:"clue3",target:"hare",options:["hare","deer","mole"],emoji:{hare:"🐇",deer:"🦌",mole:"🐭"}}
  ];
  const state={locale:"en",round:0,selected:"",checks:0,sessionChecks:0,screen:"main"};
  const $=id=>document.getElementById(id); let mainMapObserver; const t=(key,vars={})=>{const table=locales[state.locale]||locales.en||{};let value=table[key]||locales.en?.[key]||key;Object.entries(vars).forEach(([k,v])=>{value=value.replaceAll(`{${k}}`,String(v));});return value;};
  const openStage=()=>{show("stage");renderStages();};
  const moveMainMapEntry=()=>{const map=$("mapBtn");const copy=document.querySelector(".wp-standard-main-copy");if(map&&copy&&!copy.contains(map)){copy.append(map);mainMapObserver?.disconnect();}};
  const show=screen=>{state.screen=screen;document.querySelectorAll("section[data-screen]").forEach(n=>{n.hidden=n.dataset.screen!==screen;});document.body.dataset.screen=screen;};
  const readBest=()=>{try{const n=Number(localStorage.getItem("weightplay-animal-silhouette-scout-best-v3"));return Number.isFinite(n)&&n>0?n:null;}catch(_){return null;}};
  const saveBest=()=>{try{const old=readBest();if(!old||state.sessionChecks<old)localStorage.setItem("weightplay-animal-silhouette-scout-best-v3",String(state.sessionChecks));}catch(_){} };
  const applyLocale=()=>{document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==="ar"?"rtl":"ltr";document.querySelectorAll("[data-copy]").forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll("[data-copy-aria]").forEach(n=>n.setAttribute("aria-label",t(n.dataset.copyAria)));$("localeSelect").value=state.locale;$("localeSelect").setAttribute("aria-label",t("language"));$("mainProgress").textContent=`${t("lookouts")}: ${Math.min(state.round,rounds.length)} / ${rounds.length}`;$("bestValue").textContent=readBest()||t("noBest");if(state.screen==="stage")renderStages();if(state.screen==="battle")renderBattle();if(state.screen==="result")renderResult();};
  const renderStages=()=>{$("stageList").replaceChildren(...rounds.map((r,i)=>{const b=document.createElement("button");b.type="button";b.className="stage-card";b.setAttribute("role","listitem");b.innerHTML=`<strong>${t("round",{n:i+1,total:rounds.length})}</strong><span>${t(r.nameKey)}</span><small>${i<state.round?t("complete"):t("open")}</small>`;b.onclick=()=>startRound(i);return b;}));};
  const renderBattle=()=>{const r=rounds[state.round];$("roundName").textContent=t(r.nameKey);$("roundLabel").textContent=t("round",{n:state.round+1,total:rounds.length});$("checkCount").textContent=t("checks",{n:state.sessionChecks});$("clue").textContent=t(r.clueKey);$("silhouette").className=`silhouette scout-art scout-art-${r.target}`;$("silhouette").textContent=r.emoji[r.target];$("silhouette").setAttribute("aria-label",t(r.target));$("choiceGrid").replaceChildren(...r.options.map(animal=>{const b=document.createElement("button");b.type="button";b.className="choice-btn";b.setAttribute("aria-pressed",String(state.selected===animal));b.innerHTML=`<span class="choice-emoji scout-art scout-art-${animal}" aria-hidden="true">${r.emoji[animal]}</span><strong>${t(animal)}</strong>`;b.onclick=()=>{state.selected=animal;renderBattle();$("battleStatus").textContent=t("chosen");};return b;}));$("checkBtn").disabled=!state.selected;};
  const renderResult=()=>{const done=state.round>=rounds.length-1;$("resultTitle").textContent=done?t("resultTitle"):t("resultPartial");$("resultText").textContent=t("resultText",{count:Math.min(state.round+1,rounds.length),total:rounds.length,checks:state.sessionChecks});$("resultPrimaryBtn").textContent=done?t("map"):t("next");$("resultPrimaryBtn").onclick=done?()=>{show("stage");renderStages();}:()=>startRound(state.round+1);$("resultMapBtn").hidden=done;};
  const startRound=i=>{state.round=Math.max(0,Math.min(rounds.length-1,i));state.selected="";if(i===0){state.checks=0;state.sessionChecks=0;}show("battle");renderBattle();$("battleStatus").textContent=t("waiting");};
  const check=()=>{if(!state.selected){$("battleStatus").textContent=t("waiting");return;}state.checks++;state.sessionChecks++;const r=rounds[state.round];if(state.selected!==r.target){state.selected="";renderBattle();$("battleStatus").textContent=t("wrong");return;}$("battleStatus").textContent=t("correct");if(state.round===rounds.length-1){saveBest();$("bestValue").textContent=readBest()||t("noBest");}show("result");renderResult();};
  $("startBtn").onclick=openStage;$("mapBtn").onclick=openStage;$("stageBackBtn").onclick=()=>show("main");$("battleBackBtn").onclick=()=>{show("stage");renderStages();};$("resultMapBtn").onclick=()=>{show("stage");renderStages();};$("resultHomeBtn").onclick=()=>show("main");$("checkBtn").onclick=check;$("clearBtn").onclick=()=>{state.selected="";renderBattle();$("battleStatus").textContent=t("waiting");};$("battleUtilityBtn").onclick=()=>{$("battleStatus").textContent=t("waiting");$("battleUtilityBtn").setAttribute("aria-pressed","true");};$("settingsBtn").onclick=()=>{$("settingsPanel").hidden=!$("settingsPanel").hidden;};$("localeSelect").onchange=e=>{state.locale=locales[e.target.value]?e.target.value:"en";try{localStorage.setItem("weightplayLocale",state.locale);}catch(_){}applyLocale();};
  const initialLocale=()=>{const query=new URLSearchParams(window.location.search).get("lang");if(query&&locales[query])return query;const segment=window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();if(routeLocaleMap[segment]&&locales[routeLocaleMap[segment]])return routeLocaleMap[segment];try{const saved=localStorage.getItem("weightplayLocale");if(saved&&locales[saved])return saved;}catch(_){}return "en";};
  state.locale=initialLocale();applyLocale();show("main");mainMapObserver=new MutationObserver(moveMainMapEntry);mainMapObserver.observe(document.body,{childList:true,subtree:true});moveMainMapEntry();
  const placeScoutGuide=(attempt=0)=>{const image=document.querySelector(".scout-guide");const copy=document.querySelector(".wp-standard-main-copy");if(image&&copy&&!copy.contains(image))copy.prepend(image);if((!image||!copy)&&attempt<40)window.setTimeout(()=>placeScoutGuide(attempt+1),50);};
  placeScoutGuide();
  window.__ANIMAL_SILHOUETTE_SCOUT_TEST__={rounds,startRound,check,getState:()=>({...state})};
  function localizeAccessibility(){
    const labels=[
      ["#stageList","aria-label","stageSelector"],
      [".stage-tabs","aria-label","lookoutSections"],
      ["#choiceGrid","aria-label","animalChoices"],
      [".game-page-info","aria-label","gameInfo"],
    ];
    labels.forEach(([selector,attribute,key])=>document.querySelector(selector)?.setAttribute(attribute,t(key)));
    document.querySelector(".cover")?.setAttribute("alt",t("coverAlt"));
    const guideKicker=document.querySelector(".game-info-kicker");
    if(guideKicker)guideKicker.textContent=t("originalGuide");
    const utility=$("battleUtilityBtn");
    if(utility)utility.title=t("settings");
    document.title=t("pageTitle");
  }
  localizeAccessibility();
  $("localeSelect")?.addEventListener("change",localizeAccessibility);
})();
