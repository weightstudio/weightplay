(function () {
  "use strict";
  const localeMap = window.MAGNET_MEADOW_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const rounds = [
    { title: "First pull", hint: "Learn one pull response.", relation: "pull", initial: { a: 0, b: 4 }, target: { a: 1, b: 5 } },
    { title: "Quiet push", hint: "Use a push response.", relation: "push", initial: { a: 4, b: 2 }, target: { a: 5, b: 1 } },
    { title: "Double settle", hint: "Plan two pull moves.", relation: "pull", initial: { a: 0, b: 3 }, target: { a: 2, b: 5 } },
  ];
  const state = { locale: "en", screen: "main", round: 0, positions: { a: 0, b: 5 }, moves: 0, completed: [], selected: "a", sound: true, drag: null };
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const samePosition = (first, second) => first.a === second.a && first.b === second.b;
  const currentRound = () => rounds[state.round];
  const bestTotal = () => Number(safeGet("weightplay-animal-magnet-meadow-best", "0")) || 0;
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    $("battleSoundBtn").setAttribute("aria-label", copy("sound"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const setScreen = (screen) => {
    state.screen = screen;
    document.body.dataset.screen = screen;
    ["main", "stage", "battle"].forEach((name) => {
      const element = $(name + "Screen");
      element.hidden = name !== screen;
      element.classList.toggle("active", name === screen);
    });
    const guide = $("guideScreen");
    if (guide) guide.hidden = screen !== "main";
    if (screen === "main") applyText();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    window.scrollTo(0, 0);
  };
  const stageUnlocked = (index) => index === 0 || state.completed.includes(index - 1);
  const renderStages = () => {
    $("stageList").innerHTML = rounds.map((round, index) => {
      const done = state.completed.includes(index);
      const unlocked = stageUnlocked(index);
      const disabled = unlocked ? "" : " disabled";
      return "<button class=\"stage-card" + (done ? " complete" : "") + "\" type=\"button\" data-stage=\"" + index + "\"" + disabled + "><span class=\"stage-number\">" + copy("round", { number: index + 1, total: rounds.length }) + "</span><strong>" + copy("roundTitle" + (index + 1)) + "</strong><span>" + copy("stageHint" + (index + 1)) + "</span><b>" + (done ? copy("completed") : unlocked ? copy("readyStage") : "—") + "</b></button>";
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
  };
  const slotLabel = (index) => copy("slot", { number: index + 1 });
  const stoneLabel = (id) => id === "a" ? copy("stoneA") : copy("stoneB");
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const getSlotFromPointer = (event) => {
    const rect = $("magnetTrack").getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 0.999);
    return Math.floor(ratio * 6);
  };
  const commitMove = (id, destination) => {
    const round = currentRound();
    const from = state.positions[id];
    if (destination === from) return;
    const direction = Math.sign(destination - from);
    state.positions[id] = destination;
    const other = id === "a" ? "b" : "a";
    const response = round.relation === "pull" ? direction : -direction;
    state.positions[other] = clamp(state.positions[other] + response, 0, 5);
    state.moves += 1;
    state.selected = id;
    $("battleStatus").textContent = copy("moved", { stone: stoneLabel(id) });
    renderBattle();
  };
  const renderStones = () => {
    const layer = $("stoneLayer");
    layer.innerHTML = ["a", "b"].map((id) => {
      const selected = state.selected === id;
      const position = state.positions[id];
      const left = ((position + 0.5) / 6) * 100;
      return "<button class=\"moonstone stone-" + id + (selected ? " selected" : "") + "\" type=\"button\" data-stone=\"" + id + "\" style=\"left:" + left + "%\" aria-label=\"" + stoneLabel(id) + "\" aria-pressed=\"" + selected + "\"><span>" + (id === "a" ? "A" : "B") + "</span></button>";
    }).join("");
    layer.querySelectorAll("[data-stone]").forEach((stone) => {
      const id = stone.dataset.stone;
      stone.addEventListener("click", () => { state.selected = id; $("battleStatus").textContent = copy("selectStone", { stone: stoneLabel(id) }); renderBattle(); });
      stone.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        state.selected = id;
        state.drag = { id, destination: state.positions[id] };
        stone.setPointerCapture?.(event.pointerId);
        stone.classList.add("dragging");
      });
      stone.addEventListener("pointermove", (event) => {
        if (!state.drag || state.drag.id !== id) return;
        state.drag.destination = getSlotFromPointer(event);
        stone.style.left = (((state.drag.destination + 0.5) / 6) * 100) + "%";
      });
      stone.addEventListener("pointerup", (event) => {
        if (!state.drag || state.drag.id !== id) return;
        const destination = state.drag.destination;
        state.drag = null;
        stone.releasePointerCapture?.(event.pointerId);
        commitMove(id, destination);
      });
      stone.addEventListener("pointercancel", () => { state.drag = null; renderStones(); });
    });
  };
  const renderBattle = () => {
    const round = currentRound();
    $("battleHeading").textContent = copy("round", { number: state.round + 1, total: rounds.length });
    $("roundHint").textContent = copy("stageHint" + (state.round + 1));
    $("relationBadge").textContent = copy(round.relation === "pull" ? "relationPull" : "relationPush");
    $("targetText").textContent = "A" + (round.target.a + 1) + " · B" + (round.target.b + 1);
    $("moveText").textContent = copy("move", { count: state.moves });
    $("slotGrid").innerHTML = Array.from({ length: 6 }, (_, index) => "<button class=\"slot\" type=\"button\" data-slot=\"" + index + "\" aria-label=\"" + slotLabel(index) + "\"><span>" + (index + 1) + "</span></button>").join("");
    $("slotGrid").querySelectorAll("[data-slot]").forEach((slot) => slot.addEventListener("click", () => commitMove(state.selected, Number(slot.dataset.slot))));
    renderStones();
    $("resultPanel").hidden = true;
    $("battlePanel").hidden = false;
  };
  const resetRound = () => { state.positions = { ...currentRound().initial }; state.moves = 0; state.selected = "a"; $("battleStatus").textContent = copy("ready"); renderBattle(); };
  const showResult = () => {
    const final = state.round === rounds.length - 1;
    const total = state.moves;
    const previousBest = bestTotal();
    if (final && (!previousBest || total < previousBest)) safeSet("weightplay-animal-magnet-meadow-best", String(total));
    if (!state.completed.includes(state.round)) state.completed.push(state.round);
    $("battlePanel").hidden = true;
    $("resultPanel").hidden = false;
    $("resultHeading").textContent = copy(final ? "finishTitle" : "resultTitle");
    $("resultText").textContent = copy(final ? "finishText" : "resultText");
    $("resultStats").textContent = copy("stats", { moves: total, best: copy("best", { count: final ? Math.min(total, previousBest || total) : bestTotal() || copy("noBest") }) });
    $("resultPrimaryBtn").textContent = copy(final ? "replay" : "next");
    $("resultPrimaryBtn").onclick = () => final ? startRound(0) : startRound(state.round + 1);
    $("mainProgress").textContent = copy("progress", { count: state.completed.length });
  };
  const checkRound = () => {
    if (samePosition(state.positions, currentRound().target)) {
      if (!state.completed.includes(state.round)) state.completed.push(state.round);
      $("battleStatus").textContent = copy("correct");
      showResult();
      return;
    }
    $("battleStatus").textContent = copy("incorrect");
  };
  const startRound = (index) => {
    state.round = clamp(index, 0, rounds.length - 1);
    state.positions = { ...rounds[state.round].initial };
    state.moves = 0;
    state.selected = "a";
    setScreen("battle");
  };
  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    $("languageSelect").value = state.locale;
    applyText();
  };
  const bind = () => {
    $("startBtn").addEventListener("click", () => setScreen("stage"));
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    $("mainSettingsBtn").addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); });
    $("closeSettingsBtn").addEventListener("click", () => { $("settingsPanel").hidden = true; $("mainSettingsBtn").setAttribute("aria-expanded", "false"); });
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("stageInfoBtn").addEventListener("click", () => { const open = $("settingsPanel").hidden; $("settingsPanel").hidden = !open; $("stageInfoBtn").setAttribute("aria-expanded", String(open)); });
    $("battleBackBtn").addEventListener("click", () => setScreen("stage"));
    $("checkBtn").addEventListener("click", checkRound);
    $("resetBtn").addEventListener("click", resetRound);
    $("resultMapBtn").addEventListener("click", () => setScreen("stage"));
    $("resultHomeBtn").addEventListener("click", () => setScreen("main"));
    $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-magnet-meadow-sound", state.sound ? "on" : "off"); applyText(); });
    $("battleSoundBtn").addEventListener("click", () => { state.sound = !state.sound; safeSet("weightplay-animal-magnet-meadow-sound", state.sound ? "on" : "off"); applyText(); });
    $("languageSelect").addEventListener("change", (event) => applyLocale(event.target.value));
  };
  const init = () => {
    const routeLocale = document.documentElement.lang;
    const savedLocale = localeList.includes(routeLocale) && localeMap[routeLocale]
      ? routeLocale
      : safeGet("weightplay-locale", "en");
    state.sound = safeGet("weightplay-animal-magnet-meadow-sound", "on") !== "off";
    bind();
    applyLocale(savedLocale);
    resetRound();
    setScreen("main");
  };
  init();
}());
