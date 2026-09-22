import { MAX_RANK, shardsNeeded } from './loot.js?v=4';
export const companions=[
  {id:'nibs',name:'Nibs',zh:'栗栗',unlock:1,color:0xe8aa50,skill:'shatter'},
  {id:'moss',name:'Moss',zh:'苔苔',unlock:3,color:0x74ab69,skill:'shelter'},
  {id:'frost',name:'Frostwing',zh:'霜羽',unlock:8,color:0x8ccce2,skill:'frost'},
  {id:'ember',name:'Ember',zh:'燼燼',unlock:15,color:0xe68551,skill:'flame'}
];
export function rollCompanion(stage,boss=false,random=Math.random){
  if(random()>=(boss?1:.4))return null;
  const pool=companions.filter(c=>c.unlock<=stage);
  return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))].id;
}
export function collectCompanion(save,id){
  if(!companions.some(c=>c.id===id))return null;
  const item=save.companions[id];
  if(item){item.shards=Math.min(999999,item.shards+1);return {kind:'companion',id,fresh:false,...item};}
  save.companions[id]={rank:0,shards:0};return {kind:'companion',id,fresh:true,rank:0,shards:0};
}
export function promoteCompanion(save,id){
  const item=save.companions[id];
  if(!item||item.rank>=MAX_RANK||item.shards<shardsNeeded(item.rank))return false;
  item.shards-=shardsNeeded(item.rank);item.rank++;return true;
}
