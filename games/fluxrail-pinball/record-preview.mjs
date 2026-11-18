import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { loadTestBrowserRuntime } from '../../scripts/lib/test-browser-runtime.mjs?wp-media=d9e35bff50228824';
import { installLocalTestNetworkPolicy, localTestBrowserArgs, localTestOrigin } from '../../scripts/local-test-network-policy.mjs?wp-media=d9e35bff50228824';

const origin = localTestOrigin();
const earned = process.env.FLUXRAIL_EARNED_STATE;
const output = process.argv[2];
const stage = 6;
assert(earned && output, 'Set FLUXRAIL_EARNED_STATE and pass a fresh output WebM path.');
assert(!fs.existsSync(output), 'Use a new output filename.');
const state = JSON.parse(fs.readFileSync(earned, 'utf8'));
for (const item of state.origins) {
  const host = new URL(item.origin).hostname;
  assert(['localhost','127.0.0.1','[::1]'].includes(host),'Use a local earned play state.');
  item.origin = origin;
}
const { playwright, executablePath } = await loadTestBrowserRuntime();
const ffmpeg = process.env.WEIGHTPLAY_FFMPEG_EXECUTABLE ?? 'ffmpeg';
execFileSync(ffmpeg,['-version'],{stdio:'ignore'});
console.log(JSON.stringify({ executablePath, ffmpeg, stage }));
const framesDir = fs.mkdtempSync(path.join(os.tmpdir(),'wp-fluxrail-frames-'));
let browser, context;
try {
  browser = await playwright.chromium.launch({ executablePath,headless:true,args:localTestBrowserArgs });
  context = await browser.newContext({
    viewport:{width:500,height:500},deviceScaleFactor:1,storageState:state,serviceWorkers:'block',
  });
  await installLocalTestNetworkPolicy(context);
  await context.route('**/*',route => new URL(route.request().url()).origin === origin ? route.fallback() : route.abort());
  const page = await context.newPage();
  const $ = selector => page.locator(selector).first();
  const click = selector => $(selector).click({timeout:8000});
  const preview = process.argv.includes('--public') ? '' : '?preview=1';
  await page.goto(origin+'/en/games/fluxrail-pinball/index.html'+preview,{waitUntil:'domcontentloaded'});
  await click('#startBtn');
  const selection = $('#stageRail [aria-current="true"]');
  const selected = Number(await selection.getAttribute('data-stage'));
  assert(selected>=stage, 'Earn Stage 6 through normal play before recording.');
  await selection.focus();
  for (let index=selected;index>stage;index--) await page.keyboard.press('ArrowLeft');
  await click('#stageRail [data-stage="6"]');
  await $('#tableScene canvas').waitFor();

  async function strike(lane) {
    const which = await page.waitForFunction(
      laneName => {
        const label = document.querySelector('#aimReadout').textContent;
        if (label === 'Left flipper → ' + laneName) return 'a';
        if (label === 'Right flipper → ' + laneName) return 'd';
        return false;
      }, lane, { polling:23, timeout:5000 },
    );
    await page.keyboard.press(await which.jsonValue());
    await page.waitForFunction(
      laneName => document.querySelector('#aimReadout').textContent==='Shot to '+laneName,
      lane, {polling:25, timeout:1800},
    );
  }

  const frames = [];
  const start = performance.now();
  let recording = true;
  const capture = (async () => {
    while (recording) {
      const filename = path.join(framesDir,String(frames.length).padStart(4,'0')+'.jpg');
      const ms = performance.now()-start;
      await page.screenshot({path:filename,type:'jpeg',quality:83,timeout:3500});
      frames.push({filename,ms});
      await setTimeout(16);
    }
  })();
  try {
    await page.keyboard.press('a');
    await strike('Center');
    await strike('Left');
    await $('#resultPanel').waitFor({timeout:2700});
    assert.match(await $('#resultText').innerText(),/2\/2 rails/);
    await setTimeout(Math.max(360,5700-(performance.now()-start)));
  } finally {
    recording = false;
    await capture;
  }
  const measured = frames.at(-1)?.ms ?? 0;
  assert(frames.length>=45 && measured>=5000 && measured<7850,'Capture must contain the full result at normal speed.');
  const quote = filename => filename.replaceAll("'", "'\\''");
  const listing = path.join(framesDir,'frames.txt');
  fs.writeFileSync(listing, frames.map(({filename,ms},i) =>
    "file '"+quote(filename)+"'\nduration "+(((frames[i+1]?.ms ?? ms+40)-ms)/1000).toFixed(5)).join('\n')
    +"\nfile '"+quote(frames.at(-1).filename)+"'\n");
  execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-n','-f','concat','-safe','0','-i',listing,
    '-an','-vf','fps=25,scale=480:480:out_range=tv,format=yuv420p',
    '-c:v','libvpx','-g','25','-b:v','0','-crf','13',output],{stdio:'inherit'});
  const bytes=fs.statSync(output).size;
  assert(bytes<=1_000_000,'Public preview must be at most 1 MB.');
  console.log(JSON.stringify({stage,output,bytes,frames:frames.length,measuredMs:Math.round(measured),
    actions:['served','center rail charge','left rail hit','two of two rails'],verifier:'local Chromium real play'}));
} finally {
  try { await context?.close(); }
  finally {
    await browser?.close();
    fs.rmSync(framesDir,{recursive:true});
  }
}
