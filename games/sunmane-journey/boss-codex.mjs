import {MAPS} from './data.mjs?wp-media=cd3348b0d54e4a3c';
import {monsterIndex} from './monster-index.mjs?wp-media=cd3348b0d54e4a3c';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
