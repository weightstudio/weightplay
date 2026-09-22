/** Shared sample adapter. No private context, volume, mute state or oscillator. */
const SHOT_CUES=Object.freeze({fox:'weapon.bow.release',bear:'weapon.gun.fire',owl:'magic.cast',rabbit:'magic.cast',wolf:'projectile.launch',raccoon:'projectile.launch',deer:'projectile.launch',cat:'projectile.launch'});
const HIT_CUES=Object.freeze({fox:'weapon.arrow.hit',bear:'explosion.small',owl:'magic.ice',rabbit:'magic.hit',wolf:'combat.strike',raccoon:'impact.glass',deer:'impact.soft',cat:'impact.soft'});
const CUES=Object.freeze({click:'ui.click',start:'game.start',success:'feedback.success',wrong:'feedback.error',win:'result.win',lose:'result.lose',shoot:'projectile.launch',hit:'combat.strike',wallHit:'player.hurt',boss:'alert.boss',enemyDown:'enemy.defeat',coin:'reward.coin',upgrade:'reward.upgrade'});
const throttle=new Map();
export function cue(name,minInterval=0){
 const audio=window.WeightPlayAudio;
 const id=CUES[name]||(audio?.describe(name)?name:null);
 if(!id)return null;
 const now=performance.now();if(now-(throttle.get(id)??-Infinity)<minInterval)return null;
 throttle.set(id,now);
 return audio?.play(id)||null;
}
export function combatAudio(event){
 if(event.type==='shot')cue(SHOT_CUES[event.troop]||'projectile.launch',130);
 else if(event.type==='impact'&&event.targets?.length)cue(HIT_CUES[event.troop]||'impact.soft',90);
 else if(event.type==='leak')cue('player.hurt',160);
 else if(event.type==='bossWarning')cue('alert.boss',500);
 else if(event.type==='kill'&&event.boss)cue('enemy.defeat',250);
 else if(event.type==='income')cue('reward.coin',250);
 else if(event.type==='theft')cue('alert.warning',500);
 else if(event.type==='merge')cue('puzzle.merge',100);
 else if(event.type==='upgrade')cue('reward.upgrade',100);
 else if(event.type==='summon'||event.type==='spell')cue('magic.cast',100);
}
export function resetAudio(){throttle.clear();window.WeightPlayAudio?.stopAll({combatOnly:true});}
