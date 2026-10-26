import * as T from './vendor/three/three.module.min.js';
const palettes=[['#c8e7dd','#bf9474','#e7c69a','#78a65e'],['#b5d6df','#6d8d97','#a2bfc0','#477f79'],['#c7e7ee','#aa947f','#dbc8a1','#759b89'],['#cbdcf4','#8ba4bc','#dcecf0','#89b2ab'],['#d3e5e5','#ac9686','#e2cfab','#659d87'],['#d9d4ef','#a49abb','#e7daf0','#82b5ac']];
const v=a=>new T.Vector3(...a);
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
const finishes={classic:['#249fc8','#f6cf60','#8b6042'],rain:['#39816f','#f2d17b','#486774'],frost:['#6d85c6','#e3f6ff','#4f6587'],summit:['#b85442','#ffe6a1','#7b6448'],aurora:['#7e63b6','#64ead8','#47558c']};
function cubeGeometry(){const s=new T.Shape();s.moveTo(-.46,-.46);s.lineTo(.46,-.46);s.lineTo(.46,.46);s.lineTo(-.46,.46);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:.92,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.04,bevelThickness:.04});g.translate(0,0,-.46);return g;}
export class MountainView {
 constructor(canvas){
  this.canvas=canvas;this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.3;
  this.scene=new T.Scene();this.camera=new T.OrthographicCamera(-4,4,5,-5,.1,150);this.scene.add(new T.HemisphereLight(0xe2faff,0x665348,2.35));const sun=new T.DirectionalLight(0xffedc1,3.0);sun.position.set(-6,12,10);this.scene.add(sun);const rim=new T.DirectionalLight(0xb3ebff,1.3);rim.position.set(8,4,-4);this.scene.add(rim);
  this.geo=cubeGeometry();this.materials=new Map();this.world=new T.Group();this.scene.add(this.world);this.center=new T.Vector3();this.sector=-1;this.variant='classic';this.width=1;this.height=1;this.thumbCache=new Map();this.itemCache=new Map();this.rope=null;this.lastState='';
  this.avatar=this.fox();this.scene.add(this.avatar.root);this.resize();
 }
 material(color){if(!this.materials.has(color))this.materials.set(color,new T.MeshStandardMaterial({color,roughness:.68,metalness:color==='#f6cf60'?.25:0}));return this.materials.get(color);}
 box(group,x,y,z,sx,sy,sz,color,rotation=0){const m=new T.Mesh(this.geo,this.material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.z=rotation;group.add(m);return m;}
 batch(group,boxes){const buckets={};for(const b of boxes)(buckets[b[6]]??=[]).push(b);const dummy=new T.Object3D();for(const[color,items]of Object.entries(buckets)){const mesh=new T.InstancedMesh(this.geo,this.material(color),items.length);items.forEach((b,i)=>{dummy.position.set(b[0],b[1],b[2]);dummy.scale.set(b[3],b[4],b[5]);dummy.rotation.set(0,b[7]||0,b[8]||0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});group.add(mesh);}}
 fox(finish='classic',kit='base'){const root=new T.Group(),body=new T.Group();root.add(body);const b=[];const add=(...x)=>b.push(x);const orange='#e78324',cream='#fff0cc',dark='#563c31',[blue,trim,pack]=finishes[finish]||finishes.classic;
  add(0,.67,0,.56,.68,.36,orange);add(0,.7,.2,.3,.48,.07,cream);add(0,1.18,0,.8,.68,.49,orange);add(-.31,1.54,0,.24,.43,.28,dark);add(.31,1.54,0,.24,.43,.28,dark);add(-.31,1.57,.16,.13,.28,.07,cream);add(.31,1.57,.16,.13,.28,.07,cream);
  add(-.29,1.04,.22,.26,.22,.18,cream);add(.29,1.04,.22,.26,.22,.18,cream);add(0,.99,.31,.48,.2,.28,cream);add(0,1.08,.48,.14,.09,.08,dark);
  for(const x of [-.2,.2]){add(x,1.23,.265,.23,.23,.05,'#ffffff');add(x+.025,1.23,.301,.1,.18,.035,'#208fc7');add(x+.025,1.23,.324,.05,.15,.025,'#192f40');add(x+.01,1.29,.34,.045,.048,.02,'#ffffff');add(x,1.39,.28,.27,.055,.07,dark,0,x<0?-.14:.14);}
  add(0,1.48,.3,.1,.17,.04,'#f6cf60',0,-.35);add(-.035,1.4,.3,.16,.07,.04,'#f6cf60');add(.01,1.34,.3,.07,.14,.04,'#f6cf60',0,-.35);
  add(0,.89,0,.64,.12,.5,blue);add(0,.94,.28,.15,.13,.07,trim);add(0,.57,-.27,.42,.48,.2,pack);add(0,.62,-.4,.27,.055,.04,trim);add(-.19,.62,.22,.045,.49,.04,pack);add(.19,.62,.22,.045,.49,.04,pack);add(0,.43,.24,.56,.07,.05,dark);
  if(kit==='safety')for(const x of[-.29,.29])add(x,.44,.24,.1,.18,.06,'#e8dba9');
  if(kit==='dry')for(const x of[-.37,.37])add(x,.53,.09,.23,.2,.25,'#62a5ab');
  if(kit==='wind')add(.29,.68,-.18,.07,.55,.07,'#eddb94');
  if(finish==='aurora'){for(let i=0;i<3;i++)add(.31,.61+i*.1,-.28,.1,.1,.1,i%2?blue:trim);add(0,.73,.24,.18,.18,.05,trim,0,.78);}
  if(finish==='frost')add(0,.81,.27,.44,.06,.06,trim);
  if(finish==='summit')for(const x of[-.11,.11])add(x,.9,.29,.09,.15,.06,trim);
  this.batch(body,b);
  const scarf=new T.Group();for(let i=0;i<5;i++)this.box(scarf,-.38-i*.13,.89+i*.025,-.06,.16,.16,.16,i===3||finish==='aurora'&&i%2?trim:blue,-.18);body.add(scarf);
  const tail=new T.Group();this.box(tail,.3,.37,-.18,.22,.22,.3,orange);this.box(tail,.46,.51,-.3,.3,.34,.34,orange,-.4);this.box(tail,.58,.68,-.35,.3,.32,.32,cream,-.4);body.add(tail);
  const limbs=[];for(let i=0;i<4;i++){const arm=i<2,g=new T.Group(),side=i%2?1:-1;g.position.set(side*(arm?.36:.17),arm?.85:.32,0);const arr=[[0,-.12,0,arm?.18:.22,.28,.22,orange],[0,-.32,.04,.22,.2,.26,dark],[0,-.37,.16,.23,.13,.19,cream]];if(arm){arr.push([0,-.23,.17,.14,.08,.04,'#f6cf60'],[.04,-.29,.17,.07,.12,.04,'#f6cf60']);}this.batch(g,arr);body.add(g);limbs.push(g);}
  root.scale.setScalar(.86);return {root,body,scarf,tail,limbs};
 }
 setAppearance(finish='classic',kit='base'){const key=finish+'|'+kit;if(this.appearance===key)return;this.appearance=key;this.variant=finish;this.kit=kit;this.scene.remove(this.avatar.root);this.avatar=this.fox(finish,kit);this.scene.add(this.avatar.root);this.lastState='';}
 turtle(group,x,y,z,scale=.6){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);group.add(g);const b=[[0,.4,0,1.1,.65,.85,'#71914d'],[0,.73,-.05,.8,.35,.65,'#8caf59'],[0,1,-.05,.43,.2,.44,'#b8d875'],[0,.45,.64,.58,.48,.43,'#a4bd55'],[0,.29,.89,.43,.17,.23,'#d9dd8b']];for(const x of [-.33,.33]){b.push([x,.12,.3,.24,.25,.32,'#a4bd55'],[x,.12,-.32,.24,.25,.32,'#a4bd55']);}for(const x of [-.17,.17])b.push([x,.53,.88,.13,.15,.04,'#fff5d6'],[x,.52,.91,.065,.11,.025,'#3b4234']);for(const x of[-.3,.3])b.push([x,.84,-.18,.13,.38,.13,'#756546'],[x,1.06,-.18,.32,.22,.3,'#77a84d']);this.batch(g,b);return g;}
 prop(kind,group,x=0,y=0,z=0,scale=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);group.add(g);const b=[];
  const flagIndex=kind.startsWith('flag-')?Number(kind.slice(5)):0;
  if(kind==='flag'||kind.startsWith('flag-')){const flagColor=['#e6ad51','#4daaa2','#73b1cc','#9caed9','#d28868','#a88ac7'][flagIndex];b.push([0,.28,0,.07,.6,.07,'#756546'],[.2,.48,0,.4,.27,.06,flagColor],[.2,.48,.04,.12,.13,.02,'#fff4cd'],[0,0,0,.35,.12,.3,'#aa9580']);}
  else if(kind==='stamp'){b.push([0,.18,0,.45,.48,.16,'#579590'],[0,.18,.1,.35,.38,.06,'#fff3d2'],[0,.18,.14,.22,.25,.03,'#cf8659'],[0,.13,.17,.12,.08,.02,'#fff3d2']);for(const x of[-.21,.21])for(let j=0;j<4;j++)b.push([x,.02+j*.1,.12,.04,.05,.04,'#fff3d2']);}
  else if(kind==='seal'){b.push([0,.2,0,.42,.42,.15,'#f6cf60'],[0,.2,.09,.29,.29,.06,'#fff0ba'],[-.07,.18,.14,.06,.15,.03,'#4a8d77'],[.04,.24,.14,.06,.25,.03,'#4a8d77'],[-.1,-.09,-.02,.15,.2,.06,'#67a99c'],[.1,-.09,-.02,.15,.2,.06,'#67a99c']);}
  else if(kind==='safe-seal'){b.push([0,.23,0,.46,.4,.13,'#6b9eac'],[0,-.02,0,.26,.18,.13,'#6b9eac'],[0,.24,.09,.29,.26,.05,'#e4f0d8'],[0,.22,.13,.07,.18,.02,'#e1bb53']);}
  else if(kind==='pin'||kind==='anchor'||kind==='safety'){for(const sx of[-1,1])b.push([sx*.16,.15,0,.08,.42,.09,'#e2dcc2']);b.push([0,.34,0,.32,.08,.09,'#e2dcc2'],[0,-.04,0,.32,.08,.09,'#e2dcc2'],[.17,.08,.02,.08,.23,.1,'#f6cf60'],[0,-.18,0,.07,.22,.07,'#786652']);}
  else if(kind==='wind'){b.push([0,.2,0,.04,.65,.05,'#8d6243']);for(let i=0;i<4;i++)b.push([i*.08,.23+i*.09,0,.2,.13,.08,i%2?'#f5cf70':'#60baca']);}
  else if(kind==='dry'){for(const x of[-.2,.2]){b.push([x,.15,0,.28,.3,.15,'#5e9fa7'],[x,.36,0,.27,.13,.14,'#f5cf70'],[x+.12,.13,0,.12,.17,.16,'#5e9fa7']);}}
  else if(kind==='energy'){b.push([0,.14,0,.3,.5,.24,'#75b85d'],[0,.42,0,.17,.12,.18,'#d1e5a1'],[0,.16,.13,.1,.24,.03,'#d1e5a1']);}
  else if(kind==='bird'||kind==='hare'){b.push([0,.2,0,.46,.4,.35,'#e7d8bc'],[0,.55,0,.44,.4,.35,'#f2e5d1']);for(const x of[-.12,.12])b.push([x,.58,.19,.07,.1,.025,'#3e4446']);b.push([0,.46,.25,.13,.11,.16,kind==='bird'?'#edb452':'#c89185']);if(kind==='hare')for(const x of[-.13,.13])b.push([x,.89,0,.12,.4,.14,'#f2e5d1']);else for(const x of[-.26,.26])b.push([x,.24,0,.17,.25,.3,'#b5c9d6']);}
  else if(kind==='tent'||kind==='aurora-tent'){const aurora=kind==='aurora-tent'||this.variant==='aurora';b.push([0,.2,0,.8,.4,.6,aurora?'#7056a8':'#54a0a1'],[0,.5,0,.58,.2,.6,aurora?'#8a7dbb':'#78c9bd'],[0,.63,0,.29,.1,.6,aurora?'#64ead8':'#f6cf60'],[0,.17,.32,.25,.31,.04,'#294c62']);if(aurora)for(const x of[-.28,.28])b.push([x,.35,.32,.08,.3,.06,'#64ead8']);}
  else if(kind==='mail'){b.push([0,.2,0,.54,.36,.18,'#f2e6c5'],[0,.25,.11,.31,.04,.03,'#b69165'],[.16,.3,.12,.09,.09,.03,'#58a29b']);}
  else if(kind==='cloth'){for(let i=0;i<3;i++)b.push([0,.08+i*.13,0,.5-i*.04,.11,.4,i%2?'#e6bd69':'#74aaa7']);b.push([0,.2,.22,.08,.42,.03,'#f5dfab']);}
  else if(kind==='aurora-rope'){for(let i=0;i<5;i++)b.push([Math.sin(i*1.5)*.17,.05+i*.1,0,.12,.17,.12,i%2?'#7e63b6':'#64ead8']);}
  else{b.push([0,.17,0,.52,.45,.32,'#956b49'],[0,.36,.02,.56,.1,.38,'#bd9968'],[-.15,.18,.18,.06,.43,.03,'#ecd09a'],[.15,.18,.18,.06,.43,.03,'#ecd09a'],[0,.18,.2,.1,.12,.04,'#f6cf60']);if(kind==='beacon')b.push([0,.52,0,.2,.28,.2,'#77e7e8']);if(kind==='heat')b.push([0,.19,.22,.22,.12,.025,'#ef9b57']);}
  this.batch(g,b);return g;
 }
 clearWorld(){for(const child of this.world.children){child.traverse(o=>{if(o.geometry&&o.geometry!==this.geo)o.geometry.dispose();if(o.isLine)o.material.dispose();});}this.world.clear();this.objects=new Map();this.windProps=[];this.sparks=[];}
 load(level,sector=0,sim=null){this.level=level;this.sector=sector;this.lastState='';this.clearWorld();const palette=palettes[level.region];this.scene.background=new T.Color(palette[0]);this.scene.fog=new T.Fog(palette[0],32,90);const part=level.sectors[sector];const ids=new Set(part.ids);if(sim)for(const n of sim.neighbors())ids.add(n.id);this.visibleIds=[...ids];const points=this.visibleIds.map(id=>level.nodes[id].p);const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));this.center.set((minX+maxX)/2,(minY+maxY)/2+.25,0);this.span=Math.max(6.7,maxY-minY+2.7,(maxX-minX+2.3)*1.1);const blocks=[];
  // Hand-authored stepped strata, recesses, terraces and hanging vegetation.
  for(let i=0;i<7;i++){const x=minX-1.3+i*.9,top=maxY+.3+Math.sin(i*3+level.number)*.65;for(let y=minY-2.8,j=0;y<top;y+=.72,j++){const noise=Math.sin(i*13+j*7+level.number),depth=1.8+(i%3)*.27;blocks.push([x+(j%2)*.045,y,-depth/2-.18-noise*.045,.87,.7,depth,(i+j)%5===0?palette[2]:palette[1],0,(i%2?1:-1)*.018]);if(y+.72>=top)blocks.push([x,y+.39,-.45,.92,.09,1.2,level.region===3?'#e6f0ef':palette[3]]);}}
  // Offset towers and foreground buttresses expose the depth of the route wall.
  for(const side of[-1,1]){const x=side<0?minX-1.95:maxX+1.85;blocks.push([x,minY+.6,-1.3,.85,5.2,2.4,palette[1]],[x,minY+3.25,-1.3,.92,.12,2.45,palette[3]],[x+side*.35,minY-1.5,.25,.8,2.2,1.2,palette[2]]);}
  for(let i=0;i<12;i++){const x=minX-12+i*2.1,y=minY-3+Math.sin(i*3)*1.5,z=-7-i%3*3;blocks.push([x,y,z,1.75,5+(i%4),2.1,i%2?'#86adb0':'#a2bfba'],[x,y+2.55+(i%4)/2,z,1.8,.17,2.15,'#c0d5c7']);}
  for(let i=0;i<7;i++)blocks.push([minX-5+i*2.7,maxY+1+(i%3)*.7,-9,.9+(i%2),.19,.8,'#e2efdf']);
  for(let i=0;i<9;i++){const x=minX-1+(i*1.37)%5,y=minY-.3+(i*1.7)%6;if(i%3===0){blocks.push([x,y,-.25,.1,.4,.1,'#6e7154'],[x,y+.3,-.25,.42,.25,.33,palette[3]]);}else blocks.push([x,y,-.24,.1,.13,.12,i%2?'#e6c785':'#d0dfb7']);}
  this.batch(this.world,blocks);
  for(const id of this.visibleIds){const n=level.nodes[id],g=new T.Group();g.position.copy(v(n.p));this.world.add(g);const safe=n.safe||sim?.pinned.includes(id);const shape=[];
   if(safe){shape.push([0,-.17,.18,1.05,.25,.92,n.cold?'#9cb7ce':palette[2]],[0,-.03,.2,1.1,.08,.96,n.cold?'#d4e5ef':palette[3]],[0,-.36,-.1,.66,.2,.48,palette[1]]);if(n.cold)shape.push([-.32,.09,.21,.18,.16,.32,'#e5f1f6']);else shape.push([.4,.1,.13,.11,.23,.13,'#dbe4ac']);}
   else{shape.push([0,0,.1,.5,.24,.45,n.fragile?'#d78c68':'#65c2b4'],[-.14,.15,.14,.16,.13,.24,n.fragile?'#edbe96':'#a3e9d0']);if(n.fragile){shape.push([0,.05,.34,.028,.2,.02,'#684c49'],[.09,.07,.34,.16,.024,.02,'#684c49']);}if(n.pinSeat)shape.push([-.29,-.03,.15,.13,.15,.16,'#e7d8b3']);}
   this.batch(g,shape);
   if(n.stamp&&!sim?.stamps.includes(id))this.prop('stamp',g,.35,.12,.35,.55);
   if(n.cargo!==undefined&&!sim?.delivered.includes(n.cargo)&&sim?.cargo!==n.cargo)this.prop(level.cargo[n.cargo].kind,g,.3,.18,.35,.6);
   if(n.anchor)this.prop('anchor',g,-.35,.1,.45,.8);
   if(id===level.end)this.prop(level.number%5===0?'tent':'flag',g,.3,.05,.1,.9);
   if(sector===0&&id===level.start)this.turtle(g,-.5,.07,.2,.36);
   this.objects.set(id,g);
  }
  for(const e of level.edges){if(!ids.has(e.a)||!ids.has(e.b))continue;const a=v(level.nodes[e.a].p),b=v(level.nodes[e.b].p);a.z+=.33;b.z+=.33;const locked=e.needs.some(f=>!sim?.flags.includes(f));const geom=new T.BufferGeometry().setFromPoints([a,b]);const line=new T.Line(geom,new T.LineBasicMaterial({color:locked?'#a093a0':e.wet?'#3197c2':'#f9efd0',transparent:true,opacity:locked?.28:.6}));this.world.add(line);
   if(e.wind){const prop=this.prop('wind',this.world,a.x+.38,a.y+.15,a.z,.65);this.windProps.push({prop,edge:e});}
   if(e.wet){const mid=a.clone().lerp(b,.5);this.batch(this.world,[[mid.x,mid.y,mid.z,.05,.27,.06,'#63d3e1'],[mid.x+.11,mid.y+.12,mid.z,.05,.24,.06,'#63d3e1']]);}
  }
  const ropeGeometry=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3(),new T.Vector3()]);this.rope=new T.Line(ropeGeometry,new T.LineBasicMaterial({color:this.variant==='aurora'?'#64ead8':'#d7ad57'}));this.world.add(this.rope);for(let i=0;i<12;i++){const dot=this.box(this.world,0,0,0,.065,.065,.065,i%2?'#ffe6ab':'#d0ebca');dot.visible=false;this.sparks.push(dot);}this.fitCamera();
 }
 fitCamera(){const aspect=this.width/this.height,span=this.span||7;const vertical=Math.max(span,span*.69/aspect),horizontal=vertical*aspect;this.camera.left=-horizontal/2;this.camera.right=horizontal/2;this.camera.top=vertical/2;this.camera.bottom=-vertical/2;this.camera.position.copy(this.center).add(new T.Vector3(4,2.1,14));this.camera.lookAt(this.center);this.camera.updateProjectionMatrix();}
 resize(width,height){this.width=Math.max(1,width||this.canvas.clientWidth||390);this.height=Math.max(1,height||this.canvas.clientHeight||600);this.renderer.setSize(this.width,this.height,false);this.fitCamera();}
 project(id){const n=this.level?.nodes[id];if(!n)return null;const p=v(n.p);p.z+=.45;p.project(this.camera);return {x:(p.x+1)*this.width/2,y:(1-p.y)*this.height/2};}
 render(sim,reduced=false){if(!sim)return;const node=sim.node();let sector=this.level.sectors.findIndex(s=>s.ids.includes(sim.position));if(sim.position===this.level.sectors[sector]?.end&&sector<this.level.sectors.length-1)sector++;const signature=[sector,sim.stamps.join(),sim.delivered.join(),sim.cargo,sim.flags.join(),sim.pinned.join()].join('|');if(this.sector!==sector||signature!==this.lastState){this.load(sim.level,sector,sim);this.lastState=signature;}
  const m=sim.motion;const start=this.level.nodes[m?.from||sim.position],end=this.level.nodes[m?.to||sim.position],t=m?ease(m.elapsed/m.duration):1;const safeStart=sim.isSafe(start.id),safeEnd=sim.isSafe(end.id);const pos=start.p.map((x,i)=>lerp(x,end.p[i],t));pos[1]+=lerp(safeStart?.12:-.65,safeEnd?.12:-.65,t);pos[2]+=.68;this.avatar.root.position.copy(v(pos));this.avatar.root.rotation.y=-.12;
  const reach=m?Math.sin(Math.PI*t):sim.isSafe()?0:.6;this.avatar.limbs[0].rotation.z=-reach*2.5;this.avatar.limbs[1].rotation.z=reach*2.2;this.avatar.limbs[2].rotation.x=reach*.8;this.avatar.limbs[3].rotation.x=-reach*.5;this.avatar.body.rotation.z=m?Math.sin(t*Math.PI)*.08:0;this.avatar.scarf.rotation.x=reduced?0:Math.sin(sim.time*2)*.09;
  if(sim.catchMotion){const c=sim.catchMotion,progress=Math.min(1,c.elapsed/c.duration),from=v(this.level.nodes[c.from].p);from.y-=.7+Math.sin(progress*Math.PI)*.5;from.z+=.68;this.avatar.root.position.lerpVectors(from,v(pos),ease(progress));this.avatar.body.rotation.z=Math.sin(progress*Math.PI)*.2;}
  for(const {prop,edge}of this.windProps){prop.rotation.z=reduced?0:Math.sin(sim.time*7)*(sim.calm(edge)?.08:.35);}
  for(const [id,obj]of this.objects){const n=this.level.nodes[id],age=sim.time-(sim.fragile[id]??sim.time);obj.visible=!n.fragile||age<4||sim.pinned.includes(id);obj.rotation.z=n.fragile&&age>3&&!reduced?Math.sin(sim.time*32)*.035:0;}
  const age=sim.time-sim.arrived;this.sparks.forEach((dot,i)=>{dot.visible=!reduced&&age<.42&&!m;const angle=i*2.4;dot.position.set(pos[0]+Math.cos(angle)*age*1.9,pos[1]+.1+Math.sin(angle)*age-.5*age*age,pos[2]+.1);dot.scale.setScalar(Math.max(0,.1*(1-age/.42)));});
  const checkpoint=v(this.level.nodes[sim.checkpoint.position].p);checkpoint.z+=.5;const endRope=this.avatar.root.position.clone();endRope.y+=.35;const middle=checkpoint.clone().lerp(endRope,.5);middle.y-=sim.catchMotion?0:.24;this.rope.geometry.setFromPoints([checkpoint,middle,endRope]);
  this.renderer.render(this.scene,this.camera);return {triangles:this.renderer.info.render.triangles,drawCalls:this.renderer.info.render.calls,textures:this.renderer.info.memory.textures,geometries:this.renderer.info.memory.geometries};
 }
 thumbnail(level){if(this.thumbCache.has(level.id))return this.thumbCache.get(level.id);const old={width:this.width,height:this.height};this.resize(256,320);this.load(level,0);this.avatar.root.position.copy(v(level.nodes[level.start].p)).add(new T.Vector3(0,.1,.65));this.renderer.render(this.scene,this.camera);const url=this.canvas.toDataURL('image/webp',.8);this.thumbCache.set(level.id,url);this.resize(old.width,old.height);return url;}
 item(kind){if(this.itemCache.has(kind))return this.itemCache.get(kind);this.clearWorld();const old={width:this.width,height:this.height};this.resize(128,128);this.scene.background=new T.Color('#e7eee1');this.avatar.root.visible=false;if(kind==='fia'||kind.startsWith('fia-'))this.world.add(this.fox(kind.slice(4)||'classic').root);else if(kind==='taro')this.turtle(this.world,0,0,0,.9);else this.prop(kind,this.world);const bounds=new T.Box3().setFromObject(this.world),size=bounds.getSize(new T.Vector3());bounds.getCenter(this.center);this.span=Math.max(size.x,size.y,size.z)*1.24;this.fitCamera();this.renderer.render(this.scene,this.camera);const url=this.canvas.toDataURL('image/webp',.9);this.itemCache.set(kind,url);this.avatar.root.visible=true;this.resize(old.width,old.height);this.sector=-1;return url;}
 dispose(){this.clearWorld();this.geo.dispose();for(const material of this.materials.values())material.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.thumbCache.clear();this.itemCache.clear();}
}
