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

const browser = await playwright.chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true });
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
  await page.goto(`http://127.0.0.1:${server.address().port}/games/tic-tac-toe/?preview=1`, { waitUntil: "networkidle" });
  await page.locator("#startBtn").click();
  await page.locator('[data-action="cell"][data-value="0"]').click();
  const rivalReply = await page.evaluate(() => ({
    message: document.querySelector("#gameMessage")?.textContent || "",
    messageKey: document.querySelector("#gameMessage")?.dataset.messageKey || "",
    cells: [...document.querySelectorAll('[data-rival-reply="true"]')].map((node) => ({
      value: node.getAttribute("data-value"),
      text: node.textContent,
    })),
  }));
  assert(rivalReply.messageKey === "ticRivalReply" && rivalReply.cells.length === 1 && rivalReply.cells[0].value === "4" && /O/iu.test(rivalReply.message), "Rival response cue did not identify the tactical O cell", rivalReply);
  await page.waitForTimeout(820);
  const settledReply = await page.evaluate(() => ({
    messageKey: document.querySelector("#gameMessage")?.dataset.messageKey || "",
    cells: document.querySelectorAll('[data-rival-reply="true"]').length,
  }));
  assert(settledReply.messageKey !== "ticRivalReply" && settledReply.cells === 0, "Rival response cue did not settle before the next choice", settledReply);
  const battle = await page.evaluate(() => {
    const rect = (node) => {
      const value = node?.getBoundingClientRect();
      return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
    };
    return {
      screen: document.body.dataset.screen,
      overflow: getComputedStyle(document.body).overflow,
      scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewport: { width: innerWidth, height: innerHeight },
      board: rect(document.querySelector(".tic-board")),
      cells: [...document.querySelectorAll(".tic-cell")].map(rect),
      firstEmpty: rect(document.querySelector('.tic-cell:not(:disabled)')),
      hint: rect(document.querySelector("#hintBtn")),
      locale: rect(document.querySelector("#localeSelect")),
    };
  });
  assert(battle.screen === "battle" && battle.overflow === "hidden" && battle.scrollY <= 1 && battle.scrollHeight <= battle.viewport.height + 1, "Battle escaped the short-landscape envelope", battle);
  assert(battle.cells.length === 9 && battle.cells.every((box) => inside(box, battle.viewport.width, battle.viewport.height)), "Tic-Tac-Toe cells are not reachable in the first frame", battle);
  assert(inside(battle.firstEmpty, battle.viewport.width, battle.viewport.height) && inside(battle.hint, battle.viewport.width, battle.viewport.height) && inside(battle.locale, battle.viewport.width, battle.viewport.height), "Tic-Tac-Toe first action or compact controls are not reachable", battle);
  for (const value of [8, 6, 7]) await page.locator(`[data-action="cell"][data-value="${value}"]`).click();
  const winningCells = await page.locator('.tic-cell[data-winning-cell="true"]').count();
  assert(winningCells === 3 && await page.locator(".tic-board").getAttribute("data-winning-count") === "3", "Winning-line emphasis was not exposed before Result", { winningCells });
  await page.locator("#resultScreen:not([hidden])").waitFor({ state: "visible" });
  const result = await page.evaluate(() => {
    const rect = (node) => {
      const value = node?.getBoundingClientRect();
      return value ? { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height } : null;
    };
    return {
      screen: document.body.dataset.screen,
      scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewport: { width: innerWidth, height: innerHeight },
      title: document.querySelector("#resultTitle")?.textContent,
      actions: rect(document.querySelector(".result-actions")),
      retry: rect(document.querySelector("#retryBtn")),
      home: rect(document.querySelector("#homeBtn")),
      locale: rect(document.querySelector("#localeSelect")),
    };
  });
  assert(result.screen === "result" && /three|三格|tres|3つ|세 칸|linha|align|reihe|tris|три|तीन|ثلاثة/iu.test(result.title || ""), "Natural Tic-Tac-Toe win Result is missing", result);
  assert(result.scrollY <= 1 && result.scrollHeight <= result.viewport.height + 1 && inside(result.actions, result.viewport.width, result.viewport.height) && inside(result.retry, result.viewport.width, result.viewport.height) && inside(result.home, result.viewport.width, result.viewport.height) && inside(result.locale, result.viewport.width, result.viewport.height), "Result recovery actions are not reachable in the first frame", result);
  assert(errors.length === 0, "Tic-Tac-Toe short-landscape smoke emitted browser errors", errors);
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), viewport: "844x390", route: "Main > Battle > tactical rival response > four-move natural win Result", rivalReply, settledReply, battle, result, errors }, null, 2));
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
