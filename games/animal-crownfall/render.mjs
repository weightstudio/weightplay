import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {powerOf} from './core.mjs';
import {makeActor,makeProp,makeCastle} from './block-art.mjs';
const PALETTE={A:0xd85078,B:0x39b8a5,C:0x8572d4,'#':0xa09c98,'1':0xd6a443,'2':0x57b7d4,'^':0x677082};
export class CrownScene {
  constructor(host,{label,onPick,onError,reduced=()=>false}) {
    this.host=host;this.label=label;this.onPick=onPick;this.reduced=reduced;this.disposed=false;this.frame=0;this.materials=new Map();this.hitTargets=[];this.ray=new THREE.Raycaster();this.abort=new AbortController();
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.setClearColor(0x243c48);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');host.prepend(this.canvas);
    this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-4,4,6,-6,.1,100);this.scene.add(new THREE.HemisphereLight(0xc1edff,0x604348,2.5));
    const sun=new THREE.DirectionalLight(0xffe1a3,3);sun.position.set(-4,10,14);this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0x5baeff,1);fill.position.set(7,0,6);this.scene.add(fill);
    const shape=new THREE.Shape();shape.moveTo(-.46,-.46);shape.lineTo(.46,-.46);shape.lineTo(.46,.46);shape.lineTo(-.46,.46);shape.closePath();
    this.geometry=new THREE.ExtrudeGeometry(shape,{depth:.84,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.04,bevelThickness:.04});this.geometry.translate(0,0,-.42);
    this.world=new THREE.Group();this.scene.add(this.world);this.labels=document.createElement('div');this.labels.className='actor-labels';host.append(this.labels);
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);
    this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.stop();onError();},{signal:this.abort.signal});
    let down=null;
    this.canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY,id:e.pointerId};this.canvas.setPointerCapture(e.pointerId);},{signal:this.abort.signal});
    this.canvas.addEventListener('pointercancel',()=>down=null,{signal:this.abort.signal});
    this.canvas.addEventListener('pointerup',e=>{if(!down||e.pointerId!==down.id)return;const p=down;down=null;if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>12)return;const r=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),this.camera);const hit=this.ray.intersectObjects(this.hitTargets,false)[0];if(hit)onPick(...hit.object.userData.cell);},{signal:this.abort.signal});
    this.resize();
  }
  material(colour,metal=false) {const key=`${colour}-${metal}`;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color:colour,roughness:metal?.3:.72,metalness:metal?.5:.05}));return this.materials.get(key);}
  box(parent,x,y,z,w,h,d,c,metal=false) {const mesh=new THREE.Mesh(this.geometry,this.material(c,metal));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;}
  actor(enemy=null) {return makeActor(this.box.bind(this),enemy);}
  prop(item) {return makeProp(this.box.bind(this),item);}
  clearWorld() {
    // InstancedMesh owns its instance buffer, but not the shared geometry or
    // materials. Release each old dressing batch before a state/resize rebuild.
    this.world.traverse(node=>{if(node.isInstancedMesh)node.dispose();});
    this.world.clear();
  }
  castle(rows) {
    const source=makeCastle(this.box.bind(this),rows,this.folded), groups=new Map();
    source.updateMatrixWorld(true);
    source.traverse(node=>{if(node.isMesh){const list=groups.get(node.material)||[];list.push(node);groups.set(node.material,list);}});
    for(const [material,parts] of groups) {
      const batch=new THREE.InstancedMesh(this.geometry,material,parts.length);
      parts.forEach((part,i)=>batch.setMatrixAt(i,part.matrixWorld));
      batch.instanceMatrix.needsUpdate=true;this.world.add(batch);
    }
    source.clear();
  }
  point(x,row){const cut=Math.ceil((this.rows||8)/2);return {x:x+(this.folded&&row>=cut?8.2:0),y:-(this.folded?row%cut:row)};}
  show(state,highlight=[]) {
    this.state=state;this.clearWorld();this.labels.replaceChildren();this.hitTargets=[];this.actorNodes=new Map();this.labelNodes=[];
    const rows=state.board.length;this.rows=rows;this.folded=this.host.clientWidth/this.host.clientHeight>1.7&&rows>6;this.center=((this.folded?Math.ceil(rows/2):rows)-1)/2;
    this.castle(rows);
    const marked=new Set(highlight.map(p=>p.join(',')));
    for(let y=0;y<rows;y++)for(let x=0;x<7;x++) {
      const c=state.board[y][x];if(c==='.')continue;const {x:gx,y:gy}=this.point(x,y);
      const m=this.box(this.world,gx,gy,0,.95,.95,.85,marked.has(`${x},${y}`)?0xffdf85:PALETTE[c],c==='1'||c==='2');
      if(/^[ABC]$/.test(c)){m.userData.cell=[x,y];this.hitTargets.push(m);const rune=this.box(this.world,gx,gy,.46,c==='A'?.28:.35,c==='B'?.1:.3,.055,0xffffff);rune.rotation.z=c==='C'?Math.PI/4:0;if(c==='A')this.box(this.world,gx,gy,.46,.1,.4,.06,0xffe5ee);}
      else if(c==='1'||c==='2'){for(const dx of [-.27,0,.27])this.box(this.world,gx+dx,gy,.46,.07,.78,.07,0xffdf8a,true);}
      else if(c==='^'){for(const dx of [-.26,0,.26]){const spike=this.box(this.world,gx+dx,gy+.2,.27,.16,.55,.16,0xd4e0e6,true);spike.rotation.z=.18;}}
    }
    const add=(a,kind)=>{
      const node=kind==='hero'?this.actor():kind==='enemy'?this.actor(a):this.prop(a);const at=this.point(a.x,a.y);
      // The platform below a logical actor cell tops out at cellY - .525.
      // Fit the actual boot/pedestal bottom to it, independently of model size.
      node.userData.groundOffset=-.525-new THREE.Box3().setFromObject(node).min.y;
      node.position.set(at.x,at.y+node.userData.groundOffset,.65);this.world.add(node);this.actorNodes.set(a.id||'hero',node);
      const label=document.createElement('span');label.className=`actor-tag ${kind}`;label.textContent=this.label(a,kind,state);this.labels.append(label);this.labelNodes.push({element:label,actor:a,kind});
    };
    add(state.hero,'hero');state.enemies.filter(e=>e.alive).forEach(e=>add(e,'enemy'));state.items.filter(i=>i.alive).forEach(i=>add(i,'item'));
    if(this.folded){for(const [index,title] of [[0,`1–${Math.ceil(rows/2)} ↓`],[1,`${Math.ceil(rows/2)+1}–${rows} ↓`]]){const el=document.createElement('span');el.className='board-section';el.textContent=title;el.style.left=index?'72%':'28%';this.labels.append(el);}}
    this.resize();this.paint();
  }
  resize(){if(this.disposed)return;const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);const folded=w/h>1.7&&(this.rows||8)>6;if(this.state&&folded!==this.folded){this.show(this.state);return;}const aspect=w/h,visibleRows=this.folded?Math.ceil(this.rows/2):(this.rows||8),worldHeight=Math.max(visibleRows+1.5,(this.folded?16.6:8.4)/aspect),worldWidth=worldHeight*aspect;this.camera.left=-worldWidth/2;this.camera.right=worldWidth/2;this.camera.top=worldHeight/2;this.camera.bottom=-worldHeight/2;this.camera.position.set(this.folded?7.1:3,-(this.center||3.5)+3.0,20);this.camera.lookAt(this.folded?7.1:3,-(this.center||3.5)+.25,0);this.camera.updateProjectionMatrix();this.paint();}
  paint(){if(this.disposed)return;this.renderer.render(this.scene,this.camera);for(const l of this.labelNodes||[]){const pos=this.point(l.actor.x,l.actor.y);const p=new THREE.Vector3(pos.x,pos.y+.7,.7).project(this.camera);l.element.style.left=`${(p.x+1)*50}%`;l.element.style.top=`${(1-p.y)*50}%`;}}
  async animate(event,previous,isPaused=()=>false) {
    if(this.disposed)return;
    const duration=this.reduced()?80:({clear:190,fall:280,walk:200,approach:320,hit:320,phase:400,fail:350,pickup:220,win:280}[event.type]||150);
    const hero=this.actorNodes.get('hero'),target=this.actorNodes.get(event.target);const origin=hero?.position.clone();let elapsed=0,last=performance.now();
    await new Promise(resolve=>{this.resolveAnimation=resolve;const tick=now=>{if(this.disposed){resolve();return;}const delta=Math.min(40,now-last);last=now;if(!isPaused()&&!document.hidden)elapsed+=delta;const p=Math.min(1,elapsed/duration);
      if(!this.reduced()) {
        if(event.type==='approach'&&hero&&origin){hero.position.x=origin.x+(this.point(event.to,previous.hero.y).x-origin.x)*.65*p;hero.rotation.z=-.08*Math.sin(p*Math.PI);}
        if(event.type==='fall')for(const [id,node] of this.actorNodes){const after=id==='hero'?event.state.hero:[...event.state.enemies,...event.state.items].find(a=>a.id===id);const before=id==='hero'?previous.hero:[...previous.enemies,...previous.items].find(a=>a.id===id);if(after&&before){const a=this.point(before.x,before.y),b=this.point(after.x,after.y);node.position.y=a.y+node.userData.groundOffset+(b.y-a.y)*p*p;node.position.x=a.x+(b.x-a.x)*p;}}
        if(hero?.userData.arms&&['approach','hit','win'].includes(event.type)) {
          hero.userData.arms.forEach((arm,i)=>{arm.rotation.x=event.type==='hit'?-Math.sin(p*Math.PI)*1.1:0;arm.rotation.z=(i?1:-1)*Math.sin(p*Math.PI)*(event.type==='win'?1.1:.15);});
          if(hero.userData.scarf)hero.userData.scarf.rotation.z=Math.sin(p*Math.PI)*.07;
        }
        if(['hit','phase','fail'].includes(event.type)&&target){target.rotation.z=Math.sin(p*Math.PI)*.2;target.position.x+=Math.sin(p*Math.PI*2)*.004;}
      }
      this.paint();if(p>=1){this.resolveAnimation=null;resolve();}else this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);});
  }
  cellPoints(){return this.hitTargets.map(m=>{const p=m.position.clone();p.z=.5;p.project(this.camera);const r=this.canvas.getBoundingClientRect();return {cell:m.userData.cell,x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};});}
  diagnostics(){
    let maxGroundGap=0;
    for(const {actor} of this.labelNodes||[]) {
      const node=this.actorNodes.get(actor.id||'hero');
      if(node)maxGroundGap=Math.max(maxGroundGap,Math.abs(new THREE.Box3().setFromObject(node).min.y-(this.point(actor.x,actor.y).y-.525)));
    }
    return {calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,...this.renderer.info.memory,materials:this.materials.size,contexts:1,revision:THREE.REVISION,maxGroundGap};
  }
  stop(){cancelAnimationFrame(this.frame);this.resolveAnimation?.();this.resolveAnimation=null;}
  destroy(){if(this.disposed)return;this.disposed=true;this.stop();this.abort.abort();this.observer.disconnect();this.clearWorld();this.geometry.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();this.labels.remove();}
}
