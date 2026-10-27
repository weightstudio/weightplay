import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('games/animal-chameleon-blend/game.js','utf8');
const section=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const code=section('  const base =','  const storageKey =')+section('  function targets()','  const audio=')+section('  function begin()','  function updateBlendCoach()')+section('  function finish()','  function tick(');
const nodes=new Map();const saved=new Map();let sounds=0;
const context=vm.createContext({assert,Map,console,Math,Number,Array,Boolean,String,
 resultScreen:{hidden:true},board:{inert:false},measurement:{},best:0,storageKey:'best',battlePaused:false,
 practiceEnabled:false,practiceRequested:false,practiceAdapter:null,shiftAnswers:null,shiftRule:null,shiftCopy:null,
 t:i=>String(i),common:i=>String(i),gameText:()=>({}),render:()=>{},updateProgress:()=>{},observeMeasurement:()=>{},sound:()=>{sounds++},
 $:id=>{if(!nodes.has(id))nodes.set(id,{setAttribute(){},disabled:false,textContent:''});return nodes.get(id)},localStorage:{setItem:(k,v)=>saved.set(k,v)},
 state:{screen:'battle',stage:1,round:1,wins:0,phase:'ready',color:-1,pattern:-1,entry:0,preview:0,timer:0,correct:false}
});
vm.runInContext(code,context);
assert.equal(vm.runInContext('profiles.length',context),30);
let testedRounds=0,testedPairs=0;
for(let stage=1;stage<=30;stage++){
 vm.runInContext(`state={screen:'battle',stage:${stage},round:1,wins:0,phase:'ready'};resultScreen.hidden=true;best=0;`,context);
 const rounds=vm.runInContext('profiles[state.stage-1].rounds',context);
 for(let round=1;round<=rounds;round++){
  vm.runInContext("begin(); assert.equal(state.phase,'preview');state.phase='choose';",context);
  const pairs=vm.runInContext('JSON.stringify(answers())',context);for(const [color,pattern] of JSON.parse(pairs)){
   vm.runInContext(`act('color-${color}');act('pattern-${pattern}');act('lock');`,context);testedPairs++;
  }
  vm.runInContext(`assert.equal(state.wins,${round});assert.equal(state.phase,'feedback');`,context);
  vm.runInContext('nextRound()',context);testedRounds++;
 }
 vm.runInContext(`assert.equal(state.phase,'result');assert.equal(best,${stage});assert.equal(resultScreen.hidden,false);var before=state.wins;act('lock');assert.equal(state.wins,before);`,context);
 assert.equal(saved.get('best'),String(stage));
}
// Incomplete pairs cannot score. Wrong pairs expose feedback without a reward.
vm.runInContext("state={screen:'battle',stage:1,round:1,wins:0,phase:'choose',color:-1,pattern:-1,entry:0};resultScreen.hidden=true;act('lock');assert.equal(state.phase,'choose');act('color-0');act('lock');assert.equal(state.wins,0);act('pattern-0');act('lock');assert.equal(state.correct,false);assert.equal(state.phase,'feedback');assert.equal(state.wins,0);",context);
// A failed replay must preserve the highest cleared stage.
vm.runInContext("best=12;state={screen:'battle',stage:1,round:5,wins:0,phase:'feedback'};finish();assert.equal(best,12);assert.equal($('next').disabled,true);",context);
console.log(`PASS: 30 stage profiles, ${testedRounds} rounds / ${testedPairs} ordered pairs, reverse sequences, incomplete/wrong input, terminal idempotency, contiguous save semantics.`);
