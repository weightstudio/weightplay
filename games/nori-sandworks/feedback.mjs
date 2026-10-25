import {PORTS,portOpen} from './simulation.mjs';

export const format=(copy,values={})=>copy.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));
export function hintDescription(action,landscape,t){
 if(!action)return t.hintUnknown;
 if(action.type==='switch')return t.hintSwitch;
 if(action.type==='rotate')return t.hintRotate+' · '+action.id;
 const {dx,dy}=action,direction=landscape?(dx<0?3:dx>0?2:dy<0?0:1):(dx<0?0:dx>0?1:dy<0?2:3);
 return t.hintMove+' '+action.id+' '+t.hintDirections[direction]+' '+Math.abs(dx||dy)+' '+t.unit;
}
export const bottomAt=(state,index)=>state.grains.filter(g=>g.alive&&g.bank===PORTS[index].bank&&g.lane===PORTS[index].lane).sort((a,b)=>b.y-a.y)[0];
export function portStatus(level,state,index,t){
 const port=PORTS[index],lock=level.locks?.[index],bottom=bottomAt(state,index);
 if(lock&&!state.delivered.includes(lock))return format(t.portLocked,{port:port.id,tray:lock});
 if(!portOpen(level,state,index))return format(t.portClosed,{port:port.id,mode:[0,3].includes(index)?'α':'β'});
 if(!bottom)return format(t.portEmpty,{port:port.id});
 return format(t.portColor,{port:port.id,color:t.colors[bottom.color]});
}
export function trayFeedback(level,state,id,t){
 const piece=state.pieces.find(p=>p.id===id&&!p.removed);if(!piece)return t.selected;
 const ports=PORTS.map((port,i)=>piece.cells.some(([c,r])=>c===port.c&&r===port.r)?i:-1).filter(i=>i>=0);
 if(ports.length)return ports.map(i=>portStatus(level,state,i,t)).join(' · ');
 const match=PORTS.findIndex((_,i)=>bottomAt(state,i)?.color===piece.color);
 return match>=0?format(t.trayTarget,{tray:piece.id,port:PORTS[match].id}):t.selected;
}
export function actionFeedback(level,previous,result,action,t){
 if(!result.ok)return result.reason==='order'?format(t.orderNext,{tray:result.wanted}):t[result.reason]||t.blocked;
 if(result.events.length)return format(t.traysDone,{trays:result.events.map(e=>e.id).join(', ')});
 if(result.absorbed){const ports=PORTS.map((_,i)=>i).filter(i=>previous.grains.filter(g=>g.alive&&g.bank===PORTS[i].bank&&g.lane===PORTS[i].lane).length!==result.state.grains.filter(g=>g.alive&&g.bank===PORTS[i].bank&&g.lane===PORTS[i].lane).length);return ports.map(i=>portStatus(level,result.state,i,t)).join(' · ');}
 return action.type==='switch'?format(t.gatesOpen,{mode:result.state.mode===0?'α':'β',ports:result.state.mode===0?'W0 + E1':'W1 + E0'}):trayFeedback(level,result.state,action.id,t);
}
export function mechanismHelp(level,state,t){
 const rows=[t.selected];
 if(level.shutters)rows.push(t.gateRule);
 if(level.rotate)rows.push(t.turntable);
 if(Object.keys(level.locks||{}).length)rows.push(t.lockRule);
 if(level.order.length)rows.push(t.orderRule,format(t.orderNext,{tray:level.order.find(id=>!state.delivered.includes(id))||'—'}));
 return [...rows,...PORTS.map((_,i)=>portStatus(level,state,i,t))];
}
export function motionDuration(previous,state,action,reduced=false){
 if(reduced)return 0;
 if(state.delivered.length>previous.delivered.length)return 380;
 if(state.pieces.some((p,i)=>p.filled>previous.pieces[i].filled))return 320;
 return action?.type==='rotate'?180:140;
}
