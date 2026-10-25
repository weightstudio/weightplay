export const STORE_KEY='weightplay-animal-river-gates-v7-campaign-v1';
export const LOOK_KEY='weightplay-animal-river-gates-station-v1';
export const LOOK_COST=12;
export function readCampaign(storage,count=30) {
  let raw={};try{raw=JSON.parse(storage.getItem(STORE_KEY)||'{}')||{};}catch{}
  const solved=[...new Set((Array.isArray(raw.solved)?raw.solved:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=count))];
  const unlockedThrough=Math.min(count,Math.max(1,Number.isInteger(raw.unlockedThrough)?raw.unlockedThrough:1,...solved.map(n=>n+1)));
  const migration=raw.campaignRevision!==2 && solved.length>0;
  const best=Object.fromEntries(Object.entries(raw.best||{}).filter(([id,n])=>Number(id)>=1&&Number(id)<=count&&Number.isInteger(n)&&n>0));
  return {...raw,solved:migration?solved.filter(id=>id!==8):solved,unlockedThrough,campaignRevision:2,best};
}
export function recordWin(campaign,id,beats) {
  return {...campaign,solved:[...new Set([...campaign.solved,id])].sort((a,b)=>a-b),unlockedThrough:Math.min(30,Math.max(campaign.unlockedThrough,id+1)),best:{...campaign.best,[id]:Math.min(campaign.best[id]||Infinity,beats)},campaignRevision:2};
}
export function readLook(storage) {
  try{return JSON.parse(storage.getItem(LOOK_KEY)||'{}')||{};}catch{return {};}
}
// Journal first, debit through the platform API, then durable delivery. In the
// rare failed delivery write the debit is compensated; a surviving journal lets
// the next visit finish a debit that happened immediately before a page crash.
export function recoverLook(storage,wallet) {
  const look=readLook(storage);
  if(!look.pending)return look;
  const balance=wallet.read().diamonds;
  if(balance===look.pending.before-LOOK_COST) {
    const complete={owned:true,selected:true};storage.setItem(LOOK_KEY,JSON.stringify(complete));return complete;
  }
  if(balance===look.pending.before) {
    storage.setItem(LOOK_KEY,'{}');return {};
  }
  return look; // ambiguous concurrent wallet activity: do not debit again
}
export function purchaseLook(storage,wallet) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-river-gates:persistence.mjs:purchaseLook", () => purchaseLook(...arguments));

  let look;try{look=recoverLook(storage,wallet);}catch{return {ok:false,reason:'saveError'};}
  if(look.owned)return {ok:true,alreadyOwned:true,look};
  if(look.pending)return {ok:false,reason:'saveError'};
  const before=wallet.read().diamonds;
  if(before<LOOK_COST)return {ok:false,reason:'notEnough'};
  try{storage.setItem(LOOK_KEY,JSON.stringify({pending:{before}}));}catch{return {ok:false,reason:'saveError'};}
  let charged=false;
  try{
    charged=wallet.spendDiamonds(LOOK_COST);
    if(!charged){storage.setItem(LOOK_KEY,'{}');return {ok:false,reason:'notEnough'};}
    look={owned:true,selected:true};storage.setItem(LOOK_KEY,JSON.stringify(look));
    return {ok:true,look};
  }catch{
    if(charged){try{wallet.addDiamonds(LOOK_COST);}catch{return {ok:false,reason:'saveError'};}}
    try{storage.setItem(LOOK_KEY,'{}');}catch{}
    return {ok:false,reason:'saveError'};
  }
}
