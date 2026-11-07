import {MAPS} from './data.mjs?wp-media=1a67483c003e0833';
import {monsterIndex} from './monster-index.mjs?wp-media=1a67483c003e0833';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
