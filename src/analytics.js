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
  function track(name, params = {}) {
    if (lifecycleOwner && ["game_start", "game_restart", "game_end"].includes(name) && !params.tracking_version) return;
    // Do not replace GA4's native session_id with a tab-local random identifier.
    emit(name, { page_path: location.pathname, page_title: document.title, ...params });
  }
  function trackPrivacySafe(name, params = {}) {
    if (lifecycleOwner && ["game_start", "game_restart", "game_end"].includes(name) && !params.tracking_version) return;
    if (!/^[a-z][a-z0-9_]{0,63}$/.test(name)) return;
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
    function end(outcome = "abandon") {
      if (round === null || destroyed) return false;
      flush();
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
            end(value.outcome || "complete");
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
  const game = createGameTracking();
  window.WonderAnalytics = {
    track, trackPrivacySafe, counts: loadCounts, hasGoogleAnalytics: googleAnalyticsEnabled, game,
    setEnabled(enabled) {
      analyticsEnabled = enabled === true;
      if (analyticsEnabled) loadGoogleAnalytics();
      game?.collectionChanged();
    },
  };
  track("page_view");
  window.dispatchEvent(new Event("weightplay:analytics-ready"));
})();
