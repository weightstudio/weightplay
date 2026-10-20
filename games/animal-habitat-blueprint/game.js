(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const locales = window.HABITAT_BLUEPRINT_LOCALES || {};
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const localeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const sharedCopy = {
    en: { start: "Start Game", stages: "Stages", leaveTitle: "Leave this plan?", leaveText: "Leaving {stage} ends this blueprint attempt and discards its current tile arrangement. Cleared plans stay saved.", continuePlay: "Continue playing", returnStages: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", leaveTitle: "要離開這張藍圖嗎？", leaveText: "離開「{stage}」會結束這次藍圖嘗試並捨棄目前的方塊排列；已完成的關卡仍會保留。", continuePlay: "繼續遊戲", returnStages: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", leaveTitle: "要离开这张蓝图吗？", leaveText: "离开“{stage}”会结束这次蓝图尝试并丢弃当前方块排列；已完成的关卡仍会保留。", continuePlay: "继续游戏", returnStages: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", leaveTitle: "この設計図を離れますか？", leaveText: "「{stage}」を離れると現在の設計図の挑戦と配置は破棄されます。クリア済みのステージは保存されます。", continuePlay: "プレイを続ける", returnStages: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", leaveTitle: "이 설계도를 나갈까요?", leaveText: "{stage}에서 나가면 현재 설계도 시도와 타일 배치가 사라집니다. 완료한 스테이지는 저장됩니다.", continuePlay: "계속 플레이", returnStages: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Niveles", leaveTitle: "¿Salir de este plano?", leaveText: "Salir de {stage} termina este intento y descarta la disposición actual. Los niveles completados siguen guardados.", continuePlay: "Seguir jugando", returnStages: "Volver a Niveles" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", leaveTitle: "Sair desta planta?", leaveText: "Sair de {stage} encerra esta tentativa e descarta a disposição atual. As fases concluídas continuam salvas.", continuePlay: "Continuar jogando", returnStages: "Voltar às Fases" },
    fr: { start: "Démarrer le jeu", stages: "Niveaux", leaveTitle: "Quitter ce plan ?", leaveText: "Quitter {stage} met fin à cette tentative et abandonne la disposition actuelle. Les niveaux terminés restent enregistrés.", continuePlay: "Continuer à jouer", returnStages: "Retour aux Niveaux" },
    de: { start: "Spiel starten", stages: "Stufen", leaveTitle: "Diesen Plan verlassen?", leaveText: "Wenn du {stage} verlässt, endet dieser Versuch und die aktuelle Anordnung wird verworfen. Abgeschlossene Stufen bleiben gespeichert.", continuePlay: "Weiterspielen", returnStages: "Zurück zu den Stufen" },
    it: { start: "Avvia gioco", stages: "Livelli", leaveTitle: "Uscire da questo progetto?", leaveText: "Uscire da {stage} termina questo tentativo e scarta la disposizione attuale. I livelli completati restano salvati.", continuePlay: "Continua a giocare", returnStages: "Torna ai Livelli" },
    ru: { start: "Начать игру", stages: "Уровни", leaveTitle: "Выйти из этого плана?", leaveText: "Выход из {stage} завершит текущую попытку и сбросит расположение плиток. Пройденные уровни останутся сохранены.", continuePlay: "Продолжить игру", returnStages: "Вернуться к уровням" },
    hi: { start: "खेल शुरू करें", stages: "स्तर", leaveTitle: "इस ब्लूप्रिंट से बाहर जाएँ?", leaveText: "{stage} छोड़ने पर यह प्रयास समाप्त होगा और मौजूदा टाइल व्यवस्था मिट जाएगी। पूरे किए गए स्तर सुरक्षित रहेंगे।", continuePlay: "खेल जारी रखें", returnStages: "स्तरों पर लौटें" },
    ar: { start: "ابدأ اللعبة", stages: "المراحل", leaveTitle: "مغادرة هذا المخطط؟", leaveText: "مغادرة {stage} تنهي هذه المحاولة وتتجاهل ترتيب البلاطات الحالي، بينما تبقى المراحل المكتملة محفوظة.", continuePlay: "متابعة اللعب", returnStages: "العودة إلى المراحل" }
  };

  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const safeStorage = {
    get(key, fallback = "") { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const pathLocale = window.location.pathname.split("/").filter(Boolean).map((value) => localeMap[value] || "").find(Boolean);
  const routeLocale = pathLocale && locales[pathLocale] ? pathLocale : "";

  Object.entries(sharedCopy).forEach(([localeKey, values]) => {
    if (!locales[localeKey]) return;
    locales[localeKey].start = values.start;
    locales[localeKey].stages = values.stages;
  });

  const habitatSets = [
    { name: "blueprint1", hint: "hint1", solution: ["pond", "reed", "nest", "meadow"], rules: [{ key: "ruleTopLeft", a: "pond" }, { key: "ruleTouch", a: "pond", b: "reed" }, { key: "ruleBelow", a: "meadow", b: "reed" }] },
    { name: "blueprint2", hint: "hint2", solution: ["fern", "canopy", "burrow", "stream"], rules: [{ key: "ruleTopLeft", a: "fern" }, { key: "ruleTouch", a: "fern", b: "canopy" }, { key: "ruleBelow", a: "stream", b: "canopy" }] },
    { name: "blueprint3", hint: "hint3", solution: ["lantern", "moss", "dusk", "pool"], rules: [{ key: "ruleTopLeft", a: "lantern" }, { key: "ruleTouch", a: "lantern", b: "moss" }, { key: "ruleBelow", a: "pool", b: "moss" }] }
  ];
  const starts = [[1, 2, 0, 3], [2, 0, 3, 1], [3, 2, 1, 0], [1, 3, 2, 0], [2, 3, 0, 1]];
  const chapterModes = ["open", "adjacent", "diagonal", "anchor", "budget", "master"];
  const modeLabels = {
    en: ["Open exchange", "Neighbour exchange", "Diagonal exchange", "Anchored habitat", "Four-swap budget", "Anchored diagonal mastery"],
    "zh-Hant": ["自由交換", "相鄰交換", "對角交換", "固定棲地", "四次交換限制", "固定對角挑戰"],
    "zh-Hans": ["自由交换", "相邻交换", "对角交换", "固定栖地", "四次交换限制", "固定对角挑战"],
    ja: ["自由交換", "隣接交換", "対角交換", "固定ハビタット", "4回交換制限", "固定対角マスター"],
    ko: ["자유 교환", "인접 교환", "대각선 교환", "고정 서식지", "4회 교환 제한", "고정 대각선 숙련"],
    es: ["Intercambio libre", "Intercambio vecino", "Intercambio diagonal", "Hábitat anclado", "Límite de cuatro intercambios", "Maestría diagonal anclada"],
    "pt-BR": ["Troca livre", "Troca vizinha", "Troca diagonal", "Habitat ancorado", "Limite de quatro trocas", "Mestria diagonal ancorada"],
    fr: ["Échange libre", "Échange voisin", "Échange diagonal", "Habitat ancré", "Limite de quatre échanges", "Maîtrise diagonale ancrée"],
    de: ["Freier Tausch", "Nachbartausch", "Diagonaltausch", "Verankertes Habitat", "Vier-Tausch-Limit", "Verankerte Diagonalmeisterschaft"],
    it: ["Scambio libero", "Scambio adiacente", "Scambio diagonale", "Habitat ancorato", "Limite di quattro scambi", "Maestria diagonale ancorata"],
    ru: ["Свободный обмен", "Соседний обмен", "Диагональный обмен", "Закреплённая среда", "Лимит: четыре обмена", "Закреплённая диагональ"],
    hi: ["स्वतंत्र अदला-बदली", "पड़ोसी अदला-बदली", "तिरछी अदला-बदली", "स्थिर आवास", "चार अदला-बदली सीमा", "स्थिर तिरछी महारत"],
    ar: ["تبديل حر", "تبديل متجاور", "تبديل قطري", "موطن مثبت", "حد أربعة تبديلات", "إتقان قطري مثبت"]
  };
  const plans = Array.from({ length: 30 }, (_, index) => {
    const set = habitatSets[index % habitatSets.length];
    const chapter = Math.floor(index / 5);
    const order = chapter === 2 ? (index % 2 ? [0, 2, 1, 3] : [3, 1, 2, 0]) : chapter === 3 ? starts[0] : chapter === 5 ? [3, 1, 2, 0] : starts[(index + chapter) % starts.length];
    return {
      id: index + 1,
      name: set.name,
      hint: set.hint,
      chapter: chapter + 1,
      checkpoint: (index + 1) % 5 === 0,
      mode: chapterModes[chapter],
      lockedSlot: chapter === 3 ? 3 : chapter === 5 ? 2 : -1,
      maxSwaps: chapter >= 4 ? 4 : 0,
      tiles: order.map((slot) => set.solution[slot]),
      solution: [...set.solution],
      rules: set.rules
    };
  });

  let locale = routeLocale || safeStorage.get("weightPlayLocale", "") || safeStorage.get("weightplay-habitat-blueprint-locale", "") || "en";
  locale = normalizeLocale(locale);
  if (!locales[locale]) locale = "en";
  const savedSolved = safeStorage.get("weightplay-habitat-blueprint-solved-v8", "").split(",").map((value) => value.trim()).filter(Boolean).map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value < plans.length);
  let planIndex = 0;
  let tiles = [];
  let selected = [];
  let swaps = 0;
  let sessionSwaps = 0;
  let solved = new Set(savedSolved);
  let feedback = "";
  let currentScreen = "main";
  let stageController = null;
  let selectedStageIndex = 0;
  let frame = null;
  let leaveModal = null;
  let leaveCovered = [];
  let settlementTimer = 0;
  let settlementDueAt = 0;
  let settlementRemaining = 0;
  let settlementCallback = null;

  const copy = (key, vars = {}) => Object.entries(vars).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, String(value)), (locales[locale] || locales.en)[key] || locales.en[key] || key);
  const tileName = (type) => type ? copy(`tile${type[0].toUpperCase()}${type.slice(1)}`) : "";
  const announce = (name, data = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: `habitat_blueprint_${name}`, plan: planIndex + 1, swaps, ...data }); };
  const bestValue = () => Number(localStorage.getItem("weightplay-habitat-blueprint-best-v1") || 0) || "—";
  const solvedPlan = () => tiles.every((tile, index) => tile === plans[planIndex].solution[index]);
  const highestUnlockedIndex = () => Math.min(plans.length - 1, Math.max(0, solved.size ? Math.max(...solved) + 1 : 0));
  const stageConfig = window.HabitatBlueprintStageConfig({
    plans,
    solved,
    highestUnlockedIndex,
    copy,
    tileName,
    getLocale: () => locale,
  });

  function clearSettlement() {
    if (settlementTimer) clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDueAt = 0;
    settlementRemaining = 0;
    settlementCallback = null;
  }
  function runSettlement() {
    const callback = settlementCallback;
    settlementTimer = 0;
    settlementDueAt = 0;
    settlementRemaining = 0;
    settlementCallback = null;
    callback?.();
  }
  function scheduleSettlement(callback, delay = 320) {
    clearSettlement();
    settlementCallback = callback;
    settlementRemaining = delay;
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }
  function pauseSettlement() {
    if (!settlementTimer) return;
    settlementRemaining = Math.max(0, settlementDueAt - performance.now());
    clearTimeout(settlementTimer);
    settlementTimer = 0;
    settlementDueAt = 0;
  }
  function resumeSettlement() {
    if (!settlementCallback || settlementTimer) return;
    const delay = Math.max(0, settlementRemaining || 0);
    settlementDueAt = performance.now() + delay;
    settlementTimer = window.setTimeout(runSettlement, delay);
  }

  function updateLeaveCopy() {
    if (!leaveModal) return;
    const values = sharedCopy[locale] || sharedCopy.en;
    const stage = `${planIndex + 1}. ${copy(plans[planIndex]?.name || "blueprint1")}`;
    leaveModal.querySelector("#habitatLeaveTitle").textContent = values.leaveTitle;
    leaveModal.querySelector("#habitatLeaveText").textContent = values.leaveText.replaceAll("{stage}", stage);
    leaveModal.querySelector("#habitatLeaveContinue").textContent = values.continuePlay;
    leaveModal.querySelector("#habitatLeaveStage").textContent = values.returnStages;
  }
  function restoreBattleCoverage() {
    leaveCovered.forEach(({ node, inert }) => { node.inert = inert; });
    leaveCovered = [];
    if (leaveModal) leaveModal.hidden = true;
  }
  function closeLeave({ resume = true, focus = true } = {}) {
    restoreBattleCoverage();
    if (resume) resumeSettlement();
    if (focus) $("battleBackBtn")?.focus({ preventScroll: true });
  }
  function openLeave() {
    const battle = $("battleScreen");
    if (!battle || !leaveModal || !leaveModal.hidden) return;
    updateLeaveCopy();
    pauseSettlement();
    leaveCovered = [...battle.children].filter((node) => node !== leaveModal).map((node) => ({ node, inert: Boolean(node.inert) }));
    leaveCovered.forEach(({ node }) => { node.inert = true; });
    leaveModal.hidden = false;
    leaveModal.querySelector("#habitatLeaveContinue")?.focus({ preventScroll: true });
  }
  function ensureLeaveDialog() {
    const battle = $("battleScreen");
    if (!battle) return;
    leaveModal = $("habitatLeaveDialog");
    if (!leaveModal) {
      leaveModal = document.createElement("section");
      leaveModal.id = "habitatLeaveDialog";
      leaveModal.className = "habitat-leave-modal";
      leaveModal.hidden = true;
      leaveModal.setAttribute("role", "dialog");
      leaveModal.setAttribute("aria-modal", "true");
      leaveModal.setAttribute("aria-labelledby", "habitatLeaveTitle");
      leaveModal.setAttribute("aria-describedby", "habitatLeaveText");
      leaveModal.innerHTML = '<div class="habitat-leave-dialog"><h2 id="habitatLeaveTitle"></h2><p id="habitatLeaveText"></p><div class="habitat-leave-actions"><button id="habitatLeaveContinue" class="primary" data-wp-frame-action="primary" type="button"></button><button id="habitatLeaveStage" class="secondary" data-wp-frame-action="secondary" type="button"></button></div></div>';
      battle.appendChild(leaveModal);
    }
    const continueButton = leaveModal.querySelector("#habitatLeaveContinue");
    const leaveButton = leaveModal.querySelector("#habitatLeaveStage");
    continueButton.addEventListener("click", () => closeLeave({ resume: true, focus: true }));
    leaveButton.addEventListener("click", () => {
      closeLeave({ resume: false, focus: false });
      clearSettlement();
      show("stage");
      renderStages();
    });
    leaveModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeave({ resume: true, focus: true });
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [continueButton, leaveButton].filter((button) => !button.disabled);
      if (!focusables.length) return;
      event.preventDefault();
      const index = focusables.indexOf(document.activeElement);
      const next = event.shiftKey ? (index <= 0 ? focusables.length - 1 : index - 1) : (index + 1) % focusables.length;
      focusables[next].focus({ preventScroll: true });
    });
  }

  function syncStageAction() {
    const start = $("stageStartBtn");
    if (!start) return;
    const plan = stageConfig.stage(selectedStageIndex);
    start.disabled = plan.locked;
    start.textContent = `${copy("start")} · ${selectedStageIndex + 1}`;
    $("stageSummary").textContent = `${copy("chapter")} · ${solved.size}/${plans.length}`;
  }
  function renderStages() {
    if (!Number.isInteger(selectedStageIndex)) selectedStageIndex = highestUnlockedIndex();
    if (currentScreen === "stage" && !stageController) {
      if (!window.WeightPlayPlayUI?.mountStage) throw new Error("SHARED_PLAY_UI_MISSING");
      stageController = window.WeightPlayPlayUI.mountStage({
        page: $("stageContent"),
        rail: $("stageList"),
        config: stageConfig,
        selected: selectedStageIndex,
        onSelect: (index) => { selectedStageIndex = index; syncStageAction(); },
        onStart: (index) => startPlan(index, true),
        isActive: () => currentScreen === "stage",
      });
    } else if (stageController) {
      stageController.refresh(selectedStageIndex);
    }
    syncStageAction();
  }

  function show(screen) {
    const previous = currentScreen;
    if (screen === "stage" && previous === "main") selectedStageIndex = highestUnlockedIndex();
    currentScreen = screen;
    const inBattle = screen === "battle" || screen === "result";
    document.querySelectorAll("[data-screen]").forEach((node) => {
      if (node === document.body || node === document.documentElement) return;
      if (node.id === "battleScreen") node.hidden = !inBattle;
      else if (node.id === "resultScreen") node.hidden = screen !== "result";
      else node.hidden = node.dataset.screen !== screen;
    });
    const battleLive = $("battleLive");
    if (battleLive) { battleLive.hidden = screen !== "battle"; battleLive.inert = screen !== "battle"; }
    if ($("resultScreen")) $("resultScreen").hidden = screen !== "result";
    if ($("battleScreen")) $("battleScreen").dataset.battleState = inBattle ? screen : "";
    document.body.dataset.screen = screen === "result" ? "battle" : screen;
    document.body.dataset.battleSubstate = screen === "result" ? "result" : "";
    frame?.activate(inBattle ? "battle" : screen, { covered: screen === "result" });
    const guide = $("gameGuide") || document.querySelector("[data-wp-game-guide],.game-page-info,.game-page-info-static");
    if (guide) guide.hidden = screen !== "main";
    if (screen === "stage") renderStages();
    if (screen === "battle") renderBattle();
    if (screen === "result") renderResult();
    window.dispatchEvent(new CustomEvent("weightplay:shell-sync"));
  }

  function renderStatic() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
    document.querySelectorAll("[data-i18n], [data-copy]").forEach((node) => { node.textContent = copy(node.dataset.i18n || node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    [$("backBtn"), $("stageBackBtn"), $("battleBackBtn")].forEach((button) => button?.setAttribute("aria-label", copy("back") || "Back"));
    $("settingsBtn")?.setAttribute("aria-label", copy("settings"));
    $("closeSettings")?.setAttribute("aria-label", copy("close"));
    $("localeSelect")?.setAttribute("aria-label", copy("language"));
    if ($("localeSelect")) $("localeSelect").value = locale;
    if ($("soundBtn")) {
      const soundEnabled = !Boolean(window.WeightPlayAudio?.isMuted?.());
      $("soundBtn").textContent = soundEnabled ? copy("on") : copy("off");
      $("soundBtn").setAttribute("aria-pressed", String(soundEnabled));
    }
    if ($("best")) $("best").textContent = copy("best", { best: bestValue() });
    renderStages();
    renderBattle();
    renderResult();
    updateLeaveCopy();
  }

  function startPlan(index, fromStage = false) {
    clearSettlement();
    restoreBattleCoverage();
    planIndex = index;
    selectedStageIndex = index;
    syncStageAction();
    tiles = [...plans[index].tiles];
    selected = [];
    swaps = 0;
    feedback = "";
    if (index === 0 || fromStage) sessionSwaps = 0;
    show("battle");
    renderBattle();
    window.WeightPlayAudio?.play?.("game.start");
    announce("start");
  }
  function renderRules() {
    const root = $("rules");
    root.replaceChildren();
    plans[planIndex].rules.forEach((rule) => {
      const item = document.createElement("li");
      item.textContent = copy(rule.key, { a: tileName(rule.a), b: tileName(rule.b) });
      root.appendChild(item);
    });
  }
  function allowedPair(first, second, plan = plans[planIndex]) {
    if (first === plan.lockedSlot || second === plan.lockedSlot) return false;
    const rowGap = Math.abs(Math.floor(first / 2) - Math.floor(second / 2));
    const colGap = Math.abs((first % 2) - (second % 2));
    if (plan.mode === "adjacent") return rowGap + colGap === 1;
    if (plan.mode === "diagonal" || plan.mode === "master") return rowGap === 1 && colGap === 1;
    return true;
  }
  function renderBattle() {
    if (!$("habitatGrid") || currentScreen !== "battle") return;
    const plan = plans[planIndex];
    $("planTitle").textContent = `${planIndex + 1}. ${copy(plan.name)}${plan.checkpoint ? " ★" : ""}`;
    $("progressPill").textContent = `${planIndex + 1} / ${plans.length}`;
    $("prompt").textContent = `${copy("prompt")} · ${(modeLabels[locale] || modeLabels.en)[plan.chapter - 1]}`;
    renderRules();
    $("selection").textContent = selected.length ? copy("selection", { names: selected.map((index) => tileName(tiles[index])).join(locale === "zh-Hant" ? "、" : " + ") }) : copy("selectionPrompt");
    const root = $("habitatGrid");
    root.replaceChildren();
    tiles.forEach((type, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `habitat-tile ${type}${index === plan.lockedSlot ? " locked" : ""}`;
      button.dataset.slot = String(index);
      button.dataset.tile = type;
      button.disabled = index === plan.lockedSlot;
      button.setAttribute("aria-pressed", String(selected.includes(index)));
      button.innerHTML = `<span class="tile-icon" aria-hidden="true">${{ pond: "◈", reed: "⌁", nest: "◌", meadow: "✿", canopy: "♧", stream: "≈", burrow: "⌂", fern: "❧", dusk: "☾", pool: "◇", moss: "❋", lantern: "✦" }[type]}</span><strong>${tileName(type)}</strong><small>${index === plan.lockedSlot ? "🔒 · " : ""}${copy("slot", { count: index + 1 }) === "slot" ? `Slot ${index + 1}` : copy("slot", { count: index + 1 })}</small>`;
      button.addEventListener("click", () => {
        if (selected.includes(index)) selected = selected.filter((item) => item !== index);
        else if (selected.length < 2) selected = [...selected, index];
        else selected = [selected[1], index];
        renderBattle();
      });
      root.appendChild(button);
    });
    $("swapBtn").disabled = selected.length !== 2 || !allowedPair(selected[0], selected[1], plan);
    $("status").textContent = feedback ? copy(feedback) : "";
    $("status").className = feedback === "correct" ? "status good" : feedback === "wrong" ? "status try" : "status";
  }
  function swapSelected() {
    if (selected.length !== 2) return;
    const [first, second] = selected;
    if (!allowedPair(first, second)) return;
    [tiles[first], tiles[second]] = [tiles[second], tiles[first]];
    selected = [];
    swaps += 1;
    sessionSwaps += 1;
    if (plans[planIndex].maxSwaps && swaps > plans[planIndex].maxSwaps && !solvedPlan()) {
      tiles = [...plans[planIndex].tiles];
      swaps = 0;
      feedback = "wrong";
      renderBattle();
      return;
    }
    feedback = solvedPlan() ? "correct" : "wrong";
    announce("swap", { solved: solvedPlan() });
    if (solvedPlan()) {
      solved.add(planIndex);
      safeStorage.set("weightplay-habitat-blueprint-solved-v8", [...solved].sort((a, b) => a - b).join(","));
      renderBattle();
      scheduleSettlement(() => { show("result"); renderResult(); }, 320);
    } else renderBattle();
  }
  function resultCopy(best) {
    return copy("resultText", { count: "__COUNT__", best }).replace(/\b3\b/g, String(plans.length)).replace("__COUNT__", String(solved.size));
  }
  function renderResult() {
    if (!$("resultText")) return;
    const complete = solved.size === plans.length;
    const hasNext = planIndex < plans.length - 1;
    $("resultTitle").textContent = complete ? copy("resultTitle") : copy("resultLevel");
    $("resultText").textContent = resultCopy(bestValue());
    $("resultMapBtn").hidden = false;
    $("nextBtn").hidden = false;
    $("nextBtn").textContent = copy("nextStage");
    $("nextBtn").disabled = !hasNext;
    $("nextBtn").setAttribute("aria-disabled", String(!hasNext));
    $("replayBtn").hidden = false;
    $("replayBtn").disabled = false;
    $("replayBtn").textContent = copy("replay");
    if (complete) {
      const old = Number(localStorage.getItem("weightplay-habitat-blueprint-best-v1") || 0);
      if (!old || sessionSwaps < old) localStorage.setItem("weightplay-habitat-blueprint-best-v1", String(sessionSwaps));
      $("resultText").textContent = resultCopy(Math.min(old || sessionSwaps, sessionSwaps));
    }
  }
  function nextPlan() {
    const nextIndex = planIndex + 1;
    if (nextIndex < plans.length) startPlan(nextIndex);
    else { show("stage"); renderStages(); }
  }

  function bind() {
    $("startBtn")?.addEventListener("click", () => show("stage"));
    $("mapBtn")?.addEventListener("click", () => show("stage"));
    $("stageStartBtn")?.addEventListener("click", () => { if (!stageConfig.stage(selectedStageIndex).locked) startPlan(selectedStageIndex, true); });
    $("resultMapBtn")?.addEventListener("click", () => { clearSettlement(); show("stage"); });
    $("nextBtn")?.addEventListener("click", nextPlan);
    $("replayBtn")?.addEventListener("click", () => startPlan(planIndex));
    $("swapBtn")?.addEventListener("click", swapSelected);
    $("resetBtn")?.addEventListener("click", () => {
      clearSettlement();
      tiles = [...plans[planIndex].tiles];
      selected = [];
      swaps = 0;
      feedback = "";
      renderBattle();
      announce("reset");
    });
    $("stageBackBtn")?.addEventListener("click", () => { clearSettlement(); show("main"); });
    $("battleBackBtn")?.addEventListener("click", () => {
      if (currentScreen === "result") { clearSettlement(); show("stage"); renderStages(); return; }
      if (currentScreen !== "battle") return;
      if (swaps > 0 || settlementCallback) openLeave();
      else { clearSettlement(); show("stage"); renderStages(); }
    });
    $("localeSelect")?.addEventListener("change", (event) => {
      locale = normalizeLocale(event.target.value);
      safeStorage.set("weightPlayLocale", locale);
      safeStorage.set("weightplay-habitat-blueprint-locale", locale);
      renderStatic();
      announce("locale", { locale });
    });
  }
  function enforceRouteLocale() {
    if (routeLocale && routeLocale !== locale) { locale = routeLocale; renderStatic(); }
  }
  function markSharedEntryReady() {
    const ready = () => window.WeightPlayGameEntryLoader?.ready?.();
    if (window.WeightPlayGameEntryLoader) {
      requestAnimationFrame(ready);
      return;
    }
    const script = document.querySelector('script[src*="/src/game-entry-loader.js"]');
    if (script) script.addEventListener("load", () => requestAnimationFrame(ready), { once: true });
  }
  function boot() {
    $("app").hidden = false;
    frame = window.mountHabitatBlueprintFrame();
    ensureLeaveDialog();
    bind();
    if ($("localeSelect")) $("localeSelect").value = locale;
    $("loading").hidden = true;
    show("main");
    renderStatic();
    enforceRouteLocale();
    markSharedEntryReady();
    announce("loaded");
  }

  window.__HABITAT_BLUEPRINT_TEST__ = {
    plans,
    startPlan,
    allowedPair,
    getState: () => ({ planIndex, tiles: [...tiles], solved: [...solved], swaps, screen: currentScreen, stagePoolSize: $("stageList")?.querySelectorAll(":scope > [data-wp-stage-pool-node]").length || 0 }),
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}());
