(function () {
  "use strict";
  const habitatArtLink = document.createElement("link");
  habitatArtLink.rel = "stylesheet";
  habitatArtLink.href = "art.css?v=20260921-habitat-counts-block-scene-v1";
  document.head.appendChild(habitatArtLink);
  const locales = window.ANIMAL_HABITAT_COUNTS_LOCALES || {};
  const localeKeys = Object.keys(locales);
  const STANDARD_COPY = {
    en: { start:"Start Game", continue:"Continue playing", confirmLeave:"Return to Stages" },
    "zh-Hant": { start:"開始遊戲", continue:"繼續遊戲", confirmLeave:"返回關卡" },
    "zh-Hans": { start:"开始游戏", continue:"继续游戏", confirmLeave:"返回关卡" },
    ja: { start:"ゲーム開始", continue:"プレイを続ける", confirmLeave:"ステージへ戻る" },
    ko: { start:"게임 시작", continue:"계속 플레이", confirmLeave:"스테이지로 돌아가기" },
    es: { start:"Iniciar juego", continue:"Seguir jugando", confirmLeave:"Volver a niveles" },
    "pt-BR": { start:"Iniciar jogo", continue:"Continuar jogando", confirmLeave:"Voltar às fases" },
    fr: { start:"Démarrer le jeu", continue:"Continuer", confirmLeave:"Retour aux niveaux" },
    de: { start:"Spiel starten", continue:"Weiterspielen", confirmLeave:"Zurück zu den Stufen" },
    it: { start:"Inizia gioco", continue:"Continua a giocare", confirmLeave:"Torna ai livelli" },
    ru: { start:"Начать игру", continue:"Продолжить игру", confirmLeave:"Вернуться к этапам" },
    hi: { start:"गेम शुरू करें", continue:"खेल जारी रखें", confirmLeave:"स्टेज पर लौटें" },
    ar: { start:"ابدأ اللعبة", continue:"متابعة اللعب", confirmLeave:"العودة إلى المراحل" },
  };
  Object.entries(STANDARD_COPY).forEach(([locale, values]) => {
    if (locales[locale]) Object.assign(locales[locale], values);
  });
  const rounds = [
    { name: "meadow", rows: [2,1,2], columns: [2,2,1] },
    { name: "pond", rows: [2,2,2], columns: [1,2,3] },
    { name: "burrow", rows: [2,2,2], columns: [2,2,2] },
  ];
  const state = { locale: "en", screen: "main", roundIndex: 0, board: [], checks: 0, completed: [], sound: true, resultVisible: false };
  const $ = (id) => document.getElementById(id);
  let pendingAdvanceTimer = 0;
  let pendingAdvance = false;
  const storage = { get(key, fallback = "") { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } }, set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} } };
  const t = (key, vars = {}) => { const dictionary = locales[state.locale] || locales.en; let value = dictionary[key] || locales.en[key] || key; Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); }); return value; };
  const routeLocale = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const queryLocale = () => { const query = new URLSearchParams(location.search).get("lang"); if (query && locales[query]) return query; const segment = location.pathname.split("/").filter(Boolean)[0]?.toLowerCase(); return routeLocale[segment] || storage.get("weightplay-habitat-counts-locale", "en"); };
  const bestChecks = () => Number(storage.get("weightplay-animal-habitat-counts-best", "0")) || 0;
  const setScreen = (screen) => { state.screen = screen; document.body.dataset.screen = screen; ["main", "stage", "battle"].forEach((name) => { const node = $(name + "Screen"); node.hidden = name !== screen; node.classList.toggle("active", name === screen); }); $("guideSection").hidden = screen !== "main"; if (screen === "main") renderMain(); if (screen === "stage") renderStages(); if (screen === "battle") renderBattle(); window.dispatchEvent(new Event("weightplay:shell-sync")); window.scrollTo(0, 0); };
  const applyLocale = () => { const dictionary = locales[state.locale] || locales.en; document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale; document.documentElement.dir = dictionary.direction || "ltr"; document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); }); document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)); }); $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff"); $("soundBtn").setAttribute("aria-pressed", String(state.sound)); $("battleSoundBtn").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff")); $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound)); $("mainProgress").textContent = t("progress", { count: state.completed.length, total: rounds.length }); if (state.screen === "stage") renderStages(); if (state.screen === "battle") renderBattle(); };
  const renderMain = () => { $("mainProgress").textContent = state.completed.length ? t("progress", { count: state.completed.length, total: rounds.length }) : t("progressEmpty", { total: rounds.length }); };
  const renderStages = () => { $("stageList").replaceChildren(...rounds.map((round, index) => { const button = document.createElement("button"); const complete = state.completed.includes(index); const unlocked = index === 0 || state.completed.includes(index - 1); button.type = "button"; button.className = "stage-card" + (complete ? " complete" : ""); button.disabled = !unlocked; button.innerHTML = `<strong>${t("round", { current: index + 1, total: rounds.length })}</strong><span>${t("stage_" + round.name)}</span><b>${complete ? t("pageComplete") : unlocked ? t("pageReady") : t("pageLocked")}</b>`; button.addEventListener("click", () => startRound(index)); return button; })); window.dispatchEvent(new Event("weightplay:stage-sync")); };
  const clue = (label, count, type, index) => { const node = document.createElement("span"); node.className = "clue"; node.dataset.clueType = type; node.dataset.clueIndex = String(index); node.textContent = label.replace("{count}", count); return node; };
  const renderClues = (round) => { $("rowClues").replaceChildren(...round.rows.map((count, index) => clue(t("rowLabel", { number: index + 1, count }), count, "row", index))); $("columnClues").replaceChildren(...round.columns.map((count, index) => clue(t("columnLabel", { number: index + 1, count }), count, "column", index))); };
  const clearValidationMarks = () => { $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); $("habitatGrid").querySelectorAll(".cell").forEach((node) => node.classList.remove("is-mismatch")); document.querySelectorAll("#rowClues .clue, #columnClues .clue").forEach((node) => { node.classList.remove("is-mismatch"); node.removeAttribute("aria-invalid"); }); };
  const renderGrid = () => { const grid = $("habitatGrid"); grid.replaceChildren(...state.board.map((filled, index) => { const row = Math.floor(index / 3) + 1; const column = index % 3 + 1; const cell = document.createElement("button"); cell.type = "button"; cell.className = "cell"; cell.dataset.index = String(index); cell.tabIndex = index === 0 ? 0 : -1; cell.setAttribute("role", "gridcell"); cell.setAttribute("aria-pressed", String(Boolean(filled))); cell.setAttribute("aria-label", t(filled ? "cellOn" : "cellOff", { row, column })); cell.addEventListener("click", () => { state.board[index] = state.board[index] ? 0 : 1; clearValidationMarks(); grid.querySelectorAll(".cell").forEach((node, nodeIndex) => { const active = Boolean(state.board[nodeIndex]); node.tabIndex = nodeIndex === index ? 0 : -1; node.setAttribute("aria-pressed", String(active)); node.setAttribute("aria-label", t(active ? "cellOn" : "cellOff", { row: Math.floor(nodeIndex / 3) + 1, column: nodeIndex % 3 + 1 })); }); $("filledCount").textContent = t("filled", { count: state.board.reduce((sum, value) => sum + value, 0) }); }); return cell; })); $("filledCount").textContent = t("filled", { count: state.board.reduce((sum, value) => sum + value, 0) }); };
  const moveGridFocus = (event) => { const active = document.activeElement; if (!active?.matches("#habitatGrid .cell")) return; if (event.key === " " || event.key === "Enter") { event.preventDefault(); active.click(); return; } const deltas = { ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowDown: [1, 0], ArrowLeft: [0, -1] }; if (!deltas[event.key]) return; const index = Number(active.dataset.index); const row = Math.floor(index / 3); const column = index % 3; const nextRow = row + deltas[event.key][0]; const nextColumn = column + deltas[event.key][1]; if (nextRow < 0 || nextRow > 2 || nextColumn < 0 || nextColumn > 2) return; event.preventDefault(); const next = $("habitatGrid").querySelector(`[data-index="${nextRow * 3 + nextColumn}"]`); if (!next) return; $("habitatGrid").querySelectorAll(".cell").forEach((node) => { node.tabIndex = node === next ? 0 : -1; }); next.focus(); };
  const renderBattle = () => { const round = rounds[state.roundIndex]; $("battleHeading").textContent = t("title"); $("roundHint").textContent = t("stage_" + round.name); $("progressBadge").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length }); renderClues(round); renderGrid(); };
  const resetBoard = () => { state.board = Array(9).fill(0); $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); renderBattle(); };
  const cancelPendingAdvance = () => { if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer); pendingAdvanceTimer = 0; pendingAdvance = false; };
  const runPendingAdvance = () => { pendingAdvanceTimer = 0; pendingAdvance = false; if (state.roundIndex < rounds.length - 1) startRound(state.roundIndex + 1); else finishGame(); };
  const schedulePendingAdvance = () => { if (pendingAdvanceTimer) window.clearTimeout(pendingAdvanceTimer); pendingAdvance = true; pendingAdvanceTimer = window.setTimeout(runPendingAdvance, 260); };
  const startRound = (index) => { cancelPendingAdvance(); state.roundIndex = index; state.board = Array(9).fill(0); state.resultVisible = false; $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); $("battlePanel").hidden = false; $("battlePanel").inert = false; $("resultPanel").hidden = true; $("leaveDialog").hidden = true; setScreen("battle"); };
  const startGame = () => { cancelPendingAdvance(); state.roundIndex = 0; state.completed = []; state.checks = 0; setScreen("stage"); };
  const checkBoard = () => { const round = rounds[state.roundIndex]; state.checks += 1; const rows = [0,1,2].map((row) => state.board.slice(row * 3, row * 3 + 3).reduce((sum, cell) => sum + cell, 0)); const columns = [0,1,2].map((column) => [0,1,2].reduce((sum, row) => sum + state.board[row * 3 + column], 0)); const rowMismatch = rows.map((count, index) => count !== round.rows[index]); const columnMismatch = columns.map((count, index) => count !== round.columns[index]); const correct = !rowMismatch.some(Boolean) && !columnMismatch.some(Boolean); const status = $("battleStatus"); $("rowClues").querySelectorAll(".clue").forEach((node, index) => { node.classList.toggle("is-mismatch", rowMismatch[index]); node.toggleAttribute("aria-invalid", rowMismatch[index]); }); $("columnClues").querySelectorAll(".clue").forEach((node, index) => { node.classList.toggle("is-mismatch", columnMismatch[index]); node.toggleAttribute("aria-invalid", columnMismatch[index]); }); if (!correct) { status.textContent = t("wrong"); status.classList.add("is-wrong"); $("habitatGrid").querySelectorAll(".cell").forEach((node, index) => { node.classList.toggle("is-mismatch", rowMismatch[Math.floor(index / 3)] || columnMismatch[index % 3]); }); return; } status.textContent = t("correct"); status.classList.remove("is-wrong"); $("habitatGrid").querySelectorAll(".cell").forEach((node) => node.classList.remove("is-mismatch")); if (!state.completed.includes(state.roundIndex)) state.completed.push(state.roundIndex); schedulePendingAdvance(); };
  const finishGame = () => { cancelPendingAdvance(); const prior = bestChecks(); if (!prior || state.checks < prior) storage.set("weightplay-animal-habitat-counts-best", String(state.checks)); $("resultStats").textContent = t("resultStats", { rounds: state.completed.length, checks: state.checks }); $("resultNextBtn").disabled = state.roundIndex >= rounds.length - 1; $("battlePanel").hidden = true; $("battlePanel").inert = true; $("resultPanel").hidden = false; state.resultVisible = true; };
  const goHome = () => { cancelPendingAdvance(); $("leaveDialog").hidden = true; $("resultPanel").hidden = true; $("battlePanel").hidden = false; $("battlePanel").inert = false; state.resultVisible = false; setScreen("main"); };
  const returnToStages = () => { cancelPendingAdvance(); $("leaveDialog").hidden = true; $("resultPanel").hidden = true; $("battlePanel").hidden = false; $("battlePanel").inert = false; state.resultVisible = false; setScreen("stage"); };
  const toggleSound = () => { state.sound = !state.sound; applyLocale(); };
  const toggleSettings = () => { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("mainSettingsBtn").setAttribute("aria-expanded", String(open)); };
  const closeLeave = ({ resume = true, focus = true } = {}) => { const dialog = $("leaveDialog"); if (dialog.hidden) return; dialog.hidden = true; $("battlePanel").inert = false; if (resume && pendingAdvance && !pendingAdvanceTimer) schedulePendingAdvance(); if (focus) $("battleBackBtn").focus(); };
  const openLeave = () => { if (state.screen !== "battle") return; if (state.resultVisible) return returnToStages(); if (pendingAdvanceTimer) { window.clearTimeout(pendingAdvanceTimer); pendingAdvanceTimer = 0; } $("battlePanel").inert = true; $("leaveDialog").hidden = false; $("continueBtn").focus(); };
  const populateLocales = () => { const select = $("languageSelect"); localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); }); select.value = state.locale; select.addEventListener("change", () => { state.locale = select.value; storage.set("weightplay-habitat-counts-locale", state.locale); applyLocale(); }); };
  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    const stageTab = document.querySelector('[data-wp-stage-tab="stages"]');
    if (stageTab) stageTab.dataset.copy = "stages";
    populateLocales();
    applyLocale();
    renderMain();
    $("habitatGrid").addEventListener("keydown", moveGridFocus);
    $("startBtn").addEventListener("click", startGame);
    $("mapBtn").addEventListener("click", () => setScreen("stage"));
    $("stageBackBtn").addEventListener("click", () => setScreen("main"));
    $("battleBackBtn").addEventListener("click", openLeave);
    $("checkBtn").addEventListener("click", checkBoard);
    $("clearBtn").addEventListener("click", resetBoard);
    $("resultMapBtn").addEventListener("click", returnToStages);
    $("resultNextBtn").addEventListener("click", () => { if (!$("resultNextBtn").disabled && state.roundIndex < rounds.length - 1) startRound(state.roundIndex + 1); });
    $("resultReplayBtn").addEventListener("click", () => startRound(state.roundIndex));
    $("continueBtn").addEventListener("click", () => closeLeave());
    $("confirmLeaveBtn").addEventListener("click", returnToStages);
    $("leaveDialog").addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeave();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [$("continueBtn"), $("confirmLeaveBtn")];
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    });
    $("mainSettingsBtn").addEventListener("click", toggleSettings);
    $("closeSettingsBtn").addEventListener("click", toggleSettings);
    $("soundBtn").addEventListener("click", toggleSound);
    $("battleSoundBtn").addEventListener("click", toggleSound);
  });
  window.ANIMAL_HABITAT_COUNTS_TEST = { rounds, startGame, checkBoard, state };
})();
