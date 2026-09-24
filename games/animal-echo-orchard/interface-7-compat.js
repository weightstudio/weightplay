(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const LABELS = {
    en: { start: "Start Game", stages: "Stages", next: "Next Stage", replay: "Replay", leaveTitle: "Leave this stage?", leaveBody: "Your current echo attempt will be discarded. Cleared stages stay saved.", keep: "Continue", leave: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", next: "下一關", replay: "重玩", leaveTitle: "要離開這一關嗎？", leaveBody: "目前的回聲嘗試會被放棄，已完成的關卡仍會保留。", keep: "繼續遊戲", leave: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", next: "下一关", replay: "重玩", leaveTitle: "要离开这一关吗？", leaveBody: "当前的回声尝试会被放弃，已完成的关卡仍会保留。", keep: "继续游戏", leave: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", next: "次のステージ", replay: "リプレイ", leaveTitle: "このステージを離れますか？", leaveBody: "現在のエコー挑戦は破棄されます。クリア済みのステージは保存されます。", keep: "続ける", leave: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", next: "다음 스테이지", replay: "다시 하기", leaveTitle: "이 스테이지를 나갈까요?", leaveBody: "현재 메아리 시도는 사라집니다. 완료한 스테이지는 저장됩니다.", keep: "계속", leave: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Niveles", next: "Siguiente nivel", replay: "Repetir", leaveTitle: "¿Salir de este nivel?", leaveBody: "Se descartará el intento actual. Los niveles completados seguirán guardados.", keep: "Continuar", leave: "Volver a niveles" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", next: "Próxima fase", replay: "Jogar novamente", leaveTitle: "Sair desta fase?", leaveBody: "A tentativa atual será descartada. As fases concluídas continuarão salvas.", keep: "Continuar", leave: "Voltar às fases" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", next: "Niveau suivant", replay: "Rejouer", leaveTitle: "Quitter ce niveau ?", leaveBody: "La tentative en cours sera abandonnée. Les niveaux terminés resteront enregistrés.", keep: "Continuer", leave: "Retour aux niveaux" },
    de: { start: "Spiel starten", stages: "Level", next: "Nächstes Level", replay: "Nochmal", leaveTitle: "Dieses Level verlassen?", leaveBody: "Der aktuelle Echo-Versuch wird verworfen. Abgeschlossene Level bleiben gespeichert.", keep: "Weiterspielen", leave: "Zurück zu den Levels" },
    it: { start: "Avvia gioco", stages: "Livelli", next: "Livello successivo", replay: "Rigioca", leaveTitle: "Uscire da questo livello?", leaveBody: "Il tentativo attuale verrà annullato. I livelli completati resteranno salvati.", keep: "Continua", leave: "Torna ai livelli" },
    ru: { start: "Начать игру", stages: "Уровни", next: "Следующий уровень", replay: "Повторить", leaveTitle: "Выйти из уровня?", leaveBody: "Текущая попытка будет отменена. Пройденные уровни останутся сохранены.", keep: "Продолжить", leave: "К уровням" },
    hi: { start: "खेल शुरू करें", stages: "स्तर", next: "अगला स्तर", replay: "फिर खेलें", leaveTitle: "यह स्तर छोड़ें?", leaveBody: "मौजूदा इको प्रयास रद्द हो जाएगा। पूरे किए गए स्तर सुरक्षित रहेंगे।", keep: "जारी रखें", leave: "स्तरों पर लौटें" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", next: "المرحلة التالية", replay: "إعادة اللعب", leaveTitle: "مغادرة هذه المرحلة؟", leaveBody: "ستُلغى محاولة الصدى الحالية، وستبقى المراحل المكتملة محفوظة.", keep: "متابعة اللعب", leave: "العودة إلى المراحل" }
  };

  let battleDirty = false;
  let allowLegacyLeave = false;
  let resultActive = false;
  let normalizingResult = false;
  let leaveDialog = null;
  let coveredNodes = [];
  let resultObserver = null;
  let bodyObserver = null;

  function localeKey() {
    const raw = $("localeSelect")?.value || document.documentElement.lang || "en";
    return LABELS[raw] ? raw : "en";
  }

  function labels() { return LABELS[localeKey()] || LABELS.en; }
  function textNode(node, value) { if (node && node.textContent !== value) node.textContent = value; }

  function normalizeCopy() {
    const text = labels();
    textNode($("startBtn"), text.start);
    textNode(document.querySelector("[data-echo-stage-tab]"), text.stages);
    textNode($("resultMapBtn"), text.stages);
    textNode($("nextBtn"), text.next);
    textNode($("resultReplayBtn"), text.replay);
    if (leaveDialog) {
      leaveDialog.querySelector("[data-echo-leave-title]").textContent = text.leaveTitle;
      leaveDialog.querySelector("[data-echo-leave-copy]").textContent = text.leaveBody;
      textNode(leaveDialog.querySelector("[data-echo-continue]"), text.keep);
      textNode(leaveDialog.querySelector("[data-echo-leave]"), text.leave);
    }
  }

  function retireDuplicateMainRoute() {
    const map = $("mapBtn");
    if (!map) return;
    map.hidden = true;
    map.disabled = true;
    map.tabIndex = -1;
    map.setAttribute("aria-hidden", "true");
  }

  function ensureStageNav() {
    const stage = $("stageScreen");
    const rail = $("stageList");
    if (!stage || !rail) return;
    rail.dataset.wpStageV6Auto = "true";
    rail.dataset.wpStageV6Total = "30";
    rail.dataset.wpStageV6PoolSize = "9";
    if (window.WeightPlayStageV6 && rail.dataset.wpStageVirtualizationInstalled !== "true") {
      window.WeightPlayStageV6.install(rail, {
        total: 30,
        poolSize: 9,
        index: (card, fallback) => {
          const index = Number(card.dataset.groveIndex);
          return Number.isFinite(index) ? index : fallback;
        }
      });
    }
    if (!stage.querySelector(".echo-stage-nav")) {
      const nav = document.createElement("nav");
      nav.className = "echo-stage-nav";
      nav.setAttribute("aria-label", labels().stages);
      nav.innerHTML = '<span aria-hidden="true"></span><button type="button" role="tab" aria-selected="true" data-echo-stage-tab></button><span aria-hidden="true"></span>';
      stage.appendChild(nav);
    }
    normalizeCopy();
  }

  function ensureLeaveDialog() {
    const battle = $("battleScreen");
    if (!battle || leaveDialog) return;
    leaveDialog = document.createElement("div");
    leaveDialog.className = "echo-leave-dialog";
    leaveDialog.hidden = true;
    leaveDialog.setAttribute("role", "dialog");
    leaveDialog.setAttribute("aria-modal", "true");
    leaveDialog.innerHTML = '<div class="echo-leave-card"><h2 data-echo-leave-title></h2><p data-echo-leave-copy></p><div class="echo-leave-actions"><button type="button" class="secondary" data-echo-continue></button><button type="button" class="primary" data-echo-leave></button></div></div>';
    battle.appendChild(leaveDialog);
    leaveDialog.querySelector("[data-echo-continue]").addEventListener("click", closeLeaveDialog);
    leaveDialog.querySelector("[data-echo-leave]").addEventListener("click", confirmLeave);
    leaveDialog.addEventListener("keydown", trapLeaveFocus);
    normalizeCopy();
  }

  function mutableBattle() {
    const state = window.__ECHO_ORCHARD_TEST__?.getState?.();
    if (!state) return battleDirty;
    if (state.phase === "complete" || state.phase === "result") return false;
    return battleDirty || state.entered.length > 0;
  }

  function openLeaveDialog() {
    if (!leaveDialog || !leaveDialog.hidden) return;
    normalizeCopy();
    const battle = $("battleScreen");
    coveredNodes = [...battle.children].filter((node) => node !== leaveDialog && !node.hidden);
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
    allowLegacyLeave = true;
    try { $("battleBackBtn")?.click(); }
    finally { allowLegacyLeave = false; }
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
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function ensureResultSubstate() {
    const battle = $("battleScreen");
    const result = $("resultScreen");
    if (!battle || !result) return;
    if (result.parentElement !== battle) battle.appendChild(result);
    result.removeAttribute("data-screen");
    result.dataset.wpBattleSubstate = "result";
    const actions = result.querySelector(".main-actions");
    if (actions && !$("resultReplayBtn")) {
      const replay = document.createElement("button");
      replay.id = "resultReplayBtn";
      replay.className = "secondary";
      replay.type = "button";
      replay.addEventListener("click", () => $("resetBtn")?.click());
      actions.appendChild(replay);
    }
    if (actions && $("resultMapBtn") && $("nextBtn") && $("resultReplayBtn")) {
      actions.replaceChildren($("resultMapBtn"), $("nextBtn"), $("resultReplayBtn"));
    }
    if (!resultObserver) {
      resultObserver = new MutationObserver(() => { if (resultActive) queueMicrotask(normalizeResult); });
      resultObserver.observe(result, { attributes: true, subtree: true, childList: true, attributeFilter: ["hidden", "disabled", "aria-disabled"] });
    }
    normalizeCopy();
  }

  function normalizeResult() {
    if (normalizingResult || !resultActive) return;
    normalizingResult = true;
    const state = window.__ECHO_ORCHARD_TEST__?.getState?.();
    const isFinal = Boolean(state && state.groveIndex >= 29);
    const map = $("resultMapBtn");
    const next = $("nextBtn");
    const replay = $("resultReplayBtn");
    if (map) { map.hidden = false; map.disabled = false; map.removeAttribute("aria-disabled"); }
    if (next) {
      next.hidden = false;
      next.disabled = isFinal;
      next.setAttribute("aria-disabled", String(isFinal));
    }
    if (replay) { replay.hidden = false; replay.disabled = false; }
    normalizeCopy();
    normalizingResult = false;
  }

  function syncScene() {
    const scene = document.body.dataset.screen;
    const battle = $("battleScreen");
    const result = $("resultScreen");
    if (!battle || !result) return;
    if (scene === "result") {
      resultActive = true;
      battle.hidden = false;
      battle.classList.add("echo-result-active");
      battle.dataset.wpBattleSubstate = "result";
      result.hidden = false;
      battleDirty = false;
      queueMicrotask(normalizeResult);
      try {
        window.dispatchEvent(new CustomEvent("weightplay:screen-change", { detail: { screen: "battle", node: battle, owner: battle.parentElement } }));
      } catch { /* optional frame/analytics notice */ }
      return;
    }
    if (resultActive) {
      resultActive = false;
      result.hidden = true;
      battle.classList.remove("echo-result-active");
      delete battle.dataset.wpBattleSubstate;
    }
    if (scene === "battle") battleDirty = false;
    if (!leaveDialog?.hidden) closeLeaveDialog();
  }

  function bindSafety() {
    $("orchardButtons")?.addEventListener("click", (event) => {
      if (event.target.closest(".fruit-button:not(:disabled)")) battleDirty = true;
    }, true);
    $("resetBtn")?.addEventListener("click", () => queueMicrotask(() => { battleDirty = false; }), true);
    $("battleBackBtn")?.addEventListener("click", (event) => {
      if (allowLegacyLeave || !mutableBattle()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openLeaveDialog();
    }, true);
  }

  function init() {
    retireDuplicateMainRoute();
    ensureStageNav();
    ensureLeaveDialog();
    ensureResultSubstate();
    bindSafety();
    normalizeCopy();
    syncScene();
    $("localeSelect")?.addEventListener("change", () => queueMicrotask(normalizeCopy));
    window.addEventListener("wonder:locale-change", () => queueMicrotask(normalizeCopy));
    bodyObserver = new MutationObserver(syncScene);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => queueMicrotask(init), { once: true });
  else queueMicrotask(init);
})();