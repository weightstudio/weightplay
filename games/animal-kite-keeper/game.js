(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const interface7Base = new URL(".", document.currentScript?.src || new URL("game.js", document.baseURI));
  function waitForInterface7Assets() {
    const stylesheetReady = new Promise((resolve) => {
      let link = document.querySelector('link[href*="interface-7-cleanup.css"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL("interface-7-cleanup.css?v=20260929-kite-keeper-v14-result-lifecycle", interface7Base).href;
        document.head.appendChild(link);
      }
      if (link.sheet) { resolve(); return; }
      link.addEventListener("load", resolve, { once: true });
      link.addEventListener("error", () => {
        document.documentElement.dataset.wpKiteKeeperI7AssetError = "css";
        resolve();
      }, { once: true });
    });

    const compatReady = new Promise((resolve) => {
      if (window.__wpKiteKeeperI7CompatReady) { resolve(); return; }
      window.addEventListener("weightplay:kite-keeper-i7-ready", resolve, { once: true });
      let script = document.querySelector('script[src*="interface-7-compat.js"]');
      if (!script) {
        script = document.createElement("script");
        script.src = new URL("interface-7-compat.js?v=20260929-kite-keeper-v14-result-lifecycle", interface7Base).href;
        script.async = false;
        script.addEventListener("error", () => {
          document.documentElement.dataset.wpKiteKeeperI7AssetError = "js";
          resolve();
        }, { once: true });
        document.head.appendChild(script);
      } else if (window.__wpKiteKeeperI7CompatReady) {
        resolve();
      }
    });

    return Promise.all([stylesheetReady, compatReady]);
  }
  function waitForBattleCanvasRuntime() {
    if (typeof window.WeightPlayBattleCanvas?.sync === "function") return Promise.resolve(true);
    return new Promise((resolve) => {
      let settled = false;
      let timer = 0;
      let observedScript = null;
      let observer;
      const finish = (ready, reason = "") => {
        if (settled) return;
        settled = true;
        observer?.disconnect();
        window.clearTimeout(timer);
        if (!ready) document.documentElement.dataset.wpKiteKeeperBattleCanvasError = reason || "unavailable";
        resolve(ready);
      };
      const inspect = () => {
        if (typeof window.WeightPlayBattleCanvas?.sync === "function") { finish(true); return; }
        const script = [...document.scripts].find((node) => node.src.includes("battle-canvas-standard.js"));
        if (script && script !== observedScript) {
          observedScript = script;
          script.addEventListener("load", inspect, { once: true });
          script.addEventListener("error", () => finish(false, "script-error"), { once: true });
        }
      };
      observer = new MutationObserver(inspect);
      observer.observe(document.documentElement, { childList: true, subtree: true });
      timer = window.setTimeout(() => finish(false, "timeout"), 5000);
      inspect();
    });
  }
  const locales = window.KITE_KEEPER_LOCALES || { en: {
    title: "Kite Keeper", subtitle: "Choose the wind. Find the lantern dock.", guideTitle: "How to play", guide: "Choose one wind card at a time. Reach the lantern dock in exactly three gusts.", start: "Start a sky route", map: "Sky routes", settings: "Settings", close: "Close settings", language: "Language", sound: "Sound", on: "On", off: "Off", best: "Best checks: {count}", route1: "Meadow Lift", route2: "Reef Breeze", route3: "Snow Lantern", hint1: "East, north, east", hint2: "North, west, north", hint3: "East, south, east", routePrompt: "Read the dock marker, then choose the next wind.", dock: "Lantern dock", wind: "Wind cards", north: "North", east: "East", south: "South", west: "West", position: "Kite position: {x}, {y}", gusts: "Gusts: {count} / 3", choose: "Choose a wind card", selected: "Wind chosen: {name}", wrong: "That gust drifts away from the dock. Try the route again.", correct: "Perfect flight! The kite reached the lantern dock.", reset: "Reset route", resultTitle: "Route complete", resultText: "You guided the kite with {checks} checks.", next: "Next route", finished: "All sky routes complete", back: "Back to General lobby", ariaKite: "Kite flight board", layoutLoadError: "Game screen failed to load. Reload to retry."
  } };
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
  let locale = routeLocale || localStorage.getItem("weightplay-kite-keeper-locale") || "en";
  if (!locales[locale]) locale = "en";
  let sound = localStorage.getItem("weightplay-kite-keeper-sound") !== "off";
  let routeIndex = 0;
  let stageBrowseIndex = 0;
  let stageController = null;
  let position = [0, 0];
  let path = [];
  let checks = 0;
  let runChecks = 0;
  const solvedStorageKey = "weightplay-kite-keeper-solved-v1";
  function readSolvedRouteIds() {
    try {
      const stored = JSON.parse(localStorage.getItem(solvedStorageKey) || "[]");
      return new Set(Array.isArray(stored) ? stored.filter((id) => Number.isInteger(id) && id >= 1 && id <= routes.length) : []);
    } catch { return new Set(); }
  }
  function saveSolvedRouteIds() {
    try { localStorage.setItem(solvedStorageKey, JSON.stringify([...solved].sort((a, b) => a - b))); } catch {}
  }
  let solved = readSolvedRouteIds();
  let complete = false;
  let locked = false;
  let resultTimer = 0;

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const routeLabel = (route) => `${copy(route.name)} ${route.id}`;
  const routeHint = (route) => route.sequence.map((direction) => copy(direction)).join(" · ");
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `kite_keeper_${name}`, route: routeIndex + 1, gust: path.length, ...data }); };
  const bestValue = () => Number(localStorage.getItem("weightplay-kite-keeper-best-v1") || 0);
  const bestText = () => bestValue() || "—";
  const motionDuration = (duration) => reducedMotionRequested() ? 80 : duration;
  let feedbackReady = false;
  let sceneInitialized = false;
  let sceneTransitionToken = 0;
  const sceneProxies = new Set();
  const sceneProxyStyles = new WeakMap();
  const overlayMotionOpen = new WeakSet();
  const overlayMotionClosing = new WeakSet();
  const overlayMotionTokens = new WeakMap();
  const reducedMotionRequested = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  function animateFeedback(node, duration = 140) {
    if (!feedbackReady || !node?.animate || node.closest("[hidden],[inert],[data-kite-scene-proxy]")) return;
    node.getAnimations().forEach((animation) => animation.cancel());
    node.animate([{ opacity: 0.58 }, { opacity: 1 }], {
      duration: motionDuration(duration),
      easing: "ease-out",
    });
  }
  function setFeedbackText(node, value) {
    if (!node) return;
    const next = String(value ?? "");
    if (node.textContent === next) return;
    const wasVisible = Boolean(node.textContent);
    node.textContent = next;
    if (!feedbackReady) return;
    if (!next && wasVisible && node.animate) {
      node.getAnimations().forEach((animation) => animation.cancel());
      node.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: motionDuration(120),
        easing: "ease-in",
      });
    } else if (next) {
      animateFeedback(node);
    }
  }
  function acknowledgeKiteMovement() {
    if (!reducedMotionRequested()) return;
    const marker = $("kiteMarker");
    if (!marker?.animate) return;
    marker.getAnimations().forEach((animation) => animation.cancel());
    marker.animate([{ opacity: 0.58 }, { opacity: 1 }], { duration: 80, easing: "ease-out" });
  }
  function clearSceneProxies() {
    sceneProxies.forEach((node) => {
      node.getAnimations().forEach((animation) => animation.cancel());
      node.remove();
      sceneProxyStyles.get(node)?.remove();
    });
    sceneProxies.clear();
  }
  function createSceneProxy(source) {
    const rect = source.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2 || rect.bottom <= 0 || rect.top >= window.innerHeight
      || rect.right <= 0 || rect.left >= window.innerWidth) return null;
    const proxy = source.cloneNode(true);
    proxy.removeAttribute("data-screen");
    proxy.setAttribute("aria-hidden", "true");
    proxy.inert = true;
    const proxyStyle = document.createElement("style");
    proxyStyle.dataset.kiteSceneSnapshot = "true";
    document.head.appendChild(proxyStyle);
    const sourceNodes = [source, ...source.querySelectorAll("*")];
    const proxyNodes = [proxy, ...proxy.querySelectorAll("*")];
    sourceNodes.forEach((sourceNode, index) => {
      const proxyNode = proxyNodes[index];
      proxyNode.removeAttribute("id");
      proxyNode.removeAttribute("class");
      [...proxyNode.attributes].forEach((attribute) => {
        if (attribute.name.startsWith("data-")) proxyNode.removeAttribute(attribute.name);
      });
      const key = `${sceneTransitionToken}-${sceneProxies.size}-${index}`;
      proxyNode.dataset.kiteSceneSnapshot = key;
      const copyStyle = (computed, destination) => {
        for (let i = 0; i < computed.length; i += 1) {
          const property = computed.item(i);
          destination.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property));
        }
      };
      copyStyle(getComputedStyle(sourceNode), proxyNode.style);
      for (const pseudo of ["::before", "::after"]) {
        const computed = getComputedStyle(sourceNode, pseudo);
        const content = computed.getPropertyValue("content");
        if (!content || content === "none" || content === "normal") continue;
        proxyStyle.sheet.insertRule(`[data-kite-scene-snapshot="${key}"]${pseudo} {}`, proxyStyle.sheet.cssRules.length);
        copyStyle(computed, proxyStyle.sheet.cssRules[proxyStyle.sheet.cssRules.length - 1].style);
      }
    });
    proxy.className = "kite-scene-proxy";
    proxy.dataset.kiteSceneProxy = "true";
    Object.assign(proxy.style, {
      position: "fixed", inset: "auto", top: `${rect.top}px`, left: `${rect.left}px`,
      width: `${rect.width}px`, height: `${rect.height}px`, margin: "0", zIndex: "1000",
      pointerEvents: "none", overflow: "hidden", opacity: "1",
    });
    document.body.appendChild(proxy);
    sceneProxies.add(proxy);
    sceneProxyStyles.set(proxy, proxyStyle);
    return proxy;
  }
  function sceneNodes() {
    const screens = [...document.querySelectorAll("[data-screen]")];
    const mainInfo = [...new Set(document.querySelectorAll(".game-page-info,[data-wp-game-guide]"))];
    return [...new Set([...screens, ...mainInfo])];
  }
  function animateSceneNode(node, frames, duration, token, onFinish) {
    if (!node?.animate) { onFinish?.(); return; }
    node.getAnimations().forEach((animation) => animation.cancel());
    const animation = node.animate(frames, { duration: motionDuration(duration), easing: "ease-out", fill: "both" });
    animation.onfinish = () => {
      if (token === sceneTransitionToken) onFinish?.();
      animation.cancel();
    };
  }
  function animateOverlay(node, opening) {
    const inner = node.querySelector(".settings-inner,.wp-i7-leave-card,.wp-frame-popover-card");
    node.getAnimations().forEach((animation) => animation.cancel());
    inner?.getAnimations().forEach((animation) => animation.cancel());
    const token = (overlayMotionTokens.get(node) || 0) + 1;
    overlayMotionTokens.set(node, token);
    if (opening) {
      if (overlayMotionClosing.has(node)) return;
      overlayMotionOpen.add(node);
      node.inert = false;
      node.removeAttribute("aria-hidden");
      node.style.removeProperty("pointer-events");
      if (node.animate) node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: motionDuration(140), easing: "ease-out" });
      if (inner?.animate && !reducedMotionRequested()) inner.animate(
        [{ opacity: 0.82, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
        { duration: 140, easing: "ease-out" },
      );
      return;
    }
    if (!overlayMotionOpen.has(node) || !node.animate) return;
    overlayMotionClosing.add(node);
    node.inert = true;
    node.setAttribute("aria-hidden", "true");
    node.style.pointerEvents = "none";
    node.hidden = false;
    const animations = [node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: motionDuration(140), easing: "ease-in", fill: "forwards" })];
    if (inner?.animate && !reducedMotionRequested()) animations.push(inner.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0.82, transform: "translateY(6px)" }],
      { duration: 140, easing: "ease-in", fill: "forwards" },
    ));
    Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))).then(() => {
      if (overlayMotionTokens.get(node) !== token) return;
      node.hidden = true;
      node.inert = false;
      node.removeAttribute("aria-hidden");
      node.style.removeProperty("pointer-events");
      overlayMotionOpen.delete(node);
      overlayMotionClosing.delete(node);
    });
  }
  function installOverlayMotion() {
    const selector = "#settingsPanel,.wp-shell-settings-popover,.wp-i7-leave-dialog,.wp-i7-battle-result,[data-wp-settings-popover]";
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const node = record.target;
        if (!(node instanceof HTMLElement) || !node.matches(selector)) continue;
        if (node.hidden) animateOverlay(node, false);
        else if (!overlayMotionClosing.has(node)) animateOverlay(node, true);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });
    return observer;
  }
  function show(screen) {
    if (screen !== "result" && resultTimer) {
      window.clearTimeout(resultTimer);
      resultTimer = 0;
    }
    const resultActive = screen === "result";
    const nodes = sceneNodes();
    const desired = new Set(nodes.filter((node) => node.dataset.screen === screen
      || (screen === "main" && node.matches(".game-page-info,[data-wp-game-guide]"))));
    const visibleBefore = nodes.filter((node) => !node.hidden);
    const outgoing = visibleBefore.filter((node) => !desired.has(node));
    const entering = [...desired].filter((node) => node.hidden);
    const initialEntry = !sceneInitialized;
    const transition = initialEntry || outgoing.length > 0 || entering.length > 0;
    const token = ++sceneTransitionToken;
    clearSceneProxies();
    if (transition) {
      outgoing.forEach((node) => createSceneProxy(node));
      nodes.forEach((node) => {
        const active = desired.has(node);
        node.hidden = !active;
      });
      if (screen === "battle") window.WeightPlayBattleCanvas?.sync?.();
      for (const node of desired) {
        if (entering.includes(node) || initialEntry) {
          if (node.matches('[data-screen="battle"]')) {
            [...node.children].filter((child) => !child.hidden
              && !child.matches("#resultScreen,#wpKiteLeaveDialog"))
              .forEach((child) => animateSceneNode(child, [{ opacity: 0 }, { opacity: 1 }], 160, token));
          } else {
            animateSceneNode(node, [{ opacity: 0 }, { opacity: 1 }], 160, token);
          }
        } else {
          node.getAnimations().forEach((animation) => animation.cancel());
        }
      }
      sceneProxies.forEach((proxy) => animateSceneNode(proxy, [{ opacity: 1 }, { opacity: 0 }], 160, token, () => {
        proxy.remove(); sceneProxyStyles.get(proxy)?.remove(); sceneProxies.delete(proxy);
      }));
    }
    sceneInitialized = true;
    $("settingsPanel").hidden = true;
    $("backBtn").hidden = screen !== "main";
    if ($("stageBack")) $("stageBack").hidden = screen !== "stage";
    if ($("battleAdReserve")) {
      const reserveActive = screen === "battle" || resultActive;
      $("battleAdReserve").hidden = !reserveActive;
      $("battleAdReserve").setAttribute("aria-hidden", String(!reserveActive));
    }
  }
  function applyLocale() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    const shell = shellCopy[locale] || shellCopy.en;
    const metadata = metadataCopy[locale] || metadataCopy.en;
    setFeedbackText(document.querySelector(".brand .eyebrow"), `WEIGHTPLAY · ${shell.brand}`);
    setFeedbackText(document.querySelector("#mainScreen .kicker"), metadata.kicker);
    document.querySelector(".main-poster")?.setAttribute("alt", metadata.posterAlt);
    document.querySelector(".guide-character")?.setAttribute("alt", metadata.guideAlt);
    document.querySelector("#gameGuide")?.setAttribute("aria-label", metadata.guideLabel);
    document.querySelector(".result-character")?.setAttribute("alt", metadata.resultAlt);
    setFeedbackText($("mainProgress"), shell.progress);
    setFeedbackText(document.querySelector("#mainScreen h1"), copy("title"));
    document.querySelectorAll("#stageScreen .screen-heading .eyebrow").forEach((node) => setFeedbackText(node, shell.stage));
    document.querySelectorAll("#battleScreen .screen-heading .eyebrow").forEach((node) => setFeedbackText(node, shell.battle));
    document.querySelectorAll("#resultScreen .screen-heading .eyebrow, #resultScreen > .eyebrow").forEach((node) => setFeedbackText(node, shell.result));
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      if (node.dataset.i18n === "best") setFeedbackText(node, copy("best", { count: bestText() }));
      else setFeedbackText(node, copy(node.dataset.i18n));
    });
    $("backBtn").setAttribute("aria-label", copy("back"));
    if ($("stageBack")) $("stageBack").setAttribute("aria-label", copy("back"));
    if ($("battleBack")) $("battleBack").setAttribute("aria-label", copy("map"));
    $("settingsBtn")?.setAttribute("aria-label", copy("settings"));
    $("closeSettings").setAttribute("aria-label", copy("close"));
    $("localeSelect").setAttribute("aria-label", copy("language"));
    $("soundBtn").setAttribute("aria-pressed", String(sound));
    setFeedbackText($("soundState"), sound ? copy("on") : copy("off"));
    renderStages(); renderBattle(); renderResult();
  }
  function renderStages() {
    const root = $("stageList"); if (!root) return;
    root.setAttribute("role", "tablist"); root.setAttribute("aria-label", copy("map"));
    if (!stageController) {
      if (!window.WeightPlayStageV6?.install) throw new Error("Shared Stage V6 runtime is unavailable");
      stageController = window.WeightPlayStageV6.install(root, {
        total: routes.length,
        poolSize: 9,
        cardSelector: ".stage-card",
        initialIndex: () => stageBrowseIndex,
        bind(button, index) {
          const route = routes[index];
          if (!route) return;
          button.className = "stage-card";
          button.type = "button";
          button.setAttribute("role", "tab");
          button.setAttribute("aria-controls", "battleScreen");
          button.setAttribute("aria-label", `${routeLabel(route)}. ${routeHint(route)}`);
          const label = document.createElement("span");
          const title = document.createElement("strong");
          const hint = document.createElement("small");
          title.textContent = routeLabel(route);
          hint.textContent = routeHint(route);
          label.append(title, hint);
          const arrow = document.createElement("span");
          arrow.className = "arrow";
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = solved.has(route.id) ? "✓" : "→";
          button.replaceChildren(label, arrow);
          animateFeedback(button, 120);
        },
        activate(index) { startRoute(index); },
        onChange(index, { pool }) {
          stageBrowseIndex = index;
          pool.forEach((button) => button.setAttribute("aria-selected", String(Number(button.dataset.wpStageVirtualIndex) === index)));
        },
      });
      if (!stageController) throw new Error("Shared Stage V6 runtime could not initialize");
    } else {
      stageController.refresh();
      stageController.center(stageBrowseIndex);
    }
  }
  function focusRouteFamily(family) {
    const index = Number(family);
    if (!Number.isInteger(index) || index < 0 || index >= routes.length || !stageController) return;
    stageController.center(index);
    document.querySelector(`#stageList .stage-card[data-wp-stage-virtual-index="${index}"]`)?.focus({ preventScroll: true });
  }
  function startRoute(index) {
    routeIndex = index; stageBrowseIndex = index; const route = routes[index];
    position = [...route.start]; path = []; checks = 0; locked = false;
    window.dispatchEvent(new Event("weightplay:kite-keeper-route-start"));
    show("battle"); renderBattle(); setFeedbackText($("status"), ""); $("status").className = "status";
    announce("start");
  }
  function markerPosition(coords) {
    const [x, y] = coords;
    return { left: `${10 + (x / 3) * 70}%`, top: `${18 + (y / 2) * 64}%` };
  }
  function renderBattle() {
    const route = routes[routeIndex]; if (!route || !$("windGrid")) return;
    setFeedbackText($("routeTitle"), routeLabel(route));
    setFeedbackText($("progressPill"), `${routeIndex + 1} / ${routes.length}`);
    setFeedbackText($("prompt"), `${routeHint(route)} · ${copy("routePrompt")}`);
    setFeedbackText($("dockTarget"), `${route.target[0]}, ${route.target[1]}`);
    setFeedbackText($("position"), copy("position", { x: position[0], y: position[1] }));
    setFeedbackText($("gusts"), copy("gusts", { count: path.length }));
    $("flightBoard").setAttribute("aria-label", `${copy("ariaKite")}. ${copy("position", { x: position[0], y: position[1] })}`);
    const kite = markerPosition(position); $("kiteMarker").style.left = kite.left; $("kiteMarker").style.top = kite.top;
    const dock = markerPosition(route.target); $("dockMarker").style.left = dock.left; $("dockMarker").style.top = dock.top;
    const root = $("windGrid"); root.replaceChildren();
    ["north", "east", "south", "west"].forEach((direction) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "wind-card";
      button.setAttribute("data-wp-primary-action", "wind");
      button.disabled = locked || path.length >= 3;
      button.setAttribute("aria-pressed", String(path.at(-1) === direction));
      button.innerHTML = `<span>${direction === "north" ? "↑" : direction === "east" ? "→" : direction === "south" ? "↓" : "←"}</span><small>${copy(direction)}</small>`;
      button.addEventListener("click", () => chooseWind(direction)); root.appendChild(button);
    });
    setFeedbackText($("selection"), path.length ? copy("selected", { name: copy(path.at(-1)) }) : copy("choose"));
  }
  function chooseWind(direction) {
    if (locked || path.length >= 3) return;
    checks += 1; runChecks += 1; path.push(direction);
    const vector = vectors[direction]; position = [position[0] + vector[0], position[1] + vector[1]];
    const inBounds = position[0] >= 0 && position[0] <= 3 && position[1] >= 0 && position[1] <= 2;
    announce("gust", { direction, inBounds });
    if (!inBounds || (path.length === 3 && (position[0] !== routes[routeIndex].target[0] || position[1] !== routes[routeIndex].target[1]))) {
      locked = true; renderBattle(); setFeedbackText($("status"), copy("wrong")); $("status").className = "status try"; acknowledgeKiteMovement(); announce("wrong"); return;
    }
    renderBattle(); acknowledgeKiteMovement();
    if (path.length === 3) {
      locked = true; solved.add(routes[routeIndex].id); saveSolvedRouteIds(); setFeedbackText($("status"), copy("correct")); $("status").className = "status good"; announce("correct", { checks });
      resultTimer = window.setTimeout(() => {
        resultTimer = 0;
        show("result"); renderResult();
      }, 360);
    }
  }
  function resetRoute() {
    const route = routes[routeIndex]; position = [...route.start]; path = []; checks = 0; locked = false;
    renderBattle(); acknowledgeKiteMovement(); setFeedbackText($("status"), ""); $("status").className = "status"; announce("reset");
  }
  function renderResult() {
    if (!$("resultText")) return;
    complete = solved.size === routes.length;
    setFeedbackText($("resultTitle"), complete ? copy("finished") : copy("resultTitle"));
    setFeedbackText($("resultText"), copy("resultText", { checks }));
    $("nextBtn").hidden = complete;
    $("resultMapBtn").hidden = false;
    if (complete) {
      const old = bestValue(); if (!old || runChecks < old) localStorage.setItem("weightplay-kite-keeper-best-v1", String(runChecks));
      setFeedbackText($("best"), copy("best", { count: bestText() }));
    }
  }
  function nextRoute() { const next = routeIndex + 1; if (next < routes.length) startRoute(next); else { show("stage"); renderStages(); } }
  function goLobby() { window.location.href = "../../index.html"; }
  function bind() {
    $("startBtn").addEventListener("click", () => { try { show("stage"); renderStages(); } catch (error) { document.body.dataset.kiteError = String(error); } }); $("mapBtn").addEventListener("click", () => { try { show("stage"); renderStages(); } catch (error) { document.body.dataset.kiteError = String(error); } });
    document.querySelectorAll("#routeFamilyNav [data-route-family]").forEach((button) => button.addEventListener("click", () => focusRouteFamily(button.dataset.routeFamily)));
    $("resultMapBtn").addEventListener("click", () => { show("stage"); renderStages(); }); $("nextBtn").addEventListener("click", nextRoute);
    $("resetBtn").addEventListener("click", resetRoute); $("battleBack").addEventListener("click", () => { show("stage"); renderStages(); }); $("stageBack").addEventListener("click", () => { show("main"); });
    $("closeSettings").addEventListener("click", () => { $("settingsPanel").hidden = true; });
    $("soundBtn").addEventListener("click", () => { sound = !sound; localStorage.setItem("weightplay-kite-keeper-sound", sound ? "on" : "off"); applyLocale(); });
    $("localeSelect").addEventListener("change", (event) => { locale = event.target.value; localStorage.setItem("weightplay-kite-keeper-locale", locale); applyLocale(); });
    $("backBtn").addEventListener("click", goLobby); $("homeBtn").addEventListener("click", goLobby);
    const overlayMotionObserver = installOverlayMotion();
    window.addEventListener("pagehide", () => {
      clearSceneProxies(); overlayMotionObserver.disconnect(); stageController?.destroy();
    }, { once: true });
  }
  async function boot() {
    await waitForInterface7Assets();
    if (!await waitForBattleCanvasRuntime()) {
      $("loading").textContent = copy("layoutLoadError");
      $("loading").setAttribute("role", "alert");
      return;
    }
    bind();
    $("localeSelect").value = locale;
    $("loading").hidden = true;
    $("app").hidden = false;
    show("main");
    applyLocale();
    $("localeSelect").dispatchEvent(new Event("change", { bubbles: true }));
    feedbackReady = true;
    announce("loaded");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
}());
