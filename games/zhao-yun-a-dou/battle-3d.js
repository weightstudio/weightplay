// Original authored block rigs; repository-pinned Three.js r180 / MIT.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
const palette={blade:0xbb614d,spear:0x258d8a,horse:0xc69742,bow:0x7865ae};
export class ZhaoBattle3D {
  constructor(host, onFailure) {
    this.host=host; this.onFailure=onFailure; this.disposed=false; this.actors=new Map(); this.fx=new Map(); this.labels=new Map(); this.materials=new Map();
    this.geometry=new THREE.BoxGeometry(1,1,1); this.canvas=document.createElement('canvas');
    this.canvas.className='zhao-world'; this.canvas.setAttribute('aria-hidden','true'); host.prepend(this.canvas);
    try { this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'low-power'}); }
    catch(error){this.canvas.remove();this.geometry.dispose();throw error;}
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x172e32);
    this.camera=new THREE.OrthographicCamera(-7,7,8,-8,.1,100);
    this.camera.position.set(0,13.8,23);this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xc2e9ed,0x4a3425,2.2));
    const sun=new THREE.DirectionalLight(0xffdd9f,3.1);sun.position.set(-5,12,5);this.scene.add(sun);
    const rim=new THREE.DirectionalLight(0x75d8dc,1.5);rim.position.set(6,6,-8);this.scene.add(rim);
    this.environment=new THREE.Group();this.scene.add(this.environment);this.buildWorld();
    this.onLost=e=>{e.preventDefault();this.failed=true;this.onFailure();};this.canvas.addEventListener('webglcontextlost',this.onLost);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.info={frames:0,drawCalls:0,triangles:0,geometries:1,textures:0,actors:0,effects:0};
    this.frame=0;
  }
  mat(color,metal=false){const key=color+':'+metal;if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:metal?.38:.82,metalness:metal?.45:0}));return this.materials.get(key);}
  box(parent,x,y,z,w,h,d,color,metal=false){const mesh=new THREE.Mesh(this.geometry,this.mat(color,metal));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;}
  buildWorld(){
    const g=this.environment;
    this.box(g,0,-.38,0,9.3,.7,13,0x354c44);this.box(g,0,-.79,0,8.7,.14,12.5,0x162f35);
    for(let lane=0;lane<3;lane++){
      const x=(lane-1)*2.5;
      this.box(g,x,-.025,0,2.25,.08,11.8,lane===1?0x9a9272:0x817e64);
      for(let k=0;k<12;k++)this.box(g,x+(k%2?.12:-.12),.023,-5.3+k,1.96,.035,.87,k%2?0xaba184:0x999376);
      for(let k=0;k<3;k++)this.box(g,x,.06,2.9+k*.85,1.55,.07,.65,0x486e64);
      this.box(g,x,.02,5.55,2.2,.1,.18,0x6edcc1,true);
    }
    // Original carved gate, stepped tiled roof and brazier-bearing parapets.
    this.box(g,0,.65,-6,8.5,1.3,.55,0x657775);
    for(const x of [-3.8,-1.8,1.8,3.8]){this.box(g,x,1.35,-6,.55,2.7,.65,0xaaa58b);this.box(g,x,2.8,-6,.8,.22,.85,0x537f78);}
    this.box(g,0,2.5,-6,4.7,.35,.95,0x5a7970);this.box(g,0,2.82,-6,4.2,.28,1.05,0x31595c);this.box(g,0,3.08,-6,3.4,.24,.86,0x427270);
    this.box(g,0,1.5,-5.65,2.8,1.85,.15,0x253d3e);this.box(g,0,2.25,-5.49,1.1,.23,.08,0xc9a757,true);
    for(const side of [-1,1]){
      for(let k=0;k<7;k++){const z=-4.8+k*1.65;this.box(g,side*4.5,.32,z,.45,.65,.7,0x6c7971);this.box(g,side*4.5,.74,z,.6,.18,.84,0xa3a78e);}
      for(const z of [-4,1,4]){this.box(g,side*4.35,1.35,z,.09,1.8,.09,0xb89652,true);this.box(g,side*4.2,1.94,z,.4,.65,.1,side===1?0x307d77:0xb25242);this.box(g,side*4.2,1.64,z,.4,.06,.13,0xd7bc73,true);}
      // Layered mountain/terrace backdrop rather than a stretched bitmap.
      for(let k=0;k<4;k++)this.box(g,side*(6.6+k*.8),-.7+k*.4,-3.5-k*2,2.3,1.8+k,3.4, k%2?0x294847:0x345b54);
    }
    this.camp=new THREE.Group();g.add(this.camp);this.camp.position.set(0,0,6.05);
    this.box(this.camp,0,.23,0,1.55,.4,.85,0x866746);this.box(this.camp,0,.48,.2,1.65,.12,.5,0xc59c5b);
    const baby=this.character('baby',false,false);baby.scale.setScalar(.65);baby.position.y=.42;this.camp.add(baby);
    this.hero=this.character('horse',true,false);this.hero.position.set(-3.55,0,5.7);this.hero.rotation.y=Math.PI;g.add(this.hero);
    this.telegraph=this.box(g,0,.11,0,2.25,.035,10.8,0xd48739);this.telegraph.visible=false;this.laneMark=this.box(g,0,.08,0,2.15,.04,10.8,0x4bba9b);this.laneMark.visible=false;
  }
  character(type,general,enemy){
    const g=new THREE.Group(), rig=new THREE.Group();g.add(rig);g.userData.rig=rig;
    this.box(g,0,.018,.05,.76,.012,.56,0x354e48);
    const bossColors={bulwark:0x536b82,charger:0xb65c39,weaver:0x645c91,healer:0x399c7b,summoner:0xb38b47,warlord:0x922f3e};
    const tint=bossColors[type]||(enemy?(type==='medic'?0x72568c:type==='shield'?0x667883:0x984c43):(palette[type]||0x39a396));
    const skin=enemy?0xc18e70:0xe6b38b, steel=enemy?0x7b8588:0xbccfd0;
    let mounted=type==='horse'||type==='charger';const lift=mounted?.48:0;
    if(mounted){
      this.box(rig,0,.47,.06,.62,.5,1.05,general?0xdedfd3:0x926b4b);
      this.box(rig,0,.82,-.42,.36,.62,.4,general?0xf0e8d5:0xaa7c50);
      this.box(rig,0,.97,-.62,.35,.3,.45,general?0xe6dcc5:0x926746);
      this.box(rig,0,1.14,-.39,.15,.42,.1,0x454748);
      for(const x of [-.22,.22])for(const z of [-.35,.4])this.box(rig,x,.18,z,.13,.45,.14,0x465054);
      this.box(rig,0,.67,.12,.68,.12,.58,0x238f84);
    }
    if(type==='baby'){
      this.box(rig,0,.35,0,.58,.52,.46,0xecc57c);this.box(rig,0,.8,0,.57,.52,.5,skin);
      this.box(rig,0,1.07,0,.62,.08,.52,0x338d83);
    } else {
      for(const x of [-.17,.17]){const leg=this.box(rig,x,.25+lift,0,.23,.48,.27,0x3c4c50);(g.userData.legs ||= []).push(leg);this.box(rig,x,.07+lift,-.07,.27,.15,.38,0x25353b);}
      this.box(rig,0,.66+lift,0,.63,.52,.37,tint);this.box(rig,0,.72+lift,-.22,.46,.32,.1,steel,true);
      this.box(rig,0,.44+lift,-.04,.67,.09,.42,0xb49a5c,true);
      for(const x of [-.35,.35]){this.box(rig,x,.86+lift,0,.25,.22,.46,steel,true);this.box(rig,x,.63+lift,0,.18,.28,.2,tint);this.box(rig,x,.44+lift,-.01,.17,.14,.2,skin);}
      for(const x of [-.15,0,.15])this.box(rig,x,.65+lift,-.28,.08,.23,.025,0x667b83,true);
      this.box(rig,0,1.19+lift,0,.59,.55,.49,skin);
      this.box(rig,0,1.47+lift,.015,.64,.12,.53,enemy?0x4e535c:0x314345);
      this.box(rig,0,1.58+lift,.06,.2,.18,.2,general?0x192f34:tint);
      if(general){this.box(rig,0,.85+lift,.27,.62,.68,.09,tint);this.box(rig,0,.49+lift,.33,.7,.18,.1,tint);if(type!=='horse')this.box(rig,0,1.01+lift,-.26,.3,.25,.1,type==='bow'?0xe8e0c6:0x27353a);}
      else {this.box(rig,-.29,1.22+lift,.02,.08,.42,.48,steel,true);this.box(rig,.29,1.22+lift,.02,.08,.42,.48,steel,true);}
      const weapon=new THREE.Group();weapon.position.set(.44,.58+lift,-.1);rig.add(weapon);g.userData.weapon=weapon;
      if(type==='bow'||type==='medic'||type==='healer'){
        for(const z of [-.23,.23])this.box(weapon,0,.12,z,.08,.65,.09,0xb88e57);
        this.box(weapon,0,.43,0,.08,.08,.54,0xc7a15b);this.box(weapon,0,-.18,0,.08,.08,.54,0x8a653e);
      }else{
        this.box(weapon,0,.2,0,.065,type==='blade'?.55:1.55,.065,0x8e633c);
        const blade=this.box(weapon,0,type==='blade'?.64:1.07,0,type==='blade'?.19:.12,.5,.065,0xdce9e5,true);blade.rotation.z=-.13;
        this.box(weapon,0,.42,0,.29,.08,.12,0xd3ae5e,true);
      }
      if(type==='shield'||type==='bulwark'||(type==='blade'&&!general)){
        g.userData.shields=[this.box(rig,-.46,.65+lift,-.27,.4,.7,.1,0x54727a,true),this.box(rig,-.46,.65+lift,-.34,.32,.055,.04,0xd7b365,true)];
      }
    }
    if(type==='summoner'){this.box(rig,0,.75,-.55,.85,.7,.45,0xa77138);this.box(rig,0,1.12,-.55,.89,.06,.48,0xe1c087);}
    if(type==='weaver'){this.box(rig,-.46,1,-.15,.13,1.1,.1,0xd5dceb,true);this.box(rig,0,1.57,.1,.9,.08,.45,0x675486);}
    if(type==='warlord'){for(const x of [-.34,.34])this.box(rig,x,1.6,0,.12,.5,.13,0xe7c477,true);this.box(rig,0,.96,.34,.9,.85,.12,0x963c4f);}
    const faceY=(type==='baby'?.82:1.2+lift);
    for(const x of [-.14,.14]){this.box(rig,x,faceY,-.255,.12,.095,.025,0x273336);this.box(rig,x-.018,faceY+.015,-.273,.027,.025,.018,0xfff4d6);}
    this.box(rig,0,faceY-.12,-.27,.13,.05,.055,0xac705c);
    return g;
  }
  label(key,text,x,y,z,kind=''){
    let node=this.labels.get(key);if(!node){node=document.createElement('span');node.className='world-label '+kind;this.host.append(node);this.labels.set(key,node);}
    node.textContent=text;const point=new THREE.Vector3(x,y,z).project(this.camera);node.style.left=((point.x+1)*50)+'%';node.style.top=((-point.y+1)*50)+'%';node.hidden=point.z>1;
  }
  resize(){if(this.disposed)return;const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;
    if(this.width===w&&this.height===h)return;this.width=w;this.height=h;this.renderer.setSize(w,h,false);
    // Fit the playable board and character headroom, not the decorative mountains.
    this.camera.updateMatrixWorld();
    const bounds=new THREE.Box2();
    for(const x of [-4.8,4.8])for(const y of [-.8,3.3])for(const z of [-6.5,6.8]){
      const p=new THREE.Vector3(x,y,z).applyMatrix4(this.camera.matrixWorldInverse);
      bounds.expandByPoint(new THREE.Vector2(p.x,p.y));
    }
    const center=bounds.getCenter(new THREE.Vector2()),size=bounds.getSize(new THREE.Vector2());
    const aspect=w/h,half=Math.max(size.y/2,size.x/(2*aspect))*1.025;
    this.camera.left=center.x-half*aspect;this.camera.right=center.x+half*aspect;
    this.camera.top=center.y+half;this.camera.bottom=center.y-half;
    this.camera.updateProjectionMatrix();if(this.lastBattle)this.render(this.lastBattle,performance.now(),true);
  }
  actor(key,type,general,enemy){let obj=this.actors.get(key);const signature=type+general+enemy;
    if(obj&&obj.userData.signature!==signature){this.scene.remove(obj);this.actors.delete(key);obj=null;}
    if(!obj){obj=this.character(type,general,enemy);obj.userData.signature=signature;
      if(enemy){const bg=this.box(obj,0,2.1,0,.72,.065,.065,0x293e40);const health=this.box(obj,0,2.1,-.015,.7,.07,.07,0xe88b6a);obj.userData.health=health;}
      this.actors.set(key,obj);this.scene.add(obj);}
    return obj;
  }
  render(battle,now,paused){if(this.disposed||this.failed)return;this.resize();this.lastBattle=battle;const active=new Set(),labelKeys=new Set();const time=now/1000;
    battle.units.forEach((u,slot)=>{if(!u)return;const key='u'+slot;active.add(key);const obj=this.actor(key,u.type,u.general,false);
      obj.position.set((slot%3-1)*2.5,0,2.7+Math.floor(slot/3)*1.1);obj.rotation.y=0;obj.scale.setScalar(u.general?1.1:.95);
      obj.userData.rig.position.y=this.reduced||paused?0:Math.sin(time*2+slot)*.018;
      if(obj.userData.weapon)obj.userData.weapon.rotation.x=u.attackFlash>0?-.6:0;
    });
    battle.enemies.forEach(e=>{const key='e'+e.id;active.add(key);const obj=this.actor(key,e.boss?e.bossKind:e.kind==='shield'?'shield':e.kind==='medic'?'medic':e.kind==='raider'?'horse':'blade',e.boss,true);
      const mix=paused?1:Math.min(1,Math.max(0,(now-(battle.motionTimestamp||now))/100));
      const p=(e.motionStartPosition??e.position)+(e.position-(e.motionStartPosition??e.position))*mix;
      obj.position.set((e.lane-1)*2.5+(e.id%3-1)*.33,0,-4.7+p*9.8);obj.rotation.y=Math.PI;
      obj.scale.setScalar((e.boss?1.2:.88)*(e.defeatedTicks?Math.max(.08,e.defeatedTicks/5):1));
      if(!this.reduced&&!paused){obj.userData.rig.position.y=e.hitFlash?.08:Math.abs(Math.sin(time*9+e.id))*.045;obj.rotation.z=e.hitFlash?.12:0;}
      if(e.bossKind==='bulwark')for(const shield of obj.userData.shields||[])shield.visible=e.shield;
      obj.userData.health.scale.x=.7*Math.max(0,e.hp/e.maxHp);obj.userData.health.visible=e.hp>0;
      if(obj.userData.legs&&!paused) obj.userData.legs.forEach((leg,i)=>leg.rotation.x=this.reduced?0:Math.sin(time*9+i*Math.PI)*.2);
    });
    for(const [key,obj] of this.actors)if(!active.has(key)){this.scene.remove(obj);this.actors.delete(key);}
    const effectIds=new Set();
    for(const effect of battle.effects.slice(-40)){
      const id=effect.id;effectIds.add(id);let obj=this.fx.get(id);
      if(!obj){obj=new THREE.Group();const color=effect.kind==='heal'?0x64e1a5:effect.kind==='charge'?0xffd978:effect.kind==='defeat'?0xd7c08b:effect.kind==='block'?0x74cbea:0xffe4ad;
        for(let k=0;k<(effect.kind==='defeat'?5:1);k++)this.box(obj,(k-2)*.09,k*.06,0,effect.kind==='charge'?.18:.1,.12,effect.kind==='charge'?2.2:.32,color,true);
        this.scene.add(obj);this.fx.set(id,obj);}
      let z=-4.7+effect.position*9.8;
      if(effect.kind==='attack'){const age=1-effect.ttl/5;z=3.4+(z-3.4)*Math.min(1,age*2.5);}
      obj.position.set((effect.lane-1)*2.5,.8+(effect.kind==='defeat'?(9-effect.ttl)*.08:0),z);
      if(effect.kind==='hit'||effect.kind==='block')obj.rotation.z=time*9;
      if(['hit','block','defeat','heal'].includes(effect.kind)){const key='fx'+id;labelKeys.add(key);this.label(key,effect.text,(effect.lane-1)*2.5,1.4+(5-effect.ttl)*.13,z,effect.kind);}

    }
    for(const [id,obj] of this.fx)if(!effectIds.has(id)){this.scene.remove(obj);this.fx.delete(id);}
    for(let lane=0;lane<3;lane++){const key='lane'+lane;labelKeys.add(key);this.label(key,String(lane+1),(lane-1)*2.5,.2,5.5,'lane '+(battle.chargeTicks>0&&battle.commandLane===lane?'aimed':''));const node=this.labels.get(key);node.className='world-label lane '+(battle.chargeTicks>0&&battle.commandLane===lane?'aimed':'');}
    for(const enemy of battle.enemies.filter(e=>e.boss&&e.hp>0)){const key='boss'+enemy.id;labelKeys.add(key);this.label(key,enemy.label||'',(enemy.lane-1)*2.5,2.5,-4.7+enemy.position*9.8,'boss');}
    for(const [key,node] of this.labels)if(!labelKeys.has(key)){node.remove();this.labels.delete(key);}
    const imminent=battle.enemies.find(e=>e.telegraph>0&&e.hp>0);this.telegraph.visible=Boolean(imminent);if(imminent){this.telegraph.position.x=(imminent.lane-1)*2.5;this.telegraph.scale.z=1.2;this.telegraph.position.z=-4.7+imminent.position*9.8+.8;}
    this.hero.position.z=battle.chargeTicks>0?5.7-(10-battle.chargeTicks)*.8:5.7;
    this.hero.position.x=battle.chargeTicks>0?(battle.commandLane-1)*2.5:-3.55;
    this.camp.rotation.z=!this.reduced&&battle.campFlash>0?Math.sin(time*50)*.045:0;
    this.laneMark.visible=['mud','rally'].includes(battle.level.rule);this.laneMark.position.x=(battle.level.terrainLane-1)*2.5;
    this.laneMark.scale.z=.45;this.laneMark.position.z=1.8;
    this.renderer.render(this.scene,this.camera);const r=this.renderer.info;
    Object.assign(this.info,{frames:this.info.frames+1,drawCalls:r.render.calls,triangles:r.render.triangles,geometries:r.memory.geometries,textures:r.memory.textures,actors:this.actors.size,effects:this.fx.size});
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.onLost);this.geometry.dispose();for(const mat of this.materials.values())mat.dispose();this.materials.clear();this.actors.clear();this.fx.clear();for(const node of this.labels.values())node.remove();this.labels.clear();this.lastBattle=null;this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();}
}
