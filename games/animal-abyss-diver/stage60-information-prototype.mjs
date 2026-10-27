// PROTOTYPE_NOT_IN_GAME. Restricted adversarial information-set experiment.
// Every authored zone contributes exactly two hypothetical worlds: its
// original pair and its left/right swap. These are test variants, NOT a claim
// that the runtime has randomness or that no other hidden layouts are possible.
// Five v33 outcome signatures below are derived from game.js visible estimate
// triples. A/B are NEW proposed markers: their clue and scan identities are
// hypothetical, not a statement about current UI/locales/accessibility.
// The strategy is assumed to know each zone's unordered pair of possibilities
// and the outcome-estimate mapping, but not their hidden physical order. This
// is stronger knowledge than has been established for a new player. Marker
// progress is assumed visible after choice. Search excludes combat wins,
// shields, upgrades, beacon, and retries; no hidden order is in a policy key.

import {visibleClue,scanLabel} from './stage60-design-prototype.mjs';
const E={R:{oxygen:-10,salvage:1},C:{oxygen:-16,salvage:2},O:{oxygen:18,salvage:0},H:{oxygen:-28,salvage:0},F:{oxygen:-18,salvage:0},A:{oxygen:-10,salvage:1},B:{oxygen:-10,salvage:1}};
// Shared display definitions come from the design prototype; the proposal's
// distinct A/B cues and scan labels are not existing runtime content.
export const clueModes=Object.freeze(['masked','legacy-estimates','distinct-marker-proposal']);
function variants(pair){return pair[0]===pair[1]?[pair]:[pair,[pair[1],pair[0]]];}
function visible(stage,state,pair,mode){
 const flipped=stage.flows.includes(state.zone)&&!state.hold;
 const physical=flipped?[pair[1],pair[0]]:pair;
 return JSON.stringify({zone:state.zone,jammed:stage.jammed.includes(state.zone),flow:flipped,open:flipped?['right']:['left','right'],
  power:state.power,oxygen:state.oxygen,hp:state.hp,anchors:state.anchors,salvage:state.salvage,sequence:state.sequence,
  patrol:stage.patrol?.zones.includes(state.zone)?state.patrolLane:null,clues:physical.map(x=>visibleClue(x,mode))});
}
function scanned(stage,state,pair,markerScan){
 const flipped=stage.flows.includes(state.zone)&&!state.hold;
 const physical=flipped?[pair[1],pair[0]]:pair;
 return JSON.stringify(physical.map(symbol=>scanLabel(symbol,markerScan)));
}
function move(stage,state,pair,action){
 const flow=stage.flows.includes(state.zone),anchor=Boolean(action.anchor);
 if(anchor&&(!flow||state.hold||state.anchors<1||state.power<1))return null;
 const flipped=flow&&!anchor&&!state.hold;
 if((action.lane!==0&&action.lane!==1)||(flipped&&action.lane===0))return null;
 const symbol=pair[flipped?1-action.lane:action.lane];
 let sequence=state.sequence;
 if(symbol==='A'||symbol==='B') {if(stage.sequence[sequence]!==symbol)return null;sequence++;}
 const effect=E[symbol],oxygen=Math.min(100,state.oxygen+effect.oxygen);
 const patrolHere=stage.patrol?.zones.includes(state.zone),lane=action.lane?'right':'left';
 const hp=state.hp-(patrolHere&&state.patrolLane===lane?stage.patrol.damage:0);
 if(oxygen<=0||hp<=0)return null;
 const lost=(symbol==='H'||symbol==='F')?Math.min(state.salvage,stage.fragileCargo||0):0;
 const power=Math.min(4,state.power-(anchor?1:0)+(symbol==='O'?1:0)+(symbol==='F'?(stage.currentPower||0):0));
 const patrolLane=patrolHere&&stage.patrol.shiftAfter?(state.patrolLane==='left'?'right':'left'):state.patrolLane;
 return {symbol,state:{...state,zone:state.zone+1,oxygen,hp,power,anchors:state.anchors-(anchor?1:0),salvage:state.salvage-lost+effect.salvage,sequence,patrolLane,hold:false}};
}
function bossOptions(stage,state){
 if(state.zone!==stage.pairs.length||!stage.boss)return [{state,actions:[]}];
 if(state.sequence!==stage.sequence.length)return [];
 let possible=[{state,actions:[]}];
 for(const phase of stage.boss.phases){
  const next=[];
  for(const entry of possible)for(const option of phase){
   const s=entry.state,oxygen=s.oxygen-(option.oxygen||0),hp=s.hp-(option.hp||0),power=s.power-(option.power||0),anchors=s.anchors-(option.anchor||0),salvage=s.salvage-(option.salvage||0);
   if(oxygen<=0||hp<=0||power<0||anchors<0||salvage<0)continue;
   const patrolLane=option.shiftPatrol?(s.patrolLane==='left'?'right':'left'):s.patrolLane;
   next.push({state:{...s,oxygen,hp,power,anchors,salvage,patrolLane,hold:option.hold?true:s.hold},actions:[...entry.actions,option.action]});
  }
  possible=next;
 }
 return possible;
}
function prep(stage,state){
 const cost=stage.fish.includes(state.zone)?stage.escapeCost:0;
 return state.oxygen<=cost?null:{...state,oxygen:state.oxygen-cost};
}
function actions(stage,state){
 const canAnchor=stage.flows.includes(state.zone)&&!state.hold&&state.anchors>0&&state.power>0;
 return [{anchor:false,lane:0},{anchor:false,lane:1},...(canAnchor?[{anchor:true,lane:0},{anchor:true,lane:1}]:[])];
}

// AND/OR search: OR chooses one player action; AND requires it to work for
// every world with the SAME observation. Sonar, when legal, costs 2 and
// branches only after revealing the configured scan labels, with marker
// identity anonymous by default. An encountered marker/progress is observed after
// selecting a lane. Future zones are independently varied in this test set.
export function synthesize(stage,{mode='distinct-marker-proposal',markerScan='distinct-proposed'}={}){
 if(!clueModes.includes(mode))throw new TypeError('unknown clue mode');
 if(!['anonymous','distinct-proposed'].includes(markerScan))throw new TypeError('unknown marker scan mode');
 const memo=new Map();let visited=0;
 function seek(raw){
  const key=JSON.stringify(raw);if(memo.has(key))return memo.get(key);visited++;
  if(raw.zone>stage.pairs.length){const done=raw.oxygen>0&&raw.hp>0&&raw.salvage>=stage.target&&raw.sequence===stage.sequence.length?{done:true}:null;memo.set(key,done);return done;}
  const initial=prep(stage,raw);if(!initial){memo.set(key,null);return null;}
  for(const option of bossOptions(stage,initial)){
   const state=option.state,groups=new Map();
   for(const pair of variants(stage.pairs[state.zone-1])){const key=visible(stage,state,pair,mode);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(pair);}
   const strategy={};let all=true;
   for(const [observation,worlds] of groups){const choice=decide(state,worlds,true);if(!choice){all=false;break;}strategy[observation]=choice;}
   if(all){const node={boss:option.actions,groups:strategy};memo.set(key,node);return node;}
  }
  memo.set(key,null);return null;
 }
 function decide(state,worlds,allowScan){
  for(const action of actions(stage,state)){
   const next={};let valid=true;
   for(const pair of worlds){const result=move(stage,state,pair,action);if(!result){valid=false;break;}const child=seek(result.state);if(!child){valid=false;break;}next[result.symbol]=child;}
   if(valid)return {type:'move',...action,next};
  }
  if(allowScan&&!stage.jammed.includes(state.zone)&&state.power>=2){
   const scannedState={...state,power:state.power-2},groups=new Map();
   for(const pair of worlds){const key=scanned(stage,state,pair,markerScan);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(pair);}
   const choices={};let valid=true;
   for(const [key,group] of groups){const found=decide(scannedState,group,false);if(!found){valid=false;break;}choices[key]=found;}
   if(valid)return {type:'scan',choices};
  }
  return null;
 }
 const initial={zone:1,oxygen:100,hp:30,power:stage.startBattery??4,anchors:2,salvage:0,sequence:0,patrolLane:stage.patrol?.initial??null,hold:false};
 const policy=seek(initial);
 return {guaranteed:Boolean(policy),mode,markerScan,visited,policy,initial,assumptions:'independent pair swaps; prior knowledge of each unordered pair and estimate mapping; v33 signatures assumed distinguishable; marker cues and scan identity are hypotheses; marker progress visible; no combat, shields, upgrades or retries'};
}

// Independent certificate replay over every enumerated hidden-layout world.
// Branch on visible cues and revealed results only; unknown policy entries fail.
export function verifyPolicy(stage,result){
 if(!result.guaranteed||!result.policy)return {verified:false,worlds:0,reason:'no-policy'};
 let worlds=0;
 function walk(zone,raw,node){
  if(zone>stage.pairs.length){if(!node.done||raw.oxygen<=0||raw.hp<=0||raw.salvage<stage.target||raw.sequence!==stage.sequence.length)throw Error('INVALID_TERMINAL');worlds++;return;}
  const initial=prep(stage,raw);if(!initial)throw Error('INVALID_FISH_ESCAPE');
  const option=bossOptions(stage,initial).find(x=>JSON.stringify(x.actions)===JSON.stringify(node.boss));if(!option)throw Error('INVALID_BOSS');
  for(const pair of variants(stage.pairs[zone-1])){
   let state=option.state,choice=node.groups[visible(stage,state,pair,result.mode)];if(!choice)throw Error('MISSING_OBSERVATION_BRANCH');
   if(choice.type==='scan'){
    if(stage.jammed.includes(zone)||state.power<2)throw Error('INVALID_SCAN');
    choice=choice.choices[scanned(stage,state,pair,result.markerScan)];state={...state,power:state.power-2};
    if(!choice||choice.type!=='move')throw Error('MISSING_SCAN_BRANCH');
   }
   const moved=move(stage,state,pair,choice);if(!moved)throw Error('INVALID_MOVE');
   const child=choice.next[moved.symbol];if(!child)throw Error('MISSING_OUTCOME_BRANCH');
   walk(zone+1,moved.state,child);
  }
 }
 try{walk(1,result.initial,result.policy);return {verified:true,worlds};}catch(error){return {verified:false,worlds,reason:String(error)};}
}
