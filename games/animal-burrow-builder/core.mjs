export const TOOLS = Object.freeze({hall:1,bed:3,pantry:2,garden:2,bridge:2,nursery:3});
export const SAVE_KEY = 'weightplay-burrow-campaign-v1';
export const neighbours = at => [at-5,at+5,at%5>0?at-1:-1,at%5<4?at+1:-1].filter(n=>n>=0&&n<25);
export function createRun(level) {
  return {level, rooms: Array(25).fill(null).map((_,i)=>level.map[i]==='S'?'entry':null), spent:0, history:[], moves:0};
}
export function inspectBuild(run, at, tool) {
  if (!Number.isInteger(at)||at<0||at>=25||!Object.hasOwn(TOOLS,tool)) return {ok:false,reason:'invalid'};
  const terrain=run.level.map[at], previous=run.rooms[at];
  if (terrain==='#'||previous==='entry') return {ok:false,reason:'rock'};
  if (previous&&previous!=='hall') return {ok:false,reason:'occupied'};
  if (previous===tool) return {ok:false,reason:'occupied'};
  if (terrain==='~'&&tool!=='bridge') return {ok:false,reason:'water'};
  if (terrain!=='~'&&tool==='bridge') return {ok:false,reason:'dry'};
  if (!neighbours(at).some(n=>run.rooms[n])) return {ok:false,reason:'connect'};
  if (tool==='garden'&&!neighbours(at).some(n=>run.level.map[n]==='~')) return {ok:false,reason:'gardenWater'};
  if (tool==='nursery'&&!neighbours(at).some(n=>run.rooms[n]==='bed')) return {ok:false,reason:'nurseryBed'};
  const cost=TOOLS[tool]-(previous?TOOLS[previous]:0);
  if(run.spent+cost>run.level.budget) return {ok:false,reason:'budget'};
  return {ok:true,cost,previous};
}
export function build(run,at,tool) {
  const result=inspectBuild(run,at,tool);
  if(!result.ok)return result;
  run.history.push({at,previous:run.rooms[at],cost:result.cost});
  run.rooms[at]=tool;run.spent+=result.cost;run.moves++;
  return {...result,relic:run.level.map[at]==='*'&&!result.previous};
}
export function undo(run) {
  const action=run.history.pop();if(!action)return false;
  run.rooms[action.at]=action.previous;run.spent-=action.cost;return true;
}
export function progress(run) {
  const counts={bed:0,pantry:0,garden:0,nursery:0,food:0};
  run.rooms.forEach((room,at)=>{
    if(Object.hasOwn(counts,room))counts[room]++;
    if(room==='bed'&&neighbours(at).some(n=>run.rooms[n]==='pantry'))counts.food++;
  });
  const requirements=Object.entries(run.level.goals).map(([key,target])=>({key,target,value:counts[key],met:counts[key]>=target}));
  const complete=requirements.every(goal=>goal.met);
  const relic=run.rooms.some((room,i)=>room&&run.level.map[i]==='*');
  const efficient=run.spent<=run.level.par;
  return {requirements,complete,relic,efficient,stars:complete?1+Number(relic)+Number(efficient):0};
}
export function normalizeSave(value, count=30) {
  const data=value&&typeof value==='object'?value:{};
  const records=Array.from({length:count},(_,i)=>{
    const v=data.records?.[i];
    return v&&Number.isInteger(v.stars)&&v.stars>=1&&v.stars<=3&&Number.isInteger(v.spent)&&v.spent>=0&&v.spent<=200 ? {stars:v.stars,spent:v.spent} : null;
  });
  // Corrupt or edited gaps never unlock later records.
  let gap=false;for(let i=0;i<count;i++){if(!records[i])gap=true;if(gap)records[i]=null;}
  return {schema:1,records,lantern:data.lantern===true};
}
export function recordCompletion(save,index,run) {
  const p=progress(run);if(!p.complete)return save;
  const result=normalizeSave(save), previous=result.records[index];
  result.records[index]={stars:Math.max(previous?.stars||0,p.stars),spent:Math.min(previous?.spent??Infinity,run.spent)};
  return result;
}
export const unlocked = save => Math.min(29,save.records.findIndex(r=>!r)<0?29:save.records.findIndex(r=>!r));
