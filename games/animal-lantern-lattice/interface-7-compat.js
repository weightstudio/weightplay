(() => {
  "use strict";

  const aliases = {
    "zh-tw": "zh-Hant",
    "zh-cn": "zh-Hans",
    "pt-br": "pt-BR"
  };

  const labels = {
    en: {
      start: "Start Game", stages: "Stages", replay: "Replay", next: "Next stage",
      backMain: "Back to Main", backStages: "Back to Stages",
      leaveTitle: "Leave this night path?",
      leaveBody: "Your current lantern chain and checks for this path will be lost. Cleared stages and saved best results stay saved.",
      continue: "Continue playing", leave: "Return to Stages"
    },
    "zh-Hant": {
      start: "開始遊戲", stages: "關卡", replay: "重新遊玩", next: "下一關",
      backMain: "返回主畫面", backStages: "返回關卡",
      leaveTitle: "要離開這條夜路嗎？",
      leaveBody: "這一關目前的燈籠連線與檢查次數會消失；已完成關卡與最佳紀錄仍會保留。",
      continue: "繼續遊玩", leave: "返回關卡"
    },
    "zh-Hans": {
      start: "开始游戏", stages: "关卡", replay: "重新游玩", next: "下一关",
      backMain: "返回主画面", backStages: "返回关卡",
      leaveTitle: "要离开这条夜路吗？",
      leaveBody: "这一关当前的灯笼连线与检查次数会丢失；已完成关卡与最佳记录仍会保留。",
      continue: "继续游玩", leave: "返回关卡"
    },
    ja: {
      start: "ゲーム開始", stages: "ステージ", replay: "もう一度", next: "次のステージ",
      backMain: "メインに戻る", backStages: "ステージに戻る",
      leaveTitle: "この夜道を離れますか？",
      leaveBody: "このステージの現在のランタン列とチェック回数は失われます。クリア済みステージとベスト記録は保存されます。",
      continue: "続ける", leave: "ステージに戻る"
    },
    ko: {
      start: "게임 시작", stages: "스테이지", replay: "다시 플레이", next: "다음 스테이지",
      backMain: "메인으로", backStages: "스테이지로",
      leaveTitle: "이 밤길을 나갈까요?",
      leaveBody: "이 스테이지의 현재 랜턴 연결과 확인 횟수는 사라집니다. 완료한 스테이지와 최고 기록은 저장됩니다.",
      continue: "계속 플레이", leave: "스테이지로 돌아가기"
    },
    es: {
      start: "Iniciar juego", stages: "Niveles", replay: "Repetir", next: "Siguiente nivel",
      backMain: "Volver al inicio", backStages: "Volver a niveles",
      leaveTitle: "¿Salir de este sendero nocturno?",
      leaveBody: "Se perderán la cadena de faroles y las comprobaciones actuales de este nivel. Los niveles completados y los mejores resultados seguirán guardados.",
      continue: "Seguir jugando", leave: "Volver a niveles"
    },
    "pt-BR": {
      start: "Iniciar jogo", stages: "Fases", replay: "Jogar de novo", next: "Próxima fase",
      backMain: "Voltar ao início", backStages: "Voltar às fases",
      leaveTitle: "Sair deste caminho noturno?",
      leaveBody: "A corrente de lanternas e as verificações atuais desta fase serão perdidas. Fases concluídas e melhores resultados continuarão salvos.",
      continue: "Continuar jogando", leave: "Voltar às fases"
    },
    fr: {
      start: "Commencer", stages: "Niveaux", replay: "Rejouer", next: "Niveau suivant",
      backMain: "Retour à l’accueil", backStages: "Retour aux niveaux",
      leaveTitle: "Quitter ce chemin nocturne ?",
      leaveBody: "La chaîne de lanternes et les vérifications en cours pour ce niveau seront perdues. Les niveaux terminés et les meilleurs résultats resteront enregistrés.",
      continue: "Continuer", leave: "Retour aux niveaux"
    },
    de: {
      start: "Spiel starten", stages: "Stufen", replay: "Noch einmal", next: "Nächste Stufe",
      backMain: "Zurück zum Start", backStages: "Zurück zu Stufen",
      leaveTitle: "Diesen Nachtpfad verlassen?",
      leaveBody: "Die aktuelle Laternenkette und die Prüfungen dieser Stufe gehen verloren. Abgeschlossene Stufen und Bestwerte bleiben gespeichert.",
      continue: "Weiterspielen", leave: "Zurück zu Stufen"
    },
    it: {
      start: "Inizia gioco", stages: "Livelli", replay: "Rigioca", next: "Livello successivo",
      backMain: "Torna alla schermata iniziale", backStages: "Torna ai livelli",
      leaveTitle: "Uscire da questo sentiero notturno?",
      leaveBody: "La catena di lanterne e i controlli attuali di questo livello andranno persi. I livelli completati e i record resteranno salvati.",
      continue: "Continua a giocare", leave: "Torna ai livelli"
    },
    ru: {
      start: "Начать игру", stages: "Уровни", replay: "Сыграть снова", next: "Следующий уровень",
      backMain: "Назад на главную", backStages: "Назад к уровням",
      leaveTitle: "Покинуть этот ночной путь?",
      leaveBody: "Текущая цепочка фонарей и проверки этого уровня будут потеряны. Пройденные уровни и лучшие результаты сохранятся.",
      continue: "Продолжить", leave: "Вернуться к уровням"
    },
    hi: {
      start: "खेल शुरू करें", stages: "स्तर", replay: "फिर खेलें", next: "अगला स्तर",
      backMain: "मुख्य स्क्रीन पर लौटें", backStages: "स्तरों पर लौटें",
      leaveTitle: "इस रात के रास्ते से बाहर जाएँ?",
      leaveBody: "इस स्तर की मौजूदा लालटेन कड़ी और जाँचें मिट जाएँगी। पूरे किए गए स्तर और सर्वश्रेष्ठ परिणाम सुरक्षित रहेंगे।",
      continue: "खेल जारी रखें", leave: "स्तरों पर लौटें"
    },
    ar: {
      start: "ابدأ اللعبة", stages: "المراحل", replay: "العب مجددًا", next: "المرحلة التالية",
      backMain: "العودة للرئيسية", backStages: "العودة للمراحل",
      leaveTitle: "مغادرة هذا المسار الليلي؟",
      leaveBody: "ستفقد سلسلة الفوانيس الحالية وعمليات التحقق في هذه المرحلة. ستبقى المراحل المكتملة وأفضل النتائج محفوظة.",
      continue: "متابعة اللعب", leave: "العودة للمراحل"
    }
  };

  const byId = (id) => document.getElementById(id);
  const mainStart = byId("startBtn");
  const mapShortcut = byId("mapBtn");
  const stage = byId("stageScreen");
  const stageRail = byId("stageList");
  const stageBack = byId("stageBackBtn");
  const stageTab = byId("stage-tab");
  const battle = byId("battleScreen");
  const battleCanvas = battle?.querySelector(".battle-canvas") || battle;
  const battleBack = byId("battleBackBtn");
  const battleContent = battle?.querySelector(".battle-content");
  const result = byId("resultScreen");
  const resultActions = result?.querySelector(".result-actions");
  const resultNext = byId("resultPrimaryBtn");
  const resultStages = byId("resultMapBtn");
  const legacyResultHome = byId("resultHomeBtn");
  const gameApi = window.__ANIMAL_LANTERN_LATTICE_TEST__;

  let replayButton = null;
  let leaveLayer = null;
  let allowBattleLeave = false;
  let resultObserver = null;

  function currentLocale() {
    const raw = document.documentElement.lang || "en";
    if (labels[raw]) return raw;
    return aliases[raw.toLowerCase()] || "en";
  }

  function copy() {
    return labels[currentLocale()] || labels.en;
  }

  function state() {
    return gameApi?.getState?.() || null;
  }

  function isFinalStage() {
    const value = state()?.path;
    return Number.isInteger(value) && value >= 29;
  }

  function updateResultControls() {
    if (!resultActions || !resultNext || !resultStages || !replayButton) return;
    const c = copy();
    resultStages.textContent = c.stages;
    resultNext.textContent = c.next;
    replayButton.textContent = c.replay;
    const finalStage = isFinalStage();
    resultNext.hidden = false;
    resultNext.disabled = finalStage;
    resultNext.setAttribute("aria-disabled", String(finalStage));
  }

  function updateLeaveCopy() {
    if (!leaveLayer) return;
    const c = copy();
    byId("lantern-leave-title").textContent = c.leaveTitle;
    byId("lantern-leave-copy").textContent = c.leaveBody;
    byId("lantern-leave-continue").textContent = c.continue;
    byId("lantern-leave-stages").textContent = c.leave;
  }

  function enforceLabels() {
    const c = copy();
    if (mainStart) mainStart.textContent = c.start;
    if (stageTab) stageTab.textContent = c.stages;
    if (stageBack) {
      stageBack.setAttribute("aria-label", c.backMain);
      stageBack.title = c.backMain;
    }
    if (battleBack) {
      battleBack.setAttribute("aria-label", c.backStages);
      battleBack.title = c.backStages;
    }
    updateResultControls();
    if (leaveLayer && !leaveLayer.hidden) updateLeaveCopy();
  }

  function installReplayControl() {
    if (!legacyResultHome || !resultActions || replayButton) return;
    replayButton = legacyResultHome.cloneNode(true);
    replayButton.id = "resultReplayBtn";
    replayButton.removeAttribute("data-copy");
    legacyResultHome.replaceWith(replayButton);
    replayButton.addEventListener("click", () => {
      const snapshot = state();
      if (!snapshot || !Number.isInteger(snapshot.path)) return;
      gameApi?.startPath?.(snapshot.path);
    });
    resultActions.replaceChildren(resultStages, resultNext, replayButton);
  }

  function syncResultSubstate() {
    if (!battle || !result) return;
    const visible = !result.hidden;
    battle.toggleAttribute("data-wp-battle-result", visible);
    result.dataset.wpBattleSubstate = visible ? "result" : "";
    if (visible) {
      battle.hidden = false;
      document.body.dataset.screen = "battle";
      if (battleContent) battleContent.inert = true;
      updateResultControls();
    } else if (battleContent) {
      battleContent.inert = false;
    }
  }

  function installResultSubstate() {
    if (!battleCanvas || !result) return;
    result.classList.add("wp-lantern-result-substate");
    result.dataset.wpResultAudit = "true";
    battleCanvas.appendChild(result);
    installReplayControl();
    syncResultSubstate();
    resultObserver = new MutationObserver(syncResultSubstate);
    resultObserver.observe(result, { attributes: true, attributeFilter: ["hidden"] });
  }

  function setBattleCoveredInert(value) {
    if (!battleCanvas || !leaveLayer) return;
    [...battleCanvas.children].forEach((node) => {
      if (node === leaveLayer) return;
      node.inert = value;
    });
  }

  function closeLeaveLayer(restoreFocus = true) {
    if (!leaveLayer || leaveLayer.hidden) return;
    leaveLayer.hidden = true;
    setBattleCoveredInert(false);
    if (restoreFocus) battleBack?.focus({ preventScroll: true });
  }

  function createLeaveLayer() {
    if (!battleCanvas || leaveLayer) return;
    leaveLayer = document.createElement("section");
    leaveLayer.id = "lantern-leave-layer";
    leaveLayer.className = "wp-lantern-leave-layer";
    leaveLayer.hidden = true;
    leaveLayer.setAttribute("role", "dialog");
    leaveLayer.setAttribute("aria-modal", "true");
    leaveLayer.setAttribute("aria-labelledby", "lantern-leave-title");
    leaveLayer.setAttribute("aria-describedby", "lantern-leave-copy");
    leaveLayer.innerHTML = `
      <div class="wp-lantern-leave-card">
        <h2 id="lantern-leave-title"></h2>
        <p id="lantern-leave-copy"></p>
        <div class="wp-lantern-leave-actions">
          <button id="lantern-leave-continue" class="primary-btn" type="button"></button>
          <button id="lantern-leave-stages" class="secondary-btn" type="button"></button>
        </div>
      </div>`;
    battleCanvas.appendChild(leaveLayer);

    byId("lantern-leave-continue").addEventListener("click", () => closeLeaveLayer());
    byId("lantern-leave-stages").addEventListener("click", () => {
      closeLeaveLayer(false);
      allowBattleLeave = true;
      battleBack?.click();
      allowBattleLeave = false;
    });

    leaveLayer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLeaveLayer();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...leaveLayer.querySelectorAll("button:not(:disabled)")];
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
    });
  }

  function hasMutableBattleProgress() {
    if (!result?.hidden) return false;
    const snapshot = state();
    return snapshot?.screen === "battle"
      && ((Array.isArray(snapshot.chain) && snapshot.chain.length > 0) || Number(snapshot.checks) > 0);
  }

  function openLeaveLayer() {
    createLeaveLayer();
    if (!leaveLayer) return;
    updateLeaveCopy();
    setBattleCoveredInert(true);
    leaveLayer.hidden = false;
    byId("lantern-leave-continue")?.focus({ preventScroll: true });
  }

  function installBattleLeaveGuard() {
    if (!battleBack) return;
    battleBack.addEventListener("click", (event) => {
      if (allowBattleLeave || !hasMutableBattleProgress()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openLeaveLayer();
    }, true);
  }

  function normalizeLegacyControls() {
    if (mapShortcut) {
      mapShortcut.hidden = true;
      mapShortcut.disabled = true;
      mapShortcut.tabIndex = -1;
      mapShortcut.setAttribute("aria-hidden", "true");
    }
    if (stageRail) {
      stageRail.dataset.wpStageV6Auto = "true";
      stageRail.dataset.wpStageV6Total = "30";
      stageRail.dataset.wpStageV6PoolSize = "9";
    }
    [byId("settingsBtn"), byId("stageSettingsBtn"), byId("battleSettingsBtn")].forEach((button) => {
      if (!button) return;
      button.hidden = true;
      button.tabIndex = -1;
      button.setAttribute("aria-hidden", "true");
    });
  }

  normalizeLegacyControls();
  installResultSubstate();
  installBattleLeaveGuard();
  enforceLabels();

  const localeObserver = new MutationObserver(enforceLabels);
  localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  window.addEventListener("pagehide", () => {
    resultObserver?.disconnect();
    localeObserver.disconnect();
  }, { once: true });
})();
