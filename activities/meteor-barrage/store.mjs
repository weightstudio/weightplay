import {validRun} from './physics.mjs';
export const SAVE_KEY='weightplayMeteorBarrageV1';
export const emptySave=()=>({schema:1,revision:0,best:0,wins:0,skin:'standard',run:null});
export function validSave(d){return d?.schema===1&&['revision','best','wins'].every(k=>Number.isSafeInteger(d[k])&&d[k]>=0)&&['standard','violet'].includes(d.skin)&&(d.skin!=='violet'||d.wins>0)&&(d.run===null||validRun(d.run));}
export function readSave(storage) {
  const raw=storage.getItem(SAVE_KEY);if(raw===null)return emptySave();
  let d;try{d=JSON.parse(raw);}catch{throw Error('CORRUPT_SAVE');}
  if(!validSave(d))throw Error('CORRUPT_SAVE');
  return d;
}
export function makeStore(storage,locks) {
  return {read:()=>readSave(storage),async write(next,expected){
    if(!locks?.request)throw Error('LOCKS_UNAVAILABLE');
    return locks.request(SAVE_KEY,()=>{
      const before=readSave(storage);if(before.revision!==expected)throw Error('SAVE_CONFLICT');
      const after={...next,schema:1,revision:before.revision+1,best:Math.max(before.best,next.best),wins:Math.max(before.wins,next.wins)};
      if(!validSave(after))throw Error('INVALID_SAVE');
      storage.setItem(SAVE_KEY,JSON.stringify(after));return after;
    });
  }};
}
