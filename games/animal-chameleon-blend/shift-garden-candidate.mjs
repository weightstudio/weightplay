// Chapter 2 candidate. Imported only by an explicitly gated practice adapter.
// Pair indices retain the game's three existing colors/shapes and habitats.
const specs=[
 ['c+',1,5,4,2.6,10],['c+',2,5,4,2.6,12],['c-',1,5,4,2.6,10],['c-',2,5,4,2.6,12],['c+|c-',2,6,5,2.6,12],
 ['p+',1,5,4,2.6,10],['p+',2,5,4,2.6,12],['p-',1,5,4,2.6,10],['p-',2,5,4,2.6,12],['p+|p-',2,6,5,2.6,12],
 ['c+|p+',2,5,4,2.7,12],['p+|c+',2,5,4,2.7,12],['c-|p+',2,5,4,2.7,12],['p-|c+',2,5,4,2.7,12],['c+|p-|c-',3,5,4,2.7,14],
 ['c+p+',1,5,4,2.8,12],['c-p-',1,5,4,2.8,12],['c+p-',2,5,4,2.8,14],['c-p+',2,5,4,2.8,14],['c+p+|c-p-',2,6,5,2.8,14],
 ['swap',1,5,4,2.8,12],['swap',2,5,4,2.8,14],['swap|c+',2,5,4,2.8,14],['swap|p-',2,5,4,2.8,14],['swap|c+|p-',3,5,4,2.8,15],
 ['swap+c+',2,5,4,3,14],['swap+p-',2,5,4,3,14],['swap+c+|c-p-',2,5,4,3,14],['swap+p-|c+p+',2,5,4,3,14],['swap|c+p-|swap+c+',3,6,5,3,16]
];
const mod=n=>(n+3)%3;
export function shiftedPair(pair,rule){
 if(!Array.isArray(pair)||pair.length!==2||pair.some(n=>!Number.isInteger(n)||n<0||n>2))throw Error('invalid pair');
 let [c,p]=pair;
 switch(rule){
  case 'c+':c=mod(c+1);break;case 'c-':c=mod(c-1);break;
  case 'p+':p=mod(p+1);break;case 'p-':p=mod(p-1);break;
  case 'c+p+':c=mod(c+1);p=mod(p+1);break;case 'c-p-':c=mod(c-1);p=mod(p-1);break;
  case 'c+p-':c=mod(c+1);p=mod(p-1);break;case 'c-p+':c=mod(c-1);p=mod(p+1);break;
  case 'swap':[c,p]=[p,c];break;case 'swap+c+':[c,p]=[mod(p+1),c];break;case 'swap+p-':[c,p]=[p,mod(c-1)];break;
  default:throw Error('invalid rule');
 }return[c,p];
}
export const SHIFT_STAGES=Object.freeze(specs.map(([rule,sequence,rounds,need,preview,choose],i)=>Object.freeze({id:31+i,arc:Math.floor(i/5)+1,checkpoint:(i+1)%5===0,sequence,rounds,need,preview,choose,reverse:false,shuffle:true,rules:Object.freeze(rule.split('|'))})));
export function shiftRule(stage,index){if(!stage||!Number.isInteger(index)||index<0||index>=stage.sequence)throw Error('invalid sequence');return stage.rules[index%stage.rules.length]}
export function shiftAnswers(stage,pairs){if(!Array.isArray(pairs)||pairs.length!==stage.sequence)throw Error('invalid preview');return pairs.map((pair,i)=>shiftedPair(pair,shiftRule(stage,i)))}
