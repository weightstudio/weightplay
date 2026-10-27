(function () {
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const GAME_VERSION=8;
  const symbols=["☾","✦","❧","≈","◇","🐾","☁"];
  const colors=["#b9d7f3","#e7b9e8","#b9dfc2","#f4c0b8","#f1dc9d","#b9d8dc","#d2c8ee"];
  const patterns=["radial-gradient(#4d659633 1.5px,transparent 1.5px)","linear-gradient(45deg,#60487d22 25%,transparent 25%,transparent 75%,#60487d22 75%)","repeating-linear-gradient(135deg,#47745122 0 3px,transparent 3px 10px)","repeating-radial-gradient(circle at 0 50%,transparent 0 6px,#46747a20 7px 8px)","linear-gradient(30deg,#8a6e2420 12%,transparent 12%,transparent 50%,#8a6e2420 50%,#8a6e2420 62%,transparent 62%)","radial-gradient(ellipse at center,#73523622 0 26%,transparent 28%)","repeating-linear-gradient(0deg,#51497918 0 2px,transparent 2px 9px)"];
  const levels=window.CAT_COLOR_SUDOKU_LEVELS;
  const localeData=window.CAT_COLOR_SUDOKU_LOCALES;
  const $=selector=>document.querySelector(selector);
  const screens=[...document.querySelectorAll(".screen")];
  const unlockKey="wp-cat-color-sudoku-unlock-v1";
  const bestKey="wp-cat-color-sudoku-best-v1";
  const localeKey="wp-locale";
  const roots={main:$("#main"),stage:$("#stage"),battle:$("#battle")};
  let locale=read(localeKey)||read("weightPlayLocale")||"en";
  if(!codes.includes(locale))locale="en";
  let unlocked=normalizeUnlock(read(unlockKey));
  let best=readBest();
  let selected=Math.min(29,unlocked-1);
  let screenFrame=null;
  let level=null;
  let cats=new Set();
  let marks=new Set();
  let starters=new Set();
  let history=[];
  let moves=0;
  let mode="cat";
  let hintIndex=-1;
  let invalidIndex=-1;
  let invalidReason="";
  let resultClaimed=false;
  let sceneGeneration=0;
  let resultTimer=null;
  const feedbackAnimations=new Set();
  window.WeightPlayAudio?.preload(["feedback.success"]);

  // Effects never own rules, focus, hit targets or settlement. Rendering a new
  // board/scene settles the old visual work instead of queuing stale callbacks.
  function clearFeedback(){for(const animation of feedbackAnimations)animation.cancel();feedbackAnimations.clear()}
  function cancelResultTimer(){if(resultTimer!==null)clearTimeout(resultTimer);resultTimer=null}
  function animateFeedback(node,keyframes,duration=240){
    if(!node?.animate||document.hidden)return;
    if(feedbackAnimations.size>=64){const oldest=feedbackAnimations.values().next().value;oldest.cancel();feedbackAnimations.delete(oldest)}
    const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const animation=node.animate(reduced?[{opacity:.76},{opacity:1}]:keyframes,{duration:reduced?100:duration,easing:"cubic-bezier(.2,.8,.2,1)"});
    feedbackAnimations.add(animation);
    const release=()=>feedbackAnimations.delete(animation);
    animation.onfinish=release;animation.oncancel=release;
  }
  function cellFeedback(index,kind){
    const cell=$("#board").querySelector(`[data-index="${index}"]`);if(!cell)return;
    if(kind==="conflict"){animateFeedback(cell,[{boxShadow:"inset 0 0 0 4px #b53c55"},{boxShadow:"inset 0 0 0 2px #b53c55"}],280);return}
    const token=cell.querySelector("img,.x-mark");
    if(token)animateFeedback(token,[{opacity:.4,transform:"scale(.7)"},{opacity:1,transform:"scale(1)"}],180);
    else animateFeedback(cell,[{boxShadow:"inset 0 0 0 3px #fff4b8"},{boxShadow:"inset 0 0 0 0px #fff4b800"}],180);
    if(kind==="place"){
      const region=level.regions[index];
      for(const tile of $("#board").children)if(Number(tile.dataset.region)===region)animateFeedback(tile,[{boxShadow:"inset 0 0 0 3px #fff4b8"},{boxShadow:"inset 0 0 0 0px #fff4b800"}],420);
      if(cats.size<level.size)window.WeightPlayAudio?.play("feedback.success",{volume:.35});
    }
  }
  document.addEventListener("visibilitychange",()=>{if(document.hidden)clearFeedback()});

  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,value)}catch{}}
  function normalizeUnlock(value){const parsed=Number(value);return Number.isInteger(parsed)&&parsed>=1&&parsed<=31?parsed:1}
  function readBest(){try{const parsed=JSON.parse(read(bestKey)||"{}");return parsed&&typeof parsed==="object"?parsed:{}}catch{return {}}}
  function t(key,values={}){const value=localeData[locale]?.[key]??localeData.en[key]??key;if(Array.isArray(value))return value;return String(value).replace(/\{(\w+)\}/g,(_,name)=>values[name]??"")}
  function beep(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function setStatus(key,error=false,values={}){const node=$("#status");node.textContent=t(key,values);node.classList.toggle("error",error)}
  function show(id){
    clearFeedback();
    cancelResultTimer();
    const generation=++sceneGeneration;
    if($("#resultDialog").open)(__wpNotifyMeasurement(), $("#resultDialog").close());
    if($("#leaveDialog").open)(__wpNotifyMeasurement(), $("#leaveDialog").close());
    screens.forEach(screen=>{
      const active=screen.id===id;
      screen.hidden=!active;
      screen.inert=!active;
      screen.setAttribute("aria-hidden",String(!active));
    });
    document.querySelectorAll(".game-page-info,[data-wp-game-guide]").forEach(guide=>{guide.hidden=id!=="main";});
    document.body.dataset.screen=id;
    document.documentElement.dataset.screen=id;
    document.body.dataset.gameView=id;
    document.documentElement.dataset.gameView=id;
    window.scrollTo(0,0);
    if(id==="stage")renderStages();
    screenFrame?.activate(id);
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:id,generation}}));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:id,generation}}));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:id,generation}}));
    window.dispatchEvent(new CustomEvent("weightplay:game-view-change",{detail:{view:id}}));
    window.dispatchEvent(new CustomEvent("weightplay:battle-state",{detail:{active:id==="battle"}}));
    window.dispatchEvent(new CustomEvent("weightplay:stage-state",{detail:{active:id==="stage"}}));
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(generation!==sceneGeneration)return;
      window.dispatchEvent(new CustomEvent("weightplay:scene-settled",{detail:{scene:id,generation}}));
    }));
    const nextScreen=({main:"main",stage:"stage",battle:"battle"})[id]??null;
    if(["result"].includes(id)&&__wpMeasurement.started&&!__wpMeasurement.ended){__wpMeasurement.ended=true;__wpMeasurement.outcome="complete";}
    else if((nextScreen==="main"||nextScreen==="stage")&&__wpMeasurement.screen==="battle"&&__wpMeasurement.started&&!__wpMeasurement.ended){__wpMeasurement.ended=true;__wpMeasurement.outcome="abandon";}
    __wpMeasurement.screen=nextScreen;
    __wpNotifyMeasurement();
  }
  function renderStages(){
    const done=Object.keys(best).filter(key=>Number.isInteger(Number(key))&&Number(key)>=1&&Number(key)<=30).length;
    $("#stageProgress").textContent=t("campaignProgress",{done:Math.min(30,done)});
    screenFrame?.refreshStage(selected);
  }
  function startLevel(index){cancelResultTimer();selected=Math.max(0,Math.min(29,index));level=levels[selected];screenFrame?.selectStage(selected,{center:false});starters=new Set(level.starters);cats=new Set(level.starters);marks=new Set();history=[];moves=0;mode="cat";hintIndex=-1;invalidIndex=-1;invalidReason="";resultClaimed=false;$("#battleChapter").textContent=t("chapter",{n:level.chapter+1});$("#battleChapter").title=t("chapters")[level.chapter];$("#battleStage").textContent=t("stage",{n:selected+1});$("#ruleChapter").textContent=t("chapters")[level.chapter];$("#ruleText").textContent=t("chapterRules")[level.chapter];show("battle");setMode("cat",false);renderBoard();setStatus("statusReady")
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function snapshot(){return {cats:[...cats],marks:[...marks],moves,hintIndex}}
  function restore(state){cats=new Set(state.cats);marks=new Set(state.marks);moves=state.moves;hintIndex=state.hintIndex;invalidIndex=-1;invalidReason="";renderBoard()}
  function pushHistory(){history.push(snapshot());if(history.length>200)history.shift()}
  function conflict(index){const row=Math.floor(index/level.size),column=index%level.size,region=level.regions[index];for(const other of cats){if(other===index)continue;const otherRow=Math.floor(other/level.size),otherColumn=other%level.size;if(otherRow===row)return "conflictRow";if(otherColumn===column)return "conflictColumn";if(level.regions[other]===region)return "conflictRegion";if(Math.abs(otherRow-row)<=1&&Math.abs(otherColumn-column)<=1)return "conflictTouch"}return ""}
  function clearInvalid(){const previous=invalidIndex;invalidIndex=-1;invalidReason="";if(previous>=0){const cell=$("#board").querySelector(`[data-index="${previous}"]`);cell?.classList.remove("invalid");cell?.removeAttribute("aria-invalid");cell?.setAttribute("aria-label",cellLabel(previous))}}
  function playCell(index){clearInvalid();if(starters.has(index))return;if(mode==="mark"){pushHistory();if(marks.has(index)){marks.delete(index);setStatus("unmarked")}else{if(cats.has(index))cats.delete(index);marks.add(index);setStatus("marked")}moves+=1;hintIndex=-1;beep("board.move");renderBoard();cellFeedback(index,"mark");return}if(cats.has(index)){pushHistory();cats.delete(index);moves+=1;hintIndex=-1;setStatus("catRemoved");beep("board.move");renderBoard();cellFeedback(index,"remove");return}const reason=conflict(index);if(reason){invalidIndex=index;invalidReason=reason;setStatus(reason,true);beep("feedback.error");const cell=$("#board").querySelector(`[data-index="${index}"]`);cell?.classList.add("invalid");cell?.setAttribute("aria-invalid","true");cell?.setAttribute("aria-label",cellLabel(index));cellFeedback(index,"conflict");return}pushHistory();marks.delete(index);cats.add(index);moves+=1;hintIndex=-1;setStatus("catPlaced");beep("board.move");renderBoard();cellFeedback(index,"place");checkComplete()}
  function cellLabel(index){const row=Math.floor(index/level.size)+1,column=index%level.size+1,regionId=level.regions[index],region=t("region",{symbol:symbols[regionId],name:t("regionNames")[regionId]});let key=starters.has(index)?"cellStarter":cats.has(index)?"cellCat":marks.has(index)?"cellMarked":"cellEmpty";const state=t(key,{row,column,region});if(index===invalidIndex&&invalidReason)return t("cellConflict",{state,reason:t(invalidReason)});return index===hintIndex?t("cellHint",{state}):state}
  function renderBoard(){if(!level)return;clearFeedback();const board=$("#board"),focused=Number(document.activeElement?.dataset?.index);board.replaceChildren();board.style.setProperty("--size",String(level.size));for(let index=0;index<level.regions.length;index+=1){const regionId=level.regions[index],row=Math.floor(index/level.size),column=index%level.size,cell=document.createElement("button");cell.type="button";cell.className="cat-cell"+(starters.has(index)?" starter":"")+(index===hintIndex?" hint-target":"")+(index===invalidIndex?" invalid":"");cell.dataset.index=String(index);cell.dataset.region=String(regionId);cell.dataset.symbol=symbols[regionId];cell.style.setProperty("--region-color",colors[regionId]);cell.style.setProperty("--region-pattern",patterns[regionId]);if(row===0||level.regions[index-level.size]!==regionId)cell.classList.add("region-top");if(row===level.size-1||level.regions[index+level.size]!==regionId)cell.classList.add("region-bottom");if(column===0||level.regions[index-1]!==regionId)cell.classList.add("region-left");if(column===level.size-1||level.regions[index+1]!==regionId)cell.classList.add("region-right");cell.setAttribute("role","gridcell");cell.setAttribute("aria-label",cellLabel(index));if(index===invalidIndex)cell.setAttribute("aria-invalid","true");cell.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight C X Space Enter");if(cats.has(index)){const image=document.createElement("img");image.src="../../assets/cat-color-sudoku-moonwhisker-v1.png";image.alt="";image.width=1254;image.height=1254;image.draggable=false;cell.append(image)}else if(marks.has(index)){const mark=document.createElement("span");mark.className="x-mark";mark.textContent="×";mark.setAttribute("aria-hidden","true");cell.append(mark)}cell.onclick=()=>playCell(index);cell.onkeydown=event=>handleCellKey(event,index);board.append(cell)}$("#objective").textContent=`🐱 ${cats.size}/${level.size}`;$("#objective").setAttribute("aria-label",t("objective",{total:level.size,placed:cats.size}));if(Number.isInteger(focused))requestAnimationFrame(()=>board.querySelector(`[data-index="${focused}"]`)?.focus({preventScroll:true}))}
  function handleCellKey(event,index){let next=-1;const row=Math.floor(index/level.size),column=index%level.size;if(event.key==="ArrowUp"&&row>0)next=index-level.size;if(event.key==="ArrowDown"&&row<level.size-1)next=index+level.size;if(event.key==="ArrowLeft"&&column>0)next=index-1;if(event.key==="ArrowRight"&&column<level.size-1)next=index+1;if(next>=0){event.preventDefault();$("#board").querySelector(`[data-index="${next}"]`)?.focus();return}if(event.key.toLowerCase()==="c"){event.preventDefault();setMode("cat")}if(event.key.toLowerCase()==="x"){event.preventDefault();setMode("mark")}}
  function setMode(next,announce=true){clearInvalid();mode=next;const cat=next==="cat";$("#toolCat").classList.toggle("active",cat);$("#toolMark").classList.toggle("active",!cat);$("#toolCat").setAttribute("aria-pressed",String(cat));$("#toolMark").setAttribute("aria-pressed",String(!cat));if(announce)setStatus(cat?"statusCatMode":"statusMarkMode")}
  function undo(){clearInvalid();if(!history.length){setStatus("nothingUndo",true);beep("feedback.error");return}restore(history.pop());setStatus("restored");beep("board.move")}
  function restart(){
    const __wpPreviousRound = __wpMeasurement.roundKey;
cancelResultTimer();clearInvalid();cats=new Set(starters);marks=new Set();history=[];moves=0;hintIndex=-1;renderBoard();setStatus("restarted");beep("board.move")
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
    if (__wpMeasurement.roundKey !== __wpPreviousRound) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
}
  function hint(){clearInvalid();const candidate=level.solution.find(index=>!cats.has(index));if(candidate===undefined){setStatus("hintDone");return}hintIndex=candidate;renderBoard();setStatus("hintReady");beep("feedback.hint");$("#board").querySelector(`[data-index="${candidate}"]`)?.focus({preventScroll:true})}
  function renderResultMastery(){const node=$("#resultMastery");if(!node||!level)return;const next=selected<29?levels[selected+1]:null;node.hidden=false;node.textContent=next?t("resultMastery",{stage:selected+2,focus:t("chapterRules")[next.chapter]}):t("resultMasteryFinal")}
  function checkComplete(){if(cats.size!==level.size)return;const solved=level.solution.every(index=>cats.has(index));if(!solved)return;if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(unlockKey,String(unlocked))}const markCount=marks.size,current=best[selected+1];if(!current||moves<current.moves)best[selected+1]={moves,marks:markCount};write(bestKey,JSON.stringify(best));$("#mainProgress").textContent=t("progress",{done:Math.min(30,unlocked-1)});$("#resultBody").textContent=t("resultBody",{stage:selected+1,moves,marks:markCount});renderResultMastery();resultClaimed=false;["#resultStages","#resultNext","#resultReplay"].forEach(selector=>$(selector).disabled=false);$("#resultNext").disabled=selected===29;setStatus("solved");beep("result.win");animateFeedback($("#board"),[{boxShadow:"0 0 0 5px #fff0ac,0 16px 45px #05091ec7"},{boxShadow:"0 0 0 0px #fff0ac00,0 16px 45px #05091ec7"}],500);cancelResultTimer();const completedLevel=level,generation=sceneGeneration;resultTimer=setTimeout(()=>{resultTimer=null;if(generation===sceneGeneration&&level===completedLevel&&cats.size===level.size&&level.solution.every(index=>cats.has(index))&&document.body.dataset.screen==="battle"&&!$("#resultDialog").open){__wpNotifyMeasurement();$("#resultDialog").showModal();animateFeedback($("#resultDialog"),[{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}],240)}},260)
    __wpMeasurement.ended = true; __wpMeasurement.outcome = "win"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function claimResult(action){if(resultClaimed||!$("#resultDialog").open)return;resultClaimed=true;["#resultStages","#resultNext","#resultReplay"].forEach(selector=>$(selector).disabled=true);(__wpNotifyMeasurement(), $("#resultDialog").close());action()}
  function applyLocale(){
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    document.title=t("title")+" | WeightPlay";
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    $("#locale").value=locale;
    $("#mainProgress").textContent=t("progress",{done:Math.min(30,unlocked-1)});
    if(document.body.dataset.screen==="stage")renderStages();
    if(document.body.dataset.screen==="battle"&&level){
      $("#battleChapter").textContent=t("chapter",{n:level.chapter+1});$("#battleChapter").title=t("chapters")[level.chapter];
      $("#battleStage").textContent=t("stage",{n:selected+1});
      $("#ruleChapter").textContent=t("chapters")[level.chapter];
      $("#ruleText").textContent=t("chapterRules")[level.chapter];
      renderBoard();
      if($("#resultDialog").open)renderResultMastery();
      setStatus(mode==="cat"?"statusCatMode":"statusMarkMode");
    }
  }
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=localeData[code].label;$("#locale").append(option)});
  $("#locale").onchange=event=>{locale=event.target.value;write(localeKey,locale);write("weightPlayLocale",locale);try{window.WonderI18n?.setLocale?.(locale)}catch{}applyLocale()};
  $("#start").onclick=()=>show("stage");
  $("#stageBack").onclick=()=>show("main");
  $("#battleBack").onclick=()=>(__wpNotifyMeasurement(), $("#leaveDialog").showModal());
  $("#leaveContinue").onclick=()=>(__wpNotifyMeasurement(), $("#leaveDialog").close());
  $("#leaveStages").onclick=()=>show("stage");
  $("#toolCat").onclick=()=>setMode("cat");
  $("#toolMark").onclick=()=>setMode("mark");
  $("#undo").onclick=undo;
  $("#hint").onclick=hint;
  $("#restart").onclick=function (...args) { return __wpReplayStart(() => restart.apply(this, args)); };
  $("#resultStages").onclick=()=>claimResult(()=>{selected=Math.min(29,selected+1);show("stage")});
  $("#resultReplay").onclick=()=>claimResult(()=>__wpReplayStart(() => startLevel(selected)));
  $("#resultNext").onclick=()=>claimResult(()=>startLevel(Math.min(29,selected+1)));
  document.body.dataset.wpSceneWriter=`cat-color-sudoku-v${GAME_VERSION}`;
  screenFrame=window.mountCatColorSudokuFrame({
    localeSelect:$("#locale"),
    save:()=>({unlocked,best}),
    text:t,
    selected,
    onSelect:index=>{selected=index;},
    onStart:index=>startLevel(index),
  });
  applyLocale();
  show("main");
  const finishEntryLoading=()=>requestAnimationFrame(()=>window.WeightPlayGameEntryLoader?.ready?.());
  if(document.readyState==="complete")finishEntryLoading();
  else window.addEventListener("load",finishEntryLoading,{once:true});
})();
