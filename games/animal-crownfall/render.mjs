import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {powerOf} from './core.mjs';
import {makeActor,makeProp,makeCastle} from './block-art.mjs';
const PALETTE={A:0xd85078,B:0x39b8a5,C:0x8572d4,'#':0xa09c98,'1':0xd6a443,'2':0x57b7d4,'^':0x677082};
export class CrownScene {
  constructor(host,{label,onPick,onError,onContact=()=>{},reduced=()=>false}) {
    this.host=host;this.label=label;this.onPick=onPick;this.reduced=reduced;this.disposed=false;this.frame=0;this.materials=new Map();this.hitTargets=[];this.ray=new THREE.Raycaster();this.abort=new AbortController();
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.setClearColor(0x243c48);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.canvas=this.renderer.domElement;this.canvas.setAttribute('aria-hidden','true');host.prepend(this.canvas);
    this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-4,4,6,-6,.1,100);this.scene.add(new THREE.HemisphereLight(0xc1edff,0x604348,2.5));
    const sun=new THREE.DirectionalLight(0xffe1a3,3);sun.position.set(-4,10,14);this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0x5baeff,1);fill.position.set(7,0,6);this.scene.add(fill);
    const shape=new THREE.Shape();shape.moveTo(-.46,-.46);shape.lineTo(.46,-.46);shape.lineTo(.46,.46);shape.lineTo(-.46,.46);shape.closePath();
    this.geometry=new THREE.ExtrudeGeometry(shape,{depth:.84,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.04,bevelThickness:.04});this.geometry.translate(0,0,-.42);
    this.onContact=onContact;this.world=new THREE.Group();this.scene.add(this.world);this.terrain=new THREE.Group();this.world.add(this.terrain);this.actorNodes=new Map();this.labels=document.createElement('div');this.labels.className='actor-labels';host.append(this.labels);
    this.effect=document.createElement('div');this.effect.className='impact-cue';this.effect.hidden=true;host.append(this.effect);
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
  actor(enemy=null,gear=null) {return makeActor(this.box.bind(this),enemy,gear);}
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
      batch.instanceMatrix.needsUpdate=true;this.terrain.add(batch);
    }
    source.clear();
  }
  point(x,row){const cut=Math.ceil((this.rows||8)/2);return {x:x+(this.folded&&row>=cut?8.2:0),y:-(this.folded?row%cut:row)};}
  show(state,highlight=[],{preserve=false}={}) {
    this.state=state;this.labels.replaceChildren();this.labelNodes=[];
    const rows=state.board.length,wasFolded=this.folded;this.rows=rows;this.folded=this.host.clientWidth/this.host.clientHeight>1.7&&rows>6;if(wasFolded!==this.folded)preserve=false;this.center=((this.folded?Math.ceil(rows/2):rows)-1)/2;
    const terrainKey=JSON.stringify([state.board,highlight,this.folded]);
    if(terrainKey!==this.terrainKey){this.terrainKey=terrainKey;this.terrain.traverse(n=>{if(n.isInstancedMesh)n.dispose();});this.terrain.clear();this.hitTargets=[];this.castle(rows);
    const marked=new Set(highlight.map(p=>p.join(',')));
    for(let y=0;y<rows;y++)for(let x=0;x<7;x++) {
      const c=state.board[y][x];if(c==='.')continue;const {x:gx,y:gy}=this.point(x,y);
      const m=this.box(this.terrain,gx,gy,0,.95,.95,.85,marked.has(`${x},${y}`)?0xffdf85:PALETTE[c],c==='1'||c==='2');
      if(/^[ABC]$/.test(c)){m.userData.cell=[x,y];this.hitTargets.push(m);const rune=this.box(this.terrain,gx,gy,.46,c==='A'?.28:.35,c==='B'?.1:.3,.055,0xffffff);rune.rotation.z=c==='C'?Math.PI/4:0;if(c==='A')this.box(this.terrain,gx,gy,.46,.1,.4,.06,0xffe5ee);}
      else if(c==='1'||c==='2'){for(const dx of [-.27,0,.27])this.box(this.terrain,gx+dx,gy,.46,.07,.78,.07,0xffdf8a,true);}
      else if(c==='^'){for(const dx of [-.26,0,.26]){const spike=this.box(this.terrain,gx+dx,gy+.2,.27,.16,.55,.16,0xd4e0e6,true);spike.rotation.z=.18;}}
    }
    }
    const alive=new Set();
    const add=(a,kind)=>{
      const id=a.id||'hero',signature=JSON.stringify(kind==='hero'?[a.weapon,a.armor]:[a.kind,a.shield,a.boss,a.buff]);alive.add(id);
      let node=this.actorNodes.get(id);const oldPosition=node?.position.clone();
      if(!node||node.userData.signature!==signature){if(node)this.world.remove(node);node=kind==='hero'?this.actor(null,a):kind==='enemy'?this.actor(a):this.prop(a);node.userData.signature=signature;
      // The platform below a logical actor cell tops out at cellY - .525.
      // Fit the actual boot/pedestal bottom to it, independently of model size.
      node.userData.groundOffset=-.525-new THREE.Box3().setFromObject(node).min.y;
      this.world.add(node);this.actorNodes.set(id,node);if(oldPosition)node.position.copy(oldPosition);}
      const roommates=kind==='item'?state.items.filter(i=>i.alive&&i.x===a.x&&i.y===a.y):[];
      const occupied=kind==='item'&&(state.hero.x===a.x&&state.hero.y===a.y||state.enemies.some(e=>e.alive&&e.x===a.x&&e.y===a.y));
      const rank=roommates.findIndex(i=>i.id===a.id);
      node.userData.cellOffset=kind==='item'?occupied?.38:(rank-(roommates.length-1)/2)*.42:0;
      node.userData.labelLift=kind==='item'?(occupied?.45:0)+Math.max(0,rank)*.42:0;
      const at=this.point(a.x,a.y);if(!preserve||!oldPosition)node.position.set(at.x+node.userData.cellOffset,at.y+node.userData.groundOffset,.65);
      if(!preserve){node.rotation.set(0,0,0);node.visible=true;node.scale.setScalar(a.boss?.81:kind==='item'?1:.75);}
      const label=document.createElement('span');label.className=`actor-tag ${kind}`;const fullLabel=this.label(a,kind,state),symbol={sword:'⚔',armor:'▣',heart:'♥',elixir:'♥',fury:'ϟ'}[a.kind];label.textContent=kind==='item'&&symbol?`${symbol} ${a.kind==='elixir'||a.kind==='fury'?'×2':`+${a.amount||0}`}`:fullLabel;label.setAttribute('aria-label',fullLabel);this.labels.append(label);this.labelNodes.push({element:label,actor:a,kind,node});
    };
    add(state.hero,'hero');state.enemies.filter(e=>e.alive).forEach(e=>add(e,'enemy'));state.items.filter(i=>i.alive).forEach(i=>add(i,'item'));
    for(const [id,node] of this.actorNodes)if(!alive.has(id)){this.world.remove(node);this.actorNodes.delete(id);}
    if(this.folded){for(const [index,title] of [[0,`1–${Math.ceil(rows/2)} ↓`],[1,`${Math.ceil(rows/2)+1}–${rows} ↓`]]){const el=document.createElement('span');el.className='board-section';el.textContent=title;el.style.left=index?'72%':'28%';this.labels.append(el);}}
    this.resize();this.paint();
  }
  resize(){if(this.disposed||this.activeAnimation)return;const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);const folded=w/h>1.7&&(this.rows||8)>6;if(this.state&&folded!==this.folded){this.show(this.state);return;}const aspect=w/h,visibleRows=this.folded?Math.ceil(this.rows/2):(this.rows||8),worldHeight=Math.max(visibleRows+1.5,(this.folded?16.6:8.4)/aspect),worldWidth=worldHeight*aspect;this.camera.left=-worldWidth/2;this.camera.right=worldWidth/2;this.camera.top=worldHeight/2;this.camera.bottom=-worldHeight/2;this.camera.position.set(this.folded?7.1:3,-(this.center||3.5)+3.0,20);this.camera.lookAt(this.folded?7.1:3,-(this.center||3.5)+.25,0);this.camera.updateProjectionMatrix();this.paint();}
  paint(){if(this.disposed)return;this.renderer.render(this.scene,this.camera);for(const l of this.labelNodes||[]){const p=l.node.position.clone();p.y+=.77+(l.node.userData.labelLift||0);p.project(this.camera);l.element.style.left=`${(p.x+1)*50}%`;l.element.style.top=`${(1-p.y)*50}%`;l.element.hidden=!l.node.visible;}}
  async animate(event,previous,isPaused=()=>false) {
    if(this.disposed)return;
    const hero=this.actorNodes.get('hero'),target=this.actorNodes.get(event.target||event.id),origin=hero?.position.clone();
    const origins=new Map([...this.actorNodes].map(([id,n])=>[id,{position:n.position.clone(),scale:n.scale.clone()}]));
    const reduced=this.reduced(),type=event.type;
    const direction=event.to===undefined?Math.sign((target?.position.x??origin.x)-origin.x)||1:Math.sign(event.to-previous.hero.x)||1;
    const end=origin.clone();
    if(type==='walk'){const p=this.point(event.state.hero.x,event.state.hero.y);end.set(p.x,p.y+hero.userData.groundOffset,.65);}
    if(type==='approach'){const p=this.point(event.to,previous.hero.y);end.x=p.x-direction*.82;}
    const distance=end.distanceTo(origin);
    const crossesFold=this.folded&&[event.state.hero,...event.state.enemies,...event.state.items].some(a=>{const n=this.actorNodes.get(a.id||'hero');return n&&Math.abs(this.point(a.x,a.y).x-n.position.x)>7;});
    const duration=type==='walk'||type==='approach'?Math.max(140,Math.min(1050,distance*155)):
      ({clear:140,fall:crossesFold?900:360,hit:event.boss?850:660,phase:crossesFold?900:680,fail:650,pickup:420,win:420}[type]||150);
    let elapsed=0,last=performance.now(),contact=false;
    this.activeAnimation={type,progress:0,target:event.target||event.id};
    const smooth=p=>p*p*(3-2*p),clamp=p=>Math.max(0,Math.min(1,p));
    await new Promise(resolve=>{this.resolveAnimation=resolve;const tick=now=>{
      if(this.disposed){resolve();return;}const delta=Math.min(40,now-last);last=now;if(!isPaused()&&!document.hidden)elapsed+=delta;
      const p=Math.min(1,elapsed/duration);this.activeAnimation.progress=p;
      if(type==='walk'||type==='approach'){
        hero.position.lerpVectors(origin,end,smooth(p));hero.rotation.y=direction*.22;
        if(!reduced){const gait=Math.sin(p*Math.PI*Math.max(2,Math.ceil(distance)*2));hero.userData.legs?.forEach((leg,i)=>leg.rotation.x=gait*(i?1:-1)*.5);hero.userData.arms?.forEach((arm,i)=>arm.rotation.x=gait*(i?-1:1)*.35);hero.position.y+=Math.abs(gait)*.035;}
      }
      if(type==='fall'||type==='phase')for(const [id,node] of this.actorNodes){
        if(type==='phase'&&id!==event.target)continue;
        const after=id==='hero'?event.state.hero:[...event.state.enemies,...event.state.items].find(a=>a.id===id);if(!after)continue;
        const start=origins.get(id).position,b=this.point(after.x,after.y),to=new THREE.Vector3(b.x+(node.userData.cellOffset||0),b.y+node.userData.groundOffset,.65);
        node.visible=true;node.scale.copy(origins.get(id).scale);
        if(type==='phase')node.scale.setScalar(after.boss?.81:.75);
        // A folded tower is a continuous journey through a labelled gutter,
        // not a straight diagonal sweep over unrelated rooms.
        const crossing=this.folded&&Math.abs(to.x-start.x)>7;
        if(crossing){const cut=Math.ceil(this.rows/2),way=[start,new THREE.Vector3(7.1,-cut,.65),new THREE.Vector3(7.1,1,.65),to],segment=Math.min(2,Math.floor(p*3));node.position.lerpVectors(way[segment],way[segment+1],smooth(p===1?1:p*3-segment));}
        else node.position.lerpVectors(start,to,type==='fall'?p*p:smooth(p));
      }
      if(['hit','fail'].includes(type)){
        const swing=p<.25?-smooth(p/.25)*.12:p<.42?-.12+smooth((p-.25)/.17)*.38:p<.53?.26:.26*(1-smooth((p-.53)/.47));
        hero.position.x=origin.x+(reduced?0:direction*swing);hero.rotation.y=direction*.22;
        const arm=hero.userData.arms?.[previous.hero.weapon?1:direction>0?1:0];if(arm){arm.rotation.z=-direction*swing*(previous.hero.weapon?4.4:2.7);arm.rotation.x=-swing*2;}
        if(target&&p>=.42){const q=clamp((p-.42)/.58);target.rotation.z=reduced?0:-direction*Math.sin(q*Math.PI)*.23;target.position.x=origins.get(event.target).position.x+(reduced?0:direction*Math.sin(q*Math.PI)*.13);if(type==='hit'&&!event.phase){target.scale.copy(origins.get(event.target).scale).multiplyScalar(1-smooth(clamp((p-.72)/.28)));target.visible=p<1;}}
        if(type==='fail'&&p>.52&&!reduced){hero.rotation.z=direction*Math.sin((p-.52)/.48*Math.PI)*.24;}
      }
      if(type==='pickup'&&target){const q=smooth(p);target.scale.copy(origins.get(event.id).scale).multiplyScalar(1-q);target.position.y=origins.get(event.id).position.y+(reduced?0:q*.35);}
      if(type==='win'&&!reduced){hero.userData.arms?.forEach((arm,i)=>arm.rotation.z=(i?1:-1)*Math.sin(p*Math.PI)*1.15);}
      if(!contact&&p>=(['hit','fail'].includes(type)?.42:.45)){
        contact=true;this.onContact(event);
        if(['hit','fail','pickup'].includes(type)){const heroLabel=this.labelNodes.find(l=>l.kind==='hero');if(heroLabel)heroLabel.element.textContent=this.label(event.state.hero,'hero',event.state);}
        if(['hit','fail','pickup','phase'].includes(type)){
          const pos=(type==='pickup'?hero:target||hero).position.clone();pos.y+=1.2;pos.project(this.camera);
          this.effect.style.left=`${(pos.x+1)*50}%`;this.effect.style.top=`${(1-pos.y)*50}%`;this.effect.dataset.kind=type;this.effect.hidden=false;
          this.effect.textContent=type==='hit'?`+${event.power}  /  ♥ −${event.damage}`:type==='pickup'?event.gain?`♥ +${event.gain}`:this.label(event.state.items.find(i=>i.id===event.id),'item',event.state):type==='phase'?'Ⅱ':event.code==='health'||event.code==='power'?'♥ 0':'▣';
        }
      }
      this.paint();if(p>=1){
        if(type==='walk'||type==='approach')hero.position.copy(end);
        hero.userData.legs?.forEach(n=>n.rotation.set(0,0,0));hero.userData.arms?.forEach(n=>n.rotation.set(0,0,0));hero.rotation.z=0;
        this.effect.hidden=true;this.activeAnimation=null;this.resolveAnimation=null;resolve();
      }else this.frame=requestAnimationFrame(tick);
    };this.frame=requestAnimationFrame(tick);});
  }
  cellPoints(){return this.hitTargets.map(m=>{const p=m.position.clone();p.z=.5;p.project(this.camera);const r=this.canvas.getBoundingClientRect();return {cell:m.userData.cell,x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};});}
  diagnostics(){
    let maxGroundGap=0;
    for(const {actor} of this.labelNodes||[]) {
      const node=this.actorNodes.get(actor.id||'hero');
      if(node)maxGroundGap=Math.max(maxGroundGap,Math.abs(new THREE.Box3().setFromObject(node).min.y-(this.point(actor.x,actor.y).y-.525)));
    }
    return {calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,...this.renderer.info.memory,materials:this.materials.size,contexts:1,revision:THREE.REVISION,maxGroundGap,animation:this.activeAnimation?{...this.activeAnimation}:null,poses:Object.fromEntries([...this.actorNodes].map(([id,n])=>[id,{x:n.position.x,y:n.position.y,visible:n.visible}]))};
  }
  stop(){cancelAnimationFrame(this.frame);this.resolveAnimation?.();this.resolveAnimation=null;}
  destroy(){if(this.disposed)return;this.disposed=true;this.stop();this.abort.abort();this.observer.disconnect();this.clearWorld();this.actorNodes.clear();this.geometry.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();this.labels.remove();this.effect.remove();}
}
