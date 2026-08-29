(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locales = window.KITE_KEEPER_LOCALES || { en: {
    title: "Kite Keeper", subtitle: "Choose the wind. Find the lantern dock.", guideTitle: "How to play", guide: "Choose one wind card at a time. Reach the lantern dock in exactly three gusts.", start: "Start a sky route", map: "Sky routes", settings: "Settings", close: "Close settings", language: "Language", sound: "Sound", on: "On", off: "Off", best: "Best checks: {count}", route1: "Meadow Lift", route2: "Reef Breeze", route3: "Snow Lantern", hint1: "East, north, east", hint2: "North, west, north", hint3: "East, south, east", routePrompt: "Read the dock marker, then choose the next wind.", dock: "Lantern dock", wind: "Wind cards", north: "North", east: "East", south: "South", west: "West", position: "Kite position: {x}, {y}", gusts: "Gusts: {count} / 3", choose: "Choose a wind card", selected: "Wind chosen: {name}", wrong: "That gust drifts away from the dock. Try the route again.", correct: "Perfect flight! The kite reached the lantern dock.", reset: "Reset route", resultTitle: "Route complete", resultText: "You guided the kite with {checks} checks.", next: "Next route", finished: "All sky routes complete", back: "Back to General lobby", ariaKite: "Kite flight board"
  } };
  const routes = [
    { id: 1, name: "route1", hint: "hint1", start: [0, 2], target: [2, 1], sequence: ["east", "north", "east"] },
    { id: 2, name: "route2", hint: "hint2", start: [3, 2], target: [2, 0], sequence: ["north", "west", "north"] },
    { id: 3, name: "route3", hint: "hint3", start: [0, 0], target: [2, 1], sequence: ["east", "south", "east"] },
  ];
  const vectors = { north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] };
  let locale = localStorage.getItem("weightplay-kite-keeper-locale") || "en";
  if (!locales[locale]) locale = "en";
  let sound = localStorage.getItem("weightplay-kite-keeper-sound") !== "off";
  let routeIndex = 0;
  let position = [0, 0];
  let path = [];
  let checks = 0;
  let runChecks = 0;
  let solved = new Set();
  let complete = false;
  let locked = false;

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `kite_keeper_${name}`, route: routeIndex + 1, gust: path.length, ...data }); };
  const bestValue = () => Number(localStorage.getItem("weightplay-kite-keeper-best-v1") || 0);
  const bestText = () => bestValue() || "—";
  function show(screen) {
    document.querySelectorAll("[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; });
    $("settingsPanel").hidden = true;
    $("backBtn").hidden = screen === "main";
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      if (node.dataset.i18n === "best") node.textContent = copy("best", { count: bestText() });
      else node.textContent = copy(node.dataset.i18n);
    });
    $("backBtn").setAttribute("aria-label", copy("back"));
    $("settingsBtn").setAttribute("aria-label", copy("settings"));
    $("closeSettings").setAttribute("aria-label", copy("close"));
    $("localeSelect").setAttribute("aria-label", copy("language"));
    $("soundBtn").setAttribute("aria-pressed", String(sound));
    $("soundState").textContent = sound ? copy("on") : copy("off");
    renderStages(); renderBattle(); renderResult();
  }
  function renderStages() {
    const root = $("stageList"); if (!root) return;
    root.replaceChildren();
    routes.forEach((route, index) => {
      const button = document.createElement("button");
      button.className = "stage-card"; button.type = "button";
      button.innerHTML = `<span><strong>${copy(route.name)}</strong><small>${copy(route.hint)}</small></span><span class="arrow">${solved.has(index) ? "✓" : "→"}</span>`;
      button.addEventListener("click", () => startRoute(index));
      root.appendChild(button);
    });
  }
  function startRoute(index) {
    routeIndex = index; const route = routes[index];
    position = [...route.start]; path = []; checks = 0; locked = false;
    show("battle"); renderBattle(); $("status").textContent = ""; $("status").className = "status";
    announce("start");
  }
  function markerPosition(coords) {
    const [x, y] = coords;
    return { left: `${10 + (x / 3) * 70}%`, top: `${18 + (y / 2) * 64}%` };
  }
  function renderBattle() {
    const route = routes[routeIndex]; if (!route || !$("windGrid")) return;
    $("routeTitle").textContent = copy(route.name); $("progressPill").textContent = `${routeIndex + 1} / ${routes.length}`;
    $("prompt").textContent = `${copy(route.hint)} · ${copy("routePrompt")}`;
    $("dockTarget").textContent = `${route.target[0]}, ${route.target[1]}`;
    $("position").textContent = copy("position", { x: position[0], y: position[1] });
    $("gusts").textContent = copy("gusts", { count: path.length });
    $("flightBoard").setAttribute("aria-label", `${copy("ariaKite")}. ${copy("position", { x: position[0], y: position[1] })}`);
    const kite = markerPosition(position); $("kiteMarker").style.left = kite.left; $("kiteMarker").style.top = kite.top;
    const dock = markerPosition(route.target); $("dockMarker").style.left = dock.left; $("dockMarker").style.top = dock.top;
    const root = $("windGrid"); root.replaceChildren();
    ["north", "east", "south", "west"].forEach((direction) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "wind-card";
      button.setAttribute("role", "listitem"); button.disabled = locked || path.length >= 3;
      button.setAttribute("aria-selected", String(path.at(-1) === direction));
      button.innerHTML = `<span>${direction === "north" ? "↑" : direction === "east" ? "→" : direction === "south" ? "↓" : "←"}</span><small>${copy(direction)}</small>`;
      button.addEventListener("click", () => chooseWind(direction)); root.appendChild(button);
    });
    $("selection").textContent = path.length ? copy("selected", { name: copy(path.at(-1)) }) : copy("choose");
  }
  function chooseWind(direction) {
    if (locked || path.length >= 3) return;
    checks += 1; runChecks += 1; path.push(direction);
    const vector = vectors[direction]; position = [position[0] + vector[0], position[1] + vector[1]];
    const inBounds = position[0] >= 0 && position[0] <= 3 && position[1] >= 0 && position[1] <= 2;
    announce("gust", { direction, inBounds });
    if (!inBounds || (path.length === 3 && (position[0] !== routes[routeIndex].target[0] || position[1] !== routes[routeIndex].target[1]))) {
      locked = true; renderBattle(); $("status").textContent = copy("wrong"); $("status").className = "status try"; announce("wrong"); return;
    }
    renderBattle();
    if (path.length === 3) {
      locked = true; solved.add(routeIndex); $("status").textContent = copy("correct"); $("status").className = "status good"; announce("correct", { checks });
      window.setTimeout(() => { show("result"); renderResult(); }, 360);
    }
  }
  function resetRoute() {
    const route = routes[routeIndex]; position = [...route.start]; path = []; checks = 0; locked = false;
    renderBattle(); $("status").textContent = ""; $("status").className = "status"; announce("reset");
  }
  function renderResult() {
    if (!$("resultText")) return;
    complete = solved.size === routes.length;
    $("resultTitle").textContent = complete ? copy("finished") : copy("resultTitle");
    $("resultText").textContent = copy("resultText", { checks });
    $("nextBtn").hidden = complete;
    $("resultMapBtn").hidden = false;
    if (complete) {
      const old = bestValue(); if (!old || runChecks < old) localStorage.setItem("weightplay-kite-keeper-best-v1", String(runChecks));
      $("best").textContent = copy("best", { count: bestText() });
    }
  }
  function nextRoute() { const next = routeIndex + 1; if (next < routes.length) startRoute(next); else { show("stage"); renderStages(); } }
  function goLobby() { window.location.href = "../../index.html"; }
  function bind() {
    $("startBtn").addEventListener("click", () => { try { startRoute(0); } catch (error) { document.body.dataset.kiteError = String(error); } }); $("mapBtn").addEventListener("click", () => { try { show("stage"); renderStages(); } catch (error) { document.body.dataset.kiteError = String(error); } });
    $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextRoute);
    $("resetBtn").addEventListener("click", resetRoute); $("battleBack").addEventListener("click", () => { show("stage"); renderStages(); });
    $("settingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundBtn").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-kite-keeper-sound", sound ? "on" : "off"); applyLocale(); });
    $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-kite-keeper-locale", locale); applyLocale(); });
    $("backBtn").addEventListener("click", goLobby); $("homeBtn").addEventListener("click", goLobby);
  }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); applyLocale(); announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
