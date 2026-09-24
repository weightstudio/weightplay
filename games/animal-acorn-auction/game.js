(() => {
  "use strict";

  if (window.__ACORN_AUCTION_INTERFACE7_COMPAT__) return;
  window.__ACORN_AUCTION_INTERFACE7_COMPAT__ = true;

  const routeLocales = {
    en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es",
    "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar"
  };
  const startLabels = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Commencer", de: "Spiel starten", it: "Inizia gioco",
    ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة"
  };
  const stageLabels = {
    en: "Stages", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ", ko: "스테이지", es: "Niveles",
    "pt-BR": "Fases", fr: "Niveaux", de: "Level", it: "Livelli", ru: "Уровни", hi: "स्तर", ar: "المراحل"
  };
  const leaveMessages = {
    en: "Leave “{stage}” and return to Stages? Any pending result or unfinished picks for this round will be discarded; rounds already completed stay completed.",
    "zh-Hant": "要離開「{stage}」並返回關卡嗎？本回合尚未完成的選擇或待顯示的結算會放棄；已完成的回合仍會保留。",
    "zh-Hans": "要离开“{stage}”并返回关卡吗？本回合尚未完成的选择或待显示的结算会放弃；已完成的回合仍会保留。",
    ja: "「{stage}」を離れてステージに戻りますか？このラウンドの未完了の選択または保留中の結果は破棄されますが、完了済みのラウンドは保持されます。",
    ko: "“{stage}”에서 나가 스테이지로 돌아갈까요? 이 라운드의 완료되지 않은 선택이나 대기 중인 결과는 사라지지만 이미 완료한 라운드는 유지됩니다.",
    es: "¿Salir de «{stage}» y volver a Niveles? Se descartarán las elecciones sin terminar o el resultado pendiente de esta ronda; las rondas ya completadas se conservarán.",
    "pt-BR": "Sair de “{stage}” e voltar às Fases? As escolhas não concluídas ou o resultado pendente desta rodada serão descartados; as rodadas já concluídas serão mantidas.",
    fr: "Quitter « {stage} » et revenir aux Niveaux ? Les choix non terminés ou le résultat en attente de cette manche seront abandonnés ; les manches déjà terminées resteront enregistrées.",
    de: "„{stage}“ verlassen und zu den Leveln zurückkehren? Unfertige Entscheidungen oder das ausstehende Ergebnis dieser Runde werden verworfen; bereits abgeschlossene Runden bleiben erhalten.",
    it: "Uscire da “{stage}” e tornare ai Livelli? Le scelte non completate o il risultato in attesa di questo round verranno scartati; i round già completati resteranno salvati.",
    ru: "Выйти из «{stage}» и вернуться к уровням? Незавершённые выборы или ожидающий результат этого раунда будут сброшены; уже завершённые раунды сохранятся.",
    hi: "“{stage}” छोड़कर स्तरों पर लौटें? इस राउंड की अधूरी पसंदें या लंबित परिणाम हटा दिए जाएँगे; पहले से पूरे किए गए राउंड सुरक्षित रहेंगे।",
    ar: "هل تريد مغادرة «{stage}» والعودة إلى المراحل؟ ستُلغى الاختيارات غير المكتملة أو النتيجة المعلّقة لهذه الجولة، بينما ستبقى الجولات المكتملة محفوظة."
  };
  const continueLabels = {
    en: "Continue playing", "zh-Hant": "繼續遊玩", "zh-Hans": "继续游戏", ja: "プレイを続ける", ko: "계속 플레이",
    es: "Seguir jugando", "pt-BR": "Continuar jogando", fr: "Continuer à jouer", de: "Weiterspielen", it: "Continua a giocare",
    ru: "Продолжить игру", hi: "खेल जारी रखें", ar: "متابعة اللعب"
  };
  const returnLabels = {
    en: "Return to Stages", "zh-Hant": "返回關卡", "zh-Hans": "返回关卡", ja: "ステージへ戻る", ko: "스테이지로 돌아가기",
    es: "Volver a Niveles", "pt-BR": "Voltar às Fases", fr: "Retour aux niveaux", de: "Zu den Leveln", it: "Torna ai livelli",
    ru: "К уровням", hi: "स्तरों पर लौटें", ar: "العودة إلى المراحل"
  };

  const normalizeLocale = (value) => {
    const raw = String(value || "");
    if (raw === "zh-TW" || raw.toLowerCase() === "zh-tw") return "zh-Hant";
    if (raw === "zh-CN" || raw.toLowerCase() === "zh-cn") return "zh-Hans";
    if (raw.toLowerCase().startsWith("pt")) return "pt-BR";
    return startLabels[raw] ? raw : "en";
  };
  const localeFromPath = () => routeLocales[location.pathname.split("/").filter(Boolean)[0]?.toLowerCase?.()] || null;
  const currentLocale = () => normalizeLocale(localeFromPath() || document.documentElement.lang || "en");

  Object.entries(startLabels).forEach(([locale, label]) => {
    if (window.ACORN_AUCTION_LOCALES?.[locale]) window.ACORN_AUCTION_LOCALES[locale].start = label;
  });

  const startButton = document.getElementById("startBtn");
  startButton?.setAttribute("data-wp-main-start", "true");

  const ensureStageNav = () => {
    const stage = document.getElementById("stageScreen");
    if (!stage) return;
    let nav = document.getElementById("acornInterface7StageNav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.id = "acornInterface7StageNav";
      nav.className = "acorn-interface7-stage-nav";
      nav.innerHTML = '<span class="acorn-interface7-stage-slot" aria-hidden="true"></span><button id="acornInterface7StagesTab" class="acorn-interface7-stage-tab is-active" type="button" aria-current="page"></button><span class="acorn-interface7-stage-slot" aria-hidden="true"></span>';
      stage.appendChild(nav);
      nav.querySelector("button")?.addEventListener("click", () => {
        stage.querySelector('#stageList [aria-selected="true"]')?.scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    }
    const locale = currentLocale();
    const tab = document.getElementById("acornInterface7StagesTab");
    if (tab) tab.textContent = stageLabels[locale] || stageLabels.en;
    nav.setAttribute("aria-label", stageLabels[locale] || stageLabels.en);
  };

  const retireLegacyExtras = () => {
    document.querySelectorAll("#mainScreen .cover-badge, #mainScreen > .eyebrow, #mainScreen .guide-art-wrap, #mainScreen #mapBtn, #battleScreen #backMarketBtn")
      .forEach((node) => {
        node.setAttribute("aria-hidden", "true");
        node.setAttribute("tabindex", "-1");
      });
  };

  const installBattleLeaveGuard = () => {
    const button = document.getElementById("battleBackBtn");
    if (!button || button.dataset.wpAcornLeaveGuard === "true") return;
    button.dataset.wpAcornLeaveGuard = "true";
    let bypass = false;
    let pausedPending = null;
    let coveredNodes = [];

    const ensureDialog = () => {
      let dialog = document.getElementById("acornInterface7LeaveDialog");
      if (dialog) return dialog;
      const battle = document.getElementById("battleScreen");
      if (!battle) return null;
      dialog = document.createElement("div");
      dialog.id = "acornInterface7LeaveDialog";
      dialog.className = "acorn-interface7-leave-layer";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "acornInterface7LeaveMessage");
      dialog.hidden = true;
      dialog.innerHTML = '<div class="acorn-interface7-leave-card"><p id="acornInterface7LeaveMessage"></p><div class="acorn-interface7-leave-actions"><button id="acornInterface7Continue" class="primary" type="button"></button><button id="acornInterface7Return" class="secondary" type="button"></button></div></div>';
      battle.appendChild(dialog);
      return dialog;
    };

    const restoreCovered = () => {
      coveredNodes.forEach(({ node, inert }) => { node.inert = inert; });
      coveredNodes = [];
    };

    const closeDialog = ({ resume = false, restoreFocus = false } = {}) => {
      const dialog = ensureDialog();
      if (!dialog || dialog.hidden) return;
      dialog.hidden = true;
      restoreCovered();
      if (resume) window.__ACORN_AUCTION_INTERFACE_BRIDGE__?.resumePending?.(pausedPending);
      pausedPending = null;
      if (restoreFocus) button.focus({ preventScroll: true });
    };

    const openDialog = () => {
      const battle = document.getElementById("battleScreen");
      const dialog = ensureDialog();
      if (!battle || !dialog) return;
      const locale = currentLocale();
      const stage = document.getElementById("roundTitle")?.textContent?.trim() || stageLabels[locale] || stageLabels.en;
      const message = (leaveMessages[locale] || leaveMessages.en).replace("{stage}", stage);
      dialog.querySelector("#acornInterface7LeaveMessage").textContent = message;
      dialog.querySelector("#acornInterface7Continue").textContent = continueLabels[locale] || continueLabels.en;
      dialog.querySelector("#acornInterface7Return").textContent = returnLabels[locale] || returnLabels.en;
      pausedPending = window.__ACORN_AUCTION_INTERFACE_BRIDGE__?.pausePending?.() || null;
      coveredNodes = [...battle.children]
        .filter((node) => node !== dialog)
        .map((node) => ({ node, inert: Boolean(node.inert) }));
      coveredNodes.forEach(({ node }) => { node.inert = true; });
      dialog.hidden = false;
      dialog.querySelector("#acornInterface7Continue")?.focus({ preventScroll: true });
    };

    const dialog = ensureDialog();
    dialog?.querySelector("#acornInterface7Continue")?.addEventListener("click", () => closeDialog({ resume: true, restoreFocus: true }));
    dialog?.querySelector("#acornInterface7Return")?.addEventListener("click", () => {
      closeDialog();
      bypass = true;
      button.click();
    });
    dialog?.addEventListener("keydown", (event) => {
      if (dialog.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeDialog({ resume: true, restoreFocus: true });
        return;
      }
      if (event.key !== "Tab") return;
      const actions = [...dialog.querySelectorAll("button:not(:disabled)")];
      if (!actions.length) return;
      const first = actions[0];
      const last = actions[actions.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    button.addEventListener("click", (event) => {
      if (bypass) {
        bypass = false;
        return;
      }
      const battle = document.getElementById("battleScreen");
      if (!battle || battle.hidden) return;
      const phase = window.__ACORN_AUCTION_INTERFACE_BRIDGE__?.getState?.().phase;
      if (!new Set(["choose", "retry", "complete"]).has(phase)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDialog();
    }, true);
  };

  ensureStageNav();
  retireLegacyExtras();
  installBattleLeaveGuard();

  import("/src/stage-selector-standard.js");
  import("./game-v4-base.js?v=20260924-acorn-auction-v6-i7-issue-repair").then(() => {
    ensureStageNav();
    retireLegacyExtras();
    installBattleLeaveGuard();
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    document.getElementById("localeSelect")?.addEventListener("change", () => queueMicrotask(ensureStageNav));
  });
})();
