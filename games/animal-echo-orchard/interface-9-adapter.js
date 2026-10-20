(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const copy = {
    en: ["Leave this stage?", "Your current echo attempt will be discarded. Cleared stages stay saved.", "Continue", "Return to Stages"],
    "zh-Hant": ["要離開這一關嗎？", "目前的回聲嘗試會被放棄，已完成的關卡仍會保留。", "繼續遊戲", "返回關卡"],
    "zh-Hans": ["要离开这一关吗？", "当前回声尝试会被放弃，已完成的关卡仍会保留。", "继续游戏", "返回关卡"],
    ja: ["このステージを離れますか？", "現在のエコー挑戦は破棄されます。クリア済みのステージは保存されます。", "続ける", "ステージへ戻る"],
    ko: ["이 스테이지를 나갈까요?", "현재 메아리 시도는 사라집니다. 완료한 스테이지는 저장됩니다.", "계속", "스테이지로 돌아가기"],
    es: ["¿Salir de esta etapa?", "Se descartará el intento actual. Las etapas completadas seguirán guardadas.", "Continuar", "Volver a las etapas"],
    "pt-BR": ["Sair desta fase?", "A tentativa atual será descartada. As fases concluídas continuarão salvas.", "Continuar", "Voltar às fases"],
    fr: ["Quitter cette étape ?", "La tentative en cours sera abandonnée. Les étapes terminées resteront enregistrées.", "Continuer", "Retour aux étapes"],
    de: ["Diese Stufe verlassen?", "Der aktuelle Echo-Versuch wird verworfen. Abgeschlossene Stufen bleiben gespeichert.", "Weiterspielen", "Zurück zu den Stufen"],
    it: ["Uscire da questa fase?", "Il tentativo attuale verrà annullato. Le fasi completate resteranno salvate.", "Continua", "Torna alle fasi"],
    ru: ["Выйти с этого уровня?", "Текущая попытка будет отменена. Пройденные уровни останутся сохранены.", "Продолжить", "К уровням"],
    hi: ["यह स्तर छोड़ें?", "मौजूदा इको प्रयास रद्द हो जाएगा। पूरे किए गए स्तर सुरक्षित रहेंगे।", "जारी रखें", "स्तरों पर लौटें"],
    ar: ["مغادرة هذه المرحلة؟", "ستُلغى محاولة الصدى الحالية، وستبقى المراحل المكتملة محفوظة.", "متابعة اللعب", "العودة إلى المراحل"]
  };

  let frame = null;
  let stageSelector = null;
  let selectedStage = 0;
  let battleDirty = false;
  let allowBack = false;
  let leaveDialog = null;
  let coveredNodes = [];

  function labels() {
    return copy[document.documentElement.lang] || copy.en;
  }

  function syncDialogCopy() {
    if (!leaveDialog) return;
    const text = labels();
    leaveDialog.querySelector("[data-echo-leave-title]").textContent = text[0];
    leaveDialog.querySelector("[data-echo-leave-copy]").textContent = text[1];
    leaveDialog.querySelector("[data-echo-continue]").textContent = text[2];
    leaveDialog.querySelector("[data-echo-leave]").textContent = text[3];
  }

  function ensureLeaveDialog() {
    const battle = $("battleScreen");
    if (!battle || leaveDialog) return;
    leaveDialog = document.createElement("div");
    leaveDialog.className = "echo-leave-dialog";
    leaveDialog.hidden = true;
    leaveDialog.setAttribute("role", "dialog");
    leaveDialog.setAttribute("aria-modal", "true");
    leaveDialog.setAttribute("aria-labelledby", "echoLeaveTitle");
    leaveDialog.setAttribute("aria-describedby", "echoLeaveCopy");
    leaveDialog.innerHTML = '<div class="echo-leave-card"><h2 id="echoLeaveTitle" data-echo-leave-title></h2><p id="echoLeaveCopy" data-echo-leave-copy></p><div class="echo-leave-actions"><button type="button" class="secondary" data-echo-continue></button><button type="button" class="primary" data-echo-leave></button></div></div>';
    battle.append(leaveDialog);
    leaveDialog.querySelector("[data-echo-continue]").addEventListener("click", closeLeaveDialog);
    leaveDialog.querySelector("[data-echo-leave]").addEventListener("click", confirmLeave);
    leaveDialog.addEventListener("keydown", trapLeaveFocus);
    syncDialogCopy();
  }

  function mutableBattle() {
    const state = window.__ECHO_ORCHARD_TEST__?.getState?.();
    if (!state || state.phase === "complete" || state.phase === "result") return false;
    return battleDirty || state.entered.length > 0;
  }

  function openLeaveDialog() {
    if (!leaveDialog || !leaveDialog.hidden) return;
    syncDialogCopy();
    coveredNodes = [...$("battleScreen").children].filter((node) => node !== leaveDialog && !node.hidden);
    coveredNodes.forEach((node) => { node.inert = true; });
    leaveDialog.hidden = false;
    leaveDialog.querySelector("[data-echo-continue]").focus({ preventScroll: true });
  }

  function closeLeaveDialog() {
    if (!leaveDialog || leaveDialog.hidden) return;
    leaveDialog.hidden = true;
    coveredNodes.forEach((node) => { node.inert = false; });
    coveredNodes = [];
    $("battleBackBtn")?.focus({ preventScroll: true });
  }

  function confirmLeave() {
    closeLeaveDialog();
    battleDirty = false;
    allowBack = true;
    try { $("battleBackBtn")?.click(); }
    finally { allowBack = false; }
  }

  function trapLeaveFocus(event) {
    if (!leaveDialog || leaveDialog.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLeaveDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...leaveDialog.querySelectorAll("button:not([disabled])")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function syncScene(event) {
    const detail = event?.detail || {};
    const screen = detail.screen || document.body.dataset.screen || "main";
    const scene = detail.scene || (screen === "result" ? "battle" : screen);
    frame?.activate(scene);
    if (screen === "result") {
      battleDirty = false;
      requestAnimationFrame(() => $("resultTitle")?.focus({ preventScroll: true }));
    } else if (scene !== "battle") {
      battleDirty = false;
      closeLeaveDialog();
    } else if (screen === "battle") {
      battleDirty = false;
    }
  }

  function init() {
    const api = window.__ECHO_ORCHARD_TEST__;
    if (!api || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) return;

    const root = $("app");
    const main = $("mainScreen");
    const stage = $("stageScreen");
    const battle = $("battleScreen");
    const localeSelect = $("localeSelect");
    const stageHeaderInfo = $("stageHeaderStats");
    const battleHeaderInfo = $("battleHeaderStats");
    stageHeaderInfo.remove();
    battleHeaderInfo.remove();

    frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: $("mainHeader"), content: $("mainContent") },
        stage: { root: stage, header: $("stageHeader"), content: $("stageWorkspace"), headerInfo: stageHeaderInfo },
        battle: { root: battle, header: $("battleHeader"), content: $("battleContent"), headerInfo: battleHeaderInfo }
      }
    });

    const stageInfo = window.WeightPlayScreenFrame.createGroup().add(stageHeaderInfo.firstElementChild);
    frame.stageTopUI.add(stageInfo);
    const battleInfo = window.WeightPlayScreenFrame.createGroup().add(battleHeaderInfo.firstElementChild).add(battleHeaderInfo.lastElementChild);
    frame.battleTopUI.add(battleInfo);
    frame.commonDownButton.clear();

    const saved = api.getState();
    selectedStage = Math.max(0, Math.min(api.groves.length - 1, Math.max(saved.groveIndex, saved.unlockedThrough - 1)));
    stageSelector = window.WeightPlayPlayUI.mountStage({
      page: $("stageWorkspace"),
      rail: $("stageList"),
      config: {
        gameId: "animal-echo-orchard",
        count: api.groves.length,
        background: "/assets/lobby-block-atmosphere.svg",
        stage: (index) => api.stageRecord(index)
      },
      selected: selectedStage,
      isActive: () => document.body.dataset.screen === "stage",
      onSelect(index) { selectedStage = index; },
      onStart(index) { selectedStage = index; api.startGrove(index, true); }
    });

    window.__ECHO_ORCHARD_I9__ = Object.freeze({
      refreshStage() {
        selectedStage = Math.max(0, Math.min(api.groves.length - 1, selectedStage));
        stageSelector?.refresh(selectedStage);
        $("stageSummary").textContent = api.stageSummary();
      },
      selected: () => selectedStage
    });

    ensureLeaveDialog();
    $("orchardButtons")?.addEventListener("click", (event) => {
      if (event.target.closest(".fruit-button:not(:disabled)")) battleDirty = true;
    }, true);
    $("resetBtn")?.addEventListener("click", () => queueMicrotask(() => { battleDirty = false; }), true);
    $("resultReplayBtn")?.addEventListener("click", () => queueMicrotask(() => { battleDirty = false; }), true);
    $("battleBackBtn")?.addEventListener("click", (event) => {
      if (allowBack || !mutableBattle()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openLeaveDialog();
    }, true);
    window.addEventListener("weightplay:orchard-screen-change", syncScene);
    window.addEventListener("wonder:locale-change", syncDialogCopy);
    localeSelect?.addEventListener("change", () => queueMicrotask(syncDialogCopy));
    window.addEventListener("pagehide", (event) => { if (!event.persisted) { stageSelector?.destroy(); frame?.destroy(); } });
    syncScene();
    window.__ECHO_ORCHARD_I9__.refreshStage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => queueMicrotask(init), { once: true });
  else queueMicrotask(init);
})();
