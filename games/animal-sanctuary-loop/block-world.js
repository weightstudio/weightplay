/* Sanctuary v22: authored cuboid world + projected presentation; simulation is read-only.
   The optional Three driver and Canvas fallback share the same world geometry/camera. */
(function(root){
'use strict';
const N=48, VIEW=56, C=Math.cos(Math.PI/6), S=.5;
const THEMES=[['#193d38','#286156','#69d7ad'],['#173747','#27556a','#85deeb'],['#272e4a','#43466a','#bdadff'],['#3a3033','#64504a','#ffc194'],['#282c44','#454068','#d8c1ff'],['#1d3c42','#34545a','#ffdf87']];
const script=typeof document!=='undefined'?document.currentScript?.src:'';
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;};
const tint=(hex,f)=>{const n=parseInt(hex.slice(1),16);return '#'+[n>>16,n>>8&255,n&255].map(v=>Math.min(255,Math.round(v*f)).toString(16).padStart(2,'0')).join('');};
function project(x,z,y,w){const u=w/VIEW;return {x:w/2+(x-24)*u,y:w/2+(z-24)*C*u-y*S*u};}
function unproject(x,y,w){return {x:24+(x-w/2)*VIEW/w,y:24+(y-w/2)*VIEW/w/C};}
// One uniform world scale, shared by GPU, Canvas, picking and the tactical map.
function cameraFor(w,h,player,overview=false){
 const u=overview?Math.min(w/56,h/50):Math.min(Math.max(w/48,h/(48*C)),w/28,h/(28*C));
 const clamp=(v,half)=>half>=25?24:Math.max(half-1,Math.min(49-half,v));
 return {w,h,u,x:overview?24:clamp(player.x,w/u/2),z:overview?24:clamp(player.y,h/u/C/2)};
}
function cameraProject(x,z,y,c){return {x:c.w/2+(x-c.x)*c.u,y:c.h/2+(z-c.z)*C*c.u-y*S*c.u};}
function cameraUnproject(x,y,c){return {x:c.x+(x-c.w/2)/c.u,y:c.z+(y-c.h/2)/c.u/C};}
function cube(x,y,z,w,h,d,color,ry=0){return {x,y,z,w,h,d,color,ry};}
function world(chapter){
 const t=THEMES[chapter%6],b=[];
 const add=(...v)=>b.push(cube(...v));
 // Floating stone foundation, layered soil rim, inset play surface and corner buttresses.
 add(24,-2.0,24,53,2.8,53,'#12292e');add(24,-.55,24,51.5,.4,51.5,'#3a6962');
 for(let z=0;z<N;z++)for(let x=0;x<N;x++){
  const patch=Math.sin(x*.33+Math.cos(z*.24))*Math.cos(z*.29-x*.12);
  const seam=(x%6===0||z%6===0)?-.12:0;
  add(x+.5,-.18,z+.5,.99,.32,.99,tint(t[0],.84+patch*.20+((x*13+z*7)%7)*.018+seam));
  // Inlaid stone and tiny mineral facets stay below feet, never imply blockers.
  if((x*19+z*31)%29===0){add(x+.55,.005,z+.46,.55,.04,.18,tint(t[1],.8));add(x+.23,.012,z+.7,.17,.055,.26,tint(t[1],.64));}
 }
 for(let k=-1;k<=48;k++){
  add(k+.5,-.06,-.65,.96,.65,1.1,'#467367');add(k+.5,-.06,48.65,.96,.65,1.1,'#284c49');
  add(-.65,-.06,k+.5,1.1,.65,.96,'#3b685e');add(48.65,-.06,k+.5,1.1,.65,.96,'#284b48');
 }
 // Authored tiered trees: branch/crown silhouettes differ without entering legal cells.
 function tree(x,z,h,variant){
  add(x,h*.30,z,.6,h*.6,.6,'#6a5140');add(x-.32,.28,z,.5,.55,.65,'#4d3b30');
  for(let j=0;j<3;j++){const d=(2.5-j*.6)*(variant?1:.85);add(x+(j===1?.16:0),h*.48+j*.75,z,d,.94,d,tint(t[1],.84+j*.18),j%2?Math.PI/8:0);}
  add(x+.45,h*.48+.56,z-.3,.75,.22,.75,t[2]);
 }
 for(const [x,z,h,v]of [[-2,3,3.5,1],[-2,11,4.5,0],[-2,21,3.8,1],[-2,33,4.1,0],[-2,44,3.2,1],[50,5,4.1,0],[50,16,3.3,1],[50,28,4.4,0],[50,39,3.4,1],[8,-2,4.5,0],[18,-2,3.4,1],[34,-2,4.2,0],[44,-2,3.4,1]])tree(x,z,h,v);
 // Two sanctuary gate pylons and a stepped crossbar, outside the board.
 for(const x of [24-3,24+3]){add(x,.3,-1.8,1.4,1.3,1.5,'#375d60');add(x,2,-1.8,.85,2.3,.85,'#6b9590');add(x,3.15,-1.8,1.4,.45,1.5,'#94beb0');add(x,2.2,-1.22,.24,1.4,.09,t[2]);}
 add(24,3.6,-1.8,7.8,.7,1.4,'#507c77');add(24,4.08,-1.8,4,.28,1.1,'#96b9a3');
 // Foot lamps and angular crystal clusters; no object suggests a hidden playable cell.
 for(const [x,z]of [[-1.3,7],[-1.3,27],[49.3,12],[49.3,34],[6,49.3],[41,49.3]]){
  add(x,.25,z,.9,.7,.9,'#76664b');add(x,.9,z,.44,.65,.44,'#f4cb6b');add(x,1.31,z,.76,.18,.76,'#385750');
 }
 for(const [x,z]of [[3,50],[14,50],[34,50],[50,47],[-2,40]]){add(x,.3,z,1.7,.9,1.6,t[1]);add(x+.2,1,z,.65,1,.65,t[2],Math.PI/4);add(x-.6,.7,z+.3,.48,.6,.48,tint(t[2],.75),Math.PI/4);}
 return b;
}
function maskCubes(run){
 const b=[];
 for(let i=0;i<N*N;i++){
  const x=i%N+.5,z=Math.floor(i/N)+.5;
  if(run.blocked[i]){b.push(cube(x,.37,z,.97,.98,.97,'#454560'));if(i%3===0)b.push(cube(x,.99,z,.62,.24,.62,'#a294c7'));}
  else if(run.owned[i]){
   b.push(cube(x,.055,z,.99,.38,.99,tint('#389875',.90+Math.sin(x*.7+z*.4)*.12)));
   if(i%13===0){b.push(cube(x-.18,.28,z,.08,.24,.22,'#8bd69c'),cube(x+.10,.31,z+.11,.08,.30,.12,'#b3e5a2'));}
   if(i%47===0)b.push(cube(x,.31,z,.16,.15,.16,'#ffe9a1'));
  }
 }
 return b;
}
// Geometric fallback rasterizes the very same cuboids, not the former illustration.
function drawCubes(ctx,boxes,w){
 const faces=[];
 for(const b of boxes){
  const {x,y,z,w:bw,h,d,ry}=b,cs=Math.cos(ry),sn=Math.sin(ry);
  const p=[];for(const yy of [-1,1])for(const zz of [-1,1])for(const xx of [-1,1]){const dx=xx*bw/2,dz=zz*d/2;p.push({x:x+dx*cs+dz*sn,y:y+yy*h/2,z:z+dz*cs-dx*sn});}
  for(const [ids,f]of [[[4,5,7,6],1.15],[[2,3,7,6],.70],[[1,3,7,5],.84],[[0,4,6,2],.62]]){
   const pts=ids.map(i=>p[i]);faces.push({pts:pts.map(p=>project(p.x,p.z,p.y,w)),depth:pts.reduce((v,p)=>v+p.z*S+p.y*C,0)/4,fill:tint(b.color,f)});
  }
 }
 faces.sort((a,b)=>a.depth-b.depth);
 for(const f of faces){ctx.fillStyle=f.fill;ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();}
}
function create(canvas){
 const ctx=canvas.getContext('2d'),d=canvas.ownerDocument;
 const cache=d.createElement('canvas');cache.width=cache.height=1024;
 const mapCache=d.createElement('canvas');mapCache.width=mapCache.height=N;
 let camera=cameraFor(canvas.width,canvas.height,{x:24,y:24}),overview=false;
 const project=(x,z,y)=>cameraProject(x,z,y,camera);
 let driver=null,pending=null,generation=0,disposed=false,dirty=true,lastRun=null,boxes=[],terrain=[];
 let gpuFailed=false,frames=0,builds=0,lastKind='BLOCK_CANVAS',border=[];
 function invalidate(){dirty=true;}
 function release(){
  generation++;driver?.dispose();driver=null;lastRun=null;dirty=true;pending=null;
  overview=false;d.getElementById('mapToggle')?.setAttribute('aria-pressed','false');canvas.dataset.renderer='block-canvas';
 }
 function startGPU(){
  if(driver||pending||gpuFailed||!root.WebGL2RenderingContext||!script)return;
  const token=++generation;
  pending=import(new URL('block-three.mjs?v=20261011-mobile',script).href).then(m=>{
   if(token!==generation||disposed)return;
   const gpu=m.createDriver(canvas,()=>{gpuFailed=true;release();});
   if(token!==generation||disposed){gpu.dispose();return;}
   driver=gpu;dirty=true;
  }).catch(()=>{if(token===generation)gpuFailed=true;}).finally(()=>{if(token===generation)pending=null;});
 }
 function floorQuad(x,z,s,y,color,alpha=1){
  const pts=[[x,z],[x+s,z],[x+s,z+s],[x,z+s]].map(([a,b])=>project(a,b,y,canvas.width));
  ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.globalAlpha=1;
 }
 function ring(x,z,r,y,color,progress=1){
  const corners=[[-r,-r],[r,-r],[r,r],[-r,r],[-r,-r]];
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();const p=project(x-r,z-r,y,canvas.width);ctx.moveTo(p.x,p.y);
  let left=progress*4;for(let i=0;i<4&&left>0;i++,left--){const a=corners[i],b=corners[i+1],f=Math.min(1,left);const q=project(x+a[0]+(b[0]-a[0])*f,z+a[1]+(b[1]-a[1])*f,y,canvas.width);ctx.lineTo(q.x,q.y);}ctx.stroke();
 }
 function actor(image,x,z,scale,angle,color,now,reduced,isPlayer=false,hitAt=-10,moving=false){
  const foot=project(x,z,.4),u=camera.u;
  // Explicit small footprint follows collision location; oversized art is decorative.
  floorQuad(x-.52,z-.52,1.04,.26,'#03191f',.75);ring(x,z,.73,.3,color);
  const a=angle-Math.PI/2,tip=project(x+Math.cos(a)*1.35,z+Math.sin(a)*1.35,.35,canvas.width);
  ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(Math.atan2(Math.sin(a)*C,Math.cos(a)));ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(u*.32,0);ctx.lineTo(-u*.20,-u*.22);ctx.lineTo(-u*.20,u*.22);ctx.closePath();ctx.fill();ctx.restore();
  if(!image?.complete||!image.naturalWidth)return;
  const hit=Math.max(0,1-(now-hitAt)/.32);
  const sw=scale*u,ratio=image.naturalWidth/image.naturalHeight,bob=reduced?0:Math.sin(now*(moving?14:4)+x)*u*(moving?.22:.07);
  const iw=ratio>=1?sw:sw*ratio,ih=ratio>=1?sw/ratio:sw;
  ctx.save();ctx.translate(foot.x+(reduced?0:Math.sin(hit*12)*hit*u*.65),foot.y+bob);if(!reduced&&hit)ctx.scale(1+hit*.16,1-hit*.12);if(Math.cos(a)<-.1)ctx.scale(-1,1);
  ctx.shadowColor='#001117';ctx.shadowBlur=3;ctx.drawImage(image,-iw/2,-ih*.88,iw,ih);ctx.restore();
  if(isPlayer){ctx.fillStyle='#fff6ac';ctx.fillRect(foot.x-u*.23,foot.y-ih*.92-u*.5,u*.46,u*.32);}
 }
 function draw(run,images,colors,reduced){
  if(disposed||!run)return;
  const board=canvas.parentElement,cssW=board.clientWidth,cssH=board.clientHeight;
  if(cssW>0&&cssH>0){const density=Math.min(root.devicePixelRatio||1,2,1440/cssH,1024/cssW);const rw=Math.round(cssW*density),rh=Math.round(cssH*density);if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh;}}
  camera=cameraFor(canvas.width,canvas.height,run.player,overview);
  frames++;startGPU();const w=canvas.width,h=canvas.height,u=camera.u;
  if(lastRun!==run){lastRun=run;terrain=world(run.stage.chapter);dirty=true;}
  if(dirty){boxes=maskCubes(run);builds++;if(driver)driver.sync(terrain,boxes);else{const c=cache.getContext('2d');c.clearRect(0,0,1024,1024);drawCubes(c,terrain.slice(0,2),1024);drawCubes(c,[...terrain.slice(2),...boxes],1024);}
   border=[];const mc=mapCache.getContext('2d');for(let i=0;i<N*N;i++){mc.fillStyle=run.blocked[i]?'#a294c7':run.owned[i]?'#53d8ab':'#193c43';mc.fillRect(i%N,Math.floor(i/N),1,1);
    if(run.owned[i]){const x=i%N,z=Math.floor(i/N);if(!z||!run.owned[i-N])border.push([x,z,x+1,z]);if(z===N-1||!run.owned[i+N])border.push([x,z+1,x+1,z+1]);if(!x||!run.owned[i-1])border.push([x,z,x,z+1]);if(x===N-1||!run.owned[i+1])border.push([x+1,z,x+1,z+1]);}}
   dirty=false;}
  ctx.clearRect(0,0,w,h);
  if(driver){driver.camera(camera);lastKind='HYBRID_3D';}else{ctx.fillStyle='#071e2b';ctx.fillRect(0,0,w,h);const scale=u/(1024/VIEW);ctx.save();ctx.setTransform(scale,0,0,scale,w/2-(512+(camera.x-24)*1024/VIEW)*scale,h/2-(512+(camera.z-24)*C*1024/VIEW)*scale);ctx.drawImage(cache,0,0);ctx.restore();lastKind='BLOCK_CANVAS';}
  canvas.dataset.renderer=lastKind==='HYBRID_3D'?'hybrid-3d':'block-canvas';
  // Restored edges read instantly at thumb distance; persistent color survives
  // reduced motion and effects expiry. Decorative life is capped at 28 motes.
  ctx.save();ctx.strokeStyle='#93ebbf';ctx.lineWidth=Math.max(1,u*.10);ctx.shadowColor='#73efc2';ctx.shadowBlur=u*.45;ctx.beginPath();
  for(const [x,z,a,b]of border){const p=project(x,z,.28),q=project(a,b,.28);ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);}ctx.stroke();ctx.restore();
  if(!reduced)for(let k=0;k<28;k++){const x=(k*13.7+Math.sin(run.elapsed*.25+k)*.4)%48,z=(k*7.9+run.elapsed*.14)%48,p=project(x,z,.6+Math.sin(run.elapsed*.7+k)*.5);ctx.globalAlpha=.13+.13*(1+Math.sin(run.elapsed*1.5+k));ctx.fillStyle=run.owned[Math.floor(z)*48+Math.floor(x)]?'#d9f9b7':'#80b5ad';ctx.fillRect(p.x,p.y,Math.max(1,u*.10),Math.max(1,u*.10));}ctx.globalAlpha=1;
  // Ground-level route cues communicate exposure and actual pursuit targets.
  if(run.trail.size){
   ring(run.anchor.x,run.anchor.y,1.7,.55,'#abffe1');
   const p=project(run.player.x,run.player.y,.5,w),home=project(run.anchor.x,run.anchor.y,.5,w);
   ctx.save();ctx.strokeStyle='#9cffe0';ctx.globalAlpha=.45;ctx.lineWidth=1.5;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(home.x,home.y);ctx.stroke();ctx.restore();
   for(const h of run.hunters){if(!h.trailTarget||run.elapsed<(h.stunnedUntil||0))continue;
    const distance=Math.hypot(h.x-h.trailTarget.x,h.y-h.trailTarget.y);if(distance>10)continue;
    const a=project(h.x,h.y,.6,w),b=project(h.trailTarget.x,h.trailTarget.y,.6,w);
    ctx.save();ctx.strokeStyle=distance<5?'#ff8799':'#ffc878';ctx.globalAlpha=.7;ctx.lineWidth=distance<5?2.5:1.5;ctx.setLineDash([u*.45,u*.35]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();ring(h.trailTarget.x+.5,h.trailTarget.y+.5,.6,.6,'#ff9b9b');
   }
  }
  // Exposed trail uses articulated luminous tiles; never a rounded neon tube.
  let j=0;for(const i of run.trail){const x=i%N,z=Math.floor(i/N);floorQuad(x+.10,z+.10,.80,.36,colors[0]);if(!reduced&&(j++ +Math.floor(run.elapsed*10))%4===0)floorQuad(x+.29,z+.29,.42,.4,'#fffbe0');}
  if(run.stage.storm){const p=run.stormClock/(run.stage.stormEvery||3.4);for(let k=0;k<16;k++){const x=(k*7+(reduced?0:run.elapsed*8))%N,z=(k*11)%N;floorQuad(x,z,.7,.5,p>.78?'#b4f1ff':'#66c9e1',p>.78?.38:.14);}ring(24,24,23.85,.5,p>.78?'#b4f1ff':'#497d9d');}
  if(run.elapsed-run.rivalMarkedAt<1)for(const i of run.rivalMarks)floorQuad(i%N,Math.floor(i/N),1,.55,'#f07aab',.65*(1-run.elapsed+run.rivalMarkedAt));
  const seals=run.markers.filter(m=>m.type==='seal'),next=seals.find(m=>!m.done);
  const objects=[];
  for(const m of run.markers){if(m.done)continue;const active=m.type!=='seal'||m===next,color=active?(m.type==='seal'?'#ffd977':'#89efd2'):'#6d7789';
   const bob=reduced?0:Math.sin(run.elapsed*3+m.x)*.12;
   objects.push(cube(m.x,.22,m.y,2.15,.55,2.15,'#426e6c'),cube(m.x,.60,m.y,1.55,.25,1.55,color));
   if(m.type==='seal'){objects.push(cube(m.x,1.4+bob,m.y,.9,.9,.9,color,Math.PI/4));}
   else {objects.push(cube(m.x,1.35,m.y,.4,1.35,.4,'#89c7b1'),cube(m.x,2.14+bob,m.y,1.10,.85,1.10,color,Math.PI/4),cube(m.x,2.76+bob,m.y,.55,.25,.55,'#edfff1'));}
   if(active)ring(m.x,m.y,1.5,.4,color);
  }
  // Objectives use actual cube geometry in both the GPU and software paths.
  if(driver)driver.dynamic(objects);else {const scale=u/(1024/VIEW);ctx.save();ctx.setTransform(scale,0,0,scale,w/2-(512+(camera.x-24)*1024/VIEW)*scale,h/2-(512+(camera.z-24)*C*1024/VIEW)*scale);drawCubes(ctx,objects,1024);ctx.restore();}
  if(driver)driver.render();
  for(const m of seals){if(m.done)continue;const p=project(m.x,m.y,2.5,w);ctx.fillStyle='#fff6cb';ctx.strokeStyle='#14252d';ctx.lineWidth=3;ctx.font=`800 ${Math.max(13,u*1.6)}px system-ui`;ctx.textAlign='center';const n=String(seals.indexOf(m)+1);ctx.strokeText(n,p.x,p.y);ctx.fillText(n,p.x,p.y);}
  // The shared motion emitter still owns lifetime/caps; render square sparks, not round rings.
  run.visual.effects=run.visual.effects.filter(e=>run.elapsed-e.born<e.life);
  if(reduced)run.visual.effects.length=0;
  for(const e of run.visual.effects){const age=Math.max(0,(run.elapsed-e.born)/e.life),a=1-age,ease=1-a*a*a,col=e.kind==='hurt'||e.kind==='blocked'?'#ff8799':e.kind==='marker'?'#ffe29a':e.kind==='stun'||e.kind==='pulse'?'#c1c0ff':'#9affda';
   for(const i of e.cells){const x=i%N,z=Math.floor(i/N),delay=Math.min(.4,Math.hypot(x-e.x,z-e.y)*.018),wave=Math.max(0,1-Math.abs(age-delay-.2)*4);floorQuad(x+.04,z+.04,.92,.4+wave*.4,col,a*(.15+wave*.6));}
   ctx.globalAlpha=a;ctx.lineWidth=e.kind==='pulse'?3:2;ring(e.x,e.y,.8+ease*(e.radius||4),.6,col);ctx.globalAlpha=1;
   for(let k=0;k<8;k++){const th=k*Math.PI/4,r=1+ease*(2+k%3);floorQuad(e.x+Math.cos(th)*r,e.y+Math.sin(th)*r,.22+a*.25,.8+Math.sin(age*Math.PI)*1.5,col,a);}
   if(e.amount){const p=project(e.x,e.y,3+ease*2,w);ctx.globalAlpha=a;ctx.fillStyle=col;ctx.strokeStyle='#09252e';ctx.lineWidth=3;ctx.font=`800 ${Math.max(18,u*1.7)}px system-ui`;ctx.textAlign='center';ctx.strokeText(e.amount,p.x,p.y);ctx.fillText(e.amount,p.x,p.y);ctx.globalAlpha=1;}
  }
  const cast=run.hunters.map(h=>({...h,player:false})).concat([{...run.player,imageKey:'player',size:4.4,player:true}]);cast.sort((a,b)=>a.y-b.y);
  for(const h of cast){const col=h.player?'#8fffd5':h.guardian?'#ff87a7':h.type==='runner'?'#7ce9ff':'#d6b2ff';
   if(h.player){const p=project(h.x,h.y,.1),light=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,u*3);if(light){light.addColorStop(0,run.trail.size?'#ffe7a033':'#83ffba2b');light.addColorStop(1,'#83ffba00');ctx.fillStyle=light;ctx.fillRect(p.x-u*3,p.y-u*3,u*6,u*6);}}
   if(!h.player&&h.type==='runner'&&run.trail.size){const phase=h.abilityClock%3.4;if(phase>=2.65)ring(h.x,h.y,h.size*.5,.7,'#ffe08b',(phase-2.65)/.75);if(h.burst)ring(h.x,h.y,h.size*.56,.7,'#85efff');}
   const stunned=run.elapsed<(h.stunnedUntil||0);
   if(stunned){ring(h.x,h.y,h.size*.57,.5,'#d1c5ff');const p=project(h.x,h.y,4,w);ctx.fillStyle='#e1d7ff';for(let k=-1;k<=1;k++)ctx.fillRect(p.x+k*u*.65-u*.14,p.y+(reduced?0:Math.sin(run.elapsed*8+k)*u*.12),u*.28,u*.28);}
   actor(images[h.imageKey],h.x,h.y,h.player?4.2:h.guardian?6:h.size,h.visualAngle??h.angle+Math.PI/2,col,run.elapsed,reduced,h.player,h.player?(h.hurtAt??-10):(h.hitAt??-10),h.player?!!(h.dx||h.dy):!stunned);
  }
  // In-world combo countdown has fixed geometry and never intercepts controls.
  if(run.chain){const p=project(run.player.x,run.player.y,7,w);ctx.save();ctx.font=`900 ${Math.max(15,u*1.4)}px system-ui`;ctx.textAlign='center';ctx.strokeStyle='#082332';ctx.lineWidth=4;ctx.fillStyle='#ffe49a';ctx.strokeText(`×${run.chain}`,p.x,p.y);ctx.fillText(`×${run.chain}`,p.x,p.y);ctx.globalAlpha=.8;ring(run.player.x,run.player.y,1.8,.4,'#ffe49a',Math.max(0,(run.chainUntil-run.elapsed)/12));ctx.restore();}
  if(run.danger){const shade=ctx.createLinearGradient(0,0,w,0);if(shade){shade.addColorStop(0,'#ff527344');shade.addColorStop(.14,'#ff527300');shade.addColorStop(.86,'#ff527300');shade.addColorStop(1,'#ff527344');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);}}
  // All opponents and objectives remain visible even outside the close camera.
  const map=d.getElementById('tacticalMap');if(map){const m=map.getContext('2d'),s=map.width/N;m.imageSmoothingEnabled=false;m.clearRect(0,0,map.width,map.height);m.drawImage(mapCache,0,0,map.width,map.height);
   m.fillStyle='#fff1a4';for(const i of run.trail)m.fillRect(i%N*s,Math.floor(i/N)*s,s,s);
   for(const marker of run.markers){if(marker.done)continue;m.fillStyle=marker.type==='seal'?'#ffe38b':'#b8fff4';m.fillRect(marker.x*s-3,marker.y*s-3,6,6);}
   for(const hunter of run.hunters){m.fillStyle=run.elapsed<(hunter.stunnedUntil||0)?'#c5c0ff':'#ff758e';m.fillRect(hunter.x*s-4,hunter.y*s-4,8,8);}
   m.strokeStyle='#efffffb3';m.lineWidth=2;m.strokeRect((camera.x-w/u/2)*s,(camera.z-h/u/C/2)*s,w/u*s,h/u/C*s);
   m.fillStyle='#fff';m.strokeStyle='#113f3f';m.lineWidth=2;m.beginPath();m.arc(run.player.x*s,run.player.y*s,5,0,Math.PI*2);m.fill();m.stroke();
  }
  // Offscreen arrows are truthful bearings, with a distinct warning for hunters.
  for(const target of [...run.hunters.map(v=>({...v,color:'#ff91aa'})),...run.markers.filter(v=>!v.done).map(v=>({...v,color:'#ffe395'}))]){
   const p=project(target.x,target.y,0);if(p.x>16&&p.x<w-16&&p.y>16&&p.y<h-16)continue;
   const dx=p.x-w/2,dy=p.y-h/2,k=Math.min((w/2-14)/Math.max(1,Math.abs(dx)),(h/2-14)/Math.max(1,Math.abs(dy))),x=w/2+dx*k,y=h/2+dy*k;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));ctx.fillStyle=target.color;ctx.strokeStyle='#072531';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
  }
 }
 function point(event){const r=canvas.getBoundingClientRect();return cameraUnproject((event.clientX-r.left)/r.width*canvas.width,(event.clientY-r.top)/r.height*canvas.height,camera);}
 function stats(){return {kind:lastKind,frames,builds,camera:{...camera,overview},cuboids:terrain.length+boxes.length,driver:driver?.stats()||null,pending:!!pending,projectionError:driver?Math.max(...[[0,0],[24,24],[48,48],[0,48],[48,0]].map(([x,z])=>{const a=project(x,z,0),b=driver.project(x,z);return Math.hypot(a.x-b.x,a.y-b.y);})):0};}
 return {draw,point,project:(x,z,y=0)=>project(x,z,y),toggleOverview(){overview=!overview;return overview;},invalidate,release,stats,dispose(){disposed=true;release();cache.width=cache.height=mapCache.width=mapCache.height=1;}};
}
const api={create,project,unproject,cameraFor,cameraProject,cameraUnproject,world,maskCubes,VIEW,C,S};root.SanctuaryBlockWorld=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
