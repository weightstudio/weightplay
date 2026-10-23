import { LEVELS } from './levels.mjs?v=23';
import { CAMPAIGN_COPY, stageName } from './campaign-copy.mjs?v=23';
export function createStageConfig({locale,getSave,isPractice}) {
  const c=CAMPAIGN_COPY[locale]||CAMPAIGN_COPY.en;
  return {gameId:'road-crosser',count:LEVELS.length,
    poster:'/assets/interface7-redrawn/road-crosser.webp',background:'/assets/interface7-redrawn/road-crosser.webp',
    stage(index) {
      const level=LEVELS[index],save=getSave(),mask=save.medals[index],locked=!isPractice()&&level.id>save.unlocked;
      return {id:level.id,kicker:`${c.stages} ${level.id} / 30`,title:stageName(level,locale),
        subtitle:level.checkpoint?c.checkpoint:c.arcs[level.arc],
        status:locked?c.locked:mask?[1,2,4].map(bit=>mask&bit?'★':'☆').join(' '):c.goal,
        summary:c[level.hint],details:[c.goal,c[level.hint],`${c.medalRules}${level.charge?'':` ≤ ${level.budget}`}`],
        locked,cleared:Boolean(mask&1)};
    }};
}
