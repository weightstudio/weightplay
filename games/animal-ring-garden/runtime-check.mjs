// Supplemental implementation checks, run only through run-local-game-check.mjs.
// Native visible play is recorded separately; this fixture never grants progress.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {installLocalTestNetworkPolicy,localTestBrowserArgs,validateLocalTestUrl} from '../../scripts/local-test-network-policy.mjs';
import {closeBrowserSessionResources} from '../../scripts/lib/playwright-headed-window.mjs';
const origin=validateLocalTestUrl(process.env.WEIGHTPLAY_TEST_ORIGIN);
const modulePath=[path.resolve('node_modules/playwright/index.js'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')].find(fs.existsSync);
const {default:pw}=await import(pathToFileURL(modulePath));
const cache=path.join(os.homedir(),'Library/Caches/ms-playwright');
const versions=fs.readdirSync(cache).filter(n=>/^chromium-\d+$/.test(n)).sort((a,b)=>+b.slice(9)-+a.slice(9));
const executablePath=versions.flatMap(v=>fs.readdirSync(path.join(cache,v)).map(p=>path.join(cache,v,p,'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'))).find(fs.existsSync);
let browser,context;const report={game:'animal-ring-garden',version:'v24',kind:'supplemental-instrumented-runtime',resources:[],errors:[],checks:{}};
const output=path.join(os.tmpdir(),'weightplay-ring-01a163a3','runtime-report.json');
try{
  browser=await pw.chromium.launch({executablePath,headless:true,args:localTestBrowserArgs});
  context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'});
  await installLocalTestNetworkPolicy(context);
  await context.addInitScript(()=>{
    // Test-only observation of actual GPU object allocation/deletion.
    const live={},contexts=new Set();let draws=0,triangles=0,lossExtension;
    for(const type of ['Buffer','Texture','Program','Shader','Framebuffer','Renderbuffer','VertexArray'])live[type]=new Set();
    for(const C of [globalThis.WebGLRenderingContext,globalThis.WebGL2RenderingContext])if(C){
      for(const type of Object.keys(live))for(const op of ['create','delete']){
        const key=op+type,fn=C.prototype[key];if(!fn)continue;
        C.prototype[key]=function(...args){contexts.add(this);const result=fn.apply(this,args);if(op==='create'&&result)live[type].add(result);if(op==='delete')live[type].delete(args[0]);return result;};
      }
      for(const name of ['drawElements','drawArrays']){
        const fn=C.prototype[name];C.prototype[name]=function(...args){draws++;if(args[0]===this.TRIANGLES)triangles+=(name==='drawElements'?args[1]:args[2])/3;return fn.apply(this,args);};
      }
    }
    window.__ringRuntimeProbe={snapshot:()=>({contexts:contexts.size,draws,triangles,...Object.fromEntries(Object.entries(live).map(([k,v])=>[k,v.size]))}),lose:()=>{lossExtension=[...contexts][0].getExtension('WEBGL_lose_context');lossExtension.loseContext();},restore:()=>lossExtension.restoreContext()};
  });
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  const responses=[];page.on('response',r=>{if(r.url().includes('/assets/audio/'))responses.push({url:r.url(),status:r.status()});});
  await page.goto(origin+'/zh-tw/games/animal-ring-garden/',{waitUntil:'load'});
  const snap=()=>page.evaluate(()=>window.__ringRuntimeProbe.snapshot());
  const enter=async()=>{await page.locator('#startBtn').click();await page.locator('[data-stage-index="0"]').click();await page.waitForTimeout(120);};
  const settled=()=>page.waitForFunction(()=>!document.querySelector('#turn-right').disabled);
  const exit=async()=>{await page.locator('#battle-back').click();if(await page.locator('#leaveConfirm').isVisible())await page.locator('#ring-leave-stages').click();await page.locator('#stage-back').click();};
  await enter();
  const beforeRender=await snap();await page.locator('[data-select-ring="1"]').click();await page.waitForTimeout(100);const afterRender=await snap();
  report.renderBudget={drawCalls:afterRender.draws-beforeRender.draws,triangles:afterRender.triangles-beforeRender.triangles};
  assert(report.renderBudget.drawCalls>0&&report.renderBudget.drawCalls<200);assert(report.renderBudget.triangles<40000);
  await page.locator('[data-select-ring="0"]').click();
  const before=await page.evaluate(()=>WeightPlayAudio.stats());
  await page.locator('#turn-right').click();await settled();
  const after=await page.evaluate(()=>WeightPlayAudio.stats());
  assert(after.started>before.started);report.checks.semanticAudioStarted=true;
  assert(responses.some(r=>r.url.includes('/board/rotate.mp3')&&r.status===200));report.checks.rotateSample200=true;
  await page.locator('#undo-button').click();await exit();
  for(let i=0;i<6;i++){
    await enter();await page.locator('#turn-right').click();await settled();await page.locator('#reset-button').click();await settled();await exit();
    report.resources.push(await snap());
  }
  const fields=['contexts','Buffer','Texture','Program','Shader','Framebuffer','Renderbuffer','VertexArray'];
  for(const row of report.resources.slice(1))for(const key of fields)assert.equal(row[key],report.resources[0][key],key+' grew');
  report.checks.sixCycleResourcePlateau=true;
  const idle=await snap();await page.waitForTimeout(250);assert.equal((await snap()).draws,idle.draws);report.checks.noIdleRendering=true;
  await enter();
  await page.locator('#battleScreen [data-wp-settings]').click();await page.locator('#battleScreen .wp-frame-sound').click();await page.locator('#battleScreen [data-wp-settings]').click();
  assert(await page.evaluate(()=>WeightPlayAudio.isMuted()));const mutedBefore=await page.evaluate(()=>WeightPlayAudio.stats());
  await page.locator('#turn-right').click();await settled();assert.equal((await page.evaluate(()=>WeightPlayAudio.stats())).started,mutedBefore.started);report.checks.sharedMute=true;
  await page.locator('#undo-button').click();
  await page.locator('#turn-right').click();await page.evaluate(()=>window.__ringRuntimeProbe.lose());
  await page.waitForFunction(()=>document.querySelector('#ring-board').dataset.context==='lost');
  await page.evaluate(()=>window.__ringRuntimeProbe.restore());
  await page.waitForFunction(()=>document.querySelector('#ring-board').dataset.context!=='lost');
  await settled();await page.locator('#undo-button').click();assert.equal((await page.locator('#current-glyphs').innerText()).replace(/\s/g,''),'◆◆◆');report.checks.contextRestoredWithoutLostUndo=true;
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#turn-right').click();await settled();await page.locator('#undo-button').click();report.checks.reducedMotionInput=true;
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#turn-right').click();await settled();await page.locator('[data-select-ring="1"]').click();await page.locator('#turn-left').click();await settled();await page.locator('#turn-left').click();await settled();await page.locator('[data-select-ring="2"]').click();await page.locator('#turn-left').click();
  await page.waitForSelector('#result-panel:not([hidden])');await page.waitForTimeout(450);
  assert.equal(await page.locator('[data-wp-result-get-icon]').count(),1);
  await page.screenshot({path:path.join(path.dirname(output),'shared-reward-final.png')});
  const rewardBounds=await page.locator('.result-card').evaluate(el=>{const icon=el.querySelector('[data-wp-result-get-icon]').getBoundingClientRect(),label=el.children[2].getBoundingClientRect();return {icon:{x:icon.x,y:icon.y,width:icon.width,height:icon.height},label:{x:label.x,y:label.y,width:label.width,height:label.height},noOverlap:icon.left>=label.right||icon.bottom<=label.top};});
  assert(rewardBounds.noOverlap);report.checks.sharedRewardNoLabelOverlap=rewardBounds;
  assert.equal(report.errors.length,0);report.status='PASS';
}catch(error){report.status='FAIL';report.failure=String(error.stack||error);process.exitCode=1;}
finally{report.cleanup=await closeBrowserSessionResources({context,browser});fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,checks:report.checks,resources:report.resources,errors:report.errors,failure:report.failure,report:output,cleanup:report.cleanup}));}
