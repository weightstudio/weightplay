(() => {
  "use strict";

  const root = document.querySelector("#app");
  const main = document.querySelector("#mainScreen");
  const stage = document.querySelector("#stageScreen");
  const battle = document.querySelector("#battleScreen");
  const mainHeader = root?.querySelector('[data-wp-shell-header="main"]');
  const stageHeader = root?.querySelector('[data-wp-shell-header="stage"]');
  const battleHeader = root?.querySelector('[data-wp-shell-header="battle"]');
  const frame = window.WeightPlayScreenFrame;

  if (!root || !main || !stage || !battle || !mainHeader || !stageHeader || !battleHeader || !frame?.mountSlots) {
    throw new Error("CLOUDHOOK_INTERFACE_7_SLOTS_REQUIRED");
  }

  // Keep game-owned copy nodes connected for locale refreshes while mountSlots
  // replaces the legacy title lanes with the permanent shared frame slots.
  const legacyCopy = document.createElement("div");
  legacyCopy.hidden = true;
  legacyCopy.dataset.wpCloudhookLegacyCopy = "";
  root.append(legacyCopy);
  ["#eyebrow", "#languageLabel", "#coming", "#tagline"].forEach((selector) => {
    const node = root.querySelector(selector);
    if (node) legacyCopy.append(node);
  });
  const battleTitleGroup = battleHeader.querySelector("#battleEyebrow")?.parentElement;
  if (battleTitleGroup) legacyCopy.append(battleTitleGroup);

  const localeTitle = () => {
    const raw = document.documentElement.lang || "en";
    const code = /^zh-(tw|hant)/i.test(raw) ? "zh-Hant"
      : /^zh/i.test(raw) ? "zh-Hans"
        : /^pt/i.test(raw) ? "pt-BR"
          : raw.split("-")[0];
    const titles = window.WEIGHTPLAY_GAME_TITLES?.[document.body.dataset.wpGameId];
    return titles?.[code] || titles?.en || "Cloudhook Courier";
  };
  const mainTitle = mainHeader.querySelector("#title");
  if (mainTitle) {
    mainTitle.textContent = localeTitle();
    mainTitle.classList.add("wp-shell-main-title");
    mainTitle.setAttribute("data-wp-game-title", "");
  }

  const mainGrid = main.querySelector(".main-grid");
  const poster = mainGrid?.querySelector(".poster");
  const mainCopy = mainGrid?.querySelector(".main-copy");
  const objective = mainGrid?.querySelector("#objective");
  const startButton = mainGrid?.querySelector("#startBtn");
  poster?.setAttribute("data-wp-frame-poster", "");
  mainCopy?.setAttribute("data-wp-frame-copy", "");
  objective?.setAttribute("data-wp-frame-summary", "");
  startButton?.setAttribute("data-wp-frame-action", "primary");
  if (mainCopy && startButton && !mainCopy.querySelector("[data-wp-main-progress]")) {
    const progress = document.createElement("div");
    progress.className = "main-progress";
    progress.dataset.wpMainProgress = "";
    startButton.before(progress);
  }
  const mainProgress = mainCopy?.querySelector("[data-wp-main-progress]");
  mainProgress?.setAttribute("data-wp-frame-progress", "");
  mainProgress?.classList.add("wp-standard-main-progress");

  const slots = frame.mountSlots({
    root,
    main,
    stage,
    battle: {
      root: battle,
      headerInfo: battleHeader.querySelector(".hud"),
    },
  });

  // The game keeps its authored Battle sound control. It remains the one
  // visible Battle utility; the shared settings panel owns Main and Stage.
  const frameBattleHeader = root.querySelector('[data-wp-frame-header="battle"]');
  const legacyBattleHeader = battle.querySelector(".battle-head");
  const battleSound = root.querySelector("#battleSoundBtn");
  if (frameBattleHeader && battleSound) {
    frameBattleHeader.append(battleSound);
    frameBattleHeader.querySelector(".wp-frame-utility")?.setAttribute("hidden", "");
    frameBattleHeader.classList.add("section-head", "battle-head", "battle-header", "wp-shell-header", "wp-battle-shell-header");
  }
  if (legacyBattleHeader?.isConnected && legacyBattleHeader !== frameBattleHeader) legacyBattleHeader.remove();
  root.querySelector('[data-wp-frame-header="stage"]')?.classList.add("section-head", "stage-header", "wp-shell-header", "wp-stage-shell-header");

  const syncFrame = () => {
    const screen = document.body.dataset.screen;
    if (!["main", "stage", "battle"].includes(screen)) return;
    if (mainTitle) {
      mainTitle.textContent = localeTitle();
      document.title = `${mainTitle.textContent} | WeightPlay`;
    }
    slots.activate(screen);
    document.body.classList.toggle("wp-shell-main-active", screen === "main");
    document.body.classList.toggle("wp-shell-stage-active", screen === "stage");
    document.body.classList.toggle("wp-shell-battle-active", screen === "battle");
  };

  window.addEventListener("weightplay:shell-sync", syncFrame);
  document.querySelector("#localeSelect")?.addEventListener("change", syncFrame);
  window.addEventListener("wonder:locale-change", syncFrame);
  syncFrame();
  window.dispatchEvent(new Event("weightplay:cloudhook-stage-data"));
  window.WPCloudhookInterface7 = Object.freeze({ slots, sync: syncFrame });
})();
