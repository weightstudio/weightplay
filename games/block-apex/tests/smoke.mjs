// Supervised local-browser smoke. This does not grant QA, art or publish acceptance.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(!process.env.CODEX_THREAD_ID)throw new Error('Bind the real Codex thread/resource supervisor before running browser work.');
const base=new URL(process.argv[2]||'http://127.0.0.1:8798');
if(!['127.0.0.1','localhost','[::1]'].includes(base.hostname)||!['http:','https:'].includes(base.protocol))throw new Error('LOCAL_ORIGIN_ONLY');
const output=resolve(process.env.APEX_EVIDENCE_DIR||`/tmp/block-apex-smoke-${Date.now()}`);
if(!output.startsWith('/tmp/'))throw new Error('Evidence belongs under /tmp, not in the repository.');
await mkdir(output,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const runs=[],matrix=[['desktop','en',1280,900],['portrait','zh-Hant',390,844],['landscape','ja',844,390],['narrow-rtl','ar',360,740]];
try{
  for(const [name,locale,width,height]of matrix){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<900});
    await context.route('**/*',route=>{
      const url=new URL(route.request().url());
      return url.origin===base.origin||['data:','blob:'].includes(url.protocol)?route.continue():route.abort();
    });
    const page=await context.newPage(),errors=[],missing=[];page.setDefaultTimeout(15000);
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.url().startsWith(base.origin)&&response.status()>=400)missing.push(`${response.status()} ${response.url()}`);});
    try{
      const url=new URL('/games/block-apex/',base);url.searchParams.set('lang',locale);
      await page.goto(url.href,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.body.dataset.apexBooted==='true');
      assert.equal(await page.locator('#bootError').isVisible(),false);
      assert.equal(await page.locator('#localeSelect option').count(),13);
      assert.equal(await page.locator('html').getAttribute('lang'),locale);
      await page.waitForFunction(()=>{const image=document.querySelector('#poster');return !image.hidden&&image.naturalWidth>0;});
      await page.screenshot({path:resolve(output,`${name}-main.png`),fullPage:true});
      await page.locator('#start').click();
      await page.waitForFunction(()=>window.BlockApex.snapshot().screen==='stage');
      assert.equal(await page.locator('#stageRail > button').count(),9);
      assert.equal(await page.locator('#stageScreen > [data-wp-frame-stage-nav]').count(),1);
      await page.locator('#garageTab').click();assert.equal(await page.locator('#vehicles > button').count(),4);
      await page.locator('#tuningTab').click();assert.equal(await page.locator('#upgrades > button').count(),3);
      await page.locator('#stagesTab').click();
      await page.screenshot({path:resolve(output,`${name}-stage.png`)});
      await page.locator('#stageRail [data-stage="1"]').click();
      await page.waitForFunction(()=>window.BlockApex.snapshot().modal==='pause'||window.BlockApex.snapshot().modal==='error');
      assert.notEqual(await page.evaluate(()=>window.BlockApex.snapshot().modal),'error');
      await page.locator('#continue').click();
      await page.waitForFunction(()=>window.BlockApex.snapshot().status==='running');
      await page.waitForFunction(()=>window.BlockApex.snapshot().player.speed>1);
      assert.equal(await page.locator('#battleHeader #hudStats').count(),1);
      assert.equal(await page.locator('#battleHeader [data-wp-frame-stat]').count(),3);
      assert.equal(await page.locator('#battleHeader [data-wp-frame-title]').isVisible(),false);
      const snapshot=await page.evaluate(()=>window.BlockApex.snapshot());
      assert.ok(snapshot.resources.drawCalls>0);assert.ok(snapshot.resources.triangles>0);
      await page.screenshot({path:resolve(output,`${name}-battle.png`)});
      await page.keyboard.press('Escape');await page.waitForFunction(()=>window.BlockApex.snapshot().modal==='pause');
      const before=await page.evaluate(()=>window.BlockApex.snapshot().time);
      await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>window.BlockApex.snapshot().time),before);
      await page.keyboard.press('Escape');await page.waitForFunction(()=>window.BlockApex.snapshot().modal===null);
      await page.waitForFunction(()=>window.BlockApex.snapshot().time>0);
      await page.locator('#battleHeader [data-wp-settings]').click();
      await page.waitForFunction(()=>window.BlockApex.snapshot().status==='paused');
      await page.keyboard.press('Escape');await page.waitForFunction(()=>window.BlockApex.snapshot().status==='running');
      await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
      await page.waitForFunction(()=>window.BlockApex.snapshot().modal==='pause');
      await page.locator('#leave').click();await page.waitForFunction(()=>window.BlockApex.snapshot().screen==='stage');
      assert.equal(await page.evaluate(()=>window.BlockApex.snapshot().resources.renderer),false);
      assert.equal(await page.evaluate(()=>window.BlockApex.snapshot().raf),false);
      await page.locator('#stageRail [data-stage="1"]').click();
      await page.waitForFunction(()=>window.BlockApex.snapshot().status==='running');
      await page.evaluate(()=>{
        const gl=document.querySelector('#arena').getContext('webgl2');const extension=gl?.getExtension('WEBGL_lose_context');
        if(!extension)throw new Error('CONTEXT_LOSS_TEST_UNAVAILABLE');extension.loseContext();
      });
      await page.waitForFunction(()=>window.BlockApex.snapshot().modal==='error');
      await page.locator('#errorRetry').click();await page.waitForFunction(()=>window.BlockApex.snapshot().status==='running');
      await page.keyboard.press('Escape');await page.locator('#leave').click();
      await page.locator('#stageBack').click();
      assert.deepEqual(missing,[]);assert.deepEqual(errors,[]);
      runs.push({name,locale,width,height,status:'smoke-complete-not-QA',firstRaceMetrics:snapshot.resources});
    }catch(error){
      await page.screenshot({path:resolve(output,`${name}-failure.png`),fullPage:true}).catch(()=>{});
      runs.push({name,status:'failed',error:error.message,errors,missing});throw error;
    }finally{await context.close();}
  }
}finally{
  await browser.close();await writeFile(resolve(output,'smoke.json'),JSON.stringify({formalAcceptance:false,runs},null,2));
}
console.log(`Local smoke evidence: ${output}`);
