import {PORTS,act,complete,rotateCells,stateKey} from './simulation.mjs';
import {bottomAt} from './feedback.mjs';

// Guidance describes the real board; it never commits an action or changes a save.
export function boardLesson(level,state){
 const pieces=state.pieces.filter(p=>!p.removed),first=pieces[0];
 if(!first)return null;
 const partial=pieces.find(p=>p.filled>0&&p.filled<p.capacity);
 if(partial)return partialLesson(level,null,state);
 switch(level.chapter){
  case 1:return {kind:'gate',ports:PORTS.map((_,i)=>i),control:'switchBtn'};
  case 2:return {kind:'rotate',tray:(pieces.find(p=>p.shape!=='O'&&p.cells.length>1)||first).id,table:true,control:'rotateBtn'};
  case 3:{const port=PORTS.findIndex((_,i)=>level.locks[i]&&!state.delivered.includes(level.locks[i]));return port<0?null:{kind:'lock',tray:level.locks[port],ports:[port]};}
  case 4:{const tray=level.order.find(id=>!state.delivered.includes(id));return tray?{kind:'order',tray}:null;}
  case 5:{const tray=pieces.find(p=>pieces.some(q=>q.id!==p.id&&q.color===p.color&&q.capacity>p.capacity))||first;return {kind:'capacity',tray:tray.id,ports:matchingPorts(state,tray)};}
  default:{const action=state.moves===0?level.witness[0]:null,tray=pieces.find(p=>p.id===action?.id)||first;return {kind:'basic',tray:tray.id,action,ports:matchingPorts(state,tray)};}
 }
}
const matchingPorts=(state,piece)=>PORTS.flatMap((_,i)=>bottomAt(state,i)?.color===piece.color?[i]:[]);
export function refreshLesson(lesson,state){
 if(!lesson||!['partial','capacity'].includes(lesson.kind))return lesson;
 const p=state.pieces.find(p=>p.id===lesson.tray&&!p.removed);
 return p?{...lesson,ports:matchingPorts(state,p)}:null;
}
export function partialLesson(level,previous,state){
 const p=state.pieces.find(p=>!p.removed&&p.filled>0&&p.filled<p.capacity&&(!previous||p.filled>(previous.pieces.find(q=>q.id===p.id)?.filled??0)));
 return p?{kind:'partial',tray:p.id,filled:p.filled,remaining:p.capacity-p.filled,ports:matchingPorts(state,p)}:null;
}
export function lessonFinished(lesson,state,action){
 if(!lesson)return false;
 const p=state.pieces.find(p=>p.id===lesson.tray);
 if(lesson.kind==='basic')return true;
 if(lesson.kind==='gate')return action.type==='switch';
 if(lesson.kind==='rotate')return action.type==='rotate';
 if(lesson.kind==='capacity')return !p||p.removed||p.filled>0;
 if(lesson.kind==='partial')return !p||p.removed||p.filled!==lesson.filled;
 return !p||p.removed;
}
// Describe the next concrete milestone, never an inferred dependency between trays.
// Replay the entire continuation before exposing a purpose; invalid routes stay silent.
export function hintPurpose(level,state,action,route=[]){
 const same=(a,b)=>a&&b&&['type','id','dx','dy'].every(key=>a[key]===b[key]);
 if(!same(action,route[0]))return null;
 let current=state,purpose=null;
 for(let i=0;i<route.length;i++){
  const next=route[i],result=act(level,current,next);if(!result.ok)return null;
  if(!purpose&&i<6){
   const delivered=result.state.pieces.find(p=>p.removed&&!current.pieces.find(q=>q.id===p.id)?.removed);
   const collected=result.state.pieces.find(p=>p.filled>(current.pieces.find(q=>q.id===p.id)?.filled??0));
   const port=delivered?PORTS.findIndex((_,index)=>level.locks[index]===delivered.id&&!current.delivered.includes(delivered.id)):-1;
   if(delivered)purpose={kind:port>=0?'purposeUnlock':'purposeFill',tray:delivered.id,...(port>=0?{port:PORTS[port].id}:{})};
   else if(collected)purpose={kind:'purposeCollect',tray:collected.id};
   else if(next.type==='rotate')purpose={kind:'purposeRotate',tray:next.id};
   else if(next.type==='switch')purpose={kind:'purposeGate'};
  }
  current=result.state;
 }
 return complete(current)?purpose||(action.id?{kind:'purposePosition',tray:action.id}:null):null;
}
export function bindHint(level,state,action,route=[]){
 if(!action||!act(level,state,action).ok)return null;
 return {level:level.id,key:stateKey(state),moves:state.moves,action:{...action},purpose:hintPurpose(level,state,action,route)};
}
export const hintMatches=(hint,level,state)=>!!hint&&hint.level===level.id&&hint.moves===state.moves&&hint.key===stateKey(state);
export function actionFootprint(state,action){
 const p=state.pieces.find(p=>p.id===action?.id&&!p.removed);
 if(!p)return null;
 if(action.type==='move')return {from:p.cells,to:p.cells.map(([c,r])=>[c+action.dx,r+action.dy])};
 if(action.type==='rotate')return {from:p.cells,to:rotateCells(p.cells)};
 return null;
}
