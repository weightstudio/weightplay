(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const locales=window.ANIMAL_PATCHWORK_PAWS_LOCALES||{};
  const storage={get(key){try{return window.localStorage?.getItem(key)||null}catch(_){return null}},set(key,value){try{window.localStorage?.setItem(key,value)}catch(_){}}};
  const campaignCopy={
    en:{intro:"Restore 30 habitat stages across six arcs. Match trails, then learn a new rule in each arc.",start:"Open the first stage",choose:"Choose a stage",chapter:"Pawprint Patchwork · Six arcs",round:"Habitat stage",prompt:"Read the cue, then turn tiles until every trail meets.",stages:"Back to stages",guideIntro:"Restore 30 authored habitat stages across six arcs, with wind, echo, compass, braid, and guardian rules joining the edge match.",guide1:"Open an unlocked stage and study the four tile edges plus its arc cue.",guide2:"Turn tiles clockwise, then check the weave. Later stages add a visible rule-changing cue.",guide3:"A mismatch is safe: read the feedback, use Reset when useful, and try again.",best:"Best campaign run: {best} turns · {unlocked}/30 stages unlocked",resultText:"{count} of {total} stages are woven. This run used {turns} turns.",next:"Next stage",patchDone:"Woven",patchOpen:"Open",locked:"Locked · clear the previous stage",checkpoint:"Arc checkpoint · {name}",arc1:"Meadow Beginnings",arc2:"Bramble Winds",arc3:"Echoing Creeks",arc4:"Compass Canopy",arc5:"Braided Moonrise",arc6:"Guardian Finale",modeMatch:"Edge match",modeWind:"Wind vane",modeEcho:"Echo pair",modeCompass:"Compass gate",modeBraid:"Braid route",modeGuardian:"Guardian seal",objectiveMatch:"Connect the four patch edges.",objectiveWind:"Connect the edges and face the wind vane.",objectiveEcho:"Connect the edges and answer the echo pair.",objectiveCompass:"Connect the edges and point the compass gate.",objectiveBraid:"Connect the edges and keep the braid route aligned.",objectiveGuardian:"Connect the edges, then hold every tile at the guardian seal.",ruleMatch:"Matching edges share the same trail colour.",ruleWind:"The wind vane glows on one tile. Its marked face must point north after the weave connects.",ruleEcho:"The echo pair listens across the patch. Their outer notes must match after the weave connects.",ruleCompass:"The compass gate names a colour. Point its marked edge to that colour after the weave connects.",ruleBraid:"The braid route crosses the patch. Its two outer knots must face the same colour after the weave connects.",ruleGuardian:"The guardian seal checks every tile orientation. Connect the weave, then return all four tiles to the seal cue.",checkpointGoal:"Checkpoint cleared: {name}. The next arc is open.",campaignComplete:"Stage 30 is complete: every arc and guardian seal is woven."},
    "zh-Hant":{intro:"跨越六個篇章修復 30 個精心設計的棲地關卡。讓每塊拼片的路線接起來，再讀懂下一次穿越的新規則。",start:"打開第一關",choose:"選擇關卡",chapter:"爪印拼布工坊・六個篇章",round:"棲地關卡",prompt:"先讀取提示，再轉動拼片讓所有路線接起來。",stages:"返回關卡",guideIntro:"跨越六個篇章修復 30 個棲地關卡，讓風向、回聲、羅盤、編織與守護封印加入邊線拼接。",guide1:"打開已解鎖關卡，觀察四塊拼片的邊線與篇章提示。",guide2:"順時針轉動拼片，再檢查拼布；後面的關卡會加入可讀取的新規則。",guide3:"拼錯不會受罰：讀取回饋，需要時重設拼片，再試一次。",best:"最佳篇章紀錄：{best} 次轉動・已解鎖 {unlocked}/30 關",resultText:"已完成 {count} / {total} 關。本次用了 {turns} 次轉動。",next:"下一關",patchDone:"已完成",patchOpen:"開啟",locked:"未解鎖・先完成前一關",checkpoint:"篇章檢查點・{name}",arc1:"草地啟程",arc2:"荊棘風徑",arc3:"回聲溪谷",arc4:"樹冠羅盤",arc5:"月升編織",arc6:"守護者終章",modeMatch:"邊線拼接",modeWind:"風向標",modeEcho:"回聲配對",modeCompass:"羅盤閘門",modeBraid:"編織路線",modeGuardian:"守護封印",objectiveMatch:"接起四塊拼片的邊線。",objectiveWind:"接起邊線，並讓風向標朝向北方。",objectiveEcho:"接起邊線，並回應回聲配對。",objectiveCompass:"接起邊線，讓羅盤閘門指向指定顏色。",objectiveBraid:"接起邊線，讓編織路線保持同色。",objectiveGuardian:"接起邊線，並把四塊拼片轉回守護封印方向。",ruleMatch:"相鄰邊線要有相同顏色。",ruleWind:"一塊拼片上有風向標。路線接好後，標記面必須朝北。",ruleEcho:"回聲配對會跨過拼片聆聽。路線接好後，兩個外側音符必須同色。",ruleCompass:"羅盤閘門會指定顏色。路線接好後，讓標記邊線朝向該顏色。",ruleBraid:"編織路線橫跨拼片。路線接好後，兩個外側結點必須同色。",ruleGuardian:"守護封印會檢查每塊拼片方向。接好路線後，四塊拼片都要回到封印提示。",checkpointGoal:"檢查點完成：{name}。下一個篇章已開啟。",campaignComplete:"第 30 關完成：所有篇章與守護封印都已編織完成。"}
  };
  const stageNames={
    en:["Fern Meadow","Pebble Creek","Moonlit Hollow","Dewdrop Ridge","Clover Gate","Bramble Turn","Gusty Glen","Whistling Pines","Cloudstep Rise","Windwatch Gate","Echo Brook","Murmur Marsh","Ripple Hollow","Otter's Crossing","Echo Bell Gate","Canopy Compass","Sunbeam Fork","Leafline Lookout","Northwind Nest","Compass Crown","Moonlit Braid","Silver Thread","Night Fern","Starfall Crossing","Moonrise Gate","Keeper's Path","Quiet Lanterns","Four Pawprints","Last Meadow","Guardian's Seal"],
    "zh-Hant":["蕨葉草地","卵石溪流","月光小谷","露珠山稜","幸運草之門","荊棘轉彎","微風峽谷","呼嘯松林","雲階高地","風望之門","回聲小溪","低語濕地","漣漪小谷","水獺渡口","回聲鐘門","樹冠羅盤","日光岔路","葉線瞭望台","北風鳥巢","羅盤王冠","月光編織","銀絲小徑","夜蕨之地","星落渡口","月升之門","守護者小徑","靜謐燈火","四爪印記","最後草地","守護封印"]
  };
  const genericAnimals=["fox","otter","owl","deer","badger","hare","heron","lynx"];
  const genericAnimalCopy={fox:["fox","狐狸"],otter:["otter","水獺"],owl:["owl","貓頭鷹"],deer:["deer","小鹿"],badger:["badger","獾"],hare:["hare","野兔"],heron:["heron","蒼鷺"],lynx:["lynx","山貓"]};
  const stageSeeds=[
    {mode:"match",initial:[1,2,3,1],links:["leaf","water","stone","sun"],outer:"moon"},
    {mode:"match",initial:[2,1,3,2],links:["stone","sun","water","leaf"],outer:"water"},
    {mode:"match",initial:[3,2,1,3],links:["moon","leaf","sun","water"],outer:"leaf"},
    {mode:"match",initial:[1,3,2,1],links:["sun","stone","moon","leaf"],outer:"sun"},
    {mode:"match",checkpoint:true,initial:[2,3,1,2],links:["water","moon","leaf","stone"],outer:"stone"},
    {mode:"wind",windTile:0,initial:[3,1,2,3],links:["leaf","stone","water","moon"],outer:"moon"},
    {mode:"wind",windTile:1,initial:[1,3,2,1],links:["sun","water","moon","leaf"],outer:"water"},
    {mode:"wind",windTile:2,initial:[2,1,3,2],links:["stone","leaf","sun","water"],outer:"leaf"},
    {mode:"wind",windTile:3,initial:[3,2,1,3],links:["moon","water","stone","sun"],outer:"sun"},
    {mode:"wind",checkpoint:true,windTile:2,initial:[1,3,2,1],links:["water","sun","leaf","moon"],outer:"stone"},
    {mode:"echo",initial:[2,1,3,2],links:["leaf","moon","water","stone"],outer:"moon"},
    {mode:"echo",initial:[3,2,1,3],links:["sun","stone","leaf","water"],outer:"water"},
    {mode:"echo",initial:[1,3,2,1],links:["moon","water","sun","leaf"],outer:"leaf"},
    {mode:"echo",initial:[2,3,1,2],links:["stone","leaf","moon","sun"],outer:"sun"},
    {mode:"echo",checkpoint:true,initial:[3,1,2,3],links:["water","stone","leaf","moon"],outer:"stone"},
    {mode:"compass",compassTile:0,initial:[1,2,3,1],links:["sun","leaf","stone","water"],outer:"moon"},
    {mode:"compass",compassTile:1,initial:[2,1,3,2],links:["moon","water","leaf","stone"],outer:"water"},
    {mode:"compass",compassTile:2,initial:[3,2,1,3],links:["leaf","sun","water","moon"],outer:"leaf"},
    {mode:"compass",compassTile:3,initial:[1,3,2,1],links:["stone","moon","sun","leaf"],outer:"sun"},
    {mode:"compass",checkpoint:true,compassTile:1,initial:[2,3,1,2],links:["water","leaf","moon","stone"],outer:"stone"},
    {mode:"braid",initial:[3,1,2,3],links:["moon","stone","water","leaf"],outer:"moon"},
    {mode:"braid",initial:[1,2,3,1],links:["leaf","water","sun","stone"],outer:"water"},
    {mode:"braid",initial:[2,3,1,2],links:["stone","moon","leaf","sun"],outer:"leaf"},
    {mode:"braid",initial:[3,2,1,3],links:["sun","leaf","moon","water"],outer:"sun"},
    {mode:"braid",checkpoint:true,initial:[1,3,2,1],links:["water","stone","sun","moon"],outer:"stone"},
    {mode:"guardian",initial:[2,1,3,2],links:["leaf","moon","stone","water"],outer:"moon"},
    {mode:"guardian",initial:[3,2,1,3],links:["sun","water","leaf","stone"],outer:"water"},
    {mode:"guardian",initial:[1,3,2,1],links:["moon","leaf","water","sun"],outer:"leaf"},
    {mode:"guardian",initial:[2,3,1,2],links:["stone","sun","moon","leaf"],outer:"sun"},
    {mode:"guardian",checkpoint:true,initial:[3,1,2,3],links:["water","moon","stone","leaf"],outer:"stone"}
  ];
  const makeTiles=({links,outer})=>[
    {edges:[outer,links[0],links[1],outer]},
    {edges:[outer,outer,links[2],links[0]]},
    {edges:[links[1],links[3],outer,outer]},
    {edges:[links[2],outer,outer,links[3]]}
  ];
  const patches=stageSeeds.map((seed,index)=>{
    const number=index+1;
    const animalKey=`animal${(index%genericAnimals.length)+1}`;
    const modeTitle=seed.mode[0].toUpperCase()+seed.mode.slice(1);
    const tiles=makeTiles(seed);
    return {name:`stage${number}`,animal:animalKey,arc:`arc${Math.floor(index/5)+1}`,objective:`objective${modeTitle}`,rule:`rule${modeTitle}`,...seed,number,tiles,compassColor:seed.compassTile===undefined?null:tiles[seed.compassTile].edges[0]};
  });
  const resultActionCopy={en:"Replay","zh-Hant":"重玩本關","zh-Hans":"重玩本关",ja:"もう一度遊ぶ",ko:"다시 플레이",es:"Repetir","pt-BR":"Jogar novamente",fr:"Rejouer",de:"Noch einmal spielen",it:"Rigioca",ru:"Повторить",hi:"फिर खेलें",ar:"إعادة اللعب"};
  Object.entries(locales).forEach(([locale,dictionary])=>{
    Object.assign(dictionary,campaignCopy[locale]||campaignCopy.en);
    dictionary.replay=resultActionCopy[locale]||resultActionCopy.en;
    dictionary.openStage=({en:"Open selected stage","zh-Hant":"開啟所選關卡","zh-Hans":"开启所选关卡",ja:"選択したステージを開始",ko:"선택한 스테이지 시작",es:"Abrir nivel seleccionado","pt-BR":"Abrir fase selecionada",fr:"Ouvrir le niveau sélectionné",de:"Ausgewähltes Level öffnen",it:"Apri il livello selezionato",ru:"Открыть выбранный уровень",hi:"चुना हुआ स्तर खोलें",ar:"ابدأ المرحلة المحددة"})[locale]||"Open selected stage";
    (stageNames[locale]||stageNames.en).forEach((name,index)=>{dictionary[`stage${index+1}`]=name});
    genericAnimals.forEach((animal,index)=>{dictionary[`animal${index+1}`]=locale==="zh-Hant"?genericAnimalCopy[animal][1]:genericAnimalCopy[animal][0]});
    // Explicit game-owned campaign translations must win over legacy fallbacks.
    Object.assign(dictionary,window.ANIMAL_PATCHWORK_PAWS_CAMPAIGN_LOCALES?.[locale]||{});
  });
  const routeLocale=document.documentElement.lang;let locale=locales[routeLocale]?routeLocale:storage.get("weightplay-animal-patchwork-paws-locale")||"en";if(!locales[locale])locale="en";
  let patchIndex=0,selectedStage=0,rotations=[],solved=new Set(),cleared=new Set(),unlockedStage=1,turns=0,sessionTurns=0,feedback="",currentScreen="main",frameUI=null,pendingResultTimer=null,battleEffect="",animatedTile=-1,sceneTransitionToken=0;
  const sceneTransitionTimers=new Map();
  try{const saved=JSON.parse(storage.get("weightplay-animal-patchwork-paws-cleared-v3")||"[]");if(Array.isArray(saved))saved.filter(index=>Number.isInteger(index)&&index>=0&&index<patches.length).forEach(index=>cleared.add(index));}catch(_){/* malformed saves are normalized below */}
  unlockedStage=Math.min(patches.length,Math.max(1,Number(storage.get("weightplay-animal-patchwork-paws-unlocked-v3")||1)||1,cleared.size?Math.max(...cleared)+2:1));
  const saveProgress=()=>{storage.set("weightplay-animal-patchwork-paws-cleared-v3",JSON.stringify([...cleared].sort((a,b)=>a-b)));storage.set("weightplay-animal-patchwork-paws-unlocked-v3",String(unlockedStage))};
  saveProgress();
  const copy=(key,vars={})=>Object.entries(vars).reduce((out,[name,value])=>out.replaceAll(`{${name}}`,String(value)),(locales[locale]||locales.en)[key]||locales.en[key]||key);
  const announce=(name,data={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:`animal_patchwork_paws_${name}`,stage:patchIndex+1,turns,...data})};
  const bestValue=()=>Number(storage.get("weightplay-animal-patchwork-paws-best-v3")||0)||"—";
  function clearSceneTransition(root){const timer=sceneTransitionTimers.get(root);if(timer)window.clearTimeout(timer);sceneTransitionTimers.delete(root);root.classList.remove("wp-patchwork-scene-entering","wp-patchwork-scene-exiting");delete root.dataset.wpPatchworkSceneTransition}
  function animateScene(root,type){clearSceneTransition(root);const className=type==="exit"?"wp-patchwork-scene-exiting":"wp-patchwork-scene-entering",token=String(++sceneTransitionToken);root.classList.add(className);root.dataset.wpPatchworkSceneTransition=token;const timer=window.setTimeout(()=>{if(root.dataset.wpPatchworkSceneTransition!==token)return;root.classList.remove(className);delete root.dataset.wpPatchworkSceneTransition;sceneTransitionTimers.delete(root);if(type==="exit"&&root!==$(`${document.body.dataset.screen}Screen`))root.hidden=true},160);sceneTransitionTimers.set(root,timer)}
  function cancelPendingResult(){if(pendingResultTimer){window.clearTimeout(pendingResultTimer);pendingResultTimer=null}}
  function closeAnimatedOverlay(panel,after){if(panel.hidden||panel.dataset.wpClosing==="true")return;panel.dataset.wpClosing="true";panel.inert=true;panel.classList.remove("wp-patchwork-overlay-exiting");void panel.offsetWidth;panel.classList.add("wp-patchwork-overlay-exiting");let completed=false,timer=0;const finish=()=>{if(completed)return;completed=true;window.clearTimeout(timer);panel.removeEventListener("animationend",onEnd);panel.hidden=true;panel.inert=false;panel.classList.remove("wp-patchwork-overlay-exiting");delete panel.dataset.wpClosing;if(after)after()};const onEnd=event=>{if(event.target===panel)finish()};panel.addEventListener("animationend",onEnd);timer=window.setTimeout(finish,160)}
  function show(screen){
    const previousScreen=currentScreen,previousScene=previousScreen==="result"?"battle":previousScreen,scene=screen==="result"?"battle":screen,initialMain=screen==="main"&&!document.body.dataset.screen;
    const previousRoot=previousScene!==scene?$(
      `${previousScene}Screen`
    ):null,nextRoot=$(`${scene}Screen`);
    if(previousScreen==="battle"&&scene!=="battle")cancelPendingResult();
    if(previousRoot&&!previousRoot.hidden){clearSceneTransition(previousRoot);previousRoot.hidden=false;previousRoot.inert=true;previousRoot.setAttribute("aria-hidden","true");animateScene(previousRoot,"exit")}
    currentScreen=screen;
    for(const root of [$("mainScreen"),$("stageScreen"),$("battleScreen")]){
      if(root===nextRoot){clearSceneTransition(root);root.hidden=false;root.inert=false;root.setAttribute("aria-hidden","false");if(previousScene!==scene||initialMain)animateScene(root,"enter")}
      else if(root===previousRoot&&!root.hidden){root.inert=true;root.setAttribute("aria-hidden","true")}
      else{clearSceneTransition(root);root.hidden=true;root.inert=true;root.setAttribute("aria-hidden","true")}
    }
    const guide=document.querySelector("#gameGuide, [data-wp-game-guide], .game-page-info-static");
    if(guide)guide.hidden=scene!=="main";
    $("resultScreen").hidden=screen!=="result";
    $("leaveConfirm").hidden=true;
    document.body.hidden=false;
    document.body.removeAttribute("hidden");
    document.body.dataset.screen=scene;
    if(frameUI){frameUI.frame.activate(scene);if(scene==="stage")frameUI.refreshStage(selectedStage)}
    window.dispatchEvent(new CustomEvent("weightplay:game-view-change",{detail:{screen:scene}}));
    window.dispatchEvent(new Event("weightplay:shell-sync"));
  }
  function renderBest(){$("best").textContent=copy("best",{best:bestValue(),unlocked:unlockedStage})}
  function renderStatic(){
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $("localeSelect").value=locale;
    document.querySelectorAll("[data-i18n]").forEach(node=>{node.textContent=copy(node.dataset.i18n)});
    ["mainReturn","stageBackBtn","battleBackBtn"].forEach(id=>{if($(id))$(id).setAttribute("aria-label",copy("back"))});
    $("stageTitle").textContent=copy("choose");
    $("battleTitle").textContent=copy("round");
    renderBest();
    renderStages();
    renderBattle();
    renderResult();
    renderLeaveConfirm();
    frameUI?.frame.refresh();
    window.dispatchEvent(new Event("wonder:locale-change"));
  }
  function renderStages(){if(frameUI)frameUI.refreshStage(selectedStage)}
  function startPatch(index,fromStage=false){if(index<0||index>=unlockedStage||index>=patches.length)return;cancelPendingResult();battleEffect="";animatedTile=-1;patchIndex=index;selectedStage=index;rotations=[...patches[index].initial];turns=0;feedback="";if(index===0||fromStage)sessionTurns=0;show("battle");renderBattle();announce("start")}
  function edgeNode(color,position){const node=document.createElement("span");node.className=`edge edge-${position} edge-${color}`;node.setAttribute("aria-hidden","true");return node}
  function oriented(tile,index){const shift=rotations[index]||0;return tile.edges.map((_,edgeIndex)=>tile.edges[(edgeIndex-shift+4)%4])}
  function specialSolved(patch,board){
    if(patch.mode==="wind")return rotations[patch.windTile]===0;
    if(patch.mode==="echo")return board[0][0]===board[3][2];
    if(patch.mode==="compass")return board[patch.compassTile][0]===patch.compassColor;
    if(patch.mode==="braid")return board[0][3]===board[3][1];
    if(patch.mode==="guardian")return rotations.every(rotation=>rotation===0);
    return true;
  }
  function boardSolved(){const patch=patches[patchIndex];const board=patch.tiles.map((tile,index)=>oriented(tile,index));for(let index=0;index<board.length;index+=1){if(index%2===0&&board[index][1]!==board[index+1][3])return false;if(index<2&&board[index][2]!==board[index+2][0])return false}return specialSolved(patch,board)}
  function renderBattle(){
    if(!$("board")||! ["battle","result"].includes(currentScreen))return;
    const effect=battleEffect,effectTile=animatedTile;battleEffect="";animatedTile=-1;
    const patch=patches[patchIndex];
    $("patchTitle").textContent=copy(patch.name);
    $("progressPill").textContent=`${patchIndex+1} / ${patches.length}`;
    $("prompt").textContent=copy(patch.objective);
    $("ruleText").textContent=copy(patch.rule);
    const root=$("board");root.classList.toggle("wp-patchwork-reset",effect==="reset");root.replaceChildren();
    patch.tiles.forEach((tile,index)=>{const button=document.createElement("button");button.type="button";button.className="tile";if(effect==="turn"&&index===effectTile)button.classList.add("wp-patchwork-turn");button.setAttribute("role","gridcell");button.setAttribute("aria-label",copy("rotate",{number:index+1}));const face=document.createElement("span");face.className="tile-face";const edges=oriented(tile,index);["n","e","s","w"].forEach((position,edgeIndex)=>face.appendChild(edgeNode(edges[edgeIndex],position)));const label=document.createElement("span");label.className="tile-label";label.textContent=index===3?"✣":index===0?"❧":index===1?"≈":"◆";label.setAttribute("aria-hidden","true");face.appendChild(label);button.appendChild(face);button.addEventListener("click",()=>rotateTile(index));root.appendChild(button)});
    $("status").textContent=feedback?copy(feedback,{animal:copy(patch.animal),name:copy(patch.name)}):"";
    $("status").className=(feedback==="correct"?"status good":feedback==="wrong"?"status try":"status")+(["turn","reset","check","complete"].includes(effect)?" wp-patchwork-status-change":"");
  }
  function rotateTile(index){if(feedback==="correct")return;rotations[index]=(rotations[index]+1)%4;turns+=1;sessionTurns+=1;feedback="turned";battleEffect="turn";animatedTile=index;window.WeightPlayAudio.play("board.rotate");announce("turn",{tile:index+1});renderBattle()}
  function revealResultAction(){const panel=$("resultScreen");const action=[...panel.querySelectorAll("button:not([hidden]):not([disabled])")][0];if(!action)return;panel.scrollTop=panel.scrollHeight;action.focus({preventScroll:true})}
  function checkBoard(){if(feedback==="correct")return;if(boardSolved()){cancelPendingResult();feedback="correct";battleEffect="complete";solved.add(patchIndex);cleared.add(patchIndex);unlockedStage=Math.min(patches.length,Math.max(unlockedStage,patchIndex+2));saveProgress();announce("complete",{checkpoint:Boolean(patches[patchIndex].checkpoint)});renderBattle();const completedIndex=patchIndex;pendingResultTimer=window.setTimeout(()=>{pendingResultTimer=null;if(currentScreen==="battle"&&patchIndex===completedIndex&&$("leaveConfirm").hidden){renderResult();show("result");revealResultAction()}},280)}else{feedback="wrong";battleEffect="check";announce("check",{correct:false});renderBattle()}}
  function renderResult(){if(!$("resultText"))return;const complete=patchIndex===patches.length-1&&cleared.has(patchIndex);$("resultTitle").textContent=complete?copy("resultTitle"):patches[patchIndex].checkpoint?copy("checkpointGoal",{name:copy(patches[patchIndex].name)}):copy("resultPartial");$("resultText").textContent=complete?copy("campaignComplete"):copy("resultText",{count:cleared.size,total:patches.length,turns:sessionTurns});const nextIndex=patchIndex+1;$("nextBtn").hidden=false;$("nextBtn").disabled=nextIndex>=unlockedStage||nextIndex>=patches.length;$("resultMapBtn").hidden=false;$("replayBtn").hidden=false;if(complete){const old=Number(storage.get("weightplay-animal-patchwork-paws-best-v3")||0);if(!old||sessionTurns<old)storage.set("weightplay-animal-patchwork-paws-best-v3",String(sessionTurns))}}
  function renderLeaveConfirm(){const copySet=window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY?.[locale]||window.ANIMAL_PATCHWORK_PAWS_LEAVE_COPY?.en;if(!copySet)return;const patch=patches[patchIndex];$("leaveTitle").textContent=copySet.title;$("leaveBody").textContent=copySet.body.replaceAll("{stage}",copy(patch.name));$("leaveConfirm").querySelector("[data-wp-leave-continue]").textContent=copySet.continue;$("leaveConfirm").querySelector("[data-wp-leave-confirm]").textContent=copySet.leave}
  function openLeaveConfirm(){cancelPendingResult();renderLeaveConfirm();$("leaveConfirm").inert=false;$("leaveConfirm").hidden=false;$("leaveConfirm").querySelector("[data-wp-leave-continue]").focus({preventScroll:true})}
  function closeLeaveConfirm(){if($("leaveConfirm").hidden)return;closeAnimatedOverlay($("leaveConfirm"),()=>$("battleBackBtn").focus({preventScroll:true}))}
  function confirmLeave(){closeAnimatedOverlay($("leaveConfirm"),()=>{selectedStage=patchIndex;show("stage");renderStages();announce("stage_open")})}
  function closeResult(after){closeAnimatedOverlay($("resultScreen"),after)}
  function nextPatch(){const next=patchIndex+1;if(next<unlockedStage&&next<patches.length)startPatch(next);else{selectedStage=patchIndex;show("stage");renderStages()}}
  function goBack(){if(currentScreen==="battle"){openLeaveConfirm()}else if(currentScreen==="result"){selectedStage=patchIndex;show("stage")}else if(currentScreen==="stage"){show("main");renderBest()}}
  function bind(){
    $("startBtn").addEventListener("click",()=>{selectedStage=Math.min(unlockedStage-1,patches.length-1);show("stage");renderStages();announce("stage_open")});
    $("resultMapBtn").addEventListener("click",()=>closeResult(()=>{selectedStage=Math.min(unlockedStage-1,patches.length-1);show("stage");renderStages()}));
    $("nextBtn").addEventListener("click",()=>closeResult(nextPatch));$("replayBtn").addEventListener("click",()=>closeResult(()=>startPatch(patchIndex)));
    $("checkBtn").addEventListener("click",checkBoard);
    $("resetBtn").addEventListener("click",()=>{cancelPendingResult();rotations=[...patches[patchIndex].initial];turns=0;feedback="";battleEffect="reset";renderBattle();announce("reset")});
    ["stageBackBtn","battleBackBtn"].forEach(id=>$(id).addEventListener("click",goBack));
    $("leaveConfirm").querySelector("[data-wp-leave-continue]").addEventListener("click",closeLeaveConfirm);
    $("leaveConfirm").querySelector("[data-wp-leave-confirm]").addEventListener("click",confirmLeave);
    $("leaveConfirm").addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();closeLeaveConfirm();return}if(event.key!=="Tab")return;const buttons=[...$("leaveConfirm").querySelectorAll("button:not([disabled])")];if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
    $("localeSelect").addEventListener("change",event=>{locale=event.target.value;storage.set("weightplay-animal-patchwork-paws-locale",locale);renderStatic()});
  }
  function boot(){
    bind();
    $("localeSelect").value=locale;
    frameUI=window.mountAnimalPatchworkPawsFrame({patches,getState:()=>({unlockedStage,cleared}),text:key=>copy(key),onSelect:index=>{selectedStage=index},onStart:index=>startPatch(index,true)});
    frameUI.frame.activate("main");
    show("main");
    renderStatic();
    window.WeightPlayGameEntryLoader?.ready?.();
    announce("loaded");
  }
  window.__ANIMAL_PATCHWORK_PAWS_TEST__={patches,startPatch,rotateTile,checkBoard,getState:()=>({patchIndex,selectedStage,rotations:[...rotations],solved:[...solved],cleared:[...cleared],unlockedStage,turns,screen:currentScreen,feedback,boardSolved:boardSolved()})};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
}());
