import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {localTestOrigin,localTestBrowserArgs,installLocalTestNetworkPolicy} from '../../../scripts/local-test-network-policy.mjs';
import {runCheckpointedChecks,checkFingerprint} from '../../../scripts/lib/game-check-checkpoint.mjs';
import {screenLifecycleSourceState,installScreenLifecycleObservation,inspectScreenLifecycle,readScreenLifecycleWriters} from '../../../scripts/lib/screen-lifecycle-observer.mjs';

const game='hangman',runner='games/hangman/tests/lifecycle.mjs';
const source=screenLifecycleSourceState(process.cwd(),game,runner);
const directory=path.join(os.tmpdir(),'weightplay-hangman-screen-lifecycle');
fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'source.json'),JSON.stringify(source));
const selectors={main:'#mainScreen',battle:'#battleScreen',mainReturn:'[data-wp-return="main"]',battleReturn:'[data-wp-return="battle"]',mainHeader:'[data-wp-frame-header="main"]',battleHeader:'[data-wp-frame-header="battle"]',poster:'#mainScreen .preview-art',summary:'#objective',start:'#startBtn',guide:'.game-page-info',field:'#board',tools:'.hangman-native-actions',hud:'[data-wp-frame-stat]',result:'#resultScreen',resultActions:'#resultScreen .result-actions',leave:'#hangmanLeave'};
const names=['Main permanent return and artwork','Main slots/Guide/Start/settings','Stage not applicable','Native Battle letter/Hint/restart/rootlock/isolation','Returned Stage not applicable','Returned Main geometry/ownership','Two uninterrupted reload-free journeys','Five timed checkpoints at ten stops','Leave/Continue/Escape/natural Result/Replay/Main'];
const close=(a,b)=>['left','top','width','height'].every(key=>Math.abs(a[key]-b[key])<=1);
const {default:pw}=await import(pathToFileURL(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js')));
const browser=await pw.chromium.launch({headless:true,args:localTestBrowserArgs});

async function run(viewport){
 const context=await browser.newContext({viewport,hasTouch:true,isMobile:viewport.width<1000,serviceWorkers:'block'});
 await installLocalTestNetworkPolicy(context);await context.addInitScript(installScreenLifecycleObservation);
 const page=await context.newPage();page.setDefaultTimeout(10000);const client=await context.newCDPSession(page);await client.send('Debugger.enable');
 const record={game,source:source.fingerprint,viewport,items:names.map((name,index)=>({item:index+1,name,status:'NOT_RUN'})),checkpoints:[],errors:[]};
 const file=path.join(directory,`${viewport.width}x${viewport.height}.json`),save=()=>fs.writeFileSync(file,JSON.stringify(record));
 let navigations=0;page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++;});page.on('pageerror',error=>record.errors.push(error.message));
 try{
  await page.goto(`${localTestOrigin()}/en/games/${game}/`,{waitUntil:'networkidle'});await page.locator('#startBtn').waitFor();await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);
  const snap=()=>page.evaluate(inspectScreenLifecycle,selectors),initial=await snap();
  const identities=Object.fromEntries(Object.entries(initial.nodes).map(([key,node])=>{assert(node,`Missing ${key}`);return[key,{identity:node.identity,parent:node.parent}];}));
  const ownership={},geometry={},automationSources=new Map();
  record.applicability={stage:'NOT_APPLICABLE_EXISTING_DIRECT_MAIN_BATTLE_NO_STAGE',collection:'NATIVE_POPULAR_ENGINE_TRACKED_REWARD_APPLICABILITY_PENDING',background:'NATIVE_VISIBILITY_NOT_CONFIRMED_IN_SEPARATE_HOST_OBSERVATIONS'};
  assert.equal(await page.locator('#stageScreen,[data-wp-frame-scene="stage"]').count(),0);
  const extra=()=>page.evaluate(()=>{
   const rect=node=>node.getBoundingClientRect().toJSON(),root=document.getElementById('battleScreen');
   return{phase:document.body.dataset.screen,frame:document.getElementById('popularArcade').dataset.wpFrameActive,version:document.body.dataset.gameVersion,meta:document.querySelector('meta[name="weightplay-game-version"]').content,guideRelated:document.querySelector('.game-page-info').dataset.wpRelatedGuideReady,feedback:rect(document.getElementById('gameMessage')),board:rect(document.querySelector('.hangman-word')),scale:parseFloat(getComputedStyle(root).getPropertyValue('--wp-battle-canvas-scale'))||1,canvas:root.hasAttribute('data-wp-logical-battle-canvas'),focusInBattle:!!document.activeElement.closest('#battleScreen'),wallet:localStorage.getItem('weightplayCastleV1'),rewardMarkers:document.querySelectorAll('[data-wp-result-get-icon]').length,paint:[...document.querySelectorAll('[data-wp-return]')].map(node=>{const icon=node.querySelector('.wp-frame-back-icon');const css=getComputedStyle(icon);return{scene:node.dataset.wpReturn,mask:css.maskImage,paint:css.maskImage!=='none'?css.backgroundColor:css.color,href:node.getAttribute('href')};})};
  });
  async function settle(label,scene,substate='live'){
   const key=scene+':'+substate,first=await snap(),firstExtra=await extra(),started=Date.now();
   async function sample(checkpoint){
    const state=await snap(),details=await extra(),raw=await readScreenLifecycleWriters(client,selectors);
    const actor=Object.values(raw).flat().find(value=>value.startsWith('__playwright_global_listeners_check__:'))?.split(':')[1];
    if(actor&&!automationSources.has(actor)){const{scriptSource}=await client.send('Debugger.getScriptSource',{scriptId:actor});assert(scriptSource.includes('_setupGlobalListenersRemovalDetection')&&scriptSource.includes('__playwright_global_listeners_check__'));automationSources.set(actor,crypto.createHash('sha256').update(scriptSource).digest('hex'));}
    for(const [name,node]of Object.entries(state.nodes)){assert.equal(node.identity,identities[name].identity,`${label}/${name} identity`);assert.equal(node.parent,identities[name].parent,`${label}/${name} parent`);assert(close(node.rect,first.nodes[name].rect),`${label}/${checkpoint}/${name} delayed geometry`);}
    assert(close(details.feedback,firstExtra.feedback),'Feedback changed its assigned track');assert(close(details.board,firstExtra.board),'Primary board geometry drift');
    assert.equal(details.frame,scene);assert.equal(details.version,details.meta);assert.equal(state.nodes.main.visible,scene==='main');assert.equal(state.nodes.battle.visible,scene==='battle');
    assert.equal(state.nodes.guide.visible,scene==='main');assert.equal(state.nodes.leave.visible,substate==='leave');assert.equal(state.nodes.result.visible,substate==='result');
    if(scene==='main'){
     assert(state.nodes.guide.rect.top>=state.nodes.main.rect.bottom-1,'Guide overlaps complete Main');assert.equal(state.scroll.y,0);assert(!details.canvas,'Inactive Battle retains logical ownership');
     if(viewport.width===390)assert(state.nodes.start.rect.bottom<=viewport.height+1);
    }else{
     const box=state.nodes.battle.rect;assert(Math.abs(box.width-Math.min(viewport.width,920))<=1);assert(Math.abs(box.height-viewport.height)<=1);assert(Math.abs(box.left-(viewport.width-box.width)/2)<=1);assert(Math.abs(box.top)<=1);assert(details.canvas);assert.equal(state.scroll.y,0);assert.equal(state.root.htmlOverflow,'hidden');assert.equal(state.root.bodyOverflow,'hidden');assert.equal(state.root.htmlOverscroll,'none');
    }
    const returns=state.returns.filter(node=>node.visible),covered=substate!=='live';assert.equal(returns.length,covered?0:1);
    if(!covered){const back=returns[0];assert.equal(back.scene,scene);assert.equal(back.arrow,'←');assert.equal(back.images.length,scene==='main'?1:0);assert(back.images.every(image=>image.complete&&image.naturalWidth>0));const paint=details.paint.find(node=>node.scene===scene);assert(paint.mask!=='none');assert(!/rgba\([^)]*,\s*0\)/.test(paint.paint),'Transparent return paint');if(scene==='main'){const destination=new URL(paint.href,localTestOrigin());assert.equal(destination.origin,localTestOrigin());assert.equal(destination.pathname,'/en/');}}
    const actorObserver=observer=>actor&&observer.source.split('\n')[0].includes('InjectedScript._setupGlobalListenersRemovalDetection (<anonymous>:');
    const normalize=rules=>rules.map(rule=>rule.startsWith('inline|')?'inline|'+rule.slice(7).split(';').map(v=>v.trim()).filter(Boolean).sort().join(';'):rule);
    const packet={nodes:Object.fromEntries(Object.entries(state.nodes).map(([name,node])=>[name,{identity:node.identity,parent:node.parent,matched:normalize(node.matched)}])),observers:state.observers.filter(o=>!actorObserver(o)).map(o=>({...o,source:o.source.split('\n')[0]})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),listeners:Object.fromEntries(Object.entries(raw).map(([name,list])=>[name,list.filter(value=>value.split(':')[1]!==actor)])),paint:details.paint};
    if(ownership[key]){if(checkFingerprint(packet)!==checkFingerprint(ownership[key])){record.failedOwnership={key,label,checkpoint,actual:packet,baseline:ownership[key]};save();throw Error(`${label}/${checkpoint}: ownership drift`);}}else ownership[key]=packet;
    if(geometry[key])for(const [name,node]of Object.entries(state.nodes)){if(!close(node.rect,geometry[key][name])){record.failedGeometry={label,checkpoint,name,actual:node.rect,baseline:geometry[key][name]};save();throw Error(`${label}/${checkpoint}/${name} roundtrip geometry`);}}else geometry[key]=Object.fromEntries(Object.entries(state.nodes).map(([name,node])=>[name,node.rect]));
    assert.equal(navigations,1);record.checkpoints.push({label,checkpoint,scene,substate,ownership:checkFingerprint(packet),geometry:Object.fromEntries(Object.entries(state.nodes).map(([name,node])=>[name,node.rect])),returns:state.returns,details,testActor:actor?{scriptId:actor,sha256:automationSources.get(actor),listeners:Object.fromEntries(Object.entries(raw).map(([name,list])=>[name,list.filter(value=>value.split(':')[1]===actor)])),observers:state.observers.filter(actorObserver)}:null});save();
   }
   await sample('immediate');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await sample('two-rAF');
   for(const ms of[300,1000,5000]){await page.waitForTimeout(Math.max(0,ms-(Date.now()-started)));await sample(`${ms}ms`);}
   if(['initial-main','cycle-1-battle','natural-win-result'].includes(label))await page.screenshot({path:path.join(directory,`${label}-${viewport.width}.png`)});
  }
  const back=()=>page.locator('#battleScreen [data-wp-return="battle"]');
  const values=()=>page.locator('#controls .letter').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent,used:node.getAttribute('aria-pressed')})));
  async function touchRootlock(){
   const before=await values(),box=await page.locator('#gameMessage').boundingBox();
   const x=Math.min(viewport.width-8,Math.max(8,box.x+box.width/2)),y=Math.min(viewport.height-12,Math.max(12,box.y+box.height/2));
   for(const direction of[-1,1]){
    await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(let step=1;step<=6;step++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:Math.min(viewport.height-4,Math.max(4,y+direction*step*18)),id:1}]});
    await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   }
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.deepEqual(await values(),before,'Touch drag changed native board');
   const scroll=await page.evaluate(()=>({x:scrollX,y:scrollY,html:document.documentElement.scrollTop,body:document.body.scrollTop}));
   assert.deepEqual(scroll,{x:0,y:0,html:0,body:0});assert.equal(navigations,1);record.touchRootlock={nativeCDPTouch:true,gestures:2,scroll,boardUnchanged:true};
  }
  async function settings(){
   const before=await snap(),button=page.locator('[data-wp-settings]:visible');assert.equal(await button.count(),1);await button.click();const panel=page.locator('.wp-frame-popover:visible');assert.equal(await panel.count(),1);const sound=panel.locator('[role="switch"]');assert.equal(await sound.count(),1);const first=await sound.getAttribute('aria-checked');await sound.click();assert.notEqual(await sound.getAttribute('aria-checked'),first);await sound.click();assert.equal(await sound.getAttribute('aria-checked'),first);
   const box=await panel.boundingBox();assert(box.x>=-1&&box.x+box.width<=viewport.width+1);await page.keyboard.press('Escape');assert(await panel.isHidden());assert(await button.evaluate(node=>node===document.activeElement));const after=await snap();for(const key of['main','battle','poster','start','tools'])assert(close(before.nodes[key].rect,after.nodes[key].rect),'Settings changed sibling geometry');
  }
  await settle('initial-main','main');await settings();record.items[0].status=record.items[1].status='PASS';record.items[2].status=record.items[4].status='NOT_APPLICABLE';
  for(let cycle=1;cycle<=2;cycle++){
   await page.locator('#startBtn').click();await page.locator('#controls .letter[data-value="A"]').click();await settle(`cycle-${cycle}-battle`,'battle');await settings();
   await page.locator('#hintBtn').click();assert(await page.locator('#hintBtn').isDisabled());assert.equal(await page.locator('.hangman-slot.revealed').count(),1);const before=await values();await touchRootlock();
   await back().click();await settle(`cycle-${cycle}-leave`,'battle','leave');await page.keyboard.press('Escape');assert.deepEqual(await values(),before);assert(await back().evaluate(node=>node===document.activeElement));await back().click();await page.locator('#hangmanContinue').click();assert.deepEqual(await values(),before);await back().click();await page.locator('#hangmanLeaveMain').click();await settle(`cycle-${cycle}-returned-main`,'main');
  }
  await page.locator('#startBtn').click();for(const letter of['P','U','Z','L','E'])await page.locator(`#controls .letter[data-value="${letter}"]`).click();await page.locator('#resultScreen').waitFor({state:'visible'});await settle('natural-win-result','battle','result');assert.equal(await page.locator('#resultScreen').getAttribute('data-outcome'),'win');assert.equal(await page.locator('[data-wp-result-get-icon]').count(),1);assert.equal(await page.locator('.wpb-toast[data-wpb-reward-game="hangman"]').count(),0);
  await page.locator('#retryBtn').click();await settle('native-replay-battle','battle');assert(await page.evaluate(()=>document.activeElement.matches('#controls .letter:not([aria-pressed="true"])')),'Replay focus outside active board');assert((await values()).every(value=>value.used==='false'));
  await page.locator('#controls .letter[data-value="A"]').click();assert((await values()).some(value=>value.used==='true'));await page.locator('#restartBtn').click();assert((await values()).every(value=>value.used==='false'),'Native Restart did not clear board');record.nativeRestart='PASS';
  await back().click();await settle('final-native-main','main');
  assert.equal(record.checkpoints.length,50);assert.deepEqual(record.errors,[]);assert.equal(screenLifecycleSourceState(process.cwd(),game,runner).fingerprint,source.fingerprint,'SOURCE_CHANGED_DURING_MATRIX');record.ownership=ownership;record.status='PASS';for(const item of record.items)if(item.status==='NOT_RUN')item.status='PASS';save();return{evidence:file};
 }catch(error){record.status='FAIL';record.failure={message:error.message,stack:error.stack};save();await page.screenshot({path:path.join(directory,`failure-${viewport.width}.png`)}).catch(()=>{});throw error;}finally{await client.detach().catch(()=>{});await context.close();}
}
try{
 const width=process.argv.find(value=>value.startsWith('--width='))?.split('=')[1];
 const units=[[390,844],[612,876],[844,390],[1280,720],[1920,1080]].filter(([w])=>!width||w===Number(width)).map(([width,height])=>({id:`${width}x${height}`,data:{width,height},dependencies:{source:source.fingerprint},run:()=>run({width,height})}));
 const result=await runCheckpointedChecks({file:path.join(directory,'checkpoint.json'),gameId:game,scope:'HANGMAN_NATIVE_SCREEN_LIFECYCLE',units});console.log(JSON.stringify({status:result.status,directory,source:source.fingerprint,units:result.units}));
}finally{await browser.close();}
