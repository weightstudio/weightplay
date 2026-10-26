// Stage data and complete-state rules; runtime supplies presentation, storage and rewards.
const PAIRS = Object.freeze({ I: [[0], [1], [2]], P: [[0], [0, 1], [2]], R: [[0, 1], [1, 2], [0, 2]] });

const base = (number, network, targets, extra = {}) => Object.freeze({
  number, network, targets: Object.freeze(targets), initialRoute: 2,
  allowedClips: Object.freeze([]), transferPair: null, lockedValve: null,
  minB: 0, sensors: Object.freeze([]), routeGateSensor: false,
  captureSlots: 0, captureBeds: Object.freeze([]), captureOrder: null,
  captureRequirement: null, captureExtraRequirement: null, captureValveRequirement: null,
  captureSensorGate: false, captureSensorAfterFirst: false, moveClipAfterCapture: false, lockAfterCapture: null,
  ...extra,
});
const clips = (...xs) => Object.freeze(xs);
const transfer = (a, b) => Object.freeze([a, b]);
const sensors = (...xs) => Object.freeze(xs.map(([bed, value, extra = {}]) => Object.freeze({bed, value, ...extra})));
const capture = (targets, beds, slots = 1, extra = {}) => ({
  captureSlots: slots, captureBeds: Object.freeze(beds), ...extra,
});
const req = (bed, value) => Object.freeze({bed, value});
const lowPipes = bed => clips(...({1:['1A','1B'],2:['2B','2C'],3:['3A','3C']}[bed]));
const oneBottle = (targets, beds, low, extra = {}) => ({
  ...capture(targets, beds), allowedClips: lowPipes(low), ...extra,
});
const moveBottle = (targets, bed, low, lock = null) => oneBottle(targets, [bed], low, {
  captureRequirement: req(low, targets[low - 1]), moveClipAfterCapture: true,
  lockAfterCapture: lock,
});

export const STAGES = Object.freeze([
  base(13,'R',[1,2,2],{allowedClips:clips('1A')}),
  base(14,'R',[1,4,2],{allowedClips:clips('1B','2B')}),
  base(15,'R',[1,3,5],{allowedClips:clips('1A','1B'),sensors:sensors([2,4,{clip:'1A'}])}),
  base(16,'T',[2,1,4]),
  base(17,'T',[2,5,1],{initialRoute:3}),
  base(18,'T',[2,0,4],{allowedClips:clips('2B'),minB:2}),
  base(19,'T',[2,1,4],{sensors:sensors([2,3]),routeGateSensor:true}),
  base(20,'T',[2,0,4],{allowedClips:clips('2B'),minB:2,sensors:sensors([2,3]),routeGateSensor:true}),
  base(21,'I',[1,1,2],{lockedValve:2,transferPair:transfer(1,2)}),
  base(22,'I',[1,2,1],{lockedValve:1,transferPair:transfer(0,1),sensors:sensors([1,4])}),
  base(23,'T',[2,1,4],{lockedValve:2,transferPair:transfer(1,2)}),
  base(24,'P',[2,1,3],{lockedValve:2,transferPair:transfer(0,2),allowedClips:clips('2A')}),
  base(25,'T',[2,0,4],{lockedValve:2,transferPair:transfer(1,2),allowedClips:clips('2B'),minB:2,sensors:sensors([2,3]),routeGateSensor:true}),
  base(26,'R',[1,1,2],{lockedValve:2,transferPair:transfer(1,2)}),
  base(27,'R',[3,2,3],{lockedValve:1,transferPair:transfer(2,1),sensors:sensors([1,4])}),
  base(28,'R',[1,2,4],{lockedValve:2,transferPair:transfer(1,2),allowedClips:clips('1A','2B')}),
  base(29,'R',[1,2,4],{lockedValve:2,transferPair:transfer(1,2),allowedClips:clips('1A','2B'),sensors:sensors([2,4])}),
  base(30,'T',[2,0,4],{lockedValve:2,transferPair:transfer(1,2),allowedClips:clips('2B'),minB:2,sensors:sensors([2,3],[3,5]),routeGateSensor:true}),
  base(31,'R',[9,1,1],capture([9,1,1],[1])),
  base(32,'R',[1,9,2],capture([1,9,2],[2],1,{captureRequirement:req(1,6)})),
  base(33,'R',[2,1,9],capture([2,1,9],[3],1,{sensors:sensors([1,5,{phase:'beforeCapture'}]),captureSensorGate:true})),
  base(34,'R',[10,2,1],capture([10,2,1],[1],1,{lockAfterCapture:2})),
  base(35,'R',[1,10,2],capture([1,10,2],[2],1,{captureRequirement:req(1,6),sensors:sensors([3,7,{phase:'beforeCapture'}],[1,4,{phase:'beforeCapture'}]),captureSensorGate:true})),
  base(36,'R',[9,9,1],capture([9,9,1],[1,2],2)),
  base(37,'R',[9,1,10],capture([9,1,10],[1,3],2,{sensors:sensors([2,5,{phase:'beforeCapture'}]),captureSensorGate:true})),
  base(38,'R',[1,9,11],capture([1,9,11],[2,3],2,{captureOrder:Object.freeze([2,3])})),
  base(39,'R',[10,11,2],capture([10,11,2],[1,2],2,{lockAfterCapture:1})),
  base(40,'R',[12,2,12],capture([12,2,12],[1,3],2,{captureOrder:Object.freeze([3,1]),sensors:sensors([2,7,{phase:'afterCapture'}]),captureSensorGate:true,captureSensorAfterFirst:true})),
  base(41,'R',[9,9,1],oneBottle([9,9,1],[1,2],3)),
  base(42,'R',[9,1,10],oneBottle([9,1,10],[1,3],2,{captureRequirement:req(3,6)})),
  base(43,'R',[1,10,10],oneBottle([1,10,10],[2,3],1,{lockAfterCapture:2})),
  base(44,'R',[10,11,2],oneBottle([10,11,2],[1,2],3,{captureRequirement:req(3,2)})),
  base(45,'R',[2,11,12],oneBottle([2,11,12],[2,3],1,{captureRequirement:req(1,2),captureValveRequirement:Object.freeze({valve:2,value:5})})),
  base(46,'R',[9,2,11],oneBottle([9,2,11],[1],2,{lockAfterCapture:2})),
  base(47,'R',[2,10,12],oneBottle([2,10,12],[3],1,{captureRequirement:req(2,8)})),
  base(48,'R',[11,9,1],oneBottle([11,9,1],[2],3,{sensors:sensors([1,6,{phase:'beforeCapture'}]),captureSensorGate:true})),
  base(49,'R',[1,12,10],oneBottle([1,12,10],[2],1,{captureRequirement:req(1,1)})),
  base(50,'R',[12,1,12],oneBottle([12,1,12],[3],2,{sensors:sensors([2,0,{phase:'afterCapture',noClip:true}])})),
  base(51,'R',[9,9,1],{...moveBottle([9,9,1],1,3),sensors:sensors([2,6,{phase:'afterCapture',clip:'3A'}])}),
  base(52,'R',[9,1,10],{...moveBottle([9,1,10],3,2),sensors:sensors([1,5,{phase:'beforeCapture',clip:'2B'}]),captureSensorGate:true}),
  base(53,'R',[1,10,10],moveBottle([1,10,10],2,1,2)),
  base(54,'R',[10,11,2],{...moveBottle([10,11,2],1,3),captureExtraRequirement:req(2,6)}),
  base(55,'R',[2,11,12],{...moveBottle([2,11,12],3,1),sensors:sensors([1,3,{phase:'beforeCapture',clip:'1B'}]),captureSensorGate:true}),
  base(56,'R',[9,12,1],moveBottle([9,12,1],1,3,1)),
  base(57,'R',[9,1,12],{...moveBottle([9,1,12],1,2,0),sensors:sensors([3,10,{phase:'beforeCapture'}]),captureSensorGate:true}),
  base(58,'R',[1,9,12],{...moveBottle([1,9,12],2,1,2),lockedValve:0,transferPair:transfer(0,1)}),
  base(59,'R',[10,12,1],{...moveBottle([10,12,1],1,3,1),sensors:sensors([3,3,{phase:'beforeCapture'}]),captureSensorGate:true}),
  base(60,'R',[12,12,1],{...moveBottle([12,12,1],1,3,1),sensors:sensors([2,10,{phase:'beforeCapture',noClip:true}]),captureSensorGate:true}),
]);

export function initialState(stage) {
  return { values:[0,0,0], route:stage.initialRoute, clip:null, sensor:0,
    captures:[null,null,null], capturedOrder:[], captureClip:null, lockedAfterCapture:false };
}
export function flow(stage, state) {
  const routes = stage.network === 'T' ? (state.route === 2 ? PAIRS.P : [[0], [1], [0,2]]) : PAIRS[stage.network];
  return routes.map((row, bed) => row.reduce((sum, valve) => sum +
    (state.clip === `${bed + 1}${'ABC'[valve]}` ? 0 : state.values[valve]), 0));
}
export function isGoal(stage, state) {
  const actual = flow(stage, state);
  if (state.sensor !== stage.sensors.length || state.values[1] < stage.minB ||
      state.capturedOrder.length !== stage.captureSlots) return false;
  if (stage.moveClipAfterCapture && (!state.captureClip || !state.clip || state.clip === state.captureClip)) return false;
  return stage.targets.every((target, i) => (state.captures[i] ?? actual[i]) === target);
}
const clone = s => ({...s, values:[...s.values], captures:[...s.captures], capturedOrder:[...s.capturedOrder]});
export function applyAction(stage, state, action) {
  if (!action || typeof action !== 'object') return null;
  const next = clone(state), values = next.values;
  const postLock = state.lockedAfterCapture ? stage.lockAfterCapture : null;
  if (action.type === 'valve') {
    const {index, delta} = action;
    if (!Number.isInteger(index) || index < 0 || index > 2 || ![-1,1].includes(delta) ||
        index === stage.lockedValve || index === postLock || values[index] + delta < 0 || values[index] + delta > 6) return null;
    values[index] += delta;
  } else if (action.type === 'route') {
    if (stage.network !== 'T' || ![2,3].includes(action.value) || action.value === state.route ||
        (action.value === 3 && stage.routeGateSensor && state.sensor < 1)) return null;
    next.route = action.value;
  } else if (action.type === 'clip') {
    if (!(action.value === null || stage.allowedClips.includes(action.value)) || action.value === state.clip || !stage.allowedClips.length) return null;
    next.clip = action.value;
  } else if (action.type === 'transfer') {
    const {from, to} = action, pair = stage.transferPair;
    if (!pair || !pair.includes(from) || !pair.includes(to) || from === to ||
        from === postLock || to === postLock || values[from] === 0 || values[to] === 6) return null;
    values[from]--; values[to]++;
  } else if (action.type === 'capture') {
    const bed = action.bed, i = bed - 1;
    if (!Number.isInteger(bed) || !stage.captureBeds.includes(bed) || state.captures[i] !== null ||
        state.capturedOrder.length >= stage.captureSlots ||
        (stage.captureSensorGate && (!stage.captureSensorAfterFirst || state.capturedOrder.length > 0) && state.sensor < stage.sensors.length) ||
        (stage.captureOrder && stage.captureOrder[state.capturedOrder.length] !== bed)) return null;
    const current = flow(stage, state);
    if (stage.captureRequirement && current[stage.captureRequirement.bed - 1] !== stage.captureRequirement.value) return null;
    if (stage.captureExtraRequirement && current[stage.captureExtraRequirement.bed - 1] !== stage.captureExtraRequirement.value) return null;
    if (stage.captureValveRequirement && values[stage.captureValveRequirement.valve] !== stage.captureValveRequirement.value) return null;
    if (stage.moveClipAfterCapture && !state.clip) return null;
    next.captures[i] = current[i]; next.capturedOrder.push(bed);
    if (stage.moveClipAfterCapture) next.captureClip = state.clip;
    if (stage.lockAfterCapture !== null) next.lockedAfterCapture = true;
  } else return null;
  // At most one sensor can latch per accepted action, even if several match.
  const upcoming = stage.sensors[state.sensor];
  const sensorPhaseAllowed = upcoming &&
    (upcoming.phase !== 'beforeCapture' || (state.capturedOrder.length === 0 && next.capturedOrder.length === 0)) &&
    (upcoming.phase !== 'afterCapture' || state.capturedOrder.length > 0) &&
    (!upcoming.clip || next.clip === upcoming.clip) && (!upcoming.noClip || next.clip === null);
  if (sensorPhaseAllowed && flow(stage, next)[upcoming.bed - 1] === upcoming.value) next.sensor++;
  return next;
}
export function actions(stage, state) {
  const result = [];
  for (let index = 0; index < 3; index++) for (const delta of [-1,1]) result.push({type:'valve',index,delta});
  if (stage.network === 'T') result.push({type:'route',value:state.route === 2 ? 3 : 2});
  if (stage.allowedClips.length) for (const value of [null,...stage.allowedClips]) result.push({type:'clip',value});
  if (stage.transferPair) {
    const [a,b] = stage.transferPair; result.push({type:'transfer',from:a,to:b},{type:'transfer',from:b,to:a});
  }
  for (const bed of stage.captureBeds) result.push({type:'capture',bed});
  return result.filter(action => applyAction(stage,state,action) !== null);
}
const key = s => `${s.values.join(',')}/${s.route}/${s.clip || '-'}/${s.sensor}/${s.captures.map(x => x === null ? '-' : x).join(',')}/${s.capturedOrder.join(',')}/${s.captureClip || '-'}/${+s.lockedAfterCapture}`;
export function solve(stage, state = initialState(stage), options = {}) {
  const disabled = new Set(options.disable || []), initial = clone(state);
  const queue = [{state:initial, parent:-1, action:null}], visited = new Set([key(initial)]);
  for (let head = 0; head < queue.length; head++) {
    const item = queue[head];
    if (isGoal(stage,item.state)) {
      const path = []; for (let i = head; queue[i].parent !== -1; i = queue[i].parent) path.push(queue[i].action);
      path.reverse(); return {distance:path.length,path};
    }
    for (const action of actions(stage,item.state)) {
      if (disabled.has(action.type)) continue;
      const next = applyAction(stage,item.state,action), id = key(next);
      if (!visited.has(id)) {visited.add(id); queue.push({state:next,parent:head,action});}
    }
  }
  return null;
}
// The UI must localize these outcomes; no player-facing English fallback lives here.
export function hint(stage, state) {
  const solution = solve(stage, state);
  if (!solution) return {status:'unreachable', action:null};
  if (!solution.path.length) return {status:'ready', action:null};
  return {status:'step', action:solution.path[0]};
}
export function initialAttempt(stage) { return {state:initialState(stage), history:[], moves:0}; }
export function performAttempt(stage, attempt, action) {
  if (action?.type === 'undo') {
    if (!attempt.history.length) return null;
    return {state:clone(attempt.history.at(-1)),history:attempt.history.slice(0,-1),moves:attempt.moves+1};
  }
  if (action?.type === 'reset') return initialAttempt(stage);
  const state = applyAction(stage,attempt.state,action);
  if (!state) return null;
  return {state,history:[...attempt.history,clone(attempt.state)],moves:attempt.moves+1};
}
