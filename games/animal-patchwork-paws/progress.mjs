export const SAVE_KEY='weightplay-animal-patchwork-paws-workshop-v13';
const LEGACY='weightplay-animal-patchwork-paws-';
const int=n=>Number.isInteger(n)&&n>=0&&n<30;
const parse=(storage,key,fallback)=>{try{return JSON.parse(storage.getItem(key))??fallback;}catch{return fallback;}};
export function readProgress(storage) {
  const raw=parse(storage,SAVE_KEY,{}), old=parse(storage,LEGACY+'cleared-v3',[]);
  const cleared=[...new Set([...(Array.isArray(raw.cleared)?raw.cleared:[]),...(Array.isArray(old)?old:[])].filter(int))].sort((a,b)=>a-b);
  const legacy=Number(parse(storage,LEGACY+'unlocked-v3',1));
  const unlocked=Math.min(30,Math.max(1,Number.isFinite(legacy)?Math.floor(legacy):1,...cleared.map(i=>i+2)));
  const records={};for(const [k,v] of Object.entries(raw.records||{}))if(int(Number(k))&&v&&Number.isInteger(v.turns)&&v.turns>=0)records[k]={turns:v.turns,mastered:v.mastered===true};
  return {cleared,unlocked,records,moon:raw.moon===true,fabric:['linen','sage','river','moon'].includes(raw.fabric)?raw.fabric:'linen'};
}
export const owns=(data,fabric)=>fabric==='linen'||fabric==='sage'&&data.cleared.length>=5||fabric==='river'&&data.cleared.length>=10||fabric==='moon'&&data.moon;
export function saveProgress(storage,data){storage.setItem(SAVE_KEY,JSON.stringify(data));}
export function mergeProgress(saved,current){
  const records={...saved.records};
  for(const [key,value] of Object.entries(current.records)){const old=records[key];records[key]={turns:Math.min(old?.turns??Infinity,value.turns),mastered:value.mastered||old?.mastered===true};}
  return {...current,cleared:[...new Set([...saved.cleared,...current.cleared])].sort((a,b)=>a-b),unlocked:Math.max(saved.unlocked,current.unlocked),moon:saved.moon||current.moon,records};
}
// Writes are synchronous under the browser's exclusive purchase lock. Persist
// entitlement first, then debit; failure restores the previous entitlement.
// A crash between these operations favors the player and never loses diamonds.
export function purchaseMoon(storage,wallet) {
  const data=readProgress(storage);
  if(data.moon)return {status:'owned',data};
  if(!wallet||wallet.read().diamonds<8)return {status:'funds',data};
  const previous=storage.getItem(SAVE_KEY);
  const next={...data,moon:true,fabric:'moon'};
  try{saveProgress(storage,next);}catch{return {status:'storage',data};}
  try{
    if(!wallet.spendDiamonds(8))throw Error('funds');
  }catch(error){
    try{if(previous===null)storage.removeItem(SAVE_KEY);else storage.setItem(SAVE_KEY,previous);}catch{/* No debit occurred; a retained entitlement favors the player. */}
    return {status:error.message==='funds'?'funds':'storage',data:readProgress(storage)};
  }
  return {status:'bought',data:next};
}
