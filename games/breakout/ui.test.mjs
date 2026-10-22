// Developer regression: isolated legacy/wallet fixtures, native UI actions,
// read-only diagnostics. No forced game state or alternate win path.
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {localTestOrigin,installLocalTestNetworkPolicy,localTestBrowserArgs} from '../../scripts/local-test-network-policy.mjs';
import {createRun,resizeRun,aim,serve,step,drainEvents} from './core.mjs';
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js');
const {default:pw}=await import(pathToFileURL(runtime));
const origin=localTestOrigin(),out=fs.mkdtempSync(path.join(os.tmpdir(),'breakout-v23-ui-'));
const browser=await pw.chromium.launch({headless:true,args:localTestBrowserArgs});
let context;const report={scope:'DEVELOPER_REGRESSION_LOCAL_ONLY',screens:[],lifecycle:[],locales:[],errors:[],evidenceDirectory:out};
const snapshot=p=>p.evaluate(()=>window.WPBreakoutDiagnostics.snapshot());
const capture=async(p,name)=>{await p.waitForTimeout(250);await p.screenshot({path:path.join(out,name+'.png')});};
const click=async(p,id)=>p.locator('#'+id).click();
const boxes=p=>p.evaluate(()=>{
  const rect=id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return {id,x:r.x,y:r.y,w:r.width,h:r.height,visible:!!r.width&&!!r.height,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};};
  return {width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth,items:['board','actionBtn','pauseBtn','gameMessage'].map(rect)};
});
try{
  context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);
  await context.addInitScript(()=>{if(!sessionStorage.getItem('br23-fixture')){localStorage.setItem('weightplay_breakout_campaign_v18',JSON.stringify({highestUnlocked:30,cleared:[1,2,3]}));localStorage.setItem('weightplayWallet',JSON.stringify({diamonds:20}));sessionStorage.setItem('br23-fixture','1');}});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/__weightplay/'))report.errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(origin+'/games/breakout/');await page.waitForFunction(()=>window.WPBreakoutDiagnostics);await capture(page,'main');
  await click(page,'startBtn');await click(page,'equipmentTab');await click(page,'equip-aurora');await click(page,'purchaseConfirm');await page.locator('#purchaseDialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>window.WeightPlayWallet.read().diamonds),5);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('weightplay_breakout_crystal_v23')).aurora),true);
  await capture(page,'equipment');await click(page,'equip-comet');await click(page,'equip-guardian');
  await click(page,'stageTabButton');await page.locator('#stageRail .stage-card[aria-current="true"]').click();
  assert.equal((await snapshot(page)).stage,30); // Legacy highest-unlocked survives.
  for(const [width,height]of [[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(300);
    await click(page,'actionBtn');await page.waitForTimeout(300);await click(page,'pauseBtn');
    const before=await snapshot(page);await page.waitForTimeout(300);assert.equal((await snapshot(page)).elapsed,before.elapsed,'Pause freezes simulation');
    await click(page,'pauseRestart');await page.waitForTimeout(200);
    const layout=await boxes(page);assert(layout.documentWidth<=width+1,`Overflow ${width}`);
    for(const b of layout.items.filter(x=>x.id!=='board')){assert(b.y+b.h<=height+1,`${width} ${b.id} bottom ${b.y+b.h}`);if(b.id!=='gameMessage')assert(b.h>=44&&b.hit,`${width} target ${b.id}`);}
    const court=layout.items.find(x=>x.id==='board');if(width===390){assert(court.w>=340);assert(court.h>=500);}
    const data=await snapshot(page);assert(data.render.calls<=150);assert(data.render.triangles<=60000);assert.equal(data.render.textures,0);
    report.screens.push({...layout,render:data.render});await capture(page,`${width}x${height}-battle`);
  }
  await page.setViewportSize({width:390,height:844});
  for(let i=0;i<5;i++){await click(page,'pauseBtn');await click(page,'pauseRestart');await page.waitForTimeout(100);report.lifecycle.push(await snapshot(page));}
  assert.equal(new Set(report.lifecycle.map(s=>s.render.geometries)).size,1);assert(report.lifecycle.every(s=>s.raf===1));
  await page.locator('#battleScreen [data-wp-settings]').click();const elapsed=(await snapshot(page)).elapsed;await page.waitForTimeout(250);assert.equal((await snapshot(page)).elapsed,elapsed);await click(page,'helpBtn');await click(page,'helpClose');assert.equal(await page.locator('#battleScreen [data-wp-settings]').getAttribute('aria-expanded'),'false');
  await click(page,'battleBackBtn');await click(page,'breakoutLeaveContinue');await click(page,'battleBackBtn');await click(page,'breakoutLeaveStages');
  assert.equal((await snapshot(page)).raf,0);
  // Enter Stage 1 via the shared native keyboard rail navigation.
  const selected=page.locator('#stageRail .stage-card[aria-current="true"]');await selected.focus();await page.keyboard.press('Home');await page.keyboard.press('Enter');await page.waitForTimeout(250);
  assert.equal((await snapshot(page)).stage,1);
  const {geometry}=await snapshot(page),rect=await page.locator('#board').boundingBox();
  let best=null;for(let x=60;x<=300;x++){
    const s=createRun(1);resizeRun(s,geometry.width,geometry.height);aim(s,x);for(let i=0;i<120;i++)step(s,1/120);
    for(let i=0;i<120*90&&!['lost','won'].includes(s.status);i++){if(s.status==='ready')serve(s);step(s,1/120);drainEvents(s);}
    if(s.status==='won'&&(!best||s.elapsed<best.time))best={x,time:s.elapsed};
  }
  assert(best,'A legal fixed-paddle opening exists');
  const span=Math.max((geometry.height+20)*rect.width/rect.height,geometry.width+16);
  await page.mouse.move(rect.x+rect.width/2+(best.x-geometry.width/2)*rect.width/span,rect.y+rect.height*.8);await page.waitForTimeout(200);await click(page,'actionBtn');
  const deadline=Date.now()+Math.ceil(best.time*1000)+12000;
  while(Date.now()<deadline){const state=await snapshot(page);if(['won','lost'].includes(state.status))break;if(state.status==='ready')await page.keyboard.press('Space');await page.waitForTimeout(200);}
  assert.equal((await snapshot(page)).status,'won');report.nativeClear=await snapshot(page);
  for(const [width,height]of [[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(150);
    const result=await page.locator('#resultScreen .result-actions button').evaluateAll(buttons=>buttons.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,bottom:r.bottom,hit:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};}));
    await capture(page,`${width}x${height}-result`);
    assert(result.every(b=>b.h>=44&&b.bottom<=height+1&&b.hit),`Result targets ${width}: ${JSON.stringify(result)}`);
    assert(await page.locator('#resultTitle').evaluate(e=>{const r=e.getBoundingClientRect();return [r.y+2,r.bottom-2].every(y=>e.contains(document.elementFromPoint(r.x+r.width/2,y)));}),`Result heading unobstructed ${width}`);
  }
  await page.reload();await page.waitForFunction(()=>window.WPBreakoutDiagnostics);assert.equal(await page.evaluate(()=>window.WeightPlayWallet.read().diamonds),5);
  for(const locale of ['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar']){
    await page.goto(`${origin}/${locale}/games/breakout/`);await page.waitForFunction(()=>window.WPBreakoutDiagnostics);await click(page,'startBtn');await page.locator('#stageRail .stage-card[aria-current="true"]').click();await page.waitForTimeout(100);assert.equal((await snapshot(page)).status,'ready');report.locales.push(locale);
  }
  await page.emulateMedia({reducedMotion:'reduce'});await click(page,'actionBtn');await page.waitForTimeout(1200);const reducedState=await snapshot(page);assert.equal(reducedState.render.effects,0);report.reducedMotion=reducedState;
  report.audio=await page.evaluate(()=>window.WeightPlayAudio.stats());assert.equal(report.audio.contexts,1);assert.equal(report.errors.length,0,report.errors.join('\n'));
  report.ok=true;
}catch(error){report.ok=false;report.failure=String(error.stack||error);process.exitCode=1;}finally{await context?.close();await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,screens:report.screens.map(s=>({width:s.width,height:s.height,items:s.items,render:s.render})),lifecycle:report.lifecycle.map(s=>s.render)}));}
