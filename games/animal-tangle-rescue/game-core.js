(function () {
  "use strict";

  const localeMap = window.TANGLE_RESCUE_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const tokenMeta = {
    foxA: { copy: "animalFox", color: "#5c9ccc", suffix: " A" },
    badgerA: { copy: "animalBadger", color: "#ca7b62", suffix: " A" },
    otterA: { copy: "animalOtter", color: "#6ca878", suffix: " A" },
    hareA: { copy: "animalHare", color: "#a56eae", suffix: " A" },
    foxB: { copy: "animalFox", color: "#3c79b8", suffix: " B" },
    badgerB: { copy: "animalBadger", color: "#a45a49", suffix: " B" },
  };
  // Authored v6 campaign: six arcs and five boards per arc. The later arcs
  // deliberately use repeated animal families with A/B endpoint identities so
  // the six-endpoint permutation remains readable in every existing locale.
  const boards = [
    { arc: 1, checkpoint: false, title: "Creek braid", hint: "Read four endpoints before making the first rescue swap.", target: ["foxA", "badgerA", "otterA", "hareA"], start: ["otterA", "hareA", "foxA", "badgerA"] },
    { arc: 1, checkpoint: false, title: "Fern turn", hint: "A second four-endpoint braid needs a different swap order.", target: ["badgerA", "foxA", "hareA", "otterA"], start: ["hareA", "otterA", "badgerA", "foxA"] },
    { arc: 1, checkpoint: false, title: "Moon crossing", hint: "Two exchanges untangle the crossing paths.", target: ["hareA", "otterA", "badgerA", "foxA"], start: ["badgerA", "hareA", "foxA", "otterA"] },
    { arc: 1, checkpoint: false, title: "Quiet shelter", hint: "The shelter order is not the same as the endpoint order.", target: ["foxA", "otterA", "badgerA", "hareA"], start: ["badgerA", "foxA", "hareA", "otterA"] },
    { arc: 1, checkpoint: true, title: "First rescue checkpoint", hint: "Complete the first four-endpoint rescue arc.", target: ["otterA", "foxA", "hareA", "badgerA"], start: ["hareA", "badgerA", "otterA", "foxA"] },

    { arc: 2, checkpoint: false, title: "Fifth trail", hint: "A fifth endpoint adds one more route to read.", target: ["foxA", "badgerA", "otterA", "hareA", "foxB"], start: ["foxB", "otterA", "foxA", "badgerA", "hareA"] },
    { arc: 2, checkpoint: false, title: "Locked fern", hint: "The second endpoint is already safe; leave it untouched.", lockedRows: [1], target: ["badgerA", "foxB", "hareA", "otterA", "foxA"], start: ["hareA", "foxB", "badgerA", "foxA", "otterA"] },
    { arc: 2, checkpoint: false, title: "Long crossing", hint: "Follow the longer route before checking the five shelters.", target: ["foxB", "otterA", "badgerA", "foxA", "hareA"], start: ["badgerA", "foxA", "hareA", "otterA", "foxB"] },
    { arc: 2, checkpoint: false, title: "Safe first row", hint: "The first row is solved; untangle the remaining four.", lockedRows: [0], target: ["hareA", "foxA", "foxB", "badgerA", "otterA"], start: ["hareA", "otterA", "foxA", "foxB", "badgerA"] },
    { arc: 2, checkpoint: true, title: "Fifth-trail checkpoint", hint: "Finish the fifth-endpoint rescue without disturbing safe rows.", target: ["otterA", "hareA", "badgerA", "foxB", "foxA"], start: ["foxA", "badgerA", "otterA", "hareA", "foxB"] },

    { arc: 3, checkpoint: false, title: "Hidden shelter", hint: "One shelter is a decoy; infer its animal from the routes.", decoyRows: [2], target: ["foxB", "badgerA", "otterA", "hareA", "foxA"], start: ["otterA", "foxA", "foxB", "badgerA", "hareA"] },
    { arc: 3, checkpoint: false, title: "Bramble pair", hint: "Five animals cross twice before reaching their shelters.", target: ["badgerA", "otterA", "foxA", "foxB", "hareA"], start: ["foxB", "hareA", "badgerA", "otterA", "foxA"] },
    { arc: 3, checkpoint: false, title: "Locked moon", hint: "The first row is complete; solve around the locked shelter.", lockedRows: [0], decoyRows: [3], target: ["hareA", "foxB", "badgerA", "otterA", "foxA"], start: ["hareA", "otterA", "foxA", "badgerA", "foxB"] },
    { arc: 3, checkpoint: false, title: "Two decoys", hint: "Two shelters hide their labels; the endpoints reveal the route.", decoyRows: [1, 4], target: ["foxA", "hareA", "foxB", "badgerA", "otterA"], start: ["badgerA", "foxA", "otterA", "foxB", "hareA"] },
    { arc: 3, checkpoint: true, title: "Decoy checkpoint", hint: "Complete the hidden-shelter arc with every path connected.", decoyRows: [0, 3], target: ["otterA", "foxB", "foxA", "hareA", "badgerA"], start: ["foxA", "badgerA", "otterA", "foxB", "hareA"] },

    { arc: 4, checkpoint: false, title: "Sixth endpoint", hint: "Six endpoints make the route graph wider.", target: ["foxA", "badgerA", "otterA", "hareA", "foxB", "badgerB"], start: ["badgerB", "foxB", "foxA", "otterA", "hareA", "badgerA"] },
    { arc: 4, checkpoint: false, title: "Fixed fern", hint: "The second shelter is already correct; keep it fixed.", lockedRows: [1], decoyRows: [4], target: ["badgerB", "foxA", "hareA", "otterA", "badgerA", "foxB"], start: ["hareA", "foxA", "badgerB", "foxB", "otterA", "badgerA"] },
    { arc: 4, checkpoint: false, title: "Six-way crossing", hint: "Untangle six routes without relying on a single cycle.", target: ["otterA", "badgerB", "foxB", "foxA", "badgerA", "hareA"], start: ["foxB", "hareA", "badgerA", "otterA", "foxA", "badgerB"] },
    { arc: 4, checkpoint: false, title: "Moon lock", hint: "The first shelter is safe while two routes cross behind it.", lockedRows: [0], decoyRows: [1, 3], target: ["hareA", "foxB", "badgerA", "badgerB", "otterA", "foxA"], start: ["hareA", "otterA", "badgerB", "foxA", "foxB", "badgerA"] },
    { arc: 4, checkpoint: true, title: "Six-endpoint checkpoint", hint: "Finish the first full six-endpoint rescue arc.", target: ["foxB", "otterA", "badgerB", "hareA", "foxA", "badgerA"], start: ["badgerA", "foxA", "foxB", "otterA", "hareA", "badgerB"] },

    { arc: 5, checkpoint: false, title: "Shelter shuffle", hint: "Two decoy shelters make the swap order less obvious.", decoyRows: [0, 5], target: ["badgerA", "foxA", "badgerB", "otterA", "foxB", "hareA"], start: ["foxB", "hareA", "badgerA", "foxA", "badgerB", "otterA"] },
    { arc: 5, checkpoint: false, title: "Long fern braid", hint: "Six routes must be resolved while every row remains selectable.", target: ["otterA", "foxB", "hareA", "badgerA", "foxA", "badgerB"], start: ["foxA", "badgerA", "otterA", "badgerB", "foxB", "hareA"] },
    { arc: 5, checkpoint: false, title: "Locked moon pair", hint: "The first row is safe; a decoy hides one target in the middle.", lockedRows: [0], decoyRows: [2, 4], target: ["foxA", "badgerB", "otterA", "foxB", "badgerA", "hareA"], start: ["foxA", "hareA", "badgerA", "otterA", "badgerB", "foxB"] },
    { arc: 5, checkpoint: false, title: "Far shelters", hint: "Keep the endpoints readable while the far shelters swap places.", decoyRows: [1, 5], target: ["hareA", "otterA", "foxA", "badgerB", "foxB", "badgerA"], start: ["badgerB", "foxB", "hareA", "badgerA", "foxA", "otterA"] },
    { arc: 5, checkpoint: true, title: "Shuffle checkpoint", hint: "A clean six-way permutation completes the fifth arc.", target: ["badgerB", "otterA", "foxB", "foxA", "hareA", "badgerA"], start: ["foxA", "badgerA", "otterA", "hareA", "badgerB", "foxB"] },

    { arc: 6, checkpoint: false, title: "Final creek", hint: "The last arc combines six endpoints and a hidden shelter.", decoyRows: [2], target: ["foxA", "foxB", "badgerA", "otterA", "badgerB", "hareA"], start: ["hareA", "badgerB", "foxA", "foxB", "badgerA", "otterA"] },
    { arc: 6, checkpoint: false, title: "Final locked fern", hint: "Leave the first shelter safe while solving the five remaining rows.", lockedRows: [0], decoyRows: [3, 4], target: ["badgerA", "hareA", "foxB", "badgerB", "otterA", "foxA"], start: ["badgerA", "foxA", "otterA", "hareA", "foxB", "badgerB"] },
    { arc: 6, checkpoint: false, title: "Bramble finale", hint: "Every route crosses; use the endpoint colors as your guide.", decoyRows: [0, 5], target: ["otterA", "badgerB", "foxA", "hareA", "foxB", "badgerA"], start: ["foxB", "otterA", "badgerA", "foxA", "badgerB", "hareA"] },
    { arc: 6, checkpoint: false, title: "Last moon turn", hint: "A final locked row narrows the valid rescue sequence.", lockedRows: [1], target: ["hareA", "foxA", "badgerB", "foxB", "badgerA", "otterA"], start: ["badgerA", "foxA", "hareA", "otterA", "foxB", "badgerB"] },
    { arc: 6, checkpoint: true, title: "Taro's rescue finale", hint: "Connect every endpoint and open all six shelters.", decoyRows: [1, 4], target: ["foxB", "badgerB", "otterA", "foxA", "hareA", "badgerA"], start: ["badgerA", "foxA", "foxB", "badgerB", "otterA", "hareA"] },
  ];
  const state = { locale: "en", screen: "main", board: 0, current: [], selected: -1, swaps: 0, completed: [], sound: !window.WeightPlayAudio.isMuted(), best: {}, statusKey: "ready", statusVars: {}, statusError: false };
  window.addEventListener("weightplay:audio-volume-change", () => { state.sound = !window.WeightPlayAudio.isMuted(); });
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const normalizeLocale = (value) => localeList.includes(value) && localeMap[value] ? value : "";
  const initialLocale = () => normalizeLocale(window.WonderI18n?.actualLocale?.() || window.WonderI18n?.localeFromPath?.() || document.documentElement.lang || safeGet("weightPlayLocale", safeGet("weightplay-locale", "en"))) || "en";
  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };
  const bestKey = () => "weightplay-animal-tangle-rescue-best-" + state.board;
  const bestForBoard = () => Number(safeGet(bestKey(), "0")) || 0;
  const titleForAnimal = (animalKey) => {
    const meta = tokenMeta[animalKey] || { copy: animalKey, suffix: "" };
    return copy(meta.copy) + (meta.suffix || "");
  };
  const indexForAnimal = (animalKey) => Object.keys(tokenMeta).indexOf(animalKey);
  const lockedRows = (board = boards[state.board]) => board.lockedRows || [];
  const decoyRows = (board = boards[state.board]) => board.decoyRows || [];
  const analytics = (eventName, details = {}) => {
    try { window.gtag?.("event", eventName, { game_id: "animal-tangle-rescue", game_version: "v6", ...details }); } catch (_error) {}
    window.__tangleRescueEvents = window.__tangleRescueEvents || [];
    window.__tangleRescueEvents.push({ eventName, ...details });
  };
  const playTone = (cue = "ui.click") => { return window.WeightPlayAudio?.play(cue); };
  const showToast = (message) => { $("toast").textContent = message; $("toast").classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => $("toast").classList.remove("visible"), 1800); };
  const setScreen = (screen) => {
    state.screen = screen;
    document.body.dataset.screen = screen;
    ["main", "stage", "battle", "result"].forEach((name) => {
      const element = $(name + "Screen");
      if (!element) return;
      element.hidden = name !== screen;
      element.classList.toggle("active", name === screen);
    });
    $("guideScreen").hidden = screen !== "main";
    if (screen === "main") applyText();
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    window.scrollTo(0, 0);
  };
  const routeColor = (animalKey) => tokenMeta[animalKey]?.color || "#5c9ccc";
  const routePath = (fromRow, toRow, width, height) => {
    const left = 112;
    const right = width - 112;
    const startY = ((fromRow + 0.5) / boards[state.board].target.length) * height;
    const endY = ((toRow + 0.5) / boards[state.board].target.length) * height;
    const bend = Math.max(36, (right - left) * 0.28);
    return `M ${left} ${startY} C ${left + bend} ${startY}, ${right - bend} ${endY}, ${right} ${endY}`;
  };
  const renderBoard = () => {
    const board = boards[state.board];
    const diagram = $("boardDiagram");
    const height = Math.max(292, state.current.length * 62 + 16);
    const width = Math.max(diagram.clientWidth || 640, 320);
    diagram.style.minHeight = height + "px";
    const paths = state.current.map((animalKey, row) => {
      const targetRow = board.target.indexOf(animalKey);
      return `<path d="${routePath(row, targetRow, width, height)}" stroke="${routeColor(animalKey)}"></path>`;
    }).join("");
    const rows = state.current.map((animalKey, row) => {
      const animalIndex = Math.max(0, indexForAnimal(animalKey));
      const selected = state.selected === row;
      const targetKey = board.target[row];
      const locked = lockedRows(board).includes(row);
      const decoy = decoyRows(board).includes(row);
      const shelter = decoy
        ? `<span><strong>?</strong><small>${copy("shelter", { number: row + 1 })}</small></span>`
        : `<span><strong>${titleForAnimal(targetKey)}</strong><small>${copy("shelter", { number: row + 1 })}</small></span>`;
      return `<div class="board-row${locked ? " locked-row" : ""}"><button class="endpoint-card${selected ? " selected" : ""}${locked ? " locked" : ""}" type="button" data-endpoint="${row}" aria-pressed="${selected}" aria-label="${copy("swapName", { number: row + 1 })}: ${titleForAnimal(animalKey)}${locked ? " — locked" : ""}${selected ? " — " + copy("selected") : ""}"${locked ? " disabled aria-disabled=\"true\"" : ""}><span class="paw-chip paw-${animalIndex}">●</span><span><strong>${titleForAnimal(animalKey)}</strong><small>${locked ? "LOCKED" : copy("current")}</small></span></button><span class="board-dot" aria-hidden="true"></span><div class="shelter-card${decoy ? " decoy" : ""}">${shelter}<span class="shelter-icon" aria-hidden="true">${decoy ? "?" : "⌂"}</span></div></div>`;
    }).join("");
    diagram.innerHTML = `<svg class="route-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>${rows}`;
    diagram.querySelectorAll("[data-endpoint]").forEach((button) => button.addEventListener("click", () => selectEndpoint(Number(button.dataset.endpoint))));
  };
  const renderStages = () => {
    $("stageList").innerHTML = boards.map((board, index) => {
      const done = state.completed.includes(index);
      const unlocked = index === 0 || state.completed.includes(index - 1);
      const titleKey = "boardTitle" + (index + 1);
      const hintKey = "boardHint" + (index + 1);
      const localizedTitle = copy(titleKey);
      const localizedHint = copy(hintKey);
      const title = localizedTitle === titleKey ? board.title : localizedTitle;
      const hint = localizedHint === hintKey ? board.hint : localizedHint;
      return `<button class="stage-card${done ? " complete" : ""}${board.checkpoint ? " checkpoint" : ""}" type="button" data-stage="${index}"${unlocked ? "" : " disabled"}><span class="stage-number">${copy("round", { number: index + 1, total: boards.length })}</span><span><strong>${copy("arcLabel", { number: board.arc })} · ${title}</strong><small>${hint}</small></span><b>${done ? copy("completed") : unlocked ? copy("readyStage") : "—"}</b></button>`;
    }).join("");
    $("stageList").querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => startBoard(Number(button.dataset.stage))));
  };
  const renderBattle = () => {
    const board = boards[state.board];
    $("battleHeading").textContent = copy("round", { number: state.board + 1, total: boards.length });
    const titleKey = "boardTitle" + (state.board + 1);
    const hintKey = "boardHint" + (state.board + 1);
    const localizedTitle = copy(titleKey);
    const localizedHint = copy(hintKey);
    $("roundHint").textContent = `${localizedTitle === titleKey ? board.title : localizedTitle} · ${localizedHint === hintKey ? board.hint : localizedHint}`;
    $("progressBadge").textContent = copy("progressBadge", { count: state.completed.length, total: boards.length });
    $("battleStatus").textContent = copy(state.statusKey, state.statusVars);
    $("battleStatus").classList.toggle("error", state.statusError);
    renderBoard();
  };
  const renderResult = (moves) => {
    const final = state.completed.length === boards.length;
    const oldBest = bestForBoard();
    const best = !oldBest || moves < oldBest ? moves : oldBest;
    if (!oldBest || moves < oldBest) safeSet(bestKey(), String(moves));
    $("resultHeading").textContent = copy(final ? "finalTitle" : "resultTitle");
    // The legacy finalText says “three”; v6 has thirty boards, so use neutral
    // result copy for the final board as well.
    $("resultText").textContent = copy("resultText");
    $("resultStats").textContent = copy("stats", { moves: copy("placements", { count: moves }), best: copy("placements", { count: best }) });
    const canNext = state.board + 1 < boards.length && state.completed.includes(state.board);
    $("nextStageBtn").disabled = !canNext;
    $("nextStageBtn").onclick = () => { if (canNext) startBoard(state.board + 1); };
    $("retryBtn").onclick = () => startBoard(state.board);
    setScreen("result");
  };
  const selectEndpoint = (row) => {
    if (lockedRows().includes(row)) return;
    if (state.selected < 0) {
      state.selected = row;
      state.statusKey = "selectSecond";
      state.statusVars = {};
      state.statusError = false;
      analytics("tangle_endpoint_selected", { row });
      renderBattle();
      return;
    }
    if (state.selected === row) {
      state.selected = -1;
      state.statusKey = "ready";
      state.statusVars = {};
      state.statusError = false;
      renderBattle();
      return;
    }
    const first = state.selected;
    const firstName = titleForAnimal(state.current[first]);
    const secondName = titleForAnimal(state.current[row]);
    [state.current[first], state.current[row]] = [state.current[row], state.current[first]];
    state.selected = -1;
    state.swaps += 1;
    state.statusKey = "swapped";
    state.statusVars = { first: firstName, second: secondName };
    state.statusError = false;
    analytics("tangle_endpoint_swapped", { first, second: row, swaps: state.swaps });
    playTone("board.move");
    $("battleStatus").textContent = copy(state.statusKey, state.statusVars);
    renderBoard();
    $("battleStatus").classList.remove("error");
  };
  const checkBoard = () => {
    const board = boards[state.board];
    if (state.current.every((value, index) => value === board.target[index])) {
      if (!state.completed.includes(state.board)) state.completed.push(state.board);
      safeSet("weightplay-animal-tangle-rescue-completed", JSON.stringify(state.completed));
      analytics("tangle_board_completed", { board: state.board, swaps: state.swaps });
      playTone("puzzle.clear");
      renderResult(state.swaps);
      return;
    }
    analytics("tangle_board_checked", { board: state.board, correct: false, swaps: state.swaps });
    state.statusKey = "incorrect";
    state.statusVars = {};
    state.statusError = true;
    $("battleStatus").textContent = copy(state.statusKey);
    $("battleStatus").classList.add("error");
    showToast(copy("incorrect"));
  };
  const resetBoard = () => { state.current = boards[state.board].start.slice(); state.selected = -1; state.swaps = 0; state.statusKey = "ready"; state.statusVars = {}; state.statusError = false; analytics("tangle_board_reset", { board: state.board }); renderBattle(); };
  const startBoard = (index) => { state.board = Math.max(0, Math.min(boards.length - 1, index)); state.current = boards[state.board].start.slice(); state.selected = -1; state.swaps = 0; state.statusKey = "ready"; state.statusVars = {}; state.statusError = false; analytics("tangle_board_started", { board: state.board }); setScreen("battle"); };
  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)));
    $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").setAttribute("aria-label", copy("soundOn"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("mainProgress").textContent = copy("progress", { count: state.completed.length, total: boards.length });
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle") renderBattle();
  };
  const ensureGuideContract = () => {
    const guide = $("guideScreen");
    if (!guide) return;
    // The Interface 7 fallback theme is loaded after this game and its
    // The shared skin supplies --wp-ui-radius after game CSS. Keep the
    // approved authored Guide radius explicit through that same token so the
    // visible surface and the shared contract cannot drift apart.
    guide.style.setProperty("--wp-ui-radius", "24px", "important");
    guide.style.setProperty("border-radius", "var(--wp-ui-radius)", "important");
    guide.style.setProperty("border-width", "1px", "important");
    guide.style.setProperty("background", "rgb(255 253 247 / 96%)", "important");
    guide.style.setProperty("box-shadow", "0 10px 24px rgb(38 82 71 / 6%)", "important");
  };
  const applyLocale = (locale) => { state.locale = normalizeLocale(locale) || "en"; safeSet("weightplay-locale", state.locale); safeSet("weightPlayLocale", state.locale); document.documentElement.lang = state.locale; document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr"; $("languageSelect").value = state.locale; applyText(); };
  const openLeaveDialog = () => { $("leaveDialog").hidden = false; $("cancelLeaveBtn").focus(); };
  const closeLeaveDialog = () => { $("leaveDialog").hidden = true; $("leaveBtn").focus(); };
  const settingButtons = () => [...document.querySelectorAll("[data-wp-settings]")];
  const setSettingsOpen = (open) => {
    $("settingsPanel").hidden = !open;
    settingButtons().forEach((button) => button.setAttribute("aria-expanded", String(open)));
  };
  const bindSettingsButtons = () => settingButtons().forEach((button) => {
    if (button.dataset.tangleSettingsBound) return;
    button.dataset.tangleSettingsBound = "true";
    button.addEventListener("click", () => setSettingsOpen($("settingsPanel").hidden));
  });
  const bind = () => {
    $("startBtn").addEventListener("click", () => setScreen("stage"));
    $("guideStartBtn").addEventListener("click", () => setScreen("stage"));
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    bindSettingsButtons();
    $("closeSettingsBtn").addEventListener("click", () => setSettingsOpen(false));
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("stageInfoBtn").addEventListener("click", () => { setScreen("main"); $("guideScreen").open = true; $("guideScreen").scrollIntoView({ block: "start" }); });
    $("battleBackBtn").addEventListener("click", () => setScreen("stage"));
    $("checkBtn").addEventListener("click", checkBoard);
    $("resetBtn").addEventListener("click", resetBoard);
    $("leaveBtn").addEventListener("click", openLeaveDialog);
    $("cancelLeaveBtn").addEventListener("click", closeLeaveDialog);
    $("confirmLeaveBtn").addEventListener("click", () => { closeLeaveDialog(); setScreen("stage"); });
    $("resultStagesBtn").addEventListener("click", () => {
      setScreen("stage");
      const highestUnlocked = Math.max(0, ...state.completed.filter((index) => index >= 0 && index < boards.length));
      $("stageList").querySelector(`[data-stage="${highestUnlocked}"]`)?.focus();
    });
    [$('soundBtn'), $('battleSoundBtn')].forEach((button) => button.addEventListener("click", () => { state.sound = window.WeightPlayAudio.setEnabled(!state.sound); safeSet("weightplay-animal-tangle-rescue-sound", state.sound ? "on" : "off"); applyText(); }));
    $("languageSelect").addEventListener("change", (event) => { const requested = normalizeLocale(event.target.value) || "en"; try { window.WonderI18n?.setLocale?.(requested); } catch (_error) {} applyLocale(requested); });
  };
  const init = () => {
    try { const saved = JSON.parse(safeGet("weightplay-animal-tangle-rescue-completed", "[]")); state.completed = Array.isArray(saved) ? saved.filter((index) => Number.isInteger(index) && index >= 0 && index < boards.length) : []; } catch (_error) { state.completed = []; }
    state.sound = window.WeightPlayAudio.setEnabled(safeGet("weightplay-animal-tangle-rescue-sound", "on") !== "off");
    bind();
    ensureGuideContract();
    window.addEventListener("wonder:locale-change", (event) => applyLocale(event.detail?.locale || window.WonderI18n?.actualLocale?.() || document.documentElement.lang));
    applyLocale(initialLocale());
    window.setTimeout(() => { $("loadingScreen").hidden = true; $("app").hidden = false; setScreen("main"); }, 90);
  };
  init();
}());
