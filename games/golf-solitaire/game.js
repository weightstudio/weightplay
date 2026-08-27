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
  const GOLF_RESULT_ACTION_COPY = {
    en: "Restart keeps this same deal; New Game offers a fresh layout.",
    "zh-Hant": "重新開始會保留同一副牌；新遊戲會提供新的牌局。",
    "zh-Hans": "重新开始会保留同一副牌；新游戏会提供新的牌局。",
    ja: "リスタートは同じ配りを保ち、新しいゲームは別のレイアウトを配ります。",
    ko: "다시 시작은 같은 딜을 유지하고, 새 게임은 새로운 배치를 제공합니다.",
    es: "Reiniciar conserva esta partida; Nueva partida ofrece una disposición nueva.",
    "pt-BR": "Reiniciar mantém esta partida; Novo jogo oferece uma nova disposição.",
    fr: "Recommencer garde cette donne ; une nouvelle partie propose une nouvelle disposition.",
    de: "Neu starten behält diese Partie; Neues Spiel bietet eine neue Anordnung.",
    it: "Ricomincia conserva questa partita; Nuova partita offre una nuova disposizione.",
    ru: "«Начать заново» сохраняет эту раздачу, а «Новая игра» предлагает новую раскладку.",
    hi: "फिर शुरू करें यही बाज़ी रखता है; नया खेल नई व्यवस्था देता है।",
    ar: "إعادة البدء تبقي هذه التوزيعة؛ اللعبة الجديدة تقدم ترتيبًا جديدًا.",
  };
  const GOLF_REPLAY_GOAL_COPY = {
    en: "Next-deal target: reach a {target}-card chain (best: {best}).",
    "zh-Hant": "下一局目標：連出 {target} 張（最佳連鎖：{best} 張）。",
    "zh-Hans": "下一局目标：连出 {target} 张（最佳连锁：{best} 张）。",
    ja: "次の配りの目標：{target}枚連鎖を目指す（ベスト：{best}枚）。",
    ko: "다음 딜 목표: {target}장 연속 달성 (최고 기록: {best}장).",
    es: "Objetivo de la próxima partida: logra una cadena de {target} cartas (mejor: {best}).",
    "pt-BR": "Meta da próxima partida: alcance uma sequência de {target} cartas (melhor: {best}).",
    fr: "Objectif de la prochaine donne : atteindre une chaîne de {target} cartes (record : {best}).",
    de: "Ziel für die nächste Partie: eine {target}-Karten-Kette erreichen (Bestwert: {best}).",
    it: "Obiettivo della prossima partita: raggiungi una catena di {target} carte (record: {best}).",
    ru: "Цель следующей раздачи: собрать цепочку из {target} карт (лучший результат: {best}).",
    hi: "अगली बाज़ी का लक्ष्य: {target} कार्ड की चेन बनाएँ (सर्वश्रेष्ठ: {best})।",
    ar: "هدف التوزيعة التالية: كوّن سلسلة من {target} بطاقة (الأفضل: {best}).",
  };
  const formatReplayGoal = (template, target, best) => template
    .replaceAll("{target}", String(target))
    .replaceAll("{best}", String(best));
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
      if (!view.nodes?.resultText) return;
      const locale = view.locale || document.documentElement.lang || "en";
      if (view.game?.lost) {
        const reason = GOLF_FAILURE_REASON_COPY[locale] || GOLF_FAILURE_REASON_COPY.en;
        view.nodes.resultText.textContent = `${view.nodes.resultText.textContent} ${reason}`;
      }
      if (view.game?.won) {
        const actions = GOLF_RESULT_ACTION_COPY[locale] || GOLF_RESULT_ACTION_COPY.en;
        view.nodes.resultText.textContent = `${view.nodes.resultText.textContent} ${actions}`;
      }
      if (!view.game?.won && !view.game?.lost) return;
      const best = Math.max(0, Number(view.game?.bestCombo) || 0);
      const target = Math.min(35, Math.max(2, best + 1));
      const goal = GOLF_REPLAY_GOAL_COPY[locale] || GOLF_REPLAY_GOAL_COPY.en;
      view.nodes.resultText.textContent = `${view.nodes.resultText.textContent} ${formatReplayGoal(goal, target, best)}`;
    };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
