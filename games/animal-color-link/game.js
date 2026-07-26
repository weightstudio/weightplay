(()=>{
  "use strict";
  const palette=["#ec6868","#489ee9","#9b72d5","#efb935","#67b66a","#35b8ad"];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const storeKey="wp-animal-color-link-v1";
  const $=selector=>document.querySelector(selector);
  const screens=[...document.querySelectorAll(".screen")];
  let locale=readStore("wp-locale")||"en";
  if(!localeOrder.includes(locale))locale="en";
  let unlocked=Number(readStore(storeKey))||1;
  let selected=Math.min(unlocked,30)-1;
  let level=null,paths={},active=null,history=[],moves=0,blockedPulse=false;

  function readStore(key){try{return localStorage.getItem(key)}catch{return null}}
  function writeStore(key,value){try{localStorage.setItem(key,value)}catch{}}
  function text(key,vars={}){
    let value=window.COLOR_LINK_LOCALES[locale]?.[key]??window.COLOR_LINK_LOCALES.en[key]??key;
    return typeof value==="string"?value.replace(/\{(\w+)\}/g,(_,name)=>vars[name]??""):value;
  }
  function show(id){
    screens.forEach(screen=>screen.hidden=screen.id!==id);
    document.body.dataset.screen=id;
    if(id==="stage")renderStages();
  }
  const {levels,buildLevel}=window.COLOR_LINK_LEVELS;
  function renderStages(){
    $("#progressBadge").textContent=text("progress",{done:Math.min(unlocked-1,30)});
    $("#stageGrid").innerHTML="";
    levels.forEach((item,index)=>{
      const button=document.createElement("button");
      const locked=index+1>unlocked;
      button.className=`stage-card${index===selected?" selected":""}${locked?" locked":""}`;
      button.disabled=locked;
      button.innerHTML=`<strong>${text("garden",{n:index+1})}</strong><span>${item.size} × ${item.size}</span><span class="dots">${palette.slice(0,item.count).map(c=>`<i style="--c:${c}"></i>`).join("")}</span>`;
      button.setAttribute("aria-label",`${text("garden",{n:index+1})}, ${item.size} × ${item.size}${locked?", "+text("locked"):""}`);
      button.onclick=()=>{selected=index;renderStages()};
      $("#stageGrid").append(button);
    });
    requestAnimationFrame(()=>$("#stageGrid .selected")?.scrollIntoView({block:"nearest"}));
  }
  function startLevel(index){
    selected=index;level=levels[index];paths={};active=null;history=[];moves=0;blockedPulse=false;
    $("#grid").style.setProperty("--size",level.size);
    $("#chapter").textContent=`${level.size} × ${level.size}`;
    $("#stageName").textContent=text("garden",{n:index+1});
    $("#status").textContent=text("draw");
    show("battle");renderBoard();
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
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);writeStore(storeKey,String(unlocked))}
    playTone(523,.08);setTimeout(()=>playTone(659,.12),90);
    $("#resultBody").textContent=text("resultBody",{n:selected+1,moves});
    $("#next").textContent=selected===29?text("allDone"):text("next");
    setTimeout(()=>$("#result").showModal(),220);
  }
  function playTone(frequency,duration){
    try{const audio=new(window.AudioContext||window.webkitAudioContext)(),osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration)}catch{}
  }
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
  function applyLocale(){
    const pack=window.COLOR_LINK_LOCALES[locale];
    document.documentElement.lang=locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    document.title=`${pack.title} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=text(node.dataset.t));
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",text(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",text(node.dataset.tAlt)));
    $("#locale").value=locale;
    if(!$("#stage").hidden)renderStages();
    if(!$("#battle").hidden){$("#stageName").textContent=text("garden",{n:selected+1});$("#status").textContent=text("draw");renderBoard()}
  }
  localeOrder.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.COLOR_LINK_LOCALES[code].label;$("#locale").append(option)});
  $("#locale").onchange=event=>{locale=event.target.value;writeStore("wp-locale",locale);applyLocale()};
  $("#start").onclick=()=>show("stage");
  $("#enter").onclick=()=>startLevel(selected);
  document.querySelectorAll("[data-back]").forEach(button=>button.onclick=()=>show(button.closest("#battle")?"stage":"main"));
  $("#undo").onclick=()=>{const color=history.pop();if(color!==undefined)delete paths[color];active=null;$("#status").textContent=text("undone");renderBoard()};
  $("#reset").onclick=()=>{paths={};active=null;history=[];moves=0;$("#status").textContent=text("fresh");renderBoard()};
  $("#hint").onclick=hint;
  $("#retry").onclick=()=>{$("#result").close();startLevel(selected)};
  $("#next").onclick=()=>{$("#result").close();if(selected===29)show("stage");else startLevel(selected+1)};
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
  applyLocale();show("main");
  window.__COLOR_LINK_TEST__={levels,buildLevel};
})();
