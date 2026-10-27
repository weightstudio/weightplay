// Isolated chapter-2 rule slice. Existing 1–30 delegate to the real core.
// This module is not wired to game, art, saves, rewards or UI.
import {TOOLS,neighbours,createRun,inspectBuild,build,undo,progress} from './core.mjs';
export const HILLSIDE_TOOLS=Object.freeze({vent:2,brace:2});
const residential=new Set(['bed','nursery']);
const rooms=new Set(['bed','pantry','garden','nursery']);
export function makeRun(level){return createRun(level)}
export function inspectHillside(run,at,tool){
  if(!run.level.hillside)return inspectBuild(run,at,tool);
  if(!Number.isInteger(at)||at<0||at>=25)return {ok:false,reason:'invalid'};
  const terrain=run.level.map[at],previous=run.rooms[at];
  if(terrain==='!'&&(rooms.has(tool)||tool==='vent')&&!neighbours(at).some(i=>run.rooms[i]==='brace'))return {ok:false,reason:'needsBrace'};
  if(!Object.hasOwn(HILLSIDE_TOOLS,tool))return inspectBuild(run,at,tool);
  if(terrain==='#'||previous==='entry')return {ok:false,reason:'rock'};
  if(previous&&previous!=='hall'||previous===tool)return {ok:false,reason:'occupied'};
  if(terrain==='~')return {ok:false,reason:'water'};
  if(terrain==='!'&&tool==='brace')return {ok:false,reason:'unstableBrace'};
  if(!neighbours(at).some(i=>run.rooms[i]))return {ok:false,reason:'connect'};
  const cost=HILLSIDE_TOOLS[tool]-(previous?TOOLS[previous]:0);
  if(run.spent+cost>run.level.budget)return {ok:false,reason:'budget'};
  return {ok:true,cost,previous};
}
export function buildHillside(run,at,tool){
  if(!run.level.hillside)return build(run,at,tool);
  const result=inspectHillside(run,at,tool);if(!result.ok)return result;
  if(!Object.hasOwn(HILLSIDE_TOOLS,tool)){const applied=build(run,at,tool);if(applied.ok)run.history.at(-1).tool=tool;return applied;}
  run.history.push({at,tool,previous:run.rooms[at],cost:result.cost});run.rooms[at]=tool;run.spent+=result.cost;run.moves++;
  return {...result,relic:run.level.map[at]==='*'&&!result.previous};
}
export function undoHillside(run){return undo(run)}
export function progressHillside(run){
  if(!run.level.hillside)return progress(run);
  const {aired,reinforced,...goals}=run.level.goals;
  const base=progress({...run,level:{...run.level,goals}});
  const air=run.rooms.reduce((n,room,i)=>n+Number(residential.has(room)&&neighbours(i).some(j=>run.rooms[j]==='vent')),0);
  const support=run.rooms.reduce((n,room,i)=>n+Number(rooms.has(room)&&run.level.map[i]==='!'&&neighbours(i).some(j=>run.rooms[j]==='brace')),0);
  const extra=[{key:'aired',target:aired??0,value:air},{key:'reinforced',target:reinforced??0,value:support}].filter(g=>g.target>0).map(g=>({...g,met:g.value>=g.target}));
  const requirements=[...base.requirements,...extra],complete=requirements.every(g=>g.met);
  return {...base,requirements,complete,stars:complete?1+Number(base.relic)+Number(base.efficient):0};
}
