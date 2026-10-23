(()=>{
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

  const palette=["#ec6868","#489ee9","#9b72d5","#efb935","#67b66a","#35b8ad"];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const storeKey="wp-animal-color-link-v1";
  const $=selector=>document.querySelector(selector);
  const localeSelect=$("#locale");
  const screens=[...document.querySelectorAll(".screen")];
  const interfaceCopy={
    en:["Stages","Previous gardens","Next gardens","Pause this garden?","Continue keeps every path exactly in place. Returning to Stages ends this attempt.","Continue","Return to Stages","Next garden","Play again"],
    "zh-Hant":["關卡","上一區花園","下一區花園","要暫停這座花園嗎？","繼續會保留每一條路徑；返回關卡會結束本次挑戰。","繼續","返回關卡","下一座花園","再玩一次"],
    "zh-Hans":["关卡","上一组花园","下一组花园","要暂停这座花园吗？","继续会保留每一条路径；返回关卡会结束本次挑战。","继续","返回关卡","下一座花园","再玩一次"],
    ja:["ステージ","前のガーデン","次のガーデン","このガーデンを一時停止しますか？","続けるとすべての道がそのまま残ります。ステージに戻ると今回の挑戦は終了します。","続ける","ステージに戻る","次のガーデン","もう一度"],
    ko:["스테이지","이전 정원","다음 정원","이 정원을 일시정지할까요?","계속하면 모든 길이 그대로 유지됩니다. 스테이지로 돌아가면 이번 도전이 끝납니다.","계속하기","스테이지로 돌아가기","다음 정원","다시 하기"],
    es:["Niveles","Jardines anteriores","Jardines siguientes","¿Pausar este jardín?","Continuar conserva cada camino exactamente. Volver a Niveles termina este intento.","Continuar","Volver a Niveles","Siguiente jardín","Jugar de nuevo"],
    "pt-BR":["Fases","Jardins anteriores","Próximos jardins","Pausar este jardim?","Continuar mantém todos os caminhos no lugar. Voltar às Fases encerra esta tentativa.","Continuar","Voltar às Fases","Próximo jardim","Jogar novamente"],
    fr:["Niveaux","Jardins précédents","Jardins suivants","Mettre ce jardin en pause ?","Continuer conserve chaque chemin. Revenir aux niveaux termine cette tentative.","Continuer","Revenir aux niveaux","Jardin suivant","Rejouer"],
    de:["Stufen","Vorherige Gärten","Nächste Gärten","Diesen Garten pausieren?","Beim Fortsetzen bleiben alle Wege erhalten. Zurück zu den Stufen beendet diesen Versuch.","Fortsetzen","Zurück zu den Stufen","Nächster Garten","Erneut spielen"],
    it:["Livelli","Giardini precedenti","Giardini successivi","Mettere in pausa questo giardino?","Continuando, ogni percorso resta al suo posto. Tornare ai livelli termina il tentativo.","Continua","Torna ai livelli","Giardino successivo","Gioca ancora"],
    ru:["Уровни","Предыдущие сады","Следующие сады","Приостановить этот сад?","Продолжение сохранит все дорожки. Возврат к уровням завершит эту попытку.","Продолжить","Вернуться к уровням","Следующий сад","Играть снова"],
    hi:["स्तर","पिछले बगीचे","अगले बगीचे","इस बगीचे को रोकें?","जारी रखने पर हर रास्ता वैसा ही रहेगा। स्तरों पर लौटने से यह प्रयास समाप्त होगा।","जारी रखें","स्तरों पर लौटें","अगला बगीचा","फिर खेलें"],
    ar:["المراحل","الحدائق السابقة","الحدائق التالية","إيقاف هذه الحديقة مؤقتًا؟","المتابعة تُبقي كل مسار في مكانه. الرجوع إلى المراحل ينهي هذه المحاولة.","متابعة","العودة إلى المراحل","الحديقة التالية","العب مجددًا"]
  };
  document.body.setAttribute("data-runtime-localize","off");
  let locale=readStore("wp-locale")||"en";
  if(!localeOrder.includes(locale))locale="en";
  let unlocked=Number(readStore(storeKey))||1;
  let selected=Math.min(unlocked,30)-1;
  let level=null,paths={},active=null,history=[],moves=0,blockedPulse=false,resultClaimed=false;
  let screenFrame=null,stageUI=null,stageStartButton=null;

  function readStore(key){try{return localStorage.getItem(key)}catch{return null}}
  function writeStore(key,value){try{localStorage.setItem(key,value)}catch{}}
  function text(key,vars={}){
    let value=window.COLOR_LINK_LOCALES[locale]?.[key]??window.COLOR_LINK_LOCALES.en[key]??key;
    return typeof value==="string"?value.replace(/\{(\w+)\}/g,(_,name)=>vars[name]??""):value;
  }
  function ui(index){return(interfaceCopy[locale]||interfaceCopy.en)[index]}
  function setBattleCovered(covered,owner){
    [...$("#battle").children].forEach(node=>{if(node!==owner)node.inert=covered});
  }
  function closeBattleModal(panel,focusTarget){
    panel.hidden=true;
    setBattleCovered(false,panel);
    focusTarget?.focus?.({preventScroll:true});
  }
  function openBattleModal(panel,focusTarget){
    setBattleCovered(true,panel);
    panel.hidden=false;
    requestAnimationFrame(()=>focusTarget?.focus?.({preventScroll:true}));
  }
  function show(id){
    (__wpNotifyMeasurement(), $("#leavePanel").hidden=true);
    (__wpNotifyMeasurement(), $("#result").hidden=true);
    setBattleCovered(false,null);
    screens.forEach(screen=>screen.hidden=screen.id!==id);
    document.body.dataset.screen=id;
    screenFrame?.activate(id);
    if(id==="battle"){
      window.dispatchEvent(new Event("weightplay:stage-sync"));
      window.dispatchEvent(new Event("weightplay:battle-sync"));
    }else{
      window.dispatchEvent(new Event("weightplay:battle-sync"));
      window.dispatchEvent(new Event("weightplay:stage-sync"));
    }
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    if(id==="stage"){
      renderStages();
      stageUI?.refresh(selected);
    }

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[id] ?? null;
      if (["result"].includes(id) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  const {levels,buildLevel}=window.COLOR_LINK_LEVELS;
  function createStageConfig(){
    return window.AnimalColorLinkStageConfig.create({
      count:levels.length,
      stage(index){
        const item=levels[index],locked=index+1>unlocked;
        return {
          id:index+1,
          kicker:text("choose"),
          title:text("garden",{n:index+1}),
          subtitle:`${item.size} × ${item.size}`,
          status:locked?text("locked"):"",
          summary:text("draw"),
          locked,
          cleared:index+1<unlocked,
        };
      },
    });
  }
  function updateMainProgress(){
    const progress=$("#mainProgress");
    if(progress)progress.textContent=text("progress",{done:Math.min(unlocked-1,30)});
  }
  function renderStages(){
    const progress=$("#progressBadge");
    if(progress)progress.textContent=text("progress",{done:Math.min(unlocked-1,30)});
    updateMainProgress();
    stageStartButton && (stageStartButton.disabled=selected+1>unlocked);
    stageUI?.setConfig(createStageConfig(),selected);
  }
  function startLevel(index){
    selected=index;level=levels[index];paths={};active=null;history=[];moves=0;blockedPulse=false;
    $("#grid").style.setProperty("--size",level.size);
    $("#stageName").textContent=text("garden",{n:index+1});
    $("#status").textContent=text("draw");
    show("battle");renderBoard();

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function endpointAt(cell){
    for(const[color,pair]of Object.entries(level.ends))if(pair.includes(cell))return Number(color);
    return null;
  }
  function ownerAt(cell,includeActive=true){
    for(const[color,path]of Object.entries(paths))if(path.includes(cell))return Number(color);
    if(includeActive&&active?.cells.includes(cell))return active.color;
    return null;
  }
  function adjacent(a,b){
    const ar=Math.floor(a/level.size),ac=a%level.size,br=Math.floor(b/level.size),bc=b%level.size;
    return Math.abs(ar-br)+Math.abs(ac-bc)===1;
  }
  function renderBoard(){
    const grid=$("#grid");grid.innerHTML="";
    for(let i=0;i<level.size*level.size;i++){
      const color=ownerAt(i),endpoint=endpointAt(i),button=document.createElement("button");
      button.className=`cell${color!==null?" path":""}${active?.cells.includes(i)?" active":""}`;
      button.dataset.cell=i;button.setAttribute("role","gridcell");
      if(color!==null)button.style.setProperty("--color",palette[color]);
      else if(endpoint!==null)button.style.setProperty("--color",palette[endpoint]);
      const row=Math.floor(i/level.size)+1,col=i%level.size+1;
      button.setAttribute("aria-label",endpoint!==null?text("seed",{color:text("colors")[endpoint],row,col}):text("cell",{row,col}));
      if(endpoint!==null){const dot=document.createElement("span");dot.className="dot";button.append(dot)}
      grid.append(button);
    }
    const linked=Object.keys(paths).length;
    const filled=new Set(Object.values(paths).flat()).size;
    $("#moves").textContent=text("moves",{n:moves});
    $("#linkStatus").textContent=text("links",{done:linked,total:level.count});
    $("#fillStatus").textContent=text("filled",{done:filled,total:level.size*level.size});
    $("#undo").disabled=!history.length;
  }
  function begin(cell,pointerId){
    const color=endpointAt(cell);if(color===null)return;
    if(paths[color]){delete paths[color];history=history.filter(value=>value!==color)}
    active={color,cells:[cell],target:level.ends[color].find(end=>end!==cell),pointerId};
    moves++;renderBoard();
  }
  function extend(cell){
    if(!active)return;
    const path=active.cells,last=path.at(-1);
    if(cell===last)return;
    if(path.length>1&&cell===path.at(-2)){path.pop();renderBoard();return}
    const endpoint=endpointAt(cell);
    if(!adjacent(last,cell)||active.cells.includes(cell)||ownerAt(cell,false)!==null||(endpoint!==null&&cell!==active.target)){
      if(!blockedPulse){blockedPulse=true;$("#status").textContent=text("blocked");setTimeout(()=>blockedPulse=false,250)}
      return;
    }
    path.push(cell);renderBoard();
  }
  function finish(){
    if(!active)return;
    if(active.cells.at(-1)===active.target){
      paths[active.color]=active.cells.slice();
      history=history.filter(value=>value!==active.color);history.push(active.color);
      $("#status").textContent=text("continue");
    }else $("#status").textContent=text("miss");
    active=null;renderBoard();checkComplete();
  }
  function checkComplete(){
    const cells=new Set(Object.values(paths).flat());
    if(Object.keys(paths).length!==level.count||cells.size!==level.size*level.size)return;
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);writeStore(storeKey,String(unlocked));updateMainProgress()}
    playTone("puzzle.clear",.08);setTimeout(()=>void 0,90);
    $("#resultBody").textContent=text("resultBody",{n:selected+1,moves});
    resultClaimed=false;
    $("#next").disabled=selected===29;
    [$("#resultStages"),$("#next"),$("#retry")].forEach(button=>button.classList.remove("primary"));
    (__wpNotifyMeasurement(), (selected===29?$("#resultStages"):$("#next")).classList.add("primary"));
    setTimeout(()=>openBattleModal($("#result"),selected===29?$("#resultStages"):$("#next")),220);

    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function playTone(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function hint(){
    const unresolved=Object.keys(level.solution).map(Number).find(color=>!paths[color]);
    if(unresolved===undefined)return;
    const needed=new Set(level.solution[unresolved]);
    Object.entries(paths).forEach(([color,path])=>{if(path.some(cell=>needed.has(cell))){delete paths[color];history=history.filter(value=>value!==Number(color))}});
    paths[unresolved]=level.solution[unresolved].slice();history.push(unresolved);moves++;
    $("#status").textContent=text("hinted");renderBoard();
    level.solution[unresolved].forEach(cell=>gridCell(cell)?.classList.add("hint"));
    checkComplete();
  }
  const gridCell=cell=>document.querySelector(`[data-cell="${cell}"]`);
  function mountSharedInterface(){
    const stageProgress=document.createElement("span");
    stageProgress.id="progressBadge";
    const stageProgressGroup=window.WeightPlayScreenFrame.createGroup();
    stageProgressGroup.add(stageProgress);

    const battleStatsGroup=window.WeightPlayScreenFrame.createGroup();
    // Keep only the three live counters that fit the shared top-information
    // track at phone width. The board itself already shows its dimensions.
    for(const id of ["moves","linkStatus","fillStatus"]){
      const stat=document.createElement("span");
      stat.id=id;
      battleStatsGroup.add(stat);
    }

    screenFrame=window.WeightPlayScreenFrame.mount({
      root:document.body,
      localeSelect,
      playUI:true,
      scenes:{
        main:{root:$("#main"),header:$("#main .main-header"),content:$("#main .main-content")},
        stage:{root:$("#stage"),header:$("#stage .stage-header"),content:$("#stage .stage-workspace"),headerInfo:$("#stageHeaderInfo")},
        battle:{root:$("#battle"),header:$("#battle .battle-header"),content:$("#battle .battle-content"),headerInfo:$("#battleHeaderInfo")},
      },
    });
    screenFrame.stageTopUI.add(stageProgressGroup);
    screenFrame.battleTopUI.add(battleStatsGroup);

    stageStartButton=document.createElement("button");
    stageStartButton.id="stageStart";
    stageStartButton.type="button";
    stageStartButton.dataset.wpFrameAction="primary";
    stageStartButton.addEventListener("click",()=>{
      if(selected+1<=unlocked)startLevel(selected);
    });
    screenFrame.commonDownButton.add(stageStartButton);

    stageUI=window.WeightPlayPlayUI.mountStage({
      page:$("#stage .stage-workspace"),
      rail:$("#stageGrid"),
      selected,
      isActive:()=>screenFrame.active==="stage"&&!$("#stage").hidden,
      config:createStageConfig(),
      onSelect(index){
        selected=index;
        if(stageStartButton)stageStartButton.disabled=index+1>unlocked;
      },
      onStart(index){startLevel(index);},
    });
  }
  function applyLocale(){
    const pack=window.COLOR_LINK_LOCALES[locale];
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    document.title=`${pack.title} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=text(node.dataset.t));
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",text(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",text(node.dataset.tAlt)));
    updateMainProgress();
    localeSelect.value=locale;
    if(stageStartButton)stageStartButton.textContent=text("start");
    $("#leaveTitle").textContent=ui(3);
    $("#leaveText").textContent=ui(4);
    $("#leaveContinue").textContent=ui(5);
    $("#leaveStages").textContent=ui(6);
    $("#resultStages").textContent=ui(0);
    $("#next").textContent=ui(7);
    $("#retry").textContent=ui(8);
    if(!$("#stage").hidden)renderStages();
    if(!$("#battle").hidden){$("#stageName").textContent=text("garden",{n:selected+1});$("#status").textContent=text("draw");renderBoard()}
  }
  localeOrder.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.COLOR_LINK_LOCALES[code].label;$("#locale").append(option)});
  $("#locale").onchange=event=>{
    locale=event.target.value;
    if(window.WonderI18n?.setLocale){window.WonderI18n.setLocale(locale);return}
    writeStore("wp-locale",locale);applyLocale()
  };
  $("#start").onclick=()=>show("stage");
  $("#stage [data-wp-return='stage']").onclick=event=>{event.preventDefault();show("main")};
  $("#battle [data-wp-return='battle']").onclick=()=>{
    if(!$("#result").hidden){$("#resultStages").click();return}
    openBattleModal($("#leavePanel"),$("#leaveContinue"));
  };
  $("#leaveContinue").onclick=()=>closeBattleModal($("#leavePanel"),$("#battle [data-wp-return='battle']"));
  $("#leaveStages").onclick=()=>show("stage");
  $("#undo").onclick=()=>{const color=history.pop();if(color!==undefined)delete paths[color];active=null;$("#status").textContent=text("undone");renderBoard()};
  $("#reset").onclick=()=>{paths={};active=null;history=[];moves=0;$("#status").textContent=text("fresh");renderBoard()};
  $("#hint").onclick=hint;
  function claimResult(action){
    if(resultClaimed)return;
    resultClaimed=true;
    closeBattleModal($("#result"));
    action();
  }
  $("#resultStages").onclick=()=>claimResult(()=>show("stage"));
  $("#retry").onclick=()=>claimResult(()=>__wpReplayStart(() => startLevel(selected)));
  $("#next").onclick=()=>{if(!$("#next").disabled)claimResult(()=>startLevel(selected+1))};
  $("#grid").addEventListener("pointerdown",event=>{const cell=event.target.closest(".cell");if(!cell)return;event.preventDefault();$("#grid").setPointerCapture?.(event.pointerId);begin(Number(cell.dataset.cell),event.pointerId)});
  $("#grid").addEventListener("pointermove",event=>{if(!active)return;const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest(".cell");if(cell)extend(Number(cell.dataset.cell))});
  $("#grid").addEventListener("pointerup",finish);
  $("#grid").addEventListener("pointercancel",finish);
  $("#grid").addEventListener("keydown",event=>{
    const focused=document.activeElement.closest?.(".cell"),start=focused?Number(focused.dataset.cell):null;
    if(event.key==="Enter"||event.key===" "){event.preventDefault();if(active)finish();else if(start!==null)begin(start,null);return}
    if(!active)return;
    const delta={ArrowUp:-level.size,ArrowDown:level.size,ArrowLeft:-1,ArrowRight:1}[event.key];
    if(delta===undefined)return;event.preventDefault();
    const next=active.cells.at(-1)+delta;
    if(next>=0&&next<level.size*level.size&&adjacent(active.cells.at(-1),next))extend(next);
  });
  document.addEventListener("keydown",event=>{
    const panel=!$("#leavePanel").hidden?$("#leavePanel"):!$("#result").hidden?$("#result"):null;
    if(!panel)return;
    if(event.key==="Escape"){
      event.preventDefault();
      (panel===$("#leavePanel")?$("#leaveContinue"):$("#resultStages")).click();
      return;
    }
    if(event.key!=="Tab")return;
    const controls=[...panel.querySelectorAll("button:not([disabled])")];
    const first=controls[0],last=controls.at(-1);
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  },true);
  mountSharedInterface();
  applyLocale();show("main");
  window.__COLOR_LINK_TEST__={levels,buildLevel,interfaceCopy};
})();
