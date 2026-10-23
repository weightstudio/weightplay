import {STAGES,EQUIPMENT} from './stages.mjs?v=6';
export const SAVE_KEY='weightplay-rain-roost-v6';
export const LEGACY_KEY='weightplay-rain-roost-best';
export const LANTERN_PRICE=15;
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
  storage.setItem(SAVE_KEY,JSON.stringify(merged));
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
// The caller holds a Web Lock and disables confirmation until this transaction ends.
// Debit only the shared wallet; rollback the actual debit if game persistence fails.
export function buyLantern(storage,wallet) {
  const current=readSave(storage);if(current.lantern)return {status:'owned',save:current};
  if(!wallet||wallet.read().diamonds<LANTERN_PRICE)return {status:'funds',save:current};
  let debited=false;
  try {
    if(!wallet.spendDiamonds(LANTERN_PRICE))return {status:'funds',save:current};
    debited=true;
    const saved=persistSave(storage,{...current,lantern:true,lanternOn:true});
    return {status:'bought',save:saved};
  }catch(error){
    if(debited){try{wallet.addDiamonds(LANTERN_PRICE)}catch(rollbackError){throw new AggregateError([error,rollbackError],'WALLET_ROLLBACK_FAILED')}}
    return {status:'storage',save:current};
  }
}
