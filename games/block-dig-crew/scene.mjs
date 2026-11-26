import * as T from '../../src/vendor/three/r180-b59af7c93a55a6eb/three.module.min.js?wp-media=a5be5bf5d64c04da';
import {LANDS} from './model.mjs?v=2&wp-media=a5be5bf5d64c04da';

export const SLOT_COUNT=20;
const pos = id => [((id%5)-2)*1.38,(Math.floor(id/5)-1.5)*1.35];
const ease = n=>1-(1-n)**3;
const shade=(color,l)=>new T.Color(color).offsetHSL(0,0,l);
export function mountScene(host,land,onLost,flag=false) {
  const world=new T.Scene(), camera=new T.OrthographicCamera(-6,6,4,-4,.1,90);
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.14;
  renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.className='dig-webgl';
  const box=new T.BoxGeometry(1,1,1), crystal=new T.OctahedronGeometry(1,0),
    disc=new T.CylinderGeometry(1,1,1,8);
  const materials=new Map(), meshes=new Map(), actor=new T.Group(), terrain=new T.Group();
  const toolRoot=new T.Group(), impacts=[];
  const [grass,dirt,rock,sky]=LANDS[land].colors;
  host.style.setProperty('--dig-sky','#'+sky.toString(16).padStart(6,'0'));
  world.add(terrain,toolRoot,actor,new T.HemisphereLight(0xf0fff5,0x8a84bf,1.52));
  const sun=new T.DirectionalLight(0xffe0a8,2.3);
  sun.position.set(-6,11,5);world.add(sun);
  const rim=new T.DirectionalLight(0xaed6ff,1);rim.position.set(5,3,-8);world.add(rim);
  const mat=(color,metal=false)=>{
    const key=color+':'+metal;
    if(!materials.has(key)) materials.set(key,new T.MeshStandardMaterial({color,roughness:metal?.34:.83,metalness:metal?.38:.02,flatShading:true}));
    return materials.get(key);
  };
  const piece=(parent,color,x,y,z,w,h,d,g=box,metal=false)=>{
    const mesh=new T.Mesh(g,mat(color,metal));
    mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  };
  const variants=[-.035,0,.03,.06];
  const shadowShape=new T.PlaneGeometry(1,1);
  const shadowMat=new T.ShaderMaterial({
    transparent:true,depthWrite:false,
    vertexShader:'varying vec2 uv0; void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 uv0; void main(){float a=1.-smoothstep(.05,.50,length((uv0-.5)*vec2(1.,1.28)));gl_FragColor=vec4(.08,.07,.11,.36*a);}'
  });
  function shadow(x,z,width,depth) {
    const s=new T.Mesh(shadowShape,shadowMat);s.position.set(x,.019,z);
    s.rotation.x=-Math.PI/2;s.scale.set(width,depth,1);terrain.add(s);
  }
  function terrainTiles(){
    const forms=[];
    for(let z=0;z<9;z++)for(let x=0;x<13;x++){
      if((z===0||z===8)&&(x===0||x===12)) continue;
      const wx=(x-6)*.63,wz=(z-4)*.67;
      forms.push([wx,-.20,wz,.625,.40,.665,shade(grass,variants[(x*x+z*5+x*z)%4])]);
      if(x===0||x===12||z===0||z===8||(z===1||z===7)&&(x===1||x===11)){
        const h=.49+(x*z%4)*.18;
        forms.push([wx,-.4-h/2,wz,.63,h,.67,shade(dirt,variants[(x+z)%4])]);
        forms.push([wx,-.95-h/2,wz,.58,.49,.62,shade(rock,variants[(x+z*3)%4])]);
      }
    }
    const pile=new T.InstancedMesh(box,mat(0xffffff),forms.length), ref=new T.Object3D();
    forms.forEach(([x,y,z,w,h,d,c],i)=>{
      ref.position.set(x,y,z);ref.scale.set(w,h,d);ref.updateMatrix();pile.setMatrixAt(i,ref.matrix);pile.setColorAt(i,c);
    });
    terrain.add(pile);
    piece(terrain,dirt,0,-.7,0,7.42,.62,4.93);
    piece(terrain,rock,0,-1.21,0,6.75,.54,4.37);
    piece(terrain,rock,0,-1.61,0,5.38,.36,3.31);
  }
  terrainTiles();
  const decals = new T.InstancedMesh(box,mat(0xffffff),SLOT_COUNT);
  const stamp = new T.Object3D();
  for(let i=0;i<SLOT_COUNT;i++){
    const [x,z]=pos(i);stamp.position.set(x,.008,z);stamp.scale.set(.70,.018,.64);
    stamp.rotation.y=.11*Math.sin(i*3);stamp.updateMatrix();decals.setMatrixAt(i,stamp.matrix);
    decals.setColorAt(i,shade(grass,-.08));
  }
  terrain.add(decals);
  const mark = piece(terrain,0xffff86,0,.024,0,.77,.025,.77,disc);
  mark.visible=false;
  const seamGate=new T.Group(), frost=new T.Group(), anchor=new T.Group();
  terrain.add(seamGate,frost,anchor);
  for(let i=0;i<3;i++){
    piece(seamGate,shade(rock,.08+.025*i),(i-1)*.19,.04,.09*(i-1),.16,.085+.018*i,.35);
    const shard=piece(frost,0x94e6ff,(i-1)*.22,.075,i===1?-.20:.19,.14,.14,.14,crystal,true);
    shard.rotation.y=i*.72;
  }
  piece(frost,0x7acadd,0,.033,0,.79,.034,.67,disc,true);
  piece(anchor,0xa46439,-.26,.14,.19,.095,.22,.09);
  piece(anchor,0xf0bd5c,-.26,.27,.19,.16,.10,.12,disc,true);
  piece(anchor,0xa46439,.26,.11,-.20,.095,.18,.08);
  piece(anchor,0xffdc82,0,.17,0,.65,.052,.045).rotation.y=.64;
  for(const group of [seamGate,frost,anchor])group.visible=false;
  const traces=new T.InstancedMesh(box,mat(0xffffff),SLOT_COUNT*3);
  const black=new T.Matrix4().makeScale(0,0,0);
  for(let i=0;i<SLOT_COUNT*3;i++)traces.setMatrixAt(i,black);
  terrain.add(traces);
  const scrape=new T.Object3D();
  function scar(slot){
    const [x,z]=pos(slot);
    for(let i=0;i<3;i++){
      scrape.position.set(x+(i-1)*.14,.026,z+.07*Math.sin(i));
      scrape.rotation.y=.32*(i-1);
      scrape.scale.set(.10,.023,.29-i*.02);scrape.updateMatrix();
      traces.setMatrixAt(slot*3+i,scrape.matrix);traces.setColorAt(slot*3+i,shade(dirt,.03*i));
    }
    traces.instanceMatrix.needsUpdate=true;traces.instanceColor.needsUpdate=true;
  }
  // Each land has a distinct edge silhouette; none of the decoration occludes a tool slot.
  for(const [x,z,side] of [[-3.46,-2.35,-1],[3.52,-2.38,1],[-3.45,2.3,1],[3.47,2.28,-1]]){
    shadow(x+.16,z+.14,.89,.63);
    if(land===0||land===1){
      const leaf=land===0?0x488b52:0xcd744c, trunk=land===0?0x9d6548:0xa34a38;
      if(z<0){
        piece(terrain,trunk,x,.39,z,.20,.79,.21);
        piece(terrain,leaf,x,.86,z,.66,.38,.59);
        piece(terrain,leaf,x+.14*side,1.12,z-.09,.43,.32,.42);
        piece(terrain,shade(leaf,.1),x-.18*side,.91,z+.16,.36,.32,.38);
        piece(terrain,shade(leaf,.13),x+.13*side,1.29,z-.13,.24,.12,.23);
        piece(terrain,land===0?0xffe4a1:0xefd586,x-.29*side,.91,z+.37,.10,.11,.10);
      }else{
        piece(terrain,leaf,x,.10,z,.43,.19,.32);
        for(let i=0;i<3;i++)piece(terrain,i===1?0xffd572:0xfff2cb,x+(i-1)*.14,.24+.07*(i%2),z-.09*(i%2),.11,.11,.11);
      }
    } else {
      const hue=[0,0,0x63d6fd,0xff8c46,0xc1a6fb][land];
      piece(terrain,rock,x,.10,z,.60,.21,.49);
      for(let j=0;j<3;j++){
        const prism=piece(terrain,shade(hue,.055*j),x+(j-1)*.18,.24+(z<0?.14:.02)+.11*j,z+(j%2)*.12,.15,.26+j*.07,.14,crystal,true);
        prism.rotation.z=.23*(j-1);prism.rotation.y=j*.5;
      }
    }
  }
  if(land===1){
    for(let i=0;i<5;i++)piece(terrain,i%2?0xeab67e:0x9f5841,3.99,-.26-i*.13,1.98-i*.24,.26,.16,.55);
  }else if(land===2){
    for(let i=0;i<5;i++) {
      const gem=piece(terrain,i%2?0xa394ef:0x65cce7,-1.85+i*.45,-.66-i*.07,2.74,.18,.32,.17,crystal,true);
      gem.rotation.z=i*.42;
    }
  }else if(land===3){
    const lavaMat=mat(0xff9650);
    lavaMat.emissive.setHex(0xff5327);lavaMat.emissiveIntensity=.43;
    for(let i=0;i<8;i++){
      piece(terrain,0xff9650,-2.87+i*.38,-.61+.12*Math.sin(i*.72),2.85,.44,.11,.08);
    }
    piece(terrain,0xff9650,.09,-.88,2.87,.19,.47,.08);
  }else if(land===4){
    for(const x of [-.65,.65]){
      piece(terrain,0x8f94bf,x,.18,-2.83,.39,.35,.31);
      piece(terrain,0xd7e2cb,x,.54,-2.83,.26,.46,.28);
      piece(terrain,0xbcb8d8,x,.84,-2.83,.37,.15,.38);
    }
    piece(terrain,0xcdd8d2,0,.98,-2.83,1.69,.19,.26);
    piece(terrain,0xfbd787,.15,.88,-2.64,.13,.13,.09,disc,true);
  }
  // Rux: box muzzle, apron, tool belt, stepped brass horn, and backpack forge.
  actor.position.set(-3.13,0,-.94);actor.rotation.y=.12;actor.scale.setScalar(.57);
  shadow(-3.08,-.83,.92,.70);
  piece(actor,0x2b7c77,0,.61,0,.73,.67,.51);
  piece(actor,0x556784,0,1.23,.035,.87,.68,.62);
  for(const x of [-.27,.27]){
    piece(actor,0x596989,x,1.64,-.13,.20,.30,.20);
    piece(actor,0xc88d94,x,1.66,-.015,.10,.17,.045);
    piece(actor,0x7890a4,x,.19,.07,.31,.32,.38);
    piece(actor,0xf6eed6,x,1.29,.357,.17,.15,.055);
    piece(actor,0x2a2c3e,x+.03,1.28,.395,.073,.105,.028);
    piece(actor,0x74869f,x*1.62,.73,.05,.21,.38,.23);
  }
  piece(actor,0x91a3b1,0,1.095,.41,.61,.31,.31);
  for(const x of [-.15,.15])piece(actor,0x454c5e,x,1.13,.575,.069,.063,.026);
  piece(actor,0xf3a84a,0,1.43,.43,.22,.22,.20,disc,true).rotation.x=Math.PI/2;
  piece(actor,0xf9c25f,0,1.54,.50,.14,.16,.13);
  piece(actor,0xff924c,0,.94,.16,.69,.13,.57);
  piece(actor,0xb2733d,0,.48,.16,.74,.14,.56);
  piece(actor,0xffc163,0,.48,.46,.16,.14,.05,box,true);
  piece(actor,0x734939,0,.84,-.37,.55,.54,.32);
  piece(actor,0xd89c4e,.13,1.18,-.36,.16,.26,.18);
  piece(actor,0xdf9d60,-.21,.86,-.535,.13,.33,.048);
  piece(actor,0xf3ba63,.12,.89,-.54,.16,.16,.04,disc,true).rotation.x=Math.PI/2;
  for(const x of [-.19,.19]){
    piece(actor,0x4f9b89,x,.69,.273,.082,.37,.035);
    piece(actor,0xf7c364,x,.68,.3,.114,.107,.035,box,true);
  }
  const pennant=new T.Group();
  terrain.add(pennant);
  pennant.visible=flag;
  piece(pennant,0x6e5140,2.98,.57,-2.55,.06,1.14,.06);
  piece(pennant,0xf6b24d,3.21,.95,-2.55,.51,.34,.07);
  piece(pennant,0x1e8277,3.24,.95,-2.50,.22,.22,.025,disc);
  const clouds=[];
  for(const [x,y,z,k] of [[-3.6,2.6,-7.6,.65],[3.2,-2.8,-4.3,.8],[-2.75,-4.3,3.3,.57],[3.35,2.5,-8,.56]]){
    const cloud=new T.Group();world.add(cloud);cloud.position.set(x,y,z);cloud.scale.setScalar(k);clouds.push([cloud,x]);
    for(let i=0;i<5;i++)piece(cloud,0xe8f3f3,(i-2)*.57,(i%2)*.14,0,.77,.27,.51);
  }

  function makeTool(tier){
    const group=new T.Group(), inner=new T.Group();
    group.add(inner);
    const brass=0xf9bd54, copper=0xc97845, steel=0xb5e4ec, blue=0x5191ac;
    if(tier<4){
      piece(inner,copper,0,.39,0,.14,.69,.14);
      piece(inner,tier===0?brass:0xe68d42,0,.64,0,.24,.18,.18);
      if(tier===0){
        piece(inner,brass,0,.065,.07,.21,.38,.11,disc,true).rotation.x=Math.PI/2;
        piece(inner,0xffd571,0,.066,.12,.152,.074,.13,disc,true).rotation.x=Math.PI/2;
      } else if(tier===1||tier===2) {
        piece(inner,tier===1?brass:steel,0,.10,.07,.39,.27,.13,box,true);
        piece(inner,tier===1?copper:blue,0,.013,.09,.32,.18,.10,disc,true).rotation.x=Math.PI/2;
        if(tier===2)piece(inner,0x4c667f,0,.68,0,.35,.09,.17);
      } else {
        piece(inner,steel,0,.34,0,.63,.11,.14,box,true);
        piece(inner,blue,-.27,.27,0,.20,.10,.14,box,true).rotation.z=.85;
        piece(inner,steel,.30,.26,0,.21,.10,.13,box,true).rotation.z=-.76;
      }
    }else{
      piece(inner,0xffa348,0,.45,0,.42,.36,.35);
      piece(inner,0x377286,0,.65,0,.27,.12,.25);
      piece(inner,0x47748d,0,.21,0,.18,.31,.18,disc,true);
      piece(inner,steel,0,.075,0,.14,.26,.13,crystal,true);
      piece(inner,0x98f2d8,.19,.43,.032,.053,.13,.13);
    }
    inner.rotation.z=-.34;inner.scale.setScalar(1.16);
    group.position.y=.18;
    toolRoot.add(group);return {group,inner,tier};
  }
  function makeWorker(tier){
    const group=new T.Group(),inner=new T.Group();
    group.add(inner);
    const hat=tier===2?0x67e8dc:0xffc650;
    piece(group,0x315461,0,.26,0,.31,.32,.25);
    piece(group,0xb17955,0,.48,.01,.31,.25,.27);
    piece(group,hat,0,.61,.01,.38,.15,.33);
    piece(group,hat,0,.55,.14,.44,.05,.25);
    piece(group,0xfff5a5,0,.59,.19,.10,.08,.045,box,true);
    for(const x of [-.09,.09]){
      piece(group,0x312e2d,x,.11,0,.14,.16,.25);
      piece(group,0x342a28,x*.72,.48,.154,.034,.043,.022);
    }
    inner.position.set(.24,.33,.14);
    piece(inner,0x9b5e43,0,.01,0,.067,.55,.068);
    piece(inner,0xc9f6ee,0,.23,0,.32,.088,.10,box,true);
    toolRoot.add(group);return {group,inner,tier};
  }
  const chunks=new T.InstancedMesh(box,mat(0xffffff),60), sparks=new T.Object3D(), sparkColor=new T.Color();
  const ringShape=new T.RingGeometry(.83,1,16);
  const ringMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.72,depthWrite:false,side:T.DoubleSide});
  const rings=new T.InstancedMesh(ringShape,ringMat,10);
  rings.frustumCulled=false;rings.count=0;world.add(rings);
  chunks.frustumCulled=false;world.add(chunks);
  for(let i=0;i<60;i++)chunks.setMatrixAt(i,black);
  const projected=new T.Vector3();
  let size={width:0,height:0}, dead=false;
  function resize(){
    const width=host.clientWidth,height=host.clientHeight;
    if(!width||!height||size.width===width&&size.height===height)return;
    size={width,height};
    const a=width/height, span=Math.max(7.75,9.75/a);
    camera.left=-span*a/2;camera.right=span*a/2;camera.top=span/2;camera.bottom=-span/2;
    camera.position.set(3.15,a<.9?12.5:10,10.6);camera.lookAt(0,-.25,.04);camera.updateProjectionMatrix();
    camera.updateMatrixWorld();renderer.setSize(width,height,false);
  }
  function screen(slot,height=.44){
    const [x,z]=pos(slot);
    projected.set(x,height,z).project(camera);
    return [(projected.x+1)*size.width/2,(1-projected.y)*size.height/2];
  }
  function burst(slot,event,now,reduced) {
    scar(slot);
    if(reduced)return;
    const [x,z]=pos(slot);
    const color=event.drop!==null?[0xebf9ff,0x79ffd1,0x76b8ff,0xff8788,0xffaff6][event.drop]:
      event.double?0xffd25c:event.automatic?0x85f2d9:0xffd25c;
    impacts.push({x,z,now,color,automatic:event.automatic,strong:event.double||event.relic,seed:Math.random()*9});
    if(impacts.length>10)impacts.shift();
  }
  function draw(tools,now,reduced,objective){
    resize();let n=0,ringCount=0;
    mark.visible=objective?.slot!==undefined;
    seamGate.visible=mark.visible&&objective.cap;
    frost.visible=mark.visible&&objective.device==='chill'&&objective.applied;
    anchor.visible=mark.visible&&objective.device==='anchor'&&objective.applied;
    if(mark.visible){
      const [x,z]=pos(objective.slot);mark.position.set(x,.021,z);
      for(const group of [seamGate,frost,anchor])group.position.set(x,0,z);
    }
    const time=impacts.length?now-impacts.at(-1).now:1000;
    // Very short whole-island contact shudder; the rest of the UI stays fixed.
    const recoil=reduced||time>140?0:Math.sin(time/9)*.032*(1-time/140);
    terrain.position.x=recoil;
    actor.position.y=reduced?0:.025*Math.sin(now/550);
    for(const [cloud,x] of clouds)cloud.position.x=x+(reduced?0:.17*Math.sin(now/5500+x));
    for(const item of tools){
      let m=meshes.get(item.id);
      if(!m||m.tier!==item.tier){
        if(m)toolRoot.remove(m.group);
        m=item.worker?makeWorker(item.tier):makeTool(item.tier);meshes.set(item.id,m);
      }
      const [tx,tz]=pos(item.slot), [sx,sz]=pos(item.from??item.slot);
      const elapsed=now-(item.hit??-10000), travel=ease(Math.max(0,Math.min(1,(elapsed-118)/390)));
      const phase=item.travelOnly?1:Math.max(0,Math.min(1,elapsed/130));
      const bob=reduced?0:.055*Math.sin(now/380+item.id);
      const airborne=reduced?0:Math.sin(travel*Math.PI)*.83;
      const x=reduced?tx:sx+(tx-sx)*travel,z=reduced?tz:sz+(tz-sz)*travel;
      if(item.worker){
        m.group.position.set(x-.25,.035+(reduced?0:Math.sin(travel*Math.PI)*.32),z+.28);
        m.inner.rotation.z=-.5-(reduced?0:Math.sin(phase*Math.PI)*1.7);
        continue;
      }
      m.group.position.set(x,Math.max(.02,.16+bob+airborne-(reduced?0:Math.sin(phase*Math.PI)*.25)),z);
      m.inner.rotation.z=-.35+(reduced?0:-Math.sin(phase*Math.PI)*.98+Math.sin(travel*Math.PI)*.8);
      m.inner.rotation.y=reduced?0:Math.sin(travel*Math.PI)*.54+(m.tier===4&&elapsed<145?phase*6.283:0);
    }
    while(impacts.length&&now-impacts[0].now>510)impacts.shift();
    for(const p of impacts) {
      const t=(now-p.now)/510;
      if((p.automatic||p.strong)&&t<.55){
        sparks.position.set(p.x,.032,p.z);
        sparks.rotation.set(-Math.PI/2,0,0);
        sparks.scale.setScalar((.22+t*1.5)*(p.strong?1.3:1));sparks.updateMatrix();
        rings.setMatrixAt(ringCount,sparks.matrix);rings.setColorAt(ringCount++,sparkColor.setHex(p.color));
      }
      for(let i=0;i<6;i++){
        const a=p.seed+i*Math.PI/3, v=.30+.82*t;
        sparks.position.set(p.x+v*Math.cos(a),.05+Math.max(0,1.08*Math.sin(Math.PI*t)),p.z+v*Math.sin(a));
        sparks.rotation.set(a+t*2,t*4,a);
        sparks.scale.setScalar((.115+.05*(i%2))*(1-t));sparks.updateMatrix();
        chunks.setMatrixAt(n,sparks.matrix);chunks.setColorAt(n++,sparkColor.setHex(i<3?dirt:p.color));
      }
    }
    chunks.count=n;
    rings.count=reduced?0:ringCount;
    if(rings.count){rings.instanceMatrix.needsUpdate=true;rings.instanceColor.needsUpdate=true;}
    if(n){chunks.instanceMatrix.needsUpdate=true;chunks.instanceColor.needsUpdate=true;}
    if(size.width&&!dead)renderer.render(world,camera);
  }
  const lost=e=>{e.preventDefault();dead=true;onLost();};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  host.prepend(renderer.domElement);
  resize();
  return {draw,screen,burst,setFlag:value=>{pennant.visible=value;},
    stats:()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,three:T.REVISION}),
    dispose(){
      dead=true;renderer.domElement.removeEventListener('webglcontextlost',lost);
      for(const material of materials.values())material.dispose();
      shadowMat.dispose();
      rings.dispose();ringShape.dispose();ringMat.dispose();
      for(const shape of [box,crystal,disc,shadowShape])shape.dispose();
      for(const instanced of [chunks,...terrain.children.filter(c=>c.isInstancedMesh)])instanced.dispose();
      renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
    }};
}
