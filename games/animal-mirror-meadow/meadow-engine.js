// One source of truth: mirrors, live beams, targets and success share this tracer.
export const DIRS = [[1,0],[0,1],[-1,0],[0,-1]];
export const reflect = (direction, slash) => (slash === 0 ? [3,2,1,0] : [1,0,3,2])[direction];
const level = (name, source, mirrors, targets, extra = {}) => ({
  name, size:7, source, mirrors:mirrors.map(([x,y,initial=1])=>({x,y,initial})),
  targets, walls:[], prisms:[], gates:[], ...extra,
});
// Authored layouts. Initial orientations are deliberately not winning states.
export const LEVELS = [
  level('first',[-1,3,0],[[3,3]],[[3,0]]),
  level('corner',[-1,4,0],[[2,4],[2,1]],[[6,1]],{walls:[[4,4],[2,6]]}),
  level('lanterns',[-1,5,0],[[1,5],[1,2],[5,2,0]],[[3,2],[5,6]]),
  level('reverse',[7,1,2],[[5,1,1],[5,5,0]],[[6,5]],{walls:[[3,1],[5,0],[2,5]]}),
  level('keeper',[-1,5,0],[[1,5],[1,1],[5,1,0],[5,4,1]],[[3,1],[2,4]],{walls:[[3,5],[1,0],[6,1],[5,6]],checkpoint:true}),
  level('split',[-1,3,0],[[3,3,1]],[[6,3],[3,0]],{prisms:[0]}),
  level('branches',[-1,4,0],[[2,4,1],[2,1,1],[5,4,0]],[[5,1],[5,6]],{prisms:[0],walls:[[2,6],[6,4]]}),
  level('gate',[-1,5,0],[[1,5,1],[4,1,1]],[[6,1]],{gates:[[[1,2],[4,4]]],walls:[[3,5],[4,0]]}),
  level('return',[7,5,2],[[5,5,0],[2,2,1],[2,0,0]],[[4,0],[2,4]],{gates:[[[5,2],[2,5]]],prisms:[1]}),
  level('festival',[-1,4,0],[[1,4,1],[5,4,0],[3,1,1],[5,1,0]],[[6,4],[3,0],[5,6]],{prisms:[0,1,2],gates:[[[1,1],[3,3]]],walls:[[0,1],[3,6]],checkpoint:true}),
];

export function trace(level, angles) {
  const {size,mirrors,targets,walls,gates,prisms}=level;
  const queue=[level.source],visited=new Set(),segments=[],lit=new Set(),energized=new Set();
  let loops=0,blocked=0;
  while(queue.length){
    let [x,y,d]=queue.shift();
    for(let step=0;step<size*size*4+1;step++){
      const [dx,dy]=DIRS[d],nx=x+dx,ny=y+dy;
      segments.push([[x,y],[nx,ny]]);
      if(nx<0||ny<0||nx>=size||ny>=size)break;
      x=nx;y=ny;
      const key=`${x},${y},${d}`;
      if(visited.has(key)){loops++;break;} visited.add(key);
      if(walls.some(([a,b])=>x===a&&y===b)){blocked++;break;}
      targets.forEach(([a,b],i)=>{if(x===a&&y===b)lit.add(i);});
      const m=mirrors.findIndex(p=>p.x===x&&p.y===y);
      if(m>=0){energized.add(m);if(prisms.includes(m))queue.push([x,y,d]);d=reflect(d,angles[m]);}
      const pair=gates.find(p=>p.some(([a,b])=>a===x&&b===y));
      if(pair){const other=pair.find(([a,b])=>a!==x||b!==y);[x,y]=other;}
    }
  }
  return {segments,lit:[...lit],energized:[...energized],loops,blocked,won:lit.size===targets.length};
}

// Used by hints and tests; success never compares the board to this solution.
export function solve(level, current=level.mirrors.map(p=>p.initial)) {
  let best=null,cost=Infinity;
  for(let mask=0;mask<2**level.mirrors.length;mask++){
    const angles=level.mirrors.map((_,i)=>(mask>>i)&1);
    if(!trace(level,angles).won)continue;
    const distance=angles.reduce((s,v,i)=>s+(v!==current[i]),0);
    if(distance<cost){best=angles;cost=distance;}
  }
  return best;
}

export function normalizeSave(raw,total=LEVELS.length){
  const unlocked=Number.isInteger(raw?.unlocked)?Math.max(1,Math.min(total,raw.unlocked)):1;
  const best={};
  for(const [k,v] of Object.entries(raw?.best||{}))if(/^\d+$/.test(k)&&+k>=0&&+k<unlocked&&Number.isInteger(v)&&v>0&&v<100000)best[k]=v;
  return {schema:1,unlocked,best};
}
