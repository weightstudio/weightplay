(() => {
  "use strict";
  const locales = window.ANIMAL_FIREFLY_FOLIO_LOCALES || {};
  const directions = ["north", "east", "south", "west"];
  const opposites = { north: "south", east: "west", south: "north", west: "east" };
  const pages = [
    { name: "name1", note: "note1", solution: ["east", "north", "east"], mechanic: "trail" },
    { name: "name2", note: "note2", solution: ["north", "west", "north"], mechanic: "trail" },
    { name: "name3", note: "note3", solution: ["west", "south", "east"], mechanic: "trail" },
    { name: "name4", note: "note4", solution: ["south", "east", "north"], mechanic: "trail" },
    { name: "name5", note: "note5", solution: ["north", "east", "south"], mechanic: "trail", checkpoint: true },
    { name: "name6", note: "note6", solution: ["north", "east", "north", "east"], mechanic: "limited-compass", allowedDirections: ["north", "east", "south"] },
    { name: "name7", note: "note7", solution: ["east", "south", "east", "north"], mechanic: "limited-compass", allowedDirections: ["north", "east", "south"] },
    { name: "name8", note: "note8", solution: ["south", "east", "north", "east"], mechanic: "limited-compass", allowedDirections: ["north", "east", "south"] },
    { name: "name9", note: "note9", solution: ["north", "east", "south", "east"], mechanic: "limited-compass", allowedDirections: ["north", "east", "south"] },
    { name: "name10", note: "note10", solution: ["east", "north", "east", "south"], mechanic: "limited-compass", allowedDirections: ["north", "east", "south"], checkpoint: true },
    { name: "name11", note: "note11", solution: ["west", "north", "east", "south"], mechanic: "no-backtrack" },
    { name: "name12", note: "note12", solution: ["north", "east", "south", "west"], mechanic: "no-backtrack" },
    { name: "name13", note: "note13", solution: ["east", "south", "west", "north"], mechanic: "no-backtrack" },
    { name: "name14", note: "note14", solution: ["south", "west", "north", "east"], mechanic: "no-backtrack" },
    { name: "name15", note: "note15", solution: ["west", "north", "east", "south"], mechanic: "no-backtrack", checkpoint: true },
    { name: "name16", title: "Current Window 16", solution: ["north", "east", "south", "west", "north"], mechanic: "current-window", current: "east", currentAt: 1 },
    { name: "name17", title: "Current Window 17", solution: ["east", "west", "south", "north", "east"], mechanic: "current-window", current: "south", currentAt: 2 },
    { name: "name18", title: "Current Window 18", solution: ["west", "north", "east", "south", "north"], mechanic: "current-window", current: "west", currentAt: 0 },
    { name: "name19", title: "Current Window 19", solution: ["west", "east", "south", "north", "west"], mechanic: "current-window", current: "north", currentAt: 3 },
    { name: "name20", title: "Current Window 20", solution: ["north", "south", "west", "north", "east"], mechanic: "current-window", current: "east", currentAt: 4, checkpoint: true },
    { name: "name21", title: "Beacon Gap 21", solution: ["east", "north", "west", "south", "east"], mechanic: "beacon-gap", beaconA: "east", beaconB: "west" },
    { name: "name22", title: "Beacon Gap 22", solution: ["north", "east", "west", "south", "north"], mechanic: "beacon-gap", beaconA: "north", beaconB: "west" },
    { name: "name23", title: "Beacon Gap 23", solution: ["west", "south", "east", "north", "west"], mechanic: "beacon-gap", beaconA: "west", beaconB: "east" },
    { name: "name24", title: "Beacon Gap 24", solution: ["south", "east", "north", "west", "south"], mechanic: "beacon-gap", beaconA: "south", beaconB: "north" },
    { name: "name25", title: "Beacon Gap 25", solution: ["east", "west", "north", "south", "east"], mechanic: "beacon-gap", beaconA: "east", beaconB: "north", checkpoint: true },
    { name: "name26", title: "Echo Lantern 26", solution: ["north", "west", "east", "west", "east", "north"], mechanic: "echo-lantern", signal: "north", echo: "east" },
    { name: "name27", title: "Echo Lantern 27", solution: ["east", "north", "south", "north", "south", "east"], mechanic: "echo-lantern", signal: "east", echo: "south" },
    { name: "name28", title: "Echo Lantern 28", solution: ["south", "east", "west", "east", "west", "south"], mechanic: "echo-lantern", signal: "south", echo: "west" },
    { name: "name29", title: "Echo Lantern 29", solution: ["west", "south", "north", "south", "north", "west"], mechanic: "echo-lantern", signal: "west", echo: "north" },
    { name: "name30", title: "Echo Lantern 30", solution: ["north", "east", "west", "east", "west", "north"], mechanic: "echo-lantern", signal: "north", echo: "west", checkpoint: true },
  ];
  const canonicalLocale = (value) => {
    const raw = String(value || "").trim();
    if (locales[raw]) return raw;
    const match = Object.keys(locales).find((locale) => locale.toLowerCase() === raw.toLowerCase());
    return match || "en";
  };
  const storedLocale = () => {
    try {
      return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || "";
    } catch (_) {
      return "";
    }
  };
  const initialLocale = canonicalLocale(
    window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.localeFromPath?.()
      || document.documentElement.lang
      || storedLocale(),
  );
  const loadProgress = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem("weightplay-animal-firefly-folio-progress-v1") || "{}");
      const cleared = Array.isArray(parsed.cleared)
        ? [...new Set(parsed.cleared.map(Number).filter((index) => Number.isInteger(index) && index >= 0 && index < pages.length))].sort((a, b) => a - b)
        : [];
      const highest = cleared.length ? cleared[cleared.length - 1] + 1 : 0;
      return { cleared, unlocked: Math.max(1, Math.min(pages.length, Number(parsed.unlocked) || highest + 1)) };
    } catch (_) {
      return { cleared: [], unlocked: 1 };
    }
  };
  const progress = loadProgress();
  const state = { locale: initialLocale, page: 0, route: [], turns: 0, sessionTurns: 0, screen: "main", statusKey: "waiting", cleared: progress.cleared, unlocked: progress.unlocked };
  let stageController = null;
  let stageBrowseIndex = Math.max(0, state.unlocked - 1);
  let leaveOpen = false;
  const startLabels = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작", es: "Iniciar juego",
    "pt-BR": "Iniciar jogo", fr: "Commencer", de: "Spiel starten", it: "Inizia partita", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة",
  };
  const leaveLabels = {
    en: ["Leave this page?", "Your unfinished route choices on this page will be discarded. Cleared pages and saved progress stay.", "Continue playing", "Return to Folio pages"],
    "zh-Hant": ["離開這一頁？", "這一頁尚未完成的路線選擇會被捨棄；已完成頁面與已儲存進度會保留。", "繼續遊戲", "返回筆記頁面"],
    "zh-Hans": ["离开这一页？", "这一页尚未完成的路线选择会被放弃；已完成页面与已保存进度会保留。", "继续游戏", "返回笔记页面"],
    ja: ["このページを離れますか？", "このページの未完了のルート選択は破棄されます。完了済みページと保存済み進行は残ります。", "続ける", "ページ一覧へ"],
    ko: ["이 페이지를 나갈까요?", "이 페이지의 미완성 경로 선택은 사라집니다. 완료한 페이지와 저장된 진행은 유지됩니다.", "계속 플레이", "기록 페이지로"],
    es: ["¿Salir de esta página?", "Se descartarán las elecciones de ruta sin terminar de esta página. Las páginas completadas y el progreso guardado se conservan.", "Seguir jugando", "Volver a Páginas"],
    "pt-BR": ["Sair desta página?", "As escolhas de rota inacabadas desta página serão descartadas. Páginas concluídas e progresso salvo serão mantidos.", "Continuar jogando", "Voltar às Páginas"],
    fr: ["Quitter cette page ?", "Les choix de trajet inachevés de cette page seront abandonnés. Les pages terminées et la progression enregistrée restent.", "Continuer", "Retour aux Pages"],
    de: ["Diese Seite verlassen?", "Unfertige Routenentscheidungen auf dieser Seite werden verworfen. Abgeschlossene Seiten und gespeicherter Fortschritt bleiben erhalten.", "Weiterspielen", "Zurück zu den Seiten"],
    it: ["Uscire da questa pagina?", "Le scelte di percorso non completate di questa pagina verranno eliminate. Le pagine completate e i progressi salvati restano.", "Continua a giocare", "Torna alle Pagine"],
    ru: ["Покинуть эту страницу?", "Незавершённый маршрут на этой странице будет сброшен. Пройденные страницы и сохранённый прогресс останутся.", "Продолжить", "К страницам"],
    hi: ["इस पन्ने से बाहर जाएँ?", "इस पन्ने की अधूरी राह की पसंदें मिट जाएँगी। पूरे पन्ने और सहेजी प्रगति बनी रहेगी।", "खेल जारी रखें", "पन्नों पर लौटें"],
    ar: ["مغادرة هذه الصفحة؟", "ستُلغى اختيارات المسار غير المكتملة في هذه الصفحة. ستبقى الصفحات المكتملة والتقدم المحفوظ.", "متابعة اللعب", "العودة إلى الصفحات"],
  };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const table = locales[state.locale] || locales.en || {};
    let value = table[key] || locales.en?.[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  };
  const readBest = () => {
    try {
      const value = Number(localStorage.getItem("weightplay-animal-firefly-folio-best-v1"));
      return Number.isFinite(value) && value > 0 ? value : null;
    } catch (_) {
      return null;
    }
  };
  const saveProgress = () => {
    try {
      localStorage.setItem("weightplay-animal-firefly-folio-progress-v1", JSON.stringify({ cleared: state.cleared, unlocked: state.unlocked }));
    } catch (_) {}
  };
  const saveBest = () => {
    try {
      const old = readBest();
      if (!old || state.sessionTurns < old) localStorage.setItem("weightplay-animal-firefly-folio-best-v1", String(state.sessionTurns));
    } catch (_) {}
  };
  const renderMain = () => {
    $("mainProgress").textContent = `${t("stages")}: ${Math.min(state.unlocked, pages.length)} / ${pages.length}`;
    const bestValue = $("bestValue");
    if (bestValue) bestValue.textContent = readBest() || t("noBest");
  };
  const localizedOr = (key, fallback) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
  const directionList = (route) => route.map((direction) => t(direction)).join(" → ");
  const pageTitle = (page, index) => localizedOr(page.name, page.title || `Folio arc ${Math.floor(index / 5) + 1} · page ${index + 1}`);
  const pageNote = (page, index) => {
    const localized = localizedOr(page.note, "");
    if (localized) return localized;
    const route = directionList(page.solution);
    if (page.mechanic === "current-window") {
      return `Current rule: place ${t(page.current)} on turn ${page.currentAt + 1}, exactly once; fill the other turns without ${t(page.current)}.`;
    }
    if (page.mechanic === "beacon-gap") {
      return `Beacon rule: touch ${t(page.beaconA)}, leave one turn, then touch ${t(page.beaconB)}; fill the remaining turns freely.`;
    }
    if (page.mechanic === "echo-lantern") {
      return `Echo rule: begin and end on ${t(page.signal)}; place ${t(page.echo)} then ${t(opposites[page.echo])} in the middle, with different second and fifth turns.`;
    }
    if (page.mechanic === "limited-compass") {
      return `Compass rule: use only ${page.allowedDirections.map((direction) => t(direction)).join(", ")}. Route: ${route}.`;
    }
    if (page.mechanic === "no-backtrack") return `Trail rule: never reverse the last turn. Route: ${route}.`;
    return `Trace the lantern route: ${route}.`;
  };
  const normalizeInterface7 = () => {
    const battle = $("battleScreen");
    const result = $("resultScreen");
    if (battle && result && !battle.contains(result)) {
      result.removeAttribute("data-screen");
      result.dataset.wpBattleSubstate = "result";
      battle.append(result);
    } else if (result) {
      result.removeAttribute("data-screen");
      result.dataset.wpBattleSubstate = "result";
    }
    document.querySelectorAll(".battle-ad-reserve").forEach((node) => node.remove());
  };
  const battleLayers = () => {
    const battle = $("battleScreen");
    if (!battle) return [];
    const result = $("resultScreen");
    const dialog = $("fireflyLeaveDialog");
    return [...battle.children].filter((node) => node !== result && node !== dialog);
  };
  const setBattleCovered = (covered) => {
    battleLayers().forEach((node) => { node.inert = covered; });
  };
  const ensureLeaveDialog = () => {
    let dialog = $("fireflyLeaveDialog");
    if (dialog) return dialog;
    dialog = document.createElement("section");
    dialog.id = "fireflyLeaveDialog";
    dialog.className = "firefly-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "fireflyLeaveTitle");
    dialog.setAttribute("aria-describedby", "fireflyLeaveText");
    dialog.innerHTML = '<div class="firefly-leave-card"><h2 id="fireflyLeaveTitle"></h2><p id="fireflyLeaveText"></p><div class="firefly-leave-actions"><button id="fireflyStayBtn" class="primary-btn" type="button"></button><button id="fireflyLeaveBtn" class="secondary-btn" type="button"></button></div></div>';
    $("battleScreen").append(dialog);
    $("fireflyStayBtn").addEventListener("click", () => closeLeave(true));
    $("fireflyLeaveBtn").addEventListener("click", () => {
      state.route = [];
      closeLeave(false);
      show("stage");
      renderStages();
    });
    return dialog;
  };
  const refreshLeaveCopy = () => {
    const labels = leaveLabels[state.locale] || leaveLabels.en;
    const title = $("fireflyLeaveTitle");
    if (!title) return;
    title.textContent = labels[0];
    $("fireflyLeaveText").textContent = `${t("round", { n: state.page + 1, total: pages.length })}: ${labels[1]}`;
    $("fireflyStayBtn").textContent = labels[2];
    $("fireflyLeaveBtn").textContent = labels[3];
  };
  const openLeave = () => {
    if (leaveOpen || state.screen !== "battle") return;
    leaveOpen = true;
    const dialog = ensureLeaveDialog();
    refreshLeaveCopy();
    setBattleCovered(true);
    dialog.hidden = false;
    dialog.inert = false;
    $("fireflyStayBtn").focus({ preventScroll: true });
  };
  const closeLeave = (restoreFocus = true) => {
    const dialog = $("fireflyLeaveDialog");
    leaveOpen = false;
    if (dialog) {
      dialog.hidden = true;
      dialog.inert = true;
    }
    if (state.screen === "battle") setBattleCovered(false);
    if (restoreFocus && state.screen === "battle") $("battleBackBtn")?.focus({ preventScroll: true });
  };
  const show = (screen) => {
    if (leaveOpen) closeLeave(false);
    state.screen = screen;
    const owner = screen === "result" ? "battle" : screen;
    for (const [name, id] of [["main", "mainScreen"], ["stage", "stageScreen"], ["battle", "battleScreen"]]) {
      const node = $(id);
      const active = name === owner;
      node.hidden = !active;
      node.inert = !active;
      node.setAttribute("aria-hidden", String(!active));
    }
    const result = $("resultScreen");
    if (result) {
      const activeResult = screen === "result";
      result.hidden = !activeResult;
      result.inert = !activeResult;
      result.setAttribute("aria-hidden", String(!activeResult));
    }
    const battle = $("battleScreen");
    const live = battle?.querySelector(".battle-content, [data-wp-frame-content='battle'], .wp-frame-play-content");
    const header = battle?.querySelector(".battle-header, [data-wp-frame-header='battle'], .wp-frame-header");
    if (live && live !== result) { live.hidden = screen === "result"; live.inert = screen === "result"; }
    if (header) { header.hidden = screen === "result"; header.inert = screen === "result"; }
    const guide = document.querySelector("[data-wp-game-guide]");
    if (guide) guide.hidden = owner !== "main";
    document.body.dataset.screen = owner;
    if (screen === "main") renderMain();
  };
  const announce = (key) => { state.statusKey = key; $("battleStatus").textContent = t(key); };
  const applyLocale = () => {
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria)));
    document.querySelectorAll("[data-copy-alt]").forEach((node) => node.setAttribute("alt", t(node.dataset.copyAlt)));
    $("localeSelect").value = state.locale;
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("startBtn").textContent = startLabels[state.locale] || startLabels.en;
    if (leaveOpen) refreshLeaveCopy();
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") { renderBattle(); announce(state.statusKey); }
    if (state.screen === "result") renderResult();
  };
  const bindStage = (button, index) => {
    const page = pages[index];
    const isLocked = index >= state.unlocked;
    button.type = "button";
    button.className = `stage-card${isLocked ? " is-locked" : ""}${page.checkpoint ? " is-checkpoint" : ""}`;
    button.disabled = false;
    button.setAttribute("aria-disabled", String(isLocked));
    button.dataset.stageIndex = String(index);
    button.replaceChildren();
    const title = document.createElement("strong");
    const name = document.createElement("span");
    const status = document.createElement("small");
    title.textContent = t("round", { n: index + 1, total: pages.length });
    name.textContent = pageTitle(page, index);
    status.textContent = `${state.cleared.includes(index) ? t("complete") : isLocked ? t("locked") : t("open")}${page.checkpoint ? ` · ${t("checkpoint")}` : ""}`;
    button.append(title, name, status);
    if (index === Math.max(0, state.unlocked - 1)) button.dataset.wpStageRecommended = "true";
    else delete button.dataset.wpStageRecommended;
  };
  const highestUnlockedIndex = () => Math.max(0, Math.min(pages.length - 1, state.unlocked - 1));
  const renderStages = ({ selectHighest = false } = {}) => {
    if (selectHighest) stageBrowseIndex = highestUnlockedIndex();
    if (!stageController) {
      stageController = window.WeightPlayStageV6?.install?.($("stageList"), {
        total: pages.length,
        poolSize: 9,
        bind: bindStage,
        initialIndex: () => stageBrowseIndex,
        onFocus: (index) => { stageBrowseIndex = index; },
        onSettle: (index) => { stageBrowseIndex = index; },
        activate: (index) => {
          stageBrowseIndex = index;
          if (index >= state.unlocked) return false;
          startPage(index);
          return true;
        },
      }) || null;
      if (!stageController) throw new Error("Stage controller unavailable");
    } else {
      stageController.refresh();
    }
    stageController.center(stageBrowseIndex);
  };
  const renderBattle = () => {
    const page = pages[state.page];
    const targetLength = page.solution.length;
    $("roundName").textContent = pageTitle(page, state.page);
    $("roundLabel").textContent = t("round", { n: state.page + 1, total: pages.length });
    $("routeNote").textContent = pageNote(page, state.page);
    $("turnCount").textContent = t("turnCount", { n: state.route.length });
    $("route").replaceChildren(...state.route.map((direction) => {
      const chip = document.createElement("span");
      chip.className = "route-chip";
      chip.textContent = t(direction);
      return chip;
    }));
    $("directionGrid").replaceChildren(...directions.map((direction) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `direction-btn direction-${direction}`;
      button.setAttribute("aria-label", t(direction));
      button.innerHTML = `<span class="direction-icon" aria-hidden="true"></span><strong>${t(direction)}</strong>`;
      button.disabled = state.route.length >= targetLength || (page.allowedDirections && !page.allowedDirections.includes(direction));
      button.addEventListener("click", () => chooseDirection(direction));
      return button;
    }));
  };
  const renderResult = () => {
    const hasNext = state.page < pages.length - 1 && state.page + 1 < state.unlocked;
    $("resultTitle").textContent = state.page >= pages.length - 1 ? t("resultTitle") : t("resultPartial");
    $("resultText").textContent = t("resultText", { count: Math.min(state.page + 1, pages.length), total: pages.length, turns: state.sessionTurns });
    $("resultPrimaryBtn").textContent = t("next");
    $("resultPrimaryBtn").disabled = !hasNext;
    $("resultPrimaryBtn").onclick = () => startPage(state.page + 1);
    $("resultMapBtn").hidden = false;
    $("resultReplayBtn").textContent = t("replay");
    $("resultReplayBtn").onclick = () => startPage(state.page);
  };
  const startPage = (index) => {
    if (index < 0 || index >= pages.length || index >= state.unlocked) return;
    state.page = index;
    state.route = [];
    if (index === 0) state.sessionTurns = 0;
    show("battle");
    renderBattle();
    announce("waiting");
  };
  const chooseDirection = (direction) => {
    const page = pages[state.page];
    if (state.route.length >= page.solution.length || (page.allowedDirections && !page.allowedDirections.includes(direction))) return;
    state.route.push(direction);
    state.turns += 1;
    state.sessionTurns += 1;
    renderBattle();
  };
  const clearRoute = () => { state.route = []; renderBattle(); announce("waiting"); };
  const ruleValid = (page) => {
    if (page.mechanic === "no-backtrack" && state.route.some((direction, index) => index > 0 && opposites[direction] === state.route[index - 1])) return false;
    if (page.mechanic === "current-window") {
      if (state.route[page.currentAt] !== page.current) return false;
      if (state.route.filter((direction) => direction === page.current).length !== 1) return false;
    }
    if (page.mechanic === "beacon-gap") {
      const beaconA = state.route.indexOf(page.beaconA);
      const beaconB = state.route.indexOf(page.beaconB);
      if (beaconA < 0 || beaconB !== beaconA + 2) return false;
    }
    if (page.mechanic === "echo-lantern") {
      if (state.route[0] !== page.signal || state.route[state.route.length - 1] !== page.signal) return false;
      if (state.route[2] !== page.echo || state.route[3] !== opposites[page.echo]) return false;
      if (state.route[1] === state.route[4]) return false;
    }
    return true;
  };
  const checkRoute = () => {
    const page = pages[state.page];
    if (state.route.length < page.solution.length) { announce("incomplete"); return; }
    const exactRoute = JSON.stringify(state.route) === JSON.stringify(page.solution);
    const constraintRoute = ["current-window", "beacon-gap", "echo-lantern"].includes(page.mechanic);
    const correct = (constraintRoute ? ruleValid(page) : exactRoute && ruleValid(page));
    if (!correct) { state.route = []; renderBattle(); announce("wrong"); return; }
    announce("correct");
    if (!state.cleared.includes(state.page)) state.cleared.push(state.page);
    state.unlocked = Math.max(state.unlocked, Math.min(pages.length, state.page + 2));
    saveProgress();
    if (state.page === pages.length - 1) saveBest();
    show("result");
    renderResult();
  };
  $("startBtn").addEventListener("click", () => { show("stage"); renderStages({ selectHighest: true }); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", () => {
    if (state.route.length) openLeave();
    else { show("stage"); renderStages(); }
  });
  $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages({ selectHighest: true }); });
  $("checkBtn").addEventListener("click", checkRoute);
  $("clearBtn").addEventListener("click", clearRoute);
  $("localeSelect").addEventListener("change", (event) => {
    const requested = canonicalLocale(event.target.value);
    try { window.WonderI18n?.setLocale?.(requested); } catch (_) {}
    state.locale = requested;
    try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {}
    applyLocale();
  });
  window.addEventListener("wonder:locale-change", (event) => {
    const requested = canonicalLocale(event.detail?.actualLocale || event.detail?.locale || window.WonderI18n?.actualLocale?.());
    if (locales[requested] && requested !== state.locale) {
      state.locale = requested;
      try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {}
      applyLocale();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (leaveOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeave(true);
        return;
      }
      if (event.key === "Tab") {
        const buttons = [...$("fireflyLeaveDialog").querySelectorAll("button:not(:disabled)")];
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        else if (!$("fireflyLeaveDialog").contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
      }
      return;
    }
    if (event.key === "Escape" && state.screen === "battle") {
      event.preventDefault();
      if (state.route.length) openLeave();
      else { show("stage"); renderStages(); }
    }
  });

  window.addEventListener("pagehide", () => {
    stageController?.destroy();
    stageController = null;
  }, { once: true });

  normalizeInterface7();
  applyLocale();
  show("main");
  window.__ANIMAL_FIREFLY_FOLIO_TEST__ = { pages, startPage, chooseDirection, checkRoute, getState: () => ({ ...state, route: [...state.route], cleared: [...state.cleared] }) };
})();
