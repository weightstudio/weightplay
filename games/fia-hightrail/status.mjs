import {format} from './feedback-locales.mjs';
export function terrainStatus(sim,t){
 if(sim.catchMotion)return t.checkpoint;
 if(sim.motion)return t.moving;
 if(sim.isSafe())return sim.cap()===70?t.cold:t.warm;
 if(sim.node().fragile)return format(t.fragile,{n:Math.max(0,4-(sim.time-sim.fragile[sim.position])).toFixed(1)});
 const grace=1.5-(sim.time-sim.arrived);
 return grace>0?format(t.grace,{n:grace.toFixed(1)}):t.hanging;
}
export function carriedStatus(sim,t){return sim.cargo===null?'':format(t.carrying,{item:t.items[sim.level.cargo[sim.cargo].kind]})+' · '+t.load;}
