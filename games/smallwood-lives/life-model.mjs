import DATA from './demography.mjs';
import {newEnvironment,validEnvironment,environmentEvent,ENV_KEYS,LOCAL_SOURCES} from './life-environment.mjs';

export {DATA};
export const SAVE_KEY='weightplay.smallwood-lives.v2';
export const LEGACY_KEY='weightplay.smallwood-lives.v1';
export const HISTORY_LIMIT=60;
export const COUNTRIES=DATA.countries;
export const COUNTRY_BY_ID=new Map(COUNTRIES.map(c=>[c.iso3,c]));
export const THEMES=[{id:'warm-lamps',cost:3},{id:'moon-cabinet',cost:8},{id:'starlit-garden',cost:12}];
export const clone=value=>structuredClone(value);
const cumulative=[];let total=0;
for(const country of COUNTRIES){total+=country.pop;cumulative.push(total);}

// Independent keyed streams keep a locale, reading speed, or vignette change
// from affecting the demographic sample. No Math.random() in the model.
export function random(seed,key=0){
 let n=(seed^Math.imul(key+1,0x9e3779b9))>>>0;
 n=Math.imul(n^(n>>>16),0x21f0aaad);n=Math.imul(n^(n>>>15),0x735a2d97);
 return ((n^(n>>>15))>>>0)/4294967296;
}
export function sampleCountry(u){
 if(!Number.isFinite(u)||u<0||u>=1)throw Error('invalidSample');
 const target=u*total;let lo=0,hi=cumulative.length-1;
 while(lo<hi){const mid=(lo+hi)>>1;if(target<cumulative[mid])hi=mid;else lo=mid+1;}
 return COUNTRIES[lo];
}
export function annualMortality(country,age){
 if(!Number.isInteger(age)||age<0)throw Error('invalidAge');
 const band=country.life.find(([x,n])=>age>=x&&(n<0||age<x+n));
 if(!band)throw Error('missingAgeBand');
 return band[1]<0?-Math.expm1(-band[3]):-Math.expm1(Math.log1p(-band[2])/band[1]);
}
export function causeWeights(country,age){
 let band=DATA.ageBands.findLastIndex(x=>age>=x);
 const weights=[...country.causes[band]];
 // WHO's under-five cause band does not distinguish single-year ages.
 // Avoid impossible newborn/SIDS labels in older simulated children.
 if(age>=1){weights[7]=0;weights[17]=0;}
 if(age<10)weights[6]=0;
 const sum=weights.reduce((a,b)=>a+b,0);
 return weights.map(x=>x/sum);
}
export function sampleCause(country,age,u){
 const weights=causeWeights(country,age);let cumulative=0;
 for(let i=0;i<weights.length;i++){cumulative+=weights[i];if(u<cumulative)return DATA.causeKeys[i];}
 return DATA.causeKeys.at(-1);
}
const storyAges=[1,3,8,14,20,28,37,46,55,64,73,84,96];
export function storyAt(run,age){
 if(age===0)return {age:0,key:'birth',kind:'story'};
 if(run.version===3)return environmentEvent(run,age,key=>random(run.seed,key));
 const factAt={5:'water',17:'sanitation',32:'electricity',45:'urban'}[age];
 if(factAt&&Number.isFinite(COUNTRY_BY_ID.get(run.country).facts[factAt]))return {age,key:factAt,kind:'context'};
 const index=storyAges.findIndex((base,i)=>age===base+(i>1?Math.floor(random(run.seed,400+i)*3):0));
 if(index<0)return null;
 return {age,key:index*2+(random(run.seed,500+index)<.5?0:1),kind:'story'};
}
export function newLife(seed,id){
 seed=seed>>>0;
 const country=sampleCountry(random(seed,0));
 const home={};for(const key of ['urban','water','sanitation','electricity']){
  home[key]=Number.isFinite(country.facts[key])?random(seed,20+Object.keys(home).length)<country.facts[key]/100:null;
 }
 return {id,seed,country:country.iso3,age:0,finished:false,cause:null,home,
  environment:newEnvironment(country,key=>random(seed,key)),
  events:[{age:0,key:'birth',kind:'story'}],version:3};
}
export function advanceLife(run){
 if(run.finished)return clone(run);
 const next=clone(run),country=COUNTRY_BY_ID.get(run.country);
 if(random(run.seed,1000+run.age)<annualMortality(country,run.age)){
  next.finished=true;next.cause=sampleCause(country,run.age,random(run.seed,2000+run.age));
 }else{
  next.age++;const story=storyAt(next,next.age);if(story)next.events.push(story);
 }
 return next;
}
export function emptySave(){return {schema:2,revision:0,run:null,history:[],total:0,countryCounts:{},speed:1,theme:null};}
export function settle(save){
 if(!save.run?.finished)return save;
 const r=save.run;
 if(save.history.some(x=>x.id===r.id))return save;
 save.total++;save.countryCounts[r.country]=(save.countryCounts[r.country]||0)+1;
 save.history.unshift(clone(r));save.history.length=Math.min(save.history.length,HISTORY_LIMIT);
 return save;
}
function validRun(r){
 if(!r||![2,3].includes(r.version)||typeof r.id!=='string'||r.id.length>100||!COUNTRY_BY_ID.has(r.country)||!Number.isInteger(r.seed)||r.seed<0||r.seed>0xffffffff||!Number.isInteger(r.age)||r.age<0||r.age>10000||typeof r.finished!=='boolean'||!Array.isArray(r.events)||r.events.length>40||!r.home)throw Error('saveCorrupt');
 if(r.version===3&&!validEnvironment(r.environment))throw Error('saveCorrupt');
 if(r.finished&&!DATA.causeKeys.includes(r.cause))throw Error('saveCorrupt');
 if(!r.finished&&r.cause!==null)throw Error('saveCorrupt');
 for(const key of ['urban','water','sanitation','electricity'])if(r.home[key]!==null&&typeof r.home[key]!=='boolean')throw Error('saveCorrupt');
 for(const e of r.events){
  if(!Number.isInteger(e.age)||e.age<0||e.age>r.age)throw Error('saveCorrupt');
  if(e.kind==='environment'){
   if(r.version!==3||!ENV_KEYS.has(e.key)||(e.key.startsWith('local')&&!Object.hasOwn(LOCAL_SOURCES,r.country)))throw Error('saveCorrupt');
  }else if(!['story','context'].includes(e.kind)||!(Number.isInteger(e.key)&&e.key>=0&&e.key<26||['birth','urban','water','sanitation','electricity'].includes(e.key)))throw Error('saveCorrupt');
 }
 if(r.events[0]?.key!=='birth'||r.events[0]?.age!==0||r.events.some((e,i)=>i>0&&e.age<=r.events[i-1].age))throw Error('saveCorrupt');
 for(const e of r.events)if(e.kind!=='environment'&&(e.kind==='context'?!['urban','water','sanitation','electricity'].includes(e.key):!(e.key==='birth'||Number.isInteger(e.key))))throw Error('saveCorrupt');
 return r;
}
export function validateSave(s){
 if(!s||s.schema!==2||!Number.isSafeInteger(s.revision)||s.revision<0||!Number.isSafeInteger(s.total)||s.total<0||!Array.isArray(s.history)||s.history.length>HISTORY_LIMIT||!s.countryCounts||Array.isArray(s.countryCounts)||![1,2,4].includes(s.speed)||!(s.theme===null||THEMES.some(x=>x.id===s.theme)))throw Error('saveCorrupt');
 if(s.run)validRun(s.run);
 s.history.forEach(r=>{validRun(r);if(!r.finished)throw Error('saveCorrupt');});
 for(const [iso,count] of Object.entries(s.countryCounts))if(!COUNTRY_BY_ID.has(iso)||!Number.isSafeInteger(count)||count<1)throw Error('saveCorrupt');
 if(Object.values(s.countryCounts).reduce((a,b)=>a+b,0)!==s.total)throw Error('saveCorrupt');
 if(new Set(s.history.map(r=>r.id)).size!==s.history.length||s.history.length>Math.min(s.total,HISTORY_LIMIT))throw Error('saveCorrupt');
 return s;
}
export function readLegacy(storage){
 const raw=storage.getItem(LEGACY_KEY);if(!raw)return null;
 try{const s=JSON.parse(raw);if(s.schema!==1||!Array.isArray(s.cleared)||!s.album||typeof s.album!=='object')throw Error();
  return {cleared:s.cleared.length,album:s.album,cosmetics:Array.isArray(s.cosmetics)?s.cosmetics:[],run:s.run,corrupt:false};
 }catch{return {corrupt:true};}
}
export function createStore(storage,locks=globalThis.navigator?.locks){
 let current;
 const read=()=>{try{const raw=storage.getItem(SAVE_KEY);return raw?validateSave(JSON.parse(raw)):emptySave();}catch(e){if(e.message==='saveCorrupt'||e instanceof SyntaxError)throw Error('saveCorrupt');throw Error('saveFailed');}};
 return {
  load(){current=read();return clone(current);},
  async transact(update){
   if(!locks?.request)throw Error('lockUnavailable');
   return locks.request(SAVE_KEY,{mode:'exclusive'},async()=>{
    const latest=read();if(current&&latest.revision!==current.revision)throw Error('otherTab');
    const next=validateSave(await update(clone(latest)));next.revision=latest.revision+1;
    const raw=JSON.stringify(next);
    try{storage.setItem(SAVE_KEY,raw);if(storage.getItem(SAVE_KEY)!==raw)throw Error();}catch{throw Error('saveFailed');}
    current=next;return clone(next);
   });
  }
 };
}
