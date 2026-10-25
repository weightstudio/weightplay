// Producer engineering checks. Run only through task-resource-cleanup.py.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
import {localTestOrigin,localTestBrowserArgs,installLocalTestNetworkPolicy} from '../../scripts/local-test-network-policy.mjs';
import {installScreenLifecycleObservation,inspectScreenLifecycle} from '../../scripts/lib/screen-lifecycle-observer.mjs';
import {installLifecycleSourceGuard,referencedLifecycleFiles} from '../../scripts/lib/screen-lifecycle-source-scope.mjs';
import {localPublicFile} from '../../scripts/lib/local-public-file.mjs';
import {COPY} from './copy.mjs';
const root=process.cwd(),origin=localTestOrigin(),out=fs.mkdtempSync(path.join(os.tmpdir(),'signal-snap-v3-'));
// This recently published game has no legacy interface-register row. Preserve
// that gap instead of inventing one. The current owner-release inspector supplies
// the canonical product manifest for these explicitly producer-only checks.
const inspected=spawnSync('python3',['scripts/manage-owner-game-release.py','inspect','--game','signal-snap'],{cwd:root,encoding:'utf8',maxBuffer:2*1024*1024});assert.equal(inspected.status,0,inspected.stderr);
const current=JSON.parse(inspected.stdout).source;assert.equal(current.gameVersion,'v3');assert.equal(current.interfaceVersion,'9');
const computed=['src/analytics.js','src/edge-guard.js','src/game-page-info-es.js','src/shared-interface-bootstrap.js','src/site-config.js','src/weightplay-castle.js'];
const paths=referencedLifecycleFiles(root,new Set([...current.sourceManifest.map(row=>path.resolve(root,row.path)),...computed.map(p=>path.resolve(root,p))]));
// macOS resolves /assets and /Assets to the same owned file. Bind its actual
// filesystem spelling and bytes, rather than suppressing a guard failure.
const actual=new Set([...paths].map(p=>fs.realpathSync(p)));const manifest=[...actual].sort().map(p=>({path:path.relative(root,p),sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')}));
const source={fingerprint:current.sourceFingerprint,manifest,sharedRuntimeScope:'referenced'};
const report={kind:'PRODUCER_ENGINEERING_NOT_INDEPENDENT_QA',source:source.fingerprint,sourceMethod:'OWNER_RELEASE_CURRENT_SOURCE_MANIFEST',manifestSha256:current.sourceManifestSha256,formalInterfaceAcceptance:'NOT_CLAIMED; legacy register row absent',output:out,sizes:[],locales:[],resources:[],errors:[],failedRequests:[],status:'RUNNING'};
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));save();
const {default:pw}=await import(pathToFileURL(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')));
const executablePath=['/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
const browser=await pw.chromium.launch({executablePath,headless:true,args:[...localTestBrowserArgs,'--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let context;
const selectors={main:'#mainScene',stage:'#stageScene',battle:'#battleScene',poster:'.signal-main-poster',summary:'[data-wp-frame-summary]',progress:'[data-wp-frame-progress]',start:'#start',guide:'.game-page-info',arena:'#arena',controls:'#controls'};
try{
 context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);await context.addInitScript(installScreenLifecycleObservation);
 const pinned=installLifecycleSourceGuard(context,root,source),loaded=new Set(),page=await context.newPage();page.setDefaultTimeout(10000);
 context.on('request',request=>{const url=new URL(request.url());if(url.origin!==origin)return;const file=localPublicFile(root,decodeURIComponent(url.pathname));if(file)loaded.add(fs.realpathSync(file));});
 function checkSource(){pinned();const expected=new Map(manifest.map(row=>[path.resolve(root,row.path),row.sha256]));report.loadedRuntimeManifest=[...loaded].sort().map(file=>{const sha256=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');assert.equal(sha256,expected.get(file),'unchanged observed source '+path.relative(root,file));return {path:path.relative(root,file),sha256};});}
 page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))report.failedRequests.push({url:r.url(),status:r.status()});});
 async function settle(){await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).every(a=>a.playState!=='running'));}
 async function ready(){await page.waitForFunction(()=>document.querySelector('[data-wp-frame-active="main"]')&&document.documentElement.dataset.wpGameEntryLoaderActive!=='true'&&!document.querySelector('.wp-game-entry-loader'));await settle();}
 async function shot(name){await settle();const file=path.join(out,name+'.png');await page.screenshot({path:file});return file;}
 const box=async selector=>page.locator(selector).boundingBox();
 async function geometry(){return page.evaluate(()=>{const r=id=>{const b=document.querySelector(id).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};return {viewport:[innerWidth,innerHeight],documentWidth:document.documentElement.scrollWidth,active:document.getElementById('app').dataset.wpFrameActive,main:r('#mainScene'),stage:r('#stageScene'),battle:r('#battleScene'),arena:r('#arena'),left:r('#left'),right:r('#right'),controls:r('#controls')};});}
 async function stats(){return page.evaluate(async()=>{const m=await import('/games/signal-snap/game.mjs?v=signal-v3');return m.renderStats();});}
 async function enter(){await page.locator('#start').click();await settle();await page.locator('#rail [aria-current="true"]').click();await page.waitForSelector('#arena canvas');await page.locator('#left:enabled').waitFor();}
 async function exitBattle(){await page.locator('#battleScene [data-wp-return]').click();await page.locator('#overlay[open]').waitFor();await page.locator('#overlayActions button:last-child').click();await page.waitForSelector('#stageScene:not([hidden])');assert.equal(await page.locator('#arena canvas').count(),0);}
 async function play(width){const until=Date.now()+30000;let captured=false;while(!await page.locator('#signalResult').isVisible()&&Date.now()<until){const left=await page.locator('#leftCue').textContent(),right=await page.locator('#rightCue').textContent();if(left==='◆'||right==='◆'){await page.keyboard.press(left==='◆'?'ArrowLeft':'ArrowRight');if(!captured){report.sizes.at(-1).battleImage=await shot('battle-'+width);captured=true;}}await page.waitForTimeout(55);}assert(await page.locator('#signalResult').isVisible(),'native visible-symbol play reaches Result');assert.equal(await page.locator('#signalResultTitle').textContent(),COPY['zh-Hant'].success);}
 for(const [width,height]of [[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
  const row={width,height,cycles:[],images:{}};report.sizes.push(row);save();await page.setViewportSize({width,height});await page.goto(origin+'/zh-tw/games/signal-snap/');await ready();
  row.images.main=await shot('main-'+width);const mainBefore=await page.evaluate(inspectScreenLifecycle,selectors);
  assert((await box('#mainScene')).width<=920.1);assert(await page.locator('.signal-main-poster img').evaluate(n=>n.complete&&n.naturalWidth===1254&&n.currentSrc.includes('poster.webp')));
  if(width===390){const start=await box('#start');assert(start.y+start.height<=height,'Main Start stays in first fold');}
  await page.locator('#mainScene button[aria-controls="wp-frame-main-settings"]').click();assert.equal(await page.locator('#mainScene .wp-frame-popover select option').count(),13);const sound=page.locator('#mainScene [role="switch"]');const soundBefore=await sound.getAttribute('aria-checked');await sound.click();assert.notEqual(await sound.getAttribute('aria-checked'),soundBefore);await sound.click();await page.locator('#mainScene button[aria-controls="wp-frame-main-settings"]').click();
  for(let cycle=0;cycle<2;cycle++){
   await page.locator('#start').click();await settle();if(cycle===0){row.images.stage=await shot('stage-'+width);const tab=page.locator('[data-wp-frame-stage-nav] button:last-child');await tab.click();await page.waitForSelector('#stylePreview canvas');assert(!await page.locator('#signalStagePicker').isVisible());assert(!await page.locator('.wp-stage-i9-briefing').isVisible());
    row.images.styles=await shot('styles-'+width);await page.locator('[data-skin="violet"]').click();await page.locator('#styleApply').click();assert(await page.locator('#overlay[open]').isVisible());await page.locator('#overlayActions button:first-child').click();assert(!await page.locator('#overlay').isVisible());await page.locator('#styleApply').click();await page.locator('#overlayActions button:last-child').click();assert.equal(await page.locator('#styleNotice').textContent(),COPY['zh-Hant'].insufficient);assert.equal(await page.locator('#diamondBalance').textContent(),'0');await page.locator('[data-wp-frame-stage-nav] button:first-of-type').click();assert.equal(await page.locator('#stylePreview canvas').count(),0);
   }
   await page.locator('#rail [aria-current="true"]').click();await page.waitForSelector('#arena canvas');await page.locator('#left:enabled').waitFor();const before=await geometry();assert.equal(before.active,'battle');assert(Math.abs(before.battle.width-Math.min(width,920))<1);assert(Math.abs(before.battle.bottom-height)<1);assert(before.documentWidth<=width+1);assert(before.left.height>=43.5&&before.right.height>=43.5);assert(before.arena.height>=Math.min(70,height*.2));
   const counters=await stats();assert(counters.calls<180&&counters.geometries===1&&counters.textures<=2&&counters.triangles<40000,JSON.stringify(counters));report.resources.push({width,cycle,...counters});
   if(cycle===0){await play(width);await settle();row.images.result=await shot('result-'+width);assert.deepEqual(await page.locator('#signalResultActions button').allTextContents(),[COPY['zh-Hant'].stages,COPY['zh-Hant'].next,COPY['zh-Hant'].replay]);const actions=await box('#signalResultActions'),card=await box('#signalResultCard');assert(actions.y+actions.height<=card.y+card.height-4,'Result actions visible inside card');for(let t=0;t<5;t++){await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.getElementById('signalResult').contains(document.activeElement)));}
    await page.locator('#resultReplay').click();await page.waitForSelector('#signalResult:not([hidden])',{timeout:18000});assert.equal(await page.locator('#signalResultTitle').textContent(),COPY['zh-Hant'].failure);assert(await page.locator('#resultNext').isDisabled());row.images.failure=await shot('failure-'+width);await page.locator('#resultStages').click();assert.equal(await page.locator('#arena canvas').count(),0);
   }else{
    await page.waitForFunction(()=>['leftCue','rightCue'].some(id=>document.getElementById(id).textContent==='◆'));const key=await page.locator('#leftCue').textContent()==='◆'?'ArrowLeft':'ArrowRight';await page.keyboard.press(key);const after=await geometry();for(const k of ['arena','left','right','controls'])for(const prop of ['x','y','width','height'])assert(Math.abs(before[k][prop]-after[k][prop])<=1,'stable '+k+prop);
    await page.locator('#help').click();const bar=await box('#timeTrack i');await page.waitForTimeout(700);const frozen=await box('#timeTrack i');assert(Math.abs(bar.width-frozen.width)<1);await page.locator('#overlayActions button:first-child').click();await exitBattle();
   }
   await page.locator('#stageScene [data-wp-return]').click();await settle();const returned=await page.evaluate(inspectScreenLifecycle,selectors);
   for(const key of ['main','poster','summary','progress','start','guide']){assert.equal(returned.nodes[key].identity,mainBefore.nodes[key].identity,'permanent '+key);for(const prop of ['left','top','width','height'])assert(Math.abs(returned.nodes[key].rect[prop]-mainBefore.nodes[key].rect[prop])<=1,key+' '+prop);}
   assert.equal(returned.returns.filter(r=>r.visible).length,1);assert(returned.returns.find(r=>r.visible).images.length===1);assert(returned.nodes.guide.rect.top>=returned.nodes.start.rect.bottom);row.cycles.push('PASS');save();
  }
  console.log('VIEWPORT_PASS',width,height);
 }
 assert.equal(new Set(report.resources.map(r=>r.geometries+':'+r.textures)).size,1,'five-entry renderer resource plateau');
 checkSource();report.viewportStatus='PASS';save();
 await page.setViewportSize({width:390,height:844});
 const locales={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
 for(const [segment,language]of Object.entries(locales)){
  await page.goto(origin+'/'+segment+'/games/signal-snap/');await ready();const c=COPY[language];assert.equal(await page.locator('meta[name="weightplay-game-version"]').getAttribute('content'),'v3');assert((await page.locator('.game-page-info').textContent()).includes(c.chargeGuide));assert.equal(await page.locator('[data-wp-frame-summary]').textContent(),c.tap+' · '+c.hold);await enter();
  // Withhold ordinary input until three genuine signals are missed. A fixed
  // burst of keys can correctly hit cues and is not a deterministic failure.
  await page.waitForSelector('#signalResult:not([hidden])',{timeout:25000});assert.equal(await page.locator('#signalResultTitle').textContent(),c.failure);assert.deepEqual(await page.locator('#signalResultActions button').allTextContents(),[c.stages,c.next,c.replay]);if(segment==='ar'){assert.equal(await page.locator('html').getAttribute('dir'),'rtl');report.arabicImage=await shot('arabic-result');}report.locales.push(segment);save();
 }
 checkSource();assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);report.status='PASS';save();
 console.log(JSON.stringify({status:report.status,viewports:report.sizes.length,cycles:report.sizes.reduce((n,r)=>n+r.cycles.length,0),locales:report.locales.length,resourceSample:report.resources[0],output:out,source:source.fingerprint}));
}catch(error){report.status='FAIL';report.error=error.stack;save();console.error('VERIFY_FAILED',error.message,'REPORT',out);throw error;}
finally{if(context)await context.close();await browser.close();}
