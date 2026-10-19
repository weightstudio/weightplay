(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const locales = window.KITE_KEEPER_LOCALES;
  if (!locales) throw new Error("Kite Keeper locale data is unavailable");
  const vectors = { north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] };
  const routeFixtures = [
    { start: [0, 2], sequence: ["east", "north", "east"] },
    { start: [3, 2], sequence: ["north", "west", "north"] },
    { start: [0, 0], sequence: ["east", "south", "east"] },
    { start: [2, 2], sequence: ["west", "north", "east"] },
    { start: [1, 1], sequence: ["north", "east", "south"] },
    { start: [2, 0], sequence: ["south", "west", "north"] },
    { start: [0, 1], sequence: ["east", "east", "north"] },
    { start: [3, 0], sequence: ["west", "south", "east"] },
    { start: [3, 2], sequence: ["north", "north", "west"] },
    { start: [1, 0], sequence: ["south", "east", "north"] },
    { start: [0, 2], sequence: ["east", "north", "south"] },
    { start: [0, 2], sequence: ["east", "north", "west"] },
    { start: [0, 0], sequence: ["east", "south", "north"] },
    { start: [0, 1], sequence: ["east", "south", "west"] },
    { start: [1, 1], sequence: ["east", "west", "north"] },
    { start: [2, 0], sequence: ["east", "west", "south"] },
    { start: [0, 1], sequence: ["north", "east", "west"] },
    { start: [0, 2], sequence: ["north", "south", "east"] },
    { start: [3, 2], sequence: ["north", "south", "west"] },
    { start: [1, 2], sequence: ["north", "west", "east"] },
    { start: [1, 2], sequence: ["north", "west", "south"] },
    { start: [0, 1], sequence: ["south", "east", "west"] },
    { start: [0, 0], sequence: ["south", "north", "east"] },
    { start: [1, 1], sequence: ["south", "north", "west"] },
    { start: [1, 1], sequence: ["south", "west", "east"] },
    { start: [1, 2], sequence: ["west", "east", "north"] },
    { start: [1, 1], sequence: ["west", "east", "south"] },
    { start: [1, 2], sequence: ["west", "north", "south"] },
    { start: [1, 1], sequence: ["west", "south", "north"] },
    { start: [1, 0], sequence: ["east", "west", "east"] },
  ];
  const routes = routeFixtures.map(({ start, sequence }, index) => {
    const target = sequence.reduce((point, direction) => [point[0] + vectors[direction][0], point[1] + vectors[direction][1]], [...start]);
    return { id: index + 1, name: `route${(index % 3) + 1}`, start, target, sequence };
  });
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = window.__WEIGHTPLAY_ROUTE_LOCALE__ || routeLocaleMap[routeSegment] || "";
  const shellCopy = {
    en: { brand: "GENERAL", progress: "30 sky routes · 3 gusts each", stage: "STAGE MAP", battle: "BATTLE", result: "RESULT" },
    "zh-Hant": { brand: "一般", progress: "30 條天空路線 · 每條 3 陣風", stage: "天空路線", battle: "對戰", result: "結果" },
    "zh-Hans": { brand: "一般", progress: "30 条天空路线 · 每条 3 阵风", stage: "天空路线", battle: "对战", result: "结果" },
    ja: { brand: "一般", progress: "天空ルート30本 · 各3回の風", stage: "空のルート", battle: "バトル", result: "結果" },
    ko: { brand: "일반", progress: "하늘 경로 30개 · 각 3번의 바람", stage: "하늘 경로", battle: "배틀", result: "결과" },
    es: { brand: "GENERAL", progress: "30 rutas celestes · 3 ráfagas cada una", stage: "RUTAS CELESTES", battle: "BATALLA", result: "RESULTADO" },
    "pt-BR": { brand: "GERAL", progress: "30 rotas celestes · 3 rajadas cada", stage: "ROTAS CELESTES", battle: "BATALHA", result: "RESULTADO" },
    fr: { brand: "GÉNÉRAL", progress: "30 routes célestes · 3 rafales chacune", stage: "ROUTES CÉLESTES", battle: "BATAILLE", result: "RÉSULTAT" },
    de: { brand: "ALLGEMEIN", progress: "30 Himmelsrouten · je 3 Böen", stage: "HIMMELSROUTEN", battle: "BATTLE", result: "ERGEBNIS" },
    it: { brand: "GENERALE", progress: "30 rotte celesti · 3 raffiche ciascuna", stage: "ROTTE CELESTI", battle: "BATTAGLIA", result: "RISULTATO" },
    ru: { brand: "ОБЩИЕ", progress: "30 небесных маршрутов · по 3 порыва", stage: "НЕБЕСНЫЕ МАРШРУТЫ", battle: "БИТВА", result: "РЕЗУЛЬТАТ" },
    hi: { brand: "सामान्य", progress: "30 आकाश मार्ग · हर एक में 3 झोंके", stage: "आकाश मार्ग", battle: "बैटल", result: "परिणाम" },
    ar: { brand: "عام", progress: "30 مسارًا سماويًا · 3 هبات لكل مسار", stage: "المسارات السماوية", battle: "المعركة", result: "النتيجة" },
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
  function readStorage(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch { return fallback; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, String(value)); return true; } catch { return false; }
  }
  let locale = routeLocale || readStorage("weightplay-kite-keeper-locale", "en");
  if (!locales[locale]) locale = "en";
  const copy = (key, vars = {}) => Object.entries(vars).reduce(
    (out, [name, value]) => out.split("{" + name + "}").join(String(value)),
    (locales[locale] || locales.en)[key] || locales.en[key] || key,
  );
  const routeLabel = route => copy(route.name) + " " + route.id;
  const routeHint = route => route.sequence.map(direction => copy(direction)).join(" · ");
  const announce = (name, data = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "kite_keeper_" + name, route: routeIndex + 1, gust: path.length, ...data });
  };
  const bestValue = () => Number(readStorage("weightplay-kite-keeper-best-v1", "0")) || 0;
  const bestText = () => bestValue() || "—";
  const reducedMotionRequested = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  let routeIndex = 0;
  let stageBrowseIndex = 0;
  let position = [0, 0];
  let path = [];
  let checks = 0;
  let runChecks = 0;
  let solved = new Set();
  try {
    const stored = JSON.parse(readStorage("weightplay-kite-keeper-solved-v1", "[]"));
    if (Array.isArray(stored)) solved = new Set(stored.filter(id => Number.isInteger(id) && id >= 1 && id <= routes.length));
  } catch {}
  let locked = false;
  let complete = false;
  let resultTimer = 0;
  let resultAnimation = null;
  let resultMotionToken = 0;
  let resultClosing = false;
  let routeAttemptToken = 0;
  let stageController = null;
  const battleContent = $("battleContent");
  const resultLayer = $("resultScreen");
  const resultCard = $("resultCard");
  const localeSelect = $("localeSelect");
  let frameHost;
  try {
    frameHost = window.mountKiteKeeperFrame();
  } catch (error) {
    document.body.dataset.kiteError = String(error);
    window.WeightPlayGameEntryLoader?.fail?.();
    return;
  }
  const frame = frameHost.frame;
  const activateScene = frameHost.activate;
  const storageSound = readStorage("weightplay-kite-keeper-sound");
  if ((storageSound === "on" || storageSound === "off") && readStorage("wonderSoundMuted") === null) {
    window.WeightPlayAudio?.setMuted?.(storageSound === "off");
  }
  const syncLegacySoundPreference = () => {
    if (typeof window.WeightPlayAudio?.isMuted !== "function") return;
    writeStorage("weightplay-kite-keeper-sound", window.WeightPlayAudio.isMuted() ? "off" : "on");
  };
  window.addEventListener("weightplay:audio-volume-change", syncLegacySoundPreference);

  let feedbackReady = false;
  function animateFeedback(node, duration = 130) {
    if (!feedbackReady || !node?.animate || reducedMotionRequested() || node.closest("[hidden],[inert]")) return;
    node.getAnimations().forEach(animation => animation.cancel());
    const animation = node.animate([{ opacity: 0.68 }, { opacity: 1 }], { duration, easing: "ease-out" });
    animation.onfinish = () => animation.cancel();
  }
  function setFeedbackText(node, value) {
    if (!node) return;
    const next = String(value ?? "");
    if (node.textContent === next) return;
    node.textContent = next;
    if (next) animateFeedback(node);
  }
  function announceKiteMovement() {
    const marker = $("kiteMarker");
    if (!marker?.animate) return;
    marker.getAnimations().forEach(animation => animation.cancel());
    if (reducedMotionRequested()) {
      marker.animate([{ opacity: 0.72 }, { opacity: 1 }], { duration: 80, easing: "ease-out" });
    }
  }
  function updateStageProgress() {
    frameHost.stageProgress.textContent = (stageBrowseIndex + 1) + " / " + routes.length;
    frameHost.stageProgress.setAttribute("aria-label", copy("map") + " " + (stageBrowseIndex + 1) + " / " + routes.length);
  }
  function stageRecord(index) {
    const route = routes[index];
    return {
      id: route.id,
      kicker: copy("map"),
      title: routeLabel(route),
      subtitle: routeHint(route),
      status: solved.has(route.id) ? "✓" : "",
      summary: copy("routePrompt"),
      details: [routeHint(route)],
      poster: "/games/animal-kite-keeper/assets/animal-kite-keeper-cover-block-v1.webp",
      locked: false,
      cleared: solved.has(route.id),
    };
  }
  try {
    stageController = window.WeightPlayPlayUI.mountStage({
      page: $("stageWorkspace"),
      rail: $("stageList"),
      selected: stageBrowseIndex,
      config: {
        count: routes.length,
        poster: "/games/animal-kite-keeper/assets/animal-kite-keeper-cover-block-v1.webp",
        background: "/assets/lobby-block-atmosphere.svg",
        stage: stageRecord,
      },
      onSelect(index) {
        stageBrowseIndex = index;
        updateStageProgress();
      },
      onStart: index => startRoute(index),
      isActive: () => frame.active === "stage",
    });
  } catch (error) {
    document.body.dataset.kiteError = String(error);
    window.WeightPlayGameEntryLoader?.fail?.();
    return;
  }

  function renderStages() {
    updateStageProgress();
    stageController.refresh(stageBrowseIndex);
  }
  function activateMain() {
    cancelPendingResult();
    activateScene("main");
  }
  function activateStage() {
    cancelPendingResult();
    activateScene("stage");
    renderStages();
  }
  function clearResultMotion() {
    resultMotionToken += 1;
    if (resultAnimation) {
      resultAnimation.onfinish = null;
      resultAnimation.cancel();
      resultAnimation = null;
    }
  }
  function animateResult(opening, finish) {
    clearResultMotion();
    const token = resultMotionToken;
    const duration = reducedMotionRequested() ? 0 : (opening ? 180 : 130);
    if (!duration || !resultCard?.animate) {
      finish?.();
      return;
    }
    const frames = opening
      ? [{ opacity: 0, transform: "translateY(10px) scale(.97)" }, { opacity: 1, transform: "none" }]
      : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(6px) scale(.98)" }];
    resultAnimation = resultCard.animate(frames, { duration, easing: opening ? "cubic-bezier(.2,.75,.2,1)" : "ease-in", fill: "both" });
    resultAnimation.onfinish = () => {
      if (token !== resultMotionToken) return;
      resultAnimation?.cancel();
      resultAnimation = null;
      finish?.();
    };
  }
  function openResult() {
    if (frame.active !== "battle" || resultClosing) return;
    complete = solved.size === routes.length;
    renderResult();
    battleContent.inert = true;
    battleContent.setAttribute("aria-hidden", "true");
    activateScene("battle", { covered: true });
    resultLayer.hidden = false;
    animateResult(true);
  }
  function closeResult(after) {
    if (resultLayer.hidden || resultClosing) return;
    resultClosing = true;
    animateResult(false, () => {
      resultLayer.hidden = true;
      battleContent.inert = false;
      battleContent.removeAttribute("aria-hidden");
      resultClosing = false;
      activateScene("battle");
      after?.();
    });
  }
  function cancelPendingResult() {
    if (resultTimer) window.clearTimeout(resultTimer);
    resultTimer = 0;
    routeAttemptToken += 1;
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const shell = shellCopy[locale] || shellCopy.en;
    const metadata = metadataCopy[locale] || metadataCopy.en;
    setFeedbackText($("mainTitle"), copy("title"));
    setFeedbackText(document.querySelector("#mainScreen .main-copy .eyebrow"), metadata.kicker);
    document.querySelector(".main-poster")?.setAttribute("alt", metadata.posterAlt);
    document.querySelector(".guide-character")?.setAttribute("alt", metadata.guideAlt);
    $("gameGuide")?.setAttribute("aria-label", metadata.guideLabel);
    document.querySelector(".result-character")?.setAttribute("alt", metadata.resultAlt);
    setFeedbackText($("mainProgress"), shell.progress);
    document.querySelectorAll("[data-i18n]").forEach(node => {
      const key = node.dataset.i18n;
      setFeedbackText(node, key === "best" ? copy("best", { count: bestText() }) : copy(key));
    });
    document.querySelectorAll("#routeFamilyNav [data-route-family]").forEach(button => {
      button.setAttribute("aria-label", copy(button.dataset.i18n));
    });
    localeSelect.value = locale;
    frame.refresh();
    stageController.refresh(stageBrowseIndex);
    renderBattle();
    renderResult();
  }
  function renderBattle() {
    const route = routes[routeIndex];
    if (!route || !$("windGrid")) return;
    setFeedbackText(frameHost.routeTitle, routeLabel(route));
    setFeedbackText(frameHost.progressPill, (routeIndex + 1) + " / " + routes.length);
    setFeedbackText($("prompt"), routeHint(route) + " · " + copy("routePrompt"));
    setFeedbackText($("dockTarget"), route.target[0] + ", " + route.target[1]);
    setFeedbackText($("position"), copy("position", { x: position[0], y: position[1] }));
    setFeedbackText($("gusts"), copy("gusts", { count: path.length }));
    $("flightBoard").setAttribute("aria-label", copy("ariaKite") + ". " + copy("position", { x: position[0], y: position[1] }));
    const kite = markerPosition(position);
    $("kiteMarker").style.left = kite.left;
    $("kiteMarker").style.top = kite.top;
    const dock = markerPosition(route.target);
    $("dockMarker").style.left = dock.left;
    $("dockMarker").style.top = dock.top;
    const grid = $("windGrid");
    grid.replaceChildren();
    ["north", "east", "south", "west"].forEach(direction => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wind-card";
      button.disabled = locked || path.length >= 3;
      button.setAttribute("aria-pressed", String(path.at(-1) === direction));
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = direction === "north" ? "↑" : direction === "east" ? "→" : direction === "south" ? "↓" : "←";
      const label = document.createElement("small");
      label.textContent = copy(direction);
      button.setAttribute("aria-label", copy(direction));
      button.append(arrow, label);
      button.addEventListener("click", () => chooseWind(direction));
      grid.append(button);
    });
    setFeedbackText($("selection"), path.length ? copy("selected", { name: copy(path.at(-1)) }) : copy("choose"));
  }
  function renderResult() {
    complete = solved.size === routes.length;
    setFeedbackText($("resultTitle"), complete ? copy("finished") : copy("resultTitle"));
    setFeedbackText($("resultText"), copy("resultText", { checks }));
    setFeedbackText($("resultLabel"), shellCopy[locale]?.result || shellCopy.en.result);
    const hasNext = routeIndex + 1 < routes.length;
    $("nextBtn").disabled = complete || !hasNext;
    $("nextBtn").setAttribute("aria-label", copy("next"));
    if (complete) {
      const oldBest = bestValue();
      if (!oldBest || runChecks < oldBest) writeStorage("weightplay-kite-keeper-best-v1", runChecks);
      setFeedbackText($("best"), copy("best", { count: bestText() }));
    }
  }
  function markerPosition(coords) {
    const [x, y] = coords;
    return { left: (10 + (x / 3) * 70) + "%", top: (18 + (y / 2) * 64) + "%" };
  }
  function startRoute(index) {
    cancelPendingResult();
    clearResultMotion();
    resultLayer.hidden = true;
    battleContent.inert = false;
    battleContent.removeAttribute("aria-hidden");
    resultClosing = false;
    routeIndex = Math.max(0, Math.min(routes.length - 1, Number(index) || 0));
    stageBrowseIndex = routeIndex;
    position = [...routes[routeIndex].start];
    path = [];
    checks = 0;
    locked = false;
    renderBattle();
    $("status").className = "status";
    setFeedbackText($("status"), "");
    activateScene("battle");
    announce("start");
  }
  function chooseWind(direction) {
    if (locked || frame.active !== "battle" || path.length >= 3) return;
    checks += 1;
    runChecks += 1;
    path.push(direction);
    const vector = vectors[direction];
    position = [position[0] + vector[0], position[1] + vector[1]];
    const inBounds = position[0] >= 0 && position[0] <= 3 && position[1] >= 0 && position[1] <= 2;
    announce("gust", { direction, inBounds });
    if (!inBounds || (path.length === 3 && (position[0] !== routes[routeIndex].target[0] || position[1] !== routes[routeIndex].target[1]))) {
      locked = true;
      renderBattle();
      setFeedbackText($("status"), copy("wrong"));
      $("status").className = "status try";
      announceKiteMovement();
      announce("wrong");
      return;
    }
    renderBattle();
    announceKiteMovement();
    if (path.length === 3) {
      locked = true;
      solved.add(routes[routeIndex].id);
      writeStorage("weightplay-kite-keeper-solved-v1", JSON.stringify([...solved].sort((a, b) => a - b)));
      setFeedbackText($("status"), copy("correct"));
      $("status").className = "status good";
      announce("correct", { checks });
      stageController.refresh(stageBrowseIndex);
      const token = routeAttemptToken;
      const completedRoute = routeIndex;
      resultTimer = window.setTimeout(() => {
        resultTimer = 0;
        if (routeAttemptToken !== token || routeIndex !== completedRoute || frame.active !== "battle") return;
        openResult();
      }, 360);
    }
  }
  function resetRoute() {
    cancelPendingResult();
    const route = routes[routeIndex];
    position = [...route.start];
    path = [];
    checks = 0;
    locked = false;
    renderBattle();
    announceKiteMovement();
    $("status").className = "status";
    setFeedbackText($("status"), "");
    announce("reset");
  }
  function nextRoute() {
    if (routeIndex + 1 < routes.length) startRoute(routeIndex + 1);
  }
  function bind() {
    $("startBtn").addEventListener("click", activateStage);
    $("stageBack").addEventListener("click", activateMain);
    $("battleBack").addEventListener("click", activateStage);
    $("resetBtn").addEventListener("click", resetRoute);
    $("resultStagesBtn").addEventListener("click", () => closeResult(activateStage));
    $("nextBtn").addEventListener("click", () => {
      if (complete) return;
      closeResult(nextRoute);
    });
    $("replayBtn").addEventListener("click", () => closeResult(resetRoute));
    frameHost.familyButtons.forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.routeFamily) * 10;
        if (!Number.isInteger(index) || frame.active !== "stage") return;
        stageController.select(index, { focus: true });
      });
    });
    localeSelect.value = locale;
    localeSelect.addEventListener("change", event => {
      if (!locales[event.target.value]) return;
      locale = event.target.value;
      writeStorage("weightplay-kite-keeper-locale", locale);
      writeStorage("weightPlayLocale", locale);
      applyLocale();
    });
    window.addEventListener("weightplay:screen-change", event => {
      if (event.detail?.owner === $("gameFrame") && event.detail.screen !== "battle") cancelPendingResult();
    });
    window.addEventListener("pagehide", () => {
      cancelPendingResult();
      clearResultMotion();
      stageController.destroy();
      frame.destroy();
      window.removeEventListener("weightplay:audio-volume-change", syncLegacySoundPreference);
    }, { once: true });
  }
  function boot() {
    try {
      bind();
      applyLocale();
      renderStages();
      renderBattle();
      renderResult();
      activateScene("main");
      feedbackReady = true;
      document.body.removeAttribute("aria-busy");
      window.WeightPlayGameEntryLoader?.ready?.();
      announce("loaded");
    } catch (error) {
      document.body.dataset.kiteError = String(error);
      window.WeightPlayGameEntryLoader?.fail?.();
    }
  }
  boot();

})();
