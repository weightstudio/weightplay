import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,cellIndex} from './levels.mjs';
import {createRun,build,undo,progress,normalizeSave,recordCompletion,unlocked} from './core.mjs';

test('every authored plan has a connected, three-star solution within its timber target',()=>{
  assert.equal(LEVELS.length,30);
  assert.equal(new Set(LEVELS.map(l=>l.map+JSON.stringify(l.goals))).size,30);
  for(const level of LEVELS){
    assert.equal(level.map.length,25,level.id);
    assert.equal([...level.map].filter(c=>c==='S').length,1,level.id);
    assert.equal([...level.map].filter(c=>c==='*').length,1,level.id);
    const run=createRun(level);
    for(const step of level.solution)assert.equal(build(run,step.at,step.tool).ok,true,`${level.id}: ${JSON.stringify(step)}`);
    assert.equal(progress(run).stars,3,`${level.id}: spent ${run.spent}; ${JSON.stringify(progress(run))}`);
  }
});
test('invalid actions are inert; undo refunds upgrades and restores the actual previous room',()=>{
  const run=createRun(LEVELS[0]);
  for(const [at,tool] of [[0,'bed'],[24,'hall'],[cellIndex('B3'),'bed'],[cellIndex('C2'),'bridge'],[cellIndex('C2'),'garden'],[cellIndex('C2'),'nursery']]){
    const before=JSON.stringify(run);assert.equal(build(run,at,tool).ok,false);assert.equal(JSON.stringify(run),before);
  }
  assert.equal(build(run,cellIndex('C2'),'hall').ok,true);
  assert.equal(build(run,cellIndex('C2'),'bed').cost,2);
  assert.equal(run.spent,3);undo(run);assert.equal(run.spent,1);assert.equal(run.rooms[cellIndex('C2')],'hall');
  undo(run);assert.equal(run.spent,0);assert.equal(undo(run),false);
});
test('a connected house still needs fed bedrooms and an affordable plan',()=>{
  const run=createRun(LEVELS[0]);build(run,7,'bed');build(run,12,'hall');build(run,17,'pantry');
  assert.equal(progress(run).complete,false);
  assert.equal(build(run,11,'nursery').ok,false);
  build(run,6,'pantry');assert.equal(progress(run).complete,true);
  assert.equal(build(run,8,'bed').reason,'budget');
});
test('defensive progression preserves best records and never imports legacy scores as unlocks',()=>{
  let save=normalizeSave({records:[{stars:3,spent:5},null,{stars:3,spent:9}],lantern:'true'});
  assert.equal(unlocked(save),1);assert.equal(save.records[2],null);assert.equal(save.lantern,false);
  assert.equal(normalizeSave(null).records.length,30);
  assert.equal(normalizeSave({records:[{stars:99,spent:-1}]}).records[0],null);
  const run=createRun(LEVELS[0]);for(const s of run.level.solution)build(run,s.at,s.tool);
  save=recordCompletion(save,0,run);assert.deepEqual(save.records[0],{stars:3,spent:5});
});
