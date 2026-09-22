import { gear } from './campaign.js?v=4';
export const MAX_RANK=50;
export const shardsNeeded=rank=>10*(rank+1);
export const tier=g=>g.unlock>=15?3:g.unlock>=8?2:g.unlock?1:0;
export function dropChance(stage,boss=false){return boss?.18:.025+.045*(stage-1)/29;}
export function rollLoot(stage,boss=false,random=Math.random){
  if(random()>=dropChance(stage,boss))return null;
  const pool=gear.filter(g=>g.unlock<=stage);
  const weights=pool.map(g=>g.unlock?1+(stage-g.unlock)*.16:1);
  let roll=random()*weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0)return pool[i].id;}
  return pool.at(-1).id;
}
export function collectGear(save,id){
  if(!gear.some(g=>g.id===id))return null;
  const item=save.collection[id];
  if(item){item.shards=Math.min(999999,item.shards+1);return {id,fresh:false,...item};}
  save.collection[id]={rank:0,shards:0};return {id,fresh:true,rank:0,shards:0};
}
export function promoteGear(save,id){
  const item=save.collection[id];
  if(!item||item.rank>=MAX_RANK||item.shards<shardsNeeded(item.rank))return false;
  item.shards-=shardsNeeded(item.rank);item.rank++;return true;
}
export function equipmentPower(loadout,collection){
  const items=loadout.map(id=>({g:gear.find(g=>g.id===id),rank:collection[id]?.rank||0}));
  return {
    attack:1+items.reduce((n,{g,rank})=>n+(g?.slot==='axe'?.12:.025)*rank+(g?.slot==='axe'?.15:.035)*tier(g||{}),0),
    health:items.reduce((n,{g,rank})=>n+(g?.slot==='axe'?0:rank*6+tier(g||{})*8),0)
  };
}
