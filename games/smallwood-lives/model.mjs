import {chapter,LIMITS,seededRandom,NAMES,COSMETICS} from './content.mjs';
export const SAVE_KEY='weightplay.smallwood-lives.v1';
export const clone=value=>structuredClone(value);
export function emptySave(){return {schema:1,revision:0,cleared:[],album:{},run:null,displays:Array(30).fill(null),cosmetics:[],tutorial:false,selected:0};}
export function newRun(index,seed){
 const stage=chapter(index),rng=seededRandom(seed),names=[...NAMES].sort(()=>0);
 for(let i=names.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[names[i],names[j]]=[names[j],names[i]];}
 const deck=[1],pool=[2,3,4,5,6,7,8,9,10,11,12].filter(x=>!(index===28&&[6,12].includes(x))&&!(index===2&&x===2));
 while(deck.length<6){const eligible=pool.filter(x=>!(deck.length===1&&[2,8].includes(x))&&!(index===24&&x===2)&&!(deck.filter(x=>[2,8].includes(x)).length>=2&&[2,8].includes(x))&&!(deck.length>1&&[2,8].includes(deck.at(-1))&&[2,8].includes(x)));const n=eligible[Math.floor(rng()*eligible.length)];deck.push(n);pool.splice(pool.indexOf(n),1);}
 if(index===0)deck.splice(0,6,1,3,5,6,11,4);
 if(index===1)deck.splice(0,6,1,5,3,6,4,11);
 return {schema:1,id:`${stage.id}-${seed>>>0}`,index,seed:seed>>>0,revision:0,season:1,T:2,E:stage.initial.E,M:stage.initial.M,W:0,N:0,A:1,B:0,C:0,
 species:stage.species[Math.floor(rng()*2)],names:names.slice(0,4),weather:rng()<.5?'snow':'sun',daily:deck,usedDaily:[],
 phase:'actions',eventSlot:0,eventStep:0,flags:{},promises:[],memories:[],echoes:[],actions:[],remote:['C'],selected:'A',allocated:null,help:null,location:stage.arc,finished:false,legacy:null,legacyWork:0};
}
export function daily(run){return run.season%2===1?run.daily[(run.season-1)/2]:0;}
export function weather(run){
 if([7,8].includes(run.season)){
  if(run.index===24)return run.weather;
  if([13,20].includes(run.index))return run.index===20?'snow':'rain';
  if(run.index===3&&run.season===7)return 'rain';
 }
 return daily(run)===2?'rain':'sun';
}
const cap=(key,value)=>Math.min(LIMITS[key],Math.max(0,value));
function makeOption(run,id,delta={},requires={},meta={}){
 const missing=[];
 for(const [k,n] of Object.entries(requires))if(run[k]<n)missing.push({key:k,amount:n-run[k],requirement:true});
 for(const [k,n] of Object.entries(delta))if(n<0&&run[k]+n<0)missing.push({key:k,amount:-(run[k]+n),requirement:false});
 if(meta.blocked)missing.push({key:meta.blocked,amount:0});
 const actual=Object.fromEntries(Object.entries(delta).map(([k,v])=>[k,cap(k,run[k]+v)-run[k]]));
 return {id,delta,actual,requires,available:!missing.length,missing,...meta};
}
function target(run,key){return key==='selected'?run.selected:key==='allocated'?(run.allocated||'A'):key==='location'?(run.flags.moved?'B':'A'):key;}
export function currentEvent(run){
 if(run.phase!=='event')return null;
 const base=chapter(run.index).events[run.eventSlot];
 return {...base,target:target(run,base.target),family:run.index===24&&run.eventSlot===1&&run.eventStep===1?'promise':base.family};
}
export function eventOptions(run){
 const event=currentEvent(run);if(!event)return [];
 const {family:f,target:who,second}=event,o=(id,d={},r={},m={})=>makeOption(run,id,d,r,{target:who,...m});
 const work={T:-1,E:-1};
 switch(f){
 case 'gift':return [o('give',{M:-2,[who]:1}),o('makeTogether',{...work,[who]:1,W:1}),o('keep')];
 case 'invite':return [o('choosePerson',{...work,[who]:1},{},{target:who,branch:who}),o('choosePerson',{...work,[second]:1},{},{target:second,branch:second}),o('decline')];
 case 'promise':return event.second==='B'&&run.index===9?
  [o('promiseOne',{}, {},{people:['A']}),o('promiseBoth',{}, {},{people:['A','B']}),o('decline')]:[o('promiseOne',{}, {},{people:[who]}),o('decline')];
 case 'repair':return [o('repairSelf',{...work,M:-1},{W:1}),o('repairFriend',work,{[who]:2}),...(run.help===who?[o('repairHelp',{}, {},{target:who})]:[]),o('leave')];
 case 'learn':return [o('learnCraft',{...work,W:1}),o('learnNature',{...work,N:1}),o('listen')];
 case 'move':return [o('move',{T:-1,M:-1}),o('stay')];
 case 'weather':return [o('shelter',{T:-1,M:-1}),o('supplies',{...work,M:2}),o('leave')];
 case 'mentor':{
  const t=who==='choice'?'A':who;return [o('mentorCraft',{...work,[t]:1},{W:2},{target:t}),o('mentorNature',{...work,[t]:1},{N:2},{target:t}),...(who==='choice'?[o('mentorCraft',{...work,B:1},{W:2},{target:'B',branch:'B'})]:[]),o('listen')];
 }
 case 'allocate':return [o('allocateA',{M:-3,A:1},{},{target:'A'}),o('allocateB',{M:-3,B:1},{},{target:'B'}),o('keep')];
 case 'boundary':return [o('join',{...work,[who]:1}),o('ownTime')];
 case 'build':{
  const route=run.index===14&&run.flags.moved?'N':'W';
  return [o('buildSelf',{...work,M:-1},{[route]:2}),o('buildTogether',work,{[who]:2}),...(run.flags.mentor?[o('delegate',{T:-1})]:[]),o('blueprint')];
 }
 case 'contact':{
  const far=run.remote[0],near=['A','B','C'].find(x=>!run.remote.includes(x));
  return [o('letter',{T:-1,M:-1,...(far?{[far]:1}:{})},{},{target:far,blocked:far?null:'noRemote'}),o('visit',{...work,[near]:1},{},{target:near}),o('later')];
 }
 case 'legacy':return ['workshop','garden','trail'].map(id=>o(id,{}, {},{legacy:id}));
 case 'memory':return [o('rememberBirth',{}, {},{memory:'birth'}),o('rememberHome',{}, {},{memory:'home'}),...(run.memories.length?[o('rememberChoice',{}, {},{memory:run.memories.at(-1).id})]:[])];
 default:throw Error('unknownEvent');
 }
}
export function actionOptions(run){
 if(run.finished||run.phase!=='actions')return [];
 const d=daily(run),fresh=!run.usedDaily?.length,o=(id,delta={},requires={},meta={})=>makeOption(run,id,delta,requires,meta);
 let energy=weather(run)!=='sun'&&!run.flags.shelter?2:1;
 const options=[o('explore',{T:-1,E:-energy,M:1+(d===4&&!run.usedDaily.includes('explore')?1:0),N:1}),o('craft',{T:-1,E:-1,M:d===3&&!run.usedDaily.includes('craft')?0:-1,W:1},{},{blocked:run.W===3?'craftFull':null}),o('rest',{T:-1,E:3+(d===5&&!run.usedDaily.includes('rest')?1:0)})];
 for(const person of ['A','B','C'])options.push(run.remote.includes(person)?o('company',{T:-1,M:-1,[person]:1},{},{target:person,remote:true}):o('company',{T:-1,E:-1,[person]:1+(d===6&&!run.usedDaily.includes('company:A')&&person==='A'?1:0)},{},{target:person}));
 for(const p of run.promises.filter(p=>p.state==='open')){
  options.push(o('fulfil',{T:-1,E:-1,[p.target]:2},{},{promise:p.id,target:p.target}));
  if(!p.rescheduled&&p.due+2<=12)options.push(o('reschedule',{}, {},{promise:p.id,target:p.target}));
 }
 if(true){
  if(d===7&&!run.usedDaily.includes('bookStudy'))options.push(o('bookStudy',{T:-1,E:-1,M:-1,N:1}));
  if(d===8&&!run.usedDaily.includes('farPath'))options.push(o('farPath',{T:-1,E:-energy-1,M:2,N:1}));
  if(d===9&&!run.usedDaily.some(x=>x.startsWith('lunch')))for(const person of ['A','B','C'].filter(p=>!run.remote.includes(p)))options.push(o('lunch',{T:-1,M:-1,[person]:1},{},{target:person}));
  if(d===10&&!run.usedDaily.includes('repairTools'))options.push(o('repairTools',{T:-1,E:-2,W:1},{},{blocked:run.W===3?'craftFull':null}));
  if(d===12&&!run.usedDaily.includes('walkTogether:B'))options.push(o('walkTogether',{T:-1,E:-energy,N:1,B:1},{},{blocked:run.remote.includes('B')?'notLocal':null,target:'B'}));
 }
 if(run.index===29&&run.legacy&&run.legacyWork<2&&run.season>=11){
  const first=run.legacyWork===0;
  const requires={workshop:{W:3,M:2},garden:{A:2,B:2},trail:{N:3}}[run.legacy];
  options.push(o('legacyWork',{T:-1,E:first?-1:0,...(first&&run.legacy==='workshop'?{M:-2}:{})},first?requires:{},{legacy:run.legacy}));
 }
 return options;
}
export const optionKey=o=>[o.id,o.branch||'',o.target||'',o.promise||''].join(':');
function pay(run,option){for(const [k,d] of Object.entries(option.delta))run[k]=cap(k,run[k]+d);}
function record(run,id,extra={}){run.actions.push({id,season:run.season,...extra});}
export function act(input,key,expectedRevision=input.revision){
 if(input.revision!==expectedRevision)throw Error('stale');
 const option=actionOptions(input).find(x=>optionKey(x)===key);if(!option||!option.available)throw Error('unavailable');
 const run=clone(input);pay(run,option);record(run,option.id,{target:option.target||null});
 if(['explore','craft','rest','company','bookStudy','farPath','lunch','repairTools','walkTogether'].includes(option.id))run.usedDaily.push(option.id+(option.target?':'+option.target:''));
 if(['company','letter'].includes(option.id)&&option.remote)run.flags.letter=true;
 if(option.id==='fulfil'){const p=run.promises.find(p=>p.id===option.promise);p.state='fulfilled';p.completed=run.season;run.flags.fulfilled=(run.flags.fulfilled||0)+1;if(p.rescheduled)run.flags.fulfilledRescheduled=true;}
 if(option.id==='reschedule'){const p=run.promises.find(p=>p.id===option.promise);p.due+=2;p.rescheduled=true;}
 if(option.id==='legacyWork')run.legacyWork++;
 run.revision++;return run;
}
export function choose(input,key,expectedRevision=input.revision){
 if(input.revision!==expectedRevision)throw Error('stale');
 const event=currentEvent(input),option=eventOptions(input).find(x=>optionKey(x)===key);if(!event||!option||!option.available)throw Error('unavailable');
 const run=clone(input);pay(run,option);
 const flag={id:event.id+(run.eventStep?'-promise':''),family:event.family,choice:option.id,target:option.target,branch:option.branch||null,season:run.season,echoSeason:event.echoSeason,location:run.location};
 run.memories.push(flag);
 switch(event.family){
 case 'gift':if(option.id==='makeTogether')run.flags.madeTogether=true;break;
 case 'invite':if(option.branch){run.selected=option.target;run.flags.invited=true;}break;
 case 'promise':if(option.people){for(const p of option.people)run.promises.push({id:flag.id+'-'+p,target:p,due:Math.min(12,run.season+2),state:'open',rescheduled:false});}else run.flags.declinedPromise=true;break;
 case 'repair':if(option.id!=='leave'){run.flags.repaired=true;run.flags.repairAuthor=option.target;if(option.id==='repairHelp'){run.flags.usedHelp=true;run.help=null;}}break;
 case 'move':run.flags.moveChoice=true;if(option.id==='move'){run.flags.moved=true;run.remote=['A'];run.location=run.index===11||run.index===22?1:3;}else run.remote=['C'];break;
 case 'weather':if(option.id==='shelter')run.flags.shelter=true;if(option.id==='supplies')run.flags.supplies=true;break;
 case 'mentor':if(option.id.startsWith('mentor')){run.flags.mentor=option.id;run.flags.apprentice=option.target;}break;
 case 'allocate':if(option.id!=='keep'){run.allocated=option.target;run.flags.allocation=true;}break;
 case 'boundary':if(option.id==='ownTime')run.flags.ownTime=true;break;
 case 'build':if(option.id!=='blueprint'){run.flags.built=true;run.flags.buildAuthor=option.id==='delegate'?'apprentice':option.target;if(option.id==='delegate')run.flags.delegated=true;}break;
 case 'contact':if(option.id==='letter')run.flags.letter=true;break;
 case 'legacy':run.legacy=option.legacy;break;
 case 'memory':run.flags.memory=option.memory;break;
 }
 if(run.index===24&&run.eventSlot===1&&run.eventStep===0){run.eventStep=1;}
 else {run.phase='actions';run.eventStep=0;}
 run.revision++;return run;
}
export function duePromises(run){return run.promises.filter(p=>p.state==='open'&&p.due<=run.season);}
export function endSeason(input,{allowMiss=false}={}){
 if(input.phase!=='actions'||input.finished)throw Error('unavailable');
 if(duePromises(input).length&&!allowMiss)throw Error('confirmMiss');
 const run=clone(input);
 for(const p of duePromises(run)){p.state='missed';run[p.target]=Math.max(0,run[p.target]-1);record(run,'missed',{promise:p.id,target:p.target});}
 for(const m of run.memories.filter(x=>x.echoSeason===run.season&&!run.echoes.some(e=>e.id===x.id))){
  const promise=run.promises.filter(p=>p.id.startsWith(m.id));
  const response=m.family==='promise'?promise.length?(promise.every(p=>p.state==='fulfilled')?'fulfilled':promise.some(p=>p.state==='open')?'rescheduled':'missed'):'declined':m.choice;
  run.echoes.push({...m,response,observedSeason:run.season});
  if(m.family==='allocate'&&m.choice!=='keep')run.help=m.target;
 }
 if(run.season===12){run.finished=true;run.phase='result';run.wish=wishMet(run);}
 else {run.season++;run.T=2;run.usedDaily=[];if([2,6,10].includes(run.season)){run.phase='event';run.eventSlot=[2,6,10].indexOf(run.season);}else run.phase='actions';}
 run.revision++;return run;
}
export function wishMet(r){
 const f=r.flags,actions=id=>r.actions.some(a=>a.id===id),count=f.fulfilled||0;
 return !![
 ()=>f.madeTogether&&r.A>=2,()=>count>=1,()=>f.invited&&r[r.selected]>=3,()=>f.repaired&&actions('rest'),()=>f.invited&&f.built,
 ()=>r.B>=2&&r.A>=1,()=>f.ownTime&&r.W>=2,()=>f.usedHelp&&f.repaired,()=>f.fulfilledRescheduled,()=>count>=1&&(count>=2||r.promises.length===1||f.declinedPromise),
 ()=>f.mentor&&(r.W>=2||r.N>=2),()=>f.moveChoice&&['A','B','C'].some(p=>!r.remote.includes(p)&&r[p]>=2),()=>f.moved&&f.letter&&r.B>=2,()=>r.N>=2&&(f.shelter||f.supplies),()=>f.moveChoice&&f.built,
 ()=>r.W>=2&&f.built,()=>r.N>=2&&f.mentor&&count>=1,()=>f.repaired&&f.invited&&f.built,()=>f.built&&f.ownTime,()=>f.mentor&&f.delegated,
 ()=>f.shelter&&r.M>=2,()=>f.allocation&&count>=1,()=>f.moved&&f.letter&&f.built,()=>!f.repaired&&f.mentor,()=>(f.shelter||f.supplies)&&count>=1,
 ()=>f.invited&&f.mentor&&f.memory,()=>f.moved&&f.letter&&f.built,()=>r.W>=2&&f.mentor&&f.ownTime,()=>['A','B','C'].filter(p=>r[p]>=2).length>=2&&f.memory,()=>r.legacyWork===2
 ][r.index]();
}
export function settle(input,run,{replace=null}={}){
 if(!run.finished)throw Error('unfinished');
 const save=clone(input),id=chapter(run.index).id;
 const page=save.album[id]||{runs:[],seen:[],wish:false};
 const runKey=run.id+'-'+run.memories.map(m=>[m.choice,m.target].join('.')).join('-');
 if(page.runs.some(x=>x.key===runKey)){save.run=null;return save;}
 if(page.runs.length>=3){if(!Number.isInteger(replace)||replace<0||replace>=3)throw Error('chooseReplacement');page.runs.splice(replace,1);}
 page.runs.push({key:runKey,seed:run.seed,name:run.names[0],names:clone(run.names),species:run.species,wish:run.wish,echoes:clone(run.echoes),promises:clone(run.promises),flags:clone(run.flags),legacy:run.legacy,legacyWork:run.legacyWork,location:run.location});
 page.seen=[...new Set([...page.seen,...run.memories.map(m=>m.id+':'+m.choice+':'+(m.target||''))])];page.wish ||=run.wish;
 save.album[id]=page;if(!save.cleared.includes(id))save.cleared.push(id);save.run=null;save.selected=Math.min(29,run.index+1);save.revision++;return save;
}
export const unlocked=save=>Math.min(30,save.cleared.length+1);
export const roomsUnlocked=save=>Math.floor(save.cleared.length/5);
export function setDisplay(input,slot,stageId){
 if(!Number.isInteger(slot)||slot<0||slot>=roomsUnlocked(input)*5)throw Error('locked');
 if(stageId!==null&&!input.album[stageId])throw Error('unowned');
 const save=clone(input);if(stageId)save.displays=save.displays.map(x=>x===stageId?null:x);save.displays[slot]=stageId;save.revision++;return save;
}
export function setCosmetic(input,id,on,owns){
 const item=COSMETICS.find(x=>x.id===id);if(!item||!owns(`smallwood-lives:${id}`))throw Error('unowned');
 const save=clone(input);save.cosmetics=save.cosmetics.filter(x=>x!==id);if(on)save.cosmetics.push(id);save.revision++;return save;
}
export function validateSave(s){
 if(!s||s.schema!==1||!Number.isSafeInteger(s.revision)||!Array.isArray(s.cleared)||!s.album||!Array.isArray(s.displays)||s.displays.length!==30||!Array.isArray(s.cosmetics))throw Error('saveCorrupt');
 if(new Set(s.cleared).size!==s.cleared.length||s.cleared.some((id,i)=>id!==chapter(i).id))throw Error('saveCorrupt');
 if(s.run){const r=s.run;chapter(r.index);for(const [k,max] of Object.entries(LIMITS))if(!Number.isInteger(r[k])||r[k]<0||r[k]>max)throw Error('saveCorrupt');if(!Number.isInteger(r.season)||r.season<1||r.season>12||!Array.isArray(r.memories)||!Array.isArray(r.promises)||!Array.isArray(r.daily)||!Array.isArray(r.usedDaily)||!Array.isArray(r.actions)||!Array.isArray(r.echoes)||!Array.isArray(r.names)||r.names.length!==4||!Array.isArray(r.remote)||!r.flags||!['actions','event','result'].includes(r.phase))throw Error('saveCorrupt');}
 return s;
}
// Fail closed: no silent save reset, no progression commit before durable write.
export function createStore(storage,locks=globalThis.navigator?.locks){
 let current=null;
 const read=()=>{const raw=storage.getItem(SAVE_KEY);return raw?validateSave(JSON.parse(raw)):emptySave();};
 return {
  load(){current=read();return clone(current);},
  async transact(update){
   const work=async()=>{const latest=read();if(current&&latest.revision!==current.revision){current=latest;throw Error('otherTab');}const next=validateSave(await update(clone(latest)));next.revision=latest.revision+1;const serialized=JSON.stringify(next);storage.setItem(SAVE_KEY,serialized);if(storage.getItem(SAVE_KEY)!==serialized)throw Error('saveFailed');current=next;return clone(next);};
   if(!locks?.request)throw Error('lockUnavailable');
   return locks.request(SAVE_KEY,{mode:'exclusive'},work);
  }
 };
}
