export const COLLECTION_KEY='weightplay-animal-firefly-folio-collection-v1';
export const AURORA_COST=12;
export function readCollection(storage){
  try {const raw=JSON.parse(storage.getItem(COLLECTION_KEY)||'{}');return {owned:raw.owned===true,equipped:raw.owned===true&&raw.equipped===true};}
  catch{return {owned:false,equipped:false};}
}
// Both writes are synchronous. Ownership is staged before the shared wallet is
// charged; a failed final save refunds through the same wallet API.
export function buyAurora(storage,wallet){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-firefly-folio:collection.mjs:buyAurora", () => buyAurora(...arguments));

  const before=readCollection(storage);
  if(before.owned)return {ok:true,alreadyOwned:true,value:before};
  if(!wallet||wallet.read().diamonds<AURORA_COST)return {ok:false,reason:'balance'};
  const old=storage.getItem(COLLECTION_KEY);let charged=false;
  try{
    storage.setItem(COLLECTION_KEY,JSON.stringify({owned:false,pending:true}));
    if(!wallet.spendDiamonds(AURORA_COST))throw Error('balance');
    charged=true;
    const value={owned:true,equipped:true};
    storage.setItem(COLLECTION_KEY,JSON.stringify(value));
    return {ok:true,value};
  }catch(error){
    let refundFailed=false;
    if(charged){try{wallet.addDiamonds(AURORA_COST);}catch{refundFailed=true;}}
    try{if(old===null)storage.removeItem(COLLECTION_KEY);else storage.setItem(COLLECTION_KEY,old);}catch{}
    return {ok:false,reason:refundFailed?'refund':error.message==='balance'?'balance':'storage'};
  }
}
export function equipAurora(storage,equipped){
  const value=readCollection(storage);
  if(equipped&&!value.owned)return false;
  storage.setItem(COLLECTION_KEY,JSON.stringify({...value,equipped}));
  return true;
}
