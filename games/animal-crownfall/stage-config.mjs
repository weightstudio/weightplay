import {LEVELS} from './levels.mjs';
import {newState} from './core.mjs?v=20261028-latch1';
import {NAMES} from './stage-copy.mjs';
import {battleObjective} from './objective-copy.mjs?v=20261028-rtl-order1';
import {text} from './locales.mjs';
import {LATCH_COPY,LATCH_NAMES,LATCH_FIND_KEY,LATCH_RUNE_RULE,LATCH_PAIR_RULE,LATCH_BOSS_RULE,LATCH_ARITHMETIC_RULE,LATCH_DUAL_ARITHMETIC_RULE,LATCH_SHIELD_ARITHMETIC_RULE,LATCH_DUAL_SHIELD_RULE,LATCH_DUAL_BOSS_RULE,LATCH_SEALS_RULE,LATCH_DUAL_SEALS_RULE,LATCH_SEAL_SHIELD_RULE,LATCH_DUAL_SEAL_SHIELD_RULE,LATCH_TWO_RUNES_RULE,LATCH_THREE_SEALS_RULE,LATCH_DUAL_THREE_SEALS_RULE} from './latch-copy.mjs?v=20261028-latch23';

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
        title:level.latches?(LATCH_NAMES[locale]||LATCH_NAMES.en)[level.id-31]:(NAMES[locale]||NAMES.en)[level.id-1]||`${text(locale,'stage')} ${level.id}`,
        subtitle:text(locale,level.id%5===0?'boss':'goal'),
        status:practice?text(locale,'practice'):locked?text(locale,'locked'):badges.map(value=>value?'★':'☆').join(' '),
        summary:level.latches?(level.id===47?(LATCH_DUAL_THREE_SEALS_RULE[locale]||LATCH_DUAL_THREE_SEALS_RULE.en):level.id===46?(LATCH_THREE_SEALS_RULE[locale]||LATCH_THREE_SEALS_RULE.en):level.id===45?(LATCH_TWO_RUNES_RULE[locale]||LATCH_TWO_RUNES_RULE.en):level.id===44?(LATCH_DUAL_SEAL_SHIELD_RULE[locale]||LATCH_DUAL_SEAL_SHIELD_RULE.en):level.id===43?(LATCH_SEAL_SHIELD_RULE[locale]||LATCH_SEAL_SHIELD_RULE.en):level.id===42?(LATCH_DUAL_SEALS_RULE[locale]||LATCH_DUAL_SEALS_RULE.en):level.id===41?(LATCH_SEALS_RULE[locale]||LATCH_SEALS_RULE.en):level.id===40?(LATCH_DUAL_BOSS_RULE[locale]||LATCH_DUAL_BOSS_RULE.en):level.id===39?(LATCH_DUAL_SHIELD_RULE[locale]||LATCH_DUAL_SHIELD_RULE.en):level.id===38?(LATCH_SHIELD_ARITHMETIC_RULE[locale]||LATCH_SHIELD_ARITHMETIC_RULE.en):level.id===37?(LATCH_DUAL_ARITHMETIC_RULE[locale]||LATCH_DUAL_ARITHMETIC_RULE.en):level.id===36?(LATCH_ARITHMETIC_RULE[locale]||LATCH_ARITHMETIC_RULE.en):level.id===35?(LATCH_BOSS_RULE[locale]||LATCH_BOSS_RULE.en):level.id===34?(LATCH_PAIR_RULE[locale]||LATCH_PAIR_RULE.en):level.id===33?(LATCH_RUNE_RULE[locale]||LATCH_RUNE_RULE.en):level.id===32?(LATCH_FIND_KEY[locale]||LATCH_FIND_KEY.en):(LATCH_COPY[locale]||LATCH_COPY.en)[1]):objective.goal,
        details:[level.latches?(level.id===47?(LATCH_DUAL_THREE_SEALS_RULE[locale]||LATCH_DUAL_THREE_SEALS_RULE.en):level.id===46?(LATCH_THREE_SEALS_RULE[locale]||LATCH_THREE_SEALS_RULE.en):level.id===45?(LATCH_TWO_RUNES_RULE[locale]||LATCH_TWO_RUNES_RULE.en):level.id===44?(LATCH_DUAL_SEAL_SHIELD_RULE[locale]||LATCH_DUAL_SEAL_SHIELD_RULE.en):level.id===43?(LATCH_SEAL_SHIELD_RULE[locale]||LATCH_SEAL_SHIELD_RULE.en):level.id===42?(LATCH_DUAL_SEALS_RULE[locale]||LATCH_DUAL_SEALS_RULE.en):level.id===41?(LATCH_SEALS_RULE[locale]||LATCH_SEALS_RULE.en):level.id===40?(LATCH_DUAL_BOSS_RULE[locale]||LATCH_DUAL_BOSS_RULE.en):level.id===39?(LATCH_DUAL_SHIELD_RULE[locale]||LATCH_DUAL_SHIELD_RULE.en):level.id===38?(LATCH_SHIELD_ARITHMETIC_RULE[locale]||LATCH_SHIELD_ARITHMETIC_RULE.en):level.id===37?(LATCH_DUAL_ARITHMETIC_RULE[locale]||LATCH_DUAL_ARITHMETIC_RULE.en):level.id===36?(LATCH_ARITHMETIC_RULE[locale]||LATCH_ARITHMETIC_RULE.en):level.id===35?(LATCH_BOSS_RULE[locale]||LATCH_BOSS_RULE.en):level.id===34?(LATCH_PAIR_RULE[locale]||LATCH_PAIR_RULE.en):level.id===33?(LATCH_RUNE_RULE[locale]||LATCH_RUNE_RULE.en):level.id===32?(LATCH_FIND_KEY[locale]||LATCH_FIND_KEY.en):(LATCH_COPY[locale]||LATCH_COPY.en)[1]):objective.goal,objective.progress].filter(Boolean),
        locked,
        cleared:Boolean(badges[0]),
        poster:POSTER,
      };
    },
  });
}
