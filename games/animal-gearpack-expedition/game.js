(() => {
  "use strict";

  const ASSET = "../../assets/animal-gearpack-expedition-items/";
  const SAVE_KEY = "weightplayGearpackProgressV1";
  const RUN_KEY = "weightplayGearpackRunV1";
  const copy = {
    en: { title:"Animal Gearpack Expedition",internal:"Internal Trial",pitch:"Pack equipment, build adjacency combos, and guide Rux through the Gearwood route.",start:"Start Expedition",chooseRegion:"Choose Region",packmaster:"Packmaster Rux",region1:"Gearwood Trail",region1Meta:"5 rooms · Root Guardian",region2:"Moonlit Quarry",region3:"Clockwork Hollow",locked:"Locked",backpack:"Gearpack 5 x 7",rotate:"Rotate",sell:"Sell",fight:"Start Encounter",strike:"Resolve Clash",room:"Room",armor:"Armor",objective:"Arrange gear, then defeat the route guardian.",workshop:"Workshop",discoveries:"Discoveries",gold:"Gold",diamonds:"Diamonds",items:"items",selected:"Selected",placed:"Placed",blocked:"That shape does not fit there.",rotated:"Item rotated.",needGear:"Place at least one item before fighting.",victory:"Route Cleared",defeat:"Caravan Broken",continue:"Continue",retry:"Retry Route",regions:"Back to Regions",chooseLoot:"Choose one item",merchant:"Orla's Caravan Shop",buy:"Buy",leave:"Leave Shop",refresh:"Refresh for 3 Diamonds",confirmRefresh:"Spend 3 Diamonds to refresh Orla's stock?",notEnough:"Not enough currency.",boss:"Root Guardian",scout:"Shadow Fox Scout",boar:"Armored Boar",crow:"Crystal Crow",reward:"Reward",saved:"Workshop progress saved.",full:"Your pack has no room for that item.",pickedUp:"Returned to tray",sold:"Sold" },
    "zh-Hant": { title:"動物裝備行囊遠征",internal:"內部試玩",pitch:"配置裝備、建立相鄰連結，帶領魯克斯穿越齒輪森林路線。",start:"開始遠征",chooseRegion:"選擇區域",packmaster:"行囊大師魯克斯",region1:"齒輪森林小徑",region1Meta:"5 個房間 · 樹根守衛",region2:"月光礦場",region3:"發條樹洞",locked:"尚未解鎖",backpack:"裝備行囊 5 x 7",rotate:"旋轉",sell:"出售",fight:"開始遭遇",strike:"進行交鋒",room:"房間",armor:"護甲",objective:"配置裝備，擊敗路線守衛。",workshop:"工坊",discoveries:"圖鑑",gold:"金幣",diamonds:"鑽石",items:"件",selected:"已選擇",placed:"已放置",blocked:"這個形狀無法放在這裡。",rotated:"裝備已旋轉。",needGear:"至少放入一件裝備才能戰鬥。",victory:"路線完成",defeat:"行囊隊伍敗退",continue:"繼續",retry:"重試路線",regions:"返回區域",chooseLoot:"選擇一件裝備",merchant:"奧菈的商隊商店",buy:"購買",leave:"離開商店",refresh:"花費 3 鑽石刷新",confirmRefresh:"確定花費 3 鑽石刷新奧菈的商品嗎？",notEnough:"貨幣不足。",boss:"樹根守衛",scout:"暗影狐斥候",boar:"重甲野豬",crow:"水晶烏鴉",reward:"獎勵",saved:"工坊進度已保存。",full:"行囊沒有足夠空間。",pickedUp:"已取回待放區",sold:"已出售" }
  };
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
  let progress = load(SAVE_KEY,{workshopXp:0,discoveries:[],diamonds:12,bestRoom:0});
  let run = null;
  let selectedItem = null;
  let rotated = false;
  let battleReady = false;
  let resolving = false;

  function t(key){return copy[locale][key] || copy.en[key] || key;}
  function load(key,fallback){try{return {...fallback,...JSON.parse(localStorage.getItem(key)||"null")};}catch{return {...fallback};}}
  function saveProgress(){localStorage.setItem(SAVE_KEY,JSON.stringify(progress));}
  function saveRun(){if(run)localStorage.setItem(RUN_KEY,JSON.stringify(run));else localStorage.removeItem(RUN_KEY);}
  function itemById(id){return items.find((item)=>item.id===id);}
  function itemName(item){return item.name[locale]||item.name.en;}
  function itemAsset(item){return `${ASSET}${item.id}.webp`;}
  function setFeedback(text){$("#feedbackRow").textContent=text;}
  function showScreen(name){Object.entries(screens).forEach(([key,node])=>node.hidden=key!==name);document.body.dataset.screen=name;document.body.classList.toggle("is-game-playing",name==="battle");if(name==="stage")renderStage();if(name==="battle")renderBattle();}

  function applyLocale(next){locale=copy[next]?next:"en";localStorage.setItem("weightPlayLocale",locale);document.documentElement.lang=locale;document.title=`${t("title")} - Internal Trial`;$("#localeSelect").value=locale;document.querySelectorAll("[data-i18n]").forEach((node)=>{node.textContent=t(node.dataset.i18n)});renderMain();if(!screens.stage.hidden)renderStage();if(!screens.battle.hidden)renderBattle();}
  function renderMain(){$("#workshopSummary").textContent=`${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)} · ${progress.workshopXp} XP`;$("#discoverySummary").textContent=`${t("discoveries")} ${progress.discoveries.length}/12`;}
  function renderStage(){$("#stageGold").textContent=`${t("diamonds")} ${progress.diamonds}`;$("#loadoutText").textContent=`${t("discoveries")} ${progress.discoveries.length}/12 · ${t("workshop")} Lv.${1+Math.floor(progress.workshopXp/40)}`;requestAnimationFrame(()=>$(".region-card.is-selected")?.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}));}

  function newRun(){run={room:0,armor:36,maxArmor:36,gold:8,placed:[],tray:["forge-hammer","leaf-buckler","berry-potion","crystal-lens"],enemyHp:enemies[0].hp,enemyMaxHp:enemies[0].hp};selectedItem=run.tray[0];rotated=false;battleReady=false;resolving=false;saveRun();showScreen("battle");}
  function shapeFor(item){return item.shape.map(([x,y])=>rotated?[y,x]:[x,y]);}
  function occupiedCells(){const map=new Map();run.placed.forEach((placed)=>{const item=itemById(placed.id);const shape=placed.rotated?item.shape.map(([x,y])=>[y,x]):item.shape;shape.forEach(([dx,dy])=>map.set(`${placed.x+dx},${placed.y+dy}`,placed));});return map;}
  function canPlace(item,x,y){const occupied=occupiedCells();return shapeFor(item).every(([dx,dy])=>x+dx>=0&&x+dx<5&&y+dy>=0&&y+dy<7&&!occupied.has(`${x+dx},${y+dy}`));}
  function placeSelected(x,y){if(!selectedItem)return;const item=itemById(selectedItem);if(!canPlace(item,x,y)){setFeedback(t("blocked"));return;}run.placed.push({id:item.id,x,y,rotated});run.tray.splice(run.tray.indexOf(item.id),1);progress.discoveries=[...new Set([...progress.discoveries,item.id])];selectedItem=run.tray[0]||null;rotated=false;saveProgress();saveRun();setFeedback(`${t("placed")}: ${itemName(item)}`);renderBattle();}
  function pickUpPlaced(placed){const index=run.placed.indexOf(placed);if(index<0)return;run.placed.splice(index,1);run.tray.unshift(placed.id);selectedItem=placed.id;rotated=placed.rotated;saveRun();setFeedback(`${t("pickedUp")}: ${itemName(itemById(placed.id))}`);renderBattle();}
  function itemDetails(item){const shape=shapeFor(item),width=Math.max(...shape.map(([x])=>x))+1,height=Math.max(...shape.map(([,y])=>y))+1;return `${itemName(item)} · ${width}x${height} · ${item.tag.toUpperCase()} · ATK ${item.atk} DEF ${item.armor} HEAL ${item.heal}`;}
  function sellSelected(){if(!selectedItem)return;const item=itemById(selectedItem),index=run.tray.indexOf(selectedItem);if(index<0)return;run.tray.splice(index,1);const value=Math.max(1,Math.floor(item.gold/2));run.gold+=value;selectedItem=run.tray[0]||null;rotated=false;saveRun();setFeedback(`${t("sold")}: ${itemName(item)} +${value} ${t("gold")}`);renderBattle();}
  function adjacentPairs(){const occupied=occupiedCells(),pairs=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag)pairs.add([a,b].map((p)=>run.placed.indexOf(p)).sort().join("-"));});}return pairs.size;}
  function linkedItems(){const occupied=occupiedCells(),linked=new Set();for(const [key,a] of occupied){const [x,y]=key.split(",").map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const b=occupied.get(`${x+dx},${y+dy}`);if(b&&b!==a&&itemById(a.id).tag===itemById(b.id).tag){linked.add(a);linked.add(b);}});}return linked;}
  function stats(){const base=run.placed.reduce((sum,p)=>{const item=itemById(p.id);sum.atk+=item.atk;sum.armor+=item.armor;sum.heal+=item.heal;return sum;},{atk:2,armor:0,heal:0});const links=adjacentPairs();return {...base,links,atk:base.atk+links*2,armor:base.armor+links};}
  function renderPack(){const grid=$("#packGrid");grid.replaceChildren();const occupied=occupiedCells(),linked=linkedItems(),pending=selectedItem?itemById(selectedItem):null;for(let y=0;y<7;y++)for(let x=0;x<5;x++){const cell=document.createElement("button");cell.type="button";cell.className="pack-cell";cell.dataset.x=x;cell.dataset.y=y;const placed=occupied.get(`${x},${y}`);if(!placed&&pending&&canPlace(pending,x,y))cell.classList.add("is-valid");if(placed){cell.classList.add("is-occupied");if(linked.has(placed))cell.classList.add("is-adjacent");if(placed.x===x&&placed.y===y){const img=document.createElement("img");img.className="placed-item";img.src=itemAsset(itemById(placed.id));img.alt=itemName(itemById(placed.id));cell.append(img);}cell.addEventListener("click",()=>pickUpPlaced(placed));}else cell.addEventListener("click",()=>placeSelected(x,y));grid.append(cell);}const tray=$("#itemTray");tray.replaceChildren();run.tray.forEach((id)=>{const item=itemById(id),button=document.createElement("button");button.type="button";button.className=`tray-item${selectedItem===id?" is-selected":""}`;button.innerHTML=`<img src="${itemAsset(item)}" alt=""><span>${itemName(item)}</span>`;button.addEventListener("click",()=>{selectedItem=id;rotated=false;setFeedback(itemDetails(item));renderBattle();});tray.append(button);});}
  function renderBattle(){if(!run)return;const enemy=enemies[run.room],s=stats();$("#roomLabel").textContent=`${t("room")} ${run.room+1}/5`;$("#armorLabel").textContent=`${t("armor")} ${Math.max(0,Math.ceil(run.armor))}/${run.maxArmor}`;$("#objectiveText").textContent=run.room===4?t("boss"):t("objective");$("#currencyText").textContent=`${t("gold")} ${run.gold} · ${t("diamonds")} ${progress.diamonds}`;$("#statsText").textContent=`ATK ${s.atk} · DEF ${s.armor} · LINK ${s.links}`;$("#enemyActor").src=`../../assets/animal-gearpack-expedition-enemy-${enemy.asset}.webp`;$("#enemyActor").alt=t(enemy.name);$("#enemyHpBar span").style.width=`${Math.max(0,run.enemyHp/enemy.hp*100)}%`;$("#fightBtn").textContent=battleReady?t("strike"):t("fight");$("#fightBtn").disabled=resolving;renderPack();}
  function animateAttack(){const rux=$("#ruxActor"),enemy=$("#enemyActor");rux.classList.remove("is-attacking");enemy.classList.remove("is-hit");void rux.offsetWidth;rux.classList.add("is-attacking");enemy.classList.add("is-hit");}
  function fight(){if(resolving)return;if(!run.placed.length){setFeedback(t("needGear"));return;}if(!battleReady){battleReady=true;setFeedback(t("strike"));renderBattle();return;}resolving=true;renderBattle();const enemy=enemies[run.room],s=stats();animateAttack();run.enemyHp-=s.atk;$("#combatFx").textContent=`-${s.atk}`;setTimeout(()=>$("#combatFx").textContent="",420);if(run.enemyHp<=0){run.gold+=4+run.room*2;progress.bestRoom=Math.max(progress.bestRoom,run.room+1);saveProgress();saveRun();setTimeout(roomVictory,420);return;}const incoming=Math.max(1,enemy.damage-s.armor);run.armor=Math.min(run.maxArmor,run.armor+s.heal)-incoming;setFeedback(`${t(enemy.name)} -${incoming} ${t("armor")}`);if(run.armor<=0){saveRun();setTimeout(()=>showResult(false),420);return;}saveRun();setTimeout(()=>{resolving=false;renderBattle();},380);}
  function roomVictory(){if(run.room===4){showResult(true);return;}showLoot(()=>{run.room+=1;run.enemyHp=enemies[run.room].hp;run.enemyMaxHp=enemies[run.room].hp;battleReady=false;resolving=false;saveRun();renderBattle();if(run.room===3)showMerchant();});}
  function randomItems(count){return [...items].sort(()=>Math.random()-.5).slice(0,count);}
  function showModal(title,text,art=""){const modal=$("#modal");$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalArt").src=art;$("#modalArt").hidden=!art;$("#modalChoices").replaceChildren();modal.hidden=false;return $("#modalChoices");}
  function closeModal(){$("#modal").hidden=true;}
  function choiceButton(label,handler,item){const button=document.createElement("button");button.type="button";button.innerHTML=item?`<img src="${itemAsset(item)}" alt="">${label}`:label;button.addEventListener("click",handler);return button;}
  function addToTray(item){if(run.tray.length+run.placed.length>=12){setFeedback(t("full"));return false;}run.tray.push(item.id);progress.discoveries=[...new Set([...progress.discoveries,item.id])];saveProgress();return true;}
  function showLoot(done){const choices=showModal(t("chooseLoot"),`${t("reward")}: +${4+run.room*2} ${t("gold")}`);randomItems(3).forEach((item)=>choices.append(choiceButton(itemName(item),()=>{addToTray(item);closeModal();done();},item)));}
  function showMerchant(){const render=()=>{const choices=showModal(t("merchant"),`${t("gold")} ${run.gold} · ${t("diamonds")} ${progress.diamonds}`,"../../assets/animal-gearpack-expedition-orla.webp");randomItems(3).forEach((item)=>choices.append(choiceButton(`${t("buy")} ${item.gold} · ${itemName(item)}`,()=>{if(run.gold<item.gold){$("#modalText").textContent=t("notEnough");return;}if(addToTray(item)){run.gold-=item.gold;saveRun();render();}},item)));choices.append(choiceButton(t("refresh"),()=>{if(progress.diamonds<3){$("#modalText").textContent=t("notEnough");return;}if(confirm(t("confirmRefresh"))){progress.diamonds-=3;saveProgress();render();}}));choices.append(choiceButton(t("leave"),()=>{closeModal();renderBattle();}));};render();}
  function showResult(won){const xp=won?35:8+run.room*4;progress.workshopXp+=xp;saveProgress();const choices=showModal(won?t("victory"):t("defeat"),`+${xp} XP · ${t("discoveries")} ${progress.discoveries.length}/12`,won?"../../assets/animal-gearpack-expedition-icons/victory-sparkle.webp":"../../assets/animal-gearpack-expedition-rux.webp");choices.append(choiceButton(won?t("regions"):t("retry"),()=>{closeModal();run=null;saveRun();won?showScreen("stage"):newRun();}));}

  $("#localeSelect").addEventListener("change",(event)=>applyLocale(event.target.value));$("#startBtn").addEventListener("click",()=>showScreen("stage"));$("#stageBackBtn").addEventListener("click",()=>showScreen("main"));$("#battleBackBtn").addEventListener("click",()=>{saveRun();showScreen("stage")});$("#pauseBtn").addEventListener("click",()=>setFeedback(t("objective")));$("#rotateBtn").addEventListener("click",()=>{if(!selectedItem)return;rotated=!rotated;setFeedback(itemDetails(itemById(selectedItem)));renderBattle();});$("#sellBtn").addEventListener("click",sellSelected);$("#fightBtn").addEventListener("click",fight);$(".region-card[data-region='0']").addEventListener("click",newRun);
  applyLocale(locale);showScreen("main");
})();
