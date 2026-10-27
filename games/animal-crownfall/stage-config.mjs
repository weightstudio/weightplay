import {LEVELS} from './levels.mjs';
import {newState} from './core.mjs?v=20261028-latch1';
import {NAMES} from './stage-copy.mjs';
import {battleObjective} from './objective-copy.mjs';
import {text} from './locales.mjs';
import {LATCH_COPY} from './latch-copy.mjs';

const POSTER='/assets/lobby-thumbs/w480/assets__animal-crownfall__cover.webp';

export function createCrownfallStageConfig({getLocale,getSave,isPractice}) {
  if(typeof getLocale!=='function'||typeof getSave!=='function'||typeof isPractice!=='function') {
    throw new TypeError('CROWNFALL_STAGE_CONFIG_REQUIRED');
  }
  return Object.freeze({
    gameId:'animal-crownfall',
    get count(){return LEVELS.length},
    poster:POSTER,
    background:POSTER,
    stage(index) {
      const level=LEVELS[index];
      if(!level)throw new RangeError(`CROWNFALL_STAGE_INDEX:${index}`);
      const locale=getLocale(),save=getSave(),practice=isPractice();
      const badges=save.badges[level.id]||[false,false,false];
      const locked=!practice&&level.id>save.unlocked;
      const objective=battleObjective(locale,newState(level));
      return {
        id:level.id,
        kicker:`${text(locale,'stage')} ${level.id}`,
        title:level.latches?(LATCH_COPY[locale]||LATCH_COPY.en)[0]:(NAMES[locale]||NAMES.en)[level.id-1]||`${text(locale,'stage')} ${level.id}`,
        subtitle:text(locale,level.id%5===0?'boss':'goal'),
        status:practice?text(locale,'practice'):locked?text(locale,'locked'):badges.map(value=>value?'★':'☆').join(' '),
        summary:level.latches?(LATCH_COPY[locale]||LATCH_COPY.en)[1]:objective.goal,
        details:[level.latches?(LATCH_COPY[locale]||LATCH_COPY.en)[1]:objective.goal,objective.progress].filter(Boolean),
        locked,
        cleared:Boolean(badges[0]),
        poster:POSTER,
      };
    },
  });
}
