export const GRAPH_VERSION = 1;
const modules = {
 R:{p:{S:[0,0,0],A:[-1.2,1,.1],B:[1.1,1.5,.3],C:[-1.2,2.5,.1],E:[0,4,0],O:[-2.1,3.5,.1]},e:['S A 16','A C 18','C E 24','S B 20','B E 26','C O 10','O E 18'],pin:'C'},
 F:{p:{S:[0,0,0],A:[-1.2,1,.2],B:[1.2,1.3,.2],C:[-1.2,2.2,.1],D:[1.2,2.6,-.1],J:[0,3.4,0],E:[0,4.6,0],O:[-2,3.4,0]},e:['S A 16','A C 16','C J 16','J E 16','S B 25','B D 25','D E 25','C O 12','O J 12'],pin:'C'},
 T:{p:{S:[0,0,0],A:[-1,1,0],B:[-2,1,.2],C:[-3,2,.1],E:[-3,3.2,0],U:[-1.5,2.2,.2],V:[-2.4,2.5,.1],O:[-3.8,2,.1]},e:['S A 16','A B 16','B C 16','C E 16','A U 20','U V 20','V E 20','C O 8'],pin:'C'},
 Z:{p:{S:[0,0,0],A:[1,1,0],B:[-.4,2,.2],C:[1,3,0],E:[0,4,0],U:[-1.4,1.6,.2],O:[-1.6,2.5,.1]},e:['S A 16','A B 16','B C 16','C E 16','A U 22','U C 26','B O 12','O C 14'],pin:'A'},
 O:{p:{S:[0,0,0],A:[0,1,.2],B:[0,2,.8],E:[0,3,1.6],L:[-1,2,0],R:[-1,3,.8]},e:['S A 16','A B 24','B E 38','A L 16','L R 16','R E 16'],pin:'A'},
 H:{p:{S:[0,0,0],A:[-1,1,.1],B:[0,2,.2],E:[0,3.2,0],Q:[1,2,.2],U:[-1.5,2.3,.1]},e:['S A 16','A B 16','B E 16','B Q 8','A U 24','U E 24'],pin:'B'}
};
// Fully authored topology and modifiers. No random gameplay or automatic difficulty multiplier.
const content = [
 ['F',{st:'1.O'}],
 ['F ~T',{st:'2.O'}],
 ['H Z',{st:'2.O',cargo:[['1.Q','1.E','mail']]}],
 ['O ~F',{st:'2.O',pin:'1.A 2.C'}],
 ['F H',{st:'1.O',pin:'1.J',cargo:[['2.Q','2.E','bird']]}],
 ['~R T',{revision:2,st:'1.O 2.O',wet:'1.S-B 1.B-E',pin:'2.C'}],
 ['T ~O',{st:'1.O',wet:'1.A-B 1.B-C',pin:'2.A'}],
 ['Z F',{st:'1.O 2.O',frag:'1.B',wet:'2.A-C',pin:'2.C'}],
 ['H ~T',{st:'2.O',cargo:[['1.Q','2.E','supply']],wet:'2.B-C',safe:'2.C'}],
 ['T H ~Z',{st:'1.O 3.O',cargo:[['2.Q','3.E','cloth']],frag:'3.B',safe:'3.C'}],
 ['F ~F',{st:'1.O 2.O',wind:'1.S-B 2.S-B'}],
 ['T Z',{st:'1.O 2.O',safe:'1.A 2.A',wind:'1.A-B 2.A-B',phase:{'2.A-B':3}}],
 ['H F',{st:'2.O',cargo:[['1.Q','2.E','supply']],wind:'2.S-B'}],
 ['O ~T F',{st:'2.O 3.O',pin:'1.A 2.C 3.C',safe:'2.A',wind:'2.A-B'}],
 ['Z ~H O',{st:'1.O',cargo:[['2.Q','3.E','flag']],safe:'3.A',wind:'3.A-B'}],
 ['F T',{revision:2,st:'1.O 2.O',cold:'1.E',safe:'2.U',cost:{'2.A-B':26,'2.B-C':20,'2.C-E':20},extra:[['2.U','2.C',24]]}],
 ['Z ~F H',{st:'1.O 2.O 3.Q',cold:'1.E',safe:'2.A'}],
 ['H ~T',{st:'2.O',cargo:[['1.Q','2.E','heat']],cold:'1.E',safe:'2.A',wet:'2.B-C'}],
 ['O Z ~F',{st:'2.O 3.O',cold:'1.E',safe:'2.A',frag:'2.B',pin:'3.C'}],
 ['H T ~H',{st:'2.O',cargo:[['1.Q','1.E','bird'],['3.Q','3.E','hare']],cold:'2.E',safe:'3.A'}],
 ['F H',{revision:2,st:'1.O 2.Q',anchor:[['1.A','a']],extra:[['1.A','1.E',28,['a']],['1.A','1.O',20,['a']]],gate:{'1.D-E':['a']}}],
 ['T ~F O',{st:'1.O 2.O',anchor:[['1.C','a'],['2.A','b',['a']]],gate:{'3.B-E':['b']}}],
 ['F H ~T',{st:'1.O 3.O',anchor:[['1.A','a']],cargo:[['2.Q','3.E','supply']],gate:{'3.A-U':['a']},wet:'3.A-B 3.B-C',safe:'3.C'}],
 ['Z O ~F',{st:'1.O 3.O',anchor:[['1.A','a']],safe:'2.A',gate:{'2.A-B':['a']},wind:'2.A-B'}],
 ['T ~Z H O',{st:'1.O 2.O',anchor:[['1.C','a'],['2.C','b']],cargo:[['3.Q','4.E','supply',['a','b']]],safe:'4.A',wind:'4.A-B'}],
 ['~F T O',{st:'1.O 2.O',wet:'1.B-D 1.D-E',safe:'2.A',wind:'2.A-B',pin:'1.C 3.A 3.L'}],
 ['H ~Z T',{st:'2.O 3.O',cargo:[['1.Q','3.E','mail']],cold:'1.E',safe:'2.A 3.C',frag:'2.B'}],
 ['O ~F Z T',{st:'2.O 3.O 4.O',pin:'1.A 2.C 3.B 4.C',wet:'2.B-D 2.D-E',safe:'4.A',wind:'4.A-B'}],
 ['F ~T O H',{st:'1.O 2.O',anchor:[['1.A','a'],['2.C','b']],cargo:[['4.Q','4.E','beacon']],cold:'2.E',safe:'3.A',gate:{'3.A-B':['a','b']},wind:'3.A-B'}],
 ['H ~F T Z O',{revision:2,st:'2.O 3.O',cargo:[['1.Q','1.E','bird'],['4.O','5.E','beacon']],anchor:[['2.A','a'],['3.C','b']],cold:'3.E 4.E',safe:'4.U 5.L',extra:[['2.A','2.E',28,['a']],['4.O','4.U',16],['5.A','5.E',32,['a','b']]],wind:'5.A-E',gate:{'5.B-E':['a','b']}}]
];
const tokens = s => (s || '').split(' ').filter(Boolean);
const duration = cost => cost <=16 ? .8 : cost <=26 ? 1 : 1.2;
export function buildLevel(number) {
 if(!Number.isInteger(number)||number<1||number>30) throw new RangeError('stage');
 const [chain,opts] = content[number-1], nodes={}, edges=[], sectors=[], aliases={};
 let offset=[0,0,0], previous=null;
 chain.split(' ').forEach((tag,i)=>{
  const shape=modules[tag.replace('~','')], mirror=tag.startsWith('~')?-1:1, prefix=`${i+1}.`, ids=[];
  for(const [name,p] of Object.entries(shape.p)){
   const key=prefix+name;
   if(name==='S'&&previous){aliases[key]=previous;ids.push(previous);continue;}
   nodes[key]={id:key,p:[offset[0]+p[0]*mirror,offset[1]+p[1],offset[2]+p[2]],sector:i,safe:name==='S'||name==='E',pinSeat:number>=4&&name===shape.pin};aliases[key]=key;ids.push(key);
  }
  for(const s of shape.e){const[a,b,c]=s.split(' ');edges.push({a:aliases[prefix+a],b:aliases[prefix+b],cost:+c,duration:duration(+c),key:`${prefix}${a}-${b}`});}
  previous=prefix+'E';offset=nodes[previous].p;sectors.push({type:tag,ids,start:aliases[prefix+'S'],end:previous});
 });
 const at=id=>nodes[aliases[id]];
 const each=(s,fn)=>tokens(s).forEach(id=>{if(!at(id))throw new Error(`Invalid ${number}:${id}`);fn(at(id));});
 each(opts.safe,n=>n.safe=true);each(opts.cold,n=>{n.safe=true;n.cold=true;});each(opts.frag,n=>n.fragile=true);each(opts.st,n=>n.stamp=true);
 if(opts.pin){Object.values(nodes).forEach(n=>n.pinSeat=false);each(opts.pin,n=>n.pinSeat=true);}
 (opts.anchor||[]).forEach(([id,flag,needs=[]])=>{Object.assign(at(id),{safe:true,anchor:flag,needs});});
 const cargo=(opts.cargo||[]).map(([from,to,kind,needs=[]],i)=>{at(from).cargo=i;return {id:i,from:aliases[from],to:aliases[to],kind,needs};});
 for(const [a,b,cost,needs=[]]of opts.extra||[])edges.push({a:aliases[a],b:aliases[b],cost,duration:duration(cost),key:a+'-'+b.split('.')[1],needs});
 for(const e of edges){e.cost=opts.cost?.[e.key]??e.cost;e.duration=duration(e.cost);e.wet=tokens(opts.wet).includes(e.key);e.wind=tokens(opts.wind).includes(e.key);e.phase=opts.phase?.[e.key]||0;e.needs=opts.gate?.[e.key]||e.needs||[];}
 Object.values(nodes).forEach(n=>{if(n.safe)n.pinSeat=false;});
 return {number,revision:opts.revision||GRAPH_VERSION,id:`hightrail-${String(number).padStart(2,'0')}`,region:Math.floor((number-1)/5),nodes,edges,sectors,cargo,start:'1.S',end:previous,stamps:Object.values(nodes).filter(n=>n.stamp).map(n=>n.id),anchors:Object.values(nodes).filter(n=>n.anchor).map(n=>n.anchor),pins:number>=4?1:0};
}
export const LEVELS = Array.from({length:30},(_,i)=>buildLevel(i+1));
export function stageConfig({text,profile,poster,thumbnail}) {
 return {poster,background:'/assets/lobby-block-atmosphere.svg',count:30,stage(index){const level=LEVELS[index],cleared=profile.clearedIds.includes(level.id),locked=index+1>profile.highestUnlocked;return{id:level.id,kicker:`${text.regionNames[level.region]} · ${index+1}/30`,title:text.stageNames[index],subtitle:[text.exit,level.cargo.length?`${text.cargo} ${level.cargo.length}`:'',level.anchors.length?`${text.anchor} ${level.anchors.length}`:''].filter(Boolean).join(' · '),status:locked?text.locked:cleared?text.cleared:text.ready,summary:text.mechanisms[level.region],details:[text.seals,`${profile.best[level.id]?.filter(Boolean).length||0}/3`],locked,cleared,poster:thumbnail?.(index)||poster,rewardState:cleared?'claimed':'available'};}};
}
