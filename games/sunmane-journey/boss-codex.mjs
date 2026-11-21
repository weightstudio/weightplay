import {MAPS} from './data.mjs?wp-media=f8225020af9edaee';
import {monsterIndex} from './monster-index.mjs?wp-media=f8225020af9edaee';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
