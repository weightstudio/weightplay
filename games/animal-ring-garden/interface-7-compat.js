(() => {
  "use strict";

  const localeAliases = {
    "zh-tw": "zh-Hant",
    "zh-cn": "zh-Hans",
    "pt-br": "pt-BR"
  };

  const labels = {
    en: {
      start: "Start Game",
      stages: "Stages",
      replay: "Replay",
      backStage: "Back to Main",
      backBattle: "Back to Stages",
      leaveTitle: "Leave this garden?",
      leaveBody: "Your current ring turns in this garden will be lost. Completed gardens and best scores stay saved.",
      continue: "Continue playing",
      leave: "Return to Stages"
    },
    "zh-Hant": {
      start: "開始遊戲",
      stages: "關卡",
      replay: "重新遊玩",
      backStage: "返回主畫面",
      backBattle: "返回關卡",
      leaveTitle: "要離開這座花園嗎？",
      leaveBody: "這座花園目前的花環轉動進度會消失；已完成花園與最佳成績仍會保留。",
      continue: "繼續遊玩",
      leave: "返回關卡"
    },
    "zh-Hans": {
      start: "开始游戏",
      stages: "关卡",
      replay: "重新游玩",
      backStage: "返回主画面",
      backBattle: "返回关卡",
      leaveTitle: "要离开这座花园吗？",
      leaveBody: "这座花园当前的花环转动进度会丢失；已完成花园与最佳成绩仍会保留。",
      continue: "继续游玩",
      leave: "返回关卡"
    },
    ja: {
      start: "ゲーム開始",
      stages: "ステージ",
      replay: "もう一度",
      backStage: "メインに戻る",
      backBattle: "ステージに戻る",
      leaveTitle: "この庭を離れますか？",
      leaveBody: "この庭での現在のリング操作は失われます。クリア済みの庭とベスト記録は保存されます。",
      continue: "続ける",
      leave: "ステージに戻る"
    },
    ko: {
      start: "게임 시작",
      stages: "스테이지",
      replay: "다시 플레이",
      backStage: "메인으로",
      backBattle: "스테이지로",
      leaveTitle: "이 정원을 나갈까요?",
      leaveBody: "이 정원의 현재 링 회전 진행은 사라집니다. 완료한 정원과 최고 기록은 저장됩니다.",
      continue: "계속 플레이",
      leave: "스테이지로 돌아가기"
    },
    es: {
      start: "Iniciar juego",
      stages: "Niveles",
      replay: "Repetir",
      backStage: "Volver al inicio",
      backBattle: "Volver a niveles",
      leaveTitle: "¿Salir de este jardín?",
      leaveBody: "Se perderán los giros actuales de este jardín. Los jardines completados y los mejores resultados seguirán guardados.",
      continue: "Seguir jugando",
      leave: "Volver a niveles"
    },
    "pt-BR": {
      start: "Iniciar jogo",
      stages: "Fases",
      replay: "Jogar de novo",
      backStage: "Voltar ao início",
      backBattle: "Voltar às fases",
      leaveTitle: "Sair deste jardim?",
      leaveBody: "As rotações atuais deste jardim serão perdidas. Jardins concluídos e melhores resultados continuam salvos.",
      continue: "Continuar jogando",
      leave: "Voltar às fases"
    },
    fr: {
      start: "Commencer",
      stages: "Niveaux",
      replay: "Rejouer",
      backStage: "Retour à l’accueil",
      backBattle: "Retour aux niveaux",
      leaveTitle: "Quitter ce jardin ?",
      leaveBody: "Les rotations en cours dans ce jardin seront perdues. Les jardins terminés et les meilleurs scores restent enregistrés.",
      continue: "Continuer",
      leave: "Retour aux niveaux"
    },
    de: {
      start: "Spiel starten",
      stages: "Stufen",
      replay: "Noch einmal",
      backStage: "Zurück zum Start",
      backBattle: "Zurück zu Stufen",
      leaveTitle: "Diesen Garten verlassen?",
      leaveBody: "Die aktuellen Ringdrehungen in diesem Garten gehen verloren. Abgeschlossene Gärten und Bestwerte bleiben gespeichert.",
      continue: "Weiterspielen",
      leave: "Zurück zu Stufen"
    },
    it: {
      start: "Inizia gioco",
      stages: "Livelli",
      replay: "Rigioca",
      backStage: "Torna alla schermata iniziale",
      backBattle: "Torna ai livelli",
      leaveTitle: "Uscire da questo giardino?",
      leaveBody: "Le rotazioni attuali in questo giardino andranno perse. I giardini completati e i record resteranno salvati.",
      continue: "Continua a giocare",
      leave: "Torna ai livelli"
    },
    ru: {
      start: "Начать игру",
      stages: "Уровни",
      replay: "Сыграть снова",
      backStage: "Назад на главную",
      backBattle: "Назад к уровням",
      leaveTitle: "Покинуть этот сад?",
      leaveBody: "Текущие повороты колец в этом саду будут потеряны. Пройденные сады и лучшие результаты сохранятся.",
      continue: "Продолжить",
      leave: "Вернуться к уровням"
    },
    hi: {
      start: "खेल शुरू करें",
      stages: "स्तर",
      replay: "फिर खेलें",
      backStage: "मुख्य स्क्रीन पर लौटें",
      backBattle: "स्तरों पर लौटें",
      leaveTitle: "इस बगीचे से बाहर जाएँ?",
      leaveBody: "इस बगीचे में मौजूदा रिंग घुमाव मिट जाएँगे। पूरे किए गए बगीचे और सर्वश्रेष्ठ स्कोर सुरक्षित रहेंगे।",
      continue: "खेल जारी रखें",
      leave: "स्तरों पर लौटें"
    },
    ar: {
      start: "ابدأ اللعبة",
      stages: "المراحل",
      replay: "العب مجددًا",
      backStage: "العودة للرئيسية",
      backBattle: "العودة للمراحل",
      leaveTitle: "مغادرة هذه الحديقة؟",
      leaveBody: "ستفقد دورات الحلقات الحالية في هذه الحديقة. ستبقى الحدائق المكتملة وأفضل النتائج محفوظة.",
      continue: "متابعة اللعب",
      leave: "العودة للمراحل"
    }
  };

  const byId = (id) => document.getElementById(id);
  const stage = byId("stageScreen");
  const battle = byId("battleScreen");
  const rail = byId("garden-list");
  const stageBack = byId("stage-back");
  const battleBack = byId("battle-back");
  const start = byId("startBtn");
  const resultPanel = byId("result-panel");
  const resultActions = resultPanel?.querySelector(".result-actions");
  const nextButton = byId("next-button");
  const resultStages = byId("result-main");
  let leavePanel = null;
  let allowBattleLeave = false;
  let stageRaf = 0;
  let currentGardenIndex = 0;

  function currentLocale() {
    const raw = document.documentElement.lang || "en";
    return labels[raw] ? raw : (localeAliases[raw.toLowerCase()] || "en");
  }

  function copy() {
    return labels[currentLocale()] || labels.en;
  }

  function enforceLabels() {
    const c = copy();
    if (start) start.textContent = c.start;
    if (stageBack) {
      stageBack.innerHTML = '<span aria-hidden="true">←</span>';
      stageBack.setAttribute("aria-label", c.backStage);
      stageBack.title = c.backStage;
    }
    if (battleBack) {
      battleBack.innerHTML = '<span aria-hidden="true">←</span>';
      battleBack.setAttribute("aria-label", c.backBattle);
      battleBack.title = c.backBattle;
    }
    const stageTab = byId("stage-tab");
    if (stageTab) stageTab.textContent = c.stages;
    if (resultStages) resultStages.textContent = c.stages;
    const replay = byId("result-retry");
    if (replay) replay.textContent = c.replay;
    if (leavePanel && !leavePanel.hidden) updateLeaveCopy();
  }

  function syncCenteredCard() {
    if (!rail || !rail.children.length || rail.hidden) return;
    const railRect = rail.getBoundingClientRect();
    if (!railRect.width) return;
    const center = railRect.left + railRect.width / 2;
    let nearest = null;
    let nearestDistance = Infinity;
    [...rail.querySelectorAll("[data-wp-stage-card]")].forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < nearestDistance) {
        nearest = card;
        nearestDistance = distance;
      }
    });
    [...rail.querySelectorAll("[data-wp-stage-card]")].forEach((card) => {
      const selected = card === nearest;
      card.classList.toggle("is-centered", selected);
      if (selected) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  }

  function scheduleCenteredCard() {
    cancelAnimationFrame(stageRaf);
    stageRaf = requestAnimationFrame(syncCenteredCard);
  }

  function updateResultState() {
    if (!battle || !resultPanel || !nextButton) return;
    const resultVisible = !resultPanel.hidden;
    battle.toggleAttribute("data-wp-battle-result", resultVisible);
    if (!resultVisible) return;

    const finalGarden = currentGardenIndex >= 3;
    nextButton.hidden = false;
    nextButton.disabled = finalGarden;
    nextButton.setAttribute("aria-disabled", String(finalGarden));
  }

  function ensureResultActions() {
    if (!resultActions || !resultStages || !nextButton) return;
    let replay = byId("result-retry");
    if (!replay) {
      replay = document.createElement("button");
      replay.id = "result-retry";
      replay.type = "button";
      replay.className = "secondary-button";
      replay.addEventListener("click", () => byId("reset-button")?.click());
    }
    resultActions.replaceChildren(resultStages, nextButton, replay);
    enforceLabels();
    updateResultState();
  }

  function createLeavePanel() {
    if (!battle || leavePanel) return;
    leavePanel = document.createElement("section");
    leavePanel.id = "ring-leave-panel";
    leavePanel.className = "wp-ring-leave-layer";
    leavePanel.hidden = true;
    leavePanel.setAttribute("role", "dialog");
    leavePanel.setAttribute("aria-modal", "true");
    leavePanel.setAttribute("aria-labelledby", "ring-leave-title");
    leavePanel.setAttribute("aria-describedby", "ring-leave-copy");
    leavePanel.innerHTML = `
      <div class="wp-ring-leave-card">
        <h2 id="ring-leave-title"></h2>
        <p id="ring-leave-copy"></p>
        <div class="wp-ring-leave-actions">
          <button id="ring-leave-continue" class="primary-button" type="button"></button>
          <button id="ring-leave-stages" class="secondary-button" type="button"></button>
        </div>
      </div>`;
    battle.appendChild(leavePanel);

    byId("ring-leave-continue").addEventListener("click", closeLeavePanel);
    byId("ring-leave-stages").addEventListener("click", () => {
      closeLeavePanel(false);
      allowBattleLeave = true;
      battleBack?.click();
      allowBattleLeave = false;
    });

    leavePanel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeavePanel();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...leavePanel.querySelectorAll("button:not(:disabled)")];
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

  function updateLeaveCopy() {
    if (!leavePanel) return;
    const c = copy();
    byId("ring-leave-title").textContent = c.leaveTitle;
    byId("ring-leave-copy").textContent = c.leaveBody;
    byId("ring-leave-continue").textContent = c.continue;
    byId("ring-leave-stages").textContent = c.leave;
  }

  function setBattleCoveredInert(value) {
    if (!battle || !leavePanel) return;
    [...battle.children].forEach((node) => {
      if (node === leavePanel) return;
      node.inert = value;
    });
  }

  function openLeavePanel() {
    createLeavePanel();
    if (!leavePanel) return;
    updateLeaveCopy();
    setBattleCoveredInert(true);
    leavePanel.hidden = false;
    byId("ring-leave-continue")?.focus();
  }

  function closeLeavePanel(restoreFocus = true) {
    if (!leavePanel || leavePanel.hidden) return;
    leavePanel.hidden = true;
    setBattleCoveredInert(false);
    if (restoreFocus) battleBack?.focus();
  }

  function hasMutableBattleProgress() {
    if (!resultPanel?.hidden) return false;
    const turns = Number.parseInt(byId("turn-count")?.textContent || "0", 10);
    return Number.isFinite(turns) && turns > 0;
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest?.("[data-garden]");
    if (card) {
      const index = Number.parseInt(card.dataset.garden || "0", 10);
      if (Number.isInteger(index)) currentGardenIndex = index;
    }
    if (event.target.closest?.("#next-button") && !nextButton?.disabled) {
      currentGardenIndex = Math.min(3, currentGardenIndex + 1);
    }
  }, true);

  if (stage) {
    new MutationObserver(() => {
      if (!stage.hidden) requestAnimationFrame(scheduleCenteredCard);
    }).observe(stage, { attributes: true, attributeFilter: ["hidden"] });
  }

  battleBack?.addEventListener("click", (event) => {
    if (allowBattleLeave || !hasMutableBattleProgress()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLeavePanel();
  }, true);

  rail?.addEventListener("scroll", scheduleCenteredCard, { passive: true });
  window.addEventListener("resize", scheduleCenteredCard, { passive: true });

  if (rail) {
    new MutationObserver(() => {
      scheduleCenteredCard();
      enforceLabels();
    }).observe(rail, { childList: true, subtree: true });
  }

  if (resultPanel) {
    new MutationObserver(() => {
      ensureResultActions();
      updateResultState();
    }).observe(resultPanel, { attributes: true, attributeFilter: ["hidden"] });
  }

  new MutationObserver(enforceLabels).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "dir"]
  });

  ensureResultActions();
  createLeavePanel();
  enforceLabels();
  scheduleCenteredCard();
})();
