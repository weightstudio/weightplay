// Authored boards: S start, L lantern, * firefly, K key, D gate,
// arrows constrain the next move, 1/2 ordered fireflies, ~ one-use ground.
export const DIRECTIONS = ['north', 'east', 'south', 'west'];
export const VECTORS = { north: [0,-1], east: [1,0], south: [0,1], west: [-1,0] };
export const ARROWS = { north:'↑', east:'→', south:'↓', west:'←' };
export const SIGNPOSTS = { '^':'north', '>':'east', 'v':'south', '<':'west' };
const definitions = [
  ['First Light','初見螢光', ['#####','#####','##.L#','#.*.#','#S###'], 5],
  ['Fern Corner','蕨葉轉角', ['#####','#L.*#','#.#.#','#*..#','#S###'], 8],
  ['Two Little Lights','兩點星光', ['#####','#.*L#','#.###','#*..#','#S.##'], 7],
  ['Moonlit Detour','月光繞道', ['#####','#.*L#','#.#.#','#S*.#','#####'], 9],
  ['The First Beacon','第一座燈塔', ['#..*L','#.#.#','#.*.#','#.###','#S###'], 10],
  ['The Brass Key','黃銅鑰匙', ['#####','#####','#*DL#','#K..#','#S###'], 7],
  ['Key in the Reeds','蘆葦藏鑰', ['#####','#L###','#D..#','#*.K#','#S###'], 10],
  ['Locked Shortcut','上鎖的捷徑', ['#####','#L*##','#D###','#..K#','#S..#'], 11],
  ['Lantern Gate','燈火之門', ['#####','#K.DL','#.#.#','#*..#','#S###'], 10],
  ['Keeper of the Key','守鑰者', ['#L###','#D.*#','#.#.#','#*.K#','#S###'], 12],
  ['Follow the Wind','順風而行', ['#####','#..L#','#^#.#','#S>*#','#####'], 9],
  ['Turning Leaves','轉向的葉子', ['#####','#.*L#','#^###','#..*#','#S###'], 10],
  ['The East Sign','向東的路標', ['#####','#..*L','###.#','#S>..','#####'], 8],
  ['Wind Around Stone','繞石微風', ['#####','#*>.L','#.#.#','#S.*#','#####'], 12],
  ['Windkeeper Crossing','風語交會', ['#..*L','#^###','#..*#','#^#.#','#S..#'], 12],
  ['A Light Before B','依序亮起', ['#####','#..L#','#2#.#','#S.1#','#####'], 10],
  ['Crossed Signals','交錯信號', ['#####','#1.L#','#.#2#','#S..#','#####'], 12],
  ['Reed Rendezvous','蘆葦會合', ['#####','#2.L#','#.#.#','#1..#','#S###'], 8],
  ['The Patient Beacon','等待的光', ['#####','#L2.#','#.#.#','#S.1#','#####'], 10],
  ['Two Lights Home','雙光歸途', ['#L###','#2..#','#.#1#','#...#','#S###'], 12],
  ['Fading Footsteps','消逝的足跡', ['#####','#..L#','#.#~#','#S*.#','#####'], 7],
  ['Once Across','僅此一次', ['#####','#.*L#','#~###','#..*#','#S###'], 10],
  ['Quiet Footbridge','安靜的橋', ['#####','#L~*#','#.#.#','#*~.#','#S..#'], 10],
  ['The Last Crossing','最後的渡口', ['#####','#KDL#','#~###','#S*.#','#####'], 9],
  ['Footprints at Dawn','黎明足印', ['#L*##','#D#.#','#...#','#*#K#','#S~.#'], 12],
  ['Lantern Expedition','提燈遠行', ['#####','#L#K#','#D#2#','#S>1#','#...#'], 12],
  ['The Winding Key','曲徑之鑰', ['#####','#L*##','#D###','#K~1#','#S..#'], 12],
  ['Whispers in Order','有序的低語', ['#####','#2>L#','#~#.#','#1..#','#S###'], 10],
  ['The Keeper Returns','守燈者歸來', ['#####','#L#K#','#D#2#','#S>1#','#.~.#'], 12],
  ['All Lights, One Home','萬點螢光一個家', ['#L###','#D2.#','#.#^#','#K~1#','#S###'], 12],
];
export const pages = definitions.map(([en, zh, board, budget], index) => ({
  id:index + 1, names:{en,'zh-Hant':zh}, board, budget,
  arc:Math.floor(index / 5), checkpoint:(index + 1) % 5 === 0,
}));
export function cellsFor(page) {
  return page.board.flatMap((row,y) => [...row].map((tile,x) => ({tile,x,y,id:y*5+x})));
}
export function initialRun(page) {
  const cells=cellsFor(page), start=cells.find(c=>c.tile==='S');
  return {x:start.x,y:start.y,collected:[],key:false,collapsed:[],order:1,step:0};
}
export function advance(page, previous, direction) {
  const state={...previous,collected:[...previous.collected],collapsed:[...previous.collapsed],step:previous.step+1};
  const vector=VECTORS[direction];
  if(!vector) return {state:previous,error:'direction'};
  const tile=page.board[previous.y][previous.x];
  if(SIGNPOSTS[tile] && SIGNPOSTS[tile]!==direction) return {state:previous,error:'wind'};
  const x=previous.x+vector[0], y=previous.y+vector[1], id=y*5+x;
  if(x<0||x>4||y<0||y>4) return {state:previous,error:'edge',target:{x,y}};
  const target=page.board[y][x];
  if(target==='#') return {state:previous,error:'stone',target:{x,y}};
  if(previous.collapsed.includes(id)) return {state:previous,error:'fragile',target:{x,y}};
  if(target==='D'&&!previous.key) return {state:previous,error:'gate',target:{x,y}};
  if(/[12]/.test(target)&&!previous.collected.includes(id)&&Number(target)!==previous.order) return {state:previous,error:'order',target:{x,y}};
  if(tile==='~') state.collapsed.push(previous.y*5+previous.x);
  state.x=x; state.y=y;
  const pickup=target==='*'||/[12]/.test(target);
  if(pickup&&!state.collected.includes(id)) {state.collected.push(id);if(/[12]/.test(target)) state.order+=1;}
  if(target==='K') state.key=true;
  return {state, collected:state.collected.length>previous.collected.length, key:state.key&&!previous.key};
}
export function isComplete(page,state) {
  return page.board[state.y][state.x]==='L' && state.collected.length===cellsFor(page).filter(c=>c.tile==='*'||/[12]/.test(c.tile)).length;
}
export function trace(page,route) {
  let current=initialRun(page); const frames=[];
  for(let i=0;i<route.length;i++) {
    if(i>=page.budget) return {frames,state:current,error:'budget',failedStep:i};
    const frame=advance(page,current,route[i]);
    if(frame.error) return {frames,state:current,error:frame.error,failedStep:i,target:frame.target};
    frames.push(frame); current=frame.state;
  }
  return {frames,state:current,complete:isComplete(page,current),error:null};
}
// Bounded shortest-route search supplies an optional hint, never automatic input.
export function solve(page, prefix=[]) {
  const prior=trace(page,prefix);
  if(prior.error) return null;
  const queue=[{state:prior.state,route:prefix}], seen=new Set();
  for(let i=0;i<queue.length&&i<150000;i++) {
    const {state,route}=queue[i];
    if(isComplete(page,state)) return route;
    if(route.length>=page.budget) continue;
    for(const direction of DIRECTIONS) {
      const next=advance(page,state,direction); if(next.error) continue;
      const value=next.state;
      const key=[value.x,value.y,value.key,value.order,[...value.collected].sort((a,b)=>a-b).join(','),[...value.collapsed].sort((a,b)=>a-b).join(',')].join('|');
      if(seen.has(key)) continue;
      seen.add(key);queue.push({state:value,route:[...route,direction]});
    }
  }
  return null;
}
export function normalizeProgress(raw={}) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};
  const cleared=Array.isArray(raw.cleared)?[...new Set(raw.cleared.map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<pages.length))].sort((a,b)=>a-b):[];
  const highest=cleared.length?cleared.at(-1)+2:1;
  return {...raw,cleared,unlocked:Math.min(pages.length,Math.max(1,highest,Math.floor(Number(raw.unlocked)||1)))};
}
