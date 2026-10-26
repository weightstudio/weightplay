import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {pathToFileURL} from 'node:url';
export function loadRules(file){const box={};vm.runInNewContext(fs.readFileSync(file,'utf8'),box);return box.WeightPlayHoopRules;}
export const R=loadRules('games/animal-hoop-league/game.js');
export function solve(stage){
 const c=R.courts[stage-1],g=c.goals||{};let nodes=[{r:R.newRound(stage),path:[]}];
 const key=r=>[Math.min(r.bankMade||0,g.bank||0),Math.min(r.directMade||0,g.direct||0),Math.min(r.assistMade||0,g.assist||0),Math.min(r.perfect,g.perfect||0),Math.min(r.streak,g.streak||0),Math.min(r.bestStreak||0,g.streak||0),r.assists||0,r.finished?r.lastRoute:''].join('/');
 for(let turn=0;turn<c.shots;turn++){
  const next=new Map();for(const {r,path}of nodes){
   const actions=['direct',...(stage>=7?['bank']:[]),...(stage>=31?['assist','pass']:[])];
   for(const action of actions){const ch=action==='pass'?null:R.challenge(stage,turn,action);if(ch?.open===false)continue;const n=action==='pass'?R.pass(r):R.settle(r,ch.target,action);if(n===r)continue;const route=[...path,{action,power:ch?.target??null}];if(n.finished){if(R.won(n))return {round:n,path:route};continue;}
    const left=c.shots-n.shots;if((g.bank||0)-(n.bankMade||0)+(g.direct||0)-(n.directMade||0)+(g.assist||0)-(n.assistMade||0)>left+4)continue;
    const k=key(n),old=next.get(k);if(!old||n.score>old.r.score)next.set(k,{r:n,path:route});
   }
  }nodes=[...next.values()];if(!nodes.length)return null;
 }return null;
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const task=process.env.CODEX_THREAD_ID,report={taskId:task,status:'IN_PROGRESS',stages:[],legacyComparisons:0};const file='/tmp/hoop-stage60-model-'+task+'.json';
 try{
  assert.equal(R.courts.length,60);const hashes=new Set();for(const [i,c]of R.courts.entries()){assert.equal(c.rival.length,c.shots);if(i>=6){assert.equal(c.defenses.length,c.shots);assert.equal(c.pattern.length,c.shots);assert(c.defenses.every(x=>['O','R','B',...(i>=30?['A']:[])].includes(x)));}const config={...c};delete config.intent;delete config.id;const hash=crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex');assert(!hashes.has(hash));hashes.add(hash);for(const route of ['direct',...(i>=6?['bank']:[]),...(i>=30?['assist']:[])])for(let shot=0;shot<c.shots;shot++){const ch=R.challenge(i+1,shot,route);assert(ch.target-ch.tolerance>=0&&ch.target+ch.tolerance<=1);}}
  assert.equal(R.newRound(61),null);assert.equal(R.newRound(0),null);assert.equal(R.challenge(61,0),null);
  const legacy=process.env.HOOP_LEGACY_SOURCE||'/tmp/hoop-stage60-legacy-'+task+'.js';report.legacyStatus=fs.existsSync(legacy)?'PASS':'NOT_RUN: original source baseline not supplied';
  if(fs.existsSync(legacy)){const old=loadRules(legacy);for(let stage=1;stage<=6;stage++){assert.equal(JSON.stringify(R.courts[stage-1]),JSON.stringify(old.courts[stage-1]));let a=old.newRound(stage),b=R.newRound(stage);for(let shot=0;shot<old.courts[stage-1].shots;shot++){for(let p=0;p<=100;p++){assert.equal(JSON.stringify(R.settle(b,p/100)),JSON.stringify(old.settle(a,p/100)));report.legacyComparisons++;}const power=old.challenge(stage,shot).target;a=old.settle(a,power);b=R.settle(b,power);}}}
  for(let stage=1;stage<=60;stage++){const witness=solve(stage);assert(witness,'Unsolvable court '+stage);let state=R.newRound(stage);for(const {action,power}of witness.path){const before=JSON.stringify(state),next=action==='pass'?R.pass(state):R.settle(state,power,action);assert.equal(JSON.stringify(state),before);assert.notEqual(next,state);state=next;assert(state.assists===undefined||(state.assists>=0&&state.assists<=2));}assert(R.won(state));assert.equal(R.settle(state,.5),state);assert.equal(R.pass(state),state);report.stages.push({stage,hash:[...hashes][stage-1],status:'PASS',score:state.score,rival:state.rival,goals:R.courts[stage-1].goals||{},path:witness.path});console.log(JSON.stringify({stage,score:state.score,rival:state.rival,passes:witness.path.filter(x=>x.action==='pass').length}));}
  report.status='PASS';
 }catch(e){report.status='FAIL';report.failure=String(e.stack);process.exitCode=1;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,courts:report.stages.length,legacyComparisons:report.legacyComparisons,failure:report.failure}));}
}
