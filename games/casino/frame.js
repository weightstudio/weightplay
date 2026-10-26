/* Bind Casino's live scenes and HUD to the shared Interface 9 frame. */
(() => {
  "use strict";

  const core = window.WeightPlayScreenFrame;
  const root = document.getElementById("casinoFrame");
  const main = document.getElementById("mainScreen");
  const battle = document.getElementById("battleScreen");
  const mainHeader = main?.querySelector(":scope > .main-header");
  const mainContent = main?.querySelector(":scope > .main-hero");
  const battleCanvas = battle?.querySelector(":scope > .battle-canvas");
  const cardTable = battleCanvas?.querySelector(":scope > .card-table-ui");
  const battleReserve = battleCanvas?.querySelector(":scope > .battle-ad-reserve");
  const legacyBattleHeader = cardTable?.querySelector(":scope > .card-game-topbar");
  const localeSelect = document.getElementById("localeSelect");

  if (!core || !root || !mainHeader || !mainContent || !battleCanvas || !cardTable || !legacyBattleHeader || !localeSelect) {
    throw new Error("CASINO_SHARED_FRAME_INPUTS_REQUIRED");
  }

  const mainTitle = mainHeader.querySelector("[data-card-title]");
  const posterFrame = mainContent.querySelector(".poster-frame");
  const poster = posterFrame?.querySelector(".cover");
  const copy = mainContent.querySelector(".main-copy");
  const summary = copy?.querySelector("[data-card-summary]");
  const progress = copy?.querySelector("[data-wp-main-progress]");
  const start = document.getElementById("startBtn");
  const legacySettings = mainHeader.querySelector(":scope > .header-utilities");
  const battleBack = legacyBattleHeader.querySelector("#battleBackBtn");
  const legacyStats = legacyBattleHeader.querySelector(".card-game-stats");
  const battleStatus = legacyBattleHeader.querySelector("#cardGameStatus");

  if (!mainTitle || !poster || !copy || !summary || !progress || !start || !legacySettings || !battleBack || !legacyStats || !battleStatus) {
    throw new Error("CASINO_SHARED_FRAME_SLOTS_REQUIRED");
  }

  // The shared Settings component copies the original 13 locale options.
  // Keep the source select connected for the existing locale-change handler.
  const localeCarrier = document.createElement("div");
  localeCarrier.hidden = true;
  localeCarrier.inert = true;
  localeCarrier.dataset.wpLegacyLocaleCarrier = "";
  localeCarrier.append(localeSelect);
  root.append(localeCarrier);
  legacySettings.remove();

  mainTitle.dataset.wpFrameTitle = "";
  copy.querySelector("h1")?.setAttribute("hidden", "");
  posterFrame.replaceWith(poster);
  poster.dataset.wpFramePoster = "";
  copy.dataset.wpFrameCopy = "";
  summary.dataset.wpFrameSummary = "";
  progress.dataset.wpFrameProgress = "";
  progress.classList.remove("main-progress");
  start.dataset.wpFrameAction = "primary";
  for (const button of [document.getElementById("restartBtn"), document.getElementById("newGameBtn")]) {
    if (button) button.dataset.wpFrameAction = "secondary";
  }

  // Keep the permanent Back control, but let the shared header own its size,
  // position, Settings control, and the optional Casino HUD group.
  const battleHeader = document.createElement("header");
  const battleTitle = document.createElement("strong");
  battleTitle.dataset.wpFrameTitle = "";
  battleTitle.hidden = true;
  battleHeader.append(battleBack, battleTitle);
  const stats = [...legacyStats.children];
  legacyBattleHeader.remove();
  battleCanvas.prepend(battleHeader);
  battleCanvas.dataset.wpFrameLogicalHeader = "battle";
  if (battleReserve) battleCanvas.after(battleReserve);

  const frame = core.mount({
    root,
    localeSelect,
    playUI: true,
    scenes: {
      main: { root: main, header: mainHeader, content: mainContent },
      battle: { root: battleCanvas, header: battleHeader, content: cardTable },
    },
  });

  const battleInfo = core.createGroup();
  for (const node of stats) battleInfo.add(node);
  battleInfo.add(battleStatus);
  legacyStats.remove();
  frame.battleTopUI.add(battleInfo);

  const sync = () => {
    frame.activate(document.body.dataset.screen === "battle" ? "battle" : "main");
    window.WeightPlayBattleCanvas?.sync?.();
  };
  const abort = new AbortController();
  window.addEventListener("weightplay:shell-sync", sync, { signal: abort.signal });
  sync();

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    abort.abort();
    frame.destroy();
  }, { once: true });
})();
