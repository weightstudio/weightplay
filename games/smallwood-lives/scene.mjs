import * as THREE from './vendor/three.module.min.js';
import {seededRandom} from './content.mjs';

// Original editable Block Animals mesh library. Every visible coloured part is
// actual world geometry; batches retain per-face lighting and contact shadows.
const cube=new THREE.BoxGeometry(1,1,1).toNonIndexed();
const ivory=0xffe4ad,wood=0x895230,darkWood=0x4b3027,leaf=0x608849,gold=0xf4b83e;
const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:.04});
class Blocks {
 constructor(){this.parts=[];}
 box(x,y,z,w,h,d,color,rx=0,ry=0,rz=0){this.parts.push({x,y,z,w,h,d,color,rx,ry,rz});return this;}
 build(){
  const positions=[],normals=[],colors=[],matrix=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3(),q=new THREE.Quaternion(),v=new THREE.Vector3(),c=new THREE.Color();
  for(const p of this.parts){q.setFromEuler(new THREE.Euler(p.rx,p.ry,p.rz));matrix.compose(new THREE.Vector3(p.x,p.y,p.z),q,new THREE.Vector3(p.w,p.h,p.d));normalMatrix.getNormalMatrix(matrix);c.setHex(p.color);
   for(let i=0;i<cube.attributes.position.count;i++){v.fromBufferAttribute(cube.attributes.position,i).applyMatrix4(matrix);positions.push(v.x,v.y,v.z);v.fromBufferAttribute(cube.attributes.normal,i).applyMatrix3(normalMatrix).normalize();normals.push(v.x,v.y,v.z);colors.push(c.r,c.g,c.b);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
 }
}
function animal(species=0,age=2,accent=0x618353){
 const root=new THREE.Group(),b=new Blocks(),colors=[0xc57838,0xf3dba6,0xe58b38,0xa6693d,0x91623e,0x9b784c],fur=colors[species]||colors[0];
 const elder=age===3,head=age===0?1.13:1,bodyHeight=age===0?.62:.84;
 b.box(0,.62,0,.68,bodyHeight,.52,fur).box(0,.7,.28,.42,.47,.045,ivory).box(0,.33,.03,.7,.17,.57,accent);
 b.box(0,1.23,.03,.88*head,.7*head,.64,fur).box(0,1.02,.41,.58,.26,.22,ivory);
 for(const side of [-1,1]){
  b.box(side*.2,.15,.1,.24,.27,.38,0x624231).box(side*.2,.035,.19,.28,.07,.43,0x3c3029);
  b.box(side*.24,1.31,.361,.25,.29,.05,ivory).box(side*.24,1.32,.393,.13,.21,.025,0x382a25).box(side*.215,1.37,.41,.055,.075,.025,0xffffff);
  b.box(side*.24,1.493,.38,.25,.06,.07,0x633a24,0,0,side*-.13);
  b.box(side*.19,1.04,.53,.18,.045,.035,0xf3bd7d);
  b.box(side*.29,1.66,0,.24,species===1?.65:.25,.25,fur).box(side*.29,species===1?1.78:1.67,.13,.13,species===1?.4:.12,.035,species===1?0xe4a3a0:ivory);
 }
 b.box(0,1.12,.555,.18,.11,.1,0x4b3026).box(0,.97,.532,.17,.035,.025,0x5c3726).box(0,.86,.36,.25,.12,.12,accent);
 for(let i=0;i<4;i++)b.box(.18-i*.09,.79-i*.085,.33,.14,.15,.08,accent,0,0,.18);
 b.box(.28,.64,-.34,.25,.35,.13,darkWood).box(.28,.66,-.415,.14,.1,.04,gold);
 if(species===0)for(let i=0;i<6;i++)b.box(.25+Math.sin(i*.45)*.3,.45+i*.19,-.4-Math.sin(i*.52)*.27,.44,.29,.38,i%2?fur:0xd79551,0,i*.04,0);
 if(species===2){for(let i=0;i<5;i++)b.box(.15+i*.14,.42-i*.015,-.38-i*.15,.28,.25,.32,i>2?ivory:fur,0,-.4,0);for(const s of [-1,1])b.box(s*.31,1.79,.02,.16,.2,.19,0x784129);}
 if(species===3)for(const s of [-1,1]){b.box(s*.32,1.94,-.04,.1,.48,.11,0xc39766);b.box(s*.49,2.08,-.04,.4,.1,.11,0xc39766,0,0,s*.23);b.box(s*.57,2.21,-.04,.09,.25,.11,0xc39766);}
 if(species===4){b.box(0,.33,-.5,.23,.14,.7,fur,.2).box(0,1.58,.3,.8,.15,.08,gold);for(const s of [-1,1])b.box(s*.23,1.63,.36,.31,.22,.06,0x41becb);b.box(.1,.56,.32,.1,.18,.035,0xf28c6d);}
 if(species===5)for(let y=0;y<5;y++)for(let x=-2;x<=2;x++)b.box(x*.16,.65+y*.19,-.26-Math.sin(y*.55)*.13,.13,.25,.28,(x+y)%2?0x59412f:0xc09d62,.35,0,x*.08);
 if(elder){for(const s of [-1,1])b.box(s*.3,.99,.45,.14,.12,.04,0xf8efd3);b.box(.57,.57,.25,.065,1.05,.065,wood).box(.54,1.1,.25,.19,.07,.08,wood);}
 const body=b.build();root.add(body);
 const arms=[];for(const side of [-1,1]){const arm=new Blocks().box(0,-.17,0,.2,.37,.25,fur).box(0,-.39,.04,.23,.15,.26,ivory).box(0,-.03,0,.23,.16,.28,accent).build();arm.position.set(side*.44,.96,.03);arm.rotation.z=side*.12;root.add(arm);arms.push(arm);}
 root.userData={arms,body,species};root.scale.setScalar(age===0?.77:age===1?.9:1);return root;
}
function orla(){
 const b=new Blocks(),r=new THREE.Group(),blue=0x334e98;
 b.box(0,.63,0,.8,.78,.57,blue).box(0,1.22,.03,.93,.68,.65,0x9c7857).box(0,1.21,.37,.78,.5,.1,ivory);
 for(const s of [-1,1]){b.box(s*.22,1.26,.447,.3,.3,.04,gold).box(s*.22,1.26,.474,.22,.22,.02,ivory).box(s*.22,1.28,.49,.12,.17,.02,0x503325).box(s*.2,1.31,.51,.045,.055,.015,0xffffff);b.box(s*.23,.12,.15,.29,.17,.37,gold);for(let i=0;i<4;i++)b.box(s*(.47+i*.08),.81-i*.13,0,.17,.24,.44,i%2?blue:0x627bb5,0,0,s*.3);}
 b.box(0,1.13,.53,.15,.16,.15,gold).box(0,1.65,0,1.18,.12,1.04,blue,0,.18).box(0,1.78,0,.75,.17,.66,blue).box(0,.7,.315,.15,.22,.045,gold);
 for(const [x,y] of [[-.16,1.74],[-.22,1.82],[-.16,1.9],[-.06,1.94],[.04,1.94]])b.box(x,y,.4,.1,.1,.08,gold);
 for(const [x,y]of[[-.46,.76],[.52,.61],[.07,.48]]){b.box(x,y,.27,.16,.045,.02,gold).box(x,y,.27,.045,.16,.02,gold);}
 b.box(.38,.45,.33,.3,.34,.18,darkWood).box(.38,.49,.44,.08,.08,.03,gold);r.add(b.build());return r;
}
export function memoryModel(index=0,complete=true){
 const b=new Blocks(),c=complete?gold:0xb7a88b,kind=index%30;
 const plank=(x,y,z,w,h,d,col=wood,rx=0,ry=0,rz=0)=>b.box(x,y,z,w,h,d,col,rx,ry,rz);
 const legs=()=>{for(const x of [-.42,.42])for(const z of [-.26,.26])plank(x,.23,z,.1,.46,.1,darkWood);};
 if(index===30){for(const x of [-.5,.5]){plank(x,.8,0,.08,1.6,.08,darkWood);plank(x,1.38,0,.4,.45,.4,c);plank(x,1.38,.23,.26,.31,.04,0xffe8a3);}return b.build();}
 if(index===31){plank(0,.65,0,1.2,1.3,.8,0x496787);for(const y of [.2,.65,1.1])plank(0,y,.46,1.1,.06,.05,0xc6eff0);for(const x of [-.55,.55])plank(x,.65,.45,.08,1.3,.1,0xa9dbdb);return b.build();}
 if(index===32){plank(0,.08,0,1.6,.16,1.2,0x466a55);for(let i=0;i<5;i++){plank(-.65+i*.31,.5,0,.06,.8,.06,darkWood);plank(-.65+i*.31,.95,0,.16,.2,.16,c);}return b.build();}
 switch(kind){
 case 0:plank(0,.3,0,1,.17,.2,0x65924c,0,0,.15);for(let i=0;i<4;i++)plank(-.28+i*.18,.4,0,.065,.018,.065,darkWood);break;
 case 1:plank(0,.55,0,.54,.7,.54,0xd29687);for(const y of [.16,.94])plank(0,y,0,.78,.1,.78,wood);plank(.5,.2,.1,.5,.055,.2,0xd29687);plank(.7,.13,.1,.08,.16,.2,0xd29687);break;
 case 2:plank(0,.3,0,1,.55,.64,0xbd905a);for(let i=0;i<5;i++)plank(-.4+i*.2,.3,.34,.08,.5,.02,ivory);for(const x of [-.45,.45])plank(x,.74,0,.08,.55,.09,darkWood);plank(0,1.02,0,.95,.09,.09,darkWood);plank(-.18,.63,0,.36,.12,.4,0xd28875);break;
 case 3:plank(0,.54,0,.06,1.04,.06,darkWood);plank(.12,.06,0,.25,.06,.06,darkWood);for(let i=0;i<4;i++)plank(0,.94+i*.07,0,1.22-i*.23,.08,1.12-i*.22,[0x648da0,0x84aab2][i%2]);plank(.35,1.02,.22,.18,.035,.18,c);break;
 case 4:for(const x of [-.48,.48])plank(x,.23,0,.12,.46,.52,darkWood);for(let i=0;i<3;i++)plank(0,.5,-.2+i*.2,1.25,.09,.17,wood);for(const x of [-.5,.5])plank(x,.73,-.3,.1,.5,.1,darkWood);plank(0,.91,-.3,1.25,.22,.1,wood);break;
 case 5:plank(0,.12,0,.7,.16,.7,0x77a298);for(const x of [-.38,.38])plank(x,.3,0,.12,.36,.8,0x77a298);for(const z of [-.38,.38])plank(0,.3,z,.7,.36,.12,0x77a298);plank(0,.22,0,.45,.1,.45,ivory);break;
 case 6:plank(0,.12,0,.9,.14,.65,wood);for(const x of [-.35,.35])plank(x,.67,0,.08,1.05,.08,darkWood);plank(0,1.18,0,.85,.1,.1,darkWood);plank(0,.85,0,.12,.4,.12,c);plank(0,.62,0,.48,.32,.38,c);plank(0,.44,0,.6,.1,.5,c);plank(0,.39,0,.08,.16,.08,darkWood);break;
 case 7:plank(0,.44,0,.13,.87,.13,darkWood,0,0,-.25);plank(.08,.91,0,.85,.32,.35,wood,0,0,-.25);plank(.39,.91,0,.09,.34,.37,c,0,0,-.25);break;
 case 8:plank(0,.6,0,.96,1.1,.13,wood);plank(0,.61,.08,.81,.9,.025,ivory);for(let y=0;y<3;y++)for(let x=0;x<3;x++)plank(-.25+x*.25,.37+y*.23,.105,.13,.12,.025,x===1&&y===1?c:0x8aaf91);break;
 case 9:for(const x of [-.42,.42]){plank(x,.15,0,.5,.12,.45,darkWood);plank(x,.55,0,.35,.65,.3,x<0?0xe8b760:0x92b7b1);plank(x,.92,0,.52,.1,.46,wood);for(const dx of [-.2,.2])plank(x+dx,.57,0,.05,.75,.34,darkWood);plank(x,1.08,0,.23,.2,.05,c);}break;
 case 10:plank(0,.56,0,.7,.7,.16,0x538789,0,0,Math.PI/4);plank(0,.56,.13,.3,.3,.1,c,0,0,Math.PI/4);for(const x of [-.18,.18])plank(x,.18,0,.18,.4,.06,0x538789,0,0,x*-.5);break;
 case 11:plank(0,.48,0,1.15,.8,.78,wood);for(const x of [-.35,.35])plank(x,.49,.405,.1,.77,.025,darkWood);plank(0,.49,.435,.2,.17,.035,c);plank(0,.91,0,.5,.08,.09,darkWood);for(const x of [-.25,.25])plank(x,.84,0,.07,.17,.09,darkWood);break;
 case 12:for(let i=0;i<3;i++)plank(0,.12+i*.11,0,.95,.08,.64,ivory,0,i*.08);plank(0,.48,0,.1,.1,.67,0x64936d);plank(0,.48,0,.98,.1,.1,0x64936d);break;
 case 13:plank(0,.56,0,.07,1.12,.07,darkWood);plank(0,1.03,0,1.1,.08,.08,c);plank(.5,1.03,0,.24,.24,.08,c,0,0,Math.PI/4);plank(-.45,1.03,0,.23,.3,.08,0x729b8b);plank(0,.75,0,.07,.05,.8,wood);break;
 case 14:plank(0,.59,0,.12,1.18,.12,darkWood);plank(.1,1.02,0,.9,.23,.12,0x9db16d);plank(-.1,.67,0,.9,.23,.12,wood);plank(.54,1.02,0,.18,.18,.12,0x9db16d,0,0,.78);plank(-.54,.67,0,.18,.18,.12,wood,0,0,.78);break;
 case 15:plank(0,.2,0,1.1,.25,.48,wood);plank(0,.39,0,.16,.39,.3,0x707f7b,0,0,-.4);plank(.37,.45,0,.12,.4,.12,darkWood);plank(.29,.68,0,.32,.1,.12,darkWood);break;
 case 16:plank(0,.3,0,.88,.18,.88,c);plank(0,.41,0,.69,.04,.69,ivory);plank(0,.46,0,.09,.03,.53,0x8c5962,0,.65);plank(0,.49,0,.2,.03,.2,darkWood,0,.65);for(const x of [-.38,.38])plank(x,.41,0,.05,.05,.09,darkWood);break;
 case 17:for(let i=0;i<7;i++)plank(-.6+i*.2,.2+Math.sin(i/6*Math.PI)*.15,0,.18,.1,.66,wood);for(const x of [-.6,.6])for(const z of [-.34,.34])plank(x,.48,z,.07,.65,.07,darkWood);for(const z of [-.34,.34])plank(0,.78,z,1.3,.08,.08,c);break;
 case 18:for(const x of [-.5,.5])plank(x,.61,0,.17,1.22,.17,wood);for(let i=0;i<5;i++)plank(-.36+i*.18,.62,0,.1,.75,.1,0x71956d);for(const y of [.4,.85])plank(0,y,.08,1,.08,.1,wood);plank(.32,.68,.16,.08,.08,.07,c);break;
 case 19:legs();plank(0,.52,0,1,.16,.7,wood);plank(0,.63,0,.65,.07,.42,0x84a4a0);break;
 case 20:for(let y=0;y<3;y++)for(let x=0;x<3-y;x++){plank(-.38+x*.38+y*.19,.15+y*.24,0,.33,.22,.85,wood);plank(-.38+x*.38+y*.19,.15+y*.24,.44,.25,.15,.02,ivory);}break;
 case 21:case 25:plank(0,.69,0,1.1,.65,.14,wood);plank(0,.26,0,.1,.5,.1,darkWood);for(let i=0;i<3;i++)plank(-.26+i*.24,.69,.09,.12,.13,.03,c);break;
 case 22:plank(0,.34,0,.12,.68,.12,wood);plank(0,.86,0,.7,.55,.62,0x708b86);plank(0,.9,.32,.5,.07,.03,darkWood);plank(.43,1.14,0,.08,.4,.08,c);break;
 case 23:plank(0,.51,0,.55,.75,.45,wood);plank(0,.94,0,.7,.3,.48,0xb18a53);plank(.1,.68,.24,.04,.6,.025,darkWood,0,0,.2);break;
 case 24:plank(0,.16,0,.8,.12,.65,ivory);for(const x of [-.32,.32])plank(x,.62,0,.08,.9,.08,wood);plank(0,1.13,0,.83,.12,.67,ivory);plank(0,.67,0,.46,.5,.39,c);break;
 case 26:for(const x of [-.4,.4]){plank(x,.65,0,.65,.94,.12,wood);plank(x,.65,.08,.5,.77,.03,x<0?0xb4d9dc:0x80b5a0);plank(x,.65,.12,.045,.8,.04,ivory);plank(x,.65,.12,.54,.045,.04,ivory);}break;
 case 27:plank(0,.35,0,1.1,.5,.65,wood);plank(0,.73,0,.6,.07,.06,darkWood);for(const x of [-.26,.26])plank(x,.62,0,.07,.24,.06,darkWood);plank(-.25,.61,.11,.1,.4,.1,c);break;
 case 28:plank(0,.08,0,1.3,.12,.8,wood);for(const x of [-.38,.38]){plank(x,.27,0,.3,.3,.3,ivory);plank(x,.43,0,.24,.02,.24,0x7e5938);plank(x+.18,.29,0,.09,.15,.1,c);}plank(0,.23,-.2,.22,.22,.22,0xa4bca0);break;
 case 29:plank(0,.15,0,1.1,.3,.8,0x8fa397);plank(0,.55,0,.22,.7,.22,wood);for(const x of [-.25,0,.25])plank(x,.99+Math.abs(x),0,.36,.36,.32,0x72976c,0,0,.3);plank(0,1.37,0,.2,.2,.14,c,0,0,.78);break;
 }
 if(!complete)plank(0,.015,0,1.4,.03,1.05,0xcbbd9a);
 return b.build();
}
function scenery(arc=0,flags={},cosmetics=[]){
 const b=new Blocks(),rng=seededRandom(40+arc),snow=arc===4,palette=[0x68844d,0x5a9170,0x918656,0x537e68,0x91afae,0x5d697f];
 b.box(0,-.32,0,12,.64,8.5,0x786247).box(0,.015,0,12,.08,8.5,snow?0xe3ede4:palette[arc]);
 for(let z=-3;z<=3;z++)for(let x=-5;x<=5;x++)if(Math.abs(x)<1||z===1)b.box(x*.91,.07,z*.88,.8,.06,.77,snow?0xb5c5bf:0xbab08b,0,(rng()-.5)*.08);
 const house=(x,z,roof=0x446e64)=>{
  b.box(x,1.2,z,2.5,2.3,1.8,0xc19a6a).box(x,2.5,z,2.9,.25,2.1,darkWood);
  for(let i=0;i<6;i++)b.box(x,2.65+i*.13,z,2.95-i*.44,.14,2.15,roof);
  for(const dx of [-1.1,1.1])b.box(x+dx,1.2,z+.95,.16,2.4,.15,darkWood);
  b.box(x,.72,z+.95,.68,1.4,.1,0x674833).box(x+.19,.7,z+1.04,.065,.065,.05,gold);
  for(const dx of [-.76,.76]){b.box(x+dx,1.5,z+.96,.45,.65,.1,0xf1c879).box(x+dx,1.5,z+1.03,.04,.66,.05,darkWood).box(x+dx,1.5,z+1.03,.46,.04,.05,darkWood);}
  for(let i=0;i<3;i++)b.box(x,.11+i*.08,z+1.3-i*.13,1.1,.12,.38,wood);
 };
 house(-3,-2,arc===4?0xdae4da:0x4d7662);if(arc!==3)house(3.5,-2.4,arc===5?0x77628d:0x967454);
 const tree=(x,z,h)=>{b.box(x,h*.45,z,.35,h,.38,wood);for(let i=0;i<4;i++){const w=2-i*.33;b.box(x+(i%2)*.17,h*.58+i*.45,z,w,.63,w*.86,snow?(i%2?0xd3e0d8:0x72938b):[0x385c46,0x4b7250,0x5c8655,0x73935d][i]);}};
 for(const [x,z,h]of[[-5.1,-2.7,3.5],[5.1,-2.6,4],[-5,1.8,2.5],[5.2,1.7,2.7]])tree(x,z,h);
 for(let i=0;i<55;i++){const x=(rng()-.5)*11,z=(rng()-.5)*7.5;if(Math.abs(x)<1.6||z<-1.4)continue;const col=snow?0xe5ebdf:[0x7b9c5c,0x769250,0x9fba67][i%3];b.box(x,.2,z,.22,.34,.23,col,0,rng());if(i%4===0)b.box(x,.4,z,.17,.1,.18,i%2?0xe7ad73:ivory);}
 if([1,3].includes(arc)){b.box(0,.11,-3.5,5,.04,1.3,0x5aa3a0);for(let i=0;i<9;i++)b.box(-2+i*.5,.15,-3.5+(i%2)*.3,.25,.015,.03,0xa6d3c2);}
 for(const x of [-2.1,2.1]){
  b.box(x,.4,1.9,1.05,.65,.64,wood).box(x,.76,1.9,.98,.06,.58,darkWood);
  for(let i=0;i<3;i++)b.box(x-.3+i*.3,1.03,1.9,.18,.55,.18,leaf).box(x-.3+i*.3,1.33,1.9,.3,.17,.3,[gold,0xe39b91,ivory][i]);
 }
 const warm=cosmetics.includes('warm-lamps');for(const x of [-1.8,1.8]){b.box(x,1,-1.2,.09,2,.09,darkWood).box(x,2,-1.2,.34,.45,.34,warm?0xffc85c:0xc5af70).box(x,2,-1,.22,.3,.025,warm?0xfff0b3:ivory);}
 if(flags.shelter){for(const x of [2.1,3.7])b.box(x,1,1,.1,2,.1,wood);b.box(2.9,2.05,1,2,.13,1.1,0x587c63);}
 const root=new THREE.Group();root.add(b.build());return root;
}
function disposeGroup(group){group.traverse(n=>{if(n.isMesh)n.geometry.dispose();});}
export class SmallwoodScene {
 constructor(container,{onLost=()=>{},onRestored=()=>{}}={}){
  this.container=container;this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:true});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xb6c6b0);this.scene.fog=new THREE.Fog(0xb6c6b0,17,31);
  this.camera=new THREE.OrthographicCamera(-8,8,6,-6,.1,80);this.camera.position.set(11,12,16);this.camera.lookAt(0,.7,0);
  this.scene.add(new THREE.HemisphereLight(0xffedce,0x526b70,1.6));const sun=new THREE.DirectionalLight(0xffd3a0,2.4);sun.position.set(-5,12,8);sun.castShadow=true;sun.shadow.mapSize.set(512,512);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;sun.shadow.normalBias=.055;this.scene.add(sun);this.sun=sun;
  this.world=null;this.active=false;this.raf=0;this.last=0;this.action=null;this.actor=null;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.frames=[];this.thumbnails=new Map();
  this.renderer.domElement.setAttribute('aria-hidden','true');container.append(this.renderer.domElement);
  this.lost=e=>{e.preventDefault();this.stop();onLost();};this.restored=()=>{this.draw();onRestored();};this.renderer.domElement.addEventListener('webglcontextlost',this.lost);this.renderer.domElement.addEventListener('webglcontextrestored',this.restored);
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(container);this.visibility=()=>{if(document.hidden)this.stop();};document.addEventListener('visibilitychange',this.visibility);this.resize();
 }
 resize(){const {width,height}=this.container.getBoundingClientRect();if(width<1||height<1)return;this.renderer.setSize(width,height,false);const ratio=width/height,h=Math.max(8.4,12.5/ratio);this.camera.left=-h*ratio/2;this.camera.right=h*ratio/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();this.draw();}
 update(run,save){
  const signature=JSON.stringify([run.location,Math.floor((run.season-1)/3),run.species,run.flags,run.index,save.cosmetics,save.displays,run.legacyWork]);
  if(signature!==this.signature){
   this.signature=signature;if(this.world){this.scene.remove(this.world);disposeGroup(this.world);}this.world=scenery(run.location,run.flags,save.cosmetics);this.scene.add(this.world);
   this.actor=animal(run.species,Math.floor((run.season-1)/3),0x658252);this.actor.position.set(-.55,.1,1);this.actor.userData.baseScale=this.actor.scale.y;this.world.add(this.actor);
   for(let i=0;i<3;i++){const npc=animal((run.species+i+1)%6,2,[0x8d6f9d,0x589496,0xb38351][i]);npc.scale.setScalar(.8);npc.position.set([-2.6,2.8,1.6][i],.1,[-.05,.1,-1.4][i]);npc.rotation.y=[.35,-.35,-.25][i];if(run.remote.includes(['A','B','C'][i]))npc.visible=false;this.world.add(npc);}
   const owl=orla();owl.position.set(-1.15,.1,-1.2);owl.scale.setScalar(.75);this.world.add(owl);
   const prop=memoryModel(run.index,!!(run.flags.built||run.flags.repaired||run.flags.madeTogether||run.legacyWork===2));prop.position.set(.8,.11,1.8);prop.scale.setScalar(.8);this.world.add(prop);this.prop=prop;
   if(run.flags.mentor){const apprentice=animal(1,0,0x6e8aab);apprentice.position.set(.5,.1,-1.15);apprentice.scale.multiplyScalar(.8);this.world.add(apprentice);}
   if(save.cosmetics.includes('moon-cabinet')){const cabinet=memoryModel(31);cabinet.position.set(2.1,.1,-1.4);cabinet.scale.setScalar(1.1);this.world.add(cabinet);}
   if(save.cosmetics.includes('starlit-garden')){for(const x of [-3,3]){const lamp=memoryModel(32);lamp.position.set(x,.1,2.4);lamp.scale.setScalar(.7);this.world.add(lamp);}}
   for(let slot=0;slot<5;slot++){const id=save.displays?.[Math.floor(run.index/5)*5+slot];if(id){const item=memoryModel(Number(id.slice(1))-1,!!save.album[id]?.wish);item.position.set(-2.4+slot*1.2,.13,2.7);item.scale.setScalar(.48);this.world.add(item);}}
   if(save.cosmetics.includes('starlit-garden'))this.scene.background.setHex(0x66708a);else this.scene.background.setHex([0xb6c6b0,0xb2cec5,0xd4c7a9,0xa9c5c0,0xcad9e0,0x8b91b0][run.location]);this.scene.fog.color.copy(this.scene.background);
  }
  this.draw();
 }
 animate(kind){this.action={kind,start:performance.now(),duration:this.reduced?100:650};this.start();}
 start(){if(this.active||document.hidden)return;this.active=true;this.last=performance.now();const tick=now=>{if(!this.active)return;this.frames.push(now-this.last);if(this.frames.length>180)this.frames.shift();this.last=now;
   if(this.actor&&this.action){const t=Math.min(1,(now-this.action.start)/this.action.duration),wave=Math.sin(t*Math.PI);this.actor.position.y=.1+(this.reduced?0:wave*.12);this.actor.rotation.y=this.reduced?0:Math.sin(t*Math.PI*2)*.12;for(let i=0;i<this.actor.userData.arms.length;i++)this.actor.userData.arms[i].rotation.x=this.action.kind==='rest'?-.2:-wave*.7;
    if(this.action.kind==='rest')this.actor.scale.y=this.actor.userData.baseScale*(1-wave*.15);if(t===1){this.actor.scale.y=this.actor.userData.baseScale;this.action=null;this.stop();}}
   this.draw();if(this.active)this.raf=requestAnimationFrame(tick);
  };this.raf=requestAnimationFrame(tick);}
 stop(){this.active=false;cancelAnimationFrame(this.raf);this.raf=0;this.action=null;if(this.actor){this.actor.position.y=.1;this.actor.rotation.y=0;this.actor.scale.y=this.actor.userData.baseScale;for(const arm of this.actor.userData.arms)arm.rotation.x=0;}}
 draw(){if(this.renderer&&!this.renderer.getContext().isContextLost()){this.renderer.render(this.scene,this.camera);const m=this.metrics();Object.assign(this.container.dataset,{drawCalls:m.calls,triangles:m.triangles,geometries:m.geometries,textures:m.textures,frameP95:m.p95FrameMs??'',frameSamples:m.animationSamples,animationActive:String(this.active),threeRevision:THREE.REVISION,reducedMotion:String(this.reduced)});}}
 thumbnail(index,complete=true){
  const key=index+':'+complete;if(this.thumbnails.has(key))return this.thumbnails.get(key);
  this.stop();const scene=new THREE.Scene();scene.background=new THREE.Color(0xe5dfc9);scene.add(new THREE.HemisphereLight(0xfff0cd,0x688785,2.8));const light=new THREE.DirectionalLight(0xffe4ac,4);light.position.set(-3,5,5);scene.add(light);const model=memoryModel(index,complete);scene.add(model);
  const camera=new THREE.OrthographicCamera(-1.2,1.2,1.2,-1.2,.1,20);camera.position.set(2.7,2.4,4);camera.lookAt(0,.57,0);
  const oldSize=this.renderer.getSize(new THREE.Vector2()),ratio=this.renderer.getPixelRatio();this.renderer.setPixelRatio(1);this.renderer.setSize(192,192,false);this.renderer.render(scene,camera);const url=this.renderer.domElement.toDataURL('image/png');this.thumbnails.set(key,url);model.geometry.dispose();this.renderer.setPixelRatio(ratio);this.renderer.setSize(oldSize.x,oldSize.y,false);this.draw();return url;
 }
 metrics(){const sorted=[...this.frames].sort((a,b)=>a-b);return {calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,p95FrameMs:sorted.length?sorted[Math.floor(sorted.length*.95)]:null,animationSamples:sorted.length};}
 dispose(){this.stop();this.resizeObserver.disconnect();document.removeEventListener('visibilitychange',this.visibility);this.renderer.domElement.removeEventListener('webglcontextlost',this.lost);this.renderer.domElement.removeEventListener('webglcontextrestored',this.restored);if(this.world)disposeGroup(this.world);this.renderer.dispose();this.renderer.domElement.remove();this.thumbnails.clear();}
}
