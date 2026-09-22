/** Game-event adapter for the existing shared audio service. No second context,
 * mute flag, stored volume, floating control, or private preferences panel. */
const SHOT_CUES={fox:'shoot',bear:'hit',owl:'shoot',rabbit:'shoot',wolf:'hit',raccoon:'shoot',deer:'shoot',cat:'shoot'};
const throttle=new Map();
export function cue(name,minInterval=0){
 const now=performance.now();if(now-(throttle.get(name)??-Infinity)<minInterval)return;
 throttle.set(name,now);
 try{window.WonderSound?.play?.(name);}catch{/* Audio is optional and never stops input or simulation. */}
}
export function combatAudio(event){
 if(event.type==='shot')cue(SHOT_CUES[event.troop]||'shoot',130);
 else if(event.type==='leak')cue('wallHit',160);
 else if(event.type==='bossWarning')cue('boss',500);
 else if(event.type==='kill'&&event.boss)cue('enemyDown',250);
 else if(event.type==='income'||event.type==='theft')cue('coin',250);
 else if(event.type==='merge'||event.type==='upgrade')cue('upgrade',100);
 else if(event.type==='summon'||event.type==='spell')cue('success',100);
}
export function resetAudio(){throttle.clear();}
