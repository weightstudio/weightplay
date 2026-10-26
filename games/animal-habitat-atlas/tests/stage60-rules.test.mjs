import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
export function loadRules(file=new URL('../game.js',import.meta.url)){const scope={};scope.globalThis=scope;vm.runInNewContext(fs.readFileSync(file,'utf8'),scope);return scope.HabitatRescueRules;}
export const R=loadRules();
const bit=(s,predicate)=>s.cells.reduce((n,c)=>n|(predicate(c)?1<<c.id:0),0);
function key(s){return [bit(s,c=>c.restored),bit(s,c=>c.rescued),bit(s,c=>c.shelter),bit(s,c=>c.health===1),bit(s,c=>c.health===0),s.kits,s.low,s.bridges].join(',');}
function estimate(s,p){const missingAnimals=p.animals.filter(id=>!s.cells[id].rescued),needLand=new Set([...missingAnimals,...(p.required||[])].filter(id=>!s.cells[id].restored));const remainingLand=Math.max(needLand.size,p.goal-R.eco(s));const links=(p.links||[]).filter(id=>!s.cells[id].bridge).length;const floodNeed=[...needLand].some(id=>R.flooded(s,id));return missingAnimals.length+remainingLand+links+Number(floodNeed&&s.low===0);}
export function solve(stage,{width=1200}={}){
 const p=R.plans[stage-1],initial=R.create(stage);let frontier=[{s:initial,path:[]}],expanded=0;
 for(let depth=0;depth<=p.turns-2;depth++){
  const next=new Map();
  for(const node of frontier){const s=node.s;if(R.stars(s)===3)return {...node,expanded};if(s.ended||s.welfare!==s.saved||s.cells.some(c=>c.animal&&!c.rescued&&c.health===0))continue;
   const actions=[];
   for(const c of s.cells){if(!R.accessible(s,c.id))continue;
    if(c.animal&&!c.rescued&&c.restored)actions.push(['rescue',c.id]);
    if(!c.restored&&!c.gap)actions.push(['restore',c.id]);
    if(c.gap&&!c.bridge&&(p.links||[]).includes(c.id))actions.push(['bridge',c.id]);
    if(c.pump&&c.restored&&s.low===0&&p.flooded?.some(id=>!s.cells[id].restored))actions.push(['pump',c.id]);
    if(p.storm&&c.animal&&!c.rescued&&!c.restored&&!c.shelter)actions.push(['shelter',c.id]);
   }
   if(s.kits<=6)actions.push(['supply',10]);
   for(const action of actions){const v=R.act(s,...action);expanded++;if(v.error)continue;const n=v.state;if(n.welfare!==n.saved||n.cells.some(c=>c.animal&&!c.rescued&&c.health===0))continue;if(R.stars(n)===3)return {s:n,path:[...node.path,action],expanded};if(n.ended||n.turn+estimate(n,p)>p.turns-2)continue;
    const k=key(n);if(!next.has(k))next.set(k,{s:n,path:[...node.path,action],score:estimate(n,p)*10-n.kits*.15-n.cells.filter(c=>c.restored&&c.wet).length*.3});
   }
  }
  frontier=[...next.values()].sort((a,b)=>a.score-b.score).slice(0,width);if(!frontier.length)return null;
 }
 return null;
}
function projected(s){return {stage:s.stage,turn:s.turn,kits:s.kits,saved:s.saved,welfare:s.welfare,ended:s.ended,cells:s.cells.map(({id,restored,animal,rescued,shelter,health,cache,rough,wet})=>({id,restored,animal,rescued,shelter,health,cache,rough,wet}))};}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const task=process.env.CODEX_THREAD_ID,file='/tmp/habitat-stage60-model-'+task+'.json';const report={taskId:task,status:'IN_PROGRESS',stages:[],legacyComparisons:0};
 const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2));
 try{
  assert.equal(R.plans.length,60);const hashes=new Set();for(const [i,p]of R.plans.entries()){const copy={...p};delete copy.intent;delete copy.id;const hash=crypto.createHash('sha256').update(JSON.stringify(copy)).digest('hex');assert(!hashes.has(hash),'Duplicate stage '+(i+1));hashes.add(hash);assert.equal(new Set(p.animals).size,p.animals.length);for(const k of ['animals','caches','rough','wet','gaps','required','links','pumps','flooded'])for(const x of p[k]||[])assert(Number.isInteger(x)&&x>=0&&x<12);assert(p.animals.every(x=>!p.gaps?.includes(x)));}
  const legacyPath=process.env.HABITAT_LEGACY_SOURCE||'/tmp/habitat-stage60-legacy-'+task+'.js';
  report.legacyComparisonStatus=fs.existsSync(legacyPath)?'PASS':'NOT_RUN: original source baseline not supplied';
  if(fs.existsSync(legacyPath)){const old=loadRules(legacyPath);
  for(let stage=1;stage<=6;stage++){assert.equal(JSON.stringify(R.plans[stage-1]),JSON.stringify(old.plans[stage-1]));let a=old.create(stage),b=R.create(stage);for(let turn=0;turn<18;turn++){for(const action of ['restore','rescue','shelter','supply'])for(let id=0;id<12;id++){const x=old.act(a,action,id),y=R.act(b,action,id);assert.equal(x.error,y.error);assert.equal(JSON.stringify(x.state),JSON.stringify(projected(y.state)));report.legacyComparisons++;}const candidates=[];for(const action of ['restore','rescue','shelter','supply'])for(let id=0;id<12;id++)if(!old.act(a,action,id).error)candidates.push([action,id]);if(!candidates.length)break;const pick=candidates[(stage*7+turn*11)%candidates.length];a=old.act(a,...pick).state;b=R.act(b,...pick).state;}}
  }
  for(let stage=1;stage<=60;stage++){const result=solve(stage,{width:Number(process.env.HABITAT_SOLVER_WIDTH)||1200});assert(result,'No three-star route found: '+stage);const before=R.create(stage);let state=before;for(const [action,id]of result.path){const previous=JSON.stringify(state),r=R.act(state,action,id);assert.equal(r.error,null);assert.equal(JSON.stringify(state),previous);state=r.state;assert(state.kits>=0&&state.kits<=9);assert(state.bridges>=0&&state.low>=0);}assert.equal(R.stars(state),3);assert(R.goals(state));if(stage>=7&&R.plans[stage-1].links?.length)assert(result.path.some(x=>x[0]==='bridge'));if(stage>=31)assert(result.path.some(x=>x[0]==='pump'));const p=R.plans[stage-1];report.stages.push({stage,hash:[...hashes][stage-1],status:'PASS',actions:result.path.length,remaining:p.turns-result.path.length,expanded:result.expanded,path:result.path});save();console.log(JSON.stringify({stage,actions:result.path.length,expanded:result.expanded}));}
  report.status='PASS';
 }catch(e){report.status='FAIL';report.failure=String(e.stack);process.exitCode=1;}finally{save();console.log(JSON.stringify({status:report.status,stages:report.stages.length,legacy:report.legacyComparisons,failure:report.failure}));}
}
