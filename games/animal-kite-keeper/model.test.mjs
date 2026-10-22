import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, createState, step, solve, starRating, normalizeSave, recordWin, availableSkins } from './model.mjs';
import { FLIGHT_COPY } from './flight-copy.mjs';
import { kiteKeeperGuideLocales } from './guide-locales.mjs';

test('all thirty authored puzzles are distinct, solvable, and have bounded legal gusts', () => {
  assert.equal(STAGES.length, 30); assert.equal(new Set(STAGES.map(s => s.grid.join('/'))).size, 30);
  const chapters = Array(6).fill(0);
  for (const stage of STAGES) {
    chapters[stage.chapter]++; assert.equal(stage.grid.length, 5); stage.grid.forEach(row => assert.equal(row.length, 5));
    let current = createState(stage); const solution = solve(stage);
    for (const direction of solution) { const result = step(stage, current, direction); assert.equal(result.ok, true, `Route ${stage.id}`); current = result.state; }
    assert.equal(current.won, true, `Route ${stage.id}`); assert.equal(current.moves, stage.par);
    assert.equal(current.mask, (1 << stage.sparks.length) - 1); assert.ok(stage.par >= 3 && stage.par <= 22);
    assert.equal(starRating(stage, current, false), 3); assert.equal(starRating(stage, current, true), 2);
  }
  assert.deepEqual(chapters, [5,5,5,5,5,5]);
});
test('blocked movement is atomic and currents spend one gust for the whole chain', () => {
  const stage = { grid: ['.....','.....','.>^..','..#..','.....'], start:[0,2], dock:[4,0], sparks:[[2,1]], budget:8, ordered:false };
  const initial = createState(stage), result = step(stage, initial, 'east');
  assert.deepEqual(result.trace, [[1,2],[2,2],[2,1]]); assert.deepEqual(result.state.point,[2,1]); assert.equal(result.state.moves,1); assert.equal(result.state.mask,1);
  assert.deepEqual(initial, createState(stage), 'input state is immutable');
  assert.equal(step(stage, { ...initial, point:[2,4] }, 'north').ok,false);
  assert.equal(step(stage, { ...initial, point:[0,0] }, 'west').ok,false);
  const blocked = { ...stage, grid:['.....','..#..','.>^..','.....','.....'] };
  assert.equal(step(blocked,initial,'east').ok,false,'a blocked forced chain does not partly collect or move');
});
test('numbered lanterns require order; dock and budget check the final logical state', () => {
  const stage = { grid:['.....','.....','.....','.....','.....'], start:[1,1], dock:[3,1], sparks:[[1,2],[2,1]], ordered:true, budget:5, par:4 };
  const initial = createState(stage), early = step(stage,initial,'east').state;
  assert.equal(early.mask,0); assert.equal(step(stage,early,'east').state.won,false);
  let current=initial; for (const wind of ['south','north','east','east']) current=step(stage,current,wind).state;
  assert.equal(current.mask,3); assert.equal(current.won,true); assert.equal(step(stage,current,'west').reason,'finished');
  const exhausted=step({...stage,budget:1},initial,'west').state; assert.equal(exhausted.failed,true); assert.equal(exhausted.won,false);
});
test('legacy completions survive malformed records and replays cannot reduce best progress', () => {
  let save=normalizeSave({ records:{1:{stars:99,best:-1}},skin:'aurora' },[2,'3',0,31,2.5,30]);
  assert.deepEqual(save.solved,[2,30]); assert.equal(save.skin,'meadow'); assert.deepEqual(save.records,{});
  const stage=STAGES[0]; let current=createState(stage); for(const wind of solve(stage))current=step(stage,current,wind).state;
  save=recordWin(save,stage,current,false); save=recordWin(save,stage,{...current,moves:stage.par+2},true);
  assert.deepEqual(save.records[1],{stars:3,best:3}); assert.deepEqual(save.solved,[1,2,30]);
  assert.deepEqual(normalizeSave(JSON.parse(JSON.stringify(save)),save.solved),save);
  assert.ok(availableSkins(normalizeSave({aurora:true,skin:'aurora'},[1,2,3,4,5])).includes('aurora'));
  assert.ok(availableSkins(normalizeSave({},Array.from({length:15},(_,i)=>i+1))).includes('moon'));
});
test('all thirteen languages expose complete current copy and six-section guides', () => {
  assert.equal(Object.keys(FLIGHT_COPY).length,13); const keys=Object.keys(FLIGHT_COPY.en);
  for(const [locale,copy] of Object.entries(FLIGHT_COPY)) {
    assert.deepEqual(Object.keys(copy),keys); assert.equal(copy.chapterNames.length,6); assert.equal(copy.skinNames.length,5);
    for(const value of Object.values(copy))assert.ok(typeof value==='string' ? value.length>0 : value.every(v=>v.length));
    assert.equal(kiteKeeperGuideLocales[locale].sections.length,6); assert.equal(kiteKeeperGuideLocales[locale].faq.length,4);
  }
});
