(() => {
  const GAME_VERSION = 15;
  document.body.dataset.wpCombinedSound = "true";
  const $ = (id) => document.getElementById(id);
  const playSound = (name) => window.WonderSound?.play?.(name);
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
    guideCopy:"Routes span 5–8 zones. Compare each lane's loot, danger, oxygen estimate, and environmental clues; Sonar, Shield, and fish counters share 4 power, so plan what to spend before surfacing.",
    stageHint:"Drag routes to compare zones, salvage target, and oxygen risk.",
    zoneProgress:"Zone {n}/{total}",
    target:"Target {n}/{target}",
    stageTarget:"Need {n} salvage",
    zones:"{n} zones",
    signalSteady:"Steady echo",
    signalStrong:"Strong echo",
    signalRough:"Turbulent echo",
    hiddenOutcome:"Outcome unknown",
    laneLeft:"LEFT TARGET",
    laneRight:"RIGHT TARGET",
    swimming:"Swimming toward {lane}...",
    clueGlint:"Tiny metal glints",
    clueCalm:"Bubbles rise steadily",
    clueHeavy:"A heavy hollow echo",
    clueScratches:"Fresh drag marks",
    clueBigBubbles:"Large bubbles drift up",
    clueWarm:"The water feels warmer",
    clueSand:"Sand streams sideways",
    clueFast:"Bubbles race past",
    clueRope:"A rope is cleanly cut",
    clueSilent:"Nearby fish have fled",
    fishTitle:"Territorial fish blocks the route!",
    fishObjective:"Read the attack, answer before time runs out, and preserve tool power.",
    fishTellLeft:"Its tail coils LEFT — it will charge LEFT!",
    fishTellRight:"Its tail coils RIGHT — it will charge RIGHT!",
    fishTellGlow:"Its gills flare CYAN — counter with a PULSE!",
    fishGuard:"Break guard {n}/3",
    fishTimer:"Reaction window",
    dodgeLeft:"Dodge left",
    dodgeRight:"Dodge right",
    pulse:"Counter pulse 1⚡",
    pulseNeed:"No power left for a counter pulse!",
    fishDodged:"Perfect dodge! Its guard drops.",
    fishPulsed:"Pulse countered the shockwave! Its guard drops.",
    fishHit:"Counter failed: oxygen -12.",
    fishTimeout:"Too slow: oxygen -12.",
    fishCleared:"The fish retreats. Bonus salvage +1 and power +1!",
    intel:"Loot {loot}/3 · Danger {danger}/3 · O2 {cost}",
    power:"Power {n}/4",
    sonarPowered:"Scan 2⚡",
    sonarNeed:"Need 2 power for an exact scan.",
    shield:"Shield 1⚡",
    shieldArmed:"Shield armed",
    shieldNeed:"Need 1 power to arm the shield.",
    shieldBlock:"Shield absorbed half the impact.",
    shortLoot:"LOOT",
    shortDanger:"RISK",
    shortOxygen:"O2",
    shortPower:"POWER",
    shortTarget:"TARGET",
    shortScan:"SCAN",
    shortShield:"SHIELD",
    shortSurface:"SURFACE",
    shortBeacon:"BEACON",
    shortChoose:"CHOOSE A LANE",
    shortConfirmed:"RESULTS REVEALED",
    shortLow:"LOW O2",
    shortReadAttack:"READ & COUNTER",
    shortLeft:"LEFT",
    shortRight:"RIGHT",
    shortLeftCharge:"LEFT CHARGE",
    shortRightCharge:"RIGHT CHARGE",
    shortShockwave:"SHOCKWAVE",
    shortDodgeLeft:"DODGE LEFT",
    shortCounter:"COUNTER",
    shortDodgeRight:"DODGE RIGHT",
    coachVisual1:"Compare loot, risk, and oxygen.",
    coachVisual2:"All tools share 4 power.",
    coachVisual3:"Choose a lane. Surface before O2 runs out.",
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
    objectiveScan:"Choose a target to swim into. Compare both signals; use SONAR when unsure.",
    objectiveChoose:"Sonar complete: choose the result you want.",
    objectiveContinue:"Reach the salvage target, or SURFACE to bank a partial haul.",
    completionRemaining:"Target reached · cross {remaining} more zones to complete.",
    coachTitle:"Dive plan",
    coachStep1:"Each zone places one target on the left and one on the right. Nori waits for your choice.",
    coachStep2:"Power is shared: exact Sonar costs 2⚡, a one-hit Shield costs 1⚡, and fish Pulse counters cost 1⚡.",
    coachStep3:"Compare loot, danger, and oxygen estimates. Save enough power for timed fish attacks, reach the target, or SURFACE early.",
    clear:"Route cleared!",
    missed:"Target missed",
    oxygenLost:"Oxygen depleted",
    resultClear:"Target reached: {n}/{target} salvage across {zones} zones.",
    resultSurface:"You surfaced with {n} salvage. The route remains uncleared.",
    resultMiss:"The dive ended at {n}/{target} salvage. Try a different signal pattern.",
    resultFail:"Oxygen reached zero. Only half of the {n} salvage was secured.",
    coinsEarned:"This dive: +{n} salvage coins",
    coinsSaved:"Saved total: {n} salvage coins",
    routeUnlocked:"New route unlocked: Route {n} · {name}",
    routeReady:"Next route ready: Route {n} · {name}",
    routeComplete:"All 30 dive routes cleared.",
    routeRetry:"Next target: {target} salvage across {zones} zones",
    retry:"Retry route"
  });
  Object.assign(zh, {
    guideCopy:"每條路線有 5–8 個海域。比較兩側的收益、危險、氧耗估計與環境線索；聲納、衝擊盾和魚戰反制共用 4 點電力，必須規劃消耗再決定何時上浮。",
    stageHint:u("\\u5de6\\u53f3\\u62d6\\u66f3\\u8def\\u7dda\\uff0c\\u6bd4\\u8f03\\u6d77\\u57df\\u6578\\u3001\\u6253\\u6488\\u76ee\\u6a19\\u8207\\u6c27\\u6c23\\u98a8\\u96aa\\u3002"),
    zoneProgress:u("\\u6d77\\u57df {n}/{total}"),
    target:u("\\u76ee\\u6a19 {n}/{target}"),
    stageTarget:u("\\u9700\\u6253\\u6488 {n}"),
    zones:u("{n} \\u500b\\u6d77\\u57df"),
    signalSteady:u("\\u7a69\\u5b9a\\u56de\\u8072"),
    signalStrong:u("\\u5f37\\u70c8\\u56de\\u8072"),
    signalRough:u("\\u4e82\\u6d41\\u96dc\\u8a0a"),
    hiddenOutcome:u("\\u7d50\\u679c\\u5c1a\\u672a\\u78ba\\u8a8d"),
    laneLeft:u("\\u5de6\\u5074\\u76ee\\u6a19"),
    laneRight:u("\\u53f3\\u5074\\u76ee\\u6a19"),
    swimming:u("\\u6b63\\u5728\\u6e38\\u5411{lane}..."),
    clueGlint:"細小金屬微光",
    clueCalm:"氣泡平穩上升",
    clueHeavy:"沉重的空洞回聲",
    clueScratches:"新鮮拖行刮痕",
    clueBigBubbles:"大型氣泡向上飄",
    clueWarm:"附近水溫較暖",
    clueSand:"泥沙快速向側邊流",
    clueFast:"氣泡高速掠過",
    clueRope:"繩索有整齊切口",
    clueSilent:"附近的小魚全逃走了",
    fishTitle:"領域魚擋住航線！",
    fishObjective:"讀招、在時間歸零前反制，並保留足夠的裝備電力。",
    fishTellLeft:"魚尾捲向左側——牠要往左衝！",
    fishTellRight:"魚尾捲向右側——牠要往右衝！",
    fishTellGlow:"魚鰓亮起青光——使用脈衝反制！",
    fishGuard:"破防進度 {n}/3",
    fishTimer:"反應時間",
    dodgeLeft:"往左閃",
    dodgeRight:"往右閃",
    pulse:"反制脈衝 1⚡",
    pulseNeed:"沒有足夠電力使用反制脈衝！",
    fishDodged:"漂亮閃過！領域魚的警戒下降。",
    fishPulsed:"脈衝抵銷震波！領域魚的警戒下降。",
    fishHit:"反制失敗：氧氣 -12。",
    fishTimeout:"反應太慢：氧氣 -12。",
    fishCleared:"領域魚退開了，額外打撈 +1、電力 +1！",
    intel:"收益 {loot}/3 · 危險 {danger}/3 · 氧耗 {cost}",
    power:"電力 {n}/4",
    sonarPowered:"精準聲納 2⚡",
    sonarNeed:"精準聲納需要 2 點電力。",
    shield:"衝擊盾 1⚡",
    shieldArmed:"衝擊盾已啟動",
    shieldNeed:"啟動衝擊盾需要 1 點電力。",
    shieldBlock:"衝擊盾吸收了一半傷害。",
    shortLoot:"收益",
    shortDanger:"危險",
    shortOxygen:"氧耗",
    shortPower:"電力",
    shortTarget:"目標",
    shortScan:"掃描",
    shortShield:"護盾",
    shortSurface:"上浮",
    shortBeacon:"信標",
    shortChoose:"選擇航線",
    shortConfirmed:"結果已確認",
    shortLow:"氧氣不足",
    shortReadAttack:"看招式反制",
    shortLeft:"左側",
    shortRight:"右側",
    shortLeftCharge:"左衝",
    shortRightCharge:"右衝",
    shortShockwave:"震波",
    shortDodgeLeft:"左閃",
    shortCounter:"反制",
    shortDodgeRight:"右閃",
    coachVisual1:"比較收益、危險與氧耗",
    coachVisual2:"所有工具共用 4 點電力",
    coachVisual3:"選擇航線，氧氣用完前上浮",
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
    objectiveScan:"選擇要游向的目標；先比較兩側訊號，不確定時再使用聲納。",
    objectiveChoose:u("\\u8072\\u7d0d\\u5b8c\\u6210\\uff1a\\u9078\\u64c7\\u4f60\\u8981\\u7684\\u7d50\\u679c\\u3002"),
    objectiveContinue:u("\\u9054\\u6210\\u6253\\u6488\\u76ee\\u6a19\\uff0c\\u6216\\u63d0\\u524d\\u4e0a\\u6d6e\\u4fdd\\u4f4f\\u90e8\\u5206\\u6210\\u679c\\u3002"),
    completionRemaining:u("\\u5df2\\u9054\\u6253\\u6488\\u76ee\\u6a19\\uff0c\\u9084\\u9700\\u7a7f\\u8d8a {remaining} \\u500b\\u6d77\\u57df\\u624d\\u80fd\\u5b8c\\u6210\\u3002"),
    coachTitle:"潛航計畫",
    coachStep1:"每個海域各有一個左側與右側目標；諾里會停在中央等你選擇。",
    coachStep2:"裝備共用電力：精準聲納消耗 2⚡、一次衝擊盾消耗 1⚡，魚戰的脈衝反制也消耗 1⚡。",
    coachStep3:"比較收益、危險與氧耗估計，還要替限時魚戰保留電力；達成目標，或提早上浮保住成果。",
    clear:u("\\u8def\\u7dda\\u5b8c\\u6210\\uff01"),
    missed:u("\\u672a\\u9054\\u6210\\u76ee\\u6a19"),
    oxygenLost:u("\\u6c27\\u6c23\\u8017\\u76e1"),
    resultClear:u("\\u5df2\\u9054\\u6210\\u76ee\\u6a19\\uff1a\\u6253\\u6488 {n}/{target}\\uff0c\\u7a7f\\u8d8a {zones} \\u500b\\u6d77\\u57df\\u3002"),
    resultSurface:u("\\u5df2\\u5e36\\u8457 {n} \\u4ef6\\u6253\\u6488\\u54c1\\u4e0a\\u6d6e\\uff0c\\u4f46\\u672c\\u8def\\u7dda\\u5c1a\\u672a\\u904e\\u95dc\\u3002"),
    resultMiss:u("\\u6f5b\\u822a\\u7d50\\u675f\\u6642\\u53ea\\u6709 {n}/{target} \\u4ef6\\u6253\\u6488\\u54c1\\uff0c\\u8acb\\u5617\\u8a66\\u4e0d\\u540c\\u7684\\u8a0a\\u865f\\u7d44\\u5408\\u3002"),
    resultFail:u("\\u6c27\\u6c23\\u6b78\\u96f6\\uff0c{n} \\u4ef6\\u6253\\u6488\\u54c1\\u53ea\\u4fdd\\u4f4f\\u4e00\\u534a\\u3002"),
    coinsEarned:u("\\u672c\\u6b21\\u6f5b\\u822a\\uff1a+{n} \\u6253\\u6488\\u5e63"),
    coinsSaved:u("\\u5df2\\u4fdd\\u5b58\\u7e3d\\u984d\\uff1a{n} \\u6253\\u6488\\u5e63"),
    routeUnlocked:u("\\u65b0\\u8def\\u7dda\\u89e3\\u9396\\uff1a\\u8def\\u7dda {n} \\u00b7 {name}"),
    routeReady:u("\\u4e0b\\u4e00\\u8def\\u7dda\\u53ef\\u9032\\u5165\\uff1a\\u8def\\u7dda {n} \\u00b7 {name}"),
    routeComplete:u("\\u5168\\u90e8 30 \\u689d\\u6f5b\\u822a\\u8def\\u7dda\\u5df2\\u901a\\u95dc\\u3002"),
    routeRetry:u("\\u4e0b\\u6b21\\u76ee\\u6a19\\uff1a\\u7a7f\\u8d8a {zones} \\u500b\\u6d77\\u57df\\u4e26\\u6253\\u6488 {target} \\u4ef6"),
    retry:u("\\u518d\\u8a66\\u4e00\\u6b21")
  });
  Object.assign(en,{routeSelect:"Dive routes"});
  Object.assign(zh,{routeSelect:"潛航路線"});
  Object.assign(en,{
    fishBattle:"Fish encounter",territorialFish:"Territorial fish",shark:"Abyss shark",fishHp:"Enemy HP",diverHp:"Nori HP",attackAction:"Attack",escapeAction:"Escape",fishStrikes:"The fish strikes back!",fishWon:"Enemy defeated!",fishEscaped:"Escaped safely. Oxygen -{n}.",xpGain:"EXP +{n}",levelUp:"Level up! Stat point +{n}",upgradeTitle:"Diver upgrade",statPoints:"Points {n}",hpStat:"Health",attackStat:"Attack",oxygenStat:"Max oxygen",statPreview:"{name} {current} → {next}",upgradePrompt:"Spend every point before continuing.",upgradeApplied:"{name} upgraded: {before} → {after}.",doneUpgrade:"Continue dive",combatDefeat:"Nori was defeated",resultCombat:"Nori lost the encounter. Half of the salvage was secured."
  });
  Object.assign(zh,{
    fishBattle:"魚類遭遇戰",territorialFish:"領域魚",shark:"深淵鯊魚",fishHp:"敵方生命",diverHp:"諾里生命",attackAction:"攻擊",escapeAction:"逃跑",fishStrikes:"魚發動反擊！",fishWon:"戰勝魚類！",fishEscaped:"成功逃跑，氧氣 -{n}。",xpGain:"經驗 +{n}",levelUp:"升級！能力點 +{n}",upgradeTitle:"潛航員升級",statPoints:"剩餘點數 {n}",hpStat:"生命",attackStat:"攻擊",oxygenStat:"氧氣上限",statPreview:"{name} {current} → {next}",upgradePrompt:"請分配所有能力點後再繼續。",upgradeApplied:"{name}已提升：{before} → {after}。",doneUpgrade:"繼續潛航",combatDefeat:"諾里戰敗",resultCombat:"諾里在遭遇戰中落敗，只保住一半打撈品。"
  });
  Object.assign(en,{
    beaconConfirmStatus:"Restore oxygen to at least 30% once this dive · {before} → {after} Diamonds. Tap again to confirm.",
    beaconConfirmLabel:"Confirm Emergency Beacon. Spend 3 Diamonds. Balance {before} to {after}.",
    beaconUnavailable:"Available when oxygen is below 30%."
  });
  Object.assign(zh,{
    beaconConfirmStatus:u("\u672c\u6b21\u6f5b\u822a\u9650\u7528\u4e00\u6b21\uff0c\u5c07\u6c27\u6c23\u56de\u5fa9\u81f3\u81f3\u5c11 30% \u00b7 \u947d\u77f3 {before} \u2192 {after}\u3002\u518d\u6b21\u9ede\u64ca\u78ba\u8a8d\u3002"),
    beaconConfirmLabel:u("\u78ba\u8a8d\u4f7f\u7528\u7dca\u6025\u4fe1\u6a19\u3002\u82b1\u8cbb 3 \u9846\u947d\u77f3\uff0c\u9918\u984d\u7531 {before} \u8b8a\u70ba {after}\u3002"),
    beaconUnavailable:u("\u6c27\u6c23\u4f4e\u65bc 30% \u6642\u624d\u53ef\u4f7f\u7528\u3002")
  });
  Object.assign(en,{
    quitTitle:"Leave this dive?",
    quitCopy:"Zone {zone}/{total}, salvage {salvage}/{target}, and oxygen {oxygen}/{max} will be discarded.",
    quitKeep:"Keep diving",
    quitLeave:"Leave dive"
  });
  Object.assign(zh,{
    quitTitle:u("\u8981\u96e2\u958b\u672c\u6b21\u6f5b\u822a\u55ce\uff1f"),
    quitCopy:u("\u6d77\u57df {zone}/{total}\u3001\u6253\u6488 {salvage}/{target}\u3001\u6c27\u6c23 {oxygen}/{max} \u7684\u672c\u8f2a\u9032\u5ea6\u5c07\u4e1f\u5931\u3002"),
    quitKeep:u("\u7e7c\u7e8c\u6f5b\u822a"),
    quitLeave:u("\u96e2\u958b\u672c\u8f2a")
  });
  const makeLocalePack=(pack)=>{
    const translated=Object.fromEntries(Object.keys(en).map(key=>[key,pack[key]??pack.generic]));
    translated.relicNames=pack.relicNames||[pack.relic,pack.relic,pack.relic];
    Object.assign(translated,{
      left:pack.left,right:pack.right,shortLeft:pack.left,shortRight:pack.right,
      sonar:pack.sonar,sonarPowered:`${pack.scan} 2⚡`,shortScan:pack.scan,
      surface:pack.surface,shortSurface:pack.surface,beacon:pack.beacon,shortBeacon:pack.beacon,
      power:`${pack.power} {n}/4`,shortPower:pack.power,shortLoot:pack.loot,shortDanger:pack.risk,
      shortOxygen:pack.oxygenShort||pack.oxygen,oxygenShort:pack.oxygenShort||pack.oxygen,shortTarget:pack.target,
      shortChoose:pack.choose,shortConfirmed:pack.results,shortLow:pack.low,
      shortReadAttack:pack.readAttack,shortCounter:pack.counter,shortShield:pack.shield,
      shortDodgeLeft:pack.left,shortDodgeRight:pack.right,shortShockwave:pack.shockwave,
      safeLane:pack.safe,riskLane:pack.danger,attackAction:pack.attack,escapeAction:pack.escape,
      dodgeLeft:pack.left,dodgeRight:pack.right,pulse:`${pack.counter} 1⚡`,fishTimer:pack.timer,
      zoneProgress:pack.zone||pack.generic,
      beaconConfirmStatus:pack.beaconConfirmStatus||`${pack.beacon} · ${pack.oxygen} 30%`,
      beaconConfirmLabel:pack.beaconConfirmLabel||pack.beacon,
      beaconUnavailable:pack.beaconUnavailable||pack.beacon,
      beaconHelp:pack.beaconHelp||pack.beacon,
      routeRule:pack.routeRule||pack.generic
    },pack);
    Object.assign(translated,{
      partial:pack.partial||pack.surface,clear:pack.clear||pack.surface,missed:pack.missed||pack.generic,
      oxygenLost:pack.oxygenLost||pack.low,coins:pack.coins||pack.generic,rank:pack.rank||pack.generic,
      next:pack.next||pack.stage,menu:pack.menu||pack.stage,back:pack.back||pack.stage,
      routeSelect:pack.routeSelect||pack.stage,routeAction:pack.routeAction||pack.start,locked:pack.locked||pack.generic,
      retry:pack.retry||pack.start,coinsEarned:pack.coinsEarned||pack.coins||pack.generic,
      coinsSaved:pack.coinsSaved||pack.coins||pack.generic,
      routeUnlocked:pack.routeUnlocked||pack.route,routeReady:pack.routeReady||pack.route,
      routeComplete:pack.routeComplete||pack.clear||pack.generic,routeRetry:pack.routeRetry||pack.generic,
      coachVisual1:pack.coachVisual1||pack.guideCopy,coachVisual2:pack.coachVisual2||pack.power,
      coachVisual3:pack.coachVisual3||pack.objectiveContinue
    });
    return translated;
  };
  const localePacks={
    ja:makeLocalePack({generic:"潜航情報",title:"アニマル・アビス・ダイバー",language:"言語",headline:"どこまで潜るか、危険を選ぼう。",intro:"遺物を回収し、危険を読み、酸素が尽きる前に浮上しよう。",guideTitle:"潜り方",guideCopy:"ルートを選び、左右の信号を比べ、電力を計画して浮上します。",start:"ゲーム開始",stage:"潜航ルートを選択",stageHint:"ルートの深さと酸素リスクを比べます。",route:"ルート {n}",relic:"遺物",oxygen:"酸素",zone:"ゾーン {n}/{total}",salvage:"回収 {n}",left:"左",right:"右",sonar:"ソナー",surface:"浮上",beacon:"ビーコン",scan:"スキャン",shield:"シールド",power:"電力",loot:"回収",risk:"危険",target:"目標",choose:"レーンを選択",results:"結果を表示",low:"酸素低下",readAttack:"攻撃を読んで反撃",counter:"反撃",shockwave:"衝撃波",safe:"安全",danger:"危険",attack:"攻撃",escape:"逃走",timer:"反応時間",fishBattle:"魚との遭遇",fishTitle:"縄張り魚がルートをふさいでいる！",fishObjective:"攻撃を読み、時間内に答えて電力を残そう。",fishGuard:"ガード {n}/3",fishDodged:"回避成功！ガードが下がりました。",fishPulsed:"パルス反撃成功！ガードが下がりました。",fishHit:"反撃失敗：酸素 -12。",fishTimeout:"遅すぎます：酸素 -12。",fishCleared:"魚が退きました。回収 +1、電力 +1！",intel:"回収 {loot}/3・危険 {danger}/3・酸素 {cost}",sonarNeed:"正確なスキャンには電力2が必要です。",shieldArmed:"シールド起動",shieldNeed:"シールドには電力1が必要です。",shieldBlock:"シールドが半分の衝撃を吸収しました。",objectiveScan:"左右の信号を比べ、進む目標を選びます。",objectiveChoose:"ソナー完了。結果を選びます。",objectiveContinue:"目標を達成するか、浮上して回収を確保します。",objectiveLow:"酸素が少ない。浮上するか緊急ビーコンを使います。",coachTitle:"潜航プラン",coachStart:"潜航開始",help:"遊び方",routeSelect:"潜航ルート",laneLeft:"左の目標",laneRight:"右の目標",sonarRead:"ソナー：左 {left}｜右 {right}",resultClear:"目標達成：{n}/{target} 回収、{zones} ゾーン。",resultSurface:"{n} 個を回収して浮上しました。",resultMiss:"{n}/{target} の回収で潜航終了。",resultFail:"酸素が尽きました。回収の半分だけ確保しました。",quitTitle:"潜航を離れますか？",quitCopy:"ゾーン {zone}/{total}、回収 {salvage}/{target}、酸素 {oxygen}/{max} は失われます。",quitKeep:"潜航を続ける",quitLeave:"潜航を離れる",relicNames:["羅針盤","月光真珠","ルーン板"]}),
    ko:makeLocalePack({generic:"잠수 정보",title:"애니멀 어비스 다이버",language:"언어",headline:"얼마나 깊이 잠수할지 위험을 선택하세요.",intro:"유물을 회수하고 위험을 읽으며 산소가 떨어지기 전에 수면으로 올라오세요.",guideTitle:"잠수 방법",guideCopy:"경로를 고르고 좌우 신호를 비교하며 전력을 계획한 뒤 부상합니다.",start:"게임 시작",stage:"잠수 경로 선택",stageHint:"경로의 깊이와 산소 위험을 비교하세요.",route:"경로 {n}",relic:"유물",oxygen:"산소",zone:"구역 {n}/{total}",salvage:"회수 {n}",left:"왼쪽",right:"오른쪽",sonar:"소나",surface:"수면",beacon:"비콘",scan:"스캔",shield:"실드",power:"전력",loot:"회수",risk:"위험",target:"목표",choose:"레인 선택",results:"결과 공개",low:"산소 부족",readAttack:"공격 읽고 반격",counter:"반격",shockwave:"충격파",safe:"안전",danger:"위험",attack:"공격",escape:"도망",timer:"반응 시간",fishBattle:"물고기 조우",fishTitle:"영역 물고기가 경로를 막았습니다!",fishObjective:"공격을 읽고 시간 안에 대응해 전력을 남기세요.",fishGuard:"가드 {n}/3",fishDodged:"완벽한 회피! 가드가 내려갔습니다.",fishPulsed:"펄스 반격 성공! 가드가 내려갔습니다.",fishHit:"반격 실패: 산소 -12.",fishTimeout:"너무 늦었습니다: 산소 -12.",fishCleared:"물고기가 물러났습니다. 회수 +1, 전력 +1!",intel:"회수 {loot}/3 · 위험 {danger}/3 · 산소 {cost}",sonarNeed:"정확한 스캔에는 전력 2가 필요합니다.",shieldArmed:"실드 작동",shieldNeed:"실드에는 전력 1이 필요합니다.",shieldBlock:"실드가 충격의 절반을 흡수했습니다.",objectiveScan:"좌우 신호를 비교해 이동할 목표를 선택하세요.",objectiveChoose:"소나 완료. 원하는 결과를 선택하세요.",objectiveContinue:"회수 목표를 달성하거나 수면으로 올라오세요.",objectiveLow:"산소가 부족합니다. 수면으로 올라가거나 비콘을 사용하세요.",coachTitle:"잠수 계획",coachStart:"잠수 시작",help:"플레이 방법",routeSelect:"잠수 경로",laneLeft:"왼쪽 목표",laneRight:"오른쪽 목표",sonarRead:"소나: 왼쪽 {left} | 오른쪽 {right}",resultClear:"목표 달성: {n}/{target} 회수, {zones} 구역.",resultSurface:"회수 {n}개를 보관하고 수면으로 올라왔습니다.",resultMiss:"회수가 {n}/{target}일 때 잠수가 끝났습니다.",resultFail:"산소가 0이 되었습니다. 회수의 절반만 확보했습니다.",quitTitle:"잠수를 나갈까요?",quitCopy:"구역 {zone}/{total}, 회수 {salvage}/{target}, 산소 {oxygen}/{max}가 사라집니다.",quitKeep:"잠수 계속",quitLeave:"잠수 나가기",relicNames:["나침반","달빛 진주","룬 석판"]}),
    es:makeLocalePack({generic:"Información de inmersión",title:"Buceador del abismo animal",language:"Idioma",headline:"Elige hasta dónde arriesgar la inmersión.",intro:"Recupera reliquias, lee los peligros y sal antes de quedarte sin oxígeno.",guideTitle:"Cómo bucear",guideCopy:"Elige una ruta, compara las señales y administra la energía.",start:"Iniciar juego",stage:"Elige una ruta de inmersión",stageHint:"Compara profundidad y riesgo de oxígeno.",route:"Ruta {n}",relic:"Reliquia",oxygen:"Oxígeno",zone:"Zona {n}/{total}",salvage:"Recuperación {n}",left:"Izquierda",right:"Derecha",sonar:"Sonar",surface:"Salir a la superficie",beacon:"Baliza",scan:"ESCANEAR",shield:"ESCUDO",power:"ENERGÍA",loot:"BOTÍN",risk:"RIESGO",target:"OBJETIVO",choose:"ELIGE UN CARRIL",results:"RESULTADOS",low:"OXÍGENO BAJO",readAttack:"LEE Y CONTRAATACA",counter:"CONTRA",shockwave:"ONDA DE CHOQUE",safe:"SEGURO",danger:"PELIGRO",attack:"Atacar",escape:"Escapar",timer:"Ventana de reacción",fishBattle:"Encuentro con pez",fishTitle:"¡Un pez territorial bloquea la ruta!",fishObjective:"Lee el ataque, responde a tiempo y conserva energía.",fishGuard:"Guardia {n}/3",fishDodged:"¡Esquiva perfecta! Su guardia baja.",fishPulsed:"¡Contraataque de pulso! Su guardia baja.",fishHit:"Contra fallida: oxígeno -12.",fishTimeout:"Demasiado lento: oxígeno -12.",fishCleared:"El pez se retira. ¡Recuperación +1 y energía +1!",intel:"Botín {loot}/3 · Peligro {danger}/3 · O2 {cost}",sonarNeed:"Se necesitan 2 de energía para un escaneo exacto.",shieldArmed:"Escudo activado",shieldNeed:"Se necesita 1 de energía para activar el escudo.",shieldBlock:"El escudo absorbió la mitad del impacto.",objectiveScan:"Compara ambas señales y elige un objetivo.",objectiveChoose:"Escaneo listo: elige el resultado.",objectiveContinue:"Alcanza el objetivo o sal para guardar la recuperación.",objectiveLow:"Hay poco oxígeno. Sal o usa la baliza.",coachTitle:"Plan de inmersión",coachStart:"Comenzar inmersión",help:"Cómo jugar",routeSelect:"Rutas de inmersión",laneLeft:"OBJETIVO IZQUIERDO",laneRight:"OBJETIVO DERECHO",sonarRead:"Sonar: IZQUIERDA {left} | DERECHA {right}",resultClear:"Objetivo alcanzado: {n}/{target} de recuperación en {zones} zonas.",resultSurface:"Subiste con {n} recuperaciones guardadas.",resultMiss:"La inmersión terminó con {n}/{target} de recuperación.",resultFail:"El oxígeno llegó a cero. Solo se aseguró la mitad.",quitTitle:"¿Salir de esta inmersión?",quitCopy:"Se perderán zona {zone}/{total}, recuperación {salvage}/{target} y oxígeno {oxygen}/{max}.",quitKeep:"Seguir buceando",quitLeave:"Salir de la inmersión",relicNames:["Brújula","Perla lunar","Tabla rúnica"]}),
    "pt-BR":makeLocalePack({generic:"Informações do mergulho",title:"Mergulhador do Abismo Animal",language:"Idioma",headline:"Escolha até onde arriscar o mergulho.",intro:"Recupere relíquias, leia os perigos e suba antes que o oxigênio acabe.",guideTitle:"Como mergulhar",guideCopy:"Escolha uma rota, compare os sinais e administre a energia.",start:"Iniciar jogo",stage:"Escolha uma rota de mergulho",stageHint:"Compare profundidade e risco de oxigênio.",route:"Rota {n}",relic:"Relíquia",oxygen:"Oxigênio",zone:"Zona {n}/{total}",salvage:"Salvamento {n}",left:"Esquerda",right:"Direita",sonar:"Sonar",surface:"Subir à superfície",beacon:"Baliza",scan:"EXAMINAR",shield:"ESCUDO",power:"ENERGIA",loot:"SAQUE",risk:"RISCO",target:"ALVO",choose:"ESCOLHA UMA FAIXA",results:"RESULTADOS",low:"O2 BAIXO",readAttack:"LEIA E REBATA",counter:"CONTRA-ATAQUE",shockwave:"ONDA DE CHOQUE",safe:"SEGURO",danger:"PERIGO",attack:"Atacar",escape:"Fugir",timer:"Janela de reação",fishBattle:"Encontro com peixe",fishTitle:"Um peixe territorial bloqueia a rota!",fishObjective:"Leia o ataque, responda a tempo e preserve energia.",fishGuard:"Guarda {n}/3",fishDodged:"Esquiva perfeita! A guarda caiu.",fishPulsed:"Pulso contra-atacou! A guarda caiu.",fishHit:"Contra-ataque falhou: oxigênio -12.",fishTimeout:"Lento demais: oxigênio -12.",fishCleared:"O peixe recuou. Salvamento +1 e energia +1!",intel:"Saque {loot}/3 · Perigo {danger}/3 · O2 {cost}",sonarNeed:"São necessárias 2 energias para uma leitura exata.",shieldArmed:"Escudo ativado",shieldNeed:"É necessária 1 energia para ativar o escudo.",shieldBlock:"O escudo absorveu metade do impacto.",objectiveScan:"Compare os dois sinais e escolha um alvo.",objectiveChoose:"Leitura pronta: escolha o resultado.",objectiveContinue:"Alcance o alvo ou suba para guardar o salvamento.",objectiveLow:"Oxigênio baixo. Suba ou use a baliza.",coachTitle:"Plano de mergulho",coachStart:"Começar mergulho",help:"Como jogar",routeSelect:"Rotas de mergulho",laneLeft:"ALVO ESQUERDO",laneRight:"ALVO DIREITO",sonarRead:"Sonar: ESQUERDA {left} | DIREITA {right}",resultClear:"Alvo alcançado: {n}/{target} de salvamento em {zones} zonas.",resultSurface:"Você subiu com {n} salvamentos guardados.",resultMiss:"O mergulho terminou com {n}/{target} de salvamento.",resultFail:"O oxigênio chegou a zero. Só metade foi protegida.",quitTitle:"Sair deste mergulho?",quitCopy:"Zona {zone}/{total}, salvamento {salvage}/{target} e oxigênio {oxygen}/{max} serão perdidos.",quitKeep:"Continuar mergulho",quitLeave:"Sair do mergulho",relicNames:["Bússola","Pérola lunar","Tábua rúnica"]}),
    fr:makeLocalePack({generic:"Informations de plongée",title:"Plongeur des abysses animales",language:"Langue",headline:"Choisissez jusqu'où risquer la plongée.",intro:"Récupérez des reliques, lisez les dangers et remontez avant de manquer d'oxygène.",guideTitle:"Comment plonger",guideCopy:"Choisissez une route, comparez les signaux et gérez l'énergie.",start:"Démarrer le jeu",stage:"Choisir une route de plongée",stageHint:"Comparez profondeur et risque d'oxygène.",route:"Route {n}",relic:"Relique",oxygen:"Oxygène",zone:"Zone {n}/{total}",salvage:"Récupération {n}",left:"Gauche",right:"Droite",sonar:"Sonar",surface:"Remonter",beacon:"Balise",scan:"SCAN",shield:"BOUCLIER",power:"ÉNERGIE",loot:"BUTIN",risk:"RISQUE",target:"CIBLE",choose:"CHOISIR UNE VOIE",results:"RÉSULTATS",low:"O2 FAIBLE",readAttack:"LIRE ET RIPOSTER",counter:"CONTRE",shockwave:"ONDE DE CHOC",safe:"SÛR",danger:"DANGER",attack:"Attaquer",escape:"Fuir",timer:"Fenêtre de réaction",fishBattle:"Rencontre avec un poisson",fishTitle:"Un poisson territorial bloque la route !",fishObjective:"Lisez l'attaque, répondez à temps et gardez de l'énergie.",fishGuard:"Garde {n}/3",fishDodged:"Esquive parfaite ! Sa garde baisse.",fishPulsed:"Contre-pulse réussi ! Sa garde baisse.",fishHit:"Contre raté : oxygène -12.",fishTimeout:"Trop lent : oxygène -12.",fishCleared:"Le poisson recule. Récupération +1 et énergie +1 !",intel:"Butin {loot}/3 · Danger {danger}/3 · O2 {cost}",sonarNeed:"Il faut 2 énergies pour un scan précis.",shieldArmed:"Bouclier activé",shieldNeed:"Il faut 1 énergie pour activer le bouclier.",shieldBlock:"Le bouclier a absorbé la moitié de l'impact.",objectiveScan:"Comparez les deux signaux et choisissez une cible.",objectiveChoose:"Scan terminé : choisissez le résultat.",objectiveContinue:"Atteignez la cible ou remontez pour conserver la récupération.",objectiveLow:"Oxygène faible. Remontez ou utilisez la balise.",coachTitle:"Plan de plongée",coachStart:"Commencer la plongée",help:"Comment jouer",routeSelect:"Routes de plongée",laneLeft:"CIBLE GAUCHE",laneRight:"CIBLE DROITE",sonarRead:"Sonar : GAUCHE {left} | DROITE {right}",resultClear:"Cible atteinte : récupération {n}/{target} en {zones} zones.",resultSurface:"Vous êtes remonté avec {n} récupérations conservées.",resultMiss:"La plongée s'est terminée avec {n}/{target} de récupération.",resultFail:"L'oxygène est tombé à zéro. La moitié seulement a été sauvée.",quitTitle:"Quitter cette plongée ?",quitCopy:"Zone {zone}/{total}, récupération {salvage}/{target} et oxygène {oxygen}/{max} seront perdus.",quitKeep:"Continuer la plongée",quitLeave:"Quitter la plongée",relicNames:["Boussole","Perle lunaire","Tablette runique"]}),
    de:makeLocalePack({generic:"Tauchinformation",title:"Tierischer Abgrundtaucher",language:"Sprache",headline:"Wähle, wie tief du das Risiko eingehst.",intro:"Berge Relikte, lies Gefahren und tauche auf, bevor der Sauerstoff endet.",guideTitle:"So tauchst du",guideCopy:"Wähle eine Route, vergleiche Signale und plane die Energie.",start:"Spiel starten",stage:"Tauchroute wählen",stageHint:"Vergleiche Tiefe und Sauerstoffrisiko.",route:"Route {n}",relic:"Relikt",oxygen:"Sauerstoff",zone:"Zone {n}/{total}",salvage:"Bergung {n}",left:"Links",right:"Rechts",sonar:"Sonar",surface:"Auftauchen",beacon:"Signalboje",scan:"SCAN",shield:"SCHILD",power:"ENERGIE",loot:"BEUTE",risk:"RISIKO",target:"ZIEL",choose:"SPUR WÄHLEN",results:"ERGEBNISSE",low:"NIEDRIGER O2",readAttack:"LESEN & KONTERN",counter:"KONTER",shockwave:"SCHOCKWELLE",safe:"SICHER",danger:"GEFAHR",attack:"Angreifen",escape:"Fliehen",timer:"Reaktionsfenster",fishBattle:"Fischbegegnung",fishTitle:"Ein Revierfisch blockiert die Route!",fishObjective:"Lies den Angriff, antworte rechtzeitig und spare Energie.",fishGuard:"Wache {n}/3",fishDodged:"Perfektes Ausweichen! Die Wache sinkt.",fishPulsed:"Impuls gekontert! Die Wache sinkt.",fishHit:"Konter fehlgeschlagen: Sauerstoff -12.",fishTimeout:"Zu langsam: Sauerstoff -12.",fishCleared:"Der Fisch weicht zurück. Bergung +1 und Energie +1!",intel:"Beute {loot}/3 · Gefahr {danger}/3 · O2 {cost}",sonarNeed:"Für einen genauen Scan werden 2 Energie benötigt.",shieldArmed:"Schild aktiviert",shieldNeed:"Zum Aktivieren werden 1 Energie benötigt.",shieldBlock:"Das Schild absorbierte die Hälfte des Aufpralls.",objectiveScan:"Vergleiche beide Signale und wähle ein Ziel.",objectiveChoose:"Scan fertig: Wähle das Ergebnis.",objectiveContinue:"Erreiche das Ziel oder tauche auf, um die Bergung zu sichern.",objectiveLow:"Sauerstoff niedrig. Tauche auf oder nutze die Boje.",coachTitle:"Tauchplan",coachStart:"Tauchgang beginnen",help:"So wird gespielt",routeSelect:"Tauchroute",laneLeft:"LINKES ZIEL",laneRight:"RECHTES ZIEL",sonarRead:"Sonar: LINKS {left} | RECHTS {right}",resultClear:"Ziel erreicht: {n}/{target} Bergung in {zones} Zonen.",resultSurface:"Aufgetaucht mit {n} gesicherten Bergungen.",resultMiss:"Tauchgang mit {n}/{target} Bergung beendet.",resultFail:"Sauerstoff auf null. Nur die Hälfte wurde gesichert.",quitTitle:"Tauchgang verlassen?",quitCopy:"Zone {zone}/{total}, Bergung {salvage}/{target} und Sauerstoff {oxygen}/{max} gehen verloren.",quitKeep:"Weiter tauchen",quitLeave:"Tauchgang verlassen",relicNames:["Kompass","Mondperle","Runentafel"]}),
    it:makeLocalePack({generic:"Informazioni immersione",title:"Esploratore dell'abisso animale",language:"Lingua",headline:"Scegli quanto rischiare nell'immersione.",intro:"Recupera reliquie, leggi i pericoli e riemergi prima che finisca l'ossigeno.",guideTitle:"Come immergersi",guideCopy:"Scegli un percorso, confronta i segnali e pianifica l'energia.",start:"Inizia gioco",stage:"Scegli un percorso",stageHint:"Confronta profondità e rischio ossigeno.",route:"Percorso {n}",relic:"Reliquia",oxygen:"Ossigeno",zone:"Zona {n}/{total}",salvage:"Recupero {n}",left:"Sinistra",right:"Destra",sonar:"Sonar",surface:"Riemergi",beacon:"Faro",scan:"SCANSIONE",shield:"SCUDO",power:"ENERGIA",loot:"BOTTINO",risk:"RISCHIO",target:"OBIETTIVO",choose:"SCEGLI UNA CORSIA",results:"RISULTATI",low:"O2 BASSO",readAttack:"LEGGI E CONTRASTA",counter:"CONTRO",shockwave:"ONDA D'URTO",safe:"SICURO",danger:"PERICOLO",attack:"Attacca",escape:"Fuggi",timer:"Finestra di reazione",fishBattle:"Incontro con pesce",fishTitle:"Un pesce territoriale blocca il percorso!",fishObjective:"Leggi l'attacco, rispondi in tempo e conserva energia.",fishGuard:"Guardia {n}/3",fishDodged:"Schivata perfetta! La guardia cala.",fishPulsed:"Contropulso riuscito! La guardia cala.",fishHit:"Contro fallito: ossigeno -12.",fishTimeout:"Troppo lento: ossigeno -12.",fishCleared:"Il pesce si ritira. Recupero +1 ed energia +1!",intel:"Bottino {loot}/3 · Pericolo {danger}/3 · O2 {cost}",sonarNeed:"Servono 2 energie per una scansione esatta.",shieldArmed:"Scudo attivato",shieldNeed:"Serve 1 energia per attivare lo scudo.",shieldBlock:"Lo scudo ha assorbito metà dell'impatto.",objectiveScan:"Confronta i due segnali e scegli un obiettivo.",objectiveChoose:"Scansione pronta: scegli il risultato.",objectiveContinue:"Raggiungi l'obiettivo o riemergi per conservare il recupero.",objectiveLow:"Ossigeno basso. Riemergi o usa il faro.",coachTitle:"Piano d'immersione",coachStart:"Inizia immersione",help:"Come giocare",routeSelect:"Percorsi d'immersione",laneLeft:"OBIETTIVO SINISTRO",laneRight:"OBIETTIVO DESTRO",sonarRead:"Sonar: SINISTRA {left} | DESTRA {right}",resultClear:"Obiettivo raggiunto: recupero {n}/{target} in {zones} zone.",resultSurface:"Riemerso con {n} recuperi salvati.",resultMiss:"Immersione terminata con recupero {n}/{target}.",resultFail:"Ossigeno a zero. Salvata solo metà del recupero.",quitTitle:"Lasciare questa immersione?",quitCopy:"Zona {zone}/{total}, recupero {salvage}/{target} e ossigeno {oxygen}/{max} andranno persi.",quitKeep:"Continua immersione",quitLeave:"Lascia immersione",relicNames:["Bussola","Perla lunare","Tavoletta runica"]}),
    ru:makeLocalePack({generic:"Данные погружения",title:"Ныряльщик в звериной бездне",language:"Язык",headline:"Выберите глубину и риск погружения.",intro:"Собирайте реликвии, читайте опасности и всплывайте до окончания кислорода.",guideTitle:"Как нырять",guideCopy:"Выберите маршрут, сравните сигналы и планируйте энергию.",start:"Начать игру",stage:"Выберите маршрут",stageHint:"Сравните глубину и риск кислорода.",route:"Маршрут {n}",relic:"Реликвия",oxygen:"Кислород",zone:"Зона {n}/{total}",salvage:"Добыча {n}",left:"Слева",right:"Справа",sonar:"Сонар",surface:"Всплыть",beacon:"Маяк",scan:"СКАН",shield:"ЩИТ",power:"ЭНЕРГИЯ",loot:"ДОБЫЧА",risk:"РИСК",target:"ЦЕЛЬ",choose:"ВЫБЕРИТЕ ПОЛОСУ",results:"РЕЗУЛЬТАТЫ",low:"МАЛО O2",readAttack:"ЧИТАЙТЕ И ОТВЕЧАЙТЕ",counter:"КОНТР",shockwave:"УДАРНАЯ ВОЛНА",safe:"БЕЗОПАСНО",danger:"ОПАСНО",attack:"Атаковать",escape:"Сбежать",timer:"Окно реакции",fishBattle:"Встреча с рыбой",fishTitle:"Территориальная рыба преграждает путь!",fishObjective:"Читайте атаку, отвечайте вовремя и сохраняйте энергию.",fishGuard:"Защита {n}/3",fishDodged:"Идеальное уклонение! Защита снижена.",fishPulsed:"Импульс отразил удар! Защита снижена.",fishHit:"Контратака не удалась: кислород -12.",fishTimeout:"Слишком медленно: кислород -12.",fishCleared:"Рыба отступила. Добыча +1, энергия +1!",intel:"Добыча {loot}/3 · Опасность {danger}/3 · O2 {cost}",sonarNeed:"Для точного скана нужны 2 единицы энергии.",shieldArmed:"Щит включён",shieldNeed:"Для щита нужна 1 единица энергии.",shieldBlock:"Щит поглотил половину удара.",objectiveScan:"Сравните сигналы и выберите цель.",objectiveChoose:"Скан готов: выберите результат.",objectiveContinue:"Достигните цели или всплывите, чтобы сохранить добычу.",objectiveLow:"Мало кислорода. Всплывите или используйте маяк.",coachTitle:"План погружения",coachStart:"Начать погружение",help:"Как играть",routeSelect:"Маршруты погружения",laneLeft:"ЛЕВАЯ ЦЕЛЬ",laneRight:"ПРАВАЯ ЦЕЛЬ",sonarRead:"Сонар: СЛЕВА {left} | СПРАВА {right}",resultClear:"Цель достигнута: добыча {n}/{target} в {zones} зонах.",resultSurface:"Вы всплыли, сохранив добычу: {n}.",resultMiss:"Погружение завершено с добычей {n}/{target}.",resultFail:"Кислород закончился. Сохранена только половина добычи.",quitTitle:"Выйти из погружения?",quitCopy:"Зона {zone}/{total}, добыча {salvage}/{target} и кислород {oxygen}/{max} будут потеряны.",quitKeep:"Продолжить погружение",quitLeave:"Выйти",relicNames:["Компас","Лунная жемчужина","Рунная плита"]}),
    hi:makeLocalePack({generic:"डाइव जानकारी",title:"एनिमल एबिस डाइवर",language:"भाषा",headline:"तय करें कि कितनी गहराई तक जोखिम लेना है।",intro:"अवशेष खोजें, खतरे पढ़ें और ऑक्सीजन खत्म होने से पहले सतह पर आएँ।",guideTitle:"डाइव कैसे करें",guideCopy:"रूट चुनें, संकेतों की तुलना करें और ऊर्जा बचाएँ।",start:"गेम शुरू करें",stage:"डाइव रूट चुनें",stageHint:"गहराई और ऑक्सीजन जोखिम की तुलना करें।",route:"रूट {n}",relic:"अवशेष",oxygen:"ऑक्सीजन",zone:"क्षेत्र {n}/{total}",salvage:"बचाव {n}",left:"बायाँ",right:"दायाँ",sonar:"सोनार",surface:"सतह पर आएँ",beacon:"बीकन",scan:"स्कैन",shield:"शील्ड",power:"ऊर्जा",loot:"लूट",risk:"जोखिम",target:"लक्ष्य",choose:"लेन चुनें",results:"नतीजे",low:"कम ऑक्सीजन",readAttack:"हमला पढ़ें और जवाब दें",counter:"जवाबी हमला",shockwave:"शॉकवेव",safe:"सुरक्षित",danger:"खतरा",attack:"हमला",escape:"भागें",timer:"प्रतिक्रिया समय",fishBattle:"मछली मुठभेड़",fishTitle:"क्षेत्रीय मछली ने रास्ता रोक दिया!",fishObjective:"हमला पढ़ें, समय पर जवाब दें और ऊर्जा बचाएँ।",fishGuard:"गार्ड {n}/3",fishDodged:"सटीक बचाव! गार्ड घटा।",fishPulsed:"पल्स जवाब सफल! गार्ड घटा।",fishHit:"जवाब विफल: ऑक्सीजन -12।",fishTimeout:"बहुत देर: ऑक्सीजन -12।",fishCleared:"मछली पीछे हट गई। बचाव +1 और ऊर्जा +1!",intel:"लूट {loot}/3 · खतरा {danger}/3 · O2 {cost}",sonarNeed:"सटीक स्कैन के लिए 2 ऊर्जा चाहिए।",shieldArmed:"शील्ड सक्रिय",shieldNeed:"शील्ड के लिए 1 ऊर्जा चाहिए।",shieldBlock:"शील्ड ने आधा प्रभाव सोख लिया।",objectiveScan:"दोनों संकेतों की तुलना कर लक्ष्य चुनें।",objectiveChoose:"स्कैन पूरा: परिणाम चुनें।",objectiveContinue:"लक्ष्य पाएँ या बचाव सुरक्षित करने के लिए सतह पर आएँ।",objectiveLow:"ऑक्सीजन कम है। सतह पर आएँ या बीकन उपयोग करें।",coachTitle:"डाइव योजना",coachStart:"डाइव शुरू करें",help:"कैसे खेलें",routeSelect:"डाइव रूट",laneLeft:"बायाँ लक्ष्य",laneRight:"दायाँ लक्ष्य",sonarRead:"सोनार: बायाँ {left} | दायाँ {right}",resultClear:"लक्ष्य मिला: {n}/{target} बचाव, {zones} क्षेत्रों में।",resultSurface:"{n} बचाव सुरक्षित करके सतह पर आए।",resultMiss:"डाइव {n}/{target} बचाव पर समाप्त हुई।",resultFail:"ऑक्सीजन शून्य हुई। आधा बचाव ही सुरक्षित हुआ।",quitTitle:"डाइव छोड़ें?",quitCopy:"क्षेत्र {zone}/{total}, बचाव {salvage}/{target} और ऑक्सीजन {oxygen}/{max} खो जाएगी।",quitKeep:"डाइव जारी रखें",quitLeave:"डाइव छोड़ें",relicNames:["कम्पास","चाँद मोती","रून पट्टिका"]}),
    ar:makeLocalePack({generic:"معلومات الغوص",title:"غواص الهاوية الحيوانية",language:"اللغة",headline:"اختر مدى عمق المخاطرة في الغوص.",intro:"اجمع الآثار واقرأ المخاطر واصعد قبل نفاد الأكسجين.",guideTitle:"طريقة الغوص",guideCopy:"اختر مسارًا، قارن الإشارتين ووفّر الطاقة.",start:"بدء اللعبة",stage:"اختر مسار الغوص",stageHint:"قارن العمق ومخاطر الأكسجين.",route:"المسار {n}",routeZones:"{n} مناطق",routeTarget:"هدف الإنقاذ {n}",routeRisk:"الخطر {n}/3",relic:"أثر",oxygen:"الأكسجين",zone:"المنطقة {n}/{total}",salvage:"الإنقاذ {n}",left:"يسار",right:"يمين",sonar:"سونار",surface:"الصعود",beacon:"منارة",scan:"مسح",shield:"درع",power:"طاقة",loot:"غنائم",risk:"خطر",target:"هدف",choose:"اختر مسارًا",results:"النتائج",low:"أكسجين منخفض",readAttack:"اقرأ وردّ",counter:"هجوم مضاد",shockwave:"موجة صدمة",safe:"آمن",danger:"خطر",attack:"هجوم",escape:"هروب",timer:"نافذة الاستجابة",fishBattle:"مواجهة سمكة",fishTitle:"سمكة إقليمية تسد الطريق!",fishObjective:"اقرأ الهجوم ورد في الوقت واحفظ الطاقة.",fishGuard:"حماية {n}/3",fishDodged:"تفادٍ مثالي! انخفضت الحماية.",fishPulsed:"نجح النبض المضاد! انخفضت الحماية.",fishHit:"فشل الرد: الأكسجين -12.",fishTimeout:"بطيء جدًا: الأكسجين -12.",fishCleared:"تراجعت السمكة. إنقاذ +1 وطاقة +1!",intel:"غنائم {loot}/3 · خطر {danger}/3 · O2 {cost}",sonarNeed:"تحتاج إلى طاقتين للمسح الدقيق.",shieldArmed:"تم تفعيل الدرع",shieldNeed:"تحتاج إلى طاقة واحدة لتفعيل الدرع.",shieldBlock:"امتص الدرع نصف الصدمة.",objectiveScan:"قارن الإشارتين واختر هدفًا.",objectiveChoose:"اكتمل المسح: اختر النتيجة.",objectiveContinue:"بلغ الهدف أو اصعد لحفظ الإنقاذ.",objectiveLow:"الأكسجين منخفض. اصعد أو استخدم المنارة.",coachTitle:"خطة الغوص",coachStart:"بدء الغوص",help:"طريقة اللعب",routeSelect:"مسارات الغوص",laneLeft:"الهدف الأيسر",laneRight:"الهدف الأيمن",sonarRead:"سونار: اليسار {left} | اليمين {right}",resultClear:"تم بلوغ الهدف: إنقاذ {n}/{target} في {zones} مناطق.",resultSurface:"صعدت مع حفظ {n} من الإنقاذ.",resultMiss:"انتهى الغوص عند إنقاذ {n}/{target}.",resultFail:"نفد الأكسجين. تم حفظ نصف الإنقاذ فقط.",quitTitle:"مغادرة هذا الغوص؟",quitCopy:"ستُفقد المنطقة {zone}/{total} والإنقاذ {salvage}/{target} والأكسجين {oxygen}/{max}.",quitKeep:"متابعة الغوص",quitLeave:"مغادرة الغوص",relicNames:["بوصلة","لؤلؤة القمر","لوح روني"]})
  };
  const fishCombatLocaleLabels={
    ja:{territorialFish:"縄張り魚",shark:"深海ザメ",fishHp:"敵のHP",diverHp:"ノリのHP",fishStrikes:"魚が反撃！",fishEscaped:"安全に逃げました。酸素 -{n}。",combatDefeat:"ノリは敗北しました",resultCombat:"遭遇戦に敗北し、回収品の半分だけ確保しました。"},
    ko:{territorialFish:"영역 물고기",shark:"심해 상어",fishHp:"적 HP",diverHp:"노리 HP",fishStrikes:"물고기가 반격합니다!",fishEscaped:"안전하게 도망쳤습니다. 산소 -{n}.",combatDefeat:"노리가 패배했습니다",resultCombat:"조우에서 패배해 인양품의 절반만 확보했습니다."},
    es:{territorialFish:"Pez territorial",shark:"Tiburón abisal",fishHp:"PS enemigo",diverHp:"PS de Nori",fishStrikes:"¡El pez contraataca!",fishEscaped:"Escapaste a salvo. Oxígeno -{n}.",combatDefeat:"Nori fue derrotada",resultCombat:"Nori perdió el encuentro. Solo se aseguró la mitad del rescate."},
    "pt-BR":{territorialFish:"Peixe territorial",shark:"Tubarão abissal",fishHp:"PV do inimigo",diverHp:"PV de Nori",fishStrikes:"O peixe contra-ataca!",fishEscaped:"Fuga segura. Oxigênio -{n}.",combatDefeat:"Nori foi derrotado",resultCombat:"Nori perdeu o encontro. Metade do salvamento foi garantida."},
    fr:{territorialFish:"Poisson territorial",shark:"Requin des abysses",fishHp:"PV ennemi",diverHp:"PV de Nori",fishStrikes:"Le poisson riposte !",fishEscaped:"Fuite réussie. Oxygène -{n}.",combatDefeat:"Nori a été vaincu",resultCombat:"Nori a perdu le combat. La moitié de la récupération est conservée."},
    de:{territorialFish:"Revierfisch",shark:"Abgrundhai",fishHp:"Gegner-HP",diverHp:"Nori-HP",fishStrikes:"Der Fisch schlägt zurück!",fishEscaped:"Sicher entkommen. Sauerstoff -{n}.",combatDefeat:"Nori wurde besiegt",resultCombat:"Nori verlor die Begegnung. Die Hälfte der Bergung wurde gesichert."},
    it:{territorialFish:"Pesce territoriale",shark:"Squalo degli abissi",fishHp:"PS nemico",diverHp:"PS di Nori",fishStrikes:"Il pesce contrattacca!",fishEscaped:"Fuga riuscita. Ossigeno -{n}.",combatDefeat:"Nori è stato sconfitto",resultCombat:"Nori ha perso lo scontro. È stata salvata metà del recupero."},
    ru:{territorialFish:"Территориальная рыба",shark:"Глубинная акула",fishHp:"Здоровье врага",diverHp:"Здоровье Нори",fishStrikes:"Рыба наносит ответный удар!",fishEscaped:"Безопасный побег. Кислород -{n}.",combatDefeat:"Нори проиграл",resultCombat:"Нори проиграл встречу. Сохранена половина добычи."},
    hi:{territorialFish:"क्षेत्रीय मछली",shark:"गहरे पानी की शार्क",fishHp:"दुश्मन का स्वास्थ्य",diverHp:"नोरी का स्वास्थ्य",fishStrikes:"मछली पलटवार करती है!",fishEscaped:"सुरक्षित रूप से बच निकले। ऑक्सीजन -{n}।",combatDefeat:"नोरी हार गया",resultCombat:"नोरी मुठभेड़ हार गया। बचाव का आधा हिस्सा सुरक्षित रहा।"},
    ar:{territorialFish:"سمكة إقليمية",shark:"قرش أعماق",fishHp:"صحة العدو",diverHp:"صحة نوري",fishStrikes:"السمكة ترد!",fishEscaped:"تم الهروب بأمان. الأكسجين -{n}.",combatDefeat:"هُزم نوري",resultCombat:"خسر نوري المواجهة، وتم تأمين نصف الغنائم."}
  };
  for(const [localeKey,labels] of Object.entries(fishCombatLocaleLabels))Object.assign(localePacks[localeKey],labels);
  const upgradeLocaleLabels={
    ja:{fishWon:"敵を倒しました！",xpGain:"経験値 +{n}",levelUp:"レベルアップ！ステータスポイント +{n}",upgradeTitle:"ダイバー強化",statPoints:"残りポイント {n}",hpStat:"体力",attackStat:"攻撃力",oxygenStat:"酸素上限",statPreview:"{name} {current} → {next}",upgradePrompt:"続行する前にすべてのポイントを使ってください。",upgradeApplied:"{name}を強化：{before} → {after}。",doneUpgrade:"潜航を続ける"},
    ko:{fishWon:"적을 물리쳤습니다!",xpGain:"경험치 +{n}",levelUp:"레벨 업! 능력치 포인트 +{n}",upgradeTitle:"다이버 업그레이드",statPoints:"남은 포인트 {n}",hpStat:"체력",attackStat:"공격력",oxygenStat:"최대 산소",statPreview:"{name} {current} → {next}",upgradePrompt:"계속하기 전에 모든 포인트를 사용하세요.",upgradeApplied:"{name} 강화: {before} → {after}.",doneUpgrade:"잠수 계속"},
    es:{fishWon:"¡Enemigo derrotado!",xpGain:"EXP +{n}",levelUp:"¡Subida de nivel! Punto de estadística +{n}",upgradeTitle:"Mejora del buceador",statPoints:"Puntos disponibles {n}",hpStat:"Salud",attackStat:"Ataque",oxygenStat:"Oxígeno máximo",statPreview:"{name} {current} → {next}",upgradePrompt:"Gasta todos los puntos antes de continuar.",upgradeApplied:"{name} mejorado: {before} → {after}.",doneUpgrade:"Continuar inmersión"},
    "pt-BR":{fishWon:"Inimigo derrotado!",xpGain:"EXP +{n}",levelUp:"Subiu de nível! Ponto de atributo +{n}",upgradeTitle:"Melhoria do mergulhador",statPoints:"Pontos disponíveis {n}",hpStat:"Vida",attackStat:"Ataque",oxygenStat:"Oxigênio máximo",statPreview:"{name} {current} → {next}",upgradePrompt:"Gaste todos os pontos antes de continuar.",upgradeApplied:"{name} melhorado: {before} → {after}.",doneUpgrade:"Continuar mergulho"},
    fr:{fishWon:"Ennemi vaincu !",xpGain:"EXP +{n}",levelUp:"Niveau supérieur ! Point de caractéristique +{n}",upgradeTitle:"Amélioration du plongeur",statPoints:"Points disponibles {n}",hpStat:"Santé",attackStat:"Attaque",oxygenStat:"Oxygène max",statPreview:"{name} {current} → {next}",upgradePrompt:"Dépensez tous les points avant de continuer.",upgradeApplied:"{name} amélioré : {before} → {after}.",doneUpgrade:"Continuer la plongée"},
    de:{fishWon:"Gegner besiegt!",xpGain:"EP +{n}",levelUp:"Stufenaufstieg! Attributpunkt +{n}",upgradeTitle:"Taucher-Upgrade",statPoints:"Verfügbare Punkte {n}",hpStat:"Gesundheit",attackStat:"Angriff",oxygenStat:"Maximaler Sauerstoff",statPreview:"{name} {current} → {next}",upgradePrompt:"Gib alle Punkte aus, bevor du fortfährst.",upgradeApplied:"{name} verbessert: {before} → {after}.",doneUpgrade:"Tauchgang fortsetzen"},
    it:{fishWon:"Nemico sconfitto!",xpGain:"ESP +{n}",levelUp:"Livello aumentato! Punto statistica +{n}",upgradeTitle:"Potenziamento del sub",statPoints:"Punti disponibili {n}",hpStat:"Salute",attackStat:"Attacco",oxygenStat:"Ossigeno massimo",statPreview:"{name} {current} → {next}",upgradePrompt:"Spendi tutti i punti prima di continuare.",upgradeApplied:"{name} potenziato: {before} → {after}.",doneUpgrade:"Continua immersione"},
    ru:{fishWon:"Враг побеждён!",xpGain:"Опыт +{n}",levelUp:"Новый уровень! Очко характеристики +{n}",upgradeTitle:"Улучшение ныряльщика",statPoints:"Доступные очки: {n}",hpStat:"Здоровье",attackStat:"Атака",oxygenStat:"Макс. кислород",statPreview:"{name}: {current} → {next}",upgradePrompt:"Потратьте все очки перед продолжением.",upgradeApplied:"{name} улучшено: {before} → {after}.",doneUpgrade:"Продолжить погружение"},
    hi:{fishWon:"दुश्मन पराजित!",xpGain:"XP +{n}",levelUp:"लेवल बढ़ा! स्टैट पॉइंट +{n}",upgradeTitle:"डाइवर अपग्रेड",statPoints:"उपलब्ध पॉइंट {n}",hpStat:"स्वास्थ्य",attackStat:"हमला",oxygenStat:"अधिकतम ऑक्सीजन",statPreview:"{name} {current} → {next}",upgradePrompt:"जारी रखने से पहले सभी पॉइंट खर्च करें।",upgradeApplied:"{name} अपग्रेड: {before} → {after}।",doneUpgrade:"डाइव जारी रखें"},
    ar:{fishWon:"تمت هزيمة العدو!",xpGain:"خبرة +{n}",levelUp:"ترقية! نقطة إحصائية +{n}",upgradeTitle:"ترقية الغواص",statPoints:"النقاط المتاحة {n}",hpStat:"الصحة",attackStat:"الهجوم",oxygenStat:"الحد الأقصى للأكسجين",statPreview:"{name}: {current} → {next}",upgradePrompt:"أنفق كل النقاط قبل المتابعة.",upgradeApplied:"تمت ترقية {name}: {before} → {after}.",doneUpgrade:"متابعة الغوص"}
  };
  for(const [localeKey,labels] of Object.entries(upgradeLocaleLabels))Object.assign(localePacks[localeKey],labels);
  const ROUTE_COUNT=30;
  const supportedLocales=new Set(["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"]);
  const gameOwnedLocales=new Set(supportedLocales);
  const levelLabels={
    en:"Level","zh-Hant":"等級","zh-Hans":"等级",ja:"レベル",ko:"레벨",
    es:"Nivel","pt-BR":"Nível",fr:"Niveau",de:"Stufe",it:"Livello",
    ru:"Уровень",hi:"लेवल",ar:"المستوى"
  };
  const routeSegment=location.pathname.split("/").filter(Boolean)[0];
  const routeLocale=({en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"})[routeSegment];
  const readStorage=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
  const writeStorage=(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;}};
  let locale = routeLocale || readStorage("weightPlayLocale") || "en";
  if(!supportedLocales.has(locale))locale="en";
  const defaultSave=()=>({rank:1,coins:0,unlocked:1,level:1,xp:0,statPoints:0,stats:{hp:0,attack:0,oxygen:0},tutorialDone:false});
  const whole=(value,fallback,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isFinite(value)?Math.max(min,Math.min(max,Math.trunc(value))):fallback;
  function normalizeSave(raw){
    const clean=defaultSave();
    if(!raw||typeof raw!=="object"||Array.isArray(raw))return clean;
    clean.rank=whole(raw.rank,1,1);
    clean.coins=whole(raw.coins,0);
    clean.unlocked=whole(raw.unlocked,1,1,ROUTE_COUNT);
    clean.level=whole(raw.level,1,1);
    clean.xp=whole(raw.xp,0,0,1000000);
    clean.statPoints=whole(raw.statPoints,0);
    if(raw.stats&&typeof raw.stats==="object"&&!Array.isArray(raw.stats))for(const stat of ["hp","attack","oxygen"])clean.stats[stat]=whole(raw.stats[stat],0);
    clean.tutorialDone=raw.tutorialDone===true;
    return clean;
  }
  function loadSave(){let raw=null;try{raw=JSON.parse(readStorage(saveKey)||"null");}catch{}const clean=normalizeSave(raw);writeStorage(saveKey,JSON.stringify(clean));return clean;}
  let save=loadSave();
  let state = {},lastUpgrade=null,beaconConfirmTimer=0,beaconConfirmDueAt=0,beaconConfirmRemaining=0;
  let diveSession=0;
  let diveSuspended=false;
  let windowFocused=document.hasFocus();
  const diveTimers=new Set();
  function clearBeaconConfirmation(){
    window.clearTimeout(beaconConfirmTimer);
    beaconConfirmTimer=0;
    beaconConfirmDueAt=0;
    beaconConfirmRemaining=0;
    if(state)state.beaconPending=false;
  }
  function expireBeaconConfirmation(){
    beaconConfirmTimer=0;
    beaconConfirmDueAt=0;
    beaconConfirmRemaining=0;
    if(!state?.beaconPending)return;
    state.beaconPending=false;
    renderBattle();
  }
  function armBeaconConfirmation(delay=5000){
    window.clearTimeout(beaconConfirmTimer);
    beaconConfirmRemaining=Math.max(0,Number(delay)||0);
    if(!beaconConfirmRemaining){expireBeaconConfirmation();return;}
    beaconConfirmDueAt=performance.now()+beaconConfirmRemaining;
    beaconConfirmTimer=window.setTimeout(expireBeaconConfirmation,beaconConfirmRemaining);
  }
  function suspendBeaconConfirmation(){
    if(!state?.beaconPending||!beaconConfirmTimer)return;
    beaconConfirmRemaining=Math.max(0,beaconConfirmDueAt-performance.now());
    window.clearTimeout(beaconConfirmTimer);
    beaconConfirmTimer=0;
    beaconConfirmDueAt=0;
  }
  function resumeBeaconConfirmation(){
    if(!state?.beaconPending||beaconConfirmTimer||document.hidden||!windowFocused)return;
    armBeaconConfirmation(beaconConfirmRemaining);
  }
  function beaconRestoreTarget(){return Math.ceil(maxOxygen()*.3);}
  function beaconCanRestore(){return !!state.route&&!state.beaconUsed&&state.oxygen<beaconRestoreTarget();}
  function cancelDiveAsync(){
    clearBeaconConfirmation();
    diveSession+=1;
    diveSuspended=false;
    diveTimers.forEach(task=>window.clearTimeout(task.timer));
    diveTimers.clear();
  }
  function armDiveTask(task){
    task.due=performance.now()+task.remaining;
    task.timer=window.setTimeout(()=>{
      task.timer=0;
      diveTimers.delete(task);
      if(task.session===diveSession&&task.generation===sceneGeneration&&activeScene==="battle"&&!diveSuspended)task.callback();
    },task.remaining);
  }
  function scheduleDive(callback,delay){
    const task={session:diveSession,generation:sceneGeneration,callback,remaining:Math.max(0,delay),due:0,timer:0};
    diveTimers.add(task);
    if(!diveSuspended)armDiveTask(task);
    return task;
  }
  function suspendDiveAsync(){
    suspendBeaconConfirmation();
    if(diveSuspended||!diveTimers.size||$("battleShell").classList.contains("hidden")||!$("result").classList.contains("hidden"))return;
    diveSuspended=true;
    const now=performance.now();
    diveTimers.forEach(task=>{
      if(!task.timer)return;
      task.remaining=Math.max(0,task.due-now);
      window.clearTimeout(task.timer);
      task.timer=0;
    });
  }
  function resumeDiveAsync(){
    if(document.hidden||!windowFocused||$("battleShell").classList.contains("hidden")||!$("result").classList.contains("hidden")||!$("quitPanel").classList.contains("hidden")||!$("diveCoach").classList.contains("hidden"))return;
    resumeBeaconConfirmation();
    if(!diveSuspended)return;
    diveSuspended=false;
    diveTimers.forEach(task=>{if(task.session===diveSession&&task.generation===sceneGeneration&&!task.timer)armDiveTask(task);});
  }
  const mission=(name,zhName,relic,zhRelic,rule,zhRule,config)=>({name,zhName,relic,zhRelic,rule,zhRule,...config});
  const routes = [
    mission("Lantern Shelf","燈礁淺台","Tide Compass","潮汐羅盤","Read clear clues; one tutorial fish.","辨認清楚線索，學會第一次魚戰。",{risk:1,zones:5,target:4,fishZones:[3],fishTier:1,escapeCost:8,encounters:[["relic","hazard"],["current","cache"],["oxygen","relic"],["cache","hazard"],["relic","current"]]}),
    mission("Bubble Garden","氣泡花園","Pearl Seed","珍珠種子","Air pockets restore two power.","氧氣泡會回復 2 點電力。",{risk:1,zones:5,target:4,fishZones:[4],fishTier:1,oxygenPower:2,escapeCost:8,encounters:[["oxygen","relic"],["cache","current"],["relic","hazard"],["oxygen","cache"],["current","relic"]]}),
    mission("Split Current","雙流岔道","Current Fin","流向尾鰭","Riding a current restores one power.","穿越亂流會回復 1 點電力。",{risk:1,zones:5,target:4,fishZones:[3],fishTier:1,currentPower:1,escapeCost:8,encounters:[["current","relic"],["cache","oxygen"],["hazard","current"],["relic","cache"],["oxygen","hazard"]]}),
    mission("Crystal Wreck","水晶沉船","Glass Sextant","水晶六分儀","The first zone begins fully scanned.","第一個海域會自動完成聲納掃描。",{risk:1,zones:5,target:5,fishZones:[4],fishTier:2,openingScan:true,escapeCost:8,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["cache","current"]]}),
    mission("Reef Patrol","礁環巡航","Coral Badge","珊瑚徽章","Two safe lanes in a row grant bonus salvage.","連續選中 2 條安全航線可獲額外打撈。",{risk:1,zones:5,target:5,fishZones:[2,5],fishTier:2,streakEvery:2,escapeCost:9,encounters:[["relic","current"],["oxygen","cache"],["cache","hazard"],["relic","current"],["oxygen","cache"]]}),

    mission("Silt Maze","泥沙迷宮","Silt Map","泥沙航圖","Sonar is jammed in zones 2 and 4.","第 2、4 海域無法使用聲納。",{risk:2,zones:6,target:5,fishZones:[3],fishTier:2,jammedZones:[2,4],escapeCost:9,encounters:[["cache","current"],["relic","hazard"],["oxygen","cache"],["current","relic"],["hazard","oxygen"],["cache","relic"]]}),
    mission("Fragile Gallery","易碎遺廊","Porcelain Ray","瓷光魟牌","Hazards break one carried salvage.","碰到危險會損失 1 件本輪打撈品。",{risk:2,zones:6,target:5,fishZones:[4],fishTier:2,fragileCargo:1,escapeCost:9,encounters:[["relic","hazard"],["cache","current"],["oxygen","relic"],["hazard","cache"],["relic","current"],["cache","oxygen"]]}),
    mission("Shield Trench","護盾海溝","Ward Shell","守護貝殼","Begin with one armed Shock Shield.","開場自動裝備一次震波護盾。",{risk:2,zones:6,target:6,fishZones:[3,6],fishTier:3,openingShield:true,escapeCost:10,encounters:[["hazard","cache"],["current","relic"],["oxygen","hazard"],["cache","relic"],["current","oxygen"],["relic","cache"]]}),
    mission("Power Chimneys","能量煙囪","Volt Coral","電光珊瑚","Relics and air pockets recharge power.","遺物與氧氣泡都能回充電力。",{risk:2,zones:6,target:6,fishZones:[4],fishTier:3,relicPower:1,oxygenPower:2,escapeCost:10,encounters:[["relic","current"],["oxygen","cache"],["hazard","relic"],["cache","oxygen"],["current","relic"],["cache","hazard"]]}),
    mission("Barracuda Crossing","梭魚渡口","Silver Tooth","銀牙護符","Fish victories grant extra salvage.","擊退魚群會獲得額外打撈品。",{risk:2,zones:6,target:7,fishZones:[2,4,6],fishTier:3,fishBonus:1,escapeCost:10,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["cache","current"],["relic","oxygen"]]}),

    mission("Moonless Fork","無月岔路","Darkwater Lens","暗潮透鏡","Three zones must be read without Sonar.","三個干擾海域必須只靠環境線索判斷。",{risk:2,zones:6,target:6,fishZones:[3,6],fishTier:3,jammedZones:[2,3,5],escapeCost:10,encounters:[["relic","current"],["hazard","cache"],["oxygen","relic"],["cache","current"],["hazard","oxygen"],["relic","cache"]]}),
    mission("Checkpoint Cavern","上浮洞窟","Bell Anchor","鐘形船錨","Surface only at zones 2, 4, or 6.","只能在第 2、4、6 海域安全上浮。",{risk:2,zones:6,target:6,fishZones:[3,5],fishTier:3,surfaceZones:[2,4,6],escapeCost:10,encounters:[["cache","current"],["oxygen","relic"],["hazard","cache"],["relic","current"],["oxygen","hazard"],["cache","relic"]]}),
    mission("Salvage Chain","連鎖打撈場","Chain Idol","鎖鏈偶像","Build safe streaks; hazards break cargo.","連續安全航線會加成，但危險會打碎貨物。",{risk:2,zones:7,target:7,fishZones:[4],fishTier:4,streakEvery:2,fragileCargo:1,escapeCost:11,encounters:[["relic","hazard"],["cache","current"],["oxygen","relic"],["hazard","cache"],["relic","current"],["cache","oxygen"],["current","relic"]]}),
    mission("Magnetic Ribs","磁骨峽谷","Magnet Spine","磁脊骨片","Sonar costs one; Shield costs two power.","聲納只耗 1 點，但護盾需要 2 點電力。",{risk:2,zones:7,target:7,fishZones:[3,6],fishTier:4,sonarCost:1,shieldCost:2,escapeCost:11,encounters:[["cache","hazard"],["current","relic"],["oxygen","cache"],["relic","hazard"],["current","oxygen"],["cache","relic"],["hazard","cache"]]}),
    mission("Shark Archive","鯊影檔案庫","Shark Seal","鯊印石板","Two guardian sharks carry bonus relics.","兩隻守庫鯊魚各帶有額外遺物。",{risk:3,zones:7,target:8,fishZones:[3,6],fishTier:5,fishBonus:2,escapeCost:12,encounters:[["relic","current"],["cache","hazard"],["oxygen","relic"],["hazard","cache"],["current","oxygen"],["relic","hazard"],["cache","current"]]}),

    mission("Pressure Bells","壓力鐘群","Depth Chime","深海鳴鐘","Every move also costs two oxygen.","每次移動都會額外消耗 2 點氧氣。",{risk:3,zones:7,target:7,fishZones:[4,7],fishTier:5,oxygenTax:2,escapeCost:12,encounters:[["oxygen","hazard"],["relic","current"],["cache","oxygen"],["hazard","relic"],["current","cache"],["oxygen","hazard"],["relic","cache"]]}),
    mission("Broken Compass","失向海床","Broken Needle","斷裂指針","Jammed zones reward risky current riding.","干擾區的亂流可換回電力。",{risk:3,zones:7,target:7,fishZones:[3,6],fishTier:5,jammedZones:[2,4,6],currentPower:1,escapeCost:12,encounters:[["current","relic"],["hazard","cache"],["oxygen","current"],["relic","hazard"],["cache","current"],["oxygen","relic"],["hazard","cache"]]}),
    mission("Guardian Nursery","守護獸育場","Guardian Scale","守護獸鱗片","Start shielded; the guardian carries salvage.","帶著開場護盾，守護獸會掉落額外打撈。",{risk:3,zones:7,target:7,fishZones:[3,5],fishTier:5,openingShield:true,fishBonus:1,escapeCost:12,encounters:[["hazard","relic"],["cache","current"],["oxygen","hazard"],["relic","cache"],["current","oxygen"],["cache","hazard"],["relic","current"]]}),
    mission("Blue Furnace","藍焰熱泉","Thermal Crown","熱泉冠飾","Pressure drains oxygen; vents recharge power.","水壓持續耗氧，熱泉氧氣泡能大量充電。",{risk:3,zones:7,target:8,fishZones:[4,7],fishTier:6,oxygenTax:2,oxygenPower:2,escapeCost:13,encounters:[["oxygen","cache"],["current","relic"],["hazard","oxygen"],["cache","relic"],["current","hazard"],["oxygen","cache"],["relic","current"]]}),
    mission("Twin Predators","雙獵食者海域","Twin Fang","雙牙化石","Three predators carry two bonus salvage each.","三場獵食者戰各提供 2 件額外打撈。",{risk:3,zones:7,target:9,fishZones:[2,5,7],fishTier:6,fishBonus:2,escapeCost:13,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["current","oxygen"],["cache","hazard"],["relic","cache"]]}),

    mission("Silent Cathedral","寂靜聖堂","Choir Pearl","聖歌珍珠","Sonar works only in even-numbered zones.","聲納只能在偶數海域使用。",{risk:3,zones:8,target:8,fishZones:[4,8],fishTier:6,jammedZones:[1,3,5,7],escapeCost:14,encounters:[["relic","current"],["hazard","cache"],["oxygen","relic"],["cache","hazard"],["current","oxygen"],["relic","cache"],["hazard","current"],["cache","relic"]]}),
    mission("Cargo Vow","護貨誓約","Vow Casket","誓約匣","Cargo breaks on hazards; surface at checkpoints.","危險會破壞貨物，且只能在檢查點上浮。",{risk:3,zones:8,target:8,fishZones:[3,6],fishTier:6,fragileCargo:2,surfaceZones:[3,6,8],escapeCost:14,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["current","oxygen"],["cache","hazard"],["relic","current"],["oxygen","cache"]]}),
    mission("Echo Treasury","回聲寶庫","Echo Chalice","回聲聖杯","Sonar costs three; safe streaks earn salvage.","聲納耗 3 點電力，安全連線可賺取額外打撈。",{risk:3,zones:8,target:9,fishZones:[4,7],fishTier:7,sonarCost:3,streakEvery:2,relicPower:1,escapeCost:14,encounters:[["relic","hazard"],["cache","current"],["oxygen","relic"],["hazard","cache"],["relic","current"],["cache","oxygen"],["current","relic"],["cache","hazard"]]}),
    mission("Storm Spiral","風暴螺旋","Storm Gyro","風暴陀螺","Pressure drains oxygen; currents recharge power.","水壓耗氧，但亂流能回充電力。",{risk:3,zones:8,target:8,fishZones:[3,6,8],fishTier:7,oxygenTax:3,currentPower:1,escapeCost:15,encounters:[["current","cache"],["hazard","relic"],["oxygen","current"],["cache","hazard"],["relic","oxygen"],["current","cache"],["hazard","relic"],["oxygen","current"]]}),
    mission("Shark Crown","鯊皇領海","Crown Tooth","王冠巨牙","Four shark guards hold the route's treasure.","四隻鯊魚守衛掌握主要打撈品。",{risk:3,zones:8,target:10,fishZones:[2,4,6,8],fishTier:7,fishBonus:2,escapeCost:15,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["current","oxygen"],["cache","hazard"],["relic","current"],["oxygen","cache"]]}),

    mission("Last Air Locks","終末氣閘","Airlock Key","氣閘鑰匙","Surface at airlocks; vents restore two power.","只能在氣閘上浮，氧氣泡可回復 2 點電力。",{risk:3,zones:8,target:9,fishZones:[3,7],fishTier:7,surfaceZones:[2,5,8],oxygenPower:2,escapeCost:15,encounters:[["oxygen","hazard"],["relic","cache"],["current","oxygen"],["hazard","relic"],["cache","current"],["oxygen","hazard"],["relic","cache"],["current","oxygen"]]}),
    mission("Glass Reliquary","玻璃聖物庫","Glass Heart","玻璃之心","Begin scanned; hazards shatter two salvage.","開場自動掃描，但危險會打碎 2 件打撈品。",{risk:3,zones:8,target:10,fishZones:[4,8],fishTier:8,openingScan:true,fragileCargo:2,escapeCost:16,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["cache","current"],["relic","oxygen"],["current","hazard"],["cache","relic"]]}),
    mission("Black Current","黑潮核心","Black Gyre","黑潮渦核","Four jammed zones; currents power safe streaks.","四個干擾區中，亂流充電與安全連線並存。",{risk:3,zones:8,target:9,fishZones:[3,6],fishTier:8,jammedZones:[2,4,6,8],currentPower:1,streakEvery:2,escapeCost:16,encounters:[["current","relic"],["hazard","cache"],["oxygen","current"],["relic","hazard"],["cache","oxygen"],["current","relic"],["hazard","cache"],["oxygen","current"]]}),
    mission("Nori's Oath","諾里的誓航","Nori Medal","諾里勳章","Start shielded; pressure and predators test recovery.","開場護盾後，水壓與獵食者會連續考驗資源分配。",{risk:3,zones:8,target:10,fishZones:[2,5,8],fishTier:8,openingShield:true,oxygenTax:2,fishBonus:2,escapeCost:16,encounters:[["hazard","cache"],["relic","current"],["oxygen","hazard"],["cache","relic"],["current","oxygen"],["hazard","cache"],["relic","current"],["oxygen","cache"]]}),
    mission("Heart of the Abyss","深淵之心","Abyss Heart","深淵心核","Master jammed Sonar, fragile cargo, streaks, and sharks.","最終任務結合聲納干擾、易碎貨物、安全連線與鯊魚戰。",{risk:3,zones:8,target:11,fishZones:[2,4,6,8],fishTier:9,sonarCost:3,jammedZones:[3,6],fragileCargo:1,streakEvery:2,fishBonus:2,oxygenPower:2,escapeCost:17,encounters:[["cache","hazard"],["relic","current"],["oxygen","cache"],["hazard","relic"],["cache","current"],["oxygen","hazard"],["relic","cache"],["current","oxygen"]]})
  ];
  const outcomes = {
    relic:{oxygen:-10,salvage:1,safe:true,intel:{loot:2,danger:1,cost:"8–14"},signal:"signalSteady",clues:["clueGlint","clueCalm"],label:"outcomeRelic",feedback:"foundRelic"},
    cache:{oxygen:-16,salvage:2,safe:true,intel:{loot:3,danger:2,cost:"14–22"},signal:"signalStrong",clues:["clueHeavy","clueScratches"],label:"outcomeCache",feedback:"foundCache"},
    oxygen:{oxygen:18,salvage:0,safe:true,intel:{loot:1,danger:1,cost:"+12–22"},signal:"signalSteady",clues:["clueBigBubbles","clueWarm"],label:"outcomeOxygen",feedback:"foundOxygen"},
    current:{oxygen:-18,salvage:0,safe:false,intel:{loot:1,danger:2,cost:"14–22"},signal:"signalRough",clues:["clueSand","clueFast"],label:"outcomeCurrent",feedback:"hitCurrent"},
    hazard:{oxygen:-28,salvage:0,safe:false,intel:{loot:2,danger:3,cost:"22–32"},signal:"signalStrong",clues:["clueRope","clueSilent"],label:"outcomeHazard",feedback:"hitHazard"}
  };
  if(routes.length!==ROUTE_COUNT||routes.some(route=>route.encounters.length!==route.zones))throw new Error("Animal Abyss Diver authored route data is incomplete.");
  const isChinese=()=>locale==="zh-Hant"||locale==="zh-Hans";
  const simplify=(value)=>locale==="zh-Hans"&&window.WeightPlayI18n?.simplifyChineseText?window.WeightPlayI18n.simplifyChineseText(value):value;
  const runtimeTranslate=(template)=>gameOwnedLocales.has(locale)?template:window.WeightPlayGameRuntimeLocalizer?.translate?.(template)||template;
  const format=(template,values={})=>Object.entries(values).reduce((value,[name,replacement])=>value.replaceAll(`{${name}}`,String(replacement)),String(template));
  const list=(value)=>value.split("|");
  const routeMechanicKeys=["tutorial","air","current","scan","streak","jammed","fragile","shield","relic","fish","jammed","checkpoint","combo","cost","predators","pressure","jammed","predators","pressure","predators","jammed","combo","cost","pressure","predators","surface","fragile","combo","predators","final"];
  const routeLocalization={
    ja:{
      names:list("灯礁棚|泡の庭|分流|水晶の難破船|礁パトロール|泥砂迷宮|壊れやすい回廊|盾の海溝|電力煙突|カマス渡り|月なき分岐|中継洞窟|回収連鎖|磁気の肋骨|サメ文庫|圧力ベル|壊れた羅針盤|守護者の育場|青い炉|双頭の捕食者|静寂の聖堂|貨物の誓い|こだまの宝庫|嵐の螺旋|サメの王冠|最後のエアロック|ガラス聖遺物庫|黒潮|ノリの誓い|深淵の心"),
      rules:{tutorial:"明瞭な手掛かりを読み、最初の魚戦を練習する。",air:"気泡で電力を2回復する。",current:"潮流に乗ると電力を1回復する。",scan:"最初の区域は完全にスキャン済み。",streak:"安全なレーンを{n}回連続で選ぶと回収ボーナス。",jammed:"{zones}区域ではソナーが妨害される。",fragile:"危険に当たると回収品を{n}個失う。",shield:"シールドを装備した状態で開始する。",relic:"遺物を回収すると電力を1回復する。",fish:"魚に勝つと追加の回収品を得る。",checkpoint:"区域{zones}でのみ浮上できる。",combo:"安全な連続選択を作り、危険では貨物が壊れる。",cost:"ソナーは{sonar}、シールドは{shield}電力を使う。",predators:"守護魚が追加の遺物を運んでいる。",pressure:"移動するたび酸素を{n}追加消費する。",surface:"気閘で浮上し、気泡で電力を2回復する。",final:"妨害ソナー、壊れやすい貨物、安全連鎖、サメ戦を極める。"},
      battle:{signalSteady:"安定した反響",signalStrong:"強い反響",signalRough:"荒れた反響",clueGlint:"小さな金属のきらめき",clueCalm:"泡が一定に上がる",clueHeavy:"重く空洞な反響",clueScratches:"新しい引きずり跡",clueBigBubbles:"大きな泡が上がる",clueWarm:"水温が少し高い",clueSand:"砂が横へ流れる",clueFast:"泡が速く通り過ぎる",clueRope:"ロープがきれいに切れている",clueSilent:"近くの魚が逃げた",outcomeRelic:"遺物 +1 / 酸素 -10",outcomeCache:"宝 +2 / 酸素 -16",outcomeOxygen:"気泡 / 酸素 +18",outcomeCurrent:"潮流 / 酸素 -18",outcomeHazard:"罠 / 酸素 -28",foundRelic:"遺物を回収：回収 +1、酸素 -10。",foundCache:"宝箱：回収 +2、酸素 -16。",foundOxygen:"気泡：酸素が18回復。",hitCurrent:"強い潮流：酸素 -18。",hitHazard:"罠が発動：酸素 -28。"}
    },
    ko:{
      names:list("랜턴 선반|거품 정원|갈라진 해류|수정 난파선|산호초 순찰|실트 미로|깨지기 쉬운 회랑|방패 해구|동력 굴뚝|바라쿠다 횡단|달 없는 갈림길|체크포인트 동굴|인양 사슬|자기 갈비 협곡|상어 기록고|압력 종|부서진 나침반|수호자 사육장|푸른 용광로|쌍둥이 포식자|고요한 성당|화물의 맹세|메아리 보물고|폭풍 나선|상어 왕관|마지막 에어록|유리 성물함|검은 해류|노리의 맹세|심연의 심장"),
      rules:{tutorial:"선명한 단서를 읽고 첫 물고기 전투를 연습하세요.",air:"공기 주머니가 전력 2를 회복합니다.",current:"해류를 타면 전력 1을 회복합니다.",scan:"첫 구역은 완전히 스캔된 상태로 시작합니다.",streak:"안전한 레인을 {n}번 연속 선택하면 인양 보너스를 얻습니다.",jammed:"{zones}개 구역에서는 소나가 방해됩니다.",fragile:"위험에 맞으면 운반 중인 인양품 {n}개가 부서집니다.",shield:"실드가 장착된 상태로 시작합니다.",relic:"유물을 회수하면 전력 1을 회복합니다.",fish:"물고기를 이기면 추가 인양품을 얻습니다.",checkpoint:"{zones} 구역에서만 수면으로 올라올 수 있습니다.",combo:"안전한 연속 선택을 만들고 위험에서 화물을 지키세요.",cost:"소나는 전력 {sonar}, 실드는 전력 {shield}를 사용합니다.",predators:"수호 물고기가 추가 유물을 지키고 있습니다.",pressure:"이동할 때마다 산소를 {n} 더 소모합니다.",surface:"에어록에서만 상승하고 공기 주머니가 전력 2를 회복합니다.",final:"방해 소나, 깨지기 쉬운 화물, 안전 연속, 상어 전투를 모두 시험합니다."},
      battle:{signalSteady:"안정적인 메아리",signalStrong:"강한 메아리",signalRough:"거친 메아리",clueGlint:"작은 금속 반짝임",clueCalm:"거품이 일정하게 올라옵니다",clueHeavy:"무겁고 빈 메아리",clueScratches:"새로운 끌린 자국",clueBigBubbles:"큰 거품이 올라옵니다",clueWarm:"물이 더 따뜻합니다",clueSand:"모래가 옆으로 흐릅니다",clueFast:"거품이 빠르게 지나갑니다",clueRope:"밧줄이 깨끗하게 잘렸습니다",clueSilent:"근처 물고기가 달아났습니다",outcomeRelic:"유물 +1 / 산소 -10",outcomeCache:"보물 +2 / 산소 -16",outcomeOxygen:"공기 주머니 / 산소 +18",outcomeCurrent:"해류 / 산소 -18",outcomeHazard:"함정 / 산소 -28",foundRelic:"유물 회수: 인양 +1, 산소 -10.",foundCache:"보물 저장고: 인양 +2, 산소 -16.",foundOxygen:"공기 주머니: 산소가 18 회복됩니다.",hitCurrent:"강한 해류: 산소 -18.",hitHazard:"함정 발동: 산소 -28."}
    },
    es:{
      names:list("Estante de linternas|Jardín de burbujas|Corriente partida|Naufragio de cristal|Patrulla del arrecife|Laberinto de limo|Galería frágil|Fosa del escudo|Chimeneas de energía|Cruce de barracudas|Bifurcación sin luna|Caverna de control|Cadena de rescate|Costillas magnéticas|Archivo de tiburones|Campanas de presión|Brújula rota|Vivero de guardianes|Horno azul|Depredadores gemelos|Catedral silenciosa|Juramento de carga|Tesoro del eco|Espiral de tormenta|Corona del tiburón|Últimas esclusas|Relicario de cristal|Corriente negra|Juramento de Nori|Corazón del abismo"),
      rules:{tutorial:"Lee las pistas claras y practica el primer combate contra peces.",air:"Las bolsas de aire recuperan 2 de energía.",current:"La corriente devuelve 1 de energía.",scan:"La primera zona comienza escaneada por completo.",streak:"Elige un carril seguro {n} veces seguidas para ganar un bonus de rescate.",jammed:"El sonar falla en {zones} zonas.",fragile:"Un peligro rompe {n} rescate transportado.",shield:"Comienzas con el escudo preparado.",relic:"Cada reliquia recuperada devuelve 1 de energía.",fish:"Vencer a un pez concede rescate extra.",checkpoint:"Solo puedes salir en las zonas {zones}.",combo:"Forma rachas seguras; los peligros rompen la carga.",cost:"El sonar usa {sonar} y el escudo {shield} de energía.",predators:"Los peces guardianes llevan reliquias extra.",pressure:"Cada avance cuesta {n} de oxígeno adicional.",surface:"Sube en las esclusas; las bolsas devuelven 2 de energía.",final:"Domina el sonar bloqueado, la carga frágil, las rachas y los tiburones."},
      battle:{signalSteady:"Eco estable",signalStrong:"Eco intenso",signalRough:"Eco turbulento",clueGlint:"Pequeños destellos metálicos",clueCalm:"Las burbujas suben constantes",clueHeavy:"Un eco hueco y pesado",clueScratches:"Marcas de arrastre recientes",clueBigBubbles:"Suben burbujas grandes",clueWarm:"El agua se siente más cálida",clueSand:"La arena corre de lado",clueFast:"Las burbujas pasan deprisa",clueRope:"Una cuerda está cortada limpiamente",clueSilent:"Los peces cercanos han huido",outcomeRelic:"Reliquia +1 / O2 -10",outcomeCache:"Tesoro +2 / O2 -16",outcomeOxygen:"Bolsa de aire / O2 +18",outcomeCurrent:"Corriente / O2 -18",outcomeHazard:"Trampa / O2 -28",foundRelic:"Reliquia recuperada: rescate +1, oxígeno -10.",foundCache:"Cofre de tesoro: rescate +2, oxígeno -16.",foundOxygen:"Bolsa de aire: oxígeno +18.",hitCurrent:"Corriente fuerte: oxígeno -18.",hitHazard:"Trampa activada: oxígeno -28."}
    },
    "pt-BR":{
      names:list("Prateleira das lanternas|Jardim de bolhas|Corrente dividida|Naufrágio de cristal|Patrulha do recife|Labirinto de lodo|Galeria frágil|Fossa do escudo|Chaminés de energia|Travessia das barracudas|Bifurcação sem lua|Caverna de checkpoint|Cadeia de salvamento|Costelas magnéticas|Arquivo dos tubarões|Sinos de pressão|Bússola quebrada|Berçário dos guardiões|Forno azul|Predadores gêmeos|Catedral silenciosa|Juramento da carga|Tesouro do eco|Espiral da tempestade|Coroa do tubarão|Últimas eclusas|Relicário de vidro|Corrente negra|Juramento de Nori|Coração do abismo"),
      rules:{tutorial:"Leia as pistas claras e pratique o primeiro combate com peixe.",air:"Bolsas de ar recuperam 2 de energia.",current:"A corrente recupera 1 de energia.",scan:"A primeira zona começa totalmente escaneada.",streak:"Escolha uma faixa segura {n} vezes seguidas para ganhar bônus de salvamento.",jammed:"O sonar falha em {zones} zonas.",fragile:"Um perigo quebra {n} salvamento carregado.",shield:"Você começa com o escudo armado.",relic:"Cada relíquia recuperada devolve 1 de energia.",fish:"Vencer um peixe concede salvamento extra.",checkpoint:"Só é possível subir nas zonas {zones}.",combo:"Crie sequências seguras; perigos quebram a carga.",cost:"O sonar usa {sonar} e o escudo usa {shield} de energia.",predators:"Peixes guardiões carregam relíquias extras.",pressure:"Cada movimento custa {n} de oxigênio adicional.",surface:"Suba nas eclusas; bolsas recuperam 2 de energia.",final:"Domine sonar bloqueado, carga frágil, sequências e tubarões."},
      battle:{signalSteady:"Eco estável",signalStrong:"Eco forte",signalRough:"Eco turbulento",clueGlint:"Pequenos brilhos metálicos",clueCalm:"Bolhas sobem com regularidade",clueHeavy:"Um eco oco e pesado",clueScratches:"Marcas recentes de arrasto",clueBigBubbles:"Bolhas grandes sobem",clueWarm:"A água parece mais quente",clueSand:"A areia corre para o lado",clueFast:"Bolhas passam depressa",clueRope:"Uma corda foi cortada com limpeza",clueSilent:"Os peixes próximos fugiram",outcomeRelic:"Relíquia +1 / O2 -10",outcomeCache:"Tesouro +2 / O2 -16",outcomeOxygen:"Bolsa de ar / O2 +18",outcomeCurrent:"Corrente / O2 -18",outcomeHazard:"Armadilha / O2 -28",foundRelic:"Relíquia recuperada: salvamento +1, oxigênio -10.",foundCache:"Tesouro encontrado: salvamento +2, oxigênio -16.",foundOxygen:"Bolsa de ar: oxigênio +18.",hitCurrent:"Corrente forte: oxigênio -18.",hitHazard:"Armadilha ativada: oxigênio -28."}
    },
    fr:{
      names:list("Étagère aux lanternes|Jardin de bulles|Courant divisé|Épave de cristal|Patrouille du récif|Labyrinthe de limon|Galerie fragile|Fosse du bouclier|Cheminées d'énergie|Passage des barracudas|Fourche sans lune|Caverne des balises|Chaîne de récupération|Côtes magnétiques|Archive des requins|Cloches de pression|Boussole brisée|Nurserie des gardiens|Fourneau bleu|Prédateurs jumeaux|Cathédrale silencieuse|Vœu de cargaison|Trésor de l'écho|Spirale de tempête|Couronne du requin|Derniers sas|Reliquaire de verre|Courant noir|Vœu de Nori|Cœur des abysses"),
      rules:{tutorial:"Lisez les indices nets et entraînez-vous au premier combat de poisson.",air:"Les poches d'air rendent 2 unités d'énergie.",current:"Le courant rend 1 unité d'énergie.",scan:"La première zone commence entièrement scannée.",streak:"Choisissez une voie sûre {n} fois de suite pour gagner un bonus.",jammed:"Le sonar est brouillé dans {zones} zones.",fragile:"Un danger casse {n} récupération transportée.",shield:"Vous commencez avec le bouclier armé.",relic:"Chaque relique récupérée rend 1 énergie.",fish:"Vaincre un poisson donne une récupération bonus.",checkpoint:"La remontée est possible seulement aux zones {zones}.",combo:"Créez des séries sûres ; les dangers brisent la cargaison.",cost:"Le sonar coûte {sonar} et le bouclier {shield} énergie.",predators:"Les poissons gardiens portent des reliques bonus.",pressure:"Chaque déplacement coûte {n} oxygène supplémentaire.",surface:"Remontez aux sas ; les poches rendent 2 énergie.",final:"Maîtrisez le sonar brouillé, la cargaison fragile, les séries et les requins."},
      battle:{signalSteady:"Écho régulier",signalStrong:"Écho puissant",signalRough:"Écho turbulent",clueGlint:"De petits éclats métalliques",clueCalm:"Les bulles montent régulièrement",clueHeavy:"Un écho creux et lourd",clueScratches:"Des traces de traîne fraîches",clueBigBubbles:"De grosses bulles remontent",clueWarm:"L'eau semble plus chaude",clueSand:"Le sable file de côté",clueFast:"Les bulles passent très vite",clueRope:"Une corde est coupée net",clueSilent:"Les poissons proches ont fui",outcomeRelic:"Relique +1 / O2 -10",outcomeCache:"Trésor +2 / O2 -16",outcomeOxygen:"Poche d'air / O2 +18",outcomeCurrent:"Courant / O2 -18",outcomeHazard:"Piège / O2 -28",foundRelic:"Relique récupérée : récupération +1, oxygène -10.",foundCache:"Coffre au trésor : récupération +2, oxygène -16.",foundOxygen:"Poche d'air : oxygène +18.",hitCurrent:"Courant puissant : oxygène -18.",hitHazard:"Piège déclenché : oxygène -28."}
    },
    de:{
      names:list("Laternenbord|Blasengarten|Geteilte Strömung|Kristallwrack|Riffpatrouille|Schlicklabyrinth|Zerbrechliche Galerie|Schildgraben|Energieschornsteine|Barrakudaquerung|Mondlose Gabelung|Kontrollhöhle|Bergungskette|Magnetrippen|Haiarchiv|Druckglocken|Zerbrochener Kompass|Wächteraufzucht|Blauer Brennofen|Zwillingsjäger|Stille Kathedrale|Frachtgelübde|Echoschatz|Sturmspirale|Haikrone|Letzte Luftschleusen|Glasreliquiar|Schwarze Strömung|Noris Gelübde|Herz des Abgrunds"),
      rules:{tutorial:"Lies die klaren Hinweise und übe den ersten Fischkampf.",air:"Luftblasen stellen 2 Energie wieder her.",current:"Die Strömung stellt 1 Energie wieder her.",scan:"Die erste Zone beginnt vollständig gescannt.",streak:"Wähle {n} sichere Spuren in Folge für einen Bergungsbonus.",jammed:"Das Sonar ist in {zones} Zonen gestört.",fragile:"Ein Treffer zerstört {n} getragene Bergung.",shield:"Du beginnst mit aktiviertem Schild.",relic:"Jedes geborgene Relikt gibt 1 Energie zurück.",fish:"Ein besiegter Fisch bringt zusätzliche Bergung.",checkpoint:"Auftauchen ist nur in den Zonen {zones} möglich.",combo:"Baue sichere Serien; Gefahren beschädigen die Fracht.",cost:"Das Sonar kostet {sonar}, der Schild {shield} Energie.",predators:"Wächterfische tragen Bonusrelikte.",pressure:"Jede Bewegung kostet zusätzlich {n} Sauerstoff.",surface:"Tauche an Schleusen auf; Blasen geben 2 Energie.",final:"Meistere gestörtes Sonar, zerbrechliche Fracht, Serien und Haie."},
      battle:{signalSteady:"Stabiles Echo",signalStrong:"Starkes Echo",signalRough:"Turbulentes Echo",clueGlint:"Kleine Metallblitze",clueCalm:"Blasen steigen gleichmäßig auf",clueHeavy:"Ein schweres hohles Echo",clueScratches:"Frische Schleifspuren",clueBigBubbles:"Große Blasen steigen auf",clueWarm:"Das Wasser fühlt sich wärmer an",clueSand:"Sand strömt seitlich",clueFast:"Blasen schießen vorbei",clueRope:"Ein Seil ist sauber durchtrennt",clueSilent:"Nahe Fische sind geflohen",outcomeRelic:"Relikt +1 / O2 -10",outcomeCache:"Schatz +2 / O2 -16",outcomeOxygen:"Luftblase / O2 +18",outcomeCurrent:"Strömung / O2 -18",outcomeHazard:"Falle / O2 -28",foundRelic:"Relikt geborgen: Bergung +1, Sauerstoff -10.",foundCache:"Schatzkammer: Bergung +2, Sauerstoff -16.",foundOxygen:"Luftblase: Sauerstoff +18.",hitCurrent:"Starke Strömung: Sauerstoff -18.",hitHazard:"Falle ausgelöst: Sauerstoff -28."}
    },
    it:{
      names:list("Scaffale delle lanterne|Giardino delle bolle|Corrente divisa|Relitto di cristallo|Pattuglia della barriera|Labirinto di limo|Galleria fragile|Fossa dello scudo|Ciminiere d'energia|Passaggio dei barracuda|Bivio senza luna|Caverna dei checkpoint|Catena di recupero|Costole magnetiche|Archivio degli squali|Campane di pressione|Bussola rotta|Vivaio dei guardiani|Fornace blu|Predatori gemelli|Cattedrale silenziosa|Patto del carico|Tesoro dell'eco|Spirale della tempesta|Corona dello squalo|Ultime chiuse|Reliquiario di vetro|Corrente nera|Patto di Nori|Cuore dell'abisso"),
      rules:{tutorial:"Leggi gli indizi chiari e prova il primo combattimento con un pesce.",air:"Le sacche d'aria restituiscono 2 energia.",current:"La corrente restituisce 1 energia.",scan:"La prima zona inizia con la scansione completa.",streak:"Scegli una corsia sicura {n} volte di fila per un bonus.",jammed:"Il sonar è disturbato in {zones} zone.",fragile:"Un pericolo rompe {n} recupero trasportato.",shield:"Inizi con lo scudo pronto.",relic:"Ogni reliquia recuperata restituisce 1 energia.",fish:"Sconfiggere un pesce dà recupero extra.",checkpoint:"Puoi riemergere solo nelle zone {zones}.",combo:"Crea serie sicure; i pericoli danneggiano il carico.",cost:"Il sonar usa {sonar} e lo scudo {shield} energia.",predators:"I pesci guardiani portano reliquie bonus.",pressure:"Ogni movimento costa {n} ossigeno aggiuntivo.",surface:"Riemergi alle chiuse; le bolle restituiscono 2 energia.",final:"Domina sonar disturbato, carico fragile, serie sicure e squali."},
      battle:{signalSteady:"Eco stabile",signalStrong:"Eco intenso",signalRough:"Eco turbolento",clueGlint:"Piccoli riflessi metallici",clueCalm:"Le bolle salgono regolari",clueHeavy:"Un eco cavo e pesante",clueScratches:"Recenti segni di trascinamento",clueBigBubbles:"Salgono bolle grandi",clueWarm:"L'acqua è più calda",clueSand:"La sabbia scorre di lato",clueFast:"Le bolle sfrecciano",clueRope:"Una corda è tagliata di netto",clueSilent:"I pesci vicini sono fuggiti",outcomeRelic:"Reliquia +1 / O2 -10",outcomeCache:"Tesoro +2 / O2 -16",outcomeOxygen:"Sacca d'aria / O2 +18",outcomeCurrent:"Corrente / O2 -18",outcomeHazard:"Trappola / O2 -28",foundRelic:"Reliquia recuperata: recupero +1, ossigeno -10.",foundCache:"Tesoro trovato: recupero +2, ossigeno -16.",foundOxygen:"Sacca d'aria: ossigeno +18.",hitCurrent:"Corrente forte: ossigeno -18.",hitHazard:"Trappola attivata: ossigeno -28."}
    },
    ru:{
      names:list("Фонарная полка|Сад пузырей|Раздвоенное течение|Хрустальное крушение|Патруль рифа|Иловый лабиринт|Хрупкая галерея|Щитовая впадина|Энергетические трубы|Переправа барракуд|Безлунная развилка|Пещера контрольных точек|Цепь добычи|Магнитные рёбра|Архив акул|Колокола давления|Сломанный компас|Питомник стражей|Синяя печь|Двойные хищники|Тихий собор|Клятва груза|Сокровищница эха|Спираль шторма|Корона акулы|Последние шлюзы|Стеклянный реликварий|Чёрное течение|Клятва Нори|Сердце бездны"),
      rules:{tutorial:"Читайте ясные подсказки и потренируйтесь в первой рыбьей схватке.",air:"Воздушные карманы восстанавливают 2 энергии.",current:"Течение возвращает 1 единицу энергии.",scan:"Первая зона начинается полностью просканированной.",streak:"Выберите безопасный путь {n} раз подряд и получите бонус добычи.",jammed:"В {zones} зонах сонар работает со сбоями.",fragile:"Опасность ломает {n} единицу добычи.",shield:"Начните с активным щитом.",relic:"Каждая найденная реликвия возвращает 1 энергию.",fish:"Победа над рыбой даёт дополнительную добычу.",checkpoint:"Всплывать можно только в зонах {zones}.",combo:"Собирайте безопасные серии; опасности повреждают груз.",cost:"Сонар тратит {sonar}, щит — {shield} энергии.",predators:"Рыбы-стражи несут дополнительные реликвии.",pressure:"Каждое движение дополнительно тратит {n} кислорода.",surface:"Всплывайте у шлюзов; пузыри возвращают 2 энергии.",final:"Освойте сбойный сонар, хрупкий груз, серии и акул."},
      battle:{signalSteady:"Ровное эхо",signalStrong:"Сильное эхо",signalRough:"Бурное эхо",clueGlint:"Мелкие металлические блики",clueCalm:"Пузыри поднимаются ровно",clueHeavy:"Тяжёлое гулкое эхо",clueScratches:"Свежие следы волочения",clueBigBubbles:"Поднимаются крупные пузыри",clueWarm:"Вода кажется теплее",clueSand:"Песок течёт вбок",clueFast:"Пузыри проносятся мимо",clueRope:"Верёвка аккуратно перерезана",clueSilent:"Близкие рыбы уплыли",outcomeRelic:"Реликвия +1 / O2 -10",outcomeCache:"Сокровище +2 / O2 -16",outcomeOxygen:"Воздушный карман / O2 +18",outcomeCurrent:"Течение / O2 -18",outcomeHazard:"Ловушка / O2 -28",foundRelic:"Реликвия добыта: добыча +1, кислород -10.",foundCache:"Сокровищница: добыча +2, кислород -16.",foundOxygen:"Воздушный карман: кислород +18.",hitCurrent:"Сильное течение: кислород -18.",hitHazard:"Ловушка сработала: кислород -28."}
    },
    hi:{
      names:list("लैंटन शेल्फ|बुलबुलों का बाग|बँटी हुई धारा|क्रिस्टल मलबा|रीफ गश्त|गाद की भूलभुलैया|नाज़ुक दीर्घा|शील्ड खाई|ऊर्जा चिमनियाँ|बाराकुडा पार|बिना चाँद का मोड़|चेकपॉइंट गुफा|बचाव श्रृंखला|चुंबकीय पसलियाँ|शार्क अभिलेख|दबाव की घंटियाँ|टूटा कम्पास|रक्षक नर्सरी|नीली भट्ठी|जुड़वाँ शिकारी|शांत गिरजाघर|कार्गो की शपथ|गूँज का खजाना|तूफानी सर्पिल|शार्क का मुकुट|अंतिम एयरलॉक|काँच का अवशेषगृह|काली धारा|नोरी की शपथ|अथाह गहराई का हृदय"),
      rules:{tutorial:"साफ़ संकेत पढ़ें और पहली मछली लड़ाई का अभ्यास करें।",air:"हवा की जेबें 2 ऊर्जा लौटाती हैं।",current:"धारा से गुजरने पर 1 ऊर्जा लौटती है।",scan:"पहला क्षेत्र पूरी तरह स्कैन होकर शुरू होता है।",streak:"बोनस बचाव के लिए {n} बार लगातार सुरक्षित लेन चुनें।",jammed:"{zones} क्षेत्रों में सोनार बाधित है।",fragile:"खतरा {n} बचाई हुई वस्तु तोड़ देता है।",shield:"शील्ड सक्रिय अवस्था में शुरुआत होती है।",relic:"हर अवशेष मिलने पर 1 ऊर्जा लौटती है।",fish:"मछली को हराने पर अतिरिक्त बचाव मिलता है।",checkpoint:"सतह पर केवल {zones} क्षेत्रों में आ सकते हैं।",combo:"सुरक्षित क्रम बनाएँ; खतरे कार्गो तोड़ते हैं।",cost:"सोनार {sonar} और शील्ड {shield} ऊर्जा खर्च करते हैं।",predators:"रक्षक मछलियाँ अतिरिक्त अवशेष रखती हैं।",pressure:"हर चाल में {n} अतिरिक्त ऑक्सीजन खर्च होती है।",surface:"एयरलॉक पर सतह में आएँ; बुलबुले 2 ऊर्जा लौटाते हैं।",final:"बाधित सोनार, नाज़ुक कार्गो, सुरक्षित क्रम और शार्क लड़ाइयों में महारत पाएँ।"},
      battle:{signalSteady:"स्थिर गूँज",signalStrong:"तेज़ गूँज",signalRough:"उथल-पुथल वाली गूँज",clueGlint:"धातु की छोटी चमक",clueCalm:"बुलबुले लगातार ऊपर उठते हैं",clueHeavy:"भारी खोखली गूँज",clueScratches:"खींचे जाने के ताज़ा निशान",clueBigBubbles:"बड़े बुलबुले ऊपर उठते हैं",clueWarm:"पानी कुछ गर्म लगता है",clueSand:"रेत एक ओर बहती है",clueFast:"बुलबुले तेज़ी से निकलते हैं",clueRope:"रस्सी साफ़ कटी हुई है",clueSilent:"पास की मछलियाँ भाग गई हैं",outcomeRelic:"अवशेष +1 / O2 -10",outcomeCache:"खज़ाना +2 / O2 -16",outcomeOxygen:"हवा की जेब / O2 +18",outcomeCurrent:"धारा / O2 -18",outcomeHazard:"जाल / O2 -28",foundRelic:"अवशेष मिला: बचाव +1, ऑक्सीजन -10।",foundCache:"खज़ाना मिला: बचाव +2, ऑक्सीजन -16।",foundOxygen:"हवा की जेब: ऑक्सीजन +18।",hitCurrent:"तेज़ धारा: ऑक्सीजन -18।",hitHazard:"जाल सक्रिय: ऑक्सीजन -28।"}
    },
    ar:{
      names:list("رفّ الفوانيس|حديقة الفقاعات|التيار المنقسم|حطام البلور|دورية الشعاب|متاهة الطمي|الممر الهش|خندق الدرع|مداخن الطاقة|عبور البراكودا|مفترق بلا قمر|كهف نقاط التحقق|سلسلة الإنقاذ|أضلاع مغناطيسية|أرشيف القروش|أجراس الضغط|البوصلة المكسورة|حضانة الحراس|الفرن الأزرق|المفترسات التوأم|الكاتدرائية الصامتة|عهد الحمولة|خزينة الصدى|لولب العاصفة|تاج القرش|أقفال الهواء الأخيرة|مستودع الأثر الزجاجي|التيار الأسود|عهد نوري|قلب الهاوية"),
      rules:{tutorial:"اقرأ الأدلة الواضحة وتدرّب على أول مواجهة مع السمكة.",air:"تعيد فقاعات الهواء طاقتين.",current:"يعيد التيار طاقة واحدة.",scan:"تبدأ المنطقة الأولى بمسح كامل.",streak:"اختر المسار الآمن {n} مرات متتالية لتحصل على مكافأة إنقاذ.",jammed:"يتعطل السونار في {zones} مناطق.",fragile:"تُحطّم المخاطر {n} من الغنائم المحمولة.",shield:"تبدأ والدرع مفعّل.",relic:"يعيد كل أثر تجمعه طاقة واحدة.",fish:"يمنح الفوز على السمكة غنائم إضافية.",checkpoint:"يمكن الصعود إلى السطح في المناطق {zones} فقط.",combo:"كوّن سلسلة آمنة؛ فالمخاطر تحطم الحمولة.",cost:"يستهلك السونار {sonar} والدرع {shield} من الطاقة.",predators:"تحمل أسماك الحراسة آثارًا إضافية.",pressure:"تستهلك كل حركة {n} إضافية من الأكسجين.",surface:"اصعد عند أقفال الهواء؛ تعيد الفقاعات طاقتين.",final:"أتقن السونار المعطّل والحمولة الهشة والسلاسل ومواجهات القروش."},
      battle:{signalSteady:"صدى مستقر",signalStrong:"صدى قوي",signalRough:"صدى مضطرب",clueGlint:"بريق معدني صغير",clueCalm:"ترتفع الفقاعات بثبات",clueHeavy:"صدى أجوف وثقيل",clueScratches:"آثار سحب حديثة",clueBigBubbles:"فقاعات كبيرة تصعد",clueWarm:"الماء أدفأ قليلًا",clueSand:"يتدفق الرمل جانبًا",clueFast:"تمر الفقاعات بسرعة",clueRope:"الحبل مقطوع بنظافة",clueSilent:"هربت الأسماك القريبة",outcomeRelic:"أثر +1 / أكسجين -10",outcomeCache:"كنز +2 / أكسجين -16",outcomeOxygen:"فقاعة هواء / أكسجين +18",outcomeCurrent:"تيار / أكسجين -18",outcomeHazard:"فخ / أكسجين -28",foundRelic:"تم جمع أثر: إنقاذ +1، أكسجين -10.",foundCache:"خزينة كنز: إنقاذ +2، أكسجين -16.",foundOxygen:"فقاعة هواء: الأكسجين +18.",hitCurrent:"تيار قوي: الأكسجين -18.",hitHazard:"تفعل الفخ: الأكسجين -28."}
    }
  };
  for(const [localeKey,content] of Object.entries(routeLocalization)){
    const pack=localePacks[localeKey];
    if(!pack||content.names.length!==ROUTE_COUNT)throw new Error(`Animal Abyss Diver ${localeKey} route names are incomplete.`);
    Object.assign(pack,content.battle,{routeNames:content.names,routeRules:routes.map((route,index)=>format(content.rules[routeMechanicKeys[index]],{n:route.streakEvery||route.fragileCargo||route.oxygenTax||1,zones:route.jammedZones?.join(", ")||route.surfaceZones?.join(", ")||"",sonar:route.sonarCost||3,shield:route.shieldCost||2}))});
  }
  const progressionLocaleLabels={
    en:{coins:"Salvage coins: {n}",rank:"Diver rank: {n}",coinsEarned:"This dive: +{n} salvage coins",coinsSaved:"Saved total: {n} salvage coins",routeUnlocked:"New route unlocked: Route {n} · {name}",routeReady:"Next route ready: Route {n} · {name}",routeComplete:"All 30 dive routes cleared.",routeRetry:"Next target: {target} salvage across {zones} zones"},
    "zh-Hant":{coins:u("打撈幣：{n}"),rank:u("潛航員等級：{n}"),coinsEarned:u("本次潛航：+{n} 打撈幣"),coinsSaved:u("已保存總額：{n} 打撈幣"),routeUnlocked:u("已解鎖新路線：路線 {n} · {name}"),routeReady:u("下一條路線已準備：路線 {n} · {name}"),routeComplete:u("30 條潛航路線全部完成。"),routeRetry:u("下一個目標：穿越 {zones} 個海域並打撈 {target} 件")},
    "zh-Hans":{coins:u("打捞币：{n}"),rank:u("潜航员等级：{n}"),coinsEarned:u("本次潜航：+{n} 打捞币"),coinsSaved:u("已保存总额：{n} 打捞币"),routeUnlocked:u("已解锁新路线：路线 {n} · {name}"),routeReady:u("下一条路线已准备：路线 {n} · {name}"),routeComplete:u("30 条潜航路线全部完成。"),routeRetry:u("下一个目标：穿越 {zones} 个海域并打捞 {target} 件")},
    ja:{coins:"回収コイン：{n}",rank:"ダイバーランク：{n}",coinsEarned:"今回の潜航：回収コイン +{n}",coinsSaved:"保存済み合計：回収コイン {n}",routeUnlocked:"新ルート解放：ルート {n} · {name}",routeReady:"次のルート準備完了：ルート {n} · {name}",routeComplete:"全30潜航ルートをクリアしました。",routeRetry:"次の目標：{zones}ゾーンで回収 {target}"},
    ko:{coins:"회수 코인: {n}",rank:"다이버 등급: {n}",coinsEarned:"이번 잠수: 회수 코인 +{n}",coinsSaved:"저장된 총합: 회수 코인 {n}",routeUnlocked:"새 경로 해금: 경로 {n} · {name}",routeReady:"다음 경로 준비 완료: 경로 {n} · {name}",routeComplete:"잠수 경로 30개를 모두 클리어했습니다.",routeRetry:"다음 목표: {zones}구역에서 {target} 회수"},
    es:{coins:"Monedas de salvamento: {n}",rank:"Rango de buceador: {n}",coinsEarned:"Esta inmersión: +{n} monedas de salvamento",coinsSaved:"Total guardado: {n} monedas de salvamento",routeUnlocked:"Nueva ruta desbloqueada: Ruta {n} · {name}",routeReady:"Siguiente ruta lista: Ruta {n} · {name}",routeComplete:"Has completado las 30 rutas de inmersión.",routeRetry:"Siguiente objetivo: {target} de salvamento en {zones} zonas"},
    "pt-BR":{coins:"Moedas de salvamento: {n}",rank:"Patente do mergulhador: {n}",coinsEarned:"Este mergulho: +{n} moedas de salvamento",coinsSaved:"Total salvo: {n} moedas de salvamento",routeUnlocked:"Nova rota desbloqueada: Rota {n} · {name}",routeReady:"Próxima rota pronta: Rota {n} · {name}",routeComplete:"As 30 rotas de mergulho foram concluídas.",routeRetry:"Próximo alvo: {target} salvamentos em {zones} zonas"},
    fr:{coins:"Pièces de récupération : {n}",rank:"Rang du plongeur : {n}",coinsEarned:"Cette plongée : +{n} pièces de récupération",coinsSaved:"Total sauvegardé : {n} pièces de récupération",routeUnlocked:"Nouvelle route débloquée : route {n} · {name}",routeReady:"Route suivante prête : route {n} · {name}",routeComplete:"Les 30 routes de plongée sont terminées.",routeRetry:"Objectif suivant : {target} récupérations sur {zones} zones"},
    de:{coins:"Bergungsmünzen: {n}",rank:"Taucherrang: {n}",coinsEarned:"Dieser Tauchgang: +{n} Bergungsmünzen",coinsSaved:"Gespeicherte Summe: {n} Bergungsmünzen",routeUnlocked:"Neue Route freigeschaltet: Route {n} · {name}",routeReady:"Nächste Route bereit: Route {n} · {name}",routeComplete:"Alle 30 Tauchrouten sind abgeschlossen.",routeRetry:"Nächstes Ziel: {target} Bergung in {zones} Zonen"},
    it:{coins:"Monete di recupero: {n}",rank:"Grado del sub: {n}",coinsEarned:"Questa immersione: +{n} monete di recupero",coinsSaved:"Totale salvato: {n} monete di recupero",routeUnlocked:"Nuovo percorso sbloccato: percorso {n} · {name}",routeReady:"Prossimo percorso pronto: percorso {n} · {name}",routeComplete:"Tutti i 30 percorsi d'immersione sono completati.",routeRetry:"Prossimo obiettivo: {target} recuperi in {zones} zone"},
    ru:{coins:"Монеты добычи: {n}",rank:"Ранг дайвера: {n}",coinsEarned:"Это погружение: +{n} монет добычи",coinsSaved:"Сохранённый итог: {n} монет добычи",routeUnlocked:"Открыт новый маршрут: маршрут {n} · {name}",routeReady:"Следующий маршрут готов: маршрут {n} · {name}",routeComplete:"Все 30 маршрутов погружения пройдены.",routeRetry:"Следующая цель: добыть {target} в {zones} зонах"},
    hi:{coins:"बचाव सिक्के: {n}",rank:"डाइवर रैंक: {n}",coinsEarned:"यह डाइव: +{n} बचाव सिक्के",coinsSaved:"सहेजा गया कुल: {n} बचाव सिक्के",routeUnlocked:"नया रूट अनलॉक: रूट {n} · {name}",routeReady:"अगला रूट तैयार: रूट {n} · {name}",routeComplete:"सभी 30 डाइव रूट पूरे हो गए।",routeRetry:"अगला लक्ष्य: {zones} क्षेत्रों में {target} बचाव"},
    ar:{coins:"عملات الإنقاذ: {n}",rank:"رتبة الغواص: {n}",coinsEarned:"هذه الغوصة: +{n} من عملات الإنقاذ",coinsSaved:"إجمالي العملات المحفوظة: {n}",routeUnlocked:"تم فتح المسار الجديد: المسار {n} · {name}",routeReady:"المسار التالي جاهز: المسار {n} · {name}",routeComplete:"اكتملت مسارات الغوص الثلاثون.",routeRetry:"الهدف التالي: إنقاذ {target} عبر {zones} مناطق"}
  };
  for(const [localeKey,labels] of Object.entries(progressionLocaleLabels)){
    const pack=localeKey.startsWith("zh-")?zh:localeKey==="en"?en:localePacks[localeKey];
    if(!pack)throw new Error(`Animal Abyss Diver ${localeKey} progression labels are missing.`);
    Object.assign(pack,labels);
  }
  const dictionaries={en,"zh-Hant":zh,"zh-Hans":zh,...localePacks};
  const routeText=(route,key)=>{
    const index=Math.max(0,routes.indexOf(route));
    if(!isChinese()&&localePacks[locale]){
      if(key==="name")return localePacks[locale].routeNames?.[index]||t("route",{n:index+1});
      if(key==="relic")return localePacks[locale].relicNames[index%localePacks[locale].relicNames.length];
      if(key==="rule")return localePacks[locale].routeRules?.[index]||localePacks[locale].generic;
    }
    const template=isChinese()?route[`zh${key[0].toUpperCase()}${key.slice(1)}`]:route[key];
    return simplify(runtimeTranslate(template));
  };
  const t=(key,values={})=>simplify(format(dictionaries[locale]?.[key]??key,values));
  const levelText=(value)=>`${levelLabels[locale]||levelLabels.en} ${value}`;
  const icon = name => `<i class="ui-icon icon-${name}" aria-hidden="true"></i>`;
  const maxHealth = () => 30 + save.stats.hp * 8;
  const diverAttack = () => 6 + save.stats.attack * 2;
  const maxOxygen = () => 100 + save.stats.oxygen * 10;
  const xpNeeded = () => 18 + save.level * 12;
  const pips = value => `<span class="pips" aria-hidden="true">${[1,2,3].map(n=>`<i class="${n<=value?"is-on":""}"></i>`).join("")}</span>`;
  const estimateMarkup = outcome => `<span class="metric">${icon("salvage")}<em>${t("shortLoot")}</em>${pips(outcome.intel.loot)}</span><span class="metric">${icon("danger")}<em>${t("shortDanger")}</em>${pips(outcome.intel.danger)}</span><span class="metric metric-oxygen">${icon("oxygen")}<em>${t("shortOxygen")}</em><b>${outcome.intel.cost}</b></span>`;
  const combatDiver=document.createElement("div");combatDiver.className="combat-diver";combatDiver.innerHTML='<img src="../../assets/animal-abyss-diver-nori.png" alt="Nori">';$("fishEncounter").prepend(combatDiver);
  const upgradePanel=document.createElement("section");upgradePanel.id="upgradePanel";upgradePanel.className="upgrade-panel hidden";upgradePanel.setAttribute("role","dialog");upgradePanel.setAttribute("aria-modal","true");upgradePanel.setAttribute("aria-labelledby","upgradeTitle");upgradePanel.setAttribute("aria-describedby","upgradeSummary");upgradePanel.innerHTML='<h2 id="upgradeTitle"></h2><strong id="upgradePoints"></strong><output id="upgradeSummary" aria-live="polite" aria-atomic="true"></output><div><button id="upgradeHp" type="button"></button><button id="upgradeAttack" type="button"></button><button id="upgradeOxygen" type="button"></button></div><button id="upgradeDone" class="primary" type="button"></button>';$("diveField").append(upgradePanel);
  const quitPanel=document.createElement("section");quitPanel.id="quitPanel";quitPanel.className="quit-panel hidden";quitPanel.setAttribute("role","dialog");quitPanel.setAttribute("aria-modal","true");quitPanel.setAttribute("aria-labelledby","quitTitle");quitPanel.setAttribute("aria-describedby","quitCopy");quitPanel.innerHTML='<div class="quit-card"><h2 id="quitTitle"></h2><p id="quitCopy"></p><div><button id="quitKeep" class="primary" type="button"></button><button id="quitLeave" class="secondary" type="button"></button></div></div>';document.querySelector(".battle-canvas").append(quitPanel);
  const quitStylesheet=document.createElement("link");quitStylesheet.rel="stylesheet";quitStylesheet.href="quit-confirmation.css";document.head.append(quitStylesheet);
  function setFeedback(markup,label){const feedback=$("feedback");feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");feedback.setAttribute("aria-atomic","true");feedback.innerHTML=markup;feedback.setAttribute("aria-label",label);}
  function renderCoach(){
    $("coachStep1").innerHTML=`<div>${estimateMarkup(outcomes.relic)}</div><small>${t("coachVisual1")}</small>`;$("coachStep1").setAttribute("aria-label",t("coachStep1"));
    $("coachStep2").innerHTML=`<div><span>${icon("sonar")}<b>2</b></span><span>${icon("shield")}<b>1</b></span><span>${icon("pulse")}<b>1</b></span><em>=</em><span>${icon("power")}<b>4</b></span></div><small>${t("coachVisual2")}</small>`;$("coachStep2").setAttribute("aria-label",t("coachStep2"));
    $("coachStep3").innerHTML=`<div><b class="coach-arrow">←</b><img class="coach-nori" src="../../assets/animal-abyss-diver-nori.png" alt=""><b class="coach-arrow">→</b><em>→</em>${icon("surface")}</div><small>${t("coachVisual3")}</small>`;$("coachStep3").setAttribute("aria-label",t("coachStep3"));
  }
  const wallet = () => window.WeightPlayWallet?.read?.().diamonds ?? 0, persist = () => writeStorage(saveKey,JSON.stringify(save));
  let resultPrimaryAction=$("nextBtn"),resultDecisionCommitted=false;
  function ensureResultActions(){
    let actions=$("resultActions");
    if(!actions){
      actions=document.createElement("div");
      actions.id="resultActions";
      actions.className="result-actions";
      $("result").append(actions);
    }
    let replay=$("replayBtn");
    if(!replay){
      replay=document.createElement("button");
      replay.id="replayBtn";
      replay.type="button";
      replay.className="secondary";
    }
    [$("menuBtn"),$("nextBtn"),replay].forEach(button=>actions.append(button));
    return replay;
  }
  function commitResultDecision(action){if(resultDecisionCommitted||$("result").classList.contains("hidden"))return;resultDecisionCommitted=true;action();}
  function resultAnalyticsPayload(){
    const config=routeConfig();
    return{gameId:"animal-abyss-diver",game_version:GAME_VERSION,stage:state.route,mode:"mission",result:state.resultOutcome,won:state.resultOutcome==="clear",salvage:state.salvage,target:config.target,zones:config.zones,oxygen:state.oxygen,coins_earned:state.resultEarned};
  }
  function resultBackgroundNodes(){return [...document.querySelectorAll(".battle-canvas > :not(#result)")];}
  let activeScene="main",sceneGeneration=0;
  function sceneFrame(scene,callback){const generation=sceneGeneration;requestAnimationFrame(()=>{if(activeScene!==scene||sceneGeneration!==generation)return;callback();});}
  function setResultOwnership(active){resultBackgroundNodes().forEach(node=>{node.inert=active;if(active)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});if(active)sceneFrame("battle",()=>{if(!$('result').classList.contains('hidden'))resultPrimaryAction?.focus({preventScroll:true});});}
  function syncSoundToggle(activeViewport){const toggle=document.querySelector("button[data-sound-toggle]");if(toggle)toggle.style.setProperty("display",activeViewport?"none":"grid","important");}
  function show(id){const resultActive=id==="result",scene=id==="mainScreen"?"main":id==="stageScreen"?"stage":"battle",activeViewport=scene!=="main";if(scene!==activeScene){activeScene=scene;sceneGeneration+=1;}document.body.dataset.screen=scene;for(const name of ["main","stage","battle"])document.body.classList.toggle(`wp-shell-${name}-active`,name===scene);document.body.classList.toggle("wp-mobile-game-mode",activeViewport);document.documentElement.classList.toggle("wp-mobile-game-mode",activeViewport);syncSoundToggle(activeViewport);$("mainGroup").classList.toggle("hidden",scene!=="main");$("mainHeader").classList.toggle("hidden",scene!=="main");$("mainScreen").classList.toggle("hidden",scene!=="main");$("stageScreen").classList.toggle("hidden",scene!=="stage");$("battleShell").classList.toggle("hidden",scene!=="battle");$("result").classList.toggle("hidden",!resultActive);setResultOwnership(resultActive);dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:scene,generation:sceneGeneration}}));dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:scene,generation:sceneGeneration}}));dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:scene,generation:sceneGeneration}}));}
  function focusMain(){sceneFrame("main",()=>$('startBtn').focus({preventScroll:true}));}
  function focusCurrentDiveDecision(){
    const candidates=state.fishActive?[$("dodgeLeftBtn"),$("pulseBtn")]:[$("leftGate"),$("rightGate"),$("surfaceBtn")];
    const target=candidates.find(node=>node&&!node.disabled&&node.getAttribute("aria-disabled")!=="true"&&!node.classList.contains("hidden"))||$("helpBtn");
    sceneFrame("battle",()=>target?.focus({preventScroll:true}));
  }
  const ROUTE_POOL_SIZE=9;
  let selectedRoute=Math.max(1,state.route||save.unlocked),routeWindowStart=0,routeCardPool=[];
  function routeWindowLimit(){return Math.max(0,routes.length-ROUTE_POOL_SIZE);}
  function desiredRouteWindow(route){return Math.max(0,Math.min(routeWindowLimit(),route-1-Math.floor(ROUTE_POOL_SIZE/2)));}
  function bindRouteCard(card,index){const route=routes[index],n=index+1,locked=n>save.unlocked;const routeMeta=locale==="ar"?`${t("routeZones",{n:route.zones})} · ${t("routeTarget",{n:route.target})} · ${t("routeRisk",{n:route.risk})}`:`${t("zones",{n:route.zones})} · ${t("stageTarget",{n:route.target})} · ${t("risk",{n:route.risk})}`;card.dataset.route=String(n);card.setAttribute("aria-posinset",String(n));card.setAttribute("aria-setsize",String(routes.length));card.setAttribute("aria-disabled",String(locked));card.innerHTML=`<strong>${routeText(route,"name")}</strong><span>${t("route",{n})} · ${t("relic")}: ${routeText(route,"relic")}</span><small>${routeMeta}<br><b>${routeText(route,"rule")}</b></small><em>${t(locked?"locked":"routeAction")}</em>`;card.setAttribute("aria-label",`${t("route",{n})} · ${routeText(route,"name")} · ${routeText(route,"rule")} · ${locked?t("locked"):t("routeAction")}`);}
  function syncRouteCards(){routeCardPool.forEach(card=>{const n=Number(card.dataset.route),selected=n===selectedRoute;bindRouteCard(card,n-1);card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");card.tabIndex=selected?0:-1;card.classList.toggle("is-selected",selected);if(selected)card.setAttribute("aria-current","step");else card.removeAttribute("aria-current");});}
  function buildRoutePool(){const rail=$("routeRail");rail.innerHTML="";routeWindowStart=desiredRouteWindow(selectedRoute);routeCardPool=Array.from({length:Math.min(ROUTE_POOL_SIZE,routes.length)},(_,offset)=>{const card=document.createElement("button");card.type="button";card.className="route-card";bindRouteCard(card,routeWindowStart+offset);card.onclick=()=>{const n=Number(card.dataset.route);if(n<=save.unlocked)start(n);};rail.append(card);return card;});rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(routeCardPool.length);rail.dataset.wpStageTotal=String(routes.length);}
  function moveRouteWindow(target){const rail=$("routeRail");target=Math.max(0,Math.min(routeWindowLimit(),target));let recycled=0;while(routeWindowStart<target){const card=rail.firstElementChild;routeWindowStart++;rail.append(card);bindRouteCard(card,routeWindowStart+routeCardPool.length-1);recycled++;}while(routeWindowStart>target){const card=rail.lastElementChild;routeWindowStart--;rail.prepend(card);bindRouteCard(card,routeWindowStart);recycled++;}routeCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(routeWindowStart);rail.dataset.wpStageWindowEnd=String(routeWindowStart+routeCardPool.length-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled;}
  function selectRoute(route,{center=false,focus=false}={}){selectedRoute=Math.max(1,Math.min(routes.length,route));if(!routeCardPool.length)buildRoutePool();moveRouteWindow(desiredRouteWindow(selectedRoute));syncRouteCards();const card=$("routeRail").querySelector(`[data-route="${selectedRoute}"]`);if(center)card?.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});if(focus)card?.focus({preventScroll:true});}
  function focusRoute(route=state.route||save.unlocked){sceneFrame("stage",()=>selectRoute(route,{center:true,focus:true}));}
  function quitBackgroundNodes(){return [...document.querySelectorAll(".battle-canvas > :not(#quitPanel):not(#result)")];}
  function renderQuit(){
    const route=routes[Math.max(0,(state.route||1)-1)]||routes[0];
    $("quitTitle").textContent=t("quitTitle");
    $("quitCopy").textContent=t("quitCopy",{zone:state.zone||1,total:route.zones,salvage:state.salvage||0,target:route.target,oxygen:Math.max(0,Math.ceil(state.oxygen||0)),max:maxOxygen()});
    $("quitKeep").textContent=t("quitKeep");
    $("quitLeave").textContent=t("quitLeave");
  }
  function setQuit(open,{resume=false,focusBack=false}={}){
    if(open){
      clearBeaconConfirmation();
      renderBattle();
      renderQuit();
      suspendDiveAsync();
    }
    $("quitPanel").classList.toggle("hidden",!open);
    quitBackgroundNodes().forEach(node=>{node.inert=open;if(open)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});
    if(open){sceneFrame("battle",()=>{if(!$("quitPanel").classList.contains("hidden"))$("quitKeep").focus({preventScroll:true});});return;}
    if(resume)resumeDiveAsync();
    if(focusBack)$("battleBack").focus({preventScroll:true});
    else if(resume)focusCurrentDiveDecision();
  }
  function leaveDive(){
    setQuit(false);
    cancelDiveAsync();
    show("stageScreen");
    renderRoutes();
    focusRoute();
  }
  function renderRoutes(){if(!routeCardPool.length)buildRoutePool();selectRoute(selectedRoute,{center:true});}
  function routeConfig(){return routes[state.route-1];}
  function encounter(direction){const pair=routeConfig().encounters[state.zone-1];return outcomes[pair[direction==="left"?0:1]];}
  function sonarMessage(){return t("sonarRead",{left:t(encounter("left").label),right:t(encounter("right").label)});}
  const artFor = outcome => outcome.safe ? "../../assets/animal-abyss-diver-relics.png" : "../../assets/animal-abyss-diver-hazards.png";
  function syncProgressbar(id,label,current,maximum){
    const meter=$(id),now=Math.max(0,Math.min(maximum,Math.ceil(current)));
    meter.setAttribute("role","progressbar");
    meter.setAttribute("aria-label",label);
    meter.setAttribute("aria-valuemin","0");
    meter.setAttribute("aria-valuemax",String(maximum));
    meter.setAttribute("aria-valuenow",String(now));
    meter.setAttribute("aria-valuetext",`${label} ${now}/${maximum}`);
  }
  function renderBattle(){
    const config=routeConfig();
    const sonarCost=config.sonarCost??2,shieldCost=config.shieldCost??1,sonarJammed=config.jammedZones?.includes(state.zone),surfaceReady=!config.surfaceZones||config.surfaceZones.includes(state.zone);
    $("battleTitle").textContent=`${t("route",{n:state.route})} · ${routeText(config,"name")}`;
    $("battleTitle").title=routeText(config,"rule");
    $("zoneText").textContent=t("zoneProgress",{n:state.zone,total:config.zones});
    $("oxygenText").textContent=`${t("oxygenShort")} ${state.oxygen}/${maxOxygen()}`;
    $("oxygenBar").style.width=`${state.oxygen/maxOxygen()*100}%`;
    $("oxygenBar").classList.toggle("is-low",state.oxygen<=maxOxygen()*.3);
    syncProgressbar("oxygenText",t("oxygenShort"),state.oxygen,maxOxygen());
    $("diveField").classList.toggle("is-fish-combat",!!state.fishActive);
    const objectiveLabel=state.fishActive?t("fishObjective"):state.oxygen<=30?t("objectiveLow"):state.sonar?t("objectiveChoose"):state.zone===1?t("objectiveScan"):t("objectiveContinue");
    const objectiveMarkup=state.fishActive?`${icon("danger")}<strong>${t("shortReadAttack")}</strong>`:state.oxygen<=30?`${icon("oxygen")}<strong>${t("shortLow")}</strong>`:state.sonar?`${icon("sonar")}<strong>${t("shortConfirmed")}</strong>`:`<strong>${t("shortChoose")}</strong>`;
    $("objectiveText").innerHTML=`${objectiveMarkup}<small class="route-objective">${routeText(config,"rule")}</small>`;$("objectiveText").setAttribute("aria-label",`${routeText(config,"rule")} ${objectiveLabel}`);
    $("salvageText").innerHTML=`<span>${icon("salvage")}<em>${t("shortTarget")}</em><b>${state.salvage}/${config.target}</b></span><span>${icon("power")}<em>${t("shortPower")}</em><b>${state.battery}/4</b></span>`;$("salvageText").setAttribute("aria-label",`${t("target",{n:state.salvage,target:config.target})} · ${t("power",{n:state.battery})}`);
    const remainingZones=Math.max(0,config.zones-state.zone),targetReachedEarly=state.salvage>=config.target&&remainingZones>0,completionHint=$("completionHint");
    if(completionHint){completionHint.textContent=targetReachedEarly?t("completionRemaining",{remaining:remainingZones}):"";completionHint.classList.toggle("hidden",!targetReachedEarly);completionHint.setAttribute("aria-label",targetReachedEarly?t("completionRemaining",{remaining:remainingZones}):"");}
    $("depthProgress").style.width=`${((state.zone-1)/Math.max(1,config.zones-1))*100}%`;
    $("fxArt").classList.toggle("hidden",!state.sonar);
    $("diamondText").querySelector("b").textContent=wallet();
    const beaconBalance=wallet(),beaconAfter=Math.max(0,beaconBalance-3),beaconUseful=beaconCanRestore();
    if(!beaconUseful&&state.beaconPending)clearBeaconConfirmation();
    $("beaconBtn").innerHTML=`${icon("beacon")}<span>${t("shortBeacon")}</span><b>${state.beaconUsed?"✓":state.beaconPending?`${beaconBalance}→${beaconAfter}`:"3"}</b>`;
    $("beaconBtn").ariaLabel=state.beaconPending?t("beaconConfirmLabel",{before:beaconBalance,after:beaconAfter}):state.beaconUsed?t("beaconUsed"):beaconUseful?t("beacon"):t("beaconUnavailable");
    $("sonarBtn").innerHTML=`${icon("sonar")}<span>${t("shortScan")}</span><b>${sonarJammed?"×":sonarCost}</b>`;$("sonarBtn").ariaLabel=sonarJammed?routeText(config,"rule"):t("sonarPowered").replace("2",String(sonarCost));
    $("shieldBtn").innerHTML=`${icon("shield")}<span>${t("shortShield")}</span><b>${state.shieldArmed?"✓":shieldCost}</b>`;$("shieldBtn").ariaLabel=state.shieldArmed?t("shieldArmed"):t("shield").replace("1",String(shieldCost));
    $("surfaceBtn").innerHTML=`${icon("surface")}<span>${t("shortSurface")}</span><b>${surfaceReady?"":"×"}</b>`;$("surfaceBtn").ariaLabel=surfaceReady?t("surface"):routeText(config,"rule");
    for(const direction of ["left","right"]){
      const button=$(`${direction}Btn`),outcome=encounter(direction),blocked=state.busy||state.fishActive;
      const estimate=t("intel",outcome.intel),detail=state.sonar?t(outcome.label):`${t(outcome.signal)} · ${estimate}`;
      button.innerHTML=`<strong class="direction-arrow">${direction==="left"?"←":"→"}</strong><small>${t(direction==="left"?"shortLeft":"shortRight")}</small>`;
      button.classList.toggle("is-safe",state.sonar&&outcome.safe);
      button.classList.toggle("is-risk",state.sonar&&!outcome.safe);
      button.setAttribute("aria-label",`${t(direction)} - ${detail}`);
      button.disabled=!!blocked;
      const gate=$(`${direction}Gate`),image=gate.querySelector("img"),revealed=state.sonar||state.resolvingDirection===direction;
      let clues=gate.querySelector(".lane-clues");
      if(!clues){clues=document.createElement("span");clues.className="lane-clues";clues.setAttribute("aria-hidden","true");gate.insertBefore(clues,image);}
      clues.innerHTML=`<b>${t(outcome.signal)}</b><span>${t(outcome.clues[0])}</span><span>${t(outcome.clues[1])}</span>`;
      gate.setAttribute("role","button");gate.tabIndex=blocked?-1:0;gate.setAttribute("aria-disabled",blocked?"true":"false");gate.onclick=()=>{if(!blocked)move(direction);};
      gate.querySelector("strong").innerHTML=`${direction==="left"?"←":"→"}<em>${t(direction==="left"?"shortLeft":"shortRight")}</em>`;
      gate.querySelector("small").innerHTML=state.sonar?`<span class="exact-result">${outcome.salvage?`${icon("salvage")}<b>+${outcome.salvage}</b>`:""}${icon("oxygen")}<b>${outcome.oxygen>0?"+":""}${outcome.oxygen}</b></span>`:estimateMarkup(outcome);
      image.src=revealed?artFor(outcome):"../../assets/animal-abyss-diver-fx.png";
      gate.classList.toggle("is-revealed",revealed);
      gate.classList.toggle("is-safe",revealed&&outcome.safe);
      gate.classList.toggle("is-risk",revealed&&!outcome.safe);
      gate.setAttribute("aria-label",`${t(direction==="left"?"laneLeft":"laneRight")} · ${t(outcome.clues[0])} · ${t(outcome.clues[1])} · ${detail}`);
    }
    $("sonarBtn").disabled=sonarJammed||state.battery<sonarCost||!!state.busy||!!state.fishActive;
    $("shieldBtn").disabled=state.battery<shieldCost||state.shieldArmed||!!state.busy||!!state.fishActive;
    $("surfaceBtn").disabled=!surfaceReady||!!state.busy||!!state.fishActive;
    $("beaconBtn").disabled=!beaconUseful||!!state.busy;
  }
  let coachReturnFocus=null;
  function coachBackgroundNodes(){return [...document.querySelectorAll("#battleShell .battle-hud, #battleShell .objective, #battleShell .controls, #diveField > :not(#diveCoach)")];}
  function setCoach(open){
    const coach=$("diveCoach");
    if(open){const active=document.activeElement;coachReturnFocus=active instanceof HTMLElement&&$("battleShell").contains(active)?active:null;clearBeaconConfirmation();suspendDiveAsync();}
    coachBackgroundNodes().forEach(node=>{
      node.inert=open;
      if(open)node.setAttribute("aria-hidden","true");
      else node.removeAttribute("aria-hidden");
    });
    coach.classList.toggle("hidden",!open);
    if(!open)resumeDiveAsync();
    sceneFrame("battle",()=>{
      if(open){if(!coach.classList.contains("hidden"))$("coachStart").focus({preventScroll:true});return;}
      if(!coach.classList.contains("hidden"))return;
      const target=coachReturnFocus&&coachReturnFocus.isConnected&&coachReturnFocus.getClientRects().length?coachReturnFocus:$("leftGate");
      coachReturnFocus=null;
      target?.focus({preventScroll:true});
    });
  }
  function start(route){cancelDiveAsync();const config=routes[route-1];state={route,zone:1,oxygen:maxOxygen(),playerHp:maxHealth(),salvage:0,sonar:!!config.openingScan,battery:config.startBattery??4,shieldArmed:!!config.openingShield,beaconUsed:false,beaconPending:false,busy:false,fishActive:false,fishResolvedZones:[],safeStreak:0};show("battleShell");resetDiveField();$("fishEncounter").classList.add("hidden");$("fishEncounter").classList.remove("is-hit","is-countering","is-escaping");setUpgradeModal(false,false);renderBattle();setFeedback(`${icon(config.openingScan?"sonar":config.openingShield?"shield":"sonar")}<b>${config.openingScan||config.openingShield?"✓":"?"}</b>`,routeText(config,"rule"));playSound("start");setCoach(!save.tutorialDone);}
  function finish(mode){
    cancelDiveAsync();
    const config=routeConfig(),clear=mode==="clear",finalClear=clear&&state.route>=routes.length;
    const canAdvance=clear&&!finalClear,replayBtn=ensureResultActions();
    resultDecisionCommitted=false;
    resultPrimaryAction=canAdvance?$("nextBtn"):finalClear?$("menuBtn"):replayBtn;
    const earned=mode==="fail"||mode==="combat"?Math.floor(state.salvage/2):state.salvage+(clear?2:0);
    state.resultOutcome=mode;
    state.resultEarned=earned;
    const unlockedBefore=save.unlocked;
    save.coins+=earned;
    if(clear){save.rank+=1;save.unlocked=Math.max(save.unlocked,Math.min(routes.length,state.route+1));}
    persist();show("result");playSound(clear?"win":mode==="surface"?"success":"wrong");
    $("resultTitle").textContent=clear?t("clear"):mode==="combat"?t("combatDefeat"):mode==="fail"?t("oxygenLost"):mode==="miss"?t("missed"):t("partial");
    const copyKey=clear?"resultClear":mode==="combat"?"resultCombat":mode==="fail"?"resultFail":mode==="miss"?"resultMiss":"resultSurface";
    $("resultCopy").textContent=t(copyKey,{n:state.salvage,target:config.target,zones:config.zones});
    const remainingZones=Math.max(0,config.zones-state.zone),targetReachedEarly=state.salvage>=config.target&&remainingZones>0,resultCompletionHint=$("resultCompletionHint");
    if(resultCompletionHint){resultCompletionHint.textContent=targetReachedEarly?t("completionRemaining",{remaining:remainingZones}):"";resultCompletionHint.classList.toggle("hidden",!targetReachedEarly);}
    let routeEvidence=t("routeRetry",{target:config.target,zones:config.zones});
    if(finalClear)routeEvidence=t("routeComplete");
    else if(clear){const nextRoute=Math.min(routes.length,state.route+1),key=save.unlocked>unlockedBefore?"routeUnlocked":"routeReady";routeEvidence=t(key,{n:nextRoute,name:routeText(routes[nextRoute-1],"name")});}
    $("resultRewards").innerHTML=`<span>${t("coinsEarned",{n:earned})}</span><span>${t("coinsSaved",{n:save.coins})}</span><span>${t("rank",{n:save.rank})}</span><span>${routeEvidence}</span>`;
    $("menuBtn").textContent=t("routeSelect");$("nextBtn").textContent=t("next");replayBtn.textContent=t("retry");
    [$("menuBtn"),$("nextBtn"),replayBtn].forEach(button=>{button.classList.remove("hidden");button.classList.toggle("primary",button===resultPrimaryAction);button.classList.toggle("secondary",button!==resultPrimaryAction);});
    $("nextBtn").disabled=!canAdvance;$("menuBtn").disabled=false;replayBtn.disabled=false;
  }
  function resetDiveField(){const field=$("diveField");field.classList.remove("is-swimming","is-resolving","is-advancing");delete field.dataset.lane;delete state.resolvingDirection;$("impactText").classList.add("hidden");}
  function applyMove(direction){
    const config=routeConfig(),outcome=encounter(direction);
    let oxygenDelta=outcome.oxygen-(config.oxygenTax??0),shielded=false,salvageDelta=outcome.salvage;
    if(!outcome.safe&&state.shieldArmed){oxygenDelta=Math.ceil(oxygenDelta/2);state.shieldArmed=false;shielded=true;}
    state.oxygen=Math.max(0,Math.min(maxOxygen(),state.oxygen+oxygenDelta));
    if(outcome.safe){state.safeStreak+=1;if(config.streakEvery&&state.safeStreak%config.streakEvery===0)salvageDelta+=1;}
    else{state.safeStreak=0;if(config.fragileCargo)salvageDelta-=Math.min(state.salvage,config.fragileCargo);}
    state.salvage=Math.max(0,state.salvage+salvageDelta);
    let powerGain=outcome===outcomes.oxygen?(config.oxygenPower??1):0;
    if(outcome===outcomes.relic)powerGain+=config.relicPower??0;
    if(outcome===outcomes.current)powerGain+=config.currentPower??0;
    state.battery=Math.min(4,state.battery+powerGain);
    playSound(outcome.safe?(salvageDelta>0?"coin":"success"):"wrong");
    state.resolvingDirection=direction;
    setFeedback(`${salvageDelta?`${icon("salvage")}<b>${salvageDelta>0?"+":""}${salvageDelta}</b>`:""}${icon("oxygen")}<b>${oxygenDelta>0?"+":""}${oxygenDelta}</b>${powerGain?`${icon("power")}<b>+${powerGain}</b>`:""}${shielded?`${icon("shield")}<b>½</b>`:""}`,`${t(outcome.feedback)} ${routeText(config,"rule")}${shielded?` ${t("shieldBlock")}`:""}`);
    const impact=$("impactText");impact.textContent=`${salvageDelta?`${salvageDelta>0?"+":""}${salvageDelta} ${t("salvage",{n:""}).trim()}`:""}${salvageDelta&&oxygenDelta?" · ":""}${oxygenDelta>0?"+":""}${oxygenDelta} ${t("oxygenShort")}`;impact.classList.remove("hidden");
    $("diveField").classList.add("is-resolving");
    state.sonar=false;
    renderBattle();
    scheduleDive(()=>{
      if(state.oxygen<=0)return finish("fail");
      if(state.zone>=config.zones)return finish(state.salvage>=config.target?"clear":"miss");
      state.zone+=1;state.busy=false;resetDiveField();$("diveField").classList.add("is-advancing");
      if(shouldStartFish())startFishEncounter();else renderBattle();
      scheduleDive(()=>$("diveField").classList.remove("is-advancing"),420);
    },520);
  }
  function move(direction){
    clearBeaconConfirmation();
    if(state.busy)return;
    state.busy=true;
    const field=$("diveField");field.dataset.lane=direction;field.classList.add("is-swimming");
    setFeedback(`<b class="feedback-arrow">${direction==="left"?"←":"→"}</b>`,t("swimming",{lane:t(direction)}));
    renderBattle();
    scheduleDive(()=>applyMove(direction),520);
  }
  function shouldStartFish(){return routeConfig().fishZones.includes(state.zone)&&!state.fishResolvedZones.includes(state.zone);}
  function fishProfile(){
    const config=routeConfig(),tier=config.fishTier??1,shark=tier>=5;
    // Route 1's only fish is the combat tutorial. A fresh Nori should learn the
    // attack/counter rhythm with a healthy margin before later routes escalate.
    if(state.route===1&&state.zone===3)return{name:t("territorialFish"),maxHp:20,attack:4,xp:30};
    return{name:t(shark?"shark":"territorialFish"),maxHp:(shark?30:16)+tier*5+state.zone,attack:(shark?6:3)+tier+Math.floor(state.zone/3),xp:(shark?32:24)+tier*5};
  }
  function renderFish(){
    const fish=fishProfile(),blocked=!!state.fishBusy;
    $("fishEncounter").dataset.enemy=fish.name;
    $("fishTitle").innerHTML=`${icon("danger")}<span>${t("fishBattle")}</span>`;$("fishTitle").setAttribute("aria-label",`${t("fishBattle")}: ${fish.name}`);
    $("fishTell").innerHTML=`<strong>${fish.name}</strong><small>${levelText(state.route+state.zone)}</small>`;
    $("fishGuardText").innerHTML=`<span>${t("fishHp")}</span><b>${Math.max(0,state.fishHp)}/${state.fishMaxHp}</b>`;
    $("fishGuardBar").style.width=`${Math.max(0,state.fishHp/state.fishMaxHp*100)}%`;
    $("fishTimerText").innerHTML=`<span>${t("diverHp")}</span><b>${Math.max(0,state.playerHp)}/${maxHealth()}</b>`;
    $("fishTimerBar").style.animation="none";$("fishTimerBar").style.width=`${Math.max(0,state.playerHp/maxHealth()*100)}%`;
    syncProgressbar("fishGuardText",t("fishHp"),state.fishHp,state.fishMaxHp);
    syncProgressbar("fishTimerText",t("diverHp"),state.playerHp,maxHealth());
    $("dodgeLeftBtn").innerHTML=`${icon("danger")}<span>${t("attackAction")}</span><b>${diverAttack()}</b>`;$("dodgeLeftBtn").ariaLabel=`${t("attackAction")} ${diverAttack()}`;
    $("pulseBtn").innerHTML=`${icon("surface")}<span>${t("escapeAction")}</span>`;$("pulseBtn").ariaLabel=t("escapeAction");
    $("dodgeRightBtn").classList.add("hidden");$("dodgeLeftBtn").disabled=blocked;$("pulseBtn").disabled=blocked;
  }
  function startFishEncounter(){
    const fish=fishProfile();state.fishActive=true;state.fishBusy=false;state.fishHp=fish.maxHp;state.fishMaxHp=fish.maxHp;
    $("fishEncounter").classList.remove("hidden");renderFish();renderBattle();setFeedback(`${icon("danger")}<b>!</b>`,`${t("fishBattle")}: ${fish.name}`);
    sceneFrame("battle",() => $("dodgeLeftBtn").focus({preventScroll:true}));
  }
  function awardFishXp(amount){save.xp+=amount;let gained=0;while(save.xp>=xpNeeded()){save.xp-=xpNeeded();save.level+=1;save.statPoints+=1;gained+=1;}persist();return gained;}
  function statValue(stat){return stat==="hp"?maxHealth():stat==="attack"?diverAttack():maxOxygen();}
  function statStep(stat){return stat==="hp"?8:stat==="attack"?2:10;}
  function renderUpgrade(){
    $("upgradeTitle").textContent=t("upgradeTitle");
    $("upgradePoints").textContent=`${levelText(save.level)} · ${t("statPoints",{n:save.statPoints})}`;
    for(const [stat,id,key] of [["hp","upgradeHp","hpStat"],["attack","upgradeAttack","attackStat"],["oxygen","upgradeOxygen","oxygenStat"]]){
      const current=statValue(stat);
      $(id).textContent=t("statPreview",{name:t(key),current,next:current+statStep(stat)});
      $(id).disabled=save.statPoints<1;
    }
    $("upgradeSummary").textContent=lastUpgrade?t("upgradeApplied",{name:t(`${lastUpgrade.stat}Stat`),before:lastUpgrade.before,after:lastUpgrade.after}):t("upgradePrompt");
    $("upgradeDone").textContent=t("doneUpgrade");
    $("upgradeDone").disabled=save.statPoints>0;
  }
  function upgradeBackgroundNodes(){return [...document.querySelectorAll("#battleShell .battle-hud, #battleShell .objective, #battleShell .controls, #diveField > :not(#upgradePanel)")];}
  function setUpgradeModal(open,focusPrimary=true){
    $("upgradePanel").classList.toggle("hidden",!open);
    upgradeBackgroundNodes().forEach(node=>{node.inert=open;if(open)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});
    if(open&&focusPrimary)sceneFrame("battle",()=>{if(!$("upgradePanel").classList.contains("hidden"))$("upgradePanel").querySelector("button:not(:disabled)")?.focus({preventScroll:true});});
    if(!open&&focusPrimary)sceneFrame("battle",()=>{if($("upgradePanel").classList.contains("hidden"))$("leftGate").getAttribute("aria-disabled")!=="true"?$("leftGate").focus({preventScroll:true}):$("helpBtn").focus({preventScroll:true});});
  }
  function openUpgrade(){lastUpgrade=null;renderUpgrade();setUpgradeModal(true);}
  function allocateStat(stat){if(save.statPoints<1)return;const oldMaxHp=maxHealth(),oldMaxOxygen=maxOxygen(),before=statValue(stat);save.statPoints-=1;save.stats[stat]+=1;if(stat==="hp")state.playerHp+=maxHealth()-oldMaxHp;if(stat==="oxygen")state.oxygen=Math.min(maxOxygen(),state.oxygen+maxOxygen()-oldMaxOxygen);lastUpgrade={stat,before,after:statValue(stat)};persist();renderUpgrade();renderBattle();if(save.statPoints===0)$("upgradeDone").focus({preventScroll:true});}
  function winFish(){const fish=fishProfile(),config=routeConfig(),levels=awardFishXp(fish.xp),salvageGain=1+(config.fishBonus??0);state.fishActive=false;state.fishBusy=false;state.fishResolvedZones.push(state.zone);state.salvage+=salvageGain;state.battery=Math.min(4,state.battery+1);$("fishEncounter").classList.add("hidden");setFeedback(`${icon("salvage")}<b>+${salvageGain}</b><b>XP +${fish.xp}</b>`,`${t("fishWon")} ${routeText(config,"rule")} ${t("xpGain",{n:fish.xp})}${levels?` ${t("levelUp",{n:levels})}`:""}`);renderBattle();if(levels)openUpgrade();else sceneFrame("battle",() => $("leftGate").focus({preventScroll:true}));}
  function attackFish(){
    if(!state.fishActive||state.fishBusy)return;clearBeaconConfirmation();renderBattle();state.fishBusy=true;state.fishHp-=diverAttack();$("fishEncounter").classList.add("is-hit");setFeedback(`${icon("danger")}<b>-${diverAttack()}</b>`,t("attackAction"));renderFish();
    scheduleDive(()=>{$("fishEncounter").classList.remove("is-hit");if(state.fishHp<=0){winFish();return;}const fish=fishProfile();state.playerHp=Math.max(0,state.playerHp-fish.attack);$("fishEncounter").classList.add("is-countering");setFeedback(`<b>-${fish.attack}</b>`,t("fishStrikes"));renderFish();scheduleDive(()=>{$("fishEncounter").classList.remove("is-countering");if(state.playerHp<=0){finish("combat");return;}state.fishBusy=false;renderFish();},700);},650);
  }
  function escapeFish(){
    if(!state.fishActive||state.fishBusy)return;clearBeaconConfirmation();const cost=routeConfig().escapeCost??8;state.oxygen=Math.max(0,state.oxygen-cost);state.fishActive=false;state.fishResolvedZones.push(state.zone);$("fishEncounter").classList.add("is-escaping");setFeedback(`${icon("oxygen")}<b>-${cost}</b>`,t("fishEscaped",{n:cost}));scheduleDive(()=>{$("fishEncounter").classList.add("hidden");$("fishEncounter").classList.remove("is-escaping");renderBattle();if(state.oxygen<=0)finish("fail");else sceneFrame("battle",() => $("leftGate").focus({preventScroll:true}));},700);
  }
  function useBeacon(){
    if(state.beaconUsed)return;
    const restored=beaconRestoreTarget();
    if(state.oxygen>=restored){clearBeaconConfirmation();setFeedback(`${icon("beacon")}<b>${restored}</b>`,t("beaconUnavailable"));renderBattle();focusCurrentDiveDecision();return;}
    const balance=wallet();
    if(!state.beaconPending){
      if(balance<3){setFeedback(`${icon("beacon")}<b>3</b>`,t("beaconNeed"));return;}
      state.beaconPending=true;
      armBeaconConfirmation(5000);
      setFeedback(`${icon("beacon")}<b>${balance}→${balance-3}</b>`,t("beaconConfirmStatus",{before:balance,after:balance-3}));
      renderBattle();
      return;
    }
    window.clearTimeout(beaconConfirmTimer);
    beaconConfirmTimer=0;
    state.beaconPending=false;
    if(!window.WeightPlayWallet?.spendDiamonds?.(3)){setFeedback(`${icon("beacon")}<b>3</b>`,t("beaconNeed"));renderBattle();return;}
    state.beaconUsed=true;
    state.oxygen=Math.max(state.oxygen,restored);
    setFeedback(`${icon("beacon")}<b>✓</b>${icon("oxygen")}<b>${restored}</b>`,`${t("beaconUsed")}: ${t("beaconHelp")}`);
    window.WonderAnalytics?.track?.("diamond_spend",{sink:"abyss_emergency_beacon",amount:3,game_version:GAME_VERSION});
    renderBattle();
    focusCurrentDiveDecision();
  }
  function renderMainProgress(){$("progress").textContent=`${levelText(save.level)} · ${t("rank",{n:save.rank})} - ${t("coins",{n:save.coins})}`;}
  function localize(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} - WeightPlay`;$("title").textContent=t("title");$("languageLabel").textContent=t("language");$("localeSelect").value=locale;$("headline").textContent=t("headline");$("intro").textContent=t("intro");$("guideTitle").textContent=t("guideTitle");$("guideCopy").textContent=t("guideCopy");$("startBtn").textContent=t("start");$("stageTitle").textContent=t("stage");$("stageHint").textContent=t("stageHint");$("leftBtn").textContent=t("left");$("rightBtn").textContent=t("right");$("sonarBtn").textContent=t("sonarPowered");$("shieldBtn").textContent=t("shield");$("surfaceBtn").textContent=t("surface");$("coachTitle").textContent=t("coachTitle");$("coachStart").textContent=t("coachStart");renderCoach();$("helpBtn").ariaLabel=t("help");$("stageBack").ariaLabel=t("back");$("battleBack").ariaLabel=t("back");renderMainProgress();renderRoutes();if(state.route){renderBattle();if(state.fishActive)renderFish();if(!$("upgradePanel").classList.contains("hidden"))renderUpgrade();}}
  $("startBtn").onclick=()=>{show("stageScreen");renderRoutes();};$("stageBack").onclick=()=>show("mainScreen");$("battleBack").onclick=()=>{cancelDiveAsync();show("stageScreen");renderRoutes();};$("menuBtn").onclick=leaveDive;$("leftBtn").onclick=()=>move("left");$("rightBtn").onclick=()=>move("right");$("dodgeLeftBtn").onclick=attackFish;$("pulseBtn").onclick=escapeFish;$("helpBtn").onclick=()=>setCoach(true);$("coachStart").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});$("coachStart").onclick=()=>{save.tutorialDone=true;persist();setCoach(false);setFeedback(`${icon("sonar")}<b>?</b>`,t("objectiveScan"));};$("sonarBtn").onclick=()=>{if(state.sonar){setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());return;}if(state.battery<2){setFeedback(`${icon("power")}<b>0</b>`,t("sonarNeed"));return;}state.battery-=2;state.sonar=true;setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());renderBattle();};$("shieldBtn").onclick=()=>{if(state.shieldArmed)return;if(state.battery<1){setFeedback(`${icon("power")}<b>0</b>`,t("shieldNeed"));return;}state.battery-=1;state.shieldArmed=true;setFeedback(`${icon("shield")}<b>✓</b>`,t("shieldArmed"));renderBattle();focusCurrentDiveDecision();};$("surfaceBtn").onclick=()=>finish("surface");$("beaconBtn").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});$("beaconBtn").onclick=useBeacon;["upgradeHp","upgradeAttack","upgradeOxygen"].forEach(id=>$(id).addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();}));$("upgradeHp").onclick=()=>allocateStat("hp");$("upgradeAttack").onclick=()=>allocateStat("attack");$("upgradeOxygen").onclick=()=>allocateStat("oxygen");$("upgradeDone").onclick=()=>{setUpgradeModal(false);renderBattle();};$("localeSelect").onchange=(event)=>{locale=event.target.value;writeStorage("weightPlayLocale",locale);localize();};
  $("sonarBtn").onclick=()=>{const config=routeConfig(),cost=config.sonarCost??2;if(config.jammedZones?.includes(state.zone)){setFeedback(`${icon("sonar")}<b>×</b>`,routeText(config,"rule"));return;}if(state.sonar){setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());return;}if(state.battery<cost){setFeedback(`${icon("power")}<b>${state.battery}</b>`,t("sonarNeed").replace("2",String(cost)));return;}state.battery-=cost;state.sonar=true;setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());renderBattle();};
  $("shieldBtn").onclick=()=>{const config=routeConfig(),cost=config.shieldCost??1;if(state.shieldArmed)return;if(state.battery<cost){setFeedback(`${icon("power")}<b>${state.battery}</b>`,t("shieldNeed").replace("1",String(cost)));return;}state.battery-=cost;state.shieldArmed=true;setFeedback(`${icon("shield")}<b>✓</b>`,t("shieldArmed"));renderBattle();focusCurrentDiveDecision();};
  let mainEntryKeyboardKey="";
  const screenDecisionKeyboardKeys=new Set();
  document.addEventListener("keydown",event=>{if(event.repeat&&screenDecisionKeyboardKeys.has(event.key)){event.preventDefault();event.stopImmediatePropagation();}},true);
  $("startBtn").addEventListener("keydown",event=>{if(!event.repeat&&(event.key==="Enter"||event.key===" "))mainEntryKeyboardKey=event.key;});
  $("stageBack").addEventListener("keydown",event=>{if(!event.repeat&&(event.key==="Enter"||event.key===" "))screenDecisionKeyboardKeys.add(event.key);});
  $("startBtn").onclick=()=>{show("stageScreen");renderRoutes();focusRoute(save.unlocked);};
  $("stageBack").onclick=()=>{renderMainProgress();show("mainScreen");focusMain();};
  $("battleBack").onclick=()=>setQuit(true);
  $("quitKeep").onclick=()=>setQuit(false,{resume:true});
  $("quitLeave").onclick=leaveDive;
  ensureResultActions();
  $("menuBtn").onclick=()=>commitResultDecision(()=>{window.WonderAnalytics?.track?.("game_result_menu",resultAnalyticsPayload());leaveDive();});
  $("nextBtn").onclick=()=>commitResultDecision(()=>{const payload=resultAnalyticsPayload(),nextRoute=Math.min(routes.length,state.route+1);window.WonderAnalytics?.track?.("game_next_stage",{...payload,next_stage:nextRoute});start(nextRoute);});
  $("replayBtn").onclick=()=>commitResultDecision(()=>{window.WonderAnalytics?.track?.("game_restart",{...resultAnalyticsPayload(),source:"result"});start(state.route);});
  window.addEventListener("blur",()=>{windowFocused=false;suspendDiveAsync();});
  window.addEventListener("focus",()=>{windowFocused=true;resumeDiveAsync();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendDiveAsync();else if(windowFocused)resumeDiveAsync();});
  window.addEventListener("pagehide",suspendDiveAsync);
  window.addEventListener("pageshow",()=>{if(windowFocused)resumeDiveAsync();});
  $("upgradePanel").addEventListener("keydown",event=>{if($("upgradePanel").classList.contains("hidden"))return;if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key!=="Tab")return;const choices=[...$("upgradePanel").querySelectorAll("button:not(:disabled)")];if(!choices.length)return;const first=choices[0],last=choices.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  $("fishEncounter").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});
  $("result").addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key!=="Tab"||$("result").classList.contains("hidden"))return;const actions=[$("menuBtn"),$("nextBtn"),$("replayBtn")].filter(button=>!button.disabled&&!button.classList.contains("hidden"));if(!actions.length)return;event.preventDefault();const current=actions.indexOf(document.activeElement),index=event.shiftKey?(current<=0?actions.length-1:current-1):(current<0||current===actions.length-1?0:current+1);actions[index].focus({preventScroll:true});});
  $("quitPanel").addEventListener("keydown",event=>{if($("quitPanel").classList.contains("hidden"))return;if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key==="Escape"){event.preventDefault();setQuit(false,{resume:true,focusBack:true});return;}if(event.key!=="Tab")return;const first=$("quitKeep"),last=$("quitLeave");if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  for(const direction of ["left","right"]){$(`${direction}Gate`).addEventListener("keydown",event=>{if(event.key!=="Enter"&&event.key!==" ")return;event.preventDefault();if(event.repeat)return;if($(`${direction}Gate`).getAttribute("aria-disabled")!=="true")move(direction);});}
  const routeRail = $("routeRail");
  routeRail.addEventListener("keydown",event=>{
    if(mainEntryKeyboardKey&&event.repeat&&event.key===mainEntryKeyboardKey)event.preventDefault();
    const card=event.target.closest(".route-card");
    if(!card)return;
    if((event.key==="Enter"||event.key===" ")&&card.getAttribute("aria-disabled")==="true"){event.preventDefault();return;}
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const rtl=document.documentElement.dir==="rtl";
    const step=event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1);
    const current=Number(card.dataset.route),next=event.key==="Home"?1:event.key==="End"?routes.length:Math.max(1,Math.min(routes.length,current+step));
    selectRoute(next,{center:true,focus:true});
  });
  document.addEventListener("keyup",event=>{screenDecisionKeyboardKeys.delete(event.key);if(event.key===mainEntryKeyboardKey)mainEntryKeyboardKey="";});
  window.addEventListener("blur",()=>{screenDecisionKeyboardKeys.clear();mainEntryKeyboardKey="";});
  let routeDrag=null,routeSettle=0,suppressRouteClick=false;
  function positionRouteLogical(logical){logical=Math.max(1,Math.min(routes.length,logical));const anchor=Math.round(logical);selectRoute(anchor,{center:true});const pitch=276,rtl=document.documentElement.dir==="rtl"?-1:1;routeRail.scrollLeft+=(logical-anchor)*pitch*rtl;routeRail.dataset.wpStageDragLogical=logical.toFixed(4);return logical;}
  routeRail.dataset.wpStageVirtualDrag="true";routeRail.dataset.wpStageCenterObserver="manual";
  routeRail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(routeSettle);routeSettle=0;routeDrag={id:event.pointerId,startX:event.clientX,lastX:event.clientX,logical:selectedRoute,moved:false};routeRail.setPointerCapture?.(event.pointerId);routeRail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation();},true);
  document.addEventListener("pointermove",event=>{if(event.pointerId!==routeDrag?.id)return;const delta=event.clientX-routeDrag.lastX;routeDrag.lastX=event.clientX;if(!routeDrag.moved&&Math.abs(event.clientX-routeDrag.startX)>4)routeDrag.moved=true;if(routeDrag.moved){event.preventDefault();const rtl=document.documentElement.dir==="rtl"?-1:1;routeDrag.logical=positionRouteLogical(routeDrag.logical-delta*rtl/276);}event.stopImmediatePropagation();},true);
  const finishRouteDrag=event=>{if(event.pointerId!==routeDrag?.id)return;const drag=routeDrag;routeDrag=null;if(routeRail.hasPointerCapture?.(event.pointerId))routeRail.releasePointerCapture(event.pointerId);if(!drag.moved){routeRail.style.removeProperty("scroll-snap-type");const card=document.elementFromPoint(event.clientX,event.clientY)?.closest?.(".route-card"),n=Number(card?.dataset.route);if(card&&n<=save.unlocked){suppressRouteClick=true;setTimeout(()=>{suppressRouteClick=false;},0);start(n);}return;}event.preventDefault();const from=drag.logical,target=Math.round(from),started=performance.now();routeRail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.min(1,(now-started)/340),eased=progress*progress*(3-2*progress);positionRouteLogical(from+(target-from)*eased);if(progress<1)routeSettle=requestAnimationFrame(settle);else{routeSettle=0;selectRoute(target,{center:true});routeRail.style.removeProperty("scroll-snap-type");delete routeRail.dataset.wpStageSettling;}};routeSettle=requestAnimationFrame(settle);suppressRouteClick=true;setTimeout(()=>{suppressRouteClick=false;},0);event.stopImmediatePropagation();};
  document.addEventListener("pointerup",finishRouteDrag,true);document.addEventListener("pointercancel",finishRouteDrag,true);
  routeRail.addEventListener("click",event=>{const card=event.target.closest(".route-card");if(!card)return;if(suppressRouteClick){suppressRouteClick=false;event.preventDefault();event.stopImmediatePropagation();return;}const n=Number(card.dataset.route);if(n<=save.unlocked){event.preventDefault();event.stopImmediatePropagation();start(n);}},true);
  for(const id of ["sonarBtn","shieldBtn","helpBtn"]){$(id).addEventListener("click",clearBeaconConfirmation,{capture:true});}
  $("result")?.setAttribute("aria-describedby","resultCopy resultCompletionHint");
  if(new URLSearchParams(location.search).has("smoke"))window.__AbyssDiverSmoke={setOxygen(value){if(!state.route)return;clearBeaconConfirmation();state.oxygen=Math.max(0,Math.min(maxOxygen(),Math.round(value)));renderBattle();if(state.fishActive)renderFish();},beaconState(){return{pending:!!state?.beaconPending,remaining:beaconConfirmRemaining,wallet:wallet()};},seedProgress(patch={}){if(!patch||typeof patch!=="object")return;save=normalizeSave({...save,...patch,stats:{...save.stats,...(patch.stats||{})}});persist();renderMainProgress();}};
  localize();
  if(window.__AbyssDiverSmoke)Object.assign(window.__AbyssDiverSmoke,{
    catalog(){return routes.map((route,index)=>({number:index+1,name:route.name,zhName:route.zhName,relic:route.relic,zhRelic:route.zhRelic,rule:route.rule,zhRule:route.zhRule,zones:route.zones,target:route.target,fishZones:[...route.fishZones],encounters:route.encounters.map(pair=>[...pair]),mechanics:Object.fromEntries(Object.entries(route).filter(([key])=>!["name","zhName","relic","zhRelic","rule","zhRule","zones","target","risk","fishZones","fishTier","escapeCost","encounters"].includes(key)))}));},
    startRoute(number){start(Math.max(1,Math.min(routes.length,Math.trunc(number))));},
    setZone(number){if(!state.route)return;state.zone=Math.max(1,Math.min(routeConfig().zones,Math.trunc(number)));state.sonar=false;state.busy=false;renderBattle();},
    setSalvage(number){if(!state.route)return;state.salvage=Math.max(0,Math.trunc(number));renderBattle();},
    snapshot(){return{route:state.route,zone:state.zone,salvage:state.salvage,oxygen:state.oxygen,battery:state.battery,sonar:state.sonar,shieldArmed:state.shieldArmed,safeStreak:state.safeStreak};}
  });
  const lobbyLabels = {
    en: "Back to lobby",
    "zh-Hant": u("\\u8fd4\\u56de\\u5927\\u5ef3"),
    "zh-Hans": u("\\u8fd4\\u56de\\u5927\\u5385"),
    ja: "WeightPlayロビーに戻る",
    ko: "WeightPlay 로비로 돌아가기",
    es: "Volver al lobby de WeightPlay",
    "pt-BR": "Voltar ao lobby do WeightPlay",
    fr: "Retour au lobby WeightPlay",
    de: "Zur WeightPlay-Lobby zurück",
    it: "Torna alla lobby di WeightPlay",
    ru: u("\\u0412\\u0435\\u0440\\u043d\\u0443\\u0442\\u044c\\u0441\\u044f \\u0432 \\u043b\\u043e\\u0431\\u0431\\u0438 WeightPlay"),
    hi: u("WeightPlay \\u0932\\u0949\\u092c\\u0940 \\u092a\\u0930 \\u0932\\u094c\\u091f\\u0947\\u0902"),
    ar: u("\\u0627\\u0644\\u0639\\u0648\\u062f\\u0629 \\u0625\\u0644\\u0649 \\u0631\\u062f\\u0647\\u0629 WeightPlay")
  };
  function syncMetadata() {
    document.title = `${t("title")} - WeightPlay`;
    $("homeLink").ariaLabel = lobbyLabels[locale] || runtimeTranslate(lobbyLabels.en);
    document.querySelector("#pageDescription").content = t("intro");
  }
  syncMetadata();
  $("localeSelect").addEventListener("change", () => window.setTimeout(syncMetadata, 0));
})();
