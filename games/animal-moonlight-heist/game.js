(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = "weightplay_moonlight_heist_v1";
  const localeKey = "weightplayLocale";
  const copy = {
    en:{title:"Animal Moonlight Heist",internal:"Moon Archive Missions",pitch:"Read the patrols, recover the relic, and choose when to extract.",start:"Choose Mission",missions:"Moon Archive",chooseGadget:"Choose Gadget",alert:"Alert",holdRoute:"Hold to preview a route.",objective:"Recover the mission object",locked:"Complete the previous mission",retry:"Retry",next:"Next Mission",victory:"Mission Complete",captured:"Captured",capturedText:"The patrol raised the alarm. Retry is free.",treasure:"Bonus treasure recovered",extraction:"Reach the extraction gate",dash:"Lightning Dash",decoy:"Star Decoy",smoke:"Smoke Leaf",dashEffect:"Fast route: {ms}ms move",decoyEffect:"Patrol pause: {seconds}s",smokeEffect:"Alert reset + {seconds}s cover",coins:"Moon Coins",safehouse:"Safehouse Lv.{n}",mission:"Mission {n}",move:"Release to move",found:"Object secured!",exitReady:"Extraction ready",treasureFound:"Treasure secured",paused:"Paused",diamonds:"Diamonds",reroll:"Reroll 3",insure:"Insure 5",insured:"Insured",alreadyInsured:"Extraction insurance is already active.",notEnough:"Not enough Diamonds.",rerolled:"Gadget offers rerolled.",insuranceReady:"Extraction insurance active for the next mission.",confirmSpend:"Confirm {cost} · {before}→{after}",rerollDecision:"Reroll all three gadget strengths. Tap again to confirm: {before} → {after} Diamonds.",insuranceDecision:"Keep bonus treasure after one capture in the next mission. Tap again to confirm: {before} → {after} Diamonds.",rerollLabel:"Reroll all three gadget strengths. Costs 3 Diamonds. Current balance {balance}.",insuranceLabel:"Insure bonus treasure for one capture in the next mission. Costs 5 Diamonds. Current balance {balance}.",confirmLabel:"Confirm {action}. Spend {cost} Diamonds. Balance {before} to {after}.",rerollAction:"gadget strength reroll",insuranceAction:"treasure insurance",insuredLabel:"Treasure insurance is active for the next mission."},
    "zh-Hant":{title:"動物月影潛行隊",internal:"月光檔案任務",pitch:"觀察巡邏、找回文物，並決定何時安全撤離。",start:"選擇任務",missions:"月光檔案館",chooseGadget:"選擇技能",alert:"警戒",holdRoute:"按住畫面預覽路線。",objective:"找回任務物件",locked:"先完成上一個任務",retry:"重試",next:"下一關",victory:"任務完成",captured:"被發現了",capturedText:"巡邏隊已拉滿警戒。免費重新挑戰。",treasure:"已取得額外寶藏",extraction:"前往撤離門",dash:"閃電衝刺",decoy:"星光誘餌",smoke:"煙霧葉片",coins:"月光金幣",safehouse:"安全屋 Lv.{n}",mission:"任務 {n}",move:"放開即可移動",found:"已取得任務物件！",exitReady:"撤離門已開啟",treasureFound:"已取得寶藏",paused:"已暫停",diamonds:"鑽石",reroll:"重抽 3",insure:"保險 5",insured:"已投保",alreadyInsured:"撤離保險已啟用。",confirmReroll:"要花費 3 顆鑽石重抽技能強度嗎？",confirmInsurance:"要花費 5 顆鑽石，在被發現後保留額外寶藏嗎？",notEnough:"鑽石不足。",rerolled:"已重抽技能方案。",insuranceReady:"下一個任務已啟用撤離保險。"}
  };
  Object.assign(copy.en, {
    notCleared: "Not cleared",
    bestMedals: "Best {medals}/3 medals",
    perfectMedals: "Best 3/3 medals · Complete",
    bonusMedal: "Bonus treasure earns the final medal.",
    medalCount: "{medals} of 3 medals earned",
    resultMedals: "{medals}/3 medals",
    pauseAction: "Pause mission",
    resumeAction: "Resume mission",
    playFieldLabel: "Stealth route field. Use WASD or arrow keys to move and Space to use the gadget.",
    languageLabel: "Language",
    posterAlt: "Animal Moonlight Heist poster",
    orlaAlt: "Moon Cap Orla",
    missionRailLabel: "Missions",
    fiaAlt: "Spark Paw Fia",
    stageBackLabel: "Back to main menu",
    battleBackLabel: "Back to missions",
  });
  Object.assign(copy["zh-Hant"], {
    notCleared: "\u5c1a\u672a\u5b8c\u6210",
    bestMedals: "\u6700\u4f73 {medals}/3 \u679a\u734e\u7ae0",
    perfectMedals: "\u6700\u4f73 3/3 \u679a\u734e\u7ae0 \u00b7 \u5df2\u5b8c\u6210",
    bonusMedal: "\u56de\u6536\u984d\u5916\u5bf6\u85cf\u53ef\u7372\u5f97\u6700\u5f8c\u4e00\u679a\u734e\u7ae0\u3002",
    medalCount: "\u5df2\u7372\u5f97 {medals}/3 \u679a\u734e\u7ae0",
    resultMedals: "{medals}/3 \u679a\u734e\u7ae0",
    pauseAction: "\u66ab\u505c\u4efb\u52d9",
    resumeAction: "\u7e7c\u7e8c\u4efb\u52d9",
    playFieldLabel: "\u6f5b\u884c\u8def\u7dda\u5340\u3002\u4f7f\u7528 WASD \u6216\u65b9\u5411\u9375\u79fb\u52d5\uff0c\u6309\u7a7a\u767d\u9375\u4f7f\u7528\u88dd\u7f6e\u3002",
    languageLabel: "\u8a9e\u8a00",
    posterAlt: "\u52d5\u7269\u6708\u5f71\u6f5b\u884c\u968a\u904a\u6232\u6d77\u5831",
    orlaAlt: "\u6708\u5e3d\u6b50\u62c9",
    missionRailLabel: "\u4efb\u52d9\u9078\u64c7",
    fiaAlt: "\u9583\u722a\u83f2\u4e9e",
    stageBackLabel: "\u8fd4\u56de\u4e3b\u9078\u55ae",
    battleBackLabel: "\u8fd4\u56de\u4efb\u52d9\u9078\u64c7",
  });
  const missionObjects=["moon-seal","courier-token","star-map","clockwork-lens","district-relic"];
  const patrolArt=["wolf","rabbit","badger"];
  const missions=[
    {name:["Archive Entrance","檔案館入口"],object:[50,44],treasure:[82,38],exit:[50,10],patrols:[[28,34,72,34]]},
    {name:["Lantern Hall","燈火長廊"],object:[25,30],treasure:[80,72],exit:[50,10],patrols:[[20,55,78,55],[68,25,68,78]]},
    {name:["Echo Gallery","回音畫廊"],object:[75,32],treasure:[22,28],exit:[50,10],patrols:[[18,42,82,42],[26,75,74,75]]},
    {name:["Clockwork Vault","發條密庫"],object:[24,24],treasure:[82,32],exit:[50,10],patrols:[[20,48,78,48],[34,22,34,78],[68,24,68,76]]},
    {name:["Moon Gate","月之門"],object:[50,42],treasure:[84,76],exit:[50,10],patrols:[[18,30,82,30],[22,62,78,62],[28,78,28,38]]}
  ];
  const gadgets={dash:{art:"lightning-dash"},decoy:{art:"star-decoy"},smoke:{art:"smoke-leaf"}};
  let state=load(),locale=localStorage.getItem(localeKey)||"en",selectedMission=0,gadget="dash",gadgetOffers=createOffers(),insuranceActive=false,preservedTreasure=false,playing=false,paused=false,alert=0,objectFound=false,treasureFound=false,caught=false,patrols=[],lastTime=0,freezeUntil=0,smokeUntil=0,preview=null,arrivalTimer=0,routePointerId=null;
  const nodes={main:$("#mainScreen"),stage:$("#stageScreen"),battle:$("#battleScreen"),rail:$("#missionRail"),field:$("#playField"),fia:$("#fiaActor"),objective:$("#objectiveActor"),treasure:$("#treasureActor"),exit:$("#exitActor"),patrolLayer:$("#patrolLayer"),route:$("#routeLine"),feedback:$("#feedbackText"),fx:$("#feedbackFx"),alert:$("#alertFill"),modal:$("#resultModal")};
  function load(){try{return{unlocked:1,coins:0,safehouse:1,cleared:{},...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return{unlocked:1,coins:0,safehouse:1,cleared:{}}}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function wallet(){return window.WeightPlayWallet?.read?.()||{diamonds:0}}
  function spendDiamonds(cost){return Boolean(window.WeightPlayWallet?.spendDiamonds?.(cost))}
  function createOffers(){return Object.keys(gadgets).map(id=>({id,level:1+Math.floor(Math.random()*3)}))}
  function selectedOffer(){return gadgetOffers.find(offer=>offer.id===gadget)||gadgetOffers[0]}
  let economyFeedbackTimer=0,pendingEconomy="",pendingEconomyTimer=0;
  function gadgetEffect(id,level){
    if(id==="dash")return t("dashEffect",{ms:Math.max(180,320-level*45)});
    if(id==="decoy")return t("decoyEffect",{seconds:(2.5+level*.65).toFixed(2).replace(/0$/,"")});
    return t("smokeEffect",{seconds:(.8+level*.5).toFixed(1)});
  }
  function gadgetSummary(id=gadget,level=selectedOffer().level){return `${t(id)} Lv.${level} · ${gadgetEffect(id,level)}`}
  function clearPendingEconomy({render=true}={}){clearTimeout(pendingEconomyTimer);pendingEconomy="";if(render)renderEconomy()}
  function renderGadgetSummary(){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=gadgetSummary()}
  function economyMessage(message=""){clearTimeout(economyFeedbackTimer);$("#economyFeedback").textContent=message||gadgetSummary();if(message)economyFeedbackTimer=setTimeout(renderGadgetSummary,1600)}
  function renderEconomy(){
    const balance=wallet().diamonds,reroll=$("#rerollBtn"),insurance=$("#insuranceBtn");
    $("#diamondLabel").textContent=`${t("diamonds")}: ${balance}`;
    reroll.textContent=pendingEconomy==="reroll"?t("confirmSpend",{cost:3,before:balance,after:Math.max(0,balance-3)}):t("reroll");
    insurance.textContent=pendingEconomy==="insurance"?t("confirmSpend",{cost:5,before:balance,after:Math.max(0,balance-5)}):t(insuranceActive?"insured":"insure");
    reroll.setAttribute("aria-label",pendingEconomy==="reroll"?t("confirmLabel",{action:t("rerollAction"),cost:3,before:balance,after:Math.max(0,balance-3)}):t("rerollLabel",{balance}));
    insurance.setAttribute("aria-label",insuranceActive?t("insuredLabel"):pendingEconomy==="insurance"?t("confirmLabel",{action:t("insuranceAction"),cost:5,before:balance,after:Math.max(0,balance-5)}):t("insuranceLabel",{balance}));
    reroll.classList.toggle("is-confirming",pendingEconomy==="reroll");
    insurance.classList.toggle("is-confirming",pendingEconomy==="insurance");
    insurance.classList.toggle("active",insuranceActive);
  }
  function armEconomy(action,cost,messageKey){
    const balance=wallet().diamonds;
    if(balance<cost){clearPendingEconomy();economyMessage(`${t("notEnough")} ${t("diamonds")}: ${balance}/${cost}.`);return false}
    clearTimeout(economyFeedbackTimer);clearTimeout(pendingEconomyTimer);pendingEconomy=action;renderEconomy();
    $("#economyFeedback").textContent=t(messageKey,{before:balance,after:balance-cost});
    pendingEconomyTimer=setTimeout(()=>{clearPendingEconomy();renderGadgetSummary()},5000);
    return true;
  }
  function rerollOffers(){
    if(pendingEconomy!=="reroll"){armEconomy("reroll",3,"rerollDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(3)){renderEconomy();economyMessage(t("notEnough"));return}
    gadgetOffers=createOffers();gadget=gadgetOffers[0].id;economyMessage(t("rerolled"));renderGadgets();renderEconomy();updateGadget();
  }
  function buyInsurance(){
    if(insuranceActive){clearPendingEconomy();economyMessage(t("alreadyInsured"));return}
    if(pendingEconomy!=="insurance"){armEconomy("insurance",5,"insuranceDecision");return}
    clearPendingEconomy({render:false});
    if(!spendDiamonds(5)){renderEconomy();economyMessage(t("notEnough"));return}
    insuranceActive=true;economyMessage(t("insuranceReady"));renderEconomy();
  }
  function t(key,vars={}){let value=copy[locale]?.[key]||copy.en[key]||key;Object.entries(vars).forEach(([k,v])=>value=value.replace(`{${k}}`,v));return value}
  function localize(){document.documentElement.lang=locale;const internal=document.querySelector('meta[name="robots"]')?.content.includes("noindex");document.title=`${t("title")} - ${internal?"Internal Trial":"WeightPlay"}`;document.querySelectorAll("[data-i18n]").forEach(n=>n.textContent=t(n.dataset.i18n));$("#localeSelect").setAttribute("aria-label",t("languageLabel"));$(".main-poster").alt=t("posterAlt");$(".planner > img").alt=t("orlaAlt");nodes.rail.setAttribute("aria-label",t("missionRailLabel"));nodes.fia.alt=t("fiaAlt");$("#stageBackBtn").setAttribute("aria-label",t("stageBackLabel"));$("#battleBackBtn").setAttribute("aria-label",t("battleBackLabel"));renderSummary();renderStage();renderGadgets();renderEconomy();updateGadget();renderGadgetSummary();updatePauseControl()}
  function show(name){document.body.dataset.screen=name;nodes.main.hidden=name!=="main";nodes.stage.hidden=name!=="stage";nodes.battle.hidden=name!=="battle";if(name!=="battle"){playing=false;paused=false;cancelPendingMovement();updatePauseControl()}}
  function renderSummary(){$("#safehouseSummary").textContent=`${t("safehouse",{n:state.safehouse})} · ${t("coins")}: ${state.coins} · ${Object.keys(state.cleared).length}/5`}
  function medalProgress(index){
    const medals=Math.max(0,Math.min(3,Number(state.cleared[index])||0));
    if(!medals)return{visible:`☆☆☆ · ${t("notCleared")}`,accessible:t("notCleared")};
    const stars="★".repeat(medals)+"☆".repeat(3-medals);
    const detail=medals===3?t("perfectMedals"):`${t("bestMedals",{medals})} · ${t("bonusMedal")}`;
    return{visible:`${stars} · ${detail}`,accessible:detail};
  }
  function renderStage(){
    if(!nodes.rail)return;
    $("#coinLabel").textContent=`${t("coins")}: ${state.coins}`;
    nodes.rail.innerHTML="";
    missions.forEach((m,i)=>{
      const b=document.createElement("button");
      const missionName=`${t("mission",{n:i+1})}: ${m.name[locale==="zh-Hant"?1:0]}`;
      const locked=i+1>state.unlocked;
      const progress=medalProgress(i);
      b.type="button";
      b.className=`mission-card${locked?" locked":""}`;
      b.innerHTML=`<img src="../../assets/animal-moonlight-heist-archive-background.png" alt=""><div><strong>${missionName}</strong><span>${locked?t("locked"):progress.visible}</span></div>`;
      b.setAttribute("aria-label",`${missionName}. ${locked?t("locked"):progress.accessible}`);
      b.addEventListener("click",()=>{if(!locked)startMission(i)});
      nodes.rail.append(b);
    });
  }
  function renderGadgets(){const wrap=$("#gadgetChoices");wrap.innerHTML="";gadgetOffers.forEach(({id,level})=>{const g=gadgets[id],b=document.createElement("button");b.className=`gadget-choice${id===gadget?" selected":""}`;b.innerHTML=`<img src="../../assets/animal-moonlight-heist-gadget-${g.art}.webp" alt=""><span class="gadget-level">Lv.${level}</span>`;b.type="button";b.title=`${t(id)} Lv.${level}`;b.setAttribute("aria-label",gadgetSummary(id,level));b.setAttribute("aria-pressed",id===gadget?"true":"false");b.addEventListener("click",()=>{gadget=id;renderGadgets();updateGadget();renderGadgetSummary()});wrap.append(b)})}
  function updateGadget(){if(!$("#gadgetIcon"))return;$("#gadgetIcon").src=`../../assets/animal-moonlight-heist-gadget-${gadgets[gadget].art}.webp`;$("#gadgetLabel").textContent=t(gadget)}
  function startMission(index){selectedMission=index;objectFound=false;treasureFound=preservedTreasure;preservedTreasure=false;caught=false;alert=0;paused=false;smokeUntil=0;const m=missions[index];$("#missionLabel").textContent=`${t("mission",{n:index+1})}: ${m.name[locale==="zh-Hant"?1:0]}`;$("#objectiveLabel").textContent=t("objective");nodes.objective.src=`../../assets/animal-moonlight-heist-object-${missionObjects[index]}.webp`;place(nodes.objective,m.object);place(nodes.treasure,m.treasure);place(nodes.exit,m.exit);nodes.objective.hidden=false;nodes.treasure.hidden=treasureFound;nodes.exit.style.opacity=.5;place(nodes.fia,[50,88]);nodes.patrolLayer.innerHTML="";patrols=m.patrols.map((path,i)=>{const sight=document.createElement("span");sight.className="patrol-sight";sight.setAttribute("aria-hidden","true");const img=document.createElement("img");img.className="patrol";img.src=`../../assets/animal-moonlight-heist-patrol-${patrolArt[i%3]}.webp`;nodes.patrolLayer.append(sight,img);const p={img,sight,path,progress:i*.23,direction:1};updatePatrol(p);return p});nodes.feedback.textContent=t("holdRoute");nodes.alert.style.width="0";$("#coinBattle").textContent=`${t("coins")}: ${state.coins}`;show("battle");playing=true;lastTime=performance.now();requestAnimationFrame(loop)}
  function place(el,pos){el.style.left=`${pos[0]}%`;el.style.top=`${pos[1]}%`}
  function point(el){return[parseFloat(el.style.left)||0,parseFloat(el.style.top)||0]}
  function updatePauseControl(){const button=$("#pauseBtn");if(!button)return;button.textContent=paused?"\u25b6":"\u275a\u275a";button.setAttribute("aria-pressed",paused?"true":"false");button.setAttribute("aria-label",t(paused?"resumeAction":"pauseAction"));button.title=t(paused?"resumeAction":"pauseAction");nodes.field.tabIndex=0;nodes.field.setAttribute("aria-label",t("playFieldLabel"))}
  function freezeFia(){if(!nodes.field||nodes.field.hidden)return;const field=nodes.field.getBoundingClientRect(),fia=nodes.fia.getBoundingClientRect();if(!field.width||!field.height)return;const position=[(fia.left+fia.width/2-field.left)/field.width*100,(fia.top+fia.height/2-field.top)/field.height*100];nodes.fia.style.transitionDuration="0ms";place(nodes.fia,position)}
  function freezePatrols(){const field=nodes.field.getBoundingClientRect();if(!field.width||!field.height)return;patrols.forEach(p=>{const box=p.img.getBoundingClientRect(),position=[(box.left+box.width/2-field.left)/field.width*100,(box.top+box.height/2-field.top)/field.height*100];p.img.style.transitionDuration="0ms";place(p.img,position);place(p.sight,position)})}
  function cancelRoutePreview(){nodes.route.hidden=true;preview=null;if(routePointerId!==null&&nodes.field.hasPointerCapture?.(routePointerId))nodes.field.releasePointerCapture(routePointerId);routePointerId=null}
  function cancelPendingMovement(){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=0;cancelRoutePreview()}
  function setPaused(next){if(!playing)return;paused=Boolean(next);if(paused){freezeFia();freezePatrols();cancelPendingMovement();nodes.feedback.textContent=t("paused")}else{patrols.forEach(p=>p.img.style.transitionDuration="");nodes.feedback.textContent=t("holdRoute");lastTime=performance.now()}updatePauseControl();if(!paused)nodes.field.focus({preventScroll:true})}
  function scheduleArrival(delay){if(arrivalTimer)clearTimeout(arrivalTimer);arrivalTimer=setTimeout(()=>{arrivalTimer=0;if(playing&&!paused)resolveArrival()},delay)}
  function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1])}
  function updatePatrol(p){const [x1,y1,x2,y2]=p.path;const q=p.direction>0?p.progress:1-p.progress;const position=[x1+(x2-x1)*q,y1+(y2-y1)*q];place(p.img,position);place(p.sight,position)}
  function loop(now){if(!playing)return;const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;if(!paused&&now>freezeUntil){patrols.forEach(p=>{p.progress+=dt*(.12+selectedMission*.012);if(p.progress>=1){p.progress=0;p.direction*=-1}updatePatrol(p)});const seen=patrols.some(p=>distance(point(nodes.fia),point(p.img))<18);alert=Math.max(0,Math.min(100,alert+(seen?48:-34)*dt));nodes.alert.style.width=`${alert}%`;if(alert>=100)fail()}requestAnimationFrame(loop)}
  function routeTo(clientX,clientY,commit=false){const r=nodes.field.getBoundingClientRect();const x=Math.max(6,Math.min(94,(clientX-r.left)/r.width*100));const y=Math.max(8,Math.min(92,(clientY-r.top)/r.height*100));const start=point(nodes.fia);const dx=(x-start[0])/100*r.width,dy=(y-start[1])/100*r.height;const len=Math.hypot(dx,dy);nodes.route.hidden=false;nodes.route.style.left=`${start[0]}%`;nodes.route.style.top=`${start[1]}%`;nodes.route.style.width=`${len}px`;nodes.route.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;const exposed=patrols.some(p=>distance([x,y],point(p.img))<22);nodes.route.classList.toggle("route-exposed",exposed);nodes.feedback.textContent=t(commit?"holdRoute":"move");preview=[x,y];if(commit){const level=selectedOffer().level,dashTime=gadget==="dash"?Math.max(180,320-level*45):650;nodes.route.hidden=true;nodes.fia.style.transitionDuration=`${dashTime}ms`;place(nodes.fia,preview);scheduleArrival(dashTime+20)}}
  function resolveArrival(){const p=point(nodes.fia);if(!objectFound&&distance(p,point(nodes.objective))<12){objectFound=true;nodes.objective.hidden=true;nodes.exit.style.opacity=1;$("#objectiveLabel").textContent=t("extraction");showFx("pickup");nodes.feedback.textContent=t("found")}if(!treasureFound&&distance(p,point(nodes.treasure))<12){treasureFound=true;nodes.treasure.hidden=true;showFx("pickup");nodes.feedback.textContent=t("treasureFound")}if(objectFound&&distance(p,point(nodes.exit))<13)win()}
  function showFx(type){nodes.fx.src=`../../assets/animal-moonlight-heist-fx-${type}.webp`;place(nodes.fx,point(nodes.fia));nodes.fx.hidden=false;nodes.fx.classList.remove("fx-show");void nodes.fx.offsetWidth;nodes.fx.classList.add("fx-show");setTimeout(()=>nodes.fx.hidden=true,650)}
  function useGadget(){if(!playing||paused)return;const level=selectedOffer().level;if(gadget==="decoy"){freezeUntil=performance.now()+(2500+level*650);showFx("pickup")}else if(gadget==="smoke"){alert=0;smokeUntil=performance.now()+(800+level*500);showFx("shadow")}else{nodes.feedback.textContent=t("dash");showFx("pickup")}}
  function fail(){if(caught||performance.now()<smokeUntil)return;caught=true;playing=false;if(insuranceActive&&treasureFound)preservedTreasure=true;insuranceActive=false;showFx("warning");nodes.fia.classList.add("caught");openResult(false)}
  function win(){playing=false;insuranceActive=false;const medals=1+(!caught?1:0)+(treasureFound?1:0);const reward=20+selectedMission*8+(treasureFound?12:0);state.coins+=reward;state.cleared[selectedMission]=Math.max(state.cleared[selectedMission]||0,medals);state.unlocked=Math.max(state.unlocked,Math.min(5,selectedMission+2));state.safehouse=1+Math.floor(Object.keys(state.cleared).length/2);save();openResult(true,medals,reward)}
  function openResult(ok,medals=0,reward=0){
    $("#resultTitle").textContent=t(ok?"victory":"captured");
    $("#resultText").textContent=ok
      ? `+${reward} ${t("coins")} · ${t("resultMedals",{medals})}${medals<3?` · ${t("bonusMedal")}`:` · ${t("treasure")}`}`
      : t("capturedText");
    $("#medalRow").textContent=ok?"★".repeat(medals)+"☆".repeat(3-medals):"";
    $("#medalRow").setAttribute("aria-label",ok?t("medalCount",{medals}):"");
    $("#nextBtn").hidden=!ok||selectedMission>=4;
    [...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=true;node.setAttribute("aria-hidden","true")});
    nodes.modal.hidden=false;
    (ok&&!$("#nextBtn").hidden?$("#nextBtn"):$("#retryBtn")).focus({preventScroll:true});
  }
  function closeResult(){nodes.modal.hidden=true;[...nodes.modal.parentElement.children].filter(node=>node!==nodes.modal).forEach(node=>{node.inert=false;node.removeAttribute("aria-hidden")});nodes.fia.classList.remove("caught")}
  function trapResultFocus(event){
    if(event.key!=="Tab"||nodes.modal.hidden)return;
    const actions=[...nodes.modal.querySelectorAll("button:not(:disabled)")].filter(node=>node.getClientRects().length);
    if(!actions.length){event.preventDefault();nodes.modal.focus();return}
    const first=actions[0],last=actions.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  $(".home-link").setAttribute("data-wp-return","main");$("#stageBackBtn").setAttribute("data-wp-return","stage");$("#battleBackBtn").setAttribute("data-wp-return","battle");
  function bind(){$("#localeSelect").value=locale;$("#localeSelect").addEventListener("change",e=>{locale=e.target.value;localStorage.setItem(localeKey,locale);localize()});$("#startBtn").addEventListener("click",()=>{show("stage");renderStage()});$("#stageBackBtn").addEventListener("click",()=>show("main"));$("#battleBackBtn").addEventListener("click",()=>{show("stage");renderStage()});$("#pauseBtn").addEventListener("click",()=>setPaused(!paused));nodes.field.addEventListener("pointerdown",e=>{if(!playing||paused)return;routePointerId=e.pointerId;nodes.field.setPointerCapture(e.pointerId);routeTo(e.clientX,e.clientY)});nodes.field.addEventListener("pointermove",e=>{if(!paused&&e.pointerId===routePointerId&&nodes.field.hasPointerCapture(e.pointerId))routeTo(e.clientX,e.clientY)});nodes.field.addEventListener("pointerup",e=>{if(e.pointerId!==routePointerId)return;if(!paused&&preview)routeTo(e.clientX,e.clientY,true);cancelRoutePreview()});nodes.field.addEventListener("pointercancel",cancelRoutePreview);nodes.field.addEventListener("lostpointercapture",e=>{if(e.pointerId===routePointerId)cancelRoutePreview()});nodes.modal.addEventListener("keydown",trapResultFocus);$("#gadgetBtn").addEventListener("click",useGadget);$("#retryBtn").addEventListener("click",()=>{closeResult();startMission(selectedMission)});$("#stagesBtn").addEventListener("click",()=>{closeResult();show("stage");renderStage()});$("#nextBtn").addEventListener("click",()=>{closeResult();startMission(Math.min(4,selectedMission+1))})}
  function bindMissionRailDrag(){
    let pointerId=null,startX=0,startLeft=0,dragged=false,suppressClickUntil=0;
    const rail=nodes.rail;
    rail.addEventListener("pointerdown",event=>{
      if(event.button!==undefined&&event.button!==0)return;
      pointerId=event.pointerId;startX=event.clientX;startLeft=rail.scrollLeft;dragged=false;suppressClickUntil=0;
    });
    rail.addEventListener("pointermove",event=>{
      if(event.pointerId!==pointerId)return;
      const delta=event.clientX-startX;
      if(Math.abs(delta)>6&&!dragged){dragged=true;rail.setPointerCapture(pointerId)}
      if(!dragged)return;
      event.preventDefault();rail.scrollLeft=startLeft-delta;
    });
    const finish=event=>{
      if(event.pointerId!==pointerId)return;
      if(rail.hasPointerCapture(pointerId))rail.releasePointerCapture(pointerId);
      suppressClickUntil=dragged?performance.now()+90:0;pointerId=null;
    };
    rail.addEventListener("pointerup",finish);
    rail.addEventListener("pointercancel",finish);
    rail.addEventListener("click",event=>{
      if(performance.now()>suppressClickUntil)return;
      event.preventDefault();event.stopPropagation();suppressClickUntil=0;
    },true);
  }
  window.addEventListener("keydown",event=>{
    if(!playing||paused||event.target.matches("button,select,input,textarea"))return;
    const direction={arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1]}[event.key.toLowerCase()];
    if(event.key===" "){event.preventDefault();useGadget();return}
    if(!direction)return;
    event.preventDefault();
    const current=point(nodes.fia),next=[Math.max(6,Math.min(94,current[0]+direction[0]*6)),Math.max(8,Math.min(92,current[1]+direction[1]*6))];
    nodes.route.hidden=true;nodes.fia.style.transitionDuration="120ms";place(nodes.fia,next);scheduleArrival(140);
  });
  $("#rerollBtn").addEventListener("click",rerollOffers);
  $("#insuranceBtn").addEventListener("click",buyInsurance);
  // Keep the public Traditional Chinese runtime dictionary ASCII-safe so it cannot be damaged by a legacy editor encoding.
  const decodeZh=value=>value.replace(/\\u([0-9a-f]{4})/gi,(_,code)=>String.fromCharCode(parseInt(code,16)));
  Object.assign(copy["zh-Hant"],{
    title:decodeZh("\\u52d5\\u7269\\u6708\\u5f71\\u6f5b\\u884c\\u968a"),internal:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u4efb\\u52d9"),pitch:decodeZh("\\u89c0\\u5bdf\\u5de1\\u908f\\uff0c\\u56de\\u6536\\u907a\\u7269\\uff0c\\u9078\\u64c7\\u4f55\\u6642\\u64a4\\u96e2\\u3002"),start:decodeZh("\\u9078\\u64c7\\u4efb\\u52d9"),missions:decodeZh("\\u6708\\u5149\\u6a94\\u6848\\u5eab"),chooseGadget:decodeZh("\\u9078\\u64c7\\u88dd\\u7f6e"),alert:decodeZh("\\u8b66\\u5831"),holdRoute:decodeZh("\\u6309\\u4f4f\\u4f86\\u9810\\u89bd\\u8def\\u7dda\\u3002"),objective:decodeZh("\\u56de\\u6536\\u4efb\\u52d9\\u7269\\u54c1"),locked:decodeZh("\\u5b8c\\u6210\\u524d\\u4e00\\u4efb\\u52d9\\u5f8c\\u89e3\\u9396"),retry:decodeZh("\\u91cd\\u8a66"),next:decodeZh("\\u4e0b\\u4e00\\u4efb\\u52d9"),victory:decodeZh("\\u4efb\\u52d9\\u5b8c\\u6210"),captured:decodeZh("\\u88ab\\u767c\\u73fe\\u4e86"),capturedText:decodeZh("\\u5de1\\u908f\\u54e1\\u89f8\\u767c\\u8b66\\u5831\\u3002\\u53ef\\u4ee5\\u514d\\u8cbb\\u91cd\\u8a66\\u3002"),treasure:decodeZh("\\u56de\\u6536\\u984d\\u5916\\u5bf6\\u85cf"),extraction:decodeZh("\\u524d\\u5f80\\u64a4\\u96e2\\u51fa\\u53e3"),dash:decodeZh("\\u9583\\u96fb\\u885d\\u523a"),decoy:decodeZh("\\u661f\\u5149\\u8a98\\u990c"),smoke:decodeZh("\\u7159\\u9727\\u8449"),coins:decodeZh("\\u6708\\u5149\\u5e63"),safehouse:decodeZh("\\u5b89\\u5168\\u5c4b Lv.{n}"),mission:decodeZh("\\u4efb\\u52d9 {n}"),move:decodeZh("\\u653e\\u958b\\u4f86\\u79fb\\u52d5"),found:decodeZh("\\u4efb\\u52d9\\u7269\\u54c1\\u5df2\\u53d6\\u5f97\\uff01"),exitReady:decodeZh("\\u53ef\\u4ee5\\u64a4\\u96e2"),treasureFound:decodeZh("\\u5df2\\u53d6\\u5f97\\u5bf6\\u85cf"),paused:decodeZh("\\u5df2\\u66ab\\u505c"),diamonds:decodeZh("\\u947d\\u77f3"),reroll:decodeZh("\\u91cd\\u65b0\\u64b2\\u653e 3"),insure:decodeZh("\\u6295\\u4fdd 5"),insured:decodeZh("\\u5df2\\u6295\\u4fdd"),alreadyInsured:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002"),confirmReroll:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u91cd\\u65b0\\u64b2\\u653e\\u88dd\\u7f6e\\u5f37\\u5ea6\\u55ce\\uff1f"),confirmInsurance:decodeZh("\\u78ba\\u5b9a\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\uff0c\\u5728\\u88ab\\u767c\\u73fe\\u6642\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u55ce\\uff1f"),notEnough:decodeZh("\\u947d\\u77f3\\u4e0d\\u8db3\\u3002"),rerolled:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u5df2\\u91cd\\u65b0\\u64b2\\u653e\\u3002"),insuranceReady:decodeZh("\\u64a4\\u96e2\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  ["\\u6a94\\u6848\\u5eab\\u5165\\u53e3","\\u71c8\\u706b\\u5927\\u5ef3","\\u56de\\u97ff\\u756b\\u5eca","\\u767c\\u689d\\u5bf6\\u5eab","\\u6708\\u4eae\\u4e4b\\u9580"].forEach((name,index)=>{missions[index].name[1]=decodeZh(name)});
  Object.assign(copy["zh-Hant"],{
    dashEffect:decodeZh("\\u5feb\\u901f\\u79fb\\u52d5\\uff1a{ms} \\u6beb\\u79d2"),
    decoyEffect:decodeZh("\\u66ab\\u505c\\u5de1\\u908f\\uff1a{seconds} \\u79d2"),
    smokeEffect:decodeZh("\\u8b66\\u5831\\u6b78\\u96f6 + {seconds} \\u79d2\\u63a9\\u8b77")
  });
  Object.assign(copy["zh-Hant"],{
    confirmSpend:decodeZh("\\u78ba\\u8a8d {cost} \\u00b7 {before}\\u2192{after}"),
    rerollDecision:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    insuranceDecision:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u88ab\\u767c\\u73fe\\u4e00\\u6b21\\u5f8c\\uff0c\\u4fdd\\u7559\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u518d\\u9ede\\u4e00\\u6b21\\u78ba\\u8a8d\\uff1a{before} \\u2192 {after} \\u9846\\u947d\\u77f3\\u3002"),
    rerollLabel:decodeZh("\\u91cd\\u62bd\\u5168\\u90e8\\u4e09\\u500b\\u88dd\\u7f6e\\u5f37\\u5ea6\\u3002\\u82b1\\u8cbb 3 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    insuranceLabel:decodeZh("\\u70ba\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u4e00\\u6b21\\u88ab\\u767c\\u73fe\\u6295\\u4fdd\\u984d\\u5916\\u5bf6\\u85cf\\u3002\\u82b1\\u8cbb 5 \\u9846\\u947d\\u77f3\\u3002\\u76ee\\u524d\\u9918\\u984d {balance}\\u3002"),
    confirmLabel:decodeZh("\\u78ba\\u8a8d{action}\\u3002\\u82b1\\u8cbb {cost} \\u9846\\u947d\\u77f3\\u3002\\u9918\\u984d {before} \\u8b8a\\u70ba {after}\\u3002"),
    rerollAction:decodeZh("\\u88dd\\u7f6e\\u5f37\\u5ea6\\u91cd\\u62bd"),
    insuranceAction:decodeZh("\\u5bf6\\u85cf\\u4fdd\\u96aa"),
    insuredLabel:decodeZh("\\u4e0b\\u4e00\\u500b\\u4efb\\u52d9\\u7684\\u5bf6\\u85cf\\u4fdd\\u96aa\\u5df2\\u555f\\u7528\\u3002")
  });
  renderGadgets();bind();bindMissionRailDrag();localize();$("#localeSelect option[value='zh-Hant']").textContent=decodeZh("\\u7e41\\u9ad4\\u4e2d\\u6587");show("main");
})();
