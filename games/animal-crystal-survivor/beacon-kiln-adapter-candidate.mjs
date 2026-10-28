import {stepBeaconRound} from './beacon-circuit-candidate.mjs?v=20261028-kiln1';
import {applyKilnPulse,stepKilnLanding} from './beacon-kiln-candidate.mjs?v=20261028-kiln1';

// One live landing circle at a time; the host must preserve boss identity and
// commit the returned boss, cue and hazards together after each tick.
export function advanceKilnLanding(boss,cue,hazards,dt) {
  if(!boss?.isBoss || boss.image!=='bossCinderKilnPanther' ||
      !Number.isFinite(boss.hp) || boss.hp<=0 || !Array.isArray(hazards))
    throw new TypeError('INVALID_KILN_LANDING_WORLD');
  const stepped=stepKilnLanding(cue,dt);
  if(!stepped.landing)return {boss,cue:stepped.cue,hazards};
  const land=stepped.landing;
  const heat={kind:'circle',id:land.id,x:land.x,y:land.y,r:land.radius,
    warn:0,life:land.life,damage:8,tick:0,color:'#ec7734',beaconKilnHeat:true};
  return {boss:{...boss,x:land.x,y:land.y},cue:null,
    hazards:[...hazards.filter(h=>!h?.beaconKilnHeat),heat]};
}

// Isolated transaction: the host must commit round and the returned boss
// together and preserve the live boss identity used by projectiles.
export function stepKilnWorld(round, {enemies,hazards}, input={}) {
  if(round?.stage!==50 || !Array.isArray(enemies) || !Array.isArray(hazards))
    throw new TypeError('INVALID_KILN_WORLD');
  const bosses=enemies.filter(e=>e?.image==='bossCinderKilnPanther'&&e.isBoss&&e.hp>0&&e.shielded);
  const heats=hazards.filter(h=>h?.beaconKilnHeat&&typeof h.id==='string'&&h.id&&
    Number.isFinite(h.x)&&Number.isFinite(h.y)&&Number.isFinite(h.life)&&h.life>0&&
    Number.isFinite(h.warn)&&h.warn<=0&&h.id!==bosses[0]?.lastKilnLandingId);
  const available=bosses.length===1&&heats.length===1;
  const stepped=stepBeaconRound(round,{...input,nearBeacon:available?input.nearBeacon:null});
  if(!stepped.events.includes('beacon-pulsed'))return {round:stepped.state,enemies,events:stepped.events};
  const applied=applyKilnPulse(bosses[0],round,stepped.state,stepped.events,heats[0]);
  return {round:stepped.state,enemies:enemies.map(e=>e===bosses[0]?applied:e),events:stepped.events};
}
