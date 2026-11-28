import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { loadTestBrowserRuntime } from '../../scripts/lib/test-browser-runtime.mjs?wp-media=ad19a5c18bce29d5';
import { installLocalTestNetworkPolicy, localTestOrigin, localTestBrowserArgs } from '../../scripts/local-test-network-policy.mjs?wp-media=ad19a5c18bce29d5';
import { CASES } from './casebook.mjs?wp-media=ad19a5c18bce29d5';

const origin = localTestOrigin();
const evidence = process.env.PRICE_EVIDENCE_DIR;
const savedProof = process.env.PRICE_EARNED_CHECKPOINT;
assert(evidence && savedProof && process.env.WEIGHTPLAY_TEST_ORIGIN, 'Set an OS temp evidence directory, the earned campaign proof, and the loopback origin');
const saved = JSON.parse(readFileSync(savedProof, 'utf8')).campaignSaved;
const entry = CASES[34];
assert(Object.keys(saved.stars).length >= entry.id - 1, 'Record from a checkpoint reached by the campaign sample');
const viewport = { width: 600, height: 646 };
const output = join(evidence, 'price-tag-check-battle.webm');
const { playwright, executablePath } = await loadTestBrowserRuntime();

function encode(args) {
  const run = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg',
    ['-nostdin', '-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  if (run.status !== 0) throw new Error(run.error?.message || run.stderr);
}

async function pageIn(browser, record, work) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: 'block',
    ...(record ? { recordVideo: { dir: evidence, size: viewport } } : {}) });
  try {
    await installLocalTestNetworkPolicy(context);
    return await work(await context.newPage());
  } finally {
    await context.close();
  }
}

async function capture(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const recording = page.video();
  const began = performance.now();
  await page.addInitScript(({ loopback, checkpoint, index }) => {
    if (location.origin !== loopback) return;
    const stars = Object.fromEntries(Object.entries(checkpoint.stars).filter(([n]) => Number(n) < index));
    localStorage.setItem('weightplayPriceTagCheckV1', JSON.stringify({ schema: 1, stars, tool: '', red: false }));
  }, { loopback: origin, checkpoint: saved, index: entry.id });
  await page.goto(origin + '/en/games/price-tag-check/index.html?preview=1');
  await page.locator('#startBtn').tap();
  await page.getByRole('button', { name: /Case 35\. Ready/ }).tap();
  await page.locator('#deskView canvas').waitFor();
  const box = await page.locator('#battleLive').boundingBox();
  const even = value => 2 * Math.floor(value / 2);
  const crop = [box.width, box.height, box.x, box.y].map(even).join(':');
  await page.waitForTimeout(375);
  const start = (performance.now() - began) / 1000;
  const visibleActions = [];
  for (const lane of entry.solutions[0]) {
    await page.locator('#file-' + lane).tap();
    const notice = await page.locator('#auditNotice').innerText();
    assert.match(notice, /File opened/);
    visibleActions.push({ lane, notice });
    await page.waitForTimeout(550);
  }
  for (const tag of entry.tags) {
    if (tag.slot) await page.locator('#tag-' + tag.slot).tap();
    await page.waitForTimeout(640);
    await page.locator(tag.answer ? '#approveBtn' : '#rejectBtn').tap();
    const seal = await page.locator('#caseSeal').innerText();
    assert.match(seal, tag.answer ? /Approve/ : /Return/);
    visibleActions.push({ tag: tag.slot, seal });
    if (tag.slot < entry.tags.length - 1) await page.waitForTimeout(640);
  }
  await page.locator('#resultPanel').waitFor();
  assert.match(await page.locator('#resultScore').innerText(), /★ 3\/3/);
  await page.waitForTimeout(260);
  const finish = (performance.now() - began) / 1000;
  assert.deepEqual(errors, []);
  return { raw: await recording.path(), crop, start, finish, visibleActions };
}

async function playClip(page) {
  await page.route(origin + '/__price-preview-inspection', request => request.fulfill({
    contentType: 'text/html', body: '<!doctype html><html><title>Preview inspection</title><video muted playsinline width="480" height="480"></video></html>'
  }));
  await page.route(origin + '/__price-preview-stream.webm', request => request.fulfill({ path: output, contentType: 'video/webm' }));
  await page.goto(origin + '/__price-preview-inspection');
  return page.locator('video').evaluate(async video => {
    video.src = '/__price-preview-stream.webm';
    const end = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Preview did not end at normal speed')), 11000);
      video.addEventListener('ended', () => { clearTimeout(timer); resolve(); }, { once: true });
      video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Preview decoding failed')); }, { once: true });
    });
    await video.play();
    await end;
    const quality = video.getVideoPlaybackQuality();
    return { ended: video.ended, seconds: video.duration, rate: video.playbackRate, muted: video.muted,
      width: video.videoWidth, height: video.videoHeight, frames: quality.totalVideoFrames, dropped: quality.droppedVideoFrames };
  });
}

const browser = await playwright.chromium.launch({
  executablePath, headless: true, args: [...localTestBrowserArgs, '--use-angle=metal', '--enable-gpu']
});
try {
  const { raw, crop, start, finish, visibleActions } = await pageIn(browser, true, capture);
  const begin = Math.max(0, start - 0.1);
  const seconds = Math.min(7.9, finish - begin);
  assert(seconds >= 5, 'The natural filmed actions must span at least five seconds');
  encode(['-y', '-ss', begin.toFixed(3), '-i', raw, '-t', seconds.toFixed(3), '-an',
    '-vf', 'crop=' + crop + ',fps=25,scale=480:480:force_original_aspect_ratio=decrease,pad=480:480:(ow-iw)/2:(oh-ih)/2:color=0x10232a',
    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-pix_fmt', 'yuv420p', output]);
  const bytes = statSync(output).size;
  assert(bytes <= 1_000_000);
  const playback = await pageIn(browser, false, playClip);
  assert(playback.ended && playback.rate === 1 && playback.seconds >= 5 && playback.seconds <= 8);
  for (const point of [0.35, 1.2, 2.1, 3.05, 4.1, 5.05].filter(value => value < playback.seconds)) {
    encode(['-y', '-ss', String(point), '-i', output, '-frames:v', '1', join(evidence, 'price-clip-' + point + '.png')]);
  }
  const report = { stage: entry.id, sourceReady: '/en/games/price-tag-check/index.html?preview=1', footage: output,
    bytes, sha256: createHash('sha256').update(readFileSync(output)).digest('hex'), visibleActions, playback };
  writeFileSync(join(evidence, 'video.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
