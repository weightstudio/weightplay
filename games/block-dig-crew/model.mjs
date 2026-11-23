export const SAVE_KEY = 'weightplay.block-dig-crew';
export const MAX_COINS = 1e12;
export const MAX_TOOLS = 20;
export const MAX_WORKERS = 6;
export const WORKER_LEVEL = 8;
export const WORKSHOP = [
  {level:12, cost:10000, period:4800, multiplier:1},
  {level:20, cost:70000, period:2850, multiplier:1.35},
  {level:32, cost:360000, period:1650, multiplier:1.8},
];
export const MAX_LEVEL = 50;
export const STACK = 99;
export const BAG_SLOTS = 30;
export const LANDS = [
  {level:1, rate:1, quality:[0,0,0,0,0], colors:[0x82c553,0xc89960,0x705143,0xc5efec]},
  {level:5, rate:1.5, quality:[-5,4,1,0,0], colors:[0xe5a766,0xc26946,0x8b4945,0xffe2b0]},
  {level:12, rate:2.3, quality:[-14,3,10,1,0], colors:[0x87b3e5,0x7275ad,0x47426d,0xdce7ff]},
  {level:22, rate:3.5, quality:[-19,1,7,10,1], colors:[0xf09666,0x77556f,0x47364e,0xfde2cb]},
  {level:35, rate:5, quality:[-25,1,11,11,2], colors:[0xb9dcd2,0x7da4b6,0x6166a4,0xd9eefe]},
];
export const TIERS = [
  {value:5, delay:1200, level:10, cost:500},
  {value:9, delay:1000, level:20, cost:4500},
  {value:17, delay:900, level:30, cost:32000},
  {value:32, delay:780, level:40, cost:200000},
  {value:56, delay:720},
];
export const PRICES = [10,40,150,800,5000];
export const TREASURES = ['quartz','emerald','sapphire','ruby','prism','relic'];
export const TALENTS = [
  ['gold','double','chain'], ['cool','sweep','discount'],
  ['find','quality','trade'], ['startAuto','speedAuto','autoDouble'],
];
const nodes = TALENTS.flat();
export const talentMax = id => TALENTS.some(branch=>branch[0]===id) ? 5 : 3;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const cap = (n, hi = MAX_COINS) => clamp(Math.floor(Number.isFinite(n) ? n : 0), 0, hi);
export const xpStep = level => 10 + 3*level;
export const buyCost = count => Math.ceil(50 * 1.55**(count-1));
export const levelMultiplier = level => 1 + .15*(level-1);
export const coinValue = (tool, land, s) => TIERS[tool.tier].value * levelMultiplier(tool.level) * LANDS[land].rate * (1+.05*rank(s,'gold')+.01*collection(s));
export const cooldown = (tool,s) => Math.round(TIERS[tool.tier].delay*(1-Math.min(.60,.03*rank(s,'cool'))));
export const rank = (s,id) => s.talents[id] ?? 0;
export const upgradeCost = (tool,s) => Math.ceil(20*1.22**(tool.level-1)*(1-.07*rank(s,'discount')));
export const resetCost = s => 100+25*(s.level-1);
export const unspent = s => s.level-1-nodes.reduce((n,id)=>n+rank(s,id),0);
export const collection = s => s.seen.filter(Boolean).length;
export const gemPrice = (s,i) => Math.round(PRICES[i]*(1+.1*rank(s,'trade')));
export const gemChance = (s,tool) => Math.min(.45,.05+.012*rank(s,'find')+(tool.tier>=3?.015:0));
export const autoInterval = s => rank(s,'startAuto') ? Math.max(6,30 - 4*(rank(s,'startAuto')-1)-3*rank(s,'speedAuto'))*1000 : Infinity;
export const workerCost = count => Math.ceil(2500 * 2.2**count);
export const workerPeriod = s => 5000 - 800*s.workshop;
export const drillPeriod = 8500;
export const workshopStage = s => WORKSHOP[s.workshop-1];
export const workshopPeriod = (s,stage) => Math.round(stage.period*(1-.05*Math.max(0,rank(s,'speedAuto')-1)));
export const workshopMultiplier = (s,stage) => stage.multiplier+.05*Math.max(0,rank(s,'startAuto')-1);
export const workerTool = (s,id) => ({id:-id, tier:s.workshop>=2?2:1, level:12+4*s.workshop});
export function workshopRequirements(s) {
  const next=WORKSHOP[s.workshop];
  if(!next)return null;
  if(s.level<next.level)return {key:'crewLevel',n:next.level};
  if(!s.workshop&&!rank(s,'speedAuto'))return {key:'needs',name:'speedAuto'};
  return {cost:next.cost};
}
export const gemOdds = (s,tool,land) => {
  const boost=rank(s,'quality')+(tool.tier>=3?2:0);
  return [70,20,8,1.8,.2].map((v,i)=>v+LANDS[land].quality[i]+[-3,1,1,.8,.2][i]*boost);
};
export const gemCount = s => s.bag.reduce((a,b)=>a+b,0)+s.overflow.reduce((a,b)=>a+b,0);
export const occupied = s => s.bag.reduce((n,count)=>n+Math.ceil(count/STACK),0);
export function freshSave() {
  return {version:4,revision:0,coins:0,tools:[{id:1,level:1,tier:0}],digs:0,level:1,xp:0,workshop:0,workers:0,crewDigs:0,
    land:0, talents:{},bag:Array(5).fill(0),overflow:Array(5).fill(0),seen:Array(6).fill(false),
    skyDigs:0,tutorial:0,lesson:0,lessonRevision:1,reduced:false,flag:false,unlocked:1,clears:[]};
}
const object = x => x && typeof x==='object' && !Array.isArray(x);
const integers = (arr,len,max=MAX_COINS) => Array.isArray(arr)&&arr.length===len&&arr.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=max);
export function decodeSave(raw) {
  if (raw===null) return freshSave();
  const old=JSON.parse(raw);
  if (!object(old)||![1,2,3,4].includes(old.version)) throw Error('version');
  // V1 stored all stacks in a single array. V2 separates the overflow and
  // introduces a revision to reject writes from stale game windows.
  const earlier=old.version===1?{...freshSave(),...old,revision:0,overflow:Array(5).fill(0)}:old;
  const taught=old.version<3?{...earlier,lesson:Math.min(2,cap(old.digs)),lessonRevision:1}:old;
  const s=old.version<4?{...taught,version:4,workshop:0,workers:0,crewDigs:0}:old;
  const countTools=Array.isArray(s.tools)?s.tools.length:0;
  if (!integers([s.revision,s.coins,s.digs,s.level,s.xp,s.land,s.skyDigs,s.tutorial,s.unlocked,s.lesson],10)
      || s.level<1||s.level>100||s.land>=LANDS.length||s.level<LANDS[s.land].level||s.tutorial>5
      ||s.lesson>2||s.lessonRevision!==1||s.xp>=xpStep(s.level)||s.unlocked<1||s.unlocked>60||countTools<1||countTools>MAX_TOOLS
      ||!integers([s.workshop],1,WORKSHOP.length)||!integers([s.workers],1,MAX_WORKERS)
      ||!integers([s.crewDigs],1,s.digs)
      ||s.workshop>0&&s.level<workshopStage(s).level||s.workers>0&&s.level<WORKER_LEVEL
      || !s.tools.every((tool,i)=>object(tool)&&integers([tool.id,tool.level,tool.tier],3)
         &&tool.id===i+1&&tool.level>=1&&tool.level<=MAX_LEVEL&&tool.tier<TIERS.length
         && (tool.tier===0||tool.level>=TIERS[tool.tier-1].level))
      || !integers(s.bag,5)||!integers(s.overflow,5)||!Array.isArray(s.seen)||s.seen.length!==6
      ||s.seen.some(x=>typeof x!=='boolean')||!object(s.talents)
      ||Object.entries(s.talents).some(([id,n])=>!nodes.includes(id)||!integers([n],1,talentMax(id)))
      ||TALENTS.some(branch=>branch.some((id,i)=>i>0&&rank(s,id)&&!rank(s,branch[i-1])))
      ||unspent(s)<0||!Array.isArray(s.clears)||!integers(s.clears,s.clears.length,60)
      ||s.clears.some(n=>n<1||n>s.unlocked)||new Set(s.clears).size!==s.clears.length
      ||typeof s.reduced!=='boolean'||typeof s.flag!=='boolean') throw Error('invalid');
  if(old.version===1) {
    const counts=[...s.bag];s.bag.fill(0);
    for(let i=0;i<5;i++){const n=Math.min(counts[i],(BAG_SLOTS-occupied(s))*STACK);s.bag[i]=n;s.overflow[i]=counts[i]-n;}
  }
  if(occupied(s)>BAG_SLOTS) throw Error('capacity');
  return s;
}
export function makeStore(storage, locks) {
  let raw, state, failure=null;
  const reload=()=>{
    try {raw=storage().getItem(SAVE_KEY);state=decodeSave(raw);failure=null;}
    catch {failure='saveRead';state??=freshSave();}
    return failure===null;
  };
  reload();
  function commit(update) {
    if(failure) return {ok:false,key:failure};
    try {
      const target=storage(), actual=target.getItem(SAVE_KEY);
      if(actual!==raw) {
        reload();
        return {ok:false,key:failure??'saveStale'};
      }
      const next=structuredClone(state), result=update(next);
      if(!result?.ok) return result??{ok:false,key:'unavailable'};
      next.revision=state.revision+1;
      const payload=JSON.stringify(next);
      decodeSave(payload);
      target.setItem(SAVE_KEY,payload);
      raw=payload;state=next;
      return result;
    } catch {return {ok:false,key:'saveWrite'};}
  }
  return {get state(){return state;},get failure(){return failure;},reload,
    write(update){
      return locks?.request ? locks.request(SAVE_KEY,()=>commit(update)).catch(()=>({ok:false,key:'saveWrite'}))
        : Promise.resolve(commit(update));
    }};
}
const ok = (extra={})=>({ok:true,...extra});
const reject = key=>({ok:false,key});
function credit(s,n){const value=Math.min(MAX_COINS-s.coins,cap(n));s.coins+=value;return value;}
function spend(s,n){if(s.coins<n)return false;s.coins-=n;return true;}
export function upgradeWorkshop(s){
  const next=workshopRequirements(s);
  if(!next?.cost)return reject('unavailable');
  if(!spend(s,next.cost))return reject('notEnough');
  s.workshop++;
  return ok();
}
export function hireWorker(s){
  if(s.level<WORKER_LEVEL||s.workers>=MAX_WORKERS)return reject('unavailable');
  if(!spend(s,workerCost(s.workers)))return reject('notEnough');
  s.workers++;
  return ok();
}
export function buy(s){
  if(s.tools.length>=MAX_TOOLS)return reject('maxTools');
  if(!spend(s,buyCost(s.tools.length)))return reject('notEnough');
  s.tools.push({id:s.tools.length+1,level:1,tier:0});
  if(s.tutorial===1)s.tutorial=2;
  return ok();
}
export function upgrade(s,id){
  let count=0;
  for(const tool of s.tools){
    if((id===null||id===tool.id)&&tool.level<MAX_LEVEL&&spend(s,upgradeCost(tool,s))){
      tool.level++;count++;
    }
  }
  if(count&&s.tutorial===2)s.tutorial=3;
  return count?ok({count}):reject('noUpgrade');
}
export function evolve(s,id){
  const tool=s.tools.find(t=>t.id===id);
  if(!tool)return reject('unavailable');
  const tier=TIERS[tool.tier];
  if(!tier.level||tool.level<tier.level)return reject('unavailable');
  if(!spend(s,tier.cost))return reject('notEnough');
  tool.tier++;
  return ok();
}
export function learn(s,id){
  const branch=TALENTS.find(b=>b.includes(id));
  if(!branch||rank(s,id)>=talentMax(id)||unspent(s)<=0)return reject('unavailable');
  const i=branch.indexOf(id);
  if(i>0&&!rank(s,branch[i-1]))return reject('unavailable');
  s.talents[id]=rank(s,id)+1;
  if(s.tutorial===3)s.tutorial=4;
  return ok();
}
export function reset(s){
  if(!nodes.some(id=>rank(s,id)))return reject('unavailable');
  if(!spend(s,resetCost(s)))return reject('notEnough');
  s.talents={};
  return ok();
}
export function saleQuote(s,i=null,all=true){
  const items=PRICES.map((_,j)=>i===null||i===j?Math.min(s.bag[j]+s.overflow[j],all?Infinity:1):0);
  return {items, count:items.reduce((a,b)=>a+b,0), value:Math.min(MAX_COINS-s.coins,items.reduce((sum,n,j)=>sum+n*gemPrice(s,j),0))};
}
export function sell(s,i=null,all=true,quote){
  const current=saleQuote(s,i,all);
  if(quote&&(current.count!==quote.count||current.value!==quote.value))return reject('saveStale');
  if(!current.count||!current.value||current.items.reduce((sum,n,j)=>sum+n*gemPrice(s,j),0)!==current.value)return reject('unavailable');
  current.items.forEach((n,j)=>{
    const fromOverflow=Math.min(n,s.overflow[j]);
    s.overflow[j]-=fromOverflow;s.bag[j]-=n-fromOverflow;
  });
  for(let j=0;j<5;j++) {
    const spare=Math.ceil(s.bag[j]/STACK)*STACK-s.bag[j]+(BAG_SLOTS-occupied(s))*STACK;
    const n=Math.min(spare,s.overflow[j]);s.overflow[j]-=n;s.bag[j]+=n;
  }
  credit(s,current.value);return ok(current);
}
function gem(s,index) {
  s.seen[index]=true;
  if(s.bag[index]%STACK!==0||occupied(s)<BAG_SLOTS){s.bag[index]++;return false;}
  s.overflow[index]=cap(s.overflow[index]+1);
  return true;
}
export function dig(s,{tool,land,streak=0,neighbor=false,automatic=false,multiplier=1,rng=Math.random}){
  if(!TIERS[tool?.tier]||!LANDS[land]||!integers([tool.level],1,MAX_LEVEL)||tool.level===0)return reject('unavailable');
  const chance=Math.min(.50,.05*rank(s,'double')+(automatic?.07*rank(s,'autoDouble'):0));
  const double=rng()<chance;
  const chain=automatic?1:1+.05*rank(s,'chain')*Math.min(4,Math.floor(streak/4));
  const area=neighbor&&tool.tier>=2?1.2+.10*rank(s,'sweep'):1;
  const earned=credit(s,Math.round(coinValue(tool,land,s)*chain*area*multiplier*(double?2:1)));
  s.digs=cap(s.digs+1);
  if(automatic)s.crewDigs=cap(s.crewDigs+1);
  if(s.level<100&&(!automatic||s.crewDigs%4===0)) {
    s.xp++;
    if(s.xp>=xpStep(s.level)){s.xp=0;s.level++;}
  }
  let drop=null,overflow=false,relic=false;
  if(rng()<gemChance(s,tool)) {
    let roll=rng()*100;
    drop=gemOdds(s,tool,land).findIndex(p=>(roll-=p)<0);
    if(drop<0)drop=4;
    overflow=gem(s,drop);
  }
  if(land===4){
    s.skyDigs=cap(s.skyDigs+1);
    if(!s.seen[5]&&(s.skyDigs>=120||rng()<.009)){s.seen[5]=true;relic=true;}
  }
  if(s.tutorial===0)s.tutorial=1;
  if(!automatic&&tool.id===1&&s.lesson<2)s.lesson++;
  return ok({earned,double,drop,overflow,relic});
}
export function crewShift(s,{land,tools=[],workers=[],nearby=[],rng=Math.random}){
  if(!LANDS[land]||s.level<LANDS[land].level)return reject('unavailable');
  const stage=workshopStage(s), hits=[];
  const multiplier=stage?workshopMultiplier(s,stage):1;
  let pulse=!!rank(s,'startAuto')&&!stage;
  for(const id of new Set(tools)){
    const tool=s.tools[id-1];
    if(!tool||tool.id!==id||(!stage&&tool.tier!==4&&!pulse))continue;
    hits.push({...dig(s,{tool,land,neighbor:nearby.includes(id),automatic:true,multiplier,rng}),id});
    if(tool.tier!==4)pulse=false;
  }
  for(const id of new Set(workers)){
    if(!Number.isInteger(id)||id<1||id>s.workers)continue;
    hits.push({...dig(s,{tool:workerTool(s,id),land,automatic:true,multiplier,rng}),id:-id});
  }
  return hits.length?ok({hits}):reject('unavailable');
}
export function switchLand(s,land) {
  if(!LANDS[land]||s.level<LANDS[land].level)return reject('unavailable');
  s.land=land;
  return ok();
}
export function clear(s,id) {
  if(!integers([id],1,60)||id<1||id>s.unlocked)return reject('unavailable');
  if(s.clears.includes(id))return ok({reward:0});
  s.clears.push(id);
  s.unlocked=Math.max(s.unlocked,Math.min(60,id+1));
  return ok({reward:credit(s,15+4*id)});
}
