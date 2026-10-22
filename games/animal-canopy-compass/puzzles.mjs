// Pure, deterministic puzzle rules. Rendering and animation never decide a result.
export const DIRECTIONS = ['north','northeast','east','southeast','south','southwest','west','northwest'];
export const SEALS = ['sun','moon','leaf','star'];
export const CAMPAIGN_KEY = 'weightplay-animal-canopy-compass-campaign-v1';
export const wrap = n => ((n % 8) + 8) % 8;
export const distance = (a,b) => Math.min(wrap(a-b),wrap(b-a));
export const mirror = (n,axis) => wrap(axis === 'vertical' ? -n : 4-n);

export function matches(clue, direction, phase, previous) {
  switch(clue.kind) {
    case 'bearing': return direction === clue.from;
    case 'turn': return direction === wrap(clue.from + clue.steps);
    case 'sector': return distance(direction, clue.from) <= 1;
    case 'seal': return phase.seals[direction] === clue.seal;
    case 'notSeal': return phase.seals[direction] !== clue.seal;
    case 'mirror': return direction === mirror(clue.from,clue.axis);
    case 'mirrorSector': return distance(direction,mirror(clue.from,clue.axis)) <= 1;
    case 'echo': return direction === wrap(previous + clue.steps);
    case 'echoSector': return distance(direction,wrap(previous+clue.steps)) <= 1;
    default: throw new Error(`Unknown clue: ${clue.kind}`);
  }
}
export function candidates(phase,previous=0,clues=phase.clues) {
  return DIRECTIONS.map((_,i)=>i).filter(i=>clues.every(c=>matches(c,i,phase,previous)));
}

function sealsFor(seed,target) {
  // Opposite perches share a mark; every three-perch sector has distinct marks.
  const order = [[0,1,2,3],[2,0,3,1],[1,3,0,2],[3,2,1,0]][seed%4];
  return DIRECTIONS.map((_,i)=>order[wrap(i-target+seed)%4]);
}
function makePhase(kind,target,seed,previous) {
  const seals = sealsFor(seed,target);
  let clues, landmark = null;
  const steps = [2,-2,1,-1,4][seed%5];
  const axis = seed%2 ? 'horizontal' : 'vertical';
  if (kind==='direct') clues=[{kind:'bearing',from:target}];
  if (kind==='turn') {
    landmark=wrap(target-steps);
    clues=[{kind:'turn',from:landmark,steps}];
  }
  if (kind==='cross') clues=[{kind:'sector',from:wrap(target+(seed%3)-1)},{kind:'seal',seal:seals[target]}];
  if (kind==='mirror') {
    landmark=mirror(target,axis);
    clues=[{kind:'mirror',from:landmark,axis}];
  }
  if (kind==='mirrorCross') {
    landmark=mirror(wrap(target+(seed%3)-1),axis);
    clues=[{kind:'mirrorSector',from:landmark,axis},{kind:'seal',seal:seals[target]}];
  }
  if (kind==='exclude') clues=[{kind:'sector',from:target},{kind:'notSeal',seal:seals[wrap(target-1)]},{kind:'notSeal',seal:seals[wrap(target+1)]}];
  if (kind==='echo') clues=[{kind:'echo',steps:wrap(target-previous)>4?wrap(target-previous)-8:wrap(target-previous)}];
  if (kind==='echoCross') {
    const center=wrap(target+(seed%3)-1), delta=wrap(center-previous);
    clues=[{kind:'echoSector',steps:delta>4?delta-8:delta},{kind:'seal',seal:seals[target]}];
  }
  const phase={kind,seals,clues,landmark};
  const found=candidates(phase,previous);
  if(found.length!==1 || found[0]!==target) throw new Error(`Ambiguous authored phase ${seed}`);
  return phase;
}

// Each row is authored, not a difficulty multiplier or random daily seed.
const plans = [
  [['direct',2]], [['direct',7]], [['turn',4]], [['turn',1]], [['direct',6],['turn',3]],
  [['cross',1]], [['cross',4]], [['cross',7]], [['turn',5],['cross',2]], [['cross',6],['cross',3],['cross',0]],
  [['mirror',1]], [['mirror',6]], [['mirrorCross',3]], [['mirrorCross',5],['cross',0]], [['mirror',7],['mirrorCross',2],['mirrorCross',4]],
  [['exclude',2]], [['exclude',7]], [['exclude',4],['cross',1]], [['mirrorCross',0],['exclude',5]], [['exclude',6],['mirrorCross',3],['exclude',0]],
  [['direct',1],['echo',4]], [['turn',6],['echo',0]], [['cross',3],['echoCross',7]], [['exclude',5],['echoCross',2]], [['mirrorCross',1],['echoCross',4],['echoCross',6]],
  [['cross',7],['mirrorCross',2],['echoCross',5]], [['exclude',3],['echoCross',0],['mirrorCross',6]],
  [['mirrorCross',4],['exclude',1],['echoCross',7]], [['cross',0],['echoCross',5],['exclude',2]],
  [['cross',6],['mirrorCross',1],['exclude',4],['echoCross',7],['echo',2]]
];
export const STAGES = plans.map((plan,index)=> {
  let previous=0;
  return {id:index+1,arc:Math.floor(index/5)+1,checkpoint:(index+1)%5===0,phases:plan.map(([kind,target],p)=>{
    const phase=makePhase(kind,target,index*7+p,previous); previous=target; return phase;
  })};
});
export function normalizeSave(raw) {
  const saved=raw && typeof raw==='object' ? raw : {};
  const completed=[...new Set((Array.isArray(saved.completed)?saved.completed:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=30))].sort((a,b)=>a-b);
  const bests={};
  for(const [key,value] of Object.entries(saved.bests||{})) if(Number(key)>=1&&Number(key)<=30&&Number.isInteger(value)&&value>=0&&value<10000)bests[key]=value;
  const mastery={};
  for(const [key,value] of Object.entries(saved.masteryV26||{}))if(completed.includes(Number(key))&&Number.isInteger(value)&&value>=1&&value<=3)mastery[key]=value;
  const badges=(Array.isArray(saved.badges)?saved.badges:[]).filter((n,i,a)=>completed.includes(n)&&n%5===0&&a.indexOf(n)===i);
  return {schema:1,completed,bests,badges,masteryV26:mastery};
}
export function unlocked(save) { return Math.min(30,Math.max(0,...save.completed)+1); }
export function rating(mistakes,hints) {return mistakes===0&&hints===0?3:mistakes<=2&&hints<=1?2:1;}
export function settle(save,id,mistakes,hints) {
  const next=normalizeSave(save);
  if(!next.completed.includes(id))next.completed.push(id);
  next.completed.sort((a,b)=>a-b);
  next.masteryV26[id]=Math.max(next.masteryV26[id]||0,rating(mistakes,hints));
  if(id%5===0&&!next.badges.includes(id))next.badges.push(id);
  return next;
}
