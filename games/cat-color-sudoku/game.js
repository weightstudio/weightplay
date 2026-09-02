(function () {
  "use strict";
  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const GAME_VERSION=5;
  const symbols=["☾","✦","❧","≈","◇","🐾","☁"];
  const colors=["#b9d7f3","#e7b9e8","#b9dfc2","#f4c0b8","#f1dc9d","#b9d8dc","#d2c8ee"];
  const patterns=["radial-gradient(#4d659633 1.5px,transparent 1.5px)","linear-gradient(45deg,#60487d22 25%,transparent 25%,transparent 75%,#60487d22 75%)","repeating-linear-gradient(135deg,#47745122 0 3px,transparent 3px 10px)","repeating-radial-gradient(circle at 0 50%,transparent 0 6px,#46747a20 7px 8px)","linear-gradient(30deg,#8a6e2420 12%,transparent 12%,transparent 50%,#8a6e2420 50%,#8a6e2420 62%,transparent 62%)","radial-gradient(ellipse at center,#73523622 0 26%,transparent 28%)","repeating-linear-gradient(0deg,#51497918 0 2px,transparent 2px 9px)"];
  const levels=window.CAT_COLOR_SUDOKU_LEVELS;
  const localeData=window.CAT_COLOR_SUDOKU_LOCALES;
  const $=selector=>document.querySelector(selector);
  const screens=[...document.querySelectorAll(".screen")];
  const unlockKey="wp-cat-color-sudoku-unlock-v1";
  const bestKey="wp-cat-color-sudoku-best-v1";
  const soundKey="wp-cat-color-sudoku-sound-v1";
  const localeKey="wp-locale";
  const roots={main:$("#main"),stage:$("#stage"),battle:$("#battle")};
  let locale=read(localeKey)||read("weightPlayLocale")||"en";
  if(!codes.includes(locale))locale="en";
  let sound=typeof window.WonderSound?.isMuted==="function"?!window.WonderSound.isMuted():read(soundKey)!=="off";
  let unlocked=normalizeUnlock(read(unlockKey));
  let best=readBest();
  let selected=Math.min(29,unlocked-1);
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
  let stageCards=[];
  let stageWindowStart=0;
  let audioContext=null;
  let stagePointer=null;

  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,value)}catch{}}
  function normalizeUnlock(value){const parsed=Number(value);return Number.isInteger(parsed)&&parsed>=1&&parsed<=31?parsed:1}
  function readBest(){try{const parsed=JSON.parse(read(bestKey)||"{}");return parsed&&typeof parsed==="object"?parsed:{}}catch{return {}}}
  function t(key,values={}){const value=localeData[locale]?.[key]??localeData.en[key]??key;if(Array.isArray(value))return value;return String(value).replace(/\{(\w+)\}/g,(_,name)=>values[name]??"")}
  function beep(kind){if(!sound)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;oscillator.type=kind==="error"?"square":"sine";oscillator.frequency.value=kind==="win"?660:kind==="error"?155:kind==="hint"?520:360;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.05,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+.13);oscillator.connect(gain).connect(audioContext.destination);oscillator.start(now);oscillator.stop(now+.15)}catch{}}
  function setStatus(key,error=false,values={}){const node=$("#status");node.textContent=t(key,values);node.classList.toggle("error",error)}
  function show(id){const generation=++sceneGeneration;if($("#resultDialog").open)$("#resultDialog").close();if($("#leaveDialog").open)$("#leaveDialog").close();screens.forEach(screen=>{const active=screen.id===id;screen.hidden=!active;screen.inert=!active;screen.setAttribute("aria-hidden",String(!active))});$("#guide").hidden=id!=="main";$("#generalReserve").hidden=id==="main";document.body.dataset.screen=id;document.documentElement.dataset.screen=id;document.body.dataset.gameView=id;document.documentElement.dataset.gameView=id;["main","stage","battle"].forEach(name=>{document.body.classList.toggle(`wp-shell-${name}-active`,name===id);document.documentElement.classList.toggle(`wp-shell-${name}-active`,name===id)});document.body.classList.toggle("wp-stage-active",id==="stage");document.documentElement.classList.toggle("wp-stage-active",id==="stage");window.scrollTo(0,0);if(id==="stage")renderStages();window.dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:game-view-change",{detail:{view:id}}));window.dispatchEvent(new CustomEvent("weightplay:battle-state",{detail:{active:id==="battle"}}));window.dispatchEvent(new CustomEvent("weightplay:stage-state",{detail:{active:id==="stage"}}));requestAnimationFrame(()=>requestAnimationFrame(()=>{if(generation!==sceneGeneration)return;window.dispatchEvent(new CustomEvent("weightplay:scene-settled",{detail:{scene:id,generation}}))}))}
  function desiredStageWindow(index){return Math.max(0,Math.min(21,index-4))}
  function bindStageCard(card,index){const locked=index+1>unlocked,active=index===selected,cleared=index+1<unlocked;card.dataset.index=index;card.dataset.stageIndex=index;card.className="stage-card"+(active?" selected centered":"")+(locked?" locked":"");card.style.setProperty("--stage-pos",`${20+(index%5)*15}% ${28+(index%3)*20}%`);card.tabIndex=active?0:-1;card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize","30");if(active)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");const state=locked?t("locked"):cleared?t("cleared"):t("ready");card.innerHTML=`<strong>${t("stage",{n:index+1})}</strong><span>${t("chapter",{n:Math.floor(index/5)+1})} · ${state}</span>`}
  function buildStagePool(){const rail=$("#stageRail");rail.replaceChildren();stageWindowStart=desiredStageWindow(selected);stageCards=Array.from({length:9},(_,offset)=>{const card=document.createElement("button");card.type="button";card.dataset.wpStagePoolId=String(offset);card.onclick=()=>{const index=Number(card.dataset.index),locked=card.getAttribute("aria-disabled")==="true";selectStage(index,true,true);if(!locked)startLevel(index)};bindStageCard(card,stageWindowStart+offset);rail.append(card);return card});Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:"9",wpStageTotal:"30"})}
  function moveStageWindow(){const target=desiredStageWindow(selected),rail=$("#stageRail");if(!stageCards.length)return;while(stageWindowStart<target){const card=rail.firstElementChild;stageWindowStart+=1;rail.append(card);bindStageCard(card,stageWindowStart+8)}while(stageWindowStart>target){const card=rail.lastElementChild;stageWindowStart-=1;rail.prepend(card);bindStageCard(card,stageWindowStart)}stageCards=[...rail.children];stageCards.forEach(card=>bindStageCard(card,Number(card.dataset.index)));rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+8)}
  function selectStage(index,center=false,focus=false){selected=Math.max(0,Math.min(29,index));moveStageWindow();const card=$("#stageRail").querySelector(`[data-index="${selected}"]`);if(center)card?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});if(focus)requestAnimationFrame(()=>card?.focus({preventScroll:true}))}
  function renderStages(){$("#stageProgress").textContent=t("campaignProgress",{done:Math.min(30,unlocked-1)});if(stageCards.length!==9||!stageCards.every(card=>card.isConnected))buildStagePool();moveStageWindow();requestAnimationFrame(()=>selectStage(selected,true,false))}
  function installStageInput(){const rail=$("#stageRail");rail.addEventListener("keydown",event=>{const card=event.target.closest(".stage-card");if(!card||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const rtl=document.documentElement.dir==="rtl",current=Number(card.dataset.index),next=event.key==="Home"?0:event.key==="End"?29:current+(event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1));selectStage(next,true,true)});rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false)return;stagePointer={id:event.pointerId,x:event.clientX}});rail.addEventListener("pointerup",event=>{if(!stagePointer||stagePointer.id!==event.pointerId)return;const delta=event.clientX-stagePointer.x;stagePointer=null;if(Math.abs(delta)>34)selectStage(selected+(delta<0?1:-1),true,true)});rail.addEventListener("pointercancel",()=>{stagePointer=null})}
  function startLevel(index){selected=Math.max(0,Math.min(29,index));level=levels[selected];starters=new Set(level.starters);cats=new Set(level.starters);marks=new Set();history=[];moves=0;mode="cat";hintIndex=-1;invalidIndex=-1;invalidReason="";resultClaimed=false;$("#battleChapter").textContent=`${t("chapter",{n:level.chapter+1})} · ${t("chapters")[level.chapter]}`;$("#battleStage").textContent=t("stage",{n:selected+1});$("#ruleChapter").textContent=t("chapters")[level.chapter];$("#ruleText").textContent=t("chapterRules")[level.chapter];show("battle");setMode("cat",false);renderBoard();setStatus("statusReady")}
  function snapshot(){return {cats:[...cats],marks:[...marks],moves,hintIndex}}
  function restore(state){cats=new Set(state.cats);marks=new Set(state.marks);moves=state.moves;hintIndex=state.hintIndex;invalidIndex=-1;invalidReason="";renderBoard()}
  function pushHistory(){history.push(snapshot());if(history.length>200)history.shift()}
  function conflict(index){const row=Math.floor(index/level.size),column=index%level.size,region=level.regions[index];for(const other of cats){if(other===index)continue;const otherRow=Math.floor(other/level.size),otherColumn=other%level.size;if(otherRow===row)return "conflictRow";if(otherColumn===column)return "conflictColumn";if(level.regions[other]===region)return "conflictRegion";if(Math.abs(otherRow-row)<=1&&Math.abs(otherColumn-column)<=1)return "conflictTouch"}return ""}
  function clearInvalid(){invalidIndex=-1;invalidReason=""}
  function playCell(index){clearInvalid();if(starters.has(index))return;if(mode==="mark"){pushHistory();if(marks.has(index)){marks.delete(index);setStatus("unmarked")}else{if(cats.has(index))cats.delete(index);marks.add(index);setStatus("marked")}moves+=1;hintIndex=-1;beep("move");renderBoard();return}if(cats.has(index)){pushHistory();cats.delete(index);moves+=1;hintIndex=-1;setStatus("catRemoved");beep("move");renderBoard();return}const reason=conflict(index);if(reason){invalidIndex=index;invalidReason=reason;setStatus(reason,true);beep("error");const cell=$("#board").querySelector(`[data-index="${index}"]`);cell?.classList.add("invalid");cell?.setAttribute("aria-invalid","true");cell?.setAttribute("aria-label",cellLabel(index));return}pushHistory();marks.delete(index);cats.add(index);moves+=1;hintIndex=-1;setStatus("catPlaced");beep("move");renderBoard();checkComplete()}
  function cellLabel(index){const row=Math.floor(index/level.size)+1,column=index%level.size+1,regionId=level.regions[index],region=t("region",{symbol:symbols[regionId],name:t("regionNames")[regionId]});let key=starters.has(index)?"cellStarter":cats.has(index)?"cellCat":marks.has(index)?"cellMarked":"cellEmpty";const state=t(key,{row,column,region});if(index===invalidIndex&&invalidReason)return t("cellConflict",{state,reason:t(invalidReason)});return index===hintIndex?t("cellHint",{state}):state}
  function renderBoard(){if(!level)return;const board=$("#board"),focused=Number(document.activeElement?.dataset?.index);board.replaceChildren();board.style.setProperty("--size",String(level.size));for(let index=0;index<level.regions.length;index+=1){const regionId=level.regions[index],row=Math.floor(index/level.size),column=index%level.size,cell=document.createElement("button");cell.type="button";cell.className="cat-cell"+(starters.has(index)?" starter":"")+(index===hintIndex?" hint-target":"")+(index===invalidIndex?" invalid":"");cell.dataset.index=String(index);cell.dataset.symbol=symbols[regionId];cell.style.setProperty("--region-color",colors[regionId]);cell.style.setProperty("--region-pattern",patterns[regionId]);if(row===0||level.regions[index-level.size]!==regionId)cell.classList.add("region-top");if(row===level.size-1||level.regions[index+level.size]!==regionId)cell.classList.add("region-bottom");if(column===0||level.regions[index-1]!==regionId)cell.classList.add("region-left");if(column===level.size-1||level.regions[index+1]!==regionId)cell.classList.add("region-right");cell.setAttribute("role","gridcell");cell.setAttribute("aria-label",cellLabel(index));if(index===invalidIndex)cell.setAttribute("aria-invalid","true");cell.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight C X Space Enter");if(cats.has(index)){const image=document.createElement("img");image.src="../../assets/cat-color-sudoku-moonwhisker-v1.png";image.alt="";image.draggable=false;cell.append(image)}else if(marks.has(index)){const mark=document.createElement("span");mark.className="x-mark";mark.textContent="×";mark.setAttribute("aria-hidden","true");cell.append(mark)}cell.onclick=()=>playCell(index);cell.onkeydown=event=>handleCellKey(event,index);board.append(cell)}$("#objective").textContent=t("objective",{total:level.size,placed:cats.size});if(Number.isInteger(focused))requestAnimationFrame(()=>board.querySelector(`[data-index="${focused}"]`)?.focus({preventScroll:true}))}
  function handleCellKey(event,index){let next=-1;const row=Math.floor(index/level.size),column=index%level.size;if(event.key==="ArrowUp"&&row>0)next=index-level.size;if(event.key==="ArrowDown"&&row<level.size-1)next=index+level.size;if(event.key==="ArrowLeft"&&column>0)next=index-1;if(event.key==="ArrowRight"&&column<level.size-1)next=index+1;if(next>=0){event.preventDefault();$("#board").querySelector(`[data-index="${next}"]`)?.focus();return}if(event.key.toLowerCase()==="c"){event.preventDefault();setMode("cat")}if(event.key.toLowerCase()==="x"){event.preventDefault();setMode("mark")}}
  function setMode(next,announce=true){clearInvalid();mode=next;const cat=next==="cat";$("#toolCat").classList.toggle("active",cat);$("#toolMark").classList.toggle("active",!cat);$("#toolCat").setAttribute("aria-pressed",String(cat));$("#toolMark").setAttribute("aria-pressed",String(!cat));if(announce)setStatus(cat?"statusCatMode":"statusMarkMode")}
  function undo(){clearInvalid();if(!history.length){setStatus("nothingUndo",true);beep("error");return}restore(history.pop());setStatus("restored");beep("move")}
  function restart(){clearInvalid();cats=new Set(starters);marks=new Set();history=[];moves=0;hintIndex=-1;renderBoard();setStatus("restarted");beep("move")}
  function hint(){clearInvalid();const candidate=level.solution.find(index=>!cats.has(index));if(candidate===undefined){setStatus("hintDone");return}hintIndex=candidate;renderBoard();setStatus("hintReady");beep("hint");$("#board").querySelector(`[data-index="${candidate}"]`)?.focus({preventScroll:true})}
  function renderResultMastery(){const node=$("#resultMastery");if(!node||!level)return;const next=selected<29?levels[selected+1]:null;node.hidden=false;node.textContent=next?t("resultMastery",{stage:selected+2,focus:t("chapterRules")[next.chapter]}):t("resultMasteryFinal")}
  function checkComplete(){if(cats.size!==level.size)return;const solved=level.solution.every(index=>cats.has(index));if(!solved)return;if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(unlockKey,String(unlocked))}const markCount=marks.size,current=best[selected+1];if(!current||moves<current.moves)best[selected+1]={moves,marks:markCount};write(bestKey,JSON.stringify(best));$("#mainProgress").textContent=t("progress",{done:Math.min(30,unlocked-1)});$("#resultBody").textContent=t("resultBody",{stage:selected+1,moves,marks:markCount});renderResultMastery();resultClaimed=false;["#resultStages","#resultNext","#resultReplay"].forEach(selector=>$(selector).disabled=false);$("#resultNext").disabled=selected===29;setStatus("solved");beep("win");setTimeout(()=>{if(document.body.dataset.screen==="battle"&&!$("#resultDialog").open)$("#resultDialog").showModal()},260)}
  function claimResult(action){if(resultClaimed||!$("#resultDialog").open)return;resultClaimed=true;["#resultStages","#resultNext","#resultReplay"].forEach(selector=>$(selector).disabled=true);$("#resultDialog").close();action()}
  function syncSoundUi(){if(typeof window.WonderSound?.isMuted==="function")sound=!window.WonderSound.isMuted();const audio=$("#audio");if(!audio)return;audio.querySelector("small").textContent=t(sound?"audioOn":"audioOff");audio.setAttribute("aria-pressed",String(sound));audio.dataset.state=sound?"on":"off"}
  function setSoundEnabled(enabled){sound=Boolean(enabled);write(soundKey,sound?"on":"off");if(typeof window.WonderSound?.setMuted==="function")window.WonderSound.setMuted(!sound);syncSoundUi();if(sound)beep("move")}
  function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));$("#locale").value=locale;syncSoundUi();$("#mainProgress").textContent=t("progress",{done:Math.min(30,unlocked-1)});if(document.body.dataset.screen==="stage")renderStages();if(document.body.dataset.screen==="battle"&&level){$("#battleChapter").textContent=`${t("chapter",{n:level.chapter+1})} · ${t("chapters")[level.chapter]}`;$("#battleStage").textContent=t("stage",{n:selected+1});$("#ruleChapter").textContent=t("chapters")[level.chapter];$("#ruleText").textContent=t("chapterRules")[level.chapter];renderBoard();if($("#resultDialog").open)renderResultMastery();setStatus(mode==="cat"?"statusCatMode":"statusMarkMode")}}
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=localeData[code].label;$("#locale").append(option)});
  $("#locale").onchange=event=>{locale=event.target.value;write(localeKey,locale);write("weightPlayLocale",locale);try{window.WonderI18n?.setLocale?.(locale)}catch{}applyLocale()};
  $("#audio").onclick=()=>setSoundEnabled(!sound);
  window.addEventListener("wonder:audio-volume-change",syncSoundUi);
  $("#battleUtility").onclick=()=>$("#audio").click();
  $("#start").onclick=()=>show("stage");
  $("#stageBack").onclick=()=>show("main");
  $("#battleBack").onclick=()=>$("#leaveDialog").showModal();
  $("#leaveContinue").onclick=()=>$("#leaveDialog").close();
  $("#leaveStages").onclick=()=>show("stage");
  $("#toolCat").onclick=()=>setMode("cat");
  $("#toolMark").onclick=()=>setMode("mark");
  $("#undo").onclick=undo;
  $("#hint").onclick=hint;
  $("#restart").onclick=restart;
  $("#resultStages").onclick=()=>claimResult(()=>{selected=Math.min(29,selected+1);show("stage")});
  $("#resultReplay").onclick=()=>claimResult(()=>startLevel(selected));
  $("#resultNext").onclick=()=>claimResult(()=>startLevel(Math.min(29,selected+1)));
  installStageInput();
  document.body.dataset.wpSceneWriter=`cat-color-sudoku-v${GAME_VERSION}`;
  applyLocale();
  show("main");
  window.addEventListener("load",()=>$("#loadingPanel")?.classList.add("hidden"),{once:true});
})();
