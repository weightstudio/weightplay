import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
import {propParts} from './block-props.mjs?v=1';

export const HERO_VISUAL_SCALE = 0.784;
// Ground X/Z, vertical Y. Camera projects ground Z at 0.6 and height at 0.8.
// Anchors compensate height so visible centres still equal simulation coordinates.
export class LionDefense3D {
  constructor() {
    this.resources=new Set();this.actors=new Map();this.models=new Map();this.dead=false;
    this.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
      this.renderer.setPixelRatio(1);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
      this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
      this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#182a3b');
      this.camera=new THREE.OrthographicCamera(-475,475,844,-844,.1,6000);
      this.camera.position.set(0,1800,2400);this.camera.lookAt(0,0,0);
      this.scene.add(new THREE.HemisphereLight('#bddcff','#31404c',1.8));
      const sun=new THREE.DirectionalLight('#ffe3ab',3.1);sun.position.set(-700,1200,800);this.scene.add(sun);
      const rim=new THREE.DirectionalLight('#88b9ff',1.3);rim.position.set(800,600,-900);this.scene.add(rim);
      this.unit=this.own(new THREE.BoxGeometry(1,1,1));
      this.material=this.own(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,metalness:.05}));
      this.white=this.own(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,emissive:'#ad7840',emissiveIntensity:1.2}));
      this.fx={};
      for(const [name,color] of Object.entries({fire:'#ffab45',storm:'#b6a1ff',fortress:'#6ee7df',hit:'#ffe4a5',danger:'#ff655d'}))
        this.fx[name]=this.own(new THREE.MeshBasicMaterial({color,transparent:true,opacity:.85,depthWrite:false,depthTest:false}));
      this.shieldMat=this.own(new THREE.MeshStandardMaterial({color:'#54cfd9',emissive:'#187b92',emissiveIntensity:.45,transparent:true,opacity:.27,roughness:.25,depthWrite:false}));
      this.shadowMat=this.own(new THREE.MeshBasicMaterial({color:'#081525',transparent:true,opacity:.24,depthWrite:false}));
      this.shadowGeo=this.own(new THREE.PlaneGeometry(1,1));
      this.shotPool=Array.from({length:160},()=>this.poolMesh(this.unit,this.fx.hit));
      this.particles=Array.from({length:96},()=>this.poolMesh(this.unit,this.fx.hit));
      this.shields=Array.from({length:12},()=>this.poolMesh(this.unit,this.shieldMat));
      this.shieldEdges=Array.from({length:48},()=>this.poolMesh(this.unit,this.fx.fortress));
      this.contextLost=false;this.onLost=e=>{e.preventDefault();this.contextLost=true;};
      this.renderer.domElement.addEventListener('webglcontextlost',this.onLost);
    } catch(error){this.dispose();throw error;}
  }
  own(r){this.resources.add(r);return r;}
  poolMesh(g,m){const mesh=new THREE.Mesh(g,m);mesh.visible=false;this.scene.add(mesh);return mesh;}
  geometry(parts){
    const source=this.unit.toNonIndexed(),p=[],n=[],c=[];
    for(const [x,y,z,w,h,d,color,angle=0] of parts){
      const matrix=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),angle),new THREE.Vector3(w,h,d));
      const normals=new THREE.Matrix3().getNormalMatrix(matrix),tint=new THREE.Color(color);
      for(let i=0;i<source.attributes.position.count;i++){
        const point=new THREE.Vector3().fromBufferAttribute(source.attributes.position,i).applyMatrix4(matrix);
        const normal=new THREE.Vector3().fromBufferAttribute(source.attributes.normal,i).applyMatrix3(normals).normalize();
        p.push(point.x,point.y,point.z);n.push(normal.x,normal.y,normal.z);c.push(tint.r,tint.g,tint.b);
      }
    }
    source.dispose();const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.computeBoundingSphere();return this.own(g);
  }
  model(kind,part='body'){
    const key=kind+':'+part;if(this.models.has(key))return this.models.get(key);
    const p=[],box=(...args)=>p.push(args);
    const fur={lion:'#f5b83d',boar:'#93573c',hyena:'#b4a073',rhino:'#7195a8',buffalo:'#645369',hawk:'#c89255',bear:'#795640',tiger:'#e99939',crocodile:'#579653'}[kind]||'#aa7850';
    if(kind==='lion'){
      if(part==='head'){
        box(0,.12,-.08,.94,.82,.49,'#b94d17');
        for(let i=0;i<5;i++){
          const x=(i-2)*.205,top=.59+(i%2)*.09;
          box(x,top,-.08,.19,.32,.42,i%2?'#f79622':'#df6518');
          box(x,-.33,-.03,.17,.23,.44,i%2?'#d96316':'#f49a26');
          for(const side of [-1,1])box(side*(.43+(i%2)*.06),-.22+i*.16,-.06,.22,.19,.47,i%2?'#f1a02e':'#d96718');
        }
        box(0,.12,.20,.64,.61,.47,'#f5b83d');
        for(const side of [-1,1]){
          box(side*.32,.42,.04,.21,.21,.24,'#efa732');box(side*.32,.43,.18,.11,.12,.06,'#9a5621');
          box(side*.17,.22,.45,.22,.20,.055,'#fff2d7');box(side*.14,.22,.49,.09,.14,.03,'#462415');box(side*.13,.26,.51,.028,.034,.02,'#ffffff');
          box(side*.16,.36,.47,.26,.07,.07,'#703817',side*.18);
          box(side*.12,-.045,.52,.23,.13,.16,'#ffe2a0');box(side*.12,-.13,.5,.07,.09,.05,'#fff4cb');
        }
        box(0,-.15,.42,.34,.22,.11,'#50251c');box(0,-.23,.49,.18,.055,.035,'#c66955');
        box(0,.04,.62,.16,.09,.09,'#713d25');box(0,-.29,.42,.39,.09,.17,'#ffdfa2');
      }else if(part==='arm'){
        box(0,-.17,0,.23,.40,.25,fur);box(0,.02,0,.32,.19,.34,'#ecb742');box(0,.025,.035,.23,.12,.31,'#326bc1');
        box(0,-.35,.08,.28,.18,.30,'#e2a236');box(0,-.29,.08,.3,.06,.31,'#ffda72');
      }else if(part==='leg'){
        box(0,-.12,0,.22,.28,.25,fur);box(0,-.29,.08,.29,.16,.40,'#efc267');
        for(let i=-1;i<=1;i++)box(i*.074,-.29,.286,.012,.13,.01,'#bd8a37');
      }else{
        box(0,0,0,.52,.43,.38,'#2c58a2');box(0,.02,.205,.46,.36,.075,'#367fca');
        for(const side of [-1,1])box(side*.225,.02,.25,.055,.4,.055,'#f3c352');
        box(0,-.17,.245,.49,.06,.08,'#e6aa39');box(0,.03,.265,.15,.13,.04,'#ffda61');
        for(const side of [-1,1])box(side*.06,.14,.267,.055,.055,.05,'#ffda61');
        box(0,-.10,-.27,.54,.57,.065,'#254a93');box(.34,-.25,-.18,.32,.09,.10,'#eaa52c');box(.51,-.21,-.18,.12,.18,.14,'#cf661d');
      }
    }else{
      const wide=kind==='rhino'||kind==='buffalo'||kind==='bear';
      box(0,-.18,-.04,wide?.82:.56,.47,.48,fur);box(0,.24,.04,wide?.79:.65,.62,.55,fur);
      for(const s of [-1,1]){
        box(s*.24,-.50,.07,.24,.22,.34,fur);box(s*(wide?.48:.37),-.18,.02,.22,.37,.29,fur);
        box(s*.26,.61,.02,.19,.19,.20,fur);box(s*.19,.30,.33,.22,.17,.05,'#f4e3c0');box(s*.16,.28,.37,.085,.12,.04,'#212737');
        box(s*.19,.43,.36,.27,.065,.07,'#40342d',s*.15);
      }
      box(0,.03,.37,.40,.23,.23,kind==='boar'?'#ce846b':'#bda878');box(0,.12,.51,.19,.075,.06,'#342c2d');
      box(0,-.055,.50,.25,.07,.025,'#4c2727');
      if(kind==='boar'||kind==='buffalo')for(const s of [-1,1])box(s*.31,kind==='boar'?.04:.57,.38,.11,.30,.13,'#f6dfb1',s*.32);
      if(kind==='rhino'){box(0,.30,.53,.19,.36,.22,'#e7d9b3');box(0,-.14,.27,.80,.20,.12,'#4e768e');}
      if(kind==='hawk')for(const s of [-1,1])for(let i=0;i<4;i++)box(s*(.42+i*.12),.02-i*.05,0,.16,.45-i*.045,.22,i%2?'#79503a':'#ddb776',s*.24);
      if(kind==='tiger'||kind==='hyena')for(const s of [-1,1])for(let i=0;i<3;i++)box(s*.3,-.1+i*.19,.33,.08,.065,.055,'#4d3c30',s*.25);
      if(kind==='crocodile'){box(0,.06,.52,.54,.22,.45,'#75ab64');for(let i=0;i<5;i++){box((i-2)*.1,-.04,.7,.046,.065,.06,'#f3e8c0');box(0,-.28,-.25-i*.11,.25-i*.03,.14,.16,'#3e7445');}}
      if(kind==='bear'){box(0,-.20,.22,.43,.30,.06,'#c29765');box(0,.52,.32,.19,.06,.05,'#b58a5a');}
    }
    const g=this.geometry(p);this.models.set(key,g);return g;
  }
  propModel(kind){const key='prop:'+kind;if(!this.models.has(key))this.models.set(key,this.geometry(propParts(kind)));return this.models.get(key);}
  place(mesh,x,y,elevation=0){mesh.position.set(x-this.w/2,elevation,(y-this.h/2+elevation*.8)/.6);}
  makeActor(kind,boss){
    const actor=new THREE.Group(),body=new THREE.Mesh(this.model(kind),this.material);actor.add(body);actor.userData.body=body;
    if(kind==='lion'){
      const head=new THREE.Mesh(this.model(kind,'head'),this.material);head.position.y=.62;head.scale.setScalar(.80);actor.add(head);actor.userData.head=head;
      actor.userData.arms=[];actor.userData.legs=[];
      for(const s of [-1,1]){const arm=new THREE.Mesh(this.model(kind,'arm'),this.material);arm.position.set(s*.40,.15,0);actor.add(arm);actor.userData.arms.push(arm);const leg=new THREE.Mesh(this.model(kind,'leg'),this.material);leg.position.set(s*.17,-.24,0);actor.add(leg);actor.userData.legs.push(leg);}
    }
    if(boss){const armor=new THREE.Mesh(this.geometry([[0,.70,0,.66,.10,.48,'#eec75a'],[-.25,.82,0,.12,.20,.16,'#d39b3f'],[.25,.82,0,.12,.20,.16,'#d39b3f'],[0,.85,.08,.13,.22,.18,'#e96558']]),this.material);actor.add(armor);actor.userData.ownedGeometry=armor.geometry;}
    const shadow=new THREE.Mesh(this.shadowGeo,this.shadowMat);shadow.rotation.x=-Math.PI/2;shadow.scale.set(1.15,.68,1);this.scene.add(shadow);actor.userData.shadow=shadow;
    return actor;
  }
  makeArena(w,h,wall){
    if(this.arena){this.scene.remove(this.arena);this.resources.delete(this.arena.geometry);this.arena.geometry.dispose();}
    const p=[],box=(x,y,z,sx,sy,sz,c)=>p.push([x,y,z,sx,sy,sz,c]);
    box(0,-35,0,w+300,65,h/.6+500,'#253647');
    const tile=110,rows=Math.ceil(h/.6/tile)+3,cols=Math.ceil(w/tile)+2;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const x=(c-cols/2)*tile+(r%2)*55,z=(r-rows/2)*tile;
      box(x,0,z,107,14,107,['#394c5d','#405465','#344858'][(r*7+c*3+r%3)%3]);
      box(x,8,z,101,3,101,['#4d6170','#536877','#455b6b'][(r*7+c+r%3)%3]);
      if((r*13+c*7)%11===0)box(x+21,10,z-20,32,2,3,'#324653');
    }
    for(const s of [-1,1]){
      for(let r=0;r<rows;r++)box(s*(w/2+12),30,(r-rows/2)*tile,52,65,85,r%2?'#6f8190':'#82949f');
      for(let r=0;r<5;r++){const z=(r-2)*h/.6/5;box(s*(w/2-25),52,z,60,110,62,'#687f8b');box(s*(w/2-25),113,z,74,16,76,'#a0aeb3');box(s*(w/2-35),91,z+38,15,26,13,'#ffb449');box(s*(w/2-49),24,z+50,19,14,27,'#68766d');}
    }
    const z=(wall-h/2)/.6;
    for(let row=0;row<2;row++)for(let c=0;c<Math.ceil(w/76)+1;c++)box(-w/2+c*76+row*35,25+row*28,z,72,26,76,row?'#94a5a8':'#687e87');
    for(let c=0;c<Math.ceil(w/110);c++)box(-w/2+c*110+35,72,z,51,43,78,'#b3beb8');
    for(const s of [-1,1]){box(s*w*.38,65,z+42,48,73,5,'#315b9f');box(s*w*.38,69,z+46,16,21,4,'#e9b84e');}
    this.arena=new THREE.Mesh(this.geometry(p),this.material);this.scene.add(this.arena);
  }
  render(state,w,h,wall,cssWidth,cssHeight){
    if(this.dead||this.contextLost)throw Error('3D context unavailable');
    if(this.w!==w||this.h!==h){this.w=w;this.h=h;this.camera.left=-w/2;this.camera.right=w/2;this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();this.makeArena(w,h,wall);}
    const scale=Math.min(globalThis.devicePixelRatio||1,1.5,1400/Math.max(cssWidth,cssHeight));
    const rw=Math.max(1,Math.round(cssWidth*scale)),rh=Math.max(1,Math.round(cssHeight*scale));
    if(rw!==this.rw||rh!==this.rh){this.rw=rw;this.rh=rh;this.renderer.setSize(rw,rh,false);}
    const records=[{key:'hero',kind:'lion',x:state.hero.x,y:state.hero.y,size:state.hero.width*HERO_VISUAL_SCALE},...state.enemies.filter(e=>e.hp>0).map(e=>({key:e,kind:e.type.id,...e}))],live=new Set();
    for(const r of records){
      live.add(r.key);let actor=this.actors.get(r.key);
      if(!actor){actor=this.makeActor(r.kind,r.isBoss);this.actors.set(r.key,actor);this.scene.add(actor);}
      const hero=r.key==='hero',size=r.size,hit=(r.hitFlash||0)>0;
      this.place(actor,r.x,r.y,size*.55);actor.scale.setScalar(size);
      actor.rotation.y=hero?-.18:.10;actor.userData.body.material=hit?this.white:this.material;
      this.place(actor.userData.shadow,r.x,r.y+size*.36,9);actor.userData.shadow.scale.set(size*1.1,size*.70,1);
      if(hero){
        const moving=Math.abs((this.lastHeroX??r.x)-r.x)>.1,step=moving&&!this.reducedMotion?Math.sin(state.time*17)*.32:0,recoil=state.shootPulse||0;
        actor.userData.legs.forEach((leg,i)=>leg.rotation.x=i?step:-step);
        actor.userData.arms.forEach((arm,i)=>arm.rotation.x=-recoil*2.3+(i?step:-step)*.35-(state.aegisPulse>0?.35:0));
        actor.userData.head.rotation.x=state.roarPulse>0?-.14:0;this.lastHeroX=r.x;
      }else{actor.rotation.z=this.reducedMotion?0:Math.sin(state.time*7+r.x)*.035;actor.userData.body.position.y=hit?.045:0;}
    }
    for(const [key,a] of this.actors)if(!live.has(key)){this.scene.remove(a,a.userData.shadow);if(a.userData.ownedGeometry){this.resources.delete(a.userData.ownedGeometry);a.userData.ownedGeometry.dispose();}this.actors.delete(key);}
    let si=0;
    for(const [items,friendly] of [[state.projectiles,true],[state.bossProjectiles,false]])for(const shot of items){
      if(si>=this.shotPool.length)break;const m=this.shotPool[si++];m.visible=true;m.geometry=friendly?this.propModel(shot.kind||'eraser'):this.unit;m.material=friendly?this.material:this.fx.danger;
      this.place(m,shot.x,shot.y,35);const size=Math.max(8,shot.size*(friendly?.85:.65));m.scale.set(size,size,size);m.rotation.set(.15,shot.rotation||0,.2);
    }
    for(;si<this.shotPool.length;si++)this.shotPool[si].visible=false;
    let pi=0;
    const particle=(x,y,size,material,angle=0,length=size)=>{if(pi>=this.particles.length)return;const m=this.particles[pi++];m.visible=true;this.place(m,x,y,42);m.scale.set(size,size,length);m.material=material;m.rotation.set(angle,angle,angle);};
    // Give persistent passive states a reserved, bounded visual budget before impacts.
    if(state.fireWallTimer>0)for(let i=0;i<10;i++){
      const x=(i+.5)*w/10,rise=(state.time*35+i*11)%28;
      particle(x,wall-85-rise,6+rise*.12,this.fx.fire,0,16);
      particle(x,wall-79,4,this.fx.hit,0,9);
    }
    for(let i=0;i<Math.min(6,state.stormCharge||0);i++){
      const a=state.time*2+i*Math.PI/3;
      particle(state.hero.x+Math.cos(a)*32,state.hero.y-25+Math.sin(a)*12,5,this.fx.storm,a,11);
    }
    if(state.bastionTimer>0)for(let i=0;i<3;i++)particle(state.hero.x+(i-1)*19,state.hero.y-18-((state.time*22+i*9)%32),4,this.fx.fortress,0,12);
    for(const hit of state.hits.slice(-12)){
      const progress=1-Math.min(1,hit.life/(hit.maxLife||.46)),mat=hit.shield?this.fx.fortress:hit.lightning?this.fx.storm:hit.fire?this.fx.fire:this.fx.hit;
      if(hit.toX!==undefined){const dx=hit.toX-hit.x,dy=hit.toY-hit.y;for(let i=0;i<7;i++)particle(hit.x+dx*i/6,hit.y+dy*i/6+(i%2?7:-7),5,mat,0,18);}
      else for(let i=0;i<6;i++){const a=i*Math.PI/3,spread=(hit.shield?25:18)+progress*Math.min(65,hit.radius);particle(hit.x+Math.cos(a)*spread,hit.y+Math.sin(a)*spread,Math.max(2,9*(1-progress)),mat,a);}
    }
    for(const shot of state.projectiles.slice(0,12))particle(shot.x,shot.y+shot.size*.65,4,this.fx[state.specialization]||this.fx.hit,0,22);
    for(const e of state.enemies){
      if(e.burnTimer>0)particle(e.x+e.size*.2,e.y-e.size*.2,8,this.fx.fire,state.time);
      if(e.isBoss&&e.bossAttackTimer<.65)for(let i=-1;i<=1;i++)particle(e.x+i*e.size*.28,e.y+e.size*.5,7,this.fx.danger,0,23);
    }
    if(state.roarPulse>0)for(let i=-3;i<=3;i++)particle(state.hero.x+i*25,wall-45-(.5-state.roarPulse)*160,7,this.fx.hit,0,16);
    if(state.shootPulse>0)particle(state.hero.x,state.hero.y-38,8,this.fx[state.specialization]||this.fx.hit,.5,15);
    for(;pi<this.particles.length;pi++)this.particles[pi].visible=false;
    for(let i=0;i<12;i++){
      const panel=this.shields[i],active=state.wallShield>0,delay=i*.025;
      panel.visible=active&&(!state.aegisPulse||.9-state.aegisPulse>=delay);this.place(panel,(i+.5)*w/12,wall-21,35);panel.scale.set(w/12-8,58,5);
      for(let edge=0;edge<4;edge++){const m=this.shieldEdges[i*4+edge];m.visible=panel.visible;m.position.copy(panel.position);m.position.x+=edge<2?(edge?1:-1)*(w/12-8)/2:0;m.position.y+=edge>=2?(edge===2?-29:29):0;m.scale.set(edge<2?2:w/12-8,edge<2?58:2,6);}
    }
    const shake=this.reducedMotion?0:Math.min(2,(state.impactPulse||0)*10)*Math.sin(state.time*90);
    this.camera.setViewOffset(rw,rh,Math.round(shake),0,rw,rh);this.renderer.render(this.scene,this.camera);this.camera.clearViewOffset();
    return this.renderer.domElement;
  }
  portrait(){
    this.renderer.setSize(320,320,false);this.camera.left=-.92;this.camera.right=.92;this.camera.top=1.17;this.camera.bottom=-.67;this.camera.updateProjectionMatrix();
    const actor=this.makeActor('lion',false);actor.rotation.y=-.22;this.scene.add(actor);this.scene.background=new THREE.Color('#21374d');
    this.renderer.render(this.scene,this.camera);
    const canvas=document.createElement('canvas');canvas.width=320;canvas.height=320;canvas.getContext('2d').drawImage(this.renderer.domElement,0,0);return canvas.toDataURL('image/png');
  }
  stats(){return {geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,actors:this.actors.size};}
  dispose(){if(this.dead)return;this.dead=true;this.renderer?.domElement.removeEventListener('webglcontextlost',this.onLost);for(const r of this.resources)r.dispose();this.resources.clear();this.models.clear();this.actors.clear();this.scene?.clear();this.renderer?.dispose();this.renderer?.forceContextLoss();}
}
