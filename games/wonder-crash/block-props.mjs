// Original WeightPlay stationery. UI images and Battle use these same parts.
// [x,y,z,width,height,depth,color], centered, longest dimension about 1.
export const PROP_REVISION = 'block-props-v1';
export const PROP_KEYS = ['eraser','pencil','ruler','damage','cooldown','double','size','repair','coin','wall','settings','diamond','crit'];
const C={ivory:'#f2edda',blue:'#2585c2',dark:'#17466d',gold:'#efb741',light:'#ffe798',teal:'#3ccdbb',stone:'#6b8f9e'};
export function propParts(kind){
  const p=[];const b=(x,y,z,w,h,d,c)=>p.push([x,y,z,w,h,d,c]);
  const add=(name,x=0,y=0,z=0,s=1)=>{for(const a of propParts(name))p.push([a[0]*s+x,a[1]*s+y,a[2]*s+z,a[3]*s,a[4]*s,a[5]*s,a[6]]);};
  if(kind==='eraser'){
    b(0,0,0,.56,1,.3,C.ivory);b(0,-.13,.005,.585,.55,.32,C.blue);
    b(0,.13,.173,.585,.045,.016,'#bce8f4');b(0,-.39,.173,.585,.045,.016,C.dark);
    b(0,-.12,.178,.2,.18,.018,C.light);b(0,-.12,.19,.105,.09,.012,C.gold);
    b(-.19,.32,.158,.045,.2,.012,'#fffbee');b(.21,-.13,.17,.035,.43,.02,'#53b8e9');
  }else if(kind==='pencil'){
    b(0,-.01,0,.24,.86,.23,C.gold);b(-.08,-.01,.123,.045,.86,.018,C.light);
    b(0,.47,0,.26,.09,.25,'#94c4d3');b(0,.56,0,.24,.1,.23,'#ef8592');
    b(0,-.48,0,.21,.1,.2,'#e8c794');b(0,-.56,0,.15,.07,.14,'#e8c794');b(0,-.63,0,.08,.08,.075,'#263f51');
  }else if(kind==='ruler'){
    b(0,0,0,.32,1.2,.12,C.teal);b(-.12,0,.065,.025,1.16,.012,'#95f3d3');
    for(let i=0;i<11;i++)b(.1-(i%5===0?.025:0),-.5+i*.1,.072,i%5===0?.13:.08,.018,.012,C.dark);
    b(-.035,.47,.075,.065,.065,.012,C.gold);
  }else if(kind==='coin'){
    b(0,0,0,.7,.7,.18,C.gold);b(0,0,.1,.54,.54,.035,C.light);b(0,0,.127,.38,.38,.026,'#d99b2b');
    b(0,0,.15,.09,.3,.024,C.light);b(0,0,.15,.3,.09,.024,C.light);
    b(-.38,-.3,-.2,.22,.22,.16,C.gold);b(.36,-.28,-.14,.2,.2,.15,C.gold);
  }else if(kind==='diamond'){
    b(0,0,0,.58,.58,.32,'#54daf5');b(0,0,.18,.34,.34,.06,'#b8f8ff');
    b(0,.35,0,.28,.13,.22,'#85edff');b(0,-.35,0,.28,.13,.22,'#2496bc');
    b(-.35,0,0,.13,.28,.22,'#46bedf');b(.35,0,0,.13,.28,.22,'#20a4ce');
  }else if(kind==='wall'||kind==='repair'){
    for(let row=0;row<3;row++)for(let col=0;col<3;col++)b((col-1)*.28,(row-1)*.23,0,.26,.21,.28,(row+col)%2?C.stone:'#98b2b7');
    for(const x of [-.28,.28])b(x,.4,0,.26,.12,.28,C.light);
    if(kind==='repair'){b(0,0,.18,.18,.56,.08,C.teal);b(0,0,.18,.56,.18,.08,C.teal);}
    else {b(0,0,.18,.2,.32,.06,C.gold);b(0,.02,.22,.085,.15,.035,C.light);}
  }else if(kind==='cooldown'){
    b(0,0,0,.7,.7,.19,C.dark);b(0,0,.11,.58,.58,.035,C.ivory);
    b(0,.13,.15,.055,.28,.024,C.blue);b(.12,0,.15,.25,.055,.024,C.blue);
    b(0,.44,0,.2,.13,.18,C.gold);b(.39,.29,0,.13,.15,.18,C.teal);
    for(const x of [-.34,-.44])b(x,-.32,.12,.055,.15,.04,C.light);
  }else if(kind==='settings'){
    b(0,0,0,.55,.55,.22,C.stone);b(0,0,.13,.3,.3,.04,C.dark);
    for(const s of [-1,1]){b(s*.34,0,0,.19,.2,.2,C.light);b(0,s*.34,0,.2,.19,.2,C.light);}
    b(0,0,.17,.13,.13,.035,C.teal);
  }else if(kind==='double'){add('eraser',-.21,.11,0,.66);add('eraser',.24,-.12,.15,.66);
  }else if(kind==='damage'||kind==='crit'){
    add('eraser',-.08,-.03,0,.77);
    for(const [x,y,s] of [[.36,.4,.17],[.48,.19,.1],[.27,.54,.08]])b(x,y,.14,s,s,s,kind==='crit'?'#ff8355':C.gold);
    b(.29,.31,.13,.08,.43,.08,kind==='crit'?'#ff7048':C.light);
  }else if(kind==='size'){add('eraser',-.12,.04,0,.9);b(.37,.27,.06,.09,.4,.09,C.teal);b(.37,.43,.06,.25,.09,.09,C.teal);b(.37,.11,.06,.25,.09,.09,C.teal);
  }else throw Error('Unknown block prop: '+kind);
  return p;
}
