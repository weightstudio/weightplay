(() => {
  const anchor = document.currentScript;
  const stageScreen = document.getElementById("stage-screen");
  const stageRail = document.getElementById("stage-list");
  const battleScreen = document.getElementById("battle-screen");
  const battleBack = document.getElementById("battle-back");
  const resultScreen = document.getElementById("result-screen");

  const cleanup = document.createElement("link");
  cleanup.rel = "stylesheet";
  cleanup.href = "interface-7-cleanup.css?v=20260922-i7-cleanup2";
  document.head.append(cleanup);

  const stageNav = document.querySelector("#stage-screen .m5-stage-tabs");
  if (stageNav) {
    stageNav.setAttribute("data-wp-frame-stage-nav", "");
    stageNav.querySelector("button")?.setAttribute("data-wp-frame-stage-slot", "stages");
  }

  // Give Stage one explicit workspace so the selector can use the shared
  // 38% upper-middle anchor without depending on the legacy I6 grid row.
  if (stageScreen && stageRail && stageRail.parentElement === stageScreen) {
    const workspace = document.createElement("div");
    workspace.className = "wp-chameleon-stage-workspace";
    workspace.setAttribute("data-wp-stage-workspace", "");
    stageRail.before(workspace);
    workspace.append(stageRail);
  }

  /*
   * Chameleon Blend owns 30 stages. Interface 7 forbids one permanent DOM card
   * per campaign stage, so intercept the legacy renderer before it materializes
   * its 30-button HTML and expose a fixed nine-node virtual rail instead.
   * The shared Stage script still owns Canvas sizing/artwork, while this rail
   * declares one local drag owner and opts out of the shared drag writer.
   */
  function installVirtualStageRail() {
    if (!stageRail) return;
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (!descriptor?.get || !descriptor?.set) return;

    const CARD_WIDTH = 264;
    const CARD_HEIGHT = 190;
    const CARD_GAP = 12;
    const STEP = CARD_WIDTH + CARD_GAP;
    const POOL_SIZE = 9;
    let totalStages = 30;
    let highestUnlocked = 1;
    let currentStage = 1;
    let poolStart = 1;
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

    const localeGame = () => window.WeightPlayMarketFiveLocale?.game?.() || {};
    const stageWord = () => window.wpMarketCommon?.(9) || "Stage";
    const clampStage = (stage) => Math.max(1, Math.min(totalStages, Math.round(stage || 1)));
    const stageName = (stage) => localeGame().stageNames?.[stage - 1] || `${stageWord()} ${stage}`;
    const arcName = (stage) => localeGame().arcNames?.[Math.floor((stage - 1) / 5)] || "";

    function ensurePool() {
      if (spacer) return;
      descriptor.set.call(stageRail, "");
      spacer = document.createElement("div");
      spacer.className = "wp-chameleon-stage-virtual-spacer";
      stageRail.append(spacer);
      pool = Array.from({ length: POOL_SIZE }, () => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "m5-stage-card stage-card";
        const title = document.createElement("span");
        const detail = document.createElement("small");
        button.append(title, detail);
        spacer.append(button);
        return button;
      });
    }

    function railPadding() {
      return Math.max(24, ((stageRail.clientWidth || 390) - CARD_WIDTH) / 2);
    }

    function targetScroll(stage) {
      const padding = railPadding();
      return Math.max(0, padding + (clampStage(stage) - 1) * STEP + CARD_WIDTH / 2 - (stageRail.clientWidth || 390) / 2);
    }

    function centerFromScroll() {
      const padding = railPadding();
      const center = stageRail.scrollLeft + (stageRail.clientWidth || 390) / 2;
      return clampStage((center - padding - CARD_WIDTH / 2) / STEP + 1);
    }

    function bindPool(center = currentStage) {
      ensurePool();
      currentStage = clampStage(center);
      const maximumStart = Math.max(1, totalStages - POOL_SIZE + 1);
      poolStart = Math.max(1, Math.min(maximumStart, currentStage - Math.floor(POOL_SIZE / 2)));
      const padding = railPadding();
      spacer.style.width = `${padding * 2 + totalStages * CARD_WIDTH + Math.max(0, totalStages - 1) * CARD_GAP}px`;
      spacer.style.height = "206px";

      pool.forEach((button, poolIndex) => {
        const stage = poolStart + poolIndex;
        const valid = stage <= totalStages;
        button.hidden = !valid;
        if (!valid) return;
        const available = stage <= highestUnlocked;
        const centered = stage === currentStage;
        button.dataset.stage = String(stage);
        button.dataset.index = String(stage - 1);
        button.style.left = `${padding + (stage - 1) * STEP}px`;
        button.style.top = "8px";
        button.disabled = !available;
        button.setAttribute("aria-disabled", String(!available));
        button.setAttribute("aria-posinset", String(stage));
        button.setAttribute("aria-setsize", String(totalStages));
        button.toggleAttribute("data-wp-enter-battle", available);
        button.classList.toggle("recommended", stage === highestUnlocked);
        button.classList.toggle("is-centered", centered);
        button.setAttribute("aria-current", centered ? "true" : "false");
        button.firstElementChild.textContent = `${stageWord()} ${stage}`;
        button.lastElementChild.textContent = available
          ? [stageName(stage), arcName(stage)].filter(Boolean).join(" · ")
          : "🔒";
      });
    }

    function layoutRail({ center = false } = {}) {
      const stage = currentStage;
      bindPool(stage);
      if (center && stageRail.getClientRects().length) stageRail.scrollLeft = targetScroll(stage);
    }

    function settleTo(stage) {
      stage = clampStage(stage);
      if (settleFrame) cancelAnimationFrame(settleFrame);
      const from = stageRail.scrollLeft;
      const to = targetScroll(stage);
      const distance = to - from;
      if (Math.abs(distance) < 1) {
        stageRail.scrollLeft = to;
        bindPool(stage);
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
        bindPool(stage);
        stageRail.dispatchEvent(new CustomEvent("wonder:stage-snap", { detail: { index: stage - 1 } }));
      };
      settleFrame = requestAnimationFrame(animate);
    }

    function refreshFromLegacyMarkup(markup) {
      const source = String(markup || "");
      const stageCount = source.match(/data-stage="\d+"/g)?.length || totalStages;
      const unlockedCount = source.match(/data-wp-enter-battle/g)?.length || 1;
      totalStages = Math.max(1, stageCount);
      highestUnlocked = Math.max(1, Math.min(totalStages, unlockedCount));
      activeBridge = document.createElement("button");
      activeBridge.type = "button";
      const stageVisible = Boolean(stageScreen && !stageScreen.hidden && stageScreen.getClientRects().length);
      if (!stageVisible) currentStage = highestUnlocked;
      bindPool(currentStage);
      requestAnimationFrame(() => layoutRail({ center: stageVisible }));
    }

    Object.defineProperty(stageRail, "innerHTML", {
      configurable: true,
      get() { return descriptor.get.call(stageRail); },
      set(value) {
        const source = String(value ?? "");
        if (!source.includes("m5-stage-card")) {
          descriptor.set.call(stageRail, source);
          spacer = null;
          pool = [];
          return;
        }
        refreshFromLegacyMarkup(source);
      },
    });

    stageRail.querySelectorAll = function (selector) {
      if (selector === "button:not(:disabled)" && activeBridge) return [activeBridge];
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
      const button = event.target?.closest?.(".m5-stage-card");
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

    window.addEventListener("weightplay:shell-sync", () => {
      if (!stageScreen || stageScreen.hidden) return;
      currentStage = highestUnlocked;
      requestAnimationFrame(() => layoutRail({ center: true }));
    });
    window.addEventListener("weightplay:market-locale-change", () => requestAnimationFrame(() => layoutRail({ center: true })));
    window.addEventListener("resize", () => requestAnimationFrame(() => layoutRail({ center: true })), { passive: true });
  }

  installVirtualStageRail();

  /* Pause only the Market Five gameplay rAF while the Battle-owned leave
     dialog is open. This preserves Chameleon's countdown exactly instead of
     letting the preview/choice timer advance behind a modal. */
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  let battleFrameCallback = null;
  let battleFrameId = 0;
  let battleClockOffset = 0;
  let battlePausedAt = 0;
  let battlePaused = false;
  const marketFrameCallbacks = new WeakSet();

  function isMarketBattleFrame(callback) {
    if (typeof callback !== "function" || callback.name !== "frame") return false;
    if (marketFrameCallbacks.has(callback)) return true;
    const source = Function.prototype.toString.call(callback);
    if (source.includes("state.screen") && source.includes("updateHud") && source.includes("draw")) {
      marketFrameCallbacks.add(callback);
      return true;
    }
    return false;
  }

  window.requestAnimationFrame = function (callback) {
    if (!isMarketBattleFrame(callback)) return nativeRequestAnimationFrame(callback);
    battleFrameCallback = callback;
    if (battlePaused) return 0;
    let id = 0;
    id = nativeRequestAnimationFrame((timestamp) => {
      if (battleFrameId === id) battleFrameId = 0;
      callback(timestamp - battleClockOffset);
    });
    battleFrameId = id;
    return id;
  };

  window.cancelAnimationFrame = function (id) {
    if (id === battleFrameId) battleFrameId = 0;
    return nativeCancelAnimationFrame(id);
  };

  function pauseBattleClock() {
    if (battlePaused) return;
    battlePaused = true;
    battlePausedAt = performance.now();
    if (battleFrameId) {
      nativeCancelAnimationFrame(battleFrameId);
      battleFrameId = 0;
    }
  }

  function resumeBattleClock() {
    if (!battlePaused) return;
    battleClockOffset += performance.now() - battlePausedAt;
    battlePaused = false;
    if (battleFrameCallback) window.requestAnimationFrame(battleFrameCallback);
  }

  window.addEventListener("weightplay:battle-open", () => {
    battleClockOffset = 0;
    battlePausedAt = 0;
    battlePaused = false;
  });

  const leaveCopy = {
    en: ["Leave this stage?", "Leaving {stage} discards this run. Cleared stages stay saved.", "Continue playing", "Return to Stages"],
    "zh-Hant": ["離開此關卡？", "離開 {stage} 會放棄本次進度；已通關的進度仍會保留。", "繼續遊戲", "返回關卡"],
    "zh-Hans": ["离开此关卡？", "离开 {stage} 会放弃本次进度；已通关的进度仍会保留。", "继续游戏", "返回关卡"],
    ja: ["このステージを離れますか？", "{stage} を離れると今回の進行は失われます。クリア済みの進行は保存されます。", "プレイを続ける", "ステージへ戻る"],
    ko: ["이 스테이지를 나갈까요?", "{stage}을 나가면 이번 진행은 사라집니다. 완료한 스테이지 기록은 유지됩니다.", "계속 플레이", "스테이지로 돌아가기"],
    es: ["¿Salir de esta fase?", "Salir de {stage} descarta esta partida. Las fases superadas siguen guardadas.", "Seguir jugando", "Volver a las fases"],
    "pt-BR": ["Sair desta fase?", "Sair de {stage} descarta esta tentativa. As fases concluídas continuam salvas.", "Continuar jogando", "Voltar às fases"],
    fr: ["Quitter ce niveau ?", "Quitter {stage} abandonne cette partie. Les niveaux terminés restent enregistrés.", "Continuer", "Retour aux niveaux"],
    de: ["Diese Stufe verlassen?", "Beim Verlassen von {stage} geht dieser Lauf verloren. Abgeschlossene Stufen bleiben gespeichert.", "Weiterspielen", "Zurück zu den Stufen"],
    it: ["Uscire dal livello?", "Uscendo da {stage} perderai questa partita. I livelli completati restano salvati.", "Continua a giocare", "Torna ai livelli"],
    ru: ["Выйти с уровня?", "При выходе из {stage} текущая попытка будет потеряна. Пройденные уровни сохранятся.", "Продолжить игру", "К уровням"],
    hi: ["इस स्तर से बाहर जाएँ?", "{stage} छोड़ने पर यह प्रयास मिट जाएगा। पूरे किए गए स्तर सुरक्षित रहेंगे।", "खेल जारी रखें", "स्तरों पर लौटें"],
    ar: ["مغادرة هذه المرحلة؟", "مغادرة {stage} تلغي هذه المحاولة. تبقى المراحل المكتملة محفوظة.", "متابعة اللعب", "العودة إلى المراحل"],
  };

  function localeKey() {
    const locale = window.WeightPlayMarketFiveLocale?.locale || document.documentElement.lang || "en";
    if (/^zh-(tw|hant)/i.test(locale)) return "zh-Hant";
    if (/^zh/i.test(locale)) return "zh-Hans";
    return leaveCopy[locale] ? locale : "en";
  }

  function installLeaveDialog() {
    if (!battleScreen || !battleBack) return;
    const dialog = document.createElement("section");
    dialog.id = "wp-chameleon-leave-dialog";
    dialog.className = "wp-chameleon-leave-dialog";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "wp-chameleon-leave-title");
    dialog.setAttribute("aria-describedby", "wp-chameleon-leave-copy");
    dialog.innerHTML = `<div class="wp-chameleon-leave-card"><h2 id="wp-chameleon-leave-title"></h2><p id="wp-chameleon-leave-copy"></p><div class="wp-chameleon-leave-actions"><button id="wp-chameleon-continue" type="button"></button><button id="wp-chameleon-leave" type="button"></button></div></div>`;
    battleScreen.append(dialog);
    const continueButton = dialog.querySelector("#wp-chameleon-continue");
    const leaveButton = dialog.querySelector("#wp-chameleon-leave");
    const covered = [...battleScreen.children].filter((node) => node !== dialog);
    const inertSnapshot = new Map();

    const updateCopy = () => {
      const copy = leaveCopy[localeKey()] || leaveCopy.en;
      const stageLabel = document.getElementById("stage-label")?.textContent?.trim() || (window.wpMarketCommon?.(9) || "Stage");
      dialog.querySelector("#wp-chameleon-leave-title").textContent = copy[0];
      dialog.querySelector("#wp-chameleon-leave-copy").textContent = copy[1].replace("{stage}", stageLabel);
      continueButton.textContent = copy[2];
      leaveButton.textContent = copy[3];
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

    const closeDialog = ({ resume = true, focusBack = true } = {}) => {
      if (dialog.hidden) return;
      dialog.hidden = true;
      setCoveredInert(false);
      document.body.classList.remove("wp-chameleon-leave-open");
      if (resume) resumeBattleClock();
      if (focusBack) battleBack.focus({ preventScroll: true });
    };

    const openDialog = () => {
      if (!dialog.hidden) return;
      updateCopy();
      pauseBattleClock();
      setCoveredInert(true);
      dialog.hidden = false;
      document.body.classList.add("wp-chameleon-leave-open");
      continueButton.focus({ preventScroll: true });
    };

    continueButton.addEventListener("click", () => closeDialog());
    leaveButton.addEventListener("click", () => {
      closeDialog({ resume: false, focusBack: false });
      document.getElementById("to-stages")?.click();
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const actions = [continueButton, leaveButton].filter((button) => !button.disabled);
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

    const interceptBattleBack = (event) => {
      const target = event.target?.closest?.('[data-wp-return="battle"],#battle-back');
      if (!target || !battleScreen.contains(target) || battleScreen.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (resultScreen && !resultScreen.hidden) {
        document.getElementById("to-stages")?.click();
        return;
      }
      openDialog();
    };
    battleBack.addEventListener("click", interceptBattleBack, true);
    document.addEventListener("click", interceptBattleBack, true);
    window.addEventListener("weightplay:market-locale-change", () => { if (!dialog.hidden) updateCopy(); });
  }

  installLeaveDialog();

  // Result remains a Battle substate, but live HUD/controls must become inert
  // while the three persistent Result actions own interaction.
  if (resultScreen && battleScreen) {
    const resultCovered = [
      battleScreen.querySelector(".m5-battle-header"),
      battleScreen.querySelector(".m5-status"),
      battleScreen.querySelector("#arena"),
      battleScreen.querySelector(".m5-controls"),
      battleScreen.querySelector(".m5-hint"),
    ].filter(Boolean);
    const syncResultOwnership = () => {
      const active = !resultScreen.hidden;
      document.body.classList.toggle("wp-chameleon-result-active", active);
      resultCovered.forEach((node) => node.toggleAttribute("inert", active));
    };
    new MutationObserver(syncResultOwnership).observe(resultScreen, { attributes: true, attributeFilter: ["hidden"] });
    syncResultOwnership();
  }

  let runtimeLoaded = false;
  const loadRuntime = () => {
    if (runtimeLoaded) return;
    runtimeLoaded = true;
    const runtime = document.createElement("script");
    runtime.src = "../../src/market-five-games.js?v=20260907-blend-depth30-v8";
    (document.querySelector('script[src*="stage-selector-standard.js"]') || anchor).after(runtime);
  };

  if (document.querySelector('script[src*="stage-selector-standard.js"]')) {
    loadRuntime();
    return;
  }

  const stageController = document.createElement("script");
  stageController.src = "../../src/stage-selector-standard.js?v=20260922-interface7";
  stageController.addEventListener("load", loadRuntime, { once: true });
  stageController.addEventListener("error", loadRuntime, { once: true });
  anchor.after(stageController);
})();