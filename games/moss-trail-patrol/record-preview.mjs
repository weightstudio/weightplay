import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadTestBrowserRuntime } from '../../scripts/lib/test-browser-runtime.mjs?wp-media=e61d4800f2e47cf6';
import { localTestBrowserArgs, localTestOrigin } from '../../scripts/local-test-network-policy.mjs?wp-media=e61d4800f2e47cf6';
import { routes, words } from './copy.mjs?wp-media=e61d4800f2e47cf6';
import { stages } from './stages.mjs?wp-media=e61d4800f2e47cf6';
import { witness } from '../../scripts/test-moss-trail-patrol.mjs?wp-media=e61d4800f2e47cf6';

const id = 'moss-trail-patrol';
const root = localTestOrigin();
const output = process.env.MOSS_TRAIL_EVIDENCE;
const mode = process.argv[2] || 'film';
assert(output, 'Set MOSS_TRAIL_EVIDENCE to the task-owned output directory.');
const origin = new URL(root).origin;
const { playwright, executablePath } = await loadTestBrowserRuntime();
const browser = await playwright.chromium.launch({
  executablePath, headless: true, args: [...localTestBrowserArgs, '--use-angle=metal', '--enable-gpu'],
});
const results = [];
const errors = new Set();
let context;
let touch = true;

function note(entry) {
  results.push(entry);
  writeFileSync(join(output, mode + '.json'), JSON.stringify({ results, errors: [...errors] }, null, 2));
  console.log(JSON.stringify(entry));
}
const stageUrl = (locale, extra = '') => `${origin}/${routes[locale]}/games/${id}/?preview=1${extra}`;
const shown = (page, selector) => page.locator(selector).waitFor({ state: 'visible', timeout: 8000 });
const screenshot = (page, name) => page.screenshot({ path: join(output, name + '.png'), timeout: 10000 });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function newPage({ width = 390, height = 844, reducedMotion = 'no-preference', pointer = 'touch', film = false, storageState } = {}) {
  await context?.close();
  touch = pointer === 'touch';
  context = await browser.newContext({
    viewport: { width, height }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1,
    serviceWorkers: 'block', reducedMotion, storageState,
    ...(film ? { recordVideo: { dir: output, size: { width, height } } } : {}),
  });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.add(error.message));
  page.on('response', reply => {
    const url = new URL(reply.url());
    if (reply.status() >= 400 && (url.pathname.includes(id) || new URL(page.url()).pathname.includes(id))) {
      errors.add(reply.status() + ' ' + url.pathname);
    }
  });
  page.on('dialog', dialog => {
    if (dialog.type() !== 'prompt' || dialog.message() !== 'Local practice password') return dialog.dismiss();
    const password = readFileSync('docs/local-practice-credentials.md', 'utf8').match(/^Password: \x60([^\x60]+)\x60$/m)?.[1];
    assert(password, 'Local practice credentials unavailable.');
    return dialog.accept(password);
  });
  return page;
}

async function press(page, selector) {
  return touch ? page.locator(selector).tap({ timeout: 8000 }) : page.locator(selector).click({ timeout: 8000 });
}

async function first(page, locale, lobby = false) {
  if (lobby) {
    await page.goto(`${origin}/${routes[locale]}/?preview=1`, { waitUntil: 'domcontentloaded' });
    await press(page, `.upcoming-game-card[data-game-id="${id}"]`);
  } else await page.goto(stageUrl(locale), { waitUntil: 'domcontentloaded' });
  await shown(page, '#startBtn:enabled');
  await press(page, '#startBtn');
  await press(page, '#stageRail [aria-current="true"]');
  await shown(page, '#world canvas');
}

async function practice(page, stage, locale = 'en') {
  await page.goto(stageUrl(locale, '&practice=1&practiceStage=' + stage), { waitUntil: 'domcontentloaded' });
  await shown(page, '#world canvas');
  await shown(page, '[data-wp-local-practice]');
}

const hud = page => page.evaluate(() => {
  const get = name => document.getElementById(name);
  return { hp: get('lifeMeter').value, shards: get('shardMeter').value,
    foe: get('combatTop').hidden ? 0 : get('foeMeter').value,
    cue: get('targetCue').textContent, feedback: get('eventCue').textContent,
    result: !get('resultPanel').hidden, geometry: get('arena').getBoundingClientRect().toJSON(),
    resources: JSON.parse(get('world').dataset.renderResources || '{}') };
});

async function action(page, name) {
  await press(page, `#battleScreen[data-moss-busy="false"] button[data-action="${name}"]:not([aria-disabled="true"])`);
}

async function follow(page, plan, { sample = 0, label = '' } = {}) {
  const moves = [];
  for (const [i, step] of plan.commands.entries()) {
    await action(page, step.action);
    const actual = await hud(page);
    assert.equal(actual.hp, step.hp, label + ' health after ' + step.action);
    assert.equal(actual.shards, step.shards, label + ' shards after ' + step.action);
    assert.equal(actual.foe, step.foe, label + ' foe after ' + step.action);
    if (sample && i < sample) moves.push({ action: step.action, ...actual });
  }
  await shown(page, '#resultPanel');
  return { outcome: await page.locator('#resultCard').getAttribute('data-outcome'),
    text: await page.locator('#resultText').innerText(), notice: await page.locator('#resultNotice').innerText(), moves };
}

async function campaign() {
  const page = await newPage({ reducedMotion: 'reduce' });
  await first(page, 'zh-Hant', true);
  for (const stage of stages) {
    const options = [witness(stage), witness(stage, 'fast')].sort((a, b) =>
      b.score - a.score || a.commands.length - b.commands.length);
    const plan = options[0];
    const result = await follow(page, plan, { label: 'Trail ' + stage.id });
    assert.equal(result.outcome, 'win');
    assert(result.notice.includes(words['zh-Hant'].saved));
    note({ case: 'normal campaign', stage: stage.id, stars: plan.score, commands: plan.commands.length, ...result });
    if (stage.id < stages.length) {
      await press(page, '#resultNext');
      await shown(page, `#battleScreen[data-moss-stage="${stage.id + 1}"] #world canvas`);
    }
  }
  await context.storageState({ path: join(output, 'earned-profile.json') });
  await page.reload();
  await shown(page, '#startBtn:enabled');
  const saved = await page.locator('#mainProgress').innerText();
  assert(saved.includes('60 / 60'));
  note({ case: 'normal reload', saved });
}

async function review() {
  const page = await newPage();
  await practice(page, 6, 'zh-Hant');
  for (const name of ['trail','strike','trail','strike']) await action(page, name);
  const bare = await hud(page);
  assert.equal(bare.hp, 8);
  await screenshot(page, 'stage6-bare');
  await practice(page, 6, 'zh-Hant');
  for (const name of ['trail','strike','lantern','trail','strike']) await action(page, name);
  const lit = await hud(page);
  assert.equal(lit.hp, 10);
  assert.equal(lit.foe, 1);
  assert.equal(lit.shards, 1);
  await pause(420);
  await screenshot(page, 'stage6-lantern');
  note({ case: 'rival loadout / stock trade', bare, lit });
  await practice(page, 48, 'zh-Hant');
  const before = await hud(page);
  await action(page, 'trail');
  const wet = await hud(page);
  assert.equal(wet.shards, before.shards - 1);
  await screenshot(page, 'stage48-bare');
  await practice(page, 48, 'zh-Hant');
  for (const name of ['plank','trail']) await action(page, name);
  const plank = await hud(page);
  assert(plank.feedback.includes(words['zh-Hant'].protected));
  await pause(430);
  await screenshot(page, 'stage48-plank');
  note({ case: 'high tide comparison', before, wet, plank });
  await practice(page, 60, 'zh-Hant');
  const failure = await follow(page, witness(stages[59], 'reckless'), { sample: 2, label: 'reckless finale' });
  assert.equal(failure.outcome, 'loss');
  await screenshot(page, 'stage60-loss');
  await press(page, '#resultRetry');
  await shown(page, '#world canvas');
  const recovery = await follow(page, witness(stages[59], 'fast'), { sample: 2, label: 'recovered finale' });
  assert.equal(recovery.outcome, 'win');
  await screenshot(page, 'stage60-win');
  note({ case: 'loss and retry', failure, recovery });

  for (const [locale, path] of Object.entries(routes)) {
    const local = await newPage({ reducedMotion: 'reduce', width: locale === 'ar' ? 844 : 390, height: locale === 'ar' ? 390 : 844 });
    await first(local, locale);
    const result = await follow(local, witness(stages[0]));
    assert(result.text.includes(words[locale].health));
    const dir = await local.locator('html').getAttribute('dir');
    assert.equal(dir, locale === 'ar' ? 'rtl' : 'ltr');
    note({ case: 'locale', locale, path, dir, ...result });
    if (locale === 'ar') await screenshot(local, 'result-ar-landscape');
  }

}

async function screens() {
  for (const [width, height] of [[320,568],[390,844],[612,876],[844,390],[1366,768]]) {
    const local = await newPage({ width, height, pointer: width > 1024 ? 'mouse' : 'touch' });
    await local.goto(stageUrl('zh-Hant'), { waitUntil: 'domcontentloaded' });
    await shown(local, '#startBtn:enabled');
    await screenshot(local, 'main-' + width);
    await press(local, '#startBtn');
    await screenshot(local, 'stage-' + width);
    await press(local, '#gearTab');
    await screenshot(local, 'gear-' + width);
    await press(local, '#mapTab');
    await press(local, '#stageRail [aria-current="true"]');
    await shown(local, '#world canvas');
    await screenshot(local, 'battle-' + width);
    await press(local, '#battleBack');
    await shown(local, '#dialog');
    await screenshot(local, 'overlay-' + width);
    await press(local, '#dialogActions button:last-child');
    const result = await follow(local, witness(stages[0]));
    const geometry = await local.evaluate(() => ({ width: innerWidth, doc: document.documentElement.scrollWidth }));
    assert(geometry.doc <= geometry.width);
    const art = await local.locator('#resultCard .result-hero').evaluate(node => getComputedStyle(node, '::before').backgroundImage);
    assert(art.includes('victory.webp'));
    const primaryInk = await local.locator('#resultNext').evaluate(node => getComputedStyle(node).color);
    assert.equal(primaryInk, 'rgb(248, 243, 225)');
    await screenshot(local, 'result-' + width);
    note({ case: 'viewport', width, height, geometry, primaryInk, ...result });
  }

}

async function followup() {
  const progress = await newPage({ storageState: join(output, 'earned-profile.json') });
  await progress.goto(stageUrl('zh-Hant'), { waitUntil: 'domcontentloaded' });
  await shown(progress, '#startBtn:enabled');
  await press(progress, '#startBtn');
  await press(progress, '#gearTab');
  await press(progress, '[data-item="bracer"]');
  await progress.locator('#gearList [role="status"]').filter({ hasText: words['zh-Hant'].saved }).waitFor({ timeout: 6000 });
  await progress.reload();
  await shown(progress, '#startBtn:enabled');
  await press(progress, '#startBtn');
  await press(progress, '#gearTab');
  assert(await progress.locator('[data-item="bracer"]').isDisabled());
  const equipped = await progress.locator('[data-item="bracer"]').innerText();
  await practice(progress, 6, 'zh-Hant');
  for (const name of ['trail','strike','trail','guard','strike']) await action(progress, name);
  const upgraded = await hud(progress);
  assert.equal(upgraded.foe, 0);
  assert.equal(upgraded.hp, 10);
  note({ case: 'earned equipment after reload', equipped, upgraded });
  await progress.goto(stageUrl('zh-Hant'), { waitUntil: 'domcontentloaded' });
  await shown(progress, '#startBtn:enabled');
  await press(progress, '#startBtn');
  await press(progress, '#gearTab');
  await press(progress, '[data-item="lens"]');
  await progress.locator('#gearList [role="status"]').filter({ hasText: words['zh-Hant'].saved }).waitFor({ timeout: 6000 });
  await practice(progress, 6, 'zh-Hant');
  for (const name of ['lantern','trail','strike','trail','strike']) await action(progress, name);
  const ward = await hud(progress);
  assert.equal(ward.hp, 10);
  assert(ward.feedback.includes(words['zh-Hant'].blocked.replace('{n}','2')));
  await screenshot(progress, 'stage6-wick');
  note({ case: 'earned wick carries ward to next fight', ward });
  await progress.goto(stageUrl('zh-Hant'), { waitUntil: 'domcontentloaded' });
  await shown(progress, '#startBtn:enabled');
  await press(progress, '#startBtn');
  await press(progress, '#gearTab');
  await press(progress, '[data-item="canopy"]');
  await progress.locator('#gearList [role="status"]').filter({ hasText: words['zh-Hant'].saved }).waitFor({ timeout: 6000 });
  await practice(progress, 16, 'zh-Hant');
  for (const name of ['trail','strike','trail','strike','strike','strike','strike']) await action(progress, name);
  const prepared = await hud(progress);
  await action(progress, 'camp');
  await action(progress, 'trail');
  const sheltered = await hud(progress);
  assert.equal(sheltered.hp - prepared.hp, 3);
  await screenshot(progress, 'stage16-canopy');
  note({ case: 'earned canopy restores three at camp', prepared, sheltered });

  const walletCase = await newPage({ storageState: { cookies: [], origins: [{
    origin, localStorage: [{ name: 'weightplayWallet', value: JSON.stringify({ schema: 2, diamonds: 10 }) }],
  }] } });
  await walletCase.goto(stageUrl('en'), { waitUntil: 'domcontentloaded' });
  await shown(walletCase, '#startBtn:enabled');
  await press(walletCase, '#startBtn');
  await press(walletCase, '#gearTab');
  await press(walletCase, '[data-item="amber"]');
  await shown(walletCase, '#dialog');
  await press(walletCase, '#dialogActions button:last-child');
  await walletCase.locator('#gearList [role="status"]').filter({ hasText: '◆ 4' }).waitFor({ timeout: 6000 });
  await walletCase.reload();
  await shown(walletCase, '#startBtn:enabled');
  await press(walletCase, '#startBtn');
  await press(walletCase, '#gearTab');
  const balance = await walletCase.locator('#gearList [role="status"]').innerText();
  const appearance = await walletCase.locator('[data-item="amber"]').innerText();
  assert(balance.includes('◆ 4'));
  assert.equal(appearance, words.en.equipped);
  note({ case: 'isolated wallet fixture purchase', startingDiamonds: 10, balance, appearance });

  await entryArt();
}

async function entryArt() {
  for (const [width, height, pointer] of [[390,844,'touch'],[844,390,'touch'],[1366,768,'mouse']]) {
    const lobby = await newPage({ width, height, pointer });
    await lobby.goto(origin + '/zh-tw/?preview=1', { waitUntil: 'domcontentloaded' });
    const card = lobby.locator('.upcoming-game-card[data-game-id="' + id + '"]');
    await card.scrollIntoViewIfNeeded();
    const proof = await card.locator('img').evaluate(async img => {
      await img.decode();
      return { width: img.naturalWidth, height: img.naturalHeight, src: new URL(img.currentSrc).pathname };
    });
    assert.equal(proof.width, proof.height);
    await card.scrollIntoViewIfNeeded();
    await pause(450);
    await screenshot(lobby, 'lobby-' + width);
    note({ case: 'planned lobby poster', viewport: [width, height], ...proof });
    await lobby.goto(stageUrl('zh-Hant'), { waitUntil: 'domcontentloaded' });
    await shown(lobby, '#startBtn:enabled');
    await lobby.locator('.wp-game-entry-loader').first().waitFor({ state: 'hidden', timeout: 10000 });
    await pause(120);
    await screenshot(lobby, 'main-' + width);
  }
}

async function film() {
  const page = await newPage({ width: 520, height: 830, film: true });
  await practice(page, 35);
  await shown(page, '#arena canvas');
  const box = await page.locator('#arena').boundingBox();
  assert(Math.abs(box.width - box.height) <= 35, 'Use a roughly square live arena so the lobby crop keeps the enemy meter and cue.');
  const startTime = performance.now();
  const clipEvents = [];
  const plan = witness(stages[34], 'fast');
  for (const step of plan.commands) {
    await action(page, step.action);
    const actual = await hud(page);
    clipEvents.push({ timeMs: Math.round(performance.now() - startTime), action: step.action, ...actual });
    if (performance.now() - startTime > 6750) break;
    await pause(390);
  }
  await pause(Math.max(0, 6450 - (performance.now() - startTime)));
  const raw = await page.video().path();
  await context.close();
  context = null;
  const media = join(output, id + '-battle.webm');
  const side = Math.min(box.width, box.height) & ~1;
  const x = (box.x + (box.width - side) / 2) & ~1;
  const y = (box.y + (box.height - side) / 2) & ~1;
  const encoded = spawnSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-sseof','-6.35','-i',raw,
    '-t','6.2','-vf',`crop=${side}:${side}:${x}:${y},scale=480:480,fps=25`,
    '-an','-c:v','libvpx-vp9','-b:v','0','-crf','31',media], { stdio: 'inherit', timeout: 45000 });
  assert.equal(encoded.status, 0);
  assert(statSync(media).size <= 1000000);
  note({ case: 'native clip', media, raw, box, clipEvents });
}

async function playback() {
  const page = await newPage({ pointer: 'mouse' });
  await page.goto(origin + '/games/' + id + '/assets/' + id + '-battle.webm');
  await shown(page, 'video');
  const readings = await page.locator('video').evaluate(async video => {
    if (video.readyState < 1) await new Promise(resolve => video.addEventListener('loadedmetadata', resolve, { once: true }));
    video.currentTime = 0;
    video.playbackRate = 1;
    video.muted = true;
    const played = new Promise(resolve => video.addEventListener('ended', resolve, { once: true }));
    await video.play();
    await played;
    const quality = video.getVideoPlaybackQuality();
    return { duration: video.duration, width: video.videoWidth, height: video.videoHeight,
      playbackRate: video.playbackRate, ended: video.ended, frames: quality.totalVideoFrames, dropped: quality.droppedVideoFrames };
  });
  assert(readings.ended && readings.duration >= 5 && readings.duration <= 8 && readings.width === 480 && readings.height === 480);
  note({ case: 'full 1x watch', ...readings });
}

try {
  if (mode === 'campaign') await campaign();
  else if (mode === 'review') { await review(); await screens(); }
  else if (mode === 'screens') await screens();
  else if (mode === 'followup') await followup();
  else if (mode === 'entry-art') await entryArt();
  else if (mode === 'film') await film();
  else if (mode === 'playback') await playback();
  else throw new Error('Unknown mode: ' + mode);
  note({ case: 'complete' });
} finally {
  await context?.close();
  await browser.close();
}

