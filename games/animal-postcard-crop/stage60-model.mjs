// Isolated campaign model: it is not loaded by the current game entry point.
// The legacy engine is injected so the same browser rules govern every pose.
export function createStage60(legacyEngine) {
if(!legacyEngine||['legal','crop','step','stars'].some(name=>typeof legacyEngine[name]!=='function'))throw new TypeError('INVALID_LEGACY_ENGINE');
const deepFreeze=value=>{
  if(value&&typeof value==='object'&&!Object.isFrozen(value)) {
    for(const child of Object.values(value))deepFreeze(child);
    Object.freeze(value);
  }
  return value;
};
const rows=[
  {id:31,cells:[2,0,8,4,6,9,3,5,11,10,1,7],first:[3,1],second:[0,9],firstAvoid:[0,9],fixedPin:3,start:{x:0,y:1,w:2,h:2}},
  {id:32,cells:[11,5,9,2,3,1,7,0,10,4,8,6],first:[0,7],second:[4,8],firstAvoid:[4,8],start:{x:0,y:0,w:2,h:2}},
  {id:33,cells:[3,5,9,4,6,2,10,7,11,1,0,8],first:[2,6],second:[5,3],firstAvoid:[5,3],secondPosition:'left',start:{x:2,y:1,w:2,h:2}},
  {id:34,cells:[5,2,3,1,6,9,7,11,10,8,0,4],first:[8,9],second:[0,7],firstAvoid:[0,7],secondPosition:'bottom',start:{x:2,y:0,w:2,h:2}},
  // Candidate 35 allows any subject in the first crop to be selected as pin.
  {id:35,cells:[10,9,8,0,7,5,6,1,11,2,3,4],first:[3,6],second:[9,8],pinMode:'any',firstPosition:'top-left',secondPosition:'bottom-right',start:{x:0,y:0,w:2,h:2}},
  {id:36,cells:[3,0,5,8,1,4,7,6,10,11,9,2],first:[0,1],second:[7,4],avoid:[11],firstShape:[2,2],secondShape:[3,2],start:{x:1,y:0,w:2,h:2},lensAllowed:true},
  {id:37,cells:[10,3,9,4,5,6,7,11,1,2,8,0],first:[3,5],second:[2,6],avoid:[10],firstShape:[2,2],secondShape:[2,3],start:{x:0,y:0,w:2,h:2},lensAllowed:true},
  {id:38,cells:[4,5,1,8,11,0,7,9,6,2,3,10],first:[9,8],second:[1,7],fixedPin:9,firstShape:[2,2],secondShape:[2,3],start:{x:1,y:0,w:2,h:2},lensAllowed:true},
  {id:39,cells:[10,1,4,5,2,0,3,9,6,7,8,11],first:[2,0],second:[3,9],firstPosition:'top',secondPosition:'bottom',firstShape:[2,2],secondShape:[3,2],secondShapeGuidance:true,start:{x:0,y:0,w:2,h:2},lensAllowed:true},
  {id:40,cells:[4,1,8,5,10,9,6,7,0,11,2,3],first:[5,6],second:[8,7],secondPosition:'top-right',firstShape:[2,2],secondShape:[2,3],start:{x:2,y:1,w:2,h:2},lensAllowed:true},
  {id:41,cells:[10,5,9,1,2,3,6,11,0,8,4,7],first:[0,3],second:[6,8],avoid:[11],firstShape:[2,2],secondShape:[3,2],secondPosition:'top',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:42,cells:[11,9,0,2,7,5,10,6,8,1,3,4],first:[7,1],second:[5,9],avoid:[10],firstShape:[2,2],secondShape:[2,3],secondPosition:'left',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:43,cells:[9,3,2,5,6,4,8,0,10,11,7,1],first:[2,4],second:[8,6],avoid:[11],firstShape:[2,2],secondShape:[3,2],secondShapeGuidance:true,secondPosition:'middle-column',start:{x:0,y:0,w:2,h:2},lensAllowed:true},
  {id:44,cells:[11,10,8,3,9,7,0,4,1,2,6,5],first:[9,10],second:[0,7],avoid:[3],firstShape:[2,2],secondShape:[3,2],differentPosition:true,start:{x:0,y:0,w:2,h:2},lensAllowed:true},
  {id:45,cells:[10,2,8,0,7,5,9,3,6,4,1,11],first:[3,8],second:[9,5],avoid:[11],differentOrientation:true,secondPosition:'top-corner',start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:46,cells:[8,3,9,2,5,1,0,10,4,6,7,11],first:[1,6],second:[0,7],avoid:[10],firstShape:[2,2],secondShape:[3,2],secondPosition:'bottom',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:47,cells:[8,5,10,0,2,1,9,11,6,7,3,4],first:[7,4],second:[3,9],avoid:[11],firstShape:[3,2],firstShapeGuidance:true,secondShape:[2,2],start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:48,cells:[4,7,9,1,11,8,6,0,3,2,5,10],first:[8,5],second:[6,2],avoid:[10],firstPosition:'corner',secondPosition:'edge-not-corner',differentOrientation:true,start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:49,cells:[9,8,2,10,5,0,4,6,7,1,3,11],first:[0,9],second:[1,4],avoid:[11],differentSize:true,secondPosition:'left',start:{x:2,y:1,w:2,h:2},lensAllowed:true},
  {id:50,cells:[5,10,1,11,4,3,7,0,9,8,6,2],first:[3,7],second:[8,6],firstShape:[3,2],secondShape:[2,2],secondPosition:'top-right',start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:51,cells:[10,1,9,4,2,3,7,0,11,5,8,6],first:[3,1],second:[9,7],firstShape:[2,2],secondShape:[3,2],firstPosition:'left',secondPosition:'left',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:52,cells:[10,7,9,4,8,0,5,6,1,2,3,11],first:[2,5],second:[0,6],firstShape:[3,2],firstShapeGuidance:true,secondShape:[3,2],secondShapeGuidance:true,firstPosition:'top-middle',secondPosition:'bottom',start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:53,cells:[2,1,9,7,4,3,8,10,11,5,0,6],first:[8,4],second:[1,9],firstShape:[3,2],firstShapeGuidance:true,secondShape:[3,2],secondShapeGuidance:true,firstPosition:'top-right',secondPosition:'bottom-middle',start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:54,cells:[1,3,0,8,4,7,10,5,2,9,6,11],first:[0,10],second:[3,7],firstShape:[2,2],secondShape:[3,2],secondShapeGuidance:true,firstPosition:'top-right',secondPosition:'middle-column',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:55,cells:[11,2,1,3,5,6,8,7,10,9,0,4],first:[5,6],second:[8,9],firstShape:[2,2],firstShapeGuidance:true,secondShape:[3,2],firstPosition:'bottom-right',secondPosition:'top-left',start:{x:0,y:0,w:2,h:2},lensAllowed:true},
  {id:56,cells:[5,8,1,6,10,3,9,11,0,4,7,2],first:[3,9],second:[1,8],firstShape:[2,2],secondShape:[2,3],firstPosition:'bottom',secondPosition:'left',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:57,cells:[9,11,4,2,1,3,6,7,10,5,0,8],first:[4,7],second:[0,6],avoid:[11],firstShape:[3,2],secondShape:[2,3],secondPosition:'top',start:{x:0,y:0,w:3,h:2},lensAllowed:true},
  {id:58,cells:[1,9,10,6,0,3,5,4,11,8,2,7],first:[2,8],second:[3,5],firstShape:[2,2],secondShape:[3,2],secondShapeGuidance:true,firstPosition:'bottom-left',secondPosition:'middle-column',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:59,cells:[1,9,6,10,7,0,4,11,3,5,2,8],first:[1,0],second:[9,7],firstShape:[2,2],secondShape:[2,3],secondPosition:'edge-not-corner',start:{x:2,y:0,w:2,h:2},lensAllowed:true},
  {id:60,cells:[10,2,3,11,5,8,6,0,7,9,4,1],first:[3,6],second:[8,9],avoid:[10],waypoint:10,pinMode:'any',firstShape:[2,2],secondShape:[2,3],secondPosition:'top-right',differentPosition:true,start:{x:2,y:0,w:2,h:2},lensAllowed:true},
];
const stages=deepFreeze(rows.map(row=>({...row,firstAvoid:row.firstAvoid||[],lensAllowed:!!row.lensAllowed})));
const clonePose=pose=>pose?{...pose}:null;
const poseEqual=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y&&a.w===b.w&&a.h===b.h;
const location=(stage,pose,id)=>{const index=stage.cells.indexOf(id);return {x:index%4-pose.x,y:Math.floor(index/4)-pose.y};};
function positionMatches(stage,pose,id,rule) {
  if(!rule)return true;
  const p=location(stage,pose,id);
  if(p.x<0||p.y<0||p.x>=pose.w||p.y>=pose.h)return false;
  if(rule==='left')return p.x===0;
  if(rule==='top')return p.y===0;
  if(rule==='bottom')return p.y===pose.h-1;
  if(rule==='top-left')return p.x===0&&p.y===0;
  if(rule==='top-right')return p.x===pose.w-1&&p.y===0;
  if(rule==='bottom-left')return p.x===0&&p.y===pose.h-1;
  if(rule==='top-corner')return p.y===0&&(p.x===0||p.x===pose.w-1);
  if(rule==='middle-column')return pose.w===3&&p.x===1;
  if(rule==='top-middle')return pose.w===3&&p.x===1&&p.y===0;
  if(rule==='bottom-middle')return pose.w===3&&p.x===1&&p.y===pose.h-1;
  if(rule==='corner')return (p.x===0||p.x===pose.w-1)&&(p.y===0||p.y===pose.h-1);
  if(rule==='edge-not-corner')return (p.x===0||p.x===pose.w-1||p.y===0||p.y===pose.h-1)&&!((p.x===0||p.x===pose.w-1)&&(p.y===0||p.y===pose.h-1));
  if(rule==='bottom-right')return p.x===pose.w-1&&p.y===pose.h-1;
  throw Error(`UNKNOWN_POSITION:${rule}`);
}
function initial(stage) {
  return {phase:'first',pose:clonePose(stage.start),firstPose:null,pin:null,lensUsed:false,waypointSeen:false};
}
function transition(stage,state,action,relax={}) {
  if(!stage||!state||!action||state.phase==='done')return null;
  const next={...state,pose:clonePose(state.pose),firstPose:clonePose(state.firstPose)};
  if(action.type==='move') {
    if(!['first','second'].includes(state.phase))return null;
    if(action.direction==='rotate'&&stage.rotateAllowed===false)return null;
    const pose=legacyEngine.step({rotate:true},state.pose,action.direction);
    if(!pose)return null;next.pose=pose;
    if(state.phase==='second'&&stage.waypoint!==undefined&&legacyEngine.crop(stage,pose).includes(stage.waypoint))next.waypointSeen=true;
    return {state:next,cost:1};
  }
  if(action.type==='lens') {
    if(!stage.lensAllowed||state.lensUsed||!['first','second'].includes(state.phase))return null;
    const p=state.pose,small=p.w===2&&p.h===2,large=(p.w===3&&p.h===2)||(p.w===2&&p.h===3);
    if(!small&&!large)return null;
    const w=small?3:2,h=2;next.pose={x:Math.min(p.x,4-w),y:Math.min(p.y,3-h),w,h};
    if(!legacyEngine.legal(next.pose))return null;next.lensUsed=true;
    if(state.phase==='second'&&stage.waypoint!==undefined&&legacyEngine.crop(stage,next.pose).includes(stage.waypoint))next.waypointSeen=true;
    return {state:next,cost:1};
  }
  if(action.type==='capture') {
    if(state.phase==='first') {
      if(stage.firstShape&&(!stage.firstShapeGuidance||relax.forceFirstGuidanceShape)&&!relax.ignoreFirstShape&&(state.pose.w!==stage.firstShape[0]||state.pose.h!==stage.firstShape[1]))return null;
      const inside=legacyEngine.crop(stage,state.pose);if(!stage.first.every(id=>inside.includes(id))||(!relax.ignoreFirstAvoid&&stage.firstAvoid.some(id=>inside.includes(id))))return null;
      next.firstPose=clonePose(state.pose);next.phase='pin';return {state:next,cost:0};
    }
    if(state.phase!=='second')return null;
    const inside=legacyEngine.crop(stage,state.pose);
    if(!stage.second.every(id=>inside.includes(id))||(!relax.ignorePin&&!inside.includes(state.pin))||stage.second.includes(state.pin))return null;
    if(stage.avoid&&!relax.ignoreAvoid&&stage.avoid.some(id=>inside.includes(id)))return null;
    if(stage.waypoint!==undefined&&!relax.ignoreWaypoint&&!state.waypointSeen)return null;
    if(stage.excludeOtherFirst&&!relax.ignoreExcludeOtherFirst&&stage.first.some(id=>id!==state.pin&&inside.includes(id)))return null;
    if(stage.secondShape&&(!stage.secondShapeGuidance||relax.forceGuidanceShape)&&!relax.ignoreSecondShape&&(state.pose.w!==stage.secondShape[0]||state.pose.h!==stage.secondShape[1]))return null;
    if(!relax.ignoreSecondPosition&&!positionMatches(stage,state.pose,state.pin,stage.secondPosition))return null;
    if(stage.differentPosition&&!relax.ignoreDifferentPosition&&state.firstPose.x===state.pose.x&&state.firstPose.y===state.pose.y)return null;
    if(stage.differentSize&&!relax.ignoreDifferentSize&&state.firstPose.w*state.firstPose.h===state.pose.w*state.pose.h)return null;
    if(stage.differentOrientation&&!relax.ignoreDifferentOrientation&&
      (state.firstPose.w===state.firstPose.h||state.pose.w===state.pose.h||
      Math.sign(state.firstPose.w-state.firstPose.h)===Math.sign(state.pose.w-state.pose.h)))return null;
    next.phase='done';return {state:next,cost:0};
  }
  if(action.type==='pin'&&state.phase==='pin') {
    const allowed=stage.pinMode==='any'?legacyEngine.crop(stage,state.firstPose):stage.fixedPin!==undefined&&!relax.ignorePinRestriction?[stage.fixedPin]:stage.first;
    if(!allowed.includes(action.id))return null;
    if(!relax.ignoreFirstPosition&&!positionMatches(stage,state.firstPose,action.id,stage.firstPosition))return null;
    next.pin=action.id;next.phase='second';return {state:next,cost:0};
  }
  return null;
}
function available(stage,state,relax={}) {
  if(state.phase==='done')return [];
  if(state.phase==='pin')return (stage.pinMode==='any'?legacyEngine.crop(stage,state.firstPose):stage.fixedPin!==undefined&&!relax.ignorePinRestriction?[stage.fixedPin]:stage.first).map(id=>({type:'pin',id}));
  return ['up','right','down','left','rotate'].map(direction=>({type:'move',direction})).concat([{type:'lens'},{type:'capture'}]);
}
const key=s=>JSON.stringify([s.phase,s.pose,s.firstPose,s.pin,s.lensUsed,s.waypointSeen]);
// 0–1 BFS: capture and pin go to the front; spatial actions cost one.
function solve(stage,start=initial(stage),relax={}) {
  const queue=[key(start)],states=new Map([[key(start),start]]),dist=new Map([[key(start),0]]),parent=new Map();
  let visited=0;
  while(queue.length) {
    const k=queue.shift(),state=states.get(k),base=dist.get(k);visited++;
    if(state.phase==='done') {
      const path=[];for(let cursor=k;parent.has(cursor);cursor=parent.get(cursor).previous)path.push(parent.get(cursor).action);
      return {distance:base,path:path.reverse(),visited,states:dist.size};
    }
    for(const action of available(stage,state,relax)) {
      const edge=transition(stage,state,action,relax);if(!edge)continue;
      const n=key(edge.state),d=base+edge.cost;if(dist.has(n)&&dist.get(n)<=d)continue;
      dist.set(n,d);states.set(n,edge.state);parent.set(n,{previous:k,action});
      if(edge.cost===0)queue.unshift(n);else queue.push(n);
    }
  }
  return null;
}
function hint(stage,state) {
  if(state.phase==='done')return {status:'ready',action:null};
  const result=solve(stage,state);return result?{status:'step',action:result.path[0]}:{status:'unreachable',action:null};
}
// Undo is free but does not refund moves already spent; final settlement is
// immutable. This explicit proposal is not an existing-game save contract.
// Attempts are immutable and can only be obtained from this factory. A compact
// event journal enables strict replay validation when restoring an attempt.
const owned=new WeakSet(),hintTokens=new WeakMap(),MAX_EVENTS=4096,shortestCache=new Map();
const stageById=new Map(stages.map(stage=>[stage.id,stage]));
function getStage(id) {
  if(!Number.isInteger(id)||!stageById.has(id))throw new RangeError('INVALID_STAGE');
  return stageById.get(id);
}
function shortest(id) {
  const stage=getStage(id);
  if(!shortestCache.has(id)) {
    const solution=solve(stage);if(!solution)throw new Error('INVALID_STAGE_DATA');
    shortestCache.set(id,solution.distance);
  }
  return shortestCache.get(id);
}
function own(value){deepFreeze(value);owned.add(value);return value;}
function assertAttempt(value){if(!value||!owned.has(value))throw new TypeError('INVALID_ATTEMPT');}
function fresh(stageId,sequence=0) {
  return {stageId,state:initial(getStage(stageId)),moves:0,errors:0,hinted:false,history:[],events:[],inputSequence:sequence};
}
function newAttempt(stageId){return own(fresh(stageId));}
function canonical(action) {
  if(!action||typeof action!=='object'||Array.isArray(action))return null;
  if(action.type==='move'&&['left','right','up','down','rotate'].includes(action.direction))return {type:'move',direction:action.direction};
  if(action.type==='pin'&&Number.isInteger(action.id)&&action.id>=0&&action.id<12)return {type:'pin',id:action.id};
  if(['capture','lens','undo','reset','hint'].includes(action.type))return {type:action.type};
  return null;
}
// A rejected capture counts as a mistake only in a capture phase, as in the
// existing game. Other illegal inputs do not change the puzzle or score.
function reduce(attempt,action) {
  const stage=getStage(attempt.stageId);
  if(action.type==='reset')return {value:fresh(attempt.stageId,attempt.inputSequence),status:'reset',record:false};
  if(action.type==='undo') {
    if(attempt.state.phase==='done'||!attempt.history.length)return {value:attempt,status:'invalid',record:false};
    return {value:{...attempt,state:attempt.history.at(-1),history:attempt.history.slice(0,-1)},status:'applied',record:true};
  }
  if(action.type==='hint') {
    const result=hint(stage,attempt.state);
    if(result.status!=='step')return {value:attempt,status:result.status,record:false,hint:result};
    return {value:{...attempt,hinted:true},status:'hint',record:!attempt.hinted,hint:result};
  }
  const edge=transition(stage,attempt.state,action);
  if(!edge) {
    if(action.type==='capture'&&['first','second'].includes(attempt.state.phase))return {value:{...attempt,errors:attempt.errors+1},status:'incorrect',record:true};
    return {value:attempt,status:'invalid',record:false};
  }
  return {value:{...attempt,state:edge.state,moves:attempt.moves+edge.cost,history:[...attempt.history,attempt.state]},status:'applied',record:true};
}
// Every accepted physical input must carry an increasing caller-owned sequence.
// Key repeat is ignored; out-of-order/duplicated events cannot mutate a run.
function apply(attempt,action,options={}) {
  assertAttempt(attempt);
  if(options.repeat===true)return {attempt,status:'repeat'};
  const sequence=options.sequence;
  if(!Number.isSafeInteger(sequence)||sequence<1)throw new TypeError('INVALID_INPUT_SEQUENCE');
  if(sequence<=attempt.inputSequence)return {attempt,status:'duplicate'};
  const normalized=canonical(action),base={...attempt,inputSequence:sequence};
  if(!normalized)return {attempt:own(base),status:'invalid'};
  const result=reduce(base,normalized);
  if(result.record&&attempt.events.length>=MAX_EVENTS)return {attempt:own(base),status:'journal-full'};
  const events=normalized.type==='reset'?[]:result.record?[...attempt.events,normalized]:attempt.events;
  const next=own({...result.value,inputSequence:sequence,events});
  if(result.status!=='hint')return {attempt:next,status:result.status,...(result.hint?{hint:result.hint}: {})};
  const token=Object.freeze({});hintTokens.set(token,{attempt:next,action:result.hint.action});
  return {attempt:next,status:'hint',hint:{...result.hint,token}};
}
// Tokens are factory-local, one-state capabilities: reset, undo, stage change,
// a newer input or deserialization makes an old hint unusable.
function applyHint(attempt,token,options={}) {
  assertAttempt(attempt);const saved=token&&hintTokens.get(token);
  if(!saved||saved.attempt!==attempt)return {attempt,status:'stale-hint'};
  return apply(attempt,saved.action,options);
}
function serialize(attempt) {
  assertAttempt(attempt);
  return JSON.stringify({format:'weightplay-postcard-dual-attempt',version:1,stageId:attempt.stageId,inputSequence:attempt.inputSequence,events:attempt.events});
}
function deserialize(text) {
  if(typeof text!=='string'||text.length>4_000_000)throw new TypeError('INVALID_SERIALIZED_ATTEMPT');
  let data;try{data=JSON.parse(text);}catch{throw new TypeError('INVALID_SERIALIZED_ATTEMPT');}
  if(!data||data.format!=='weightplay-postcard-dual-attempt'||data.version!==1||!Number.isSafeInteger(data.inputSequence)||data.inputSequence<0||!Array.isArray(data.events)||data.events.length>MAX_EVENTS)throw new TypeError('INVALID_SERIALIZED_ATTEMPT');
  let value=fresh(data.stageId);const replayed=[];
  for(const raw of data.events) {
    const action=canonical(raw);
    if(!action||action.type==='reset')throw new TypeError('INVALID_ATTEMPT_EVENT');
    const result=reduce(value,action);
    if(!result.record)throw new TypeError('INVALID_ATTEMPT_EVENT');
    replayed.push(action);value={...result.value,events:replayed};
  }
  // At least one sequence is consumed by each recorded event.
  if(data.inputSequence<value.events.length)throw new TypeError('INVALID_INPUT_SEQUENCE');
  return own({...value,inputSequence:data.inputSequence});
}
function score(attempt) {
  assertAttempt(attempt);if(attempt.state.phase!=='done')return null;
  return legacyEngine.stars(attempt.moves,shortest(attempt.stageId),attempt.errors,attempt.hinted);
}
return Object.freeze({stages,getStage,shortest,newAttempt,apply,applyHint,serialize,deserialize,score,MAX_EVENTS});
}
