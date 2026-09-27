(() => {
  "use strict";
  const locales = window.ANIMAL_BLOOM_MIXER_LOCALES || {};
  const recipes = [
    { name: "recipeOne", note: "recipeOneNote", solution: ["mint", "amber", "violet"] },
    { name: "recipeTwo", note: "recipeTwoNote", solution: ["coral", "mint", "amber"] },
    { name: "recipeThree", note: "recipeThreeNote", solution: ["violet", "coral", "mint"] }
  ];
  const petals = ["amber", "mint", "coral", "violet", "gold"];
  const state = { locale: "en", recipe: 0, selected: [], completed: 0, sessionPicks: 0, recipeStartPicks: 0, attemptPicks: 0, stageBrowse: 0, screen: "main", sound: !window.WeightPlayAudio.isMuted(), leaveOpen: false };
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const t = (key, vars = {}) => { const table = locales[state.locale] || locales.en || {}; let value = table[key] || locales.en?.[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); }); return value; };
  const show = (screen) => {
    state.screen = screen;
    document.querySelectorAll("section[data-screen]").forEach((node) => { node.hidden = node.dataset.screen !== screen; node.inert = node.dataset.screen !== screen; });
    const guide = $("public-guide"); if (guide) guide.hidden = screen !== "main";
    document.body.dataset.screen = screen;
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync", { detail: { screen } }));
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: { screen } }));
    window.dispatchEvent(new CustomEvent("weightplay:battle-sync", { detail: { screen } }));
  };
  const readBest = () => { try { const value = Number(localStorage.getItem("weightplay-animal-bloom-mixer-best-v1")); return Number.isFinite(value) && value > 0 ? value : null; } catch (_) { return null; } };
  const saveBest = () => { try { const old = readBest(); if (!old || state.sessionPicks < old) localStorage.setItem("weightplay-animal-bloom-mixer-best-v1", String(state.sessionPicks)); } catch (_) {} };
  const track = (event, detail = {}) => { window.dispatchEvent(new CustomEvent("weightplay:analytics", { detail: { game: "animal-bloom-mixer", game_version: "v1", interface_version: "7", event, ...detail } })); };
  const tone = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  const announce = (key, vars = {}, kind = "") => { const node = $("battle-status"); node.textContent = t(key, vars); node.dataset.kind = kind; };
  const renderStages = (advanceToHighest = false) => {
    const rail = $("recipe-list");
    const highestUnlocked = Math.min(state.completed, recipes.length - 1);
    if (advanceToHighest) state.stageBrowse = highestUnlocked;
    state.stageBrowse = Math.max(0, Math.min(recipes.length - 1, state.stageBrowse));
    const recommended = state.stageBrowse;
    rail.replaceChildren(...recipes.map((recipe, index) => {
      const locked = index > state.completed;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-card recipe-card" + (locked ? " locked" : "");
      button.dataset.index = String(index);
      button.dataset.stageIndex = String(index);
      button.setAttribute("aria-posinset", String(index + 1));
      button.setAttribute("aria-setsize", String(recipes.length));
      button.setAttribute("aria-disabled", String(locked));
      if (index === recommended) { button.dataset.wpStageRecommended = "true"; button.setAttribute("aria-current", "true"); }
      button.setAttribute("aria-label", (locked ? t("locked") : t("open")) + ": " + t(recipe.name));
      const number = document.createElement("span"); number.className = "recipe-number"; number.textContent = String(index + 1);
      const copy = document.createElement("span"); copy.className = "recipe-copy"; copy.innerHTML = "<strong>" + t("recipeLabel", { n: index + 1 }) + " · " + t(recipe.name) + "</strong><small>" + (index < state.completed ? t("complete") : locked ? t("locked") : t("open")) + "</small>";
      const arrow = document.createElement("span"); arrow.className = "recipe-arrow"; arrow.textContent = locked ? "●" : "→";
      button.append(number, copy, arrow);
      button.addEventListener("click", (event) => { if (locked) { event.preventDefault(); return; } state.stageBrowse = index; startRecipe(index); });
      return button;
    }));
    rail.dataset.wpStageTotal = String(recipes.length);
    rail.dataset.wpStageRecommendation = "explicit";
    window.dispatchEvent(new CustomEvent("weightplay:stage-sync", { detail: { screen: state.screen } }));
  };
  $("recipe-list").addEventListener("wonder:stage-snap", (event) => {
    const index = Number(event.detail?.index);
    if (!Number.isInteger(index) || index < 0 || index >= recipes.length) return;
    state.stageBrowse = index;
    $("recipe-list").querySelectorAll("[data-wp-stage-recommended]").forEach((card) => card.removeAttribute("data-wp-stage-recommended"));
    const current = $("recipe-list").querySelector(`[data-stage-index="${index}"]`);
    if (current) current.dataset.wpStageRecommended = "true";
  });
  const renderBattle = () => { const recipe = recipes[state.recipe]; $("recipe-title").textContent = t(recipe.name); $("recipe-note").textContent = t(recipe.note); $("pick-count").textContent = String(state.selected.length); const basket = $("basket"); basket.replaceChildren(...state.selected.map((petal) => { const chip = document.createElement("span"); chip.className = "basket-chip"; chip.textContent = t(petal); return chip; })); const grid = $("petal-grid"); grid.replaceChildren(...petals.map((petal) => { const button = document.createElement("button"); button.type = "button"; button.className = "petal-button"; button.dataset.petal = petal; button.dataset.wpPrimaryAction = "true"; button.setAttribute("aria-pressed", String(state.selected.includes(petal))); button.setAttribute("aria-label", t("add", { name: t(petal) })); const mark = document.createElement("span"); mark.className = `petal-mark ${petal}`; mark.setAttribute("aria-hidden", "true"); const label = document.createElement("span"); label.textContent = t(petal); button.append(mark, label); button.addEventListener("click", () => choosePetal(petal)); return button; })); $("check-button").disabled = state.selected.length !== 3; };
  const renderResult = () => {
    const finalRecipe = state.recipe >= recipes.length - 1;
    const allDone = state.completed >= recipes.length;
    $("result-title").textContent = allDone ? t("resultTitle") : t("resultPartial");
    $("result-copy").textContent = allDone ? t("finalCopy") : t("resultCopy", { picks: state.sessionPicks });
    $("result-picks").textContent = String(state.sessionPicks);
    $("result-best").textContent = readBest() || t("noBest");
    $("result-status").textContent = t("correct");
    $("next-button").disabled = finalRecipe;
    $("next-button").setAttribute("aria-disabled", String(finalRecipe));
  };
  const setResultOpen = (open) => {
    const live = $("battle-panel"), result = $("result-panel"), header = $("battleScreen").querySelector(":scope > .topbar");
    result.hidden = !open;
    live.hidden = open;
    live.inert = open;
    header.inert = open;
    if (open) header.setAttribute("aria-hidden", "true"); else header.removeAttribute("aria-hidden");
  };
  const setLeaveOpen = (open, restoreFocus = true) => {
    if (!$("result-panel").hidden && open) return;
    const panel = $("leave-panel"), live = $("battle-panel"), header = $("battleScreen").querySelector(":scope > .topbar");
    state.leaveOpen = open;
    panel.hidden = !open;
    live.inert = open;
    header.inert = open;
    if (open) {
      live.setAttribute("aria-hidden", "true"); header.setAttribute("aria-hidden", "true");
      requestAnimationFrame(() => $("continue-battle").focus({ preventScroll: true }));
    } else {
      live.removeAttribute("aria-hidden"); header.removeAttribute("aria-hidden");
      if (restoreFocus && state.screen === "battle") $("battle-back").focus({ preventScroll: true });
    }
  };
  const startRecipe = (index, replay = false) => {
    const next = Math.max(0, Math.min(recipes.length - 1, index));
    if (next > state.completed) return;
    if (replay) state.sessionPicks = state.recipeStartPicks;
    else if (next === 0) state.sessionPicks = 0;
    state.recipe = next;
    state.recipeStartPicks = state.sessionPicks;
    state.attemptPicks = 0;
    state.selected = [];
    setLeaveOpen(false, false);
    setResultOpen(false);
    show("battle");
    renderBattle();
    announce("begin");
    track("recipe_start", { recipe: state.recipe + 1 });
  };
  const choosePetal = (petal) => { if (state.selected.includes(petal)) { state.selected = state.selected.filter((item) => item !== petal); announce("begin"); renderBattle(); track("petal_remove", { petal }); return; } if (state.selected.length >= 3) { announce("full", {}, "wrong"); return; } state.selected = [...state.selected, petal]; state.sessionPicks += 1; state.attemptPicks += 1; renderBattle(); announce("selected", { name: t(petal) }); tone("board.move"); track("petal_select", { petal, recipe: state.recipe + 1 }); };
  const clearBasket = () => { state.selected = []; renderBattle(); announce("begin"); track("basket_clear", { recipe: state.recipe + 1 }); };
  const checkRecipe = () => {
    if (state.selected.length !== 3) return;
    const expected = [...recipes[state.recipe].solution].sort(), actual = [...state.selected].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) { announce("wrong", {}, "wrong"); tone("feedback.error"); track("recipe_check", { recipe: state.recipe + 1, result: "wrong" }); return; }
    state.completed = Math.max(state.completed, state.recipe + 1);
    $("mainProgress").textContent = t("progress", { done: state.completed, total: recipes.length });
    track("recipe_check", { recipe: state.recipe + 1, result: "correct" });
    tone("feedback.success");
    if (state.completed >= recipes.length) saveBest();
    setResultOpen(true);
    renderResult();
    requestAnimationFrame(() => ($("next-button").disabled ? $("result-stage") : $("next-button")).focus({ preventScroll: true }));
  };
  const applyLocale = () => { document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); document.querySelectorAll("[data-copy-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.copyAria))); $("mainProgress").textContent = t("progress", { done: state.completed, total: recipes.length }); $("locale-select").value = state.locale; $("locale-select").setAttribute("aria-label", t("language")); $("sound-toggle").textContent = state.sound ? t("soundOn") : t("soundOff"); $("sound-toggle").setAttribute("aria-pressed", String(state.sound)); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); if (state.screen === "battle" && !$("battle-panel").hidden) announce("begin"); if (state.screen === "battle" && !$("result-panel").hidden) renderResult(); };
  $("start-button").addEventListener("click", () => { renderStages(); show("stage"); });
  $("stage-back").addEventListener("click", () => show("main"));
  $("battle-back").addEventListener("click", () => { if (!$("result-panel").hidden) return; setLeaveOpen(true); });
  $("continue-battle").addEventListener("click", () => setLeaveOpen(false, true));
  $("leave-stage").addEventListener("click", () => {
    state.sessionPicks = state.recipeStartPicks; state.attemptPicks = 0; state.selected = [];
    setLeaveOpen(false, false); setResultOpen(false); show("stage");
  });
  $("leave-panel").addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); setLeaveOpen(false, true); return; }
    if (event.key !== "Tab") return;
    const actions = [$("continue-battle"), $("leave-stage")], index = actions.indexOf(document.activeElement);
    const next = event.shiftKey ? (index <= 0 ? actions.length - 1 : index - 1) : (index >= actions.length - 1 ? 0 : index + 1);
    event.preventDefault(); actions[next].focus({ preventScroll: true });
  }, true);
  $("result-stage").addEventListener("click", () => { setResultOpen(false); renderStages(true); show("stage"); });
  $("next-button").addEventListener("click", () => { if ($("next-button").disabled) return; startRecipe(state.recipe + 1); });
  $("retry-button").addEventListener("click", () => startRecipe(state.recipe, true));
  $("check-button").addEventListener("click", checkRecipe);
  $("clear-button").addEventListener("click", clearBasket);
  $("sound-toggle").addEventListener("click", () => { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); applyLocale(); });
  $("locale-select").addEventListener("change", (event) => { state.locale = locales[event.target.value] ? event.target.value : "en"; try { localStorage.setItem("weightplayLocale", state.locale); } catch (_) {} applyLocale(); });
  try { const saved = localStorage.getItem("weightplayLocale"); if (saved && locales[saved]) state.locale = saved; } catch (_) {}
  applyLocale(); renderStages(); show("main"); window.setTimeout(() => $("loading-screen").classList.add("is-ready"), 0); window.__ANIMAL_BLOOM_MIXER_TEST__ = { recipes, startRecipe, choosePetal, checkRecipe, clearBasket, getState: () => ({ ...state, selected: [...state.selected] }) };
})();
