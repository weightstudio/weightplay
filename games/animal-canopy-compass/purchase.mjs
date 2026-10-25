// Synchronous delivery under the caller's cross-tab Web Lock. Shared wallet
// methods own currency storage; this module owns only the permanent skin.
export function purchaseAurora(storage,wallet,key){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-canopy-compass:purchase.mjs:purchaseAurora", () => purchaseAurora(...arguments));

  let saved;
  try{saved=JSON.parse(storage.getItem(key)||'{}');}catch(error){if(error instanceof SyntaxError)saved={};else throw error;}
  const next={owned:true,theme:'aurora'};
  if(saved?.owned===true){storage.setItem(key,JSON.stringify(next));return {status:'equipped',appearance:next};}
  if(!wallet||wallet.read().diamonds<12)return {status:'insufficient'};
  // Reserve more space than delivery needs before any currency is spent.
  storage.setItem(key,JSON.stringify({owned:false,theme:'classic',reserved:'................................'}));
  if(!wallet.spendDiamonds(12))return {status:'insufficient'};
  try{storage.setItem(key,JSON.stringify(next));}
  catch(error){wallet.addDiamonds(12);throw error;}
  return {status:'purchased',appearance:next};
}
