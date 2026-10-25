import {act} from './simulation.mjs';
export function bindInput(element,{view,getState,getLevel,getSelected,select,commit,preview,enabled}){
 const abort=new AbortController(),listen=(type,fn)=>element.addEventListener(type,fn,{signal:abort.signal});let drag=null,keyboard={dx:0,dy:0};
 function cancel(){drag=null;keyboard={dx:0,dy:0};preview(null);}
 function actionFrom(from,to,id){let dx=to[0]-from[0],dy=to[1]-from[1];if(Math.abs(dx)>=Math.abs(dy))dy=0;else dx=0;return {type:'move',id,dx,dy};}
 function show(a){if(!a.dx&&!a.dy){preview(null);return;}const p=getState().pieces.find(v=>v.id===a.id),r=act(getLevel(),getState(),a);preview({cells:p.cells.map(([c,row])=>[c+a.dx,row+a.dy]),valid:r.ok,action:a});}
 listen('pointerdown',e=>{if(!enabled()||e.button!==0||drag)return;const cell=view().cellAt(e.clientX,e.clientY);if(!cell)return;const s=getState(),p=s.pieces.find(p=>!p.removed&&p.cells.some(c=>c[0]===cell[0]&&c[1]===cell[1]));if(p){select(p.id);drag={pointer:e.pointerId,from:cell,id:p.id,tap:false};}else if(getSelected()){const piece=s.pieces.find(p=>p.id===getSelected()&&!p.removed);if(!piece)return;const a=actionFrom(piece.cells[0],cell,piece.id);show(a);drag={pointer:e.pointerId,from:piece.cells[0],id:piece.id,tap:true,action:a};}if(drag){element.setPointerCapture(e.pointerId);e.preventDefault();}});
 listen('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer||drag.tap)return;const cell=view().cellAt(e.clientX,e.clientY);if(cell){drag.action=actionFrom(drag.from,cell,drag.id);show(drag.action);}});
 listen('pointerup',e=>{if(!drag||e.pointerId!==drag.pointer)return;const a=drag.action;cancel();if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);if(a&&(a.dx||a.dy))commit(a);});
 listen('pointercancel',cancel);listen('lostpointercapture',cancel);
 listen('keydown',e=>{if(!enabled()||!getSelected())return;const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();if(e.repeat)return;let [dx,dy]=moves[e.key];if(view().landscape)[dx,dy]=[-dy,dx];if(dx)keyboard.dy=0;if(dy)keyboard.dx=0;keyboard.dx=Math.max(-5,Math.min(5,keyboard.dx+dx));keyboard.dy=Math.max(-7,Math.min(7,keyboard.dy+dy));show({type:'move',id:getSelected(),...keyboard});}else if(e.key==='Enter'&&(keyboard.dx||keyboard.dy)){e.preventDefault();const a={type:'move',id:getSelected(),...keyboard};cancel();commit(a);}else if(e.key==='Escape'){e.preventDefault();cancel();}});
 return {cancel,destroy(){cancel();abort.abort();}};
}
