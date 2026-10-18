// Engineering breadth only: this never grants gameplay QA or all-stage completion.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {installLocalTestNetworkPolicy,localTestBrowserArgs} from '../../../scripts/local-test-network-policy.mjs';

const root=process.cwd(),base='http://127.0.0.1:8768';
const candidates=[path.join(root,'node_modules/playwright/index.js'),path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')];
const playwrightModule=await import(pathToFileURL(candidates.find(fs.existsSync)).href);
const {chromium}=playwrightModule.default||playwrightModule;
const executablePath=['/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromium.executablePath()].find(fs.existsSync);
const output=path.join(os.tmpdir(),'space-rocks-v23-engineering');fs.mkdirSync(output,{recursive:true});
const report={gameId:'space-rocks',gameVersion:'v23',interfaceVersion:'7',completeGameAcceptance:false,allStageCompletion:false,viewports:[],stageBoots:[],locales:[],resources:[],errors:[]};
const sourcePaths=['games/space-rocks/analytics-ownership.js','games/space-rocks/game.js','games/space-rocks/locales.js','games/space-rocks/render3d.mjs','games/space-rocks/art.css'];
const source=()=>Object.fromEntries(sourcePaths.map(file=>[file,createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
report.source=source();
const browser=await chromium.launch({headless:true,executablePath,args:localTestBrowserArgs});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:1});
await installLocalTestNetworkPolicy(context);
const page=await context.newPage();page.setDefaultTimeout(10000);
page.on('pageerror',error=>report.errors.push(error.message));
page.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))report.errors.push(`${r.status()} ${new URL(r.url()).pathname}`);});
page.on('dialog',async dialog=>{
  if(dialog.type()==='prompt'&&dialog.message()==='Local practice password'){
    const password=/Password:\s*`([^`]+)`/.exec(fs.readFileSync('docs/local-practice-credentials.md','utf8'))?.[1];
    assert.ok(password);await dialog.accept(password);
  }else await dialog.dismiss();
});
async function ready(locale='en',query=''){
  await page.goto(`${base}/${locale}/games/space-rocks/${query}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.SpaceRocksRenderStats&&document.querySelector('#loadingPanel').hidden);
}
async function pauseLive(){
  if(await page.locator('#pauseDialog').isVisible())await page.locator('#continueBtn').click();
  await page.locator('#battleBack').click();
  await page.waitForTimeout(80);
}
const rect=async selector=>{const b=await page.locator(selector).boundingBox();assert.ok(b,selector+' has a rectangle');return b;};
try{
  for(const [width,height]of[[390,844],[612,876],[844,390],[1280,720],[1920,1080]]){
    await page.setViewportSize({width,height});await ready('zh-tw');
    const poster=await rect('.sc-hero img');assert.ok(Math.abs(poster.width-poster.height)<2,'square Main poster');
    if(width>=700)assert.ok(Math.abs(poster.width-420)<2,`420px desktop poster: ${JSON.stringify({width,height,poster})}`);
    const prefix=`${width}x${height}`;
    await page.screenshot({path:path.join(output,prefix+'-main.png')});
    await page.locator('#startBtn').click();await page.waitForTimeout(320);
    assert.equal(await page.locator('#stageRail .stage-card').count(),9);
    await page.screenshot({path:path.join(output,prefix+'-stage.png')});
    await page.locator('[data-stage-index="0"]').click();await pauseLive();
    const back=await rect('#battleBack');assert.ok(back.width>=44&&back.height>=44,'shared physical return target');
    const world=await rect('#gameCanvas');
    const envelope=await rect('[data-wp-logical-battle-canvas]');
    const border=await page.locator('[data-wp-logical-battle-canvas]').evaluate(n=>{const s=getComputedStyle(n);return parseFloat(s.borderLeftWidth)+parseFloat(s.borderRightWidth);});
    assert.ok(Math.abs(envelope.width-Math.min(width,920))<2,'full-width Battle envelope');
    assert.ok(Math.abs(world.width-(envelope.width-border))<2,'playfield fills the shared bordered content track');
    const clock=await page.locator('#timeValue').textContent();await page.waitForTimeout(300);assert.equal(await page.locator('#timeValue').textContent(),clock,'pause freezes timer');
    await page.locator('#continueBtn').click();await page.locator('#shieldBtn').click();await page.keyboard.press('Space');
    await page.waitForTimeout(140);await page.locator('#battleBack').click();
    await page.screenshot({path:path.join(output,prefix+'-battle.png')});
    const stats=await page.evaluate(()=>window.SpaceRocksRenderStats());assert.equal(stats.threeRevision,'180');assert.ok(stats.calls<=180,'draw-call design budget');
    report.viewports.push({width,height,poster,returnTarget:back,world,stats,result:'PASS'});
  }
  console.log('Viewport matrix: 5/5');
  await page.setViewportSize({width:390,height:844});
  for(let stage=1;stage<=30;stage++){
    await ready('zh-tw',`?practice=1&practiceStage=${stage}`);
    await page.locator('#battleScreen').waitFor({state:'visible'});
    await pauseLive();
    const mission=await page.locator('#missionLabel').textContent();assert.ok(mission.startsWith(String(stage).padStart(2,'0')),'exact stage selected');
    const stats=await page.evaluate(()=>window.SpaceRocksRenderStats());assert.equal(stats.threeRevision,'180');assert.ok(stats.calls<=180);
    const normalSave=await page.evaluate(()=>localStorage.getItem('weightplay:space-rocks:campaign:1'));assert.equal(normalSave,null,'practice did not create campaign progress');
    report.stageBoots.push({stage,mission,stats,result:'BOOT_AND_RENDER_PASS'});
    if([5,10,15,20,25,30].includes(stage))await page.screenshot({path:path.join(output,`boss-${stage}.png`)});
    if(stage%10===0)console.log(`Stage boot/render: ${stage}/30 (not completion)`);
  }
  // A real rules-driven auto-fire clear checks Result layout. This is not hand-play evidence.
  await ready('en','?practice=1&practiceStage=2');
  await page.locator('#resultScreen').waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('#nextBtn').isEnabled(),true);
  assert.equal(await page.locator('.sc-result-actions button').count(),3);
  await page.screenshot({path:path.join(output,'390x844-result.png')});
  for(let cycle=0;cycle<5;cycle++){
    await page.locator('#retryBtn').click();await pauseLive();
    report.resources.push(await page.evaluate(()=>window.SpaceRocksRenderStats()));
    await page.locator('#continueBtn').click();
    await page.locator('#resultScreen').waitFor({state:'visible',timeout:30000});
  }
  assert.equal(new Set(report.resources.map(r=>r.geometries)).size,1,'geometry plateau across five replays');
  assert.equal(new Set(report.resources.map(r=>r.textures)).size,1,'texture plateau across five replays');
  console.log('Replay resources: bounded across 5 cycles');
  for(const locale of['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar']){
    await ready(locale);const start=await page.locator('#startBtn').textContent();const guide=await page.locator('.sc-guide').textContent();
    assert.ok(start.length>1&&guide.length>50&&!guide.includes('undefined'));
    await page.locator('#startBtn').click();await page.waitForTimeout(80);await page.locator('#stageBack').click();
    report.locales.push({locale,start,result:'PASS'});
    if(locale==='ar')await page.screenshot({path:path.join(output,'arabic-main.png')});
  }
  assert.deepEqual(source(),report.source,'source remained stable throughout engineering checks');
  assert.deepEqual(report.errors,[]);
  report.outcome='PASS';console.log('Locale round trips: 13/13; no page/resource errors');
}catch(error){report.outcome='FAIL';report.failure=error.message;console.error(error.message);process.exitCode=1;}
finally{
  fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(report,null,2));
  await context.close();await browser.close();
  console.log(`Engineering summary: ${path.join(output,'summary.json')}`);
}
