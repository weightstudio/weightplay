import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {powerOf} from './core.mjs';
const PALETTE={A:0xd85078,B:0x39b8a5,C:0x8572d4,'#':0xa09c98,'1':0xd6a443,'2':0x57b7d4,'^':0x677082};
export class CrownScene {
  constructor(host,{label,onPick,onError,reduced=()=>false}) {
    this.host=host;this.label=label;this.onPick=onPick;this.reduced=reduced;this.disposed=false;this.frame=0;this.materials=new Map();this.hitTargets=[];this.ray=new THREE.Raycaster();this.abort=new AbortController();
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.setClearColor(0x172934);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
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
  actor(enemy=false,boss=false) {
    const g=new THREE.Group(),fur=enemy?0x576276:0xf79732,dark=enemy?0x283443:0x713f33,cream=0xffdfb0,armor=enemy?(boss?0x8053a2:0x526d83):0x269cae;
    this.box(g,0,.0,0,.47,.43,.35,armor,true);this.box(g,0,.05,.2,.32,.24,.07,0xe6c774,true);
    this.box(g,0,.43,0,.68,.46,.43,fur);this.box(g,-.22,.76,0,.19,.23,.25,fur);this.box(g,.22,.76,0,.19,.23,.25,fur);
    this.box(g,-.22,.76,.13,.1,.13,.035,dark);this.box(g,.22,.76,.13,.1,.13,.035,dark);
    this.box(g,0,.28,.26,.43,.18,.16,cream);this.box(g,0,.36,.37,.12,.09,.06,dark);
    for(const side of [-1,1]){this.box(g,side*.18,.48,.23,.15,.12,.05,0xfffaf0);this.box(g,side*.18,.48,.27,.065,.1,.03,enemy?0x151d25:0x2476b5);this.box(g,side*.15,-.3,.01,.18,.27,.21,dark);this.box(g,side*.15,-.44,.1,.23,.13,.32,cream);this.box(g,side*.35,.0,.02,.17,.3,.22,fur);this.box(g,side*.37,-.1,.15,.21,.2,.25,enemy?0x9ba9b4:0xffc640,true);}
    if(!enemy){this.box(g,0,.14,.05,.58,.1,.49,0x278cd0);for(let i=0;i<3;i++)this.box(g,.37+i*.14,.14+i*.08,-.18,.19,.12,.12,i===2?0xffd254:0x288fd1);this.box(g,0,.61,.24,.1,.17,.04,0xffdc4f,true);this.box(g,.34,-.18,-.26,.22,.27,.24,fur);this.box(g,.47,-.04,-.29,.2,.21,.22,cream);}
    else {this.box(g,0,.65,0,.72,.14,.47,armor,true);this.box(g,0,.76,0,.18,.17,.29,boss?0xe0b44a:0xaab8c0,true);this.box(g,-.36,.03,.23,.25,.43,.09,armor,true);this.box(g,.43,.16,.09,.07,.55,.08,0xdbe7e8,true);}
    g.scale.setScalar(boss?.91:.8);return g;
  }
  prop(kind) {
    const g=new THREE.Group();
    if(kind==='crown'){this.box(g,0,0,0,.52,.15,.4,0xeab83c,true);for(const x of [-.23,0,.23]){this.box(g,x,.18,.13,.09,x===0?.34:.24,.1,0xffd55c,true);this.box(g,x,.25,.2,.06,.08,.04,x===0?0xe7607a:0x32bfbd,true);}this.box(g,0,-.15,0,.68,.1,.55,0xd0c1a2);}
    else if(kind==='key'){this.box(g,0,.07,0,.12,.48,.12,0xffd263,true);this.box(g,0,.31,0,.3,.15,.15,0xffd263,true);this.box(g,.11,-.11,0,.18,.1,.13,0xffd263,true);}
    else {this.box(g,0,.07,0,.35,.4,.18,kind==='seal'?0xf5ce62:0x64e2ec,true);this.box(g,0,.08,.12,.11,.17,.04,0xf7ffff,true);}
    return g;
  }
  point(x,row){const cut=Math.ceil((this.rows||8)/2);return {x:x+(this.folded&&row>=cut?8.2:0),y:-(this.folded?row%cut:row)};}
  show(state,highlight=[]) {
    this.state=state;this.world.clear();this.labels.replaceChildren();this.hitTargets=[];this.actorNodes=new Map();this.labelNodes=[];
    const rows=state.board.length;this.rows=rows;this.folded=this.host.clientWidth/this.host.clientHeight>1.7&&rows>6;this.center=((this.folded?Math.ceil(rows/2):rows)-1)/2;
    // Repeated masonry is actual geometry, with quiet contrast behind the puzzle.
    for(let y=-8;y<rows+8;y+=2)for(let x=-1;x<(this.folded?16:8);x+=2)this.box(this.world,x,y*-1, -1.3,1.92,1.92,.25,(x+y)%3?0x344752:0x3c5059);
    this.box(this.world,-.85,-this.center,-.42,.25,rows+18,1.6,0x64717a);this.box(this.world,this.folded?15.05:6.85,-this.center,-.42,.25,rows+18,1.6,0x64717a);
    const marked=new Set(highlight.map(p=>p.join(',')));
    for(let y=0;y<rows;y++)for(let x=0;x<7;x++) {
      const c=state.board[y][x];if(c==='.')continue;const {x:gx,y:gy}=this.point(x,y);
      const m=this.box(this.world,gx,gy,0,.95,.95,.85,marked.has(`${x},${y}`)?0xffdf85:PALETTE[c],c==='1'||c==='2');
      if(/^[ABC]$/.test(c)){m.userData.cell=[x,y];this.hitTargets.push(m);const rune=this.box(this.world,gx,gy,.46,c==='A'?.28:.35,c==='B'?.1:.3,.055,0xffffff);rune.rotation.z=c==='C'?Math.PI/4:0;if(c==='A')this.box(this.world,gx,gy,.46,.1,.4,.06,0xffe5ee);}
      else if(c==='1'||c==='2'){for(const dx of [-.27,0,.27])this.box(this.world,gx+dx,gy,.46,.07,.78,.07,0xffdf8a,true);}
      else if(c==='^'){for(const dx of [-.26,0,.26]){const spike=this.box(this.world,gx+dx,gy+.2,.27,.16,.55,.16,0xd4e0e6,true);spike.rotation.z=.18;}}
    }
    const add=(a,kind)=>{
      const node=kind==='hero'?this.actor():kind==='enemy'?this.actor(true,a.boss):this.prop(a.kind);const at=this.point(a.x,a.y);node.position.set(at.x,at.y-.1,.65);this.world.add(node);this.actorNodes.set(a.id||'hero',node);
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
        if(event.type==='fall')for(const [id,node] of this.actorNodes){const after=id==='hero'?event.state.hero:[...event.state.enemies,...event.state.items].find(a=>a.id===id);const before=id==='hero'?previous.hero:[...previous.enemies,...previous.items].find(a=>a.id===id);if(after&&before){const a=this.point(before.x,before.y),b=this.point(after.x,after.y);node.position.y=a.y-.1+(b.y-a.y)*p*p;node.position.x=a.x+(b.x-a.x)*p;}}
        if(['hit','phase','fail'].includes(event.type)&&target){target.rotation.z=Math.sin(p*Math.PI)*.2;target.position.x+=Math.sin(p*Math.PI*2)*.004;}
      }
      this.paint();if(p>=1){this.resolveAnimation=null;resolve();}else this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);});
  }
  cellPoints(){return this.hitTargets.map(m=>{const p=m.position.clone();p.z=.5;p.project(this.camera);const r=this.canvas.getBoundingClientRect();return {cell:m.userData.cell,x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};});}
  diagnostics(){return {calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,...this.renderer.info.memory,materials:this.materials.size,contexts:1,revision:THREE.REVISION};}
  stop(){cancelAnimationFrame(this.frame);this.resolveAnimation?.();this.resolveAnimation=null;}
  destroy(){if(this.disposed)return;this.disposed=true;this.stop();this.abort.abort();this.observer.disconnect();this.world.clear();this.geometry.dispose();for(const m of this.materials.values())m.dispose();this.materials.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();this.labels.remove();}
}
