// The same immutable transition powers native movement, full-state Undo and hints.
export const directions=Object.freeze({up:[0,-1],left:[-1,0],down:[0,1],right:[1,0]});
export const at=(cells,x,y)=>Boolean(cells?.some(c=>c[0]===x&&c[1]===y));
export const allMask=p=>(1<<p.switches.length)-1;
export const count=mask=>mask.toString(2).replaceAll('0','').length;
export const held=(g,p)=>(p.plates||[]).filter(([x,y])=>at(g.crates,x,y)).length;
export const ready=(g,p)=>g.mask===allMask(p)&&held(g,p)===(p.plates?.length||0);
export const initial=p=>({x:p.start[0],y:p.start[1],mask:0,taken:false,steps:0,...(p.chapter?{phase:0,charges:p.charges,used:0,crates:(p.crates||[]).map(c=>[...c])}:{})});
export const won=(g,p)=>g.taken&&at([p.exit],g.x,g.y)&&held(g,p)===(p.plates?.length||0);
export function transition(before,direction,p){
 const g={...before,...(before.crates?{crates:before.crates.map(c=>[...c])}:{})},path=[];let rejected=false;
 if(direction==='phase'){
  if(!p.chapter||g.charges<1)return null;
  g.phase=1-g.phase;g.charges--;g.steps++;return {game:g,path,rejected,phaseChanged:true};
 }
 if(!directions[direction])return null;
 const [dx,dy]=directions[direction];
 const blocked=(x,y)=>x<0||x>7||y<0||y>4||at(p.walls,x,y)||p.gates?.some(c=>c.x===x&&c.y===y&&count(g.mask)<c.needs)||p.phaseGates?.some(c=>c.x===x&&c.y===y&&c.phase!==g.phase)||at(p.pressureGates,x,y)&&held(g,p)!==(p.plates?.length||0);
 function light(){
  const i=p.switches.findIndex(c=>c[0]===g.x&&c[1]===g.y);
  if(i>=0&&!(g.mask&(1<<i))){const next=p.switches.findIndex((_,j)=>!(g.mask&(1<<j)));
   if((!p.ordered||i===next)&&(!p.switchPhases||p.switchPhases[i]===g.phase))g.mask|=1<<i;else rejected=true;
  }
 }
 function step(){
  const x=g.x+dx,y=g.y+dy;if(blocked(x,y))return false;
  const c=g.crates?.findIndex(v=>v[0]===x&&v[1]===y)??-1;
  if(c>=0){const nx=x+dx,ny=y+dy;if(blocked(nx,ny)||at(g.crates,nx,ny)||at(p.ice,nx,ny)||p.portals?.some(pair=>at(pair,nx,ny)))return false;g.crates[c]=[nx,ny];}
  g.x=x;g.y=y;g.steps++;path.push([x,y]);light();
  const portal=p.portals?.find(pair=>at(pair,g.x,g.y));
  if(portal){const dest=portal.find(c=>c[0]!==g.x||c[1]!==g.y);if(!at(g.crates,...dest)){[g.x,g.y]=dest;path.push([...dest]);light();}}
  const battery=p.batteries?.findIndex(c=>c[0]===g.x&&c[1]===g.y)??-1;
  if(battery>=0&&!(g.used&(1<<battery))){g.used|=1<<battery;g.charges++;}
  return true;
 }
 if(!step())return null;
 let coast=0;while(at(p.ice,g.x,g.y)&&coast++<8)if(!step())break;
 if(ready(g,p)&&at([p.key],g.x,g.y))g.taken=true;
 return {game:g,path,rejected};
}

// Dijkstra uses cell costs rather than keypress counts, preserving the original ice rule.
// A binary heap and predecessor links keep hint memory bounded by visited states.
export function solve(start,p,{diagnostics=false,maxStates=500000}={}){
 const id=g=>`${g.x},${g.y},${g.mask},${+g.taken},${g.phase||0},${g.charges||0},${g.used||0},${(g.crates||[]).map(c=>c[1]*8+c[0]).sort((a,b)=>a-b).join('.')}`;
 const heap=[],costs=new Map(),parents=new Map();const startId=id(start);
 function push(n){heap.push(n);let i=heap.length-1;while(i>0){const parent=(i-1)>>1;if(heap[parent].g.steps<=n.g.steps)break;heap[i]=heap[parent];i=parent;}heap[i]=n;}
 function pop(){const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].g.steps<heap[j].g.steps)j++;if(last.g.steps<=heap[j].g.steps)break;heap[i]=heap[j];i=j;}heap[i]=last;}return top;}
 costs.set(startId,start.steps);push({g:start,id:startId});
 while(heap.length){const node=pop();if(node.g.steps!==costs.get(node.id))continue;
  if(won(node.g,p)){const route=[];for(let k=node.id;k!==startId;){const prev=parents.get(k);route.push(prev.action);k=prev.id;}route.reverse();return diagnostics?{route,cost:node.g.steps,states:costs.size}:route;}
  if(node.g.steps>=p.limit)continue;
  for(const action of [...Object.keys(directions),...(p.chapter&&node.g.charges>0?['phase']:[])]){
   const next=transition(node.g,action,p);if(!next||next.game.steps>p.limit)continue;
   const key=id(next.game);if(costs.has(key)&&costs.get(key)<=next.game.steps)continue;
   costs.set(key,next.game.steps);parents.set(key,{id:node.id,action});push({g:next.game,id:key});
   if(costs.size>maxStates)throw new Error(`WORKSHOP_HINT_STATE_LIMIT:${p.id||'original'}`);
  }
 }
 return diagnostics?{route:null,cost:null,states:costs.size}:null;
}
