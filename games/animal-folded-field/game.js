(function () {
  "use strict";

  const rounds = [
    { title: "stageTitle1", hint: "stageHint1", initial: [0, 0, 0], target: [1, 0, 1] },
    { title: "stageTitle2", hint: "stageHint2", initial: [1, 0, 1], target: [0, 0, 0] },
    { title: "stageTitle3", hint: "stageHint3", initial: [0, 0, 0, 0], target: [1, 0, 0, 1] }
  ];
  const localeMap = window.FOLDED_FIELD_LOCALES || { en: {} };
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rtlLocales = new Set(["ar"]);
  const state = { locale: "en", screen: "main", round: 0, pattern: [], flips: 0, cleared: [], sound: true };
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch (error) { return fallback; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (error) { /* private browsing is fine */ }
  };
  const copy = (key, vars) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.keys(vars || {}).forEach((name) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name])); });
    return value;
  };
  const getBest = () => Number(safeGet("weightplay-animal-folded-field-best", "0")) || 0;
  const setText = (node, key, vars) => { if (node) node.textContent = copy(key, vars); };
  const announce = (key, vars) => { setText($("battleStatus"), key, vars); };
  // Interface 7 supplies one shared Settings owner. The authored legacy
  // button remains in the markup for backwards-compatible bindings, but it
  // must not compete with the generated shell control in the player-facing
  // header.
  const installInterfaceCompatibility = () => {
    if (document.getElementById("foldedFieldInterfaceCompatibility")) return;
    const style = document.createElement("style");
    style.id = "foldedFieldInterfaceCompatibility";
    style.textContent = `
      @layer wp-frame-contract {
        #mainScreen #settingsBtn { display: none !important; }
      }
    `;
    const legacySettings = $("settingsBtn");
    if (legacySettings) {
      legacySettings.classList.remove("wp-shell-settings-button");
      legacySettings.removeAttribute("data-wp-settings");
      legacySettings.hidden = true;
      legacySettings.setAttribute("aria-hidden", "true");
      legacySettings.tabIndex = -1;
      legacySettings.id = "foldedFieldLegacySettingsBtn";
    }
    (document.body || document.head).append(style);
  };
  // The shared Main adapter promotes only the primary start action and marks
  // the original hero branch as legacy. Keep the authored Field map entry
  // reachable by moving it into the promoted copy pane once that pane exists.
  const ensureMainMapAction = () => {
    const map = $("mapBtn");
    const copyPane = document.querySelector(".wp-standard-main-copy");
    if (!map || !copyPane) return false;
    if (!copyPane.contains(map)) {
      const actions = document.createElement("div");
      actions.className = "hero-actions wp-standard-main-extra-actions";
      actions.append(map);
      copyPane.append(actions);
    }
    map.hidden = false;
    map.removeAttribute("aria-hidden");
    map.classList.remove("wp-main-legacy-layout");
    map.tabIndex = 0;
    return true;
  };
  const ensureSharedSettingsButton = () => {
    const button = document.querySelector(".wp-shell-settings-button");
    if (!button) return false;
    button.id = "settingsBtn";
    button.hidden = false;
    button.removeAttribute("aria-hidden");
    button.tabIndex = 0;
    // The shell may arrive after the game compatibility layer and inherit a
    // hidden state from the legacy header branch. Reassert the contract on
    // the generated control so the shared owner remains visibly actionable.
    button.style.setProperty("display", "grid", "important");
    button.style.setProperty("width", "48px", "important");
    button.style.setProperty("height", "48px", "important");
    return true;
  };
  const watchMainMapAction = () => {
    const reconcile = () => {
      const mapReady = ensureMainMapAction();
      const settingsReady = ensureSharedSettingsButton();
      return mapReady && settingsReady;
    };
    if (reconcile()) return;
    const root = document.body || document.documentElement;
    if (!root) return;
    const observer = new MutationObserver(() => {
      if (reconcile()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(() => {
      if (reconcile()) observer.disconnect();
    }, 2000);
  };
  // The shared Battle scaler observes DOM mutations asynchronously. Folded
  // Field rerenders its flap board after every native action, so checkpoint
  // the settled logical envelope in the same task before the next input.
  const syncBattleLayout = () => window.WeightPlayBattleCanvas?.sync?.();
  const aligned = () => state.pattern.reduce((total, value, index) => total + (value === rounds[state.round].target[index] ? 1 : 0), 0);
  const samePattern = () => state.pattern.every((value, index) => value === rounds[state.round].target[index]);
  const toggle = (index) => {
    const next = state.pattern.slice();
    next[index] = next[index] ? 0 : 1;
    next[(index + 1) % next.length] = next[(index + 1) % next.length] ? 0 : 1;
    return next;
  };
  const beep = () => {
    if (!state.sound || !window.AudioContext && !window.webkitAudioContext) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      const context = new AudioCtor();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
      window.setTimeout(() => context.close(), 140);
    } catch (error) { /* audio is an optional enhancement */ }
  };
  const pinViewportTop = (active) => {
    document.documentElement.style.overflow = active ? "hidden" : "";
    document.body.style.position = active ? "fixed" : "";
    document.body.style.inset = active ? "0" : "";
    document.body.style.width = active ? "100%" : "";
    document.body.style.overflow = active ? "hidden" : "";
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    if (active) {
      window.requestAnimationFrame(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      });
    }
  };
  const show = (screen) => {
    state.screen = screen;
    const loading = $("loadingPanel");
    if (loading) loading.hidden = true;
    const inBattle = screen === "battle" || screen === "result";
    ["main", "stage"].forEach((name) => {
      const node = $(name + "Screen");
      if (node) node.hidden = name !== screen;
    });
    const battleScreen = $("battleScreen");
    if (battleScreen) {
      battleScreen.hidden = !inBattle;
      battleScreen.dataset.battleState = inBattle ? screen : "";
    }
    const battleHud = $("battleHud");
    const battleContent = $("battleContent");
    const resultScreen = $("resultScreen");
    if (battleHud) battleHud.hidden = screen !== "battle";
    if (battleContent) battleContent.hidden = screen !== "battle";
    if (resultScreen) resultScreen.hidden = screen !== "result";
    const battleActions = document.querySelector("#battleScreen .battle-canvas > .battle-actions");
    if (battleActions) battleActions.hidden = screen !== "battle";
    document.body.dataset.screen = screen === "result" ? "battle" : screen;
    document.body.dataset.battleSubstate = screen === "result" ? "result" : "";
    pinViewportTop(screen === "stage" || inBattle);
    if (screen === "main") renderMain();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    if (screen === "result") renderResult();
    // The shared shell normally schedules placement from a MutationObserver.
    // Reconcile synchronously at every screen boundary so returning from the
    // terminal Result cannot expose Main before its Settings host is placed.
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
    if (screen === "main") ensureSharedSettingsButton();
    window.scrollTo(0, 0);
  };
  const renderMain = () => {
    setText($("mainProgress"), "progress", { count: rounds.length });
    setText($("bestValue"), getBest() ? String(getBest()) : "noBest");
  };
  const renderStages = () => {
    const list = $("stageList");
    if (!list) return;
    list.innerHTML = rounds.map((round, index) => {
      const done = state.cleared.includes(index);
      return "<button class=\"stage-card\" type=\"button\" data-stage=\"" + index + "\" aria-label=\"" + copy(round.title) + "\"><span class=\"stage-number\">" + copy("round", { number: index + 1, total: rounds.length }) + "</span><h3>" + copy(round.title) + "</h3><p>" + copy(round.hint) + "</p><span class=\"stage-chip\">" + (done ? copy("badgeComplete") : copy("stageReady")) + "</span></button>";
    }).join("");
  };
  const patternMarkup = (pattern, target) => pattern.map((value, index) => {
    const label = value ? copy("lifted") : copy("tucked");
    const match = target && value === target[index] ? " is-match" : "";
    return "<span class=\"pattern-cell" + (value ? " is-lifted" : " is-tucked") + match + "\">" + label + "</span>";
  }).join("");
  const renderBattle = () => {
    const round = rounds[state.round];
    setText($("battleHeading"), "title");
    setText($("roundLabel"), "round", { number: state.round + 1, total: rounds.length });
    setText($("roundTitle"), round.title);
    setText($("roundHint"), round.hint);
    if ($("flipCount")) $("flipCount").textContent = String(state.flips);
    if ($("targetPattern")) $("targetPattern").innerHTML = patternMarkup(round.target);
    if ($("currentPattern")) $("currentPattern").innerHTML = patternMarkup(state.pattern, round.target);
    if ($("targetPattern")) $("targetPattern").setAttribute("aria-label", copy("targetPattern") + ": " + round.target.map((value) => value ? copy("lifted") : copy("tucked")).join(", "));
    if ($("currentPattern")) $("currentPattern").setAttribute("aria-label", copy("currentPattern") + ": " + state.pattern.map((value) => value ? copy("lifted") : copy("tucked")).join(", "));
    setText($("alignedCount"), "aligned", { count: aligned(), total: round.target.length });
    const board = $("flapBoard");
    if (board) {
      board.innerHTML = state.pattern.map((value, index) => "<button class=\"flap-btn " + (value ? "is-lifted" : "is-tucked") + "\" type=\"button\" data-flap=\"" + index + "\" aria-label=\"" + copy("flap" + (index + 1)) + " " + (value ? copy("lifted") : copy("tucked")) + "\" aria-pressed=\"" + Boolean(value) + "\"><i class=\"link-dot\" aria-hidden=\"true\"></i><span class=\"flap-icon\" aria-hidden=\"true\">" + (value ? "↑" : "↓") + "</span><strong>" + copy("flap" + (index + 1)) + "</strong><small>" + (value ? copy("lifted") : copy("tucked")) + "</small></button>").join("");
      board.querySelectorAll("[data-flap]").forEach((button) => button.addEventListener("click", () => {
        state.pattern = toggle(Number(button.dataset.flap));
        state.flips += 1;
        announce("moveHint");
        beep();
        renderBattle();
      }));
    }
    syncBattleLayout();
  };
  const renderResult = () => {
    const finished = state.cleared.length === rounds.length;
    setText($("resultHeading"), finished ? "finishTitle" : "resultTitle");
    setText($("resultText"), finished ? "finishText" : "resultText");
    const badges = $("resultBadges");
    if (badges) badges.innerHTML = state.cleared.map((number) => "<span class=\"result-badge\">" + copy("badge", { number: number + 1 }) + " · " + copy("badgeComplete") + "</span>").join("");
    const primary = $("resultPrimaryBtn");
    const hasNext = state.round < rounds.length - 1;
    if (primary) {
      primary.textContent = copy("nextStage");
      primary.dataset.action = hasNext ? "next" : "disabled";
      primary.disabled = !hasNext;
      primary.setAttribute("aria-disabled", String(!hasNext));
    }
    const replay = $("resultHomeBtn");
    if (replay) {
      replay.hidden = false;
      replay.disabled = false;
      replay.textContent = copy("replay");
    }
  };
  const startRound = (number) => {
    state.round = Math.max(0, Math.min(rounds.length - 1, number));
    state.pattern = rounds[state.round].initial.slice();
    state.flips = 0;
    if ($("battleStatus")) $("battleStatus").textContent = "";
    show("battle");
  };
  const clearRound = () => {
    if (!samePattern()) {
      announce("incorrect");
      return;
    }
    beep();
    if (!state.cleared.includes(state.round)) state.cleared.push(state.round);
    const best = getBest();
    if (!best || state.flips < best) safeSet("weightplay-animal-folded-field-best", String(state.flips));
    announce("correct");
    window.setTimeout(() => show("result"), 250);
  };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    window.WonderI18n?.setLocale(state.locale, { navigate: false, dispatch: false });
    document.documentElement.lang = state.locale;
    document.documentElement.dir = rtlLocales.has(state.locale) ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => setText(node, node.dataset.copy));
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)));
    const labels = [
      ["settingsBtn", "settings"], ["settingsPanel", "settings"], ["foldedChoice", "language"],
      ["stageInfoBtn", "mapIntro"], ["battleInfoBtn", "moveHint"], ["targetPattern", "targetPattern"],
      ["currentPattern", "currentPattern"], ["flapBoard", "currentPattern"], ["resultBadges", "stages"],
    ];
    labels.forEach(([id, key]) => { const node = $(id); if (node) node.setAttribute("aria-label", copy(key)); });
    const sound = $("soundBtn");
    if (sound) sound.textContent = copy(state.sound ? "soundOn" : "soundOff");
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
  };
  const bind = () => {
    document.addEventListener("click", (event) => {
      const card = event.target?.closest?.("#stageList [data-stage]");
      if (!card || state.screen !== "stage") return;
      startRound(Number(card.dataset.stage));
    }, true);
    $("startBtn").addEventListener("click", () => show("stage"));
    $("mapBtn").addEventListener("click", () => show("stage"));
    $("stageBackBtn").addEventListener("click", () => show("main"));
    $("battleBackBtn").addEventListener("click", () => show("stage"));
    $("resetBtn").addEventListener("click", () => { state.pattern = rounds[state.round].initial.slice(); state.flips = 0; announce("moveHint"); renderBattle(); });
    $("checkBtn").addEventListener("click", clearRound);
    $("resultMapBtn").addEventListener("click", () => {
      if (state.cleared.length) state.round = Math.max(...state.cleared);
      show("stage");
    });
    $("resultHomeBtn").addEventListener("click", () => startRound(state.round));
    $("resultPrimaryBtn").addEventListener("click", () => {
      if ($("resultPrimaryBtn").dataset.action === "next") startRound(state.round + 1);
    });
    $("settingsBtn")?.addEventListener("click", () => {
      const panel = $("settingsPanel");
      panel.hidden = !panel.hidden;
      $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden));
    });
    $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-folded-field-sound", state.sound ? "on" : "off"); applyLocale(state.locale); });
    $("foldedChoice").addEventListener("change", (event) => applyLocale(event.target.value));
    $("stageInfoBtn").addEventListener("click", () => window.alert(copy("mapIntro")));
    $("battleInfoBtn").addEventListener("click", () => window.alert(copy("moveHint")));
  };
  const boot = () => {
    installInterfaceCompatibility();
    watchMainMapAction();
    // Keep persistent actions outside the independently scrolling field.
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    const actions = canvas.querySelector(".battle-actions");
    canvas.append(actions);
    const routeLocale = String(window.__WEIGHTPLAY_ROUTE_LOCALE__ || "").trim();
    const savedLocale = localeList.includes(routeLocale) ? routeLocale : safeGet("weightplay-locale", "en");
    const savedSound = safeGet("weightplay-animal-folded-field-sound", "on");
    state.sound = savedSound !== "off";
    state.cleared = [];
    bind();
    if ($("foldedChoice")) $("foldedChoice").value = localeList.includes(savedLocale) ? savedLocale : "en";
    applyLocale(savedLocale);
    const loading = $("loadingPanel");
    if (loading) window.setTimeout(() => { loading.hidden = true; show("main"); }, 180);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
