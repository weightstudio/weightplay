// Authored signals: l/r light, x/y crossed echo, L/R charging light, a/b light + opposite echo.
const CAMPAIGN = [
 ['First Light','第一道光','llrrlrlr','left',2200],
 ['Right on Time','右側來電','rrllrrlr','right',1800],
 ['Across the Roof','越過屋頂','lrlrrllr','alternate',1600],
 ['Stay on Target','連續鎖定','lllrrrlr','repeat',1560],
 ['Dawn Relay','晨光接力','lrLlrrRl','charge',1520],
 ['Quiet Echo','靜默殘影','lxrylrlyr','echo',1500],
 ['Double Mirage','雙重幻光','lxyrryxll','echo-pair',1460],
 ['Patient Paws','耐心之爪','lxlyrxryr','echo',1420],
 ['Break the Rhythm','打破節拍','llxrryllx','repeat',1380],
 ['Silent Sentinel','靜默守望','lxyryxlry','echo-pair',1340],
 ['Gathering Glow','蓄光時刻','LlRrlLrRlr','charge',1320],
 ['Wait, Then Snap','等待再快拍','lLRrLrlRlr','charge',1280],
 ['Long Breath','深呼吸','LRlRrlLrlR','long-rest',1240],
 ['False Start','搶拍陷阱','lLxRyrLrxr','charge-echo',1200],
 ['Moonrise Watch','月升哨站','LlRxLyrRlr','charge-echo',1160],
 ['Twin Towers','雙塔訊號','labrlabrlar','distract',1140],
 ['One True Light','唯一真光','abxlaryblar','distract-echo',1100],
 ['Crosswind','側風干擾','labrabrlabr','distract',1060],
 ['Noisy Neighbour','吵鬧鄰居','axyblabryal','distract-echo',1020],
 ['Mirror Gate','鏡光之門','aLbRyabLxra','mixed',980],
 ['Comet Rhythm','彗星節拍','lralbrralbrl','burst',960],
 ['Pause in the Storm','風暴間隙','LxraybRlaxbr','long-rest',920],
 ['Switchback','折返訊號','abLrabRlabrl','burst',880],
 ['Golden Patience','金色耐心','LxRaybLrRaxl','charge-echo',840],
 ['Aurora Circuit','極光迴路','LaRxbyLraRbl','mixed',800],
 ['Night Courier','夜行信使','labRLxraybLrr','mixed',780],
 ['Signal Weave','交織訊網','LaxbRylabRxlr','distract-echo',740],
 ['Starlight Sprint','星光疾拍','lrabLRlrayblr','burst',700],
 ['Last Watch','最後守望','LxyabRlRaxybr','mixed',660],
 ['The Sky Awakens','點亮整片天空','LaRxybLraRxbl','finale',640],
];
export const STAGES=CAMPAIGN.map(([name,zh,pattern,rule,window],i)=>Object.freeze({id:i+1,chapter:Math.floor(i/5),name,zh,pattern,rule,checkpoint:i%5===4,count:pattern.length,window,rest:Math.max(420,760-i*9),echo:i<5?0:.3}));
export function schedule(stage,seed=1){
 let x=seed>>>0||1;const rand=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/2**32;};
 const mirror=stage.id>2&&rand()<.5;
 return [...stage.pattern].map((symbol,i)=>{let side='lLxa'.includes(symbol)?'left':'right';if(mirror)side=side==='left'?'right':'left';
  const echo='xy'.includes(symbol),charge='LR'.includes(symbol)?(stage.rule==='long-rest'?900:580):0;
  return {side,echo,charge,distract:'ab'.includes(symbol),rest:stage.rest+(stage.chapter>=2?Math.floor(rand()*250):0)+(stage.rule==='long-rest'&&i%3===0?550:0)-(stage.rule==='burst'&&i%3?200:0)};
 });
}
export function createRun(index,seed=1){const stage=STAGES[Math.max(0,Math.min(29,index))];return {stage,sequence:schedule(stage,seed),cursor:-1,phase:'warmup',deadline:0,openedAt:0,errors:0,hits:0,held:0,reactions:[],streak:0,bestStreak:0,score:0,perfect:0,outcome:null,pausedAt:null};}
function finishCue(r,now){r.cursor++;if(r.cursor>=r.sequence.length){r.phase='ended';r.outcome=r.errors<3?'success':'failure';return;}r.phase='rest';r.deadline=now+r.sequence[r.cursor].rest;}
export function begin(r,now){if(r.phase==='warmup'){r.cursor=-1;finishCue(r,now);}return r;}
function error(r,reason,now){r.errors++;r.streak=0;if(r.errors>=3){r.phase='ended';r.outcome='failure';}else{r.phase='settle';r.deadline=now+440;}return {kind:'error',reason};}
function light(r,now){r.phase='cue';r.openedAt=now;r.deadline=now+r.stage.window;return {kind:'cue',cue:r.sequence[r.cursor]};}
export function tick(r,now){
 if(r.pausedAt!==null||['ended','warmup'].includes(r.phase)||now<r.deadline)return null;
 if(r.phase==='rest'){const cue=r.sequence[r.cursor];if(cue.charge){r.phase='charge';r.deadline=now+cue.charge;return {kind:'charge',cue};}return light(r,now);}
 if(r.phase==='charge')return light(r,now);
 if(r.phase==='cue'){if(r.sequence[r.cursor].echo){r.held++;r.streak++;r.score+=100+Math.min(r.streak,10)*10;r.bestStreak=Math.max(r.bestStreak,r.streak);r.phase='settle';r.deadline=now+300;return {kind:'hold'};}return error(r,'late',now);}
 if(r.phase==='settle'){finishCue(r,now);return {kind:r.phase==='ended'?'end':'rest'};}return null;
}
export function press(r,side,now){
 if(r.pausedAt!==null||['ended','warmup','settle'].includes(r.phase))return null;
 if(r.phase==='rest'||r.phase==='charge')return error(r,'early',now);
 if(now>=r.deadline)return tick(r,now);
 const cue=r.sequence[r.cursor];if(cue.echo)return error(r,'echo',now);if(side!==cue.side)return error(r,'side',now);
 const ms=Math.max(0,Math.round(now-r.openedAt)),perfect=ms<=300;r.hits++;r.streak++;r.perfect+=Number(perfect);r.score+=(perfect?200:100)+Math.min(r.streak,10)*10;r.bestStreak=Math.max(r.bestStreak,r.streak);r.reactions.push(ms);r.phase='settle';r.deadline=now+300;return {kind:'hit',ms,perfect,side};
}
export function pause(r,now){if(r.pausedAt===null&&r.phase!=='ended'){r.pausedAt=now;return true;}return false;}
export function resume(r,now){if(r.pausedAt!==null){const delta=Math.max(0,now-r.pausedAt);r.deadline+=delta;r.openedAt+=delta;r.pausedAt=null;}}
export function summary(r){return {outcome:r.outcome,hits:r.hits,held:r.held,errors:r.errors,bestStreak:r.bestStreak,score:r.score,perfect:r.perfect,median:r.reactions.length?[...r.reactions].sort((a,b)=>a-b)[Math.floor(r.reactions.length/2)]:null,stars:r.outcome==='success'?Math.max(1,3-r.errors):0};}
export function normalizeSave(s){const int=(n,max)=>Number.isInteger(n)?Math.max(0,Math.min(max,n)):0;const best=Array.from({length:30},(_,i)=>int(s?.best?.[i],3));const gold=best.reduce((a,b)=>a+b,0)>=15;const violet=s?.violet===true;return {version:2,unlocked:Math.max(1,int(s?.unlocked,30),Math.min(30,best.findLastIndex(v=>v>0)+2)),best,records:Array.from({length:30},(_,i)=>int(s?.records?.[i],99999)),violet,skin:s?.skin==='violet'&&violet?'violet':s?.skin==='gold'&&gold?'gold':'cyan'};}
export function recordClear(save,index,result){const next=normalizeSave(save);if(result.outcome!=='success'||!Number.isInteger(index)||index<0||index>=30)return next;next.best[index]=Math.max(next.best[index],Math.max(0,Math.min(3,result.stars||0)));next.records[index]=Math.max(next.records[index],result.score||0);next.unlocked=Math.max(next.unlocked,Math.min(30,index+2));return next;}

// Both writes are synchronous. Save delivery first so a failed game-save can never
// debit the shared wallet; compensate delivery if the wallet refuses or throws.
export function purchaseViolet({storage,wallet,key}){
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("signal-snap:model.mjs:purchaseViolet", () => purchaseViolet(...arguments));

 let previous;
 try{
  previous=storage.getItem(key);const state=normalizeSave(JSON.parse(previous||'null'));
  if(state.violet)return {ok:true,charged:false,save:state};
  if(!wallet||wallet.read().diamonds<12)return {ok:false,reason:'funds'};
  const next={...state,violet:true,skin:'violet'};
  storage.setItem(key,JSON.stringify(next));
  try{if(!wallet.spendDiamonds(12))throw Error('funds');}
  catch(error){if(previous===null)storage.removeItem(key);else storage.setItem(key,previous);return {ok:false,reason:error.message==='funds'?'funds':'storage'};}
  return {ok:true,charged:true,save:next};
 }catch{return {ok:false,reason:'storage'};}
}
