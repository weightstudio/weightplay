// Original Moonlight Conservatory puzzles. Logic uses quarter turns, independent of art.
export const SAVE_KEY = 'weightplay:animal-ring-garden:conservatory:v1';
export const LEGACY_KEY = 'weightplay:animal-ring-garden:v10:completed';
export const FINISH_COST = 12;
export const mod = n => ((n % 4) + 4) % 4;
const p = (target, kind = 'free', extra = {}) => ({target, kind, ...extra});
// Each row changes the target relation/decision, with an explicit learning purpose.
const rows = [
  ['Firefly Arbor','螢火樹蔭',[0,0,0],[p([1,2,3])],'Read three different glyphs; choose the shorter direction.'],
  ['Mosslight Pool','苔光池',[0,0,0],[p([3,1,2])],'Read from outer to inner; reverse the first turn.'],
  ['Rainbow Fern','彩虹蕨地',[0,0,0],[p([2,3,1])],'Plan the half-turn before the two short turns.'],
  ['Silver Reed','銀蘆花徑',[0,0,0],[p([3,2,1])],'Mirror the previous pattern and compare directions.'],
  ['First Bloom','初月綻放',[2,1,3],[p([1,3,2]),p([3,0,1])],'Checkpoint: retain the board between two successive patterns.'],
  ['Braided Roots','交織根系',[0,1,2],[p([2,0,3],'pair')],'Outer also turns middle; settle the driver first.'],
  ['Dew Steps','露珠階梯',[1,0,3],[p([3,3,1],'pair')],'An aligned middle must temporarily move for the outer ring.'],
  ['Two Fireflies','雙生螢光',[3,1,0],[p([0,3,2],'pair',{link:1})],'Middle drives inner instead of outer driving middle.'],
  ['Root Arch','根拱迴廊',[2,3,1],[p([0,1,3],'pair',{link:1})],'Use the linked move to solve two rings together.'],
  ['Rootkeeper','根系守望',[3,0,2],[p([1,3,0],'cascade')],'Checkpoint: outer moves all three; middle moves the inner pair.'],
  ['Mirror Pool','鏡映水池',[0,0,1],[p([1,3,3],'mirror')],'Outer and middle counter-rotate; a move can solve both.'],
  ['Backward Fern','逆光蕨葉',[1,2,3],[p([3,1,0],'mirror')],'Rebuild alignment after an opposing turn.'],
  ['Silver Reflection','銀色倒影',[2,0,1],[p([1,2,3],'mirror',{link:1})],'Middle counter-rotates the inner ring.'],
  ['Crossed Moons','交錯雙月',[3,2,0],[p([0,0,2],'mirror',{link:1})],'Balance the half-turn and reverse-linked pair.'],
  ['Mirrorkeeper','鏡池守望',[0,3,2],[p([2,2,1],'weave')],'Checkpoint: outer drives all; middle counter-rotates inner.'],
  ['Sun Clutch','日光離合',[0,1,3],[p([2,3,3],'clutch')],'Switching to coupled rings saves a move; switching itself counts.'],
  ['Moon Clutch','月影離合',[1,0,2],[p([3,2,1],'clutch',{mode:1})],'Begin with coupled rings; choose when to disengage.'],
  ['Quiet Gear','靜謐齒輪',[3,2,1],[p([0,1,2],'clutch')],'Compare one coupled turn with two independent turns.'],
  ['Twin Compass','雙向羅盤',[2,3,0],[p([1,1,3],'clutch',{mode:1})],'Plan mode changes around a matching ring.'],
  ['Twilight Gate','晨昏之門',[1,0,3],[p([3,1,2],'clutch'),p([0,3,1],'clutch')],'Checkpoint: two patterns share one switchable mechanism.'],
  ['Sealed Petal','封印花瓣',[0,1,2],[p([2,3,0],'seal',{gate:1})],'Outer turns only while inner shows mint; prepare a temporary key.'],
  ['Amber Key','琥珀之鑰',[1,2,3],[p([3,0,2],'seal',{gate:0})],'Align inner to amber, turn outer, then restore the final target.'],
  ['Violet Lock','紫晶門扉',[3,0,1],[p([1,2,3],'seal',{gate:3})],'The key is also the final inner glyph; exploit that coincidence.'],
  ['Coral Passage','珊瑚通道',[2,3,0],[p([0,1,2],'seal',{gate:2})],'Solve middle first without losing the required inner key.'],
  ['Moonkeeper','月門守望',[3,1,0],[p([1,0,3],'seal',{gate:2,linked:true})],'Checkpoint: middle also turns inner; plan the key after the link.'],
  ['Woven Starlight','星光交織',[0,2,1],[p([2,1,0],'cascade'),p([1,3,0],'mirror')],'Read the announced rule change between two constellations.'],
  ['Silent Observatory','靜夜觀測站',[1,3,0],[p([3,1,2],'seal',{gate:0}),p([0,2,1],'clutch')],'Carry orientation from a sealed phase into switchable gears.'],
  ['Rainbow Orrery','虹彩星儀',[2,0,3],[p([0,3,1],'weave'),p([3,1,2],'cascade')],'Reverse the dependency order as the gear network changes.'],
  ['Last Moonbeam','最後的月光',[3,1,2],[p([1,0,3],'clutch',{mode:1}),p([2,3,0],'seal',{gate:1,linked:true})],'Spend mode changes wisely before preparing the final seal.'],
  ['Conservatory Awakens','溫室甦醒',[0,3,1],[p([2,0,2],'weave'),p([1,2,0],'seal',{gate:3,linked:true}),p([3,2,0],'clutch',{mode:1})],'Finale: three distinct mechanisms, temporary seal key, retained orientation and mode decisions.'],
];
const simplifiedTitles=['萤火树荫','苔光池','彩虹蕨地','银芦花径','初月绽放','交织根系','露珠阶梯','双生萤光','根拱回廊','根系守望','镜映水池','逆光蕨叶','银色倒影','交错双月','镜池守望','日光离合','月影离合','静谧齿轮','双向罗盘','晨昏之门','封印花瓣','琥珀之钥','紫晶门扉','珊瑚通道','月门守望','星光交织','静夜观测站','虹彩星仪','最后的月光','温室苏醒'];
export const STAGES = Object.freeze(rows.map(([en,zh,seed,phases,purpose],index) =>
  Object.freeze({id:index+1,en,zh,zhHans:simplifiedTitles[index],seed,phases,purpose,arc:Math.floor(index/5),checkpoint:index%5===4})));
export function vectors(phase, mode=0) {
  if (phase.kind === 'pair') return phase.link === 1 ? [[1,0,0],[0,1,1],[0,0,1]] : [[1,1,0],[0,1,0],[0,0,1]];
  if (phase.kind === 'mirror') return phase.link === 1 ? [[1,0,0],[0,1,-1],[0,0,1]] : [[1,-1,0],[0,1,0],[0,0,1]];
  if (phase.kind === 'cascade') return [[1,1,1],[0,1,1],[0,0,1]];
  if (phase.kind === 'weave') return [[1,1,1],[0,1,-1],[0,0,1]];
  if (phase.kind === 'clutch' && mode === 1) return [[1,1,0],[0,1,-1],[0,0,1]];
  if (phase.kind === 'seal' && phase.linked) return [[1,0,0],[0,1,1],[0,0,1]];
  return [[1,0,0],[0,1,0],[0,0,1]];
}
export function applyMove(phase, state, action) {
  if (action.ring === 3) return phase.kind === 'clutch' ? {...state,mode:1-state.mode} : null;
  if (![0,1,2].includes(action.ring) || ![-1,1].includes(action.dir)) return null;
  if (phase.kind === 'seal' && action.ring === 0 && state.rings[2] !== phase.gate) return null;
  return {rings:state.rings.map((n,i)=>mod(n+vectors(phase,state.mode)[action.ring][i]*action.dir)),mode:state.mode};
}
export const aligned = (phase,rings) => phase.target.every((n,i)=>n===rings[i]);
export function solve(phase, initial) {
  const encode = s => s.rings.join('')+s.mode;
  const queue=[{...initial,path:[]}], seen=new Set([encode(initial)]);
  for (let cursor=0;cursor<queue.length;cursor++) {
    const state=queue[cursor];
    if(aligned(phase,state.rings)) return state.path;
    for(let ring=0;ring<(phase.kind==='clutch'?4:3);ring++) for(const dir of (ring===3?[1]:[-1,1])) {
      const action={ring,dir},next=applyMove(phase,state,action);
      if(!next || seen.has(encode(next)))continue;
      seen.add(encode(next));queue.push({...next,path:[...state.path,action]});
    }
  }
  return null;
}
export function parFor(stage) {
  let rings=stage.seed,total=0;
  for(const phase of stage.phases){const path=solve(phase,{rings,mode:phase.mode||0});if(!path)return null;total+=path.length;rings=phase.target;}
  return total;
}
export function normalizeSave(value={},legacy=[]) {
  if(!value || typeof value!=='object' || Array.isArray(value))value={};
  const completed=[...new Set([...(Array.isArray(value.completed)?value.completed:[]),
    ...(Array.isArray(legacy)?legacy.filter(n=>Number.isInteger(n)&&n>=0&&n<4).map(n=>n+1):[])])]
    .filter(n=>Number.isInteger(n)&&n>=1&&n<=STAGES.length).sort((a,b)=>a-b);
  const best={};for(const [id,turns] of Object.entries(value.best||{}))if(Number.isInteger(+id)&&+id>=1&&+id<=STAGES.length&&Number.isInteger(turns)&&turns>0&&turns<10000)best[id]=turns;
  const owned=['stone',...(completed.length>=10?['jade']:[]),...(Array.isArray(value.owned)&&value.owned.includes('moonstone')?['moonstone']:[])];
  return {version:1,completed,best,owned,finish:owned.includes(value.finish)?value.finish:'stone'};
}
export const highestUnlocked = save => Math.min(STAGES.length,Math.max(1,...save.completed.map(n=>n+1)));
export function settleSave(save,stageId,turns) {
  const prior=save.best[stageId];
  return normalizeSave({...save,completed:[...save.completed,stageId],best:{...save.best,[stageId]:prior?Math.min(prior,turns):turns}});
}
