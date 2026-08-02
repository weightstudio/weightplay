(()=>{
  "use strict";
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const localeLang={en:"en","zh-Hant":"zh-Hant","zh-Hans":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const palette=["#22dfff","#ff4fcf","#ffbf45","#946cff","#68e56c","#ff786d","#4589ff","#ff6298","#f7d85a"];
  const saveKey="wp-animal-prism-garden-v1";
  const {levels}=window.PRISM_GARDEN_LEVELS;
  const screens=$$(".screen");
  let locale=read("wp-locale")||"en";
  let unlocked=Math.max(1,Math.min(30,Number(read(saveKey))||1));
  let selected=unlocked-1;
  let level=null,paths={},history=[],activeColor=null,pointerId=null,moves=0,resultClaimed=false,audioContext=null;

  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,String(value))}catch{}}
  function copyPaths(value=paths){return Object.fromEntries(Object.entries(value).map(([key,path])=>[key,path.slice()]))}
  function t(key,vars={}){
    let value=window.PRISM_GARDEN_LOCALES[locale]?.[key]??window.PRISM_GARDEN_LOCALES.en[key]??key;
    return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  }
  function setCovered(covered,owner){
    $$("#battle > *").forEach(node=>{if(node!==owner)node.inert=covered});
    document.body.classList.toggle("modal-open",covered);
  }
  function openModal(panel,focus){
    panel.hidden=false;setCovered(true,panel);requestAnimationFrame(()=>focus?.focus?.({preventScroll:true}));
  }
  function closeModal(panel,focus){
    panel.hidden=true;setCovered(false,panel);focus?.focus?.({preventScroll:true});
  }
  function syncBattleHelp(screen){
    const button=$(".wp-tutorial-button");
    if(!button)return;
    const header=$("#battle .battle-header");
    if(button.parentElement!==header)header.append(button);
    button.classList.add("prism-battle-help");
    button.hidden=screen!=="battle";
  }
  function show(id){
    $("#leavePanel").hidden=true;$("#result").hidden=true;setCovered(false,null);
    screens.forEach(screen=>screen.hidden=screen.id!==id);
    $("#mainGroup").hidden=id!=="main";
    document.body.dataset.screen=id;
    document.body.classList.toggle("wp-shell-main-active",id==="main");
    document.body.classList.toggle("wp-shell-stage-active",id==="stage");
    document.body.classList.toggle("wp-shell-battle-active",id==="battle");
    document.body.classList.toggle("wp-stage-select-active",id==="stage");
    $("#generalReserve").hidden=id==="main";
    syncBattleHelp(id);
    if(id==="stage")renderStages();
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));
  }
  function setLocale(next){
    locale=localeOrder.includes(next)?next:"en";
    write("wp-locale",locale);
    window.WonderI18n?.setLocale?.(locale);
    document.documentElement.lang=localeLang[locale]||"en";
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $$("[data-t]").forEach(node=>{node.textContent=t(node.dataset.t)});
    $$("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));
    $$("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    document.title=`${t("title")} | WeightPlay`;
    if(level){renderHud();renderBoard()}
    renderStages();
  }
  function initLocale(){
    if(!localeOrder.includes(locale))locale="en";
    const select=$("#locale");
    localeOrder.forEach(code=>{
      const option=document.createElement("option");
      option.value=code;option.textContent=window.PRISM_GARDEN_LOCALES[code].name;
      select.append(option);
    });
    select.value=locale;
    select.addEventListener("change",()=>setLocale(select.value));
    setLocale(locale);
  }
  function renderStages(){
    const rail=$("#stageGrid");
    if(!rail)return;
    const progress=t("progress",{done:Math.max(0,unlocked-1)});
    $("#progressBadge").textContent=progress;
    $("#mainProgress").textContent=progress;
    rail.innerHTML="";
    levels.forEach((item,index)=>{
      const locked=index>=unlocked;
      const button=document.createElement("button");
      button.type="button";
      button.className=`stage-card${index===selected?" selected is-centered":""}${locked?" locked":""}`;
      button.dataset.index=String(index);
      button.setAttribute("aria-disabled",String(locked));
      if(index===selected){button.setAttribute("aria-current","true");button.dataset.wpStageRecommended="true"}
      button.innerHTML=`<strong>${t("garden",{n:index+1})}</strong><span class="stage-size">${item.size}×${item.size}</span><span class="stage-detail">${item.count} · ${t("gates",{n:Object.keys(item.gates).length})}${locked?` · ${t("locked")}`:""}</span>`;
      button.setAttribute("aria-label",`${t("garden",{n:index+1})}, ${item.size}×${item.size}, ${locked?t("locked"):t("ready")}`);
      button.addEventListener("click",()=>{if(!locked)startLevel(index)});
      rail.append(button);
    });
    requestAnimationFrame(()=>rail.children[selected]?.scrollIntoView({block:"nearest",inline:"center"}));
  }
  function startLevel(index){
    selected=index;level=levels[index];paths={};history=[];activeColor=null;pointerId=null;moves=0;resultClaimed=false;
    $("#stageName").textContent=t("garden",{n:index+1});
    $("#chapter").textContent=t("chapter",{n:level.chapter});
    $("#status").textContent=t("ready");
    show("battle");renderBoard();tone(520,.05);
    window.WonderAnalytics?.track?.("game_start",{game_id:"animal-prism-garden",stage:index+1});
  }
  function seedColorAt(index){
    for(let color=0;color<level.count;color++)if(level.ends[color].includes(index))return color;
    return -1;
  }
  function ownerAt(index){
    for(const [color,path] of Object.entries(paths))if(path.includes(index))return Number(color);
    return -1;
  }
  function connected(color){
    const path=paths[color]||[],ends=level.ends[color];
    return path.length>1&&((path[0]===ends[0]&&path.at(-1)===ends[1])||(path[0]===ends[1]&&path.at(-1)===ends[0]));
  }
  function renderHud(){
    if(!level)return;
    const linked=Array.from({length:level.count},(_,color)=>connected(color)).filter(Boolean).length;
    const occupied=new Set(Object.values(paths).flat()).size;
    $("#moves").textContent=t("moves",{n:moves});
    $("#linkStatus").textContent=t("links",{done:linked,total:level.count});
    $("#fillStatus").textContent=t("filled",{done:occupied,total:level.size*level.size});
  }
  function renderBoard(){
    if(!level)return;
    const grid=$("#grid");grid.innerHTML="";grid.style.setProperty("--size",level.size);
    for(let index=0;index<level.size*level.size;index++){
      const cell=document.createElement("div");
      cell.className="cell";cell.dataset.index=String(index);cell.setAttribute("role","gridcell");
      const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
      if(owner>=0){cell.classList.add("path");cell.style.setProperty("--path",palette[owner])}
      if(seed>=0){cell.classList.add("seed");cell.style.setProperty("--seed",palette[seed]);cell.dataset.seed=String(seed)}
      if(gate>=0){
        cell.classList.add("gate");cell.style.setProperty("--gate",palette[gate]);
        const mark=document.createElement("span");mark.className="gate-mark";cell.append(mark);
      }
      grid.append(cell);
    }
    renderHud();
  }
  function adjacent(a,b){
    const ar=Math.floor(a/level.size),ac=a%level.size,br=Math.floor(b/level.size),bc=b%level.size;
    return Math.abs(ar-br)+Math.abs(ac-bc)===1;
  }
  function begin(index,event){
    const color=seedColorAt(index);
    if(color<0)return;
    event.preventDefault();
    history.push(copyPaths());
    delete paths[color];
    paths[color]=[index];activeColor=color;pointerId=event.pointerId;
    $("#grid").setPointerCapture?.(pointerId);
    renderBoard();tone(360,.035);
  }
  function extend(index){
    if(activeColor===null)return;
    const path=paths[activeColor],last=path.at(-1);
    if(index===last)return;
    if(path.length>1&&index===path.at(-2)){path.pop();renderBoard();return}
    if(!adjacent(last,index)||path.includes(index)){blocked(index);return}
    const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
    if((seed>=0&&seed!==activeColor)||(owner>=0&&owner!==activeColor)||(gate>=0&&gate!==activeColor)){blocked(index);return}
    path.push(index);renderBoard();tone(250+path.length*7,.018);
  }
  function blocked(index){
    const cell=$(`.cell[data-index="${index}"]`);cell?.classList.add("blocked");
    setTimeout(()=>cell?.classList.remove("blocked"),240);
    $("#status").textContent=t("blocked");
  }
  function end(event){
    if(activeColor===null||event.pointerId!==pointerId)return;
    moves++;activeColor=null;pointerId=null;
    renderBoard();checkComplete();
  }
  function checkComplete(){
    const allLinked=Array.from({length:level.count},(_,color)=>connected(color)).every(Boolean);
    const filled=new Set(Object.values(paths).flat()).size===level.size*level.size;
    if(!allLinked||!filled||resultClaimed)return;
    resultClaimed=true;
    const nextUnlocked=Math.min(30,Math.max(unlocked,selected+2));
    if(nextUnlocked!==unlocked){unlocked=nextUnlocked;write(saveKey,unlocked)}
    $("#resultBody").textContent=t("resultBody",{n:selected+1,moves});
    $("#next").disabled=selected>=29;
    setTimeout(()=>{openModal($("#result"),$("#next").disabled?$("#retry"):$("#next"));successTone()},280);
    window.WonderAnalytics?.track?.("game_complete",{game_id:"animal-prism-garden",stage:selected+1,moves});
  }
  function hint(){
    if(!level)return;
    const color=Array.from({length:level.count},(_,i)=>i).find(i=>!connected(i));
    if(color===undefined)return;
    history.push(copyPaths());paths[color]=level.solution[color].slice();moves++;
    $("#status").textContent=t("hinted");renderBoard();tone(720,.08);checkComplete();
  }
  function undo(){
    const previous=history.pop();
    if(!previous)return;
    paths=previous;activeColor=null;moves++;
    $("#status").textContent=t("undone");renderBoard();
  }
  function reset(){
    if(Object.keys(paths).length)history.push(copyPaths());
    paths={};activeColor=null;moves++;
    $("#status").textContent=t("fresh");renderBoard();
  }
  function tone(frequency,duration){
    if(window.WonderSound?.isMuted?.())return;
    try{
      audioContext ||= new(window.AudioContext||window.webkitAudioContext)();
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.frequency.value=frequency;oscillator.type="sine";gain.gain.setValueAtTime(.035,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
      oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration);
    }catch{}
  }
  function successTone(){[520,680,880].forEach((note,index)=>setTimeout(()=>tone(note,.14),index*100))}

  $("#grid").addEventListener("pointerdown",event=>begin(Number(event.target.closest(".cell")?.dataset.index),event));
  $("#grid").addEventListener("pointermove",event=>{
    if(activeColor===null||event.pointerId!==pointerId)return;
    const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest?.(".cell");
    if(cell&&$("#grid").contains(cell))extend(Number(cell.dataset.index));
  });
  $("#grid").addEventListener("pointerup",end);
  $("#grid").addEventListener("pointercancel",end);
  $("#start").addEventListener("click",()=>show("stage"));
  $("#stage [data-back]").addEventListener("click",()=>show("main"));
  $("#battle [data-back]").addEventListener("click",()=>openModal($("#leavePanel"),$("#leaveContinue")));
  $("#leaveContinue").addEventListener("click",()=>closeModal($("#leavePanel"),$("#battle [data-back]")));
  $("#leaveStages").addEventListener("click",()=>show("stage"));
  $("#undo").addEventListener("click",undo);$("#hint").addEventListener("click",hint);$("#reset").addEventListener("click",reset);
  $("#resultStages").addEventListener("click",()=>show("stage"));
  $("#retry").addEventListener("click",()=>startLevel(selected));
  $("#next").addEventListener("click",()=>startLevel(Math.min(29,selected+1)));
  $("#stageGrid").addEventListener("wonder:stage-snap",event=>{
    const index=Number(event.detail?.index),card=$("#stageGrid").children[index];
    if(!Number.isInteger(index)||!card)return;
    selected=index;
    $$("#stageGrid .stage-card").forEach((item,itemIndex)=>{
      item.classList.toggle("selected",itemIndex===index);item.classList.toggle("is-centered",itemIndex===index);
      item.toggleAttribute("aria-current",itemIndex===index);
    });
  });
  $("#stageTab").addEventListener("click",()=>$("#stageGrid").children[selected]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}));

  initLocale();renderStages();show("main");
  document.addEventListener("DOMContentLoaded",()=>syncBattleHelp(document.body.dataset.screen),{once:true});
  window.addEventListener("load",()=>{
    $("#loadingPanel")?.classList.add("hidden");
    window.WonderAnalytics?.track?.("game_view",{game_id:"animal-prism-garden",release_state:"public"});
  },{once:true});
})();
