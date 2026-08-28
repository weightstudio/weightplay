import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("./game.js", import.meta.url), "utf8");
const routes = [
  "games/go-fish/index.html",
  "en/games/go-fish/index.html",
  "zh-tw/games/go-fish/index.html",
  "zh-cn/games/go-fish/index.html",
  "ja/games/go-fish/index.html",
  "ko/games/go-fish/index.html",
  "es/games/go-fish/index.html",
  "pt-br/games/go-fish/index.html",
  "fr/games/go-fish/index.html",
  "de/games/go-fish/index.html",
  "it/games/go-fish/index.html",
  "ru/games/go-fish/index.html",
  "hi/games/go-fish/index.html",
  "ar/games/go-fish/index.html",
].map((file) => fs.readFileSync(file, "utf8"));

const locales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];

assert.match(source, /const GAME_VERSION = "v16"/);
assert.match(source, /const RECENT_ASK_COPY = \{/);
assert.match(source, /recentAsks\.unshift\(\{ rank, opponent: opponentName \}\)/);
assert.match(source, /recentAsks\.splice\(3\)/);
assert.match(source, /data-go-fish-recent-asks/);
assert.match(source, /record\.dataset\.runtimeLocalize = "off"/);
assert.match(source, /new MutationObserver\(syncRecentAskRecord\)/);
assert.match(source, /resetRecentAsks\(\)/);
for (const locale of locales) {
  assert.match(source, new RegExp(`(?:^|\\n)\\s*["']?${locale.replace("-", "\\-")}["']?\\s*:`));
}
for (const route of routes) {
  assert.match(route, /game\.js\?v=20260828-go-fish-main-guide-flow-v16/);
  assert.doesNotMatch(route, /20260821-result-actions-locale-v12/);
}

console.log(JSON.stringify({
  pass: true,
  gameVersion: 16,
  localeCopies: locales.length,
  routeCount: routes.length,
  maxRecentAsks: 3,
  record: "data-go-fish-recent-asks",
}));
