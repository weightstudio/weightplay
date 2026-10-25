// Shared-wallet adapter. All gameplay remains free; a finish is a permanent cosmetic.
export function purchaseFinish({saved,solved,name,wallet,write}) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-cairn-courier:finishes.mjs:purchaseFinish", () => purchaseFinish(...arguments));

  const owned=name==='moss'||saved.finishes.includes(name)||(name==='alpine'&&solved.length>=10);
  if(!owned&&name!=='aurora')return {status:'locked',saved};
  // Preflight game storage before the wallet is touched.
  write(saved);
  const next={...saved,finishes:[...saved.finishes],finish:name};
  let debited=false;
  try {
    if(!owned){
      if(!wallet.spendDiamonds(12))return {status:'insufficient',saved};
      debited=true;
    }
    if(!next.finishes.includes(name))next.finishes.push(name);
    write(next);
    return {status:'saved',saved:next};
  } catch(error) {
    if(debited)wallet.addDiamonds(12);
    throw error;
  }
}
