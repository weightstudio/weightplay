// Authored puzzles, deterministic transitions and save normalization. No DOM.
export const SAVE_KEY = 'weightplay-pattern-workshop-v1';
export const SHAPES = Object.freeze({L:'leaf',S:'star',M:'moon',D:'diamond',F:'flower',W:'wave'});
const definitions = [
  ['First leaf','第一片葉子','rows','L S M/L S M/L S M',[8]],
  ['Quiet columns','安靜的直列','columns','M L S/M L S/M L S',[4]],
  ['Three shelves','三層書架','rowSolid','L L L/M M M/S S S',[6]],
  ['Across the grain','橫向紋理','rows','S M L/S M L/S M L',[1,7]],
  ['The first seal','初見印記','rows','M S L/M S L/M S L',[3,8]],
  ['Leaf and light','葉與光','checker','L S L/S L S/L S L',[4]],
  ['Night rhythm','夜的節拍','checker','M D M/D M D/M D M',[2,7]],
  ['Twin beats','成雙節拍','rowSolid','S S S/L L L/S S S',[1,5]],
  ['Crossed paths','交錯小徑','checker','W F W/F W F/W F W',[3,8]],
  ['Rhythm seal','節奏印記','checker','S M S/M S M/S M S',[1,4,6]],
  ['Mirror pond','鏡面池塘','mirrorH','L S L/M D M/F W F',[2]],
  ['Reflected moon','月之倒影','mirrorV','M S L/W D F/M S L',[7]],
  ['Two reflections','雙重倒影','mirrorH','S L S/D M D/W F W',[0,8]],
  ['Folded canopy','對折樹冠','mirrorV','F W M/L S D/F W M',[2,6]],
  ['Mirror seal','鏡像印記','mirrorBoth','L M L/S D S/L M L',[2,3,6]],
  ['One step forward','向前一步','shiftLeft','L S M/S M L/M L S',[8]],
  ['Turn the wheel','轉動輪盤','shiftRight','D F W/W D F/F W D',[3,7]],
  ['Diagonal trail','斜向小徑','shiftLeft','M L D/L D M/D M L',[1,6]],
  ['Back to the start','回到起點','shiftRight','S W F/F S W/W F S',[2,4]],
  ['Cycle seal','循環印記','shiftLeft','F M S/M S F/S F M',[0,4,8]],
  ['A growing garden','漸長花園','countAcross','L1 L2 L3/S1 S2 S3/M1 M2 M3',[5]],
  ['Falling starlight','垂落星光','countDown','S1 M1 L1/S2 M2 L2/S3 M3 L3',[7]],
  ['A softer echo','漸弱回聲','countReverse','F3 F2 F1/W3 W2 W1/D3 D2 D1',[1,8]],
  ['Mirror in numbers','數量之鏡','countMirror','L1 L3 L1/M2 M1 M2/S3 S2 S3',[2,6]],
  ['Counting seal','數量印記','countAcross','D1 D2 D3/F1 F2 F3/W1 W2 W3',[2,4,6]],
  ['Two threads','兩條線索','dualAcross','L1 S2 M3/S1 M2 L3/M1 L2 S3',[4]],
  ['Woven moonlight','交織月光','dualDown','M1 D1 F1/D2 F2 M2/F3 M3 D3',[2,7]],
  ['The reverse weave','反向編織','dualReverse','S3 L2 W1/L3 W2 S1/W3 S2 L1',[1,5]],
  ['Prism workshop','稜鏡工坊','dualMirror','L1 M2 L1/S2 D3 S2/L1 M2 L1',[0,5,7]],
  ['The master pattern','大師圖紋','dualAcross','F1 M2 S3/M1 S2 F3/S1 F2 M3',[0,4,8]],
];
export const tile = code => ({shape:SHAPES[code[0]],count:Number(code.slice(1))||1});
export const tileKey = value => `${value.shape}:${value.count}`;
export const STAGES = Object.freeze(definitions.map(([en,zh,rule,rows,holes],index) => Object.freeze({
  id:index+1, arc:Math.floor(index/5), name:Object.freeze({en,'zh-Hant':zh}), rule,
  tiles:Object.freeze(rows.split(/[ /]/).map(code=>Object.freeze(tile(code)))),
  holes:Object.freeze(holes), checkpoint:(index+1)%5===0,
})));
const cap = (v,max=100000) => Number.isFinite(Number(v)) ? Math.max(0,Math.min(max,Math.floor(Number(v)))) : 0;
export function normalizeSave(raw) {
  const medals = STAGES.map((_,i)=>Array.from({length:3},(_,n)=>raw?.medals?.[i]?.[n]===true));
  let unlocked=1;
  while(unlocked<STAGES.length && medals[unlocked-1][0])unlocked++;
  const save={schema:1,medals,unlocked,skin:raw?.skin==='moon'&&raw?.moonOwned===true?'moon':'jade',moonOwned:raw?.moonOwned===true,run:null};
  const stage=STAGES[cap(raw?.run?.stage,30)-1];
  if(stage && stage.id<=unlocked){
    const filled=stage.holes.filter(index=>Array.isArray(raw.run.filled)&&raw.run.filled.includes(index));
    if(filled.length<stage.holes.length)save.run={stage:stage.id,filled,mistakes:cap(raw.run.mistakes),hints:cap(raw.run.hints)};
  }
  return save;
}
export function newRun(stage,prior=null) {
  return {stage:stage.id,filled:prior?.stage===stage.id?[...prior.filled]:[],mistakes:cap(prior?.mistakes),hints:cap(prior?.hints),status:'playing',streak:0};
}
export function remaining(run){return STAGES[run.stage-1].holes.filter(index=>!run.filled.includes(index));}
export function choose(run,index,choice) {
  const stage=STAGES[run.stage-1];
  if(run.status!=='playing'||!stage?.holes.includes(index)||run.filled.includes(index))return {run,outcome:'ignored'};
  if(tileKey(stage.tiles[index])!==tileKey(choice))return {run:{...run,mistakes:run.mistakes+1,streak:0},outcome:'wrong'};
  const filled=[...run.filled,index];
  return {run:{...run,filled,streak:run.streak+1,status:filled.length===stage.holes.length?'complete':'playing'},outcome:'correct'};
}
export function optionsFor(stage,index) {
  const correct=stage.tiles[index],unique=new Map([[tileKey(correct),correct]]);
  // Late puzzles contain near misses that differ in only one attribute.
  if(stage.arc>=4){
    for(let n=1;n<=3;n++)unique.set(`${correct.shape}:${n}`,{shape:correct.shape,count:n});
    const other=Object.values(SHAPES).find(shape=>shape!==correct.shape);
    unique.set(`${other}:${correct.count}`,{shape:other,count:correct.count});
  }else{
    for(const value of stage.tiles)unique.set(tileKey(value),value);
    for(const shape of Object.values(SHAPES))if(unique.size<4)unique.set(`${shape}:1`,{shape,count:1});
  }
  const result=[...unique.values()].slice(0,4);
  let seed=(stage.id*977+index*131)>>>0;
  for(let i=result.length-1;i>0;i--){seed=(1664525*seed+1013904223)>>>0;const j=seed%(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function award(save,run) {
  if(run.status!=='complete')return save;
  const medals=save.medals.map(row=>[...row]);
  const earned=[true,run.mistakes===0,run.hints===0];
  medals[run.stage-1]=earned.map((v,i)=>v||medals[run.stage-1][i]);
  return normalizeSave({...save,medals,run:null});
}
export function clueCells(stage,index) {
  const row=Math.floor(index/3),col=index%3;
  if(['mirrorH','countMirror'].includes(stage.rule))return [row*3,row*3+1,row*3+2];
  if(stage.rule==='mirrorV')return [col,3+col,6+col];
  if(['columns','countDown','dualDown'].includes(stage.rule))return [col,3+col,6+col];
  return Array.from({length:9},(_,i)=>i).filter(i=>Math.floor(i/3)===row||i%3===col);
}
