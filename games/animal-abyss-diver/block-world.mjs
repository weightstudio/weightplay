/* One optional presentation renderer. All rules and hit targets remain in game.js.
   Exact matching block-art WebPs remain visible until a successful 3D frame, and
   on unavailable WebGL/context loss. No CDN, input interception, or new save. */
let api=null,pending=null,epoch=0,disposed=false,raf=0,last=0,time=0,frames=0;
const $=id=>document.getElementById(id),media=matchMedia('(prefers-reduced-motion: reduce)');
let cue=null,phase='none',unavailable=false;
const active=()=>!disposed&&document.body.dataset.screen==='battle'&&$('result')?.classList.contains('hidden');
const paused=()=>document.hidden||document.body.dataset.abyssPaused==='true'||media.matches;
function cancelLoop(){cancelAnimationFrame(raf);raf=0;last=0;}
function draw(now=performance.now()){
 raf=0;if(!api||!active()||api.lost)return;
 const dt=last?Math.min(.04,Math.max(0,(now-last)/1000)):0;last=now;if(!paused())time+=dt;
 api.render(time,cue);frames++;
 if(!paused())raf=requestAnimationFrame(draw);
}
function stop(){
 epoch++;cancelLoop();pending=null;cue=null;phase='none';unavailable=false;
 if(api){api.dispose();api=null;}
 $('diveField')?.removeAttribute('data-block-renderer');$('fishSprite')?.removeAttribute('data-block-renderer');
}
async function update(){
 if(!active()){stop();return;}
 if(!api&&!pending&&!unavailable){
  const token=epoch;pending=import('./block-models.mjs');
  try{const models=await pending;if(token!==epoch||!active())return;api=create(models);}
  catch{if(token===epoch){unavailable=true;$('diveField').dataset.blockRenderer='raster';}}
  finally{if(token===epoch)pending=null;}
 }
 if(!api)return;
 const fishActive=!$('fishEncounter').classList.contains('hidden'),kind=$('fishEncounter').dataset.blockEnemy||'reef';
 const next=fishActive?'fish:'+kind:'world';if(next!==phase){phase=next;api.mount(fishActive,kind);cue=null;}
 cancelLoop();draw();
}
function create({THREE,library,world,fish,sceneSetup,fitObject}){
 const canvas=document.createElement('canvas');canvas.id='abyssBlockCanvas';canvas.setAttribute('aria-hidden','true');canvas.style.pointerEvents='none';
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
 const lib=library(),reef=sceneSetup(0x073148),reefGroup=world(lib);reef.add(reefGroup);
 const camera=new THREE.PerspectiveCamera(48,1,.1,60);camera.position.set(0,3.8,11);camera.lookAt(0,-.5,-3);
 const fishScene=sceneSetup(),fishCamera=new THREE.OrthographicCamera(),fishModels={reef:fish(lib),shark:fish(lib,true)};
 for(const f of Object.values(fishModels))fishScene.add(f);
 let target=$('diveField'),combat=false,kind='reef',w=0,h=0,closed=false;
 const view={lost:false};
 function resize(){const rect=target.getBoundingClientRect();if(!rect.width||!rect.height)return false;const nw=Math.max(1,Math.round(rect.width)),nh=Math.max(1,Math.round(rect.height));if(nw!==w||nh!==h){w=nw;h=nh;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();fitObject(fishCamera,fishModels[kind],w/h,1.25);}return true;}
 const observer=new ResizeObserver(()=>{if(!closed){cancelLoop();draw();}});observer.observe(target);
 function mount(isFish,newKind){
  observer.disconnect();target.removeAttribute('data-block-renderer');combat=isFish;kind=newKind==='shark'?'shark':'reef';
  target=combat?$('fishSprite'):$('diveField');target.append(canvas);target.dataset.blockRenderer='loading';
  for(const [key,f]of Object.entries(fishModels))f.visible=key===kind;
  w=h=0;observer.observe(target);
 }
 function render(t,action){
  if(closed||view.lost||!resize())return;
  const f=fishModels[kind];
  f.userData.tail.rotation.y=media.matches?0:Math.sin(t*3.8)*.22;
  f.rotation.y=media.matches?-.08:Math.sin(t*.75)*.07-.08;
  f.position.y=media.matches?0:Math.sin(t*1.7)*.045;
  f.position.x=0;f.rotation.z=0;
  if(action&&!media.matches){
   const p=Math.min(1,Math.max(0,(t-action.time)/.48)),k=Math.sin(p*Math.PI);
   if(action.name==='strike'){f.position.x=k*.16;f.rotation.z=-k*.09;}
   if(action.name==='counter'){f.position.x=-k*.3;f.rotation.z=k*.07;}
   if(action.name==='fish'){f.position.x=(1-p)*.7;}
  }
  reefGroup.rotation.y=media.matches?0:Math.sin(t*.14)*.015;
  renderer.setClearColor(combat?0x000000:0x073148,combat?0:1);
  renderer.render(combat?fishScene:reef,combat?fishCamera:camera);
  target.dataset.blockRenderer='live';
 }
 const lost=e=>{e.preventDefault();view.lost=true;cancelLoop();target.dataset.blockRenderer='raster';};
 const restored=()=>{if(!closed){view.lost=false;cancelLoop();draw();}};
 canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);
 function dispose(){
  if(closed)return;closed=true;observer.disconnect();target.removeAttribute('data-block-renderer');
  canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);
  reefGroup.traverse(o=>{if(o.isInstancedMesh)o.dispose();});lib.dispose();renderer.renderLists.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
 }
 Object.assign(view,{render,mount,dispose,stats:()=>({geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs?.length||0,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,contexts:closed?0:1,lost:view.lost})});return view;
}
const observer=new MutationObserver(()=>update());
observer.observe(document.body,{attributes:true,attributeFilter:['data-screen','data-abyss-paused']});
for(const id of ['fishEncounter','result'])if($(id))observer.observe($(id),{attributes:true,attributeFilter:['class','data-block-enemy']});
const mediaChanged=()=>update();media.addEventListener('change',mediaChanged);
const visibility=()=>update();document.addEventListener('visibilitychange',visibility);
const pagehide=()=>{disposed=true;stop();observer.disconnect();};
const pageshow=()=>{disposed=false;observer.observe(document.body,{attributes:true,attributeFilter:['data-screen','data-abyss-paused']});for(const id of ['fishEncounter','result'])if($(id))observer.observe($(id),{attributes:true,attributeFilter:['class','data-block-enemy']});update();};
window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
window.AbyssBlockArt=Object.freeze({event(name){cue={name,time};if(api&&!raf)draw();},snapshot:()=>({phase,frames,pending:!!pending,loop:!!raf,paused:paused(),resources:api?.stats()||{contexts:0,geometries:0,textures:0,programs:0}})});
update();
