// Local public-path regression: Mac's case-insensitive filesystem must not hide
// /Assets requests that fail after the publish pipeline merges into /assets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {localTestBrowserArgs,installLocalTestNetworkPolicy} from '../../../scripts/local-test-network-policy.mjs';

assert.match(process.env.CODEX_THREAD_ID||'',/^[0-9a-f-]{36}$/);
const root=fileURLToPath(new URL('../../../',import.meta.url));
const out=fs.mkdtempSync(path.join(os.tmpdir(),'apex-poster-check-'));
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  let pathname=decodeURIComponent(url.pathname);
  if(/^\/Assets(?:\/|$)/.test(pathname)){res.writeHead(404);res.end('Public asset paths are lowercase');return;}
  if(pathname.endsWith('/'))pathname+='index.html';
  const filename=path.resolve(root,'.'+pathname);
  if(!filename.startsWith(root)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end();return;}
  // Lowercase is also significant in the thumbnail filename on the public host.
  if(pathname.startsWith('/assets/')&&pathname.split('/').some(p=>p==='Assets'||p.startsWith('Assets__'))){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(filename).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const modulePath=process.env.PLAYWRIGHT_MODULE||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js');
const imported=await import(pathToFileURL(modulePath));
let browser;
const results=[];
try{
  const pw=imported.default||imported;
  browser=await pw.chromium.launch({headless:true,args:localTestBrowserArgs});
  for(const [width,height]of [[390,844],[1280,720]]){
    const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
    await installLocalTestNetworkPolicy(context);
    try{
      const page=await context.newPage(),bad=[],errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.url().includes('block-apex')&&r.status()>=400)bad.push(`${r.status()} ${r.url()}`);});
      await page.goto(`${origin}/?preview=1`,{waitUntil:'domcontentloaded'});
      await page.locator('#gameSearch').fill('Block Apex');
      const card=page.locator('.upcoming-game-card[data-game-id="block-apex"]').first();
      await card.scrollIntoViewIfNeeded();
      const image=card.locator('.upcoming-game-art img');
      await image.evaluate(i=>i.decode());
      assert.equal(new URL(await image.getAttribute('src'),origin).pathname,'/assets/lobby-thumbs/w480/assets__block-apex-poster.webp');
      await card.screenshot({path:path.join(out,`lobby-${width}.png`)});
      await page.goto(`${origin}/games/block-apex/?lang=zh-Hant`,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.body.dataset.apexBooted==='true');
      const poster=page.locator('#poster');await poster.evaluate(i=>i.decode());
      assert.equal(new URL(await poster.getAttribute('src'),origin).pathname,'/assets/block-apex-poster.webp');
      assert.ok(await poster.isVisible());
      const rect=await poster.boundingBox();assert.ok(rect.width>100&&Math.abs(rect.width-rect.height)<1);
      await page.screenshot({path:path.join(out,`main-${width}.png`)});
      await page.locator('#start').click();
      await page.locator('#garageTab').click();
      await page.locator('#tuningTab').click();
      for(const icon of await page.locator('#upgrades img').all())await icon.evaluate(i=>i.decode());
      await page.locator('#stageBack').click();assert.ok(await poster.isVisible());
      assert.deepEqual(bad,[]);assert.deepEqual(errors,[]);
      // Static Main poster must survive a failed controller/engine module load.
      const cold=await context.newPage();
      await cold.route('**/*.mjs',route=>route.abort());
      await cold.goto(`${origin}/games/block-apex/?lang=zh-Hant`,{waitUntil:'domcontentloaded'});
      await cold.locator('#poster').evaluate(i=>i.decode());
      assert.ok(await cold.locator('#poster').isVisible());
      results.push({width,height,lobby:true,main:true,garageIcons:true,return:true,controllerUnavailablePoster:true});
    }finally{await context.close();}
  }
  console.log(JSON.stringify({status:'PASS',formalAcceptance:false,publicCaseSensitivePaths:true,results,out}));
}finally{
  await browser?.close();await new Promise(resolve=>server.close(resolve));
}
