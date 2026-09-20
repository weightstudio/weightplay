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
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xa4c3bc);
    this.camera=new THREE.OrthographicCamera(-7,7,8,-8,.1,100);
    this.camera.position.set(0,9,19);
    this.camera.lookAt(0,.7,0);
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
  flatBox(parent,x,y,z,w,h,d,color){
    const key='hud:'+color;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshBasicMaterial({color,depthTest:false,depthWrite:false,toneMapped:false}));
    const mesh=new THREE.Mesh(this.geometry,this.materials.get(key));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.renderOrder=10;parent.add(mesh);return mesh;
  }
  buildWorld(){
    const g=this.environment;
    // A single road, with paired fortresses. X is the combat axis; Y is up.
    this.box(g,0,-.32,0,12,.6,3.8,0x596d5b);
    this.box(g,0,-.035,0,11.6,.12,2.6,0xb6a783);
    for(let x=-5;x<=5;x++)for(const z of [-.7,.7])this.box(g,x,.035,z,.94,.035,1.18,(x%2)?0xc6b894:0xafa585);
    for(const z of [-1.65,1.65])for(let x=-5;x<=5;x+=.6)this.box(g,x,.05,z,.48,.17,.28,0x7f8870);
    // Stone causeway above a river valley, with layered stepped silhouettes.
    this.scene.fog=new THREE.Fog(0xa4c3bc,26,65);
    this.box(g,0,-3.1,5,65,.12,55,0x568d8c);
    for(const x of [-4.6,0,4.6]){
      this.box(g,x,-1.45,0,.7,2.3,3.5,0x667970);
      this.box(g,x,-2.65,0,1.1,.3,3.9,0x839086);
    }
    for(let i=0;i<11;i++){
      const x=(i-5)*3.1,h=2.4+(i*7%5)*.65,z=-10-(i%3)*3;
      const tint=i%2?0x66847b:0x748f81;
      this.box(g,x,h/2-2,z,3.4,h,4,tint);
      this.box(g,x+.2,h-2,z+.2,2.4,h*.55,2.7,tint);
      this.box(g,x+.4,h*1.27-2,z+.3,1.25,.6,1.7,0x93aa91);
    }
    for(const side of [-1,1])for(let k=0;k<4;k++){
      const x=side*(5.3+k*.8),z=3.5+k*1.4;
      this.box(g,x,-1.7,z,2.5,2,3,0x566f60);
      this.box(g,x,-.6,z,2.4,.25,2.9,0x86916e);
      this.box(g,x+.1,.05,z,.25,1.2,.25,0x695742);
      this.box(g,x,.8,z,1.4,.8,1.3,k%2?0x4f7962:0x64896a);
      this.box(g,x,.8+.55,z,.9,.45,.8,0x7e9a73);
    }
    for(let i=0;i<10;i++)this.box(g,(i%5-2)*2.8,-3,5+Math.floor(i/5)*5,1.8,.025,.09,0x8db4a5);
    for(const side of [-1,1]){
      const base=new THREE.Group();base.position.x=side*5.1;g.add(base);
      this.box(base,0,.7,0,1.3,1.4,1.8,side<0?0x6e8980:0x877c71);
      this.box(base,0,1.5,0,1.65,.25,2,side<0?0x327c75:0x794b40);
      this.box(base,0,1.73,0,1.35,.22,1.65,side<0?0x3e9b87:0x995e49);
      this.box(base,0,.65,1,.65,.9,.08,0x263d3b);
      for(const x of [-.57,.57])this.box(base,x,.9,1.02,.14,1.2,.14,0xc0b394);
      this.box(base,0,2.3,-.2,.07,1.1,.07,0xd4b16b,true);
      this.box(base,.32,2.5,-.2,.64,.55,.08,side<0?0x287d73:0xb45743);
      this.box(base,.32,2.5,-.145,.12,.24,.02,0xe2c878,true);
      if(side<0){this.camp=base;const baby=this.character('baby',false,false);baby.scale.setScalar(.6);baby.position.set(.2,1.85,.6);base.add(baby);}
      else this.fortress=base;
    }
    this.hero=this.character('horse',true,false);this.hero.scale.setScalar(1.05);this.hero.rotation.y=-Math.PI/2+.22;this.hero.position.set(-4.15,0,1);g.add(this.hero);
    this.chargeTrail=this.box(g,0,.09,0,8,.045,.7,0xe4bd62);this.chargeTrail.visible=false;
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
      // Shoulder pivots carry both the hand and weapon, so a strike reads as
      // a whole arm movement rather than a detached weapon wobble.
      for(const x of [-.35,.35]){
        const arm=new THREE.Group();arm.position.set(x,.86+lift,0);rig.add(arm);
        this.box(arm,0,0,0,.25,.22,.46,steel,true);this.box(arm,0,-.23,0,.18,.28,.2,tint);this.box(arm,0,-.42,-.01,.17,.14,.2,skin);
        if(x>0)g.userData.attackArm=arm;else g.userData.offArm=arm;
      }
      for(const x of [-.15,0,.15])this.box(rig,x,.65+lift,-.28,.08,.23,.025,0x667b83,true);
      this.box(rig,0,1.19+lift,0,.59,.55,.49,skin);
      this.box(rig,0,1.47+lift,.015,.64,.12,.53,enemy?0x4e535c:0x314345);
      this.box(rig,0,1.58+lift,.06,.2,.18,.2,general?0x192f34:tint);
      if(general){this.box(rig,0,.85+lift,.27,.62,.68,.09,tint);this.box(rig,0,.49+lift,.33,.7,.18,.1,tint);if(type!=='horse')this.box(rig,0,1.01+lift,-.26,.3,.25,.1,type==='bow'?0xe8e0c6:0x27353a);}
      else {this.box(rig,-.29,1.22+lift,.02,.08,.42,.48,steel,true);this.box(rig,.29,1.22+lift,.02,.08,.42,.48,steel,true);}
      const weapon=new THREE.Group();weapon.position.set(.09,-.28,-.1);g.userData.attackArm.add(weapon);g.userData.weapon=weapon;
      g.userData.attackStyle=['bow','medic','healer','flanker'].includes(type)?'bow':['spear','horse','charger'].includes(type)?'thrust':'slash';
      if(type==='bow'||type==='medic'||type==='healer'){
        for(const z of [-.23,.23])this.box(weapon,0,.12,z,.08,.65,.09,0xb88e57);
        this.box(weapon,0,.43,0,.08,.08,.54,0xc7a15b);this.box(weapon,0,-.18,0,.08,.08,.54,0x8a653e);
      }else{
        this.box(weapon,0,.2,0,.065,type==='blade'?.55:1.55,.065,0x8e633c);
        const blade=this.box(weapon,0,type==='blade'?.64:1.07,0,type==='blade'?.19:.12,.5,.065,0xdce9e5,true);blade.rotation.z=-.13;
        this.box(weapon,0,.42,0,.29,.08,.12,0xd3ae5e,true);
      }
      const trail=new THREE.Group();weapon.add(trail);trail.visible=false;g.userData.strikeTrail=trail;
      for(let i=0;i<3;i++)this.box(trail,0,.48+i*.18,.11+i*.10,.08,.28,.045,enemy?0xffbd86:0xffedb3,true);
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
    for(const x of [-6.1,6.1])for(const y of [-.7,3.2])for(const z of [-1.8,1.8]){
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
      const bar=new THREE.Group();bar.position.y=type==='horse'||type==='charger'?2.48:2.12;obj.add(bar);
      this.flatBox(bar,0,0,0,.84,.105,.008,0x203b3d);
      obj.userData.health=this.flatBox(bar,0,0,.012,.78,.055,.008,enemy?0xef987a:0x6ae3be);
      obj.userData.healthBar=bar;
      this.actors.set(key,obj);this.scene.add(obj);}
    return obj;
  }
  render(battle,now,paused){
    if(this.disposed||this.failed)return;
    this.resize();this.lastBattle=battle;
    const active=new Set(),labelKeys=new Set(),time=now/1000;
    const mix=paused?1:Math.min(1,Math.max(0,(now-(battle.motionTimestamp||now))/100));
    const worldX=x=>(x-50)*.102;
    for(const a of [...battle.units,...battle.enemies]){
      const key='actor'+a.id;active.add(key);
      const type=a.enemy?(a.boss?a.bossKind:a.kind==='raider'?'horse':a.kind==='flanker'?'bow':a.kind==='soldier'?'blade':a.kind):a.type;
      const obj=this.actor(key,type,a.boss,a.enemy);
      const x=a.previousX+(a.x-a.previousX)*mix;
      obj.position.set(worldX(x),0,(a.id%5-2)*.27);
      // Three-quarter side silhouettes retain visible faces and the same foot axis.
      obj.rotation.y=a.enemy?Math.PI/2-.22:-Math.PI/2+.22;
      obj.scale.setScalar((a.boss?1.22:1.05)*(a.hp<=0?Math.max(.05,a.defeatedTicks/5):1));
      const rig=obj.userData.rig;
      const data=obj.userData, attacking=a.hp>0&&(Boolean(a.windup)||a.attackFlash>0);
      // The engine commits contact after three ticks. Preparation occupies the
      // first two, travel the third, then a held contact pose and recovery.
      const phase=attacking?5-a.attackFlash+mix:5;
      const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
      const prepare=ease(phase/2),swing=ease(phase-2),recover=ease((phase-3.4)/1.6);
      const strike=attacking?swing*(1-recover):0;
      const recoil=a.hp>0?Math.max(0,(a.hitFlash-mix)/3):0;
      rig.position.y=this.reduced?0:a.moving?Math.abs(Math.sin(time*10+a.id))*.04:0;
      rig.position.z=this.reduced?0:-strike*.22+recoil*.16;
      rig.rotation.set(this.reduced?0:strike*.12-recoil*.22,0,0);
      if(data.attackArm){
        const thrust=data.attackStyle==='thrust',bow=data.attackStyle==='bow';
        const rest=thrust?1.12:bow?.85:0;
        // Local forward is -Z: positive shoulder X lifts the lowered hand,
        // while the weapon's negative X rotation aims its tip forward.
        data.attackArm.rotation.x=rest+(attacking?(thrust?-.25*prepare+.55*strike:bow?.28*prepare-.42*strike:-.9*prepare*(1-swing)+1.35*strike)*(1-recover):0);
        data.weapon.rotation.x=thrust?-2.5:bow?-.85:attacking?-2.9*strike:0;
        data.weapon.position.z=-.1+(thrust&&attacking?.24*prepare*(1-swing)-.5*strike:0);
        data.offArm.rotation.x=bow?(attacking?.8+.5*prepare*(1-swing):.8):strike*.45;
        data.strikeTrail.visible=!this.reduced&&attacking&&phase>=2.55&&phase<3.65&&data.attackStyle!=='bow';
      }
      if(obj.userData.legs)for(const [i,leg] of obj.userData.legs.entries())leg.rotation.x=this.reduced||paused||!a.moving?0:Math.sin(time*10+i*Math.PI)*.25;
      if(a.bossKind==='bulwark')for(const shield of obj.userData.shields||[])shield.visible=a.shield;
      // Cancel the parent's yaw before matching the camera. Both the track
      // and fill stay screen-horizontal even while the soldier faces left.
      data.healthBar.quaternion.copy(obj.quaternion).invert().multiply(this.camera.quaternion);
      const healthRatio=Math.max(0,Math.min(1,a.hp/a.maxHp));
      data.health.scale.x=.78*healthRatio;data.health.position.x=-.39*(1-healthRatio);
      data.healthBar.visible=a.hp>0;
      if(a.boss&&a.hp>0){const label='boss'+a.id;labelKeys.add(label);this.label(label,battle.bossLabel||'',worldX(x),2.5,0,'boss');}
    }
    for(const [key,obj] of this.actors)if(!active.has(key)){this.scene.remove(obj);this.actors.delete(key);}
    const effectIds=new Set();
    for(const f of battle.effects){
      effectIds.add(f.id);let obj=this.fx.get(f.id);
      if(!obj){obj=new THREE.Group();const color=f.kind==='heal'?0x64e1a5:f.kind==='block'?0x74cbea:0xffe1a0;
        for(let k=0;k<(f.kind==='defeat'?4:1);k++)this.box(obj,k*.075,k*.06,0,f.kind==='arrow'?.38:.1,.10,.12,color,true);
        this.scene.add(obj);this.fx.set(f.id,obj);
      }
      const x=['arrow','attack'].includes(f.kind)?f.fromX+(f.x-f.fromX)*Math.min(1,(6-f.ttl)/3):f.x;
      obj.position.set(worldX(x),.8+(6-f.ttl)*.035,.35);obj.visible=f.kind!=='charge';
      if(f.text){const key='fx'+f.id;labelKeys.add(key);this.label(key,f.text,worldX(x),1.3+(6-f.ttl)*.06,.4,f.kind);}
    }
    for(const [id,obj] of this.fx)if(!effectIds.has(id)){this.scene.remove(obj);this.fx.delete(id);}
    for(const [key,node] of this.labels)if(!labelKeys.has(key)){node.remove();this.labels.delete(key);}
    this.hero.position.x=battle.chargeTicks>0?-4.2+(12-battle.chargeTicks)*.8:-4.15;
    this.hero.position.z=battle.chargeTicks>0?.6:1.05;
    this.chargeTrail.visible=battle.chargeTicks>0;
    this.camp.rotation.z=!this.reduced&&battle.campFlash>0?Math.sin(time*50)*.025:0;
    this.renderer.render(this.scene,this.camera);const r=this.renderer.info;
    Object.assign(this.info,{frames:this.info.frames+1,drawCalls:r.render.calls,triangles:r.render.triangles,geometries:r.memory.geometries,textures:r.memory.textures,actors:this.actors.size,effects:this.fx.size});
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.onLost);this.geometry.dispose();for(const mat of this.materials.values())mat.dispose();this.materials.clear();this.actors.clear();this.fx.clear();for(const node of this.labels.values())node.remove();this.labels.clear();this.lastBattle=null;this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();}
}
