(() => {
  "use strict";

  if (document.body?.dataset.wpGameId !== "animal-costume-workshop") return;
  if (window.__wpCostumeWorkshopInterface7Cleanup) return;
  window.__wpCostumeWorkshopInterface7Cleanup = true;

  const startCopy = {
    en: "Start Game",
    "zh-Hant": "開始遊戲",
    "zh-Hans": "开始游戏",
    ja: "ゲーム開始",
    ko: "게임 시작",
    es: "Iniciar juego",
    "pt-BR": "Iniciar jogo",
    fr: "Démarrer le jeu",
    de: "Spiel starten",
    it: "Inizia gioco",
    ru: "Начать игру",
    hi: "खेल शुरू करें",
    ar: "ابدأ اللعبة"
  };

  const leaveCopy = {
    en: ["Leave this postcard?", "Continue keeps your current outfit choice. Returning to Main ends this attempt.", "Continue", "Return to Main"],
    "zh-Hant": ["要離開這張明信片嗎？", "繼續會保留目前的造型選擇；返回主畫面會結束這次嘗試。", "繼續", "返回主畫面"],
    "zh-Hans": ["要离开这张明信片吗？", "继续会保留当前的造型选择；返回主画面会结束这次尝试。", "继续", "返回主画面"],
    ja: ["このポストカードを離れますか？", "続けると現在の衣装選択を保ちます。メインに戻ると今回の挑戦を終了します。", "続ける", "メインに戻る"],
    ko: ["이 엽서를 나갈까요?", "계속하면 현재 의상 선택이 유지됩니다. 메인으로 돌아가면 이번 시도가 끝납니다.", "계속", "메인으로 돌아가기"],
    es: ["¿Salir de esta postal?", "Continuar conserva tu disfraz actual. Volver al inicio termina este intento.", "Continuar", "Volver al inicio"],
    "pt-BR": ["Sair deste cartão?", "Continuar mantém a fantasia atual. Voltar ao início encerra esta tentativa.", "Continuar", "Voltar ao início"],
    fr: ["Quitter cette carte ?", "Continuer conserve le costume actuel. Revenir à l’accueil termine cette tentative.", "Continuer", "Retour à l’accueil"],
    de: ["Diese Postkarte verlassen?", "Beim Fortsetzen bleibt die aktuelle Kostümwahl erhalten. Zurück zum Start beendet diesen Versuch.", "Fortsetzen", "Zurück zum Start"],
    it: ["Uscire da questa cartolina?", "Continuare mantiene il costume attuale. Tornare all’inizio termina questo tentativo.", "Continua", "Torna all’inizio"],
    ru: ["Выйти из этой открытки?", "Продолжение сохранит текущий выбор костюма. Возврат на главный экран завершит эту попытку.", "Продолжить", "На главный экран"],
    hi: ["इस पोस्टकार्ड से बाहर जाएँ?", "जारी रखने पर मौजूदा पोशाक चयन बना रहेगा। मुख्य स्क्रीन पर लौटने से यह प्रयास समाप्त होगा।", "जारी रखें", "मुख्य स्क्रीन पर लौटें"],
    ar: ["مغادرة هذه البطاقة؟", "يحافظ المتابعة على اختيار الزي الحالي. الرجوع إلى الرئيسية ينهي هذه المحاولة.", "متابعة", "العودة إلى الرئيسية"]
  };

  const locale = () => {
    const value = document.querySelector("#locale")?.value || document.documentElement.lang || "en";
    return startCopy[value] ? value : "en";
  };

  const syncStartCopy = () => {
    const button = document.querySelector("#startButton");
    if (!button) return;
    button.textContent = startCopy[locale()] || startCopy.en;
  };

  const battle = document.querySelector("#battleScreen");
  const battleCard = battle?.querySelector(":scope > .card");
  const battleHead = battle?.querySelector(".battle-head");
  const brief = document.querySelector("#brief");
  const workspace = battle?.querySelector(".workspace");
  const result = document.querySelector("#resultCard");
  const back = document.querySelector("#battleBack");

  // Permanently place the outing brief below the title-free 48px play-top before
  // the first Battle activation. Node identity and gameplay bindings are kept.
  if (battleCard && brief && workspace && battleHead?.contains(brief)) {
    brief.classList.add("battle-brief");
    battleCard.insertBefore(brief, workspace);
  }

  const covered = [battleHead, brief, workspace].filter(Boolean);
  const coveredNodes = () => {
    const nodes = new Set(covered);
    battle?.querySelectorAll(".wp-generated-battle-header,.wp-battle-shell-header").forEach((node) => nodes.add(node));
    return [...nodes];
  };
  const setCoveredInert = (value) => {
    coveredNodes().forEach((node) => {
      node.inert = value;
      if (value) node.setAttribute("aria-hidden", "true");
      else node.removeAttribute("aria-hidden");
    });
  };

  const syncResultOwnership = () => {
    if (!result) return;
    const active = !result.hidden;
    if (!document.querySelector(".costume-leave-dialog:not([hidden])")) {
      setCoveredInert(active);
    }
    battle?.setAttribute("data-wp-battle-substate", active ? "result" : "play");
  };

  if (result) {
    new MutationObserver(syncResultOwnership).observe(result, { attributes: true, attributeFilter: ["hidden"] });
    syncResultOwnership();
  }

  let dirty = false;
  let bypassBack = false;
  let lastFocused = null;

  const dialog = document.createElement("section");
  dialog.className = "costume-leave-dialog";
  dialog.hidden = true;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "costumeLeaveTitle");
  dialog.setAttribute("aria-describedby", "costumeLeaveText");
  dialog.innerHTML = `
    <div class="costume-leave-card">
      <h2 id="costumeLeaveTitle"></h2>
      <p id="costumeLeaveText"></p>
      <div class="costume-leave-actions">
        <button id="costumeLeaveContinue" class="primary" type="button"></button>
        <button id="costumeLeaveReturn" class="secondary" type="button"></button>
      </div>
    </div>`;
  battleCard?.append(dialog);

  const continueButton = dialog.querySelector("#costumeLeaveContinue");
  const returnButton = dialog.querySelector("#costumeLeaveReturn");

  const syncLeaveCopy = () => {
    const copy = leaveCopy[locale()] || leaveCopy.en;
    dialog.querySelector("#costumeLeaveTitle").textContent = copy[0];
    dialog.querySelector("#costumeLeaveText").textContent = copy[1];
    continueButton.textContent = copy[2];
    returnButton.textContent = copy[3];
  };

  const closeLeave = ({ restoreFocus = true } = {}) => {
    if (dialog.hidden) return;
    dialog.hidden = true;
    setCoveredInert(Boolean(result && !result.hidden));
    if (restoreFocus) (lastFocused || back)?.focus?.({ preventScroll: true });
    lastFocused = null;
  };

  const openLeave = () => {
    if (!dialog.hidden) return;
    lastFocused = document.activeElement;
    syncLeaveCopy();
    setCoveredInert(true);
    dialog.hidden = false;
    continueButton?.focus?.({ preventScroll: true });
  };

  continueButton?.addEventListener("click", () => closeLeave());
  returnButton?.addEventListener("click", () => {
    closeLeave({ restoreFocus: false });
    dirty = false;
    bypassBack = true;
    back?.click();
    bypassBack = false;
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeLeave();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [continueButton, returnButton].filter((node) => node && !node.disabled);
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

  back?.addEventListener("click", (event) => {
    if (bypassBack || !battle?.classList.contains("active") || !result?.hidden || !dirty) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLeave();
  }, true);

  document.querySelector("#startButton")?.addEventListener("click", () => {
    dirty = false;
    queueMicrotask(syncResultOwnership);
  });
  document.querySelectorAll(".outfit").forEach((button) => button.addEventListener("click", () => { dirty = true; }));
  document.querySelector("#chooseButton")?.addEventListener("click", () => { dirty = true; queueMicrotask(syncResultOwnership); });
  document.querySelector("#resetButton")?.addEventListener("click", () => { dirty = true; });
  document.querySelector("#nextButton")?.addEventListener("click", () => { dirty = false; queueMicrotask(syncResultOwnership); });
  document.querySelector("#retryButton")?.addEventListener("click", () => { dirty = true; queueMicrotask(syncResultOwnership); });
  document.querySelector("#homeButton")?.addEventListener("click", () => { dirty = false; queueMicrotask(syncResultOwnership); });

  document.querySelector("#locale")?.addEventListener("change", () => {
    queueMicrotask(() => {
      syncStartCopy();
      if (!dialog.hidden) syncLeaveCopy();
    });
  });
  window.addEventListener("wonder:locale-change", () => queueMicrotask(syncStartCopy));

  syncStartCopy();
})();
