// Loopback only; a task-owned fixture opens Crystal Cavern, then native mouse
// movements dig the real tools. No motion or UI is fabricated for the clip.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {loadTestBrowserRuntime} from '../../scripts/lib/test-browser-runtime.mjs?wp-media=1ffff09d797fd821';
import {installLocalTestNetworkPolicy,localTestBrowserArgs,localTestOrigin} from '../../scripts/local-test-network-policy.mjs?wp-media=1ffff09d797fd821';
import {freshSave,SAVE_KEY} from './model.mjs?wp-media=1ffff09d797fd821';

const origin=localTestOrigin(), size={width:560,height:672};
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'wp-dig-preview-'));
const output=path.resolve(process.env.BLOCK_DIG_PREVIEW_OUTPUT??path.join(folder,'block-dig-crew-battle.webm'));
const outRelative=path.relative(os.tmpdir(),output);
assert(outRelative&&!outRelative.startsWith('..')&&!path.isAbsolute(outRelative),'Preview output must be in OS temporary storage');
const pickTool=(env,name,args,test)=>{
  for(const p of [process.env[env],...(process.env.PATH??'').split(path.delimiter).map(dir=>path.join(dir,name))].filter(Boolean)){
    try{if(test(execFileSync(p,args,{encoding:'utf8',stdio:['ignore','pipe','ignore']})))return p;}catch{}
  }
  throw Error('Cannot resolve '+name);
};
const ffmpeg=pickTool('FFMPEG_PATH','ffmpeg',['-hide_banner','-encoders'],s=>s.includes('libvpx-vp9'));
const ffprobe=pickTool('FFPROBE_PATH','ffprobe',['-version'],s=>s.includes('ffprobe version'));
const {playwright,executablePath}=await loadTestBrowserRuntime();
const browser=await playwright.chromium.launch({executablePath,headless:true,args:localTestBrowserArgs});
let context,raw;
try {
  context=await browser.newContext({viewport:size,recordVideo:{dir:folder,size},serviceWorkers:'block',deviceScaleFactor:1});
  await installLocalTestNetworkPolicy(context);
  const page=await context.newPage(), errors=[], video=page.video(), epoch=Date.now();
  page.on('pageerror',e=>errors.push(e.message));
  const save=freshSave();
  Object.assign(save,{coins:381,level:12,lesson:2,digs:312,land:2,tutorial:5,
    talents:{find:5,gold:2,double:3},tools:[
      {id:1,level:22,tier:2},{id:2,level:13,tier:1},{id:3,level:6,tier:0},
      {id:4,level:4,tier:0},{id:5,level:4,tier:0},{id:6,level:5,tier:0}
    ]});
  await page.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:SAVE_KEY,value:JSON.stringify(save)});
  await page.goto(origin+'/zh-tw/games/block-dig-crew/?preview=1');
  await page.locator('#resumeBtn').click();
  await page.locator('#arena canvas').waitFor({state:'visible'});
  await page.waitForTimeout(250);
  const start=Date.now();
  const actions=[];
  while(Date.now()-start<7300) {
    const found=await page.locator('.dig-target:not([data-traveling])[aria-disabled="false"]').evaluateAll(nodes=>nodes.map(node=>{
      const r=node.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,id:node.dataset.tool};
    }));
    if(!found.length){await page.waitForTimeout(75);continue;}
    const p=found[actions.length%found.length];
    await page.mouse.move(p.x-23,p.y-7);
    await page.mouse.move(p.x,p.y,{steps:4});
    actions.push({tool:p.id,ms:Date.now()-start});
    await page.waitForTimeout(225);
  }
  const coins=await page.locator('#coinsValue').evaluate(el=>el.value);
  assert(Number(coins.replaceAll(',',''))>381);assert(actions.length>10);assert.deepEqual(errors,[]);
  const take=path.join(folder,'battle.png');await page.screenshot({path:take});
  await context.close();context=null;raw=await video.path();
  execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-ss',String(Math.max(0,(start-epoch)/1000-.04)),
    '-i',raw,'-t','6.8','-an','-vf','fps=30,scale=460:-2:flags=lanczos','-c:v','libvpx-vp9','-crf','34','-b:v','0','-row-mt','1',output]);
  const info=JSON.parse(execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',output],{encoding:'utf8'}));
  assert(info.streams.length===1&&info.streams[0].codec_name==='vp9');assert(info.format.duration>=5&&info.format.duration<=8);
  assert(fs.statSync(output).size<=1024*1024);
  // Verify the full encoded delivery through Chromium's normal-speed decoder.
  const playback=await browser.newContext({viewport:{width:480,height:590},serviceWorkers:'block'});
  try{
    await installLocalTestNetworkPolicy(playback);
    const player=await playback.newPage();
    await player.goto(origin+'/games/block-dig-crew/?preview=1');
    const bytes=fs.readFileSync(output).toString('base64');
    await player.evaluate(base64=>{
      const clip=document.createElement('video');
      clip.id='preview-check';clip.muted=true;clip.playsInline=true;
      clip.src='data:video/webm;base64,'+base64;
      clip.style.cssText='position:fixed;inset:0;margin:auto;max-width:100%;max-height:100%;z-index:2147483647;background:#102528';
      document.body.append(clip);return clip.play();
    },bytes);
    const frames=[];
    for(const second of [0.15,1.5,3.2,5.9]){
      await player.waitForFunction(target=>document.querySelector('#preview-check').currentTime>=target,second);
      const image=path.join(folder,'review-'+second+'.png');await player.locator('#preview-check').screenshot({path:image});
      frames.push(image);
    }
    await player.waitForFunction(()=>document.querySelector('#preview-check').ended);
    console.log(JSON.stringify({output,folder,codec:'vp9',duration:Number(info.format.duration),bytes:fs.statSync(output).size,
      scene:'Crystal Cavern',fixture:true,nativeSweeps:actions.length,coinsBefore:381,coinsAfter:coins,errors,frames,
      normalSpeed:1,ended:true,ffmpeg,executablePath}));
  }finally{await playback.close();}
}finally{
  if(context)await context.close();
  await browser.close();
  if(raw&&raw!==output)fs.rmSync(raw,{force:true});
}
