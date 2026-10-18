import fs from "node:fs";
import http from "node:http";
import Module from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(".");
const runtime = path.join(process.env.USERPROFILE || process.env.HOME || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node");
process.env.NODE_PATH = [process.env.NODE_PATH, path.join(runtime, "node_modules"), path.join(runtime, "node_modules", ".pnpm", "node_modules")].filter(Boolean).join(path.delimiter);
Module._initPaths();
const playwrightPath = path.join(runtime, "node_modules", "playwright", "index.js");
if (!fs.existsSync(playwrightPath)) throw new Error("Breakout lane-agency smoke requires the bundled Playwright runtime.");
const { default: playwright } = await import(pathToFileURL(playwrightPath).href);

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://local");
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (file.endsWith(path.sep)) file = path.join(file, "index.html");
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": {
    ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json",
    ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".avif": "image/avif",
  }[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await playwright.chromium.launch({ headless: true });
const origin = `http://127.0.0.1:${server.address().port}`;
const viewports = [{ width: 390, height: 844 }, { width: 612, height: 876 }, { width: 844, height: 390 }, { width: 1280, height: 720 }];
const viewportBucket = ({ width, height }) => height <= 430 ? "short-landscape" : width <= 480 ? "phone" : width <= 900 ? (height > width ? "tablet-portrait" : "tablet-landscape") : (height > width ? "desktop-portrait" : "desktop-landscape");
const missCopy = {
  en: "No brick cleared — shot 3 used. Column 3 is clear; next target: column 2. Move Left before serving.", "zh-Hant": "沒有清除磚塊——已使用第 3 次射擊。第 3 欄已清空；下一個目標：第 2 欄。發球前左移。", "zh-Hans": "没有清除砖块——已使用第 3 次射击。第 3 列已清空；下一个目标：第 2 列。发球前左移。",
  ja: "ブロックは消えませんでした（3ショット）。3列は空です。次の目標は2列。サーブ前に左へ移動しましょう。", ko: "3번째 서브에서 벽돌을 깨지 못했습니다. 3번 열이 비었습니다. 다음 목표는 2번 열입니다. 서브 전에 왼쪽으로 이동하세요.", es: "No rompiste ningún ladrillo: tiro 3. La columna 3 está vacía; próximo objetivo: columna 2. Muévete Izquierda antes de sacar.",
  "pt-BR": "Nenhum bloco foi quebrado — tiro 3. A coluna 3 está vazia; próximo alvo: coluna 2. Mova para Esquerda antes de sacar.", fr: "Aucune brique cassée — tir 3. La colonne 3 est vide ; prochaine cible : colonne 2. Déplacez-vous Gauche avant de servir.", de: "Kein Stein getroffen – Schuss 3. Spalte 3 ist frei; nächstes Ziel: Spalte 2. Bewege dich vor dem Aufschlag nach Links.",
  it: "Nessun mattone colpito: tiro 3. La colonna 3 è vuota; prossimo bersaglio: colonna 2. Spostati a Sinistra prima del servizio.", ru: "Блок не разбит — удар 3. Столбец 3 пуст; следующая цель — столбец 2. Перед подачей двигайтесь Влево.", hi: "कोई ईंट नहीं टूटी—शॉट 3। स्तंभ 3 खाली है; अगला लक्ष्य स्तंभ 2 है। सर्व से पहले बायाँ जाएँ।", ar: "لم تُحطّم أي لبنة — التسديدة 3. العمود 3 فارغ؛ الهدف التالي هو العمود 2. تحرّك نحو يسار قبل الإرسال.",
};
const assert = (condition, message, details = {}) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(details)}`); };
const click = (page, action) => page.locator(`[data-action="${action}"]`).click();
const fireTwice = async (page) => { await click(page, "fire"); await click(page, "fire"); };
const clearRemainingFromColumnThree = async (page) => {
  await click(page, "left"); await fireTwice(page);
  await click(page, "left"); await fireTwice(page);
  await click(page, "right"); await click(page, "right"); await click(page, "right"); await fireTwice(page);
  await click(page, "right"); await fireTwice(page);
  await click(page, "right"); await fireTwice(page);
  await page.locator("#resultScreen:not([hidden])").waitFor({ state: "visible" });
};
const state = (page) => page.evaluate(() => ({
  version: document.body.dataset.gameVersion,
  interfaceVersion: document.querySelector('meta[name="weightplay-interface-version"]')?.content,
  screen: document.body.dataset.screen,
  lane: document.querySelector(".brick-board")?.dataset.shotColumn,
  laneState: document.querySelector(".brick-board")?.dataset.laneState,
  shots: Number(document.querySelector(".brick-board")?.dataset.shotCount),
  score: Number([...document.querySelectorAll('[data-wp-frame-header="battle"] [data-wp-frame-stat]')].find((node) => /(?:Score|分數|得点|점수|Puntuación|Pontuação|Score|Punkte|Punteggio|Счёт|स्कोर|النقاط)/iu.test(node.textContent))?.textContent.match(/\d+/u)?.[0] || 0),
  target: document.querySelector('[data-shot-target="true"]')?.getAttribute("data-index") ?? null,
  bricks: document.querySelectorAll(".brick:not(.cleared)").length,
  message: document.querySelector("#gameMessage")?.textContent,
  messageKey: document.querySelector("#gameMessage")?.dataset.messageKey,
  numbers: (document.querySelector("#roundLabel")?.textContent.match(/\d+/g) || []).map(Number),
  goal: document.querySelector("#resultGoal")?.textContent || "",
  scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
  viewport: { width: innerWidth, height: innerHeight },
}));

const evidence = [];
const capture = async (page, name) => {
  if (process.env.BREAKOUT_MOTION_CAPTURE !== "1") return;
  await page.waitForTimeout(240);
  await page.screenshot({ path: path.join(process.env.TMPDIR || "/tmp", `weightplay-breakout-motion-${name}.png`) });
};
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width <= 612 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error" && !/favicon|Failed to load resource/iu.test(message.text())) errors.push(message.text()); });
    await page.goto(`${origin}/games/breakout/`, { waitUntil: "networkidle" });
    assert(new URL(page.url()).search === "", "Breakout uses the ordinary route without preview or test parameters", { url: page.url() });
    await page.waitForFunction(() => window.__weightplayBreakoutAnalyticsInstalled === true);
    await page.evaluate(() => {
      window.__BREAKOUT_FUNNEL_EVENTS__ = [];
      window.__BREAKOUT_RESULT_MOTION__ = [];
      window.WonderAnalytics = { track: (name, data) => window.__BREAKOUT_FUNNEL_EVENTS__.push({ name, data }) };
      window.addEventListener("weightplay:breakout-screen", () => {
        if (!document.body.hasAttribute("data-wp-result-active")) return;
        const card = document.querySelector("#resultScreen .result-card");
        window.__BREAKOUT_RESULT_MOTION__.push((card?.getAnimations() || []).map((animation) => ({
          duration: animation.effect?.getTiming().duration,
          keyframes: animation.effect?.getKeyframes().map((frame) => ({ opacity: frame.opacity, transform: frame.transform })),
        })));
      });
    });
    await capture(page, `${viewport.width}x${viewport.height}-main`);
    await page.locator("#startBtn").click();
    const mainExit = await page.evaluate(() => {
      const node = document.querySelector('[data-wp-frame-scene="main"]');
      return { hidden: node.hidden, inert: node.inert, ariaHidden: node.getAttribute("aria-hidden"), leaving: node.hasAttribute("data-wp-breakout-leaving"), duration: getComputedStyle(node).transitionDuration };
    });
    assert(!mainExit.hidden && mainExit.inert && mainExit.ariaHidden === "true" && mainExit.leaving && /0\.17s/.test(mainExit.duration),
      "Main exit does not retain a brief inert visual transition", { viewport, mainExit });
    await page.waitForTimeout(190);
    assert(await page.locator('[data-wp-frame-scene="main"]').evaluate(node => node.hidden && !node.hasAttribute("data-wp-breakout-leaving")),
      "Main exit did not settle cleanly after its finite transition", { viewport });
    await capture(page, `${viewport.width}x${viewport.height}-stage`);
    await page.locator('#stageRail [aria-current="true"]').click();
    const stageExit = await page.evaluate(() => {
      const node = document.querySelector('[data-wp-frame-scene="stage"]');
      return { hidden: node.hidden, inert: node.inert, ariaHidden: node.getAttribute("aria-hidden"), leaving: node.hasAttribute("data-wp-breakout-leaving") };
    });
    assert(!stageExit.hidden && stageExit.inert && stageExit.ariaHidden === "true" && stageExit.leaving,
      "Stage exit remains interactive or skips its finite visual transition", { viewport, stageExit });
    await page.waitForTimeout(190);
    assert(await page.locator('[data-wp-frame-scene="stage"]').evaluate(node => node.hidden && !node.hasAttribute("data-wp-breakout-leaving")),
      "Stage exit did not settle cleanly after its finite transition", { viewport });
    await capture(page, `${viewport.width}x${viewport.height}-battle`);
    const serveStyle = await page.locator('#controls [data-action="fire"]').evaluate((button) => ({
      background: getComputedStyle(button).backgroundColor,
      color: getComputedStyle(button).color,
      primary: button.classList.contains("primary"),
    }));
    assert(serveStyle.primary && serveStyle.background === "rgb(126, 231, 201)" && serveStyle.color === "rgb(6, 21, 26)",
      "Primary Serve control lost its shared accent treatment", { viewport, serveStyle });
    await page.locator("#battleBackBtn").click();
    const leaveOverlay = await page.evaluate(() => {
      const dialog = document.querySelector("#breakoutLeaveDialog");
      const panel = document.querySelector("#battleScreen .battle-panel");
      return {
        open: dialog.open,
        modal: dialog.matches(":modal"),
        battleInert: panel.inert,
        animations: dialog.getAnimations().map((animation) => animation.effect?.getTiming().duration),
      };
    });
    assert(leaveOverlay.open && leaveOverlay.modal && leaveOverlay.battleInert && leaveOverlay.animations.includes(170),
      "Battle leave overlay must be modal, finite, and block background input", { viewport, leaveOverlay });
    await capture(page, `${viewport.width}x${viewport.height}-leave`);
    await page.locator("#breakoutLeaveContinue").click();
    await page.locator("#breakoutLeaveDialog").waitFor({ state: "hidden" });
    assert(await page.locator("#battleScreen .battle-panel").evaluate((panel) => !panel.inert),
      "Continuing from the leave overlay did not restore Battle input", { viewport });
    const initial = await state(page);
    assert(initial.version === "v20" && initial.interfaceVersion === "9" && initial.screen === "battle" && initial.lane === "3" && initial.laneState === "armed" && initial.target === "2", "Initial lane target or v20/I9 identity failed", { viewport, initial });
    await page.evaluate(() => { window.__BREAKOUT_MOTION_PROBE__ = { board: document.querySelector(".brick-board"), target: document.querySelector('[data-shot-target="true"]') }; });
    await click(page, "fire");
    const hitMotion = await page.evaluate(() => {
      const probe = window.__BREAKOUT_MOTION_PROBE__;
      return {
        sameBoard: probe.board === document.querySelector(".brick-board"),
        sameBrick: probe.board.contains(probe.target),
        clearing: probe.target.classList.contains("cleared") && probe.target.classList.contains("is-clearing"),
        visibleDuringClear: getComputedStyle(probe.target).visibility,
        transition: getComputedStyle(probe.target).transitionDuration,
        nextTarget: document.querySelector('[data-shot-target="true"]')?.dataset.index,
      };
    });
    assert(hitMotion.sameBoard && hitMotion.sameBrick && hitMotion.clearing && hitMotion.visibleDuringClear === "visible" && /0\.19s/.test(hitMotion.transition) && hitMotion.nextTarget === "8",
      "Hit did not preserve the board and animate clear/retarget without layout changes", { viewport, hitMotion });
    await capture(page, `${viewport.width}x${viewport.height}-hit`);
    await click(page, "fire");
    const clearedLane = await state(page);
    assert(clearedLane.bricks === 10 && clearedLane.laneState === "clear" && clearedLane.target === null && clearedLane.shots === 2, "Cleared lane still auto-targeted another column", { viewport, clearedLane });
    await click(page, "fire");
    const missed = await state(page);
    assert(missed.bricks === 10 && missed.shots === 3 && missed.score === 40 && missed.messageKey === "breakoutMiss", "Empty-lane Serve was not a scoreless miss", { viewport, missed });
    const missMotion = await page.evaluate(() => {
      const board = document.querySelector(".brick-board");
      return {
        outcome: board?.dataset.shotOutcome,
        boardAnimation: board?.getAnimations().some((animation) => animation.effect?.target === board),
      };
    });
    assert(missMotion.outcome === "miss" && missMotion.boardAnimation, "Missed Serve lacks an immediate bounded visual cue", { viewport, missMotion });
    await capture(page, `${viewport.width}x${viewport.height}-miss`);
    if (viewport.width === 390) {
      for (const [locale, expected] of Object.entries(missCopy)) {
        await page.evaluate((nextLocale) => { const select = document.querySelector("#localeSelect"); select.value = nextLocale; select.dispatchEvent(new Event("change", { bubbles: true })); }, locale);
        assert((await state(page)).message === expected, "Localized empty-lane feedback failed", { locale, actual: (await state(page)).message, expected });
      }
      await page.evaluate(() => { const select = document.querySelector("#localeSelect"); select.value = "en"; select.dispatchEvent(new Event("change", { bubbles: true })); });
    }
    await clearRemainingFromColumnThree(page);
    const inefficient = await state(page);
    assert(inefficient.shots === 13 && /12/.test(inefficient.goal) && /shots/iu.test(inefficient.goal), "Missed round did not produce a 12-shot rematch target", { viewport, inefficient });
    await page.locator("#retryBtn").click();
    await fireTwice(page);
    await clearRemainingFromColumnThree(page);
    const clean = await state(page);
    assert(clean.shots === 12 && /12/.test(clean.goal) && /shot/iu.test(clean.goal), "Clean lane route did not preserve the 12-shot Result goal", { viewport, clean });
    const resultMotion = await page.evaluate(() => window.__BREAKOUT_RESULT_MOTION__ || []);
    const resultAnimations = resultMotion.flat();
    const resultEntrances = resultAnimations.filter((animation) => animation.duration === 190 && animation.keyframes.some((frame) => frame.transform));
    const resultExits = resultAnimations.filter((animation) => animation.duration === 170 && animation.keyframes.some((frame) => frame.opacity === "1") && animation.keyframes.some((frame) => frame.opacity === "0"));
    assert(resultEntrances.length === 2 && resultExits.length === 1,
      "Reused Result card must receive two finite entrances and one finite exit", { viewport, resultEntrances, resultExits, resultMotion });
    await capture(page, `${viewport.width}x${viewport.height}-result`);
    const funnelEvents = await page.evaluate(() => window.__BREAKOUT_FUNNEL_EVENTS__ || []);
    const count = (name) => funnelEvents.filter((event) => event.name === name).length;
    const requiredCounts = { breakout_game_start: 2, breakout_first_serve: 2, breakout_first_brick_clear: 2, breakout_result: 2, breakout_play_again: 1, breakout_return_main: 0 };
    assert(Object.entries(requiredCounts).every(([name, expected]) => count(name) === expected), "Breakout funnel milestones were not exactly once per round", { viewport, requiredCounts, counts: Object.fromEntries(Object.keys(requiredCounts).map((name) => [name, count(name)])), funnelEvents });
    const ownedEvents = funnelEvents.filter((event) => event.name.startsWith("breakout_"));
    assert(ownedEvents.every((event) => event.data?.game_id === "breakout" && event.data?.game_version === "v20" && event.data?.interface_version === "9" && event.data?.locale === "en" && event.data?.viewport_bucket === viewportBucket(viewport)), "Breakout funnel event identity or coarse viewport context drifted", { viewport, ownedEvents });
    assert(ownedEvents.every((event) => !["user_id", "email", "name", "row", "column", "x", "y", "url", "path", "text", "message"].some((field) => field in event.data)), "Breakout funnel emitted a prohibited personal or free-form field", { viewport, ownedEvents });
    assert(clean.scroll.width <= clean.viewport.width + 1 && clean.scroll.height <= clean.viewport.height + 1 && errors.length === 0, "Breakout v20/I9 escaped viewport or emitted diagnostics", { viewport, clean, errors });
    evidence.push({ viewport: `${viewport.width}x${viewport.height}`, missShots: inefficient.shots, cleanShots: clean.shots, localizedMiss: viewport.width === 390 ? Object.keys(missCopy).length : 0, funnel: Object.fromEntries(Object.keys(requiredCounts).map((name) => [name, count(name)])) });
    await page.locator("#resultStagesBtn").click();
    const resultExit = await page.evaluate(() => ({
      visible: !document.querySelector("#resultScreen").hidden,
      inert: document.querySelector("#resultScreen").inert,
      leaving: document.querySelector("#resultScreen").hasAttribute("data-wp-breakout-leaving"),
      resultActive: document.body.hasAttribute("data-wp-result-active"),
      battleHidden: document.querySelector('[data-wp-frame-scene="battle"]').hidden,
    }));
    assert(resultExit.visible && resultExit.inert && resultExit.leaving && resultExit.resultActive && !resultExit.battleHidden,
      "Result exit is not retained as an inert visual layer during the Stage transition", { viewport, resultExit });
    await page.waitForTimeout(190);
    assert(await page.evaluate(() => document.querySelector("#resultScreen").hidden
      && !document.body.hasAttribute("data-wp-result-active")
      && document.querySelector('[data-wp-frame-scene="battle"]').hidden
      && document.body.dataset.screen === "stage"),
    "Result exit did not clear its Battle overlay and return cleanly to Stage", { viewport });
    const selectedStage = await page.locator('#stageRail .stage-card[aria-current="true"]').getAttribute("data-stage-index");
    await page.locator('#stageRail .stage-card[aria-current="true"]').click();
    await page.waitForTimeout(190);
    const secondJourneyStart = await page.evaluate(() => ({
      mainHidden: document.querySelector('[data-wp-frame-scene="main"]').hidden,
      stageHidden: document.querySelector('[data-wp-frame-scene="stage"]').hidden,
      battleVisible: !document.querySelector('[data-wp-frame-scene="battle"]').hidden,
      lane: document.querySelector(".brick-board")?.dataset.shotColumn,
      selectedStage: document.querySelector('#stageRail .stage-card[aria-current="true"]')?.dataset.stageIndex,
    }));
    assert(secondJourneyStart.mainHidden && secondJourneyStart.stageHidden && secondJourneyStart.battleVisible
      && secondJourneyStart.lane === "3" && secondJourneyStart.selectedStage === selectedStage,
    "Second reload-free Stage-to-Battle journey lost its scene or selection", { viewport, selectedStage, secondJourneyStart });
    await fireTwice(page);
    await clearRemainingFromColumnThree(page);
    const secondJourneyResult = await state(page);
    assert(secondJourneyResult.shots === 12 && await page.locator("#resultScreen:not([hidden])").isVisible(),
      "Second reload-free journey did not reach its natural Result", { viewport, secondJourneyResult });
    await page.locator("#resultStagesBtn").click();
    await page.waitForTimeout(190);
    const nextStageCatalog = await page.evaluate(() => {
      const selected = document.querySelector('#stageRail .stage-card[aria-current="true"]');
      return {
        active: document.body.dataset.screen === "stage"
          && document.querySelector("#resultScreen").hidden
          && !document.querySelector('[data-wp-frame-scene="stage"]').hidden,
        index: selected?.dataset.stageIndex ?? null,
        poster: selected && getComputedStyle(selected.querySelector(".wp-stage-i9-card-art")).backgroundImage,
      };
    });
    assert(nextStageCatalog.active && nextStageCatalog.index !== null && nextStageCatalog.poster.includes("breakout-cover-v1.webp"),
      "Second reload-free journey did not return to Stage with the newly selected poster", { viewport, selectedStage, nextStageCatalog });
    evidence.at(-1).reloadFreeJourneys = 2;
    evidence.at(-1).secondJourneySelectedStage = nextStageCatalog.index;
    await capture(page, `${viewport.width}x${viewport.height}-second-stage-return`);
    await context.close();
  }
  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${origin}/games/breakout/`, { waitUntil: "networkidle" });
  await reducedPage.locator("#startBtn").click();
  await reducedPage.locator('#stageRail [aria-current="true"]').click();
  await click(reducedPage, "fire");
  const reducedHit = await reducedPage.evaluate(() => ({
    transition: getComputedStyle(document.querySelector(".brick-board .brick.cleared.is-clearing")).transitionDuration,
    visibleDuringClear: getComputedStyle(document.querySelector(".brick-board .brick.cleared.is-clearing")).visibility,
    transform: getComputedStyle(document.querySelector(".brick-board .brick.cleared.is-clearing")).transform,
  }));
  assert(/0\.08s/.test(reducedHit.transition) && reducedHit.visibleDuringClear === "visible" && reducedHit.transform === "none",
    "Reduced-motion hit feedback retains emphasis without travel", reducedHit);
  await click(reducedPage, "fire");
  await reducedPage.evaluate(() => {
    window.__BREAKOUT_REDUCED_RESULT_MOTION__ = [];
    window.addEventListener("weightplay:breakout-screen", () => {
      if (!document.body.hasAttribute("data-wp-result-active")) return;
      const card = document.querySelector("#resultScreen .result-card");
      window.__BREAKOUT_REDUCED_RESULT_MOTION__.push((card?.getAnimations() || []).map((animation) => ({
        duration: animation.effect?.getTiming().duration,
        keyframes: animation.effect?.getKeyframes().map((frame) => ({ opacity: frame.opacity, transform: frame.transform })),
      })));
    });
  });
  await clearRemainingFromColumnThree(reducedPage);
  const reducedResultMotion = await reducedPage.evaluate(() => window.__BREAKOUT_REDUCED_RESULT_MOTION__ || []);
  assert(reducedResultMotion.length === 1 && reducedResultMotion[0].some((animation) =>
    animation.duration === 90 && animation.keyframes.length === 2 && animation.keyframes.every((frame) => !frame.transform)),
  "Reduced-motion Result uses a short fade without movement", reducedResultMotion);
  await reducedContext.close();
  console.log(JSON.stringify({ status: "PASS", gameVersion: "v20", interfaceVersion: 9, evidence }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
