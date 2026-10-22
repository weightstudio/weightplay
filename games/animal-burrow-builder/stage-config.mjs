import {LEVELS} from './levels.mjs';
import {COPY,levelName} from './copy.mjs';
import {unlocked} from './core.mjs';
export function stageConfig({locale,save,practice}) {
  const c=COPY[locale];
  return {gameId:'animal-burrow-builder',poster:'/assets/interface7-redrawn/animal-burrow-builder.webp',background:'/assets/lobby-block-atmosphere.svg',count:LEVELS.length,
    stage(index){const l=LEVELS[index],record=save.records[index],locked=!practice&&index>unlocked(save);return {
      id:l.id,kicker:`${c.chapter} ${l.chapter+1} · ${c.chapters[l.chapter]}`,title:`${String(index+1).padStart(2,'0')} · ${levelName(l,locale)}`,
      subtitle:`${c.timber} ${l.budget} · ${c.mastery} ≤ ${l.par}`,
      status:locked?c.locked:record?`${'★'.repeat(record.stars)}${'☆'.repeat(3-record.stars)} · ${c.cleared}`:c.ready,
      summary:Object.entries(l.goals).map(([k,n])=>`${k==='food'?c.food:c.tools[['hall','bed','pantry','garden','bridge','nursery'].indexOf(k)]} ${n}`).join(' · '),
      details:[...c.rules,`${c.efficient}: ${l.par} · ${c.relic}`],locked,cleared:Boolean(record),
    };}};
}
