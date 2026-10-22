import {SAVE_KEY,LEGACY_KEY,FINISH_COST,normalizeSave} from './core.mjs';
const JOURNAL=SAVE_KEY+':purchase';
export function readSave(storage){
  let value={},legacy=[];
  try{value=JSON.parse(storage.getItem(SAVE_KEY)||'{}');}catch{}
  try{legacy=JSON.parse(storage.getItem(LEGACY_KEY)||'[]');}catch{}
  const save=normalizeSave(value,legacy);
  for(let index=0;index<4;index++){
    try{const old=Number(storage.getItem('weightplay:animal-ring-garden:v10:best:'+index));if(Number.isInteger(old)&&old>0&&old<10000&&!save.best[index+1])save.best[index+1]=old;}catch{}
  }
  return save;
}
const grant=save=>normalizeSave({...save,owned:[...save.owned,'moonstone'],finish:'moonstone'});
// The journal survives interruption between the shared-wallet debit and ownership write.
export function recoverPurchase(storage,wallet){
  try{
    const pending=JSON.parse(storage.getItem(JOURNAL)||'null');if(!pending)return true;
    if(pending.version!==1||!Number.isFinite(pending.before)||pending.after!==pending.before-FINISH_COST)return false;
    const save=readSave(storage),balance=wallet.read().diamonds;
    if(!save.owned.includes('moonstone')){
      if(balance===pending.after)storage.setItem(SAVE_KEY,JSON.stringify(grant(save)));
      else if(balance!==pending.before)return false;
    }
    storage.removeItem(JOURNAL);return true;
  }catch{return false;}
}
export function purchaseMoonstone(storage,wallet){
  if(!recoverPurchase(storage,wallet))return {status:'storage'};
  const save=readSave(storage);if(save.owned.includes('moonstone'))return {status:'owned',save};
  const before=wallet.read().diamonds;if(before<FINISH_COST)return {status:'insufficient',save};
  let spent=false;
  try{
    storage.setItem(JOURNAL,JSON.stringify({version:1,before,after:before-FINISH_COST}));
    spent=wallet.spendDiamonds(FINISH_COST);
    if(!spent){storage.removeItem(JOURNAL);return {status:'insufficient',save};}
    const next=grant(save);storage.setItem(SAVE_KEY,JSON.stringify(next));
    try{storage.removeItem(JOURNAL);}catch{/* Ownership is durable; recovery clears this receipt. */}
    return {status:'purchased',save:next};
  }catch{
    if(spent){try{wallet.addDiamonds(FINISH_COST);storage.removeItem(JOURNAL);}catch{/* Retain receipt for recovery. */}}
    else{try{storage.removeItem(JOURNAL);}catch{}}
    return {status:'storage',save};
  }
}
