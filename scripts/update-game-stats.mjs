import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
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

export function reportRequestBody(startDate, { eventName = "page_view", gamePagesOnly = true, sitePathPrefix = "" } = {}) {
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
  return {
    dateRanges: [{ startDate, endDate: "today" }],
    ...(gamePagesOnly ? { dimensions: [{ name: "pagePath" }] } : {}),
    metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
    dimensionFilter: { andGroup: { expressions: filters } },
    limit: 100000,
    offset: 0,
  };
}

async function runReport(accessToken, startDate, { eventName = "page_view", gamePagesOnly = true } = {}) {
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
        ...reportRequestBody(startDate, { eventName, gamePagesOnly, sitePathPrefix }),
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

export function emptyStats(games, source = "pending", { updatedAt = new Date().toISOString(), windowDays = lookbackDays } = {}) {
  return {
    updatedAt,
    source,
    metric: "game_start",
    windowDays,
    totals: {
      plays7d: 0,
      playsTotal: 0,
      users7d: 0,
      pageViews7d: 0,
      pageViewsTotal: 0,
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
          pageViews7d: 0,
          pageViewsTotal: 0,
          rank7d: null,
          rankTotal: null,
        },
      ]),
    ),
  };
}

export function addRows(stats, games, rows = [], field, userField) {
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

export function rankStats(stats) {
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

export function buildStats(games, {
  source = "ga4",
  updatedAt = new Date().toISOString(),
  windowDays = lookbackDays,
  recentStarts = [],
  totalStarts = [],
  recentPageViews = [],
  totalPageViews = [],
  recentLobby = { rows: [] },
  totalLobby = { rows: [] },
} = {}) {
  const stats = emptyStats(games, source, { updatedAt, windowDays });
  addRows(stats, games, recentStarts, "plays7d", "users7d");
  addRows(stats, games, totalStarts, "playsTotal");
  addRows(stats, games, recentPageViews, "pageViews7d");
  addRows(stats, games, totalPageViews, "pageViewsTotal");
  rankStats(stats);
  const lobby7d = aggregateMetrics(recentLobby);
  const lobbyTotal = aggregateMetrics(totalLobby);
  stats.totals.pageViews7d = Object.values(stats.games).reduce((sum, game) => sum + game.pageViews7d, 0);
  stats.totals.pageViewsTotal = Object.values(stats.games).reduce((sum, game) => sum + game.pageViewsTotal, 0);
  stats.totals.lobbyVisits7d = lobby7d.count;
  stats.totals.lobbyVisitsTotal = lobbyTotal.count;
  stats.totals.lobbyUsers7d = lobby7d.users;
  return stats;
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
  await fs.writeFile(reportPath, buildAnalyticsReport(stats, games, note), "utf8");
}

export function buildAnalyticsReport(stats, games, note = "") {
  const startsArePrimary = stats.metric === "game_start";
  const pageViews7d = Number(stats.totals?.pageViews7d ?? (!startsArePrimary ? stats.totals?.plays7d : 0)) || 0;
  const pageViewsTotal = Number(stats.totals?.pageViewsTotal ?? (!startsArePrimary ? stats.totals?.playsTotal : 0)) || 0;
  const lines = [
    "# Analytics Latest Report",
    "",
    `Updated: ${stats.updatedAt}`,
    `Source: ${stats.source}`,
    `Metric: ${stats.metric || "game_page_view"}`,
    `Window: Last ${stats.windowDays} days`,
    `Page views: ${pageViews7d} in 7d, ${pageViewsTotal} total`,
    `Lobby visits: ${stats.totals?.lobbyVisits7d || 0} in 7d, ${stats.totals?.lobbyVisitsTotal || 0} total`,
    "",
    "## Top Games",
    "",
  ];
  const ranked = [...games].sort((a, b) => {
    const aStats = stats.games[a.id] || {};
    const bStats = stats.games[b.id] || {};
    return startsArePrimary ? (bStats.plays7d || 0) - (aStats.plays7d || 0)
      : (Number(bStats.pageViews7d ?? bStats.plays7d) || 0) - (Number(aStats.pageViews7d ?? aStats.plays7d) || 0);
  });
  for (const game of ranked.slice(0, 10)) {
    const gameStats = stats.games[game.id] || {};
    const starts7d = startsArePrimary ? Number(gameStats.plays7d || 0) : 0;
    const startsTotal = startsArePrimary ? Number(gameStats.playsTotal || 0) : 0;
    const views7d = Number(gameStats.pageViews7d ?? (!startsArePrimary ? gameStats.plays7d : 0)) || 0;
    const viewsTotal = Number(gameStats.pageViewsTotal ?? (!startsArePrimary ? gameStats.playsTotal : 0)) || 0;
    lines.push(`- ${game.id}: ${starts7d} game starts in 7d, ${startsTotal} total game starts; ${views7d} page views in 7d, ${viewsTotal} total page views`);
  }
  if (note) {
    lines.push("", "## Note", "", note);
  }
  return `${lines.join("\n")}\n`;
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
    const recentStarts = await runReport(accessToken, `${lookbackDays}daysAgo`, { eventName: "game_start" });
    const totalStarts = await runReport(accessToken, "2020-01-01", { eventName: "game_start" });
    const recentPageViews = await runReport(accessToken, `${lookbackDays}daysAgo`, { eventName: "page_view" });
    const totalPageViews = await runReport(accessToken, "2020-01-01", { eventName: "page_view" });
    const recentLobby = await runReport(accessToken, `${lookbackDays}daysAgo`, { eventName: "lobby_ready", gamePagesOnly: false });
    const totalLobby = await runReport(accessToken, "2020-01-01", { eventName: "lobby_ready", gamePagesOnly: false });
    const stats = buildStats(games, {
      source: "ga4",
      windowDays: lookbackDays,
      recentStarts: recentStarts.rows,
      totalStarts: totalStarts.rows,
      recentPageViews: recentPageViews.rows,
      totalPageViews: totalPageViews.rows,
      recentLobby,
      totalLobby,
    });
    await fs.writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
    await writeReport(stats, games);
    // Reuse the authenticated token. Detailed reports never enter public assets.
    if (process.env.GA4_BEHAVIOR_REPORT_PATH) {
      try {
        const { exportGameBehaviorReport } = await import("./lib/game-behavior-report.mjs");
        await exportGameBehaviorReport({
          retentionInputPath: process.env.GA4_RETENTION_INPUT_PATH || "",
          propertyId, accessToken, games, root,
          outputPath: process.env.GA4_BEHAVIOR_REPORT_PATH,
          days: Number(process.env.GA4_BEHAVIOR_DAYS || 30),
        });
      } catch (error) {
        console.warn(`Detailed game analytics not updated: ${error.message}. Previous detail report retained.`);
      }
    }
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

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
