// Unconnected Stage 40 warning geometry. The actual engine must own its clocks.
import {pulseFerryman} from './beacon-ferryman-candidate.mjs?v=20261028-facet1';
export function makeFacetLanes(phase){
  if(phase!==0&&phase!==1)throw new RangeError('INVALID_FACET_PHASE');
  return {phase,required:phase===0?'A':'B',lanes:{
    A:{x:256,width:220,warn:phase===0?6:8,life:phase===0?8.4:10.4,cancelled:false},
    B:{x:768,width:220,warn:phase===0?8:6,life:phase===0?10.4:8.4,cancelled:false},
  }};
}
export function stepFacetLanes(previous,{dt=0,pulse=null}={}){
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_FACET_STEP');
  if(pulse!==null&&!['A','B'].includes(pulse))throw new RangeError('INVALID_FACET_STATION');
  const next={...previous,lanes:{A:{...previous.lanes.A},B:{...previous.lanes.B}}},events=[];
  if(pulse===next.required){const lane=next.lanes[pulse];if(!lane.cancelled&&lane.life>0){lane.cancelled=true;events.push(`lane-cancelled:${pulse}`)}}
  for(const lane of Object.values(next.lanes)){if(!lane.cancelled){lane.warn=Math.max(0,lane.warn-dt);lane.life=Math.max(0,lane.life-dt)}}
  if(Object.values(next.lanes).every(lane=>!lane.cancelled&&lane.life<=0))return {state:makeFacetLanes(next.phase),events:['warnings-restarted']};
  return {state:next,events};
}
export function facetLaneHits(lane,x){return !lane.cancelled&&lane.warn<=0&&lane.life>0&&Math.abs(x-lane.x)<=lane.width/2;}
export function pulseFacetEncounter(boss,lanes,station){
  if(!boss.shielded||boss.phase!==lanes.phase)return {boss,lanes,events:[]};
  const result=stepFacetLanes(lanes,{pulse:station});
  if(!result.events.includes(`lane-cancelled:${station}`))return {boss,lanes,events:[]};
  const opened=pulseFerryman(boss,station);
  if(!opened.events.includes(`facet-opened:${station}`))return {boss,lanes,events:[]};
  return {boss:opened.state,lanes:result.state,events:[...result.events,...opened.events]};
}
