// Chapter-two candidate data and pure rules. Not reachable in the normal game.
const S=['base','middle','anchor','bridge','marker','cap'];
const rows=[
  ['MA'],['MA',null,'MB'],['MR',null,null,1],['BR',null,null,0,15],['MA','AR'],
  ['MB','BR'],['AB','MR'],['BR','MB'],['MB','AB'],['AR','AB'],
  ['AB','MR','AR'],['BR','MA','AB'],['MA','AR','AB'],['MR','MR','BR'],['AR','MB','MR'],
  ['MA','MB',null,0,15],['MA','AB',null,0,13],['AR','BR',null,0,15],['MA','MB',null,0,13],['MA','MA',null,0,14],
  ['BR','MB',null,1],['AR','AB',null,1],['MA','MB',null,1],['AB','MB',null,1],['MR','MR',null,1],
  ['AR',null,null,1,15],['MR',null,null,1,15],['AB',null,null,1,15],['MA',null,null,1,15],['MA',null,null,1,14]
];
const ids={M:'middle',A:'anchor',B:'bridge',R:'marker'};
const pair=value=>value?[...value].map(x=>ids[x]):null;
export const MOUNTAIN_PASS=Object.freeze(rows.map(([compass,gap,tether,wind,limit],i)=>Object.freeze({
  id:i+31,stones:Object.freeze([...S]),compass:Object.freeze(pair(compass)),
  gap:gap?Object.freeze(pair(gap)):null,tether:tether?Object.freeze(pair(tether)):null,
  wind:!!wind,limit:limit??null,checkpoint:(i+31)%5===0
})));
const weights={middle:2,anchor:2,bridge:1,marker:1};
const load=stack=>stack.filter(id=>Object.hasOwn(weights,id)).reduce((sum,id,index)=>sum+weights[id]*(index+1),0);
export function passContract(plan,stack,route){
  if(!plan||!Array.isArray(stack)||!['outbound','return'].includes(route))return null;
  if(stack.length>S.length||new Set(stack).size!==stack.length||stack.some(id=>!S.includes(id)))return null;
  const index=id=>stack.indexOf(id),full=stack.length===S.length;
  const ends=stack.length===0?'pending':stack[0]!=='base'||(index('cap')>=0&&index('cap')!==S.length-1)?'bad':full?'good':'pending';
  const [a,b]=route==='outbound'?plan.compass:[...plan.compass].reverse();
  const directed=index(b)<0?'pending':index(a)>=0&&index(a)<index(b)?'good':'bad';
  const result=[{kind:'ends',ids:['base','cap'],status:ends},{kind:'compass',ids:[a,b],status:directed}];
  for(const [kind,ids,distance] of [['gap',plan.gap,2],['tether',plan.tether,1],['wind',plan.wind?['bridge','marker']:null,null]]){
    if(!ids)continue;
    const [x,y]=ids,seen=index(x)>=0&&index(y)>=0;
    const valid=kind==='wind'?Math.abs(index(x)-index(y))!==1:Math.abs(index(x)-index(y))===distance;
    result.push({kind,ids,status:seen?(valid?'good':'bad'):'pending'});
  }
  if(plan.limit!==null)result.push({kind:'load',value:plan.limit,status:load(stack)>plan.limit?'bad':full?'good':'pending'});
  return result;
}
export function passValidate(plan,stack,route){const rules=passContract(plan,stack,route);return !!rules&&stack.length===S.length&&rules.every(r=>r.status==='good');}
// Exhaustively inspect at most 4! interior orders. A prefix that cannot be
// completed yields no stone; the caller controls and displays pin-use count.
export function passNext(plan,prefix,route){
  if(!passContract(plan,prefix,route))return [];
  const permute=xs=>xs.length?xs.flatMap((x,i)=>permute(xs.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]];
  const valid=permute(S.slice(1,-1)).map(mid=>['base',...mid,'cap']).filter(stack=>
    prefix.every((id,i)=>stack[i]===id)&&passValidate(plan,stack,route));
  return [...new Set(valid.map(stack=>stack[prefix.length]).filter(Boolean))];
}
