(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const LOCALES=window.ANIMAL_HONEY_SHIELD_LOCALES;
  const STORAGE_KEY="weightplay_animal_honey_shield_v1";
  const TUTORIAL_KEY="weightplay_tutorial_seen_animal_honey_shield_v1";
  const ROUTE_LOCALES={"zh-tw":"zh-Hant","zh-cn":"zh-Hans","pt-br":"pt-BR",en:"en",ja:"ja",ko:"ko",es:"es",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const routeSegment=location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  let locale=ROUTE_LOCALES[routeSegment]||safeGet("weightplay-locale")||"en";
  if(!LOCALES[locale])locale="en";
  const fallbackSave={unlocked:1,cleared:{},stars:{}};
  let save=loadSave(),screen="main",stageIndex=0,selectedStage=0,tutorialReturnFocus=null;
  const canvas=$("gameCanvas"),ctx=canvas.getContext("2d",{alpha:false});
  const atlas=new Image(),background=new Image();
  const themeBackgrounds=[background,new Image(),new Image(),new Image(),new Image(),new Image()];
  const themeBackgroundSources=[
    "../../assets/animal-honey-shield-background-simple-meadow.webp",
    "../../assets/animal-honey-shield-background-simple-brook.webp",
    "../../assets/animal-honey-shield-background-simple-stones.webp",
    "../../assets/animal-honey-shield-background-simple-wind.webp",
    "../../assets/animal-honey-shield-background-simple-bramble.webp",
    "../../assets/animal-honey-shield-background-simple-ruins.webp",
  ];
  const state={mode:"idle",paused:false,modal:false,started:false,planElapsed:0,elapsed:0,duration:8,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:0,spawned:0,frame:0,last:0,flash:0,wallMoves:0,wallApproachStartedAt:null,wallFirstMovedAt:null,maxGroupAttached:0,pathOpenedAt:null,navClock:0,nav:null,mover:null,keyboard:{x:500,y:310},result:null};
  let raf=0;
  const LINE_PIXELS_PER_NECTAR=14;
  const THEMES=[
    {sky:"#71c98b",ground:"#2d7a4d",accent:"#d8ff9b",terrain:"meadow"},
    {sky:"#65bad1",ground:"#237a70",accent:"#8ff7e8",terrain:"brook"},
    {sky:"#a9b96d",ground:"#596f3d",accent:"#e8d08a",terrain:"stones"},
    {sky:"#84a7d8",ground:"#415f78",accent:"#c8efff",terrain:"wind"},
    {sky:"#b47d9d",ground:"#67435f",accent:"#ffbddb",terrain:"bramble"},
    {sky:"#d49a49",ground:"#78512c",accent:"#ffe27d",terrain:"ruins"},
  ];

  function safeGet(key){try{return localStorage.getItem(key)}catch{return null}}
  function safeSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
  function loadSave(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      if(!raw||typeof raw!=="object")return structuredClone(fallbackSave);
      const unlocked=Math.max(1,Math.min(30,Number(raw.unlocked)||1));
      const cleared={},stars={};
      for(let i=0;i<30;i++){
        if(raw.cleared?.[i]===true)cleared[i]=true;
        const value=Math.max(0,Math.min(3,Number(raw.stars?.[i])||0));
        if(value)stars[i]=value;
      }
      return{unlocked,cleared,stars};
    }catch{return structuredClone(fallbackSave)}
  }
  function persist(){safeSet(STORAGE_KEY,JSON.stringify(save))}
  function fmt(key,vars={}){
    let value=LOCALES[locale]?.[key]??LOCALES.en[key]??key;
    if(Array.isArray(value))return value;
    return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`);
  }
  function announce(key,vars){$("feedbackText").textContent=fmt(key,vars)}
  function applyLocale(){
    document.documentElement.lang=locale==="zh-Hant"?"zh-TW":locale==="zh-Hans"?"zh-CN":locale;
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $("localeSelect").value=locale;
    document.querySelectorAll("[data-i18n]").forEach(node=>node.textContent=fmt(node.dataset.i18n));
    document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",fmt(node.dataset.i18nAria)));
    document.querySelectorAll("[data-i18n-alt]").forEach(node=>node.setAttribute("alt",fmt(node.dataset.i18nAlt)));
    updateMainProgress();renderStages();updateStageChapter();updateHud();
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale}}));
    document.title=`${fmt("title")} | WeightPlay`;
  }
  $("localeSelect").addEventListener("change",event=>{
    locale=event.target.value;safeSet("weightplay-locale",locale);
    window.WonderI18n?.setLocale?.(locale);
    applyLocale();
  });

  function updateMainProgress(){
    const done=Object.keys(save.cleared).length,stars=Object.values(save.stars).reduce((sum,n)=>sum+n,0);
    $("mainProgress").textContent=fmt("progress",{done,stars});
  }
  function showScreen(next){
    screen=next;document.body.dataset.screen=next;
    $("mainGroup").hidden=next!=="main";$("stageScreen").hidden=next!=="stage";$("battleScreen").hidden=next!=="battle";
    document.body.classList.toggle("wp-stage-select-active",next==="stage");
    document.body.classList.toggle("wp-shell-main-active",next==="main");
    document.body.classList.toggle("wp-shell-stage-active",next==="stage");
    document.body.classList.toggle("wp-shell-battle-active",next==="battle");
    if(next==="stage")renderStages();
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));
    if(next==="stage")requestAnimationFrame(centerSelected);
    if(next==="battle"){
      window.dispatchEvent(new CustomEvent("weightplay:battle-open"));
      cancelAnimationFrame(raf);state.last=performance.now();raf=requestAnimationFrame(loop);
    }
    else cancelAnimationFrame(raf);
  }
  function renderStages(){
    const rail=$("stageRail");if(!rail)return;
    rail.replaceChildren();
    const highest=Math.min(29,save.unlocked-1);selectedStage=Math.max(0,Math.min(selectedStage,29));
    for(let i=0;i<30;i++){
      const button=document.createElement("button");button.type="button";button.className="stage-card";
      const unlocked=i<save.unlocked;button.classList.toggle("locked",!unlocked);button.classList.toggle("selected",i===selectedStage);
      button.dataset.stage=String(i);button.setAttribute("aria-disabled",String(!unlocked));button.tabIndex=i===highest?0:-1;
      const best=save.stars[i]||0;
      button.innerHTML=`<small>${fmt("chapter",{n:Math.floor(i/5)+1})}</small><strong>${i+1}</strong><span>${unlocked?(save.cleared[i]?fmt("stars",{n:best}):fmt("stage",{n:i+1})):fmt("locked")}</span>`;
      button.addEventListener("click",()=>{if(!unlocked)return;selectedStage=i;startStage(i)});
      button.addEventListener("focus",()=>{selectedStage=i;syncStageSelection();updateStageChapter()});
      rail.append(button);
    }
    selectedStage=Math.max(selectedStage,highest);
    syncStageSelection();updateStageSummary();
  }
  function syncStageSelection(){document.querySelectorAll(".stage-card").forEach(card=>card.classList.toggle("selected",Number(card.dataset.stage)===selectedStage))}
  function updateStageSummary(){
    const done=Object.keys(save.cleared).length,stars=Object.values(save.stars).reduce((sum,n)=>sum+n,0);
    $("stageSummary").textContent=fmt("progress",{done,stars});
  }
  function updateStageChapter(){
    if(!$("chapterTitle"))return;
    const chapter=Math.floor(selectedStage/5),titles=fmt("chapters"),rules=fmt("chapterRules");
    $("chapterKicker").textContent=fmt("chapter",{n:chapter+1});$("chapterTitle").textContent=titles[chapter]||titles[0];$("chapterRule").textContent=rules[chapter]||rules[0];
  }
  function centerSelected(){
    const card=$("stageRail")?.querySelector(`[data-stage="${selectedStage}"]`);
    card?.scrollIntoView({behavior:"instant",block:"nearest",inline:"center"});
  }
  function level(index){
    const chapter=Math.floor(index/5),slot=index%5,theme=THEMES[chapter];
    const dogPositions=[
      [{x:500,y:492},{x:430,y:475},{x:575,y:475},{x:500,y:440},{x:500,y:505}],
      [{x:500,y:500},{x:600,y:470},{x:395,y:470},{x:500,y:425},{x:510,y:505}],
      [{x:500,y:505},{x:410,y:470},{x:590,y:470},{x:500,y:405},{x:500,y:500}],
      [{x:500,y:490},{x:620,y:475},{x:380,y:475},{x:510,y:410},{x:500,y:505}],
      [{x:500,y:500},{x:390,y:455},{x:610,y:455},{x:500,y:395},{x:500,y:500}],
      [{x:500,y:500},{x:420,y:440},{x:580,y:440},{x:500,y:380},{x:500,y:505}],
    ];
    const hiveSets=[
      [[{x:845,y:100}],[{x:155,y:110}],[{x:850,y:95},{x:160,y:125}],[{x:510,y:75},{x:870,y:130}],[{x:135,y:95},{x:865,y:95}]],
      [[{x:145,y:105},{x:855,y:105}],[{x:850,y:80},{x:180,y:220}],[{x:160,y:85},{x:820,y:235}],[{x:500,y:70},{x:875,y:160}],[{x:125,y:115},{x:875,y:115}]],
      [[{x:135,y:90},{x:865,y:90}],[{x:500,y:65},{x:865,y:180}],[{x:120,y:170},{x:880,y:170}],[{x:180,y:75},{x:820,y:75},{x:500,y:155}],[{x:110,y:100},{x:890,y:100}]],
      [[{x:120,y:90},{x:880,y:190}],[{x:880,y:85},{x:120,y:210}],[{x:500,y:65},{x:130,y:155}],[{x:120,y:80},{x:880,y:80},{x:500,y:175}],[{x:105,y:145},{x:895,y:145}]],
      [[{x:120,y:90},{x:880,y:90}],[{x:500,y:60},{x:865,y:190}],[{x:135,y:170},{x:865,y:170},{x:500,y:65}],[{x:105,y:90},{x:895,y:90},{x:500,y:185}],[{x:110,y:125},{x:890,y:125},{x:500,y:60}]],
      [[{x:110,y:90},{x:890,y:90}],[{x:500,y:60},{x:110,y:185},{x:890,y:185}],[{x:100,y:90},{x:900,y:90},{x:500,y:190}],[{x:115,y:70},{x:885,y:70},{x:500,y:155}],[{x:95,y:105},{x:905,y:105},{x:500,y:55}]],
    ];
    const anchors=[],platforms=[],gates=[];
    if(chapter===0){
      if(slot===1||slot===4)anchors.push({x:640,y:330,r:43});
      if(slot===2)anchors.push({x:350,y:335,r:43},{x:650,y:335,r:43});
      if(slot===3)gates.push({x:500,y:275,r:48});
    }else if(chapter===1){
      const left=slot%2?250:330,right=slot%2?750:670;
      platforms.push({x:left-125,y:330,w:250,h:58},{x:right-125,y:500,w:250,h:58});
      if(slot>=2)anchors.push({x:500,y:285,r:42});
    }else if(chapter===2){
      anchors.push({x:300+slot*18,y:315,r:46},{x:700-slot*18,y:315,r:46});
      platforms.push({x:390,y:190+slot*20,w:220,h:58});
      if(slot>=3)gates.push({x:500,y:510,r:50});
    }else if(chapter===3){
      platforms.push({x:110+slot*35,y:255,w:230,h:58},{x:660-slot*35,y:430,w:230,h:58});
      anchors.push({x:500,y:330,r:44});
      if(slot===4)gates.push({x:350,y:500,r:48},{x:650,y:500,r:48});
    }else if(chapter===4){
      anchors.push({x:255,y:280+slot*28,r:45},{x:745,y:280+slot*28,r:45});
      gates.push({x:500,y:210+slot*22,r:48});
      if(slot>=2)platforms.push({x:375,y:480,w:250,h:58});
    }else{
      anchors.push({x:270,y:270,r:46},{x:730,y:270,r:46});
      platforms.push({x:365,y:170+slot*25,w:270,h:58},{x:365,y:500-slot*18,w:270,h:58});
      if(slot>=1)gates.push({x:500,y:340,r:50});
      if(slot>=3)anchors.push({x:500,y:105,r:40});
    }
    const solids=[
      ...anchors.map(item=>({...item,kind:"anchor"})),
      ...gates.map(item=>({...item,kind:"gate"})),
      ...platforms.map(item=>({...item,kind:"platform"})),
    ];
    return{
      dog:dogPositions[chapter][slot],hives:hiveSets[chapter][slot],anchors,platforms,gates,solids,theme,chapter,slot,
      duration:7.5+chapter*.7+slot*.18,
      speed:128+chapter*13+slot*5,
      interval:Math.max(.38,.82-chapter*.065-slot*.018),
      maxBees:9+chapter*3+slot*2,
      gust:chapter>=3?22+chapter*7+slot*3:0,
      flank:chapter*9+slot*3,
    };
  }
  function resetStage(){
    const spec=level(stageIndex);
    Object.assign(state,{mode:"idle",paused:false,modal:false,started:false,planElapsed:0,elapsed:0,duration:spec.duration,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:spec.interval,spawned:0,flash:0,wallMoves:0,wallApproachStartedAt:null,wallFirstMovedAt:null,maxGroupAttached:0,pathOpenedAt:null,navClock:0,nav:null,mover:null,result:null});
    $("resultPanel").hidden=true;$("leavePanel").hidden=true;$("pausePanel").hidden=true;$("battleLive").inert=false;$("battleLive").hidden=false;
    $("clearBtn").disabled=false;$("drawHint").hidden=false;
    $("stageLabel").textContent=fmt("stage",{n:stageIndex+1});$("objectiveText").textContent=fmt("objective",{n:spec.duration});
    announce("ready");updateHud();draw();
  }
  function startStage(index){
    stageIndex=Math.max(0,Math.min(29,index));selectedStage=stageIndex;showScreen("battle");resetStage();
  }
  function updateHud(){
    if(!$("timeValue"))return;
    $("timeValue").textContent=Math.max(0,state.duration-state.elapsed).toFixed(1);
    $("nectarValue").textContent=Math.round(state.nectar);
    $("waveFill").style.width=`${Math.min(100,state.elapsed/state.duration*100)}%`;
    const used=Math.round(100-state.nectar);$("lineReadout").textContent=fmt("lineStatus",{used,left:Math.round(state.nectar)});
  }

  function pointerPoint(event){
    const rect=canvas.getBoundingClientRect();
    return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};
  }
  function canDraw(){return screen==="battle"&&!state.paused&&!state.modal&&!state.result&&state.nectar>1}
  function beginWave(){
    if(state.started||state.result)return;
    state.started=true;state.mode="wave";state.spawnClock=level(stageIndex).interval;
    $("clearBtn").disabled=true;$("drawHint").hidden=true;announce("waveStarted");
  }
  canvas.addEventListener("pointerdown",event=>{
    if(!canDraw())return;canvas.setPointerCapture(event.pointerId);const point=pointerPoint(event);
    state.drawing={points:[point],flash:0,blockedFlash:0,moves:0};state.keyboard={...point};$("drawHint").hidden=true;event.preventDefault();
  });
  canvas.addEventListener("pointermove",event=>{
    if(!state.drawing||!canDraw())return;
    const samples=event.getCoalescedEvents?.()||[event];
    for(const sample of samples){
      const point=pointerPoint(sample),last=state.drawing.points.at(-1),distance=Math.hypot(point.x-last.x,point.y-last.y);
      if(distance<5)continue;
      const allowed=Math.min(distance,state.nectar*LINE_PIXELS_PER_NECTAR);if(allowed<=0)break;
      const ratio=allowed/distance,next={x:last.x+(point.x-last.x)*ratio,y:last.y+(point.y-last.y)*ratio};
      state.drawing.points.push(next);state.nectar=Math.max(0,state.nectar-allowed/LINE_PIXELS_PER_NECTAR);state.keyboard={...next};
    }
    updateHud();draw();event.preventDefault();
  });
  function finishStroke(){
    if(!state.drawing)return;
    if(state.drawing.points.length>1){
      refreshStrokeMobility(state.drawing,level(stageIndex));
      state.strokes.push(state.drawing);
    }
    state.drawing=null;
    if(!state.started&&state.strokes.length)beginWave();
  }
  canvas.addEventListener("pointerup",finishStroke);canvas.addEventListener("pointercancel",finishStroke);
  canvas.addEventListener("keydown",event=>{
    if(!canDraw())return;
    const step=event.shiftKey?40:18;
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){
      if(event.key==="ArrowLeft")state.keyboard.x-=step;if(event.key==="ArrowRight")state.keyboard.x+=step;if(event.key==="ArrowUp")state.keyboard.y-=step;if(event.key==="ArrowDown")state.keyboard.y+=step;
      state.keyboard.x=Math.max(30,Math.min(970,state.keyboard.x));state.keyboard.y=Math.max(30,Math.min(590,state.keyboard.y));draw();event.preventDefault();
    }
    if(event.key===" "||event.key==="Enter"){
      const x=state.keyboard.x,y=state.keyboard.y,length=Math.min(220,state.nectar*LINE_PIXELS_PER_NECTAR);
      state.nectar=Math.max(0,state.nectar-length/LINE_PIXELS_PER_NECTAR);
      const stroke={points:[{x,y:y-length/2},{x,y:y+length/2}],flash:0,blockedFlash:0,moves:0};
      refreshStrokeMobility(stroke,level(stageIndex));state.strokes.push(stroke);
      if(!state.started)beginWave();
      updateHud();draw();event.preventDefault();
    }
  });

  function nearestOnSegment(px,py,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-a.x)*dx+(py-a.y)*dy)/len));
    const x=a.x+dx*t,y=a.y+dy*t;return{x,y,d:Math.hypot(px-x,py-y),nx:-dy/Math.sqrt(len),ny:dx/Math.sqrt(len)};
  }
  function pointHitsSolid(point,solid,margin=0){
    if(solid.kind==="platform")return point.x>=solid.x-margin&&point.x<=solid.x+solid.w+margin&&point.y>=solid.y-margin&&point.y<=solid.y+solid.h+margin;
    return Math.hypot(point.x-solid.x,point.y-solid.y)<=solid.r+margin;
  }
  const MOVE_DIRECTIONS=Array.from({length:16},(_,index)=>({x:Math.cos(index*Math.PI/8),y:Math.sin(index*Math.PI/8)}));
  const PUSH_DIRECTIONS=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
  function sampledStrokePoints(points){
    const samples=[];
    for(let i=0;i<points.length;i++){
      samples.push(points[i]);
      if(!i)continue;
      const a=points[i-1],b=points[i],distance=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.ceil(distance/12);
      for(let step=1;step<steps;step++){
        const t=step/steps;
        samples.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
      }
    }
    return samples;
  }
  function solidPenetration(point,solid,margin){
    if(solid.kind==="platform"){
      const left=solid.x-margin,right=solid.x+solid.w+margin,top=solid.y-margin,bottom=solid.y+solid.h+margin;
      if(point.x<left||point.x>right||point.y<top||point.y>bottom)return 0;
      return Math.min(point.x-left,right-point.x,point.y-top,bottom-point.y)+.001;
    }
    return Math.max(0,solid.r+margin-Math.hypot(point.x-solid.x,point.y-solid.y));
  }
  function canTranslateStroke(stroke,dx,dy,spec){
    const margin=18,samples=sampledStrokePoints(stroke.points),epsilon=.05;
    return samples.every(point=>{
      const next={x:point.x+dx,y:point.y+dy};
      return spec.solids.every(solid=>solidPenetration(next,solid,margin)<=solidPenetration(point,solid,margin)+epsilon);
    });
  }
  function availableStrokeMoves(stroke,spec,distance=10){
    return MOVE_DIRECTIONS.filter(direction=>canTranslateStroke(stroke,direction.x*distance,direction.y*distance,spec));
  }
  function refreshStrokeMobility(stroke,spec){
    stroke.anchored=availableStrokeMoves(stroke,spec,10).length===0;
    return stroke.anchored;
  }
  function tryMoveStroke(stroke,dx,dy,spec){
    if(!canTranslateStroke(stroke,dx,dy,spec)){
      refreshStrokeMobility(stroke,spec);stroke.blockedFlash=.3;return false;
    }
    stroke.points=stroke.points.map(point=>({x:point.x+dx,y:point.y+dy}));
    if(state.wallMoves===0)state.wallFirstMovedAt=state.elapsed;
    stroke.moves=(stroke.moves||0)+Math.hypot(dx,dy);state.wallMoves+=Math.hypot(dx,dy);
    refreshStrokeMobility(stroke,spec);state.navClock=0;
    return true;
  }
  function resolveBeeSolid(bee,spec){
    const radius=18;
    for(const solid of spec.solids){
      if(solid.kind==="platform"){
        const left=solid.x-radius,right=solid.x+solid.w+radius,top=solid.y-radius,bottom=solid.y+solid.h+radius;
        if(bee.x<left||bee.x>right||bee.y<top||bee.y>bottom)continue;
        const exits=[{d:Math.abs(bee.x-left),x:left,y:bee.y,nx:-1,ny:0},{d:Math.abs(right-bee.x),x:right,y:bee.y,nx:1,ny:0},{d:Math.abs(bee.y-top),x:bee.x,y:top,nx:0,ny:-1},{d:Math.abs(bottom-bee.y),x:bee.x,y:bottom,nx:0,ny:1}].sort((a,b)=>a.d-b.d)[0];
        bee.x=exits.x;bee.y=exits.y;
        const dot=bee.vx*exits.nx+bee.vy*exits.ny;if(dot<0){bee.vx-=1.7*dot*exits.nx;bee.vy-=1.7*dot*exits.ny}
        bee.route*=-1;return true;
      }
      const dx=bee.x-solid.x,dy=bee.y-solid.y,distance=Math.hypot(dx,dy)||1,limit=solid.r+radius;
      if(distance>=limit)continue;
      const nx=dx/distance,ny=dy/distance;bee.x=solid.x+nx*limit;bee.y=solid.y+ny*limit;
      const dot=bee.vx*nx+bee.vy*ny;if(dot<0){bee.vx-=1.7*dot*nx;bee.vy-=1.7*dot*ny}
      bee.route*=-1;return true;
    }
    return false;
  }
  function obstacleAvoidance(bee,spec){
    let ax=0,ay=0;
    for(const solid of spec.solids){
      const cx=solid.kind==="platform"?solid.x+solid.w/2:solid.x,cy=solid.kind==="platform"?solid.y+solid.h/2:solid.y;
      const dx=cx-bee.x,dy=cy-bee.y,distance=Math.hypot(dx,dy)||1;
      const reach=solid.kind==="platform"?Math.max(solid.w,solid.h)*.65+80:solid.r+95;
      if(distance>reach)continue;
      const forward=(dx*bee.vx+dy*bee.vy)/(distance*(Math.hypot(bee.vx,bee.vy)||1));
      if(forward<.18)continue;
      const strength=(1-distance/reach)*spec.speed*.9;
      ax+=-dy/distance*strength*bee.route;ay+=dx/distance*strength*bee.route;
    }
    return{ax,ay};
  }
  function pointHitsStroke(point,stroke,margin=22){
    for(let index=1;index<stroke.points.length;index++){
      if(nearestOnSegment(point.x,point.y,stroke.points[index-1],stroke.points[index]).d<=margin)return true;
    }
    return false;
  }
  function buildNavigationField(spec,goalPoint=spec.dog,goalPredicate=null){
    const cell=20,cols=50,rows=31,total=cols*rows,blocked=new Uint8Array(total),distance=new Int16Array(total);
    distance.fill(-1);
    const strokes=state.strokes;
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const x=col*cell+cell/2,y=row*cell+cell/2,index=row*cols+col;
      const solidBlocked=spec.solids.some(solid=>pointHitsSolid({x,y},solid,19));
      const lineBlocked=strokes.some(stroke=>pointHitsStroke({x,y},stroke,22));
      blocked[index]=solidBlocked||lineBlocked?1:0;
    }
    const queue=new Int16Array(total);let head=0,tail=0,reachable=0;
    if(goalPredicate){
      for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
        const index=row*cols+col,point={x:col*cell+cell/2,y:row*cell+cell/2};
        if(blocked[index]||!goalPredicate(point))continue;
        queue[tail++]=index;distance[index]=0;
      }
    }else{
      const goal=goalPoint||spec.dog;
      let goalCol=Math.max(0,Math.min(cols-1,Math.floor(goal.x/cell))),goalRow=Math.max(0,Math.min(rows-1,Math.floor(goal.y/cell)));
      if(blocked[goalRow*cols+goalCol]){
        outer:for(let radius=1;radius<5;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
          const col=goalCol+dx,row=goalRow+dy;if(col<0||col>=cols||row<0||row>=rows||blocked[row*cols+col])continue;
          goalCol=col;goalRow=row;break outer;
        }
      }
      const goalIndex=goalRow*cols+goalCol;queue[tail++]=goalIndex;distance[goalIndex]=0;
    }
    while(head<tail){
      const index=queue[head++],col=index%cols,row=Math.floor(index/cols);reachable++;
      for(const direction of MOVE_DIRECTIONS.filter((_,i)=>i%2===0)){
        const dx=Math.round(direction.x),dy=Math.round(direction.y),nextCol=col+dx,nextRow=row+dy;
        if(nextCol<0||nextCol>=cols||nextRow<0||nextRow>=rows)continue;
        const next=nextRow*cols+nextCol;if(blocked[next]||distance[next]>=0)continue;
        if(dx&&dy&&(blocked[row*cols+nextCol]||blocked[nextRow*cols+col]))continue;
        distance[next]=distance[index]+1;queue[tail++]=next;
      }
    }
    return{cell,cols,rows,blocked,distance,reachable};
  }
  function navigationDirection(field,x,y){
    const col=Math.max(0,Math.min(field.cols-1,Math.floor(x/field.cell))),row=Math.max(0,Math.min(field.rows-1,Math.floor(y/field.cell)));
    let best=null,bestDistance=Infinity;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nextCol=col+dx,nextRow=row+dy;if(nextCol<0||nextCol>=field.cols||nextRow<0||nextRow>=field.rows)continue;
      const index=nextRow*field.cols+nextCol,value=field.distance[index];if(value<0||value>=bestDistance)continue;
      if(dx&&dy&&(field.blocked[row*field.cols+nextCol]||field.blocked[nextRow*field.cols+col]))continue;
      bestDistance=value;best={x:nextCol*field.cell+field.cell/2,y:nextRow*field.cell+field.cell/2,distance:value};
    }
    return best;
  }
  function closestStrokePoint(stroke,point){
    let best={x:stroke.points[0].x,y:stroke.points[0].y,d:Infinity};
    for(let index=1;index<stroke.points.length;index++){
      const candidate=nearestOnSegment(point.x,point.y,stroke.points[index-1],stroke.points[index]);
      if(candidate.d<best.d)best=candidate;
    }
    return best;
  }
  function segmentIntersection(a,b,c,d){
    const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,denominator=rx*sy-ry*sx;
    if(Math.abs(denominator)<.0001)return null;
    const qx=c.x-a.x,qy=c.y-a.y,t=(qx*sy-qy*sx)/denominator,u=(qx*ry-qy*rx)/denominator;
    if(t<0||t>1||u<0||u>1)return null;
    return{x:a.x+t*rx,y:a.y+t*ry};
  }
  function chooseWallMover(spec,bees){
    const center={x:bees.reduce((sum,bee)=>sum+bee.x,0)/bees.length,y:bees.reduce((sum,bee)=>sum+bee.y,0)/bees.length};
    const candidates=state.strokes.filter(stroke=>PUSH_DIRECTIONS.some(direction=>canTranslateStroke(stroke,direction.x*10,direction.y*10,spec))).sort((a,b)=>closestStrokePoint(a,center).d-closestStrokePoint(b,center).d);
    const stroke=candidates[0];if(!stroke)return null;
    const directionIndex=PUSH_DIRECTIONS.findIndex(direction=>canTranslateStroke(stroke,direction.x*10,direction.y*10,spec));
    return{stroke,directionIndex,phase:"gather",cohort:[],maxAttached:0};
  }
  function collideLine(bee){
    if(bee.cooldown>0)return false;
    const spec=level(stageIndex);
    for(let s=state.strokes.length-1;s>=0;s--){
      const stroke=state.strokes[s];
      for(let i=1;i<stroke.points.length;i++){
        const start={x:Number.isFinite(bee.prevX)?bee.prevX:bee.x,y:Number.isFinite(bee.prevY)?bee.prevY:bee.y},end={x:bee.x,y:bee.y};
        const hit=nearestOnSegment(end.x,end.y,stroke.points[i-1],stroke.points[i]),crossing=segmentIntersection(start,end,stroke.points[i-1],stroke.points[i]);
        if(hit.d>19&&!crossing)continue;
        const contact=crossing||hit,previousHit=nearestOnSegment(start.x,start.y,stroke.points[i-1],stroke.points[i]);
        const side=previousHit.nx*(start.x-previousHit.x)+previousHit.ny*(start.y-previousHit.y);
        const sign=Math.abs(side)>.001?(side>0?1:-1):(bee.vx*hit.nx+bee.vy*hit.ny>0?-1:1);
        const nx=hit.nx*sign,ny=hit.ny*sign,dot=bee.vx*nx+bee.vy*ny;
        if(dot<0){bee.vx-=1.9*dot*nx;bee.vy-=1.9*dot*ny}
        bee.vx+=nx*42;bee.vy+=ny*42;
        bee.x=contact.x+nx*22;bee.y=contact.y+ny*22;bee.cooldown=.14;bee.route*=-1;
        bee.bounced=true;stroke.flash=.12;
        return true;
      }
    }
    return false;
  }
  function spawnBee(){
    const spec=level(stageIndex),hive=spec.hives[state.spawned%spec.hives.length],angle=(state.spawned%5-2)*.08;
    const dx=spec.dog.x-hive.x,dy=spec.dog.y-hive.y,length=Math.hypot(dx,dy)||1;
    state.bees.push({x:hive.x,y:hive.y+35,vx:dx/length*spec.speed+angle*spec.speed,vy:dy/length*spec.speed,life:0,cooldown:0,bounced:false,phase:state.spawned*.73,route:state.spawned%2?1:-1,intent:"attack"});
    state.spawned++;
  }
  function update(dt){
    if(state.paused||state.modal||state.result||!state.started)return;
    if(state.mode!=="wave")return;
    const spec=level(stageIndex);state.elapsed+=dt;state.spawnClock+=dt;state.nectar=Math.min(100,state.nectar+dt*1.35);
    if(state.spawnClock>=spec.interval&&state.spawned<spec.maxBees){state.spawnClock=0;spawnBee()}
    state.navClock-=dt;
    if(!state.nav||state.navClock<=0){state.nav=buildNavigationField(spec);state.navClock=.12}
    const routes=new Map(),blockedBees=[];
    const dogBlocked=state.strokes.some(stroke=>pointHitsStroke(spec.dog,stroke,28));
    for(const bee of state.bees){
      const route=dogBlocked?null:navigationDirection(state.nav,bee.x,bee.y);routes.set(bee,route);
      if(!route)blockedBees.push(bee);
    }
    if(blockedBees.length){
      if(!state.mover||!state.strokes.includes(state.mover.stroke)||!PUSH_DIRECTIONS.some(direction=>canTranslateStroke(state.mover.stroke,direction.x*8,direction.y*8,spec))){
        state.bees.forEach(bee=>{bee.attachedStroke=null});
        state.mover=chooseWallMover(spec,blockedBees);
      }
    }else{
      state.bees.forEach(bee=>{bee.attachedStroke=null});
      state.mover=null;
    }
    const wallTargets=new Map(),wallApproaches=new Map();
    if(state.mover){
      if(state.mover.phase==="gather"&&!state.mover.cohort.length)state.mover.cohort=[...blockedBees];
      const participants=blockedBees;
      const gatherField=buildNavigationField(spec,null,point=>{
        const distance=closestStrokePoint(state.mover.stroke,point).d;
        return distance>=27&&distance<=54;
      });
      participants.forEach(bee=>{
        const contact=closestStrokePoint(state.mover.stroke,bee),side=(bee.x-contact.x)*contact.nx+(bee.y-contact.y)*contact.ny>=0?1:-1;
        const slot=Math.sin(bee.phase*2.7)*14;
        wallTargets.set(bee,{x:contact.x+contact.nx*22*side-contact.ny*slot,y:contact.y+contact.ny*22*side+contact.nx*slot});
        wallApproaches.set(bee,navigationDirection(gatherField,bee.x,bee.y));
      });
    }
    for(const bee of state.bees){
      bee.life+=dt;bee.cooldown=Math.max(0,bee.cooldown-dt);
      const route=routes.get(bee),navigationTarget=route?.distance===0?spec.dog:route,wallTarget=!route?wallTargets.get(bee):null,wallApproach=wallApproaches.get(bee);
      const target=navigationTarget||(wallApproach?.distance===0?wallTarget:wallApproach)||wallTarget||{x:bee.x,y:bee.y};
      bee.intent=route?"attack":wallTarget?"moveWall":"wait";
      if(bee.intent==="moveWall"&&state.wallApproachStartedAt===null)state.wallApproachStartedAt=state.elapsed;
      if(route)bee.attachedStroke=null;
      const dx=target.x-bee.x,dy=target.y-bee.y,length=Math.hypot(dx,dy)||1;
      const wallDistance=wallTarget?Math.hypot(wallTarget.x-bee.x,wallTarget.y-bee.y):Infinity;
      if(wallTarget&&wallDistance<=38){
        bee.x=wallTarget.x;bee.y=wallTarget.y;bee.prevX=bee.x;bee.prevY=bee.y;bee.vx=0;bee.vy=0;bee.attachedStroke=state.mover.stroke;
        continue;
      }
      const sideX=-dy/length,sideY=dx/length,flank=route?Math.sin(bee.life*1.8+bee.phase)*Math.min(8,spec.flank*.18):0;
      const avoid=obstacleAvoidance(bee,spec),steer=route?(bee.bounced?4.2:5.4):7;
      const desiredSpeed=route?spec.speed*1.55:spec.speed*1.75;
      const desiredX=dx/length*desiredSpeed+sideX*flank,desiredY=dy/length*desiredSpeed+sideY*flank;
      bee.vx+=(desiredX-bee.vx)*dt*steer+avoid.ax*dt;bee.vy+=(desiredY-bee.vy)*dt*steer+avoid.ay*dt;
      if(route)bee.vx+=Math.sin(bee.life*3+bee.phase)*spec.gust*dt*.2;
      bee.prevX=bee.x;bee.prevY=bee.y;bee.x+=bee.vx*dt;bee.y+=bee.vy*dt;resolveBeeSolid(bee,spec);collideLine(bee);
      if(Math.hypot(bee.x-spec.dog.x,bee.y-spec.dog.y)<48){finish(false);return}
    }
    if(state.mover&&state.mover.phase==="gather"){
      const participants=state.mover.cohort.filter(bee=>state.bees.includes(bee));
      const attached=participants.filter(bee=>bee.attachedStroke===state.mover.stroke);
      state.mover.maxAttached=Math.max(state.mover.maxAttached,attached.length);state.maxGroupAttached=Math.max(state.maxGroupAttached,attached.length);
      if(attached.length>0){
        state.mover.phase="push";state.mover.cohort=[...attached];
      }
    }
    if(state.mover&&state.mover.phase==="push"){
      for(const bee of blockedBees)if(bee.attachedStroke===state.mover.stroke&&!state.mover.cohort.includes(bee))state.mover.cohort.push(bee);
      state.maxGroupAttached=Math.max(state.maxGroupAttached,state.mover.cohort.length);
      const direction=PUSH_DIRECTIONS[state.mover.directionIndex],attached=state.mover.cohort.filter(bee=>bee.attachedStroke===state.mover.stroke),distance=(80+attached.length*26)*dt;
      if(tryMoveStroke(state.mover.stroke,direction.x*distance,direction.y*distance,spec)){
        attached.forEach(bee=>{bee.x+=direction.x*distance;bee.y+=direction.y*distance;bee.prevX=bee.x;bee.prevY=bee.y});
        state.mover.stroke.flash=.18;state.flash=.035;announce("barrierMoved");
        state.nav=buildNavigationField(spec);state.navClock=.12;
        const dogClear=!pointHitsStroke(spec.dog,state.mover.stroke,28);
        if(dogClear&&blockedBees.every(bee=>navigationDirection(state.nav,bee.x,bee.y))){
          state.pathOpenedAt=state.elapsed;state.bees.forEach(bee=>{bee.attachedStroke=null});state.mover=null;announce("pathFound");
        }
      }else{
        let found=false;
        for(let attempt=1;attempt<=PUSH_DIRECTIONS.length;attempt++){
          const index=(state.mover.directionIndex+attempt)%PUSH_DIRECTIONS.length,next=PUSH_DIRECTIONS[index];
          if(canTranslateStroke(state.mover.stroke,next.x*8,next.y*8,spec)){state.mover.directionIndex=index;found=true;break}
        }
        if(!found){refreshStrokeMobility(state.mover.stroke,spec);state.bees.forEach(bee=>{bee.attachedStroke=null});announce("barrierHeld");state.mover=null}
      }
    }
    state.bees=state.bees.filter(bee=>bee.life<18&&bee.x>-80&&bee.x<1080&&bee.y>-80&&bee.y<700);
    state.strokes.forEach(stroke=>{stroke.flash=Math.max(0,stroke.flash-dt);stroke.blockedFlash=Math.max(0,(stroke.blockedFlash||0)-dt)});
    state.flash=Math.max(0,state.flash-dt);
    if(state.nectar<16)announce("lowNectar");
    if(state.elapsed>=state.duration){finish(true);return}
    updateHud();
  }
  function scoreStars(){
    const used=100-state.nectar;
    if(used<=45)return 3;if(used<=72)return 2;return 1;
  }
  function finish(won){
    if(state.result)return;state.result={won,stars:won?scoreStars():0};state.mode="result";
    const previous=save.stars[stageIndex]||0;let isBest=false;
    if(won){
      save.cleared[stageIndex]=true;save.unlocked=Math.max(save.unlocked,Math.min(30,stageIndex+2));
      if(state.result.stars>previous){save.stars[stageIndex]=state.result.stars;isBest=true}persist();updateMainProgress();
    }
    $("battleLive").inert=true;$("battleLive").hidden=true;$("resultPanel").hidden=false;
    $("resultTitle").textContent=fmt(won?"winTitle":"failTitle");
    $("resultStars").textContent=won?"★".repeat(state.result.stars)+"☆".repeat(3-state.result.stars):"☆☆☆";
    $("resultText").textContent=fmt(won?"winText":"failText",{stage:stageIndex+1,nectar:Math.round(state.nectar)});
    $("bestText").textContent=won?(isBest?fmt("newBest"):fmt("best",{stars:Math.max(previous,state.result.stars)})):"";
    $("nextBtn").disabled=!won||stageIndex>=29;$("nextBtn").setAttribute("aria-disabled",String($("nextBtn").disabled));
    announce(won?"protected":"touched");requestAnimationFrame(()=>$("resultStagesBtn").focus());
  }
  function loop(now){
    const dt=Math.min(.034,Math.max(0,(now-state.last)/1000));state.last=now;update(dt);draw();raf=requestAnimationFrame(loop);
  }

  const SPRITE_CROPS=[
    {x:70,y:115,w:420,h:330},{x:123,y:146,w:266,h:261},{x:20,y:22,w:475,h:455},
    {x:62,y:35,w:395,h:465},{x:54,y:28,w:410,h:465},{x:8,y:76,w:500,h:390},
  ];
  function drawSprite(cell,x,y,w,h,flip=false){
    if(!atlas.complete||!atlas.naturalWidth)return;
    const crop=SPRITE_CROPS[cell],sx=(cell%3)*512+crop.x,sy=Math.floor(cell/3)*512+crop.y;
    const rect=canvas.getBoundingClientRect(),physicalX=Math.max(.0001,rect.width/1000),physicalY=Math.max(.0001,rect.height/620),uniform=Math.sqrt(physicalX*physicalY);
    const physicalScale=Math.min((w*uniform)/crop.w,(h*uniform)/crop.h);
    const dw=crop.w*physicalScale/physicalX,dh=crop.h*physicalScale/physicalY,dx=x+(w-dw)/2,dy=y+(h-dh)/2;
    ctx.save();
    if(flip){ctx.translate(dx+dw,dy);ctx.scale(-1,1);ctx.drawImage(atlas,sx,sy,crop.w,crop.h,0,0,dw,dh)}
    else ctx.drawImage(atlas,sx,sy,crop.w,crop.h,dx,dy,dw,dh);
    ctx.restore();
  }
  function drawBee(bee){
    if(!atlas.complete||!atlas.naturalWidth)return;
    const crop=SPRITE_CROPS[1],centroid={x:133.44,y:137.67},sx=512+crop.x,sy=crop.y,rect=canvas.getBoundingClientRect();
    const physicalX=Math.max(.0001,rect.width/1000),physicalY=Math.max(.0001,rect.height/620),uniform=Math.sqrt(physicalX*physicalY);
    const physicalWidth=58*uniform,physicalHeight=physicalWidth*crop.h/crop.w,dw=physicalWidth/physicalX,dh=physicalHeight/physicalY;
    const facing=bee.vx<0?-1:1,tilt=Math.max(-.58,Math.min(.58,Math.atan2(bee.vy,Math.abs(bee.vx)||1))),cos=Math.cos(tilt),sin=Math.sin(tilt);
    ctx.save();ctx.translate(bee.x,bee.y);
    ctx.transform(cos*facing,sin*facing*physicalX/physicalY,-sin*physicalY/physicalX,cos,0,0);
    ctx.drawImage(atlas,sx,sy,crop.w,crop.h,-centroid.x/crop.w*dw,-centroid.y/crop.h*dh,dw,dh);
    ctx.restore();
  }
  function drawTerrain(spec){
    ctx.save();ctx.globalCompositeOperation="soft-light";ctx.globalAlpha=.12;ctx.fillStyle=spec.theme.sky;ctx.fillRect(0,0,1000,620);ctx.restore();
  }
  function draw(){
    const spec=level(stageIndex);ctx.clearRect(0,0,1000,620);
    const sceneBackground=themeBackgrounds[spec.chapter];
    if(sceneBackground.complete&&sceneBackground.naturalWidth){
      const rect=canvas.getBoundingClientRect(),targetAspect=rect.width/Math.max(1,rect.height),sourceAspect=sceneBackground.naturalWidth/sceneBackground.naturalHeight;
      let sx=0,sy=0,sw=sceneBackground.naturalWidth,sh=sceneBackground.naturalHeight;
      if(sourceAspect>targetAspect){sw=sh*targetAspect;sx=(sceneBackground.naturalWidth-sw)/2}
      else{sh=sw/targetAspect;sy=(sceneBackground.naturalHeight-sh)/2}
      ctx.drawImage(sceneBackground,sx,sy,sw,sh,0,0,1000,620);
    }else{ctx.fillStyle="#3a8b59";ctx.fillRect(0,0,1000,620)}
    drawTerrain(spec);ctx.fillStyle="rgba(7,39,29,.12)";ctx.fillRect(0,0,1000,620);
    for(const platform of spec.platforms)drawSprite(5,platform.x,platform.y-72,platform.w,platform.h+110);
    for(const anchor of spec.anchors)drawSprite(3,anchor.x-48,anchor.y-48,96,96);
    for(const gate of spec.gates)drawSprite(4,gate.x-52,gate.y-58,104,116);
    for(const hive of spec.hives)drawSprite(2,hive.x-75,hive.y-65,150,150);
    drawSprite(0,spec.dog.x-82,spec.dog.y-62,164,124);
    for(const bee of state.bees)drawBee(bee);
    const strokes=state.drawing?[...state.strokes,state.drawing]:state.strokes;
    ctx.lineCap="round";ctx.lineJoin="round";
    for(const stroke of strokes){
      if(stroke.points.length<2)continue;const moved=stroke.flash>0,blocked=stroke.anchored||stroke.blockedFlash>0;
      ctx.save();ctx.beginPath();stroke.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
      ctx.strokeStyle=blocked?"#ffe47a":moved?"#b8fff3":"#6effdf";ctx.lineWidth=16;ctx.shadowColor=blocked?"#ffc83b":"#36f5cf";ctx.shadowBlur=moved?24:18;ctx.globalAlpha=.94;ctx.stroke();
      ctx.strokeStyle="#ecfff8";ctx.lineWidth=4;ctx.globalAlpha=.85;ctx.stroke();ctx.restore();
    }
    if(document.activeElement===canvas){
      ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(state.keyboard.x,state.keyboard.y,19,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(state.flash>0){ctx.fillStyle=`rgba(91,255,226,${state.flash})`;ctx.fillRect(0,0,1000,620)}
  }

  function openModal(panel,focusId){
    state.modal=true;state.paused=true;$("battleLive").inert=true;panel.hidden=false;requestAnimationFrame(()=>$(focusId)?.focus());
  }
  function closeModal(panel,restoreId){
    panel.hidden=true;state.modal=false;state.paused=false;$("battleLive").inert=false;requestAnimationFrame(()=>$(restoreId)?.focus());
  }
  $("startBtn").addEventListener("click",()=>{
    selectedStage=Math.min(29,save.unlocked-1);showScreen("stage");updateStageChapter();
    if(!safeGet(TUTORIAL_KEY)){tutorialReturnFocus=$("startBtn");$("tutorialPanel").hidden=false;requestAnimationFrame(()=>$("tutorialStartBtn").focus())}
  });
  $("stageBackBtn").addEventListener("click",()=>{showScreen("main");requestAnimationFrame(()=>$("startBtn").focus())});
  $("battleBackBtn").addEventListener("click",()=>openModal($("leavePanel"),"leaveContinueBtn"));
  $("leaveContinueBtn").addEventListener("click",()=>closeModal($("leavePanel"),"battleBackBtn"));
  $("leaveStagesBtn").addEventListener("click",()=>{state.modal=false;state.paused=false;showScreen("stage");requestAnimationFrame(centerSelected)});
  $("pauseBtn").addEventListener("click",()=>openModal($("pausePanel"),"resumeBtn"));
  $("resumeBtn").addEventListener("click",()=>closeModal($("pausePanel"),"pauseBtn"));
  $("pauseHelpBtn").addEventListener("click",()=>{$("pausePanel").hidden=true;tutorialReturnFocus=$("pauseHelpBtn");$("tutorialPanel").hidden=false;requestAnimationFrame(()=>$("tutorialStartBtn").focus())});
  $("clearBtn").addEventListener("click",()=>{if(state.started)return;state.strokes=[];state.nectar=100;announce("ready");updateHud();draw()});
  $("restartBtn").addEventListener("click",resetStage);
  $("resultStagesBtn").addEventListener("click",()=>{selectedStage=Math.min(29,save.unlocked-1);showScreen("stage");requestAnimationFrame(centerSelected)});
  $("nextBtn").addEventListener("click",()=>{if(!$("nextBtn").disabled)startStage(stageIndex+1)});
  $("retryBtn").addEventListener("click",resetStage);
  function closeTutorial(){
    $("tutorialPanel").hidden=true;safeSet(TUTORIAL_KEY,"1");
    if(screen==="stage"){requestAnimationFrame(centerSelected)}else{state.paused=false;state.modal=false;$("battleLive").inert=false}
    tutorialReturnFocus?.focus?.();tutorialReturnFocus=null;
  }
  $("tutorialStartBtn").addEventListener("click",()=>{const fromStage=screen==="stage";closeTutorial();if(fromStage)startStage(selectedStage)});
  $("tutorialCloseBtn").addEventListener("click",closeTutorial);
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(!$("tutorialPanel").hidden){closeTutorial();return}
    if(!$("leavePanel").hidden){closeModal($("leavePanel"),"battleBackBtn");return}
    if(!$("pausePanel").hidden){closeModal($("pausePanel"),"pauseBtn");return}
  });
  function suspendForeground(){
    if(screen==="battle"&&!state.result&&!state.modal)openModal($("pausePanel"),"resumeBtn");
  }
  window.addEventListener("blur",suspendForeground);
  window.addEventListener("pagehide",suspendForeground);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendForeground()});

  function loadAssets(){
    const sources=[[atlas,"../../assets/animal-honey-shield-sprites.webp"],...themeBackgrounds.map((image,index)=>[image,themeBackgroundSources[index]])];
    let settled=0;const done=()=>{settled++;$("loadingFill").style.width=`${settled/sources.length*100}%`;if(settled===sources.length)setTimeout(()=>{$("loadingPanel").hidden=true;applyLocale();draw()},120)};
    for(const [image,src] of sources){image.onload=done;image.onerror=done;image.src=src}
  }
  window.__animalHoneyShieldSmoke={
    startStage,resetStage,finish,snapshot:()=>({
      screen,stage:stageIndex+1,mode:state.mode,elapsed:state.elapsed,nectar:state.nectar,
      strokes:state.strokes.length,
      strokeLengths:state.strokes.map(stroke=>stroke.points.slice(1).reduce((sum,point,index)=>sum+Math.hypot(point.x-stroke.points[index].x,point.y-stroke.points[index].y),0)),
      bees:state.bees.length,beeIntents:state.bees.map(bee=>bee.intent),attachedBees:state.bees.filter(bee=>bee.attachedStroke).length,
      wallMoves:state.wallMoves,wallApproachStartedAt:state.wallApproachStartedAt,wallFirstMovedAt:state.wallFirstMovedAt,maxGroupAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,result:state.result,save:structuredClone(save)
    }),
    drawBarrier(x=650){state.strokes.push({points:[{x,y:190},{x,y:560}],flash:0,blockedFlash:0,moves:0,anchored:false});state.nectar=Math.max(0,state.nectar-52);beginWave();updateHud();draw()},
    protect(){state.strokes=[{points:[{x:300,y:315},{x:360,y:210},{x:640,y:210},{x:700,y:315},{x:680,y:560},{x:320,y:560},{x:300,y:315}],flash:0,blockedFlash:0,moves:0,anchored:true}];beginWave();state.nectar=40},
    advance(seconds){for(let t=0;t<seconds&&!state.result;t+=.02)update(.02);draw();return this.snapshot?.()},
    noDrawProbe(){startStage(0);this.advance(7);return this.snapshot()},
    wallProbe(){
      const free={points:[{x:710,y:210},{x:710,y:470}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const freeBefore=free.points[0].x,freeMoved=tryMoveStroke(free,-20,0,level(0));
      const blocked={points:[{x:710,y:335},{x:710,y:420}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const blockedBefore=blocked.points[0].x,blockedMoved=tryMoveStroke(blocked,-50,0,level(2));
      const edge={points:[{x:4,y:220},{x:180,y:220}],flash:0,blockedFlash:0,moves:0,anchored:false};
      const edgeCanEscape=availableStrokeMoves(edge,{solids:[]},12).length>0;
      return{freeMoved,freeDistance:Math.abs(free.points[0].x-freeBefore),blocked:!blockedMoved,blockedDistance:Math.abs(blocked.points[0].x-blockedBefore),edgeCanEscape};
    },
    durabilityProbe(){
      startStage(0);
      const stroke={points:[{x:700,y:190},{x:700,y:560}],flash:0,blockedFlash:0,moves:0,anchored:true};
      state.strokes=[stroke];
      for(let i=0;i<40;i++){
        const bee={x:700,y:310,vx:-160,vy:0,cooldown:0,bounced:false,route:1};
        collideLine(bee);
      }
      return{strokes:state.strokes.length,points:state.strokes[0]?.points.length||0,hasHealth:Object.hasOwn(stroke,"health"),anchored:stroke.anchored};
    },
    gapProbe(){
      startStage(0);
      state.strokes=[
        {points:[{x:700,y:20},{x:700,y:225}],flash:0,blockedFlash:0,moves:0,anchored:false},
        {points:[{x:700,y:385},{x:700,y:600}],flash:0,blockedFlash:0,moves:0,anchored:false},
      ];
      state.strokes.forEach(stroke=>refreshStrokeMobility(stroke,level(0)));beginWave();spawnBee();state.spawned=level(0).maxBees;
      const initialRoute=!!navigationDirection(buildNavigationField(level(0)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<1.5&&!state.result;time+=.02)update(.02);
      return{initialRoute,wallMoves:state.wallMoves,result:state.result,bee:{x:state.bees[0]?.x,y:state.bees[0]?.y}};
    },
    plannerProbe(){
      startStage(0);state.duration=20;
      const stroke={points:[{x:350,y:375},{x:650,y:375},{x:650,y:600},{x:350,y:600},{x:350,y:375}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(0));beginWave();spawnBee();state.spawned=level(0).maxBees;
      const initialRoute=!!navigationDirection(buildNavigationField(level(0)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<12&&!state.result;time+=.02)update(.02);
      const field=buildNavigationField(level(0)),routeNow=state.bees[0]?!!navigationDirection(field,state.bees[0].x,state.bees[0].y):false;
      return{initialRoute,wallMoves:state.wallMoves,routeNow,moverStopped:state.mover===null,intent:state.bees[0]?.intent,result:state.result,anchored:stroke.anchored};
    },
    collectiveProbe(){
      startStage(0);state.duration=20;
      const stroke={points:[{x:350,y:375},{x:650,y:375},{x:650,y:600},{x:350,y:600},{x:350,y:375}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(0));beginWave();
      for(let count=0;count<4;count++)spawnBee();
      state.spawned=level(0).maxBees;
      const initialRoute=state.bees.some(bee=>navigationDirection(buildNavigationField(level(0)),bee.x,bee.y));
      for(let time=0;time<14&&!state.result;time+=.02)update(.02);
      const field=buildNavigationField(level(0)),routeNow=state.bees.some(bee=>navigationDirection(field,bee.x,bee.y));
      return{participants:4,initialRoute,wallMoves:state.wallMoves,maxAttached:state.maxGroupAttached,routeNow,moverStopped:state.mover===null,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stage11ReportProbe(){
      startStage(10);state.duration=20;
      const stroke={points:[{x:5,y:223},{x:160,y:223},{x:250,y:192},{x:360,y:130},{x:470,y:93},{x:580,y:87},{x:690,y:112},{x:730,y:167},{x:810,y:205},{x:940,y:223},{x:995,y:205}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(10));beginWave();
      for(let count=0;count<6;count++)spawnBee();
      state.spawned=level(10).maxBees;
      const initialRoutes=state.bees.filter(bee=>navigationDirection(buildNavigationField(level(10)),bee.x,bee.y)).length;
      for(let time=0;time<14&&!state.result;time+=.02)update(.02);
      return{participants:6,initialRoutes,wallMoves:state.wallMoves,maxAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,moverStopped:state.mover===null,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stage12ReportProbe(){
      startStage(11);state.duration=12;
      const stroke={points:[{x:160,y:614},{x:170,y:521},{x:220,y:440},{x:290,y:397},{x:400,y:378},{x:550,y:378},{x:630,y:415},{x:670,y:484},{x:670,y:614}],flash:0,blockedFlash:0,moves:0,anchored:false};
      state.strokes=[stroke];refreshStrokeMobility(stroke,level(11));beginWave();spawnBee();state.spawned=level(11).maxBees;
      const initialRoute=!!navigationDirection(buildNavigationField(level(11)),state.bees[0].x,state.bees[0].y);
      for(let time=0;time<6&&!state.result;time+=.02)update(.02);
      return{participants:1,initialRoute,approachStartedAt:state.wallApproachStartedAt,wallMoves:state.wallMoves,firstMoveAt:state.wallFirstMovedAt,maxAttached:state.maxGroupAttached,pathOpenedAt:state.pathOpenedAt,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};
    },
    stallSweepProbe(){
      const records=[],failures=[];
      for(const index of [0,5,10,11,15,20,25,29]){
        startStage(index);state.duration=8;
        const spec=level(index),left=Math.max(20,spec.dog.x-175),right=Math.min(980,spec.dog.x+175),top=Math.max(80,spec.dog.y-115);
        const stroke={points:[{x:left,y:615},{x:left,y:top},{x:right,y:top},{x:right,y:615}],flash:0,blockedFlash:0,moves:0,anchored:false};
        state.strokes=[stroke];refreshStrokeMobility(stroke,spec);beginWave();spawnBee();state.spawned=spec.maxBees;
        const initialRoute=!!navigationDirection(buildNavigationField(spec),state.bees[0].x,state.bees[0].y),movable=PUSH_DIRECTIONS.some(direction=>canTranslateStroke(stroke,direction.x*8,direction.y*8,spec));
        update(.02);const initialIntent=state.bees[0]?.intent;
        for(let time=0;time<5&&!state.result;time+=.02)update(.02);
        const record={stage:index+1,initialRoute,movable,initialIntent,wallMoves:state.wallMoves,intents:[...new Set(state.bees.map(bee=>bee.intent))],result:state.result};records.push(record);
        if(!initialRoute&&movable&&(initialIntent==="wait"||state.wallMoves===0&&!state.result))failures.push(record);
      }
      return{records,failures};
    },
    beeSpriteMetrics(){
      const crop=SPRITE_CROPS[1],centroid={x:133.44,y:137.67},rect=canvas.getBoundingClientRect(),physicalX=rect.width/1000,physicalY=rect.height/620,uniform=Math.sqrt(physicalX*physicalY);
      const physicalWidth=58*uniform,physicalHeight=physicalWidth*crop.h/crop.w;
      const drawOrigin={x:-centroid.x/crop.w*physicalWidth,y:-centroid.y/crop.h*physicalHeight};
      return{sourceRatio:crop.w/crop.h,physicalRatio:physicalWidth/physicalHeight,alphaCentroid:[centroid.x,centroid.y],centerOffset:[drawOrigin.x+centroid.x/crop.w*physicalWidth,drawOrigin.y+centroid.y/crop.h*physicalHeight]};
    },
    crossingProbe(){
      startStage(0);
      const stroke={points:[{x:500,y:100},{x:500,y:560}],flash:0,blockedFlash:0,moves:0,anchored:true};
      state.strokes=[stroke];
      const bee={prevX:545,prevY:310,x:482,y:310,vx:-240,vy:0,cooldown:0,bounced:false,route:1};
      const collided=collideLine(bee);
      return{collided,x:bee.x,y:bee.y,vx:bee.vx,sameSide:bee.x>500,clearance:bee.x-500};
    },
    assetStatus:()=>({atlas:atlas.naturalWidth,backgrounds:themeBackgrounds.map(image=>image.naturalWidth)}),
    levelDigest:()=>Array.from({length:30},(_,index)=>{const spec=level(index);return{theme:spec.theme.terrain,dog:[spec.dog.x,spec.dog.y],hives:spec.hives.map(hive=>[hive.x,hive.y]),solids:spec.solids.map(solid=>solid.kind==="platform"?[solid.kind,solid.x,solid.y,solid.w,solid.h]:[solid.kind,solid.x,solid.y,solid.r]),speed:spec.speed}}),
    fail(){finish(false)},locale:()=>locale
  };
  loadAssets();updateMainProgress();
})();
