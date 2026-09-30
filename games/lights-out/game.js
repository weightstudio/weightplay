(() => {
  "use strict";

  const art = document.createElement("link");
  art.rel = "stylesheet";
  art.href = new URL("art.css?v=20260930-lights-out-v13-i8", document.currentScript.src).href;
  document.head.append(art);

  const app = window.WPClassicLogic.mount("lights-out");
  const root = app.root;
  const query = (selector) => root.querySelector(selector);
  const mainHeader = app.main.querySelector("header");
  const battleHeader = app.battle.querySelector("header");
  const content = query(".logic-battle-wrap");
  const mainContent = query(".logic-hero");
  const back = query("#battleBack");
  const start = query("#startButton");
  const leave = query("#logicLeave");
  const continueButton = query("#leaveContinue");
  const leaveButton = query("#leaveStages");
  const replay = query("#resultReplay");
  const menu = query("#resultMenu");
  const close = query("#resultClose");
  const picker = query("#localePicker");
  const turnLabel = app.battleChip.textContent;
  const abort = new AbortController();
  const listen = (node, event, callback) => node.addEventListener(event, callback, { signal: abort.signal });
  const seenRewards = new WeakSet();
  let scene = "main";
  let covered = null;
  let motion = null;

  const leaveCopy = {
    en: ["Leave puzzle?", "Your current board and moves will be reset. Your saved best move count stays.", "Return to Main"],
    "zh-Hant": ["離開棋盤？", "目前棋盤與步數將會重設，已儲存的最佳步數會保留。", "返回主頁"],
    "zh-Hans": ["离开棋盘？", "当前棋盘和步数将会重置，已保存的最佳步数会保留。", "返回主页"],
    ja: ["パズルを終了しますか？", "現在の盤面と手数はリセットされます。保存済みの最少手数は残ります。", "メインに戻る"],
    ko: ["퍼즐을 나갈까요?", "현재 보드와 이동 횟수는 초기화됩니다. 저장된 최고 기록은 유지됩니다.", "메인으로 돌아가기"],
    es: ["¿Salir del puzzle?", "El tablero y los movimientos actuales se reiniciarán. Tu mejor marca guardada se conserva.", "Volver al inicio"],
    "pt-BR": ["Sair do puzzle?", "O tabuleiro e os movimentos atuais serão reiniciados. Sua melhor marca salva será mantida.", "Voltar ao início"],
    fr: ["Quitter le puzzle ?", "Le plateau et les coups actuels seront réinitialisés. Votre meilleur score enregistré reste sauvegardé.", "Retour à l’accueil"],
    de: ["Rätsel verlassen?", "Das aktuelle Brett und die Zugzahl werden zurückgesetzt. Dein gespeicherter Bestwert bleibt erhalten.", "Zurück zum Hauptmenü"],
    it: ["Uscire dal puzzle?", "La griglia e le mosse attuali verranno azzerate. Il miglior risultato salvato resterà disponibile.", "Torna al menu"],
    ru: ["Выйти из головоломки?", "Текущее поле и число ходов будут сброшены. Сохранённый лучший результат останется.", "Вернуться в меню"],
    hi: ["पहेली छोड़ें?", "मौजूदा बोर्ड और चालों की संख्या रीसेट होगी। आपका सहेजा हुआ सर्वोत्तम रिकॉर्ड बना रहेगा।", "मुख्य स्क्रीन पर लौटें"],
    ar: ["هل تريد مغادرة اللغز؟", "ستُعاد اللوحة الحالية وعدد النقلات إلى البداية. سيبقى أفضل عدد نقلات محفوظًا.", "العودة إلى الرئيسية"],
  };
  const copy = leaveCopy[document.documentElement.lang] || leaveCopy.en;
  query("#logicLeaveTitle").textContent = copy[0];
  leave.querySelector("p").textContent = copy[1];
  leaveButton.textContent = copy[2];
  back.setAttribute("aria-label", copy[2]);
  leave.setAttribute("aria-describedby", "logicLeaveText");
  leave.querySelector("p").id = "logicLeaveText";
  app.result.setAttribute("aria-describedby", "logicResultText");
  app.result.setAttribute("data-wp-result-screen", "");
  app.result.querySelector(".logic-result-card").setAttribute("data-wp-result-card", "");

  // Bind the existing content once. The shared frame is the only header,
  // preferences, theme and active-scene presentation owner.
  const retained = document.createElement("div");
  retained.hidden = true;
  retained.inert = true;
  retained.append(picker);
  root.append(retained);
  mainHeader.querySelector(".logic-header-tools").remove();
  root.querySelector(".logic-lab").classList.remove("logic-lab");
  document.querySelector("body > h1")?.setAttribute("aria-hidden", "true");
  app.stage.remove();
  app.main.querySelector(".logic-guide").remove();
  app.main.classList.remove("logic-main");
  mainContent.className = "lights-main-content";
  mainContent.querySelectorAll(".logic-kicker, .logic-facts, .logic-progress-slot, h2").forEach((node) => node.remove());
  mainHeader.querySelector("h1").setAttribute("data-wp-frame-title", "");
  battleHeader.querySelector("h1").setAttribute("data-wp-frame-title", "");
  mainContent.querySelector(".logic-poster").setAttribute("data-wp-frame-poster", "");
  mainContent.querySelector(".logic-poster img").src = window.WEIGHTPLAY_INTERFACE7_POSTERS?.["lights-out"] || "/assets/interface7-redrawn/lights-out.webp";
  mainContent.querySelector(".logic-copy").setAttribute("data-wp-frame-copy", "");
  mainContent.querySelector(".logic-copy > p").setAttribute("data-wp-frame-summary", "");
  start.setAttribute("data-wp-frame-action", "primary");
  content.querySelectorAll(".logic-action-row button").forEach((button) => button.setAttribute("data-wp-frame-action", "secondary"));
  app.tutorial.tabIndex = 0;
  app.tutorial.setAttribute("data-wp-scroll-owner", "");
  for (const button of [replay, menu, close, continueButton, leaveButton]) button.setAttribute("data-wp-frame-action", "secondary");
  // Equal-height persistent Result actions keep the established no-Stage
  // Replay / Menu / Close recovery contract.
  replay.setAttribute("data-wp-frame-action", "primary");
  continueButton.setAttribute("data-wp-frame-action", "primary");
  for (const button of [start, ...content.querySelectorAll(".logic-action-row button"), replay, menu, close, continueButton, leaveButton]) {
    button.classList.remove("logic-primary", "logic-secondary");
  }
  const info = document.createElement("div");
  info.setAttribute("data-wp-frame-info", "");
  const stat = document.createElement("div");
  stat.append(app.battleChip);
  info.append(stat);
  content.prepend(info);
  app.battle.dataset.wpBattleMinWidth = "390";
  app.battle.dataset.wpBattleMinHeight = "720";
  app.battle.dataset.wpBattleLandscapeWidth = "760";
  app.battle.dataset.wpBattleLandscapeHeight = "350";

  const frame = window.WeightPlayScreenFrame.mount({
    root,
    localeSelect: picker,
    scenes: {
      main: { root: app.main, header: mainHeader, content: mainContent },
      battle: { root: app.battle, header: battleHeader, content, headerInfo: info },
    },
  });

  function enter(node) {
    motion?.cancel();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motion = node.animate?.([{ opacity: 0.6 }, { opacity: 1 }], { duration: reduced ? 60 : 140, easing: "ease-out" }) || null;
  }

  function activate() {
    const blocked = scene === "battle" && covered !== null;
    app.main.hidden = scene !== "main";
    app.battle.hidden = scene !== "battle";
    app.result.hidden = covered !== "result";
    leave.hidden = covered !== "leave";
    content.inert = blocked;
    content.setAttribute("aria-hidden", String(blocked));
    document.body.classList.toggle("logic-playing", scene === "battle");
    frame.activate(scene, { covered: blocked });
    // The canonical scaler settles immediately at the same scene boundary.
    window.WeightPlayBattleCanvas?.sync?.();
  }

  function refreshBoard(focusIndex = null) {
    const cells = [...app.board.querySelectorAll(".logic-lights-board button")];
    cells.forEach((cell, index) => {
      cell.dataset.lightIndex = String(index);
      cell.setAttribute("aria-pressed", String(cell.classList.contains("on")));
    });
    if (scene === "battle" && covered === null && focusIndex !== null) cells[focusIndex]?.focus({ preventScroll: true });
  }

  function startBattle(restarting = false) {
    motion?.cancel();
    window.ShowResultGet("lights-out", false);
    covered = null;
    scene = "battle";
    if (restarting) app.replay();
    else app.startGame();
    activate();
    refreshBoard(0);
    enter(content);
  }

  function showMain() {
    motion?.cancel();
    window.ShowResultGet("lights-out", false);
    covered = null;
    scene = "main";
    app.showMain();
    activate();
    start.focus({ preventScroll: true });
    enter(mainContent);
  }

  function closeLeave() {
    covered = null;
    activate();
    back.focus({ preventScroll: true });
    enter(content);
  }

  function openLeave() {
    // A never-mutated opening has no temporary progress to discard.
    const moves = Number(app.board.querySelector(".logic-live")?.textContent.match(/\d+/)?.[0] || 0);
    if (!moves) return showMain();
    covered = "leave";
    activate();
    continueButton.focus({ preventScroll: true });
    enter(leave.querySelector(".logic-leave-card"));
  }

  function closeResult() {
    window.ShowResultGet("lights-out", false);
    covered = null;
    activate();
    refreshBoard();
    query("#logicUndo").focus({ preventScroll: true });
    enter(content);
  }

  function gameAction(action) {
    if (scene !== "battle" || covered !== null) return;
    app.getActiveGame()?.[action]?.();
    if (app.result.hidden) app.battleChip.textContent = app.board.querySelector(".logic-lights-board .on") ? turnLabel : app.battleChip.textContent;
    refreshBoard();
    enter(app.board.querySelector(".logic-lights-board"));
  }

  // Original Logic Lab listeners delegate here; there is no second action
  // listener, DOM observer, navigation controller or copied gameplay engine.
  app.screenFlow = {
    start: () => startBattle(),
    battleBack: openLeave,
    hint: () => gameAction("hint"),
    undo: () => gameAction("undo"),
    reset: () => startBattle(true),
    resultReplay: () => startBattle(true),
    resultMenu: showMain,
    resultClose: closeResult,
    leaveContinue: closeLeave,
    leaveStages: showMain,
  };
  app.cfg.onResult = () => {
    covered = "result";
    activate();
    window.ShowResultGet("lights-out", false);
    refreshBoard();
    replay.focus({ preventScroll: true });
    enter(app.result.querySelector(".logic-result-card"));
  };

  listen(app.board, "click", (event) => {
    // The engine synchronously replaces every cell. The old event target
    // retains its index but no longer has a board ancestor when this bubbles.
    const button = event.target.closest("button[data-light-index]");
    if (!button || scene !== "battle" || covered !== null) return;
    const index = Number(button.dataset.lightIndex);
    if (app.board.querySelector(".logic-lights-board .on")) app.battleChip.textContent = turnLabel;
    refreshBoard(index);
    enter(app.board.querySelector(".logic-lights-board"));
  });
  listen(window, "weightplay:castle-reward", (event) => {
    const reward = event.detail;
    if (!reward || reward.gameId !== "lights-out" || reward.completionId !== "first-completion"
      || !(Number(reward.amount) > 0) || seenRewards.has(reward)) return;
    seenRewards.add(reward);
    // Shared analytics/castle publishes only after its reward store commits.
    // A replay that does not grant another block keeps the marker cleared.
    if (scene === "battle" && covered === "result") window.ShowResultGet("lights-out", true);
  });
  listen(root, "keydown", (event) => {
    if (covered !== null) {
      const dialog = covered === "leave" ? leave : app.result;
      if (event.key === "Escape") {
        event.preventDefault();
        covered === "leave" ? closeLeave() : closeResult();
      } else if (event.key === "Tab") {
        const controls = [...dialog.querySelectorAll("button")].filter((button) => !button.hidden && !button.disabled);
        const index = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus({ preventScroll: true });
      }
      return;
    }
    const button = event.target.closest(".logic-lights-board button");
    if (!button || scene !== "battle") return;
    const index = Number(button.dataset.lightIndex);
    const rtl = document.documentElement.dir === "rtl";
    const step = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowUp: -5, ArrowDown: 5 }[event.key];
    let target = event.key === "Home" ? Math.floor(index / 5) * 5 : event.key === "End" ? Math.floor(index / 5) * 5 + 4 : index + (step || 0);
    if (step === undefined && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (Math.abs(step) === 1 && Math.floor(target / 5) !== Math.floor(index / 5)) target = index;
    refreshBoard(Math.max(0, Math.min(24, target)));
  });
  listen(window, "pageshow", () => activate());
  listen(window, "pagehide", (event) => {
    motion?.cancel();
    if (!event.persisted) { abort.abort(); frame.destroy(); }
  });
  activate();
})();
