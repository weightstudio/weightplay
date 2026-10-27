// One simulation owns both the visible aim and live flight. Coordinates retain
// the original logical plane: x right, y down, starting platform at y = 0.
export const LEGACY_COURSES = [
  {gap:[300,340,320,370],rise:[0,25,0,35],width:190,wind:0,color:'#7cebc5'},
  {gap:[350,390,330,420],rise:[30,60,15,55],width:166,wind:0,color:'#ffcb78'},
  {gap:[400,350,440,390],rise:[65,90,45,100],width:148,wind:0,color:'#9bc8ff'},
  {gap:[380,440,400,460],rise:[30,55,80,40],width:140,wind:.018,color:'#c7b0ff'},
  {gap:[420,360,450,400],rise:[75,35,90,55],width:112,wind:0,color:'#ffb0b9'},
  {gap:[440,400,480,450],rise:[65,110,45,95],width:120,wind:-.018,color:'#ffe18f'},
];
export const legacyEncounters = LEGACY_COURSES.map((course,index)=>({
  id:index+1,arc:0,legacy:true,color:course.color,encounters:course.gap.map((gap,i)=>({
    id:`${index+1}.${i+1}`,gap,rise:course.rise[i],width:course.width,wind:course.wind,
    rings:[],roofs:[],fields:[],silence:[],motion:null,polarity:0,receiverSign:0,
  })),
}));
export function shot(force,nozzle='direct') {
  const speed={vx:2.7+force*.026,vy:-3.8-force*.024};
  return nozzle==='loft'?{vx:speed.vx*.78,vy:speed.vy*1.24}:speed;
}
export function targetAt(c,time=0) {
  const wave=c.motion?Math.sin((time+(c.motion.phase||0))*Math.PI*2/c.motion.period)*c.motion.amplitude:0;
  return {x:190+c.gap+(c.motion?.axis==='x'?wave:0),y:-c.rise+(c.motion?.axis==='y'?wave:0)};
}
export function launchState(c,force,nozzle='direct',time=0) {
  return {x:190,y:-36,...shot(force,nozzle),age:0,time,sign:c.polarity||0,cells:c.polarity?1:0,ring:0,pulses:0,status:'flying',reason:null};
}
export function canInvert(f,c) {
  return f?.status==='flying'&&Boolean(c.polarity)&&f.cells>0&&!c.silence.some(zone=>f.x>=zone[0]&&f.x<=zone[1]);
}
export function invert(f,c) {
  if(!canInvert(f,c))return null;
  return {...f,sign:-f.sign,cells:f.cells-1,pulses:f.pulses+1};
}
function intersectsSegment(a,b,box){
  let low=0,high=1;
  for(const [start,delta,min,max]of [[a.x,b.x-a.x,box.x-26,box.x+box.width+26],[a.y,b.y-a.y,box.y-34,box.y+box.height+34]]){
    if(Math.abs(delta)<1e-9){if(start<min||start>max)return false;continue;}
    const lo=(min-start)/delta,hi=(max-start)/delta;
    low=Math.max(low,Math.min(lo,hi));high=Math.min(high,Math.max(lo,hi));
    if(low>high)return false;
  }
  return true;
}
export function stepFlight(before,c) {
  if(before.status!=='flying')return before;
  const f={...before,x:before.x+before.vx,y:before.y+before.vy,age:before.age+1};
  const wind=c.wind+c.fields.reduce((sum,z)=>sum+(f.x>=z.x&&f.x<=z.x+z.width?z.wind:0),0);
  f.vx+=wind;f.vy+=.24;
  const fail=reason=>({...f,status:'miss',reason});
  if(c.roofs.some(box=>intersectsSegment(before,f,box)))return fail('roof');
  for(let i=f.ring;i<c.rings.length;i++){
    const r=c.rings[i];if(before.x>r.x||f.x<r.x)break;
    const y=before.y+(f.y-before.y)*(r.x-before.x)/(f.x-before.x);
    if(Math.abs(y-r.y)>r.radius-34)return fail('ring');
    if(r.sign&&f.sign!==r.sign)return fail('polarity');
    f.ring=i+1;if(r.relay)f.cells=1;
  }
  const previousTarget=targetAt(c,before.time+before.age),target=targetAt(c,f.time+f.age);
  const previousDistance=before.y-(previousTarget.y-36),distance=f.y-(target.y-36);
  if(f.vy>0&&previousDistance<=0&&distance>=0){
    const ratio=-previousDistance/(distance-previousDistance),x=before.x+(f.x-before.x)*ratio;
    const targetX=previousTarget.x+(target.x-previousTarget.x)*ratio;
    if(Math.abs(x-targetX)<=c.width/2-22){
      if(f.ring<c.rings.length)return fail('ring');
      if(c.receiverSign&&c.receiverSign!==f.sign)return fail('polarity');
      return {...f,x,y:target.y-36,status:'landed'};
    }
    f.reason=x<targetX?'short':'long';
  }
  if(f.y>195||f.x>1100||f.age>=240)return fail(f.reason||(f.x>target.x+c.width/2-22?'long':'short'));
  return f;
}
export function simulate(c,force,nozzle='direct',time=0,pulseXs=[]) {
  let f=launchState(c,force,nozzle,time),pulse=0;const path=[f];
  while(f.status==='flying'){
    if(pulse<pulseXs.length&&f.x>=pulseXs[pulse]){const next=invert(f,c);if(next){f=next;pulse++;}}
    f=stepFlight(f,c);path.push(f);
  }
  return {flight:f,path,hit:f.status==='landed',reason:f.reason};
}
// Preview assumes an inversion at each visible suggested mark. Marks never
// execute actions: the live flight still requires a real E/button press.
export function suggestedPulseWindows(c) {
  if(!c.polarity)return [];
  const needs=[];let sign=c.polarity,previous=190;
  for(const r of [...c.rings,{x:190+c.gap-24,sign:c.receiverSign}]){
    if(r.sign&&r.sign!==sign){
      const start=previous+10,end=r.x-10;
      const choices=Array.from({length:21},(_,i)=>start+(end-start)*i/20).filter(x=>!c.silence.some(z=>x>=z[0]-8&&x<=z[1]+8));
      if(!choices.length)return null;
      needs.push(choices[Math.floor(choices.length/2)]);sign=r.sign;
    }
    previous=r.x;
  }
  return needs;
}
