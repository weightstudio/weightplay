import {MAPS} from './data.mjs?wp-media=fa9b405e44d52d00';
import {monsterIndex} from './monster-index.mjs?wp-media=fa9b405e44d52d00';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
