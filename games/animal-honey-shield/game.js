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
  const state={mode:"idle",paused:false,modal:false,started:false,elapsed:0,duration:8,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:0,spawned:0,frame:0,last:0,flash:0,keyboard:{x:500,y:310},result:null};
  let raf=0;

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
  }
  $("localeSelect").addEventListener("change",event=>{locale=event.target.value;safeSet("weightplay-locale",locale);applyLocale()});

  function updateMainProgress(){
    const done=Object.keys(save.cleared).length,stars=Object.values(save.stars).reduce((sum,n)=>sum+n,0);
    $("mainProgress").textContent=fmt("progress",{done,stars});
  }
  function showScreen(next){
    screen=next;document.body.dataset.screen=next;
    $("mainGroup").hidden=next!=="main";$("stageScreen").hidden=next!=="stage";$("battleScreen").hidden=next!=="battle";
    document.body.classList.toggle("wp-stage-select-active",next==="stage");
    document.body.classList.toggle("wp-shell-battle-active",next==="battle");
    if(next==="stage"){renderStages();requestAnimationFrame(centerSelected)}
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
    const chapter=Math.floor(index/5),slot=index%5;
    const dog={x:500+(slot%3-1)*55,y:485-(slot===4?35:0)};
    const hives=[{x:820,y:105}];
    if(chapter>=1||slot>=3)hives.push({x:180,y:120});
    if(chapter>=4&&slot>=2)hives.push({x:500,y:72});
    const anchors=[];
    if(chapter>=2){anchors.push({x:350,y:360},{x:650,y:360});if(slot>=2)anchors.push({x:500,y:250})}
    const platforms=chapter>=2?[{x:100,y:540,w:230,h:65},{x:670,y:540,w:230,h:65}]:[];
    return{dog,hives,anchors,platforms,duration:8+Math.min(4,chapter),speed:56+chapter*7+slot*2,interval:Math.max(.62,1.35-chapter*.11),maxBees:8+chapter*3+slot,gust:chapter>=3?(chapter+slot)*4:0};
  }
  function resetStage(){
    const spec=level(stageIndex);
    Object.assign(state,{mode:"idle",paused:false,modal:false,started:false,elapsed:0,duration:spec.duration,nectar:100,strokes:[],drawing:null,bees:[],spawnClock:0,spawned:0,flash:0,result:null});
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
  canvas.addEventListener("pointerdown",event=>{
    if(!canDraw())return;canvas.setPointerCapture(event.pointerId);const point=pointerPoint(event);
    state.drawing={points:[point],health:100,flash:0};state.keyboard={...point};$("drawHint").hidden=true;event.preventDefault();
  });
  canvas.addEventListener("pointermove",event=>{
    if(!state.drawing||!canDraw())return;
    const samples=event.getCoalescedEvents?.()||[event];
    for(const sample of samples){
      const point=pointerPoint(sample),last=state.drawing.points.at(-1),distance=Math.hypot(point.x-last.x,point.y-last.y);
      if(distance<5)continue;
      const allowed=Math.min(distance,state.nectar*7.2);if(allowed<=0)break;
      const ratio=allowed/distance,next={x:last.x+(point.x-last.x)*ratio,y:last.y+(point.y-last.y)*ratio};
      state.drawing.points.push(next);state.nectar=Math.max(0,state.nectar-allowed/7.2);state.keyboard={...next};
    }
    updateHud();draw();event.preventDefault();
  });
  function finishStroke(){
    if(!state.drawing)return;
    if(state.drawing.points.length>1)state.strokes.push(state.drawing);
    state.drawing=null;
    if(!state.started&&state.strokes.length){state.started=true;state.mode="wave";$("clearBtn").disabled=true;announce("waveStarted")}
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
      const x=state.keyboard.x,y=state.keyboard.y,length=Math.min(170,state.nectar*7.2);
      state.nectar=Math.max(0,state.nectar-length/7.2);state.strokes.push({points:[{x,y:y-length/2},{x,y:y+length/2}],health:100,flash:0});
      if(!state.started){state.started=true;state.mode="wave";$("clearBtn").disabled=true;announce("waveStarted")}
      updateHud();draw();event.preventDefault();
    }
  });

  function nearestOnSegment(px,py,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-a.x)*dx+(py-a.y)*dy)/len));
    const x=a.x+dx*t,y=a.y+dy*t;return{x,y,d:Math.hypot(px-x,py-y),nx:-dy/Math.sqrt(len),ny:dx/Math.sqrt(len)};
  }
  function collideLine(bee){
    if(bee.cooldown>0)return false;
    for(let s=state.strokes.length-1;s>=0;s--){
      const stroke=state.strokes[s];
      for(let i=1;i<stroke.points.length;i++){
        const hit=nearestOnSegment(bee.x,bee.y,stroke.points[i-1],stroke.points[i]);
        if(hit.d>19)continue;
        const dot=bee.vx*hit.nx+bee.vy*hit.ny,sign=dot>0?1:-1;
        bee.vx-=2*dot*hit.nx;bee.vy-=2*dot*hit.ny;bee.vx-=hit.nx*sign*36;bee.vy-=hit.ny*sign*36;
        bee.x=hit.x+hit.nx*sign*22;bee.y=hit.y+hit.ny*sign*22;bee.cooldown=.22;bee.bounced=true;
        stroke.health-=7+stageIndex*.12;stroke.flash=.18;state.flash=.1;announce("barrierHit");
        if(stroke.health<=0)state.strokes.splice(s,1);
        return true;
      }
    }
    return false;
  }
  function spawnBee(){
    const spec=level(stageIndex),hive=spec.hives[state.spawned%spec.hives.length],angle=(state.spawned%5-2)*.08;
    const dx=spec.dog.x-hive.x,dy=spec.dog.y-hive.y,length=Math.hypot(dx,dy)||1;
    state.bees.push({x:hive.x,y:hive.y+35,vx:dx/length*spec.speed+angle*spec.speed,vy:dy/length*spec.speed,life:0,cooldown:0,bounced:false,phase:state.spawned*.73});
    state.spawned++;
  }
  function update(dt){
    if(!state.started||state.mode!=="wave"||state.paused||state.modal||state.result)return;
    const spec=level(stageIndex);state.elapsed+=dt;state.spawnClock+=dt;state.nectar=Math.min(100,state.nectar+dt*1.8);
    if(state.spawnClock>=spec.interval&&state.spawned<spec.maxBees){state.spawnClock=0;spawnBee()}
    for(const bee of state.bees){
      bee.life+=dt;bee.cooldown=Math.max(0,bee.cooldown-dt);
      const target=spec.dog,dx=target.x-bee.x,dy=target.y-bee.y,length=Math.hypot(dx,dy)||1;
      const steer=bee.bounced?.35:1;bee.vx+=(dx/length*spec.speed-bee.vx)*dt*steer;bee.vy+=(dy/length*spec.speed-bee.vy)*dt*steer;
      bee.vx+=Math.sin(bee.life*3+bee.phase)*spec.gust*dt;bee.x+=bee.vx*dt;bee.y+=bee.vy*dt;collideLine(bee);
      if(Math.hypot(bee.x-target.x,bee.y-target.y)<48){finish(false);return}
    }
    state.bees=state.bees.filter(bee=>bee.life<18&&bee.x>-80&&bee.x<1080&&bee.y>-80&&bee.y<700);
    state.strokes.forEach(stroke=>{stroke.flash=Math.max(0,stroke.flash-dt);if(stroke.health<100)stroke.health=Math.min(100,stroke.health+dt*.65)});
    state.flash=Math.max(0,state.flash-dt);
    if(state.nectar<16)announce("lowNectar");
    if(state.elapsed>=state.duration){finish(true);return}
    updateHud();
  }
  function scoreStars(){
    const used=100-state.nectar,damaged=state.strokes.reduce((sum,stroke)=>sum+(100-stroke.health),0);
    if(used<=45&&damaged<60)return 3;if(used<=72)return 2;return 1;
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

  function drawSprite(cell,x,y,w,h,flip=false){
    if(!atlas.complete||!atlas.naturalWidth)return;
    const sx=(cell%3)*512,sy=Math.floor(cell/3)*512;
    ctx.save();if(flip){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(atlas,sx,sy,512,512,0,0,w,h)}else ctx.drawImage(atlas,sx,sy,512,512,x,y,w,h);ctx.restore();
  }
  function draw(){
    const spec=level(stageIndex);ctx.clearRect(0,0,1000,620);
    if(background.complete&&background.naturalWidth)ctx.drawImage(background,0,0,1000,620);else{ctx.fillStyle="#3a8b59";ctx.fillRect(0,0,1000,620)}
    ctx.fillStyle="rgba(7,39,29,.15)";ctx.fillRect(0,0,1000,620);
    for(const platform of spec.platforms)drawSprite(5,platform.x,platform.y,platform.w,platform.h);
    for(const anchor of spec.anchors)drawSprite(3,anchor.x-48,anchor.y-48,96,96);
    for(const hive of spec.hives)drawSprite(2,hive.x-75,hive.y-65,150,150);
    drawSprite(0,spec.dog.x-70,spec.dog.y-75,140,140);
    for(const bee of state.bees){const angle=Math.atan2(bee.vy,bee.vx);ctx.save();ctx.translate(bee.x,bee.y);ctx.rotate(angle);drawSprite(1,-30,-25,60,50,bee.vx<0);ctx.restore()}
    const strokes=state.drawing?[...state.strokes,state.drawing]:state.strokes;
    ctx.lineCap="round";ctx.lineJoin="round";
    for(const stroke of strokes){
      if(stroke.points.length<2)continue;const danger=stroke.health<38||stroke.flash>0;
      ctx.save();ctx.beginPath();stroke.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
      ctx.strokeStyle=danger?"#ff746d":"#6effdf";ctx.lineWidth=16;ctx.shadowColor=danger?"#ff3f3f":"#36f5cf";ctx.shadowBlur=danger?24:18;ctx.globalAlpha=.94;ctx.stroke();
      ctx.strokeStyle="#ecfff8";ctx.lineWidth=4;ctx.globalAlpha=.85;ctx.stroke();ctx.restore();
    }
    if(document.activeElement===canvas){
      ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(state.keyboard.x,state.keyboard.y,19,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(state.flash>0){ctx.fillStyle=`rgba(255,105,80,${state.flash*1.5})`;ctx.fillRect(0,0,1000,620)}
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
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&screen==="battle"&&!state.result&&!state.modal)openModal($("pausePanel"),"resumeBtn")});

  function loadAssets(){
    const sources=[[atlas,"../../assets/animal-honey-shield-sprites.webp"],[background,"../../assets/animal-honey-shield-background.webp"]];
    let settled=0;const done=()=>{settled++;$("loadingFill").style.width=`${settled/sources.length*100}%`;if(settled===sources.length)setTimeout(()=>{$("loadingPanel").hidden=true;applyLocale();draw()},120)};
    for(const [image,src] of sources){image.onload=done;image.onerror=done;image.src=src}
  }
  window.__animalHoneyShieldSmoke={
    startStage,resetStage,snapshot:()=>({screen,stage:stageIndex+1,mode:state.mode,elapsed:state.elapsed,nectar:state.nectar,strokes:state.strokes.length,bees:state.bees.length,result:state.result,save:structuredClone(save)}),
    drawBarrier(x=650){state.strokes.push({points:[{x,y:190},{x,y:560}],health:100,flash:0});state.nectar=Math.max(0,state.nectar-52);state.started=true;state.mode="wave";$("clearBtn").disabled=true;announce("waveStarted");updateHud();draw()},
    protect(){state.strokes=[{points:[{x:300,y:315},{x:360,y:210},{x:640,y:210},{x:700,y:315},{x:680,y:560},{x:320,y:560},{x:300,y:315}],health:10000,flash:0}];state.started=true;state.mode="wave";state.nectar=40},
    advance(seconds){for(let t=0;t<seconds&&!state.result;t+=.02)update(.02);draw();return this.snapshot?.()},
    fail(){finish(false)},locale:()=>locale
  };
  loadAssets();updateMainProgress();
})();
