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
    guideCopy:"Compare each lane's loot, danger, oxygen estimate, and environmental clues. Sonar, Shield, and fish counters share 4 power, so plan what to spend before surfacing.",
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
    retry:"Retry route"
  });
  Object.assign(zh, {
    guideCopy:"比較兩側的收益、危險、氧耗估計與環境線索。聲納、衝擊盾和魚戰反制共用 4 點電力，必須規劃消耗再決定何時上浮。",
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
    retry:u("\\u518d\\u8a66\\u4e00\\u6b21")
  });
  let locale = localStorage.getItem("weightPlayLocale") || "en"; let save = { rank:1, coins:0, unlocked:1, ...JSON.parse(localStorage.getItem(saveKey)||"{}") }; let state = {},fishClock;
  const routes = [
    {risk:1,zones:5,target:4,fishZones:[3],reaction:3200,encounters:[["relic","hazard"],["current","cache"],["oxygen","relic"],["cache","hazard"],["relic","current"]]},
    {risk:2,zones:6,target:6,fishZones:[3,5],reaction:2600,encounters:[["cache","hazard"],["current","relic"],["oxygen","cache"],["hazard","relic"],["cache","current"],["relic","hazard"]]},
    {risk:3,zones:7,target:8,fishZones:[2,4,6],reaction:2100,encounters:[["hazard","cache"],["relic","current"],["cache","hazard"],["oxygen","relic"],["hazard","cache"],["current","relic"],["cache","hazard"]]}
  ];
  const outcomes = {
    relic:{oxygen:-10,salvage:1,safe:true,intel:{loot:2,danger:1,cost:"8–14"},signal:"signalSteady",clues:["clueGlint","clueCalm"],label:"outcomeRelic",feedback:"foundRelic"},
    cache:{oxygen:-16,salvage:2,safe:true,intel:{loot:3,danger:2,cost:"14–22"},signal:"signalStrong",clues:["clueHeavy","clueScratches"],label:"outcomeCache",feedback:"foundCache"},
    oxygen:{oxygen:18,salvage:0,safe:true,intel:{loot:1,danger:1,cost:"+12–22"},signal:"signalSteady",clues:["clueBigBubbles","clueWarm"],label:"outcomeOxygen",feedback:"foundOxygen"},
    current:{oxygen:-18,salvage:0,safe:false,intel:{loot:1,danger:2,cost:"14–22"},signal:"signalRough",clues:["clueSand","clueFast"],label:"outcomeCurrent",feedback:"hitCurrent"},
    hazard:{oxygen:-28,salvage:0,safe:false,intel:{loot:2,danger:3,cost:"22–32"},signal:"signalStrong",clues:["clueRope","clueSilent"],label:"outcomeHazard",feedback:"hitHazard"}
  };
  const t = (key, values={}) => Object.entries(values).reduce((value,[name,replacement]) => value.replace(`{${name}}`,replacement),(locale === "zh-Hant" ? zh : en)[key]);
  const icon = name => `<i class="ui-icon icon-${name}" aria-hidden="true"></i>`;
  const pips = value => `<span class="pips" aria-hidden="true">${[1,2,3].map(n=>`<i class="${n<=value?"is-on":""}"></i>`).join("")}</span>`;
  const estimateMarkup = outcome => `<span class="metric">${icon("salvage")}<em>${t("shortLoot")}</em>${pips(outcome.intel.loot)}</span><span class="metric">${icon("danger")}<em>${t("shortDanger")}</em>${pips(outcome.intel.danger)}</span><span class="metric metric-oxygen">${icon("oxygen")}<em>${t("shortOxygen")}</em><b>${outcome.intel.cost}</b></span>`;
  function setFeedback(markup,label){$("feedback").innerHTML=markup;$("feedback").setAttribute("aria-label",label);}
  function renderCoach(){
    $("coachStep1").innerHTML=`<div>${estimateMarkup(outcomes.relic)}</div><small>${t("coachVisual1")}</small>`;$("coachStep1").setAttribute("aria-label",t("coachStep1"));
    $("coachStep2").innerHTML=`<div><span>${icon("sonar")}<b>2</b></span><span>${icon("shield")}<b>1</b></span><span>${icon("pulse")}<b>1</b></span><em>=</em><span>${icon("power")}<b>4</b></span></div><small>${t("coachVisual2")}</small>`;$("coachStep2").setAttribute("aria-label",t("coachStep2"));
    $("coachStep3").innerHTML=`<div><b class="coach-arrow">←</b><img class="coach-nori" src="../../assets/animal-abyss-diver-nori.png" alt=""><b class="coach-arrow">→</b><em>→</em>${icon("surface")}</div><small>${t("coachVisual3")}</small>`;$("coachStep3").setAttribute("aria-label",t("coachStep3"));
  }
  const wallet = () => window.WeightPlayWallet?.read?.().diamonds ?? 0, persist = () => localStorage.setItem(saveKey,JSON.stringify(save));
  function show(id){const resultActive=id==="result";$("mainScreen").classList.toggle("hidden",id!=="mainScreen");$("stageScreen").classList.toggle("hidden",id!=="stageScreen");$("battleShell").classList.toggle("hidden",id!=="battleShell"&&!resultActive);$("result").classList.toggle("hidden",!resultActive);$("mainHeader").classList.toggle("hidden",id!=="mainScreen");}
  function renderRoutes(){ $("routeRail").innerHTML=""; routes.forEach((route,index)=>{const n=index+1, card=document.createElement("button"),locked=n>save.unlocked;card.className=`route-card${n===state.route?" is-selected":""}`;card.disabled=locked;card.innerHTML=`<strong>${t("route",{n})}</strong><span>${t("relic")}: ${(locale === "zh-Hant" ? zh : en).relicNames[index]}</span><small>${t("zones",{n:route.zones})} · ${t("stageTarget",{n:route.target})} · ${t("risk",{n:route.risk})}</small><em>${t(locked?"locked":"routeAction")}</em>`;card.onclick=()=>start(n);$("routeRail").append(card);});}
  function routeConfig(){return routes[state.route-1];}
  function encounter(direction){const pair=routeConfig().encounters[state.zone-1];return outcomes[pair[direction==="left"?0:1]];}
  function sonarMessage(){return t("sonarRead",{left:t(encounter("left").label),right:t(encounter("right").label)});}
  const artFor = outcome => outcome.safe ? "../../assets/animal-abyss-diver-relics.png" : "../../assets/animal-abyss-diver-hazards.png";
  function renderBattle(){
    const config=routeConfig();
    $("battleTitle").textContent=t("route",{n:state.route});
    $("zoneText").textContent=t("zoneProgress",{n:state.zone,total:config.zones});
    $("oxygenText").textContent=`${t("oxygenShort")} ${state.oxygen}%`;
    $("oxygenBar").style.width=`${state.oxygen}%`;
    $("oxygenBar").classList.toggle("is-low",state.oxygen<=30);
    const objectiveLabel=state.fishActive?t("fishObjective"):state.oxygen<=30?t("objectiveLow"):state.sonar?t("objectiveChoose"):state.zone===1?t("objectiveScan"):t("objectiveContinue");
    $("objectiveText").innerHTML=state.fishActive?`${icon("danger")}<strong>${t("shortReadAttack")}</strong>`:state.oxygen<=30?`${icon("oxygen")}<strong>${t("shortLow")}</strong>`:state.sonar?`${icon("sonar")}<strong>${t("shortConfirmed")}</strong>`:`<strong>${t("shortChoose")}</strong>`;$("objectiveText").setAttribute("aria-label",objectiveLabel);
    $("salvageText").innerHTML=`<span>${icon("salvage")}<em>${t("shortTarget")}</em><b>${state.salvage}/${config.target}</b></span><span>${icon("power")}<em>${t("shortPower")}</em><b>${state.battery}/4</b></span>`;$("salvageText").setAttribute("aria-label",`${t("target",{n:state.salvage,target:config.target})} · ${t("power",{n:state.battery})}`);
    $("depthProgress").style.width=`${((state.zone-1)/Math.max(1,config.zones-1))*100}%`;
    $("fxArt").classList.toggle("hidden",!state.sonar);
    $("diamondText").querySelector("b").textContent=wallet();
    $("beaconBtn").innerHTML=`${icon("beacon")}<span>${t("shortBeacon")}</span><b>${state.beaconUsed?"✓":"3"}</b>`;$("beaconBtn").ariaLabel=state.beaconUsed?t("beaconUsed"):t("beacon");
    $("beaconBtn").disabled=state.beaconUsed;
    $("sonarBtn").innerHTML=`${icon("sonar")}<span>${t("shortScan")}</span><b>2</b>`;$("sonarBtn").ariaLabel=t("sonarPowered");
    $("shieldBtn").innerHTML=`${icon("shield")}<span>${t("shortShield")}</span><b>${state.shieldArmed?"✓":"1"}</b>`;$("shieldBtn").ariaLabel=state.shieldArmed?t("shieldArmed"):t("shield");
    $("surfaceBtn").innerHTML=`${icon("surface")}<span>${t("shortSurface")}</span>`;$("surfaceBtn").ariaLabel=t("surface");
    for(const direction of ["left","right"]){
      const button=$(`${direction}Btn`),outcome=encounter(direction),blocked=state.busy||state.fishActive;
      const estimate=t("intel",outcome.intel),detail=state.sonar?t(outcome.label):`${t(outcome.signal)} · ${estimate}`;
      button.innerHTML=`<strong class="direction-arrow">${direction==="left"?"←":"→"}</strong><small>${t(direction==="left"?"shortLeft":"shortRight")}</small>`;
      button.classList.toggle("is-safe",state.sonar&&outcome.safe);
      button.classList.toggle("is-risk",state.sonar&&!outcome.safe);
      button.setAttribute("aria-label",`${t(direction)} - ${detail}`);
      button.disabled=!!blocked;
      const gate=$(`${direction}Gate`),image=gate.querySelector("img"),revealed=state.sonar||state.resolvingDirection===direction;
      gate.querySelector("strong").innerHTML=`${direction==="left"?"←":"→"}<em>${t(direction==="left"?"shortLeft":"shortRight")}</em>`;
      gate.querySelector("small").innerHTML=state.sonar?`<span class="exact-result">${outcome.salvage?`${icon("salvage")}<b>+${outcome.salvage}</b>`:""}${icon("oxygen")}<b>${outcome.oxygen>0?"+":""}${outcome.oxygen}</b></span>`:estimateMarkup(outcome);
      image.src=revealed?artFor(outcome):"../../assets/animal-abyss-diver-fx.png";
      gate.classList.toggle("is-revealed",revealed);
      gate.classList.toggle("is-safe",revealed&&outcome.safe);
      gate.classList.toggle("is-risk",revealed&&!outcome.safe);
      gate.setAttribute("aria-label",`${t(direction==="left"?"laneLeft":"laneRight")} · ${t(outcome.clues[0])} · ${t(outcome.clues[1])} · ${detail}`);
    }
    $("sonarBtn").disabled=state.battery<2||!!state.busy||!!state.fishActive;
    $("shieldBtn").disabled=state.battery<1||state.shieldArmed||!!state.busy||!!state.fishActive;
    $("surfaceBtn").disabled=!!state.busy;
    $("beaconBtn").disabled=state.beaconUsed||!!state.busy;
  }
  function setCoach(open){$("diveCoach").classList.toggle("hidden",!open);}
  function start(route){window.clearTimeout(fishClock);state={route,zone:1,oxygen:100,salvage:0,sonar:false,battery:4,shieldArmed:false,beaconUsed:false,busy:false,fishActive:false,fishResolvedZones:[]};show("battleShell");resetDiveField();$("fishEncounter").classList.add("hidden");renderBattle();setFeedback(`${icon("sonar")}<b>?</b>`,t("objectiveScan"));setCoach(!save.tutorialDone);}
  function finish(mode){
    window.clearTimeout(fishClock);
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
  function resetDiveField(){const field=$("diveField");field.classList.remove("is-swimming","is-resolving","is-advancing");delete field.dataset.lane;delete state.resolvingDirection;$("impactText").classList.add("hidden");}
  function applyMove(direction){
    const config=routeConfig(),outcome=encounter(direction);
    let oxygenDelta=outcome.oxygen,shielded=false;
    if(!outcome.safe&&state.shieldArmed){oxygenDelta=Math.ceil(oxygenDelta/2);state.shieldArmed=false;shielded=true;}
    state.oxygen=Math.max(0,Math.min(100,state.oxygen+oxygenDelta));
    if(outcome===outcomes.oxygen)state.battery=Math.min(4,state.battery+1);
    state.salvage+=outcome.salvage;
    state.resolvingDirection=direction;
    setFeedback(`${outcome.salvage?`${icon("salvage")}<b>+${outcome.salvage}</b>`:""}${icon("oxygen")}<b>${oxygenDelta>0?"+":""}${oxygenDelta}</b>${shielded?`${icon("shield")}<b>½</b>`:""}`,`${t(outcome.feedback)}${shielded?` ${t("shieldBlock")}`:""}`);
    const impact=$("impactText");impact.textContent=`${outcome.salvage?`+${outcome.salvage} ${t("salvage",{n:""}).trim()}`:""}${outcome.salvage&&oxygenDelta?" · ":""}${oxygenDelta>0?"+":""}${oxygenDelta} ${t("oxygenShort")}`;impact.classList.remove("hidden");
    $("diveField").classList.add("is-resolving");
    state.sonar=false;
    renderBattle();
    window.setTimeout(()=>{
      if(state.oxygen<=0)return finish("fail");
      if(state.zone>=config.zones)return finish(state.salvage>=config.target?"clear":"miss");
      state.zone+=1;state.busy=false;resetDiveField();$("diveField").classList.add("is-advancing");
      if(shouldStartFish())startFishEncounter();else renderBattle();
      window.setTimeout(()=>$("diveField").classList.remove("is-advancing"),420);
    },520);
  }
  function move(direction){
    if(state.busy)return;
    state.busy=true;
    const field=$("diveField");field.dataset.lane=direction;field.classList.add("is-swimming");
    setFeedback(`<b class="feedback-arrow">${direction==="left"?"←":"→"}</b>`,t("swimming",{lane:t(direction)}));
    renderBattle();
    window.setTimeout(()=>applyMove(direction),520);
  }
  function shouldStartFish(){return routeConfig().fishZones.includes(state.zone)&&!state.fishResolvedZones.includes(state.zone);}
  function fishPattern(){const patterns=["left","glow","right","glow","left","right"];return patterns[(state.route+state.zone+state.fishStep)%patterns.length];}
  function renderFish(){
    const attack=state.fishAttack,blocked=!!state.fishBusy;
    $("fishEncounter").dataset.attack=attack;
    for(const kind of ["left","right","glow"])$("fishSprite").classList.toggle(`attack-${kind}`,attack===kind);
    $("fishTitle").innerHTML=`${icon("danger")}<span>${t("shortReadAttack")}</span>`;$("fishTitle").setAttribute("aria-label",t("fishTitle"));
    $("fishTell").innerHTML=attack==="glow"?`${icon("pulse")}<strong>${t("shortShockwave")}</strong>`:`<b class="attack-arrow">${attack==="left"?"←":"→"}</b><strong>${t(attack==="left"?"shortLeftCharge":"shortRightCharge")}</strong>`;$("fishTell").setAttribute("aria-label",t(attack==="glow"?"fishTellGlow":attack==="left"?"fishTellLeft":"fishTellRight"));
    $("fishGuardText").innerHTML=`${icon("shield")}<b>${state.fishWins}/3</b>`;$("fishGuardText").setAttribute("aria-label",t("fishGuard",{n:state.fishWins}));
    $("fishGuardBar").style.width=`${state.fishWins*100/3}%`;
    $("fishTimerText").textContent="";$("fishTimerText").setAttribute("aria-label",t("fishTimer"));
    $("dodgeLeftBtn").innerHTML=`<b>←</b><span>${t("shortDodgeLeft")}</span>`;$("dodgeLeftBtn").ariaLabel=t("dodgeLeft");
    $("pulseBtn").innerHTML=`${icon("pulse")}<span>${t("shortCounter")}</span><b>1</b>`;$("pulseBtn").ariaLabel=t("pulse");
    $("dodgeRightBtn").innerHTML=`<b>→</b><span>${t("shortDodgeRight")}</span>`;$("dodgeRightBtn").ariaLabel=t("dodgeRight");
    $("dodgeLeftBtn").disabled=blocked;$("dodgeRightBtn").disabled=blocked;$("pulseBtn").disabled=blocked||state.battery<1;
  }
  function startFishClock(){
    window.clearTimeout(fishClock);if(!state.fishActive||state.fishBusy||state.fishPaused)return;
    const duration=routeConfig().reaction,bar=$("fishTimerBar");bar.style.animation="none";void bar.offsetWidth;bar.style.animation=`fish-countdown ${duration}ms linear forwards`;
    fishClock=window.setTimeout(()=>resolveFishAttack(false,"fishTimeout"),duration);
  }
  function startFishEncounter(){
    state.fishActive=true;state.fishBusy=false;state.fishPaused=false;state.fishWins=0;state.fishStep=0;state.fishAttack=fishPattern();
    $("fishEncounter").classList.remove("hidden");renderFish();renderBattle();startFishClock();
  }
  function resolveFishAttack(correct,feedbackKey){
    if(!state.fishActive||state.fishBusy)return;
    window.clearTimeout(fishClock);state.fishBusy=true;
    if(correct){state.fishWins+=1;setFeedback(`<b>✓</b>${feedbackKey==="fishPulsed"?icon("pulse"):icon("shield")}`,t(feedbackKey));$("fishEncounter").classList.add("is-dodged");}
    else{state.oxygen=Math.max(0,state.oxygen-12);setFeedback(`${icon("oxygen")}<b>-12</b>`,t(feedbackKey));$("fishEncounter").classList.add("is-hit");}
    renderBattle();renderFish();
    window.setTimeout(()=>{
      $("fishEncounter").classList.remove("is-dodged","is-hit");
      if(state.oxygen<=0)return finish("fail");
      if(state.fishWins>=3){state.fishActive=false;state.fishBusy=false;state.fishResolvedZones.push(state.zone);state.salvage+=1;state.battery=Math.min(4,state.battery+1);$("fishEncounter").classList.add("hidden");setFeedback(`${icon("salvage")}<b>+1</b>${icon("power")}<b>+1</b>`,t("fishCleared"));renderBattle();return;}
      state.fishStep+=1;state.fishAttack=fishPattern();state.fishBusy=false;renderFish();startFishClock();
    },520);
  }
  function dodgeFish(action){
    if(!state.fishActive||state.fishBusy)return;
    if(action==="pulse"&&state.battery<1){setFeedback(`${icon("power")}<b>0</b>`,t("pulseNeed"));return;}
    if(action==="pulse")state.battery-=1;
    const correct=state.fishAttack==="glow"?action==="pulse":action!=="pulse"&&action!==state.fishAttack;
    resolveFishAttack(correct,correct?(action==="pulse"?"fishPulsed":"fishDodged"):"fishHit");
  }
  function localize(){document.documentElement.lang=locale;document.title=`${t("title")} - Internal Trial`;$("title").textContent=t("title");$("languageLabel").textContent=t("language");$("localeSelect").value=locale;$("headline").textContent=t("headline");$("intro").textContent=t("intro");$("guideTitle").textContent=t("guideTitle");$("guideCopy").textContent=t("guideCopy");$("startBtn").textContent=t("start");$("stageTitle").textContent=t("stage");$("stageHint").textContent=t("stageHint");$("leftBtn").textContent=t("left");$("rightBtn").textContent=t("right");$("sonarBtn").textContent=t("sonarPowered");$("shieldBtn").textContent=t("shield");$("surfaceBtn").textContent=t("surface");$("coachTitle").textContent=t("coachTitle");$("coachStart").textContent=t("coachStart");renderCoach();$("helpBtn").ariaLabel=t("help");$("stageBack").ariaLabel=t("back");$("battleBack").ariaLabel=t("back");$("progress").textContent=`${t("rank",{n:save.rank})} - ${t("coins",{n:save.coins})}`;renderRoutes();if(state.route){renderBattle();if(state.fishActive)renderFish();}}
  $("startBtn").onclick=()=>{show("stageScreen");renderRoutes();};$("stageBack").onclick=()=>show("mainScreen");$("battleBack").onclick=()=>{window.clearTimeout(fishClock);show("stageScreen");renderRoutes();};$("menuBtn").onclick=()=>show("mainScreen");$("leftBtn").onclick=()=>move("left");$("rightBtn").onclick=()=>move("right");$("dodgeLeftBtn").onclick=()=>dodgeFish("left");$("pulseBtn").onclick=()=>dodgeFish("pulse");$("dodgeRightBtn").onclick=()=>dodgeFish("right");$("helpBtn").onclick=()=>{if(state.fishActive){window.clearTimeout(fishClock);state.fishPaused=true;$("fishTimerBar").style.animationPlayState="paused";}setCoach(true);};$("coachStart").onclick=()=>{save.tutorialDone=true;persist();setCoach(false);setFeedback(`${icon("sonar")}<b>?</b>`,t("objectiveScan"));if(state.fishActive){state.fishPaused=false;startFishClock();}};$("sonarBtn").onclick=()=>{if(state.sonar){setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());return;}if(state.battery<2){setFeedback(`${icon("power")}<b>0</b>`,t("sonarNeed"));return;}state.battery-=2;state.sonar=true;setFeedback(`${icon("sonar")}<b>✓</b>`,sonarMessage());renderBattle();};$("shieldBtn").onclick=()=>{if(state.shieldArmed)return;if(state.battery<1){setFeedback(`${icon("power")}<b>0</b>`,t("shieldNeed"));return;}state.battery-=1;state.shieldArmed=true;setFeedback(`${icon("shield")}<b>✓</b>`,t("shieldArmed"));renderBattle();};$("surfaceBtn").onclick=()=>finish("surface");$("beaconBtn").onclick=()=>{if(state.beaconUsed)return;if(!window.WeightPlayWallet?.spendDiamonds?.(3)){setFeedback(`${icon("beacon")}<b>3</b>`,t("beaconNeed"));return;}state.beaconUsed=true;state.oxygen=Math.max(state.oxygen,30);setFeedback(`${icon("beacon")}<b>✓</b>${icon("oxygen")}<b>30</b>`,`${t("beaconUsed")}: ${t("beaconHelp")}`);window.WonderAnalytics?.track?.("diamond_spend",{sink:"abyss_emergency_beacon",amount:3});renderBattle();};$("localeSelect").onchange=(event)=>{locale=event.target.value;localStorage.setItem("weightPlayLocale",locale);localize();};
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
