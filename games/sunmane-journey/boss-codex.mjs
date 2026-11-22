import {MAPS} from './data.mjs?wp-media=29fa7c7db5d94899';
import {monsterIndex} from './monster-index.mjs?wp-media=29fa7c7db5d94899';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
