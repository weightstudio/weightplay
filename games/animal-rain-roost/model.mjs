import {STAGES,EQUIPMENT} from './stages.mjs?v=6&wp-media=1cfa8fa23bc84100';
export const SAVE_KEY='weightplay-rain-roost-v6';
export const LEGACY_KEY='weightplay-rain-roost-best';
export const LANTERN_PRICE=15;
export const LANTERN_JOURNAL=SAVE_KEY+'-lantern-purchase';
const integer=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(Number(v))?Math.floor(Number(v)):min));
export function normalizeSave(value,legacy=0) {
  const v=value&&typeof value==='object'?value:{};
  const stars=Array.from({length:30},(_,i)=>integer(v.stars?.[i],0,3));
  // Unlocks must be contiguous; damaged data cannot invent completed stages.
  let cleared=0;while(stars[cleared]>0)cleared++;
  const unlocked=Math.min(30,cleared+1);
  const equipment=EQUIPMENT[v.equipment]&&EQUIPMENT[v.equipment].unlock<=cleared?v.equipment:'reed';
  return {schema:1,stars,bests:Array.from({length:30},(_,i)=>integer(v.bests?.[i],0,100000)),unlocked,equipment,lantern:v.lantern===true,lanternOn:v.lantern===true&&v.lanternOn!==false,legacyBest:Math.max(integer(legacy,0,100000),integer(v.legacyBest,0,100000))};
}
export function readSave(storage) {
  let value,legacy=0;try {legacy=Number(storage.getItem(LEGACY_KEY))||0;value=JSON.parse(storage.getItem(SAVE_KEY)||'null')}catch{}
  return normalizeSave(value,legacy);
}
export function mergeSave(a,b) {
  return normalizeSave({...a,stars:a.stars.map((n,i)=>Math.max(n,b.stars[i])),bests:a.bests.map((n,i)=>Math.max(n,b.bests[i])),lantern:a.lantern||b.lantern,legacyBest:Math.max(a.legacyBest,b.legacyBest)});
}
export function persistSave(storage,value) {
  const merged=mergeSave(normalizeSave(value),readSave(storage));
  const serialized=JSON.stringify(merged);
  storage.setItem(SAVE_KEY,serialized);
  if(storage.getItem(SAVE_KEY)!==serialized)throw new Error('Unconfirmed progress write');
  return merged;
}
export function createRun(stageId,equipment='reed') {
  const stage=STAGES[integer(stageId,1,30)-1];
  return {stage,equipment:EQUIPMENT[equipment]?equipment:'reed',time:0,x:2,targetX:2,caught:0,gold:0,combo:0,bestCombo:0,leaves:0,missed:0,score:0,guards:EQUIPMENT[equipment]?.guards||0,cursor:0,ended:false,result:null,phase:0};
}
export function move(run,lane) {run.targetX=Math.max(0,Math.min(4,Number(lane)||0));}
export function tick(run,dt,onEvent=()=>{}) {
  if(run.ended||!Number.isFinite(dt)||dt<=0)return;
  const end=run.time+dt,gear=EQUIPMENT[run.equipment];
  const advance=seconds=>{const distance=run.targetX-run.x;run.x+=Math.sign(distance)*Math.min(Math.abs(distance),seconds*9);};
  while(run.cursor<run.stage.events.length&&run.stage.events[run.cursor].at<=end) {
    const event=run.stage.events[run.cursor++];advance(Math.max(0,event.at-run.time));run.time=event.at;
    const caught=Math.abs(run.x-event.lane)<=(event.kind==='gold'?gear.goldRadius:gear.radius);
    if(event.kind==='leaf') {
      if(caught) {
        if(run.guards>0){run.guards--;onEvent('guard',event)}
        else{run.leaves++;run.combo=0;onEvent('leaf',event)}
      }
    }else if(caught){
      run.caught++;run.gold+=Number(event.kind==='gold');run.combo++;run.bestCombo=Math.max(run.bestCombo,run.combo);
      run.score+=(event.kind==='gold'?30:10)+Math.min(20,run.combo*2);onEvent(event.kind,event);
    }else{run.missed++;run.combo=0;onEvent('miss',event)}
  }
  advance(Math.max(0,end-run.time));run.time=end;
  const phase=Math.min(run.stage.phases-1,Math.floor(run.time/run.stage.duration*run.stage.phases));
  if(phase>run.phase){run.phase=phase;onEvent('phase',{phase})}
  if(run.time>=run.stage.duration){run.ended=true;run.result=resultFor(run);onEvent('result',run.result)}
}
export function resultFor(run) {
  const s=run.stage,win=run.caught>=s.target&&run.gold>=s.gold&&run.bestCombo>=s.streak&&run.leaves<=s.maxLeaves;
  const stars=win?1+Number(run.caught>=Math.ceil(s.total*.85))+Number(run.missed===0&&run.leaves===0):0;
  return {win,stars,score:run.score,caught:run.caught,gold:run.gold,combo:run.bestCombo,leaves:run.leaves,total:s.total};
}
export function commitResult(storage,save,run) {
  if(!run.ended||!run.result?.win)return save;
  const next=normalizeSave(save);const i=run.stage.index;
  next.stars[i]=Math.max(next.stars[i],run.result.stars);next.bests[i]=Math.max(next.bests[i],run.score);
  next.legacyBest=Math.max(next.legacyBest,run.caught);
  return persistSave(storage,next);
}
function confirmedWrite(storage,key,value,previous){
  try{if(value===null)storage.removeItem(key);else storage.setItem(key,value)}catch{}
  try{const actual=storage.getItem(key);return actual===value?'confirmed':actual===previous?'failed':'uncertain'}catch{return 'uncertain'}
}
function strictSave(storage){
  const raw=storage.getItem(SAVE_KEY),parsed=raw===null?null:JSON.parse(raw);
  if(raw!==null&&(!parsed||typeof parsed!=='object'||Array.isArray(parsed)))throw Error('Invalid save');
  return {raw,save:normalizeSave(parsed,Number(storage.getItem(LEGACY_KEY))||0)};
}
export function recoverLantern(storage,wallet,initial){
  try{
    const receiptRaw=storage.getItem(LANTERN_JOURNAL);if(receiptRaw===null)return {save:initial,blocked:false};
    const receipt=JSON.parse(receiptRaw);if(!Number.isFinite(receipt?.before)||receipt.before<LANTERN_PRICE)return {save:initial,blocked:true};
    const {raw,save}=strictSave(storage);
    if(save.lantern){try{storage.removeItem(LANTERN_JOURNAL)}catch{}return {save,blocked:false}}
    const balance=wallet.read().diamonds;
    if(balance===receipt.before)return {save,blocked:confirmedWrite(storage,LANTERN_JOURNAL,null,receiptRaw)!=='confirmed'};
    if(balance!==receipt.before-LANTERN_PRICE)return {save,blocked:true};
    const next=normalizeSave({...save,lantern:true,lanternOn:true}),serialized=JSON.stringify(next);
    if(confirmedWrite(storage,SAVE_KEY,serialized,raw)!=='confirmed')return {save,blocked:true};
    try{storage.removeItem(LANTERN_JOURNAL)}catch{}return {save:next,blocked:false};
  }catch{return {save:initial,blocked:true}}
}
export function buyLantern(storage,wallet) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-rain-roost:model.mjs:buyLantern", () => buyLantern(...arguments));
  let current=readSave(storage);
  try {
    const recovered=recoverLantern(storage,wallet,current);current=recovered.save;
    if(recovered.blocked)return {status:'uncertain',save:current};
    const snapshot=strictSave(storage);current=snapshot.save;if(current.lantern)return {status:'owned',save:current};
    const before=wallet.read().diamonds;if(!Number.isFinite(before))return {status:'uncertain',save:current};
    if(before<LANTERN_PRICE)return {status:'funds',save:current};
    const receipt=JSON.stringify({before}),status=confirmedWrite(storage,LANTERN_JOURNAL,receipt,null);
    if(status!=='confirmed')return {status:status==='failed'?'storage':'uncertain',save:current};
    let spent;try{spent=wallet.spendDiamonds(LANTERN_PRICE)}catch{return {status:'uncertain',save:current}}
    if(!spent)return {status:confirmedWrite(storage,LANTERN_JOURNAL,null,receipt)==='confirmed'?'funds':'uncertain',save:current};
    const next=normalizeSave({...current,lantern:true,lanternOn:true});
    if(confirmedWrite(storage,SAVE_KEY,JSON.stringify(next),snapshot.raw)!=='confirmed')return {status:'uncertain',save:current};
    try{storage.removeItem(LANTERN_JOURNAL)}catch{}return {status:'bought',save:next};
  }catch{return {status:'uncertain',save:current}}
}
