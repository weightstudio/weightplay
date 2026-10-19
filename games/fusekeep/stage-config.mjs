import {BOSSES,STAGES} from './data.mjs';
import {COPY} from './copy.mjs';
import {DICT} from './locales.mjs';
import {clearCount,rewardType} from './progression.mjs';

const POSTER='/games/fusekeep/assets/poster.webp';

/** Fusekeep supplies mission facts and save state; shared Play UI owns cards and gestures. */
export function createFusekeepStageConfig({locale,save,text,formatTime,troopName}){
 const copy=COPY[locale]||COPY.en,dict=DICT[locale]||DICT.en;
 return {
  gameId:'fusekeep',
  count:STAGES.length,
  poster:POSTER,
  background:'/assets/lobby-block-atmosphere.svg',
  stage(index){
   const stage=STAGES[index];
   if(!stage)throw new RangeError(`FUSEKEEP_STAGE_INDEX:${index}`);
   const state=save(),locked=stage.id>state.unlocked,stars=Number(state.stars[index]||0);
   const boss=stage.boss?dict.bosses[BOSSES.indexOf(stage.boss)]:'';
   const rule=stage.boss?text('bossRule'):copy.patterns[stage.pattern];
   const best=Number(state.best[index]||0);
   const reward=text('reward',{name:troopName(rewardType(stage.id)),n:clearCount(state.collection,stage.id)?4:8});
   return {
    id:stage.id,
    kicker:text('level',{n:stage.id}),
    title:copy.missions[index],
    subtitle:boss||copy.patterns[stage.pattern],
    status:locked?text('locked'):stars?`${text('stars')} ${stars}/3`:best?`${text('best')} ${formatTime(best)}`:'',
    summary:boss?`${boss} · ${rule}`:rule,
    details:[rule,reward,best?`${text('best')} ${formatTime(best)}`:''].filter(Boolean),
    locked,
    cleared:stars>0,
    posterPosition:'50% 50%',
   };
  },
 };
}
