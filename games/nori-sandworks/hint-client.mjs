import {stateKey} from './simulation.mjs';
import {routeIndex} from './hints.mjs';

export class HintClient{
 constructor(factory=()=>new Worker(new URL('./hint-worker.mjs',import.meta.url),{type:'module'})){this.factory=factory;this.cache=new Map();this.pending=null;}
 cancel(){this.pending?.();}
 continuation(level,state){return (this.cache.get(level.id+':'+stateKey(state))||[]).map(action=>({...action}));}
 request(level,state){
  this.cancel();const cacheKey=level.id+':'+stateKey(state);
  if(this.cache.has(cacheKey))return Promise.resolve(this.cache.get(cacheKey)[0]);
  return new Promise(resolve=>{
   let worker,timer,done=false;
   const finish=actions=>{if(done)return;done=true;clearTimeout(timer);worker?.terminate();this.pending=null;const entries=Array.isArray(actions)?routeIndex(level,actions,state):[];for(const [key,route]of entries){this.cache.set(level.id+':'+key,route);while(this.cache.size>512)this.cache.delete(this.cache.keys().next().value);}resolve(entries.length?actions[0]:null);};
   this.pending=()=>finish(null);
   try{worker=this.factory();worker.onmessage=e=>finish(e.data.actions);worker.onerror=()=>finish(null);timer=setTimeout(()=>finish(null),3200);worker.postMessage({level,state});}catch{finish(null);}
  });
 }
}
