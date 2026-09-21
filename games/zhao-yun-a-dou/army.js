/* Earned-only collection. Pure save normalization, recruitment and loadout rules. */
(() => {
  'use strict';
  const roles=['blade','spear','horse','bow'];
  const traits=['shield','slow','burst','pierce','drain','cleave','push','blast'];
  const cards=Array.from({length:12},(_,i)=>({id:roles[i%4]+'_'+Math.floor(i/4),role:roles[i%4],rarity:Math.floor(i/4),trait:i<4?'':traits[i-4]}));
  const thresholds=[1,3,6,10,15];
  const integer=(value,max=999999)=>Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):0;
  const card=id=>cards.find(c=>c.id===id);
  const stars=copies=>thresholds.filter(n=>copies>=n).length;
  function normalize(saved) {
    const fresh=!saved||saved.schema!==1;
    const owned=Object.fromEntries(cards.map(c=>[c.id,Math.max(c.rarity===0?1:0,integer(saved?.owned?.[c.id],15))]));
    return {schema:1,seals:fresh?5:integer(saved.seals),dust:integer(saved?.dust,19),
      draws:integer(saved?.draws),rarePity:integer(saved?.rarePity,9),epicPity:integer(saved?.epicPity,29),owned,
      equipped:Object.fromEntries(roles.map(role=>{const selected=card(saved?.equipped?.[role]);return [role,selected?.role===role&&owned[selected.id]>0?selected.id:role+'_0'];}))};
  }
  function stats(army,id) {
    const c=card(id),star=stars(army.owned[id]);
    return {...c,stars:star,hp:1+c.rarity*.15+Math.max(0,star-1)*.12,damage:1+c.rarity*.15+Math.max(0,star-1)*.10};
  }
  function loadout(army) {return Object.fromEntries(roles.map(role=>[role,stats(army,army.equipped[role])]))};
  const power=(army,id)=>{const s=stats(army,id);return s.hp+s.damage+(s.trait ? .12 : 0);};
  function equip(army,id) {const c=card(id);if(!c||!army.owned[id])return false;army.equipped[c.role]=id;return true;}
  function draw(army,random=Math.random) {
    if(army.seals<1)return null;
    const roll=Math.max(0,Math.min(.999999,Number(random())||0));
    let rarity=roll<.72?0:roll<.96?1:2;
    if(army.epicPity>=29)rarity=2;
    else if(army.rarePity>=9)rarity=roll<.96?1:2;
    const pool=cards.filter(c=>c.rarity===rarity);
    const c=pool[Math.floor(Math.max(0,Math.min(.999999,Number(random())||0))*pool.length)];
    const before=army.owned[c.id],oldStars=stars(before);
    army.seals--;army.draws++;army.rarePity=rarity>=1?0:army.rarePity+1;army.epicPity=rarity===2?0:army.epicPity+1;
    let dust=0;
    if(before>=15){dust=[1,3,5][rarity];army.dust+=dust;army.seals+=Math.floor(army.dust/20);army.dust%=20;}
    else army.owned[c.id]++;
    const autoEquipped=power(army,c.id)>power(army,army.equipped[c.role]);
    if(autoEquipped)army.equipped[c.role]=c.id;
    return {id:c.id,rarity,newCard:before===0,promoted:stars(army.owned[c.id])>oldStars&&before>0,stars:stars(army.owned[c.id]),dust,autoEquipped};
  }
  function reward(army,level,first){const amount=first?(level.bossKind?5:3):1;army.seals=Math.min(999999,army.seals+amount);return amount;}
  window.ZhaoArmy={cards,roles,thresholds,card,stars,normalize,stats,loadout,equip,draw,reward};
})();
