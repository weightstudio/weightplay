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
const sitePathPrefix = process.env.GA4_SITE_PATH_PREFIX ?? "";
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

async function runReport(accessToken, startDate, { eventName = "page_view", gamePagesOnly = true } = {}) {
  const filters = [
    {
      filter: {
        fieldName: "eventName",
        stringFilter: {
          matchType: "EXACT",
          value: eventName,
          caseSensitive: true,
        },
      },
    },
  ];
  if (gamePagesOnly) {
    filters.push({
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "CONTAINS",
          value: `${sitePathPrefix}/games/`,
          caseSensitive: false,
        },
      },
    });
  }
  const pageSize = 100000;
  const rows = [];
  let offset = 0;
  let mergedReport = null;

  while (true) {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate: "today" }],
        ...(gamePagesOnly ? { dimensions: [{ name: "pagePath" }] } : {}),
        metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
        dimensionFilter: {
          andGroup: { expressions: filters },
        },
        limit: pageSize,
        offset,
      }),
    });
    if (!response.ok) throw new Error(`GA4 report request failed: ${response.status} ${await response.text()}`);
    const page = await response.json();
    if (!mergedReport) mergedReport = { ...page, rows };
    const pageRows = Array.isArray(page.rows) ? page.rows : [];
    rows.push(...pageRows);
    offset += pageRows.length;
    const rowCount = Number(page.rowCount || 0);
    if (pageRows.length === 0 || offset >= rowCount) break;
  }

  return mergedReport || { rows: [], rowCount: 0 };
}

function emptyStats(games, source = "pending") {
  return {
    updatedAt: new Date().toISOString(),
    source,
    metric: "game_page_view",
    windowDays: lookbackDays,
    totals: {
      plays7d: 0,
      playsTotal: 0,
      users7d: 0,
      lobbyVisits7d: 0,
      lobbyVisitsTotal: 0,
      lobbyUsers7d: 0,
    },
    games: Object.fromEntries(
      games.map((game) => [
        game.id,
        {
          plays7d: 0,
          playsTotal: 0,
          users7d: 0,
          rank7d: null,
          rankTotal: null,
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
  [...ranked]
    .sort((a, b) => b[1].playsTotal - a[1].playsTotal || b[1].plays7d - a[1].plays7d || a[0].localeCompare(b[0]))
    .forEach(([id, value], index) => {
      value.rankTotal = value.playsTotal > 0 ? index + 1 : null;
      stats.games[id] = value;
    });
  stats.totals.plays7d = ranked.reduce((sum, [, value]) => sum + value.plays7d, 0);
  stats.totals.playsTotal = ranked.reduce((sum, [, value]) => sum + value.playsTotal, 0);
  stats.totals.users7d = ranked.reduce((sum, [, value]) => sum + value.users7d, 0);
}

function aggregateMetrics(report = {}) {
  const row = report.rows?.[0];
  return {
    count: Number(row?.metricValues?.[0]?.value || 0),
    users: Number(row?.metricValues?.[1]?.value || 0),
  };
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
    `Metric: ${stats.metric || "game_page_view"}`,
    `Window: Last ${stats.windowDays} days`,
    `Lobby visits: ${stats.totals?.lobbyVisits7d || 0} in 7d, ${stats.totals?.lobbyVisitsTotal || 0} total`,
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
    lines.push(`- ${game.id}: ${gameStats.plays7d || 0} game entries in 7d, ${gameStats.playsTotal || 0} total game entries`);
  }
  if (note) {
    lines.push("", "## Note", "", note);
  }
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const games = await readLobbyGames();
  if (!propertyId || !clientEmail || !privateKey) {
    const note =
      "GA4 secrets are not configured yet. Add GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY to enable automatic public game stats.";
    try {
      const existing = JSON.parse(await fs.readFile(statsPath, "utf8"));
      if (existing?.games && Object.keys(existing.games).length > 0) {
        console.warn("GA4 secrets are not configured. Keeping existing game stats and refreshing the diagnostic report.");
        await writeReport(existing, games, note);
        return;
      }
    } catch {
      // A missing stats file is handled by writing the initial pending version below.
    }
    const stats = emptyStats(games, "pending");
    await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
    await writeReport(stats, games, note);
    return;
  }

  try {
    const accessToken = await createAccessToken();
    const recent = await runReport(accessToken, `${lookbackDays}daysAgo`);
    const total = await runReport(accessToken, "2020-01-01");
    const recentLobby = await runReport(accessToken, `${lookbackDays}daysAgo`, { eventName: "lobby_ready", gamePagesOnly: false });
    const totalLobby = await runReport(accessToken, "2020-01-01", { eventName: "lobby_ready", gamePagesOnly: false });
    const stats = emptyStats(games, "ga4");
    addRows(stats, games, recent.rows, "plays7d", "users7d");
    addRows(stats, games, total.rows, "playsTotal");
    rankStats(stats);
    const lobby7d = aggregateMetrics(recentLobby);
    const lobbyTotal = aggregateMetrics(totalLobby);
    stats.totals.lobbyVisits7d = lobby7d.count;
    stats.totals.lobbyVisitsTotal = lobbyTotal.count;
    stats.totals.lobbyUsers7d = lobby7d.users;
    await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
    await writeReport(stats, games);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const note = [
      `GA4 sync failed at ${new Date().toISOString()}.`,
      "",
      "The workflow kept the previous public game stats instead of failing the deployment.",
      "Check GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, Analytics Data API access, and GA4 property permissions.",
      "",
      "Error:",
      message,
    ].join("\n");
    console.warn(note);
    try {
      const existing = JSON.parse(await fs.readFile(statsPath, "utf8"));
      await writeReport(existing, games, note);
    } catch {
      const stats = emptyStats(games, "ga4-error");
      await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
      await writeReport(stats, games, note);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
