// Original authored block rigs; repository-pinned Three.js r180 / MIT.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';
const palette={blade:0xbb614d,spear:0x258d8a,horse:0xc69742,bow:0x7865ae};
export class ZhaoBattle3D {
  constructor(host, onFailure) {
    this.host=host; this.onFailure=onFailure; this.disposed=false; this.actors=new Map(); this.fx=new Map(); this.labels=new Map(); this.materials=new Map();
    this.campBars=[...host.querySelectorAll('[data-camp-health]')];
    this.campPoint=new THREE.Vector3();
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
  glowBox(parent,x,y,z,w,h,d,color){
    const key='glow:'+color;
    if(!this.materials.has(key))this.materials.set(key,new THREE.MeshBasicMaterial({color,toneMapped:false,depthWrite:false}));
    const mesh=new THREE.Mesh(this.geometry,this.materials.get(key));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  }
  impact(f){
    const g=new THREE.Group(),color=f.kind==='block'?0x7ee8ff:f.kind==='heal'?0x82f1b4:f.enemy?0xffb26c:0xffdc83;
    if(f.kind==='rocket'){
      this.box(g,0,0,0,.56,.14,.14,0xd8dbc4,true);this.box(g,.3,0,0,.15,.10,.10,0xb64c35);
      this.glowBox(g,-.4,0,0,.30,.10,.08,0xffa84c);this.glowBox(g,-.63,0,0,.20,.05,.04,0xffe7a5);
    }else if(f.kind==='bomb'){
      this.box(g,0,0,0,.25,.25,.25,0x433c37);this.glowBox(g,0,.18,0,.055,.12,.055,0xffbf66);
    }else if(f.kind==='blast'||f.kind==='rally'){
      for(let i=0;i<8;i++){const a=i*Math.PI/4;const m=this.glowBox(g,Math.cos(a)*.55,Math.sin(a)*.55,0,.18,.07,.05,f.kind==='rally'?0xf0ce69:0xffa56d);m.rotation.z=a;}
    }else if(f.kind==='arrow'){
      this.glowBox(g,0,0,0,.46,.035,.035,0xffedbe);this.glowBox(g,.24,0,0,.10,.10,.035,0xffffff);
    }else if(f.kind==='heal'){
      this.glowBox(g,0,0,0,.12,.44,.04,color);this.glowBox(g,0,0,0,.44,.12,.04,color);
    }else if(f.kind==='attack'){
      // A short, faceted crescent, only visible during the committed swing.
      for(let i=0;i<6;i++){const a=-1.1+i*.38;const m=this.glowBox(g,Math.cos(a)*.48,Math.sin(a)*.48,0,.06,.23,.035,color);m.rotation.z=a;}
    }else{
      const count=f.kind==='block'?4:6;
      if(f.kind==='hit'){
        this.glowBox(g,0,0,.04,.13,.38,.035,0xfff6df);
        this.glowBox(g,0,0,.04,.38,.10,.035,0xfff6df);
      }
      for(let i=0;i<count;i++){
        const angle=i*Math.PI*2/count+Math.PI/4;
        const m=this.glowBox(g,Math.cos(angle)*.22,Math.sin(angle)*.22,0,f.kind==='defeat'?.14:.22,f.kind==='defeat'?.12:.055,.055,color);
        m.rotation.z=angle;m.userData.sparkAngle=angle;
      }
    }
    return g;
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
    this.hero=this.character('horse',true,false);this.hero.scale.setScalar(1.05);this.hero.rotation.y=-Math.PI/2-.46;this.hero.position.set(-4.15,0,1);g.add(this.hero);
    this.chargeTrail=this.box(g,0,.09,0,8,.045,.7,0xe4bd62);this.chargeTrail.visible=false;
  }
  character(type,general,enemy,rarity=0){
    const identity=type;
    type=({guard:'blade',frost:'spear',vanguard:'horse',berserker:'blade',halberd:'spear',lancer:'horse',firebow:'bow',scout:'blade'})[type]||type;
    const g=new THREE.Group(), rig=new THREE.Group();g.add(rig);g.userData.rig=rig;
    this.box(g,0,.018,.05,.76,.012,.56,0x354e48);
    const bossColors={bulwark:0x536b82,charger:0xb65c39,weaver:0x645c91,healer:0x399c7b,summoner:0xb38b47,warlord:0x922f3e};
    const specialColors={bomber:0xd67c38,drummer:0x9f7944,arbalest:0x506585};
    const identities={guard:0x395b86,frost:0x69b8cc,vanguard:0xb96538,berserker:0xa33446,halberd:0x377768,lancer:0x8470b1,firebow:0xba7133,cannon:0x596f78,medic:0xd6dfb9,scout:0x4d5f7e};
    const tint=identities[identity]||bossColors[type]||specialColors[type]||(enemy?(type==='medic'?0x72568c:type==='shield'?0x667883:0x984c43):(palette[type]||0x39a396));
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
      else {this.box(rig,-.29,1.24+lift,.10,.08,.34,.28,steel,true);this.box(rig,.29,1.24+lift,.10,.08,.34,.28,steel,true);}
      if(rarity>0){
        const trim=rarity===2?0xf1cb68:0x85bbdb;
        this.box(rig,0,1.43+lift,-.27,.65,.065,.055,trim,true);
        this.box(rig,0,.77+lift,.28,.65,.67,.1,rarity===2?0x653f65:0x315f7c);
        for(const x of [-.37,.37])this.box(rig,x,.97+lift,0,.27,.09,.47,trim,true);
        if(rarity===2)this.box(rig,0,1.77+lift,.06,.14,.32,.16,trim);
      }
      const weapon=new THREE.Group();weapon.position.set(.09,-.28,-.1);g.userData.attackArm.add(weapon);g.userData.weapon=weapon;
      g.userData.attackStyle=['bow','medic','healer','flanker','arbalest'].includes(type)?'bow':['spear','horse','charger'].includes(type)?'thrust':'slash';
      if(type==='cannon'){
        // An original wheeled rocket carriage, with its operator behind it.
        weapon.visible=false;g.userData.attackStyle='cannon';
        for(const x of [-.48,.48])for(const z of [-.75,-.05])this.box(rig,x,.23,z,.17,.42,.42,0x303e42,true);
        this.box(rig,0,.40,-.45,.88,.18,1.08,0x795c42);
        const launcher=new THREE.Group();launcher.position.set(0,.73,-.45);rig.add(launcher);g.userData.launcher=launcher;
        for(const x of [-.22,0,.22]){this.box(launcher,x,0,-.15,.18,.20,1.04,0x455d66,true);this.box(launcher,x,0,-.69,.14,.14,.035,0x162e36);this.box(launcher,x,.15,-.04,.12,.08,.75,0xc9b575);}
        this.box(rig,0,.70,.29,.6,.43,.30,0x785942);
      }else if(type==='medic'&&!enemy){
        this.box(weapon,0,.15,0,.08,1.05,.08,0x725b44);this.box(weapon,0,.69,0,.32,.28,.13,0x71c6a0);
        this.box(rig,-.40,.53,.07,.25,.37,.38,0xe2d2a2);this.box(rig,-.54,.56,-.04,.02,.21,.065,0x3d917b);
        this.box(rig,-.54,.56,-.04,.02,.065,.22,0x3d917b);
      }else if(type==='arbalest'){
        this.box(weapon,0,.12,-.05,.1,.12,.8,0x815b3f);this.box(weapon,0,.12,-.32,.7,.08,.09,0xc2c8bc,true);this.box(weapon,0,.22,-.26,.045,.04,.75,0xd9c789);
      }else if(type==='bomber'){
        this.box(weapon,0,.15,-.03,.32,.35,.32,0x393d3e);g.userData.fuse=this.glowBox(weapon,0,.42,-.03,.05,.18,.05,0xffc36e);
        this.box(rig,0,.76,.32,.55,.5,.32,0x855d3d);
      }else if(type==='drummer'){
        this.box(weapon,0,.2,0,.06,.55,.06,0xd6bb79);this.box(rig,0,.57,-.48,.75,.55,.45,0x965133);this.box(rig,0,.87,-.48,.8,.055,.49,0xe0c698);this.box(rig,0,.29,-.48,.8,.055,.49,0xb39662);
      }else if(type==='bow'||type==='medic'||type==='healer'){
        for(const z of [-.23,.23])this.box(weapon,0,.12,z,.08,.65,.09,0xb88e57);
        this.box(weapon,0,.43,0,.08,.08,.54,0xc7a15b);this.box(weapon,0,-.18,0,.08,.08,.54,0x8a653e);
      }else{
        this.box(weapon,0,.2,0,.065,type==='blade'?.55:1.55,.065,0x8e633c);
        const blade=this.box(weapon,0,type==='blade'?.64:1.07,0,type==='blade'?.19:.12,.5,.065,0xdce9e5,true);blade.rotation.z=-.13;
        this.box(weapon,0,.42,0,.29,.08,.12,0xd3ae5e,true);
      }
      const trail=new THREE.Group();weapon.add(trail);trail.visible=false;g.userData.strikeTrail=trail;
      for(let i=0;i<5;i++){const a=-.65+i*.25;const m=this.glowBox(trail,0,.3+Math.cos(a)*.6,.12+Math.sin(a)*.6,.045,.26,.065,enemy?0xffbd86:0xffedb3);m.rotation.x=a;}
      if(type==='shield'||type==='bulwark'||(type==='blade'&&!general)){
        g.userData.shields=[this.box(rig,-.46,.65+lift,-.27,.4,.7,.1,0x54727a,true),this.box(rig,-.46,.65+lift,-.34,.32,.055,.04,0xd7b365,true)];
      }
      if(identity==='guard'){for(const shield of g.userData.shields||[])shield.scale.y*=1.4;this.box(rig,0,1.51,.05,.82,.10,.66,0x6a8d9c,true);}
      if(identity==='frost'){this.box(weapon,0,1.24,0,.23,.37,.10,0x8ce0e0,true);this.box(weapon,0,.92,0,.36,.08,.12,0x9adbd3);}
      if(identity==='halberd'){for(const x of [-.17,.17])this.box(weapon,x,1.06,0,.21,.42,.09,0xbfcfb8,true);}
      if(identity==='berserker'||identity==='scout'){
        for(const shield of g.userData.shields||[])shield.visible=false;
        this.box(g.userData.offArm,0,-.55,-.05,.13,.55,.07,0xd4e1d9,true);
        this.box(rig,0,1.08,-.28,.57,.16,.05,identity==='scout'?0x354b58:0x712f41);
      }
      if(identity==='vanguard'||identity==='lancer'){this.box(rig,0,1.8,.34,.05,1.05,.05,0xccb174);this.box(rig,.20,2.12,.34,.43,.37,.045,tint);}
      if(identity==='firebow'){this.box(weapon,0,.45,-.25,.19,.23,.13,0xe1aa50);this.box(rig,0,.76,.33,.42,.7,.25,0x794a37);}
    }
    if(type==='summoner'){this.box(rig,0,.75,-.55,.85,.7,.45,0xa77138);this.box(rig,0,1.12,-.55,.89,.06,.48,0xe1c087);}
    if(type==='weaver'){this.box(rig,-.46,1,-.15,.13,1.1,.1,0xd5dceb,true);this.box(rig,0,1.57,.1,.9,.08,.45,0x675486);}
    if(type==='warlord'){for(const x of [-.34,.34])this.box(rig,x,1.6,0,.12,.5,.13,0xe7c477,true);this.box(rig,0,.96,.34,.9,.85,.12,0x963c4f);}
    const faceY=(type==='baby'?.82:1.2+lift);
    for(const x of [-.14,.14]){this.box(rig,x,faceY,-.255,.12,.095,.025,0x273336);this.box(rig,x-.018,faceY+.015,-.273,.027,.025,.018,0xfff4d6);}
    this.box(rig,0,faceY-.12,-.27,.13,.05,.055,0xac705c);
    this.box(rig,0,faceY-.035,-.288,.10,.10,.075,skin);
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
    for(const x of [-6.1,6.1])for(const y of [-.7,3.8])for(const z of [-1.8,1.8]){
      const p=new THREE.Vector3(x,y,z).applyMatrix4(this.camera.matrixWorldInverse);
      bounds.expandByPoint(new THREE.Vector2(p.x,p.y));
    }
    const center=bounds.getCenter(new THREE.Vector2()),size=bounds.getSize(new THREE.Vector2());
    const aspect=w/h,half=Math.max(size.y/2,size.x/(2*aspect))*1.025;
    this.camera.left=center.x-half*aspect;this.camera.right=center.x+half*aspect;
    this.camera.top=center.y+half;this.camera.bottom=center.y-half;
    this.camera.updateProjectionMatrix();this.positionCampBars();if(this.lastBattle)this.render(this.lastBattle,performance.now(),true);
  }
  positionCampBars(){
    // Project only on resize: the shared canvas scale applies once, and
    // fixed horizontal tracks do not inherit the castle's hit shake.
    for(const bar of this.campBars)bar.hidden=false;
    const sizes=this.campBars.map(bar=>({width:bar.offsetWidth,height:bar.offsetHeight}));
    this.campBars.forEach((bar,index)=>{
      const side=bar.dataset.campHealth==='ally'?-1:1;
      const point=this.campPoint.set(side*5.1,3.08,0).project(this.camera);
      const half=sizes[index].width/2+6;
      bar.style.left=Math.max(half,Math.min(this.width-half,(point.x+1)*this.width/2))+'px';
      bar.style.top=Math.max(sizes[index].height+6,Math.min(this.height-6,(1-point.y)*this.height/2))+'px';
    });
  }
  actor(key,type,general,enemy,rarity=0){let obj=this.actors.get(key);const signature=type+general+enemy+rarity;
    if(obj&&obj.userData.signature!==signature){this.scene.remove(obj);this.actors.delete(key);obj=null;}
    if(!obj){obj=this.character(type,general,enemy,rarity);obj.userData.signature=signature;
      const bar=new THREE.Group();bar.position.y=['horse','charger','vanguard','lancer'].includes(type)?2.65:2.12;obj.add(bar);
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
      const type=a.enemy?(a.boss?a.bossKind:a.kind==='raider'?'horse':a.kind==='flanker'?'bow':a.kind==='soldier'?'blade':a.kind):(a.model||a.type);
      const obj=this.actor(key,type,a.boss,a.enemy,a.rarity);
      const x=a.previousX+(a.x-a.previousX)*mix;
      obj.position.set(worldX(x),0,(a.id%5-2)*.27);
      // Three-quarter side silhouettes retain visible faces and the same foot axis.
      obj.rotation.y=a.enemy?Math.PI/2+.46:-Math.PI/2-.46;
      obj.scale.setScalar((a.boss?1.22:1.05)*(a.hp<=0?Math.max(.05,a.defeatedTicks/5):1));
      const rig=obj.userData.rig;
      const data=obj.userData, attacking=a.hp>0&&(Boolean(a.windup)||a.attackFlash>0);
      // The engine commits contact after three ticks. Preparation occupies the
      // first two, travel the third, then a held contact pose and recovery.
      const phase=attacking?(a.windup?Math.min(3,3*(1-(a.windup.ticks-mix)/(a.windup.total||3))):5-a.attackFlash+mix):5;
      const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
      const prepare=ease(phase/2),swing=ease(phase-2),recover=ease((phase-3.8)/1.2);
      const strike=attacking?swing*(1-recover):0;
      const recoil=a.hp>0?Math.max(0,(a.hitFlash-mix)/3):0;
      rig.position.y=this.reduced?0:a.moving?Math.abs(Math.sin(time*10+a.id))*.04:0;
      rig.position.z=this.reduced?0:-strike*.28+recoil*.23;
      rig.rotation.set(this.reduced?0:strike*.18-recoil*.3,0,this.reduced?0:recoil*.06);
      rig.scale.set(1+(!this.reduced?recoil*.035:0),1-(!this.reduced?recoil*.035:0),1);
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
      if(data.fuse)data.fuse.visible=Boolean(a.windup);
      if(data.launcher)data.launcher.position.z=-.45+(this.reduced?0:strike*.22);
      if(battle.result){
        const winner=(battle.result==='win')!==a.enemy;
        rig.rotation.x=this.reduced?0:winner?-.04:.20;
        rig.position.z=0;
        if(data.attackArm){data.attackArm.rotation.x=winner?-2.5:.2;data.offArm.rotation.x=winner?-2.1:.1;data.strikeTrail.visible=false;}
        if(!this.reduced&&winner)rig.position.y=Math.max(0,Math.sin((battle.finaleElapsed||0)/180+a.id))*.07;
      }
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
      if(!obj){obj=this.impact(f);this.scene.add(obj);this.fx.set(f.id,obj);}
      const duration=f.flight||3,age=(f.flight?f.flight+3:6)-f.ttl+mix,flight=Math.min(1,Math.max(0,age-(duration-1)));
      const projectile=f.kind==='arrow'||f.kind==='bomb'||f.kind==='rocket';
      const rocketFlight=Math.max(0,Math.min(1,(age-3)/(duration-3)));
      const travel=f.kind==='rocket'?rocketFlight:flight;
      const x=projectile?f.fromX+(f.x-f.fromX)*travel:f.kind==='attack'?(f.fromX+f.x)/2:f.x;
      const targetZ=f.targetId==null?.35:(f.targetId%5-2)*.27;
      const sourceZ=f.sourceId==null?targetZ:(f.sourceId%5-2)*.27;
      const z=projectile?sourceZ+(targetZ-sourceZ)*travel:targetZ;
      obj.position.set(worldX(x),1.05,z+.3);obj.quaternion.copy(this.camera.quaternion);
      obj.visible=f.kind!=='charge'&&(f.kind!=='attack'||(!this.reduced&&age>=2&&age<3.7));
      const life=f.kind==='defeat'?8:6,progress=Math.max(0,(life-f.ttl+mix)/life);
      const power=f.strong?1.35:1;
      obj.scale.setScalar(projectile?1:power*(this.reduced?.65:Math.max(.05,1-progress*.8)));
      if(projectile){obj.visible=age>=(f.kind==='rocket'?3:duration-1)&&age<=duration;obj.rotation.z=f.enemy?Math.PI:0;if(f.kind==='bomb')obj.position.y+=Math.sin(flight*Math.PI)*.7;if(f.kind==='rocket')obj.position.y+=Math.sin(rocketFlight*Math.PI)*.8;}
      if(f.kind==='blast'||f.kind==='rally')obj.scale.setScalar(this.reduced?.8:.5+progress*1.7);
      if(f.kind==='attack'){obj.rotation.z=f.enemy?Math.PI:0;obj.scale.setScalar(.8);}
      for(const m of obj.children)if(m.userData.sparkAngle!=null){
        const a=m.userData.sparkAngle,spread=this.reduced?.2:.18+progress*(f.kind==='defeat'?.9:.6);
        m.position.x=Math.cos(a)*spread;m.position.y=Math.sin(a)*spread-(f.kind==='defeat'?progress*progress*.7:0);
        m.visible=!this.reduced||f.kind==='block';
      }
      if(f.text){const key='fx'+f.id;labelKeys.add(key);this.label(key,f.text,worldX(x),1.55+progress*.35,z+.35,f.strong?'strong-hit':f.kind);}
    }
    for(const [id,obj] of this.fx)if(!effectIds.has(id)){this.scene.remove(obj);this.fx.delete(id);}
    for(const [key,node] of this.labels)if(!labelKeys.has(key)){node.remove();this.labels.delete(key);}
    this.hero.position.x=battle.chargeTicks>0?-4.2+(12-battle.chargeTicks)*.8:-4.15;
    this.hero.position.z=battle.chargeTicks>0?.6:1.05;
    this.hero.userData.attackArm.rotation.x=battle.chargeTicks>0?1.45:0;
    this.hero.userData.weapon.rotation.x=battle.chargeTicks>0?-2.8:0;
    this.hero.userData.strikeTrail.visible=!this.reduced&&battle.chargeTicks>0;
    this.chargeTrail.visible=battle.chargeTicks>0;
    this.camp.rotation.z=!this.reduced&&battle.campFlash>0?Math.sin(time*50)*.025:0;
    if(battle.result)this.renderFinale(battle);
    this.renderer.render(this.scene,this.camera);const r=this.renderer.info;
    Object.assign(this.info,{frames:this.info.frames+1,drawCalls:r.render.calls,triangles:r.render.triangles,geometries:r.memory.geometries,textures:r.memory.textures,actors:this.actors.size,effects:this.fx.size});
  }
  renderFinale(battle){
    const p=Math.min(1,(battle.finaleElapsed||0)/(battle.finaleDuration||1800));
    const base=battle.result==='win'?this.fortress:this.camp;
    base.position.y=this.reduced?-.25:-Math.min(1,p*1.4)*.8;
    base.rotation.z=this.reduced?0:(battle.result==='win'?1:-1)*Math.min(.18,p*.2);
    if(!this.finalFragments){
      this.finalFragments=new THREE.Group();this.environment.add(this.finalFragments);
      for(let i=0;i<16;i++){const m=this.box(this.finalFragments,0,0,0,.14+i%3*.03,.13,.16,i%2?0xe2c37b:0x8b8978);m.userData.seed=i;}
    }
    this.finalFragments.visible=!this.reduced&&p<.85;
    this.finalFragments.position.x=base.position.x;
    for(const m of this.finalFragments.children){const i=m.userData.seed,a=i*2.4;m.position.set(Math.cos(a)*p*1.7,.9+Math.sin(p*Math.PI)*1.1-p*.9,Math.sin(a)*p*1.3);m.rotation.set(p*4+i,p*3,0);m.scale.setScalar(.15*(1-p*.7));}
  }
  dispose(){if(this.disposed)return;this.disposed=true;for(const bar of this.campBars)bar.hidden=true;this.resizeObserver.disconnect();this.canvas.removeEventListener('webglcontextlost',this.onLost);this.geometry.dispose();for(const mat of this.materials.values())mat.dispose();this.materials.clear();this.actors.clear();this.fx.clear();for(const node of this.labels.values())node.remove();this.labels.clear();this.lastBattle=null;this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();this.canvas.remove();}
}

// Production portraits are rendered from the exact authored combat rigs.
// Build-time only: no extra runtime WebGL context is needed for collection cards.
export function renderArmyPortrait(card, currency=null) {
  const painter=Object.create(ZhaoBattle3D.prototype);
  painter.geometry=new THREE.BoxGeometry(1,1,1);painter.materials=new Map();
  let renderer;
  try {
    const scene=new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xe9f4ee,0x354d47,2.6));
    const light=new THREE.DirectionalLight(0xffe0b0,3.5);light.position.set(-3,6,-4);scene.add(light);
    const rim=new THREE.DirectionalLight(0x92e4f1,2);rim.position.set(4,3,3);scene.add(rim);
    let subject;
    if(currency){
      subject=new THREE.Group();
      if(currency==='coins'){
        for(let i=0;i<3;i++){
          const coin=new THREE.Group();coin.position.set((i-1)*.26,.16+i*.18,i%2*.15);coin.rotation.y=i*.25;subject.add(coin);
          painter.box(coin,0,0,0,.73,.15,.73,0xd8a238,true);painter.box(coin,0,.10,0,.56,.08,.56,0xf3cb67,true);painter.box(coin,0,.15,0,.18,.018,.18,0x8e682d);
        }
      }else{
        for(let i=0;i<3;i++){
          const gem=new THREE.Group();gem.position.set((i-1)*.35,.32+i%2*.30,i%2*.10);gem.rotation.set(.18,.35,Math.PI/4);subject.add(gem);
          painter.box(gem,0,0,0,.43,.43,.43,0x32b6c1,true);painter.box(gem,-.065,.065,-.06,.30,.30,.37,0x8fe5e4,true);
        }
      }
    }else subject=painter.character(card.model,false,false,card.rarity);
    scene.add(subject);subject.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(subject),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
    const span=Math.max(size.y,size.x,size.z)*.72;
    const camera=new THREE.OrthographicCamera(-span,span,span,-span,.1,30);
    camera.position.copy(center).add(new THREE.Vector3(3.4,2.1,-5));camera.lookAt(center);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setSize(currency?128:192,currency?128:192);renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');
  }finally{painter.geometry.dispose();for(const material of painter.materials.values())material.dispose();renderer?.dispose();renderer?.forceContextLoss();}
}
