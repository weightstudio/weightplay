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
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = window.__WEIGHTPLAY_ROUTE_LOCALE__ || routeLocaleMap[routeSegment] || "";
  const shellCopy = {
    en: { brand: "GENERAL", progress: "3 sky routes · 3 gusts each", stage: "STAGE MAP", battle: "BATTLE", result: "RESULT" },
    "zh-Hant": { brand: "一般", progress: "3 條天空路線 · 每條 3 陣風", stage: "天空路線", battle: "對戰", result: "結果" },
    "zh-Hans": { brand: "一般", progress: "3 条天空路线 · 每条 3 阵风", stage: "天空路线", battle: "对战", result: "结果" },
    ja: { brand: "一般", progress: "天空ルート3本 · 各3回の風", stage: "空のルート", battle: "バトル", result: "結果" },
    ko: { brand: "일반", progress: "하늘 경로 3개 · 각 3번의 바람", stage: "하늘 경로", battle: "배틀", result: "결과" },
    es: { brand: "GENERAL", progress: "3 rutas celestes · 3 ráfagas cada una", stage: "RUTAS CELESTES", battle: "BATALLA", result: "RESULTADO" },
    "pt-BR": { brand: "GERAL", progress: "3 rotas celestes · 3 rajadas cada", stage: "ROTAS CELESTES", battle: "BATALHA", result: "RESULTADO" },
    fr: { brand: "GÉNÉRAL", progress: "3 routes célestes · 3 rafales chacune", stage: "ROUTES CÉLESTES", battle: "BATAILLE", result: "RÉSULTAT" },
    de: { brand: "ALLGEMEIN", progress: "3 Himmelsrouten · je 3 Böen", stage: "HIMMELSROUTEN", battle: "BATTLE", result: "ERGEBNIS" },
    it: { brand: "GENERALE", progress: "3 rotte celesti · 3 raffiche ciascuna", stage: "ROTTE CELESTI", battle: "BATTAGLIA", result: "RISULTATO" },
    ru: { brand: "ОБЩИЕ", progress: "3 небесных маршрута · по 3 порыва", stage: "НЕБЕСНЫЕ МАРШРУТЫ", battle: "БИТВА", result: "РЕЗУЛЬТАТ" },
    hi: { brand: "सामान्य", progress: "3 आकाश मार्ग · हर एक में 3 झोंके", stage: "आकाश मार्ग", battle: "बैटल", result: "परिणाम" },
    ar: { brand: "عام", progress: "3 مسارات سماوية · 3 هبات لكل مسار", stage: "المسارات السماوية", battle: "المعركة", result: "النتيجة" },
  };
  const metadataCopy = {
    en: { kicker: "6+ · FAMILY · ORIGINAL PROTOTYPE", posterAlt: "Kite Keeper game artwork", guideAlt: "Moss Shell Taro holding a kite spool", guideLabel: "Kite Keeper game guide", resultAlt: "Moss Shell Taro celebrating with his kite" },
    "zh-Hant": { kicker: "6+ · 家庭 · 原創原型", posterAlt: "風箏守護員遊戲插畫", guideAlt: "手持風箏線軸的苔殼塔羅", guideLabel: "風箏守護員遊戲指南", resultAlt: "拿著風箏慶祝的苔殼塔羅" },
    "zh-Hans": { kicker: "6+ · 家庭 · 原创原型", posterAlt: "风筝守护员游戏插图", guideAlt: "手持风筝线轴的苔壳塔罗", guideLabel: "风筝守护员游戏指南", resultAlt: "拿着风筝庆祝的苔壳塔罗" },
    ja: { kicker: "6+ · ファミリー · オリジナル試作", posterAlt: "カイト・キーパーのゲームアート", guideAlt: "凧の糸巻きを持つモスシェル・タロ", guideLabel: "カイト・キーパーのゲームガイド", resultAlt: "凧を持って喜ぶモスシェル・タロ" },
    ko: { kicker: "6+ · 가족 · 오리지널 프로토타입", posterAlt: "카이트 키퍼 게임 아트", guideAlt: "연 실패를 들고 있는 모스 셸 타로", guideLabel: "카이트 키퍼 게임 가이드", resultAlt: "연을 들고 기뻐하는 모스 셸 타로" },
    es: { kicker: "6+ · FAMILIAR · PROTOTIPO ORIGINAL", posterAlt: "Ilustración del juego Guardián de Cometas", guideAlt: "Taro Caparazón de Musgo con un carrete de cometa", guideLabel: "Guía del juego Guardián de Cometas", resultAlt: "Taro Caparazón de Musgo celebrando con su cometa" },
    "pt-BR": { kicker: "6+ · FAMÍLIA · PROTÓTIPO ORIGINAL", posterAlt: "Arte do jogo Guardião de Pipas", guideAlt: "Taro Casco de Musgo segurando um carretel de pipa", guideLabel: "Guia do jogo Guardião de Pipas", resultAlt: "Taro Casco de Musgo comemorando com sua pipa" },
    fr: { kicker: "6+ · FAMILLE · PROTOTYPE ORIGINAL", posterAlt: "Illustration du jeu Gardien des Cerfs-volants", guideAlt: "Taro Coquille de Mousse tenant un dévidoir de cerf-volant", guideLabel: "Guide du jeu Gardien des Cerfs-volants", resultAlt: "Taro Coquille de Mousse célébrant avec son cerf-volant" },
    de: { kicker: "6+ · FAMILIE · ORIGINALES PROTOTYP", posterAlt: "Spielillustration von Drachenhüter", guideAlt: "Moosschalen-Taro mit einer Drachenschnurrolle", guideLabel: "Spielleitfaden für Drachenhüter", resultAlt: "Moosschalen-Taro feiert mit seinem Drachen" },
    it: { kicker: "6+ · FAMIGLIA · PROTOTIPO ORIGINALE", posterAlt: "Illustrazione del gioco Custode degli Aquiloni", guideAlt: "Taro Guscio di Muschio con un rocchetto per aquilone", guideLabel: "Guida al gioco Custode degli Aquiloni", resultAlt: "Taro Guscio di Muschio festeggia con il suo aquilone" },
    ru: { kicker: "6+ · СЕМЕЙНАЯ · ОРИГИНАЛЬНЫЙ ПРОТОТИП", posterAlt: "Иллюстрация игры «Хранитель воздушных змеев»", guideAlt: "Таро Моховая Ракушка с катушкой для змея", guideLabel: "Руководство по игре «Хранитель воздушных змеев»", resultAlt: "Таро Моховая Ракушка празднует со своим змеем" },
    hi: { kicker: "6+ · परिवार · मौलिक प्रोटोटाइप", posterAlt: "पतंग प्रहरी गेम चित्र", guideAlt: "मॉस शेल टारो पतंग की चरखी थामे हुए", guideLabel: "पतंग प्रहरी गेम गाइड", resultAlt: "मॉस शेल टारो अपनी पतंग के साथ जश्न मनाते हुए" },
    ar: { kicker: "6+ · عائلية · نموذج أولي أصلي", posterAlt: "رسم لعبة حارس الطائرات الورقية", guideAlt: "تارو ذو صدفة الطحلب يمسك بكرة خيط الطائرة الورقية", guideLabel: "دليل لعبة حارس الطائرات الورقية", resultAlt: "تارو ذو صدفة الطحلب يحتفل بطائرته الورقية" },
  };
  let locale = routeLocale || localStorage.getItem("weightplay-kite-keeper-locale") || "en";
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
    $("backBtn").hidden = screen !== "main";
    if ($("stageBack")) $("stageBack").hidden = screen !== "stage";
    document.querySelectorAll(".game-page-info,[data-wp-game-guide]").forEach((node) => { node.hidden = screen !== "main"; });
    if ($("battleAdReserve")) {
      $("battleAdReserve").hidden = screen !== "battle";
      $("battleAdReserve").setAttribute("aria-hidden", String(screen !== "battle"));
    }
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const shell = shellCopy[locale] || shellCopy.en;
    const metadata = metadataCopy[locale] || metadataCopy.en;
    document.querySelector(".brand .eyebrow")?.replaceChildren(document.createTextNode(`WEIGHTPLAY · ${shell.brand}`));
    document.querySelector("#mainScreen .kicker")?.replaceChildren(document.createTextNode(metadata.kicker));
    document.querySelector(".main-poster")?.setAttribute("alt", metadata.posterAlt);
    document.querySelector(".guide-character")?.setAttribute("alt", metadata.guideAlt);
    document.querySelector("#gameGuide")?.setAttribute("aria-label", metadata.guideLabel);
    document.querySelector(".result-character")?.setAttribute("alt", metadata.resultAlt);
    $("mainProgress") && ($("mainProgress").textContent = shell.progress);
    document.querySelector("#mainScreen h1")?.replaceChildren(document.createTextNode(copy("title")));
    document.querySelectorAll("#stageScreen .screen-heading .eyebrow").forEach((node) => { node.textContent = shell.stage; });
    document.querySelectorAll("#battleScreen .screen-heading .eyebrow").forEach((node) => { node.textContent = shell.battle; });
    document.querySelectorAll("#resultScreen .screen-heading .eyebrow, #resultScreen > .eyebrow").forEach((node) => { node.textContent = shell.result; });
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      if (node.dataset.i18n === "best") node.textContent = copy("best", { count: bestText() });
      else node.textContent = copy(node.dataset.i18n);
    });
    $("backBtn").setAttribute("aria-label", copy("back"));
    if ($("stageBack")) $("stageBack").setAttribute("aria-label", copy("back"));
    if ($("battleBack")) $("battleBack").setAttribute("aria-label", copy("map"));
    $("settingsBtn").setAttribute("aria-label", copy("settings"));
    $("closeSettings").setAttribute("aria-label", copy("close"));
    $("localeSelect").setAttribute("aria-label", copy("language"));
    $("soundBtn").setAttribute("aria-pressed", String(sound));
    $("soundState").textContent = sound ? copy("on") : copy("off");
    renderStages(); renderBattle(); renderResult();
  }
  function renderStages() {
    const root = $("stageList"); if (!root) return;
    root.setAttribute("role", "tablist"); root.setAttribute("aria-label", copy("map"));
    root.replaceChildren();
    routes.forEach((route, index) => {
      const button = document.createElement("button");
      button.className = "stage-card"; button.type = "button";
      button.setAttribute("role", "tab"); button.setAttribute("aria-selected", String(index === routeIndex)); button.setAttribute("aria-controls", "battleScreen"); button.tabIndex = index === routeIndex ? 0 : -1;
      button.setAttribute("aria-label", `${copy(route.name)}. ${copy(route.hint)}`);
      button.innerHTML = `<span><strong>${copy(route.name)}</strong><small>${copy(route.hint)}</small></span><span class="arrow">${solved.has(index) ? "✓" : "→"}</span>`;
      button.addEventListener("click", () => startRoute(index));
      root.appendChild(button);
    });
  }
  function handleStageKeydown(event) {
    const cards = [...document.querySelectorAll("#stageList .stage-card")]; const current = cards.indexOf(document.activeElement); if (current < 0) return;
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : delta ? (current + delta + cards.length) % cards.length : -1;
    if (nextIndex < 0 || !cards[nextIndex]) return;
    event.preventDefault(); cards.forEach((card, index) => { card.tabIndex = index === nextIndex ? 0 : -1; }); cards[nextIndex].focus();
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
      button.setAttribute("data-wp-primary-action", "wind");
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
    $("startBtn").addEventListener("click", () => { try { show("stage"); renderStages(); } catch (error) { document.body.dataset.kiteError = String(error); } }); $("mapBtn").addEventListener("click", () => { try { show("stage"); renderStages(); } catch (error) { document.body.dataset.kiteError = String(error); } }); $("stageList").addEventListener("keydown", handleStageKeydown);
    $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextRoute);
    $("resetBtn").addEventListener("click", resetRoute); $("battleBack").addEventListener("click", () => { show("stage"); renderStages(); }); $("stageBack").addEventListener("click", () => { show("main"); });
    $("settingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = false; }); $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundBtn").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-kite-keeper-sound", sound ? "on" : "off"); applyLocale(); });
    $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-kite-keeper-locale", locale); applyLocale(); });
    $("backBtn").addEventListener("click", goLobby); $("homeBtn").addEventListener("click", goLobby);
  }
  function boot() { bind(); $("localeSelect").value = locale; $("loading").hidden = true; $("app").hidden = false; show("main"); applyLocale(); announce("loaded"); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
