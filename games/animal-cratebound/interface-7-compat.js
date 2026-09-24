(()=>{
  "use strict";

  const GAME_ID="animal-cratebound";
  if(document.body?.dataset.wpGameId!==GAME_ID)return;
  if(document.documentElement.dataset.wpCrateboundInterface7Compat==="true")return;
  document.documentElement.dataset.wpCrateboundInterface7Compat="true";

  const currentScript=document.currentScript;
  if(!document.querySelector('link[data-wp-cratebound-interface7]')){
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href=new URL("interface-7-cleanup.css?v=20260923-cratebound-interface7-cleanup1",currentScript?.src||location.href).href;
    link.dataset.wpCrateboundInterface7="true";
    document.head.append(link);
  }

  const main=document.getElementById("mainScreen");
  const stage=document.getElementById("stageScreen");
  const battle=document.getElementById("battleScreen");
  const poster=document.getElementById("poster");
  const summary=document.getElementById("pitch");
  const progress=document.getElementById("mainProgress");
  const start=document.getElementById("start");
  const stageRail=document.getElementById("stageRail");
  const stageHint=document.getElementById("stageHint");
  const stageTab=document.getElementById("stageMapTab");
  const result=document.getElementById("resultModal");
  const resultActions=result?.querySelector(".modal-actions");
  const stagesAction=document.getElementById("resultStage");
  const nextAction=document.getElementById("next");
  const replayAction=document.getElementById("retry");

  if(main)main.dataset.screen="main";
  if(stage)stage.dataset.screen="stage";
  if(battle)battle.dataset.screen="battle";
  poster?.setAttribute("data-wp-frame-poster","");
  summary?.classList.add("main-summary");
  progress?.setAttribute("data-wp-main-progress","");
  start?.setAttribute("data-wp-main-start","");
  if(stageRail&&!stageRail.dataset.wpStageV6Total)stageRail.dataset.wpStageV6Total="30";
  if(stageHint){
    stageHint.hidden=true;
    stageHint.setAttribute("aria-hidden","true");
  }

  const normalizeLocale=()=>{
    const raw=window.WonderI18n?.actualLocale?.()||window.WonderI18n?.locale?.()||document.documentElement.lang||"en";
    if(/^zh-(tw|hant)/i.test(raw))return"zh-Hant";
    if(/^zh/i.test(raw))return"zh-Hans";
    if(/^pt/i.test(raw))return"pt-BR";
    return raw.split("-")[0];
  };
  const stagesCopy={
    en:"Stages","zh-Hant":"關卡","zh-Hans":"关卡",ja:"ステージ",ko:"스테이지",es:"Niveles","pt-BR":"Fases",fr:"Niveaux",de:"Level",it:"Livelli",ru:"Уровни",hi:"स्तर",ar:"المراحل"
  };
  const syncStageTabCopy=()=>{
    if(!stageTab)return;
    const locale=normalizeLocale();
    stageTab.textContent=stagesCopy[locale]||stagesCopy.en;
    stageTab.setAttribute("aria-label",stagesCopy[locale]||stagesCopy.en);
  };
  syncStageTabCopy();
  window.addEventListener("wonder:locale-change",syncStageTabCopy);
  document.getElementById("localeSelect")?.addEventListener("change",()=>queueMicrotask(syncStageTabCopy));

  if(result){
    result.dataset.wpBattleSubstate="result";
    result.removeAttribute("data-screen");
  }
  if(resultActions&&stagesAction&&nextAction&&replayAction){
    resultActions.append(stagesAction,nextAction,replayAction);
  }

  const clearReservedNext=()=>{
    if(!nextAction||nextAction.dataset.wpReservedResultSlot!=="true")return;
    nextAction.dataset.wpReservedResultSlot="false";
    nextAction.disabled=false;
    nextAction.removeAttribute("aria-disabled");
    nextAction.tabIndex=0;
  };
  const reserveNextSlot=()=>{
    if(!nextAction)return;
    nextAction.hidden=false;
    nextAction.disabled=true;
    nextAction.dataset.wpReservedResultSlot="true";
    nextAction.setAttribute("aria-disabled","true");
    nextAction.tabIndex=-1;
  };
  const syncResultActions=()=>{
    if(!result||result.hidden||!nextAction)return;
    if(nextAction.hidden)reserveNextSlot();
    else clearReservedNext();
  };
  if(result){
    new MutationObserver(syncResultActions).observe(result,{attributes:true,attributeFilter:["hidden"]});
    syncResultActions();
  }

  const remountSharedFrame=()=>window.WeightPlayScreenFrame?.autoMountDocument?.();
  if(document.readyState==="complete")remountSharedFrame();
  else window.addEventListener("load",remountSharedFrame,{once:true});
})();
