(function(){
"use strict";
  const stoneCatalog = {
    base: { key: "stoneBase", mark: "◒", group: "earth", weight: 1 },
    middle: { key: "stoneMiddle", mark: "◓", group: "stone", weight: 2 },
    cap: { key: "stoneCap", mark: "✦", group: "summit", weight: 3 },
    anchor: { key: "stoneAnchor", mark: "⬟", group: "earth", weight: 2 },
    bridge: { key: "stoneBridge", mark: "◇", group: "wind", weight: 1 },
    marker: { key: "stoneMarker", mark: "✧", group: "wind", weight: 1 }
  };
  const before = (...pairs) => ({ mustBefore: pairs });
  const stage = (id, title, arc, mechanic, stones, solution, rules = {}) => ({ id, title, arc, mechanic, stones, solution, titleKey: `stageTitle${id}`, arcKey: `arc${Math.ceil(id / 5)}`, checkpoint: id % 5 === 0, checkpointKey: id % 5 === 0 ? `checkpointRule${id}` : "", ...rules });
  const STAGES = [
    stage(1, "Base Camp", "Base and Cap", "support-order", ["base", "middle", "cap"], ["base", "middle", "cap"], { ...before(["base", "middle"], ["middle", "cap"]) }),
    stage(2, "Anchor Point", "Base and Cap", "support-order", ["base", "anchor", "cap"], ["base", "anchor", "cap"], { ...before(["base", "anchor"], ["anchor", "cap"]) }),
    stage(3, "Wind Shelf", "Base and Cap", "support-order", ["base", "bridge", "middle", "cap"], ["base", "bridge", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "middle"], ["middle", "cap"]) }),
    stage(4, "Courier’s Mark", "Base and Cap", "support-order", ["base", "marker", "anchor", "cap"], ["base", "marker", "anchor", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "cap"]) }),
    stage(5, "Ridge Checkpoint", "Base and Cap", "support-order", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "middle"], ["middle", "cap"]), checkpointRule: "base, bridge, anchor, then the cap route" }),

    stage(6, "Twin Supports", "Paired Supports", "paired-support", ["base", "middle", "anchor", "bridge", "cap"], ["base", "middle", "anchor", "bridge", "cap"], { pairs: [["base", "middle"], ["anchor", "bridge"]] }),
    stage(7, "Split Supports", "Paired Supports", "paired-support", ["base", "anchor", "middle", "bridge", "cap"], ["base", "anchor", "middle", "bridge", "cap"], { pairs: [["base", "anchor"], ["middle", "bridge"]] }),
    stage(8, "Cross Brace", "Paired Supports", "paired-support", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { pairs: [["base", "bridge"], ["anchor", "middle"]] }),
    stage(9, "Two Safe Shelves", "Paired Supports", "paired-support", ["base", "middle", "bridge", "anchor", "cap"], ["base", "middle", "bridge", "anchor", "cap"], { pairs: [["base", "middle"], ["bridge", "anchor"]] }),
    stage(10, "Beaver’s Pair Check", "Paired Supports", "paired-support", ["base", "anchor", "bridge", "marker", "middle", "cap"], ["base", "anchor", "bridge", "marker", "middle", "cap"], { pairs: [["base", "anchor"], ["bridge", "marker"]], checkpointRule: "both marked pairs must stay together" }),

    stage(11, "First Gust", "Wind and Material", "wind-shift", ["base", "bridge", "anchor", "marker", "cap"], ["base", "bridge", "anchor", "marker", "cap"], { noAdjacentGroup: true }),
    stage(12, "Cool Ridge", "Wind and Material", "wind-shift", ["base", "middle", "bridge", "anchor", "cap"], ["base", "middle", "bridge", "anchor", "cap"], { noAdjacentGroup: true }),
    stage(13, "Crosswind", "Wind and Material", "wind-shift", ["base", "bridge", "middle", "marker", "cap"], ["base", "bridge", "middle", "marker", "cap"], { noAdjacentGroup: true }),
    stage(14, "Quiet Shelf", "Wind and Material", "wind-shift", ["base", "anchor", "bridge", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { noAdjacentGroup: true }),
    stage(15, "Heron’s Wind Check", "Wind and Material", "wind-shift", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { noAdjacentGroup: true, checkpointRule: "no two neighbouring stones share a material" }),

    stage(16, "Light Center", "Weight Windows", "weight-balance", ["base", "middle", "bridge", "cap"], ["base", "middle", "bridge", "cap"], { targetWeight: 3, maxPrefix: 3 }),
    stage(17, "Heavy Center", "Weight Windows", "weight-balance", ["base", "anchor", "middle", "cap"], ["base", "anchor", "middle", "cap"], { targetWeight: 4, maxPrefix: 4 }),
    stage(18, "Balanced Shelf", "Weight Windows", "weight-balance", ["base", "bridge", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "middle", "cap"], { targetWeight: 5, maxPrefix: 5 }),
    stage(19, "Counterweight", "Weight Windows", "weight-balance", ["base", "middle", "anchor", "bridge", "cap"], ["base", "middle", "anchor", "bridge", "cap"], { targetWeight: 5, maxPrefix: 5 }),
    stage(20, "Turtle’s Balance", "Weight Windows", "weight-balance", ["base", "bridge", "anchor", "middle", "marker", "cap"], ["base", "bridge", "anchor", "middle", "marker", "cap"], { targetWeight: 6, maxPrefix: 6, checkpointRule: "the center stays under the ridge limit" }),

    stage(21, "Relay Start", "Courier Relay", "relay", ["base", "marker", "bridge", "middle", "cap"], ["base", "marker", "bridge", "middle", "cap"], { ...before(["base", "marker"], ["marker", "bridge"], ["bridge", "middle"], ["middle", "cap"]) }),
    stage(22, "Relay Fork", "Courier Relay", "relay", ["base", "anchor", "marker", "bridge", "cap"], ["base", "anchor", "marker", "bridge", "cap"], { ...before(["base", "anchor"], ["anchor", "marker"], ["marker", "bridge"], ["bridge", "cap"]) }),
    stage(23, "Long Relay", "Courier Relay", "relay", ["base", "marker", "anchor", "middle", "bridge", "cap"], ["base", "marker", "anchor", "middle", "bridge", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "middle"], ["middle", "bridge"], ["bridge", "cap"]) }),
    stage(24, "Repair Relay", "Courier Relay", "relay", ["base", "bridge", "marker", "anchor", "middle", "cap"], ["base", "bridge", "marker", "anchor", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "marker"], ["marker", "anchor"], ["anchor", "middle"], ["middle", "cap"]) }),
    stage(25, "Otter’s Relay Check", "Courier Relay", "relay", ["base", "marker", "bridge", "anchor", "middle", "cap"], ["base", "marker", "bridge", "anchor", "middle", "cap"], { ...before(["base", "marker"], ["marker", "bridge"], ["bridge", "anchor"], ["anchor", "middle"], ["middle", "cap"]), checkpointRule: "the courier marker must pass every relay" }),

    stage(26, "Summit Plan", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(27, "Summit Detour", "Summit Contracts", "checkpoint-contract", ["base", "anchor", "bridge", "middle", "marker", "cap"], ["base", "bridge", "anchor", "middle", "marker", "cap"], { ...before(["base", "anchor"], ["bridge", "middle"], ["middle", "marker"], ["marker", "cap"]), noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(28, "Final Bridge", "Summit Contracts", "checkpoint-contract", ["base", "marker", "bridge", "anchor", "middle", "cap"], ["base", "marker", "anchor", "bridge", "middle", "cap"], { ...before(["base", "marker"], ["marker", "anchor"], ["anchor", "bridge"], ["bridge", "middle"], ["middle", "cap"]), pairs: [["marker", "anchor"]], targetWeight: 6, maxPrefix: 6 }),
    stage(29, "Lantern Ridge", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "marker", "anchor", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), pairs: [["bridge", "anchor"]], noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6 }),
    stage(30, "Riverkeeper’s Cairn", "Summit Contracts", "checkpoint-contract", ["base", "bridge", "anchor", "marker", "middle", "cap"], ["base", "bridge", "anchor", "marker", "middle", "cap"], { ...before(["base", "bridge"], ["bridge", "anchor"], ["anchor", "marker"], ["marker", "middle"], ["middle", "cap"]), pairs: [["bridge", "anchor"]], noAdjacentGroup: true, targetWeight: 6, maxPrefix: 6, checkpointRule: "all support, relay, material and weight checks must hold" })
  ];


// Replace the old invariant total-weight check with actual height-weighted load.
// A heavier stone higher in the cairn increases the load. All limits are public.
STAGES[16] = stage(17, 'Heavy Center', 'Weight Windows', 'weight-balance',
  ['base','anchor','middle','bridge','cap'], ['base','anchor','middle','bridge','cap']);
STAGES[18] = stage(19, 'Counterweight', 'Weight Windows', 'weight-balance',
  ['base','middle','anchor','bridge','marker','cap'], ['base','middle','anchor','bridge','marker','cap'],
  {mustBefore:[['bridge','marker']]});
STAGES[17].solution = ['base','anchor','bridge','middle','cap'];
const load = (stack) => stack.filter(id => id !== 'base' && id !== 'cap')
  .reduce((sum,id,index) => sum + stoneCatalog[id].weight * (index+1),0);
STAGES.forEach(plan => {
  if (plan.mechanic === 'weight-balance' || plan.targetWeight !== undefined) {
    plan.loadLimit = load(plan.solution);
    delete plan.targetWeight; delete plan.maxPrefix;
  }
});
const contract = (plan,stack) => {
  const position = id => stack.indexOf(id);
  const row = (kind,ids,status,value) => ({kind,ids,status,value});
  const rows = [row('ends',['base','cap'],stack.length === 0 ? 'pending' :
    stack[0] !== 'base' || (stack.includes('cap') && position('cap') !== plan.stones.length-1) ? 'bad' :
    stack.length === plan.stones.length ? 'good' : 'pending')];
  for (const [a,b] of plan.mustBefore || []) rows.push(row('before',[a,b],
    position(b)>=0 ? position(a)>=0 && position(a)<position(b) ? 'good':'bad':'pending'));
  for (const [a,b] of plan.pairs || []) rows.push(row('pair',[a,b],
    position(a)>=0 && position(b)>=0 ? Math.abs(position(a)-position(b))===1?'good':'bad':'pending'));
  if(plan.noAdjacentGroup) rows.push(row('alternate',[],
    stack.some((id,i)=>i>0 && stoneCatalog[id].group===stoneCatalog[stack[i-1]].group) ? 'bad' :
    stack.length===plan.stones.length?'good':'pending'));
  if(plan.loadLimit!==undefined) rows.push(row('load',[],load(stack)>plan.loadLimit?'bad':
    stack.length===plan.stones.length?'good':'pending',plan.loadLimit));
  return rows;
};
const validate = (plan,stack) => Array.isArray(stack) && stack.length === plan.stones.length &&
  new Set(stack).size === stack.length && stack.every(id=>plan.stones.includes(id)) &&
  contract(plan,stack).every(rule=>rule.status==='good');
const tray = plan => [...plan.stones].sort((a,b)=>{
  const rank=id=>[...id].reduce((s,c)=>(s*31+c.charCodeAt(0))>>>0,plan.id*1973)%997;
  return rank(a)-rank(b);
});
const normalize = raw => {
  const solved=[...new Set((Array.isArray(raw?.solved)?raw.solved:[])
    .filter(id=>Number.isInteger(id)&&id>=1&&id<=STAGES.length))];
  const numbers=(values,max)=>Object.fromEntries(Object.entries(values||{}).filter(([key,n])=>
    solved.includes(Number(key))&&Number.isInteger(n)&&n>0&&n<=max));
  const finishes=[...new Set(['moss',...(Array.isArray(raw?.finishes)?raw.finishes:[])
    .filter(x=>x==='aurora'||x==='alpine'),...(solved.length>=10?['alpine']:[])])];
  return {...raw,solved,best:numbers(raw?.best,100000),seals:numbers(raw?.seals,3),finishes,
    finish:finishes.includes(raw?.finish)?raw.finish:'moss'};
};
window.CairnModel = {stoneCatalog, STAGES, load, contract, validate, tray, normalize};
})();
