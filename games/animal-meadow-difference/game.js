(function () {
  "use strict";

  document.body.dataset.wpBattleSettings = "visible";

  const locales = window.MEADOW_FIND_LOCALES;
  const rounds = [
    { base: ["leaf", "droplet", "circle", "triangle", "star", "wave", "diamond", "dot", "crescent"], changedIndex: 4, changedTo: "sun" },
    { base: ["circle", "wave", "leaf", "diamond", "dot", "star", "crescent", "triangle", "droplet"], changedIndex: 7, changedTo: "hex" },
    { base: ["sun", "dot", "diamond", "wave", "leaf", "crescent", "hex", "circle", "triangle"], changedIndex: 2, changedTo: "flower" },
  ];
  const symbols = { leaf: "✦", droplet: "●", circle: "○", triangle: "▲", star: "★", wave: "≈", diamond: "◆", dot: "•", crescent: "☾", sun: "☀", hex: "⬢", flower: "✿" };
  const spritePositions = { leaf: "0%", droplet: "14.2857%", circle: "28.5714%", triangle: "42.8571%", star: "57.1428%", wave: "14.2857%", diamond: "28.5714%", dot: "42.8571%", crescent: "71.4285%", sun: "57.1428%", hex: "42.8571%", flower: "28.5714%" };
  const state = { locale: "en", roundIndex: 0, checks: 0, solved: 0, leaveOpen: false };
  const $ = (id) => document.getElementById(id);
  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) {} },
  };
  const leaveCopy = {
    en: ["Leave this round?", "Your unfinished meadow search will be discarded. Saved best checks stay safe.", "Continue Playing", "Leave Battle"],
    "zh-Hant": ["離開這個回合？", "尚未完成的草地搜尋會被捨棄；已儲存的最佳檢查次數會保留。", "繼續遊玩", "離開戰鬥"],
    "zh-Hans": ["离开这个回合？", "尚未完成的草地搜索会被放弃；已保存的最佳检查次数会保留。", "继续游玩", "离开战斗"],
    ja: ["このラウンドを離れますか？", "未完了の草原探索は破棄されます。保存済みのベスト確認数は残ります。", "プレイを続ける", "バトルを離れる"],
    ko: ["이 라운드를 나갈까요?", "완료하지 않은 초원 탐색은 사라집니다. 저장된 최고 확인 횟수는 유지됩니다.", "계속 플레이", "배틀 나가기"],
    es: ["¿Salir de esta ronda?", "La búsqueda sin terminar se descartará. Tu mejor marca guardada se conservará.", "Seguir jugando", "Salir de la partida"],
    "pt-BR": ["Sair desta rodada?", "A busca inacabada será descartada. Seu melhor resultado salvo será mantido.", "Continuar jogando", "Sair da partida"],
    fr: ["Quitter cette manche ?", "La recherche inachevée sera abandonnée. Ton meilleur score enregistré restera intact.", "Continuer à jouer", "Quitter la partie"],
    de: ["Diese Runde verlassen?", "Die unfertige Wiesensuche wird verworfen. Dein gespeicherter Bestwert bleibt erhalten.", "Weiterspielen", "Runde verlassen"],
    it: ["Uscire da questo round?", "La ricerca incompleta verrà annullata. Il miglior risultato salvato resterà intatto.", "Continua a giocare", "Esci dalla partita"],
    ru: ["Выйти из раунда?", "Незавершённый поиск будет сброшен. Сохранённый лучший результат останется.", "Продолжить игру", "Выйти из боя"],
    hi: ["इस राउंड से बाहर जाएँ?", "अधूरी घासभूमि खोज छोड़ दी जाएगी। सेव किया गया सर्वश्रेष्ठ परिणाम सुरक्षित रहेगा।", "खेल जारी रखें", "बैटल छोड़ें"],
    ar: ["مغادرة هذه الجولة؟", "سيتم تجاهل بحث المرج غير المكتمل، وستبقى أفضل نتيجة محفوظة.", "متابعة اللعب", "مغادرة المعركة"],
  };

  let roundAdvanceTimer = null;
  let pendingAdvance = null;
  let focusBeforeLeave = null;

  function queryLocale() {
    const value = new URLSearchParams(window.location.search).get("lang");
    const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const routeMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
    const persisted = safeStorage.get("weightPlayLocale") || safeStorage.get("weightplayLocale") || safeStorage.get("wp-locale") || safeStorage.get("weightplay-meadow-locale");
    return value && locales[value] ? value : (routeMap[routeSegment] || persisted || "en");
  }

  function t(key, vars = {}) {
    const copy = locales[state.locale] || locales.en;
    let textValue = copy[key] || locales.en[key] || key;
    return textValue.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  function applyLocale() {
    const copy = locales[state.locale] || locales.en;
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale === "zh-Hans" ? "zh-CN" : state.locale;
    document.documentElement.dir = copy.direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    const mainReturn = document.querySelector(".main-return[data-wp-return='main']");
    if (mainReturn) mainReturn.setAttribute("aria-label", t("backToLobby"));
    $("homeFromBattle").setAttribute("aria-label", t("home"));
    $("battleView").setAttribute("aria-label", t("battleTitle"));
    const leave = leaveCopy[state.locale] || leaveCopy.en;
    $("leaveTitle").textContent = leave[0];
    $("leaveBody").textContent = leave[1];
    $("continuePlaying").textContent = leave[2];
    $("leaveBattle").textContent = leave[3];
    if (!$("battleView").hidden && $("resultView").hidden && !state.leaveOpen) renderRound();
  }

  function playTone(cue = "ui.click") {
    return window.WeightPlayAudio?.play(cue);
  }

  function showView(mode) {
    const mainActive = mode === "main";
    const resultActive = mode === "result";
    $("mainScreen").hidden = !mainActive;
    $("battleView").hidden = mainActive;
    $("resultView").hidden = !resultActive;
    $("mainScreen").classList.toggle("is-active", mainActive);
    $("battleView").classList.toggle("is-active", !mainActive);
    $("battleView").classList.toggle("is-result", resultActive);
    $("resultView").classList.toggle("is-active", resultActive);
    document.body.dataset.screen = mainActive ? "main" : "battle";
    window.scrollTo(0, 0);
  }

  function makeTile(token, index, interactive) {
    const node = interactive ? document.createElement("button") : document.createElement("div");
    node.className = "tile";
    node.dataset.index = String(index);
    node.dataset.shape = token;
    if (interactive) node.setAttribute("data-wp-primary-action", "");
    node.setAttribute("aria-label", t("tile", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1, shape: (locales[state.locale].shapeNames || {})[token] || token }));
    const symbol = document.createElement("span");
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = symbols[token];
    symbol.classList.toggle("has-sprite", spritePositions[token] !== undefined);
    if (spritePositions[token] !== undefined) symbol.style.setProperty("--sprite-position", spritePositions[token]);
    node.append(symbol);
    if (interactive) {
      node.type = "button";
      node.addEventListener("click", () => chooseTile(index, node));
    }
    return node;
  }

  function renderRound() {
    const round = rounds[state.roundIndex];
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("instruction").textContent = t("instruction");
    $("beforeGrid").replaceChildren(...round.base.map((token, index) => makeTile(token, index, false)));
    const after = round.base.map((token, index) => index === round.changedIndex ? round.changedTo : token);
    $("afterGrid").replaceChildren(...after.map((token, index) => makeTile(token, index, true)));
    $("checkCountTop").textContent = String(state.checks);
    $("feedback").textContent = "";
    $("feedback").classList.remove("is-wrong");
  }

  function runPendingAdvance() {
    if (state.leaveOpen || !pendingAdvance) return;
    const task = pendingAdvance;
    pendingAdvance = null;
    roundAdvanceTimer = null;
    task();
  }

  function scheduleAdvance(task) {
    pendingAdvance = task;
    if (roundAdvanceTimer) window.clearTimeout(roundAdvanceTimer);
    roundAdvanceTimer = window.setTimeout(runPendingAdvance, 460);
  }

  function chooseTile(index, node) {
    if (state.leaveOpen) return;
    state.checks += 1;
    $("checkCountTop").textContent = String(state.checks);
    const round = rounds[state.roundIndex];
    if (index !== round.changedIndex) {
      node.classList.add("is-wrong");
      $("feedback").textContent = t("wrong", { row: Math.floor(index / 3) + 1, tile: (index % 3) + 1 });
      $("feedback").classList.add("is-wrong");
      playTone("feedback.error");
      window.setTimeout(() => node.classList.remove("is-wrong"), 420);
      return;
    }
    node.classList.add("is-correct");
    node.disabled = true;
    state.solved += 1;
    playTone("feedback.success");
    $("feedback").classList.remove("is-wrong");
    $("feedback").textContent = t("correct");
    $("appStatus").textContent = t("correct");
    scheduleAdvance(() => {
      if (state.roundIndex < rounds.length - 1) {
        state.roundIndex += 1;
        renderRound();
      } else {
        finish();
      }
    });
  }

  function setBattleLayerInert(value) {
    const dialog = $("leaveConfirm");
    Array.from($("battleView").children).forEach((child) => {
      if (child !== dialog) child.inert = value;
    });
  }

  function hasUnfinishedProgress() {
    return state.checks > 0 || state.solved > 0 || state.roundIndex > 0;
  }

  function openLeaveConfirm() {
    if (state.leaveOpen) return;
    state.leaveOpen = true;
    focusBeforeLeave = document.activeElement;
    if (roundAdvanceTimer) {
      window.clearTimeout(roundAdvanceTimer);
      roundAdvanceTimer = null;
    }
    setBattleLayerInert(true);
    $("leaveConfirm").hidden = false;
    $("continuePlaying").focus();
  }

  function closeLeaveConfirm(resumePending = true) {
    if (!state.leaveOpen) return;
    state.leaveOpen = false;
    $("leaveConfirm").hidden = true;
    setBattleLayerInert(false);
    if (resumePending && pendingAdvance) roundAdvanceTimer = window.setTimeout(runPendingAdvance, 120);
    if (focusBeforeLeave && document.contains(focusBeforeLeave)) focusBeforeLeave.focus();
    focusBeforeLeave = null;
  }

  function returnToMain(force = false) {
    if (!force && !$("battleView").hidden && $("resultView").hidden && hasUnfinishedProgress()) {
      openLeaveConfirm();
      return;
    }
    if (roundAdvanceTimer) window.clearTimeout(roundAdvanceTimer);
    roundAdvanceTimer = null;
    pendingAdvance = null;
    if (state.leaveOpen) closeLeaveConfirm(false);
    showView("main");
    applyLocale();
  }

  function confirmLeave() {
    closeLeaveConfirm(false);
    returnToMain(true);
  }

  function trapLeaveKeys(event) {
    if (!state.leaveOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLeaveConfirm(true);
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = [$("continuePlaying"), $("leaveBattle")];
    const current = focusables.indexOf(document.activeElement);
    const next = event.shiftKey ? (current <= 0 ? focusables.length - 1 : current - 1) : (current >= focusables.length - 1 ? 0 : current + 1);
    event.preventDefault();
    focusables[next].focus();
  }

  function start() {
    if (roundAdvanceTimer) window.clearTimeout(roundAdvanceTimer);
    roundAdvanceTimer = null;
    pendingAdvance = null;
    if (state.leaveOpen) closeLeaveConfirm(false);
    state.roundIndex = 0;
    state.checks = 0;
    state.solved = 0;
    showView("battle");
    renderRound();
  }

  function finish() {
    const key = "weightplay-meadow-best-checks";
    const prior = Number(safeStorage.get(key));
    if (!prior || state.checks < prior) safeStorage.set(key, String(state.checks));
    $("resultSummary").textContent = t("summary");
    $("bestCount").textContent = safeStorage.get(key) || String(state.checks);
    showView("result");
  }

  state.locale = queryLocale();
  document.addEventListener("DOMContentLoaded", () => {
    applyLocale();
    $("startButton").addEventListener("click", start);
    $("replayButton").addEventListener("click", start);
    $("homeFromBattle").addEventListener("click", () => returnToMain(false));
    $("homeFromResult").addEventListener("click", () => returnToMain(true));
    $("continuePlaying").addEventListener("click", () => closeLeaveConfirm(true));
    $("leaveBattle").addEventListener("click", confirmLeave);
    $("leaveConfirm").addEventListener("keydown", trapLeaveKeys);
  });

  window.MEADOW_FIND_TEST = { rounds, symbols, start, renderRound };
})();