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

const runner='games/animal-frost-maze/tests/lifecycle-check.mjs';
const pinned=screenLifecycleSourceState(root,game,runner,{sharedRuntime:'referenced'});
report.source=pinned;report.timestamp=new Date().toISOString();report.items=[];report.checkpoints=[];
let client,initialWriters,sceneBaselines,mainBaseline,returnIds;
const near=(a,b)=>['left','top','width','height'].every(k=>Math.abs(a[k]-b[k])<=1);
const signature=n=>Object.fromEntries(['identity','parent','visible','hidden','inert','className','inline','transform','position','minHeight','color','background','matched'].map(k=>[k,k==='className'?n[k].split(/\s+/).sort().join(' '):n[k]]));
const writers=async()=>readScreenLifecycleWriters(client,{main:'#main-screen',stage:'#stage-screen',battle:'#battle-screen',mainReturn:'[data-wp-return="main"]',stageReturn:'[data-wp-return="stage"]',battleReturn:'[data-wp-return="battle"]',canvas:'#arena'});
async function settings(scene){const root=page.locator('#'+scene+'-screen');const button=root.locator('.wp-shell-settings-button');await button.click();const pop=root.locator('.wp-shell-settings-popover');await pop.waitFor({state:'visible'});const r=await pop.boundingBox(),v=page.viewportSize();assert(r.x>=-1&&r.y>=-1&&r.x+r.width<=v.width+1&&r.y+r.height<=v.height+1,'settings contained');const sw=pop.locator('[role="switch"]').first();const checked=await sw.getAttribute('aria-checked');await sw.click();assert.notEqual(await sw.getAttribute('aria-checked'),checked);await sw.click();assert.equal(await sw.getAttribute('aria-checked'),checked);await page.keyboard.press('Escape');await pop.waitFor({state:'hidden'});}
async function settle(label,scene){
 const before=await inspect(),started=Date.now();const base=sceneBaselines[scene]||(sceneBaselines[scene]=before);
 for(const phase of ['immediate','two-frames',300,1000,5000]){
  if(phase==='two-frames')await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));else if(typeof phase==='number')await page.waitForTimeout(Math.max(0,phase-(Date.now()-started)));
  const s=await inspect();
  for(const [name,n]of Object.entries(s.nodes)){
   const b=before.nodes[name];assert.equal(n.identity,b.identity,label+'/'+name+' identity');assert.equal(n.parent,b.parent,label+'/'+name+' parent');
   if(n.visible&&b.visible){assert(near(n.rect,b.rect),label+'/'+name+' delayed geometry');assert.deepEqual(signature(n),signature(b),label+'/'+name+' delayed CSS');}
   const old=base.nodes[name];if(n.visible&&old.visible){assert(near(n.rect,old.rect),label+'/'+name+' restored geometry');assert.deepEqual(signature(n),signature(old),label+'/'+name+' restored CSS');}
  }
  assert.deepEqual(s.scroll,base.scroll,label+' scroll');assert.deepEqual(s.root,base.root,label+' root');assert.deepEqual(s.observers,base.observers,label+' observer owners');assert.deepEqual(s.popovers,[],label+' stale popover');
  const active=s.returns.filter(r=>r.visible);assert.equal(active.length,1);assert.equal(active[0].scene,scene);
  for(const r of s.returns)assert.equal(r.identity,returnIds[r.scene],label+' original return');
  const r=active[0],rb=base.returns.find(r=>r.scene===scene);assert(r.arrow.includes('←'));assert(r.iconColor!=='rgba(0, 0, 0, 0)'||(r.iconBackground!=='rgba(0, 0, 0, 0)'&&r.iconMask!=='none'));
  assert.deepEqual(signature(r),signature(rb),label+' return CSS');assert(near(r.rect,rb.rect));assert.equal(r.images.length,scene==='main'?1:0);
  if(scene==='main'){assert(r.images[0].complete&&r.images[0].naturalWidth>0);assert(r.href);assert(s.nodes.guide.visible);assert(s.nodes.guide.rect.top>=s.nodes.mainSlot.rect.bottom-1,'guide below complete Main');for(const name of ['poster','summary','progress','start'])assert(s.nodes.guide.rect.top>=s.nodes[name].rect.bottom-1,'guide intersection '+name);assert(!s.nodes.stage.visible&&!s.nodes.battle.visible);}
  if(scene==='stage'){assert(!s.nodes.main.visible&&!s.nodes.battle.visible);const rail=await page.locator('#stage-list').evaluate(n=>({scroll:n.scrollLeft,tab:document.querySelector('.stage-tabs [aria-current="page"]')?.textContent,card:(()=>{const r=n.querySelector('[data-stage-index="1"]').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};})()}));assert(rail.tab);assert(rail.card.x+rail.card.w/2>0&&rail.card.x+rail.card.w/2<s.viewport.width);if(!base.stageState)base.stageState=rail;assert.deepEqual(rail,base.stageState,label+' stage tab/scroll/selection');s.stageState=rail;}
  if(scene==='battle'){assert(!s.nodes.main.visible&&!s.nodes.stage.visible&&!s.nodes.guide.visible);assert(s.nodes.arena.visible&&s.nodes.coach.visible&&s.nodes.controls.visible);}
  const w=await writers();assert.deepEqual(w,initialWriters,label+' navigation writers');
  report.checkpoints.push({label,scene,phase,snapshot:s,writers:w});
 }
}
try{
 for(const[width,height]of[[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
  context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);await context.addInitScript(installScreenLifecycleObservation);page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  await page.goto(origin+'/zh-tw/games/'+game+'/');await page.locator('#start-game').waitFor({state:'visible'});await page.waitForTimeout(350);
  await page.waitForFunction(()=>document.querySelector('#arena').dataset.renderBackend==='three-r180');client=await context.newCDPSession(page);await client.send('Debugger.enable');initialWriters=await writers();sceneBaselines={};returnIds=Object.fromEntries((await inspect()).returns.map(r=>[r.scene,r.identity]));
  await settings('main');await settle('initial-main','main');
  for(let i=0;i<2;i++){
   await page.locator('#start-game').click();await settings('stage');await settle('cycle'+i+'-stage','stage');
   await page.locator('[data-stage-index="1"]').click();await page.waitForFunction(()=>Number(document.querySelector('#arena').dataset.drawCalls)>0);await page.waitForTimeout(250);const plain=await metrics();await page.locator('[data-action="build"]').click();await page.waitForTimeout(250);assert((await metrics()).drawCalls>plain.drawCalls,'live wall built');await page.locator('[data-action="break"]').click();await page.waitForTimeout(650);assert.equal((await metrics()).drawCalls,plain.drawCalls,'live wall broken');await page.locator('#rescue-undo').click();await page.locator('#rescue-undo').click();await page.locator('[data-action="up"]').click();await page.locator('#rescue-undo').click();await page.waitForTimeout(650);await settings('battle');await settle('cycle'+i+'-battle','battle');
   await page.locator('[data-wp-return="battle"]').click();await settle('cycle'+i+'-returned-stage','stage');await page.locator('[data-wp-return="stage"]').click();await settle('cycle'+i+'-returned-main','main');
  }
  await enter();await clear();const result=await page.locator('#result-screen').boundingBox();assert(result.x>=-1&&result.y>=-1&&result.x+result.width<=width+1&&result.y+result.height<=height+1);
  await page.locator('#next').click();assert(await page.locator('#battle-screen').isVisible());await backMain();
  report.items.push({viewport:[width,height],items:Array.from({length:9},(_,i)=>({item:i+1,result:'PASS'}))});await context.close();context=null;console.log(JSON.stringify({checkpoint:'lifecycle-nine',viewport:[width,height]}));
 }
 context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);page=await context.newPage();await page.goto(origin+'/en/games/'+game+'/');await enter();await clear();const saved=await page.evaluate(()=>[localStorage.getItem('wp-frost-best'),localStorage.getItem('wp-frost-mastery')]);await page.reload();await page.locator('#start-game').waitFor({state:'visible'});assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('wp-frost-best'),localStorage.getItem('wp-frost-mastery')]),saved);report.reducedMotionAndSave={pass:true,saved};await context.close();context=null;
 context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);page=await context.newPage();const engine='**/games/animal-frost-maze/vendor/three/three.module.min.js';await page.route(engine,r=>r.abort());await page.goto(origin+'/en/games/'+game+'/');await page.locator('#frost-render-notice').waitFor({state:'visible'});assert(await page.locator('#start-game').isDisabled());await page.unroute(engine);await page.locator('#frost-render-notice button').click();await page.locator('#start-game').waitFor({state:'visible'});await enter();assert.equal((await metrics()).backend,'three-r180');report.engineLoadRecovery={pass:true};await backMain();await page.goto(origin+'/ar/games/'+game+'/');await enter();await settings('battle');report.rtlSettings={pass:true};await context.close();context=null;
 assert.equal(screenLifecycleSourceState(root,game,runner,{sharedRuntime:'referenced'}).fingerprint,pinned.fingerprint,'exact-source bytes unchanged');assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.failure={message:e.message,stack:e.stack};try{report.failureScreenshot=await screenshot('failure');}catch{}throw e;}
finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({report:path.join(output,'report.json'),pass:report.pass,failure:report.failure?.message}));await context?.close();await browser.close();}
