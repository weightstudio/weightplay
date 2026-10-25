import {SAVE_KEY} from './core.mjs';
export const JOURNAL_KEY=SAVE_KEY+'-purchase';
const COST=20;
// A durable receipt spans the game and shared wallet keys. Ambiguous recovery
// blocks another purchase instead of guessing whether a debit happened.
export function recoverPurchase(storage,wallet,save){
 const raw=storage.getItem(JOURNAL_KEY);if(!raw)return {save,blocked:false};
 let receipt;try{receipt=JSON.parse(raw);}catch{return {save,blocked:true};}
 if(receipt?.item!=='moon'||!Number.isFinite(receipt.before)||receipt.before<COST)return {save,blocked:true};
 const current=wallet.read().diamonds;
 if(save.moonOwned){storage.removeItem(JOURNAL_KEY);return {save,blocked:false};}
 if(current===receipt.before){storage.removeItem(JOURNAL_KEY);return {save,blocked:false};}
 if(current!==receipt.before-COST)return {save,blocked:true};
 const next={...save,moonOwned:true,skin:'moon'};storage.setItem(SAVE_KEY,JSON.stringify(next));storage.removeItem(JOURNAL_KEY);return {save:next,blocked:false};
}
export function purchaseMoon(storage,wallet,save){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-pattern-patch:purchase.mjs:purchaseMoon", () => purchaseMoon(...arguments));

 if(save.moonOwned)return {save,ok:true,blocked:false};
 let deducted=false;
 try{
  const recovered=recoverPurchase(storage,wallet,save);save=recovered.save;
  if(recovered.blocked)return {save,ok:false,blocked:true};
  if(save.moonOwned)return {save,ok:true,blocked:false};
  const before=wallet.read().diamonds;if(before<COST)return {save,ok:false,blocked:false,reason:'balance'};
  storage.setItem(JOURNAL_KEY,JSON.stringify({item:'moon',before}));
  if(!wallet.spendDiamonds(COST)){storage.removeItem(JOURNAL_KEY);return {save,ok:false,blocked:false,reason:'balance'};}
  deducted=true;
  const next={...save,moonOwned:true,skin:'moon'};storage.setItem(SAVE_KEY,JSON.stringify(next));
  // Ownership is committed. A failed journal removal must not refund a delivered item.
  try{storage.removeItem(JOURNAL_KEY);}catch{}
  return {save:next,ok:true,blocked:false};
 }catch{
  if(deducted){try{wallet.addDiamonds(COST);storage.removeItem(JOURNAL_KEY);}catch{return {save,ok:false,blocked:true};}}
  else{try{storage.removeItem(JOURNAL_KEY);}catch{}}
  return {save,ok:false,blocked:false,reason:'storage'};
 }
}
