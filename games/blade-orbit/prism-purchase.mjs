import {STORE} from './model.mjs?v=4';
export const PRISM_SKU='blade-orbit:starcrystal-inlay-v1';
export const PRISM_COST=5;
function deliver(state,storage){
 const newlyOwned=!state.prismInlayOwned;
 state.prismInlayOwned=true;if(newlyOwned)state.prismInlayEquipped=true;
 try{storage.setItem(STORE,JSON.stringify(state));const saved=JSON.parse(storage.getItem(STORE)||'null');if(saved?.prismInlayOwned!==true||saved.prismInlayEquipped!==state.prismInlayEquipped)throw Error('Save unconfirmed');return {ok:true,pending:false};}
 catch{return {ok:true,pending:true};}
}
export function recoverPrismInlay(state,storage,wallet){
 try{if(!wallet?.owns?.(PRISM_SKU))return {ok:true,pending:false};return deliver(state,storage);}
 catch{return {ok:false,pending:true};}
}
export async function buyPrismInlay(state,storage,wallet){
 if(!wallet?.purchasePermanent)return {ok:false,reason:'storage'};
 let result;try{result=await wallet.purchasePermanent(PRISM_SKU,PRISM_COST);}catch{return {ok:false,reason:'storage'};}
 if(!result?.ok)return {ok:false,reason:result?.reason||'storage'};
 // Ownership and debit share the wallet's atomic durable receipt. A failed game
 // save can be delivered again from that receipt without another debit.
 return {...deliver(state,storage),alreadyOwned:result.alreadyOwned===true};
}
