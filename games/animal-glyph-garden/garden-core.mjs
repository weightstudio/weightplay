export const SHAPES = Object.freeze(['circle', 'triangle', 'square', 'star', 'diamond', 'heart']);
export const COLORS = Object.freeze(['blue', 'gold', 'violet', 'green', 'coral', 'amber']);
export const PALETTE = Object.freeze({blue: '#39b9ff', gold: '#ffe457', violet: '#af78ff', green: '#77d45e', coral: '#ff7790', amber: '#f99a36'});
export const SAVE_KEY = 'weightplay-glyph-garden-v9';
export const STYLE_COST = 8;
export const matches = (tile, target) => Boolean(tile && target &&
  (target.mode === 'shape' ? tile.shape === target.shape : target.mode === 'color' ? tile.color === target.color : tile.shape === target.shape && tile.color === target.color));

const blueprints = [
  ['circle','blue','bb'], ['triangle','gold','bbb'], ['square','violet','bbb'], ['star','green','bbbb'], ['diamond','coral','bbbb'],
  ['heart','amber','ss'], ['star','blue','sss'], ['diamond','gold','sss'], ['circle','violet','ssss'], ['square','green','ssbs'],
  ['triangle','coral','cc'], ['heart','blue','ccc'], ['diamond','violet','ccc'], ['star','amber','cccc'], ['circle','gold','ccbc'],
  ['square','coral','bsb'], ['triangle','green','bcb'], ['heart','violet','sbsb'], ['diamond','amber','cbcb'], ['star','gold','bscsb'],
  ['circle','green','scs'], ['square','blue','csc'], ['heart','coral','scbc'], ['triangle','violet','csbs'], ['diamond','green','bscbs'],
  ['star','coral','sbcb'], ['heart','gold','cbsb'], ['circle','amber','bcsbc'], ['square','gold','scbcs'], ['triangle','blue','bscbsb'],
];
const modeNames = {b:'both',s:'shape',c:'color'};
function shuffle(values, seed) {
  const out = [...values];
  for (let i=out.length-1; i>0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j=seed%(i+1); [out[i],out[j]]=[out[j],out[i]];
  }
  return out;
}
export function optionsFor(target, stage, step) {
  const s=SHAPES.indexOf(target.shape), c=COLORS.indexOf(target.color);
  const option=(ds,dc)=>({shape:SHAPES[(s+ds)%6],color:COLORS[(c+dc)%6]});
  const right=target.mode==='shape'?option(0,1+stage%5):target.mode==='color'?option(1+stage%5,0):option(0,0);
  const pool=target.mode==='shape'?[right,option(1,0),option(2,0),option(3,2),option(4,3),option(5,4)]:
    target.mode==='color'?[right,option(0,1),option(0,2),option(2,3),option(3,4),option(4,5)]:
    [right,option(0,1),option(1,0),option(0,2),option(2,0),option(3,3)];
  return shuffle(pool, 1979+stage*7919+step*131);
}
export const STAGES=Object.freeze(blueprints.map(([shape,color,sequence],index)=>{
  const targets=[...sequence].map((letter,step)=>({shape:SHAPES[(SHAPES.indexOf(shape)+step*2+Math.floor(step/3))%6],color:COLORS[(COLORS.indexOf(color)+step*3+Math.floor(step/2))%6],mode:modeNames[letter]}));
  return Object.freeze({id:index+1,arc:Math.floor(index/5)+1,checkpoint:(index+1)%5===0,targets,options:targets.map((t,step)=>optionsFor(t,index,step))});
}));
export function normalizeSave(raw={},legacy={}) {
  const valid=n=>Number.isInteger(n)&&n>=0&&n<STAGES.length;
  const solved=[...new Set([...(Array.isArray(legacy.solved)?legacy.solved:[]),...(Array.isArray(raw.solved)?raw.solved:[])].filter(valid))].sort((a,b)=>a-b);
  const best={};
  for(const [k,v] of Object.entries(raw.best||{})) if(valid(Number(k))&&Number.isInteger(v)&&v>=0) best[k]=v;
  const unlocked=Math.min(30,Math.max(1,Number.isInteger(raw.unlocked)?raw.unlocked:1,Number.isInteger(legacy.unlocked)?legacy.unlocked:1,...solved.map(i=>i+2)));
  const moon=raw.moon===true;
  const style=['dawn','sunset','moon'].includes(raw.style)&& (raw.style==='dawn'||raw.style==='moon'&&moon||raw.style==='sunset'&&solved.length>=10)?raw.style:'dawn';
  return {schema:9,solved,unlocked,best,moon,style};
}
export const mastery=mistakes=>mistakes===0?3:mistakes<=2?2:1;
export const totalMastery=save=>Object.values(save.best).reduce((n,v)=>n+mastery(v),0);
export const specimenOwned=(save,index)=>save.solved.includes(index*5+4);
export function settle(save,stageIndex,mistakes) {
  if(!Number.isInteger(stageIndex)||!STAGES[stageIndex]||!Number.isInteger(mistakes)||mistakes<0) throw new Error('INVALID_GARDEN_CLEAR');
  const next=normalizeSave(save);
  const first=!next.solved.includes(stageIndex);
  if(first) next.solved.push(stageIndex);
  next.solved.sort((a,b)=>a-b);
  next.unlocked=Math.max(next.unlocked,Math.min(30,stageIndex+2));
  next.best[stageIndex]=Math.min(next.best[stageIndex]??Infinity,mistakes);
  return {save:next,first,earned:mastery(mistakes),best:mastery(next.best[stageIndex]),specimen:first&&STAGES[stageIndex].checkpoint};
}
export function loadSave(storage) {
  const read=(key,fallback)=>{try{return JSON.parse(storage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
  return normalizeSave(read(SAVE_KEY,{}),{solved:read('weightplay-glyph-garden-solved-v4',[]),unlocked:read('weightplay-glyph-garden-unlocked-v4',1)});
}
export function persistSave(storage,save) {
  const normalized=normalizeSave(save);
  const serialized=JSON.stringify(normalized);
  storage.setItem(SAVE_KEY,serialized);
  if(storage.getItem(SAVE_KEY)!==serialized) throw new Error('GARDEN_SAVE_UNCONFIRMED');
  return normalized;
}

// The journal is written before the shared wallet is touched. One Web Lock
// serializes this game's purchase and progress saves across its own tabs.
export const PURCHASE_KEY='weightplay-glyph-garden-moon-pending-v9';
export function recoverPurchase(storage,wallet) {
  const pending=storage.getItem(PURCHASE_KEY);
  if(!pending) return loadSave(storage);
  const journal=JSON.parse(pending);
  if(journal.item!=='moon'||!Number.isFinite(journal.before)||journal.after!==journal.before-STYLE_COST) throw new Error('GARDEN_PURCHASE_REVIEW');
  const save=loadSave(storage),balance=wallet.read().diamonds;
  if(save.moon) {storage.removeItem(PURCHASE_KEY);return save;}
  if(balance===journal.after) {
    const next=persistSave(storage,{...save,moon:true,style:'moon'});
    storage.removeItem(PURCHASE_KEY);return next;
  }
  if(balance===journal.before) {storage.removeItem(PURCHASE_KEY);return save;}
  // An unrelated wallet change is not evidence that this purchase succeeded.
  throw new Error('GARDEN_PURCHASE_REVIEW');
}
export function buyMoon(storage,wallet) {
  let save=recoverPurchase(storage,wallet);
  if(save.moon) return {save,status:'owned'};
  const before=wallet.read().diamonds;
  if(before<STYLE_COST) return {save,status:'insufficient'};
  persistSave(storage,save); // Fail before a charge when this game's storage is unavailable.
  storage.setItem(PURCHASE_KEY,JSON.stringify({item:'moon',before,after:before-STYLE_COST}));
  if(!wallet.spendDiamonds(STYLE_COST)) {storage.removeItem(PURCHASE_KEY);return {save,status:'insufficient'};}
  // If entitlement writing fails, retain the intent for exact-balance recovery.
  save=persistSave(storage,{...save,moon:true,style:'moon'});
  storage.removeItem(PURCHASE_KEY);
  return {save,status:'bought'};
}
