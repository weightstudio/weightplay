window.WPPopularArcade?.mount("mahjong-solitaire");

(() => {
  const OPEN_RULE_COPY = Object.freeze({
    en: (tile) => `Open means uncovered and free on one side. Try the ${tile} pair.`,
    "zh-Hant": (tile) => `可用牌是上方沒有覆蓋、且至少一側有空位。試試 ${tile} 牌對。`,
    "zh-Hans": (tile) => `可用牌是上方没有覆盖、且至少一侧有空位。试试 ${tile} 牌对。`,
    ja: (tile) => `開いている牌は上に重なりがなく、左右どちらかが空いています。${tile}のペアを試しましょう。`,
    ko: (tile) => `열린 타일은 위에 덮인 타일이 없고 한쪽이 비어 있습니다. ${tile} 쌍을 맞춰 보세요.`,
    es: (tile) => `Una ficha abierta no está cubierta y tiene un lado libre. Prueba el par ${tile}.`,
    "pt-BR": (tile) => `Uma peça aberta não está coberta e tem um lado livre. Tente o par ${tile}.`,
    fr: (tile) => `Une tuile ouverte n’est pas couverte et a un côté libre. Essayez la paire ${tile}.`,
    de: (tile) => `Ein offener Stein ist nicht bedeckt und hat eine freie Seite. Probiere das ${tile}-Paar.`,
    it: (tile) => `Una tessera libera non è coperta e ha un lato libero. Prova la coppia ${tile}.`,
    ru: (tile) => `Открытая плитка не накрыта и имеет свободную сторону. Попробуйте пару ${tile}.`,
    hi: (tile) => `खुली टाइल के ऊपर कोई टाइल नहीं होती और एक तरफ जगह खाली होती है। ${tile} की जोड़ी चुनें।`,
    ar: (tile) => `البلاطة المفتوحة غير مغطاة ولها جانب واحد حر. جرّب زوج ${tile}.`
  });
  const NO_PAIR_COPY = Object.freeze({
    en: "No live pair is available right now.",
    "zh-Hant": "目前找不到可用的配對。",
    "zh-Hans": "目前找不到可用的配对。",
    ja: "現在、選べるペアはありません。",
    ko: "지금은 맞출 수 있는 쌍이 없습니다.",
    es: "No hay un par disponible ahora.",
    "pt-BR": "Não há um par disponível agora.",
    fr: "Aucune paire disponible pour le moment.",
    de: "Momentan ist kein passendes Paar verfügbar.",
    it: "Al momento non c'è alcuna coppia disponibile.",
    ru: "Сейчас нет доступной пары.",
    hi: "अभी कोई उपलब्ध जोड़ी नहीं है।",
    ar: "لا يوجد زوج متاح الآن."
  });

  const localeKey = () => {
    const current = document.documentElement.lang || "en";
    return OPEN_RULE_COPY[current] ? current : "en";
  };

  let hintVisible = false;
  const message = () => document.querySelector("#gameMessage");
  const livePair = () => {
    const counts = new Map();
    document.querySelectorAll("#board [data-action=tile]").forEach((tile) => {
      const symbol = String(tile.textContent || "").trim();
      if (symbol) counts.set(symbol, (counts.get(symbol) || 0) + 1);
    });
    return [...counts.entries()].find(([, count]) => count >= 2)?.[0] || "";
  };
  const showOpenRule = () => {
    const node = message();
    if (!node || document.body.dataset.screen !== "battle") return;
    const locale = localeKey();
    const symbol = livePair();
    node.textContent = symbol ? OPEN_RULE_COPY[locale](symbol) : NO_PAIR_COPY[locale];
    node.dataset.tone = "warn";
    node.dataset.mahjongOpenRule = "true";
    node.dataset.mahjongHintSymbol = symbol;
  };
  const clearOpenRule = () => {
    hintVisible = false;
    const node = message();
    if (node) {
      delete node.dataset.mahjongOpenRule;
      delete node.dataset.mahjongHintSymbol;
    }
  };
  const bind = () => {
    const hint = document.querySelector("#hintBtn");
    if (hint && !hint.dataset.mahjongOpenRuleBound) {
      hint.dataset.mahjongOpenRuleBound = "true";
      hint.addEventListener("click", () => {
        hintVisible = true;
        window.requestAnimationFrame(showOpenRule);
      });
    }
    const board = document.querySelector("#board");
    if (board && !board.dataset.mahjongOpenRuleActionBound) {
      board.dataset.mahjongOpenRuleActionBound = "true";
      board.addEventListener("click", (event) => {
        if (event.target.closest("[data-action=tile]")) clearOpenRule();
      });
    }
    ["#startBtn", "#retryBtn", "#restartBtn", "#homeBtn"].forEach((selector) => {
      const button = document.querySelector(selector);
      if (button && !button.dataset.mahjongOpenRuleResetBound) {
        button.dataset.mahjongOpenRuleResetBound = "true";
        button.addEventListener("click", clearOpenRule);
      }
    });
  };

  bind();
  new MutationObserver(bind).observe(document.body, { childList: true, subtree: true });
  new MutationObserver(() => {
    if (hintVisible) window.requestAnimationFrame(showOpenRule);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
