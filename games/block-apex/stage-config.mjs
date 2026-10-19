// Fixed, game-owned Stage content paths and identities. Shared Play UI owns presentation and gestures.
import {STAGES} from './data.mjs';

const POSTER='/assets/block-apex-poster.webp';

export const STAGE_CONFIG=Object.freeze({
  poster:POSTER,
  background:'/assets/lobby-block-atmosphere.svg',
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
