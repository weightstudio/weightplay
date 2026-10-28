// Stage 33 design candidate. It is not yet connected to combat or visuals.
const sides=new Set(['A','B']);
export function makeLaneChoice(){return {chosen:null,queued:null,cycle:0,lanes:[]}}
export function beginLaneChoiceCycle(previous){
  if(previous.lanes.length)throw new Error('LANE_CYCLE_STILL_ACTIVE');
  const lanes=['A','B'].map(side=>({side,warn:6,life:7.2}));
  const cancelled=previous.queued;
  return {state:{...previous,queued:null,cycle:previous.cycle+1,lanes:lanes.filter(lane=>lane.side!==cancelled)},events:cancelled?[`lane-cancelled:${cancelled}`]:[]};
}
export function pulseLaneChoice(previous,side){
  if(!sides.has(side))throw new RangeError('UNKNOWN_BEACON_SIDE');
  if(previous.chosen!==null)return {state:previous,events:[]};
  const lane=previous.lanes.find(item=>item.side===side);
  if(lane&&lane.warn>0)return {state:{...previous,chosen:side,lanes:previous.lanes.filter(item=>item.side!==side)},events:[`lane-cancelled:${side}`]};
  return {state:{...previous,chosen:side,queued:side},events:[`lane-queued:${side}`]};
}
export function tickLaneChoice(previous,dt){
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_LANE_STEP');
  return {...previous,lanes:previous.lanes.map(lane=>({...lane,warn:lane.warn-dt,life:lane.life-dt})).filter(lane=>lane.life>0)};
}
