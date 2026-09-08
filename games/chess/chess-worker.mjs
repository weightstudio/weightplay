import {chooseMove} from './full-rules.mjs';
import {chooseChallengeHint} from './challenge-hint.mjs';
self.onmessage=({data})=>{
  try{self.postMessage({id:data.id,...(data.options?.challenge?chooseChallengeHint(data.fen,data.options.challenge):chooseMove(data.fen,data.options))});}
  catch{self.postMessage({id:data.id,fen:data.fen,error:'SEARCH_FAILED'});}
};
self.postMessage({type:'READY'});
