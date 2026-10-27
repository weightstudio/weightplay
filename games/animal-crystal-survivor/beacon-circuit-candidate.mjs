// Unconnected chapter-two design model. The public game does not import this
// file: actual movement, combat, persistence and rewards remain authoritative.
const A = Object.freeze({ id: 'A', x: 256, y: 560 });
const B = Object.freeze({ id: 'B', x: 768, y: 560 });
const C = Object.freeze({ id: 'C', x: 512, y: 1180 });
const rows = [
  [31,'survival',['A'],'basic','none',null],
  [32,'survival',['B'],'runner','runner-line',null],
  [33,'survival',['A'],'basic','paired-lanes',null],
  [34,'survival',['C'],'basic','root-circle',null],
  [35,'boss',['A'],'basic','root-sweep','root-lantern-warden'],
  [36,'waves',['B'],'runner','prism-lanes',null],
  [37,'waves',['A','B'],'runner','none',null],
  [38,'survival',['C'],'runner','alternating-mirror',null],
  [39,'waves',['B','A'],'shielded','carrier-shield',null],
  [40,'boss',['A','B'],'shielded','facet-lanes','prism-ferryman'],
  [41,'waves',['A','B'],'basic','ordered-circuit',null],
  [42,'survival',['B'],'runner','committed-charge',null],
  [43,'waves',['C','A'],'armored','junction-charge',null],
  [44,'waves',['B','C'],'shielded','lit-order',null],
  [45,'boss',['A','C'],'armored','briar-charge','briar-circuit-ram'],
  [46,'survival',['C'],'runner','hot-lane',null],
  [47,'waves',['A'],'runner','heat-detour',null],
  [48,'waves',['B','C'],'basic','ordered-reveal',null],
  [49,'survival',['A'],'shielded','shelter-or-shield',null],
  [50,'boss',['C','B'],'runner','landing-heat','cinder-kiln-panther'],
  [51,'waves',['B'],'interceptor','fixed-intercept',null],
  [52,'waves',['A'],'interceptor','alternating-corridors',null],
  [53,'waves',['C'],'shielded-interceptor','shield-or-station',null],
  [54,'waves',['A','B'],'interceptor','lightning-lanes',null],
  [55,'boss',['B','A'],'interceptor','crosswind','tempest-relay-roc'],
  [56,'survival',['C'],'runner','moving-safe-ring',null],
  [57,'waves',['A'],'interceptor','replacement-carrier',null],
  [58,'waves',['A','B','C'],'armored','root-heat-rotation',null],
  [59,'waves',['B','C'],'shielded-interceptor','shield-or-circuit',null],
  [60,'boss',['A','B','C'],'interceptor','root-heat-storm','eclipse-beacon-architect'],
];
const points = {A, B, C};
export const beaconCircuitStages = Object.freeze(rows.map(([stage,mode,order,carrier,hazard,boss]) => Object.freeze({
  stage, mode, order: Object.freeze([...order]), carrier, hazard, boss,
  beacons: Object.freeze((stage === 33 ? ['A','B'] : order).map(id => points[id])),
  lamp: Object.freeze({capacity:1, lifetime:18, dwell:1.2, radius:95}),
})));

export function makeBeaconRound(stage) {
  const plan = beaconCircuitStages.find(item => item.stage === stage);
  if (!plan) throw new RangeError('Unknown beacon stage');
  return {stage, charge:0, dwell:0, completed:0, pulses:0, lastPulse:null};
}

// `nearBeacon` is a station id computed from authoritative world position;
// events are returned to a future caller and never save, reward, or damage.
export function stepBeaconRound(previous, {dt=0, pickup=false, damaged=false, nearBeacon=null}={}) {
  const plan = beaconCircuitStages.find(item => item.stage === previous.stage);
  if (!plan || !Number.isFinite(dt) || dt < 0 || dt > .25) throw new RangeError('Invalid beacon step');
  const next = {...previous}, events = [];
  if (damaged && next.charge > 0) { next.charge=0; next.dwell=0; events.push('charge-lost'); }
  if (next.charge > 0) {
    next.charge=Math.max(0,next.charge-dt);
    if (!next.charge) { next.dwell=0; events.push('charge-expired'); }
  }
  if (pickup && !damaged && !next.charge && next.completed < plan.order.length) {
    next.charge=plan.lamp.lifetime; events.push('charge-picked-up');
  }
  const target=plan.order[next.completed];
  const matches=plan.stage===33&&next.completed===0 ? ['A','B'].includes(nearBeacon) : nearBeacon===target;
  if (next.charge && matches) {
    next.dwell+=dt;
    if (next.dwell + 1e-9 >= plan.lamp.dwell) {
      next.charge=0; next.dwell=0; next.completed++; next.pulses++; next.lastPulse=nearBeacon;
      events.push('beacon-pulsed');
    }
  } else next.dwell=0;
  return {state:next, events};
}
