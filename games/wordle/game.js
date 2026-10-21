(function () {
  "use strict";
  const START_COPY = {
    en:"Start Game", "zh-Hant":"開始遊戲", "zh-Hans":"开始游戏", ja:"ゲーム開始", ko:"게임 시작", es:"Iniciar juego", "pt-BR":"Iniciar jogo", fr:"Démarrer le jeu", de:"Spiel starten", it:"Avvia gioco", ru:"Начать игру", hi:"गेम शुरू करें", ar:"ابدأ اللعبة"
  };
  // Wordle has no Stage; its Main and Battle share the explicit I9 frame.
  document.body.dataset.wpBattleLayout = "native";
  const battle = document.querySelector("#battleScreen");
  const battleCanvas = battle?.matches("[data-wp-logical-battle-canvas]")
    ? battle : battle?.querySelector("[data-wp-logical-battle-canvas]");
  // Absolute onboarding/result substates use the same measured logical Canvas
  // as their containing block, including the shared capped desktop width.
  battle?.style.setProperty("position", "relative", "important");
  const battlePanel = battle?.querySelector(".battle-panel");
  const result = document.querySelector("#resultScreen");
  const leaveModal = document.querySelector("#leaveModal");
  const battleBack = document.querySelector("#battleBackBtn");
  const startButton = document.querySelector("#startBtn");
  function syncStart() {
    const locale = document.documentElement.lang || "en";
    if (startButton) startButton.textContent = START_COPY[locale] || START_COPY.en;
  }
  syncStart();
  if (!document.querySelector("link[data-wordle-v20-style]")) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "/games/wordle/wordle-v20.css?v=20261021-wordle-v21-i9-entry1";
    style.dataset.wordleV20Style = "";
    document.head.append(style);
  }
  if (!document.querySelector('link[href*="/games/wordle/art.css"]')) {
    const artStyle = document.createElement("link");
    artStyle.rel = "stylesheet";
    artStyle.href = "/games/wordle/art.css?v=20261021-wordle-v21-i9-board-art1";
    document.head.append(artStyle);
  }
  const battleActions = battle?.querySelector(".battle-top > .control-row");
  const message = battle?.querySelector("#gameMessage");
  if (battleActions && message) {
    battleActions.classList.add("wordle-battle-actions");
    message.insertAdjacentElement("afterend", battleActions);
  }
  if (result && battleCanvas && result.parentElement !== battleCanvas) {
    const resultPanel = result.querySelector(".arcade-panel");
    if (resultPanel) result.replaceChildren(resultPanel);
    result.classList.remove("screen");
    result.classList.add("wordle-result-substate");
    result.removeAttribute("data-screen");
    result.dataset.wpBattleSubstate = "result";
    battleCanvas.append(result);
  }
  result?.setAttribute("role", "dialog");
  result?.setAttribute("aria-modal", "true");
  result?.setAttribute("aria-labelledby", "resultTitle");
  result?.setAttribute("aria-describedby", "resultCopy");
  if (leaveModal && battleCanvas && leaveModal.parentElement !== battleCanvas) battleCanvas.append(leaveModal);
  const mainCopy = document.querySelector("#mainScreen .main-copy");
  const mainObjective = document.querySelector("#objective");
  const mainEyebrow = document.querySelector("#eyebrow");
  const mainTagline = document.querySelector("#gameTagline");
  const mainScreen = document.querySelector("#mainScreen");
  const mainPanel = mainCopy?.closest(".main-panel");
  const mainPosterFrame = mainPanel?.querySelector(".preview-art");
  const mainPoster = mainPosterFrame?.querySelector("img.cover");
  const mainProgress = mainPanel?.querySelector(".main-progress");
  mainScreen?.classList.add("wp-standard-main-screen");
  mainPanel?.classList.remove("arcade-panel", "main-panel");
  mainPanel?.classList.add("wp-standard-main-composition");
  mainPosterFrame?.classList.remove("preview-art");
  mainPosterFrame?.classList.add("wp-standard-main-poster");
  mainPoster?.classList.add("wp-standard-main-poster-media");
  mainCopy?.classList.remove("main-copy");
  mainCopy?.classList.add("wp-standard-main-copy");
  mainObjective?.classList.remove("objective");
  mainObjective?.classList.add("wp-standard-main-summary");
  mainProgress?.classList.add("wp-standard-main-progress");
  startButton?.classList.add("wp-standard-main-start");
  if (mainCopy && mainObjective) mainObjective.before(...[mainEyebrow, mainTagline].filter(Boolean));
  mainCopy?.setAttribute("data-wp-frame-copy", "");
  mainObjective?.setAttribute("data-wp-frame-summary", "");
  for (const selector of ["#hintBtn", "#restartBtn", "#retryBtn", "#homeBtn", "#leaveContinue", "#leaveMain"]) {
    const action = document.querySelector(selector);
    if (action) action.dataset.wpFrameAction = ["#hintBtn", "#restartBtn", "#homeBtn", "#leaveMain"].includes(selector) ? "secondary" : "primary";
  }
  result?.querySelector(".arcade-panel")?.setAttribute("data-wp-frame-result-card", "");
  document.querySelector("#battleUtilityBtn")?.remove();
  const battleInfo = document.createElement("div");
  battleInfo.className = "wordle-battle-info";
  const roundLabel = document.querySelector("#roundLabel");
  if (roundLabel) battleInfo.append(roundLabel);
  const battleTop = battle?.querySelector(".battle-top");
  if (!battleTop || !roundLabel) throw new Error("Wordle requires its Battle information slot.");
  battleTop.append(battleInfo);
  const sharedFrame = window.WeightPlayScreenFrame?.mountSlots({
    root: document.querySelector("#popularArcade"),
    main: document.querySelector("#mainScreen"),
    battle: {root: battle, headerInfo: battleInfo},
  });
  if (!sharedFrame) throw new Error("Wordle requires the shared I9 frame.");
  const sharedBattleHeader = () => battle?.querySelector("[data-wp-frame-header='battle'], .wp-battle-shell-header");
  const resultIsOpen = () => Boolean(result && !result.hidden);
  function coverBattle(covered) {
    if (battlePanel) battlePanel.inert = Boolean(covered || resultIsOpen());
    const header = sharedBattleHeader();
    if (header) header.inert = Boolean(covered || resultIsOpen());
  }
  function syncBattleSubstate() {
    if (!battle || !result || !battlePanel) return;
    syncStart();
    const requestedScreen = document.body.dataset.screen;
    const showingResult = requestedScreen === "result" || resultIsOpen();
    if (showingResult) {
      battle.hidden = false;
      result.hidden = false;
      battle.dataset.wpBattleSubstate = "result";
      document.body.dataset.screen = "battle";
      battlePanel.hidden = true;
      coverBattle(true);
      // The result focus and entrance tween run after the permanent canvas is
      // visible, in this same scene transaction, not an observer repair.
      window.WPWordleUI?.onScene("result");
      return;
    }
    delete battle.dataset.wpBattleSubstate;
    result.hidden = true;
    battlePanel.hidden = false;
    battlePanel.inert = false;
    const header = sharedBattleHeader();
    if (header) header.inert = false;
    window.WPWordleUI?.onScene(document.body.dataset.screen || "main");
  }
  window.addEventListener("weightplay:shell-sync", () => {
    sharedFrame.sync();
    syncBattleSubstate();
  });
  battleBack?.addEventListener("click", () => {
    if (document.body.dataset.screen === "battle" && !resultIsOpen()) coverBattle(true);
  }, true);
  window.WPPopularArcade?.mount("wordle");
  // The shell bootstraps its legacy copy during mount. Paint the current
  // localized Main summary immediately, before the first round is started.
  window.WPWordleUI?.paintMain?.();
  // v17 is already assigned to the shared-audio migration in the version record.
  document.body.dataset.gameVersion = "v21";
  document.body.dataset.wpGameVersion = "v21";
  document.body.dataset.wordleReview = "owner-20261018";
  // The shared frame already owns this header. The legacy shell initializer can
  // leave an empty .battle-top wrapper that reserves a dead first grid row.
  battle?.querySelectorAll(".battle-top").forEach(node => node.remove());
  sharedFrame.sync();
  syncBattleSubstate();
  const focusableLeaveActions = () => [...(leaveModal?.querySelectorAll("button:not([disabled])") || [])]
    .filter(node => !node.hidden && node.getAttribute("aria-hidden") !== "true");
  document.querySelector("#leaveContinue")?.addEventListener("click", () => {
    coverBattle(false);
    // The shared leave handler runs during capture while Battle is still inert.
    // Restore focus after this adapter releases that coverage.
    battleBack?.focus({preventScroll:true});
  });
  document.querySelector("#leaveMain")?.addEventListener("click", () => coverBattle(false));
  document.addEventListener("keydown", event => {
    if (!leaveModal || leaveModal.hidden) return;
    if (event.key === "Escape") { coverBattle(false); return; }
    if (event.key !== "Tab") return;
    const actions = focusableLeaveActions();
    if (!actions.length) return;
    const first = actions[0], last = actions[actions.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({preventScroll:true}); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({preventScroll:true}); }
  }, true);
}());
