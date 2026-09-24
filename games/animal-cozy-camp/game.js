(function () {
  "use strict";
  const locales = window.ANIMAL_COZY_CAMP_LOCALES || {};
  const localeKeys = window.ANIMAL_COZY_CAMP_LOCALE_KEYS || ["en"];
  const startLabels = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲーム開始",
    ko: "게임 시작",
    es: "Iniciar juego",
    "pt-BR": "Iniciar jogo",
    fr: "Démarrer le jeu",
    de: "Spiel starten",
    it: "Avvia gioco",
    ru: "Начать игру",
    hi: "खेल शुरू करें",
    ar: "ابدأ اللعبة"
  };
  Object.entries(startLabels).forEach(([locale, label]) => {
    if (locales[locale]) locales[locale].start = label;
  });
  const authoredRounds = [
    { title: "roundOne", clues: ["r1c1", "r1c2"], layouts: [["orla", "moss", "taro", "pip"], ["orla", "taro", "moss", "pip"], ["moss", "orla", "pip", "taro"]], solution: 0 },
    { title: "roundTwo", clues: ["r2c1", "r2c2"], layouts: [["taro", "pip", "orla", "moss"], ["taro", "orla", "pip", "moss"], ["pip", "taro", "moss", "orla"]], solution: 0 },
    { title: "roundThree", clues: ["r3c1", "r3c2"], layouts: [["pip", "orla", "taro", "moss"], ["moss", "pip", "taro", "orla"], ["orla", "moss", "taro", "pip"]], solution: 0 }
  ];
  const shuffleRound = (round) => {
    const entries = round.layouts.map((layout, index) => ({ layout, correct: index === round.solution }));
    for (let i = entries.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return { ...round, layouts: entries.map((entry) => entry.layout), solution: entries.findIndex((entry) => entry.correct) };
  };
  const rotateLayout = (layout, steps) => layout.map((_, index) => layout[(index + steps) % layout.length]);
  const buildCampaign = () => Array.from({ length: 30 }, (_, index) => {
    const base = authoredRounds[index % authoredRounds.length];
    const rotation = Math.floor(index / authoredRounds.length) % 4;
    return shuffleRound({ ...base, layouts: base.layouts.map((layout) => rotateLayout(layout, rotation)) });
  });
  let rounds = buildCampaign();
  const routeLocale = (() => {
    const map = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return map[segment] || null;
  })();
  const state = { locale: "en", sound: !Boolean(window.WeightPlayAudio?.isMuted?.()), round: 0, selected: null, checks: 0, totalChecks: 0, view: "main", locked: false };
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => { const table = locales[state.locale] || locales.en || {}; let value = String(table[key] || locales.en?.[key] || key); Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); }); return value; };
  const show = (view) => { state.view = view; document.querySelectorAll("[data-view]").forEach((node) => { node.hidden = node.dataset.view !== view; }); document.body.dataset.screen = view; window.scrollTo(0, 0); };
  const storageKey = "weightplay-animal-cozy-camp-best-v2";
  const readBest = () => { try { const value = Number(localStorage.getItem(storageKey)); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const saveBest = () => { try { const old = readBest(); if (!old || state.totalChecks < old) localStorage.setItem(storageKey, String(state.totalChecks)); } catch (_) {} };
  const track = (event, detail = {}) => { window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-cozy-camp", event, ...detail } })); };
  const tone = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  const syncSoundState = () => { state.sound = !Boolean(window.WeightPlayAudio?.isMuted?.()); };
  const applyLocale = () => { const copy = locales[state.locale] || locales.en; document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale; document.documentElement.dir = copy.direction || "ltr"; document.title = `${t("title")} | WeightPlay`; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); document.querySelectorAll("[data-copy-alt]").forEach((node) => { node.setAttribute("alt", t(node.dataset.copyAlt)); }); document.querySelectorAll("[data-copy-aria]").forEach((node) => { const key = node.dataset.copyAria === "sound" ? (state.sound ? "soundOn" : "soundOff") : node.dataset.copyAria; node.setAttribute("aria-label", t(key)); }); $("gameGuide")?.setAttribute("aria-label", t("guideTitle")); $("layout-choices")?.setAttribute("aria-label", t("layoutAria")); [$("sound-toggle"), $("camp-sound-toggle")].filter(Boolean).forEach((node) => { node.textContent = state.sound ? t("soundOn") : t("soundOff"); node.setAttribute("aria-pressed", String(state.sound)); }); [$("locale-select"), $("camp-picker")].filter(Boolean).forEach((node) => { node.setAttribute("aria-label", t("language")); node.value = state.locale; }); if (state.view === "battle") renderBattle(); if (state.view === "result") renderResult(); };
  const populateLocales = () => { const options = () => localeKeys.map((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key] || key; return option; }); const select = $("locale-select"); const picker = $("camp-picker"); [select, picker].filter(Boolean).forEach((node) => node.replaceChildren(...options())); const onLocaleChange = (event) => { state.locale = event.target.value; try { localStorage.setItem("weightplay-animal-cozy-camp-locale", state.locale); } catch (_) {} window.dispatchEvent(new CustomEvent("wonder:locale-change")); applyLocale(); }; select?.addEventListener("change", onLocaleChange); picker?.addEventListener("change", onLocaleChange); };
  const openDialog = (id) => { const dialog = $(id); if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); };
  const closeDialog = (id) => { const dialog = $(id); if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); };
  const start = () => { rounds = buildCampaign(); state.round = 0; state.selected = null; state.checks = 0; state.totalChecks = 0; state.locked = false; $("selection-note").textContent = ""; $("battle-status").textContent = t("choose"); $("battle-status").dataset.kind = ""; tone("game.start"); show("battle"); renderBattle(); track("camp_start"); };
  const renderBattle = () => { const round = rounds[state.round]; $("round-title").textContent = t(round.title); $("round-count").textContent = `${state.round + 1}/${rounds.length}`; const clues = $("clue-list"); clues.replaceChildren(...round.clues.map((key) => { const item = document.createElement("li"); item.textContent = t(key); return item; })); const choices = $("layout-choices"); choices.replaceChildren(...round.layouts.map((layout, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "layout-card"; button.setAttribute("role", "listitem"); button.setAttribute("aria-pressed", String(state.selected === index)); button.classList.toggle("is-selected", state.selected === index); const title = document.createElement("strong"); title.textContent = t(index === 0 ? "layoutA" : index === 1 ? "layoutB" : "layoutC"); const order = document.createElement("span"); order.className = "seat-order"; layout.forEach((name) => { const seat = document.createElement("span"); seat.className = "seat-chip"; seat.textContent = t(name); order.append(seat); }); button.append(title, order); button.addEventListener("click", () => { if (state.locked) return; state.selected = index; $("selection-note").textContent = t("selected", { n: index + 1 }); $("battle-status").textContent = t("choose"); $("battle-status").dataset.kind = ""; $("check-button").disabled = false; renderBattle(); track("layout_select", { round: state.round + 1, layout: index + 1 }); }); return button; })); $("check-button").disabled = state.selected === null; };
  const renderResult = () => { $("result-text").textContent = t("resultText30", { checks: state.totalChecks }); $("result-checks").textContent = String(state.totalChecks); $("result-best").textContent = String(readBest() || t("noBest")); $("result-status").textContent = t("correct"); };
  const reset = () => { state.selected = null; $("selection-note").textContent = ""; $("battle-status").textContent = t("choose"); $("battle-status").dataset.kind = ""; renderBattle(); track("layout_reset", { round: state.round + 1 }); };
  const check = () => {
    if (state.selected === null || state.locked) return;
    state.checks += 1;
    state.totalChecks += 1;
    if (state.selected !== rounds[state.round].solution) {
      $("battle-status").textContent = t("wrong");
      $("battle-status").dataset.kind = "wrong";
      $("battleScreen")?.classList.remove("is-wrong"); void $("battleScreen")?.offsetWidth; $("battleScreen")?.classList.add("is-wrong");
      tone("feedback.error");
      track("layout_check", { round: state.round + 1, result: "wrong" });
      return;
    }
    $("battle-status").textContent = t("correct");
    $("battle-status").dataset.kind = "correct";
    state.locked = true;
    $("check-button").disabled = true;
    $("battleScreen")?.classList.add("is-correct");
    if (state.round < rounds.length - 1) tone("feedback.success");
    track("layout_check", { round: state.round + 1, result: "correct" });
    window.setTimeout(() => {
      if (state.round < rounds.length - 1) {
        state.round += 1;
        state.selected = null;
        $("selection-note").textContent = "";
        $("battle-status").textContent = t("choose");
        $("battle-status").dataset.kind = "";
        $("battleScreen")?.classList.remove("is-correct");
        state.locked = false;
        renderBattle();
      } else {
        saveBest();
        tone("result.win");
        renderResult();
        show("result");
        track("camp_complete");
      }
    }, 520);
  };
  const goHome = () => { closeDialog("leave-dialog"); show("main"); applyLocale(); };
  const requestHome = () => openDialog("leave-dialog");
  state.locale = (() => { const query = new URLSearchParams(location.search).get("lang"); if (locales[query]) return query; if (routeLocale && locales[routeLocale]) return routeLocale; try { const saved = localStorage.getItem("weightplay-animal-cozy-camp-locale"); if (saved && locales[saved]) return saved; } catch (_) {} return "en"; })();
  document.addEventListener("DOMContentLoaded", () => { populateLocales(); applyLocale(); $("start-button").addEventListener("click", start); $("guide-button").addEventListener("click", () => openDialog("guide-dialog")); $("guide-start").addEventListener("click", () => { closeDialog("guide-dialog"); start(); }); $("close-guide").addEventListener("click", () => closeDialog("guide-dialog")); $("main-settings").addEventListener("click", () => openDialog("settings-dialog")); $("battle-settings").addEventListener("click", () => openDialog("settings-dialog")); $("result-settings").addEventListener("click", () => openDialog("settings-dialog")); $("close-settings").addEventListener("click", () => closeDialog("settings-dialog")); const toggleSound = () => { window.WeightPlayAudio?.setMuted?.(!Boolean(window.WeightPlayAudio?.isMuted?.())); syncSoundState(); applyLocale(); }; $("sound-toggle").addEventListener("click", toggleSound); $("camp-sound-toggle").addEventListener("click", toggleSound); window.addEventListener?.("weightplay:audio-volume-change", () => { syncSoundState(); applyLocale(); }); $("battle-home").addEventListener("click", requestHome); $("cancel-leave").addEventListener("click", () => closeDialog("leave-dialog")); $("keep-playing").addEventListener("click", () => closeDialog("leave-dialog")); $("confirm-leave").addEventListener("click", goHome); $("reset-button").addEventListener("click", reset); $("check-button").addEventListener("click", check); $("replay-button").addEventListener("click", start); $("home-button").addEventListener("click", () => { show("main"); applyLocale(); }); window.setTimeout(() => { $("loading-view").hidden = true; show("main"); }, 80); });
  window.ANIMAL_COZY_CAMP_TEST = { rounds, start, reset, check, getState: () => ({ ...state }) };
})();
