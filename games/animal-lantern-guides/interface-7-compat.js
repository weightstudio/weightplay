(() => {
  "use strict";

  const gameId = "animal-lantern-guides";
  if (document.body?.dataset.wpGameId !== gameId || window.__LANTERN_INTERFACE7_COMPAT__) return;
  window.__LANTERN_INTERFACE7_COMPAT__ = true;

  const scriptSource = document.currentScript?.src || location.href;
  if (!document.querySelector('link[data-wp-lantern-interface7]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("interface-7-cleanup.css?v=20260924-interface7-fix2", scriptSource).href;
    link.dataset.wpLanternInterface7 = "";
    document.head.append(link);
  }

  const START = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Commencer", de: "Spiel starten", it: "Inizia gioco",
    ru: "Начать игру", hi: "गेम शुरू करें", ar: "ابدأ اللعبة"
  };
  const STAGES = {
    en: "Stages", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ", ko: "스테이지",
    es: "Niveles", "pt-BR": "Fases", fr: "Niveaux", de: "Level", it: "Livelli",
    ru: "Уровни", hi: "चरण", ar: "المراحل"
  };
  const NEXT = {
    en: "Next Stage", "zh-Hant": "下一關", "zh-Hans": "下一关", ja: "次のステージ", ko: "다음 스테이지",
    es: "Siguiente nivel", "pt-BR": "Próxima fase", fr: "Niveau suivant", de: "Nächstes Level", it: "Livello successivo",
    ru: "Следующий уровень", hi: "अगला चरण", ar: "المرحلة التالية"
  };
  const REPLAY = {
    en: "Replay", "zh-Hant": "重新遊玩", "zh-Hans": "重新游玩", ja: "リプレイ", ko: "다시 플레이",
    es: "Repetir", "pt-BR": "Repetir", fr: "Rejouer", de: "Wiederholen", it: "Rigioca",
    ru: "Переиграть", hi: "फिर खेलें", ar: "إعادة اللعب"
  };
  const LEAVE = {
    en: ["Leave this trail?", "Your current handoff will be discarded.", "Continue", "Return to Stages"],
    "zh-Hant": ["離開這一關？", "目前的交接進度將會捨棄。", "繼續遊玩", "返回關卡"],
    "zh-Hans": ["离开这一关？", "当前的交接进度将会丢弃。", "继续游玩", "返回关卡"],
    ja: ["このステージを離れますか？", "現在の引き継ぎ進行は失われます。", "続ける", "ステージへ戻る"],
    ko: ["이 스테이지를 나갈까요?", "현재 전달 진행 상황이 사라집니다.", "계속하기", "스테이지로 돌아가기"],
    es: ["¿Salir de este nivel?", "Se descartará el progreso actual de la ronda.", "Continuar", "Volver a Niveles"],
    "pt-BR": ["Sair desta fase?", "O progresso atual da rodada será descartado.", "Continuar", "Voltar às Fases"],
    fr: ["Quitter ce niveau ?", "La progression actuelle sera abandonnée.", "Continuer", "Retour aux niveaux"],
    de: ["Dieses Level verlassen?", "Der aktuelle Versuch wird verworfen.", "Weiterspielen", "Zurück zu Level"],
    it: ["Uscire da questo livello?", "I progressi del tentativo attuale saranno persi.", "Continua", "Torna ai livelli"],
    ru: ["Покинуть этот уровень?", "Текущая попытка будет сброшена.", "Продолжить", "К уровням"],
    hi: ["यह चरण छोड़ें?", "मौजूदा प्रयास की प्रगति मिट जाएगी।", "जारी रखें", "चरणों पर लौटें"],
    ar: ["مغادرة هذه المرحلة؟", "سيتم تجاهل تقدم المحاولة الحالية.", "متابعة اللعب", "العودة إلى المراحل"]
  };

  const normalizePack = (pack, code) => {
    if (!pack) return;
    pack.start = START[code] || START.en;
    pack.stageTitle = STAGES[code] || STAGES.en;
    pack.stageMap = STAGES[code] || STAGES.en;
    pack.nextStage = NEXT[code] || NEXT.en;
    pack.replay = REPLAY[code] || REPLAY.en;
  };
  const localeCodes = window.ANIMAL_LANTERN_GUIDES_LOCALES || Object.keys(START);
  localeCodes.forEach((code) => {
    normalizePack(window.ANIMAL_LANTERN_GUIDES_COPY?.[code], code);
    normalizePack(window.LANTERN_UPGRADE_COPY?.[code], code);
  });

  const battle = document.getElementById("battleScreen");
  const canvas = battle?.querySelector(".battle-canvas");
  const result = document.getElementById("resultScreen");
  const panelHead = battle?.querySelector(".panel-head");
  const coop = battle?.querySelector(".coop-card");
  const leaveButton = document.getElementById("leaveBtn");
  const battleBack = document.getElementById("battleBackBtn");
  const stageBack = document.getElementById("stageBackBtn");
  const nextButton = document.getElementById("nextBtn");
  const replayButton = document.getElementById("replayBtn");
  const stagesButton = document.getElementById("homeBtn");
  const stageSettings = document.getElementById("stageSettingsBtn");
  const battleSettings = document.getElementById("battleSettingsBtn");
  const runtime = () => window.__LANTERN_INTERFACE7__;

  [stageSettings, battleSettings, leaveButton].forEach((node) => {
    if (!node) return;
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.tabIndex = -1;
  });

  battleBack?.setAttribute("aria-label", window.ANIMAL_LANTERN_GUIDES_COPY?.en?.back || "Back");
  stageBack?.setAttribute("aria-label", window.ANIMAL_LANTERN_GUIDES_COPY?.en?.back || "Back");

  if (canvas && result) {
    result.removeAttribute("data-screen");
    result.dataset.wpBattleSubstate = "result";
    canvas.append(result);
  }
  const actions = result?.querySelector(".result-actions");
  if (actions && stagesButton && nextButton && replayButton) actions.append(stagesButton, nextButton, replayButton);

  const setBattleCovered = (covered) => {
    [panelHead, coop, leaveButton].forEach((node) => { if (node) node.inert = covered; });
  };
  const normalizeResultActions = () => {
    if (!result || result.hidden || battle?.dataset.wpBattleSubstate !== "result") return;
    const state = runtime()?.getState?.() || window.__LANTERN_TEST__?.getState?.();
    const unavailable = !state || Number(state.stageIndex) >= 29 || Number(state.light) <= 0;
    nextButton.hidden = false;
    nextButton.disabled = unavailable;
    nextButton.setAttribute("aria-disabled", String(unavailable));
  };
  let normalizingNext = false;
  if (nextButton) {
    new MutationObserver(() => {
      if (normalizingNext || result?.hidden || battle?.dataset.wpBattleSubstate !== "result") return;
      normalizingNext = true;
      normalizeResultActions();
      queueMicrotask(() => { normalizingNext = false; });
    }).observe(nextButton, { attributes: true, attributeFilter: ["hidden", "disabled"] });
  }

  let leaveDialog = null;
  let bypassLeaveGuard = false;
  const locale = () => {
    const code = document.documentElement.lang || "en";
    return LEAVE[code] ? code : "en";
  };
  const closeLeave = ({ resume = true, restoreFocus = true } = {}) => {
    if (!leaveDialog || leaveDialog.hidden) return;
    leaveDialog.hidden = true;
    setBattleCovered(false);
    if (resume) runtime()?.resumeSettlement?.();
    if (restoreFocus) battleBack?.focus({ preventScroll: true });
  };
  const buildLeaveDialog = () => {
    if (leaveDialog || !canvas) return leaveDialog;
    leaveDialog = document.createElement("div");
    leaveDialog.className = "wp-lantern-leave-dialog";
    leaveDialog.hidden = true;
    leaveDialog.setAttribute("role", "dialog");
    leaveDialog.setAttribute("aria-modal", "true");
    leaveDialog.innerHTML = `<div class="wp-lantern-leave-card"><h2 data-leave-title></h2><p data-leave-context></p><p data-leave-body></p><div class="wp-lantern-leave-actions"><button type="button" data-leave-continue></button><button type="button" data-leave-confirm></button></div></div>`;
    canvas.append(leaveDialog);
    const continueButton = leaveDialog.querySelector("[data-leave-continue]");
    const confirmButton = leaveDialog.querySelector("[data-leave-confirm]");
    continueButton.addEventListener("click", () => closeLeave());
    confirmButton.addEventListener("click", () => {
      closeLeave({ resume: false, restoreFocus: false });
      runtime()?.cancelSettlement?.();
      bypassLeaveGuard = true;
      battleBack?.click();
      bypassLeaveGuard = false;
    });
    leaveDialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeave();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [continueButton, confirmButton].filter((node) => !node.disabled);
      if (!focusables.length) return;
      const index = focusables.indexOf(document.activeElement);
      const next = event.shiftKey ? (index <= 0 ? focusables.length - 1 : index - 1) : (index >= focusables.length - 1 ? 0 : index + 1);
      event.preventDefault();
      focusables[next].focus();
    });
    return leaveDialog;
  };
  const openLeave = () => {
    const state = runtime()?.getState?.() || window.__LANTERN_TEST__?.getState?.();
    if (!state) return;
    const pending = Boolean(runtime()?.settlementPending?.() || state.settlementPending);
    const dirty = pending || Number(state.bridgeStep) > 0 || Boolean(state.clueVisible) || state.phase !== "scout" || Number(state.light) < 3;
    if (!dirty) {
      bypassLeaveGuard = true;
      battleBack?.click();
      bypassLeaveGuard = false;
      return;
    }
    const dialog = buildLeaveDialog();
    if (!dialog) return;
    runtime()?.pauseSettlement?.();
    const copy = LEAVE[locale()] || LEAVE.en;
    dialog.querySelector("[data-leave-title]").textContent = copy[0];
    dialog.querySelector("[data-leave-context]").textContent = `${(STAGES[locale()] || STAGES.en)} ${Number(state.stageIndex) + 1} / 30`;
    dialog.querySelector("[data-leave-body]").textContent = copy[1];
    dialog.querySelector("[data-leave-continue]").textContent = copy[2];
    dialog.querySelector("[data-leave-confirm]").textContent = copy[3];
    document.getElementById("settingsPanel")?.setAttribute("hidden", "");
    setBattleCovered(true);
    dialog.hidden = false;
    dialog.querySelector("[data-leave-continue]")?.focus({ preventScroll: true });
  };

  const startButton = document.getElementById("startBtn");
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("#startBtn") !== startButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // Stage-owning games always route the single Main action through Stage.
    stagesButton?.click();
  }, true);

  document.addEventListener("click", (event) => {
    if (bypassLeaveGuard || event.target?.closest?.("#battleBackBtn") !== battleBack) return;
    if (document.body.dataset.screen !== "battle" || battle?.dataset.wpBattleSubstate === "result") return;
    const state = runtime()?.getState?.() || window.__LANTERN_TEST__?.getState?.();
    const pending = Boolean(runtime()?.settlementPending?.() || state?.settlementPending);
    const dirty = state && (pending || Number(state.bridgeStep) > 0 || Boolean(state.clueVisible) || state.phase !== "scout" || Number(state.light) < 3);
    if (!dirty) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLeave();
  }, true);

  const syncSceneOwnership = () => {
    const resultActive = battle?.dataset.wpBattleSubstate === "result" && result && !result.hidden;
    if (resultActive) {
      closeLeave({ resume: false, restoreFocus: false });
      setBattleCovered(true);
      document.body.dataset.screen = "battle";
      normalizeResultActions();
      return;
    }
    if (document.body.dataset.screen === "battle") {
      setBattleCovered(false);
      closeLeave({ resume: false, restoreFocus: false });
      return;
    }
    setBattleCovered(false);
    closeLeave({ resume: false, restoreFocus: false });
  };
  new MutationObserver(syncSceneOwnership).observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  window.addEventListener("weightplay:lantern-scene", syncSceneOwnership);

  const syncLabels = () => {
    const code = document.documentElement.lang || "en";
    battleBack?.setAttribute("aria-label", window.ANIMAL_LANTERN_GUIDES_COPY?.[code]?.back || "Back");
    stageBack?.setAttribute("aria-label", window.ANIMAL_LANTERN_GUIDES_COPY?.[code]?.back || "Back");
  };
  new MutationObserver(syncLabels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  syncLabels();
})();
