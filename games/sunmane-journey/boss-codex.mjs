import {MAPS} from './data.mjs?wp-media=bf4a43b46bf724ec';
import {monsterIndex} from './monster-index.mjs?wp-media=bf4a43b46bf724ec';
export function bossIndex(maps=MAPS){
 return monsterIndex(maps).filter(row=>row.tier==='boss').map(({id,definition,maps})=>({id,definition,maps}));
}
export function canNavigateBossMap(profile,mapId){return Number.isSafeInteger(mapId)&&MAPS.some(m=>m.id===mapId&&m.implemented!==false)&&mapId<=profile.unlocked;}
