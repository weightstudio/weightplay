// Fixed, game-owned Stage content paths and identities. Shared Play UI owns presentation and gestures.
import {STAGES} from './data.mjs';

const POSTER='/assets/block-apex-poster.webp';

export function defaultUnlockedStage(unlocked,count){
  const highest=Number.isFinite(unlocked)?Math.floor(unlocked):1;
  return Math.max(1,Math.min(count,highest));
}

export const STAGE_CONFIG=Object.freeze({
  poster:POSTER,
  background:POSTER,
  entries:Object.freeze(STAGES.map(stage=>Object.freeze({
    id:stage.id,
    track:stage.track,
    reverse:stage.reverse,
    arc:stage.arc,
    mode:stage.mode,
    poster:POSTER,
    posterPosition:'center',
  }))),
});
