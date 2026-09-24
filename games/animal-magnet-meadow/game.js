(function () {
  "use strict";

  const localeMap = window.MAGNET_MEADOW_LOCALES || {};
  const localeList = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const interfaceCopy = {
    en: { start: "Start Game", stages: "Stages", next: "Next Stage", replay: "Replay", leaveTitle: "Leave Stage {stage}?", leaveText: "You will lose the current moonstone positions and {moves} move(s). Completed stages stay saved.", continue: "Continue playing", returnStages: "Return to Stages" },
    "zh-Hant": { start: "開始遊戲", stages: "關卡", next: "下一關", replay: "重玩", leaveTitle: "離開第 {stage} 關？", leaveText: "目前的月石位置與 {moves} 次移動會被捨棄；已完成的關卡仍會保留。", continue: "繼續遊玩", returnStages: "返回關卡" },
    "zh-Hans": { start: "开始游戏", stages: "关卡", next: "下一关", replay: "重玩", leaveTitle: "离开第 {stage} 关？", leaveText: "当前月石位置与 {moves} 次移动会被丢弃；已完成的关卡仍会保留。", continue: "继续游玩", returnStages: "返回关卡" },
    ja: { start: "ゲーム開始", stages: "ステージ", next: "次のステージ", replay: "リプレイ", leaveTitle: "ステージ {stage} を終了しますか？", leaveText: "現在の月石配置と {moves} 回の移動は破棄されます。クリア済みステージは保存されます。", continue: "プレイを続ける", returnStages: "ステージへ戻る" },
    ko: { start: "게임 시작", stages: "스테이지", next: "다음 스테이지", replay: "다시 하기", leaveTitle: "스테이지 {stage}에서 나갈까요?", leaveText: "현재 달돌 위치와 {moves}번의 이동은 사라집니다. 완료한 스테이지는 저장됩니다.", continue: "계속 플레이", returnStages: "스테이지로 돌아가기" },
    es: { start: "Iniciar juego", stages: "Etapas", next: "Siguiente etapa", replay: "Repetir", leaveTitle: "¿Salir de la etapa {stage}?", leaveText: "Perderás las posiciones actuales y {moves} movimiento(s). Las etapas completadas seguirán guardadas.", continue: "Seguir jugando", returnStages: "Volver a Etapas" },
    "pt-BR": { start: "Iniciar jogo", stages: "Fases", next: "Próxima fase", replay: "Repetir", leaveTitle: "Sair da fase {stage}?", leaveText: "As posições atuais e {moves} movimento(s) serão descartados. As fases concluídas continuam salvas.", continue: "Continuar jogando", returnStages: "Voltar às fases" },
    fr: { start: "Commencer", stages: "Niveaux", next: "Niveau suivant", replay: "Rejouer", leaveTitle: "Quitter le niveau {stage} ?", leaveText: "Les positions actuelles et {moves} déplacement(s) seront perdus. Les niveaux terminés restent enregistrés.", continue: "Continuer à jouer", returnStages: "Retour aux niveaux" },
    de: { start: "Spiel starten", stages: "Stufen", next: "Nächste Stufe", replay: "Wiederholen", leaveTitle: "Stufe {stage} verlassen?", leaveText: "Aktuelle Mondstein-Positionen und {moves} Zug/Züge gehen verloren. Abgeschlossene Stufen bleiben gespeichert.", continue: "Weiterspielen", returnStages: "Zu den Stufen" },
    it: { start: "Avvia gioco", stages: "Livelli", next: "Livello successivo", replay: "Rigioca", leaveTitle: "Uscire dal livello {stage}?", leaveText: "Le posizioni attuali e {moves} mossa/e verranno perse. I livelli completati restano salvati.", continue: "Continua a giocare", returnStages: "Torna ai livelli" },
    ru: { start: "Начать игру", stages: "Уровни", next: "Следующий уровень", replay: "Повторить", leaveTitle: "Покинуть уровень {stage}?", leaveText: "Текущие позиции и {moves} ход(а/ов) будут сброшены. Пройденные уровни сохранятся.", continue: "Продолжить игру", returnStages: "К уровням" },
    hi: { start: "खेल शुरू करें", stages: "चरण", next: "अगला चरण", replay: "फिर खेलें", leaveTitle: "चरण {stage} छोड़ें?", leaveText: "मौजूदा चंद्र-पत्थर स्थिति और {moves} चाल मिट जाएँगी। पूरे किए चरण सुरक्षित रहेंगे।", continue: "खेल जारी रखें", returnStages: "चरणों पर लौटें" },
    ar: { start: "ابدأ اللعب", stages: "المراحل", next: "المرحلة التالية", replay: "إعادة اللعب", leaveTitle: "مغادرة المرحلة {stage}؟", leaveText: "ستُفقد مواقع أحجار القمر الحالية و{moves} حركة/حركات، بينما تبقى المراحل المكتملة محفوظة.", continue: "متابعة اللعب", returnStages: "العودة إلى المراحل" }
  };

  Object.entries(interfaceCopy).forEach(([locale, values]) => {
    const dictionary = localeMap[locale];
    if (!dictionary) return;
    dictionary.start = values.start;
    dictionary.stages = values.stages;
    dictionary.next = values.next;
    dictionary.replay = values.replay;
  });

  // Thirty authored boards remain data, not thirty retained Stage nodes.
  const rounds = [
    { arc: 1, checkpoint: false, title: "First pull", hint: "Pull one linked pair into place.", mechanic: "basic pull", relation: "pull", boardSize: 6, stones: ["a", "b"], initial: { a: 0, b: 4 }, target: { a: 1, b: 5 } },
    { arc: 1, checkpoint: false, title: "Quiet push", hint: "Push the partner away from the moving stone.", mechanic: "basic push", relation: "push", boardSize: 6, stones: ["a", "b"], initial: { a: 4, b: 2 }, target: { a: 5, b: 1 } },
    { arc: 1, checkpoint: false, title: "Two-step pull", hint: "Plan two pulls before checking the pair.", mechanic: "two-step pull", relation: "pull", boardSize: 6, stones: ["a", "b"], initial: { a: 0, b: 3 }, target: { a: 2, b: 5 } },
    { arc: 1, checkpoint: false, title: "Long meadow", hint: "A longer board gives the pair more room to settle.", mechanic: "long board", relation: "pull", boardSize: 7, stones: ["a", "b"], initial: { a: 1, b: 4 }, target: { a: 3, b: 6 } },
    { arc: 1, checkpoint: true, title: "First checkpoint", hint: "Use one push to land both stones cleanly.", mechanic: "checkpoint push", relation: "push", boardSize: 7, stones: ["a", "b"], initial: { a: 5, b: 2 }, target: { a: 6, b: 1 } },
    { arc: 2, checkpoint: false, title: "Polarity dawn", hint: "The first move pulls; the next move will push.", mechanic: "polarity flip", relation: "flip", boardSize: 7, stones: ["a", "b"], initial: { a: 0, b: 5 }, target: { a: 1, b: 6 } },
    { arc: 2, checkpoint: false, title: "Read the phase", hint: "The phase is pull on the first move.", mechanic: "polarity phase", relation: "flip", boardSize: 7, stones: ["a", "b"], initial: { a: 4, b: 2 }, target: { a: 5, b: 3 } },
    { arc: 2, checkpoint: false, title: "Return phase", hint: "Two moves make the link change direction.", mechanic: "phase reversal", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 0, b: 6 }, target: { a: 2, b: 6 } },
    { arc: 2, checkpoint: false, title: "Edge reversal", hint: "A pull toward the left edge can still be useful.", mechanic: "edge reversal", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 5, b: 1 }, target: { a: 4, b: 0 } },
    { arc: 2, checkpoint: true, title: "Phase checkpoint", hint: "Use the phase change to finish the long move.", mechanic: "checkpoint flip", relation: "flip", boardSize: 8, stones: ["a", "b"], initial: { a: 1, b: 5 }, target: { a: 4, b: 5 } },
    { arc: 3, checkpoint: false, title: "Anchored partner", hint: "The anchored moonstone never moves.", mechanic: "fixed anchor", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["b"], initial: { a: 0, b: 5 }, target: { a: 2, b: 5 } },
    { arc: 3, checkpoint: false, title: "Anchored lead", hint: "Move the free stone around the fixed lead.", mechanic: "fixed anchor", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["a"], initial: { a: 1, b: 5 }, target: { a: 1, b: 3 } },
    { arc: 3, checkpoint: false, title: "Anchor turn", hint: "Pull the free stone back beside its anchor.", mechanic: "anchor turn", relation: "pull", boardSize: 7, stones: ["a", "b"], anchors: ["b"], initial: { a: 4, b: 2 }, target: { a: 1, b: 2 } },
    { arc: 3, checkpoint: false, title: "Wide anchor", hint: "Use the wider board without disturbing the anchor.", mechanic: "wide anchor", relation: "pull", boardSize: 8, stones: ["a", "b"], anchors: ["a"], initial: { a: 6, b: 1 }, target: { a: 6, b: 4 } },
    { arc: 3, checkpoint: true, title: "Anchor checkpoint", hint: "Keep the anchor safe through a careful pull.", mechanic: "checkpoint anchor", relation: "pull", boardSize: 8, stones: ["a", "b"], anchors: ["b"], initial: { a: 0, b: 4 }, target: { a: 3, b: 4 } },
    { arc: 4, checkpoint: false, title: "Quiet obstacle", hint: "The blocked dock cannot receive a moonstone.", mechanic: "blocked dock", relation: "pull", boardSize: 7, stones: ["a", "b"], blocked: [2], initial: { a: 0, b: 4 }, target: { a: 1, b: 5 } },
    { arc: 4, checkpoint: false, title: "Twin barriers", hint: "Read the open route before making a push.", mechanic: "twin barriers", relation: "push", boardSize: 8, stones: ["a", "b"], blocked: [3, 4], initial: { a: 6, b: 1 }, target: { a: 7, b: 0 } },
    { arc: 4, checkpoint: false, title: "Crossing gap", hint: "The middle gap is blocked; the next dock remains open.", mechanic: "crossing gap", relation: "pull", boardSize: 8, stones: ["a", "b"], blocked: [1, 4], initial: { a: 2, b: 6 }, target: { a: 3, b: 7 } },
    { arc: 4, checkpoint: false, title: "Edge shelter", hint: "Avoid the shelter dock while pulling toward the edge.", mechanic: "edge shelter", relation: "pull", boardSize: 7, stones: ["a", "b"], blocked: [5], initial: { a: 0, b: 3 }, target: { a: 1, b: 4 } },
    { arc: 4, checkpoint: true, title: "Obstacle checkpoint", hint: "A clean push completes the barrier arc.", mechanic: "checkpoint obstacle", relation: "push", boardSize: 8, stones: ["a", "b"], blocked: [2, 5], initial: { a: 6, b: 1 }, target: { a: 7, b: 0 } },
    { arc: 5, checkpoint: false, title: "Three-stone pull", hint: "The second and third stones follow at different distances.", mechanic: "chain pull", relation: "pull", boardSize: 6, stones: ["a", "b", "c"], initial: { a: 0, b: 2, c: 4 }, target: { a: 1, b: 3, c: 5 } },
    { arc: 5, checkpoint: false, title: "Three-stone push", hint: "A push sends the chain in the opposite direction.", mechanic: "chain push", relation: "push", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 5, b: 3, c: 1 }, target: { a: 6, b: 2, c: 0 } },
    { arc: 5, checkpoint: false, title: "Short chain", hint: "Keep the three stones separated while pulling.", mechanic: "short chain", relation: "pull", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 0, b: 1, c: 2 }, target: { a: 1, b: 2, c: 4 } },
    { arc: 5, checkpoint: false, title: "Long chain", hint: "A push moves the far stone two docks at once.", mechanic: "long chain", relation: "push", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 5, b: 4, c: 2 }, target: { a: 6, b: 3, c: 0 } },
    { arc: 5, checkpoint: true, title: "Chain checkpoint", hint: "One careful pull aligns the full three-stone chain.", mechanic: "checkpoint chain", relation: "pull", boardSize: 7, stones: ["a", "b", "c"], initial: { a: 1, b: 3, c: 5 }, target: { a: 2, b: 4, c: 6 } },
    { arc: 6, checkpoint: false, title: "Blocked phase", hint: "The polarity changes while the blocked dock stays closed.", mechanic: "flip plus obstacle", relation: "flip", boardSize: 8, stones: ["a", "b"], blocked: [3], initial: { a: 0, b: 5 }, target: { a: 1, b: 6 } },
    { arc: 6, checkpoint: false, title: "Anchored chain", hint: "Only the free stones respond; the anchor stays fixed.", mechanic: "flip plus anchor", relation: "flip", boardSize: 8, stones: ["a", "b", "c"], anchors: ["c"], initial: { a: 0, b: 2, c: 6 }, target: { a: 1, b: 3, c: 6 } },
    { arc: 6, checkpoint: false, title: "Chain barrier", hint: "Move the chain without landing on either barrier.", mechanic: "push plus barriers", relation: "push", boardSize: 8, stones: ["a", "b", "c"], blocked: [1, 7], initial: { a: 5, b: 4, c: 2 }, target: { a: 6, b: 3, c: 0 } },
    { arc: 6, checkpoint: false, title: "Anchored phase", hint: "The free stone follows the current polarity around its anchor.", mechanic: "flip plus anchor", relation: "flip", boardSize: 8, stones: ["a", "b"], anchors: ["b"], initial: { a: 1, b: 5 }, target: { a: 2, b: 5 } },
    { arc: 6, checkpoint: true, title: "Meadow finale", hint: "One final pull settles the three-stone meadow pattern.", mechanic: "final chain", relation: "flip", boardSize: 9, stones: ["a", "b", "c"], blocked: [3, 6], initial: { a: 0, b: 1, c: 2 }, target: { a: 1, b: 2, c: 4 } }
  ];

  const firstRound = rounds[0];
  const state = {
    locale: "en", screen: "main", round: 0, positions: { ...firstRound.initial }, moves: 0,
    completed: [], selected: "a", statusKey: "ready", statusStone: null, sound: true, drag: null,
    resultActive: false
  };
  const bestKey = "weightplay-animal-magnet-meadow-best-v9";
  const $ = (id) => document.getElementById(id);
  const safeGet = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_error) {} };
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  const copy = (key, vars = {}) => {
    const dictionary = localeMap[state.locale] || localeMap.en || {};
    let value = dictionary[key] || (localeMap.en && localeMap.en[key]) || key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement));
    });
    return value;
  };
  const ui = (key, vars = {}) => {
    const dictionary = interfaceCopy[state.locale] || interfaceCopy.en;
    let value = dictionary[key] || interfaceCopy.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement));
    });
    return value;
  };
  const currentRound = () => rounds[state.round];
  const boardSize = (round = currentRound()) => round.boardSize || 6;
  const stoneIds = (round = currentRound()) => round.stones || Object.keys(round.initial);
  const anchors = (round = currentRound()) => round.anchors || [];
  const blocked = (round = currentRound()) => round.blocked || [];
  const bestTotal = () => Number(safeGet(bestKey, "0")) || 0;
  const samePosition = (first, second) => Object.keys(second).every((key) => first[key] === second[key]);
  const stageUnlocked = (index) => index === 0 || state.completed.includes(index - 1);
  const highestUnlocked = () => {
    let index = 0;
    for (let candidate = 1; candidate < rounds.length; candidate += 1) {
      if (!stageUnlocked(candidate)) break;
      index = candidate;
    }
    return index;
  };
  const roundTitle = (index) => {
    const round = rounds[index];
    const key = "roundTitle" + (index + 1);
    const localized = copy(key);
    return localized === key ? round.title : localized;
  };
  const roundHint = (index) => {
    const round = rounds[index];
    const key = "stageHint" + (index + 1);
    const localized = copy(key);
    return localized === key ? round.hint : localized;
  };

  let stageController = null;
  let stageBrowseIndex = 0;
  let battleDirty = false;
  let leaveOpen = false;
  let focusBeforeLeave = null;
  let leaveLayer = null;

  const battleStatusText = () => state.statusKey === "moved" || state.statusKey === "selectStone"
    ? copy(state.statusKey, { stone: stoneLabel(state.statusStone) })
    : copy(state.statusKey);
  const setBattleStatus = (key, stoneId = null) => {
    state.statusKey = key;
    state.statusStone = stoneId;
    $("battleStatus").textContent = battleStatusText();
  };

  const normalizeLegacyChrome = () => {
    const duplicateTitle = document.querySelector("#mainScreen .hero-copy > h1");
    if (duplicateTitle) { duplicateTitle.hidden = true; duplicateTitle.setAttribute("aria-hidden", "true"); }
    const mapButton = $("mapBtn");
    if (mapButton) { mapButton.hidden = true; mapButton.setAttribute("aria-hidden", "true"); mapButton.tabIndex = -1; }
    const stageTitle = document.querySelector("#stageScreen .panel-head > h2");
    const stageIntro = document.querySelector("#stageScreen > .stage-canvas > .panel-intro");
    [stageTitle, stageIntro].forEach((node) => { if (node) { node.hidden = true; node.setAttribute("aria-hidden", "true"); } });
    const battleHeading = $("battleHeading");
    if (battleHeading) { battleHeading.hidden = true; battleHeading.setAttribute("aria-hidden", "true"); }
    const battleSound = $("battleSoundBtn");
    if (battleSound) {
      battleSound.hidden = true;
      battleSound.setAttribute("aria-hidden", "true");
      battleSound.tabIndex = -1;
      battleSound.removeAttribute("data-wp-battle-utility");
    }
    const result = $("resultPanel");
    if (result) { result.dataset.wpBattleSubstate = "result"; result.removeAttribute("data-screen"); }
    const resultStages = $("resultMapBtn");
    const resultNext = $("resultPrimaryBtn");
    const resultReplay = $("resultHomeBtn");
    if (resultReplay) resultReplay.dataset.copy = "replay";
    const actions = result?.querySelector(".result-actions");
    if (actions && resultStages && resultNext && resultReplay) actions.append(resultStages, resultNext, resultReplay);
  };

  const bindStageCard = (card, index) => {
    const round = rounds[index];
    const done = state.completed.includes(index);
    const unlocked = stageUnlocked(index);
    card.type = "button";
    card.className = "stage-card" + (done ? " complete" : "") + (round.checkpoint ? " checkpoint" : "");
    card.dataset.stage = String(index);
    card.dataset.wpStageRecommended = index === highestUnlocked() ? "true" : "false";
    card.setAttribute("aria-disabled", String(!unlocked));
    card.setAttribute("aria-label", `${copy("round", { number: index + 1, total: rounds.length })}: ${roundTitle(index)}`);
    card.innerHTML = `<span class="stage-number">${copy("round", { number: index + 1, total: rounds.length })}</span><strong>${copy("arc", { number: round.arc })} · ${roundTitle(index)}</strong><span>${roundHint(index)}</span><b>${done ? copy("completed") : unlocked ? copy("readyStage") : "—"}</b>`;
  };

  const ensureStageController = () => {
    const rail = $("stageList");
    if (!rail || !window.WeightPlayStageV6?.install) return;
    rail.dir = "ltr";
    rail.setAttribute("aria-label", ui("stages"));
    if (!stageController) {
      stageController = window.WeightPlayStageV6.install(rail, {
        total: () => rounds.length,
        poolSize: 9,
        initialIndex: () => stageBrowseIndex,
        bind: bindStageCard,
        activate: (index) => { if (stageUnlocked(index)) startRound(index); },
        onChange: (index) => { stageBrowseIndex = index; }
      });
    } else {
      stageController.refresh?.();
      stageController.center?.(stageBrowseIndex);
    }
  };

  const renderStages = () => {
    if (document.body.dataset.screen !== "stage") return;
    ensureStageController();
  };

  const setResultCoveredState = () => {
    const result = $("resultPanel");
    const header = document.querySelector("#battleScreen .panel-head");
    const panel = $("battlePanel");
    const active = state.screen === "battle" && state.resultActive;
    document.body.classList.toggle("wp-magnet-result-active", active);
    if (header) header.inert = active || leaveOpen;
    if (panel) panel.inert = active || leaveOpen;
    if (result) result.inert = leaveOpen;
  };

  const refreshResult = () => {
    const final = state.round === rounds.length - 1;
    const resultNext = $("resultPrimaryBtn");
    const resultStages = $("resultMapBtn");
    const resultReplay = $("resultHomeBtn");
    if (resultStages) resultStages.textContent = ui("stages");
    if (resultNext) {
      resultNext.textContent = ui("next");
      resultNext.disabled = final;
      resultNext.setAttribute("aria-disabled", String(final));
    }
    if (resultReplay) resultReplay.textContent = ui("replay");
    setResultCoveredState();
  };

  const refreshLeaveCopy = () => {
    if (!leaveLayer) return;
    const title = leaveLayer.querySelector("#magnetLeaveTitle");
    const text = leaveLayer.querySelector("#magnetLeaveText");
    const keep = leaveLayer.querySelector("#magnetLeaveContinue");
    const leave = leaveLayer.querySelector("#magnetLeaveReturn");
    if (title) title.textContent = ui("leaveTitle", { stage: state.round + 1 });
    if (text) text.textContent = ui("leaveText", { moves: state.moves });
    if (keep) keep.textContent = ui("continue");
    if (leave) leave.textContent = ui("returnStages");
  };

  const closeLeave = (restoreFocus = true) => {
    if (!leaveOpen || !leaveLayer) return;
    leaveOpen = false;
    leaveLayer.hidden = true;
    document.body.classList.remove("wp-magnet-leave-open");
    setResultCoveredState();
    if (restoreFocus) $("battleBackBtn")?.focus({ preventScroll: true });
    else if (focusBeforeLeave instanceof HTMLElement && focusBeforeLeave.isConnected) focusBeforeLeave.blur();
    focusBeforeLeave = null;
  };

  const openLeave = () => {
    if (leaveOpen || state.resultActive || !leaveLayer) return;
    state.drag = null;
    renderStones();
    refreshLeaveCopy();
    focusBeforeLeave = document.activeElement;
    leaveOpen = true;
    document.body.classList.add("wp-magnet-leave-open");
    leaveLayer.hidden = false;
    setResultCoveredState();
    leaveLayer.querySelector("#magnetLeaveContinue")?.focus({ preventScroll: true });
  };

  const createLeaveDialog = () => {
    const canvas = $("battlePanel");
    if (!canvas || leaveLayer) return;
    leaveLayer = document.createElement("div");
    leaveLayer.className = "magnet-leave-layer";
    leaveLayer.hidden = true;
    leaveLayer.innerHTML = `<section class="magnet-leave-dialog" role="dialog" aria-modal="true" aria-labelledby="magnetLeaveTitle" aria-describedby="magnetLeaveText"><h2 id="magnetLeaveTitle"></h2><p id="magnetLeaveText"></p><div class="magnet-leave-actions"><button id="magnetLeaveContinue" class="primary-btn" type="button"></button><button id="magnetLeaveReturn" class="secondary-btn" type="button"></button></div></section>`;
    canvas.append(leaveLayer);
    leaveLayer.querySelector("#magnetLeaveContinue")?.addEventListener("click", () => closeLeave(true));
    leaveLayer.querySelector("#magnetLeaveReturn")?.addEventListener("click", () => {
      closeLeave(false);
      battleDirty = false;
      enterStage();
    });
    refreshLeaveCopy();
  };

  const applyText = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", copy(node.dataset.copyAriaLabel)); });
    if ($("soundBtn")) $("soundBtn").textContent = state.sound ? copy("soundOn") : copy("soundOff");
    if ($("mainProgress")) $("mainProgress").textContent = copy("progress", { count: state.completed.length }).replaceAll("/3", "/" + rounds.length);
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle" && !state.resultActive) renderBattle();
    if (state.screen === "battle" && state.resultActive) refreshResult();
    refreshLeaveCopy();
  };

  const setScreen = (screen) => {
    if (leaveOpen) closeLeave(false);
    state.screen = screen;
    document.body.dataset.screen = screen;
    ["main", "stage", "battle"].forEach((name) => {
      const element = $(name + "Screen");
      if (!element) return;
      element.hidden = name !== screen;
      element.classList.toggle("active", name === screen);
    });
    const guide = $("guideScreen");
    if (guide) guide.hidden = screen !== "main";
    if (screen === "main") applyText();
    if (screen === "stage") renderStages();
    if (screen === "battle" && !state.resultActive) renderBattle();
    window.scrollTo(0, 0);
  };

  const enterStage = () => {
    state.resultActive = false;
    stageBrowseIndex = highestUnlocked();
    setScreen("stage");
    stageController?.refresh?.();
    stageController?.center?.(stageBrowseIndex);
  };

  const slotLabel = (index) => copy("slot", { number: index + 1 });
  const stoneLabel = (id) => {
    const key = "stone" + String(id).toUpperCase();
    const localized = copy(key);
    return localized === key ? "Moonstone " + String(id).toUpperCase() : localized;
  };
  const mechanicLabel = (round) => {
    const key = "mechanic_" + round.mechanic.replace(/[^a-z0-9]+/gi, "_");
    const localized = copy(key);
    return localized === key ? round.mechanic : localized;
  };
  const getSlotFromPointer = (event) => {
    const rect = $("magnetTrack").getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 0.999);
    return Math.floor(ratio * boardSize());
  };
  const activeRelation = (round = currentRound()) => round.relation !== "flip" ? round.relation : state.moves % 2 === 0 ? "pull" : "push";
  const validPositionSet = (positions, round = currentRound()) => {
    const values = Object.values(positions);
    return values.every((value) => value >= 0 && value < boardSize(round) && !blocked(round).includes(value)) && new Set(values).size === values.length;
  };

  const commitMove = (id, destination) => {
    if (leaveOpen || state.resultActive) return;
    const round = currentRound();
    const from = state.positions[id];
    if (destination === from) return;
    if (anchors(round).includes(id) || blocked(round).includes(destination)) { setBattleStatus("incorrect"); return; }
    const direction = Math.sign(destination - from);
    const response = activeRelation(round) === "pull" ? direction : -direction;
    const next = { ...state.positions, [id]: destination };
    let chainIndex = 0;
    stoneIds(round).forEach((other) => {
      if (other === id || anchors(round).includes(other)) return;
      chainIndex += 1;
      next[other] = clamp(next[other] + response * chainIndex, 0, boardSize(round) - 1);
    });
    if (!validPositionSet(next, round)) { setBattleStatus("incorrect"); return; }
    state.positions = next;
    state.moves += 1;
    state.selected = id;
    battleDirty = true;
    setBattleStatus("moved", id);
    renderBattle();
  };

  function renderStones() {
    const layer = $("stoneLayer");
    const round = currentRound();
    if (!layer) return;
    layer.innerHTML = stoneIds(round).map((id) => {
      const selected = state.selected === id;
      const position = state.positions[id];
      const left = ((position + 0.5) / boardSize(round)) * 100;
      const fixed = anchors(round).includes(id);
      return `<button class="moonstone stone-${id}${selected ? " selected" : ""}${fixed ? " anchored" : ""}" type="button" data-stone="${id}" style="left:${left}%" aria-label="${stoneLabel(id)}" aria-pressed="${selected}"${fixed ? ' disabled aria-disabled="true"' : ""}><span>${String(id).toUpperCase()}</span></button>`;
    }).join("");
    layer.querySelectorAll("[data-stone]").forEach((stone) => {
      const id = stone.dataset.stone;
      stone.addEventListener("click", () => {
        if (leaveOpen || state.resultActive) return;
        state.selected = id;
        setBattleStatus("selectStone", id);
        renderBattle();
      });
      stone.addEventListener("pointerdown", (event) => {
        if (leaveOpen || state.resultActive) return;
        event.preventDefault();
        state.selected = id;
        state.drag = { id, destination: state.positions[id] };
        stone.setPointerCapture?.(event.pointerId);
        stone.classList.add("dragging");
      });
      stone.addEventListener("pointermove", (event) => {
        if (!state.drag || state.drag.id !== id || leaveOpen) return;
        state.drag.destination = getSlotFromPointer(event);
        stone.style.left = (((state.drag.destination + 0.5) / boardSize()) * 100) + "%";
      });
      stone.addEventListener("pointerup", (event) => {
        if (!state.drag || state.drag.id !== id || leaveOpen) return;
        const destination = state.drag.destination;
        state.drag = null;
        stone.releasePointerCapture?.(event.pointerId);
        commitMove(id, destination);
      });
      stone.addEventListener("pointercancel", () => { state.drag = null; renderStones(); });
    });
  }

  function renderBattle() {
    if (state.resultActive) return;
    const round = currentRound();
    const hintKey = "stageHint" + (state.round + 1);
    const localizedHint = copy(hintKey);
    if ($("roundHint")) $("roundHint").textContent = (localizedHint === hintKey ? round.hint : localizedHint) + " · " + mechanicLabel(round);
    const relation = activeRelation(round);
    if ($("relationBadge")) $("relationBadge").textContent = copy(relation === "pull" ? "relationPull" : "relationPush") + (round.relation === "flip" ? " · " + copy("flip") : "");
    if ($("targetText")) $("targetText").textContent = stoneIds(round).map((id) => String(id).toUpperCase() + (round.target[id] + 1)).join(" · ");
    if ($("moveText")) $("moveText").textContent = copy("move", { count: state.moves });
    if ($("battleStatus")) $("battleStatus").textContent = battleStatusText();
    const slotGrid = $("slotGrid");
    slotGrid.style.gridTemplateColumns = "repeat(" + boardSize(round) + ", minmax(0, 1fr))";
    slotGrid.innerHTML = Array.from({ length: boardSize(round) }, (_, index) => {
      const isBlocked = blocked(round).includes(index);
      return `<button class="slot${isBlocked ? " blocked" : ""}" type="button" data-slot="${index}" aria-label="${slotLabel(index)}"${isBlocked ? ' disabled aria-disabled="true"' : ""}><span>${isBlocked ? "×" : index + 1}</span></button>`;
    }).join("");
    slotGrid.querySelectorAll("[data-slot]").forEach((slot) => slot.addEventListener("click", () => commitMove(state.selected, Number(slot.dataset.slot))));
    $("legend").innerHTML = stoneIds(round).map((id) => `<span class="legend-stone stone-${id}">${stoneLabel(id)}${anchors(round).includes(id) ? " · " + copy("fixed") : ""}</span>`).join("");
    renderStones();
    $("resultPanel").hidden = true;
    $("battlePanel").hidden = false;
    setResultCoveredState();
  }

  const resetRound = () => {
    const round = currentRound();
    state.positions = { ...round.initial };
    state.moves = 0;
    state.selected = stoneIds(round).find((id) => !anchors(round).includes(id)) || stoneIds(round)[0];
    state.resultActive = false;
    battleDirty = false;
    setBattleStatus("ready");
    renderBattle();
  };

  const showResult = () => {
    const final = state.round === rounds.length - 1;
    const total = state.moves;
    const previousBest = bestTotal();
    if (final && (!previousBest || total < previousBest)) safeSet(bestKey, String(total));
    if (!state.completed.includes(state.round)) state.completed.push(state.round);
    state.resultActive = true;
    battleDirty = false;
    $("battlePanel").hidden = true;
    $("resultPanel").hidden = false;
    $("resultHeading").textContent = copy(final ? "finishTitle" : "resultTitle");
    $("resultText").textContent = copy("resultText");
    $("resultStats").textContent = copy("stats", { moves: total, best: copy("best", { count: final ? Math.min(total, previousBest || total) : bestTotal() || copy("noBest") }) });
    $("mainProgress").textContent = copy("progress", { count: state.completed.length }).replaceAll("/3", "/" + rounds.length);
    refreshResult();
  };

  const checkRound = () => {
    if (leaveOpen || state.resultActive) return;
    if (samePosition(state.positions, currentRound().target)) {
      if (!state.completed.includes(state.round)) state.completed.push(state.round);
      setBattleStatus("correct");
      showResult();
      return;
    }
    setBattleStatus("incorrect");
  };

  function startRound(index) {
    if (!stageUnlocked(index) && index !== state.round) return;
    state.round = clamp(index, 0, rounds.length - 1);
    state.positions = { ...rounds[state.round].initial };
    state.moves = 0;
    state.selected = stoneIds(rounds[state.round]).find((id) => !anchors(rounds[state.round]).includes(id)) || stoneIds(rounds[state.round])[0];
    state.drag = null;
    state.resultActive = false;
    battleDirty = false;
    setBattleStatus("ready");
    setScreen("battle");
  }

  const applyLocale = (locale) => {
    state.locale = localeList.includes(locale) && localeMap[locale] ? locale : "en";
    safeSet("weightplay-locale", state.locale);
    document.documentElement.lang = state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    if ($("languageSelect")) $("languageSelect").value = state.locale;
    applyText();
  };

  const bind = () => {
    $("startBtn")?.addEventListener("click", enterStage);
    $("stageBackBtn")?.addEventListener("click", () => setScreen("main"));
    $("battleBackBtn")?.addEventListener("click", (event) => {
      if (state.resultActive) return;
      if (!battleDirty) { enterStage(); return; }
      event.preventDefault();
      openLeave();
    });
    $("checkBtn")?.addEventListener("click", checkRound);
    $("resetBtn")?.addEventListener("click", resetRound);
    $("resultMapBtn")?.addEventListener("click", enterStage);
    $("resultPrimaryBtn")?.addEventListener("click", () => {
      if (state.round >= rounds.length - 1) return;
      startRound(state.round + 1);
    });
    $("resultHomeBtn")?.addEventListener("click", () => startRound(state.round));
    $("soundBtn")?.addEventListener("click", () => {
      state.sound = !state.sound;
      safeSet("weightplay-animal-magnet-meadow-sound", state.sound ? "on" : "off");
      applyText();
    });
    $("languageSelect")?.addEventListener("change", (event) => applyLocale(event.target.value));
    document.addEventListener("keydown", (event) => {
      if (!leaveOpen || !leaveLayer) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeLeave(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [...leaveLayer.querySelectorAll("button:not([disabled])")];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }, true);
  };

  const ensureStageAssets = () => {
    const cssHref = "/src/stage-selector-standard.css?v=20260924-interface7";
    if (![...document.styleSheets].some((sheet) => sheet.href?.includes("stage-selector-standard.css"))) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      link.dataset.wpStageStandard = "7";
      document.head.append(link);
    }
    if (window.WeightPlayStageV6?.install) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="stage-virtualization-standard.js"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "/src/stage-virtualization-standard.js?v=20260924-interface7";
      script.dataset.wpStageStandard = "7";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.body.append(script);
    });
  };

  const init = () => {
    normalizeLegacyChrome();
    createLeaveDialog();
    bind();
    const routeLocale = document.documentElement.lang;
    const savedLocale = localeList.includes(routeLocale) && localeMap[routeLocale]
      ? routeLocale
      : safeGet("weightplay-locale", "en");
    state.sound = safeGet("weightplay-animal-magnet-meadow-sound", "on") !== "off";
    applyLocale(savedLocale);
    resetRound();
    setScreen("main");
  };

  ensureStageAssets().then(init).catch(() => {
    // Keep the game reachable if a shared asset is unavailable, but never
    // construct the old 30-node Stage list. A reload can recover the asset.
    normalizeLegacyChrome();
    const start = $("startBtn");
    if (start) start.disabled = true;
  });
}());
