import fs from "node:fs";
import assert from "node:assert/strict";

const gameSource = fs.readFileSync("src/game.js", "utf8");
const dataSource = fs.readFileSync("src/game-data.js", "utf8");
const locales = ["ja", "ko", "pt-BR", "fr", "de", "it", "ru", "hi"];
const routes = [
  "games/wonder-crash/index.html",
  "en/games/wonder-crash/index.html",
  "zh-tw/games/wonder-crash/index.html",
  "zh-cn/games/wonder-crash/index.html",
  "ja/games/wonder-crash/index.html",
  "ko/games/wonder-crash/index.html",
  "es/games/wonder-crash/index.html",
  "pt-br/games/wonder-crash/index.html",
  "fr/games/wonder-crash/index.html",
  "de/games/wonder-crash/index.html",
  "it/games/wonder-crash/index.html",
  "ru/games/wonder-crash/index.html",
  "hi/games/wonder-crash/index.html",
  "ar/games/wonder-crash/index.html",
].map((file) => fs.readFileSync(file, "utf8"));

assert.match(dataSource, /const localeStageCopy = \{/);
assert.match(dataSource, /titleByLocale/);
assert.match(dataSource, /ruleByLocale/);
assert.match(dataSource, /bossRuleByLocale/);
assert.match(gameSource, /const WONDER_DYNAMIC_COPY = \{/);
assert.match(gameSource, /level\.titleByLocale\?\./);
assert.match(gameSource, /level\.ruleByLocale\?\./);
assert.match(gameSource, /wave\.bossRuleByLocale\?\./);
for (const locale of locales) {
  assert.match(dataSource, new RegExp(`(?:^|\\n)\\s*["']?${locale.replace("-", "\\-")}["']?\\s*:`));
  assert.match(gameSource, new RegExp(`(?:^|\\n)\\s*["']?${locale.replace("-", "\\-")}["']?\\s*:`));
}
for (const route of routes) {
  assert.match(route, /20260822-dynamic-locale-v12/);
  assert.doesNotMatch(route, /20260821-arabic-dynamic-v12/);
}

console.log(JSON.stringify({
  pass: true,
  exactGameVersion: 12,
  affectedLocales: locales.length,
  routeCount: routes.length,
  stageFields: ["titleByLocale", "ruleByLocale"],
  bossField: "bossRuleByLocale",
}));
