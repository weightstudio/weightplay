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
    }, true);

    stageRail.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const rect = stageRail.getBoundingClientRect();
      const scale = rect.width > 0 ? stageRail.clientWidth / rect.width : 1;
      const delta = event.clientX - pointerStartX;
      if (Math.abs(delta) > 4 && !pointerMoved) {
        pointerMoved = true;
        try { stageRail.setPointerCapture(event.pointerId); } catch { /* optional */ }
      }
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

  let battlePaused = false;
  function pauseBattleClock() { battlePaused = true; }
  function resumeBattleClock() { battlePaused = false; }
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


  // This game owns one explicit state machine. Shared frame, audio and locale
  // services remain the platform's responsibility; no shared game loop is loaded.
  const $ = id => document.getElementById(id);
  const gameText = () => window.WeightPlayMarketFiveLocale?.game?.() || {};
  const common = i => window.wpMarketCommon?.(i) || ['Language','Start Game','Stages','Back','Back','Retry','Next Stage','How to Play','Best','Stage','Goal reached','Try again'][i];
  const copy = {
    en: ['Remember the color + habitat','Watch the clue','Choose a color, then a habitat','Lock this blend','Watch & remember','Next clue','Blended perfectly!','This was the correct blend','Color','Habitat','Your blend','Choose both before locking','Correct rounds','Goal','In reverse order','In the same order','Remembered? Now recreate it.','Ready when you are. Start the clue.','Time is up','Round'],
    'zh-Hant': ['記住「顏色＋棲地」','仔細看，記住這一組','先選顏色，再選棲地','確認融景','開始觀察','下一組挑戰','融景成功！','正確配對是這一組','顏色','棲地','你的配對','選好顏色與棲地再確認','成功組數','過關目標','倒序重現','依序重現','記住了嗎？換你重現！','準備好再按「開始觀察」','時間到了','第'],
    'zh-Hans': ['记住「颜色＋栖地」','仔细看，记住这一组','先选颜色，再选栖地','确认融景','开始观察','下一组挑战','融景成功！','正确配对是这一组','颜色','栖地','你的配对','选好颜色与栖地再确认','成功组数','过关目标','倒序重现','依序重现','记住了吗？换你重现！','准备好再按「开始观察」','时间到了','第'],
    ja: ['色と生息地を覚えよう','この組を覚えよう','色、次に生息地を選ぼう','組を確定','見て覚える','次のチャレンジ','ブレンド成功！','正しい組はこちら','色','生息地','あなたの組','両方を選んで確定','成功した組','目標','逆の順番','同じ順番','覚えた？再現しよう','準備できたら開始','時間切れ','ラウンド'],
    ko: ['색과 서식지를 기억하세요','이 조합을 기억하세요','색, 그다음 서식지를 선택','조합 확인','보고 기억하기','다음 도전','위장 성공!','올바른 조합','색','서식지','내 조합','둘 다 고른 후 확인','성공한 조합','목표','역순으로','같은 순서로','기억했나요? 재현하세요','준비되면 시작하세요','시간 종료','라운드'],
    es: ['Recuerda color + hábitat','Observa esta pareja','Elige color y luego hábitat','Confirmar pareja','Mirar y recordar','Siguiente reto','¡Camuflaje perfecto!','Esta era la pareja correcta','Color','Hábitat','Tu pareja','Elige ambos para confirmar','Rondas correctas','Objetivo','Orden inverso','Mismo orden','Ahora repite la pareja','Empieza cuando quieras','Tiempo agotado','Ronda'],
    'pt-BR': ['Lembre a cor + habitat','Observe esta dupla','Escolha cor e depois habitat','Confirmar dupla','Olhar e lembrar','Próximo desafio','Camuflagem perfeita!','Esta era a dupla correta','Cor','Habitat','Sua dupla','Escolha ambos para confirmar','Rodadas certas','Meta','Ordem inversa','Mesma ordem','Agora repita a dupla','Comece quando quiser','Tempo esgotado','Rodada'],
    fr: ['Mémorisez couleur + habitat','Observez cette paire','Choisissez couleur puis habitat','Valider la paire','Observer et retenir','Défi suivant','Camouflage réussi !','Voici la bonne paire','Couleur','Habitat','Votre paire','Choisissez les deux éléments','Manches réussies','Objectif','Ordre inverse','Même ordre','À vous de refaire la paire','Commencez à votre rythme','Temps écoulé','Manche'],
    de: ['Merke Farbe + Lebensraum','Merke dir dieses Paar','Erst Farbe, dann Lebensraum','Paar bestätigen','Ansehen und merken','Nächste Aufgabe','Perfekt getarnt!','Das war das richtige Paar','Farbe','Lebensraum','Dein Paar','Wähle beide vor dem Bestätigen','Richtige Runden','Ziel','Umgekehrte Reihenfolge','Gleiche Reihenfolge','Jetzt bist du dran','Starte, wenn du bereit bist','Zeit abgelaufen','Runde'],
    it: ['Ricorda colore + habitat','Osserva questa coppia','Scegli colore e poi habitat','Conferma coppia','Osserva e ricorda','Prossima sfida','Mimetismo perfetto!','Questa era la coppia giusta','Colore','Habitat','La tua coppia','Scegli entrambi per confermare','Turni corretti','Obiettivo','Ordine inverso','Stesso ordine','Ora ricrea la coppia','Inizia quando vuoi','Tempo scaduto','Turno'],
    ru: ['Запомни цвет и среду','Запомни эту пару','Выбери цвет, затем среду','Подтвердить пару','Смотреть и запоминать','Следующее испытание','Маскировка удалась!','Вот правильная пара','Цвет','Среда','Твоя пара','Выбери оба элемента','Верных раундов','Цель','Обратный порядок','Тот же порядок','Теперь повтори пару','Начни, когда будешь готов','Время вышло','Раунд'],
    hi: ['रंग और आवास याद रखें','यह जोड़ी याद रखें','पहले रंग, फिर आवास चुनें','जोड़ी पक्की करें','देखें और याद रखें','अगली चुनौती','छलावरण सफल!','यह सही जोड़ी थी','रंग','आवास','आपकी जोड़ी','दोनों चुनकर पुष्टि करें','सही दौर','लक्ष्य','उलटा क्रम','वही क्रम','अब जोड़ी दोहराएँ','तैयार हों तो शुरू करें','समय समाप्त','दौर'],
    ar: ['تذكّر اللون والموطن','احفظ هذا الزوج','اختر اللون ثم الموطن','تأكيد الزوج','شاهد وتذكّر','التحدي التالي','نجح التمويه!','هذا هو الزوج الصحيح','اللون','الموطن','زوجك','اختر الاثنين قبل التأكيد','الجولات الصحيحة','الهدف','بالترتيب العكسي','بالترتيب نفسه','الآن أعد تكوين الزوج','ابدأ عندما تكون مستعدًا','انتهى الوقت','الجولة']
  };
  const t = i => (copy[localeKey()] || copy.en)[i];
  const colors = ['#78e79b','#ff968c','#7ccfff'];
  const shapes = ['●','◆','▲'];
  const patterns = ['🍃','🌸','🌊'];
  const base = [
    {rounds:5,need:4,sequence:1,preview:2.8,choose:8,shuffle:false,reverse:false},
    {rounds:6,need:5,sequence:1,preview:2.1,choose:6.5,shuffle:false,reverse:false},
    {rounds:6,need:5,sequence:1,preview:2.4,choose:6.5,shuffle:true,reverse:false},
    {rounds:5,need:4,sequence:2,preview:1.65,choose:9,shuffle:false,reverse:false},
    {rounds:5,need:4,sequence:2,preview:1.55,choose:9,shuffle:true,reverse:true},
    {rounds:4,need:3,sequence:3,preview:1.35,choose:10,shuffle:true,reverse:false}
  ];
  const profiles = [...base, ...Array.from({length:24},(_,i)=>{
    const b=base[i%6], rounds=Math.min(10,b.rounds+Math.floor(i/6)+(i%3===2?1:0));
    return {...b,rounds,need:Math.min(rounds-1,b.need+1+Math.floor(i/9)),sequence:Math.min(3,b.sequence+(i%5===3?1:0)),preview:Math.max(1.05,b.preview-Math.floor(i/6)*.12),choose:Math.min(12,b.choose+Math.floor(i/8)),shuffle:i%2===0?b.shuffle:!b.shuffle,reverse:i%4===1?!b.reverse:b.reverse};
  })];
  const cycle = [[1,2],[0,1],[2,0],[1,0],[2,2],[0,2],[1,1],[0,0],[2,1]];
  const storageKey = 'weightplay-chameleon-blend-best-stage';
  let best=0;
  try { best=Math.max(0,Math.min(30,Math.floor(Number(localStorage.getItem(storageKey))||0))); } catch { /* Play remains available. */ }
  let state={screen:'main',stage:1,round:1,wins:0,phase:'ready',color:-1,pattern:-1,entry:0,preview:0,timer:0,correct:false};
  let lastTime=0, frameId=0;
  const measurement={roundKey:null,started:false,ended:false,restart:false,outcome:'complete'};
  const observeMeasurement=()=>window.WonderAnalytics?.game?.observeState?.(()=>({
    ...measurement,screen:state.phase==='result'?null:state.screen,
    paused:battlePaused||document.hidden,node:document.body,keyboardKeys:['1','2','3','4','5','6'],activityMode:'input',idleSeconds:300
  }));
  window.addEventListener('weightplay:analytics-ready',observeMeasurement);
  const coach=$('blend-coach') || document.createElement('span'); coach.id='blend-coach';
  const progress=$('blend-progress') || document.createElement('span'); progress.id='blend-progress';
  $('battle-status').replaceChildren(coach,progress);
  const board=document.createElement('div'); board.id='blend-board'; board.setAttribute('aria-live','polite');
  $('arena').after(board);
  const hud=document.createElement('div');hud.className='blend-hud';
  $('stage-label').before(hud);hud.append($('stage-label'),$('score-label'));
  const clue=document.createElement('div');clue.className='blend-clue';
  const clueIndex=document.createElement('span');clueIndex.className='blend-clue-index';
  const cluePair=document.createElement('strong');cluePair.className='blend-clue-pair';
  const clueName=document.createElement('span');clueName.className='blend-clue-name';
  const mascot=document.createElement('div');mascot.className='blend-mascot';mascot.setAttribute('aria-hidden','true');
  const path=document.createElement('div');path.className='blend-sequence';
  const timer=document.createElement('div');timer.className='blend-timer';timer.setAttribute('role','progressbar');timer.setAttribute('aria-valuemin','0');timer.setAttribute('aria-valuemax','100');
  const meter=document.createElement('i');timer.append(meter);
  clue.append(clueIndex,cluePair,clueName);board.append(mascot,clue,path,timer);
  let controls=[];
  function makeButton(text,action){const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.action=action;b.addEventListener('click',()=>act(action));return b;}
  const colorGroup=document.createElement('fieldset'),patternGroup=document.createElement('fieldset');
  const colorLegend=document.createElement('legend'),patternLegend=document.createElement('legend');
  colorGroup.append(colorLegend);patternGroup.append(patternLegend);
  for(let i=0;i<3;i++){
    const color=makeButton('',`color-${i}`),pattern=makeButton('',`pattern-${i}`);
    color.style.setProperty('--blend-color',colors[i]);color.className='blend-choice-color';
    colorGroup.append(color);patternGroup.append(pattern);controls.push(color,pattern);
  }
  const lock=makeButton('','lock');lock.id='blend-lock';lock.className='primary-control';
  $('battle-controls').replaceChildren(colorGroup,patternGroup,lock);
  function pairName(pair){return `${gameText().colors?.[pair[0]]||shapes[pair[0]]} + ${gameText().patterns?.[pair[1]]||patterns[pair[1]]}`;}
  function targets(){const p=profiles[state.stage-1],offset=(state.stage-1)*2+(state.round-1)*p.sequence;return Array.from({length:p.sequence},(_,i)=>cycle[(offset+i)%cycle.length]);}
  function answers(){const a=targets();return profiles[state.stage-1].reverse?a.reverse():a;}
  const audio=window.WeightPlayAudio?.createScope?.();
  window.WeightPlayAudio?.preload?.(['game.start','puzzle.match','feedback.error','result.win','result.lose']);
  function sound(id){audio?.play(id);}
  function updateProgress(){
    $('main-progress').textContent=`${common(8)}: ${best} / 30`;
    document.querySelector('[data-m5-lede]').textContent=t(0)+' · '+t(16);
    document.querySelector('#main-screen + [data-wp-game-guide] [data-m5-guide]')?.replaceChildren(document.createTextNode(`${t(4)} → ${t(2)} → ${t(3)}. ${t(15)} / ${t(14)}.`));
  }
  function stageCards(){
    const unlocked=Math.min(30,best+1);
    stageRail.innerHTML=profiles.map((p,i)=>`<button class="m5-stage-card stage-card" data-stage="${i+1}" ${i<unlocked?'data-wp-enter-battle':'disabled'}><span>${i+1}</span></button>`).join('');
    stageRail.querySelectorAll('button:not(:disabled)').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.stage))));
  }
  function show(screen){
    if(screen!=='battle'&&state.screen==='battle'&&measurement.started&&!measurement.ended){measurement.ended=true;measurement.outcome='abandon';}
    cancelAnimationFrame(frameId);state.screen=screen;document.body.dataset.screen=screen;
    for(const name of ['main','stage','battle']){const node=$(`${name}-screen`);node.hidden=name!==screen;node.classList.toggle('active',name===screen);}
    if(screen!=='battle'){resultScreen.hidden=true;audio?.stop();}
    window.dispatchEvent(new CustomEvent(screen==='battle'?'weightplay:battle-open':'weightplay:shell-sync'));
    if(screen==='battle'){lastTime=performance.now();frameId=requestAnimationFrame(tick);}
    observeMeasurement();
  }
  function start(stage){
    if(stage>Math.min(30,best+1)||stage<1)return;
    state={screen:'battle',stage,round:1,wins:0,phase:'ready',color:-1,pattern:-1,entry:0,preview:0,timer:0,correct:false};
    Object.assign(measurement,{roundKey:{},started:true,ended:false,restart:false,outcome:'complete'});
    battlePaused=false;resultScreen.hidden=true;show('battle');render();sound('game.start');
  }
  function begin(){state.phase='preview';state.preview=0;state.entry=0;state.color=-1;state.pattern=-1;state.timer=profiles[state.stage-1].preview;render();}
  function nextRound(){const p=profiles[state.stage-1];if(state.round>=p.rounds){finish();return;}state.round++;begin();}
  function act(action){
    if(state.screen!=='battle'||battlePaused||!resultScreen.hidden)return;
    if(action==='lock'&&state.phase==='ready'){begin();return;}
    if(action==='lock'&&state.phase==='feedback'){nextRound();return;}
    if(state.phase!=='choose')return;
    if(action.startsWith('color-'))state.color=Number(action.slice(-1));
    else if(action.startsWith('pattern-'))state.pattern=Number(action.slice(-1));
    else if(action==='lock'&&state.color>=0&&state.pattern>=0){
      const expected=answers()[state.entry];state.correct=expected[0]===state.color&&expected[1]===state.pattern;
      if(state.correct){sound('puzzle.match');state.entry++;if(state.entry<answers().length){state.color=-1;state.pattern=-1;}else{state.wins++;state.phase='feedback';}}
      else {sound('feedback.error');state.phase='feedback';}
    }
    render();
  }
  function updateBlendCoach(){
    const p=profiles[state.stage-1],phase=state.phase;
    coach.textContent=phase==='ready'?t(0):phase==='preview'?t(1):phase==='choose'?t(2):state.correct?t(6):t(7);
    progress.textContent=`${t(19)} ${state.round}/${p.rounds} · ${t(12)} ${state.wins}/${p.need}`;
    board.dataset.phase=phase;board.dataset.correct=String(state.correct);
    $('stage-label').textContent=`${common(9)} ${state.stage} / 30`;
    $('score-label').textContent=`${state.wins} / ${p.need} ✓`;
  }
  function render(){
    const p=profiles[state.stage-1],phase=state.phase;
    updateBlendCoach();
    colorLegend.textContent=`1 · ${t(8)}`;patternLegend.textContent=`2 · ${t(9)}`;
    for(const b of controls){const color=b.dataset.action.startsWith('color'),i=Number(b.dataset.action.slice(-1));b.textContent=`${color?shapes[i]:patterns[i]} ${color?(gameText().colors?.[i]||shapes[i]):(gameText().patterns?.[i]||patterns[i])}`;b.disabled=phase!=='choose';b.setAttribute('aria-pressed',String((color?state.color:state.pattern)===i));}
    lock.disabled=phase==='preview'||(phase==='choose'&&(state.color<0||state.pattern<0));
    lock.textContent=phase==='ready'?`▶ ${t(4)}`:phase==='preview'?`◉ ${t(1)}`:phase==='feedback'? (state.round>=p.rounds?common(10):t(5)):`3 · ${t(3)}`;
    let pair=null;
    if(phase==='preview')pair=targets()[state.preview];
    else if(phase==='feedback')pair=answers()[Math.min(state.entry,p.sequence-1)];
    else if(phase==='choose'&&state.color>=0&&state.pattern>=0)pair=[state.color,state.pattern];
    clueIndex.textContent=phase==='ready'?`${t(13)} ${p.need}/${p.rounds} · ${p.reverse?t(14):t(15)}`:phase==='preview'?`${state.preview+1} / ${p.sequence}`:phase==='choose'?`${t(10)} · ${state.entry+1} / ${p.sequence} ${p.reverse?'←':'→'}`:state.correct?'✓':'↺';
    cluePair.textContent=pair?`${shapes[pair[0]]}  ${patterns[pair[1]]}`:phase==='ready'?'● + 🍃':'? + ?';
    cluePair.style.color=pair?colors[pair[0]]:'#f4e9bc';
    clueName.textContent=pair?pairName(pair):phase==='ready'?t(17):t(11);
    path.replaceChildren(...Array.from({length:p.sequence},(_,i)=>{const d=document.createElement('span');d.textContent=phase==='choose'&&i<state.entry?'✓':String(i+1);d.className=(phase==='preview'?i===state.preview:i===state.entry)?'current':'';return d;}));
    $('battle-screen').querySelector('.m5-hint').textContent=phase==='ready'?t(17):phase==='preview'?`${p.reverse?t(14):t(15)} · ${t(0)}`:phase==='choose'?`${t(16)} ${Math.ceil(state.timer)}s`:state.correct?t(6):`${t(7)} · ${answers().map(pairName).join(' → ')}`;
    timer.setAttribute('aria-label',phase==='preview'?t(1):t(16));
    syncTimer();
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){clue.getAnimations().forEach(a=>a.cancel());clue.animate([{opacity:.6,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});}
  }
  function syncTimer(){const p=profiles[state.stage-1],active=state.phase==='preview'||state.phase==='choose',ratio=active?Math.max(0,state.timer/(state.phase==='preview'?p.preview:p.choose)):1;meter.style.transform=`scaleX(${ratio})`;timer.setAttribute('aria-valuenow',String(Math.round(ratio*100)));timer.hidden=!active;}
  function finish(){
    const p=profiles[state.stage-1],win=state.wins>=p.need;state.phase='result';
    measurement.ended=true;measurement.outcome=win?'win':'lose';observeMeasurement();
    if(win){best=Math.max(best,state.stage);try{localStorage.setItem(storageKey,String(best));}catch{/* Nonpersistent play. */}}
    $('result-title').textContent=win?common(10):common(11);$('result-copy').textContent=`${t(12)}: ${state.wins}/${p.rounds} · ${t(13)}: ${p.need}${state.stage%5===0?' · '+(state.stage===30?(gameText().finale||'★'):(gameText().checkpoint||'★')):''}`;
    $('next').disabled=!win||state.stage===30;$('next').setAttribute('aria-disabled',String($('next').disabled));resultScreen.hidden=false;board.inert=true;updateProgress();sound(win?'result.win':'result.lose');
  }
  function tick(now){
    const dt=Math.min(.1,Math.max(0,(now-lastTime)/1000));lastTime=now;
    if(!battlePaused&&!document.hidden&&state.screen==='battle'){
      if(state.phase==='preview'||state.phase==='choose'){
        state.timer-=dt;
        if(state.timer<=0){const p=profiles[state.stage-1];if(state.phase==='preview'){if(++state.preview<p.sequence)state.timer=p.preview;else{state.phase='choose';state.timer=p.choose;}}else{state.correct=false;state.phase='feedback';sound('feedback.error');}render();}
        syncTimer();
      }
    }
    if(state.screen==='battle')frameId=requestAnimationFrame(tick);
  }
  $('start-game').addEventListener('click',()=>{stageCards();show('stage');});
  $('stage-back').addEventListener('click',()=>show('main'));
  $('to-stages').addEventListener('click',()=>{board.inert=false;stageCards();show('stage');});
  $('retry').addEventListener('click',()=>{board.inert=false;start(state.stage);});
  $('next').addEventListener('click',()=>{if(!$('next').disabled){board.inert=false;start(state.stage+1);}});
  window.addEventListener('keydown',e=>{if(state.screen!=='battle'||!resultScreen.hidden||battlePaused||e.repeat||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;const actions={'1':'color-0','2':'color-1','3':'color-2','4':'pattern-0','5':'pattern-1','6':'pattern-2'};if(actions[e.key]){e.preventDefault();act(actions[e.key]);}});
  window.addEventListener('weightplay:market-locale-change',()=>{updateProgress();stageCards();if(state.screen==='battle')render();});
  document.addEventListener('visibilitychange',()=>{lastTime=performance.now();});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);audio?.stop();});
  window.addEventListener('pageshow',e=>{if(e.persisted&&state.screen==='battle'){lastTime=performance.now();frameId=requestAnimationFrame(tick);}});
  const atlasImage=new Image();atlasImage.src='assets/animal-chameleon-blend-background.png';
  atlasImage.addEventListener('load',()=>{const c=$('arena'),ctx=c.getContext('2d');ctx.drawImage(atlasImage,0,0,c.width,c.height);});
  updateProgress();stageCards();show('main');
  const hideLoading=()=>{$('loadingPanel')?.classList.add('hidden');$('loadingPanel')?.setAttribute('hidden','');};
  if(document.readyState==='complete')hideLoading();else window.addEventListener('load',hideLoading,{once:true});

})();
