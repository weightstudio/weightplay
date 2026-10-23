export const SAVE_KEY = 'weightplay-orchard-steward-v6';
export const FRUITS = [
  {id:'apple', color:0xe2543c, bands:[[2,7],[3,7],[2,8]]},
  {id:'pear', color:0xc8d94e, bands:[[1,6],[4,8],[3,8]]},
  {id:'orange', color:0xffa133, bands:[[4,8],[2,6],[3,8]]},
];
export const TOOLS = [
  {id:'water', delta:[-1,3,0], cue:'water.splash', art:'rain'},
  {id:'compost', delta:[0,-1,3], cue:'impact.soft', art:'shade'},
  {id:'canopy', delta:[2,-2,1], cue:'board.move', art:'sun'},
];
export const WEATHER = {
  mild:{delta:[0,-1,0]}, rain:{delta:[-1,2,-1]}, sun:{delta:[1,-2,0]},
  breeze:{delta:[-1,-1,0]}, bloom:{delta:[0,0,-1],growth:2}, heat:{delta:[2,-2,-1]},
};
export const CONTRACTS = [
  {id:'first', total:12, fruit:null, quota:0, weather:['mild','rain','sun','breeze','bloom','rain','sun','mild']},
  {id:'rainy', total:14, fruit:1, quota:6, weather:['rain','mild','rain','breeze','bloom','rain','sun','mild']},
  {id:'sunny', total:14, fruit:2, quota:6, weather:['sun','mild','heat','rain','bloom','sun','breeze','mild']},
  {id:'festival', total:18, fruit:'all', quota:6, weather:['breeze','rain','sun','heat','bloom','rain','breeze','mild']},
];
const integer = (value, max, fallback=0) => Number.isFinite(Number(value)) ? Math.max(0,Math.min(max,Math.floor(Number(value)))) : fallback;
export const clone = value => JSON.parse(JSON.stringify(value));
export const clamp = n => Math.max(0,Math.min(8,n));
export function contract(run) {return CONTRACTS[run.contract];}
export function forecast(run) {return WEATHER[contract(run).weather[run.day-1]];}
export function healthy(values,index) {return FRUITS[index].bands.every(([lo,hi],i)=>values[i]>=lo&&values[i]<=hi);}
export function projected(run) {return run.resources.map((n,i)=>clamp(n+forecast(run).delta[i]));}
export function goalMet(run) {
  const c=contract(run);
  return run.harvest.reduce((a,b)=>a+b,0)>=c.total && (c.fruit===null ||
    (c.fruit==='all'?run.harvest.every(n=>n>=c.quota):run.harvest[c.fruit]>=c.quota));
}
export function createProfile(legacy=0) {
  return {version:1,coins:0,best:0,completed:0,compost:false,crates:false,gold:false,legacyBest:integer(legacy,3),run:null};
}
export function normalize(raw,legacy=0) {
  let data;try{data=typeof raw==='string'?JSON.parse(raw):raw;}catch{return createProfile(legacy);}
  if(!data || data.version!==1) return createProfile(legacy);
  const profile=createProfile(legacy);
  for(const key of ['coins','best','completed']) profile[key]=integer(data[key],1_000_000);
  for(const key of ['compost','crates','gold']) profile[key]=data[key]===true;
  profile.legacyBest=Math.max(profile.legacyBest,integer(data.legacyBest,3));
  const r=data.run;
  if(r && Array.isArray(r.resources)&&r.resources.length===3 && Array.isArray(r.growth)&&r.growth.length===3 && Array.isArray(r.harvest)&&r.harvest.length===3) {
    profile.run={contract:integer(r.contract,3),day:integer(r.day,8,1)||1,actions:integer(r.actions,2),
      resources:r.resources.map(n=>integer(n,8,4)),growth:r.growth.map(n=>integer(n,2)),
      harvest:r.harvest.map(n=>integer(n,1000)),lastPicking:r.lastPicking===true&&Number(r.day)===8,
      ended:r.ended===true,won:r.won===true,selected:integer(r.selected,2),healthyDays:integer(r.healthyDays,8)};
    // Success is derived, never trusted from a damaged or older save.
    if(profile.run.ended) profile.run.won=goalMet(profile.run);
  }
  return profile;
}
export function startRun(profile,index=profile.completed%CONTRACTS.length) {
  profile.run={contract:integer(index,3),day:1,actions:2,resources:[4,4,4],growth:[1,0,1],harvest:[0,0,0],lastPicking:false,ended:false,won:false,selected:0,healthyDays:0};
  return profile.run;
}
export function care(profile,id) {
  const run=profile.run,tool=TOOLS.find(item=>item.id===id);
  if(!run||run.ended||run.lastPicking||!run.actions||!tool) return false;
  const delta=[...tool.delta];if(id==='compost'&&profile.compost)delta[2]++;
  run.resources=run.resources.map((value,i)=>clamp(value+delta[i]));run.actions--;
  return true;
}
export function harvest(profile,index) {
  const run=profile.run;
  if(!run||run.ended||!Number.isInteger(index)||index<0||index>2||run.growth[index]<2)return 0;
  const amount=profile.crates?3:2;
  run.growth[index]=0;run.harvest[index]+=amount;profile.coins+=amount;return amount;
}
export function sunset(profile) {
  const run=profile.run;
  if(!run||run.ended)return null;
  if(run.lastPicking) {
    // Final fruit is never silently thrown away when the player settles.
    const collected=FRUITS.map((_,i)=>harvest(profile,i));
    run.ended=true;run.won=goalMet(run);
    profile.best=Math.max(profile.best,run.harvest.reduce((a,b)=>a+b,0));
    if(run.won)profile.completed++;
    return {kind:'result',collected,won:run.won};
  }
  const weather=forecast(run);run.resources=projected(run);
  const growing=FRUITS.map((_,i)=>healthy(run.resources,i));
  growing.forEach((good,i)=>{if(good)run.growth[i]=Math.min(2,run.growth[i]+(weather.growth||1));});
  if(growing.every(Boolean))run.healthyDays++;
  if(run.day===8){run.lastPicking=true;run.actions=0;}else{run.day++;run.actions=2;}
  return {kind:'day',growing};
}
export function buyEquipment(profile,id) {
  const costs={compost:20,crates:30};const cost=costs[id];
  if(!cost||profile[id]||profile.coins<cost)return false;
  profile.coins-=cost;profile[id]=true;return true;
}
