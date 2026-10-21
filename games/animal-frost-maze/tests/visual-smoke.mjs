import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import vm from 'node:vm';import{pathToFileURL}from'node:url';
const root=process.cwd(),game='animal-frost-maze',origin='http://127.0.0.1:8779',output=fs.mkdtempSync(path.join(os.tmpdir(),'frost-visual-v18-'));
const{installLocalTestNetworkPolicy,localTestBrowserArgs}=await import(pathToFileURL(path.join(root,'scripts/local-test-network-policy.mjs')));
const{installScreenLifecycleObservation,inspectScreenLifecycle}=await import(pathToFileURL(path.join(root,'scripts/lib/screen-lifecycle-observer.mjs')));
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
const inspect=()=>page.evaluate(inspectScreenLifecycle,selectors);
const timeline=[];
async function settle(label,scene){
 const nodes=scene==='main'?['main','mainReturn','poster','summary','progress','start','guide']:scene==='stage'?['stage','stageReturn','rail']:['battle','battleReturn','arena','coach','controls'];
 const rows=[];const start=Date.now();
 for(const phase of ['immediate','two-frames',300,1000,5000]){
  if(phase==='two-frames')await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  else if(typeof phase==='number')await page.waitForTimeout(Math.max(0,phase-(Date.now()-start)));
  const snapshot=await inspect();rows.push({phase,snapshot});
 }
 const differences=[];const baseline=rows[0].snapshot;
 for(const row of rows.slice(1))for(const name of nodes){const a=baseline.nodes[name],b=row.snapshot.nodes[name];assert.equal(a?.identity,b?.identity,`stable DOM ${label}/${name}`);if(a?.rect&&b?.rect)for(const field of ['left','top','width','height'])if(Math.abs(a.rect[field]-b.rect[field])>1)differences.push([row.phase,name,field,a.rect[field],b.rect[field]]);}
 timeline.push({label,scene,rows,differences});assert.deepEqual(differences,[],`${label}: delayed geometry drift`);return rows.at(-1).snapshot;
}
async function metrics(){return page.locator('#arena').evaluate(c=>({backend:c.dataset.renderBackend,drawCalls:Number(c.dataset.drawCalls),triangles:Number(c.dataset.triangles),geometries:Number(c.dataset.geometries),textures:Number(c.dataset.textures),buffer:[c.width,c.height]}));}
async function enter(stage=1){
 await page.locator('#start-game').click();await page.locator('#stage-screen').waitFor({state:'visible'});
 const rail=page.locator('#stage-list'),direction=await page.locator('html').getAttribute('dir'),advance=direction==='rtl'?'ArrowLeft':'ArrowRight';
 await rail.locator('[aria-current="true"]').focus();
 for(let index=1;index<stage;index++)await page.keyboard.press(advance);
 const card=rail.locator(`[data-stage="${stage}"]`);await card.waitFor({state:'visible'});
 if(process.env.FROST_FULL_LIFECYCLE==='1')await settle('entered-stage-'+stage,'stage');await card.click();await page.locator('#battle-screen').waitFor({state:'visible'});await page.waitForFunction(()=>Number(document.querySelector('#arena').dataset.drawCalls)>0);await page.waitForTimeout(350);
}
async function clear(stage=1){await page.locator('#arena').focus();for(const k of plan(stage))await page.keyboard.press(k);await page.locator('#result-screen').waitFor({state:'visible'});assert.equal(await page.locator('#battle-screen .wp-shell-settings-button').isVisible(),false,'Result hides the inert Battle Settings control');await page.waitForTimeout(450);assert.ok(!(await page.locator('#next').isDisabled())||stage===30,`stage ${stage} natural win`);}
async function backMain(){await page.locator('[data-wp-return="battle"]').click();if(process.env.FROST_FULL_LIFECYCLE==='1')await settle('returned-stage','stage');await page.locator('[data-wp-return="stage"]').click();await page.locator('#main-screen').waitFor({state:'visible'});}
async function localBounds(){return page.evaluate(()=>{const rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};return {viewport:{w:innerWidth,h:innerHeight},document:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},battle:rect(document.querySelector('#battle-screen')),arena:rect(document.querySelector('#arena')),controls:[...document.querySelectorAll('#battle-screen button')].filter(n=>!n.closest('[hidden]')&&n.getClientRects().length).map(n=>({id:n.id||n.dataset.action||n.dataset.wpReturn||n.className,text:n.textContent,rect:rect(n),centerHit:(()=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===n||n.contains(hit)})()}))};});}
try{
 context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:process.env.FROST_REDUCED==='1'?'reduce':'no-preference'});await installLocalTestNetworkPolicy(context);await context.addInitScript(installScreenLifecycleObservation);page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(`${origin}/zh-tw/games/${game}/`);await page.locator('#start-game').waitFor({state:'visible'});await enter();await clear();report.firstClear=await screenshot('natural-clear');await page.locator('#to-stages').click();await page.locator('[data-wp-return="stage"]').click();
 for(const[w,h]of[[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
  await page.setViewportSize({width:w,height:h});await page.waitForTimeout(350);const initial=process.env.FROST_FULL_LIFECYCLE==='1'?await settle('initial-main-'+w,'main'):await inspect();
  const cycles=[];
  for(let cycle=0;cycle<2;cycle++){
   await enter();await page.locator('#rescue-route').click();await page.locator('[data-action="up"]').click();await page.locator('#rescue-undo').click();
   await page.locator('#battle-screen .wp-shell-settings-button').click();await page.keyboard.press('Escape');await page.waitForTimeout(350);
   if(process.env.FROST_FULL_LIFECYCLE==='1')await settle(`live-battle-${w}-${cycle}`,'battle');const bounds=await localBounds();assert.ok(bounds.document.w<=w+1,`${w} no horizontal overflow`);for(const control of bounds.controls){assert.ok(control.rect.x>=-1&&control.rect.y>=-1&&control.rect.x+control.rect.w<=w+1&&control.rect.y+control.rect.h<=h+1,`${w}: contained ${control.id}`);assert.ok(control.centerHit,`${w}: center hit ${control.id}`);}
   const m=await metrics();assert.equal(m.backend,'three-r180');assert.ok(m.drawCalls>100&&m.drawCalls<400,'actual authored geometry within draw budget');assert.ok(m.triangles>3000&&m.triangles<20000);assert.equal(m.geometries,1);assert.ok(m.textures<=2);
   const battleImage=cycle===0?await screenshot(`battle-${w}x${h}`):null;let resultImage=null;if(cycle===0){await clear();resultImage=await screenshot(`result-${w}x${h}`);await page.locator('#retry').click();await page.waitForTimeout(350);}
   await backMain();await page.waitForTimeout(350);const returned=process.env.FROST_FULL_LIFECYCLE==='1'?await settle(`returned-main-${w}-${cycle}`,'main'):await inspect();
   const drift=[];for(const name of ['main','mainReturn','poster','summary','progress','start','guide']){const a=initial.nodes[name],b=returned.nodes[name];if(a&&b&&a.rect&&b.rect)for(const field of ['left','top','width','height'])if(Math.abs(a.rect[field]-b.rect[field])>1)drift.push([name,field,a.rect[field],b.rect[field]]);}
   cycles.push({cycle:cycle+1,bounds,metrics:m,image:battleImage,resultImage,mainDrift:drift,initial,returned});
  }
  report.matrix.push({viewport:[w,h],cycles});console.log(JSON.stringify({checkpoint:'viewport',viewport:[w,h],metrics:cycles[0].metrics,mainDrift:cycles.map(c=>c.mainDrift.length)}));
 }
 process.env.FROST_FULL_LIFECYCLE='0';await page.setViewportSize({width:390,height:844});await enter();const base=await metrics();
 for(let i=0;i<5;i++){await page.locator('[data-action="up"]').click();await backMain();await enter();const m=await metrics();assert.equal(m.geometries,base.geometries);assert.equal(m.textures,base.textures);assert.equal(m.drawCalls,base.drawCalls);report.cycles.push(m);}
 const before=await page.locator('#rescue-threat').innerText();await page.locator('#arena').evaluate(c=>{window.__frostContext=c.getContext('webgl2').getExtension('WEBGL_lose_context');window.__frostContext.loseContext();});await page.locator('#frost-render-notice').waitFor({state:'visible'});await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#rescue-threat').innerText(),before);await page.waitForTimeout(1000);await page.evaluate(()=>window.__frostContext.restoreContext());await page.locator('#frost-render-notice').waitFor({state:'hidden'});await page.waitForTimeout(350);report.contextRecovery={pass:true,before,after:await page.locator('#rescue-threat').innerText(),metrics:await metrics()};await backMain();
 for(const locale of ['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar']){await page.goto(`${origin}/${locale}/games/${game}/`);await enter();await page.locator('#rescue-route').click();await page.locator('[data-action="up"]').click();await page.locator('#rescue-undo').click();const b=await localBounds();assert.ok(b.document.w<=391);report.locales.push({locale,metrics:await metrics(),bounds:b});if(locale==='ar')report.arabic=await screenshot('arabic-portrait');}
 // Representative echo, home and final rules use natural source-planned native input, never seeded progress or callbacks.
 await backMain();report.boundaries=[];
 for(const stage of [21,26,30]){await enter(stage);await clear(stage);report.boundaries.push({stage,image:await screenshot('stage-'+stage+'-clear'),result:await page.locator('#result-copy').innerText()});await page.locator('#to-stages').click();await page.locator('[data-wp-return="stage"]').click();}
 report.lifecycleTimeline=timeline;
 assert.deepEqual(report.errors,[]);report.pass=true;
}catch(e){report.failure={message:e.message,stack:e.stack};if(page)try{report.failureScreenshot=await screenshot('failure');}catch{}throw e;}
finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({report:path.join(output,'report.json'),pass:report.pass,failure:report.failure?.message,errors:report.errors}));await context?.close();await browser.close();}
