// Unconnected game-specific candidate. D/G/P and bosses are not integrated,
// localized or art-approved; this module never writes storage or grants rewards.
const rows=[
 [31,'one-mark','D/D+W/D+T/W+D/T+D'],
 [32,'split-mark','W/D+W/D+R/D+D/T+D'],
 [33,'guarded-flank','G/G+W/G+D/T+G/G+R+D'],
 [34,'row-or-ward','R/D+R/G+R/D+D+R/T+D+R'],
 [35,'talon-rear-cue','D+W/G+D/R+D/T+G+D/B35+D'],
 [36,'learn-flare','G/G+W/T+G/G+D/G+T+W'],
 [37,'two-shields','G+W/G+T/G+G/G+D/G+G+R'],
 [38,'expose-or-ward','D/G+D/G+D+W/D+D+T/G+D+R'],
 [39,'sweep-or-expose','R/G+R/G+W+R/D+R+T/G+G+R'],
 [40,'warden-boss-shield','G+W/G+D/G+R/G+T+D/B40+G'],
 [41,'signals-at-once','D+W/G+T/D+G/D+D+G/G+R+D'],
 [42,'two-rear-marks','D/D+D/D+R/G+D+D/T+D+D'],
 [43,'guarded-pack','W/G+W/G+W+W/T+G+W/G+W+W+R'],
 [44,'guarded-sweep','R/T+R/G+R/G+D+R/T+G+R+R'],
 [45,'crosswind-conflict','D+W/G+R/D+G/D+G+R/B45+D+G'],
 [46,'learn-seal','P/P+W/P+T/P+D/P+G'],
 [47,'two-jammers','P/P+P/P+W/P+P+D/P+P+T'],
 [48,'seal-or-flare','P+W/P+G/P+T/P+G+D/P+G+R'],
 [49,'healer-mark','D/P+D/P+D+W/P+D+R/P+D+D+T'],
 [50,'bellkeeper-pulse','P+W/P+G/P+D/P+G+R/B50+P'],
 [51,'save-supplies','G/D+G/P+G/P+D/P+D+G'],
 [52,'protected-target','G+W/G+G/P+G/D+G+G/P+G+G'],
 [53,'double-dive-jam','D/D+D/D+P/D+D+R/D+D+P'],
 [54,'change-order','P+W/G+R/D+P/G+D+R/P+G+D+T'],
 [55,'relay-twins','P+W/G+D/P+P/D+G+R/B55+P+D'],
 [56,'all-signals','D+W/G+T/P+R/D+G+P/D+G+P+W'],
 [57,'guard-network','G/G+G/G+P/G+G+D/G+G+P+R'],
 [58,'disrupted-recovery','P/P+P/P+D/P+P+R/P+P+D+T'],
 [59,'full-gauntlet','D+W/G+R/P+T/D+G+P/D+D+G+P+R'],
 [60,'regent-three-phases','D+G/P+R/D+G+P/D+D+G+P/B60+D+G+P'],
];
export const RELAY_DRAFT=Object.freeze(rows.map(([id,decision,pattern])=>Object.freeze({id,decision,waves:Object.freeze(pattern.split('/').map(w=>Object.freeze(w.split('+')))),boss:id%5===0?`B${id}`:null,potentialOrders:Object.freeze(id<36?['ward']:id<46?['ward','flare']:['ward','flare','seal']),firstClearReceipt:`stage-${id}`,next:id<60?id+1:null})));
export const RELAY_DRAFT_RESOURCES=Object.freeze({initialSupplies:12,orderCost:2,perWaveLimit:1,wardShield:4,guardShield:6,jamPenalty:4});

// The proposed relay layer uses six stable 1-based player slots. The adapter
// must map its events exactly once into existing combat; this is not connected.
export function createRelayWave({stage,wave,allies,supplies,confirmedProgress}){
  const row=RELAY_DRAFT.find(x=>x.id===stage);
  if(!row||!Number.isInteger(wave)||wave<1||wave>5||!Array.isArray(allies)||allies.length!==6||!Number.isSafeInteger(supplies)||supplies<0)throw new TypeError('invalid relay wave');
  const team=allies.map((unit,i)=>{
    if(unit===null)return null;
    if(!unit||!Number.isFinite(unit.hp)||!Number.isFinite(unit.maxHp)||!Number.isFinite(unit.shield)||unit.hp<0||unit.hp>unit.maxHp||unit.shield<0)throw new TypeError('invalid ally');
    return {slot:i+1,hp:unit.hp,maxHp:unit.maxHp,shield:unit.shield};
  });
  const actors=row.waves[wave-1].map((kind,index)=>({id:`${stage}:${wave}:${index}`,kind,actions:0,alive:true,shield:0}));
  const guards=actors.filter(x=>x.kind==='G'),eligible=actors.filter(x=>x.kind!=='G'),contributions=[];
  guards.forEach((guard,index)=>{const target=eligible.length?eligible[index%eligible.length]:guard;target.shield+=6;contributions.push({guard:guard.id,target:target.id,remaining:6});});
  const divers=actors.filter(x=>x.kind==='D'),marks=divers.map((actor,index)=>({actor:actor.id,slot:4+index}));
  if(marks.some(mark=>mark.slot>6))throw new RangeError('too many relay divers');
  const bossPlans={B35:['rear-4-and-5-at-action-2'],B40:['boss-shield-at-action-1'],B45:['rear-4-then-ally-shield-alternating'],B50:['jam-at-action-1','rear-4-at-action-2'],B55:['jam-at-actions-1-and-2'],B60:['rear-4-at-action-1','boss-shield-at-action-2','jam-at-action-3']};
  const bossCues=actors.filter(x=>bossPlans[x.kind]).map(x=>({actor:x.id,signals:[...bossPlans[x.kind]]}));
  const bossMarks={B35:[4,5],B45:[4],B50:[4],B60:[4]};
  const wardTargets=[...new Set([...marks.map(x=>x.slot),...actors.flatMap(x=>bossMarks[x.kind]||[])])].sort((a,b)=>a-b);
  // The adapter must pass an actual same-key validated/read-back snapshot. The
  // caller-provided flag is a contract, not proof by this unconnected module.
  const verified=confirmedProgress?.readbackVerified===true&&Array.isArray(confirmedProgress.completedStages)&&confirmedProgress.completedStages.every(x=>Number.isSafeInteger(x)&&x>=1&&x<=60);
  const clears=new Set(verified?confirmedProgress.completedStages:[]),orders=['ward'];
  if(stage>=36&&clears.has(35))orders.push('flare');
  if(stage>=46&&clears.has(35)&&clears.has(45))orders.push('seal');
  return {stage,wave,team,actors,contributions,marks,bossCues,wardTargets,supplies,orders,selected:null,started:false,jams:[],events:[]};
}
export function chooseRelayOrder(state,type,target){
  if(state.started)return {ok:false,reason:'order-locked'};
  if(type==='none'){state.selected={type};return {ok:true};}
  if(!state.orders.includes(type))return {ok:false,reason:'order-locked-stage'};
  if(state.supplies<2)return {ok:false,reason:'insufficient-supplies'};
  const actor=state.actors.find(x=>x.id===target);
  if(type==='ward'&&(!Number.isInteger(target)||!state.wardTargets.includes(target)))return {ok:false,reason:'invalid-target'};
  if(type==='flare'&&actor?.kind!=='G')return {ok:false,reason:'invalid-target'};
  if(type==='seal'&&!['P','B50','B55','B60'].includes(actor?.kind))return {ok:false,reason:'invalid-target'};
  state.selected={type,target,consumed:false};
  return {ok:true};
}
export function beginRelayWave(state){
  if(state.started)return {ok:false,reason:'wave-started'};
  state.selected??={type:'none'};
  const {type,target}=state.selected;
  if(type!=='none'&&state.supplies<2)return {ok:false,reason:'insufficient-supplies'};
  if(type!=='none')state.supplies-=2;
  if(type==='ward'){const ally=state.team[target-1];if(ally)ally.shield+=4;}
  if(type==='flare'){
    const layer=state.contributions.find(x=>x.guard===target),protectedActor=state.actors.find(x=>x.id===layer?.target);
    if(layer&&protectedActor){protectedActor.shield=Math.max(0,protectedActor.shield-layer.remaining);layer.remaining=0;}
  }
  state.started=true;return {ok:true};
}
export function relayFirstStrikeTarget(state,defaultTarget){
  if(!state.started)throw new Error('wave-not-started');
  if(state.selected?.type==='flare'&&!state.selected.consumed){state.selected.consumed=true;const actor=state.actors.find(x=>x.id===state.selected.target&&x.alive);if(actor)return actor.id;}
  return defaultTarget;
}
function hitMarked(state,slot,amount,source){
  const ally=state.team[slot-1]?.hp>0?state.team[slot-1]:state.team.find(x=>x&&x.hp>0);
  if(!ally)return {type:'no-target',source,slot};
  const blocked=Math.min(ally.shield,amount),damage=Math.min(ally.hp,amount-blocked);ally.shield-=blocked;ally.hp-=damage;
  return {type:'signal-hit',source,markedSlot:slot,targetSlot:ally.slot,amount,blocked,damage};
}
function pulse(state,actor){
  if(state.selected?.type==='seal'&&state.selected.target===actor.id&&!state.selected.consumed){state.selected.consumed=true;return {type:'pulse-sealed',source:actor.id};}
  state.jams.push(actor.id);return {type:'pulse-queued',source:actor.id};
}
export function relayEnemyAction(state,id){
  if(!state.started)throw new Error('wave-not-started');
  const actor=state.actors.find(x=>x.id===id);if(!actor||!actor.alive)return [];
  actor.actions++;let events=[];
  if(actor.kind==='D'&&actor.actions===2)events=[hitMarked(state,state.marks.find(x=>x.actor===id).slot,6,id)];
  if(actor.kind==='P'&&actor.actions===1)events=[pulse(state,actor)];
  if(actor.kind==='B35'&&actor.actions===2)events=[hitMarked(state,4,4,id),hitMarked(state,5,4,id)];
  if(actor.kind==='B40'&&actor.actions===1){const suppressed=state.selected?.type==='flare';if(!suppressed)actor.shield+=8;events=[{type:suppressed?'boss-shield-cancelled':'boss-shield',source:id,amount:suppressed?0:8}];}
  if(actor.kind==='B45'){
    if(actor.actions%2)events=[hitMarked(state,4,6,id)];
    else{const target=state.actors.find(x=>x!==actor&&x.alive)||actor;target.shield+=6;events=[{type:'boss-shield',source:id,target:target.id,amount:6}];}
  }
  if(actor.kind==='B50'&&actor.actions===1)events=[pulse(state,actor)];
  if(actor.kind==='B50'&&actor.actions===2)events=[hitMarked(state,4,6,id)];
  if(actor.kind==='B55'&&actor.actions<=2)events=[pulse(state,actor)];
  if(actor.kind==='B60'&&actor.actions===1)events=[hitMarked(state,4,6,id)];
  if(actor.kind==='B60'&&actor.actions===2){const suppressed=state.selected?.type==='flare';if(!suppressed)actor.shield+=8;events=[{type:suppressed?'boss-shield-cancelled':'boss-shield',source:id,amount:suppressed?0:8}];}
  if(actor.kind==='B60'&&actor.actions===3)events=[pulse(state,actor)];
  state.events.push(...events);return events;
}
export function relayHeal(state,slot,amount){
  if(!state.started)throw new Error('wave-not-started');
  if(!Number.isInteger(slot)||slot<1||slot>6||!Number.isFinite(amount)||amount<0)throw new TypeError('invalid heal');
  const ally=state.team[slot-1];if(!ally||ally.hp<=0)return {type:'heal-no-target',slot};
  const jam=state.jams.shift()??null,adjusted=Math.max(0,amount-(jam?4:0)),healed=Math.min(ally.maxHp-ally.hp,adjusted);ally.hp+=healed;
  const event={type:'heal',slot,requested:amount,jam,healed};state.events.push(event);return event;
}
