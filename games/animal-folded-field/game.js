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
  const show = (screen) => {
    state.screen = screen;
    ["main", "stage", "battle", "result"].forEach((name) => {
      const node = $(name + "Screen");
      if (node) node.hidden = name !== screen;
    });
    document.body.dataset.screen = screen;
    if (screen === "main") renderMain();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    if (screen === "result") renderResult();
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
    list.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
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
  };
  const renderResult = () => {
    const finished = state.cleared.length === rounds.length;
    setText($("resultHeading"), finished ? "finishTitle" : "resultTitle");
    setText($("resultText"), finished ? "finishText" : "resultText");
    const badges = $("resultBadges");
    if (badges) badges.innerHTML = state.cleared.map((number) => "<span class=\"result-badge\">" + copy("badge", { number: number + 1 }) + " · " + copy("badgeComplete") + "</span>").join("");
    const primary = $("resultPrimaryBtn");
    if (primary) {
      primary.textContent = finished ? copy("home") : copy("next");
      primary.dataset.action = finished ? "home" : "next";
    }
    if ($("resultHomeBtn")) $("resultHomeBtn").hidden = finished;
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
    const sound = $("soundBtn");
    if (sound) sound.textContent = copy(state.sound ? "soundOn" : "soundOff");
    renderMain();
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
    if (state.screen === "result") renderResult();
  };
  const bind = () => {
    $("startBtn").addEventListener("click", () => startRound(0));
    $("mapBtn").addEventListener("click", () => show("stage"));
    $("stageBackBtn").addEventListener("click", () => show("main"));
    $("battleBackBtn").addEventListener("click", () => show("stage"));
    $("resetBtn").addEventListener("click", () => { state.pattern = rounds[state.round].initial.slice(); state.flips = 0; announce("moveHint"); renderBattle(); });
    $("checkBtn").addEventListener("click", clearRound);
    $("resultMapBtn").addEventListener("click", () => show("stage"));
    $("resultHomeBtn").addEventListener("click", () => show("main"));
    $("resultPrimaryBtn").addEventListener("click", () => {
      if ($("resultPrimaryBtn").dataset.action === "next") startRound(state.round + 1);
      else show("main");
    });
    $("settingsBtn").addEventListener("click", () => {
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
    const savedLocale = safeGet("weightplay-locale", "en");
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
