import fs from "node:fs";
import http from "node:http";
import Module from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(".");
const runtime = path.join(process.env.USERPROFILE || process.env.HOME || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node");
process.env.NODE_PATH = [process.env.NODE_PATH, path.join(runtime, "node_modules"), path.join(runtime, "node_modules", ".pnpm", "node_modules")].filter(Boolean).join(path.delimiter);
Module._initPaths();
const playwrightEntry = path.join(runtime, "node_modules", "playwright", "index.js");
const executablePath = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"].find(fs.existsSync);
if (!fs.existsSync(playwrightEntry)) throw new Error("Canonical standalone Playwright runtime is unavailable.");
const { default: playwright } = await import(pathToFileURL(playwrightEntry).href);

const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript" };
const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://local");
  if (url.pathname === "/favicon.ico") return response.writeHead(204).end();
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (file.endsWith(path.sep)) file = path.join(file, "index.html");
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": mime[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await playwright.chromium.launch(executablePath ? { executablePath, headless: true } : { headless: true });
const errors = [];
const rect = (node) => {
  const value = node?.getBoundingClientRect();
  return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
};
const inside = (box, width, height) => Boolean(box && box.left >= -1 && box.top >= -1 && box.right <= width + 1 && box.bottom <= height + 1);
const assert = (condition, message, details = {}) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(details)}`); };

try {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error" && !/favicon|Failed to load resource/iu.test(message.text())) errors.push(`console: ${message.text()}`); });
  page.on("response", (response) => { if (response.status() >= 400 && !/favicon/iu.test(response.url())) errors.push(`http ${response.status()}: ${response.url()}`); });
  await page.goto(`http://127.0.0.1:${server.address().port}/games/wordle/?preview=1`, { waitUntil: "networkidle" });
  await page.locator("#startBtn").click();
  assert(await page.locator("body").getAttribute("data-game-version") === "v6", "Wordle runtime identity is not v6");
  await page.locator("#wordInput").fill("CRANE");
  await page.locator('[data-action="submit"]').click();
  const battle = await page.evaluate(() => {
    const rect = (node) => {
      const value = node?.getBoundingClientRect();
      return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
    };
    const width = innerWidth;
    const height = innerHeight;
    return {
      screen: document.body.dataset.screen,
      overflow: getComputedStyle(document.body).overflow,
      scrollY: scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewport: { width, height },
      board: rect(document.querySelector(".wordle-board")),
      cells: [...document.querySelectorAll(".word-cell")].map(rect),
      boardSemantics: {
        role: document.querySelector(".wordle-board")?.getAttribute("role"),
        label: document.querySelector(".wordle-board")?.getAttribute("aria-label"),
        rows: [...document.querySelectorAll(".wordle-row")].map((row) => row.getAttribute("role")),
        cells: [...document.querySelectorAll(".word-cell")].map((cell) => ({ role: cell.getAttribute("role"), label: cell.getAttribute("aria-label"), state: cell.dataset.wordState, row: cell.parentElement?.getAttribute("aria-rowindex"), column: cell.getAttribute("aria-colindex") })),
      },
      input: rect(document.querySelector("#wordInput")),
      submit: rect(document.querySelector('[data-action="submit"]')),
      hint: rect(document.querySelector("#hintBtn")),
    };
  });
  assert(battle.screen === "battle" && battle.overflow === "hidden" && battle.scrollY <= 1 && battle.scrollHeight <= battle.viewport.height + 1, "Battle escaped the short-landscape envelope", battle);
  assert(battle.cells.length === 30 && battle.cells.every((box) => inside(box, battle.viewport.width, battle.viewport.height)), "Wordle board cells are not reachable in the first frame", battle);
  const firstGuessStates = battle.boardSemantics.cells.slice(0, 5).map((cell) => cell.state).join(",");
  assert(battle.boardSemantics.role === "table" && battle.boardSemantics.label && battle.boardSemantics.rows.length === 6 && battle.boardSemantics.rows.every((role) => role === "row") && battle.boardSemantics.cells.length === 30 && battle.boardSemantics.cells.every((cell) => cell.role === "cell" && cell.label && cell.row && cell.column) && firstGuessStates === "miss,hit,hit,miss,hit" && battle.boardSemantics.cells.slice(5).every((cell) => cell.state === "empty"), "Wordle guessed and empty cells are missing localized table semantics", battle.boardSemantics);
  assert(inside(battle.input, battle.viewport.width, battle.viewport.height) && inside(battle.submit, battle.viewport.width, battle.viewport.height), "Wordle input and Submit are not reachable in the first frame", battle);
  if (process.env.WORDLE_SMOKE_SCREENSHOTS === "1") await page.screenshot({ path: path.join(process.env.TEMP || process.env.TMP || ".", "wordle-v6-844x390-battle.png"), fullPage: false });
  await page.locator("#wordInput").fill("BRAVE");
  await page.locator('[data-action="submit"]').click();
  const feedbackSemantics = await page.evaluate(() => ({
    cells: [...document.querySelectorAll(".word-cell")].slice(0, 5).map((cell) => ({ label: cell.getAttribute("aria-label"), state: cell.dataset.wordState, letter: cell.textContent.trim() })),
  }));
  assert(feedbackSemantics.cells.map((cell) => cell.state).join(",") === "miss,hit,hit,miss,hit" && feedbackSemantics.cells.every((cell) => cell.label && cell.label.includes(cell.letter)), "Wordle feedback states are missing accessible labels", feedbackSemantics);
  await page.locator("#resultScreen:not([hidden])").waitFor({ state: "visible" });
  const result = await page.evaluate(() => {
    const rect = (node) => {
      const value = node?.getBoundingClientRect();
      return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
    };
    const width = innerWidth;
    const height = innerHeight;
    return {
      screen: document.body.dataset.screen,
      scrollY: scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewport: { width, height },
      title: document.querySelector("#resultTitle")?.textContent,
      actions: rect(document.querySelector(".result-actions")),
      retry: rect(document.querySelector("#retryBtn")),
      home: rect(document.querySelector("#homeBtn")),
    };
  });
  assert(result.screen === "result" && /cleared|挑戰|desafío|クリア|클리어|conclu/iu.test(result.title || ""), "Natural Wordle success Result is missing", result);
  assert(result.scrollY <= 1 && result.scrollHeight <= result.viewport.height + 1 && inside(result.actions, result.viewport.width, result.viewport.height) && inside(result.retry, result.viewport.width, result.viewport.height) && inside(result.home, result.viewport.width, result.viewport.height), "Result recovery actions are not reachable in the first frame", result);
  if (process.env.WORDLE_SMOKE_SCREENSHOTS === "1") await page.screenshot({ path: path.join(process.env.TEMP || process.env.TMP || ".", "wordle-v6-844x390-result.png"), fullPage: false });
  assert(errors.length === 0, "Wordle short-landscape smoke emitted browser errors", errors);
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), viewport: "844x390", route: "Main > Battle > valid guess > natural success Result", battle, feedbackSemantics, result, errors }, null, 2));
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
