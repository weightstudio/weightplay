import {advanceKilnLanding,stepKilnWorld} from './beacon-kiln-adapter-candidate.mjs?v=20261028-kiln2';

// Narrow host-facing transaction proposals; no timers, DOM, storage or
// external effects are owned here. The same live boss object is retained so
// existing projectiles continue to reference their original target.
export function commitKilnLanding(world,boss,cue,dt){
  if(!world || !Array.isArray(world.enemies) || !world.enemies.includes(boss) ||
      !Array.isArray(world.hazards))throw new TypeError('INVALID_KILN_HOST');
  const result=advanceKilnLanding(boss,cue,world.hazards,dt);
  if(result.boss!==boss)Object.assign(boss,result.boss);
  world.hazards=result.hazards;
  return result.cue;
}
export function commitKilnPulse(world,input){
  if(!world || !Array.isArray(world.enemies) || !Array.isArray(world.hazards))throw new TypeError('INVALID_KILN_HOST');
  const result=stepKilnWorld(world.beaconRound,world,input);
  if(result.enemies!==world.enemies){
    const matches=world.enemies.filter(enemy=>enemy?.image==='bossCinderKilnPanther'&&enemy.isBoss&&enemy.hp>0&&enemy.shielded);
    const replacement=result.enemies.find(enemy=>enemy?.image==='bossCinderKilnPanther'&&enemy.isBoss&&enemy.hp>0);
    if(matches.length!==1 || !replacement)throw new Error('KILN_BOSS_CHANGED');
    Object.assign(matches[0],replacement);
  }
  world.beaconRound=result.round;
  return result.events;
}
