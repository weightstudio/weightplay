import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const tag = "20260827-reversi-guide-boundary-v9";
const locales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
const routeLocales = ["en", "zh-tw", "zh-cn", "ja", "ko", "es", "pt-br", "fr", "de", "it", "ru", "hi", "ar"];
const sourcePath = path.join(root, "games/reversi/game.js");
const analyticsPath = path.join(root, "games/reversi/analytics-ownership.js");
const source = fs.readFileSync(sourcePath, "utf8");
const analytics = fs.readFileSync(analyticsPath, "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(source.includes('const GAME_VERSION = "v9"'), "route adapter is not Game v9");
check(source.includes("const documentLocale = document.documentElement.lang") && source.includes("LOCALES.includes(documentLocale)"), "locale refresh does not prefer the selected document locale over the English route segment");
check(source.includes("const GUIDE_COPY = {") && source.includes("const syncGuide = () =>") && source.includes('data-runtime-localize", "off"'), "Reversi does not own a complete 13-locale static guide synchronization boundary");
check(source.includes("const GUIDE_QUICK_START = {") && source.includes("Replay or New Puzzle resets the board for a fresh round."), "Reversi guide does not own the no-Undo quick-start copy");
const quickStartBlock = source.match(/const GUIDE_QUICK_START = \{([\s\S]*?)\n  \};/)?.[1] || "";
check(!/(?:undo|撤销|還原|元に戻す|되돌리기|Deshacer|Desfazer|Annuler|Rückgängig|Annulla|отмен|पहले जैसा|التراجع)/iu.test(quickStartBlock), "Reversi quick-start copy still promises an unsupported undo action");
check(source.includes("WeightPlay Original Game Guide") && source.includes("WeightPlay 原創遊戲指南") && source.includes("Guía de juegos originales de WeightPlay"), "Reversi runtime guide identity is not General across representative locales");
check(source.includes("const CELL_LABELS = {") && source.includes('ar: "الصف {row}، العمود {col}"') && source.includes("CELL_LABELS[locale()]"), "Reversi cell labels are not owned by the 13-locale route adapter");
check(source.includes("const SCENARIOS = [") && (source.match(/key: /gu) || []).length === 3, "three bounded replay scenarios are not defined");
check((source.match(/copy: \{/gu) || []).length === 3, "each replay scenario does not own a copy map");
check(source.includes("scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length"), "Replay does not rotate the scenario focus");
check(source.includes('tutorial.dataset.reversiScenario') && source.includes('tutorial.setAttribute("role", "note")'), "scenario focus is not exposed through the owned Battle tutorial");
for (const locale of locales) check(source.includes(`${locale}:`) || source.includes(`"${locale}":`), `scenario copy is missing locale ${locale}`);
check(analytics.includes('const GAME_VERSION = "v9"'), "analytics identity is not v9");

const routeFiles = ["games/reversi/index.html", ...routeLocales.map((locale) => `${locale}/games/reversi/index.html`)];
const routeResults = routeFiles.map((file) => {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  return { file, current: html.includes(tag), stale: html.includes("20260820-reversi-strategic-payoff-v6") };
});
check(routeResults.every((row) => row.current), "not all 14 Reversi route shells carry the v9 identity");
check(routeResults.every((row) => !row.stale), "a Reversi route shell retains the v6 identity");
const englishRoute = fs.readFileSync(path.join(root, "en/games/reversi/index.html"), "utf8");
check(englishRoute.includes("game-page-info-static"), "English route is missing its static guide surface");
for (const route of routeLocales.filter((locale) => locale !== "en")) {
  const file = `${route}/games/reversi/index.html`;
  const html = fs.readFileSync(path.join(root, file), "utf8");
  check(html.includes("runtime-locales/") && html.includes("game-runtime-localizer.js"), `${file} is missing its runtime guide localization delivery`);
}

console.log(JSON.stringify({
  pass: failures.length === 0,
  game: "reversi",
  gameVersion: 9,
  interfaceVersion: 6,
  check: "REVERSI_REPLAY_VARIETY_001",
  scenarios: 3,
  localeCopies: 13,
  routeCount: routeResults.filter((row) => row.current).length,
  contract: "route-owned optional corner, mobility, and edge planning focuses rotate on Replay",
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
