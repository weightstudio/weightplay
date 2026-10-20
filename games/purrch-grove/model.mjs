export const STORE='weightplay.purrch-grove.v1';
export const ACTIONS=['feed','groom','feather','scratch','rest'];
export const PERSONALITIES=['playful','thoughtful','gentle','curious'];
export const FURNITURE={tree:{cost:45,max:3},bed:{cost:35,max:3},feather:{cost:25,max:3}};
export const ADOPTION=[{goal:5,cost:40,trust:18,personality:1},{goal:10,cost:65,trust:42,personality:2},{goal:20,cost:90,trust:90,personality:3}];
const clamp=(v,lo=0,hi=100)=>Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):lo;
const cat=(id,p)=>({id,personality:p,food:65,joy:60,energy:75,clean:70,trust:0,growth:0,age:0,x:(id-1)*1.25-1.5,z:.8,action:null});
export function fresh(){return {schema:1,coins:80,cats:[cat(1,0)],selected:1,cleared:[],unlocked:1,levels:{tree:0,bed:0,feather:0},places:{tree:0,bed:1,feather:2},cushion:false,total:{},nextId:2};}
export function normalize(raw){
 const s=fresh();if(!raw||raw.schema!==1)return s;
 s.coins=Math.floor(clamp(raw.coins,0,999999));s.cleared=[...new Set((Array.isArray(raw.cleared)?raw.cleared:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=30))].sort((a,b)=>a-b);
 // Unlock only a contiguous completed chain; preserve all valid cleared history.
 while(s.unlocked<30&&s.cleared.includes(s.unlocked))s.unlocked++;
 for(const k of Object.keys(FURNITURE)){s.levels[k]=Math.floor(clamp(raw.levels?.[k],0,3));s.places[k]=Math.floor(clamp(raw.places?.[k],0,2));}
 s.cushion=raw.cushion===true;s.cats=[];const ids=new Set();
 for(const r of (Array.isArray(raw.cats)?raw.cats:[]).slice(0,4)){
  if(!r||!Number.isInteger(r.id)||r.id<1||ids.has(r.id))continue;ids.add(r.id);const d=cat(r.id,Math.floor(clamp(r.personality,0,3)));
  for(const k of ['food','joy','energy','clean','growth'])d[k]=clamp(r[k]);d.trust=clamp(r.trust,0,99999);d.age=clamp(r.age,0,999999);
  d.x=clamp(r.x,-2.8,2.8);d.z=clamp(r.z,-.4,2); // Incomplete care is cancelled, never rewarded on load.
  s.cats.push(d);
 }
 if(!s.cats.length)s.cats=[cat(1,0)];s.nextId=Math.max(...s.cats.map(d=>d.id))+1;s.selected=s.cats.some(d=>d.id===raw.selected)?raw.selected:s.cats[0].id;
 for(const [k,v]of Object.entries(raw.total||{}))if(/^[a-z]+$/.test(k))s.total[k]=Math.floor(clamp(v,0,999999));return s;
}
// Authored goals change action, ordering, resident, layout, energy or mastery decisions.
// Each step is an actual completed action after entry, never an injected resource.
export const GOALS=[
 ['welcome',['feed']],['gentleHands',['groom']],['firstChase',['feather']],['quietPaws',['scratch','rest']],['settled',['feed','groom','rest'],'well'],
 ['favourite',['preferred']],['catTree',['buy:tree','rest']],['homeSpot',['place:tree','preferred']],['routine',['routine']],['welcomeSlate',['adopt','scratch'],'two'],
 ['twoFriends',['distinct:2']],['slateChoice',['preferred:1']],['energyPlan',['rest','feather']],['softBed',['buy:bed','place:bed']],['balancedHome',['routine','preferred'],'well'],
 ['welcomeCream',['adopt','groom'],'three'],['gentleChoice',['preferred:2']],['toyCraft',['buy:feather','feather']],['quietCorner',['place:bed','rest']],['careCircle',['distinct:3'],'well'],
 ['growingUp',['mature']],['highRest',['rest:tree']],['trustChoice',['preferred','preferred:1','preferred:2']],['betterHome',['upgrade','routine']],['welcomeFourth',['adopt','preferred:3'],'four'],
 ['fourVoices',['distinct:4']],['roomPlan',['place:tree','place:bed','preferred:3']],['grownFamily',['mature','routine']],['sharedComfort',['distinct:4','rest:tree'],'well'],['groveCelebration',['routine','preferred','preferred:1','preferred:2','preferred:3','rest:tree'],'finale']
].map(([key,steps,check],i)=>({id:i+1,key,steps,check:check||'',reward:i%5===4?65:25,arc:Math.floor(i/5)}));
export function preferred(d){return ['feather','scratch','groom','feather'][d.personality];}
export class Grove{
 constructor(raw){this.s=normalize(raw);this.events=[];this.goal=0;this.step=0;this.seen=new Set();this.complete=false;this.lastEvent='';}
 get selected(){return this.s.cats.find(d=>d.id===this.s.selected)||this.s.cats[0];}
 start(id=0){if(id<0||id>this.s.unlocked||id>30)return false;this.goal=id;this.step=0;this.seen.clear();this.complete=false;this.lastEvent='';
  // Previously earned permanent prerequisites stay true. The next required
  // fresh action is shown directly, so an already-adopted cat never asks the
  // player to buy another kitten just to acknowledge existing progress.
  if(id){const g=GOALS[id-1];while(this.step<g.steps.length){const token=g.steps[this.step],owned=token.startsWith('buy:')?this.s.levels[token.slice(4)]>0:token==='upgrade'?Object.values(this.s.levels).some(v=>v>1):token==='adopt'?this.s.cats.length>=({10:2,16:3,25:4}[id]||2):false;if(!owned)break;this.step++;}}
  return true;}
 select(id){if(!this.s.cats.some(d=>d.id===id))return false;this.s.selected=id;return true;}
 emit(type,data={}){this.events.push({type,...data});}
 reject(reason){this.emit('error',{reason});return false;}
 act(kind){
  const d=this.selected;if(this.complete)return this.reject('result');if(d.action)return this.reject('busy');
  if(kind==='routine'){d.action={kind,remaining:9,total:9,part:0};this.emit('begin',{id:d.id,kind});return true;}
  if(!ACTIONS.includes(kind))return this.reject('invalid');
  if(kind==='feather'&&d.energy<20)return this.reject('tired');
  const total={feed:3,groom:3,feather:5,scratch:4,rest:5}[kind];d.action={kind,remaining:total,total};this.emit('begin',{id:d.id,kind});return true;
 }
 buy(kind){
  const item=FURNITURE[kind];if(!item)return this.reject('invalid');const level=this.s.levels[kind],cost=item.cost*(level+1);
  if(level>=item.max)return this.reject('max');if(this.s.coins<cost)return this.reject('coins');
  this.s.coins-=cost;this.s.levels[kind]++;this.emit('buy',{kind,cost,level:level+1});this.record(level?'upgrade':`buy:${kind}`);return true;
 }
 place(kind,spot){if(!FURNITURE[kind]||!Number.isInteger(spot)||spot<0||spot>2)return this.reject('invalid');if(!this.s.levels[kind])return this.reject('locked');
  if(this.s.places[kind]===spot)return this.reject('same');this.s.places[kind]=spot;this.emit('place',{kind,spot});this.record(`place:${kind}`);return true;
 }
 adopt(){
  const a=ADOPTION[this.s.cats.length-1];if(!a)return this.reject('max');if(!this.s.cleared.includes(a.goal)||this.s.cats.reduce((n,d)=>n+d.trust,0)<a.trust)return this.reject('locked');if(this.s.coins<a.cost)return this.reject('coins');
  this.s.coins-=a.cost;const d=cat(this.s.nextId++,a.personality);this.s.cats.push(d);this.s.selected=d.id;this.emit('adopt',{id:d.id});this.record('adopt',d);return true;
 }
 finish(d,kind,part=false){
  const isPref=kind===preferred(d),before=d.growth;
  if(kind==='feed'){d.food=clamp(d.food+40);d.growth=clamp(d.growth+8);}
  if(kind==='groom'){d.clean=clamp(d.clean+40);d.joy=clamp(d.joy+12);d.growth=clamp(d.growth+(isPref?12:6));}
  if(kind==='feather'){d.energy=clamp(d.energy-18);d.joy=clamp(d.joy+30+this.s.levels.feather*3);d.growth=clamp(d.growth+(isPref?16:8));}
  if(kind==='scratch'){d.joy=clamp(d.joy+22);d.energy=clamp(d.energy-6);d.growth=clamp(d.growth+(isPref?16:8));}
  if(kind==='rest'){d.energy=clamp(d.energy+40+this.s.levels.bed*5+(this.s.cushion?10:0));d.joy=clamp(d.joy+this.s.levels.tree*4);d.growth=clamp(d.growth+6);}
  d.trust+=isPref?6:3;const coins=['feather','scratch'].includes(kind)?(isPref?8:4):0;this.s.coins+=coins;
  this.s.total[kind]=(this.s.total[kind]||0)+1;this.emit('care',{id:d.id,kind,preferred:isPref,coins});this.record(kind,d);
  if(isPref)this.record(`preferred:${d.personality}`,d);
  if(kind==='rest'&&this.s.levels.tree)this.record('rest:tree',d);
  if(before<100&&d.growth>=100)this.emit('mature',{id:d.id});
  if(d.growth>=100)this.record('mature',d);
 }
 tick(seconds){
  if(this.complete)return;const dt=clamp(seconds,0,.1);
  for(const d of this.s.cats){
   d.age+=dt;d.food=clamp(d.food-dt*.12);d.clean=clamp(d.clean-dt*.07);d.joy=clamp(d.joy-dt*.06);
   if(!d.action)continue;const a=d.action;a.remaining=Math.max(0,a.remaining-dt);
   if(a.kind==='routine'){
    const elapsed=a.total-a.remaining;const phase=Math.min(3,Math.floor((elapsed+.00001)/3));
    while(a.part<phase){const k=['feed','groom','rest'][a.part++];this.finish(d,k,true);}
   }
   if(a.remaining<=.00001){d.action=null;if(a.kind==='routine'){this.emit('routine',{id:d.id});this.record('routine',d);}else this.finish(d,a.kind);}
  }
  this.check();
 }
 record(token,d=this.selected){
  if(!this.goal||this.complete)return;const g=GOALS[this.goal-1],want=g.steps[this.step];if(!want)return;
  let match=want===token||(want==='preferred'&&token===`preferred:${d.personality}`);
  if(want.startsWith('distinct:')&&ACTIONS.includes(token)){this.seen.add(d.id);match=this.seen.size>=Number(want.split(':')[1]);}
  if(want==='mature'&&this.s.cats.some(c=>c.growth>=100)&&ACTIONS.includes(token))match=true;
  // Owned prerequisites remain valid on replays; require a fresh care action to acknowledge.
  if(ACTIONS.includes(token)){
   if(want.startsWith('buy:')&&this.s.levels[want.slice(4)]>0)match=true;
   if(want==='upgrade'&&Object.values(this.s.levels).some(v=>v>1))match=true;
   if(want==='adopt'&&this.s.cats.length>=({10:2,16:3,25:4}[g.id]||2))match=true;
  }
  if(match){this.step++;this.seen.clear();this.lastEvent=token;this.emit('step',{step:this.step});}this.check();
 }
 check(){
  if(!this.goal||this.complete)return;const g=GOALS[this.goal-1];if(this.step<g.steps.length)return;
  const count={two:2,three:3,four:4}[g.check]||1;if(this.s.cats.length<count)return;
  if(['well','finale'].includes(g.check)&&!this.s.cats.every(d=>d.food>=40&&d.clean>=40&&d.energy>=35&&d.joy>=40))return;
  if(g.check==='finale'&&(this.s.cats.length<4||!this.s.cats.some(d=>d.growth>=100)))return;
  const first=!this.s.cleared.includes(g.id);if(first){this.s.cleared.push(g.id);this.s.coins+=g.reward;this.s.unlocked=Math.max(this.s.unlocked,Math.min(30,g.id+1));}
  this.complete=true;this.emit('complete',{id:g.id,reward:first?g.reward:0});
 }
 get next(){return this.goal?GOALS[this.goal-1].steps[this.step]||'well':'';}
}
