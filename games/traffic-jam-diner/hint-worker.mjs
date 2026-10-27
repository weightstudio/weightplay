import {normalizeStage,solveStage} from './engine.mjs?v=20261027-diner-opt-v24';
self.onmessage=({data})=>{
  try{
    const proof=solveStage(normalizeStage(data.stage),{startState:data.state,maxStates:80000});
    self.postMessage({request:data.request,action:proof.witness[0]||null,solvable:proof.solvable,overflow:proof.overflow});
  }catch{self.postMessage({request:data.request,error:true});}
};
