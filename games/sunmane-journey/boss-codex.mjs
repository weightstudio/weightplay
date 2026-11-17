import {MAPS} from './data.mjs?wp-media=6a11f491c1d7042e';
import {monsterIndex} from './monster-index.mjs?wp-media=6a11f491c1d7042e';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
