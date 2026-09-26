(() => {
  "use strict";
  const slidingArtLink = document.createElement("link");
  slidingArtLink.rel = "stylesheet";
  slidingArtLink.href = "art.css?v=20260921-sliding-15-block-scene-v1";
  document.head.appendChild(slidingArtLink);

  const GAME_VERSION = "v16";
  const LOCALES = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const HINT_EXPLANATION = {
    en: "Tile {tile} touches the empty space, so sliding it is a legal move. You still choose whether to move it.",
    "zh-Hant": "數字 {tile} 緊鄰空位，所以滑入它是合法步。要不要移動，仍由你決定。",
    "zh-Hans": "数字 {tile} 紧邻空位，所以把它滑入是合法步。要不要移动，仍由你决定。",
    ja: "数字 {tile} は空きマスに隣接しているので、動かせる合法手です。動かすかどうかは自分で決めます。",
    ko: "타일 {tile}은 빈칸과 맞닿아 있어 합법적인 이동입니다. 움직일지는 직접 결정하세요.",
    es: "La ficha {tile} toca el hueco, así que es un movimiento legal. Tú decides si moverla.",
    "pt-BR": "A peça {tile} toca o espaço vazio, então é um movimento legal. Você decide se quer movê-la.",
    fr: "La tuile {tile} touche la case vide : son déplacement est légal. C’est vous qui décidez de la déplacer.",
    de: "Kachel {tile} grenzt an die Lücke und kann legal verschoben werden. Du entscheidest, ob du sie bewegst.",
    it: "La tessera {tile} tocca lo spazio vuoto, quindi è una mossa legale. Decidi tu se muoverla.",
    ru: "Плитка {tile} соприкасается с пустым местом, поэтому её можно передвинуть. Решать, двигать ли её, вам.",
    hi: "टाइल {tile} खाली जगह से लगी है, इसलिए यह वैध चाल है। इसे चलाना है या नहीं, आप तय करें।",
    ar: "البلاطة {tile} تلامس المساحة الفارغة، لذا فهذه حركة قانونية. أنت تقرر إن كنت ستحركها."
  };

  const app = window.WPClassicLogic?.mount("sliding-15");

  const LEAVE_COPY = {
    en: ["Leave Stage {stage}?", "Your current board and move count will reset. Cleared stages remain saved."],
    "zh-Hant": ["離開第 {stage} 關？", "目前盤面與步數會重設；已通關的關卡進度仍會保留。"],
    "zh-Hans": ["离开第 {stage} 关？", "当前盘面与步数会重置；已通关的关卡进度仍会保留。"],
    ja: ["ステージ {stage} を離れますか？", "現在の盤面と手数はリセットされます。クリア済みの進行は保存されます。"],
    ko: ["스테이지 {stage}에서 나갈까요?", "현재 보드와 이동 수는 초기화됩니다. 클리어한 진행 상황은 저장됩니다."],
    es: ["¿Salir de la fase {stage}?", "El tablero y el número de movimientos actuales se reiniciarán. Las fases superadas seguirán guardadas."],
    "pt-BR": ["Sair da fase {stage}?", "O tabuleiro e a contagem de movimentos atuais serão reiniciados. As fases concluídas continuarão salvas."],
    fr: ["Quitter l’étape {stage} ?", "Le plateau et le nombre de coups actuels seront réinitialisés. Les étapes réussies restent enregistrées."],
    de: ["Stufe {stage} verlassen?", "Das aktuelle Brett und die Zugzahl werden zurückgesetzt. Abgeschlossene Stufen bleiben gespeichert."],
    it: ["Uscire dalla fase {stage}?", "La griglia e il conteggio delle mosse attuali verranno azzerati. Le fasi completate restano salvate."],
    ru: ["Выйти из этапа {stage}?", "Текущее поле и число ходов будут сброшены. Пройденные этапы останутся сохранены."],
    hi: ["चरण {stage} छोड़ें?", "मौजूदा बोर्ड और चालों की गिनती रीसेट होगी। पूरे किए गए चरण सहेजे रहेंगे।"],
    ar: ["مغادرة المرحلة {stage}؟", "ستُعاد تهيئة اللوحة الحالية وعدد الحركات، بينما تبقى المراحل المكتملة محفوظة."]
  };

  const mainCopy = document.querySelector("#logicMain .main-copy");
  mainCopy?.querySelector(":scope > .logic-kicker")?.remove();
  mainCopy?.querySelector(":scope > h2")?.remove();
  mainCopy?.querySelector(":scope > .logic-facts")?.remove();
  document.querySelector("#logicMain > .logic-guide")?.remove();

  const stageHeader = document.querySelector("#logicStage > header");
  const stageProgress = document.querySelector("#stageProgress");
  const stageSound = document.querySelector("#stageSound");
  if (stageHeader && stageProgress) stageHeader.insertBefore(stageProgress, stageSound || null);
  stageHeader?.querySelector(".logic-kicker")?.remove();
  stageHeader?.querySelector("h1")?.remove();
  [...(stageHeader?.children || [])].forEach(node => {
    if (node.tagName === "DIV" && !node.children.length && !node.textContent.trim()) node.remove();
  });
  stageSound?.remove();
  document.querySelector("#stageBrowseHint")?.remove();

  const battleHeader = document.querySelector("#logicBattle > .logic-battle-header");
  battleHeader?.querySelector("h1")?.remove();
  document.querySelector(".battle-ad-reserve[data-wp-ad-reserve]")?.remove();

  const leaveDialog = document.querySelector("#logicLeave");
  const resultDialog = document.querySelector("#logicResult");
  if (leaveDialog) leaveDialog.dataset.wpBattleSubstate = "leave-confirm";
  if (resultDialog) resultDialog.dataset.wpBattleSubstate = "result";

  const battleWrap = document.querySelector("#logicBattle > .logic-battle-wrap");
  const setLiveBattleInert = inert => {
    if (battleHeader) battleHeader.inert = inert;
    if (battleWrap) battleWrap.inert = inert;
  };
  const visibleActions = dialog => [...dialog.querySelectorAll("button:not([disabled]), [href], select:not([disabled]), [tabindex]:not([tabindex='-1'])")]
    .filter(node => !node.hidden && node.getAttribute("aria-hidden") !== "true");
  const trapFocus = (event, dialog) => {
    if (event.key !== "Tab" || !dialog || dialog.hidden) return false;
    const actions = visibleActions(dialog);
    if (!actions.length) return false;
    const first = actions[0], last = actions[actions.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); return true; }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); return true; }
    return false;
  };
  const applyLeaveCopy = () => {
    if (!leaveDialog) return;
    const key = document.documentElement.lang || "en";
    const [title, body] = LEAVE_COPY[key] || LEAVE_COPY.en;
    const stage = app?.currentStage || 1;
    const fill = value => value.replace("{stage}", String(stage));
    const heading = leaveDialog.querySelector("#logicLeaveTitle");
    const paragraph = leaveDialog.querySelector("p");
    if (heading) heading.textContent = fill(title);
    if (paragraph) paragraph.textContent = fill(body);
  };
  const syncBattleSubstate = () => {
    const leaveOpen = Boolean(leaveDialog && !leaveDialog.hidden);
    const resultOpen = Boolean(resultDialog && !resultDialog.hidden);
    setLiveBattleInert(leaveOpen || resultOpen);
    if (leaveOpen) {
      applyLeaveCopy();
      document.querySelector("#leaveContinue")?.focus({ preventScroll: true });
    } else if (resultOpen) {
      const actions = resultDialog.querySelector(".logic-result-actions");
      const stages = document.querySelector("#resultStages");
      const next = document.querySelector("#resultNext");
      const replay = document.querySelector("#resultReplay");
      if (actions && stages && next && replay) actions.append(stages, next, replay);
      visibleActions(resultDialog)[0]?.focus({ preventScroll: true });
    } else if (app?.battle && !app.battle.hidden) {
      document.querySelector("#battleBack")?.focus({ preventScroll: true });
    }
  };
  if (leaveDialog) new MutationObserver(syncBattleSubstate).observe(leaveDialog, { attributes: true, attributeFilter: ["hidden"] });
  if (resultDialog) new MutationObserver(syncBattleSubstate).observe(resultDialog, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("keydown", event => {
    if (trapFocus(event, leaveDialog) || trapFocus(event, resultDialog)) return;
    if (event.key !== "Escape") return;
    if (leaveDialog && !leaveDialog.hidden) {
      event.preventDefault();
      event.stopPropagation();
      document.querySelector("#leaveContinue")?.click();
      return;
    }
    if (resultDialog && !resultDialog.hidden) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  syncBattleSubstate();

  const hintButton = document.querySelector("#logicHint");
  const status = document.querySelector("#logicStatus");
  const locale = document.documentElement.lang || "en";
  const copy = HINT_EXPLANATION[locale] || HINT_EXPLANATION.en;
  status?.setAttribute("data-runtime-localize", "off");
  const showHintExplanation = () => {
    const board = document.querySelector(".logic-sliding-board");
    const highlighted = board?.querySelector(".logic-cell.is-hint");
    const blank = board?.querySelector(".logic-cell.blank");
    const tile = highlighted?.textContent?.trim();
    if (!highlighted || !blank || !tile || !status) return;
    const cells = [...board.querySelectorAll(".logic-cell")];
    const highlightedIndex = cells.indexOf(highlighted);
    const blankIndex = cells.indexOf(blank);
    if (highlightedIndex < 0 || blankIndex < 0) return;
    const rowDistance = Math.abs(Math.floor(highlightedIndex / 4) - Math.floor(blankIndex / 4));
    const columnDistance = Math.abs((highlightedIndex % 4) - (blankIndex % 4));
    if (rowDistance + columnDistance !== 1) return;
    status.textContent = copy.replace("{tile}", tile);
  };

  hintButton?.addEventListener("click", () => {
    if (typeof queueMicrotask === "function") queueMicrotask(showHintExplanation);
    else Promise.resolve().then(showHintExplanation);
  });

  window.WPSliding15HintAdapter = Object.freeze({
    gameVersion: GAME_VERSION,
    localeCount: LOCALES.length,
  });
})();
