// Thirty authored positions; campaign count alone does not grant release approval.
// Solutions are audit evidence only; runtime judges chess state, not matching clicks.
export const challenges=[
 {id:1,kind:'rookCapture',fen:'7k/q7/8/8/8/8/8/R6K w - - 0 1',example:['Rxa7'],goal:{capture:'q',piece:'r'}},
 {id:2,kind:'bishopCapture',fen:'k7/7r/8/8/8/8/8/KB6 w - - 0 1',example:['Bxh7'],goal:{capture:'r',piece:'b'}},
 {id:3,kind:'fork',fen:'8/8/3q1k2/8/8/2N5/8/K7 w - - 0 1',example:['Ne4+'],goal:{fork:'d6'}},
 {id:4,kind:'block',fen:'4r2k/8/8/8/8/8/R7/4K3 w - - 0 1',example:['Re2'],goal:{block:true}},
 {id:5,kind:'promotion',fen:'7k/P7/8/8/8/8/8/7K w - - 0 1',example:['a8=Q+'],goal:{promotion:true}},
 {id:6,kind:'mate',fen:'7k/8/5KQ1/8/8/8/8/8 w - - 0 1',example:['Qg7#'],goal:{mate:true}},
 {id:7,kind:'pawnRace',computer:true,maxMoves:3,fen:'7k/8/8/P7/8/8/8/7K w - - 0 1',example:['a6','Kg7','a7','Kf6','a8=Q'],goal:{promotion:true}},
 {id:8,kind:'winQueen',computer:true,maxMoves:2,fen:'8/8/2q5/5k2/8/1N6/8/K7 w - - 0 1',example:['Nd4+','Ke5','Nxc6+'],goal:{capture:'q',piece:'n'}},
 {id:9,kind:'castleKing',fen:'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',example:['O-O'],goal:{castle:'k'}},
 {id:10,kind:'takeChecker',fen:'7k/8/8/8/1b6/8/1R6/4K3 w - - 0 1',example:['Rxb4'],goal:{capture:'b',piece:'r'}},
 {id:11,kind:'enPassant',fen:'7k/8/8/3pP3/8/8/8/7K w - d6 0 1',example:['exd6'],goal:{enPassant:true}},
 {id:12,kind:'knightPromotion',fen:'8/P1k5/1q6/8/8/8/8/7K w - - 0 1',example:['a8=N+'],goal:{promotion:'n',check:true,attack:'b6'}},
 {id:13,kind:'discovered',fen:'k7/8/8/3r4/8/8/B7/R6K w - - 0 1',example:['Bxd5+'],goal:{capture:'r',piece:'b',checkBy:'r'}},
 {id:14,kind:'backRank',fen:'6k1/r4ppp/8/8/8/8/8/4R2K w - - 0 1',example:['Re8#'],goal:{mate:true}},
 {id:15,kind:'castleQueen',fen:'r3k2r/8/8/8/2b5/8/PPP2PPP/R3K2R w KQkq - 0 1',example:['O-O-O'],goal:{castle:'q'}},
 {id:16,kind:'rookLadder',computer:true,maxMoves:2,fen:'6k1/8/8/8/8/8/1R6/R6K w - - 0 1',example:['Rb7','Kf8','Ra8#'],goal:{mate:true}},
 {id:17,kind:'rookSkewer',computer:true,maxMoves:2,fen:'q3k3/8/8/8/8/8/8/6KR w - - 0 1',example:['Rh8+','Kd7','Rxa8'],goal:{capture:'q',piece:'r'}},
 {id:18,kind:'bishopSkewer',computer:true,maxMoves:2,fen:'7q/8/8/4k3/8/B7/8/6K1 w - - 0 1',example:['Bb2+','Kd5','Bxh8'],goal:{capture:'q',piece:'b'}},
 {id:19,kind:'rookPromotion',fen:'8/k1P5/2K5/8/8/8/8/8 w - - 0 1',example:['c8=R'],goal:{promotion:'r'}},
 {id:20,kind:'kingSupport',computer:true,maxMoves:2,fen:'7k/1R6/5K2/8/8/8/8/8 w - - 0 1',example:['Kg6','Kg8','Rb8#'],goal:{mate:true}},
 {id:21,kind:'smotheredMate',fen:'6rk/6pp/8/6N1/8/8/8/K7 w - - 0 1',example:['Nf7#'],goal:{mate:true,matePiece:'n'}},
 {id:22,kind:'doubleCheck',fen:'4k3/8/8/8/8/8/4B3/K3R3 w - - 0 1',example:['Bb5+'],goal:{doubleCheck:true}},
 {id:23,kind:'queenSacrifice',computer:true,maxMoves:2,fen:'4Qrk1/5ppp/8/1B6/8/8/8/4R1K1 w - - 0 1',example:['Qxf8+','Kxf8','Re8#'],goal:{mate:true}},
 {id:24,kind:'supportedPawn',computer:true,maxMoves:3,fen:'3k4/8/4PK2/8/8/8/8/8 w - - 0 1',example:['Kf7','Kc7','e7','Kd7','e8=Q+'],goal:{promotion:true}},
 {id:25,kind:'bishopNet',fen:'7k/8/6K1/6B1/2B5/8/8/8 w - - 0 1',example:['Bf6#'],goal:{mate:true,matePiece:'b'}},
 {id:26,kind:'enPassantDiscovery',fen:'8/8/8/4RPpk/8/8/8/K7 w - g6 0 1',example:['fxg6+'],goal:{enPassant:true,checkBy:'r'}},
 {id:27,kind:'castlingMate',fen:'4rkr1/4p1p1/8/8/8/8/8/4K2R w K - 0 1',example:['O-O#'],goal:{castle:'k',mate:true}},
 {id:28,kind:'pawnFork',computer:true,maxMoves:2,fen:'7k/8/2r1r3/8/3P4/8/6PP/6RK w - - 0 1',example:['d5','Rc5','dxe6'],goal:{capture:'r',piece:'p'}},
 {id:29,kind:'promotionMate',fen:'3r2k1/2P2ppp/8/8/8/8/8/K7 w - - 0 1',example:['cxd8=Q#'],goal:{capture:'r',piece:'p',promotion:true,mate:true}},
 {id:30,kind:'ladderFinale',computer:true,maxMoves:3,fen:'8/8/6k1/5ppp/8/8/8/RR5K w - - 0 1',example:['Ra6+','Kf7','Rb7+','Kf8','Ra8#'],goal:{mate:true}}
];
export function challengePassed(challenge,game,move){
 if(!move||move.color!=='w')return false;const goal=challenge.goal;
 if(goal.promotion&&(!['q','r','b','n'].includes(move.promotion)||(goal.promotion!==true&&move.promotion!==goal.promotion)||goal.check&&!game.isCheck()||goal.attack&&!game.attackers(goal.attack,'w').includes(move.to)))return false;
 if(goal.mate&&(!game.isCheckmate()||(goal.matePiece&&move.piece!==goal.matePiece)))return false;
 if(goal.checkBy||goal.doubleCheck){
  const king=game.board().flat().find(p=>p?.type==='k'&&p.color==='b');
  if(!king)return false;
  const attackers=game.attackers(king.square,'w');
  if(goal.checkBy&&!attackers.some(square=>square!==move.to&&game.get(square)?.type===goal.checkBy))return false;
  if(goal.doubleCheck)return attackers.length>=2;
 }
 if(goal.capture){
  return move.captured===goal.capture&&move.piece===goal.piece;
 }
 if(goal.castle)return move.piece==='k'&&move.flags.includes(goal.castle);
 if(goal.enPassant)return move.flags.includes('e');
 if(goal.fork)return move.piece==='n'&&game.isCheck()&&game.attackers(goal.fork,'w').includes(move.to);
 if(goal.block)return move.piece==='r'&&move.to[0]==='e'&&move.from[0]!=='e'&&!move.captured;
 if(goal.promotion)return true;
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
