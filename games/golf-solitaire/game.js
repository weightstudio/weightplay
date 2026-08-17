(function () {
  "use strict";
  const GOLF_FAILURE_REASON_COPY = {
    en: "No exposed card fits the waste, and the Stock is empty. Restart keeps this deal; New Game offers a fresh layout.",
    "zh-Hant": "沒有可接在棄牌區上的明牌，牌庫也已空。重新開始保留這副牌；新遊戲會提供新的牌局。",
    "zh-Hans": "没有可接在弃牌区上的明牌，牌库也已空。重新开始保留这副牌；新游戏会提供新的牌局。",
    ja: "捨て札につなげられる場札がなく、山札も空です。リスタートならこの配り直しを再挑戦し、新しいゲームなら別の配り方を試せます。",
    ko: "버린 카드에 이을 수 있는 공개 카드가 없고 덱도 비었습니다. 다시 시작은 이 판을 재도전하고, 새 게임은 새로운 배치를 제공합니다.",
    es: "No queda ninguna carta expuesta que encaje con el descarte y el mazo está vacío. Reiniciar conserva esta partida; Nueva partida ofrece una disposición nueva.",
    "pt-BR": "Não há carta exposta que combine com o descarte, e o monte está vazio. Reiniciar mantém esta partida; Novo jogo oferece uma nova disposição.",
    fr: "Aucune carte exposée ne peut suivre la défausse et la pioche est vide. Recommencer garde cette donne ; une nouvelle partie propose une nouvelle disposition.",
    de: "Keine offene Karte passt zur Ablage und der Stapel ist leer. Neu starten behält diese Partie; Neues Spiel bietet eine neue Anordnung.",
    it: "Nessuna carta scoperta può seguire gli scarti e il tallone è vuoto. Ricomincia conserva questa partita; Nuova partita offre una nuova disposizione.",
    ru: "Нет открытой карты, которую можно положить на сброс, и колода пуста. «Начать заново» сохранит эту раздачу, а «Новая игра» предложит новую раскладку.",
    hi: "कोई खुला कार्ड फेंकी गई गड्डी पर नहीं जा सकता और डेक खाली है। फिर शुरू करें यही बाज़ी दोहराता है; नया खेल नई व्यवस्था देता है।",
    ar: "لا توجد بطاقة مكشوفة تناسب المهملات، والرزمة فارغة. إعادة البدء تبقي هذه التوزيعة؛ اللعبة الجديدة تقدم ترتيبًا جديدًا.",
  };
  const mount = () => {
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "golf", id: "golf-solitaire" });
    if (!view || typeof view.showResult !== "function") return;
    const showResult = view.showResult.bind(view);
    view.showResult = () => {
      showResult();
      if (!view.game?.lost || !view.nodes?.resultText) return;
      const locale = view.locale || document.documentElement.lang || "en";
      const reason = GOLF_FAILURE_REASON_COPY[locale] || GOLF_FAILURE_REASON_COPY.en;
      view.nodes.resultText.textContent = `${view.nodes.resultText.textContent} ${reason}`;
    };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
