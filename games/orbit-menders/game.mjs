import { createSaveAdapter } from './save.mjs';
import { LEVELS } from './levels.mjs';
const $=id=>document.getElementById(id),save=createSaveAdapter();
const el=Object.fromEntries(['gameFrame','mainScreen','mainContent','stageScreen','stageContent','stagePanel','stageRail','stageBack','battleScreen','battleContent','battleInfo','battleBack','arena','objective','context','diagnostics','pauseModal','resultModal','errorModal'].map(id=>[id,$(id)]));
let screen='main',view=null,selector=null,selected=0,generation=0;
const mobile=Boolean(navigator.userAgentData?.mobile)||(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)&&navigator.maxTouchPoints>0&&!matchMedia('(any-pointer:fine)').matches);
const audioIds=['game.start','movement.jump','movement.land','movement.dash','movement.hook','game.checkpoint','mechanism.unlock','board.move','reward.collect','magic.cast','magic.hit','player.hurt','feedback.hint','feedback.error'];
const frame=window.WeightPlayScreenFrame.mount({root:el.gameFrame,localeSelect:$('localeSelect'),playUI:true,scenes:{main:{root:el.mainScreen,header:el.mainScreen.querySelector('header'),content:el.mainContent},stage:{root:el.stageScreen,header:el.stageScreen.querySelector('header'),content:el.stageContent},battle:{root:el.battleScreen,header:el.battleScreen.querySelector('header'),content:el.battleContent,headerInfo:el.battleInfo}}});
const info=window.WeightPlayScreenFrame.createGroup();[...el.battleInfo.children].forEach(n=>info.add(n));frame.battleTopUI.add(info);
const summary=window.WeightPlayScreenFrame.createGroup();summary.add($('stageSummary'));frame.stageTopUI.add(summary);frame.commonDownButton.add($('stagesTab'));
const stageConfig={gameId:'orbit-menders',count:LEVELS.length,poster:'/assets/weightplay-boom-mane-lion.png',background:'/assets/lobby-block-atmosphere.svg',stage(i){const l=LEVELS[i];return {id:i+1,kicker:l.id,title:l.name??l.title,subtitle:i===0?'M1 · 操作測試場':'規劃中',status:i===0?'進入測試場':'尚未製作',summary:i===0?'繞行球面、跳躍、短衝、牽引與接軌。':'完整企劃保留；此關尚不可遊玩。',details:i===0?['電腦鍵鼠','不授予正式關卡進度']:['後續里程碑逐關實作與測試'],locked:i!==0,cleared:false};}};
function showScreen(next){screen=next;el.mainScreen.hidden=next!=='main';$('guide').hidden=next!=='main';el.stageScreen.hidden=next!=='stage';el.battleScreen.hidden=next!=='battle';frame.activate(next);window.WeightPlayBattleCanvas?.sync?.();if(next==='stage'){if(!selector)selector=window.WeightPlayPlayUI.mountStage({page:el.stagePanel,rail:el.stageRail,config:stageConfig,selected,onSelect:i=>selected=i,onStart:i=>{if(i===0)startBattle();},isActive:()=>screen==='stage'});else selector.refresh(selected);}else selector?.cancel?.();}
function leaveBattle(){generation++;view?.dispose();view=null;for(const id of ['pauseModal','resultModal','errorModal'])$(id).hidden=true;showScreen('stage');}
function modal(id){for(const name of ['pauseModal','resultModal','errorModal'])$(name).hidden=name!==id;const target=$(id).querySelector('button:not(:disabled)');requestAnimationFrame(()=>target?.focus());}
function pause(){if(!view||view.paused||view.finished)return;view.paused=true;view.input.setActive(false);view.accumulator=0;view.saveCheckpoint();modal('pauseModal');$('saveNotice').textContent=save.status.message||'本機存檔可用；測試場不發正式獎勵。';if(document.pointerLockElement===el.arena)document.exitPointerLock();}
function resume(){if(!view)return;el.pauseModal.hidden=true;view.paused=false;view.last=performance.now();view.motor.accumulator=0;view.input.setActive(true);el.arena.focus({preventScroll:true});}
async function startBattle(){
  if(mobile)return;const own=++generation;view?.dispose();view=null;for(const id of ['pauseModal','resultModal','errorModal'])$(id).hidden=true;showScreen('battle');el.objective.textContent='載入操作測試場…';
  try{const [THREE,motor,art,input]=await Promise.all([import('./vendor/three.module.min.js'),import('./motor.mjs'),import('./art.mjs'),import('./input.mjs')]);if(own!==generation)return;
    const gl=el.arena.getContext('webgl2',{antialias:true,alpha:false});if(!gl)throw Error('此瀏覽器無法使用WebGL2。請在支援的電腦瀏覽器開啟。');
    view=createCourse(THREE,motor,art,input,gl);view.start();window.WeightPlayAudio?.preload(audioIds).catch(()=>{});
  }catch(error){if(own!==generation)return;console.error(error);$('errorText').textContent=error.message;modal('errorModal');}
}

function createCourse(T,{CharacterMotor,tangent,transport},art,{InputRouter},gl){
  const fields=[{id:'garden',kind:'sphere',center:[0,0,0],radius:12,theme:'moss'},{id:'workshop',kind:'sphere',center:[0,0,-34],radius:6,theme:'moss'}],scene=new T.Scene();scene.background=new T.Color(0x84ddeb);scene.fog=new T.Fog(0xb4edf1,65,175);
  const renderer=new T.WebGLRenderer({canvas:el.arena,context:gl,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=false;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
  const camera=new T.PerspectiveCamera(62,1,.1,220);scene.add(new T.HemisphereLight(0xe5fcff,0x819c46,1.55),new T.AmbientLight(0xfff5df,.5));const light=new T.DirectionalLight(0xfff2dc,1.7);light.position.set(20,35,25);scene.add(light);
  const sound=window.WeightPlayAudio?.createScope();const play=id=>sound?.play(id);
  for(const f of fields){const planet=art.createPlanet(f);planet.position.fromArray(f.center);scene.add(planet);}
  const boxes=[],hero=art.createLion(),drone=art.createDrone();scene.add(hero,drone);
  const motor=new CharacterMotor({fields,start:[0,12,0],fieldId:'garden',boxes,assist:save.data.preferences.mode==='assist'});
  let power=false,bridge=false,bridgeT=0,check='entry',pulseT=0,hintT=0,time=0,lastUI=0,disposed=false,raf=0,resumed=false;
  let circuitAngle=0,lastOrbitAngle=Math.PI/2-Math.atan2(motor.position.y,-motor.position.z);
  const visited=new Set(),collected=new Set(),sampleStats={frames:0,calls:0,triangles:0};
  const cameraUp=motor.up.clone(),cameraForward=new T.Vector3(0,0,-1);let yaw=0,pitch=.35;
  const fx=createEffects(T,scene),shadow=new T.Mesh(new T.CircleGeometry(.42,32),new T.MeshBasicMaterial({color:0x365e38,transparent:true,opacity:.2,depthWrite:false}));scene.add(shadow);
  let jumpPose=0,landPose=0,dashPose=0,effectClock=0,stepDistance=0,previousFoot=motor.position.clone();
  // Rounded cloud clusters are distant scenery, never reachable destinations.
  const cloudGeometry=new T.SphereGeometry(1,12,8),cloudMaterial=new T.MeshBasicMaterial({color:0xf1ffff});
  for(let i=0;i<12;i++){const cluster=new T.Group(),a=i*Math.PI*2/12;cluster.position.set(Math.cos(a)*58,20+Math.sin(i*2)*13,-18+Math.sin(a)*58);for(let j=0;j<3;j++){const puff=new T.Mesh(cloudGeometry,cloudMaterial);puff.position.set((j-1)*2.2,Math.sin(j*2)*.5,0);puff.scale.set(2.9,1.1+j*.25,1.5);cluster.add(puff);}scene.add(cluster);}
  const labels=[],interactables=[];
  function orient(mesh,position,fieldId){mesh.position.fromArray(position);const field=fields.find(f=>f.id===fieldId),up=mesh.position.clone().sub(new T.Vector3(...field.center)).normalize();mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),up);scene.add(mesh);return mesh;}
  function label(text,position){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#153846ee';ctx.fillRect(0,0,512,96);ctx.fillStyle='#f4e8bb';ctx.font='bold 28px system-ui';ctx.textAlign='center';ctx.fillText(text,256,58);const texture=new T.CanvasTexture(canvas),sprite=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:true}));sprite.position.fromArray(position);sprite.scale.set(3.5,.656,1);scene.add(sprite);labels.push(sprite);return sprite;}
  const terminal=orient(art.makeTerminal(),[0,0,-12],'garden');interactables.push({type:'power',field:'garden',position:terminal.position,mesh:terminal});label('E 供電端子 · 繞到背面',[0,-2,-14]);
  const source=orient(art.makeAnchor(),[0,1.8,-11.87],'garden'),destination=orient(art.makeAnchor(),[0,0,-28],'workshop');
  const route={id:'garden-workshop',from:'garden',to:'workshop',source:[0,0,-12],destination:[0,0,-28],range:4.5,duration:1.1,arcUp:[0,1,0],powered:false,unlocked:true,clear:true,safe:true};
  const reverse={...route,id:'workshop-garden',from:'workshop',to:'garden',source:route.destination,destination:route.source};
  label('錨點 → 工坊星',[0,0,-24]);
  const switcher=orient(art.makeTerminal(),[0,6,-34],'workshop');interactables.push({type:'bridge',field:'workshop',position:switcher.position,mesh:switcher});label('E 接軌端子',[0,8.2,-34]);
  const bridgeParts=[];
  for(let i=0;i<2;i++){const mesh=art.makeBridge({length:2.8,width:2.4}),box={fieldId:'workshop',center:[(i===0?-4:4),6.1,-35.4-i*2.8],half:[1.2,.15,1.4],quaternion:[0,0,0,1]};boxes.push(box);scene.add(mesh);bridgeParts.push({mesh,box,side:i===0?-4:4,z:-35.4-i*2.8});}
  motor.beforeStep=dt=>{bridgeT=T.MathUtils.damp(bridgeT,bridge?1:0,5,dt);for(const part of bridgeParts)motor.movePlatform(part.box,[part.side*(1-bridgeT),6.1,part.z],[0,0,0,1],dt);};
  const exit=orient(art.makeCheckpoint(),[0,5.7,-39.8],'workshop');interactables.push({type:'exit',field:'workshop',position:exit.position,mesh:exit});label('E 修復測試出口',[0,8,-40]);
  const archives=[{id:'test-canopy',p:[3,11.64,0],field:'garden'},{id:'test-back',p:[0,-3,-11.62],field:'garden'},{id:'test-workshop',p:[-2,5.67,-34],field:'workshop'}].map(x=>({...x,mesh:orient(art.makeArchive(),x.p,x.field)}));
  const hazard=new T.Mesh(new T.BoxGeometry(2,.08,2),new T.MeshStandardMaterial({color:0xd07958}));orient(hazard,[5,10.95,0],'garden');label('救援測試區',[6,13,0]);
  // Route lamps are deliberately directional navigation, not reward currency.
  for(let i=1;i<20;i++){const a=i/20*Math.PI/2,pos=[0,Math.cos(a)*12.08,-Math.sin(a)*12.08],m=new T.Mesh(new T.BoxGeometry(.16,.10,.40),new T.MeshStandardMaterial({color:0xf0d391,emissive:0x6b4b12}));orient(m,pos,'garden');}
  const routePoints=Array.from({length:33},(_,i)=>{const t=i/32,e=t*t*(3-2*t);return new T.Vector3().lerpVectors(new T.Vector3(...route.source),new T.Vector3(...route.destination),e).addScaledVector(new T.Vector3(0,1,0),Math.sin(Math.PI*t)*2.1);});
  const curveGeometry=new T.BufferGeometry().setFromPoints(routePoints),curveMaterial=new T.LineDashedMaterial({color:0xffe46b,dashSize:.4,gapSize:.22}),arc=new T.Line(curveGeometry,curveMaterial);arc.computeLineDistances();scene.add(arc);
  const ribbon=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(routePoints),48,.06,6,false),new T.MeshBasicMaterial({color:0x55eafa,transparent:true,opacity:.38,blending:T.AdditiveBlending,depthWrite:false}));scene.add(ribbon);
  let ribbonTransit=null;
  const pulse=new T.Mesh(new T.ConeGeometry(1.1,2.2,16,1,true),new T.MeshBasicMaterial({color:0x99efd6,transparent:true,opacity:.35,side:T.DoubleSide,depthWrite:false}));scene.add(pulse);pulse.visible=false;
  const reducedMotionMedia=matchMedia('(prefers-reduced-motion: reduce)');
  let visualPrefs=save.data.preferences;visualPrefs.reduceMotion ||= reducedMotionMedia.matches;
  const prefs=()=>visualPrefs;
  function emitEffect(position,up,options={}){fx.burst(position,up,{...options,reduced:prefs().reduceMotion});}
  function impact(position,up,color=0xffd761,strength=1){emitEffect(position,up,{count:Math.round(30*strength),color,speed:3*strength,size:.27,life:.65});fx.ring(position,up,color,1.1*strength,.55);}
  const course={motor,input:null,paused:false,finished:false,last:performance.now(),accumulator:0,start(){this.input.setActive(true);el.arena.focus({preventScroll:true});play('game.start');impact(motor.position,motor.up,0xffdb64,.8);raf=requestAnimationFrame(loop);},saveCheckpoint(){const p=motor.checkpoint;save.commit(d=>{d.checkpoint={levelId:'W1-01',levelVersion:1,fieldId:p.fieldId,position:p.position,mechanisms:{m1:true,power,bridge}};});},dispose(){disposed=true;cancelAnimationFrame(raf);this.input.dispose();observer.disconnect();sound?.dispose();el.arena.removeEventListener('webglcontextlost',onLost);el.arena.removeEventListener('webglcontextrestored',onRestored);const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();scene.clear();},stats(){return {revision:T.REVISION,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures};}};
  course.input=new InputRouter(el.arena,{pause,onLook:(x,y)=>{const p=prefs();yaw-=x*.003*p.sensitivity;pitch=Math.max(-.12,Math.min(1.05,pitch+y*.003*p.sensitivity*(p.invertY?-1:1)));},onAction:action=>{if(action==='pulse'&&!course.paused)pulseAction();}});
  function resize(){const {width,height}=el.arena.getBoundingClientRect();if(width>0&&height>0){renderer.setSize(Math.round(width),Math.round(height),false);camera.aspect=width/height;camera.updateProjectionMatrix();}}
  const observer=new ResizeObserver(resize);observer.observe(el.arena);resize();
  function onLost(e){e.preventDefault();pause();$('errorText').textContent='WebGL畫面已中斷，請返回或重新載入。';if(!save.status.persistent)$('errorText').textContent+=save.status.message;modal('errorModal');}
  function onRestored(){$('errorText').textContent='圖形環境已恢復，請重新進入測試場。';}
  el.arena.addEventListener('webglcontextlost',onLost);el.arena.addEventListener('webglcontextrestored',onRestored);
  const cp=save.data.checkpoint;if(cp?.levelId==='W1-01'&&cp.levelVersion===1&&cp.mechanisms.m1&&fields.some(f=>f.id===cp.fieldId)){
    const f=fields.find(f=>f.id===cp.fieldId),p=new T.Vector3(...cp.position);if((cp.fieldId==='garden'?[[0,12,0],[0,0,-12]]:[[0,0,-28]]).some(point=>p.distanceTo(new T.Vector3(...point))<.01)){motor.gravity.commit(cp.fieldId);motor.position.copy(p);motor.previous.copy(p);motor.up.copy(motor.gravity.up(p));motor.setCheckpoint(cp);power=Boolean(cp.mechanisms.power);bridge=Boolean(cp.mechanisms.bridge);bridgeT=bridge?1:0;resumed=true;check=cp.fieldId;cameraUp.copy(motor.up);cameraForward.copy(tangent(cameraForward,cameraUp));}}
  function pulseAction(){if(pulseT>0||course.finished)return;pulseT=.32;emitEffect(motor.position.clone().addScaledVector(motor.up,.7).addScaledVector(motor.forward,.8),motor.up,{count:36,color:0x55f4f0,speed:3.5,direction:motor.forward});fx.ring(motor.position.clone().addScaledVector(motor.up,.7).addScaledVector(motor.forward,1.5),motor.forward,0x72fff1,1,.32);play('magic.cast');let hit=false;for(const target of interactables){if(target.type!=='power'||power)continue;const delta=target.position.clone().sub(motor.position);if(delta.length()<3.5&&delta.normalize().dot(motor.forward)>.5){activatePower();hit=true;}}if(hit)play('magic.hit');}
  function activatePower(){if(power)return;power=true;impact(terminal.position,motor.up,0xffce4c,1.4);play('mechanism.unlock');motor.setCheckpoint({fieldId:'garden',position:[0,0,-12]});check='anchor';course.saveCheckpoint();}
  function act(){
    if(motor.transit)return;
    const candidates=interactables.filter(o=>o.field===motor.gravity.active&&o.position.distanceTo(motor.position)<2.8).sort((a,b)=>a.position.distanceTo(motor.position)-b.position.distanceTo(motor.position));
    const target=candidates[0];if(target?.type==='power'&&!power){activatePower();return;}
    if(target?.type==='bridge'){bridge=!bridge;impact(switcher.position,motor.up,0x6bfff0,1.2);play('board.move');course.saveCheckpoint();return;}
    if(target?.type==='exit'){if(!bridge){hintT=3;el.context.textContent='先在上方接軌端子把橋板接回。';play('feedback.error');return;}finish();return;}
    const r=motor.gravity.active==='garden'?route:reverse;r.powered=power;
    if(motor.beginTransit(r)){impact(motor.position,motor.up,0x7dfcf1,1.1);play('movement.hook');}else{hintT=2;el.context.textContent=power?'靠近分叉菱框錨點，確認目的地弧線後按E。':'先到花園星背面的端子供電。';play('feedback.error');}
  }
  function finish(){if(course.finished)return;impact(exit.position,motor.up,0xffd355,2);emitEffect(exit.position,motor.up,{count:70,color:0xff80c8,speed:4.2,life:1.3,size:.34});course.finished=true;course.paused=true;course.input.setActive(false);course.saveCheckpoint();$('resultText').textContent=`本次 ${time.toFixed(1)} 秒 · 測試檔案 ${collected.size}/3 · 救援 ${motor.falls}次${resumed?' · 檢查點續玩':''}。`;modal('resultModal');}
  function animate(dt){
    for(const marker of labels)marker.visible=marker.position.distanceTo(motor.position)>9;
    for(const part of bridgeParts){part.mesh.position.fromArray(part.box.center);part.mesh.position.y+=.15;part.mesh.quaternion.fromArray(part.box.quaternion);}
    pulseT=Math.max(0,pulseT-dt);hintT=Math.max(0,hintT-dt);
    source.scale.setScalar(power?1:0.65);destination.scale.setScalar(power?1:.65);
    for(const a of archives){if(!prefs().reduceMotion)a.mesh.rotation.y+=dt*.8;const taken=collected.has(a.id);a.mesh.scale.setScalar(taken?.35:1);a.mesh.visible=!taken;if(!taken&&a.field===motor.gravity.active&&motor.position.distanceTo(a.mesh.position)<1.5){collected.add(a.id);impact(a.mesh.position,motor.up,0xffda54,.85);play('reward.collect');}}
    if(motor.gravity.active==='garden'&&motor.position.distanceTo(hazard.position)<1.2)motor.respawn();
    if(motor.gravity.active==='workshop'&&check!=='workshop'&&!motor.transit){check='workshop';motor.setCheckpoint({fieldId:'workshop',position:[0,0,-28]});course.saveCheckpoint();}
    const p=hero.userData.parts;const speed=motor.velocity.clone().addScaledVector(motor.up,-motor.velocity.dot(motor.up)).length();hero.position.copy(motor.position);const right=new T.Vector3().crossVectors(motor.up,motor.forward).normalize(),basis=new T.Matrix4().makeBasis(right,motor.up,motor.forward);hero.quaternion.setFromRotationMatrix(basis);
    jumpPose=Math.max(0,jumpPose-dt*3.7);landPose=Math.max(0,landPose-dt*5);dashPose=Math.max(0,dashPose-dt*5);
    const stride=Math.min(1,speed/6),air=!motor.grounded;
    p.legs.forEach((leg,i)=>leg.rotation.x=air?-.5:Math.sin(time*13+i*Math.PI)*stride*.65);
    if(p.arms)p.arms.forEach((arm,i)=>arm.rotation.x=air?-.8:Math.sin(time*13+i*Math.PI+Math.PI)*stride*.4);
    p.body.scale.set(1+landPose*.15,1-landPose*.18+jumpPose*.08,1+landPose*.1);
    p.body.rotation.x=dashPose*.25;p.tail.rotation.x=air?.35:(prefs().reduceMotion?0:Math.sin(time*5)*.12);p.glove.rotation.x=pulseT>0?-1.2:0;
    if(p.mane){p.mane.rotation.z=prefs().reduceMotion?0:Math.sin(time*7)*.025*stride;p.mane.scale.setScalar(1+Math.sin(time*9)*.018*stride+jumpPose*.06);}
    if(p.cape){p.cape.rotation.x=-.08-stride*.25-(air?.3:0);p.cape.rotation.z=prefs().reduceMotion?0:Math.sin(time*9)*.05*stride;}
    if(p.sparks)for(let i=0;i<p.sparks.length;i++){const spark=p.sparks[i];spark.userData.baseScale??=spark.scale.clone();spark.scale.copy(spark.userData.baseScale).multiplyScalar(prefs().reduceMotion?1:.8+Math.sin(time*4+i)*.16);}
    const activeField=fields.find(f=>f.id===motor.gravity.active),center=new T.Vector3(...activeField.center);shadow.position.copy(motor.grounded?motor.position:center.addScaledVector(motor.up,activeField.radius)).addScaledVector(motor.up,.035);shadow.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),motor.up);shadow.material.opacity=motor.transit?0:.18;shadow.scale.setScalar(motor.grounded?1:.8);
    effectClock+=dt;stepDistance+=previousFoot.distanceTo(motor.position);previousFoot.copy(motor.position);
    if(effectClock>.045){effectClock=0;if(motor.transit||motor.state==='Dashing')emitEffect(motor.position.clone().addScaledVector(motor.up,.6),motor.up,{count:6,color:motor.transit?0xffb65c:0x55eaff,speed:.5,size:.3,life:.4,direction:motor.forward.clone().negate()});}
    if(motor.grounded&&speed>2&&stepDistance>.65){stepDistance=0;emitEffect(motor.position,motor.up,{count:3,color:0xffedb3,speed:.55,size:.13,life:.3});}
    drone.position.copy(motor.position).addScaledVector(motor.up,1.3).addScaledVector(right,-.9);drone.quaternion.copy(hero.quaternion);if(!prefs().reduceMotion&&drone.userData.parts?.rotor)drone.userData.parts.rotor.rotation.y+=dt*4;
    pulse.visible=pulseT>0;pulse.position.copy(motor.position).addScaledVector(motor.up,.65).addScaledVector(motor.forward,1.2);pulse.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),motor.forward);
    if(motor.transit&&ribbonTransit!==motor.transit){ribbonTransit=motor.transit;const tr=motor.transit,points=routePoints.map((point,i)=>{const t=i/32,e=t*t*(3-2*t);return point.copy(tr.from).lerp(tr.to,e).addScaledVector(tr.arcUp,Math.sin(Math.PI*t)*2.1);});curveGeometry.setFromPoints(points);arc.computeLineDistances();ribbon.geometry.dispose();ribbon.geometry=new T.TubeGeometry(new T.CatmullRomCurve3(points),48,.06,6,false);}
    arc.visible=power&&motor.gravity.active==='garden';ribbon.visible=power;
  }
  function cameraUpdate(dt){
    const next=motor.up;cameraForward.copy(transport(cameraForward,cameraUp,next));cameraUp.copy(next);if(yaw){cameraForward.applyAxisAngle(cameraUp,yaw);yaw=0;}
    const target=motor.position.clone().addScaledVector(cameraUp,.9),distance=8.4,desired=target.clone().addScaledVector(cameraForward,-Math.cos(pitch)*distance).addScaledVector(cameraUp,Math.sin(pitch)*distance+1.3);
    // Keep the camera outside solid spherical terrain, without hiding planets.
    for(const f of fields){const center=new T.Vector3(...f.center),d=desired.clone().sub(center),min=f.radius+.45;if(d.length()<min)desired.copy(center).addScaledVector(d.normalize(),min);}
    const rayDirection=desired.clone().sub(target),rayLength=rayDirection.length();rayDirection.normalize();let clearDistance=rayLength;for(const box of boxes){if(box.enabled===false)continue;const rotation=new T.Quaternion(...box.quaternion),inverse=rotation.clone().invert(),localOrigin=target.clone().sub(new T.Vector3(...box.center)).applyQuaternion(inverse),localDirection=rayDirection.clone().applyQuaternion(inverse),half=new T.Vector3(...box.half),hit=new T.Ray(localOrigin,localDirection).intersectBox(new T.Box3(half.clone().negate(),half),new T.Vector3());if(hit){const distance=hit.distanceTo(localOrigin);clearDistance=Math.min(clearDistance,Math.max(.15,distance-.2));}}desired.copy(target).addScaledVector(rayDirection,clearDistance);
    camera.position.copy(desired);camera.up.copy(cameraUp);camera.lookAt(target);
  }
  function updateHUD(){
    $('health').textContent=`生命 ${motor.health}`;$('courseProgress').textContent=`測試檔案 ${collected.size}/3`;
    el.objective.textContent=!power?'沿金色管線繞到花園星背面，找到供電端子。':motor.gravity.active==='garden'?'靠近背面錨點，按E牽引到工坊星。':!bridge?'繞到工坊星頂部，按E把兩塊橋板接回。':'沿修好的橋路前進，在終點按E完成測試。';
    const near=interactables.find(o=>o.field===motor.gravity.active&&o.position.distanceTo(motor.position)<2.8);
    if(hintT<=0)el.context.textContent=motor.transit?'牽引途中 · 目的地已固定':near?`E ${near.type==='power'?(power?'供電完成 · 再按E牽引':'啟動供電'):near.type==='bridge'?(bridge?'切換接軌配置 · Space跳上橋板':'切換接軌配置'):'修復測試出口'}`:'WASD移動 · Space跳 · Shift短衝 · 右鍵拖曳視角 · R回正';
    el.diagnostics.textContent=`${motor.gravity.active} · ${motor.state} · P ${motor.position.toArray().map(n=>n.toFixed(1)).join(', ')} · 上方 ${motor.up.toArray().map(n=>n.toFixed(1)).join(', ')} · 救援 ${motor.falls} · 圈數 ${Math.floor(Math.abs(circuitAngle)/(Math.PI*2))} · FX ${fx.active}/${fx.capacity}`;
    el.arena.dataset.motorState=motor.state;el.arena.dataset.gravityField=motor.gravity.active;
  }
  function loop(now){if(disposed)return;visualPrefs=save.data.preferences;visualPrefs.reduceMotion ||= reducedMotionMedia.matches;const dt=Math.min(.1,Math.max(0,(now-course.last)/1000));course.last=now;
    if(!course.paused){time+=dt;const input=course.input.sample();if(course.input.take('KeyE'))act();if(course.input.take('KeyQ'))pulseAction();if(course.input.take('KeyR')){cameraForward.copy(motor.forward);pitch=.35;}
      if(course.input.take('KeyF')){hintT=3;el.context.textContent=!power?'金色管線沿正前方向延伸到背面。':motor.gravity.active==='garden'?'分叉菱框已供電，靠近端子再按E。':'工坊星頂端有接軌端子，兩塊橋板會向中央合攏。';play('feedback.hint');}
      const forward=tangent(cameraForward,motor.up,motor.forward),right=new T.Vector3().crossVectors(forward,motor.up).normalize();input.direction=forward.multiplyScalar(input.y).addScaledVector(right,input.x);if(input.direction.lengthSq()>1)input.direction.normalize();motor.advance(dt,input);if(motor.gravity.active==='garden'&&!motor.transit){const angle=Math.atan2(-motor.position.z,motor.position.y),change=Math.atan2(Math.sin(angle-lastOrbitAngle),Math.cos(angle-lastOrbitAngle));if(Math.abs(change)<.5)circuitAngle+=change;lastOrbitAngle=angle;}animate(dt);
      for(const event of motor.drainEvents()){if(event.type==='jump'){jumpPose=1;impact(motor.position,motor.up,0xffdf69,.65);}if(event.type==='land'){landPose=1;impact(motor.position,motor.up,0xffe7a2,.85);}if(event.type==='dash'){dashPose=1;impact(motor.position,motor.up,0x72eaff,.8);}if(event.type==='transit-land')impact(motor.position,motor.up,0xffc84f,1.3);if(event.type==='respawn')impact(motor.position,motor.up,0xffa969,1.1);const id={jump:'movement.jump',land:'movement.land',dash:'movement.dash',hurt:'player.hurt',checkpoint:'game.checkpoint',respawn:'player.hurt'}[event.type];if(id)play(id);}
    }
    cameraUpdate(dt);if(!course.paused||course.finished)fx.update(dt,camera,prefs().reduceMotion);renderer.render(scene,camera);if(now-lastUI>100){updateHUD();lastUI=now;}sampleStats.frames++;sampleStats.calls=renderer.info.render.calls;sampleStats.triangles=renderer.info.render.triangles;raf=requestAnimationFrame(loop);
  }
  updateHUD();return course;
}

$('start').addEventListener('click',()=>showScreen('stage'));el.stageBack.addEventListener('click',()=>showScreen('main'));$('stagesTab').addEventListener('click',()=>selector?.refresh(selected));el.battleBack.addEventListener('click',pause);$('pauseButton').addEventListener('click',pause);$('resume').addEventListener('click',resume);$('lockMouse').addEventListener('click',()=>{resume();view?.input.requestLock();});$('returnStage').addEventListener('click',leaveBattle);$('resultStage').addEventListener('click',leaveBattle);$('replay').addEventListener('click',()=>{save.commit(d=>d.checkpoint=null);startBattle();});$('errorBack').addEventListener('click',leaveBattle);$('reload').addEventListener('click',()=>location.reload());
for(const key of ['sensitivity','invertY','reduceMotion','assist']){const input=$(key),p=save.data.preferences;if(key==='sensitivity')input.value=p.sensitivity;else input.checked=key==='assist'?p.mode==='assist':p[key];input.addEventListener('change',()=>save.commit(d=>{if(key==='sensitivity')d.preferences.sensitivity=Number(input.value);else if(key==='assist')d.preferences.mode=input.checked?'assist':'standard';else d.preferences[key]=input.checked;}));}
$('exportSave').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([save.exportJSON()],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='orbit-menders-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('importSave').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>262144)throw Error('存檔超過256KB');save.importJSON(await file.text());$('saveNotice').textContent=save.status.persistent?'匯入成功，下次進入套用檢查點。':save.status.message;}catch(error){$('saveNotice').textContent=`匯入失敗：${error.message}`;}e.target.value='';});
document.addEventListener('keydown',e=>{const dialog=[el.pauseModal,el.resultModal,el.errorModal].find(n=>!n.hidden);if(!dialog)return;if(e.key==='Tab'){const list=[...dialog.querySelectorAll('button:not(:disabled),input,summary')].filter(n=>n.getClientRects().length);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(e.key==='Escape'&&dialog===el.pauseModal){e.preventDefault();resume();}});
window.addEventListener('weightplay:interaction-state',()=>{if(view&&!view.paused&&document.querySelector('.wp-frame-popover:not([hidden]),.wp-shell-settings-popover:not([hidden])'))pause();});
window.addEventListener('pagehide',()=>{generation++;view?.saveCheckpoint();view?.dispose();selector?.dispose?.();});
showScreen('main');if(mobile){$('deviceNotice').textContent='本作需使用電腦鍵鼠；目前裝置只提供遊戲介紹。';$('start').textContent='請使用電腦開啟';}else $('start').disabled=false;
window.WeightPlayGameEntryLoader?.ready();

function createEffects(T,scene){
  const capacity=224,canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'#ffffff');gradient.addColorStop(.12,'#ffffffe8');gradient.addColorStop(.4,'#ffffff60');gradient.addColorStop(1,'#ffffff00');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  const texture=new T.CanvasTexture(canvas),material=new T.MeshBasicMaterial({map:texture,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),mesh=new T.InstancedMesh(new T.PlaneGeometry(1,1),material,capacity);mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(mesh);
  const particles=Array.from({length:capacity},()=>({position:new T.Vector3(),velocity:new T.Vector3(),up:new T.Vector3(),age:1,life:0,size:0,color:new T.Color()})),pose=new T.Object3D();let cursor=0,active=0;
  const ringGeometry=new T.TorusGeometry(1,.025,6,48),rings=Array.from({length:8},()=>{const ring=new T.Mesh(ringGeometry,new T.MeshBasicMaterial({color:0xffdf68,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));ring.visible=false;scene.add(ring);return {mesh:ring,age:1,life:0,radius:1};});let ringCursor=0;
  function burst(position,up,{count=24,color=0xffcc49,speed=2.8,size=.24,life=.6,direction=null,reduced=false}={}){
    const total=reduced?Math.min(6,count):Math.min(80,count),right=new T.Vector3().crossVectors(up,Math.abs(up.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0)).normalize(),forward=new T.Vector3().crossVectors(right,up).normalize();
    for(let i=0;i<total;i++){const p=particles[cursor++%capacity],angle=i*2.3999632297,radius=.2+(i%7)/7;p.position.copy(position);p.up.copy(up);p.velocity.copy(right).multiplyScalar(Math.cos(angle)*radius).addScaledVector(forward,Math.sin(angle)*radius).addScaledVector(up,.3+(i%5)*.14).multiplyScalar(reduced?.3:speed);if(direction)p.velocity.addScaledVector(direction,speed*.9);p.age=0;p.life=life*(.7+(i%9)*.055);p.size=size*(.65+(i%5)*.16);p.color.set(color);if(i%5===0)p.color.set(0xffffff);}
  }
  function ring(position,up,color=0xffd652,radius=1,life=.5){const item=rings[ringCursor++%rings.length];item.mesh.position.copy(position).addScaledVector(up,.06);item.mesh.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),up);item.mesh.material.color.set(color);item.mesh.visible=true;item.age=0;item.life=life;item.radius=radius;}
  return {burst,ring,update(dt,camera,reduced=false){active=0;for(let i=0;i<capacity;i++){const p=particles[i];if(p.age>=p.life){pose.position.set(0,0,0);pose.scale.setScalar(0);}else{p.age+=dt;p.position.addScaledVector(p.velocity,dt);p.velocity.addScaledVector(p.up,-dt*.65);const t=Math.min(1,p.age/p.life);pose.position.copy(p.position);pose.quaternion.copy(camera.quaternion);pose.rotateZ(p.age*2+i);pose.scale.setScalar(p.size*(1-t)*(reduced?.7:1));mesh.setColorAt(i,p.color);active++;}pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);}mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;for(const item of rings){if(item.age>=item.life){item.mesh.visible=false;continue;}item.age+=dt;const t=Math.min(1,item.age/item.life);item.mesh.scale.setScalar(item.radius*(reduced?.7:.3+t));item.mesh.material.opacity=(1-t)*.65*(reduced?.5:1);}return active;},get active(){return active;},capacity};
}
