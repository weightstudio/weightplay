import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const statsPath = path.join(root, "src", "game-stats.json");
const reportPath = path.join(root, "docs", "analytics-latest-report.md");
const propertyId = process.env.GA4_PROPERTY_ID || "";
const clientEmail = process.env.GA4_CLIENT_EMAIL || "";
const privateKey = (process.env.GA4_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const sitePathPrefix = process.env.GA4_SITE_PATH_PREFIX || "/weightplay";
const lookbackDays = Math.max(1, Number(process.env.GA4_LOOKBACK_DAYS || 7) || 7);

function base64Url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function readLobbyGames() {
  const code = await fs.readFile(path.join(root, "src", "lobby-data.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: "lobby-data.js" });
  return (sandbox.window.WONDER_LOBBY?.games || []).filter((game) => game.status === "playable");
}

function gameSlug(game) {
  const match = String(game.href || "").match(/games\/([^/]+)/);
  return match ? match[1] : game.id;
}

function findGameByPath(games, pagePath) {
  const normalized = pagePath.replace(/\/index\.html$/, "/");
  return games.find((game) => {
    const slug = gameSlug(game);
    return normalized.includes(`/games/${slug}/`) || normalized.endsWith(`/games/${slug}`);
  });
}

async function createAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(privateKey);
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`OAuth token request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return data.access_token;
}

async function runReport(accessToken, startDate) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "CONTAINS",
            value: `${sitePathPrefix}/games/`,
            caseSensitive: false,
          },
        },
      },
      limit: 250,
    }),
  });
  if (!response.ok) throw new Error(`GA4 report request failed: ${response.status} ${await response.text()}`);
  return response.json();
}

function emptyStats(games, source = "pending") {
  return {
    updatedAt: new Date().toISOString(),
    source,
    windowDays: lookbackDays,
    totals: { plays7d: 0, playsTotal: 0, users7d: 0 },
    games: Object.fromEntries(
      games.map((game) => [
        game.id,
        {
          plays7d: 0,
          playsTotal: 0,
          users7d: 0,
          rank7d: null,
        },
      ]),
    ),
  };
}

function addRows(stats, games, rows = [], field, userField) {
  for (const row of rows) {
    const pagePath = row.dimensionValues?.[0]?.value || "";
    const game = findGameByPath(games, pagePath);
    if (!game) continue;
    const views = Number(row.metricValues?.[0]?.value || 0);
    const users = Number(row.metricValues?.[1]?.value || 0);
    stats.games[game.id][field] += views;
    if (userField) stats.games[game.id][userField] = Math.max(stats.games[game.id][userField], users);
  }
}

function rankStats(stats) {
  const ranked = Object.entries(stats.games)
    .sort((a, b) => b[1].plays7d - a[1].plays7d || b[1].playsTotal - a[1].playsTotal || a[0].localeCompare(b[0]));
  ranked.forEach(([id, value], index) => {
    value.rank7d = value.plays7d > 0 ? index + 1 : null;
    stats.games[id] = value;
  });
  stats.totals.plays7d = ranked.reduce((sum, [, value]) => sum + value.plays7d, 0);
  stats.totals.playsTotal = ranked.reduce((sum, [, value]) => sum + value.playsTotal, 0);
  stats.totals.users7d = ranked.reduce((sum, [, value]) => sum + value.users7d, 0);
}

async function writeReport(stats, games, note = "") {
  try {
    await fs.access(path.dirname(reportPath));
  } catch {
    return;
  }
  const lines = [
    "# Analytics Latest Report",
    "",
    `Updated: ${stats.updatedAt}`,
    `Source: ${stats.source}`,
    `Window: Last ${stats.windowDays} days`,
    "",
    "## Top Games",
    "",
  ];
  const ranked = [...games].sort((a, b) => {
    const aStats = stats.games[a.id] || {};
    const bStats = stats.games[b.id] || {};
    return (bStats.plays7d || 0) - (aStats.plays7d || 0);
  });
  for (const game of ranked.slice(0, 10)) {
    const gameStats = stats.games[game.id] || {};
    lines.push(`- ${game.id}: ${gameStats.plays7d || 0} plays in 7d, ${gameStats.playsTotal || 0} total page plays`);
  }
  if (note) {
    lines.push("", "## Note", "", note);
  }
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const games = await readLobbyGames();
  if (!propertyId || !clientEmail || !privateKey) {
    try {
      const existing = JSON.parse(await fs.readFile(statsPath, "utf8"));
      if (existing?.games && Object.keys(existing.games).length > 0) {
        console.warn("GA4 secrets are not configured. Keeping existing game stats.");
        return;
      }
    } catch {
      // A missing stats file is handled by writing the initial pending version below.
    }
    const stats = emptyStats(games, "pending");
    await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
    await writeReport(
      stats,
      games,
      "GA4 secrets are not configured yet. Add GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY to enable automatic public game stats.",
    );
    return;
  }

  const accessToken = await createAccessToken();
  const recent = await runReport(accessToken, `${lookbackDays}daysAgo`);
  const total = await runReport(accessToken, "2020-01-01");
  const stats = emptyStats(games, "ga4");
  addRows(stats, games, recent.rows, "plays7d", "users7d");
  addRows(stats, games, total.rows, "playsTotal");
  rankStats(stats);
  await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
  await writeReport(stats, games);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
