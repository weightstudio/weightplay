(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const localeKeys = window.ANIMAL_PETAL_PILOT_LOCALE_KEYS || ["en"];
  const locales = window.ANIMAL_PETAL_PILOT_LOCALES || {};
  const rounds = [
    { target: [0, 120, 240], options: [[0, 120, 240], [24, 144, 264], [0, 95, 190]] },
    { target: [40, 160, 280], options: [[40, 160, 280], [62, 182, 302], [40, 135, 230]] },
    { target: [10, 130, 250], options: [[10, 130, 250], [34, 154, 274], [10, 100, 210]] }
  ];
  const state = { view: "main", locale: "en", round: 0, selected: null, totalChecks: 0, sound: false };
  const t = (key, vars = {}) => {
    const copy = locales[state.locale] || locales.en || {};
    const value = copy[key] ?? (locales.en || {})[key] ?? key;
    if (Array.isArray(value)) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
  };
  const track = (name, detail = {}) => window.WonderAnalytics?.track?.(`petal_pilot_${name}`, detail);
  const tone = (frequency) => {
    if (!state.sound) return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.035;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
    } catch (_) {}
  };
  const readBest = () => {
    try { return Number(localStorage.getItem("weightplay-animal-petal-pilot-best")) || 0; } catch (_) { return 0; }
  };
  const saveBest = () => {
    const old = readBest();
    if (!old || state.totalChecks < old) {
      try { localStorage.setItem("weightplay-animal-petal-pilot-best", String(state.totalChecks)); } catch (_) {}
    }
  };
  const show = (view) => {
    state.view = view;
    $("mainScreen").hidden = view !== "main";
    $("battleScreen").hidden = view !== "battle";
    $("resultScreen").hidden = view !== "result";
    document.body.classList.toggle("wp-shell-battle-active", view === "battle");
    document.body.classList.toggle("wp-shell-result-active", view === "result");
    window.scrollTo(0, 0);
  };
  const applyLocale = () => {
    const copy = locales[state.locale] || locales.en || {};
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.title = `${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("locale-select").value = state.locale;
    document.querySelectorAll("[data-sound-toggle]").forEach((node) => {
      node.textContent = state.sound ? t("soundOn") : t("soundOff");
      node.setAttribute("aria-pressed", String(state.sound));
    });
    if (state.view === "battle") renderBattle();
    if (state.view === "result") renderResult();
  };
  const populateLocales = () => {
    const select = $("locale-select");
    select.replaceChildren(...localeKeys.map((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = (locales.en.languageNames || {})[key] || key;
      return option;
    }));
    select.addEventListener("change", () => {
      state.locale = select.value;
      try { localStorage.setItem("weightplay-animal-petal-pilot-locale", state.locale); } catch (_) {}
      applyLocale();
    });
  };
  const makePetals = (angles, className) => {
    const fragment = document.createDocumentFragment();
    angles.forEach((angle) => {
      const petal = document.createElement("span");
      petal.className = `petal ${className || ""}`;
      petal.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
      petal.setAttribute("aria-hidden", "true");
      fragment.append(petal);
    });
    return fragment;
  };
  const makeBloom = (angles, label, small = false) => {
    const bloom = document.createElement("div");
    bloom.className = `bloom${small ? " ring-orbit" : ""}`;
    bloom.setAttribute("role", "img");
    bloom.setAttribute("aria-label", label);
    bloom.append(makePetals(angles, small ? "ring-petal" : ""));
    const seed = document.createElement("span");
    seed.className = "seed-core";
    seed.setAttribute("aria-hidden", "true");
    bloom.append(seed);
    if (!small) angles.slice(0, 2).forEach((angle) => {
      const nectar = document.createElement("span");
      nectar.className = "nectar";
      nectar.style.transform = `rotate(${angle}deg) translateY(-38px)`;
      nectar.setAttribute("aria-hidden", "true");
      bloom.append(nectar);
    });
    return bloom;
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    $("round-title").textContent = t("rounds")[state.round];
    $("round-count").textContent = `${state.round + 1}/${rounds.length}`;
    const target = makeBloom(round.target, t("targetAlt")[state.round]);
    target.id = "target-bloom";
    $("target-bloom").replaceWith(target);
    const options = $("ring-options");
    options.replaceChildren(...round.options.map((angles, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ring-card${state.selected === index ? " is-selected" : ""}`;
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-pressed", String(state.selected === index));
      button.append(makeBloom(angles, t("ringAlt", { name: t("rings")[index], angles: angles.join("°, ") + "°" }), true));
      const label = document.createElement("strong");
      label.textContent = t("rings")[index];
      button.append(label);
      button.addEventListener("click", () => {
        state.selected = index;
        $("selection-note").textContent = t("selected", { n: index + 1 });
        $("battle-status").textContent = t("chooseHint");
        $("battle-status").dataset.kind = "";
        $("check-button").disabled = false;
        renderBattle();
        track("select", { round: state.round + 1, ring: index + 1 });
      });
      return button;
    }));
    $("check-button").disabled = state.selected === null;
  };
  const renderResult = () => {
    $("result-text").textContent = t("resultText", { checks: state.totalChecks });
    $("result-checks").textContent = String(state.totalChecks);
    $("result-best").textContent = String(readBest() || t("noBest"));
    $("result-status").textContent = t("correct");
  };
  const start = () => { state.round = 0; state.selected = null; state.totalChecks = 0; show("battle"); renderBattle(); track("start"); };
  const reset = () => { state.selected = null; $("selection-note").textContent = ""; $("battle-status").textContent = t("chooseHint"); $("battle-status").dataset.kind = ""; renderBattle(); track("reset", { round: state.round + 1 }); };
  const check = () => {
    if (state.selected === null) return;
    state.totalChecks += 1;
    if (state.selected !== 0) {
      $("battle-status").textContent = t("wrong");
      $("battle-status").dataset.kind = "wrong";
      tone(180);
      track("check", { round: state.round + 1, result: "wrong" });
      return;
    }
    $("battle-status").textContent = t("correct");
    $("battle-status").dataset.kind = "correct";
    tone(680);
    track("check", { round: state.round + 1, result: "correct" });
    if (state.round < rounds.length - 1) {
      state.round += 1;
      state.selected = null;
      $("selection-note").textContent = "";
      renderBattle();
    } else {
      saveBest();
      renderResult();
      show("result");
      track("complete", { checks: state.totalChecks });
    }
  };
  const openSettings = () => { const dialog = $("settings-dialog"); if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); };
  const closeSettings = () => { const dialog = $("settings-dialog"); if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); };
  const goHome = () => { closeSettings(); state.selected = null; show("main"); applyLocale(); };
  state.locale = (() => {
    try { const saved = localStorage.getItem("weightplay-animal-petal-pilot-locale"); if (saved && locales[saved]) return saved; } catch (_) {}
    const query = new URLSearchParams(location.search).get("lang");
    return locales[query] ? query : "en";
  })();
  document.addEventListener("DOMContentLoaded", () => {
    populateLocales();
    applyLocale();
    $("start-button").addEventListener("click", start);
    $("guide-button").addEventListener("click", openSettings);
    $("main-settings").addEventListener("click", openSettings);
    $("battle-sound").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); });
    $("result-settings").addEventListener("click", openSettings);
    $("close-settings").addEventListener("click", closeSettings);
    $("sound-toggle").addEventListener("click", () => { state.sound = !state.sound; applyLocale(); });
    $("battle-home").addEventListener("click", goHome);
    $("result-home").addEventListener("click", goHome);
    $("reset-button").addEventListener("click", reset);
    $("check-button").addEventListener("click", check);
    $("replay-button").addEventListener("click", start);
    $("result-menu").addEventListener("click", goHome);
  });
  window.ANIMAL_PETAL_PILOT_TEST = { rounds, start, reset, check, getState: () => ({ ...state }) };
})();
