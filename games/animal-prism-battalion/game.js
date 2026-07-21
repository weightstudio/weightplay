(function(){
  "use strict";
  const $=(id)=>document.getElementById(id);
  const pack=window.AnimalPrismBattalionLocales;
  const localeCodes=pack.codes;
  const routeSegments={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru"};
  const routeLocales=Object.fromEntries(Object.entries(routeSegments).map(([key,value])=>[value,key]));
  const memoryStorage=new Map();
  const storage={
    get(key){try{const value=localStorage.getItem(key);return value===null?(memoryStorage.get(key)??null):value}catch{return memoryStorage.get(key)??null}},
    set(key,value){memoryStorage.set(key,String(value));try{localStorage.setItem(key,String(value))}catch{/* same-page fallback */}},
  };
  function canonicalLocale(value){const raw=String(value||"").toLowerCase();if(raw.startsWith("zh-tw")||raw.includes("hant"))return"zh-Hant";if(raw.startsWith("zh-cn")||raw.includes("hans"))return"zh-Hans";if(raw.startsWith("pt"))return"pt-BR";return localeCodes.find((code)=>code.toLowerCase()===raw)||"en"}
  const routeLocale=routeLocales[location.pathname.split("/").filter(Boolean)[0]];
  let locale=canonicalLocale(routeLocale||storage.get("wonderLocale")||navigator.language);
  const t=(key,vars={})=>String(pack.dictionaries[locale]?.[key]||pack.dictionaries.en[key]||key).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`);

  const SAVE_KEY="animalPrismBattalionSaveV1";
  const defaultSave=()=>({unlocked:1,stars:{},shards:0,upgrades:{rate:0,power:0,armor:0},tutorialSeen:false});
  function normalizeSave(raw){
    const source=raw&&typeof raw==="object"?raw:{};
    const stars={};
    if(source.stars&&typeof source.stars==="object")for(const [key,value] of Object.entries(source.stars)){const stage=Math.trunc(Number(key));const score=Math.max(0,Math.min(3,Math.trunc(Number(value))));if(Number.isFinite(stage)&&stage>=1&&stage<=30&&score)stars[stage]=score}
    const upgrades={};
    for(const id of ["rate","power","armor"])upgrades[id]=Math.max(0,Math.min(5,Math.trunc(Number(source.upgrades?.[id]))||0));
    return{unlocked:Math.max(1,Math.min(30,Math.trunc(Number(source.unlocked))||1)),stars,shards:Math.max(0,Math.min(9999,Math.trunc(Number(source.shards))||0)),upgrades,tutorialSeen:source.tutorialSeen===true};
  }
  function readSave(){try{return normalizeSave(JSON.parse(storage.get(SAVE_KEY)||"null"))}catch{return defaultSave()}}
  let save=readSave();
  const persist=()=>storage.set(SAVE_KEY,JSON.stringify(save));
  const chapters=["chapter1","chapter2","chapter3","chapter4","chapter5","chapter6"];
  const stages=Array.from({length:30},(_,index)=>{
    const n=index+1,chapter=Math.floor(index/5),step=index%5;
    const boss=n%5===0;
    return{n,chapter,time:58-chapter*2-step,fortress:Math.round((165+index*42+chapter*chapter*360)*(boss?1.18:1)),enemyHp:10+chapter*14+step*4,waves:2+chapter+(step>=2?1:0),moving:chapter>=2,shields:chapter>=1,counter:chapter>=3,champion:chapter>=4,boss};
  });
  const staticText=[...document.querySelectorAll("[data-t]")];
  const assistiveText=[...document.querySelectorAll("[data-ta]")];
  let currentScreen="loading",run=null,raf=0,lastTime=0,lastHud="",modalReturnFocus=null;

  function applyLocale(){
    document.documentElement.lang=locale;
    $("locale").value=locale;
    $("lobbyReturn").href=`/${routeSegments[locale]}/`;
    staticText.forEach((node)=>{node.textContent=t(node.dataset.t)});
    assistiveText.forEach((node)=>node.setAttribute("aria-label",t(node.dataset.ta)));
    document.title=`${t("title")} | WeightPlay Internal Trial`;
    renderMain();renderStage();renderLab();updateSoundToggle();if(run)updateHud(true);
    window.dispatchEvent(new CustomEvent("wonder:localechange",{detail:{locale}}));
  }
  function showScreen(name){
    currentScreen=name;document.body.dataset.screen=name;
    $("mainGroup").hidden=name!=="main";$("stage").hidden=name!=="stage";$("battle").hidden=name!=="battle";
    if(name==="main"){$("start").focus();scrollTo(0,0)}
    if(name==="stage"){renderStage();renderLab();$("labFeedback").textContent="";requestAnimationFrame(()=>centerStage(Math.min(save.unlocked-1,29)))}
  }
  function renderMain(){$("mainProgress").textContent=`${Object.keys(save.stars).length} / 30`}
  function updateSoundToggle(){const button=$("soundToggle"),muted=Boolean(window.WonderSound?.isMuted?.());if(!button)return;button.textContent=muted?"🔇":"🔊";button.title=t("sound");button.setAttribute("aria-label",t(muted?"enableSound":"disableSound"));button.classList.toggle("muted",muted)}
  function chapterName(stage){return t(chapters[stage.chapter])}
  function renderStage(){
    if(!$("stageRail"))return;
    $("stageProgress").textContent=`${save.unlocked} / 30`;
    $("stageRail").replaceChildren(...stages.map((stage,index)=>{
      const locked=stage.n>save.unlocked,button=document.createElement("button");
      button.type="button";button.className=`stage-card${locked?" locked":""}`;button.dataset.stage=String(stage.n);button.dataset.index=String(index);button.setAttribute("aria-disabled",locked?"true":"false");
      button.innerHTML=`<span>${locked?t("lockedBadge"):chapterName(stage)}</span><strong>${stage.n}</strong><b>${stage.boss?"◆ ":""}${t("fortress")} ${stage.fortress}</b><small>${"★".repeat(save.stars[stage.n]||0)}${"☆".repeat(3-(save.stars[stage.n]||0))}</small>`;
      button.addEventListener("click",()=>{if(locked){$("stageHint").textContent=t("stageLocked");return}startBattle(index)});
      return button;
    }));
  }
  function markCentered(index){
    const cards=[...$("stageRail").children];
    cards.forEach((card,i)=>{const active=i===Number(index);card.classList.toggle("centered",active);card.setAttribute("aria-current",active?"true":"false")});
  }
  function centerStage(index){const card=$("stageRail").querySelector(`[data-index="${index}"]`);card?.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});requestAnimationFrame(()=>markCentered(index))}
  $("stageRail").addEventListener("wonder:stage-snap",(event)=>markCentered(event.detail?.index));

  const upgradeData={rate:{icon:"⚡",name:"upgradeRate",desc:"upgradeRateDesc"},power:{icon:"✦",name:"upgradePower",desc:"upgradePowerDesc"},armor:{icon:"◆",name:"upgradeArmor",desc:"upgradeArmorDesc"}};
  const upgradeCost=(level)=>6+level*6;
  function renderLab(){
    $("shardCount").textContent=t("shards",{count:save.shards});
    $("upgrades").replaceChildren(...Object.entries(upgradeData).map(([id,data])=>{
      const level=save.upgrades[id],button=document.createElement("button");button.type="button";button.className=`upgrade${level>=5?" maxed":""}`;button.dataset.upgrade=id;button.disabled=level>=5;
      button.innerHTML=`<span class="upgrade-icon">${data.icon}</span><strong>${t(data.name)}</strong><small>${t(data.desc)}</small><b>${t("level",{level})}</b><em>${level>=5?t("maxed"):t("upgradeCost",{cost:upgradeCost(level)})}</em>`;
      button.addEventListener("click",()=>buyUpgrade(id));return button;
    }));
  }
  function buyUpgrade(id){const level=save.upgrades[id];if(level>=5)return;const cost=upgradeCost(level),name=t(upgradeData[id].name);if(save.shards<cost){$("labFeedback").textContent=t("needShardsDetail",{name,cost,balance:save.shards});return}save.shards-=cost;save.upgrades[id]+=1;persist();renderLab();$("labFeedback").textContent=t("upgradePurchasedDetail",{name,level:save.upgrades[id],balance:save.shards});window.WonderSound?.play?.("success")}
  document.querySelectorAll("[data-tab]").forEach((button)=>button.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach((item)=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-selected",active?"true":"false")});$("missionsTab").hidden=button.dataset.tab!=="missions";$("labTab").hidden=button.dataset.tab!=="lab";if(button.dataset.tab==="lab"){renderLab();$("labFeedback").textContent=""}}));
  $("start").addEventListener("click",()=>showScreen("stage"));$("stageBack").addEventListener("click",()=>showScreen("main"));
  $("locale").addEventListener("change",(event)=>{locale=canonicalLocale(event.target.value);storage.set("wonderLocale",locale);applyLocale()});
  $("soundToggle").addEventListener("keydown",(event)=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault()});
  $("soundToggle").addEventListener("click",()=>{const sound=window.WonderSound;if(!sound)return;sound.unlock();sound.setMuted(!sound.isMuted());updateSoundToggle();if(!sound.isMuted())sound.play("click")});

  const canvas=$("arena"),ctx=canvas.getContext("2d"),images={};
  const imageSources={arena:"../../assets/animal-prism-battalion/arena.webp",spirits:"../../assets/animal-prism-battalion/spirit-atlas.webp",fox:"../../assets/weightplay-character-spark-paw-fox-cutout.webp",enemy:"../../assets/animal-crystal-survivor-shadow-fox-v2.webp",boss:"../../assets/animal-crystal-survivor-boss-eclipse-colossus.webp"};
  function seeded(seed){let value=(seed*9301+49297)%233280;return()=>{value=(value*9301+49297)%233280;return value/233280}}
  function gateRows(stage){
    if(stage.n===1)return[[{x:.28,kind:"mul",value:2},{x:.72,kind:"sub",value:2}],[{x:.28,kind:"add",value:4},{x:.72,kind:"mul",value:2}]];
    const random=seeded(stage.n),rows=[];
    const count=stage.chapter>=3?3:2;
    for(let row=0;row<count;row+=1){
      const strong=random()>.5?"left":"right",bonus=stage.chapter+2+Math.floor(random()*4);
      const left=strong==="left"?{kind:random()>.45?"mul":"add",value:random()>.55?3:bonus}:{kind:random()>.35?"sub":"add",value:2+stage.chapter};
      const right=strong==="right"?{kind:random()>.45?"mul":"add",value:random()>.55?3:bonus}:{kind:random()>.35?"sub":"add",value:2+stage.chapter};
      rows.push([{x:.28,...left},{x:.72,...right}]);
    }
    return rows;
  }
  function makeGates(stage){const rows=gateRows(stage);return rows.flatMap((row,rowIndex)=>row.map((gate,lane)=>({id:`${rowIndex}-${lane}`,row:rowIndex,lane,y:.7-rowIndex*.19,baseX:gate.x,x:gate.x,half:.18,...gate})))}
  function enemyWave(stage,wave=0){
    const count=2+Math.min(3,stage.chapter)+((wave+stage.n)%2),groups=[];
    for(let i=0;i<count;i+=1){const x=(i+1)/(count+1);groups.push({x,y:.15+(i%2)*.06,hp:stage.enemyHp*(stage.champion&&i===Math.floor(count/2)?2.4:1),maxHp:stage.enemyHp*(stage.champion&&i===Math.floor(count/2)?2.4:1),shield:stage.shields&&i%2===0?stage.enemyHp*.55:0,speed:(stage.counter?.0075:.0035)+stage.chapter*.0006,champion:stage.champion&&i===Math.floor(count/2),phase:i*.7})}return groups;
  }
  function startBattle(index){
    const stageIndex=Math.max(0,Math.min(29,Math.trunc(index))),stage=stages[stageIndex];
    run={stageIndex,stage,time:stage.time,core:3+save.upgrades.armor,maxCore:3+save.upgrades.armor,fortress:stage.fortress,maxFortress:stage.fortress,aimX:.28,units:[],enemies:enemyWave(stage),gates:makeGates(stage),particles:[],texts:[],fireClock:0,waveClock:0,wavesSpawned:1,charge:0,overdrive:0,peak:0,coreHits:0,paused:false,finished:false,lastGateMessage:""};
    $("leave").hidden=true;$("tutorial").hidden=true;$("result").hidden=true;$("battleLive").hidden=false;$("battleLive").inert=false;showScreen("battle");updateHud(true);$("feedback").textContent="";lastTime=performance.now();stopLoop();raf=requestAnimationFrame(frame);window.WonderSound?.play?.("start");if(!save.tutorialSeen)requestAnimationFrame(()=>openTutorial())
  }
  function stopLoop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function resumeLoop(){if(!run||run.finished||run.paused||raf)return;lastTime=performance.now();raf=requestAnimationFrame(frame)}
  function gateLabel(gate){return gate.kind==="mul"?`×${gate.value}`:gate.kind==="add"?`+${gate.value}`:`−${gate.value}`}
  function updateHud(force=false){if(!run)return;const key=`${Math.ceil(run.time)}|${run.core}|${Math.ceil(run.fortress)}|${Math.floor(run.charge)}|${Math.ceil(run.overdrive*10)}|${locale}`;if(!force&&key===lastHud)return;lastHud=key;$("missionLabel").textContent=`${chapterName(run.stage)} · ${run.stage.n}/30`;$("fortressValue").textContent=`${t("fortress")} ${Math.max(0,Math.ceil(run.fortress/run.maxFortress*100))}%`;$("coreValue").textContent=run.core<=4?"♥".repeat(run.core):`♥ ×${run.core}`;$("timeValue").textContent=Math.max(0,Math.ceil(run.time));$("objective").textContent=t("objective");$("overdrive").querySelector("span").textContent=t(run.overdrive>0?"overdriveActive":"overdrive");$("overdriveValue").textContent=run.overdrive>0?t("secondsShort",{seconds:run.overdrive.toFixed(1)}):`${Math.floor(run.charge)}%`;$("overdrive").classList.toggle("ready",run.charge>=100);$("overdrive").classList.toggle("active",run.overdrive>0)}
  function addText(x,y,text,color){run.texts.push({x,y,text,color,life:1})}
  function addBurst(x,y,color,count=8){for(let i=0;i<count;i+=1){const a=Math.PI*2*i/count+Math.random()*.3,s=.025+Math.random()*.045;run.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color,life:.65+Math.random()*.35})}}
  function updatePeak(){if(run)run.peak=Math.max(run.peak,Math.round(run.units.reduce((sum,unit)=>sum+unit.count,0)))}
  function launch(){const interval=.31-save.upgrades.rate*.028;run.units.push({x:run.aimX,y:.88,count:1,power:1+save.upgrades.power*.22,vy:-.34,gates:new Set(),hue:run.overdrive>0?48:188,sprite:(run.units.length+run.wavesSpawned)%3});run.fireClock-=interval;updatePeak()}
  function applyGate(unit,gate){
    if(unit.gates.has(gate.id))return;unit.gates.add(gate.id);const before=unit.count;
    if(gate.kind==="mul")unit.count=Math.min(80,unit.count*gate.value);else if(gate.kind==="add")unit.count=Math.min(80,unit.count+gate.value);else unit.count=Math.max(1,unit.count-gate.value);
    const delta=unit.count-before,positive=delta>0;if(positive)run.charge=Math.min(100,run.charge+Math.min(16,4+delta));
    addText(gate.x,gate.y-.03,positive?`+${delta}`:`${delta}`,positive?"#72f4d8":"#ff6f85");addBurst(gate.x,gate.y,positive?"#5ff4db":"#ff5f7b",6);
    const message=t(positive?"gateBoost":"gateDrain",{count:Math.abs(delta)});if(message!==run.lastGateMessage){run.lastGateMessage=message;if(run.overdrive<=0)$("feedback").textContent=message}
    updatePeak();if(run.charge>=100)$("feedback").textContent=t("overdriveReady");
  }
  function update(dt){
    if(!run||run.paused||run.finished)return;
    run.time-=dt;run.fireClock+=dt;run.waveClock+=dt;if(run.overdrive>0)run.overdrive=Math.max(0,run.overdrive-dt);
    const interval=run.overdrive>0?.075:.31-save.upgrades.rate*.028;while(run.fireClock>=interval&&run.units.length<130)launch();
    if(run.wavesSpawned<run.stage.waves&&run.waveClock>=8.5){run.waveClock=0;run.enemies.push(...enemyWave(run.stage,run.wavesSpawned).map((enemy)=>({...enemy,y:run.stage.counter?.27:.15})));run.wavesSpawned+=1}
    run.gates.forEach((gate)=>{if(run.stage.moving){const direction=gate.lane?1:-1;gate.x=Math.max(.18,Math.min(.82,gate.baseX+Math.sin((run.stage.time-run.time)*.85+gate.row)*.095*direction))}});
    for(const unit of run.units){
      const previousY=unit.y;unit.y+=unit.vy*dt;
      for(const gate of run.gates)if(previousY>gate.y&&unit.y<=gate.y&&Math.abs(unit.x-gate.x)<=gate.half)applyGate(unit,gate);
      let hit=null,best=.055;
      for(const enemy of run.enemies){const distance=Math.hypot(unit.x-enemy.x,unit.y-enemy.y);if(distance<best){best=distance;hit=enemy}}
      if(hit){let damage=unit.count*unit.power*(run.overdrive>0?1.8:1);if(hit.shield>0){const absorbed=Math.min(hit.shield,damage);hit.shield-=absorbed;damage-=absorbed}hit.hp-=damage;addBurst(hit.x,hit.y,"#77ecff",Math.min(12,4+unit.count));unit.dead=true;if(hit.hp<=0){hit.dead=true;addBurst(hit.x,hit.y,"#ffe273",16)}}
      else if(unit.y<=.085){run.fortress-=unit.count*unit.power*(run.overdrive>0?1.8:1);addBurst(unit.x,.09,"#ffe273",Math.min(12,5+unit.count));unit.dead=true}
    }
    for(const enemy of run.enemies){enemy.phase+=dt;enemy.x=Math.max(.08,Math.min(.92,enemy.x+Math.sin(enemy.phase*1.7)*dt*.012));enemy.y+=enemy.speed*dt;if(enemy.y>.87){run.core-=1;run.coreHits+=1;enemy.dead=true;addBurst(enemy.x,.88,"#ff627c",18)}}
    run.units=run.units.filter((unit)=>!unit.dead&&unit.y>0);run.enemies=run.enemies.filter((enemy)=>!enemy.dead);updatePeak();
    for(const particle of run.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vy+=.025*dt;particle.life-=dt}run.particles=run.particles.filter((particle)=>particle.life>0);
    for(const text of run.texts){text.y-=.05*dt;text.life-=dt}run.texts=run.texts.filter((text)=>text.life>0);
    if(run.fortress<=0)finish(true);else if(run.core<=0||run.time<=0)finish(false);updateHud();
  }
  function rounded(x,y,w,h,r){const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.arcTo(x+w,y,x+w,y+h,radius);ctx.arcTo(x+w,y+h,x,y+h,radius);ctx.arcTo(x,y+h,x,y,radius);ctx.arcTo(x,y,x+w,y,radius);ctx.closePath()}
  function drawCover(image,x,y,w,h){if(!image?.naturalWidth)return;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
  function drawImageCentered(image,x,y,size,glow=""){if(!image?.naturalWidth)return;ctx.save();ctx.translate(x,y);if(glow){ctx.shadowColor=glow;ctx.shadowBlur=size*.45}ctx.drawImage(image,-size/2,-size/2,size,size);ctx.restore()}
  function drawAtlasCell(image,column,row,x,y,size,glow=""){if(!image?.naturalWidth)return false;const sw=image.naturalWidth/2,sh=image.naturalHeight/2;ctx.save();ctx.translate(x,y);if(glow){ctx.shadowColor=glow;ctx.shadowBlur=size*.34}ctx.drawImage(image,column*sw,row*sh,sw,sh,-size/2,-size/2,size,size);ctx.restore();return true}
  function draw(){
    if(!run)return;const w=canvas.width,h=canvas.height,d=Math.min(w,h),px=(x)=>x*w,py=(y)=>y*h;ctx.clearRect(0,0,w,h);drawCover(images.arena,0,0,w,h);ctx.fillStyle="#03152a45";ctx.fillRect(0,0,w,h);
    const fortressRatio=Math.max(0,run.fortress/run.maxFortress);rounded(w*.19,h*.025,w*.62,h*.038,12);ctx.fillStyle="#071326dd";ctx.fill();rounded(w*.195,h*.031,w*.61*fortressRatio,h*.026,10);ctx.fillStyle=fortressRatio>.35?"#64efd5":"#ff647e";ctx.fill();
    for(const gate of run.gates){const x=px(gate.x-gate.half),y=py(gate.y-.035),gw=px(gate.half*2),gh=py(.07),positive=gate.kind!=="sub";ctx.save();ctx.shadowColor=positive?"#58f5df":"#ff5576";ctx.shadowBlur=d*.025;rounded(x,y,gw,gh,Math.min(18,gh*.24));ctx.fillStyle=positive?"#073f4dcc":"#4d1025d9";ctx.fill();ctx.lineWidth=Math.max(2,d*.004);ctx.strokeStyle=positive?"#8bffe8":"#ff8ba0";ctx.stroke();ctx.fillStyle="#fff";ctx.font=`900 ${Math.max(14,d*.035)}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(gateLabel(gate),px(gate.x),py(gate.y));ctx.restore()}
    const spiritCells=[[1,0],[0,1],[1,1]];
    for(const unit of run.units){const x=px(unit.x),y=py(unit.y),size=Math.max(24,d*(.04+Math.min(10,unit.count)*.0018)),cell=spiritCells[unit.sprite%spiritCells.length],drawn=drawAtlasCell(images.spirits,cell[0],cell[1],x,y,size,unit.hue===48?"#ffe369":"#64ebff");if(!drawn){ctx.save();ctx.shadowColor="#64ebff";ctx.shadowBlur=size*.4;ctx.fillStyle="#baf8ff";ctx.beginPath();ctx.arc(x,y,size*.22,0,Math.PI*2);ctx.fill();ctx.restore()}if(unit.count>1){ctx.fillStyle="#fff";ctx.strokeStyle="#051225";ctx.lineWidth=Math.max(2,d*.004);ctx.font=`900 ${Math.max(11,d*.019)}px sans-serif`;ctx.textAlign="center";ctx.strokeText(String(Math.round(unit.count)),x,y-size*.42);ctx.fillText(String(Math.round(unit.count)),x,y-size*.42)}}
    for(const enemy of run.enemies){const x=px(enemy.x),y=py(enemy.y),size=(enemy.champion?.075:.055)*d;drawImageCentered(enemy.champion?images.boss:images.enemy,x,y,size,enemy.champion?"#ff4f83":"#a66cff");const ratio=Math.max(0,enemy.hp/enemy.maxHp);rounded(x-size*.48,y-size*.66,size*.96,Math.max(4,d*.009),5);ctx.fillStyle="#170d25dd";ctx.fill();rounded(x-size*.48,y-size*.66,size*.96*ratio,Math.max(4,d*.009),5);ctx.fillStyle="#ff6a85";ctx.fill();if(enemy.shield>0){ctx.strokeStyle="#67eaff";ctx.lineWidth=Math.max(2,d*.004);ctx.beginPath();ctx.arc(x,y,size*.55,0,Math.PI*2);ctx.stroke()}}
    for(const particle of run.particles){ctx.globalAlpha=Math.max(0,particle.life);ctx.fillStyle=particle.color;ctx.beginPath();ctx.arc(px(particle.x),py(particle.y),Math.max(2,d*.006*particle.life),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    for(const text of run.texts){ctx.globalAlpha=Math.max(0,text.life);ctx.fillStyle=text.color;ctx.font=`900 ${Math.max(13,d*.026)}px sans-serif`;ctx.textAlign="center";ctx.fillText(text.text,px(text.x),py(text.y))}ctx.globalAlpha=1;
    const lx=px(run.aimX),ly=py(.91);drawAtlasCell(images.spirits,0,0,lx,ly,Math.max(60,d*.17),run.overdrive>0?"#ffe273":"#58e8ff");drawImageCentered(images.fox,lx-Math.max(34,d*.09),ly+d*.012,Math.max(34,d*.085),"#ffd66b");
  }
  function frame(now){raf=0;if(!run||run.finished||run.paused)return;const dt=Math.min(.04,(now-lastTime)/1000||0);lastTime=now;update(dt);draw();if(!run.finished&&!run.paused)raf=requestAnimationFrame(frame)}
  function resizeCanvas(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;draw()}}
  new ResizeObserver(resizeCanvas).observe(canvas);
  function aimFromEvent(event){if(!run||run.paused||run.finished)return;const rect=canvas.getBoundingClientRect();run.aimX=Math.max(.08,Math.min(.92,(event.clientX-rect.left)/rect.width))}
  canvas.addEventListener("pointerdown",(event)=>{canvas.setPointerCapture?.(event.pointerId);aimFromEvent(event)});canvas.addEventListener("pointermove",(event)=>{if(event.buttons||event.pointerType==="touch")aimFromEvent(event)});
  const held=new Set();window.addEventListener("keydown",(event)=>{if(["ArrowLeft","ArrowRight","a","A","d","D"].includes(event.key)&&currentScreen==="battle"&&!activeModal()){event.preventDefault();held.add(event.key)}if(event.key===" "&&currentScreen==="battle"&&!activeModal()){event.preventDefault();activateOverdrive()}if(event.key==="Escape"&&!event.defaultPrevented&&currentScreen==="battle"&&!activeModal())openLeave()});window.addEventListener("keyup",(event)=>held.delete(event.key));window.addEventListener("blur",()=>held.clear());document.addEventListener("visibilitychange",()=>{if(document.hidden)held.clear()});
  setInterval(()=>{if(!run||run.paused||run.finished)return;const left=["ArrowLeft","a","A"].some((key)=>held.has(key)),right=["ArrowRight","d","D"].some((key)=>held.has(key));if(left!==right)run.aimX=Math.max(.08,Math.min(.92,run.aimX+(right?1:-1)*.028))},16);
  function activateOverdrive(){if(!run||run.paused||run.finished)return false;if(run.charge<100){$("feedback").textContent=t("overdriveNeed",{charge:Math.floor(run.charge)});return false}run.charge=0;run.overdrive=3.6;$("feedback").textContent=t("overdriveUsed");updateHud(true);addBurst(run.aimX,.86,"#ffe273",24);window.WonderSound?.play?.("success");return true}
  $("overdrive").addEventListener("click",activateOverdrive);

  function activeModal(){return[$("leave"),$("tutorial"),$("result")].find((modal)=>!modal.hidden)||null}
  function modalButtons(modal){return[...modal.querySelectorAll("button:not([hidden]):not(:disabled)")]}
  function openModal(modal,focusTarget){modalReturnFocus=document.activeElement;if(run)run.paused=true;stopLoop();modal.hidden=false;$("battleLive").inert=true;requestAnimationFrame(()=>(focusTarget||modalButtons(modal)[0])?.focus())}
  function closeModal(modal,restore=true){modal.hidden=true;$("battleLive").inert=false;if(run&&!run.finished){run.paused=false;resumeLoop()}if(restore)(modalReturnFocus?.isConnected?modalReturnFocus:$("battleBack"))?.focus();modalReturnFocus=null}
  document.addEventListener("keydown",(event)=>{const modal=activeModal();if(!modal)return;if(event.key==="Tab"){const buttons=modalButtons(modal),first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}if(event.key==="Escape"&&modal===$("leave")){event.preventDefault();closeModal(modal)}});
  function openTutorial(){if(!run||run.finished)return;openModal($("tutorial"),$("tutorialDone"))}
  $("tutorialDone").addEventListener("click",()=>{save.tutorialSeen=true;persist();closeModal($("tutorial"))});
  function openLeave(){if(!run||run.finished||activeModal())return;openModal($("leave"),$("continueBattle"))}
  function finish(won){
    if(!run||run.finished)return;run.finished=true;run.paused=true;stopLoop();const remaining=Math.max(0,Math.ceil(run.time)),stars=won?1+(remaining>run.stage.time*.25?1:0)+(run.core===run.maxCore?1:0):0,earned=won?3+stars+run.stage.chapter:0;
    if(won){save.stars[run.stage.n]=Math.max(Number(save.stars[run.stage.n])||0,stars);save.unlocked=Math.max(save.unlocked,Math.min(30,run.stage.n+1));save.shards=Math.min(9999,save.shards+earned);persist()}
    $("resultKicker").textContent=won?`${t("shardsEarned")} +${earned}`:t("missionFailedKicker");$("resultTitle").textContent=t(won?"missionComplete":"missionFailed");$("resultText").textContent=t(won?"victoryText":"failureText");$("resultStats").innerHTML=`<span><b>${t("strength")}</b><strong>${run.peak}</strong></span><span><b>${t("coreHits")}</b><strong>${run.core}/${run.maxCore}</strong></span><span><b>${t("stars")}</b><strong>${"★".repeat(stars)}${"☆".repeat(3-stars)}</strong></span>`;$("nextMission").hidden=!won||run.stage.n>=30;$("result").hidden=false;$("battleLive").hidden=true;$("battleLive").inert=true;requestAnimationFrame(()=>(won&&!$("nextMission").hidden?$("nextMission"):$("retry")).focus());window.WonderSound?.play?.(won?"win":"wrong")
  }
  $("battleBack").addEventListener("click",openLeave);$("battleHelp").addEventListener("click",openTutorial);$("continueBattle").addEventListener("click",()=>closeModal($("leave")));$("leaveStage").addEventListener("click",()=>{$("leave").hidden=true;$("battleLive").inert=false;run=null;showScreen("stage")});$("retry").addEventListener("click",()=>startBattle(run.stageIndex));$("resultStage").addEventListener("click",()=>{$("result").hidden=true;$("battleLive").inert=false;run=null;showScreen("stage")});$("nextMission").addEventListener("click",()=>startBattle(Math.min(29,run.stageIndex+1)));
  function loadImages(){return Promise.all(Object.entries(imageSources).map(([key,src])=>new Promise((resolve)=>{const image=new Image();images[key]=image;image.onload=image.onerror=resolve;image.src=src})))}
  Promise.all([loadImages(),new Promise((resolve)=>setTimeout(resolve,350))]).then(()=>{$("loadingFill").style.width="100%";setTimeout(()=>{$("loading").hidden=true;showScreen("main")},160)});
  applyLocale();
  window.__animalPrismBattalionTest={
    stages,startBattle,setAim(value){if(run)run.aimX=Math.max(.08,Math.min(.92,Number(value)))},activateOverdrive,
    advance(seconds,step=1/60){const iterations=Math.ceil(seconds/step);for(let i=0;i<iterations&&run&&!run.finished;i+=1)update(step);draw()},
    setTime(seconds){if(run)run.time=Number(seconds)},clearEnemies(){if(run)run.enemies=[]},damageFortress(amount){if(run){run.fortress-=Number(amount);if(run.fortress<=0)finish(true)}},finish,
    grantProgress(unlocked=3,shards=30){save.unlocked=Math.max(1,Math.min(30,unlocked));save.shards=Math.max(save.shards,shards);persist();renderStage();renderLab()},setUpgrades(rate=0,power=0,armor=0){save.upgrades=normalizeSave({upgrades:{rate,power,armor}}).upgrades;persist();renderLab()},resetSave(){save=defaultSave();persist();applyLocale()},
    snapshot(){return{locale,screen:currentScreen,save:JSON.parse(JSON.stringify(save)),run:run&&{stageIndex:run.stageIndex,time:run.time,core:run.core,maxCore:run.maxCore,fortress:run.fortress,maxFortress:run.maxFortress,aimX:run.aimX,charge:run.charge,overdrive:run.overdrive,peak:run.peak,units:run.units.map((unit)=>({x:unit.x,y:unit.y,count:unit.count,gates:[...unit.gates]})),enemies:run.enemies.map((enemy)=>({...enemy})),gates:run.gates.map((gate)=>({...gate})),paused:run.paused,finished:run.finished}}}
  };
})();
