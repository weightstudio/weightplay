import * as T from './vendor/three/three.module.min.js';
export class Room{
 constructor(host,onPick,onLoss){
  this.host=host;this.abort=new AbortController();this.box=new T.BoxGeometry(1,1,1);this.materials=new Map();this.cats=new Map();this.props=new Map();this.portraits=new Map();this.time=0;this.reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
  host.prepend(this.renderer.domElement);this.camera=new T.OrthographicCamera(-5,5,5,-5,.1,80);this.camera.position.set(5,9,13);this.camera.lookAt(0,.5,0);this.scene=new T.Scene();this.scene.background=new T.Color(0x25484c);this.lights(this.scene);
  this.buildRoom();this.marker=new T.Group();for(const x of [-.55,.55])this.cube(this.marker,0xf9d57c,[.045,.018,1.1],[x,0,0]);for(const z of [-.55,.55])this.cube(this.marker,0xf9d57c,[1.1,.018,.045],[0,0,z]);this.scene.add(this.marker);
  this.ray=new T.Raycaster();this.point=new T.Vector2();let down=null;
  this.renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};},{signal:this.abort.signal});
  this.renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;down=null;const r=this.renderer.domElement.getBoundingClientRect();this.point.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);this.ray.setFromCamera(this.point,this.camera);const hit=this.ray.intersectObjects([...this.cats.values()].map(x=>x.root),true)[0];if(hit){let n=hit.object;while(n&&!n.userData.cat)n=n.parent;if(n)onPick(n.userData.cat);}},{signal:this.abort.signal});
  this.renderer.domElement.addEventListener('pointercancel',()=>{down=null;},{signal:this.abort.signal});this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onLoss();},{signal:this.abort.signal});
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(host);this.fit();
 }
 lights(s){s.add(new T.HemisphereLight(0xffedd0,0x3a6268,2.2));const l=new T.DirectionalLight(0xffd49b,3);l.position.set(-4,8,6);s.add(l);}
 mat(color){if(!this.materials.has(color))this.materials.set(color,new T.MeshStandardMaterial({color,roughness:.76}));return this.materials.get(color);}
 cube(parent,color,size,pos,rz=0){const n=new T.Mesh(this.box,this.mat(color));n.scale.set(...size);n.position.set(...pos);n.rotation.z=rz;parent.add(n);return n;}
 buildRoom(){const s=this.scene;this.cube(s,0xd3ad7c,[8.2,.22,5.6],[0,-.15,.2]);for(let i=0;i<12;i++)this.cube(s,i%2?0xe7c495:0xdfb988,[.65,.02,5.5],[-3.8+i*.69,-.025,.2]);
  this.cube(s,0x3b6b6d,[8.2,2.8,.18],[0,1.3,-2.6]);this.cube(s,0x5b8680,[.18,1.5,5.6],[-4,.65,.2]);
  this.cube(s,0xb1d8ca,[2.4,1.65,.08],[-.6,1.65,-2.48]);for(const x of [-1.85,-.6,.65])this.cube(s,0xf2dbb1,[.09,1.85,.12],[x,1.65,-2.39]);for(const y of [.76,1.65,2.55])this.cube(s,0xf2dbb1,[2.6,.09,.12],[-.6,y,-2.38]);
  this.cube(s,0x79a48b,[2.2,.5,.02],[-.6,1.03,-2.41]);this.cube(s,0xffdda1,[.5,.5,.03],[.1,2.12,-2.4]);
  this.cube(s,0x6c9f95,[2.4,.035,1.5],[0,.005,1]);for(const x of [-1.05,1.05])this.cube(s,0xe9ce97,[.06,.04,1.4],[x,.02,1]);
  for(const x of [-3.5,3.5]){this.cube(s,0xcb8870,[.6,.45,.6],[x,.2,-2]);this.cube(s,0x7aab73,[.75,.45,.7],[x,.64,-2]);this.cube(s,0x99ba78,[.44,.36,.46],[x,.97,-2]);}
  this.baseScratch=new T.Group();this.scene.add(this.baseScratch);this.baseScratch.position.set(-2.8,0,.8);this.prop(this.baseScratch,'scratch',1);
  this.bowl=new T.Group();this.scene.add(this.bowl);this.bowl.position.set(2.6,0,1.6);this.prop(this.bowl,'feed',1);
 }
 prop(g,kind,level=1){
  if(kind==='tree'){this.cube(g,0xb8875b,[1.2,.13,1],[0,.1,0]);this.cube(g,0xe4c18e,[.2,1.5+level*.16,.2],[.28,.86,0]);this.cube(g,0x659c91,[1.35,.16,.9],[0,1.6+level*.16,0]);this.cube(g,0xc79967,[.8,.13,.65],[-.3,.8,0]);this.cube(g,0x43716a,[.85,.45,.65],[0,1.87+level*.16,0]);}
  if(kind==='bed'||kind==='cushion'){this.cube(g,kind==='bed'?0xcb8972:0x6a73a4,[1.2,.18,.9],[0,.15,0]);for(const x of [-.53,.53])this.cube(g,0xf4d9ae,[.14,.27,.9],[x,.25,0]);this.cube(g,0xf3dfbb,[.96,.17,.16],[0,.23,-.36]);this.cube(g,0x84b6aa,[.6,.08,.5],[0,.29,0]);}
  if(kind==='feather'){this.cube(g,0x9c6d49,[.07,1.5,.07],[0,.77,0],-.22);this.cube(g,0xd9c381,[.42,.025,.025],[.17,1.49,0]);for(let i=0;i<3;i++)this.cube(g,i%2?0xe8b355:0x67beb7,[.13,.23,.06],[.36+(i-1)*.07,1.2+i*.06,0],(i-1)*.2);}
  if(kind==='scratch'){this.cube(g,0x775447,[.85,.12,.6],[0,.08,0]);this.cube(g,0xe0bc85,[.24,.9,.24],[0,.55,0]);for(let i=0;i<7;i++)this.cube(g,0xc29865,[.27,.025,.27],[0,.2+i*.115,0]);}
  if(kind==='feed'){this.cube(g,0x72b7bd,[.7,.15,.62],[0,.1,0]);this.cube(g,0xf3ddaa,[.52,.08,.44],[0,.2,0]);for(let i=0;i<6;i++)this.cube(g,0xa5734e,[.11,.07,.11],[-.15+(i%3)*.15,.26,-.08+Math.floor(i/3)*.16]);}
 }
 makeCat(d){const root=new T.Group(),body=new T.Group(),head=new T.Group(),tail=new T.Group(),legs=[];root.userData.cat=d.id;root.add(body);const coats=[0xd59450,0x7a8d9a,0xede1c5,0x7d625c],coat=coats[d.personality],cream=d.personality===1?0xd3dadd:0xffeac8;
  this.cube(body,coat,[.54,.42,.9],[0,.44,0]);this.cube(body,cream,[.35,.27,.12],[0,.38,.43]);
  for(const x of [-.19,.19])for(const z of [-.29,.29]){const leg=new T.Group();leg.position.set(x,.19,z);body.add(leg);this.cube(leg,coat,[.16,.3,.19],[0,0,0]);this.cube(leg,cream,[.18,.1,.23],[0,-.12,.035]);legs.push(leg);}
  head.position.set(0,.83,.34);body.add(head);this.cube(head,coat,[.65,.52,.52],[0,0,0]);this.cube(head,cream,[.43,.17,.12],[0,-.13,.28]);
  for(const x of [-.235,.235]){this.cube(head,coat,[.21,.24,.2],[x,.34,-.015]);this.cube(head,coat,[.12,.12,.16],[x,.5,-.025]);this.cube(head,0xda9b8b,[.12,.17,.025],[x,.355,.1]);this.cube(head,0x254b4c,[.13,.15,.035],[x*.71,.025,.276]);this.cube(head,0xe9f3cf,[.045,.055,.015],[x*.71-.02,.06,.3]);
   for(const y of [-.11,-.05])this.cube(head,0xead9b9,[.18,.016,.02],[x*1.4,y,.295],x>0?.1:-.1);}
  this.cube(head,0x905d59,[.1,.07,.04],[0,-.095,.35]);this.cube(head,0x825e50,[.08,.018,.025],[0,-.19,.35]);
  for(const x of [-.12,.12])this.cube(head,d.personality===1?0x566c7c:0xb17543,[.05,.16,.025],[x,.17,.27]);
  tail.position.set(0,.54,-.4);tail.rotation.x=-.3;body.add(tail);for(let i=0;i<4;i++)this.cube(tail,i===3?cream:coat,[.14,.22,.14],[i>1?.07:0,.16+i*.19,-i*.035]);
  // Flat stepped contact shadow uses ordinary world geometry, no texture/engine.
  const shadow=this.cube(root,0x9c825e,[.73,.012,1.05],[0,.01,0]);return {root,body,head,tail,legs,shadow};
 }
 fit(){const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight),aspect=w/h,half=Math.max(3.45,4.65/aspect);this.renderer.setSize(w,h,false);Object.assign(this.camera,{left:-half*aspect,right:half*aspect,top:half,bottom:-half});this.camera.updateProjectionMatrix();}
 render(s,dt=0){
  this.time+=dt;const t=this.time;
  for(const d of s.cats){if(!this.cats.has(d.id)){const n=this.makeCat(d);this.cats.set(d.id,n);this.scene.add(n.root);}const n=this.cats.get(d.id),a=d.action;let x=d.x,z=d.z,y=0,heading=.1;
   const kind=a?.kind==='routine'?['feed','groom','rest'][Math.min(2,a.part)]:a?.kind;
   if(kind==='scratch'){x=-2.7+d.id*.2;z=1;heading=-1.2;}
   if(kind==='feed'){x=2.6-d.id*.25;z=1;heading=.3;}
   if(kind==='rest'&&s.levels.tree){const spot=s.places.tree;x=[-2.4,0,2.4][spot];z=-.85+d.id*.15;y=1.7+s.levels.tree*.16;}
   if(kind==='rest'&&!s.levels.tree){x=0;z=1;}
   if(kind==='feather'){x=d.x+(this.reduced?0:Math.sin(t*2.1)*.6);z=d.z+(this.reduced?0:Math.cos(t*2.1)*.25);heading=Math.sin(t*2.1)*.5;}
   const blend=this.reduced?1:Math.min(1,dt*8);n.root.position.lerp(new T.Vector3(x,y,z),blend);n.root.rotation.y+=(heading-n.root.rotation.y)*blend;
   const size=1.15+d.growth*.003;n.root.scale.lerp(new T.Vector3(size,size,size),blend);n.body.position.y=!this.reduced&&kind==='feather'?Math.max(0,Math.sin(t*5))*.15:0;
   n.head.rotation.x=!this.reduced&&kind==='feed'?.25+Math.sin(t*7)*.1:kind==='rest'?.12:0;n.head.rotation.z=!this.reduced&&kind==='groom'?Math.sin(t*4)*.12:0;
   n.tail.rotation.z=!this.reduced&&kind?Math.sin(t*3)*.2:0;
   n.legs.forEach((leg,i)=>leg.rotation.x=!this.reduced&&['scratch','feather'].includes(kind)?Math.sin(t*8+i*Math.PI)*.3:0);
   n.body.scale.y=kind==='rest'?.65:1;
  }
  for(const [kind,level]of Object.entries({...s.levels,cushion:s.cushion?1:0})){const signature=`${level}:${s.places[kind]||0}`;let p=this.props.get(kind);if(p?.signature===signature)continue;if(p)this.scene.remove(p.g);const g=new T.Group();if(level){this.prop(g,kind,level);g.position.set(kind==='cushion'?2:[-2.4,0,2.4][s.places[kind]||0],0,kind==='cushion'?1.6:-1);this.scene.add(g);}this.props.set(kind,{g,signature});}
  const selected=this.cats.get(s.selected);if(selected)this.marker.position.set(selected.root.position.x,.03,selected.root.position.z);this.renderer.render(this.scene,this.camera);
 }
 portrait(kind){if(this.portraits.has(kind))return this.portraits.get(kind);const sc=new T.Scene();sc.background=new T.Color(0x31585c);this.lights(sc);let model;if(kind.startsWith('cat')){model=this.makeCat({id:99,personality:Number(kind.slice(3))}).root;}else{model=new T.Group();this.prop(model,kind,1);}sc.add(model);const camera=new T.OrthographicCamera(-1.25,1.25,1.25,-1.25,.1,30);camera.position.set(3,2.7,4);camera.lookAt(0,kind==='tree'?1:kind==='feather'?.8:kind.startsWith('cat')?.7:.25,0);const old=this.renderer.getSize(new T.Vector2());this.renderer.setSize(128,128,false);this.renderer.render(sc,camera);const url=this.renderer.domElement.toDataURL('image/png');this.portraits.set(kind,url);this.renderer.setSize(old.x,old.y,false);return url;}
 dispose(){this.abort.abort();this.resize.disconnect();this.renderer.setAnimationLoop(null);this.box.dispose();for(const m of this.materials.values())m.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();this.cats.clear();this.props.clear();this.portraits.clear();}
}
