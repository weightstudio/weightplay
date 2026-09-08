import {Chess} from './vendor/chess-1.4.0.mjs';
import {challengePassed} from './challenges.mjs';

// Prove a goal against every legal defense. Never substitute a material-gain
// move when a tactical objective cannot be proved within the worker budget.
export function chooseChallengeHint(fen,{goal,remaining=1,timeMs=450,maxNodes=6000}={}){
 const game=new Chess(fen),deadline=performance.now()+Math.min(600,Math.max(1,timeMs));
 const budget=Math.min(12000,Math.max(1,maxNodes)),depth=Math.min(3,Math.max(1,remaining));
 let nodes=0,exhausted=false;
 const alive=()=>{if(++nodes>budget||performance.now()>=deadline){exhausted=true;return false;}return true;};
 const moves=()=>game.moves({verbose:true}).sort((a,b)=>Number(/[+#]/.test(b.san))-Number(/[+#]/.test(a.san))||Number(Boolean(b.promotion))-Number(Boolean(a.promotion))||Number(Boolean(b.captured))-Number(Boolean(a.captured)));
 function prove(turns){
  if(!alive()||game.isGameOver())return false;
  const white=game.turn()==='w';
  for(const candidate of moves()){
   if(!alive())return false;
   const move=game.move(candidate);
   let wins;
   try{wins=white?(challengePassed({goal},game,move)||(turns>1&&prove(turns-1))):prove(turns);}
   finally{game.undo();}
   if(exhausted)return false;
   if(white&&wins)return true;
   if(!white&&!wins)return false;
  }
  return !white;
 }
 if(!goal||game.turn()!=='w'||game.isGameOver())return {fen,move:null,nodes};
 for(const candidate of moves()){
  if(!alive())break;
  const move=game.move(candidate);let wins;
  try{wins=challengePassed({goal},game,move)||(depth>1&&prove(depth-1));}
  finally{game.undo();}
  if(wins&&!exhausted)return {fen,move:{from:move.from,to:move.to,...(move.promotion?{promotion:move.promotion}:{})},nodes};
  if(exhausted)break;
 }
 return {fen,move:null,nodes,reason:exhausted?'HINT_BUDGET_EXHAUSTED':'NO_PROVEN_HINT'};
}
