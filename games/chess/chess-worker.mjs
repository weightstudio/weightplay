import {chooseMove} from './full-rules.mjs';
self.onmessage=({data})=>{
  try{self.postMessage({id:data.id,...chooseMove(data.fen,data.options)});}
  catch{self.postMessage({id:data.id,fen:data.fen,error:'SEARCH_FAILED'});}
};
