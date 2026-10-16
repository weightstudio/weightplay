(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const LOCALES = window.FlyingTramLocales;
  const getStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const setStorage = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const routeMap = {en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  let locale = getStorage("weightPlayLocale") || getStorage("weightplay-locale") || "en";
  if (!LOCALES[locale]) locale = "en";
  const t = (key, vars = {}) => {
    let value = LOCALES[locale]?.[key] ?? LOCALES.en[key] ?? key;
    if (Array.isArray(value)) return value;
    if (typeof value === "object" && value) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  };
  let frame, selector, currentScreen = "main", selectedStage = 0, raf = 0, lastFrame = 0, toastTimer = 0;
  const storageKey = "weightplay.flying-tram.v1";
  const freshSave = () => ({unlocked:0,best:[0,0,0],flips:[0,0,0]});
  let save = (() => { try { const v = JSON.parse(getStorage(storageKey) || "null"); if (v && Array.isArray(v.best)) return {unlocked:Math.max(0,Math.min(2,Number(v.unlocked)||0)),best:[0,1,2].map(i=>Math.floor(Math.max(0,Number(v.best[i])||0))),flips:[0,1,2].map(i=>Math.max(0,Number(v.flips?.[i])||0))}; } catch {} return freshSave(); })();
  const input = {left:false,right:false,boost:false};
  let run = null;
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const normAngle = a => Math.atan2(Math.sin(a),Math.cos(a));
  const safeCall = name => { try { window.WeightPlayAudio?.play?.(name); } catch {} };

  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(node => { const value=t(node.dataset.i18n); if (typeof value === "string") node.textContent=value; });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => { node.setAttribute("aria-label",t(node.dataset.i18nAria)); });
    document.querySelectorAll(".game-info-related-copy strong,.game-info-related-copy span").forEach((node,index) => { node.textContent=t(index===0?"relatedOne":"relatedTwo"); });
    document.querySelectorAll("[data-wp-game-title]").forEach(node => { node.textContent=t("title"); });
    $("localeSelect").value=locale;
    document.title=`${t("title")} | WeightPlay`;
    updateProgress(); updateStageSummary();
    if(selector && currentScreen==="stage") selector.refresh(selectedStage);
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale}}));
    frame?.refresh?.();
  }
  const routeName = i => t("routes")[i].name;
  function persist(){setStorage(storageKey,JSON.stringify(save));}
  function updateProgress(){
    const best=save.best.reduce((a,b)=>Math.max(a,b),0);
    $("mainProgress").textContent=best?t("mainBest",{n:best}):t("mainPrompt");
  }
  function updateStageSummary(){
    if($("stageSummary")) $("stageSummary").textContent=t("stageProgress",{n:save.unlocked+1,best:save.best.reduce((a,b)=>Math.max(a,b),0)});
    const info=t("routes")[selectedStage];
    if(info){$("chapterKicker").textContent=t("routeKicker",{n:selectedStage+1});$("chapterTitle").textContent=info.name;$("chapterRule").textContent=info.rule;}
  }
  function pinViewportTop(active){
    document.documentElement.style.overflow=active?"hidden":"";
    document.body.style.position=active?"fixed":"";document.body.style.inset=active?"0":"";document.body.style.width=active?"100%":"";
    document.documentElement.scrollTop=0;document.body.scrollTop=0;
    if(active)requestAnimationFrame(()=>window.scrollTo({left:0,top:0,behavior:"instant"}));
  }
  function showScreen(next){
    if(currentScreen!=="stage")selector?.cancel?.();
    currentScreen=next;document.body.dataset.screen=next;
    frame?.activate(next);
    $("mainGroup").hidden=next!=="main";$("stageScreen").hidden=next!=="stage";$("battleScreen").hidden=next!=="battle";
    $("mainGuide").hidden=next!=="main";
    document.body.classList.toggle("wp-shell-main-active",next==="main");
    document.body.classList.toggle("wp-shell-stage-active",next==="stage");
    document.body.classList.toggle("wp-shell-battle-active",next==="battle");
    document.body.classList.toggle("wp-stage-select-active",next==="stage");
    if(next==="stage")renderStages();
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));
    pinViewportTop(next!=="main");
    if(next==="stage")requestAnimationFrame(()=>selector?.refresh?.(selectedStage));
    if(next==="battle"){cancelAnimationFrame(raf);lastFrame=performance.now();raf=requestAnimationFrame(loop);}
    else cancelAnimationFrame(raf);
  }
  function mountStage(){
    if(selector)return selector;
    selector=window.WeightPlayPlayUI.mountStage({
      page:$('stageWorkspace'),rail:$('stageRail'),
      config:window.FlyingTramStageConfig({save:()=>({...save}),text:(key,vars)=>t(key,vars)}),
      selected:selectedStage,isActive:()=>currentScreen==='stage',
      onSelect(index){selectedStage=index;updateStageSummary();},
      onStart(index){startRun(index);},
    });
    return selector;
  }
  function renderStages(){
    selectedStage=clamp(Math.max(selectedStage,save.unlocked),0,2);
    updateStageSummary();mountStage().refresh(selectedStage);
  }
  function showToast(text,ms=1400){
    const node=$("toast");node.textContent=text;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),ms);
  }
  function startRun(index){
    if(index>save.unlocked)return;
    selectedStage=index;run={index,duration:[45,47,49][index],elapsed:0,launch:0,launched:false,angle:0,angVel:0,lastTurns:0,flips:0,spill:0,altitude:.42,vy:0,score:0,paused:false,ended:false,perfect:false,wind:0,lostJunk:0,junk:[{x:-37,y:10,vx:0,vy:0,kind:0},{x:8,y:11,vx:0,vy:0,kind:1}]};
    $("resultPanel").hidden=true;$("leavePanel").hidden=true;$("pausePanel").hidden=true;resetInput();
    $("stageLabel").textContent=routeName(index);$("timeValue").textContent=String(run.duration);$("cupFill").style.width="0%";$("teaValue").textContent=t("steady");$("scoreLabel").textContent="0";$("hint").textContent=t("flightHint");
    safeCall("game.start");showScreen("battle");
  }
  function resetInput(){for(const key of Object.keys(input))input[key]=false;document.querySelectorAll(".flight-controls button").forEach(b=>b.classList.remove("pressed"));}
  function endRun(success,reason){
    if(!run||run.ended)return;run.ended=true;run.perfect=success;
    if(success){run.score=Math.floor(run.score)+500+Math.round((100-run.spill)*4);save.unlocked=Math.max(save.unlocked,Math.min(2,run.index+1));if(run.score>save.best[run.index])save.best[run.index]=run.score;save.flips[run.index]=Math.max(save.flips[run.index],run.flips);persist();safeCall("result.win");}
    else safeCall("result.lose");
    updateProgress();updateStageSummary();
    $("resultTitle").textContent=success?t("winTitle"):t("loseTitle");
    $("resultScore").textContent=String(Math.floor(run.score));$("resultFlips").textContent=String(run.flips);$("resultBest").textContent=String(save.best[run.index]||0);
    $("resultText").textContent=success?t("winCopy",{n:routeName(run.index)}):t(reason||"badLanding");
    $("skillReport").textContent=t("skillReport",{flips:run.flips,spill:Math.round(run.spill)});
    $("nextBtn").hidden=!success||run.index>=2;$("resultPanel").hidden=false;$("hint").textContent=success?t("landed"):t("tryAgain");resetInput();
  }
  function update(dt){
    if(!run||run.ended||run.paused)return;
    const gustStrength=[.34,.74,1.05][run.index];
    if(!run.launched){
      if(input.boost)run.launch+=dt;
      else run.launch=Math.max(0,run.launch-dt*.6);
      run.score=Math.round(run.launch*20);
      if(run.launch>=.75){run.launched=true;showToast(t("takeoff"));}
      else if(run.launch>0)$("hint").textContent=t("launchCharge",{n:Math.min(100,Math.round(run.launch/.75*100))});
      else $("hint").textContent=t("launchHint");
      if(run.launch<.75&&run.launch===0)run.elapsed+=dt*.1;
    }else{
      run.elapsed+=dt;
      run.wind=Math.sin(run.elapsed*.72+run.index*1.1)*gustStrength;
      const steering=(input.right?1:0)-(input.left?1:0);
      run.angVel=clamp(run.angVel+steering*3.1*dt+run.wind*.12*dt,-4.2,4.2);
      if(!steering)run.angVel*=Math.pow(.19,dt);
      run.angle+=run.angVel*dt;
      const turns=Math.floor(Math.abs(run.angle)/(Math.PI*2));
      if(turns>run.lastTurns){run.flips+=turns-run.lastTurns;run.score+=650*(turns-run.lastTurns);run.lastTurns=turns;safeCall("feedback.success");showToast(t("flip",{n:run.flips}),850);}
      const tilt=Math.abs(normAngle(run.angle));
      run.spill=clamp(run.spill+Math.max(0,tilt-.24)*dt*5+Math.abs(run.angVel)*dt*.5-(tilt<.12&&Math.abs(run.angVel)<.25?dt*3:0),0,100);
      run.vy=clamp(run.vy+(input.boost?.5:-.16)*dt,-.5,.5);
      run.vy*=Math.pow(.7,dt);
      const before=run.altitude;run.altitude=clamp(run.altitude+run.vy*dt,.19,.83);
      if(run.altitude===.19||run.altitude===.83)run.vy=0;
      run.score+=dt*(8+run.index*2);for(const item of run.junk){if(item.lost)continue;item.vx=clamp((item.vx-Math.sin(run.angle)*3.4+run.wind*.55)*Math.pow(.82,dt*8),-55,55);item.vy=clamp((item.vy+(input.boost?0.85:-0.45))*Math.pow(.88,dt*8),-45,45);item.x+=item.vx*dt;item.y+=item.vy*dt;if(Math.abs(item.x)>88||item.y<-96||item.y>32){item.lost=true;run.lostJunk++;run.score=Math.max(0,run.score-120);run.spill=clamp(run.spill+14,0,100);safeCall("ui.click");showToast(t("sloshing"));}}
      if(run.spill>=100){endRun(false,"spilled");return;}
      if(run.altitude<=.19&&before===.19&&run.elapsed>7){endRun(false,"tooLow");return;}
      if(run.elapsed>=run.duration){
        const level=Math.abs(normAngle(run.angle))<.34&&Math.abs(run.angVel)<.85;
        const height=run.altitude>=.28&&run.altitude<=.84&&Math.abs(run.vy)<.24;
        if(level&&height&&run.spill<98)endRun(true,"winCopy");
        else if(!level)endRun(false,"tilted");
        else if(!height)endRun(false,"height");
        else endRun(false,"spilled");
        return;
      }
    }
    const remaining=Math.max(0,Math.ceil(run.duration-run.elapsed));
    $("timeValue").textContent=String(remaining);
    $("scoreLabel").textContent=String(Math.floor(run.score));
    $("cupFill").style.width=`${Math.round(run.spill)}%`;
    $("teaValue").textContent=run.spill>70?t("sloshing"):run.spill>35?t("wobbly"):t("steady");
    $("readout").textContent=`${Math.round(Math.abs(normAngle(run.angle))*180/Math.PI)}° · ${t("windShort")} ${run.wind>0?"↗":"↙"}`;if(run.lostJunk)$("readout").textContent+=` · 🧾 ${run.lostJunk}`;
    $("hint").textContent=run.spill>70?t("calmHint"):t("flightHint");
  }
  function draw(){
    const canvas=$("gameCanvas"),ctx=canvas.getContext("2d"),w=1000;
    const r=run;if(!r)return;
    const rect=canvas.getBoundingClientRect(),h=w*rect.height/Math.max(1,rect.width);
    ctx.setTransform(1,0,0,570/h,0,0);
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#163c65");sky.addColorStop(.65,"#74b9d2");sky.addColorStop(1,"#f8c777");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    const tsec=r.elapsed, progress=clamp(tsec/r.duration,0,1), camX=progress*380;
    for(let i=0;i<8;i++){const x=((i*175-camX*.22)%1250+1250)%1250-100,y=65+(i%3)*47;ctx.fillStyle="#ffffff44";ctx.fillRect(x,y,86,18);ctx.fillRect(x+17,y-13,46,16);}
    const skyline=[120,205,144,265,180,225,135,250,165,210,155,280,130,220];
    skyline.forEach((bh,i)=>{const x=((i*88-camX*.58)%1320+1320)%1320-140;ctx.fillStyle=i%2?"#264c6b":"#315b78";ctx.fillRect(x,h-bh-74,72,bh);ctx.fillStyle="#bddae155";for(let y=h-bh-58;y<h-96;y+=24)for(let xx=x+10;xx<x+64;xx+=18)ctx.fillRect(xx,y,7,10);});
    const runwayX=850-progress*480;ctx.fillStyle="#193754";ctx.fillRect(0,h-75,w,75);ctx.fillStyle="#263f56";ctx.fillRect(runwayX,h-105,164,30);ctx.fillStyle="#f8d567";ctx.fillRect(runwayX+22,h-118,120,12);ctx.fillStyle="#fff";ctx.fillRect(runwayX+32,h-105,10,30);ctx.fillRect(runwayX+122,h-105,10,30);
    ctx.fillStyle="#d5f5ff";ctx.font="900 18px system-ui";ctx.textAlign="center";ctx.fillText(t("pad"),runwayX+82,h-128);
    for(let i=0;i<4;i++){const gx=(i*262+80-tsec*36)%(w+60);ctx.strokeStyle="#ffffff55";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,180+i%2*54);ctx.lineTo(gx+55,180+i%2*54);ctx.stroke();}
    const tramX=135+progress*485, tramY=h-132-r.altitude*190+Math.sin(tsec*1.2)*8;
    const angle=normAngle(r.angle);
    ctx.save();ctx.translate(tramX,tramY);ctx.rotate(angle);
    // Original cuboid sky tram, drawn from simple geometric blocks.
    ctx.fillStyle="#102842";ctx.fillRect(-86,24,172,14);ctx.fillStyle="#69d6db";ctx.fillRect(-74,-26,148,54);ctx.fillStyle="#147f9c";ctx.fillRect(-74,8,148,20);ctx.fillStyle="#ffb955";ctx.fillRect(-70,-52,133,31);ctx.fillStyle="#f4fbff";ctx.fillRect(-55,-43,29,18);ctx.fillRect(-14,-43,29,18);ctx.fillRect(27,-43,28,18);ctx.fillStyle="#ff7549";ctx.fillRect(-82,15,13,10);ctx.fillRect(69,15,13,10);ctx.fillStyle="#ffdf72";ctx.fillRect(72,-3,12,11);
    ctx.fillStyle="#16253d";ctx.fillRect(-56,36,24,13);ctx.fillRect(32,36,24,13);ctx.fillStyle="#65a9c4";ctx.fillRect(-51,46,13,7);ctx.fillRect(37,46,13,7);
    // Loose ticket and snack box ride inside the tram, then drift out under hard acceleration.
    for(const item of r.junk){if(item.lost)continue;ctx.fillStyle=item.kind===0?"#ffe08a":"#f49c59";ctx.fillRect(item.x,item.y,13,9);ctx.fillStyle="#fff6d4";ctx.fillRect(item.x+2,item.y+2,8,2);}
    // Spark Paw Fia: stepped fox head, lightning motif, and blue scarf.
    ctx.fillStyle="#e87933";ctx.fillRect(-25,-78,44,35);ctx.fillRect(-34,-73,12,16);ctx.fillRect(19,-73,12,16);ctx.fillStyle="#fff0ce";ctx.fillRect(-17,-64,28,20);ctx.fillStyle="#fff";ctx.fillRect(-14,-70,7,8);ctx.fillRect(2,-70,7,8);ctx.fillStyle="#172d48";ctx.fillRect(-12,-68,3,4);ctx.fillRect(4,-68,3,4);ctx.fillStyle="#1e5f9a";ctx.fillRect(-22,-45,39,7);ctx.fillRect(8,-42,10,10);ctx.fillStyle="#f8cc43";ctx.beginPath();ctx.moveTo(-25,-77);ctx.lineTo(-19,-77);ctx.lineTo(-22,-70);ctx.lineTo(-16,-70);ctx.lineTo(-26,-59);ctx.lineTo(-22,-68);ctx.lineTo(-28,-68);ctx.fill();
    // One bubble-tea cup, with visible pearls and spill slosh.
    ctx.fillStyle="#f5f0db";ctx.fillRect(40,-62,18,21);ctx.fillStyle="#e99b5a";ctx.fillRect(42,-55,14,12);ctx.fillStyle="#fff7e8";ctx.fillRect(42,-61,14,4);ctx.strokeStyle="#7ce5f3";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(49,-60);ctx.lineTo(55,-72);ctx.stroke();ctx.fillStyle="#253454";ctx.fillRect(44,-46,4,4);ctx.fillRect(50,-46,4,4);ctx.restore();
    ctx.fillStyle="#eafaff";ctx.textAlign="left";ctx.font="800 14px system-ui";ctx.fillText(`${t("routeKicker",{n:r.index+1})} · ${Math.round(progress*100)}%`,20,26);
    ctx.fillStyle="#102a42aa";ctx.fillRect(20,38,250,10);ctx.fillStyle="#78f0c6";ctx.fillRect(20,38,250*progress,10);
    ctx.fillStyle="#fff";ctx.font="12px system-ui";ctx.fillText(t("balanceHint"),20,67);
    if(!r.launched){ctx.fillStyle="#06172ad9";ctx.fillRect(0,0,w,h);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="900 26px system-ui";ctx.fillText(t("launchHint"),w/2,h/2-18);ctx.fillStyle="#ffd45d";ctx.fillRect(w/2-120,h/2+4,240*clamp(r.launch/.75,0,1),12);}
  }
  function loop(now){
    if(currentScreen!=="battle")return;
    const dt=clamp((now-lastFrame)/1000,0,.04);lastFrame=now;
    if(!$("leavePanel").hidden||!$("pausePanel").hidden||!$("resultPanel").hidden){draw();raf=requestAnimationFrame(loop);return;}
    update(dt);draw();
    raf=requestAnimationFrame(loop);
  }
  function setHold(button,key){
    const node=$(button);const down=event=>{event.preventDefault();input[key]=true;node.classList.add("pressed");try{node.setPointerCapture(event.pointerId);}catch{}};
    const up=()=>{input[key]=false;node.classList.remove("pressed");};
    node.addEventListener("pointerdown",down);["pointerup","pointercancel","lostpointercapture","pointerleave"].forEach(type=>node.addEventListener(type,up));
  }
  function clickSound(){safeCall("ui.click");}
  function bind(){
    document.addEventListener("click",event=>{if(event.target.closest("button"))safeCall("ui.click");});
    $("localeSelect").addEventListener("change",event=>{locale=event.target.value;setStorage("weightPlayLocale",locale);setStorage("weightplay-locale",locale);window.WonderI18n?.setLocale?.(locale);applyLocale();});
    $("startBtn").addEventListener("click",()=>{clickSound();selectedStage=save.unlocked;showScreen("stage");});
    $("stageBackBtn").addEventListener("click",()=>showScreen("main"));
    $("battleBackBtn").addEventListener("click",event=>{event.preventDefault();event.stopPropagation();if(!run||run.ended)return;run.paused=true;$("leavePanel").hidden=false;});
    $("leaveContinueBtn").addEventListener("click",()=>{$("leavePanel").hidden=true;if(run)run.paused=false;});
    $("leaveStagesBtn").addEventListener("click",()=>{$("leavePanel").hidden=true;run=null;showScreen("stage");});
    $("pauseBtn").addEventListener("click",()=>{if(!run||run.ended)return;run.paused=true;$("pausePanel").hidden=false;});
    $("resumeBtn").addEventListener("click",()=>{$("pausePanel").hidden=true;if(run)run.paused=false;});
    $("pauseStagesBtn").addEventListener("click",()=>{$("pausePanel").hidden=true;run=null;showScreen("stage");});
    $("resultStagesBtn").addEventListener("click",()=>{$("resultPanel").hidden=true;run=null;showScreen("stage");});
    $("retryBtn").addEventListener("click",()=>startRun(selectedStage));
    $("nextBtn").addEventListener("click",()=>{if(run?.perfect&&run.index<2)startRun(run.index+1);});
    setHold("leftBtn","left");setHold("rightBtn","right");setHold("boostBtn","boost");
    window.addEventListener("keydown",event=>{if(event.repeat&&["ArrowLeft","ArrowRight","Space"].includes(event.code))return;if(["ArrowLeft","ArrowRight","Space"].includes(event.code))event.preventDefault();if(event.code==="ArrowLeft")input.left=true;if(event.code==="ArrowRight")input.right=true;if(event.code==="Space")input.boost=true;});
    window.addEventListener("keyup",event=>{if(event.code==="ArrowLeft")input.left=false;if(event.code==="ArrowRight")input.right=false;if(event.code==="Space")input.boost=false;});
    window.addEventListener("blur",resetInput);
    window.addEventListener("resize",()=>{const c=$("gameCanvas");if(c&&c.offsetWidth){/* CSS scales the logical 1000×570 canvas without changing game coordinates. */}});
  }
  function boot(){
    frame=window.mountFlyingTramFrame();
    bind();applyLocale();updateProgress();mountStage();
    $("loadingPanel").hidden=true;
    window.dispatchEvent(new Event("weightplay:shell-sync"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
