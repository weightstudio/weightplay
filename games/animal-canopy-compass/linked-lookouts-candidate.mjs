// Closed-chapter candidate. No original stage, save, scene or result is changed.
import {DIRECTIONS,wrap,mirror} from './puzzles.mjs?v=26';
const turn=(a,steps,blocked)=>({a,kind:'turn',steps,blocked});
const mirrored=(a,axis,steps=0,blocked)=>({a,kind:'mirror-turn',axis,steps,blocked});
const echo=(a,steps,blocked)=>({a,kind:'echo-turn',steps,blocked});
// N, NE, E, SE, S, SW, W, NW are 0–7. Rows correspond to design Stages 31–60.
const plans=[
 [turn(2,1)],[turn(7,-2)],[turn(4,2)],[turn(1,-1)],[turn(6,1),turn(4,-2)],
 [mirrored(2,'vertical')],[mirrored(7,'horizontal')],[mirrored(1,'vertical')],[mirrored(1,'horizontal')],[mirrored(2,'vertical'),mirrored(4,'horizontal')],
 [mirrored(7,'vertical',2)],[mirrored(2,'horizontal',1)],[mirrored(4,'vertical',-2)],[mirrored(1,'horizontal',2)],[mirrored(6,'horizontal',-1),mirrored(2,'vertical',2)],
 [turn(0,1),echo(2,1)],[turn(5,1),echo(7,1)],[turn(2,2),echo(0,-1)],[turn(3,2),echo(6,-2)],[turn(1,2),echo(6,1),echo(4,1)],
 [turn(0,2,7)],[turn(3,2,2)],[turn(6,-1,3)],[turn(7,2,6)],[turn(1,2,0),turn(4,-1,1)],
 [mirrored(2,'vertical'),turn(0,2,7)],[mirrored(1,'horizontal'),turn(6,-1,3)],[turn(0,1),echo(2,1),turn(7,2,6)],
 [mirrored(7,'vertical',2),turn(3,2,2),echo(0,-2)],[mirrored(2,'vertical'),turn(0,2,7),echo(1,1),mirrored(7,'vertical',2),mirrored(4,'horizontal')]
];
export function linkedTarget(rule,anchor,previous){
 if(rule.kind==='turn')return wrap(anchor+rule.steps);
 if(rule.kind==='mirror-turn')return wrap(mirror(anchor,rule.axis)+rule.steps);
 if(rule.kind==='echo-turn')return wrap(anchor+previous+rule.steps);
 throw new Error('Unknown linked rule');
}
export function linkedCandidates(phase,previous=0,include=['anchor','seal','link']){
 const pairs=[];
 for(let a=0;a<8;a++)for(let b=0;b<8;b++){
  if(a===b||a===phase.blocked||b===phase.blocked)continue;
  const distance=Math.min(wrap(a-phase.anchorCenter),wrap(phase.anchorCenter-a));
  if(include.includes('anchor')&&distance>1)continue;
  if(include.includes('seal')&&phase.seals[b]!==phase.targetSeal)continue;
  if(include.includes('link')&&linkedTarget(phase.rule,a,previous)!==b)continue;
  pairs.push([a,b]);
 }
 return pairs;
}
export const LINKED_STAGES=plans.map((plan,index)=>{
 let previous=0;
 const phases=plan.map((rule,phaseIndex)=>{
  const target=linkedTarget(rule,rule.a,previous),seals=DIRECTIONS.map((_,i)=>(i+index+phaseIndex)%4);
  const phase={anchorCenter:wrap(rule.a-1),targetSeal:seals[target],seals,rule:{kind:rule.kind,steps:rule.steps,...(rule.axis?{axis:rule.axis}:{})},blocked:rule.blocked??null};
  const found=linkedCandidates(phase,previous);
  if(found.length!==1||found[0][0]!==rule.a||found[0][1]!==target)throw Error(`LINKED_PHASE_INVALID:${index+31}:${phaseIndex+1}`);
  previous=target;return phase;
 });
 return {id:index+31,arc:Math.floor(index/5)+7,checkpoint:(index+1)%5===0,phases};
});
