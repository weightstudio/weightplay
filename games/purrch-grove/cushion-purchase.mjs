import {STORE} from './model.mjs';
const JOURNAL=STORE+'.cushion-purchase';
const persist=(state,storage)=>{storage.setItem(STORE,JSON.stringify(state));if(JSON.parse(storage.getItem(STORE)||'null')?.cushion!==true)throw Error('Save failed');};
export function recoverCushion(state,storage,wallet){
 try{const raw=storage.getItem(JOURNAL);if(!raw)return {ok:true};const tx=JSON.parse(raw);if(tx.item!=='moon-cushion-v1'||tx.cost!==5||!Number.isFinite(tx.before)||!['prepared','charged'].includes(tx.phase))return {ok:false};
  if(state.cushion){persist(state,storage);storage.removeItem(JOURNAL);return {ok:true};}
  if(tx.phase==='prepared'){if(!wallet?.read)return {ok:false};const balance=wallet.read().diamonds;if(balance===tx.before){storage.removeItem(JOURNAL);return {ok:true};}if(balance!==tx.before-5)return {ok:false};tx.phase='charged';storage.setItem(JOURNAL,JSON.stringify(tx));}
  state.cushion=true;persist(state,storage);storage.removeItem(JOURNAL);return {ok:true};
 }catch{return {ok:false};}
}
export function buyCushion(state,storage,wallet){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("purrch-grove:cushion-purchase.mjs:buyCushion", () => buyCushion(...arguments));

 if(state.cushion)return {ok:false,reason:'same'};
 try{if(storage.getItem(JOURNAL)){const r=recoverCushion(state,storage,wallet);return {ok:false,reason:r.ok?'same':'pending'};}
  if(!wallet?.read||!wallet?.spendDiamonds)return {ok:false,reason:'error'};const before=wallet.read().diamonds;if(!Number.isFinite(before)||before<5)return {ok:false,reason:'poor'};
  const tx={item:'moon-cushion-v1',cost:5,before,phase:'prepared'};storage.setItem(JOURNAL,JSON.stringify(tx));
  let charged;try{charged=wallet.spendDiamonds(5);}catch{const r=recoverCushion(state,storage,wallet);return {ok:state.cushion,pending:!r.ok,reason:'pending'};}
  if(!charged){storage.removeItem(JOURNAL);return {ok:false,reason:'poor'};}tx.phase='charged';storage.setItem(JOURNAL,JSON.stringify(tx));state.cushion=true;
  try{persist(state,storage);storage.removeItem(JOURNAL);return {ok:true};}catch{return {ok:true,pending:true};}
 }catch{return {ok:false,reason:'pending'};}
}
