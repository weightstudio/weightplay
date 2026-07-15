(() => {
  const $ = (id) => document.getElementById(id);
  const u = (text) => text.replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const saveKey = "animal_abyss_diver_save";
  const en = { title:"Animal Abyss Diver",language:"Language",headline:"Choose how deep to risk the dive.",intro:"Recover relics, read hazards, and surface before oxygen runs out.",guideTitle:"How to dive",guideCopy:"Choose a route, swim through three zones, use sonar before a risky pocket, and surface with your salvage.",start:"Start Dive",stage:"Choose a dive route",stageHint:"Drag routes to compare depth and oxygen risk.",route:"Route {n}",relic:"Relic",oxygen:"Oxygen",zone:"Zone {n}/3",salvage:"Salvage {n}",left:"Swim left",right:"Swim right",sonar:"Sonar",surface:"Surface",beacon:"Beacon 3",beaconUsed:"Beacon used",beaconNeed:"Need 3 diamonds",beaconHelp:"One use per dive: restore oxygen to 30%.",collect:"Recovered a relic.",hazard:"Hazard hit: oxygen lost.",sonarSafe:"Sonar pulse reveals the safer lane.",chooseLane:"Choose a lane, then surface or continue.",sonarLane:"Sonar marks the safe lane.",clear:"Dive complete!",partial:"You surfaced safely with a partial recovery.",coins:"Salvage coins +{n}",rank:"Diver rank {n}",next:"Next route",menu:"Main menu",back:"Back",relicNames:["Compass","Moon Pearl","Rune Tablet"] };
  Object.assign(en, { sonar:"Sonar {n}", sonarEmpty:"Sonar depleted", sonarLeft:"Sonar: LEFT lane is safer.", sonarRight:"Sonar: RIGHT lane is safer.", sonarBoth:"Sonar: both lanes are clear.", safeLane:"SAFE", riskLane:"DANGER", risk:"Risk {n}/3", routeAction:"Tap to start", locked:"Locked", objectiveScan:"STEP 1: Use SONAR to reveal the safe lane.", objectiveChoose:"STEP 2: Tap the green SAFE lane.", objectiveContinue:"Choose a lane, or SURFACE to keep your salvage.", objectiveLow:"Oxygen is low. SURFACE now or use the emergency beacon.", coachTitle:"Your dive plan", coachStep1:"Use SONAR to reveal which lane is safe.", coachStep2:"Choose LEFT or RIGHT to cross all 3 zones and recover relics.", coachStep3:"SURFACE anytime to keep your salvage. If oxygen reaches 0, the dive ends.", coachStart:"Begin dive", help:"How to play", oxygenShort:"O2", resultClear:"You crossed all 3 zones and recovered {n} relics.", resultSurface:"You surfaced with {n} relics safely stored." });
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
  Object.assign(zh, {
    risk:u("\\u98a8\\u96aa {n}/3"),
    routeAction:u("\\u9ede\\u64ca\\u958b\\u59cb"),
    locked:u("\\u5c1a\\u672a\\u89e3\\u9396"),
    objectiveScan:u("\\u6b65\\u9a5f 1\\uff1a\\u5148\\u6309\\u300c\\u8072\\u7d0d\\u300d\\uff0c\\u627e\\u51fa\\u5b89\\u5168\\u822a\\u7dda\\u3002"),
    objectiveChoose:u("\\u6b65\\u9a5f 2\\uff1a\\u9ede\\u9078\\u7da0\\u8272\\u7684\\u5b89\\u5168\\u822a\\u7dda\\u3002"),
    objectiveContinue:u("\\u9078\\u64c7\\u822a\\u7dda\\u7e7c\\u7e8c\\uff0c\\u6216\\u6309\\u300c\\u4e0a\\u6d6e\\u300d\\u4fdd\\u4f4f\\u6253\\u6488\\u54c1\\u3002"),
    objectiveLow:u("\\u6c27\\u6c23\\u4e0d\\u8db3\\uff1a\\u8acb\\u7acb\\u5373\\u4e0a\\u6d6e\\uff0c\\u6216\\u4f7f\\u7528\\u7dca\\u6025\\u4fe1\\u6a19\\u3002"),
    coachTitle:u("\\u6f5b\\u822a\\u4efb\\u52d9\\u53ea\\u6709 3 \\u6b65"),
    coachStep1:u("\\u6309\\u300c\\u8072\\u7d0d\\u300d\\uff0c\\u627e\\u51fa\\u7da0\\u8272\\u7684\\u5b89\\u5168\\u822a\\u7dda\\u3002"),
    coachStep2:u("\\u9078\\u5de6\\u5074\\u6216\\u53f3\\u5074\\uff0c\\u7a7f\\u8d8a 3 \\u500b\\u6d77\\u57df\\u4e26\\u56de\\u6536\\u907a\\u7269\\u3002"),
    coachStep3:u("\\u96a8\\u6642\\u6309\\u300c\\u4e0a\\u6d6e\\u300d\\u4fdd\\u4f4f\\u6253\\u6488\\u54c1\\uff1b\\u6c27\\u6c23\\u6b78 0 \\u5c31\\u6703\\u7d50\\u675f\\u3002"),
    coachStart:u("\\u958b\\u59cb\\u6f5b\\u822a"),
    help:u("\\u904a\\u73a9\\u65b9\\u5f0f"),
    oxygenShort:u("\\u6c27\\u6c23"),
    resultClear:u("\\u4f60\\u5df2\\u7a7f\\u8d8a 3 \\u500b\\u6d77\\u57df\\uff0c\\u5e36\\u56de {n} \\u4ef6\\u907a\\u7269\\u3002"),
    resultSurface:u("\\u5df2\\u5b89\\u5168\\u4e0a\\u6d6e\\uff0c\\u4fdd\\u4f4f {n} \\u4ef6\\u6253\\u6488\\u54c1\\u3002")
  });
  zh.start = u("\\u958b\\u59cb\\u904a\\u6232");
  Object.assign(en, {
    guideCopy:"Read each lane signal, spend limited Sonar scans when the signal is uncertain, reach the salvage target, then decide whether to press deeper or surface safely.",
    stageHint:"Drag routes to compare zones, salvage target, and oxygen risk.",
    zoneProgress:"Zone {n}/{total}",
    target:"Target {n}/{target}",
    zones:"{n} zones",
    signalSteady:"Steady echo",
    signalStrong:"Strong echo",
    signalRough:"Turbulent echo",
    hiddenOutcome:"Outcome unknown",
    outcomeRelic:"Relic +1 / O2 -10",
    outcomeCache:"Treasure +2 / O2 -16",
    outcomeOxygen:"Air pocket / O2 +18",
    outcomeCurrent:"Current / O2 -18",
    outcomeHazard:"Trap / O2 -28",
    foundRelic:"Relic recovered: +1 salvage, -10 oxygen.",
    foundCache:"Treasure cache: +2 salvage, -16 oxygen.",
    foundOxygen:"Air pocket: oxygen restored by 18.",
    hitCurrent:"Strong current: -18 oxygen.",
    hitHazard:"Trap triggered: -28 oxygen.",
    sonarRead:"Sonar reveals LEFT: {left} | RIGHT: {right}",
    objectiveScan:"Compare both signals. Use SONAR when the risk is unclear.",
    objectiveChoose:"Sonar complete: choose the result you want.",
    objectiveContinue:"Reach the salvage target, or SURFACE to bank a partial haul.",
    coachTitle:"Every lane is a risk decision",
    coachStep1:"Compare the two signals. Strong echoes may hide treasure or a trap.",
    coachStep2:"Spend one of 2 SONAR scans to reveal both exact outcomes.",
    coachStep3:"Reach the salvage target before the final zone. SURFACE banks a partial haul but does not clear the route.",
    clear:"Route cleared!",
    missed:"Target missed",
    oxygenLost:"Oxygen depleted",
    resultClear:"Target reached: {n}/{target} salvage across {zones} zones.",
    resultSurface:"You surfaced with {n} salvage. The route remains uncleared.",
    resultMiss:"The dive ended at {n}/{target} salvage. Try a different signal pattern.",
    resultFail:"Oxygen reached zero. Only half of the {n} salvage was secured.",
    retry:"Retry route"
  });
  Object.assign(zh, {
    guideCopy:u("\\u5224\\u8b80\\u6bcf\\u689d\\u822a\\u7dda\\u7684\\u8a0a\\u865f\\uff0c\\u5728\\u4e0d\\u78ba\\u5b9a\\u6642\\u6d88\\u8017\\u6709\\u9650\\u8072\\u7d0d\\uff0c\\u9054\\u6210\\u6253\\u6488\\u76ee\\u6a19\\u5f8c\\u518d\\u6c7a\\u5b9a\\u7e7c\\u7e8c\\u6df1\\u6f5b\\u6216\\u5b89\\u5168\\u4e0a\\u6d6e\\u3002"),
    stageHint:u("\\u5de6\\u53f3\\u62d6\\u66f3\\u8def\\u7dda\\uff0c\\u6bd4\\u8f03\\u6d77\\u57df\\u6578\\u3001\\u6253\\u6488\\u76ee\\u6a19\\u8207\\u6c27\\u6c23\\u98a8\\u96aa\\u3002"),
    zoneProgress:u("\\u6d77\\u57df {n}/{total}"),
    target:u("\\u76ee\\u6a19 {n}/{target}"),
    zones:u("{n} \\u500b\\u6d77\\u57df"),
    signalSteady:u("\\u7a69\\u5b9a\\u56de\\u8072"),
    signalStrong:u("\\u5f37\\u70c8\\u56de\\u8072"),
    signalRough:u("\\u4e82\\u6d41\\u96dc\\u8a0a"),
    hiddenOutcome:u("\\u7d50\\u679c\\u5c1a\\u672a\\u78ba\\u8a8d"),
    outcomeRelic:u("\\u907a\\u7269 +1 / \\u6c27\\u6c23 -10"),
    outcomeCache:u("\\u5bf6\\u85cf +2 / \\u6c27\\u6c23 -16"),
    outcomeOxygen:u("\\u6c27\\u6c23\\u6ce1 / \\u6c27\\u6c23 +18"),
    outcomeCurrent:u("\\u4e82\\u6d41 / \\u6c27\\u6c23 -18"),
    outcomeHazard:u("\\u9677\\u9631 / \\u6c27\\u6c23 -28"),
    foundRelic:u("\\u56de\\u6536\\u907a\\u7269\\uff1a\\u6253\\u6488 +1\\uff0c\\u6c27\\u6c23 -10\\u3002"),
    foundCache:u("\\u767c\\u73fe\\u5bf6\\u85cf\\uff1a\\u6253\\u6488 +2\\uff0c\\u6c27\\u6c23 -16\\u3002"),
    foundOxygen:u("\\u767c\\u73fe\\u6c27\\u6c23\\u6ce1\\uff1a\\u6c27\\u6c23 +18\\u3002"),
    hitCurrent:u("\\u906d\\u9047\\u5f37\\u52c1\\u4e82\\u6d41\\uff1a\\u6c27\\u6c23 -18\\u3002"),
    hitHazard:u("\\u89f8\\u767c\\u9677\\u9631\\uff1a\\u6c27\\u6c23 -28\\u3002"),
    sonarRead:u("\\u8072\\u7d0d\\u7d50\\u679c\\uff0c\\u5de6\\u5074\\uff1a{left}\\uff5c\\u53f3\\u5074\\uff1a{right}"),
    objectiveScan:u("\\u6bd4\\u8f03\\u5169\\u908a\\u8a0a\\u865f\\uff1b\\u4e0d\\u78ba\\u5b9a\\u6642\\u518d\\u4f7f\\u7528\\u8072\\u7d0d\\u3002"),
    objectiveChoose:u("\\u8072\\u7d0d\\u5b8c\\u6210\\uff1a\\u9078\\u64c7\\u4f60\\u8981\\u7684\\u7d50\\u679c\\u3002"),
    objectiveContinue:u("\\u9054\\u6210\\u6253\\u6488\\u76ee\\u6a19\\uff0c\\u6216\\u63d0\\u524d\\u4e0a\\u6d6e\\u4fdd\\u4f4f\\u90e8\\u5206\\u6210\\u679c\\u3002"),
    coachTitle:u("\\u6bcf\\u689d\\u822a\\u7dda\\u90fd\\u662f\\u98a8\\u96aa\\u6c7a\\u7b56"),
    coachStep1:u("\\u6bd4\\u8f03\\u5169\\u908a\\u8a0a\\u865f\\uff1b\\u5f37\\u70c8\\u56de\\u8072\\u53ef\\u80fd\\u662f\\u5bf6\\u85cf\\uff0c\\u4e5f\\u53ef\\u80fd\\u662f\\u9677\\u9631\\u3002"),
    coachStep2:u("\\u6d88\\u8017 2 \\u6b21\\u8072\\u7d0d\\u4e4b\\u4e00\\uff0c\\u53ef\\u4ee5\\u770b\\u898b\\u5169\\u908a\\u7684\\u78ba\\u5207\\u7d50\\u679c\\u3002"),
    coachStep3:u("\\u5728\\u6700\\u5f8c\\u6d77\\u57df\\u524d\\u9054\\u6210\\u6253\\u6488\\u76ee\\u6a19\\uff1b\\u63d0\\u524d\\u4e0a\\u6d6e\\u53ef\\u4fdd\\u4f4f\\u6210\\u679c\\uff0c\\u4f46\\u4e0d\\u6703\\u904e\\u95dc\\u3002"),
    clear:u("\\u8def\\u7dda\\u5b8c\\u6210\\uff01"),
    missed:u("\\u672a\\u9054\\u6210\\u76ee\\u6a19"),
    oxygenLost:u("\\u6c27\\u6c23\\u8017\\u76e1"),
    resultClear:u("\\u5df2\\u9054\\u6210\\u76ee\\u6a19\\uff1a\\u6253\\u6488 {n}/{target}\\uff0c\\u7a7f\\u8d8a {zones} \\u500b\\u6d77\\u57df\\u3002"),
    resultSurface:u("\\u5df2\\u5e36\\u8457 {n} \\u4ef6\\u6253\\u6488\\u54c1\\u4e0a\\u6d6e\\uff0c\\u4f46\\u672c\\u8def\\u7dda\\u5c1a\\u672a\\u904e\\u95dc\\u3002"),
    resultMiss:u("\\u6f5b\\u822a\\u7d50\\u675f\\u6642\\u53ea\\u6709 {n}/{target} \\u4ef6\\u6253\\u6488\\u54c1\\uff0c\\u8acb\\u5617\\u8a66\\u4e0d\\u540c\\u7684\\u8a0a\\u865f\\u7d44\\u5408\\u3002"),
    resultFail:u("\\u6c27\\u6c23\\u6b78\\u96f6\\uff0c{n} \\u4ef6\\u6253\\u6488\\u54c1\\u53ea\\u4fdd\\u4f4f\\u4e00\\u534a\\u3002"),
    retry:u("\\u518d\\u8a66\\u4e00\\u6b21")
  });
  let locale = localStorage.getItem("weightPlayLocale") || "en"; let save = { rank:1, coins:0, unlocked:1, ...JSON.parse(localStorage.getItem(saveKey)||"{}") }; let state = {};
  const routes = [
    {risk:1,zones:5,target:4,encounters:[["relic","hazard"],["current","cache"],["oxygen","relic"],["cache","hazard"],["relic","current"]]},
    {risk:2,zones:6,target:6,encounters:[["cache","hazard"],["current","relic"],["oxygen","cache"],["hazard","relic"],["cache","current"],["relic","hazard"]]},
    {risk:3,zones:7,target:8,encounters:[["hazard","cache"],["relic","current"],["cache","hazard"],["oxygen","relic"],["hazard","cache"],["current","relic"],["cache","hazard"]]}
  ];
  const outcomes = {
    relic:{oxygen:-10,salvage:1,safe:true,signal:"signalSteady",label:"outcomeRelic",feedback:"foundRelic"},
    cache:{oxygen:-16,salvage:2,safe:true,signal:"signalStrong",label:"outcomeCache",feedback:"foundCache"},
    oxygen:{oxygen:18,salvage:0,safe:true,signal:"signalSteady",label:"outcomeOxygen",feedback:"foundOxygen"},
    current:{oxygen:-18,salvage:0,safe:false,signal:"signalRough",label:"outcomeCurrent",feedback:"hitCurrent"},
    hazard:{oxygen:-28,salvage:0,safe:false,signal:"signalStrong",label:"outcomeHazard",feedback:"hitHazard"}
  };
  const t = (key, values={}) => Object.entries(values).reduce((value,[name,replacement]) => value.replace(`{${name}}`,replacement),(locale === "zh-Hant" ? zh : en)[key]);
  const wallet = () => window.WeightPlayWallet?.read?.().diamonds ?? 0, persist = () => localStorage.setItem(saveKey,JSON.stringify(save));
  function show(id){const resultActive=id==="result";$("mainScreen").classList.toggle("hidden",id!=="mainScreen");$("stageScreen").classList.toggle("hidden",id!=="stageScreen");$("battleShell").classList.toggle("hidden",id!=="battleShell"&&!resultActive);$("result").classList.toggle("hidden",!resultActive);$("mainHeader").classList.toggle("hidden",id!=="mainScreen");}
  function renderRoutes(){ $("routeRail").innerHTML=""; routes.forEach((route,index)=>{const n=index+1, card=document.createElement("button"),locked=n>save.unlocked;card.className=`route-card${n===state.route?" is-selected":""}`;card.disabled=locked;card.innerHTML=`<strong>${t("route",{n})}</strong><span>${t("relic")}: ${(locale === "zh-Hant" ? zh : en).relicNames[index]}</span><small>${t("zones",{n:route.zones})} · ${t("target",{n:0,target:route.target})} · ${t("risk",{n:route.risk})}</small><em>${t(locked?"locked":"routeAction")}</em>`;card.onclick=()=>start(n);$("routeRail").append(card);});}
  function routeConfig(){return routes[state.route-1];}
  function encounter(direction){const pair=routeConfig().encounters[state.zone-1];return outcomes[pair[direction==="left"?0:1]];}
  function sonarMessage(){return t("sonarRead",{left:t(encounter("left").label),right:t(encounter("right").label)});}
  function renderBattle(){
    const config=routeConfig();
    $("battleTitle").textContent=t("route",{n:state.route});
    $("zoneText").textContent=t("zoneProgress",{n:state.zone,total:config.zones});
    $("oxygenText").textContent=`${t("oxygenShort")} ${state.oxygen}%`;
    $("oxygenBar").style.width=`${state.oxygen}%`;
    $("oxygenBar").classList.toggle("is-low",state.oxygen<=30);
    $("objectiveText").textContent=state.oxygen<=30?t("objectiveLow"):state.sonar?t("objectiveChoose"):state.zone===1?t("objectiveScan"):t("objectiveContinue");
    $("salvageText").textContent=t("target",{n:state.salvage,target:config.target});
    $("diverArt").style.left=`${8+((state.zone-1)/Math.max(1,config.zones-1))*54}%`;
    $("hazardArt").style.opacity=state.sonar?".35":".72";
    $("relicArt").style.opacity=state.sonar?"1":".7";
    $("fxArt").classList.toggle("hidden",!state.sonar);
    $("diamondText").querySelector("b").textContent=wallet();
    $("beaconBtn").textContent=state.beaconUsed?t("beaconUsed"):t("beacon");
    $("beaconBtn").disabled=state.beaconUsed;
    $("sonarBtn").textContent=t("sonar",{n:state.sonarCharges});
    $("sonarBtn").disabled=state.sonarCharges<=0;
    for(const direction of ["left","right"]){
      const button=$(`${direction}Btn`),outcome=encounter(direction);
      const detail=state.sonar?t(outcome.label):t(outcome.signal);
      button.innerHTML=`<strong>${t(direction)}</strong><small>${detail}</small>`;
      button.classList.toggle("is-safe",state.sonar&&outcome.safe);
      button.classList.toggle("is-risk",state.sonar&&!outcome.safe);
      button.setAttribute("aria-label",`${t(direction)} - ${detail}`);
    }
  }
  function setCoach(open){$("diveCoach").classList.toggle("hidden",!open);}
  function start(route){state={route,zone:1,oxygen:100,salvage:0,sonar:false,sonarCharges:2,beaconUsed:false};show("battleShell");renderBattle();$("feedback").textContent=t("objectiveScan");setCoach(!save.tutorialDone);}
  function finish(mode){
    const config=routeConfig(),clear=mode==="clear";
    const earned=mode==="fail"?Math.floor(state.salvage/2):state.salvage+(clear?2:0);
    save.coins+=earned;
    if(clear){save.rank+=1;save.unlocked=Math.max(save.unlocked,Math.min(3,state.route+1));}
    persist();show("result");
    $("resultTitle").textContent=clear?t("clear"):mode==="fail"?t("oxygenLost"):mode==="miss"?t("missed"):t("partial");
    const copyKey=clear?"resultClear":mode==="fail"?"resultFail":mode==="miss"?"resultMiss":"resultSurface";
    $("resultCopy").textContent=t(copyKey,{n:state.salvage,target:config.target,zones:config.zones});
    $("resultRewards").innerHTML=`<span>${t("coins",{n:earned})}</span><span>${t("rank",{n:save.rank})}</span>`;
    $("nextBtn").textContent=clear?t("next"):t("retry");$("menuBtn").textContent=t("menu");
    $("nextBtn").onclick=()=>clear?(show("stageScreen"),renderRoutes()):start(state.route);
  }
  function move(direction){
    const config=routeConfig(),outcome=encounter(direction);
    state.oxygen=Math.max(0,Math.min(100,state.oxygen+outcome.oxygen));
    state.salvage+=outcome.salvage;
    $("feedback").textContent=t(outcome.feedback);
    state.sonar=false;
    if(state.oxygen<=0)return finish("fail");
    if(state.zone>=config.zones)return finish(state.salvage>=config.target?"clear":"miss");
    state.zone+=1;renderBattle();
  }
  function localize(){document.documentElement.lang=locale;document.title=`${t("title")} - Internal Trial`;$("title").textContent=t("title");$("languageLabel").textContent=t("language");$("localeSelect").value=locale;$("headline").textContent=t("headline");$("intro").textContent=t("intro");$("guideTitle").textContent=t("guideTitle");$("guideCopy").textContent=t("guideCopy");$("startBtn").textContent=t("start");$("stageTitle").textContent=t("stage");$("stageHint").textContent=t("stageHint");$("leftBtn").textContent=t("left");$("rightBtn").textContent=t("right");$("sonarBtn").textContent=t("sonar",{n:state.sonarCharges??2});$("surfaceBtn").textContent=t("surface");$("coachTitle").textContent=t("coachTitle");$("coachStep1").textContent=t("coachStep1");$("coachStep2").textContent=t("coachStep2");$("coachStep3").textContent=t("coachStep3");$("coachStart").textContent=t("coachStart");$("helpBtn").ariaLabel=t("help");$("stageBack").ariaLabel=t("back");$("battleBack").ariaLabel=t("back");$("progress").textContent=`${t("rank",{n:save.rank})} - ${t("coins",{n:save.coins})}`;renderRoutes();if(state.route)renderBattle();}
  $("startBtn").onclick=()=>{show("stageScreen");renderRoutes();};$("stageBack").onclick=()=>show("mainScreen");$("battleBack").onclick=()=>{show("stageScreen");renderRoutes();};$("menuBtn").onclick=()=>show("mainScreen");$("leftBtn").onclick=()=>move("left");$("rightBtn").onclick=()=>move("right");$("helpBtn").onclick=()=>setCoach(true);$("coachStart").onclick=()=>{save.tutorialDone=true;persist();setCoach(false);$("feedback").textContent=t("objectiveScan");};$("sonarBtn").onclick=()=>{if(state.sonar){$("feedback").textContent=sonarMessage();return;}if(state.sonarCharges<=0){$("feedback").textContent=t("sonarEmpty");return;}state.sonarCharges-=1;state.sonar=true;$("feedback").textContent=sonarMessage();renderBattle();};$("surfaceBtn").onclick=()=>finish("surface");$("beaconBtn").onclick=()=>{if(state.beaconUsed)return;if(!window.WeightPlayWallet?.spendDiamonds?.(3)){$("feedback").textContent=t("beaconNeed");return;}state.beaconUsed=true;state.oxygen=Math.max(state.oxygen,30);$("feedback").textContent=`${t("beaconUsed")}: ${t("beaconHelp")}`;window.WonderAnalytics?.track?.("diamond_spend",{sink:"abyss_emergency_beacon",amount:3});renderBattle();};$("localeSelect").onchange=(event)=>{locale=event.target.value;localStorage.setItem("weightPlayLocale",locale);localize();};
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
