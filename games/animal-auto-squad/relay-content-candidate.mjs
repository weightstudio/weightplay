// Candidate content adapter for the existing v43 combat shape. This module is
// deliberately not imported by game.js until the save, UI, art and signal
// hooks are ready; constructing data alone never opens a stage.
import {RELAY_DRAFT} from './relay-candidate.mjs?v=20261027-auto-squad-relay-data1';
import {RELAY_COPY_LOCALES,relayCopy} from './relay-copy-candidate.mjs?v=20261027-auto-squad-relay-copy1';

const newKinds=['D','G','P','B35','B40','B45','B50','B55','B60'];
const legacyIds={W:1,T:11,R:14};
const newIds={D:200,G:201,P:202,B35:210,B40:211,B45:212,B50:213,B55:214,B60:215};
const modifiers={D:{atkMod:1.05,hpMod:.85},G:{atkMod:.8,hpMod:1.2},P:{atkMod:.9,hpMod:.9},
  B35:{atkMod:1.25,hpMod:3},B40:{atkMod:1.2,hpMod:3},B45:{atkMod:1.3,hpMod:3},
  B50:{atkMod:1.2,hpMod:3},B55:{atkMod:1.3,hpMod:3},B60:{atkMod:1.5,hpMod:3.5}};
const threatIndex={D:0,G:1,P:2};
const bossIndex={B35:0,B40:1,B45:2,B50:3,B55:4,B60:5};

export function createRelayContent({enemyMetadata,assetKeys,assetSources,isImageReady,formationSlotsForCount}) {
  if(!Array.isArray(enemyMetadata)||!assetKeys||!assetSources||typeof isImageReady!=='function'||typeof formationSlotsForCount!=='function')throw new TypeError('relay dependencies missing');
  const legacy=new Map();
  for(const [kind,id] of Object.entries(legacyIds)) {
    const matches=enemyMetadata.filter(item=>item?.id===id);
    if(matches.length!==1)throw Error(`legacy enemy unavailable: ${kind}`);
    const enemy=matches[0];
    const hasSheetCrop=['sx','sy','sw','sh'].every(field=>Number.isFinite(enemy[field]));
    if(!enemy.imageKey&&!hasSheetCrop)throw Error(`legacy portrait unavailable: ${kind}`);
    if(isImageReady(enemy.imageKey||'enemies')!==true)throw Error(`legacy artwork not loaded: ${kind}`);
    legacy.set(kind,matches[0]);
  }
  const imageKeys=newKinds.map(kind=>assetKeys[kind]);
  if(imageKeys.some(key=>typeof key!=='string'||!key.trim())||new Set(imageKeys).size!==newKinds.length)throw Error('distinct relay artwork required');
  const sources=newKinds.map(kind=>assetSources[kind]);
  if(sources.some(src=>typeof src!=='string'||!src.trim())||new Set(sources).size!==newKinds.length)throw Error('distinct relay artwork sources required');
  const legacyKeys=new Set([...legacy.values()].map(unit=>unit.imageKey||'enemies'));
  if(imageKeys.some(key=>legacyKeys.has(key)))throw Error('new relay art cannot reuse legacy portraits');
  if(imageKeys.some((key,index)=>isImageReady(key,sources[index])!==true))throw Error('relay artwork not loaded');
  const names={};
  for(const kind of newKinds){
    const boss=Object.hasOwn(bossIndex,kind),namesByLocale={},rolesByLocale={};
    for(const locale of RELAY_COPY_LOCALES){
      const c=relayCopy(locale,31),name=boss?c.bosses[bossIndex[kind]]:c.threats[threatIndex[kind]];
      if(typeof name!=='string'||!name.trim())throw Error(`missing locale for ${kind}`);
      namesByLocale[locale]=name;
      const role=boss?c.bossHelp[bossIndex[kind]]:c.threatHelp[threatIndex[kind]];
      if(typeof role!=='string'||!role.trim())throw Error(`missing role locale for ${kind}`);
      rolesByLocale[locale]=role;
    }
    names[kind]={id:newIds[kind],nameEn:namesByLocale.en,nameLocaleOwned:namesByLocale,roleEn:rolesByLocale.en,roleLocaleOwned:rolesByLocale,
      targetMode:'front',ability:'relay',imageKey:assetKeys[kind],isBoss:boss,...modifiers[kind]};
  }
  function definition(stage){
    const row=RELAY_DRAFT.find(item=>item.id===stage);
    if(!row)throw new RangeError('relay stage outside 31–60');
    const nameLocaleOwned=Object.fromEntries(RELAY_COPY_LOCALES.map(locale=>[locale,relayCopy(locale,stage).stageName]));
    return {id:row.id,region:7+Math.floor((stage-31)/5),nameEn:nameLocaleOwned.en,nameZht:nameLocaleOwned['zh-Hant'],nameLocaleOwned,
      waves:row.waves.map(wave=>wave.map(kind=>newIds[kind]??legacyIds[kind])),bossId:row.boss?newIds[row.boss]:null};
  }
  function regions(){return Array.from({length:6},(_,index)=>{
    const nameLocaleOwned=Object.fromEntries(RELAY_COPY_LOCALES.map(locale=>[locale,relayCopy(locale,31+index*5).arcName]));
    return {id:7+index,nameEn:nameLocaleOwned.en,nameZht:nameLocaleOwned['zh-Hant'],nameLocaleOwned};
  });}
  function copyMetadata(kind){return {...names[kind],nameLocaleOwned:{...names[kind].nameLocaleOwned},roleLocaleOwned:{...names[kind].roleLocaleOwned}};}
  function metadata(){return {enemies:['D','G','P'].map(copyMetadata),bosses:newKinds.slice(3).map(copyMetadata)};}
  function generateEnemySquad(stage,wave){
    const row=RELAY_DRAFT.find(item=>item.id===stage);
    if(!row||!Number.isInteger(wave)||wave<1||wave>5)throw new RangeError('invalid relay wave');
    const kinds=row.waves[wave-1],slots=formationSlotsForCount(kinds.length);
    if(!Array.isArray(slots)||slots.length!==kinds.length||new Set(slots).size!==slots.length||slots.some(slot=>!Number.isInteger(slot)||slot<0||slot>5))throw Error('invalid formation');
    // Same formulas as v43 enemyWaveStats; unlike that function, no 30-stage clamp.
    const attack=1+Math.floor((stage-1)/6)+Math.floor((wave-1)/2);
    const health=2+Math.floor((stage-1)/4)+Math.floor((wave-1)/2);
    const level=Math.max(1,Math.ceil((stage+wave-1)/5));
    return kinds.map((kind,index)=>{
      const metadata=names[kind]||legacy.get(kind);
      if(!metadata)throw Error(`unknown relay enemy: ${kind}`);
      const hp=Math.max(1,Math.round(health*(metadata.hpMod||1)));
      const atk=Math.max(1,Math.round(attack*(metadata.atkMod||1)));
      return {...metadata,relayKind:kind,formationSlot:slots[index],atk,hp,maxHp:hp,shield:false,shieldHp:0,level,abilityUsed:false};
    });
  }
  return Object.freeze({definition,regions,metadata,generateEnemySquad});
}
