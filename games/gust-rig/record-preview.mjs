import assert from 'node:assert/strict';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { loadTestBrowserRuntime } from '../../scripts/lib/test-browser-runtime.mjs?wp-media=ad19a5c18bce29d5';
import { installLocalTestNetworkPolicy, localTestOrigin, localTestBrowserArgs } from '../../scripts/local-test-network-policy.mjs?wp-media=ad19a5c18bce29d5';
import { STAGES } from './stages.mjs?wp-media=ad19a5c18bce29d5';
import { solve } from './model.mjs?wp-media=ad19a5c18bce29d5';

const dir = process.env.GUST_RIG_EVIDENCE;
assert(dir && process.env.WEIGHTPLAY_TEST_ORIGIN, 'Set the task-owned evidence directory and loopback origin');
const origin = localTestOrigin();
const stage = STAGES[34];
const steps = solve(stage);
const viewport = { width: 600, height: 646 };
const output = join(dir, 'gust-rig-battle.webm');

const { playwright, executablePath } = await loadTestBrowserRuntime();
const browser = await playwright.chromium.launch({ executablePath, headless: true,
  args: [...localTestBrowserArgs, '--use-angle=metal', '--enable-gpu'] });

async function ownPage(record, run) {
  const context = await browser.newContext({
    viewport, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: 'block',
    ...(record ? { recordVideo: { dir, size: viewport } } : {})
  });
  try {
    await installLocalTestNetworkPolicy(context);
    return await run(await context.newPage());
  } finally { await context.close(); }
}

async function playForRecording(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const before = performance.now();
  const video = page.video();
  await page.addInitScript(({ origin, stageId }) => {
    if (location.origin !== origin) return;
    const stars = Object.fromEntries(Array.from({ length: stageId - 1 }, (_, index) => [index + 1, 3]));
    localStorage.setItem('gust-rig-progress-v1', JSON.stringify({ schemaVersion: 1, stars, lesson: true }));
  }, { origin, stageId: stage.id });
  await page.goto(origin + '/en/games/gust-rig/?preview=1');
  await page.locator('#startBtn').tap();
  await page.getByRole('button', { name: new RegExp('Route ' + stage.id + '\\. Ready') }).tap();
  await page.locator('#rigScene canvas').waitFor();
  const { x, y, width, height } = await page.locator('#battleLive').boundingBox();
  const even = value => 2 * Math.floor(value / 2);
  const crop = [width, height, x, y].map(even);
  const start = (performance.now() - before) / 1000;
  const beats = [];
  for (const [index, action] of steps.entries()) {
    await page.locator('button[data-command="' + action + '"]').tap();
    assert.equal(await page.locator('#projected').getAttribute('data-fit'), 'true');
    await page.waitForTimeout(215);
    await page.locator('#sendBtn').tap();
    await page.waitForFunction(() => document.querySelector('#notice').textContent.includes('Gate cleared'));
    beats.push({ gate: index + 1, action, time: (performance.now() - before) / 1000 });
    await page.waitForTimeout(545);
  }
  await page.locator('#resultPanel').waitFor();
  const result = await page.locator('#resultText').innerText();
  assert.match(result, /★ 3 \/ 3/);
  await page.waitForTimeout(600);
  assert.deepEqual(errors, []);
  return { path: await video.path(), start, crop, beats, result };
}

function ffmpeg(args) {
  const run = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg',
    ['-nostdin', '-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.error?.message || run.stderr);
}

async function readClip(page) {
  await page.route(origin + '/__gust-clip.html', request => request.fulfill({
    body: '<!doctype html><title>Gust Rig clip check</title><video width="480" height="480" muted playsinline></video>',
    contentType: 'text/html'
  }));
  await page.route(origin + '/__gust-clip.webm', request => request.fulfill({ path: output, contentType: 'video/webm' }));
  await page.goto(origin + '/__gust-clip.html');
  return page.locator('video').evaluate(async video => {
    const finished = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Clip playback timed out')), 10_500);
      video.addEventListener('ended', () => { clearTimeout(timeout); resolve(); }, { once: true });
      video.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('Clip decode failed')); }, { once: true });
    });
    video.src = '/__gust-clip.webm';
    await video.play();
    await finished;
    const quality = video.getVideoPlaybackQuality();
    return { ended: video.ended, seconds: video.duration, rate: video.playbackRate,
      width: video.videoWidth, height: video.videoHeight, frames: quality.totalVideoFrames,
      dropped: quality.droppedVideoFrames, muted: video.muted };
  });
}

try {
  const record = await ownPage(true, playForRecording);
  const crop = 'crop=' + record.crop.join(':');
  ffmpeg(['-y', '-ss', Math.max(0, record.start + 0.03).toFixed(3), '-i', record.path, '-t', '6.3', '-an',
    '-vf', crop + ',scale=480:480:force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,' +
    'pad=480:480:(ow-iw)/2:(oh-ih)/2:color=0x0e1c31,setsar=1,fps=25',
    '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', output]);
  ffmpeg(['-y', '-i', output, '-vf', 'fps=1,scale=220:220,tile=3x2', '-frames:v', '1', join(dir, 'clip-frames.png')]);
  const playback = await ownPage(false, readClip);
  assert(playback.ended && playback.rate === 1 && playback.muted && playback.seconds >= 5 && playback.seconds <= 8);
  assert.deepEqual([playback.width, playback.height], [480, 480]);
  const bytes = statSync(output).size;
  assert(bytes <= 1048576);
  const report = { stage:stage.id, bytes, record, playback, sha256:createHash('sha256').update(readFileSync(output)).digest('hex') };
  writeFileSync(join(dir, 'clip-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
