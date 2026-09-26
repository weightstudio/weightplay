(() => {
  "use strict";

  const init = () => {
    if (document.documentElement.dataset.pegInterface7Ready === "true") return;
    const main = document.querySelector("#logicMain");
    const battle = document.querySelector("#logicBattle");
    const result = document.querySelector("#logicResult");
    const legacyBack = document.querySelector("#battleBack");
    const leave = document.querySelector("#logicLeave");
    if (!main || !battle || !result || !legacyBack || !leave) return;

    document.documentElement.dataset.pegInterface7Ready = "true";
    document.body.dataset.wpGameId = "peg-solitaire";
    document.body.dataset.audience = "general";
    main.setAttribute("data-wp-standard-main-screen", "");
    result.dataset.wpBattleSubstate = "result";

    const locale = document.documentElement.lang || "en";
    const labels = {
      en: ["Leave this puzzle?", "Your current board and move history will be discarded. Completed results are not affected.", "Continue playing", "Return to Main"],
      "zh-Hant": ["要離開這局嗎？", "目前棋盤與步數紀錄會被捨棄；已完成的結果不受影響。", "繼續遊玩", "返回主畫面"],
      "zh-Hans": ["要离开这局吗？", "当前棋盘与步数记录会被舍弃；已完成的结果不受影响。", "继续游玩", "返回主画面"],
      ja: ["このパズルを終了しますか？", "現在の盤面と手数履歴は破棄されます。完了済みの結果には影響しません。", "プレイを続ける", "メインへ戻る"],
      ko: ["이 퍼즐을 나갈까요?", "현재 보드와 이동 기록은 사라집니다. 완료한 결과에는 영향을 주지 않습니다.", "계속 플레이", "메인으로 돌아가기"],
      es: ["¿Salir de este puzle?", "Se descartarán el tablero actual y el historial de movimientos. Los resultados completados no cambian.", "Seguir jugando", "Volver al inicio"],
      "pt-BR": ["Sair deste quebra-cabeça?", "O tabuleiro atual e o histórico de movimentos serão descartados. Resultados concluídos não serão afetados.", "Continuar jogando", "Voltar ao início"],
      fr: ["Quitter ce puzzle ?", "Le plateau actuel et l’historique des coups seront abandonnés. Les résultats terminés ne changent pas.", "Continuer à jouer", "Retour à l’accueil"],
      de: ["Dieses Rätsel verlassen?", "Das aktuelle Brett und der Zugverlauf werden verworfen. Abgeschlossene Ergebnisse bleiben erhalten.", "Weiterspielen", "Zurück zum Start"],
      it: ["Uscire da questo puzzle?", "La tavola attuale e la cronologia delle mosse verranno scartate. I risultati completati non cambiano.", "Continua a giocare", "Torna all’inizio"],
      ru: ["Выйти из головоломки?", "Текущее поле и история ходов будут сброшены. Завершённые результаты не изменятся.", "Продолжить игру", "Вернуться на главную"],
      hi: ["इस पहेली से बाहर जाएँ?", "मौजूदा बोर्ड और चालों का इतिहास छोड़ दिया जाएगा। पूरे किए गए नतीजे प्रभावित नहीं होंगे।", "खेलते रहें", "मुख्य पृष्ठ पर लौटें"],
      ar: ["مغادرة هذا اللغز؟", "سيتم تجاهل اللوحة الحالية وسجل الحركات. لن تتأثر النتائج المكتملة.", "متابعة اللعب", "العودة إلى الرئيسية"]
    };
    const label = labels[locale] || labels.en;

    const copy = main.querySelector(".logic-copy");
    copy?.querySelector(".logic-kicker")?.setAttribute("hidden", "");
    copy?.querySelector("h2")?.setAttribute("hidden", "");
    copy?.querySelector(".logic-facts")?.setAttribute("hidden", "");

    const routeGuide = [...document.querySelectorAll(".game-page-info,[data-wp-game-guide]")]
      .find((node) => !node.classList.contains("logic-guide"));
    const compactGuide = document.querySelector("#logicApp .logic-guide");
    if (routeGuide && compactGuide) {
      compactGuide.hidden = true;
      compactGuide.setAttribute("aria-hidden", "true");
    }

    const battleHeader = battle.querySelector(".logic-battle-header");
    const battleWrap = battle.querySelector(".logic-battle-wrap");
    const title = battleHeader?.querySelector("h1");
    if (title) {
      title.classList.add("wp-play-title-sr-only");
      title.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll(".battle-ad-reserve,[data-wp-ad-reserve]").forEach((node) => node.remove());

    const resultStages = document.querySelector("#resultStages");
    const resultNext = document.querySelector("#resultNext");
    const resultClose = document.querySelector("#resultClose");
    const resultMenu = document.querySelector("#resultMenu");
    const resultReplay = document.querySelector("#resultReplay");
    const resultActions = result.querySelector(".logic-result-actions");
    const normalizeResult = () => {
      if (resultStages) resultStages.hidden = true;
      if (resultNext) resultNext.hidden = true;
      if (resultClose) resultClose.hidden = true;
      if (resultMenu) resultMenu.hidden = false;
      if (resultReplay) resultReplay.hidden = false;
      if (resultActions && resultMenu && resultReplay && resultMenu.nextElementSibling !== resultReplay) {
        resultActions.insertBefore(resultMenu, resultReplay);
      }
    };

    const back = legacyBack.cloneNode(true);
    legacyBack.replaceWith(back);
    const oldContinue = document.querySelector("#leaveContinue");
    const oldLeave = document.querySelector("#leaveStages");
    const keepPlaying = oldContinue?.cloneNode(true);
    const returnMain = oldLeave?.cloneNode(true);
    oldContinue?.replaceWith(keepPlaying);
    oldLeave?.replaceWith(returnMain);

    const leaveTitle = document.querySelector("#logicLeaveTitle");
    const leaveBody = leave.querySelector(".logic-leave-card > p");
    if (leaveTitle) leaveTitle.textContent = label[0];
    if (leaveBody) leaveBody.textContent = label[1];
    if (keepPlaying) keepPlaying.textContent = label[2];
    if (returnMain) returnMain.textContent = label[3];

    const setCoveredInert = (blocked) => {
      [battleHeader, battleWrap].forEach((node) => {
        if (!node) return;
        node.inert = blocked;
        if (blocked) node.setAttribute("aria-hidden", "true");
        else node.removeAttribute("aria-hidden");
      });
    };
    const syncOcclusion = () => setCoveredInert(!leave.hidden || !result.hidden);
    const syncScreen = () => {
      document.body.dataset.screen = battle.hidden ? "main" : "battle";
      syncOcclusion();
    };
    const focusables = () => [...leave.querySelectorAll("button:not([disabled]),a[href]")]
      .filter((node) => !node.hidden);

    const closeLeave = () => {
      leave.hidden = true;
      syncOcclusion();
      back.focus({ preventScroll: true });
    };
    const openLeave = () => {
      document.querySelectorAll(".peg-feedback-layer").forEach((node) => node.remove());
      document.getAnimations().forEach((animation) => {
        const target = animation.effect?.target;
        if (target?.closest?.(".logic-peg-board,.peg-feedback-layer")) animation.cancel();
      });
      leave.hidden = false;
      syncOcclusion();
      requestAnimationFrame(() => focusables()[0]?.focus({ preventScroll: true }));
    };
    const mutable = () => {
      const board = document.querySelector(".logic-peg-board");
      return Boolean(result.hidden && board && board.querySelectorAll(".logic-cell.peg").length < 32);
    };

    back.addEventListener("click", () => {
      if (mutable()) openLeave();
      else legacyBack.click();
    });
    keepPlaying?.addEventListener("click", closeLeave);
    returnMain?.addEventListener("click", () => {
      leave.hidden = true;
      setCoveredInert(false);
      legacyBack.click();
      syncScreen();
    });
    leave.addEventListener("keydown", (event) => {
      if (leave.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeave();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    new MutationObserver(() => {
      normalizeResult();
      syncScreen();
    }).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    [main, battle].forEach((screen) => {
      new MutationObserver(syncScreen).observe(screen, { attributes: true, attributeFilter: ["hidden"] });
    });

    normalizeResult();
    syncScreen();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
