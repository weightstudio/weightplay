import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {profiles} from './campaign-data.mjs';import * as R from './rules.mjs';
const task=process.env.CODEX_THREAD_ID,out=path.join(os.tmpdir(),'workshop-stage60-'+task);fs.mkdirSync(out,{recursive:true});const report={taskId:task,status:'IN_PROGRESS',stages:[]};
assert.equal(profiles.length,60);assert.deepEqual(profiles.slice(0,6),JSON.parse(fs.readFileSync(path.join(out,'original-six.json'))));
for(const [i,p] of profiles.entries()){
 const begin=Date.now(),result=R.solve(R.initial(p),p,{diagnostics:true}),row={stage:i+1,status:result.route?'PASS':'UNSOLVABLE',cost:result.cost,limit:p.limit,states:result.states,ms:Date.now()-begin,route:result.route};
 if(result.route){let g=R.initial(p),phaseUses=0,pushes=0;for(const action of result.route){const copy=JSON.stringify(g),next=R.transition(g,action,p);assert.equal(JSON.stringify(g),copy,'immutable before-state');assert(next);if(action==='phase')phaseUses++;if(JSON.stringify(g.crates)!==JSON.stringify(next.game.crates))pushes++;g=next.game;}assert(R.won(g,p));assert(g.steps<=p.limit);row.phaseUses=phaseUses;row.pushes=pushes;row.final={steps:g.steps,mask:g.mask,taken:g.taken,charges:g.charges,held:R.held(g,p)};}
 report.stages.push(row);fs.writeFileSync(path.join(out,'model.json'),JSON.stringify(report,null,2));if(row.status!=='PASS'||row.stage%10===0)console.log(JSON.stringify({...row,route:undefined,final:undefined}));
}
report.status=report.stages.every(r=>r.status==='PASS')?'PASS':'FAIL';fs.writeFileSync(path.join(out,'model.json'),JSON.stringify(report,null,2));if(report.status!=='PASS')process.exitCode=1;
