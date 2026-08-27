(() => {
  "use strict";

  const GAME_VERSION = "v7";
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

  window.WPClassicLogic?.mount("sliding-15");

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
