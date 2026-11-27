import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadTestBrowserRuntime } from '../../scripts/lib/test-browser-runtime.mjs?wp-media=8a3de24a47270269';
import { installLocalTestNetworkPolicy, localTestBrowserArgs, localTestOrigin } from '../../scripts/local-test-network-policy.mjs?wp-media=8a3de24a47270269';
import { gardenRoute } from '../../scripts/test-bloomlight-patrol.mjs?wp-media=8a3de24a47270269';
import { stages } from './stages.mjs?wp-media=8a3de24a47270269';
import { routes } from './copy.mjs?wp-media=8a3de24a47270269';

const folder = process.env.BLOOM_TEST_OUTPUT;
assert(folder, 'The supervised run requires BLOOM_TEST_OUTPUT under the OS temporary directory.');
const origin = new URL(localTestOrigin()).origin;
const record = join(folder, 'bloomlight-patrol-battle.webm');
const ffmpeg = process.env.WEIGHTPLAY_FFMPEG_EXECUTABLE || process.env.FFMPEG_PATH || 'ffmpeg';
const { playwright, executablePath } = await loadTestBrowserRuntime();
const browser = await playwright.chromium.launch({ executablePath,
  args: [...localTestBrowserArgs, '--use-angle=metal', '--enable-gpu'] });
const failures = [], pageErrors = [], localHttp = [], cases = [], screenshots = [];
const full = process.argv.includes('--campaign');
const continuation = Number(process.argv.find(value=>value.startsWith('--from='))?.slice(7) ?? 1);
const localeSweep = process.argv.includes('--locales');
const recordOnly = process.argv.includes('--record');
const matrix = process.argv.includes('--matrix');
const matrixFrom = Number(process.argv.find(value=>value.startsWith('--from-width='))?.slice(13) ?? 0);
const matrixOnly = Number(process.argv.find(value=>value.startsWith('--viewport='))?.slice(11) ?? 0);
const refreshLobbyArt = process.argv.includes('--refresh-lobby-art');
const artMatrix = process.argv.includes('--art-matrix');
const lesson = id => origin + '/en/games/bloomlight-patrol/?preview=1&practice=1&practiceStage=' + id;
const credentials = () => readFileSync('docs/local-practice-credentials.md','utf8').match(/^Password: \x60([^\x60]+)\x60$/m)?.[1];

async function open(width=390,height=844, reducedMotion='no-preference',hasTouch = true) {
  const context = await browser.newContext({viewport:{width,height}, deviceScaleFactor:1,
    serviceWorkers:'block',hasTouch,isMobile:hasTouch,reducedMotion});
  await installLocalTestNetworkPolicy(context);
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === origin || !['http:','https:'].includes(url.protocol)
      ? route.fallback() : route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('response',response=>{
    if(response.status()>=400 && new URL(response.url()).origin===origin) {
      const path = new URL(response.url()).pathname;
      if(!localHttp.some(entry=>entry.path===path))localHttp.push({path,status:response.status()});
    }
  });
  page.on('dialog',dialog=>{
    if(dialog.type()==='prompt'&&dialog.message()==='Local practice password') {
      const password = credentials();
      if(password)return dialog.accept(password);
    }
    return dialog.dismiss();
  });
  return {context,page};
}

async function capture(page,label) {
  const path=join(folder,label+'.png');
  await page.screenshot({path,animations:'disabled'});
  screenshots.push(path);
}

async function openLobbyCard(page, key) {
  await page.goto(origin+'/zh-tw/?preview=1');
  const card=page.locator('.upcoming-game-card[data-game-id="bloomlight-patrol"]').first();
  await card.scrollIntoViewIfNeeded();
  const poster=card.locator('.upcoming-game-art img');
  const delivery=await poster.evaluate(async image=>{
    await image.decode();
    return {path:new URL(image.currentSrc).pathname,width:image.naturalWidth,height:image.naturalHeight};
  });
  assert.equal(delivery.path,'/games/bloomlight-patrol/assets/cover.webp?wp-media=8a3de24a47270269');
  assert(delivery.width>0&&delivery.width===delivery.height);
  const imageElement=await poster.elementHandle();
  await page.waitForFunction(image=>Number(getComputedStyle(image).opacity)>.99,imageElement);
  await capture(page,key+'-lobby');
  return {card,delivery};
}

async function lobbyArt() {
  const reports=[];
  for(const [width,height] of [[390,844],[844,390],[1280,720]]){
    const key=width+'x'+height;
    const {context,page}=await open(width,height,width===844?'reduce':'no-preference',width<844);
    try{
      const {delivery}=await openLobbyCard(page,key);
      reports.push({viewport:key,...delivery});
    }finally{await context.close();}
  }
  return reports;
}
async function state(page,id) {
  return page.locator('#arena').evaluate((el,stageId)=>{
    const [x,z]=el.dataset.lamp.split(',').map(Number);
    return {lamp:{x,z},elapsed:Number(el.dataset.clock),id:stageId,kit:el.dataset.kit,
      projection:JSON.parse(el.dataset.projection),
      pulse:JSON.parse(el.dataset.pulseState),
      lights:JSON.parse(el.dataset.lights).map(([x,z,group,seated,caught])=>({x,z,group,seated,caught})),
      stats:el.dataset.stats,gates:JSON.parse(el.dataset.gates), teaching:el.dataset.teaching==='true'};
  },id);
}

async function nativePoint(page,world,model,point,mouse = false) {
  const [a,b,c]=model.projection;
  const x=world.x+a.x+(b.x-a.x)*point.x+(c.x-a.x)*point.z;
  const y=world.y+a.y+(b.y-a.y)*point.x+(c.y-a.y)*point.z;
  if(mouse)await page.mouse.click(x,y);
  else await page.touchscreen.tap(x,y);
}

async function play(page,id,options={}) {
  const stage=stages[id-1];
  const arena=page.locator('#arena[data-stage="'+id+'"]');
  await arena.locator('canvas').waitFor({timeout:12000});
  const world=await arena.locator('#world').boundingBox();
  assert(world && world.width > 160 && world.height > 180,'usable arena');
  const result=page.locator('#resultPanel');
  const start=performance.now();
  const steering={};
  let tape, loops=0, collected=0, effect=null;
  let clipStart=null, clipEnd=null;
  while(!await result.isVisible() && performance.now() - start < (stage.limit+20)*1000) {
    const model=await state(page,id);
    model.stage=stage;
    const arrived=model.lights.filter(light=>light.seated).length;
    const following=model.lights.filter(light=>light.caught).length;
    const closeEscort=model.lights.some(light=>{
      if(!light.caught)return false;
      const end=stage.lanes[light.group].end;
      return Math.hypot(light.x-end.x,light.z-end.z)<4.6;
    });
    if (options.video && !tape && closeEscort) {
      tape = await onRecord(page);
      clipStart={elapsed:model.elapsed,seated:arrived,following};
    }
    if(tape&&!clipEnd&&model.elapsed>=clipStart.elapsed+6.35)clipEnd={elapsed:model.elapsed,seated:arrived,following};
    if (options.pulse && model.elapsed>1.4 && !effect && await page.locator('#pulse').isEnabled()) {
      const before=await page.locator('#pulse').isEnabled();
      await page.locator('#pulse').tap();
      await page.locator('#pulse:disabled').waitFor();
      const applied = await state(page,id);
      effect = {kit:model.kit,enabledBefore:before,disabledAfter:true,...applied.pulse};
      if(options.capturePulse)await capture(page,options.capturePulse);
    }
    if (arrived>collected) collected=arrived;
    await nativePoint(page,world,model,gardenRoute(model,steering),options.mouse);
    loops++;
    await page.waitForTimeout(112);
  }
  await result.waitFor({timeout:3500});
  const final=await state(page,id);
  const resultText=await page.locator('#resultText').innerText();
  const win=await page.locator('#resultCard').getAttribute('data-outcome')==='win';
  const played={id,win,result:resultText,touchInputs:loops,elapsed:final.elapsed,counts:final.stats,mode:options.mode||'normal',effect};
  if(tape)played.clip={start:clipStart,end:clipEnd??{elapsed:final.elapsed,seated:final.lights.filter(light=>light.seated).length}};
  if(!win)played.remaining=final.lights.filter(light=>!light.seated);
  cases.push(played);
  if(options.screenshot)await capture(page,options.screenshot);
  if(options.video && tape) await finishVideo(page);
  if(!win) failures.push(played);
  return played;
}

async function onRecord(page) {
  return page.evaluate(()=>{
    const canvas=document.querySelector('#world canvas');
    const feed=canvas.captureStream(30);
    const recorder=new MediaRecorder(feed,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:1700000});
    const chunks=[];
    window.bloomRecording=new Promise(resolve=>{
      recorder.ondataavailable=event=>chunks.push(event.data);
      recorder.onstop=()=>{
        feed.getTracks().forEach(track=>track.stop());
        const reader=new FileReader();
        reader.onload=()=>resolve(String(reader.result).split(',')[1]);
        reader.readAsDataURL(new Blob(chunks,{type:recorder.mimeType}));
      };
    });
    recorder.start();
    setTimeout(()=>recorder.stop(),6400);
    return true;
  });
}

async function finishVideo(page) {
  const raw=join(folder,'bloomlight-recording-raw.webm');
  const encoded=await page.evaluate(()=>window.bloomRecording);
  writeFileSync(raw,Buffer.from(encoded,'base64'));
  execFileSync(ffmpeg,['-y','-v','error','-i',raw,'-t','6.4','-an','-vf',
    'crop=min(iw\\,ih):min(iw\\,ih),scale=480:480:flags=lanczos,fps=25',
    '-c:v','libvpx-vp9','-b:v','0','-crf','34',record]);
  assert(statSync(record).size<1e6);
}

async function verifyVideo(page) {
  const asset=origin+'/__bloom-test/clip.webm';
  const verifier=origin+'/__bloom-test/player';
  await page.route(asset,route=>route.fulfill({path:record,contentType:'video/webm'}));
  await page.route(verifier,route=>route.fulfill({contentType:'text/html',
    body:'<!doctype html><meta charset="utf-8"><video muted playsinline controls></video>'}));
  await page.goto(verifier);
  const result=await page.evaluate(async source=>{
    const video=document.querySelector('video');
    video.src=source;
    await video.play();
    await new Promise((resolve,reject)=>{
      video.addEventListener('ended',resolve,{once:true});
      setTimeout(()=>reject(new Error('Preview did not reach the end')),13000);
    });
    const quality=video.getVideoPlaybackQuality();
    return {duration:video.duration,rate:video.playbackRate,ended:video.ended,
      width:video.videoWidth,height:video.videoHeight,frames:quality.totalVideoFrames,dropped:quality.droppedVideoFrames};
  },asset);
  assert(result.duration>=5&&result.duration<=8&&result.rate===1&&result.ended);
  return {...result,bytes:statSync(record).size};
}

async function campaign() {
  const {context,page}=await open();
  try {
    if(continuation>1){
      const prefix=campaignWins().filter(row=>row.id<continuation);
      assert(prefix.length===continuation-1&&prefix.every((row,i)=>row.win&&row.id===i+1));
      const stars=Object.fromEntries(prefix.map(row=>[row.id,Number(row.result.match(/★\s*(\d)/)?.[1])]));
      assert(Object.values(stars).every(mark=>mark>=1&&mark<=3));
      await context.addInitScript(values=>{
        if(localStorage.getItem('weightplay.bloomlight-patrol.v1'))return;
        localStorage.setItem('weightplay.bloomlight-patrol.v1',JSON.stringify({schema:1,stars:values,kit:'standard'}));
        localStorage.setItem('weightplay_action_tutorial_bloomlight-patrol_v1','1');
      },stars);
    }
    await page.goto(origin+'/?preview=1');
    await page.locator('[data-game-id="bloomlight-patrol"]').first().tap();
    await page.locator('#startBtn').tap();
    await page.locator('#stageRail button[aria-label*=" '+continuation+' · "]').first().tap();
    if(continuation===1){
      await page.locator('#arena[data-teaching="true"] canvas').waitFor();
      const before=await state(page,1);
      await capture(page,'tutorial-first');
      await page.waitForTimeout(1200);
      const idle=await state(page,1);
      assert.deepEqual(idle.lamp,before.lamp);
      assert.equal(idle.elapsed,0);
      assert.equal(idle.teaching,true);
      assert.deepEqual(idle.lights,before.lights);
    }
    for(let id=continuation;id<=60;id++){
      const limit=id===1||id%5===0||id===6||id===31;
      const playResult=await play(page,id,{screenshot:limit?'route-'+id:undefined,video:continuation>1&&id===50});
      console.log(JSON.stringify(playResult));
      if(!playResult.win)break;
      if(id<60)await page.locator('#resultNext').tap();
    }
    if(cases.length && !failures.length){
      await page.reload();
      await page.locator('#startBtn').tap();
      const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('weightplay.bloomlight-patrol.v1')).stars);
      assert.equal(Object.keys(stored).length,cases.length+continuation-1);
      return {reloadConfirmed:Object.keys(stored).length,continuation,video:continuation>1?await verifyVideo(page):undefined};
    }
    return {reloadConfirmed:0};
  } finally {await context.close();}
}

async function locales() {
  for (const [locale,slug] of Object.entries(routes)) {
    const {context,page}=await open();
    try {
      await page.goto(origin+'/'+slug+'/games/bloomlight-patrol/?preview=1');
      assert.equal(await page.locator('html').getAttribute('lang'),locale);
      if(locale==='ar')assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
      await page.locator('#startBtn').tap();
      await page.locator('#stageRail button').first().tap();
      const item=await play(page,1,{mode:locale,screenshot:locale==='ar'?'rtl-result':undefined});
      assert(item.win,locale);
      console.log(JSON.stringify(item));
    } finally {await context.close();}
  }
}

async function layoutMatrix() {
  const checkpoint=join(folder,'matrix-checkpoint.json');
  const retained=matrixFrom?JSON.parse(readFileSync(checkpoint,'utf8')):{reports:[],cases:[]};
  const reports=retained.reports.filter(row=>Number(row.viewport.split('x')[0])<matrixFrom);
  cases.push(...retained.cases.filter(row=>(row.mode==='earned-wide'?390:Number(row.mode.split('x')[0]))<matrixFrom));
  for(const [width,height] of [[320,568],[390,844],[612,876],[844,390],[1280,720],[1920,1080]]) {
    if(width<matrixFrom || (matrixOnly&&width!==matrixOnly))continue;
    if(artMatrix&&![390,844,1280].includes(width))continue;
    const mouse = width >= 844;
    const {context,page}=await open(width,height,width===844?'reduce':'no-preference',!mouse);
    const key=width+'x'+height;
    try {
      const {card}=await openLobbyCard(page,key);
      await card.click();
      await page.locator('#startBtn:enabled').waitFor();
      await page.locator('.wp-game-entry-loader').waitFor({state:'hidden'});
      await capture(page,key+'-main');
      await page.locator('#startBtn').click();
      await capture(page,key+'-stage');
      await page.locator('#forgeTab').click();
      await capture(page,key+'-workshop');
      if(width===390&&!artMatrix){
        const wallet = () => page.evaluate(()=>window.WeightPlayWallet.read().diamonds);
        await page.locator('#forgeList .kit').last().locator('button').click();
        await page.locator('#dialogActions button').last().click();
        await page.locator('#dialogBody').getByText('鑽石不足').waitFor();
        assert.equal(await wallet(),0);
        await page.locator('#dialogActions button').first().click();
        const voucher=await page.evaluate(()=>window.WeightPlayWallet.awardOnce('bloomlight-patrol:local-test',16));
        assert.equal(voucher.ok,true);
        await page.locator('#mapTab').click();
        await page.locator('#forgeTab').click();
        await page.locator('#forgeList .kit').last().locator('button').click();
        await page.locator('#dialogActions button').first().click();
        assert.equal(await wallet(),16);
        await page.locator('#forgeList .kit').last().locator('button').click();
        await page.locator('#dialogActions button').last().click();
        await page.locator('#dialog').waitFor({state:'hidden'});
        assert.equal(await wallet(),8);
        assert.equal(await page.evaluate(()=>window.WeightPlayWallet.owns('bloomlight-patrol:brass-lantern')),true);
        assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('weightplay.bloomlight-patrol.v1')).brass),true);
      }
      await page.locator('#mapTab').click();
      await page.locator('#stageRail button').first().click();
      await page.locator('#arena[data-stage="1"] canvas').waitFor();
      await capture(page,key+'-battle');
      const bounds=await page.locator('#arena').boundingBox();
      assert(bounds&&bounds.x>=-.5&&bounds.x+bounds.width<=width+.5&&bounds.y+bounds.height<=height+.5,
        'Visible arena outside its viewport '+key);
      let keyboardMoved=false;
      let contextRestored=false;
      if(width===320&&matrixOnly){
        const initial=await state(page,1);
        const rendered=await page.locator('#world canvas').elementHandle();
        const supported=await rendered.evaluate(canvas=>{
          const extension=canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');
          if(!extension)return false;
          extension.loseContext();
          setTimeout(()=>extension.restoreContext(),650);
          return true;
        });
        assert(supported,'WebGL context recovery should be directly testable');
        await page.waitForFunction(canvas=>!canvas.isConnected,rendered,{timeout:12000});
        await page.locator('#world canvas').waitFor();
        const restored=await state(page,1);
        assert.deepEqual(restored.lamp,initial.lamp);
        assert.equal(restored.elapsed,initial.elapsed);
        contextRestored=true;
        await capture(page,key+'-context-restored');
      }
      if(width===1280){
        const before=await state(page,1);
        await page.locator('#arena').focus();
        await page.keyboard.down('ArrowUp');
        await page.waitForTimeout(600);
        await page.keyboard.up('ArrowUp');
        const [a,b,c]=before.projection;
        const screenY=state=>state.lamp.x*(b.y-a.y)+state.lamp.z*(c.y-a.y);
        keyboardMoved=screenY(await state(page,1))<screenY(before)-10;
        assert(keyboardMoved,'desktop arrow moves the lantern in the expected direction');
      }
      await page.locator('#helpBtn').click();
      await capture(page,key+'-help');
      await page.locator('#dialogActions button').first().click();
      const completed=await play(page,1,{screenshot:key+'-result',mouse,mode:key});
      assert(completed.win,key);
      await page.locator('#resultMap').click();
      await page.locator('#stageBack').click();
      await page.locator('#startBtn').click();
      await page.locator('#stageRail button[aria-label*=" 2 · "]').first().click();
      await page.locator('#arena canvas').waitFor();
      await page.locator('#battleBack').click();
      if(artMatrix){
        const paused=await state(page,2);
        await page.waitForTimeout(650);
        assert.equal((await state(page,2)).elapsed,paused.elapsed,'pause dialog holds the active timer');
      }
      await page.locator('#dialogActions button').last().click();
      await page.locator('#stageBack').click();
      if(width===390&&!artMatrix){
        await page.locator('#startBtn').click();
        await page.locator('#stageRail button[aria-label*=" 2 · "]').first().click();
        for(let id=2;id<=5;id++){
          assert((await play(page,id,{mode:'earned-wide'})).win);
          if(id<5)await page.locator('#resultNext').click();
        }
        await page.locator('#resultMap').click();
        await page.locator('#forgeTab').click();
        await page.locator('#forgeList .kit').nth(1).locator('button').click();
        await page.locator('#forgeList .kit').nth(1).locator('button:disabled').waitFor();
        assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('weightplay.bloomlight-patrol.v1')).kit),'wide');
        await page.locator('#mapTab').click();
        await page.locator('#stageRail button[aria-label*=" 6 · "]').first().click();
        const changed = await play(page,6,{mode:'earned-wide',pulse:true,capturePulse:'wide-in-use'});
        assert(changed.win&&changed.effect.kit==='wide'&&changed.effect.seconds>0);
      }
      reports.push({viewport:key,input:mouse?'mouse':'touch',bounds,roundtrips:2,keyboardMoved,contextRestored,
        reducedMotion:width===844,pauseHeld:artMatrix,wallet:width===390&&!artMatrix?'16 → 16 after cancel → 8, owned and fitted':undefined});
      if(!matrixOnly&&!artMatrix)writeFileSync(checkpoint,JSON.stringify({reports,cases,pageErrors,localHttp},null,2)+'\n');
      console.log(JSON.stringify({viewport:key,outcome:'interactive pass',keyboardMoved}));
    }finally{await context.close();}
  }
  if(artMatrix)return {reports};
  if(matrixOnly){
    assert.equal(reports.length,1,'Choose one supported matrix width');
    return {reports};
  }
  const {context,page}=await open();
  try{
    await page.goto(lesson(6));
    await page.locator('#arena[data-stage="6"] canvas').waitFor();
    const noInput=await state(page,6);
    await page.waitForTimeout(3200);
    const later=await state(page,6);
    assert(later.elapsed>noInput.elapsed+1);
    assert.notDeepEqual(later.gates,noInput.gates);
    await capture(page,'gate-closed');
    await page.waitForFunction(()=>JSON.parse(document.querySelector('#arena').dataset.gates)[0]===true);
    await capture(page,'gate-open');
    await page.locator('#resultPanel').waitFor({timeout:55000});
    assert.equal(await page.locator('#resultCard').getAttribute('data-outcome'),'loss');
    await capture(page,'loss');
    await page.locator('#resultRetry').click();
    assert((await play(page,6,{mode:'idle-loss-then-active-retry'})).win);
    await page.locator('#resultRetry').click();
    const warmup=[];
    for(let cycle=0;cycle<5;cycle++){
      await page.locator('#arena[data-stage="6"] canvas').waitFor();
      const initial=await state(page,6);
      warmup.push(initial.stats);
      const bounds=await page.locator('#world').boundingBox();
      await nativePoint(page,bounds,initial,{x:initial.lamp.x,z:initial.lamp.z-.9});
      await page.waitForTimeout(270);
      assert((await state(page,6)).lamp.z<initial.lamp.z-.2);
      await page.locator('#battleBack').click();
      if(cycle<4) await page.locator('#dialogActions button').nth(1).click();
      else await page.locator('#dialogActions button').last().click();
    }
    assert.equal(new Set(warmup).size,1,'renderers must return to the same resource plateau');
    return {reports,gate:{before:noInput.gates,after:later.gates,
      seconds:Math.round(later.elapsed-noInput.elapsed),idleLoss:true,retryWon:true},resourceCycles:warmup};
  }finally{await context.close();}
}

async function laterKits() {
  const cleared=campaignWins();
  assert.equal(cleared.length,60);
  const stars=Object.fromEntries(cleared.map(row=>[row.id,Number(row.result.match(/★\s*(\d)/)?.[1])]));
  const {context,page}=await open();
  try {
    await context.addInitScript(values=>{
      if(localStorage.getItem('weightplay.bloomlight-patrol.v1'))return;
      localStorage.setItem('weightplay.bloomlight-patrol.v1',JSON.stringify({schema:1,stars:values,kit:'standard'}));
      localStorage.setItem('weightplay_action_tutorial_bloomlight-patrol_v1','1');
    },stars);
    for(const [id,kit,index] of [[21,'wind',2],[45,'split',3]]){
      await page.goto(origin+'/en/games/bloomlight-patrol/?preview=1');
      await page.locator('#startBtn').click();
      await page.locator('#forgeTab').click();
      await page.locator('#forgeList .kit').nth(index).locator('button').click();
      await page.locator('#forgeList .kit').nth(index).locator('button:disabled').waitFor();
      const fitted=await page.evaluate(()=>JSON.parse(localStorage.getItem('weightplay.bloomlight-patrol.v1')).kit);
      assert.equal(fitted,kit);
      await page.goto(lesson(id));
      if(kit==='split'){
        await page.locator('#arena[data-stage="45"] canvas').waitFor();
        const initial=await state(page,45);
        const world=await page.locator('#world').boundingBox();
        await nativePoint(page,world,initial,stages[44].lanes[0].start);
        await page.waitForTimeout(800);
        const following=state=>state.lights.filter(light=>light.group===0&&light.caught).length;
        assert(following(await state(page,45))>=2);
        await page.locator('#filter').tap();
        await page.locator('#filter').tap();
        await page.waitForTimeout(130);
        assert.equal(following(await state(page,45)),0);
        await capture(page,'shape-filter-applied');
        await page.locator('#filter').tap();
        await page.waitForTimeout(170);
        assert(following(await state(page,45))>=2);
      }
      const completed=await play(page,id,{mode:'saved-kit',pulse:true,capturePulse:kit+'-in-use'});
      assert(completed.win&&completed.effect.kit===kit&&completed.effect.seconds>0);
    }
  } finally{await context.close();}
}

function campaignWins(){
  const evidence=new Map();
  const reports=readdirSync(folder)
    .filter(name=>/^campaign(?:-tail|-\d+)?\.json$/.test(name))
    .map(name=>join(folder,name))
    .sort((a,b)=>statSync(a).mtimeMs-statSync(b).mtimeMs);
  for(const path of reports){
    const report=JSON.parse(readFileSync(path,'utf8'));
    for(const row of report.cases)if(row.win)evidence.set(row.id,row);
  }
  return [...evidence.values()].sort((a,b)=>a.id-b.id);
}

async function samples() {
  const {context,page}=await open(510,700);
  try{
    const sampleIds=recordOnly?[50]:[6,20,31,35,50,55,60];
    for(const id of sampleIds){
      await page.goto(lesson(id));
      const played=await play(page,id,{mode:'local-practice',pulse:id>5,
        video:id===50,screenshot:'practice-'+id});
      assert(played.win);
      if(id===50)assert(played.clip?.end.seated>played.clip?.start.seated,'The source clip must show a light arrive');
    }
    return await verifyVideo(page);
  }finally{await context.close();}
}

try {
  mkdirSync(folder,{recursive:true});
  const segment=full?await campaign():localeSweep?await locales():matrix?await layoutMatrix():await samples();
  if(refreshLobbyArt)segment.lobbyArt=await lobbyArt();
  if(matrix&&!matrixOnly&&!artMatrix){
    await laterKits();
    await locales();
  }
  const output={segment,cases,failures,pageErrors,localHttp,screenshots};
  const caseFile=continuation===1?'campaign.json':continuation===42?'campaign-tail.json':'campaign-'+continuation+'.json';
  const matrixFile=artMatrix?'art-matrix.json':matrixOnly?'matrix-'+matrixOnly+'.json':'matrix.json';
  writeFileSync(join(folder,full?caseFile:localeSweep?'locales.json':matrix?matrixFile:'preview.json'),JSON.stringify(output,null,2)+'\n');
  assert.equal(pageErrors.length,0,JSON.stringify(pageErrors));
  assert.equal(localHttp.length,0,JSON.stringify(localHttp));
  assert.equal(failures.length,0,JSON.stringify(failures));
  console.log(JSON.stringify({status:'BLOOM_RENDERED_COMPLETE',cases:cases.length,segment}));
} finally { await browser.close(); }
