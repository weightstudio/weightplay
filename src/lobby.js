const lobby = window.WONDER_LOBBY;
const gameGenres = window.WeightPlayGameGenres;
if (!gameGenres) throw new Error("Lobby gameplay registry is missing");
const officialGameTitles = window.WEIGHTPLAY_GAME_TITLES || {};
lobby.games.forEach((game) => {
  // Editorial/theme tags are not gameplay genres. Retain them separately for
  // the existing Featured shortcut and leave hall membership to its registry.
  game.catalogTags = [...(game.categories || [])];
  const genre = gameGenres.get(game);
  game.categories = genre ? [genre.primary, ...genre.secondary.filter((id) => gameGenres.genreIds.includes(id))] : [];
  game.mechanics = genre?.secondary.filter((id) => !gameGenres.genreIds.includes(id)) || [];
  game.skills = [...new Set((game.skills || []).map((skill) =>
    skill === "Hand-eye Coordination" ? "Hand-Eye Coordination" : skill))];
  if (officialGameTitles[game.id]) game.title = officialGameTitles[game.id];
  const interface7Poster = window.WEIGHTPLAY_INTERFACE7_POSTERS?.[game.id];
  if (interface7Poster) {
    game.art = { ...(game.art || {}), kind: "image", background: interface7Poster, hideHero: true };
  }
});
let activeGamePreview = null;
const ownerPreviewMode = new URLSearchParams(window.location.search).get("preview") === "1";
const audienceMode = document.body?.dataset.audience === "kids" ? "kids" : "general";
const generalGameIds = new Set(lobby.audiences?.generalGameIds || []);
const tabletopGameIds = new Set(lobby.audiences?.tabletopGameIds || []);
const topicGameIds = new Set(lobby.audiences?.topicGameIds || []);
const isKidsLobby = audienceMode === "kids";
const allLobbyGames = [...lobby.games];
const catalogGames = allLobbyGames.filter((game) =>
  (game.status === "playable"
    || (!isKidsLobby && topicGameIds.has(game.id))
    || (!ownerPreviewMode && !isKidsLobby && game.id === "animal-dice-bastion"))
  && (isKidsLobby
    ? !generalGameIds.has(game.id) && !topicGameIds.has(game.id)
    : generalGameIds.has(game.id)));
const showAgeLabels = isKidsLobby;
const modeHeroGameIds = isKidsLobby
  ? ["color-lunchbox", "animal-zoo-idle", "bubble-bakery", "fruit-merge", "snack-blocks"]
  : ["animal-hero-trials", "animal-relic-hunters", "beast-deck", "animal-rune-tactics", "animal-orb-fortress"];
// Owner-locked General spotlight. See docs/lobby-featured-game-lock.md.
const modeFeaturedGameId = isKidsLobby ? "color-lunchbox" : "animal-crystal-survivor";
const tabletopHeroGameIds = ["mahjong-solitaire", "chess", "hearts", "klondike-solitaire", "spades"];
lobby.games = catalogGames;
lobby.heroGameIds = modeHeroGameIds;
lobby.featuredGameId = modeFeaturedGameId;
if (ownerPreviewMode) {
  document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow");
  document.documentElement.dataset.ownerPreview = "true";
}
const filterButtons = document.querySelectorAll("[data-age-filter]");
const gameHallSwitch = document.querySelector(".game-hall-switch");
if (!isKidsLobby && topicGameIds.size && gameHallSwitch && !gameHallSwitch.querySelector('[data-hall-tab="topics"]')) {
  const topicsButton = document.createElement("button");
  topicsButton.type = "button";
  topicsButton.dataset.hallTab = "topics";
  topicsButton.setAttribute("aria-pressed", "false");
  topicsButton.innerHTML = '<span class="hall-tab-icon hall-tab-icon--topics" aria-hidden="true"><img src="/assets/topics-hall-tab-v2.webp?v=20261002-topics-icon-v2" alt="" width="30" height="30" decoding="async"></span><span class="hall-tab-label" data-i18n="hall.topics_short"></span><small data-i18n="hall.topics_note" aria-hidden="true"></small>';
  gameHallSwitch.append(topicsButton);
}
const hallButtons = document.querySelectorAll("[data-hall-tab]");
if (!isKidsLobby) {
  document.querySelector("#advancedFilters")?.remove();
  document.querySelectorAll(".desktop-filter-rail h3, #vibeTitle").forEach((heading) => {
    heading.dataset.i18n = "filter.all_genres";
  });
  const searchInput = document.querySelector("#gameSearch");
  if (searchInput) searchInput.dataset.i18nPlaceholder = "search.games_or_genres";
}
{
  document.querySelectorAll(isKidsLobby ? '.topic-filter' : '.topic-filter, .vibe-options').forEach(group => {
    group.replaceChildren();
    for (const id of ["all", "Featured", ...gameGenres.definitions.map((genre) => genre.id)]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.topicFilter = id;
      button.dataset.runtimeLocalize = "off";
      button.dataset.i18n = id === "all" ? "filter.all_genres" : `category.${id}`;
      group.append(button);
    }
  });
}
const topicButtons = document.querySelectorAll("[data-topic-filter]");
const skillButtons = document.querySelectorAll("[data-skill-filter]");
const libraryButtons = document.querySelectorAll("[data-library-tab]");
const availabilityButtons = document.querySelectorAll("[data-availability-filter]");
const advancedFilters = document.querySelector("#advancedFilters");
const advancedFilterCount = document.querySelector("#advancedFilterCount");
const generalPlayTitle = document.querySelector(".general-play-heading h2");
const discoverySnapshot = document.querySelector("#discoverySnapshot");
const continuePlaying = document.querySelector("#continuePlaying");
const continuePlayingSection = document.querySelector("#continuePlayingSection");
const continuePlayingTitle = document.querySelector("#continuePlayingTitle");
const continuePlayingReason = document.querySelector("#continuePlayingReason");
const publisherStory = document.querySelector(".publisher-story");
const gameGrid = document.querySelector("#gameGrid");
// Limit rendered cards, never the searchable catalog. See the lobby runbook.
let catalogRevealedBatches = 1;
function catalogBatchSize() {
  if (isKidsLobby) return 24;
  const minimum = window.matchMedia("(min-width: 721px)").matches ? 100 : 40;
  // Computed grid tracks reflect the actual available width, not a guessed
  // device size. Never create placeholders to fill the final catalog row.
  const tracks = getComputedStyle(gameGrid).gridTemplateColumns.split(/\s+/)
    .filter((track) => /^\d+(\.\d+)?px$/.test(track) && parseFloat(track) > 0);
  const columns = Math.max(1, tracks.length);
  return Math.ceil(minimum / columns) * columns;
}
let catalogFilterSignature = "";
let catalogSearchIndex = new Map();
let catalogNeedsRebuild = true;
const catalogPagination = document.createElement("div");
catalogPagination.id = "catalogPagination";
catalogPagination.className = "catalog-pagination";
catalogPagination.dataset.runtimeLocalize = "off";
catalogPagination.innerHTML = '<p role="status" aria-live="polite" aria-atomic="true"></p><button type="button" aria-controls="gameGrid"></button>';
gameGrid.after(catalogPagination);
// Preserve crawlable, lightweight links after hydration, including games that
// have not had an image card created yet. The server HTML remains the no-JS
// catalog; never replace it with an empty JavaScript-only shell.
const catalogDirectory = document.createElement("details");
catalogDirectory.id = "catalogDirectory";
catalogDirectory.dataset.runtimeLocalize = "off";
catalogDirectory.innerHTML = "<summary></summary><nav></nav>";
catalogPagination.after(catalogDirectory);
catalogPagination.querySelector("button").addEventListener("click", () => {
  const firstNewIndex = gameGrid.children.length;
  catalogRevealedBatches += 1;
  applyFilter();
  // Keep keyboard/assistive navigation at the newly revealed games, including
  // the last batch where the More button disappears.
  gameGrid.children[firstNewIndex]?.focus({ preventScroll: true });
});
// Recalculate only on width changes; card height changes must not cause a
// render/observer loop. No polling, new media context or pagination cache.
let catalogGridWidth = 0;
const catalogResizeObserver = new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;
  if (Math.abs(width - catalogGridWidth) < 1) return;
  catalogGridWidth = width;
  if (catalogFilterSignature) applyFilter();
});
catalogResizeObserver.observe(gameGrid);
const heroGames = document.querySelector("#heroGames");
const heroGamesSection = document.querySelector("#heroGamesSection");
const latestGamesSection = document.createElement("section");
latestGamesSection.id = "latestGamesSection";
latestGamesSection.className = "hero-games-section hidden";
latestGamesSection.dataset.runtimeLocalize = "off";
latestGamesSection.innerHTML = '<div class="section-heading"><h2 id="latestGamesTitle"></h2><a class="catalog-jump" href="#catalogHeading"></a></div><div id="latestGames" class="hero-games"></div>';
if (!isKidsLobby) heroGamesSection.before(latestGamesSection);
const latestGames = latestGamesSection.querySelector("#latestGames");
// Owner-selected General spotlight; keeps existing Kids portal and catalog order.
const spotlightSection = document.createElement("section");
const spotlightCopy = { en:"Spotlight game", "zh-Hant":"主打遊戲", "zh-Hans":"主打游戏", ja:"注目のゲーム", ko:"추천 게임", es:"Juego destacado", "pt-BR":"Jogo em destaque", fr:"Jeu à la une", de:"Spiel im Fokus", it:"Gioco in primo piano", ru:"Игра в центре внимания", hi:"खास गेम", ar:"اللعبة المميزة" };
spotlightSection.id = "spotlightGameSection";
spotlightSection.dataset.runtimeLocalize = "off";
if (!isKidsLobby) document.querySelector(".lobby-hero").append(spotlightSection);
function renderSpotlight() {
  if (isKidsLobby) return;
  const game = lobby.games.find(item => item.id === lobby.featuredGameId);
  if (!game || !gameMatchesHall(game)) {
    spotlightSection.hidden = true;
    spotlightSection.replaceChildren();
    return;
  }
  spotlightSection.hidden = false;
  spotlightSection.innerHTML = `<h2>${spotlightCopy[i18n.locale()] || spotlightCopy.en}</h2><a class="spotlight-game" href="${game.href}">
    <img ${lobbyImageAttributes(primaryArt(game), {priority:true})} alt="" width="480" height="480"/>
    <div><small>${spotlightCopy[i18n.locale()] || spotlightCopy.en}</small><h3>${text(game.title)}</h3><p>${text(game.type)}</p><span>${i18n.t("game.start")} →</span></div></a>`;
  revealDecodedImage(spotlightSection.querySelector(".spotlight-game > img"));
}

let firstPublicDates = {};
const latestGamesCopy = {
  en: "Latest releases", "zh-Hant": "最新上架", "zh-Hans": "最新上架",
  ja: "新着ゲーム", ko: "새로 출시된 게임", es: "Últimos lanzamientos",
  "pt-BR": "Novos lançamentos", fr: "Nouveautés", de: "Neu erschienen",
  it: "Ultime uscite", ru: "Новые игры", hi: "नए गेम", ar: "أحدث الألعاب",
};
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
// Public announcement entry for the Block World lobby; gameplay and rewards
// remain unavailable until the event is implemented and launched.
const demonEventPreview = !isKidsLobby ? createDemonEventPreview() : null;
if (demonEventPreview) window.matchMedia("(min-width: 1120px)").addEventListener("change", syncDemonEventPreview);
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
const gameSearch = document.querySelector("#gameSearch");
const quickPickBtn = document.querySelector("#quickPickBtn");
const i18n = window.WonderI18n;
const favoritesKey = "weightplayFavoriteGames";
const recentGamesKey = "weightplayRecentGames";
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
    image: "assets/weightplay-character-spark-paw-fox-block-v1.webp",
    skill: "Reaction",
  },
  {
    nameKey: "character.boom_mane_lion.name",
    roleKey: "character.boom_mane_lion.role",
    image: "assets/weightplay-character-boom-mane-lion-block-v1.webp",
    skill: "Focus",
  },
  {
    nameKey: "character.moss_shell_turtle.name",
    roleKey: "character.moss_shell_turtle.role",
    image: "assets/weightplay-character-moss-shell-turtle-block-v1.webp",
    skill: "Logic",
  },
  {
    nameKey: "character.moon_cap_owl.name",
    roleKey: "character.moon_cap_owl.role",
    image: "assets/weightplay-character-moon-cap-owl-block-v1.webp",
    skill: "Problem Solving",
  },
  {
    nameKey: "character.bubble_fin_otter.name",
    roleKey: "character.bubble_fin_otter.role",
    image: "assets/weightplay-character-bubble-fin-otter-block-v1.webp",
    skill: "Animal Knowledge",
  },
  {
    nameKey: "character.gear_horn_rhino.name",
    roleKey: "character.gear_horn_rhino.role",
    image: "assets/weightplay-character-gear-horn-rhino-block-v1.webp",
    skill: "Problem Solving",
  },
  {
    nameKey: "character.drum_belly_panda.name",
    roleKey: "character.drum_belly_panda.role",
    image: "assets/weightplay-character-drum-belly-panda-block-v1.webp",
    skill: "Focus",
  },
  {
    nameKey: "character.rainbow_hop_rabbit.name",
    roleKey: "character.rainbow_hop_rabbit.role",
    image: "assets/weightplay-character-rainbow-hop-rabbit-block-v1.webp",
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
  cribbage: { difficulty: "Medium", time: "5-8 minutes" },
  "peg-solitaire": { difficulty: "Medium", time: "5-8 minutes" },
};
let activeHall = "games";
let activeFilter = "all";
let activeTopic = "all";
let activeSkill = "all";
let activeLibrary = "all";
let activeAvailability = "all";
let activeSearch = "";
let hallSearchDisplay;
let toastTimer = null;
let toastDeadline = 0;
let toastRevision = 0;
let toastMotionClassTimer = null;
let toastMotionGeneration = 0;
let favoriteGameIds = readFavorites();
let recentGameIds = readRecentGames();
let gameStats = {
  source: "pending",
  updatedAt: null,
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

function gameHall(game) {
  if (topicGameIds.has(game?.id)) return "topics";
  return tabletopGameIds.has(game?.id) ? "tabletop" : "games";
}

function gameMatchesHall(game, hall = activeHall) {
  return isKidsLobby || gameHall(game) === hall;
}

function createDemonEventPreview() {
  const copy = {
    en: { title: "Demon Assault", line: "A block-built alarm is stirring beyond the portal.", blocks: "Collected blocks", note: "Your collected-block total will set the ammo cap. Blocks and castle materials are never spent.", open: "Activity details", modal: "Activity concept", reward: "Diamond rewards are not open yet. Nothing is available to claim.", close: "Close" },
    "zh-Hant": { title: "惡魔來襲", line: "方塊警戒燈亮起，傳送門另一側傳來動靜。", blocks: "累計收集方塊", note: "已收集方塊總數只決定彈藥上限；方塊與城堡材料都不會被扣除。", open: "活動說明", modal: "活動概念說明", reward: "鑽石獎勵尚未開放，目前沒有可領取的獎勵。", close: "關閉" },
    "zh-Hans": { title: "恶魔来袭", line: "方块警戒灯亮起，传送门另一侧传来动静。", blocks: "累计收集方块", note: "已收集方块总数只决定弹药上限；方块与城堡材料都不会被扣除。", open: "活动说明", modal: "活动概念说明", reward: "钻石奖励尚未开放，目前没有可领取的奖励。", close: "关闭" },
    ja: { title: "デーモン襲来", line: "ブロック警報が光り、ポータルの向こうで何かが動き出す。", blocks: "累計ブロック収集数", note: "収集済みブロック数が弾薬上限を決めます。ブロックも城の素材も消費しません。", open: "イベントの説明", modal: "イベント案", reward: "ダイヤ報酬はまだ受け取れません。", close: "閉じる" },
    ko: { title: "악마 습격", line: "블록 경보등이 켜지고 포털 너머에서 움직임이 감지됩니다.", blocks: "누적 수집 블록", note: "수집한 블록 수가 탄약 한도를 정합니다. 블록과 성 재료는 차감되지 않습니다.", open: "이벤트 안내", modal: "이벤트 구상", reward: "다이아 보상은 아직 받을 수 없습니다.", close: "닫기" },
    es: { title: "Asalto demoníaco", line: "La alarma de bloques se enciende; algo se mueve tras el portal.", blocks: "Bloques acumulados", note: "El total de bloques recogidos solo definirá el límite de munición. No se gastarán bloques ni materiales del castillo.", open: "Detalles del evento", modal: "Concepto del evento", reward: "Las recompensas de diamantes aún no están disponibles.", close: "Cerrar" },
    "pt-BR": { title: "Invasão demoníaca", line: "O alerta de blocos acende; algo se move além do portal.", blocks: "Blocos coletados", note: "O total de blocos coletados definirá apenas o limite de munição. Nenhum bloco ou material do castelo será gasto.", open: "Detalhes do evento", modal: "Conceito do evento", reward: "As recompensas em diamantes ainda não estão disponíveis.", close: "Fechar" },
    fr: { title: "Assaut démoniaque", line: "L’alerte en blocs s’allume ; quelque chose bouge derrière le portail.", blocks: "Blocs cumulés", note: "Le total de blocs collectés définira uniquement la limite de munitions. Aucun bloc ni matériau du château ne sera dépensé.", open: "Détails de l’événement", modal: "Concept de l’événement", reward: "Les récompenses en diamants sont encore à l’étude. Rien ne peut être réclamé.", close: "Fermer" },
    de: { title: "Dämonenangriff", line: "Der Blockalarm leuchtet auf. Hinter dem Portal regt sich etwas.", blocks: "Gesammelte Blöcke", note: "Die gesammelte Blockzahl bestimmt nur die Munitionsgrenze. Blöcke und Burgmaterial werden nicht verbraucht.", open: "Eventdetails", modal: "Eventkonzept", reward: "Diamantbelohnungen sind noch nicht verfügbar.", close: "Schließen" },
    it: { title: "Assalto dei demoni", line: "L’allarme a blocchi si accende: qualcosa si muove oltre il portale.", blocks: "Blocchi raccolti", note: "Il totale dei blocchi raccolti definirà solo il limite di munizioni. Non verranno consumati blocchi né materiali del castello.", open: "Dettagli evento", modal: "Idea dell’evento", reward: "Le ricompense in diamanti non sono ancora disponibili.", close: "Chiudi" },
    ru: { title: "Нашествие демонов", line: "Блочная тревога вспыхнула — за порталом что-то движется.", blocks: "Всего собрано блоков", note: "Общее число собранных блоков будет влиять только на лимит боеприпасов. Блоки и материалы замка не расходуются.", open: "Об игре-событии", modal: "Концепция события", reward: "Алмазные награды пока недоступны.", close: "Закрыть" },
    hi: { title: "दानवों का हमला", line: "ब्लॉक चेतावनी चमकती है; पोर्टल के पार कुछ हलचल है।", blocks: "कुल एकत्रित ब्लॉक", note: "एकत्रित ब्लॉकों की कुल संख्या केवल बारूद सीमा तय करेगी। ब्लॉक या किले की सामग्री खर्च नहीं होगी।", open: "इवेंट विवरण", modal: "इवेंट की योजना", reward: "हीरे के पुरस्कार अभी उपलब्ध नहीं हैं।", close: "बंद करें" },
    ar: { title: "هجوم الشياطين", line: "يضيء إنذار المكعبات، وتتحرك ظلال خلف البوابة.", blocks: "إجمالي المكعبات المجموعة", note: "سيحدد إجمالي المكعبات المجموعة سقف الذخيرة فقط. لن تُستهلك المكعبات أو مواد القلعة.", open: "تفاصيل الفعالية", modal: "تصور الفعالية", reward: "مكافآت الألماس غير متاحة بعد.", close: "إغلاق" },
  };
  const locale = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || "en";
  const localized = copy[locale] || copy.en;
  const strings = {
    ...localized,
    modal: ({ "zh-Hant": "活動說明", "zh-Hans": "活动说明" })[locale] || localized.open,
    previous: ({ en: "Previous activity", "zh-Hant": "上一個活動", "zh-Hans": "上一个活动", ja: "前のイベント", ko: "이전 이벤트", es: "Evento anterior", "pt-BR": "Evento anterior", fr: "Événement précédent", de: "Vorheriges Event", it: "Evento precedente", ru: "Предыдущее событие", hi: "पिछला इवेंट", ar: "الفعالية السابقة" })[locale] || "Previous activity",
    next: ({ en: "Next activity", "zh-Hant": "下一個活動", "zh-Hans": "下一个活动", ja: "次のイベント", ko: "다음 이벤트", es: "Evento siguiente", "pt-BR": "Próximo evento", fr: "Événement suivant", de: "Nächstes Event", it: "Evento successivo", ru: "Следующее событие", hi: "अगला इवेंट", ar: "الفعالية التالية" })[locale] || "Next activity",
    unavailable: ({ en: "Not open yet", "zh-Hant": "尚未開放", "zh-Hans": "尚未开放", ja: "未開催", ko: "아직 열리지 않았어요", es: "Aún no disponible", "pt-BR": "Ainda não disponível", fr: "Pas encore ouvert", de: "Noch nicht geöffnet", it: "Non ancora disponibile", ru: "Пока недоступно", hi: "अभी उपलब्ध नहीं", ar: "غير متاحة بعد" })[locale] || "Not open yet",
    reward: ({ en: "Diamond rewards are not open yet. Nothing is available to claim.", "zh-Hant": "鑽石獎勵尚未開放，目前沒有可領取的獎勵。", "zh-Hans": "钻石奖励尚未开放，目前没有可领取的奖励。", ja: "ダイヤ報酬はまだ受け取れません。", ko: "다이아 보상은 아직 받을 수 없습니다.", es: "Las recompensas de diamantes aún no están disponibles.", "pt-BR": "As recompensas em diamantes ainda não estão disponíveis.", fr: "Les récompenses en diamants ne sont pas encore disponibles.", de: "Diamantbelohnungen sind noch nicht verfügbar.", it: "Le ricompense in diamanti non sono ancora disponibili.", ru: "Алмазные награды пока недоступны.", hi: "हीरे के पुरस्कार अभी उपलब्ध नहीं हैं。", ar: "مكافآت الألماس غير متاحة بعد." })[locale] || "Diamond rewards are not open yet.",
    note: ({ "zh-Hant": "累計已收集方塊數只會決定彈藥上限；方塊與城堡材料都不會被扣除。", "zh-Hans": "累计已收集方块数只会决定弹药上限；方块与城堡材料都不会被扣除。" })[locale] || localized.note,
  };
  const daily = {
    en: ["Play now", "One run daily · local midnight", "This version awards no diamonds."],
    "zh-Hant": ["立即挑戰", "每日一次 · 當地午夜重置", "此版本不發放鑽石。"],
    "zh-Hans": ["立即挑战", "每日一次 · 当地午夜重置", "此版本不发放钻石。"],
    ja: ["今すぐ挑戦", "1日1回 · 現地の午前0時に更新", "このバージョンではダイヤ報酬はありません。"],
    ko: ["지금 도전", "하루 한 판 · 현지 자정 초기화", "이 버전은 다이아를 지급하지 않습니다."],
    es: ["Jugar ahora", "Una partida diaria · medianoche local", "Esta versión no entrega diamantes."],
    "pt-BR": ["Jogar agora", "Uma partida diária · meia-noite local", "Esta versão não concede diamantes."],
    fr: ["Jouer", "Une partie par jour · minuit local", "Cette version ne donne aucun diamant."],
    de: ["Jetzt spielen", "Ein Lauf täglich · lokale Mitternacht", "Diese Version vergibt keine Diamanten."],
    it: ["Gioca ora", "Una partita al giorno · mezzanotte locale", "Questa versione non assegna diamanti."],
    ru: ["Играть", "Один бой в день · местная полночь", "Эта версия не выдаёт алмазы."],
    hi: ["अभी खेलें", "रोज़ एक खेल · स्थानीय आधी रात", "इस संस्करण में हीरे नहीं मिलते।"],
    ar: ["العب الآن", "جولة يومياً · منتصف الليل المحلي", "هذا الإصدار لا يمنح الألماس."]
  }[locale] || ["Play now", "One run daily · local midnight", "This version awards no diamonds."];
  const rewardDescriptions={
    en:"Clear the three stages for 3, 5 and 8 diamonds, up to 16 daily. Rewards go straight to your shared wallet.",
    "zh-Hant":"擊敗三階段可依序獲得 3、5、8 顆鑽石，每日最多 16 顆。獎勵自動存入共用錢包。",
    "zh-Hans":"击败三阶段可依次获得 3、5、8 颗钻石，每日最多 16 颗。奖励自动存入共用钱包。",
    ja:"3段階のクリアで順にダイヤ3・5・8個、1日最大16個。共通ウォレットへ自動で入ります。",
    ko:"세 단계를 완료하면 다이아 3, 5, 8개를 차례로 얻습니다. 하루 최대 16개가 공용 지갑에 자동 지급됩니다.",
    es:"Supera las tres fases para ganar 3, 5 y 8 diamantes: hasta 16 al día, abonados automáticamente al monedero común.",
    "pt-BR":"Vença as três fases para ganhar 3, 5 e 8 diamantes: até 16 por dia, creditados automaticamente na carteira compartilhada.",
    fr:"Terminez les trois étapes pour recevoir 3, 5 et 8 diamants, soit 16 par jour au maximum, versés au portefeuille commun.",
    de:"Schließe die drei Phasen für 3, 5 und 8 Diamanten ab: täglich bis zu 16, automatisch im gemeinsamen Guthaben.",
    it:"Supera le tre fasi per ottenere 3, 5 e 8 diamanti: fino a 16 al giorno, accreditati automaticamente nel portafoglio comune.",
    ru:"Пройдите три этапа и получите 3, 5 и 8 алмазов: до 16 в день, автоматически в общий кошелёк.",
    hi:"तीनों चरण पूरे करने पर क्रमशः 3, 5 और 8 हीरे पाएँ। रोज़ अधिकतम 16 हीरे साझा वॉलेट में अपने आप जुड़ते हैं।",
    ar:"أكمل المراحل الثلاث لتحصل على 3 و5 و8 ألماسات، بحد أقصى 16 يومياً، تُضاف تلقائياً إلى محفظتك المشتركة."
  };
  strings.reward = rewardDescriptions[locale] || rewardDescriptions.en;
  strings.note = ({"zh-Hant": "1 個已收集方塊＝1 點本場彈藥。每次只射一顆：倍率 m 會扣 m 點彈藥，直接命中惡魔扣 m HP；未命中或撞上護盾也消耗 m。永久收藏與城堡材料不扣除。", "zh-Hans": "1 个已收集方块＝1 点本场弹药。每次只射一颗：倍率 m 会扣 m 点弹药，直接命中恶魔扣 m HP；未命中或撞上护盾也消耗 m。永久收藏和城堡材料不扣除。", "en": "Each collected block gives 1 run ammo. A multiplier m fires one projectile, spends m ammo and deals m HP on a direct Boss hit. Misses and dark shields also cost m. Permanent blocks and castle materials are never spent.", "ja": "収集ブロック1個＝今回の弾薬1。倍率mは1発で弾薬mを使い、ボス直撃でm HPのダメージ。外れや暗黒シールドへの命中もmを消費します。永久ブロックと城素材は減りません。", "ko": "수집 블록 1개는 이번 판 탄약 1입니다. 배율 m은 한 발에 탄약 m을 쓰고 보스 직접 명중 시 HP m을 깎습니다. 빗나가거나 암흑 방패에 맞아도 m을 씁니다. 영구 블록과 성 재료는 차감되지 않습니다.", "es": "Cada bloque recogido da 1 de munición. El multiplicador m dispara un proyectil, gasta m y resta m HP al jefe en impacto directo. Los fallos y escudos oscuros también cuestan m. No se gastan bloques permanentes ni materiales.", "pt-BR": "Cada bloco coletado dá 1 munição. O multiplicador m lança um projétil, gasta m e causa m HP no chefe em acerto direto. Erros e escudos sombrios também custam m. Blocos permanentes e materiais não são gastos.", "fr": "Chaque bloc collecté donne 1 munition. Le multiplicateur m tire un projectile, dépense m et inflige m HP au boss en coup direct. Les ratés et boucliers sombres coûtent aussi m. Les blocs permanents et matériaux restent intacts.", "de": "Jeder gesammelte Block gibt 1 Munition. Multiplikator m feuert ein Projektil, verbraucht m und verursacht beim direkten Bosstreffer m HP Schaden. Fehlschüsse und dunkle Schilde kosten ebenfalls m. Dauerhafte Blöcke und Burgmaterial bleiben erhalten.", "it": "Ogni blocco raccolto dà 1 munizione. Il moltiplicatore m lancia un proiettile, spende m e infligge m HP al boss con un colpo diretto. Mancati colpi e scudi oscuri costano m. Blocchi permanenti e materiali restano intatti.", "ru": "Каждый собранный блок даёт 1 боеприпас. Множитель m выпускает один снаряд, расходует m и снимает m HP при прямом попадании в босса. Промахи и тёмные щиты также стоят m. Постоянные блоки и материалы не расходуются.", "hi": "हर एकत्रित ब्लॉक से 1 बारूद मिलता है। गुणक m एक प्रक्षेप्य छोड़ता है, m बारूद खर्च करता है और सीधे बॉस पर m HP घटाता है। चूक और अंधेरे ढाल भी m खर्च करते हैं। स्थायी ब्लॉक और किले की सामग्री नहीं घटती।", "ar": "كل مكعب مجموع يمنح ذخيرة واحدة. المضاعف m يطلق مقذوفاً واحداً ويستهلك m ويخصم m من صحة الزعيم عند إصابته مباشرة. الإخفاق والدروع المظلمة يستهلكان m أيضاً. المكعبات الدائمة ومواد القلعة لا تُستهلك."})[locale] || "Each collected block gives 1 run ammo. A multiplier m fires one projectile, spends m ammo and deals m HP on a direct Boss hit. Misses and dark shields also cost m. Permanent blocks and castle materials are never spent.";
  const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const hoverPreference = window.matchMedia?.("(hover: hover) and (pointer: fine)");
  const section = document.createElement("section");
  section.className = "demon-event-preview";
  section.hidden = true;
  section.dataset.runtimeLocalize = "off";
  section.setAttribute("aria-label", strings.title);
  const events = [{
    id: "demon-assault", title: strings.title,
    image: "/assets/demon-assault-preview-keyart-v1.webp?v=20261013-demon-assault-art-v1",
    details: { line: strings.line, body: strings.note, blocks: strings.blocks, schedule: daily[1], reward: strings.reward },
    entry: { kind: "activity", path: "/activities/demon-assault/", label: daily[0] },
    renderer: "demon-assault",
  }];
  // Local-only fixtures let the carousel behavior be exercised without publishing placeholder events.
  const fixtureCount = location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? Math.max(0, Math.min(3, Number(new URLSearchParams(location.search).get("wpActivityFixture")) || 0)) : 0;
  if (fixtureCount > 1) {
    while (events.length < fixtureCount) {
      const number = events.length + 1;
      events.push({
        id: `local-fixture-${number}`, title: `Local event fixture ${number}`,
        image: events[0].image,
        details: {
          line: `Fixture ${number}: isolated local event detail.`,
          body: `This test event has its own detail and safe local route. It never opens the Demon Assault activity.`,
          blocks: "Local fixture", schedule: `Local schedule ${number}`, reward: `Local reward placeholder ${number}`,
        },
        entry: { kind: "local-fixture", label: `Open local fixture ${number}` },
        renderer: null,
      });
    }
  }
  const trackElement = document.createElement("div");
  trackElement.className = "demon-event-track";
  trackElement.setAttribute("role", "group");
  trackElement.setAttribute("aria-label", strings.title);
  for (const [index, event] of events.entries()) {
    const card = document.createElement("button");
    card.className = "demon-event-card";
    card.type = "button";
    card.dataset.eventIndex = String(index);
    card.setAttribute("aria-label", event.title);
    const art = document.createElement("span");
    art.className = "demon-event-art";
    art.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = event.image;
    image.alt = "";
    image.width = 768;
    image.height = 768;
    image.loading = "lazy";
    image.decoding = "async";
    const title = document.createElement("span");
    title.className = "demon-event-title";
    title.textContent = event.title;
    const copy = document.createElement("span");
    copy.className = "demon-event-card-copy";
    const label = document.createElement("span");
    label.className = "demon-event-label";
    label.textContent = ({en:"Daily event","zh-Hant":"每日活動","zh-Hans":"每日活动",ja:"デイリーイベント",ko:"일일 이벤트",es:"Evento diario","pt-BR":"Evento diário",fr:"Événement quotidien",de:"Tägliches Event",it:"Evento giornaliero",ru:"Ежедневное событие",hi:"दैनिक इवेंट",ar:"فعالية يومية"})[locale] || "Daily event";
    const schedule = document.createElement("span");
    schedule.className = "demon-event-card-schedule";
    schedule.textContent = event.details.schedule;
    const arrow = document.createElement("span");
    arrow.className = "demon-event-chevron";
    arrow.textContent = "›";
    arrow.setAttribute("aria-hidden", "true");
    copy.append(label, title, schedule);
    art.append(image);
    card.append(art, copy, arrow);
    trackElement.append(card);
  }
  const controls = document.createElement("div");
  controls.className = "demon-event-carousel-controls";
  controls.hidden = events.length < 2;
  controls.innerHTML = `<button type="button" class="demon-event-step" data-step="-1" aria-label="${strings.previous}">‹</button><span class="demon-event-position" aria-live="polite">1 / ${events.length}</span><button type="button" class="demon-event-step" data-step="1" aria-label="${strings.next}">›</button>`;
  section.append(trackElement, controls);
  const dialog = document.createElement("dialog");
  dialog.className = "demon-event-dialog";
  dialog.setAttribute("aria-labelledby", "demonEventDialogTitle");
  dialog.innerHTML = `<form method="dialog"><button class="demon-event-close" type="submit" aria-label="${strings.close}">×</button></form><header class="demon-event-dialog-heading"><p class="demon-event-dialog-eyebrow">${strings.open}</p><h2 id="demonEventDialogTitle"></h2></header><div class="demon-event-dialog-body"><p data-event-line></p><p data-event-body></p><p class="demon-event-count"><span data-event-blocks></span><strong data-owned-blocks>—</strong></p><p class="demon-event-dialog-schedule"></p><p class="demon-event-dialog-reward"></p></div><div class="demon-event-dialog-actions"></div>`;
  document.body.append(dialog);
  const openButtons = [...section.querySelectorAll(".demon-event-card")];
  const dialogActions = dialog.querySelector(".demon-event-dialog-actions");
  let launchButton = null;
  if (!isKidsLobby) {
    launchButton = document.createElement("button");
    launchButton.type = "button";
    launchButton.className = "demon-event-dialog-done demon-event-dialog-play";
    launchButton.addEventListener("click", () => {
      const selected = events[activeIndex];
      if (selected.entry.kind === "local-fixture" && fixtureCount > 0) {
        const destination = new URL(window.location.href);
        destination.searchParams.set("wpActivityFixture", String(fixtureCount));
        destination.searchParams.set("fixtureLaunch", selected.id);
        window.location.assign(destination.href);
        return;
      }
      window.location.href = `${selected.entry.path}?locale=${encodeURIComponent(locale)}`;
    });
    dialogActions.append(launchButton);
  }
  let returnFocus = null;
  function restoreFocus() {
    const target = returnFocus;
    returnFocus = null;
    if (target?.isConnected && !target.hidden) target.focus({ preventScroll: true });
  }
  const track = section.querySelector(".demon-event-track");
  const position = section.querySelector(".demon-event-position");
  let activeIndex = 0;
  let carouselTimer = 0;
  let dragStart = null;
  let suppressCardClick = false;
  let lastPointerType = null;
  const isKeyboardFocused = () => Boolean(section.querySelector(":focus-visible"));
  const isHoverPaused = () => Boolean(lastPointerType !== "touch" && hoverPreference?.matches && section.matches(":hover"));
  const isPaused = () => Boolean(dragStart || isKeyboardFocused() || isHoverPaused());
  const updateDialog = () => {
    const selected = events[activeIndex];
    dialog.querySelector("#demonEventDialogTitle").textContent = selected.title;
    dialog.querySelector("[data-event-line]").textContent = selected.details.line;
    dialog.querySelector("[data-event-body]").textContent = selected.details.body;
    dialog.querySelector("[data-event-blocks]").textContent = selected.details.blocks;
    dialog.querySelector(".demon-event-dialog-schedule").textContent = selected.details.schedule;
    dialog.querySelector(".demon-event-dialog-reward").textContent = selected.details.reward;
    if (launchButton) launchButton.textContent = selected.entry.label;
    dialog.querySelector(".demon-event-count").hidden = selected.id !== "demon-assault";
  };
  const goTo = index => {
    const previousArt = openButtons[activeIndex]?.querySelector(".demon-event-art");
    activeIndex = (index + events.length) % events.length;
    const card = openButtons[activeIndex];
    const nextArt = card?.querySelector(".demon-event-art");
    card.scrollIntoView({ behavior: motionPreference?.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    if (position) position.textContent = `${activeIndex + 1} / ${events.length}`;
    if (previousArt !== nextArt) {
      if (previousArt) visibilityObserver?.unobserve(previousArt);
      inViewport = !visibilityObserver;
      if (nextArt) visibilityObserver?.observe(nextArt);
      updateMotion();
    }
  };
  const stopCarousel = () => { window.clearTimeout(carouselTimer); carouselTimer = 0; };
  const scheduleCarousel = () => {
    stopCarousel();
    if (events.length < 2 || isPaused() || section.hidden || document.hidden || dialog.open || motionPreference?.matches) return;
    carouselTimer = window.setTimeout(() => { goTo(activeIndex + 1); scheduleCarousel(); }, 5000);
  };
  for (const button of openButtons) button.addEventListener("click", event => {
    if (suppressCardClick) { event.preventDefault(); event.stopPropagation(); suppressCardClick = false; return; }
    goTo(Number(button.dataset.eventIndex));
    updateDialog();
    returnFocus = button;
    stopCarousel();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      dialog.querySelector(".demon-event-close")?.focus({ preventScroll: true });
    }
  });
  section.querySelectorAll(".demon-event-step").forEach(button => button.addEventListener("click", () => { goTo(activeIndex + Number(button.dataset.step)); scheduleCarousel(); }));
  track.addEventListener("pointerdown", event => {
    lastPointerType = event.pointerType || "mouse";
    dragStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    stopCarousel();
  }, { passive: true });
  const endPointer = event => {
    if (!dragStart || (Number.isFinite(event.pointerId) && dragStart.id !== event.pointerId)) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    dragStart = null;
    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressCardClick = true;
      goTo(activeIndex + (dx < 0 ? 1 : -1));
      window.setTimeout(() => { suppressCardClick = false; }, 350);
    }
    scheduleCarousel();
  };
  window.addEventListener("pointerup", endPointer, { passive: true });
  window.addEventListener("pointercancel", () => { dragStart = null; scheduleCarousel(); }, { passive: true });
  window.addEventListener("blur", () => { dragStart = null; scheduleCarousel(); });
  const onPointerMove = event => {
    if (event.pointerType !== "mouse") return;
    lastPointerType = "mouse";
    if (isHoverPaused()) stopCarousel();
    else scheduleCarousel();
  };
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  section.addEventListener("weightplay:activity-visibility", event => {
    if (event.detail?.visible) scheduleCarousel();
    else { stopCarousel(); dragStart = null; }
  });
  section.addEventListener("focusin", () => { if (isKeyboardFocused()) stopCarousel(); else scheduleCarousel(); });
  section.addEventListener("focusout", () => requestAnimationFrame(scheduleCarousel));
  section.addEventListener("mouseenter", () => { if (hoverPreference?.matches) stopCarousel(); });
  section.addEventListener("mouseleave", () => { if (hoverPreference?.matches) scheduleCarousel(); });
  dialog.addEventListener("close", scheduleCarousel);
  document.addEventListener("visibilitychange", scheduleCarousel);
  motionPreference?.addEventListener?.("change", scheduleCarousel);
  scheduleCarousel();
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.hidden && element.getClientRects().length);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  });
  
  dialog.addEventListener("close", restoreFocus);
  dialog.addEventListener("cancel", () => requestAnimationFrame(restoreFocus));
  const countNode = dialog.querySelector("[data-owned-blocks]");
  const updateCount = () => {
    try {
      const count = window.WeightPlayCastle?.ownedBlocks?.();
      countNode.textContent = Number.isFinite(Number(count)) && Number(count) >= 0 ? Math.floor(Number(count)).toLocaleString(locale) : "—";
    } catch { countNode.textContent = "—"; }
  };
  window.addEventListener("weightplay:castle-ready", updateCount);
  window.addEventListener("weightplay:castle-updated", updateCount);
  updateCount();
  let inViewport = false;
  let artSession = null;
  let artLoading = false;
  let artGeneration = 0;
  let artAbort = null;
  let artFailed = false;
  let artDisposed = false;
  const releaseArt = () => {
    artGeneration += 1;
    artAbort?.abort();
    artAbort = null;
    artSession?.destroy();
    artSession = null;
  };
  const updateMotion = () => {
    const play = !artDisposed && !section.hidden && inViewport && !document.hidden && !motionPreference?.matches
      && events[activeIndex]?.renderer === "demon-assault";
    section.dataset.motion = play ? "on" : "off";
    if (!play) { releaseArt(); return; }
    if (artLoading || artSession || artFailed) return;
    artLoading = true;
    const generation = ++artGeneration;
    const controller = new AbortController();
    artAbort = controller;
    const isCurrent = () => generation === artGeneration && !artDisposed && section.dataset.motion === "on" && !section.hidden && !document.hidden;
    import("/src/demon-event-pixi.mjs")
    .then(module => {
      const selected = events[activeIndex];
      const art = openButtons[activeIndex]?.querySelector(".demon-event-art");
      return isCurrent() && selected.renderer === "demon-assault" && art
        ? module.mountDemonEventArt(art, { isCurrent, signal: controller.signal }) : null;
    })
      .then(session => { if (isCurrent()) artSession = session; else session?.destroy(); })
      .catch(() => { if (isCurrent()) artFailed = true; })
      .finally(() => { artLoading = false; if (!artFailed && !artDisposed && section.dataset.motion === "on" && !artSession) updateMotion(); });
  };
  let visibilityObserver;
  if ("IntersectionObserver" in window) {
    visibilityObserver = new IntersectionObserver(entries => { inViewport = Boolean(entries[0]?.isIntersecting); updateMotion(); }, { threshold: 0.12 });
    visibilityObserver.observe(openButtons[activeIndex]?.querySelector(".demon-event-art"));
  } else inViewport = true;
  const hiddenObserver = new MutationObserver(() => { updateMotion(); scheduleCarousel(); });
  hiddenObserver.observe(section, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("visibilitychange", updateMotion);
  motionPreference?.addEventListener?.("change", updateMotion);
  const onPageHide = event => {
    releaseArt();
    stopCarousel();
    if (event.persisted) return;
    artDisposed = true;
    visibilityObserver?.disconnect();
    hiddenObserver.disconnect();
    document.removeEventListener("visibilitychange", updateMotion);
    document.removeEventListener("visibilitychange", scheduleCarousel);
    document.removeEventListener("pointermove", onPointerMove);
    motionPreference?.removeEventListener?.("change", updateMotion);
    motionPreference?.removeEventListener?.("change", scheduleCarousel);
    stopCarousel();
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener("pagehide", onPageHide);
  };
  const onPageShow = () => { updateMotion(); scheduleCarousel(); };
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
  return section;
}

function syncDemonEventPreview() {
  if (!demonEventPreview) return;
  const show = !isKidsLobby && activeHall === "games" && activeTopic === "all"
    && activeFilter === "all" && activeSkill === "all" && activeLibrary === "all"
    && activeAvailability === "all" && activeSearch === "";
  const wasHidden = demonEventPreview.hidden;
  demonEventPreview.hidden = !show;
  if (wasHidden !== demonEventPreview.hidden) {
    demonEventPreview.dispatchEvent(new CustomEvent("weightplay:activity-visibility", { detail: { visible: show } }));
  }
  const hero = document.querySelector(".lobby-hero");
  if (hero && demonEventPreview.previousElementSibling !== hero) hero.after(demonEventPreview);
}

function topicMatches(game, topic) {
  return topic === "all" || (topic === "Featured"
    ? game.catalogTags.includes("Featured") : gameGenres.matches(game, topic));
}

function filterTopicsFor(game) {
  return [...game.categories, ...(game.catalogTags.includes("Featured") ? ["Featured"] : [])];
}

function syncGenreFilters() {
  const eligible = [...catalogGames, ...upcomingPreviewGames()]
    .filter((game) => gameMatchesHall(game));
  topicButtons.forEach((button) => {
    const id = button.dataset.topicFilter;
    button.hidden = id !== "all" && !eligible.some((game) => topicMatches(game, id));
  });
}

function gamesInHall(hall = activeHall) {
  return isKidsLobby ? [...lobby.games] : lobby.games.filter((game) => gameMatchesHall(game, hall));
}

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
  return game.art?.background || "assets/hero.png";
}

function hallHeroImageSource(hall) {
  return hall === "topics"
    ? "/assets/topic-hall-hero-v2.webp?v=20261002-topics-art-v2"
    : "/assets/weightplay-general-lobby-block-animals-hero-v1.webp?v=20261002-world-hero-path-v2";
}

function lobbyThumbnail(source, width = 480) {
  const clean = String(source || "").split(/[?#]/, 1)[0].replace(/^\/+/, "");
  // The poster registry resolves existing derivatives, or the intact source
  // when a historical thumbnail is absent. Never request a guessed missing file.
  const posterDelivery = window.WEIGHTPLAY_INTERFACE7_POSTER_DELIVERIES?.[`/${clean}`];
  if (width === 480 && posterDelivery) return posterDelivery;
  if (!/^(?:assets|games)\/.+\.(?:avif|jpe?g|png|webp)$/i.test(clean)) return source;
  const encoded = clean.replace(/[^A-Za-z0-9._-]+/g, "__").replace(/\.[^.]+$/, ".webp");
  return `assets/lobby-thumbs/w${width}/${encoded}`;
}

function lobbyImageAttributes(source, { priority = false, width = 480 } = {}) {
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? ' fetchpriority="high"' : "";
  return `src="${lobbyThumbnail(source, width)}" loading="${loading}" decoding="async"${fetchPriority}`;
}

function setLobbyImage(image, source, { priority = false, width = 480 } = {}) {
  if (!image) return;
  image.src = lobbyThumbnail(source, width);
  image.loading = priority ? "eager" : "lazy";
  image.decoding = "async";
  image.fetchPriority = priority ? "high" : "auto";
}

function revealDecodedImage(image) {
  if (!image) return;
  const reveal = () => {
    if (image.naturalWidth > 0) image.classList.add("is-decoded");
  };
  if (image.complete) reveal();
  else image.addEventListener("load", reveal, { once: true });
}

function decodeLobbyImage(source) {
  if (!source) return Promise.resolve(true);
  const image = new Image();
  image.decoding = "async";
  image.loading = "eager";
  image.fetchPriority = 'high';
  return new Promise(resolve => {
    let settled = false;
    const finish = ready => {
      if (settled) return;
      settled = true;
      resolve(Boolean(ready && image.naturalWidth > 0));
    };
    const decode = () => {
      if (!image.naturalWidth) { finish(false); return; }
      if (typeof image.decode === "function") image.decode().then(() => finish(true), () => finish(image.naturalWidth > 0));
      else finish(true);
    };
    image.addEventListener("load", decode, { once: true });
    image.addEventListener("error", () => finish(false), { once: true });
    image.src = source;
    // A newly assigned image can report `complete === true` before its first
    // request starts, with naturalWidth still zero. Treat only a decoded cache
    // hit as complete; the load/error listeners own every in-flight request.
    if (image.complete && image.naturalWidth > 0) decode();
  });
}

function categoryText(category) {
  const key = `category.${category}`;
  const localized = i18n.t(key);
  return localized === key ? skillText(category) : localized;
}

function skillText(skill) {
  return i18n.t(`skill.${skill}`);
}

function discoverySkillText(skill) {
  const localized = skillText(skill);
  return localized === `skill.${skill}` ? skill : localized;
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

function syncHallPresentation() {
  if (isKidsLobby) return;
  // One state owns the background and world controls, including URL restores.
  // Notify only a real change; catalog/locale refreshes need no extra scene work.
  if (document.body.dataset.gameHall !== activeHall) {
    document.body.dataset.gameHall = activeHall;
    window.dispatchEvent(new Event("weightplay:hall-change"));
  }
  gameHallSwitch?.setAttribute("aria-label", i18n.t("hall.label"));
  setActiveButtons(hallButtons, "hallTab", activeHall);
  document.querySelectorAll("[data-hall-only]").forEach((element) => {
    element.hidden = element.dataset.hallOnly !== activeHall;
  });
  syncGenreFilters();
  const catalogHallLabel = document.querySelector("#catalogHallLabel");
  const hallNameKey = `hall.${activeHall}`;
  const hallTitleKey = `hall.${activeHall}_title`;
  const hallNoteKey = `hall.${activeHall}_note`;
  if (catalogHallLabel) catalogHallLabel.textContent = i18n.t(activeHall === "games" ? "hall.games" : hallNameKey);
  if (generalPlayTitle) {
    generalPlayTitle.textContent = i18n.t(activeHall === "games" ? "general.play.title" : hallTitleKey);
  }
  const hallHeroTitle = document.querySelector('.lobby-hero-copy h2');
  if (hallHeroTitle) {
    hallHeroTitle.setAttribute('data-runtime-localize', 'off');
    hallHeroTitle.textContent = i18n.t(activeHall === 'games' ? 'discovery.hero_title' : hallTitleKey);
  }
  const hallEyebrow = document.querySelector('.hero-eyebrow');
  if (hallEyebrow) hallEyebrow.textContent = i18n.t(activeHall === 'games' ? 'hall.games' : hallNameKey);
  const hallScene = document.querySelector('.general-hero-scene');
  if (hallScene) {
    const source = hallHeroImageSource(activeHall);
    if (hallScene.getAttribute('src') !== source) {
      hallScene.classList.remove('is-decoded');
      hallScene.src = source;
    }
    revealDecodedImage(hallScene);
  }
}

function restoreDiscoveryFiltersFromUrl({ present = true } = {}) {
  const params = new URLSearchParams(window.location.search);
  activeHall = isKidsLobby ? "games" : selectedFilterValue(hallButtons, "hallTab", params.get("hall") || "games");
  activeFilter = selectedFilterValue(filterButtons, "ageFilter", params.get("age") || "all");
  activeTopic = selectedFilterValue(topicButtons, "topicFilter", params.get("topic") || (params.get("gameType") === "tower-defense" ? "Tower Defense" : params.get("gameType")) || "all");
  if (!isKidsLobby && activeTopic !== "all" && ![...catalogGames, ...upcomingPreviewGames()]
    .some((game) => gameMatchesHall(game) && topicMatches(game, activeTopic))) activeTopic = "all";
  activeSkill = selectedFilterValue(skillButtons, "skillFilter", params.get("skill") || "all");
  if (activeTopic !== "all" && activeSkill !== "all") activeTopic = "all";
  activeLibrary = selectedFilterValue(libraryButtons, "libraryTab", params.get("library") || "all");
  activeAvailability = selectedFilterValue(availabilityButtons, "availabilityFilter", params.get("availability") || "all");
  const query = params.get("q") || "";
  activeSearch = normalizeSearch(query);
  if (!present) { hallSearchDisplay = query; return; }
  if (gameSearch) gameSearch.value = query;
  setActiveButtons(hallButtons, "hallTab", activeHall);
  setActiveButtons(filterButtons, "ageFilter", activeFilter);
  setActiveButtons(topicButtons, "topicFilter", activeTopic);
  setActiveButtons(skillButtons, "skillFilter", activeSkill);
  setActiveButtons(libraryButtons, "libraryTab", activeLibrary);
  setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
}

function syncDiscoveryFiltersToUrl(historyMode = "replace") {
  if (historyMode === "none") return;
  const url = new URL(window.location.href);
  const values = {
    hall: isKidsLobby || activeHall === "games" ? "all" : activeHall,
    age: activeFilter,
    topic: activeTopic,
    skill: activeSkill,
    library: activeLibrary,
    availability: activeAvailability,
    q: activeSearch,
    gameType: "all", // Retire old URLs after migrating into the shared topic facet.
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
  const currentHallGames = gamesInHall();
  const playableCount = currentHallGames.filter((game) => game.status === "playable").length;
  const previewCount = currentHallGames.filter((game) => game.status === "planned").length;
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
  const reviewPassCopy = {
    en: "Reviewer PASS",
    "zh-Hant": "評測員 PASS",
    "zh-Hans": "评测员 PASS",
    ja: "レビュアー PASS",
    ko: "리뷰어 PASS",
    es: "Evaluador PASS",
    "pt-BR": "Avaliador PASS",
    fr: "Évaluateur PASS",
    de: "Prüfer PASS",
    it: "Valutatore PASS",
    ru: "Проверка PASS",
    hi: "समीक्षक PASS",
    ar: "اجتاز المراجع",
  };
  const zh = locale === "zh-Hant";
  const es = locale === "es";
  const ja = locale === "ja";
  const copy = {
    playableLabel: zh ? "\u53ef\u904a\u73a9" : es ? "Disponible" : ja ? "プレイ可能" : "Playable",
    playableNote: zh ? "\u9ede\u64ca\u5f8c\u7acb\u5373\u9032\u5165" : es ? "Se abre de inmediato" : ja ? "すぐに始められます" : "Opens immediately",
    previewLabel,
    previewNote,
    reviewPassLabel: reviewPassCopy[locale] || reviewPassCopy.en,
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
  const state = currentDiscoveryState();
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
  const games = [...matchingCatalogGames(state), ...upcomingPreviewGames()
    .filter((game) => cardMatchesFilterState({ dataset: catalogFilterData(game) }, state))];
  return new Set(games.map((game) => game.id)).size;
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
  if (type === "age" && isKidsLobby && value !== "all") return i18n.t("kids.age.group");
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
  const icon = button.querySelector(".kids-topic-icon")?.outerHTML || button.dataset.kidsTopicIcon || "";
  if (icon) button.dataset.kidsTopicIcon = icon;
  button.innerHTML = `${icon}
    <span class="filter-copy">
      <span class="filter-label">${label}</span>
      ${hint ? `<span class="filter-hint">${hint}</span>` : ""}
    </span>
    <b class="filter-count">${count}</b>`;
  button.setAttribute("aria-label", hint ? `${label}, ${hint}, ${count}` : `${label}, ${count}`);
  if (type === "age" && isKidsLobby && value !== "all") button.title = i18n.t("kids.age.recommended", { age: label });
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

// Retained as a stable local fixture hook; production launch surfaces do not
// call this. Actual recent history is written by the game_start lifecycle.
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
  return gameStats.games?.[game.id] || { plays7d: 0, playsTotal: 0, users7d: 0, rank7d: null, rankTotal: null };
}

function hasRealStats() {
  const updated = Date.parse(gameStats.updatedAt || "");
  const age = Date.now() - updated;
  return gameStats.source === "ga4" && gameStats.metric === "game_start"
    && Number.isFinite(updated) && age >= 0 && age < 30 * 86400000
    && Number(gameStats.totals?.playsTotal || 0) > 0;
}

function hasStatsFeed() {
  return gameStats.source === "ga4";
}

function formatCount(value) {
  return new Intl.NumberFormat(i18n.locale(), { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
}

function playCountText(game) {
  if (!hasRealStats()) return "";
  const stats = statFor(game);
  if (!hasStatsFeed()) return i18n.t("stats.collecting");
  return i18n.t("stats.plays_total", { count: formatCount(stats.playsTotal || 0) });
}

function rankLabel(game, fallbackRank) {
  const stats = statFor(game);
  const rank = hasRealStats() && stats.rankTotal ? stats.rankTotal : fallbackRank;
  return i18n.t("stats.rank_label", { rank });
}

function rankedPopularGames(limit = 5) {
  if (!hasRealStats()) return [];
  return playableGames()
    .filter((game) => Number(statFor(game).playsTotal) > 0)
    .sort((a, b) => (statFor(b).playsTotal || 0) - (statFor(a).playsTotal || 0)
      || (statFor(b).plays7d || 0) - (statFor(a).plays7d || 0) || a.id.localeCompare(b.id, "en"))
    .slice(0, limit);
}

function hasRankedPopularGames() {
  return activeHall !== "topics" && rankedPopularGames(1).length > 0;
}

function heroGamesTitleKey() {
  return activeHall === "topics" ? "hall.topics_games_title"
    : hasRankedPopularGames() ? "section.hero_games" : "site.featured";
}

function popularGames(limit = 3) {
  const ranked = rankedPopularGames(limit);
  if (ranked.length) return ranked;
  const availableGames = gamesInHall().filter((game) => game.status === "playable");
  const heroIds = !isKidsLobby && activeHall === "tabletop" ? tabletopHeroGameIds : lobby.heroGameIds;
  return heroIds.map((id) => availableGames.find((game) => game.id === id)).filter(Boolean).slice(0, limit);
}

function playableGames() {
  return gamesInHall().filter((game) => game.status === "playable");
}

function recentPlayableGames(limit = 4) {
  return recentGameIds
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable" && gameMatchesHall(game)))
    .filter(Boolean)
    .slice(0, limit);
}

function recentlyUpdatedGames(limit = 4) {
  return [...recentlyUpdatedGameIds]
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable" && gameMatchesHall(game)))
    .filter(Boolean)
    .slice(0, limit);
}

function upcomingPreviewGames(limit = Number.POSITIVE_INFINITY) {
  // Unreleased cards belong only to the explicit owner-preview lobby.
  // Per-game announcement flags must never bypass this boundary.
  if (!ownerPreviewMode) return [];
  return allLobbyGames
    .filter((game) =>
      game.status === "planned"
      && (isKidsLobby
        ? !generalGameIds.has(game.id) && !topicGameIds.has(game.id)
        : generalGameIds.has(game.id))
      && gameMatchesHall(game)
      && (game.art?.background || game.art?.hero))
    .slice(0, limit);
}

function challengeSpotlightGames(limit = 4) {
  const games = playableGames()
    .filter((game) => (game.ages || []).includes("13"))
  if (hasRealStats()) games.sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
  });
  return games.slice(0, limit);
}

function mobileFriendlyGames(limit = 4) {
  const pinned = mobilePickGameIds
    .map((id) => lobby.games.find((game) => game.id === id && game.status === "playable" && gameMatchesHall(game)))
    .filter(Boolean);
  const pinnedIds = new Set(pinned.map((game) => game.id));
  const extras = playableGames().filter((game) => !pinnedIds.has(game.id));
  if (hasRealStats()) extras.sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
  });
  return [...pinned, ...extras].slice(0, limit);
}

function recommendationSeeds() {
  const seedIds = [...recentGameIds, ...favoriteGameIds].filter((id, index, list) => id && list.indexOf(id) === index);
  return seedIds.map((id) => lobby.games.find((game) => game.id === id && game.status === "playable" && gameMatchesHall(game))).filter(Boolean);
}

function recommendationAgeCompatible(game, seeds) {
  if (!seeds.length) return true;
  return seeds.some((seed) => (game.ages || []).some((age) => (seed.ages || []).includes(age)));
}

function scoreRecommendation(game, seeds) {
  if (!seeds.length) {
    if (!hasRealStats()) return 0;
    const stats = statFor(game);
    return (stats.plays7d || 0) * 10 + (stats.playsTotal || 0);
  }
  const affinity = seeds.reduce((score, seed) => {
    const sharedSkills = (game.skills || []).filter((skill) => (seed.skills || []).includes(skill)).length;
    const sharedCategories = (game.categories || []).filter((category) => (seed.categories || []).includes(category)).length;
    const sharedAges = (game.ages || []).filter((age) => (seed.ages || []).includes(age)).length;
    return score + sharedSkills * 5 + sharedCategories * 3 + sharedAges * 4;
  }, 0);
  if (!hasRealStats()) return affinity * 10;
  const stats = statFor(game);
  const plays7d = Number(stats.plays7d) || 0;
  const users7d = Number(stats.users7d) || 0;
  const popularity = Math.min(8, Math.log2(plays7d + 1));
  const repeatConfidence = users7d >= 3 ? Math.min(6, (plays7d + 3) / (users7d + 3)) : 0;
  return affinity * 10 + popularity + repeatConfidence;
}

function recommendationPrimaryCategory(game) {
  return game.categories?.[0] || "__uncategorized";
}

function recommendationReasonKey(game, seeds) {
  if (!seeds.length) return "popular_fallback";
  if ((game.skills || []).some((skill) => seeds.some((seed) => (seed.skills || []).includes(skill)))) return "shared_skill";
  if ((game.ages || []).some((age) => seeds.some((seed) => (seed.ages || []).includes(age)))) return "shared_age";
  return "activity";
}

function recommendedGames(limit = 3) {
  const seeds = recommendationSeeds();
  const seedIds = new Set(seeds.map((game) => game.id));
  const candidates = playableGames().filter((game) => !seedIds.has(game.id));
  const ageCompatible = candidates.filter((game) => recommendationAgeCompatible(game, seeds));
  const ranked = (ageCompatible.length ? ageCompatible : candidates)
    .map((game) => ({ game, score: scoreRecommendation(game, seeds), stats: statFor(game) }))
    .sort((a, b) => b.score - a.score || (hasRealStats() ? (b.stats.plays7d || 0) - (a.stats.plays7d || 0) || (b.stats.playsTotal || 0) - (a.stats.playsTotal || 0) : 0))
  if (!ranked.length) return popularGames(limit);
  const selected = [];
  const selectedIds = new Set();
  const categoryCounts = new Map();
  ranked.forEach((entry) => {
    if (selected.length >= limit) return;
    const category = recommendationPrimaryCategory(entry.game);
    const categoryCount = categoryCounts.get(category) || 0;
    const hasNearAlternative = ranked.some((alternative) => (
      alternative.game.id !== entry.game.id
      && recommendationPrimaryCategory(alternative.game) !== category
      && Math.abs(entry.score - alternative.score) <= 5
    ));
    if (categoryCount >= 2 && hasNearAlternative) return;
    selected.push(entry.game);
    selectedIds.add(entry.game.id);
    categoryCounts.set(category, categoryCount + 1);
  });
  if (selected.length < limit) {
    ranked.forEach((entry) => {
      if (selected.length >= limit || selectedIds.has(entry.game.id)) return;
      selected.push(entry.game);
      selectedIds.add(entry.game.id);
    });
  }
  return selected;
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
  return hasRealStats() ? i18n.t("recommend.popular_reason") : i18n.t("recommend.start_here");
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
      updatedAt: stats.updatedAt || null,
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

function openGame(game, title, ageLabel, card = null) {
  window.WeightPlayAudio?.play("ui.click");
  window.WonderAnalytics?.track("game_open", {
    game_id: game.id,
    game_title: title,
    age_label: ageLabel,
    categories: (game.categories || []).join(","),
    locale: i18n.locale(),
    from_library: activeLibrary,
  });
  const gameUrl = new URL(game.href, document.baseURI);
  const targetUrl = new URL(i18n.localizedPath(i18n.actualLocale(), `${gameUrl.pathname}${gameUrl.search}${gameUrl.hash}`), gameUrl.origin).href;
  if (window.WeightPlayGameEntryLoader?.navigateTo?.({ url: targetUrl, gameId: game.id, title, anchor: card })) return;
  window.location.href = targetUrl;
}

function matchesCatalogSearch(card, query) {
  if (!query) return true;
  const genre = gameGenres.definitions.find(({ id }) =>
    normalizeSearch(id) === query || normalizeSearch(categoryText(id)) === query);
  return genre ? gameGenres.matches(card.dataset.gameId, genre.id) : card.dataset.search.includes(query);
}

function cardMatchesFilterState(card, state) {
  const ages = card.dataset.age.split(" ");
  const topics = card.dataset.topic ? card.dataset.topic.split("|") : [];
  const skills = card.dataset.skill ? card.dataset.skill.split("|") : [];
  return (
    (isKidsLobby || state.hall === "all" || card.dataset.hall === state.hall) &&
    matchesAgeFilter(ages, state.age) &&
    (state.topic === "all" || topics.includes(state.topic)) &&
    (state.skill === "all" || skills.includes(state.skill)) &&
    matchesCatalogSearch(card, state.search) &&
    (state.library === "all" ||
      (state.library === "favorites" && card.dataset.favorite === "true") ||
      (state.library === "recent" && card.dataset.recent === "true")) &&
    (state.availability === "all" ||
      (state.availability === "playable" && card.dataset.status === "playable") ||
      (state.availability === "preview" && card.dataset.status === "planned"))
  );
}

function quickPickCandidates() {
  const visibleGames = matchingCatalogGames().filter((game) => game.status === "playable");
  const hasActiveDiscoverySelection =
    activeFilter !== "all" ||
    activeTopic !== "all" ||
    activeSkill !== "all" ||
    activeLibrary !== "all" ||
    activeAvailability !== "all" ||
    Boolean(activeSearch);
  if (visibleGames.length) return { games: visibleGames, usedFallback: false };
  // Quick Pick promises to choose from the current filters. Falling back to
  // the full playable catalog after a filtered empty result silently violated
  // that promise and could route a player to an unrelated game.
  return hasActiveDiscoverySelection
    ? { games: [], usedFallback: false }
    : { games: playableGames(), usedFallback: true };
}

function openQuickPick() {
  const { games, usedFallback } = quickPickCandidates();
  if (!games.length) {
    window.WonderAnalytics?.track("quick_pick_empty", {
      locale: i18n.locale(),
      active_filter: activeFilter,
      active_topic: activeTopic,
      active_skill: activeSkill,
      active_library: activeLibrary,
      active_availability: activeAvailability,
      has_search: Boolean(activeSearch),
    });
    showToast(i18n.t("status.no_games"));
    return;
  }
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
  window.WeightPlayAudio?.play("ui.click");
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
  const numericAge = /^\d+\+$/.test(ageLabel);
  const isIndependentAgeGame = game.id === "animal-quiz";
  const cardAgeLabel = isKidsLobby && numericAge
    ? i18n.t(isIndependentAgeGame ? "kids.age.independentShort" : "kids.age.minimumShort", { age: ageLabel })
    : ageLabel;
  const cardAgeTitle = isIndependentAgeGame
    ? i18n.t("kids.age.independent", { age: ageLabel })
    : numericAge
      ? i18n.t("kids.age.minimum", { age: ageLabel })
      : i18n.t("kids.age.recommended", { age: ageLabel });
  const card = document.createElement("article");
  const favorite = isFavorite(game.id);
  const recent = isRecent(game.id);
  card.className = `game-card ${isPlayable ? "playable" : "coming-soon"}`;
  card.dataset.hall = gameHall(game);
  card.dataset.age = (game.ages || []).join(" ");
  card.dataset.topic = filterTopicsFor(game).join("|");
  card.dataset.skill = (game.skills || []).join("|");
  card.dataset.status = game.status;
  card.dataset.gameId = game.id;
  card.dataset.search = catalogSearchText(game);
  card.dataset.favorite = favorite ? "true" : "false";
  card.dataset.recent = recent ? "true" : "false";
  card.dataset.recentIndex = String(recentGameIds.indexOf(game.id));
  card.dataset.internalTrial = !isPlayable && internalTrialPath(game) ? "true" : "false";
  const stats = statFor(game);
  card.dataset.rankTotal = String(stats.rankTotal || 9999);
  card.dataset.playsTotal = String(stats.playsTotal || 0);

  if (isPlayable) {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.addEventListener("click", () => {
      openGame(game, title, ageLabel, card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGame(game, title, ageLabel, card);
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

  const localizedMeta = text(game.meta);
  const meta = isPlayable && Array.isArray(localizedMeta)
    ? localizedMeta.map((item) => `<span>${item}</span>`).join("")
    : "";
  const categoryBadges = (game.categories || []).map((item) => `<span>${categoryText(item)}</span>`).join("");
  const skillBadges = isKidsLobby && isPlayable ? (game.skills || []).slice(0, 3).map((item) => `<span>${skillText(item)}</span>`).join("") : "";
  const skillReason = isKidsLobby && isPlayable ? skillReasonText(game) : "";
  const quickFacts = isPlayable ? [gameInfoText(game.id, "difficulty"), gameInfoText(game.id, "time")].filter(Boolean).join("") : "";
  const quickFactValues = isPlayable
    ? [
      lobbyGameFacts[game.id]?.difficulty
        ? `${localizedFactLabel("difficulty")}: ${localizeDifficulty(lobbyGameFacts[game.id].difficulty)}`
        : "",
      lobbyGameFacts[game.id]?.time
        ? `${localizedFactLabel("time")}: ${localizePlayTime(lobbyGameFacts[game.id].time)}`
        : "",
    ].filter(Boolean)
    : [];
  const discoveryLabel = isPlayable
    ? [
      title,
      type,
      stateCopy("playableLabel"),
      isKidsLobby ? cardAgeTitle : ageLabel,
      text(game.description),
      ...(game.categories || []).slice(0, 3).map(categoryText),
      ...(game.skills || []).slice(0, 3).map(discoverySkillText),
      ...quickFactValues,
    ].filter(Boolean).join(". ")
    : "";
  if (discoveryLabel) card.setAttribute("aria-label", discoveryLabel);
  const cardArt = game.art || {
    kind: "image",
    background: game.cover || "assets/hero.png",
    hideHero: true,
  };
  const comingSoonBadge = isPlayable ? "" : `<span class="coming-soon-art-badge">${i18n.t("action.coming_soon")}</span>`;
  const art =
    cardArt.kind === "image"
      ? `<div class="game-card-art image-art"><img class="game-card-fg" ${lobbyImageAttributes(cardArt.background)} alt="" width="480" height="480" />${isPlayable && game.previewVideo ? `<video class="game-card-preview" data-preview-src="${game.previewVideo}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ""}${comingSoonBadge}</div>`
      : `<div class="game-card-art ${cardArt.className || ""}">${showAgeLabels ? `<span>${isKidsLobby ? cardAgeLabel : ageLabel}</span>` : ""}${comingSoonBadge}</div>`;
  const favoriteAction = i18n.t(favorite ? "action.remove_favorite" : "action.add_favorite");
  const favoriteLabel = i18n.t(favorite ? "action.remove_favorite_title" : "action.add_favorite_title", { title });
  const primaryAction = isPlayable
    ? i18n.t(recent ? "recent_play.action" : "action.play")
    : ownerPreviewMode && internalTrialPath(game)
      ? `${stateCopy("previewLabel")} · ${i18n.t("action.play")}`
      : i18n.t("action.coming_soon");
  const ageOverlay = isKidsLobby && showAgeLabels
    ? `<span class="game-card-age-overlay" title="${cardAgeTitle}">${cardAgeLabel}</span>${isIndependentAgeGame ? `<span class="game-card-age-note">${cardAgeTitle}</span>` : ""}`
    : "";
  const continueBadge = isPlayable && recent ? `<span class="continue-badge">${i18n.t("recent_play.action")}</span>` : "";
  const lifetimeRank = isPlayable && hasRankedPopularGames()
    ? popularGames(5).findIndex((popularGame) => popularGame.id === game.id) + 1
    : 0;
  const popularBadge = lifetimeRank > 0 ? `<span class="popular-card-badge">${rankLabel(game, lifetimeRank)}</span>` : "";
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
        ${showAgeLabels ? `<span class="age-pill" ${isKidsLobby ? `title="${cardAgeTitle}"` : ""}>${cardAgeLabel}</span>` : ""}
        <span class="game-card-badges">
          ${updatedBadge}
          ${popularBadge}
          <span>${isPlayable ? stateCopy("playableLabel") : text(game.statusText)}</span>
        </span>
      </div>
      <h2 data-runtime-localize="off">${title}</h2>
      ${isKidsLobby && isPlayable ? `<span class="game-card-play-tag">${type}</span>` : ""}
      <p>${text(game.description)}</p>
      ${gameStateCard(game, isPlayable)}
      <div class="game-card-categories">${categoryBadges}</div>
      ${skillBadges ? `<div class="game-card-skills" aria-label="${i18n.t("aria.skills_trained")}">${skillBadges}</div>` : ""}
      ${skillReason ? `<div class="game-card-skill-reason">${skillReason}</div>` : ""}
      ${quickFacts ? `<div class="game-card-facts" aria-label="${i18n.t("aria.game_quick_facts")}">${quickFacts}</div>` : ""}
      <div class="game-card-meta"${game.meta?.__localizedExact ? ' data-runtime-localize="off"' : ""}>${meta}</div>
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

  attachLobbyPreview(card);
  return card;
}

function attachLobbyPreview(card) {
  const preview = card.querySelector(".game-card-preview");
  if (preview) {
    let previewAttempt = 0;
    const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHoverPointer = () => window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
    const canPreviewPointer = (event) =>
      !reducedMotion() &&
      (event?.pointerType === "mouse" || hasHoverPointer());
    const canPreviewFocus = () => !reducedMotion() && hasHoverPointer();
    const clearPreviewState = () => {
      card.classList.remove("is-preview-loading", "is-previewing");
    };
    const stopPreview = () => {
      previewAttempt += 1;
      preview.pause();
      // Release the decoded buffer and network source, not just playback.
      if (preview.hasAttribute("src")) {
        preview.removeAttribute("src");
        preview.preload = "none";
        preview.load();
      }
      clearPreviewState();
      if (activeGamePreview === preview) activeGamePreview = null;
    };
    preview.releaseLobbyPreview = stopPreview;
    const startPreview = (event) => {
      const fromKeyboardFocus = event?.type === "focusin";
      if (fromKeyboardFocus ? !canPreviewFocus() : !canPreviewPointer(event)) return;
      if (activeGamePreview && activeGamePreview !== preview) {
        activeGamePreview.releaseLobbyPreview();
      }
      const attempt = ++previewAttempt;
      activeGamePreview = preview;
      card.classList.add("is-preview-loading");
      if (!preview.getAttribute("src")) {
        preview.preload = "auto";
        preview.src = preview.dataset.previewSrc;
        preview.load();
      }
      preview.play()
        .then(() => {
          if (activeGamePreview !== preview || attempt !== previewAttempt) return;
          card.classList.remove("is-preview-loading");
          card.classList.add("is-previewing");
        })
        .catch(() => {
          if (attempt !== previewAttempt) return;
          stopPreview();
        });
    };
    preview.addEventListener("playing", () => {
      if (activeGamePreview !== preview) return;
      card.classList.remove("is-preview-loading");
      card.classList.add("is-previewing");
    });
    preview.addEventListener("error", () => {
      stopPreview();
    });
    card.addEventListener("pointerenter", startPreview);
    card.addEventListener("pointerleave", stopPreview);
    card.addEventListener("focusin", startPreview);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) stopPreview();
    });
  }

}

// One transition owner commits each decoded hall change once and releases its
// live DOM locks before another render can start.
let hallMotion = null;
let renderingHallMotion = false;
const hallMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function hallMotionImageSources(targetHall) {
  const sources = new Set([hallHeroImageSource(targetHall)].filter(Boolean));
  const featured = lobby.games.find(game => game.id === lobby.featuredGameId);
  if (featured && gameMatchesHall(featured, targetHall)) sources.add(lobbyThumbnail(primaryArt(featured), 480));
  const previewIds = targetHall === 'topics' ? [...topicGameIds]
    : targetHall === 'tabletop' ? tabletopHeroGameIds : lobby.heroGameIds;
  lobby.games.filter(game => gameMatchesHall(game, targetHall) && previewIds.includes(game.id))
    .slice(0, 5).forEach(game => sources.add(lobbyThumbnail(game.art?.background || primaryArt(game), 480)));
  return [...sources];
}

const hallImageWaitLimit = 700;
const hallCrossfadeDuration = 420;
const nextLobbyFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
const lobbyScrollOffset = () => ({
  left: Math.max(window.scrollX, document.documentElement.scrollLeft, document.body.scrollLeft),
  top: Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop)
});
function crossfadeHallShell(shell, motion) {
  const rect = shell.getBoundingClientRect();
  const snapshot = shell.cloneNode(true);
  snapshot.classList.add('hall-crossfade-snapshot');
  snapshot.setAttribute('aria-hidden', 'true');
  snapshot.removeAttribute('aria-busy');
  snapshot.inert = true;
  // Freeze the outgoing paint before changing the body's hall palette/layout.
  // Otherwise non-ID controls inherit the incoming hall and visibly resize.
  const originals = [shell, ...shell.querySelectorAll('*')];
  const copies = [snapshot, ...snapshot.querySelectorAll('*')];
  originals.forEach((original, index) => {
    const copy = copies[index];
    const rect = original.getBoundingClientRect();
    if (rect.width && rect.height && rect.bottom > 0 && rect.top < innerHeight
      && rect.right > 0 && rect.left < innerWidth) {
      const style = getComputedStyle(original);
      for (const property of style) {
        copy.style.setProperty(property, style.getPropertyValue(property), 'important');
      }
    } else {
      copy.style.setProperty('visibility', 'hidden', 'important');
    }
    copy.style.setProperty('animation', 'none', 'important');
    copy.style.setProperty('transition', 'none', 'important');
    copy.style.setProperty('pointer-events', 'none', 'important');
    copy.removeAttribute('id');
  });
  // The copy is visual only: no duplicated media playback or live controls.
  snapshot.querySelectorAll('video').forEach(video => video.remove());
  snapshot.querySelectorAll('[data-hall-tab]').forEach(node => node.removeAttribute('data-hall-tab'));
  const geometry = {
    position: 'absolute', top: `${rect.top + lobbyScrollOffset().top}px`, left: `${rect.left + lobbyScrollOffset().left}px`,
    width: `${rect.width}px`, height: `${rect.height}px`, margin: '0',
    boxSizing: 'border-box', transform: 'none', opacity: '1',
    pointerEvents: 'none', zIndex: '100', overflow: 'hidden'
  };
  for (const [property, value] of Object.entries(geometry)) {
    snapshot.style.setProperty(property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`), value, 'important');
  }
  // Opacity belongs to the crossfade animation, not the frozen style.
  snapshot.style.removeProperty('opacity');
  document.body.append(snapshot);
  motion.snapshot = snapshot;
  if (!motion.syncSnapshotPosition) {
    motion.syncSnapshotPosition = () => {
      const current = motion.snapshot;
      if (!current) return;
      const liveRect = shell.getBoundingClientRect();
      const scroll = lobbyScrollOffset();
      current.style.left = `${liveRect.left + scroll.left}px`;
      current.style.top = `${liveRect.top + scroll.top}px`;
      if (!motion.snapshotFrame) {
        motion.snapshotFrame = requestAnimationFrame(() => {
          motion.snapshotFrame = null;
          motion.syncSnapshotPosition?.();
        });
      }
    };
  }
  motion.syncSnapshotPosition();
  return snapshot;
}

function clearHallEntryAnimations(motion) {
  motion.entryAnimations?.forEach(animation => animation.cancel());
  motion.entryAnimations = [];
}

function animateHallArrival(shell, motion) {
  clearHallEntryAnimations(motion);
  const inView = node => {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > -24 && rect.top < innerHeight + 24;
  };
  const targets = [...shell.children]
    .filter(node => !node.classList.contains('hidden') && inView(node));
  motion.entryAnimations = targets.map(node => node.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], {
    duration: hallCrossfadeDuration,
    easing: 'ease-in-out',
    fill: 'both'
  }));
}

function waitForHallImages(motion, targetHall) {
  let timer;
  let wake;
  const changed = new Promise(resolve => {
    wake = () => resolve('changed');
    motion.wakeImageWait = wake;
  });
  const loaded = Promise.all(hallMotionImageSources(targetHall).map(source => decodeLobbyImage(source).catch(() => false)))
    .then(() => 'loaded');
  const deadline = new Promise(resolve => { timer = setTimeout(() => resolve('timeout'), hallImageWaitLimit); });
  return Promise.race([loaded, deadline, changed]).finally(() => {
    clearTimeout(timer);
    if (motion.wakeImageWait === wake) motion.wakeImageWait = null;
  });
}

function settleHallMotion() {
  const motion = hallMotion;
  if (!motion) return;
  hallMotion = null;
  motion.wakeImageWait?.();
  clearHallEntryAnimations(motion);
  document.body.dataset.hallMotionPhase = 'commit';
  motion.commit(motion.targetHall);
  motion.restore();
  if (motion.deferredRender) queueMicrotask(() => renderLobby(motion.options));
}

function renderLobby(options = {}) {
  if (hallMotion) {
    hallMotion.options = { ...hallMotion.options, ...options };
    hallMotion.resetScroll ||= Boolean(options.resetScroll);
    if (activeHall !== hallMotion.targetHall) {
      hallMotion.targetHall = activeHall;
      hallMotion.generation += 1;
      hallMotion.wakeImageWait?.();
    } else {
      hallMotion.deferredRender = true;
    }
    return;
  }
  const change = !isKidsLobby && document.body.dataset.gameHall
    && document.body.dataset.gameHall !== activeHall;
  if (!change) return renderLobbyContent(options);
  const shell = document.querySelector('.lobby-shell');
  const regions = [...shell.children].filter(node =>
    !node.matches('.lobby-topbar,.game-hall-switch,.lobby-search-row'));
  const castleRegion = shell.querySelector('#weightplayCastle');
  const entries = regions.filter(Boolean).map(node => ({ node, inert: node.inert }));
  const focusWasInContent = entries.some(({node}) => node.contains(document.activeElement));
  const motion = { targetHall: activeHall, options: { ...options }, deferredRender: false, resetScroll: Boolean(options.resetScroll), generation: 0, wakeImageWait: null, quickPickWasDisabled: Boolean(quickPickBtn?.disabled) };
  motion.restore = () => {
    motion.fade?.cancel();
    clearHallEntryAnimations(motion);
    motion.snapshot?.remove();
    cancelAnimationFrame(motion.snapshotFrame);
    motion.snapshotFrame = null;
    motion.syncSnapshotPosition = null;
    entries.forEach(({node, inert}) => {
      // The Castle Hall manager owns its destination state. Do not restore an
      // outgoing inert snapshot on the Castle or an enclosing region that
      // would override the manager's hidden/interactive decision.
      if (!castleRegion || (node !== castleRegion && !node.contains(castleRegion))) node.inert = inert;
    });
    if (quickPickBtn) quickPickBtn.disabled = motion.quickPickWasDisabled;
    delete document.body.dataset.hallMotionPhase;
    delete document.body.dataset.hallTransitionTarget;
    shell.removeAttribute('aria-busy');
    document.documentElement.classList.remove('hall-content-motion');
    resumeToastAfterHallMotion(motion.toastState);
    if (focusWasInContent || (activeHall !== 'games' && castleRegion?.contains(document.activeElement))) {
      [...hallButtons].find(button => button.dataset.hallTab === activeHall)?.focus({preventScroll:true});
    }
    // Reconcile after all transition cleanup so the Castle manager is the final
    // writer of its destination inert/hidden state, even after a stale snapshot.
    window.dispatchEvent(new Event('weightplay:hall-change'));
  };
  motion.commit = (targetHall) => {
    activeHall = targetHall;
    document.body.dataset.hallTransitionTarget = targetHall;
    renderingHallMotion = true;
    try { renderLobbyContent(motion.options); }
    finally { renderingHallMotion = false; }
    if (motion.resetScroll) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      motion.resetScroll = false;
    }
  };
  const focused = document.activeElement;
  if (entries.some(({node}) => node.contains(focused))) {
    [...hallButtons].find(button => button.dataset.hallTab === activeHall)?.focus({preventScroll:true});
  }
  entries.forEach(({node}) => { node.inert = true; });
  shell.setAttribute('aria-busy', 'true');
  document.documentElement.classList.add('hall-content-motion');
  if (quickPickBtn) quickPickBtn.disabled = true;
  motion.toastState = pauseToastForHallMotion();
  hallMotion = motion;
  if (hallMotionQuery.matches || document.hidden) {
    motion.commit(motion.targetHall);
    hallMotion = null;
    motion.restore();
    return;
  }
  void (async () => {
    await nextLobbyFrame();
    if (hallMotion !== motion) return;
    document.body.dataset.hallMotionPhase = 'exit';
    if (hallMotionQuery.matches || document.hidden) {
      motion.commit(motion.targetHall);
      hallMotion = null;
      motion.restore();
      return;
    }
    // Keep the entire outgoing lobby visible while the destination images load.
    while (hallMotion === motion) {
      clearHallEntryAnimations(motion);
      const targetHall = motion.targetHall;
      const generation = motion.generation;
      const imageState = await waitForHallImages(motion, targetHall);
      if (hallMotion !== motion) return;
      if (imageState === 'changed' || generation !== motion.generation) continue;
      const snapshot = motion.snapshot || crossfadeHallShell(shell, motion);
      document.body.dataset.hallMotionPhase = 'commit';
      motion.commit(targetHall);
      delete document.body.dataset.hallTransitionTarget;
      document.body.dataset.hallMotionPhase = 'enter';
      // All visible regions crossfade together at their final dimensions.
      animateHallArrival(shell, motion);
      motion.fade = snapshot.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: hallCrossfadeDuration, easing: 'ease-in-out', fill: 'forwards'
      });
      await motion.fade.finished.catch(() => {});
      if (hallMotion !== motion) return;
      delete document.body.dataset.hallMotionPhase;
      if (motion.targetHall !== document.body.dataset.gameHall) {
        // Keep the settled destination visible while the next selection's images
        // are prepared, rather than exposing an intermediate hall.
        snapshot.remove();
        motion.snapshot = crossfadeHallShell(shell, motion);
        motion.snapshot.style.opacity = '1';
        motion.snapshot.style.transform = 'none';
        continue;
      }
      snapshot.remove();
      motion.snapshot = null;
      const deferredRender = motion.deferredRender;
      const deferredOptions = motion.options;
      hallMotion = null;
      motion.restore();
      if (deferredRender) queueMicrotask(() => renderLobby(deferredOptions));
      return;
    }
  })();
}

hallMotionQuery.addEventListener('change', () => { if (hallMotionQuery.matches) settleHallMotion(); });

function renderLobbyContent({ historyMode = "replace" } = {}) {
  recentGameIds = readRecentGames();
  syncGenreFilters();
  if (gameSearch && hallSearchDisplay !== undefined) gameSearch.value = hallSearchDisplay;
  hallSearchDisplay = undefined;
  setActiveButtons(filterButtons, "ageFilter", activeFilter);
  setActiveButtons(topicButtons, "topicFilter", activeTopic);
  setActiveButtons(skillButtons, "skillFilter", activeSkill);
  setActiveButtons(libraryButtons, "libraryTab", activeLibrary);
  setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
  catalogSearchIndex.clear();
  catalogNeedsRebuild = true;
  applyStaticTranslations();
  syncHallPresentation();
  if (publisherStory) publisherStory.hidden = !isKidsLobby && activeHall !== "games";
  renderCatalogDirectory();
  platformTitle.textContent = isKidsLobby ? "WeightPlay Kids" : lobby.platform.name;
  platformSubtitle.textContent = i18n.t(isKidsLobby ? "kids.site.subtitle" : activeHall === 'games' ? "general.site.subtitle" : `hall.${activeHall}_note`);

  const totalGameCount = gamesInHall().length;
  const lobbyVisitsTotal = Number(gameStats.totals?.lobbyVisitsTotal);
  const hasLobbyVisitTotal = hasStatsFeed() && gameStats.totals?.lobbyVisitsTotal !== null && Number.isFinite(lobbyVisitsTotal) && lobbyVisitsTotal >= 0;
  lobbyStats.innerHTML = `
    <div><strong>${totalGameCount}</strong><span>${i18n.t("stats.total_games")}</span></div>
    <div><strong>${hasLobbyVisitTotal ? formatCount(lobbyVisitsTotal) : "..."}</strong><span>${i18n.t("stats.lobby_visits_total_short")}</span></div>
  `;


  if (isKidsLobby) {
    const featured = lobby.games.find((game) => game.id === lobby.featuredGameId);
    if (featured) {
      featuredGame.href = featured.href;
      setLobbyImage(featuredGame.querySelector("img"), primaryArt(featured), { priority: true });
      const featuredTitle = featuredGame.querySelector("strong");
      featuredTitle.dataset.runtimeLocalize = "off";
      featuredTitle.textContent = text(featured.title);
    }
  } else {
    featuredGame.href = "kids/";
    setLobbyImage(featuredGame.querySelector("img"), "assets/animal-zoo-idle-cover.webp", { priority: true });
    featuredGame.querySelector("strong").textContent = i18n.t("kids.portal.title");
    featuredGame.setAttribute("aria-label", i18n.t("kids.portal.action"));
  }

  renderContinuePlaying();
  renderSpotlight();
  renderHeroGames();
  renderLatestGames();
  renderMobilePicks();
  renderUpcomingGames();
  renderCharacterShowcase();
  renderFreshUpdates();
  renderChallengeSpotlight();
  renderRecommendations();
  renderSkillPaths();
  applyFilter({ historyMode });
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
    });
    card.innerHTML = `
      <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
      <div class="continue-playing-copy">
        ${showAgeLabels ? `<span>${ageLabel}</span>` : ""}
        <strong data-runtime-localize="off">${title}</strong>
        <small>${type}</small>
        <b>${i18n.t("recent_play.action")}</b>
      </div>
    `;
    return card;
  });
  continuePlayingTitle.textContent = i18n.t("recent_play.title");
  continuePlayingReason.textContent = i18n.t("recent_play.reason");
  continuePlayingSection.setAttribute("aria-label", i18n.t("recent_play.title"));
  continuePlayingSection.classList.toggle("hidden", cards.length === 0);
  document.body.classList.toggle("has-recent-games", cards.length > 0);
  continuePlaying.replaceChildren(...cards);
}

function discoveryCards(games, { popular = false, visualIdentity = false, priority = popular } = {}) {
  return games
    .map((game, index) => {
      const isPlayable = game.status === "playable";
      const isTopicPreview = !isKidsLobby && activeHall === "topics" && topicGameIds.has(game.id) && game.status === "planned";
      const title = text(game.title);
      const type = text(game.type);
      const ageLabel = text(game.ageLabel);
      const hasVisualIdentity = visualIdentity && isPlayable && !isKidsLobby;
      // Popular cards are ranked after unavailable games are filtered out, so
      // their visible Top 5 positions must stay consecutive.
      const rankText = popular && (isKidsLobby || hasRealStats()) ? i18n.t("stats.rank_label", { rank: index + 1 }) : "";
      // Topic hall teasers are always buttons; planned topic games never become
      // public anchors to their internal trial paths.
      const card = document.createElement(isPlayable ? "a" : "button");
      card.className = `hero-game-card ${isPlayable ? "playable" : "planned"}${hasVisualIdentity ? " has-visual-identity" : ""}`;
      card.dataset.discoveryGameId = game.id;
      if (hasVisualIdentity) card.setAttribute("aria-label", `${title}. ${type}. ${stateCopy("playableLabel")}`);
      card.type = isPlayable ? undefined : "button";
      if (isPlayable) {
        card.href = game.href;
      } else {
        card.addEventListener("click", () => showPlannedGame(game));
      }
      card.innerHTML = `
        <div class="hero-game-art">
          <img class="hero-game-image" ${lobbyImageAttributes(game.art?.background || "assets/hero.png", { priority })} alt="" />
          ${isPlayable && topicGameIds.has(game.id) && game.previewVideo ? `<video class="game-card-preview" data-preview-src="${game.previewVideo}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ""}
          ${hasVisualIdentity ? `<span class="hero-game-art-identity" aria-hidden="true"><strong>${title}</strong><small>${type}</small></span>` : ""}
          ${popular && isKidsLobby ? `<span>${rankText}</span>` : ""}
        </div>
        ${hasVisualIdentity ? "" : `<div class="hero-game-copy">
          ${isTopicPreview ? `<span class="topic-preview-label">${i18n.t("hall.topics_preview")}</span>` : popular && !isKidsLobby && rankText ? `<span class="hero-game-rank">${rankText}</span>` : ""}
          <strong data-runtime-localize="off">${title}</strong>
          <small>${showAgeLabels ? `${type} / ${ageLabel}` : type}</small>
          ${popular && hasRealStats() ? `<em>${playCountText(game)}</em>` : ""}
        </div>`}
      `;
      revealDecodedImage(card.querySelector(".hero-game-image"));
      attachLobbyPreview(card);
      return card;
    });
}

function renderHeroGames() {
  const popular = hasRankedPopularGames();
  heroGames.querySelectorAll("video").forEach(video => video.releaseLobbyPreview?.());
  if (!isKidsLobby && activeHall === "topics") {
    heroGames.replaceChildren();
    return;
  }
  heroGames.replaceChildren(...discoveryCards(popularGames(5), { popular }));
}

function latestPublicGames() {
  const now = Date.now();
  return catalogGames.filter((game) => {
    const date = Date.parse(firstPublicDates[game.id]?.date);
    return game.status === "playable" && gameMatchesHall(game) && Number.isFinite(date) && date <= now;
  }).sort((a, b) => Date.parse(firstPublicDates[b.id].date) - Date.parse(firstPublicDates[a.id].date)
    || a.id.localeCompare(b.id, "en")).slice(0, 5);
}

function renderLatestGames() {
  if (isKidsLobby) return;
  const title = i18n.getLocalized(latestGamesCopy);
  latestGamesSection.querySelector("h2").textContent = title;
  latestGamesSection.querySelector(".catalog-jump").textContent = `${i18n.t("library.all_games")} →`;
  latestGamesSection.setAttribute("aria-label", title);
  latestGames.querySelectorAll("video").forEach(video => video.releaseLobbyPreview?.());
  latestGames.replaceChildren(...discoveryCards(latestPublicGames(), { visualIdentity: true }));
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
    });
    card.innerHTML = `
      <div class="mobile-pick-art">
        <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
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
  const cards = upcomingPreviewGames().map((game) => {
    const title = text(game.title);
    const type = text(game.type);
    const ageLabel = text(game.ageLabel);
    const description = text(game.description);
    const card = document.createElement("button");
    card.className = "upcoming-game-card";
    card.type = "button";
    card.dataset.gameId = game.id;
    card.dataset.hall = gameHall(game);
    card.dataset.age = (game.ages || []).join(" ");
    card.dataset.topic = filterTopicsFor(game).join("|");
    card.dataset.skill = (game.skills || []).join("|");
    card.dataset.status = game.status;
    card.dataset.search = catalogSearchText(game);
    card.dataset.favorite = isFavorite(game.id) ? "true" : "false";
    card.dataset.recent = isRecent(game.id) ? "true" : "false";
    card.dataset.recentIndex = String(recentGameIds.indexOf(game.id));
    card.dataset.internalTrial = internalTrialPath(game) ? "true" : "false";
    card.addEventListener("click", () => showPlannedGame(game));
    card.innerHTML = `
      <div class="upcoming-game-art">
        <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
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
  const upcomingReason = i18n.t("upcoming.reason_count", { count: cards.length });
  upcomingGamesReason.textContent = upcomingReason;
  upcomingGamesSection.setAttribute("aria-label", upcomingReason);
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
      <img ${lobbyImageAttributes(character.image)} alt="" />
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
  const cards = recommendedGames(3).map((game, index) => {
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
        recommendation_position: index + 1,
        seed_count: seeds.length,
        reason: recommendationReasonKey(game, seeds),
        locale: i18n.locale(),
      });
    });
    card.innerHTML = `
      <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
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
    });
    card.innerHTML = `
      <div class="fresh-update-art">
        <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
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
    });
    card.innerHTML = `
      <div class="challenge-spotlight-art">
        <img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />
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
  const games = playableGames().filter((game) => (game.skills || []).includes(skill));
  if (hasRealStats()) games.sort((a, b) => {
      const aStats = statFor(a);
      const bStats = statFor(b);
      return (bStats.plays7d || 0) - (aStats.plays7d || 0) || (bStats.playsTotal || 0) - (aStats.playsTotal || 0);
  });
  return games.slice(0, limit);
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
          ${games.map((game) => `<img ${lobbyImageAttributes(game.art?.background || primaryArt(game))} alt="" />`).join("")}
        </div>
        <small>${i18n.t("skill_path.cta")}</small>
      `;
      card.addEventListener("click", () => selectSkillPath(skill));
      return card;
    });

  skillPathsTitle.textContent = i18n.t(isKidsLobby ? "kids.skill_path.title" : "general.skill_path.title");
  skillPathsReason.textContent = i18n.t(isKidsLobby ? "kids.skill_path.reason" : "general.skill_path.reason");
  skillPathsSection.classList.toggle("hidden", cards.length === 0);
  skillPaths.replaceChildren(...cards);
}

function setActiveButtons(buttons, dataKey, value) {
  buttons.forEach((button) => {
    const isActive = button.dataset[dataKey] === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
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
  window.WeightPlayAudio?.play("ui.click");
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

function clearDiscoverySelections({ present = true } = {}) {
  activeFilter = "all";
  activeTopic = "all";
  activeSkill = "all";
  activeLibrary = "all";
  activeAvailability = "all";
  activeSearch = "";
  if (!present) { hallSearchDisplay = ''; return; }
  if (gameSearch) gameSearch.value = "";
  setActiveButtons(filterButtons, "ageFilter", "all");
  setActiveButtons(topicButtons, "topicFilter", "all");
  setActiveButtons(skillButtons, "skillFilter", "all");
  setActiveButtons(libraryButtons, "libraryTab", "all");
  setActiveButtons(availabilityButtons, "availabilityFilter", "all");

}

function resetDiscoveryFilters() {
  clearDiscoverySelections();
  window.WeightPlayAudio?.play("ui.click");
  window.WonderAnalytics?.track("clear_lobby_filters", { locale: i18n.locale() });
  applyFilter({ historyMode: "push" });
}

function currentDiscoveryState() {
  return { hall: isKidsLobby ? "all" : activeHall, age: activeFilter, topic: activeTopic, skill: activeSkill,
    library: activeLibrary, availability: activeAvailability, search: activeSearch };
}

function renderCatalogDirectory() {
  const label = i18n.t("status.all_games");
  catalogDirectory.querySelector("summary").textContent = label;
  const links = catalogDirectory.querySelector("nav");
  links.setAttribute("aria-label", label);
  links.replaceChildren(...lobby.games.filter((game) => game.status === "playable").map((game) => {
    const link = document.createElement("a");
    const url = new URL(game.href, document.baseURI);
    link.href = i18n.localizedPath(i18n.actualLocale(), `${url.pathname}${url.search}${url.hash}`);
    link.textContent = text(game.title);
    link.dataset.runtimeLocalize = "off";
    return link;
  }));
}

function catalogSearchText(game) {
  if (!catalogSearchIndex.has(game.id)) {
    // Same localized + English aliases for rendered cards and off-screen games.
    catalogSearchIndex.set(game.id, normalizeSearch([
      text(game.title), game.title?.en, text(game.type), game.type?.en,
      text(game.ageLabel), text(game.description), game.description?.en,
      ...(text(game.meta) || []), ...(game.meta?.en || []),
      ...(game.categories || []).map(categoryText), ...(game.categories || []),
      ...(game.skills || []).map(skillText), ...(game.skills || []),
      ...(Array.isArray(game.searchAliases) ? game.searchAliases : []),
    ].join(" ")));
  }
  return catalogSearchIndex.get(game.id);
}

function catalogFilterData(game) {
  return {
    gameId: game.id,
    hall: gameHall(game),
    age: (game.ages || []).join(" "), topic: filterTopicsFor(game).join("|"),
    skill: (game.skills || []).join("|"), status: game.status,
    search: catalogSearchText(game), favorite: String(isFavorite(game.id)),
    recent: String(isRecent(game.id)),
  };
}

function matchingCatalogGames(state = currentDiscoveryState()) {
  // Filtering and counts must not depend on how many DOM cards were revealed.
  return lobby.games.filter((game) => cardMatchesFilterState({ dataset: catalogFilterData(game) }, state));
}

function renderCatalog(isFiltered) {
  const signature = JSON.stringify([i18n.actualLocale(), currentDiscoveryState()]);
  if (signature !== catalogFilterSignature) {
    catalogRevealedBatches = 1;
    catalogFilterSignature = signature;
  }
  const matches = matchingCatalogGames();
  // Preserve the existing catalog order, filtered lifetime-popularity order,
  // and Recent order; sort the complete result BEFORE taking the first batch.
  if (activeLibrary === "recent") {
    matches.sort((a, b) => recentGameIds.indexOf(a.id) - recentGameIds.indexOf(b.id));
  } else if (isFiltered && hasRealStats()) {
    matches.sort((a, b) => (statFor(b).playsTotal || 0) - (statFor(a).playsTotal || 0));
  }
  const shown = matches.slice(0, catalogBatchSize() * catalogRevealedBatches);
  const existing = [...gameGrid.children];
  const canAppend = !catalogNeedsRebuild && existing.length <= shown.length
    && existing.every((card, index) => card.dataset.gameId === shown[index].id);
  if (canAppend) {
    gameGrid.append(...shown.slice(existing.length).map(createGameCard));
  } else {
    gameGrid.querySelectorAll("video").forEach((video) => video.releaseLobbyPreview?.());
    gameGrid.replaceChildren(...shown.map(createGameCard));
  }
  catalogNeedsRebuild = false;
  const moreButton = catalogPagination.querySelector("button");
  catalogPagination.hidden = matches.length === 0;
  catalogPagination.querySelector("p").textContent = i18n.t("catalog.showing", {
    shown: shown.length, total: matches.length,
  });
  moreButton.textContent = i18n.t("catalog.show_more");
  moreButton.hidden = shown.length >= matches.length;
  return matches.length;
}

function applyFilter({ historyMode = "replace" } = {}) {
  if (!renderingHallMotion && hallMotion) {
    hallMotion.deferredRender = true;
    return;
  }
  if (!renderingHallMotion) settleHallMotion();
  activeGamePreview?.releaseLobbyPreview();
  syncDemonEventPreview();
  syncGenreFilters();
  let upcomingVisibleCount = 0;
  const isFiltered =
    activeFilter !== "all" ||
    activeTopic !== "all" ||
    activeSkill !== "all" ||
    activeLibrary !== "all" ||
    activeAvailability !== "all" ||
    Boolean(activeSearch);
  let visibleCount = renderCatalog(isFiltered);
  document.querySelectorAll("#upcomingGames [data-age]").forEach((card) => {
    const isVisible = cardMatchesFilterState(card, currentDiscoveryState());
    card.classList.toggle("hidden", !isVisible);
    if (activeLibrary === "recent" && card.dataset.recentIndex !== "-1") {
      card.style.order = card.dataset.recentIndex;
    } else if (isFiltered && hasRealStats()) {
      card.style.order = String(1000000000 - Number(card.dataset.playsTotal || 0));
    } else {
      card.style.order = "";
    }
    if (isVisible) {
      visibleCount += 1;
      if (card.closest("#upcomingGames")) upcomingVisibleCount += 1;
    }
  });

  document.body.classList.toggle("discovery-filtered", isFiltered);
  const catalogHeading = document.querySelector(".catalog-heading h2");
  if (catalogHeading) catalogHeading.textContent = i18n.t(
    activeLibrary === "recent" ? "library.recent" : activeLibrary === "favorites" ? "library.favorites" : "library.all_games"
  );
  if (!isKidsLobby && activeHall === 'topics') renderHeroGames();
  heroGamesSection.classList.toggle("hidden", isFiltered || (!isKidsLobby && activeHall === "topics"));
  latestGamesSection.classList.toggle("hidden", isFiltered || isKidsLobby || activeHall === "topics" || latestGames.childElementCount === 0);
  discoverySnapshot?.classList.toggle("hidden", isFiltered);
  continuePlayingSection?.classList.toggle("filtered-out", isFiltered);
  mobilePicksSection?.classList.toggle("hidden", isFiltered);
  const hideUpcoming = upcomingPreviewGames().length === 0
    || (isFiltered && upcomingVisibleCount === 0);
  if (upcomingGamesSection) {
    upcomingGamesSection.hidden = hideUpcoming;
    upcomingGamesSection.classList.toggle("hidden", hideUpcoming);
  }
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
      activeLibrary === "favorites" ? i18n.t("status.no_favorites")
        : activeLibrary === "recent" ? i18n.t("status.no_recent")
          : activeHall === "topics" && !isFiltered ? i18n.t("hall.topics_empty") : i18n.t("status.no_games");
    const recoveryLabel = activeLibrary === "recent"
      ? i18n.t("library.all_games")
      : i18n.t("status.clear_filters");
    filterStatus.innerHTML = `
      <span>${emptyText}</span>
      ${isFiltered ? `<button type="button" data-clear-filters>${recoveryLabel}</button>` : ""}
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
  featuredLabel.textContent = i18n.t("site.featured");
  languageLabel.textContent = i18n.t("language.label");
  heroRankLabel.textContent = i18n.t("section.hero_rank");
  heroGamesTitle.textContent = i18n.t(heroGamesTitleKey());
  heroRankLabel.hidden = !hasRankedPopularGames();
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
  if (skillPathsTitle) skillPathsTitle.textContent = i18n.t(isKidsLobby ? "kids.skill_path.title" : "general.skill_path.title");
  if (skillPathsReason) skillPathsReason.textContent = i18n.t(isKidsLobby ? "kids.skill_path.reason" : "general.skill_path.reason");
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
    "#lobbyStats",
    "#gameGrid",
  ].join(",")).forEach((node) => node.setAttribute("data-runtime-localize-attributes", "off"));
  document.querySelectorAll("[data-library-tab], [data-topic-filter], [data-availability-filter]")
    .forEach((node) => node.setAttribute("data-runtime-localize", "off"));
  quickPickBtn?.setAttribute("aria-label", i18n.t("quick_pick.label"));
  const ariaLabels = {
    "#localeSelect": "language.label",
    "#lobbyStats": "aria.platform_status",
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
    [heroGamesSection, heroGamesTitleKey()],
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

function scheduleToastDismiss(delay, revision) {
  toastDeadline = Date.now() + delay;
  toastTimer = setTimeout(() => {
    if (revision !== toastRevision) return;
    lobbyToast.classList.add("hidden");
    toastTimer = null;
    toastDeadline = 0;
  }, delay);
}

function pauseToastForHallMotion() {
  if (!lobbyToast || lobbyToast.classList.contains("hidden")) return null;
  clearTimeout(toastMotionClassTimer);
  toastMotionGeneration += 1;
  lobbyToast.classList.add("hall-motion-toast");
  clearTimeout(toastTimer);
  const remaining = Math.max(0, toastDeadline - Date.now());
  const animation = lobbyToast.getAnimations().find(value => value.animationName === "lobby-toast-up");
  animation?.pause();
  toastTimer = null;
  toastDeadline = 0;
  return { revision: toastRevision, remaining, animation };
}

function resumeToastAfterHallMotion(state) {
  if (!state || state.revision !== toastRevision || lobbyToast.classList.contains("hidden")) return;
  const generation = toastMotionGeneration;
  clearTimeout(toastMotionClassTimer);
  toastMotionClassTimer = setTimeout(() => {
    if (generation === toastMotionGeneration && !hallMotion) lobbyToast.classList.remove("hall-motion-toast");
    toastMotionClassTimer = null;
  }, 260);
  if (state.remaining <= 0) {
    lobbyToast.classList.add("hidden");
    toastTimer = null;
    toastDeadline = 0;
    return;
  }
  state.animation?.play();
  scheduleToastDismiss(state.remaining, state.revision);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastTimer = null;
  toastDeadline = 0;
  toastRevision += 1;
  lobbyToast.getAnimations().filter(value => value.animationName === "lobby-toast-up").forEach(value => value.cancel());
  lobbyToast.classList.add("hidden");
  void lobbyToast.offsetWidth;
  lobbyToast.textContent = message;
  lobbyToast.classList.remove("hidden");
  scheduleToastDismiss(1500, toastRevision);
  if (hallMotion) hallMotion.toastState = pauseToastForHallMotion();
}

function showPlannedGame(game) {
  const trialPath = internalTrialPath(game);
  if (ownerPreviewMode && trialPath) {
    try {
      sessionStorage.setItem(hiddenTrialStorageKey(game), "true");
    } catch (error) {
      // The explicit preview route can still open when storage is unavailable.
    }
    const targetUrl = hiddenTrialUrl(game, trialPath);
    if (window.WeightPlayGameEntryLoader?.navigateTo?.({ url: targetUrl, gameId: game.id, title: text(game.title) })) return;
    window.location.href = targetUrl;
    return;
  }
  if (handleHiddenTrialGate(game)) return;
  window.WeightPlayAudio?.play("feedback.error");
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
  if (topicGameIds.has(game?.id)) {
    return "";
  }
  if (!game.internalTrial) return "";
  if (typeof game.internalTrial === "string") return game.internalTrial;
  return "internal-test.html?trial=1";
}

function hiddenTrialStorageKey(game) {
  return `${game.id}TrialUnlocked`;
}

const lobbyLocaleSegments = Object.freeze({
  en: "en",
  "zh-Hant": "zh-tw",
  "zh-Hans": "zh-cn",
  ja: "ja",
  ko: "ko",
  es: "es",
  "pt-BR": "pt-br",
  fr: "fr",
  de: "de",
  it: "it",
  ru: "ru",
  hi: "hi",
  ar: "ar",
});

function hiddenTrialUrl(game, trialPath) {
  const currentRoute = window.location.pathname.match(/^\/(en|zh-tw|zh-cn|ja|ko|es|pt-br|fr|de|it|ru|hi|ar)(?:\/|$)/u)?.[1];
  const localeSegment = currentRoute || lobbyLocaleSegments[i18n.locale()] || "en";
  const gameUrl = new URL(game.href || "", `${window.location.origin}/${localeSegment}/`);
  const trialUrl = new URL(trialPath, gameUrl);
  if (game.id === "animal-blockmart") trialUrl.searchParams.set("lang", i18n.locale());
  return trialUrl.href;
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
    window.WeightPlayAudio?.play("feedback.success");
    window.location.href = hiddenTrialUrl(game, trialPath);
    return true;
  }

  const timer = setTimeout(() => {
    hiddenTrialGate.counts.delete(game.id);
    hiddenTrialGate.timers.delete(game.id);
  }, hiddenTrialGate.resetMs);
  hiddenTrialGate.timers.set(game.id, timer);

  window.WeightPlayAudio?.play("ui.click");
  showToast(i18n.t("toast.coming_soon", { title: text(game.title) }));
  return true;
}

hallButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextHall = button.dataset.hallTab;
    if (nextHall === activeHall) return;
    activeHall = nextHall;
    clearDiscoverySelections({ present: false });
    // Navigation records intent immediately, never from a delayed snapshot
    // callback that could otherwise recreate a history entry after Back.
    syncDiscoveryFiltersToUrl('push');
    window.WeightPlayAudio?.play("ui.click");
    window.WonderAnalytics?.track("lobby_hall_switch", { lobby_hall: activeHall, locale: i18n.locale() });
    renderLobby({ resetScroll: true });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.ageFilter;

    window.WeightPlayAudio?.play("ui.click");
    window.WonderAnalytics?.track("age_filter", { age_filter: activeFilter, locale: i18n.locale() });
    setActiveButtons(filterButtons, "ageFilter", activeFilter);
    applyFilter({ historyMode: "push" });
  });
});

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTopic = button.dataset.topicFilter;
    activeSkill = "all";

    window.WeightPlayAudio?.play("ui.click");
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

    window.WeightPlayAudio?.play("ui.click");
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

    window.WeightPlayAudio?.play("ui.click");
    window.WonderAnalytics?.track("library_tab", { library_tab: activeLibrary, locale: i18n.locale() });
    setActiveButtons(libraryButtons, "libraryTab", activeLibrary);
    applyFilter({ historyMode: "push" });
  });
});

availabilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeAvailability = button.dataset.availabilityFilter;

    window.WeightPlayAudio?.play("ui.click");
    window.WonderAnalytics?.track("availability_filter", { availability_filter: activeAvailability, locale: i18n.locale() });
    setActiveButtons(availabilityButtons, "availabilityFilter", activeAvailability);
    applyFilter({ historyMode: "push" });
    collapseAdvancedFiltersOnPhone();
  });
});

gameSearch?.addEventListener("input", () => {
  hallSearchDisplay = undefined;
  activeSearch = normalizeSearch(gameSearch.value);
  applyFilter();
});

quickPickBtn?.addEventListener("click", () => { settleHallMotion(); openQuickPick(); });

function setupKidsLobbyPresentation() {
  if (!isKidsLobby) return;
  const shell = document.querySelector(".lobby-shell");
  const gameGrid = document.querySelector("#gameGrid");
  if (!shell || !gameGrid) return;

  const promise = document.querySelector(".kids-promise");
  const parentTrust = document.querySelector(".parent-trust-strip");
  const parentDetails = document.createElement("details");
  parentDetails.className = "kids-parent-details";
  const parentSummary = document.createElement("summary");
  parentSummary.dataset.i18n = "kids.promise.kicker";
  parentSummary.textContent = i18n.t("kids.promise.kicker");
  const parentContent = document.createElement("div");
  parentContent.className = "kids-parent-details-content";
  parentDetails.append(parentSummary, parentContent);
  [promise, parentTrust].filter(Boolean).forEach((section) => parentContent.append(section));
  if (parentContent.childElementCount) gameGrid.after(parentDetails);

  const featured = document.querySelector("#featuredGame");
  if (featured) {
    const featureStrip = document.createElement("section");
    featureStrip.className = "kids-featured-strip";
    featureStrip.setAttribute("aria-label", i18n.t("kids.portal.title"));
    featureStrip.append(featured);
    gameGrid.after(featureStrip);
  }

  const railToggle = document.createElement("button");
  railToggle.className = "kids-rail-toggle";
  railToggle.type = "button";
  railToggle.setAttribute("aria-controls", "kidsFilterRail");
  const railToggleIcon = document.createElement("span");
  railToggleIcon.setAttribute("aria-hidden", "true");
  railToggleIcon.textContent = "☰";
  const railToggleLabel = document.createElement("span");
  railToggleLabel.dataset.railToggleLabel = "true";
  railToggle.append(railToggleIcon, railToggleLabel);
  const updateRailToggleLabel = () => {
    const collapsed = document.body.classList.contains("kids-rail-collapsed");
    const key = collapsed ? "filter.show_sidebar" : "filter.hide_sidebar";
    railToggle.setAttribute("aria-expanded", String(!collapsed));
    railToggle.setAttribute("aria-label", i18n.t(key));
    railToggleLabel.dataset.i18n = key;
    railToggleLabel.textContent = i18n.t(key);
  };
  updateRailToggleLabel();
  shell.append(railToggle);
  railToggle.addEventListener("click", () => {
    document.body.classList.toggle("kids-rail-collapsed");
    updateRailToggleLabel();
    window.WeightPlayAudio?.play("ui.click");
  });

  const filterRail = document.querySelector("#kidsFilterRail");
  if (filterRail) {
    const railLibrary = filterRail.querySelector(".rail-library");
    const filterGroups = [...filterRail.querySelectorAll(":scope > .desktop-filter-group")];
    const filterPanel = document.createElement("div");
    filterPanel.className = "kids-advanced-filter-panel";
    filterPanel.id = "kidsAdvancedFilterPanel";
    filterPanel.hidden = true;
    filterGroups.forEach((group) => filterPanel.append(group));

    const advancedToggle = document.createElement("button");
    advancedToggle.className = "kids-advanced-filter-toggle";
    advancedToggle.type = "button";
    advancedToggle.setAttribute("aria-controls", filterPanel.id);
    const advancedToggleLabel = document.createElement("span");
    const updateAdvancedToggleLabel = (expanded = !filterPanel.hidden) => {
      const key = expanded ? "filter.fewer_filters" : "filter.more_filters";
      advancedToggle.setAttribute("aria-expanded", String(expanded));
      advancedToggle.setAttribute("aria-label", i18n.t(key));
      advancedToggleLabel.dataset.i18n = key;
      advancedToggleLabel.textContent = i18n.t(key);
    };
    advancedToggle.append(advancedToggleLabel);
    updateAdvancedToggleLabel(false);
    if (railLibrary) railLibrary.after(advancedToggle, filterPanel);
    else filterRail.prepend(advancedToggle, filterPanel);

    advancedToggle.addEventListener("click", () => {
      filterPanel.hidden = !filterPanel.hidden;
      updateAdvancedToggleLabel();
      window.WeightPlayAudio?.play("ui.click");
    });
    window.addEventListener("wonder:locale-change", () => {
      updateAdvancedToggleLabel();
      updateRailToggleLabel();
    });
  }
}

document.querySelectorAll("[data-reset-discovery]").forEach((button) => {
  button.addEventListener("click", resetDiscoveryFilters);
});

localeSelect.addEventListener("change", () => {
  window.WeightPlayAudio?.play("ui.click");
  i18n.setLocale(localeSelect.value);
});

window.addEventListener("wonder:locale-change", renderLobby);
window.addEventListener("pagehide", () => { settleHallMotion(); activeGamePreview?.releaseLobbyPreview(); });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    settleHallMotion();
    activeGamePreview?.releaseLobbyPreview();
  }
});

window.addEventListener("popstate", () => {
  restoreDiscoveryFiltersFromUrl({ present: false });
  renderLobby();
});

restoreDiscoveryFiltersFromUrl();
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  const nextRecent = readRecentGames();
  if (JSON.stringify(nextRecent) === JSON.stringify(recentGameIds)) return;
  recentGameIds = nextRecent;
  renderLobbyContent();
});
setupKidsLobbyPresentation();
renderLobby();
loadGameStats();
if (!document.querySelector('[data-wp-game-entry-loader-bootstrap="true"]')) {
  const entryLoaderScript = document.createElement("script");
  entryLoaderScript.src = "/src/game-entry-loader.js?v=20261025-style-ready-before-paint1";
  entryLoaderScript.dataset.wpGameEntryLoaderBootstrap = "true";
  document.head.append(entryLoaderScript);
}
if (!isKidsLobby) {
  fetch("src/lobby-release-history.json", { cache: "no-cache" })
    .then((response) => { if (!response.ok) throw new Error("Release history unavailable"); return response.json(); })
    .then((history) => {
      if (history.schemaVersion !== 1 || !history.firstPublished || Array.isArray(history.firstPublished)) return;
      firstPublicDates = history.firstPublished;
      renderLatestGames();
      applyFilter(); // Respect a filter selected while metadata was loading.
    }).catch(() => { /* No invented dates or retries; the full catalog still works. */ });
}
window.WonderAnalytics?.track("lobby_ready", {
  playable_games: lobby.games.filter((game) => game.status === "playable").length,
  total_games: lobby.games.length,
  lobby_hall: isKidsLobby ? "kids" : activeHall,
  platform: lobby.platform.name,
  locale: i18n.locale(),
});
