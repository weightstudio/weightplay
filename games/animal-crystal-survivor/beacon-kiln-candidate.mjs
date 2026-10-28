// Stage 50 isolated proposal. The host must perform real movement, collision,
// damage and atomic pulse/heat commits; this module never touches save data.
const finitePoint = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
// Preserve an unambiguous gap from the two 95-unit station interaction areas.
// The telegraph shows the selected landing, not the player's exact position.
// Keep the boss inside both the player's arena and the host's castable area.
const defaultLayout=Object.freeze({bounds:{left:42,right:982,top:42,bottom:1718},stations:[{x:512,y:1180},{x:768,y:560}]});
export function selectKilnLanding(target,layout=defaultLayout){
  const b=layout?.bounds,stations=layout?.stations;
  if(!finitePoint(target)||!b||![b.left,b.right,b.top,b.bottom].every(Number.isFinite)||b.left>b.right||b.top>b.bottom||!Array.isArray(stations)||!stations.every(finitePoint))throw new TypeError('INVALID_KILN_LAYOUT');
  const offsets=[[0,0],[200,0],[-200,0],[0,200],[0,-200],[200,200],[-200,200],[200,-200],[-200,-200]];
  const choices=offsets.map(([dx,dy])=>({x:Math.max(b.left,Math.min(b.right,target.x+dx)),y:Math.max(b.top,Math.min(b.bottom,target.y+dy))}))
    .filter(point=>stations.every(station=>Math.hypot(point.x-station.x,point.y-station.y)>=64+95+25));
  choices.sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y));
  return choices[0]||null;
}

export function makeKilnLanding(id, boss, target, layout) {
  if (typeof id !== 'string' || !id || !finitePoint(boss) || !finitePoint(target))
    throw new TypeError('INVALID_KILN_LANDING');
  const choice=selectKilnLanding(target,layout);
  return choice?{ id, phase:'warning', remaining:2, ...choice, radius:64 }:null;
}

export function stepKilnLanding(cue, dt) {
  if (cue?.phase !== 'warning' || !finitePoint(cue) ||
      !Number.isFinite(cue.remaining) || cue.remaining < 0 ||
      !Number.isFinite(cue.radius) || cue.radius <= 0 ||
      !Number.isFinite(dt) || dt < 0 || dt > .25)
    throw new RangeError('INVALID_KILN_STEP');
  const remaining = Math.max(0,cue.remaining-dt);
  if (remaining > 1e-9) return {cue:{...cue,remaining},landing:null};
  return {cue:{...cue,remaining:0,phase:'landed'},
    landing:{id:cue.id,x:cue.x,y:cue.y,radius:cue.radius,life:8}};
}

export function applyKilnPulse(boss, before, after, events, landing) {
  if (!boss?.isBoss || boss.image !== 'bossCinderKilnPanther' ||
      !Number.isFinite(boss.hp) || boss.hp <= 0 || !boss.shielded ||
      !landing || typeof landing.id !== 'string' || !landing.id ||
      boss.lastKilnLandingId === landing.id || !finitePoint(landing) || !Number.isFinite(landing.life) ||
      landing.life <= 0 || !Array.isArray(events) || !events.includes('beacon-pulsed'))
    throw new Error('KILN_PULSE_UNAVAILABLE');
  const expected = before?.completed === 0 ? 'C' : before?.completed === 1 ? 'B' : null;
  if (!expected || before.stage !== 50 || after?.stage !== 50 ||
      after.completed !== before.completed+1 || after.pulses !== before.pulses+1 ||
      after.lastPulse !== expected) throw new Error('KILN_PULSE_MISMATCH');
  return {...boss, shielded:after.completed < 2, lastKilnLandingId:landing.id};
}

export function kilnObjective(round, bossDefeated) {
  return round?.stage === 50 && round.completed === 2 && bossDefeated === true;
}
