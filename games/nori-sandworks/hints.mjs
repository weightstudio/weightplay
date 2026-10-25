import {act,createState,stateKey,solve,complete} from './simulation.mjs';
import {MASTER_ROUTES} from './mastery.mjs';

// Cache complete, replay-validated routes; a suggested move always has a known continuation.
export function routeIndex(level,actions,initial=createState(level)){
 const result=[],seen=new Set();let state=initial;
 for(let i=0;i<actions.length;i++){const hash=stateKey(state);if(!seen.has(hash)){result.push([hash,actions.slice(i)]);seen.add(hash);}const next=act(level,state,actions[i]);if(!next.ok)return [];state=next.state;}
 return complete(state)?result:[];
}
export function referenceHint(level,state){
 const key=stateKey(state);
 for(const route of [MASTER_ROUTES[level.id],level.witness].filter(Boolean)){const match=routeIndex(level,route).find(([hash])=>hash===key);if(match)return match[1];}
 return null;
}
export function searchHint(level,state,limits={}){
 const result=solve(level,state,{budget:3000,maxMs:2400,parkingAll:true,...limits});
 return result.actions&&routeIndex(level,result.actions,state).length?result.actions:null;
}
