// Isolated chapter data/model. Not loaded by the public campaign.
// Coordinates are world-space row/column 0..2 in every locale.
const relations=[
 [['a','L1','b'],['b','U1','c']],[['b','L1','a'],['a','U1','c']],[['a','U1','b'],['b','L1','c']],[['c','L1','b'],['a','U1','b']],[['a','L1','b'],['c','U1','a']],
 [['a','L2','b'],['b','U1','c']],[['b','L2','a'],['a','U1','c']],[['a','U2','b'],['b','L1','c']],[['c','U2','b'],['a','L1','b']],[['a','L2','b'],['c','U2','a']],
 [['a','MX','b'],['b','U1','c']],[['b','MX','c'],['a','U1','b']],[['a','MY','b'],['b','L1','c']],[['b','MY','c'],['a','L1','b']],[['a','MX','b'],['b','MY','c']],
 [['a','D1','b'],['b','L1','c']],[['b','D1','a'],['a','U1','c']],[['a','D2','b'],['c','L1','b']],[['c','D2','b'],['a','U1','b']],[['a','D1','b'],['b','D1','c']],
 [['a','O','b'],['b','L1','c']],[['b','O','c'],['a','U1','b']],[['a','O','b'],['c','L2','b']],[['a','O','c'],['b','U2','c']],[['a','O','b'],['b','D1','c']],
 [['a','MX','b'],['b','D1','c']],[['a','MY','b'],['c','L2','a']],[['a','D2','b'],['b','MY','c']],[['a','O','b'],['b','L2','c']],[['a','MX','b'],['b','D2','c']]
];
const animalSets=[['fox','owl','rabbit'],['deer','otter','hare'],['bear','mole','fox'],['owl','rabbit','deer'],['hare','bear','otter'],['mole','fox','deer']];
const coordinates=Array.from({length:9},(_,n)=>[Math.floor(n/3),n%3]);
export function relationHolds(stars,[subject,relation,object]){
 const a=stars.find(s=>s.animal===subject),b=stars.find(s=>s.animal===object);if(!a||!b||a.row===b.row&&a.col===b.col)return false;
 switch(relation){
  case 'L1':return a.row===b.row&&a.col+1===b.col;case 'L2':return a.row===b.row&&a.col+2===b.col;
  case 'U1':return a.col===b.col&&a.row+1===b.row;case 'U2':return a.col===b.col&&a.row+2===b.row;
  case 'MX':return a.row===b.row&&a.col+b.col===2;case 'MY':return a.col===b.col&&a.row+b.row===2;
  case 'D1':return a.row+1===b.row&&a.col+1===b.col;case 'D2':return a.row+2===b.row&&a.col+2===b.col;
  case 'O':return a.row+b.row===2&&a.col+b.col===2;default:throw Error('UNKNOWN_RELATION');
 }
}
export const assess=(map,option)=>map.clues.map(clue=>relationHolds(option.stars,clue));
const allBoards=animals=>coordinates.flatMap(([ra,ca],a)=>coordinates.flatMap(([rb,cb],b)=>a===b?[]:coordinates.flatMap(([rc,cc],c)=>a===c||b===c?[]:[[{animal:animals[0],row:ra,col:ca},{animal:animals[1],row:rb,col:cb},{animal:animals[2],row:rc,col:cc}]])));
const movement=(x,y)=>x.reduce((sum,p,i)=>sum+Math.abs(p.row-y[i].row)+Math.abs(p.col-y[i].col),0);
export function makeMirrorMap(number){
 if(!Number.isInteger(number)||number<31||number>60)throw RangeError('INVALID_MAP');
 const i=number-31,animals=animalSets[i%animalSets.length],names={a:animals[0],b:animals[1],c:animals[2]},clues=relations[i].map(([a,r,b])=>[names[a],r,names[b]]),boards=allBoards(animals);
 const matches=boards.map(stars=>({stars,verdict:clues.map(clue=>relationHolds(stars,clue))})),solutions=matches.filter(v=>v.verdict.every(Boolean));
 if(!solutions.length)throw Error(`NO_SOLUTION_${number}`);
 const solution=solutions[(i*7)%solutions.length].stars;
 const wrong=[0,1].map(failed=>matches.filter(v=>v.verdict[failed]===false&&v.verdict[1-failed]===true).sort((x,y)=>movement(x.stars,solution)-movement(y.stars,solution))[0]?.stars);
 if(wrong.some(v=>!v))throw Error(`MISSING_SINGLE_CLUE_DECOY_${number}`);
 const options=[solution,...wrong].map((stars,j)=>({id:`mirror-${number}-option-${j+1}`,slot:j+1,stars}));
 return {number,arc:Math.floor(i/5)+1,checkpoint:number%5===0,animals,clues,options,correctId:options[0].id};
}
export const MIRROR_COUNT=30;
export const createMirrorMaps=()=>Object.freeze(Array.from({length:MIRROR_COUNT},(_,i)=>makeMirrorMap(i+31)));
