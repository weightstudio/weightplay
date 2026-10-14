(function () {
  "use strict";

  const gameScriptUrl = document.currentScript?.src || document.baseURI;
  const appendStyle = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL(href, gameScriptUrl).href;
    document.head.appendChild(link);
  };

  appendStyle("art.css?v=20260921-sudoku-block-scene-v1");
  appendStyle("interface-7-cleanup.css?v=20261014-sudoku-short-landscape-canvas-i9-v1");

  const app = window.WPClassicLogic?.mount("sudoku");
  if (!app) return;

  const root = app.root;
  const main = app.main;
  const battle = app.battle;
  const battleHeader = battle?.querySelector(".logic-battle-header");
  const battleLive = battle?.querySelector(".logic-battle-wrap");
  const battleBack = root.querySelector("#battleBack");
  const leave = root.querySelector("#logicLeave");
  const leaveTitle = root.querySelector("#logicLeaveTitle");
  const leaveText = leave?.querySelector("p");
  const leaveContinue = root.querySelector("#leaveContinue");
  const leaveMain = root.querySelector("#leaveStages");
  const result = app.result;
  const resultMenu = root.querySelector("#resultMenu");
  const resultReplay = root.querySelector("#resultReplay");
  const resultClose = root.querySelector("#resultClose");

  const copy = {
    en: { leaveTitle: "Leave this puzzle?", leaveText: "Your current board entries and undo history will be discarded. Saved preferences are not affected.", continue: "Continue Playing", main: "Return to Main" },
    "zh-Hant": { leaveTitle: "要離開這個謎題嗎？", leaveText: "目前盤面的填答與還原紀錄會被捨棄；已儲存的偏好設定不受影響。", continue: "繼續遊玩", main: "返回主畫面" },
    "zh-Hans": { leaveTitle: "要离开这个谜题吗？", leaveText: "当前盘面的填写与撤销记录会被丢弃；已保存的偏好设置不受影响。", continue: "继续游戏", main: "返回主界面" },
    ja: { leaveTitle: "このパズルを終了しますか？", leaveText: "現在の盤面入力と取り消し履歴は破棄されます。保存済みの設定には影響しません。", continue: "プレイを続ける", main: "メインへ戻る" },
    ko: { leaveTitle: "이 퍼즐에서 나갈까요?", leaveText: "현재 보드 입력과 실행 취소 기록이 사라집니다. 저장된 환경설정은 유지됩니다.", continue: "계속 플레이", main: "메인으로 돌아가기" },
    es: { leaveTitle: "¿Salir de este puzle?", leaveText: "Se descartarán las entradas del tablero y el historial de deshacer. Tus preferencias guardadas no cambiarán.", continue: "Seguir jugando", main: "Volver al inicio" },
    "pt-BR": { leaveTitle: "Sair deste quebra-cabeça?", leaveText: "As entradas atuais do tabuleiro e o histórico de desfazer serão descartados. As preferências salvas não serão alteradas.", continue: "Continuar jogando", main: "Voltar ao início" },
    fr: { leaveTitle: "Quitter cette grille ?", leaveText: "Les saisies actuelles et l’historique d’annulation seront perdus. Vos préférences enregistrées restent inchangées.", continue: "Continuer à jouer", main: "Retour à l’accueil" },
    de: { leaveTitle: "Dieses Rätsel verlassen?", leaveText: "Die aktuellen Einträge und der Rückgängig-Verlauf werden verworfen. Gespeicherte Einstellungen bleiben erhalten.", continue: "Weiterspielen", main: "Zurück zum Hauptmenü" },
    it: { leaveTitle: "Uscire da questo puzzle?", leaveText: "Le voci attuali e la cronologia Annulla verranno scartate. Le preferenze salvate non cambieranno.", continue: "Continua a giocare", main: "Torna alla schermata principale" },
    ru: { leaveTitle: "Выйти из этой головоломки?", leaveText: "Текущие записи на поле и история отмены будут сброшены. Сохранённые настройки не изменятся.", continue: "Продолжить игру", main: "На главный экран" },
    hi: { leaveTitle: "इस पहेली से बाहर जाएँ?", leaveText: "मौजूदा बोर्ड प्रविष्टियाँ और पूर्ववत इतिहास हटा दिए जाएँगे। सहेजी गई प्राथमिकताएँ बनी रहेंगी।", continue: "खेल जारी रखें", main: "मुख्य स्क्रीन पर लौटें" },
    ar: { leaveTitle: "هل تريد مغادرة هذا اللغز؟", leaveText: "سيتم تجاهل إدخالات اللوحة الحالية وسجل التراجع، بينما تبقى التفضيلات المحفوظة كما هي.", continue: "متابعة اللعب", main: "العودة إلى الرئيسية" },
  };

  const localeKey = () => {
    const lang = document.documentElement.lang || "en";
    if (copy[lang]) return lang;
    if (/^zh-(tw|hk|hant)/i.test(lang)) return "zh-Hant";
    if (/^zh/i.test(lang)) return "zh-Hans";
    if (/^pt/i.test(lang)) return "pt-BR";
    return Object.keys(copy).find((key) => lang.toLowerCase().startsWith(key.toLowerCase())) || "en";
  };

  const syncCopy = () => {
    const t = copy[localeKey()] || copy.en;
    if (leaveTitle) leaveTitle.textContent = t.leaveTitle;
    if (leaveText) leaveText.textContent = t.leaveText;
    if (leaveContinue) leaveContinue.textContent = t.continue;
    if (leaveMain) leaveMain.textContent = t.main;
    if (resultMenu) resultMenu.textContent = t.main;
    if (battleBack) {
      battleBack.setAttribute("aria-label", t.main);
      battleBack.title = t.main;
    }
  };

  app.stage?.remove();
  main?.querySelector(".logic-kicker")?.remove();
  main?.querySelector(".logic-copy > h2")?.remove();
  main?.querySelector(".logic-facts")?.remove();
  main?.querySelector(".logic-guide")?.remove();

  const poster = main?.querySelector(".logic-poster img");
  if (poster) {
    poster.src = new URL("../../assets/sudoku-cover-v1.webp", gameScriptUrl).href;
    poster.dataset.wpMainPoster = "";
  }

  battleHeader?.querySelector("h1")?.remove();
  battle?.setAttribute("data-wp-interface7-no-stage", "");
  battle?.setAttribute("data-wp-frame-logical-header", "battle");
  battle?.setAttribute("data-wp-frame-play-fill", "");

  if (leave) leave.dataset.wpBattleSubstate = "leave-confirm";
  if (result) result.dataset.wpBattleSubstate = "result";
  if (resultClose) {
    resultClose.hidden = true;
    resultClose.setAttribute("aria-hidden", "true");
    resultClose.tabIndex = -1;
  }

  syncCopy();

  // Presentation only: canonical analytics/castle still decides and commits
  // every reward. A committed receipt belongs to this actual native round.
  result?.querySelector(".logic-result-card")?.setAttribute("data-wp-result-card", "");
  let resultObtained = false;
  let rewardRoundStartedAt = Date.now();
  const seenRewardEvents = new WeakSet();
  const clearResultReward = () => {
    resultObtained = false;
    window.ShowResultGet?.("sudoku", false);
  };
  root.addEventListener("click", (event) => {
    if (!event.target.closest("#startButton, #resultReplay, #logicReset")) return;
    rewardRoundStartedAt = Date.now();
    clearResultReward();
  }, true);
  root.addEventListener("change", (event) => {
    if (!event.target.matches("#logicBoard .logic-select")) return;
    rewardRoundStartedAt = Date.now();
    clearResultReward();
  }, true);
  window.addEventListener("weightplay:castle-reward", (event) => {
    const reward = event.detail;
    if (result?.hidden || battle?.hidden || document.visibilityState === "hidden"
      || reward?.gameId !== "sudoku" || reward.completionId !== "first-completion"
      || !(Number(reward.amount) > 0) || seenRewardEvents.has(reward)) return;
    try {
      const saved = JSON.parse(localStorage.getItem("weightplayCastleV1") || "null");
      const committed = Number(saved?.completions?.["sudoku:first-completion"]);
      if (!committed || committed < rewardRoundStartedAt) return;
    } catch { return; }
    seenRewardEvents.add(reward);
    resultObtained = true;
    window.ShowResultGet?.("sudoku", true);
    const rewardRound = rewardRoundStartedAt;
    queueMicrotask(() => {
      // Other canonical reward listeners can append the notice later in this
      // same dispatch. Dismiss only this still-visible Result's UI notice.
      if (!result.hidden && !battle.hidden && resultObtained && rewardRound === rewardRoundStartedAt) {
        window.WeightPlayCastle?.dismissRewardNotice?.("sudoku");
      }
    });
  });

  let returnFocus = battleBack;
  const setBattleInert = (value) => {
    if (battleHeader) battleHeader.inert = value;
    if (battleLive) battleLive.inert = value;
  };

  const closeLeave = ({ focus = true } = {}) => {
    if (!leave || leave.hidden) return;
    leave.hidden = true;
    if (!result || result.hidden) setBattleInert(false);
    document.body.removeAttribute("data-wp-battle-substate");
    if (focus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  };

  const openLeave = () => {
    if (!leave || !result?.hidden) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : battleBack;
    syncCopy();
    leave.hidden = false;
    setBattleInert(true);
    document.body.dataset.wpBattleSubstate = "leave-confirm";
    leaveContinue?.focus({ preventScroll: true });
  };

  battleBack?.addEventListener("click", (event) => {
    if (result && !result.hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLeave();
  }, true);

  leaveContinue?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeLeave();
  }, true);

  leaveMain?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeLeave({ focus: false });
    app.showMain?.();
    root.querySelector("#startButton")?.focus({ preventScroll: true });
  }, true);

  const focusableInLeave = () => [leaveContinue, leaveMain].filter((node) => node && !node.hidden && !node.disabled);
  document.addEventListener("keydown", (event) => {
    if (!leave || leave.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeLeave();
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = focusableInLeave();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);

  let restoreMainResultFocus = false;
  document.addEventListener("pointerdown", () => { restoreMainResultFocus = false; }, true);
  const restoreMainFocusAfterPlacement = () => {
    if (!restoreMainResultFocus || main.hidden || !battle.hidden) return;
    if (document.activeElement === document.body) root.querySelector("#startButton")?.focus({ preventScroll: true });
  };
  new MutationObserver(restoreMainFocusAfterPlacement).observe(root, { childList: true, subtree: true });
  root.addEventListener("keydown", (event) => {
    if (event.isTrusted) restoreMainResultFocus = false;
    if (result?.hidden || battle?.hidden || event.key !== "Tab") return;
    const actions = [...result.querySelectorAll("button:not([disabled])")]
      .filter(button => !button.hidden && button.getClientRects().length);
    if (!actions.length) return;
    const first = actions[0], last = actions[actions.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus({ preventScroll: true });
    }
  }, true);
  document.addEventListener("focusin", (event) => {
    if (restoreMainResultFocus && event.target !== document.body && event.target.id !== "startButton") restoreMainResultFocus = false;
    if (result && !result.hidden && !battle.hidden && !result.contains(event.target)) {
      resultReplay?.focus({ preventScroll: true });
    }
  });
  let resultWasActive = false;
  const syncResultState = () => {
    if (!result) return;
    const active = !result.hidden;
    const justOpened = active && !resultWasActive;
    const justClosed = !active && resultWasActive;
    resultWasActive = active;
    if (active) window.ShowResultGet?.("sudoku", resultObtained);
    else clearResultReward();
    if (resultClose) {
      resultClose.hidden = true;
      resultClose.setAttribute("aria-hidden", "true");
      resultClose.tabIndex = -1;
    }
    if (active) {
      if (leave && !leave.hidden) closeLeave({ focus: false });
      setBattleInert(true);
      document.body.dataset.wpBattleSubstate = "result";
      if (justOpened) resultReplay?.focus({ preventScroll: true });
    } else if (!leave || leave.hidden) {
      setBattleInert(false);
      if (document.body.dataset.wpBattleSubstate === "result") document.body.removeAttribute("data-wp-battle-substate");
      if (justClosed) {
        restoreMainResultFocus = !main.hidden;
        const destination = !main.hidden ? root.querySelector("#startButton") : battleBack;
        destination?.focus({ preventScroll: true });
      }
    }
  };

  if (result) {
    new MutationObserver(syncResultState).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    syncResultState();
  }

  window.addEventListener("weightplay:shell-sync", syncCopy);
  window.WeightPlayScreenFrame?.autoMountDocument?.();
})();
