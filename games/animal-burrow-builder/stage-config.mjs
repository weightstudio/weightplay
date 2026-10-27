import {LEVELS} from './levels.mjs';
import {COPY,levelName} from './copy.mjs';
import {HILLSIDE_COPY} from './hillside-copy.mjs?v=20261027-hillside-candidate2';
import {unlocked} from './core.mjs';
export function stageConfig({locale,save,practice,levels=LEVELS}) {
  const c=COPY[locale];
  const h=HILLSIDE_COPY[locale]||HILLSIDE_COPY.en;
  return {gameId:'animal-burrow-builder',poster:'/assets/interface7-redrawn/animal-burrow-builder.webp',background:'/assets/lobby-block-atmosphere.svg',count:levels.length,
    stage(index){const l=levels[index],record=save.records[index],locked=!practice&&index>unlocked(save);return {
      id:l.id,kicker:`${c.chapter} ${l.chapter+1} · ${l.hillside?h.chapter:c.chapters[l.chapter]}`,title:`${String(index+1).padStart(2,'0')} · ${levelName(l,locale)}`,
      subtitle:`${c.timber} ${l.budget} · ${c.mastery} ≤ ${l.par}`,
      status:locked?c.locked:record?`${'★'.repeat(record.stars)}${'☆'.repeat(3-record.stars)} · ${c.cleared}`:c.ready,
      summary:Object.entries(l.goals).map(([k,n])=>`${k==='food'?c.food:k==='aired'?h.aired:k==='reinforced'?h.reinforced:c.tools[['hall','bed','pantry','garden','bridge','nursery'].indexOf(k)]} ${n}`).join(' · '),
      details:[...c.rules,...(l.hillside?[h.rules]:[]),`${c.efficient}: ${l.par} · ${c.relic}`],locked,cleared:Boolean(record),
    };}};
}
