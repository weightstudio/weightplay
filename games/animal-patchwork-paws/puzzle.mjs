// Pure, deterministic puzzle rules. Coordinates stay physical in RTL locales.
export const MODES = ['match', 'wind', 'echo', 'compass', 'braid', 'guardian'];
export const COLORS = ['#eadfc4', '#45886a', '#287aa3', '#d39731', '#975d9c', '#b65b4b'];
export const mod4 = n => ((n % 4) + 4) % 4;
export function effects(stage, index) {
  const n = stage.size, count = n * n;
  if (stage.mode === 'compass' && index === stage.anchor) return [];
  if (stage.mode === 'wind' && stage.pair.includes(index)) return stage.pair.map(i => [i, 1]);
  if (stage.mode === 'echo' && index !== count - 1 - index) return [[index, 1], [count - 1 - index, -1]];
  if (stage.mode === 'braid') return [[index, 1], [Math.floor(index / n) * n + (index + 1) % n, 1]];
  if (stage.mode === 'guardian') return [[index, 1], ...[-n, 1, n, -1].map(d => index + d).filter(i => i >= 0 && i < count && Math.abs(i % n - index % n) + Math.abs(Math.floor(i / n) - Math.floor(index / n)) === 1).map(i => [i, 1])];
  return [[index, 1]];
}
export function turn(stage, rotations, index, direction = 1) {
  const next = rotations.slice();
  for (const [i, delta] of effects(stage, index)) next[i] = mod4(next[i] + delta * direction);
  return next;
}
export const edgesAt = (stage, rotations, i) => [0, 1, 2, 3].map(d => stage.tiles[i][mod4(d - rotations[i])]);
export function inspect(stage, rotations) {
  const edges = rotations.map((_, i) => edgesAt(stage, rotations, i));
  const seams = [], borders = [], n = stage.size;
  for (let i = 0; i < edges.length; i++) {
    const row = Math.floor(i / n), col = i % n;
    if (col < n - 1) seams.push({a:i, b:i+1, dir:1, ok:edges[i][1] === edges[i+1][3]});
    if (row < n - 1) seams.push({a:i, b:i+n, dir:2, ok:edges[i][2] === edges[i+n][0]});
    for (const d of [0,1,2,3]) if ([row===0,col===n-1,row===n-1,col===0][d]) borders.push({a:i,dir:d,ok:edges[i][d]===0});
  }
  const errors = [...seams, ...borders].filter(s => !s.ok);
  return {edges, seams, borders, errors, matched:seams.filter(s=>s.ok).length, total:seams.length, solved:errors.length === 0};
}
const policies = new Map();
const encode = rotations => rotations.reduce((code, r, i) => code | r << (i * 2), 0);
function moveCode(code, changes, direction) {
  for (const [i, delta] of changes) { const shift=i*2, r=((code>>>shift)&3); code=(code & ~(3<<shift)) | (mod4(r + delta*direction)<<shift); }
  return code;
}
// Reverse BFS: a policy action always reduces the remaining shortest path by one.
export function policy(stage) {
  const moves = stage.tiles.map((_, i) => effects(stage, i));
  const key=JSON.stringify(moves);
  if (policies.has(key)) return policies.get(key);
  const count=4 ** stage.tiles.length, distance=new Int16Array(count).fill(-1), action=new Int8Array(count).fill(-1), queue=new Uint32Array(count);
  let head=0, tail=1; distance[0]=0;
  while(head<tail) {
    const code=queue[head++];
    for(let i=0;i<moves.length;i++) {
      if(!moves[i].length)continue;
      const previous=moveCode(code,moves[i],-1);
      if(distance[previous]!==-1)continue;
      distance[previous]=distance[code]+1; action[previous]=i; queue[tail++]=previous;
    }
  }
  const result={distance,action,reachable:tail};policies.set(key,result);return result;
}
export const hint = (stage, rotations) => policy(stage).action[encode(rotations)];
export const distance = (stage, rotations) => policy(stage).distance[encode(rotations)];

export const stages = Array.from({length:30},(_,index)=> {
  const number=index+1, family=Math.floor(index/5), mode=MODES[family], size=family<2?2:3;
  const tiles=Array.from({length:size*size},()=>[0,0,0,0]);
  // Authored deterministic palette motifs; each boundary has a blank hem.
  const motif=[1,2,3,4,5,2,4,1,5,3,1,4,2,5,3,2,1,3];
  let edge=0;
  for(let i=0;i<tiles.length;i++) {
    if(i%size<size-1){const c=motif[(edge++ + index*3)%motif.length];tiles[i][1]=tiles[i+1][3]=c;}
    if(i<tiles.length-size){const c=motif[(edge++ + index*3)%motif.length];tiles[i][2]=tiles[i+size][0]=c;}
  }
  const stage={number,mode,size,tiles,pair:index%2?[1,2]:[0,3],anchor:[0,2,4,6,8][index%5],name:`stage${number}`,arc:`arc${family+1}`,objective:'objective',rule:`rule${family+1}`,checkpoint:number%5===0};
  let initial=tiles.map(()=>0), seed=number*7919;
  const count=number===1?2:3+(index%5)*2+family;
  for(let i=0;i<count;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const cell=seed%tiles.length;initial=turn(stage,initial,cell,i%3===0?-1:1);}
  if(inspect(stage,initial).solved)initial=turn(stage,initial,mode==='compass'?(stage.anchor+1)%tiles.length:0,-1);
  stage.initial=initial;
  return Object.freeze(stage);
});
