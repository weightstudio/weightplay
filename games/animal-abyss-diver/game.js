(() => {
  const $ = (id) => document.getElementById(id);
  const u = (text) => text.replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const saveKey = "animal_abyss_diver_save";
  const en = { title:"Animal Abyss Diver",language:"Language",headline:"Choose how deep to risk the dive.",intro:"Recover relics, read hazards, and surface before oxygen runs out.",guideTitle:"How to dive",guideCopy:"Choose a route, swim through three zones, use sonar before a risky pocket, and surface with your salvage.",start:"Start Dive",stage:"Choose a dive route",stageHint:"Drag routes to compare depth and oxygen risk.",route:"Route {n}",relic:"Relic",oxygen:"Oxygen",zone:"Zone {n}/3",salvage:"Salvage {n}",left:"Swim left",right:"Swim right",sonar:"Sonar",surface:"Surface",beacon:"Beacon 3",beaconUsed:"Beacon used",beaconNeed:"Need 3 diamonds",beaconHelp:"One use per dive: restore oxygen to 30%.",collect:"Recovered a relic.",hazard:"Hazard hit: oxygen lost.",sonarSafe:"Sonar pulse reveals the safer lane.",chooseLane:"Choose a lane, then surface or continue.",sonarLane:"Sonar marks the safe lane.",clear:"Dive complete!",partial:"You surfaced safely with a partial recovery.",coins:"Salvage coins +{n}",rank:"Diver rank {n}",next:"Next route",menu:"Main menu",back:"Back",relicNames:["Compass","Moon Pearl","Rune Tablet"] };
  Object.assign(en, { sonar:"Sonar {n}", sonarEmpty:"Sonar depleted", sonarLeft:"Sonar: LEFT lane is safer.", sonarRight:"Sonar: RIGHT lane is safer.", sonarBoth:"Sonar: both lanes are clear.", safeLane:"Safer", riskLane:"Risk" });
  en.start = "Start Game";
  const z = (...codes) => codes.map(u);
  const zh = { title:u("\\u52d5\\u7269\\u6df1\\u6df5\\u6f5b\\u822a\\u54e1"),language:u("\\u8a9e\\u8a00"),headline:u("\\u9078\\u64c7\\u8981\\u6f5b\\u5165\\u591a\\u6df1\\u7684\\u98a8\\u96aa\\u3002"),intro:u("\\u56de\\u6536\\u907a\\u7269\\u3001\\u5224\\u8b80\\u5371\\u96aa\\uff0c\\u5728\\u6c27\\u6c23\\u8017\\u76e1\\u524d\\u6d6e\\u4e0a\\u6d77\\u9762\\u3002"),guideTitle:u("\\u6f5b\\u6c34\\u65b9\\u5f0f"),guideCopy:u("\\u9078\\u64c7\\u8def\\u7dda\\uff0c\\u7a7f\\u8d8a\\u4e09\\u500b\\u6d77\\u57df\\uff1b\\u9047\\u5230\\u5371\\u96aa\\u5340\\u524d\\u4f7f\\u7528\\u8072\\u7d0d\\uff0c\\u4e26\\u5e36\\u8457\\u6253\\u64c8\\u54c1\\u9069\\u6642\\u4e0a\\u6d6e\\u3002"),start:u("\\u958b\\u59cb\\u6f5b\\u6c34"),stage:u("\\u9078\\u64c7\\u6f5b\\u6c34\\u8def\\u7dda"),stageHint:u("\\u5de6\\u53f3\\u62d6\\u66f3\\u8def\\u7dda\\uff0c\\u6bd4\\u8f03\\u6df1\\u5ea6\\u8207\\u6c27\\u6c23\\u98a8\\u96aa\\u3002"),route:u("\\u8def\\u7dda {n}"),relic:u("\\u907a\\u7269"),oxygen:u("\\u6c27\\u6c23"),zone:u("\\u6d77\\u57df {n}/3"),salvage:u("\\u6253\\u64c8\\u54c1 {n}"),left:u("\\u5f80\\u5de6\\u6e38"),right:u("\\u5f80\\u53f3\\u6e38"),sonar:u("\\u8072\\u7d0d"),surface:u("\\u4e0a\\u6d6e"),beacon:u("\\u7dca\\u6025\\u4fe1\\u6a19 3"),beaconUsed:u("\\u5df2\\u4f7f\\u7528\\u4fe1\\u6a19"),beaconNeed:u("\\u9700\\u8981 3 \\u9846\\u947d\\u77f3"),beaconHelp:u("\\u6bcf\\u6b21\\u6f5b\\u6c34\\u9650\\u7528\\u4e00\\u6b21\\uff1a\\u5c07\\u6c27\\u6c23\\u56de\\u5fa9\\u81f3 30%\\u3002"),collect:u("\\u56de\\u6536\\u4e86\\u4e00\\u4ef6\\u907a\\u7269\\u3002"),hazard:u("\\u649e\\u4e0a\\u5371\\u96aa\\u7269\\uff0c\\u6c27\\u6c23\\u6e1b\\u5c11\\u3002"),sonarSafe:u("\\u8072\\u7d0d\\u8108\\u885d\\u6a19\\u793a\\u51fa\\u8f03\\u5b89\\u5168\\u7684\\u822a\\u7dda\\u3002"),chooseLane:u("\\u9078\\u64c7\\u822a\\u7dda\\uff0c\\u518d\\u6c7a\\u5b9a\\u7e7c\\u7e8c\\u6216\\u4e0a\\u6d6e\\u3002"),sonarLane:u("\\u8072\\u7d0d\\u5df2\\u6a19\\u793a\\u5b89\\u5168\\u822a\\u7dda\\u3002"),clear:u("\\u6f5b\\u822a\\u5b8c\\u6210\\uff01"),partial:u("\\u4f60\\u5b89\\u5168\\u4e0a\\u6d6e\\uff0c\\u5e36\\u56de\\u90e8\\u5206\\u6253\\u64c8\\u54c1\\u3002"),coins:u("\\u6253\\u64c8\\u5e63 +{n}"),rank:u("\\u6f5b\\u822a\\u54e1\\u7b49\\u7d1a {n}"),next:u("\\u4e0b\\u4e00\\u689d\\u8def\\u7dda"),menu:u("\\u56de\\u5230\\u4e3b\\u9078\\u55ae"),back:u("\\u8fd4\\u56de"),relicNames:z("\\u6f6e\\u6c50\\u7f85\\u76e4","\\u6708\\u5149\\u73cd\\u73e0","\\u7b26\\u6587\\u77f3\\u677f") };
  Object.assign(zh, {
    guideCopy:u("\\u9078\\u64c7\\u8def\\u7dda\\uff0c\\u7a7f\\u8d8a\\u4e09\\u500b\\u6d77\\u57df\\uff1b\\u9047\\u5230\\u5371\\u96aa\\u5340\\u524d\\u4f7f\\u7528\\u8072\\u7d0d\\uff0c\\u4e26\\u5e36\\u8457\\u6253\\u6488\\u54c1\\u9069\\u6642\\u4e0a\\u6d6e\\u3002"),
    salvage:u("\\u6253\\u6488\\u54c1 {n}"),
    partial:u("\\u4f60\\u5b89\\u5168\\u4e0a\\u6d6e\\uff0c\\u5e36\\u56de\\u90e8\\u5206\\u6253\\u6488\\u54c1\\u3002"),
    coins:u("\\u6253\\u6488\\u5e63 +{n}"),
    sonar:u("\\u8072\\u7d0d {n}"),
    sonarEmpty:u("\\u8072\\u7d0d\\u6b21\\u6578\\u5df2\\u7528\\u5b8c"),
    sonarLeft:u("\\u8072\\u7d0d\\uff1a\\u5de6\\u5074\\u822a\\u7dda\\u8f03\\u5b89\\u5168\\u3002"),
    sonarRight:u("\\u8072\\u7d0d\\uff1a\\u53f3\\u5074\\u822a\\u7dda\\u8f03\\u5b89\\u5168\\u3002"),
    sonarBoth:u("\\u8072\\u7d0d\\uff1a\\u5de6\\u53f3\\u822a\\u7dda\\u76ee\\u524d\\u90fd\\u5b89\\u5168\\u3002"),
    safeLane:u("\\u5b89\\u5168"),
    riskLane:u("\\u5371\\u96aa")
  });
  zh.start = u("\\u958b\\u59cb\\u904a\\u6232");
  let locale = localStorage.getItem("weightPlayLocale") || "en"; let save = { rank:1, coins:0, unlocked:1, ...JSON.parse(localStorage.getItem(saveKey)||"{}") }; let state = {};
  const routes = [{risk:1},{risk:2},{risk:3}], t = (key, values={}) => Object.entries(values).reduce((value,[name,replacement]) => value.replace(`{${name}}`,replacement),(locale === "zh-Hant" ? zh : en)[key]);
  const wallet = () => window.WeightPlayWallet?.read?.().diamonds ?? 0, persist = () => localStorage.setItem(saveKey,JSON.stringify(save));
  function show(id){["mainScreen","stageScreen","battleShell","result"].forEach((screen)=>$(screen).classList.toggle("hidden",screen!==id));$("mainHeader").classList.toggle("hidden",id!=="mainScreen");}
  function renderRoutes(){ $("routeRail").innerHTML=""; routes.forEach((route,index)=>{const n=index+1, card=document.createElement("button");card.className=`route-card${n===state.route?" is-selected":""}`;card.disabled=n>save.unlocked;card.innerHTML=`<strong>${t("route",{n})}</strong><span>${t("relic")}: ${(locale === "zh-Hant" ? zh : en).relicNames[index]}</span><small>${t("oxygen")}: ${100-route.risk*12}%</small>`;card.onclick=()=>start(n);$("routeRail").append(card);});}
  function isRisky(direction){return (state.zone+state.route+(direction==="right"?1:0))%3===0;}
  function sonarMessage(){const leftRisk=isRisky("left"),rightRisk=isRisky("right");if(!leftRisk&&rightRisk)return t("sonarLeft");if(leftRisk&&!rightRisk)return t("sonarRight");return t("sonarBoth");}
  function renderBattle(){
    $("battleTitle").textContent=t("route",{n:state.route});$("zoneText").textContent=t("zone",{n:state.zone});$("oxygenText").textContent=`${t("oxygen")} ${state.oxygen}%`;$("objectiveText").textContent=state.sonar?sonarMessage():t("chooseLane");$("salvageText").textContent=t("salvage",{n:state.salvage});$("diverArt").style.left=state.zone===1?"8%":state.zone===2?"36%":"62%";$("hazardArt").style.opacity=state.sonar?".25":".8";$("relicArt").style.opacity=state.sonar?"1":".76";$("fxArt").classList.toggle("hidden",!state.sonar);$("diamondText").querySelector("b").textContent=wallet();$("beaconBtn").textContent=state.beaconUsed?t("beaconUsed"):t("beacon");$("beaconBtn").disabled=state.beaconUsed;$("sonarBtn").textContent=t("sonar",{n:state.sonarCharges});$("sonarBtn").disabled=state.sonarCharges<=0;
    for(const direction of ["left","right"]){const button=$(`${direction}Btn`),risk=state.sonar&&isRisky(direction);button.textContent=state.sonar?`${t(direction)} - ${t(risk?"riskLane":"safeLane")}`:t(direction);button.classList.toggle("is-safe",state.sonar&&!risk);button.classList.toggle("is-risk",risk);}
  }
  function start(route){state={route,zone:1,oxygen:100,salvage:0,sonar:false,sonarCharges:2,beaconUsed:false};show("battleShell");renderBattle();}
  function finish(clear){const earned=Math.max(1,state.salvage)+(clear?2:0);save.coins+=earned;if(clear){save.rank+=1;save.unlocked=Math.max(save.unlocked,Math.min(3,state.route+1));}persist();show("result");$("resultTitle").textContent=clear?t("clear"):t("partial");$("resultCopy").textContent=clear?t("collect"):t("partial");$("resultRewards").innerHTML=`<span>${t("coins",{n:earned})}</span><span>${t("rank",{n:save.rank})}</span>`;$("nextBtn").textContent=t("next");$("menuBtn").textContent=t("menu");$("nextBtn").onclick=()=>{show("stageScreen");renderRoutes();};}
  function move(direction){const risky=isRisky(direction);state.oxygen=Math.max(0,state.oxygen-(risky&&!state.sonar?25:12));state.salvage+=risky&&!state.sonar?0:1;$("feedback").textContent=risky&&!state.sonar?t("hazard"):t("collect");state.sonar=false;if(state.oxygen<=0||state.zone>=3)return finish(state.oxygen>0);state.zone+=1;renderBattle();}
  function localize(){document.documentElement.lang=locale;document.title=`${t("title")} - Internal Trial`;$("title").textContent=t("title");$("languageLabel").textContent=t("language");$("localeSelect").value=locale;$("headline").textContent=t("headline");$("intro").textContent=t("intro");$("guideTitle").textContent=t("guideTitle");$("guideCopy").textContent=t("guideCopy");$("startBtn").textContent=t("start");$("stageTitle").textContent=t("stage");$("stageHint").textContent=t("stageHint");$("leftBtn").textContent=t("left");$("rightBtn").textContent=t("right");$("sonarBtn").textContent=t("sonar");$("surfaceBtn").textContent=t("surface");$("stageBack").ariaLabel=t("back");$("battleBack").ariaLabel=t("back");$("progress").textContent=`${t("rank",{n:save.rank})} - ${t("coins",{n:save.coins})}`;renderRoutes();if(state.route)renderBattle();}
  $("startBtn").onclick=()=>{show("stageScreen");renderRoutes();};$("stageBack").onclick=()=>show("mainScreen");$("battleBack").onclick=()=>{show("stageScreen");renderRoutes();};$("menuBtn").onclick=()=>show("mainScreen");$("leftBtn").onclick=()=>move("left");$("rightBtn").onclick=()=>move("right");$("sonarBtn").onclick=()=>{if(state.sonar){$("feedback").textContent=sonarMessage();return;}if(state.sonarCharges<=0){$("feedback").textContent=t("sonarEmpty");return;}state.sonarCharges-=1;state.sonar=true;$("feedback").textContent=sonarMessage();renderBattle();};$("surfaceBtn").onclick=()=>finish(false);$("beaconBtn").onclick=()=>{if(state.beaconUsed)return;if(!window.WeightPlayWallet?.spendDiamonds?.(3)){$("feedback").textContent=t("beaconNeed");return;}state.beaconUsed=true;state.oxygen=Math.max(state.oxygen,30);$("feedback").textContent=`${t("beaconUsed")}: ${t("beaconHelp")}`;window.WonderAnalytics?.track?.("diamond_spend",{sink:"abyss_emergency_beacon",amount:3});renderBattle();};$("localeSelect").onchange=(event)=>{locale=event.target.value;localStorage.setItem("weightPlayLocale",locale);localize();};
  let drag;
  let suppressRouteClickUntil = 0;
  const routeRail = $("routeRail");
  routeRail.addEventListener("pointerdown", (event) => {
    if (routeRail.dataset.wpStageRail === "true") return;
    drag = { id: event.pointerId, x: event.clientX, left: routeRail.scrollLeft, active: false };
  });
  routeRail.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    const delta = event.clientX - drag.x;
    if (!drag.active && Math.abs(delta) > 8) {
      drag.active = true;
      routeRail.setPointerCapture(event.pointerId);
    }
    if (!drag.active) return;
    event.preventDefault();
    routeRail.scrollLeft = drag.left - delta;
  });
  const finishRoutePointer = (event) => {
    if (drag?.id !== event.pointerId) return;
    if (routeRail.hasPointerCapture(event.pointerId)) routeRail.releasePointerCapture(event.pointerId);
    if (drag.active) suppressRouteClickUntil = performance.now() + 100;
    drag = null;
  };
  routeRail.addEventListener("pointerup", finishRoutePointer);
  routeRail.addEventListener("pointercancel", finishRoutePointer);
  routeRail.addEventListener("click", (event) => {
    if (performance.now() >= suppressRouteClickUntil) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  localize();
  const lobbyLabels = { en: "Back to lobby", "zh-Hant": u("\\u8fd4\\u56de\\u5927\\u5ef3") };
  function syncMetadata() {
    document.title = `${t("title")} - WeightPlay`;
    $("homeLink").ariaLabel = lobbyLabels[locale] || lobbyLabels.en;
    document.querySelector("#pageDescription").content = t("intro");
  }
  syncMetadata();
  $("localeSelect").addEventListener("change", () => window.setTimeout(syncMetadata, 0));
})();
