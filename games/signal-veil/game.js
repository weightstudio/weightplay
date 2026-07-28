(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const SAVE_KEY = "weightplay-signal-veil-v1";
  const LOCALE_PATHS = {en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const PATH_LOCALES = Object.fromEntries(Object.entries(LOCALE_PATHS).map(([key,value]) => [value,key]));
  const WORLD = {width:3072,height:1024};
  const BASE_VIEW = {width:960,height:540};
  const atlas = {sprites:new Image(),items:new Image(),npcs:new Image(),world:new Image()};
  atlas.sprites.src = "/assets/signal-veil-sprites.webp";
  atlas.items.src = "/assets/signal-veil-items.webp";
  atlas.npcs.src = "/assets/signal-veil-npcs.webp";
  atlas.world.src = "/assets/signal-veil-world.webp";

  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch { return null; }
  }
  function routeLocale() {
    const match = location.pathname.match(/^\/([^/]+)\/games\/signal-veil\//);
    return PATH_LOCALES[match?.[1]?.toLowerCase()] || localStorage.getItem("weightPlayLocale") || "en";
  }

  let locale = window.SIGNAL_VEIL_LOCALES[routeLocale()] ? routeLocale() : "en";
  let copy = window.SIGNAL_VEIL_LOCALES[locale];
  const template = (text, data={}) => String(text || "").replace(/\{(\w+)\}/g, (_,key) => data[key] ?? "");
  function t(key, data) {
    let value = copy[key] ?? window.SIGNAL_VEIL_LOCALES.en[key] ?? key;
    if (locale === "zh-Hans" && typeof value === "string") value = window.WonderI18n?.simplifyChineseText?.(value) || value;
    return template(value, data);
  }

  const canvas = $("#gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const nodes = {
    main:$("#main"), battle:$("#battleShell"), loading:$("#loadingPanel"), locale:$("#localeSelect"),
    progress:$("#mainProgress"), level:$("#levelValue"), hpFill:$("#hpFill"), hpText:$("#hpText"),
    xpFill:$("#xpFill"), xpText:$("#xpText"), visionState:$("#visionState"), zone:$("#zoneLabel"),
    objective:$("#objective"), toast:$("#toast"), dialogue:$("#dialogue"), speaker:$("#speaker"),
    dialogueText:$("#dialogueText"), dialogueNext:$("#dialogueNext"), overlay:$("#overlay"),
    pause:$("#pausePanel"), inventory:$("#inventoryPanel"), leave:$("#leavePanel"), result:$("#resultPanel"),
    weaponName:$("#weaponName"), armorName:$("#armorName"), accessoryName:$("#accessoryName"), stats:$("#stats"),
    diamondBalance:$("#diamondBalance"), buyAnchor:$("#buyAnchor"), anchorStatus:$("#anchorStatus"),
    joystick:$("#joystick"), stick:$("#stick"), attack:$("#attackButton"), skill:$("#skillButton"), vision:$("#visionButton")
  };

  const fresh = {
    x:420,y:545,facing:"right",level:1,xp:0,hp:40,maxHp:40,attack:8,defense:2,
    visionUnlocked:false,trueVision:false,talked:[],defeated:[],chests:[],bossDefeated:false,
    equipment:{weapon:false,armor:false,accessory:false},signalAnchor:false,checkpoint:{x:420,y:545}
  };
  let state = Object.assign({}, fresh, readSave() || {});
  state.talked = new Set(state.talked || []);
  state.defeated = new Set(state.defeated || []);
  state.chests = new Set(state.chests || []);
  state.equipment = Object.assign({}, fresh.equipment, state.equipment || {});
  state.checkpoint = Object.assign({}, fresh.checkpoint, state.checkpoint || {});
  let playing = false, paused = false, trueVision = Boolean(state.trueVision), currentDialogue = null;
  let attackCooldown = 0, skillCooldown = 0, invulnerability = 0, swingTimer = 0, lastTime = 0, toastTimer = 0;
  let bossIntroduced = false, resultClaimed = false;
  const keys = new Set();
  const projectiles = [];
  const enemyProjectiles = [];
  const effects = [];
  const touchMove = {x:0,y:0};

  const npcs = [
    {x:470,y:520,index:0,reveal:false},{x:310,y:310,index:1,reveal:true},{x:720,y:300,index:2,reveal:true},
    {x:810,y:560,index:3,reveal:true},{x:635,y:720,index:4,reveal:false},{x:260,y:690,index:5,reveal:false},
    {x:470,y:805,index:6,reveal:false},{x:855,y:805,index:7,reveal:false},{x:875,y:420,index:8,reveal:false},
    {x:370,y:450,index:9,reveal:false}
  ];
  const enemySeeds = [
    [1100,340,4],[1230,650,5],[1360,450,4],[1490,760,6],[1620,300,5],[1730,600,7],[1860,430,4],[1930,760,7],
    [2160,310,8],[2260,670,9],[2380,430,10],[2470,790,8],[2580,300,11],[2680,620,10],[2760,790,9]
  ];
  let enemies = enemySeeds.map(([x,y,sprite],id) => ({
    id,x,y,homeX:x,homeY:y,sprite,hp:26 + (id > 7 ? 15 : 0),maxHp:26 + (id > 7 ? 15 : 0),
    speed:50 + (id % 3) * 10,attackTimer:0,phase:id*.73,hidden:sprite===7,dead:state.defeated.has(id)
  }));
  let boss = {x:2890,y:520,hp:260,maxHp:260,attackTimer:1.2,pattern:0,dead:state.bossDefeated,sprite:12,stun:0,charge:0};
  const chests = [
    {id:"weapon",x:1430,y:270,item:"weapon",hidden:true},{id:"accessory",x:1840,y:810,item:"accessory",hidden:true},
    {id:"armor",x:2360,y:250,item:"armor",hidden:false}
  ];

  function serializedState() {
    return {...state,trueVision,talked:[...state.talked],defeated:[...state.defeated],chests:[...state.chests]};
  }
  function saveGame(showNotice=false) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(serializedState())); } catch {}
    updateMainProgress();
    if (showNotice) showToast(t("saved"));
  }
  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
  }

  function applyLocale() {
    copy = window.SIGNAL_VEIL_LOCALES[locale] || window.SIGNAL_VEIL_LOCALES.en;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node => node.textContent = t(node.dataset.t));
    document.querySelectorAll("[data-t-alt]").forEach(node => node.setAttribute("alt", t(node.dataset.tAlt)));
    nodes.locale.value = locale;
    updateHud();
    updateObjective();
    renderInventory();
    window.dispatchEvent(new CustomEvent("wonder:locale-change",{detail:{locale}}));
  }
  Object.entries(window.SIGNAL_VEIL_LOCALES).forEach(([code,data]) => {
    const option = document.createElement("option"); option.value=code; option.textContent=data.label; nodes.locale.append(option);
  });
  nodes.locale.addEventListener("change", () => {
    const next = nodes.locale.value;
    try { localStorage.setItem("weightPlayLocale",next); } catch {}
    if (/^https?:$/.test(location.protocol)) {
      location.href = `/${LOCALE_PATHS[next]}/games/signal-veil/${location.search}${location.hash}`;
    } else {
      locale=next; applyLocale();
    }
  });

  function updateMainProgress() {
    const milestones = Number(state.talked.size >= 10) + Number(state.defeated.size >= 15) + Number(state.bossDefeated);
    nodes.progress.textContent = `${milestones} / 3`;
  }
  function zoneKey() {
    if (state.x < 1024) return "zoneTown";
    if (state.x < 2048) return "zoneForest";
    return "zoneLab";
  }
  function updateObjective() {
    let text;
    if (state.bossDefeated) text=t("objectiveComplete");
    else if (!state.visionUnlocked) text=t("objectiveTalk");
    else if (state.talked.size < 10) text=t("objectiveWitnesses",{n:state.talked.size});
    else if (state.defeated.size < 8) text=t("objectiveForest",{n:state.defeated.size});
    else if (state.defeated.size < 15) text=t("objectiveLab",{n:state.defeated.size});
    else text=t("objectiveBoss");
    nodes.objective.textContent=text;
  }
  function updateHud() {
    nodes.level.textContent=state.level;
    nodes.hpFill.style.width=`${clamp(state.hp/state.maxHp*100,0,100)}%`;
    nodes.hpText.textContent=`${Math.ceil(state.hp)} / ${state.maxHp}`;
    const need=30+(state.level-1)*22;
    nodes.xpFill.style.width=`${clamp(state.xp/need*100,0,100)}%`;
    nodes.xpText.textContent=`${state.xp} / ${need}`;
    nodes.visionState.textContent=trueVision?t("trueVision"):t("normalVision");
    nodes.visionState.classList.toggle("active",trueVision);
    nodes.vision.classList.toggle("ready",state.visionUnlocked);
    nodes.skill.classList.toggle("cooldown",skillCooldown>0);
    nodes.zone.textContent=t(zoneKey());
    canvas.dataset.playerX=String(Math.round(state.x));
    canvas.dataset.playerY=String(Math.round(state.y));
    canvas.dataset.enemiesDefeated=String(state.defeated.size);
    canvas.dataset.witnesses=String(state.talked.size);
    canvas.dataset.totalEnemies=String(enemySeeds.length);
    canvas.dataset.totalNpcs=String(npcs.length);
    canvas.dataset.bossHp=String(Math.max(0,Math.ceil(boss?.hp ?? 0)));
    canvas.dataset.vision=trueVision?"true":"normal";
  }
  function renderInventory() {
    nodes.weaponName.textContent=state.equipment.weapon?t("weaponName"):t("none");
    nodes.armorName.textContent=state.equipment.armor?t("armorName"):t("none");
    nodes.accessoryName.textContent=state.equipment.accessory?t("accessoryName"):t("none");
    nodes.stats.innerHTML=`<span><b>${t("statHp")}</b><br>${state.maxHp}</span><span><b>${t("statAtk")}</b><br>${effectiveAttack()}</span><span><b>${t("statDef")}</b><br>${effectiveDefense()}</span>`;
    const diamonds=window.WeightPlayWallet?.read?.().diamonds || 0;
    nodes.diamondBalance.textContent=String(diamonds);
    nodes.buyAnchor.disabled=Boolean(state.signalAnchor);
    nodes.buyAnchor.textContent=state.signalAnchor?t("anchorOwned"):t("anchorBuy");
    nodes.anchorStatus.textContent=state.signalAnchor?t("anchorPermanent"):template(t("anchorBalance"),{n:diamonds});
  }
  function buySignalAnchor(){
    if(state.signalAnchor)return;
    const wallet=window.WeightPlayWallet;
    if(!wallet?.spendDiamonds?.(5)){nodes.anchorStatus.textContent=template(t("anchorNeed"),{n:wallet?.read?.().diamonds || 0});return}
    state.signalAnchor=true;state.maxHp+=12;state.hp=Math.min(state.maxHp,state.hp+12);
    saveGame();renderInventory();updateHud();showToast(t("anchorInstalled"),2200);
    window.WonderAnalytics?.track?.("diamond_spend",{game_id:"signal-veil",item:"signal_anchor",cost:5,balance:wallet.read().diamonds});
  }
  function effectiveAttack(){return state.attack+(state.equipment.weapon?5:0)+(state.equipment.accessory?2:0)}
  function effectiveDefense(){return state.defense+(state.equipment.armor?4:0)+(state.equipment.accessory?1:0)}

  function showToast(message,duration=1800) {
    nodes.toast.textContent=message; nodes.toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>nodes.toast.classList.remove("show"),duration);
  }
  function setPanel(panel) {
    [nodes.pause,nodes.inventory,nodes.leave,nodes.result].forEach(item => item.hidden=item!==panel);
    nodes.overlay.hidden=!panel;
    paused=Boolean(panel);
    if (panel) setTimeout(()=>panel.querySelector("button:not([disabled])")?.focus(),0);
    else canvas.focus({preventScroll:true});
  }
  function showDialogue(index) {
    const wasNew=!state.talked.has(index);
    if (wasNew) state.talked.add(index);
    if (index===0 && !state.visionUnlocked) {
      state.visionUnlocked=true; showToast(t("visionUnlocked"),2800);
    }
    currentDialogue=index; paused=true;
    nodes.speaker.textContent=(copy.npcNames||en.npcNames)[index] || en.npcNames[index];
    nodes.dialogueText.textContent=(copy.npcLines||en.npcLines)[index] || en.npcLines[index];
    nodes.dialogue.hidden=false; nodes.dialogueNext.focus();
    if (wasNew) { saveGame(); updateObjective(); updateHud(); }
  }
  function closeDialogue() {
    nodes.dialogue.hidden=true; currentDialogue=null; paused=false; canvas.focus({preventScroll:true});
  }

  function resizeCanvas() {
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;ctx.imageSmoothingEnabled=false}
  }
  function viewTransform() {
    const scale=Math.max(canvas.width/BASE_VIEW.width,canvas.height/BASE_VIEW.height);
    const drawW=BASE_VIEW.width*scale,drawH=BASE_VIEW.height*scale;
    return {scale,ox:(canvas.width-drawW)/2,oy:(canvas.height-drawH)/2};
  }
  function camera() {
    return {x:clamp(state.x-BASE_VIEW.width/2,0,WORLD.width-BASE_VIEW.width),y:clamp(state.y-BASE_VIEW.height/2,0,WORLD.height-BASE_VIEW.height)};
  }
  function drawAtlas(image,index,columns,rows,x,y,w,h,alpha=1) {
    if(!image.complete||!image.naturalWidth)return;
    const cellW=image.naturalWidth/columns,cellH=image.naturalHeight/rows;
    const col=index%columns,row=Math.floor(index/columns);
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(image,col*cellW,row*cellH,cellW,cellH,x-w/2,y-h/2,w,h);ctx.restore();
  }
  function drawWorld(cam) {
    if(atlas.world.complete&&atlas.world.naturalWidth) ctx.drawImage(atlas.world,0,0,atlas.world.naturalWidth,atlas.world.naturalHeight,-cam.x,-cam.y,WORLD.width,WORLD.height);
    else {ctx.fillStyle="#08222b";ctx.fillRect(0,0,BASE_VIEW.width,BASE_VIEW.height)}
    if(trueVision){
      ctx.save();ctx.globalCompositeOperation="screen";ctx.strokeStyle="#45ffff99";ctx.lineWidth=8;ctx.setLineDash([10,14]);
      ctx.beginPath();ctx.moveTo(930-cam.x,520-cam.y);ctx.bezierCurveTo(1400-cam.x,260-cam.y,1750-cam.x,780-cam.y,2070-cam.x,520-cam.y);ctx.stroke();ctx.restore();
    }
  }
  function drawEntityBars(entity,cam,width=62) {
    const ratio=clamp(entity.hp/entity.maxHp,0,1),x=entity.x-cam.x-width/2,y=entity.y-cam.y-50;
    ctx.fillStyle="#08141dcc";ctx.fillRect(x,y,width,7);ctx.fillStyle=entity===boss?"#ffb333":"#ef6060";ctx.fillRect(x,y,width*ratio,7);
  }
  function render() {
    resizeCanvas();
    const tr=viewTransform(),cam=camera();
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.translate(tr.ox,tr.oy);ctx.scale(tr.scale,tr.scale);ctx.beginPath();ctx.rect(0,0,BASE_VIEW.width,BASE_VIEW.height);ctx.clip();
    drawWorld(cam);
    chests.forEach(chest=>{
      if(state.chests.has(chest.id)||(chest.hidden&&!trueVision))return;
      drawAtlas(atlas.items,6,4,4,chest.x-cam.x,chest.y-cam.y,70,70);
      if(trueVision){ctx.strokeStyle="#4ff4f4";ctx.lineWidth=3;ctx.strokeRect(chest.x-cam.x-36,chest.y-cam.y-36,72,72)}
    });
    npcs.forEach((npc,index)=>{
      if(trueVision&&npc.reveal) drawAtlas(atlas.sprites,8+(index%4),4,4,npc.x-cam.x,npc.y-cam.y,80,80);
      else drawAtlas(atlas.npcs,index,5,2,npc.x-cam.x,npc.y-cam.y,76,82);
      if(!state.talked.has(index)){ctx.fillStyle="#ffc550";ctx.font="900 23px sans-serif";ctx.textAlign="center";ctx.fillText("!",npc.x-cam.x,npc.y-cam.y-47)}
    });
    enemies.forEach(enemy=>{
      if(enemy.dead||(enemy.hidden&&!trueVision))return;
      drawAtlas(atlas.sprites,enemy.sprite,4,4,enemy.x-cam.x,enemy.y-cam.y,78,78);
      drawEntityBars(enemy,cam,54);
    });
    if(!boss.dead&&state.defeated.size>=15){
      drawAtlas(atlas.sprites,boss.sprite,4,4,boss.x-cam.x,boss.y-cam.y,132,132);
      drawEntityBars(boss,cam,118);
    }
    projectiles.forEach(p=>drawAtlas(atlas.items,9,4,4,p.x-cam.x,p.y-cam.y,44,44));
    enemyProjectiles.forEach(p=>drawAtlas(atlas.items,10,4,4,p.x-cam.x,p.y-cam.y,38,38));
    effects.forEach(f=>drawAtlas(atlas.items,f.index,4,4,f.x-cam.x,f.y-cam.y,f.size,f.size,f.life/.35));
    const facingIndex={down:0,left:1,right:2,up:3}[state.facing]||0;
    drawAtlas(atlas.sprites,facingIndex,4,4,state.x-cam.x,state.y-cam.y,78,78,invulnerability>0&&Math.floor(invulnerability*12)%2?0.35:1);
    if(swingTimer>0) {
      const vector=facingVector();drawAtlas(atlas.items,8,4,4,state.x-cam.x+vector.x*48,state.y-cam.y+vector.y*48,76,76);
    }
    const target=nearestInteractable();
    if(target&&!paused){
      ctx.fillStyle="#05141be8";ctx.strokeStyle="#4ff4f4";ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(BASE_VIEW.width/2-90,BASE_VIEW.height-52,180,34,12);ctx.fill();ctx.stroke();
      ctx.fillStyle="#fff";ctx.font="800 14px sans-serif";ctx.textAlign="center";ctx.fillText(t("interact"),BASE_VIEW.width/2,BASE_VIEW.height-30);
    }
    if(state.x<1000&&state.talked.size<10){ctx.fillStyle="#ffb13b";ctx.fillRect(996-cam.x,350-cam.y,8,340)}
    if(state.x<2050&&!trueVision){ctx.fillStyle="#43eef255";ctx.fillRect(2038-cam.x,280-cam.y,14,480)}
    ctx.restore();
  }

  function facingVector(){return {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[state.facing]}
  function movementVector() {
    let x=touchMove.x+(keys.has("arrowright")||keys.has("d")?1:0)-(keys.has("arrowleft")||keys.has("a")?1:0);
    let y=touchMove.y+(keys.has("arrowdown")||keys.has("s")?1:0)-(keys.has("arrowup")||keys.has("w")?1:0);
    const length=Math.hypot(x,y)||1;return {x:x/Math.max(1,length),y:y/Math.max(1,length)};
  }
  function setFacing(move) {
    if(Math.abs(move.x)>Math.abs(move.y))state.facing=move.x>0?"right":"left";
    else if(Math.abs(move.y)>.05)state.facing=move.y>0?"down":"up";
  }
  function movePlayer(dt) {
    const move=movementVector();if(Math.abs(move.x)+Math.abs(move.y)<.05)return;
    setFacing(move);const speed=185;
    let nx=clamp(state.x+move.x*speed*dt,55,WORLD.width-55),ny=clamp(state.y+move.y*speed*dt,75,WORLD.height-55);
    if(nx>995&&state.x<=1020&&state.talked.size<10){nx=995;showToast(t("lockedForest"))}
    if(nx>2040&&state.x<=2070&&!trueVision){nx=2040;showToast(t("lockedLab"))}
    state.x=nx;state.y=ny;
    if(state.x>1060&&state.checkpoint.x<1000)state.checkpoint={x:1080,y:520};
    if(state.x>2100&&state.checkpoint.x<2000)state.checkpoint={x:2110,y:520};
  }
  function nearestInteractable() {
    const npc=npcs.map((value,index)=>({...value,kind:"npc",index})).filter(value=>distance(state,value)<82).sort((a,b)=>distance(state,a)-distance(state,b))[0];
    if(npc)return npc;
    return chests.filter(chest=>!state.chests.has(chest.id)&&(!chest.hidden||trueVision)&&distance(state,chest)<85).map(chest=>({...chest,kind:"chest"}))[0]||null;
  }
  function interact() {
    if(paused)return;const target=nearestInteractable();if(!target)return;
    if(target.kind==="npc")showDialogue(target.index);else openChest(target);
  }
  function openChest(chest) {
    state.chests.add(chest.id);state.equipment[chest.item]=true;
    if(chest.item==="armor")state.hp=Math.min(state.maxHp,state.hp+12);
    showToast(t("chest",{item:t(`${chest.item}Name`)}),2400);renderInventory();saveGame();
  }
  function attack() {
    if(paused||attackCooldown>0)return;
    canvas.dataset.lastAction="attack";
    attackCooldown=.32;swingTimer=.18;playTone(150,.07);const v=facingVector(),point={x:state.x+v.x*62,y:state.y+v.y*62};
    enemies.forEach(enemy=>{if(!enemy.dead&&(!enemy.hidden||trueVision)&&distance(point,enemy)<78)damageEnemy(enemy,effectiveAttack())});
    if(!boss.dead&&state.defeated.size>=15&&distance(point,boss)<105)damageBoss(effectiveAttack());
  }
  function useSkill() {
    if(paused||skillCooldown>0)return;
    canvas.dataset.lastAction="skill";
    skillCooldown=2.4;const v=facingVector();projectiles.push({x:state.x+v.x*40,y:state.y+v.y*40,vx:v.x*470,vy:v.y*470,life:1.3,damage:effectiveAttack()*.78});playTone(520,.1);
  }
  function toggleVision() {
    if(paused)return;
    if(!state.visionUnlocked){canvas.dataset.lastAction="vision-locked";showToast(t("objectiveTalk"));return}
    trueVision=!trueVision;state.trueVision=trueVision;showToast(t(trueVision?"visionOn":"visionOff"));updateHud();saveGame();
    canvas.dataset.lastAction=trueVision?"vision-on":"vision-off";
  }
  function damageEnemy(enemy,amount) {
    enemy.hp-=amount;effects.push({x:enemy.x,y:enemy.y,index:10,size:52,life:.35});
    if(enemy.hp<=0){
      enemy.dead=true;state.defeated.add(enemy.id);gainXp(12+(enemy.id>7?6:0));playTone(240,.12);
      updateObjective();saveGame();
    }
  }
  function damageBoss(amount) {
    if(boss.stun>0)amount*=1.45;boss.hp-=amount;effects.push({x:boss.x,y:boss.y,index:10,size:72,life:.35});
    if(boss.hp<=0)finishBoss();
  }
  function gainXp(amount) {
    state.xp+=amount;let need=30+(state.level-1)*22;
    while(state.xp>=need){state.xp-=need;state.level++;state.maxHp+=8;state.attack+=2;state.defense+=1;state.hp=state.maxHp;showToast(t("levelUp",{n:state.level}),2400);need=30+(state.level-1)*22;playTone(720,.18)}
    updateHud();
  }
  function hurt(amount) {
    if(invulnerability>0||paused)return;
    state.hp-=Math.max(1,amount-effectiveDefense());invulnerability=.75;playTone(90,.12);
    if(state.hp<=0){
      state.hp=state.maxHp;state.x=state.checkpoint.x;state.y=state.checkpoint.y;
      enemyProjectiles.length=0;showToast(t("defeated"),2500);saveGame();
    }
    updateHud();
  }
  function updateEnemies(dt) {
    enemies.forEach(enemy=>{
      if(enemy.dead||(enemy.hidden&&!trueVision))return;
      enemy.attackTimer-=dt;const dist=distance(state,enemy);
      if(dist<310){
        const dx=(state.x-enemy.x)/(dist||1),dy=(state.y-enemy.y)/(dist||1);
        if(dist>55){enemy.x+=dx*enemy.speed*dt;enemy.y+=dy*enemy.speed*dt}
        else if(enemy.attackTimer<=0){hurt(enemy.id>7?10:7);enemy.attackTimer=1.05+(enemy.id%3)*.2}
      } else {
        enemy.phase+=dt*.7;const tx=enemy.homeX+Math.cos(enemy.phase)*55,ty=enemy.homeY+Math.sin(enemy.phase*.8)*40;
        enemy.x+=(tx-enemy.x)*dt*.7;enemy.y+=(ty-enemy.y)*dt*.7;
      }
    });
  }
  function updateBoss(dt) {
    if(boss.dead||state.defeated.size<15)return;
    const dist=distance(state,boss);
    if(dist<500&&!bossIntroduced){bossIntroduced=true;showToast(t("bossAppears"),3000)}
    if(dist>600)return;
    boss.attackTimer-=dt;boss.stun=Math.max(0,boss.stun-dt);
    if(boss.charge>0){
      boss.charge-=dt;const dx=(state.x-boss.x)/(dist||1),dy=(state.y-boss.y)/(dist||1);boss.x+=dx*250*dt;boss.y+=dy*250*dt;
      if(dist<75)hurt(17);return;
    }
    if(boss.attackTimer<=0){
      const ratio=boss.hp/boss.maxHp;boss.pattern=(boss.pattern+1)%3;
      if(boss.pattern===0){
        const count=ratio<.5?10:7;
        for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;enemyProjectiles.push({x:boss.x,y:boss.y,vx:Math.cos(angle)*170,vy:Math.sin(angle)*170,life:4,damage:11})}
        boss.sprite=14;
      } else if(boss.pattern===1){boss.charge=.75;boss.sprite=13}
      else {boss.stun=1.15;boss.sprite=15}
      boss.attackTimer=ratio<.5?1.45:2.05;
    }
  }
  function updateProjectiles(dt) {
    projectiles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt});
    enemyProjectiles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(distance(state,p)<35){hurt(p.damage);p.life=0}});
    for(let i=projectiles.length-1;i>=0;i--){
      const p=projectiles[i];let hit=false;
      enemies.forEach(enemy=>{if(!hit&&!enemy.dead&&(!enemy.hidden||trueVision)&&distance(p,enemy)<45){damageEnemy(enemy,p.damage);hit=true}});
      if(!hit&&!boss.dead&&state.defeated.size>=15&&distance(p,boss)<70){damageBoss(p.damage);hit=true}
      if(hit||p.life<=0||p.x<0||p.x>WORLD.width||p.y<0||p.y>WORLD.height)projectiles.splice(i,1);
    }
    for(let i=enemyProjectiles.length-1;i>=0;i--)if(enemyProjectiles[i].life<=0)enemyProjectiles.splice(i,1);
    effects.forEach(f=>f.life-=dt);for(let i=effects.length-1;i>=0;i--)if(effects[i].life<=0)effects.splice(i,1);
  }
  function finishBoss() {
    boss.dead=true;state.bossDefeated=true;state.visionUnlocked=true;trueVision=true;state.trueVision=true;
    state.xp+=80;saveGame();updateObjective();updateHud();resultClaimed=false;
    setTimeout(()=>setPanel(nodes.result),500);playTone(820,.35);
  }

  function update(dt) {
    if(!playing||paused)return;
    attackCooldown=Math.max(0,attackCooldown-dt);skillCooldown=Math.max(0,skillCooldown-dt);invulnerability=Math.max(0,invulnerability-dt);swingTimer=Math.max(0,swingTimer-dt);
    movePlayer(dt);updateEnemies(dt);updateBoss(dt);updateProjectiles(dt);updateHud();
  }
  function frame(time) {
    const dt=Math.min(.033,(time-lastTime)/1000||0);lastTime=time;update(dt);if(playing)render();requestAnimationFrame(frame);
  }
  function playTone(frequency,duration) {
    if(window.WonderSound?.isMuted?.())return;
    try{const audio=playTone.audio||(playTone.audio=new (window.AudioContext||window.webkitAudioContext)()),osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;osc.type="square";gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration)}catch{}
  }
  function showBattle() {
    nodes.main.hidden=true;nodes.battle.hidden=false;playing=true;paused=false;lastTime=performance.now();resizeCanvas();updateHud();updateObjective();renderInventory();canvas.focus({preventScroll:true});
  }
  function showMain() {
    saveGame();playing=false;paused=false;nodes.battle.hidden=true;nodes.main.hidden=false;setPanel(null);closeDialogue();scrollTo({top:0,behavior:"instant"});updateMainProgress();
  }
  function restartGame() {
    const keepAnchor=Boolean(state.signalAnchor);clearSave();
    state={...fresh,maxHp:fresh.maxHp+(keepAnchor?12:0),hp:fresh.hp+(keepAnchor?12:0),signalAnchor:keepAnchor,talked:new Set(),defeated:new Set(),chests:new Set(),equipment:{...fresh.equipment},checkpoint:{...fresh.checkpoint}};
    trueVision=false;enemies=enemySeeds.map(([x,y,sprite],id)=>({id,x,y,homeX:x,homeY:y,sprite,hp:26+(id>7?15:0),maxHp:26+(id>7?15:0),speed:50+(id%3)*10,attackTimer:0,phase:id*.73,hidden:sprite===7,dead:false}));
    boss={x:2890,y:520,hp:260,maxHp:260,attackTimer:1.2,pattern:0,dead:false,sprite:12,stun:0,charge:0};bossIntroduced=false;
    projectiles.length=0;enemyProjectiles.length=0;setPanel(null);showBattle();saveGame();
  }

  addEventListener("keydown",event=>{
    const key=event.key.toLowerCase();
    if(["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d","j","k","v","e","escape"].includes(key))event.preventDefault();
    keys.add(key);
    if(event.repeat)return;
    if(!paused&&["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(key)){
      const nudge={arrowup:[0,-10],w:[0,-10],arrowdown:[0,10],s:[0,10],arrowleft:[-10,0],a:[-10,0],arrowright:[10,0],d:[10,0]}[key];
      state.x=clamp(state.x+nudge[0],55,WORLD.width-55);state.y=clamp(state.y+nudge[1],75,WORLD.height-55);
      if(state.x>995&&state.talked.size<10)state.x=995;
      if(state.x>2040&&!trueVision)state.x=2040;
      setFacing({x:nudge[0],y:nudge[1]});updateHud();
    }
    if(key===" "||key==="j")attack();
    if(key==="k")useSkill();
    if(key==="v")toggleVision();
    if(key==="e"||key==="enter"){if(currentDialogue!==null)closeDialogue();else interact()}
    if(key==="escape"){
      if(currentDialogue!==null)closeDialogue();
      else if(!nodes.overlay.hidden)setPanel(null);
      else if(playing)setPanel(nodes.pause);
    }
  });
  addEventListener("keyup",event=>keys.delete(event.key.toLowerCase()));
  addEventListener("blur",()=>{keys.clear();if(playing&&!paused)setPanel(nodes.pause)});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&playing&&!paused)setPanel(nodes.pause)});
  $("#startGame").addEventListener("click",showBattle);
  $("#menuButton").addEventListener("click",()=>setPanel(nodes.pause));
  $("#battleBack").addEventListener("click",()=>setPanel(nodes.leave));
  $("#resumeButton").addEventListener("click",()=>setPanel(null));
  $("#inventoryButton").addEventListener("click",()=>{renderInventory();setPanel(nodes.inventory)});
  nodes.buyAnchor.addEventListener("click",buySignalAnchor);
  $("#closeInventory").addEventListener("click",()=>setPanel(nodes.pause));
  $("#saveButton").addEventListener("click",()=>saveGame(true));
  $("#returnButton").addEventListener("click",()=>setPanel(nodes.leave));
  $("#continueButton").addEventListener("click",()=>setPanel(null));
  $("#confirmLeaveButton").addEventListener("click",showMain);
  $("#dialogueNext").addEventListener("click",closeDialogue);
  $("#continueExplore").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;setPanel(null)});
  $("#newGameButton").addEventListener("click",()=>{if(resultClaimed)return;resultClaimed=true;restartGame()});
  nodes.attack.addEventListener("pointerdown",event=>{event.preventDefault();attack()});
  nodes.skill.addEventListener("pointerdown",event=>{event.preventDefault();useSkill()});
  nodes.vision.addEventListener("pointerdown",event=>{event.preventDefault();toggleVision()});
  canvas.addEventListener("pointerdown",event=>{if(event.pointerType==="mouse"&&event.button===0)attack()});

  let joystickPointer=null;
  function updateJoystick(event) {
    const rect=nodes.joystick.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    let x=(event.clientX-cx)/(rect.width*.36),y=(event.clientY-cy)/(rect.height*.36);const length=Math.hypot(x,y);
    if(length>1){x/=length;y/=length}touchMove.x=x;touchMove.y=y;nodes.stick.style.transform=`translate(${x*27}px,${y*27}px)`;
  }
  nodes.joystick.addEventListener("pointerdown",event=>{joystickPointer=event.pointerId;nodes.joystick.setPointerCapture(event.pointerId);updateJoystick(event)});
  nodes.joystick.addEventListener("pointermove",event=>{if(event.pointerId===joystickPointer)updateJoystick(event)});
  function releaseJoystick(event){if(event.pointerId!==joystickPointer)return;joystickPointer=null;touchMove.x=0;touchMove.y=0;nodes.stick.style.transform="translate(0,0)"}
  nodes.joystick.addEventListener("pointerup",releaseJoystick);nodes.joystick.addEventListener("pointercancel",releaseJoystick);

  Promise.all(Object.values(atlas).map(image=>image.decode?.().catch(()=>{})||Promise.resolve())).finally(()=>{
    setTimeout(()=>{nodes.loading.hidden=true},350);
  });
  applyLocale();updateMainProgress();renderInventory();requestAnimationFrame(frame);
})();
