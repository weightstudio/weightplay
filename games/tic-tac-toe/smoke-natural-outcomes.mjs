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
if (!fs.existsSync(playwrightPath)) throw new Error("Tic-Tac-Toe outcome smoke requires the bundled Playwright runtime.");
const { default: playwright } = await import(pathToFileURL(playwrightPath).href);

const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript" };
const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://local");
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (file.endsWith(path.sep)) file = path.join(file, "index.html");
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": mime[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await playwright.chromium.launch({ headless: true });
const origin = `http://127.0.0.1:${server.address().port}`;
const viewports = [{ width: 390, height: 844 }, { width: 612, height: 876 }, { width: 844, height: 390 }, { width: 1280, height: 720 }];
const localizedDrawTitles = {
  en: "Draw", "zh-Hant": "平手", "zh-Hans": "平局", ja: "引き分け", ko: "무승부", es: "Empate", "pt-BR": "Empate",
  fr: "Match nul", de: "Unentschieden", it: "Pareggio", ru: "Ничья", hi: "बराबरी", ar: "تعادل",
};
const assert = (condition, message, details = {}) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(details)}`); };
const clickMoves = async (page, moves) => {
  for (const value of moves) await page.locator(`[data-action="cell"][data-value="${value}"]`).click();
  await page.locator("#resultScreen:not([hidden])").waitFor({ state: "visible" });
};
const outcome = (page) => page.evaluate(() => ({
  version: document.body.dataset.gameVersion,
  outcome: document.querySelector("#resultScreen")?.dataset.outcome,
  title: document.querySelector("#resultTitle")?.textContent,
  copy: document.querySelector("#resultCopy")?.textContent,
  board: [...document.querySelectorAll(".tic-cell")].map((cell) => cell.textContent),
  winning: [...document.querySelectorAll('[data-winning-cell="true"]')].map((cell) => cell.textContent),
  htmlOverflow: getComputedStyle(document.documentElement).overflow,
  bodyOverflow: getComputedStyle(document.body).overflow,
  scrollWidth: document.documentElement.scrollWidth,
  scrollHeight: document.documentElement.scrollHeight,
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
    await page.goto(`${origin}/games/tic-tac-toe/?preview=1`, { waitUntil: "networkidle" });
    await page.locator("#startBtn").click();

    await clickMoves(page, [0, 1, 3]);
    const loss = await outcome(page);
    assert(loss.version === "v17" && loss.outcome === "loss" && loss.winning.length === 3 && loss.winning.every((mark) => mark === "O"), "Tactical rival loss branch failed", { viewport, loss });

    await page.locator("#retryBtn").click();
    await clickMoves(page, [0, 1, 6, 5, 7]);
    const draw = await outcome(page);
    assert(draw.outcome === "draw" && draw.winning.length === 0 && draw.board.every(Boolean), "Full-board draw branch failed", { viewport, draw });
    if (viewport.width === 390) {
      for (const [locale, title] of Object.entries(localizedDrawTitles)) {
        await page.evaluate((nextLocale) => { const select = document.querySelector("#localeSelect"); select.value = nextLocale; select.dispatchEvent(new Event("change", { bubbles: true })); }, locale);
        const localized = await outcome(page);
        assert(localized.title === title && localized.copy && !/undefined|null/iu.test(localized.copy), "Localized draw Result failed", { locale, localized });
      }
      await page.evaluate(() => { const select = document.querySelector("#localeSelect"); select.value = "en"; select.dispatchEvent(new Event("change", { bubbles: true })); });
    }

    await page.locator("#retryBtn").click();
    await clickMoves(page, [0, 8, 6, 7]);
    const win = await outcome(page);
    assert(win.outcome === "win" && win.winning.length === 3 && win.winning.every((mark) => mark === "X"), "Player fork win branch failed", { viewport, win });
    for (const state of [loss, draw, win]) {
      assert(state.htmlOverflow === "hidden" && state.bodyOverflow === "hidden" && state.scrollWidth <= state.viewport.width + 1 && state.scrollHeight <= state.viewport.height + 1, "Outcome escaped the active viewport", { viewport, state });
    }
    assert(errors.length === 0, "Browser diagnostics were not empty", { viewport, errors });
    evidence.push({ viewport: `${viewport.width}x${viewport.height}`, outcomes: [loss.outcome, draw.outcome, win.outcome], localizedDraw: viewport.width === 390 ? Object.keys(localizedDrawTitles).length : 0 });
    await context.close();
  }
  console.log(JSON.stringify({ status: "PASS", gameVersion: "v17", evidence }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
