import * as THREE from './vendor/three/three.module.min.js';

// Authored Block Animals meshes. All pieces use the renderer's shared bevelled
// geometry and instance batches; this module owns no GPU resources or game state.
const C={ink:0x283b3d,cream:0xffe5b5,gold:0xd7aa53,white:0xfffaf0};
function sculpt(r,root){
  return (w,h,d,color,x=0,y=0,z=0,glow=false,tilt=0)=>{
    const m=r.box(root,w,h,d,color,x,y,z,glow);m.rotation.z=tilt;return m;
  };
}
function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
function face(r,root,{fur,light=C.cream,iris=0x318d94,owl=false,bear=false,stern=false}){
  const b=sculpt(r,root);
  b(.94,.78,.70,fur);
  // Eye whites, iris, pupil and one catchlight stay in front of the head.
  for(const s of [-1,1]){
    if(owl)b(.43,.49,.09,light,s*.235,-.005,.35);
    else b(.23,.19,.10,light,s*.36,-.21,.36);
    b(.28,.31,.07,C.ink,s*.22,.065,.374);
    b(.225,.25,.045,C.white,s*.22,.062,.417);
    b(.115,.185,.03,iris,s*.195,.045,.446);
    b(.058,.14,.025,C.ink,s*.183,.04,.463);
    b(.045,.055,.018,C.white,s*.207,.10,.48);
    b(.30,.065,.085,fur,s*.22,.255,.41,false,s*(stern?.20:.09));
  }
  if(owl){
    b(.15,.19,.18,C.gold,0,-.14,.45,false,.12);
  }else{
    b(bear?.54:.60,.23,.20,light,0,-.225,.40);
    b(.145,.105,.095,C.ink,0,-.105,.523);
    b(.04,.07,.025,C.ink,0,-.205,.517);
    for(const s of [-1,1])b(.12,.025,.026,C.ink,s*.055,-.25,.522,false,s*.10);
  }
}
function ears(r,head,fur,kind='point'){
  const b=sculpt(r,head);
  for(const s of [-1,1]){
    const tall=kind==='point';
    b(tall?.25:.29,tall?.36:.26,.24,fur,s*.36,.49,-.015,false,-s*.12);
    b(tall?.14:.17,tall?.21:.14,.035,0xe9bda0,s*.36,.49,.12,false,-s*.12);
    if(tall)b(.15,.13,.19,fur,s*.40,.70,-.025,false,-s*.12);
  }
}
function badge(r,root,color,x,y,z,size=.19){const b=sculpt(r,root);b(size,size,.065,C.gold,x,y,z,false,Math.PI/4);b(size*.48,size*.48,.035,color,x,y,z+.045,true,Math.PI/4);}
function staff(r,root,color){
  const b=sculpt(r,root);b(.10,1.62,.11,0x745338,.74,.94,.12);
  b(.26,.09,.23,C.gold,.74,1.63,.12);
  b(.24,.29,.23,color,.74,1.84,.12,true,Math.PI/4);
}
function shell(r,root,color,trim){
  const b=sculpt(r,root);b(1.12,.70,.79,color,0,.72,-.15);
  b(.87,.18,.63,trim,0,1.13,-.15);
  for(const s of [-1,1])b(.24,.46,.76,trim,s*.48,.74,-.15);
  b(.39,.11,.42,color,0,1.275,-.16);
}
const palettes={
  scout:[0x9eb97a,0x3c6b55,0xead59b],shield:[0x90b36c,0x426747,0xe0c477],
  charger:[0xb98559,0x604537,0xf5d28e],mender:[0xa496c2,0x5a557e,0xb3e7bd],
  caller:[0x709a94,0x385f64,0x8fddd0],brute:[0x9b7858,0x594936,0xbcc78c],
  mirror:[0x9acfdc,0x506f9a,0xc5eff2],thorn:[0xa3b66b,0x526b45,0xd7c394],
  emberling:[0xde9257,0x9b5342,0xffd06b],frostguard:[0xb4d9dc,0x557f97,0xdaeee7],
  siphon:[0xad93bd,0x615477,0xd3b4eb],
  'boss-bell':[0xc6a05c,0x73603d,0xf2db9c],
  'boss-furnace':[0xaf7956,0x52545a,0xffba69],
  'boss-stag':[0x7fafaa,0x3f746d,0xd1ebba],
  'boss-loom':[0x9ca968,0x4d684b,0xdddfa7],
  'boss-conductor':[0xb29bcf,0x655986,0xe3ceff],
  'boss-heart':[0x84baa5,0x3f7267,0xc3edc8]
};

export function buildEnemy(r,e){
  const g=new THREE.Group();g.userData.uid=e.uid;
  const family=e.id.startsWith('mirror')?'mirror':e.id;
  const [fur,cloth,accent]=palettes[family]||palettes.scout,b=sculpt(r,g);
  const object=['anchor','root-drain','root-crack'].includes(e.id);
  const stag=['charger','boss-stag'].includes(e.id);
  const turtle=e.id==='shield';
  const low=e.id==='emberling';
  const owl=['mender','caller','boss-conductor','mirror'].includes(family);
  const bear=['brute','boss-bell','boss-furnace','boss-heart'].includes(e.id);
  const contact=new THREE.Mesh(r.contactGeometry,r.contactMaterial);
  contact.rotation.x=-Math.PI/2;contact.scale.set(1,.60,1);contact.position.y=.012;g.add(contact);
  if(object){
    b(.80,.18,.75,cloth,0,.1);b(.50,.85,.48,fur,0,.58);
    b(.62,.12,.60,accent,0,1.03);badge(r,g,0x79ddc0,0,.68,.27,.28);
    const core=b(.32,.32,.32,accent,0,1.34,0,true,Math.PI/4);g.userData.core=core;
    for(const s of [-1,1])b(.44,.13,.20,cloth,s*.38,.14,.10,false,s*.22);
  }else if(stag||turtle||low){
    if(turtle)shell(r,g,cloth,accent);
    else{
      b(.92,.63,1.08,fur,0,.73,-.13);
      b(.72,.16,.87,cloth,0,1.08,-.18);
      b(.34,.12,.65,accent,0,1.22,-.24);
    }
    const h=group(g,0,turtle?1.30:low?1.10:1.62,.36);
    h.scale.setScalar(low?.82:turtle?.78:.90);
    face(r,h,{fur,light:accent,iris:stag?0x387879:0x547b54});
    if(stag){
      ears(r,h,fur);
      const hb=sculpt(r,h);
      for(const s of [-1,1]){
        hb(.13,.60,.13,accent,s*.24,.62,-.12,false,-s*.26);
        hb(.12,.45,.12,accent,s*.43,.99,-.12,false,s*.33);
        hb(.28,.10,.11,accent,s*.40,.81,-.12);
        if(e.boss)hb(.10,.27,.10,accent,s*.64,1.19,-.12,false,-s*.20);
      }
    }
    const legs=[];
    for(const s of [-1,1])for(const f of [-1,1]){
      const leg=group(g,s*.36,.53,f*.34-.12),lb=sculpt(r,leg);
      lb(.23,.35,.26,fur,0,-.18);lb(.28,.18,.36,cloth,0,-.43,.035);
      legs.push({group:leg,phase:(s===f?0:Math.PI)});
    }
    g.userData.quadrupedLegs=legs;
    const tail=group(g,0,.78,-.66),tb=sculpt(r,tail);g.userData.tail=tail;
    tb(.22,.18,.36,fur,0,0,-.11);
    if(low){tb(.20,.40,.20,accent,0,.19,-.28,true,-.2);tb(.12,.20,.13,0xffe6a0,.045,.45,-.28,true,-.15);}
    else if(stag)tb(.18,.16,.22,accent,0,-.03,-.29);
    badge(r,g,accent,0,turtle?.99:.90,.44,.17);
  }else{
    // A broad expressive head, short legs and stepped clothing replace the
    // old tall doll silhouette. The joints remain real animation pivots.
    b(.74,.74,.58,cloth,0,.90);
    b(.53,.57,.065,accent,0,.91,.32);
    b(.81,.13,.64,cloth,0,.53);
    for(const s of [-1,1]){
      b(.26,.36,.29,fur,s*.23,.28);
      b(.33,.18,.44,cloth,s*.24,.12,.08);
      b(.23,.075,.075,accent,s*.24,.125,.305);
      const arm=group(g,s*.52,1.10,0),ab=sculpt(r,arm);
      ab(.27,.45,.32,fur,0,-.19);ab(.32,.22,.35,cloth,0,-.42,.05);
      ab(.32,.075,.36,accent,0,-.31,.05);
      if(s===1)g.userData.arm=arm;
    }
    const h=group(g,0,1.72,.035);
    face(r,h,{fur,light:bear?C.cream:accent,iris:family==='siphon'?0x9256ae:0x397977,owl,bear,stern:bear||e.boss});
    ears(r,h,fur,bear?'round':'point');
    b(.87,.14,.69,cloth,0,1.28,.025);
    b(.095,.58,.07,0x906d45,-.14,.90,.385,false,-.33);
    b(.82,.10,.67,cloth,0,.60,.02);
    b(.15,.12,.04,C.gold,-.035,.62,.38);
    badge(r,g,accent,0,1.12,.39);
    if(owl){
      for(const s of [-1,1]){
        b(.30,.61,.27,cloth,s*.50,.90,.02,false,-s*.14);
        for(let i=0;i<3;i++)b(.22,.09,.06,accent,s*.53,.90-i*.12,.20,false,s*.08);
      }
      if(family!=='mirror')staff(r,g,accent);
    }
    if(family==='scout'){
      const tail=group(g,-.43,.62,-.33),tb=sculpt(r,tail);g.userData.tail=tail;
      for(let i=0;i<3;i++)tb(.30,.21,.28,i%2?cloth:fur,-.07*i,.12*i,-.12*i);
      b(.58,.11,.74,cloth,0,2.11,.01);
      b(.14,.30,.08,0xc2d58c,-.13,2.25,.02,false,-.42);
      b(.16,.22,.08,0x8cb678,.02,2.22,.02,false,.36);
      b(.17,.26,.11,0xb5915d,-.48,.67,.29);
    }
    if(family==='thorn'||e.id==='boss-loom'){
      for(let i=-2;i<=2;i++)b(.18,.43,.24,accent,i*.20,2.17,-.14,false,-i*.18);
      for(const s of [-1,1])for(let i=0;i<3;i++)b(.18,.28,.25,accent,s*(.57+i*.07),1.20-i*.21,-.22,false,-s*.50);
    }
    if(family==='frostguard'){
      for(const s of [-1,1]){b(.36,.24,.48,cloth,s*.52,1.22);b(.16,.32,.17,accent,s*.54,1.44,0,true,s*.2);}
      b(.48,.12,.40,cloth,0,2.16,-.01);
    }
    if(family==='siphon'||family==='mirror'){
      for(const s of [-1,1])for(let i=0;i<3;i++){
        b(.26,.53-i*.10,.12,i%2?fur:cloth,s*(.62+i*.19),1.14+i*.13,-.22,false,s*.32);
        if(family==='mirror')b(.075,.30,.035,accent,s*(.62+i*.19),1.19+i*.13,-.135,true,s*.32);
      }
      if(family==='siphon')staff(r,g,accent);
      if(family==='mirror'){const core=b(.23,.23,.10,accent,0,.88,.40,true,Math.PI/4);g.userData.core=core;}
    }
    if(bear){
      for(const s of [-1,1]){b(.35,.29,.43,cloth,s*.52,1.24);b(.19,.10,.47,accent,s*.55,1.34);}
      if(e.id==='brute')for(const s of [-1,1])b(.13,.23,.12,0x98af70,s*.53,1.51,-.04,false,-s*.22);
    }
  }
  const shield=group(g,-.64,.95,.37),sb=sculpt(r,shield);
  sb(.55,.68,.13,cloth);sb(.43,.54,.06,accent,0,0,.09);sb(.065,.47,.04,cloth,0,0,.14);
  badge(r,shield,accent,0,0,.17,.14);shield.visible=e.shield>0||family==='mirror';g.userData.shield=shield;
  if(e.boss){
    if(!stag){
      b(.69,.10,.58,C.gold,0,2.16);
      for(let i=-1;i<=1;i++)b(.16,i===0?.30:.22,.16,C.gold,i*.24,2.30,0);
      badge(r,g,accent,0,2.28,.32,.13);
    }
    if(e.id==='boss-bell'){
      b(.42,.47,.42,C.gold,.73,.78,.10);b(.56,.10,.51,accent,.73,.52,.10);
      b(.07,.28,.06,cloth,.73,.64,.36);
    }
    if(e.id==='boss-furnace'){
      b(.27,.60,.27,cloth,-.39,1.78,-.36);
      b(.42,.37,.10,accent,0,.87,.41,true);
      for(let i=-1;i<=1;i++)b(.04,.40,.06,cloth,i*.11,.87,.49);
    }
    if(e.id==='boss-heart'){
      const core=b(.31,.31,.11,0x8cf1cd,0,.89,.42,true,Math.PI/4);g.userData.core=core;
      for(const s of [-1,1])b(.29,.34,.15,accent,s*.43,1.10,.32,false,s*.48);
    }
    if(e.id==='boss-loom')for(const s of [-1,1]){
      b(.21,.64,.24,cloth,s*.78,1.36,-.15,false,-s*.33);
      b(.23,.35,.15,accent,s*.92,1.73,-.15,false,-s*.48);
    }
  }
  const scale=e.boss?1.16:family==='brute'?1.10:family==='scout'?.96:1;
  g.scale.setScalar(scale);
  g.userData.authoredScale=g.scale.clone();g.userData.baseScale=g.scale.clone();g.userData.recoil=0;
  g.updateMatrixWorld(true);
  g.userData.hudTopLocal=new THREE.Box3().setFromObject(g).max.y/scale+.10;
  return g;
}

export function buildCompanion(r,id){
  const g=new THREE.Group(),b=sculpt(r,g);
  g.userData.companionId=id;g.scale.setScalar(.62);g.position.set(0,.135,.005);
  const colors={nibs:[0xd68a4c,0x287bba,0xffdeb0],moss:[0x8ac28b,0x446d51,0xd5e4ac],frost:[0xaedcde,0x537eac,0xf2f5e3],ember:[0xe79861,0xa14e42,0xffd17b]};
  const [fur,cloth,light]=colors[id]||colors.nibs;
  b(.41,.36,.31,fur,0,.25);
  b(.25,.26,.055,light,0,.25,.177);
  for(const s of [-1,1]){
    b(.15,.13,.20,light,s*.14,.065,.075);
    b(.12,.20,.15,fur,s*.25,.26,.025,false,-s*.18);
  }
  const head=group(g,0,.63,.015);head.scale.setScalar(.56);
  face(r,head,{fur,light,iris:id==='frost'?0x559abf:0x7b533e,owl:id==='frost'});
  if(id==='nibs')ears(r,head,fur,'round');
  if(id==='frost')ears(r,head,fur);
  b(.43,.08,.34,cloth,0,.40,.015);
  b(.11,.18,.07,cloth,.14,.31,.205,false,-.15);
  badge(r,g,id==='ember'?0xffc059:0x76dfd9,0,.34,.235,.095);
  if(id==='moss'){
    b(.66,.36,.27,cloth,0,.27,-.20);b(.42,.12,.28,0xa6bf70,0,.51,-.20);
    for(const s of [-1,1])b(.11,.15,.14,0x83aa65,s*.13,.59,-.21);
  }else if(id==='frost'){
    for(const s of [-1,1]){b(.20,.31,.20,cloth,s*.31,.28,0,false,-s*.23);b(.14,.07,.05,light,s*.33,.24,.12);}
  }else if(id==='ember'){
    b(.38,.14,.25,fur,.27,.18,-.19,false,.20);
    b(.16,.28,.15,light,.43,.38,-.21,true,-.16);
    b(.09,.16,.09,0xffe6a1,.46,.58,-.21,true,-.10);
    for(const s of [-1,1])b(.10,.16,.12,cloth,s*.19,.88,0,false,-s*.18);
  }
  return g;
}
