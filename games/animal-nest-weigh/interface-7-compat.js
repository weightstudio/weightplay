(() => {
  "use strict";

  const current = document.currentScript?.src || new URL("interface-7-compat.js", location.href).href;
  if (!document.querySelector('link[data-nest-weigh-interface7-cleanup]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("interface-7-cleanup.css?v=20260922-interface7-compat2", current).href;
    link.dataset.nestWeighInterface7Cleanup = "true";
    document.head.append(link);
  }

  const START_COPY = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲーム開始",
    ko: "게임 시작",
    es: "Iniciar juego",
    "pt-BR": "Iniciar jogo",
    fr: "Commencer",
    de: "Spiel starten",
    it: "Inizia gioco",
    ru: "Начать игру",
    hi: "खेल शुरू करें",
    ar: "ابدأ اللعبة",
  };
  const STAGES_COPY = {
    en: "Stages",
    "zh-Hant": "關卡",
    "zh-Hans": "关卡",
    ja: "ステージ",
    ko: "스테이지",
    es: "Fases",
    "pt-BR": "Fases",
    fr: "Niveaux",
    de: "Stufen",
    it: "Livelli",
    ru: "Уровни",
    hi: "स्तर",
    ar: "المراحل",
  };
  const REPLAY_COPY = {
    en: "Replay",
    "zh-Hant": "重玩",
    "zh-Hans": "重玩",
    ja: "リプレイ",
    ko: "다시 하기",
    es: "Repetir",
    "pt-BR": "Repetir",
    fr: "Rejouer",
    de: "Erneut",
    it: "Rigioca",
    ru: "Повторить",
    hi: "फिर खेलें",
    ar: "إعادة اللعب",
  };

  Object.entries(START_COPY).forEach(([locale, label]) => {
    if (window.ANIMAL_NEST_WEIGH_LOCALES?.[locale]) window.ANIMAL_NEST_WEIGH_LOCALES[locale].start = label;
  });
  Object.entries(STAGES_COPY).forEach(([locale, label]) => {
    if (window.ANIMAL_NEST_WEIGH_LOCALES?.[locale]) window.ANIMAL_NEST_WEIGH_LOCALES[locale].stages = label;
  });

  const api = window.__ANIMAL_NEST_WEIGH_TEST__;
  const state = api?.state;
  const rounds = api?.rounds || [];
  const stageScreen = document.getElementById("stageScreen");
  const stageCanvas = stageScreen?.querySelector(".stage-canvas");
  const stageRail = document.getElementById("stageList");
  const battleScreen = document.getElementById("battleScreen");
  const battleCanvas = battleScreen?.querySelector(".battle-canvas");
  const battleBack = document.getElementById("battleBackBtn");
  const resultPanel = document.getElementById("resultPanel");

  if (api?.applyLocale && state?.locale) api.applyLocale(state.locale);

  const retireControl = (node) => {
    if (!node) return;
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.tabIndex = -1;
  };
  retireControl(document.getElementById("mapBtn"));
  retireControl(document.getElementById("stageInfoBtn"));
  retireControl(document.getElementById("battleSoundBtn"));

  const syncSharedSound = () => {
    if (!state || !window.WeightPlayAudio?.isMuted) return;
    const enabled = !window.WeightPlayAudio.isMuted();
    state.sound = enabled;
    try {
      localStorage.setItem("weightplay-animal-nest-weigh-sound", enabled ? "on" : "off");
    } catch {
      // Storage is optional; shared audio remains authoritative.
    }
  };
  syncSharedSound();
  window.addEventListener("weightplay:audio-volume-change", syncSharedSound);

  const dictionary = () => window.ANIMAL_NEST_WEIGH_LOCALES?.[state?.locale] || window.ANIMAL_NEST_WEIGH_LOCALES?.en || {};
  const copy = (key, values = {}) => {
    let text = String(dictionary()[key] ?? key);
    Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
    return text;
  };
  const stageName = (round, index) => {
    if (state?.locale === "ar") return round.nameAr;
    if (state?.locale === "en") return round.name;
    if (state?.locale === "zh-Hant" || state?.locale === "zh-Hans") return round.nameZh;
    return copy("round", { number: index + 1, total: rounds.length });
  };

  let resetStageCenter = true;
  document.getElementById("startBtn")?.addEventListener("click", () => { resetStageCenter = true; }, true);
  document.getElementById("resultMapBtn")?.addEventListener("click", () => { resetStageCenter = true; }, true);

  // One explicit Stage workspace lets the selected card use the shared 38%
  // upper-middle anchor without retaining the retired intro row.
  if (stageCanvas && stageRail && stageRail.parentElement === stageCanvas) {
    const workspace = document.createElement("div");
    workspace.className = "wp-nest-stage-workspace";
    workspace.setAttribute("data-wp-stage-workspace", "");
    stageRail.before(workspace);
    workspace.append(stageRail);
  }

  function installVirtualStageRail() {
    if (!stageRail || !state || !rounds.length) return;
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (!descriptor?.get || !descriptor?.set) return;

    const CARD_WIDTH = 264;
    const CARD_HEIGHT = 190;
    const CARD_GAP = 12;
    const STEP = CARD_WIDTH + CARD_GAP;
    const POOL_SIZE = 9;
    let currentIndex = 0;
    let poolStart = 0;
    let pool = [];
    let spacer = null;
    let activeBridge = null;
    let pointerId = null;
    let pointerStartX = 0;
    let pointerStartScroll = 0;
    let pointerMoved = false;
    let suppressClick = false;
    let settleFrame = 0;
    const nativeQuerySelectorAll = stageRail.querySelectorAll.bind(stageRail);

    stageRail.dataset.wpStageVirtualDrag = "true";
    stageRail.dataset.wpStageCenterObserver = "manual";

    const highestUnlocked = () => {
      let highest = 0;
      rounds.forEach((_round, index) => {
        if (index === 0 || state.completed.includes(index - 1)) highest = Math.max(highest, index);
      });
      return Math.min(rounds.length - 1, highest);
    };
    const clampIndex = (index) => Math.max(0, Math.min(rounds.length - 1, Math.round(index || 0)));
    const isUnlocked = (index) => index === 0 || state.completed.includes(index - 1);

    function ensurePool() {
      if (spacer) return;
      descriptor.set.call(stageRail, "");
      spacer = document.createElement("div");
      spacer.className = "wp-nest-stage-virtual-spacer";
      stageRail.append(spacer);
      pool = Array.from({ length: POOL_SIZE }, () => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "stage-card";
        button.setAttribute("data-wp-stage-card", "");
        const number = document.createElement("span");
        number.className = "stage-number";
        const name = document.createElement("strong");
        const detail = document.createElement("span");
        detail.className = "stage-detail";
        const status = document.createElement("b");
        button.append(number, name, detail, status);
        spacer.append(button);
        return button;
      });
    }

    const railPadding = () => Math.max(24, ((stageRail.clientWidth || 390) - CARD_WIDTH) / 2);
    const targetScroll = (index) => Math.max(0, railPadding() + clampIndex(index) * STEP + CARD_WIDTH / 2 - (stageRail.clientWidth || 390) / 2);
    const centerFromScroll = () => clampIndex((stageRail.scrollLeft + (stageRail.clientWidth || 390) / 2 - railPadding() - CARD_WIDTH / 2) / STEP);

    function bindPool(center = currentIndex) {
      ensurePool();
      currentIndex = clampIndex(center);
      const maxStart = Math.max(0, rounds.length - POOL_SIZE);
      poolStart = Math.max(0, Math.min(maxStart, currentIndex - Math.floor(POOL_SIZE / 2)));
      const padding = railPadding();
      spacer.style.width = `${padding * 2 + rounds.length * CARD_WIDTH + Math.max(0, rounds.length - 1) * CARD_GAP}px`;
      spacer.style.height = "206px";

      pool.forEach((button, poolIndex) => {
        const index = poolStart + poolIndex;
        const valid = index < rounds.length;
        button.hidden = !valid;
        if (!valid) return;
        const round = rounds[index];
        const unlocked = isUnlocked(index);
        const completed = state.completed.includes(index);
        const centered = index === currentIndex;
        const checkpoint = round.checkpoint ? ` · ${copy("checkpoint")}` : "";
        button.dataset.stage = String(index);
        button.dataset.index = String(index);
        button.style.left = `${padding + index * STEP}px`;
        button.style.top = "8px";
        button.disabled = !unlocked;
        button.setAttribute("aria-disabled", String(!unlocked));
        button.setAttribute("aria-posinset", String(index + 1));
        button.setAttribute("aria-setsize", String(rounds.length));
        button.toggleAttribute("data-wp-enter-battle", unlocked);
        button.classList.toggle("complete", completed);
        button.classList.toggle("is-centered", centered);
        button.setAttribute("aria-current", centered ? "true" : "false");
        button.children[0].textContent = copy("round", { number: index + 1, total: rounds.length });
        button.children[1].textContent = stageName(round, index);
        button.children[2].textContent = `${copy(round.request)} · ${copy(round.mechanicKey)}${checkpoint}`;
        button.children[3].textContent = completed ? copy("completed") : unlocked ? copy("readyStage") : copy("lockedStage");
      });
    }

    function layout({ center = false } = {}) {
      bindPool(currentIndex);
      if (center && stageRail.getClientRects().length) stageRail.scrollLeft = targetScroll(currentIndex);
    }

    function settleTo(index) {
      index = clampIndex(index);
      if (settleFrame) cancelAnimationFrame(settleFrame);
      const from = stageRail.scrollLeft;
      const to = targetScroll(index);
      const distance = to - from;
      if (Math.abs(distance) < 1) {
        stageRail.scrollLeft = to;
        bindPool(index);
        return;
      }
      const started = performance.now();
      const duration = Math.min(480, Math.max(240, Math.abs(distance) * 1.35));
      const animate = (now) => {
        const progress = Math.max(0, Math.min(1, (now - started) / duration));
        const eased = 1 - Math.pow(1 - progress, 2);
        stageRail.scrollLeft = from + distance * eased;
        bindPool(centerFromScroll());
        if (progress < 1) {
          settleFrame = requestAnimationFrame(animate);
          return;
        }
        settleFrame = 0;
        stageRail.scrollLeft = to;
        bindPool(index);
        stageRail.dispatchEvent(new CustomEvent("wonder:stage-snap", { detail: { index } }));
      };
      settleFrame = requestAnimationFrame(animate);
    }

    Object.defineProperty(stageRail, "innerHTML", {
      configurable: true,
      get() { return descriptor.get.call(stageRail); },
      set(value) {
        const source = String(value ?? "");
        if (!source.includes("stage-card")) {
          descriptor.set.call(stageRail, source);
          spacer = null;
          pool = [];
          return;
        }
        activeBridge = document.createElement("button");
        activeBridge.type = "button";
        if (resetStageCenter || !spacer) currentIndex = highestUnlocked();
        resetStageCenter = false;
        bindPool(currentIndex);
        requestAnimationFrame(() => layout({ center: true }));
        window.dispatchEvent(new Event("weightplay:stage-sync"));
      },
    });

    stageRail.querySelectorAll = function (selector) {
      if (selector === "[data-stage]" && activeBridge) return [activeBridge];
      return nativeQuerySelectorAll(selector);
    };

    stageRail.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
      if (settleFrame) {
        cancelAnimationFrame(settleFrame);
        settleFrame = 0;
      }
      pointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartScroll = stageRail.scrollLeft;
      pointerMoved = false;
      suppressClick = false;
      try { stageRail.setPointerCapture(event.pointerId); } catch { /* optional */ }
      if (event.cancelable) event.preventDefault();
    }, true);

    stageRail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const rect = stageRail.getBoundingClientRect();
      const scale = rect.width > 0 ? stageRail.clientWidth / rect.width : 1;
      const delta = event.clientX - pointerStartX;
      if (Math.abs(delta) > 4) pointerMoved = true;
      stageRail.scrollLeft = pointerStartScroll - delta * scale;
      bindPool(centerFromScroll());
      if (event.cancelable) event.preventDefault();
    }, true);

    const finishPointer = (event) => {
      if (event.pointerId !== pointerId) return;
      try { stageRail.releasePointerCapture(event.pointerId); } catch { /* optional */ }
      pointerId = null;
      if (pointerMoved) suppressClick = true;
      settleTo(centerFromScroll());
    };
    stageRail.addEventListener("pointerup", finishPointer, true);
    stageRail.addEventListener("pointercancel", finishPointer, true);

    stageRail.addEventListener("click", (event) => {
      const button = event.target?.closest?.(".stage-card");
      if (!button || !stageRail.contains(button)) return;
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!activeBridge) return;
      activeBridge.dataset.stage = button.dataset.stage;
      activeBridge.click();
    }, true);

    window.addEventListener("resize", () => requestAnimationFrame(() => layout({ center: true })), { passive: true });
    document.getElementById("languageSelect")?.addEventListener("change", () => requestAnimationFrame(() => layout({ center: true })));
  }

  installVirtualStageRail();

  const LEAVE_COPY = {
    en: ["Leave this lesson?", "Your current attempt will be lost. Completed lessons stay saved.", "Continue playing", "Return to Stages"],
    "zh-Hant": ["離開這堂課？", "目前的作答進度會遺失；已完成的關卡仍會保留。", "繼續遊戲", "返回關卡"],
    "zh-Hans": ["离开这堂课？", "当前作答进度会丢失；已完成的关卡仍会保留。", "继续游戏", "返回关卡"],
    ja: ["このレッスンを離れますか？", "現在の進行は失われます。完了したステージは保存されます。", "プレイを続ける", "ステージへ戻る"],
    ko: ["이 레슨을 나갈까요?", "현재 진행은 사라집니다. 완료한 스테이지는 저장됩니다.", "계속 플레이", "스테이지로 돌아가기"],
    es: ["¿Salir de esta lección?", "Se perderá este intento. Las fases completadas seguirán guardadas.", "Seguir jugando", "Volver a las fases"],
    "pt-BR": ["Sair desta lição?", "Esta tentativa será perdida. As fases concluídas continuam salvas.", "Continuar jogando", "Voltar às fases"],
    fr: ["Quitter cette leçon ?", "Cette tentative sera perdue. Les niveaux terminés restent enregistrés.", "Continuer", "Retour aux niveaux"],
    de: ["Diese Lektion verlassen?", "Dieser Versuch geht verloren. Abgeschlossene Stufen bleiben gespeichert.", "Weiterspielen", "Zurück zu den Stufen"],
    it: ["Uscire dalla lezione?", "Questo tentativo andrà perso. I livelli completati restano salvati.", "Continua", "Torna ai livelli"],
    ru: ["Выйти из урока?", "Текущая попытка будет потеряна. Пройденные уровни сохранятся.", "Продолжить", "К уровням"],
    hi: ["इस पाठ से बाहर जाएँ?", "मौजूदा प्रयास खो जाएगा। पूरे किए गए स्तर सुरक्षित रहेंगे।", "खेल जारी रखें", "स्तरों पर लौटें"],
    ar: ["مغادرة هذا الدرس؟", "ستفقد المحاولة الحالية. تبقى المراحل المكتملة محفوظة.", "متابعة اللعب", "العودة إلى المراحل"],
  };

  function installLeaveDialog() {
    if (!battleCanvas || !battleBack || !state) return;
    const dialog = document.createElement("section");
    dialog.className = "wp-nest-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "wp-nest-leave-title");
    dialog.setAttribute("aria-describedby", "wp-nest-leave-copy");
    dialog.innerHTML = `<div class="wp-nest-leave-card"><h2 id="wp-nest-leave-title"></h2><p id="wp-nest-leave-copy"></p><div class="wp-nest-leave-actions"><button id="wp-nest-continue" type="button"></button><button id="wp-nest-leave" type="button"></button></div></div>`;
    battleCanvas.append(dialog);
    const continueButton = dialog.querySelector("#wp-nest-continue");
    const leaveButton = dialog.querySelector("#wp-nest-leave");
    const covered = [...battleCanvas.children].filter((node) => node !== dialog);
    const inertSnapshot = new Map();

    const updateCopy = () => {
      const locale = LEAVE_COPY[state.locale] ? state.locale : "en";
      const text = LEAVE_COPY[locale];
      dialog.querySelector("#wp-nest-leave-title").textContent = text[0];
      dialog.querySelector("#wp-nest-leave-copy").textContent = text[1];
      continueButton.textContent = text[2];
      leaveButton.textContent = text[3];
    };
    const setCoveredInert = (inert) => {
      covered.forEach((node) => {
        if (inert) {
          inertSnapshot.set(node, node.hasAttribute("inert"));
          node.setAttribute("inert", "");
        } else if (!inertSnapshot.get(node)) node.removeAttribute("inert");
      });
      if (!inert) inertSnapshot.clear();
    };
    const closeDialog = ({ focusBack = true } = {}) => {
      if (dialog.hidden) return;
      dialog.hidden = true;
      setCoveredInert(false);
      document.body.classList.remove("wp-nest-leave-open");
      if (focusBack) battleBack.focus({ preventScroll: true });
    };
    const openDialog = () => {
      if (!dialog.hidden) return;
      updateCopy();
      setCoveredInert(true);
      dialog.hidden = false;
      document.body.classList.add("wp-nest-leave-open");
      continueButton.focus({ preventScroll: true });
    };
    const hasAttempt = () => Boolean(
      state.screen === "battle"
      && !state.resultVisible
      && (state.selectedPair?.length || state.selectedTarget !== null || state.comparison || state.comparisons > 0 || state.wrong)
    );

    continueButton.addEventListener("click", () => closeDialog());
    leaveButton.addEventListener("click", () => {
      resetStageCenter = true;
      closeDialog({ focusBack: false });
      battleBack.dataset.wpLeaveBypass = "true";
      battleBack.click();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const actions = [continueButton, leaveButton];
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

    battleBack.addEventListener("click", (event) => {
      if (battleBack.dataset.wpLeaveBypass === "true") {
        delete battleBack.dataset.wpLeaveBypass;
        return;
      }
      if (!hasAttempt()) {
        resetStageCenter = true;
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      openDialog();
    }, true);

    document.getElementById("languageSelect")?.addEventListener("change", () => { if (!dialog.hidden) updateCopy(); });
  }

  installLeaveDialog();

  // Result uses the fixed three destinations required by the shared contract:
  // Stages -> Next Stage -> Replay. The old third Home action is repurposed as
  // Replay and intercepted before the authored Home listener can run.
  const resultStages = document.getElementById("resultMapBtn");
  const resultNext = document.getElementById("resultPrimaryBtn");
  const resultReplay = document.getElementById("resultHomeBtn");
  const normalizeResultActions = () => {
    if (!resultPanel || resultPanel.hidden || !state) return;
    const actions = resultPanel.querySelector(".result-actions");
    if (!actions || !resultStages || !resultNext || !resultReplay) return;
    actions.append(resultStages, resultNext, resultReplay);
    resultNext.textContent = copy("next");
    const final = state.round >= rounds.length - 1;
    resultNext.disabled = final;
    resultNext.setAttribute("aria-disabled", String(final));
    resultReplay.textContent = REPLAY_COPY[state.locale] || REPLAY_COPY.en;
    resultReplay.removeAttribute("data-copy");
    resultReplay.disabled = false;
    resultReplay.setAttribute("aria-disabled", "false");
    document.body.classList.add("wp-nest-result-active");
    battleCanvas?.querySelector(".panel-head")?.setAttribute("inert", "");
  };
  const clearResultOwnership = () => {
    if (!resultPanel?.hidden) return;
    document.body.classList.remove("wp-nest-result-active");
    battleCanvas?.querySelector(".panel-head")?.removeAttribute("inert");
  };
  if (resultPanel) {
    new MutationObserver(() => {
      if (resultPanel.hidden) clearResultOwnership();
      else normalizeResultActions();
    }).observe(resultPanel, { attributes: true, attributeFilter: ["hidden"] });
  }
  resultReplay?.addEventListener("click", (event) => {
    if (!state?.resultVisible) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    api?.startRound?.(state.round);
  }, true);

  const syncStageNavigationLabel = () => {
    const label = STAGES_COPY[state?.locale] || STAGES_COPY.en;
    stageCanvas?.querySelector(".stage-tabs")?.setAttribute("aria-label", label);
  };
  document.getElementById("languageSelect")?.addEventListener("change", () => {
    syncStageNavigationLabel();
    if (!resultPanel?.hidden) normalizeResultActions();
  });
  syncStageNavigationLabel();
  clearResultOwnership();

  const syncStage = () => window.dispatchEvent(new Event("weightplay:stage-sync"));
  if (stageRail) {
    new MutationObserver(syncStage).observe(stageRail, { childList: true, subtree: true });
    syncStage();
  }
})();