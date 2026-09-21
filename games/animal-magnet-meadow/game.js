(function () {
  "use strict";
  const localeMap = window.MAGNET_MEADOW_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  // Authored v8 campaign: six arcs, five boards per arc, and real mechanic
  // changes.  These are intentionally explicit fixtures rather than a copied
  // permutation loop so the campaign can be audited without a browser.
  const rounds = [
    { arc: 1, checkpoint: false, title: "First pull", hint: "Pull one linked pair into place.", mechanic: "basic pull", relation: "pull", boardSize: 6, stones: ["a", "b"], initial: { a: 0, b: 4 }, target: { a: 1, b: 5 } },
    { arc: 1, checkpoint: false, title: "Quiet push", hint: "Push the partner away from the moving stone.", mechanic: "basic push", relation: "push", boardSize: 6, stones: ["a", "b"], initial: { a: 4, b: 2 }, target: { a: 5, b: 1 } },
    { arc: 1, checkpoint: false, title: "Two-step pull", hint: "Plan two pulls before checking the pair.", mechanic: "two-step pull", relation: "pull", boardSize: 6, stones: ["a", "b"], initial: { a: 0, b: 3 }, target: { a: 2, b: 5 } },
    { arc: 1, checkpoint: false, title: "Long meadow", hint: "A longer board gives the pair more room to settle.", mechanic: "long board", relation: "pull", boardSize: 7, stones: ["a", "b"], initial: { a: 1, b: 4 }, target: { a: 3, b: 6 } },
    { arc: 1, checkpoint: true, title: "First checkpoint", hint: "Use one push to land both stones cleanly.", mechanic: "checkpoint push", relation: "push", boardSize: 7, stones: ["a", "b"], initial: { a: 5, b: 2 }, target: { a: 6, b: 1 } },

    { arc: 2, checkpoint: false, title: "Polarity dawn", hint: "The first move pulls; the next move will push.", mechanic: "polarity flip", relation: "flip", boardSize: 7, stones: ["a", "b"], initial: { a: 0, b: 5 }, target: { a: 1, b: 6 } },
    { arc: 2, checkpoint: false, title: "Read the phase", hint: "The phase is pull on the first move.", mechanic: "polarity phase", relation: "flip", boardSize: 7, stones: ["a", "b"], initial: { a: 4, b: 2 }, target: { a: 5, b: 3 } },
    { arc: 2, checkpoint: false, title: "Return phase", hint: "Two moves make the link change direction.", mechanic: "phase reversal", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 0, b: 6 }, target: { a: 2, b: 6 } },
    { arc: 2, checkpoint: false, title: "Edge reversal", hint: "A pull toward the left edge can still be useful.", mechanic: "edge reversal", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 5, b: 1 }, target: { a: 4, b: 0 } },
    { arc: 2, checkpoint: true, title: "Phase checkpoint", hint: "Use the phase change to finish the long move.", mechanic: "checkpoint flip", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 1, b: 5 }, target: { a: 4, b: 5 } },

    { arc: 3, checkpoint: false, title: "Anchored partner", hint: "The anchored moonstone never moves.", mechanic: "fixed anchor", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["b"], initial: { a: 0, b: 5 }, target: { a: 2, b: 5 } },
    { arc: 3, checkpoint: false, title: "Anchored lead", hint: "Move the free stone around the fixed lead.", mechanic: "fixed anchor", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["a"], initial: { a: 1, b: 5 }, target: { a: 1, b: 3 } },
    { arc: 3, checkpoint: false, title: "Anchor turn", hint: "Pull the free stone back beside its anchor.", mechanic: "anchor turn", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["b"], initial: { a: 4, b: 2 }, target: { a: 1, b: 2 } },
    { arc: 3, checkpoint: false, title: "Wide anchor", hint: "Use the wider board without disturbing the anchor.", mechanic: "wide anchor", relation: "pull", boardSize: 8, stones: ["a", "b"], anchors: ["a"], initial: { a: 6, b: 1 }, target: { a: 6, b: 4 } },
    { arc: 3, checkpoint: true, title: "Anchor checkpoint", hint: "Keep the anchor safe through a careful pull.", mechanic: "checkpoint anchor", relation: "pull", boardSize: 8, stones: ["a", "b"], anchors: ["b"], initial: { a: 0, b: 4 }, target: { a: 3, b: 4 } },

    { arc: 4, checkpoint: false, title: "Quiet obstacle", hint: "The blocked dock cannot receive a moonstone.", mechanic: "blocked dock", relation: "pull", boardSize: 7, stones: ["a", "b"], blocked: [2], initial: { a: 0, b: 4 }, target: { a: 1, b: 5 } },
    { arc: 4, checkpoint: false, title: "Twin barriers", hint: "Read the open route before making a push.", mechanic: "twin barriers", relation: "push", boardSize: 8, stones: ["a", "b"], blocked: [3, 4], initial: { a: 6, b: 1 }, target: { a: 7, b: 0 } },
    { arc: 4, checkpoint: false, title: "Crossing gap", hint: "The middle gap is blocked; the next dock remains open.", mechanic: "crossing gap", relation: "pull", boardSize: 8, stones: ["a", "b"], blocked: [1, 4], initial: { a: 2, b: 6 }, target: { a: 3, b: 7 } },
    { arc: 4, checkpoint: false, title: "Edge shelter", hint: "Avoid the shelter dock while pulling toward the edge.", mechanic: "edge shelter", relation: "pull", boardSize: 7, stones: ["a", "b"], blocked: [5], initial: { a: 0, b: 3 }, target: { a: 1, b: 4 } },
    { arc: 4, checkpoint: true, title: "Obstacle checkpoint", hint: "A clean push completes the barrier arc.", mechanic: "checkpoint obstacle", relation: "push", boardSize: 8, stones: ["a", "b"], blocked: [2, 5], initial: { a: 6, b: 1 }, target: { a: 7, b: 0 } },

    { arc: 5, checkpoint: false, title: "Three-stone pull", hint: "The second and third stones follow at different distances.", mechanic: "chain pull", relation: "pull", boardSize: 6, stones: ["a", "b", "c"], initial: { a: 0, b: 2, c: 4 }, target: { a: 1, b: 3, c: 5 } },
    { arc: 5, checkpoint: false, title: "Three-stone push", hint: "A push sends the chain in the opposite direction.", mechanic: "chain push", relation: "push", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 5, b: 3, c: 1 }, target: { a: 6, b: 2, c: 0 } },
    { arc: 5, checkpoint: false, title: "Short chain", hint: "Keep the three stones separated while pulling.", mechanic: "short chain", relation: "pull", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 0, b: 1, c: 2 }, target: { a: 1, b: 2, c: 4 } },
    { arc: 5, checkpoint: false, title: "Long chain", hint: "A push moves the far stone two docks at once.", mechanic: "long chain", relation: "push", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 5, b: 4, c: 2 }, target: { a: 6, b: 3, c: 0 } },
    { arc: 5, checkpoint: true, title: "Chain checkpoint", hint: "One careful pull aligns the full three-stone chain.", mechanic: "checkpoint chain", relation: "pull", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 1, b: 3, c: 5 }, target: { a: 2, b: 4, c: 6 } },

    { arc: 6, checkpoint: false, title: "Blocked phase", hint: "The polarity changes while the blocked dock stays closed.", mechanic: "flip plus obstacle", relation: "flip", boardSize: 8, stones: ["a", "b"], blocked: [3], initial: { a: 0, b: 5 }, target: { a: 1, b: 6 } },
    { arc: 6, checkpoint: false, title: "Anchored chain", hint: "Only the free stones respond; the anchor stays fixed.", mechanic: "flip plus anchor", relation: "flip", boardSize: 8, stones: ["a", "b", "c"], anchors: ["c"], initial: { a: 0, b: 2, c: 6 }, target: { a: 1, b: 3, c: 6 } },
    { arc: 6, checkpoint: false, title: "Chain barrier", hint: "Move the chain without landing on either barrier.", mechanic: "push plus barriers", relation: "push", boardSize: 8, stones: ["a", "b", "c"], blocked: [1, 7], initial: { a: 5, b: 4, c: 2 }, target: { a: 6, b: 3, c: 0 } },
    { arc: 6, checkpoint: false, title: "Anchored phase", hint: "The free stone follows the current polarity around its anchor.", mechanic: "flip plus anchor", relation: "flip", boardSize: 8, stones: ["a", "b"], anchors: ["b"], initial: { a: 1, b: 5 }, target: { a: 2, b: 5 } },
    { arc: 6, checkpoint: true, title: "Meadow finale", hint: "One final pull settles the three-stone meadow pattern.", mechanic: "final chain", relation: "flip", boardSize: 9, stones: ["a", "b", "c"], blocked: [3, 6], initial: { a: 0, b: 1, c: 2 }, target: { a: 1, b: 2, c: 4 } },
  ];
  const firstRound = rounds[0];
  const state = { locale: "en", screen: "main", round: 0, positions: { ...firstRound.initial }, moves: 0, completed: [], selected: "a", statusKey: "ready", statusStone: null, sound: true, drag: null };
  const bestKey = "weightplay-animal-magnet-meadow-best-v9";
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const battleStatusText = () => state.statusKey === "moved" || state.statusKey === "selectStone"
    ? copy(state.statusKey, { stone: stoneLabel(state.statusStone) })
    : copy(state.statusKey);
  const setBattleStatus = (key, stoneId = null) => {
    state.statusKey = key;
    state.statusStone = stoneId;
    $("battleStatus").textContent = battleStatusText();
  };
  const samePosition = (first, second) => Object.keys(second).every((key) => first[key] === second[key]);
  const currentRound = () => rounds[state.round];
  const boardSize = (round = currentRound()) => round.boardSize || 6;
  const stoneIds = (round = currentRound()) => round.stones || Object.keys(round.initial);
  const anchors = (round = currentRound()) => round.anchors || [];
  const blocked = (round = currentRound()) => round.blocked || [];
  const bestTotal = () => Number(safeGet(bestKey, "0")) || 0;
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    $("battleSoundBtn").setAttribute("aria-label", copy("sound"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("mainProgress").textContent = copy("progress", { count: state.completed.length }).replaceAll("/3", "/" + rounds.length);
    if (state.screen === "battle") $("battleStatus").textContent = battleStatusText();
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
      const titleKey = "roundTitle" + (index + 1);
      const hintKey = "stageHint" + (index + 1);
      const localizedTitle = copy(titleKey);
      const localizedHint = copy(hintKey);
      const title = localizedTitle === titleKey ? round.title : localizedTitle;
      const hint = localizedHint === hintKey ? round.hint : localizedHint;
      return "<button class=\"stage-card" + (done ? " complete" : "") + (round.checkpoint ? " checkpoint" : "") + "\" type=\"button\" data-stage=\"" + index + "\"" + disabled + "><span class=\"stage-number\">" + copy("round", { number: index + 1, total: rounds.length }) + "</span><strong>" + copy("arc", { number: round.arc }) + " · " + title + "</strong><span>" + hint + "</span><b>" + (done ? copy("completed") : unlocked ? copy("readyStage") : "—") + "</b></button>";
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startRound(Number(button.dataset.stage))));
  };
  const slotLabel = (index) => copy("slot", { number: index + 1 });
  const stoneLabel = (id) => {
    const key = "stone" + String(id).toUpperCase();
    const localized = copy(key);
    return localized === key ? "Moonstone " + String(id).toUpperCase() : localized;
  };
  const mechanicLabel = (round) => {
    const key = "mechanic_" + round.mechanic.replace(/[^a-z0-9]+/gi, "_");
    const localized = copy(key);
    return localized === key ? round.mechanic : localized;
  };
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const getSlotFromPointer = (event) => {
    const rect = $("magnetTrack").getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 0.999);
    return Math.floor(ratio * boardSize());
  };
  const activeRelation = (round = currentRound()) => {
    if (round.relation !== "flip") return round.relation;
    return state.moves % 2 === 0 ? "pull" : "push";
  };
  const validPositionSet = (positions, round = currentRound()) => {
    const values = Object.values(positions);
    return values.every((value) => value >= 0 && value < boardSize(round) && !blocked(round).includes(value)) && new Set(values).size === values.length;
  };
  const commitMove = (id, destination) => {
    const round = currentRound();
    const from = state.positions[id];
    if (destination === from) return;
    if (anchors(round).includes(id) || blocked(round).includes(destination)) {
      setBattleStatus("incorrect");
      return;
    }
    const direction = Math.sign(destination - from);
    const response = activeRelation(round) === "pull" ? direction : -direction;
    const next = { ...state.positions, [id]: destination };
    let chainIndex = 0;
    stoneIds(round).forEach((other) => {
      if (other === id || anchors(round).includes(other)) return;
      chainIndex += 1;
      next[other] = clamp(next[other] + response * chainIndex, 0, boardSize(round) - 1);
    });
    if (!validPositionSet(next, round)) {
      setBattleStatus("incorrect");
      return;
    }
    state.positions = next;
    state.moves += 1;
    state.selected = id;
    setBattleStatus("moved", id);
    renderBattle();
  };
  const renderStones = () => {
    const layer = $("stoneLayer");
    const round = currentRound();
    layer.innerHTML = stoneIds(round).map((id) => {
      const selected = state.selected === id;
      const position = state.positions[id];
      const left = ((position + 0.5) / boardSize(round)) * 100;
      const fixed = anchors(round).includes(id);
      return "<button class=\"moonstone stone-" + id + (selected ? " selected" : "") + (fixed ? " anchored" : "") + "\" type=\"button\" data-stone=\"" + id + "\" style=\"left:" + left + "%\" aria-label=\"" + stoneLabel(id) + "\" aria-pressed=\"" + selected + "\"" + (fixed ? " disabled aria-disabled=\"true\"" : "") + "><span>" + String(id).toUpperCase() + "</span></button>";
    }).join("");
    layer.querySelectorAll("[data-stone]").forEach((stone) => {
      const id = stone.dataset.stone;
      stone.addEventListener("click", () => { state.selected = id; setBattleStatus("selectStone", id); renderBattle(); });
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
        stone.style.left = (((state.drag.destination + 0.5) / boardSize()) * 100) + "%";
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
    const hintKey = "stageHint" + (state.round + 1);
    const localizedHint = copy(hintKey);
    $("roundHint").textContent = (localizedHint === hintKey ? round.hint : localizedHint) + " · " + mechanicLabel(round);
    const relation = activeRelation(round);
    $("relationBadge").textContent = copy(relation === "pull" ? "relationPull" : "relationPush") + (round.relation === "flip" ? " · " + copy("flip") : "");
    $("targetText").textContent = stoneIds(round).map((id) => String(id).toUpperCase() + (round.target[id] + 1)).join(" · ");
    $("moveText").textContent = copy("move", { count: state.moves });
    $("battleStatus").textContent = battleStatusText();
    const slotGrid = $("slotGrid");
    slotGrid.style.gridTemplateColumns = "repeat(" + boardSize(round) + ", minmax(0, 1fr))";
    slotGrid.innerHTML = Array.from({ length: boardSize(round) }, (_, index) => {
      const isBlocked = blocked(round).includes(index);
      return "<button class=\"slot" + (isBlocked ? " blocked" : "") + "\" type=\"button\" data-slot=\"" + index + "\" aria-label=\"" + slotLabel(index) + "\"" + (isBlocked ? " disabled aria-disabled=\"true\"" : "") + "><span>" + (isBlocked ? "×" : index + 1) + "</span></button>";
    }).join("");
    $("slotGrid").querySelectorAll("[data-slot]").forEach((slot) => slot.addEventListener("click", () => commitMove(state.selected, Number(slot.dataset.slot))));
    $("legend").innerHTML = stoneIds(round).map((id) => "<span class=\"legend-stone stone-" + id + "\">" + stoneLabel(id) + (anchors(round).includes(id) ? " · " + copy("fixed") : "") + "</span>").join("");
    renderStones();
    $("resultPanel").hidden = true;
    $("battlePanel").hidden = false;
  };
  const resetRound = () => { const round = currentRound(); state.positions = { ...round.initial }; state.moves = 0; state.selected = stoneIds(round).find((id) => !anchors(round).includes(id)) || stoneIds(round)[0]; setBattleStatus("ready"); renderBattle(); };
  const showResult = () => {
    const final = state.round === rounds.length - 1;
    const total = state.moves;
    const previousBest = bestTotal();
    if (final && (!previousBest || total < previousBest)) safeSet("weightplay-animal-magnet-meadow-best", String(total));
    if (!state.completed.includes(state.round)) state.completed.push(state.round);
    $("battlePanel").hidden = true;
    $("resultPanel").hidden = false;
    $("resultHeading").textContent = copy(final ? "finishTitle" : "resultTitle");
    // Keep the result copy locale-safe: the legacy finishText says “three” and
    // predates the v8 thirty-board campaign, so the neutral result copy is used
    // for both intermediate and final boards.
    $("resultText").textContent = copy("resultText");
    $("resultStats").textContent = copy("stats", { moves: total, best: copy("best", { count: final ? Math.min(total, previousBest || total) : bestTotal() || copy("noBest") }) });
    $("resultPrimaryBtn").textContent = copy(final ? "replay" : "next");
    $("resultPrimaryBtn").onclick = () => final ? startRound(0) : startRound(state.round + 1);
    $("mainProgress").textContent = copy("progress", { count: state.completed.length }).replaceAll("/3", "/" + rounds.length);
  };
  const checkRound = () => {
    if (samePosition(state.positions, currentRound().target)) {
      if (!state.completed.includes(state.round)) state.completed.push(state.round);
      setBattleStatus("correct");
      showResult();
      return;
    }
    setBattleStatus("incorrect");
  };
  const startRound = (index) => {
    state.round = clamp(index, 0, rounds.length - 1);
    state.positions = { ...rounds[state.round].initial };
    state.moves = 0;
    state.selected = stoneIds(rounds[state.round]).find((id) => !anchors(rounds[state.round]).includes(id)) || stoneIds(rounds[state.round])[0];
    setBattleStatus("ready");
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
