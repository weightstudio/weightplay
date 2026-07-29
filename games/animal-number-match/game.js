(()=>{
  "use strict";
  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const $=selector=>document.querySelector(selector),screens=[...document.querySelectorAll(".screen")],levels=window.NUMBER_MATCH_LEVELS.levels;
  const storageKey="wp-animal-number-match-v1";
  let locale=window.WonderI18n?.actualLocale?.()||window.__WONDER_FORCED_LOCALE||read("weightPlayLocale")||read("wp-locale")||window.WonderI18n?.locale?.()||"en";if(!codes.includes(locale))locale="en";
  let unlocked=Number(read(storageKey))||1,selected=Math.min(unlocked,30)-1,level=null,values=[],picked=null,history=[],moves=0,resultActionClaimed=false,inputLocked=false,tileFocusIndex=0;
  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,value)}catch{}}
  function t(key,vars={}){const value=window.NUMBER_MATCH_LOCALES[locale]?.[key]??window.NUMBER_MATCH_LOCALES.en[key]??key;return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"")}
  function show(id){if(id!=="battle"&&$("#leaveDialog").open)$("#leaveDialog").close();screens.forEach(screen=>screen.hidden=screen.id!==id);$("#generalReserve").hidden=id!=="battle";document.body.dataset.screen=id;window.scrollTo(0,0);if(id==="stage")renderStages()}
  function selectStage(index,center=false){
    selected=Math.max(0,Math.min(29,index));
    document.querySelectorAll("#stageGrid .stage-card").forEach((card,cardIndex)=>{
      const active=cardIndex===selected;
      card.classList.toggle("selected",active);card.classList.toggle("centered",active);card.setAttribute("aria-current",active?"true":"false");
    });
    if(center)document.querySelector(`#stageGrid [data-index="${selected}"]`)?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});
  }
  function renderStages(){
    $("#progress").textContent=t("progress",{done:Math.min(unlocked-1,30)});$("#stageGrid").innerHTML="";
    levels.forEach((item,index)=>{
      const button=document.createElement("button"),locked=index+1>unlocked;
      button.className=`stage-card${index===selected?" selected centered":""}${locked?" locked":""}`;button.dataset.index=index;button.dataset.stageIndex=index;button.setAttribute("aria-current",index===selected?"true":"false");button.setAttribute("aria-disabled",locked?"true":"false");
      button.innerHTML=`<strong>${t("grove",{n:index+1})}</strong><span>${item.rows} × ${item.cols}${locked?" · "+t("locked"):""}</span><span class="difficulty-pips" data-tier="${item.tier}" aria-hidden="true"></span>`;
      button.onclick=()=>{selectStage(index,true);if(!locked)startLevel(index)};$("#stageGrid").append(button);
    });
    selectStage(selected);
  }
  function startLevel(index){
    selected=index;level=levels[index];values=level.cells.slice();picked=null;history=[];moves=0;inputLocked=false;tileFocusIndex=values.findIndex(value=>value!==null);
    $("#board").style.setProperty("--cols",level.cols);$("#chapter").textContent=t("chapter",{n:Math.floor(index/5)+1});$("#stageName").textContent=t("grove",{n:index+1});$("#status").textContent=t("selectFirst");show("battle");renderBoard();
  }
  const matches=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&a+b===10;
  function visiblePair(a,b){
    if(a===b)return false;
    const ar=Math.floor(a/level.cols),ac=a%level.cols,br=Math.floor(b/level.cols),bc=b%level.cols;
    if(ar===br){for(let col=Math.min(ac,bc)+1;col<Math.max(ac,bc);col++)if(values[ar*level.cols+col]!==null)return false;return true}
    if(ac===bc){for(let row=Math.min(ar,br)+1;row<Math.max(ar,br);row++)if(values[row*level.cols+ac]!==null)return false;return true}
    return false;
  }
  function availablePair(){
    for(let a=0;a<values.length;a++)if(values[a]!==null)for(let b=a+1;b<values.length;b++)if(values[b]!==null&&matches(values[a],values[b])&&visiblePair(a,b))return[a,b];
    return null;
  }
  function choose(index){
    if(inputLocked||values[index]===null)return;
    tileFocusIndex=index;
    if(picked===null){picked=index;$("#status").textContent=t("selectFirst");renderBoard();return}
    if(index===picked){picked=null;renderBoard();return}
    if(!matches(values[picked],values[index])){
      $("#status").textContent=t("invalid");picked=index;renderBoard();flash(index,"bad");return;
    }
    if(!visiblePair(picked,index)){
      $("#status").textContent=t("blocked");picked=index;renderBoard();flash(index,"bad");return;
    }
    const a=picked,b=index,matched=[{index:a,value:values[a]},{index:b,value:values[b]}];
    history.push({a,b,va:values[a],vb:values[b]});values[a]=null;values[b]=null;picked=null;moves++;
    $("#status").textContent=t("match");renderBoard();showMatchEffect(matched);if(values.every(value=>value===null))complete();
  }
  function renderBoard(){
    const board=$("#board"),restoreFocus=board.contains(document.activeElement),activeIndices=values.map((value,index)=>value===null?-1:index).filter(index=>index>=0);
    if(!activeIndices.includes(tileFocusIndex))tileFocusIndex=activeIndices.reduce((nearest,index)=>Math.abs(index-tileFocusIndex)<Math.abs(nearest-tileFocusIndex)?index:nearest,activeIndices[0]??-1);
    board.innerHTML="";
    values.forEach((value,index)=>{
      const button=document.createElement("button");button.className=`tile${value===null?" empty":""}${picked===index?" selected":""}`;button.dataset.index=index;button.setAttribute("role","gridcell");
      if(value===null){button.disabled=true;button.tabIndex=-1;button.setAttribute("aria-hidden","true")}
      else{button.tabIndex=index===tileFocusIndex?0:-1;button.textContent=value;button.setAttribute("aria-selected",picked===index?"true":"false");button.setAttribute("aria-label",t("tileLabel",{value,row:Math.floor(index/level.cols)+1,col:index%level.cols+1}));button.onclick=()=>choose(index)}
      board.append(button);
    });
    if(restoreFocus&&tileFocusIndex>=0)board.querySelector(`[data-index="${tileFocusIndex}"]`)?.focus();
    $("#pairsLeft").textContent=t("pairsLeft",{n:values.filter(value=>value!==null).length/2});$("#undo").disabled=!history.length;
  }
  function moveTileFocus(key,current){
    const activeIndices=values.map((value,index)=>value===null?-1:index).filter(index=>index>=0);
    if(!activeIndices.length)return;
    let next=current;
    if(key==="Home")next=activeIndices[0];
    else if(key==="End")next=activeIndices[activeIndices.length-1];
    else{
      const rtl=document.documentElement.dir==="rtl",horizontal=key==="ArrowLeft"||key==="ArrowRight";
      const step=horizontal?((key==="ArrowRight")!==rtl?1:-1):(key==="ArrowDown"?level.cols:-level.cols);
      for(let candidate=current+step;candidate>=0&&candidate<values.length;candidate+=step){
        if(horizontal&&Math.floor(candidate/level.cols)!==Math.floor(current/level.cols))break;
        if(values[candidate]!==null){next=candidate;break}
      }
    }
    tileFocusIndex=next;
    document.querySelectorAll("#board .tile:not(.empty)").forEach(tile=>tile.tabIndex=Number(tile.dataset.index)===next?0:-1);
    document.querySelector(`#board [data-index="${next}"]`)?.focus();
  }
  function flash(index,className){requestAnimationFrame(()=>document.querySelector(`[data-index="${index}"]`)?.classList.add(className))}
  function showMatchEffect(matched){
    const board=$("#board");
    matched.forEach(({index,value})=>{
      const socket=board.querySelector(`[data-index="${index}"]`);if(!socket)return;
      const echo=document.createElement("span");
      echo.className="match-echo";echo.textContent=value;echo.setAttribute("aria-hidden","true");
      echo.style.cssText=`left:${socket.offsetLeft}px;top:${socket.offsetTop}px;width:${socket.offsetWidth}px;height:${socket.offsetHeight}px`;
      board.append(echo);echo.addEventListener("animationend",()=>echo.remove(),{once:true});
    });
  }
  function hint(){const pair=availablePair();if(!pair){reorder();return}pair.forEach(index=>flash(index,"hint"));$("#status").textContent=t("selectFirst")}
  function pairValues(list,memo=new Map()){
    if(!list.length)return[];const key=list.slice().sort((a,b)=>a-b).join(",");if(memo.has(key))return null;memo.set(key,true);
    const first=list[0];
    for(let i=1;i<list.length;i++)if(matches(first,list[i])){const rest=list.slice(1,i).concat(list.slice(i+1)),paired=pairValues(rest,memo);if(paired)return[[first,list[i]],...paired]}
    return null;
  }
  function reorder(){
    const remaining=values.filter(value=>value!==null),pairs=pairValues(remaining);
    if(!pairs)return;
    values=Array(values.length).fill(null);pairs.flat().forEach((value,index)=>values[index]=value);picked=null;moves++;$("#status").textContent=t("shuffled");renderBoard();
  }
  function complete(){
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(storageKey,String(unlocked))}
    resultActionClaimed=false;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=false);$("#next").disabled=selected===29;
    $("#resultBody").textContent=t("resultBody",{n:selected+1,moves});$("#next").textContent=t("next");setTimeout(()=>$("#result").showModal(),180);
  }
  function claimResultAction(action){
    if(resultActionClaimed)return;
    resultActionClaimed=true;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=true);$("#result").close();action();
  }
  function applyLocale(){
    document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    $("#locale").value=locale;if(!$("#stage").hidden)renderStages();if(!$("#battle").hidden){$("#chapter").textContent=t("chapter",{n:Math.floor(selected/5)+1});$("#stageName").textContent=t("grove",{n:selected+1});$("#status").textContent=t("selectFirst");renderBoard()}
  }
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.NUMBER_MATCH_LOCALES[code].label;$("#locale").append(option)});
  write("weightPlayLocale",locale);write("wp-locale",locale);
  document.addEventListener("change",event=>{if(event.target.id!=="locale")return;locale=event.target.value;write("wp-locale",locale);try{window.WonderI18n?.setLocale?.(locale)}catch{}applyLocale()});
  window.addEventListener("wonder:locale-change",event=>{
    const next=event.detail?.actualLocale||event.detail?.locale;
    if(!codes.includes(next))return;
    locale=next;write("weightPlayLocale",locale);write("wp-locale",locale);applyLocale();
    window.setTimeout(()=>{if(locale===next)applyLocale()},0);
  });
  $("#start").onclick=()=>show("stage");$("#tutorialOpen").onclick=()=>$("#tutorialPanel").showModal();$("#tutorialStart").onclick=()=>{$("#tutorialPanel").close();show("stage")};$("#tutorialPanel").addEventListener("cancel",()=>$("#tutorialPanel").close());$("#stageGrid").addEventListener("wonder:stage-snap",event=>{const index=Number(event.detail?.index);if(Number.isInteger(index)&&index>=0)selectStage(index)});$("#stage [data-back]").onclick=()=>show("main");
  $("#battle [data-back]").onclick=()=>{
    if(picked===null&&!history.length&&!moves){show("stage");return}
    inputLocked=true;$("#leaveDialog").showModal();$("#continueBattle").focus();
  };
  const continueBattle=()=>{inputLocked=false;$("#leaveDialog").close();$("#battle [data-back]").focus()};
  $("#continueBattle").onclick=continueBattle;
  $("#leaveBattle").onclick=()=>{inputLocked=false;picked=null;show("stage")};
  $("#leaveDialog").addEventListener("cancel",event=>{event.preventDefault();continueBattle()});
  $("#board").addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key))return;
    const tile=event.target.closest(".tile:not(.empty)");if(!tile)return;
    event.preventDefault();moveTileFocus(event.key,Number(tile.dataset.index));
  });
  $("#undo").onclick=()=>{const last=history.pop();if(!last)return;values[last.a]=last.va;values[last.b]=last.vb;picked=null;moves=Math.max(0,moves-1);$("#status").textContent=t("undone");renderBoard()};
  $("#hint").onclick=hint;$("#shuffle").onclick=reorder;$("#restart").onclick=()=>startLevel(selected);
  $("#resultStages").onclick=()=>claimResultAction(()=>{selected=Math.min(29,unlocked-1);show("stage")});$("#next").onclick=()=>claimResultAction(()=>startLevel(selected+1));$("#retry").onclick=()=>claimResultAction(()=>startLevel(selected));
  applyLocale();show("main");$("#loadingPanel").classList.add("hidden");window.addEventListener("load",()=>requestAnimationFrame(()=>{const copy=document.querySelector(".wp-standard-main-copy");if(copy&&!copy.contains($("#tutorialOpen")))copy.append($("#tutorialOpen"))}));window.__NUMBER_MATCH_TEST__={matches,visiblePair,availablePair,currentSolution:()=>level?.solution?.map(pair=>pair.slice())||[]};
})();
