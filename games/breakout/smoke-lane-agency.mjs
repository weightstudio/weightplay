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
  response.writeHead(200, { "content-type": { ".css": "text/css", ".html": "text/html", ".js": "text/javascript" }[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await playwright.chromium.launch({ headless: true });
const origin = `http://127.0.0.1:${server.address().port}`;
const viewports = [{ width: 390, height: 844 }, { width: 612, height: 876 }, { width: 844, height: 390 }, { width: 1280, height: 720 }];
const missCopy = {
  en: "Column 3 is clear — move the paddle before serving.", "zh-Hant": "第 3 欄已清空——發球前先移動球拍。", "zh-Hans": "第 3 列已清空——发球前先移动球拍。",
  ja: "第3列は空です。サーブの前にパドルを動かしましょう。", ko: "3번 열은 비었습니다. 서브하기 전에 패들을 옮기세요.", es: "La columna 3 está vacía: mueve la pala antes de sacar.",
  "pt-BR": "A coluna 3 está vazia — mova a raquete antes de sacar.", fr: "La colonne 3 est vide : déplacez la raquette avant de servir.", de: "Spalte 3 ist frei – bewege das Paddle vor dem Aufschlag.",
  it: "La colonna 3 è vuota: sposta la racchetta prima del servizio.", ru: "Столбец 3 пуст — перед подачей переместите ракетку.", hi: "स्तंभ 3 खाली है—सर्व करने से पहले पैडल चलाएँ।", ar: "العمود 3 فارغ — حرّك المضرب قبل الإرسال.",
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
  screen: document.body.dataset.screen,
  lane: document.querySelector(".brick-board")?.dataset.shotColumn,
  laneState: document.querySelector(".brick-board")?.dataset.laneState,
  shots: Number(document.querySelector(".brick-board")?.dataset.shotCount),
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
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width <= 612 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error" && !/favicon|Failed to load resource/iu.test(message.text())) errors.push(message.text()); });
    await page.goto(`${origin}/games/breakout/?preview=1`, { waitUntil: "networkidle" });
    await page.locator("#startBtn").click();
    const initial = await state(page);
    assert(initial.version === "v6" && initial.lane === "3" && initial.laneState === "armed" && initial.target === "2", "Initial lane target or v6 identity failed", { viewport, initial });
    await fireTwice(page);
    const clearedLane = await state(page);
    assert(clearedLane.bricks === 10 && clearedLane.laneState === "clear" && clearedLane.target === null && clearedLane.shots === 2, "Cleared lane still auto-targeted another column", { viewport, clearedLane });
    await click(page, "fire");
    const missed = await state(page);
    assert(missed.bricks === 10 && missed.shots === 3 && missed.numbers[0] === 40 && missed.messageKey === "breakoutMiss", "Empty-lane Serve was not a scoreless miss", { viewport, missed });
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
    assert(clean.scroll.width <= clean.viewport.width + 1 && clean.scroll.height <= clean.viewport.height + 1 && errors.length === 0, "Breakout v6 escaped viewport or emitted diagnostics", { viewport, clean, errors });
    evidence.push({ viewport: `${viewport.width}x${viewport.height}`, missShots: inefficient.shots, cleanShots: clean.shots, localizedMiss: viewport.width === 390 ? Object.keys(missCopy).length : 0 });
    await context.close();
  }
  console.log(JSON.stringify({ status: "PASS", gameVersion: "v6", evidence }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
