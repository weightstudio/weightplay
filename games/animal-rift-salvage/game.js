(function(){
"use strict";
const MODULE_URL = new URL("/games/animal-rift-salvage/rift-world.mjs?v=20261018-rift-mobile-control-1", location.href).href;
let world = null, graphicsError = null;
const fxFlights = [];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const audioScope = window.WeightPlayAudio?.createScope();
const sound = id => audioScope?.play(id);
window.WeightPlayAudio?.preload(["reward.collect","reward.upgrade","player.hurt","combat.block","weapon.laser.fire","result.win","result.lose","feedback.error"]);

  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || lifecyclePaused), node: document.body,
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

const $=id=>document.getElementById(id),LOCALES=window.RIFT_SALVAGE_LOCALES||{},CODES=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"],LABELS={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"},STORE="weightplay:animal-rift-salvage:v1",WORLD=1000,TAU=Math.PI*2;
const PUBLIC_INFO={
en:["GENERAL · 30-ZONE CAMPAIGN","PUBLIC GAME GUIDE","Learn the complete salvage loop, from safe size routes to rescue cores, rivals, and the closing storm."],
"zh-Hant":["一般 · 30 區域戰役","公開遊戲指南","了解完整回收流程，從安全尺寸路線到救援核心、競爭裂隙與收縮風暴。"],
"zh-Hans":["一般 · 30 区域战役","公开游戏指南","了解完整回收流程，从安全尺寸路线到救援核心、竞争裂隙与收缩风暴。"],
ja:["一般 · 30区域キャンペーン","公開ゲームガイド","安全なサイズ経路から救助コア、ライバル、迫る嵐まで、回収の流れを学びましょう。"],
ko:["일반 · 30구역 캠페인","공개 게임 안내","안전한 크기 경로부터 구조 코어, 경쟁 균열, 다가오는 폭풍까지 전체 회수 과정을 알아보세요."],
es:["GENERAL · CAMPAÑA DE 30 ZONAS","GUÍA PÚBLICA","Aprende el ciclo de rescate completo: rutas por tamaño, núcleos, rivales y la tormenta que se cierra."],
"pt-BR":["GERAL · CAMPANHA DE 30 ZONAS","GUIA PÚBLICO","Aprenda todo o ciclo de resgate: rotas por tamanho, núcleos, rivais e a tempestade que se fecha."],
fr:["GÉNÉRAL · CAMPAGNE DE 30 ZONES","GUIDE PUBLIC","Découvrez toute la récupération : tailles sûres, noyaux, rivaux et tempête qui se referme."],
de:["ALLGEMEIN · KAMPAGNE MIT 30 ZONEN","ÖFFENTLICHER SPIELFÜHRER","Lerne den gesamten Bergungsablauf mit Größenrouten, Rettungskernen, Rivalen und Sturm."],
it:["GENERALE · CAMPAGNA DI 30 ZONE","GUIDA PUBBLICA","Impara l’intero ciclo di recupero: percorsi sicuri, nuclei, rivali e tempesta in chiusura."],
ru:["ОБЩАЯ · КАМПАНИЯ ИЗ 30 ЗОН","ПУБЛИЧНОЕ РУКОВОДСТВО","Изучите весь цикл сбора: безопасные размеры, спасательные ядра, соперники и надвигающаяся буря."],
hi:["सामान्य · 30-क्षेत्र अभियान","सार्वजनिक खेल मार्गदर्शिका","सुरक्षित आकार मार्गों से लेकर बचाव कोर, प्रतिद्वंद्वियों और सिकुड़ते तूफान तक पूरा संग्रह चक्र सीखें।"],
ar:["عام · حملة من 30 منطقة","دليل اللعب العام","تعلّم دورة الإنقاذ كاملة، من مسارات الحجم الآمنة إلى نوى الإنقاذ والمنافسين والعاصفة المتقلصة."],
};
for(const [code,[mainKicker,guideKicker,guideIntro]] of Object.entries(PUBLIC_INFO))Object.assign(LOCALES[code]||={}, {mainKicker,guideKicker,guideIntro});
const CHAIN_COPY={
en:{chainNext:"{n} to +2s",chainCap:"Time bonus maxed",chainBonus:"Moon Chain ×{n} · +{s}s"},
"zh-Hant":{chainNext:"再 {n} 個 +2 秒",chainCap:"時間獎勵已滿",chainBonus:"月鏈 ×{n} · +{s} 秒"},
"zh-Hans":{chainNext:"再 {n} 个 +2 秒",chainCap:"时间奖励已满",chainBonus:"月链 ×{n} · +{s} 秒"},
ja:{chainNext:"あと {n} 個で +2 秒",chainCap:"時間ボーナス最大",chainBonus:"ムーンチェーン ×{n} · +{s} 秒"},
ko:{chainNext:"{n}개 후 +2초",chainCap:"시간 보너스 최대",chainBonus:"달 연쇄 ×{n} · +{s}초"},
es:{chainNext:"{n} para +2 s",chainCap:"Tiempo extra al máximo",chainBonus:"Cadena lunar ×{n} · +{s} s"},
"pt-BR":{chainNext:"{n} para +2 s",chainCap:"Tempo extra no máximo",chainBonus:"Corrente lunar ×{n} · +{s} s"},
fr:{chainNext:"{n} avant +2 s",chainCap:"Temps bonus au maximum",chainBonus:"Chaîne lunaire ×{n} · +{s} s"},
de:{chainNext:"Noch {n} für +2 s",chainCap:"Zeitbonus voll",chainBonus:"Mondkette ×{n} · +{s} s"},
it:{chainNext:"{n} per +2 s",chainCap:"Bonus tempo massimo",chainBonus:"Catena lunare ×{n} · +{s} s"},
ru:{chainNext:"Ещё {n}: +2 с",chainCap:"Бонус времени получен",chainBonus:"Лунная цепь ×{n} · +{s} с"},
hi:{chainNext:"+2 सेकंड के लिए {n}",chainCap:"समय बोनस पूरा",chainBonus:"चंद्र शृंखला ×{n} · +{s} सेकंड"},
ar:{chainNext:"{n} حتى +2 ث",chainCap:"اكتمل وقت المكافأة",chainBonus:"سلسلة القمر ×{n} · +{s} ث"},
};
for(const [code,copy] of Object.entries(CHAIN_COPY))if(LOCALES[code])Object.assign(LOCALES[code],copy);
const chainHint=document.createElement("small");chainHint.id="chainHint";chainHint.className="chain-hint";$("chainValue")?.after(chainHint);
const els={mainGroup:$("mainGroup"),stageScreen:$("stageScreen"),battleScreen:$("battleScreen"),battleLive:$("battleLive"),localeSelect:$("localeSelect"),mainProgress:$("mainProgress"),start:$("start"),stageBack:$("stageBack"),stageRail:$("stageRail"),stageSummary:$("stageSummary"),zonesTab:$("zonesTab"),observatoryTab:$("observatoryTab"),zonePanel:$("zonePanel"),observatoryPanel:$("observatoryPanel"),stageHint:$("stageHint"),gearCount:$("gearCount"),upgrades:$("upgrades"),observatoryFeedback:$("observatoryFeedback"),wakeButton:$("wakeButton"),battleBack:$("battleBack"),battleHelp:$("battleHelp"),zoneLabel:$("zoneLabel"),timerValue:$("timerValue"),scoreValue:$("scoreValue"),sizeValue:$("sizeValue"),stabilityValue:$("stabilityValue"),objective:$("objective"),arenaWrap:$("arenaWrap"),canvas:$("arena"),salvageProgress:$("salvageProgress"),salvageProgressValue:$("salvageProgressValue"),salvageProgressFill:$("salvageProgressFill"),chainValue:$("chainValue"),feedback:$("feedback"),helpModal:$("helpModal"),helpClose:$("helpClose"),leaveModal:$("leaveModal"),leaveContinue:$("leaveContinue"),leaveStage:$("leaveStage"),resultModal:$("resultModal"),resultKicker:$("resultKicker"),resultTitle:$("resultTitle"),resultText:$("resultText"),resultTime:$("resultTime"),resultChain:$("resultChain"),resultMedal:$("resultMedal"),retry:$("retry"),resultZones:$("resultZones"),next:$("next")};
els.leaveSummary=els.leaveModal.querySelector('[data-t="leaveText"]');els.leaveSummary.id="leaveSummary";(__wpNotifyMeasurement(), els.leaveModal.setAttribute("aria-describedby","leaveSummary"));
function ensureResultActionStructure(){const actions=els.resultModal.querySelector(".modal-actions");if(!actions)return;[els.resultZones,els.next,els.retry].forEach(button=>actions.append(button))}
ensureResultActionStructure();
els.chainHint=chainHint;
const clockBadge=document.createElement("div");clockBadge.className="rift-clock";clockBadge.setAttribute("aria-live","off");els.arenaWrap.append(clockBadge);
const resultRecord=document.createElement("p");resultRecord.className="rift-record";els.resultText.after(resultRecord);

const memory=new Map(),CHAIN_BONUS_EVERY=4,CHAIN_BONUS_SECONDS=2,CHAIN_BONUS_LIMIT=3;let locale="en",screen="main",stageIndex=0,run=null,raf=0,lastFrame=performance.now(),stageController=null,screenFrame=null,lifecyclePaused=false,windowFocused=true,resultDecisionCommitted=false,view={scale:1,cx:0,cy:0};
const joystick=window.WeightPlayJoystick.create({
  surface:els.canvas,container:els.arenaWrap,mode:"fixed",anchor:{left:76,bottom:76},enabled:false,
  isEnabled:()=>screen==="battle"&&Boolean(run&&!run.paused&&!run.ended&&!run.dying)&&!graphicsError,
  onChange:vector=>{
    if(!run)return;
    if(vector.active){run.target=null;els.canvas.focus({preventScroll:true})}
    // Release/dead zone brakes touch movement; keyboard retains priority.
    if(!vector.strength&&!run.keys.size){run.vx=run.vy=0;run.target=null}
  }
});
function syncJoystick(){joystick.setEnabled(screen==="battle"&&Boolean(run&&!run.paused&&!run.ended&&!run.dying)&&!graphicsError)}
function stickDirection(vector){
  const r=els.canvas.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  const a=world.worldPoint(cx,cy),b=world.worldPoint(cx+vector.x*40,cy+vector.y*40);
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
  return{x:dx/d*vector.strength,y:dy/d*vector.strength};
}
const storage={get(k){try{return localStorage.getItem(k)}catch{return memory.get(k)||null}},set(k,v){try{localStorage.setItem(k,v)}catch{memory.set(k,v)}}};
function defaultSave(){return{unlocked:1,medals:{},best:{},gears:0,upgrades:{drive:0,compression:0,stability:0},tutorial:false,wake:false}}
function normalizeSave(raw){const s=raw&&typeof raw==="object"?raw:{};return{unlocked:Math.max(1,Math.min(30,Number(s.unlocked)||1)),medals:s.medals&&typeof s.medals==="object"?s.medals:{},best:s.best&&typeof s.best==="object"?s.best:{},gears:Math.max(0,Number(s.gears)||0),upgrades:{drive:Math.max(0,Math.min(3,Number(s.upgrades?.drive)||0)),compression:Math.max(0,Math.min(3,Number(s.upgrades?.compression)||0)),stability:Math.max(0,Math.min(3,Number(s.upgrades?.stability)||0))},tutorial:Boolean(s.tutorial),wake:Boolean(s.wake)}}
let save=(()=>{try{return normalizeSave(JSON.parse(storage.get(STORE)||"null"))}catch{return defaultSave()}})();
function persist(){storage.set(STORE,JSON.stringify(save))}
function t(key,data={}){const ownedChain=CHAIN_COPY[locale]?.[key];let value=ownedChain??LOCALES[locale]?.[key]??LOCALES.en?.[key]??key;const translate=window.WeightPlayGameRuntimeLocalizer?.translate;if(locale!=="en"&&!LOCALES[locale]&&ownedChain===undefined&&translate)value=Array.isArray(value)?value.map(item=>translate(String(item))):translate(String(value));if(Array.isArray(value))return value;return String(value).replace(/\{(\w+)\}/g,(_,k)=>data[k]??`{${k}}`)}
function track(name,data={}){try{window.WeightPlayAnalytics?.track?.(name,{game:"animal-rift-salvage",stage:stageIndex+1,...data})}catch{}}
function seeded(seed){let x=(seed|0)+0x6d2b79f5;return()=>{x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return((x^(x>>>14))>>>0)/4294967296}}
function circlePoint(rng,min=80,max=405){const a=rng()*TAU,r=min+(max-min)*Math.sqrt(rng());return{x:500+Math.cos(a)*r,y:500+Math.sin(a)*r}}
const zoneFormations=["scatter","orbits","corridor","clusters","spiral"];
function formationPoint(rng,formation,ordinal,min=80,max=405){if(formation==="orbits"){const band=ordinal%3,r=min+(max-min)*(.24+band*.28),a=ordinal*2.399+rng()*.22;return{x:500+Math.cos(a)*r,y:500+Math.sin(a)*r}}if(formation==="corridor"){const side=ordinal%2?-1:1,x=500+side*(115+(ordinal%4)*54)+(rng()-.5)*34,y=115+(ordinal*83)%770;return{x,y}}if(formation==="clusters"){const centers=[[300,310],[705,330],[355,700],[690,685]],c=centers[ordinal%centers.length],a=rng()*TAU,r=24+rng()*92;return{x:c[0]+Math.cos(a)*r,y:c[1]+Math.sin(a)*r}}if(formation==="spiral"){const u=(ordinal%46)/46,a=u*TAU*2.65+ordinal*.17,r=min+(max-min)*u;return{x:500+Math.cos(a)*r,y:500+Math.sin(a)*r}}return circlePoint(rng,min,max)}
const TYPE={shard:{r:13,mass:4,value:5,img:"shard"},crate:{r:21,mass:8,value:9,img:"crate"},prism:{r:29,mass:16,value:16,img:"prism"},tower:{r:42,mass:26,value:28,img:"tower"},crown:{r:58,mass:48,value:50,img:"crown"},core:{r:24,mass:5,value:24,img:"core"},anchor:{r:22,mass:10,value:12,img:"anchor"}};
function buildZone(index){const chapter=Math.floor(index/5),formation=zoneFormations[index%zoneFormations.length],rng=seeded(4889+index*197),quota=150+index*6+chapter*10,timer=72+chapter*3,rescueNeed=index>=4?(chapter>=5?2:1):0,rivals=chapter>=4?(index>=27?2:1):0,objects=[];let id=0;const add=(type,count,extra={})=>{for(let i=0;i<count;i++){const ordinal=id,p=formationPoint(rng,formation,ordinal,70,chapter>=5?390:410),d=TYPE[type],angle=Math.atan2(p.y-500,p.x-500),orbitRadius=Math.hypot(p.x-500,p.y-500);objects.push({id:id++,type,x:p.x,y:p.y,vx:chapter===1||formation==="corridor"?(rng()-.5)*34:0,vy:chapter===1||formation==="corridor"?(rng()-.5)*34:0,r:d.r,mass:d.mass,value:d.value,img:d.img,active:true,shielded:Boolean(extra.shielded&&i%2===0),phase:rng()*TAU,angle,orbitRadius,gear:rng()<.11})}};add("shard",18+chapter*2);add("crate",12+chapter);add("prism",8+Math.floor(chapter/2));add("tower",5+Math.floor(chapter/2),{shielded:chapter>=3});add("crown",1+Math.floor(chapter/3),{shielded:chapter>=3});if(chapter>=2)add("anchor",2+Math.floor((index%5)/2));add("core",rescueNeed);objects.sort((a,b)=>a.r-b.r||a.id-b.id);const rivalList=Array.from({length:rivals},(_,i)=>{const a=(i?Math.PI:.15)+rng()*.2;return{id:i,x:500+Math.cos(a)*330,y:500+Math.sin(a)*330,vx:0,vy:0,mass:0,threshold:17,score:0,target:null,phase:rng()*TAU}}),turretCount=chapter>=1?1+Math.floor(chapter/2)+(index%5===4?1:0):0,turretPattern=index%3===0?"aimed":index%3===1?"crossfire":"burst",turrets=Array.from({length:turretCount},(_,i)=>{const angle=i/turretCount*TAU+index*.47,radius=350-(i%2)*42;return{x:500+Math.cos(angle)*radius,y:500+Math.sin(angle)*radius,angle:angle+Math.PI,cooldown:1.4+i*.42,interval:Math.max(.95,2.25-chapter*.16),pattern:turretPattern,burst:0,warning:false}});return{index,chapter,formation,name:t("chapters")[chapter],rule:t("rules")[chapter],quota,timer,rescueNeed,rivals:rivalList,objects,turrets,turretPattern,currentPower:chapter>=2?42+chapter*8:0,storm:chapter>=5,goldTime:Math.max(24,timer*.55),silverTime:Math.max(32,timer*.76)}}
const zones=Array.from({length:30},(_,i)=>buildZone(i));
function refreshZoneLocale(){zones.forEach(z=>{z.name=t("chapters")[z.chapter];z.rule=t("rules")[z.chapter]})}
function initLocale(){const route=window.WonderI18n?.actualLocale?.(),saved=storage.get("weightplay:animal-rift-salvage:locale")||storage.get("weightplay:locale");locale=CODES.includes(route)?route:CODES.includes(saved)?saved:"en";els.localeSelect.innerHTML=CODES.map(code=>`<option value="${code}">${LABELS[code]}</option>`).join("");els.localeSelect.value=locale}
function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;document.querySelectorAll("[data-t]").forEach(n=>n.textContent=t(n.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(n=>n.setAttribute("aria-label",t(n.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(n=>n.setAttribute("alt",t(n.dataset.tAlt)));els.canvas.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight ArrowUp ArrowDown w a s d");renderMainProgress();renderStages();renderObservatory();if(run)renderHud()}
els.localeSelect.addEventListener("change",()=>{locale=CODES.includes(els.localeSelect.value)?els.localeSelect.value:"en";storage.set("weightplay:animal-rift-salvage:locale",locale);storage.set("weightplay:locale",locale);if(window.WonderI18n?.setLocale){window.WonderI18n.setLocale(locale);return}applyLocale()});
function renderMainProgress(){const done=Object.values(save.medals).filter(n=>Number(n)>0).length;els.mainProgress.textContent=t("progress",{done})}
function setScreen(next){if(next!=="battle"){audioScope?.stop();clearFlights();world?.clearRun()}if(next!=="stage")stageController?.cancel();screen=next;clearInterruptedInput();syncJoystick();document.body.dataset.screen=next;document.documentElement.dataset.screen=next;const roots={main:els.mainGroup,stage:els.stageScreen,battle:els.battleScreen};for(const [name,root] of Object.entries(roots)){const active=name===next;root.hidden=!active;root.inert=!active;document.body.classList.toggle(`wp-shell-${name}-active`,active)}const stageActive=next==="stage";if(next!=="battle")cancelAnimationFrame(raf);screenFrame?.activate(next);if(stageActive){renderStages();renderObservatory();stageController?.refresh(stageIndex)}const syncStandards=()=>{void roots[next].offsetWidth;window.dispatchEvent(new Event("weightplay:shell-sync"));window.dispatchEvent(new Event("weightplay:battle-sync"))};syncStandards();queueMicrotask(syncStandards);if(next==="battle")startLoop()
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[next] ?? null;
      if (["result"].includes(next) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
function refreshStageSummary(){const format=value=>new Intl.NumberFormat(locale).format(value),medals=Object.values(save.medals).reduce((total,value)=>total+Number(value||0),0);els.stageSummary.textContent=format(Math.min(save.unlocked,zones.length))+" / "+format(zones.length)+" · ★ "+format(medals)}
function renderStages(){refreshZoneLocale();refreshStageSummary();stageController?.refresh(stageIndex)}
const upgradeData=[["drive","upgradeDrive","upgradeDriveDesc"],["compression","upgradeCompression","upgradeCompressionDesc"],["stability","upgradeStability","upgradeStabilityDesc"]];
function upgradeCost(level){return 9+level*9}
function renderObservatory(focusUpgradeId=null){
  els.gearCount.textContent=t("gears",{n:save.gears});
  els.upgrades.innerHTML="";
  for(const [id,name,desc] of upgradeData){
    const level=save.upgrades[id],cost=upgradeCost(level),button=document.createElement("button");
    button.type="button";
    button.className=`upgrade${level>=3?" maxed":""}`;
    button.dataset.upgrade=id;
    button.innerHTML=`<strong>${t(name)}</strong><small>${t(desc)}</small><b>${"◆".repeat(level)}${"◇".repeat(3-level)}</b><span>${level>=3?t("upgradeMax"):t("upgradeBuy",{n:cost})}</span>`;
    button.disabled=level>=3;
    button.addEventListener("keydown",event=>{
      if((event.key==="Enter"||event.key===" ")&&event.repeat)event.preventDefault();
    });
    button.addEventListener("click",()=>{
      if(level>=3)return;
      if(save.gears<cost){sound("feedback.error");
        els.observatoryFeedback.textContent=`${t("gears",{n:save.gears})} · ${t("upgradeBuy",{n:cost})}`;
        return;
      }
      save.gears-=cost;
      save.upgrades[id]++;sound("reward.upgrade");
      persist();
      renderObservatory(id);
    });
    els.upgrades.append(button);
  }
  els.wakeButton.textContent=save.wake?t("wakeOwned"):t("wakeBuy");
  els.wakeButton.disabled=save.wake;
  if(focusUpgradeId){
    const upgraded=els.upgrades.querySelector(`[data-upgrade="${focusUpgradeId}"]:not(:disabled)`);
    const nextAction=upgraded||els.upgrades.querySelector("button:not(:disabled)")||(!els.wakeButton.disabled&&els.wakeButton);
    nextAction?.focus({preventScroll:true});
  }
}
function setTab(tab){const zonesOn=tab==="zones";if(!zonesOn)stageController?.cancel();els.zonePanel.hidden=!zonesOn;els.observatoryPanel.hidden=zonesOn;els.zonesTab.classList.toggle("active",zonesOn);els.observatoryTab.classList.toggle("active",!zonesOn);els.zonesTab.setAttribute("aria-selected",String(zonesOn));els.zonesTab.setAttribute("aria-pressed",String(zonesOn));els.observatoryTab.setAttribute("aria-selected",String(!zonesOn));els.observatoryTab.setAttribute("aria-pressed",String(!zonesOn));if(zonesOn){renderStages();stageController?.refresh(stageIndex)}}
function threshold(){return 17+save.upgrades.compression*1.8+Math.sqrt(Math.max(0,run?.mass||0))*2.28}
function ringRadius(){return 25+threshold()*.52}
function maxStability(){return 3+save.upgrades.stability}
function startBattle(index,{skipTutorial=false}={}){if(!world||graphicsError){showGraphicsError();return}clearFlights();lastVisualTime=0;clearResultOwnership();(__wpNotifyMeasurement(), lifecyclePaused=false);stageIndex=Math.max(0,Math.min(zones.length-1,index));refreshStageSummary();stageController?.refresh(stageIndex);const zone=buildZone(stageIndex);run={zone,x:500,y:500,vx:0,vy:0,target:null,pointerId:null,dragging:false,keys:new Set(),mass:0,score:0,stability:maxStability(),elapsed:0,timeLeft:zone.timer,chain:0,bestChain:0,chainWindow:0,chainBonuses:0,rescued:0,prismKeys:0,anchors:0,gears:0,knockCooldown:0,stormCooldown:0,paused:false,ended:false,dying:0,result:null,feedback:t("ready"),wakeTrail:[],effects:[],bullets:[]};(__wpNotifyMeasurement(), els.resultModal.hidden=true);(__wpNotifyMeasurement(), els.leaveModal.hidden=true);(__wpNotifyMeasurement(), els.helpModal.hidden=true);world.reset(run);document.body.style.setProperty("--rift-accent",["#54ead4","#ffbd68","#64c6ff","#cf9dff","#ff9277","#edbbff"][zone.chapter]);setScreen("battle");syncCanvas();window.dispatchEvent(new Event("weightplay:battle-sync"));renderHud();track("game_start");if(!save.tutorial&&!skipTutorial){pauseForModal();(__wpNotifyMeasurement(), els.helpModal.hidden=false);els.helpClose.focus({preventScroll:true})}else{save.tutorial=true;persist();if(screen==="battle"&&run&&!activeBattleModal())els.canvas.focus({preventScroll:true})}
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
function rivalTop(){return run?.zone.rivals.reduce((m,r)=>Math.max(m,r.score),0)||0}
function objectiveText(){const z=run.zone,data={score:Math.min(run.score,z.quota),quota:z.quota,rescued:run.rescued,need:z.rescueNeed,rival:rivalTop()};let objective;if(z.rescueNeed&&z.rivals.length)objective=t("objectiveAll",data);else if(z.rescueNeed)objective=t("objectiveRescue",data);else if(z.rivals.length)objective=t("objectiveRival",data);else objective=t("objectiveQuota",data);return z.index===0?`${objective} · ${t("firstZonePayoff")}`:objective}
function renderHud(){if(!run)return;const fullZone=`${t("zone",{n:run.zone.index+1})} · ${run.zone.name}`,remaining=Math.max(0,Math.ceil(run.timeLeft)),salvage=Math.min(run.score,run.zone.quota),salvagePercent=Math.round(salvage/run.zone.quota*100),chainDisplay=Math.max(1,run.chain),chainHintText=run.chainBonuses>=CHAIN_BONUS_LIMIT?t("chainCap"):t("chainNext",{n:CHAIN_BONUS_EVERY-run.chain%CHAIN_BONUS_EVERY}),routeCoach=run.zone.index===0&&run.score<20&&run.feedback===t("ready")?t("firstRouteCoach"):run.feedback;els.zoneLabel.textContent=matchMedia("(max-width:640px)").matches?t("zone",{n:run.zone.index+1}):fullZone;els.zoneLabel.title=fullZone;els.timerValue.textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")}`;els.scoreValue.textContent=`${salvage}/${run.zone.quota}`;els.salvageProgressValue.textContent=`${salvage} / ${run.zone.quota}`;els.salvageProgressFill.style.width=`${salvagePercent}%`;els.salvageProgress.setAttribute("aria-valuenow",String(salvagePercent));els.salvageProgress.setAttribute("aria-valuetext",`${salvage} / ${run.zone.quota}`);els.sizeValue.textContent=threshold().toFixed(0);els.stabilityValue.textContent=String(run.stability);els.chainValue.textContent=`×${chainDisplay}`;els.chainHint.textContent=chainHintText;els.chainValue.parentElement.setAttribute("aria-label",`${t("moonChain")} ×${chainDisplay}. ${chainHintText}`);els.objective.textContent=objectiveText();els.feedback.textContent=routeCoach;clockBadge.textContent=t("time")+"  "+els.timerValue.textContent;clockBadge.classList.toggle("urgent",remaining<=15);els.chainValue.parentElement.style.setProperty("--chain-charge",Math.round(run.chainWindow/2.35*100)+"%");els.arenaWrap.classList.toggle("rift-damaged",run.knockCooldown>.5||run.dying>0)}
function absorb(o,owner="player"){if(!o.active)return;o.active=false;if(owner!=="player"){owner.mass+=o.mass;owner.threshold=17+Math.sqrt(owner.mass)*2.1;owner.score+=o.value;return}world?.collect(o,run);sound(o.type==="core"?"reward.upgrade":"reward.collect");run.mass+=o.mass;run.chain=run.chainWindow>0?run.chain+1:1;run.chainWindow=2.35;run.bestChain=Math.max(run.bestChain,run.chain);const gain=Math.round(o.value*(1+Math.min(1.5,(run.chain-1)*.08))),earnedTime=run.chain%CHAIN_BONUS_EVERY===0&&run.chainBonuses<CHAIN_BONUS_LIMIT;run.score+=gain;collectFlight(o,gain);if(earnedTime){run.chainBonuses++;run.timeLeft=Math.min(run.zone.timer+CHAIN_BONUS_SECONDS*CHAIN_BONUS_LIMIT,run.timeLeft+CHAIN_BONUS_SECONDS)}if(o.type==="prism")run.prismKeys++;if(o.type==="anchor")run.anchors++;if(o.type==="core")run.rescued++;if(o.gear)run.gears++;run.feedback=earnedTime?t("chainBonus",{n:run.chain,s:CHAIN_BONUS_SECONDS}):o.type==="core"?t("coreRescued"):o.gear?t("gearFound"):run.chain>1?t("chain",{n:run.chain}):t("absorbed",{n:gain});run.effects.push({x:o.x,y:o.y,life:.55,color:earnedTime?"#fff176":o.type==="core"?"#fff176":"#67f7e1"})}
function zoneComplete(){return run.score>=run.zone.quota&&run.rescued>=run.zone.rescueNeed&&(!run.zone.rivals.length||run.score>rivalTop())}
function knockFrom(o){if(run.knockCooldown>0)return;if(o.shielded&&run.prismKeys<3){run.feedback=t("shieldLocked");sound("combat.block");run.knockCooldown=.35;return}run.stability--;sound("player.hurt");run.knockCooldown=.85;run.chain=0;run.chainWindow=0;const dx=run.x-o.x,dy=run.y-o.y,d=Math.hypot(dx,dy)||1;run.vx+=dx/d*250;run.vy+=dy/d*250;run.feedback=t("tooLarge");if(run.stability<=0)finish(false,"stability")}
function updateRivals(dt){for(const r of run.zone.rivals){if(!r.target?.active||r.target.r>r.threshold)r.target=run.zone.objects.filter(o=>o.active&&!o.shielded&&o.type!=="core"&&o.r<=r.threshold).sort((a,b)=>Math.hypot(a.x-r.x,a.y-r.y)-Math.hypot(b.x-r.x,b.y-r.y))[0]||null;if(r.target){const dx=r.target.x-r.x,dy=r.target.y-r.y,d=Math.hypot(dx,dy)||1,speed=76+run.zone.chapter*4;r.vx+=(dx/d*speed-r.vx)*Math.min(1,dt*2.4);r.vy+=(dy/d*speed-r.vy)*Math.min(1,dt*2.4);r.x+=r.vx*dt;r.y+=r.vy*dt;if(d<r.threshold+12)absorb(r.target,r)}else{r.phase+=dt*.5;r.x=500+Math.cos(r.phase+r.id*Math.PI)*330;r.y=500+Math.sin(r.phase+r.id*Math.PI)*330}}}
function updateObjects(dt){for(const o of run.zone.objects){if(!o.active)continue;if(run.zone.formation==="orbits"&&o.type!=="core"){o.angle+=(o.id%2?1:-1)*dt*(.055+run.zone.chapter*.006);o.x=500+Math.cos(o.angle)*o.orbitRadius;o.y=500+Math.sin(o.angle)*o.orbitRadius;continue}if(run.zone.chapter!==1&&run.zone.formation!=="corridor")continue;o.x+=o.vx*dt;o.y+=o.vy*dt;const dx=o.x-500,dy=o.y-500,d=Math.hypot(dx,dy);if(d>420){const nx=dx/d,ny=dy/d;o.x=500+nx*420;o.y=500+ny*420;const dot=o.vx*nx+o.vy*ny;o.vx-=2*dot*nx;o.vy-=2*dot*ny}if(o.x<85||o.x>915)o.vx*=-1;if(o.y<85||o.y>915)o.vy*=-1}}
function fireBullet(turret,angle,speed){sound("weapon.laser.fire");run.bullets.push({x:turret.x+Math.cos(angle)*28,y:turret.y+Math.sin(angle)*28,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:4,trail:[]})}
function updateTurrets(dt){
  for(const turret of run.zone.turrets){
    turret.cooldown-=dt;
    // Lock the direction before firing, including all three shots in a burst.
    if(!turret.warning){const aim=Math.atan2(run.y-turret.y,run.x-turret.x);const delta=Math.atan2(Math.sin(aim-turret.angle),Math.cos(aim-turret.angle));turret.angle+=delta*Math.min(1,dt*3.2)}
    if(turret.cooldown<=.7)turret.warning=true;
    if(turret.cooldown<=0){const speed=170+run.zone.chapter*14;if(turret.pattern==="crossfire"){fireBullet(turret,turret.angle-.18,speed);fireBullet(turret,turret.angle+.18,speed)}else if(turret.pattern==="burst"){fireBullet(turret,turret.angle,speed);turret.burst=(turret.burst||0)+1}else fireBullet(turret,turret.angle,speed);const burstContinues=turret.pattern==="burst"&&turret.burst%3!==0;turret.cooldown=burstContinues?.18:turret.interval;turret.warning=burstContinues}
  }
  for(const bullet of run.bullets){
    bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;
    if(!run.invulnerable&&run.dying<=0&&Math.hypot(run.x-bullet.x,run.y-bullet.y)<ringRadius()*.48+8){
      bullet.life=0;
      if(run.knockCooldown>0)continue;
      sound("player.hurt");run.stability--;run.knockCooldown=1;run.chain=0;run.chainWindow=0;run.feedback=t("gunHit");
      run.effects.push({x:run.x,y:run.y,life:.62,color:"#ff557b"});
      if(run.stability<=0){run.dying=.62;clearInterruptedInput();syncJoystick()}
    }
  }
  run.bullets=run.bullets.filter(bullet=>bullet.life>0&&bullet.x>-80&&bullet.x<1080&&bullet.y>-80&&bullet.y<1080)
}
function update(dt){if(!run||run.paused||run.ended)return;if(run.dying>0){run.dying=Math.max(0,run.dying-dt);for(const e of run.effects)e.life-=dt;run.effects=run.effects.filter(e=>e.life>0);if(run.dying===0)finish(false,"stability");renderHud();return}run.elapsed+=dt;run.timeLeft-=dt;run.chainWindow=Math.max(0,run.chainWindow-dt);if(!run.chainWindow)run.chain=0;run.knockCooldown=Math.max(0,run.knockCooldown-dt);run.stormCooldown=Math.max(0,run.stormCooldown-dt);let ix=0,iy=0;if(run.keys.has("ArrowLeft")||run.keys.has("KeyA"))ix--;if(run.keys.has("ArrowRight")||run.keys.has("KeyD"))ix++;if(run.keys.has("ArrowUp")||run.keys.has("KeyW"))iy--;if(run.keys.has("ArrowDown")||run.keys.has("KeyS"))iy++;if(ix||iy){run.target=null;const d=Math.hypot(ix,iy);ix/=d;iy/=d}else if(joystick.getVector().active){const v=stickDirection(joystick.getVector());ix=v.x;iy=v.y;run.target=null}else if(run.target){const dx=run.target.x-run.x,dy=run.target.y-run.y,d=Math.hypot(dx,dy);if(d>12){ix=dx/d;iy=dy/d}else run.target=null}const accel=930+save.upgrades.drive*100,maxSpeed=260+save.upgrades.drive*25;run.vx+=ix*accel*dt;run.vy+=iy*accel*dt;const drag=Math.pow(.055,dt);run.vx*=drag;run.vy*=drag;const speed=Math.hypot(run.vx,run.vy);if(speed>maxSpeed){run.vx=run.vx/speed*maxSpeed;run.vy=run.vy/speed*maxSpeed}if(run.zone.currentPower){const power=Math.max(0,run.zone.currentPower-run.anchors*18),a=run.elapsed*.42+run.zone.index*.7;run.vx+=Math.cos(a)*power*dt;run.vy+=Math.sin(a*.83)*power*.65*dt;if(power>18&&Math.floor(run.elapsed*2)%9===0)run.feedback=t("current")}run.x+=run.vx*dt;run.y+=run.vy*dt;const dx=run.x-500,dy=run.y-500,d=Math.hypot(dx,dy),limit=run.zone.storm?Math.max(285,442-run.elapsed/run.zone.timer*155):442;if(d>limit-ringRadius()*.45){const nx=dx/(d||1),ny=dy/(d||1);run.x=500+nx*(limit-ringRadius()*.45);run.y=500+ny*(limit-ringRadius()*.45);run.vx-=nx*160;run.vy-=ny*160;if(run.zone.storm&&run.stormCooldown<=0){run.stability--;run.stormCooldown=1;run.feedback=t("storm");if(run.stability<=0)finish(false,"stability")}}updateObjects(dt);updateRivals(dt);updateTurrets(dt);for(const o of run.zone.objects){if(!o.active)continue;const od=Math.hypot(run.x-o.x,run.y-o.y),canSize=o.r<=threshold(),shieldOpen=!o.shielded||run.prismKeys>=3;if(od<ringRadius()+o.r*.35){if(canSize&&shieldOpen)absorb(o);else if(od<ringRadius()*.7+o.r*.55)knockFrom(o)}}for(const e of run.effects)e.life-=dt;run.effects=run.effects.filter(e=>e.life>0);if(save.wake){run.wakeTrail.push({x:run.x,y:run.y,life:1});if(run.wakeTrail.length>22)run.wakeTrail.shift();for(const p of run.wakeTrail)p.life-=dt*.8}if(zoneComplete())finish(true);else if(run.timeLeft<=0)finish(false,"time");renderHud()}
function medalFor(time,z){return time<=z.goldTime?3:time<=z.silverTime?2:1}
function setBattleLiveCovered(covered){if(covered){clearInterruptedInput();joystick.setEnabled(false)}els.battleLive.inert=covered;if(covered)els.battleLive.setAttribute("aria-hidden","true");else els.battleLive.removeAttribute("aria-hidden")}
function finish(win,reason="time"){if(!run||run.ended)return;resultDecisionCommitted=false;run.ended=true;sound(win?"result.win":"result.lose");(__wpNotifyMeasurement(), run.paused=true);const previousBest=Number(save.best[run.zone.index]||0);resultRecord.textContent=previousBest?t("best",{n:previousBest.toFixed(1)}):t("target",{n:run.zone.quota});let medal=0;if(win){medal=medalFor(run.elapsed,run.zone);save.medals[run.zone.index]=Math.max(Number(save.medals[run.zone.index]||0),medal);const best=Number(save.best[run.zone.index]||0);if(!best||run.elapsed<best)save.best[run.zone.index]=Number(run.elapsed.toFixed(2));save.unlocked=Math.max(save.unlocked,Math.min(30,run.zone.index+2));save.gears+=run.gears+medal;persist();run.result={win:true,medal};els.resultKicker.textContent=t("winKicker");els.resultTitle.textContent=t("winTitle");els.resultText.textContent=t(run.zone.index===0?"winFirstText":"winText",{n:run.zone.index+1,time:run.elapsed.toFixed(1)})}else{run.result={win:false,medal:0,reason};els.resultKicker.textContent=t("failKicker");els.resultTitle.textContent=t("failTitle");els.resultText.textContent=t(reason==="stability"?"failStability":"failTime")}els.resultTime.textContent=`${run.elapsed.toFixed(1)}s`;els.resultChain.textContent=`×${Math.max(1,run.bestChain)}`;els.resultMedal.textContent=win?t(medal===3?"gold":medal===2?"silver":"bronze"):t("none");const terminalWin=win&&run.zone.index>=29,nextAvailable=win&&!terminalWin;els.next.hidden=false;els.next.disabled=!nextAvailable;els.next.classList.toggle("primary",nextAvailable);els.retry.classList.remove("primary");(__wpNotifyMeasurement(), els.resultZones.classList.toggle("primary",!nextAvailable));(__wpNotifyMeasurement(), els.resultModal.hidden=false);setBattleLiveCovered(true);(nextAvailable?els.next:els.resultZones).focus({preventScroll:true});track(win?"game_complete":"game_fail")
    __wpMeasurement.ended = true; __wpMeasurement.outcome = (win ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
function clearResultOwnership(){setBattleLiveCovered(false)}
function commitResultDecision(action){if(resultDecisionCommitted||els.resultModal.hidden)return;resultDecisionCommitted=true;action()}
function computeView(){const w=els.canvas.width,h=els.canvas.height;view.scale=Math.min(w,h)/1090;view.cx=w/2;view.cy=h/2;return{w,h}}
function worldToScreen(x,y){const p=world?.project(x,y)||{x:0,y:0};return{x:p.x*(els.canvas.width/(world?.width||1)),y:p.y*(els.canvas.height/(world?.height||1))}}
function eligibility(o){if(o.shielded&&run.prismKeys<3)return"shield";const th=threshold();return o.r<=th?"ready":o.r<=th*1.27?"near":"large"}
function firstRecoveryRoute(){if(!run||run.zone.index!==0||run.score>=20)return[];return run.zone.objects.filter(o=>o.active&&eligibility(o)==="ready").sort((a,b)=>Math.hypot(a.x-run.x,a.y-run.y)-Math.hypot(b.x-run.x,b.y-run.y)||a.id-b.id).slice(0,2)}
function clearFlights(){for(const f of fxFlights)f.node.remove();fxFlights.length=0}
function collectFlight(o,gain){
  if(!world||screen!=="battle"||fxFlights.length>=18)return;
  const point=world.project(o.x,o.y,18),node=document.createElement("span");
  node.className="rift-pickup";node.textContent="+"+gain;node.setAttribute("aria-hidden","true");
  els.arenaWrap.append(node);fxFlights.push({node,x:point.x,y:point.y,age:0});
}
function renderFlights(dt){
  const parent=els.arenaWrap.getBoundingClientRect(),target=els.salvageProgress.getBoundingClientRect();
  for(let i=fxFlights.length-1;i>=0;i--){
    const f=fxFlights[i];f.age+=dt;const t=Math.min(1,f.age/.55),e=t*t;
    const x=reducedMotion.matches?f.x:f.x+(target.left-parent.left+target.width*.75-f.x)*e;
    const y=reducedMotion.matches?f.y:f.y+(target.top-parent.top+target.height*.5-f.y)*e-Math.sin(t*Math.PI)*22;
    f.node.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;f.node.style.opacity=String(t>.7?(1-t)/.3:1);
    if(t>=1){f.node.remove();fxFlights.splice(i,1)}
  }
}
let lastVisualTime=0;
function render(){if(!world||!run)return;world.render(run,threshold(),ringRadius(),save.wake);const dt=run.paused?0:Math.max(0,Math.min(.05,run.elapsed-lastVisualTime));lastVisualTime=run.elapsed;renderFlights(dt)}
function loop(now){if(screen!=="battle")return;const dt=Math.min(.033,Math.max(0,(now-lastFrame)/1000));lastFrame=now;update(dt);render();raf=requestAnimationFrame(loop)}
function startLoop(){cancelAnimationFrame(raf);lastFrame=performance.now();raf=requestAnimationFrame(loop)}
function syncCanvas(){world?.resize();joystick.refresh();computeView();render()}
new ResizeObserver(syncCanvas).observe(els.arenaWrap);
function pointerWorld(e){return world?.worldPoint(e.clientX,e.clientY)||{x:500,y:500}}
function pointerDown(e){if(e.pointerType==="touch"||e.defaultPrevented||joystick.getVector().active)return;if(!run||run.paused||run.ended||e.isPrimary===false||(e.button??0)!==0||run.pointerId!==null)return;run.dragging=true;run.pointerId=e.pointerId;run.target=pointerWorld(e);els.canvas.setPointerCapture(e.pointerId);els.canvas.focus({preventScroll:true});e.preventDefault()}
function pointerMove(e){if(!run||!run.dragging||e.pointerId!==run.pointerId)return;run.target=pointerWorld(e);e.preventDefault()}
function pointerEnd(e){if(!run||e.pointerId!==run.pointerId)return false;run.dragging=false;run.pointerId=null;try{els.canvas.releasePointerCapture(e.pointerId)}catch{}e.preventDefault();return true}
function pointerCancel(e){if(pointerEnd(e)&&run)run.target=null}
els.canvas.addEventListener("pointerdown",pointerDown);els.canvas.addEventListener("pointermove",pointerMove);els.canvas.addEventListener("pointerup",pointerEnd);els.canvas.addEventListener("pointercancel",pointerCancel);els.canvas.addEventListener("lostpointercapture",pointerCancel);
window.addEventListener("keydown",e=>{if(screen!=="battle"||!run)return;if(!run.paused&&document.activeElement===els.canvas&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","KeyA","KeyD","KeyW","KeyS"].includes(e.code)){run.keys.add(e.code);e.preventDefault()}if(e.code==="Escape"){if(!els.helpModal.hidden)closeHelp();else if(!els.leaveModal.hidden)continueRun();else if(els.resultModal.hidden)openLeave()}});window.addEventListener("keyup",e=>run?.keys.delete(e.code));
let screenFocusSettlement=0;
function focusScreenOwner(owner){const token=++screenFocusSettlement,attempt=()=>{if(token!==screenFocusSettlement||screen!==owner)return;const active=document.activeElement,style=active&&active!==document.body&&active!==document.documentElement?getComputedStyle(active):null,owned=active&&active!==document.body&&active!==document.documentElement&&active.isConnected&&!active.closest("[hidden]")&&active.getClientRects().length&&style?.visibility!=="hidden";if(owned)return;const target=owner==="main"?els.start:owner==="stage"?els.stageRail.querySelector(`[data-stage-index="${stageIndex}"]`):null;target?.focus({preventScroll:true})};requestAnimationFrame(attempt);for(const delay of [80,240,480,800])setTimeout(attempt,delay)}
function activeBattleModal(){return!els.helpModal.hidden||!els.leaveModal.hidden||!els.resultModal.hidden}
function clearInterruptedInput(){
  joystick.reset();if(!run)return;
  const pointer=run.pointerId;run.keys.clear();run.dragging=false;run.pointerId=null;run.target=null;run.vx=run.vy=0;
  if(pointer!==null&&els.canvas.hasPointerCapture(pointer))els.canvas.releasePointerCapture(pointer);
}
function suspendForLifecycle(){clearInterruptedInput();if(!run||run.ended||run.paused||screen!=="battle")return;(__wpNotifyMeasurement(), lifecyclePaused=true);(__wpNotifyMeasurement(), run.paused=true);syncJoystick()}
function resumeFromLifecycle(){if(document.hidden||!windowFocused||!lifecyclePaused)return;(__wpNotifyMeasurement(), lifecyclePaused=false);if(!run||run.ended||screen!=="battle"||activeBattleModal())return;(__wpNotifyMeasurement(), run.paused=false);lastFrame=performance.now();syncJoystick()}
window.addEventListener("blur",()=>{windowFocused=false;suspendForLifecycle()});window.addEventListener("focus",()=>{windowFocused=true;resumeFromLifecycle()});window.addEventListener("pagehide",suspendForLifecycle);window.addEventListener("pageshow",resumeFromLifecycle);document.addEventListener("visibilitychange",()=>document.hidden?suspendForLifecycle():resumeFromLifecycle());
function trapModalFocus(modal,e){if(e.key!=="Tab")return;const buttons=[...modal.querySelectorAll("button:not([hidden]):not([disabled])")];if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1),active=document.activeElement;if(buttons.length===1||e.shiftKey&&(active===first||!modal.contains(active))||!e.shiftKey&&active===last){e.preventDefault();(e.shiftKey?last:first).focus({preventScroll:true})}}
for(const modal of [els.helpModal,els.leaveModal,els.resultModal])modal.addEventListener("keydown",e=>trapModalFocus(modal,e));
function pauseForModal(){if(!run)return;(__wpNotifyMeasurement(), run.paused=true);run.keys.clear();setBattleLiveCovered(true)}
function openLeave(){if(!run||run.ended){setScreen("stage");return}pauseForModal();const remaining=Math.max(0,Math.ceil(run.timeLeft));els.leaveSummary.textContent=`${t("leaveText")} · ${t("zone",{n:run.zone.index+1})} · ${t("salvage")} ${Math.min(run.score,run.zone.quota)}/${run.zone.quota} · ${t("time")} ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")} · ${t("stability")} ${run.stability}/${maxStability()}`;(__wpNotifyMeasurement(), els.leaveModal.hidden=false);els.leaveContinue.focus({preventScroll:true})}
function continueRun(){(__wpNotifyMeasurement(), els.leaveModal.hidden=true);setBattleLiveCovered(false);if(run){if(!lifecyclePaused&&windowFocused&&!document.hidden){(__wpNotifyMeasurement(), run.paused=false);lastFrame=performance.now();syncJoystick()}els.canvas.focus({preventScroll:true})}}
function closeHelp(){(__wpNotifyMeasurement(), els.helpModal.hidden=true);setBattleLiveCovered(false);if(run){if(!lifecyclePaused&&windowFocused&&!document.hidden){(__wpNotifyMeasurement(), run.paused=false);lastFrame=performance.now();syncJoystick()}save.tutorial=true;persist();els.canvas.focus({preventScroll:true})}}
els.start.addEventListener("click",()=>{setScreen("stage");track("game_start_menu")});els.stageBack.addEventListener("click",()=>setScreen("main"));els.zonesTab.addEventListener("click",()=>setTab("zones"));els.observatoryTab.addEventListener("click",()=>setTab("observatory"));els.battleBack.addEventListener("click",openLeave);els.leaveContinue.addEventListener("click",continueRun);els.leaveStage.addEventListener("click",()=>{(__wpNotifyMeasurement(), els.leaveModal.hidden=true);setBattleLiveCovered(false);run=null;setScreen("stage")});els.battleHelp.addEventListener("click",()=>{if(!run)return;pauseForModal();(__wpNotifyMeasurement(), els.helpModal.hidden=false);els.helpClose.focus({preventScroll:true})});els.helpClose.addEventListener("click",closeHelp);els.retry.addEventListener("click",()=>commitResultDecision(()=>{clearResultOwnership();__wpReplayStart(() => startBattle(stageIndex,{skipTutorial:true}))}));els.resultZones.addEventListener("click",()=>commitResultDecision(()=>{clearResultOwnership();run=null;setScreen("stage")}));els.next.addEventListener("click",()=>commitResultDecision(()=>{clearResultOwnership();startBattle(Math.min(29,stageIndex+1),{skipTutorial:true})}));els.wakeButton.addEventListener("click",()=>{if(save.wake)return;if(window.WeightPlayWallet?.spendDiamonds?.(10)){save.wake=true;persist();renderObservatory()}else{const diamonds=Math.max(0,Number(window.WeightPlayWallet?.read?.()?.diamonds)||0);els.observatoryFeedback.textContent=`${t("wakeTitle")} · ${diamonds}/10 ◆`}});
els.start.addEventListener("click",()=>focusScreenOwner("stage"));els.stageBack.addEventListener("click",()=>focusScreenOwner("main"));els.leaveStage.addEventListener("click",()=>focusScreenOwner("stage"));els.resultZones.addEventListener("click",()=>focusScreenOwner("stage"));els.battleBack.addEventListener("click",()=>{if(!run||run.ended)focusScreenOwner("stage")});
function nearestAutoTarget(){const eligible=run.zone.objects.filter(o=>o.active&&o.r<=threshold()&&(!o.shielded||run.prismKeys>=3));eligible.sort((a,b)=>{const ar=a.type==="core"?-500:0,br=b.type==="core"?-500:0;return ar+Math.hypot(a.x-run.x,a.y-run.y)-(br+Math.hypot(b.x-run.x,b.y-run.y))});return eligible[0]||null}
function autoComplete(){if(!run)return false;run.knockCooldown=Number.POSITIVE_INFINITY;run.stormCooldown=Number.POSITIVE_INFINITY;run.invulnerable=true;for(let i=0;i<9000&&!run.ended;i++){const target=nearestAutoTarget();if(target)run.target={x:target.x,y:target.y};else{const smallest=run.zone.objects.filter(o=>o.active).sort((a,b)=>a.r-b.r)[0];if(smallest)run.target={x:smallest.x,y:smallest.y}}update(.025)}run.invulnerable=false;return Boolean(run.ended&&run.result?.win)}
window.__animalRiftSalvageSmoke={graphics:()=>world?.stats(),project:(x,y)=>world?.project(x,y),objects:()=>run?.zone.objects.map(o=>({id:o.id,type:o.type,x:o.x,y:o.y,r:o.r,active:o.active,shielded:o.shielded})),zones,startBattle:(i=0)=>startBattle(i,{skipTutorial:true}),snapshot:()=>run?{zone:run.zone.index,formation:run.zone.formation,turretPattern:run.zone.turretPattern,turrets:run.zone.turrets.map(turret=>({x:turret.x,y:turret.y,pattern:turret.pattern,cooldown:turret.cooldown,warning:turret.warning,angle:turret.angle})),bullets:run.bullets.map(bullet=>({x:bullet.x,y:bullet.y,vx:bullet.vx,vy:bullet.vy,life:bullet.life})),dying:run.dying,x:run.x,y:run.y,score:run.score,quota:run.zone.quota,mass:run.mass,size:threshold(),stability:run.stability,timeLeft:run.timeLeft,timeBonus:run.chainBonuses*CHAIN_BONUS_SECONDS,chainBonuses:run.chainBonuses,elapsed:run.elapsed,chain:run.chain,bestChain:run.bestChain,chainHint:els.chainHint.textContent,rescued:run.rescued,rescueNeed:run.rescueNeed,rival:rivalTop(),active:run.zone.objects.filter(o=>o.active).length,onboarding:{active:firstRecoveryRoute().length>0,route:firstRecoveryRoute().map(o=>o.id)},paused:run.paused,lifecyclePaused,ended:run.ended,result:run.result,screen}:null,setTarget:(x,y)=>{if(run)run.target={x,y}},setPlayer:(x,y)=>{if(run){run.x=x;run.y=y;run.vx=run.vy=0}},setScore:value=>{if(run)run.score=Math.max(0,Number(value)||0)},collectChain:(count=1)=>{for(let i=0;i<count&&run&&!run.ended;i++){const target=run.zone.objects.find(o=>o.active);if(!target)break;absorb(target);renderHud()}},placeBullet:(x,y,vx=0,vy=0)=>{if(run)run.bullets.push({x,y,vx,vy,life:4,trail:[]})},setKeys:(...codes)=>{if(run)run.keys=new Set(codes)},advance:(seconds=.5)=>{if(!run)return;for(let i=0;i<Math.ceil(seconds/.02)&&!run.ended;i++)update(.02)},autoComplete,forceWin:()=>{if(run&&!run.ended){run.score=run.zone.quota;run.rescued=run.zone.rescueNeed;for(const r of run.zone.rivals)r.score=0;finish(true)}},forceFail:()=>{if(run&&!run.ended){run.stability=0;finish(false,"stability")}},save:()=>JSON.parse(JSON.stringify(save)),setSave:value=>{save=normalizeSave(value);persist();renderMainProgress();renderStages();renderObservatory()}};
const graphicsCopy={
en:["3D view unavailable","Retry","Return to zones"],"zh-Hant":["3D 畫面暫時無法顯示","重新載入","返回區域"],"zh-Hans":["3D 画面暂时无法显示","重新加载","返回区域"],ja:["3D表示を利用できません","再読み込み","エリアへ戻る"],ko:["3D 화면을 사용할 수 없습니다","다시 불러오기","구역으로"],es:["Vista 3D no disponible","Reintentar","Volver a zonas"],"pt-BR":["Visualização 3D indisponível","Tentar novamente","Voltar às zonas"],fr:["Vue 3D indisponible","Réessayer","Retour aux zones"],de:["3D-Ansicht nicht verfügbar","Erneut laden","Zurück zu den Zonen"],it:["Vista 3D non disponibile","Riprova","Torna alle zone"],ru:["3D-вид недоступен","Повторить","К зонам"],hi:["3D दृश्य उपलब्ध नहीं है","फिर कोशिश करें","क्षेत्रों में लौटें"],ar:["العرض ثلاثي الأبعاد غير متاح","إعادة المحاولة","العودة إلى المناطق"]};
function showGraphicsError(){
  graphicsError=true;suspendForLifecycle();
  if(document.getElementById("riftGraphicsError"))return;
  const copy=graphicsCopy[locale]||graphicsCopy.en,box=document.createElement("section");box.id="riftGraphicsError";box.className="rift-graphics-error";box.setAttribute("role","alertdialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label",copy[0]);
  const title=document.createElement("h2");title.textContent=copy[0];box.append(title);
  for(const [label,action] of [[copy[1],()=>location.reload()],[copy[2],()=>{box.remove();run=null;setScreen("stage")}]]){const b=document.createElement("button");b.textContent=label;b.onclick=action;box.append(b)}
  box.addEventListener("keydown",event=>{trapModalFocus(box,event);if(event.key==="Escape")event.stopPropagation()});
  document.body.append(box);box.querySelector("button").focus();
}
async function bootGraphics(){
  let deadline;
  try{
    const {RiftWorld}=await Promise.race([import(MODULE_URL),new Promise((_,reject)=>{deadline=setTimeout(()=>reject(new Error("GRAPHICS_LOAD_TIMEOUT")),12000)})]);
    clearTimeout(deadline);
    world=new RiftWorld(els.canvas,{onLost:showGraphicsError,onRestored:()=>{graphicsError=false;document.getElementById("riftGraphicsError")?.remove();if(run){lifecyclePaused=false;run.paused=true;openLeave()}}});
    graphicsError=false;window.WeightPlayGameEntryLoader?.ready?.();syncCanvas();
  }catch(error){clearTimeout(deadline);console.error("Rift graphics startup failed",error);if(window.WeightPlayGameEntryLoader?.isActive)window.WeightPlayGameEntryLoader.fail();else showGraphicsError()}
}
initLocale();applyLocale();
const stageBridge=Object.freeze({
  get zones(){return zones},get unlocked(){return save.unlocked},get best(){return save.best},get medals(){return save.medals},get selected(){return stageIndex},text:t,
  select(index){stageIndex=Math.max(0,Math.min(zones.length-1,index));refreshStageSummary()},
  start(index){startBattle(index)}
});
const mountedFrame=window.mountAnimalRiftSalvageFrame(stageBridge);
screenFrame=mountedFrame.frame;stageController=mountedFrame.selector;
setScreen("main");bootGraphics();
window.addEventListener("pagehide",()=>{audioScope?.stop();clearFlights()});
window.addEventListener("unload",()=>{joystick.destroy();world?.dispose();audioScope?.dispose()});

})();
