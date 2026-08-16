(function(){
  "use strict";
  const COPY = window.WPTwinLocales.locales;
  const ORDER = window.WPTwinLocales.order;
  const $ = (selector) => document.querySelector(selector);
  const canvas = $("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width; const H = canvas.height;
  const battleBackground = new Image();
  battleBackground.decoding = "async";
  battleBackground.src = "battle-bg-v2.webp";
  const twinSprites = new Image();
  twinSprites.decoding = "async";
  twinSprites.src = "twin-sprites-v2.webp";
  const twinProps = new Image();
  twinProps.decoding = "async";
  twinProps.src = "twin-props-v2.webp";
  const stages = [
    { floors:[430,330], platforms:[[{x:245,y:360,w:145,h:16},{x:540,y:315,w:150,h:16}],[{x:200,y:260,w:135,h:16},{x:470,y:220,w:155,h:16}]], shards:[{lane:0,x:305,y:325},{lane:1,x:265,y:225},{lane:0,x:615,y:280}], switches:[], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[],[]] },
    { floors:[430,330], platforms:[[{x:230,y:350,w:120,h:16},{x:455,y:300,w:135,h:16},{x:700,y:360,w:120,h:16}],[{x:260,y:255,w:110,h:16},{x:540,y:195,w:140,h:16}]], shards:[{lane:0,x:270,y:315},{lane:1,x:315,y:220},{lane:0,x:520,y:265}], switches:[{lane:1,x:620,y:160}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[{x:620,y:404,w:64,h:26}],[]] },
    { floors:[430,330], platforms:[[{x:260,y:335,w:110,h:16},{x:500,y:255,w:130,h:16},{x:720,y:350,w:110,h:16}],[{x:210,y:245,w:120,h:16},{x:430,y:180,w:130,h:16},{x:675,y:235,w:125,h:16}]], shards:[{lane:0,x:295,y:300},{lane:1,x:475,y:145},{lane:0,x:755,y:315}], switches:[{lane:0,x:585,y:205}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ ],[{x:600,y:300,w:60,h:24}]] },
    { floors:[430,330], platforms:[[{x:215,y:360,w:110,h:16},{x:420,y:300,w:115,h:16},{x:635,y:235,w:115,h:16},{x:785,y:350,w:90,h:16}],[{x:270,y:245,w:120,h:16},{x:500,y:150,w:130,h:16},{x:730,y:245,w:115,h:16}]], shards:[{lane:0,x:250,y:325},{lane:1,x:560,y:115},{lane:0,x:680,y:200}], switches:[{lane:1,x:765,y:210}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[{x:350,y:405,w:48,h:25}], [{x:385,y:305,w:48,h:25}]] },
    { floors:[430,330], platforms:[[{x:230,y:350,w:120,h:16},{x:465,y:270,w:120,h:16},{x:660,y:345,w:110,h:16}],[{x:185,y:255,w:120,h:16},{x:380,y:175,w:125,h:16},{x:610,y:235,w:125,h:16},{x:790,y:170,w:80,h:16}]], shards:[{lane:0,x:280,y:315},{lane:1,x:425,y:140},{lane:1,x:650,y:200}], switches:[{lane:0,x:715,y:300},{lane:1,x:815,y:125}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:360,y:405,w:64,h:25}], [{x:540,y:305,w:58,h:25}]] },
    { floors:[430,330], platforms:[[{x:200,y:360,w:115,h:16},{x:395,y:285,w:115,h:16},{x:590,y:210,w:115,h:16},{x:785,y:335,w:90,h:16}],[{x:230,y:245,w:110,h:16},{x:420,y:155,w:125,h:16},{x:625,y:245,w:110,h:16},{x:785,y:135,w:90,h:16}]], shards:[{lane:0,x:250,y:325},{lane:1,x:465,y:120},{lane:0,x:650,y:165}], switches:[{lane:0,x:645,y:175},{lane:1,x:820,y:90}], gates:[{x:870,y:400},{x:870,y:300}], hazards:[[ {x:330,y:405,w:62,h:25},{x:705,y:405,w:60,h:25}], [{x:350,y:305,w:62,h:25},{x:570,y:305,w:60,h:25}]] },
  ];
  let locale = "en"; let soundEnabled = true; let current = 0; let state = null; let axis = 0; let hidden = false; let last = 0; let raf = 0;
  if (!window.WonderSound) {
    let muted = false;
    window.WonderSound = {
      isMuted: () => muted,
      setMuted: (next) => { muted = Boolean(next); soundEnabled = !muted; window.dispatchEvent(new CustomEvent("wonder:audio-volume-change")); },
    };
  }
  const text = (key) => (COPY[locale] && COPY[locale][key]) || COPY.en[key] || key;
  const landscapeControls = document.createElement("div");
  landscapeControls.className = "twin-landscape-controls";
  landscapeControls.hidden = true;
  landscapeControls.setAttribute("role", "group");
  landscapeControls.innerHTML = '<button type="button" data-twin-control="left">◀</button><button type="button" data-twin-control="jump"></button><button type="button" data-twin-control="right">▶</button>';
  document.body.appendChild(landscapeControls);
  const shortLandscape = window.matchMedia("(max-height: 520px) and (orientation: landscape)");
  const syncLandscapeControls = () => {
    landscapeControls.hidden = !(shortLandscape.matches && document.body.dataset.screen === "battle");
  };
  const storage = (key, fallback="") => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch {} };
  const unlockKey = "weightplay_twinswitch_unlocked";
  const bestKey = (index) => `weightplay_twinswitch_best_${index}`;
  const unlocked = () => Math.min(stages.length, Math.max(1, Number(storage(unlockKey, 1)) || 1));
  const setScreen = (screen) => { ["main","stage","battle","result"].forEach((name) => { $(`#${name}Screen`).hidden = name !== screen; }); document.body.dataset.screen = screen; syncLandscapeControls(); };
  const beep = (frequency=440,duration=.06) => { if (!soundEnabled) return; try { const AudioContext=window.AudioContext||window.webkitAudioContext; if(!AudioContext)return; const audio=window.__twinAudio||(window.__twinAudio=new AudioContext()); if(audio.state==="suspended")audio.resume(); const o=audio.createOscillator();const g=audio.createGain();o.frequency.value=frequency;o.type="triangle";g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}catch{} };
  const makeBody = (lane) => ({ lane, x:92, y:stages[current].floors[lane]-30, vx:0, vy:0, w:28, h:30, ground:false, color:lane===0?"#c98169":"#e3e0d5" });
  const reset = () => { state={time:0,moves:0,score:0,done:false,success:false,shards:new Set(),switches:new Set(),jumpQueued:false,messageKey:"ready",bodies:[makeBody(0),makeBody(1)]}; axis=0; };
  const rect = (body) => ({x:body.x-body.w/2,y:body.y-body.h,w:body.w,h:body.h});
  const overlaps = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const bodyNear = (body, point) => Math.hypot(body.x-point.x, (body.y-body.h/2)-point.y)<38;
  const stageData = () => stages[current];
  const announce = (key) => { state.messageKey=key; $("#battleStatus").textContent=text(key); };
  const allShards = () => state.shards.size >= stageData().shards.length;
  const gatesOpen = () => state.switches.size >= stageData().switches.length;
  const physicsBody = (body, dt) => {
    const data=stageData(); const previousX=body.x; const previousBottom=body.y;
    body.vx=axis*185; body.x+=body.vx*dt; body.x=Math.max(25,Math.min(W-25,body.x));
    const wallList=(data.walls?.[body.lane])||[]; if(wallList.some((wall)=>overlaps(rect(body),wall))) { body.x=previousX; body.vx=0; }
    body.vy+=850*dt; body.y+=body.vy*dt; body.ground=false;
    const floor=data.floors[body.lane]; if(body.y>=floor){body.y=floor;body.vy=0;body.ground=true;}
    data.platforms[body.lane].forEach((platform)=>{const r=rect(body);const crossed=previousBottom<=platform.y && body.y>=platform.y;const horizontal=body.x+body.w/2>platform.x&&body.x-body.w/2<platform.x+platform.w;if(body.vy>=0&&crossed&&horizontal){body.y=platform.y;body.vy=0;body.ground=true;}});
    if(body.y>H+80) state.failed=true;
    if((data.hazards[body.lane]||[]).some((hazard)=>overlaps(rect(body),hazard))) state.failed=true;
  };
  const update = (dt) => {
    if(!state||state.done||hidden)return; state.time+=dt; physicsBody(state.bodies[0],dt); physicsBody(state.bodies[1],dt);
    const data=stageData(); data.shards.forEach((shard,index)=>{if(!state.shards.has(index)&&state.bodies.some((body)=>body.lane===shard.lane&&bodyNear(body,shard))){state.shards.add(index);state.score+=100;state.moves+=1;state.messageKey="shardCollect";announce("shardCollect");beep(730);}});
    data.switches.forEach((sw,index)=>{if(!state.switches.has(index)&&state.bodies.some((body)=>body.lane===sw.lane&&bodyNear(body,sw))){state.switches.add(index);state.moves+=1;announce("switchOpen");beep(560);}});
    if(state.failed){finish(false);return;}
    const exitsReady=allShards()&&gatesOpen(); const atExit=data.gates.every((gate,index)=>state.bodies[index].x>gate.x&&Math.abs((state.bodies[index].y-state.bodies[index].h/2)-gate.y)<70); if(exitsReady&&atExit){state.score+=Math.max(0,500-Math.floor(state.time*8));finish(true);return;}
    if(state.flash>0)state.flash=Math.max(0,state.flash-dt);
  };
  const finish=(success)=>{if(!state||state.done)return;state.done=true;state.success=success;const best=Number(storage(bestKey(current),0))||0;if(success&&(!best||state.moves<best))save(bestKey(current),state.moves);if(success&&current+1<stages.length)save(unlockKey,Math.max(unlocked(),current+2));beep(success?960:150,.16);renderResult();setScreen("result");};
  const draw = () => {
    const data=stageData();
    if (battleBackground.complete && battleBackground.naturalWidth > 0) {
      ctx.drawImage(battleBackground, 0, 0, W, H);
      ctx.fillStyle="#07152240";ctx.fillRect(0,0,W,H);
    } else {
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,"#274459");bg.addColorStop(1,"#071522");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    }
    ctx.fillStyle="#ffd27712";ctx.fillRect(0,0,W,74);ctx.fillStyle="#78e2dc18";ctx.fillRect(0,74,W,6);
    const drawProp=(image,sx,sy,sw,sh,dx,dy,dw,dh)=>{if(!(image.complete&&image.naturalWidth>0))return false;ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);return true;};
    for(let lane=0;lane<2;lane+=1){const floor=data.floors[lane];ctx.fillStyle=lane===0?"#19445b":"#3d3f4e";ctx.fillRect(0,floor,W,H-floor);ctx.strokeStyle=lane===0?"#78e2dc":"#ffd277";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,floor);ctx.lineTo(W,floor);ctx.stroke();data.platforms[lane].forEach((platform)=>{ctx.fillStyle=lane===0?"#4d8991":"#a07962";ctx.fillRect(platform.x,platform.y,platform.w,platform.h);ctx.fillStyle="#ffffff33";ctx.fillRect(platform.x,platform.y,platform.w,3);});(data.hazards[lane]||[]).forEach((hazard)=>{if(!drawProp(twinProps,1024,512,512,512,hazard.x-16,hazard.y-36,hazard.w+32,hazard.h+48)){ctx.fillStyle="#ff7c91";ctx.beginPath();for(let x=hazard.x;x<=hazard.x+hazard.w;x+=13){ctx.lineTo(x,hazard.y+hazard.h);ctx.lineTo(x+6,hazard.y);}ctx.lineTo(hazard.x+hazard.w,hazard.y+hazard.h);ctx.closePath();ctx.fill();}});}
    data.shards.forEach((shard,index)=>{if(state?.shards.has(index))return;if(!drawProp(twinProps,512,0,512,512,shard.x-28,shard.y-38,56,76)){ctx.fillStyle=shard.lane===0?"#ffd277":"#78e2dc";ctx.save();ctx.translate(shard.x,shard.y);ctx.rotate(Math.PI/4);ctx.fillRect(-9,-9,18,18);ctx.restore();}});
    data.switches.forEach((sw,index)=>{if(!drawProp(twinProps,0,0,512,512,sw.x-35,sw.y-38,70,70)){ctx.fillStyle=state?.switches.has(index)?"#78e2dc":"#ffd277";ctx.fillRect(sw.x-12,sw.y-25,24,25);ctx.fillStyle="#071627";ctx.fillRect(sw.x-3,sw.y-19,6,13);}});
    data.gates.forEach((gate,index)=>{const open=gatesOpen();if(!drawProp(twinProps,0,512,768,512,gate.x-54,gate.y-48,108,96)){ctx.strokeStyle=open?"#78e2dc":"#a36d78";ctx.lineWidth=7;ctx.beginPath();ctx.arc(gate.x,gate.y,27,Math.PI,0);ctx.lineTo(gate.x+27,gate.y+34);ctx.moveTo(gate.x-27,gate.y);ctx.lineTo(gate.x-27,gate.y+34);ctx.stroke();}});
    if(state)state.bodies.forEach((body,index)=>{ctx.save();ctx.translate(body.x,body.y-body.h/2);if(!drawProp(twinSprites,index===0?0:768,0,768,1024,-34,-49,68,92)){ctx.fillStyle=body.color;ctx.beginPath();ctx.ellipse(0,0,body.w/2,body.h/2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=index===0?"#ffd39b":"#65778c";ctx.beginPath();ctx.arc(index===0?9:7,-8,9,0,Math.PI*2);ctx.fill();ctx.fillStyle="#071627";ctx.beginPath();ctx.arc(index===0?12:10,-10,2.5,0,Math.PI*2);ctx.fill();}ctx.restore();});
  };
  const updateHud=()=>{if(!state)return;$("#scoreLabel").textContent=`${text("score")}: ${state.score}`;$("#shardLabel").textContent=`${text("shards")}: ${state.shards.size}/${stageData().shards.length}`;$("#controlHint").textContent=text("controlHint");canvas.dataset.moves=String(state.moves);canvas.dataset.shards=String(state.shards.size);canvas.dataset.time=String(state.time);canvas.dataset.player0x=String(state.bodies[0].x);canvas.dataset.player0y=String(state.bodies[0].y-state.bodies[0].h/2);canvas.dataset.player1x=String(state.bodies[1].x);canvas.dataset.player1y=String(state.bodies[1].y-state.bodies[1].h/2);};
  const renderResult=()=>{const best=Number(storage(bestKey(current),0))||0;$("#resultEyebrow").textContent=`${text("stage")} ${current+1}`;$("#resultTitle").textContent=text(state.success?"success":"failure");$("#resultCopy").textContent=text(state.success?(current===stages.length-1?"final":"successCopy"):"failureCopy");$("#resultScore").innerHTML=`<span>${text("scoreStat")}</span><strong>${state.score}</strong>`;$("#resultMoves").innerHTML=`<span>${text("movesStat")}</span><strong>${state.moves}</strong>`;$("#resultBest").innerHTML=`<span>${text("bestStat")}</span><strong>${best||"—"}</strong>`;$("#nextBtn").textContent=text("next");$("#nextBtn").disabled=!state.success||current>=stages.length-1;$("#retryBtn").textContent=text("retry");$("#resultStagesBtn").textContent=text("stageMap");};
  const stageTitle=(index)=>`${text("stage")} ${index+1}`;
  const renderStages=()=>{const count=unlocked();$("#stageGrid").innerHTML=stages.map((_,index)=>{const open=index<count;const best=Number(storage(bestKey(index),0))||0;return `<button class="stage-card${open?"":" locked"}" type="button" data-stage="${index}" ${open?"":"disabled"}><strong>${stageTitle(index)}</strong><small>${open?(best?`${text("bestStat")}: ${best}`:text("objective")):text("stageHelp")}</small><span aria-hidden="true">${open?"✦":"◌"}</span></button>`;}).join("");$("#stageGrid").querySelectorAll("[data-stage]").forEach((button)=>button.addEventListener("click",()=>startStage(Number(button.dataset.stage))));$("#stageTitle").textContent=text("stages");$("#stageEyebrow").textContent=text("eyebrow");$("#stageHelp").textContent=text("stageHelp");};
  const startStage=(index)=>{current=Math.max(0,Math.min(stages.length-1,index));reset();$("#battleEyebrow").textContent=text("battle");$("#battleTitle").textContent=stageTitle(current);$("#battleStatus").textContent=text("ready");canvas.setAttribute("aria-label",text("ariaCanvas"));$("#leftBtn").setAttribute("aria-label",text("ariaLeft"));$("#rightBtn").setAttribute("aria-label",text("ariaRight"));setScreen("battle");beep(420);};
  const refresh=()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";$("#eyebrow").textContent=text("eyebrow");$("#coming").textContent=text("coming");$("#languageLabel").textContent=text("language");$("#tagline").textContent=text("objective");$("#objective").textContent=text("objective");$("#guideTitle").textContent=text("guideTitle");$("#guideBody").textContent=text("guideBody");$("#guideControls").textContent=text("guideControls");$("#startBtn").textContent=text("start");$("#soundBtn").textContent=soundEnabled?text("soundOn"):text("soundOff");$("#soundBtn").setAttribute("aria-pressed",String(soundEnabled));$("#stageSoundBtn").textContent=soundEnabled?text("soundOn"):text("soundOff");$("#stageSoundBtn").setAttribute("aria-pressed",String(soundEnabled));$("#stageBack").setAttribute("aria-label",text("backMain"));$("#battleBack").setAttribute("aria-label",text("backStages"));$("#jumpBtn").textContent=text("jump");$("#restartBtn").textContent=text("restart");const landscapeJump=landscapeControls.querySelector('[data-twin-control="jump"]');if(landscapeJump){landscapeJump.textContent=text("jump");landscapeJump.setAttribute("aria-label",text("jump"));}landscapeControls.querySelector('[data-twin-control="left"]')?.setAttribute("aria-label",text("ariaLeft"));landscapeControls.querySelector('[data-twin-control="right"]')?.setAttribute("aria-label",text("ariaRight"));landscapeControls.setAttribute("aria-label",text("controlHint"));renderStages();if(state&&document.body.dataset.screen==="battle"){$("#battleStatus").textContent=text(state.messageKey||"ready");$("#battleTitle").textContent=stageTitle(current);updateHud();}if(state&&document.body.dataset.screen==="result")renderResult();};
  const toggleSound=()=>{soundEnabled=!soundEnabled;save("weightplay_sound",soundEnabled?"on":"off");refresh();if(soundEnabled)beep(660);};const stageScreen=()=>{renderStages();setScreen("stage");};
  $("#startBtn").addEventListener("click",stageScreen);$("#stageBack").addEventListener("click",()=>setScreen("main"));$("#battleBack").addEventListener("click",stageScreen);$("#soundBtn").addEventListener("click",toggleSound);$("#stageSoundBtn").addEventListener("click",toggleSound);$("#restartBtn").addEventListener("click",()=>startStage(current));$("#retryBtn").addEventListener("click",()=>startStage(current));$("#nextBtn").addEventListener("click",()=>{if(!$("#nextBtn").disabled)startStage(current+1);});$("#resultStagesBtn").addEventListener("click",stageScreen);
  const pressAxis=(direction)=>{if(!state||state.done)return;axis=direction;state.moves+=1;};
  const releaseAxis=(direction)=>{if(axis===direction)axis=0;};
  const queueJump=()=>{if(state&&!state.done){state.jumpQueued=true;state.moves+=1;}};
  const hold=(button,down,up)=>{button.addEventListener("pointerdown",(event)=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);down();});["pointerup","pointercancel","lostpointercapture"].forEach((name)=>button.addEventListener(name,(event)=>{event.preventDefault();up();}));};
  hold($("#leftBtn"),()=>pressAxis(-1),()=>releaseAxis(-1));
  hold($("#rightBtn"),()=>pressAxis(1),()=>releaseAxis(1));
  hold(landscapeControls.querySelector('[data-twin-control="left"]'),()=>pressAxis(-1),()=>releaseAxis(-1));
  hold(landscapeControls.querySelector('[data-twin-control="right"]'),()=>pressAxis(1),()=>releaseAxis(1));
  $("#jumpBtn").addEventListener("pointerdown",(event)=>{event.preventDefault();queueJump();});
  landscapeControls.querySelector('[data-twin-control="jump"]').addEventListener("pointerdown",(event)=>{event.preventDefault();queueJump();});
  document.addEventListener("keydown",(event)=>{if(document.body.dataset.screen!=="battle")return;const left=event.key==="ArrowLeft"||event.key.toLowerCase()==="a";const right=event.key==="ArrowRight"||event.key.toLowerCase()==="d";if(left||right||event.key===" "||event.key==="ArrowUp"||event.key.toLowerCase()==="r")event.preventDefault();if(left){axis=-1;if(!event.repeat&&state)state.moves+=1;}if(right){axis=1;if(!event.repeat&&state)state.moves+=1;}if((event.key===" "||event.key==="ArrowUp")&&!event.repeat&&state&&!state.done){state.jumpQueued=true;state.moves+=1;}if(event.key.toLowerCase()==="r")startStage(current);});document.addEventListener("keyup",(event)=>{if((event.key==="ArrowLeft"||event.key.toLowerCase()==="a")&&axis<0)axis=0;if((event.key==="ArrowRight"||event.key.toLowerCase()==="d")&&axis>0)axis=0;});document.addEventListener("visibilitychange",()=>{hidden=document.hidden;last=performance.now();});
  const tick=(now)=>{const dt=Math.min(.032,Math.max(0,(now-last)/1000||0));last=now;if(!hidden){if(state&&!state.done){state.bodies.forEach((body)=>{if(state.jumpQueued&&body.ground){body.vy=-410;body.ground=false;beep(500,.04);} });state.jumpQueued=false;update(dt);}draw();updateHud();}raf=requestAnimationFrame(tick);};
   const routeLocale=document.documentElement.lang;locale=COPY[routeLocale]?routeLocale:storage("weightPlayLocale","en");if(!COPY[locale])locale="en";$("#localeSelect").innerHTML=ORDER.map((code)=>`<option value="${code}">${code}</option>`).join("");$("#localeSelect").value=locale;$("#localeSelect").addEventListener("change",(event)=>{locale=event.target.value;save("weightPlayLocale",locale);refresh();});soundEnabled=storage("weightplay_sound","on")!=="off";shortLandscape.addEventListener?.("change",syncLandscapeControls);window.addEventListener("resize",syncLandscapeControls);reset();refresh();setScreen("main");last=performance.now();raf=requestAnimationFrame(tick);
  $("#stageBack").setAttribute("data-wp-return", "stage");
  $("#stageScreen").setAttribute("data-wp-standard-stage-screen", "");
  $("#stageGrid").setAttribute("data-wp-stage-rail", "");
  $("#battleScreen").setAttribute("data-wp-logical-battle-canvas", "");
  $("#stageScreen .section-head")?.classList.add("stage-header");
  $("#battleScreen .section-head")?.classList.add("battle-header");
  const inlineGuide = document.querySelector("#mainScreen .guide");
  inlineGuide?.classList.remove("guide");
  inlineGuide?.classList.add("main-howto");
  const cleanGeneralGuide = () => document.querySelectorAll(".game-page-info .game-info-fact").forEach((fact) => {
    if (/skills trained/i.test(fact.textContent || "")) fact.remove();
  });
  cleanGeneralGuide();
  window.addEventListener("load", cleanGeneralGuide, { once: true });
})();
