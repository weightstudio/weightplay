// Persisted with the store's single locked transaction. No wall-clock rewards.
const count=value=>Number.isFinite(value)?Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(value))):0;
export const REWARD_TRACKS=Object.freeze([
  {id:'payments',base:10,reward:40}, {id:'restocked',base:40,reward:30},
  {id:'gross',base:1000,reward:60}, {id:'equipment',base:4,reward:30},
  {id:'minutes',base:5,reward:25}, {id:'service',base:10,reward:30}
]);
export function normalizeRewards(state={}){
  const old=state.achievementRewards;
  if(old?.schemaVersion===1)return {schemaVersion:1,claimed:Object.fromEntries(REWARD_TRACKS.map(t=>[t.id,Math.min(64,count(old.claimed?.[t.id]))])),
    restocked:count(old.restocked),equipment:count(old.equipment),service:count(old.service)};
  const rows=Array.isArray(state.cashLedger)?state.cashLedger:[];
  const a=state.achievements||{};
  return {schemaVersion:1,claimed:Object.fromEntries(REWARD_TRACKS.map(t=>[t.id,0])),
    restocked:rows.filter(r=>['restock','autoRestock','recoveryOrder'].includes(r.kind)).reduce((n,r)=>n+count(r.quantity),0),
    equipment:[...(state.fixtures||[]),...(state.warehouse||[])].length,
    service:count(a.baseline?.patientPayments)+(a.events||[]).filter(e=>e.type==='sale_settled'&&Number.isFinite(e.queueWaitSeconds)&&e.queueWaitSeconds>=0&&e.queueWaitSeconds<=17).length};
}
export function rewardOffer(state,id,activeSeconds=state.simulation?.activeSeconds||0){
  const track=REWARD_TRACKS.find(t=>t.id===id);if(!track)return null;
  const data=normalizeRewards(state),tier=data.claimed[id];
  // Exponential cumulative targets; modest, capped rewards grow much slower.
  const target=Math.min(Number.MAX_SAFE_INTEGER,Math.ceil(track.base*Math.pow(2,tier)));
  const progress={payments:count(state.transactions),restocked:data.restocked,gross:count(state.lifetime),equipment:data.equipment,minutes:Math.floor(Math.max(0,activeSeconds)/60),service:data.service}[id];
  return {id,tier,target,progress,reward:Math.min(150,Math.floor(track.reward*Math.pow(1.08,tier))),ready:progress>=target&&tier<64};
}
export function claimReward(state,id,expectedTier,activeSeconds=state.simulation?.activeSeconds||0){
  const offer=rewardOffer(state,id,activeSeconds);
  if(!offer||!offer.ready||offer.tier!==expectedTier||!Number.isFinite(state.cash))return {ok:false,state};
  const achievementRewards=normalizeRewards(state);achievementRewards.claimed[id]++;
  return {ok:true,reward:offer.reward,state:{...state,cash:state.cash+offer.reward,achievementRewards}};
}
export function normalizeOperatingFlow(value={},activeSeconds=value.activeSeconds||0){
  const time=Number.isFinite(activeSeconds)?Math.max(0,activeSeconds):0,cutoff=Math.floor(time)-59;
  const buckets=new Map();
  for(const row of Array.isArray(value.buckets)?value.buckets:[])if(Number.isInteger(row?.second)&&row.second>=cutoff&&row.second<=Math.floor(time)&&Number.isFinite(row.amount))buckets.set(row.second,(buckets.get(row.second)||0)+row.amount);
  return {schemaVersion:1,activeSeconds:time,buckets:[...buckets].sort((a,b)=>a[0]-b[0]).slice(-60).map(([second,amount])=>({second,amount}))};
}
export function recordStoreTransaction(state,entry){
  const data=normalizeRewards(state),amount=Number(entry.amount)||0;
  if(['restock','autoRestock','recoveryOrder'].includes(entry.kind))data.restocked=count(data.restocked+count(entry.quantity));
  if(['fixture','equipment'].includes(entry.kind))data.equipment=count(data.equipment+1);
  if(entry.kind==='sale'&&Number.isFinite(entry.queueWaitSeconds)&&entry.queueWaitSeconds>=0&&entry.queueWaitSeconds<=17)data.service=count(data.service+1);
  const flow=normalizeOperatingFlow(state.operatingFlow,state.operatingFlow?.activeSeconds??state.simulation?.activeSeconds??0);
  // Borrowed stock is costed on arrival; repayment is not deducted a second time.
  const operatingAmount=entry.kind==='sale'?amount+Math.max(0,-(entry.debtChange||0))
    :['restock','autoRestock'].includes(entry.kind)?amount:entry.kind==='recoveryOrder'?-Math.max(0,entry.debtChange||0):0;
  if(operatingAmount){const second=Math.floor(flow.activeSeconds),last=flow.buckets.at(-1);if(last?.second===second)last.amount+=operatingAmount;else flow.buckets.push({second,amount:operatingAmount});}
  return {...state,achievementRewards:data,operatingFlow:flow};
}
export function netProfitPerMinute(state,activeSeconds=state.operatingFlow?.activeSeconds||0){
  // A full 60-second denominator also during warm-up prevents extrapolation spikes.
  return Math.round(normalizeOperatingFlow(state.operatingFlow,activeSeconds).buckets.reduce((sum,row)=>sum+row.amount,0));
}
export function decorationTraffic(fixtures=[]){
  // Inventory never contributes. IDs dedupe malformed old ownership once.
  const seen=new Set();let weight=0,placed=0;
  for(const fixture of fixtures)if(fixture?.kind==='decor'&&(!fixture.id||!seen.has(fixture.id))){if(fixture.id)seen.add(fixture.id);placed++;weight+=({duck:4,bread:12,crown:30})[fixture.decorType]||1;}
  return {placed,weight,bonus:weight?0.5*weight/(weight+12):0};
}
