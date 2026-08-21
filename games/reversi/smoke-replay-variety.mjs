import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const tag = "20260822-reversi-replay-variety-v7";
const locales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
const routeLocales = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "pt-br", "fr", "de", "it", "ru", "hi", "ar"];
const sourcePath = path.join(root, "games/reversi/game.js");
const analyticsPath = path.join(root, "games/reversi/analytics-ownership.js");
const source = fs.readFileSync(sourcePath, "utf8");
const analytics = fs.readFileSync(analyticsPath, "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(source.includes('const GAME_VERSION = "v7"'), "route adapter is not Game v7");
check(source.includes("const SCENARIOS = [") && (source.match(/key: /gu) || []).length === 3, "three bounded replay scenarios are not defined");
check((source.match(/copy: \{/gu) || []).length === 3, "each replay scenario does not own a copy map");
check(source.includes("scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length"), "Replay does not rotate the scenario focus");
check(source.includes('tutorial.dataset.reversiScenario') && source.includes('tutorial.setAttribute("role", "note")'), "scenario focus is not exposed through the owned Battle tutorial");
for (const locale of locales) check(source.includes(`${locale}:`) || source.includes(`"${locale}":`), `scenario copy is missing locale ${locale}`);
check(analytics.includes('const GAME_VERSION = "v7"'), "analytics identity is not v7");

const routeFiles = ["games/reversi/index.html", ...routeLocales.map((locale) => `${locale}/games/reversi/index.html`)];
const routeResults = routeFiles.map((file) => {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  return { file, current: html.includes(tag), stale: html.includes("20260820-reversi-strategic-payoff-v6") };
});
check(routeResults.every((row) => row.current), "not all 14 Reversi route shells carry the v7 identity");
check(routeResults.every((row) => !row.stale), "a Reversi route shell retains the v6 identity");

console.log(JSON.stringify({
  pass: failures.length === 0,
  game: "reversi",
  gameVersion: 7,
  interfaceVersion: 6,
  check: "REVERSI_REPLAY_VARIETY_001",
  scenarios: 3,
  localeCopies: 13,
  routeCount: routeResults.filter((row) => row.current).length,
  contract: "route-owned optional corner, mobility, and edge planning focuses rotate on Replay",
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
