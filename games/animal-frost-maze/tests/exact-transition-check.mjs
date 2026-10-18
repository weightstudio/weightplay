import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import vm from 'node:vm';import{pathToFileURL}from'node:url';
const root=process.cwd(),game='animal-frost-maze',origin='http://127.0.0.1:8779',output=fs.mkdtempSync(path.join(os.tmpdir(),'frost-visual-v18-'));
const{installLocalTestNetworkPolicy,localTestBrowserArgs}=await import(pathToFileURL(path.join(root,'scripts/local-test-network-policy.mjs')));
const{installScreenLifecycleObservation,inspectScreenLifecycle,readScreenLifecycleWriters,screenLifecycleSourceState}=await import(pathToFileURL(path.join(root,'scripts/lib/screen-lifecycle-observer.mjs')));
const entry=[path.join(root,'node_modules/playwright/index.js'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')].find(fs.existsSync);
assert.ok(entry);const imported=await import(pathToFileURL(entry));const{chromium}=imported.default||imported;
const exe=['/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync);
const browser=await chromium.launch({headless:true,args:localTestBrowserArgs,executablePath:exe});
let context,page;const report={game,output,matrix:[],locales:[],cycles:[],errors:[],contextRecovery:null};
const source=fs.readFileSync(`games/${game}/game.js`,'utf8'),key=(x,y)=>`${x},${y}`;
const layoutFor=new Function('key','ROOMS_PER_CHAPTER',`return (${source.match(/function layoutFor\(chapter, room\).*\n/)[0]});`)(key,5);
function plan(stage){const layout=layoutFor(Math.floor((stage-1)/5)+1,(stage-1)%5+1);let cur={x:1,y:5,ex:layout.enemy.x,ey:layout.enemy.y,moves:0};const fruits=new Set(layout.fruits),inputs=[];const valid=(x,y)=>x>=0&&x<12&&y>=0&&y<7&&!layout.walls.has(key(x,y));while(fruits.size||(stage>=26&&(cur.x!==1||cur.y!==5))){const q=[{...cur,path:[]}],seen=new Set();let found;for(let i=0;i<q.length&&i<100000;i++){const n=q[i],sig=[n.x,n.y,n.ex,n.ey,n.moves%8].join(',');if(seen.has(sig))continue;seen.add(sig);if(n.path.length&&(fruits.has(key(n.x,n.y))||(!fruits.size&&n.x===1&&n.y===5))){found=n;break;}for(const[dx,dy,k]of[[1,0,'ArrowRight'],[0,-1,'ArrowUp'],[-1,0,'ArrowLeft'],[0,1,'ArrowDown']]){const a={...n,x:n.x+dx,y:n.y+dy,moves:n.moves+1,path:[...n.path,k]};if(!valid(a.x,a.y)||(a.x===a.ex&&a.y===a.ey))continue;const win=(fruits.size===1&&fruits.has(key(a.x,a.y))&&stage<26)||(!fruits.size&&a.x===1&&a.y===5);if(a.moves%8===0&&!win){const dirs=Math.abs(a.x-a.ex)>=Math.abs(a.y-a.ey)?[[Math.sign(a.x-a.ex),0],[0,Math.sign(a.y-a.ey)]]:[[0,Math.sign(a.y-a.ey)],[Math.sign(a.x-a.ex),0]];for(const[x,y]of dirs)if(valid(a.ex+x,a.ey+y)){a.ex+=x;a.ey+=y;break;}}if(a.x!==a.ex||a.y!==a.ey)q.push(a);}}assert.ok(found,`stage ${stage} route`);inputs.push(...found.path);cur=found;fruits.delete(key(found.x,found.y));}return inputs;}
const screenshot=async name=>{const file=path.join(output,name+'.png');await page.screenshot({path:file});return file;};
const selectors={main:'#main-screen',mainReturn:'[data-wp-return="main"]',mainHeader:'.main-header',poster:'.main-cover',summary:'.main-summary',progress:'#main-progress',start:'#start-game',guide:'.game-page-info',stage:'#stage-screen',stageReturn:'[data-wp-return="stage"]',rail:'#stage-list',battle:'#battle-screen',battleReturn:'[data-wp-return="battle"]',arena:'#arena',coach:'#rescue-coach',controls:'.touch-controls'};
selectors.mainSlot='#main-screen';selectors.stageHeader='#stage-screen .stage-header';selectors.battleHeader='#battle-screen .battle-header';
const inspect=()=>page.evaluate(inspectScreenLifecycle,selectors);
const timeline=[];
async function metrics(){return page.locator('#arena').evaluate(c=>({backend:c.dataset.renderBackend,drawCalls:Number(c.dataset.drawCalls),triangles:Number(c.dataset.triangles),geometries:Number(c.dataset.geometries),textures:Number(c.dataset.textures),buffer:[c.width,c.height]}));}
async function enter(stage=1){
 await page.locator('#start-game').click();await page.waitForTimeout(180);
 const rail=page.locator('#stage-list'),card=page.locator(`#stage-list [data-stage-index="${stage}"]`);
 for(let i=0;i<35;i++){
  const box=await card.boundingBox(),r=await rail.boundingBox();
  if(box&&r&&box.x+box.width/2>r.x+3&&box.x+box.width/2<r.x+r.width-3&&await card.getAttribute('aria-disabled')==='false')break;
  const left=box&&r&&box.x+box.width/2<r.x+r.width/2;
  const from={x:r.x+r.width*(left?.25:.75),y:r.y+r.height*.5},to={x:r.x+r.width*(left?.75:.25),y:from.y};
  await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:12});await page.mouse.up();await page.waitForTimeout(200);
 }
 if(process.env.FROST_FULL_LIFECYCLE==='1')await settle('entered-stage-'+stage,'stage');await card.click();await page.locator('#battle-screen').waitFor({state:'visible'});await page.waitForFunction(()=>Number(document.querySelector('#arena').dataset.drawCalls)>0);await page.waitForTimeout(350);
}
async function clear(stage=1){await page.locator('#arena').focus();for(const k of plan(stage))await page.keyboard.press(k);await page.locator('#result-screen').waitFor({state:'visible'});await page.waitForTimeout(450);assert.ok(!(await page.locator('#next').isDisabled())||stage===30,`stage ${stage} natural win`);}
async function backMain(){await page.locator('[data-wp-return="battle"]').click();if(process.env.FROST_FULL_LIFECYCLE==='1')await settle('returned-stage','stage');await page.locator('[data-wp-return="stage"]').click();await page.locator('#main-screen').waitFor({state:'visible'});}
async function localBounds(){return page.evaluate(()=>{const rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};return {viewport:{w:innerWidth,h:innerHeight},document:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},battle:rect(document.querySelector('#battle-screen')),arena:rect(document.querySelector('#arena')),controls:[...document.querySelectorAll('#battle-screen button')].filter(n=>!n.closest('[hidden]')&&n.getClientRects().length).map(n=>({id:n.id||n.dataset.action||n.dataset.wpReturn||n.className,text:n.textContent,rect:rect(n),centerHit:(()=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===n||n.contains(hit)})()}))};});}

report.source=screenLifecycleSourceState(root,game,'games/animal-frost-maze/tests/lifecycle-check.mjs',{sharedRuntime:'referenced'});report.timestamp=new Date().toISOString();report.runnerSha256=(await import('node:crypto')).createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex');report.exact=[];
const near=(a,b)=>['left','top','width','height'].every(k=>Math.abs(a[k]-b[k])<=1);
const sig=n=>Object.fromEntries(['identity','parent','visible','hidden','inert','inline','transform','position','color','background','matched'].map(k=>[k,n[k]]));
try{
for(const[width,height]of[[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
 context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);await context.addInitScript(installScreenLifecycleObservation);
 await context.addInitScript(({body,selectors})=>{
  const inspect=(0,eval)('('+body+')');window.__frostExact=[];let armed=false,last=null,generation=0;
  function record(scene){const gen=++generation,start=performance.now();const capture=phase=>{if(gen!==generation)return;const snapshot=inspect(selectors);if(scene==='stage'){const rail=document.querySelector('#stage-list');snapshot.actualCards=[...rail.querySelectorAll('[data-stage-index]')].map(n=>({stage:Number(n.dataset.stageIndex),current:n.getAttribute('aria-current'),rect:n.getBoundingClientRect().toJSON()}));}window.__frostExact.push({scene,phase,elapsed:performance.now()-start,snapshot});};
   capture('immediate');requestAnimationFrame(()=>requestAnimationFrame(()=>capture('two-frames')));for(const ms of [300,1000,5000])setTimeout(()=>capture(ms),ms);
  }
  window.__armFrostExact=()=>{armed=true;last=document.body.dataset.screen;record(last);};
  new MutationObserver(()=>{if(!armed)return;const scene=document.body.dataset.screen;if(scene!==last){last=scene;record(scene);}}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-screen']});
 },{body:inspectScreenLifecycle.toString(),selectors});
 page=await context.newPage();await page.goto(origin+'/zh-tw/games/'+game+'/');await page.waitForFunction(()=>document.querySelector('#arena')?.dataset.renderBackend==='three-r180');await page.evaluate(()=>window.__armFrostExact());
 const baseline={};let consumed=0;
 async function waitScene(scene){
  await page.waitForFunction(n=>window.__frostExact.length>=n+5,consumed,{timeout:10000});const rows=await page.evaluate(n=>window.__frostExact.slice(n,n+5),consumed);consumed+=5;assert.equal(rows.length,5);assert(rows.every(r=>r.scene===scene));
  report.exact.push({viewport:[width,height],scene,rows});const first=rows[0].snapshot,old=baseline[scene]||(baseline[scene]=first);
  for(const row of rows){const current=row.snapshot;const active=current.returns.filter(r=>r.visible);assert.equal(active.length,1);assert.equal(active[0].scene,scene);assert.equal(active[0].images.length,scene==='main'?1:0);assert(active[0].arrow.includes('←'));assert.equal(active[0].identity,old.returns.find(r=>r.scene===scene).identity);
   for(const[name,n]of Object.entries(current.nodes)){const a=first.nodes[name],b=old.nodes[name];assert.equal(n.identity,a.identity);assert.equal(n.parent,a.parent);if(n.visible&&a.visible){assert(near(n.rect,a.rect),scene+'/'+row.phase+'/'+name+' immediate drift');assert.deepEqual(sig(n),sig(a));}if(n.visible&&b.visible){assert(near(n.rect,b.rect),scene+'/'+name+' restore');assert.deepEqual(sig(n),sig(b));}}
   assert.deepEqual(current.scroll,old.scroll);assert.deepEqual(current.root,old.root);assert.deepEqual(current.observers,old.observers);
   if(scene==='main'){assert(current.nodes.guide.rect.top>=current.nodes.mainSlot.rect.bottom-1);for(const k of ['poster','summary','progress','start'])assert(current.nodes.guide.rect.top>=current.nodes[k].rect.bottom-1);}
   if(scene==='stage'){const selected=current.actualCards.find(c=>c.current==='true'),rail=current.nodes.rail.rect;assert(selected);assert(Math.abs(selected.rect.x+selected.rect.width/2-(rail.left+rail.width/2))<=1,'selected Stage centered');const adjacent=current.actualCards.find(c=>c.stage===selected.stage+1);if(adjacent)assert(adjacent.rect.x<rail.right&&adjacent.rect.right>rail.left,'next Stage neighbour visible');}
  }
  report.exact.at(-1).evidence=await screenshot('literal-'+scene+'-'+width);
 }
 await waitScene('main');
 for(let cycle=0;cycle<2;cycle++){await page.locator('#start-game').click();await waitScene('stage');await page.locator('[data-stage-index="1"]').click();await waitScene('battle');await page.locator('[data-action="up"]').click();await page.locator('#rescue-undo').click();await page.locator('[data-wp-return="battle"]').click();await waitScene('stage');await page.locator('[data-wp-return="stage"]').click();await waitScene('main');}
 await context.close();context=null;console.log(JSON.stringify({checkpoint:'literal-transition-five-phases',viewport:[width,height]}));
}
assert.equal(screenLifecycleSourceState(root,game,'games/animal-frost-maze/tests/lifecycle-check.mjs',{sharedRuntime:'referenced'}).fingerprint,report.source.fingerprint);report.pass=true;
}catch(e){report.failure={message:e.message,stack:e.stack};try{report.failureScreenshot=await screenshot('failure');}catch{}throw e;}
finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({report:path.join(output,'report.json'),pass:report.pass,failure:report.failure?.message}));await context?.close();await browser.close();}
