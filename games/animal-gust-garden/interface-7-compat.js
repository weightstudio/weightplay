(function () {
  "use strict";

  const GAME_ID = "animal-gust-garden";
  if (document.body?.dataset.wpGameId !== GAME_ID) return;

  const START = {
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작",
    es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Démarrer le jeu", de: "Spiel starten",
    it: "Avvia gioco", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة"
  };
  const STAGES = {
    en: "Stages", "zh-Hant": "關卡", "zh-Hans": "关卡", ja: "ステージ", ko: "스테이지",
    es: "Niveles", "pt-BR": "Fases", fr: "Niveaux", de: "Stufen", it: "Livelli",
    ru: "Уровни", hi: "स्तर", ar: "المراحل"
  };
  const NEXT = {
    en: "Next Stage", "zh-Hant": "下一關", "zh-Hans": "下一关", ja: "次のステージ", ko: "다음 스테이지",
    es: "Siguiente nivel", "pt-BR": "Próxima fase", fr: "Niveau suivant", de: "Nächste Stufe",
    it: "Livello successivo", ru: "Следующий уровень", hi: "अगला स्तर", ar: "المرحلة التالية"
  };
  const REPLAY = {
    en: "Replay", "zh-Hant": "重玩", "zh-Hans": "重玩", ja: "もう一度", ko: "다시 플레이",
    es: "Repetir", "pt-BR": "Jogar novamente", fr: "Rejouer", de: "Nochmal spielen",
    it: "Rigioca", ru: "Повторить", hi: "फिर खेलें", ar: "إعادة اللعب"
  };
  const LEAVE = {
    en: ["Leave this stage?", "Continue keeps your current garden. Returning to Stages ends this attempt.", "Continue", "Return to Stages"],
    "zh-Hant": ["離開這一關？", "繼續會保留目前花園；返回關卡會結束這次嘗試。", "繼續", "返回關卡"],
    "zh-Hans": ["离开这一关？", "继续会保留当前花园；返回关卡会结束这次尝试。", "继续", "返回关卡"],
    ja: ["このステージを離れますか？", "続けると現在の庭を保持します。ステージに戻ると今回の挑戦は終了します。", "続ける", "ステージへ戻る"],
    ko: ["이 스테이지를 나갈까요?", "계속하면 현재 정원이 유지됩니다. 스테이지로 돌아가면 이번 도전이 끝납니다.", "계속", "스테이지로 돌아가기"],
    es: ["¿Salir de este nivel?", "Continuar conserva el jardín actual. Volver a Niveles termina este intento.", "Continuar", "Volver a Niveles"],
    "pt-BR": ["Sair desta fase?", "Continuar mantém o jardim atual. Voltar às Fases encerra esta tentativa.", "Continuar", "Voltar às Fases"],
    fr: ["Quitter ce niveau ?", "Continuer conserve le jardin actuel. Revenir aux Niveaux termine cette tentative.", "Continuer", "Retour aux Niveaux"],
    de: ["Diese Stufe verlassen?", "Fortfahren behält den aktuellen Garten. Zurück zu Stufen beendet diesen Versuch.", "Fortfahren", "Zurück zu Stufen"],
    it: ["Uscire da questo livello?", "Continuare mantiene il giardino attuale. Tornare ai Livelli termina questo tentativo.", "Continua", "Torna ai Livelli"],
    ru: ["Выйти из уровня?", "Продолжение сохранит текущий сад. Возврат к уровням завершит эту попытку.", "Продолжить", "К уровням"],
    hi: ["यह स्तर छोड़ें?", "जारी रखने पर मौजूदा बगीचा बना रहेगा। स्तरों पर लौटने से यह प्रयास समाप्त होगा।", "जारी रखें", "स्तरों पर लौटें"],
    ar: ["مغادرة هذه المرحلة؟", "المتابعة تحفظ الحديقة الحالية. الرجوع إلى المراحل ينهي هذه المحاولة.", "متابعة", "العودة إلى المراحل"]
  };

  const style = document.createElement("style");
  style.id = "gustGardenInterface7Cleanup";
  style.textContent = `
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #mainScreen {
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #mainScreen > .eyebrow,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #mainScreen > h1,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #mainScreen .cover-badge,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #mainScreen .facts,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #chooseButton,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #bestText {
      display: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #startButton {
      box-sizing: border-box !important;
      width: 100% !important;
      height: 52px !important;
      min-height: 52px !important;
      max-height: 52px !important;
      padding-inline: 16px !important;
      font-size: 16px !important;
      line-height: 1.2 !important;
      font-weight: 800 !important;
      white-space: nowrap !important;
    }

    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-canvas {
      grid-template-rows: 48px minmax(0, 1fr) 56px !important;
      gap: 8px !important;
      padding: 12px !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-header {
      min-height: 48px !important;
      height: 48px !important;
      grid-template-columns: 48px minmax(0, 1fr) 48px !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-header > div,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-intro {
      display: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-canvas > div:nth-child(2) {
      min-height: 0 !important;
      overflow: hidden !important;
      display: grid !important;
      align-items: center !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-rail {
      display: flex !important;
      flex-flow: row nowrap !important;
      align-items: center !important;
      gap: 12px !important;
      min-height: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 12px max(12px, calc((100% - 264px) / 2)) !important;
      overflow-x: hidden !important;
      overflow-y: hidden !important;
      scroll-snap-type: none !important;
      overscroll-behavior-inline: contain !important;
      touch-action: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-rail > .stage-card {
      flex: 0 0 264px !important;
      width: 264px !important;
      min-width: 264px !important;
      max-width: 264px !important;
      height: 190px !important;
      min-height: 190px !important;
      max-height: 190px !important;
      scroll-snap-align: center !important;
      scroll-snap-stop: normal !important;
      align-content: center !important;
      padding: 16px !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-tabs {
      min-height: 56px !important;
      height: 56px !important;
      max-height: 56px !important;
      padding: 6px !important;
      gap: 8px !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-tabs > button {
      height: 44px !important;
      min-height: 44px !important;
      max-height: 44px !important;
      padding-inline: 10px !important;
      font-size: 14px !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
      overflow: visible !important;
      text-overflow: clip !important;
    }

    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-head {
      min-height: 48px !important;
      height: 48px !important;
      grid-template-columns: 48px minmax(0, 1fr) 48px !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-head .eyebrow,
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen #stageTitle {
      display: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-head > div {
      display: grid !important;
      place-items: center !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-canvas {
      padding: 12px !important;
    }

    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"][data-wp-battle-substate="result"] #battleScreen .battle-canvas > :not(#resultScreen) {
      visibility: hidden !important;
      pointer-events: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen[data-wp-battle-result] {
      position: absolute !important;
      inset: 0 !important;
      z-index: 20 !important;
      width: 100% !important;
      max-width: none !important;
      height: 100% !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 18px 16px !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: auto !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      background: rgba(20, 49, 58, .96) !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen[data-wp-battle-result][hidden] {
      display: none !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen .main-actions {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 8px !important;
      width: min(100%, 720px) !important;
      margin-inline: auto !important;
    }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen #mapButton { order: 1 !important; }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen #nextButton { order: 2 !important; }
    html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #resultScreen #replayButton { order: 3 !important; }

    #gustGardenLeaveModal {
      position: absolute;
      inset: 0;
      z-index: 40;
      display: grid;
      place-items: center;
      padding: 18px;
      background: rgba(4, 13, 17, .78);
    }
    #gustGardenLeaveModal[hidden] { display: none !important; }
    #gustGardenLeaveModal .gust-leave-card {
      width: min(100%, 420px);
      padding: 22px 20px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: #15363d;
      box-shadow: 0 20px 70px rgba(0,0,0,.45);
    }
    #gustGardenLeaveModal .gust-leave-card h2 { margin: 0 0 10px; }
    #gustGardenLeaveModal .gust-leave-card p { color: var(--muted); }
    #gustGardenLeaveModal .gust-leave-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 16px;
    }

    @media (min-width: 700px) {
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-canvas,
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-canvas {
        padding: 16px !important;
      }
    }
    @media (max-height: 900px) and (orientation: landscape) {
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-canvas {
        grid-template-rows: 48px minmax(0, 1fr) 56px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-header,
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-head {
        min-height: 48px !important;
        height: 48px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-card {
        width: 264px !important;
        min-width: 264px !important;
        max-width: 264px !important;
        height: 190px !important;
        min-height: 190px !important;
        max-height: 190px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #stageScreen .stage-tabs {
        min-height: 56px !important;
        height: 56px !important;
      }
      html[data-wp-shared-interface="7"] body[data-wp-game-id="${GAME_ID}"] #battleScreen .battle-canvas {
        grid-template-rows: 48px 36px 30px 30px 82px 48px !important;
      }
    }
  `;
  document.head.append(style);

  const lang = () => document.documentElement.lang || "en";
  const localized = (catalog) => catalog[lang()] || catalog.en;

  function normalizeLabels() {
    const start = document.getElementById("startButton");
    if (start) {
      start.removeAttribute("data-i18n");
      start.textContent = localized(START);
    }
    const stageTab = document.querySelector("#stageScreen .stage-tabs button");
    if (stageTab) {
      stageTab.removeAttribute("data-i18n");
      stageTab.textContent = localized(STAGES);
      stageTab.setAttribute("aria-label", localized(STAGES));
    }
    const map = document.getElementById("mapButton");
    if (map) {
      map.removeAttribute("data-i18n");
      map.textContent = localized(STAGES);
    }
    const next = document.getElementById("nextButton");
    if (next) {
      next.removeAttribute("data-i18n");
      next.textContent = localized(NEXT);
    }
    const replay = document.getElementById("replayButton");
    if (replay) replay.textContent = localized(REPLAY);
  }

  function ensureReplayButton() {
    const actions = document.querySelector("#resultScreen .main-actions");
    if (!actions || document.getElementById("replayButton")) return;
    const replay = document.createElement("button");
    replay.id = "replayButton";
    replay.className = "secondary";
    replay.type = "button";
    replay.textContent = localized(REPLAY);
    replay.addEventListener("click", () => {
      const oneBased = Number.parseInt(document.getElementById("progressPill")?.textContent || "1", 10) || 1;
      window.dispatchEvent(new CustomEvent("weightplay:gust-stage-activate", { detail: { index: oneBased - 1 } }));
    });
    actions.append(replay);
  }

  function moveResultIntoBattle() {
    const battleCanvas = document.querySelector("#battleScreen .battle-canvas");
    const result = document.getElementById("resultScreen");
    if (!battleCanvas || !result) return;
    if (result.parentElement !== battleCanvas) battleCanvas.append(result);
    result.dataset.wpBattleResult = "true";
    ensureReplayButton();
  }

  function enterResultSubstate() {
    moveResultIntoBattle();
    const battle = document.getElementById("battleScreen");
    const canvas = battle?.querySelector(".battle-canvas");
    const result = document.getElementById("resultScreen");
    if (!battle || !canvas || !result) return;
    battle.hidden = false;
    result.hidden = false;
    const next = document.getElementById("nextButton");
    if (next?.hidden) next.hidden = false;
    canvas.setAttribute("data-wp-result-active", "true");
    document.body.dataset.wpBattleSubstate = "result";
    if (document.body.dataset.wpActiveScreen !== "battle") document.body.dataset.wpActiveScreen = "battle";
    normalizeLabels();
    replayDirty = false;
  }

  function exitResultSubstate() {
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    canvas?.removeAttribute("data-wp-result-active");
    delete document.body.dataset.wpBattleSubstate;
  }

  let replayDirty = false;
  let leaveBypass = false;
  let leaveCoverage = [];

  function ensureLeaveModal() {
    if (document.getElementById("gustGardenLeaveModal")) return;
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    if (!canvas) return;
    const modal = document.createElement("section");
    modal.id = "gustGardenLeaveModal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `<div class="gust-leave-card"><h2 id="gustGardenLeaveTitle"></h2><p id="gustGardenLeaveText"></p><div class="gust-leave-actions"><button id="gustGardenLeaveContinue" class="primary" type="button"></button><button id="gustGardenLeaveStages" class="secondary" type="button"></button></div></div>`;
    canvas.append(modal);
    const close = () => {
      modal.hidden = true;
      setLeaveBackgroundInert(false);
      document.getElementById("battleBackButton")?.focus({ preventScroll: true });
    };
    document.getElementById("gustGardenLeaveContinue").addEventListener("click", close);
    document.getElementById("gustGardenLeaveStages").addEventListener("click", () => {
      modal.hidden = true;
      setLeaveBackgroundInert(false);
      leaveBypass = true;
      document.getElementById("battleBackButton")?.click();
      leaveBypass = false;
      replayDirty = false;
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [...modal.querySelectorAll("button:not([disabled])")];
      if (!focusables.length) return;
      event.preventDefault();
      const index = focusables.indexOf(document.activeElement);
      const next = event.shiftKey ? (index <= 0 ? focusables.length - 1 : index - 1) : (index + 1) % focusables.length;
      focusables[next].focus({ preventScroll: true });
    });
  }

  function setLeaveBackgroundInert(active) {
    const canvas = document.querySelector("#battleScreen .battle-canvas");
    if (!canvas) return;
    if (active) {
      leaveCoverage = [...canvas.children]
        .filter((child) => child.id !== "gustGardenLeaveModal")
        .map((child) => ({ child, inert: Boolean(child.inert), ariaHidden: child.getAttribute("aria-hidden") }));
      leaveCoverage.forEach(({ child }) => {
        child.inert = true;
        child.setAttribute("aria-hidden", "true");
      });
      return;
    }
    leaveCoverage.forEach(({ child, inert, ariaHidden }) => {
      child.inert = inert;
      if (ariaHidden === null) child.removeAttribute("aria-hidden");
      else child.setAttribute("aria-hidden", ariaHidden);
    });
    leaveCoverage = [];
  }

  function openLeaveModal() {
    ensureLeaveModal();
    const modal = document.getElementById("gustGardenLeaveModal");
    if (!modal) return;
    const [title, text, keep, stages] = localized(LEAVE);
    document.getElementById("gustGardenLeaveTitle").textContent = title;
    document.getElementById("gustGardenLeaveText").textContent = text;
    document.getElementById("gustGardenLeaveContinue").textContent = keep;
    document.getElementById("gustGardenLeaveStages").textContent = stages;
    setLeaveBackgroundInert(true);
    modal.hidden = false;
    document.getElementById("gustGardenLeaveContinue").focus({ preventScroll: true });
  }

  function installLeaveProtection() {
    const back = document.getElementById("battleBackButton");
    if (!back || back.dataset.wpGustLeaveProtected === "true") return;
    back.dataset.wpGustLeaveProtected = "true";
    back.addEventListener("click", (event) => {
      if (leaveBypass || !replayDirty || document.body.dataset.wpBattleSubstate === "result") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openLeaveModal();
    }, true);

    document.getElementById("grid")?.addEventListener("click", (event) => {
      if (event.target.closest(".grid-cell.seed.selectable")) replayDirty = true;
    });
    document.getElementById("directionButtons")?.addEventListener("click", (event) => {
      if (event.target.closest(".direction-button")) replayDirty = true;
    });
    document.getElementById("gustButton")?.addEventListener("click", () => { replayDirty = true; });
    document.getElementById("resetButton")?.addEventListener("click", () => { replayDirty = false; });
    document.getElementById("stageList")?.addEventListener("click", () => { replayDirty = false; }, true);
  }

  function installSharedStageController() {
    const rail = document.getElementById("stageList");
    if (!rail) return;
    rail.removeAttribute("data-wp-stage-v6-auto");
    rail.removeAttribute("data-wp-stage-v6-total");
    rail.removeAttribute("data-wp-stage-v6-pool-size");
  }

  function syncScene() {
    normalizeLabels();
    const screen = document.body.dataset.wpActiveScreen;
    const result = document.getElementById("resultScreen");
    if (screen === "result") {
      enterResultSubstate();
      return;
    }
    if (screen !== "battle" || result?.hidden) exitResultSubstate();
  }

  function install() {
    moveResultIntoBattle();
    normalizeLabels();
    ensureLeaveModal();
    installLeaveProtection();
    installSharedStageController();

    const bodyObserver = new MutationObserver(syncScene);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["data-wp-active-screen"] });

    const localeObserver = new MutationObserver(normalizeLabels);
    localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    syncScene();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
}());
