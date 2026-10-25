/* Integer cells are the only gameplay authority. Rendering never mutates a run. */
export const WIDTH=6, HEIGHT=8, UNIT=28;
export const SHAPES={I:[[0,0]],D:[[0,0],[1,0]],L:[[0,0],[0,1],[1,1]],O:[[0,0],[1,0],[0,1],[1,1]]};
export const PORTS=[{id:'W0',c:0,r:2,bank:0,lane:0},{id:'W1',c:0,r:5,bank:0,lane:1},{id:'E0',c:5,r:2,bank:1,lane:0},{id:'E1',c:5,r:5,bank:1,lane:1}];
export const key=([c,r])=>r*6+c;
export const copy=v=>structuredClone(v);
export const poseKey=cells=>cells.map(key).sort((a,b)=>a-b).join(',');
export function createState(level){
 const grains=[];
 level.supply.forEach((runs,p)=>{let count=0;for(const [color,n] of runs){if(n%7)throw Error('INCOMPLETE_SAND_ROW');for(let j=0;j<n;j++){const port=PORTS[p];grains.push({color,bank:port.bank,lane:port.lane,x:count%7+port.lane*9,y:23-Math.floor(count/7),alive:true});count++;}}if(count>168)throw Error('SAND_OVERFLOW');});
 return {level:level.id,pieces:level.pieces.map(p=>({...copy(p),filled:0,capacity:SHAPES[p.shape].length*UNIT,removed:false})),grains,moves:0,mode:level.mode??0,delivered:[],parity:0};
}
export function mass(state){const byColor=[0,0,0,0];state.grains.forEach(g=>{if(g.alive)byColor[g.color]++;});state.pieces.forEach(p=>byColor[p.color]+=p.filled);return byColor;}
export const complete=s=>s.pieces.every(p=>p.removed);
export function portOpen(level,state,index){return (!level.shutters||([0,3].includes(index)?state.mode===0:state.mode===1))&&(!level.locks?.[index]||state.delivered.includes(level.locks[index]));}
export function fits(level,state,id,cells){const forbidden=new Set(level.walls);for(const p of state.pieces)if(!p.removed&&p.id!==id)p.cells.forEach(c=>forbidden.add(key(c)));return cells.every(([c,r])=>c>=0&&c<WIDTH&&r>=0&&r<HEIGHT&&!forbidden.has(key([c,r])));}
export function rotateCells(cells){return cells.map(([c,r])=>[6-r,c+1]);}
export function canRotate(level,state,piece){return !!level.rotate&&!piece.removed&&piece.cells.every(([c,r])=>c>=2&&c<=3&&r>=3&&r<=4)&&poseKey(rotateCells(piece.cells))!==poseKey(piece.cells)&&fits(level,state,piece.id,rotateCells(piece.cells));}
export function legalActions(level,state,id){const p=state.pieces.find(v=>v.id===id);if(!p||p.removed)return[];const out=[];for(const [x,y]of[[1,0],[-1,0],[0,1],[0,-1]])for(let n=1;n<8;n++){if(!fits(level,state,id,p.cells.map(([c,r])=>[c+x*n,r+y*n])))break;out.push({type:'move',id,dx:x*n,dy:y*n});}if(canRotate(level,state,p))out.push({type:'rotate',id});return out;}
function settle(level,state){
 const events=[];let ticks=0;
 while(ticks++<2048){let changed=false;const grid=new Int32Array(768).fill(-1);state.grains.forEach((g,i)=>{if(g.alive)grid[g.bank*384+g.y*16+g.x]=i;});
  for(let y=22;y>=0;y--)for(let order=0;order<32;order++){const bank=order>>4,x=state.parity?(15-(order%16)):order%16,i=grid[bank*384+y*16+x];if(i<0)continue;const g=state.grains[i],lo=g.lane*9,hi=lo+6;for(const dx of [0,state.parity?1:-1,state.parity?-1:1]){const nx=x+dx,ni=bank*384+(y+1)*16+nx;if(nx<lo||nx>hi||grid[ni]>=0)continue;grid[bank*384+y*16+x]=-1;grid[ni]=i;g.x=nx;g.y++;changed=true;break;}}
  for(let pi=0;pi<4;pi++){if(!portOpen(level,state,pi))continue;const port=PORTS[pi],p=state.pieces.find(v=>!v.removed&&v.cells.some(([c,r])=>c===port.c&&r===port.r));if(!p)continue;
   const bottom=state.grains.filter(g=>g.alive&&g.bank===port.bank&&g.lane===port.lane&&g.y===23&&g.color===p.color).sort((a,b)=>a.x-b.x);
   for(const grain of bottom){if(p.removed)break;grain.alive=false;p.filled++;changed=true;if(p.filled===p.capacity){const next=(level.order||[]).find(id=>!state.delivered.includes(id));if((level.order||[]).includes(p.id)&&next!==p.id)return {error:'order',wanted:next};p.removed=true;state.delivered.push(p.id);events.push({type:'delivered',id:p.id,port:pi});}}
  }
  state.parity=1-state.parity;if(!changed)return {events,ticks};
 }
 throw Error('SAND_DID_NOT_SETTLE');
}
export function act(level,previous,action){
 const state=copy(previous),p=state.pieces.find(v=>v.id===action.id);
 if(action.type==='switch'){if(!level.shutters)return {ok:false,reason:'blocked'};state.mode=1-state.mode;}
 else if(action.type==='rotate'){if(!p||!canRotate(level,state,p))return {ok:false,reason:'turntable'};p.cells=rotateCells(p.cells);}
 else if(action.type==='move'){
  const {dx,dy}=action;if(!p||p.removed||!Number.isInteger(dx)||!Number.isInteger(dy)||(!dx&&!dy)||(dx&&dy)||Math.abs(dx)+Math.abs(dy)>7)return {ok:false,reason:'blocked'};
  const steps=Math.abs(dx)+Math.abs(dy);for(let n=1;n<=steps;n++)if(!fits(level,state,p.id,p.cells.map(([c,r])=>[c+Math.sign(dx)*n,r+Math.sign(dy)*n])))return {ok:false,reason:'blocked'};
  p.cells=p.cells.map(([c,r])=>[c+dx,r+dy]);
 }else return {ok:false,reason:'blocked'};
 state.moves++;const before=previous.grains.filter(g=>g.alive).length,result=settle(level,state);if(result.error)return {ok:false,reason:result.error,wanted:result.wanted};
 if(mass(previous).join()!==mass(state).join())throw Error('MASS_LOST');
 return {ok:true,state,events:result.events,absorbed:before-state.grains.filter(g=>g.alive).length};
}
export function stateKey(s){return JSON.stringify([s.mode,s.delivered,s.pieces.map(p=>[p.id,p.filled,p.removed,poseKey(p.cells)]),s.grains.map(g=>g.alive?g.bank*384+g.y*16+g.x:-1)]);}
export function pack(s){return {level:s.level,moves:s.moves,mode:s.mode,parity:s.parity,delivered:[...s.delivered],pieces:s.pieces.map(p=>[p.cells,p.filled,p.removed]),grains:s.grains.map(g=>g.alive?g.y*16+g.x:-1)};}
export function unpack(level,record){
 if(!record||record.level!==level.id||!Number.isSafeInteger(record.moves)||record.moves<0||![0,1].includes(record.mode)||![0,1].includes(record.parity))throw Error('INVALID_RUN');
 const state=createState(level),initialMass=mass(state);if(record.pieces?.length!==state.pieces.length||record.grains?.length!==state.grains.length||!Array.isArray(record.delivered))throw Error('INVALID_RUN');
 const occupied=new Set();state.pieces.forEach((p,i)=>{const [cells,filled,removed]=record.pieces[i];if(!Array.isArray(cells)||cells.length!==SHAPES[p.shape].length||!Number.isInteger(filled)||filled<0||filled>p.capacity||typeof removed!=='boolean'||removed!==(filled===p.capacity))throw Error('INVALID_RUN');for(const cell of cells){if(!Array.isArray(cell)||cell.length!==2||!cell.every(Number.isInteger))throw Error('INVALID_RUN');const [c,r]=cell,k=key(cell);if(c<0||c>=6||r<0||r>=8||level.walls.includes(k)||(!removed&&occupied.has(k)))throw Error('INVALID_RUN');if(!removed)occupied.add(k);}p.cells=copy(cells);p.filled=filled;p.removed=removed;});
 const sandCells=new Set();state.grains.forEach((g,i)=>{const n=record.grains[i];if(!Number.isInteger(n)||n< -1||n>=384)throw Error('INVALID_RUN');g.alive=n!==-1;if(g.alive){g.x=n%16;g.y=Math.floor(n/16);const k=g.bank*384+n;if(g.x<g.lane*9||g.x>g.lane*9+6||sandCells.has(k))throw Error('INVALID_RUN');sandCells.add(k);}});
 if(initialMass.join()!==mass(state).join()||new Set(record.delivered).size!==record.delivered.length||record.delivered.some(id=>!state.pieces.some(p=>p.id===id&&p.removed))||record.delivered.length!==state.pieces.filter(p=>p.removed).length)throw Error('INVALID_RUN');
 Object.assign(state,{moves:record.moves,mode:record.mode,parity:record.parity,delivered:[...record.delivered]});return state;
}
/* Macro search uses only the public action rules; no teleport, recolor or hidden queue. */
export function solve(level,initial=createState(level),{budget=3000}={}){
 let visited=0;const dead=new Set();
 function search(state){if(complete(state))return[];if(++visited>budget)return null;const hash=stateKey(state);if(dead.has(hash))return null;dead.add(hash);const candidates=[];
  for(const piece of state.pieces){if(piece.removed)continue;const queue=[{cells:piece.cells,path:[]}],seen=new Set([poseKey(piece.cells)]),parking=[];const docked=PORTS.some(port=>piece.cells.some(([c,r])=>c===port.c&&r===port.r));
   for(let qi=0;qi<queue.length;qi++){const node=queue[qi],virtual={...state,pieces:state.pieces.map(p=>p.id===piece.id?{...p,cells:node.cells}:p)};
    if(node.path.length&&PORTS.some(port=>node.cells.some(([c,r])=>c===port.c&&r===port.r))){let current=state,absorbed=0,valid=true;for(const a of node.path){const result=act(level,current,a);if(!result.ok){valid=false;break;}current=result.state;absorbed+=result.absorbed;}if(valid&&absorbed)candidates.push({state:current,path:node.path,score:absorbed*3+current.delivered.length*50-node.path.length});}
    if((docked||piece.cells.some(([c,r])=>c>=2&&c<=3&&r>=3&&r<=4))&&node.path.length&&node.path.length<=2&&!PORTS.some(port=>node.cells.some(([c,r])=>c===port.c&&r===port.r))){let current=state,valid=true;for(const action of node.path){const r=act(level,current,action);if(!r.ok){valid=false;break;}current=r.state;}if(valid)parking.push({state:current,path:node.path,score:-50-node.path.length-node.cells.filter(([c,r])=>r>=2&&r<=5&&c>=1&&c<=4).length});}
    for(const action of legalActions(level,virtual,piece.id)){const cells=action.type==='rotate'?rotateCells(node.cells):node.cells.map(([c,r])=>[c+action.dx,r+action.dy]),hash=poseKey(cells);if(!seen.has(hash)){seen.add(hash);queue.push({cells,path:[...node.path,action]});}}
   }parking.sort((a,b)=>b.score-a.score);candidates.push(...parking.slice(0,5));
  }
  if(level.shutters){const switched=act(level,state,{type:'switch'});if(switched.ok)candidates.push({state:switched.state,path:[{type:'switch'}],score:switched.absorbed*3+switched.state.delivered.length*50-8});}
  candidates.sort((a,b)=>b.score-a.score||a.path.length-b.path.length);
  for(const candidate of candidates){const rest=search(candidate.state);if(rest)return [...candidate.path,...rest];}return null;
 }
 const actions=search(initial);return {actions,visited,exhausted:visited>budget};
}
