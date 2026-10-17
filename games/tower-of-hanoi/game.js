(() => {
  "use strict";

  const art = document.createElement("link");
  art.rel = "stylesheet";
  art.href = new URL("art.css?v=20261017-tower-of-hanoi-i9-frame-v1", document.currentScript.src).href;
  document.head.append(art);

  const app = window.WPClassicLogic.mount("tower-of-hanoi");
  if (!app || !window.WeightPlayScreenFrame) return;
  document.body.dataset.gameVersion = "v14";

  const root = app.root;
  const query = (selector) => root.querySelector(selector);
  const mainHeader = app.main.querySelector("header");
  const battleHeader = app.battle.querySelector("header");
  const mainContent = query(".logic-hero");
  const battleContent = query(".logic-battle-wrap");
  const start = query("#startButton");
  const back = query("#battleBack");
  const picker = query("#localePicker");
  const resultReplay = query("#resultReplay");
  const resultMenu = query("#resultMenu");
  const resultClose = query("#resultClose");

  // Keep the existing locale source for the shared Settings control, while
  // removing the Logic Lab's competing header and shell.
  const retained = document.createElement("div");
  retained.hidden = true;
  retained.inert = true;
  retained.style.setProperty("display", "none", "important");
  retained.append(picker);
  mainHeader.append(retained);
  mainHeader.querySelector(".logic-header-tools")?.remove();
  root.querySelector(".logic-lab")?.classList.remove("logic-lab");
  app.main.classList.remove("logic-main");
  app.stage.remove();
  app.main.querySelector(".logic-guide")?.remove();

  mainContent.className = "tower-main-content";
  mainContent.querySelectorAll(".logic-kicker, .logic-facts, .logic-progress-slot, h2").forEach((node) => node.remove());
  mainHeader.querySelector("h1").setAttribute("data-wp-frame-title", "");
  battleHeader.querySelector("h1").setAttribute("data-wp-frame-title", "");
  mainContent.querySelector(".logic-poster")?.setAttribute("data-wp-frame-poster", "");
  mainContent.querySelector(".logic-copy")?.setAttribute("data-wp-frame-copy", "");
  mainContent.querySelector(".logic-copy > p:not(.logic-kicker)")?.setAttribute("data-wp-frame-summary", "");
  start.setAttribute("data-wp-frame-action", "primary");
  battleContent.querySelector(".logic-action-row").setAttribute("data-wp-frame-logical-actions", "battle");
  battleContent.querySelectorAll(".logic-action-row button").forEach((button) => button.setAttribute("data-wp-frame-action", "secondary"));

  app.result.setAttribute("data-wp-result-screen", "");
  app.result.querySelector(".logic-result-card")?.setAttribute("data-wp-result-card", "");
  resultReplay.setAttribute("data-wp-frame-action", "primary");
  for (const button of [resultMenu, resultClose, query("#leaveContinue"), query("#leaveStages")]) {
    button?.setAttribute("data-wp-frame-action", "secondary");
  }
  for (const button of [start, ...battleContent.querySelectorAll(".logic-action-row button"), resultReplay, resultMenu, resultClose]) {
    button.classList.remove("logic-primary", "logic-secondary");
  }

  app.battle.dataset.wpBattleMinWidth = "390";
  app.battle.dataset.wpBattleMinHeight = "720";
  app.battle.dataset.wpBattleLandscapeWidth = "760";
  app.battle.dataset.wpBattleLandscapeHeight = "350";
  app.battle.setAttribute("data-wp-frame-logical-header", "battle");
  app.battle.setAttribute("data-wp-frame-play-fill", "");

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: picker,
    playUI: true,
    scenes: {
      main: { root: app.main, header: mainHeader, content: mainContent },
      battle: { root: app.battle, header: battleHeader, content: battleContent },
    },
  });
  const battleGroup = window.WeightPlayScreenFrame.createGroup();
  battleGroup.add(app.battleChip);
  frame.battleTopUI.add(battleGroup);

  function activate(scene, covered = false) {
    const isBattle = scene === "battle";
    app.main.hidden = isBattle;
    app.battle.hidden = !isBattle;
    battleContent.inert = isBattle && covered;
    battleContent.setAttribute("aria-hidden", String(isBattle && covered));
    document.body.classList.toggle("logic-playing", isBattle);
    frame.activate(scene, { covered: isBattle && covered });
    if (isBattle) {
      // Canvas activation exposes its return control before it can measure
      // the Battle root. Apply the Canvas transform, then let the shared frame
      // compensate its controls against that settled physical scale before
      // this scene can paint.
      window.WeightPlayBattleCanvas?.sync?.();
      frame.activate(scene, { covered });
    } else {
      window.WeightPlayBattleCanvas?.sync?.();
    }
  }

  function startBattle() {
    app.startGame();
    activate("battle");
  }

  function showMain() {
    app.showMain();
    activate("main");
    start.focus({ preventScroll: true });
  }

  function replayBattle() {
    app.result.hidden = true;
    app.replay();
    activate("battle");
  }

  function closeResult() {
    app.result.hidden = true;
    activate("battle");
    query("#logicUndo").focus({ preventScroll: true });
  }

  // The Logic Lab keeps ownership of Hanoi rules and actions. The shared
  // frame owns navigation, Settings, layout, and the active scene.
  app.screenFlow = {
    start: startBattle,
    battleBack: showMain,
    hint: () => app.getActiveGame()?.hint?.(),
    undo: () => app.getActiveGame()?.undo?.(),
    reset: replayBattle,
    resultReplay: replayBattle,
    resultMenu: showMain,
    resultClose: closeResult,
  };
  app.cfg.onResult = () => {
    activate("battle", true);
    resultReplay.focus({ preventScroll: true });
  };

  activate("main");
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) frame.destroy();
  });
})();
