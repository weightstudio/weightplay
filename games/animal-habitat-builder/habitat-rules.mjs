// The original thirty reserve identities and save progression remain stable.
export const baseProfiles = [
  { badge: '◎', need: [2,2,1,1], limit: 8 },
  { badge: '≋', need: [3,2,2,1], limit: 10, waterConnected: true },
  { badge: '◫', need: [2,2,3,2], limit: 12, edgeForest: 2, shelterForest: true },
  { badge: '↔', need: [2,3,2,2], limit: 12, meadowWater: 3, shelterForest: true },
  { badge: '⇆', need: [5,3,3,2], limit: 16, waterSpan: true, forestConnected: true, blocked: [6,8,16,18] },
  { badge: '★', need: [4,4,4,3], limit: 18, waterConnected: true, forestConnected: true, shelterForest: true, meadowWater: 4, blocked: [0,5,10,15] },
];
export const profiles = [...baseProfiles, ...Array.from({length: 24}, (_, i) => {
  const base = baseProfiles[i % 6], arc = Math.floor(i / 6) + 2;
  const need = base.need.map((n,t) => Math.min(5,n + ((i+t)%3 === 0 ? 1 : 0)));
  return {badge: `${base.badge}·${arc}${i%6+1}`, need, limit: Math.min(20,Math.max(need.reduce((a,b)=>a+b,0)+1,base.limit+arc))};
})];
export function neighbors(i) {
  return [i%5>0?i-1:-1,i%5<4?i+1:-1,i>4?i-5:-1,i<15?i+5:-1].filter(n=>n>=0);
}
export const counts = grid => [0,1,2,3].map(t=>grid.filter(v=>v===t).length);
export function connected(grid,type,minimum) {
  const cells=grid.map((v,i)=>v===type?i:-1).filter(i=>i>=0);
  if(cells.length<minimum)return false;
  const remaining=new Set(cells), queue=[cells[0]]; remaining.delete(cells[0]);
  while(queue.length)for(const n of neighbors(queue.shift()))if(remaining.delete(n))queue.push(n);
  return remaining.size===0;
}
export function checks(profile,grid) {
  const cells=type=>grid.map((v,i)=>v===type?i:-1).filter(i=>i>=0);
  const beside=(i,type)=>neighbors(i).some(n=>grid[n]===type);
  const result=[{key:'quantity',pass:profile.need.every((n,t)=>counts(grid)[t]>=n)}];
  if(profile.waterConnected)result.push({key:'waterConnected',pass:connected(grid,0,profile.need[0])});
  if(profile.waterSpan)result.push({key:'waterSpan',pass:connected(grid,0,profile.need[0])&&cells(0).some(i=>i%5===0)&&cells(0).some(i=>i%5===4)});
  if(profile.edgeForest)result.push({key:'edgeForest',n:profile.edgeForest,pass:cells(2).filter(i=>i%5===0||i%5===4||i<5||i>=15).length>=profile.edgeForest});
  if(profile.forestConnected)result.push({key:'forestConnected',pass:connected(grid,2,profile.need[2])});
  if(profile.shelterForest)result.push({key:'shelterForest',pass:cells(3).length>=profile.need[3]&&cells(3).every(i=>beside(i,2))});
  if(profile.meadowWater)result.push({key:'meadowWater',n:profile.meadowWater,pass:cells(1).filter(i=>beside(i,0)).length>=profile.meadowWater});
  return result;
}
export function createRun(stage) {return {stage,grid:Array(20).fill(-1),selected:0,moves:0,history:[]};}
export function place(run,index) {
  const profile=profiles[run.stage-1];
  if(!Number.isInteger(index)||index<0||index>=20||profile.blocked?.includes(index))return 'blocked';
  if(run.grid[index]===run.selected)return 'same';
  run.history.push({grid:run.grid.slice(),moves:run.moves});
  run.grid[index]=run.selected; run.moves++;
  return checks(profile,run.grid).every(c=>c.pass)?'win':run.moves>=profile.limit?'lose':'placed';
}
export function undoPlacement(run) {
  const previous=run.history.pop(); if(!previous)return false;
  run.grid=previous.grid;run.moves=previous.moves;return true;
}
export function placementPreview(run,index) {
  if(index<0||index>=20||profiles[run.stage-1].blocked?.includes(index))return null;
  const grid=run.grid.slice();grid[index]=run.selected;
  return {counts:counts(grid),checks:checks(profiles[run.stage-1],grid)};
}
