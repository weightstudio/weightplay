import {expansionCost} from './progression.mjs';
// A durable game-owned delivery journal; premium balance stays in the shared
// wallet. Tests inject both dependencies and never touch an account wallet.
const journalKey=key=>`${key}.capacity-purchase`;
function persist(state,storage,key){storage.setItem(key,JSON.stringify(state));if(JSON.parse(storage.getItem(key)||'null')?.collectionTier!==state.collectionTier)throw Error('Save verification failed');}
export function recoverExpansion({state,storage,wallet,key}){
 let raw;try{raw=storage.getItem(journalKey(key));}catch{return {ok:false,reason:'purchaseError'};}
 if(!raw)return {ok:true,recovered:false};
 try{
  const tx=JSON.parse(raw);if(tx.key!==key||!Number.isInteger(tx.from)||tx.from<0||tx.from>=6||tx.to!==tx.from+1||tx.cost!==5+3*tx.from||tx.base!==state.collectionBase||!['prepared','charged'].includes(tx.phase)||!Number.isFinite(tx.before))return {ok:false,reason:'purchasePending'};
  if(state.collectionTier>=tx.to){persist(state,storage,key);storage.removeItem(journalKey(key));return {ok:true,recovered:true};}
  if(state.collectionTier!==tx.from)return {ok:false,reason:'purchasePending'};
  if(tx.phase==='prepared'){
   if(!wallet?.read)return {ok:false,reason:'purchasePending'};
   const balance=wallet.read().diamonds;
   if(balance===tx.before){storage.removeItem(journalKey(key));return {ok:true,recovered:false};}
   // If another wallet consumer changed the balance, retain the journal and
   // block another charge rather than guessing that this purchase was paid.
   if(balance!==tx.before-tx.cost)return {ok:false,reason:'purchasePending'};
   tx.phase='charged';storage.setItem(journalKey(key),JSON.stringify(tx));
  }
  state.collectionTier=tx.to;persist(state,storage,key);storage.removeItem(journalKey(key));return {ok:true,recovered:true};
 }catch{return {ok:false,reason:'purchasePending'};}
}
export function purchaseExpansion({state,storage,wallet,key,expectedTier}){
 const cost=expansionCost(state);if(cost===null)return {ok:false,reason:'maxCapacity'};
 if(expectedTier!==state.collectionTier)return {ok:false,reason:'stalePurchase'};
 if(!wallet?.read||!wallet?.spendDiamonds)return {ok:false,reason:'purchaseError'};
 try{
  if(storage.getItem(journalKey(key))){const previous=recoverExpansion({state,storage,wallet,key});return {...previous,ok:false,reason:previous.ok?'stalePurchase':'purchasePending'};}
  const before=wallet.read().diamonds;if(!Number.isFinite(before)||before<cost)return {ok:false,reason:'diamonds'};
  const tx={key,from:state.collectionTier,to:state.collectionTier+1,base:state.collectionBase,cost,before,phase:'prepared'};
  storage.setItem(journalKey(key),JSON.stringify(tx));
  let charged=false;try{charged=wallet.spendDiamonds(cost);}catch{const recovery=recoverExpansion({state,storage,wallet,key});return recovery.recovered?{ok:true,pending:!recovery.ok}:{ok:false,reason:recovery.ok?'purchaseError':'purchasePending'};}
  if(!charged){storage.removeItem(journalKey(key));return {ok:false,reason:'diamonds'};}
  tx.phase='charged';try{storage.setItem(journalKey(key),JSON.stringify(tx));}catch{const recovery=recoverExpansion({state,storage,wallet,key});return {ok:recovery.recovered===true,pending:!recovery.ok,reason:'purchasePending'};}
  state.collectionTier=tx.to;
  try{persist(state,storage,key);storage.removeItem(journalKey(key));return {ok:true,cost};}catch{return {ok:true,cost,pending:true};}
 }catch{return {ok:false,reason:'purchaseError'};}
}
