// BEGIN generated from src/lobby-data.js audiences.tabletopGameIds; run scripts/sync-tabletop-classification.mjs
if (!window.__weightPlayTabletopGameIds) window.__weightPlayTabletopGameIds = new Set(["klondike-solitaire","spider-solitaire","freecell-solitaire","pyramid-solitaire","tripeaks-solitaire","golf-solitaire","yukon-solitaire","hearts","spades","gin-rummy","crazy-eights","cribbage","go-fish","war","speed","old-maid","casino","checkers","tic-tac-toe","peg-solitaire","reversi","four-in-a-row","chess","mahjong-solitaire"]);
// END generated tabletop classification
// BEGIN generated from src/lobby-data.js audiences.castleBlockRewardExcludedGameIds; run scripts/sync-tabletop-classification.mjs
if (!window.__weightPlayCastleBlockRewardExcludedGameIds) window.__weightPlayCastleBlockRewardExcludedGameIds = new Set(["animal-crownfall"]);
// END generated Castle Block reward exclusions
(function () {
  if (window.WonderAnalytics) return;
  const config = window.WONDER_SITE?.analytics || {};
  const gaMeasurementId = config.gaMeasurementId || "";
  const productionHost = ["weightplay.com", "www.weightplay.com"].includes(
    String(location.hostname || "").toLowerCase().replace(/\.$/, ""),
  );
  const query = new URLSearchParams(location.search || "");
  const testContext = /(?:^|\/)(?:internal-test|preview|qa)(?:[./]|$)/i.test(location.pathname)
    || ["preview", "trial", "qa", "test", "lobbyPreview", "lobby-preview"].some((key) => query.has(key))
    || window.parent !== window;
  let analyticsEnabled = config.enabled !== false;
  const googleAnalyticsEnabled = () => Boolean(gaMeasurementId) && productionHost && !testContext
    && analyticsEnabled && config.enabled !== false && !window[`ga-disable-${gaMeasurementId}`];
  if (gaMeasurementId && (!productionHost || testContext)) window[`ga-disable-${gaMeasurementId}`] = true;
  const debug = config.debug !== false;
  const countKey = "wonderAnalyticsCounts";
  let lifecycleOwner = false;
  let roundClearReported = false;
  let activeStageId = null;
  let pendingStageId = null;
  const privacySafeKeys = new Set([
    "game_id", "game_version", "interface_version", "locale", "viewport_bucket", "input_type",
    "screen", "arena", "from", "entry", "action", "tool", "outcome", "to_locale", "snapshot",
    "tracking_version", "time_model", "screen_time_sec", "active_play_time_sec",
  ]);
  const privacySafeToken = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

  function loadCounts() {
    try {
      const value = JSON.parse(localStorage.getItem(countKey));
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function saveLocalCount(name) {
    const counts = loadCounts();
    counts[name] = (Number(counts[name]) || 0) + 1;
    try { localStorage.setItem(countKey, JSON.stringify(counts)); } catch { /* Optional storage. */ }
  }
  function emit(name, payload) {
    if (!analyticsEnabled || config.enabled === false) return;
    try {
      saveLocalCount(name);
      if (googleAnalyticsEnabled() && typeof window.gtag === "function") window.gtag("event", name, payload);
      if (debug) console.info("[WonderAnalytics]", name, payload);
    } catch { /* Analytics must never interrupt a game. */ }
  }
  function announceCastleReward(detail) {
    const notify = () => window.dispatchEvent(new CustomEvent("weightplay:castle-reward", { detail }));
    notify();
    if (!window.WeightPlayCastle) window.addEventListener("weightplay:castle-ready", notify, { once: true });
  }
  function reportedStageId(params = {}) {
    return params.stage_id ?? params.level_id ?? params.stage ?? params.level ?? params.room_id ?? params.room ?? params.floor_id ?? params.floor ?? params.chapter_id ?? params.chapter ?? params.start_stage;
  }
  function rememberStageId(params = {}) {
    const stageId = reportedStageId(params);
    if ((typeof stageId === "string" || typeof stageId === "number") && String(stageId).trim()) {
      activeStageId = stageId;
      if (!params.tracking_version) pendingStageId = stageId;
    }
  }
  function beginReportedRound(name, params = {}) {
    roundClearReported = false;
    const stageId = reportedStageId(params);
    if ((typeof stageId === "string" || typeof stageId === "number") && String(stageId).trim()) rememberStageId(params);
    else if (name === "game_start" && !params.tracking_version) { activeStageId = null; pendingStageId = null; }
  }
  // Domain-separated, local-only collections. A completion reaches exactly
  // one domain through a canonical lobby launch marker; no collection balance
  // can be exchanged with the Block World store or the global wallet.
  const collectionDomainConfig = {
    tabletop: { key: "weightplayTabletopCollectionV1", version: 1, fresh: () => ({ version: 1, eventIds: [], eventGames: [], equipped: {} }) },
    kids: { key: "weightplayKidsStickerAlbumV1", version: 1, fresh: () => ({ version: 1, eventIds: [], eventGames: [], layout: { pages: [{ pageId: "meadow", stickers: [], decorationId: null }, { pageId: "stars", stickers: [], decorationId: null }] } }) },
  };
  const collectionModules = new Map();
  const collectionStrings = {
    en: { tabletop: "Open tabletop collection", kids: "Open animal sticker album", notice: "Collection progress saved. Open your collection to see what is new." },
    "zh-Hant": { tabletop: "打開棋室收藏櫃", kids: "打開動物貼紙冊", notice: "收藏進度已儲存，打開收藏查看新內容。" },
    "zh-Hans": { tabletop: "打开棋室收藏柜", kids: "打开动物贴纸册", notice: "收藏进度已保存，打开收藏查看新内容。" },
    ja: { tabletop: "テーブルゲームのコレクション", kids: "どうぶつシールアルバムを開く", notice: "コレクションの進行状況を保存しました。新しい内容を確認しましょう。" },
    ko: { tabletop: "테이블 게임 컬렉션 열기", kids: "동물 스티커 앨범 열기", notice: "수집 진행 상황을 저장했어요. 새 항목을 확인해 보세요." },
    es: { tabletop: "Abrir colección de mesa", kids: "Abrir álbum de pegatinas", notice: "Progreso guardado. Abre tu colección para ver las novedades." },
    "pt-BR": { tabletop: "Abrir coleção de mesa", kids: "Abrir álbum de adesivos", notice: "Progresso salvo. Abra a coleção para ver as novidades." },
    fr: { tabletop: "Ouvrir la collection de table", kids: "Ouvrir l’album d’autocollants", notice: "Progression enregistrée. Ouvrez votre collection pour voir les nouveautés." },
    de: { tabletop: "Tischspiel-Sammlung öffnen", kids: "Tierstickeralbum öffnen", notice: "Fortschritt gespeichert. Öffne deine Sammlung für Neuigkeiten." },
    it: { tabletop: "Apri la collezione da tavolo", kids: "Apri l’album di adesivi", notice: "Progressi salvati. Apri la collezione per vedere le novità." },
    ru: { tabletop: "Открыть коллекцию настольных игр", kids: "Открыть альбом с наклейками", notice: "Прогресс сохранён. Откройте коллекцию, чтобы увидеть новое." },
    hi: { tabletop: "टेबलटॉप संग्रह खोलें", kids: "जानवरों का स्टिकर एल्बम खोलें", notice: "प्रगति सहेजी गई। नया देखने के लिए संग्रह खोलें।" },
    ar: { tabletop: "افتح مجموعة ألعاب الطاولة", kids: "افتح ألبوم ملصقات الحيوانات", notice: "حُفظ التقدم. افتح المجموعة لرؤية الجديد." },
  };
  const collectionLocale = () => {
    const value = window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || document.documentElement.lang || "en";
    if (collectionStrings[value]) return value;
    const lower = String(value).toLowerCase();
    return lower.startsWith("zh") ? (lower.includes("hans") || lower.includes("cn") ? "zh-Hans" : "zh-Hant") : lower.startsWith("pt") ? "pt-BR" : collectionStrings[lower] ? lower : "en";
  };
  function emptyCollection(domain) { return collectionDomainConfig[domain].fresh(); }
  function readCollection(domain) {
    const spec = collectionDomainConfig[domain];
    try {
      const value = JSON.parse(localStorage.getItem(spec.key) || "null");
      if (!value || value.version !== spec.version || !Array.isArray(value.eventIds) || !Array.isArray(value.eventGames)) return emptyCollection(domain);
      const state = { ...emptyCollection(domain), ...value, version: spec.version };
      state.eventIds = [...new Set(value.eventIds.filter(x => typeof x === "string" && x.length <= 192))].slice(-256);
      state.eventGames = [...new Set(value.eventGames.filter(x => typeof x === "string" && /^[a-z0-9][a-z0-9-]{0,63}$/i.test(x)))].slice(0, 256);
      if (domain === "tabletop") state.equipped = value.equipped && typeof value.equipped === "object" ? value.equipped : {};
      if (domain === "kids") state.layout = normalizeAlbumLayout(value.layout);
      return state;
    } catch { return emptyCollection(domain); }
  }
  function normalizeAlbumLayout(value) {
    const source = value && Array.isArray(value.pages) ? value.pages : [];
    const defaults = collectionDomainConfig.kids.fresh().layout.pages;
    const pages = defaults.map((fallback, index) => {
      const page = source.find(item => item?.pageId === fallback.pageId) || source[index] || fallback;
      const stickers = Array.isArray(page?.stickers) ? page.stickers.slice(0, 5).filter(sticker =>
        typeof sticker?.itemId === "string" && /^kids:sticker:[a-z0-9-]{1,48}$/.test(sticker.itemId))
        .map(sticker => ({ itemId: sticker.itemId, x: Math.max(5, Math.min(95, Number(sticker.x) || 50)), y: Math.max(10, Math.min(88, Number(sticker.y) || 50)), rotation: Math.max(-20, Math.min(20, Number(sticker.rotation) || 0)) })) : [];
      return { pageId: fallback.pageId, stickers, decorationId: ["kids:decor:stars", "kids:decor:meadow"].includes(page?.decorationId) ? page.decorationId : null };
    });
    return { pages };
  }
  async function withCollectionLock(domain, action) {
    const lockName = `weightplay-collection-${domain}-v1`;
    if (navigator.locks?.request) return navigator.locks.request(lockName, action);
    const lockKey = "weightplayCollectionTxnLockV1", token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let acquired = false;
    for (let attempt = 0; attempt < 90; attempt += 1) {
      try {
        const current = JSON.parse(localStorage.getItem(lockKey) || "null");
        if (!current || Number(current.expires) < Date.now()) {
          localStorage.setItem(lockKey, JSON.stringify({ token, domain, expires: Date.now() + 4000 }));
          acquired = JSON.parse(localStorage.getItem(lockKey) || "null")?.token === token;
          if (acquired) break;
        }
      } catch { throw new Error("collection-storage-unavailable"); }
      await new Promise(resolve => setTimeout(resolve, 18 + Math.floor(Math.random() * 24)));
    }
    if (!acquired) throw new Error("collection-lock-timeout");
    try { return await action(); }
    finally { try { if (JSON.parse(localStorage.getItem(lockKey) || "null")?.token === token) localStorage.removeItem(lockKey); } catch { /* Keep saved collection state; stale lease expires. */ } }
  }
  function unlockedCollectionIds(domain, state = readCollection(domain)) {
    const module = collectionModules.get(domain), count = state.eventGames.length;
    return module ? module.items.filter(item => item.unlock?.kind === "uniqueGames" && count >= Number(item.unlock.count)).map(item => item.id) : [];
  }
  async function writeCollection(domain, mutate) {
    return withCollectionLock(domain, async () => {
      const spec = collectionDomainConfig[domain];
      const state = readCollection(domain);
      const outcome = mutate(state);
      if (outcome === false) return false;
      try { localStorage.setItem(spec.key, JSON.stringify(state)); }
      catch { return false; }
      window.dispatchEvent(new CustomEvent("WeightPlayCollectionsUpdated", { detail: { domain } }));
      return state;
    });
  }
  function registerCollectionModule(module) {
    if (!module || !collectionDomainConfig[module.id] || !Array.isArray(module.items) || typeof module.render !== "function") return false;
    if (module.items.some(item => !item.id?.startsWith(`${module.id}:`) || item.unlock?.kind !== "uniqueGames" || !Number.isInteger(Number(item.unlock.count)))) return false;
    collectionModules.set(module.id, module);
    ensureCollectionLauncher();
    window.dispatchEvent(new Event("WeightPlayCollectionsReady"));
    return true;
  }
  const collectionScriptPromises = new Map();
  function ensureCollectionModule(domain) {
    if (collectionModules.has(domain)) return Promise.resolve(collectionModules.get(domain));
    if (!collectionDomainConfig[domain]) return Promise.resolve(null);
    if (collectionScriptPromises.has(domain)) return collectionScriptPromises.get(domain);
    const promise = new Promise(resolve => {
      const script = document.createElement("script");
      script.src = `/src/${domain === "kids" ? "kids-collection" : "tabletop-collection"}.js?v=20261002-collections-v2`;
      script.async = true; script.dataset.weightplayCollectionModule = domain;
      script.onload = () => resolve(collectionModules.get(domain) || null);
      script.onerror = () => resolve(null);
      document.head.append(script);
    });
    collectionScriptPromises.set(domain, promise);
    return promise;
  }
  function currentLobbyDomain() {
    if (!document.body?.classList.contains("lobby-page")) return null;
    const audience = document.body.dataset.audience;
    if (audience === "kids") return "kids";
    // The tabletop module may be loaded for the whole General lobby, but its
    // launcher and modal belong only to the Cards & Board hall.
    const requestedHall = new URLSearchParams(location.search).get("hall");
    const hall = document.body.dataset.gameHall || (requestedHall === "tabletop" || requestedHall === "topics" ? requestedHall : "games");
    return audience === "general" && hall === "tabletop" ? "tabletop" : null;
  }
  function publicLobbyGame(id) {
    const lobby = window.WONDER_LOBBY, game = lobby?.games?.find(value => value?.id === id);
    return Boolean(game && game.status === "playable" && !game.internalOnly);
  }
  function topicGameIds() {
    const lobby = window.WONDER_LOBBY;
    return new Set(lobby?.audiences?.topicGameIds || lobby?.topicGameIds || []);
  }
  function hallAtLaunch(surface, gameId) {
    if (topicGameIds().has(gameId)) return "topic";
    const topicSurface = surface?.closest?.('[data-topic-hall], [data-hall="topic"], [data-hall-tab="topic"], [data-hall-tab="topics"], [data-hall="topics"], [data-topic-game], .topic-hall, .hot-meme-hall');
    if (topicSurface) return "topic";
    const lobby = window.WONDER_LOBBY;
    const general = new Set(lobby?.audiences?.generalGameIds || []);
    const tabletop = new Set(lobby?.audiences?.tabletopGameIds || []);
    if (document.body.dataset.audience === "kids") return publicLobbyGame(gameId) && !general.has(gameId) && !tabletop.has(gameId) ? "kids" : "ineligible";
    if (!publicLobbyGame(gameId) || !general.has(gameId)) return "ineligible";
    return tabletop.has(gameId) ? "tabletop" : "general";
  }
  function recordLobbyLaunch(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href*="/games/"]');
    const card = event.target.closest?.('#gameGrid > [data-game-id]');
    const grid = document.querySelector("#gameGrid");
    const surface = card || anchor?.closest?.('#gameGrid > [data-game-id]');
    if (!grid || !(surface ? grid.contains(surface) : anchor && grid.contains(anchor))) return;
    const gameId = surface?.dataset.gameId || anchor?.closest?.('[data-game-id]')?.dataset.gameId || new URL(anchor.href, location.href).pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1];
    if (!gameId) return;
    const lobbyGame = window.WONDER_LOBBY?.games?.find(value => value?.id === gameId);
    const rawPath = anchor?.href || lobbyGame?.href;
    if (!rawPath) return;
    let path;
    try {
      const target = new URL(rawPath, document.baseURI);
      const localized = window.WonderI18n?.localizedPath?.(window.WonderI18n.actualLocale(), `${target.pathname}${target.search}${target.hash}`) || `${target.pathname}${target.search}${target.hash}`;
      path = new URL(localized, target.origin).pathname.replace(/\/+$/, "") + "/";
    } catch { return; }
    if (path.match(/(?:^|\/)games\/([^/]+)\/$/i)?.[1] !== gameId) return;
    const domain = hallAtLaunch(surface || anchor, gameId);
    try {
      if (domain === "ineligible") { sessionStorage.removeItem("weightplayCollectionLaunchV1"); return; }
      sessionStorage.setItem("weightplayCollectionLaunchV1", JSON.stringify({ version: 1, domain, gameId, path, launchedAt: Date.now() }));
    } catch { /* An unavailable launch marker means this completion earns no collection progress. */ }
  }
  function currentLaunchDomain(gameId) {
    try {
      const marker = JSON.parse(sessionStorage.getItem("weightplayCollectionLaunchV1") || "null");
      const currentPath = location.pathname.replace(/\/+$/, "") + "/";
      const routeId = window.WONDER_SITE?.gameIdFromPath?.(location.pathname) || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
      const query = new URLSearchParams(location.search || "");
      if (["preview", "trial", "qa", "test"].some(key => query.has(key)) || marker?.version !== 1 || marker.gameId !== gameId || marker.gameId !== routeId || marker.path !== currentPath || Date.now() - Number(marker.launchedAt) > 8 * 60 * 60 * 1000) return null;
      return ["tabletop", "kids", "general", "topic"].includes(marker.domain) ? marker.domain : null;
    } catch { return null; }
  }
  async function recordCollectionCompletion(domain, gameId, completionId) {
    const config = collectionDomainConfig[domain];
    if (!config || !/^[a-z0-9][a-z0-9-]{0,63}$/i.test(gameId) || !completionId) return { credited: false, reason: "invalid" };
    await ensureCollectionModule(domain);
    const eventId = `collection-v1:${domain}:${gameId}:first-clear`;
    const priorState = readCollection(domain), previous = priorState.eventGames.length;
    const saved = await writeCollection(domain, state => {
      if (state.eventIds.includes(eventId) || state.eventGames.includes(gameId)) return false;
      state.eventIds.push(eventId); state.eventGames.push(gameId);
      if (domain === "kids") state.layout = normalizeAlbumLayout(state.layout);
      return true;
    });
    if (!saved) return { credited: false, reason: "duplicate-or-storage-unavailable" };
    const previousState = { ...saved, eventGames: saved.eventGames.slice(0, previous) };
    const thresholdReached = unlockedCollectionIds(domain, saved).length > unlockedCollectionIds(domain, previousState).length;
    const detail = { domain, gameId, completionId, eventId, progress: saved.eventGames.length, newItem: thresholdReached };
    window.dispatchEvent(new CustomEvent("weightplay:collection-earned", { detail }));
    return { credited: true, eventId, progress: saved.eventGames.length, newItem: thresholdReached };
  }
  async function saveCollectionEquipment(domain, patch) {
    if (domain !== "tabletop" || !patch || typeof patch !== "object") return false;
    const module = collectionModules.get(domain), ids = new Set(unlockedCollectionIds(domain));
    const allowed = new Map((module?.items || []).map(item => [item.id, item.type]));
    const entries = Object.entries(patch);
    if (entries.length !== 1 || !entries.every(([slot, id]) => ["cardBack", "table"].includes(slot) && typeof id === "string" && ids.has(id) && allowed.get(id) === slot)) return false;
    const saved = await writeCollection(domain, state => { state.equipped = { ...state.equipped, ...patch }; });
    if (saved) window.dispatchEvent(new CustomEvent("WeightPlayTabletopThemeChanged", { detail: saved.equipped }));
    return Boolean(saved);
  }
  async function saveKidsAlbumLayout(layout) {
    const allowed = new Set(unlockedCollectionIds("kids"));
    const next = normalizeAlbumLayout(layout);
    for (const page of next.pages) {
      const unique = new Set();
      for (const sticker of page.stickers) {
        if (!allowed.has(sticker.itemId) || unique.has(sticker.itemId)) return false;
        unique.add(sticker.itemId);
      }
      if (page.decorationId && !allowed.has(page.decorationId)) return false;
    }
    return Boolean(await writeCollection("kids", state => { state.layout = next; }));
  }
  function showCollectionNotice(domain, text) {
    const old = document.querySelector("[data-wp-collection-notice]"); old?.remove();
    const node = document.createElement("div");
    node.dataset.wpCollectionNotice = domain; node.setAttribute("role", "status"); node.setAttribute("aria-live", "polite");
    node.textContent = text; Object.assign(node.style, { position: "fixed", zIndex: "1200", insetInline: "max(12px,env(safe-area-inset-left))", bottom: "max(12px,env(safe-area-inset-bottom))", maxWidth: "min(520px,calc(100vw - 24px))", marginInline: "auto", padding: "14px 18px", borderRadius: "14px", background: domain === "kids" ? "#fff0a9" : "#302216", color: domain === "kids" ? "#263b28" : "#fff0dc", boxShadow: "0 8px 30px #0005", font: "600 16px/1.4 system-ui,sans-serif" });
    document.body.append(node); setTimeout(() => node.remove(), 6500);
  }
  function refreshTabletopTheme() {
    if (!document.body || !/(?:^|\/)games\/[^/]+\/?$/i.test(location.pathname)) return;
    const gameId = window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
    if (currentLaunchDomain(gameId) !== "tabletop") return;
    const state = readCollection("tabletop"), equipped = state.equipped || {};
    document.body.dataset.wpCollectionTable = equipped.table || "";
    document.body.dataset.wpCollectionCardBack = equipped.cardBack || "";
    document.body.classList.add("wp-collection-active");
    if (!document.querySelector("[data-weightplay-tabletop-bridge]")) {
      const script = document.createElement("script"); script.src = "/src/tabletop-collection-bridge.js?v=20261002-collections-v2"; script.dataset.weightplayTabletopBridge = "true"; script.async = true; document.head.append(script);
    } else window.WeightPlayTabletopThemeBridge?.refresh?.();
  }
  let collectionDialog, collectionDialogContent, collectionOpener, collectionDomain, collectionHistoryState = false;
  function ensureCollectionLauncher() {
    const domain = currentLobbyDomain(), module = domain && collectionModules.get(domain);
    const grid = document.querySelector("#gameGrid");
    const existing = document.querySelector("[data-weightplay-collection-entry]");
    if (!domain || !module || !grid) {
      if (collectionDomain && collectionDomain !== domain) {
        closeCollection(false);
        discardInvalidCollectionHistory();
      }
      existing?.remove();
      return;
    }
    if (existing?.dataset.weightplayCollectionEntry === domain) return;
    existing?.remove();
    const locale = collectionLocale(), copy = collectionStrings[locale], entry = document.createElement("section");
    entry.dataset.weightplayCollectionEntry = domain; entry.setAttribute("aria-label", copy[domain]);
    Object.assign(entry.style, { margin: "22px auto", maxWidth: "1100px", padding: "clamp(16px,3vw,24px)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", background: domain === "kids" ? "linear-gradient(135deg,#d8f2bb,#fff0a8 55%,#f7c4a1)" : "linear-gradient(135deg,#271c14,#4a3221)", border: domain === "kids" ? "2px solid #7cae70" : "1px solid #846542", color: domain === "kids" ? "#23432d" : "#fff1d8" });
    const label = document.createElement("strong"); label.textContent = copy[domain]; label.style.font = "700 clamp(1.05rem,3vw,1.35rem)/1.25 system-ui,sans-serif";
    const button = document.createElement("button"); button.type = "button"; button.textContent = copy[domain]; button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-label", copy[domain]);
    Object.assign(button.style, { minHeight: "48px", minWidth: "180px", padding: "10px 18px", border: "0", borderRadius: "12px", background: domain === "kids" ? "#277a54" : "#c69b58", color: domain === "kids" ? "white" : "#21170d", font: "700 16px/1.2 system-ui,sans-serif", cursor: "pointer" });
    button.addEventListener("click", () => openCollection(domain, button));
    entry.append(label, button);
    const toast = document.querySelector("#lobbyToast");
    if (toast?.parentNode) toast.parentNode.insertBefore(entry, toast); else grid.after(entry);
  }
  if (document.body && typeof MutationObserver !== "undefined") {
    new MutationObserver(ensureCollectionLauncher).observe(document.body, { attributes: true, attributeFilter: ["data-game-hall", "data-audience"] });
  }
  function trapCollectionFocus(event) {
    if (event.key === "Escape") { event.preventDefault(); closeCollection(true); return; }
    if (event.key !== "Tab" || !collectionDialog) return;
    const focusable = [...collectionDialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node => node.offsetParent !== null);
    if (!focusable.length) { event.preventDefault(); collectionDialog.focus(); return; }
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === collectionDialog)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function openCollection(domain, opener, { historyMode = "push" } = {}) {
    if (!collectionModules.has(domain) || currentLobbyDomain() !== domain) return;
    if (!collectionDialog) {
      collectionDialog = document.createElement("div"); collectionDialog.className = "wpc-overlay"; collectionDialog.tabIndex = -1; collectionDialog.setAttribute("role", "dialog"); collectionDialog.setAttribute("aria-modal", "true");
      Object.assign(collectionDialog.style, { position: "fixed", inset: "0", zIndex: "1190", display: "grid", placeItems: "center", padding: "max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom))", background: "#090908d9", backdropFilter: "blur(5px)" });
      const panel = document.createElement("div"); panel.className = "wpc-panel"; Object.assign(panel.style, { width: "min(920px,100%)", maxHeight: "min(94dvh,900px)", overflow: "auto", borderRadius: "20px", outline: "none" });
      collectionDialogContent = document.createElement("div"); collectionDialogContent.className = "wpc-content"; panel.append(collectionDialogContent); collectionDialog.append(panel); document.body.append(collectionDialog);
      collectionDialog.addEventListener("keydown", trapCollectionFocus);
      collectionDialog.addEventListener("click", event => { if (event.target === collectionDialog) closeCollection(true); });
    }
    collectionDomain = domain; collectionOpener = opener || document.activeElement;
    collectionHistoryState = historyMode === "push" || historyMode === "restore";
    try {
      if (historyMode === "push") history.pushState({ ...(history.state || {}), weightplayCollection: domain }, "", `${location.pathname}${location.search}#collection`);
      else if (historyMode === "direct") history.replaceState({ ...(history.state || {}), weightplayCollection: domain }, "", `${location.pathname}${location.search}#collection`);
    } catch { collectionHistoryState = false; }
    renderCollection(); collectionDialog.hidden = false; collectionDialog.style.display = "grid";
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => collectionDialog?.querySelector("button:not([disabled])")?.focus({ preventScroll: true }) || collectionDialog?.focus({ preventScroll: true }));
  }
  function renderCollection() {
    if (!collectionDomain || !collectionDialogContent) return;
    const module = collectionModules.get(collectionDomain); if (!module) return;
    const state = readCollection(collectionDomain), locale = collectionLocale(), rtl = locale === "ar";
    collectionDialogContent.replaceChildren();
    module.render(collectionDialogContent, {
      locale, rtl, state, progress: state.eventGames.length, unlockedIds: unlockedCollectionIds(collectionDomain, state),
      onEquip: patch => saveCollectionEquipment(collectionDomain, patch).then(ok => { if (ok) renderCollection(); return ok; }),
      onLayout: layout => saveKidsAlbumLayout(layout),
      onClose: () => closeCollection(true),
      announce: message => { const live = collectionDialogContent.querySelector("[data-wpc-live]"); if (live) live.textContent = String(message || ""); },
    });
    collectionDialog.setAttribute("aria-label", collectionModules.get(collectionDomain)?.items?.[0]?.name?.[locale] || "Collection");
  }
  function closeCollection(useHistory) {
    if (!collectionDialog || collectionDialog.hidden) return;
    if (useHistory && collectionHistoryState && history.state?.weightplayCollection) {
      collectionHistoryState = false; history.back(); return;
    }
    if (useHistory && location.hash === "#collection") discardInvalidCollectionHistory();
    collectionDialog.hidden = true; collectionDialog.style.display = "none"; document.documentElement.style.overflow = "";
    collectionDomain = null; collectionHistoryState = false;
    collectionOpener?.focus?.({ preventScroll: true }); collectionOpener = null;
  }
  function discardInvalidCollectionHistory() {
    if (location.hash !== "#collection") return;
    try {
      const state = { ...(history.state || {}) };
      delete state.weightplayCollection;
      history.replaceState(state, "", `${location.pathname}${location.search}`);
    } catch { /* The collection remains closed even if history is unavailable. */ }
    collectionHistoryState = false;
  }
  function syncCollectionHistory() {
    const domain = currentLobbyDomain();
    const requested = history.state?.weightplayCollection;
    if (requested && requested === domain && collectionModules.has(domain)) {
      if (!collectionDialog || collectionDialog.hidden || collectionDomain !== domain) openCollection(domain, document.querySelector(`[data-weightplay-collection-entry="${domain}"] button`), { historyMode: "restore" });
      return;
    }
    if (collectionDialog && !collectionDialog.hidden) closeCollection(false);
    // Direct #collection navigation is meaningful only in the tabletop hall;
    // history entries created by a collection button also carry the domain.
    if (location.hash === "#collection" && domain === "tabletop" && collectionModules.has(domain)) {
      openCollection(domain, document.querySelector(`[data-weightplay-collection-entry="${domain}"] button`), { historyMode: "direct" });
      return;
    }
    if (location.hash === "#collection" && domain !== "tabletop") discardInvalidCollectionHistory();
  }
  window.addEventListener("popstate", () => queueMicrotask(() => syncCollectionHistory()));
  window.addEventListener("hashchange", () => queueMicrotask(() => syncCollectionHistory()));
  window.addEventListener("storage", event => {
    const domains = Object.entries(collectionDomainConfig).filter(([, value]) => event.key === value.key).map(([domain]) => domain);
    domains.forEach(domain => { if (domain === collectionDomain) renderCollection(); });
    if (event.key === "weightplayCollectionLaunchV1") refreshTabletopTheme();
  });
  window.addEventListener("WeightPlayTabletopThemeChanged", refreshTabletopTheme);
  function loadCollectionModules() {
    if (document.body?.classList.contains("lobby-page")) {
      const domain = document.body.dataset.audience === "kids" ? "kids" : "tabletop";
      ensureCollectionModule(domain).then(() => { ensureCollectionLauncher(); syncCollectionHistory(); });
      return;
    }
    const gameId = window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
    const domain = currentLaunchDomain(gameId);
    if (domain === "tabletop" || domain === "kids") ensureCollectionModule(domain).then(() => { if (domain === "tabletop") refreshTabletopTheme(); });
  }
  window.WeightPlayCollections = Object.freeze({
    register: registerCollectionModule,
    read: readCollection,
    unlockedIds: unlockedCollectionIds,
    saveEquipment: saveCollectionEquipment,
    saveAlbumLayout: saveKidsAlbumLayout,
  });
  window.addEventListener("click", recordLobbyLaunch, { capture: true });
  loadCollectionModules();
  function isSuccessfulOutcome(outcome) {
    return ["complete", "win", "won", "success", "victory", "clear"].includes(String(outcome || "").toLowerCase());
  }
  function awardCompletedRound(params = {}) {
    if (roundClearReported) return { credited: false, reason: "already-reported-this-round" };
    roundClearReported = true;
    const gameId = String(params.game_id || params.gameId || window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "").trim();
    const routeGameId = window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
    if (!routeGameId || gameId.toLowerCase() !== routeGameId.toLowerCase()) return { credited: false, reason: "route-game-mismatch" };
    const stageId = reportedStageId(params);
    const normalized = stageId == null && activeStageId != null ? { ...params, stage_id: activeStageId } : params;
    const completionId = stageId == null ? "first-completion" : `stage-${String(stageId).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 54).replace(/^stage-/, "")}`;
    if (["stage-endless", "stage-infinite", "stage-survival"].includes(completionId)) return { credited: false, reason: "non-stage-clear" };
    const domain = currentLaunchDomain(gameId);
    if (domain === "tabletop" || domain === "kids") {
      recordCollectionCompletion(domain, gameId, completionId).then(result => {
        if (result.credited && result.newItem) showCollectionNotice(domain, collectionStrings[collectionLocale()].notice);
      }).catch(() => {});
      return { credited: true, domain, completionId };
    }
    if (domain === "topic") return { credited: false, reason: "topic-hall-excluded" };
    if (!domain && document.body?.dataset.audience === "kids") return { credited: false, reason: "kids-launch-context-required" };
    if (domain === "general" && topicGameIds().has(gameId)) return { credited: false, reason: "topic-hall-excluded" };
    return creditCastleFirstClear(normalized);
  }
  function creditCastleFirstClear(params = {}) {
    const outcome = String(params.outcome || "").toLowerCase();
    if (params.cleared === false || params.success === false || params.won === false || ["fail", "failed", "loss", "lose", "defeat"].includes(outcome)) return { credited: false, reason: "not-cleared" };
    const gameId = String(params.game_id || params.gameId || window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "").trim();
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/i.test(gameId)) return { credited: false, reason: "invalid-game" };
    const domain = currentLaunchDomain(gameId);
    if (domain === "tabletop" || domain === "kids" || domain === "topic" || (!domain && document.body?.dataset.audience === "kids")) return { credited: false, reason: `${domain || "kids"}-collection-owned` };
    if (domain === "general" && topicGameIds().has(gameId)) return { credited: false, reason: "topic-hall-excluded" };
    if (window.__weightPlayTabletopGameIds.has(gameId.toLowerCase())) return { credited: false, reason: "tabletop-excluded" };
    if (window.__weightPlayCastleBlockRewardExcludedGameIds.has(gameId.toLowerCase())) return { credited: false, reason: "game-reward-excluded" };
    const rawStage = reportedStageId(params);
    const stageText = typeof rawStage === "string" || typeof rawStage === "number" ? String(rawStage).trim() : "";
    const normalizedStage = stageText.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(0, 54);
    const completionId = stageText
      ? (normalizedStage.startsWith("stage-") ? normalizedStage : `stage-${normalizedStage}`)
      : "first-completion";
    if (["stage-", "stage-endless", "stage-infinite", "stage-survival"].includes(completionId)) return { credited: false, reason: "non-stage-clear" };
    if (window.WeightPlayCastle?.creditFirstClear) {
      return window.WeightPlayCastle.creditFirstClear(gameId, completionId);
    }
    try {
      const key = "weightplayCastleV1";
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      const validSaved = saved && [1, 2].includes(saved.version);
      const legacySand = Math.max(0, Math.floor(Number(saved?.starSand) || 0));
      const savedBuildings = validSaved && Array.isArray(saved.buildings) ? saved.buildings : ["hall"];
      const buildings = saved?.version === 1
        ? ["hall", ...["gate", "bridge", "garden", "tower", "observatory"].slice(0, ["tower", "garden", "library", "observatory", "gate"].filter((id) => savedBuildings.includes(id)).length)]
        : savedBuildings;
      const store = {
        version: 2,
        castleMaterials: saved?.castleMaterials == null ? Math.floor(legacySand / 5) : Math.max(0, Math.floor(Number(saved.castleMaterials) || 0)),
        completions: validSaved && saved.completions && typeof saved.completions === "object" && !Array.isArray(saved.completions) ? saved.completions : {},
        badges: validSaved && Array.isArray(saved.badges) ? saved.badges : [],
        buildings,
      };
      const completionKey = `${gameId}:${completionId}`;
      if (store.completions[completionKey]) return { credited: false, reason: "already-claimed" };
      store.completions[completionKey] = Date.now();
      if (!store.badges.includes(gameId)) store.badges.push(gameId);
      store.castleMaterials += 1;
      localStorage.setItem(key, JSON.stringify(store));
      announceCastleReward({ gameId, completionId, amount: 1, currency: "castle-material" });
      return { credited: true, amount: 1, currency: "castle-material" };
    } catch { return { credited: false, reason: "storage-unavailable" }; /* Local progression is optional and must never interrupt a game. */ }
  }
  function loadGoogleAnalytics() {
    if (!googleAnalyticsEnabled() || document.querySelector("[data-wonder-ga]")) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", gaMeasurementId, { send_page_view: false, anonymize_ip: true });
      const script = document.createElement("script");
      script.async = true;
      script.dataset.wonderGa = "true";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      document.head.append(script);
    } catch { /* Blocking the Google tag must not prevent the public game from loading. */ }
  }
  function loadCastleRuntime() {
    if (!/(?:^|\/)games\/[^/]+\/?$/i.test(location.pathname) || window.WeightPlayCastle || document.querySelector("[data-weightplay-castle-runtime]")) return;
    try {
      const script = document.createElement("script");
      script.src = "/src/weightplay-castle.js?v=20261002-block-world-button-states-v7";
      script.async = true;
      script.dataset.weightplayCastleRuntime = "true";
      document.head.append(script);
    } catch { /* The optional castle feature must not interrupt game startup. */ }
  }
  function track(name, params = {}) {
    if (lifecycleOwner && ["game_start", "game_restart", "game_end"].includes(name) && !params.tracking_version) return;
    if (["game_start", "game_restart", "stage_start", "level_start", "mission_start"].includes(name)) beginReportedRound(name, params);
    let rewardResult;
    if (name === "game_complete") rewardResult = awardCompletedRound(params);
    else if (name === "game_end" && isSuccessfulOutcome(params.outcome)) rewardResult = awardCompletedRound(params);
    // Do not replace GA4's native session_id with a tab-local random identifier.
    emit(name, { page_path: location.pathname, page_title: document.title, ...params });
    return rewardResult;
  }
  function trackPrivacySafe(name, params = {}) {
    if (lifecycleOwner && ["game_start", "game_restart", "game_end"].includes(name) && !params.tracking_version) return;
    if (!/^[a-z][a-z0-9_]{0,63}$/.test(name)) return;
    if (["game_start", "game_restart", "stage_start", "level_start", "mission_start"].includes(name)) beginReportedRound(name, params);
    let rewardResult;
    if (name === "game_complete") rewardResult = awardCompletedRound(params);
    else if (name === "game_end" && isSuccessfulOutcome(params.outcome)) rewardResult = awardCompletedRound(params);
    const payload = {};
    for (const [key, value] of Object.entries(params || {})) {
      if (!privacySafeKeys.has(key)) continue;
      if (key === "screen_time_sec" || key === "active_play_time_sec") {
        if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 86400) payload[key] = value;
      } else if (typeof value === "number" && Number.isFinite(value)) {
        payload[key] = Math.max(-10000, Math.min(10000, Math.floor(value)));
      } else if (typeof value === "string" && privacySafeToken.test(value)) payload[key] = value;
    }
    emit(name, payload);
    return rewardResult;
  }
  function completeStage(stageId) {
    if ((typeof stageId !== "string" && typeof stageId !== "number") || !String(stageId).trim()) return { credited: false, reason: "missing-stage-id" };
    const gameId = window.WONDER_SITE?.gameIdFromPath?.() || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
    if (!gameId) return { credited: false, reason: "invalid-game" };
    return track("game_complete", { game_id: gameId, stage_id: String(stageId).trim() });
  }

  // All per-game timers and transport stay here. Scene/engine owners only notify.
  function createGameTracking() {
    const gameId = window.WONDER_SITE?.gameIdFromPath?.()
      || location.pathname.match(/(?:^|\/)games\/([^/]+)/i)?.[1] || "";
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(gameId)) return null;
    const screens = new Set(["main", "stage", "battle"]);
    const abort = new AbortController();
    const listen = (target, name, callback, options = {}) => target.addEventListener(name, callback, { ...options, signal: abort.signal });
    const now = () => performance.now();
    const getLocale = () => window.WonderI18n?.actualLocale?.() || window.WonderI18n?.locale?.() || document.documentElement.lang || "en";
    let locale = getLocale();
    let screen = null, entered = null, entryPending = false, screenNode = null, screenOwner = null;
    let visible = !document.hidden, suspended = false, destroyed = false;
    let last = now(), lastInput = last, visibleMs = 0, activeMs = 0;
    let timer = null, round = null, nextRound = 0, mode = "input", idleMs = 120000;
    const pauses = new Set();
    let stateReader = null, stateQueued = false, stateReady = false, observedRound = null, observedEnded = false;
    let restartRequested = false, inputTask = null, observedReopenKey = null;
    let keyboardKeys = new Set();
    const context = () => ({
      game_id: gameId, screen: screen || "none", locale, tracking_version: "2",
      time_model: mode === "state" ? "foreground_running" : "foreground_input",
      interface_version: document.documentElement.dataset.wpSharedInterface || "unknown",
    });
    const allowed = () => analyticsEnabled && config.enabled !== false && !destroyed;
    const send = (name, params = {}) => {
      if (allowed()) trackPrivacySafe(name, { ...context(), ...params });
    };
    function settle() {
      const current = now(), delta = current - last;
      // Discard anomalous suspension intervals instead of inventing hours of play.
      if (allowed() && visible && !suspended && screen && delta >= 0 && delta <= 120000) {
        visibleMs += delta;
        if (screen === "battle" && round !== null && pauses.size === 0) {
          activeMs += mode === "state" ? delta : Math.max(0, Math.min(current, lastInput + idleMs) - last);
        }
      }
      last = current;
    }
    function flush() {
      settle();
      const screenSeconds = visibleMs / 1000, playSeconds = activeMs / 1000;
      // Clear before forwarding; visibilitychange followed by pagehide cannot resend.
      visibleMs = 0; activeMs = 0;
      if (screenSeconds > 0) send("game_screen_time", { screen_time_sec: screenSeconds });
      // Separate event identifies real players, including resumed existing runs.
      if (playSeconds > 0) send("game_play_time", { active_play_time_sec: playSeconds });
    }
    function enter() {
      if (!allowed() || !visible || suspended || !screen || !entryPending) return;
      send("game_screen_enter", { from: entered || "none" });
      entered = screen;
      entryPending = false;
    }
    function schedule() {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      if (allowed() && visible && !suspended && screen) {
        timer = setTimeout(() => { timer = null; flush(); schedule(); }, 60000);
      }
    }
    function setScreen(next, options = {}) {
      if (destroyed || (next !== null && !screens.has(next))) return;
      const nextLocale = options.locale || getLocale();
      if (next === screen && nextLocale === locale) {
        if (options.node) screenNode = options.node;
        return;
      }
      flush();
      if (privacySafeToken.test(nextLocale)) locale = nextLocale;
      if (next !== screen) {
        screen = next;
        // null suspends a full-screen overlay; returning to its owner is not re-entry.
        entryPending = next !== null && next !== entered;
      }
      screenNode = options.node || null;
      enter(); schedule();
    }
    function end(outcome = "abandon", completedStageId = null) {
      if (round === null || destroyed) return false;
      flush();
      if (isSuccessfulOutcome(outcome) && !roundClearReported) {
        const params = { game_id: gameId };
        const stageId = (typeof completedStageId === "string" || typeof completedStageId === "number") ? completedStageId : activeStageId;
        if (stageId != null) params.stage_id = stageId;
        awardCompletedRound(params);
      }
      send("game_end", { screen: "battle", outcome: privacySafeToken.test(outcome) ? outcome : "unknown" });
      round = null; pauses.clear();
      return true;
    }
    function start(options = {}) {
      if (!allowed()) return null;
      const key = options.roundKey ?? null;
      if (round !== null && (key === null || round === key)) return round;
      if (round !== null) end("replaced");
      flush();
      round = key ?? ++nextRound;
      roundClearReported = false;
      if (pendingStageId != null) activeStageId = pendingStageId;
      else if (options.stageId != null && (typeof options.stageId === "string" || typeof options.stageId === "number")) activeStageId = options.stageId;
      else activeStageId = null;
      pendingStageId = null;
      pauses.clear(); lastInput = now();
      send(options.resumed === true ? "game_resume" : "game_start", { screen: "battle" });
      return round;
    }
    function restart(options = {}) {
      if (!allowed()) return null;
      if (options.roundKey != null && round === options.roundKey) return round;
      end("restart");
      send("game_restart", { screen: "battle" });
      return start(options);
    }
    function pause(reason = "game") {
      if (destroyed || round === null || pauses.has(reason)) return;
      flush(); pauses.add(reason);
    }
    function resume(reason = "game") {
      if (destroyed || round === null || !pauses.has(reason)) return;
      flush(); pauses.delete(reason); lastInput = now();
    }
    function activity() {
      if (!allowed() || !visible || suspended || screen !== "battle" || round === null || pauses.size) return;
      settle(); lastInput = now();
    }
    function configure(options = {}) {
      // Only authored global keyboard controls may count outside the play root.
      if (Array.isArray(options.keyboardKeys)) keyboardKeys = new Set(options.keyboardKeys
        .filter(key => typeof key === "string" && key.length > 0 && key.length <= 32).slice(0, 64));
      const nextMode = ["input", "state"].includes(options.activityMode) ? options.activityMode : mode;
      const nextIdleMs = Number.isFinite(options.idleSeconds) && options.idleSeconds >= 30 && options.idleSeconds <= 600 ? options.idleSeconds * 1000 : idleMs;
      const nextLocale = options.locale && privacySafeToken.test(options.locale) ? options.locale : locale;
      if (nextMode === mode && nextIdleMs === idleMs && nextLocale === locale) return;
      flush();
      // Re-rendering/translating does not prove player activity or renew the idle cap.
      mode = nextMode; idleMs = nextIdleMs; locale = nextLocale;
    }
    function changeVisibility(isVisible, isSuspended = suspended) {
      flush();
      const wasVisible = visible && !suspended;
      visible = isVisible; suspended = isSuspended; last = now();
      if (!wasVisible && visible && !suspended) lastInput = last;
      enter(); schedule();
    }
    // A game/engine publishes a reader from its authoritative state mutations.
    // At most one microtask is scheduled per synchronous transaction. No DOM
    // observer, polling loop, scene-name inference, or per-game timer is added.
    function hasBlockingDialog() {
      // Authored modal semantics block gameplay input; they never start/end a round.
      // No observer or layout-wide polling is installed for this guard.
      const dialogs = document.querySelectorAll?.('dialog[open], [aria-modal="true"], [role="dialog"]') || [];
      return Array.from(dialogs).some(node => !node.hidden && node.isConnected !== false
        && node.getClientRects?.().length > 0 && getComputedStyle(node).visibility !== "hidden");
    }
    function observeState(read) {
      if (destroyed || typeof read !== "function") return;
      stateReader = read;
      lifecycleOwner = true;
      if (stateQueued) return;
      stateQueued = true;
      queueMicrotask(() => {
        stateQueued = false;
        if (destroyed || !allowed()) return;
        try {
          const value = stateReader();
          if (!value || (value.screen !== null && !screens.has(value.screen))) throw new Error("INVALID_GAME_MEASUREMENT_STATE");
          const key = value.roundKey ?? null;
          const stateStageId = value.stageId ?? value.stage_id ?? value.levelId ?? value.level_id ?? value.roomId ?? value.room_id ?? value.floorId ?? value.floor_id ?? value.chapterId ?? value.chapter_id ?? value.stage ?? value.level ?? value.room ?? value.floor ?? value.chapter;
          if ((typeof stateStageId === "string" || typeof stateStageId === "number") && String(stateStageId).trim()) {
            activeStageId = stateStageId;
            pendingStageId = stateStageId;
          }
          if (!stateReady && value.screen === null && key === null && !value.started) return;
          stateReady = true;
          configure({ locale: value.locale || getLocale(), activityMode: value.activityMode || "input", idleSeconds: value.idleSeconds ?? 300, keyboardKeys: value.keyboardKeys || [] });
          setScreen(value.screen, { node: value.node || null, locale: value.locale || getLocale() });
          if (key !== observedRound) {
            if (round !== null) end(restartRequested || value.restart === true ? "restart" : "replaced");
            observedRound = key;
            observedEnded = false;
            observedReopenKey = null;
          }
          // Explicit successful undo may reopen the same ended board. A new
          // in-memory token is required for each reopen; rendering cannot do it.
          const reopening = key !== null && key === observedRound && observedEnded
            && value.started === true && !value.ended && value.reopenKey != null
            && value.reopenKey !== observedReopenKey;
          if (reopening) { observedReopenKey = value.reopenKey; observedEnded = false; }
          if (key !== null && value.started === true && !value.ended && !observedEnded && round === null) {
            if (restartRequested || value.restart === true) restart({ roundKey: key });
            else start({ roundKey: key, resumed: reopening || value.resumed === true });
          }
          restartRequested = false;
          if (value.ended && key !== null) {
            const completedStageId = value.stageId ?? value.stage_id ?? value.levelId ?? value.level_id ?? value.roomId ?? value.room_id ?? value.floorId ?? value.floor_id ?? value.chapterId ?? value.chapter_id ?? value.stage ?? value.level ?? value.room ?? value.floor ?? value.chapter;
            end(value.outcome || "complete", completedStageId);
            observedEnded = true;
          } else if (key === null || value.started === false) {
            end("abandon");
          } else if (round !== null) {
            // Lifecycle pauses remain separate from tab visibility and from
            // drawing a Battle frame underneath an authored result dialog.
            if (value.paused || value.screen !== "battle") pause("adapter_state");
            else resume("adapter_state");
          }
          syncDialogPause();
        } catch {
          // Fail closed for measurement only; never keep timing a stale Battle
          // when an adapter temporarily cannot provide its authoritative state.
          pause("adapter_state"); setScreen(null);
        }
      });
    }
    function markRestart() { restartRequested = true; if (stateReader) observeState(stateReader); }
    function collectionChanged() {
      // Drop unsubmitted time across consent/collection changes, never backfill it.
      visibleMs = 0; activeMs = 0; last = now(); lastInput = last;
      if (!allowed()) { round = null; pauses.clear(); entered = null; entryPending = Boolean(screen); observedRound = null; observedEnded = false; restartRequested = false; observedReopenKey = null; }
      else if (stateReader) observeState(stateReader);
      enter(); schedule();
    }
    function syncDialogPause() {
      if (hasBlockingDialog()) pause("ui_dialog");
      else resume("ui_dialog");
    }
    function interactionChanged() {
      if (!allowed()) return;
      // The component dispatches only AFTER its state mutation.
      syncDialogPause();
      if (stateReader) observeState(stateReader);
    }
    function afterInput() {
      if (inputTask !== null || !allowed()) return;
      // Native DOM events may run a microtask checkpoint between listeners.
      // A task (not a capture microtask) is the fallback after all handlers,
      // including handlers which stop propagation. There is no polling loop.
      inputTask = setTimeout(() => { inputTask = null; interactionChanged(); }, 0);
    }
    for (const name of ["pointerdown", "pointerup", "click", "keydown", "keyup", "change"]) {
      listen(document, name, afterInput, { capture: true, passive: true });
    }
    listen(window, "weightplay:interaction-state", interactionChanged);
    listen(window, "weightplay:shell-sync", () => { if (stateReader) observeState(stateReader); });
    listen(document, "visibilitychange", () => { changeVisibility(!document.hidden); if (stateReader) observeState(stateReader); });
    listen(window, "pagehide", event => { if (event.persisted === false) end("abandon"); changeVisibility(false, true); });
    listen(window, "pageshow", () => changeVisibility(!document.hidden, false));
    listen(window, "wonder:locale-change", () => { flush(); locale = getLocale(); });
    const onInput = (event) => {
      if (!event.isTrusted || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (!allowed() || !visible || suspended || screen !== "battle" || round === null) return;
      if (event.type === "pointermove" && (!event.buttons || now() - lastInput < 250)) return;
      const target = event.target;
      if (target?.closest?.("[data-wp-settings],[data-wp-preferences],.wp-shell-settings,.wp-frame-utility,[role=dialog]")) return;
      const editable = target?.isContentEditable || target?.closest?.("input,textarea,select,[contenteditable]");
      const globalKey = event.type === "keydown" && !editable && keyboardKeys.has(event.key)
        && (target === document.body || target === document.documentElement || target === document);
      if (!screenNode?.contains?.(target) && !globalKey) return;
      if (event.type === "keydown" && ["Escape", "Tab", "Control", "Alt", "Meta"].includes(event.key)) return;
      if (hasBlockingDialog()) return;
      activity();
    };
    // Capture before game handlers remove cells or stop propagation.
    for (const name of ["pointerdown", "pointermove", "keydown"]) listen(document, name, onInput, { capture: true, passive: true });
    listen(window, "weightplay:screen-change", (event) => {
      if (stateReader && stateReady) return; // The explicit game/engine state is authoritative once initialized.
      const detail = event.detail || {};
      if (detail.release) {
        if (detail.owner !== screenOwner) return;
        screenOwner = null; setScreen(null); return;
      }
      if (detail.owner) screenOwner = detail.owner;
      setScreen(detail.screen, { node: detail.node, locale: detail.locale });
    });
    return Object.freeze({
      screen: setScreen, start, restart, pause, resume, end, activity, configure, flush, collectionChanged, observeState, markRestart,
      complete: () => end("complete"),
      snapshot: () => ({ gameId, screen, roundActive: round !== null, paused: pauses.size > 0, mode }),
      destroy() { flush(); destroyed = true; abort.abort(); if (timer !== null) clearTimeout(timer); if (inputTask !== null) clearTimeout(inputTask); inputTask = null; timer = null; screenNode = null; screenOwner = null; round = null; stateReader = null; pauses.clear(); },
    });
  }

  loadGoogleAnalytics();
  loadCastleRuntime();
  const game = createGameTracking();
  window.WonderAnalytics = {
    track, trackPrivacySafe, completeStage, counts: loadCounts, hasGoogleAnalytics: googleAnalyticsEnabled, game,
    setEnabled(enabled) {
      analyticsEnabled = enabled === true;
      if (analyticsEnabled) loadGoogleAnalytics();
      game?.collectionChanged();
    },
  };
  track("page_view");
  window.dispatchEvent(new Event("weightplay:analytics-ready"));
})();
