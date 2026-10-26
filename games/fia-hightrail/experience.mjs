import {format} from './feedback-locales.mjs';

// Keep tiny integration residues from displaying an extra stamina point.
export const shownEnergy=value=>Math.max(0,Math.ceil(value-1e-6));
export function gearStatus(sim,t){
 if(sim.kit==='dry')return format(t.dryLeft,{n:Math.max(0,2-sim.dryUses)});
 if(sim.kit==='wind')return t.wind+' · '+format(t.calm,{n:'4.4'});
 return '';
}
export function holdPresentation(sim,id,t){
 const n=sim.level.nodes[id],p=sim.preview(id),item=sim.cargo===null?null:sim.level.cargo[sim.cargo];
 const rest=sim.isSafe(id)?(n.cold?t.cold:t.warm):'';
 let label=item?.to===id?format(t.goalDeliver,{item:t.items[item.kind]}):id===sim.level.end?t.exit:n.anchor?t.anchor:rest||
  (n.cargo!==undefined&&sim.cargo!==n.cargo&&!sim.delivered.includes(n.cargo)?t.items[sim.level.cargo[n.cargo].kind]:n.stamp&&!sim.stamps.includes(id)?t.stamps:id.split('.').at(-1));
 let hint=rest&&label!==rest?rest:'';
 if(p.edge?.wind){const window=sim.windWindow(p.edge);hint=format(window.calm?t.calm:t.gustWindow,{n:(Math.ceil((window.seconds-1e-6)*10)/10).toFixed(1)});}
 else if(p.edge?.wet)hint=format(t.wet,{n:sim.kit==='dry'&&sim.dryUses<2?0:7});
 else if(n.fragile)hint=format(t.fragile,{n:Math.max(0,4-(sim.time-(sim.fragile[id]??sim.time))).toFixed(1)});
 return {label,hint};
}
export function routeGoal(sim,t){
 if(sim.node().anchor&&!sim.flags.includes(sim.node().anchor))return t.anchor+' · '+sim.flags.length+'/'+sim.level.anchors.length;
 if(sim.cargo!==null)return format(t.goalDeliver,{item:t.items[sim.level.cargo[sim.cargo].kind]});
 const cargo=sim.level.cargo.find(c=>!sim.delivered.includes(c.id));
 if(cargo)return format(t.goalCollect,{item:t.items[cargo.kind]});
 if(sim.flags.length<sim.level.anchors.length)return t.anchor+' · '+sim.flags.length+'/'+sim.level.anchors.length;
 return t.goalSummit;
}
export function missingSeal(best,t){const index=[0,1,2].find(i=>!best?.[i]);return index===undefined?null:{index,label:[t.clearSeal,t.safeSeal,t.stampSeal][index]};}
export function campMastery(profile,t){
 for(const id of profile.clearedIds){const goal=missingSeal(profile.best[id],t);if(goal)return {label:goal.label,sealIndex:goal.index,id,index:Number(id.slice(-2))-1};}
 return null;
}
