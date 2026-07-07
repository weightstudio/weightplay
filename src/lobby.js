const lobby = window.WONDER_LOBBY;
const filterButtons = document.querySelectorAll("[data-age-filter]");
const topicButtons = document.querySelectorAll("[data-topic-filter]");
const skillButtons = document.querySelectorAll("[data-skill-filter]");
const libraryButtons = document.querySelectorAll("[data-library-tab]");
const gameGrid = document.querySelector("#gameGrid");
const heroGames = document.querySelector("#heroGames");
const heroGamesSection = document.querySelector("#heroGamesSection");
const upcomingGames = document.querySelector("#upcomingGames");
const upcomingGamesSection = document.querySelector("#upcomingGamesSection");
const recommendations = document.querySelector("#recommendations");
const recommendationsSection = document.querySelector("#recommendationsSection");
const freshUpdates = document.querySelector("#freshUpdates");
const freshUpdatesSection = document.querySelector("#freshUpdatesSection");
const skillPaths = document.querySelector("#skillPaths");
const skillPathsSection = document.querySelector("#skillPathsSection");
const lobbyStats = document.querySelector("#lobbyStats");
const featuredGame = document.querySelector("#featuredGame");
const lobbyToast = document.querySelector("#lobbyToast");
const platformTitle = document.querySelector("#platformTitle");
const platformSubtitle = document.querySelector("#platformSubtitle");
const filterStatus = document.querySelector("#filterStatus");
const lobbyKicker = document.querySelector("#lobbyKicker");
const featuredLabel = document.querySelector("#featuredLabel");
const languageLabel = document.querySelector("#languageLabel");
const localeSelect = document.querySelector("#localeSelect");
const heroRankLabel = document.querySelector("#heroRankLabel");
const heroGamesTitle = document.querySelector("#heroGamesTitle");
const upcomingGamesTitle = document.querySelector("#upcomingGamesTitle");
const upcomingGamesReason = document.querySelector("#upcomingGamesReason");
const recommendationTitle = document.querySelector("#recommendationTitle");
const recommendationReason = document.querySelector("#recommendationReason");
const freshUpdatesTitle = document.querySelector("#freshUpdatesTitle");
const freshUpdatesReason = document.querySelector("#freshUpdatesReason");
const skillPathsTitle = document.querySelector("#skillPathsTitle");
const skillPathsReason = document.querySelector("#skillPathsReason");
const dailyReward = document.querySelector("#dailyReward");
const gameSearch = document.querySelector("#gameSearch");
const i18n = window.WonderI18n;
const favoritesKey = "weightplayFavoriteGames";
const recentGamesKey = "weightplayRecentGames";
const dailyRewardKey = "weightplayDailyReward";
const walletBar = document.querySelector("#walletBar");
const dailyRewardTrack = [5, 6, 8, 10, 12, 15, 25];
const featuredSkillPaths = ["Memory", "Logic", "Reaction", "Focus", "Problem Solving", "Animal Knowledge"];
const recentlyUpdatedGameIds = new Set(["animal-reef-fisher", "animal-rune-tactics", "animal-orb-fortress", "beast-deck"]);
const ageFilterGroups = {
  starter: ["3"],
  family: ["6", "9", "family"],
  challenge: ["13"],
};
const lobbyGameFacts = {
  "wonder-crash": { difficulty: "Medium", time: "5-8 minutes" },
  "color-lunchbox": { difficulty: "Easy", time: "1-3 minutes" },
  "bubble-bakery": { difficulty: "Easy", time: "3-5 minutes" },
  "animal-rope-rescue": { difficulty: "Easy", time: "3-5 minutes" },
  "animal-zoo-idle": { difficulty: "Easy", time: "3-8 minutes" },
  "star-memory": { difficulty: "Easy", time: "3-5 minutes" },
  "campus-dash": { difficulty: "Hard", time: "1-3 minutes" },
  "snack-blocks": { difficulty: "Medium", time: "5-8 minutes" },
  "fruit-merge": { difficulty: "Medium", time: "3-5 minutes" },
  "garden-tiles": { difficulty: "Relaxed", time: "3-5 minutes" },
  "animal-rescue": { difficulty: "Easy", time: "3-5 minutes" },
  "animal-hidden-safari": { difficulty: "Easy", time: "3-5 minutes" },
  "animal-guard-yard": { difficulty: "Medium", time: "5-8 minutes" },
  "animal-crystal-survivor": { difficulty: "Medium", time: "3-5 minutes" },
  "animal-quiz": { difficulty: "Easy", time: "3-5 minutes" },
  "zoo-helper-day": { difficulty: "Easy", time: "1-3 minutes" },
  "shape-train": { difficulty: "Easy", time: "1-3 minutes" },
  "tiny-weather-rescue": { difficulty: "Easy", time: "3-5 minutes" },
  "beast-deck": { difficulty: "Medium", time: "5-8 minutes" },
  "animal-relic-hunters": { difficulty: "Hard", time: "5-8 minutes" },
  "animal-rune-tactics": { difficulty: "Medium", time: "5-8 minutes" },
  "animal-orb-fortress": { difficulty: "Hard", time: "5-8 minutes" },
  "beast-tactician": { difficulty: "Hard", time: "5-8 minutes" },
  "shadow-wolf": { difficulty: "Hard", time: "5-8 minutes" },
};
let activeFilter = "all";
let activeTopic = "all";
let activeSkill = "all";
let activeLibrary = "all";
let activeSearch = "";
let toastTimer = null;
let favoriteGameIds = readFavorites();
let recentGameIds = readRecentGames();
let gameStats = { source: "pending", windowDays: 7, totals: { plays7d: 0, playsTotal: 0, users7d: 0 }, games: {} };

function text(value) {
  return i18n.getLocalized(value);
}

function primaryArt(game) {
  const hero = game.art?.hero || "";
  if (hero && !hero.includes("width='1'")) return hero;
  return game.art?.background || "assets/hero.png";
}

function categoryText(category) {
  return i18n.t(`category.${category}`);
}

function skillText(skill) {
  return i18n.t(`skill.${skill}`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function selectedButtonLabel(buttons, dataKey, value) {
  const button = Array.from(buttons).find((item) => item.dataset[dataKey] === value);
  return button?.querySelector(".filter-label")?.textContent?.trim() || button?.textContent?.trim() || "";
}

function activeDiscoveryLabels() {
  const labels = [];
  if (activeFilter !== "all") labels.push(selectedButtonLabel(filterButtons, "ageFilter", activeFilter));
  if (activeTopic !== "all") labels.push(selectedButtonLabel(topicButtons, "topicFilter", activeTopic));
  if (activeSkill !== "all") labels.push(selectedButtonLabel(skillButtons, "skillFilter", activeSkill));
  if (activeLibrary !== "all") labels.push(selectedButtonLabel(libraryButtons, "libraryTab", activeLibrary));
  if (activeSearch) labels.push(i18n.t("status.search_term", { query: activeSearch }));
  return labels.filter(Boolean);
}

function renderFilterStatusSummary(visibleCount, labels) {
  const countText = i18n.t(visibleCount > 1 ? "status.games_found_many" : "status.games_found_one", {
    count: visibleCount,
  });
  const chips = labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  filterStatus.innerHTML = `
    <span>${countText}</span>
    ${chips ? `<span class="filter-status-chips">${chips}</span>` : ""}
    <button type="button" data-clear-filters>${i18n.t("status.clear_filters")}</button>
  `;
  filterStatus.querySelector("[data-clear-filters]")?.addEventListener("click", resetDiscoveryFilters);
}

function skillReasonText(game) {
  const primarySkill = (game.skills || [])[0];
  if (!primarySkill) return "";
  return i18n.t("card.skill_reason", { skill: skillText(primarySkill) });
}

function gameInfoText(gameId, key) {
  const game = lobbyGameFacts[gameId];
  if (!game?.[key]) return "";
  const label = key === "time" ? localizedFactLabel("time") : localizedFactLabel("difficulty");
  const value = key === "time" ? localizePlayTime(game[key]) : localizeDifficulty(game[key]);
  return `<span><b>${label}</b>${value}</span>`;
}

function localizedFactLabel(key) {
  if (i18n.locale() !== "zh-Hant") return key === "time" ? "Time" : "Difficulty";
  return key === "time" ? "\u6642\u9593" : "\u96e3\u5ea6";
}

function localizeDifficulty(value) {
  if (i18n.locale() !== "zh-Hant") return value;
  const map = {
    Easy: "\u7c21\u55ae",
    Medium: "\u4e2d\u7b49",
    Hard: "\u56f0\u96e3",
    Relaxed: "\u8f15\u9b06",
  };
  return map[value] || value;
}

function localizePlayTime(value) {
  if (i18n.locale() !== "zh-Hant") return value;
  return String(value)
    .replace("1-3 minutes", "1-3 \u5206\u9418")
    .replace("3-5 minutes", "3-5 \u5206\u9418")
    .replace("5-8 minutes", "5-8 \u5206\u9418")
    .replace("3-8 minutes", "3-8 \u5206\u9418");
}

function countGamesBy(type, value) {
  if (type === "age") {
    if (value === "all") return lobby.games.length;
    return lobby.games.filter((game) => matchesAgeFilter(game.ages || [], value)).length;
  }
  if (type === "topic") {
    if (value === "all") return lobby.games.length;
    return lobby.games.filter((game) => (game.categories || []).includes(value)).length;
  }
  if (type === "skill") {
    if (value === "all") return lobby.games.length;
    return lobby.games.filter((game) => (game.skills || []).includes(value)).length;
  }
  if (type === "library") {
    if (value === "favorites") return favoriteGameIds.filter((id) => lobby.games.some((game) => game.id === id)).length;
    if (value === "recent") return recentGameIds.filter((id) => lobby.games.some((game) => game.id === id)).length;
    return lobby.games.length;
  }
  return 0;
}

function filterButtonLabel(button, type, value) {
  if (button.dataset.i18n) return i18n.t(button.dataset.i18n);
  if (type === "age") return value === "family" ? i18n.t("filter.family") : `${value}+`;
  if (type === "topic") return value === "all" ? i18n.t("filter.all_topics") : categoryText(value);
  if (type === "skill") return value === "all" ? i18n.t("filter.all_skills") : skillText(value);
  return button.textContent.trim();
}

function matchesAgeFilter(ages, filterValue) {
  if (filterValue === "all") return true;
  const group = ageFilterGroups[filterValue];
  if (group) return ages.some((age) => group.includes(age));
  return ages.includes(filterValue);
}

function setFilterCount(button, type, value) {
  const label = filterButtonLabel(button, type, value);
  const count = countGamesBy(type, value);
  button.innerHTML = `<span class="filter-label">${label}</span><b class="filter-count">${count}</b>`;
  button.setAttribute("aria-label", `${label}, ${count}`);
}

function renderFilterCounts() {
  filterButtons.forEach((button) => setFilterCount(button, "age", button.dataset.ageFilter));
  topicButtons.forEach((button) => setFilterCount(button, "topic", button.dataset.topicFilter));
  skillButtons.forEach((button) => setFilterCount(button, "skill", button.dataset.skillFilter));
  libraryButtons.forEach((button) => setFilterCount(button, "library", button.dataset.libraryTab));
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoritesKey, JSON.stringify(favoriteGameIds));
  } catch {
    // Favorite storage is optional.
  }
}

function readRecentGames() {
  try {
    const saved = JSON.parse(localStorage.getItem(recentGamesKey) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecentGames() {
  try {
    localStorage.setItem(recentGamesKey, JSON.stringify(recentGameIds.slice(0, 8)));
  } catch {
    // Recent history storage is optional.
  }
}

function recordRecentGame(gameId) {
  recentGameIds = [gameId, ...recentGameIds.filter((id) => id !== gameId)].slice(0, 8);
  saveRecentGames();
}

function isFavorite(gameId) {
  return favoriteGameIds.includes(gameId);
}

function isRecent(gameId) {
  return recentGameIds.includes(gameId);
}

function statFor(game) {
  return gameStats.games?.[game.id] || { plays7d: 0, playsTotal: 0, users7d: 0, rank7d: null };
}

function hasRealStats() {
  return gameStats.source === "ga4" && Number(gameStats.totals?.plays7d || 0) > 0;
}

function hasStatsFeed() {
  return gameStats.source === "ga4";
}

function formatCount(value) {
  return new Intl.NumberFormat(i18n.locale(), { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
}

function playCountText(game) {
  const stats = statFor(game);
  if (!hasStatsFeed()) return i18n.t("stats.collecting");
  return i18n.t("stats.plays_7d", { count: formatCount(stats.plays7d || 0), days: gameStats.windowDays || 7 });
}

function rankLabel(game, fallbackRank) {
  const stats = statFor(game);
  const rank = hasRealStats() && stats.rank7d ? stats.rank7d : fallbackRank;
  return i18n.t("stats.rank_label", { rank });
}

function popularGames(limit = 3) {
  const playableGames = lobby.games.filter((game) => game.status === "playable");
  if (!hasRealStats()) {
    return lobby.heroGameIds.map((id) => playableGames.find((game) => game.id === id)).filter(Boolean).slice(0, limit);
  }
  return [...playableGames]
    .sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
    })
    .slice(0, limit);
}

function playableGames() {
  return lobby.games.filter((game) => game.status === "playable");
}

function recentlyUpdatedGames(limit = 4) {
  return [...recentlyUpdatedGameIds]
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable"))
    .filter(Boolean)
    .slice(0, limit);
}

function upcomingPreviewGames(limit = 3) {
  return lobby.games
    .filter((game) => game.status === "planned" && (game.art?.background || game.art?.hero))
    .slice(0, limit);
}

function recommendationSeeds() {
  const seedIds = [...recentGameIds, ...favoriteGameIds].filter((id, index, list) => id && list.indexOf(id) === index);
  return seedIds.map((id) => lobby.games.find((game) => game.id === id && game.status === "playable")).filter(Boolean);
}

function scoreRecommendation(game, seeds) {
  if (!seeds.length) {
    const stats = statFor(game);
    return (stats.plays7d || 0) * 10 + (stats.playsTotal || 0);
  }
  return seeds.reduce((score, seed) => {
    const sharedSkills = (game.skills || []).filter((skill) => (seed.skills || []).includes(skill)).length;
    const sharedCategories = (game.categories || []).filter((category) => (seed.categories || []).includes(category)).length;
    const sharedAges = (game.ages || []).filter((age) => (seed.ages || []).includes(age)).length;
    return score + sharedSkills * 5 + sharedCategories * 3 + sharedAges * 4;
  }, 0);
}

function recommendedGames(limit = 3) {
  const seeds = recommendationSeeds();
  const seedIds = new Set(seeds.map((game) => game.id));
  const candidates = playableGames().filter((game) => !seedIds.has(game.id));
  const ranked = candidates
    .map((game) => ({ game, score: scoreRecommendation(game, seeds), stats: statFor(game) }))
    .sort((a, b) => b.score - a.score || (b.stats.plays7d || 0) - (a.stats.plays7d || 0) || (b.stats.playsTotal || 0) - (a.stats.playsTotal || 0))
    .map((entry) => entry.game)
    .slice(0, limit);
  return ranked.length ? ranked : popularGames(limit);
}

function recommendationNote(game, seeds) {
  if (seeds.length) {
    const sharedSkill = (game.skills || []).find((skill) => seeds.some((seed) => (seed.skills || []).includes(skill)));
    if (sharedSkill) return i18n.t("recommend.shared_skill", { skill: skillText(sharedSkill) });
    const sharedAge = (game.ages || []).find((age) => seeds.some((seed) => (seed.ages || []).includes(age)));
    if (sharedAge) return i18n.t("recommend.shared_age", { age: sharedAge === "family" ? i18n.t("filter.family") : `${sharedAge}+` });
    return i18n.t("recommend.based_on_activity");
  }
  return hasStatsFeed() ? i18n.t("recommend.popular_reason") : i18n.t("recommend.start_here");
}

async function loadGameStats() {
  try {
    const response = await fetch("src/game-stats.json?v=20260630-stats1", { cache: "no-store" });
    if (!response.ok) return;
    const stats = await response.json();
    if (!stats || typeof stats !== "object") return;
    gameStats = {
      source: stats.source || "pending",
      windowDays: Number(stats.windowDays) || 7,
      totals: stats.totals || { plays7d: 0, playsTotal: 0, users7d: 0 },
      games: stats.games || {},
    };
    renderLobby();
  } catch {
    // Stats are optional and must never block the lobby.
  }
}

function openGame(game, title, ageLabel) {
  window.WonderSound?.play("click");
  recordRecentGame(game.id);
  window.WonderAnalytics?.track("game_open", {
    game_id: game.id,
    game_title: title,
    age_label: ageLabel,
    categories: (game.categories || []).join(","),
    locale: i18n.locale(),
    from_library: activeLibrary,
  });
  window.location.href = game.href;
}

function toggleFavorite(game, title) {
  const wasFavorite = isFavorite(game.id);
  favoriteGameIds = wasFavorite ? favoriteGameIds.filter((id) => id !== game.id) : [...favoriteGameIds, game.id];
  saveFavorites();
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track(wasFavorite ? "favorite_remove" : "favorite_add", {
    game_id: game.id,
    game_title: title,
    locale: i18n.locale(),
  });
  showToast(i18n.t(wasFavorite ? "toast.favorite_removed" : "toast.favorite_added", { title }));
  renderLobby();
}

function createGameCard(game) {
  const isPlayable = game.status === "playable";
  const title = text(game.title);
  const type = text(game.type);
  const ageLabel = text(game.ageLabel);
  const card = document.createElement("article");
  const favorite = isFavorite(game.id);
  const recent = isRecent(game.id);
  card.className = `game-card ${isPlayable ? "playable" : "coming-soon"}`;
  card.dataset.age = game.ages.join(" ");
  card.dataset.topic = (game.categories || []).join("|");
  card.dataset.skill = (game.skills || []).join("|");
  card.dataset.gameId = game.id;
  card.dataset.search = [
    title,
    type,
    ageLabel,
    text(game.description),
    ...(game.categories || []).map(categoryText),
    ...(game.skills || []).map(skillText),
  ].join(" ").toLowerCase();
  card.dataset.favorite = favorite ? "true" : "false";
  card.dataset.recent = recent ? "true" : "false";
  card.dataset.recentIndex = String(recentGameIds.indexOf(game.id));
  const stats = statFor(game);
  card.dataset.rank7d = String(stats.rank7d || 9999);
  card.dataset.plays7d = String(stats.plays7d || 0);

  if (isPlayable) {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.addEventListener("click", () => {
      openGame(game, title, ageLabel);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGame(game, title, ageLabel);
      }
    });
  } else {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.addEventListener("click", () => showPlannedGame(game));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showPlannedGame(game);
      }
    });
  }

  const meta = text(game.meta).map((item) => `<span>${item}</span>`).join("");
  const categoryBadges = (game.categories || []).map((item) => `<span>${categoryText(item)}</span>`).join("");
  const skillBadges = (game.skills || []).slice(0, 3).map((item) => `<span>${skillText(item)}</span>`).join("");
  const skillReason = skillReasonText(game);
  const quickFacts = [gameInfoText(game.id, "difficulty"), gameInfoText(game.id, "time")].filter(Boolean).join("");
  const showHero = game.art.hero && !game.art.hideHero && !game.art.hero.includes("width='1'");
  const art =
    game.art.kind === "image"
      ? `<div class="game-card-art image-art"><img class="game-card-bg-blur" src="${game.art.background}" alt="" /><img class="game-card-fg" src="${game.art.background}" alt="" />${showHero ? `<img class="game-card-hero" src="${game.art.hero}" alt="" />` : ""}</div>`
      : `<div class="game-card-art ${game.art.className}"><span>${ageLabel}</span></div>`;
  const favoriteAction = i18n.t(favorite ? "action.remove_favorite" : "action.add_favorite");
  const favoriteLabel = i18n.t(favorite ? "action.remove_favorite_title" : "action.add_favorite_title", { title });
  const primaryAction = isPlayable ? i18n.t(recent ? "action.continue" : "action.play") : i18n.t("action.coming_soon");
  const continueBadge = isPlayable && recent ? `<span class="continue-badge">${i18n.t("action.continue")}</span>` : "";
  const popularBadge = hasRealStats() && stats.rank7d && stats.rank7d <= 5 ? `<span class="popular-card-badge">${rankLabel(game, stats.rank7d)}</span>` : "";
  const updatedBadge = recentlyUpdatedGameIds.has(game.id) ? `<span class="updated-card-badge">${i18n.t("badge.updated")}</span>` : "";

  card.innerHTML = `
    ${art}
    ${continueBadge}
    <button class="favorite-toggle ${favorite ? "active" : ""}" type="button" aria-label="${favoriteLabel}" title="${favoriteAction}">
      <svg class="favorite-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.4 10.7 19.2C5.8 14.8 3 12.2 3 8.9 3 6.2 5.1 4.1 7.8 4.1 9.3 4.1 10.8 4.8 11.8 5.9 12.8 4.8 14.3 4.1 15.8 4.1 18.5 4.1 20.6 6.2 20.6 8.9 20.6 12.2 17.8 14.8 12.9 19.2L12 20.4Z" />
      </svg>
    </button>
    <div class="game-card-body">
      <div class="game-card-topline">
        <span class="age-pill">${ageLabel}</span>
        <span class="game-card-badges">
          ${updatedBadge}
          ${popularBadge}
          <span>${text(game.statusText)}</span>
        </span>
      </div>
      <h2>${title}</h2>
      <p>${text(game.description)}</p>
      <div class="game-card-categories">${categoryBadges}</div>
      ${skillBadges ? `<div class="game-card-skills" aria-label="Skills trained">${skillBadges}</div>` : ""}
      ${skillReason ? `<div class="game-card-skill-reason">${skillReason}</div>` : ""}
      ${quickFacts ? `<div class="game-card-facts" aria-label="Game quick facts">${quickFacts}</div>` : ""}
      <div class="game-card-meta">${meta}</div>
      <div class="game-card-plays">${playCountText(game)}</div>
      <div class="game-card-actions">
        <span>${primaryAction}</span>
        <span>${type}</span>
      </div>
    </div>
  `;

  card.querySelector(".favorite-toggle").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(game, title);
  });

  return card;
}

function renderLobby() {
  applyStaticTranslations();
  platformTitle.textContent = lobby.platform.name;
  platformSubtitle.textContent = text(lobby.platform.subtitle);
  renderWallet();

  const totalGameCount = lobby.games.length;
  const topPlayCount = Number(gameStats.totals?.plays7d || 0);
  lobbyStats.innerHTML = `
    <div><strong>${totalGameCount}</strong><span>${i18n.t("stats.total_games")}</span></div>
    <div><strong>${hasStatsFeed() ? formatCount(topPlayCount) : "..."}</strong><span>${i18n.t("stats.plays_7d_short")}</span></div>
  `;

  renderDailyReward();

  const featured = lobby.games.find((game) => game.id === lobby.featuredGameId);
  if (featured) {
    featuredGame.href = featured.href;
    featuredGame.querySelector("img").src = primaryArt(featured);
    featuredGame.querySelector("strong").textContent = text(featured.title);
  }

  renderHeroGames();
  renderUpcomingGames();
  renderFreshUpdates();
  renderRecommendations();
  renderSkillPaths();
  gameGrid.replaceChildren(...lobby.games.map(createGameCard));
  applyFilter();
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayNumber(dateKey) {
  if (!dateKey) return 0;
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function readDailyReward() {
  try {
    const saved = JSON.parse(localStorage.getItem(dailyRewardKey) || "{}");
    return {
      lastClaimDate: typeof saved.lastClaimDate === "string" ? saved.lastClaimDate : "",
      streak: Math.max(0, Number(saved.streak) || 0),
      totalClaims: Math.max(0, Number(saved.totalClaims) || 0),
    };
  } catch {
    return { lastClaimDate: "", streak: 0, totalClaims: 0 };
  }
}

function getDailyRewardState() {
  const saved = readDailyReward();
  const today = getLocalDateKey();
  const yesterdayNumber = dayNumber(today) - 1;
  const lastNumber = dayNumber(saved.lastClaimDate);
  const claimedToday = saved.lastClaimDate === today;
  const streak = claimedToday ? saved.streak : lastNumber === yesterdayNumber ? saved.streak + 1 : 1;
  const dayIndex = (Math.max(1, streak) - 1) % dailyRewardTrack.length;
  const reward = dailyRewardTrack[dayIndex];
  return { ...saved, today, claimedToday, streak, dayIndex, reward };
}

function renderDailyReward() {
  if (!dailyReward) return;
  const reward = getDailyRewardState();
  const claimLabel = reward.claimedToday ? i18n.t("daily.claimed") : i18n.t("daily.claim");
  const rewardCards = dailyRewardTrack
    .map((coins, index) => {
      const isCurrent = index === reward.dayIndex;
      const isPast = reward.claimedToday ? index <= reward.dayIndex : index < reward.dayIndex;
      const canClaim = isCurrent && !reward.claimedToday;
      const className = ["daily-day", isCurrent ? "current" : "", isPast ? "claimed" : "", canClaim ? "claimable" : ""].filter(Boolean).join(" ");
      const dayLabel = i18n.t("daily.day", { day: index + 1 });
      const statusLabel = isCurrent ? claimLabel : i18n.t(isPast ? "daily.done" : "daily.next");
      const ariaLabel = `${dayLabel}, +${coins} ${i18n.t("wallet.diamonds")}, ${statusLabel}`;
      return `
        <button class="${className}" type="button" aria-label="${ariaLabel}" ${canClaim ? 'data-daily-claim="true"' : "disabled"}>
          <span>${dayLabel}</span>
          <b>+${coins}</b>
          <small>${statusLabel}</small>
        </button>
      `;
    })
    .join("");
  dailyReward.innerHTML = `
    <div class="daily-reward-copy">
      <span>${i18n.t("daily.kicker")}</span>
      <strong>${i18n.t("daily.title")}</strong>
      <small>${i18n.t("daily.desc", { count: reward.streak, day: reward.dayIndex + 1, diamonds: reward.reward })}</small>
    </div>
    <div class="daily-track">${rewardCards}</div>
  `;
  dailyReward.querySelector("[data-daily-claim]")?.addEventListener("click", claimDailyReward);
}

function claimDailyReward() {
  const reward = getDailyRewardState();
  if (reward.claimedToday) {
    showToast(i18n.t("daily.toast_claimed"));
    return;
  }
  window.WeightPlayWallet?.addDiamonds(reward.reward);
  localStorage.setItem(
    dailyRewardKey,
    JSON.stringify({
      lastClaimDate: reward.today,
      streak: reward.streak,
      totalClaims: reward.totalClaims + 1,
    }),
  );
  window.WonderSound?.play("success");
  window.WonderAnalytics?.track("daily_reward_claim", {
    reward_type: "diamonds",
    reward_amount: reward.reward,
    streak: reward.streak,
    locale: i18n.locale(),
  });
  renderWallet();
  renderDailyReward();
  showToast(i18n.t("daily.toast", { diamonds: reward.reward, count: reward.streak }));
}

function renderWallet() {
  if (!walletBar) return;
  const wallet = window.WeightPlayWallet?.read?.() || { diamonds: 0 };
  walletBar.innerHTML = `
    <span>${i18n.t("wallet.diamonds")}</span>
    <strong><img src="assets/weightplay-diamond.svg" alt="" />${wallet.diamonds}</strong>
  `;
}

function renderHeroGames() {
  const cards = popularGames(3)
    .map((game, index) => {
      const isPlayable = game.status === "playable";
      const title = text(game.title);
      const type = text(game.type);
      const ageLabel = text(game.ageLabel);
      const rankText = rankLabel(game, index + 1);
      const card = document.createElement(isPlayable ? "a" : "button");
      card.className = `hero-game-card ${isPlayable ? "playable" : "planned"}`;
      card.type = isPlayable ? undefined : "button";
      if (isPlayable) {
        card.href = game.href;
      } else {
        card.addEventListener("click", () => showPlannedGame(game));
      }
      card.innerHTML = `
        <div class="hero-game-art">
          <img src="${game.art?.background || game.art?.hero || "assets/hero.png"}" alt="" />
          <span>${rankText}</span>
        </div>
        <div class="hero-game-copy">
          <strong>${title}</strong>
          <small>${type} / ${ageLabel}</small>
          <em>${playCountText(game)}</em>
        </div>
      `;
      return card;
    });

  heroGames.replaceChildren(...cards);
}

function renderUpcomingGames() {
  if (!upcomingGames || !upcomingGamesSection) return;
  const cards = upcomingPreviewGames(3).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const description = text(game.description);
    const card = document.createElement("button");
    card.className = "upcoming-game-card";
    card.type = "button";
    card.addEventListener("click", () => showPlannedGame(game));
    card.innerHTML = `
      <div class="upcoming-game-art">
        <img src="${game.art?.background || primaryArt(game)}" alt="" />
        <span>${i18n.t("action.coming_soon")}</span>
      </div>
      <div class="upcoming-game-copy">
        <strong>${title}</strong>
        <small>${type} / ${ageLabel}</small>
        <em>${description}</em>
      </div>
    `;
    return card;
  });

  upcomingGamesTitle.textContent = i18n.t("upcoming.title");
  upcomingGamesReason.textContent = i18n.t("upcoming.reason");
  upcomingGamesSection.classList.toggle("hidden", cards.length === 0);
  upcomingGames.replaceChildren(...cards);
}

function renderRecommendations() {
  if (!recommendations || !recommendationsSection) return;
  const seeds = recommendationSeeds();
  const cards = recommendedGames(3).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const note = recommendationNote(game, seeds);
    const skillBadges = (game.skills || []).slice(0, 2).map((skill) => `<span>${skillText(skill)}</span>`).join("");
    const updatedBadge = recentlyUpdatedGameIds.has(game.id) ? `<span class="recommendation-update">${i18n.t("badge.updated")}</span>` : "";
    const card = document.createElement("a");
    card.className = "recommendation-card";
    card.href = game.href;
    card.addEventListener("click", () => {
      window.WonderAnalytics?.track("recommendation_open", {
        game_id: game.id,
        game_title: title,
        seed_count: seeds.length,
        locale: i18n.locale(),
      });
      recordRecentGame(game.id);
    });
    card.innerHTML = `
      <img src="${game.art?.background || primaryArt(game)}" alt="" />
      <div class="recommendation-copy">
        <span class="recommendation-labels"><span class="recommendation-age">${ageLabel}</span>${updatedBadge}</span>
        <strong>${title}</strong>
        <small>${type}</small>
        <em>${note}</em>
        ${skillBadges ? `<div class="recommendation-skills" aria-label="Skills trained">${skillBadges}</div>` : ""}
      </div>
    `;
    return card;
  });
  recommendationTitle.textContent = i18n.t("recommend.title");
  recommendationReason.textContent = i18n.t(seeds.length ? "recommend.based_on_activity" : "recommend.start_here");
  recommendations.replaceChildren(...cards);
}

function renderFreshUpdates() {
  if (!freshUpdates || !freshUpdatesSection) return;
  const cards = recentlyUpdatedGames(4).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const description = text(game.description);
    const skillBadges = (game.skills || []).slice(0, 2).map((skill) => `<span>${skillText(skill)}</span>`).join("");
    const card = document.createElement("a");
    card.className = "fresh-update-card";
    card.href = game.href;
    card.addEventListener("click", () => {
      window.WonderAnalytics?.track("fresh_update_open", {
        game_id: game.id,
        game_title: title,
        locale: i18n.locale(),
      });
      recordRecentGame(game.id);
    });
    card.innerHTML = `
      <div class="fresh-update-art">
        <img src="${game.art?.background || primaryArt(game)}" alt="" />
        <span>${i18n.t("badge.updated")}</span>
      </div>
      <div class="fresh-update-copy">
        <strong>${title}</strong>
        <small>${type} / ${ageLabel}</small>
        <em>${description}</em>
        ${skillBadges ? `<div class="fresh-update-skills" aria-label="Skills trained">${skillBadges}</div>` : ""}
      </div>
    `;
    return card;
  });

  freshUpdatesTitle.textContent = i18n.t("fresh_updates.title");
  freshUpdatesReason.textContent = i18n.t("fresh_updates.reason");
  freshUpdatesSection.classList.toggle("hidden", cards.length === 0);
  freshUpdates.replaceChildren(...cards);
}

function gamesForSkillPath(skill, limit = 2) {
  return playableGames()
    .filter((game) => (game.skills || []).includes(skill))
    .sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
    })
    .slice(0, limit);
}

function renderSkillPaths() {
  if (!skillPaths || !skillPathsSection) return;
  const cards = featuredSkillPaths
    .map((skill) => {
      const games = gamesForSkillPath(skill);
      return games.length ? { skill, games } : null;
    })
    .filter(Boolean)
    .map(({ skill, games }) => {
      const count = playableGames().filter((game) => (game.skills || []).includes(skill)).length;
      const card = document.createElement("button");
      card.className = "skill-path-card";
      card.type = "button";
      card.dataset.skillPath = skill;
      card.innerHTML = `
        <span>${i18n.t(count === 1 ? "skill_path.count_one" : "skill_path.count", { count })}</span>
        <strong>${skillText(skill)}</strong>
        <div class="skill-path-thumbs" aria-hidden="true">
          ${games.map((game) => `<img src="${game.art?.background || primaryArt(game)}" alt="" />`).join("")}
        </div>
        <small>${i18n.t("skill_path.cta")}</small>
      `;
      card.addEventListener("click", () => selectSkillPath(skill));
      return card;
    });

  skillPathsTitle.textContent = i18n.t("skill_path.title");
  skillPathsReason.textContent = i18n.t("skill_path.reason");
  skillPathsSection.classList.toggle("hidden", cards.length === 0);
  skillPaths.replaceChildren(...cards);
}

function setActiveButtons(buttons, dataKey, value) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset[dataKey] === value);
  });
}

function selectSkillPath(skill) {
  activeFilter = "all";
  activeTopic = "all";
  activeSkill = skill;
  activeLibrary = "all";
  activeSearch = "";
  if (gameSearch) gameSearch.value = "";
  setActiveButtons(filterButtons, "ageFilter", "all");
  setActiveButtons(topicButtons, "topicFilter", "all");
  setActiveButtons(skillButtons, "skillFilter", skill);
  setActiveButtons(libraryButtons, "libraryTab", "all");
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("skill_path_open", { skill_path: skill, locale: i18n.locale() });
  applyFilter();
  filterStatus?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetDiscoveryFilters() {
  activeFilter = "all";
  activeTopic = "all";
  activeSkill = "all";
  activeLibrary = "all";
  activeSearch = "";
  if (gameSearch) gameSearch.value = "";
  setActiveButtons(filterButtons, "ageFilter", "all");
  setActiveButtons(topicButtons, "topicFilter", "all");
  setActiveButtons(skillButtons, "skillFilter", "all");
  setActiveButtons(libraryButtons, "libraryTab", "all");
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("clear_lobby_filters", { locale: i18n.locale() });
  applyFilter();
}

function applyFilter() {
  let visibleCount = 0;
  const isFiltered = activeFilter !== "all" || activeTopic !== "all" || activeSkill !== "all" || activeLibrary !== "all" || Boolean(activeSearch);
  document.querySelectorAll("[data-age]").forEach((card) => {
    const ages = card.dataset.age.split(" ");
    const topics = card.dataset.topic ? card.dataset.topic.split("|") : [];
    const skills = card.dataset.skill ? card.dataset.skill.split("|") : [];
    const matchesAge = matchesAgeFilter(ages, activeFilter);
    const matchesTopic = activeTopic === "all" || topics.includes(activeTopic);
    const matchesSkill = activeSkill === "all" || skills.includes(activeSkill);
    const matchesSearch = !activeSearch || card.dataset.search.includes(activeSearch);
    const matchesLibrary =
      activeLibrary === "all" ||
      (activeLibrary === "favorites" && card.dataset.favorite === "true") ||
      (activeLibrary === "recent" && card.dataset.recent === "true");
    const isVisible = matchesAge && matchesTopic && matchesSkill && matchesSearch && matchesLibrary;
    card.classList.toggle("hidden", !isVisible);
    if (activeLibrary === "recent" && card.dataset.recentIndex !== "-1") {
      card.style.order = card.dataset.recentIndex;
    } else if (isFiltered && hasRealStats()) {
      card.style.order = String(Number(card.dataset.rank7d || 9999) * 100000 - Number(card.dataset.plays7d || 0));
    } else {
      card.style.order = "";
    }
    if (isVisible) visibleCount += 1;
  });

  heroGamesSection.classList.toggle("hidden", isFiltered);
  recommendationsSection?.classList.toggle("hidden", isFiltered);
  freshUpdatesSection?.classList.toggle("hidden", isFiltered);
  skillPathsSection?.classList.toggle("hidden", isFiltered);
  filterStatus.classList.toggle("empty", visibleCount === 0);
  filterStatus.classList.toggle("has-filters", isFiltered && visibleCount > 0);

  if (visibleCount === 0) {
    const emptyText =
      activeLibrary === "favorites" ? i18n.t("status.no_favorites") : activeLibrary === "recent" ? i18n.t("status.no_recent") : i18n.t("status.no_games");
    filterStatus.innerHTML = `
      <span>${emptyText}</span>
      ${isFiltered ? `<button type="button" data-clear-filters>${i18n.t("status.clear_filters")}</button>` : ""}
    `;
    filterStatus.querySelector("[data-clear-filters]")?.addEventListener("click", resetDiscoveryFilters);
  } else if (activeLibrary === "favorites" && activeFilter === "all" && activeTopic === "all" && activeSkill === "all") {
    filterStatus.textContent = i18n.t(visibleCount > 1 ? "status.favorite_games" : "status.favorite_games_one", {
      count: visibleCount,
    });
  } else if (activeLibrary === "recent" && activeFilter === "all" && activeTopic === "all" && activeSkill === "all") {
    filterStatus.textContent = i18n.t(visibleCount > 1 ? "status.recent_games" : "status.recent_games_one", {
      count: visibleCount,
    });
  } else if (isFiltered) {
    renderFilterStatusSummary(visibleCount, activeDiscoveryLabels());
  } else {
    filterStatus.textContent = i18n.t("status.all_games");
  }
}

function applyStaticTranslations() {
  lobbyKicker.textContent = i18n.t("site.kicker");
  featuredLabel.textContent = i18n.t("site.featured");
  languageLabel.textContent = i18n.t("language.label");
  heroRankLabel.textContent = i18n.t("section.hero_rank");
  heroGamesTitle.textContent = i18n.t("section.hero_games");
  if (upcomingGamesTitle) upcomingGamesTitle.textContent = i18n.t("upcoming.title");
  if (upcomingGamesReason) upcomingGamesReason.textContent = i18n.t("upcoming.reason");
  if (recommendationTitle) recommendationTitle.textContent = i18n.t("recommend.title");
  if (recommendationReason) recommendationReason.textContent = i18n.t("recommend.start_here");
  if (freshUpdatesTitle) freshUpdatesTitle.textContent = i18n.t("fresh_updates.title");
  if (freshUpdatesReason) freshUpdatesReason.textContent = i18n.t("fresh_updates.reason");
  if (skillPathsTitle) skillPathsTitle.textContent = i18n.t("skill_path.title");
  if (skillPathsReason) skillPathsReason.textContent = i18n.t("skill_path.reason");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = i18n.t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", i18n.t(element.dataset.i18nPlaceholder));
  });
  renderFilterCounts();
  localeSelect.value = i18n.locale();
}

function showToast(message) {
  clearTimeout(toastTimer);
  lobbyToast.textContent = message;
  lobbyToast.classList.remove("hidden");
  toastTimer = setTimeout(() => lobbyToast.classList.add("hidden"), 1500);
}

function showPlannedGame(game) {
  window.WonderSound?.play("wrong");
  window.WonderAnalytics?.track("planned_game_click", {
    game_id: game.id,
    game_title: text(game.title),
    age_label: text(game.ageLabel),
    categories: (game.categories || []).join(","),
    locale: i18n.locale(),
  });
  showToast(i18n.t("toast.coming_soon", { title: text(game.title) }));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.ageFilter;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("age_filter", { age_filter: activeFilter, locale: i18n.locale() });
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });
});

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTopic = button.dataset.topicFilter;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("topic_filter", { topic_filter: activeTopic, locale: i18n.locale() });
    topicButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSkill = button.dataset.skillFilter;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("skill_filter", { skill_filter: activeSkill, locale: i18n.locale() });
    skillButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });
});

libraryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLibrary = button.dataset.libraryTab;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("library_tab", { library_tab: activeLibrary, locale: i18n.locale() });
    libraryButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });
});

gameSearch?.addEventListener("input", () => {
  activeSearch = gameSearch.value.trim().toLowerCase();
  applyFilter();
});

localeSelect.addEventListener("change", () => {
  window.WonderSound?.play("click");
  i18n.setLocale(localeSelect.value);
});

localeSelect.addEventListener("input", () => {
  window.WonderSound?.play("click");
  i18n.setLocale(localeSelect.value);
});

window.addEventListener("wonder:locale-change", renderLobby);

renderLobby();
loadGameStats();
window.WonderAnalytics?.track("lobby_ready", {
  playable_games: lobby.games.filter((game) => game.status === "playable").length,
  total_games: lobby.games.length,
  platform: lobby.platform.name,
  locale: i18n.locale(),
});
