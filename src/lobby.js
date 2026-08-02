const lobby = window.WONDER_LOBBY;
const officialGameTitles = window.WEIGHTPLAY_GAME_TITLES || {};
lobby.games.forEach((game) => {
  if (officialGameTitles[game.id]) game.title = officialGameTitles[game.id];
});
let activeGamePreview = null;
const ownerPreviewMode = new URLSearchParams(window.location.search).get("preview") === "1";
const audienceMode = document.body?.dataset.audience === "kids" ? "kids" : "general";
const generalGameIds = new Set(lobby.audiences?.generalGameIds || []);
const isKidsLobby = audienceMode === "kids";
const allLobbyGames = [...lobby.games];
const catalogGames = allLobbyGames.filter((game) =>
  (game.status === "playable"
    || (!ownerPreviewMode && !isKidsLobby && game.id === "animal-dice-bastion"))
  && (isKidsLobby ? !generalGameIds.has(game.id) : generalGameIds.has(game.id)));
const showAgeLabels = isKidsLobby;
const modeHeroGameIds = isKidsLobby
  ? ["color-lunchbox", "animal-zoo-idle", "bubble-bakery", "fruit-merge", "snack-blocks"]
  : ["animal-hero-trials", "animal-relic-hunters", "beast-deck", "animal-rune-tactics", "animal-orb-fortress"];
const modeFeaturedGameId = isKidsLobby ? "color-lunchbox" : "animal-hero-trials";
lobby.games = catalogGames;
lobby.heroGameIds = modeHeroGameIds;
lobby.featuredGameId = modeFeaturedGameId;
if (ownerPreviewMode) {
  document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow");
  document.documentElement.dataset.ownerPreview = "true";
}
const filterButtons = document.querySelectorAll("[data-age-filter]");
const topicButtons = document.querySelectorAll("[data-topic-filter]");
const skillButtons = document.querySelectorAll("[data-skill-filter]");
const libraryButtons = document.querySelectorAll("[data-library-tab]");
const availabilityButtons = document.querySelectorAll("[data-availability-filter]");
const advancedFilters = document.querySelector("#advancedFilters");
const advancedFilterCount = document.querySelector("#advancedFilterCount");
const discoverySnapshot = document.querySelector("#discoverySnapshot");
const continuePlaying = document.querySelector("#continuePlaying");
const continuePlayingSection = document.querySelector("#continuePlayingSection");
const continuePlayingTitle = document.querySelector("#continuePlayingTitle");
const continuePlayingReason = document.querySelector("#continuePlayingReason");
const gameGrid = document.querySelector("#gameGrid");
const heroGames = document.querySelector("#heroGames");
const heroGamesSection = document.querySelector("#heroGamesSection");
const upcomingGames = document.querySelector("#upcomingGames");
const upcomingGamesSection = document.querySelector("#upcomingGamesSection");
const mobilePicks = document.querySelector("#mobilePicks");
const mobilePicksSection = document.querySelector("#mobilePicksSection");
const recommendations = document.querySelector("#recommendations");
const recommendationsSection = document.querySelector("#recommendationsSection");
const freshUpdates = document.querySelector("#freshUpdates");
const freshUpdatesSection = document.querySelector("#freshUpdatesSection");
const challengeSpotlight = document.querySelector("#challengeSpotlight");
const challengeSpotlightSection = document.querySelector("#challengeSpotlightSection");
const characterShowcase = document.querySelector("#characterShowcase");
const characterShowcaseSection = document.querySelector("#characterShowcaseSection");
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
const mobilePicksTitle = document.querySelector("#mobilePicksTitle");
const mobilePicksReason = document.querySelector("#mobilePicksReason");
const upcomingGamesTitle = document.querySelector("#upcomingGamesTitle");
const upcomingGamesReason = document.querySelector("#upcomingGamesReason");
const recommendationTitle = document.querySelector("#recommendationTitle");
const recommendationReason = document.querySelector("#recommendationReason");
const freshUpdatesTitle = document.querySelector("#freshUpdatesTitle");
const freshUpdatesReason = document.querySelector("#freshUpdatesReason");
const challengeSpotlightTitle = document.querySelector("#challengeSpotlightTitle");
const challengeSpotlightReason = document.querySelector("#challengeSpotlightReason");
const characterShowcaseTitle = document.querySelector("#characterShowcaseTitle");
const characterShowcaseReason = document.querySelector("#characterShowcaseReason");
const skillPathsTitle = document.querySelector("#skillPathsTitle");
const skillPathsReason = document.querySelector("#skillPathsReason");
const dailyReward = document.querySelector("#dailyReward");
const gameSearch = document.querySelector("#gameSearch");
const quickPickBtn = document.querySelector("#quickPickBtn");
const i18n = window.WonderI18n;
const favoritesKey = "weightplayFavoriteGames";
const recentGamesKey = "weightplayRecentGames";
const dailyRewardKey = "weightplayDailyReward";
const walletBar = document.querySelector("#walletBar");
const dailyRewardTrack = [5, 6, 8, 10, 12, 15, 25];
const featuredSkillPaths = ["Memory", "Logic", "Reaction", "Focus", "Problem Solving", "Animal Knowledge"];
const recentlyUpdatedGameIds = new Set(["animal-relic-hunters", "animal-zoo-idle", "bubble-bakery", "fruit-merge"]);
const mobilePickGameIds = ["animal-guard-yard", "animal-reef-fisher", "animal-auto-squad", "fruit-merge"];
const hiddenTrialGate = {
  tapsRequired: 10,
  resetMs: 8000,
  counts: new Map(),
  timers: new Map(),
};
const weightPlayCharacters = [
  {
    nameKey: "character.spark_paw_fox.name",
    roleKey: "character.spark_paw_fox.role",
    image: "assets/weightplay-character-spark-paw-fox-cutout.webp",
    skill: "Reaction",
  },
  {
    nameKey: "character.boom_mane_lion.name",
    roleKey: "character.boom_mane_lion.role",
    image: "assets/weightplay-character-boom-mane-lion-cutout.webp",
    skill: "Focus",
  },
  {
    nameKey: "character.moss_shell_turtle.name",
    roleKey: "character.moss_shell_turtle.role",
    image: "assets/weightplay-character-moss-shell-turtle-cutout.webp",
    skill: "Logic",
  },
  {
    nameKey: "character.moon_cap_owl.name",
    roleKey: "character.moon_cap_owl.role",
    image: "assets/weightplay-character-moon-cap-owl-cutout.webp",
    skill: "Problem Solving",
  },
  {
    nameKey: "character.bubble_fin_otter.name",
    roleKey: "character.bubble_fin_otter.role",
    image: "assets/weightplay-character-bubble-fin-otter-cutout.webp",
    skill: "Animal Knowledge",
  },
  {
    nameKey: "character.gear_horn_rhino.name",
    roleKey: "character.gear_horn_rhino.role",
    image: "assets/weightplay-character-gear-horn-rhino-cutout.webp",
    skill: "Problem Solving",
  },
  {
    nameKey: "character.drum_belly_panda.name",
    roleKey: "character.drum_belly_panda.role",
    image: "assets/weightplay-character-drum-belly-panda-safe-face-cutout.webp",
    skill: "Focus",
  },
  {
    nameKey: "character.rainbow_hop_rabbit.name",
    roleKey: "character.rainbow_hop_rabbit.role",
    image: "assets/weightplay-character-rainbow-hop-mimi-clean-cutout.webp",
    skill: "Reaction",
  },
];
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
  "animal-auto-squad": { difficulty: "Medium", time: "5-8 minutes" },
  "animal-reef-fisher": { difficulty: "Medium", time: "3-5 minutes" },
  "beast-tactician": { difficulty: "Hard", time: "5-8 minutes" },
  "shadow-wolf": { difficulty: "Hard", time: "5-8 minutes" },
  "animal-cafe-rush": { difficulty: "Medium", time: "3-5 minutes" },
  "animal-hero-trials": { difficulty: "Hard", time: "5-8 minutes" },
  "animal-gearpack-expedition": { difficulty: "Hard", time: "5-8 minutes" },
  "animal-moonlight-heist": { difficulty: "Medium", time: "5-8 minutes" },
};
let activeFilter = "all";
let activeTopic = "all";
let activeSkill = "all";
let activeLibrary = "all";
let activeAvailability = "all";
let activeSearch = "";
let toastTimer = null;
let favoriteGameIds = readFavorites();
let recentGameIds = readRecentGames();
let gameStats = {
  source: "pending",
  metric: "game_page_view",
  windowDays: 7,
  totals: {
    plays7d: 0,
    playsTotal: 0,
    users7d: 0,
    lobbyVisits7d: 0,
    lobbyVisitsTotal: 0,
    lobbyUsers7d: 0,
  },
  games: {},
};

function text(value) {
  const localized = i18n.getLocalized(value);
  if (value && typeof value === "object" && value.__localizedExact === true) return localized;
  const locale = i18n.actualLocale?.() || i18n.locale?.() || "en";
  const catalog = window.WeightPlayGameRuntimeLocales?.[locale];
  const english = value && typeof value === "object" && !Array.isArray(value) ? value.en : value;
  return catalog?.[localized] || catalog?.[english] || localized;
}

function normalizeSearch(value) {
  const locale = i18n.actualLocale?.() || i18n.locale?.() || undefined;
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase(locale);
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

function selectedFilterValue(buttons, datasetKey, value) {
  return [...buttons].some((button) => button.dataset[datasetKey] === value) ? value : "all";
}

function restoreDiscoveryFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  activeFilter = selectedFilterValue(filterButtons, "ageFilter", params.get("age") || "all");
  activeTopic = selectedFilterValue(topicButtons, "topicFilter", params.get("topic") || "all");
  activeSkill = selectedFilterValue(skillButtons, "skillFilter", params.get("skill") || "all");
  if (activeTopic !== "all" && activeSkill !== "all") activeTopic = "all";
  activeLibrary = selectedFilterValue(libraryButtons, "libraryTab", params.get("library") || "all");
  activeAvailability = selectedFilterValue(availabilityButtons, "availabilityFilter", params.get("availability") || "all");
  const query = params.get("q") || "";
  activeSearch = normalizeSearch(query);
  if (gameSearch) gameSearch.value = query;

  setActiveButtons(filterButtons, "ageFilter", activeFilter);
  setActiveButtons(topicButtons, "topicFilter", activeTopic);
  setActiveButtons(skillButtons, "skillFilter", activeSkill);
  setActiveButtons(libraryButtons, "libraryTab", activeLibrary);
  setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
}

function syncDiscoveryFiltersToUrl(historyMode = "replace") {
  const url = new URL(window.location.href);
  const values = {
    age: activeFilter,
    topic: activeTopic,
    skill: activeSkill,
    library: activeLibrary,
    availability: activeAvailability,
    q: activeSearch,
  };
  Object.entries(values).forEach(([key, value]) => {
    if (!value || value === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });
  const target = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (target === current) return;
  window.history[historyMode === "push" ? "pushState" : "replaceState"](null, "", target);
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
  if (activeAvailability !== "all") labels.push(selectedButtonLabel(availabilityButtons, "availabilityFilter", activeAvailability));
  if (activeSearch) labels.push(i18n.t("status.search_term", { query: activeSearch }));
  return labels.filter(Boolean);
}

function updateAdvancedFilterState() {
  const count = Number(activeTopic !== "all") + Number(activeSkill !== "all") + Number(activeAvailability !== "all");
  if (advancedFilterCount) {
    advancedFilterCount.textContent = String(count);
    advancedFilterCount.classList.toggle("is-empty", count === 0);
    advancedFilterCount.setAttribute("aria-label", i18n.t("filter.active_count", { count }));
  }
  advancedFilters?.classList.toggle("has-active", count > 0);
}

function collapseAdvancedFiltersOnPhone() {
  if (advancedFilters && window.matchMedia("(max-width: 620px)").matches) advancedFilters.open = false;
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

function renderDiscoverySnapshot() {
  if (!discoverySnapshot) return;
  const playableCount = lobby.games.filter((game) => game.status === "playable").length;
  const previewCount = lobby.games.filter((game) => game.status === "planned").length;
  const phonePickCount = mobileFriendlyGames(99).length;
  discoverySnapshot.innerHTML = `
    <button type="button" data-snapshot-filter="playable">
      <strong>${playableCount}</strong>
      <span>${i18n.t("snapshot.playable_title")}</span>
      <small>${i18n.t("snapshot.playable_note")}</small>
    </button>
    <button type="button" data-snapshot-filter="preview">
      <strong>${previewCount}</strong>
      <span>${i18n.t("snapshot.preview_title")}</span>
      <small>${i18n.t("snapshot.preview_note")}</small>
    </button>
    <button type="button" data-snapshot-filter="mobile">
      <strong>${phonePickCount}</strong>
      <span>${i18n.t("snapshot.mobile_title")}</span>
      <small>${i18n.t("snapshot.mobile_note")}</small>
    </button>
  `;
  discoverySnapshot.querySelectorAll("[data-snapshot-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.snapshotFilter;
      if (target === "mobile") {
        activeFilter = "all";
        activeTopic = "all";
        activeSkill = "all";
        activeLibrary = "all";
        activeAvailability = "playable";
        activeSearch = "";
        if (gameSearch) gameSearch.value = "";
        setActiveButtons(filterButtons, "ageFilter", "all");
        setActiveButtons(topicButtons, "topicFilter", "all");
        setActiveButtons(skillButtons, "skillFilter", "all");
        setActiveButtons(libraryButtons, "libraryTab", "all");
        setActiveButtons(availabilityButtons, "availabilityFilter", "playable");
        applyFilter({ historyMode: "push" });
        mobilePicksSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.WonderAnalytics?.track("discovery_snapshot_open", { snapshot: target, locale: i18n.locale() });
        return;
      }
      activeAvailability = target === "preview" ? "preview" : "playable";
      activeLibrary = "all";
      setActiveButtons(libraryButtons, "libraryTab", "all");
      setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
      applyFilter({ historyMode: "push" });
      filterStatus?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.WonderAnalytics?.track("discovery_snapshot_open", { snapshot: target, locale: i18n.locale() });
    });
  });
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

function stateCopy(key) {
  const locale = typeof i18n.actualLocale === "function" ? i18n.actualLocale() : i18n.locale();
  const previewCopy = {
    en: ["Preview", "Coming Soon, not public yet"],
    "zh-Hant": ["新遊戲預告", "敬請期待，尚未公開遊玩"],
    "zh-Hans": ["新游戏预告", "敬请期待，尚未开放游玩"],
    ja: ["プレビュー", "近日公開。まだ遊べません"],
    ko: ["미리보기", "출시 예정이며 아직 공개되지 않았습니다"],
    es: ["Avance", "Próximamente; aún no está disponible"],
    "pt-BR": ["Prévia", "Em breve; ainda não está disponível ao público"],
    fr: ["Aperçu", "Bientôt disponible ; pas encore accessible au public"],
    de: ["Vorschau", "Demnächst; noch nicht öffentlich spielbar"],
    it: ["Anteprima", "Prossimamente; non è ancora disponibile al pubblico"],
    ru: ["Предпросмотр", "Скоро; пока недоступно для публичной игры"],
    hi: ["पूर्वावलोकन", "जल्द आ रहा है; अभी सार्वजनिक रूप से उपलब्ध नहीं है"],
    ar: ["معاينة", "قريبًا؛ ليست متاحة للعب العام بعد"],
  };
  const [previewLabel, previewNote] = previewCopy[locale] || previewCopy.en;
  const zh = locale === "zh-Hant";
  const es = locale === "es";
  const ja = locale === "ja";
  const copy = {
    playableLabel: zh ? "\u53ef\u904a\u73a9" : es ? "Disponible" : ja ? "プレイ可能" : "Playable",
    playableNote: zh ? "\u9ede\u64ca\u5f8c\u7acb\u5373\u9032\u5165" : es ? "Se abre de inmediato" : ja ? "すぐに始められます" : "Opens immediately",
    previewLabel,
    previewNote,
  };
  return copy[key] || key;
}

function gameStateCard(game, isPlayable) {
  const state = isPlayable ? "ready" : "preview";
  const label = isPlayable ? stateCopy("playableLabel") : stateCopy("previewLabel");
  const note = isPlayable ? stateCopy("playableNote") : stateCopy("previewNote");
  const hasInternalTrial = Boolean(!isPlayable && internalTrialPath(game));
  return `
    <div class="game-card-state ${state}" data-state="${state}" data-internal-trial="${hasInternalTrial ? "true" : "false"}">
      <strong>${label}</strong>
      <span>${note}</span>
    </div>
  `;
}

function localizedFactLabel(key) {
  if (i18n.locale() === "es") return key === "time" ? "Tiempo" : "Dificultad";
  if (i18n.locale() === "ja") return key === "time" ? "時間" : "難易度";
  if (i18n.locale() !== "zh-Hant") return key === "time" ? "Time" : "Difficulty";
  return key === "time" ? "\u6642\u9593" : "\u96e3\u5ea6";
}

function localizeDifficulty(value) {
  if (i18n.locale() === "es") {
    return { Easy: "Fácil", Medium: "Media", Hard: "Difícil", Relaxed: "Relajada" }[value] || value;
  }
  if (i18n.locale() === "ja") {
    return { Easy: "かんたん", Medium: "ふつう", Hard: "むずかしい", Relaxed: "ゆったり" }[value] || value;
  }
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
  if (i18n.locale() === "es") return String(value).replace("minutes", "minutos").replace("minute", "minuto");
  if (i18n.locale() === "ja") return String(value).replace(/minutes?/g, "分");
  if (i18n.locale() !== "zh-Hant") return value;
  return String(value)
    .replace("1-3 minutes", "1-3 \u5206\u9418")
    .replace("3-5 minutes", "3-5 \u5206\u9418")
    .replace("5-8 minutes", "5-8 \u5206\u9418")
    .replace("3-8 minutes", "3-8 \u5206\u9418");
}

function countGamesBy(type, value) {
  const renderedCards = [...document.querySelectorAll("#gameGrid [data-age]")];
  if (renderedCards.length) {
    const state = {
      age: activeFilter,
      topic: activeTopic,
      skill: activeSkill,
      library: activeLibrary,
      availability: activeAvailability,
      search: activeSearch,
    };
    if (type === "age") state.age = value;
    if (type === "topic") {
      state.topic = value;
      state.skill = "all";
    }
    if (type === "skill") {
      state.skill = value;
      state.topic = "all";
    }
    if (type === "library") state.library = value;
    if (type === "availability") state.availability = value;
    return renderedCards.filter((card) => cardMatchesFilterState(card, state)).length;
  }
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
  if (type === "availability") {
    if (value === "playable") return lobby.games.filter((game) => game.status === "playable").length;
    if (value === "preview") return lobby.games.filter((game) => game.status === "planned").length;
    return lobby.games.length;
  }
  return 0;
}

function filterButtonLabel(button, type, value) {
  if (button.dataset.i18n) return i18n.t(button.dataset.i18n);
  if (type === "age") return value === "family" ? i18n.t("filter.family") : `${value}+`;
  if (type === "topic") return value === "all" ? i18n.t("filter.all_topics") : categoryText(value);
  if (type === "skill") return value === "all" ? i18n.t("filter.all_skills") : skillText(value);
  if (type === "availability") return value === "all" ? i18n.t("availability.all") : i18n.t(`availability.${value}`);
  return button.textContent.trim();
}

function filterButtonHint(type, value) {
  if (type !== "availability") return "";
  const key = `availability_hint.${value}`;
  const hint = i18n.t(key);
  return hint === key ? "" : hint;
}

function matchesAgeFilter(ages, filterValue) {
  if (filterValue === "all") return true;
  return ages.includes(filterValue);
}

function setFilterCount(button, type, value) {
  const label = filterButtonLabel(button, type, value);
  const count = countGamesBy(type, value);
  const hint = filterButtonHint(type, value);
  button.innerHTML = `
    <span class="filter-copy">
      <span class="filter-label">${label}</span>
      ${hint ? `<span class="filter-hint">${hint}</span>` : ""}
    </span>
    <b class="filter-count">${count}</b>
  `;
  button.setAttribute("aria-label", hint ? `${label}, ${hint}, ${count}` : `${label}, ${count}`);
}

function renderFilterCounts() {
  filterButtons.forEach((button) => setFilterCount(button, "age", button.dataset.ageFilter));
  topicButtons.forEach((button) => setFilterCount(button, "topic", button.dataset.topicFilter));
  skillButtons.forEach((button) => setFilterCount(button, "skill", button.dataset.skillFilter));
  libraryButtons.forEach((button) => setFilterCount(button, "library", button.dataset.libraryTab));
  availabilityButtons.forEach((button) => setFilterCount(button, "availability", button.dataset.availabilityFilter));
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
  return i18n.t("stats.plays_total", { count: formatCount(stats.playsTotal || 0) });
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

function recentPlayableGames(limit = 4) {
  return recentGameIds
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable"))
    .filter(Boolean)
    .slice(0, limit);
}

function recentlyUpdatedGames(limit = 4) {
  return [...recentlyUpdatedGameIds]
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable"))
    .filter(Boolean)
    .slice(0, limit);
}

function upcomingPreviewGames(limit = Number.POSITIVE_INFINITY) {
  return allLobbyGames
    .filter((game) =>
      game.status === "planned"
      && (game.art?.background || game.art?.hero)
      && (isKidsLobby ? !generalGameIds.has(game.id) : generalGameIds.has(game.id)))
    .slice(0, limit);
}

function challengeSpotlightGames(limit = 4) {
  return playableGames()
    .filter((game) => (game.ages || []).includes("13"))
    .sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
    })
    .slice(0, limit);
}

function mobileFriendlyGames(limit = 4) {
  const pinned = mobilePickGameIds
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable"))
    .filter(Boolean);
  const pinnedIds = new Set(pinned.map((game) => game.id));
  const extras = playableGames()
    .filter((game) => !pinnedIds.has(game.id))
    .sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
    });
  return [...pinned, ...extras].slice(0, limit);
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
    if (isKidsLobby) {
      const sharedSkill = (game.skills || []).find((skill) => seeds.some((seed) => (seed.skills || []).includes(skill)));
      if (sharedSkill) return i18n.t("recommend.shared_skill", { skill: skillText(sharedSkill) });
      const sharedAge = (game.ages || []).find((age) => seeds.some((seed) => (seed.ages || []).includes(age)));
      if (sharedAge) return i18n.t("recommend.shared_age", { age: sharedAge === "family" ? i18n.t("filter.family") : `${sharedAge}+` });
    }
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
      metric: stats.metric || "legacy-page-view",
      windowDays: Number(stats.windowDays) || 7,
      totals: {
        plays7d: 0,
        playsTotal: 0,
        users7d: 0,
        lobbyVisits7d: 0,
        lobbyVisitsTotal: null,
        lobbyUsers7d: 0,
        ...(stats.totals || {}),
      },
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
  const gameUrl = new URL(game.href, document.baseURI);
  window.location.href = new URL(i18n.localizedPath(i18n.actualLocale(), `${gameUrl.pathname}${gameUrl.search}${gameUrl.hash}`), gameUrl.origin).href;
}

function cardMatchesFilterState(card, state) {
  const ages = card.dataset.age.split(" ");
  const topics = card.dataset.topic ? card.dataset.topic.split("|") : [];
  const skills = card.dataset.skill ? card.dataset.skill.split("|") : [];
  return (
    matchesAgeFilter(ages, state.age) &&
    (state.topic === "all" || topics.includes(state.topic)) &&
    (state.skill === "all" || skills.includes(state.skill)) &&
    (!state.search || card.dataset.search.includes(state.search)) &&
    (state.library === "all" ||
      (state.library === "favorites" && card.dataset.favorite === "true") ||
      (state.library === "recent" && card.dataset.recent === "true")) &&
    (state.availability === "all" ||
      (state.availability === "playable" && card.dataset.status === "playable") ||
      (state.availability === "preview" && card.dataset.status === "planned"))
  );
}

function quickPickCandidates() {
  const visiblePlayableIds = [...gameGrid.querySelectorAll('[data-game-id][data-status="playable"]:not(.hidden)')]
    .map((card) => card.dataset.gameId)
    .filter(Boolean);
  const visibleGames = visiblePlayableIds
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable"))
    .filter(Boolean);
  return visibleGames.length
    ? { games: visibleGames, usedFallback: false }
    : { games: playableGames(), usedFallback: true };
}

function openQuickPick() {
  const { games, usedFallback } = quickPickCandidates();
  if (!games.length) return;
  const game = games[Math.floor(Math.random() * games.length)];
  const title = text(game.title);
  const ageLabel = text(game.ageLabel);
  window.WonderAnalytics?.track("quick_pick_open", {
    game_id: game.id,
    game_title: title,
    candidate_count: games.length,
    used_fallback: usedFallback,
    locale: i18n.locale(),
  });
  openGame(game, title, ageLabel);
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
  card.dataset.age = (game.ages || []).join(" ");
  card.dataset.topic = (game.categories || []).join("|");
  card.dataset.skill = (game.skills || []).join("|");
  card.dataset.status = game.status;
  card.dataset.gameId = game.id;
  card.dataset.search = [
    title,
    type,
    ageLabel,
    text(game.description),
    ...(game.categories || []).map(categoryText),
    ...(game.skills || []).map(skillText),
  ].join(" ");
  card.dataset.search = normalizeSearch(card.dataset.search);
  card.dataset.favorite = favorite ? "true" : "false";
  card.dataset.recent = recent ? "true" : "false";
  card.dataset.recentIndex = String(recentGameIds.indexOf(game.id));
  card.dataset.internalTrial = !isPlayable && internalTrialPath(game) ? "true" : "false";
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

  const meta = isPlayable ? text(game.meta).map((item) => `<span>${item}</span>`).join("") : "";
  const categoryBadges = (game.categories || []).map((item) => `<span>${categoryText(item)}</span>`).join("");
  const skillBadges = isKidsLobby && isPlayable ? (game.skills || []).slice(0, 3).map((item) => `<span>${skillText(item)}</span>`).join("") : "";
  const skillReason = isKidsLobby && isPlayable ? skillReasonText(game) : "";
  const quickFacts = isPlayable ? [gameInfoText(game.id, "difficulty"), gameInfoText(game.id, "time")].filter(Boolean).join("") : "";
  const cardArt = game.art || {
    kind: "image",
    background: game.cover || "assets/hero.png",
    hideHero: true,
  };
  const showHero = cardArt.hero && !cardArt.hideHero && !cardArt.hero.includes("width='1'");
  const comingSoonBadge = isPlayable ? "" : `<span class="coming-soon-art-badge">${i18n.t("action.coming_soon")}</span>`;
  const art =
    cardArt.kind === "image"
      ? `<div class="game-card-art image-art"><img class="game-card-bg-blur" src="${cardArt.background}" alt="" /><img class="game-card-fg" src="${cardArt.background}" alt="" />${showHero ? `<img class="game-card-hero" src="${cardArt.hero}" alt="" />` : ""}${isPlayable && game.previewVideo ? `<video class="game-card-preview" data-preview-src="${game.previewVideo}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ""}${comingSoonBadge}</div>`
      : `<div class="game-card-art ${cardArt.className || ""}">${showAgeLabels ? `<span>${ageLabel}</span>` : ""}${comingSoonBadge}</div>`;
  const favoriteAction = i18n.t(favorite ? "action.remove_favorite" : "action.add_favorite");
  const favoriteLabel = i18n.t(favorite ? "action.remove_favorite_title" : "action.add_favorite_title", { title });
  const primaryAction = isPlayable ? i18n.t(recent ? "action.continue" : "action.play") : i18n.t("action.coming_soon");
  const ageOverlay = isKidsLobby && showAgeLabels ? `<span class="game-card-age-overlay">${ageLabel}</span>` : "";
  const continueBadge = isPlayable && recent ? `<span class="continue-badge">${i18n.t("action.continue")}</span>` : "";
  const popularBadge = hasRealStats() && stats.rank7d && stats.rank7d <= 5 ? `<span class="popular-card-badge">${rankLabel(game, stats.rank7d)}</span>` : "";
  const updatedBadge = recentlyUpdatedGameIds.has(game.id) ? `<span class="updated-card-badge">${i18n.t("badge.updated")}</span>` : "";

  card.innerHTML = `
    ${art}
    ${ageOverlay}
    ${continueBadge}
    <button class="favorite-toggle ${favorite ? "active" : ""}" type="button" aria-label="${favoriteLabel}" title="${favoriteAction}">
      <svg class="favorite-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.4 10.7 19.2C5.8 14.8 3 12.2 3 8.9 3 6.2 5.1 4.1 7.8 4.1 9.3 4.1 10.8 4.8 11.8 5.9 12.8 4.8 14.3 4.1 15.8 4.1 18.5 4.1 20.6 6.2 20.6 8.9 20.6 12.2 17.8 14.8 12.9 19.2L12 20.4Z" />
      </svg>
    </button>
    <div class="game-card-body">
      <div class="game-card-topline">
        ${showAgeLabels ? `<span class="age-pill">${ageLabel}</span>` : ""}
        <span class="game-card-badges">
          ${updatedBadge}
          ${popularBadge}
          <span>${isPlayable ? stateCopy("playableLabel") : text(game.statusText)}</span>
        </span>
      </div>
      <h2 data-runtime-localize="off">${title}</h2>
      <p>${text(game.description)}</p>
      ${gameStateCard(game, isPlayable)}
      <div class="game-card-categories">${categoryBadges}</div>
      ${skillBadges ? `<div class="game-card-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
      ${skillReason ? `<div class="game-card-skill-reason">${skillReason}</div>` : ""}
      ${quickFacts ? `<div class="game-card-facts" aria-label="${i18n.t("aria.game_quick_facts")}">${quickFacts}</div>` : ""}
      <div class="game-card-meta">${meta}</div>
      ${isPlayable ? `<div class="game-card-plays">${playCountText(game)}</div>` : ""}
      ${isKidsLobby ? "" : `
        <div class="game-card-actions">
          <span>${primaryAction}</span>
          <span>${type}</span>
        </div>
      `}
    </div>
  `;

  card.querySelector(".favorite-toggle").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(game, title);
  });

  const preview = card.querySelector(".game-card-preview");
  if (preview) {
    const canPreview = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stopPreview = () => {
      preview.pause();
      card.classList.remove("is-previewing");
      if (activeGamePreview === preview) activeGamePreview = null;
    };
    const startPreview = () => {
      if (!canPreview()) return;
      if (activeGamePreview && activeGamePreview !== preview) {
        activeGamePreview.pause();
        activeGamePreview.closest(".game-card")?.classList.remove("is-previewing");
      }
      activeGamePreview = preview;
      if (!preview.getAttribute("src")) {
        preview.src = preview.dataset.previewSrc;
        preview.load();
      }
      preview.play()
        .then(() => {
          if (activeGamePreview === preview) card.classList.add("is-previewing");
        })
        .catch(() => {
          card.classList.remove("is-previewing");
          if (activeGamePreview === preview) activeGamePreview = null;
        });
    };
    card.addEventListener("pointerenter", startPreview);
    card.addEventListener("pointerleave", stopPreview);
    card.addEventListener("focusin", startPreview);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) stopPreview();
    });
  }

  return card;
}

function renderLobby() {
  applyStaticTranslations();
  platformTitle.textContent = isKidsLobby ? "WeightPlay Kids" : lobby.platform.name;
  platformSubtitle.textContent = i18n.t(isKidsLobby ? "kids.site.subtitle" : "general.site.subtitle");
  renderWallet();

  const totalGameCount = lobby.games.length;
  const lobbyVisitsTotal = Number(gameStats.totals?.lobbyVisitsTotal);
  const hasLobbyVisitTotal = hasStatsFeed() && gameStats.totals?.lobbyVisitsTotal !== null && Number.isFinite(lobbyVisitsTotal) && lobbyVisitsTotal >= 0;
  lobbyStats.innerHTML = `
    <div><strong>${totalGameCount}</strong><span>${i18n.t("stats.total_games")}</span></div>
    <div><strong>${hasLobbyVisitTotal ? formatCount(lobbyVisitsTotal) : "..."}</strong><span>${i18n.t("stats.lobby_visits_total_short")}</span></div>
  `;

  renderDailyReward();

  if (isKidsLobby) {
    const featured = lobby.games.find((game) => game.id === lobby.featuredGameId);
    if (featured) {
      featuredGame.href = featured.href;
      featuredGame.querySelector("img").src = primaryArt(featured);
      const featuredTitle = featuredGame.querySelector("strong");
      featuredTitle.dataset.runtimeLocalize = "off";
      featuredTitle.textContent = text(featured.title);
    }
  } else {
    featuredGame.href = "kids/";
    featuredGame.querySelector("img").src = "assets/animal-zoo-idle-cover.webp";
    featuredGame.querySelector("strong").textContent = i18n.t("kids.portal.title");
    featuredGame.setAttribute("aria-label", i18n.t("kids.portal.action"));
  }

  renderContinuePlaying();
  renderHeroGames();
  renderMobilePicks();
  renderUpcomingGames();
  renderCharacterShowcase();
  renderFreshUpdates();
  renderChallengeSpotlight();
  renderRecommendations();
  renderSkillPaths();
  gameGrid.replaceChildren(...lobby.games.map(createGameCard));
  applyFilter();
}

function renderContinuePlaying() {
  if (!continuePlaying || !continuePlayingSection) return;
  const cards = recentPlayableGames(4).map((game, index) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const card = document.createElement("a");
    card.className = "continue-playing-card";
    card.href = game.href;
    card.dataset.gameId = game.id;
    card.addEventListener("click", () => {
      window.WonderAnalytics?.track("continue_playing_open", {
        game_id: game.id,
        game_title: title,
        recent_position: index + 1,
        locale: i18n.locale(),
      });
      recordRecentGame(game.id);
    });
    card.innerHTML = `
      <img src="${game.art?.background || primaryArt(game)}" alt="" />
      <div class="continue-playing-copy">
        ${showAgeLabels ? `<span>${ageLabel}</span>` : ""}
        <strong data-runtime-localize="off">${title}</strong>
        <small>${type}</small>
        <b>${i18n.t("action.continue")}</b>
      </div>
    `;
    return card;
  });
  continuePlayingTitle.textContent = i18n.t("continue_playing.title");
  continuePlayingReason.textContent = i18n.t("continue_playing.reason");
  continuePlayingSection.setAttribute("aria-label", i18n.t("continue_playing.title"));
  continuePlayingSection.classList.toggle("hidden", cards.length === 0);
  continuePlaying.replaceChildren(...cards);
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
  const cards = popularGames(5)
    .map((game, index) => {
      const isPlayable = game.status === "playable";
      const title = text(game.title);
      const type = text(game.type);
      const ageLabel = text(game.ageLabel);
      // Popular cards are ranked after unavailable games are filtered out, so
      // their visible Top 5 positions must stay consecutive.
      const rankText = i18n.t("stats.rank_label", { rank: index + 1 });
      const showHero = game.art?.hero && !game.art.hideHero && !game.art.hero.includes("width='1'");
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
          ${showHero ? `<img class="hero-game-character" src="${game.art.hero}" alt="" />` : ""}
          <span>${rankText}</span>
        </div>
        <div class="hero-game-copy">
          <strong data-runtime-localize="off">${title}</strong>
          <small>${showAgeLabels ? `${type} / ${ageLabel}` : type}</small>
          <em>${playCountText(game)}</em>
        </div>
      `;
      return card;
    });

  heroGames.replaceChildren(...cards);
}

function renderMobilePicks() {
  if (!mobilePicks || !mobilePicksSection) return;
  const cards = mobileFriendlyGames(4).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const skillBadges = isKidsLobby ? (game.skills || []).slice(0, 2).map((skill) => `<span>${skillText(skill)}</span>`).join("") : "";
    const card = document.createElement("a");
    card.className = "mobile-pick-card";
    card.href = game.href;
    card.addEventListener("click", () => {
      window.WonderAnalytics?.track("mobile_pick_open", {
        game_id: game.id,
        game_title: title,
        locale: i18n.locale(),
      });
      recordRecentGame(game.id);
    });
    card.innerHTML = `
      <div class="mobile-pick-art">
        <img src="${game.art?.background || primaryArt(game)}" alt="" />
        <span>${i18n.t("mobile_picks.badge")}</span>
      </div>
      <div class="mobile-pick-copy">
        <strong data-runtime-localize="off">${title}</strong>
        <small>${showAgeLabels ? `${type} / ${ageLabel}` : type}</small>
        <em>${i18n.t("mobile_picks.note")}</em>
        ${skillBadges ? `<div class="mobile-pick-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
      </div>
    `;
    return card;
  });

  mobilePicksTitle.textContent = i18n.t("mobile_picks.title");
  mobilePicksReason.textContent = i18n.t("mobile_picks.reason");
  mobilePicksSection.classList.toggle("hidden", cards.length === 0);
  mobilePicks.replaceChildren(...cards);
}

function renderUpcomingGames() {
  if (!upcomingGames || !upcomingGamesSection) return;
  if (!ownerPreviewMode) {
    upcomingGamesSection.hidden = true;
    upcomingGamesSection.classList.add("hidden");
    upcomingGames.replaceChildren();
    return;
  }
  const cards = upcomingPreviewGames().map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const description = text(game.description);
    const showHero = game.art?.hero && !game.art.hideHero && !game.art.hero.includes("width='1'");
    const card = document.createElement("button");
    card.className = "upcoming-game-card";
    card.type = "button";
    card.dataset.gameId = game.id;
    card.dataset.status = game.status;
    card.dataset.internalTrial = internalTrialPath(game) ? "true" : "false";
    card.addEventListener("click", () => showPlannedGame(game));
    card.innerHTML = `
      <div class="upcoming-game-art">
        <img src="${game.art?.background || primaryArt(game)}" alt="" />
        ${showHero ? `<img class="upcoming-game-hero" src="${game.art.hero}" alt="" />` : ""}
        <span>${i18n.t("action.coming_soon")}</span>
      </div>
      <div class="upcoming-game-copy">
        <strong data-runtime-localize="off">${title}</strong>
        <small>${showAgeLabels ? `${type} / ${ageLabel}` : type}</small>
        ${gameStateCard(game, false)}
        <em>${description}</em>
      </div>
    `;
    return card;
  });

  upcomingGamesTitle.textContent = i18n.t("upcoming.title");
  upcomingGamesReason.textContent = i18n.t("upcoming.reason");
  upcomingGamesSection.hidden = cards.length === 0;
  upcomingGamesSection.classList.toggle("hidden", cards.length === 0);
  upcomingGames.replaceChildren(...cards);
}

function renderCharacterShowcase() {
  if (!characterShowcase || !characterShowcaseSection) return;
  if (!isKidsLobby) {
    characterShowcaseSection.classList.add("hidden");
    characterShowcase.replaceChildren();
    return;
  }
  const cards = weightPlayCharacters.map((character) => {
    const name = i18n.t(character.nameKey);
    const skill = skillText(character.skill);
    const card = document.createElement("button");
    card.className = "character-showcase-card";
    card.type = "button";
    card.setAttribute("aria-label", i18n.t("character_showcase.open", { name, skill }));
    card.addEventListener("click", () => selectCharacterPath(character));
    card.innerHTML = `
      <img src="${character.image}" alt="" />
      <div class="character-showcase-copy">
        <strong>${name}</strong>
        <small>${i18n.t(character.roleKey)}</small>
        <span>${i18n.t("character_showcase.cta", { skill })}</span>
      </div>
    `;
    return card;
  });

  characterShowcaseTitle.textContent = i18n.t("character_showcase.title");
  characterShowcaseReason.textContent = i18n.t("character_showcase.reason");
  characterShowcaseSection.classList.toggle("hidden", cards.length === 0);
  characterShowcase.replaceChildren(...cards);
}

function renderRecommendations() {
  if (!recommendations || !recommendationsSection) return;
  const seeds = recommendationSeeds();
  const cards = recommendedGames(3).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const note = recommendationNote(game, seeds);
    const skillBadges = isKidsLobby ? (game.skills || []).slice(0, 2).map((skill) => `<span>${skillText(skill)}</span>`).join("") : "";
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
        <span class="recommendation-labels">${showAgeLabels ? `<span class="recommendation-age">${ageLabel}</span>` : ""}${updatedBadge}</span>
        <strong data-runtime-localize="off">${title}</strong>
        <small>${type}</small>
        <em>${note}</em>
        ${skillBadges ? `<div class="recommendation-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
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
    const skillBadges = isKidsLobby ? (game.skills || []).slice(0, 2).map((skill) => `<span>${skillText(skill)}</span>`).join("") : "";
    const card = document.createElement("a");
    card.className = "fresh-update-card";
    card.dataset.gameId = game.id;
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
        <strong data-runtime-localize="off">${title}</strong>
        <small>${showAgeLabels ? `${type} / ${ageLabel}` : type}</small>
        <em>${description}</em>
        ${skillBadges ? `<div class="fresh-update-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
      </div>
    `;
    return card;
  });

  freshUpdatesTitle.textContent = i18n.t("fresh_updates.title");
  freshUpdatesReason.textContent = i18n.t("fresh_updates.reason");
  freshUpdatesSection.classList.toggle("hidden", cards.length === 0);
  freshUpdates.replaceChildren(...cards);
}

function renderChallengeSpotlight() {
  if (!challengeSpotlight || !challengeSpotlightSection) return;
  const cards = challengeSpotlightGames(4).map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const description = text(game.description);
    const skillBadges = isKidsLobby ? (game.skills || []).slice(0, 3).map((skill) => `<span>${skillText(skill)}</span>`).join("") : "";
    const card = document.createElement("a");
    card.className = "challenge-spotlight-card";
    card.href = game.href;
    card.addEventListener("click", () => {
      window.WonderAnalytics?.track("challenge_spotlight_open", {
        game_id: game.id,
        game_title: title,
        locale: i18n.locale(),
      });
      recordRecentGame(game.id);
    });
    card.innerHTML = `
      <div class="challenge-spotlight-art">
        <img src="${game.art?.background || primaryArt(game)}" alt="" />
        <span>${i18n.t("challenge_spotlight.badge")}</span>
      </div>
      <div class="challenge-spotlight-copy">
        <strong data-runtime-localize="off">${title}</strong>
        <small>${type}</small>
        <em>${description}</em>
        ${skillBadges ? `<div class="challenge-spotlight-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
        <b>${i18n.t("challenge_spotlight.cta")}</b>
      </div>
    `;
    return card;
  });

  challengeSpotlightTitle.textContent = i18n.t("challenge_spotlight.title");
  challengeSpotlightReason.textContent = i18n.t("challenge_spotlight.reason");
  challengeSpotlightSection.classList.toggle("hidden", cards.length === 0);
  challengeSpotlight.replaceChildren(...cards);
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
  if (!isKidsLobby) {
    skillPathsSection.classList.add("hidden");
    skillPaths.replaceChildren();
    return;
  }
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
  activeAvailability = "all";
  activeSearch = "";
  if (gameSearch) gameSearch.value = "";
  setActiveButtons(filterButtons, "ageFilter", "all");
  setActiveButtons(topicButtons, "topicFilter", "all");
  setActiveButtons(skillButtons, "skillFilter", skill);
  setActiveButtons(libraryButtons, "libraryTab", "all");
  setActiveButtons(availabilityButtons, "availabilityFilter", "all");
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("skill_path_open", { skill_path: skill, locale: i18n.locale() });
  applyFilter({ historyMode: "push" });
  filterStatus?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectCharacterPath(character) {
  const name = i18n.t(character.nameKey);
  const skill = skillText(character.skill);
  selectSkillPath(character.skill);
  window.WonderAnalytics?.track("character_showcase_open", {
    character: name,
    skill_path: character.skill,
    locale: i18n.locale(),
  });
  showToast(i18n.t("character_showcase.toast", { name, skill }));
}

function resetDiscoveryFilters() {
  activeFilter = "all";
  activeTopic = "all";
  activeSkill = "all";
  activeLibrary = "all";
  activeAvailability = "all";
  activeSearch = "";
  if (gameSearch) gameSearch.value = "";
  setActiveButtons(filterButtons, "ageFilter", "all");
  setActiveButtons(topicButtons, "topicFilter", "all");
  setActiveButtons(skillButtons, "skillFilter", "all");
  setActiveButtons(libraryButtons, "libraryTab", "all");
  setActiveButtons(availabilityButtons, "availabilityFilter", "all");
  window.WonderSound?.play("click");
  window.WonderAnalytics?.track("clear_lobby_filters", { locale: i18n.locale() });
  applyFilter({ historyMode: "push" });
}

function applyFilter({ historyMode = "replace" } = {}) {
  let visibleCount = 0;
  const isFiltered =
    activeFilter !== "all" ||
    activeTopic !== "all" ||
    activeSkill !== "all" ||
    activeLibrary !== "all" ||
    activeAvailability !== "all" ||
    Boolean(activeSearch);
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
    const matchesAvailability =
      activeAvailability === "all" ||
      (activeAvailability === "playable" && card.dataset.status === "playable") ||
      (activeAvailability === "preview" && card.dataset.status === "planned");
    const isVisible = matchesAge && matchesTopic && matchesSkill && matchesSearch && matchesLibrary && matchesAvailability;
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
  discoverySnapshot?.classList.toggle("hidden", isFiltered);
  continuePlayingSection?.classList.toggle("filtered-out", isFiltered);
  mobilePicksSection?.classList.toggle("hidden", isFiltered);
  upcomingGamesSection?.classList.toggle(
    "hidden",
    !ownerPreviewMode || upcomingPreviewGames().length === 0 || isFiltered,
  );
  characterShowcaseSection?.classList.toggle("hidden", isFiltered);
  recommendationsSection?.classList.toggle("hidden", isFiltered);
  freshUpdatesSection?.classList.toggle("hidden", isFiltered);
  challengeSpotlightSection?.classList.toggle("hidden", isFiltered);
  skillPathsSection?.classList.toggle("hidden", isFiltered);
  filterStatus.classList.toggle("results-active", isFiltered);
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
  } else if (activeLibrary === "favorites" && activeFilter === "all" && activeTopic === "all" && activeSkill === "all" && activeAvailability === "all") {
    filterStatus.textContent = i18n.t(visibleCount > 1 ? "status.favorite_games" : "status.favorite_games_one", {
      count: visibleCount,
    });
  } else if (activeLibrary === "recent" && activeFilter === "all" && activeTopic === "all" && activeSkill === "all" && activeAvailability === "all") {
    filterStatus.textContent = i18n.t(visibleCount > 1 ? "status.recent_games" : "status.recent_games_one", {
      count: visibleCount,
    });
  } else if (isFiltered) {
    renderFilterStatusSummary(visibleCount, activeDiscoveryLabels());
  } else {
    filterStatus.textContent = i18n.t("status.all_games");
  }

  renderFilterCounts();
  updateAdvancedFilterState();
  syncDiscoveryFiltersToUrl(historyMode);
}

function applyStaticTranslations() {
  document.title = i18n.t(isKidsLobby ? "kids.site.title" : "general.site.title");
  const descriptionKey = isKidsLobby ? "kids.site.description" : "general.site.description";
  const localizedDescription = i18n.t(descriptionKey);
  if (localizedDescription && localizedDescription !== descriptionKey) {
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => {
      meta.setAttribute("content", localizedDescription);
    });
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
      meta.setAttribute("content", document.title);
    });
  }
  if (lobbyKicker) lobbyKicker.textContent = i18n.t(isKidsLobby ? "kids.site.kicker" : "general.site.kicker");
  featuredLabel.textContent = i18n.t(isKidsLobby ? "site.featured" : "kids.portal.kicker");
  languageLabel.textContent = i18n.t("language.label");
  heroRankLabel.textContent = i18n.t("section.hero_rank");
  heroGamesTitle.textContent = i18n.t("section.hero_games");
  if (mobilePicksTitle) mobilePicksTitle.textContent = i18n.t("mobile_picks.title");
  if (mobilePicksReason) mobilePicksReason.textContent = i18n.t("mobile_picks.reason");
  if (upcomingGamesTitle) upcomingGamesTitle.textContent = i18n.t("upcoming.title");
  if (upcomingGamesReason) upcomingGamesReason.textContent = i18n.t("upcoming.reason");
  if (characterShowcaseTitle) characterShowcaseTitle.textContent = i18n.t("character_showcase.title");
  if (characterShowcaseReason) characterShowcaseReason.textContent = i18n.t("character_showcase.reason");
  if (recommendationTitle) recommendationTitle.textContent = i18n.t("recommend.title");
  if (recommendationReason) recommendationReason.textContent = i18n.t("recommend.start_here");
  if (freshUpdatesTitle) freshUpdatesTitle.textContent = i18n.t("fresh_updates.title");
  if (freshUpdatesReason) freshUpdatesReason.textContent = i18n.t("fresh_updates.reason");
  if (challengeSpotlightTitle) challengeSpotlightTitle.textContent = i18n.t(isKidsLobby ? "kids.challenge.title" : "general.challenge.title");
  if (challengeSpotlightReason) challengeSpotlightReason.textContent = i18n.t("challenge_spotlight.reason");
  if (skillPathsTitle) skillPathsTitle.textContent = i18n.t("skill_path.title");
  if (skillPathsReason) skillPathsReason.textContent = i18n.t("skill_path.reason");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = i18n.t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", i18n.t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll([
    ".desktop-filter-rail",
    ".library-tabs",
    ".topic-filter",
    ".availability-filter",
    ".desktop-filter-group",
    "[data-library-tab]",
    "[data-topic-filter]",
    "[data-availability-filter]",
    "#lobbyAccountStrip",
    "#lobbyStats",
    "#gameGrid",
  ].join(",")).forEach((node) => node.setAttribute("data-runtime-localize-attributes", "off"));
  document.querySelectorAll("[data-library-tab], [data-topic-filter], [data-availability-filter]")
    .forEach((node) => node.setAttribute("data-runtime-localize", "off"));
  quickPickBtn?.setAttribute("aria-label", i18n.t("quick_pick.label"));
  const ariaLabels = {
    "#localeSelect": "language.label",
    "#lobbyAccountStrip": "aria.player_status",
    "#lobbyStats": "aria.platform_status",
    "#dailyReward": "aria.daily_reward",
    ".parent-trust-points": "aria.parent_trust_highlights",
    ".site-footer nav": "aria.site_links",
  };
  Object.entries(ariaLabels).forEach(([selector, key]) => {
    document.querySelector(selector)?.setAttribute("aria-label", i18n.t(key));
  });
  document.querySelectorAll(".desktop-filter-rail").forEach((node) => node.setAttribute("aria-label", i18n.t("aria.game_filters")));
  document.querySelectorAll(".library-tabs").forEach((node) => node.setAttribute("aria-label", i18n.t("aria.library_tabs")));
  document.querySelectorAll(".topic-filter, .desktop-filter-group").forEach((node) => {
    if (node.querySelector("[data-topic-filter]")) node.setAttribute("aria-label", i18n.t("aria.topic_filters"));
  });
  document.querySelectorAll(".availability-filter, .desktop-filter-group").forEach((node) => {
    if (node.querySelector("[data-availability-filter]")) node.setAttribute("aria-label", i18n.t("aria.availability_filters"));
  });
  gameGrid?.setAttribute("aria-label", i18n.t("aria.game_list"));
  const regionLabels = [
    [heroGamesSection, "section.hero_games"],
    [mobilePicksSection, "mobile_picks.title"],
    [upcomingGamesSection, "availability_hint.preview"],
    [characterShowcaseSection, "character_showcase.title"],
    [freshUpdatesSection, "fresh_updates.title"],
    [challengeSpotlightSection, isKidsLobby ? "kids.challenge.title" : "general.challenge.title"],
    [recommendationsSection, "recommend.title"],
    [gameGrid, "aria.game_list"],
  ];
  regionLabels.forEach(([node, key]) => {
    if (!node) return;
    node.setAttribute("data-runtime-localize-attributes", "off");
    node.setAttribute("aria-label", text(i18n.t(key)));
  });
  renderFilterCounts();
  renderDiscoverySnapshot();
  localeSelect.value = i18n.locale();
}

function showToast(message) {
  clearTimeout(toastTimer);
  lobbyToast.textContent = message;
  lobbyToast.classList.remove("hidden");
  toastTimer = setTimeout(() => lobbyToast.classList.add("hidden"), 1500);
}

function showPlannedGame(game) {
  const trialPath = internalTrialPath(game);
  if (ownerPreviewMode && trialPath) {
    try {
      sessionStorage.setItem(hiddenTrialStorageKey(game), "true");
    } catch (error) {
      // The explicit preview route can still open when storage is unavailable.
    }
    window.location.href = hiddenTrialUrl(game, trialPath);
    return;
  }
  if (handleHiddenTrialGate(game)) return;
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

function internalTrialPath(game) {
  if (!game.internalTrial) return "";
  if (typeof game.internalTrial === "string") return game.internalTrial;
  return "internal-test.html?trial=1";
}

function hiddenTrialStorageKey(game) {
  return `${game.id}TrialUnlocked`;
}

function hiddenTrialUrl(game, trialPath) {
  const gameUrl = new URL(game.href || "", document.baseURI);
  return new URL(trialPath, gameUrl).href;
}

function handleHiddenTrialGate(game) {
  const trialPath = internalTrialPath(game);
  if (game.status !== "planned" || !trialPath) return false;

  for (const [gameId, timer] of hiddenTrialGate.timers) {
    if (gameId === game.id) continue;
    clearTimeout(timer);
    hiddenTrialGate.timers.delete(gameId);
    hiddenTrialGate.counts.delete(gameId);
  }

  const count = (hiddenTrialGate.counts.get(game.id) || 0) + 1;
  hiddenTrialGate.counts.set(game.id, count);
  clearTimeout(hiddenTrialGate.timers.get(game.id));

  window.WonderAnalytics?.track("hidden_trial_gate_tap", {
    game_id: game.id,
    tap_count: count,
    taps_required: hiddenTrialGate.tapsRequired,
    locale: i18n.locale(),
  });

  if (count >= hiddenTrialGate.tapsRequired) {
    hiddenTrialGate.counts.set(game.id, 0);
    clearTimeout(hiddenTrialGate.timers.get(game.id));
    hiddenTrialGate.timers.delete(game.id);
    try {
      sessionStorage.setItem(hiddenTrialStorageKey(game), "true");
    } catch (error) {
      // The trial route can still open when storage is unavailable.
    }
    window.WonderSound?.play("success");
    window.location.href = hiddenTrialUrl(game, trialPath);
    return true;
  }

  const timer = setTimeout(() => {
    hiddenTrialGate.counts.delete(game.id);
    hiddenTrialGate.timers.delete(game.id);
  }, hiddenTrialGate.resetMs);
  hiddenTrialGate.timers.set(game.id, timer);

  window.WonderSound?.play("click");
  showToast(i18n.t("toast.coming_soon", { title: text(game.title) }));
  return true;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.ageFilter;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("age_filter", { age_filter: activeFilter, locale: i18n.locale() });
    setActiveButtons(filterButtons, "ageFilter", activeFilter);
    applyFilter({ historyMode: "push" });
  });
});

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTopic = button.dataset.topicFilter;
    activeSkill = "all";

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("topic_filter", { topic_filter: activeTopic, locale: i18n.locale() });
    setActiveButtons(topicButtons, "topicFilter", activeTopic);
    setActiveButtons(skillButtons, "skillFilter", "all");
    applyFilter({ historyMode: "push" });
    collapseAdvancedFiltersOnPhone();
  });
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSkill = button.dataset.skillFilter;
    activeTopic = "all";

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("skill_filter", { skill_filter: activeSkill, locale: i18n.locale() });
    setActiveButtons(skillButtons, "skillFilter", activeSkill);
    setActiveButtons(topicButtons, "topicFilter", "all");
    applyFilter({ historyMode: "push" });
    collapseAdvancedFiltersOnPhone();
  });
});

libraryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLibrary = button.dataset.libraryTab;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("library_tab", { library_tab: activeLibrary, locale: i18n.locale() });
    setActiveButtons(libraryButtons, "libraryTab", activeLibrary);
    applyFilter({ historyMode: "push" });
  });
});

availabilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeAvailability = button.dataset.availabilityFilter;

    window.WonderSound?.play("click");
    window.WonderAnalytics?.track("availability_filter", { availability_filter: activeAvailability, locale: i18n.locale() });
    setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
    applyFilter({ historyMode: "push" });
    collapseAdvancedFiltersOnPhone();
  });
});

gameSearch?.addEventListener("input", () => {
  activeSearch = normalizeSearch(gameSearch.value);
  applyFilter();
});

quickPickBtn?.addEventListener("click", openQuickPick);

document.querySelectorAll("[data-reset-discovery]").forEach((button) => {
  button.addEventListener("click", resetDiscoveryFilters);
});

localeSelect.addEventListener("change", () => {
  window.WonderSound?.play("click");
  i18n.setLocale(localeSelect.value);
});

window.addEventListener("wonder:locale-change", renderLobby);

window.addEventListener("popstate", () => {
  restoreDiscoveryFiltersFromUrl();
  renderLobby();
});

restoreDiscoveryFiltersFromUrl();
renderLobby();
loadGameStats();
window.WonderAnalytics?.track("lobby_ready", {
  playable_games: lobby.games.filter((game) => game.status === "playable").length,
  total_games: lobby.games.length,
  platform: lobby.platform.name,
  locale: i18n.locale(),
});
