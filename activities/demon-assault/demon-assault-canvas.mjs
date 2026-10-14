// Same approved art, world coordinates and authoritative physics in both renderers.
import {FALLBACK_ART} from './demon-assault-image-pack.mjs?v=20261014-asset-recovery-2';
export const RENDER_REVISION='asset-recovery-2';
const names={boss:'demon-assault-boss-v2.webp',sling:'demon-assault-sling-v2.webp'},assetDiagnostics=[];
export const imageDiagnostics=()=>assetDiagnostics.map(row=>({...row,errors:[...row.errors]}));
export function installBattleArt(){for(const image of document.querySelectorAll('[data-battle-art]'))image.src=FALLBACK_ART[image.dataset.battleArt];}
async function decodeImage(src,name){const image=new Image();await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(`ASSET_DECODE_TIMEOUT:${name}`)),3000);image.onload=()=>{clearTimeout(timer);resolve();};image.onerror=()=>{clearTimeout(timer);reject(Error(`ASSET_DECODE:${name}`));};image.src=src;});if(!image.naturalWidth||!image.naturalHeight)throw Error(`ASSET_EMPTY:${name}`);return image;}
export async function loadBattleImages(){
 const images=await Promise.all(Object.entries(names).map(async([key,name])=>{
  const errors=[];
  for(let attempt=0;attempt<2;attempt++){
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
   try{
    const url=new URL(name,import.meta.url);url.searchParams.set('v','20261014-original-art-2');if(attempt)url.searchParams.set('retry',String(attempt));
    const response=await fetch(url,{signal:controller.signal,cache:attempt?'reload':'default'});
    if(!response.ok)throw Error(`ASSET_HTTP_${response.status}:${name}`);
    if(!/^image\/(png|webp)(?:;|$)/i.test(response.headers.get('content-type')||''))throw Error(`ASSET_CONTENT_TYPE:${name}`);
    const blob=await response.blob(),objectURL=URL.createObjectURL(blob);
    try{const image=await decodeImage(objectURL,name);assetDiagnostics.push({asset:key,source:'network',attempts:attempt+1,errors});return[key,image];}finally{URL.revokeObjectURL(objectURL);}
   }catch(error){errors.push(error.name==='AbortError'?`ASSET_TIMEOUT:${name}`:error.message.startsWith('ASSET_')?error.message:`ASSET_NETWORK:${name}`);}finally{clearTimeout(timer);}
  }
  // Individual image failures recover from art carried in the module graph.
  // Drawing never creates or spends a daily run.
  const image=await decodeImage(FALLBACK_ART[key],name);assetDiagnostics.push({asset:key,source:'embedded-original-art',attempts:2,errors});return[key,image];
 }));
 return Object.fromEntries(images);
}
export class CanvasBattleRenderer{
 constructor(canvas,images){this.canvas=canvas;this.images=images;this.ctx=canvas.getContext('2d',{alpha:true});if(!this.ctx)throw new Error('CANVAS_UNAVAILABLE');this.info={render:{calls:0},memory:{geometries:0,textures:3}};}
 setSize(width,height){this.width=width;this.height=height;const d=Math.min(devicePixelRatio||1,1.6);this.canvas.width=Math.round(width*d);this.canvas.height=Math.round(height*d);this.ctx.setTransform(d,0,0,d,0,0);}
 render({project,scale,run,pull,shot,anchor,boss,time,spawnTime,hitTime,defeatTime,reduced}){
  const c=this.ctx;c.clearRect(0,0,this.width,this.height);this.info.render.calls++;
  const sprite=(image,x,y,w,h,alpha=1,rotation=0)=>{const p=project(x,y);c.save();c.translate(p.x,p.y);c.rotate(rotation);c.globalAlpha=Math.max(0,Math.min(1,alpha));c.drawImage(image,-w*scale/2,-h*scale/2,w*scale,h*scale);c.restore();};
  sprite(this.images.sling,anchor.x,136,80,120);
  const cleared=run?.status==='cleared',age=time-defeatTime,hit=Math.max(0,1-(time-hitTime)/.28),breath=reduced?0:Math.sin(time*1.8)*.006;
  if(!cleared||age<.75)sprite(this.images.boss,boss.x,boss.y+(reduced?0:hit*4),300*(1+breath),300*(1-breath),cleared?1-age/.75:Math.min(1,(time-spawnTime)/.35),reduced?0:hit*Math.sin(time*55)*.018);
  for(const guard of run?.defenders||[])if(guard.alive)sprite(this.images.boss,guard.x,guard.y,47,47);
  if(run?.status==='playing'){
   const p=project((shot||pull||anchor).x,(shot||pull||anchor).y),size=17*scale;c.save();c.translate(p.x,p.y);c.rotate(shot&&!reduced?time*4:.12);
   c.fillStyle='#b98a45';c.fillRect(-size*.65,-size*.65,size*1.3,size*1.3);c.fillStyle='#43bacb';c.fillRect(-size/2,-size/2,size,size);c.fillStyle='#d4ffff';c.fillRect(-size/2,-size/2,size,size*.28);c.strokeStyle='#ffe2a1';c.lineWidth=Math.max(1,2*scale);c.strokeRect(-size*.65,-size*.65,size*1.3,size*1.3);c.restore();
  }
 }
 dispose(){this.ctx.clearRect(0,0,this.width||0,this.height||0);}
}
