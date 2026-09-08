import {Chess} from './vendor/chess-1.4.0.mjs';

// The complete rules engine is independent of camera, animation and UI.
// Not wired to the legacy three-click game until the replacement is verified.
export class ChessSession {
  constructor(pgn='') {this.game=new Chess();if(pgn)this.game.loadPgn(pgn);}
  get fen(){return this.game.fen();}
  get turn(){return this.game.turn();}
  moves(square){return this.game.moves({verbose:true,...(square?{square}:{})});}
  move(from,to,promotion){
    const matches=this.moves(from).filter(m=>m.to===to);
    if(!matches.length)return {ok:false,reason:'ILLEGAL_MOVE'};
    if(matches.some(m=>m.promotion)&&!promotion)return {ok:false,reason:'PROMOTION_REQUIRED',choices:matches.map(m=>m.promotion)};
    if(promotion&&!matches.some(m=>m.promotion===promotion))return {ok:false,reason:'INVALID_PROMOTION'};
    const move=this.game.move({from,to,...(promotion?{promotion}:{})});
    return {ok:true,move,status:this.status()};
  }
  status(){
    if(this.game.isCheckmate())return {ended:true,reason:'CHECKMATE',winner:this.turn==='w'?'b':'w'};
    if(this.game.isStalemate())return {ended:true,reason:'STALEMATE',winner:null};
    if(this.game.isThreefoldRepetition())return {ended:true,reason:'REPETITION',winner:null};
    if(this.game.isInsufficientMaterial())return {ended:true,reason:'INSUFFICIENT_MATERIAL',winner:null};
    if(this.game.isDrawByFiftyMoves())return {ended:true,reason:'FIFTY_MOVES',winner:null};
    return {ended:false,reason:this.game.isCheck()?'CHECK':'PLAY',winner:null};
  }
  undoTurn(human='w'){
    if(!this.game.history().length)return false;
    this.game.undo();
    if(this.turn!==human&&this.game.history().length)this.game.undo();
    return true;
  }
  reset(){this.game.reset();}
  serialize(){return {schema:1,pgn:this.game.pgn(),fen:this.fen};}
  static restore(data){
    if(!data||data.schema!==1||typeof data.pgn!=='string'||data.pgn.length>200000)throw Error('INVALID_SAVE');
    const session=new ChessSession(data.pgn);
    if(session.fen!==data.fen)throw Error('SAVE_POSITION_MISMATCH');
    return session;
  }
}

const values={p:100,n:320,b:335,r:500,q:900,k:0};
const rankMove=m=>(m.captured?values[m.captured]*10-values[m.piece]:0)+(m.promotion?values[m.promotion]:0)+(m.san.includes('#')?100000:0);
// Bounded iterative deepening runs in an owned Worker, never on the UI thread.
export function chooseMove(fen,{maxDepth=3,maxNodes=12000,timeMs=200,now=()=>performance.now()}={}){
  const game=new Chess(fen),initial=game.fen();let nodes=0,completedDepth=0;
  const started=now(),deadline=started+Math.max(0,Math.min(1000,timeMs));
  maxDepth=Math.max(1,Math.min(4,maxDepth));maxNodes=Math.max(1,Math.min(50000,maxNodes));
  const moves=()=>game.moves({verbose:true}).sort((a,b)=>rankMove(b)-rankMove(a));
  const roots=moves();if(!roots.length||game.isGameOver())return {move:null,nodes,completedDepth,fen};
  let best=roots[0];const STOP=Symbol('budget');
  function score(){let total=0;for(const row of game.board())for(const p of row)if(p){const center=3.5-Math.abs(p.square.charCodeAt(0)-97-3.5);const progress=p.color==='w'?Number(p.square[1])-2:7-Number(p.square[1]);const bonus=p.type==='p'?progress*5:p.type==='n'||p.type==='b'?center*8:0;total+=(p.color===game.turn()?1:-1)*(values[p.type]+bonus);}return total;}
  function search(depth,alpha,beta,ply){
    if(++nodes>maxNodes||now()>=deadline)throw STOP;
    if(game.isCheckmate())return -100000+ply;
    if(game.isDraw())return 0;
    if(!depth)return score();
    let bestScore=-Infinity;
    for(const m of moves()){
      game.move(m);let value;try{value=-search(depth-1,-beta,-alpha,ply+1);}finally{game.undo();}
      bestScore=Math.max(bestScore,value);alpha=Math.max(alpha,value);if(alpha>=beta)break;
    }
    return bestScore;
  }
  for(let depth=1;depth<=maxDepth;depth++){
    let roundBest=best,roundScore=-Infinity;
    try{for(const m of roots){game.move(m);let value;try{value=-search(depth-1,-Infinity,-roundScore,1);}finally{game.undo();}if(value>roundScore){roundScore=value;roundBest=m;}}
      best=roundBest;completedDepth=depth;
    }catch(error){if(error!==STOP)throw error;break;}
  }
  if(game.fen()!==initial)throw Error('SEARCH_STATE_LEAK');
  return {move:{from:best.from,to:best.to,...(best.promotion?{promotion:best.promotion}:{})},nodes,completedDepth,fen};
}
