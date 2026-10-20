(function () {
  "use strict";

  const locales = window.PATTERN_PATCH_LOCALES;
  const localeKeys = locales.__localeKeys;
  const rounds = [
    { pattern: ["leaf", "sun", "leaf", "moon", "?", "moon", "leaf", "sun", "leaf"], answer: "sun", options: ["sun", "star", "droplet"] },
    { pattern: ["moon", "dot", "leaf", "moon", "?", "leaf", "moon", "dot", "leaf"], answer: "dot", options: ["dot", "wave", "star"] },
    { pattern: ["diamond", "circle", "diamond", "circle", "?", "circle", "diamond", "circle", "diamond"], answer: "diamond", options: ["diamond", "triangle", "flower"] },
  ];
  const symbols = { leaf: "✦", sun: "☀", moon: "☾", dot: "•", star: "★", droplet: "●", wave: "≈", diamond: "◆", circle: "○", triangle: "▲", flower: "✿" };
  const markerFiles = Object.fromEntries(Object.keys(symbols).map((token) => [token, `assets/animal-pattern-patch-marker-${token}.png`]));
  markerFiles.mismatch = "assets/animal-pattern-patch-marker-mismatch.png";
  markerFiles.completion = "assets/animal-pattern-patch-marker-completion.png";
  const state = { locale: "en", sound: !window.WeightPlayAudio.isMuted(), roundIndex: 0, checks: 0, solved: 0 };
  const pendingTimers = new Set();
  const motionTimers = new Map();
  const motionTokens = new WeakMap();
  let leaveDialogOpen = false;
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { /* private mode */ } },
  };
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  function queryLocale() {
    const value = new URLSearchParams(window.location.search).get("lang");
    if (value && locales[value]) return value;
    const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routedLocale = routeLocaleMap[routeSegment];
    return routedLocale && locales[routedLocale] ? routedLocale : (safeStorage.get("weightplay-pattern-locale") || "en");
  }
  function t(key, vars = {}) { const copy = locales[state.locale] || locales.en; const text = copy[key] || locales.en[key] || key; return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); }
  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    const soundText = $("soundToggle").querySelector("[data-copy]");
    if (soundText) soundText.textContent = t(state.sound ? "soundOn" : "soundOff");
    $("soundToggle").setAttribute("aria-pressed", String(state.sound));
    $("soundToggle").setAttribute("aria-checked", String(state.sound));
    $("battleSoundToggle").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundToggle").textContent = state.sound ? "♪" : "×";
    $("battleSoundToggle").setAttribute("aria-label", t(state.sound ? "soundOn" : "soundOff"));
    $("mainSettingsBtn").setAttribute("aria-label", t("settings"));
    $("mainSettingsPopover").setAttribute("aria-label", t("settings"));
    $("homeFromBattle").setAttribute("aria-label", t("home"));
    $("patternGrid").setAttribute("aria-label", t("patternGrid"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    if (!$("battleView").hidden && $("resultView").hidden) renderRound();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; safeStorage.set("weightplay-pattern-locale", state.locale); applyLocale(); syncSharedLocale(); });
  }
  function syncSharedLocale() {
    const wonderI18n = window.WonderI18n;
    if (typeof wonderI18n?.setLocale === "function" && wonderI18n.actualLocale?.() !== state.locale) {
      wonderI18n.setLocale(state.locale, { navigate: false });
      return;
    }
    window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale: state.locale } }));
  }
  function playTone(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function setGameplayInert(inert) {
    const header = $("battleView").querySelector(".battle-header");
    const content = $("battleView").querySelector(".battle-content");
    [header, content].filter(Boolean).forEach((node) => {
      node.inert = inert;
      if (inert) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  }
  function motionDuration(panel = false) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return reduced ? 80 : panel ? 160 : 180;
  }
  function cancelMotion(node) {
    const timer = motionTimers.get(node);
    if (timer) window.clearTimeout(timer);
    motionTimers.delete(node);
    const token = (motionTokens.get(node) || 0) + 1;
    motionTokens.set(node, token);
    return token;
  }
  function scheduleMotion(node, callback, delay) {
    const token = cancelMotion(node);
    const timer = window.setTimeout(() => {
      if (motionTokens.get(node) !== token) return;
      motionTimers.delete(node);
      callback();
    }, delay + 32);
    motionTimers.set(node, timer);
    return token;
  }
  function clearSceneGeometry(node) {
    ["position", "top", "left", "width", "height", "margin", "z-index", "pointer-events"].forEach((key) => node.style.removeProperty(key));
  }
  function finishSceneExit(node) {
    if (!node.classList.contains("is-scene-exiting")) return;
    node.hidden = true;
    node.classList.remove("is-scene-entering", "is-scene-exiting");
    clearSceneGeometry(node);
    node.inert = false;
    node.removeAttribute("aria-hidden");
  }
  function beginSceneExit(node, pin = true) {
    if (!node || node.hidden) return;
    cancelMotion(node);
    if (pin) {
      const rect = node.getBoundingClientRect();
      node.style.position = "fixed";
      node.style.top = `${rect.top}px`;
      node.style.left = `${rect.left}px`;
      node.style.width = `${rect.width}px`;
      node.style.height = `${rect.height}px`;
      node.style.margin = "0";
      node.style.zIndex = "40";
      node.style.pointerEvents = "none";
    }
    node.inert = true;
    node.setAttribute("aria-hidden", "true");
    node.classList.remove("is-scene-entering");
    node.classList.add("is-scene-exiting");
    scheduleMotion(node, () => finishSceneExit(node), motionDuration());
  }
  function beginSceneEnter(node) {
    const token = cancelMotion(node);
    node.hidden = false;
    clearSceneGeometry(node);
    node.inert = false;
    node.removeAttribute("aria-hidden");
    node.classList.remove("is-scene-exiting");
    node.classList.add("is-scene-entering");
    void node.offsetWidth;
    window.requestAnimationFrame(() => {
      if (motionTokens.get(node) === token && !node.hidden) node.classList.remove("is-scene-entering");
    });
  }
  function beginPanelEnter(node) {
    const token = cancelMotion(node);
    node.hidden = false;
    node.inert = false;
    node.setAttribute("aria-hidden", "false");
    node.classList.remove("is-panel-exiting");
    node.classList.add("is-panel-entering");
    void node.offsetWidth;
    window.requestAnimationFrame(() => {
      if (motionTokens.get(node) === token && !node.hidden) node.classList.remove("is-panel-entering");
    });
  }
  function beginPanelExit(node) {
    if (node.hidden) return;
    node.inert = true;
    node.setAttribute("aria-hidden", "true");
    node.classList.remove("is-panel-entering");
    node.classList.add("is-panel-exiting");
    scheduleMotion(node, () => {
      node.hidden = true;
      node.classList.remove("is-panel-entering", "is-panel-exiting");
    }, motionDuration(true));
  }
  function hidePanelImmediately(node) {
    cancelMotion(node);
    node.hidden = true;
    node.classList.remove("is-panel-entering", "is-panel-exiting");
    node.inert = false;
    node.removeAttribute("aria-hidden");
  }
  function installSharedSettingsMotion() {
    const panel = document.querySelector(".wp-shell-settings-popover:not(#mainSettingsPopover)");
    const button = document.querySelector("button.wp-shell-settings-button:not(#mainSettingsBtn)");
    if (!panel || !button || panel.dataset.patternMotionReady === "true") return;
    panel.dataset.patternMotionReady = "true";
    panel.inert = panel.hidden;
    panel.setAttribute("aria-hidden", String(panel.hidden));
    let previousHidden = panel.hidden;
    let exitSnapshot = null;

    function captureExitSnapshot() {
      if (panel.hidden || exitSnapshot) return;
      const rect = panel.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const snapshot = panel.cloneNode(true);
      snapshot.removeAttribute("id");
      snapshot.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
      snapshot.hidden = false;
      snapshot.inert = true;
      snapshot.setAttribute("aria-hidden", "true");
      snapshot.classList.remove("is-panel-entering", "is-panel-exiting");
      Object.assign(snapshot.style, {
        position: "fixed", top: `${rect.top}px`, left: `${rect.left}px`, right: "auto",
        width: `${rect.width}px`, height: `${rect.height}px`, margin: "0",
        zIndex: "1200", pointerEvents: "none",
      });
      document.body.append(snapshot);
      exitSnapshot = snapshot;
      window.setTimeout(() => {
        if (exitSnapshot === snapshot && !panel.hidden) {
          snapshot.remove();
          exitSnapshot = null;
        }
      }, 0);
    }

    const observer = new MutationObserver(() => {
      const hidden = panel.hidden;
      if (hidden === previousHidden) return;
      previousHidden = hidden;
      if (hidden) {
        panel.inert = true;
        panel.setAttribute("aria-hidden", "true");
        panel.classList.remove("is-panel-entering", "is-panel-exiting");
        if (exitSnapshot) {
          const snapshot = exitSnapshot;
          exitSnapshot = null;
          void snapshot.offsetWidth;
          snapshot.classList.add("is-panel-exiting");
          scheduleMotion(snapshot, () => snapshot.remove(), motionDuration(true));
        }
        return;
      }
      if (exitSnapshot) {
        exitSnapshot.remove();
        exitSnapshot = null;
      }
      const token = cancelMotion(panel);
      panel.inert = false;
      panel.setAttribute("aria-hidden", "false");
      panel.classList.remove("is-panel-exiting");
      panel.classList.add("is-panel-entering");
      void panel.offsetWidth;
      window.requestAnimationFrame(() => {
        if (motionTokens.get(panel) === token && !panel.hidden) panel.classList.remove("is-panel-entering");
      });
    });
    observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("pointerdown", (event) => {
      if (!panel.hidden && !panel.contains(event.target) && !button.contains(event.target)) captureExitSnapshot();
    }, true);
    document.addEventListener("click", (event) => {
      if (!panel.hidden && (!panel.contains(event.target) || button.contains(event.target))) captureExitSnapshot();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (!panel.hidden && event.key === "Escape") captureExitSnapshot();
    }, true);
  }
  function showView(id) {
    const main = $("mainView");
    const battle = $("battleView");
    const result = $("resultView");
    const guide = $("gameGuide");
    const mainActive = id === "mainView";
    const resultActive = id === "resultView";
    const wasMain = !main.hidden;
    const wasResult = !result.hidden;
    leaveDialogOpen = false;

    if (resultActive) {
      if (wasMain) beginSceneExit(main);
      if (!guide.hidden) beginSceneExit(guide);
      if (battle.hidden) beginSceneEnter(battle);
      const header = battle.querySelector(".battle-header");
      const content = battle.querySelector(".battle-content");
      [header, content].filter(Boolean).forEach((node) => node.classList.add("is-result-underlay"));
      result.classList.toggle("is-active", true);
      if (result.hidden) beginSceneEnter(result);
      setGameplayInert(true);
    } else if (mainActive) {
      if (!battle.hidden) beginSceneExit(battle);
      if (main.hidden) beginSceneEnter(main);
      if (guide.hidden) beginSceneEnter(guide);
      else if (!wasMain) beginSceneEnter(guide);
      result.classList.remove("is-active");
      if (!result.hidden) beginSceneExit(result, false);
      setGameplayInert(false);
      const popover = $("mainSettingsPopover");
      if (!popover.hidden) {
        cancelMotion(popover);
        popover.hidden = true;
        popover.classList.remove("is-panel-entering", "is-panel-exiting");
        popover.inert = false;
        popover.removeAttribute("aria-hidden");
      }
      $("mainSettingsBtn").setAttribute("aria-expanded", "false");
    } else {
      if (wasMain) {
        beginSceneExit(main);
        if (!guide.hidden) beginSceneExit(guide);
        hidePanelImmediately($("leaveDialog"));
      }
      if (battle.hidden) beginSceneEnter(battle);
      if (wasResult || !result.hidden) beginSceneExit(result, false);
      battle.querySelectorAll(".battle-header, .battle-content").forEach((node) => {
        node.classList.remove("is-result-underlay");
        node.inert = false;
        node.removeAttribute("aria-hidden");
      });
      result.classList.remove("is-active");
      setGameplayInert(false);
    }

    main.classList.toggle("is-active", mainActive);
    battle.classList.toggle("is-active", !mainActive);
    document.body.dataset.screen = mainActive ? "main" : "battle";
    if (resultActive) document.body.dataset.battleSubstate = "result";
    else delete document.body.dataset.battleSubstate;
    if (!mainActive && !$("mainSettingsPopover").hidden) {
      $("mainSettingsBtn").setAttribute("aria-expanded", "false");
    }
    const leaveDialog = $("leaveDialog");
    if (!leaveDialog.hidden) beginPanelExit(leaveDialog);
    window.scrollTo(0, 0);
  }
  function makeToken(token, label, interactive, callback) {
    const node = interactive ? document.createElement("button") : document.createElement("div");
    node.className = "token"; node.dataset.token = token; if (interactive) node.type = "button";
    node.setAttribute("aria-label", label);
    if (token === "?") { const symbol = document.createElement("span"); symbol.setAttribute("aria-hidden", "true"); symbol.textContent = "?"; node.append(symbol); }
    else { const art = document.createElement("img"); art.className = "token-art"; art.src = markerFiles[token]; art.alt = ""; art.setAttribute("aria-hidden", "true"); node.append(art); }
    if (interactive) node.addEventListener("click", callback);
    return node;
  }
  function setFeedback(key, marker) {
    const feedback = $("feedback"); feedback.replaceChildren();
    const art = document.createElement("img"); art.className = "feedback-art"; art.src = markerFiles[marker]; art.alt = ""; art.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span"); copy.textContent = t(key); feedback.append(art, copy);
  }
  function renderRound() {
    const round = rounds[state.roundIndex];
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("instruction").textContent = t("instruction");
    $("patternGrid").replaceChildren(...round.pattern.map((token, index) => makeToken(token, token === "?" ? t("missing") : t("patternTile", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1, token: (locales[state.locale].tokenNames || {})[token] || token }), false)));
    $("optionGrid").replaceChildren(...round.options.map((token) => { const option = makeToken(token, t("option", { token: (locales[state.locale].tokenNames || {})[token] || token }), true, () => choose(token, option)); option.classList.add("option-token"); return option; }));
    $("checkCount").textContent = String(state.checks); $("feedback").textContent = ""; $("feedback").classList.remove("is-wrong");
  }
  function runPendingTimer(entry) {
    entry.timer = 0;
    pendingTimers.delete(entry);
    entry.callback();
  }
  function schedulePending(callback, delay) {
    const entry = { callback, remaining: delay, startedAt: performance.now(), timer: 0 };
    entry.timer = window.setTimeout(() => runPendingTimer(entry), delay);
    pendingTimers.add(entry);
    return entry;
  }
  function pausePendingTimers() {
    const now = performance.now();
    pendingTimers.forEach((entry) => {
      if (!entry.timer) return;
      window.clearTimeout(entry.timer);
      entry.timer = 0;
      entry.remaining = Math.max(0, entry.remaining - (now - entry.startedAt));
    });
  }
  function resumePendingTimers() {
    pendingTimers.forEach((entry) => {
      if (entry.timer) return;
      entry.startedAt = performance.now();
      entry.timer = window.setTimeout(() => runPendingTimer(entry), entry.remaining);
    });
  }
  function clearPendingTimers() {
    pendingTimers.forEach((entry) => { if (entry.timer) window.clearTimeout(entry.timer); });
    pendingTimers.clear();
  }
  function choose(token, node) {
    if (leaveDialogOpen) return;
    state.checks += 1; $("checkCount").textContent = String(state.checks);
    const round = rounds[state.roundIndex];
    if (token !== round.answer) { node.classList.add("is-wrong"); setFeedback("wrong", "mismatch"); $("feedback").classList.add("is-wrong"); playTone("feedback.error"); schedulePending(() => node.classList.remove("is-wrong"), 420); return; }
    node.classList.add("is-correct"); node.disabled = true; state.solved += 1; $("feedback").classList.remove("is-wrong"); setFeedback("correct", "completion"); $("appStatus").textContent = t("correct"); playTone("feedback.success");
    schedulePending(() => { if (state.roundIndex < rounds.length - 1) { state.roundIndex += 1; renderRound(); } else finish(); }, 460);
  }
  function start() { clearPendingTimers(); state.roundIndex = 0; state.checks = 0; state.solved = 0; window.WeightPlayAudio.play("game.start"); showView("battleView"); renderRound(); }
  function finish() { clearPendingTimers(); const key = "weightplay-pattern-patch-best-checks"; const prior = Number(safeStorage.get(key)); if (!prior || state.checks < prior) safeStorage.set(key, String(state.checks)); $("resultSummary").textContent = t("summary"); $("bestCount").textContent = safeStorage.get(key) || String(state.checks); showView("resultView"); }
  function goHome() { clearPendingTimers(); showView("mainView"); applyLocale(); }
  function toggleSound() { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); applyLocale(); }
  function toggleSettings() {
    const popover = $("mainSettingsPopover");
    const open = popover.hidden || popover.inert;
    if (open) beginPanelEnter(popover);
    else beginPanelExit(popover);
    $("mainSettingsBtn").setAttribute("aria-expanded", String(open));
  }
  function setGuideOpen(open) {
    const guide = $("gameGuide");
    const summary = guide.querySelector("summary");
    const content = guide.querySelector(".guide-layout");
    const targetOpen = Boolean(open);
    guide.dataset.panelOpen = String(targetOpen);
    summary.setAttribute("aria-expanded", String(targetOpen));
    cancelMotion(content);
    content.classList.remove("is-panel-entering", "is-panel-exiting");
    if (targetOpen) {
      guide.open = true;
      content.inert = false;
      content.setAttribute("aria-hidden", "false");
      content.classList.add("is-panel-entering");
      void content.offsetWidth;
      const token = motionTokens.get(content);
      window.requestAnimationFrame(() => {
        if (motionTokens.get(content) === token && guide.dataset.panelOpen === "true") content.classList.remove("is-panel-entering");
      });
      return;
    }
    content.inert = true;
    content.setAttribute("aria-hidden", "true");
    content.classList.add("is-panel-exiting");
    scheduleMotion(content, () => {
      if (guide.dataset.panelOpen !== "false") return;
      guide.open = false;
      content.classList.remove("is-panel-entering", "is-panel-exiting");
    }, motionDuration(true));
  }
  function toggleGuide(event) {
    event.preventDefault();
    const guide = $("gameGuide");
    setGuideOpen(guide.dataset.panelOpen !== "true");
  }
  function openLeaveDialog() {
    if (leaveDialogOpen || !$("resultView").hidden) return;
    leaveDialogOpen = true;
    pausePendingTimers();
    setGameplayInert(true);
    beginPanelEnter($("leaveDialog"));
    $("continueBtn").focus();
  }
  function closeLeaveDialog() {
    if (!leaveDialogOpen) return;
    beginPanelExit($("leaveDialog"));
    leaveDialogOpen = false;
    setGameplayInert(false);
    resumePendingTimers();
    $("homeFromBattle").focus();
  }
  function confirmLeave() {
    if (!leaveDialogOpen) return;
    leaveDialogOpen = false;
    clearPendingTimers();
    goHome();
  }
  function trapLeaveDialogFocus(event) {
    if (!leaveDialogOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeLeaveDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const actions = [$("continueBtn"), $("confirmLeaveBtn")].filter((node) => node && !node.disabled && !node.hidden);
    if (!actions.length) return;
    const first = actions[0];
    const last = actions[actions.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!actions.includes(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    document.body.dataset.screen = "main";
    populateLocales();
    applyLocale();
    $("startButton").addEventListener("click", start);
    $("replayButton").addEventListener("click", start);
    $("homeFromBattle").addEventListener("click", openLeaveDialog);
    $("leaveBtn").addEventListener("click", openLeaveDialog);
    $("continueBtn").addEventListener("click", closeLeaveDialog);
    $("confirmLeaveBtn").addEventListener("click", confirmLeave);
    $("homeFromResult").addEventListener("click", goHome);
    $("mainSettingsBtn").addEventListener("click", toggleSettings);
    $("soundToggle").addEventListener("click", toggleSound);
    $("battleSoundToggle").addEventListener("click", toggleSound);
    const guide = $("gameGuide");
    guide.dataset.panelOpen = String(guide.open);
    guide.querySelector("summary").setAttribute("aria-expanded", String(guide.open));
    guide.querySelector("summary").addEventListener("click", toggleGuide);
    guide.querySelector(".guide-layout").inert = !guide.open;
    guide.querySelector(".guide-layout").setAttribute("aria-hidden", String(!guide.open));
    $("mainSettingsPopover").inert = true;
    $("mainSettingsPopover").setAttribute("aria-hidden", "true");
    $("leaveDialog").inert = true;
    $("leaveDialog").setAttribute("aria-hidden", "true");
    installSharedSettingsMotion();
    if (!document.querySelector(".wp-shell-settings-popover:not(#mainSettingsPopover)")) {
      const frameObserver = new MutationObserver(() => {
        if (!document.querySelector(".wp-shell-settings-popover:not(#mainSettingsPopover)")) return;
        frameObserver.disconnect();
        installSharedSettingsMotion();
      });
      frameObserver.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener("keydown", trapLeaveDialogFocus, true);
  });
  window.PATTERN_PATCH_TEST = { rounds, symbols, start, renderRound };
})();
