import {challenges,unlockChallenge} from './challenges.mjs';
import {stageLocales} from './stage-locales.mjs';

// Authored content only. Shared Play UI owns cards, fitting, pooling and input.
export function createChessStageConfig({locale,progress,kindLabel}) {
 const copy=stageLocales[locale];
 return {count:challenges.length,poster:'/assets/chess-cover-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){
  const challenge=challenges[index],cleared=progress.cleared.includes(challenge.id),unlocked=unlockChallenge(progress,challenge.id),state=cleared?'cleared':unlocked?'ready':'locked';
  return {id:challenge.id,kicker:`${copy.stage} ${challenge.id}`,title:kindLabel(challenge.kind),status:copy[state],summary:copy.challengeSummary,details:[copy.challengeDetails],locked:!unlocked,cleared};
 }};
}
