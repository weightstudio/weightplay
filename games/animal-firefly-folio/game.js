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
    $("bestValue").textContent = readBest() || t("noBest");
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
  const show = (screen) => {
    state.screen = screen;
    document.querySelectorAll("section[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; });
    document.body.dataset.screen = screen;
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
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") { renderBattle(); announce(state.statusKey); }
    if (state.screen === "result") renderResult();
  };
  const renderStages = () => {
    $("stageList").replaceChildren(...pages.map((page, index) => {
      const button = document.createElement("button");
      const isLocked = index >= state.unlocked;
      button.type = "button";
      button.className = `stage-card${isLocked ? " is-locked" : ""}${page.checkpoint ? " is-checkpoint" : ""}`;
      button.setAttribute("role", "listitem");
      button.disabled = isLocked;
      button.innerHTML = `<strong>${t("round", { n: index + 1, total: pages.length })}</strong><span>${pageTitle(page, index)}</span><small>${state.cleared.includes(index) ? t("complete") : isLocked ? t("locked") : t("open")}${page.checkpoint ? ` · ${t("checkpoint")}` : ""}</small>`;
      if (!isLocked) button.addEventListener("click", () => startPage(index));
      return button;
    }));
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
    const complete = state.page >= pages.length - 1;
    $("resultTitle").textContent = complete ? t("resultTitle") : t("resultPartial");
    $("resultText").textContent = t("resultText", { count: Math.min(state.page + 1, pages.length), total: pages.length, turns: state.sessionTurns });
    $("resultPrimaryBtn").textContent = complete ? t("map") : t("next");
    $("resultPrimaryBtn").onclick = complete ? () => { show("stage"); renderStages(); } : () => startPage(state.page + 1);
    $("resultMapBtn").hidden = complete;
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
  $("startBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("mapBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("stageBackBtn").addEventListener("click", () => show("main"));
  $("battleBackBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); });
  $("resultHomeBtn").addEventListener("click", () => show("main"));
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
  $("battleSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = !$("settingsPanel").hidden; });

  applyLocale();
  show("main");
  window.__ANIMAL_FIREFLY_FOLIO_TEST__ = { pages, startPage, chooseDirection, checkRoute, getState: () => ({ ...state, route: [...state.route], cleared: [...state.cleared] }) };
})();
