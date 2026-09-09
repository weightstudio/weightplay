import {MAHJONG_CAMPAIGN,startMahjongStage} from './campaign-stages.mjs';
import {campaignBlock,campaignOutcome,removeCampaignPair,undoCampaignPair,solveCampaign} from './campaign-engine.mjs';
import {loadMahjongProgress,saveMahjongProgress,completeMahjongStage,normalizeMahjongProgress} from './campaign-progress.mjs';

// One campaign owner for UI events, exact completion and persistence. No DOM,
// timers or worker; callers render snapshots and own their visual lifecycle.
export function createMahjongSession(storage,{onEvent}={}) {
 let {progress,persistent}=loadMahjongProgress(storage);
 let screen='main',stage=null,board=null,selected=null,hint=[],hints=0,undos=0,message='ready',settled=false;
 function emit(name,details={}){try{onEvent?.(name,Object.freeze({stage_id:stage,remaining_pairs:board?(board.tiles.length-board.removed.length)/2:0,hints_used:hints,undos_used:undos,...details}));}catch{/* Measurement never interrupts play or changes state. */}}
 function snapshot(){
  return Object.freeze({screen,stage,board,selected,hint:Object.freeze([...hint]),hints,undos,message,persistent,
   progress:normalizeMahjongProgress(progress),outcome:board?campaignOutcome(board):null,
   canNext:screen==='battle'&&settled&&stage<MAHJONG_CAMPAIGN.length,
   canUndo:screen==='battle'&&!settled&&Boolean(board?.history.length),
   stars:3-Number(hints>0)-Number(undos>0)});
 }
 function start(id,from='stage'){
  if(!Number.isInteger(id)||id<1||id>progress.unlocked)throw new Error('Stage is locked or invalid');
  stage=id;board=startMahjongStage(id);selected=null;hint=[];hints=0;undos=0;settled=false;message='ready';screen='battle';
  emit('game_start',{from});return snapshot();
 }
 function select(id){
  if(screen!=='battle'||settled)return snapshot();
  const blocked=campaignBlock(board,id);
  if(blocked){message=blocked;return snapshot();}
  hint=[];
  if(selected===id){selected=null;message='ready';}
  else if(!selected){selected=id;message='selected';}
  else{
   const result=removeCampaignPair(board,selected,id);
   if(result.ok){
    board=result.state;selected=null;message='matched';emit('match',{pair_number:board.history.length});
    if(campaignOutcome(board)==='complete'){
     // This path runs exactly once for a successful run. Further clicks,
     // hints and undo cannot duplicate the write or alter the result rating.
     progress=completeMahjongStage(progress,stage,board,{hints,undos});
     ({progress,persistent}=saveMahjongProgress(storage,progress));settled=true;message='won';emit('game_complete',{outcome:'success',stars:3-Number(hints>0)-Number(undos>0)});emit('result',{outcome:'success',stars:3-Number(hints>0)-Number(undos>0)});
    }else if(campaignOutcome(board)==='stalled')message='stalled';
   }else if(result.reason==='order'){message='orderBlocked';emit('order_rejected');}
   else {selected=id;message='mismatch';emit('mismatch');}
  }
  return snapshot();
 }
 function undo(){
  if(screen!=='battle'||settled)return snapshot();
  const result=undoCampaignPair(board);
  if(result.ok){board=result.state;undos++;selected=null;hint=[];message='ready';emit('undo');}
  return snapshot();
 }
 function requestHint({maxNodes=20000}={}){
  if(screen!=='battle'||settled)return snapshot();
  const result=solveCampaign(board,{maxNodes});selected=null;hint=[];
  if(result.status==='SOLVED'&&result.path.length){hint=[...result.path[0]];hints++;message='ready';emit('hint');}
  else message=result.status==='UNKNOWN'?'searchUnknown':'recoveryRequired';
  return snapshot();
 }
 function next(){if(!snapshot().canNext)return snapshot();return start(stage+1,'next');}
 function replay(){if(stage===null)return snapshot();emit('game_restart');emit('replay');return start(stage,'replay');}
 function stages(){if(screen==='battle')emit('stage_return',{completed:settled?1:0});screen='stage';selected=null;hint=[];return snapshot();}
 function home(){screen='main';selected=null;hint=[];return snapshot();}
 return Object.freeze({snapshot,start,select,undo,requestHint,next,replay,stages,home});
}
