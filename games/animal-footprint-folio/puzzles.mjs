// The rule is the source of truth. Answers are derived, never separately keyed.
export const SYMBOLS = Object.freeze(['paw', 'bird', 'hoof', 'leaf', 'wave', 'star']);
const rows = [
  ['repeat', ['paw','bird'], 6, [4]],
  ['repeat', ['hoof','leaf'], 6, [1]],
  ['repeat', ['bird','paw'], 8, [3,6]],
  ['repeat', ['wave','hoof'], 8, [0,5]],
  ['repeat', ['paw','star'], 8, [1,4,7]],
  ['repeat', ['paw','bird','leaf'], 6, [4]],
  ['repeat', ['hoof','hoof','bird'], 6, [2]],
  ['repeat', ['leaf','wave','wave'], 8, [3,7]],
  ['repeat', ['paw','paw','bird','leaf'], 8, [1,6]],
  ['repeat', ['hoof','bird','bird','star'], 8, [0,3,6]],
  ['mirror', ['paw','bird','leaf'], 6, [4]],
  ['mirror', ['hoof','wave','bird','star'], 8, [2]],
  ['mirror', ['leaf','paw','bird','hoof'], 8, [1,5]],
  ['mirror', ['bird','wave','hoof','paw'], 8, [0,4]],
  ['mirror', ['star','paw','leaf','bird'], 8, [1,3,7]],
  ['lanes', ['paw','bird','leaf','hoof'], 8, [4]],
  ['lanes', ['wave','hoof','paw','star'], 8, [3,6]],
  ['lanes', ['bird','leaf','hoof','wave'], 8, [2,7]],
  ['lanes', ['leaf','star','paw','bird'], 8, [0,5]],
  ['lanes', ['hoof','paw','star','leaf'], 8, [1,4,6]],
  ['turn', ['bird'], 6, [4], 1],
  ['turn', ['paw'], 6, [1], -1],
  ['turn', ['hoof'], 8, [2,5], 2],
  ['turn', ['bird'], 8, [0,6], -1],
  ['turn', ['paw'], 8, [1,3,6], 1],
  ['mixed', ['paw','bird'], 8, [4,7], 1],
  ['mixed', ['leaf','hoof','bird'], 8, [2,6], -1],
  ['mixed', ['bird','paw'], 8, [1,4,7], 2],
  ['mixed', ['hoof','bird','leaf'], 8, [0,4,6], 1],
  ['mixed', ['paw','leaf','bird','hoof'], 8, [1,4,6,7], -1],
];
export const CASES = Object.freeze(rows.map(([kind, pattern, length, gaps, step=0], index) => Object.freeze({
  id:index+1, region:Math.floor(index/5), checkpoint:(index+1)%5===0,
  kind, pattern:Object.freeze(pattern), length, gaps:Object.freeze(gaps), step,
  purpose:`${kind}:${pattern.join('-')}; positions ${gaps.map(n=>n+1).join(',')}; turn ${step}`,
})));
export function tokenAt(level, index) {
  let symbol;
  if (level.kind === 'mirror') symbol=level.pattern[index < level.length/2 ? index : level.length-1-index];
  else if (level.kind === 'lanes') symbol=level.pattern[(index%2)*2 + (Math.floor(index/2)%2)];
  else symbol=level.pattern[index%level.pattern.length];
  return {symbol, turn:((index*level.step)%4+4)%4};
}
export const tokenKey = token => token ? `${token.symbol}:${token.turn}` : '';
export function optionsFor(level, index) {
  const answer=tokenAt(level,index), choices=[answer];
  if(level.kind==='mixed') {
    const other=level.pattern[(level.pattern.indexOf(answer.symbol)+1)%level.pattern.length];
    choices.push({...answer,turn:(answer.turn+1)%4},{symbol:other,turn:answer.turn},{symbol:other,turn:(answer.turn+2)%4});
  }
  else if(level.step) for(let n=1;n<4;n++)choices.push({...answer,turn:(answer.turn+n)%4});
  else {
    for(const symbol of [...new Set([...level.pattern,...SYMBOLS])]) {
      if(symbol!==answer.symbol && choices.length<4)choices.push({symbol,turn:0});
    }
  }
  // Stable shuffled positions: the correct choice is not always first.
  const offset=(level.id+index*3)%choices.length;
  return choices.slice(offset).concat(choices.slice(0,offset));
}
export function checkAnswers(level, answers) {
  return level.gaps.filter(index => tokenKey(answers[index]) !== tokenKey(tokenAt(level,index)));
}
export const freshSave=()=>({version:1,stars:Array(30).fill(0),run:null,moon:false,theme:'day'});
export function unlocked(save){const first=save.stars.findIndex(n=>!n);return first<0?30:first+1;}
export function normalizeSave(raw){
  const save=freshSave();
  if(!raw || raw.version!==1)return save;
  save.stars=save.stars.map((_,i)=>Number.isInteger(raw.stars?.[i])?Math.max(0,Math.min(3,raw.stars[i])):0);
  save.moon=raw.moon===true;save.theme=save.moon&&raw.theme==='moon'?'moon':'day';
  const r=raw.run,level=CASES[(r?.id||0)-1];
  if(level&&!r.awarded&&level.id<=unlocked(save)){
    const answers={};
    for(const index of level.gaps){const token=r.answers?.[index];if(optionsFor(level,index).some(t=>tokenKey(t)===tokenKey(token)))answers[index]={symbol:token.symbol,turn:token.turn};}
    save.run={id:level.id,answers,errors:Math.max(0,Math.min(100,Number(r.errors)||0)),hint:r.hint===true};
  }
  return save;
}
export const earnedStars = run => Math.max(1,3-(run.errors>0?1:0)-(run.hint?1:0));
export function settle(save,run){
  const level=CASES[run.id-1];
  if(!level||run.id>unlocked(save)||checkAnswers(level,run.answers).length)return null;
  const stars=earnedStars(run);save.stars[run.id-1]=Math.max(save.stars[run.id-1],stars);save.run=null;
  return {stars,next:run.id<30&&unlocked(save)>run.id};
}
