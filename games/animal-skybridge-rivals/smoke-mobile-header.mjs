import fs from "node:fs";
import http from "node:http";
import Module from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(".");
const runtime = path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node");
process.env.NODE_PATH = [process.env.NODE_PATH, path.join(runtime, "node_modules", ".pnpm", "node_modules")].filter(Boolean).join(path.delimiter);
Module._initPaths();
const { default: playwright } = await import(pathToFileURL(path.join(runtime, "node_modules", "playwright", "index.js")).href);
const executablePath = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"].find(fs.existsSync);
if (!executablePath) throw new Error("Edge is unavailable.");

const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://local").pathname);
  let file = path.join(root, pathname);
  if (pathname.endsWith("/")) file = path.join(file, "index.html");
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": mime[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await playwright.chromium.launch({ headless: true, executablePath });
const viewports = [{ width: 390, height: 844 }, { width: 612, height: 876 }, { width: 844, height: 390 }, { width: 1280, height: 720 }];
const assert = (condition, message, detail) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(detail)}`); };

try {
  const evidence = [];
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${origin}/games/animal-skybridge-rivals/index.html?trial=1&growth=20260814`, { waitUntil: "networkidle" });
    await page.locator('body[data-screen="main"]').waitFor();
    await page.locator("#start").click();
    await page.locator('body[data-screen="stage"]').waitFor();
    const measure = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: box.width, height: box.height, text: element.textContent.trim() };
      };
      const title = rect(".stage-header > strong");
      const mascot = rect(".stage-header > .fia-portrait");
      const settings = rect(".stage-header > .wp-shell-settings");
      const overlap = (a, b) => Boolean(a && b && a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y);
      const inside = (box) => Boolean(box && box.x >= 0 && box.y >= 0 && box.right <= innerWidth + 0.5 && box.bottom <= innerHeight + 0.5);
      return { title, mascot, settings, overlapTitleMascot: overlap(title, mascot), overlapTitleSettings: overlap(title, settings), titleInside: inside(title), mascotInside: inside(mascot), settingsInside: inside(settings), scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, scrollY };
    });
    assert(measure.title?.text, `${viewport.width}x${viewport.height}: Stage title missing`, measure);
    assert(!measure.overlapTitleMascot && !measure.overlapTitleSettings, `${viewport.width}x${viewport.height}: Stage title overlaps a header owner`, measure);
    assert(measure.titleInside && measure.mascotInside && measure.settingsInside, `${viewport.width}x${viewport.height}: header owner leaves the viewport`, measure);
    assert(measure.scrollWidth <= viewport.width && measure.scrollHeight <= viewport.height && measure.scrollY === 0, `${viewport.width}x${viewport.height}: Stage document overflow`, measure);
    assert(errors.length === 0, `${viewport.width}x${viewport.height}: browser errors`, errors);
    evidence.push({ viewport: `${viewport.width}x${viewport.height}`, measure });
    await page.close();
  }
  console.log("PASS Animal Skybridge Rivals responsive Stage header ownership", JSON.stringify(evidence));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
