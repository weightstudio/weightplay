// Developer integration only: observe diagnostics, send native pointer/key input.
// A legacy-unlock fixture is confined to the isolated browser; no forced result.
import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import{pathToFileURL}from'node:url';
import{localTestOrigin,installLocalTestNetworkPolicy,localTestBrowserArgs}from'../../scripts/local-test-network-policy.mjs';
const{default:pw}=await import(pathToFileURL(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')));
const out=fs.mkdtempSync(path.join(os.tmpdir(),'breakout-v23-core-')),report={scope:'DEVELOPER_NATIVE_INPUT_REGRESSION',errors:[],evidenceDirectory:out};
const browser=await pw.chromium.launch({headless:true,args:localTestBrowserArgs});let context;
try{
 context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await installLocalTestNetworkPolicy(context);
 await context.addInitScript(()=>localStorage.setItem('weightplay_breakout_campaign_v18',JSON.stringify({highestUnlocked:5,cleared:[1,2,3,4]})));
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(localTestOrigin()+'/games/breakout/');await page.waitForFunction(()=>window.WPBreakoutDiagnostics);
 await page.locator('#startBtn').click();await page.locator('#stageRail .stage-card[aria-current="true"]').click();
 await page.waitForTimeout(300);const rect=await page.locator('#board').boundingBox();
 let offset=0,seed=5,previousVy=0,coreSeen=false;const deadline=Date.now()+130000;
 while(Date.now()<deadline){
  const s=await page.evaluate(()=>window.WPBreakoutDiagnostics.snapshot());assert.equal(s.stage,5);
  if(['won','lost'].includes(s.status)){report.result=s;break;}
  if(s.status==='ready')await page.keyboard.press('Space');
  const b=s.ball;if(previousVy>0&&b.vy<0){seed=(seed*1664525+1013904223)>>>0;offset=(seed/4294967296-.5)*s.paddle.width*.7;}previousVy=b.vy;
  const target=b.x+(b.vy>0?b.vx*.05-offset:0),span=Math.max((s.geometry.height+20)*rect.width/rect.height,s.geometry.width+16);
  await page.mouse.move(Math.max(rect.x+5,Math.min(rect.x+rect.width-5,rect.x+rect.width/2+(target-s.geometry.width/2)*rect.width/span)),rect.y+rect.height*.85);
  const label=await page.locator('#actionBtn').textContent();if(label.includes('100%'))await page.keyboard.press('Space');
  if(!coreSeen&&(await page.locator('#brickStatus').textContent()).includes('/')){coreSeen=true;report.coreExposed=await page.locator('#brickStatus').textContent();await page.screenshot({path:path.join(out,'core-exposed.png')});}
  await page.waitForTimeout(35);
 }
 assert(coreSeen,'Core visibly exposed after real brick clear');assert.equal(report.result?.status,'won');
 await page.screenshot({path:path.join(out,'core-clear.png')});
 // The old readiness bridge could fail after entering play before Main settled.
 assert.equal(await page.locator('[data-wp-game-entry-loader-active]').count(),0);
 assert.equal(await page.getByText('Game could not be loaded',{exact:true}).count(),0);
 assert.equal(report.errors.length,0);report.ok=true;
}catch(e){report.ok=false;report.failure=String(e.stack||e);process.exitCode=1;}finally{await context?.close();await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
