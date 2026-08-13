window.WPPopularArcade?.mount("mahjong-solitaire");

(() => {
  const OPEN_RULE_COPY = Object.freeze({
    en: "Open means uncovered and free on one side. Try the A pair.",
    "zh-Hant": "可用牌是上方沒有覆蓋、且至少一側有空位。試試 A 牌對。",
    "zh-Hans": "可用牌是上方没有覆盖、且至少一侧有空位。试试 A 牌对。",
    ja: "開いている牌は上に重なりがなく、左右どちらかが空いています。Aのペアを試しましょう。",
    ko: "열린 타일은 위에 덮인 타일이 없고 한쪽이 비어 있습니다. A 쌍을 맞춰 보세요.",
    es: "Una ficha abierta no está cubierta y tiene un lado libre. Prueba el par A.",
    "pt-BR": "Uma peça aberta não está coberta e tem um lado livre. Tente o par A.",
    fr: "Une tuile ouverte n’est pas couverte et a un côté libre. Essayez la paire A.",
    de: "Ein offener Stein ist nicht bedeckt und hat eine freie Seite. Probiere das A-Paar.",
    it: "Una tessera libera non è coperta e ha un lato libero. Prova la coppia A.",
    ru: "Открытая плитка не накрыта и имеет свободную сторону. Попробуйте пару A.",
    hi: "खुली टाइल के ऊपर कोई टाइल नहीं होती और एक तरफ जगह खाली होती है। A की जोड़ी चुनें।",
    ar: "البلاطة المفتوحة غير مغطاة ولها جانب واحد حر. جرّب زوج A."
  });

  const localeKey = () => {
    const current = document.documentElement.lang || "en";
    return OPEN_RULE_COPY[current] ? current : "en";
  };

  let hintVisible = false;
  const message = () => document.querySelector("#gameMessage");
  const showOpenRule = () => {
    const node = message();
    if (!node || document.body.dataset.screen !== "battle") return;
    node.textContent = OPEN_RULE_COPY[localeKey()];
    node.dataset.tone = "warn";
    node.dataset.mahjongOpenRule = "true";
  };
  const clearOpenRule = () => {
    hintVisible = false;
    const node = message();
    if (node) delete node.dataset.mahjongOpenRule;
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
