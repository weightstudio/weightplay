(() => {
  "use strict";

  const ASSET = "../../assets/animal-gearpack-expedition-items/";
  const SAVE_KEY = "weightplayGearpackProgressV1";
  const RUN_KEY = "weightplayGearpackRunV1";
  const copy = {
    en: { title:"Animal Gearpack Expedition",internal:"Internal Trial",pitch:"Pack equipment, build adjacency combos, and guide Rux through the Gearwood route.",start:"Start Expedition",chooseRegion:"Choose Region",packmaster:"Packmaster Rux",region1:"Gearwood Trail",region1Meta:"5 rooms · Root Guardian",region2:"Moonlit Quarry",region3:"Clockwork Hollow",locked:"Locked",backpack:"Gearpack 11 x 7",rotate:"Rotate",sell:"Sell",fight:"Start Encounter",strike:"Resolve Clash",room:"Room",armor:"Armor",objective:"Arrange gear, then defeat the route guardian.",workshop:"Workshop",discoveries:"Discoveries",gold:"Gold",diamonds:"Diamonds",items:"items",selected:"Selected",placed:"Placed",blocked:"That shape does not fit there.",rotated:"Item rotated.",needGear:"Place at least one item before fighting.",victory:"Route Cleared",defeat:"Caravan Broken",continue:"Continue",retry:"Retry Route",regions:"Back to Regions",chooseLoot:"Choose one item",merchant:"Orla's Caravan Shop",buy:"Buy",leave:"Leave Shop",refresh:"Refresh for 3 Diamonds",confirmRefresh:"Spend 3 Diamonds to refresh Orla's stock?",notEnough:"Not enough currency.",boss:"Root Guardian",scout:"Shadow Fox Scout",boar:"Armored Boar",crow:"Crystal Crow",reward:"Reward",saved:"Workshop progress saved.",full:"Your pack has no room for that item.",pickedUp:"Returned to tray",sold:"Sold" },
    "zh-Hant": { title:"動物裝備行囊遠征",internal:"內部試玩",pitch:"配置裝備、建立相鄰連結，帶領魯克斯穿越齒輪森林路線。",start:"開始遠征",chooseRegion:"選擇區域",packmaster:"行囊大師魯克斯",region1:"齒輪森林小徑",region1Meta:"5 個房間 · 樹根守衛",region2:"月光礦場",region3:"發條樹洞",locked:"尚未解鎖",backpack:"裝備行囊 11 x 7",rotate:"旋轉",sell:"出售",fight:"開始遭遇",strike:"進行交鋒",room:"房間",armor:"護甲",objective:"配置裝備，擊敗路線守衛。",workshop:"工坊",discoveries:"圖鑑",gold:"金幣",diamonds:"鑽石",items:"件",selected:"已選擇",placed:"已放置",blocked:"這個形狀無法放在這裡。",rotated:"裝備已旋轉。",needGear:"至少放入一件裝備才能戰鬥。",victory:"路線完成",defeat:"行囊隊伍敗退",continue:"繼續",retry:"重試路線",regions:"返回區域",chooseLoot:"選擇一件裝備",merchant:"奧菈的商隊商店",buy:"購買",leave:"離開商店",refresh:"花費 3 鑽石刷新",confirmRefresh:"確定花費 3 鑽石刷新奧菈的商品嗎？",notEnough:"貨幣不足。",boss:"樹根守衛",scout:"暗影狐斥候",boar:"重甲野豬",crow:"水晶烏鴉",reward:"獎勵",saved:"工坊進度已保存。",full:"行囊沒有足夠空間。",pickedUp:"已取回待放區",sold:"已出售" }
  };
  copy.en.adventure = "Gearwood Adventure";
  Object.assign(copy.en,{refreshConfirm:"Confirm 3 · {before}→{after}",refreshDecision:"Replace all three shop items once. Tap again to confirm: {before} → {after} Diamonds.",refreshLabel:"Replace all three shop items. Costs 3 Diamonds. Current balance {balance}.",refreshConfirmLabel:"Confirm one shop refresh. Spend 3 Diamonds. Balance {before} to {after}.",refreshNeed:"Need 3 Diamonds. Current balance {balance}/3."});
  Object.assign(copy["zh-Hant"],{refreshConfirm:"確認 3 · {before}→{after}",refreshDecision:"一次更換全部三件商品。再點一次確認：{before} → {after} 顆鑽石。",refreshLabel:"一次更換全部三件商品。花費 3 顆鑽石。目前餘額 {balance}。",refreshConfirmLabel:"確認刷新一次商店。花費 3 顆鑽石。餘額 {before} 變為 {after}。",refreshNeed:"需要 3 顆鑽石。目前餘額 {balance}/3。"});
  Object.assign(copy.en,{battleSteps:"1 Select gear  2 Tap a green cell  3 Start encounter",attack:"Attack",defense:"Defense",healing:"Heal",links:"Links",attackHint:"Tap Attack to resolve the clash.",health:"Health",region2Meta:"5 rooms · Crystal Warden",region3Meta:"5 rooms · Hollow Colossus"});
  Object.assign(copy["zh-Hant"],{battleSteps:"① 選下方裝備　② 點綠色格子放入　③ 開始遭遇",attack:"攻擊",defense:"防禦",healing:"恢復",links:"連結",attackHint:"按「攻擊」進行這一回合。",health:"生命",region2Meta:"5 個房間 · 水晶守衛",region3Meta:"5 個房間 · 樹洞巨像"});
  copy["zh-Hant"].adventure = "齒輪森林冒險";
  Object.assign(copy.en,{tagForge:"Forge",tagNature:"Nature",tagCrystal:"Crystal",tagMoon:"Moon",sameTagBonus:"Same tag +2 ATK / +1 DEF",sellValue:"Sell"});
  Object.assign(copy["zh-Hant"],{tagForge:"鍛造",tagNature:"自然",tagCrystal:"水晶",tagMoon:"月光",sameTagBonus:"同標籤 +2 攻擊 / +1 防禦",sellValue:"售價"});
  Object.assign(copy.en,{autoFighting:"Auto battling...",repack:"Enemy defeated. Repack for the next encounter."});
  Object.assign(copy["zh-Hant"],{autoFighting:"自動戰鬥中…",repack:"敵人已擊敗，重新搭配裝備迎戰下一隻。"});
  Object.assign(copy.en,{newRegionUnlocked:"New region unlocked"});
  Object.assign(copy["zh-Hant"],{newRegionUnlocked:"新區域已解鎖"});
  Object.assign(copy.en,{packGridLabel:"Backpack grid, 7 rows by 11 columns",cellLabel:"Row {row}, column {column}. {action}",placeItem:"Place {item} here.",pickUpItem:"Pick up {item}.",cannotPlace:"{item} does not fit here.",emptyCell:"Empty slot. Select gear from the tray.",selectItem:"Select {item}.",selectedItem:"Selected {item}."});
  Object.assign(copy["zh-Hant"],{packGridLabel:"背包格，7 排、11 欄",cellLabel:"第 {row} 排、第 {column} 欄。{action}",placeItem:"在這裡放置{item}。",pickUpItem:"拿起{item}。",cannotPlace:"{item}無法放在這裡。",emptyCell:"空格。請先從物品列選擇裝備。",selectItem:"選擇{item}。",selectedItem:"已選擇{item}。"});

  const PACK_COLS = 11;
  const PACK_ROWS = 7;

  const items = [
    {id:"forge-hammer",name:{en:"Forge Hammer","zh-Hant":"鍛造錘"},shape:[[0,0],[0,1]],atk:3,armor:0,heal:0,tag:"forge",gold:5},
    {id:"leaf-buckler",name:{en:"Leaf Buckler","zh-Hant":"葉紋圓盾"},shape:[[0,0],[1,0]],atk:0,armor:4,heal:0,tag:"nature",gold:5},
    {id:"crystal-lens",name:{en:"Crystal Lens","zh-Hant":"水晶鑑定鏡"},shape:[[0,0]],atk:2,armor:0,heal:0,tag:"crystal",gold:4},
    {id:"berry-potion",name:{en:"Berry Potion","zh-Hant":"莓果藥水"},shape:[[0,0]],atk:0,armor:0,heal:3,tag:"nature",gold:4},
    {id:"gear-boots",name:{en:"Gear Boots","zh-Hant":"齒輪戰靴"},shape:[[0,0],[1,0]],atk:2,armor:2,heal:0,tag:"forge",gold:6},
    {id:"moon-charm",name:{en:"Moon Charm","zh-Hant":"月牙護符"},shape:[[0,0]],atk:1,armor:1,heal:2,tag:"moon",gold:6},
    {id:"thorn-whip",name:{en:"Thorn Whip","zh-Hant":"荊棘長鞭"},shape:[[0,0],[0,1],[0,2]],atk:4,armor:0,heal:0,tag:"nature",gold:7},
    {id:"moss-armor",name:{en:"Moss Armor","zh-Hant":"苔甲"},shape:[[0,0],[1,0],[0,1],[1,1]],atk:0,armor:7,heal:0,tag:"nature",gold:8},
    {id:"spark-coil",name:{en:"Spark Coil","zh-Hant":"火花線圈"},shape:[[0,0],[0,1]],atk:5,armor:0,heal:0,tag:"crystal",gold:8},
    {id:"repair-kit",name:{en:"Repair Kit","zh-Hant":"野外修理包"},shape:[[0,0],[1,0]],atk:0,armor:2,heal:4,tag:"forge",gold:7},
    {id:"scout-lantern",name:{en:"Scout Lantern","zh-Hant":"斥候提燈"},shape:[[0,0]],atk:2,armor:1,heal:0,tag:"moon",gold:5},
    {id:"caravan-badge",name:{en:"Caravan Badge","zh-Hant":"商隊徽章"},shape:[[0,0]],atk:1,armor:2,heal:1,tag:"moon",gold:5}
  ];
  const enemies = [
    {name:"scout",hp:18,damage:5,asset:"fox-scout"},
    {name:"boar",hp:26,damage:7,asset:"armored-boar"},
    {name:"crow",hp:32,damage:8,asset:"crystal-crow"},
    {name:"boar",hp:40,damage:10,asset:"armored-boar"},
    {name:"boss",hp:62,damage:12,asset:"root-guardian"}
  ];
  const $ = (selector) => document.querySelector(selector);
  const screens = {main:$("#mainScreen"),stage:$("#stageScreen"),battle:$("#battleScreen")};
  let locale = localStorage.getItem("weightPlayLocale") === "zh-Hant" ? "zh-Hant" : "en";
  let progress = load(SAVE_KEY,{workshopXp:0,discoveries:[],diamonds:12,bestRoom:0,unlockedRegion:0});
  let run = null;
  let selectedItem = null;
  let rotated = false;
  let resolving = false;
  let combatTimer = 0;
  let modalReturnFocus = null;
  let selectedRegion = Math.min(2, Math.max(0, Number(progress.unlockedRegion) || 0));

  function t(key,vars={}){return (copy[locale][key] || copy.en[key] || key).replace(/\{(\w+)\}/g,(_,name)=>vars[name] ?? `{${name}}`);}
  function load(key,fallback){try{return {...fallback,...JSON.parse(localStorage.getItem(key)||"null")};}catch{return {...fallback};}}
  function saveProgress(){localStorage.setItem(SAVE_KEY,JSON.stringify(progress));}
  function saveRun(){if(run)localStorage.setItem(RUN_KEY,JSON.stringify(run));else localStorage.removeItem(RUN_KEY);}
  function sound(name){window.WonderSound?.play(name);}
  function track(name,data={}){window.WonderAnalytics?.track(name,{game_id:"animal-gearpack-expedition",...data});}
  function diamondBalance(){return window.WeightPlayWallet?.read().diamonds ?? progress.diamonds;}
  function spendDiamonds(cost){if(window.WeightPlayWallet)return window.WeightPlayWallet.spendDiamonds(cost);if(progress.diamonds<cost)return false;progress.diamonds-=cost;saveProgress();return true;}
  function itemById(id){return items.find((item)=>item.id===id);}
  function itemName(item){return item.name[locale]||item.name.en;}
  function itemAsset(item){return `${ASSET}${item.id}.webp`;}
  function setFeedback(text){const row=$("#feedbackRow");row.classList.remove("is-item-details");row.textContent=text;}
  function setItemFeedback(item){
    const shape=shapeFor(item),width=Math.max(...shape.map(([x])=>x))+1,height=Math.max(...shape.map(([,y])=>y))+1;
    const value=Math.max(1,Math.floor(item.gold/2));
    const row=$("#feedbackRow");
    row.classList.add("is-item-details");
    const identity=document.createElement("span");
    const tagKey=`tag${item.tag[0].toUpperCase()}${item.tag.slice(1)}`;
    identity.textContent=`${itemName(item)} · ${width}×${height} · ${t(tagKey)} · ${t("sellValue")} ${value}`;
    const effect=document.createElement("span");
    effect.textContent=`${t("attack")} ${item.atk} · ${t("defense")} ${item.armor} · ${t("healing")} ${item.heal} · ${t("sameTagBonus")}`;
    row.replaceChildren(identity,effect);
  }
  function showScreen(name){Object.entries(screens).forEach(([key,node])=>node.hidden=key!==name);document.body.dataset.screen=name;document.body.classList.toggle("is-game-playing",name==="battle");if(name==="stage")renderStage();if(name==="battle")renderBattle();}

  function applyLocale(next){locale=copy[next]?next:"en";localStorage.setItem("weightPlayLocale",locale);document.documentElement.lang=locale;document.title=`${t("title")} - WeightPlay`;$("#localeSelect").value=locale;document.querySelectorAll("[data-i18n]").forEach((node)=>{node.textContent=t(node.dataset.i18n)});renderMain();if(!screens.stage.hidden)renderStage();if(!screens.battle.hidden)renderBattle();}
  function renderMain(){$("#workshopSummary").textContent=`${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)} · ${progress.workshopXp} XP`;$("#discoverySummary").textContent=`${t("discoveries")} ${progress.discoveries.length}/12`;}
  function renderStage(){const unlocked=Math.min(2,Math.max(0,Number(progress.unlockedRegion)||0));selectedRegion=Math.min(selectedRegion,unlocked);$("#stageGold").textContent=`${t("diamonds")} ${diamondBalance()}`;$("#loadoutText").textContent=`${t("discoveries")} ${progress.discoveries.length}/12 · ${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)}`;document.querySelectorAll(".region-card").forEach((card)=>{const index=Number(card.dataset.region);const available=index<=unlocked;card.disabled=!available;card.classList.toggle("is-selected",index===selectedRegion);card.toggleAttribute("data-wp-stage-unlocked",available);const lock=card.querySelector(".locked");if(lock)lock.hidden=available;const meta=card.querySelector("[data-region-meta]");if(meta)meta.textContent=available?t(`region${index+1}Meta`):t("locked");});requestAnimationFrame(()=>$(".region-card.is-selected")?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}));}

  function enemyAt(room,region=selectedRegion){const base=enemies[room];return {...base,hp:Math.round(base.hp*(1+region*.28)),damage:base.damage+region*2};}
  function newRun(region=selectedRegion){clearTimeout(combatTimer);selectedRegion=Math.min(Number(progress.unlockedRegion)||0,Math.max(0,Number(region)||0));const enemy=enemyAt(0,selectedRegion);run={region:selectedRegion,room:0,armor:36,maxArmor:36,gold:8,placed:[],tray:["forge-hammer","leaf-buckler","berry-potion","crystal-lens"],enemyHp:enemy.hp,enemyMaxHp:enemy.hp};selectedItem=run.tray[0];rotated=false;resolving=false;setFeedback(t("battleSteps"));saveRun();setTimeout(()=>sound("start"),0);track("game_start",{region:selectedRegion+1});showScreen("battle");}
  function shapeFor(item){return item.shape.map(([x,y])=>rotated?[y,x]:[x,y]);}
  function occupiedCells(){const map=new Map();run.placed.forEach((placed)=>{const item=itemById(placed.id);const shape=placed.rotated?item.shape.map(([x,y])=>[y,x]):item.shape;shape.forEach(([dx,dy])=>map.set(`${placed.x+dx},${placed.y+dy}`,placed));});return map;}
  function canPlace(item,x,y){const occupied=occupiedCells();return shapeFor(item).every(([dx,dy])=>x+dx>=0&&x+dx<PACK_COLS&&y+dy>=0&&y+dy<PACK_ROWS&&!occupied.has(`${x+dx},${y+dy}`));}
  function placeSelected(x,y){if(resolving||!selectedItem)return;const item=itemById(selectedItem);if(!canPlace(item,x,y)){sound("wrong");setFeedback(t("blocked"));return;}run.placed.push({id:item.id,x,y,rotated});run.tray.splice(run.tray.indexOf(item.id),1);progress.discoveries=[...new Set([...progress.discoveries,item.id])];selectedItem=run.tray[0]||null;rotated=false;saveProgress();saveRun();sound("click");setFeedback(`${t("placed")}: ${itemName(item)}`);renderBattle();}
  function pickUpPlaced(placed){if(resolving)return;const index=run.placed.indexOf(placed);if(index<0)return;run.placed.splice(index,1);run.tray.unshift(placed.id);selectedItem=placed.id;rotated=placed.rotated;saveRun();setFeedback(`${t("pickedUp")}: ${itemName(itemById(placed.id))}`);renderBattle();}
  function sellSelected(){if(resolving||!selectedItem)return;const item=itemById(selectedItem),index=run.tray.indexOf(selectedItem);if(index<0)return;run.tray.splice(index,1);const value=Math.max(1,Math.floor(item.gold/2));run.gold+=value;selectedItem=run.tray[0]||null;rotated=false;saveRun();sound("coin");setFeedback(`${t("sold")}: ${itemName(item)} +${value} ${t("gold")}`);renderBattle();}
  function adjacentPairs(){const occupied=occupiedCells(),pairs=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag)pairs.add([a,b].map((p)=>run.placed.indexOf(p)).sort().join("-"));});}return pairs.size;}
  function linkedItems(){const occupied=occupiedCells(),linked=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag){linked.add(a);linked.add(b);}});}return linked;}
  function stats(){const base=run.placed.reduce((sum,p)=>{const item=itemById(p.id);sum.atk+=item.atk;sum.armor+=item.armor;sum.heal+=item.heal;return sum;},{atk:2,armor:0,heal:0});const links=adjacentPairs();return {...base,links,atk:base.atk+links*2,armor:base.armor+links};}
  function renderPack(){const grid=$("#packGrid");grid.replaceChildren();const occupied=occupiedCells(),linked=linkedItems(),pending=selectedItem?itemById(selectedItem):null;for(let y=0;y<PACK_ROWS;y++)for(let x=0;x<PACK_COLS;x++){const cell=document.createElement("button");cell.type="button";cell.className="pack-cell";cell.dataset.x=x;cell.dataset.y=y;cell.disabled=resolving;const placed=occupied.get(`${x},${y}`);if(!placed&&pending&&canPlace(pending,x,y))cell.classList.add("is-valid");if(placed){cell.classList.add("is-occupied");if(linked.has(placed))cell.classList.add("is-adjacent");if(placed.x===x&&placed.y===y){const img=document.createElement("img");img.className="placed-item";img.src=itemAsset(itemById(placed.id));img.alt=itemName(itemById(placed.id));cell.append(img);}cell.addEventListener("click",()=>pickUpPlaced(placed));}else cell.addEventListener("click",()=>placeSelected(x,y));grid.append(cell);}const tray=$("#itemTray");tray.replaceChildren();run.tray.forEach((id)=>{const item=itemById(id),button=document.createElement("button");button.type="button";button.disabled=resolving;button.className=`tray-item${selectedItem===id?" is-selected":""}`;button.innerHTML=`<img src="${itemAsset(item)}" alt=""><span>${itemName(item)}</span>`;button.addEventListener("click",()=>{if(resolving)return;selectedItem=id;rotated=false;setItemFeedback(item);renderBattle();});tray.append(button);});}
  function renderBattle(){if(!run)return;const enemy=enemyAt(run.room,run.region),s=stats();$("#roomLabel").textContent=`${t("room")} ${run.room+1}/5`;$("#armorLabel").textContent=`${t("health")} ${Math.max(0,Math.ceil(run.armor))}/${run.maxArmor}`;$("#objectiveText").textContent=t("battleSteps");$("#currencyText").textContent=`${t("gold")} ${run.gold} · ${t("diamonds")} ${diamondBalance()}`;$("#statsText").textContent=`${t("attack")} ${s.atk} · ${t("defense")} ${s.armor} · ${t("links")} ${s.links}`;$("#enemyActor").src=`../../assets/animal-gearpack-expedition-enemy-${enemy.asset}.webp`;$("#enemyActor").alt=t(enemy.name);$("#enemyHpBar span").style.width=`${Math.max(0,run.enemyHp/enemy.hp*100)}%`;$("#playerHpBar span").style.width=`${Math.max(0,run.armor/run.maxArmor*100)}%`;$("#playerHpBar").setAttribute("aria-label",`${t("health")} ${Math.max(0,Math.ceil(run.armor))}/${run.maxArmor}`);$("#fightBtn").textContent=resolving?t("autoFighting"):t("fight");$("#fightBtn").disabled=resolving;$("#rotateBtn").disabled=resolving||!selectedItem;$("#sellBtn").disabled=resolving||!selectedItem;$("#battleBackBtn").disabled=resolving;renderPack();}
  function animateAttack(){const rux=$("#ruxActor"),enemy=$("#enemyActor");rux.classList.remove("is-attacking");enemy.classList.remove("is-hit");void rux.offsetWidth;rux.classList.add("is-attacking");enemy.classList.add("is-hit");}
  function animateCounterattack(){const rux=$("#ruxActor"),enemy=$("#enemyActor");enemy.classList.remove("is-attacking");rux.classList.remove("is-hit");void enemy.offsetWidth;enemy.classList.add("is-attacking");rux.classList.add("is-hit");}
  function scheduleCombat(callback,delay){clearTimeout(combatTimer);combatTimer=setTimeout(callback,delay);}
  function autoCombatRound(){if(!resolving||!run)return;const enemy=enemyAt(run.room,run.region),s=stats();animateAttack();run.enemyHp-=s.atk;$("#combatFx").textContent=`-${s.atk}`;saveRun();renderBattle();setTimeout(()=>$("#combatFx").textContent="",420);if(run.enemyHp<=0){run.gold+=4+run.room*2;progress.bestRoom=Math.max(progress.bestRoom,run.room+1);saveProgress();saveRun();scheduleCombat(roomVictory,520);return;}scheduleCombat(()=>{if(!resolving||!run)return;const incoming=Math.max(1,enemy.damage-s.armor);run.armor=Math.min(run.maxArmor,run.armor+s.heal)-incoming;setFeedback(`${t(enemy.name)} -${incoming} ${t("health")}`);saveRun();animateCounterattack();renderBattle();$("#playerCombatFx").textContent=`-${incoming}`;if(run.armor<=0){scheduleCombat(()=>showResult(false),650);return;}scheduleCombat(()=>{$("#playerCombatFx").textContent="";autoCombatRound();},720);},220);}
  function fight(){if(resolving)return;if(!run.placed.length){setFeedback(t("needGear"));return;}resolving=true;setFeedback(t("autoFighting"));renderBattle();autoCombatRound();}
  function roomVictory(){resolving=false;renderBattle();if(run.room===4){showResult(true);return;}showLoot(()=>{run.room+=1;const enemy=enemyAt(run.room,run.region);run.enemyHp=enemy.hp;run.enemyMaxHp=enemy.hp;resolving=false;saveRun();setFeedback(t("repack"));renderBattle();if(run.room===3)showMerchant();});}
  function randomItems(count){return [...items].sort(()=>Math.random()-.5).slice(0,count);}
  function showModal(title,text,art=""){const modal=$("#modal"),battleCanvas=$("#battleScreen .battle-canvas");if(modal.hidden)modalReturnFocus=document.activeElement;$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalArt").src=art;$("#modalArt").hidden=!art;$("#modalChoices").replaceChildren();battleCanvas.inert=true;battleCanvas.setAttribute("aria-hidden","true");modal.hidden=false;return $("#modalChoices");}
  function focusModalChoice(preferred){requestAnimationFrame(()=>{const modal=$("#modal");if(modal.hidden)return;const target=preferred?.isConnected?preferred:$("#modalChoices button");(target||modal).focus();});}
  function trapModalFocus(event){const modal=$("#modal");if(event.key!=="Tab"||modal.hidden)return;const choices=[...document.querySelectorAll("#modalChoices button:not(:disabled)")].filter((button)=>button.getClientRects().length);if(!choices.length){event.preventDefault();modal.focus();return;}const first=choices[0],last=choices.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  function closeModal(){const modal=$("#modal"),battleCanvas=$("#battleScreen .battle-canvas");modal.hidden=true;battleCanvas.inert=false;battleCanvas.removeAttribute("aria-hidden");const previous=modalReturnFocus;modalReturnFocus=null;requestAnimationFrame(()=>{const canRestore=previous?.isConnected&&previous.matches?.('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')&&previous.getClientRects().length;if(canRestore){previous.focus();return;}const fallback=screens.battle.hidden?$(".region-card.is-selected:not(:disabled)"):$("#fightBtn:not(:disabled)");fallback?.focus();});}
  function choiceButton(label,handler,item){const button=document.createElement("button");button.type="button";button.innerHTML=item?`<img src="${itemAsset(item)}" alt="">${label}`:label;button.addEventListener("click",handler);return button;}
  function addToTray(item){if(run.tray.length+run.placed.length>=12){setFeedback(t("full"));return false;}run.tray.push(item.id);progress.discoveries=[...new Set([...progress.discoveries,item.id])];saveProgress();return true;}
  function showLoot(done){const choices=showModal(t("chooseLoot"),`${t("reward")}: +${4+run.room*2} ${t("gold")}`);randomItems(3).forEach((item)=>choices.append(choiceButton(itemName(item),()=>{addToTray(item);closeModal();done();},item)));focusModalChoice();}
  function showMerchant(){let stock=randomItems(3),refreshPending=false,confirmTimer=0;const clearConfirmation=()=>{clearTimeout(confirmTimer);refreshPending=false;};const render=()=>{const balance=diamondBalance();const message=refreshPending?t("refreshDecision",{before:balance,after:balance-3}):`${t("gold")} ${run.gold} · ${t("diamonds")} ${balance}`;const choices=showModal(t("merchant"),message,"../../assets/animal-gearpack-expedition-orla.webp");stock.forEach((item)=>choices.append(choiceButton(`${t("buy")} ${item.gold} · ${itemName(item)}`,()=>{clearConfirmation();if(run.gold<item.gold){$("#modalText").textContent=t("notEnough");return;}if(addToTray(item)){run.gold-=item.gold;saveRun();stock=randomItems(3);render();}},item)));const refresh=choiceButton(refreshPending?t("refreshConfirm",{before:balance,after:balance-3}):t("refresh"),()=>{const current=diamondBalance();if(current<3){clearConfirmation();$("#modalText").textContent=t("refreshNeed",{balance:current});refresh.classList.remove("is-confirming");return;}if(!refreshPending){refreshPending=true;render();confirmTimer=setTimeout(()=>{refreshPending=false;render();},5000);return;}clearConfirmation();if(spendDiamonds(3)){sound("upgrade");track("diamond_spend",{sink:"merchant_refresh",amount:3});stock=randomItems(3);render();}});refresh.dataset.merchantRefresh="";refresh.classList.toggle("is-confirming",refreshPending);refresh.setAttribute("aria-label",refreshPending?t("refreshConfirmLabel",{before:balance,after:balance-3}):t("refreshLabel",{balance}));choices.append(refresh);choices.append(choiceButton(t("leave"),()=>{clearConfirmation();closeModal();renderBattle();}));focusModalChoice(refreshPending?refresh:null);};render();}
  function showResult(won){clearTimeout(combatTimer);resolving=false;const xp=won?35:8+run.room*4;const previousUnlocked=Math.min(2,Math.max(0,Number(progress.unlockedRegion)||0));progress.workshopXp+=xp;if(won){progress.unlockedRegion=Math.max(previousUnlocked,Math.min(2,(run.region||0)+1));selectedRegion=Math.min(2,progress.unlockedRegion);}const newlyUnlocked=progress.unlockedRegion>previousUnlocked?progress.unlockedRegion:null;saveProgress();sound(won?"win":"wrong");track("game_end",{result:won?"win":"loss",room:run.room+1,region:(run.region||0)+1});const resultParts=[`+${xp} XP`,`${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)} · ${progress.workshopXp} XP`,`${t("discoveries")} ${progress.discoveries.length}/12`];if(newlyUnlocked!==null)resultParts.push(`${t("newRegionUnlocked")}${locale==="zh-Hant"?"：":":"} ${t(`region${newlyUnlocked+1}`)}`);const choices=showModal(won?t("victory"):t("defeat"),resultParts.join(" · "),won?"../../assets/animal-gearpack-expedition-icons/victory-sparkle.webp":"../../assets/animal-gearpack-expedition-rux.webp");choices.append(choiceButton(won?t("regions"):t("retry"),()=>{closeModal();run=null;saveRun();won?showScreen("stage"):newRun();}));focusModalChoice();}

  const packFocus={x:0,y:0};
  let restorePackFocus=false;
  function focusPackCell(){const cell=$(`.pack-cell[data-x="${packFocus.x}"][data-y="${packFocus.y}"]`);if(cell&&!cell.disabled)cell.focus({preventScroll:true});}
  function enhancePackKeyboard(){
    if(!run)return;
    const grid=$("#packGrid"),tray=$("#itemTray"),occupied=occupiedCells(),pending=selectedItem?itemById(selectedItem):null;
    grid.setAttribute("role","grid");grid.setAttribute("aria-label",t("packGridLabel"));grid.setAttribute("aria-rowcount",PACK_ROWS);grid.setAttribute("aria-colcount",PACK_COLS);
    grid.querySelectorAll(".pack-cell").forEach((cell)=>{const x=Number(cell.dataset.x),y=Number(cell.dataset.y),placed=occupied.get(`${x},${y}`);let action=t("emptyCell");if(placed)action=t("pickUpItem",{item:itemName(itemById(placed.id))});else if(pending)action=canPlace(pending,x,y)?t("placeItem",{item:itemName(pending)}):t("cannotPlace",{item:itemName(pending)});cell.tabIndex=x===packFocus.x&&y===packFocus.y?0:-1;cell.setAttribute("aria-rowindex",y+1);cell.setAttribute("aria-colindex",x+1);cell.setAttribute("aria-label",t("cellLabel",{row:y+1,column:x+1,action}));});
    tray.querySelectorAll(".tray-item").forEach((button,index)=>{const item=itemById(run.tray[index]),selected=item?.id===selectedItem;button.setAttribute("aria-pressed",selected?"true":"false");button.setAttribute("aria-label",t(selected?"selectedItem":"selectItem",{item:itemName(item)}));});
    if(restorePackFocus){restorePackFocus=false;requestAnimationFrame(focusPackCell);}
  }
  const packObserver=new MutationObserver(enhancePackKeyboard);
  packObserver.observe($("#packGrid"),{childList:true});packObserver.observe($("#itemTray"),{childList:true});
  $("#packGrid").addEventListener("focusin",(event)=>{const cell=event.target.closest(".pack-cell");if(cell){packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);}});
  $("#packGrid").addEventListener("keydown",(event)=>{const cell=event.target.closest(".pack-cell");if(!cell)return;if(event.key==="Enter"||event.key===" "){packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);restorePackFocus=true;return;}const move={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!move)return;event.preventDefault();packFocus.x=Math.max(0,Math.min(PACK_COLS-1,Number(cell.dataset.x)+move[0]));packFocus.y=Math.max(0,Math.min(PACK_ROWS-1,Number(cell.dataset.y)+move[1]));enhancePackKeyboard();focusPackCell();});
  $("#packGrid").addEventListener("click",(event)=>{const cell=event.target.closest(".pack-cell");if(cell&&event.detail===0){packFocus.x=Number(cell.dataset.x);packFocus.y=Number(cell.dataset.y);restorePackFocus=true;}});
  $("#itemTray").addEventListener("click",(event)=>{if(event.target.closest(".tray-item")&&event.detail===0){packFocus.x=0;packFocus.y=0;restorePackFocus=true;}});
  $("#modal").addEventListener("keydown",trapModalFocus);

  $(".home-link").setAttribute("data-wp-return","main");$("#stageBackBtn").setAttribute("data-wp-return","stage");$("#battleBackBtn").setAttribute("data-wp-return","battle");
  $("#localeSelect").addEventListener("change",(event)=>applyLocale(event.target.value));$("#startBtn").addEventListener("click",()=>showScreen("stage"));$("#stageBackBtn").addEventListener("click",()=>showScreen("main"));$("#battleBackBtn").addEventListener("click",()=>{if(resolving)return;saveRun();showScreen("stage")});$("#pauseBtn").addEventListener("click",()=>setFeedback(t("objective")));$("#rotateBtn").addEventListener("click",()=>{if(resolving||!selectedItem)return;rotated=!rotated;setItemFeedback(itemById(selectedItem));renderBattle();});$("#sellBtn").addEventListener("click",sellSelected);$("#fightBtn").addEventListener("click",fight);document.querySelectorAll(".region-card").forEach((card)=>card.addEventListener("click",()=>{if(card.disabled)return;selectedRegion=Number(card.dataset.region)||0;newRun(selectedRegion);}));
  if(new URLSearchParams(location.search).has("smoke"))window.__gearpackSmoke={finishRegionForTest(){if(!run)newRun(0);run.room=4;showResult(true);},openMerchantForTest(){if(!run)newRun(0);showMerchant();}};
  applyLocale(locale);showScreen("main");
})();
