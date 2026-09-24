(function () {
  "use strict";
  const START_COPY = {
    en:"Start Game", "zh-Hant":"開始遊戲", "zh-Hans":"开始游戏", ja:"ゲーム開始", ko:"게임 시작", es:"Iniciar juego", "pt-BR":"Iniciar jogo", fr:"Démarrer le jeu", de:"Spiel starten", it:"Avvia gioco", ru:"Начать игру", hi:"गेम शुरू करें", ar:"ابدأ اللعبة"
  };
  // Retain the existing Interface 7 one-frame adapter; no new public scene.
  document.body.dataset.wpBattleLayout = "native";
  const battle = document.querySelector("#battleScreen");
  const battleCanvas = battle?.querySelector("[data-wp-logical-battle-canvas]");
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
  if (!document.querySelector("link[data-wordle-v18-style]")) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "/games/wordle/wordle-v18.css?v=20260923-owner-v18";
    style.dataset.wordleV18Style = "";
    document.head.append(style);
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
  if (leaveModal && battleCanvas && leaveModal.parentElement !== battleCanvas) battleCanvas.append(leaveModal);
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
  window.addEventListener("weightplay:shell-sync", syncBattleSubstate);
  battleBack?.addEventListener("click", () => {
    if (document.body.dataset.screen === "battle" && !resultIsOpen()) coverBattle(true);
  }, true);
  window.WPPopularArcade?.mount("wordle");
  // v17 is already assigned to the shared-audio migration in the version record.
  document.body.dataset.gameVersion = "v18";
  document.body.dataset.wordleReview = "owner-20260923";
  syncBattleSubstate();
  const focusableLeaveActions = () => [...(leaveModal?.querySelectorAll("button:not([disabled])") || [])]
    .filter(node => !node.hidden && node.getAttribute("aria-hidden") !== "true");
  document.querySelector("#leaveContinue")?.addEventListener("click", () => coverBattle(false));
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
