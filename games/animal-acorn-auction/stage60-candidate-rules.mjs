// UNCONNECTED candidate; no campaign, wallet, or reward integration.
import {CHAPTER2} from "./stage60-candidate-data.mjs";
export {CHAPTER2};
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function validateStage(s){
 if(!record(s)||!Number.isInteger(s.id)||s.id<31||s.id>60||typeof s.name!=='string'||!s.name.trim()||!Number.isInteger(s.goal)||s.goal<1||!Number.isInteger(s.budget)||s.budget<1||!Number.isInteger(s.slots)||s.slots<1||s.slots>3||!Number.isInteger(s.gold)||s.gold<0||!Number.isInteger(s.bells)||s.bells<1||s.bells>2||s.fee!==1||!Array.isArray(s.lots)||s.lots.length!==3)return false;
 if(s.pair!=null&&(!Array.isArray(s.pair)||s.pair.length!==2||s.pair.some(i=>!Number.isInteger(i)||i<0||i>2)||s.pair[0]===s.pair[1]))return false;
 if(s.origins!=null&&(!Number.isInteger(s.origins)||s.origins<2||s.origins>3))return false;
 return s.lots.every(l=>record(l)&&Number.isInteger(l.count)&&l.count>0&&Number.isInteger(l.gold)&&l.gold>=0&&l.gold<=l.count&&typeof l.origin==='string'&&l.origin.length>0&&Array.isArray(l.prices)&&l.prices.length===s.bells+1&&l.prices.every(p=>Number.isInteger(p)&&p>=1)&&Number.isInteger(l.rival)&&l.rival>=0&&l.rival<=s.bells);
}
function tokenValid(stage,ticket){return ticket===null||(record(ticket)&&Number.isInteger(ticket.lot)&&ticket.lot>=0&&ticket.lot<3&&Number.isInteger(ticket.at)&&ticket.at>=0&&ticket.at<stage.bells&&stage.lots[ticket.lot].rival===ticket.at+1);}
export function availableAt(stage,index,bell,ticket=null){
 const l=stage.lots[index];if(!l||!Number.isInteger(bell)||bell<0||bell>stage.bells||!tokenValid(stage,ticket))return false;
 return !l.rival||bell<l.rival||(ticket?.lot===index&&bell===l.rival);
}
export function evaluate(stage,selected,bell,ticket=null){
 if(!validateStage(stage)||!Array.isArray(selected)||selected.some(i=>!Number.isInteger(i)||i<0||i>=3)||new Set(selected).size!==selected.length||!Number.isInteger(bell)||bell<0||bell>stage.bells||!tokenValid(stage,ticket)||(ticket&&ticket.at>bell))return {ok:false,reason:'invalid'};
 const chosen=selected.map(i=>stage.lots[i]),value={count:chosen.reduce((n,l)=>n+l.count,0),gold:chosen.reduce((n,l)=>n+l.gold,0),cost:chosen.reduce((n,l)=>n+l.prices[bell],ticket?stage.fee:0),crates:chosen.length,origins:new Set(chosen.map(l=>l.origin)).size};
 const pair=stage.pair,reason=!chosen.length?'empty':selected.some(i=>!availableAt(stage,i,bell,ticket))?'sold':ticket&&!selected.includes(ticket.lot)?'ticket-lot-required':chosen.length>stage.slots?'capacity':value.count!==stage.goal?'quantity':value.gold<stage.gold?'quality':pair&&(selected.includes(pair[0])!==selected.includes(pair[1]))?'pair':stage.origins&&value.origins<stage.origins?'origins':value.cost>stage.budget?'budget':null;
 return {ok:reason===null,reason,...value};
}
export function solutions(stage){
 if(!validateStage(stage))return [];
 const result=[];for(let bell=0;bell<=stage.bells;bell++){
  const tickets=[null,...stage.lots.flatMap((l,lot)=>l.rival>0&&l.rival-1<=bell?[{lot,at:l.rival-1}]:[])];
  for(const ticket of tickets)for(let mask=1;mask<8;mask++){const selected=[0,1,2].filter(i=>mask&(1<<i)),bid=evaluate(stage,selected,bell,ticket);if(bid.ok)result.push({selected,bell,ticket,...bid});}
 }
 return result.sort((a,b)=>a.cost-b.cost||a.bell-b.bell||Number(Boolean(a.ticket))-Number(Boolean(b.ticket)));
}
export function stars(stage,bid,mistakes){return bid?.ok?1+(mistakes===0?1:0)+(bid.cost===solutions(stage)[0]?.cost?1:0):0;}
// From the current bell and spent-ticket state, selection is still reversible.
// This is an explicit signal for a visible Restart action, not auto-failure.
export function futureSolutions(state){
 if(!record(state)||state.phase!=='choose'||!validateStage(state.stage)||!Number.isInteger(state.bell))return [];
 return solutions(state.stage).filter(p=>p.bell>=state.bell&&(state.ticket?(p.ticket?.lot===state.ticket.lot&&p.ticket?.at===state.ticket.at):(!p.ticket||p.ticket.at>=state.bell)));
}
// This mirrors sequential unlock semantics without modifying or normalizing any
// player's real save. A stage-30 entry cannot fill earlier missing clears.
export function frontier(cleared){if(!record(cleared))return 1;let id=1;while(id<60&&Number.isInteger(cleared[id])&&cleared[id]>=1&&cleared[id]<=3)id++;return id;}
export function begin(stage){if(!validateStage(stage))throw TypeError('INVALID_STAGE');return {stage,token:Object.freeze({}),revision:0,bell:0,ticket:null,selected:[],mistakes:0,phase:'choose',result:null};}
export function act(state,action,{token,revision}={}){
 if(!record(state)||state.token!==token||state.revision!==revision||!record(action))return {state,status:'stale-or-closed'};
 if(action.type==='restart')return {state:begin(state.stage),status:'restarted'};
 if(state.phase!=='choose')return {state,status:'stale-or-closed'};
 const stage=state.stage,next={...state,selected:[...state.selected],revision:state.revision+1};
 if(action.type==='reserve'){
  const i=action.lot,l=stage.lots[i];if(!Number.isInteger(i)||!l||next.ticket||next.bell>=stage.bells||!l.rival||l.rival!==next.bell+1)return {state,status:'reserve-denied'};
  next.ticket={lot:i,at:next.bell};return {state:next,status:'reserved'};
 }
 if(action.type==='select'){
  const i=action.lot;if(!Number.isInteger(i)||!availableAt(stage,i,next.bell,next.ticket))return {state,status:'select-denied'};
  next.selected=next.selected.includes(i)?next.selected.filter(v=>v!==i):[...next.selected,i];return {state:next,status:'selected'};
 }
 if(action.type==='reset'){if(!next.selected.length)return {state,status:'reset-denied'};next.selected=[];return {state:next,status:'reset'};}
 if(action.type==='wait'){
  if(next.bell>=stage.bells)return {state,status:'wait-denied'};
  next.bell++;next.selected=next.selected.filter(i=>availableAt(stage,i,next.bell,next.ticket));return {state:next,status:'waited'};
 }
 if(action.type==='bid'){
  if(!next.selected.length)return {state,status:'bid-denied'};
  const bid=evaluate(stage,next.selected,next.bell,next.ticket);
  if(bid.ok){next.phase='won';next.result=bid;return {state:next,status:'won'};}
  next.mistakes++;next.result=bid;if(next.mistakes>=3)next.phase='lost';return {state:next,status:next.phase==='lost'?'lost':'rejected'};
 }
 return {state,status:'unknown'};
}
