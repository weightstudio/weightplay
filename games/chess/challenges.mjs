// Authored foundation of the challenge campaign, not the completed 30-stage set.
// Solutions are audit evidence only; runtime judges chess state, not matching clicks.
export const challenges=[
 {id:1,kind:'rookCapture',fen:'7k/q7/8/8/8/8/8/R6K w - - 0 1',example:['Rxa7'],goal:{capture:'q',piece:'r'}},
 {id:2,kind:'bishopCapture',fen:'k7/7r/8/8/8/8/8/KB6 w - - 0 1',example:['Bxh7'],goal:{capture:'r',piece:'b'}},
 {id:3,kind:'fork',fen:'8/8/3q1k2/8/8/2N5/8/K7 w - - 0 1',example:['Ne4+'],goal:{fork:'d6'}},
 {id:4,kind:'block',fen:'4r2k/8/8/8/8/8/R7/4K3 w - - 0 1',example:['Re2'],goal:{block:true}},
 {id:5,kind:'promotion',fen:'7k/P7/8/8/8/8/8/7K w - - 0 1',example:['a8=Q+'],goal:{promotion:true}},
 {id:6,kind:'mate',fen:'7k/8/5KQ1/8/8/8/8/8 w - - 0 1',example:['Qg7#'],goal:{mate:true}},
 {id:7,kind:'pawnRace',computer:true,maxMoves:3,fen:'7k/8/8/P7/8/8/8/7K w - - 0 1',example:['a6','Kg7','a7','Kf6','a8=Q'],goal:{promotion:true}},
 {id:8,kind:'winQueen',computer:true,maxMoves:2,fen:'8/8/2q5/5k2/8/1N6/8/K7 w - - 0 1',example:['Nd4+','Ke5','Nxc6+'],goal:{capture:'q',piece:'n'}}
];
export function challengePassed(challenge,game,move){
 if(!move||move.color!=='w')return false;const goal=challenge.goal;
 if(goal.capture)return move.captured===goal.capture&&move.piece===goal.piece;
 if(goal.fork)return move.piece==='n'&&game.isCheck()&&game.attackers(goal.fork,'w').includes(move.to);
 if(goal.block)return move.piece==='r'&&move.to[0]==='e'&&move.from[0]!=='e'&&!move.captured;
 if(goal.promotion)return ['q','r','b','n'].includes(move.promotion);
 if(goal.mate)return game.isCheckmate();return false;
}
// null means play continues, not a failed attempt. Opponent moves cannot earn a clear.
export function challengeOutcome(challenge,game,move){
 if(challengePassed(challenge,game,move))return true;
 if(!challenge.computer||game.isGameOver())return false;
 const turns=game.history({verbose:true}).filter(m=>m.color==='w').length;
 return turns>=challenge.maxMoves?false:null;
}
export function loadChallengeProgress(storage){try{const saved=JSON.parse(storage.getItem('weightplay_chess_challenges_v1')||'{}');return {cleared:[...new Set((Array.isArray(saved.cleared)?saved.cleared:[]).filter(id=>Number.isInteger(id)&&challenges.some(c=>c.id===id)))]};}catch{return {cleared:[]};}}
export function unlockChallenge(progress,id){return id===1||progress.cleared.includes(id)||progress.cleared.includes(id-1);}
export function recordChallengeClear(storage,progress,id){const next={cleared:[...new Set([...progress.cleared,id])].sort((a,b)=>a-b)};storage.setItem('weightplay_chess_challenges_v1',JSON.stringify(next));return next;}
