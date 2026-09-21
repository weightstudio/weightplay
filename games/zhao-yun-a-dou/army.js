/* Earned character shards, explicit unlocks/upgrades, and four-slot teams. */
(() => {
  'use strict';
  const roles = ['blade', 'spear', 'horse', 'bow'];
  const cards = [
    {id:'blade_0',role:'blade',rarity:0,model:'blade',trait:''},
    {id:'spear_0',role:'spear',rarity:0,model:'spear',trait:''},
    {id:'horse_0',role:'horse',rarity:0,model:'horse',trait:''},
    {id:'bow_0',role:'bow',rarity:0,model:'bow',trait:''},
    {id:'blade_1',role:'blade',rarity:1,model:'guard',trait:'shield',combat:{cost:5,hp:100,damage:6,speed:.30,cooldown:42}},
    {id:'spear_1',role:'spear',rarity:1,model:'frost',trait:'slow',combat:{cost:5,damage:10,reach:14,period:22}},
    {id:'horse_1',role:'horse',rarity:1,model:'vanguard',trait:'burst',combat:{cost:8,hp:66,damage:22,cooldown:75}},
    {id:'bow_1',role:'bow',rarity:1,model:'arbalest',trait:'pierce',combat:{cost:6,damage:20,reach:34,period:34,speed:.28,cooldown:60}},
    {id:'blade_2',role:'blade',rarity:2,model:'berserker',trait:'drain',combat:{cost:6,hp:70,damage:14,period:17,cooldown:48}},
    {id:'spear_2',role:'spear',rarity:2,model:'halberd',trait:'cleave',combat:{cost:7,hp:66,damage:18,period:26,cooldown:55}},
    {id:'horse_2',role:'horse',rarity:2,model:'lancer',trait:'push',combat:{cost:9,hp:85,damage:24,period:23,cooldown:80}},
    {id:'bow_2',role:'bow',rarity:2,model:'firebow',trait:'blast',combat:{cost:7,damage:15,period:28,cooldown:62}},
    {id:'cannon_0',role:'cannon',rarity:2,model:'cannon',trait:'rocket'},
    {id:'medic_0',role:'medic',rarity:1,model:'medic',trait:'mend'},
    {id:'drummer_0',role:'drummer',rarity:1,model:'drummer',trait:'rally'},
    {id:'scout_0',role:'scout',rarity:0,model:'scout',trait:'ambush'},
  ];
  const starters=roles.map(role=>role+'_0');
  const upgradeCosts=[20,30,45,65,90,120,160,210,270];
  const packs={free:{cost:0,min:3,max:6},coin:{currency:'coins',cost:100,min:2,max:5},diamond:{currency:'diamonds',cost:60,min:12,max:20}};
  const integer=(value,max=999999)=>Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):0;
  const card=id=>cards.find(c=>c.id===id);
  const utcDay=(now=Date.now())=>Math.floor(now/86400000);
  function normalize(saved) {
    const current=saved?.schema===2,legacy=saved?.schema===1;
    const army={schema:2,coins:current?integer(saved.coins):400+(legacy?integer(saved.seals)*100+integer(saved.dust)*5:0),
      diamonds:current?integer(saved.diamonds):120,draws:integer(saved?.draws),rarePity:integer(saved?.rarePity,9),epicPity:integer(saved?.epicPity,29),
      freeDay:current&&Number.isInteger(saved.freeDay)?Math.max(-1,saved.freeDay):-1,owned:{},equipped:[]};
    for(const c of cards){
      const base=starters.includes(c.id)?1:0,entry=saved?.owned?.[c.id];
      let stars=base,shards=0;
      if(current){stars=Math.max(base,integer(entry?.stars,10));shards=integer(entry?.shards);}
      else if(legacy){const copies=integer(entry,15),old=[1,3,6,10,15];stars=Math.max(base,old.filter(n=>copies>=n).length);if(stars&&stars<5)shards=Math.floor((copies-old[stars-1])/(old[stars]-old[stars-1])*upgradeCosts[stars-1]);}
      army.owned[c.id]={stars,shards:stars===10?0:Math.max(0,shards)};
    }
    const selected=current?saved.equipped:legacy?roles.map(role=>saved.equipped?.[role]):starters;
    for(const id of [...(Array.isArray(selected)?selected:[]),...starters])if(card(id)&&army.owned[id].stars>0&&!army.equipped.includes(id)&&army.equipped.length<4)army.equipped.push(id);
    army.coins=integer(army.coins);return army;
  }
  function stats(army,id){const c=card(id),entry=army.owned[id];return {...c,stars:entry.stars,hp:1+c.rarity*.15+Math.max(0,entry.stars-1)*.12,damage:1+c.rarity*.15+Math.max(0,entry.stars-1)*.10};}
  function loadout(army){return Object.fromEntries(army.equipped.map(id=>[id,stats(army,id)]));}
  function equip(army,id,slot=0){if(!card(id)||!army.owned[id]?.stars||!Number.isInteger(slot)||slot<0||slot>3||army.equipped.includes(id))return false;army.equipped[slot]=id;return true;}
  function needed(army,id){const star=army.owned[id].stars;return star===0?10:star>=10?0:upgradeCosts[star-1];}
  function upgrade(army,id){if(!card(id))return false;const entry=army.owned[id],cost=needed(army,id);if(!cost||entry.shards<cost)return false;entry.shards-=cost;entry.stars++;if(entry.stars===10){army.coins=integer(army.coins+entry.shards*5);entry.shards=0;}return true;}
  function grant(army,id,amount){const entry=army.owned[id];if(entry.stars===10){const coins=amount*5;army.coins=integer(army.coins+coins);return coins;}entry.shards=integer(entry.shards+amount);return 0;}
  function canDraw(army,kind,now=Date.now()){const pack=packs[kind];return Boolean(pack&&(kind==='free'?utcDay(now)>army.freeDay:army[pack.currency]>=pack.cost));}
  function draw(army,kind='coin',random=Math.random,now=Date.now()){
    if(!canDraw(army,kind,now))return null;
    const randomUnit=()=>Math.max(0,Math.min(.999999,Number(random())||0)),roll=randomUnit();
    let rarity=roll<.72?0:roll<.96?1:2;
    if(army.epicPity>=29)rarity=2;else if(army.rarePity>=9)rarity=roll<.96?1:2;
    const pool=cards.filter(c=>c.rarity===rarity),c=pool[Math.floor(randomUnit()*pool.length)],pack=packs[kind];
    const amount=pack.min+Math.floor(randomUnit()*(pack.max-pack.min+1));
    if(kind==='free'){army.freeDay=utcDay(now);army.diamonds=integer(army.diamonds+10);}else army[pack.currency]-=pack.cost;
    army.draws++;army.rarePity=rarity>=1?0:army.rarePity+1;army.epicPity=rarity===2?0:army.epicPity+1;
    const coins=grant(army,c.id,amount);
    return {id:c.id,rarity,amount,coins,ready:needed(army,c.id)>0&&army.owned[c.id].shards>=needed(army,c.id),unlocked:army.owned[c.id].stars>0,diamonds:kind==='free'?10:0};
  }
  function reward(army,level,first){const amount={coins:first?(level.bossKind?300:180):60,diamonds:first?(level.bossKind?40:15):0};army.coins=integer(army.coins+amount.coins);army.diamonds=integer(army.diamonds+amount.diamonds);return amount;}
  window.ZhaoArmy={cards,roles,starters,upgradeCosts,packs,card,utcDay,normalize,stats,loadout,equip,needed,upgrade,grant,canDraw,draw,reward};
})();
