(() => {
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
  const ROUTE_COUNT=30;
  const supportedLocales=new Set(["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"]);
  const gameOwnedLocales=new Set(["en","zh-Hant","zh-Hans"]);
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
      if(task.session===diveSession&&!diveSuspended)task.callback();
    },task.remaining);
  }
  function scheduleDive(callback,delay){
    const task={session:diveSession,callback,remaining:Math.max(0,delay),due:0,timer:0};
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
    diveTimers.forEach(task=>{if(task.session===diveSession&&!task.timer)armDiveTask(task);});
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
  const routeText=(route,key)=>{
    const template=isChinese()?route[`zh${key[0].toUpperCase()}${key.slice(1)}`]:route[key];
    return simplify(runtimeTranslate(template));
  };
  const t=(key,values={})=>simplify(format(runtimeTranslate((isChinese()?zh:en)[key]??key),values));
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
  function setFeedback(markup,label){$("feedback").innerHTML=markup;$("feedback").setAttribute("aria-label",label);}
  function renderCoach(){
    $("coachStep1").innerHTML=`<div>${estimateMarkup(outcomes.relic)}</div><small>${t("coachVisual1")}</small>`;$("coachStep1").setAttribute("aria-label",t("coachStep1"));
    $("coachStep2").innerHTML=`<div><span>${icon("sonar")}<b>2</b></span><span>${icon("shield")}<b>1</b></span><span>${icon("pulse")}<b>1</b></span><em>=</em><span>${icon("power")}<b>4</b></span></div><small>${t("coachVisual2")}</small>`;$("coachStep2").setAttribute("aria-label",t("coachStep2"));
    $("coachStep3").innerHTML=`<div><b class="coach-arrow">←</b><img class="coach-nori" src="../../assets/animal-abyss-diver-nori.png" alt=""><b class="coach-arrow">→</b><em>→</em>${icon("surface")}</div><small>${t("coachVisual3")}</small>`;$("coachStep3").setAttribute("aria-label",t("coachStep3"));
  }
  const wallet = () => window.WeightPlayWallet?.read?.().diamonds ?? 0, persist = () => writeStorage(saveKey,JSON.stringify(save));
  function resultBackgroundNodes(){return [...document.querySelectorAll(".battle-canvas > :not(#result)")];}
  function setResultOwnership(active){resultBackgroundNodes().forEach(node=>{node.inert=active;if(active)node.setAttribute("aria-hidden","true");else node.removeAttribute("aria-hidden");});if(active)requestAnimationFrame(()=>$('nextBtn').focus({preventScroll:true}));}
  function syncSoundToggle(activeViewport){const toggle=document.querySelector("button[data-sound-toggle]");if(toggle)toggle.style.setProperty("display",activeViewport?"none":"grid","important");}
  function show(id){const resultActive=id==="result",activeViewport=id!=="mainScreen";document.body.classList.toggle("wp-mobile-game-mode",activeViewport);document.documentElement.classList.toggle("wp-mobile-game-mode",activeViewport);syncSoundToggle(activeViewport);$("mainScreen").classList.toggle("hidden",id!=="mainScreen");$("stageScreen").classList.toggle("hidden",id!=="stageScreen");$("battleShell").classList.toggle("hidden",id!=="battleShell"&&!resultActive);$("result").classList.toggle("hidden",!resultActive);$("mainHeader").classList.toggle("hidden",id!=="mainScreen");setResultOwnership(resultActive);}
  function focusMain(){requestAnimationFrame(()=>$('startBtn').focus({preventScroll:true}));}
  function focusCurrentDiveDecision(){
    const candidates=state.fishActive?[$("dodgeLeftBtn"),$("pulseBtn")]:[$("leftGate"),$("rightGate"),$("surfaceBtn")];
    const target=candidates.find(node=>node&&!node.disabled&&node.getAttribute("aria-disabled")!=="true"&&!node.classList.contains("hidden"))||$("helpBtn");
    requestAnimationFrame(()=>target?.focus({preventScroll:true}));
  }
  function focusRoute(route=state.route){requestAnimationFrame(()=>{
    const cards=[...document.querySelectorAll("#routeRail .route-card:not(:disabled)")];
    const target=cards[Math.max(0,Math.min(cards.length-1,(route||1)-1))]||cards[0];
    document.querySelectorAll("#routeRail .route-card").forEach(card=>{const selected=card===target;card.classList.toggle("is-selected",selected);if(selected)card.setAttribute("aria-current","step");else card.removeAttribute("aria-current");});
    target?.focus({preventScroll:true});
  });}
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
    if(open){requestAnimationFrame(() => $("quitKeep").focus({preventScroll:true}));return;}
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
  function renderRoutes(){ $("routeRail").innerHTML=""; routes.forEach((route,index)=>{const n=index+1, card=document.createElement("button"),locked=n>save.unlocked;card.className=`route-card${n===state.route?" is-selected":""}`;card.disabled=locked;card.innerHTML=`<strong>${routeText(route,"name")}</strong><span>${t("route",{n})} · ${t("relic")}: ${routeText(route,"relic")}</span><small>${t("zones",{n:route.zones})} · ${t("stageTarget",{n:route.target})} · ${t("risk",{n:route.risk})}<br><b>${routeText(route,"rule")}</b></small><em>${t(locked?"locked":"routeAction")}</em>`;card.setAttribute("aria-label",`${t("route",{n})} · ${routeText(route,"name")} · ${routeText(route,"rule")} · ${locked?t("locked"):t("routeAction")}`);card.onclick=()=>start(n);$("routeRail").append(card);});}
  function routeConfig(){return routes[state.route-1];}
  function encounter(direction){const pair=routeConfig().encounters[state.zone-1];return outcomes[pair[direction==="left"?0:1]];}
  function sonarMessage(){return t("sonarRead",{left:t(encounter("left").label),right:t(encounter("right").label)});}
  const artFor = outcome => outcome.safe ? "../../assets/animal-abyss-diver-relics.png" : "../../assets/animal-abyss-diver-hazards.png";
  function renderBattle(){
    const config=routeConfig();
    const sonarCost=config.sonarCost??2,shieldCost=config.shieldCost??1,sonarJammed=config.jammedZones?.includes(state.zone),surfaceReady=!config.surfaceZones||config.surfaceZones.includes(state.zone);
    $("battleTitle").textContent=`${t("route",{n:state.route})} · ${routeText(config,"name")}`;
    $("battleTitle").title=routeText(config,"rule");
    $("zoneText").textContent=t("zoneProgress",{n:state.zone,total:config.zones});
    $("oxygenText").textContent=`${t("oxygenShort")} ${state.oxygen}/${maxOxygen()}`;
    $("oxygenBar").style.width=`${state.oxygen/maxOxygen()*100}%`;
    $("oxygenBar").classList.toggle("is-low",state.oxygen<=maxOxygen()*.3);
    $("diveField").classList.toggle("is-fish-combat",!!state.fishActive);
    const objectiveLabel=state.fishActive?t("fishObjective"):state.oxygen<=30?t("objectiveLow"):state.sonar?t("objectiveChoose"):state.zone===1?t("objectiveScan"):t("objectiveContinue");
    $("objectiveText").innerHTML=state.fishActive?`${icon("danger")}<strong>${t("shortReadAttack")}</strong>`:state.oxygen<=30?`${icon("oxygen")}<strong>${t("shortLow")}</strong>`:state.sonar?`${icon("sonar")}<strong>${t("shortConfirmed")}</strong>`:`<strong>${t("shortChoose")}</strong>`;$("objectiveText").setAttribute("aria-label",`${routeText(config,"rule")} ${objectiveLabel}`);
    $("salvageText").innerHTML=`<span>${icon("salvage")}<em>${t("shortTarget")}</em><b>${state.salvage}/${config.target}</b></span><span>${icon("power")}<em>${t("shortPower")}</em><b>${state.battery}/4</b></span>`;$("salvageText").setAttribute("aria-label",`${t("target",{n:state.salvage,target:config.target})} · ${t("power",{n:state.battery})}`);
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
    window.requestAnimationFrame(()=>{
      if(open){$("coachStart").focus({preventScroll:true});return;}
      const target=coachReturnFocus&&coachReturnFocus.isConnected&&coachReturnFocus.getClientRects().length?coachReturnFocus:$("leftGate");
      coachReturnFocus=null;
      target?.focus({preventScroll:true});
    });
  }
  function start(route){cancelDiveAsync();const config=routes[route-1];state={route,zone:1,oxygen:maxOxygen(),playerHp:maxHealth(),salvage:0,sonar:!!config.openingScan,battery:config.startBattery??4,shieldArmed:!!config.openingShield,beaconUsed:false,beaconPending:false,busy:false,fishActive:false,fishResolvedZones:[],safeStreak:0};show("battleShell");resetDiveField();$("fishEncounter").classList.add("hidden");$("fishEncounter").classList.remove("is-hit","is-countering","is-escaping");setUpgradeModal(false,false);renderBattle();setFeedback(`${icon(config.openingScan?"sonar":config.openingShield?"shield":"sonar")}<b>${config.openingScan||config.openingShield?"✓":"?"}</b>`,routeText(config,"rule"));playSound("start");setCoach(!save.tutorialDone);}
  function finish(mode){
    cancelDiveAsync();
    const config=routeConfig(),clear=mode==="clear",finalClear=clear&&state.route>=routes.length;
    const earned=mode==="fail"||mode==="combat"?Math.floor(state.salvage/2):state.salvage+(clear?2:0);
    const unlockedBefore=save.unlocked;
    save.coins+=earned;
    if(clear){save.rank+=1;save.unlocked=Math.max(save.unlocked,Math.min(routes.length,state.route+1));}
    persist();show("result");playSound(clear?"win":mode==="surface"?"success":"wrong");
    $("resultTitle").textContent=clear?t("clear"):mode==="combat"?t("combatDefeat"):mode==="fail"?t("oxygenLost"):mode==="miss"?t("missed"):t("partial");
    const copyKey=clear?"resultClear":mode==="combat"?"resultCombat":mode==="fail"?"resultFail":mode==="miss"?"resultMiss":"resultSurface";
    $("resultCopy").textContent=t(copyKey,{n:state.salvage,target:config.target,zones:config.zones});
    let routeEvidence=t("routeRetry",{target:config.target,zones:config.zones});
    if(finalClear)routeEvidence=t("routeComplete");
    else if(clear){const nextRoute=Math.min(routes.length,state.route+1),key=save.unlocked>unlockedBefore?"routeUnlocked":"routeReady";routeEvidence=t(key,{n:nextRoute,name:routeText(routes[nextRoute-1],"name")});}
    $("resultRewards").innerHTML=`<span>${t("coinsEarned",{n:earned})}</span><span>${t("coinsSaved",{n:save.coins})}</span><span>${t("rank",{n:save.rank})}</span><span>${routeEvidence}</span>`;
    $("nextBtn").textContent=finalClear?t("routeSelect"):clear?t("next"):t("retry");$("menuBtn").textContent=t("routeSelect");$("menuBtn").classList.toggle("hidden",finalClear);$("menuBtn").disabled=finalClear;
    $("nextBtn").onclick=()=>{if(!clear)return start(state.route);show("stageScreen");renderRoutes();focusRoute(finalClear?state.route:Math.min(routes.length,state.route+1));};
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
    $("fishTell").innerHTML=`<strong>${fish.name}</strong><small>Lv.${state.route+state.zone}</small>`;
    $("fishGuardText").innerHTML=`<span>${t("fishHp")}</span><b>${Math.max(0,state.fishHp)}/${state.fishMaxHp}</b>`;
    $("fishGuardBar").style.width=`${Math.max(0,state.fishHp/state.fishMaxHp*100)}%`;
    $("fishTimerText").innerHTML=`<span>${t("diverHp")}</span><b>${Math.max(0,state.playerHp)}/${maxHealth()}</b>`;
    $("fishTimerBar").style.animation="none";$("fishTimerBar").style.width=`${Math.max(0,state.playerHp/maxHealth()*100)}%`;
    $("dodgeLeftBtn").innerHTML=`${icon("danger")}<span>${t("attackAction")}</span><b>${diverAttack()}</b>`;$("dodgeLeftBtn").ariaLabel=`${t("attackAction")} ${diverAttack()}`;
    $("pulseBtn").innerHTML=`${icon("surface")}<span>${t("escapeAction")}</span>`;$("pulseBtn").ariaLabel=t("escapeAction");
    $("dodgeRightBtn").classList.add("hidden");$("dodgeLeftBtn").disabled=blocked;$("pulseBtn").disabled=blocked;
  }
  function startFishEncounter(){
    const fish=fishProfile();state.fishActive=true;state.fishBusy=false;state.fishHp=fish.maxHp;state.fishMaxHp=fish.maxHp;
    $("fishEncounter").classList.remove("hidden");renderFish();renderBattle();setFeedback(`${icon("danger")}<b>!</b>`,`${t("fishBattle")}: ${fish.name}`);
    requestAnimationFrame(() => $("dodgeLeftBtn").focus({preventScroll:true}));
  }
  function awardFishXp(amount){save.xp+=amount;let gained=0;while(save.xp>=xpNeeded()){save.xp-=xpNeeded();save.level+=1;save.statPoints+=1;gained+=1;}persist();return gained;}
  function statValue(stat){return stat==="hp"?maxHealth():stat==="attack"?diverAttack():maxOxygen();}
  function statStep(stat){return stat==="hp"?8:stat==="attack"?2:10;}
  function renderUpgrade(){
    $("upgradeTitle").textContent=t("upgradeTitle");
    $("upgradePoints").textContent=`Lv.${save.level} · ${t("statPoints",{n:save.statPoints})}`;
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
    if(open&&focusPrimary)requestAnimationFrame(()=>$("upgradePanel").querySelector("button:not(:disabled)")?.focus({preventScroll:true}));
    if(!open&&focusPrimary)requestAnimationFrame(()=>$("leftGate").getAttribute("aria-disabled")!=="true"?$("leftGate").focus({preventScroll:true}):$("helpBtn").focus({preventScroll:true}));
  }
  function openUpgrade(){lastUpgrade=null;renderUpgrade();setUpgradeModal(true);}
  function allocateStat(stat){if(save.statPoints<1)return;const oldMaxHp=maxHealth(),oldMaxOxygen=maxOxygen(),before=statValue(stat);save.statPoints-=1;save.stats[stat]+=1;if(stat==="hp")state.playerHp+=maxHealth()-oldMaxHp;if(stat==="oxygen")state.oxygen=Math.min(maxOxygen(),state.oxygen+maxOxygen()-oldMaxOxygen);lastUpgrade={stat,before,after:statValue(stat)};persist();renderUpgrade();renderBattle();if(save.statPoints===0)$("upgradeDone").focus({preventScroll:true});}
  function winFish(){const fish=fishProfile(),config=routeConfig(),levels=awardFishXp(fish.xp),salvageGain=1+(config.fishBonus??0);state.fishActive=false;state.fishBusy=false;state.fishResolvedZones.push(state.zone);state.salvage+=salvageGain;state.battery=Math.min(4,state.battery+1);$("fishEncounter").classList.add("hidden");setFeedback(`${icon("salvage")}<b>+${salvageGain}</b><b>XP +${fish.xp}</b>`,`${t("fishWon")} ${routeText(config,"rule")} ${t("xpGain",{n:fish.xp})}${levels?` ${t("levelUp",{n:levels})}`:""}`);renderBattle();if(levels)openUpgrade();else requestAnimationFrame(() => $("leftGate").focus({preventScroll:true}));}
  function attackFish(){
    if(!state.fishActive||state.fishBusy)return;clearBeaconConfirmation();renderBattle();state.fishBusy=true;state.fishHp-=diverAttack();$("fishEncounter").classList.add("is-hit");setFeedback(`${icon("danger")}<b>-${diverAttack()}</b>`,t("attackAction"));renderFish();
    scheduleDive(()=>{$("fishEncounter").classList.remove("is-hit");if(state.fishHp<=0){winFish();return;}const fish=fishProfile();state.playerHp=Math.max(0,state.playerHp-fish.attack);$("fishEncounter").classList.add("is-countering");setFeedback(`<b>-${fish.attack}</b>`,t("fishStrikes"));renderFish();scheduleDive(()=>{$("fishEncounter").classList.remove("is-countering");if(state.playerHp<=0){finish("combat");return;}state.fishBusy=false;renderFish();},700);},650);
  }
  function escapeFish(){
    if(!state.fishActive||state.fishBusy)return;clearBeaconConfirmation();const cost=routeConfig().escapeCost??8;state.oxygen=Math.max(0,state.oxygen-cost);state.fishActive=false;state.fishResolvedZones.push(state.zone);$("fishEncounter").classList.add("is-escaping");setFeedback(`${icon("oxygen")}<b>-${cost}</b>`,t("fishEscaped",{n:cost}));scheduleDive(()=>{$("fishEncounter").classList.add("hidden");$("fishEncounter").classList.remove("is-escaping");renderBattle();if(state.oxygen<=0)finish("fail");else requestAnimationFrame(() => $("leftGate").focus({preventScroll:true}));},700);
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
    window.WonderAnalytics?.track?.("diamond_spend",{sink:"abyss_emergency_beacon",amount:3});
    renderBattle();
    focusCurrentDiveDecision();
  }
  function renderMainProgress(){$("progress").textContent=`Lv.${save.level} · ${t("rank",{n:save.rank})} - ${t("coins",{n:save.coins})}`;}
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
  $("menuBtn").onclick=leaveDive;
  window.addEventListener("blur",()=>{windowFocused=false;suspendDiveAsync();});
  window.addEventListener("focus",()=>{windowFocused=true;resumeDiveAsync();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendDiveAsync();else if(windowFocused)resumeDiveAsync();});
  window.addEventListener("pagehide",suspendDiveAsync);
  window.addEventListener("pageshow",()=>{if(windowFocused)resumeDiveAsync();});
  $("upgradePanel").addEventListener("keydown",event=>{if($("upgradePanel").classList.contains("hidden"))return;if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key!=="Tab")return;const choices=[...$("upgradePanel").querySelectorAll("button:not(:disabled)")];if(!choices.length)return;const first=choices[0],last=choices.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  $("fishEncounter").addEventListener("keydown",event=>{if(event.repeat&&(event.key==="Enter"||event.key===" "))event.preventDefault();});
  $("result").addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key!=="Tab"||$("result").classList.contains("hidden"))return;const actions=[$("nextBtn"),$("menuBtn")].filter(button=>!button.disabled&&!button.classList.contains("hidden"));if(!actions.length)return;event.preventDefault();const current=actions.indexOf(document.activeElement),index=event.shiftKey?(current<=0?actions.length-1:current-1):(current<0||current===actions.length-1?0:current+1);actions[index].focus({preventScroll:true});});
  $("quitPanel").addEventListener("keydown",event=>{if($("quitPanel").classList.contains("hidden"))return;if(event.key==="Enter"||event.key===" "){if(event.repeat){event.preventDefault();return;}screenDecisionKeyboardKeys.add(event.key);}if(event.key==="Escape"){event.preventDefault();setQuit(false,{resume:true,focusBack:true});return;}if(event.key!=="Tab")return;const first=$("quitKeep"),last=$("quitLeave");if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  for(const direction of ["left","right"]){$(`${direction}Gate`).addEventListener("keydown",event=>{if(event.key!=="Enter"&&event.key!==" ")return;event.preventDefault();if(event.repeat)return;if($(`${direction}Gate`).getAttribute("aria-disabled")!=="true")move(direction);});}
  let drag;
  let suppressRouteClickUntil = 0;
  const routeRail = $("routeRail");
  routeRail.addEventListener("keydown",event=>{if(mainEntryKeyboardKey&&event.repeat&&event.key===mainEntryKeyboardKey)event.preventDefault();});
  document.addEventListener("keyup",event=>{screenDecisionKeyboardKeys.delete(event.key);if(event.key===mainEntryKeyboardKey)mainEntryKeyboardKey="";});
  window.addEventListener("blur",()=>{screenDecisionKeyboardKeys.clear();mainEntryKeyboardKey="";});
  function syncCenteredRouteSelection(){
    const cards=[...routeRail.querySelectorAll(".route-card")];
    if(!cards.length||!routeRail.getClientRects().length)return;
    const railRect=routeRail.getBoundingClientRect(),center=railRect.left+railRect.width/2;
    const nearest=cards.reduce((best,card)=>{const rect=card.getBoundingClientRect(),distance=Math.abs(rect.left+rect.width/2-center);return!best||distance<best.distance?{card,distance}:best;},null)?.card;
    cards.forEach(card=>{const selected=card===nearest;card.classList.toggle("is-selected",selected);if(selected)card.setAttribute("aria-current","step");else card.removeAttribute("aria-current");});
  }
  routeRail.addEventListener("wonder:stage-snap",()=>requestAnimationFrame(syncCenteredRouteSelection));
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
  for(const id of ["sonarBtn","shieldBtn","helpBtn"]){$(id).addEventListener("click",clearBeaconConfirmation,{capture:true});}
  localize();
  if(new URLSearchParams(location.search).has("smoke"))window.__AbyssDiverSmoke={setOxygen(value){if(!state.route)return;clearBeaconConfirmation();state.oxygen=Math.max(0,Math.min(maxOxygen(),Math.round(value)));renderBattle();if(state.fishActive)renderFish();},beaconState(){return{pending:!!state?.beaconPending,remaining:beaconConfirmRemaining,wallet:wallet()};}};
  if(window.__AbyssDiverSmoke)Object.assign(window.__AbyssDiverSmoke,{
    catalog(){return routes.map((route,index)=>({number:index+1,name:route.name,zhName:route.zhName,relic:route.relic,zhRelic:route.zhRelic,rule:route.rule,zhRule:route.zhRule,zones:route.zones,target:route.target,fishZones:[...route.fishZones],encounters:route.encounters.map(pair=>[...pair]),mechanics:Object.fromEntries(Object.entries(route).filter(([key])=>!["name","zhName","relic","zhRelic","rule","zhRule","zones","target","risk","fishZones","fishTier","escapeCost","encounters"].includes(key)))}));},
    startRoute(number){start(Math.max(1,Math.min(routes.length,Math.trunc(number))));},
    setZone(number){if(!state.route)return;state.zone=Math.max(1,Math.min(routeConfig().zones,Math.trunc(number)));state.sonar=false;state.busy=false;renderBattle();},
    setSalvage(number){if(!state.route)return;state.salvage=Math.max(0,Math.trunc(number));renderBattle();},
    snapshot(){return{route:state.route,zone:state.zone,salvage:state.salvage,oxygen:state.oxygen,battery:state.battery,sonar:state.sonar,shieldArmed:state.shieldArmed,safeStreak:state.safeStreak};}
  });
  const lobbyLabels = { en: "Back to lobby", "zh-Hant": u("\\u8fd4\\u56de\\u5927\\u5ef3"), "zh-Hans": u("\\u8fd4\\u56de\\u5927\\u5385") };
  function syncMetadata() {
    document.title = `${t("title")} - WeightPlay`;
    $("homeLink").ariaLabel = lobbyLabels[locale] || runtimeTranslate(lobbyLabels.en);
    document.querySelector("#pageDescription").content = t("intro");
  }
  syncMetadata();
  $("localeSelect").addEventListener("change", () => window.setTimeout(syncMetadata, 0));
})();
